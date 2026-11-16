(() => {
  const storagePrefix = "roadlinkDemoConversation:v1:";
  const demoTrip = {
    id: "DEMO-CHAT-1001", route: "Cebu to Leyte", client: "Mactan Seafoods Export",
    contact: "Ana Lim", coordinator: "Mika Santos", vehicle: "10-wheeler truck"
  };
  let active = false;
  let snapshot;
  let context;
  let side = "staff";
  let senderName = "";
  let messages = [];
  let drafts = { staff: "", client: "" };
  let notice = "";
  let previousScroll = 0;
  let previousFocus;

  function seedMessages(trip) {
    const now = Date.now();
    return [
      { id: "sample-1", side: "staff", name: trip.coordinator || "Roadlink coordinator", text: `Hi! Your ${trip.route} booking is ready for review. Please use the confirmation email to confirm the trip.`, at: new Date(now - 1800000).toISOString(), readBy: ["staff", "client"] },
      { id: "sample-2", side: "client", name: trip.contact || "Client contact", text: "Thank you. Can we load at 8 AM instead of 7 AM?", at: new Date(now - 1200000).toISOString(), readBy: ["client"] }
    ];
  }

  function readMessages(trip) {
    try {
      const stored = JSON.parse(sessionStorage.getItem(storagePrefix + trip.id) || "null");
      if (Array.isArray(stored) && stored.length <= 100 && stored.every((item) =>
        item && typeof item.id === "string" && ["staff", "client"].includes(item.side)
        && typeof item.name === "string" && item.name.length <= 150
        && typeof item.text === "string" && item.text.length <= 1000
        && Number.isFinite(Date.parse(item.at)) && Array.isArray(item.readBy)
        && item.readBy.every((value) => ["staff", "client"].includes(value)))) return stored;
    } catch { /* A blocked or expired session store can use the sample conversation. */ }
    return seedMessages(trip);
  }

  function save() {
    try { sessionStorage.setItem(storagePrefix + context.id, JSON.stringify(messages)); }
    catch { notice = "This browser cannot keep the conversation after a refresh. You can still try it here."; }
  }

  function markRead(view) {
    messages.forEach((message) => {
      if (message.side !== view && !message.readBy.includes(view)) message.readBy.push(view);
    });
    save();
  }

  function html(trip, view, thread, draft = "", feedback = "", actorName = "") {
    const escape = escapeUiText;
    const other = view === "staff" ? "client" : "staff";
    const suggestions = view === "staff" ? ["8 AM loading is noted. Thank you.", "Please confirm the loading address."] : ["Thank you, noted.", "Could you confirm the pickup time?"];
    return `<section class="screen chat-screen">
      <header class="topbar chat-topbar"><button class="icon-btn" type="button" data-chat-exit aria-label="Exit chat demo">&lt;</button><h2>Trip messages</h2><span class="chat-demo-badge">Demo</span></header>
      <div class="chat-trip-context"><span>${escape(trip.id)}</span><strong>${escape(trip.route)}</strong><small>${escape(trip.client)} · ${escape(trip.vehicle)}</small></div>
      <div class="chat-demo-controls">
        <p>Sample conversation. Messages stay on this device.</p>
      </div>
      <div class="chat-thread" id="chatThread" role="region" aria-label="Trip messages" tabindex="0">
        <p class="chat-day">Sample booking conversation</p>
        <div role="log" aria-label="Trip conversation" aria-live="polite" aria-relevant="additions text">${thread.map((message) => `<article class="chat-message ${message.side === view ? "outgoing" : "incoming"}"><span class="chat-sender">${escape(message.name)} · ${message.side === "staff" ? "Roadlink" : "Client"}</span><p>${escape(message.text)}</p><div class="chat-message-meta"><time datetime="${escape(message.at)}">${new Date(message.at).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</time>${message.side === view ? `<span>${message.readBy.includes(other) ? "Read in demo" : "Sent in demo"}</span>` : ""}</div></article>`).join("")}</div>
      </div>
      <div class="chat-composer-area">
        <p class="chat-sending-as">Writing as ${escape(actorName || (view === "staff" ? trip.coordinator || "Roadlink coordinator" : trip.contact || "Client contact"))}</p>
        <div class="chat-suggestions" aria-label="Suggested replies">${suggestions.map((text, i) => `<button type="button" data-chat-suggestion="${i}">${text}</button>`).join("")}</div>
        <form id="demoChatForm" class="chat-composer"><label class="tour-sr-only" for="chatMessage">Message</label><textarea id="chatMessage" name="message" rows="2" maxlength="1000" placeholder="Write a message..." required>${escape(draft)}</textarea><button class="primary" type="submit" ${!draft.trim() ? "disabled" : ""} aria-label="Send demo message">Send</button></form>
        <p class="chat-feedback" role="status">${escape(feedback)}</p>
        <div class="chat-bottom-note"><span>Confirm or cancel using the booking buttons.</span><button type="button" data-chat-reset>Reset demo</button></div>
      </div>
    </section>`;
  }

  function renderChat() {
    return html(context || demoTrip, side, messages, drafts[side], notice, senderName);
  }

  function redraw({ bottom = false, focus = false } = {}) {
    render();
    const thread = document.querySelector("#chatThread");
    if (bottom && thread) thread.scrollTop = thread.scrollHeight;
    if (focus) {
      const input = document.querySelector("#chatMessage");
      input.focus({ preventScroll: true });
      input.setSelectionRange(input.value.length, input.value.length);
    }
  }

  function bind() {
    if (!active) return;
    document.querySelector("[data-chat-exit]").addEventListener("click", close);
    const input = document.querySelector("#chatMessage");
    const form = document.querySelector("#demoChatForm");
    input.addEventListener("input", () => {
      drafts[side] = input.value;
      form.querySelector("button").disabled = !input.value.trim();
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && !event.shiftKey && !event.isComposing) {
        event.preventDefault();
        if (input.value.trim()) form.requestSubmit();
      }
    });
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text || text.length > 1000) return;
      if (messages.length >= 100) {
        notice = "This demo holds up to 100 messages. Reset the demo to start a fresh conversation.";
        redraw(); return;
      }
      messages.push({ id: crypto.randomUUID(), side, name: senderName, text, at: new Date().toISOString(), readBy: [side] });
      drafts[side] = "";
      notice = "Saved in this demo only. No message was sent to another person.";
      save();
      redraw({ bottom: true, focus: true });
    });
    document.querySelectorAll("[data-chat-suggestion]").forEach((button) => button.addEventListener("click", () => {
      drafts[side] = button.textContent;
      redraw({ focus: true });
    }));
    document.querySelector("[data-chat-reset]").addEventListener("click", () => {
      messages = seedMessages(context);
      drafts = { staff: "", client: "" };
      notice = "Sample conversation restored.";
      markRead(side);
      redraw({ bottom: true });
    });
  }

  function start(trip) {
    if (active || window.roadlinkWalkthrough?.active) return;
    snapshot = structuredClone(state);
    previousScroll = document.querySelector("#app").scrollTop;
    previousFocus = document.activeElement?.getAttribute("data-action");
    const source = trip || demoTrip;
    context = Object.fromEntries(Object.keys(demoTrip).map((key) => [key, String(source[key] || demoTrip[key]).slice(0, 150)]));
    side = state.clientSession && !state.session ? "client" : "staff";
    senderName = String(side === "client"
      ? state.clientSession.contact || state.clientSession.name || context.contact
      : state.session?.profile?.name || context.coordinator).slice(0, 150);
    drafts = { staff: "", client: "" };
    messages = readMessages(context);
    notice = "";
    active = true;
    window.clearTimeout(setToast.timer);
    state.screen = "chat";
    document.body.classList.add("chat-demo-active");
    markRead(side);
    redraw({ bottom: true });
    document.querySelector("#chatThread").focus({ preventScroll: true });
  }

  function close() {
    if (!active) return;
    active = false;
    Object.keys(state).forEach((key) => { if (!Object.hasOwn(snapshot, key)) delete state[key]; });
    Object.assign(state, snapshot);
    document.body.classList.remove("chat-demo-active");
    render();
    document.querySelector("#app").scrollTop = previousScroll;
    const url = new URL(location.href);
    url.searchParams.delete("chat-demo");
    history.replaceState(null, "", url);
    const focus = previousFocus ? document.querySelector(`[data-action="${previousFocus}"]`) : document.querySelector("#app button");
    focus?.focus({ preventScroll: true });
  }

  window.roadlinkDemoChat = {
    get active() { return active; }, start, close, render: renderChat, bind,
    preview(trip, view = "staff") {
      const thread = seedMessages(trip);
      return html(trip, view, thread, "", "");
    }
  };
})();
