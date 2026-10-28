// Read-only acceptance against the local site; external browser requests are blocked.
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";

const dependencyRoot = process.env.CODEX_NODE_MODULES || path.join(process.env.USERPROFILE, ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules");
const { chromium } = createRequire(path.join(dependencyRoot, "package.json"))("playwright");
const base = process.env.SEO_REVIEW_URL || "http://localhost:3320";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(base).hostname), "Use an isolated local server");
const origin = "https://attic-jiu-jitsu-website.vercel.app";
const output = path.join("docs", "seo");
await fs.mkdir(path.join(output, "screenshots"), { recursive: true });
const browser = await chromium.launch({ headless: true, executablePath: "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" });
const checks = [], failures = [], pages = [], pageErrors = [];
async function check(name, fn) {
  try { await fn(); checks.push(name); } catch (error) { failures.push({ name, error: error.message }); }
}

try {
  const sitemapResponse = await fetch(`${base}/sitemap.xml`);
  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
    const url = new URL(match[1]);
    assert.equal(url.origin, origin);
    return url.pathname;
  });
  await check("Sitemap enumerates the public site and current published articles without private endpoints", async () => {
    assert.ok(paths.length >= 18, "Expected the core public pages and enabled guide index");
    assert.equal(new Set(paths).size, paths.length);
    assert.ok(!paths.some((entry) => /^\/(members(?:\/|$)|api(?:\/|$))/.test(entry)));
    assert.ok(!sitemap.includes(new Date().toISOString().slice(0, 19)), "Do not fabricate fresh lastmod timestamps");
  });
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 1440, height: 1000 } });
  await context.route("**/*", (route) => ["localhost", "127.0.0.1"].includes(new URL(route.request().url()).hostname) ? route.continue() : route.abort());
  for (let offset = 0; offset < paths.length; offset += 4) {
    await Promise.all(paths.slice(offset, offset + 4).map(async (route) => {
      const page = await context.newPage();
      try {
        const response = await page.goto(base + route, { waitUntil: "domcontentloaded", timeout: 60000 });
        await check(`${route}: renders accessible server content and metadata without JavaScript`, async () => {
          assert.equal(response.status(), 200);
          assert.equal(await page.locator("h1").count(), 1);
          const title = await page.title();
          assert.ok(title.length > 15 && title.length <= 70, `Title length ${title.length}: ${title}`);
          const description = await page.locator('meta[name="description"]').getAttribute("content");
          assert.ok(description.length > 65 && description.length <= 190, `Description length ${description.length}`);
          assert.equal(new URL(await page.locator('link[rel="canonical"]').getAttribute("href")).href, new URL(route, origin).href);
          const robotsMeta = await page.evaluate(() => document.querySelector('meta[name="robots"]')?.getAttribute("content") || "");
          assert.ok(!robotsMeta.includes("noindex"));
          assert.equal(new URL(await page.locator('meta[property="og:url"]').getAttribute("content")).href, new URL(route, origin).href);
          assert.equal(await page.locator('meta[property="og:title"]').getAttribute("content"), title);
          assert.equal(await page.locator('meta[name="twitter:title"]').getAttribute("content"), title);
          assert.equal(await page.locator("html").getAttribute("lang"), "en-IE");
          const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
          const nodes = schemas.flatMap((text) => { const parsed = JSON.parse(text); return Array.isArray(parsed) ? parsed : [parsed]; });
          assert.equal(nodes.filter((node) => node["@type"] === "SportsActivityLocation").length, 1);
          const article = route.startsWith("/blog/");
          if (article) {
            assert.equal(nodes.filter((node) => node["@type"] === "BlogPosting").length, 1);
            assert.ok((await page.locator("main").innerText()).split(/\s+/).length >= 350);
            assert.equal(await page.locator('meta[property="og:type"]').getAttribute("content"), "article");
          }
          if (route === "/blog") assert.ok(nodes.some((node) => node["@type"] === "CollectionPage"));
          const links = await page.locator('a[href^="/"]').evaluateAll((entries) => entries.map((entry) => entry.getAttribute("href")));
          pages.push({ route, title, description, words: (await page.locator("main").innerText()).split(/\s+/).length, schemas: nodes.map((node) => node["@type"]), links: [...new Set(links)] });
          console.log(`Checked ${route}`);
        });
      } catch (error) { failures.push({ name: route, error: error.message }); } finally { await page.close(); }
    }));
  }
  await check("Public internal links point to sitemap routes or the private member app", async () => {
    for (const entry of pages) for (const href of entry.links) {
      const target = new URL(href, origin).pathname;
      if (target.startsWith("/images/")) {
        assert.equal((await fetch(base + target)).status, 200, `Missing gallery asset ${target}`);
      } else if (/^\/blog\/(?:category|tag|author|page)\//.test(target) || target === "/blog/feed.xml") {
        assert.equal((await fetch(base + target)).status, 200, `${entry.route} links to unavailable Blog discovery ${target}`);
      } else {
        assert.ok(paths.includes(target) || /^\/members(?:\/|$)/.test(target), `${entry.route} links to ${target}`);
      }
    }
  });
  await check("Every sitemap page is reachable from home within three clicks", async () => {
    const seen = new Set(["/"]);
    for (let depth = 0; depth < 3; depth++) for (const page of pages.filter((page) => seen.has(page.route))) for (const href of page.links) seen.add(new URL(href, origin).pathname);
    for (const route of paths) assert.ok(seen.has(route), `Orphan: ${route}`);
    assert.equal(new Set(pages.map((entry) => entry.title)).size, paths.length, "Titles must be unique");
    assert.equal(new Set(pages.map((entry) => entry.description)).size, paths.length, "Descriptions must be unique");
  });
  const robots = await (await fetch(`${base}/robots.txt`)).text();
  await check("Robots protects members and API while allowing memberships and public content", async () => {
    assert.ok(robots.includes("Disallow: /members$") && robots.includes("Disallow: /members/"));
    assert.ok(robots.includes("Disallow: /api/"));
    assert.ok(!robots.split("\n").some((line) => line.trim() === "Disallow: /members"));
    assert.ok(robots.includes(`Sitemap: ${origin}/sitemap.xml`));
  });
  await context.close();
  const interactive = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  await interactive.route("**/*", (route) => ["localhost", "127.0.0.1"].includes(new URL(route.request().url()).hostname) ? route.continue() : route.abort());
  const page = await interactive.newPage();
  page.on("pageerror", (error) => pageErrors.push(error.message));
  for (const width of [320, 390, 1100, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of ["/", "/blog", "/fitness-classes-carlow", "/blog/fitness-for-women-over-40", "/athy", "/family-martial-arts-carlow"]) {
      await page.goto(base + route, { waitUntil: "networkidle", timeout: 60000 });
      const decline = page.getByRole("button", { name: "Decline analytics", exact: true });
      if (await decline.count()) await decline.click();
      await check(`${route} at ${width}px: no horizontal overflow`, async () => {
        const sizes = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, viewport: innerWidth }));
        assert.ok(sizes.scroll <= sizes.viewport + 1, JSON.stringify(sizes));
      });
      if ((width === 390 || width === 1440) && ["/", "/blog", "/fitness-classes-carlow", "/blog/fitness-for-women-over-40"].includes(route)) {
        await page.evaluate(async () => {
          await Promise.all([...document.images].map(async (image) => {
            image.loading = "eager";
            try { await image.decode(); } catch { /* The route checks cover asset responses separately. */ }
          }));
        });
        await page.screenshot({ path: path.join(output, "screenshots", `${route === "/" ? "home" : route.slice(1).replaceAll("/", "-")}-${width}.png`), fullPage: true });
      }
    }
  }
  await check("Article contents navigation and contact link work", async () => {
    await page.goto(`${base}/blog/fitness-for-men-over-40`, { waitUntil: "networkidle" });
    const anchor = page.locator(".content-toc").getByRole("link", { name: "Consider a group if training alone does not stick.", exact: true });
    const href = await anchor.getAttribute("href");
    await anchor.click();
    assert.ok(page.url().endsWith(href));
    assert.equal(await page.locator(href).count(), 1);
    const contact = page.locator(".content-actions").getByRole("link", { name: "Ask about getting started", exact: true });
    assert.equal(await contact.getAttribute("href"), "/#trial-form");
    await contact.click();
    await page.waitForURL(`${base}/#trial-form`);
    assert.equal(await page.locator("#trial-form").count(), 1);
  });
  await check("Preview pages and member app stay out of the index", async () => {
    const preview = await page.goto(`${base}/blog/how-to-get-fit-over-40?__ingenium_editor=1`, { waitUntil: "domcontentloaded" });
    assert.ok(preview.headers()["x-robots-tag"].includes("noindex"));
    assert.ok((await page.locator('meta[name="robots"]').getAttribute("content")).includes("noindex"));
    const members = await page.goto(`${base}/members`, { waitUntil: "domcontentloaded" });
    assert.ok(members.headers()["x-robots-tag"].includes("noindex"));
  });
  await check("Unknown landing pages and articles return real 404 status", async () => {
    for (const route of ["/not-a-real-programme", "/blog/not-a-real-guide"]) {
      const response = await fetch(base + route, { headers: { "user-agent": "Googlebot" } });
      assert.equal(response.status, 404, route);
    }
  });
  await check("No client exceptions during navigation", async () => assert.deepEqual(pageErrors, []));
  await interactive.close();
} finally {
  await browser.close();
  const report = { checkedAt: new Date().toISOString(), base, checks, failures, pages };
  await fs.writeFile(path.join(output, "verification.json"), JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify({ checks: checks.length, failures, pages: pages.map(({ route, title, words }) => ({ route, title, words })) }, null, 2));
  if (failures.length) process.exitCode = 1;
}
