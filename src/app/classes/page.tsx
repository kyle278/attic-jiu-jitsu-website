import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { classPrograms, site } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Classes",
  description: "Explore adult, kids, teens, gi, and no-gi classes at Attic Jiu Jitsu Carlow.",
};

export default function ClassesPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 py-18 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <p className="eyebrow">Classes</p>
            <h1 className="font-heading text-5xl uppercase leading-none tracking-[0.08em] text-[color:var(--chalk)]">
              Find the right class for your level and your goals.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-[color:var(--fog)]">
              Whether you want a complete beginner start, more live rounds, youth coaching, or a stronger no-gi routine, there is a class path that fits.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/#trial-form" className="button-primary">
                Book a Free Trial
              </Link>
              <a href={site.bookingUrl} target="_blank" rel="noreferrer" className="button-secondary">
                Open Booking Calendar
              </a>
            </div>
          </div>

          <div className="panel-dark overflow-hidden">
            <div className="image-frame relative h-64">
              <Image src="/images/gallery-1.jpg" alt="Brazilian Jiu Jitsu class training in Carlow" fill className="object-cover" />
            </div>
            <div className="p-6 sm:p-8">
              <p className="eyebrow">What To Expect</p>
              <ul className="mt-4 grid gap-4 text-lg text-[color:var(--fog)]">
                <li>Start with the class that matches your current experience level.</li>
                <li>Train in gi, no-gi, youth, or sparring sessions as your confidence grows.</li>
                <li>Use the live booking calendar for the latest session times and availability.</li>
                <li>Ask for guidance if you are not sure where to begin.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="mx-auto max-w-6xl px-5 py-18 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {classPrograms.map((program) => (
              <article key={program.title} className="panel-light p-6">
                <p className="eyebrow">Program</p>
                <h2 className="mt-2 font-heading text-3xl uppercase tracking-[0.12em]">{program.title}</h2>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-[color:var(--fog)]">{program.duration}</p>
                <p className="mt-4 text-[color:var(--fog)]">{program.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-18 sm:px-6 lg:px-8">
        <div className="panel-dark grid gap-8 overflow-hidden p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <p className="eyebrow">Timetable</p>
            <h2 className="font-heading text-4xl uppercase tracking-[0.1em] text-[color:var(--chalk)]">Use the live schedule for the latest class times.</h2>
            <p className="text-lg leading-8 text-[color:var(--fog)]">
              The booking calendar is the best place to see current class times, availability, and session updates.
            </p>
            <div className="image-frame relative h-72">
              <Image src="/images/gallery-7.jpg" alt="Live training atmosphere on the mats at Attic Jiu Jitsu" fill className="object-cover" />
            </div>
          </div>
          <div className="grid gap-4">
            <div className="rounded-[20px] border border-white/10 bg-[rgba(63,24,32,0.38)] p-5">
              <h3 className="font-heading text-2xl uppercase tracking-[0.12em] text-[color:var(--chalk)]">Best for complete beginners</h3>
              <p className="mt-2 text-[color:var(--fog)]">Adults Beginners or No-Gi Beginners are the easiest first step into the academy.</p>
            </div>
            <div className="rounded-[20px] border border-white/10 bg-[rgba(63,24,32,0.38)] p-5">
              <h3 className="font-heading text-2xl uppercase tracking-[0.12em] text-[color:var(--chalk)]">Best for parents</h3>
              <p className="mt-2 text-[color:var(--fog)]">Kids and teens classes focus on discipline, confidence, movement, and a positive team environment.</p>
            </div>
            <a href={site.bookingUrl} target="_blank" rel="noreferrer" className="button-primary w-fit">
              View The Live Timetable
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
