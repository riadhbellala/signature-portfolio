import Link from "next/link";
import { featuredProjects } from "@/content/projects";
import { serviceName } from "@/content/services";
import { home } from "@/content/site";
import { Container, Section } from "../layout/Section";
import { ProjectImage } from "../project/ProjectImage";
import { HeroSnap } from "../puzzle/HeroSnap";
import { DisplayTitle } from "../type/DisplayTitle";
import { Button } from "../ui/Button";

/**
 * (01) Hero. The offer in one title and one sentence; on the right a hand sets the missing
 * ochre piece into the teal one. The tops of three project images are cut by the fold.
 */
export function Hero() {
  const { hero } = home;
  const peek = featuredProjects().slice(0, 3);
  return (
    <Section trace="left" spacing="none" aria-labelledby="hero-title">
      <Container className="grid min-h-[calc(100svh-64px-88px)] grid-cols-1 content-center gap-y-10 py-12 md:min-h-[calc(100svh-64px-128px)] md:py-16 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-12">
        <div className="lg:col-span-12">
          <DisplayTitle id="hero-title" lines={hero.title} />
        </div>
        <div className="lg:col-span-5 lg:self-end">
          <p className="measure text-lead">{hero.sentence}</p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 md:mt-10">
            <Button href={hero.primary.href} arrow data-primary-cta="">
              {hero.primary.label}
            </Button>
            <Button href={hero.secondary.href} variant="secondary" className="max-[479px]:-ml-5">
              {hero.secondary.label}
            </Button>
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7 lg:flex lg:justify-end lg:self-end">
          <HeroSnap a={hero.puzzle.a} b={hero.puzzle.b} groupLabel={hero.puzzle.groupLabel} />
        </div>
      </Container>

      <Container>
        <h2 className="sr-only">{hero.peek}</h2>
        <ul className="grid grid-cols-3 gap-3 md:gap-6">
          {peek.map((p) => (
            <li key={p.slug}>
              <Link href={`/projets/${p.slug}`} className="block no-underline" aria-label={`${p.client}, ${serviceName(p.category)}`}>
                <ProjectImage
                  src={p.cover}
                  alt={`${p.title}, ${p.client}`}
                  ratio="16/10"
                  sizes="(min-width: 1280px) 400px, 33vw"
                  index={p.index}
                  category={serviceName(p.category)}
                  compact
                />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
