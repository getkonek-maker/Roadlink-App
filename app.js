const roles = [
  { id: "coordinator", label: "Coordinator", icon: "CO", username: "mika.temp", password: "Roadlink-8421", detail: "Create trips, waybills, and client links." },
  { id: "accounting", label: "Accounting", icon: "AC", username: "finance.temp", password: "Roadlink-2198", detail: "Log releases, returns, cheques, and reconciliation." },
  { id: "owner", label: "Owner / Manager", icon: "OM", username: "owner.temp", password: "Roadlink-6714", detail: "Approve waybills and review funded cancellations." },
  { id: "admin", label: "Admin", icon: "AD", username: "admin.temp", password: "Roadlink-0047", detail: "Add users, roles, temporary passwords, and photos." }
];

const clientDemoUsers = [
  { company: "Mactan Seafoods Export", contact: "Ana Lim", email: "ana@mactanseafreight.example", username: "ana.client", password: "Client-2407", phone: "+63 917 420 1188" }
];

const statusLabels = {
  pending: "Pending",
  confirmed: "Confirmed",
  funds: "Funds Released",
  cancelled: "Cancelled",
  needs: "Cancelled - Funds Released",
  reconciled: "Reconciled"
};

const philippinePlaces = [
  "Lapu-Lapu City, Cebu",
  "Cebu City, Cebu",
  "Mandaue City, Cebu",
  "Talisay City, Cebu",
  "Danao City, Cebu",
  "Toledo City, Cebu",
  "Carcar City, Cebu",
  "Bogo City, Cebu",
  "Naga City, Cebu",
  "Ormoc City, Leyte",
  "Tacloban City, Leyte",
  "Maasin City, Southern Leyte",
  "Baybay City, Leyte",
  "Tagbilaran City, Bohol",
  "Tubigon, Bohol",
  "Dumaguete City, Negros Oriental",
  "Bacolod City, Negros Occidental",
  "Iloilo City, Iloilo",
  "Roxas City, Capiz",
  "Kalibo, Aklan",
  "Caticlan, Aklan",
  "Puerto Princesa City, Palawan",
  "Davao City, Davao del Sur",
  "Cagayan de Oro City, Misamis Oriental",
  "Iligan City, Lanao del Norte",
  "Butuan City, Agusan del Norte",
  "Surigao City, Surigao del Norte",
  "General Santos City, South Cotabato",
  "Zamboanga City, Zamboanga del Sur",
  "Dipolog City, Zamboanga del Norte",
  "Pagadian City, Zamboanga del Sur",
  "Manila",
  "Quezon City, Metro Manila",
  "Makati City, Metro Manila",
  "Pasig City, Metro Manila",
  "Paranaque City, Metro Manila",
  "Caloocan City, Metro Manila",
  "Valenzuela City, Metro Manila",
  "Batangas City, Batangas",
  "Lipa City, Batangas",
  "Calamba City, Laguna",
  "Santa Rosa City, Laguna",
  "Lucena City, Quezon",
  "Naga City, Camarines Sur",
  "Legazpi City, Albay",
  "Tuguegarao City, Cagayan",
  "Baguio City, Benguet",
  "Dagupan City, Pangasinan",
  "San Fernando City, La Union",
  "Angeles City, Pampanga",
  "San Fernando City, Pampanga",
  "Subic Bay Freeport Zone",
  "Olongapo City, Zambales",
  "Tarlac City, Tarlac",
  "Cabanatuan City, Nueva Ecija"
];

const state = {
  screen: "home",
  role: null,
  session: null,
  dataMode: "loading",
  googleSheetsConnected: false,
  emailConnected: false,
  filter: "all",
  toast: "",
  selectedTripId: "RL-2407",
  selectedBookingRequestId: "",
  clientPreviewTripId: null,
  otpSent: false,
  newUserPhoto: "",
  testEmails: ["zenojief_roadlink@yahoo.com", "emmanblangarc@gmail.com"],
  approvalRequests: [
    {
      id: "REQ-1008",
      name: "Joy Reyes",
      email: "joy.dispatch@roadlink.example",
      role: "Coordinator",
      status: "Pending",
      requestedAt: "Jul 2, 2026 11:20 AM"
    }
  ],
  bookingRequests: [
    {
      id: "BR-7001",
      company: "Mactan Seafoods Export",
      contact: "Ana Lim",
      email: "ana@mactanseafreight.example",
      phone: "+63 917 420 1188",
      origin: "Mandaue City, Cebu",
      destination: "Tacloban City, Leyte",
      vehicle: "Wing van",
      date: "2026-07-16",
      cargo: "Chilled seafood cartons",
      status: "Needs staff review",
      createdAt: "Jul 4, 2026 9:30 AM",
      clientId: "CLIENT-MACTAN"
    }
  ],
  notifications: [],
  clientSession: null,
  users: [
    { name: "Mika Santos", role: "Coordinator", username: "mika.temp", password: "Roadlink-8421", initials: "MS", photo: "" },
    { name: "Liza Mercado", role: "Accounting", username: "finance.temp", password: "Roadlink-2198", initials: "LM", photo: "" },
    { name: "Emmanuel Garces", role: "Owner / Manager", username: "owner.temp", password: "Roadlink-6714", initials: "EG", photo: "" }
  ],
  trips: [
    {
      id: "RL-2407",
      client: "Mactan Seafoods Export",
      contact: "Ana Lim",
      phone: "+63 917 420 1188",
      email: "ana@mactanseafreight.example",
      route: "Cebu to Leyte",
      origin: "Mandaue City, Cebu",
      destination: "Ormoc City, Leyte",
      vehicle: "10-wheeler truck",
      date: "2026-07-08",
      cargo: "Frozen seafood pallets",
      coordinator: "Mika Santos",
      preferredChannel: "Viber",
      status: "funds",
      cancelledReason: "",
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
        { type: "Cash", detail: "Driver meals and port allowance", amount: 15000, state: "Released" },
        { type: "Cheque", detail: "Shipping line booking", amount: 42000, state: "Issued" },
        { type: "PO", detail: "Fuel partner Cebu station", amount: 18000, state: "Open" }
      ],
      reconciliation: {
        cashReturned: false,
        chequeVoided: false,
        poCancelled: false,
        expensesUsed: ""
      },
      timeline: [
        eventLine("Trip created by Mika Santos", "Jul 2, 2026 8:20 AM"),
        eventLine("Client confirmation link sent through Viber", "Jul 2, 2026 8:23 AM"),
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
      route: "Lapu-Lapu to Davao",
      origin: "Lapu-Lapu City, Cebu",
      destination: "Davao City, Davao del Sur",
      vehicle: "Wing van",
      date: "2026-07-10",
      cargo: "Construction supplies",
      coordinator: "Carlo Reyes",
      preferredChannel: "SMS",
      status: "pending",
      cancelledReason: "",
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
      reconciliation: {
        cashReturned: false,
        chequeVoided: false,
        poCancelled: false,
        expensesUsed: ""
      },
      timeline: [
        eventLine("Trip created by Carlo Reyes", "Jul 2, 2026 10:15 AM")
      ]
    }
  ],
  alerts: []
};

function eventLine(text, at = new Date().toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })) {
  return { text, at };
}

function money(value) {
  return `PHP ${Number(value || 0).toLocaleString("en-PH")}`;
}

function displayDate(value) {
  if (!value) return "For scheduling";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value))) return value;
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function totalBudget(trip) {
  return trip.budget.reduce((sum, item) => sum + Number(item.amount || 0), 0);
}

function cashOutTotal(waybill) {
  return ["downpayment", "arrastre", "driver", "helper", "labor", "others"]
    .reduce((sum, key) => sum + Number(waybill[key] || 0), 0);
}

function overallTotal(waybill) {
  return Number(waybill.freight || 0) + cashOutTotal(waybill);
}

function statusClass(status) {
  return status === "needs" ? "needs" : status;
}

function selectedTrip() {
  return state.trips.find((trip) => trip.id === state.selectedTripId) || state.trips[0];
}

function cloneTripForEmail(trip) {
  return JSON.parse(JSON.stringify(trip));
}

function sessionToken() {
  return state.session?.accessToken || state.clientSession?.accessToken || "";
}

async function apiRequest(path, options = {}) {
  const token = sessionToken();
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  const result = await response.json().catch(() => ({}));
  if (response.status === 401 && token) {
    state.session = null;
    state.clientSession = null;
    clearStoredSession();
  }
  if (!response.ok || result.ok === false) {
    throw new Error(result.message || "Roadlink server request failed.");
  }
  return result;
}

function storedSession() {
  try {
    return JSON.parse(localStorage.getItem("roadlinkSession") || "null");
  } catch {
    return null;
  }
}

function storeSession(session, kind) {
  try {
    localStorage.setItem("roadlinkSession", JSON.stringify({ ...session, kind }));
  } catch {
    // Session persistence is best-effort; login still works for this tab.
  }
}

function clearStoredSession() {
  try {
    localStorage.removeItem("roadlinkSession");
  } catch {
    // Ignore storage restrictions.
  }
}

async function loadServerState() {
  try {
    const result = await apiRequest("/api/bootstrap");
    const data = result.data || {};
    state.dataMode = data.mode || "local-demo";
    state.googleSheetsConnected = Boolean(data.googleSheets);
    state.emailConnected = Boolean(data.email);
  } catch {
    state.dataMode = "offline-demo";
  }
}

