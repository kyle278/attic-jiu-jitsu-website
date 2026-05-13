import rawPortalConnect from "../../portal-connect.json";

type PortalConnectShape = {
  siteId: string;
  localPortalBaseUrl: string;
  productionPortalBaseUrl: string;
};

const parsedPortalConnect = rawPortalConnect as PortalConnectShape;

export const portalConnect = {
  ...parsedPortalConnect,
  schedulePath: "/classes#live-schedule",
  membershipsPath: "/memberships#live-plans",
  memberAreaPath: "/memberships#member-area",
} as const;

export const portalGymBaseUrls = Array.from(
  new Set(
    [
      parsedPortalConnect.localPortalBaseUrl,
      parsedPortalConnect.productionPortalBaseUrl,
    ]
      .map((value) => value.trim())
      .filter(Boolean),
  ),
);

export const portalTrackingScriptSrc = `${parsedPortalConnect.productionPortalBaseUrl}/ingenium-tracker.js`;
export const portalTrackingEndpoint = `${parsedPortalConnect.productionPortalBaseUrl}/api/websites/tracking/events`;
