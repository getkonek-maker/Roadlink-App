import { createReadStream, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { createHash, createHmac, randomBytes, randomInt, scryptSync, timingSafeEqual } from "node:crypto";
import { dirname, extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 4173);

loadLocalEnv();

const dataPath = process.env.ROADLINK_DATA_PATH || join(root, ".data", "roadlink-store.json");

const sessionSecret = process.env.SESSION_SECRET || randomBytes(32).toString("hex");
if (!process.env.SESSION_SECRET) {
  console.warn("SESSION_SECRET is not set. Using a random per-boot secret; sessions will not survive a restart. Set SESSION_SECRET for production.");
}

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

const publicFiles = new Set([
  "/index.html",
  "/styles.css",
  "/app.js",
  "/walkthrough.js",
  "/demo-chat.js",
  "/manifest.webmanifest",
  "/sw.js"
]);

const securityHeaders = {
  "Content-Security-Policy": "default-src 'self'; base-uri 'self'; connect-src 'self'; font-src 'self'; form-action 'self'; frame-ancestors 'none'; img-src 'self' data:; media-src 'self'; object-src 'none'; script-src 'self'; style-src 'self'",
  "Permissions-Policy": "camera=(), geolocation=(), microphone=()",
  "Referrer-Policy": "no-referrer",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY"
};

const staffRoles = ["coordinator", "accounting", "owner", "admin"];
const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  funds: "Funds Released",
  cancelled: "Cancelled",
  needs: "Cancelled - Funds Released",
  reconciled: "Reconciled"
};

const seedData = {
  profiles: [
    { id: "USR-COORD", name: "Mika Santos", email: "mika@roadlink.example", role: "coordinator", roleLabel: "Coordinator", username: "mika.temp", passwordHash: hashPassword("Roadlink-8421"), company: "Roadlink", phone: "+63 917 420 1188", status: "active", initials: "MS", photo: "" },
    { id: "USR-ACCT", name: "Liza Mercado", email: "finance@roadlink.example", role: "accounting", roleLabel: "Accounting", username: "finance.temp", passwordHash: hashPassword("Roadlink-2198"), company: "Roadlink", phone: "+63 917 222 3321", status: "active", initials: "LM", photo: "" },
    { id: "USR-OWNER", name: "Emmanuel Garces", email: "owner@roadlink.example", role: "owner", roleLabel: "Owner / Manager", username: "owner.temp", passwordHash: hashPassword("Roadlink-6714"), company: "Roadlink", phone: "+63 917 333 7788", status: "active", initials: "EG", photo: "" },
    { id: "USR-ADMIN", name: "Roadlink Admin", email: "admin@roadlink.example", role: "admin", roleLabel: "Admin", username: "admin.temp", passwordHash: hashPassword("Roadlink-0047"), company: "Roadlink", phone: "+63 917 444 0047", status: "active", initials: "AD", photo: "" },
    { id: "CLIENT-MACTAN", name: "Ana Lim", email: "ana@mactanseafreight.example", role: "client", roleLabel: "Client", username: "ana.client", passwordHash: hashPassword("Client-2407"), company: "Mactan Seafoods Export", phone: "+63 917 420 1188", status: "active", initials: "AL", photo: "" }
  ],
  account_requests: [
    { id: "REQ-1008", name: "Joy Reyes", email: "joy.dispatch@roadlink.example", role: "Coordinator", status: "Pending", requestedAt: "Jul 2, 2026 11:20 AM", company: "Roadlink", phone: "" }
  ],
  clients: [
    { id: "CL-MACTAN", company: "Mactan Seafoods Export", authorizedContact: "Ana Lim", email: "ana@mactanseafreight.example", phone: "+63 917 420 1188" },
    { id: "CL-BUILDERS", company: "Lapu-Lapu Builders Depot", authorizedContact: "Jun Perez", email: "dispatch@lapulapubuilders.example", phone: "+63 918 222 3321" }
  ],
  booking_requests: [
    { id: "BR-7001", company: "Mactan Seafoods Export", contact: "Ana Lim", email: "ana@mactanseafreight.example", phone: "+63 917 420 1188", origin: "Mandaue City, Cebu", destination: "Tacloban City, Leyte", vehicle: "Wing van", date: "2026-07-16", cargo: "Chilled seafood cartons", status: "Needs staff review", createdAt: nowStamp(), clientId: "CLIENT-MACTAN" }
  ],
  trips: [
    {
      id: "RL-2407",
      client: "Mactan Seafoods Export",
      contact: "Ana Lim",
      phone: "+63 917 420 1188",
      email: "ana@mactanseafreight.example",
      route: "Mandaue City, Cebu to Ormoc City, Leyte",
      origin: "Mandaue City, Cebu",
      destination: "Ormoc City, Leyte",
      vehicle: "10-wheeler truck",
      date: "2026-07-08",
      cargo: "Frozen seafood pallets",
      coordinator: "Mika Santos",
      preferredChannel: "Email + Viber",
      status: "funds",
      cancelledReason: "",
      clientToken: makeToken(),
      clientTokenExpiresAt: futureIso(30),
      waybill: {
        number: "037957",
        shipmentNo: "RL-2407",
        plateNo: "GAA 4821",
        driverName: "Rodel Villanueva",
        truckType: "RCTS Truck",
        sellRate: 95000,
        freight: 42000,
        buyingRate: 70000,
        downpayment: 15000,
        balanceAmount: 55000,
        arrastre: 3500,
        driver: 4500,
        helper: 2500,
        labor: 2000,
        others: 3000,
        preparedBy: "Mika Santos",
        approvedBy: "",
        financeBy: "",
        paymentReceivedBy: "",
        status: "Draft"
      },
      budget: [
        { id: "BI-1", type: "Cash", detail: "Driver meals and port allowance", amount: 15000, state: "Released" },
        { id: "BI-2", type: "Cheque", detail: "Shipping line booking", amount: 42000, state: "Issued" },
        { id: "BI-3", type: "PO", detail: "Fuel partner Cebu station", amount: 18000, state: "Open" }
      ],
      reconciliation: { cashReturned: false, chequeVoided: false, poCancelled: false, expensesUsed: "" },
      timeline: [
        eventLine("Trip created by Mika Santos", "Jul 2, 2026 8:20 AM"),
        eventLine("Client confirmation link sent through email", "Jul 2, 2026 8:23 AM"),
        eventLine("Cash release logged by Accounting", "Jul 2, 2026 9:10 AM"),
        eventLine("Cheque and PO references attached", "Jul 2, 2026 9:18 AM")
      ]
    },
    {
      id: "RL-2410",
      client: "Lapu-Lapu Builders Depot",
      contact: "Jun Perez",
      phone: "+63 918 222 3321",
      email: "dispatch@lapulapubuilders.example",
      route: "Lapu-Lapu City, Cebu to Davao City, Davao del Sur",
      origin: "Lapu-Lapu City, Cebu",
      destination: "Davao City, Davao del Sur",
      vehicle: "Wing van",
      date: "2026-07-10",
      cargo: "Construction supplies",
      coordinator: "Carlo Reyes",
      preferredChannel: "Email only",
      status: "pending",
      cancelledReason: "",
      clientToken: makeToken(),
      clientTokenExpiresAt: futureIso(30),
      waybill: {
        number: "037958",
        shipmentNo: "RL-2410",
        plateNo: "",
        driverName: "",
        truckType: "Subcon Truck",
        sellRate: 0,
        freight: 0,
        buyingRate: 0,
        downpayment: 0,
        balanceAmount: 0,
        arrastre: 0,
        driver: 0,
        helper: 0,
        labor: 0,
        others: 0,
        preparedBy: "Carlo Reyes",
        approvedBy: "",
        financeBy: "",
        paymentReceivedBy: "",
        status: "Draft"
      },
      budget: [],
      reconciliation: { cashReturned: false, chequeVoided: false, poCancelled: false, expensesUsed: "" },
      timeline: [eventLine("Trip created by Carlo Reyes", "Jul 2, 2026 10:15 AM")]
    }
  ],
  notifications: [
    { id: "NT-1", role: "owner", title: "Waybill approvals", body: "Submitted waybills will appear here for manager approval.", createdAt: nowStamp(), read: false }
  ],
  client_actions: [],
  reconciliation_tasks: [],
  audit_events: [
    { id: "AUD-1", tripId: "RL-2407", actor: "Mika Santos", action: "trip_created", detail: "Seed trip created", createdAt: nowStamp() }
  ],
  password_reset_tokens: [],
  sheet_sync_log: []
};

