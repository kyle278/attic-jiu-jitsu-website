import { buildSiteScopedBody, fetchPortalGym, jsonProxyResponse } from "@/lib/server/portal-gym-proxy";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const authorization = req.headers.get("authorization");
  const payload = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  try {
    const { response, baseUrl } = await fetchPortalGym("/api/websites/gym/bookings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        ...(authorization ? { Authorization: authorization } : {}),
      },
      body: buildSiteScopedBody(payload),
    });

    return jsonProxyResponse(
      response,
      "Unable to create the booking right now.",
      baseUrl,
    );
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create the booking right now.",
      },
      { status: 502 },
    );
  }
}
