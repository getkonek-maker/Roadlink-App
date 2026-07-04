# Roadlink Trip Control — Live Operations Implementation Plan

Target: current `main` at commit `7fe998b`. This plan is written for direct implementation, not
discussion — every item names the exact file, function, and acceptance check. Work the phases in
order; each phase is a checkpoint, not optional cleanup.

## Status (updated Jul 4, 2026)

- **Phase 0 — DONE.** `SESSION_SECRET` added to `.env.example` and `render.yaml`.
- **Phase 1 — DONE.** HMAC-signed sessions (`signSession`/`verifySession`), `requireRole` guard on
  every privileged route, `actorName` no longer trusted (identity comes from the session), login
  throttling (5 attempts / 15 min per ip+username), client-side `apiRequest` attaches the bearer
  token, client portal login now goes through the server. Bonus fixes found during implementation:
  empty client-link tokens used to bypass validation (fixed), finance approval now requires manager
  approval first (409 otherwise), reconciliation only allowed on `needs`-status trips.
- **Phase 2 — DONE.** Public `/api/bootstrap` returns only mode flags. New authenticated
  `GET /api/session/bootstrap` scopes by role; clients get only their own company's trips with
  budgets/waybill-financials/timeline stripped and internal fund statuses mapped to client-safe ones.
  New token-gated `GET /api/client-trip` serves the email-link flow.
- **Phase 3 — SQL READY, needs a Supabase project.** Migration at
  `supabase/migrations/0001_init.sql`. Note: columns are quoted **camelCase** (not snake_case as
  originally drafted below) so the existing `tableInsert`/`tableUpdate` PostgREST calls work without
  a key-mapping layer; each table also carries a `created_at timestamptz` for `tableList` ordering.
  `profiles.id` is text (matches server-generated ids) with a nullable `auth_user_id uuid` for the
  Phase 4 Supabase Auth link. Append-only enforcement via REVOKE is included.
- **Phase 4 — TODO** (needs the Supabase project first).
- **Phase 5 — TODO** (Render dashboard: plan upgrade + env vars; `render.yaml` already lists them).
- **Phase 6 — Apps Script READY, needs deployment.** Webhook at
  `google-apps-script/sheets-webhook.gs` with per-tab routing and a shared-secret gate.
- **Phase 7 — Local equivalents all pass** (19-check suite: 401s, 403s, 409 ordering, forged
  actorName ignored, client scoping, token expiry/tamper, throttling). Re-run against the Render URL
  once Supabase is connected.

Grounding facts (verified against the actual repo, not assumed):

- Server is a dependency-free `node:http` app (`server.mjs`), no Express, no npm dependencies at all
  (`package.json` has none). Keep that property unless a phase below says otherwise.
- Browser code (`app.js`) never talks to Supabase directly — every write and read goes through
  `server.mjs`, which always calls Supabase with `SUPABASE_SERVICE_ROLE_KEY`
  (`server.mjs:329-330`). Service-role Postgres connections **bypass Row Level Security** but do
  **not** bypass table-level `GRANT`/`REVOKE`. This distinction drives Phase 3 and Phase 5 below —
  RLS is defense-in-depth here, not the access-control layer; `REVOKE` is the one DB-level control
  that actually binds even through the service key.
- `handleLogin` (`server.mjs:530`) issues `session.accessToken`, but `apiRequest`
  (`app.js:282`) never sends it back on later calls, and no server route ever checks it. Every
  privileged endpoint (`approve-manager`, `approve-finance`, `approve-account`, `budget-items`,
  `reconciliation/update`) currently trusts a free-text `payload.actorName` supplied by the caller.
  There is no authorization boundary today. This is the single blocking issue.
- `GET /api/bootstrap` (`server.mjs:376`, wired at `server.mjs:709`) returns every trip, every
  client's contact/cargo/budget data, every profile (minus password hash), every notification and
  audit event, to an unauthenticated caller. The "clients only see their own bookings" rule is UI-only
  today.
- Passwords: `hashPassword` (`server.mjs:175`) is `sha256(pepper + ":" + password)` — no per-user
  salt, fast hash. Acceptable only as a placeholder for local-demo mode.
- Render is on the **free plan** (`render.yaml:5`): ephemeral filesystem (wipes
  `.data/roadlink-store.json` on every deploy/restart) and cold starts after ~15 min idle.
