import { EditorFlow } from "@/components/website-editor/Editable";

import {
  EditorImage,
  EditorLink,
  EditorSection,
  EditorText,
} from "@/components/website-editor/Editable";
import { managedMetadata } from "@/portal/seo/runtime";
import type { Metadata } from "next";
import { CoachProfiles, PageIntro, StartBand } from "@/components/public-site";
import { site } from "@/lib/site-data";
const baselineMetadata: Metadata = {
  title: { absolute: "Black Belt BJJ Coaches Carlow | About Attic Jiu Jitsu" },
  description:
    "Meet Darren Curtis and Brian Connolly. Experienced black belt coaching and a welcoming Brazilian jiu jitsu academy for adults, kids and teens in Carlow.",
};
export default function AboutPage() {
  return (
    <EditorFlow containerId="about-us.content" style={{ display: "contents" }}>
      <PageIntro
        label="The academy · Attic Jiu Jitsu"
        title="Black belt jiu-jitsu coaching in Carlow."
      >
        <p className="intro-copy">
          <EditorText
            editorId="r48dcb79ea2-kq"
            tag="p"
            value={
              "A place to learn Brazilian jiu jitsu, find training partners and keep coming back. Right here in Carlow. "
            }
          />
        </p>
      </PageIntro>
      <div className="about-banner">
        <EditorImage
          editorId="r48dcb79ea2-q2"
          src="/images/gallery-9.jpg"
          alt="Training partners on the mats beneath the Attic Jiu Jitsu badge"
          fill
          preload
          sizes="100vw"
        />
      </div>
      <EditorSection
        editorId="r48dcb79ea2-vy"
        className="section-chalk section-space"
      >
        <div className="site-container programme-layout">
          <div className="section-heading">
            <p className="section-note">
              <EditorText
                editorId="r48dcb79ea2-11a"
                tag="p"
                value={"A team to learn with"}
              />
            </p>
            <h2>
              <EditorText
                editorId="r48dcb79ea2-12u"
                tag="h2"
                value={"Serious about the training. "}
              />
              <br />
              <EditorText
                editorId="r48dcb79ea2-14l"
                tag="h2"
                value={"Welcoming from the start. "}
              />
            </h2>
          </div>
          <div className="academy-story">
            <p>
              <EditorText
                editorId="r48dcb79ea2-18a"
                tag="p"
                value={
                  "Attic brings adults, kids and teens together to learn Brazilian jiu jitsu. Whether you’re trying something new, returning to training or working towards competition, there’s a route into the academy. "
                }
              />
            </p>
            <p>
              <EditorText
                editorId="r48dcb79ea2-1gb"
                tag="p"
                value={
                  "Good instruction and time practising with others are at the heart of it. Learn a technique, work through the details and put it into practice with your training partners. "
                }
              />
            </p>
            <EditorLink
              editorId="r48dcb79ea2-1mn"
              href="/classes"
              className="text-link"
            >
              <EditorText
                editorId="r48dcb79ea2-1oa"
                tag="Link"
                value={"Explore the classes "}
              />
            </EditorLink>
          </div>
        </div>
      </EditorSection>
      <EditorSection editorId="r48dcb79ea2-1qx" className="section-space">
        <div className="site-container">
          <div className="section-title-row">
            <div>
              <p className="section-note">
                <EditorText
                  editorId="r48dcb79ea2-1w0"
                  tag="p"
                  value={"Black belt experience"}
                />
              </p>
              <h2>
                <EditorText
                  editorId="r48dcb79ea2-1x8"
                  tag="h2"
                  value={"Meet your coaches."}
                />
              </h2>
            </div>
            <p>
              <EditorText
                editorId="r48dcb79ea2-1yu"
                tag="p"
                value={"Both began their jiu jitsu training in 2009."}
              />
            </p>
          </div>
          <CoachProfiles full />
        </div>
      </EditorSection>
      <EditorSection
        editorId="r48dcb79ea2-22n"
        className="section-chalk section-space"
      >
        <div className="site-container visit-grid">
          <div>
            <h2>
              <EditorText
                editorId="r48dcb79ea2-26s"
                tag="h2"
                value={"Your first class. "}
              />
              <br />
              <EditorText
                editorId="r48dcb79ea2-289"
                tag="h2"
                value={"Or the next chapter. "}
              />
            </h2>
            <p>
              <EditorText
                editorId="r48dcb79ea2-2a6"
                tag="p"
                value={
                  "Dedicated beginner, mixed-level and youth classes make space for different stages of training. Ask the team where to start. "
                }
              />
            </p>
            <EditorLink
              editorId="r48dcb79ea2-2et"
              href="/#trial-form"
              className="text-link"
            >
              <EditorText
                editorId="r48dcb79ea2-2gk"
                tag="Link"
                value={"Plan your first visit "}
              />
            </EditorLink>
          </div>
          <div className="visit-address">
            <p className="section-note">
              <EditorText
                editorId="r48dcb79ea2-2kh"
                tag="p"
                value={"The academy"}
              />
            </p>
            <h3>
              <EditorText
                editorId="r48dcb79ea2-2ld"
                tag="h3"
                value={"In the heart of Carlow."}
              />
            </h3>
            <address>{site.address}</address>
            <a href={site.phoneHref}>
              <EditorText
                editorId="r48dcb79ea2-2oh"
                tag="a"
                value={site.phone}
              />
            </a>
            <EditorLink
              editorId="r48dcb79ea2-2pa"
              href="/gallery"
              className="text-link"
            >
              <EditorText
                editorId="r48dcb79ea2-2qx"
                tag="Link"
                value={"See inside Attic "}
              />
            </EditorLink>
          </div>
        </div>
      </EditorSection>
      <StartBand />
    </EditorFlow>
  );
}

export async function generateMetadata() {
  return managedMetadata("/about-us", baselineMetadata);
}
