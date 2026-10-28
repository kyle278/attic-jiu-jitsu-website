import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { BlogArticle } from "@/components/blog/blog-article";
import { BlogIntro } from "@/components/blog/blog-intro";
import { StartBand } from "@/components/public-site";
import { BlogUnavailable } from "@/lib/blog/client";
import { articleMetadata } from "@/lib/blog/metadata";
import { resolveBlog } from "@/lib/blog/resolve";
import { WEBSITE_ORIGIN } from "@/portal/public";
import { seoJsonLd } from "@/portal/seo/seo-adapter";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ segments?: string[] }>; searchParams: Promise<{ q?: string | string[] }> };
async function view({ params, searchParams }: Props) {
  const { segments = [] } = await params;
  const { q } = await searchParams;
  return resolveBlog(segments.join("/"), typeof q === "string" ? q : "");
}
export async function generateMetadata(props: Props): Promise<Metadata> {
  try {
    const data = await view(props);
    const privatePage = data.preview || (await headers()).get("x-attic-editor-preview") === "1";
    if (data.post) return articleMetadata(data.post, privatePage);
    const title = `${data.title} | Attic`;
    const url = `${WEBSITE_ORIGIN}${data.path}`;
    return {
      metadataBase: new URL(WEBSITE_ORIGIN), title: { absolute: title }, description: data.description,
      alternates: { canonical: url }, robots: { index: !privatePage && !data.noindex, follow: !privatePage },
      openGraph: { type: "website", title, description: data.description, url, siteName: "Attic Jiu Jitsu Carlow", locale: "en_IE", images: [{ url: "/images/hero.jpg" }] },
      twitter: { card: "summary_large_image", title, description: data.description, images: ["/images/hero.jpg"] },
    };
  } catch (error) {
    if (error instanceof BlogUnavailable && [401, 404, 410].includes(error.status)) return { title: { absolute: "Guide unavailable | Attic" }, robots: { index: false, follow: false } };
    throw error;
  }
}
export default async function BlogPage(props: Props) {
  let data;
  try { data = await view(props); }
  catch (error) {
    if (error instanceof BlogUnavailable && [401, 404, 410].includes(error.status)) notFound();
    throw error;
  }
  if (data.post) return <BlogArticle post={data.post} preview={data.preview} />;
  const list = data.list!;
  const url = `${WEBSITE_ORIGIN}${data.path}`;
  const collectionSchema = {
    "@context": "https://schema.org", "@type": "CollectionPage", "@id": `${url}#webpage`, url, name: data.title, description: data.description,
    mainEntity: { "@type": "ItemList", itemListElement: list.posts.map((post, index) => ({ "@type": "ListItem", position: (data.page - 1) * 12 + index + 1, name: post.title, url: post.url })) },
  };
  return (
    <div data-blog-generation={list.generation}>
      <BlogIntro label="Fitness & jiu-jitsu guides" title={data.title}>
        <p className="intro-copy">{data.description}</p>
        <form className="blog-search" action="/blog/search" role="search"><label htmlFor="blog-search">Find a guide</label><div><input id="blog-search" type="search" name="q" defaultValue={data.query} maxLength={100} placeholder="Fitness, beginners, kids…" /><button type="submit" className="button-primary">Search</button></div></form>
      </BlogIntro>
      <section className="section-space section-chalk"><div className="site-container">
        <h2>{data.query ? "Search results." : "Start with a question."}</h2>
        <div className="guide-grid">{list.posts.map((post) => {
          const image = post.cover_media_id ? post.media[post.cover_media_id] : undefined;
          return <article key={post.id}>
            {image ? <Link href={`/blog/${post.slug}`} aria-label={post.title}><Image src={image.url} width={image.width} height={image.height} alt={post.cover_alt || image.alt} loading="lazy" unoptimized /></Link> : null}
            {post.categories[0] ? <p className="section-note"><Link href={`/blog/category/${post.categories[0].slug}`}>{post.categories[0].name}</Link></p> : null}
            <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3><p>{post.excerpt}</p>
            <Link className="text-link" href={`/blog/${post.slug}`}>Read the guide<span className="sr-only">: {post.title}</span></Link>
          </article>;
        })}</div>
        {!list.posts.length ? <div className="content-section"><p>{data.query ? "No matching guides. Try another word or browse all articles." : "New guides will appear here when they are published."}</p><Link href="/blog" className="text-link">Browse all guides</Link></div> : null}
        {data.path === "/blog" || data.path.startsWith("/blog/page/") ? <nav className="blog-pagination" aria-label="Guide pages">{data.page > 1 ? <Link href={data.page === 2 ? "/blog" : `/blog/page/${data.page - 1}`} className="text-link">Previous page</Link> : null}<span>Page {data.page}</span>{list.next_cursor ? <Link href={`/blog/page/${data.page + 1}`} className="text-link">Next page</Link> : null}</nav> : null}
        <nav className="content-links" aria-label="Other ways to browse"><Link href="/blog/feed.xml" className="text-link">Subscribe by RSS</Link><Link href="/fitness-classes-carlow" className="text-link">Explore fitness through jiu-jitsu in Carlow</Link></nav>
      </div></section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: seoJsonLd(collectionSchema) }} />
      <StartBand />
    </div>
  );
}