- The client confirmation/cancellation token check (`server.mjs:571-572`) is already solid: it
  validates a per-trip `clientToken` and checks `clientTokenExpiresAt`. Keep this design, just move
  it into Postgres as-is in Phase 3 — no rework needed there.

---

## Phase 0 — Environment and safety net

1. Add a new required env var `SESSION_SECRET` (32+ random bytes, e.g. `openssl rand -hex 32`) to
   `.env.example`, `.env.local`, and Render env vars. This signs the real session tokens built in
   Phase 1.
2. Add `.data/` and `.env.local` confirmation to `.gitignore` — already present, just confirm before
   any commit in this work.
3. Do not delete `.data/roadlink-store.json` structure — Phase 3 migrates its shape 1:1 into
   Postgres tables, so the seed data in `server.mjs:35-161` is the reference schema.

## Phase 1 — Real session tokens (blocking, do this first)

Goal: replace the decorative `accessToken` with a signed, verifiable session, and make the client
actually send it.

**New functions in `server.mjs`** (co-locate near `hashPassword`):

```js
function signSession(profile) {
  const payload = { sub: profile.id, role: profile.role, iat: Date.now(), exp: Date.now() + 12 * 60 * 60 * 1000 };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", process.env.SESSION_SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

function verifySession(token) {
  if (!token || !token.includes(".")) return null;
  const [body, sig] = token.split(".");
  const expected = createHmac("sha256", process.env.SESSION_SECRET).update(body).digest("base64url");
  if (sig !== expected) return null;
  const payload = JSON.parse(Buffer.from(body, "base64url").toString());
  if (payload.exp < Date.now()) return null;
  return payload;
}
```

Import `createHmac` alongside the existing `createHash, randomBytes` import at `server.mjs:3`.

- In `handleLogin` (`server.mjs:530`), replace both `session.accessToken` assignments
  (the Supabase branch at `:544` and the local branch at `:553`) with `signSession(profile)`. Even
  when Supabase Auth verifies the password, your own server issues the session token used for all
  further authorization — do not try to verify Supabase's own JWT on every request; that adds a
  second trust path for no benefit here since the server already re-derives role from `profiles`.
- Add a `requireAuth` and `requireRole` wrapper used when building the `routes` map in
  `handleRequest` (`server.mjs:715`):

```js
function getBearerToken(request) {
  const header = request.headers.authorization || "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

async function requireRole(request, ...roles) {
  const claims = verifySession(getBearerToken(request));
  if (!claims) return { ok: false, status: 401, message: "Session expired or invalid. Please log in again." };
  const profiles = await tableList("profiles");
  const profile = profiles.find((p) => p.id === claims.sub);
  if (!profile || profile.status !== "active") return { ok: false, status: 401, message: "Account is no longer active." };
  if (roles.length && !roles.includes(profile.role)) return { ok: false, status: 403, message: "Not authorized for this action." };
  return { ok: true, profile: safeProfile(profile) };
}
```

  Re-check `profiles.status` on every call (not just at login) — this is how you get instant
  revocation for suspended staff without a session-revocation table.

- Apply `requireRole` inside each handler that changes state, before doing any work:
  - `/api/waybills/approve-manager` → `requireRole(request, "owner", "admin")`
  - `/api/waybills/approve-finance` → `requireRole(request, "accounting", "admin")`
  - `/api/waybills/submit` → `requireRole(request, "coordinator", "owner", "admin")`
  - `/api/budget-items` → `requireRole(request, "accounting", "admin")`
  - `/api/admin/approve-account` → `requireRole(request, "admin", "owner")`
  - `/api/reconciliation/update` → `requireRole(request, "accounting", "admin")`
  - `/api/trips` (create) → `requireRole(request, "coordinator", "owner", "admin")`
  - `/api/client-action` stays token-based (no session) — it's the public client-facing endpoint,
    already gated by `clientToken` + expiry. Leave that check as-is.
  - `/api/client-portal/booking-request` → `requireRole(request, "client")`
- Once a handler has an authorized `profile`, **stop trusting `payload.actorName`** — use
  `profile.name` and `profile.role` for `actor`/`preparedBy`/`approvedBy` fields instead. This closes
  the actual hole: today anyone can claim to be "Owner / Manager" by putting that string in the
  request body.
