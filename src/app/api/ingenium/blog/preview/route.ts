import { NextResponse } from "next/server";
import { signedBlogRequest } from "@/lib/blog/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const privateHeaders = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow", "Referrer-Policy": "no-referrer" };
export async function GET(request: Request) {
  const url = new URL(request.url);
  if (url.searchParams.has("exit")) {
    const response = NextResponse.redirect(new URL("/blog", url.origin));
    response.cookies.set("attic-blog-preview", "", { path: "/blog", httpOnly: true, secure: true, sameSite: "lax", maxAge: 0 });
    Object.entries(privateHeaders).forEach(([key, value]) => response.headers.set(key, value));
    return response;
  }
  const code = url.searchParams.get("code");
  if (!code || !/^[A-Za-z0-9_-]{43}$/.test(code)) return new Response("Invalid preview code.", { status: 401, headers: privateHeaders });
  try {
    const preview = await signedBlogRequest("exchange", { code });
    if (!preview.session) throw new Error("Preview session missing.");
    const response = NextResponse.redirect(new URL(`/blog/preview/${preview.post.id}`, url.origin));
    response.cookies.set("attic-blog-preview", preview.session, { path: "/blog", httpOnly: true, secure: true, sameSite: "lax", maxAge: Math.min(900, Math.max(0, Math.floor((Date.parse(preview.expires_at) - Date.now()) / 1000))) });
    Object.entries(privateHeaders).forEach(([key, value]) => response.headers.set(key, value));
    return response;
  } catch { return new Response("This preview has expired, was revoked or has already been opened. Create a new preview in Portal.", { status: 401, headers: privateHeaders }); }
}
