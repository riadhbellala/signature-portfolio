import type { Metadata } from "next";
import { AgencyBridge, Clients, Contact, Services } from "@/components/home/Closing";
import { FloatingProjects } from "@/components/home/FloatingProjects";
import { Hero } from "@/components/home/Hero";
import { projects } from "@/content/projects";
import { WordBand } from "@/components/home/WordBand";
import { ClientShowcase } from "@/components/work/ClientShowcase";
import { DevShowcase } from "@/components/work/DevShowcase";
import { ServiceFolders } from "@/components/work/ServiceFolders";
import { Container, Section, SectionHead } from "@/components/layout/Section";
import { MotionRoot } from "@/components/motion/Reveal";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { home } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: home.meta.title },
  description: home.meta.description,
};

/**
 * One page; each section keeps its own ground (cream, sand, teal), so the tone itself marks
 * where one ends and the next begins.
 * Order (focal path): hero and reel; the sites we built (dark panel); what we do (cards);
 * the work, client by client; every project by service; clients wall; contact.
 */
export default function HomePage() {
  return (
    <MotionRoot>
      <Header />
      <main id="contenu">
        <Hero />
        <Section id="developpement" spacing="compact" aria-labelledby="dev-title" className="scroll-mt-16 pt-0 md:pt-0 lg:pt-0">
          <Container>
            <DevShowcase />
          </Container>
        </Section>
        <Services />
        <AgencyBridge />
        <Section id="projets" tone="cream" sheet spacing="compact" aria-labelledby="projets-title" className="scroll-mt-16 !pt-[300px] md:!pt-[260px] lg:!pt-[340px]">
          <Container>
            <SectionHead id="projets-title" title={home.showcase.title} lead={home.showcase.lead} />
            <div className="mt-10 md:mt-14">
              <ClientShowcase />
            </div>
          </Container>
        </Section>
        <WordBand words={["stands", "vidéo", "sites web", "branding", "supports"]} />
        <Section id="dossiers" spacing="compact" aria-labelledby="dossiers-title" className="relative z-[2] scroll-mt-16 !bg-transparent !pb-0">
          <Container>
            <SectionHead id="dossiers-title" title={home.folders.title} lead={home.folders.lead} />
            <div className="mt-10 md:mt-14">
              <ServiceFolders />
            </div>
          </Container>
        </Section>
        {/* One sand sheet under Clients and Contact: it starts under the last projects of the open
            folder, so they sit across the seam, half on cream, half on sand. */}
        <div className="relative z-[1] -mt-[140px] rounded-t-[var(--radius-xl)] bg-sand md:-mt-[180px]">
          <Clients />
          <Contact />
        </div>
      </main>
      <FloatingProjects href={home.hero.rush.href} label={home.hero.rush.title} count={projects.length} />
      <Footer tone="teal" />
    </MotionRoot>
  );
}
