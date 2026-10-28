import Image from "next/image";
import Link from "next/link";
import { BlogBody } from "@/components/blog/blog-body";
import { StartBand } from "@/components/public-site";
import { BlogIntro } from "./blog-intro";
import { getBlogPosts } from "@/lib/blog/client";
import { articleSchemas } from "@/lib/blog/metadata";
import { headingAnchor } from "@/lib/blog/routing";
import type { PublishedArticle } from "@/lib/blog/contracts";
import { seoJsonLd } from "@/portal/seo/seo-adapter";

const dateFormat = new Intl.DateTimeFormat("en-IE", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Dublin" });

export async function BlogArticle({ post, preview = false }: { post: PublishedArticle; preview?: boolean }) {
  const cover = post.cover_media_id ? post.media[post.cover_media_id] : undefined;
  const category = post.categories[0];
  const headings = post.body.blocks.filter((block) => block.type === "heading" && block.level === 2);
  const related = !preview && post.related_ids.length ? (await getBlogPosts(new URLSearchParams({ ids: post.related_ids.join(","), limit: "6" }))).posts : [];
  return (
    <div data-blog-revision={post.revision_id} data-blog-post={post.id}>
      {preview ? <aside className="site-container blog-preview-banner"><strong>Private article preview</strong><p>This revision has not been published.</p><Link href="/api/ingenium/blog/preview?exit=1" prefetch={false}>Exit preview</Link></aside> : null}
      <div className="site-container content-breadcrumb"><nav aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-hidden="true">/</span><Link href="/blog">Fitness & BJJ guides</Link>{category ? <><span aria-hidden="true">/</span><Link href={`/blog/category/${category.slug}`}>{category.name}</Link></> : null}</nav></div>
      <BlogIntro label={category?.name || "Fitness & jiu-jitsu guides"} title={post.title}>
        {post.excerpt ? <p className="intro-copy">{post.excerpt}</p> : null}
        <p className="content-byline">By {post.authors.map((author, index) => <span key={author.id}>{index ? ", " : ""}<Link href={`/blog/author/${author.slug}`}>{author.name}</Link></span>)} · Published <time dateTime={post.published_at}>{dateFormat.format(new Date(post.published_at))}</time>{post.modified_at.slice(0, 10) !== post.published_at.slice(0, 10) ? <> · Updated <time dateTime={post.modified_at}>{dateFormat.format(new Date(post.modified_at))}</time></> : null}</p>
        {!preview ? <div className="content-actions"><Link href="/#trial-form" className="button-primary" data-ingenium-event="contact_cta_click" data-ingenium-label="Ask about getting started" data-ingenium-location={post.url}>Ask about getting started</Link><Link href="/classes#live-schedule" className="text-link">View timetable</Link></div> : null}
      </BlogIntro>
      {cover ? <figure className="site-container blog-cover"><Image src={cover.url} width={cover.width} height={cover.height} alt={post.cover_alt} priority unoptimized /></figure> : null}
      <div className="site-container content-layout">
        <aside className="content-toc"><nav aria-label="On this page"><p className="section-note">On this page</p>{headings.map((heading) => <a key={heading.id} href={`#${headingAnchor(heading.id)}`}>{heading.text}</a>)}</nav></aside>
        <article className="content-prose content-section" aria-label={post.title}>
          <BlogBody blocks={post.body.blocks} media={post.media} />
          {post.tags.length ? <nav className="content-links" aria-label="Article topics">{post.tags.map((tag) => <Link key={tag.id} href={`/blog/tag/${tag.slug}`} className="text-link">{tag.name}</Link>)}</nav> : null}
          {related.length ? <aside className="content-section"><h2>Related guides.</h2><nav className="content-links" aria-label="Related guides">{related.map((article) => <Link key={article.id} href={`/blog/${article.slug}`} className="text-link">{article.title}</Link>)}</nav></aside> : null}
          <nav className="content-links" aria-label="More guides"><Link href="/blog" className="text-link">Browse all fitness and jiu-jitsu guides</Link></nav>
        </article>
      </div>
      {!preview ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: seoJsonLd(articleSchemas(post)) }} /> : null}
      {!preview ? <StartBand /> : null}
    </div>
  );
}
