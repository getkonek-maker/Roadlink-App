# Roadlink Trip Control

Phone-first production pilot prototype for Roadlink staff, with an optional client portal preview.

This standalone project is separate from DoctorsAssistant. It demonstrates the core Roadlink workflow:

- Coordinator creates a trip.
- Client receives a secure confirmation link by email, with optional Viber/WhatsApp follow-up.
- Client confirms or cancels without installing an app.
- Client can also preview a simple portal for booking requests and active trip visibility.
- Funded cancellations alert owner/accounting immediately.
- Coordinator creates a digital waybill that mirrors the paper form.
- Manager and finance approve before disbursement.
- Accounting records cash return, cheque voiding, PO cancellation, and used expenses.
- Staff log in with role, username, password, and optional remembered details.
- Staff request accounts by email; owner/admin approval issues credentials.
- Admin adds users with temporary usernames, passwords, roles, and photos.

## Run Locally

```bash
npm run start
```

Then open:

```text
http://127.0.0.1:4173
```

## Production Pilot Setup

The app now includes a small backend API for trips, account requests, approvals, client actions, reconciliation, email, and Google Sheets mirroring. It runs in two modes:

- `supabase`: when `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are configured.
- `local-demo`: when Supabase is not configured. This stores demo data in `.data/roadlink-store.json` and is useful for presentations only.

### Email Setup

The server sends branded emails through Resend.

Create a local-only `.env.local` file:

```bash
RESEND_API_KEY=your_resend_key_here
ROADLINK_EMAIL_FROM=Roadlink Trip Control <onboarding@resend.dev>
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PASSWORD_PEPPER=a_long_private_random_string
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/your_script_id/exec
```

Important:

- Do not put the Resend key in `app.js` or any browser file.
- `.env.local` is ignored by git.
- For production, Roadlink should use a verified sending domain instead of `onboarding@resend.dev`.

Production environment variables:

- `RESEND_API_KEY`: private Resend key used only by the server.
- `ROADLINK_EMAIL_FROM`: sender identity. Use a verified Roadlink domain before live client use.
- `SUPABASE_URL`: Supabase project URL.
- `SUPABASE_ANON_KEY`: Supabase public anon key, used for Auth password login.
- `SUPABASE_SERVICE_ROLE_KEY`: private server-only key for controlled writes, approvals, and audit entries.
- `PASSWORD_PEPPER`: private string used for local demo password hashes.
- `GOOGLE_SHEETS_WEBHOOK_URL`: optional Apps Script web app URL for the readable spreadsheet mirror.

Email actions currently supported:

- Client booking confirmation email when a coordinator creates a trip.
- Resend client confirmation email from Trip Detail.
- Email waybill from the Waybill screen.

The email template includes Roadlink branding, trip details, a truck-style signature banner, Roadlink contact details, a confidentiality notice, and `Powered by Konek`.

## Backend API

Implemented pilot endpoints:

- `GET /api/bootstrap`
- `POST /api/auth/login`
- `POST /api/auth/account-request`
- `POST /api/admin/approve-account`
- `POST /api/trips`
- `POST /api/trips/:id/send-confirmation`
- `POST /api/client-action`
- `POST /api/budget-items`
- `POST /api/waybills/submit`
- `POST /api/waybills/:id/send-email`
- `POST /api/waybills/approve-manager`
- `POST /api/waybills/approve-finance`
- `POST /api/reconciliation/update`
- `POST /api/client-portal/booking-request`
- `POST /api/sync/google-sheets`

Supabase table names expected by the server:

`profiles`, `account_requests`, `clients`, `booking_requests`, `trips`, `budget_items`, `client_actions`, `reconciliation_tasks`, `audit_events`, `notifications`, `sheet_sync_log`.

## PWA Phone Demo

This prototype is set up as a Progressive Web App. It includes a Roadlink-branded app icon, a web app manifest, and offline shell caching.

For a real Android phone demo:

1. Host the project on a private HTTPS link such as Vercel, Netlify, Cloudflare Pages, or a temporary secure tunnel.
2. Open that link in Chrome on Android.
3. Choose `Install app` or `Add to Home screen`.
4. The installed icon should use the Roadlink-branded launcher artwork.

Localhost works for desktop testing, but a physical phone usually needs HTTPS unless the server is running directly on the phone.

## Deploy To Render

This project is prepared for Render deployment with `render.yaml`.

Recommended first deployment path:

1. Push this folder to a private GitHub repository.
2. In Render, create a new Blueprint or Web Service from that repository.
3. Use these commands:
   - Build command: `npm install`
   - Start command: `npm run start`
   - Health check path: `/api/health`
4. Add environment variables in Render:
   - `RESEND_API_KEY`
   - `ROADLINK_EMAIL_FROM`
5. Open the Render HTTPS URL on Android Chrome.
6. Tap `Install app` or `Add to Home screen`.

The hosted PWA will use the Roadlink icon from the manifest. On iPhone, open the URL in Safari, tap Share, then `Add to Home Screen`.

Pilot limitation:

- Without Supabase keys, the app uses local demo storage. This is acceptable for demos but not for real operations.
- With Supabase keys, trips, client actions, approvals, notifications, and audit records are written through the server API.
- Google Sheets sync requires an Apps Script webhook or later a direct Google service account integration.
- Resend may limit recipients while using `onboarding@resend.dev`; production should use a verified Roadlink sending domain.

## Demo Path

1. Start on the minimalist home screen.
2. Tap `Log in`.
3. Use a demo account such as `finance.temp / Roadlink-2198`.
4. Check `Remember login details` and log in.
5. Open the seeded Cebu to Leyte trip.
6. Review the PHP 15,000 cash release and cheque/PO records.
7. Open `Waybill`.
8. Submit the waybill for approval.
9. Log in as manager/admin to use `Approve (Manager)`.
10. Log in as accounting/admin to use `Approve (Finance)`.
11. Print or email the waybill to see the paper-style layout.
12. Open the client confirmation preview.
13. Cancel the booking as the client.
14. Review the urgent alert and reconciliation queue.
15. Mark the funds returned/voided/cancelled.

## Client Portal Preview

1. From the home screen, tap `Client portal preview`.
2. Use `ana.client / Client-2407`.
3. View active bookings for Mactan Seafoods Export.
4. Request a new booking.
5. Log in as coordinator and convert the client request into an official trip.
6. Notice that the client portal does not expose budgets, internal approvals, or audit logs.

## Account Request Demo

1. From the home screen, tap `Request account`.
2. Submit a staff name, email, and requested role.
3. Log in as owner/admin.
4. Open `Users`.
5. Approve the pending request.
6. The prototype adds the user and simulates emailing their credentials.

## Test Emails

Approval-routing messages are simulated for:

- zenojief_roadlink@yahoo.com
- emmanblangarc@gmail.com

## Notes

This is now a production-pilot foundation. It has persistent server-backed flows and Supabase/Google Sheets hooks, but Roadlink should not use it for live disbursement operations until Supabase tables, Row Level Security policies, verified email domain, backups, and a private pilot test are completed.

See [WORKFLOWS.md](WORKFLOWS.md) for the recommended Supabase plus Google Sheets data strategy and the start-to-finish operating workflows.

## Current Handoff Notes

Completed:

- PWA setup with Roadlink app icons.
- Blank coordinator trip form with placeholders.
- Authorized contact, email, phone, vehicle type, and plate number fields.
- Client confirmation email flow through a backend Resend endpoint.
- Roadlink-branded email HTML with confidentiality notice and Powered by Konek footer.
- Waybill screen with role-aware approval buttons.
- Waybill print and email actions.
- Funded cancellation status simplified to `Cancelled - Funds Released` plus `For immediate checking`.

Still to do before live operations:

- Create the Supabase tables and Row Level Security policies.
- Add the Supabase and Google Sheets environment variables in Render.
- Verify a Roadlink sending domain in Resend.
- Replace demo users/passwords with approved production users.
- Run a private pilot with sample trips before real cash disbursement.
- Integrate SSD GPS Philippines once API or tracking-link access is available.
