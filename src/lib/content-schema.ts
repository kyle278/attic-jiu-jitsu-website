import { landingPage, contentUpdated } from "@/lib/seo-content";
import { guide, guides } from "@/lib/fitness-guides";
import { WEBSITE_ORIGIN } from "@/portal/public";

export function contentSchemas(path: string): Record<string, unknown>[] {
  const isArticle = path.startsWith("/blog/");
  const content = isArticle ? guide(path.slice(6)) : landingPage(path.slice(1));
  if (!content && path !== "/blog") return [];
  const url = new URL(path, WEBSITE_ORIGIN).href;
  const crumbs = [{ "@type": "ListItem", position: 1, name: "Home", item: WEBSITE_ORIGIN }];
  if (isArticle) crumbs.push({ "@type": "ListItem", position: 2, name: "Fitness & BJJ guides", item: `${WEBSITE_ORIGIN}/blog` });
  crumbs.push({ "@type": "ListItem", position: crumbs.length + 1, name: content?.heading || "Fitness & BJJ guides", item: url });
  const breadcrumb = { "@context": "https://schema.org", "@type": "BreadcrumbList", "@id": `${url}#breadcrumb`, itemListElement: crumbs };
  if (!content) return [breadcrumb, {
    "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${url}#webpage`, url,
    name: "Fitness and jiu-jitsu guides", inLanguage: "en-IE", breadcrumb: { "@id": `${url}#breadcrumb` },
    mainEntity: { "@type": "ItemList", itemListElement: guides.map((entry, index) => ({ "@type": "ListItem", position: index + 1, url: `${url}/${entry.slug}`, name: entry.heading })) },
  }];
  return [breadcrumb, {
    "@context": "https://schema.org", "@type": isArticle ? "BlogPosting" : "WebPage", "@id": `${url}#${isArticle ? "article" : "webpage"}`,
    url, name: content.heading, description: content.description, inLanguage: "en-IE",
    ...(isArticle ? {
      headline: content.heading, datePublished: contentUpdated, dateModified: contentUpdated,
      author: { "@type": "Organization", "@id": `${WEBSITE_ORIGIN}/#academy`, name: "Attic Jiu Jitsu", url: `${WEBSITE_ORIGIN}/about-us` },
      publisher: { "@id": `${WEBSITE_ORIGIN}/#academy` }, image: `${WEBSITE_ORIGIN}/images/hero.jpg`,
      mainEntityOfPage: url, articleSection: content.category,
      ...(content.sources?.length ? { citation: content.sources.map((source) => source.href) } : {}),
    } : { about: { "@id": `${WEBSITE_ORIGIN}/#academy` } }),
  }];
}
