import { landingPages, contentUpdated } from "@/lib/seo-content";
import { allBlogPosts, getBlogManifest } from "@/lib/blog/client";
import { xmlText } from "@/lib/blog/xml";
import { WEBSITE_ORIGIN } from "@/portal/public";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const entries = ["", "/about-us", "/classes", "/memberships", "/gallery", "/privacy-policy", ...landingPages.map((page) => `/${page.slug}`)].map((path) => ({ url: `${WEBSITE_ORIGIN}${path}`, modified: contentUpdated }));
    const manifest = await getBlogManifest();
    if (manifest.enabled) {
      entries.push({ url: `${WEBSITE_ORIGIN}/blog`, modified: contentUpdated });
      const posts = await allBlogPosts();
      entries.push(...posts.filter((post) => !post.seo.noindex && (!post.seo.canonical || post.seo.canonical === post.url)).map((post) => ({ url: post.url, modified: post.modified_at })));
    }
    const urls = entries.map((entry) => `<url><loc>${xmlText(entry.url)}</loc><lastmod>${xmlText(entry.modified)}</lastmod></url>`).join("");
    return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { "Content-Type": "application/xml; charset=utf-8", "Cache-Control": "no-store" } });
  } catch { return new Response("Sitemap temporarily unavailable.", { status: 503, headers: { "Cache-Control": "no-store", "Retry-After": "60" } }); }
}
