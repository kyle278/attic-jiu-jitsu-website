import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://attic-jiu-jitsu-website.vercel.app";
const key = "blog_" + "a".repeat(32);
const secret = "test-only-blog-signing-secret-" + "b".repeat(32);
const postId = "11111111-1111-4111-8111-111111111111";
const revisionId = "22222222-2222-4222-8222-222222222222";
const releaseId = "33333333-3333-4333-8333-333333333333";
const authorId = "44444444-4444-4444-8444-444444444444";
const source = JSON.parse(fs.readFileSync(path.join(root, "docs/blog/guides-import.json"), "utf8"));
const migration = JSON.parse(fs.readFileSync(path.join(root, "docs/blog/migration-source.json"), "utf8"));
const seo = { title: "", description: "", canonical: "", noindex: false, social_title: "", social_description: "" };
function article(index = 0) {
  const draft = structuredClone(source.posts[index].draft);
  delete draft.notes;
  delete draft.author_ids;
  delete draft.category_ids;
  delete draft.tag_ids;
  delete draft.seo.focus_topic;
  return { ...draft, id: postId, revision_id: revisionId, url: `${origin}/blog/${draft.slug}`, published_at: "2026-10-28T10:00:00Z", modified_at: "2026-10-28T10:00:00Z", authors: [{ id: authorId, kind: "author", name: "Attic Jiu Jitsu", slug: "attic-jiu-jitsu", description: "", url: "/about-us", seo }], categories: [], tags: [], media: {} };
}
const manifest = { api_version: 1, site_key: key, generation: 8, enabled: true, title: "Guides", description: "Fitness and jiu-jitsu", base_path: "/blog", origin, content_schema_versions: [1] };
function loader(mocks = {}, globals = {}) {
  const modules = new Map();
  return function load(relative) {
    const filename = path.resolve(root, relative);
    if (modules.has(filename)) return modules.get(filename);
    const exports = {};
    modules.set(filename, exports);
    const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true } }).outputText;
    const loadRequire = (name) => {
      if (name in mocks) return mocks[name];
      if (name === "server-only") return {};
      if (name.startsWith("@/")) return load("src/" + name.slice(2) + ".ts");
      if (name.startsWith(".")) return load(path.relative(root, path.resolve(path.dirname(filename), name + ".ts")));
      return require(name);
    };
    vm.runInNewContext(compiled, { exports, require: loadRequire, Buffer, Response, Request, Headers, URL, URLSearchParams, AbortSignal, Uint8Array, TextEncoder, console, process, ...globals }, { filename });
    return exports;
  };
}
const load = loader();
const contracts = load("src/lib/blog/contracts.ts");
const { verifyBlogRefresh } = load("src/lib/blog/refresh.ts");
const routing = load("src/lib/blog/routing.ts");
const event = { type: "blog.release", api_version: 1, site_key: key, environment: "production", release_id: releaseId, generation: 8, kind: "publish", post_id: postId, revision_id: revisionId, paths: ["/blog", "/blog/how-to-get-fit-over-40"] };
const sign = (raw, timestamp) => createHmac("sha256", secret).update(`${timestamp}.${raw}`).digest("hex");
const config = { key, secret, environment: "production" };
function clientWith(fetcher, extra = {}) {
  return loader({ react: { cache: (fn) => fn }, "next/headers": { cookies: async () => ({ get: () => undefined }) }, ...extra }, { process: { env: { INGENIUM_BLOG_SITE_KEY: key, INGENIUM_BLOG_SIGNING_SECRET: secret } }, fetch: fetcher })("src/lib/blog/client.ts");
}

