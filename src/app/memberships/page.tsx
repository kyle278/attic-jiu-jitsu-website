import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { pricingGroups, site } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Memberships",
  description: "See beginner packs, monthly memberships, student rates, and family options at Attic Jiu Jitsu Carlow.",
};

export default function MembershipsPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 py-18 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <p className="eyebrow">Memberships</p>
            <h1 className="font-heading text-5xl uppercase leading-none tracking-[0.08em] text-[color:var(--chalk)]">
              Transparent pricing with flexible ways to start.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-[color:var(--fog)]">
              Choose a beginner pack, monthly membership, student rate, or family plan and train in the way that makes sense for your routine.
            </p>
          </div>
          <div className="panel-dark overflow-hidden">
            <div className="image-frame relative h-60">
              <Image src="/images/gallery-6.jpg" alt="Students building technique at Attic Jiu Jitsu Carlow" fill className="object-cover" />
            </div>
            <div className="p-6 sm:p-8">
            <p className="eyebrow">Need Help Choosing?</p>
            <p className="text-lg leading-8 text-[color:var(--fog)]">
              If you are new, the beginner routes are the simplest way to start. If you want regular access, unlimited monthly training offers the strongest value per class.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/#trial-form" className="button-primary">
                Ask About The Best Option
              </Link>
              <a href={site.membershipUrl} target="_blank" rel="noreferrer" className="button-secondary">
                Current Live Pricing
              </a>
            </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="mx-auto max-w-6xl px-5 py-18 sm:px-6 lg:px-8">
          <div className="grid gap-6 xl:grid-cols-3">
            {pricingGroups.map((group) => (
              <article key={group.title} className="panel-light p-6">
                <p className="eyebrow">{group.title}</p>
                <h2 className="mt-2 font-heading text-3xl uppercase tracking-[0.12em]">{group.title} Options</h2>
                <div className="mt-6 grid gap-4">
                  {group.plans.map((plan) => (
                    <div key={plan.name} className="rounded-[18px] border border-white/10 bg-[rgba(63,24,32,0.38)] p-4">
                      <div className="flex flex-col gap-2">
                        <h3 className="font-heading text-2xl uppercase tracking-[0.12em]">{plan.name}</h3>
                        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--fog)]">{plan.price}</p>
                        <p className="text-[color:var(--fog)]">{plan.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-18 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="panel-dark p-6 sm:p-8">
            <p className="eyebrow">Good For First-Timers</p>
            <h2 className="font-heading text-4xl uppercase tracking-[0.1em] text-[color:var(--chalk)]">Start with a pack that gives you time to settle in.</h2>
            <p className="mt-4 text-lg leading-8 text-[color:var(--fog)]">
              Beginner packs are built to remove friction, give you structure, and help you train consistently from the start.
            </p>
          </div>
          <div className="panel-dark p-6 sm:p-8">
            <p className="eyebrow">Built For Families</p>
            <h2 className="font-heading text-4xl uppercase tracking-[0.1em] text-[color:var(--chalk)]">Student and family rates keep regular training within reach.</h2>
            <p className="mt-4 text-lg leading-8 text-[color:var(--fog)]">
              From kids beginner packs to broader family memberships, the academy makes it easier to train together and stay on the mats.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
