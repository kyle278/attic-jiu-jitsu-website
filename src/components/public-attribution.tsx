"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const attributionKey = "attic-public-enquiry-attribution";
export const attributionFields = {
  utm_Campaign: "utm_campaign",
  utm_Source: "utm_source",
  utm_Medium: "utm_medium",
  utm_Content: "utm_content",
  utm_Term: "utm_term",
  CID: "cid",
} as const;
export function readAttribution(): Record<string, string> {
  try {
    if (
      window.localStorage.getItem("attic-analytics-consent-v1") !== "accepted"
    )
      return {};
    const stored: unknown = JSON.parse(
      window.sessionStorage.getItem(attributionKey) ?? "{}",
    );
    if (!stored || typeof stored !== "object") return {};
    return Object.fromEntries(
      Object.keys(attributionFields).flatMap((key) => {
        const value = (stored as Record<string, unknown>)[key];
        return typeof value === "string" ? [[key, value]] : [];
      }),
    );
  } catch {
    return {};
  }
}
export function PublicAttribution() {
  const pathname = usePathname();
  const query = useSearchParams().toString();
  useEffect(() => {
    if (location.pathname.startsWith("/blog/preview/") || new URLSearchParams(location.search).get("__ingenium_editor") === "1")
      return;
    function capture() {
      if (
        window.localStorage.getItem("attic-analytics-consent-v1") !== "accepted"
      )
        return;
      const params = new URL(window.location.href).searchParams;
      const campaign = Object.fromEntries(
        Object.entries(attributionFields).flatMap(([field, param]) => {
          const value = params.get(param);
          return value ? [[field, value]] : [];
        }),
      );
      // Only campaign fields are retained for this tab. Never store contact details or drafts.
      if (Object.keys(campaign).length) {
        try {
          window.sessionStorage.setItem(
            attributionKey,
            JSON.stringify({ ...readAttribution(), ...campaign }),
          );
        } catch {
          /* Direct URL capture works without storage. */
        }
      }
    }
    capture();
    window.addEventListener("attic:consent-changed", capture);
    return () => window.removeEventListener("attic:consent-changed", capture);
  }, [pathname, query]);
  return null;
}
