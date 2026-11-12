import type { Metadata } from "next";
import { Clients, Contact, Services } from "@/components/home/Closing";
import { Hero } from "@/components/home/Hero";
import { ClientShowcase } from "@/components/work/ClientShowcase";
import { ServiceFolders } from "@/components/work/ServiceFolders";
import { Container, Section, SectionHead } from "@/components/layout/Section";
import { FlowBackground } from "@/components/motion/FlowBackground";
import { MotionRoot } from "@/components/motion/Reveal";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { home } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: home.meta.title },
  description: home.meta.description,
};

/**
 * One page, no cuts: the background fades from section to section (FlowBackground).
 * Hero with the showreel piece; selected work as a jigsaw; every project by type in folders;
 * services as a tear-off flyer; clients assembling; contact as pieces.
 */
export default function HomePage() {
  return (
    <MotionRoot>
      <Header />
      <main id="contenu">
        <FlowBackground />
        <Hero />
        <Section id="projets" spacing="compact" aria-labelledby="projets-title" className="scroll-mt-16">
          <Container>
            <SectionHead id="projets-title" title={home.showcase.title} lead={home.showcase.lead} />
            <div className="mt-10 md:mt-14">
              <ClientShowcase />
            </div>
          </Container>
        </Section>
        <Section id="dossiers" spacing="compact" aria-labelledby="dossiers-title" className="scroll-mt-16">
          <Container>
            <SectionHead id="dossiers-title" title={home.folders.title} lead={home.folders.lead} />
            <div className="mt-10 md:mt-14">
              <ServiceFolders />
            </div>
          </Container>
        </Section>
        <Services />
        <Clients />
        <Contact />
      </main>
      <Footer tone="teal" />
    </MotionRoot>
  );
}
