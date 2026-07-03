# Roadlink Trip Control

Phone-first demo prototype for Roadlink staff.

This standalone project is separate from DoctorsAssistant. It demonstrates the core Roadlink workflow:

- Coordinator creates a trip.
- Client receives a secure confirmation link through SMS, email, Viber, or WhatsApp.
- Client confirms or cancels without installing an app.
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

## Email Setup

The prototype now includes a small local server that can send branded emails through Resend.

Create a local-only `.env.local` file:

```bash
RESEND_API_KEY=your_resend_key_here
ROADLINK_EMAIL_FROM=Roadlink Trip Control <onboarding@resend.dev>
```

Important:

- Do not put the Resend key in `app.js` or any browser file.
- `.env.local` is ignored by git.
- For production, Roadlink should use a verified sending domain instead of `onboarding@resend.dev`.

Email actions currently supported:

- Client booking confirmation email when a coordinator creates a trip.
- Resend client confirmation email from Trip Detail.
- Email waybill from the Waybill screen.

The email template includes Roadlink branding, trip details, a truck-style signature banner, Roadlink contact details, a confidentiality notice, and `Powered by Konek`.

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

Demo limitation:

- Trips are still stored in the browser session. This is fine for the first clickable demo, but real client confirmation links need Supabase or another persistent backend so links work across devices and after refreshes.
- Email sending works through the server when Resend is configured.
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

This is still a prototype. It stores trip state only in the browser during the current session. Email can be sent through the local server when `RESEND_API_KEY` is configured, but SMS, Viber, WhatsApp, persistent database storage, and production auth are not implemented yet.

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

Still to do:

- Store trips/users/waybills in Supabase.
- Sync records to Google Sheets.
- Add verified Roadlink sending domain for email.
- Add real client confirmation links backed by persistent trip IDs.
- Add manager/accounting notification inbox.
- Add production auth and role permissions.
- Integrate SSD GPS Philippines once API or tracking-link access is available.
