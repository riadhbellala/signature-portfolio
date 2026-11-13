import type { Metadata } from "next";
import { Inter_Tight, Poppins } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { SoundPrompt } from "@/components/site/SoundPrompt";
import "lenis/dist/lenis.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700", "800"],
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
        <link rel="preload" as="image" href="https://i.vimeocdn.com/video/2225662275-a2e1c5273745ba045abd3d92c02a4cdda6144d226d27abb4b1a5878cdae08f04-d_720x1280" />
      </head>
      <body>
        {children}
        <SoundPrompt />
        <SmoothScroll />
      </body>
    </html>
  );
}