async function loadSessionState() {
  if (!sessionToken()) return;
  try {
    const result = await apiRequest("/api/session/bootstrap");
    const data = result.data || {};
    state.dataMode = data.mode || state.dataMode;
    state.googleSheetsConnected = Boolean(data.googleSheets);
    state.emailConnected = Boolean(data.email);
    if (Array.isArray(data.trips) && data.trips.length) state.trips = data.trips;
    if (Array.isArray(data.accountRequests) && data.accountRequests.length) state.approvalRequests = data.accountRequests;
    if (Array.isArray(data.bookingRequests) && data.bookingRequests.length) state.bookingRequests = data.bookingRequests;
    if (Array.isArray(data.notifications) && data.notifications.length) state.notifications = data.notifications;
    if (Array.isArray(data.profiles) && data.profiles.length) {
      state.users = data.profiles
        .filter((profile) => profile.role !== "client")
        .map((profile) => ({
          name: profile.name,
          role: profile.roleLabel || roleLabelFromId(profile.role),
          username: profile.username || profile.email,
          password: profile.username?.endsWith(".temp") ? demoPasswordForRole(profile.role) : "Managed by server",
          initials: profile.initials || initials(profile.name),
          photo: profile.photo || ""
        }));
    }
  } catch {
    // Session data stays on local demo values when the server rejects or is unreachable.
  }
}

function roleLabelFromId(roleId) {
  return (roles.find((role) => role.id === roleId) || {}).label || "Coordinator";
}

function demoPasswordForRole(roleId) {
  return (roles.find((role) => role.id === roleId) || {}).password || "Managed by server";
}

function initials(name = "") {
  return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "RL";
}

function syncTripFromServer(trip) {
  if (!trip) return;
  const index = state.trips.findIndex((item) => item.id === trip.id);
  if (index >= 0) state.trips[index] = trip;
  else state.trips.unshift(trip);
}

async function sendTripEmail(kind, trip) {
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, trip: cloneTripForEmail(trip) })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.ok) {
      return { ok: false, message: result.message || "Email service is not available." };
    }
    return { ok: true, id: result.id, message: result.message || "Email accepted by Resend." };
  } catch {
    return {
      ok: false,
      message: "Email service is not running. Start the Roadlink server with npm run start."
    };
  }
}

function rememberedLogin() {
  try {
    return JSON.parse(localStorage.getItem("roadlinkRememberedLogin") || "{}");
  } catch {
    return {};
  }
}

function rememberLogin(payload) {
  try {
    localStorage.setItem("roadlinkRememberedLogin", JSON.stringify(payload));
  } catch {
    // Remember me is best-effort in this static prototype.
  }
}

function clearRememberedLogin() {
  try {
    localStorage.removeItem("roadlinkRememberedLogin");
  } catch {
    // Ignore private browsing/storage restrictions in the prototype.
  }
}

function setToast(message) {
  state.toast = message;
  render();
  window.clearTimeout(setToast.timer);
  setToast.timer = window.setTimeout(() => {
    state.toast = "";
    render();
  }, 2600);
}

function navigate(screen, tripId) {
  state.screen = screen;
  if (tripId) state.selectedTripId = tripId;
  state.otpSent = false;
  render();
}

function updateTrip(tripId, updater) {
  const trip = state.trips.find((item) => item.id === tripId);
  if (trip) updater(trip);
}

function render() {
  const app = document.querySelector("#app");
  const views = {
    home: renderHome,
    login: renderLogin,
    clientLogin: renderClientLogin,
    clientPortal: renderClientPortal,
    clientBooking: renderClientBookingRequest,
    clientBookingDetail: renderClientBookingDetail,
    accountRequest: renderAccountRequest,
    dashboard: renderDashboard,
    newTrip: renderNewTrip,
    detail: renderDetail,
    budget: renderBudget,
    client: renderClientPreview,
    reconcile: renderReconcile,
    audit: renderAudit,
    waybill: renderWaybill,
    users: renderUsers
  };

  app.innerHTML = (views[state.screen] || renderLogin)();
  app.scrollLeft = 0;
  bindScreenEvents();
}

function topbar(title, right = "") {
  const back = state.screen === "dashboard" || state.screen === "login"
    ? `<span></span>`
    : `<button class="icon-btn" type="button" data-action="back" aria-label="Go back">&lt;</button>`;

  return `
    <header class="topbar">
      ${back}
      <h2>${title === "Roadlink" ? `<img class="topbar-logo" src="assets/roadlink-logo.svg" alt="Roadlink">` : title}</h2>
      ${right || `<span></span>`}
    </header>
  `;
}

function renderHome() {
  return `
    <section class="screen home-screen">
      <video class="home-video" src="assets/roadlink-home.mov" autoplay muted loop playsinline aria-label="Roadlink fleet video"></video>
      <div class="home-shade" aria-hidden="true"></div>
      <div class="home-hero">
        <img class="home-logo" src="assets/roadlink-logo-home.svg" alt="Roadlink Cargo Transport Service">
        <div class="home-actions">
          <button class="primary wide home-login" type="button" data-action="login">Staff log in</button>
          <button class="ghost wide home-client-login" type="button" data-action="clientLogin">Client portal preview</button>
          <span>${state.dataMode === "supabase" ? "Production Pilot" : "Demo Mode"}</span>
        </div>
      </div>
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </section>
  `;
}

function renderLogin() {
  const remembered = rememberedLogin();
  const selectedRole = remembered.role || "coordinator";

  return `
    <section class="screen auth-screen">
      <button class="tiny-btn auth-back" type="button" data-action="home">Back</button>
      <div class="auth-panel">
        <img class="auth-logo" src="assets/roadlink-logo.svg" alt="Roadlink Cargo Transport Service">
        <div>
          <p class="eyebrow">Staff Login</p>
          <h1>Welcome back</h1>
          <p>Use your Roadlink staff account to continue.</p>
        </div>

        <form class="login-form" id="loginForm">
          <div class="field">
            <label for="loginRole">Role</label>
            <select id="loginRole" name="role">
              ${roles.map((role) => `<option value="${role.id}" ${selectedRole === role.id ? "selected" : ""}>${role.label}</option>`).join("")}
            </select>
          </div>
          <div class="field">
            <label for="loginUsername">Username</label>
            <input id="loginUsername" name="username" autocomplete="username" value="${remembered.username || ""}" placeholder="mika.temp">
          </div>
          <div class="field">
            <label for="loginPassword">Password</label>
            <input id="loginPassword" name="password" type="password" autocomplete="current-password" value="${remembered.password || ""}" placeholder="Roadlink-8421">
          </div>
          <label class="remember-row">
            <input name="remember" type="checkbox" ${remembered.remember ? "checked" : ""}>
            <span>Remember login details</span>
          </label>
          <button class="primary wide" type="submit">Log in</button>
        </form>

        <button class="ghost wide" type="button" data-action="accountRequest">Create account request</button>

        ${state.dataMode === "supabase" ? "" : `<div class="login-hint">
          <strong>Demo credentials</strong>
          ${roles.map((role) => `<span>${role.label}: ${role.username} / ${role.password}</span>`).join("")}
        </div>`}
      </div>
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </section>
  `;
}

function renderClientLogin() {
  const client = clientDemoUsers[0];
  return `
    <section class="screen auth-screen client-auth-screen">
      <button class="tiny-btn auth-back" type="button" data-action="home">Back</button>
      <div class="auth-panel">
        <img class="auth-logo" src="assets/roadlink-logo.svg" alt="Roadlink Cargo Transport Service">
        <div>
          <p class="eyebrow">Client Portal Preview</p>
          <h1>Track your Roadlink bookings</h1>
          <p>For demo only: clients can request trips, confirm pending bookings, and see simple trip summaries without internal budget details.</p>
        </div>

        <form class="login-form" id="clientLoginForm">
          <div class="field">
            <label for="clientEmail">Client email or username</label>
            <input id="clientEmail" name="username" autocomplete="username" value="${state.dataMode === "supabase" ? "" : client.username}" required>
          </div>
          <div class="field">
            <label for="clientPassword">Password</label>
            <input id="clientPassword" name="password" type="password" autocomplete="current-password" value="${state.dataMode === "supabase" ? "" : client.password}" required>
          </div>
          <button class="primary wide" type="submit">Open client portal</button>
        </form>

        ${state.dataMode === "supabase" ? "" : `<div class="login-hint">
          <strong>Demo client</strong>
          <span>${client.company}: ${client.username} / ${client.password}</span>
        </div>`}
      </div>
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </section>
  `;
}

function clientTrips() {
  if (!state.clientSession) return [];
  return state.trips.filter((trip) => trip.client === state.clientSession.company || trip.email === state.clientSession.email);
}

function clientRequests() {
  if (!state.clientSession) return [];
  return state.bookingRequests.filter((request) => request.company === state.clientSession.company || request.email === state.clientSession.email);
}

