"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { navigation, site } from "@/lib/site-data";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[color:var(--ink)]/92 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-3"
          data-track="nav_click"
          data-label="Logo"
          data-location="header"
          onClick={() => setOpen(false)}
        >
          <Image src="/images/logo.png" alt="Attic Jiu Jitsu logo" width={44} height={44} className="rounded-full" />
          <div>
            <div className="font-heading text-lg uppercase tracking-[0.24em] text-[color:var(--chalk)]">
              Attic
            </div>
            <div className="text-xs uppercase tracking-[0.3em] text-[color:var(--fog)]">Jiu Jitsu Carlow</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navigation.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm uppercase tracking-[0.22em] transition ${
                  active ? "text-[color:var(--bronze)]" : "text-[color:var(--fog)] hover:text-[color:var(--chalk)]"
                }`}
                data-track="nav_click"
                data-label={item.label}
                data-location="header"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={site.bookingUrl}
            target="_blank"
            rel="noreferrer"
            className="button-secondary"
            data-track="external_link_click"
            data-label="View Timetable"
            data-location="header"
          >
            View Timetable
          </a>
          <Link href="/#trial-form" className="button-primary" data-track="cta_click" data-label="Book a Free Trial" data-location="header">
            Book a Free Trial
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[color:var(--chalk)] lg:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          Menu
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-[color:var(--graphite)] lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-5 sm:px-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm uppercase tracking-[0.22em] text-[color:var(--fog)]"
                data-track="nav_click"
                data-label={item.label}
                data-location="mobile_menu"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <a
              href={site.bookingUrl}
              target="_blank"
              rel="noreferrer"
              className="button-secondary mt-2 text-center"
              data-track="external_link_click"
              data-label="View Timetable"
              data-location="mobile_menu"
            >
              View Timetable
            </a>
            <Link
              href="/#trial-form"
              className="button-primary text-center"
              data-track="cta_click"
              data-label="Book a Free Trial"
              data-location="mobile_menu"
              onClick={() => setOpen(false)}
            >
              Book a Free Trial
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
