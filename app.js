const roles = [
  { id: "coordinator", label: "Coordinator", icon: "CO", username: "mika.temp", password: "Roadlink-8421", detail: "Create trips, waybills, and client links." },
  { id: "accounting", label: "Accounting", icon: "AC", username: "finance.temp", password: "Roadlink-2198", detail: "Log releases, returns, cheques, and reconciliation." },
  { id: "owner", label: "Owner / Manager", icon: "OM", username: "owner.temp", password: "Roadlink-6714", detail: "Approve waybills, review cancellations, and manage staff access." }
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
  operationalReady: false,
  filter: "all",
  toast: "",
  selectedTripId: "RL-2407",
  selectedBookingRequestId: "",
  clientPreviewTripId: null,
  demoClientTokens: {},
  cancellationFormOpen: false,
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
    { name: "Zeno Jief Flores", role: "Owner / Manager", username: "owner.temp", password: "Roadlink-6714", initials: "ZF", photo: "" }
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

function clientActionToken(tripId) {
  const params = new URLSearchParams(window.location.search);
  return params.get("token") || state.demoClientTokens[tripId] || "";
}

async function openClientPreview(tripId) {
  state.clientPreviewTripId = tripId;
  state.cancellationFormOpen = false;
  if (["local-demo", "presentation-demo"].includes(state.dataMode) && state.session) {
    try {
      const result = await apiRequest("/api/demo/client-link", {
        method: "POST",
        body: JSON.stringify({ tripId })
      });
      state.demoClientTokens[tripId] = result.token;
    } catch (error) {
      delete state.demoClientTokens[tripId];
      setToast(error?.message || "The demo client simulator could not be opened.", 6000);
    }
  } else if (!new URLSearchParams(window.location.search).get("token")) {
    delete state.demoClientTokens[tripId];
  }
  navigate("client", tripId);
}

function sessionToken() {
  return state.session?.accessToken || state.clientSession?.accessToken || "";
}

function escapeUiText(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitizeForUi(value) {
  if (typeof value === "string") return escapeUiText(value);
  if (Array.isArray(value)) return value.map(sanitizeForUi);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, sanitizeForUi(item)]));
  return value;
}

function hasSignedInProfile() {
  return Boolean(state.session?.profile || state.clientSession?.id || state.clientSession?.email);
}

async function apiRequest(path, options = {}) {
  if (window.roadlinkWalkthrough?.active || window.roadlinkDemoChat?.active) {
    throw new Error("Exit the demo before working with saved records.");
  }
  if (window.roadlinkWorkspace?.demoActive) return window.roadlinkWorkspace.request(path, options);
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
  if (response.status === 401) {
    state.session = null;
    state.clientSession = null;
    clearStoredSession();
  }
  if (!response.ok || result.ok === false) {
    throw new Error(result.message || "Roadlink server request failed.");
  }
  return sanitizeForUi(result);
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
    localStorage.setItem("roadlinkSession", JSON.stringify({ profile: session.profile, kind }));
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
    state.operationalReady = Boolean(data.operational);
  } catch {
    state.dataMode = "offline-demo";
  }
}

async function loadSessionState() {
  if (!hasSignedInProfile()) return;
  try {
    const result = await apiRequest("/api/session/bootstrap");
    const data = result.data || {};
    state.dataMode = data.mode || state.dataMode;
    state.googleSheetsConnected = Boolean(data.googleSheets);
    state.emailConnected = Boolean(data.email);
    state.operationalReady = Boolean(data.operational);
    // In production mode the server is the source of truth, even when a list is empty —
    // otherwise demo seed data lingers on screen.
    const authoritative = state.dataMode === "supabase";
    if (Array.isArray(data.trips) && (authoritative || data.trips.length)) state.trips = data.trips;
    if (Array.isArray(data.accountRequests) && (authoritative || data.accountRequests.length)) state.approvalRequests = data.accountRequests;
    if (Array.isArray(data.bookingRequests) && (authoritative || data.bookingRequests.length)) state.bookingRequests = data.bookingRequests;
    if (Array.isArray(data.notifications) && (authoritative || data.notifications.length)) state.notifications = data.notifications;
    if (Array.isArray(data.profiles) && (authoritative || data.profiles.length)) {
      state.users = data.profiles.map((profile) => ({
        id: profile.id,
        name: profile.name,
        role: profile.roleLabel || roleLabelFromId(profile.role),
        roleId: profile.role,
        email: profile.email || "",
        status: profile.status || "active",
        username: profile.username || profile.email,
        password: profile.username?.endsWith(".temp") && !authoritative ? demoPasswordForRole(profile.role) : "",
        initials: profile.initials || initials(profile.name),
        photo: profile.photo || ""
      }));
    }
  } catch {
    state.session = null;
    state.clientSession = null;
    state.role = null;
    clearStoredSession();
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
  if (window.roadlinkWorkspace?.demoActive) return { ok: false, message: "Demo email preview. No email was sent." };
  try {
    const response = await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, tripId: trip.id })
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

function setToast(message, duration = 2600) {
  state.toast = window.roadlinkWorkspace?.demoActive && !/^Demo/i.test(message) ? `Demo: ${message}` : message;
  render();
  window.clearTimeout(setToast.timer);
  setToast.timer = window.setTimeout(() => {
    state.toast = "";
    render();
  }, duration);
}

function navigate(screen, tripId) {
  const previous = state.screen;
  state.screen = screen;
  if (tripId) state.selectedTripId = tripId;
  const section = screen === "detail" ? (["dashboard", "reconcile"].includes(previous) ? previous : selectedTrip()?.status === "needs" ? "reconcile" : "dashboard")
    : screen === "waybill" ? (state.role === "owner" ? "managerApprovals" : state.role === "accounting" ? "financeApprovals" : "waybills")
    : screen === "budget" ? "disbursements" : screen === "clientBookingDetail" ? "clientPortal"
    : screen === "bookingRequest" ? "tasks" : screen;
  state.parentNav = { screen, section };
  state.cancellationFormOpen = false;
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
    liveLogin: renderStaffAccountLogin,
    liveClientLogin: renderClientAccountLogin,
    forgotPassword: renderForgotPassword,
    clientLogin: renderClientLogin,
    clientPortal: renderClientPortal,
    clientBooking: renderClientBookingRequest,
    clientBookingDetail: renderClientBookingDetail,
    bookingRequest: renderBookingRequestReview,
    accountRequest: renderAccountRequest,
    dashboard: renderDashboard,
    tasks: renderTaskHome,
    managerApprovals: renderWaybillQueue,
    financeApprovals: renderWaybillQueue,
    disbursements: renderDisbursements,
    newTrip: renderNewTrip,
    detail: renderDetail,
    budget: renderBudget,
    client: renderClientPreview,
    reconcile: renderReconcile,
    audit: renderAudit,
    waybill: renderWaybill,
    waybills: renderWaybillQueue,
    users: renderUsers,
    messages: () => window.roadlinkDemoChat.renderInbox(),
    chat: () => window.roadlinkDemoChat.render()
  };

  app.innerHTML = (views[state.screen] || renderLogin)();
  app.scrollLeft = 0;
  window.roadlinkWorkspace?.renderChrome();
  bindScreenEvents();
}

function topbar(title, right = "") {
  const back = ["dashboard", "tasks", "login"].includes(state.screen)
    ? `<span></span>`
    : `<button class="icon-btn" type="button" data-action="back" aria-label="Go back">&lt;</button>`;

  return `
    <header class="topbar">
      ${back}
      <h2>${title === "Roadlink" ? `<span class="workspace-desktop-title">Trips</span><img class="topbar-logo" src="assets/roadlink-logo.svg" alt="Roadlink">` : title}</h2>
      <div class="topbar-tools">${right}<button class="tour-help" type="button" data-action="startWalkthrough" aria-label="Open guided walkthrough" title="Guided walkthrough">?</button></div>
    </header>
  `;
}

