import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/layout/Section";
import { MotionRoot, Reveal, RevealItem } from "@/components/motion/Reveal";
import { ProjectImage } from "@/components/project/ProjectImage";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { IndexLabel, MetaLabel } from "@/components/type/Labels";
import { Button } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/icons";
import { getProject, nextProject, projects } from "@/content/projects";
import { serviceName } from "@/content/services";
import { projectPage as t } from "@/content/site";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projets/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.title}, ${p.client}`,
    description: p.result,
    robots: p.isPlaceholder ? { index: false } : undefined,
  };
}

/** Gallery ratios alternate so the grid has rhythm: 4:5, 1:1, 1:1, 4:5… */
const galleryRatio = (i: number) => (i % 4 === 0 || i % 4 === 3 ? "4/5" : "1/1");

export default async function ProjectPage({ params }: PageProps<"/projets/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const next = nextProject(slug);
  const category = serviceName(p.category);

  return (
    <MotionRoot>
      <Header />
      <main id="contenu">
        {/* Hero image, full width */}
        <section aria-labelledby="projet-title" className="tone-cream">
          <ProjectImage src={p.cover} alt={`${p.title}, ${p.client}`} ratio="21/9" sizes="100vw" index={p.index} category={category} priority bleed className="max-h-[52svh] w-full" />
          <Container className="pb-20 pt-6 md:pb-32 md:pt-10">
            <Link href={t.backHref} className="inline-flex min-h-12 items-center font-display text-body font-semibold underline decoration-2 underline-offset-8">
              {t.back}
            </Link>
            <div className="mt-4 grid gap-10 lg:grid-cols-12 lg:gap-6">
              <div className="flex flex-col gap-4 lg:col-span-7">
                <IndexLabel n={Number(p.index)} />
                <h1 id="projet-title" className="max-w-[14ch] text-h1">
                  {p.title}
                </h1>
              </div>
              <dl className="grid grid-cols-3 gap-6 self-end lg:col-span-4 lg:col-start-9">
                {[
                  [t.labels.client, p.client],
                  [t.labels.category, category],
                  [t.labels.year, p.year],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-1">
                    <dt>
                      <MetaLabel>{k}</MetaLabel>
                    </dt>
                    <dd className="font-display text-body font-semibold break-words">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Container>
        </section>

        {/* Need, then response */}
        <Section tone="sand" trace="right" aria-label={`${t.need}, ${t.response}`}>
          <Container className="flex flex-col gap-20 md:gap-32">
            {[
              { id: "besoin", title: t.need, text: p.need },
              { id: "reponse", title: t.response, text: p.response },
            ].map((b) => (
              <Reveal key={b.id} className="grid gap-6 lg:grid-cols-12">
                <RevealItem className="lg:col-span-4">
                  <h2 id={b.id} className="text-h2">
                    {b.title}
                  </h2>
                </RevealItem>
                <RevealItem className="lg:col-span-6 lg:col-start-6">
                  <p className="measure text-lead">{b.text}</p>
                </RevealItem>
              </Reveal>
            ))}
          </Container>
        </Section>

        {/* Gallery */}
        {p.gallery.length > 0 ? (
          <Section aria-labelledby="galerie-title">
            <Container>
              <h2 id="galerie-title" className="text-h2">
                {t.gallery}
              </h2>
              <Reveal as="ul" className="mt-12 grid grid-cols-1 items-start gap-6 sm:grid-cols-2">
                {p.gallery.map((src, i) => (
                  <RevealItem as="li" key={i}>
                    <ProjectImage
                      src={src}
                      alt={`${p.title}, image ${i + 1}`}
                      ratio={galleryRatio(i)}
                      sizes="(min-width: 640px) 600px, 100vw"
                      index={String(i + 1).padStart(2, "0")}
                      category={category}
                    />
                  </RevealItem>
                ))}
              </Reveal>
            </Container>
          </Section>
        ) : null}

        {/* Result + the one action */}
        <Section tone="teal" aria-labelledby="resultat-title" joint={{ at: "calc(var(--page-edge) + 96px)" }}>
          <Container className="grid gap-16 lg:grid-cols-12 lg:gap-6">
            <div className="lg:col-span-7">
            <h2 id="resultat-title" className="text-h2">
              {t.result}
            </h2>
            <p className="measure mt-6 text-lead">{p.result}</p>
            {p.figures.length > 0 ? (
              <dl className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
                {p.figures.map((f, i) => (
                  <div key={i} className="flex flex-col gap-2">
                    <dt className="order-2 text-body text-ink-muted">{f.label}</dt>
                    <dd className="order-1 font-display text-h3 text-ochre tabular break-words">{f.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            </div>
            <div className="flex flex-col items-start gap-6 lg:col-span-4 lg:col-start-9 lg:self-end">
              <p className="font-display text-h3">{t.cta.title}</p>
              <Button href={t.cta.href} arrow data-primary-cta="">
                {t.cta.label}
              </Button>
            </div>
          </Container>
        </Section>

        {/* Next project */}
        <Section aria-labelledby="suivant-title">
          <Container>
            <Link href={`/projets/${next.slug}`} className="group grid items-end gap-8 no-underline lg:grid-cols-12 lg:gap-6">
              <span className="flex flex-col gap-3 lg:col-span-4">
                <span id="suivant-title" className="font-display text-h2">
                  {next.client}
                </span>
                <MetaLabel>
                  {serviceName(next.category)} · {next.year}
                </MetaLabel>
                <span className="mt-4 inline-flex min-h-12 items-center gap-3 self-start font-display text-body font-semibold underline decoration-2 underline-offset-8 group-hover:decoration-4">
                  {t.next}
                  <ArrowIcon />
                </span>
              </span>
              <span className="lg:col-span-7 lg:col-start-6">
                <ProjectImage
                  src={next.cover}
                  alt={`${next.title}, ${next.client}`}
                  ratio="16/10"
                  sizes="(min-width: 1024px) 700px, 100vw"
                  index={next.index}
                  category={serviceName(next.category)}
                />
              </span>
            </Link>
          </Container>
        </Section>
      </main>
      <Footer />
    </MotionRoot>
  );
}
