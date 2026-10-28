import { revalidatePath } from "next/cache";
import { blogConfig, getBlogManifest } from "@/lib/blog/client";
import { verifyBlogRefresh } from "@/lib/blog/refresh";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function POST(request: Request) {
  const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" };
  try {
    if (Number(request.headers.get("content-length") || 0) > 100000) return Response.json({ error: "Event too large." }, { status: 413, headers });
    const raw = await request.text();
    const config = blogConfig();
    const verified = verifyBlogRefresh(raw, request.headers.get("x-ingenium-timestamp") || "", request.headers.get("x-ingenium-signature") || "", { ...config, environment: process.env.INGENIUM_BLOG_ENVIRONMENT?.trim() || "production" });
    if (!verified.ok) return Response.json({ error: "Invalid Blog refresh." }, { status: verified.status, headers });
    const manifest = await getBlogManifest();
    if (manifest.generation !== verified.event.generation) return Response.json({ error: "Release is not the current generation.", generation: manifest.generation }, { status: 409, headers });
    for (const path of verified.event.paths) revalidatePath(path);
    revalidatePath("/blog", "layout");
    revalidatePath("/sitemap.xml");
    revalidatePath("/blog/feed.xml");
    return Response.json({ site_key: config.key, release_id: verified.event.release_id, generation: manifest.generation }, { headers });
  } catch { return Response.json({ error: "Blog refresh is temporarily unavailable." }, { status: 503, headers }); }
}