function loadLocalEnv() {
  if (process.env.ROADLINK_DISABLE_LOCAL_ENV === "1") return;
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

function legacyPasswordHash(password) {
  return createHash("sha256").update(`${process.env.PASSWORD_PEPPER || "roadlink-demo"}:${password}`).digest("hex");
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("base64url");
  const derived = scryptSync(`${process.env.PASSWORD_PEPPER || "roadlink-demo"}:${password}`, salt, 64);
  return `scrypt$${salt}$${derived.toString("base64url")}`;
}

function hashOneTimeCode(code) {
  return createHmac("sha256", sessionSecret).update(String(code)).digest("base64url");
}

function signSession(profile) {
  const payload = { sub: profile.id, role: profile.role, sv: Number(profile.sessionVersion || 0), iat: Date.now(), exp: Date.now() + 12 * 60 * 60 * 1000 };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = createHmac("sha256", sessionSecret).update(body).digest("base64url");
  return `${body}.${signature}`;
}

function verifySession(token) {
  if (!token || !token.includes(".")) return null;
  const [body, signature] = token.split(".");
  const expected = createHmac("sha256", sessionSecret).update(body).digest("base64url");
  const given = Buffer.from(signature);
  const wanted = Buffer.from(expected);
  if (given.length !== wanted.length || !timingSafeEqual(given, wanted)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (!payload.sub || !payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

function getBearerToken(request) {
  const header = request.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.slice(7);
  const cookies = String(request.headers.cookie || "").split(";");
  const sessionCookie = cookies.map((value) => value.trim()).find((value) => value.startsWith("roadlink_session="));
  return sessionCookie ? decodeURIComponent(sessionCookie.slice("roadlink_session=".length)) : "";
}

function sessionCookie(token, request) {
  const forwardedProto = String(request.headers["x-forwarded-proto"] || "");
  const secure = forwardedProto === "https" || process.env.NODE_ENV === "production";
  return `roadlink_session=${encodeURIComponent(token)}; HttpOnly; Path=/; Max-Age=43200; SameSite=Lax${secure ? "; Secure" : ""}`;
}

function expiredSessionCookie(request) {
  const forwardedProto = String(request.headers["x-forwarded-proto"] || "");
  const secure = forwardedProto === "https" || process.env.NODE_ENV === "production";
  return `roadlink_session=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${secure ? "; Secure" : ""}`;
}

function appOrigin(request) {
  const configured = String(process.env.APP_ORIGIN || "").trim().replace(/\/$/, "");
  if (configured) return configured;
  const proto = request.headers["x-forwarded-proto"] || "http";
  return `${proto}://${request.headers.host}`;
}

async function requireRole(request, ...roles) {
  const claims = verifySession(getBearerToken(request));
  if (!claims) return { ok: false, status: 401, message: "Session expired or invalid. Please log in again." };
  const profiles = await tableList("profiles");
  const profile = profiles.find((item) => item.id === claims.sub);
  if (!profile || profile.status !== "active") return { ok: false, status: 401, message: "Account is no longer active." };
  if (Number(profile.sessionVersion || 0) !== Number(claims.sv || 0)) return { ok: false, status: 401, message: "Your account security changed. Please log in again." };
  if (roles.length && !roles.includes(profile.role)) return { ok: false, status: 403, message: "Not authorized for this action." };
  return { ok: true, profile: safeProfile(profile) };
}

const loginAttempts = new Map();
let emailOutboxProcessing = false;
const publicActionAttempts = new Map();

function requestIp(request) {
  return request?.headers["x-forwarded-for"]?.split(",")[0]?.trim() || request?.socket?.remoteAddress || "unknown";
}

function publicActionThrottled(key, maxAttempts, windowMs) {
  const now = Date.now();
  const entry = publicActionAttempts.get(key);
  if (!entry || now > entry.resetAt) {
    publicActionAttempts.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > maxAttempts;
}

function loginThrottled(key) {
  const now = Date.now();
  const entry = loginAttempts.get(key) || { count: 0, resetAt: now + 15 * 60 * 1000 };
  if (now > entry.resetAt) {
    loginAttempts.delete(key);
    return false;
  }
  return entry.count >= 5;
}

function recordLoginFailure(key) {
  const now = Date.now();
  const entry = loginAttempts.get(key) || { count: 0, resetAt: now + 15 * 60 * 1000 };
  if (now > entry.resetAt) {
    entry.count = 0;
    entry.resetAt = now + 15 * 60 * 1000;
  }
  entry.count += 1;
  loginAttempts.set(key, entry);
}

function safeProfile(profile) {
  if (!profile) return null;
  const { passwordHash, password_hash, ...rest } = profile;
  return rest;
}

function makeToken() {
  return randomBytes(24).toString("base64url");
}

function hashClientToken(token) {
  return createHmac("sha256", sessionSecret).update(String(token || "")).digest("base64url");
}

function clientTokenMatches(trip, token) {
  if (!token) return false;
  if (trip.clientTokenHash) {
    const given = Buffer.from(hashClientToken(token));
    const stored = Buffer.from(String(trip.clientTokenHash));
    return given.length === stored.length && timingSafeEqual(given, stored);
  }
  return Boolean(trip.clientToken && token === trip.clientToken);
}

function futureIso(days) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
}

function nowStamp() {
  return new Date().toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" });
}

function eventLine(text, at = nowStamp()) {
  return { text, at };
}

function json(response, status, payload, extraHeaders = {}) {
  response.writeHead(status, {
    ...securityHeaders,
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    ...extraHeaders
  });
  response.end(JSON.stringify(payload));
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    request.on("data", (chunk) => {
      body += chunk;
      if (body.length > 2_000_000) request.destroy();
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

function displayDate(value) {
  if (!value) return "For scheduling";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return value;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function waybillTotal(waybill = {}) {
  const cashOut = ["downpayment", "arrastre", "driver", "helper", "labor", "others"].reduce((sum, key) => sum + Number(waybill[key] || 0), 0);
  return Number(waybill.freight || 0) + cashOut;
}

function cleanText(value, label, maxLength = 500, required = false) {
  const text = String(value || "").trim().replace(/[\u0000-\u001f\u007f]/g, " ");
  if (required && !text) throw new Error(`${label} is required.`);
  if (text.length > maxLength) throw new Error(`${label} is too long.`);
  if (/[<>\"]/.test(text)) throw new Error(`${label} contains unsupported characters.`);
  return text;
}

function validateTripInput(raw) {
  const trip = raw.trip || raw;
  const email = cleanText(trip.email, "Authorized contact email", 254, true).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid authorized contact email.");
  const origin = cleanText(trip.origin || trip.from, "Origin", 180, true);
  const destination = cleanText(trip.destination || trip.to, "Destination", 180, true);
  if (origin.toLowerCase() === destination.toLowerCase()) throw new Error("Origin and destination must be different.");
  const date = cleanText(trip.date || trip.tripDate, "Trip date", 10, true);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(new Date(`${date}T00:00:00+08:00`).valueOf())) throw new Error("Enter a valid trip date.");
  return {
    ...trip,
    client: cleanText(trip.client || trip.company, "Company", 180, true),
    contact: cleanText(trip.contact || trip.authorizedContact, "Authorized contact", 140, true),
    phone: cleanText(trip.phone, "Authorized contact phone", 40, true),
    email,
    origin,
    destination,
    vehicle: cleanText(trip.vehicle || trip.vehicleType, "Vehicle type", 100, true),
    date,
    cargo: cleanText(trip.cargo || trip.cargoNotes, "Cargo notes", 1500),
    preferredChannel: cleanText(trip.preferredChannel || trip.extraChannel || "Email", "Preferred channel", 60)
  };
}

function normalizeTrip(raw) {
  const origin = raw.origin || raw.from || "";
  const destination = raw.destination || raw.to || "";
  const id = raw.id || `RL-${Math.floor(2500 + Math.random() * 7000)}`;
  const waybill = raw.waybill || {};
  return {
    id,
    clientId: raw.clientId || "",
    client: raw.client || raw.company || "",
    contact: raw.contact || raw.authorizedContact || "",
    phone: raw.phone || "",
    email: raw.email || "",
    route: raw.route || `${origin} to ${destination}`,
    origin,
    destination,
    vehicle: raw.vehicle || raw.vehicleType || "",
    date: raw.date || raw.tripDate || "",
    cargo: raw.cargo || raw.cargoNotes || "",
    coordinator: raw.coordinator || raw.actorName || "Roadlink Coordinator",
    preferredChannel: raw.preferredChannel || raw.extraChannel || "Email",
    status: raw.status || "pending",
    cancelledReason: raw.cancelledReason || "",
    clientToken: raw.clientToken || "",
    clientTokenHash: raw.clientTokenHash || "",
    clientTokenExpiresAt: raw.clientTokenExpiresAt || futureIso(7),
    version: Number(raw.version || 0),
    waybill: {
      number: waybill.number || String(Math.floor(38000 + Math.random() * 900)).padStart(6, "0"),
      shipmentNo: waybill.shipmentNo || id,
      plateNo: waybill.plateNo || raw.plateNo || "",
      driverName: waybill.driverName || "",
      truckType: waybill.truckType || "RCTS Truck",
      sellRate: Number(waybill.sellRate || 0),
      freight: Number(waybill.freight || 0),
      buyingRate: Number(waybill.buyingRate || 0),
      downpayment: Number(waybill.downpayment || 0),
      balanceAmount: Number(waybill.balanceAmount || 0),
      arrastre: Number(waybill.arrastre || 0),
      driver: Number(waybill.driver || 0),
      helper: Number(waybill.helper || 0),
      labor: Number(waybill.labor || 0),
      others: Number(waybill.others || 0),
      preparedBy: waybill.preparedBy || raw.actorName || "Roadlink Coordinator",
      approvedBy: waybill.approvedBy || "",
      financeBy: waybill.financeBy || "",
      paymentReceivedBy: waybill.paymentReceivedBy || "",
      shipper: waybill.shipper || raw.client || raw.company || "",
      consignee: waybill.consignee || raw.contact || raw.authorizedContact || "",
      destination: waybill.destination || destination,
      qty: waybill.qty || "1",
      cargo: waybill.cargo || raw.cargo || raw.cargoNotes || "",
      status: waybill.status || "Draft"
    },
    budget: Array.isArray(raw.budget) ? raw.budget : [],
    reconciliation: raw.reconciliation || { cashReturned: false, chequeVoided: false, poCancelled: false, expensesUsed: "" },
    timeline: Array.isArray(raw.timeline) && raw.timeline.length ? raw.timeline : [eventLine("Trip created in Roadlink Trip Control")]
  };
}

function readStore() {
  if (!existsSync(dataPath)) {
    mkdirSync(dirname(dataPath), { recursive: true });
    writeStore(seedData);
  }
  try {
    const parsed = JSON.parse(readFileSync(dataPath, "utf8"));
    return { ...structuredClone(seedData), ...parsed };
  } catch {
    return structuredClone(seedData);
  }
}

function writeStore(store) {
  mkdirSync(dirname(dataPath), { recursive: true });
  writeFileSync(dataPath, JSON.stringify(store, null, 2));
}

function supabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

async function supabaseFetch(pathname, options = {}) {
  const base = process.env.SUPABASE_URL.replace(/\/$/, "");
  const response = await fetch(`${base}${pathname}`, {
    ...options,
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...(options.headers || {})
    }
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(payload?.message || payload?.error_description || payload?.msg || payload?.error_code || payload?.hint || `Supabase request failed: ${response.status}`);
  return payload;
}

async function supabaseRpc(functionName, parameters) {
  return supabaseFetch(`/rest/v1/rpc/${encodeURIComponent(functionName)}`, {
    method: "POST",
    body: JSON.stringify(parameters)
  });
}

async function tableList(table, order = "created_at.desc") {
  if (!supabaseConfigured()) return readStore()[table] || [];
  return supabaseFetch(`/rest/v1/${table}?select=*&order=${order}`);
}

async function tableInsert(table, record) {
  if (!supabaseConfigured()) {
    const store = readStore();
    store[table] = [record, ...(store[table] || [])];
    writeStore(store);
    return record;
  }
  const rows = await supabaseFetch(`/rest/v1/${table}`, { method: "POST", body: JSON.stringify(record) });
  return Array.isArray(rows) ? rows[0] : record;
}

async function tableUpdate(table, id, patch, options = {}) {
  if (!supabaseConfigured()) {
    const store = readStore();
    const rows = store[table] || [];
    const index = rows.findIndex((item) => item.id === id);
    if (index >= 0 && options.expectedVersion !== undefined && Number(rows[index].version || 0) !== Number(options.expectedVersion)) {
      throw new Error("This record changed on another device. Refresh and try again.");
    }
    if (index >= 0) rows[index] = { ...rows[index], ...patch };
    writeStore(store);
    return rows[index];
  }
  const versionFilter = options.expectedVersion !== undefined ? `&version=eq.${encodeURIComponent(options.expectedVersion)}` : "";
  const rows = await supabaseFetch(`/rest/v1/${table}?id=eq.${encodeURIComponent(id)}${versionFilter}`, { method: "PATCH", body: JSON.stringify(patch) });
  if (options.expectedVersion !== undefined && (!Array.isArray(rows) || rows.length === 0)) throw new Error("This record changed on another device. Refresh and try again.");
  return Array.isArray(rows) ? rows[0] : patch;
}

function publicBootstrap() {
  const sender = String(process.env.ROADLINK_EMAIL_FROM || "");
  const operational = Boolean(
    supabaseConfigured() &&
    process.env.SESSION_SECRET &&
    process.env.APP_ORIGIN &&
    process.env.RESEND_API_KEY &&
    sender && !sender.includes("onboarding@resend.dev") &&
    process.env.GOOGLE_SHEETS_WEBHOOK_URL &&
    process.env.GOOGLE_SHEETS_WEBHOOK_SECRET
  );
  return {
    mode: supabaseConfigured() ? "supabase" : "local-demo",
    googleSheets: Boolean(process.env.GOOGLE_SHEETS_WEBHOOK_URL),
    email: Boolean(process.env.RESEND_API_KEY),
    operational
  };
}

function clientStatus(status) {
  if (status === "funds") return "confirmed";
  if (status === "reconciled" || status === "needs") return "cancelled";
  return status;
}

function clientTripView(trip) {
  return {
    id: trip.id,
    client: trip.client,
    contact: trip.contact,
    phone: trip.phone,
    email: trip.email,
    route: trip.route,
    origin: trip.origin,
    destination: trip.destination,
    vehicle: trip.vehicle,
    date: trip.date,
    cargo: trip.cargo,
    status: clientStatus(trip.status),
    cancelledReason: trip.cancelledReason,
    timeline: [],
    budget: [],
    waybill: { number: trip.waybill?.number || "", shipmentNo: trip.waybill?.shipmentNo || trip.id, plateNo: trip.waybill?.plateNo || "" },
    reconciliation: { cashReturned: false, chequeVoided: false, poCancelled: false, expensesUsed: "" }
  };
}

function staffTripView(trip) {
  const view = { ...trip };
  delete view.clientToken;
  delete view.clientTokenHash;
  return view;
}

function clientOwnsTrip(trip, profile) {
  if (profile.clientId) return trip.clientId === profile.clientId;
  return (profile.company && trip.client === profile.company) || (profile.email && trip.email === profile.email);
}

async function sessionBootstrap(profile) {
  const [profiles, accountRequests, clients, bookingRequests, trips, notifications, auditEvents] = await Promise.all([
    tableList("profiles"),
    tableList("account_requests"),
    tableList("clients"),
    tableList("booking_requests"),
    tableList("trips"),
    tableList("notifications"),
    tableList("audit_events")
  ]);
  const normalizedTrips = trips.map(normalizeTrip);
  const base = { ...publicBootstrap(), profile };

  if (profile.role === "client") {
    return {
      ...base,
      profiles: [],
      accountRequests: [],
      clients: [],
      bookingRequests: bookingRequests.filter((item) => (profile.company && item.company === profile.company) || (profile.email && item.email === profile.email)),
      trips: normalizedTrips.filter((trip) => clientOwnsTrip(trip, profile)).map(clientTripView),
      notifications: [],
      auditEvents: []
    };
  }

  if (profile.role === "coordinator") {
    return {
      ...base,
      profiles: [safeProfile(profiles.find((item) => item.id === profile.id))].filter(Boolean),
      accountRequests: [],
      clients,
      bookingRequests,
      trips: normalizedTrips.map(staffTripView),
      notifications: notifications.filter((item) => item.role === "coordinator"),
      auditEvents: []
    };
  }

  if (profile.role === "accounting") {
    return {
      ...base,
      profiles: [safeProfile(profiles.find((item) => item.id === profile.id))].filter(Boolean),
      accountRequests: [],
      clients: [],
      bookingRequests: [],
      trips: normalizedTrips.map(staffTripView),
      notifications: notifications.filter((item) => item.role === "accounting"),
      auditEvents
    };
  }

  return {
    ...base,
    profiles: profiles.map(safeProfile),
    accountRequests,
    clients,
    bookingRequests,
    trips: normalizedTrips.map(staffTripView),
    notifications,
    auditEvents
  };
}

async function findTrip(id) {
  const trips = await tableList("trips");
  return trips.map(normalizeTrip).find((trip) => trip.id === id);
}

async function saveTrip(trip) {
  const normalized = normalizeTrip(trip);
  const existing = await findTrip(normalized.id);
  const storedTrip = { ...normalized };
  delete storedTrip.clientToken;
  if (!existing) {
    storedTrip.version = 1;
    return tableInsert("trips", storedTrip);
  }
  const expectedVersion = Number(normalized.version || existing.version || 0);
  storedTrip.version = expectedVersion + 1;
  return tableUpdate("trips", normalized.id, storedTrip, { expectedVersion });
}

async function addAudit({ tripId = "", actor = "System", action, detail }) {
  const event = { id: `AUD-${Date.now()}-${Math.floor(Math.random() * 999)}`, tripId, actor, action, detail, createdAt: nowStamp() };
  await tableInsert("audit_events", event);
  return event;
}

async function addNotification({ role, title, body, tripId = "" }) {
  return tableInsert("notifications", { id: `NT-${Date.now()}-${Math.floor(Math.random() * 999)}`, role, title, body, tripId, createdAt: nowStamp(), read: false });
}

async function syncGoogleSheets(kind, payload) {
  if (!process.env.GOOGLE_SHEETS_WEBHOOK_URL) return { ok: false, skipped: true, message: "GOOGLE_SHEETS_WEBHOOK_URL is not configured." };
  const safePayload = sheetMirrorPayload(payload);
  const eventId = `RLSYNC-${Date.now()}-${randomBytes(6).toString("hex")}`;
  const response = await fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ eventId, kind, payload: safePayload, sentAt: new Date().toISOString(), source: "roadlink-trip-control", secret: process.env.GOOGLE_SHEETS_WEBHOOK_SECRET || "" })
  });
  const resultText = await response.text();
  let result = {};
  try { result = JSON.parse(resultText); } catch { result = { ok: false, message: resultText }; }
  const ok = response.ok && result.ok === true;
  await tableInsert("sheet_sync_log", { id: `SYNC-${Date.now()}`, kind, status: ok ? "synced" : "failed", message: String(result.message || resultText).slice(0, 400), createdAt: nowStamp() });
  if (!ok) throw new Error(result.message || "Google Sheets rejected the sync event.");
  return { ok: true, message: result.message || "Synced" };
}

function sheetMirrorTrip(trip = {}) {
  const waybill = trip.waybill || {};
  const reconciliation = trip.reconciliation || {};
  return {
    id: trip.id || "",
    client: trip.client || trip.company || "",
    contact: trip.contact || trip.authorizedContact || "",
    phone: trip.phone || "",
    email: trip.email || "",
    route: trip.route || ((trip.origin || trip.destination) ? `${trip.origin || "?"} to ${trip.destination || "?"}` : ""),
    origin: trip.origin || "",
    destination: trip.destination || "",
    vehicle: trip.vehicle || "",
    date: trip.date || "",
    status: trip.status || "",
    coordinator: trip.coordinator || "",
    cancelledReason: trip.cancelledReason || "",
    waybill: {
      number: waybill.number || "",
      preparedBy: waybill.preparedBy || "",
      approvedBy: waybill.approvedBy || "",
      financeBy: waybill.financeBy || "",
      status: waybill.status || "",
      freight: Number(waybill.freight || 0),
      downpayment: Number(waybill.downpayment || 0),
      arrastre: Number(waybill.arrastre || 0),
      driver: Number(waybill.driver || 0),
      helper: Number(waybill.helper || 0),
      labor: Number(waybill.labor || 0),
      others: Number(waybill.others || 0)
    },
    reconciliation: {
      cashReturned: Boolean(reconciliation.cashReturned),
      chequeVoided: Boolean(reconciliation.chequeVoided),
      poCancelled: Boolean(reconciliation.poCancelled),
      expensesUsed: reconciliation.expensesUsed || ""
    }
  };
}

function sheetMirrorPayload(payload = {}) {
  if (payload.trip) {
    return {
      trip: sheetMirrorTrip(payload.trip),
      ...(payload.item ? { item: {
        id: payload.item.id || "",
        type: payload.item.type || "",
        detail: payload.item.detail || "",
        amount: Number(payload.item.amount || 0),
        state: payload.item.state || ""
      } } : {})
    };
  }
  return sheetMirrorTrip(payload);
}

function assetDataUri(relativePath, contentType) {
  const fullPath = join(root, relativePath);
  if (!existsSync(fullPath)) return "";
  return `data:${contentType};base64,${readFileSync(fullPath).toString("base64")}`;
}

function roadlinkEmailShell({ title, preview, body, actions = [], trip }) {
  const publicOrigin = String(process.env.APP_ORIGIN || "").replace(/\/$/, "");
  const signatureImage = publicOrigin
    ? `${publicOrigin}/assets/email-signature-trucks.png`
    : assetDataUri("assets/email-signature-trucks.png", "image/png");
  const logo = `
    <div style="font-style:italic;font-weight:900;font-size:42px;line-height:.9;color:#b9bec8;text-shadow:1px 1px 0 #4d5564,-1px -1px 0 #ffffff;">Roadlink</div>
    <div style="margin-top:4px;font-size:13px;font-weight:900;letter-spacing:.06em;color:#111827;">CARGO TRANSPORT SERVICE</div>
    <div style="height:5px;background:#ed1c2e;margin-top:10px;border-radius:999px;"></div>
    <div style="height:8px;width:72%;margin-left:18%;background:#163abf;transform:skewX(-22deg);"></div>
    <div style="margin-top:7px;font-size:12px;font-weight:900;color:#374151;">We Go Wherever Roads Go!</div>
  `;
  const truckSignature = `
    <div style="margin-top:22px;border-radius:14px;overflow:hidden;border:1px solid #d6dce8;background:#ffffff;">
      ${signatureImage ? `<img src="${signatureImage}" alt="Roadlink Cargo Transport Service fleet - We Go Wherever Roads Go!" style="display:block;width:100%;height:auto;border:0;">` : `<div style="padding:18px 20px;color:#101a68;font-weight:900;">Roadlink Cargo Transport Service<br><span style="color:#374151;">We Go Wherever Roads Go!</span></div>`}
      <div style="padding:12px 16px;border-top:4px solid #ed1c2e;">${logo}</div>
    </div>
  `;
  const actionMarkup = actions.length ? `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:24px 0 4px;width:100%;"><tr>
      ${actions.map((action) => `<td style="padding:4px 6px 4px 0;"><a href="${escapeHtml(action.url)}" style="display:inline-block;border-radius:10px;border-bottom:4px solid ${escapeHtml(action.accent || "#ed1c2e")};background:${escapeHtml(action.background || "#101a68")};padding:13px 15px;color:#ffffff;text-decoration:none;font-weight:900;font-size:13px;">${escapeHtml(action.label)}</a></td>`).join("")}
    </tr></table>` : "";

  return `<!doctype html><html><body style="margin:0;background:#f3f6fb;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <div style="display:none;max-height:0;overflow:hidden;">${escapeHtml(preview)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f6fb;padding:24px 12px;"><tr><td align="center">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border:1px solid #d9e0ec;border-radius:16px;overflow:hidden;">
      <tr><td style="padding:24px 28px 18px;border-bottom:4px solid #ed1c2e;">${logo}</td></tr>
      <tr><td style="padding:28px;"><h1 style="margin:0 0 12px;font-size:24px;line-height:1.2;color:#101a68;">${escapeHtml(title)}</h1>${body}${actionMarkup}${truckSignature}
      <div style="margin-top:18px;padding-top:14px;border-top:1px solid #d9e0ec;color:#5b6472;font-size:12px;line-height:1.5;"><strong>Roadlink Cargo Transport Service</strong><br>Lapu-Lapu City, Cebu, Philippines<br>This message relates to Roadlink trip ${escapeHtml(trip?.id || "")}.</div>
      <div style="margin-top:14px;color:#6b7280;font-size:11px;line-height:1.45;">Confidentiality Notice: This email and any related trip details are intended only for the authorized recipient. If you received this message by mistake, please notify Roadlink and delete it. Unauthorized review, use, disclosure, or distribution is prohibited.</div>
      </td></tr>
      <tr><td style="padding:14px 28px;background:#f8fafc;border-top:1px solid #d9e0ec;color:#334155;font-size:13px;"><span style="display:inline-block;width:20px;height:20px;margin-right:8px;border-radius:6px;background:#0fba81;color:#fff;text-align:center;line-height:20px;font-weight:900;">K</span>Powered by <strong style="color:#14304a;">Konek</strong></td></tr>
    </table></td></tr></table></body></html>`;
}

function tripRows(trip) {
  const rows = [
    ["Company", trip.client], ["Authorized contact", trip.contact], ["Phone", trip.phone], ["From", trip.origin || "For encoding"], ["To", trip.destination || "For encoding"], ["Vehicle type", trip.vehicle], ["Plate number", trip.waybill?.plateNo || "For assignment"], ["Trip date", displayDate(trip.date)], ["Cargo notes", trip.cargo || "None provided"]
  ];
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;border:1px solid #d9e0ec;border-radius:12px;overflow:hidden;">${rows.map(([label, value]) => `<tr><td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e5eaf2;color:#5b6472;font-size:12px;font-weight:800;width:38%;">${escapeHtml(label)}</td><td style="padding:10px 12px;border-bottom:1px solid #e5eaf2;color:#111827;font-size:13px;">${escapeHtml(value)}</td></tr>`).join("")}</table>`;
}

function buildConfirmationEmail(trip, origin) {
  const tokenParam = trip.clientToken ? `&token=${encodeURIComponent(trip.clientToken)}` : "";
  const clientUrl = `${origin}/?trip=${encodeURIComponent(trip.id)}${tokenParam}#client`;
  const confirmUrl = `${origin}/?trip=${encodeURIComponent(trip.id)}&intent=confirm${tokenParam}#client`;
  const cancelUrl = `${origin}/?trip=${encodeURIComponent(trip.id)}&intent=cancel${tokenParam}#client`;
  const contactUrl = `${origin}/?trip=${encodeURIComponent(trip.id)}&intent=contact${tokenParam}#client`;
  const body = `<p style="margin:0 0 12px;line-height:1.6;">Dear ${escapeHtml(trip.contact)},</p><p style="margin:0 0 12px;line-height:1.6;">Roadlink Cargo Transport Service is requesting your confirmation for the trip below. Please review the details and choose one of the actions below.</p>${tripRows(trip)}<p style="margin:16px 0 0;line-height:1.6;color:#5b6472;">For accountability, cancellations and confirmations submitted through this link are recorded in Roadlink Trip Control.</p>`;
  return {
    to: [trip.email],
    subject: `Roadlink booking confirmation - ${trip.route} (${displayDate(trip.date)})`,
    html: roadlinkEmailShell({ title: "Please confirm your Roadlink trip", preview: `Confirm Roadlink trip ${trip.route} on ${displayDate(trip.date)}`, body, actions: [
      { label: "Confirm Booking", url: confirmUrl, background: "#166534", accent: "#22c55e" },
      { label: "Cancel Booking", url: cancelUrl, background: "#b91c1c", accent: "#ed1c2e" },
      { label: "Contact Roadlink", url: contactUrl, background: "#101a68", accent: "#163abf" }
    ], trip }),
    text: `Dear ${trip.contact},\n\nPlease confirm your Roadlink trip.\n\nFrom: ${trip.origin || "For encoding"}\nTo: ${trip.destination || "For encoding"}\nCompany: ${trip.client}\nVehicle: ${trip.vehicle}\nPlate: ${trip.waybill?.plateNo || "For assignment"}\nDate: ${displayDate(trip.date)}\nCargo: ${trip.cargo || "None provided"}\n\nConfirm: ${confirmUrl}\nCancel: ${cancelUrl}\nContact Roadlink: ${contactUrl}\nReview: ${clientUrl}\n\nRoadlink Cargo Transport Service\nWe Go Wherever Roads Go!\nPowered by Konek`
  };
}

function buildWaybillEmail(trip) {
  const waybill = trip.waybill || {};
  const body = `<p style="margin:0 0 12px;line-height:1.6;">Hello,</p><p style="margin:0 0 12px;line-height:1.6;">Please see the Roadlink waybill details below for reference.</p>${tripRows(trip)}<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;border:1px solid #d9e0ec;border-radius:12px;overflow:hidden;">${[["Waybill number", waybill.number], ["Shipment number", waybill.shipmentNo], ["Driver", waybill.driverName || "For encoding"], ["Prepared by", waybill.preparedBy || "For encoding"], ["Manager approval", waybill.approvedBy || "Pending"], ["Finance approval", waybill.financeBy || "Pending"], ["Overall total", money(waybillTotal(waybill))]].map(([label, value]) => `<tr><td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e5eaf2;color:#5b6472;font-size:12px;font-weight:800;width:38%;">${escapeHtml(label)}</td><td style="padding:10px 12px;border-bottom:1px solid #e5eaf2;color:#111827;font-size:13px;">${escapeHtml(value)}</td></tr>`).join("")}</table>`;
  return {
    to: [trip.email],
    subject: `Roadlink waybill ${waybill.number} - ${trip.route}`,
    html: roadlinkEmailShell({ title: `Waybill ${waybill.number}`, preview: `Roadlink waybill details for ${trip.route}`, body, actions: [], trip }),
    text: `Roadlink waybill ${waybill.number}\n\nFrom: ${trip.origin || "For encoding"}\nTo: ${trip.destination || "For encoding"}\nCompany: ${trip.client}\nVehicle: ${trip.vehicle}\nPlate: ${waybill.plateNo || "For assignment"}\nDate: ${displayDate(trip.date)}\nPrepared by: ${waybill.preparedBy || "For encoding"}\nManager approval: ${waybill.approvedBy || "Pending"}\nFinance approval: ${waybill.financeBy || "Pending"}\n\nRoadlink Cargo Transport Service\nWe Go Wherever Roads Go!\nPowered by Konek`
  };
}

async function sendViaResend(email, kind, trip) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, skipped: true, message: "Email service is not configured. Add RESEND_API_KEY and restart/redeploy." };
  const from = process.env.ROADLINK_EMAIL_FROM || "Roadlink Trip Control <onboarding@resend.dev>";
  const resendResponse = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `${kind}-${trip?.id || Date.now()}-${Date.now()}` },
    body: JSON.stringify({ from, to: email.to, subject: email.subject, html: email.html, text: email.text, tags: [{ name: "app", value: "roadlink_trip_control" }, { name: "kind", value: kind }] })
  });
  const result = await resendResponse.json().catch(() => ({}));
  if (!resendResponse.ok) return { ok: false, status: resendResponse.status, message: result.message || result.error || "Resend rejected the email request.", to: email.to };
  return { ok: true, id: result.id, to: email.to, message: `Email accepted by Resend for ${email.to.join(", ")}.` };
}

async function sendEmailKind(kind, trip, request) {
  const origin = appOrigin(request);
  const email = kind === "waybill" ? buildWaybillEmail(trip) : buildConfirmationEmail(trip, origin);
  const result = await sendViaResend(email, kind, trip);
  if (!result.ok && supabaseConfigured() && ["confirmation", "waybill"].includes(kind)) {
    await queueTripEmail(kind, trip, email.to?.[0] || trip.email, result.message || "Email delivery failed.");
    return { ...result, queued: true, message: `${result.message || "Email delivery failed."} The message was queued for automatic retry.` };
  }
  return result;
}

async function queueTripEmail(kind, trip, recipient, errorMessage) {
  const rows = await tableList("email_outbox", "created_at.asc");
  const existing = rows.find((item) => item.tripId === trip.id && item.kind === kind && ["queued", "failed"].includes(item.status));
  const patch = {
    recipient,
    status: "queued",
    nextAttemptAt: new Date(Date.now() + 60_000).toISOString(),
    lastError: String(errorMessage || "").slice(0, 500)
  };
  if (existing) return tableUpdate("email_outbox", existing.id, patch);
  return tableInsert("email_outbox", {
    id: `EMAIL-${Date.now()}-${randomBytes(5).toString("hex")}`,
    kind,
    tripId: trip.id,
    ...patch,
    attempts: 0
  });
}

async function processEmailOutbox() {
  if (emailOutboxProcessing || !supabaseConfigured() || !process.env.RESEND_API_KEY) return;
  emailOutboxProcessing = true;
  try {
    const rows = await tableList("email_outbox", "created_at.asc");
    const due = rows.filter((item) => ["queued", "failed"].includes(item.status) && new Date(item.nextAttemptAt || 0) <= new Date()).slice(0, 10);
    for (const item of due) {
      let trip = await findTrip(item.tripId);
      if (!trip) {
        await tableUpdate("email_outbox", item.id, { status: "dead", lastError: "Trip no longer exists." });
        continue;
      }
      if (item.kind === "confirmation") trip = await tripForConfirmationEmail(trip);
      const email = item.kind === "waybill" ? buildWaybillEmail(trip) : buildConfirmationEmail(trip, process.env.APP_ORIGIN);
      const result = await sendViaResend(email, item.kind, trip).catch((error) => ({ ok: false, message: error.message }));
      const attempts = Number(item.attempts || 0) + 1;
      if (result.ok) {
        await tableUpdate("email_outbox", item.id, { status: "sent", attempts, lastError: "", sent_at: new Date().toISOString() });
      } else {
        const dead = attempts >= 8;
        const delayMinutes = Math.min(2 ** attempts, 60);
        await tableUpdate("email_outbox", item.id, {
          status: dead ? "dead" : "failed",
          attempts,
          nextAttemptAt: new Date(Date.now() + delayMinutes * 60_000).toISOString(),
          lastError: String(result.message || "Email retry failed.").slice(0, 500)
        });
      }
    }
  } catch (error) {
    console.error("Roadlink email outbox failed:", error);
  } finally {
    emailOutboxProcessing = false;
  }
}

async function tripForConfirmationEmail(trip) {
  const token = makeToken();
  trip.clientToken = token;
  trip.clientTokenHash = hashClientToken(token);
  trip.clientTokenExpiresAt = futureIso(7);
  await saveTrip(trip);
  return trip;
}

function passwordMatches(profile, password) {
  if (!profile?.passwordHash || !password) return false;
  const storedValue = String(profile.passwordHash);
  if (!storedValue.startsWith("scrypt$")) {
    const givenLegacy = Buffer.from(legacyPasswordHash(password));
    const storedLegacy = Buffer.from(storedValue);
    return givenLegacy.length === storedLegacy.length && timingSafeEqual(givenLegacy, storedLegacy);
  }
  const [, salt, encoded] = storedValue.split("$");
  if (!salt || !encoded) return false;
  const given = scryptSync(`${process.env.PASSWORD_PEPPER || "roadlink-demo"}:${password}`, salt, 64);
  const stored = Buffer.from(encoded, "base64url");
  return given.length === stored.length && timingSafeEqual(given, stored);
}

function passwordPolicyError(password) {
  const value = String(password || "");
  if (value.length < 12) return "Password must be at least 12 characters.";
  if (!/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/[0-9]/.test(value)) return "Password must include uppercase, lowercase, and a number.";
  return "";
}

async function handleLogin(payload, request) {
  const username = String(payload.username || payload.email || "").trim();
  const password = String(payload.password || "").trim();
  const requestedRole = String(payload.role || "").trim();
  const clientIp = requestIp(request);
  const throttleKey = `${clientIp}:${username.toLowerCase()}`;
  if (loginThrottled(throttleKey)) return { ok: false, status: 429, message: "Too many login attempts. Try again in 15 minutes." };
  if (!username || !password) return { ok: false, status: 400, message: "Enter your email and password." };

  const identifier = username.toLowerCase();
  const profiles = await tableList("profiles");
  const profile = profiles.find((item) =>
    String(item.email || "").toLowerCase() === identifier || String(item.username || "").toLowerCase() === identifier);

  if (!profile || profile.status !== "active" || !passwordMatches(profile, password)) {
    recordLoginFailure(throttleKey);
    return { ok: false, status: 401, message: "Incorrect email or password. Use Forgot password if you need to reset it." };
  }
  if (requestedRole && requestedRole !== profile.role) {
    recordLoginFailure(throttleKey);
    return { ok: false, status: 403, message: `This account is registered as ${profile.roleLabel || profile.role}. Pick that role on the login screen and try again.` };
  }
  if (!String(profile.passwordHash || "").startsWith("scrypt$")) {
    await tableUpdate("profiles", profile.id, { passwordHash: hashPassword(password) });
  }
  loginAttempts.delete(throttleKey);
  return { ok: true, session: { accessToken: signSession(profile), profile: safeProfile(profile) } };
}

function buildResetCodeEmail(profile, code) {
  const body = `<p style="margin:0 0 12px;line-height:1.6;">Dear ${escapeHtml(profile.name)},</p><p style="margin:0 0 12px;line-height:1.6;">Use this one-time code to reset your Roadlink Trip Control password. It expires in 15 minutes.</p><div style="margin:18px 0;padding:18px;border:1px solid #d9e0ec;border-radius:12px;background:#f8fafc;text-align:center;font-size:32px;font-weight:900;letter-spacing:.35em;color:#101a68;">${escapeHtml(code)}</div><p style="margin:0;line-height:1.6;color:#5b6472;">If you did not request this, you can ignore this email — your password stays the same.</p>`;
  return {
    to: [profile.email],
    subject: "Your Roadlink password reset code",
    html: roadlinkEmailShell({ title: "Password reset code", preview: "Your one-time Roadlink reset code", body, actions: [], trip: null }),
    text: `Dear ${profile.name},\n\nYour Roadlink Trip Control password reset code is: ${code}\n\nIt expires in 15 minutes. If you did not request this, ignore this email.\n\nRoadlink Cargo Transport Service\nPowered by Konek`
  };
}

async function handleForgotPassword(payload, request) {
  const email = String(payload.email || "").trim().toLowerCase();
  if (!email.includes("@")) return { ok: false, status: 400, message: "Enter the email address on your Roadlink account." };
  if (publicActionThrottled(`reset:${requestIp(request)}:${email}`, 3, 60 * 60 * 1000)) return { ok: false, status: 429, message: "Too many reset requests. Try again later or ask an administrator for help." };
  const generic = { ok: true, message: "If that email has a Roadlink account, a reset code is on its way. Check your inbox and spam folder." };
  const profiles = await tableList("profiles");
  const profile = profiles.find((item) => String(item.email || "").toLowerCase() === email && item.status === "active");
  if (!profile) return generic;

  const code = String(randomInt(100000, 1000000));
  const resetRecord = { id: `RST-${Date.now()}-${randomInt(1000, 9999)}`, email, codeHash: hashOneTimeCode(code), expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), attempts: 0, used: false };
  await tableInsert("password_reset_tokens", resetRecord);
  const emailResult = await sendViaResend(buildResetCodeEmail(profile, code), "password_reset", null).catch((error) => ({ ok: false, message: error.message }));
  if (!emailResult.ok) {
    await tableUpdate("password_reset_tokens", resetRecord.id, { used: true });
    return { ok: false, status: 502, message: `Could not send the reset email (${emailResult.message || "email service unavailable"}). Ask an owner or admin to reset your password from the Users screen instead.` };
  }
  await addAudit({ actor: profile.name, action: "password_reset_requested", detail: `Reset code emailed to ${email}` });
  return generic;
}

