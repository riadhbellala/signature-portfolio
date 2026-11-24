import Link from "next/link";
import { clients } from "@/content/clients";
import { projects } from "@/content/projects";
import { home } from "@/content/site";
import { Container, Section } from "../layout/Section";
import { Button } from "../ui/Button";
import { HeroFade, HeroTitle } from "./HeroIntro";
import { HeroReel } from "./HeroReel";
import Image from "next/image";

/**
 * Hero. Editorial order: the sentence (what we do), then one line, one action and one proof,
 * then the work itself as one wide image with the showreel standing in its corner.
 * Everything starts on the same left edge (12-column grid).
 */
export function Hero() {
  const { hero } = home;
  const heroClients = clients.slice(0, 3).map((c) => c.name);
  const stat = hero.stats[0];

  return (
    <Section spacing="none" aria-labelledby="hero-title" className="pb-[calc(var(--space-section)*0.5)] pt-16 md:pt-24">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-x-[var(--space-grid)]">
          <HeroTitle id="hero-title" lines={hero.title} className="lg:col-span-8" />
          <HeroFade delay={0.15} className="flex flex-col gap-8 lg:col-span-4 lg:pb-3">
            <p className="max-w-[38ch] text-lead text-ink-muted">{hero.line}</p>
            <div className="flex flex-wrap gap-3 max-sm:[&>a]:flex-1 max-sm:[&>a]:justify-center">
              <Button href={hero.primary.href} arrow data-primary-cta="">
                {hero.primary.label}
              </Button>
              {/* For visitors in a hurry: every project, by service, one tap. */}
              <Link href={hero.rush.href} className="btn btn-secondary">
                <span className="btn-label">{hero.rush.title}</span>
                <span className="tabular text-ink-muted">{projects.length}</span>
              </Link>
            </div>
          </HeroFade>
        </div>

        <HeroFade delay={0.3} className="relative mt-[var(--space-head)]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-xl)] bg-teal-deep sm:aspect-[16/9] lg:aspect-[21/9]">
            <Image src="/hero-stand.webp" alt={hero.bgAlt} fill priority sizes="(min-width: 2400px) 2400px, 100vw" className="object-cover object-[30%_60%]" />
            <div className="absolute bottom-4 right-4 w-[28%] sm:w-[22%] md:bottom-6 md:right-6 lg:w-[15%]">
              <HeroReel {...hero.video} soundOn={hero.soundOn} soundOff={hero.soundOff} className="aspect-[9/16]" />
            </div>
          </div>
        </HeroFade>

        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 text-small text-ink-muted sm:flex-row sm:items-baseline sm:justify-between">
          <p>
            <span className="tabular font-display text-body font-semibold text-ink">+{stat.value}</span> {stat.label}
          </p>
          <p>
            {hero.trusted} <span className="text-ink">{heroClients.join(", ")}</span> {hero.trustedMore(clients.length - heroClients.length)}
          </p>
        </div>
      </Container>
    </Section>
  );
}