function renderHome() {
  return `
    <section class="screen home-screen">
      <video class="home-video" src="assets/roadlink-home.mp4" autoplay muted loop playsinline preload="metadata" aria-label="Roadlink fleet video"></video>
      <div class="home-shade" aria-hidden="true"></div>
      <div class="home-hero">
        <img class="home-logo" src="assets/roadlink-logo-home.svg" alt="Roadlink Cargo Transport Service">
        <div class="entry-dialog" role="dialog" aria-labelledby="entryTitle" aria-describedby="entryHint">
          <h1 id="entryTitle">Welcome to Roadlink</h1>
          <p id="entryHint">Choose Staff or Client portal to start your demo.</p>
          <div class="entry-choices"><button class="primary" type="button" data-action="login">Staff</button>
          <button class="secondary" type="button" data-action="startClientDemo">Client portal</button></div>
        </div>
      </div>
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </section>
  `;
}

function renderLogin() {
  return `
    <section class="screen auth-screen">
      <button class="tiny-btn auth-back" type="button" data-action="home">Back</button>
      <div class="auth-panel role-entry-dialog" role="dialog" aria-labelledby="staffRoleTitle" aria-describedby="staffRoleHint">
        <img class="auth-logo" src="assets/roadlink-logo.svg" alt="Roadlink Cargo Transport Service">
        <div><h1 id="staffRoleTitle">Choose your staff role</h1><p id="staffRoleHint">Pick a role for a short walkthrough of your work. No password needed.</p></div>
        <form class="login-form" id="demoAccessForm">
          <div class="field"><label for="loginRole">Role</label><select id="loginRole" name="role">
            ${roles.map((role) => `<option value="${role.id}" ${state.role === role.id ? "selected" : ""}>${role.label}</option>`).join("")}
          </select></div>
          <button class="primary wide" type="submit">Continue</button>
        </form>
        <button class="account-signin-link" type="button" data-action="liveLogin">Sign in to a real staff account</button>
      </div>
    </section>`;
}

