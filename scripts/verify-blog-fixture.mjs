// Local test preload only; excluded from deployments. Does not contact or write Portal.
import fs from "node:fs";
import { createHash, createHmac } from "node:crypto";

if (process.env.ATTIC_BLOG_FIXTURE !== "1" || process.env.VERCEL) throw Error("The Blog fixture is only available to an isolated local test process.");
const root = new URL("../", import.meta.url);
const input = JSON.parse(fs.readFileSync(new URL("docs/blog/guides-import.json", root), "utf8"));
const stateFile = new URL("docs/blog/fixture-state.json", root);
const key = "blog_" + "d".repeat(32);
const secret = "isolated-fixture-secret-" + "e".repeat(40);
const origin = "https://attic-jiu-jitsu-website.vercel.app";
const portal = "https://portal.ingeniumconsulting.net";
process.env.INGENIUM_BLOG_SITE_KEY = key;
process.env.INGENIUM_BLOG_SIGNING_SECRET = secret;
process.env.INGENIUM_BLOG_ENVIRONMENT = "production";
const originalFetch = globalThis.fetch;
function id(value) {
  const hash = createHash("sha256").update("attic-test:" + value).digest("hex").slice(0, 32).split("");
  hash[12] = "4"; hash[16] = "8";
  const valueId = hash.join("");
  return `${valueId.slice(0, 8)}-${valueId.slice(8, 12)}-${valueId.slice(12, 16)}-${valueId.slice(16, 20)}-${valueId.slice(20)}`;
}
const emptySeo = { title: "", description: "", canonical: "", noindex: true, social_title: "", social_description: "" };
const author = { id: id("author"), kind: "author", name: "Attic Jiu Jitsu", slug: "attic-jiu-jitsu", url: origin + "/about-us", description: "Brazilian jiu-jitsu in Carlow.", seo: emptySeo };
const category = { id: id("category"), kind: "category", name: "Fitness", slug: "fitness", url: "", description: "Practical fitness guides.", seo: emptySeo };
function postsFor(mode) {
  let posts = input.posts.map(({ draft }) => {
    const post = structuredClone(draft);
    for (const field of ["notes", "author_ids", "category_ids", "tag_ids"]) delete post[field];
    delete post.seo.focus_topic;
    return { ...post, id: id(post.slug), revision_id: id(post.slug + ":v1"), authors: [author], categories: [category], tags: [], media: {}, url: `${origin}/blog/${post.slug}`, published_at: "2026-10-28T12:00:00Z", modified_at: "2026-10-28T12:00:00Z" };
  });
  if (mode === "published-edit") {
    posts[0].title = "Published fitness guide update";
    posts[0].seo.title = "Published fitness guide update | Attic";
    posts[0].seo.social_title = posts[0].seo.title;
    posts[0].body.blocks.push({ id: id("new-paragraph"), type: "paragraph", text: "This published update comes from the blog engine.", level: 2, ordered: false, alt: "", decorative: false, caption: "", href: "", label: "" });
    posts[0].revision_id = id("published-v2");
    posts[0].modified_at = "2026-10-28T13:00:00Z";
  }
  if (mode === "alias") {
    posts[0].slug = "renamed-fitness-guide";
    posts[0].url = origin + "/blog/renamed-fitness-guide";
    posts[0].revision_id = id("renamed-revision");
  }
  if (mode === "new-slug") {
    const added = structuredClone(posts[0]);
    added.id = id("new-post"); added.revision_id = id("new-post-v1"); added.slug = "new-guide-after-deployment"; added.url = origin + "/blog/" + added.slug; added.title = "A new guide published after deployment"; added.seo.title = "A new guide published after deployment | Attic"; added.seo.social_title = added.seo.title;
    posts.push(added);
  }
  if (mode === "withdrawn") posts = posts.slice(1);
  return posts;
}
const envelope = (state) => ({ api_version: 1, site_key: key, generation: state.generation || 8 });
const json = (data, status = 200) => Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
globalThis.fetch = async (inputUrl, init = {}) => {
  const url = new URL(typeof inputUrl === "string" || inputUrl instanceof URL ? inputUrl : inputUrl.url);
  if (url.origin !== portal || !url.pathname.startsWith("/api/websites/blog/")) return originalFetch(inputUrl, init);
  const state = JSON.parse(fs.readFileSync(stateFile, "utf8"));
  if (state.mode === "outage") return json({ error: "Fixture service outage" }, 503);
  if (url.pathname.startsWith("/api/websites/blog/preview/")) {
    const raw = init.body || "";
    const headers = new Headers(init.headers);
    const signature = createHmac("sha256", secret).update(`${headers.get("x-ingenium-timestamp")}.${raw}`).digest("hex");
    if (headers.get("x-ingenium-signature") !== signature) return json({ error: "Bad signature" }, 401);
    const body = JSON.parse(raw);
    if (body.site_key !== key || (body.code !== "c".repeat(43) && body.session !== "s".repeat(43))) return json({ error: "Private preview unavailable" }, 401);
    const post = postsFor("live")[0]; post.title = "Private draft fitness title"; post.seo.title = "Private draft fitness title | Attic"; post.revision_id = "preview";
    return json({ post, ...(url.pathname.endsWith("exchange") ? { session: "s".repeat(43) } : {}), expires_at: new Date(Date.now() + 900000).toISOString(), base_path: "/blog" });
  }
  const prefix = `/api/websites/blog/public/v1/${key}/`;
  if (!url.pathname.startsWith(prefix)) return json({ error: "Wrong fixture site" }, 404);
  const resource = url.pathname.slice(prefix.length).split("/");
  if (resource[0] === "manifest") return json({ ...envelope(state), enabled: true, title: "Fitness Over 40 & Jiu-Jitsu Beginner Guides", description: "Practical guides to getting fit over 40 for men and women, finding an alternative to the gym and starting jiu-jitsu. Advice for beginners and parents in Carlow.", base_path: "/blog", origin, content_schema_versions: [1] });
  const posts = postsFor(state.mode);
  if (resource[0] === "posts" && resource[1]) {
    if (state.mode === "alias" && resource[1] === input.posts[0].draft.slug) return json({ ...envelope(state), redirect: { status: 308, path: "/blog/renamed-fitness-guide" } });
    if (state.mode === "withdrawn" && resource[1] === input.posts[0].draft.slug) return json({ error: "Withdrawn" }, 410);
    const post = posts.find((entry) => entry.slug === resource[1]);
    return post ? json({ ...envelope(state), post }) : json({ error: "Not found" }, 404);
  }
  if (resource[0] === "posts") {
    const q = url.searchParams.get("q")?.toLowerCase();
    let selected = q ? posts.filter((post) => post.title.toLowerCase().includes(q)) : posts;
    if (url.searchParams.get("ids")) selected = selected.filter((post) => url.searchParams.get("ids").split(",").includes(post.id));
    if (url.searchParams.get("category") && url.searchParams.get("category") !== category.slug) selected = [];
    const limit = Number(url.searchParams.get("limit") || 12);
    const offset = (Number(url.searchParams.get("page") || 1) - 1) * limit;
    return json({ ...envelope(state), posts: selected.slice(offset, offset + limit).map((post) => { const summary = { ...post }; delete summary.body; return summary; }), total: selected.length, next_cursor: null });
  }
  if (["authors", "categories", "tags"].includes(resource[0])) {
    const values = resource[0] === "authors" ? [author] : resource[0] === "categories" ? [category] : [];
    const entities = resource[1] ? values.filter((entity) => entity.slug === resource[1]) : values;
    return resource[1] && !entities.length ? json({ error: "Not found" }, 404) : json({ ...envelope(state), entities });
  }
  return json({ error: "Not found" }, 404);
};
