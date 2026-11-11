import { home } from "@/content/site";
import { Container, Section } from "../layout/Section";
import { Button } from "../ui/Button";
import { HeroFade, HeroTitle } from "./HeroIntro";
import { VideoPiece } from "./VideoPiece";

/**
 * (01) Hero. The title across the page, then the offer and the one action on the left, and on
 * the right the showreel cut as a puzzle piece, lowered into place by the hand.
 * Entrance on load: title lines, the ochre outline, the text, then the hand and the piece.
 */
export function Hero() {
  const { hero } = home;
  return (
    <Section trace="left" spacing="none" aria-labelledby="hero-title" className="pb-16 md:pb-24">
      <Container className="grid gap-x-6 gap-y-10 pt-10 md:pt-14 lg:grid-cols-12 lg:pt-16">
        <HeroTitle id="hero-title" lines={hero.title} className="lg:col-span-12" />
        <HeroFade delay={0.45} className="flex flex-col gap-8 lg:col-span-4 lg:self-center">
          <p className="measure text-lead">{hero.line}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Button href={hero.primary.href} arrow data-primary-cta="">
              {hero.primary.label}
            </Button>
            <Button href={hero.secondary.href} variant="secondary" className="max-[479px]:-ml-5">
              {hero.secondary.label}
            </Button>
          </div>
        </HeroFade>
        {/* Room above the piece for the hand that holds it. */}
        <div className="flex justify-start pt-[24vw] lg:col-span-7 lg:col-start-6 lg:justify-center lg:pt-[120px]">
          <VideoPiece {...hero.video} />
        </div>
      </Container>
    </Section>
  );
}