function renderClientPortal() {
  const client = state.clientSession || clientDemoUsers[0];
  const trips = clientTrips();
  const requests = clientRequests();
  return `
    <section class="screen">
      ${topbar("Client Portal", `<button class="tiny-btn" type="button" data-action="logoutClient">Exit</button>`)}
      <div class="client-portal-hero">
        <img src="assets/roadlink-logo-light.svg" alt="Roadlink Cargo Transport Service">
        <span>Preview account</span>
        <h1>${client.company}</h1>
        <p>Simple booking visibility for authorized client contacts.</p>
      </div>
      <div class="content">
        <button class="primary wide" type="button" data-action="clientBooking">Request new booking</button>
        <div class="status-grid">
          <div class="metric"><b>${trips.length}</b><span>Bookings</span></div>
          <div class="metric"><b>${requests.length}</b><span>Requests</span></div>
        </div>

        <article class="card">
          <div class="section-head">
            <div>
              <h3>Active bookings</h3>
              <p>Clients see trip status only. Internal budgets and audit logs stay hidden.</p>
            </div>
          </div>
          <div class="cards thin-cards">
            ${trips.map((trip) => `
              <button class="client-trip-card" type="button" data-client-trip-detail="${trip.id}">
                <strong>${trip.origin} to ${trip.destination}</strong>
                <span>${displayDate(trip.date)} • ${trip.vehicle}</span>
                <small class="status-pill ${statusClass(trip.status)}">${statusLabels[trip.status]}</small>
              </button>
            `).join("") || `<span class="muted">No active bookings yet.</span>`}
          </div>
        </article>

        <article class="card">
          <div class="section-head">
            <div>
              <h3>Booking requests</h3>
              <p>New requests wait for Roadlink coordinator review.</p>
            </div>
          </div>
          <div class="cards thin-cards">
            ${requests.map((request) => `
              <div class="client-trip-card passive">
                <strong>${request.origin} to ${request.destination}</strong>
                <span>${displayDate(request.date)} • ${request.vehicle}</span>
                <small>${request.status}</small>
              </div>
            `).join("") || `<span class="muted">No client requests yet.</span>`}
          </div>
        </article>
      </div>
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </section>
  `;
}

function renderClientBookingRequest() {
  const client = state.clientSession || clientDemoUsers[0];
  const placeOptions = philippinePlaces.map((place) => `<option value="${place}"></option>`).join("");
  return `
    <section class="screen">
      ${topbar("Request Booking")}
      <form class="content form-grid" id="clientBookingForm">
        <datalist id="philippinePlaces">${placeOptions}</datalist>
        <div class="form-card">
          <div class="field">
            <label for="clientCompany">Company</label>
            <input id="clientCompany" name="company" value="${client.company}" required>
          </div>
          <div class="field">
            <label for="clientContact">Authorized contact</label>
            <input id="clientContact" name="contact" value="${client.contact}" required>
          </div>
          <div class="field">
            <label for="clientRequestEmail">Email</label>
            <input id="clientRequestEmail" name="email" type="email" value="${client.email}" required>
          </div>
          <div class="field">
            <label for="clientRequestPhone">Phone</label>
            <input id="clientRequestPhone" name="phone" value="${client.phone}" required>
          </div>
        </div>
        <div class="form-card">
          <div class="field">
            <label for="clientOrigin">From</label>
            <input id="clientOrigin" name="origin" list="philippinePlaces" placeholder="Example: Mandaue City, Cebu" required>
          </div>
          <div class="field">
            <label for="clientDestination">To</label>
            <input id="clientDestination" name="destination" list="philippinePlaces" placeholder="Example: Ormoc City, Leyte" required>
          </div>
          <div class="field">
            <label for="clientVehicle">Vehicle type</label>
            <select id="clientVehicle" name="vehicle" required>
              <option value="">Select vehicle type</option>
              <option>10-wheeler truck</option>
              <option>Wing van</option>
              <option>6-wheeler truck</option>
              <option>Prime mover</option>
            </select>
          </div>
          <div class="field">
            <label for="clientDate">Trip date</label>
            <input id="clientDate" name="date" type="date" required>
          </div>
          <div class="field">
            <label for="clientCargo">Cargo notes</label>
            <textarea id="clientCargo" name="cargo" placeholder="Cargo description, quantity, or handling notes"></textarea>
          </div>
        </div>
        <button class="primary wide" type="submit">Send request to Roadlink</button>
      </form>
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </section>
  `;
}

function renderClientBookingDetail() {
  const trip = selectedTrip();
  return `
    <section class="screen">
      ${topbar("Booking Detail")}
      <div class="content">
        <article class="client-card">
          <span class="status-pill ${statusClass(trip.status)}">${statusLabels[trip.status]}</span>
          <h1>${trip.origin} to ${trip.destination}</h1>
          <div class="trip-fields compact-fields">
            <span><b>Company</b>${trip.client}</span>
            <span><b>Authorized contact</b>${trip.contact}</span>
            <span><b>Vehicle Type</b>${trip.vehicle}</span>
            <span><b>Plate No.</b>${trip.waybill?.plateNo || "For assignment"}</span>
            <span><b>Trip Date</b>${displayDate(trip.date)}</span>
            <span><b>Cargo</b>${trip.cargo || "None provided"}</span>
          </div>
          ${trip.status === "pending" ? `
            <div class="actions">
              <button class="success" type="button" data-client-confirm="${trip.id}">Confirm Booking</button>
              <button class="danger" type="button" data-client-cancel="${trip.id}">Cancel Booking</button>
            </div>
          ` : ""}
          <button class="ghost" type="button" data-call-roadlink="${trip.id}">Contact Roadlink</button>
        </article>
      </div>
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </section>
  `;
}

function renderAccountRequest() {
  return `
    <section class="screen auth-screen">
      <button class="tiny-btn auth-back" type="button" data-action="home">Back</button>
      <div class="auth-panel">
        <img class="auth-logo" src="assets/roadlink-logo.svg" alt="Roadlink Cargo Transport Service">
        <div>
          <p class="eyebrow">Request Access</p>
          <h1>Create account</h1>
          <p>Coordinator, accounting, owner, and admin accounts require owner/admin approval before credentials are issued.</p>
        </div>

        <form class="login-form" id="accountRequestForm">
          <div class="field">
            <label for="requestName">Full name</label>
            <input id="requestName" name="name" value="New Roadlink Staff" required>
          </div>
          <div class="field">
            <label for="requestEmail">Email</label>
            <input id="requestEmail" name="email" type="email" value="staff@roadlink.example" required>
          </div>
          <div class="field">
            <label for="requestRole">Requested role</label>
            <select id="requestRole" name="role">
              <option>Coordinator</option>
              <option>Accounting</option>
              <option>Owner / Manager</option>
              <option>Admin</option>
            </select>
          </div>
          <button class="primary wide" type="submit">Send approval request</button>
        </form>

        <div class="request-summary">
          <strong>Approval flow</strong>
          <span>Owner/admin receives an approval email with Approve and Decline actions.</span>
          <span>Once approved, the staff member receives temporary credentials by email.</span>
        </div>
      </div>
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </section>
  `;
}

function renderDashboard() {
  const visibleTrips = state.filter === "all"
    ? state.trips
    : state.trips.filter((trip) => trip.status === state.filter);

  const counts = Object.keys(statusLabels).reduce((acc, key) => {
    acc[key] = state.trips.filter((trip) => trip.status === key).length;
    return acc;
  }, {});

  const riskCount = state.trips.filter((trip) => trip.status === "needs").length;

  return `
    <section class="screen">
      ${topbar("Roadlink", `<button class="tiny-btn" type="button" data-action="logout">Role</button>`)}
      <div class="content">
        <div class="pilot-status">
          <span><b>Data</b>${state.dataMode === "supabase" ? "Supabase connected" : "Local demo store"}</span>
          <span><b>Email</b>${state.emailConnected ? "Resend ready" : "Configure Resend"}</span>
          <span><b>Sheets</b>${state.googleSheetsConnected ? "Mirror active" : "Mirror pending"}</span>
        </div>
        ${riskCount ? `
          <button class="alert-card" type="button" data-action="openReconcile">
            <strong>${riskCount} cancelled trip has funds released</strong>
            <span>For immediate checking by accounting</span>
          </button>
        ` : ""}

        <div class="section-head">
          <div>
            <h3>${roleLabel()} dashboard</h3>
            <p>${new Date().toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })}</p>
          </div>
          <div class="button-pair">
            <button class="tiny-btn" type="button" data-action="users">Users</button>
            <button class="tiny-btn" type="button" data-action="newTrip">New trip</button>
          </div>
        </div>

        <div class="status-grid">
          <div class="metric"><b>${state.trips.length}</b><span>Total trips</span></div>
          <div class="metric"><b>${counts.funds}</b><span>Funds released</span></div>
          <div class="metric"><b>${counts.pending}</b><span>Waiting client</span></div>
          <div class="metric"><b>${riskCount}</b><span>At risk</span></div>
        </div>

        ${state.bookingRequests.length ? `
          <article class="card">
            <div class="section-head">
              <div>
                <h3>Client booking requests</h3>
                <p>Portal requests wait here until a coordinator converts them to official trips.</p>
              </div>
              <span class="pill">${state.bookingRequests.length} open</span>
            </div>
            <div class="request-list">
              ${state.bookingRequests.slice(0, 2).map((request) => `
                <button class="request-card" type="button" data-open-booking-request="${request.id}">
                  <strong>${request.company}</strong>
                  <span>${request.origin} to ${request.destination}</span>
                  <small>${request.vehicle} • ${displayDate(request.date)}</small>
                </button>
              `).join("")}
            </div>
          </article>
        ` : ""}

        <div class="segmented" aria-label="Trip status filter">
          ${[`all`, ...Object.keys(statusLabels)].map((status) => `
            <button class="segment ${state.filter === status ? "is-active" : ""}" type="button" data-filter="${status}">
              ${status === "all" ? "All" : statusLabels[status]}
            </button>
          `).join("")}
        </div>

        <div class="cards">
          ${visibleTrips.map(renderTripCard).join("") || `<div class="card"><strong>No trips here</strong><span>Change the filter or create a new trip.</span></div>`}
        </div>
      </div>
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </section>
  `;
}

