import clsx from "clsx";
import { featuredProjects } from "@/content/projects";
import { serviceName } from "@/content/services";
import { home } from "@/content/site";
import { Container, Section, SectionHead } from "../layout/Section";
import { Reveal, RevealItem } from "../motion/Reveal";
import { ProjectImage } from "../project/ProjectImage";
import { NextLink } from "../site/NextLink";
import { IndexLabel, MetaLabel } from "../type/Labels";
import { Button } from "../ui/Button";

/** Selected projects: one case per screen, image alternating left and right. */
export function Selected() {
  const items = featuredProjects();
  const t = home.selected;
  return (
    <Section id="projets" aria-labelledby="projets-title">
      <Container>
        <SectionHead id="projets-title" title={t.title} lead={t.lead} />
        <ol className="mt-12 flex flex-col gap-20 md:mt-16 md:gap-24 lg:gap-32">
          {items.map((p, i) => {
            const flip = i % 2 === 1;
            return (
              <li key={p.slug}>
                <Reveal className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
                  <RevealItem className={clsx("lg:col-span-8", flip && "lg:order-2 lg:col-start-5")}>
                    <ProjectImage
                      src={p.cover}
                      alt={`${p.title}, ${p.client}`}
                      ratio="16/10"
                      sizes="(min-width: 1024px) 780px, 100vw"
                      index={p.index}
                      category={serviceName(p.category)}
                    />
                  </RevealItem>
                  <RevealItem className={clsx("flex flex-col gap-3 lg:col-span-4 lg:pb-2", flip ? "lg:order-1 lg:col-start-1" : "lg:col-start-9")}>
                    <IndexLabel n={Number(p.index)} />
                    <h3 className="font-display text-h3">{p.client}</h3>
                    <MetaLabel>
                      {serviceName(p.category)} · {p.year}
                    </MetaLabel>
                    <p className="measure mt-1 text-body">{p.result}</p>
                    <Button href={`/projets/${p.slug}`} variant="secondary" arrow className="-ml-5 self-start" aria-label={`${t.open} : ${p.client}`}>
                      {t.open}
                    </Button>
                  </RevealItem>
                </Reveal>
              </li>
            );
          })}
        </ol>
        <NextLink {...t.next} />
      </Container>
    </Section>
  );
}