async function handleResetPassword(payload) {
  const email = String(payload.email || "").trim().toLowerCase();
  const code = String(payload.code || "").trim();
  const password = String(payload.password || "");
  const policyError = passwordPolicyError(password);
  if (policyError) return { ok: false, status: 400, message: policyError };

  const entries = await tableList("password_reset_tokens");
  const entry = entries.find((item) => String(item.email || "").toLowerCase() === email && !item.used);
  if (!entry || new Date(entry.expiresAt).valueOf() < Date.now()) {
    if (entry) await tableUpdate("password_reset_tokens", entry.id, { used: true });
    return { ok: false, status: 400, message: "This reset code is invalid or expired. Request a new one." };
  }
  const attempts = Number(entry.attempts || 0) + 1;
  await tableUpdate("password_reset_tokens", entry.id, { attempts });
  if (attempts > 5) {
    await tableUpdate("password_reset_tokens", entry.id, { used: true });
    return { ok: false, status: 429, message: "Too many wrong attempts. Request a new reset code." };
  }
  if (entry.codeHash !== hashOneTimeCode(code)) return { ok: false, status: 400, message: "That code does not match. Check the email and try again." };

  const profiles = await tableList("profiles");
  const profile = profiles.find((item) => String(item.email || "").toLowerCase() === email && item.status === "active");
  if (!profile) return { ok: false, status: 404, message: "No active account uses that email." };
  await tableUpdate("profiles", profile.id, { passwordHash: hashPassword(password), sessionVersion: Number(profile.sessionVersion || 0) + 1 });
  await tableUpdate("password_reset_tokens", entry.id, { used: true });
  await addAudit({ actor: profile.name, action: "password_reset", detail: `${email} reset their password with an emailed code` });
  return { ok: true, message: "Password updated. Log in with your new password." };
}

