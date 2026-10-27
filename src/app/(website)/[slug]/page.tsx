import { notFound } from "next/navigation";
import { SeoContentPage } from "@/components/seo-content-page";
import { landingPage, landingPages } from "@/lib/seo-content";
import { managedMetadata } from "@/portal/seo/runtime";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return landingPages.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const content = landingPage(slug);
  if (!content) notFound();
  return managedMetadata(`/${slug}`, { title: { absolute: content.title }, description: content.description });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const content = landingPage(slug);
  if (!content) notFound();
  return <SeoContentPage content={content} />;
}
