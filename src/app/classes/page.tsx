import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { GymMemberPortal } from "@/components/gym-member-portal";
import { getClassCards, gymConfig, gymSessions } from "@/lib/gym-data";

export const metadata: Metadata = {
  title: "Classes",
  description:
    "Explore adult, kids, teens, gi, and no-gi classes at Attic Jiu Jitsu Carlow with an on-site live schedule and member booking area.",
};

export default function ClassesPage() {
  const classCards = getClassCards();
  const scheduleReady = gymSessions.length > 0;

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 py-18 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <p className="eyebrow">Classes</p>
            <h1 className="font-heading text-5xl uppercase leading-none tracking-[0.08em] text-[color:var(--chalk)]">
              Train by level, then move straight into the live Attic schedule.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-[color:var(--fog)]">
              The Attic site now acts as the class guide and the utility layer. You can explore the academy’s class types here, then use the live schedule and member tools further down the page.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/#trial-form"
                className="button-primary"
                data-ingenium-event="contact_cta_click"
                data-ingenium-label="Book a Free Trial"
                data-ingenium-location="classes_hero"
              >
                Book a Free Trial
              </Link>
              <a
                href="#live-schedule"
                className="button-secondary"
                data-ingenium-event="booking_cta_click"
                data-ingenium-label="Jump To Live Schedule"
                data-ingenium-location="classes_hero"
              >
                Jump To Live Schedule
              </a>
            </div>
          </div>

          <div className="panel-dark overflow-hidden">
            <div className="image-frame relative h-64">
              <Image
                src="/images/gallery-1.jpg"
                alt="Brazilian Jiu Jitsu class training in Carlow"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 sm:p-8">
              <p className="eyebrow">How It Works Now</p>
              <ul className="mt-4 grid gap-4 text-lg text-[color:var(--fog)]">
                <li>Class pages stay on brand and on site instead of sending members away.</li>
                <li>Program cards describe the type of training the academy offers.</li>
                <li>The lower schedule surface is ready for portal-fed session times and booking actions.</li>
                <li>
                  {scheduleReady
                    ? "Published sessions are already available to browse below."
                    : "The schedule utility is live, but it still needs the first successful gym sync to show published session times."}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="mx-auto max-w-6xl px-5 py-18 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {classCards.map((program) => (
              <article key={program.id} className="panel-light p-6">
                <p className="eyebrow">{program.category_label ?? "Program"}</p>
                <h2 className="mt-2 font-heading text-3xl uppercase tracking-[0.12em]">
                  {program.name}
                </h2>
                <div className="mt-3 flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em] text-[color:var(--fog)]">
                  <span className="rounded-full border border-white/10 px-3 py-1">
                    {program.duration_minutes} min
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1">
                    {program.upcoming_sessions > 0
                      ? `${program.upcoming_sessions} upcoming session${program.upcoming_sessions === 1 ? "" : "s"}`
                      : "Schedule sync pending"}
                  </span>
                </div>
                <p className="mt-4 text-[color:var(--fog)]">
                  {program.description ??
                    "Program detail will update here once the class sync has been published from the portal."}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-18 sm:px-6 lg:px-8">
        <GymMemberPortal
          bookingPolicy={
            gymConfig.booking_policy ??
            "Use the member area to unlock booking once the schedule has been synced from the portal."
          }
          emptyScheduleMessage="The live timetable is ready for the portal connection, but no published sessions have been synced into this site yet. Run the Attic gym sync against the local or deployed Ingenium Portal once the gym routes are available."
          membershipCopy={
            gymConfig.membership_copy ??
            "Existing members will be able to unlock bookings and manage recent sessions here without leaving the Attic site."
          }
          scheduleHeading={gymConfig.schedule_heading ?? "Live schedule and member bookings"}
          sessions={gymSessions}
          showSchedule
        />
      </section>
    </>
  );
}
