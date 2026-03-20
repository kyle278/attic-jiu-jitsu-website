import type { Metadata } from "next";
import Link from "next/link";

import { InteractiveGallery } from "@/components/interactive-gallery";
import { galleryImages } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Gallery",
  description: "See the team, the training, and the atmosphere at Attic Jiu Jitsu Carlow.",
};

export default function GalleryPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-5 py-18 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-5">
          <p className="eyebrow">Gallery</p>
          <h1 className="font-heading text-5xl uppercase leading-none tracking-[0.08em] text-[color:var(--chalk)]">
            See the training, the team, and the atmosphere.
          </h1>
          <p className="text-lg leading-8 text-[color:var(--fog)]">
            Real classes, real people, and a real academy environment in Carlow. If you want to get a feel for the room before you visit, this is the best place to start.
          </p>
        </div>
      </section>

      <section className="section-light">
        <div className="mx-auto max-w-6xl px-5 py-18 sm:px-6 lg:px-8">
          <InteractiveGallery images={galleryImages} />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-18 sm:px-6 lg:px-8">
        <div className="panel-dark flex flex-col gap-5 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="eyebrow">Come See It In Person</p>
            <h2 className="font-heading text-4xl uppercase tracking-[0.1em] text-[color:var(--chalk)]">
              The best way to judge the academy is to step onto the mats yourself.
            </h2>
          </div>
          <Link href="/#trial-form" className="button-primary" data-track="cta_click" data-label="Come Try A Class" data-location="gallery_cta">
            Come Try A Class
          </Link>
        </div>
      </section>
    </>
  );
}