async function handleChangePassword(payload, actor) {
  const currentPassword = String(payload.currentPassword || "");
  const newPassword = String(payload.newPassword || "");
  const policyError = passwordPolicyError(newPassword);
  if (policyError) return { ok: false, status: 400, message: policyError };
  const profiles = await tableList("profiles");
  const profile = profiles.find((item) => item.id === actor.id);
  if (!profile || !passwordMatches(profile, currentPassword)) return { ok: false, status: 403, message: "Current password is incorrect." };
  await tableUpdate("profiles", profile.id, { passwordHash: hashPassword(newPassword), sessionVersion: Number(profile.sessionVersion || 0) + 1 });
  await addAudit({ actor: profile.name, action: "password_changed", detail: `${profile.email} changed their password` });
  return { ok: true, message: "Password changed." };
}

async function handleAdminResetPassword(payload, actor, httpRequest) {
  const profiles = await tableList("profiles");
  const profile = profiles.find((item) => item.id === payload.profileId);
  if (!profile) return { ok: false, status: 404, message: "User not found." };
  const tempPassword = `Roadlink-${randomBytes(4).toString("hex")}`;
  await tableUpdate("profiles", profile.id, { passwordHash: hashPassword(tempPassword), sessionVersion: Number(profile.sessionVersion || 0) + 1 });
  await addAudit({ actor: actor?.name || "Admin", action: "password_admin_reset", detail: `${actor?.name || "Admin"} issued a new temporary password for ${profile.email}` });

  let emailResult = { ok: false, skipped: true, message: "Email service is not configured." };
  if (httpRequest) {
    const origin = appOrigin(httpRequest);
    emailResult = await sendViaResend(
      buildCredentialsEmail({ name: profile.name, email: profile.email, role: profile.roleLabel || profile.role }, tempPassword, origin),
      "credentials",
      null
    ).catch((error) => ({ ok: false, message: error.message }));
  }
  return { ok: true, credentials: { username: profile.username || profile.email, password: tempPassword }, email: emailResult };
}