function roleLabel() {
  return (roles.find((role) => role.id === state.role) || roles[0]).label;
}

function renderTripCard(trip) {
  const total = totalBudget(trip);
  const plateNo = trip.waybill?.plateNo || "For assignment";
  const immediateCheck = trip.status === "needs" ? `<span class="urgent-note">For immediate checking</span>` : "";
  return `
    <article class="card">
      <div class="trip-row">
        <span class="trip-mark">${trip.vehicle.includes("10") ? "10W" : "WV"}</span>
        <div>
          <div class="trip-title">
            <div>
              <span class="field-label">Route</span>
              <h3>${trip.route}</h3>
              ${immediateCheck}
            </div>
            <span class="status-pill ${statusClass(trip.status)}">${statusLabels[trip.status]}</span>
          </div>
        </div>
      </div>
      <div class="trip-fields">
        <span><b>Company</b>${trip.client}</span>
        <span><b>From</b>${trip.origin || "For encoding"}</span>
        <span><b>To</b>${trip.destination || "For encoding"}</span>
        <span><b>Vehicle Type</b>${trip.vehicle}</span>
        <span><b>Plate No.</b>${plateNo}</span>
        <span><b>Trip Date</b>${displayDate(trip.date)}</span>
        <span><b>Coordinator</b>${trip.coordinator}</span>
        <span><b>Budget</b>${money(total)}</span>
      </div>
      <div class="actions">
        <button class="secondary" type="button" data-open-trip="${trip.id}">Open trip</button>
        <button class="ghost" type="button" data-action="audit" data-trip-action="${trip.id}">Audit timeline</button>
      </div>
    </article>
  `;
}

function renderNewTrip() {
  const placeOptions = philippinePlaces.map((place) => `<option value="${place}"></option>`).join("");
  return `
    <section class="screen">
      ${topbar("New Trip")}
      <form class="content form-grid" id="newTripForm">
        <datalist id="philippinePlaces">
          ${placeOptions}
        </datalist>
        <div class="form-card">
          <div class="section-head compact">
            <div>
              <h3>Client details</h3>
              <p>Official confirmation will be sent by email.</p>
            </div>
          </div>
          <div class="field">
            <label for="client">Company</label>
            <input id="client" name="client" placeholder="Example: Mactan Seafoods Export" required>
          </div>
          <div class="field">
            <label for="contact">Authorized contact</label>
            <input id="contact" name="contact" placeholder="Example: Ana Lim" required>
          </div>
          <div class="field">
            <label for="email">Authorized contact email</label>
            <input id="email" name="email" type="email" placeholder="Example: ana@company.com" required>
          </div>
          <div class="field">
            <label for="phone">Authorized contact phone</label>
            <input id="phone" name="phone" placeholder="Example: +63 917 420 1188" required>
          </div>
          <div class="field">
            <label for="extraChannel">Optional follow-up channel</label>
            <select id="extraChannel" name="extraChannel">
              <option value="">Email only</option>
              <option>WhatsApp</option>
              <option>Viber</option>
              <option>SMS</option>
            </select>
          </div>
        </div>

        <div class="form-card">
          <div class="section-head compact">
            <div>
              <h3>Trip details</h3>
              <p>These fields carry into the waybill.</p>
            </div>
          </div>
          <div class="field">
            <label for="origin">From</label>
            <input id="origin" name="origin" list="philippinePlaces" placeholder="Example: Lapu-Lapu City, Cebu" required>
          </div>
          <div class="field">
            <label for="destination">To</label>
            <input id="destination" name="destination" list="philippinePlaces" placeholder="Example: Ormoc City, Leyte" required>
          </div>
          <div class="field">
            <label for="vehicle">Vehicle type</label>
            <select id="vehicle" name="vehicle" required>
              <option value="">Select vehicle type</option>
              <option>10-wheeler truck</option>
              <option>Wing van</option>
              <option>6-wheeler truck</option>
              <option>Prime mover</option>
            </select>
          </div>
          <div class="field">
            <label for="plateNo">Plate number</label>
            <input id="plateNo" name="plateNo" placeholder="Example: GAA 4821, or leave blank if not assigned">
          </div>
          <div class="field">
            <label for="date">Trip date</label>
            <input id="date" name="date" type="date" required>
          </div>
          <div class="field">
            <label for="cargo">Cargo notes</label>
            <textarea id="cargo" name="cargo" placeholder="Example: Frozen seafood pallets"></textarea>
          </div>
        </div>

        <button class="primary wide" type="submit">Create trip and send confirmation email</button>
      </form>
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </section>
  `;
}

function renderDetail() {
  const trip = selectedTrip();
  const followUp = trip.preferredChannel.startsWith("Email + ") ? trip.preferredChannel.replace("Email + ", "") : "None";
  return `
    <section class="screen">
      ${topbar("Trip Detail", `<button class="tiny-btn" type="button" data-action="audit">Audit</button>`)}
      <div class="detail-hero">
        <span class="status-pill ${statusClass(trip.status)}">${statusLabels[trip.status]}</span>
        <h1>${trip.route}</h1>
        <div class="meta-line">
          <span>${trip.client}</span>
          <span>${trip.vehicle}</span>
          <span>${displayDate(trip.date)}</span>
        </div>
      </div>
      <div class="content">
        <article class="card">
          <strong>Client confirmation email</strong>
          <span>${trip.contact} receives a branded Roadlink email at ${trip.email}. Clients can confirm, cancel, or contact Roadlink from the email link.</span>
          <div class="trip-fields compact-fields">
            <span><b>Authorized contact</b>${trip.contact}</span>
            <span><b>Phone</b>${trip.phone}</span>
            <span><b>Official channel</b>Email</span>
            <span><b>Follow-up</b>${followUp}</span>
          </div>
          <div class="share-grid">
            ${["Resend email", "WhatsApp follow-up", "Viber follow-up"].map((channel) => `<button class="share-chip" type="button" data-share="${channel}">${channel}</button>`).join("")}
          </div>
          <button class="secondary" type="button" data-action="clientPreview">Preview client confirmation page</button>
        </article>

        <article class="card">
          <div class="section-head">
            <div>
              <h3>Digital waybill</h3>
              <p>Printable format with manager and finance approvals.</p>
            </div>
            <span class="status-pill ${trip.waybill.status === "Approved" ? "confirmed" : "pending"}">${trip.waybill.status}</span>
          </div>
          <div class="meta-line">
            <span>WB No. ${trip.waybill.number}</span>
            <span>Plate ${trip.waybill.plateNo || "For encoding"}</span>
            <span>Cash out ${money(cashOutTotal(trip.waybill))}</span>
          </div>
          <button class="secondary" type="button" data-action="waybill">Prepare / open waybill</button>
        </article>

        <article class="card">
          <div class="section-head">
            <div>
              <h3>Budget logged</h3>
              <p>Cash, cheques, POs, fuel, shipping, meals, and misc.</p>
            </div>
            <span class="amount">${money(totalBudget(trip))}</span>
          </div>
          <div class="budget-list">
            ${trip.budget.map((item) => `
              <div class="budget-line">
                <div><b>${item.type}</b><span>${item.detail}</span></div>
                <strong>${money(item.amount)}</strong>
              </div>
            `).join("") || `<span class="muted">No releases logged yet.</span>`}
          </div>
          <button class="secondary" type="button" data-action="budget">Log budget release</button>
        </article>

        ${trip.status === "needs" ? `
          <article class="alert-card">
            <strong>For immediate checking</strong>
            <span>This client cancellation happened after funds were released. Accounting should verify cash, cheques, and POs now.</span>
            <button class="danger wide" type="button" data-action="openReconcile">Open checking task</button>
          </article>
        ` : ""}
      </div>
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </section>
  `;
}

