import { allBlogPosts, getBlogManifest } from "@/lib/blog/client";
import { xmlText } from "@/lib/blog/xml";

export const dynamic = "force-dynamic";
export async function GET() {
  const headers = { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" };
  try {
    const manifest = await getBlogManifest();
    if (!manifest.enabled) return new Response(null, { status: 404, headers });
    const posts = (await allBlogPosts()).slice(0, 50);
    const items = posts.map((post) => `<item><guid isPermaLink="false">${xmlText(post.id)}</guid><title>${xmlText(post.title)}</title><link>${xmlText(post.url)}</link><description>${xmlText(post.excerpt)}</description><pubDate>${new Date(post.published_at).toUTCString()}</pubDate></item>`).join("");
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${xmlText(manifest.title)}</title><link>${xmlText(manifest.origin + manifest.base_path)}</link><description>${xmlText(manifest.description)}</description>${items}</channel></rss>`, { headers: { ...headers, "Content-Type": "application/rss+xml; charset=utf-8" } });
  } catch { return new Response("Feed temporarily unavailable.", { status: 503, headers: { ...headers, "Retry-After": "60" } }); }
}
