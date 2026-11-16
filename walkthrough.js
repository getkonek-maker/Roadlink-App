(() => {
  const tours = {
    coordinator: [
      { screen: "tasks", stage: 1, target: ".work-summary", title: "Your coordinator workspace",
        body: "Start with your pending work and client requests. You prepare bookings and waybills; managers and accounting handle approvals. This guide uses sample records only." },
      { screen: "newTrip", fill: "trip", target: "#client", title: "Create a booking",
        body: "Add the company, authorized contact, email, route, truck, and date. Create trip sends a confirmation email in the connected app. This demo sends no email." },
      { screen: "detail", stage: 1, target: ".share-grid", title: "Follow up with the client",
        body: "Resend the confirmation email here. The client can confirm or cancel from its secure link without installing an app. Confirmation does not release money." },
      { screen: "waybill", stage: 2, target: ".waybill-paper", title: "Prepare the waybill",
        body: "Trip details carry over. Add the driver and proposed expenses. These amounts are planned costs, not released funds." },
      { screen: "waybill", stage: 3, target: "[data-action='submitWaybill']", title: "Submit for approval",
        body: "Save and submit notifies the manager. You can see approval status but cannot approve for the manager or accounting. Print and email copies are available." },
      { screen: "detail", stage: 3, target: ".chat-entry", title: "Keep messages with the booking",
        body: "Open Trip messages for questions about loading or delivery. Chat is a local demo, not live delivery. You are ready to explore your coordinator tasks." }
    ],
    owner: [
      { screen: "tasks", stage: 3, target: ".work-summary", title: "Your manager overview",
        body: "See waybills awaiting your approval, cancelled trips needing attention, and account requests. This guide stays in the manager role and uses sample records." },
      { screen: "waybill", stage: 3, target: "[data-action='managerSign']", title: "Review and approve a waybill",
        body: "Check the route, driver, and proposed costs. Approve (Manager) records your decision and notifies accounting. Finance approval belongs to accounting, not this view." },
      { screen: "waybill", stage: 4, target: ".approval-status", title: "See the next handoff",
        body: "Your approval now appears as a status instead of a button. The waybill waits for accounting review before funds can be logged." },
      { screen: "dashboard", stage: 7, target: ".alert-card", title: "Watch funded cancellations",
        body: "Cancelled - Funds Released means money or supplier commitments need checking. Review the trip; accounting records returns, voided cheques, and cancelled POs." },
      { screen: "audit", stage: 8, target: ".timeline", title: "Review the history",
        body: "The timeline shows who booked, confirmed, approved, released, and cancelled. Completing checking keeps this record intact." },
      { screen: "users", stage: 3, target: ".approval-list", title: "Approve staff access",
        body: "Check each person's identity and requested role before approving access. You can now explore your manager workspace. Use the question mark to replay this guide." }
    ],
    accounting: [
      { screen: "tasks", stage: 4, target: ".work-summary", title: "Your accounting tasks",
        body: "Start with finance approvals, disbursements, and cancelled trips needing checking. This guide stays in accounting and uses sample records." },
      { screen: "waybill", stage: 4, target: "[data-action='financeSign']", title: "Approve finance",
        body: "Review the manager-approved waybill. Select Approve (Finance) when the costs are correct. Client confirmation and both approvals are required before logging a release." },
      { screen: "budget", stage: 5, fill: "budget", target: "#budgetForm .form-card", title: "Record a disbursement",
        body: "Log each cash, cheque, or PO release with its amount and reference. Trip details carry over. The app records the release; it does not transfer money." },
      { screen: "detail", stage: 6, target: ".budget-list", title: "Check what was released",
        body: "Each release stays with its trip. This example has cash, a shipping cheque, and a fuel PO, so each item can be checked if the client cancels." },
      { screen: "reconcile", stage: 7, target: "#reconcileForm .form-card", title: "Resolve a funded cancellation",
        body: "Record what was returned, voided, cancelled, or already spent. Complete checking only when every released item has been resolved." },
      { screen: "audit", stage: 8, target: ".timeline", title: "Keep the money trail",
        body: "The completed checking task remains in the history. You are ready to review approvals, record releases, and check cancellations from your accounting navigation." }
    ],
    admin: [
      { screen: "users", stage: 1, target: ".approval-list", title: "Review access requests",
        body: "Check the person's identity and requested role, then approve or decline. This guide uses sample accounts. Admin access does not grant financial approval powers." },
      { screen: "users", stage: 1, target: ".user-card", title: "Manage user access",
        body: "Review users and assigned roles here. In the connected app, an admin can suspend access or reset a password. Demo accounts do not affect real staff." },
      { screen: "audit", stage: 8, target: ".timeline", title: "Review activity",
        body: "Review the audit history when checking an issue. Admin manages access; managers approve waybills and accounting handles finance. You are ready to explore." }
    ],
    client: [
      { screen: "clientPortal", stage: 1, target: ".client-portal-hero", title: "Your client portal",
        body: "See your company's bookings and requests here. No credentials are needed for this preview. Internal Roadlink budgets and staff records are not shown." },
      { screen: "clientBooking", stage: 1, fill: "request", target: "#clientOrigin", title: "Request a booking",
        body: "Choose your route, vehicle, date, and cargo. Send the request to Roadlink. A coordinator checks availability before creating the official trip." },
      { screen: "clientBookingDetail", stage: 1, target: "[data-client-confirm]", title: "Confirm your booking",
        body: "Open a pending booking, check the details, and select Confirm Booking. You can also respond through the confirmation email instead of the portal." },
      { screen: "clientBookingDetail", stage: 2, target: ".chat-entry", title: "Message Roadlink",
        body: "Open Trip messages to ask about this booking. You write as yourself, not as Roadlink staff. Messages in this preview stay on the current device." },
      { screen: "clientBookingDetail", stage: 6, cancellation: true, target: "[data-complete-cancel]", title: "Cancel with a clear record",
        body: "Use Cancel Booking, enter a reason, and submit. A chat message alone does not cancel a booking. Roadlink receives the cancellation and checks any released funds." }
    ]
  };
  let steps = [];
  let guideRole = "coordinator";

  const seed = structuredClone(state);
  let active = false;
  let index = 0;
  let snapshot;
  let previousFocus;
  let previousScroll = 0;
  let host;
  let observer;
  let lastFocus;
  const app = () => document.querySelector("#app");

  function sampleTrip(step) {
    const stage = step.stage || 0;
    const date = new Date();
    date.setDate(date.getDate() + 7);
    const trip = structuredClone(seed.trips[0]);
    trip.id = "TOUR-1001";
    trip.date = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    trip.preferredChannel = "Email + WhatsApp";
    trip.status = step.earlyCancellation ? "cancelled" : stage >= 8 ? "reconciled" : stage >= 7 ? "needs" : stage >= 6 ? "funds" : stage >= 2 ? "confirmed" : "pending";
    trip.cancelledReason = (stage >= 7 || step.earlyCancellation) ? "Shipment postponed by the buyer." : "";
    trip.waybill = { ...trip.waybill, number: "DEMO-001", shipmentNo: trip.id, downpayment: 15000, arrastre: 0, driver: 0, helper: 0, labor: 0, others: 0, approvedBy: stage >= 4 ? "Emmanuel Garces" : "", financeBy: stage >= 5 ? "Liza Mercado" : "", status: stage >= 5 ? "Approved" : stage >= 4 ? "Manager Signed" : stage >= 3 ? "Submitted" : "Draft" };
    trip.budget = stage >= 6 ? structuredClone(seed.trips[0].budget) : [];
    trip.reconciliation = { cashReturned: stage >= 8, chequeVoided: stage >= 8, poCancelled: stage >= 8, expensesUsed: stage >= 8 ? "All cash returned; cheque voided; PO cancelled. No trip expenses used." : "" };
    const events = [
      [1, "Mika Santos created the trip and requested client confirmation", "8:00 AM"],
      [2, "Ana Lim confirmed the booking from the secure email link", "8:05 AM"],
      [3, "Mika Santos submitted waybill DEMO-001", "8:15 AM"],
      [4, "Emmanuel Garces approved the waybill as manager", "8:25 AM"],
      [5, "Liza Mercado approved finance", "8:30 AM"],
      [6, "Liza Mercado logged PHP 15,000 cash, PHP 42,000 cheque and PHP 18,000 PO", "9:00 AM"],
      [7, "Ana Lim cancelled: Shipment postponed by the buyer. Immediate checking opened", "9:20 AM"],
      [8, "Liza Mercado verified cash returned, cheque voided, PO cancelled; checking completed", "10:00 AM"]
    ];
    trip.timeline = events.filter(([atStage]) => atStage <= stage).map(([, text, at]) => ({ text, at: `Sample day, ${at}` }));
    if (step.earlyCancellation) trip.timeline.push({ text: "Ana Lim cancelled before funds were released", at: "Sample day, 8:10 AM" });
    return trip;
  }

  function applyScene(step) {
    const role = guideRole;
    const person = role === "owner" ? "Emmanuel Garces" : role === "accounting" ? "Liza Mercado" : role === "admin" ? "Roadlink Admin" : "Mika Santos";
    const trip = sampleTrip(step);
    Object.assign(state, {
      screen: step.screen, role: role === "client" ? null : role,
      session: role === "client" ? null : { profile: { id: `DEMO-${role}`, name: person, role } },
      clientSession: role === "client" ? { ...clientDemoUsers[0], id: "CLIENT-MACTAN" } : null,
      dataMode: "guided-demo", googleSheetsConnected: false, emailConnected: false, operationalReady: false,
      trips: [trip], selectedTripId: trip.id, clientPreviewTripId: trip.id,
      demoClientTokens: { [trip.id]: "guided-preview-only" },
      bookingRequests: structuredClone(seed.bookingRequests).map((request) => ({ ...request, date: trip.date })), approvalRequests: structuredClone(seed.approvalRequests),
      users: structuredClone(seed.users), alerts: [], notifications: [], toast: "", filter: "all",
      cancellationFormOpen: Boolean(step.cancellation), newUserPhoto: ""
    });
    delete state.lastIssuedCredentials;
    render();
    if (step.fill) fillForm(step.fill, trip);
    if (step.cancellation) app().querySelector("#reason").value = trip.cancelledReason || "Shipment postponed by the buyer.";
    app().querySelectorAll(".tour-focus").forEach((node) => node.classList.remove("tour-focus"));
    const target = step.target ? app().querySelector(step.target) : null;
    if (target) target.classList.add("tour-focus");
    app().scrollTop = 0;
  }

  function fillForm(kind, trip) {
    const values = kind === "budget" ? { type: "Cash", amount: 15000, detail: "Driver meals and port allowance - cash voucher CV-001" } : {
      client: trip.client, company: trip.client, contact: trip.contact, email: trip.email, phone: trip.phone,
      origin: trip.origin, destination: trip.destination, vehicle: trip.vehicle, plateNo: trip.waybill.plateNo,
      date: trip.date, cargo: trip.cargo, extraChannel: "WhatsApp"
    };
    for (const [name, value] of Object.entries(values)) {
      const control = app().querySelector(`[name="${name}"]`);
      if (control) control.value = value;
    }
  }


  function showStep() {
    const step = steps[index];
    host.innerHTML = `
      <div class="tour-blocker"></div><div class="tour-spotlight" aria-hidden="true"></div>
      <div class="tour-dialog" role="dialog" aria-modal="true" aria-labelledby="tourTitle" aria-describedby="tourBody">
        <header class="tour-compact-header"><span>${index + 1} OF ${steps.length} · ${guideRole === "client" ? "CLIENT" : guideRole === "owner" ? "MANAGER" : guideRole === "accounting" ? "ACCOUNTING" : guideRole === "admin" ? "ADMIN" : "COORDINATOR"}</span><button type="button" class="tour-skip" data-tour="close">Skip tour</button></header>
        <div class="tour-content">
          <h2 id="tourTitle" tabindex="-1">${step.title}</h2><p id="tourBody" class="tour-copy">${step.body}</p>
        </div>
        <footer class="tour-footer"><button type="button" class="ghost" data-tour="back" ${index === 0 ? "disabled" : ""}>Back</button><button type="button" class="primary" data-tour="next">${index === steps.length - 1 ? "Explore the app" : "Next"}</button></footer>
      </div>`;
    applyScene(step);
    host.querySelectorAll("[data-tour]").forEach((button) => button.addEventListener("click", () => {
      if (button.dataset.tour === "close") close();
      else if (button.dataset.tour === "back" && index > 0) { index--; showStep(); }
      else if (button.dataset.tour === "next") {
        if (index === steps.length - 1) close();
        else { index++; showStep(); }
      }
    }));
    host.querySelector("#tourTitle").focus({ preventScroll: true });
    requestAnimationFrame(() => positionDialog(true));
  }

  function positionDialog(scroll = false) {
    if (!active || !host) return;
    const step = steps[index];
    const frame = document.querySelector("#phoneFrame");
    const bounds = frame.getBoundingClientRect();
    const dialog = host.querySelector(".tour-dialog");
    const overrides = { home: ".home-logo", accountRequest: "#requestEmail", newTrip: "#client" };
    let target = app().querySelector(overrides[step.screen] || step.target || ".topbar h2");
    if (step.target === ".waybill-paper") target = app().querySelector(".waybill-heading");
    if (target && scroll) {
      const rect = target.getBoundingClientRect();
      const bar = app().querySelector(".topbar")?.getBoundingClientRect().height || 0;
      app().scrollTop += rect.top - app().getBoundingClientRect().top - bar - 45;
    }
    const card = dialog.getBoundingClientRect();
    const margin = 16;
    const clamp = (value, min, max) => Math.max(min, Math.min(value, Math.max(min, max)));
    let highlight = { x: bounds.width / 2 - 60, y: 44, width: 120, height: 38 };
    if (target && target.getClientRects().length) {
      const rect = target.getBoundingClientRect();
      highlight = {
        x: clamp(rect.left - bounds.left - 6, 8, bounds.width - 24),
        y: clamp(rect.top - bounds.top - 6, 8, bounds.height - 60),
        width: Math.min(rect.width + 12, bounds.width - 24),
        height: Math.min(rect.height + 12, Math.max(40, bounds.height - card.height - 90))
      };
    }
    highlight.width = Math.min(highlight.width, bounds.width - highlight.x - 8);
    const spot = host.querySelector(".tour-spotlight");
    Object.assign(spot.style, { left: `${highlight.x}px`, top: `${highlight.y}px`, width: `${highlight.width}px`, height: `${highlight.height}px` });
    let x = highlight.x;
    let y = highlight.y + highlight.height + 14;
    if (bounds.width > 800 && highlight.x + highlight.width + card.width + 32 < bounds.width) {
      x = highlight.x + highlight.width + 16; y = highlight.y;
    } else if (y + card.height > bounds.height - margin && highlight.y > card.height + margin) {
      y = highlight.y - card.height - 14;
    }
    Object.assign(dialog.style, { left: `${clamp(x, margin, bounds.width - card.width - margin)}px`, top: `${clamp(y, margin, bounds.height - card.height - margin)}px` });
  }

  function trapFocus(event) {
    if (!active) return;
    if (event.key === "Escape") { event.preventDefault(); close(); return; }
    if (event.key !== "Tab") return;
    const controls = [...host.querySelectorAll("button:not(:disabled), select")].filter((control) => control.getClientRects().length);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && (document.activeElement === first || document.activeElement.id === "tourTitle")) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  }

  function start() {
    if (active) return;
    guideRole = state.clientSession && !state.session ? "client" : state.role || "coordinator";
    steps = tours[guideRole] || tours.coordinator;
    snapshot = structuredClone(state);
    previousFocus = document.activeElement;
    lastFocus = previousFocus?.getAttribute("data-action");
    previousScroll = app().scrollTop;
    window.clearTimeout(setToast.timer);
    index = 0;
    active = true;
    document.body.classList.add("tour-active");
    app().inert = true;
    app().setAttribute("aria-hidden", "true");
    document.querySelector("#workspaceNav").inert = true;
    host = document.createElement("div");
    host.className = "walkthrough-host";
    document.querySelector("#phoneFrame").append(host);
    observer = new ResizeObserver(() => positionDialog());
    observer.observe(document.querySelector("#phoneFrame"));
    window.addEventListener("resize", positionAfterResize);
    app().addEventListener("scroll", positionAfterResize);
    document.addEventListener("keydown", trapFocus);
    showStep();
  }

  function close() {
    if (!active) return;
    active = false;
    observer.disconnect();
    window.removeEventListener("resize", positionAfterResize);
    app().removeEventListener("scroll", positionAfterResize);
    document.removeEventListener("keydown", trapFocus);
    host.remove();
    document.body.classList.remove("tour-active", "tour-expanded");
    document.querySelector(".shell").style.removeProperty("--tour-panel-height");
    app().inert = false;
    app().removeAttribute("aria-hidden");
    document.querySelector("#workspaceNav").inert = false;
    Object.keys(state).forEach((key) => { if (!Object.hasOwn(snapshot, key)) delete state[key]; });
    Object.assign(state, snapshot);
    render();
    app().scrollTop = previousScroll;
    const focus = previousFocus?.isConnected ? previousFocus : lastFocus ? app().querySelector(`[data-action="${lastFocus}"]`) : app().querySelector("button");
    focus?.focus({ preventScroll: true });
    const url = new URL(window.location.href);
    url.searchParams.delete("walkthrough");
    history.replaceState(null, "", url);
  }

  window.roadlinkWalkthrough = { get active() { return active; }, start, close };
  function positionAfterResize() { positionDialog(); }
})();
