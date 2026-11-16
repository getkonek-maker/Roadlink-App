import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const source = readFileSync(new URL("../demo-chat.js", import.meta.url), "utf8");

function chatFor({ session = null, clientSession = null } = {}) {
  const state = { screen: "detail", session, clientSession };
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
  const { chat } = chatFor({ clientSession: { name: "Ana <Lim>" } });
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
