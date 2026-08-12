import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://marbellaforsale.com"),
  title: {
    default: "Marbella For Sale — Luxury Real Estate",
    template: "%s | Marbella For Sale",
  },
  description:
    "Exceptional villas, penthouses and new developments for sale in Marbella, Benahavís, Estepona and the Costa del Sol.",
  keywords: [
    "luxury real estate Marbella",
    "property for sale Marbella",
    "Marbella villas",
    "Costa del Sol property",
    "new developments Marbella",
  ],
  openGraph: {
    title: "Marbella For Sale — Luxury Real Estate",
    description:
      "Private access to exceptional homes and new developments across Marbella and the Costa del Sol.",
    type: "website",
    locale: "en_GB",
  },
  other: { "codex-preview": "development" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={geist.variable}>{children}</body>
    </html>
  );
}
