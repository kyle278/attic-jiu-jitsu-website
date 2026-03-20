import Link from "next/link";

import { navigation, site } from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[color:var(--ink)]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr] lg:px-8">
        <div className="space-y-4">
          <p className="eyebrow">Train In Carlow</p>
          <h2 className="font-heading text-3xl uppercase tracking-[0.12em] text-[color:var(--chalk)]">
            Friendly on your first day. Serious about your progress.
          </h2>
          <p className="max-w-xl text-base text-[color:var(--fog)]">
            Build fitness, confidence, and real grappling skill with a team that welcomes beginners and supports long-term growth.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/#trial-form" className="button-primary" data-track="cta_click" data-label="Book a Free Trial" data-location="footer">
              Book a Free Trial
            </Link>
            <a
              href={site.bookingUrl}
              target="_blank"
              rel="noreferrer"
              className="button-secondary"
              data-track="external_link_click"
              data-label="View Timetable"
              data-location="footer"
            >
              View Timetable
            </a>
          </div>
        </div>

        <div className="space-y-3">
          <p className="eyebrow">Find Us</p>
          <p className="text-[color:var(--chalk)]">{site.address}</p>
          <a href={site.phoneHref} className="block text-[color:var(--fog)] hover:text-[color:var(--chalk)]" data-track="phone_click" data-label={site.phone} data-location="footer">
            {site.phone}
          </a>
          <a href={site.emailHref} className="block text-[color:var(--fog)] hover:text-[color:var(--chalk)]" data-track="email_click" data-label={site.email} data-location="footer">
            {site.email}
          </a>
          <div className="flex gap-4 pt-2 text-sm uppercase tracking-[0.22em] text-[color:var(--fog)]">
            <a href={site.facebookUrl} target="_blank" rel="noreferrer" data-track="external_link_click" data-label="Facebook" data-location="footer">
              Facebook
            </a>
            <a href={site.instagramUrl} target="_blank" rel="noreferrer" data-track="external_link_click" data-label="Instagram" data-location="footer">
              Instagram
            </a>
          </div>
        </div>

        <div className="space-y-3">
          <p className="eyebrow">Explore</p>
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block text-[color:var(--fog)] hover:text-[color:var(--chalk)]"
              data-track="nav_click"
              data-label={item.label}
              data-location="footer"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
