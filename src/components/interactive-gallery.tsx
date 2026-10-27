"use client";
import Image from "next/image";
import { useRef, useState } from "react";

type GalleryImage = { src: string; alt: string; title: string };
export function InteractiveGallery({ images }: { images: GalleryImage[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLAnchorElement | null>(null);
  const [active, setActive] = useState(0);
  const current = images[active];
  const move = (direction: number) =>
    setActive((index) => (index + direction + images.length) % images.length);
  if (!images.length)
    return (
      <p>More photographs are on the way. Come see the academy in person.</p>
    );
  return (
    <>
      <div className="gallery-intro-line">
        <span>{images.length} moments from the academy</span>
        <span>Select a photo for the full view </span>
      </div>
      <div className="academy-gallery">
        {images.map((photo, index) => (
          <figure key={photo.src}>
            <a
              href={photo.src}
              className="gallery-image"
              aria-label={`Open photo: ${photo.title}`}
              data-ingenium-event="gallery_interaction"
              data-ingenium-label={photo.title}
              data-ingenium-location="gallery_grid"
              onClick={(event) => {
                event.preventDefault();
                trigger.current = event.currentTarget;
                setActive(index);
                dialog.current?.showModal();
              }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 767px) 100vw, 58vw"
              />
              <span className="image-open" aria-hidden="true">
                +
              </span>
            </a>
            <figcaption>
              <span>{photo.title}</span>
              <span aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
      <dialog
        ref={dialog}
        className="gallery-dialog"
        aria-label="Academy photograph viewer"
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
        onClose={() => trigger.current?.focus()}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
          }
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
          }
        }}
      >
        <div className="dialog-inner">
          <div className="dialog-top">
            <p aria-live="polite">
              {active + 1} / {images.length} · {current.title}
            </p>
            <button
              type="button"
              onClick={() => dialog.current?.close()}
              aria-label="Close photograph"
            >
              Close <span aria-hidden="true">×</span>
            </button>
          </div>
          <div className="dialog-image">
            <Image src={current.src} alt={current.alt} fill sizes="90vw" />
          </div>
          <div className="dialog-controls">
            <button
              type="button"
              onClick={() => move(-1)}
              aria-label="Previous photograph"
            >
              Previous
            </button>
            <a href={current.src} target="_blank" rel="noreferrer">
              Open original
            </a>
            <button
              type="button"
              onClick={() => move(1)}
              aria-label="Next photograph"
            >
              Next
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}