function renderStaffAccountLogin() {
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
            <label for="loginUsername">Email or username</label>
            <input id="loginUsername" name="username" autocomplete="username" value="${remembered.username || ""}" placeholder="you@roadlink.com">
          </div>
          <div class="field">
            <label for="loginPassword">Password</label>
            <input id="loginPassword" name="password" type="password" autocomplete="current-password" value="${remembered.password || ""}" placeholder="Your password">
          </div>
          <label class="remember-row">
            <input name="remember" type="checkbox" ${remembered.remember ? "checked" : ""}>
            <span>Remember login details</span>
          </label>
          <button class="primary wide" type="submit">Log in</button>
        </form>

        <button class="ghost wide" type="button" data-action="forgotPassword">Forgot password?</button>
        <button class="ghost wide" type="button" data-action="accountRequest">Create account request</button>
      </div>
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </section>
  `;
}

function renderForgotPassword() {
  const stage = state.resetStage || "email";
  return `
    <section class="screen auth-screen">
      <button class="tiny-btn auth-back" type="button" data-action="login">Back</button>
      <div class="auth-panel">
        <img class="auth-logo" src="assets/roadlink-logo.svg" alt="Roadlink Cargo Transport Service">
        <div>
          <p class="eyebrow">Password Reset</p>
          <h1>${stage === "email" ? "Forgot your password?" : "Enter your reset code"}</h1>
          <p>${stage === "email"
            ? "Enter your account email and we will send you a 6-digit reset code."
            : `We sent a 6-digit code to ${state.resetEmail}. Enter it below with your new password.`}</p>
        </div>

        ${stage === "email" ? `
          <form class="login-form" id="forgotForm">
            <div class="field">
              <label for="resetEmail">Account email</label>
              <input id="resetEmail" name="email" type="email" autocomplete="email" value="${state.resetEmail || ""}" required>
            </div>
            <button class="primary wide" type="submit">Send reset code</button>
          </form>
        ` : `
          <form class="login-form" id="resetForm">
            <div class="field">
              <label for="resetCode">6-digit code</label>
              <input id="resetCode" name="code" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" placeholder="123456" required>
            </div>
            <div class="field">
              <label for="resetNewPassword">New password</label>
              <input id="resetNewPassword" name="password" type="password" autocomplete="new-password" minlength="12" placeholder="12+ characters with upper, lower, and number" required>
            </div>
            <button class="primary wide" type="submit">Set new password</button>
          </form>
          <button class="ghost wide" type="button" data-action="forgotPassword">Resend code / change email</button>
        `}
      </div>
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </section>
  `;
}

function renderClientLogin() {
  return `<section class="screen auth-screen"><button class="tiny-btn auth-back" type="button" data-action="home">Back</button>
    <div class="auth-panel"><img class="auth-logo" src="assets/roadlink-logo.svg" alt="Roadlink Cargo Transport Service">
    <div><p class="eyebrow">Client demo</p><h1>Your bookings</h1><p>Sample records only. No password needed.</p></div>
    <button class="primary wide" type="button" data-action="startClientDemo">Enter client demo</button>
    <button class="account-signin-link" type="button" data-action="liveClientLogin">Sign in to a real client account</button></div></section>`;
}

function renderClientAccountLogin() {
  const client = clientDemoUsers[0];
  const production = state.dataMode === "supabase";
  return `
    <section class="screen auth-screen client-auth-screen">
      <button class="tiny-btn auth-back" type="button" data-action="home">Back</button>
      <div class="auth-panel">
        <img class="auth-logo" src="assets/roadlink-logo.svg" alt="Roadlink Cargo Transport Service">
        <div>
          <p class="eyebrow">${production ? "Client Portal" : "Client Portal Preview"}</p>
          <h1>Track your Roadlink bookings</h1>
          <p>${production
            ? "Request trips, confirm pending bookings, and follow your shipment status. No account yet? Ask Roadlink for client portal access."
            : "For demo only: clients can request trips, confirm pending bookings, and see simple trip summaries without internal budget details."}</p>
        </div>

        <form class="login-form" id="clientLoginForm">
          <div class="field">
            <label for="clientEmail">Client email or username</label>
            <input id="clientEmail" name="username" autocomplete="username" value="${production ? "" : client.username}" required>
          </div>
          <div class="field">
            <label for="clientPassword">Password</label>
            <input id="clientPassword" name="password" type="password" autocomplete="current-password" value="${production ? "" : client.password}" required>
          </div>
          <button class="primary wide" type="submit">Open client portal</button>
        </form>

        <button class="ghost wide" type="button" data-action="forgotPassword">Forgot password?</button>

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

function clientBookingStatus(status) {
  if (status === "funds") return "confirmed";
  if (["needs", "reconciled"].includes(status)) return "cancelled";
  return status;
}

function renderClientPortal() {
  const client = state.clientSession || clientDemoUsers[0];
  const trips = clientTrips();
  const requests = clientRequests();
  return `
    <section class="screen">
      ${topbar("Client Portal", `<button class="tiny-btn" type="button" data-action="logoutClient">Exit</button>`)}
      <div class="client-portal-hero">
        <img src="assets/roadlink-logo.svg" alt="Roadlink Cargo Transport Service">
        <h1>${client.company}</h1>
        <p>${client.contact}</p>
      </div>
      <div class="content">
        <button class="primary wide" type="button" data-action="clientBooking">Request new booking</button>
        <div class="status-grid">
          <div class="metric"><b>${trips.length}</b><span>Bookings</span></div>
          <div class="metric"><b>${requests.length}</b><span>Requests</span></div>
        </div>

        <section class="portal-bookings">
          <div class="section-head">
            <div>
              <h3>Active bookings</h3>
            </div>
          </div>
          <div class="cards thin-cards">
            ${trips.map((trip) => `
              <button class="client-trip-card" type="button" data-client-trip-detail="${trip.id}">
                <strong>${trip.origin} to ${trip.destination}</strong>
                <span>${displayDate(trip.date)} • ${trip.vehicle}</span>
                <small class="status-pill ${clientBookingStatus(trip.status)}">${statusLabels[clientBookingStatus(trip.status)]}</small>
              </button>
            `).join("") || `<span class="muted">No active bookings yet.</span>`}
          </div>
        </section>

        <section class="portal-bookings">
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
        </section>
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
          <span class="status-pill ${clientBookingStatus(trip.status)}">${statusLabels[clientBookingStatus(trip.status)]}</span>
          <h1>${trip.origin} to ${trip.destination}</h1>
          <div class="trip-fields compact-fields">
            <span><b>Company</b>${trip.client}</span>
            <span><b>Authorized contact</b>${trip.contact}</span>
            <span><b>Vehicle Type</b>${trip.vehicle}</span>
            <span><b>Plate No.</b>${trip.waybill?.plateNo || "For assignment"}</span>
            <span><b>Trip Date</b>${displayDate(trip.date)}</span>
            <span><b>Cargo</b>${trip.cargo || "None provided"}</span>
          </div>
          ${activeTrip(trip) ? `
            <div class="actions">
              ${trip.status === "pending" ? `<button class="success" type="button" data-client-confirm="${trip.id}">Confirm Booking</button>` : ""}
              <button class="danger" type="button" data-client-cancel="${trip.id}">Cancel Booking</button>
            </div>
            ${state.cancellationFormOpen ? `<div class="field"><label for="reason">Cancellation reason</label>
              <textarea id="reason" placeholder="Why is the booking being cancelled?" required></textarea>
              <button class="danger wide" type="button" data-complete-cancel="${trip.id}">Submit cancellation</button></div>` : ""}
          ` : ""}
          <button class="ghost" type="button" data-call-roadlink="${trip.id}">Contact Roadlink</button>
          <button class="secondary chat-entry" type="button" data-action="chatClient">Trip messages <span class="chat-inline-badge">Demo</span></button>
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
          <p>Staff accounts require Owner / Manager approval.</p>
        </div>

        <form class="login-form" id="accountRequestForm">
          <div class="field">
            <label for="requestName">Full name</label>
            <input id="requestName" name="name" placeholder="Juan Dela Cruz" required>
          </div>
          <div class="field">
            <label for="requestEmail">Email</label>
            <input id="requestEmail" name="email" type="email" placeholder="you@company.com" required>
          </div>
          <div class="field">
            <label for="requestRole">Requested role</label>
            <select id="requestRole" name="role">
              <option>Coordinator</option>
              <option>Accounting</option>
              <option>Owner / Manager</option>
              <option>Client</option>
            </select>
          </div>
          <div class="field">
            <label for="requestCompany">Company <small>(required for client accounts)</small></label>
            <input id="requestCompany" name="company" placeholder="Your company name">
          </div>
          <button class="primary wide" type="submit">Send approval request</button>
        </form>

        <div class="request-summary">
          <strong>Approval flow</strong>
          <span>Owner / Manager receives the request for review.</span>
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
  const canManageUsers = state.role === "owner" || state.role === "admin";
  const canCreateTrip = state.role === "coordinator";

  return `
    <section class="screen">
      ${topbar("Roadlink", `<button class="tiny-btn" type="button" data-action="logout">Role</button>`)}
      <div class="content">
        <div class="pilot-status" ${state.dataMode === "presentation-demo" ? "hidden" : ""}>
          <span><b>Status</b>${state.operationalReady ? "Live ready" : "Pilot safeguards"}</span>
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
            ${canManageUsers ? `<button class="tiny-btn" type="button" data-action="users">Users</button>` : ""}
            ${canCreateTrip ? `<button class="tiny-btn" type="button" data-action="newTrip">New trip</button>` : ""}
          </div>
        </div>

        <div class="status-grid">
          <div class="metric"><b>${state.trips.length}</b><span>Total trips</span></div>
          <div class="metric"><b>${counts.funds}</b><span>Funds released</span></div>
          <div class="metric"><b>${counts.pending}</b><span>Awaiting confirmation</span></div>
          <div class="metric"><b>${riskCount}</b><span>Cancelled with releases</span></div>
        </div>

        ${["coordinator", "owner"].includes(state.role) && state.bookingRequests.some((item) => item.status !== "Converted to trip") ? `
          <article class="card booking-requests-section">
            <div class="section-head">
              <div>
                <h3>Client booking requests</h3>
                <p>Portal requests wait here until a coordinator converts them to official trips.</p>
              </div>
              <span class="pill">${state.bookingRequests.length} open</span>
            </div>
            <div class="request-list">
              ${state.bookingRequests.filter((item) => item.status !== "Converted to trip").slice(0, 2).map((request) => `
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

        <section class="trip-table-section" aria-label="Trips"><table class="trip-table"><thead><tr><th>Route / company</th><th>Vehicle / plate</th><th>Trip date</th><th>Status</th><th>Released funds</th><th></th></tr></thead><tbody>${visibleTrips.map((trip) => `<tr><td><strong>${trip.route}</strong><span>${trip.client}</span></td><td><strong>${trip.vehicle}</strong><span>${trip.waybill?.plateNo || "For assignment"}</span></td><td>${displayDate(trip.date)}</td><td><span class="status-pill ${trip.status}">${statusLabels[trip.status]}</span></td><td>${money(totalBudget(trip))}</td><td><button class="tiny-btn" type="button" data-open-trip="${trip.id}">Open trip</button></td></tr>`).join("") || `<tr><td colspan="6">No trips match this status.</td></tr>`}</tbody></table></section>
        <div class="cards trip-cards">
          ${visibleTrips.map(renderTripCard).join("") || `<div class="card"><strong>No trips here</strong><span>Change the filter or create a new trip.</span></div>`}
        </div>
      </div>
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </section>
  `;
}

function roleHomeScreen() {
  return state.clientSession && !state.session ? "clientPortal" : state.role === "admin" ? "users" : "tasks";
}

function activeTrip(trip) {
  return !["cancelled", "needs", "reconciled"].includes(trip.status);
}

function roleWorkItems() {
  const items = [];
  const add = (trip, title, action, label) => items.push({ trip, title, action, label });
  for (const trip of state.trips) {
    if (state.role === "coordinator" && trip.coordinator === state.session?.profile?.name && activeTrip(trip)) {
      if (trip.waybill.status === "Draft") add(trip, "Prepare waybill", "waybill", "Prepare waybill");
      else if (trip.status === "pending") add(trip, "Waiting for client confirmation", "detail", "Follow up");
    }
    if (state.role === "owner") {
      if (activeTrip(trip) && trip.waybill.status === "Submitted") add(trip, "Awaiting your approval", "waybill", "Review waybill");
      if (trip.status === "needs") add(trip, "Cancelled with released funds", "detail", "Review trip");
    }
    if (state.role === "accounting") {
      if (trip.status === "needs") add(trip, "For immediate checking", "openReconcile", "Check releases");
      else if (activeTrip(trip) && trip.waybill.status === "Manager Signed") add(trip, "Awaiting finance approval", "waybill", "Review waybill");
      else if (trip.status === "confirmed" && trip.waybill.status === "Approved") add(trip, "Ready for disbursement", "budget", "Record disbursement");
    }
  }
  return items.sort((a, b) => Number(b.trip.status === "needs") - Number(a.trip.status === "needs"));
}

function renderWorkRows(items) {
  return `<div class="work-list">${items.map(({ trip, title, action, label }) => `
    <article class="work-row"><div><span class="work-reason">${escapeUiText(title)}</span>
      <h3>${escapeUiText(trip.route)}</h3><p>${escapeUiText(trip.client)} · ${displayDate(trip.date)}</p>
      <small>${escapeUiText(trip.id)} · Waybill ${escapeUiText(trip.waybill.number)}</small></div>
      <button class="secondary" type="button" data-action="${action}" data-trip-action="${trip.id}">${label}</button>
    </article>`).join("") || `<p class="work-empty">Nothing waiting for you here.</p>`}</div>`;
}

function renderTaskHome() {
  const items = roleWorkItems();
  const requests = state.role === "coordinator" ? state.bookingRequests.filter((item) => item.status !== "Converted to trip") : [];
  const approvals = state.role === "owner" ? state.approvalRequests.filter((item) => item.status === "Pending").length : 0;
  return `<section class="screen">${topbar(state.role === "owner" ? "Manager overview" : "My tasks")}
    <div class="content"><div class="section-head"><div><h3>${escapeUiText(state.session?.profile?.name || roleLabel())}</h3>
    <p>${roleLabel()}</p></div>${state.role === "coordinator" ? `<button class="primary" type="button" data-action="newTrip">New booking</button>` : ""}</div>
    <div class="work-summary"><strong>${items.length + requests.length + approvals}</strong><span>items need your attention</span></div>
    ${items.length || (!requests.length && !approvals) ? renderWorkRows(items) : ""}
    ${requests.length ? `<section class="work-section"><h3>Client booking requests</h3><div class="request-list">${requests.map((request) => `
      <button class="request-card" type="button" data-open-booking-request="${request.id}"><strong>${escapeUiText(request.company)}</strong>
      <span>${escapeUiText(request.origin)} to ${escapeUiText(request.destination)}</span><small>${displayDate(request.date)}</small></button>`).join("")}</div></section>` : ""}
    ${approvals ? `<button class="secondary" type="button" data-action="users">${approvals} account ${approvals === 1 ? "request" : "requests"} awaiting review</button>` : ""}
    </div>${state.toast ? `<div class="toast">${state.toast}</div>` : ""}</section>`;
}

function renderDisbursements() {
  const items = state.trips.filter((trip) => ["confirmed", "funds"].includes(trip.status) && trip.waybill.status === "Approved")
    .map((trip) => ({ trip, title: totalBudget(trip) ? `Released so far: ${money(totalBudget(trip))}` : "Approved and ready for release", action: "budget", label: "Record disbursement" }));
  return `<section class="screen">${topbar("Disbursements")}<div class="content">${renderWorkRows(items)}</div>
    ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}</section>`;
}

function roleLabel() {
  if (state.role === "admin") return "Access management";
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
        <span><b>Released funds</b>${money(total)}</span>
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
  const canReleaseFunds = state.role === "accounting";
  const releaseReady = ["confirmed", "funds"].includes(trip.status) && trip.waybill.status === "Approved";
  const canReconcile = state.role === "accounting";
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
        ${window.roadlinkDemoChat?.canAccess(trip) ? `<button class="secondary chat-entry" type="button" data-action="chatStaff">Trip messages <span class="chat-inline-badge">Demo</span></button>` : ""}
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
          <button class="secondary" type="button" data-action="waybill">${state.role === "coordinator" && trip.waybill.status === "Draft" ? "Prepare waybill" : "Open waybill"}</button>
        </article>

        <article class="card">
          <div class="section-head">
            <div>
              <h3>Released funds</h3>
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
          ${canReleaseFunds && releaseReady
            ? `<button class="secondary" type="button" data-action="budget">Log budget release</button>`
            : `<span class="field-hint">${canReleaseFunds ? "Client confirmation and both waybill approvals are required before release." : "Accounting records releases after approval."}</span>`}
        </article>

        ${trip.status === "needs" ? `
          <article class="alert-card">
            <strong>For immediate checking</strong>
            <span>This client cancellation happened after funds were released. Accounting should verify cash, cheques, and POs now.</span>
            ${canReconcile ? `<button class="danger wide" type="button" data-action="openReconcile">Open checking task</button>` : `<span>Accounting has been notified.</span>`}
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
      ${topbar("Record release")}
      <form class="content form-grid" id="budgetForm">
        <article class="card">
          <strong>${trip.route}</strong>
          <span>Released so far: ${money(totalBudget(trip))}</span>
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
              <option value="Misc">Miscellaneous</option>
            </select>
          </div>
          <div class="field">
            <label for="amount">Amount</label>
            <input id="amount" name="amount" type="number" min="0.01" step="0.01" placeholder="0.00" required>
          </div>
          <div class="field">
            <label for="detail">Purpose or reference</label>
            <textarea id="detail" name="detail" placeholder="Purpose, cheque number, PO reference, or supplier"></textarea>
          </div>
        </div>
        <button class="primary wide" type="submit">Save release log</button>
      </form>
      ${state.toast ? `<div class="toast">${state.toast}</div>` : ""}
    </section>
  `;
}

function renderWaybillQueue() {
  const requiredStatus = state.screen === "managerApprovals" ? "Submitted" : state.screen === "financeApprovals" ? "Manager Signed" : null;
  const trips = state.trips.filter((trip) => !requiredStatus || (activeTrip(trip) && trip.waybill.status === requiredStatus)).sort((left, right) => {
    const priority = { Submitted: 0, "Manager Signed": 1, Draft: 2, Approved: 3 };
    return (priority[left.waybill.status] ?? 4) - (priority[right.waybill.status] ?? 4);
  });
  const title = state.screen === "managerApprovals" ? "Pending approvals" : state.screen === "financeApprovals" ? "Finance approvals" : "Waybills";
  return `<section class="screen">${topbar(title)}<div class="content">
    ${renderWorkRows(trips.map((trip) => ({ trip, title: trip.waybill.status, action: "waybill", label: "Open waybill" })))}
    </div></section>`;
}

function renderWaybill() {
  const trip = selectedTrip();
  const waybill = trip.waybill;
  const canManagerApprove = state.role === "owner" && activeTrip(trip) && waybill.status === "Submitted";
  const canFinanceApprove = state.role === "accounting" && activeTrip(trip) && waybill.status === "Manager Signed";
  const canPrepare = state.role === "coordinator" && activeTrip(trip) && ["Draft", "Submitted"].includes(waybill.status);
  const nextStep = !activeTrip(trip) ? "This trip is closed for approvals."
    : waybill.status === "Draft" ? "Coordinator: prepare and submit the waybill."
    : waybill.status === "Submitted" ? "Waiting for manager approval."
    : waybill.status === "Manager Signed" ? "Waiting for accounting approval."
    : "Approved. Accounting can record disbursements after client confirmation.";
  const paymentRows = [
    ["SELL RATE", "sellRate", waybill.sellRate],
    ["FREIGHT", "freight", waybill.freight],
    ["TOTAL CHECK", "", waybill.freight],
    ["BUYING RATE", "buyingRate", waybill.buyingRate],
    ["DOWNPAYMENT", "downpayment", waybill.downpayment],
    ["BALANCE AMOUNT", "balanceAmount", waybill.balanceAmount],
    ["ARRASTRE", "arrastre", waybill.arrastre],
    ["DRIVER", "driver", waybill.driver],
    ["HELPER", "helper", waybill.helper],
    ["LABOR", "labor", waybill.labor],
    ["OTHERS", "others", waybill.others],
    ["TOTAL CASH OUT", "", cashOutTotal(waybill)],
    ["OVER ALL TOTAL", "", overallTotal(waybill)]
  ];

  return `
    <section class="screen">
      ${topbar("Waybill", `<button class="tiny-btn" type="button" data-action="printWaybill">Print</button>`)}
      <div class="content waybill-screen">
        <article class="card no-print">
          <strong>${nextStep}</strong>
          <div class="approval-status"><span>Manager: ${waybill.approvedBy || "Pending"}</span><span>Accounting: ${waybill.financeBy || "Pending"}</span></div>
          <div class="actions">
            ${canPrepare ? `<button class="secondary" type="button" data-action="submitWaybill">Save and submit</button>` : ""}
            ${canManagerApprove ? `<button class="ghost" type="button" data-action="managerSign">Approve (Manager)</button>` : ""}
            ${canFinanceApprove ? `<button class="ghost" type="button" data-action="financeSign">Approve (Finance)</button>` : ""}
            <button class="primary" type="button" data-action="printWaybill">Print waybill</button>
            <button class="secondary" type="button" data-action="emailWaybill">Email waybill</button>
          </div>
        </article>

        <div class="waybill-scroll-hint no-print">Scroll sideways and down to inspect the full printable waybill.</div>
        <form class="waybill-paper" id="waybillForm" data-readonly="${canPrepare ? "false" : "true"}">
          <div class="waybill-heading">
            <strong>WAYBILL</strong>
            <span>ROADLINK CARGO TRANSPORT SERVICE</span>
            <b>WB No. ${waybill.number}</b>
          </div>

          <div class="waybill-grid top">
            <label>SHIPPER<input name="shipper" value="${waybill.shipper || trip.client}"></label>
            <label>DATE<input name="date" value="${displayDate(trip.date)}"></label>
            <label class="check-row">RCTS TRUCK<input type="radio" name="truckType" value="RCTS Truck" ${waybill.truckType === "RCTS Truck" ? "checked" : ""}></label>
            <label>CONSIGNEE<input name="consignee" value="${waybill.consignee || trip.contact}"></label>
            <label>DESTINATION<input name="destination" value="${waybill.destination || trip.destination}"></label>
            <label class="check-row">SUBCON TRUCK<input type="radio" name="truckType" value="Subcon Truck" ${waybill.truckType === "Subcon Truck" ? "checked" : ""}></label>
            <label>SHIPMENT NO.<input name="shipmentNo" value="${waybill.shipmentNo}"></label>
          </div>

          <div class="waybill-main">
            <div class="items-box">
              <div class="items-head">
                <span>QTY</span>
                <span>DESCRIPTION OF ITEMS</span>
              </div>
              <div class="items-body">
                <input name="qty" value="${waybill.qty || "1"}">
                <textarea name="cargo">${waybill.cargo || trip.cargo}</textarea>
              </div>
            </div>

            <div class="payment-box">
              <div class="payment-head">
                <span>PAYMENT DETAILS</span>
                <span>AMOUNT</span>
              </div>
              ${paymentRows.map(([label, field, amount]) => `
                <div class="payment-row ${label.includes("TOTAL") || label.includes("OVER") ? "total" : ""}">
                  <span>${label}</span>
                  <input ${field ? `name="${field}" type="number" min="0" step="0.01"` : "readonly"} value="${Number(amount || 0)}">
                </div>
              `).join("")}
            </div>
          </div>

          <div class="waybill-footer">
            <label>DRIVER'S NAME<input name="driverName" value="${waybill.driverName}"></label>
            <label>PLATE NO.<input name="plateNo" value="${waybill.plateNo}"></label>
            <label>PAYMENT RECEIVED BY<input name="paymentReceivedBy" value="${waybill.paymentReceivedBy}"></label>
            <label>PREPARED BY<input value="${waybill.preparedBy}" readonly></label>
            <label>APPROVED BY<input value="${waybill.approvedBy}" readonly></label>
            <label>FINANCE<input value="${waybill.financeBy}" readonly></label>
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
  const canSubmitClientAction = Boolean(clientActionToken(trip.id));

  return `
    <section class="screen client-preview">
      ${state.session || state.clientSession ? `<button class="tiny-btn" type="button" data-action="back">${state.clientSession ? "Back to bookings" : "Back to trip"}</button>` : ""}
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
        ${state.dataMode === "local-demo" && canSubmitClientAction ? `
          <div class="notice-card">
            <strong>Local walkthrough simulator</strong>
            <span>These actions update demo records only. Production staff previews cannot act for a client.</span>
          </div>
        ` : ""}
        ${!canSubmitClientAction ? `
          <div class="notice-card">
            <strong>Staff preview only</strong>
            <span>The live buttons are available only from the secure link sent to the authorized client.</span>
          </div>
        ` : cancelled ? `
          <div class="alert-card">
            <strong>This booking is already cancelled.</strong>
            <span>Roadlink staff have been notified.</span>
          </div>
        ` : `
          <div class="actions">
            <button class="success" type="button" data-client-confirm="${trip.id}">Confirm Booking</button>
            <button class="danger" type="button" data-client-cancel="${trip.id}">Cancel Booking</button>
          </div>
          ${state.cancellationFormOpen ? `
            <div class="form-card">
              <div class="field">
                <label for="reason">Cancellation reason</label>
                <textarea id="reason" placeholder="Briefly tell Roadlink why the trip is being cancelled" required></textarea>
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
  const active = trip?.status === "needs" ? trip : queue[0];

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
          <button class="secondary" type="button" data-action="detail" data-trip-action="${active.id}">Review trip</button>
        </article>

        <div class="form-card">
          <div class="field">
            <label for="cashReturned">Cash returned</label>
            <select id="cashReturned" name="cashReturned">
              <option value="false">Not yet</option>
              <option value="true">Returned</option>
            </select>
          </div>
          <div class="field">
            <label for="chequeVoided">Cheque voided</label>
            <select id="chequeVoided" name="chequeVoided">
              <option value="false">Not yet</option>
              <option value="true">Voided</option>
            </select>
          </div>
          <div class="field">
            <label for="poCancelled">PO cancelled</label>
            <select id="poCancelled" name="poCancelled">
              <option value="false">Not yet</option>
              <option value="true">Cancelled</option>
            </select>
          </div>
          <div class="field">
            <label for="expensesUsed">Used expenses or notes</label>
            <textarea id="expensesUsed" name="expensesUsed">No trip expenses used before cancellation.</textarea>
          </div>
        </div>

        ${state.role === "accounting" ? `<button class="primary wide" type="submit">Mark checking complete</button>` : `<p class="field-hint">Accounting records the outcome of each release. This view is read-only.</p>`}
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
  const production = state.dataMode === "supabase";
  const isUserAdmin = ["owner", "admin"].includes(state.role);
  const issued = state.lastIssuedCredentials;

  return `
    <section class="screen">
      ${topbar("Users")}
      <div class="content">
        ${issued ? `
          <article class="card" style="border:2px solid #0fba81;">
            <strong>New credentials for ${issued.name}</strong>
            <span>Login: <b>${issued.username}</b></span>
            <span>Temporary password: <b>${issued.password}</b></span>
            <small>${issued.emailOk ? "Also sent by email." : "Email delivery failed — copy these and send them over Viber/SMS."} Ask them to change the password after first login.</small>
            <div class="actions">
              <button class="secondary" type="button" data-copy-credentials="1">Copy credentials</button>
              <button class="ghost" type="button" data-dismiss-credentials="1">Dismiss</button>
            </div>
          </article>
        ` : ""}

        <article class="card">
          <div class="section-head">
            <div>
              <h3>Account approvals</h3>
              <p>Approving a request creates the login and issues a temporary password instantly.</p>
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
                  ? `<div class="button-pair"><button class="secondary" type="button" data-approve-request="${request.id}">Approve</button><button class="ghost" type="button" data-reject-request="${request.id}">Decline</button></div>`
                  : `<span class="status-pill ${request.status === "Approved" ? "confirmed" : "cancelled"}">${request.status}</span>`}
              </div>
            `).join("") || `<span class="muted">No account requests yet.</span>`}
          </div>
        </article>

        ${production ? `<form class="form-card" id="changePasswordForm">
          <div class="field">
            <label for="currentPassword">Current password</label>
            <input id="currentPassword" name="currentPassword" type="password" autocomplete="current-password" required>
          </div>
          <div class="field">
            <label for="newPassword">New password</label>
            <input id="newPassword" name="newPassword" type="password" autocomplete="new-password" minlength="12" placeholder="12+ characters with upper, lower, and number" required>
          </div>
          <button class="primary wide" type="submit">Change my password</button>
        </form>` : ""}

        ${production ? "" : `
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
        </form>`}

        <div class="cards">
          ${state.users.map((user) => `
            <article class="card user-card">
              <span class="user-photo">${user.photo ? `<img src="${user.photo}" alt="">` : user.initials}</span>
              <div>
                <strong>${user.name}</strong>
                <span>${user.role}${user.status === "suspended" ? " • Suspended" : ""}</span>
                <small>${user.username}</small>
                ${isUserAdmin && user.id && user.id !== state.session?.profile?.id ? `
                  <div class="actions" style="margin-top:8px;">
                    <button class="secondary" type="button" data-reset-user="${user.id}">Reset password</button>
                    ${user.status === "suspended"
                      ? `<button class="ghost" type="button" data-activate-user="${user.id}">Activate</button>`
                      : `<button class="ghost" type="button" data-suspend-user="${user.id}">Suspend</button>`}
                  </div>
                ` : ""}
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
  if (window.roadlinkWalkthrough?.active) return;
  if (window.roadlinkDemoChat?.active) { window.roadlinkDemoChat.bind(); return; }
  if (state.screen === "messages") window.roadlinkDemoChat.bindInbox();
  document.querySelector("#demoAccessForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    window.roadlinkWorkspace.enterGuidedDemo(new FormData(event.currentTarget).get("role"));
  });
  if (state.screen === "reconcile" && state.role !== "accounting") {
    document.querySelectorAll("#reconcileForm input, #reconcileForm select, #reconcileForm textarea").forEach((control) => { control.disabled = true; });
  }
  const waybillForm = document.querySelector("#waybillForm[data-readonly='true']");
  if (waybillForm) {
    waybillForm.querySelectorAll("input, textarea, select").forEach((control) => { control.disabled = true; });
  }

  document.querySelectorAll("[data-role]").forEach((button) => {
    button.addEventListener("click", () => {
      state.role = button.dataset.role;
  state.screen = roleHomeScreen();
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
    button.addEventListener("click", () => {
      state.selectedRequestId = button.dataset.openBookingRequest;
      navigate("bookingRequest");
    });
  });

  document.querySelectorAll("[data-client-trip-detail]").forEach((button) => {
    button.addEventListener("click", () => navigate("clientBookingDetail", button.dataset.clientTripDetail));
  });

  document.querySelectorAll("[data-client-link]").forEach((button) => {
    button.addEventListener("click", () => openClientPreview(button.dataset.clientLink));
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
      state.cancellationFormOpen = true;
      setToast("Enter the cancellation reason, then submit to notify Roadlink.");
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

  const forgotForm = document.querySelector("#forgotForm");
  if (forgotForm) forgotForm.addEventListener("submit", requestResetCode);

  const resetForm = document.querySelector("#resetForm");
  if (resetForm) resetForm.addEventListener("submit", submitPasswordReset);

  const changePasswordForm = document.querySelector("#changePasswordForm");
  if (changePasswordForm) changePasswordForm.addEventListener("submit", changeOwnPassword);

  document.querySelectorAll("[data-reset-user]").forEach((button) => {
    button.addEventListener("click", () => adminResetUserPassword(button.dataset.resetUser));
  });

  document.querySelectorAll("[data-suspend-user]").forEach((button) => {
    button.addEventListener("click", () => setUserStatus(button.dataset.suspendUser, "suspended"));
  });

  document.querySelectorAll("[data-activate-user]").forEach((button) => {
    button.addEventListener("click", () => setUserStatus(button.dataset.activateUser, "active"));
  });

  document.querySelectorAll("[data-copy-credentials]").forEach((button) => {
    button.addEventListener("click", async () => {
      const issued = state.lastIssuedCredentials;
      if (!issued) return;
      try {
        await navigator.clipboard.writeText(`Roadlink Trip Control login\nLogin: ${issued.username}\nTemporary password: ${issued.password}\nApp: ${window.location.origin}`);
        setToast("Credentials copied to clipboard.");
      } catch {
        setToast("Could not copy automatically. Copy the details manually.");
      }
    });
  });

  document.querySelectorAll("[data-dismiss-credentials]").forEach((button) => {
    button.addEventListener("click", () => {
      state.lastIssuedCredentials = null;
      render();
    });
  });

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

  document.querySelectorAll("[data-reject-request]").forEach((button) => {
    button.addEventListener("click", () => rejectAccountRequest(button.dataset.rejectRequest));
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
    startWalkthrough: () => { if (["home", "login"].includes(state.screen)) navigate("home"); else window.roadlinkWalkthrough?.start(); },
    startDemo: () => navigate("login"),
    startClientDemo: () => window.roadlinkWorkspace?.enterGuidedDemo("client"),
    liveLogin: () => openAccountLogin("liveLogin"),
    liveClientLogin: () => openAccountLogin("liveClientLogin"),
    chatStaff: () => window.roadlinkDemoChat?.start(trip),
    chatClient: () => window.roadlinkDemoChat?.start(trip),
    messages: () => window.roadlinkDemoChat?.openInbox(),
    back: () => {
      state.screen = previous === "client" ? (state.clientSession ? "clientPortal" : "detail") : (["login", "liveLogin", "clientLogin", "liveClientLogin", "accountRequest"].includes(previous) ? "home" : roleHomeScreen());
      render();
    },
    home: () => navigate("home"),
    login: () => navigate("login"),
    forgotPassword: () => { state.resetStage = "email"; navigate("forgotPassword"); },
    clientLogin: () => navigate("clientLogin"),
    clientBooking: () => navigate("clientBooking"),
    accountRequest: () => navigate("accountRequest"),
    logout: () => logoutCurrentUser(),
    logoutClient: () => logoutCurrentUser(),
    newTrip: () => navigate("newTrip"),
    detail: () => navigate("detail", trip?.id),
    convertRequest: () => convertBookingRequest(state.selectedRequestId),
    budget: () => navigate("budget", trip.id),
    clientPreview: () => openClientPreview(trip.id),
    openReconcile: () => navigate("reconcile", trip?.status === "needs" ? trip.id : state.trips.find((item) => item.status === "needs")?.id),
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
  state.screen = roleHomeScreen();
  setToast(`Signed in as ${role.label}`);
}

async function openAccountLogin(screen) {
  if (window.roadlinkWorkspace?.demoActive) window.roadlinkWorkspace.closeDemo();
  await loadServerState();
  navigate(screen);
}

async function logoutCurrentUser() {
  if (window.roadlinkWorkspace?.demoActive) { window.roadlinkWorkspace.closeDemo(); return; }
  try {
    await apiRequest("/api/auth/logout", { method: "POST", body: "{}" });
  } catch {
    // Local state is still cleared if the network is unavailable.
  }
  state.session = null;
  state.clientSession = null;
  state.role = null;
  clearStoredSession();
  navigate("home");
}

async function requestAccount(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const request = {
    name: String(form.get("name") || "").trim(),
    email: String(form.get("email") || "").trim(),
    role: String(form.get("role") || "Coordinator"),
    company: String(form.get("company") || "").trim(),
    status: "Pending",
    requestedAt: new Date().toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })
  };
  try {
    const result = await apiRequest("/api/auth/account-request", { method: "POST", body: JSON.stringify(request) });
    state.approvalRequests.unshift(result.request);
  } catch (error) {
    if (state.dataMode !== "offline-demo") {
      setToast(error?.message || "Could not send the request. Try again.");
      return;
    }
    state.approvalRequests.unshift({ ...request, id: `REQ-${Math.floor(1200 + Math.random() * 8000)}` });
  }
  state.screen = "home";
  setToast(`Approval request sent to Owner / Manager for ${request.email}`, 5000);
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
      id: profile.id,
      name: profile.name,
      role: profile.roleLabel || request.role,
      roleId: profile.role,
      email: profile.email || request.email,
      status: "active",
      username: result.credentials?.username || profile.username,
      password: "",
      initials: profile.initials || initials(profile.name),
      photo: profile.photo || ""
    });
    state.lastIssuedCredentials = {
      name: profile.name,
      username: result.credentials?.username || profile.username,
      password: result.credentials?.password || "",
      emailOk: Boolean(result.email?.ok)
    };
    render();
    setToast(result.email?.ok
      ? `Approved ${request.email}. Credentials sent by email and shown above.`
      : `Approved ${request.email}. Email failed — credentials are shown above.`, 6000);
  } catch (error) {
    setToast(error?.message || `Could not approve ${request.email}. Try again.`);
  }
}

async function rejectAccountRequest(requestId) {
  const request = state.approvalRequests.find((item) => item.id === requestId);
  if (!request) return;
  try {
    const result = await apiRequest("/api/admin/reject-account", {
      method: "POST",
      body: JSON.stringify({ requestId, reason: "Access not approved by Roadlink" })
    });
    request.status = result.request.status;
    render();
    setToast(`Declined account request for ${request.email}.`, 4000);
  } catch (error) {
    setToast(error?.message || "Could not decline the request.", 5000);
  }
}

async function requestResetCode(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const email = String(form.get("email") || "").trim();
  if (!email) return;
  const button = event.currentTarget.querySelector("button[type=submit]");
  if (button) { button.disabled = true; button.textContent = "Sending..."; }
  try {
    const result = await apiRequest("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
    state.resetEmail = email;
    state.resetStage = "code";
    render();
    setToast(result.message || "Reset code sent. Check your email.", 5000);
  } catch (error) {
    render();
    setToast(error?.message || "Could not send the reset code. Try again.", 6000);
  }
}

async function submitPasswordReset(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  try {
    const result = await apiRequest("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        email: state.resetEmail,
        code: String(form.get("code") || "").trim(),
        password: String(form.get("password") || "")
      })
    });
    state.resetStage = "email";
    state.screen = "login";
    render();
    setToast(result.message || "Password updated. Log in with your new password.", 5000);
  } catch (error) {
    setToast(error?.message || "Could not reset the password. Try again.", 5000);
  }
}

