# Roadlink Trip Control Workflows

## Learn In The App

Open `/?demo=1&walkthrough=2` or choose **Take a guided tour**. The guided dialogs
use 15 short steps to explain who performs each action and what to choose using one
sample trip. Each short dialog appears inside the app and highlights the
relevant control. Use **Back**, **Next**, or **Skip tour**. Finish returns to an
explorable sample workspace rather than a presentation panel.

The tour switches sample roles automatically and never changes saved records
or sends an email. Finish returns to the starting screen. The **?** in screen
headers reopens it. GPS tracking and invoices remain future work.

## Demo On A Laptop Or Phone

Open `https://roadlink-trip-control.netlify.app/?demo=1` for the full desktop
workspace. Use the Preview role selector to change staff roles and follow the same trip
through each approval. Phone view narrows the layout for laptop presentations;
actual phones use their own full screen automatically. Desktop view returns to
the table and sidebar.

Start a new sample booking as coordinator; open the client confirmation preview
to confirm it, then submit the waybill. Switch to Owner / Manager and approve,
then Accounting for finance approval and release logging. A funded cancellation
opens checking. Record the release outcomes, then complete reconciliation.
All these actions remain in the browser demo and send no real emails.

## Trip Messages Preview

1. Open the staff demo at `/?demo=1` or the client demo at `/?demo=client`.
2. Open a trip or booking, then choose Trip messages.
3. Write a message or choose a suggested reply, then Send. Your sender identity
   stays fixed to your current account; there is no switch inside chat.
4. Choose Reset demo to restore the sample conversation, or the back arrow to
   exit to the original screen.

Messages stay in the current browser tab and are separate for each trip. No
external client receives the messages. Confirmations, cancellations, approvals,
and money movements must still use their normal booking controls.

The staff and client demo links open separate sample experiences, not a live
conversation between tabs or devices. Client activation from email is planned;
it is not enabled by these demo links.

## Production Pilot Status

The app now has server-backed production pilot hooks. Supabase is the operational source of truth when configured; otherwise the app runs in local demo mode with `.data/roadlink-store.json`. Google Sheets mirroring is supported through `GOOGLE_SHEETS_WEBHOOK_URL`.

The client portal is included as a preview/beta experience so Roadlink can show clients how app-based booking may feel without forcing clients to adopt it immediately. Email confirmation links remain the default client workflow.

## Data Strategy

Recommended pilot setup:

- Supabase as the operational database for users, roles, trips, waybills, approvals, notifications, and audit logs.
- Google Sheets as the client-friendly review layer, updated from the app so Roadlink can inspect trips, waybills, releases, cancellations, and reconciliations in a familiar spreadsheet.
- The app should treat Supabase as the source of truth and Google Sheets as a synced mirror/export, not the other way around.

Why not Google Sheets only:

- Sheets is easy to understand, but weak for permissions, audit trails, concurrent updates, secure public links, and reliable approval workflows.
- A Sheets-only version is acceptable for a very early proof of concept, but risky once actual disbursement records and cancellations are involved.

Why use Google Sheets anyway:

- Roadlink managers can review records without learning a database tool.
- Accounting can export, filter, and cross-check data.
- It gives the client confidence that their data is not hidden inside a black box.

## Staff Login And Account Approval

1. Staff opens the Roadlink app.
2. Staff taps `Log in`.
3. Existing staff selects role and enters username/password.
4. Staff can choose `Remember login details`.
5. New staff taps `Create account request`.
6. Staff submits name, email, and requested role.
7. Owner/admin receives an approval request.
8. Owner/admin approves the request.
9. Staff receives temporary credentials by email.

## Client Portal Preview

1. Client opens the Roadlink client portal preview.
2. Client logs in with an approved client account.
3. Client views active bookings for their company only.
4. Client requests a new booking with company, authorized contact, phone, email, from, to, vehicle type, trip date, and cargo notes.
5. Coordinator sees the request in the staff dashboard.
6. Coordinator converts the request into an official Roadlink trip.
7. The official trip still uses email confirmation for a clear client trail.
8. Client cannot view Roadlink budgets, internal approvals, finance records, or staff audit logs.

## Booking And Client Confirmation

1. Coordinator logs in.
2. Coordinator creates a trip with company, route, vehicle type, plate number if available, trip date, cargo notes, and client contact.
3. App sends a Roadlink-branded confirmation email to the authorized client contact.
4. Coordinator may optionally send a WhatsApp, Viber, or SMS follow-up, but email remains the official confirmation trail.
5. Client opens the link and chooses `Confirm Booking` or `Cancel Booking`.
6. App updates the trip status immediately.

## Waybill And Fund Disbursement

