# Roadlink Trip Control Handoff

## Repository And Hosting

- Repository: `https://github.com/getkonek-maker/Roadlink-App`
- Branch deployed by Render: `main`
- Render URL: `https://roadlink-app.onrender.com`
- Current hardening branch: `codex/live-operations-hardening`
- Last pushed hardening commit before this pass: `d9e7a48`
- Runtime: Node.js server plus vanilla JavaScript PWA
- Database: Supabase through server-side PostgREST
- Email: Resend
- Management mirror: Google Sheets through Apps Script

## Current Architecture

- `server.mjs`: static server, API, authentication, authorization, email, and
  database adapter.
- `app.js`: staff and client PWA interface.
- `supabase/migrations/0001_init.sql`: pilot schema.
- `supabase/migrations/0002_live_integrity.sql`: required live-integrity update.
- `supabase/migrations/0003_atomic_operations.sql`: atomic cancellation,
  approval, release, and reconciliation transitions.
- `supabase/migrations/0004_email_outbox.sql`: persistent retry queue for trip
  confirmation and waybill email.
- `google-apps-script/sheets-webhook.gs`: read-only Sheets mirror receiver.
- `test/server.test.mjs`: API security and complete workflow tests.
- `LIVE_OPERATIONS_CHECKLIST.md`: deployment and go-live gate.

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
