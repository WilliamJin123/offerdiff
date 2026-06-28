import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://offerdiff.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "OfferDiff — Compare Two Job Offers (Salary, Commute & Cost of Living)",
  description:
    "Compare two job offers and get one number: which is actually worth more per year, adjusted for salary, bonus, equity, benefits, commute, remote days, and cost of living. Free, instant, no signup.",
  keywords: [
    "compare two job offers",
    "job offer comparison calculator",
    "which job offer is better",
    "salary comparison cost of living",
    "job offer calculator",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Which job offer is actually better?",
    description:
      "Paste two job offers → get one number, adjusted for commute, remote work, benefits & cost of living.",
    url: siteUrl,
    siteName: "OfferDiff",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Which job offer is actually better?",
    description:
      "Paste two job offers → get one number, adjusted for commute, remote work, benefits & cost of living.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
