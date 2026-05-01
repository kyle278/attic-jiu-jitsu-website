import type { Metadata } from "next";
import { Barlow_Condensed, Source_Sans_3 } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site-data";

import "./globals.css";

const heading = Barlow_Condensed({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.currentWebsite),
  title: {
    default: `${site.title} | Brazilian Jiu Jitsu In Carlow`,
    template: `%s | ${site.title}`,
  },
  description: site.description,
  openGraph: {
    title: `${site.title} | Brazilian Jiu Jitsu In Carlow`,
    description: site.description,
    type: "website",
    url: site.currentWebsite,
    images: [{ url: "/images/hero.jpg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessSchema = {
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
    <html lang="en" className={`${heading.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full bg-[color:var(--ink)] font-body text-[color:var(--chalk)]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
