(() => {
  const steps = [
    {
      chapter: 0, screen: "dashboard", target: ".status-grid", title: "Welcome to Roadlink Trip Control",
      body: "Roadlink keeps a booking, its waybill, and its released funds together. We'll follow Mika's Cebu-to-Leyte trip and see what each person does.",
      action: "Use Next to move through the sample screens. Back lets you revisit anything.",
      outcome: "By the end, you'll know how to book, approve, release, handle a cancellation, and check the records.", next: "Show me how"
    },
    {
      chapter: 0, screen: "login", target: "#loginRole", title: "Each person signs in to their own role",
      body: "Coordinator: books trips and prepares waybills. Manager: approves the waybill. Accounting: approves finance, records releases, and checks returns. Admin: manages access.",
      action: "Tap Staff log in, select your assigned role, then enter your email or username and password. Remember login details keeps your username and role handy.",
      outcome: "You land on your role's dashboard. The tour will switch roles for you so you can see the handoffs."
    },
    {
      chapter: 0, screen: "accountRequest", target: "#accountRequestForm", title: "New staff request access first",
      body: "A new coordinator or accountant starts with Create account request on the login page.",
      action: "Enter your name, email, company if applicable, and requested role, then submit the request.",
      outcome: "An owner or admin reviews the request before an account is issued. Requesting a role does not grant access."
    },
    {
      chapter: 0, screen: "users", role: "owner", target: ".approval-list", title: "The owner approves staff accounts",
      body: "The owner opens Users on the dashboard. Pending account requests appear under Account approvals.",
      action: "Check the person's identity and requested role, then choose Approve or Decline.",
      outcome: "Approval creates an account and temporary credentials. The user can then sign in and change their password."
    },
    {
      chapter: 1, screen: "dashboard", target: "[data-action='newTrip']", title: "The coordinator starts on the dashboard",
      body: "The dashboard groups trips by status. Waiting client means the client has not confirmed yet. Funds released means accounting has recorded a release.",
      action: "Tap New trip to start a booking. Later, use the status filters and Open trip to find an existing booking.",
      outcome: "One trip record will carry the client, route, waybill, releases, and history."
    },
    {
      chapter: 1, screen: "newTrip", target: "#newTripForm .form-card", fill: "trip", title: "Enter the company and authorized contact",
      body: "For our example, Mika books for Mactan Seafoods Export. Ana Lim is the person authorized to confirm or cancel.",
      action: "Fill Company, Authorized contact, their email and phone. Email is the main channel; choose WhatsApp or Viber if a follow-up is useful.",
      outcome: "The confirmation goes to the email entered here. These sample values belong only to this tour."
    },
    {
      chapter: 1, screen: "newTrip", target: "#newTripForm .form-card:nth-of-type(2)", fill: "trip", title: "Choose the route, truck, and date",
      body: "Our sample travels from Mandaue City, Cebu to Ormoc City, Leyte in a 10-wheeler, plate GAA 4821.",
      action: "Enter From and To, select Vehicle type, assign a plate if known, pick a Trip date, and add Cargo notes. Tap Create trip and send confirmation email.",
      outcome: "A Pending trip is created. Its details carry into the waybill so you don't have to type them again.", next: "See the sample email"
    },
    {
      chapter: 1, screen: "client", preview: "email", stage: 1, title: "The client receives a Roadlink email", role: "client",
      body: "The email identifies the trip, route, date, truck, and contact. The coordinator can resend it from Trip Detail when needed.",
      action: "The client chooses Confirm booking, Cancel booking, or Contact Roadlink. The secure page asks them to review their choice.",
      outcome: "The client can respond without installing an app or signing in. This is a sample email preview; the tour sends no email."
    },
    {
      chapter: 1, screen: "client", stage: 1, role: "client", target: "[data-client-confirm]", title: "The client confirms on the secure page",
      body: "Ana checks the trip details, then taps Confirm Booking. Opening the email alone does not confirm the trip.",
      action: "For a real booking, use the secure link in the email. Contact Roadlink records a request for the coordinator to follow up; it does not change the trip status.",
      outcome: "Confirmation is recorded against this trip. Staff can now see Confirmed.", next: "Show the confirmed trip"
    },
    {
      chapter: 1, screen: "detail", stage: 2, target: ".detail-hero", title: "Confirmed does not mean money was released",
      body: "Mika opens the trip and sees Confirmed. The client has agreed to the booking, but the budget is still zero.",
      action: "In Trip Detail, open Prepare / open waybill to prepare the proposed trip costs.",
      outcome: "Client confirmation and waybill approvals are separate steps. Both are required before accounting records a release.",
      check: { question: "The client confirmed. Can accounting release funds now?", options: ["Yes, confirmation is enough", "Only after manager and finance approval"], correct: 1, explanation: "Correct. A confirmed trip also needs an approved waybill before funds can be logged." }
    },
    {
      chapter: 2, screen: "waybill", stage: 2, target: ".waybill-paper", title: "Prepare the digital waybill",
      body: "The trip's company, destination, cargo, date, and plate are already carried over. The waybill follows Roadlink's printable form.",
      action: "Complete the driver, shipment, rates, and expense fields. On a phone, swipe sideways across the paper to inspect the remaining columns.",
      outcome: "The waybill is the proposal for approval. Amounts typed here are not yet disbursed funds."
    },
    {
      chapter: 2, screen: "waybill", stage: 3, target: "[data-action='submitWaybill']", title: "Submit it to the manager",
      body: "Mika taps Save and submit. The waybill is now Submitted and the manager receives an in-app notification.",
      action: "After submitting, let the manager review it. Print waybill opens the printable copy; Email waybill sends the trip's waybill by email.",
      outcome: "The coordinator prepares the record. The manager and accounting use their own accounts to approve it."
    },
    {
      chapter: 2, screen: "waybill", stage: 3, role: "owner", target: "[data-action='managerSign']", title: "The manager approves in the app",
      body: "The manager opens the submitted trip's waybill and reviews the route, driver, and proposed costs.",
      action: "Choose Approve (Manager) after checking the details. Approval records the manager's identity in the trip history.",
      outcome: "The waybill becomes Manager Signed, and accounting is notified. An email notice is a backup; the approval happens here."
    },
    {
      chapter: 2, screen: "waybill", stage: 4, role: "accounting", target: "[data-action='financeSign']", title: "Accounting checks and approves finance",
      body: "Accounting opens the same waybill with the manager's approval already recorded. There is no need to recreate the trip.",
      action: "Review the costs and choose Approve (Finance). Finance approval follows manager approval.",
      outcome: "The waybill becomes Approved. With client confirmation also recorded, the release log is now available."
    },
    {
      chapter: 2, screen: "budget", stage: 5, role: "accounting", fill: "budget", target: "#budgetForm .form-card", title: "Record what was actually released",
      body: "From Trip Detail, accounting taps Log budget release. Company, vehicle, plate, and waybill are already attached.",
      action: "Choose Cash, enter 15,000, add the purpose or reference, and Save release log. Add separate entries for the PHP 42,000 shipping cheque and PHP 18,000 fuel PO.",
      outcome: "Each saved entry is a release record. The app logs disbursements; it does not transfer money.", next: "See all three releases"
    },
    {
      chapter: 2, screen: "detail", stage: 6, role: "accounting", target: ".budget-list", title: "PHP 75,000 is now accounted for",
      body: "The sample trip now shows PHP 15,000 cash, PHP 42,000 by cheque, and PHP 18,000 by PO. Its status is Funds Released.",
      action: "Open the trip to review release amounts and references. Use Audit to see who recorded each action.",
      outcome: "If the client cancels, management can see the entire exposure, including cash and supplier commitments."
    },
    {
      chapter: 3, screen: "detail", stage: 2, earlyCancellation: true, target: ".detail-hero", title: "First: a cancellation before any release",
      body: "Here is the simpler branch: the client cancels while the trip has no released cash, cheque, or PO.",
      action: "The client taps Cancel Booking on the secure page, enters a reason, and submits the cancellation.",
      outcome: "Staff see Cancelled and the reason is recorded. There are no released funds to return. Next we'll return to the PHP 75,000 example."
    },
    {
      chapter: 3, screen: "client", stage: 6, role: "client", cancellation: true, target: "[data-complete-cancel]", title: "Now: Ana cancels after the release",
      body: "Return to our funded trip. Ana uses the secure client page, chooses Cancel Booking, and gives a reason: shipment postponed by the buyer.",
      action: "The client reviews the reason and taps Submit cancellation. Contact Roadlink alone would only request a follow-up.",
      outcome: "Submitting records the cancellation and triggers the funded-trip checking workflow.", next: "Show the alert"
    },
    {
      chapter: 3, screen: "dashboard", stage: 7, role: "owner", target: ".alert-card", title: "Management sees For immediate checking",
      body: "The trip becomes Cancelled - Funds Released. An urgent alert appears for management and accounting because PHP 75,000 was already logged.",
      action: "Open the flagged trip to inspect its releases. Accounting opens the checking task to record what was returned, voided, cancelled, or already used.",
      outcome: "Cancellation does not automatically return cash or cancel a cheque. Those actions must be checked and recorded.",
      check: { question: "Does cancelling the trip automatically return the PHP 15,000?", options: ["Yes, the app reverses it", "No, accounting must verify and record the return"], correct: 1, explanation: "Correct. The alert creates visibility; accounting still verifies the real cash and supplier transactions." }
    },
    {
      chapter: 3, screen: "reconcile", stage: 7, role: "accounting", target: "#reconcileForm .form-card", title: "Accounting closes the loop",
      body: "Open the trip, then Open checking task. For this example, all PHP 15,000 cash is returned, the shipping cheque is voided, and the fuel PO is cancelled.",
      action: "Record each item's actual outcome and explain any expense already used. Choose Mark checking complete once every release has been resolved.",
      outcome: "The trip becomes Reconciled and leaves the immediate-checking queue. It remains available in the trip history.", next: "See the completed record"
    },
    {
      chapter: 3, screen: "audit", stage: 8, role: "owner", target: ".timeline", title: "The audit timeline tells the whole story",
      body: "Open Audit from Trip Detail, or Audit timeline on its dashboard card. The history shows booking, confirmation, approvals, releases, cancellation, and reconciliation.",
      action: "Read who acted and when. Use the timeline alongside the release references to review a disputed transaction.",
      outcome: "Reconciling closes the checking task; it does not erase the cancellation or the money trail."
    },
    {
      chapter: 4, screen: "clientPortal", stage: 1, role: "client", target: ".client-portal-hero", title: "Clients can also use an optional portal",
      body: "A client chooses Client portal on the home page and signs in with approved access. They see their company's bookings and requests.",
      action: "Open a booking to review route, date, cargo, and status. Pending bookings can be confirmed or cancelled.",
      outcome: "Client screens keep internal budgets, staff audit records, and approval controls private. Email links remain available."
    },
    {
      chapter: 4, screen: "clientBooking", stage: 1, role: "client", fill: "request", target: "#clientBookingForm", title: "The client requests a new booking",
      body: "In the portal, tap Request new booking. Ana enters the route, vehicle, date, and cargo requirements.",
      action: "Submit the request for Roadlink to review. The company and authorized contact identify who is requesting the service.",
      outcome: "This creates a booking request, not an official trip. Staff still review availability and arrange the vehicle."
    },
    {
      chapter: 4, screen: "dashboard", stage: 1, target: ".request-list", title: "The coordinator reviews the portal request",
      body: "Back on the staff dashboard, Client booking requests lists the route, company, vehicle, and date requested by the client.",
      action: "Review the request with the client and check availability first. Selecting the request in this version converts it into an official trip.",
      outcome: "The official booking then follows the same confirmation, waybill, approval, and release process. Invoice access and GPS tracking are future additions."
    },
    {
      chapter: 5, screen: "detail", stage: 2, target: ".chat-entry", title: "Keep conversations with their trip",
      body: "Open Trip messages inside Trip Detail. Clients have the same entry in their booking details, so questions about a loading time or address stay with that booking.",
      action: "Use the chat demo to try a conversation between Roadlink and its client. Each booking has its own sample conversation.",
      outcome: "For this preview, messages stay on the current device. Live delivery between different users and devices comes in the next phase."
    },
    {
      chapter: 5, screen: "detail", stage: 2, preview: "chatStaff", title: "Read and reply as Roadlink",
      body: "Mika sees Ana's question about changing the loading time. A message shows who sent it and when; unread badges identify a reply waiting in the other view.",
      action: "Choose Roadlink staff, type a reply or pick a suggested message, then tap Send. Choose Client to read it from Ana's side.",
      outcome: "Switching views in the demo marks received messages as read. You can try both sides without creating accounts.", tryChat: true
    },
    {
      chapter: 5, screen: "detail", stage: 2, role: "client", preview: "chatClient", title: "Clients reply in the same conversation",
      body: "Ana can ask about the shipment and reply to the coordinator. She sees the trip's conversation without Roadlink's internal costs or approval controls.",
      action: "In the demo, switch to Client, send a message, then return to Roadlink staff to read it. Reset demo restores the sample messages.",
      outcome: "A message does not confirm or cancel a booking. Those actions still use the booking buttons, keeping the trip status unambiguous.", tryChat: true
    },
    {
      chapter: 6, screen: "detail", stage: 2, preview: "recap", title: "Your everyday Roadlink workflow",
      body: "Coordinator books and prepares. Client confirms. Manager approves. Accounting approves finance and logs the releases. If the client cancels, accounting checks the money trail.",
      action: "To work in the app: log in, open your dashboard, then use New trip or Open trip. The ? button replays this tour whenever you need it.",
      outcome: "Finish returns you to the screen you were using. You can replay any chapter or open the hands-on chat demo below.", tryChat: true,
      check: { question: "Who resolves a cancelled trip's released funds?", options: ["The coordinator deletes the booking", "Accounting records the outcome of each release"], correct: 1, explanation: "Exactly. Accounting resolves the released items, while management can review the trip and its audit timeline." }, next: "Finish walkthrough"
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
  const tips = [
    "Follow one Cebu-to-Leyte booking through confirmation, approvals, cash release, and cancellation. These are sample records. At the end, you can explore the demo yourself.",
    "Choose your assigned role, then enter your email or username and password. Coordinators prepare bookings, managers approve, and accounting records the money. This tour switches roles for you.",
    "New staff choose Create account request and enter their name, email, and requested role. Access is granted only after an owner or admin reviews the request.",
    "Owners and admins open Users & access. Review each request, then Approve or Decline. Approval issues temporary credentials for that person's own account.",
    "This is the trips workspace. Use the status filters to find a booking, or choose New trip. Open trip brings together its client, waybill, releases, and history.",
    "Enter the company and the person authorized to confirm or cancel. Their email receives the confirmation; phone, WhatsApp, and Viber support follow-up. The sample values here belong only to this tour.",
    "Choose From, To, vehicle type, plate number, and date, then add cargo notes. Create trip sends the confirmation in the connected app. These details carry into the waybill.",
    "The client receives this branded email with route, date, vehicle, and three choices: confirm, cancel, or contact Roadlink. The secure review link works without an app or account.",
    "The client checks the details and selects Confirm Booking. Opening the email alone does not confirm the trip. Contact Roadlink asks the coordinator to follow up.",
    "Confirmed means the client accepted the booking. Money has not been released yet. Next, the coordinator opens the waybill and prepares the proposed costs.",
    "Trip details are already filled in. Complete the driver, rates, and expense amounts. On a phone, swipe across the paper to inspect the remaining columns. These are proposed costs, not released funds.",
    "Save and submit sends the waybill to the manager's approval queue. The coordinator prepares it; the manager and finance approve with their own accounts. You can also print or email the waybill.",
    "The manager reviews the submitted waybill and chooses Approve (Manager). Their identity is recorded, and accounting is notified to perform the finance review.",
    "Accounting reviews the same waybill and chooses Approve (Finance). Both approvals plus client confirmation must be recorded before a release can be logged.",
    "Accounting chooses the release type, amount, and purpose or reference. Save one entry per cash, cheque, or PO release. The app records what was disbursed; it does not transfer money.",
    "This sample now has PHP 15,000 cash, a PHP 42,000 cheque, and a PHP 18,000 PO: PHP 75,000 total. Each release stays attached to the trip, ready for checking if it is cancelled.",
    "If the client cancels before any release, the trip becomes Cancelled. The reason stays in its history, and there are no released funds to recover. Now let's see the funded case.",
    "The client chooses Cancel Booking, enters a reason, and submits. Here the shipment was postponed after money was released. A chat message or contact request alone does not cancel the booking.",
    "The status becomes Cancelled - Funds Released, with For immediate checking. Management sees the exposure, and accounting checks the actual cash, cheque, and PO. Cancellation never returns money automatically.",
    "Accounting records whether cash was returned, the cheque was voided, and the PO was cancelled, plus any used expenses. Complete checking only when every release is resolved.",
    "Open Audit timeline to see who booked, confirmed, approved, released, cancelled, and reconciled. Completing reconciliation removes the urgent task while preserving the full record.",
    "Clients may use the optional portal to see their own bookings and requests. They cannot see Roadlink's budgets, staff audit history, or accounting controls. Email confirmation links are still available.",
    "Request new booking collects the route, truck, date, cargo, and contact. It creates a request for staff review, not an official trip. The coordinator still checks availability.",
    "Client booking requests appear here. Review availability and contact the client before selecting a request to convert it into an official trip. It then follows the same confirmation and approval process.",
    "Trip messages keeps questions and replies with the booking. Staff open it from Trip Detail; clients open it from Booking Detail. The current conversation is a demo kept in this browser tab.",
    "The coordinator reads the client's loading question and sends a reply. In the hands-on demo, switch between Roadlink staff and Client to try both sides. Unread badges and read status update as you switch.",
    "The client replies in the same conversation without seeing internal costs. Use Try the chat demo to write a message. Confirmation and cancellation still use their booking buttons.",
    "You're ready to explore. Create bookings as coordinator, switch to Manager for approval, then Accounting for releases and checking. The top demo selector changes roles. Reopen this tour with the ? button."
  ];

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
        <header class="tour-compact-header"><span>${index + 1} OF ${steps.length} · ${step.role === "client" ? "CLIENT" : step.role === "owner" ? "MANAGER" : step.role === "accounting" ? "ACCOUNTING" : "ROADLINK"}</span><button type="button" class="tour-skip" data-tour="close">Skip tour</button></header>
        <div class="tour-content">
          <h2 id="tourTitle" tabindex="-1">${step.title}</h2><p id="tourBody" class="tour-copy">${tips[index]}</p>
          ${step.tryChat ? `<button class="secondary tour-try-chat" type="button" data-tour="chat">Try the chat demo</button>` : ""}
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
    const overrides = { home: ".home-logo", accountRequest: "#requestEmail", newTrip: index === 6 ? "#origin" : "#client" };
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
