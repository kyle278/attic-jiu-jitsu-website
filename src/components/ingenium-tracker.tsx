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
  const pageHeight = document.documentElement.scrollHeight - window.innerHeight;

  if (pageHeight <= 0) {
    return 100;
  }

  return Math.min(100, Math.max(0, Math.round((window.scrollY / pageHeight) * 100)));
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
    const pageProperties = () => ({
      path: pathname,
      url: window.location.href,
      title: document.title,
    });

    const handleScroll = () => {
      maxScrollDepth = Math.max(maxScrollDepth, getScrollDepthPercent());
    };

    const sendPageMetrics = () => {
      if (metricsSent) {
        return;
      }

      metricsSent = true;

      track("scroll_depth", {}, {
        ...pageProperties(),
        depth_percent: maxScrollDepth,
      });
      track("time_on_page", {}, {
        ...pageProperties(),
        seconds_on_page: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
      });
    };

    const handlePageHide = () => {
      sendPageMetrics();
    };

    window.IngeniumTracker.track("page_view", {}, {
      ...pageProperties(),
    });
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("pagehide", handlePageHide);
      sendPageMetrics();
    };
  }, [pathname]);

  return null;
}
