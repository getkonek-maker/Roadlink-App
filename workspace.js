(() => {
  const seed = structuredClone(state);
  let demoActive = false;
  let snapshot;
  let demoRole = "coordinator";
  const authScreens = new Set(["home", "login", "liveLogin", "liveClientLogin", "clientLogin", "accountRequest", "forgotPassword"]);

  function setRole(role) {
    demoRole = role;
    state.role = role === "client" ? null : role;
    state.clientSession = role === "client" ? { ...clientDemoUsers[0], id: "CLIENT-MACTAN", name: "Ana Lim", role: "client" } : null;
    const person = role === "owner" ? "Zeno Jief Flores" : role === "accounting" ? "Liza Mercado" : "Mika Santos";
    state.session = role === "client" ? null : { profile: { id: `DEMO-${role}`, name: person, role } };
  }

  function startDemo(initialRole = "coordinator") {
    const role = initialRole === "client" || roles.some((item) => item.id === initialRole) ? initialRole : "coordinator";
    if (demoActive) {
      setRole(role);
      state.screen = roleHomeScreen();
      state.filter = "all";
      const url = new URL(location.href); url.searchParams.set("demo", role); history.replaceState(null, "", url);
      render(); return;
    }
    snapshot = structuredClone(state);
    demoActive = true;
    Object.assign(state, structuredClone(seed), { dataMode: "presentation-demo", toast: "", filter: "all" });
    state.trips.forEach((trip, index) => {
      const date = new Date(); date.setDate(date.getDate() + 7 + index * 2);
      trip.date = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      if (trip.status === "funds") Object.assign(trip.waybill, { approvedBy: "Zeno Jief Flores", financeBy: "Liza Mercado", status: "Approved" });
    });
    const awaiting = structuredClone(state.trips[0]);
    Object.assign(awaiting, { id: "RL-2412", status: "confirmed", budget: [], route: "Cebu to Bohol", destination: "Tagbilaran City, Bohol" });
    Object.assign(awaiting.waybill, { number: "037959", approvedBy: "", financeBy: "", status: "Submitted" });
    awaiting.timeline = [eventLine("Mika Santos submitted the waybill for manager approval")];
    state.trips.push(awaiting);
    const financeReview = structuredClone(awaiting);
    Object.assign(financeReview, { id: "RL-2414", route: "Cebu to Dumaguete", destination: "Dumaguete City, Negros Oriental" });
    Object.assign(financeReview.waybill, { number: "037960", approvedBy: "Zeno Jief Flores", status: "Manager Signed" });
    financeReview.timeline.push(eventLine("Zeno Jief Flores approved the waybill; accounting notified"));
    state.trips.push(financeReview);
    const ready = structuredClone(financeReview);
    Object.assign(ready, { id: "RL-2415", route: "Cebu to Bacolod", destination: "Bacolod City, Negros Occidental" });
    Object.assign(ready.waybill, { number: "037961", financeBy: "Liza Mercado", status: "Approved" });
    ready.timeline.push(eventLine("Liza Mercado approved finance; ready to record disbursements"));
    state.trips.push(ready);
    const checking = structuredClone(state.trips[0]);
    Object.assign(checking, { id: "RL-2413", route: "Cebu to Iloilo", destination: "Iloilo City, Iloilo", status: "needs", cancelledReason: "Client postponed the shipment." });
    checking.timeline.push(eventLine("Client cancelled after funds were released; accounting notified"));
    state.trips.push(checking);
    state.bookingRequests[0].date = state.trips[0].date;
    setRole(role);
    state.screen = roleHomeScreen();
    const url = new URL(location.href); url.searchParams.set("demo", role); history.replaceState(null, "", url);
    render();
  }

  function closeDemo() {
    if (!demoActive) return;
    demoActive = false;
    Object.keys(state).forEach((key) => { if (!Object.hasOwn(snapshot, key)) delete state[key]; });
    Object.assign(state, snapshot);
    const url = new URL(location.href); url.searchParams.delete("demo"); url.searchParams.delete("walkthrough"); history.replaceState(null, "", url);
    document.body.classList.remove("mobile-preview");
    render();
  }

  function enterGuidedDemo(role) {
    startDemo(role);
    window.roadlinkWalkthrough.start();
  }

  function navigationItems() {
    const count = (status) => state.trips.filter((trip) => activeTrip(trip) && trip.waybill.status === status).length;
    const checks = state.trips.filter((trip) => trip.status === "needs").length;
    if (state.clientSession && !state.session) return [["clientPortal", "My bookings"], ["clientBooking", "Request booking"], ["messages", "Messages"]];
    if (state.role === "owner") return [["tasks", "Overview", roleWorkItems().length + state.approvalRequests.filter((item) => item.status === "Pending").length], ["managerApprovals", "Pending approvals", count("Submitted")], ["dashboard", "Trips"], ["reconcile", "Cancellation alerts", checks], ["audit", "Audit history"], ["messages", "Messages"], ["users", "Users & access", state.approvalRequests.filter((item) => item.status === "Pending").length]];
    if (state.role === "accounting") return [["tasks", "My tasks", roleWorkItems().length], ["financeApprovals", "Finance approvals", count("Manager Signed")], ["disbursements", "Disbursements"], ["reconcile", "Cancellation checking", checks], ["dashboard", "Trips"], ["audit", "Audit history"]];
    if (state.role === "admin") return [["users", "Users & access"], ["dashboard", "Trip records"], ["audit", "Audit history"]];
    return [["tasks", "My tasks", roleWorkItems().length], ["dashboard", "Trips"], ["newTrip", "New booking"], ["waybills", "Waybills"], ["messages", "Messages"]];
  }

  function currentNavigation() {
    const screen = state.screen;
    const fallback = screen === "chat" ? "messages" : screen === "detail" ? "dashboard"
      : screen === "waybill" ? (state.role === "owner" ? "managerApprovals" : state.role === "accounting" ? "financeApprovals" : "waybills")
      : screen === "budget" ? "disbursements" : screen === "clientBookingDetail" ? "clientPortal"
      : screen === "bookingRequest" ? "tasks" : screen;
    const section = state.parentNav?.screen === screen ? state.parentNav.section : fallback;
    const items = navigationItems();
    const position = items.findIndex(([key]) => key === section);
    return { section, label: items[position]?.[1] || "Trips", inMore: position >= 3 };
  }

  function renderChrome() {
    const workspace = !authScreens.has(state.screen);
    const shell = document.querySelector(".workspace-shell");
    shell.classList.toggle("is-workspace", workspace);
    const nav = document.querySelector("#workspaceNav");
    const client = Boolean(state.clientSession) && !state.session;
    const items = navigationItems();
    const current = currentNavigation();
    const guiding = Boolean(window.roadlinkWalkthrough?.active);
    const navButton = ([screen, label, count]) => `<button type="button" data-workspace-nav="${screen}" ${current.section === screen ? 'aria-current="page"' : ""} class="${current.section === screen ? `is-current ${guiding ? "tour-nav-current" : ""}` : ""}"><span>${label}</span>${count ? `<b>${count}</b>` : ""}</button>`;
    nav.innerHTML = `<div class="workspace-brand"><img src="assets/roadlink-logo.svg" alt="Roadlink Cargo Transport Service"><span>Trip Control</span></div><nav>${items.map(navButton).join("")}</nav><div class="workspace-nav-footer"><button type="button" data-workspace-tour>Guided tour</button><button type="button" data-workspace-phone>${document.body.classList.contains("mobile-preview") ? "Desktop view" : "Phone view"}</button><div class="workspace-person"><span class="workspace-avatar">${client ? "AL" : initials(state.session?.profile?.name || "Roadlink")}</span><div><strong>${escapeUiText(client ? state.clientSession.contact || state.clientSession.name : state.session?.profile?.name || "Roadlink staff")}</strong><small>${client ? "Client" : roleLabel()}</small></div></div></div>`;
    const locked = guiding;
    let mobileNav = document.querySelector("#mobileNav");
    if (!mobileNav) { mobileNav = document.createElement("nav"); mobileNav.id = "mobileNav"; mobileNav.className = "workspace-mobile-nav"; mobileNav.setAttribute("aria-label", "Role navigation"); document.querySelector("#phoneFrame").append(mobileNav); }
    mobileNav.hidden = !workspace || locked;
    mobileNav.innerHTML = `${items.slice(0, 3).map(navButton).join("")}<details class="mobile-more"><summary>More</summary><div>${items.slice(3).map(navButton).join("")}<button type="button" data-workspace-tour>Guided tour</button>${demoActive ? `<button type="button" data-workspace-access>Choose demo access</button>` : `<button type="button" data-workspace-logout>Sign out</button>`}</div></details>`;
    const toolbar = document.querySelector("#demoToolbar");
    toolbar.hidden = !demoActive || locked;
    toolbar.innerHTML = demoActive ? `<span class="workspace-demo-label">Sample data · ${client ? "Client" : roleLabel()}</span><button type="button" data-workspace-access>Switch access</button>${document.body.classList.contains("mobile-preview") ? `<button type="button" class="demo-layout-button" data-workspace-phone>Desktop view</button>` : ""}` : "";
    nav.inert = locked;
    mobileNav.hidden = !workspace;
    mobileNav.inert = locked;
    const more = mobileNav.querySelector("summary");
    more.classList.toggle("is-current", current.inMore);
    more.classList.toggle("tour-nav-current", guiding && current.inMore);
    toolbar.inert = locked;
    document.querySelectorAll("[data-workspace-nav]").forEach((button) => button.addEventListener("click", () => {
      const screen = button.dataset.workspaceNav;
      if (screen === "audit" && !state.trips.length) { setToast("Open a trip to view its audit history."); return; }
      if (window.roadlinkDemoChat?.active) window.roadlinkDemoChat.close();
      if (screen === "messages") window.roadlinkDemoChat.openInbox();
      else navigate(screen);
    }));
    document.querySelectorAll("[data-workspace-tour]").forEach((button) => button.addEventListener("click", () => {
      if (window.roadlinkDemoChat?.active) window.roadlinkDemoChat.close();
      window.roadlinkWalkthrough.start();
    }));
    document.querySelectorAll("[data-workspace-access]").forEach((button) => button.addEventListener("click", () => {
      if (window.roadlinkDemoChat?.active) window.roadlinkDemoChat.close();
      navigate("home");
    }));
    document.querySelector("[data-workspace-logout]")?.addEventListener("click", logoutCurrentUser);
    document.querySelectorAll("[data-workspace-phone]").forEach((button) => button.addEventListener("click", () => {
      const mobile = document.body.classList.toggle("mobile-preview");
      const url = new URL(location.href); if (mobile) url.searchParams.set("mobile", "1"); else url.searchParams.delete("mobile"); history.replaceState(null, "", url);
      renderChrome();
    }));
    toolbar.querySelector("[data-workspace-exit]")?.addEventListener("click", closeDemo);
  }

  async function request(path, options = {}) {
    const payload = options.body ? sanitizeForUi(JSON.parse(options.body)) : {};
    const trip = state.trips.find((item) => item.id === payload.tripId);
    const actor = state.session?.profile?.name || state.clientSession?.contact || "Ana Lim";
    const addEvent = (item, text) => item.timeline.push(eventLine(`${actor}: ${text} (demo)`));
    const resultTrip = () => ({ ok: true, trip: structuredClone(trip) });
    if (path === "/api/session/bootstrap") return { ok: true, data: { mode: "presentation-demo", trips: structuredClone(state.trips), bookingRequests: structuredClone(state.bookingRequests), accountRequests: structuredClone(state.approvalRequests), notifications: [] } };
    if (path === "/api/demo/client-link") return { ok: true, token: "presentation-preview" };
    if (path === "/api/trips") {
      const created = structuredClone(payload.trip);
      created.timeline = [eventLine("Sample booking created; confirmation email preview available")];
      return { ok: true, trip: created, demoClientToken: "presentation-preview", email: { ok: false, message: "Demo trip created. No real confirmation email was sent." } };
    }
    if (path === "/api/send-email" || /\/send-email$|\/send-confirmation$/.test(path)) return { ok: true, message: "Email preview only. No email was sent." };
    if (path === "/api/client-action" && trip) {
      if (payload.action === "confirm") { if (["cancelled", "needs", "reconciled"].includes(trip.status)) throw new Error("This trip has already been cancelled."); trip.status = trip.budget.length ? "funds" : "confirmed"; }
      if (payload.action === "cancel") { trip.status = totalBudget(trip) ? "needs" : "cancelled"; trip.cancelledReason = payload.reason || "Shipment postponed."; }
      addEvent(trip, payload.action === "contact" ? "requested coordinator follow-up" : `${payload.action} booking`);
      return resultTrip();
    }
    if (path === "/api/waybills/submit" && trip) { Object.assign(trip.waybill, payload.waybill, { status: "Submitted", approvedBy: "", financeBy: "" }); addEvent(trip, "submitted waybill"); return resultTrip(); }
    if (path === "/api/waybills/approve-manager" && trip) {
      if (state.role !== "owner" || !activeTrip(trip) || trip.waybill.status !== "Submitted") throw new Error("A manager approves after the coordinator submits the waybill.");
      Object.assign(trip.waybill, { approvedBy: actor, status: "Manager Signed" }); addEvent(trip, "approved waybill as manager"); return resultTrip();
    }
    if (path === "/api/waybills/approve-finance" && trip) {
      if (state.role !== "accounting" || !activeTrip(trip) || trip.waybill.status !== "Manager Signed") throw new Error("Finance approval follows manager approval.");
      Object.assign(trip.waybill, { financeBy: actor, status: "Approved" }); addEvent(trip, "approved finance"); return resultTrip();
    }
    if (path === "/api/budget-items" && trip) {
      if (state.role !== "accounting" || trip.waybill.status !== "Approved" || !["confirmed", "funds"].includes(trip.status)) throw new Error("Client confirmation and both approvals are required before release.");
      trip.budget.push({ type: payload.type, amount: payload.amount, detail: payload.detail, state: "Released" }); trip.status = "funds"; addEvent(trip, `logged ${payload.type} release of ${money(payload.amount)}`); return resultTrip();
    }
    if (path === "/api/reconciliation/update" && trip) {
      if (state.role !== "accounting") throw new Error("Accounting completes checking.");
      const unresolved = trip.budget.some((item) => item.type === "Cheque" ? !payload.chequeVoided : item.type === "PO" ? !payload.poCancelled : !payload.cashReturned);
      if (unresolved) throw new Error("Resolve every released item before completing this sample checking task.");
      Object.assign(trip.reconciliation, payload); trip.status = "reconciled"; addEvent(trip, "completed reconciliation"); return resultTrip();
    }
    if (path === "/api/client-portal/booking-request") return { ok: true, request: { ...sanitizeForUi(payload), id: `BR-${Date.now()}` } };
    if (path === "/api/admin/reject-account") return { ok: true, request: { status: "Declined" } };
    if (path === "/api/admin/approve-account") {
      const item = state.approvalRequests.find((request) => request.id === payload.requestId);
      return { ok: true, profile: { id: `DEMO-${Date.now()}`, name: item.name, email: item.email, role: "coordinator", username: item.email }, credentials: { username: item.email, password: "Sample-Access-2026" }, email: { ok: false } };
    }
    throw new Error("This action is available in the connected app. The current workspace uses sample data.");
  }

  window.roadlinkWorkspace = { renderChrome, startDemo, enterGuidedDemo, closeDemo, request, currentNavigation, get demoActive() { return demoActive; } };
})();
