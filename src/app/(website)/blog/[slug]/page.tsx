import { notFound } from "next/navigation";
import { SeoContentPage } from "@/components/seo-content-page";
import { guide, guides } from "@/lib/fitness-guides";
import { managedMetadata } from "@/portal/seo/runtime";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return guides.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const content = guide(slug);
  if (!content) notFound();
  return managedMetadata(`/blog/${slug}`, {
    title: { absolute: content.title }, description: content.description,
    openGraph: { type: "article", publishedTime: "2026-10-27", modifiedTime: "2026-10-27", authors: ["Attic Jiu Jitsu"], section: content.category },
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const content = guide(slug);
  if (!content) notFound();
  return <SeoContentPage content={content} article />;
}
