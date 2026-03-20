import Image from "next/image";
import Link from "next/link";

import { ContactForm } from "@/components/contact-form";
import {
  audiencePaths,
  classHighlights,
  coaches,
  faqs,
  galleryImages,
  heroPoints,
  pricingGroups,
  proofPoints,
  site,
} from "@/lib/site-data";

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <Image
          src="/images/hero-live.jpeg"
          alt="Attic Jiu Jitsu training on the mats in Carlow"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="hero-overlay relative">
          <div className="mx-auto grid min-h-[78vh] max-w-6xl items-end gap-10 px-5 py-18 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8 lg:py-24">
            <div className="fade-up max-w-3xl space-y-7">
              <p className="eyebrow">Brazilian Jiu Jitsu In Carlow</p>
              <h1 className="font-heading text-5xl uppercase leading-none tracking-[0.08em] text-[color:var(--chalk)] sm:text-6xl lg:text-7xl">
                Train with a team that welcomes beginners and builds real skill.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[color:var(--fog)] sm:text-xl">
                Friendly classes for adults, teens, and kids with experienced coaching, gi and no-gi training, and a clear path from your first class to long-term progress.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/#trial-form" className="button-primary" data-track="cta_click" data-label="Book a Free Trial" data-location="hero">
                  Book a Free Trial
                </Link>
                <a
                  href={site.bookingUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="button-secondary"
                  data-track="booking_start"
                  data-label="View Timetable"
                  data-location="hero"
                >
                  View Timetable
                </a>
              </div>
            </div>

            <div className="panel-dark fade-up grid gap-4 p-6 sm:p-8">
              <p className="eyebrow">Why People Start Here</p>
              <div className="grid gap-3">
                {heroPoints.map((point) => (
                  <div key={point} className="flex items-center gap-3 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
                    <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--bronze)]" />
                    <span className="text-base text-[color:var(--chalk)]">{point}</span>
                  </div>
                ))}
              </div>
              <div className="grid gap-4 rounded-[20px] border border-white/10 bg-[rgba(67,25,34,0.42)] p-5">
                <p className="font-heading text-2xl uppercase tracking-[0.12em] text-[color:var(--chalk)]">
                  {site.address}
                </p>
                <a href={site.phoneHref} className="text-lg text-[color:var(--fog)]" data-track="phone_click" data-label={site.phone} data-location="hero_card">
                  {site.phone}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          {audiencePaths.map((path) => (
            <Link key={path.title} href={path.href} className="panel-dark block p-6" data-track="cta_click" data-label={path.title} data-location="path_cards">
              <p className="eyebrow">{path.eyebrow}</p>
              <h2 className="mt-3 font-heading text-3xl uppercase tracking-[0.12em] text-[color:var(--chalk)]">{path.title}</h2>
              <p className="mt-4 text-base leading-7 text-[color:var(--fog)]">{path.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section-light">
        <div className="mx-auto max-w-6xl px-5 py-18 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-5">
              <p className="eyebrow">Train With Confidence</p>
              <h2 className="font-heading text-5xl uppercase leading-none tracking-[0.08em]">
                A local academy with serious coaching and a supportive atmosphere.
              </h2>
              <p className="max-w-xl text-lg leading-8 text-[color:var(--fog)]">
                Whether you want fitness, self-belief, a new challenge, or a competitive edge, Attic gives you a place to train consistently and improve the right way.
              </p>
              <div className="image-frame relative h-72 overflow-hidden border-white/10">
                <Image src="/images/gallery-2.jpg" alt="Live grappling exchange during class at Attic Jiu Jitsu" fill className="object-cover" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {proofPoints.map((point) => (
                <div key={point} className="panel-light p-6">
                  <p className="font-heading text-2xl uppercase tracking-[0.12em]">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-18 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-5">
            <p className="eyebrow">Programs</p>
            <h2 className="font-heading text-5xl uppercase leading-none tracking-[0.08em] text-[color:var(--chalk)]">
              Classes for adults, kids, teens, and competitors.
            </h2>
            <p className="max-w-xl text-lg leading-8 text-[color:var(--fog)]">
              Start with the class that matches your level, then grow into the full timetable as your confidence and training volume build.
            </p>
            <div className="flex flex-wrap gap-3">
              {classHighlights.map((highlight) => (
                <span key={highlight} className="rounded-full border border-white/12 px-4 py-2 text-sm text-[color:var(--fog)]">
                  {highlight}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {coaches.map((coach) => (
              <article key={coach.name} className="panel-dark overflow-hidden">
                <div className="image-frame relative h-56">
                  <Image src={coach.image} alt={coach.name} fill className="object-cover" />
                </div>
                <div className="p-6">
                  <p className="eyebrow">{coach.role}</p>
                  <h3 className="mt-2 font-heading text-3xl uppercase tracking-[0.12em] text-[color:var(--chalk)]">{coach.name}</h3>
                  <p className="mt-4 text-base leading-7 text-[color:var(--fog)]">{coach.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-18 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
          <div className="space-y-5">
            <p className="eyebrow">Memberships</p>
            <h2 className="font-heading text-5xl uppercase leading-none tracking-[0.08em]">
              Simple memberships for the way you want to train.
            </h2>
            <p className="max-w-xl text-lg leading-8 text-[color:var(--fog)]">
              Beginner packs, monthly memberships, student rates, and family options make it easy to start well and stay consistent.
            </p>
            <Link href="/memberships" className="button-primary" data-track="pricing_cta_click" data-label="See Membership Options" data-location="home_pricing">
              See Membership Options
            </Link>
            <div className="image-frame relative h-72 overflow-hidden border-white/10">
              <Image src="/images/gallery-3.jpg" alt="Training partners drilling in the academy in Carlow" fill className="object-cover" />
            </div>
          </div>

          <div className="grid gap-4">
            {pricingGroups.slice(0, 2).map((group) => (
              <div key={group.title} className="panel-light p-6">
                <p className="eyebrow">{group.title}</p>
                <div className="mt-4 grid gap-4">
                  {group.plans.slice(0, 2).map((plan) => (
                    <div key={plan.name} className="rounded-[18px] border border-white/10 bg-[rgba(63,24,32,0.38)] p-4">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <h3 className="font-heading text-2xl uppercase tracking-[0.12em]">{plan.name}</h3>
                        <span className="text-sm font-semibold uppercase tracking-[0.12em] text-[color:var(--fog)]">{plan.price}</span>
                      </div>
                      <p className="mt-2 text-[color:var(--fog)]">{plan.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-18 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {galleryImages.slice(4, 8).map((image) => (
            <div key={image.src} className="image-frame relative h-72">
              <Image src={image.src} alt={image.alt} fill className="object-cover" />
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="eyebrow">Inside The Academy</p>
            <h2 className="font-heading text-4xl uppercase tracking-[0.1em] text-[color:var(--chalk)]">See the atmosphere before you step on the mats.</h2>
          </div>
          <Link href="/gallery" className="button-secondary" data-track="cta_click" data-label="View Gallery" data-location="home_gallery">
            View Gallery
          </Link>
        </div>
      </section>

      <section className="section-light">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-18 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="space-y-5">
            <p className="eyebrow">Frequently Asked Questions</p>
            <h2 className="font-heading text-5xl uppercase leading-none tracking-[0.08em]">
              Everything you need to know before your first class.
            </h2>
          </div>
          <div className="grid gap-4">
            {faqs.map((faq) => (
              <details key={faq.question} className="panel-light p-5">
                <summary className="cursor-pointer list-none font-heading text-2xl uppercase tracking-[0.1em]" data-track="faq_expand" data-label={faq.question} data-location="home_faq">
                  {faq.question}
                </summary>
                <p className="mt-3 text-[color:var(--fog)]">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-18 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <p className="eyebrow">Take The First Step</p>
            <h2 className="font-heading text-5xl uppercase leading-none tracking-[0.08em] text-[color:var(--chalk)]">
              Ask a question, book a free trial, and find the right class for you.
            </h2>
            <p className="max-w-xl text-lg leading-8 text-[color:var(--fog)]">
              If you are not sure where to start, send an enquiry and the team can point you toward the best class, membership, or beginner route.
            </p>
            <div className="grid gap-3 text-base text-[color:var(--fog)]">
              <a href={site.phoneHref} data-track="phone_click" data-label={site.phone} data-location="home_contact">
                {site.phone}
              </a>
              <a href={site.emailHref} data-track="email_click" data-label={site.email} data-location="home_contact">
                {site.email}
              </a>
              <p>{site.address}</p>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
