import type { MetadataRoute } from "next";

const baseUrl = "https://www.atticbjj.net";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/about-us", "/classes", "/memberships", "/gallery"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
  }));
}
