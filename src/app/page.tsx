import type { Metadata } from "next";
import { Clients } from "@/components/home/Clients";
import { Hero } from "@/components/home/Hero";
import { About, AllProjectsSection, ContactCta, Testimonials } from "@/components/home/Sections";
import { Selected } from "@/components/home/Selected";
import { Services } from "@/components/home/Services";
import { MotionRoot } from "@/components/motion/Reveal";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { home } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: home.meta.title },
  description: home.meta.description,
};

/**
 * Order: the offer, the work, who trusted us, what we do, the full archive, who we are,
 * then the one action. Each section hands off to the next.
 */
export default function HomePage() {
  return (
    <MotionRoot>
      <Header />
      <main id="contenu">
        <Hero />
        <Selected />
        <Clients />
        <Services />
        <AllProjectsSection />
        <About />
        <Testimonials />
        <ContactCta />
      </main>
      <Footer />
    </MotionRoot>
  );
}