function renderBudget() {
  const trip = selectedTrip();
  return `
    <section class="screen">
      ${topbar("Budget Log")}
      <form class="content form-grid" id="budgetForm">
        <article class="card">
          <strong>${trip.route}</strong>
          <span>Current logged budget: ${money(totalBudget(trip))}</span>
          <div class="trip-fields compact-fields">
            <span><b>Company</b>${trip.client}</span>
            <span><b>Vehicle Type</b>${trip.vehicle}</span>
            <span><b>Plate No.</b>${trip.waybill.plateNo || "For encoding"}</span>
            <span><b>Waybill</b>${trip.waybill.number}</span>
          </div>
        </article>
        <div class="form-card">
          <div class="field">
            <label for="budgetType">Release type</label>
            <select id="budgetType" name="type">
              <option>Cash</option>
              <option>Cheque</option>
              <option>PO</option>
              <option>Fuel</option>
              <option>Shipping</option>
              <option>Meals</option>
              <option>Miscellaneous</option>
            </select>
          </div>
          <div class="field">
            <label for="amount">Amount</label>
            <input id="amount" name="amount" type="number" value="15000" min="0" required>
          </div>
          <div class="field">
            <label for="detail">Purpose or reference</label>
            <textarea id="detail" name="detail">Driver meals and miscellaneous trip allowance</textarea>
          </div>
        </div>
        <button class="primary wide" type="submit">Save release log</button>
      </form>
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </section>
  `;
}

function renderWaybill() {
  const trip = selectedTrip();
  const waybill = trip.waybill;
  const canManagerApprove = state.role === "owner" || state.role === "admin";
  const canFinanceApprove = state.role === "accounting" || state.role === "admin";
  const paymentRows = [
    ["SELL RATE", waybill.sellRate],
    ["FREIGHT", waybill.freight],
    ["TOTAL CHECK", waybill.freight],
    ["BUYING RATE", waybill.buyingRate],
    ["DOWNPAYMENT", waybill.downpayment],
    ["BALANCE AMOUNT", waybill.balanceAmount],
    ["ARRASTRE", waybill.arrastre],
    ["DRIVER", waybill.driver],
    ["HELPER", waybill.helper],
    ["LABOR", waybill.labor],
    ["OTHERS", waybill.others],
    ["TOTAL CASH OUT", cashOutTotal(waybill)],
    ["OVER ALL TOTAL", overallTotal(waybill)]
  ];

  return `
    <section class="screen">
      ${topbar("Waybill", `<button class="tiny-btn" type="button" data-action="printWaybill">Print</button>`)}
      <div class="content waybill-screen">
        <article class="card no-print">
          <strong>Approval routing</strong>
          <span>Manager approves in-app. Email is only a backup notice to ${state.testEmails.join(" and ")}.</span>
          <div class="actions">
            <button class="secondary" type="button" data-action="submitWaybill">Submit for approval</button>
            ${canManagerApprove ? `<button class="ghost" type="button" data-action="managerSign">Approve (Manager)</button>` : ""}
            ${canFinanceApprove ? `<button class="ghost" type="button" data-action="financeSign">Approve (Finance)</button>` : ""}
            <button class="primary" type="button" data-action="printWaybill">Print waybill</button>
            <button class="secondary" type="button" data-action="emailWaybill">Email waybill</button>
          </div>
          ${!canManagerApprove && !canFinanceApprove ? `<span class="field-hint">You can prepare and submit the waybill. Approval buttons appear only for manager, finance, or admin roles.</span>` : ""}
        </article>

        <div class="waybill-scroll-hint no-print">Scroll sideways and down to inspect the full printable waybill.</div>
        <form class="waybill-paper" id="waybillForm">
          <div class="waybill-heading">
            <strong>WAYBILL</strong>
            <span>ROADLINK CARGO TRANSPORT SERVICE</span>
            <b>WB No. ${waybill.number}</b>
          </div>

          <div class="waybill-grid top">
            <label>SHIPPER<input name="client" value="${trip.client}"></label>
            <label>DATE<input name="date" value="${displayDate(trip.date)}"></label>
            <label class="check-row">RCTS TRUCK<input type="checkbox" ${waybill.truckType === "RCTS Truck" ? "checked" : ""}></label>
            <label>CONSIGNEE<input name="contact" value="${trip.contact}"></label>
            <label>DESTINATION<input name="destination" value="${trip.destination}"></label>
            <label class="check-row">SUBCON TRUCK<input type="checkbox" ${waybill.truckType === "Subcon Truck" ? "checked" : ""}></label>
            <label>SHIPMENT NO.<input name="shipmentNo" value="${waybill.shipmentNo}"></label>
          </div>

          <div class="waybill-main">
            <div class="items-box">
              <div class="items-head">
                <span>QTY</span>
                <span>DESCRIPTION OF ITEMS</span>
              </div>
              <div class="items-body">
                <input name="qty" value="1">
                <textarea name="cargo">${trip.cargo}</textarea>
              </div>
            </div>

            <div class="payment-box">
              <div class="payment-head">
                <span>PAYMENT DETAILS</span>
                <span>AMOUNT</span>
              </div>
              ${paymentRows.map(([label, amount]) => `
                <div class="payment-row ${label.includes("TOTAL") || label.includes("OVER") ? "total" : ""}">
                  <span>${label}</span>
                  <input value="${Number(amount || 0).toLocaleString("en-PH")}">
                </div>
              `).join("")}
            </div>
          </div>

          <div class="waybill-footer">
            <label>DRIVER'S NAME<input value="${waybill.driverName}"></label>
            <label>PLATE NO.<input value="${waybill.plateNo}"></label>
            <label>PAYMENT RECEIVED BY<input value="${waybill.paymentReceivedBy}"></label>
            <label>PREPARED BY<input value="${waybill.preparedBy}"></label>
            <label>APPROVED BY<input value="${waybill.approvedBy}"></label>
            <label>FINANCE<input value="${waybill.financeBy}"></label>
          </div>

          <div class="signature-strip">
            <span>Status: ${waybill.status}</span>
            <span>Manager approval: ${waybill.approvedBy || "Pending"}</span>
            <span>Finance approval: ${waybill.financeBy || "Pending"}</span>
          </div>
        </form>
      </div>
      ${state.toast ? `<div class="toast no-print">${state.toast}</div>` : ""}
    </section>
  `;
}

function renderClientPreview() {
  const trip = state.trips.find((item) => item.id === state.clientPreviewTripId) || selectedTrip();
  const cancelled = trip.status === "cancelled" || trip.status === "needs" || trip.status === "reconciled";

  return `
    <section class="screen client-preview">
      <button class="tiny-btn" type="button" data-action="back">Back to staff app</button>
      <article class="client-card">
        <span class="pill">Secure Roadlink link</span>
        <h1>Please confirm your trip</h1>
        <span class="muted">No app install or account needed. This page is only for the authorized client contact.</span>
        <div class="route-box">
          <strong>${trip.route}</strong>
          <span>${trip.vehicle}</span>
          <span>${displayDate(trip.date)}</span>
          <span>${trip.client}</span>
        </div>
        ${cancelled ? `
          <div class="alert-card">
            <strong>This booking is already cancelled.</strong>
            <span>Roadlink staff have been notified.</span>
          </div>
        ` : `
          <div class="actions">
            <button class="success" type="button" data-client-confirm="${trip.id}">Confirm Booking</button>
            <button class="danger" type="button" data-client-cancel="${trip.id}">Cancel Booking</button>
          </div>
          ${state.otpSent ? `
            <div class="form-card">
              <div class="field">
                <label for="otp">One-time PIN</label>
                <input id="otp" value="428913" inputmode="numeric">
                <span class="field-hint">Demo PIN was sent to ${trip.phone}.</span>
              </div>
              <div class="field">
                <label for="reason">Cancellation reason</label>
                <textarea id="reason">Client requested cancellation before dispatch.</textarea>
              </div>
              <button class="danger wide" type="button" data-complete-cancel="${trip.id}">Submit cancellation</button>
            </div>
          ` : ""}
        `}
        <button class="ghost" type="button" data-call-roadlink="${trip.id}">Contact Roadlink</button>
      </article>
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </section>
  `;
}

function renderReconcile() {
  const trip = selectedTrip();
  const queue = state.trips.filter((item) => item.status === "needs");
  const active = trip.status === "needs" ? trip : queue[0];

  if (!active) {
    return `
      <section class="screen">
        ${topbar("Immediate Checking")}
        <div class="content">
          <article class="card">
            <strong>No funded cancellations</strong>
            <span>Cancelled funded trips will appear here.</span>
          </article>
        </div>
      </section>
    `;
  }

  state.selectedTripId = active.id;

  return `
    <section class="screen">
      ${topbar("Immediate Checking")}
      <form class="content form-grid" id="reconcileForm">
        <article class="alert-card">
          <span class="pill danger-pill">For immediate checking</span>
          <strong>${active.route}</strong>
          <span>${active.client} cancelled after ${money(totalBudget(active))} was logged.</span>
        </article>

        <div class="form-card">
          <label class="field">
            <span>Cash returned</span>
            <select name="cashReturned">
              <option value="false">Not yet</option>
              <option value="true">Returned</option>
            </select>
          </label>
          <label class="field">
            <span>Cheque voided</span>
            <select name="chequeVoided">
              <option value="false">Not yet</option>
              <option value="true">Voided</option>
            </select>
          </label>
          <label class="field">
            <span>PO cancelled</span>
            <select name="poCancelled">
              <option value="false">Not yet</option>
              <option value="true">Cancelled</option>
            </select>
          </label>
          <div class="field">
            <label for="expensesUsed">Used expenses or notes</label>
            <textarea id="expensesUsed" name="expensesUsed">No trip expenses used before cancellation.</textarea>
          </div>
        </div>

        <button class="primary wide" type="submit">Mark checking complete</button>
      </form>
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </section>
  `;
}

