import { EditorFlow } from "@/components/website-editor/Editable";

import {
  EditorImage,
  EditorLink,
  EditorSection,
  EditorText,
} from "@/components/website-editor/Editable";
import { managedMetadata } from "@/portal/seo/runtime";
import Link from "next/link";
import { HeroCarousel } from "@/components/hero-carousel";
import { ContactForm } from "@/components/contact-form";
import { CoachProfiles } from "@/components/public-site";
import { planEnquiryHref } from "@/components/public-timetable";
import { getGymCatalogue } from "@/lib/server/gym-catalogue";
import { getMembershipCards } from "@/lib/gym-data";
import { site } from "@/lib/site-data";
import { ContentLinks } from "@/components/seo-content-page";
import { beginnerLink, fitnessLink, kidsLink, over40Link, womenLink } from "@/lib/seo-content";

export const dynamic = "force-dynamic";
const questions = [
  [
    "Can I start with no experience?",
    "Yes. There are dedicated beginner classes, and the team can help you choose your first session. You don’t need to know the moves before you arrive.",
  ],
  [
    "Do I need to be fit first?",
    "You can build your fitness as you learn. Tell the team about your experience and any questions before your first class so they can help you find a suitable starting point.",
  ],
  [
    "What’s the difference between gi and no-gi?",
    "Gi classes use the traditional training jacket and trousers. No-gi training is without the gi. Attic offers both; ask us which class and clothing suit your first visit.",
  ],
  [
    "What should I bring?",
    "Comfortable training clothes and water are a good start. Confirm the clothing and equipment for your chosen class with the academy. Selected beginner packs include a kimono, belt and bag.",
  ],
  [
    "Are there classes for kids and teens?",
    "Yes. Attic has dedicated kids and teens classes with age-appropriate coaching. Get in touch as a parent or guardian and we’ll help you choose a suitable class and membership.",
  ],
  [
    "Does an enquiry book my class?",
    "The form sends an enquiry to the academy. The team will help you choose a class and confirm the arrangements. It does not reserve a place. Existing members can book through Members.",
  ],
];
export default async function Home() {
  const catalogue = await getGymCatalogue();
  const beginner = getMembershipCards(catalogue.plans).find(
    (plan) => plan.slug === "adults-beginners-program",
  );
  return (
    <EditorFlow containerId="home.content" style={{ display: "contents" }}>
      <HeroCarousel>
        <div className="hero-copy">
          <p className="location-label" data-enter>
            <span aria-hidden="true" />
            <EditorText
              editorId="reddf82f326-1sm"
              tag="p"
              value={"Brazilian jiu jitsu · Carlow "}
            />
          </p>
          <h1>
            <span>
              <EditorText
                editorId="reddf82f326-1ur"
                tag="span"
                value={"Jiu jitsu "}
              />
            </span>
            <span>
              <EditorText
                editorId="reddf82f326-1vp"
                tag="span"
                value={"in Carlow."}
              />
            </span>
          </h1>
          <p className="hero-strap" data-enter>
            <EditorText
              editorId="reddf82f326-1yb"
              tag="p"
              value={"A place for everyone. "}
            />
          </p>
          <p className="hero-description" data-enter>
            <EditorText
              editorId="reddf82f326-216"
              tag="p"
              value={
                "Brazilian jiu-jitsu in Carlow for adults, kids and teens. Build fitness and learn a martial art with black belt coaching, beginner classes, and gi and no-gi training. "
              }
            />
          </p>
          <div className="hero-actions" data-enter>
            <EditorLink
              editorId="reddf82f326-26v"
              href="/#trial-form"
              className="button-primary"
              data-ingenium-event="contact_cta_click"
              data-ingenium-label="Start training"
              data-ingenium-location="home_hero"
            >
              <EditorText
                editorId="reddf82f326-2e6"
                tag="Link"
                value={"Start training "}
              />
            </EditorLink>
            <Link href={site.schedulePath} className="text-link">
              <EditorText
                editorId="reddf82f326-2hd"
                tag="Link"
                value={"View timetable "}
              />
            </Link>
          </div>
          <p className="hero-reassurance" data-enter>
            <EditorText
              editorId="reddf82f326-2kn"
              tag="p"
              value={"Complete beginner? You’re welcome here. "}
            />
          </p>
        </div>
      </HeroCarousel>
      <div className="proof-strip">
        <div className="site-container proof-grid">
          <p>
            <EditorText
              editorId="reddf82f326-2q0"
              tag="p"
              value={"Black belt coaching"}
            />
          </p>
          <p>
            <EditorText
              editorId="reddf82f326-2r1"
              tag="p"
              value={"Adults, kids & teens"}
            />
          </p>
          <p>
            <EditorText
              editorId="reddf82f326-2s3"
              tag="p"
              value={"Gi & no-gi training"}
            />
          </p>
          <p>
            <EditorText
              editorId="reddf82f326-2t4"
              tag="p"
              value={"Beginners welcome"}
            />
          </p>
        </div>
      </div>
      <EditorSection
        editorId="reddf82f326-2uo"
        id="find-your-class"
        className="section-chalk section-space"
      >
        <div className="site-container programme-layout">
          <div className="section-heading">
            <p className="section-note">
              <EditorText
                editorId="reddf82f326-30l"
                tag="p"
                value={"Find your class"}
              />
            </p>
            <h2>
              <EditorText
                editorId="reddf82f326-320"
                tag="h2"
                value={"Your first class. "}
              />
              <br />
              <EditorText
                editorId="reddf82f326-33h"
                tag="h2"
                value={"Your next challenge. "}
              />
            </h2>
            <p>
              <EditorText
                editorId="reddf82f326-35e"
                tag="p"
                value={
                  "New to the mats or already at home on them. Start where you are. "
                }
              />
            </p>
          </div>
          <div className="programme-links">
            <EditorLink
              editorId="reddf82f326-39p"
              href="/beginners-bjj-carlow"
              className="programme-link"
            >
              <div>
                <h3>
                  <EditorText
                    editorId="reddf82f326-3ch"
                    tag="h3"
                    value={"New to jiu jitsu"}
                  />
                </h3>
                <p>
                  <EditorText
                    editorId="reddf82f326-3dm"
                    tag="p"
                    value={
                      "Learn the fundamentals with a clear beginner route."
                    }
                  />
                </p>
              </div>
            </EditorLink>
            <EditorLink
              editorId="reddf82f326-3gn"
              href="/classes#adults"
              className="programme-link"
            >
              <div>
                <h3>
                  <EditorText
                    editorId="reddf82f326-3jc"
                    tag="h3"
                    value={"Already training"}
                  />
                </h3>
                <p>
                  <EditorText
                    editorId="reddf82f326-3l0"
                    tag="p"
                    value={
                      "Keep developing through gi, no-gi and mixed-level classes. "
                    }
                  />
                </p>
              </div>
            </EditorLink>
            <EditorLink
              editorId="reddf82f326-3op"
              href="/kids-martial-arts-carlow"
              className="programme-link"
            >
              <div>
                <h3>
                  <EditorText
                    editorId="reddf82f326-3rd"
                    tag="h3"
                    value={"Kids & teens"}
                  />
                </h3>
                <p>
                  <EditorText
                    editorId="reddf82f326-3se"
                    tag="p"
                    value={"Age-appropriate coaching for the next generation."}
                  />
                </p>
              </div>
            </EditorLink>
          </div>
        </div>
      </EditorSection>
      <EditorSection
        editorId="reddf82f326-3wk"
        id="beginner-programme"
        className="beginner-section"
      >
        <div className="site-container beginner-grid">
          <div className="beginner-image">
            <EditorImage
              editorId="reddf82f326-41d"
              src="/images/gallery-6.jpg"
              alt="Training partners practising a ground technique at Attic"
              fill
              sizes="(max-width: 767px) 100vw, 45vw"
            />
          </div>
          <div className="beginner-copy">
            <p className="section-note">
              <EditorText
                editorId="reddf82f326-4a1"
                tag="p"
                value={"A clear way to begin"}
              />
            </p>
            <h2>
              <EditorText
                editorId="reddf82f326-4bl"
                tag="h2"
                value={"A starting point. "}
              />
              <br />
              <EditorText
                editorId="reddf82f326-4d2"
                tag="h2"
                value={"Something to build on. "}
              />
            </h2>
            {beginner ? (
              <>
                <h3 className="offer-name">{beginner.name}</h3>
                <p className="offer-price">{beginner.price}</p>
                <p className="offer-detail">{beginner.detail}</p>
                <Link
                  href={planEnquiryHref(beginner.name)}
                  className="button-primary"
                  data-ingenium-event="contact_cta_click"
                  data-ingenium-label="Ask about the beginner programme"
                  data-ingenium-location="home_beginner"
                >
                  <EditorText
                    editorId="reddf82f326-4uf"
                    tag="Link"
                    value={"Ask about the programme "}
                  />
                </Link>
              </>
            ) : (
              <>
                <p>
                  <EditorText
                    editorId="reddf82f326-4ya"
                    tag="p"
                    value={
                      "Ask the team about the current beginner programmes, equipment and your first session. "
                    }
                  />
                </p>
                <EditorLink
                  editorId="reddf82f326-527"
                  href="/#trial-form"
                  className="button-primary"
                >
                  <EditorText
                    editorId="reddf82f326-547"
                    tag="Link"
                    value={"Ask about getting started "}
                  />
                </EditorLink>
              </>
            )}
            <Link href="/memberships#live-plans" className="text-link">
              <EditorText
                editorId="reddf82f326-58w"
                tag="Link"
                value={"Explore all memberships "}
              />
            </Link>
            <p className="small-copy">
              <EditorText
                editorId="reddf82f326-5bl"
                tag="p"
                value={
                  "An enquiry starts the conversation. Your place and start date are confirmed with the academy. "
                }
              />
            </p>
          </div>
        </div>
      </EditorSection>
      <EditorSection
        editorId="reddf82f326-5gl"
        className="section-chalk section-space coaches-section"
      >
        <div className="site-container">
          <div className="section-title-row">
            <div>
              <p className="section-note">
                <EditorText
                  editorId="reddf82f326-5mi"
                  tag="p"
                  value={"The people in your corner"}
                />
              </p>
              <h2>
                <EditorText
                  editorId="reddf82f326-5ob"
                  tag="h2"
                  value={"Experience on the mats. "}
                />
                <br />
                <EditorText
                  editorId="reddf82f326-5q2"
                  tag="h2"
                  value={"Care in the coaching. "}
                />
              </h2>
            </div>
            <EditorLink
              editorId="reddf82f326-5s3"
              href="/about-us"
              className="text-link"
            >
              <EditorText
                editorId="reddf82f326-5tr"
                tag="Link"
                value={"Meet the coaches "}
              />
            </EditorLink>
          </div>
          <CoachProfiles />
        </div>
      </EditorSection>
      <EditorSection
        editorId="reddf82f326-5x3"
        className="photo-story section-space"
      >
        <div className="site-container story-grid">
          <figure className="story-main">
            <div className="story-photo-frame">
              <div className="story-photo-moving">
                <EditorImage
                  editorId="reddf82f326-648"
                  src="/images/gallery-10.jpg"
                  alt="Two training partners work through the details of a jiu jitsu technique"
                  fill
                  sizes="(max-width: 767px) 100vw, 58vw"
                />
              </div>
            </div>
            <figcaption>The details make the difference.</figcaption>
          </figure>
          <div className="story-copy">
            <p className="section-note">
              <EditorText
                editorId="reddf82f326-6gy"
                tag="p"
                value={"Life at Attic"}
              />
            </p>
            <h2>
              <EditorText
                editorId="reddf82f326-6ib"
                tag="h2"
                value={"Learn the detail. "}
              />
              <br />
              <EditorText
                editorId="reddf82f326-6js"
                tag="h2"
                value={"Put it into practice. "}
              />
            </h2>
            <p>
              <EditorText
                editorId="reddf82f326-6lq"
                tag="p"
                value={
                  "Technique, training partners and time on the mats. Take a look inside the academy. "
                }
              />
            </p>
            <EditorLink
              editorId="reddf82f326-6p8"
              href="/gallery"
              className="text-link"
            >
              <EditorText
                editorId="reddf82f326-6qv"
                tag="Link"
                value={"Inside Attic "}
              />
            </EditorLink>
            <div className="story-detail">
              <EditorImage
                editorId="reddf82f326-6td"
                src="/images/gallery-7.jpg"
                alt="A close view of a training partner between rounds"
                fill
                sizes="(max-width: 767px) 80vw, 26vw"
              />
            </div>
          </div>
        </div>
      </EditorSection>
      <EditorSection
        editorId="reddf82f326-71e"
        className="section-chalk section-space"
      >
        <div className="site-container faq-layout">
          <div className="section-heading">
            <p className="section-note">
              <EditorText
                editorId="reddf82f326-76k"
                tag="p"
                value={"Before your first class"}
              />
            </p>
            <h2>
              <EditorText
                editorId="reddf82f326-787"
                tag="h2"
                value={"A few things "}
              />
              <br />
              <EditorText
                editorId="reddf82f326-79j"
                tag="h2"
                value={"you might be "}
              />
              <br />
              <EditorText
                editorId="reddf82f326-7av"
                tag="h2"
                value={"wondering. "}
              />
            </h2>
            <p>
              <EditorText
                editorId="reddf82f326-7c3"
                tag="p"
                value={
                  "Nothing is too basic to ask. That’s what starting is for."
                }
              />
            </p>
            <a href={site.phoneHref} className="text-link">
              <EditorText
                editorId="reddf82f326-7fv"
                tag="a"
                value={"Talk to the team "}
              />
            </a>
          </div>
          <div className="faq-list">
            {questions.map(([question, answer]) => (
              <details key={question}>
                <summary>
                  <EditorText
                    editorId="reddf82f326-7m3"
                    tag="summary"
                    value={question}
                  />
                  <span aria-hidden="true" className="faq-mark" />
                </summary>
                <p>
                  <EditorText
                    editorId="reddf82f326-7pj"
                    tag="p"
                    value={answer}
                  />
                </p>
              </details>
            ))}
          </div>
        </div>
      </EditorSection>
      <EditorSection editorId="seo-home-fitness" className="section-space section-chalk">
        <div className="site-container programme-layout">
          <div className="section-heading">
            <p className="section-note">A new way to be active</p>
            <h2>Getting fit starts with finding your thing.</h2>
            <p>Looking for beginner fitness classes in Carlow, returning to exercise after 40 or searching for a sport your child can enjoy? Explore the options and find out what a first class involves.</p>
          </div>
          <ContentLinks links={[fitnessLink, over40Link, womenLink, beginnerLink, kidsLink]} label="Fitness and beginner training" />
        </div>
      </EditorSection>
      <EditorSection
        editorId="reddf82f326-7sk"
        className="enquiry-section section-space"
      >
        <div className="site-container enquiry-grid">
          <div className="enquiry-copy">
            <p className="location-label">
              <span aria-hidden="true" />
              <EditorText
                editorId="reddf82f326-7ze"
                tag="p"
                value={"Come train with us "}
              />
            </p>
            <h2>
              <EditorText
                editorId="reddf82f326-819"
                tag="h2"
                value={"It starts with "}
              />
              <br />
              <EditorText
                editorId="reddf82f326-828"
                tag="h2"
                value={"a conversation. "}
              />
            </h2>
            <p>
              <EditorText
                editorId="reddf82f326-840"
                tag="p"
                value={
                  "Tell us who will be training and what you’d like to know. We’ll help you choose a class or membership and plan your first visit. "
                }
              />
            </p>
            <div className="contact-details">
              <h3>
                <EditorText
                  editorId="reddf82f326-8a8"
                  tag="h3"
                  value={"Find us in Carlow"}
                />
              </h3>
              <address>{site.address}</address>
              <a href={site.phoneHref}>
                <EditorText
                  editorId="reddf82f326-8da"
                  tag="a"
                  value={site.phone}
                />
              </a>
              <a href={site.emailHref}>
                <EditorText
                  editorId="reddf82f326-8eu"
                  tag="a"
                  value={site.email}
                />
              </a>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`}
                className="text-link"
                target="_blank"
                rel="noreferrer"
              >
                <EditorText
                  editorId="reddf82f326-8mk"
                  tag="a"
                  value={"Get directions "}
                />
              </a>
            </div>
            <p className="small-copy">
              <EditorText
                editorId="reddf82f326-8pi"
                tag="p"
                value={"Already training with us?"}
              />
              <EditorText editorId="reddf82f326-8q7" tag="p" value={" "} />
              <Link href="/members">
                <EditorText
                  editorId="reddf82f326-8rd"
                  tag="Link"
                  value={"Open Members"}
                />
              </Link>
            </p>
          </div>
          <ContactForm planNames={catalogue.plans.map((plan) => plan.name)} />
        </div>
      </EditorSection>
    </EditorFlow>
  );
}

export async function generateMetadata() {
  return managedMetadata("/", {
    title: {
      absolute: "BJJ Carlow | Brazilian Jiu-Jitsu for All Ages | Attic",
    },
    description: site.description,
  });
}
