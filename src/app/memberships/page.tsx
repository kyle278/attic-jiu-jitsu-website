import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { GymMemberPortal } from "@/components/gym-member-portal";
import { getMembershipCards, gymConfig, gymSessions } from "@/lib/gym-data";

export const metadata: Metadata = {
  title: "Memberships",
  description:
    "See membership options, beginner packs, and the Attic member area inside the site instead of leaving for an external pricing page.",
};

export default function MembershipsPage() {
  const membershipCards = getMembershipCards();

  return (
    <>
      <section className="mx-auto max-w-6xl px-5 py-18 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <p className="eyebrow">Memberships</p>
            <h1 className="font-heading text-5xl uppercase leading-none tracking-[0.08em] text-[color:var(--chalk)]">
              Pricing and member access now live inside the Attic site.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-[color:var(--fog)]">
              This page keeps the academy’s brand tone, but it now works like a practical member surface. You can review plan options here, then use the member area below to unlock current access and booking history.
            </p>
          </div>

          <div className="panel-dark overflow-hidden">
            <div className="image-frame relative h-60">
              <Image
                src="/images/gallery-6.jpg"
                alt="Students building technique at Attic Jiu Jitsu Carlow"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6 sm:p-8">
              <p className="eyebrow">What Is Synced</p>
              <p className="text-lg leading-8 text-[color:var(--fog)]">
                Plan names and utility behaviour are now aligned with the portal integration. The current Attic rate cards are still shown here so members and prospects do not lose pricing clarity while the portal plan surface matures.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/#trial-form"
                  className="button-primary"
                  data-ingenium-event="pricing_cta_click"
                  data-ingenium-label="Ask About The Best Option"
                  data-ingenium-location="memberships_intro"
                >
                  Ask About The Best Option
                </Link>
                <a
                  href="#member-area"
                  className="button-secondary"
                  data-ingenium-event="pricing_cta_click"
                  data-ingenium-label="Open Member Area"
                  data-ingenium-location="memberships_intro"
                >
                  Open Member Area
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-light" id="live-plans">
        <div className="mx-auto max-w-6xl px-5 py-18 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-3">
              <p className="eyebrow">Live Plans</p>
              <h2 className="font-heading text-4xl uppercase tracking-[0.1em] text-[color:var(--chalk)]">
                {gymConfig.plans_heading ?? "Membership options"}
              </h2>
            </div>
            <Link
              href="/classes#live-schedule"
              className="button-secondary"
              data-ingenium-event="pricing_cta_click"
              data-ingenium-label="View Timetable From Memberships"
              data-ingenium-location="memberships_live_plans"
            >
              View Timetable
            </Link>
          </div>

          <div className="grid gap-6 xl:grid-cols-3">
            {membershipCards.map((plan) => (
              <article key={plan.id} className="panel-light p-6">
                <p className="eyebrow">{plan.audience}</p>
                <div className="mt-3 flex items-start justify-between gap-4">
                  <h2 className="font-heading text-3xl uppercase tracking-[0.12em]">{plan.name}</h2>
                  <div className="text-right">
                    <div className="font-heading text-2xl uppercase tracking-[0.12em] text-[color:var(--chalk)]">
                      {plan.price}
                    </div>
                    <div className="mt-1 text-xs uppercase tracking-[0.16em] text-[color:var(--fog)]">
                      {plan.usage_limit_kind === "capped"
                        ? `${plan.usage_limit_count ?? "Set"} / ${plan.usage_period_unit ?? "period"}`
                        : "Flexible access"}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-[color:var(--fog)]">{plan.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-18 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="panel-dark p-6 sm:p-8">
            <p className="eyebrow">For First-Timers</p>
            <h2 className="font-heading text-4xl uppercase tracking-[0.1em] text-[color:var(--chalk)]">
              Start with a route that gives you enough time to settle in.
            </h2>
            <p className="mt-4 text-lg leading-8 text-[color:var(--fog)]">
              Beginner packs still do the same job they always did: reduce friction, give structure, and help people train consistently early.
            </p>
          </div>
          <div className="panel-dark p-6 sm:p-8">
            <p className="eyebrow">For Existing Members</p>
            <h2 className="font-heading text-4xl uppercase tracking-[0.1em] text-[color:var(--chalk)]">
              Use the member area to confirm active access before you book.
            </h2>
            <p className="mt-4 text-lg leading-8 text-[color:var(--fog)]">
              Once the portal routes are live, this page becomes the fastest way to check active plans, recent bookings, and on-site member access.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-18 sm:px-6 lg:px-8">
        <GymMemberPortal
          bookingPolicy={
            gymConfig.booking_policy ??
            "Bookings are handled from the class schedule once the portal timetable has been synced."
          }
          emptyScheduleMessage="Use the classes page for the live timetable after the first successful gym sync."
          membershipCopy={
            gymConfig.membership_copy ??
            "Existing members will be able to use this area for access checks and booking history without leaving the Attic site."
          }
          scheduleHeading="Existing member utility"
          sessions={gymSessions}
          showSchedule={false}
        />
      </section>
    </>
  );
}