- Client side: in `app.js`, update `apiRequest` (`app.js:282`) to attach
  `Authorization: Bearer ${state.session?.accessToken}` automatically when a session exists, instead
  of relying on each call site to pass it. Store `accessToken` in memory/localStorage alongside the
  existing remembered-login data (`app.js:366-382`) — do not put the raw password there, only the
  signed token.
- Add basic login throttling: an in-memory `Map` in `server.mjs` keyed by
  `ip:username`, max 5 attempts per 15 minutes, reset on success. No dependency needed.

**Acceptance check:** calling `POST /api/waybills/approve-finance` with no `Authorization` header
returns 401. Calling it with a coordinator's token returns 403. Calling it with accounting's token
succeeds and the waybill records the accounting user's real name, not whatever the request body said.

## Phase 2 — Scope `/api/bootstrap` by role

- Split the current unauthenticated `GET /api/bootstrap` into two:
  - Keep `/api/bootstrap` public but strip it down to only `{ mode, googleSheets, email }` — no
    trips, profiles, clients, notifications, or audit events. This is what the app needs before
    login.
  - Add `GET /api/session/bootstrap`, gated by `requireRole(request)` (any authenticated role, no
    specific role required), returning role-scoped data:
    - `role === "client"`: only trips where `trip.clientId === profile.clientId` (add `clientId` to
      the trip shape in `normalizeTrip`, `server.mjs:251`, defaulting from the matching row in
      `clients`); only that client's own `booking_requests`; no `budget`, no `waybill` internals, no
      `audit_events`, no other profiles. Strip these fields server-side, don't rely on `app.js` to
      hide them.
    - `role === "coordinator"`: all trips, own notifications, no `account_requests` admin view, no
      full `profiles` list beyond own record.
    - `role in ("owner","admin")`: full access, matching today's demo behavior.
    - `role === "accounting"`: all trips, budget/reconciliation data, no user-management
      (`account_requests`) writes (reads are fine for context).
- Update `app.js`'s `loadServerState` (`app.js:297`) to call `/api/session/bootstrap` once
  `state.session` exists, falling back to the trimmed public `/api/bootstrap` before login.

**Acceptance check:** `curl /api/bootstrap` with no auth returns only mode flags — no trip IDs, no
client names, no phone numbers. A client-role session hitting `/api/session/bootstrap` never
receives another client's trips or any staff-only fields.

## Phase 3 — Supabase schema migration

Create these tables in Supabase (SQL editor or a migration file under a new `supabase/migrations/`
folder — pick whichever your Supabase project setup already uses). Keep `waybill`, `budget`,
`reconciliation`, `timeline` as `jsonb` columns on `trips` to match the existing nested shape in
`normalizeTrip` — don't fully normalize those on this pass, it's not required for correctness and
would force a rewrite of `normalizeTrip`/email templates for no safety benefit.

