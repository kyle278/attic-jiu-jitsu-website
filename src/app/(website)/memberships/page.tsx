import { EditorFlow } from "@/components/website-editor/Editable";

import {
  EditorLink,
  EditorSection,
  EditorText,
} from "@/components/website-editor/Editable";
import { managedMetadata } from "@/portal/seo/runtime";
import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, StartBand } from "@/components/public-site";
import { planEnquiryHref } from "@/components/public-timetable";
import { getMembershipCards } from "@/lib/gym-data";
import { getGymCatalogue } from "@/lib/server/gym-catalogue";

const baselineMetadata: Metadata = {
  title: { absolute: "BJJ Prices & Family Memberships Carlow | Attic" },
  description:
    "See Attic Jiu Jitsu’s published memberships, beginner programmes, student and family options in Carlow. Clear prices and plan details.",
};
export const dynamic = "force-dynamic";
export default async function MembershipsPage() {
  const catalogue = await getGymCatalogue();
  const plans = getMembershipCards(catalogue.plans);
  const groups = Array.from(
    new Set([
      "Beginners",
      "Adults",
      "Kids",
      "Teens",
      "Family",
      ...plans.map((plan) => plan.audience),
    ]),
  ).filter((group) => plans.some((plan) => plan.audience === group));
  return (
    <EditorFlow
      containerId="memberships.content"
      style={{ display: "contents" }}
    >
      <PageIntro label="Memberships" title="Jiu-jitsu memberships in Carlow.">
        <div className="intro-bottom">
          <p>
            <EditorText
              editorId="rceb2960de8-wz"
              tag="p"
              value={
                "Beginner programmes, monthly training and options for the family. See what’s included, then talk to the team about getting started. "
              }
            />
          </p>
          <EditorLink
            editorId="rceb2960de8-11o"
            href="#live-plans"
            className="button-primary"
          >
            <EditorText
              editorId="rceb2960de8-13e"
              tag="a"
              value={"Find your membership "}
            />
          </EditorLink>
        </div>
      </PageIntro>
      <EditorSection
        editorId="rceb2960de8-15i"
        id="live-plans"
        className="section-chalk section-space"
      >
        <div className="site-container">
          <nav className="plan-jump-links" aria-label="Membership categories">
            {groups.map((group, index) => (
              <a href={`#plan-group-${index}`} key={group}>
                {group}
              </a>
            ))}
          </nav>
          {groups.map((group, index) => (
            <EditorSection
              editorId="rceb2960de8-1h6"
              instanceKey={group}
              className="plan-group"
              id={`plan-group-${index}`}
              key={group}
            >
              <div className="plan-group-title">
                <h2>{group}</h2>
                <p>
                  {group === "Beginners"
                    ? "A clear route into your first weeks of training."
                    : "Find the option that works for your training."}
                </p>
              </div>
              <div>
                {plans
                  .filter((plan) => plan.audience === group)
                  .map((plan) => (
                    <article
                      className="plan-row"
                      key={plan.id}
                      data-plan-id={plan.id}
                    >
                      <div>
                        <h3>{plan.name}</h3>
                        <p>{plan.detail}</p>
                      </div>
                      <div className="plan-action">
                        <p className="plan-price">{plan.price}</p>
                        <Link
                          href={planEnquiryHref(plan.name)}
                          className="text-link"
                          data-ingenium-event="contact_cta_click"
                          data-ingenium-label={`Ask about ${plan.name}`}
                          data-ingenium-location="membership_plan"
                          aria-label={`Ask about ${plan.name}`}
                        >
                          <EditorText
                            editorId="rceb2960de8-2mq"
                            tag="Link"
                            value={"Ask about this plan "}
                          />
                        </Link>
                      </div>
                    </article>
                  ))}
              </div>
            </EditorSection>
          ))}
          {!plans.length ? (
            <div className="empty-catalogue">
              <h2>
                <EditorText
                  editorId="rceb2960de8-2un"
                  tag="h2"
                  value={"Let’s find your membership."}
                />
              </h2>
              <p>
                <EditorText
                  editorId="rceb2960de8-2w1"
                  tag="p"
                  value={"Contact the academy for current options and pricing."}
                />
              </p>
              <EditorLink
                editorId="rceb2960de8-2y0"
                href="/#trial-form"
                className="text-link"
              >
                <EditorText
                  editorId="rceb2960de8-2zt"
                  tag="Link"
                  value={"Talk to the team "}
                />
              </EditorLink>
            </div>
          ) : null}
          <p className="catalogue-note">
            <EditorText
              editorId="rceb2960de8-33g"
              tag="p"
              value={
                "Memberships and payments are arranged with the academy. Contact us to confirm eligibility, family coverage and your start date. "
              }
            />
          </p>
        </div>
      </EditorSection>
      <EditorSection
        editorId="rceb2960de8-38t"
        id="member-area"
        className="member-bridge"
      >
        <div className="site-container start-band-inner">
          <div>
            <p className="section-note">
              <EditorText
                editorId="rceb2960de8-3dg"
                tag="p"
                value={"Already part of Attic?"}
              />
            </p>
            <h2>
              <EditorText
                editorId="rceb2960de8-3en"
                tag="h2"
                value={"Your training. Your member area."}
              />
            </h2>
            <p>
              <EditorText
                editorId="rceb2960de8-3g4"
                tag="p"
                value={"View your membership and manage your class bookings."}
              />
            </p>
          </div>
          <Link href="/members" className="button-primary">
            <EditorText
              editorId="rceb2960de8-3k6"
              tag="Link"
              value={"Open Members "}
            />
          </Link>
        </div>
      </EditorSection>
      <StartBand />
    </EditorFlow>
  );
}

export async function generateMetadata() {
  return managedMetadata("/memberships", baselineMetadata);
}
