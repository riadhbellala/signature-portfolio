import Image from "next/image";
import { clients } from "@/content/clients";
import { contact } from "@/content/contact";
import { services } from "@/content/services";
import { home } from "@/content/site";
import { Container, Section, SectionHead } from "../layout/Section";
import { Assemble, AssembleLast, AssemblePiece } from "../motion/Assemble";
import { RiseText } from "../motion/RiseText";
import { gridEdges, type Edge } from "../puzzle/geometry";
import { PuzzlePiece, PuzzleStrip, type PieceTone } from "../puzzle/PuzzlePiece";
import { DisplayTitle } from "../type/DisplayTitle";
import { MetaLabel } from "../type/Labels";
import { ArrowIcon, ArrowUpRightIcon } from "../ui/icons";
import { ServicesFlyer } from "./ServicesFlyer";
import { AgencyVideos } from "../work/AgencyVideos";

const pad = (n: number) => String(n).padStart(2, "0");

/** Services as a tear-off flyer: after the work, "can they do this for me?". */
export function Services() {
  const t = home.services;
  return (
    <Section id="services" tone="sand" spacing="compact" aria-labelledby="services-title" className="scroll-mt-16">
      <Container className="grid gap-x-6 gap-y-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <RiseText id="services-title" text={t.title} className="text-h2" />
          <p className="measure mt-6 text-lead">{t.lead}</p>
          <div className="mt-10 max-w-[520px]">
            <AgencyVideos label={t.videosLabel} />
          </div>
        </div>
        <div className="lg:col-span-7 lg:col-start-6 lg:self-start">
          <ServicesFlyer services={services} title={t.flyerTitle} sub={t.flyerSub} action={t.action} />
        </div>
      </Container>
    </Section>
  );
}

const CLIENT_LAYOUTS = [
  // Banner height = cols / 4.44, the ratio of the Signature banner image.
  { cols: 2, className: "md:hidden", banner: 2 / 4.44 },
  { cols: 5, className: "hidden md:block", banner: 5 / 4.44 },
];

/**
 * Clients: one piece per client logo, flying in and locking together as the section enters,
 * then the long Signature banner piece rises and locks under the whole group (links to the site).
 * Hidden while clients.ts is empty.
 */
export function Clients() {
  if (clients.length === 0) return null;
  const t = home.clients;
  return (
    <Section id="clients" spacing="compact" aria-labelledby="clients-title" className="scroll-mt-16">
      <Container>
        <SectionHead id="clients-title" title={t.title} lead={t.lead} />
        {CLIENT_LAYOUTS.map(({ cols, className, banner }) => {
          const rows = Math.ceil(clients.length / cols);
          const last = { row: rows - 1, cols: clients.length - (rows - 1) * cols };
          // Lay the grid out as if one more full row followed, so the bottom row has knobs and
          // sockets for the banner to lock into.
          // Joint with the banner: every banner knob points up into the logos (the pieces above have
          // sockets), so no logo knob ever cuts into the banner's text.
          const edgesAt = (i: number) => {
            const e = gridEdges(Math.floor(i / cols), i % cols, rows + 1, cols, last.cols === cols ? undefined : last);
            // Last row: sockets for the banner's knobs. A piece over an empty slot: flat bottom.
            if (Math.floor(i / cols) === rows - 1) return { ...e, bottom: "blank" as Edge };
            return i + cols >= clients.length ? { ...e, bottom: "flat" as Edge } : e;
          };
          const bannerTop: Edge[] = Array(cols).fill("tab");
          return (
            <Assemble key={cols} as="div" className={className}>
              <ul className="mt-10 grid md:mt-14" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
                {clients.map((c, i) => (
                  <AssemblePiece key={i} i={i}>
                    {c.logo ? (
                      <PuzzlePiece fluid tone="sand" edges={edgesAt(i)} image={{ src: c.logo }} label={c.name} />
                    ) : (
                      <PuzzlePiece fluid tone="sand" edges={edgesAt(i)} label={`${c.name}, ${t.logoPending}`}>
                        <span className="font-sans text-meta text-teal-muted tabular">({pad(i + 1)})</span>
                        <span className="flex min-w-0 flex-col gap-0.5">
                          <span className="line-clamp-2 font-display text-piece">{c.name}</span>
                          <span className="truncate font-sans text-meta uppercase text-teal-muted">{t.logoPending}</span>
                        </span>
                      </PuzzlePiece>
                    )}
                  </AssemblePiece>
                ))}
              </ul>
              <AssembleLast delay={0.07 * clients.length + 0.3}>
                <a href={contact.website.href} target="_blank" rel="noreferrer" aria-label={t.banner.label} className="group block no-underline outline-offset-[-12px]">
                  <PuzzleStrip top={bannerTop} bottom={Array(cols).fill("flat")} height={banner} tone="cream">
                    {/* The agency's own banner, its background recoloured to the cream of the piece. */}
                    <Image src={t.banner.image} alt="" fill sizes="(min-width: 1680px) 1520px, 92vw" className="object-cover" />
                  </PuzzleStrip>
                </a>
              </AssembleLast>
            </Assemble>
          );
        })}
      </Container>
    </Section>
  );
}

