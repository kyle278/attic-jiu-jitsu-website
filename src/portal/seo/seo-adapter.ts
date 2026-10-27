/** Copy this server-side adapter into a connected website. No private key is needed to read a published snapshot. */
type SeoMetadata = {
  title?: string;
  description?: string;
  canonical?: string;
  robots?: string;
  schema?: unknown;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
};
export type PublishedSeo = {
  schema_version: 1;
  site_key: string;
  defaults: SeoMetadata;
  pages: { url: string; seo: SeoMetadata }[];
  redirects: { source: string; target: string; status: number }[];
};
export function pageSeo(snapshot: PublishedSeo, url: string): SeoMetadata {
  const target = new URL(url);
  const page = snapshot.pages.find((row) => {
    const source = new URL(row.url);
    return (
      source.pathname === target.pathname && source.search === target.search
    );
  });
  return { ...snapshot.defaults, ...page?.seo };
}
export function seoJsonLd(value: unknown) {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
export function seoMetadata(snapshot: PublishedSeo, url: string) {
  const seo = pageSeo(snapshot, url);
  return {
    title: seo.title || undefined,
    description: seo.description || undefined,
    alternates: seo.canonical ? { canonical: seo.canonical } : undefined,
    robots: seo.robots,
    openGraph: {
      title: seo.ogTitle || seo.title || undefined,
      description: seo.ogDescription || seo.description || undefined,
      ...(seo.ogImage ? { images: [seo.ogImage] } : {}),
    },
  };
}
export function seoRedirect(snapshot: PublishedSeo, url: string) {
  return (
    snapshot.redirects.find((row) => row.source === new URL(url).pathname) ??
    null
  );
}
