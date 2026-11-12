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
      <head>
        {/* Project videos are on Vimeo: open the connections early so they start fast. */}
        <link rel="preconnect" href="https://player.vimeo.com" />
        <link rel="preconnect" href="https://i.vimeocdn.com" />
        <link rel="preconnect" href="https://f.vimeocdn.com" />
        {/* Vimeo's video stream servers: the hero reel starts from these. */}
        <link rel="preconnect" href="https://vod-adaptive-ak.vimeocdn.com" />
        <link rel="preconnect" href="https://skyfire.vimeocdn.com" />
        <link rel="preload" as="image" href="https://i.vimeocdn.com/video/2225079737-6983ed37747a3a4f9c93e8576bfb652114a6c893840b3c9e6aa7c75700349a84-d_720x1280" />
      </head>
      <body>{children}</body>
    </html>
  );
}