async function changeOwnPassword(event) {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  try {
    const result = await apiRequest("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify({
        currentPassword: String(form.get("currentPassword") || ""),
        newPassword: String(form.get("newPassword") || "")
      })
    });
    event.target.reset();
    await apiRequest("/api/auth/logout", { method: "POST", body: "{}" });
    state.session = null;
    state.role = null;
    clearStoredSession();
    state.screen = "login";
    setToast(result.message || "Password changed. Log in again with your new password.", 5000);
  } catch (error) {
    setToast(error?.message || "Could not change the password.", 5000);
  }
}

async function adminResetUserPassword(profileId) {
  const user = state.users.find((item) => item.id === profileId);
  if (!user) return;
  try {
    const result = await apiRequest("/api/admin/reset-user-password", {
      method: "POST",
      body: JSON.stringify({ profileId })
    });
    state.lastIssuedCredentials = {
      name: user.name,
      username: result.credentials?.username || user.username,
      password: result.credentials?.password || "",
      emailOk: Boolean(result.email?.ok)
    };
    render();
    setToast(`New temporary password issued for ${user.name}.`, 5000);
  } catch (error) {
    setToast(error?.message || "Could not reset the password.", 5000);
  }
}

async function setUserStatus(profileId, status) {
  const user = state.users.find((item) => item.id === profileId);
  if (!user) return;
  try {
    await apiRequest("/api/admin/set-user-status", {
      method: "POST",
      body: JSON.stringify({ profileId, status })
    });
    user.status = status;
    render();
    setToast(status === "suspended" ? `${user.name} suspended. They can no longer log in.` : `${user.name} reactivated.`, 4000);
  } catch (error) {
    setToast(error?.message || "Could not update the account.", 5000);
  }
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
    preparedBy: state.session?.profile?.name || roleLabel(),
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
    coordinator: state.session?.profile?.name || roleLabel(),
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
    if (result.demoClientToken) state.demoClientTokens[(result.trip || trip).id] = result.demoClientToken;
    syncTripFromServer(result.trip || trip);
    state.selectedTripId = (result.trip || trip).id;
    state.screen = "detail";
    render();
    setToast(result.email?.ok ? "Trip created. Confirmation email sent." : (result.email?.message || "Trip created. Email is pending configuration."));
  } catch (error) {
    if (state.dataMode === "offline-demo") {
      state.trips.unshift(trip);
      state.selectedTripId = id;
      state.screen = "detail";
      render();
      return;
    }
    setToast(error?.message || "The trip was not created. Check your connection and try again.", 6000);
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
  try {
    const result = await apiRequest("/api/budget-items", {
      method: "POST",
      body: JSON.stringify({ tripId: state.selectedTripId, type: form.get("type"), detail: form.get("detail"), amount: Number(form.get("amount")), actorName: state.session?.profile?.name || roleLabel() })
    });
    syncTripFromServer(result.trip);
  } catch (error) {
    if (state.dataMode !== "offline-demo") {
      setToast(error?.message || "The release was not saved.", 6000);
      return;
    }
    updateTrip(state.selectedTripId, (trip) => {
      trip.budget.push({ type: form.get("type"), detail: form.get("detail"), amount: Number(form.get("amount")), state: "Logged" });
      trip.status = "funds";
      trip.timeline.push(eventLine(`${form.get("type")} release logged by ${roleLabel()}`));
    });
  }
  state.screen = "detail";
  setToast("Budget release logged");
}

