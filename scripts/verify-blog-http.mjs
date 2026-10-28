// Isolated HTTP lifecycle checks against a local server using verify-blog-fixture.mjs.
// This does not publish articles or claim Portal-side lifecycle verification.
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import { createHmac } from "node:crypto";

const base = process.env.BLOG_REVIEW_URL || "http://localhost:3330";
assert.ok(["localhost", "127.0.0.1"].includes(new URL(base).hostname));
const source = JSON.parse(await fs.readFile("docs/blog/migration-source.json", "utf8"));
const stateFile = "docs/blog/fixture-state.json";
const key = "blog_" + "d".repeat(32);
const secret = "isolated-fixture-secret-" + "e".repeat(40);
const checks = [], failures = [];
const escape = (text) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#x27;");
const decode = (text = "") => text.replaceAll("&amp;", "&").replaceAll("&#x27;", "'").replaceAll("&quot;", '"');
async function state(mode = "live", generation = 8) { await fs.writeFile(stateFile, JSON.stringify({ mode, generation })); }
async function page(path, init = {}) {
  const response = await fetch(base + path, { headers: { "user-agent": "Twitterbot", ...init.headers }, redirect: "manual", signal: AbortSignal.timeout(45000), ...init });
  return { response, html: await response.text() };
}
async function check(name, fn) { try { await fn(); checks.push(name); console.log(`Passed: ${name}`); } catch (error) { failures.push({ name, error: error.message }); } }
function schemas(html) { return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((match) => JSON.parse(match[1])); }
async function refresh(generation, options = {}) {
  const timestamp = options.timestamp || String(Date.now());
  const event = { type: "blog.release", api_version: 1, site_key: options.key || key, environment: options.environment || "production", release_id: "33333333-3333-4333-8333-333333333333", generation, kind: "publish", post_id: null, revision_id: null, paths: ["/blog"] };
  const raw = JSON.stringify(event);
  const signature = createHmac("sha256", secret).update(`${timestamp}.${raw}`).digest("hex");
  return fetch(`${base}/api/ingenium/blog`, { method: "POST", body: raw, headers: { "Content-Type": "application/json", "X-Ingenium-Timestamp": timestamp, "X-Ingenium-Signature": options.badSignature ? "0".repeat(64) : signature } });
}
try {
  await state();
  for (const original of source.posts) await check(`${original.path}: original URL, complete server HTML, SEO and immutable revision`, async () => {
    const { response, html } = await page(original.path);
    assert.equal(response.status, 200);
    assert.equal(decode(html.match(/<title>([^<]+)<\/title>/)?.[1]), original.seoTitle);
    assert.ok(html.includes(escape(original.title)));
    assert.equal([...html.matchAll(/<h1(?:>|\s)/g)].length, 1);
    for (const paragraph of original.sourceParagraphs) assert.ok(html.includes(escape(paragraph)), paragraph.slice(0, 70));
    for (const link of original.sourceLinks) assert.ok(html.includes(`href="${escape(link.href)}"`), link.href);
    const nodes = schemas(html);
    assert.equal(nodes.filter((node) => node["@type"] === "BlogPosting").length, 1);
    assert.equal(nodes.filter((node) => node["@type"] === "BreadcrumbList").length, 1);
    assert.ok(/data-blog-revision="[a-f0-9-]{36}"/.test(html));
    assert.ok(html.includes(`href="https://attic-jiu-jitsu-website.vercel.app${original.path}"`));
    assert.ok(!html.includes('name="ingenium-seo-revision"'));
    assert.equal(response.headers.get("cache-control").includes("no-store"), true);
  });
  await check("Index, RSS and sitemap enumerate the published article set", async () => {
    for (const path of ["/blog", "/blog/feed.xml", "/sitemap.xml"]) {
      const { response, html } = await page(path);
      assert.equal(response.status, 200, path);
      for (const original of source.posts) assert.ok(html.includes(original.path), `${path}: ${original.path}`);
      if (path === "/blog") assert.ok(html.includes('data-blog-generation="8"'));
    }
  });
  await check("Search and author/category archives use engine results and indexing settings", async () => {
    const search = await page("/blog/search?q=women");
    assert.equal(search.response.status, 200);
    assert.ok(search.html.includes("Getting fit over 40 for women."));
    assert.ok(search.response.headers.get("x-robots-tag").includes("noindex"));
    for (const path of ["/blog/category/fitness", "/blog/author/attic-jiu-jitsu"]) assert.equal((await page(path)).response.status, 200);
    assert.equal((await page("/blog/category/missing")).response.status, 404);
  });
  await check("Unknown paths, malformed pagination and unowned namespace return correct status", async () => {
    for (const path of ["/blog/not-real", "/blog/page/0", "/blog/page/99", "/blog/category", "/blog/extra/path", "/blogger"]) assert.equal((await page(path)).response.status, 404, path);
    const firstPage = await page("/blog/page/1");
    assert.equal(firstPage.response.status, 308);
    assert.ok(firstPage.response.headers.get("location").endsWith("/blog"));
  });
  await check("New published slugs work without rebuilding the website", async () => {
    await state("new-slug", 9);
    const result = await page("/blog/new-guide-after-deployment");
    assert.equal(result.response.status, 200);
    assert.ok(result.html.includes("A new guide published after deployment"));
    assert.ok((await page("/sitemap.xml")).html.includes("new-guide-after-deployment"));
  });
  await check("Private draft editing does not change public body or SEO", async () => {
    await state("edited-draft", 8);
    const result = await page(source.posts[0].path);
    assert.equal(decode(result.html.match(/<title>([^<]+)<\/title>/)?.[1]), source.posts[0].seoTitle);
    assert.equal(result.html.includes("Private draft fitness title"), false);
    assert.equal((await page("/blog")).html.includes("Private draft fitness title"), false);
  });
  await check("Explicit publication updates body, metadata and revision together", async () => {
    await state("published-edit", 9);
    const result = await page(source.posts[0].path);
    assert.equal(result.response.status, 200);
    assert.ok(result.html.includes("This published update comes from the blog engine."));
    assert.equal(decode(result.html.match(/<title>([^<]+)<\/title>/)?.[1]), "Published fitness guide update | Attic");
    assert.ok(schemas(result.html).some((node) => node["@type"] === "BlogPosting" && node.headline === "Published fitness guide update"));
  });
  await check("Historical article paths emit real 308 redirects", async () => {
    await state("alias", 10);
    const result = await page(source.posts[0].path);
    assert.equal(result.response.status, 308);
    assert.ok(result.response.headers.get("location").endsWith("/blog/renamed-fitness-guide"));
    assert.equal((await page("/blog/renamed-fitness-guide")).response.status, 200);
  });
  await check("Withdrawal returns 410 and removes the article from index, feed and sitemap", async () => {
    await state("withdrawn", 11);
    assert.equal((await page(source.posts[0].path)).response.status, 410);
    for (const path of ["/blog", "/blog/feed.xml", "/sitemap.xml"]) {
      const html = (await page(path)).html;
      // Check the engine's article list; evergreen footer links are website-owned navigation.
      const discovery = path === "/blog" ? html.match(/<div class="guide-grid">([\s\S]*?)<\/section>/)?.[1] || "" : html;
      assert.equal(discovery.includes(source.posts[0].path), false, path);
    }
  });
  await check("Backend outage returns 503, retains the rest of the website and recovers", async () => {
    await state("outage", 11);
    for (const path of ["/blog", source.posts[0].path, "/blog/feed.xml", "/sitemap.xml"]) {
      const result = await page(path);
      assert.equal(result.response.status, 503, path);
      assert.equal(result.response.headers.get("retry-after"), "60", path);
    }
    assert.equal((await page("/")).response.status, 200);
    await state();
    assert.equal((await page(source.posts[0].path)).response.status, 200);
  });
  await check("Signed refresh handles duplicate delivery and rejects stale, unsigned or cross-site events", async () => {
    await state();
    assert.equal((await refresh(8)).status, 200);
    assert.equal((await refresh(8)).status, 200);
    assert.equal((await refresh(7)).status, 409);
    assert.equal((await refresh(8, { badSignature: true })).status, 401);
    assert.equal((await refresh(8, { timestamp: String(Date.now() - 600000) })).status, 401);
    assert.equal((await refresh(8, { environment: "preview" })).status, 422);
    assert.equal((await refresh(8, { key: "blog_" + "f".repeat(32) })).status, 422);
  });
  await check("Private preview requires a scoped session and returns no-store/noindex HTML", async () => {
    const unsigned = await page("/blog/preview/11111111-1111-4111-8111-111111111111");
    assert.equal(unsigned.response.status, 401);
    const exchange = await page("/api/ingenium/blog/preview?code=" + "c".repeat(43));
    assert.equal(exchange.response.status, 307);
    const cookie = exchange.response.headers.get("set-cookie");
    assert.ok(cookie.includes("HttpOnly") && cookie.includes("Secure") && cookie.includes("Path=/blog"));
    const target = new URL(exchange.response.headers.get("location")).pathname;
    const preview = await page(target, { headers: { cookie: cookie.split(";")[0], "user-agent": "Twitterbot" } });
    assert.equal(preview.response.status, 200);
    assert.ok(preview.response.headers.get("x-robots-tag").includes("noindex"));
    assert.ok(preview.response.headers.get("cache-control").includes("no-store"));
    assert.ok(preview.html.includes("Private draft fitness title"));
    assert.equal(schemas(preview.html).some((node) => node["@type"] === "BlogPosting"), false);
    assert.equal((await page("/blog")).html.includes("Private draft fitness title"), false);
  });
} finally {
  await state();
  const report = { checkedAt: new Date().toISOString(), base, environment: "isolated local HTTP fixture", realPortalPublications: false, checks, failures };
  await fs.writeFile("docs/blog/website-verification.json", JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify({ checks: checks.length, failures }, null, 2));
  if (failures.length) process.exitCode = 1;
}
