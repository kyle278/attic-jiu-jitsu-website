import { cache } from "react";
import { headers } from "next/headers";
import type { Metadata } from "next";
import { pageSeo, type PublishedSeo } from "./seo-adapter";
import { WEBSITE_ORIGIN } from "../public";
export const SEO_TAG = "attic-managed-seo-v1";
export type SeoRevision = {
  id: string;
  revision: number;
  snapshot: PublishedSeo;
};
export function configuration() {
  const base = process.env.INGENIUM_SEO_SNAPSHOT_BASE_URL?.trim().replace(
      /\/$/,
      "",
    ),
    key = process.env.INGENIUM_SEO_SITE_KEY?.trim();
  return base && key ? { base, key } : null;
}
export async function readSeoRevision(
  fresh = false,
): Promise<SeoRevision | null> {
  const config = configuration();
  if (!config) return null;
  try {
    const r = await fetch(config.base + "/manifest.json", {
      ...(fresh
        ? { cache: "no-store" as const }
        : {
            cache: "force-cache" as const,
            next: { revalidate: 60, tags: [SEO_TAG] },
          }),
      signal: AbortSignal.timeout(5000),
      redirect: "error",
    });
    if (!r.ok) return null;
    const text = await r.text();
    if (text.length > 2000000) return null;
    const v = JSON.parse(text);
    if (
      !/^[a-f0-9-]{36}$/i.test(v.id) ||
      !Number.isSafeInteger(v.revision) ||
      v.snapshot?.site_key !== config.key ||
      v.snapshot.schema_version !== 1 ||
      !Array.isArray(v.snapshot.pages) ||
      !Array.isArray(v.snapshot.redirects)
    )
      return null;
    return v;
  } catch {
    return null;
  }
}
export const getSeoRevision = cache(async () => {
  const expected = (await headers()).get("x-ingenium-seo-revision"),
    current = await readSeoRevision();
  return expected && current?.id !== expected ? readSeoRevision(true) : current;
});
export async function managedMetadata(
  path: string,
  baseline: Metadata,
): Promise<Metadata> {
  baseline = {
    ...baseline,
    metadataBase: new URL(WEBSITE_ORIGIN),
    alternates: {
      ...baseline.alternates,
      canonical: new URL(path, WEBSITE_ORIGIN).href,
    },
    openGraph: {
      type: "website",
      title:
        typeof baseline.title === "string"
          ? baseline.title
          : "Attic Jiu Jitsu Carlow",
      description: baseline.description || undefined,
      images: [{ url: `${WEBSITE_ORIGIN}/images/hero.jpg` }],
      ...baseline.openGraph,
      url: new URL(path, WEBSITE_ORIGIN).href,
    },
  };
  const h = await headers();
  if (h.get("x-attic-editor-preview") === "1")
    return { ...baseline, robots: { index: false, follow: false } };
  const release = await getSeoRevision();
  if (!release) return baseline;
  const seo = pageSeo(release.snapshot, new URL(path, WEBSITE_ORIGIN).href);
  return {
    ...baseline,
    ...(seo.title ? { title: { absolute: seo.title } } : {}),
    ...(seo.description ? { description: seo.description } : {}),
    ...(seo.canonical
      ? { alternates: { ...baseline.alternates, canonical: seo.canonical } }
      : {}),
    ...(seo.robots ? { robots: seo.robots } : {}),
    openGraph: {
      ...baseline.openGraph,
      ...(seo.ogTitle || seo.title ? { title: seo.ogTitle || seo.title } : {}),
      ...(seo.ogDescription || seo.description
        ? { description: seo.ogDescription || seo.description }
        : {}),
      ...(seo.ogImage ? { images: [seo.ogImage] } : {}),
    },
  };
}
export async function managedSchemas(baseline: Record<string, unknown>[]) {
  const path = (await headers()).get("x-ingenium-path") || "/",
    release = await getSeoRevision(),
    override =
      release &&
      pageSeo(release.snapshot, new URL(path, WEBSITE_ORIGIN).href).schema;
  if (!override) return baseline;
  const nodes = Array.isArray(override) ? override : [override],
    ids = new Set<string>(),
    types = new Set<string>();
  const visit = (v: unknown) => {
    if (!v || typeof v !== "object") return;
    const n = v as Record<string, unknown>;
    if (typeof n["@id"] === "string") ids.add(n["@id"]);
    if (typeof n["@type"] === "string") types.add(n["@type"]);
    if (Array.isArray(n["@graph"])) n["@graph"].forEach(visit);
  };
  nodes.forEach(visit);
  return [
    ...baseline.filter(
      (n) => !ids.has(String(n["@id"])) && !types.has(String(n["@type"])),
    ),
    ...nodes,
  ];
}