async function confirmTrip(tripId) {
  try {
    const result = await apiRequest("/api/client-action", { method: "POST", body: JSON.stringify({ tripId, action: "confirm", token: clientActionToken(tripId) }) });
    if (state.session) await loadSessionState();
    else syncTripFromServer(result.trip);
  } catch (error) {
    if (state.dataMode !== "offline-demo") {
      setToast(error?.message || "Confirmation was not recorded. Please try again.", 6000);
      return;
    }
    updateTrip(tripId, (trip) => {
      if (trip.status === "pending") trip.status = "confirmed";
      trip.timeline.push(eventLine("Client confirmed booking through secure link"));
    });
  }
  setToast("Booking confirmed. Staff dashboard updated.");
  state.screen = state.clientSession ? "clientPortal" : "detail";
  state.selectedTripId = tripId;
  render();
}

async function contactRoadlink(tripId) {
  try {
    await apiRequest("/api/client-action", { method: "POST", body: JSON.stringify({ tripId, action: "contact", token: clientActionToken(tripId) }) });
  } catch (error) {
    if (state.dataMode !== "offline-demo") {
      setToast(error?.message || "Roadlink was not notified. Please call the coordinator directly.", 6000);
      return;
    }
    updateTrip(tripId, (trip) => trip.timeline.push(eventLine("Client tapped Contact Roadlink from confirmation link")));
  }
  setToast("Roadlink coordinator notified to contact the client.");
}

