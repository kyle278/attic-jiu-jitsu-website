"use client";

import { useEffect } from "react";

function track(eventType: string, properties: Record<string, unknown>) {
  window.IngeniumTracker?.track(eventType, {}, properties);
}

export function AnalyticsBindings() {
  useEffect(() => {
    const scrollMarks = new Set<number>();
    const thresholds = [25, 50, 75, 100];
    const startedAt = Date.now();

    const clickHandler = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-track]") : null;
      if (!target) return;

      const eventType = target.dataset.track;
      if (!eventType) return;

      track(eventType, {
        label: target.dataset.label ?? target.textContent?.trim() ?? "interaction",
        location: target.dataset.location ?? "unknown",
        href: target instanceof HTMLAnchorElement ? target.href : target.dataset.href ?? null,
      });
    };

    const scrollHandler = () => {
      const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (pageHeight <= 0) return;

      const depth = Math.min(100, Math.round((window.scrollY / pageHeight) * 100));
      thresholds.forEach((threshold) => {
        if (depth >= threshold && !scrollMarks.has(threshold)) {
          scrollMarks.add(threshold);
          track("scroll_depth", { depth_percent: threshold });
        }
      });
    };

    const recordTime = () => {
      const seconds = Math.max(1, Math.round((Date.now() - startedAt) / 1000));
      track("time_on_page", { seconds_on_page: seconds });
    };

    const visibilityHandler = () => {
      if (document.visibilityState === "hidden") {
        recordTime();
      }
    };

    document.addEventListener("click", clickHandler);
    window.addEventListener("scroll", scrollHandler, { passive: true });
    document.addEventListener("visibilitychange", visibilityHandler);
    window.addEventListener("beforeunload", recordTime);

    return () => {
      document.removeEventListener("click", clickHandler);
      window.removeEventListener("scroll", scrollHandler);
      document.removeEventListener("visibilitychange", visibilityHandler);
      window.removeEventListener("beforeunload", recordTime);
    };
  }, []);

  return null;
}
