import type { Metadata } from "next";
import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({
  variable: "--font-ui",
  weight: "variable",
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica Neue", "Arial"],
});

const bodoni = Bodoni_Moda({
  variable: "--font-display",
  weight: "variable",
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
  fallback: ["Bodoni 72", "Didot", "Times New Roman"],
  adjustFontFallback: false,
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
      <body className={`${hanken.variable} ${bodoni.variable}`}>{children}</body>
    </html>
  );
}
