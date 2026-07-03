import { createReadStream, existsSync, readFileSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 4173);

loadLocalEnv();

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".mov": "video/quicktime",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8"
};

function loadLocalEnv() {
  const envPath = join(root, ".env.local");
  if (!existsSync(envPath)) return;
  const text = readFileSync(envPath, "utf8");
  text.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) return;
    const [key, ...rest] = trimmed.split("=");
    if (!process.env[key]) process.env[key] = rest.join("=").replace(/^["']|["']$/g, "");
  });
}

function json(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) request.destroy();
    });
    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    request.on("error", reject);
  });
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function money(value) {
  return `PHP ${Number(value || 0).toLocaleString("en-PH")}`;
}

function waybillTotal(waybill = {}) {
  const cashOut = ["downpayment", "arrastre", "driver", "helper", "labor", "others"]
    .reduce((sum, key) => sum + Number(waybill[key] || 0), 0);
  return Number(waybill.freight || 0) + cashOut;
}

function displayDate(value) {
  if (!value) return "For scheduling";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return value;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function assetDataUri(relativePath, contentType) {
  const fullPath = join(root, relativePath);
  if (!existsSync(fullPath)) return "";
  return `data:${contentType};base64,${readFileSync(fullPath).toString("base64")}`;
}

function roadlinkEmailShell({ title, preview, body, actions = [], trip }) {
  const signatureImage = assetDataUri("assets/email-signature-trucks.png", "image/png");
  const logo = `
    <div style="font-style:italic;font-weight:900;font-size:42px;line-height:.9;color:#b9bec8;text-shadow:1px 1px 0 #4d5564,-1px -1px 0 #ffffff;">Roadlink</div>
    <div style="margin-top:4px;font-size:13px;font-weight:900;letter-spacing:.06em;color:#111827;">CARGO TRANSPORT SERVICE</div>
    <div style="height:5px;background:#ed1c2e;margin-top:10px;border-radius:999px;"></div>
    <div style="height:8px;width:72%;margin-left:18%;background:#163abf;transform:skewX(-22deg);"></div>
    <div style="margin-top:7px;font-size:12px;font-weight:900;color:#374151;">We Go Wherever Roads Go!</div>
  `;
  const truckSignature = `
    <div style="margin-top:22px;border-radius:14px;overflow:hidden;border:1px solid #d6dce8;background:#ffffff;">
      ${signatureImage
        ? `<img src="${signatureImage}" alt="Roadlink Cargo Transport Service fleet - We Go Wherever Roads Go!" style="display:block;width:100%;height:auto;border:0;">`
        : `<div style="padding:18px 20px;color:#101a68;font-weight:900;">Roadlink Cargo Transport Service<br><span style="color:#374151;">We Go Wherever Roads Go!</span></div>`}
      <div style="padding:12px 16px;border-top:4px solid #ed1c2e;">
        ${logo}
      </div>
    </div>
  `;
  const actionMarkup = actions.length ? `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 4px;width:100%;">
      <tr>
        ${actions.map((action) => `
          <td style="padding:4px 6px 4px 0;">
            <a href="${escapeHtml(action.url)}" style="display:inline-block;border-radius:10px;border-bottom:4px solid ${escapeHtml(action.accent || "#ed1c2e")};background:${escapeHtml(action.background || "#101a68")};padding:13px 15px;color:#ffffff;text-decoration:none;font-weight:900;font-size:13px;">${escapeHtml(action.label)}</a>
          </td>
        `).join("")}
      </tr>
    </table>
  ` : "";

  return `
    <!doctype html>
    <html>
      <body style="margin:0;background:#f3f6fb;font-family:Arial,Helvetica,sans-serif;color:#111827;">
        <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(preview)}</div>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f6fb;padding:24px 12px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border:1px solid #d9e0ec;border-radius:16px;overflow:hidden;">
                <tr>
                  <td style="padding:24px 28px 18px;border-bottom:4px solid #ed1c2e;">
                    ${logo}
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px;">
                    <h1 style="margin:0 0 12px;font-size:24px;line-height:1.2;color:#101a68;">${escapeHtml(title)}</h1>
                    ${body}
                    ${actionMarkup}
                    ${truckSignature}
                    <div style="margin-top:18px;padding-top:14px;border-top:1px solid #d9e0ec;color:#5b6472;font-size:12px;line-height:1.5;">
                      <strong>Roadlink Cargo Transport Service</strong><br>
                      Lapu-Lapu City, Cebu, Philippines<br>
                      This message relates to Roadlink trip ${escapeHtml(trip?.id || "")}.
                    </div>
                    <div style="margin-top:14px;color:#6b7280;font-size:11px;line-height:1.45;">
                      Confidentiality Notice: This email and any related trip details are intended only for the authorized recipient. If you received this message by mistake, please notify Roadlink and delete it. Unauthorized review, use, disclosure, or distribution is prohibited.
                    </div>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 28px;background:#f8fafc;border-top:1px solid #d9e0ec;color:#334155;font-size:13px;">
                    <span style="display:inline-block;width:20px;height:20px;margin-right:8px;border-radius:6px;background:#0fba81;color:#fff;text-align:center;line-height:20px;font-weight:900;">K</span>
                    Powered by <strong style="color:#14304a;">Konek</strong>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function tripRows(trip) {
  const rows = [
    ["Company", trip.client],
    ["Authorized contact", trip.contact],
    ["From", trip.origin || "For encoding"],
    ["To", trip.destination || "For encoding"],
    ["Route", trip.route],
    ["Vehicle type", trip.vehicle],
    ["Plate number", trip.waybill?.plateNo || "For assignment"],
    ["Trip date", displayDate(trip.date)],
    ["Cargo notes", trip.cargo || "None provided"]
  ];
  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;border:1px solid #d9e0ec;border-radius:12px;overflow:hidden;">
      ${rows.map(([label, value]) => `
        <tr>
          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e5eaf2;color:#5b6472;font-size:12px;font-weight:800;width:38%;">${escapeHtml(label)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5eaf2;color:#111827;font-size:13px;">${escapeHtml(value)}</td>
        </tr>
      `).join("")}
    </table>
  `;
}

function buildConfirmationEmail(trip, origin) {
  const clientUrl = `${origin}/?trip=${encodeURIComponent(trip.id)}#client`;
  const confirmUrl = `${origin}/?trip=${encodeURIComponent(trip.id)}&clientAction=confirm#client`;
  const cancelUrl = `${origin}/?trip=${encodeURIComponent(trip.id)}&clientAction=cancel#client`;
  const contactUrl = `${origin}/?trip=${encodeURIComponent(trip.id)}&clientAction=contact#client`;
  const body = `
    <p style="margin:0 0 12px;line-height:1.6;">Dear ${escapeHtml(trip.contact)},</p>
    <p style="margin:0 0 12px;line-height:1.6;">Roadlink Cargo Transport Service is requesting your confirmation for the trip below. Please review the details and choose one of the actions below.</p>
    ${tripRows(trip)}
    <p style="margin:16px 0 0;line-height:1.6;color:#5b6472;">For accountability, cancellations and confirmations submitted through this link are recorded in Roadlink Trip Control.</p>
  `;
  return {
    to: [trip.email],
    subject: `Roadlink booking confirmation - ${trip.route} (${displayDate(trip.date)})`,
    html: roadlinkEmailShell({
      title: "Please confirm your Roadlink trip",
      preview: `Confirm Roadlink trip ${trip.route} on ${displayDate(trip.date)}`,
      body,
      actions: [
        { label: "Confirm Booking", url: confirmUrl, background: "#166534", accent: "#22c55e" },
        { label: "Cancel Booking", url: cancelUrl, background: "#b91c1c", accent: "#ed1c2e" },
        { label: "Contact Roadlink", url: contactUrl, background: "#101a68", accent: "#163abf" }
      ],
      trip
    }),
    text: `Dear ${trip.contact},\n\nPlease confirm your Roadlink trip.\n\nFrom: ${trip.origin || "For encoding"}\nTo: ${trip.destination || "For encoding"}\nRoute: ${trip.route}\nCompany: ${trip.client}\nVehicle: ${trip.vehicle}\nPlate: ${trip.waybill?.plateNo || "For assignment"}\nDate: ${displayDate(trip.date)}\nCargo: ${trip.cargo || "None provided"}\n\nConfirm: ${confirmUrl}\nCancel: ${cancelUrl}\nContact Roadlink: ${contactUrl}\nReview: ${clientUrl}\n\nRoadlink Cargo Transport Service\nWe Go Wherever Roads Go!\nPowered by Konek`
  };
}

function buildWaybillEmail(trip) {
  const waybill = trip.waybill || {};
  const body = `
    <p style="margin:0 0 12px;line-height:1.6;">Hello,</p>
    <p style="margin:0 0 12px;line-height:1.6;">Please see the Roadlink waybill details below for reference.</p>
    ${tripRows(trip)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;border:1px solid #d9e0ec;border-radius:12px;overflow:hidden;">
      ${[
        ["Waybill number", waybill.number],
        ["Shipment number", waybill.shipmentNo],
        ["Driver", waybill.driverName || "For encoding"],
        ["Prepared by", waybill.preparedBy || "For encoding"],
        ["Manager approval", waybill.approvedBy || "Pending"],
        ["Finance approval", waybill.financeBy || "Pending"],
        ["Overall total", money(waybillTotal(waybill))]
      ].map(([label, value]) => `
        <tr>
          <td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e5eaf2;color:#5b6472;font-size:12px;font-weight:800;width:38%;">${escapeHtml(label)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5eaf2;color:#111827;font-size:13px;">${escapeHtml(value)}</td>
        </tr>
      `).join("")}
    </table>
  `;
  return {
    to: [trip.email],
    subject: `Roadlink waybill ${waybill.number} - ${trip.route}`,
    html: roadlinkEmailShell({
      title: `Waybill ${waybill.number}`,
      preview: `Roadlink waybill details for ${trip.route}`,
      body,
      actions: [],
      trip
    }),
    text: `Roadlink waybill ${waybill.number}\n\nFrom: ${trip.origin || "For encoding"}\nTo: ${trip.destination || "For encoding"}\nRoute: ${trip.route}\nCompany: ${trip.client}\nVehicle: ${trip.vehicle}\nPlate: ${waybill.plateNo || "For assignment"}\nDate: ${displayDate(trip.date)}\nPrepared by: ${waybill.preparedBy || "For encoding"}\nManager approval: ${waybill.approvedBy || "Pending"}\nFinance approval: ${waybill.financeBy || "Pending"}\n\nRoadlink Cargo Transport Service\nWe Go Wherever Roads Go!\nPowered by Konek`
  };
}

async function sendEmail(request, response) {
  let payload;
  try {
    payload = await readJson(request);
  } catch {
    json(response, 400, { ok: false, message: "Invalid JSON payload." });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    json(response, 503, {
      ok: false,
      message: "Email service is not configured. Add RESEND_API_KEY to .env.local and restart the server."
    });
    return;
  }

  const trip = payload.trip || {};
  const kind = payload.kind || "confirmation";
  const proto = request.headers["x-forwarded-proto"] || "http";
  const origin = `${proto}://${request.headers.host}`;
  const email = kind === "waybill" ? buildWaybillEmail(trip) : buildConfirmationEmail(trip, origin);
  const from = process.env.ROADLINK_EMAIL_FROM || "Roadlink Trip Control <onboarding@resend.dev>";

  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `${kind}-${trip.id || Date.now()}-${Date.now()}`
    },
    body: JSON.stringify({
      from,
      to: email.to,
      subject: email.subject,
      html: email.html,
      text: email.text,
      tags: [
        { name: "app", value: "roadlink_trip_control" },
        { name: "kind", value: kind }
      ]
    })
  });

  const result = await resendResponse.json().catch(() => ({}));
  if (!resendResponse.ok) {
    json(response, resendResponse.status, {
      ok: false,
      message: result.message || result.error || "Resend rejected the email request.",
      to: email.to
    });
    return;
  }

  json(response, 200, { ok: true, id: result.id, to: email.to, message: `Email accepted by Resend for ${email.to.join(", ")}.` });
}

function serveStatic(request, response) {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";
  const fullPath = normalize(join(root, pathname));
  if (!fullPath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }
  if (!existsSync(fullPath)) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }
  response.writeHead(200, { "Content-Type": mimeTypes[extname(fullPath)] || "application/octet-stream" });
  createReadStream(fullPath).pipe(response);
}

const server = createServer((request, response) => {
  if (request.method === "GET" && request.url === "/api/health") {
    json(response, 200, { ok: true, service: "roadlink-trip-control" });
    return;
  }
  if (request.method === "POST" && request.url === "/api/send-email") {
    sendEmail(request, response).catch((error) => {
      json(response, 500, { ok: false, message: error.message || "Email send failed." });
    });
    return;
  }
  if (request.method === "GET" || request.method === "HEAD") {
    serveStatic(request, response);
    return;
  }
  response.writeHead(405);
  response.end("Method not allowed");
});

server.listen(port, () => {
  console.log(`Roadlink Trip Control running at http://127.0.0.1:${port}`);
});
