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
 * 3. Set SHARED_SECRET below to a long random string.
 * 4. Deploy → New deployment → Web app:
 *      - Execute as: Me
 *      - Who has access: Anyone (the secret gates real use)
 * 5. Put the web app URL in the server env as GOOGLE_SHEETS_WEBHOOK_URL, and
 *    append the secret as a query parameter:
 *      GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/…/exec?secret=YOUR_SECRET
 */

var SHARED_SECRET = "CHANGE_ME_LONG_RANDOM_SECRET";

var TABS = {
  TRIPS: "Trips",
  WAYBILLS: "Waybills",
  BUDGET: "Budget Releases",
  CLIENT: "Client Actions",
  RECON: "Reconciliation",
  AUDIT: "Audit Export"
};

var HEADERS = {
  "Trips": ["Received At", "Event", "Trip ID", "Client", "Route", "Vehicle", "Trip Date", "Status", "Coordinator", "Contact", "Phone", "Email"],
  "Waybills": ["Received At", "Event", "Trip ID", "Waybill No", "Route", "Prepared By", "Manager Approval", "Finance Approval", "Waybill Status", "Freight", "Cash Out Total"],
  "Budget Releases": ["Received At", "Trip ID", "Client", "Type", "Detail", "Amount", "State"],
  "Client Actions": ["Received At", "Action", "Trip ID", "Client", "Route", "Reason", "Trip Status"],
  "Reconciliation": ["Received At", "Trip ID", "Client", "Route", "Cash Returned", "Cheque Voided", "PO Cancelled", "Expenses Used", "Trip Status"],
  "Audit Export": ["Received At", "Kind", "Trip ID", "Summary", "Raw JSON"]
};

function doPost(e) {
  try {
    var secret = (e && e.parameter && e.parameter.secret) || "";
    if (SHARED_SECRET && secret !== SHARED_SECRET) {
      return respond(403, { ok: false, message: "Invalid webhook secret." });
    }

    var body = JSON.parse((e && e.postData && e.postData.contents) || "{}");
    if (body.source !== "roadlink-trip-control") {
      return respond(400, { ok: false, message: "Unknown source." });
    }

    var kind = String(body.kind || "manual");
    var payload = body.payload || {};
    var receivedAt = new Date();

    routeEvent(kind, payload, receivedAt);
    // Every event also lands in the audit tab so nothing is ever silently lost.
    appendRow(TABS.AUDIT, [receivedAt, kind, tripIdOf(payload), summarize(kind, payload), JSON.stringify(payload).slice(0, 4000)]);

    return respond(200, { ok: true, kind: kind });
  } catch (error) {
    return respond(500, { ok: false, message: String(error) });
  }
}

function routeEvent(kind, payload, receivedAt) {
  var trip = payload.trip || payload; // budget_logged sends {trip, item}; most kinds send the trip itself.

  if (kind === "trip_created" || kind === "client_booking_request") {
    appendRow(TABS.TRIPS, [
      receivedAt, kind, trip.id || "", trip.client || trip.company || "", trip.route || routeOf(trip),
      trip.vehicle || "", trip.date || "", trip.status || "", trip.coordinator || "",
      trip.contact || "", trip.phone || "", trip.email || ""
    ]);
    return;
  }

  if (kind === "waybill_manager_approved" || kind === "waybill_finance_approved") {
    var waybill = trip.waybill || {};
    appendRow(TABS.WAYBILLS, [
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
    appendRow(TABS.RECON, [
      receivedAt, trip.id || "", trip.client || "", trip.route || "",
      recon.cashReturned ? "Yes" : "No", recon.chequeVoided ? "Yes" : "No",
      recon.poCancelled ? "Yes" : "No", recon.expensesUsed || "", trip.status || ""
    ]);
    return;
  }
  // Unrecognized kinds still reach the Audit Export tab via doPost.
}

function appendRow(tabName, row) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(tabName);
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(tabName);
  }
  if (sheet.getLastRow() === 0 && HEADERS[tabName]) {
    sheet.appendRow(HEADERS[tabName]);
    sheet.getRange(1, 1, 1, HEADERS[tabName].length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  sheet.appendRow(row);
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
