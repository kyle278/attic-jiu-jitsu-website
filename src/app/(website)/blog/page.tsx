import Link from "next/link";
import { PageIntro, StartBand } from "@/components/public-site";
import { EditorFlow, EditorSection, EditorText } from "@/components/website-editor/Editable";
import { guides } from "@/lib/fitness-guides";
import { beginnerLink, fitnessLink, kidsLink } from "@/lib/seo-content";
import { ContentLinks } from "@/components/seo-content-page";
import { managedMetadata } from "@/portal/seo/runtime";

export function generateMetadata() {
  return managedMetadata("/blog", {
    title: { absolute: "Fitness Over 40 & Jiu-Jitsu Beginner Guides | Attic" },
    description: "Practical guides to getting fit over 40 for men and women, finding an alternative to the gym and starting jiu-jitsu. Advice for beginners and parents in Carlow.",
  });
}

export default function BlogPage() {
  return (
    <EditorFlow containerId="blog.content" style={{ display: "contents" }}>
      <PageIntro label="Fitness & jiu-jitsu guides" title="Find your way into being active.">
        <p className="intro-copy"><EditorText editorId="seo-blog-intro" tag="p" value="Getting fit after 40, trying a sport for the first time or choosing an activity for your child. Start with the questions that matter to you, then explore what training at Attic in Carlow involves." /></p>
      </PageIntro>
      <EditorSection editorId="seo-blog-guides" className="section-space section-chalk">
        <div className="site-container">
          <h2>Start with a question.</h2>
          <div className="guide-grid">
            {guides.map((guide) => (
              <article key={guide.slug}>
                <p className="section-note">{guide.category}</p>
                <h3><Link href={`/blog/${guide.slug}`}>{guide.heading}</Link></h3>
                <p>{guide.description}</p>
                <Link className="text-link" href={`/blog/${guide.slug}`}>Read the guide<span className="sr-only">: {guide.heading}</span></Link>
              </article>
            ))}
          </div>
          <ContentLinks links={[fitnessLink, beginnerLink, kidsLink]} label="Explore classes in Carlow" />
        </div>
      </EditorSection>
      <StartBand />
    </EditorFlow>
  );
}
