"use client";

import Link from "next/link";
import { getCategory } from "@/content/categories";
import {
  getClient,
  getProject,
  projectsOf,
  showcase,
  type Media,
} from "@/content/projects";
import { home } from "@/content/site";
import { Reveal, RevealItem } from "../motion/Reveal";
import { ArrowIcon } from "../ui/icons";
import { AutoScroll } from "./AutoScroll";
import { MediaPiece } from "./MediaPiece";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Work by client. Each client is one block: a header line (number, name, what was done, link)
 * and its three pieces of work side by side, each in its real shape (a 3:2 render stays 3:2, a
 * reel stays vertical), one shared height, a narrow gap. No puzzle cut here: the work is the
 * subject, shown clean. The first client is the lead: its row is taller.
 * Phones: the pieces scroll sideways (snap), so a block stays one screen tall.
 */
export function ClientShowcase() {
  return (
    <ol className="flex flex-col gap-16 md:gap-24">
      {showcase.map((block, b) => {
        const c = getClient(block.client);
        const ps = projectsOf(c.id);
        const types = [...new Set(ps.map((p) => getCategory(p.category).name))];
        const pieces = block.pieces.map(([slug, i]) => {
          const p = getProject(slug)!;
          return { p, m: p.media[i] as Media };
        });
        // A video, when the client has one, always comes first.
        pieces.sort((x, y) => Number(y.m.kind === "video") - Number(x.m.kind === "video"));
        const lead = b === 0;
        return (
          <li key={c.id}>
            <Reveal>
              <RevealItem className="flex flex-col gap-3 border-t border-line pt-5 md:flex-row md:items-baseline md:justify-between md:gap-8">
                <div className="flex items-baseline gap-4">
                  <span className="font-sans text-small tabular text-ink-muted">
                    {pad(b + 1)}
                  </span>
                  <h3
                    className={
                      lead
                        ? "font-display text-h2 leading-[1]"
                        : "font-display text-h3"
                    }
                  >
                    {c.name}
                  </h3>
                </div>
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1 pl-9 md:pl-0">
                  <p className="text-small text-ink-muted">
                    {types.join(" · ")}
                  </p>
                  <Link
                    href={`/projets/${ps[0].slug}`}
                    className="group inline-flex min-h-11 items-center gap-2 font-display text-body font-semibold underline decoration-ochre decoration-2 underline-offset-8 hover:decoration-4"
                  >
                    {home.showcase.open}
                    <ArrowIcon className="transition-transform duration-[var(--dur-ui)] group-hover:translate-x-1" />
                  </Link>
                </div>
              </RevealItem>

              {/* Tablet and desktop: one row, widths follow each picture's shape. */}
              <RevealItem className="mt-5 hidden gap-2 md:flex">
                {pieces.map(({ p, m }, k) => (
                  <div
                    key={k}
                    className="min-w-0"
                    style={{ flex: `${m.ratio} 1 0` }}
                  >
                    <MediaPiece
                      plain
                      media={m}
                      href={`/projets/${p.slug}`}
                      label={`${c.name}, ${p.title}`}
                      edges={{
                        top: "flat",
                        right: "flat",
                        bottom: "flat",
                        left: "flat",
                      }}
                      sizes={`(min-width: 1440px) ${Math.round(m.ratio * 560)}px, ${Math.round(m.ratio * 38)}vw`}
                    />
                  </div>
                ))}
              </RevealItem>

              {/* Phones: swipe sideways, one shared height; slides on its own while on screen. */}
              <RevealItem className="md:hidden">
                <AutoScroll className="-mx-[var(--gutter)] mt-4 flex snap-x snap-mandatory scroll-px-[var(--gutter)] items-start gap-2 overflow-x-auto px-[var(--gutter)] pb-2 [scrollbar-width:none]">
                  {pieces.map(({ p, m }, k) => (
                    <div
                      key={k}
                      // Height fits the screen; a wide picture never fills the whole width, so the
                      // next one peeks in and says "swipe".
                      className="h-[260px] shrink-0 snap-start"
                      style={
                        {
                          aspectRatio: `${m.ratio}`,
                          "--r": m.ratio,
                        } as React.CSSProperties
                      }
                    >
                      <MediaPiece
                        plain
                        media={m}
                        href={`/projets/${p.slug}`}
                        label={`${c.name}, ${p.title}`}
                        edges={{
                          top: "flat",
                          right: "flat",
                          bottom: "flat",
                          left: "flat",
                        }}
                        className="h-full"
                        sizes={`${Math.round(m.ratio * 62)}vh`}
                      />
                    </div>
                  ))}
                </AutoScroll>
              </RevealItem>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
