"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { categoryNumber } from "@/content/categories";
import type { Service } from "@/content/services";
import { ArrowIcon } from "../ui/icons";

const EASE = [0.23, 1, 0.32, 1] as const;
const pad = (n: number) => String(n).padStart(2, "0");

/** Small scissors, drawn: 1.5px stroke, as the rest of the icon set. */
function Scissors() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true" focusable="false">
      <circle cx="4" cy="5" r="2.5" />
      <circle cx="4" cy="13" r="2.5" />
      <path d="M6.2 6.3 16 13M6.2 11.7 16 5" strokeLinecap="square" />
    </svg>
  );
}

/**
 * Services as the studio's own kind of object: a printed tear-off flyer, pinned with tape.
 * On entering, the sheet drops onto the page and the tabs fall into line. Pointing at a tab
 * pulls it down a few pixels and prints its description under the flyer; it links to the
 * type's folder.
 */
export function ServicesFlyer({ services, title, sub, action }: { services: Service[]; title: string; sub: string; action: string }) {
  const [active, setActive] = useState(0);
  const s = services[active];
  return (
    <motion.div
      className="relative mx-auto w-full max-w-[920px] lg:mx-0 lg:ml-auto"
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.35 }}
    >
      <motion.div
        className="relative"
        variants={{
          hidden: { y: -90, x: 24, rotate: -7, opacity: 0 },
          // Falls and lands (0–0.75s), then is pressed down a hair as the tape is stuck on.
          shown: {
            y: [-90, 0, 0, 3, 0],
            x: [24, 0, 0, 0, 0],
            rotate: [-7, -1.4, -1.4, -1, -1],
            opacity: [0, 1, 1, 1, 1],
            transition: { duration: 1.3, times: [0, 0.55, 0.62, 0.72, 1], ease: EASE },
          },
        }}
      >
        {/* Two strips of tape slap onto the top corners once the sheet has landed. */}
        {[
          { cls: "-left-5 -top-3 -rotate-[32deg]", delay: 0.8 },
          { cls: "-right-5 -top-3 rotate-[28deg]", delay: 0.92 },
        ].map((t) => (
          <motion.span
            key={t.cls}
            aria-hidden="true"
            className={`absolute z-10 h-7 w-28 bg-cream-deep/45 ${t.cls}`}
            variants={{
              hidden: { opacity: 0, scale: 1.6 },
              shown: { opacity: 1, scale: 1, transition: { duration: 0.22, ease: EASE, delay: t.delay } },
            }}
          />
        ))}
        <div className="tone-cream relative shadow-[0_24px_48px_-24px_var(--color-teal-deep)]">
          <div className="px-6 pb-8 pt-12 md:px-12 md:pt-16">
            <p className="font-display text-h1">{title}</p>
            <p className="mt-4 font-sans text-meta uppercase tracking-[0.3em] text-ink-muted">{sub}</p>
          </div>

          <div className="flex items-center gap-2 px-3 text-ochre">
            <Scissors />
            <span aria-hidden="true" className="h-0 flex-1 border-t-2 border-dashed border-ochre" />
          </div>

          <motion.ul
            className="grid"
            style={{ gridTemplateColumns: `repeat(${services.length}, minmax(0, 1fr))` }}
            variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.05, delayChildren: 1.05 } } }}
            onMouseLeave={() => setActive(0)}
          >
            {services.map((x, i) => (
              <motion.li
                key={x.name}
                className="border-l-2 border-dashed border-rule first:border-l-0"
                variants={{ hidden: { y: -16, opacity: 0 }, shown: { y: 0, opacity: 1, transition: { duration: 0.5, ease: EASE } } }}
              >
                <a
                  href={`#dossier-${x.category}`}
                  aria-label={`${x.name}. ${x.line} ${action}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group flex h-[300px] flex-col items-center justify-between bg-cream px-1 pb-4 pt-4 no-underline transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-quint)] hover:translate-y-2 hover:rotate-[0.6deg] focus-visible:translate-y-2 md:h-[340px]"
                >
                  <span className="font-sans text-meta text-ink-muted tabular">{pad(categoryNumber(x.category))}</span>
                  <span className="rotate-180 font-display text-small font-semibold decoration-ochre decoration-2 underline-offset-4 [writing-mode:vertical-rl] group-hover:underline md:text-body">
                    {x.name}
                  </span>
                  <span aria-hidden="true" className="size-2 rounded-full bg-ochre transition-transform duration-[var(--dur-ui)] group-hover:scale-150" />
                </a>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.div>

      {/* The pulled tab, in words */}
      <motion.p
        aria-live="polite"
        className="mt-10 flex flex-wrap items-baseline gap-x-4 gap-y-1 pl-1"
        variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { delay: 1.4, duration: 0.4 } } }}
      >
        <span className="font-sans text-meta text-ink-muted tabular">{pad(categoryNumber(s.category))}</span>
        <span className="font-display text-list">{s.name}</span>
        <span className="text-body text-ink-muted">{s.line}</span>
        <a href={`#dossier-${s.category}`} className="inline-flex items-center gap-2 font-display text-small font-semibold underline decoration-2 underline-offset-8">
          {action}
          <ArrowIcon size={14} />
        </a>
      </motion.p>
    </motion.div>
  );
}