1. Coordinator opens a trip and creates the digital waybill.
2. Waybill includes shipper, consignee, destination, shipment number, vehicle type, plate number, driver, item description, payment details, and cash-out items.
3. Coordinator submits waybill for approval.
4. Owner/manager receives an in-app approval notification, with email as backup.
5. Owner/manager uses `Approve (Manager)` in the app.
6. Finance/accounting receives an in-app notification after manager approval.
7. Finance/accounting uses `Approve (Finance)` and then processes budget release from the same trip record.
8. Approved waybill can be printed or emailed in the paper-style format.
9. Funds are disbursed only after approval.

## Cancellation With Funds Released

1. Client cancels through the secure client link.
2. App checks if cash, cheque, or PO items were already released.
3. If no funds were released, trip moves to cancelled.
4. If funds were released, trip becomes `Cancelled - Funds Released`.
5. Owner/accounting receive a `For immediate checking` alert.
6. Accounting records returned cash, voided cheques, cancelled POs, or used expenses.
7. Trip moves to reconciled only after accounting completes the record.

## Email Requirements

- Email is sent from the backend only, never from browser JavaScript.
- Local demo uses `RESEND_API_KEY` in `.env.local`.
- Booking confirmation email includes Roadlink branding, trip details, confirmation link, truck-style signature banner, confidentiality notice, and `Powered by Konek`.
- Waybill email uses a standard subject and body that pulls the trip, plate, waybill, approval, and route details from the app.
- Production should use a verified Roadlink sending domain.

## PWA Deployment Plan

1. Deploy the current Node server as a hosted web service, preferably Render for the first demo.
2. Store `RESEND_API_KEY` and `ROADLINK_EMAIL_FROM` as private environment variables in the host.
3. Open the hosted HTTPS URL on Android Chrome and choose `Install app`.
4. Open the hosted HTTPS URL on iPhone Safari and choose `Add to Home Screen`.
5. Keep using the same hosted URL for laptop access.
6. Apply all Supabase migrations before relying on real cross-device client confirmation links.

Supabase production setup checklist:

- Apply `0001_init.sql`, `0002_live_integrity.sql`,
  `0003_atomic_operations.sql`, and `0004_email_outbox.sql` in order.
- Enable Row Level Security on all exposed tables.
- Staff roles can read/write only their workflow areas.
- Client users can read only bookings and booking requests tied to their company.
- `audit_events` should be append-only from the app.
- Store `SUPABASE_SERVICE_ROLE_KEY` only on Render, never in browser JavaScript.

Why Supabase is needed before production:

- Local-demo mode stores records on one machine and is only for presentations.
- A real confirmation email link must look up the trip from a shared database.
- Manager approvals, accounting actions, audit trails, and client confirmations should persist across staff devices.

## GPS Tracking Future Flow

1. Roadlink connects the app to SSD GPS Philippines through an API, tracking export, webhook, or shareable vehicle-location link.
2. Each vehicle gets a plate number and GPS unit identifier.
3. Active trip cards show `View unit location`.
4. Tapping it opens the current truck location in the app or an external map.
5. Location history can later be attached to trip completion and dispute review.

Information to request from SSD GPS:

- API documentation or tracking portal integration guide.
- Authentication method, such as API key, username/password token, or OAuth.
- Vehicle/unit IDs mapped to Roadlink plate numbers.
- Endpoint or shareable link for latest live location.
- Location history endpoint, if available.
- Update frequency, rate limits, and data retention period.
- Permission rules for staff roles who can view live locations.

## Google Sheets Mirror

The first implementation uses `GOOGLE_SHEETS_WEBHOOK_URL`, usually a Google Apps Script web app attached to the Roadlink spreadsheet. The backend posts sanitized JSON events such as `trip_created`, `budget_logged`, `client_cancel`, and `reconciliation_completed`. Events carry unique IDs so Apps Script can ignore retries safely. Current trip, waybill, booking-request, and reconciliation rows update in place; ledger and audit events append. Client-link tokens, password data, and server credentials are never mirrored. The Sheet should be treated as read-only review output for Roadlink managers, not the control source for the app.

## Demo Script

1. Show the minimalist video login screen.
2. Log in as accounting: `finance.temp / Roadlink-2198`.
3. Open the Cebu to Leyte trip.
4. Point out labels: route, company, vehicle type, plate number, coordinator, and budget.
5. Open the waybill.
6. Submit for approval.
7. Approve as manager.
8. Approve as finance.
9. Print or email the waybill.
10. Open the client confirmation preview.
11. Cancel the trip as the client.
12. Show the urgent funded-cancellation alert.
13. Complete reconciliation.
