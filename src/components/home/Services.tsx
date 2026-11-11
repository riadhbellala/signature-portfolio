import { poles, services } from "@/content/services";
import { home } from "@/content/site";
import { Container, Section, SectionHead } from "../layout/Section";
import { NextLink } from "../site/NextLink";
import { ServicePicker } from "./ServicePicker";

/** Services: ten trades in four poles, read as a list; the selected one becomes the ochre piece. */
export function Services() {
  const t = home.services;
  return (
    <Section id="services" aria-labelledby="services-title">
      <Container>
        <SectionHead id="services-title" title={t.title} lead={t.lead} />
        <div className="mt-12 md:mt-16">
          <ServicePicker poles={poles} services={services} action={t.action} listLabel={t.listLabel} />
        </div>
        <NextLink {...t.next} />
      </Container>
    </Section>
  );
}
