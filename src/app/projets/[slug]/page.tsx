import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { Container, Section } from "@/components/layout/Section";
import { InView } from "@/components/motion/InView";
import { MotionRoot } from "@/components/motion/Reveal";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { Button } from "@/components/ui/Button";
import { ArrowIcon, ArrowUpRightIcon } from "@/components/ui/icons";
import { vimeoSrc } from "@/lib/vimeo";
import { getCategory } from "@/content/categories";
import { getClient, getProject, leadIndex, nextInCategory, projects, projectsOf, thumbOf, type Media } from "@/content/projects";
import { projectPage as t } from "@/content/site";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projets/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return { title: `${getClient(p.client).name}, ${p.title}`, description: p.brief };
}

/** One picture of the gallery, cropped into its frame (fixed ratio), or a video at its own ratio. */
function MediaBlock({ m, frame }: { m: Media; frame: string }) {
  if (m.kind === "image") {
    return (
      <div className={`relative overflow-hidden rounded-[var(--radius-sm)] bg-sand ${frame}`}>
        <Image src={m.src} alt={m.alt} fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
      </div>
    );
  }
  return (
    <div className={m.portrait ? "mx-auto w-full max-w-[380px]" : "w-full"}>
      <div className="relative w-full overflow-hidden rounded-[var(--radius-sm)] bg-teal" style={{ aspectRatio: m.portrait ? "9 / 16" : "16 / 9" }}>
        <iframe src={vimeoSrc(m.vimeo, false)} title={m.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="absolute inset-0 size-full border-0" />
      </div>
    </div>
  );
}

/** Gallery rhythm: one wide picture, then two side by side, and again. Videos take a full row. */
const slot = (m: Media, i: number) =>
  m.kind === "video"
    ? { cls: "md:col-span-2", frame: "" }
    : i % 3 === 0
      ? { cls: "md:col-span-2", frame: "aspect-[16/9]" }
      : { cls: "", frame: "aspect-[4/5] md:aspect-[1/1]" };

/**
 * Project page: facts pinned on the left (service, client, brief, details), every picture on the
 * right, the lead one first (it morphs in from the home showcase); then the client's other
 * projects and the next project.
 */
export default async function ProjectPage({ params }: PageProps<"/projets/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const client = getClient(p.client);
  const category = getCategory(p.category);
  const next = nextInCategory(p);
  const others = projectsOf(p.client).filter((x) => x.slug !== p.slug);
  const lead = leadIndex(p);
  const hero = p.media[lead];
  const rest = p.media.filter((_, i) => i !== lead);
  const facts = [
    { label: "Client", value: client.name },
    { label: "Service", value: category.name },
    { label: "Projet", value: p.title },
  ];

  return (
    <MotionRoot>
      <Header />
      <main id="contenu">
        {/* Two columns: the facts stay pinned on the left while the pictures scroll on the right
            (phones: facts first, then the pictures). The lead picture sits at the top of the
            right column, about the size it had in the home showcase, so the morph stays short. */}
        <Section spacing="none" aria-labelledby="projet-title" className="pb-[calc(var(--space-section)*0.5)] pt-8 md:pt-12">
          <Container>
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-x-[var(--space-grid)]">
              <aside className="lg:col-span-4">
                <div className="flex flex-col gap-8 lg:sticky lg:top-28">
                  <Link href={`/projets#dossier-${category.id}`} className="inline-flex min-h-11 items-center gap-2 self-start text-small text-ink-muted no-underline hover:text-ink">
                    <ArrowIcon size={12} className="rotate-180" />
                    {t.back}
                  </Link>
                  <div className="flex flex-col gap-3">
                    <p className="text-meta uppercase text-ink-muted">{category.name}</p>
                    <h1 id="projet-title" className="font-display text-h1">{client.name}</h1>
                  </div>
                  <p className="max-w-[40ch] text-lead text-ink-muted">{p.brief}</p>
                  <dl className="border-b border-line">
                    {facts.map((f) => (
                      <div key={f.label} className="flex items-baseline justify-between gap-6 border-t border-line py-3">
                        <dt className="text-small text-ink-muted">{f.label}</dt>
                        <dd className="text-right text-small text-ink">{f.value}</dd>
                      </div>
                    ))}
                    <div className="flex items-baseline justify-between gap-6 border-t border-line py-3">
                      <dt className="text-small text-ink-muted">Médias</dt>
                      <dd className="tabular text-small text-ink">{p.media.length}</dd>
                    </div>
                  </dl>
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 self-start font-display text-body font-semibold underline decoration-ochre decoration-2 underline-offset-[6px]">
                      {p.url.replace("https://", "")}
                      <ArrowUpRightIcon size={12} />
                    </a>
                  ) : null}
                </div>
              </aside>

              <div className="flex flex-col gap-[var(--space-grid)] lg:col-span-8">
                {hero.kind === "image" ? (
                  <ViewTransition name={`projet-${p.slug}`} share="morph" default="none">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-sm)] bg-sand lg:aspect-[16/10]">
                      <Image src={hero.src} alt={hero.alt} fill priority sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
                    </div>
                  </ViewTransition>
                ) : (
                  <MediaBlock m={hero} frame="" />
                )}
                {rest.length > 0 ? (
                  <ul aria-label={t.gallery} className="grid grid-cols-1 gap-[var(--space-grid)] md:grid-cols-2">
                    {rest.map((m, i) => {
                      const sl = slot(m, i);
                      return (
                        <InView as="li" key={i} delay={(i % 3 === 2 ? 1 : 0) * 80} className={sl.cls}>
                          <MediaBlock m={m} frame={sl.frame} />
                        </InView>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
            </div>
          </Container>
        </Section>

        {others.length > 0 ? (
          <Section spacing="flow" aria-labelledby="autres-title">
            <Container>
              <h2 id="autres-title" className="text-h2">
                {t.more(client.name)}
              </h2>
              <ul className="mt-[var(--space-head)] grid grid-cols-2 gap-x-[var(--space-grid)] gap-y-10 md:grid-cols-4">
                {others.map((o, i) => (
                  <InView as="li" key={o.slug} delay={i * 70}>
                    <Link href={`/projets/${o.slug}`} className="group flex flex-col gap-3 no-underline">
                      {/* Shared element too (unless the same project is also "next": one name per page). */}
                      <ViewTransition name={o.slug === next.slug ? undefined : `projet-${o.slug}`} share="morph" default="none">
                        <span className="relative block aspect-[4/3] overflow-hidden rounded-[var(--radius-sm)] bg-sand">
                          <Image src={thumbOf(o.media[leadIndex(o)])} alt="" fill sizes="(min-width: 768px) 25vw, 50vw" className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-quint)] group-hover:scale-[1.03]" />
                        </span>
                      </ViewTransition>
                      <span className="font-display text-body font-semibold">{o.title}</span>
                    </Link>
                  </InView>
                ))}
              </ul>
            </Container>
          </Section>
        ) : null}

        {next.slug !== p.slug ? (
          <Section spacing="flow" aria-labelledby="suivant-title">
            <Container>
              <Link href={`/projets/${next.slug}`} className="group block border-t border-line pt-8 no-underline">
                <span className="text-small text-ink-muted">{t.next}</span>
                <span className="mt-4 grid items-end gap-8 md:grid-cols-12 md:gap-x-[var(--space-grid)]">
                  <span id="suivant-title" className="flex items-center gap-4 font-display text-h1 md:col-span-7">
                    {getClient(next.client).name}
                    <ArrowIcon size={28} className="transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-quint)] group-hover:translate-x-1.5" />
                  </span>
                  {/* Shared element: this picture becomes the next project's hero. */}
                  <ViewTransition name={`projet-${next.slug}`} share="morph" default="none">
                    <span className="relative block aspect-[16/10] overflow-hidden rounded-[var(--radius-sm)] bg-sand md:col-span-5">
                      <Image src={thumbOf(next.media[leadIndex(next)])} alt="" fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-quint)] group-hover:scale-[1.03]" />
                    </span>
                  </ViewTransition>
                </span>
              </Link>
            </Container>
          </Section>
        ) : null}

        <Section tone="teal" sheet spacing="compact" aria-label={t.cta.label}>
          <Container className="flex flex-wrap items-center justify-between gap-6">
            <p className="font-display text-h2">{t.cta.title}</p>
            <Button href={t.cta.href} arrow data-primary-cta="">
              {t.cta.label}
            </Button>
          </Container>
        </Section>
      </main>
      <Footer tone="teal" />
    </MotionRoot>
  );
}
