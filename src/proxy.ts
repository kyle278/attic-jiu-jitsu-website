import { NextResponse, type NextRequest } from "next/server";
import { readSeoRevision } from "@/portal/seo/runtime";
import { PORTAL_ORIGIN } from "@/portal/public";
import { isBlogPath } from "@/lib/blog/routing";
import { blogProxy } from "@/lib/blog/proxy";
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname,
    preview = request.nextUrl.searchParams.get("__ingenium_editor") === "1";
  const h = new Headers(request.headers);
  h.set("x-ingenium-path", path);
  h.set("x-attic-editor-preview", preview ? "1" : "0");
  h.set("x-ingenium-editor-verify", request.nextUrl.searchParams.has("__editor_verify") ? "1" : "0");
  if (isBlogPath(path)) {
    h.delete("x-ingenium-seo-revision");
    const response = await blogProxy(request, h);
    if (preview) {
      response.headers.set("Content-Security-Policy", `frame-ancestors 'self' ${PORTAL_ORIGIN}`);
      response.headers.set("X-Robots-Tag", "noindex, nofollow");
      response.headers.set("Cache-Control", "private, no-store");
      response.headers.set("Referrer-Policy", "no-referrer");
    }
    return response;
  }
  const revision = await readSeoRevision(true);
  if (!preview) {
    const rule = revision?.snapshot.redirects.find((r) => r.source === path);
    if (rule && [301, 302, 307, 308].includes(rule.status)) {
      const target = new URL(rule.target, request.url);
      if (
        target.origin === request.nextUrl.origin &&
        target.pathname !== "/members" &&
        !target.pathname.startsWith("/members/") &&
        !target.pathname.startsWith("/api/")
      )
        return NextResponse.redirect(target, rule.status);
    }
  }
  if (revision) h.set("x-ingenium-seo-revision", revision.id);
  else h.delete("x-ingenium-seo-revision");
  const response = NextResponse.next({ request: { headers: h } });
  if (preview) {
    response.headers.set(
      "Content-Security-Policy",
      `frame-ancestors 'self' ${PORTAL_ORIGIN}`,
    );
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    response.headers.set("Referrer-Policy", "no-referrer");
  }
  return response;
}
export const config = {
  matcher: ["/blog/:path*", "/((?!api(?:/|$)|_next(?:/|$)|members(?:/|$)|.*\\..*).*)"],
};
