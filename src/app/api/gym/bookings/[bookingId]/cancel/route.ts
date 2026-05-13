import { buildSiteScopedBody, fetchPortalGym, jsonProxyResponse } from "@/lib/server/portal-gym-proxy";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ bookingId: string }> },
) {
  const resolvedParams = await params;
  const authorization = req.headers.get("authorization");
  const payload = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  try {
    const { response, baseUrl } = await fetchPortalGym(
      `/api/websites/gym/bookings/${encodeURIComponent(resolvedParams.bookingId)}/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
          ...(authorization ? { Authorization: authorization } : {}),
        },
        body: buildSiteScopedBody(payload),
      },
    );

    return jsonProxyResponse(
      response,
      "Unable to cancel the booking right now.",
      baseUrl,
    );
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to cancel the booking right now.",
      },
      { status: 502 },
    );
  }
}
