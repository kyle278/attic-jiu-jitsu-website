import { landingPage } from "@/lib/seo-content";
import { WEBSITE_ORIGIN } from "@/portal/public";

export function contentSchemas(path: string): Record<string, unknown>[] {
  const content = landingPage(path.slice(1));
  if (!content) return [];
  const url = new URL(path, WEBSITE_ORIGIN).href;
  const crumbs = [{ "@type": "ListItem", position: 1, name: "Home", item: WEBSITE_ORIGIN }];
  crumbs.push({ "@type": "ListItem", position: crumbs.length + 1, name: content?.heading || "Fitness & BJJ guides", item: url });
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: crumbs };
  return [breadcrumb, {
    "@context": "https://schema.org", "@type": "WebPage", "@id": `${url}#webpage`,
    url, name: content.heading, description: content.description, inLanguage: "en-IE",
    about: { "@id": `${WEBSITE_ORIGIN}/#academy` },
  }];
}
