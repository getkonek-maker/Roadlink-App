const assert = require("node:assert/strict");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");

(async () => {
  const browser = await chromium.launch({
    headless: true,
    ...(process.env.CHROME_EXECUTABLE ? { executablePath: process.env.CHROME_EXECUTABLE } : {})
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const base = process.env.ROADLINK_TEST_BASE || "http://127.0.0.1:4175";
  const errors = [], api = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("request", (request) => { if (new URL(request.url()).pathname.startsWith("/api/")) api.push(request.url()); });
  const nav = (screen) => page.locator('#workspaceNav [data-workspace-nav="' + screen + '"]');
  async function switchRole(role) {
    await page.getByRole("button", { name: "Switch access", exact: true }).click();
    await page.getByRole("button", { name: "Staff", exact: true }).click();
    assert.equal(await page.locator("#loginRole option").count(), 3);
    await page.locator("#loginRole").selectOption(role);
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.locator('[data-tour="close"]').click();
  }
  try {
    await page.goto(base + "/?demo=owner");
    assert.match(await page.locator(".workspace-person").innerText(), /Zeno Jief Flores/);
    await page.locator('[data-action="detail"][data-trip-action="RL-2413"]').click();
    assert.equal(await page.evaluate(() => state.screen), "detail");
    assert.equal(await page.evaluate(() => selectedTrip().id), "RL-2413");
    assert.equal(await nav("reconcile").getAttribute("aria-current"), "page");
    await nav("tasks").click();
    await page.locator('[data-action="waybill"][data-trip-action="RL-2412"]').click();
    await page.locator('[data-action="managerSign"]').click();
    assert.equal(await page.locator('[data-action="managerSign"]').count(), 0);
    await switchRole("accounting");
    assert.equal(await page.locator('[data-workspace-nav="messages"]').count(), 0);
    await nav("financeApprovals").click();
    await page.locator('[data-trip-action="RL-2412"]').click();
    assert.equal(await page.locator('[data-action="managerSign"]').count(), 0);
    await page.locator('[data-action="financeSign"]').click();
    assert.equal(await page.locator('[data-action="financeSign"]').count(), 0);
    await nav("disbursements").click();
    await page.locator('[data-trip-action="RL-2412"]').click();
    await page.locator('#budgetForm [name="type"]').selectOption("Cash");
    await page.locator('#budgetForm [name="amount"]').fill("15000");
    await page.locator('#budgetForm [name="detail"]').fill("Cash voucher UI test");
    await page.locator('#budgetForm button[type="submit"]').click();
    assert.equal(await page.evaluate(() => selectedTrip().status), "funds");
    await page.evaluate(() => navigate("detail", "RL-2412"));
    assert.equal(await page.locator('[data-action="chatStaff"]').count(), 0);
    assert.equal(await page.evaluate(() => window.roadlinkDemoChat.start(selectedTrip())), false);
    await switchRole("owner");
    await nav("messages").click();
    assert.equal(await page.locator("[data-conversation]").count(), 6);
    if (process.env.ROADLINK_SCREENSHOT_DIR) await page.screenshot({ path: process.env.ROADLINK_SCREENSHOT_DIR + "/roadlink-inbox-desktop.png" });
    await page.locator("#conversationSearch").fill("Bohol");
    assert.equal(await page.locator("[data-conversation]").count(), 1);
    await page.locator('[data-conversation="RL-2412"]').click();
    assert.match(await page.locator(".chat-sending-as").innerText(), /Zeno Jief Flores/);
    assert.equal(await nav("messages").getAttribute("aria-current"), "page");
    await page.locator("#chatMessage").fill("Loading confirmed for 8 AM.");
    await page.getByRole("button", { name: "Send demo message" }).click();
    await page.getByRole("button", { name: "Exit chat demo" }).click();
    assert.match(await page.locator('[data-conversation="RL-2412"]').innerText(), /Loading confirmed for 8 AM/);
    await page.locator("#conversationSearch").fill("");
    await page.locator('[data-conversation="RL-2410"]').click();
    await nav("dashboard").click();
    assert.equal(await page.evaluate(() => window.roadlinkDemoChat.active), false);
    await switchRole("coordinator");
    await nav("messages").click();
    assert.equal(await page.locator("[data-conversation]").count(), 5);
    assert.equal(await page.locator('[data-conversation="RL-2410"]').count(), 0);
    assert.equal(await page.evaluate(() => window.roadlinkDemoChat.start(state.trips.find((trip) => trip.id === "RL-2410"))), false);
    await nav("tasks").click();
    const before = await page.evaluate(() => state.trips.length);
    await page.locator("[data-open-booking-request]").first().click();
    assert.equal(await page.evaluate(() => state.screen), "bookingRequest");
    assert.equal(await page.evaluate(() => state.trips.length), before);
    await page.getByRole("button", { name: "Create trip from request", exact: true }).click();
    assert.equal(await page.evaluate(() => state.trips.length), before + 1);
    assert.equal(await page.evaluate(() => selectedTrip().coordinator), "Mika Santos");
    await page.evaluate(() => convertBookingRequest(state.selectedRequestId));
    assert.equal(await page.evaluate(() => state.trips.length), before + 1);
    await page.goto(base + "/?demo=client");
    await nav("messages").click();
    assert.equal(await page.locator("[data-conversation]").count(), 5);
    assert.equal(await page.locator('[data-conversation="RL-2410"]').count(), 0);
    await page.locator('[data-conversation="RL-2407"]').click();
    assert.match(await page.locator(".chat-sending-as").innerText(), /Ana Lim/);
    await page.getByRole("button", { name: "Exit chat demo" }).click();

    const guideCounts = { coordinator: 6, owner: 7, accounting: 6, client: 5 };
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }, { width: 320, height: 568 }, { width: 844, height: 390 }]) {
      await page.setViewportSize(viewport);
      for (const [role, count] of Object.entries(guideCounts)) {
        await page.goto(base + "/?demo=" + role + "&walkthrough=2");
        await page.locator(".tour-dialog").waitFor();
        for (let index = 0; index < count; index++) {
          await page.waitForTimeout(60);
          assert.match(await page.locator(".tour-compact-header").innerText(), new RegExp((index + 1) + " OF " + count));
          assert.equal(await page.evaluate(() => state.clientSession && !state.session ? "client" : state.role), role);
          assert.ok((await page.locator("#tourBody").innerText()).split(/\s+/).length <= 40);
          const box = await page.locator(".tour-dialog").boundingBox();
          const bottomNav = await page.locator("#mobileNav").boundingBox();
          const bottom = viewport.width >= 1000 ? viewport.height : bottomNav.y;
          assert.ok(box.x >= 0 && box.y >= 0 && box.x + box.width <= viewport.width + 1 && box.y + box.height <= bottom + 1, JSON.stringify({ viewport, role, index, box, bottom }));
          assert.ok(await page.locator(".tour-focus").count() > 0);
          assert.ok(await page.locator(".tour-nav-current:visible").count() > 0);
          assert.ok((await page.locator(".tour-location").innerText()).trim());
          await page.locator('[data-tour="next"]').click();
        }
        assert.equal(await page.locator(".tour-dialog").count(), 0);
        assert.equal(await page.evaluate(() => state.trips.length), 6);
      }
      if (viewport.width === 390 && process.env.ROADLINK_SCREENSHOT_DIR) {
        await page.locator('#mobileNav [data-workspace-nav="messages"]').click();
        await page.screenshot({ path: process.env.ROADLINK_SCREENSHOT_DIR + "/roadlink-inbox-mobile.png" });
      }
    }
    assert.deepEqual(api, [], "demo must not call backend endpoints");
    assert.deepEqual(errors, []);
    console.log(JSON.stringify({ passed: true, reviewTrip: true, requestReviewBeforeConversion: true, conversationSearch: true, messagingPermissions: true, stageApprovals: true, guides: guideCounts, navigationHighlights: true, viewports: 4, backendCalls: 0 }, null, 2));
  } finally { await browser.close(); }
})().catch((error) => { console.error(error); process.exitCode = 1; });
