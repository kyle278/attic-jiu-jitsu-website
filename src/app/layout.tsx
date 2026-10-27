import type { Metadata } from "next";
import { Barlow_Condensed, Source_Sans_3 } from "next/font/google";

import { site } from "@/lib/site-data";
import { WEBSITE_ORIGIN } from "@/portal/public";

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
  metadataBase: new URL(WEBSITE_ORIGIN),
  title: {
    default: "BJJ Carlow | Brazilian Jiu-Jitsu for All Ages | Attic",
    template: `%s | ${site.title}`,
  },
  description: site.description,
  openGraph: {
    title: "BJJ Carlow | Brazilian Jiu-Jitsu for All Ages | Attic",
    description: site.description,
    type: "website",
    url: WEBSITE_ORIGIN,
    siteName: site.title,
    locale: "en_IE",
    images: [{ url: "/images/hero.jpg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IE" className={`${heading.variable} ${body.variable} h-full antialiased`}>
      <body className="min-h-full bg-[color:var(--ink)] font-body text-[color:var(--chalk)]">
        {children}
      </body>
    </html>
  );
}
