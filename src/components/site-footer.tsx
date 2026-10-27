import {
  EditorImage,
  EditorLink,
  EditorText,
} from "@/components/website-editor/Editable";
import Link from "next/link";
import { navigation, site } from "@/lib/site-data";
import { CookiePreferencesButton } from "./portal-runtime";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-container footer-grid">
        <div>
          <EditorLink editorId="r1cd012a34f-95" href="/" className="brand">
            <EditorImage
              editorId="r1cd012a34f-af"
              src="/images/logo.png"
              alt="Attic Jiu Jitsu home"
              width={60}
              height={60}
            />
            <span className="brand-name">
              <EditorText
                editorId="r1cd012a34f-g6"
                tag="span"
                value={"Attic"}
              />
              <span>
                <EditorText
                  editorId="r1cd012a34f-gh"
                  tag="span"
                  value={"Jiu Jitsu · Carlow"}
                />
              </span>
            </span>
          </EditorLink>
          <p className="footer-description">
            <EditorText
              editorId="r1cd012a34f-ju"
              tag="p"
              value={"Serious jiu jitsu. "}
            />
            <br />
            <EditorText
              editorId="r1cd012a34f-kv"
              tag="p"
              value={"A place for everyone. "}
            />
          </p>
        </div>
        <div>
          <h2 className="footer-label">
            <EditorText
              editorId="r1cd012a34f-ns"
              tag="h2"
              value={"Find the academy"}
            />
          </h2>
          <address>{site.address}</address>
          <a href={site.phoneHref}>
            <EditorText editorId="r1cd012a34f-ql" tag="a" value={site.phone} />
          </a>
          <a href={site.emailHref}>
            <EditorText editorId="r1cd012a34f-s1" tag="a" value={site.email} />
          </a>
          <div className="social-links">
            <a href={site.instagramUrl} target="_blank" rel="noreferrer">
              <EditorText
                editorId="r1cd012a34f-w3"
                tag="a"
                value={"Instagram "}
              />
            </a>
            <a href={site.facebookUrl} target="_blank" rel="noreferrer">
              <EditorText
                editorId="r1cd012a34f-z9"
                tag="a"
                value={"Facebook "}
              />
            </a>
          </div>
        </div>
        <nav aria-label="Footer navigation">
          <h2 className="footer-label">
            <EditorText
              editorId="r1cd012a34f-137"
              tag="h2"
              value={"Find your way"}
            />
          </h2>
          {navigation.map((item) => (
            <Link key={item.href} href={item.href}>
              <EditorText
                editorId="r1cd012a34f-16m"
                tag="Link"
                value={item.label}
              />
            </Link>
          ))}
          <Link href="/members">
            <EditorText
              editorId="r1cd012a34f-18t"
              tag="Link"
              value={"Members"}
            />
          </Link>
        </nav>
      </div>
      <div className="site-container footer-topics">
        <nav aria-label="Classes and fitness">
          <h2 className="footer-label">Classes & fitness</h2>
          <Link href="/beginners-bjj-carlow">Beginner jiu-jitsu</Link>
          <Link href="/kids-martial-arts-carlow">Kids martial arts</Link>
          <Link href="/teens-jiu-jitsu-carlow">Teen classes</Link>
          <Link href="/family-martial-arts-carlow">Family training</Link>
          <Link href="/fitness-classes-carlow">Fitness in Carlow</Link>
          <Link href="/womens-bjj-carlow">Jiu-jitsu for women</Link>
          <Link href="/students">Student memberships</Link>
          <Link href="/self-defence-classes-carlow">Self-defence & BJJ</Link>
        </nav>
        <nav aria-label="Fitness guides">
          <h2 className="footer-label">Getting active</h2>
          <Link href="/blog/how-to-get-fit-over-40">How to get fit over 40</Link>
          <Link href="/blog/fitness-for-men-over-40">Fitness over 40 for men</Link>
          <Link href="/blog/fitness-for-women-over-40">Fitness over 40 for women</Link>
          <Link href="/blog/get-fit-without-a-gym">Alternatives to the gym</Link>
          <Link href="/blog">All fitness & BJJ guides</Link>
        </nav>
        <nav aria-label="Visiting the Carlow academy">
          <h2 className="footer-label">Visit us in Carlow</h2>
          <Link href="/athy">Coming from Athy</Link>
          <Link href="/kilkenny">Coming from Kilkenny</Link>
          <Link href="/areas-we-serve">Tullow, Bagenalstown & nearby</Link>
          <p>All classes take place at our Charlotte Street academy in Carlow.</p>
        </nav>
      </div>
      <div className="site-container footer-bottom">
        <span>
          <EditorText editorId="r1cd012a34f-1bv" tag="span" value={"© "} />
          <EditorText
            editorId="r1cd012a34f-1bx"
            tag="span"
            value={new Date().getFullYear()}
          />{" "}
          <EditorText
            editorId="r1cd012a34f-1co"
            tag="span"
            value={"Attic Jiu Jitsu Carlow"}
          />
        </span>
        <EditorLink editorId="r1cd012a34f-1dq" href="/privacy-policy">
          <EditorText
            editorId="r1cd012a34f-1ej"
            tag="Link"
            value={"Privacy policy"}
          />
        </EditorLink>
        <CookiePreferencesButton />
        <EditorLink
          editorId="r1cd012a34f-1gd"
          href="/#trial-form"
          className="text-link"
        >
          <EditorText
            editorId="r1cd012a34f-1i0"
            tag="Link"
            value={"Come train with us "}
          />
        </EditorLink>
      </div>
    </footer>
  );
}
