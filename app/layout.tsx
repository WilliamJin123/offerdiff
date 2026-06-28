import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});
const sans = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://offerdiff.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "OfferDiff — Compare Two Job Offers by Real Take-Home Pay",
  description:
    "Compare two job offers and get one honest number: which actually leaves you more per year after income tax (federal + state), commute, rent, benefits, and cost of living. Free, instant, no signup.",
  keywords: [
    "compare two job offers",
    "job offer comparison calculator",
    "which job offer is better",
    "salary after tax by state",
    "take home pay job offer calculator",
    "cost of living salary calculator",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Which job offer is actually better?",
    description:
      "Paste two offers → one honest number, after rent, commute, benefits & cost of living.",
    url: siteUrl,
    siteName: "OfferDiff",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Which job offer is actually better?",
    description:
      "Paste two offers → one honest number, after rent, commute, benefits & cost of living.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#efece4",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body className="font-sans">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
