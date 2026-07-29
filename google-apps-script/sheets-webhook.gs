/**
 * Roadlink Trip Control — Google Sheets mirror webhook.
 *
 * Receives POST JSON from server.mjs (syncGoogleSheets):
 *   { kind, payload, sentAt, source: "roadlink-trip-control" }
 * and appends a readable row to the matching tab. The sheet is a read-only
 * management mirror — nothing here writes back to the app.
 *
 * Setup:
 * 1. Create a Google Sheet named e.g. "Roadlink Trip Control Mirror".
 * 2. Extensions → Apps Script, paste this file.
 * 3. In Apps Script Project Settings, add a script property named
 *    ROADLINK_WEBHOOK_SECRET with a long random value.
 * 4. Deploy → New deployment → Web app:
 *      - Execute as: Me
 *      - Who has access: Anyone (the secret gates real use)
 * 5. Put the web app URL in GOOGLE_SHEETS_WEBHOOK_URL and the same secret in
 *    GOOGLE_SHEETS_WEBHOOK_SECRET on the Roadlink server.
 */

var TABS = {
  TRIPS: "Trips",
  REQUESTS: "Booking Requests",
  WAYBILLS: "Waybills",
  BUDGET: "Budget Releases",
  CLIENT: "Client Actions",
  RECON: "Reconciliation",
  AUDIT: "Audit Export",
  EVENTS: "_Sync Events"
};

var HEADERS = {
  "Trips": ["Received At", "Event", "Trip ID", "Client", "Route", "Vehicle", "Trip Date", "Status", "Coordinator", "Contact", "Phone", "Email"],
  "Booking Requests": ["Received At", "Request ID", "Company", "Route", "Vehicle", "Trip Date", "Status", "Contact", "Phone", "Email"],
  "Waybills": ["Received At", "Event", "Trip ID", "Waybill No", "Route", "Prepared By", "Manager Approval", "Finance Approval", "Waybill Status", "Freight", "Cash Out Total"],
  "Budget Releases": ["Received At", "Trip ID", "Client", "Type", "Detail", "Amount", "State"],
  "Client Actions": ["Received At", "Action", "Trip ID", "Client", "Route", "Reason", "Trip Status"],
  "Reconciliation": ["Received At", "Trip ID", "Client", "Route", "Cash Returned", "Cheque Voided", "PO Cancelled", "Expenses Used", "Trip Status"],
  "Audit Export": ["Received At", "Event ID", "Kind", "Trip ID", "Summary", "Raw JSON"],
  "_Sync Events": ["Event ID", "Received At"]
};

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var expectedSecret = PropertiesService.getScriptProperties().getProperty("ROADLINK_WEBHOOK_SECRET") || "";
    var body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (!expectedSecret || body.secret !== expectedSecret) {
      return respond(403, { ok: false, message: "Invalid webhook secret." });
    }
    if (body.source !== "roadlink-trip-control") {
      return respond(400, { ok: false, message: "Unknown source." });
    }

    var kind = String(body.kind || "manual");
    var payload = body.payload || {};
    var eventId = String(body.eventId || "");
    if (!eventId) return respond(400, { ok: false, message: "Missing event ID." });
    var receivedAt = new Date();

    lock.waitLock(20000);
    if (eventProcessed(eventId)) return respond(200, { ok: true, duplicate: true, kind: kind });
    routeEvent(eventId, kind, payload, receivedAt);
    // Every event also lands in the audit tab so nothing is ever silently lost.
    appendRow(TABS.AUDIT, [receivedAt, eventId, kind, tripIdOf(payload), summarize(kind, payload), JSON.stringify(payload).slice(0, 4000)]);
    recordEvent(eventId, receivedAt);

    return respond(200, { ok: true, kind: kind });
  } catch (error) {
    return respond(500, { ok: false, message: String(error) });
  } finally {
    if (lock.hasLock()) lock.releaseLock();
  }
}

