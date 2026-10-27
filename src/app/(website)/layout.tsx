import { PortalRuntime } from "@/components/portal-runtime";
import { EditorProvider } from "@/components/website-editor/EditorProvider";
import { getEditorRelease } from "@/lib/website-editor/server";
import { getSeoRevision, managedSchemas } from "@/portal/seo/runtime";
import { seoJsonLd } from "@/portal/seo/seo-adapter";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { PublicAttribution } from "@/components/public-attribution";
import { site } from "@/lib/site-data";
import { WEBSITE_ORIGIN } from "@/portal/public";
import { Suspense } from "react";
import "./website.css";
import "@/components/website-editor/website-editor.css";
export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: site.title,
    "@id": `${WEBSITE_ORIGIN}/#academy`,
    url: WEBSITE_ORIGIN,
    image: `${WEBSITE_ORIGIN}/images/hero.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "4 Charlotte St, Graigue",
      addressLocality: "Carlow",
      postalCode: "R93 D431",
      addressCountry: "IE",
    },
    telephone: site.phone,
    email: site.email,
    sameAs: [site.facebookUrl, site.instagramUrl],
  };
  const [editor, seo, schemas] = await Promise.all([
    getEditorRelease(),
    getSeoRevision(),
    managedSchemas([schema]),
  ]);
  return (
    <>
      <meta name="ingenium-editor-release" content={editor.releaseId} />
      {seo && <meta name="ingenium-seo-revision" content={seo.id} />}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: seoJsonLd(schemas) }}
      />
      <EditorProvider snapshot={editor.snapshot}>
        <div className="website-shell">
          <PortalRuntime />
          <Suspense fallback={null}>
            <PublicAttribution />
          </Suspense>
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <SiteHeader />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
        </div>
      </EditorProvider>
    </>
  );
}
