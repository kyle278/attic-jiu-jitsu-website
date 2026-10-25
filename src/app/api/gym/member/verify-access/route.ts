import { buildSiteScopedBody, fetchPortalGym, jsonProxyResponse } from "@/lib/server/portal-gym-proxy";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const payload = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  try {
    const { response, baseUrl } = await fetchPortalGym("/api/websites/gym/member/verify-access", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: buildSiteScopedBody(payload),
    });

    return jsonProxyResponse(
      response,
      "Unable to verify gym member access right now.",
      baseUrl,
    );
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to verify gym member access right now.",
      },
      { status: 502 },
    );
  }
}
