import { cookies } from "next/headers";
import { portalConnect } from "@/lib/portal-connect";
import { forwardMemberRequest } from "@/lib/server/member-proxy";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST(req: Request) {
  return forwardMemberRequest(req, {
    production: process.env.NODE_ENV === "production",
    key: process.env.BOOKING_MEMBER_PROXY_KEY,
    siteId: portalConnect.siteId,
    portalBaseUrl: portalConnect.productionPortalBaseUrl,
    store: await cookies(),
  });
}
