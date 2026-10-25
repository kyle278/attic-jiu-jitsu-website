import type { Metadata } from "next";
import Link from "next/link";
import { getMembershipCards } from "@/lib/gym-data";
import { getGymCatalogue } from "@/lib/server/gym-catalogue";

export const metadata: Metadata = { title: "Memberships", description: "Explore Attic Jiu Jitsu memberships, beginner packs, student rates and family plans in Carlow." };
export const dynamic = "force-dynamic";
export default async function MembershipsPage() {
  const catalogue = await getGymCatalogue();
  const plans = getMembershipCards(catalogue.plans);
  const groups = ["Adults", "Beginners", "Kids", "Teens", "Family"];
  return <>
    <section className="w-full px-5 py-18 sm:px-8 lg:px-12">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end"><div><p className="eyebrow">Memberships</p><h1 className="mt-5 font-heading text-5xl uppercase leading-none tracking-[0.06em] sm:text-6xl">Make training<br />part of your week.</h1><p className="mt-6 max-w-xl text-lg leading-8 text-[color:var(--fog)]">Start with a beginner pack, train whenever you can, or bring the family. Find the option that fits your life.</p></div><div className="space-y-5 border-l border-white/15 pl-6"><p className="text-lg leading-8 text-[color:var(--fog)]">Not sure where to start? Tell us who will be training and we’ll help you choose.</p><div className="flex flex-wrap gap-3"><Link href="/#trial-form" className="button-primary">Talk to the team</Link><Link href="/classes#live-schedule" className="button-secondary">View timetable</Link></div></div></div>
    </section>
    <section id="live-plans" className="section-light scroll-mt-24"><div className="w-full space-y-14 px-5 py-16 sm:px-8 lg:px-12">
      {groups.map(group => <section key={group} aria-label={`${group} memberships`}><h2 className="mb-5 font-heading text-3xl uppercase tracking-[0.08em]">{group}</h2><div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{plans.filter(plan => plan.audience === group).map(plan => <article key={plan.id} className="panel-light flex flex-col p-6"><h3 className="font-heading text-3xl uppercase tracking-[0.04em]">{plan.name}</h3><p className="mt-5 font-heading text-3xl tracking-[0.03em]">{plan.price}</p><p className="mb-7 mt-4 leading-7 text-[color:var(--fog)]">{plan.detail}</p><Link href="/#trial-form" className="button-secondary mt-auto self-start" aria-label={`Ask about ${plan.name}`}>Ask about this plan</Link></article>)}</div></section>)}
      <p className="border-t border-white/15 pt-6 text-sm leading-6 text-[color:var(--fog)]">Memberships and payments are arranged with the academy. Contact us to confirm eligibility, family coverage and your start date.</p>
    </div></section>
    <section id="member-area" className="w-full px-5 py-16 sm:px-8 lg:px-12"><div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/15 pt-8"><div><h2 className="font-heading text-3xl uppercase tracking-[0.08em]">Already training with us?</h2><p className="mt-3 text-[color:var(--fog)]">Contact the team for help with your membership or your next class.</p></div><a href="tel:+353858447393" className="button-primary">Call 085 844 7393</a></div></section>
  </>;
}
