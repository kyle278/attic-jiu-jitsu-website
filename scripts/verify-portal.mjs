import { createRequire } from "node:module";
import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import crypto from "node:crypto";
const require = createRequire(
  path.join(
    process.env.USERPROFILE,
    ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json",
  ),
);
const { chromium } = require("playwright");
const base = process.env.PORTAL_REVIEW_URL || "http://localhost:3314";
const portal = "https://portal.ingeniumconsulting.net";
const sdk = await (await fetch(portal + "/ingenium-site-v2.js")).text();
const browser = await chromium.launch({
  headless: true,
  executablePath:
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
});
const results = {
  base,
  passed: [],
  failures: [],
  pageErrors: [],
  liveReceipts: [],
};
async function check(name, fn) {
  try {
    await fn();
    results.passed.push(name);
  } catch (e) {
    results.failures.push({ name, error: e.message });
  }
}
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
});
const batches = [],
  submissions = [];
let rejectForm = true;
await context.route(portal + "/**", async (route) => {
  const url = route.request().url();
  if (url.endsWith("/ingenium-site-v2.js"))
    return route.fulfill({ contentType: "application/javascript", body: sdk });
  if (url.endsWith("/api/websites/v2/events")) {
    batches.push(route.request().postDataJSON());
    return route.fulfill({ status: 202, json: { accepted: 1 } });
  }
  if (url.endsWith("/api/websites/forms/submit")) {
    submissions.push(route.request().postDataJSON());
    return route.fulfill({
      status: rejectForm ? 503 : 201,
      json: rejectForm
        ? { error: "Try again" }
        : { ok: true, submission_id: crypto.randomUUID() },
    });
  }
  return route.abort();
});
const page = await context.newPage();
page.on("pageerror", (e) => results.pageErrors.push(e.message));
await page.goto(base + "/?utm_campaign=portal-verification&utm_source=qa", {
  waitUntil: "networkidle",
});
await check(
  "Pending consent sends no events or analytics identifiers",
  async () => {
    assert.equal(batches.length, 0);
    assert.equal(
      await page.evaluate(() =>
        Object.keys(localStorage).some((k) => k.startsWith("ingenium_v2:")),
      ),
      false,
    );
    assert.equal(
      await page.evaluate(() =>
        sessionStorage.getItem("attic-public-enquiry-attribution"),
      ),
      null,
    );
  },
);
await page
  .getByRole("button", { name: "Decline analytics", exact: true })
  .click();
await check("Declined consent keeps analytics off", async () => {
  await page.evaluate(() => window.IngeniumSite?.flush());
  assert.equal(batches.length, 0);
});
await page
  .getByRole("button", { name: "Cookie preferences", exact: true })
  .click();
await page
  .getByRole("button", { name: "Allow analytics", exact: true })
  .click();
await page.waitForFunction(() => window.IngeniumSite?.context()?.visitor_id);
await page.evaluate(() => window.IngeniumSite.flush());
await check(
  "Accepted consent sends V2 page view without query strings or personal fields",
  async () => {
    assert.ok(batches.length);
    const events = batches.flatMap((b) => b.events);
    assert.ok(events.some((e) => e.event_type === "page_view"));
    assert.ok(events.every((e) => !e.page_url.includes("?")));
    assert.ok(batches.every((b) => b.analytics_consent === true));
  },
);
await page.locator('.site-footer nav a[href="/classes"]').click();
await page.waitForURL("**/classes");
await page.waitForTimeout(350);
await page.evaluate(() => window.IngeniumSite.flush());
await check("SPA navigation records the new route once", async () => {
  assert.equal(
    batches
      .flatMap((b) => b.events)
      .filter(
        (e) => e.event_type === "page_view" && e.page_url.endsWith("/classes"),
      ).length,
    1,
  );
});
await page
  .getByRole("button", { name: "Cookie preferences", exact: true })
  .click();
await page
  .getByRole("button", { name: "Decline analytics", exact: true })
  .click();
