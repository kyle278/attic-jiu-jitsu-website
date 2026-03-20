"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type GalleryImage = {
  src: string;
  alt: string;
  title: string;
  category: string;
};

type InteractiveGalleryProps = {
  images: GalleryImage[];
};

export function InteractiveGallery({ images }: InteractiveGalleryProps) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(images.map((image) => image.category)))],
    [images],
  );
  const [activeCategory, setActiveCategory] = useState("All");
  const filteredImages = useMemo(
    () => (activeCategory === "All" ? images : images.filter((image) => image.category === activeCategory)),
    [activeCategory, images],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const safeIndex = Math.min(activeIndex, Math.max(filteredImages.length - 1, 0));
  const activeImage = filteredImages[safeIndex] ?? images[0];

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const active = category === activeCategory;
          return (
            <button
              key={category}
              type="button"
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${
                active
                  ? "border-[color:var(--bronze)] bg-[color:var(--bronze)] text-[color:var(--chalk)]"
                  : "border-black/10 bg-white/55 text-black/70"
              }`}
              onClick={() => {
                setActiveCategory(category);
                setActiveIndex(0);
              }}
            >
              {category}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <button
          type="button"
          className="image-frame relative block min-h-[420px] overflow-hidden text-left"
          onClick={() => setLightboxOpen(true)}
        >
          <Image src={activeImage.src} alt={activeImage.alt} fill className="object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent p-6 text-white">
            <p className="eyebrow !text-[color:var(--chalk)]">{activeImage.category}</p>
            <h2 className="font-heading text-4xl uppercase tracking-[0.1em]">{activeImage.title}</h2>
            <p className="mt-2 text-sm uppercase tracking-[0.14em] text-white/80">Tap to expand</p>
          </div>
        </button>

        <div className="grid gap-4 sm:grid-cols-2">
          {filteredImages.map((image, index) => {
            const selected = index === safeIndex;
            return (
              <button
                key={image.src}
                type="button"
                className={`image-frame relative h-44 overflow-hidden text-left ${selected ? "ring-2 ring-[color:var(--bronze)]" : ""}`}
                onClick={() => setActiveIndex(index)}
              >
                <Image src={image.src} alt={image.alt} fill className="object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent p-4 text-white">
                  <p className="font-heading text-xl uppercase tracking-[0.08em]">{image.title}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {lightboxOpen ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/88 p-5" onClick={() => setLightboxOpen(false)}>
          <div className="relative h-[80vh] w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="absolute right-4 top-4 z-10 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-xs uppercase tracking-[0.16em] text-white"
              onClick={() => setLightboxOpen(false)}
            >
              Close
            </button>
            <Image src={activeImage.src} alt={activeImage.alt} fill className="object-contain" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
