import Image from "next/image";
import Link from "next/link";
import {
  cover,
  folders,
  projects,
  projectsIn,
  thumbOf,
} from "@/content/projects";
import { clients } from "@/content/clients";
import { home } from "@/content/site";
import { Container, Section } from "../layout/Section";
import { Button } from "../ui/Button";
import { CircleLink } from "../ui/CircleLink";
import { HeroFade, HeroTitle } from "./HeroIntro";
import { HeroReel } from "./HeroReel";

/**
 * (01) Hero. Focal order: the giant title, the one line that says what we do, the main action;
 * then the reel. The shortcut for visitors in a hurry sits on the reel: three covers of real
 * work, "Tous nos projets", the count, a round arrow. Two figures from the agency's own
 * banner close the text column.
 */
export function Hero() {
  const { hero } = home;
  const heroClients = clients.slice(0, 4).map((c) => c.name);
  const peek = folders()
    .map((c) => projectsIn(c.id)[0])
    .filter(Boolean)
    .slice(0, 3)
    .map((p) => thumbOf(cover(p)));
  return (
    <Section
      spacing="none"
      aria-labelledby="hero-title"
      className="pb-16 pt-8 md:pb-24 md:pt-12"
    >
      <Container className="grid items-start gap-x-10 gap-y-12 lg:grid-cols-12">
        {/* Left: one edge, read top to bottom: title, what we do, the action, two figures. */}
        <div className="flex flex-col max-md:items-center lg:col-span-7 lg:self-stretch lg:pt-6">
          <HeroTitle
            id="hero-title"
            lines={hero.title}
            className="leading-[0.92] tracking-[-0.045em] max-md:text-center lg:text-[min(6vw,7.25rem)] lg:whitespace-nowrap"
          />
          <HeroFade
            delay={0.15}
            className="mt-8 flex flex-col gap-8 max-md:items-center"
          >
            <p className="max-w-[44ch] text-lead max-md:text-center">
              {hero.line}
            </p>
            <div className="flex flex-wrap items-center gap-3 max-md:justify-center">
              <Button href={hero.primary.href} arrow data-primary-cta="">
                {hero.primary.label}
              </Button>
              {/* For visitors in a hurry: every project, one tap. */}
              <Link
                href={hero.rush.href}
                className="group flex h-[52px] items-center gap-3 rounded-full pl-1.5 pr-5 font-display text-small font-semibold no-underline shadow-[inset_0_0_0_1.5px_var(--line)] transition-[box-shadow,transform] duration-[var(--dur-ui)] ease-[var(--ease-out-quint)] hover:shadow-[inset_0_0_0_1.5px_var(--ink)] active:scale-[0.96]"
              >
                <span className="flex -space-x-2.5">
                  {peek.map((src) => (
                    <span
                      key={src}
                      className="relative size-10 overflow-hidden rounded-full ring-2 ring-cream"
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </span>
                  ))}
                </span>
                <span>
                  {hero.rush.kicker}{" "}
                  <span className="underline decoration-ochre decoration-2 underline-offset-4 group-hover:decoration-4">
                    {hero.rush.count(projects.length)}
                  </span>
                </span>
              </Link>
            </div>
          </HeroFade>
          <HeroFade
            delay={0.3}
            className="mt-12 flex w-full max-w-[520px] gap-10 border-t border-line pt-8 max-md:justify-center md:gap-16"
          >
            {hero.stats.map((s) => (
              <div
                key={s.label}
                className="flex flex-col gap-2 max-md:items-center max-md:text-center"
              >
                <p className="font-display text-[clamp(2.5rem,4.6vw,4.25rem)] font-bold leading-none tracking-[-0.04em] tabular">
                  <sup className="mr-0.5 align-[0.7em] text-[0.45em]">+</sup>
                  {s.value}
                </p>
                <p className="max-w-[22ch] text-small text-ink-muted">
                  {s.label}
                </p>
              </div>
            ))}
          </HeroFade>
          {/* Bottom of the column, level with the reel's foot: who already trusts us (real clients). */}
          <HeroFade
            delay={0.45}
            className="mt-10 flex max-w-[520px] flex-wrap items-baseline gap-x-2 gap-y-1 text-small text-ink-muted max-md:justify-center max-md:text-center lg:mt-auto"
          >
            <span>{hero.trusted}</span>
            {heroClients.map((n, k) => (
              <span key={n} className="font-display font-semibold text-ink">
                {n}
                {k < heroClients.length - 1 ? "," : ""}
              </span>
            ))}
            <span>{hero.trustedMore(clients.length - heroClients.length)}</span>
          </HeroFade>
        </div>

        <HeroFade delay={0.2} className="lg:col-span-5">
          <HeroReel
            {...hero.video}
            soundOn={hero.soundOn}
            soundOff={hero.soundOff}
          >
            {/* Shortcut column on the reel's left edge (in a notch of cream). */}
            <div className="absolute -left-7 bottom-8 hidden flex-col items-center gap-4 md:flex">
              {peek.slice(0, 2).map((src) => (
                <Link
                  key={src}
                  href={hero.rush.href}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="relative size-14 overflow-hidden rounded-full transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-quint)] hover:scale-105"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </Link>
              ))}
              <CircleLink
                href={hero.rush.href}
                label={`${hero.rush.title} (${projects.length})`}
                size={56}
                tone="ochre"
              />
            </div>
          </HeroReel>
        </HeroFade>
      </Container>
    </Section>
  );
}
