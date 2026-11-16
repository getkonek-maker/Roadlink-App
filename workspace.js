(() => {
  const seed = structuredClone(state);
  let demoActive = false;
  let snapshot;
  let demoRole = "coordinator";
  const authScreens = new Set(["home", "login", "clientLogin", "accountRequest", "forgotPassword"]);

  function setRole(role) {
    demoRole = role;
    state.role = role === "client" ? null : role;
    state.clientSession = role === "client" ? { ...clientDemoUsers[0], id: "CLIENT-MACTAN", name: "Ana Lim", role: "client" } : null;
    const person = role === "owner" ? "Emmanuel Garces" : role === "accounting" ? "Liza Mercado" : role === "admin" ? "Roadlink Admin" : "Mika Santos";
    state.session = role === "client" ? null : { profile: { id: `DEMO-${role}`, name: person, role } };
  }

  function startDemo() {
    if (demoActive) return;
    snapshot = structuredClone(state);
    demoActive = true;
    Object.assign(state, structuredClone(seed), { dataMode: "presentation-demo", toast: "", filter: "all" });
    state.trips.forEach((trip, index) => {
      const date = new Date(); date.setDate(date.getDate() + 7 + index * 2);
      trip.date = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      if (trip.status === "funds") Object.assign(trip.waybill, { approvedBy: "Emmanuel Garces", financeBy: "Liza Mercado", status: "Approved" });
    });
    const awaiting = structuredClone(state.trips[0]);
    Object.assign(awaiting, { id: "RL-2412", status: "confirmed", budget: [], route: "Cebu to Bohol", destination: "Tagbilaran City, Bohol" });
    Object.assign(awaiting.waybill, { number: "037959", approvedBy: "", financeBy: "", status: "Submitted" });
    awaiting.timeline = [eventLine("Mika Santos submitted the waybill for manager approval")];
    state.trips.push(awaiting);
    const checking = structuredClone(state.trips[0]);
    Object.assign(checking, { id: "RL-2413", route: "Cebu to Iloilo", destination: "Iloilo City, Iloilo", status: "needs", cancelledReason: "Client postponed the shipment." });
    checking.timeline.push(eventLine("Client cancelled after funds were released; accounting notified"));
    state.trips.push(checking);
    state.bookingRequests[0].date = state.trips[0].date;
    setRole("coordinator");
    state.screen = "dashboard";
    const url = new URL(location.href); url.searchParams.set("demo", "1"); history.replaceState(null, "", url);
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

  function renderChrome() {
    const workspace = !authScreens.has(state.screen);
    const shell = document.querySelector(".workspace-shell");
    shell.classList.toggle("is-workspace", workspace);
    const nav = document.querySelector("#workspaceNav");
    const client = Boolean(state.clientSession) && !state.session;
    const items = client ? [["clientPortal", "My bookings"], ["clientBooking", "Request booking"], ["chatClient", "Messages"]]
      : [["dashboard", "Trips"], ...(["coordinator", "owner", "admin"].includes(state.role) ? [["newTrip", "New trip"]] : []), ["waybills", "Waybills"], ["openReconcile", "Immediate checking"], ["chatStaff", "Messages"], ["audit", "Audit timeline"], ...(["owner", "admin"].includes(state.role) ? [["users", "Users & access"]] : [])];
    nav.innerHTML = `<div class="workspace-brand"><img src="assets/roadlink-logo.svg" alt="Roadlink Cargo Transport Service"><span>Trip Control</span></div><nav>${items.map(([screen, label]) => `<button type="button" data-workspace-nav="${screen}" class="${state.screen === screen || (screen === "openReconcile" && state.screen === "reconcile") ? "is-current" : ""}">${label}${screen === "openReconcile" && state.trips.some((trip) => trip.status === "needs") ? `<b>${state.trips.filter((trip) => trip.status === "needs").length}</b>` : ""}</button>`).join("")}</nav><div class="workspace-nav-footer"><button type="button" data-workspace-tour>Guided tour</button><button type="button" data-workspace-phone>${document.body.classList.contains("mobile-preview") ? "Desktop view" : "Phone view"}</button><div class="workspace-person"><span class="workspace-avatar">${client ? "AL" : initials(state.session?.profile?.name || "Roadlink")}</span><div><strong>${escapeUiText(client ? state.clientSession.contact || state.clientSession.name : state.session?.profile?.name || "Roadlink staff")}</strong><small>${client ? "Client" : roleLabel()}</small></div></div></div>`;
    const toolbar = document.querySelector("#demoToolbar");
    toolbar.hidden = !demoActive || window.roadlinkWalkthrough?.active || window.roadlinkDemoChat?.active;
    toolbar.innerHTML = demoActive ? `<span class="workspace-demo-label">Demo workspace</span><label for="demoRole">View as</label><select id="demoRole">${[...roles.map((role) => [role.id, role.label]), ["client", "Client"]].map(([id,label]) => `<option value="${id}" ${demoRole === id ? "selected" : ""}>${label}</option>`).join("")}</select><button type="button" data-workspace-phone>${document.body.classList.contains("mobile-preview") ? "Desktop view" : "Phone view"}</button><button type="button" data-workspace-exit>Exit demo</button>` : "";
    const locked = Boolean(window.roadlinkWalkthrough?.active || window.roadlinkDemoChat?.active);
    nav.inert = locked;
    toolbar.inert = locked;
    nav.querySelectorAll("[data-workspace-nav]").forEach((button) => button.addEventListener("click", () => {
      const screen = button.dataset.workspaceNav;
      if (screen === "audit" && !state.trips.length) { setToast("Open a trip to view its audit history."); return; }
      if (["chatStaff", "chatClient", "openReconcile"].includes(screen)) handleAction(screen);
      else navigate(screen === "waybill" && !state.trips.length ? "dashboard" : screen);
    }));
    nav.querySelector("[data-workspace-tour]").addEventListener("click", () => window.roadlinkWalkthrough.start());
    document.querySelectorAll("[data-workspace-phone]").forEach((button) => button.addEventListener("click", () => {
      const mobile = document.body.classList.toggle("mobile-preview");
      const url = new URL(location.href); if (mobile) url.searchParams.set("mobile", "1"); else url.searchParams.delete("mobile"); history.replaceState(null, "", url);
      renderChrome();
    }));
    toolbar.querySelector("#demoRole")?.addEventListener("change", (event) => {
      setRole(event.target.value); state.screen = demoRole === "client" ? "clientPortal" : "dashboard"; state.filter = "all"; render();
    });
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
      if (!["owner", "admin"].includes(state.role) || trip.waybill.status !== "Submitted") throw new Error("A manager approves after the coordinator submits the waybill.");
      Object.assign(trip.waybill, { approvedBy: actor, status: "Manager Signed" }); addEvent(trip, "approved waybill as manager"); return resultTrip();
    }
    if (path === "/api/waybills/approve-finance" && trip) {
      if (!["accounting", "admin"].includes(state.role) || trip.waybill.status !== "Manager Signed") throw new Error("Finance approval follows manager approval.");
      Object.assign(trip.waybill, { financeBy: actor, status: "Approved" }); addEvent(trip, "approved finance"); return resultTrip();
    }
    if (path === "/api/budget-items" && trip) {
      if (!["accounting", "admin"].includes(state.role) || trip.waybill.status !== "Approved" || !["confirmed", "funds"].includes(trip.status)) throw new Error("Client confirmation and both approvals are required before release.");
      trip.budget.push({ type: payload.type, amount: payload.amount, detail: payload.detail, state: "Released" }); trip.status = "funds"; addEvent(trip, `logged ${payload.type} release of ${money(payload.amount)}`); return resultTrip();
    }
    if (path === "/api/reconciliation/update" && trip) {
      if (!["accounting", "admin"].includes(state.role)) throw new Error("Accounting completes checking.");
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

  window.roadlinkWorkspace = { renderChrome, startDemo, closeDemo, request, get demoActive() { return demoActive; } };
})();
