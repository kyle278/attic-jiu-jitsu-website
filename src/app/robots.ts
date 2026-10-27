import type { MetadataRoute } from "next";
import { WEBSITE_ORIGIN } from "@/portal/public";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/members/",
    },
    sitemap: `${WEBSITE_ORIGIN}/sitemap.xml`,
  };
}
