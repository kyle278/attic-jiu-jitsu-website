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
import { carlowDayKey } from "@/components/public-timetable";
import { getClassCards } from "@/lib/gym-data";
import { getGymCatalogue, getTimetable } from "@/lib/server/gym-catalogue";

const baselineMetadata: Metadata = {
  title: "Classes & timetable",
  description:
    "Explore beginner, adult, kids and teens jiu jitsu in Carlow. Gi and no-gi classes, upcoming times and help choosing your first session.",
};
export const dynamic = "force-dynamic";
const dayFormat = new Intl.DateTimeFormat("en-IE", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "Europe/Dublin",
});
const timeFormat = new Intl.DateTimeFormat("en-IE", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "Europe/Dublin",
});
export default async function ClassesPage() {
  const catalogue = await getGymCatalogue();
  const classes = getClassCards(catalogue.classes, catalogue.sessions);
  const timetable = getTimetable(catalogue);
  const days = Array.from(
    new Set(timetable.map((item) => carlowDayKey(item.starts_at))),
  );
  const renderDays = (selectedDays: string[]) =>
    selectedDays.map((day) => {
      const entries = timetable.filter(
        (item) => carlowDayKey(item.starts_at) === day,
      );
      return (
        <EditorSection
          editorId="r0d79884db0-147"
          instanceKey={day}
          className="timetable-day"
          key={day}
        >
          <h3>{dayFormat.format(new Date(entries[0].starts_at))}</h3>
          <ul>
            {entries.map((item) => (
              <li key={`${item.service.id}-${item.starts_at}`}>
                <div className="session-time">
                  <time dateTime={item.starts_at}>
                    {timeFormat.format(new Date(item.starts_at))}
                  </time>
                  {item.ends_at ? (
                    <span>
                      <EditorText
                        editorId="r0d79884db0-1hn"
                        tag="span"
                        value={"to "}
                      />
                      {timeFormat.format(new Date(item.ends_at))}
                    </span>
                  ) : null}
                </div>
                <div>
                  <h4>{item.service.name}</h4>
                  <p>
                    {item.duration_minutes
                      ? `${item.duration_minutes} min`
                      : item.service.duration_label}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </EditorSection>
      );
    });
  return (
    <EditorFlow containerId="classes.content" style={{ display: "contents" }}>
      <PageIntro label="Classes · Carlow" title="Find your place on the mats.">
        <div className="intro-bottom">
          <p>
            <EditorText
              editorId="r0d79884db0-1zj"
              tag="p"
              value={
                "Beginner or experienced. Gi or no-gi. Explore training for adults, kids and teens, and find a session that fits. "
              }
            />
          </p>
          <EditorLink
            editorId="r0d79884db0-23p"
            href="#live-schedule"
            className="button-primary"
          >
            <EditorText
              editorId="r0d79884db0-25i"
              tag="a"
              value={"View timetable "}
            />
          </EditorLink>
        </div>
      </PageIntro>
      <EditorSection
        editorId="r0d79884db0-27g"
        id="live-schedule"
        className="section-chalk section-space timetable-section"
      >
        <div className="site-container">
          <div className="section-title-row">
            <div>
              <p className="section-note">
                <EditorText
                  editorId="r0d79884db0-2el"
                  tag="p"
                  value={"Make time for the mats"}
                />
              </p>
              <h2>
                <EditorText
                  editorId="r0d79884db0-2fu"
                  tag="h2"
                  value={"Upcoming classes."}
                />
              </h2>
              <p>
                <EditorText
                  editorId="r0d79884db0-2gy"
                  tag="p"
                  value={"All times are local to Carlow (Europe/Dublin)."}
                />
              </p>
            </div>
            <Link href="/members" className="text-link">
              <EditorText
                editorId="r0d79884db0-2kv"
                tag="Link"
                value={"Members: book a class "}
              />
            </Link>
          </div>
          {days.length ? (
            <>
              <div className="timetable-grid">
                {renderDays(days.slice(0, 6))}
              </div>
              {days.length > 6 ? (
                <details className="later-timetable">
                  <summary>
                    <EditorText
                      editorId="r0d79884db0-2uo"
                      tag="summary"
                      value={"View later class dates"}
                    />{" "}
                    <span>
                      {days.length - 6}{" "}
                      <EditorText
                        editorId="r0d79884db0-2wo"
                        tag="span"
                        value={"more days"}
                      />
                    </span>
                  </summary>
                  <div className="timetable-grid">
                    {renderDays(days.slice(6))}
                  </div>
                </details>
              ) : null}
            </>
          ) : (
            <div className="empty-catalogue">
              <h3>
                <EditorText
                  editorId="r0d79884db0-35h"
                  tag="h3"
                  value={"The next class times aren’t listed here yet."}
                />
              </h3>
              <p>
                <EditorText
                  editorId="r0d79884db0-37t"
                  tag="p"
                  value={
                    "Contact the academy for the current timetable and help choosing your first session. "
                  }
                />
              </p>
              <EditorLink
                editorId="r0d79884db0-3bi"
                href="/#trial-form"
                className="text-link"
              >
                <EditorText
                  editorId="r0d79884db0-3db"
                  tag="Link"
                  value={"Ask about a class "}
                />
              </EditorLink>
            </div>
          )}
          <p className="schedule-note">
            <EditorText
              editorId="r0d79884db0-3gr"
              tag="p"
              value={
                "New here? Ask the team to confirm a suitable first class. An enquiry does not reserve a place. "
              }
            />
          </p>
        </div>
      </EditorSection>
      <EditorSection editorId="r0d79884db0-3l7" className="section-space">
        <div className="site-container training-routes">
          <div id="beginners" className="training-route">
            <span className="section-note">
              <EditorText
                editorId="r0d79884db0-3ql"
                tag="span"
                value={"New to the mats"}
              />
            </span>
            <h2>
              <EditorText
                editorId="r0d79884db0-3ro"
                tag="h2"
                value={"Start with the fundamentals."}
              />
            </h2>
            <p>
              <EditorText
                editorId="r0d79884db0-3tg"
                tag="p"
                value={
                  "Dedicated beginner classes introduce you to the movement, positions and techniques of Brazilian jiu jitsu. You can learn before you know the terminology. "
                }
              />
            </p>
            <EditorLink
              editorId="r0d79884db0-3zb"
              href="/#beginner-programme"
              className="text-link"
            >
              <EditorText
                editorId="r0d79884db0-41a"
                tag="Link"
                value={"Explore the beginner programme "}
              />
            </EditorLink>
          </div>
          <div id="adults" className="training-route">
            <span className="section-note">
              <EditorText
                editorId="r0d79884db0-45w"
                tag="span"
                value={"Keep developing"}
              />
            </span>
            <h2>
              <EditorText
                editorId="r0d79884db0-46z"
                tag="h2"
                value={"Gi. No-gi. More time training."}
              />
            </h2>
            <p>
              <EditorText
                editorId="r0d79884db0-48t"
                tag="p"
                value={
                  "Gi classes use the traditional training jacket and trousers. No-gi classes train without the gi. Explore mixed-level training, sparring and open mat as you progress. "
                }
              />
            </p>
            <Link href="/memberships#live-plans" className="text-link">
              <EditorText
                editorId="r0d79884db0-4h2"
                tag="Link"
                value={"See adult memberships "}
              />
            </Link>
          </div>
          <div id="youth" className="training-route">
            <span className="section-note">
              <EditorText
                editorId="r0d79884db0-4le"
                tag="span"
                value={"Kids & teens"}
              />
            </span>
            <h2>
              <EditorText
                editorId="r0d79884db0-4me"
                tag="h2"
                value={"A place to learn and grow."}
              />
            </h2>
            <p>
              <EditorText
                editorId="r0d79884db0-4o4"
                tag="p"
                value={
                  "Dedicated classes give younger students age-appropriate coaching. Parents and guardians can ask the team about the right group, equipment and membership. "
                }
              />
            </p>
            <EditorLink
              editorId="r0d79884db0-4tz"
              href="/#trial-form"
              className="text-link"
            >
              <EditorText
                editorId="r0d79884db0-4vq"
                tag="Link"
                value={"Ask about youth classes "}
              />
            </EditorLink>
          </div>
        </div>
      </EditorSection>
      <EditorSection
        editorId="r0d79884db0-4yh"
        className="section-chalk section-space"
      >
        <div className="site-container">
          <div className="section-title-row">
            <h2>
              <EditorText
                editorId="r0d79884db0-52q"
                tag="h2"
                value={"The training, in detail."}
              />
            </h2>
            <p>
              <EditorText
                editorId="r0d79884db0-53z"
                tag="p"
                value={"Explore the academy’s published classes."}
              />
            </p>
          </div>
          <div className="class-catalogue">
            {classes.map((item) => (
              <article key={item.id}>
                <div>
                  <h3>{item.name}</h3>
                  <span className="class-duration">
                    {item.duration_label || `${item.duration_minutes} min`}
                  </span>
                </div>
                <p>
                  {item.description?.replace(
                    "Childrens seself defense & jiu jitsu program",
                    "Self-defence and jiu jitsu for children.",
                  ) ||
                    "Ask the team about this class and whether it suits your experience."}
                </p>
              </article>
            ))}
          </div>
          {!classes.length ? (
            <p>
              <EditorText
                editorId="r0d79884db0-5rr"
                tag="p"
                value={"Contact the academy for current class options."}
              />
            </p>
          ) : null}
        </div>
      </EditorSection>
      <StartBand />
    </EditorFlow>
  );
}

export async function generateMetadata() {
  return managedMetadata("/classes", baselineMetadata);
}
