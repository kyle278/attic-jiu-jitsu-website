import { NextResponse, type NextRequest } from "next/server";
import { readSeoRevision } from "@/portal/seo/runtime";
import { PORTAL_ORIGIN } from "@/portal/public";
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname,
    preview = request.nextUrl.searchParams.get("__ingenium_editor") === "1",
    revision = await readSeoRevision(true);
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
  const h = new Headers(request.headers);
  h.set("x-ingenium-path", path);
  h.set("x-attic-editor-preview", preview ? "1" : "0");
  h.set(
    "x-ingenium-editor-verify",
    request.nextUrl.searchParams.has("__editor_verify") ? "1" : "0",
  );
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
  matcher: ["/((?!api(?:/|$)|_next(?:/|$)|members(?:/|$)|.*\\..*).*)"],
};
