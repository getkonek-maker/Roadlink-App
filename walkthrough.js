(() => {
  const tours = {
    coordinator: [
      { screen: "tasks", nav: "tasks", stage: 1, target: ".work-summary", title: "Open your pending work",
        body: "Open My tasks. Select a booking to prepare its waybill or follow up with its client. Client booking requests also appear here." },
      { screen: "bookingRequest", nav: "tasks", stage: 1, target: "[data-action='convertRequest']", title: "Review a booking request",
        body: "Check the route, date, and vehicle availability. Select Create trip from request only when the details are agreed. Opening a request does not create a trip." },
      { screen: "newTrip", nav: "newTrip", fill: "trip", target: "#client", title: "Enter the booking details",
        body: "Open New booking. Enter the company, contact, email, route, vehicle, and date. Select Create trip and send confirmation email. This demo does not send emails." },
      { screen: "waybill", nav: "waybills", stage: 2, target: ".waybill-paper", title: "Fill in the waybill",
        body: "Open Waybills and select the trip. Add the driver, rates, and planned expenses. The company, route, and vehicle are copied from the booking." },
      { screen: "waybill", nav: "waybills", stage: 3, target: "[data-action='submitWaybill']", title: "Send the waybill to the manager",
        body: "Select Save and submit. The manager receives an approval request. You can view the approval status, but only the manager and accounting can approve." },
      { screen: "messages", nav: "messages", stage: 3, target: ".conversation-list", title: "Choose a conversation",
        body: "Open Messages. Select a company and trip to read or reply. You see conversations for your assigned trips. Use the search box to find another booking." }
    ],
    owner: [
      { screen: "tasks", nav: "tasks", stage: 3, target: ".work-summary", title: "Review items waiting for you",
        body: "Open Overview. Review waybills awaiting approval, cancelled trips with released funds, and staff account requests. Select an item to open its details." },
      { screen: "waybill", nav: "managerApprovals", stage: 3, target: "[data-action='managerSign']", title: "Approve a waybill",
        body: "Open Pending approvals and select a waybill. Check the route, driver, and costs. Select Approve (Manager) to send it to accounting." },
      { screen: "waybill", nav: "managerApprovals", stage: 4, target: ".approval-status", title: "Check the approval status",
        body: "Your name replaces the approval button after you approve. Accounting must approve finance next. Manager approval alone does not release funds." },
      { screen: "reconcile", nav: "reconcile", stage: 7, target: "#reconcileForm .alert-card", title: "Review a cancelled trip",
        body: "The client cancelled after PHP 75,000 was recorded as released. Select Review trip to see the cash, cheques, and purchase orders. Accounting checks what was returned or cancelled." },
      { screen: "audit", nav: "audit", stage: 8, target: ".timeline", title: "Check who did what",
        body: "Open Audit history. Check the names, dates, approvals, releases, and cancellation for the selected trip. Completing cancellation checking does not delete this history." },
      { screen: "messages", nav: "messages", stage: 3, target: ".conversation-list", title: "Read client conversations",
        body: "Open Messages. Select a company and trip to read the conversation or reply as Zeno Jief Flores. Managers can view all client conversations." },
      { screen: "users", nav: "users", stage: 3, target: ".approval-list", title: "Manage staff access",
        body: "Open Users & access. Verify the person's identity and requested role. Select Approve or Decline. User access is managed here; there is no separate Admin demo." }
    ],
    accounting: [
      { screen: "tasks", nav: "tasks", stage: 4, target: ".work-summary", title: "Open your accounting work",
        body: "Open My tasks. Select a waybill for finance approval, a trip ready for release, or a cancelled trip that needs checking." },
      { screen: "waybill", nav: "financeApprovals", stage: 4, target: "[data-action='financeSign']", title: "Approve the trip costs",
        body: "Open Finance approvals. Review the manager-approved waybill, then select Approve (Finance). A release can be recorded only after client confirmation and both approvals." },
      { screen: "budget", nav: "disbursements", stage: 5, fill: "budget", target: "#budgetForm .form-card", title: "Record money released",
        body: "Open Disbursements and select a trip. Enter Cash, Cheque, or purchase order (PO), the amount, and a reference. Select Save release log. Record each release separately." },
      { screen: "detail", nav: "dashboard", stage: 6, target: ".budget-list", title: "Check the release records",
        body: "Open Trips and select Open trip. Check each released amount and reference under Released funds. This sample has PHP 15,000 cash, a shipping cheque, and a fuel purchase order." },
      { screen: "reconcile", nav: "reconcile", stage: 7, target: "#reconcileForm .form-card", title: "Check money after a cancellation",
        body: "Open Cancellation checking. Record cash returned, cheques voided, purchase orders cancelled, and any expenses already spent. Select Mark checking complete after every release has been checked." },
      { screen: "audit", nav: "audit", stage: 8, target: ".timeline", title: "Review the completed record",
        body: "Open Audit history to check who recorded approvals, releases, and returns. The trip stays in the history after checking is complete." }
    ],
    client: [
      { screen: "clientPortal", nav: "clientPortal", stage: 1, target: ".client-portal-hero", title: "Open your bookings",
        body: "Open My bookings. Select a trip to see its route, vehicle, date, and status. You see only your company's bookings." },
      { screen: "clientBooking", nav: "clientBooking", stage: 1, fill: "request", target: "#clientOrigin", title: "Send a booking request",
        body: "Open Request booking. Enter the route, vehicle, date, and cargo. Select Send request to Roadlink. A coordinator checks availability before creating your trip." },
      { screen: "clientBookingDetail", nav: "clientPortal", stage: 1, target: "[data-client-confirm]", title: "Confirm a booking",
        body: "Open My bookings and select a pending trip. Check the details, then select Confirm Booking. You can also confirm using the email link." },
      { screen: "messages", nav: "messages", stage: 2, target: ".conversation-list", title: "Message Roadlink",
        body: "Open Messages and select the trip you want to discuss. Write your message, then select Send. This demo saves messages on this device only." },
      { screen: "clientBookingDetail", nav: "clientPortal", stage: 6, cancellation: true, target: "[data-complete-cancel]", title: "Cancel a booking",
        body: "Open the booking and select Cancel Booking. Enter the reason, then select Submit cancellation. Roadlink is notified. Sending a chat message does not cancel a booking." }
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
    trip.waybill = { ...trip.waybill, number: "DEMO-001", shipmentNo: trip.id, downpayment: 15000, arrastre: 0, driver: 0, helper: 0, labor: 0, others: 0, approvedBy: stage >= 4 ? "Zeno Jief Flores" : "", financeBy: stage >= 5 ? "Liza Mercado" : "", status: stage >= 5 ? "Approved" : stage >= 4 ? "Manager Signed" : stage >= 3 ? "Submitted" : "Draft" };
    trip.budget = stage >= 6 ? structuredClone(seed.trips[0].budget) : [];
    trip.reconciliation = { cashReturned: stage >= 8, chequeVoided: stage >= 8, poCancelled: stage >= 8, expensesUsed: stage >= 8 ? "All cash returned; cheque voided; PO cancelled. No trip expenses used." : "" };
    const events = [
      [1, "Mika Santos created the trip and requested client confirmation", "8:00 AM"],
      [2, "Ana Lim confirmed the booking from the secure email link", "8:05 AM"],
      [3, "Mika Santos submitted waybill DEMO-001", "8:15 AM"],
      [4, "Zeno Jief Flores approved the waybill as manager", "8:25 AM"],
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
    const person = role === "owner" ? "Zeno Jief Flores" : role === "accounting" ? "Liza Mercado" : "Mika Santos";
    const trip = sampleTrip(step);
    Object.assign(state, {
      screen: step.screen, role: role === "client" ? null : role,
      parentNav: { screen: step.screen, section: step.nav },
      session: role === "client" ? null : { profile: { id: `DEMO-${role}`, name: person, role } },
      clientSession: role === "client" ? { ...clientDemoUsers[0], id: "CLIENT-MACTAN" } : null,
      dataMode: "guided-demo", googleSheetsConnected: false, emailConnected: false, operationalReady: false,
      trips: [trip], selectedTripId: trip.id, clientPreviewTripId: trip.id,
      selectedRequestId: seed.bookingRequests[0]?.id,
      demoClientTokens: { [trip.id]: "guided-preview-only" },
      bookingRequests: structuredClone(seed.bookingRequests).map((request) => ({ ...request, date: trip.date })), approvalRequests: structuredClone(seed.approvalRequests),
      users: structuredClone(seed.users), alerts: [], notifications: [], toast: "", filter: "all",
      cancellationFormOpen: Boolean(step.cancellation), newUserPhoto: ""
    });
    if (step.screen === "messages") {
      const second = structuredClone(trip);
      Object.assign(second, { id: "TOUR-1002", route: "Cebu to Bohol", destination: "Tagbilaran City, Bohol" });
      state.trips.push(second);
    }
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
        <header class="tour-compact-header"><span>${index + 1} OF ${steps.length} · ${guideRole === "client" ? "CLIENT" : guideRole === "owner" ? "MANAGER" : guideRole === "accounting" ? "ACCOUNTING" : "COORDINATOR"}</span><button type="button" class="tour-skip" data-tour="close">Skip tour</button></header>
        <div class="tour-content">
          <p class="tour-location" aria-label="Navigation location"></p>
          <h2 id="tourTitle" tabindex="-1">${step.title}</h2><p id="tourBody" class="tour-copy">${step.body}</p>
        </div>
        <footer class="tour-footer"><button type="button" class="ghost" data-tour="back" ${index === 0 ? "disabled" : ""}>Back</button><button type="button" class="primary" data-tour="next">${index === steps.length - 1 ? "Explore the app" : "Next"}</button></footer>
      </div>`;
    applyScene(step);
    const nav = window.roadlinkWorkspace.currentNavigation();
    const sidebar = document.querySelector("#workspaceNav");
    const mobile = !sidebar.getClientRects().length;
    host.querySelector(".tour-location").textContent = `${mobile && nav.inMore ? "More > " : ""}${nav.label}`;
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
    const mobileNav = document.querySelector("#mobileNav");
    const availableHeight = bounds.height - (mobileNav?.getClientRects().length ? mobileNav.getBoundingClientRect().height : 0);
    const dialog = host.querySelector(".tour-dialog");
    dialog.style.maxHeight = `${availableHeight - 24}px`;
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
        y: clamp(rect.top - bounds.top - 6, 8, availableHeight - 60),
        width: Math.min(rect.width + 12, bounds.width - 24),
        height: Math.min(rect.height + 12, Math.max(40, availableHeight - card.height - 90))
      };
    }
    highlight.width = Math.min(highlight.width, bounds.width - highlight.x - 8);
    const spot = host.querySelector(".tour-spotlight");
    Object.assign(spot.style, { left: `${highlight.x}px`, top: `${highlight.y}px`, width: `${highlight.width}px`, height: `${highlight.height}px` });
    let x = highlight.x;
    let y = highlight.y + highlight.height + 14;
    if (bounds.width > 800 && highlight.x + highlight.width + card.width + 32 < bounds.width) {
      x = highlight.x + highlight.width + 16; y = highlight.y;
    } else if (y + card.height > availableHeight - margin && highlight.y > card.height + margin) {
      y = highlight.y - card.height - 14;
    }
    Object.assign(dialog.style, { left: `${clamp(x, margin, bounds.width - card.width - margin)}px`, top: `${clamp(y, margin, availableHeight - card.height - margin)}px` });
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
