import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { createHmac } from "node:crypto";
import type { z } from "zod";
import { PORTAL_ORIGIN, WEBSITE_ORIGIN } from "@/portal/public";
import { articleResultSchema, entitiesResultSchema, envelopeSchema, manifestSchema, postsResultSchema, previewResultSchema, type Summary } from "./contracts";
import { safeBlogPath } from "./routing";

export class BlogUnavailable extends Error {
  constructor(message: string, public status = 503) { super(message); }
}
export function blogConfigured() { return !!process.env.INGENIUM_BLOG_SITE_KEY?.trim(); }
export function blogConfig() {
  const key = process.env.INGENIUM_BLOG_SITE_KEY?.trim();
  const origin = process.env.INGENIUM_PORTAL_ORIGIN?.trim() || PORTAL_ORIGIN;
  if (!key || !/^blog_[a-f0-9]{32}$/.test(key) || new URL(origin).origin !== PORTAL_ORIGIN) throw new BlogUnavailable("The blog connection is unavailable.");
  return { key, origin: PORTAL_ORIGIN, secret: process.env.INGENIUM_BLOG_SIGNING_SECRET?.trim() || "" };
}
async function boundedJson(response: Response) {
  if (!response.body || Number(response.headers.get("content-length") || 0) > 2200000) throw new BlogUnavailable("The article response is unavailable.");
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const next = await reader.read();
    if (next.done) break;
    size += next.value.length;
    if (size > 2200000) { await reader.cancel(); throw new BlogUnavailable("The article response is unavailable."); }
    chunks.push(next.value);
  }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown; }
  catch { throw new BlogUnavailable("The article response is unavailable."); }
}
export async function blogFetch<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  const config = blogConfig();
  let response;
  try {
    response = await fetch(`${config.origin}/api/websites/blog/public/v1/${config.key}/${path}`, { cache: "no-store", redirect: "error", signal: AbortSignal.timeout(12000) });
  } catch { throw new BlogUnavailable("The article service is temporarily unavailable."); }
  if (!response.ok) throw new BlogUnavailable("The article service is unavailable.", [404, 410, 409].includes(response.status) ? response.status : 503);
  const raw = await boundedJson(response);
  const envelope = envelopeSchema.safeParse(raw);
  if (!envelope.success || envelope.data.site_key !== config.key) throw new BlogUnavailable("The Blog response identity is invalid.");
  const parsed = schema.safeParse(raw);
  if (!parsed.success) throw new BlogUnavailable("The Blog content format is unsupported.");
  return parsed.data;
}
export const getBlogManifest = cache(async () => {
  const manifest = await blogFetch("manifest", manifestSchema);
  if (new URL(manifest.origin).origin !== WEBSITE_ORIGIN) throw new BlogUnavailable("The Blog origin does not match this website.");
  return manifest;
});
export const getBlogArticle = cache(async (slug: string) => {
  const result = await blogFetch(`posts/${encodeURIComponent(slug)}`, articleResultSchema);
  if (result.redirect && !safeBlogPath(result.redirect.path)) throw new BlogUnavailable("The Blog redirect is invalid.");
  if (result.post && (new URL(result.post.url).origin !== WEBSITE_ORIGIN || new URL(result.post.url).pathname !== `/blog/${result.post.slug}`)) throw new BlogUnavailable("The article URL is invalid.");
  return result;
});
export function getBlogPosts(params = new URLSearchParams()) { return blogFetch(`posts?${params}`, postsResultSchema); }
export function getBlogEntities(kind: "categories" | "tags" | "authors", slug?: string) { return blogFetch(`${kind}${slug ? `/${encodeURIComponent(slug)}` : ""}`, entitiesResultSchema); }

export async function allBlogPosts(): Promise<Summary[]> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const posts: Summary[] = [];
    let cursor: string | null = null;
    let generation: number | null = null;
    const seen = new Set<string>();
    try {
      do {
        const params = new URLSearchParams({ limit: "50" });
        if (cursor) params.set("cursor", cursor);
        const result = await getBlogPosts(params);
        if (generation !== null && generation !== result.generation) throw new BlogUnavailable("The blog changed during enumeration.", 409);
        generation = result.generation;
        posts.push(...result.posts);
        cursor = result.next_cursor;
        if (cursor && seen.has(cursor)) throw new BlogUnavailable("Invalid article pagination.");
        if (cursor) seen.add(cursor);
        if (posts.length > 100000) throw new BlogUnavailable("The blog requires a partitioned sitemap.");
      } while (cursor);
      return posts;
    } catch (error) {
      if (!(error instanceof BlogUnavailable) || error.status !== 409 || attempt === 2) throw error;
    }
  }
  throw new BlogUnavailable("Articles are temporarily unavailable.");
}
export async function signedBlogRequest(action: "exchange" | "read", payload: Record<string, unknown>) {
  const config = blogConfig();
  if (config.secret.length < 32) throw new BlogUnavailable("Preview is unavailable.", 401);
  const body = JSON.stringify({ ...payload, site_key: config.key });
  const timestamp = String(Date.now());
  const signature = createHmac("sha256", config.secret).update(`${timestamp}.${body}`).digest("hex");
  let response;
  try {
    response = await fetch(`${config.origin}/api/websites/blog/preview/${action}`, {
      method: "POST", body, headers: { "Content-Type": "application/json", "X-Ingenium-Timestamp": timestamp, "X-Ingenium-Signature": signature },
      cache: "no-store", redirect: "error", signal: AbortSignal.timeout(12000),
    });
  } catch { throw new BlogUnavailable("Preview is temporarily unavailable."); }
  if (!response.ok) throw new BlogUnavailable("Preview expired, revoked or unavailable.", 401);
  const result = previewResultSchema.safeParse(await boundedJson(response));
  if (!result.success || Date.parse(result.data.expires_at) <= Date.now()) throw new BlogUnavailable("Preview expired or unavailable.", 401);
  return result.data;
}
export const readBlogPreview = cache(async () => {
  const session = (await cookies()).get("attic-blog-preview")?.value;
  if (!session) throw new BlogUnavailable("Preview access required.", 401);
  return signedBlogRequest("read", { session });
});
