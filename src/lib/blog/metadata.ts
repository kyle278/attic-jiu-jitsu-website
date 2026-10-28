import type { Metadata } from "next";
import { site } from "@/lib/site-data";
import { WEBSITE_ORIGIN } from "@/portal/public";
import type { PublishedArticle } from "./contracts";

export function articleMetadata(post: PublishedArticle, preview = false): Metadata {
  const social = post.seo.social_media_id ? post.media[post.seo.social_media_id] : post.cover_media_id ? post.media[post.cover_media_id] : undefined;
  const title = post.seo.title || `${post.title} | Attic`;
  const description = post.seo.description || post.excerpt;
  return {
    metadataBase: new URL(WEBSITE_ORIGIN), title: { absolute: title }, description,
    alternates: { canonical: preview ? undefined : post.seo.canonical || post.url },
    robots: { index: !preview && !post.seo.noindex, follow: !preview },
    openGraph: {
      type: "article", title: post.seo.social_title || title, description: post.seo.social_description || description,
      siteName: site.title, locale: "en_IE", url: preview ? undefined : post.url,
      publishedTime: post.published_at, modifiedTime: post.modified_at, authors: post.authors.map((author) => author.name),
      images: social ? [{ url: social.url, width: social.width, height: social.height, alt: social.alt }] : [{ url: `${WEBSITE_ORIGIN}/images/hero.jpg`, alt: "Jiu-jitsu training at Attic in Carlow" }],
    },
    twitter: { card: "summary_large_image", title: post.seo.social_title || title, description: post.seo.social_description || description, images: [social?.url || `${WEBSITE_ORIGIN}/images/hero.jpg`] },
  };
}

export function articleSchemas(post: PublishedArticle) {
  const cover = post.cover_media_id ? post.media[post.cover_media_id] : undefined;
  return [
    {
      "@context": "https://schema.org", "@type": "BlogPosting", "@id": `${post.url}#article`, url: post.url,
      mainEntityOfPage: post.seo.canonical || post.url, headline: post.title, description: post.seo.description || post.excerpt,
      datePublished: post.published_at, dateModified: post.modified_at, inLanguage: "en-IE",
      author: post.authors.map((author) => ({ "@type": author.name === site.name ? "Organization" : "Person", name: author.name, ...(author.url ? { url: author.url } : {}) })),
      publisher: { "@type": "Organization", "@id": `${WEBSITE_ORIGIN}/#academy`, name: site.name },
      ...(cover ? { image: [cover.url] } : {}),
      ...(post.categories.length ? { articleSection: post.categories.map((category) => category.name) } : {}),
    },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList", "@id": `${post.url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: WEBSITE_ORIGIN },
        { "@type": "ListItem", position: 2, name: "Fitness & BJJ guides", item: `${WEBSITE_ORIGIN}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: post.url },
      ],
    },
  ];
}
