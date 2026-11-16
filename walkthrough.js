(() => {
  const steps = [
    {
      screen: "dashboard", target: ".status-grid", title: "Your trips, in one place",
      body: "Follow one booking from start to finish. This preview shows each person's role using sample records. No real emails are sent."
    },
    {
      screen: "login", target: "#loginRole", title: "Everyone has their own access",
      body: "Staff sign in with their own account and assigned role. New staff request access first. An owner or admin approves their account."
    },
    {
      screen: "newTrip", fill: "trip", target: "#newTripForm", title: "Create a booking",
      body: "Choose New trip. Add the company, authorized contact, email, route, truck, and date. Then choose Create trip and send confirmation email."
    },
    {
      screen: "client", preview: "email", stage: 1, role: "client", title: "The client receives an email",
      body: "The client receives the trip details with Confirm, Cancel, and Contact Roadlink options. The email link works without an app or account."
    },
    {
      screen: "client", stage: 1, role: "client", target: "[data-client-confirm]", title: "The client confirms",
      body: "The client reviews the details and selects Confirm Booking. Staff then see Confirmed. This does not approve expenses or release money."
    },
    {
      screen: "waybill", stage: 2, target: ".waybill-paper", title: "Prepare the waybill",
      body: "Trip details are already filled in. Add the driver and proposed costs. These are planned expenses, not money already released."
    },
    {
      screen: "waybill", stage: 3, target: "[data-action='submitWaybill']", title: "Send it for approval",
      body: "Choose Save and submit. The manager receives an in-app notification. You can also print or email a copy of the waybill."
    },
    {
      screen: "waybill", stage: 3, role: "owner", target: "[data-action='managerSign']", title: "The manager approves",
      body: "The manager reviews the trip and costs, then selects Approve (Manager). Their approval is recorded, and accounting is notified."
    },
    {
      screen: "waybill", stage: 4, role: "accounting", target: "[data-action='financeSign']", title: "Accounting approves finance",
      body: "Accounting reviews the same waybill and selects Approve (Finance). Client confirmation and both approvals are required before a release can be logged."
    },
    {
      screen: "budget", stage: 5, role: "accounting", fill: "budget", target: "#budgetForm .form-card", title: "Record released funds",
      body: "Log each cash, cheque, or PO release with its amount and reference. Trip details carry over. The app records disbursements; it does not transfer money."
    },
    {
      screen: "client", stage: 6, role: "client", cancellation: true, target: "[data-complete-cancel]", title: "The client cancels",
      body: "The client chooses Cancel Booking, enters a reason, and submits. A chat message alone does not cancel a trip. Here, funds were already released."
    },
    {
      screen: "dashboard", stage: 7, role: "owner", target: ".alert-card", title: "Roadlink sees an urgent alert",
      body: "The trip shows Cancelled - Funds Released and For immediate checking. Management and accounting can see what needs checking. Cancellation does not return money automatically."
    },
    {
      screen: "reconcile", stage: 7, role: "accounting", target: "#reconcileForm .form-card", title: "Accounting checks every release",
      body: "Record cash returned, cheques voided, POs cancelled, or expenses already used. Complete checking only when every released item has been resolved."
    },
    {
      screen: "audit", stage: 8, role: "owner", target: ".timeline", title: "Review the full history",
      body: "Open Audit timeline to see who booked, confirmed, approved, released funds, and cancelled. Completing checking keeps the full history intact."
    },
    {
      screen: "clientPortal", stage: 1, role: "client", target: ".client-portal-hero", title: "Try the client portal",
      body: "Clients can request bookings, view trips, and message Roadlink using their own access. Internal costs stay private. Chat is a same-device demo for now.",
      clientDemo: true
    }
  ];

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
    const role = step.role || "coordinator";
    const person = role === "owner" ? "Emmanuel Garces" : role === "accounting" ? "Liza Mercado" : "Mika Santos";
    const trip = sampleTrip(step);
    Object.assign(state, {
      screen: step.screen, role: role === "client" ? null : role,
      session: role === "client" ? null : { profile: { name: person, role } },
      clientSession: role === "client" ? { ...clientDemoUsers[0], id: "CLIENT-MACTAN" } : null,
      dataMode: "guided-demo", googleSheetsConnected: false, emailConnected: false, operationalReady: false,
      trips: [trip], selectedTripId: trip.id, clientPreviewTripId: trip.id,
      demoClientTokens: { [trip.id]: "guided-preview-only" },
      bookingRequests: structuredClone(seed.bookingRequests), approvalRequests: structuredClone(seed.approvalRequests),
      users: structuredClone(seed.users), alerts: [], notifications: [], toast: "", filter: "all",
      cancellationFormOpen: Boolean(step.cancellation), newUserPhoto: ""
    });
    delete state.lastIssuedCredentials;
    render();
    if (step.preview) app().innerHTML = renderPreview(step.preview, trip);
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

  function renderPreview(kind, trip) {
    if (kind === "chatStaff" || kind === "chatClient") {
      return window.roadlinkDemoChat.preview(trip, kind === "chatClient" ? "client" : "staff");
    }
    if (kind === "email") return `
      <section class="screen tour-email">
        <div class="tour-mail-heading"><span>Sample client email</span><strong>Please confirm your Roadlink trip</strong><small>To: Ana Lim &lt;${trip.email}&gt;</small></div>
        <div class="tour-mail-body">
          <img src="assets/roadlink-logo.svg" alt="Roadlink Cargo Transport Service">
          <h2>Please confirm your booking</h2><p>Dear Ana,</p><p>Please review your trip with Roadlink Cargo Transport Service.</p>
          <dl><dt>Company</dt><dd>${trip.client}</dd><dt>Route</dt><dd>${trip.route}</dd><dt>Vehicle</dt><dd>${trip.vehicle} / GAA 4821</dd><dt>Trip date</dt><dd>${displayDate(trip.date)}</dd></dl>
          <div class="actions"><button class="success" type="button">Confirm booking</button><button class="danger" type="button">Cancel booking</button></div>
          <button class="ghost wide" type="button">Contact Roadlink</button>
          <p>Thank you,<br>Mika Santos<br>Roadlink Cargo Transport Service</p>
          <img class="tour-mail-fleet" src="assets/email-signature-trucks.png" alt="Roadlink truck fleet">
          <small>Lapu-Lapu City, Cebu, Philippines<br>We Go Wherever Roads Go!</small>
        </div>
      </section>`;
    return `<section class="screen tour-recap"><img src="assets/roadlink-logo.svg" alt="Roadlink"><h2>From booking to accountability</h2>
      <ol><li><b>Coordinator</b><span>Create trip and send client confirmation</span></li><li><b>Client</b><span>Review and confirm the booking</span></li><li><b>Coordinator</b><span>Prepare and submit the waybill</span></li><li><b>Manager, then accounting</b><span>Approve the waybill in sequence</span></li><li><b>Accounting</b><span>Record cash, cheque, and PO releases</span></li><li><b>If cancelled after release</b><span>Check each item, record the outcome, reconcile</span></li></ol><p>Review the audit timeline at any stage.</p></section>`;
  }

  function showStep() {
    const step = steps[index];
    host.innerHTML = `
      <div class="tour-blocker"></div><div class="tour-spotlight" aria-hidden="true"></div>
      <div class="tour-dialog" role="dialog" aria-modal="true" aria-labelledby="tourTitle" aria-describedby="tourBody">
        <header class="tour-compact-header"><span>${index + 1} OF ${steps.length} · ${step.role === "client" ? "CLIENT" : step.role === "owner" ? "MANAGER" : step.role === "accounting" ? "ACCOUNTING" : "COORDINATOR"}</span><button type="button" class="tour-skip" data-tour="close">Skip tour</button></header>
        <div class="tour-content">
          <h2 id="tourTitle" tabindex="-1">${step.title}</h2><p id="tourBody" class="tour-copy">${step.body}</p>
          ${step.clientDemo ? `<a class="workspace-demo-link" href="?demo=client${document.body.classList.contains("mobile-preview") ? "&mobile=1" : ""}" target="_blank" rel="noopener">Open client demo</a>` : ""}
        </div>
        <footer class="tour-footer"><button type="button" class="ghost" data-tour="back" ${index === 0 ? "disabled" : ""}>Back</button><button type="button" class="primary" data-tour="next">${index === steps.length - 1 ? "Explore the app" : "Next"}</button></footer>
      </div>`;
    applyScene(step);
    host.querySelectorAll("[data-tour]").forEach((button) => button.addEventListener("click", () => {
      if (button.dataset.tour === "close") close();
      else if (button.dataset.tour === "chat") {
        const trip = sampleTrip(step);
        close();
        window.roadlinkDemoChat.start(trip, step.role === "client" ? "client" : "staff");
      }
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
    if (step.preview === "email") target = app().querySelector(".tour-mail-body h2");
    if (step.preview?.startsWith("chat")) target = app().querySelector(".chat-view-tabs");
    if (step.preview === "recap") target = app().querySelector(".tour-recap h2");
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
