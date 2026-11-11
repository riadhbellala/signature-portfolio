"use client";

import clsx from "clsx";
import Link from "next/link";
import { getCategory } from "@/content/categories";
import type { Project } from "@/content/projects";
import { home, placeholderImage } from "@/content/site";
import { Assemble, AssemblePiece } from "../motion/Assemble";
import { gridEdges } from "../puzzle/geometry";
import { PuzzlePiece } from "../puzzle/PuzzlePiece";
import { ArrowIcon } from "../ui/icons";

const LAYOUTS = [
  { cols: 2, className: "grid grid-cols-2 md:hidden" },
  { cols: 4, className: "hidden md:grid md:grid-cols-4" },
];

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Selected work, one project per type, as one jigsaw: every piece carries its picture and locks
 * to its neighbours. The pieces fly in and lock as the section enters. The last piece is left
 * for the visitor, in ochre: "Votre projet ici ?".
 */
export function WorkPuzzle({ projects }: { projects: Project[] }) {
  const t = home.work;
  const total = projects.length + 1;
  return (
    <div>
      {LAYOUTS.map(({ cols, className }) => {
        const rows = Math.ceil(total / cols);
        const lastCols = total - (rows - 1) * cols;
        return (
          <Assemble key={cols} className={className} label={t.label}>
            {Array.from({ length: total }, (_, i) => {
              const edges = gridEdges(Math.floor(i / cols), i % cols, rows, cols, { row: rows - 1, cols: lastCols });
              const p = projects[i];
              if (!p) {
                return (
                  <AssemblePiece key="invite" i={i} className="relative">
                    <Link href={t.invite.href} className="group block no-underline outline-offset-[-10px]">
                      <PuzzlePiece fluid tone="ochre" edges={edges}>
                        <span className="font-sans text-meta tabular">({pad(i + 1)})</span>
                        <span className="flex flex-col gap-2">
                          <span className="font-display text-piece">{t.invite.label}</span>
                          <span className="inline-flex items-center gap-2 font-display text-small font-semibold underline decoration-2 underline-offset-4 group-hover:decoration-4 max-md:hidden">
                            {t.invite.action}
                            <ArrowIcon size={14} />
                          </span>
                        </span>
                      </PuzzlePiece>
                    </Link>
                  </AssemblePiece>
                );
              }
              const c = getCategory(p.category);
              return (
                <AssemblePiece key={p.slug} i={i} className="relative hover:z-10 focus-within:z-10">
                  <Link
                    href={`/projets/${p.slug}`}
                    className="group block no-underline outline-offset-[-10px] transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-quint)] hover:-translate-y-1.5"
                  >
                    <PuzzlePiece fluid tone="sand" edges={edges} image={{ src: p.cover }}>
                      <span className="font-sans text-meta text-teal-muted tabular">({pad(i + 1)})</span>
                      <span className={clsx("flex min-w-0 flex-col gap-0.5", p.cover && "self-start bg-cream px-2 py-1.5")}>
                        <span className="line-clamp-2 font-display text-piece decoration-ochre decoration-2 underline-offset-4 group-hover:underline">{p.client}</span>
                        <span className="truncate font-sans text-meta uppercase text-teal-muted">
                          {c.name}
                          {p.cover ? null : <span className="max-md:hidden"> · {placeholderImage.pending}</span>}
                        </span>
                      </span>
                    </PuzzlePiece>
                  </Link>
                </AssemblePiece>
              );
            })}
          </Assemble>
        );
      })}
    </div>
  );
}