async function handleSetUserStatus(payload, actor) {
  const status = payload.status === "suspended" ? "suspended" : "active";
  if (payload.profileId === actor.id) return { ok: false, status: 400, message: "You cannot suspend your own account." };
  const profiles = await tableList("profiles");
  const profile = profiles.find((item) => item.id === payload.profileId);
  if (!profile) return { ok: false, status: 404, message: "User not found." };
  await tableUpdate("profiles", profile.id, { status, sessionVersion: Number(profile.sessionVersion || 0) + 1 });
  await addAudit({ actor: actor?.name || "Admin", action: status === "suspended" ? "user_suspended" : "user_activated", detail: `${profile.email} set to ${status}` });
  return { ok: true, profile: safeProfile({ ...profile, status }) };
}

async function handleCreateTrip(payload, request, actor) {
  let validated;
  try { validated = validateTripInput(payload); } catch (error) { return { ok: false, status: 400, message: error.message }; }
  if (!validated.id) validated.id = `RL-${Date.now().toString(36).toUpperCase()}`;
  const trip = normalizeTrip(validated);
  const clients = await tableList("clients");
  let client = clients.find((item) => String(item.company || "").toLowerCase() === trip.client.toLowerCase() || String(item.email || "").toLowerCase() === trip.email.toLowerCase());
  if (!client) {
    client = { id: `CL-${Date.now().toString(36).toUpperCase()}`, company: trip.client, authorizedContact: trip.contact, email: trip.email, phone: trip.phone };
    await tableInsert("clients", client);
  }
  trip.clientId = client.id;
  trip.clientToken = makeToken();
  trip.clientTokenHash = hashClientToken(trip.clientToken);
  trip.clientTokenExpiresAt = futureIso(7);
  if (actor) {
    trip.coordinator = actor.name;
    trip.waybill.preparedBy = actor.name;
  }
  trip.timeline.push(eventLine(`Confirmation email queued for ${trip.email}`));
  await saveTrip(trip);
  await addAudit({ tripId: trip.id, actor: trip.coordinator, action: "trip_created", detail: `${trip.route} for ${trip.client}` });
  await addNotification({ role: "owner", tripId: trip.id, title: "New trip created", body: `${trip.route} is waiting for client confirmation.` });
  await syncGoogleSheets("trip_created", trip).catch((error) => console.warn(error.message));
  const emailResult = await sendEmailKind("confirmation", trip, request).catch((error) => ({ ok: false, message: error.message }));
  return {
    ok: true,
    trip: staffTripView(trip),
    email: emailResult,
    ...(!supabaseConfigured() ? { demoClientToken: trip.clientToken } : {})
  };
}

