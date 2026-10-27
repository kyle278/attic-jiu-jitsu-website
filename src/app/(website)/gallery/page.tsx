import { EditorFlow } from "@/components/website-editor/Editable";

import {
  EditorSection,
  EditorText,
} from "@/components/website-editor/Editable";
import { managedMetadata } from "@/portal/seo/runtime";
import type { Metadata } from "next";
import { InteractiveGallery } from "@/components/interactive-gallery";
import { PageIntro, StartBand } from "@/components/public-site";
const baselineMetadata: Metadata = {
  title: { absolute: "Inside Attic: BJJ Training in Carlow | Gallery" },
  description:
    "A look inside Attic Jiu Jitsu Carlow. Real training partners, coaching and details on the mats.",
};
const images = [
  {
    src: "/images/gallery-10.jpg",
    alt: "Two training partners discussing a technique on the red mats",
    title: "Working through the details",
  },
  {
    src: "/images/gallery-7.jpg",
    alt: "Close view of a gi-clad training partner at Attic",
    title: "Between rounds",
  },
  {
    src: "/images/gallery-9.jpg",
    alt: "Gi training on the mats below the academy badge",
    title: "On the mats at Attic",
  },
  {
    src: "/images/gallery-6.jpg",
    alt: "Two training partners practising ground grappling",
    title: "Technique in practice",
  },
  {
    src: "/images/gallery-1.jpg",
    alt: "Close view of a ground grappling exchange",
    title: "Live problem solving",
  },
  {
    src: "/images/gallery-3.jpg",
    alt: "Two gi-clad partners practising a standing technique",
    title: "Standing practice",
  },
  {
    src: "/images/gallery-2.jpg",
    alt: "Gi training partners working through a ground position",
    title: "Position and control",
  },
  {
    src: "/images/gallery-4.jpg",
    alt: "Gi-clad training partners practising a technique",
    title: "Repetition and detail",
  },
  {
    src: "/images/gallery-5.jpg",
    alt: "Training partners practising a standing grappling position",
    title: "Learning through practice",
  },
  {
    src: "/images/gallery-8.jpg",
    alt: "A training partner working from a top position",
    title: "Time on the mats",
  },
  {
    src: "/images/gallery-11.jpg",
    alt: "Training partners practising a ground grappling exchange",
    title: "Training together",
  },
  {
    src: "/images/gallery-12.jpg",
    alt: "Two gi-clad training partners working through a leg position",
    title: "One detail at a time",
  },
];
export default function GalleryPage() {
  return (
    <EditorFlow containerId="gallery.content" style={{ display: "contents" }}>
      <PageIntro label="Inside Attic" title="Life on the mats.">
        <p className="intro-copy">
          <EditorText
            editorId="r671c14947c-1sa"
            tag="p"
            value={
              "Training partners. Technical details. The people who make the academy. Take a look around. "
            }
          />
        </p>
      </PageIntro>
      <EditorSection
        editorId="r671c14947c-1w5"
        className="section-chalk gallery-section"
      >
        <div className="site-container">
          <InteractiveGallery images={images} />
        </div>
      </EditorSection>
      <StartBand />
    </EditorFlow>
  );
}

export async function generateMetadata() {
  return managedMetadata("/gallery", baselineMetadata);
}
