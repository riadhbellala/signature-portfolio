import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/layout/Section";
import { MotionRoot, Reveal, RevealItem } from "@/components/motion/Reveal";
import { ProjectImage } from "@/components/project/ProjectImage";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { MetaLabel } from "@/components/type/Labels";
import { Button } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/icons";
import { categoryNumber, getCategory } from "@/content/categories";
import { getProject, nextInCategory, projectNumber, projects } from "@/content/projects";
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
    description: p.brief,
    robots: p.isPlaceholder ? { index: false } : undefined,
  };
}

/**
 * Project page: the images lead. Cover, the facts, two or three lines of brief, the gallery
 * stacked at the category's ratio, the next project of the same type, then the one action.
 */
export default async function ProjectPage({ params }: PageProps<"/projets/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const category = getCategory(p.category);
  const next = nextInCategory(p);
  const n = projectNumber(p);

  return (
    <MotionRoot>
      <Header />
      <main id="contenu">
        <Section spacing="none" aria-labelledby="projet-title" className="pt-6 md:pt-10">
          <Container>
            <Link href={`/#dossier-${category.id}`} className="inline-flex min-h-12 items-center font-display text-body font-semibold underline decoration-2 underline-offset-8">
              {t.back} · {category.name}
            </Link>
            <ProjectImage
              src={p.cover}
              alt={`${p.title}, ${p.client}`}
              ratio={category.ratio}
              sizes="(min-width: 1280px) 1168px, 100vw"
              index={n}
              category={category.name}
              priority
              className={category.ratio === "4/5" || category.ratio === "1/1" ? "mt-6 w-full md:mx-auto md:max-w-[640px]" : "mt-6 w-full"}
            />

            <div className="grid gap-x-6 gap-y-8 py-12 md:py-16 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <span className="font-sans text-meta text-ink-muted tabular">
                  ({String(categoryNumber(category.id)).padStart(2, "0")}.{n})
                </span>
                <h1 id="projet-title" className="mt-2 text-h1">
                  {p.title}
                </h1>
                <p className="measure mt-6 text-lead">{p.brief}</p>
              </div>
              <dl className="grid grid-cols-3 gap-6 self-end border-t border-line pt-6 lg:col-span-4 lg:col-start-9">
                {[
                  [t.labels.client, p.client],
                  [t.labels.category, category.name],
                  [t.labels.year, p.year],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-1">
                    <dt>
                      <MetaLabel>{k}</MetaLabel>
                    </dt>
                    <dd className="break-words font-display text-body font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Container>
        </Section>

        {p.gallery.length > 0 ? (
          <Section spacing="none" aria-label={t.gallery} className="pb-16 md:pb-24">
            <Container>
              <Reveal as="ul" className="flex flex-col gap-6 md:gap-8">
                {p.gallery.map((src, i) => (
                  <RevealItem as="li" key={i}>
                    <ProjectImage
                      src={src}
                      alt={`${p.title}, image ${i + 1}`}
                      ratio={category.ratio}
                      sizes="(min-width: 1280px) 1168px, 100vw"
                      index={String(i + 1).padStart(2, "0")}
                      category={category.name}
                      className={category.ratio === "4/5" || category.ratio === "1/1" ? "w-full md:mx-auto md:max-w-[640px]" : "w-full"}
                    />
                  </RevealItem>
                ))}
              </Reveal>
            </Container>
          </Section>
        ) : null}

        {next.slug !== p.slug ? (
          <Section tone="sand" spacing="compact" aria-labelledby="suivant-title">
            <Container>
              <Link href={`/projets/${next.slug}`} className="group grid items-end gap-6 no-underline lg:grid-cols-12">
                <span className="flex flex-col gap-2 lg:col-span-4">
                  <MetaLabel>{t.next}</MetaLabel>
                  <span id="suivant-title" className="inline-flex items-center gap-3 font-display text-h2 decoration-ochre decoration-2 underline-offset-8 group-hover:underline">
                    {next.client}
                    <ArrowIcon size={24} />
                  </span>
                  <span className="font-sans text-small text-ink-muted">
                    {next.title} · {next.year}
                  </span>
                </span>
                <span className="lg:col-span-7 lg:col-start-6">
                  <ProjectImage
                    src={next.cover}
                    alt={`${next.title}, ${next.client}`}
                    ratio={category.ratio}
                    sizes="(min-width: 1024px) 680px, 100vw"
                    index={projectNumber(next)}
                    category={category.name}
                    zoom
                    className={category.ratio === "4/5" || category.ratio === "1/1" ? "max-w-[360px]" : undefined}
                  />
                </span>
              </Link>
            </Container>
          </Section>
        ) : null}

        <Section spacing="compact" aria-label={t.cta.label}>
          <Container className="flex justify-start">
            <Button href={t.cta.href} arrow data-primary-cta="">
              {t.cta.label}
            </Button>
          </Container>
        </Section>
      </main>
      <Footer />
    </MotionRoot>
  );
}
