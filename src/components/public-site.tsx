import {
  EditorImage,
  EditorLink,
  EditorSection,
  EditorText,
} from "@/components/website-editor/Editable";

export function StartBand() {
  return (
    <EditorSection editorId="r67554b31dc-30" className="start-band">
      <div className="site-container start-band-inner">
        <div>
          <p className="section-note">
            <EditorText
              editorId="r67554b31dc-6x"
              tag="p"
              value={"Your next step"}
            />
          </p>
          <h2>
            <EditorText
              editorId="r67554b31dc-7u"
              tag="h2"
              value={"There’s a place for you on the mats."}
            />
          </h2>
        </div>
        <EditorLink
          editorId="r67554b31dc-9n"
          href="/#trial-form"
          className="button-primary"
          data-ingenium-event="contact_cta_click"
          data-ingenium-label="Start training"
          data-ingenium-location="page_end"
        >
          <EditorText
            editorId="r67554b31dc-g5"
            tag="Link"
            value={"Start training "}
          />
        </EditorLink>
      </div>
    </EditorSection>
  );
}
export function PageIntro({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <EditorSection editorId="r67554b31dc-m1" className="page-intro">
      <div className="site-container">
        <p className="location-label">
          <span aria-hidden="true" />
          <EditorText editorId="r67554b31dc-qg" tag="p" value={label} />
        </p>
        <h1>
          <EditorText editorId="r67554b31dc-rd" tag="h1" value={title} />
        </h1>
        {children}
      </div>
    </EditorSection>
  );
}
export function CoachProfiles({ full = false }: { full?: boolean }) {
  const profiles = [
    {
      name: "Darren Curtis",
      role: "Head coach · Black belt",
      src: "/images/coach-darren.jpg",
      short:
        "Training since 2009, Darren brings black belt experience and years on the competition mats to his coaching.",
      long: "Darren started training in 2009 and has competed at national events throughout his jiu jitsu career. He continues to train and compete, bringing that experience back to the academy and the people he coaches.",
    },
    {
      name: "Brian Connolly",
      role: "Coach · Black belt",
      src: "/images/coach-brian.jpg",
      short:
        "Brian began training in 2009 and received his black belt in 2022. He brings years of experience coaching kids and teens.",
      long: "Brian began training in 2009 and received his black belt in 2022. He started coaching kids and teens in 2016 at Gracie Barra Dublin, and restarted Attic’s kids and teens programme in late 2022. That experience shapes his structured, patient approach to teaching.",
    },
  ];
  return (
    <div className={`coach-grid${full ? " coach-grid-full" : ""}`}>
      {profiles.map((coach) => (
        <article className="coach-profile" key={coach.name}>
          <div className="coach-photo">
            <EditorImage
              editorId="r67554b31dc-1ua"
              src={coach.src}
              alt={`${coach.name} coaching on the mats at Attic`}
              fill
              sizes="(max-width: 767px) 100vw, 45vw"
            />
          </div>
          <div className="coach-caption">
            <p className="section-note">
              <EditorText
                editorId="r67554b31dc-22b"
                tag="p"
                value={coach.role}
              />
            </p>
            <h3>
              <EditorText
                editorId="r67554b31dc-238"
                tag="h3"
                value={coach.name}
              />
            </h3>
            <p>
              <EditorText
                editorId="r67554b31dc-245"
                tag="p"
                value={full ? coach.long : coach.short}
              />
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
