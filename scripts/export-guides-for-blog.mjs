// Deterministic, content-only migration export. No credentials or network requests.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import vm from "node:vm";
import fs from "node:fs/promises";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const sourceCommit = "0527a72acbb7817ea2c5fa5ea52aa68b28b88471";
function readData(file, imports = {}) {
  const source = execFileSync("git", ["show", `${sourceCommit}:${file}`], { encoding: "utf8" });
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, { exports, require: (name) => { if (!(name in imports)) throw Error(`Unexpected data dependency: ${name}`); return imports[name]; } }, { filename: file });
  return exports;
}
const links = readData("src/lib/seo-content.ts");
const { guides } = readData("src/lib/fitness-guides.ts", { "@/lib/seo-content": links });
function stableId(text) {
  const hash = createHash("sha256").update(`attic-blog-migration-v1:${text}`).digest("hex").slice(0, 32).split("");
  hash[12] = "5"; hash[16] = "8";
  const id = hash.join("");
  return `${id.slice(0, 8)}-${id.slice(8, 12)}-${id.slice(12, 16)}-${id.slice(16, 20)}-${id.slice(20)}`;
}
const linkText = (link) => `[${link.label}](${link.href})`;
const categoryFor = (guide) => guide.slug === "is-jiu-jitsu-good-for-kids" ? "Kids & family" : ["how-to-get-fit-over-40", "fitness-for-men-over-40", "fitness-for-women-over-40", "get-fit-without-a-gym"].includes(guide.slug) ? "Fitness" : "Starting jiu-jitsu";
function sectionsFor(guide) {
  return [
    ...guide.sections,
    ...(guide.sources?.length ? [{ id: "sources", title: "Further reading.", paragraphs: ["General activity information comes from the sources below. Class and membership information describes Attic’s published programme. This guide is general information, rather than an individual exercise prescription."], bullets: guide.sources.map(linkText) }] : []),
    { id: "next-step", title: "Find your next step.", paragraphs: [], bullets: guide.related.map(linkText) },
  ];
}
const posts = guides.map((guide) => {
  const blocks = [];
  const add = (type, text, extra = {}) => blocks.push({ id: stableId(`${guide.slug}:${blocks.length}`), type, text, level: 2, ordered: false, alt: "", decorative: false, caption: "", href: "", label: "", ...extra });
  for (const section of sectionsFor(guide)) {
    add("heading", section.title);
    section.paragraphs.forEach((text) => add("paragraph", text));
    if (section.bullets?.length) add("list", section.bullets.join("\n"));
    section.links?.forEach((link) => add("paragraph", linkText(link)));
  }
  add("cta", "Ask the academy about your first class.", { label: "Ask about getting started", href: "/#trial-form" });
  return { draft: { title: guide.heading, slug: guide.slug, excerpt: guide.intro, body: { version: 1, blocks }, author_ids: [], category_ids: [], tag_ids: [], featured: false, cover_alt: "", related_ids: [], locale: "en", seo: { title: guide.title, description: guide.description, canonical: "", noindex: false, social_title: guide.title, social_description: guide.description, focus_topic: guide.heading }, notes: `Stable source: attic-seo-guides-v1/${guide.slug}\nSource commit: ${sourceCommit}\nOriginal content updated: 2026-10-27\nCategory: ${categoryFor(guide)}\nMigrate to the existing /blog/${guide.slug} path. Preserve the complete body and SEO fields.` } };
});
const markdown = guides.map((guide) => {
  const metadata = { title: guide.heading, slug: guide.slug, excerpt: guide.intro, author: "Attic Jiu Jitsu", categories: [categoryFor(guide)], seo_title: guide.title, description: guide.description, noindex: false, source_id: `attic-seo-guides-v1/${guide.slug}`, source_commit: sourceCommit, source_updated: "2026-10-27" };
  const lines = ["---", ...Object.entries(metadata).map(([key, value]) => `${key}: ${JSON.stringify(value)}`), "---", ""];
  for (const section of sectionsFor(guide)) {
    lines.push(`## ${section.title}`, "", ...section.paragraphs.flatMap((text) => [text, ""]));
    if (section.bullets?.length) lines.push(...section.bullets.map((text) => `- ${text}`), "");
    if (section.links?.length) lines.push(...section.links.flatMap((link) => [linkText(link), ""]));
  }
  lines.push("[Ask about getting started](/#trial-form)", "");
  return { filename: `${guide.slug}.md`, content: lines.join("\n") };
});
await fs.mkdir("docs/blog", { recursive: true });
await fs.writeFile("docs/blog/guides-import.json", JSON.stringify({ posts }, null, 2) + "\n");
await fs.writeFile("docs/blog/guides-markdown-import.json", JSON.stringify({ markdown }, null, 2) + "\n");
await fs.writeFile("docs/blog/migration-source.json", JSON.stringify({ siteId: "8b0e89c9-3090-46b2-b008-4d5c46233647", sourceCommit, sourceUpdated: "2026-10-27", posts: guides.map((guide) => ({ slug: guide.slug, path: `/blog/${guide.slug}`, title: guide.heading, seoTitle: guide.title, description: guide.description, category: categoryFor(guide), sourceParagraphs: guide.sections.flatMap((section) => section.paragraphs), sourceLinks: [...guide.sections.flatMap((section) => section.links || []), ...guide.related, ...(guide.sources || [])] })) }, null, 2) + "\n");
console.log(JSON.stringify({ sourceCommit, articles: guides.length, blocks: posts.map((post) => ({ slug: post.draft.slug, blocks: post.draft.body.blocks.length })) }, null, 2));
