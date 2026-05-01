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
  const thumbnailImages = filteredImages.filter((image) => image.src !== activeImage?.src);

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap gap-3">
        {categories.map((category) => {
          const active = category === activeCategory;
          return (
            <button
              key={category}
              type="button"
              data-ingenium-event="filter_apply"
              data-ingenium-label={category}
              data-ingenium-location="gallery_filter"
              className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] ${
                active
                  ? "border-[color:var(--bronze)] bg-[color:var(--bronze)] text-[color:var(--chalk)]"
                  : "border-white/12 bg-[rgba(63,24,32,0.38)] text-[color:var(--fog)]"
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
          data-ingenium-event="gallery_interaction"
          data-ingenium-label={activeImage.title}
          data-ingenium-location="gallery_featured"
          className="image-frame relative block min-h-[420px] overflow-hidden text-left"
          onClick={() => setLightboxOpen(true)}
        >
          <Image src={activeImage.src} alt={activeImage.alt} fill className="object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(15,12,13,0.88)] via-[rgba(45,20,28,0.34)] to-transparent p-6 text-[color:var(--chalk)]">
            <p className="eyebrow !text-[color:var(--chalk)]">{activeImage.category}</p>
            <h2 className="font-heading text-4xl uppercase tracking-[0.1em]">{activeImage.title}</h2>
            <p className="mt-2 text-sm uppercase tracking-[0.14em] text-[color:var(--fog)]">Tap to expand</p>
          </div>
        </button>

        <div className="grid gap-4 sm:grid-cols-2">
          {thumbnailImages.map((image) => {
            return (
              <button
                key={image.src}
                type="button"
                data-ingenium-event="gallery_interaction"
                data-ingenium-label={image.title}
                data-ingenium-location="gallery_thumbnail"
                className="image-frame relative h-44 overflow-hidden text-left"
                onClick={() => setActiveIndex(filteredImages.findIndex((entry) => entry.src === image.src))}
              >
                <Image src={image.src} alt={image.alt} fill className="object-cover" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(15,12,13,0.88)] via-[rgba(45,20,28,0.32)] to-transparent p-4 text-[color:var(--chalk)]">
                  <p className="font-heading text-xl uppercase tracking-[0.08em]">{image.title}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {lightboxOpen ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(15,12,13,0.9)] p-5" onClick={() => setLightboxOpen(false)}>
          <div className="relative h-[80vh] w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              data-ingenium-event="gallery_interaction"
              data-ingenium-label="Close Lightbox"
              data-ingenium-location="gallery_lightbox"
              className="absolute right-4 top-4 z-10 rounded-full border border-white/20 bg-[rgba(28,22,24,0.78)] px-4 py-2 text-xs uppercase tracking-[0.16em] text-[color:var(--chalk)]"
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
