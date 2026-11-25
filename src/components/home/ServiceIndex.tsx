import Image from "next/image";
import Link from "next/link";
import { services } from "@/content/services";
import { home } from "@/content/site";
import { InView } from "../motion/InView";
import { ArrowIcon, ArrowUpRightIcon } from "../ui/icons";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Services as a ruled table: a grid drawn with hairlines only (3 × 2 on desktop, 2 columns on
 * tablets, one column on phones). Each cell: number and arrow on top, name, one line and what
 * is inside at the bottom. On hover (pointer devices) the service's picture rises into the
 * cell from the bottom (clip-path) and the text turns cream over it. The whole cell opens the
 * folder.
 */
export function ServiceIndex() {
  const t = home.services;
  return (
    <div>
      <ul className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s, i) => (
          <InView as="li" key={s.name} delay={(i % 3) * 80} className="border-b border-r border-line">
            <Link
              href={`/projets#dossier-${s.category}`}
              className="group relative flex h-full min-h-[260px] flex-col justify-between gap-10 overflow-hidden p-6 no-underline md:min-h-[320px] md:p-8"
            >
              {s.image ? (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 [clip-path:inset(100%_0_0_0)] transition-[clip-path] duration-[600ms] ease-[var(--ease-in-out-quart)] group-hover:[clip-path:inset(0_0_0_0)] group-focus-visible:[clip-path:inset(0_0_0_0)]"
                >
                  <Image src={s.image} alt="" fill sizes="(min-width: 1024px) 33vw, 50vw" className="object-cover" />
                  <span className="absolute inset-0 bg-linear-to-t from-teal-deep/90 via-teal-deep/50 to-teal-deep/20" />
                </span>
              ) : null}

              <span className="relative flex items-start justify-between transition-colors duration-[var(--dur-ui)] ease-out group-hover:text-cream group-focus-visible:text-cream">
                <span className="tabular text-meta">{pad(i + 1)}</span>
                <ArrowUpRightIcon
                  size={16}
                  className="transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-quint)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>

              <span className="relative flex flex-col gap-3">
                <span className="font-display text-h3 transition-colors duration-[var(--dur-ui)] ease-out group-hover:text-cream group-focus-visible:text-cream">
                  {s.name}
                </span>
                <span className="max-w-[36ch] text-body text-ink-muted transition-colors duration-[var(--dur-ui)] ease-out group-hover:text-cream/85 group-focus-visible:text-cream/85">
                  {s.line}
                </span>
                <span className="text-small text-ink-muted/80 transition-colors duration-[var(--dur-ui)] ease-out group-hover:text-cream/70 group-focus-visible:text-cream/70">
                  {s.items.join(" · ")}
                </span>
              </span>
            </Link>
          </InView>
        ))}
      </ul>
      {/* Anything not listed: one quiet line under the table. */}
      <a href="#contact" className="group mt-8 flex items-center justify-between gap-4 no-underline">
        <span className="text-body text-ink-muted">{t.customTitle}</span>
        <span className="flex shrink-0 items-center gap-2 font-display text-body font-semibold underline decoration-ochre decoration-2 underline-offset-[6px]">
          {t.customAction}
          <ArrowIcon />
        </span>
      </a>
    </div>
  );
}