async function cancelTrip(tripId) {
  const reason = document.querySelector("#reason")?.value.trim();
  if (!reason) { setToast("Enter a cancellation reason."); return; }
  try {
    const result = await apiRequest("/api/client-action", { method: "POST", body: JSON.stringify({ tripId, action: "cancel", reason, token: clientActionToken(tripId) }) });
    if (state.session) await loadSessionState();
    else syncTripFromServer(result.trip);
  } catch (error) {
    if (state.dataMode !== "offline-demo") {
      setToast(error?.message || "Cancellation was not recorded. Please contact Roadlink.", 6000);
      return;
    }
    updateTrip(tripId, (trip) => {
      const funded = totalBudget(trip) > 0;
      trip.status = funded ? "needs" : "cancelled";
      trip.cancelledReason = reason;
      trip.timeline.push(eventLine(`Client cancelled through secure link. Reason: ${reason}`));
    });
  }

  state.screen = state.clientSession ? "clientPortal" : "dashboard";
  state.filter = totalBudget(state.trips.find((trip) => trip.id === tripId)) > 0 ? "needs" : "cancelled";
  setToast(state.clientSession ? "Booking cancelled. Roadlink has been notified." : state.filter === "needs" ? "Cancellation recorded. For immediate checking." : "Cancellation recorded. No releases logged.");
}