function renderAudit() {
  const trip = selectedTrip();
  return `
    <section class="screen">
      ${topbar("Audit Timeline")}
      <div class="content">
        <article class="card">
          <strong>${trip.id} - ${trip.route}</strong>
          <span>Trip records cannot be quietly deleted in this prototype. Important actions remain visible here.</span>
        </article>
        <div class="timeline">
          ${trip.timeline.map((item) => `
            <div class="timeline-item">
              <span class="dot"></span>
              <p>${item.text}<time>${item.at}</time></p>
            </div>
          `).join("")}
        </div>
      </div>
    </section>
  `;
}

function renderUsers() {
  return `
    <section class="screen">
      ${topbar("Users")}
      <div class="content">
        <article class="card">
          <strong>Temporary access</strong>
          <span>Owner, manager, or admin can add staff, assign roles, attach a photo, and issue a temporary username/password.</span>
        </article>

        <article class="card">
          <div class="section-head">
            <div>
              <h3>Account approvals</h3>
              <p>Requests from staff accounts before credentials are issued.</p>
            </div>
            <span class="pill">${state.approvalRequests.filter((request) => request.status === "Pending").length} pending</span>
          </div>
          <div class="approval-list">
            ${state.approvalRequests.map((request) => `
              <div class="approval-card">
                <div>
                  <strong>${request.name}</strong>
                  <span>${request.email}</span>
                  <small>${request.role} - ${request.requestedAt}</small>
                </div>
                ${request.status === "Pending"
                  ? `<button class="secondary" type="button" data-approve-request="${request.id}">Approve</button>`
                  : `<span class="status-pill confirmed">Approved</span>`}
              </div>
            `).join("")}
          </div>
        </article>

        <form class="form-card" id="userForm">
          <div class="avatar-upload">
            <span class="user-photo large">${state.newUserPhoto ? `<img src="${state.newUserPhoto}" alt="">` : "PH"}</span>
            <label class="secondary upload-btn" for="photoInput">Add picture</label>
            <input id="photoInput" name="photo" type="file" accept="image/*">
          </div>
          <div class="field">
            <label for="userName">Staff name</label>
            <input id="userName" name="name" value="New Dispatcher">
          </div>
          <div class="field">
            <label for="userRole">Role</label>
            <select id="userRole" name="role">
              <option>Coordinator</option>
              <option>Accounting</option>
              <option>Owner / Manager</option>
              <option>Admin</option>
            </select>
          </div>
          <div class="field">
            <label for="username">Temporary username</label>
            <input id="username" name="username" value="dispatcher.temp">
          </div>
          <div class="field">
            <label for="password">Temporary password</label>
            <input id="password" name="password" value="Roadlink-7782">
          </div>
          <button class="primary wide" type="submit">Add demo user</button>
        </form>

        <div class="cards">
          ${state.users.map((user) => `
            <article class="card user-card">
              <span class="user-photo">${user.photo ? `<img src="${user.photo}" alt="">` : user.initials}</span>
              <div>
                <strong>${user.name}</strong>
                <span>${user.role}</span>
                <small>${user.username} / ${user.password}</small>
              </div>
            </article>
          `).join("")}
        </div>
      </div>
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </section>
  `;
}

function bindScreenEvents() {
  document.querySelectorAll("[data-role]").forEach((button) => {
    button.addEventListener("click", () => {
      state.role = button.dataset.role;
      state.screen = "dashboard";
      setToast(`Signed in as ${roleLabel()}`);
    });
  });

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.tripAction) state.selectedTripId = button.dataset.tripAction;
      handleAction(button.dataset.action);
    });
  });

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      render();
    });
  });

  document.querySelectorAll("[data-open-trip]").forEach((button) => {
    button.addEventListener("click", () => navigate("detail", button.dataset.openTrip));
  });

  document.querySelectorAll("[data-open-booking-request]").forEach((button) => {
    button.addEventListener("click", () => convertBookingRequest(button.dataset.openBookingRequest));
  });

  document.querySelectorAll("[data-client-trip-detail]").forEach((button) => {
    button.addEventListener("click", () => navigate("clientBookingDetail", button.dataset.clientTripDetail));
  });

  document.querySelectorAll("[data-client-link]").forEach((button) => {
    button.addEventListener("click", () => {
      state.clientPreviewTripId = button.dataset.clientLink;
      navigate("client", button.dataset.clientLink);
    });
  });

  document.querySelectorAll("[data-share]").forEach((button) => {
    button.addEventListener("click", async () => {
      if (button.dataset.share === "Resend email") {
        await emailConfirmation(selectedTrip(), "Confirmation email resent.");
        return;
      }
      setToast(`${button.dataset.share} message prepared for the authorized contact.`);
    });
  });

  document.querySelectorAll("[data-client-confirm]").forEach((button) => {
    button.addEventListener("click", () => confirmTrip(button.dataset.clientConfirm));
  });

  document.querySelectorAll("[data-client-cancel]").forEach((button) => {
    button.addEventListener("click", () => {
      state.otpSent = true;
      setToast("One-time PIN sent to authorized contact");
    });
  });

  document.querySelectorAll("[data-complete-cancel]").forEach((button) => {
    button.addEventListener("click", () => cancelTrip(button.dataset.completeCancel));
  });

  document.querySelectorAll("[data-call-roadlink]").forEach((button) => {
    button.addEventListener("click", () => contactRoadlink(button.dataset.callRoadlink));
  });

  const newTripForm = document.querySelector("#newTripForm");
  if (newTripForm) newTripForm.addEventListener("submit", createTrip);

  const loginForm = document.querySelector("#loginForm");
  if (loginForm) loginForm.addEventListener("submit", loginStaff);

  const accountRequestForm = document.querySelector("#accountRequestForm");
  if (accountRequestForm) accountRequestForm.addEventListener("submit", requestAccount);

  const clientLoginForm = document.querySelector("#clientLoginForm");
  if (clientLoginForm) clientLoginForm.addEventListener("submit", loginClient);

  const clientBookingForm = document.querySelector("#clientBookingForm");
  if (clientBookingForm) clientBookingForm.addEventListener("submit", createClientBookingRequest);

  const budgetForm = document.querySelector("#budgetForm");
  if (budgetForm) budgetForm.addEventListener("submit", saveBudget);

  const reconcileForm = document.querySelector("#reconcileForm");
  if (reconcileForm) reconcileForm.addEventListener("submit", saveReconciliation);

  const userForm = document.querySelector("#userForm");
  if (userForm) userForm.addEventListener("submit", addUser);

  const photoInput = document.querySelector("#photoInput");
  if (photoInput) photoInput.addEventListener("change", previewUserPhoto);

  document.querySelectorAll("[data-approve-request]").forEach((button) => {
    button.addEventListener("click", () => approveAccountRequest(button.dataset.approveRequest));
  });

  document.querySelectorAll(".device-choice").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".device-choice").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      const frame = document.querySelector("#phoneFrame");
      frame.classList.toggle("ios", button.dataset.device === "ios");
      frame.classList.toggle("android", button.dataset.device === "android");
    });
  });

  bindHomeVideoLoop();
}

function bindHomeVideoLoop() {
  const video = document.querySelector(".home-video");
  if (!video) return;

  const restartAtSeconds = 6.2;
  let isRestarting = false;

  video.addEventListener("timeupdate", () => {
    if (!video.duration || isRestarting) return;
    const restartAt = Math.min(Math.max(0.2, restartAtSeconds), Math.max(0.2, video.duration - 0.4));
    if (video.currentTime < restartAt) return;

    isRestarting = true;
    video.classList.add("is-fading");
    window.setTimeout(() => {
      video.currentTime = 0;
      video.play();
      window.requestAnimationFrame(() => video.classList.remove("is-fading"));
      window.setTimeout(() => {
        isRestarting = false;
      }, 320);
    }, 220);
  });
}

function handleAction(action) {
  const trip = selectedTrip();
  const previous = state.screen;
  const routes = {
    back: () => {
      state.screen = previous === "client" ? "detail" : (previous === "login" || previous === "accountRequest" ? "home" : "dashboard");
      render();
    },
    home: () => navigate("home"),
    login: () => navigate("login"),
    clientLogin: () => navigate("clientLogin"),
    clientBooking: () => navigate("clientBooking"),
    accountRequest: () => navigate("accountRequest"),
    logout: () => { state.session = null; state.role = null; clearStoredSession(); navigate("home"); },
    logoutClient: () => { state.clientSession = null; clearStoredSession(); navigate("home"); },
    newTrip: () => navigate("newTrip"),
    budget: () => navigate("budget", trip.id),
    clientPreview: () => {
      state.clientPreviewTripId = trip.id;
      navigate("client", trip.id);
    },
    openReconcile: () => navigate("reconcile", trip.id),
    audit: () => navigate("audit", trip.id),
    waybill: () => navigate("waybill", trip.id),
    users: () => navigate("users"),
    submitWaybill: () => submitWaybill(trip.id),
    managerSign: () => signWaybill(trip.id, "manager"),
    financeSign: () => signWaybill(trip.id, "finance"),
    emailWaybill: () => emailWaybill(trip.id),
    printWaybill: () => printWaybill()
  };

  if (routes[action]) routes[action]();
}

