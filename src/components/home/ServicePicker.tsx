"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import type { Pole, Service } from "@/content/services";
import type { Edges } from "../puzzle/geometry";
import { PuzzlePiece } from "../puzzle/PuzzlePiece";
import { ArrowIcon } from "../ui/icons";

/**
 * The piece changes shape with the pole, so picking a service feels like picking a piece.
 * Tabs only, no sockets: the piece carries a full sentence and nothing may cut into it.
 */
const SHAPES: Edges[] = [
  { top: "flat", right: "tab", bottom: "flat", left: "flat" },
  { top: "flat", right: "tab", bottom: "tab", left: "flat" },
  { top: "flat", right: "flat", bottom: "tab", left: "flat" },
  { top: "flat", right: "tab", bottom: "tab", left: "flat" },
];

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Services as a list you pick from. Wide screens: the list on the right, and on the left one
 * large ochre piece that takes the selected service (hover, focus or click). Small screens:
 * the same list as an accordion, the sentence opening under the name.
 */
export function ServicePicker({ poles, services, action, listLabel }: { poles: Pole[]; services: Service[]; action: string; listLabel: string }) {
  const [active, setActive] = useState(0);
  const current = services[active];
  const poleIndex = poles.findIndex((p) => p.id === current.pole);

  return (
    <div className="grid gap-x-6 gap-y-12 lg:grid-cols-12">
      {/* The selected piece (wide screens only) */}
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-28 w-[min(100%,420px)] pb-[34%]">
          <PuzzlePiece fluid tone="ochre" edges={SHAPES[poleIndex % SHAPES.length]}>
            <span className="font-sans text-meta text-ink-muted tabular">({pad(active + 1)})</span>
            <span className="flex flex-col gap-3" aria-live="polite">
              <span className="font-display text-h3">{current.name}</span>
              <span className="font-sans text-body">{current.line}</span>
              <Link
                href={`#filtre-${current.pole}`}
                className="mt-1 inline-flex min-h-11 items-center gap-2 self-start font-display text-body font-semibold underline decoration-teal decoration-2 underline-offset-8 hover:decoration-4"
              >
                {action}
                <ArrowIcon />
              </Link>
            </span>
          </PuzzlePiece>
        </div>
      </div>

      {/* The list, grouped by pole */}
      <div className="lg:col-span-6 lg:col-start-7" role="group" aria-label={listLabel}>
        {poles.map((pole) => (
          <section key={pole.id} aria-labelledby={`pole-${pole.id}`} className="grid grid-cols-[88px_1fr] border-t border-line py-6 md:grid-cols-[120px_1fr]">
            <h3 id={`pole-${pole.id}`} className="pt-3 font-sans text-meta uppercase text-ink-muted">
              {pole.name}
            </h3>
            <ul>
              {services.map((s, i) => {
                if (s.pole !== pole.id) return null;
                const on = i === active;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      aria-expanded={on}
                      aria-controls={`service-${s.id}`}
                      onClick={() => setActive(i)}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      className="group flex min-h-12 w-full items-baseline gap-4 py-2 text-left"
                    >
                      <span className={clsx("font-sans text-meta tabular transition-colors duration-[var(--dur-ui)]", on ? "text-ink" : "text-ink-muted")}>
                        ({pad(i + 1)})
                      </span>
                      <span
                        className={clsx(
                          "relative font-display text-h3 transition-colors duration-[var(--dur-ui)] ease-[var(--ease-out-quint)]",
                          on ? "text-ink" : "text-ink-muted group-hover:text-ink",
                        )}
                      >
                        {s.name}
                        <span
                          aria-hidden="true"
                          className={clsx(
                            "absolute inset-x-0 -bottom-1 h-0.5 origin-left bg-ochre transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-quint)]",
                            on ? "scale-x-100" : "scale-x-0",
                          )}
                        />
                      </span>
                    </button>
                    {/* Accordion panel: small screens only; wide screens read it in the piece. */}
                    <div id={`service-${s.id}`} hidden={!on} className="pb-4 pl-[calc(1rem+2.2em)] lg:hidden">
                      <p className="measure text-body">{s.line}</p>
                      <Link
                        href={`#filtre-${s.pole}`}
                        className="mt-2 inline-flex min-h-11 items-center gap-2 font-display text-body font-semibold underline decoration-2 underline-offset-8"
                      >
                        {action}
                        <ArrowIcon />
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