async function handleClientAction(payload) {
  const action = String(payload.action || "contact");
  if (!new Set(["confirm", "cancel", "contact"]).has(action)) return { ok: false, status: 400, message: "Unknown client action." };
  const trip = await findTrip(payload.tripId);
  if (!trip) return { ok: false, status: 404, message: "Trip not found." };
  if (!clientTokenMatches(trip, payload.token)) return { ok: false, status: 403, message: "This client link is invalid." };
  if (trip.clientTokenExpiresAt && new Date(trip.clientTokenExpiresAt) < new Date()) return { ok: false, status: 403, message: "This client link has expired." };

  let reason = "";
  if (action === "cancel") {
    try {
      reason = cleanText(payload.reason || "Client cancelled through secure link.", "Cancellation reason", 500, true);
    } catch (error) {
      return { ok: false, status: 400, message: error.message };
    }
  }

  if (supabaseConfigured()) {
    const eventId = `CA-${Date.now()}-${randomBytes(5).toString("hex")}`;
    const updated = normalizeTrip(await supabaseRpc("roadlink_client_action", {
      p_trip_id: trip.id,
      p_action: action,
      p_reason: reason,
      p_actor_email: trip.email,
      p_actor_name: trip.contact,
      p_event_id: eventId,
      p_created_at: nowStamp()
    }));
    await syncGoogleSheets(`client_${action}`, updated).catch((error) => console.warn(error.message));
    return { ok: true, trip: clientTripView(updated) };
  }

  if (action === "confirm") {
    if (trip.status !== "pending") return { ok: false, status: 409, message: "This booking is no longer awaiting confirmation." };
    trip.status = "confirmed";
  }
  if (action === "cancel") {
    if (["cancelled", "needs", "reconciled"].includes(trip.status)) return { ok: false, status: 409, message: "This booking is already cancelled." };
    const funded = totalBudget(trip) > 0;
    trip.status = funded ? "needs" : "cancelled";
    trip.cancelledReason = reason;
    if (funded) {
      await tableInsert("reconciliation_tasks", { id: `REC-${trip.id}`, tripId: trip.id, status: "open", alert: "For Immediate Checking", createdAt: nowStamp() });
      await addNotification({ role: "owner", tripId: trip.id, title: "For Immediate Checking", body: `${trip.client} cancelled ${trip.route} after ${money(totalBudget(trip))} was released.` });
      await addNotification({ role: "accounting", tripId: trip.id, title: "For Immediate Checking", body: `${trip.client} cancelled ${trip.route} after ${money(totalBudget(trip))} was released.` });
    }
  }
  if (action === "contact") {
    await addNotification({ role: "coordinator", tripId: trip.id, title: "Client requested contact", body: `${trip.contact} asked Roadlink to contact them about ${trip.route}.` });
  }

  trip.timeline.push(eventLine(`Client action recorded: ${action}${reason ? `. Reason: ${reason}` : ""}`));
  await saveTrip(trip);
  await tableInsert("client_actions", { id: `CA-${Date.now()}`, tripId: trip.id, action, actorEmail: trip.email, reason, createdAt: nowStamp() });
  await addAudit({ tripId: trip.id, actor: trip.contact, action: `client_${action}`, detail: reason || "Secure client link action" });
  await syncGoogleSheets(`client_${action}`, trip).catch((error) => console.warn(error.message));
  return { ok: true, trip: clientTripView(trip) };
}

async function handleDemoClientLink(payload, actor) {
  if (supabaseConfigured()) return { ok: false, status: 404, message: "Demo client simulation is unavailable in production." };
  const trip = await findTrip(payload.tripId);
  if (!trip) return { ok: false, status: 404, message: "Trip not found." };
  const token = makeToken();
  trip.clientToken = token;
  trip.clientTokenHash = hashClientToken(token);
  trip.clientTokenExpiresAt = futureIso(1);
  await saveTrip(trip);
  await addAudit({ tripId: trip.id, actor: actor.name, action: "demo_client_link_issued", detail: "Local walkthrough client simulator opened" });
  return { ok: true, trip: clientTripView(trip), token };
}

