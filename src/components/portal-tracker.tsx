"use client";

import Script from "next/script";
import { useEffect } from "react";

const portalAppUrl = process.env.NEXT_PUBLIC_PORTAL_TRACKING_ENDPOINT
  ? undefined
  : process.env.PORTAL_APP_URL;

const trackingEndpoint =
  process.env.NEXT_PUBLIC_PORTAL_TRACKING_ENDPOINT ||
  (portalAppUrl ? `${portalAppUrl.replace(/\/$/, "")}/api/websites/tracking/events` : "");

const trackerScriptUrl = portalAppUrl ? `${portalAppUrl.replace(/\/$/, "")}/ingenium-tracker.js` : "";
const siteId = process.env.NEXT_PUBLIC_PORTAL_SITE_ID || process.env.PORTAL_SITE_ID || "";

export function PortalTracker() {
  useEffect(() => {
    if (!trackingEndpoint || !siteId) return;

    let attempts = 0;
    const maxAttempts = 30;

    const tryInit = () => {
      if (window.__atticTrackerInitialized) return true;
      if (!window.IngeniumTracker) return false;

      window.IngeniumTracker.init?.({
        endpoint: trackingEndpoint,
        siteId,
      });
      window.__atticTrackerInitialized = true;
      return true;
    };

    if (tryInit()) return;

    const interval = window.setInterval(() => {
      attempts += 1;
      if (tryInit() || attempts >= maxAttempts) {
        window.clearInterval(interval);
      }
    }, 350);

    return () => window.clearInterval(interval);
  }, []);

  if (!trackerScriptUrl || !trackingEndpoint || !siteId) {
    return null;
  }

  return <Script src={trackerScriptUrl} strategy="afterInteractive" />;
}