function routeEvent(eventId, kind, payload, receivedAt) {
  var trip = payload.trip || payload; // budget_logged sends {trip, item}; most kinds send the trip itself.

  if (kind === "client_booking_request") {
    upsertRow(TABS.REQUESTS, 2, trip.id || "", [
      receivedAt, trip.id || "", trip.client || trip.company || "", trip.route || routeOf(trip),
      trip.vehicle || "", trip.date || "", trip.status || "", trip.contact || "", trip.phone || "", trip.email || ""
    ]);
    return;
  }

  if (trip.id) {
    upsertRow(TABS.TRIPS, 3, trip.id, [
      receivedAt, kind, trip.id || "", trip.client || trip.company || "", trip.route || routeOf(trip),
      trip.vehicle || "", trip.date || "", trip.status || "", trip.coordinator || "",
      trip.contact || "", trip.phone || "", trip.email || ""
    ]);
  }

  if (kind === "waybill_submitted" || kind === "waybill_manager_approved" || kind === "waybill_finance_approved") {
    var waybill = trip.waybill || {};
    upsertRow(TABS.WAYBILLS, 3, trip.id || "", [
      receivedAt, kind, trip.id || "", waybill.number || "", trip.route || "",
      waybill.preparedBy || "", waybill.approvedBy || "", waybill.financeBy || "",
      waybill.status || "", Number(waybill.freight || 0), cashOutTotal(waybill)
    ]);
    return;
  }

  if (kind === "budget_logged") {
    var item = payload.item || {};
    appendRow(TABS.BUDGET, [
      receivedAt, trip.id || "", trip.client || "", item.type || "", item.detail || "",
      Number(item.amount || 0), item.state || ""
    ]);
    return;
  }

  if (kind === "client_confirm" || kind === "client_cancel" || kind === "client_contact") {
    appendRow(TABS.CLIENT, [
      receivedAt, kind.replace("client_", ""), trip.id || "", trip.client || "", trip.route || "",
      trip.cancelledReason || "", trip.status || ""
    ]);
    return;
  }

  if (kind === "reconciliation_completed") {
    var recon = trip.reconciliation || {};
    upsertRow(TABS.RECON, 2, trip.id || "", [
      receivedAt, trip.id || "", trip.client || "", trip.route || "",
      recon.cashReturned ? "Yes" : "No", recon.chequeVoided ? "Yes" : "No",
      recon.poCancelled ? "Yes" : "No", recon.expensesUsed || "", trip.status || ""
    ]);
    return;
  }
  // Unrecognized kinds still reach the Audit Export tab via doPost.
}

function upsertRow(tabName, keyColumn, key, row) {
  if (!key) return appendRow(tabName, row);
  var sheet = sheetFor(tabName);
  var match = sheet.getRange(2, keyColumn, Math.max(sheet.getLastRow() - 1, 1), 1)
    .createTextFinder(String(key)).matchEntireCell(true).findNext();
  var rowNumber = match ? match.getRow() : sheet.getLastRow() + 1;
  sheet.getRange(rowNumber, 1, 1, row.length).setValues([row]);
}

function appendRow(tabName, row) {
  var sheet = sheetFor(tabName);
  sheet.appendRow(row);
}

function sheetFor(tabName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(tabName);
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(tabName);
  }
  if (sheet.getLastRow() === 0 && HEADERS[tabName]) {
    sheet.appendRow(HEADERS[tabName]);
    sheet.getRange(1, 1, 1, HEADERS[tabName].length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  if (tabName === TABS.EVENTS && !sheet.isSheetHidden()) sheet.hideSheet();
  return sheet;
}

function eventProcessed(eventId) {
  var sheet = sheetFor(TABS.EVENTS);
  if (sheet.getLastRow() < 2) return false;
  return Boolean(sheet.getRange(2, 1, sheet.getLastRow() - 1, 1)
    .createTextFinder(eventId).matchEntireCell(true).findNext());
}

function recordEvent(eventId, receivedAt) {
  appendRow(TABS.EVENTS, [eventId, receivedAt]);
}

function cashOutTotal(waybill) {
  var keys = ["downpayment", "arrastre", "driver", "helper", "labor", "others"];
  var total = 0;
  for (var i = 0; i < keys.length; i++) total += Number(waybill[keys[i]] || 0);
  return total;
}

function routeOf(record) {
  if (record.origin || record.destination) return (record.origin || "?") + " to " + (record.destination || "?");
  return "";
}

function tripIdOf(payload) {
  return (payload.trip && payload.trip.id) || payload.id || "";
}

function summarize(kind, payload) {
  var trip = payload.trip || payload;
  var parts = [trip.client || trip.company || "", trip.route || routeOf(trip), trip.status || ""];
  return parts.filter(function (part) { return part; }).join(" | ");
}

function respond(status, body) {
  // Apps Script web apps cannot set real HTTP status codes; the JSON body
  // carries ok/message and server.mjs logs it into sheet_sync_log.
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
