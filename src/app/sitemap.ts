import type { MetadataRoute } from "next";

import { WEBSITE_ORIGIN as baseUrl } from "@/portal/public";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/about-us",
    "/classes",
    "/memberships",
    "/gallery",
    "/privacy-policy",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));
}