/**
 * Contact: full teal. The ways to reach the studio are four interlocking pieces that assemble as
 * the section enters; WhatsApp is the ochre one, the primary action.
 */
export function Contact() {
  const t = home.contact;
  const pieces: { label: string; value: string; sub?: string; href: string; tone: PieceTone; external?: boolean; primary?: boolean }[] = [
    { label: t.whatsapp, value: contact.phone.display, sub: t.whatsappSub, href: contact.whatsapp.href, tone: "ochre", external: true, primary: true },
    { label: t.phone, value: contact.phone.display, href: contact.phone.href, tone: "cream" },
    { label: t.email, value: contact.email.display, href: contact.email.href, tone: "cream" },
    { label: t.instagram, value: contact.instagram.display, href: contact.instagram.href, tone: "cream", external: true },
  ];
  const layouts = [
    { cols: 2, className: "grid grid-cols-2 lg:hidden" },
    { cols: 4, className: "hidden lg:grid lg:grid-cols-4" },
  ];
  return (
    <Section id="contact" tone="teal" trace="right" aria-labelledby="contact-title" className="scroll-mt-16">
      <Container>
        <div className="grid gap-x-6 gap-y-6 lg:grid-cols-12 lg:items-end">
          <DisplayTitle as="h2" id="contact-title" size="h1" lines={t.title} className="lg:col-span-8" />
          <p className="measure text-lead lg:col-span-4">{t.lead}</p>
        </div>

        {layouts.map(({ cols, className }) => (
          <Assemble key={cols} className={`${className} mt-12 md:mt-16`} label={t.piecesLabel}>
            {pieces.map((p, i) => (
              <AssemblePiece key={p.label} i={i} className="relative hover:z-10">
                <a
                  href={p.href}
                  {...(p.external ? { target: "_blank", rel: "noreferrer" } : {})}
                  {...(p.primary ? { "data-primary-cta": "" } : {})}
                  className="group block no-underline outline-offset-[-10px] transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-quint)] hover:-translate-y-1.5"
                >
                  <PuzzlePiece fluid tone={p.tone} edges={gridEdges(Math.floor(i / cols), i % cols, Math.ceil(pieces.length / cols), cols)}>
                    <span className="font-sans text-meta uppercase text-ink-muted">{p.sub ?? p.label}</span>
                    <span className="flex min-w-0 flex-col gap-1">
                      {p.sub ? <span className="font-display text-body font-semibold md:text-piece">{p.label}</span> : null}
                      <span className={p.sub ? "text-small max-md:hidden" : "font-display text-body font-semibold md:text-piece"}>
                        {p.value.includes("@") && !p.value.startsWith("@") ? (
                          <>
                            {p.value.split("@")[0]}@<wbr />
                            {p.value.split("@")[1]}
                          </>
                        ) : (
                          p.value
                        )}
                      </span>
                      <span aria-hidden="true" className="mt-1 inline-flex items-center gap-2 transition-transform duration-[var(--dur-ui)] group-hover:translate-x-1">
                        {p.external ? <ArrowUpRightIcon size={14} /> : <ArrowIcon size={14} />}
                      </span>
                    </span>
                  </PuzzlePiece>
                </a>
              </AssemblePiece>
            ))}
          </Assemble>
        ))}

        <dl className="mt-14 grid gap-8 border-t border-line pt-8 md:grid-cols-3 md:gap-6">
          <div className="flex flex-col gap-2">
            <dt>
              <MetaLabel>{t.address}</MetaLabel>
            </dt>
            <dd>
              <address className="text-body not-italic">
                {contact.address.lines.map((l) => (
                  <span key={l} className="block">
                    {l}
                  </span>
                ))}
              </address>
            </dd>
          </div>
          <div className="flex flex-col gap-2">
            <dt>
              <MetaLabel>{t.map}</MetaLabel>
            </dt>
            <dd>
              <a href={contact.address.mapHref} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-body underline decoration-2 underline-offset-8">
                {t.map}
                <ArrowUpRightIcon size={12} />
              </a>
            </dd>
          </div>
          <div className="flex flex-col gap-2">
            <dt>
              <MetaLabel>{t.website}</MetaLabel>
            </dt>
            <dd>
              <a href={contact.website.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-body underline decoration-2 underline-offset-8">
                {contact.website.display}
                <ArrowUpRightIcon size={12} />
              </a>
            </dd>
          </div>
        </dl>
      </Container>
    </Section>
  );
}
