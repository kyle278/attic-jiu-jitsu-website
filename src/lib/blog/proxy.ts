import { NextResponse, type NextRequest } from "next/server";
import { BlogUnavailable, getBlogArticle, getBlogEntities, getBlogManifest, getBlogPosts, signedBlogRequest } from "./client";
import { blogUnavailableResponse } from "./availability";
import { blogReservedSlugs, blogSlugPattern, isBlogPreview } from "./routing";

export async function blogProxy(request: NextRequest, requestHeaders: Headers) {
  const path = request.nextUrl.pathname;
  const segments = path.split("/").filter(Boolean).slice(1);
  try {
    if (isBlogPreview(path)) {
      if (segments.length !== 2 || !/^[a-f0-9-]{36}$/i.test(segments[1])) return blogUnavailableResponse(404);
      const session = request.cookies.get("attic-blog-preview")?.value;
      if (!session) return blogUnavailableResponse(401);
      const preview = await signedBlogRequest("read", { session });
      if (preview.post.id !== segments[1]) return blogUnavailableResponse(401);
    } else {
      const manifest = await getBlogManifest();
      if (!manifest.enabled) return blogUnavailableResponse(404);
      if (segments.length === 1 && !blogReservedSlugs.has(segments[0]) && segments[0] !== "feed.xml") {
        if (!blogSlugPattern.test(segments[0])) return blogUnavailableResponse(404);
        const result = await getBlogArticle(segments[0]);
        if (result.redirect) return NextResponse.redirect(new URL(result.redirect.path, request.url), 308);
      } else if (segments[0] === "page") {
        if (segments.length !== 2 || !/^[1-9]\d{0,3}$/.test(segments[1])) return blogUnavailableResponse(404);
        if (segments[1] === "1") return NextResponse.redirect(new URL("/blog", request.url), 308);
        const result = await getBlogPosts(new URLSearchParams({ limit: "12", page: segments[1] }));
        if (!result.posts.length) return blogUnavailableResponse(404);
      } else if (["category", "tag", "author"].includes(segments[0])) {
        if (segments.length !== 2 || !blogSlugPattern.test(segments[1])) return blogUnavailableResponse(404);
        const kind = ({ category: "categories", tag: "tags", author: "authors" } as const)[segments[0] as "category" | "tag" | "author"];
        await getBlogEntities(kind, segments[1]);
      } else if (segments.length && !((segments[0] === "search" || segments[0] === "feed.xml") && segments.length === 1)) return blogUnavailableResponse(404);
    }
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set("Cache-Control", "private, no-store");
    if (isBlogPreview(path) || segments[0] === "search") {
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
      response.headers.set("Referrer-Policy", "no-referrer");
    }
    return response;
  } catch (error) {
    return blogUnavailableResponse(error instanceof BlogUnavailable && [401, 404, 410].includes(error.status) ? error.status : 503);
  }
}
