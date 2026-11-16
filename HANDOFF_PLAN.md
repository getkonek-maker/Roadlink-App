# Roadlink Trip Control Handoff

## Repository And Hosting

- Repository: `https://github.com/getkonek-maker/Roadlink-App`
- Branch deployed by Render: `main`
- Render URL: `https://roadlink-app.onrender.com`
- Netlify frontend: `https://roadlink-trip-control.netlify.app`
- Netlify site ID: `ad830280-7bad-451a-8374-ea9b7d5e6f2e`
- Current hardening branch: `codex/live-operations-hardening`
- Baseline hardening commit before walkthrough/chat work: `b4fb056`
- Runtime: Node.js server plus vanilla JavaScript PWA
- Database: Supabase through server-side PostgREST
- Email: Resend
- Management mirror: Google Sheets through Apps Script

## Responsive Web Demo Release

- Main demo: `https://roadlink-trip-control.netlify.app/?demo=choose`.
- Entry: Staff / Client dialog over the fleet video. Staff choose a role;
  clients enter directly. No demo credentials, tour links, or extra footer CTAs.
- Role guides start automatically after entry and keep the same identity:
  coordinator 6 steps, manager 6, accounting 6, admin 3, client 5.
- Direct workspaces: `?demo=coordinator`, `owner`, `accounting`, `admin`,
  or `client`. Add `&walkthrough=2` for the selected role's guide.
- Legacy generic `?demo=1&walkthrough=2` links now open the entry dialog.
- Phone demo: add `&mobile=1`. Actual phones adapt automatically.
- Asset/cache release marker: `web-app-v15`; PWA cache version 15.
- Role-specific tasks and nav, stage-specific approvals, read-only manager
  checking, and backend rejection of admin financial actions remain in place.
- Switch access returns to the entry dialog. Toolbar and client portal layout
  are simplified. Confirmed client bookings now show a cancellation action and
  reason field; empty cancellation reasons are blocked.
- Ten automated tests pass. Browser tests cover every role guide at desktop,
  phone, narrow-phone, and landscape sizes, constant identity, real highlighted
  controls, replay, Escape, state restoration, client cancellation, and zero
  backend calls. No shared live chat or email activation is added.
- Demo records stay in memory; chat stays in tab sessionStorage. Real account
  sign-in is separate and still requires credentials. Guides restore the
  preceding records and session on exit.
- Earlier deployment commits: `4bc5d5d` responsive workspace, `7c63f86`
  15-step global tour and chat identity, `5c5c00b` role workloads and demo access.
- Publish frontend dist to the existing Netlify site. Push main for Render
  auto-deploy; do not upload secrets or backend files as frontend assets.

## Current Architecture

- `server.mjs`: static server, API, authentication, authorization, email, and
  database adapter.
- `app.js`: staff and client PWA interface.
- `workspace.js` / `workspace.css`: responsive workspace navigation, demo role
  selection, presentation records, and simulated API responses. No real writes.
- `netlify.toml`: frontend publishing and same-origin `/api/*` proxy to Render.
- `scripts/build-web.mjs`: explicit public-file build into ignored `dist/`.
- `walkthrough.js`: isolated per-role short guides, launched after role entry
  or header help. It reuses real screens, restores application
  state on exit, and prevents all API calls while active. No server writes.
- `demo-chat.js`: per-trip messaging preview, launched by `?chat-demo=1`, Trip
  messages buttons. Locks sender identity to the active account, with no switch
  inside chat. Separate client entry: `?demo=client`. Stores messages in
  sessionStorage only. No live chat
  API, external notifications, or shared database messages yet. Never represent
  this preview as live communication. The active demo blocks API requests and
  restores prior application state on exit.
- `supabase/migrations/0001_init.sql`: pilot schema.
- `supabase/migrations/0002_live_integrity.sql`: required live-integrity update.
- `supabase/migrations/0003_atomic_operations.sql`: atomic cancellation,
  approval, release, and reconciliation transitions.
