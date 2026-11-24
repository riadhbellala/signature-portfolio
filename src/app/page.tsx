import type { Metadata } from "next";
import { AgencyBridge, Clients, Contact, Services } from "@/components/home/Closing";
import { FloatingProjects } from "@/components/home/FloatingProjects";
import { Hero } from "@/components/home/Hero";
import { projects } from "@/content/projects";
import { ClientShowcase } from "@/components/work/ClientShowcase";
import { DevShowcase } from "@/components/work/DevShowcase";
import { Container, Section } from "@/components/layout/Section";
import { MotionRoot } from "@/components/motion/Reveal";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { home } from "@/content/site";

export const metadata: Metadata = {
  title: { absolute: home.meta.title },
  description: home.meta.description,
};

/**
 * One page. Order: hero; the work, client by client; the sites we built; what we do;
 * the agency on video; clients; contact. Every project by service lives on /projets.
 */
export default function HomePage() {
  return (
    <MotionRoot>
      <Header />
      <main id="contenu">
        <Hero />
        <Section id="projets" spacing="flow" aria-labelledby="projets-title" className="scroll-mt-16">
          <Container>
            <ClientShowcase titleId="projets-title" />
          </Container>
        </Section>
        <Section id="developpement" spacing="flow" aria-labelledby="dev-title" className="scroll-mt-16">
          <Container>
            <DevShowcase />
          </Container>
        </Section>
        <Services />
        <AgencyBridge />
        <Clients />
        <Contact />
      </main>
      <FloatingProjects href={home.hero.rush.href} label={home.hero.rush.title} count={projects.length} />
      <Footer tone="teal" />
    </MotionRoot>
  );
}