async function submitWaybill(tripId) {
  const formElement = document.querySelector("#waybillForm");
  const form = formElement ? new FormData(formElement) : new FormData();
  const numericFields = ["sellRate", "freight", "buyingRate", "downpayment", "balanceAmount", "arrastre", "driver", "helper", "labor", "others"];
  const waybill = {
    shipmentNo: String(form.get("shipmentNo") || ""),
    plateNo: String(form.get("plateNo") || ""),
    driverName: String(form.get("driverName") || ""),
    paymentReceivedBy: String(form.get("paymentReceivedBy") || ""),
    shipper: String(form.get("shipper") || ""),
    consignee: String(form.get("consignee") || ""),
    destination: String(form.get("destination") || ""),
    qty: String(form.get("qty") || "1"),
    cargo: String(form.get("cargo") || ""),
    truckType: form.get("truckType") === "Subcon Truck" ? "Subcon Truck" : "RCTS Truck"
  };
  numericFields.forEach((field) => { waybill[field] = Number(form.get(field) || 0); });
  try {
    const result = await apiRequest("/api/waybills/submit", { method: "POST", body: JSON.stringify({ tripId, waybill }) });
    syncTripFromServer(result.trip);
  } catch (error) {
    setToast(error?.message || "The waybill was not submitted.", 6000);
    return;
  }
  setToast("Manager notified in app. Backup approval email queued.");
}

