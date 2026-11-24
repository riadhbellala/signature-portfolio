"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { services } from "@/content/services";
import { home } from "@/content/site";
import { InView } from "../motion/InView";
import { ArrowIcon, ArrowUpRightIcon } from "../ui/icons";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Services as an editorial index: one row per pôle (number, name, line, what is inside), each row
 * opens its folder. Desktop: the picture of the row under the pointer (or focus) shows in a
 * sticky frame on the left. Phones: a small picture in each row instead.
 */
export function ServiceIndex() {
  const t = home.services;
  const [active, setActive] = useState(0);
  return (
    <div className="grid gap-[var(--space-head)] lg:grid-cols-12 lg:gap-x-[var(--space-grid)]">
      <div className="max-lg:hidden lg:col-span-4">
        <InView kind="mask" className="sticky top-28 aspect-[4/5] overflow-hidden rounded-[var(--radius-sm)] bg-teal-deep">
          {services.map((s, i) =>
            s.image ? (
              <Image
                key={s.name}
                src={s.image}
                alt=""
                fill
                sizes="33vw"
                className={clsx(
                  // Crossfade, and the picture coming in settles from a slight zoom (image pan).
                  "object-cover transition-[opacity,scale] duration-700 ease-[var(--ease-out-quint)]",
                  i === active ? "scale-100 opacity-100" : "scale-[1.06] opacity-0",
                )}
              />
            ) : null,
          )}
        </InView>
      </div>

      <div className="lg:col-span-7 lg:col-start-6">
        <ol className="border-b border-line">
          {services.map((s, i) => (
            <InView as="li" key={s.name} delay={i * 70} className="border-t border-line">
              <Link
                href={`/projets#dossier-${s.category}`}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group grid grid-cols-[auto_1fr_auto] items-start gap-x-5 py-7 no-underline md:gap-x-8 md:py-9"
              >
                <span className="relative size-16 overflow-hidden rounded-[var(--radius-xs)] bg-teal-deep lg:hidden">
                  {s.image ? <Image src={s.image} alt="" fill sizes="64px" className="object-cover" /> : null}
                </span>
                <span className="tabular pt-2 text-meta text-ink-muted max-lg:hidden">{pad(i + 1)}</span>
                <span className="flex min-w-0 flex-col gap-2">
                  <span
                    className={clsx(
                      "font-display text-h3 transition-colors duration-[var(--dur-ui)] ease-out lg:text-[clamp(1.75rem,1.2rem+1.2vw,2.5rem)] lg:leading-[1.05]",
                      i === active ? "lg:text-ink" : "lg:text-ink-muted/60",
                    )}
                  >
                    {s.name}
                  </span>
                  <span className="max-w-[46ch] text-body text-ink-muted">{s.line}</span>
                  <span className="text-small text-ink-muted/80 max-md:hidden">{s.items.join(" · ")}</span>
                </span>
                <span className="pt-2 text-ink transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-quint)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
                  <ArrowUpRightIcon size={16} />
                </span>
              </Link>
            </InView>
          ))}
        </ol>
        {/* Anything not listed: one quiet line, same rhythm as the rows. */}
        <a href="#contact" className="group mt-8 flex items-center justify-between gap-4 no-underline">
          <span className="text-body text-ink-muted">{t.customTitle}</span>
          <span className="flex shrink-0 items-center gap-2 font-display text-body font-semibold underline decoration-ochre decoration-2 underline-offset-[6px]">
            {t.customAction}
            <ArrowIcon />
          </span>
        </a>
      </div>
    </div>
  );
}
