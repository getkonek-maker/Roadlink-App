import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const source = readFileSync(new URL("../demo-chat.js", import.meta.url), "utf8");

function chatFor({ session = null, clientSession = null } = {}) {
  const state = { screen: "detail", session, clientSession, role: session?.profile?.role, trips: [
    { id: "DEMO-CHAT-1001", route: "Cebu to Leyte", client: "Mactan Seafoods Export", contact: "Ana Lim", coordinator: "Mika Santos", vehicle: "10-wheeler truck" },
    { id: "OTHER-1", route: "Cebu to Davao", client: "Another Company", contact: "Jamie", coordinator: "Carlo Reyes", vehicle: "Wing van" }
  ] };
  const node = { scrollTop: 0, scrollHeight: 100, focus() {} };
  const storage = new Map();
  const context = {
    state, structuredClone, URL,
    history: { replaceState() {} },
    location: { href: "https://example.com/?demo=1" },
    sessionStorage: { getItem: (key) => storage.get(key), setItem: (key, value) => storage.set(key, value) },
    document: {
      querySelector: () => node,
      activeElement: null,
      body: { classList: { add() {}, remove() {} } }
    },
    window: { clearTimeout() {} },
    setToast: {},
    render() {},
    topbar: (title) => `<header>${title}</header>`,
    navigate: (screen) => { state.screen = screen; },
    escapeUiText: (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
  };
  runInNewContext(source, context);
  return { chat: context.window.roadlinkDemoChat, state };
}

test("staff chat stays with the signed-in person, not the client's identity", () => {
  const { chat, state } = chatFor({ session: { profile: { name: "Manager Jane", role: "owner" } } });
  chat.start(undefined, "client");
  const html = chat.render();
  assert.match(html, /Writing as Manager Jane/);
  assert.doesNotMatch(html, /data-chat-view|role="tablist"/);
  assert.match(html, /Messages stay on this device/);
  chat.close();
  assert.equal(state.screen, "detail");
  assert.equal(state.session.profile.name, "Manager Jane");
});

test("client chat stays with the client and escapes their displayed name", () => {
  const { chat } = chatFor({ clientSession: { name: "Ana <Lim>", company: "Mactan Seafoods Export" } });
  chat.start(undefined, "staff");
  const html = chat.render();
  assert.match(html, /Writing as Ana &lt;Lim&gt;/);
  assert.doesNotMatch(html, /Writing as Mika|data-chat-view/);
});

test("a staff session takes precedence over a stale client session in chat", () => {
  const { chat } = chatFor({
    session: { profile: { name: "Mika Santos", role: "coordinator" } },
    clientSession: { name: "Ana Lim" }
  });
  chat.start();
  assert.match(chat.render(), /Writing as Mika Santos/);
});

test("accounting cannot list, open, or impersonate a client conversation", () => {
  const { chat, state } = chatFor({ session: { profile: { name: "Liza Mercado", role: "accounting" } } });
  assert.equal(chat.canAccess(state.trips[0]), false);
  assert.equal(chat.start(state.trips[0]), false);
  assert.equal(chat.active, false);
  assert.doesNotMatch(chat.renderInbox(), /data-conversation=/);
});

test("coordinators see assigned trips only, managers see every conversation", () => {
  const staff = chatFor({ session: { profile: { name: "Mika Santos", role: "coordinator" } } });
  assert.equal(staff.chat.canAccess(staff.state.trips[0]), true);
  assert.equal(staff.chat.canAccess(staff.state.trips[1]), false);
  assert.equal(staff.chat.canAccess({ ...staff.state.trips[1], coordinator: "Mika Santos" }), false);
  assert.equal(staff.chat.start({ ...staff.state.trips[1], coordinator: "Mika Santos" }), false);
  assert.doesNotMatch(staff.chat.renderInbox(), /Another Company/);
  const manager = chatFor({ session: { profile: { name: "Zeno Jief Flores", role: "owner" } } });
  assert.equal(manager.chat.canAccess(manager.state.trips[1]), true);
  assert.match(manager.chat.renderInbox(), /Another Company/);
});

test("clients cannot read another company's conversation or match missing contacts", () => {
  const client = chatFor({ clientSession: { name: "Ana Lim", company: "Mactan Seafoods Export" } });
  assert.equal(client.chat.canAccess(client.state.trips[0]), true);
  assert.equal(client.chat.canAccess(client.state.trips[1]), false);
  assert.equal(client.chat.start(client.state.trips[1]), false);
  const incomplete = chatFor({ clientSession: { name: "Unknown" } });
  assert.equal(incomplete.chat.canAccess(incomplete.state.trips[0]), false);
});
