import type { Metadata, Viewport } from "next";
import "./members.css";
export const metadata: Metadata = {
  title: { absolute: "Attic Members" },
  description:
    "Your Attic Jiu Jitsu member app. Book classes and manage your training.",
  robots: { index: false, follow: false },
  manifest: "/members/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Attic Members",
  },
  icons: { apple: "/images/logo.png" },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#c43148",
};
export default function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="memberApp">{children}</div>;
}
