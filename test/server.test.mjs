import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const testDirectory = mkdtempSync(join(tmpdir(), "roadlink-test-"));
process.env.ROADLINK_DISABLE_LOCAL_ENV = "1";
process.env.ROADLINK_DATA_PATH = join(testDirectory, "store.json");
process.env.PASSWORD_PEPPER = "RoadlinkTestPepper-2026";
process.env.SESSION_SECRET = "RoadlinkTestSessionSecret-2026-Long-Value";
delete process.env.SUPABASE_URL;
delete process.env.SUPABASE_SERVICE_ROLE_KEY;
delete process.env.RESEND_API_KEY;
delete process.env.GOOGLE_SHEETS_WEBHOOK_URL;

const { createRoadlinkServer } = await import("../server.mjs");
const server = createRoadlinkServer();
let baseUrl;

before(async () => {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve) => server.close(resolve));
  rmSync(testDirectory, { recursive: true, force: true });
});

async function request(path, { method = "GET", body, cookie } = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(body ? { "content-type": "application/json" } : {}),
      ...(cookie ? { cookie } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await response.text();
  let json;
  try { json = JSON.parse(text); } catch { json = null; }
  return { response, json, text };
}

async function login(role, username, password) {
  const result = await request("/api/auth/login", { method: "POST", body: { role, username, password } });
  assert.equal(result.response.status, 200);
  assert.match(result.response.headers.get("set-cookie") || "", /roadlink_session=.*HttpOnly/);
  assert.equal(result.json.session.accessToken, undefined);
  return (result.response.headers.get("set-cookie") || "").split(";")[0];
}

test("serves only public app files with security headers", async () => {
  const home = await request("/");
  assert.equal(home.response.status, 200);
  assert.match(home.response.headers.get("content-security-policy") || "", /frame-ancestors 'none'/);
  assert.equal(home.response.headers.get("x-content-type-options"), "nosniff");

  for (const path of ["/server.mjs", "/package.json", "/.env.local", "/.data/roadlink-store.json"]) {
    const result = await request(path);
    assert.equal(result.response.status, 404, path);
  }
});

test("public bootstrap contains readiness flags but no operating records", async () => {
  const result = await request("/api/bootstrap");
  assert.equal(result.response.status, 200);
  assert.deepEqual(Object.keys(result.json.data).sort(), ["email", "googleSheets", "mode", "operational"]);
  assert.equal(result.json.data.mode, "local-demo");
});

test("privileged routes reject unauthenticated requests", async () => {
  for (const path of ["/api/budget-items", "/api/waybills/approve-manager", "/api/admin/approve-account"]) {
    const result = await request(path, { method: "POST", body: { tripId: "RL-TEST" } });
    assert.equal(result.response.status, 401, path);
  }
});

test("role-scoped workflow preserves approval and reconciliation order", async () => {
  const coordinator = await login("coordinator", "mika.temp", "Roadlink-8421");
  const owner = await login("owner", "owner.temp", "Roadlink-6714");
  const accounting = await login("accounting", "finance.temp", "Roadlink-2198");

  const tripInput = {
    id: "RL-LIVE-TEST",
    client: "Test Foods Inc.",
    contact: "Jamie Cruz",
    phone: "+63 917 555 0101",
    email: "jamie@example.com",
    origin: "Lapu-Lapu City, Cebu",
    destination: "Ormoc City, Leyte",
    vehicle: "10-wheeler truck",
    date: "2026-08-15",
    cargo: "Test cargo",
    waybill: { plateNo: "TEST 101" }
  };
  const created = await request("/api/trips", { method: "POST", cookie: coordinator, body: { trip: tripInput } });
  assert.equal(created.response.status, 200);
  assert.equal(created.json.trip.clientToken, undefined);
  assert.equal(created.json.trip.clientTokenHash, undefined);
  const token = created.json.demoClientToken;

  const prematureBudget = await request("/api/budget-items", { method: "POST", cookie: accounting, body: { tripId: tripInput.id, type: "Cash", amount: 1000 } });
  assert.equal(prematureBudget.response.status, 409);

  const confirmed = await request("/api/client-action", { method: "POST", body: { tripId: tripInput.id, token, action: "confirm" } });
  assert.equal(confirmed.json.trip.status, "confirmed");
  assert.deepEqual(confirmed.json.trip.budget, []);
  assert.equal(confirmed.json.trip.clientTokenHash, undefined);

  const invalidWaybill = await request("/api/waybills/submit", {
    method: "POST",
    cookie: coordinator,
    body: { tripId: tripInput.id, waybill: { shipmentNo: "<invalid>" } }
  });
  assert.equal(invalidWaybill.response.status, 400);
  assert.match(invalidWaybill.json.message, /unsupported characters/);

  const submitted = await request("/api/waybills/submit", {
    method: "POST",
    cookie: coordinator,
    body: { tripId: tripInput.id, waybill: { shipmentNo: tripInput.id, shipper: tripInput.client, consignee: tripInput.contact, destination: tripInput.destination, qty: "1", cargo: tripInput.cargo, plateNo: "TEST 101", freight: 5000 } }
  });
  assert.equal(submitted.json.trip.waybill.status, "Submitted");
  assert.equal(submitted.json.trip.waybill.plateNo, "TEST 101");

  const managerApproved = await request("/api/waybills/approve-manager", { method: "POST", cookie: owner, body: { tripId: tripInput.id } });
  assert.equal(managerApproved.json.trip.waybill.status, "Manager Signed");
  const financeApproved = await request("/api/waybills/approve-finance", { method: "POST", cookie: accounting, body: { tripId: tripInput.id } });
  assert.equal(financeApproved.json.trip.waybill.status, "Approved");

  const funded = await request("/api/budget-items", { method: "POST", cookie: accounting, body: { tripId: tripInput.id, type: "Cash", detail: "Meals", amount: 15000 } });
  assert.equal(funded.json.trip.status, "funds");
  const cancelled = await request("/api/client-action", { method: "POST", body: { tripId: tripInput.id, token, action: "cancel", reason: "Client schedule changed" } });
  assert.equal(cancelled.json.trip.status, "cancelled");
  assert.deepEqual(cancelled.json.trip.budget, []);
  const accountingState = await request("/api/session/bootstrap", { cookie: accounting });
  const cancelledInternalTrip = accountingState.json.data.trips.find((trip) => trip.id === tripInput.id);
  assert.equal(cancelledInternalTrip.status, "needs");
  assert.equal(cancelledInternalTrip.clientTokenHash, undefined);

  const incomplete = await request("/api/reconciliation/update", { method: "POST", cookie: accounting, body: { tripId: tripInput.id } });
  assert.equal(incomplete.response.status, 400);
  const reconciled = await request("/api/reconciliation/update", { method: "POST", cookie: accounting, body: { tripId: tripInput.id, cashReturned: true } });
  assert.equal(reconciled.json.trip.status, "reconciled");
});