```sql
create extension if not exists pgcrypto;

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  authorized_contact text,
  email text,
  phone text,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  email text unique not null,
  role text not null check (role in ('admin','owner','coordinator','accounting','client')),
  role_label text,
  company text,
  phone text,
  status text not null default 'active' check (status in ('active','suspended')),
  initials text,
  photo_url text,
  client_id uuid references public.clients(id),
  created_at timestamptz not null default now()
);

create table public.account_requests (
  id text primary key,
  name text not null,
  email text not null,
  role text not null,
  company text,
  phone text,
  status text not null default 'Pending',
  requested_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by uuid references public.profiles(id)
);

create table public.booking_requests (
  id text primary key,
  client_id uuid references public.clients(id),
  company text,
  contact text,
  email text,
  phone text,
  origin text,
  destination text,
  vehicle text,
  date date,
  cargo text,
  status text not null default 'Needs staff review',
  created_at timestamptz not null default now()
);

create table public.trips (
  id text primary key,
  client_id uuid references public.clients(id),
  client text,
  contact text,
  phone text,
  email text,
  route text,
  origin text,
  destination text,
  vehicle text,
  date date,
  cargo text,
  coordinator_id uuid references public.profiles(id),
  coordinator text,
  preferred_channel text,
  status text not null default 'pending',
  cancelled_reason text,
  client_token text not null,
  client_token_expires_at timestamptz not null,
  waybill jsonb not null default '{}',
  budget jsonb not null default '[]',
  reconciliation jsonb not null default '{"cashReturned":false,"chequeVoided":false,"poCancelled":false,"expensesUsed":""}',
  timeline jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.budget_items (
  id text primary key,
  trip_id text not null references public.trips(id),
  type text not null,
  detail text,
  amount numeric not null default 0,
  state text not null default 'Logged',
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

create table public.client_actions (
  id text primary key,
  trip_id text not null references public.trips(id),
  action text not null check (action in ('confirm','cancel','contact')),
  actor_email text,
  reason text,
  created_at timestamptz not null default now()
);

create table public.reconciliation_tasks (
  id text primary key,
  trip_id text not null references public.trips(id),
  status text not null default 'open',
  alert text,
  notes text,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.audit_events (
  id text primary key,
  trip_id text references public.trips(id),
  actor uuid references public.profiles(id),
  actor_name text,
  action text not null,
  detail text,
  created_at timestamptz not null default now()
);

create table public.notifications (
  id text primary key,
  role text,
  profile_id uuid references public.profiles(id),
  trip_id text references public.trips(id),
  title text,
  body text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.sheet_sync_log (
  id text primary key,
  kind text,
  status text,
  message text,
  created_at timestamptz not null default now()
);
```

**Append-only enforcement (this is the one RLS-adjacent control that actually binds through the
service-role key):**

```sql
revoke update, delete on public.audit_events from service_role;
revoke update, delete on public.sheet_sync_log from service_role;
```

`GRANT`/`REVOKE` are ordinary Postgres privileges and apply regardless of RLS bypass. This is the
correct way to make audit records genuinely append-only in this architecture, since the service key
otherwise has full table access.

