import {
  EditorFlow,
  EditorLink,
  EditorSection,
  EditorText,
} from "@/components/website-editor/Editable";
import { managedMetadata } from "@/portal/seo/runtime";
import type { Metadata } from "next";
import { PageIntro } from "@/components/public-site";
import { site } from "@/lib/site-data";
const baselineMetadata: Metadata = {
  title: { absolute: "Privacy Policy | Attic Jiu Jitsu Carlow" },
  description:
    "How Attic Jiu Jitsu Carlow uses information from website enquiries, optional academy updates and website attribution.",
};
export default function PrivacyPolicyPage() {
  return (
    <EditorFlow
      containerId="privacy-policy.content"
      style={{ display: "contents" }}
    >
      <PageIntro
        label="Privacy policy"
        title="Your information. Handled with care."
      >
        <p className="intro-copy">
          <EditorText
            editorId="r00d24edb7a-hv"
            tag="p"
            value={
              "This policy explains the public website and its enquiry form. Updated 27 October 2026. "
            }
          />
        </p>
      </PageIntro>
      <EditorSection
        editorId="r00d24edb7a-lm"
        className="section-chalk section-space"
      >
        <div className="site-container policy-layout">
          <nav aria-label="Privacy policy contents">
            <EditorLink editorId="r00d24edb7a-qc" href="#privacy-contact">
              <EditorText
                editorId="r00d24edb7a-r3"
                tag="a"
                value={"Who to contact"}
              />
            </EditorLink>
            <EditorLink editorId="r00d24edb7a-ry" href="#privacy-information">
              <EditorText
                editorId="r00d24edb7a-st"
                tag="a"
                value={"Information we collect"}
              />
            </EditorLink>
            <EditorLink editorId="r00d24edb7a-tw" href="#privacy-purpose">
              <EditorText
                editorId="r00d24edb7a-un"
                tag="a"
                value={"How we use it"}
              />
            </EditorLink>
            <EditorLink editorId="r00d24edb7a-vh" href="#privacy-providers">
              <EditorText
                editorId="r00d24edb7a-wa"
                tag="a"
                value={"Service providers"}
              />
            </EditorLink>
            <EditorLink editorId="r00d24edb7a-x8" href="#privacy-retention">
              <EditorText
                editorId="r00d24edb7a-y1"
                tag="a"
                value={"Keeping your information"}
              />
            </EditorLink>
            <EditorLink editorId="r00d24edb7a-z6" href="#privacy-rights">
              <EditorText
                editorId="r00d24edb7a-zw"
                tag="a"
                value={"Your choices and rights"}
              />
            </EditorLink>
          </nav>
          <EditorFlow containerId="r00d24edb7a-11f" className="policy-copy">
            <EditorSection editorId="r00d24edb7a-12l" id="privacy-contact">
              <h2>
                <EditorText
                  editorId="r00d24edb7a-13y"
                  tag="h2"
                  value={"Who to contact"}
                />
              </h2>
              <p>
                <EditorText
                  editorId="r00d24edb7a-15g"
                  tag="p"
                  value={
                    "Attic Jiu Jitsu Carlow is responsible for the personal information you provide through this website’s enquiry form. "
                  }
                />
              </p>
              <address>
                {site.address}
                <br />
                <a href={site.emailHref}>
                  <EditorText
                    editorId="r00d24edb7a-1cy"
                    tag="a"
                    value={site.email}
                  />
                </a>
                <br />
                <a href={site.phoneHref}>
                  <EditorText
                    editorId="r00d24edb7a-1f7"
                    tag="a"
                    value={site.phone}
                  />
                </a>
              </address>
              <p>
                <EditorText
                  editorId="r00d24edb7a-1hb"
                  tag="p"
                  value={
                    "Use these contact details for questions about this policy, your information or your communication preferences. "
                  }
                />
              </p>
            </EditorSection>
            <EditorSection editorId="r00d24edb7a-1mc" id="privacy-information">
              <h2>
                <EditorText
                  editorId="r00d24edb7a-1nt"
                  tag="h2"
                  value={"Information we collect"}
                />
              </h2>
              <p>
                <EditorText
                  editorId="r00d24edb7a-1pj"
                  tag="p"
                  value={
                    "When you enquire, we collect your first and last names, email address, the training interest you select and anything you choose to write in your message. A telephone number is optional. We also receive your privacy and contact confirmations and your separate marketing choice. "
                  }
                />
              </p>
              <p>
                <EditorText
                  editorId="r00d24edb7a-20h"
                  tag="p"
                  value={
                    "Please use an adult’s contact details for an enquiry about kids or teens. The form does not need a child’s name, date of birth, medical information or other sensitive details. Please do not include these in a general enquiry. "
                  }
                />
              </p>
              <p>
                <EditorText
                  editorId="r00d24edb7a-29k"
                  tag="p"
                  value={
                    "If you allow optional analytics, the website can retain campaign parameters in session storage for the current browser tab. These help identify which link or campaign brought an enquiry to us. Contact details and message drafts are not saved in this browser storage. The submission also includes the page address from which you send it. "
                  }
                />
              </p>
            </EditorSection>
            <EditorSection editorId="r00d24edb7a-2m7" id="privacy-purpose">
              <h2>
                <EditorText
                  editorId="r00d24edb7a-2nk"
                  tag="h2"
                  value={"How we use it"}
                />
              </h2>
              <p>
                <EditorText
                  editorId="r00d24edb7a-2p1"
                  tag="p"
                  value={
                    "We use enquiry information to answer your questions, discuss a suitable class or membership and arrange the next steps you request. The form asks for your consent to this response. Providing contact details is voluntary, but we need an email address to answer an email enquiry. You can call the academy instead. "
                  }
                />
              </p>
              <p>
                <EditorText
                  editorId="r00d24edb7a-31e"
                  tag="p"
                  value={
                    "Only if you separately opt in, we may email occasional updates about classes, memberships and academy news. This optional marketing consent is separate from your enquiry. Leaving it unchecked does not affect your ability to enquire. You can withdraw either consent by contacting us; withdrawal does not change the lawfulness of earlier processing. "
                  }
                />
              </p>
              <p>
                <EditorText
                  editorId="r00d24edb7a-3er"
                  tag="p"
                  value={
                    "The public enquiry form does not automatically decide whether you can attend a class or obtain a membership. An enquiry does not reserve a class place or take a payment. "
                  }
                />
              </p>
              <p>
                <EditorText
                  editorId="r00d24edb7a-3lu"
                  tag="p"
                  value={
                    "The website includes Ingenium website analytics to help understand page visits and interactions, such as timetable and enquiry clicks. Technical information may include page addresses, referral or campaign information, browser details and visitor or session identifiers. Analytics and any associated consent controls are separate from the optional email-marketing checkbox. Analytics start only after you choose Allow analytics. You can decline or withdraw using Cookie preferences in the footer. Withdrawal stops optional events and clears analytics identifiers and stored campaign attribution. Enquiries and member bookings continue to work without optional analytics. "
                  }
                />
              </p>
            </EditorSection>
            <EditorSection editorId="r00d24edb7a-4af" id="privacy-providers">
              <h2>
                <EditorText
                  editorId="r00d24edb7a-4bu"
                  tag="h2"
                  value={"Service providers and external links"}
                />
              </h2>
              <p>
                <EditorText
                  editorId="r00d24edb7a-4dy"
                  tag="p"
                  value={
                    "Website enquiries are sent through Ingenium Portal so the academy can receive and manage them. Hosting, website and communication providers may process information as needed to operate these services. Contact the academy for the providers, processing locations and any international-transfer safeguards that apply to your information. "
                  }
                />
              </p>
              <p>
                <EditorText
                  editorId="r00d24edb7a-4qy"
                  tag="p"
                  value={
                    "Instagram, Facebook, map links and other external websites have their own privacy practices. Opening an external link takes you to that provider. The public-site form and policy do not change the separate member-area booking or payment workflows. "
                  }
                />
              </p>
            </EditorSection>
            <EditorSection editorId="r00d24edb7a-50n" id="privacy-retention">
              <h2>
                <EditorText
                  editorId="r00d24edb7a-522"
                  tag="h2"
                  value={"Keeping your information"}
                />
              </h2>
              <p>
                <EditorText
                  editorId="r00d24edb7a-53u"
                  tag="p"
                  value={
                    "Enquiry information should be kept only for as long as needed to answer the enquiry, manage the follow-up you request and meet applicable record-keeping obligations. The relevant criteria are whether a conversation is ongoing, whether an ongoing relationship requires the information and whether a legal obligation requires a record. Contact the academy to ask about the information held for your enquiry. "
                  }
                />
              </p>
              <p>
                <EditorText
                  editorId="r00d24edb7a-5j9"
                  tag="p"
                  value={
                    "Marketing contact information is used until you withdraw consent or it is no longer needed for that purpose. A limited record of your communication preference may be needed to respect a request not to contact you. Campaign session storage ends when the browser tab’s session ends. "
                  }
                />
              </p>
            </EditorSection>
            <EditorSection editorId="r00d24edb7a-5uc" id="privacy-rights">
              <h2>
                <EditorText
                  editorId="r00d24edb7a-5vo"
                  tag="h2"
                  value={"Your choices and rights"}
                />
              </h2>
              <p>
                <EditorText
                  editorId="r00d24edb7a-5xf"
                  tag="p"
                  value={
                    "Depending on the circumstances, you can ask to access, correct or erase your personal information, restrict its use, object to processing, or receive portable information. You can also withdraw consent. Contact the academy using the details above so we can identify and respond to your request. "
                  }
                />
              </p>
              <p>
                <EditorText
                  editorId="r00d24edb7a-68v"
                  tag="p"
                  value={"You can raise a concern with Ireland’s"}
                />
                <EditorText editorId="r00d24edb7a-69x" tag="p" value={" "} />
                <EditorLink
                  editorId="r00d24edb7a-6aj"
                  href="https://www.dataprotection.ie/en/individuals/know-your-rights"
                  target="_blank"
                  rel="noreferrer"
                >
                  <EditorText
                    editorId="r00d24edb7a-6fy"
                    tag="a"
                    value={"Data Protection Commission "}
                  />
                </EditorLink>
                <EditorText
                  editorId="r00d24edb7a-6hq"
                  tag="p"
                  value={
                    ". Its guidance explains your rights and how to make a complaint. "
                  }
                />
              </p>
              <p>
                <EditorText
                  editorId="r00d24edb7a-6l0"
                  tag="p"
                  value={
                    "We may update this notice when the public website’s handling of information changes. The date at the top identifies this version. "
                  }
                />
              </p>
              <EditorLink
                editorId="r00d24edb7a-6qf"
                href="/#trial-form"
                className="text-link"
              >
                <EditorText
                  editorId="r00d24edb7a-6s8"
                  tag="Link"
                  value={"Return to your enquiry "}
                />
              </EditorLink>
            </EditorSection>
          </EditorFlow>
        </div>
      </EditorSection>
    </EditorFlow>
  );
}

export async function generateMetadata() {
  return managedMetadata("/privacy-policy", baselineMetadata);
}