function totalBudget(trip) {
  return (trip.budget || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
}

async function handleBudget(payload, actor) {
  const trip = await findTrip(payload.tripId);
  if (!trip) return { ok: false, status: 404, message: "Trip not found." };
  const allowedTypes = ["Cash", "Cheque", "PO", "Fuel", "Shipping", "Meals", "Misc"];
  const type = allowedTypes.includes(payload.type) ? payload.type : "Misc";
  const amount = Number(payload.amount || 0);
  if (!Number.isFinite(amount) || amount <= 0) return { ok: false, status: 400, message: "Budget amount must be greater than zero." };
  if (!["confirmed", "funds"].includes(trip.status)) return { ok: false, status: 409, message: "The client must confirm the trip before funds can be released." };
  if (trip.waybill?.status !== "Approved") return { ok: false, status: 409, message: "Manager and finance approval are required before funds can be released." };
  const actorName = actor?.name || "Accounting";
  const eventId = `BI-${Date.now()}-${randomBytes(5).toString("hex")}`;
  const item = { id: eventId, type, detail: String(payload.detail || "").slice(0, 500), amount, state: "Logged" };
  if (supabaseConfigured()) {
    const updated = normalizeTrip(await supabaseRpc("roadlink_budget_release", {
      p_trip_id: trip.id,
      p_item: item,
      p_actor_name: actorName,
      p_event_id: eventId,
      p_created_at: nowStamp()
    }));
    await syncGoogleSheets("budget_logged", { trip: updated, item }).catch((error) => console.warn(error.message));
    return { ok: true, trip: staffTripView(updated) };
  }
  trip.budget.push(item);
  if (["pending", "confirmed"].includes(trip.status)) trip.status = "funds";
  trip.timeline.push(eventLine(`${item.type} release logged by ${actorName}`));
  await saveTrip(trip);
  await tableInsert("budget_items", { ...item, tripId: trip.id, createdAt: nowStamp() });
  await addAudit({ tripId: trip.id, actor: actorName, action: "budget_logged", detail: `${item.type}: ${money(item.amount)}` });
  await syncGoogleSheets("budget_logged", { trip, item }).catch((error) => console.warn(error.message));
  return { ok: true, trip: staffTripView(trip) };
}

async function handleWaybillApproval(payload, signer, actor) {
  const trip = await findTrip(payload.tripId);
  if (!trip) return { ok: false, status: 404, message: "Trip not found." };
  const actorName = actor?.name || (signer === "manager" ? "Owner / Manager" : "Accounting");
  if (supabaseConfigured()) {
    const eventId = `WB-${Date.now()}-${randomBytes(5).toString("hex")}`;
    const updated = normalizeTrip(await supabaseRpc("roadlink_waybill_approve", {
      p_trip_id: trip.id,
      p_signer: signer,
      p_actor_name: actorName,
      p_event_id: eventId,
      p_created_at: nowStamp()
    }));
    await syncGoogleSheets(`waybill_${signer}_approved`, updated).catch((error) => console.warn(error.message));
    return { ok: true, trip: staffTripView(updated) };
  }
  if (signer === "manager") {
    if (trip.waybill.status !== "Submitted") return { ok: false, status: 409, message: "The coordinator must submit the waybill before manager approval." };
    trip.waybill.approvedBy = actorName;
    trip.waybill.status = trip.waybill.financeBy ? "Approved" : "Manager Signed";
    trip.timeline.push(eventLine(`Manager approval added by ${trip.waybill.approvedBy}`));
    await addNotification({ role: "accounting", tripId: trip.id, title: "Waybill approved", body: `${trip.route} is ready for finance release review.` });
  }
  if (signer === "finance") {
    if (!trip.waybill.approvedBy || trip.waybill.status !== "Manager Signed") return { ok: false, status: 409, message: "Manager approval is required before finance approval." };
    trip.waybill.financeBy = actorName;
    trip.waybill.status = "Approved";
    trip.timeline.push(eventLine(`Finance approval added by ${trip.waybill.financeBy}`));
  }
  await saveTrip(trip);
  await addAudit({ tripId: trip.id, actor: actorName, action: `waybill_${signer}_approved`, detail: `Waybill ${trip.waybill.number}` });
  await syncGoogleSheets(`waybill_${signer}_approved`, trip).catch((error) => console.warn(error.message));
  return { ok: true, trip: staffTripView(trip) };
}

async function handleWaybillSubmit(payload, actor) {
  const trip = await findTrip(payload.tripId);
  if (!trip) return { ok: false, status: 404, message: "Trip not found." };
  if (["Manager Signed", "Approved"].includes(trip.waybill.status)) return { ok: false, status: 409, message: "An approved waybill cannot be edited or resubmitted." };
  const incoming = payload.waybill || {};
  const numericFields = ["sellRate", "freight", "buyingRate", "downpayment", "balanceAmount", "arrastre", "driver", "helper", "labor", "others"];
  let updatedWaybill;
  try {
    updatedWaybill = {
      shipmentNo: cleanText(incoming.shipmentNo || trip.waybill.shipmentNo, "Shipment number", 80, true),
      plateNo: cleanText(incoming.plateNo ?? trip.waybill.plateNo, "Plate number", 30),
      driverName: cleanText(incoming.driverName ?? trip.waybill.driverName, "Driver name", 140),
      paymentReceivedBy: cleanText(incoming.paymentReceivedBy ?? trip.waybill.paymentReceivedBy, "Payment recipient", 140),
      truckType: incoming.truckType === "Subcon Truck" ? "Subcon Truck" : "RCTS Truck",
      shipper: cleanText(incoming.shipper || trip.client, "Shipper", 180, true),
      consignee: cleanText(incoming.consignee || trip.contact, "Consignee", 140, true),
      destination: cleanText(incoming.destination || trip.destination, "Destination", 180, true),
      qty: cleanText(incoming.qty || "1", "Quantity", 20, true),
      cargo: cleanText(incoming.cargo ?? trip.cargo, "Cargo description", 1500)
    };
  } catch (error) {
    return { ok: false, status: 400, message: error.message };
  }
  for (const field of numericFields) {
    const amount = Number(incoming[field] ?? trip.waybill[field] ?? 0);
    if (!Number.isFinite(amount) || amount < 0) return { ok: false, status: 400, message: "Waybill amounts cannot be negative." };
    updatedWaybill[field] = amount;
  }
  trip.waybill = { ...trip.waybill, ...updatedWaybill, preparedBy: actor?.name || trip.waybill.preparedBy, approvedBy: "", financeBy: "", status: "Submitted" };
  trip.timeline.push(eventLine(`Waybill ${trip.waybill.number} submitted for in-app manager approval`));
  await saveTrip(trip);
  await addNotification({ role: "owner", tripId: trip.id, title: "Waybill for approval", body: `${trip.route} needs manager approval.` });
  await addAudit({ tripId: trip.id, actor: actor?.name || "Coordinator", action: "waybill_submitted", detail: `Waybill ${trip.waybill.number}` });
  await syncGoogleSheets("waybill_submitted", trip).catch((error) => console.warn(error.message));
  return { ok: true, trip: staffTripView(trip) };
}

async function handleReconciliation(payload, actor) {
  const trip = await findTrip(payload.tripId);
  if (!trip) return { ok: false, status: 404, message: "Trip not found." };
  if (trip.status !== "needs") return { ok: false, status: 409, message: "Only trips marked Cancelled - Funds Released can be reconciled." };
  const cashReleased = trip.budget.some((item) => ["Cash", "Meals", "Misc"].includes(item.type));
  const chequeReleased = trip.budget.some((item) => ["Cheque", "Shipping"].includes(item.type));
  const poReleased = trip.budget.some((item) => ["PO", "Fuel"].includes(item.type));
  const notes = cleanText(payload.expensesUsed, "Reconciliation notes", 1000);
  if ((cashReleased && !payload.cashReturned && !notes) || (chequeReleased && !payload.chequeVoided && !notes) || (poReleased && !payload.poCancelled && !notes)) {
    return { ok: false, status: 400, message: "Resolve each released item or explain what was already used before completing reconciliation." };
  }
  trip.reconciliation = {
    cashReturned: Boolean(payload.cashReturned),
    chequeVoided: Boolean(payload.chequeVoided),
    poCancelled: Boolean(payload.poCancelled),
    expensesUsed: notes
  };
  if (supabaseConfigured()) {
    const eventId = `REC-${Date.now()}-${randomBytes(5).toString("hex")}`;
    const updated = normalizeTrip(await supabaseRpc("roadlink_reconcile", {
      p_trip_id: trip.id,
      p_reconciliation: trip.reconciliation,
      p_actor_name: actor?.name || "Accounting",
      p_event_id: eventId,
      p_created_at: nowStamp()
    }));
    await syncGoogleSheets("reconciliation_completed", updated).catch((error) => console.warn(error.message));
    return { ok: true, trip: staffTripView(updated) };
  }
  trip.status = "reconciled";
  trip.timeline.push(eventLine("Accounting marked cancellation funds as reconciled"));
  await saveTrip(trip);
  await tableUpdate("reconciliation_tasks", `REC-${trip.id}`, { status: "complete", completedAt: nowStamp(), notes: trip.reconciliation.expensesUsed });
  await addAudit({ tripId: trip.id, actor: actor?.name || "Accounting", action: "reconciliation_completed", detail: trip.reconciliation.expensesUsed || "Completed" });
  await syncGoogleSheets("reconciliation_completed", trip).catch((error) => console.warn(error.message));
  return { ok: true, trip: staffTripView(trip) };
}

async function handleAccountRequest(payload, httpRequest) {
  let name;
  let email;
  let roleLabel;
  let company;
  try {
    name = cleanText(payload.name, "Name", 140, true);
    email = cleanText(payload.email, "Email", 254, true).toLowerCase();
    roleLabel = cleanText(payload.role || "Coordinator", "Role", 40, true);
    company = cleanText(payload.company, "Company", 180);
  } catch (error) {
    return { ok: false, status: 400, message: error.message };
  }
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, status: 400, message: "Enter your real name and a valid email address." };
  if (publicActionThrottled(`account:${requestIp(httpRequest)}:${email}`, 3, 24 * 60 * 60 * 1000)) return { ok: false, status: 429, message: "Too many account requests. Ask a Roadlink administrator for help." };
  if (!new Set(["Coordinator", "Accounting", "Owner / Manager", "Admin", "Client"]).has(roleLabel)) return { ok: false, status: 400, message: "Choose a valid Roadlink role." };
  if (roleSlug(roleLabel) === "client" && !company) return { ok: false, status: 400, message: "Client accounts need a company name so we can match your bookings." };

  const [profiles, requests] = await Promise.all([tableList("profiles"), tableList("account_requests")]);
  if (profiles.some((item) => String(item.email || "").toLowerCase() === email && item.status === "active")) {
    return { ok: false, status: 409, message: "An account with this email already exists. Use Forgot password on the login screen instead." };
  }
  if (requests.some((item) => String(item.email || "").toLowerCase() === email && item.status === "Pending")) {
    return { ok: false, status: 409, message: "A request for this email is already waiting for approval." };
  }

  const request = { id: `REQ-${Math.floor(1200 + Math.random() * 8000)}`, name, email, role: roleLabel, company: company || "Roadlink", phone: cleanText(payload.phone, "Phone", 40), status: "Pending", requestedAt: nowStamp() };
  await tableInsert("account_requests", request);
  await addNotification({ role: "admin", title: "Account request", body: `${request.name} requested ${request.role} access.` });
  await addNotification({ role: "owner", title: "Account request", body: `${request.name} requested ${request.role} access.` });
  return { ok: true, request };
}

function buildCredentialsEmail(accountRequest, tempPassword, origin) {
  const rows = [["Login email", accountRequest.email], ["Temporary password", tempPassword], ["Role", accountRequest.role]];
  const table = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;border:1px solid #d9e0ec;border-radius:12px;overflow:hidden;">${rows.map(([label, value]) => `<tr><td style="padding:10px 12px;background:#f8fafc;border-bottom:1px solid #e5eaf2;color:#5b6472;font-size:12px;font-weight:800;width:38%;">${escapeHtml(label)}</td><td style="padding:10px 12px;border-bottom:1px solid #e5eaf2;color:#111827;font-size:13px;">${escapeHtml(value)}</td></tr>`).join("")}</table>`;
  const body = `<p style="margin:0 0 12px;line-height:1.6;">Dear ${escapeHtml(accountRequest.name)},</p><p style="margin:0 0 12px;line-height:1.6;">Your Roadlink Trip Control account has been approved. Use the details below to log in, then change your password as soon as possible.</p>${table}`;
  return {
    to: [accountRequest.email],
    subject: "Your Roadlink Trip Control account is ready",
    html: roadlinkEmailShell({ title: "Your account is ready", preview: "Roadlink Trip Control login details", body, actions: [{ label: "Open Roadlink Trip Control", url: origin }], trip: null }),
    text: `Dear ${accountRequest.name},\n\nYour Roadlink Trip Control account has been approved.\n\nLogin email: ${accountRequest.email}\nTemporary password: ${tempPassword}\nRole: ${accountRequest.role}\n\nLog in at ${origin} and change your password as soon as possible.\n\nRoadlink Cargo Transport Service\nPowered by Konek`
  };
}

async function handleApproveAccount(payload, actor, httpRequest) {
  const request = (await tableList("account_requests")).find((item) => item.id === payload.requestId);
  if (!request) return { ok: false, status: 404, message: "Request not found." };
  if (request.status === "Approved") return { ok: false, status: 409, message: "This request was already approved." };
  const tempPassword = `Roadlink-${randomBytes(4).toString("hex")}`;
  const role = roleSlug(request.role);
  const loginName = request.email;
  const profiles = await tableList("profiles");
  const existing = profiles.find((item) => item.email === request.email);

  let clientId = existing?.clientId || "";
  if (role === "client") {
    const clients = await tableList("clients");
    let client = clients.find((item) => String(item.company || "").toLowerCase() === String(request.company || "").toLowerCase());
    if (!client) {
      client = { id: `CL-${Date.now().toString(36).toUpperCase()}`, company: request.company, authorizedContact: request.name, email: request.email, phone: request.phone || "" };
      await tableInsert("clients", client);
    }
    clientId = client.id;
  }
  const profile = {
    id: existing?.id || `USR-${Date.now()}`,
    auth_user_id: existing?.auth_user_id || null,
    name: request.name,
    email: request.email,
    role,
    roleLabel: request.role,
    username: loginName,
    passwordHash: hashPassword(tempPassword),
    company: request.company || "Roadlink",
    clientId,
    phone: request.phone || "",
    status: "active",
    initials: initials(request.name),
    photo: existing?.photo || ""
  };
  if (existing) await tableUpdate("profiles", existing.id, profile);
  else await tableInsert("profiles", profile);

  await tableUpdate("account_requests", request.id, { status: "Approved", approvedAt: nowStamp() });
  await addAudit({ actor: actor?.name || "Admin", action: "account_approved", detail: `${request.email} approved as ${request.role}` });

  let emailResult = { ok: false, skipped: true, message: "Email service is not configured." };
  if (httpRequest) {
    const origin = appOrigin(httpRequest);
    emailResult = await sendViaResend(buildCredentialsEmail(request, tempPassword, origin), "credentials", null).catch((error) => ({ ok: false, message: error.message }));
  }

  return { ok: true, request: { ...request, status: "Approved" }, profile: safeProfile(profile), credentials: { username: loginName, password: tempPassword }, email: emailResult };
}

