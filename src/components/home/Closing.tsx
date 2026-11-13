import Image from "next/image";
import Link from "next/link";
import { clients } from "@/content/clients";
import { contact } from "@/content/contact";
import { services } from "@/content/services";
import { home } from "@/content/site";
import { Container, Section, SectionHead } from "../layout/Section";
import { Assemble, AssembleLast, AssemblePiece } from "../motion/Assemble";
import { RiseText } from "../motion/RiseText";
import { gridEdges, type Edge } from "../puzzle/geometry";
import { PuzzlePiece, PuzzleStrip } from "../puzzle/PuzzlePiece";
import { DisplayTitle } from "../type/DisplayTitle";
import { MetaLabel } from "../type/Labels";
import { ArrowIcon, ArrowUpRightIcon } from "../ui/icons";
import { AgencyVideos } from "../work/AgencyVideos";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Services (the reference's third block): a grid of cards. Each card: a round number, the
 * service, one line, and the whole card opens that service's projects. One dark card holds the
 * agency's own videos (shown, not described); the last card, ochre, is the way out: ask.
 */
export function Services() {
  const t = home.services;
  return (
    <Section
      id="services"
      tone="sand"
      sheet
      spacing="compact"
      aria-labelledby="services-title"
      className="scroll-mt-16 !pb-[300px] sm:!pb-[260px] lg:!pb-[300px]"
    >
      <Container>
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <RiseText
            id="services-title"
            text={t.title}
            className="text-h2 max-md:text-center lg:col-span-7"
          />
          <p className="measure text-lead max-md:mx-auto max-md:text-center lg:col-span-4 lg:col-start-9">
            {t.lead}
          </p>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-2.5 sm:gap-3 lg:mt-14 lg:grid-cols-4">
          {services.map((s, i) => (
            <li key={s.name} className={i === 0 ? "lg:col-start-1" : undefined}>
              <Link
                href={`/projets#dossier-${s.category}`}
                className="group flex h-full min-h-[150px] flex-col justify-between gap-4 rounded-[var(--radius-lg)] bg-cream p-4 sm:min-h-[200px] sm:gap-8 sm:p-6 no-underline transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-quint)] hover:-translate-y-1 active:scale-[0.98]"
              >
                <span className="flex shrink-0 items-start justify-between">
                  <span className="flex size-9 items-center justify-center rounded-full bg-sand font-sans text-meta tabular sm:size-11 sm:text-small">
                    {pad(i + 1)}
                  </span>
                  <span className="flex size-9 items-center justify-center rounded-full bg-teal text-cream opacity-0 sm:size-11 transition-opacity duration-[var(--dur-ui)] group-hover:opacity-100 max-lg:opacity-100">
                    <ArrowUpRightIcon size={14} />
                  </span>
                </span>
                <span className="flex flex-col gap-1.5">
                  <span className="font-display text-piece leading-tight">
                    {s.name}
                  </span>
                  <span className="text-small text-ink-muted max-sm:hidden">{s.line}</span>
                </span>
              </Link>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="group flex h-full flex-col justify-between gap-4 rounded-[var(--radius-lg)] bg-ochre p-4 min-h-[150px] sm:min-h-[200px] sm:gap-8 sm:p-6 text-teal no-underline transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-quint)] hover:-translate-y-1 active:scale-[0.98]"
            >
              <span className="font-display text-piece leading-tight">
                {t.customTitle}
              </span>
              <span className="inline-flex items-center gap-2 font-display font-semibold">
                {t.customAction}
                <ArrowIcon className="transition-transform duration-[var(--dur-ui)] group-hover:translate-x-1" />
              </span>
            </a>
          </li>
        </ul>
      </Container>
    </Section>
  );
}

const CLIENT_LAYOUTS = [
  // Banner height = cols / 4.44, the ratio of the Signature banner image.
  { cols: 3, className: "md:hidden", banner: 3 / 4.44 },
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
    <Section
      id="clients"
      tone="sand"
      spacing="compact"
      aria-labelledby="clients-title"
      // Transparent: the sand comes from the sheet that wraps Clients and Contact (page.tsx), so
      // the clients wall can hang over the top of Contact, half on sand, half on teal.
      className="relative z-[2] scroll-mt-16 !bg-transparent !pb-0 !pt-[200px] md:!pt-[240px]"
    >
      <Container>
        <SectionHead id="clients-title" title={t.title} lead={t.lead} />
        {CLIENT_LAYOUTS.map(({ cols, className, banner }) => {
          const rows = Math.ceil(clients.length / cols);
          const last = {
            row: rows - 1,
            cols: clients.length - (rows - 1) * cols,
          };
          // Lay the grid out as if one more full row followed, so the bottom row has knobs and
          // sockets for the banner to lock into.
          // Joint with the banner: every banner knob points up into the logos (the pieces above have
          // sockets), so no logo knob ever cuts into the banner's text.
          const edgesAt = (i: number) => {
            const e = gridEdges(
              Math.floor(i / cols),
              i % cols,
              rows + 1,
              cols,
              last.cols === cols ? undefined : last,
            );
            // Last row: sockets for the banner's knobs. A piece over an empty slot: flat bottom.
            if (Math.floor(i / cols) === rows - 1)
              return { ...e, bottom: "blank" as Edge };
            return i + cols >= clients.length
              ? { ...e, bottom: "flat" as Edge }
              : e;
          };
          const bannerTop: Edge[] = Array(cols).fill("tab");
          return (
            <Assemble key={cols} as="div" className={className}>
              <ul
                className="mt-10 grid bg-teal-deep/15 shadow-[inset_0_10px_24px_color-mix(in_oklab,var(--color-teal-deep)_30%,transparent)] md:mt-14"
                style={{
                  gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                }}
              >
                {clients.map((c, i) => (
                  <AssemblePiece key={i} i={i} className="relative hover:z-10">
                    {/* Lifted on hover: the recess under the wall shows, like a piece picked up. */}
                    <div className="transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-quint)] hover:-translate-y-2 hover:-rotate-1">
                      {c.logo ? (
                        <PuzzlePiece
                          fluid
                          tone="sand"
                          edges={edgesAt(i)}
                          image={{ src: c.logo }}
                          label={c.name}
                        />
                      ) : (
                        <PuzzlePiece
                          fluid
                          tone="sand"
                          edges={edgesAt(i)}
                          label={`${c.name}, ${t.logoPending}`}
                        >
                          <span className="font-sans text-meta text-teal-muted tabular">
                            ({pad(i + 1)})
                          </span>
                          <span className="flex min-w-0 flex-col gap-0.5">
                            <span className="line-clamp-2 font-display text-piece">
                              {c.name}
                            </span>
                            <span className="truncate font-sans text-meta uppercase text-teal-muted">
                              {t.logoPending}
                            </span>
                          </span>
                        </PuzzlePiece>
                      )}
                    </div>
                  </AssemblePiece>
                ))}
              </ul>
              <AssembleLast delay={0.07 * clients.length + 0.3}>
                <a
                  href={contact.website.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={t.banner.label}
                  className="group block no-underline outline-offset-[-12px]"
                >
                  <PuzzleStrip
                    top={bannerTop}
                    bottom={Array(cols).fill("flat")}
                    height={banner}
                    tone="cream"
                  >
                    {/* The agency's own banner, its background recoloured to the cream of the piece. */}
                    <Image
                      src={t.banner.image}
                      alt=""
                      fill
                      sizes="(min-width: 1680px) 1520px, 92vw"
                      className="object-cover"
                    />
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
 * Contact: full teal. One clear action first (WhatsApp, the fastest answer), then the other ways
 * to reach the studio as a plain list: label left, value right, the whole row is the link.
 */
export function Contact() {
  const t = home.contact;
  const rows: {
    label: string;
    value: string;
    href: string;
    external?: boolean;
  }[] = [
    { label: t.phone, value: contact.phone.display, href: contact.phone.href },
    { label: t.email, value: contact.email.display, href: contact.email.href },
    {
      label: t.instagram,
      value: contact.instagram.display,
      href: contact.instagram.href,
      external: true,
    },
  ];
  return (
    <Section
      id="contact"
      tone="teal"
      sheet
      aria-labelledby="contact-title"
      // Starts under the clients banner: the banner sits across the seam.
      className="scroll-mt-16 !-mt-[110px] !pt-[190px] md:!-mt-[150px] md:!pt-[250px]"
    >
      <Container>
        <div className="grid gap-x-6 gap-y-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <DisplayTitle
              as="h2"
              id="contact-title"
              size="h1"
              lines={t.title}
              className="max-md:text-center"
            />
            <p className="measure mt-6 text-lead text-ink-muted max-md:mx-auto max-md:text-center">
              {t.lead}
            </p>
          </div>
          <div className="flex flex-col gap-3 lg:col-span-5">
            <a
              href={contact.whatsapp.href}
              target="_blank"
              rel="noreferrer"
              data-primary-cta=""
              className="group flex min-h-20 items-center justify-between gap-4 rounded-[var(--radius-lg)] bg-ochre px-6 py-5 font-display text-h3 text-teal no-underline transition-transform duration-[var(--dur-press)] active:scale-[0.98]"
            >
              <span className="flex flex-col">
                <span className="font-sans text-small font-normal">
                  {t.whatsappSub}
                </span>
                {t.whatsapp}
              </span>
              <ArrowUpRightIcon
                size={20}
                className="transition-transform duration-[var(--dur-ui)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
            <ul className="flex flex-col">
              {rows.map((r) => (
                <li key={r.label} className="border-b border-line">
                  <a
                    href={r.href}
                    {...(r.external
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                    className="group flex min-h-14 items-center justify-between gap-4 py-3 no-underline"
                  >
                    <span className="text-small text-ink-muted">{r.label}</span>
                    <span className="flex min-w-0 items-center gap-2 font-display text-body font-semibold">
                      <span className="truncate decoration-ochre decoration-2 underline-offset-4 group-hover:underline">
                        {r.value}
                      </span>
                      {r.external ? (
                        <ArrowUpRightIcon size={12} />
                      ) : (
                        <ArrowIcon size={14} />
                      )}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

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
              <MetaLabel>{t.mapLabel}</MetaLabel>
            </dt>
            <dd>
              <a
                href={contact.address.mapHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-body underline decoration-2 underline-offset-8"
              >
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
              <a
                href={contact.website.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-body underline decoration-2 underline-offset-8"
              >
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

/** Zahra's videos: one teal card set across the seam, half on Services, half on the projects. */
export function AgencyBridge() {
  const t = home.services;
  return (
    // Zero-height layer on the seam; the card is centred on it (half up, half down).
    <div className="relative z-[3] h-0">
      <Container className="-translate-y-[55%]">
        <div className="tone-teal rounded-[var(--radius-lg)] bg-teal p-6 text-cream md:-mb-40 md:p-8">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
            <p className="font-display text-h3 leading-tight lg:col-span-4">
              {t.videosLabel}
            </p>
            <div className="lg:col-span-7 lg:col-start-6">
              <AgencyVideos label="" />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
