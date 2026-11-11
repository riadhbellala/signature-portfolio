import type { Metadata } from "next";
import { Inter_Tight, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Signature creative co. — Agence 360° à Oran",
    template: "%s — Signature creative co.",
  },
  description:
    "Signature creative co., agence de publicité et de marketing 360° à Oran : sites web, identité, murs, tableaux, façades, stands et réseaux sociaux.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${poppins.variable} ${interTight.variable}`}>
      <body>{children}</body>
    </html>
  );
}
