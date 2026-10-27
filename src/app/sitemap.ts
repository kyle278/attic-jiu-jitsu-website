import type { MetadataRoute } from "next";

import { WEBSITE_ORIGIN as baseUrl } from "@/portal/public";
import { landingPages, contentUpdated } from "@/lib/seo-content";
import { guides } from "@/lib/fitness-guides";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/about-us",
    "/classes",
    "/memberships",
    "/gallery",
    "/privacy-policy",
    "/blog",
    ...landingPages.map((page) => `/${page.slug}`),
    ...guides.map((page) => `/blog/${page.slug}`),
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    // Change this with substantive content edits, not on every request/build.
    lastModified: contentUpdated,
  }));
}
