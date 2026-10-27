import { createRequire } from "node:module";
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import assert from "node:assert/strict";
const require = createRequire(
  path.join(
    process.env.USERPROFILE,
    ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/package.json",
  ),
);
const { chromium } = require("playwright");
const sharp = require("sharp");
const ts = require(
  path
    .resolve("node_modules/typescript/package.json")
    .replace("package.json", "lib/typescript.js"),
);
const round = process.argv[2] || "one";
const output = `docs/rebuild/screenshots/${round}`;
await fs.mkdir(output, { recursive: true });
const checks = [],
  failures = [],
  pageErrors = [],
  consoleErrors = [];
async function check(name, fn) {
  try {
    await fn();
    checks.push(name);
  } catch (error) {
    failures.push({ name, error: error.message });
  }
}
const baseline = JSON.parse(
  await fs.readFile("docs/rebuild/protected-before.json", "utf8"),
);
await check(
  "All protected booking/member/root files are byte-identical",
  async () => {
    for (const [file, hash] of Object.entries(baseline))
      assert.equal(
        crypto
          .createHash("sha256")
          .update(await fs.readFile(file))
          .digest("hex"),
        hash,
        file,
      );
  },
);
await check(
  "Dublin day grouping handles midnight in summer and winter",
  async () => {
    const source = await fs.readFile(
      "src/components/public-timetable.ts",
      "utf8",
    );
    const compiled = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText;
    const { carlowDayKey } = await import(
      `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
    );
    assert.equal(carlowDayKey("2026-07-12T23:30:00Z"), "2026-07-13");
    assert.equal(carlowDayKey("2026-12-12T23:30:00Z"), "2026-12-12");
  },
);
const browser = await chromium.launch({
  headless: true,
  executablePath:
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
});
const base = "http://localhost:3000";
async function context(options = {}) {
  const c = await browser.newContext({ serviceWorkers: "block", ...options });
  await c.route("**/*", (route) => {
    const host = new URL(route.request().url()).hostname;
    return ["localhost", "127.0.0.1"].includes(host)
      ? route.continue()
      : route.abort();
  });
  return c;
}
async function ready(page) {
  await page.evaluate(() => document.fonts.ready.then(() => true));
}
async function fit(page, name) {
  await check(name, async () =>
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      ),
      "Horizontal overflow",
    ),
  );
}
async function revealPhotos(page) {
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 750) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page
    .locator("img")
    .evaluateAll((imgs) =>
      Promise.all(
        imgs
          .filter((img) => img.complete)
          .map((img) => img.decode().catch(() => {})),
      ),
    );
}
try {
  for (const width of [1440, 390]) {
    const c = await context({ viewport: { width, height: 960 } });
    const page = await c.newPage();
    page.on("pageerror", (error) => pageErrors.push(error.message));
    page.on("console", (msg) => {
      if (msg.type() === "error" && !/Failed to load resource/.test(msg.text()))
        consoleErrors.push(msg.text());
    });
    for (const [slug, name] of [
      ["/", "home"],
      ["/classes", "classes"],
      ["/memberships", "memberships"],
      ["/about-us", "about"],
      ["/gallery", "gallery"],
      ["/privacy-policy", "privacy"],
    ]) {
      await check(
        `${name} ${width}: successful response and one h1`,
        async () => {
          const response = await page.goto(base + slug, {
            waitUntil: "networkidle",
          });
          assert.equal(response.status(), 200);
          await ready(page);
          assert.equal(await page.locator("h1").count(), 1);
        },
      );
      await fit(page, `${name} ${width}: no overflow`);
      await check(`${name} ${width}: no bright reading sections`, async () =>
        assert.ok(
          await page.locator(".section-chalk").evaluateAll((els) =>
            els.every((el) => {
              const rgb = getComputedStyle(el)
                .backgroundColor.match(/\d+/g)
                ?.map(Number);
              return rgb && rgb.slice(0, 3).every((n) => n < 80);
            }),
          ),
        ),
      );
      await revealPhotos(page);
      await page.screenshot({
        path: `${output}/${name}-${width}.png`,
        fullPage: true,
      });
      await check(`${name} ${width}: images load`, async () =>
        assert.equal(
          await page
            .locator("img")
            .evaluateAll(
              (imgs) =>
                imgs
                  .filter((i) => i.loading !== "lazy" || i.complete)
                  .filter((i) => !i.complete || i.naturalWidth === 0).length,
            ),
          0,
        ),
      );
      if (name === "home") {
        await page.screenshot({ path: `${output}/hero-${width}.png` });
        await check(
          `Hero ${width}: full width and primary action visible`,
          async () => {
            const image = await page.locator(".hero-parallax").boundingBox();
            assert.ok(image.width >= width - 2);
            const action = await page
              .locator(".hero-actions .button-primary")
              .boundingBox();
            assert.ok(action.y + action.height < 960);
          },
        );
        await check(
          `Hero ${width}: manual carousel changes photo`,
          async () => {
            await page
              .getByRole("button", { name: "Pause", exact: true })
              .click();
            await page.getByRole("button", { name: /^Show photo 1:/ }).click();
            await page
              .getByRole("button", { name: "Next", exact: true })
              .click();
            assert.equal(
              await page
                .locator('.carousel-dots button[aria-pressed="true"]')
                .innerText(),
              "02",
            );
            assert.equal(
              await page
                .locator(".hero-slide.is-active img")
                .evaluate((el) => getComputedStyle(el).animationPlayState),
              "paused",
            );
            const transform = await page
              .locator(".hero-slide.is-active img")
              .evaluate((el) => getComputedStyle(el).transform);
            await page.waitForTimeout(300);
            assert.equal(
              await page
                .locator(".hero-slide.is-active img")
                .evaluate((el) => getComputedStyle(el).transform),
              transform,
            );
            await page.waitForTimeout(800);
            await page.screenshot({ path: `${output}/hero-${width}.png` });
          },
        );
        await check(`FAQ ${width}: keyboard opening`, async () => {
          const summary = page.locator(".faq-list summary").first();
          await summary.focus();
          await page.keyboard.press("Enter");
          assert.equal(
            await summary.evaluate((el) => el.parentElement.open),
            true,
          );
        });
      }
      if (name === "gallery") {
        await check(
          `Gallery ${width}: full image, next, Escape and focus return`,
          async () => {
            const trigger = page.getByRole("link", {
              name: "Open photo: Working through the details",
            });
            await trigger.click();
            assert.equal(
              await page.locator("dialog").evaluate((el) => el.open),
              true,
            );
            await page.keyboard.press("ArrowRight");
            assert.match(
              await page.locator(".dialog-top p").innerText(),
              /^2 \/ 12/,
            );
            await page.keyboard.press("Escape");
            assert.equal(
              await page.locator("dialog").evaluate((el) => el.open),
              false,
            );
            assert.equal(
              await trigger.evaluate((el) => el === document.activeElement),
              true,
            );
          },
        );
      }
    }
    await page.goto(
      base + "/?utm_source=local-review&utm_campaign=beginner-test",
      { waitUntil: "networkidle" },
    );
    await check(
      `Attribution ${width}: same-path partial campaign preserves original source`,
      async () => {
        await page.evaluate(() =>
          history.pushState(null, "", "/?utm_medium=social"),
        );
        await page.waitForFunction(
          () =>
            JSON.parse(
              sessionStorage.getItem("attic-public-enquiry-attribution") ||
                "{}",
            ).utm_Medium === "social",
        );
        const campaign = await page.evaluate(() =>
          JSON.parse(
            sessionStorage.getItem("attic-public-enquiry-attribution"),
          ),
        );
        assert.equal(campaign.utm_Source, "local-review");
        assert.equal(campaign.utm_Campaign, "beginner-test");
      },
    );
    if (width === 1440) {
      await page
        .locator(".desktop-nav")
        .getByRole("link", { name: "Classes", exact: true })
        .click();
      await page
        .locator(".desktop-nav")
        .getByRole("link", { name: "Memberships", exact: true })
        .click();
      await page.locator(".plan-row").first().getByRole("link").click();
    }
    await check(
      `Form ${width}: deliberate choice, data persistence and payload`,
      async () => {
        await page.getByRole("button", { name: /New to jiu jitsu/ }).click();
        await page
          .getByRole("button", { name: "Continue", exact: true })
          .click();
        assert.ok(
          await page
            .getByText("Enter your first name.", { exact: true })
            .isVisible(),
        );
        await page.getByLabel("First name *", { exact: true }).fill("É");
        await page
          .getByLabel("Last name *", { exact: true })
          .fill("O’Neill Murphy");
        await page
          .getByLabel("Email *", { exact: true })
          .fill("review@example.invalid");
        await page
          .getByRole("button", { name: "Continue", exact: true })
          .click();
        assert.ok(
          await page
            .getByRole("heading", { name: "Your privacy. Your choice." })
            .isVisible(),
        );
        const names = await page
          .locator("#trial-form")
          .evaluate((form) => Object.fromEntries(new FormData(form)));
        assert.equal(names.first_name, "É");
        assert.equal(names.last_name, "O’Neill Murphy");
        assert.equal(names.email, "review@example.invalid");
        assert.match(names.message, /Training interest: Adult beginner/);
        assert.equal(names.utm_Source, "local-review");
        assert.equal(names.utm_Campaign, "beginner-test");
        assert.equal(names.utm_Medium, "social");
        if (width === 1440)
          assert.match(names.message, /I’d like to ask about/);
        assert.equal(
          await page.locator('[name="privacy_consent"]').isChecked(),
          false,
        );
        assert.equal(
          await page.locator('[name="marketing_consent"]').isChecked(),
          false,
        );
        await page.getByRole("button", { name: "Back", exact: true }).click();
        assert.equal(
          await page.getByLabel("Email *", { exact: true }).inputValue(),
          "review@example.invalid",
        );
        await page
          .getByRole("button", { name: "Continue", exact: true })
          .click();
        const popupPromise = c.waitForEvent("page");
        await page
          .getByRole("link", { name: "Read the privacy policy", exact: true })
          .click();
        const policy = await popupPromise;
        await policy.waitForLoadState("domcontentloaded");
        assert.match(policy.url(), /privacy-policy/);
        await policy.close();
        assert.equal(
          await page.locator('[name="privacy_consent"]').isChecked(),
          false,
        );
        await page
          .getByRole("button", { name: "Send enquiry", exact: true })
          .click();
        assert.match(
          await page.getByRole("status").innerText(),
          /acknowledge the privacy policy/,
        );
        await page.locator(".consent-card").first().locator("label").click();
        assert.equal(
          await page.locator('[name="privacy_consent"]').isChecked(),
          true,
        );
        assert.equal(
          await page.locator('[name="marketing_consent"]').isChecked(),
          false,
        );
        await page.locator('[name="accuracy_confirmation"]').check();
        await page.screenshot({ path: `${output}/form-consent-${width}.png` });
        await page.evaluate(() => {
          window.IngeniumTracker = { init: () => {} };
          const form = document.querySelector("#trial-form");
          window.__reviewSubmissions = 0;
          form.addEventListener("submit", (event) => {
            event.preventDefault();
            window.__reviewSubmissions++;
            form.dispatchEvent(new CustomEvent("ingenium:form-submitting"));
            setTimeout(
              () =>
                form.dispatchEvent(
                  new CustomEvent("ingenium:form-error", {
                    detail: {
                      message:
                        "Isolated review error. Your answers are retained.",
                    },
                  }),
                ),
              20,
            );
          });
        });
        await page
          .getByRole("button", { name: "Send enquiry", exact: true })
          .click();
        await page.waitForTimeout(60);
        assert.match(
          await page.getByRole("status").innerText(),
          /Isolated review error/,
        );
        assert.equal(
          await page.locator('[name="email"]').inputValue(),
          "review@example.invalid",
        );
        await page.evaluate(() =>
          document
            .querySelector("#trial-form")
            .dispatchEvent(new CustomEvent("ingenium:form-success")),
        );
        assert.match(
          await page.getByRole("status").innerText(),
          /does not reserve/,
        );
        assert.ok(
          await page
            .getByRole("heading", { name: "Thanks for getting in touch." })
            .isVisible(),
        );
        assert.equal(
          await page
            .locator(".form-receipt h3")
            .evaluate((el) => el === document.activeElement),
          true,
        );
        await page
          .getByRole("button", { name: "Send another enquiry", exact: true })
          .click();
        assert.ok(
          await page
            .getByRole("button", { name: /New to jiu jitsu/ })
            .isVisible(),
        );
      },
    );
    await check(`Public to Members ${width}: unchanged pixels`, async () => {
      await c.route("**/members/api", (route) =>
        route.fulfill({
          status: 503,
          contentType: "application/json",
          body: JSON.stringify({
            error: "Member access is being set up. Please contact the academy.",
          }),
        }),
      );
      await page
        .locator(".header-actions")
        .getByRole("link", { name: "Members", exact: true })
        .click();
      await page.waitForURL("**/members");
      await page.waitForLoadState("networkidle");
      await ready(page);
      await page
        .getByText("We couldn’t load your member app", { exact: true })
        .waitFor();
      await page.screenshot({ path: `${output}/members-${width}.png` });
      const before = await sharp(
        `docs/rebuild/screenshots/members-before-${width}.png`,
      )
        .extract({ left: 0, top: 0, width, height: 880 })
        .raw()
        .toBuffer();
      const after = await sharp(`${output}/members-${width}.png`)
        .extract({ left: 0, top: 0, width, height: 880 })
        .raw()
        .toBuffer();
      assert.equal(
        Buffer.compare(before, after),
        0,
        "Member screenshot differs after public navigation",
      );
      await page.goBack({ waitUntil: "networkidle" });
      assert.ok(await page.locator(".website-shell").isVisible());
    });
    await c.close();
  }
  const small = await context({
    viewport: { width: 375, height: 667 },
    reducedMotion: "reduce",
  });
  const sp = await small.newPage();
  await sp.goto(base, { waitUntil: "networkidle" });
  await check("Reduced motion: no autoplay and no hero animation", async () => {
    assert.ok(
      await sp.getByText("Manual playback", { exact: true }).isVisible(),
    );
    assert.equal(
      await sp
        .locator(".hero-slide.is-active img")
        .evaluate((el) => getComputedStyle(el).animationName),
      "none",
    );
  });
  await check(
    "Unpublished plan query is not presented as a current plan",
    async () => {
      await sp.goto(base + "/?plan=Unpublished%20plan", {
        waitUntil: "networkidle",
      });
      assert.equal(await sp.locator('[name="message"]').inputValue(), "");
    },
  );
  await sp.locator("#trial-form").scrollIntoViewIfNeeded();
  await sp.screenshot({ path: `${output}/form-interest-short-mobile.png` });
  for (const name of ["Kids & teens", "Something else", "Already training"])
    await check(
      `Form route ${name}: Back preserves choice without auto-advance`,
      async () => {
        await sp.getByRole("button", { name: new RegExp(name) }).click();
        assert.ok(
          await sp
            .getByRole("heading", { name: "How can we reach you?" })
            .isVisible(),
        );
        await sp.getByRole("button", { name: "Back", exact: true }).click();
        assert.ok(
          await sp
            .getByRole("heading", { name: "Where do you want to start?" })
            .isVisible(),
        );
      },
    );
  await small.close();
  const nojs = await context({
    viewport: { width: 390, height: 844 },
    javaScriptEnabled: false,
  });
  const np = await nojs.newPage();
  await np.goto(base, { waitUntil: "networkidle" });
  await check("No JavaScript: native mobile menu works", async () => {
    await np.locator(".mobile-menu summary").click();
    assert.ok(
      await np
        .getByRole("navigation", { name: "Mobile navigation" })
        .getByRole("link", { name: "Classes", exact: true })
        .isVisible(),
    );
    assert.ok(
      await np
        .locator(".header-actions")
        .getByRole("link", { name: "Members", exact: true })
        .isVisible(),
    );
  });
  await nojs.close();
  const edge = await context({ viewport: { width: 320, height: 740 } });
  const ep = await edge.newPage();
  for (const slug of ["/", "/memberships", "/classes"]) {
    await ep.goto(base + slug, { waitUntil: "networkidle" });
    await fit(ep, `320px ${slug}: no overflow`);
  }
  await ep.setViewportSize({ width: 1366, height: 768 });
  await ep.goto(base, { waitUntil: "networkidle" });
  await check("1366x768 hero action fits", async () => {
    const box = await ep.locator(".hero-actions .button-primary").boundingBox();
    assert.ok(box.y + box.height < 768);
  });
  await edge.close();
  await check("No React runtime errors", async () =>
    assert.deepEqual(pageErrors, []),
  );
  await check("No React script/hydration console warnings", async () =>
    assert.deepEqual(consoleErrors, []),
  );
} catch (error) {
  failures.push({ name: "Browser harness execution", error: error.stack });
} finally {
  await browser.close();
}
await fs.writeFile(
  `docs/rebuild/verification-${round}.json`,
  JSON.stringify(
    {
      round,
      checks,
      failures,
      pageErrors,
      consoleErrors,
      protectedFiles: Object.keys(baseline).length,
      transport:
        "Isolated mocked events only; no live lead or booking was sent.",
    },
    null,
    2,
  ),
);
console.log(
  JSON.stringify({
    round,
    passed: checks.length,
    failures,
    pageErrors,
    consoleErrors,
  }),
);
if (failures.length) process.exitCode = 1;
