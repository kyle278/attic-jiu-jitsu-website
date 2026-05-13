import { portalConnect } from "@/lib/portal-connect";
import { fetchPortalGym, jsonProxyResponse } from "@/lib/server/portal-gym-proxy";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const authorization = req.headers.get("authorization");

  try {
    const { response, baseUrl } = await fetchPortalGym(
      `/api/websites/gym/member/summary?site_id=${encodeURIComponent(portalConnect.siteId)}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          ...(authorization ? { Authorization: authorization } : {}),
        },
      },
    );

    return jsonProxyResponse(
      response,
      "Unable to load the member summary right now.",
      baseUrl,
    );
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to load the member summary right now.",
      },
      { status: 502 },
    );
  }
}
