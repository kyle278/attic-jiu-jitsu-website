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
      getVisitorId?: () => string | null;
      getSessionId?: () => string | null;
    };
    __atticIngeniumInitialized?: boolean;
  }
}

const TRACKING_ENDPOINT = "https://portal.ingeniumconsulting.net/api/websites/tracking/events";
const SITE_ID = "8b0e89c9-3090-46b2-b008-4d5c46233647";

function initTracker() {
  if (!window.IngeniumTracker) {
    return false;
  }

  if (window.__atticIngeniumInitialized || window.IngeniumTracker.getConfig?.()) {
    window.__atticIngeniumInitialized = true;
    return true;
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

function isOutboundLink(anchor: HTMLAnchorElement) {
  try {
    const url = new URL(anchor.href, window.location.href);
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
}

function isDownloadLink(anchor: HTMLAnchorElement) {
  if (anchor.hasAttribute("download")) {
    return true;
  }

  return /\.(pdf|doc|docx|xls|xlsx|zip)$/i.test(anchor.pathname);
}

function trackEvent(eventType: string, properties: Record<string, unknown>) {
  if (!window.__atticIngeniumInitialized || !window.IngeniumTracker?.track) {
    return;
  }

  window.IngeniumTracker.track(eventType, {}, properties);
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
    const seenFormViews = new WeakSet<HTMLFormElement>();

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

      trackEvent("scroll_depth", {
        ...pageContext,
        depth_percent: maxScrollDepth,
      });
      trackEvent("time_on_page", {
        ...pageContext,
        seconds_on_page: Math.max(1, Math.round((Date.now() - startedAt) / 1000)),
      });
    };

    const clickHandler = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-ingenium-event],a,button") : null;

      if (!target) {
        return;
      }

      const label = target.dataset.ingeniumLabel ?? target.textContent?.trim() ?? "interaction";
      const location = target.dataset.ingeniumLocation ?? pathname;
      const anchor = target instanceof HTMLAnchorElement ? target : target.closest<HTMLAnchorElement>("a");
      const href = anchor?.href ?? null;

      if (target.dataset.ingeniumEvent) {
        trackEvent(target.dataset.ingeniumEvent, {
          ...pageContext,
          label,
          location,
          href,
          value: target.dataset.ingeniumValue ?? null,
        });
        return;
      }

      if (!anchor) {
        return;
      }

      if (anchor.href.startsWith("tel:")) {
        trackEvent("phone_click", { ...pageContext, label, location, href: anchor.href });
        return;
      }

      if (anchor.href.startsWith("mailto:")) {
        trackEvent("email_click", { ...pageContext, label, location, href: anchor.href });
        return;
      }

      if (isDownloadLink(anchor)) {
        trackEvent("download_click", { ...pageContext, label, location, href: anchor.href });
        return;
      }

      if (isOutboundLink(anchor)) {
        trackEvent("outbound_link_click", { ...pageContext, label, location, href: anchor.href });
      }
    };

    const detailsHandlers = Array.from(
      document.querySelectorAll<HTMLDetailsElement>("details[data-ingenium-event]"),
    ).map((details) => {
      const onToggle = () => {
        if (!details.open) {
          return;
        }

        trackEvent(details.dataset.ingeniumEvent ?? "accordion_expand", {
          ...pageContext,
          label: details.dataset.ingeniumLabel ?? details.querySelector("summary")?.textContent?.trim() ?? "details",
          location: details.dataset.ingeniumLocation ?? pathname,
        });
      };

      details.addEventListener("toggle", onToggle);
      return { details, onToggle };
    });

    const formObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          const form = entry.target as HTMLFormElement;
          if (seenFormViews.has(form)) {
            return;
          }

          seenFormViews.add(form);
          trackEvent("form_view", {
            ...pageContext,
            form_slug: form.dataset.formSlug ?? null,
            form_id: form.dataset.formId ?? null,
            label: form.dataset.ingeniumFormLabel ?? form.getAttribute("aria-label") ?? "form",
          });
        });
      },
      { threshold: 0.35 },
    );

    document
      .querySelectorAll<HTMLFormElement>('form[data-ingenium-submit="portal"]')
      .forEach((form) => formObserver.observe(form));

    const handlePageHide = () => {
      sendPageMetrics();
    };

    trackEvent("page_view", pageContext);
    window.addEventListener("scroll", updateScrollDepth, { passive: true });
    window.addEventListener("resize", updateScrollDepth);
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("click", clickHandler);

    return () => {
      window.removeEventListener("scroll", updateScrollDepth);
      window.removeEventListener("resize", updateScrollDepth);
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("click", clickHandler);
      detailsHandlers.forEach(({ details, onToggle }) => details.removeEventListener("toggle", onToggle));
      formObserver.disconnect();
      sendPageMetrics();
    };
  }, [pathname]);

  return null;
}
