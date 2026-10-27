import Link from "next/link";
import { PageIntro, StartBand } from "@/components/public-site";
import { EditorFlow, EditorLink, EditorSection, EditorText } from "@/components/website-editor/Editable";
import { getMembershipCards } from "@/lib/gym-data";
import { getGymCatalogue } from "@/lib/server/gym-catalogue";
import { planEnquiryHref } from "@/components/public-timetable";
import { contentUpdated, type ContentLink, type SeoContent } from "@/lib/seo-content";

export function ContentLinks({ links, label = "Explore related pages" }: { links: ContentLink[]; label?: string }) {
  return (
    <nav className="content-links" aria-label={label}>
      {links.map((link) => <Link key={link.href} href={link.href} className="text-link">{link.label}</Link>)}
    </nav>
  );
}

export async function SeoContentPage({ content, article = false }: { content: SeoContent; article?: boolean }) {
  const root = article ? "/blog" : "";
  const editorId = `seo-${content.slug}`;
  const catalogue = content.planSlugs?.length ? await getGymCatalogue() : null;
  const plans = catalogue ? getMembershipCards(catalogue.plans).filter((plan) => content.planSlugs?.includes(plan.slug)) : [];
  return (
    <EditorFlow containerId={`${editorId}.content`} style={{ display: "contents" }}>
      <div className="site-container content-breadcrumb">
        <nav aria-label="Breadcrumb">
          <Link href="/">Home</Link><span aria-hidden="true">/</span>
          {article && <><Link href="/blog">Fitness & BJJ guides</Link><span aria-hidden="true">/</span></>}
          <span aria-current="page">{content.category}</span>
        </nav>
      </div>
      <PageIntro label={content.category} title={content.heading}>
        <p className="intro-copy"><EditorText editorId={`${editorId}-intro`} value={content.intro} tag="p" /></p>
        {article ? <p className="content-byline">By <Link href="/about-us">Attic Jiu Jitsu</Link> · Updated <time dateTime={contentUpdated}>27 October 2026</time></p> : null}
        <div className="content-actions">
          <Link href="/#trial-form" className="button-primary" data-ingenium-event="contact_cta_click" data-ingenium-label="Ask about getting started" data-ingenium-location={`${root}/${content.slug}`}>Ask about getting started</Link>
          <Link href="/classes#live-schedule" className="text-link">View timetable</Link>
        </div>
      </PageIntro>
      <div className="site-container content-layout">
        <aside className="content-toc">
          <nav aria-label="On this page">
            <p className="section-note">On this page</p>
            {content.sections.map((section) => <a key={section.id} href={`#${section.id}`}>{section.title}</a>)}
            {content.planSlugs?.length ? <a href="#current-plans">Current membership options</a> : null}
          </nav>
        </aside>
        <article className="content-prose" aria-label={content.heading}>
          {content.sections.map((section) => (
            <EditorSection key={section.id} editorId={`${editorId}-${section.id}`} id={section.id} className="content-section">
              <h2><EditorText editorId={`${editorId}-${section.id}-title`} value={section.title} tag="h2" /></h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}><EditorText editorId={`${editorId}-${section.id}-copy`} value={paragraph} tag="p" /></p>)}
              {section.bullets ? <ul>{section.bullets.map((bullet) => <li key={bullet}><EditorText editorId={`${editorId}-${section.id}-bullet`} value={bullet} tag="li" /></li>)}</ul> : null}
              {section.links ? <ContentLinks links={section.links} label={`Explore: ${section.title}`} /> : null}
            </EditorSection>
          ))}
          {content.planSlugs?.length ? (
            <section id="current-plans" className="content-section content-plans">
              <p className="section-note">From the current academy catalogue</p>
              <h2>Membership options.</h2>
              {plans.length ? plans.map((plan) => (
                <div key={plan.id} className="content-plan" data-plan-id={plan.id}>
                  <h3>{plan.name}</h3><p className="offer-price">{plan.price}</p><p>{plan.detail}</p>
                  <Link href={planEnquiryHref(plan.name)} className="text-link" data-ingenium-event="contact_cta_click" data-ingenium-label={`Ask about ${plan.name}`} data-ingenium-location={`/${content.slug}`}>Ask about this plan</Link>
                </div>
              )) : <p>Contact the academy for current options and prices.</p>}
              <p className="small-copy">Confirm eligibility, equipment, availability and your start date with the academy. An enquiry does not book a class.</p>
              <Link href="/memberships#live-plans" className="text-link">Compare all memberships</Link>
            </section>
          ) : null}
          {content.faqs?.length ? (
            <section className="content-section">
              <h2>Your questions.</h2>
              {content.faqs.map((faq) => <div key={faq.question} className="content-question"><h3>{faq.question}</h3><p>{faq.answer}</p></div>)}
            </section>
          ) : null}
          {content.sources?.length ? (
            <section className="content-section content-sources">
              <h2>Further reading.</h2>
              <p>General activity information comes from the sources below. Class and membership information describes Attic’s published programme. This guide is general information, rather than an individual exercise prescription.</p>
              <ul>{content.sources.map((source) => <li key={source.href}><a href={source.href}>{source.label}</a></li>)}</ul>
            </section>
          ) : null}
          <EditorSection editorId={`${editorId}-related`} className="content-section">
            <h2>Find your next step.</h2>
            <ContentLinks links={content.related} />
            <EditorLink editorId={`${editorId}-guides-link`} href="/blog" className="text-link">Browse all fitness and jiu-jitsu guides</EditorLink>
          </EditorSection>
        </article>
      </div>
      <StartBand />
    </EditorFlow>
  );
}
