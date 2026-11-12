import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/layout/Section";
import { MotionRoot, Reveal, RevealItem } from "@/components/motion/Reveal";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { MetaLabel } from "@/components/type/Labels";
import { Button } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/icons";
import { MediaPiece } from "@/components/work/MediaPiece";
import { vimeoSrc } from "@/lib/vimeo";
import { getCategory } from "@/content/categories";
import { cover, getClient, getProject, nextInCategory, projects, projectsOf, type Media } from "@/content/projects";
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

function MediaBlock({ m, priority }: { m: Media; priority?: boolean }) {
  if (m.kind === "image") {
    return <Image src={m.src} alt={m.alt} width={1800} height={1200} priority={priority} sizes="(min-width: 1280px) 1200px, 100vw" className="h-auto w-full bg-sand" />;
  }
  return (
    <div className={m.portrait ? "mx-auto w-full max-w-[420px]" : "w-full"}>
      <div className="relative w-full bg-teal" style={{ aspectRatio: m.portrait ? "9 / 16" : "16 / 9" }}>
        <iframe src={vimeoSrc(m.vimeo, false)} title={m.title} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen className="absolute inset-0 size-full border-0" />
      </div>
    </div>
  );
}

/**
 * Project page: the work leads. Client and type, two lines of brief, every picture and video
 * of the project, then the client's other projects and the next project of the same type.
 */
export default async function ProjectPage({ params }: PageProps<"/projets/[slug]">) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const client = getClient(p.client);
  const category = getCategory(p.category);
  const next = nextInCategory(p);
  const others = projectsOf(p.client).filter((x) => x.slug !== p.slug);
  const [first, ...rest] = p.media;

  return (
    <MotionRoot>
      <Header />
      <main id="contenu">
        <Section spacing="none" aria-labelledby="projet-title" className="pb-12 pt-6 md:pb-16 md:pt-10">
          <Container>
            <Link href={`/#dossier-${category.id}`} className="inline-flex min-h-12 items-center font-display text-body font-semibold underline decoration-2 underline-offset-8">
              {t.back} · {category.name}
            </Link>
            <div className="mt-6 grid gap-x-6 gap-y-6 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <MetaLabel>{category.name}</MetaLabel>
                <h1 id="projet-title" className="mt-2 text-h1">
                  {client.name}
                </h1>
                <p className="mt-2 font-display text-h3">{p.title}</p>
              </div>
              <p className="measure text-lead lg:col-span-4">{p.brief}</p>
            </div>
            <div className="mt-10 md:mt-14">
              <MediaBlock m={first} priority />
            </div>
          </Container>
        </Section>

        {rest.length > 0 ? (
          <Section spacing="none" aria-label={t.gallery} className="pb-16 md:pb-24">
            <Container>
              <Reveal as="ul" className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                {rest.map((m, i) => (
                  <RevealItem as="li" key={i} className={m.kind === "video" && !m.portrait ? "md:col-span-2" : undefined}>
                    <MediaBlock m={m} />
                  </RevealItem>
                ))}
              </Reveal>
            </Container>
          </Section>
        ) : null}

        {others.length > 0 ? (
          <Section tone="sand" spacing="compact" aria-labelledby="autres-title">
            <Container>
              <h2 id="autres-title" className="text-h2">
                {t.more(client.name)}
              </h2>
              <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
                {others.map((o) => (
                  <li key={o.slug}>
                    <div className="group flex flex-col gap-4">
                      <div className="pr-[10%] transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-quint)] group-hover:-translate-y-1.5">
                        <MediaPiece media={cover(o)} shape={4 / 3} href={`/projets/${o.slug}`} label={o.title} edges={{ top: "flat", right: "tab", bottom: "flat", left: "flat" }} sizes="300px" />
                      </div>
                      <Link href={`/projets/${o.slug}`} tabIndex={-1} className="font-display text-list no-underline decoration-ochre decoration-2 underline-offset-4 group-hover:underline">
                        {o.title}
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </Container>
          </Section>
        ) : null}

        {next.slug !== p.slug ? (
          <Section spacing="compact" aria-labelledby="suivant-title">
            <Container>
              <Link href={`/projets/${next.slug}`} className="group grid items-center gap-8 no-underline md:grid-cols-12">
                <div className="md:col-span-4">
                  <div className="transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-quint)] group-hover:-translate-y-1.5">
                    <MediaPiece media={cover(next)} still shape={4 / 3} edges={{ top: "flat", right: "tab", bottom: "flat", left: "flat" }} sizes="400px" className="w-[88%]" />
                  </div>
                </div>
                <span className="flex flex-col gap-2 md:col-span-7 md:col-start-6">
                  <MetaLabel>{t.next}</MetaLabel>
                  <span id="suivant-title" className="inline-flex items-center gap-3 font-display text-h2 decoration-ochre decoration-2 underline-offset-8 group-hover:underline">
                    {getClient(next.client).name}
                    <ArrowIcon size={24} />
                  </span>
                  <span className="text-body text-ink-muted">{next.title}</span>
                </span>
              </Link>
            </Container>
          </Section>
        ) : null}

        <Section tone="teal" spacing="compact" aria-label={t.cta.label}>
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