async function signWaybill(tripId, signer) {
  try {
    const endpoint = signer === "manager" ? "/api/waybills/approve-manager" : "/api/waybills/approve-finance";
    const result = await apiRequest(endpoint, { method: "POST", body: JSON.stringify({ tripId, actorName: state.session?.profile?.name || roleLabel() }) });
    syncTripFromServer(result.trip);
  } catch (error) {
    setToast(error?.message || "Approval was not recorded.", 6000);
    return;
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
  } catch (error) {
    setToast(error?.message || "Reconciliation was not saved.", 6000);
    return;
  }

  state.filter = "reconciled";
  state.screen = roleHomeScreen();
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
    state.clientSession = { ...result.session.profile };
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
  } catch (error) {
    if (state.dataMode !== "offline-demo") {
      setToast(error?.message || "The booking request was not sent.", 6000);
      return;
    }
    state.bookingRequests.unshift({ ...request, id: `BR-${Math.floor(7000 + Math.random() * 9000)}` });
  }
  state.screen = "clientPortal";
  setToast("Booking request sent to Roadlink coordinator.");
}

function renderBookingRequestReview() {
  const request = state.bookingRequests.find((item) => item.id === state.selectedRequestId);
  if (!request) return `<section class="screen">${topbar("Booking request")}<div class="content"><p>This request is no longer available.</p></div></section>`;
  return `<section class="screen">${topbar("Review booking request")}<div class="content">
    <h2>${escapeUiText(request.company)}</h2><div class="trip-fields request-review">
    ${[["From", request.origin], ["To", request.destination], ["Vehicle", request.vehicle], ["Trip date", displayDate(request.date)],
      ["Authorized contact", request.contact], ["Email", request.email], ["Phone", request.phone], ["Cargo", request.cargo || "Not provided"]]
      .map(([label, value]) => `<span><b>${label}</b>${escapeUiText(value || "Not provided")}</span>`).join("")}</div>
    <p>Check vehicle availability and confirm the details with the client before creating the trip.</p>
    ${request.status === "Converted to trip" ? `<p>This request has already been converted.</p>` : `<button class="primary" type="button" data-action="convertRequest" ${state.convertingRequestId ? "disabled" : ""}>${state.convertingRequestId ? "Creating trip..." : "Create trip from request"}</button>`}
    </div>${state.toast ? `<div class="toast">${state.toast}</div>` : ""}</section>`;
}

async function convertBookingRequest(requestId) {
  const request = state.bookingRequests.find((item) => item.id === requestId);
  if (!request || request.status === "Converted to trip" || state.convertingRequestId) return;
  if (!["coordinator", "owner"].includes(state.role)) return;
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
    coordinator: state.session?.profile?.name || roleLabel(),
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
      preparedBy: state.session?.profile?.name || roleLabel(),
      approvedBy: "",
      financeBy: "",
      paymentReceivedBy: "",
      status: "Draft"
    },
    budget: [],
    reconciliation: { cashReturned: false, chequeVoided: false, poCancelled: false, expensesUsed: "" },
    timeline: [eventLine("Client portal request converted into official Roadlink trip")]
  };
  state.convertingRequestId = request.id;
  render();
  try {
    const result = await apiRequest("/api/trips", { method: "POST", body: JSON.stringify({ trip }) });
    syncTripFromServer(result.trip || trip);
  } catch (error) {
    state.convertingRequestId = null;
    if (state.dataMode !== "offline-demo") {
      setToast(error?.message || "The booking request was not converted.", 6000);
      return;
    }
    state.trips.unshift(trip);
  }
  state.convertingRequestId = null;
  request.status = "Converted to trip";
  state.selectedTripId = id;
  state.screen = "detail";
  setToast("Client request converted to official trip.");
}

async function initApp() {
  const launchParams = new URLSearchParams(window.location.search);
  if (launchParams.get("mobile") === "1") document.body.classList.add("mobile-preview");
  if (launchParams.has("walkthrough") && !launchParams.has("demo") && !launchParams.has("trip")) { navigate("home"); return; }
  if (launchParams.has("demo")) {
    const requestedRole = launchParams.get("demo");
    if (requestedRole !== "client" && !roles.some((role) => role.id === requestedRole)) { navigate("home"); return; }
    window.roadlinkWorkspace.startDemo(requestedRole);
    if (launchParams.has("walkthrough")) window.roadlinkWalkthrough.start();
    else if (launchParams.has("chat-demo")) window.roadlinkDemoChat.start();
    return;
  }
  if (!storedSession()?.profile && !launchParams.has("trip") && !launchParams.has("walkthrough") && !launchParams.has("chat-demo")) {
    render();
    return;
  }
  await loadServerState();

  const stored = storedSession();
  if (stored?.profile) {
    if (stored.kind === "client") {
      state.clientSession = { ...stored.profile };
    } else {
      state.session = stored;
      state.role = stored.profile?.role || null;
    }
    await loadSessionState();
    if (!hasSignedInProfile()) {
      state.role = null;
    } else if (state.clientSession) {
      state.screen = "clientPortal";
    } else if (state.role) {
      state.screen = roleHomeScreen();
    }
  }

  const params = new URLSearchParams(window.location.search);
  const tripId = params.get("trip");
  const clientIntent = params.get("intent") || params.get("clientAction");
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
    if (clientIntent === "cancel") state.cancellationFormOpen = true;
    if (clientIntent === "confirm") state.toast = "Review the trip details, then tap Confirm Booking.";
    if (clientIntent === "contact") state.toast = "Tap Contact Roadlink to notify the coordinator.";
  }
  render();
  if (params.has("walkthrough") && window.location.hash !== "#client") {
    window.roadlinkWorkspace?.startDemo();
    window.roadlinkWalkthrough?.start();
  } else if (params.has("chat-demo") && window.location.hash !== "#client") {
    window.roadlinkDemoChat?.start();
  }
}

document.addEventListener("DOMContentLoaded", initApp);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      // The prototype still works if service worker registration is unavailable.
    });
  });
}
