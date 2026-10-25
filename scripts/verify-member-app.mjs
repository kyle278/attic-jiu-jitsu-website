// Isolated browser acceptance. API replies are synthetic; no emails or live bookings.
import { createRequire } from "node:module";
import path from "node:path";
import fs from "node:fs/promises";
import assert from "node:assert/strict";
const require = createRequire(
  path.join(
    process.env.CODEX_NODE_MODULES ||
      path.join(
        process.env.USERPROFILE,
        ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules",
      ),
    "package.json",
  ),
);
const { chromium } = require("playwright");
const base = process.env.MEMBER_REVIEW_URL || "http://localhost:3314";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname))
  throw Error("Only isolated local acceptance is supported.");
const output = path.join(process.env.TEMP || "/tmp", "attic-member-app-review");
await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath:
    process.env.MEMBER_REVIEW_BROWSER ||
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
});
const errors = [],
  checks = [];
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      serviceWorkers: "block",
    });
    const page = await context.newPage();
    page.on("pageerror", (e) => errors.push(e.message));
    let signedIn = false,
      booked = false,
      cancelled = false,
      bookingKey = null,
      created = 0,
      ambiguous = true;
    const starts = new Date(Date.now() + 86400000);
    starts.setUTCHours(18, 0, 0, 0);
    const ends = new Date(starts.getTime() + 3600000),
      id = "00000000-0000-4000-8000-000000000001";
    const data = () => ({
      site_name: "Attic",
      member: { name: "Alex Member", email: "alex@example.invalid" },
      membership: {
        label: "Adult membership",
        service_ids: ["class"],
        weekly_limit: 2,
        starts_at: new Date(Date.now() - 86400000).toISOString(),
        ends_at: null,
        status: "active",
      },
      booking_window_hours: 72,
      classes: [
        {
          id: "class",
          name: "Gi · Mixed levels",
          description: "Technique and training.",
          requires_membership: true,
          requires_payment: false,
        },
      ],
      sessions: [
        {
          id,
          service_id: "class",
          starts_at: starts.toISOString(),
          ends_at: ends.toISOString(),
          location: "Attic Jiu Jitsu, Charlotte Street, Carlow",
          capacity: 24,
          remaining_spots: booked && !cancelled ? 23 : 24,
          coach: "Attic coaching team",
          price_required: false,
        },
      ],
      bookings: booked
        ? [
            {
              id: "reservation",
              session_id: id,
              status: cancelled ? "cancelled" : "confirmed",
              session_status: "scheduled",
              name: "Gi · Mixed levels",
              starts_at: starts.toISOString(),
              ends_at: ends.toISOString(),
              location: "Attic Jiu Jitsu, Charlotte Street, Carlow",
              cancel_before: new Date(starts.getTime() - 3600000).toISOString(),
              self_service: true,
            },
          ]
        : [],
    });
    await page.route("**/*", async (route) => {
      const url = new URL(route.request().url());
      if (url.origin !== base) return route.abort();
      if (url.pathname === "/members/api") {
        const body = route.request().postDataJSON();
        let status = 200,
          payload = { ok: true };
        if (body.action === "data") {
          status = signedIn ? 200 : 401;
          payload = signedIn ? data() : { error: "Sign in to continue." };
        }
        if (body.action === "request_code")
          payload = { ok: true, challenge: "synthetic-challenge" };
        if (body.action === "verify_code") {
          if (body.input.code === "12345678") signedIn = true;
          else {
            status = 401;
            payload = { error: "The code is invalid or expired." };
          }
        }
        if (body.action === "book") {
          const key = route.request().headers()["idempotency-key"];
          if (bookingKey)
            assert.equal(
              key,
              bookingKey,
              "Ambiguous retries retain their request key",
            );
          else bookingKey = key;
          if (!booked) {
            booked = true;
            created++;
          }
          if (ambiguous) {
            ambiguous = false;
            return route.abort("failed");
          }
        }
        if (body.action === "cancel") cancelled = true;
        if (body.action === "logout") signedIn = false;
        return route.fulfill({
          status,
          contentType: "application/json",
          body: JSON.stringify(payload),
        });
      }
      return route.continue();
    });
    await page.goto(base + "/members");
    await page.getByRole("heading", { name: "Welcome back" }).waitFor();
    assert.equal(
      await page.locator('script[src*="ingenium-tracker"]').count(),
      0,
    );
    assert.equal(
      await page.getByRole("link", { name: "Home", exact: true }).count(),
      0,
    );
    await page.screenshot({
      path: path.join(output, `login-${width}.png`),
      fullPage: true,
    });
    await page
      .getByLabel("Email address", { exact: true })
      .fill("alex@example.invalid");
    await page.getByRole("button", { name: "Continue with email" }).click();
    await page.getByLabel("Sign-in code", { exact: true }).fill("11111111");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page
      .getByRole("alert")
      .filter({ hasText: "The code is invalid" })
      .waitFor();
    await page.getByLabel("Sign-in code", { exact: true }).fill("12345678");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page.getByRole("heading", { name: "Find your next class" }).waitFor();
    checks.push(`private email code login at ${width}`);
    for (const section of ["timetable", "bookings", "membership", "account"]) {
      await page.goto(base + "/members/" + section);
      await page.getByRole("heading", { level: 1 }).waitFor();
      await page
        .getByText("Checking your secure session…")
        .waitFor({ state: "hidden" });
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${section} has no page overflow`,
      );
      assert.equal(await page.getByRole("tab").count(), 0);
      await page.screenshot({
        path: path.join(output, `${section}-${width}.png`),
        fullPage: true,
      });
      checks.push(`${section} layout at ${width}`);
    }
    await page.goto(base + "/members/timetable");
    await page.getByRole("button", { name: "Book class", exact: true }).click();
    await page
      .getByRole("button", { name: "Confirm booking", exact: true })
      .click();
    await page.getByRole("dialog").getByRole("alert").waitFor();
    await page
      .getByRole("button", { name: "Confirm booking", exact: true })
      .click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    await page
      .getByRole("status")
      .filter({ hasText: "You’re booked in" })
      .waitFor();
    assert.equal(created, 1);
    checks.push(`idempotent booking after network failure at ${width}`);
    await page.goto(base + "/members/bookings");
    await page
      .getByRole("button", { name: "Cancel booking", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Keep my booking", exact: true })
      .click();
    assert.equal(cancelled, false);
    await page
      .getByRole("button", { name: "Cancel booking", exact: true })
      .click();
    await page
      .getByRole("button", { name: "Confirm cancellation", exact: true })
      .click();
    await page.getByRole("dialog").waitFor({ state: "hidden" });
    assert.equal(cancelled, true);
    checks.push(`confirmed cancellation at ${width}`);
    await page.goto(base + "/members/account");
    await page
      .getByRole("button", { name: "Add to home screen" })
      .last()
      .click();
    await page.getByText(/On iPhone or iPad/).waitFor();
    await page.getByRole("button", { name: "Sign out of this device" }).click();
    await page.getByRole("heading", { name: "Welcome back" }).waitFor();
    checks.push(`install help and sign-out at ${width}`);
    await context.close();
  }
  assert.deepEqual(errors, []);
  await fs.writeFile(
    path.join(output, "results.json"),
    JSON.stringify({ checks, errors }, null, 2),
  );
  console.log(JSON.stringify({ passed: checks.length, errors, output }));
} finally {
  await browser.close();
}
