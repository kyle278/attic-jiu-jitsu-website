import "server-only";
import { cache } from "react";
import { headers } from "next/headers";
import { EMPTY, type Snapshot } from "./types";
import { portalHeaders } from "./connection";
export const EDITOR_TAG = "ingenium-website-editor-v1";
export const getEditorRelease = cache(async () => {
  const requestHeaders = await headers();
  const stage = process.env.INGENIUM_EDITOR_STAGING_WEBSITE_ORIGIN;
  const isStage = !!stage && requestHeaders.get("host") === new URL(stage).host;
  const key = process.env.INGENIUM_EDITOR_SITE_KEY,
    origin =
      (isStage
        ? process.env.INGENIUM_EDITOR_STAGING_PORTAL_ORIGIN
        : undefined) ||
      process.env.INGENIUM_PORTAL_ORIGIN ||
      "https://portal.ingeniumconsulting.net";
  if (!key || !/^editor_[a-f0-9]{32}$/.test(key))
    return { releaseId: "baseline", generation: 0, snapshot: EMPTY };
  const fresh = (await headers()).get("x-ingenium-editor-verify") === "1";
  try {
    const r = await fetch(origin + "/api/websites/editor/public/v1/" + key, {
      headers: portalHeaders(origin),
      ...(fresh
        ? { cache: "no-store" as const }
        : {
            cache: "force-cache" as const,
            next: { revalidate: 15, tags: [EDITOR_TAG] },
          }),
      signal: AbortSignal.timeout(7000),
      redirect: "error",
    });
    if (!r.ok) throw new Error("Editor release unavailable");
    const v = await r.json();
    if (
      v.schemaVersion !== 1 ||
      v.registry !== "ingenium-v1" ||
      !v.releaseId ||
      !v.snapshot?.values ||
      !v.snapshot?.orders ||
      !Array.isArray(v.snapshot?.extras)
    )
      throw new Error("Invalid editor release");
    return v as { releaseId: string; generation: number; snapshot: Snapshot };
  } catch {
    // Next's persistent data cache retains successful releases during transient revalidation failures.
    // A site that has never loaded a release can still render its packaged production baseline.
    return { releaseId: "baseline", generation: 0, snapshot: EMPTY };
  }
});
