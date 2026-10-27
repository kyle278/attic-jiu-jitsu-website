import { revalidatePath, revalidateTag } from "next/cache";
import { createSeoReceiver } from "@/portal/seo/seo-receiver";
import { configuration, readSeoRevision, SEO_TAG } from "@/portal/seo/runtime";
import { PORTAL_ORIGIN, WEBSITE_ORIGIN } from "@/portal/public";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(request: Request) {
  const config = configuration(),
    secret = process.env.INGENIUM_SEO_SIGNING_SECRET?.trim();
  if (!config || !secret)
    return Response.json(
      { error: "SEO connection unavailable" },
      { status: 503 },
    );
  return createSeoReceiver({
    portalOrigin: PORTAL_ORIGIN,
    siteKey: config.key,
    snapshotBaseUrl: config.base,
    secret,
    apply: async (release) => {
      const current = await readSeoRevision(true);
      if (current?.id !== release.id || current.revision !== release.revision)
        throw Error("Manifest does not serve the delivered revision");
      revalidateTag(SEO_TAG, { expire: 0 });
      revalidatePath("/", "layout");
      const r = await fetch(
          `${WEBSITE_ORIGIN}/?__ingenium_seo_probe=${release.id}`,
          { cache: "no-store", signal: AbortSignal.timeout(25000) },
        ),
        html = await r.text();
      if (
        !r.ok ||
        !html.includes(`name="ingenium-seo-revision" content="${release.id}"`)
      )
        throw Error("Live renderer has not served this revision");
      return { id: current.id, revision: current.revision };
    },
  })(request);
}
