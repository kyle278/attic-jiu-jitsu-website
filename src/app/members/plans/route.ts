import { portalConnect } from "@/lib/portal-connect";
import { memberPlansFromManifest } from "@/lib/member-plans";
import { fetchPortalGym } from "@/lib/server/portal-gym-proxy";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET() {
  const headers = { "Cache-Control": "no-store, private" };
  try {
    // Public plan content only, using the same published Portal feed as the
    // website. No snapshot fallback for member plan selection or pricing.
    const { response } = await fetchPortalGym(
      `/api/websites/gym/sync?site_id=${encodeURIComponent(portalConnect.siteId)}`,
      { headers: { accept: "application/json" }, signal: AbortSignal.timeout(8000) },
    );
    if (!response.ok) throw new Error("Catalogue unavailable");
    return Response.json({
      plans: memberPlansFromManifest(await response.json(), portalConnect.siteId),
      // Browsing published prices is separate from payment enablement. This
      // remains closed until merchant checkout and fulfilment are configured.
      purchasing_enabled: false,
    }, { headers });
  } catch {
    return Response.json({ error: "We couldn’t load the latest memberships. Please try again." }, { status: 503, headers });
  }
}
