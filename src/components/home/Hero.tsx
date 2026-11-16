import Link from "next/link";
import { clients } from "@/content/clients";
import { projects } from "@/content/projects";
import { home } from "@/content/site";
import { Container, Section } from "../layout/Section";
import { Button } from "../ui/Button";
import { CircleLink } from "../ui/CircleLink";
import { HeroFade, HeroTitle } from "./HeroIntro";
import { HeroReel } from "./HeroReel";
import Image from "next/image";

/**
 * (01) Hero, full width. A wide rounded panel shows the real work (stands, crossfading); the
 * showreel stands in it as a vertical card on the right; the panel's lower edge is bitten in the
 * middle by a round ochre button: every project, one tap (for visitors in a hurry).
 * Under the panel: the giant title on the left (the focal point), and on the right what we do,
 * the main action, one figure and real clients.
 */
export function Hero() {
  const { hero } = home;
  const heroClients = clients.slice(0, 4).map((c) => c.name);
  const stat = hero.stats[0];

  return (
    <Section
      spacing="none"
      aria-labelledby="hero-title"
      className="pb-16 pt-3 md:pb-24 md:pt-4"
    >
      <Container>
        {/* The panel */}
        <div className="relative">
          <div className="relative h-[min(78svh,640px)] min-h-[520px] md:h-[min(58svh,700px)] md:min-h-[440px] overflow-hidden rounded-[var(--radius-xl)] bg-teal-deep">
            {/* The agency's world in one image (wide on desktop, tall on phones), slowly settling in. */}
            <Image src="/hero.webp" alt={hero.bgAlt} fill priority sizes="100vw" className="hero-bg object-cover object-left max-md:hidden" />
            <Image src="/herom.webp" alt={hero.bgAlt} fill priority sizes="100vw" className="hero-bg object-cover object-bottom md:hidden" />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-tr from-teal-deep/80 via-transparent to-transparent"
            />

            {/* Bottom-left, on the work: the line and what to look at. */}
            <div className="absolute bottom-8 left-6 right-[46%] max-md:hidden text-cream md:bottom-12 md:left-10 md:right-[40%] lg:right-[34%]">
              <p className="max-w-[34ch] font-display text-[clamp(1.05rem,1.6vw,1.6rem)] font-semibold leading-snug">
                {hero.line}
              </p>
            </div>

            {/* Phones: the image's empty sky holds the message (line + the projects shortcut). */}
            <div className="absolute left-5 right-[38%] top-6 flex flex-col items-start gap-4 text-cream md:hidden">
              <p className="font-display text-[1.05rem] font-semibold leading-snug">{hero.line}</p>
              <Link href={hero.rush.href} className="inline-flex h-10 items-center gap-2 rounded-full bg-cream/15 pl-4 pr-1.5 font-display text-small font-semibold text-cream no-underline backdrop-blur active:scale-95">
                {hero.rush.title}
                <span className="flex size-7 items-center justify-center rounded-full bg-ochre text-teal tabular text-meta">{projects.length}</span>
              </Link>
            </div>

            {/* The reel: a vertical card standing in the panel (phones: top-right, in the sky). */}
            <div className="absolute right-4 top-4 w-[32%] md:bottom-6 md:right-6 md:top-6 md:w-auto md:aspect-[9/16]">
              <HeroReel
                {...hero.video}
                soundOn={hero.soundOn}
                soundOff={hero.soundOff}
                className="aspect-[9/16] md:aspect-auto md:h-full"
              />
            </div>
          </div>

          {/* The bite: a round button set into the panel's lower edge. */}
          <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 translate-y-1/2 flex-col items-center">
            <span className="rounded-full bg-cream p-3">
              <CircleLink
                href={hero.rush.href}
                label={`${hero.rush.title} (${projects.length})`}
                size={76}
                tone="ochre"
              />
            </span>
          </div>
        </div>

        {/* Under the panel: the title (focal point) left, the rest right. */}
        <div className="mt-20 grid gap-12 md:mt-28 lg:grid-cols-12 lg:items-end">
          <HeroTitle
            id="hero-title"
            lines={hero.title}
            className="leading-[0.9] tracking-[-0.045em] max-lg:text-center lg:col-span-8 lg:text-[min(6.2vw,8.5rem)]"
          />
          <HeroFade
            delay={0.2}
            className="flex flex-col gap-6 max-lg:items-center max-lg:text-center lg:col-span-4"
          >
            
            <Link
              href={hero.rush.href}
              className="group flex items-baseline gap-2 font-display text-small font-semibold no-underline"
            >
              {hero.rush.kicker}
              <span className="underline decoration-ochre decoration-2 underline-offset-4 group-hover:decoration-4">
                {hero.rush.title} ({projects.length})
              </span>
            </Link>
            <div className="flex items-end gap-5 border-t border-line pt-6">
              <p className="font-display text-[clamp(2.75rem,4vw,4.5rem)] font-bold leading-none tracking-[-0.04em] tabular">
                <sup className="mr-0.5 align-[0.6em] text-[0.45em]">+</sup>
                {stat.value}
              </p>
              <p className="max-w-[20ch] pb-1 text-left text-small text-ink-muted">
                {stat.label}
              </p>
            </div>
            <p className="text-small text-ink-muted">
              {hero.trusted}{" "}
              <span className="font-display font-semibold text-ink">
                {heroClients.join(", ")}
              </span>{" "}
              {hero.trustedMore(clients.length - heroClients.length)}
            </p>
            <div>
              <Button href={hero.primary.href} arrow data-primary-cta="">
                {hero.primary.label}
              </Button>
            </div>
          </HeroFade>
        </div>
      </Container>
    </Section>
  );
}
