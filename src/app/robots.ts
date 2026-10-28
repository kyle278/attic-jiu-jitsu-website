import type { MetadataRoute } from "next";
import { WEBSITE_ORIGIN } from "@/portal/public";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/members$", "/members/", "/api/", "/blog/preview/", "/blog/search", "/*?*__ingenium_editor=", "/*?*__editor_verify="],
    },
    sitemap: `${WEBSITE_ORIGIN}/sitemap.xml`,
  };
}