- `supabase/migrations/0004_email_outbox.sql`: persistent retry queue for trip
  confirmation and waybill email.
- `google-apps-script/sheets-webhook.gs`: read-only Sheets mirror receiver.
- `test/server.test.mjs`: API security and complete workflow tests.
- `LIVE_OPERATIONS_CHECKLIST.md`: deployment and go-live gate.

## Publish The Frontend

Run `npm run verify` and `npm run build:web`, then deploy `dist/` to Netlify site
`ad830280-7bad-451a-8374-ea9b7d5e6f2e` using the CLI's existing login. Netlify is
currently deployed manually; a GitHub push alone updates Render, not Netlify.
Only publish `dist/`, never the project root. Preserve the site's identity and
the existing Render backend. The baseline before this responsive pass was
commit `2905d7d` on `codex/live-operations-hardening` and `main`.

## Security Model

- Browsers receive an HTTP-only, SameSite session cookie. Session secrets are
  not stored in localStorage.
- Passwords are salted with `scrypt`; legacy hashes upgrade after login.
- Password reset tokens persist in Supabase and expire after 15 minutes.
- Every privileged API route rechecks the current profile and role.
- Session versions invalidate old sessions after password resets or suspension.
- New client confirmation tokens are stored as HMAC hashes.
- RLS denies direct browser access; the server uses the service-role key.
- Audit and client-action tables remain append-only to the application role.

## Workflow Invariants

- Coordinator or manager creates a trip.
- Client must explicitly confirm from the secure review page.
- Coordinator saves and submits the complete waybill.
- Manager approves before finance.
- Finance approves before accounting can release any funds.
- Funded cancellation produces `Cancelled - Funds Released` and an immediate
  checking task.
- Accounting cannot complete reconciliation while released items are
  unresolved or unexplained.
- Optimistic trip versions prevent silent last-write-wins overwrites.
- Sensitive multi-table transitions run as Supabase transactions and were
  verified in a rollback-only live-database drill.
- Sheets payloads are sanitized and use idempotent event IDs.

## Required Deployment Order

1. Confirm Supabase backup/retention policy.
2. Confirm `0002_live_integrity.sql`, `0003_atomic_operations.sql`, and
   `0004_email_outbox.sql`; all are
   already applied to project `ewmtiykslrnprsreilil`.
3. Configure all environment variables listed in `.env.example` on Render.
4. Configure the matching Apps Script secret property.
5. Verify the Resend sender domain and rotate development credentials.
6. Run `npm run verify`.
7. Deploy to a staging Render service first.
8. Run the complete workflow test manually on staging.
9. Upgrade the production Render service to always-on.
10. Merge/deploy to production and verify `/api/health` reports
    `operational: true`.

The matching Supabase migrations are applied. Deploy the server only after the
test suite remains green and Render environment variables are verified.

## Next Engineering Priorities

The first four items below are required before Roadlink relies on the app as the
sole control for live cash and cheque releases.

- Add Resend delivery webhooks for delivery and bounce status; application
  retries are already handled by the Supabase email outbox.
- Add structured error monitoring and alerting.
- Add database backup restore drills and retention policy documentation.
- Add notification read state and background refresh.
- Integrate SSD GPS Philippines after Roadlink obtains API documentation or a
  supported unit-location link.

## Claude Handoff Prompt

Continue Roadlink Trip Control from
`https://github.com/getkonek-maker/Roadlink-App`. Read `README.md`,
`LIVE_OPERATIONS_CHECKLIST.md`, `HANDOFF_PLAN.md`, `server.mjs`, `app.js`, and
both Supabase migrations before editing. The app is deployed on Render from
`main`, but the current hardening changes must not be deployed until migration
`0002_live_integrity.sql`, `0003_atomic_operations.sql`, and
`0004_email_outbox.sql` have been applied.
Preserve Supabase as the source of truth and Google Sheets as a read-only mirror. Never expose or commit service
keys. Run `npm run verify` after every backend or workflow change.
