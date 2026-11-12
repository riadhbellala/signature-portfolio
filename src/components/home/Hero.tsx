import { getCategory } from "@/content/categories";
import { IconFolder } from "../ui/icon-folder";
import {
  cover,
  folders,
  projectsIn,
  projects,
  thumbOf,
} from "@/content/projects";
import { home } from "@/content/site";
import { Container, Section } from "../layout/Section";
import { Button } from "../ui/Button";
import { HeroFade, HeroTitle } from "./HeroIntro";
import { VideoPiece } from "./VideoPiece";

/**
 * (01) Hero. The title from the left edge, the offer and actions under it. On the right a teal
 * slab bleeds off the screen; the hand reaches out of it and the showreel piece sits across the
 * cream/teal seam, framed by the title's ochre outline.
 * Entrance on load: title lines, the ochre outline, the text, then the hand and the piece.
 */
export function Hero() {
  const { hero } = home;
  // One cover per service that has work.
  const peek = folders()
    .map((c) => projectsIn(c.id)[0])
    .filter(Boolean)
    .slice(0, 4)
    .map((p) => ({
      src: thumbOf(cover(p)),
      label: getCategory(p.category).name,
    }));
  return (
    <Section
      trace="left"
      spacing="none"
      aria-labelledby="hero-title"
      className="pb-16 md:pb-24"
    >
      {/* Desktop: a teal slab bleeds off the right edge. The hand's teal sleeve comes out of it and
          the reel straddles the seam, half on cream, half on teal. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 hidden w-[24vw] bg-teal lg:-bottom-24 lg:block"
      >
        <span className="absolute bottom-[calc(6rem+2.5rem)] right-[calc(var(--gutter)/2-0.5em)] rotate-180 font-sans text-meta uppercase tracking-[0.2em] text-cream-muted [writing-mode:vertical-rl]">
          {hero.reelTag}
        </span>
      </div>
      <Container className="grid gap-x-6 gap-y-10 pt-10 md:pt-14 lg:grid-cols-12 lg:pt-16">
        <HeroTitle
          id="hero-title"
          lines={hero.title}
          className="relative z-10 lg:col-span-12 lg:col-start-1 lg:row-start-1 lg:-ml-[calc(var(--gutter)-0.5rem)] lg:text-[min(8.8vw,10rem)]"
        />
        <HeroFade
          delay={0.45}
          className="flex flex-col gap-8 lg:col-span-5 lg:col-start-1 lg:row-start-2 lg:self-start lg:pt-4"
        >
          <p className="measure text-lead">{hero.line}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button href={hero.primary.href} arrow data-primary-cta="">
              {hero.primary.label}
            </Button>
            <Button
              href={hero.secondary.href}
              variant="secondary"
              className="max-[479px]:-ml-5"
            >
              {hero.secondary.label}
            </Button>
          </div>
          {/* Shortcut for visitors in a hurry: a folder of the work, with the hint to open it.
              Goes to the page with every project. */}
          <div className="flex max-w-[420px] flex-col gap-3 border-t border-line pt-6">
            <p className="flex items-baseline gap-2 text-small">
              <span className="bg-ochre px-2 py-0.5 font-display font-semibold text-teal">
                {hero.rush.kicker}
              </span>
              <span className="text-ink-muted">{hero.rush.hint}</span>
            </p>
            <IconFolder
              index="↗"
              title={hero.rush.title}
              count={hero.rush.count(projects.length)}
              items={peek}
              href={hero.rush.href}
              compact
              className="!h-[230px]"
            />
          </div>
        </HeroFade>
        {/* Room above the piece for the hand. Desktop: beside the title, across the teal seam. */}
        <div className="flex justify-center pt-6 sm:pt-10 lg:col-span-5 lg:col-start-8 lg:row-span-2 lg:row-start-1 lg:justify-end lg:pt-[clamp(10.5rem,15.5vw,14rem)]">
          <VideoPiece {...hero.video} />
        </div>
      </Container>
    </Section>
  );
}