test("migration retains all eight article URLs, titles, paragraphs and internal/source links", () => {
  assert.equal(source.posts.length, 8);
  for (const original of migration.posts) {
    const draft = source.posts.find((entry) => entry.draft.slug === original.slug).draft;
    assert.equal(draft.title, original.title);
    assert.equal(draft.seo.title, original.seoTitle);
    assert.equal(draft.seo.description, original.description);
    const text = draft.body.blocks.map((block) => block.text).join("\n");
    for (const paragraph of original.sourceParagraphs) assert.ok(text.includes(paragraph), original.slug);
    for (const link of original.sourceLinks) assert.ok(text.includes(`](${link.href})`), `${original.slug}: ${link.href}`);
    assert.equal(new Set(draft.body.blocks.map((block) => block.id)).size, draft.body.blocks.length);
  }
});
test("published contract accepts the actual immutable projection and rejects private draft fields", () => {
  const post = article();
  assert.ok(contracts.publishedArticleSchema.safeParse(post).success);
  assert.equal(contracts.publishedArticleSchema.safeParse({ ...post, notes: "Private notes" }).success, false);
  assert.equal(contracts.publishedArticleSchema.safeParse({ ...post, body: { version: 2, blocks: [] } }).success, false);
  assert.equal(contracts.publishedArticleSchema.safeParse({ ...post, body: { version: 1, blocks: [{ id: revisionId, type: "html", text: "<script>" }] } }).success, false);
});
test("private preview projection accepts Portal’s preview revision without relaxing public revisions", () => {
  const post = { ...article(), revision_id: "preview" };
  assert.equal(contracts.publishedArticleSchema.safeParse(post).success, false);
  assert.ok(contracts.previewResultSchema.safeParse({ post, session: "s".repeat(43), expires_at: "2099-10-28T10:00:00Z", base_path: "/blog" }).success);
});
test("unsafe links and media protocols are rejected while HTTPS and local links are supported", () => {
  for (const value of ["javascript:alert(1)", "//evil.test/path", "/\\evil.test", "data:text/html,x", "https://user:pass@evil.test"]) assert.equal(contracts.safeUrl.safeParse(value).success, false, value);
  for (const value of ["/beginners-bjj-carlow", "/#trial-form", "https://www2.hse.ie/", "tel:+353858447393"]) assert.ok(contracts.safeUrl.safeParse(value).success, value);
});
test("blog ownership uses exact path boundaries and prevents unsafe refresh paths", () => {
  assert.ok(routing.isBlogPath("/blog") && routing.isBlogPath("/blog/post"));
  assert.equal(routing.isBlogPath("/blogger"), false);
  for (const value of ["/members", "/blog/../members", "/blog//evil", "/blog/post?token=x", "/blog/\\evil"]) assert.equal(routing.safeBlogPath(value), false, value);
});
test("refresh signature binds exact body, site, environment, time and paths", () => {
  const timestamp = String(Date.now());
  const raw = JSON.stringify(event);
  assert.equal(verifyBlogRefresh(raw, timestamp, sign(raw, timestamp), config).ok, true);
  assert.equal(verifyBlogRefresh(raw + " ", timestamp, sign(raw, timestamp), config).status, 401);
  assert.equal(verifyBlogRefresh(raw, String(Date.now() - 600000), sign(raw, timestamp), config).status, 401);
  for (const modified of [{ ...event, site_key: "blog_" + "c".repeat(32) }, { ...event, environment: "preview" }, { ...event, paths: ["/members"] }, { ...event, release_id: "not-a-release" }]) {
    const body = JSON.stringify(modified);
    assert.equal(verifyBlogRefresh(body, timestamp, sign(body, timestamp), config).status, 422);
  }
  assert.equal(verifyBlogRefresh("x".repeat(100001), timestamp, sign(raw, timestamp), config).status, 413);
});
test("public reads always use no-store and validate site, origin and body version", async () => {
  const calls = [];
  const client = clientWith(async (url, options) => { calls.push({ url, options }); return Response.json(manifest); });
  assert.equal((await client.getBlogManifest()).generation, 8);
  assert.equal(calls[0].options.cache, "no-store");
  assert.equal(calls[0].options.redirect, "error");
  const wrongSite = clientWith(async () => Response.json({ ...manifest, site_key: "blog_" + "c".repeat(32) }));
  await assert.rejects(wrongSite.getBlogManifest(), /identity/);
  const wrongOrigin = clientWith(async () => Response.json({ ...manifest, origin: "https://another-site.test" }));
  await assert.rejects(wrongOrigin.getBlogManifest(), /origin/);
});
test("unknown, withdrawn and backend outage statuses stay distinct", async () => {
  for (const status of [404, 410, 503]) {
    const client = clientWith(async () => new Response("Unavailable", { status }));
    await assert.rejects(client.getBlogArticle("missing"), (error) => error.status === status);
  }
  const client = clientWith(async () => { throw Error("Network error with private upstream details"); });
  await assert.rejects(client.getBlogArticle("missing"), (error) => error.status === 503 && !error.message.includes("private"));
});
test("detail accepts published-only data and only safe permanent aliases", async () => {
  const client = clientWith(async () => Response.json({ api_version: 1, site_key: key, generation: 8, post: article() }));
  assert.equal((await client.getBlogArticle(article().slug)).post.revision_id, revisionId);
  const alias = clientWith(async () => Response.json({ api_version: 1, site_key: key, generation: 8, redirect: { status: 308, path: "/blog/new-slug" } }));
  assert.equal((await alias.getBlogArticle("old-slug")).redirect.path, "/blog/new-slug");
  const unsafe = clientWith(async () => Response.json({ api_version: 1, site_key: key, generation: 8, redirect: { status: 308, path: "https://another-site.test" } }));
  await assert.rejects(unsafe.getBlogArticle("old-slug"), /redirect/);
});
test("full enumeration follows all cursors and restarts on a publication-generation change", async () => {
  let calls = 0;
  const summary = article(); delete summary.body;
  const client = clientWith(async () => {
    calls++;
    if (calls === 1) return Response.json({ api_version: 1, site_key: key, generation: 7, posts: [summary], total: 2, next_cursor: "generation-7-page-2" });
    if (calls === 2) return new Response("Changed", { status: 409 });
    return Response.json({ api_version: 1, site_key: key, generation: 8, posts: [summary], total: 1, next_cursor: null });
  });
  assert.equal((await client.allBlogPosts()).length, 1);
  assert.equal(calls, 3);
});
test("public list cannot carry draft bodies or repeat a pagination cursor forever", async () => {
  const bad = clientWith(async () => Response.json({ api_version: 1, site_key: key, generation: 8, posts: [article()], total: 1, next_cursor: null }));
  await assert.rejects(bad.allBlogPosts(), /format/);
  const summary = article(); delete summary.body;
  const repeated = clientWith(async () => Response.json({ api_version: 1, site_key: key, generation: 8, posts: [summary], total: 10, next_cursor: "same" }));
  await assert.rejects(repeated.allBlogPosts(), /pagination/);
});
test("signed private preview reads use the scoped secret and never forward it as a credential", async () => {
  let sent;
  const client = clientWith(async (url, options) => {
    sent = { url, options };
    return Response.json({ post: { ...article(), revision_id: "preview" }, expires_at: "2099-10-28T10:00:00Z", base_path: "/blog" });
  });
  await client.signedBlogRequest("read", { session: "s".repeat(43) });
  assert.equal(sent.options.cache, "no-store");
  assert.equal(sent.options.headers["X-Ingenium-Signature"], sign(sent.options.body, sent.options.headers["X-Ingenium-Timestamp"]));
  assert.equal(sent.options.body.includes(secret), false);
});
test("AST renderer escapes stored HTML and renders all supported block types", async () => {
  const React = require("react");
  const { renderToStaticMarkup } = require("react-dom/server");
  const componentLoader = loader({ "next/link": ({ children, ...props }) => React.createElement("a", props, children), "next/image": ({ src, width, height, alt, loading }) => React.createElement("img", { src, width, height, alt, loading }), "@/lib/blog/contracts": contracts, "@/lib/blog/routing": routing });
  const { BlogBody } = componentLoader("src/components/blog/blog-body.tsx");
  const blocks = contracts.blockSchema.array().parse([
    { id: postId, type: "heading", level: 2, text: "Title" },
    { id: revisionId, type: "paragraph", text: '<script>alert("x")</script> **Strong** [Link](/classes)' },
    { id: releaseId, type: "table", text: "Name|Description\nOne|Two" },
    { id: authorId, type: "cta", href: "/#trial-form", label: "Ask about training", text: "Next step" },
    { id: "55555555-5555-4555-8555-555555555555", type: "list", text: "First\nSecond" },
    { id: "66666666-6666-4666-8666-666666666666", type: "quote", text: "A quote" },
    { id: "77777777-7777-4777-8777-777777777777", type: "callout", text: "A callout" },
    { id: "88888888-8888-4888-8888-888888888888", type: "image", media_id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", alt: "Coaching at Attic" },
    { id: "99999999-9999-4999-8999-999999999999", type: "divider" },
    { id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa", type: "code", text: "<script>inert code</script>" },
  ]);
  const html = renderToStaticMarkup(React.createElement(BlogBody, { blocks, media: { "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb": { id: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb", url: "https://example.invalid/photo.webp", width: 800, height: 600, alt: "Coaching at Attic" } } }));
  assert.ok(html.includes("&lt;script&gt;") && !html.includes("<script>"));
  assert.ok(html.includes("<strong>Strong</strong>"));
  assert.ok(html.includes('href="/classes"') && html.includes("<table>"));
  assert.ok(html.includes('id="section-') && html.includes("Ask about training"));
  for (const tag of ["<ul>", "<blockquote>", "<figure>", "<hr/>", "<pre>"]) assert.ok(html.includes(tag), tag);
});
test("receiver only acknowledges the current durable generation and handles duplicate delivery", async () => {
  const revalidated = [];
  const receiverLoader = loader({
    "next/cache": { revalidatePath: (value) => revalidated.push(value) },
    "@/lib/blog/client": { blogConfig: () => config, getBlogManifest: async () => manifest },
    "@/lib/blog/refresh": { verifyBlogRefresh },
  }, { process: { env: { INGENIUM_BLOG_ENVIRONMENT: "production" } } });
  const { POST } = receiverLoader("src/app/api/ingenium/blog/route.ts");
  for (const generation of [8, 8, 7]) {
    const timestamp = String(Date.now());
    const raw = JSON.stringify({ ...event, generation });
    const response = await POST(new Request(`${origin}/api/ingenium/blog`, { method: "POST", body: raw, headers: { "X-Ingenium-Timestamp": timestamp, "X-Ingenium-Signature": sign(raw, timestamp) } }));
    assert.equal(response.status, generation === 8 ? 200 : 409);
    if (generation === 8) assert.equal((await response.json()).release_id, releaseId);
  }
  assert.ok(revalidated.includes("/sitemap.xml") && revalidated.includes("/blog/feed.xml"));
});
test("RSS and sitemap derive published URLs dynamically and omit alternate/noindex articles from sitemap", async () => {
  const one = article();
  const two = { ...article(1), seo: { ...article(1).seo, noindex: true } };
  const three = { ...article(2), seo: { ...article(2).seo, canonical: "https://canonical.example/article" } };
  const routeLoader = loader({ "@/lib/blog/client": { getBlogManifest: async () => manifest, allBlogPosts: async () => [one, two, three] } });
  const map = await routeLoader("src/app/sitemap.xml/route.ts").GET();
  assert.equal(map.status, 200);
  const xml = await map.text();
  assert.ok(xml.includes(one.url));
  assert.equal(xml.includes(two.url), false);
  assert.equal(xml.includes(three.url), false);
  const feed = await routeLoader("src/app/(website)/blog/feed.xml/route.ts").GET();
  assert.equal(feed.status, 200);
  assert.ok((await feed.text()).includes(one.url));
});