async function loginStaff(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const roleId = String(form.get("role") || "coordinator");
  const username = String(form.get("username") || "").trim();
  const password = String(form.get("password") || "").trim();
  const role = roles.find((item) => item.id === roleId);
  const matchingUser = role && state.users.find((user) => user.role === role.label && user.username === username && user.password === password);

  try {
    const result = await apiRequest("/api/auth/login", { method: "POST", body: JSON.stringify({ role: roleId, username, password }) });
    state.session = result.session;
    storeSession(result.session, "staff");
    await loadSessionState();
  } catch (error) {
    const offline = state.dataMode === "offline-demo";
    if (!offline || !role || (!matchingUser && username !== role.username) || (username === role.username && password !== role.password)) {
      setToast(error?.message || "Login details do not match this role");
      return;
    }
  }

  state.role = roleId;
  if (form.get("remember")) {
    rememberLogin({ role: roleId, username, remember: true });
  } else {
    clearRememberedLogin();
  }
  state.screen = "dashboard";
  setToast(`Signed in as ${role.label}`);
}

async function requestAccount(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const request = {
    name: String(form.get("name") || "New Roadlink Staff"),
    email: String(form.get("email") || "staff@roadlink.example"),
    role: String(form.get("role") || "Coordinator"),
    status: "Pending",
    requestedAt: new Date().toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })
  };
  try {
    const result = await apiRequest("/api/auth/account-request", { method: "POST", body: JSON.stringify(request) });
    state.approvalRequests.unshift(result.request);
  } catch {
    state.approvalRequests.unshift({ ...request, id: `REQ-${Math.floor(1200 + Math.random() * 8000)}` });
  }
  state.screen = "home";
  setToast(`Approval request sent to owner/admin for ${request.email}`);
}

async function approveAccountRequest(requestId) {
  const request = state.approvalRequests.find((item) => item.id === requestId);
  if (!request) return;
  try {
    const result = await apiRequest("/api/admin/approve-account", {
      method: "POST",
      body: JSON.stringify({ requestId, actorName: state.session?.profile?.name || roleLabel() })
    });
    request.status = "Approved";
    const profile = result.profile;
    state.users.unshift({
      name: profile.name,
      role: profile.roleLabel || request.role,
      username: result.credentials?.username || profile.username,
      password: result.credentials?.password || "Sent by email",
      initials: profile.initials || initials(profile.name),
      photo: profile.photo || ""
    });
  } catch {
    request.status = "Approved";
    const username = `${request.name.split(/\s+/)[0].toLowerCase()}.${request.role.split(/\s+/)[0].toLowerCase()}`;
    const password = `Roadlink-${Math.floor(1000 + Math.random() * 9000)}`;
    state.users.unshift({ name: request.name, role: request.role, username, password, initials: initials(request.name), photo: "" });
  }
  setToast(`Approved ${request.email}. Credentials queued by email.`);
}

function makeWaybillForTrip(id, form) {
  return {
    number: String(Math.floor(38000 + Math.random() * 900)).padStart(6, "0"),
    shipmentNo: id,
    plateNo: String(form.get("plateNo") || ""),
    driverName: "",
    truckType: "RCTS Truck",
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
    preparedBy: roleLabel(),
    approvedBy: "",
    financeBy: "",
    paymentReceivedBy: "",
    status: "Draft"
  };
}

async function createTrip(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const id = `RL-${Math.floor(2500 + Math.random() * 700)}`;
  const extraChannel = String(form.get("extraChannel") || "");
  const origin = String(form.get("origin") || "");
  const destination = String(form.get("destination") || "");
  const trip = {
    id,
    client: String(form.get("client") || ""),
    contact: String(form.get("contact") || ""),
    phone: String(form.get("phone") || ""),
    email: String(form.get("email") || ""),
    route: `${origin} to ${destination}`,
    origin,
    destination,
    vehicle: String(form.get("vehicle") || ""),
    date: String(form.get("date") || ""),
    cargo: String(form.get("cargo") || ""),
    coordinator: roleLabel(),
    preferredChannel: extraChannel ? `Email + ${extraChannel}` : "Email",
    status: "pending",
    cancelledReason: "",
    waybill: makeWaybillForTrip(id, form),
    budget: [],
    reconciliation: {
      cashReturned: false,
      chequeVoided: false,
      poCancelled: false,
      expensesUsed: ""
    },
    timeline: [
      eventLine("Trip created in Roadlink Trip Control"),
      eventLine(`Confirmation email queued for ${form.get("email")}`),
      ...(extraChannel ? [eventLine(`${extraChannel} follow-up message prepared for authorized contact`)] : [])
    ]
  };

  try {
    const result = await apiRequest("/api/trips", { method: "POST", body: JSON.stringify({ trip }) });
    syncTripFromServer(result.trip || trip);
    state.selectedTripId = (result.trip || trip).id;
    state.screen = "detail";
    render();
    setToast(result.email?.ok ? "Trip created. Confirmation email sent." : (result.email?.message || "Trip created. Email is pending configuration."));
  } catch {
    state.trips.unshift(trip);
    state.selectedTripId = id;
    state.screen = "detail";
    render();
    await emailConfirmation(trip, "Trip created. Confirmation email sent.");
  }
}

async function emailConfirmation(trip, successMessage = "Confirmation email sent.") {
  setToast("Sending Roadlink confirmation email...");
  const result = await sendTripEmail("confirmation", trip);
  updateTrip(trip.id, (item) => {
    item.timeline.push(eventLine(result.ok
      ? `Roadlink confirmation email accepted by Resend for ${item.email}`
      : `Confirmation email not sent: ${result.message}`));
  });
  setToast(result.ok ? successMessage : result.message);
}

async function saveBudget(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  updateTrip(state.selectedTripId, (trip) => {
    trip.budget.push({
      type: form.get("type"),
      detail: form.get("detail"),
      amount: Number(form.get("amount")),
      state: "Logged"
    });
    if (trip.status === "pending" || trip.status === "confirmed") {
      trip.status = "funds";
    }
    trip.timeline.push(eventLine(`${form.get("type")} release logged by ${roleLabel()}`));
  });
  try {
    const result = await apiRequest("/api/budget-items", {
      method: "POST",
      body: JSON.stringify({ tripId: state.selectedTripId, type: form.get("type"), detail: form.get("detail"), amount: Number(form.get("amount")), actorName: state.session?.profile?.name || roleLabel() })
    });
    syncTripFromServer(result.trip);
  } catch {
    // Local UI already reflects the log; server sync can be retried after configuration.
  }
  state.screen = "detail";
  setToast("Budget release logged");
}

async function confirmTrip(tripId) {
  updateTrip(tripId, (trip) => {
    if (trip.status === "pending") trip.status = "confirmed";
    trip.timeline.push(eventLine(`Client confirmed booking through secure link`));
  });
  try {
    const params = new URLSearchParams(window.location.search);
    const result = await apiRequest("/api/client-action", { method: "POST", body: JSON.stringify({ tripId, action: "confirm", token: params.get("token") || "" }) });
    syncTripFromServer(result.trip);
  } catch {
    // Keep the client-facing confirmation working in offline demo mode.
  }
  setToast("Booking confirmed. Staff dashboard updated.");
  state.screen = state.clientSession ? "clientPortal" : "detail";
  state.selectedTripId = tripId;
  render();
}

async function contactRoadlink(tripId) {
  updateTrip(tripId, (trip) => {
    trip.timeline.push(eventLine("Client tapped Contact Roadlink from confirmation link"));
  });
  try {
    const params = new URLSearchParams(window.location.search);
    await apiRequest("/api/client-action", { method: "POST", body: JSON.stringify({ tripId, action: "contact", token: params.get("token") || "" }) });
  } catch {
    // Notification falls back to the local timeline in demo mode.
  }
  setToast("Roadlink coordinator notified to contact the client.");
}

async function cancelTrip(tripId) {
  const reason = document.querySelector("#reason")?.value || "Client cancelled through secure link.";
  updateTrip(tripId, (trip) => {
    const funded = totalBudget(trip) > 0;
    trip.status = funded ? "needs" : "cancelled";
    trip.cancelledReason = reason;
    trip.timeline.push(eventLine(`Client cancelled through secure link. Reason: ${reason}`));
    if (funded) {
      trip.timeline.push(eventLine("For immediate checking alert sent to owner and accounting"));
      state.alerts.push({
        tripId,
        text: `${trip.route} cancelled after ${money(totalBudget(trip))} was logged.`
      });
    }
  });

  try {
    const params = new URLSearchParams(window.location.search);
    const result = await apiRequest("/api/client-action", { method: "POST", body: JSON.stringify({ tripId, action: "cancel", reason, token: params.get("token") || "" }) });
    syncTripFromServer(result.trip);
  } catch {
    // Offline demo state already reflects the cancellation.
  }

  state.screen = state.clientSession ? "clientPortal" : "dashboard";
  state.filter = totalBudget(state.trips.find((trip) => trip.id === tripId)) > 0 ? "needs" : "cancelled";
  setToast("Cancellation received. Funds released: for immediate checking.");
}

