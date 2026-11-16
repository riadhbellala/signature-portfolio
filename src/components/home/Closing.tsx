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
 * Services: a bento of illustrated tiles (one per métier, the lead one big), then an ochre strip:
 * the way out for anything not listed.
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
      className="scroll-mt-16 !pb-[276px]"
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
        {/* Bento: stands lead (big tile), sites web wide, the rest square; the façade wide.
            Each tile: number, name, one line, its illustration; the whole tile opens the folder. */}
        <ul className="mt-[var(--space-head)] grid grid-cols-2 gap-[var(--space-grid)] lg:grid-cols-4 lg:grid-rows-[260px_260px_240px_auto]">
          {BENTO.map((b) => {
            const s = services.find((x) => x.category === b.id)!;
            return (
              <li key={s.name} className={b.cls}>
                <Link
                  href={`/projets#dossier-${s.category}`}
                  className={`group relative flex h-full flex-col justify-end overflow-hidden rounded-[var(--radius-lg)] ${b.tone} p-4 text-cream no-underline transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-quint)] hover:-translate-y-1 active:scale-[0.98] sm:p-6 ${b.big ? "min-h-[340px]" : "min-h-[220px]"}`}
                >
                  {/* The banner, full bleed (leans in on hover); without one, the plain tile. */}
                  {s.image ? (
                    <>
                      <Image
                        src={s.image}
                        alt=""
                        fill
                        sizes={
                          b.big || b.wide
                            ? "(min-width: 1024px) 50vw, 100vw"
                            : "(min-width: 1024px) 25vw, 50vw"
                        }
                        className="object-cover transition-transform duration-[900ms] ease-[var(--ease-out-quint)] group-hover:scale-[1.06]"
                      />
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 bg-linear-to-t from-teal-deep/90 via-teal-deep/25 to-transparent"
                      />
                    </>
                  ) : null}
                  <span className="relative flex items-end justify-between gap-3">
                    <span className="flex min-w-0 flex-col gap-1">
                      <span
                        className={
                          b.big
                            ? "font-display text-h3 leading-tight"
                            : "font-display text-piece leading-tight"
                        }
                      >
                        {s.name}
                      </span>
                      <span
                        className={`text-small text-cream/80 ${b.big || b.wide ? "max-w-[34ch]" : "hidden"}`}
                      >
                        {s.line}
                      </span>
                      {/* The services inside this pôle. */}
                      <span className="mt-2 flex flex-wrap gap-1.5 max-sm:hidden">
                        {s.items.map((it) => (
                          <span
                            key={it}
                            className="rounded-full px-2.5 py-1 text-meta text-cream/90 shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-cream)_30%,transparent)]"
                          >
                            {it}
                          </span>
                        ))}
                      </span>
                    </span>
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ochre text-teal transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-quint)] group-hover:rotate-45 sm:size-11">
                      <ArrowUpRightIcon size={14} />
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
          <li className="col-span-2 lg:col-span-4 lg:row-span-1 lg:h-auto">
            <a
              href="#contact"
              className="group flex h-full flex-col justify-between gap-4 rounded-[var(--radius-lg)] bg-ochre p-5 text-teal no-underline transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-quint)] hover:-translate-y-1 active:scale-[0.98] sm:flex-row sm:items-center sm:p-6"
            >
              <span className="font-display text-h3 leading-tight">
                {t.customTitle}
              </span>
              <span className="btn btn-primary !bg-teal !text-cream self-start sm:self-auto">
                <span className="btn-label">{t.customAction}</span>
                <ArrowIcon />
              </span>
            </a>
          </li>
        </ul>
      </Container>
    </Section>
  );
}

/** Bento order and shapes (mobile 2 columns, desktop 4). `img`: where the illustration sits. */
const BENTO: {
  id: string;
  cls: string;
  big?: boolean;
  wide?: boolean;
  tone: string;
}[] = [
  { id: "stands", big: true, cls: "col-span-2 lg:row-span-2", tone: "bg-teal" },
  { id: "site-web", wide: true, cls: "col-span-2", tone: "bg-teal-deep" },
  { id: "reseaux-sociaux", cls: "", tone: "bg-teal-muted" },
  { id: "identite", cls: "", tone: "bg-teal-deep" },
  { id: "facade", wide: true, cls: "col-span-2", tone: "bg-teal-deep" },
  { id: "supports", wide: true, cls: "col-span-2", tone: "bg-teal" },
];

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
    // First thing inside the projects section, pulled up a fixed distance into Services: the top
    // part sits on sand, the rest on cream, and the projects follow below it whatever its height
    // (the card grows with the screen, so nothing may depend on its height).
    <div className="relative z-[3] -mb-[140px] -mt-[220px]">
      {/* The cream page coming up under the card: its rounded top meets the sand of Services. */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 top-[180px] rounded-t-[var(--radius-xl)] bg-cream" />
      <Container>
        <div className="tone-teal relative rounded-[var(--radius-lg)] bg-teal p-6 text-cream md:p-8">
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
