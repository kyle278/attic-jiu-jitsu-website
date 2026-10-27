import { createHmac, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { EDITOR_TAG, getEditorRelease } from "@/lib/website-editor/server";
import { PORTAL_SITE_ID } from "@/portal/public";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const secret = process.env.INGENIUM_EDITOR_SIGNING_SECRET,
    t = req.headers.get("x-ingenium-timestamp") || "",
    sig = req.headers.get("x-ingenium-signature") || "";
  if (
    !secret ||
    !/^\d{13}$/.test(t) ||
    Math.abs(Date.now() - Number(t)) > 300000 ||
    !/^[a-f0-9]{64}$/.test(sig)
  )
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  const body = await req.text();
  if (body.length > 16000)
    return NextResponse.json({ error: "Payload too large." }, { status: 413 });
  const expected = createHmac("sha256", secret)
    .update(t + "." + body)
    .digest("hex");
  if (!timingSafeEqual(Buffer.from(expected), Buffer.from(sig)))
    return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
  try {
    const data = JSON.parse(body);
    const paths = [
      "/",
      "/about-us",
      "/classes",
      "/memberships",
      "/gallery",
      "/privacy-policy",
    ];
    if (
      data.type !== "editor.release" ||
      data.siteId !== PORTAL_SITE_ID ||
      data.registry !== "ingenium-v1" ||
      !/^[a-f0-9-]{36}$/i.test(data.releaseId) ||
      !Number.isSafeInteger(data.generation) ||
      data.generation < 1 ||
      !Array.isArray(data.paths) ||
      data.paths.some(
        (p: unknown) => typeof p !== "string" || !paths.includes(p),
      )
    )
      throw new Error("Invalid release");
    revalidateTag(EDITOR_TAG, { expire: 0 });
    for (const p of data.paths) revalidatePath(p, "page");
    const active = await getEditorRelease();
    if (
      active.releaseId !== data.releaseId ||
      active.generation !== data.generation
    )
      throw new Error("Authoritative release does not match");
    return NextResponse.json(
      {
        acknowledged: true,
        releaseId: data.releaseId,
        generation: data.generation,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ error: "Invalid release." }, { status: 422 });
  }
}