**RLS — enable on every table, as defense-in-depth against a leaked anon key, not as the primary
gate (the primary gate is Phase 1's `requireRole` in `server.mjs`):**

```sql
alter table public.trips enable row level security;
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.booking_requests enable row level security;
alter table public.budget_items enable row level security;
alter table public.client_actions enable row level security;
alter table public.reconciliation_tasks enable row level security;
alter table public.audit_events enable row level security;
alter table public.notifications enable row level security;
alter table public.account_requests enable row level security;
alter table public.sheet_sync_log enable row level security;
-- No policies granting anon/authenticated access are needed, since the browser never
-- queries Supabase directly. Enabling RLS with zero policies means any future anon-key
-- usage defaults to fully denied, which is the safe default.
```

**Server changes:**
- `tableList`/`tableInsert`/`tableUpdate` (`server.mjs:342-374`) already abstract local-vs-Supabase
  storage — no signature changes needed, they'll work once `SUPABASE_URL` and
  `SUPABASE_SERVICE_ROLE_KEY` are set in Render.
- Update `seedData` (`server.mjs:35`) to only run in local-demo mode; do not auto-seed the
  production Supabase project with `Roadlink-8421`-style demo passwords. Seed production `profiles`
  rows manually after creating the matching `auth.users` entries via Supabase Auth (Phase 5).

**Acceptance check:** with `SUPABASE_URL`/`SUPABASE_SERVICE_ROLE_KEY` set, `GET /api/health` reports
`mode: "supabase"`; creating a trip through the UI produces a row in `public.trips`; restarting the
Render service does not lose any data (proves you're off `.data/roadlink-store.json`).

## Phase 4 — Password and account hardening

- Move real staff/client login entirely onto Supabase Auth (email + password). Update the login UI
  in `app.js` to always collect an email, not a username — the existing Supabase branch in
  `handleLogin` (`server.mjs:535`) only triggers `if (username.includes("@"))`, so once Supabase is
  configured, drop the local username/password path entirely for staff and client roles (keep it only
  as an explicit `local-demo` fallback when Supabase env vars are absent).
- When approving a new account (`handleApproveAccount`, `server.mjs:671`), create the user through
  Supabase Auth's admin API (`POST /auth/v1/admin/users` with the service role key) instead of
  generating a local `passwordHash`. Send the temporary password by email (already has the Resend
  pipe wired) and require a password reset on first login if Supabase Auth supports it in your plan
  tier, or simply mark the account for forced rotation via a `must_reset` boolean column on
  `profiles`.
- Delete `hashPassword`'s use in production paths once Supabase Auth is the only login path; leave it
  only for `local-demo` seed data — do not use `sha256(pepper+password)` for anything with real user
  data.

**Acceptance check:** a new staff account created via `/api/admin/approve-account` can log in with
Supabase Auth using the emailed temporary password, and the local `passwordHash` field is unused for
that account.

## Phase 5 — Render / infra readiness

- Upgrade the Render plan before onboarding real users — free tier's ephemeral disk and cold starts
  are incompatible with "live operations" even after Supabase migration removes the data-loss risk,
  because cold starts still delay client-facing confirmation link opens and Google Sheets webhook
  calls. A starter/standard instance removes both problems.
- Confirm `render.yaml`'s `healthCheckPath: /api/health` stays accurate after Phase 1-2 changes (it
  should remain unauthenticated and cheap — don't add `requireRole` to it).
- Add all seven env vars from `.env.example` plus the new `SESSION_SECRET` to Render's dashboard,
  marked `sync: false` for anything secret (matches the existing pattern for `RESEND_API_KEY` in
  `render.yaml:11`).
- After each deploy: hit `/api/health`, confirm `mode: "supabase"`, and run through one full trip
  lifecycle (create → confirm → waybill submit → manager approve → finance approve → budget log →
  cancel-with-funds → reconciliation) against the live URL before telling Roadlink it's ready.

## Phase 6 — Resend and Google Sheets (no structural changes, just verification)

- Verify a Roadlink-owned sending domain in Resend; replace `ROADLINK_EMAIL_FROM`'s
  `onboarding@resend.dev` default. `sendViaResend` (`server.mjs:509`) and the email templates
  (`server.mjs:439-507`) don't need code changes for this — it's a Resend dashboard + DNS task.
  Confirm by sending a real email to an address outside the Resend test allowlist.
- Build the Google Apps Script webhook referenced by `GOOGLE_SHEETS_WEBHOOK_URL` and
  `syncGoogleSheets` (`server.mjs:421`). It receives `{ kind, payload, sentAt, source }` as JSON POST
  — the webhook only needs to append a row per `kind` to the matching sheet tab (Trips, Waybills,
  Budget Releases, Client Actions, Reconciliation, Audit Export). This is a Google Apps Script task,
  not a `server.mjs` change; the server side already calls it correctly and logs the result into
  `sheet_sync_log`.

## Phase 7 — Test plan (run against the Render production URL, not localhost)

- [ ] Unauthenticated `GET /api/bootstrap` returns no trip/client/profile data.
- [ ] Unauthenticated `POST` to any privileged endpoint (waybill approvals, budget items, account
      approval, reconciliation) returns 401.
- [ ] A coordinator session cannot call `/api/waybills/approve-manager` or `approve-finance` (403).
- [ ] An accounting session cannot call `/api/admin/approve-account` (403).
- [ ] A client session's `/api/session/bootstrap` never contains another company's trips, budgets, or
      audit events.
- [ ] Manager approval triggers an accounting notification (existing behavior, `server.mjs:622`) —
      confirm it still fires post-refactor.
- [ ] Client confirmation/cancel links still validate token + expiry after moving to Postgres
      (`server.mjs:571-572` logic preserved).
- [ ] A funded cancellation creates a `reconciliation_tasks` row and both owner + accounting
      notifications (`server.mjs:576-583`).
- [ ] `audit_events` cannot be updated or deleted even via the service-role key (attempt a manual
      `PATCH`/`DELETE` through `supabaseFetch` in a scratch script and confirm Postgres rejects it).
- [ ] Restarting the Render service does not clear any trip/profile data.
- [ ] Login attempts are throttled after 5 failures in 15 minutes.
- [ ] PWA installs and updates correctly on Android and iOS after a deploy (existing manual QA step,
      unchanged).

## Phase 8 — Go-live gate

Do not allow real cash disbursement (real budget-item releases against real client trips) until every
box in Phase 7 is checked and at least one full trip lifecycle has been run end-to-end against the
live Render URL with a real (non-`onboarding@resend.dev`) email domain and a real Supabase project —
not local-demo mode.
