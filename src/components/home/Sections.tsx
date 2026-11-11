import { agency } from "@/content/agency";
import { contact } from "@/content/contact";
import { projects } from "@/content/projects";
import { home } from "@/content/site";
import { Container, Section, SectionHead } from "../layout/Section";
import { Reveal, RevealItem } from "../motion/Reveal";
import { ProjectImage } from "../project/ProjectImage";
import { NextLink } from "../site/NextLink";
import { DisplayTitle } from "../type/DisplayTitle";
import { BulletList, MetaLabel } from "../type/Labels";
import { Button } from "../ui/Button";
import { AllProjects } from "./AllProjects";

/** All projects, on the sand band: the second paper tone sets the archive apart. */
export function AllProjectsSection() {
  const t = home.all;
  return (
    <Section id="tous-les-projets" tone="sand" aria-labelledby="tous-title">
      <Container>
        <SectionHead id="tous-title" title={t.title} lead={t.lead} />
        <div className="mt-12 md:mt-16">
          <AllProjects projects={projects} />
        </div>
        <NextLink {...t.next} />
      </Container>
    </Section>
  );
}

/** The agency: who we are, the figures, real photos (placeholders for now), the hiring line. */
export function About() {
  const a = agency.about;
  const [first, ...rest] = a.paragraphs;
  return (
    <Section id="agence" trace="right" aria-labelledby="agence-title">
      <Container>
        <SectionHead id="agence-title" title={a.title} lead={first} />

        <div className="mt-12 grid gap-x-6 gap-y-12 md:mt-16 lg:grid-cols-12">
          <Reveal as="ul" className="grid grid-cols-2 gap-3 md:gap-6 lg:col-span-7">
            {a.photos.map((src, i) => (
              <RevealItem as="li" key={i} className={i === 0 ? "col-span-2" : undefined}>
                <ProjectImage
                  src={src}
                  alt={a.photoCaptions[i]}
                  ratio={i === 0 ? "16/10" : "4/5"}
                  sizes={i === 0 ? "(min-width: 1024px) 680px, 100vw" : "(min-width: 1024px) 330px, 50vw"}
                  index={String(i + 1).padStart(2, "0")}
                  category={a.photoCaptions[i]}
                />
              </RevealItem>
            ))}
          </Reveal>

          <div className="flex flex-col gap-12 lg:col-span-4 lg:col-start-9">
            <div className="flex flex-col gap-4">
              {rest.map((t) => (
                <p key={t} className="measure text-body">
                  {t}
                </p>
              ))}
            </div>

            {a.stats.length > 0 ? (
              <dl aria-label={home.agency.statsLabel} className="grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8">
                {a.stats.map((s) => (
                  <div key={s.label} className="flex flex-col gap-1">
                    <dt className="order-2 text-small text-ink-muted">{s.label}</dt>
                    <dd className="order-1 font-display text-h2 tabular">{s.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <div className="border-t border-line pt-8">
              <BulletList items={[a.hiring.text]} />
              <a
                href={a.hiring.href}
                target="_blank"
                rel="noreferrer"
                className="ml-6 mt-3 inline-flex min-h-12 items-center font-display text-body font-semibold underline decoration-2 underline-offset-8"
              >
                {a.hiring.linkLabel}
              </a>
            </div>
          </div>
        </div>
        <NextLink {...home.agency.next} />
      </Container>
    </Section>
  );
}

/** Testimonials: rendered only when real ones exist. */
export function Testimonials() {
  const list = agency.testimonials;
  if (list.length === 0) return null;
  return (
    <Section tone="sand" aria-labelledby="temoignages-title">
      <Container>
        <SectionHead id="temoignages-title" title={home.testimonials.title} />
        <ul className="mt-12 grid gap-12 md:mt-16 md:grid-cols-3 md:gap-6">
          {list.map((t) => (
            <li key={t.name}>
              <figure className="flex flex-col gap-6">
                <blockquote className="font-display text-list">« {t.quote} »</blockquote>
                <figcaption className="text-body text-ink-muted">
                  {t.name}, {t.role}, {t.company}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}

/** Final call to action: full teal, the knob pushing up into the section above. */
export function ContactCta() {
  const c = home.cta;
  const rows = [
    { label: c.phone, value: contact.phone.display, href: contact.phone.href },
    { label: c.email, value: contact.email.display, href: contact.email.href },
    { label: c.instagram, value: contact.instagram.display, href: contact.instagram.href, external: true },
  ];
  return (
    <Section id="contact" tone="teal" trace="left" aria-labelledby="contact-title" joint={{ edge: "top", at: "calc(100% - var(--page-edge) - 110px)" }}>
      <Container>
        <div className="grid gap-x-6 gap-y-10 lg:grid-cols-12 lg:items-end">
          <DisplayTitle as="h2" id="contact-title" size="h1" lines={c.title} className="lg:col-span-8" />
          <div className="flex flex-col items-start gap-6 lg:col-span-4">
            <p className="measure text-lead">{c.intro}</p>
            <Button href={contact.whatsapp.href} arrow data-primary-cta="" target="_blank" rel="noreferrer">
              {c.whatsapp}
            </Button>
          </div>
        </div>

        <dl className="mt-16 grid gap-10 border-t border-line pt-10 md:mt-24 md:grid-cols-2 lg:grid-cols-[1fr_1.4fr_1fr_1fr] lg:gap-6">
          {rows.map((r) => (
            <div key={r.label} className="flex flex-col gap-2">
              <dt>
                <MetaLabel>{r.label}</MetaLabel>
              </dt>
              <dd>
                <a
                  href={r.href}
                  {...(r.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  className="font-display text-list break-words underline decoration-2 underline-offset-8"
                >
                  {r.value}
                </a>
              </dd>
            </div>
          ))}
          <div className="flex flex-col gap-2">
            <dt>
              <MetaLabel>{c.address}</MetaLabel>
            </dt>
            <dd className="flex flex-col gap-2">
              <address className="font-display text-list not-italic">
                {contact.address.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
              <a href={contact.address.mapHref} target="_blank" rel="noreferrer" className="text-body underline decoration-2 underline-offset-8">
                {contact.address.mapLabel}
              </a>
            </dd>
          </div>
        </dl>
      </Container>
    </Section>
  );
}
