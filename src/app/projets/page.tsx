import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section, SectionHead } from "@/components/layout/Section";
import { MotionRoot } from "@/components/motion/Reveal";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { ServiceFolders } from "@/components/work/ServiceFolders";
import { home } from "@/content/site";

export const metadata: Metadata = {
  title: home.projectsPage.metaTitle,
  description: home.projectsPage.metaDescription,
};

/** Every project, by service: the same folders as on the home page, on their own page. */
export default function ProjectsPage() {
  const t = home.projectsPage;
  return (
    <MotionRoot>
      <Header />
      <main id="contenu">
        <Section id="dossiers" spacing="compact" aria-labelledby="dossiers-title" className="scroll-mt-16">
          <Container>
            <Link href="/" className="inline-flex min-h-12 items-center font-display text-body font-semibold underline decoration-2 underline-offset-8">
              {t.back}
            </Link>
            <div className="mt-6">
              <SectionHead id="dossiers-title" title={home.folders.title} lead={home.folders.lead} />
            </div>
            <div className="mt-10 md:mt-14">
              <ServiceFolders />
            </div>
          </Container>
        </Section>
      </main>
      <Footer tone="teal" />
    </MotionRoot>
  );
}
