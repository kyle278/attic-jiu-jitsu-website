import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getClassCards } from "@/lib/gym-data";
import { getGymCatalogue, getTimetable } from "@/lib/server/gym-catalogue";

export const metadata: Metadata = { title: "Classes & timetable", description: "Explore adult, kids and teens jiu jitsu at Attic in Carlow. See gi and no-gi classes, class times and training options." };
export const dynamic = "force-dynamic";
const dayFormat = new Intl.DateTimeFormat("en-IE", { weekday: "long", day: "numeric", month: "short", timeZone: "Europe/Dublin" });
const timeFormat = new Intl.DateTimeFormat("en-IE", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Europe/Dublin" });

export default async function ClassesPage() {
  const catalogue = await getGymCatalogue();
  const classes = getClassCards(catalogue.classes, catalogue.sessions);
  const timetable = getTimetable(catalogue);
  const days = Array.from(new Set(timetable.map(item => item.starts_at.slice(0, 10))));
  return <>
    <section className="w-full px-5 py-18 sm:px-8 lg:px-12">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <p className="eyebrow">Attic Jiu Jitsu · Carlow</p>
          <h1 className="font-heading text-5xl uppercase leading-none tracking-[0.06em] sm:text-6xl">Find your place<br />on the mats.</h1>
          <p className="max-w-xl text-lg leading-8 text-[color:var(--fog)]">Your first class or your next challenge. Train gi and no-gi with a welcoming team, with dedicated classes for adults, kids and teens.</p>
          <div className="flex flex-wrap gap-3"><Link href="/#trial-form" className="button-primary">Book a free trial</Link><a href="#live-schedule" className="button-secondary">View timetable</a></div>
        </div>
        <div className="image-frame relative min-h-72 overflow-hidden sm:min-h-96"><Image src="/images/gallery-1.jpg" alt="Training partners on the mats at Attic Jiu Jitsu" fill priority className="object-cover" sizes="(max-width: 1023px) 100vw, 50vw" /></div>
      </div>
    </section>
    <section id="live-schedule" className="section-light scroll-mt-24">
      <div className="w-full px-5 py-16 sm:px-8 lg:px-12">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5"><div><h2 className="font-heading text-4xl uppercase tracking-[0.08em]">Upcoming classes</h2><p className="mt-3 text-[color:var(--fog)]">All times are local to Carlow. Contact the team to reserve a place.</p></div><Link href="/#trial-form" className="button-primary">Ask about a class</Link></div>
        {days.length ? <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">{days.map(day => <div key={day} className="border-t border-white/15 pt-5"><h3 className="font-heading text-2xl uppercase tracking-[0.08em]">{dayFormat.format(new Date(`${day}T12:00:00Z`))}</h3><ul className="mt-4 divide-y divide-white/10">{timetable.filter(item => item.starts_at.startsWith(day)).map(item => <li key={`${item.service.id}-${item.starts_at}`} className="flex items-start gap-5 py-4"><time className="min-w-14 font-heading text-2xl tabular-nums" dateTime={item.starts_at}>{timeFormat.format(new Date(item.starts_at))}</time><div><p className="font-medium text-[color:var(--chalk)]">{item.service.name}</p><p className="mt-1 text-sm text-[color:var(--fog)]">{item.service.duration_label || `${item.service.duration_minutes} min`}</p></div></li>)}</ul></div>)}</div> : <p className="border-t border-white/15 py-8 text-lg">Contact the team for the next class times and help choosing your first session.</p>}
      </div>
    </section>
    <section className="w-full px-5 py-16 sm:px-8 lg:px-12">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><h2 className="font-heading text-4xl uppercase tracking-[0.08em]">Choose your training</h2><Link href="/memberships" className="button-secondary">See memberships</Link></div>
      <div className="grid gap-x-10 md:grid-cols-2 xl:grid-cols-3">{classes.map(item => <article key={item.id} className="border-t border-white/15 py-7"><div className="flex items-start justify-between gap-4"><h3 className="font-heading text-3xl uppercase tracking-[0.05em]">{item.name}</h3><span className="shrink-0 pt-1 text-sm text-[color:var(--fog)]">{item.duration_label || `${item.duration_minutes} min`}</span></div><p className="mt-3 leading-7 text-[color:var(--fog)]">{item.description?.replace("Childrens seself defense & jiu jitsu program", "Self-defence and jiu jitsu for children.") || (item.slug === "grading-day" ? "A chance to celebrate progress with the team. Contact the academy for the next grading date." : "Build your skills with the team. Contact us to find the right class for your experience.")}</p></article>)}</div>
    </section>
  </>;
}
