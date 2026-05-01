"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    IngeniumTracker?: {
      init: (config: { endpoint: string; siteId: string }) => void;
      track?: (
        eventType: string,
        context?: Record<string, unknown>,
        properties?: Record<string, unknown>,
      ) => void;
      getConfig?: () => unknown;
    };
    __atticIngeniumInitialized?: boolean;
  }
}

const TRACKING_ENDPOINT = "https://portal.ingeniumconsulting.net/api/websites/tracking/events";
const SITE_ID = "8b0e89c9-3090-46b2-b008-4d5c46233647";

function initTracker() {
  if (!window.IngeniumTracker || window.__atticIngeniumInitialized) {
    return Boolean(window.__atticIngeniumInitialized);
  }

  window.IngeniumTracker.init({
    endpoint: TRACKING_ENDPOINT,
    siteId: SITE_ID,
  });
  window.__atticIngeniumInitialized = true;
  return true;
}

function getScrollDepthPercent() {
  const documentHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body?.scrollHeight ?? 0,
  );

  if (documentHeight <= 0) {
    return 0;
  }

  if (documentHeight <= window.innerHeight) {
    return 100;
  }

  const viewedHeight = Math.min(documentHeight, window.scrollY + window.innerHeight);

  return Math.min(100, Math.max(0, Math.round((viewedHeight / documentHeight) * 100)));
}

export function IngeniumTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (initTracker()) {
      return;
    }

    let attempts = 0;
    const maxAttempts = 30;

    const interval = window.setInterval(() => {
      attempts += 1;
      if (initTracker() || attempts >= maxAttempts) {
        window.clearInterval(interval);
      }
    }, 250);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!window.__atticIngeniumInitialized || !window.IngeniumTracker?.track) {
      return;
    }

    const startedAt = Date.now();
    let maxScrollDepth = getScrollDepthPercent();
    let metricsSent = false;

    const track = window.IngeniumTracker.track;
    const pageContext = {
      path: pathname,
      url: window.location.href,
      title: document.title,
    };

    const updateScrollDepth = () => {
      maxScrollDepth = Math.max(maxScrollDepth, getScrollDepthPercent());
    };

    const sendPageMetrics = () => {
      if (metricsSent) {
        return;
      }

      metricsSent = true;

      track("scroll_depth", {}, {
        ...pageContext,
        depth_percent: maxScrollDepth,
      });
      track("time_on_page", {}, {
        ...pageContext,
        seconds_on_page: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
      });
    };

    const handlePageHide = () => {
      sendPageMetrics();
    };

    window.IngeniumTracker.track("page_view", {}, {
      ...pageContext,
    });
    window.addEventListener("scroll", updateScrollDepth, { passive: true });
    window.addEventListener("resize", updateScrollDepth);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("scroll", updateScrollDepth);
      window.removeEventListener("resize", updateScrollDepth);
      window.removeEventListener("pagehide", handlePageHide);
      sendPageMetrics();
    };
  }, [pathname]);

  return null;
}
