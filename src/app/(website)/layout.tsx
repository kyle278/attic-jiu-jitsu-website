import { IngeniumTracker } from "@/components/ingenium-tracker";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { portalTrackingScriptSrc } from "@/lib/portal-connect";
import { site } from "@/lib/site-data";
export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SportsActivityLocation",
    name: site.title,
    image: `${site.currentWebsite}/images/hero.jpg`,
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
  return (
    <>
      <script src={portalTrackingScriptSrc} defer />
      <IngeniumTracker />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </>
  );
}