await page.waitForTimeout(100);
const count = batches.length;
await page.evaluate(() => {
  window.IngeniumSite.track("should_not_be_sent");
  return window.IngeniumSite.flush();
});
await check(
  "Withdrawal stops events and clears identifiers and campaign storage",
  async () => {
    assert.equal(batches.length, count);
    assert.equal(
      await page.evaluate(() =>
        Object.keys(localStorage).some((k) => k.startsWith("ingenium_v2:")),
      ),
      false,
    );
    assert.equal(
      await page.evaluate(() =>
        sessionStorage.getItem("attic-public-enquiry-attribution"),
      ),
      null,
    );
  },
);
await page.goto(base + "/#trial-form", { waitUntil: "networkidle" });
await page.getByRole("button", { name: /New to jiu jitsu/ }).click();
await page.getByRole("button", { name: "Continue", exact: true }).click();
await check(
  "Invalid contact details stay on details page without submitting",
  async () => {
    assert.equal(await page.locator('[name="email"]').isVisible(), true);
    assert.equal(submissions.length, 0);
  },
);
await page.locator('[name="first_name"]').fill("Integration");
await page.locator('[name="last_name"]').fill("Verification");
await page.locator('[name="email"]').fill("attic-portal-check@example.invalid");
await page.getByRole("button", { name: "Continue", exact: true }).click();
await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
await check(
  "Required privacy and accuracy choices block an unconsented submit",
  async () => {
    assert.equal(submissions.length, 0);
  },
);
await page.locator('[name="privacy_consent"]').check();
await page.locator('[name="accuracy_confirmation"]').check();
await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
await page.waitForFunction(() =>
  document.querySelector(".form-feedback")?.textContent.includes("couldn’t"),
);
await check("A failed receipt preserves answers", async () => {
  assert.equal(
    await page.locator('[name="email"]').inputValue(),
    "attic-portal-check@example.invalid",
  );
  assert.equal(
    await page.locator('[name="privacy_consent"]').isChecked(),
    true,
  );
});
rejectForm = false;
await page
  .getByRole("button", { name: "Send enquiry", exact: true })
  .dblclick()
  .catch(() => {});
await page
  .getByRole("heading", { name: "Thanks for getting in touch.", exact: true })
  .waitFor();
await check(
  "Accepted receipt alone shows success and a double click creates one retry",
  async () => {
    assert.equal(submissions.length, 2);
    const fields = submissions[1].fields;
    assert.equal(fields.privacy_consent, true);
    assert.equal(fields.accuracy_confirmation, true);
    assert.equal(fields.marketing_consent, false);
    assert.ok(fields.message.includes("Adult beginner"));
    assert.equal(fields.utm_Campaign, undefined);
  },
);
await check("Public form is independent of the optional tracker", async () => {
  assert.equal(await page.evaluate(() => !!window.IngeniumTracker), false);
});
const preview = await context.newPage();
await preview.goto(base + "/?__ingenium_editor=1", {
  waitUntil: "networkidle",
});
await check(
  "Editor bootstrap suppresses tracking and uses private noindex framing",
  async () => {
    assert.equal(
      await preview.locator('script[src*="ingenium-site-v2"]').count(),
      0,
    );
    const response = await context.request.get(base + "/?__ingenium_editor=1");
    assert.match(response.headers()["x-robots-tag"], /noindex/);
    assert.match(response.headers()["cache-control"], /no-store/);
    assert.match(
      response.headers()["content-security-policy"],
      /portal\.ingeniumconsulting\.net/,
    );
  },
);
await check("Unsigned editor and SEO deliveries are rejected", async () => {
  assert.equal(
    (
      await context.request.post(base + "/api/ingenium/editor", { data: {} })
    ).status(),
    401,
  );
  const r = await context.request.post(base + "/api/ingenium/seo", {
    data: {},
  });
  assert.ok([401, 503].includes(r.status()));
});
for (const width of [320, 390, 1440]) {
  await page.setViewportSize({ width, height: 900 });
  for (const route of [
    "/",
    "/classes",
    "/memberships",
    "/about-us",
    "/gallery",
    "/privacy-policy",
  ]) {
    await page.goto(base + route, { waitUntil: "networkidle" });
    await check(
      `Public route ${route} at ${width}px retains a single heading and fits viewport`,
      async () => {
        assert.equal(await page.locator("h1").count(), 1);
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
        );
      },
    );
  }
}
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto(base, { waitUntil: "networkidle" });
await fs.mkdir("docs/portal", { recursive: true });
await page.screenshot({
  path: "docs/portal/production-desktop.png",
  fullPage: true,
});
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({
  path: "docs/portal/production-mobile.png",
  fullPage: true,
});
await browser.close();
await fs.writeFile(
  "docs/portal/browser-verification.json",
  JSON.stringify(results, null, 2),
);
console.log(JSON.stringify(results, null, 2));
if (results.failures.length || results.pageErrors.length) process.exitCode = 1;
