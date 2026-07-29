# Roadlink Live Operations Checklist

Roadlink Trip Control must not be used for real cash disbursement until every
go-live item below is complete. Supabase is the source of truth. Google Sheets
is a read-only management mirror.

## Implemented In The Application

- Only approved frontend files and assets are publicly served.
- CSP, HSTS, frame protection, MIME protection, and no-referrer headers are set.
- Supabase failures stop the operation instead of falling back to demo records.
- Passwords use salted `scrypt` hashes and legacy hashes upgrade at login.
- Sessions use secure, HTTP-only, same-site cookies instead of browser storage.
- Password resets persist in Supabase and invalidate existing sessions.
- Client confirmation tokens are stored as HMAC hashes for newly issued links.
- Client email links open a review page and never confirm a trip automatically.
- Staff roles are enforced by the server for every privileged action.
- Client portal records are linked by `clientId`, not company-name matching.
- Client-facing responses exclude internal budgets, audit history, and token hashes.
- Staff preview mode cannot impersonate a client in production; interactive
  confirmation previews are limited to the isolated local demo.
- Waybill form values persist before manager approval.
- Client confirmation, manager approval, and finance approval are required before
  accounting can log a release.
- Reconciliation cannot close while released items remain unexplained.
- Trip updates use optimistic version checks to prevent silent overwrites.
- The phone UI shows only commands available to the signed-in role.
- Automated tests cover public-file protection, authorization, and the complete
  trip-to-reconciliation workflow.

## Required Before Deploying This Version

1. Back up the current Supabase project.
2. Apply `supabase/migrations/0002_live_integrity.sql` in the Supabase SQL editor.
3. Confirm the migration created:
   - `trips.clientTokenHash`
   - `trips.clientId`
   - `trips.version`
   - `trips.updated_at`
   - `profiles.clientId`
   - `profiles.sessionVersion`
   - `password_reset_tokens`
4. Add or verify these Render environment variables:
   - `APP_ORIGIN=https://roadlink-app.onrender.com`
   - `SESSION_SECRET`
   - `PASSWORD_PEPPER`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `ROADLINK_EMAIL_FROM`
   - `GOOGLE_SHEETS_WEBHOOK_URL`
   - `GOOGLE_SHEETS_WEBHOOK_SECRET`
5. Set the matching `ROADLINK_WEBHOOK_SECRET` script property in Google Apps
   Script and redeploy the Sheets webhook.
6. Verify a Roadlink- or Konek-owned domain in Resend. Do not use
   `onboarding@resend.dev` for live clients.
7. Rotate the Resend key previously shared during development.
8. Upgrade Render from the free tier to an always-on instance.
9. Run `npm run verify` locally before pushing.

## Deployment Verification

- `/api/health` reports `mode: supabase` and `operational: true`.
- `/server.mjs`, `/package.json`, `/.env.local`, and `/.data/...` return 404.
- A failed Supabase request displays an error and does not create a local record.
- Android and iOS PWAs load the full-screen Roadlink home page.
- A real external email receives the branded confirmation message.
- Opening the email does not change trip status until the client taps Confirm.
- Coordinator submits a saved waybill.
- Manager approval notifies accounting.
- Finance approval unlocks the budget-release command.
- A funded cancellation creates the immediate-checking workflow.
- Reconciliation appears in Supabase, the audit timeline, and Google Sheets.

## Pilot And Go-Live Gate

Run at least ten sample trips and two funded-cancellation drills with Roadlink
staff. For the first two weeks of live use, keep the paper waybill process in
parallel and reconcile it daily against Supabase and Google Sheets. Move to
digital-first operation only after Roadlink's owner and accounting lead sign off
on the results.

Before the app becomes the sole control for real cash or cheque releases, also
complete these engineering controls:

- Move cancellation, approval, fund release, and reconciliation writes into
  Supabase transaction functions so the trip, audit, notification, and ledger
  records either all commit or all roll back.
- Add a persistent email outbox plus Resend delivery webhooks and retry handling.
- Configure uptime and application-error alerts with an accountable recipient.
- Complete and record a Supabase backup restore drill.
- Document incident response, access review, and staff offboarding ownership.
