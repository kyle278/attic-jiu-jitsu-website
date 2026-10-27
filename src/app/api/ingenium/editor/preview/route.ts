import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { PORTAL_ORIGIN, PORTAL_SITE_ID } from "@/portal/public";
import {
  editorParentOrigins,
  portalHeaders,
} from "@/lib/website-editor/connection";
export const runtime = "nodejs";
export async function POST(req: Request) {
  if (req.headers.get("origin") !== new URL(req.url).origin)
    return NextResponse.json({ error: "Origin mismatch" }, { status: 403 });
  const secret = process.env.INGENIUM_EDITOR_SIGNING_SECRET;
  if (!secret)
    return NextResponse.json(
      { error: "Editor connection is not configured." },
      { status: 503 },
    );
  try {
    if (Number(req.headers.get("content-length")) > 10000)
      throw new Error("Payload too large");
    const input = await req.json();
    if (typeof input.token !== "string" || input.token.length > 3000)
      throw new Error("Invalid token");
    const parent = input.parent || PORTAL_ORIGIN;
    if (!editorParentOrigins().includes(parent))
      throw new Error("Unknown editor parent");
    const body = JSON.stringify({ siteId: PORTAL_SITE_ID, token: input.token }),
      timestamp = String(Date.now()),
      signature = createHmac("sha256", secret)
        .update(timestamp + "." + body)
        .digest("hex");
    const r = await fetch(parent + "/api/websites/editor/preview/exchange", {
      method: "POST",
      headers: {
        ...portalHeaders(parent),
        "Content-Type": "application/json",
        "X-Ingenium-Signature": signature,
        "X-Ingenium-Timestamp": timestamp,
      },
      body,
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(10000),
    });
    if (!r.ok)
      return NextResponse.json(
        { error: "Preview session expired or could not be verified." },
        { status: r.status },
      );
    return NextResponse.json(await r.json(), {
      headers: {
        "Cache-Control": "private, no-store",
        "X-Robots-Tag": "noindex",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Preview unavailable." },
      { status: 400 },
    );
  }
}
