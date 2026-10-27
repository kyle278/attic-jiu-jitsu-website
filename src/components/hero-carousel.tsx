"use client";
import { EditorImage } from "@/components/website-editor/Editable";
import {
  useEffect,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

const slides = [
  {
    src: "/images/gallery-9.jpg",
    alt: "Training partners on the mats beneath the Attic Jiu Jitsu badge",
    label: "On the mats at Attic",
  },
  {
    src: "/images/gallery-10.jpg",
    alt: "Two training partners work through a technique at Attic",
    label: "Working through the details",
  },
  {
    src: "/images/gallery-6.jpg",
    alt: "Training partners putting a ground technique into practice",
    label: "Technique in practice",
  },
];
const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(callback: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}
function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}

export function HeroCarousel({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(motionQuery).matches,
    () => true,
  );
  const visible = useSyncExternalStore(
    subscribeVisibility,
    () => !document.hidden,
    () => true,
  );
  const running = !paused && !hovered && !focused && !reducedMotion && visible;
  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(
      () => setActive((index) => (index + 1) % slides.length),
      7500,
    );
    return () => window.clearTimeout(timer);
  }, [active, running]);
  function select(index: number) {
    const next = (index + slides.length) % slides.length;
    setActive(next);
    setAnnouncement(
      `Photo ${next + 1} of ${slides.length}: ${slides[next].label}`,
    );
  }
  return (
    <section
      className="home-hero hero-carousel"
      data-running={running}
      data-paused={paused || reducedMotion || !visible}
      aria-label="Attic Jiu Jitsu academy"
      aria-roledescription="carousel"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      }}
    >
      <div className="hero-parallax" aria-hidden="true">
        {slides.map((slide, index) => (
          <div
            className={`hero-slide${active === index ? " is-active" : ""}`}
            key={slide.src}
          >
            <EditorImage
              editorId="home.hero.photo"
              identity={slide.src}
              src={slide.src}
              alt=""
              fill
              preload={index === 0}
              loading={index === 0 ? undefined : "eager"}
              sizes="100vw"
            />
          </div>
        ))}
      </div>
      <div className="hero-shade" />
      <div className="site-container cinematic-hero-content">{children}</div>
      <div className="site-container carousel-bottom">
        <div className="carousel-caption">
          <span className="carousel-caption-label">Carlow, Ireland</span>
          <span>{slides[active].label}</span>
        </div>
        <div className="carousel-controls">
          <div className="carousel-dots" aria-label="Choose a hero photograph">
            {slides.map((slide, index) => (
              <button
                type="button"
                key={slide.src}
                aria-label={`Show photo ${index + 1}: ${slide.label}`}
                aria-pressed={active === index}
                onClick={() => select(index)}
              >
                {String(index + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => select(active - 1)}>
            Previous
          </button>
          <button type="button" onClick={() => select(active + 1)}>
            Next
          </button>
          {!reducedMotion ? (
            <button type="button" onClick={() => setPaused((value) => !value)}>
              {paused ? "Play" : "Pause"}
            </button>
          ) : (
            <span className="carousel-reduced">Manual playback</span>
          )}
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </section>
  );
}
