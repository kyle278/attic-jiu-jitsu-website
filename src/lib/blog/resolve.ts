import "server-only";
import { cache } from "react";
import { notFound, permanentRedirect } from "next/navigation";
import { BlogUnavailable, getBlogArticle, getBlogEntities, getBlogManifest, getBlogPosts, readBlogPreview } from "./client";
import { blogReservedSlugs, blogSlugPattern } from "./routing";
import type { Manifest, PublishedArticle } from "./contracts";

type BlogView = {
  manifest: Manifest; path: string; title: string; description: string; noindex: boolean; preview: boolean; page: number; query: string;
  post?: PublishedArticle;
  list?: Awaited<ReturnType<typeof getBlogPosts>>;
};

// Metadata and body use one request-scoped result, including the immutable article revision.
export const resolveBlog = cache(async (segmentsKey: string, search: string): Promise<BlogView> => {
  const segments = segmentsKey ? segmentsKey.split("/") : [];
  const manifest = await getBlogManifest();
  const path = `/blog${segments.length ? `/${segments.join("/")}` : ""}`;
  const base: BlogView = { manifest, path, title: manifest.title, description: manifest.description, noindex: false, preview: false, page: 1, query: "" };
  if (segments[0] === "preview") {
    if (segments.length !== 2 || !/^[a-f0-9-]{36}$/i.test(segments[1])) notFound();
    const preview = await readBlogPreview();
    if (preview.post.id !== segments[1]) notFound();
    // Preview identity is authenticated by Portal; it is never used as a public revision marker.
    return { ...base, post: preview.post, preview: true, noindex: true };
  }
  if (!manifest.enabled) notFound();
  if (segments.length === 1 && !blogReservedSlugs.has(segments[0])) {
    if (!blogSlugPattern.test(segments[0])) notFound();
    const result = await getBlogArticle(segments[0]);
    if (result.redirect) permanentRedirect(result.redirect.path);
    if (!result.post) notFound();
    return { ...base, post: result.post, noindex: result.post.seo.noindex };
  }
  const query = new URLSearchParams({ limit: "12" });
  if (segments[0] === "page") {
    if (segments.length !== 2 || !/^[1-9]\d{0,3}$/.test(segments[1])) notFound();
    base.page = Number(segments[1]);
    if (base.page === 1) permanentRedirect("/blog");
    base.title = `${manifest.title} — Page ${base.page}`;
    query.set("page", String(base.page));
  } else if (["category", "tag", "author"].includes(segments[0])) {
    if (segments.length !== 2 || !blogSlugPattern.test(segments[1])) notFound();
    const kind = ({ category: "categories", tag: "tags", author: "authors" } as const)[segments[0] as "category" | "tag" | "author"];
    const entity = (await getBlogEntities(kind, segments[1])).entities[0];
    if (!entity) notFound();
    base.title = entity.seo.title || entity.name;
    base.description = entity.seo.description || entity.description;
    base.noindex = entity.seo.noindex;
    query.set(segments[0], segments[1]);
  } else if (segments[0] === "search") {
    if (segments.length !== 1) notFound();
    base.title = "Search fitness and jiu-jitsu guides";
    base.query = search.slice(0, 100).trim();
    base.noindex = true;
    query.set("q", base.query);
  } else if (segments.length) notFound();
  const list = await getBlogPosts(query);
  if (base.page > 1 && !list.posts.length) notFound();
  if (list.generation !== manifest.generation) throw new BlogUnavailable("The blog changed. Please reload.");
  return { ...base, list };
});
