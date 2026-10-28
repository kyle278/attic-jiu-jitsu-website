"use client";
import Script from "next/script";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { PORTAL_ORIGIN, TRACKING_SITE_KEY } from "@/portal/public";
import { attributionKey } from "./public-attribution";

export const consentKey = "attic-analytics-consent-v1";
type SiteSdk = {
  init: (config: {
    siteKey: string;
    portalOrigin: string;
    analyticsConsent: boolean;
  }) => void;
  setConsent: (allowed: boolean) => void;
  track: (
    name: string,
    properties?: Record<string, string | number | boolean | null>,
  ) => void;
  flush: () => Promise<void>;
  context: () => { visitor_id?: string; session_id?: string } | null;
};
declare global {
  interface Window {
    IngeniumSite?: SiteSdk;
  }
}
export function analyticsAllowed() {
  try {
    return localStorage.getItem(consentKey) === "accepted";
  } catch {
    return false;
  }
}
export function isEditorSession() {
  return location.pathname.startsWith("/blog/preview/") || new URLSearchParams(location.search).get("__ingenium_editor") === "1";
}
export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      className="privacy-preferences"
      onClick={() =>
        window.dispatchEvent(new Event("attic:privacy-preferences"))
      }
    >
      Cookie preferences
    </button>
  );
}
export function PortalRuntime() {
  const path = usePathname(),
    [ready, setReady] = useState(false),
    [choice, setChoice] = useState<string | null>(null),
    [open, setOpen] = useState(false),
    [preview, setPreview] = useState(true);
  const lastPath = useRef(""),
    pop = useRef<string | null>(null);
  useEffect(() => {
    const editing = isEditorSession();
    const frame = requestAnimationFrame(() => {
      setPreview(editing);
      if (editing) return;
      let saved = null;
      try {
        saved = localStorage.getItem(consentKey);
      } catch {}
      setChoice(saved);
      setOpen(saved !== "accepted" && saved !== "declined");
    });
    const show = () => setOpen(true),
      back = () => {
        pop.current = location.pathname;
      };
    window.addEventListener("attic:privacy-preferences", show);
    window.addEventListener("popstate", back);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("attic:privacy-preferences", show);
      window.removeEventListener("popstate", back);
    };
  }, []);
  useEffect(() => {
    if (!ready || preview || !window.IngeniumSite) return;
    const allowed = choice === "accepted";
    window.IngeniumSite.setConsent(allowed);
    lastPath.current = location.pathname;
  }, [ready, choice, preview]);
  useEffect(() => {
    if (!ready || preview || isEditorSession() || choice !== "accepted") return;
    if (lastPath.current !== path) {
      if (pop.current !== path) window.IngeniumSite?.track("page_view");
      lastPath.current = path;
    }
    pop.current = null;
    const started = Date.now();
    let depth = 0,
      sent = false;
    const scroll = () => {
      depth = Math.max(
        depth,
        Math.min(
          100,
          Math.round(
            ((scrollY + innerHeight) /
              Math.max(document.documentElement.scrollHeight, 1)) *
              100,
          ),
        ),
      );
    };
    scroll();
    const click = (e: MouseEvent) => {
      const a = (e.target as Element)?.closest?.("a");
      if (!a || a.hasAttribute("data-ingenium-event")) return;
      const href = a.getAttribute("href") || "";
      const kind = href.startsWith("tel:")
        ? "phone_click"
        : href.startsWith("mailto:")
          ? "email_click"
          : a.origin !== location.origin
            ? "outbound_link_click"
            : null;
      if (kind)
        window.IngeniumSite?.track(kind, {
          label: (a.textContent || "").trim().slice(0, 100),
        });
    };
    const finish = () => {
      if (sent || isEditorSession()) return;
      sent = true;
      window.IngeniumSite?.track("scroll_depth", { depth_percent: depth });
      window.IngeniumSite?.track("time_on_page", {
        seconds_on_page: Math.round((Date.now() - started) / 1000),
      });
      void window.IngeniumSite?.flush();
    };
    const formViews = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !formViews.has(entry.target)) {
            formViews.add(entry.target);
            window.IngeniumSite?.track("form_view", { form_slug: "contact" });
          }
        }
      },
      { threshold: 0.2 },
    );
    document
      .querySelectorAll('form[data-form-slug="contact"]')
      .forEach((form) => observer.observe(form));
    const detail = (event: Event) => {
      const target = event.target;
      if (
        target instanceof HTMLDetailsElement &&
        target.open &&
        target.closest(".faq-list")
      )
        window.IngeniumSite?.track("faq_expand", {
          label:
            target
              .querySelector("summary")
              ?.textContent?.trim()
              .slice(0, 120) || "Question",
        });
    };
    document.addEventListener("toggle", detail, true);
    window.addEventListener("scroll", scroll, { passive: true });
    document.addEventListener("click", click);
    window.addEventListener("pagehide", finish, { once: true });
    return () => {
      observer.disconnect();
      document.removeEventListener("toggle", detail, true);
      window.removeEventListener("scroll", scroll);
      document.removeEventListener("click", click);
      window.removeEventListener("pagehide", finish);
      if (analyticsAllowed()) finish();
    };
  }, [path, ready, choice, preview]);
  function choose(value: "accepted" | "declined") {
    try {
      localStorage.setItem(consentKey, value);
      if (value === "declined") {
        sessionStorage.removeItem(attributionKey);
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key?.startsWith("ingenium_tracker")) localStorage.removeItem(key);
        }
      }
    } catch {}
    setChoice(value);
    setOpen(false);
    window.dispatchEvent(new Event("attic:consent-changed"));
  }
  if (preview) return null;
  return (
    <>
      <Script
        id="attic-portal-v2"
        src={`${PORTAL_ORIGIN}/ingenium-site-v2.js`}
        strategy="afterInteractive"
        onReady={() => {
          window.IngeniumSite?.init({
            siteKey: TRACKING_SITE_KEY,
            portalOrigin: PORTAL_ORIGIN,
            analyticsConsent: false,
          });
          setReady(true);
        }}
      />
      {open && (
        <aside className="cookie-choice" aria-label="Cookie preferences">
          <div>
            <h2>A choice about cookies</h2>
            <p>
              Optional analytics help us understand how the website is used.
              Enquiries and member bookings work without them.{" "}
              <Link href="/privacy-policy">Read our privacy policy</Link>.
            </p>
          </div>
          <div className="cookie-actions">
            <button
              className="button button-outline"
              type="button"
              onClick={() => choose("declined")}
            >
              Decline analytics
            </button>
            <button
              className="button button-primary"
              type="button"
              onClick={() => choose("accepted")}
            >
              Allow analytics
            </button>
          </div>
        </aside>
      )}
    </>
  );
}
