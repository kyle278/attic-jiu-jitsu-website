import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { coaches, site } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "About Us",
  description: "Meet the coaches and learn what makes Attic Jiu Jitsu a welcoming place to train in Carlow.",
};

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 py-18 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <p className="eyebrow">About Us</p>
            <h1 className="font-heading text-5xl uppercase leading-none tracking-[0.08em] text-[color:var(--chalk)]">
              Experienced coaches. Welcoming culture. Serious Jiu Jitsu.
            </h1>
            <p className="max-w-xl text-lg leading-8 text-[color:var(--fog)]">
              Attic Jiu Jitsu is built around good coaching, steady progress, and a strong team environment for people who want to train well in Carlow.
            </p>
          </div>
          <div className="image-frame relative min-h-80">
            <Image src="/images/gallery-4.jpg" alt="Attic Jiu Jitsu team training together" fill className="object-cover" />
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-18 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="panel-light p-6">
            <p className="eyebrow">Culture</p>
            <h2 className="font-heading text-3xl uppercase tracking-[0.12em]">Supportive on day one</h2>
            <p className="mt-4 text-black/75">
              Beginners are coached clearly, welcomed into the room, and given a realistic path into training without pressure.
            </p>
          </div>
          <div className="panel-light p-6">
            <p className="eyebrow">Coaching</p>
            <h2 className="font-heading text-3xl uppercase tracking-[0.12em]">Black belt experience</h2>
            <p className="mt-4 text-black/75">
              Years of training, competition, and youth coaching experience shape the academy from the first fundamentals class to advanced rounds.
            </p>
          </div>
          <div className="panel-light p-6">
            <p className="eyebrow">Community</p>
            <h2 className="font-heading text-3xl uppercase tracking-[0.12em]">Built for long-term progress</h2>
            <p className="mt-4 text-black/75">
              Adults, kids, teens, hobbyists, and competitors all have space to learn, improve, and stay consistent.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-18 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {coaches.map((coach) => (
            <article key={coach.name} className="panel-dark overflow-hidden">
              <div className="image-frame relative h-72">
                <Image src={coach.image} alt={coach.name} fill className="object-cover" />
              </div>
              <div className="p-6 sm:p-8">
                <p className="eyebrow">{coach.role}</p>
                <h2 className="mt-3 font-heading text-4xl uppercase tracking-[0.12em] text-[color:var(--chalk)]">{coach.name}</h2>
                <p className="mt-4 text-lg leading-8 text-[color:var(--fog)]">{coach.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-light">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-18 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div className="space-y-5">
            <p className="eyebrow">Train With Us</p>
            <h2 className="font-heading text-5xl uppercase leading-none tracking-[0.08em]">A good fit for first-timers, parents, and committed students.</h2>
            <p className="max-w-xl text-lg leading-8 text-black/75">
              Train for fitness, confidence, a new challenge, or competition. There is a route into the academy that meets you at your level.
            </p>
          </div>
          <div className="panel-light p-6">
            <p className="eyebrow">Find Us</p>
            <p className="font-heading text-3xl uppercase tracking-[0.12em]">{site.address}</p>
            <p className="mt-4 text-black/75">Contact the team if you want help choosing the best class or membership.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/#trial-form" className="button-primary" data-track="cta_click" data-label="Book a Free Trial" data-location="about_cta">
                Book a Free Trial
              </Link>
              <a href={site.phoneHref} className="button-secondary !border-black/15 !text-black" data-track="phone_click" data-label={site.phone} data-location="about_cta">
                Call The Academy
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
