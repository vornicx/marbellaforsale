import type { Metadata } from "next";
import { Bodoni_Moda, Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import "./premium-pass.css";
import "./design-hardening.css";

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
    default: "Luxury Property for Sale in Marbella | Marbella For Sale",
    template: "%s | Marbella For Sale",
  },
  description:
    "Curated villas, penthouses and new developments for sale in Marbella, Benahavís, Estepona and the Costa del Sol, with independent advice from Puerto Banús.",
  keywords: [
    "luxury real estate Marbella",
    "property for sale Marbella",
    "Marbella villas",
    "Costa del Sol property",
    "new developments Marbella",
    "Puerto Banus property",
  ],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Marbella For Sale — Luxury Property & Private Search",
    description:
      "Curated homes, new developments and buyer-led property search across Marbella and the Costa del Sol.",
    url: "/",
    siteName: "Marbella For Sale",
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marbella For Sale — Luxury Property & Private Search",
    description: "Curated property and independent buyer guidance across Marbella and the Costa del Sol.",
  },
  icons: { icon: "/icon.svg" },
  other: { "codex-preview": "development" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${hanken.variable} ${bodoni.variable}`}>{children}</body>
    </html>
  );
}