async function handleRejectAccount(payload, actor) {
  const request = (await tableList("account_requests")).find((item) => item.id === payload.requestId);
  if (!request) return { ok: false, status: 404, message: "Request not found." };
  if (request.status !== "Pending") return { ok: false, status: 409, message: "This request has already been reviewed." };
  const reason = cleanText(payload.reason || "Access not approved", "Reason", 300, true);
  await tableUpdate("account_requests", request.id, { status: "Rejected", approvedAt: nowStamp() });
  await addAudit({ actor: actor.name, action: "account_rejected", detail: `${request.email}: ${reason}` });
  return { ok: true, request: { ...request, status: "Rejected" } };
}

function roleSlug(label = "") {
  const normalized = String(label).toLowerCase();
  if (normalized.includes("account")) return "accounting";
  if (normalized.includes("owner") || normalized.includes("manager")) return "owner";
  if (normalized.includes("admin")) return "admin";
  if (normalized.includes("client")) return "client";
  return "coordinator";
}

function initials(name = "") {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "RL";
}

async function handleBookingRequest(payload, actor) {
  let validated;
  try { validated = validateTripInput(payload); } catch (error) { return { ok: false, status: 400, message: error.message }; }
  const request = {
    id: `BR-${Math.floor(7000 + Math.random() * 9000)}`,
    company: actor?.company || validated.client,
    contact: actor?.name || validated.contact,
    email: actor?.email || validated.email,
    phone: actor?.phone || validated.phone,
    origin: validated.origin,
    destination: validated.destination,
    vehicle: validated.vehicle,
    date: validated.date,
    cargo: validated.cargo,
    status: "Needs staff review",
    createdAt: nowStamp(),
    clientId: actor?.clientId || payload.clientId || ""
  };
  await tableInsert("booking_requests", request);
  await addNotification({ role: "coordinator", title: "Client booking request", body: `${request.company} requested ${request.origin} to ${request.destination}.` });
  await syncGoogleSheets("client_booking_request", request).catch((error) => console.warn(error.message));
  return { ok: true, request };
}

async function handleRequest(request, response) {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);

  const guard = (roles, fn) => async () => {
    const auth = await requireRole(request, ...roles);
    if (!auth.ok) return auth;
    return fn(auth.profile);
  };

  if (request.method === "GET" && url.pathname === "/api/health") return json(response, 200, { ok: true, service: "roadlink-trip-control", ...publicBootstrap() });
  if (request.method === "GET" && url.pathname === "/api/bootstrap") return json(response, 200, { ok: true, data: publicBootstrap() });
  if (request.method === "GET" && url.pathname === "/api/session/bootstrap") {
    const auth = await requireRole(request);
    if (!auth.ok) return json(response, auth.status || 401, auth);
    return json(response, 200, { ok: true, data: await sessionBootstrap(auth.profile) });
  }
  if (request.method === "GET" && url.pathname === "/api/client-trip") {
    const trip = await findTrip(url.searchParams.get("trip") || "");
    if (!trip) return json(response, 404, { ok: false, message: "Trip not found." });
    const token = url.searchParams.get("token") || "";
    if (!clientTokenMatches(trip, token)) return json(response, 403, { ok: false, message: "This client link is invalid." });
    if (trip.clientTokenExpiresAt && new Date(trip.clientTokenExpiresAt) < new Date()) return json(response, 403, { ok: false, message: "This client link has expired." });
    return json(response, 200, { ok: true, trip: clientTripView(trip) });
  }

  if (request.method === "POST" && url.pathname.startsWith("/api/")) {
    let payload;
    try { payload = await readJson(request); } catch { return json(response, 400, { ok: false, message: "Invalid JSON payload." }); }

    const routes = {
      "/api/auth/login": () => handleLogin(payload, request),
      "/api/auth/logout": () => ({ ok: true, loggedOut: true }),
      "/api/auth/account-request": () => handleAccountRequest(payload, request),
      "/api/auth/forgot-password": () => handleForgotPassword(payload, request),
      "/api/auth/reset-password": () => handleResetPassword(payload),
      "/api/auth/change-password": guard([], (actor) => handleChangePassword(payload, actor)),
      "/api/admin/approve-account": guard(["admin", "owner"], (actor) => handleApproveAccount(payload, actor, request)),
      "/api/admin/reject-account": guard(["admin", "owner"], (actor) => handleRejectAccount(payload, actor)),
      "/api/admin/reset-user-password": guard(["admin", "owner"], (actor) => handleAdminResetPassword(payload, actor, request)),
      "/api/admin/set-user-status": guard(["admin", "owner"], (actor) => handleSetUserStatus(payload, actor)),
      "/api/trips": guard(["coordinator", "owner", "admin"], (actor) => handleCreateTrip(payload, request, actor)),
      "/api/demo/client-link": guard(staffRoles, (actor) => handleDemoClientLink(payload, actor)),
      "/api/client-action": () => handleClientAction(payload),
      "/api/budget-items": guard(["accounting", "admin"], (actor) => handleBudget(payload, actor)),
      "/api/waybills/submit": guard(["coordinator", "owner", "admin"], (actor) => handleWaybillSubmit(payload, actor)),
      "/api/waybills/approve-manager": guard(["owner", "admin"], (actor) => handleWaybillApproval(payload, "manager", actor)),
      "/api/waybills/approve-finance": guard(["accounting", "admin"], (actor) => handleWaybillApproval(payload, "finance", actor)),
      "/api/reconciliation/update": guard(["accounting", "admin"], (actor) => handleReconciliation(payload, actor)),
      "/api/client-portal/booking-request": guard(["client"], (actor) => handleBookingRequest(payload, actor)),
      "/api/sync/google-sheets": guard(["owner", "admin"], () => syncGoogleSheets(payload.kind || "manual", payload.payload || payload)),
      "/api/send-email": guard(staffRoles, async () => {
        let trip = await findTrip(payload.tripId || payload.trip?.id || "");
        if (!trip) return { ok: false, status: 404, message: "Trip not found." };
        if ((payload.kind || "confirmation") === "confirmation") trip = await tripForConfirmationEmail(trip);
        return sendEmailKind(payload.kind || "confirmation", trip, request);
      })
    };

    const dynamicSendConfirmation = url.pathname.match(/^\/api\/trips\/([^/]+)\/send-confirmation$/);
    const dynamicWaybillEmail = url.pathname.match(/^\/api\/waybills\/([^/]+)\/send-email$/);
    const dynamicManager = url.pathname.match(/^\/api\/waybills\/([^/]+)\/approve-manager$/);
    const dynamicFinance = url.pathname.match(/^\/api\/waybills\/([^/]+)\/approve-finance$/);
    const dynamicReconcile = url.pathname.match(/^\/api\/reconciliation\/([^/]+)\/update$/);

    let handler = routes[url.pathname];
    if (dynamicSendConfirmation) handler = guard(staffRoles, async () => {
      let trip = await findTrip(dynamicSendConfirmation[1]);
      if (!trip) return { ok: false, status: 404, message: "Trip not found." };
      trip = await tripForConfirmationEmail(trip);
      return sendEmailKind("confirmation", trip, request);
    });
    if (dynamicWaybillEmail) handler = guard(staffRoles, async () => {
      const trip = await findTrip(dynamicWaybillEmail[1]);
      if (!trip) return { ok: false, status: 404, message: "Trip not found." };
      return sendEmailKind("waybill", trip, request);
    });
    if (dynamicManager) handler = guard(["owner", "admin"], (actor) => handleWaybillApproval({ ...payload, tripId: dynamicManager[1] }, "manager", actor));
    if (dynamicFinance) handler = guard(["accounting", "admin"], (actor) => handleWaybillApproval({ ...payload, tripId: dynamicFinance[1] }, "finance", actor));
    if (dynamicReconcile) handler = guard(["accounting", "admin"], (actor) => handleReconciliation({ ...payload, tripId: dynamicReconcile[1] }, actor));

    if (!handler) return json(response, 404, { ok: false, message: "API route not found." });
    try {
      const result = await handler();
      const headers = {};
      if (url.pathname === "/api/auth/login" && result.ok && result.session?.accessToken) {
        headers["Set-Cookie"] = sessionCookie(result.session.accessToken, request);
        result.session = { profile: result.session.profile };
      }
      if (url.pathname === "/api/auth/logout") headers["Set-Cookie"] = expiredSessionCookie(request);
      return json(response, result.status || (result.ok === false ? 400 : 200), result, headers);
    } catch (error) {
      console.error("Roadlink request failed:", error);
      const message = supabaseConfigured() ? "The Roadlink data service is temporarily unavailable. No changes were saved." : (error.message || "Request failed.");
      return json(response, 500, { ok: false, message });
    }
  }

  if (request.method === "GET" || request.method === "HEAD") return serveStatic(request, response);
  response.writeHead(405);
  response.end("Method not allowed");
}

function serveStatic(request, response) {
  const url = new URL(request.url || "/", `http://${request.headers.host}`);
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";
  pathname = normalize(pathname).replaceAll("\\", "/");
  const isAsset = pathname.startsWith("/assets/") && Object.hasOwn(mimeTypes, extname(pathname));
  if (!publicFiles.has(pathname) && !isAsset) {
    response.writeHead(404, securityHeaders);
    response.end("Not found");
    return;
  }
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
  const cacheControl = pathname === "/index.html" || pathname === "/sw.js" ? "no-cache" : "public, max-age=3600";
  response.writeHead(200, { ...securityHeaders, "Cache-Control": cacheControl, "Content-Type": mimeTypes[extname(fullPath)] || "application/octet-stream" });
  if (request.method === "HEAD") return response.end();
  createReadStream(fullPath).pipe(response);
}

export function createRoadlinkServer() {
  return createServer((request, response) => {
    handleRequest(request, response).catch((error) => {
      console.error("Roadlink server error:", error);
      json(response, 500, { ok: false, message: "Roadlink could not complete the request." });
    });
  });
}

const isMainModule = process.argv[1] && normalize(process.argv[1]) === normalize(fileURLToPath(import.meta.url));
if (isMainModule) {
  const server = createRoadlinkServer();
  server.listen(port, () => {
    console.log(`Roadlink Trip Control running at http://127.0.0.1:${port}`);
    processEmailOutbox();
    const outboxTimer = setInterval(processEmailOutbox, 60_000);
    outboxTimer.unref();
  });
}
