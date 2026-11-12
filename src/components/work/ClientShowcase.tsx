"use client";

import clsx from "clsx";
import Image from "next/image";
import Link from "next/link";
import { getCategory } from "@/content/categories";
import { getClient, getProject, projectsOf, showcase, type Media } from "@/content/projects";
import { home } from "@/content/site";
import { Assemble, AssemblePiece } from "../motion/Assemble";
import type { Edges } from "../puzzle/geometry";
import { ArrowIcon } from "../ui/icons";
import { MediaPiece } from "./MediaPiece";

const pad = (n: number) => String(n).padStart(2, "0");

/** Edges for piece k of a chain of n: each piece's tab locks into the next one's socket. */
function chainEdges(k: number, n: number, vertical: boolean): Edges {
  const out = k < n - 1 ? "tab" : "flat";
  const inn = k > 0 ? "blank" : "flat";
  return vertical ? { top: inn, right: "flat", bottom: out, left: "flat" } : { top: "flat", right: out, bottom: "flat", left: inn };
}

/**
 * Work by client. Each client is one row: the name and what was done, then three interlocking
 * pieces across the full width, each in the real shape of its picture or video (a 3:2 render
 * stays 3:2, a vertical reel stays vertical). Widths follow the media, so the three pieces share
 * one height and fill the row: nothing is cropped to a square, no empty half-screen.
 * Phones: the same pieces in a vertical chain, full width.
 */
export function ClientShowcase() {
  return (
    <ol className="flex flex-col gap-20 md:gap-28">
      {showcase.map((block, b) => {
        const c = getClient(block.client);
        const ps = projectsOf(c.id);
        const types = [...new Set(ps.map((p) => getCategory(p.category).name))];
        const pieces = block.pieces.map(([slug, i]) => {
          const p = getProject(slug)!;
          return { p, m: p.media[i] as Media };
        });
        const ordered = b % 2 === 1 ? [...pieces].reverse() : pieces;
        return (
          <li key={c.id}>
            <div className={clsx("grid gap-x-6 gap-y-4 md:grid-cols-12 md:items-end", b % 2 === 1 && "md:text-right")}>
              <div className={clsx("flex flex-col gap-2 md:col-span-7", b % 2 === 1 && "md:order-2 md:col-start-6 md:items-end")}>
                <span className="font-sans text-meta text-ink-muted tabular">({pad(b + 1)})</span>
                {c.logo ? (
                  <Image src={c.logo} alt={c.name} width={320} height={120} className="h-auto max-h-20 w-auto object-contain" />
                ) : (
                  <h3 className="font-display text-h2">{c.name}</h3>
                )}
                <p className="font-sans text-meta uppercase text-ink-muted">{types.join(" · ")}</p>
              </div>
              <div className={clsx("flex flex-col gap-3 md:col-span-4", b % 2 === 1 ? "md:order-1 md:col-start-1 md:items-start md:text-left" : "md:col-start-9")}>
                <p className="measure text-body">{c.line}</p>
                <Link
                  href={`/projets/${ps[0].slug}`}
                  className="inline-flex min-h-11 items-center gap-2 self-start font-display text-body font-semibold underline decoration-ochre decoration-2 underline-offset-8 hover:decoration-4"
                >
                  {home.showcase.open}
                  <ArrowIcon />
                </Link>
              </div>
            </div>

            {/* Tablet and desktop: horizontal chain, widths ∝ media ratio, one shared height. */}
            <Assemble as="div" className="mt-8 hidden md:flex">
              {ordered.map(({ p, m }, k) => (
                <AssemblePiece key={k} i={k} as="div" className="relative min-w-0 hover:z-10 focus-within:z-10" style={{ flex: `${m.ratio} 1 0` }}>
                  <Link
                    href={`/projets/${p.slug}`}
                    aria-label={`${c.name}, ${p.title}`}
                    className="group block outline-offset-[-10px] transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-quint)] hover:-translate-y-1.5"
                  >
                    <MediaPiece media={m} edges={chainEdges(k, ordered.length, false)} sizes={`(min-width: 1440px) ${Math.round(m.ratio * 520)}px, ${Math.round(m.ratio * 36)}vw`} />
                  </Link>
                </AssemblePiece>
              ))}
            </Assemble>

            {/* Phones: vertical chain, full width. */}
            <Assemble as="div" className="mt-6 flex flex-col md:hidden">
              {pieces.map(({ p, m }, k) => (
                <AssemblePiece key={k} i={k} as="div" className="relative">
                  <Link href={`/projets/${p.slug}`} aria-label={`${c.name}, ${p.title}`} className="group block outline-offset-[-10px]">
                    <MediaPiece media={m} vertical edges={chainEdges(k, pieces.length, true)} sizes="100vw" />
                  </Link>
                </AssemblePiece>
              ))}
            </Assemble>
          </li>
        );
      })}
    </ol>
  );
}