async function submitWaybill(tripId) {
  updateTrip(tripId, (trip) => {
    trip.waybill.status = "Submitted";
    trip.timeline.push(eventLine(`Waybill ${trip.waybill.number} submitted for in-app manager approval`));
    trip.timeline.push(eventLine(`Backup approval email sent to ${state.testEmails.join(", ")}`));
  });
  try {
    const result = await apiRequest("/api/waybills/submit", { method: "POST", body: JSON.stringify({ tripId, actorName: state.session?.profile?.name || roleLabel() }) });
    syncTripFromServer(result.trip);
  } catch {
    // Keep local approval routing visible in demo mode.
  }
  setToast("Manager notified in app. Backup approval email queued.");
}

async function signWaybill(tripId, signer) {
  updateTrip(tripId, (trip) => {
    if (signer === "manager") {
      trip.waybill.approvedBy = "Emmanuel Garces";
      trip.waybill.status = trip.waybill.financeBy ? "Approved" : "Manager Signed";
      trip.timeline.push(eventLine("Manager approval added by Emmanuel Garces"));
      trip.timeline.push(eventLine("Accounting notified in app to process budget release"));
    }
    if (signer === "finance") {
      trip.waybill.financeBy = "Liza Mercado";
      trip.waybill.status = trip.waybill.approvedBy ? "Approved" : "Finance Signed";
      trip.timeline.push(eventLine("Finance approval added by Liza Mercado"));
    }
  });
  try {
    const endpoint = signer === "manager" ? "/api/waybills/approve-manager" : "/api/waybills/approve-finance";
    const result = await apiRequest(endpoint, { method: "POST", body: JSON.stringify({ tripId, actorName: state.session?.profile?.name || roleLabel() }) });
    syncTripFromServer(result.trip);
  } catch {
    // Local signature remains visible in demo mode.
  }
  setToast(signer === "manager" ? "Manager approved. Accounting has been notified." : "Finance approved.");
}

async function emailWaybill(tripId) {
  const trip = state.trips.find((item) => item.id === tripId);
  if (!trip) return;
  setToast("Sending Roadlink waybill email...");
  const result = await sendTripEmail("waybill", trip);
  updateTrip(trip.id, (item) => {
    item.timeline.push(eventLine(result.ok
      ? `Waybill ${item.waybill.number} email accepted by Resend for ${item.email}`
      : `Waybill email not sent: ${result.message}`));
  });
  setToast(result.ok ? "Waybill email sent." : result.message);
}

function printWaybill() {
  const waybill = document.querySelector("#waybillForm");
  if (waybill) waybill.scrollIntoView({ block: "start", inline: "start" });
  window.setTimeout(() => window.print(), 120);
  setToast("Print dialog opened. Choose Save as PDF if you need a file copy.");
}

async function saveReconciliation(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  updateTrip(state.selectedTripId, (trip) => {
    trip.reconciliation.cashReturned = form.get("cashReturned") === "true";
    trip.reconciliation.chequeVoided = form.get("chequeVoided") === "true";
    trip.reconciliation.poCancelled = form.get("poCancelled") === "true";
    trip.reconciliation.expensesUsed = form.get("expensesUsed");
    trip.status = "reconciled";
    trip.timeline.push(eventLine("Accounting marked cancellation funds as reconciled"));
  });

  try {
    const result = await apiRequest("/api/reconciliation/update", {
      method: "POST",
      body: JSON.stringify({
        tripId: state.selectedTripId,
        cashReturned: form.get("cashReturned") === "true",
        chequeVoided: form.get("chequeVoided") === "true",
        poCancelled: form.get("poCancelled") === "true",
        expensesUsed: form.get("expensesUsed"),
        actorName: state.session?.profile?.name || roleLabel()
      })
    });
    syncTripFromServer(result.trip);
  } catch {
    // Local reconciliation remains available in demo mode.
  }

  state.filter = "reconciled";
  state.screen = "dashboard";
  setToast("Trip moved to Cancelled - Reconciled");
}

function previewUserPhoto(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    state.newUserPhoto = String(reader.result || "");
    render();
  };
  reader.readAsDataURL(file);
}

function addUser(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = String(form.get("name") || "New User");
  state.users.unshift({
    name,
    role: String(form.get("role") || "Coordinator"),
    username: String(form.get("username") || "user.temp"),
    password: String(form.get("password") || "Roadlink-0000"),
    initials: name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    photo: state.newUserPhoto
  });
  state.newUserPhoto = "";
  setToast("Temporary user added");
}

async function loginClient(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const username = String(form.get("username") || "").trim();
  const password = String(form.get("password") || "").trim();
  try {
    const result = await apiRequest("/api/auth/login", { method: "POST", body: JSON.stringify({ role: "client", username, password }) });
    state.clientSession = { ...result.session.profile, accessToken: result.session.accessToken };
    storeSession(result.session, "client");
    await loadSessionState();
  } catch (error) {
    const offline = state.dataMode === "offline-demo";
    const client = clientDemoUsers.find((item) => [item.username, item.email].includes(username) && item.password === password);
    if (!offline || !client) {
      setToast(error?.message || "Client login details do not match.");
      return;
    }
    state.clientSession = client;
  }
  state.screen = "clientPortal";
  setToast(`Opened ${state.clientSession.company} portal`);
}

async function createClientBookingRequest(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const request = {
    company: String(form.get("company") || ""),
    contact: String(form.get("contact") || ""),
    email: String(form.get("email") || ""),
    phone: String(form.get("phone") || ""),
    origin: String(form.get("origin") || ""),
    destination: String(form.get("destination") || ""),
    vehicle: String(form.get("vehicle") || ""),
    date: String(form.get("date") || ""),
    cargo: String(form.get("cargo") || ""),
    status: "Needs staff review",
    createdAt: new Date().toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })
  };
  try {
    const result = await apiRequest("/api/client-portal/booking-request", { method: "POST", body: JSON.stringify(request) });
    state.bookingRequests.unshift(result.request);
  } catch {
    state.bookingRequests.unshift({ ...request, id: `BR-${Math.floor(7000 + Math.random() * 9000)}` });
  }
  state.screen = "clientPortal";
  setToast("Booking request sent to Roadlink coordinator.");
}

async function convertBookingRequest(requestId) {
  const request = state.bookingRequests.find((item) => item.id === requestId);
  if (!request) return;
  const id = `RL-${Math.floor(2500 + Math.random() * 7000)}`;
  const trip = {
    id,
    client: request.company,
    contact: request.contact,
    phone: request.phone,
    email: request.email,
    route: `${request.origin} to ${request.destination}`,
    origin: request.origin,
    destination: request.destination,
    vehicle: request.vehicle,
    date: request.date,
    cargo: request.cargo,
    coordinator: roleLabel(),
    preferredChannel: "Email",
    status: "pending",
    cancelledReason: "",
    waybill: {
      number: String(Math.floor(38000 + Math.random() * 900)).padStart(6, "0"),
      shipmentNo: id,
      plateNo: "",
      driverName: "",
      truckType: "RCTS Truck",
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
      preparedBy: roleLabel(),
      approvedBy: "",
      financeBy: "",
      paymentReceivedBy: "",
      status: "Draft"
    },
    budget: [],
    reconciliation: { cashReturned: false, chequeVoided: false, poCancelled: false, expensesUsed: "" },
    timeline: [eventLine("Client portal request converted into official Roadlink trip")]
  };
  try {
    const result = await apiRequest("/api/trips", { method: "POST", body: JSON.stringify({ trip }) });
    syncTripFromServer(result.trip || trip);
  } catch {
    state.trips.unshift(trip);
  }
  request.status = "Converted to trip";
  state.selectedTripId = id;
  state.screen = "detail";
  setToast("Client request converted to official trip.");
}

async function initApp() {
  await loadServerState();

  const stored = storedSession();
  if (stored?.accessToken) {
    if (stored.kind === "client") {
      state.clientSession = { ...stored.profile, accessToken: stored.accessToken };
    } else {
      state.session = stored;
      state.role = stored.profile?.role || null;
    }
    await loadSessionState();
    if (!sessionToken()) {
      state.role = null;
    } else if (state.clientSession) {
      state.screen = "clientPortal";
    } else if (state.role) {
      state.screen = "dashboard";
    }
  }

  const params = new URLSearchParams(window.location.search);
  const tripId = params.get("trip");
  const clientAction = params.get("clientAction");
  if (window.location.hash === "#client" && tripId) {
    let linkTrip = state.trips.find((trip) => trip.id === tripId);
    if (!linkTrip) {
      try {
        const result = await apiRequest(`/api/client-trip?trip=${encodeURIComponent(tripId)}&token=${encodeURIComponent(params.get("token") || "")}`);
        linkTrip = result.trip;
        state.trips.unshift(linkTrip);
      } catch (error) {
        state.screen = "home";
        render();
        setToast(error?.message || "This client link is invalid or expired.");
        return;
      }
    }
    state.selectedTripId = tripId;
    state.clientPreviewTripId = tripId;
    state.screen = "client";
    if (clientAction === "confirm") await confirmTrip(tripId);
    if (clientAction === "contact") await contactRoadlink(tripId);
    if (clientAction === "cancel") state.otpSent = true;
  }
  render();
}

document.addEventListener("DOMContentLoaded", initApp);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // The prototype still works if service worker registration is unavailable.
    });
  });
}
