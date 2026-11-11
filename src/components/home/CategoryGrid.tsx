"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";
import type { Category, Layout } from "@/content/categories";
import type { Project } from "@/content/projects";
import { home } from "@/content/site";
import { Reveal, RevealItem } from "../motion/Reveal";
import { ProjectImage } from "../project/ProjectImage";

const LIMIT = 6;

/** Grid and per-item classes for each medium. Never the same grid twice in a row. */
const GRID: Record<Layout, string> = {
  screens: "grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2",
  boards: "grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6",
  murals: "grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2",
  gallery: "grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6",
  landscape: "grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2",
  feature: "grid grid-cols-1 gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-12 lg:grid-flow-dense",
  posts: "grid grid-cols-2 gap-x-3 gap-y-8 md:gap-x-6 lg:grid-cols-4",
};

/** Small tiles get the short caption. */
const SMALL: Layout[] = ["boards", "gallery", "posts"];

function itemClass(layout: Layout, i: number) {
  if (layout === "murals") return i % 3 === 0 ? "md:col-span-2" : undefined;
  if (layout === "feature") {
    // Groups of three: one large (8 columns, two rows), two small stacked; sides alternate.
    const group = Math.floor(i / 3);
    const pos = i % 3;
    const flip = group % 2 === 1;
    if (pos === 0) return clsx("md:col-span-2 lg:col-span-8 lg:row-span-2", flip && "lg:col-start-5");
    return clsx("lg:col-span-4", flip && "lg:col-start-1");
  }
  return undefined;
}

function sizes(layout: Layout, i: number) {
  if (layout === "murals" && i % 3 === 0) return "(min-width: 1280px) 1168px, 100vw";
  if (layout === "feature" && i % 3 === 0) return "(min-width: 1024px) 780px, 100vw";
  if (layout === "posts") return "(min-width: 1024px) 280px, 50vw";
  if (SMALL.includes(layout) || layout === "feature") return "(min-width: 768px) 380px, 50vw";
  return "(min-width: 768px) 580px, 100vw";
}

/**
 * The projects of one type, in the layout that suits the medium. Six at most; the rest open in
 * place with "Voir les X autres projets". Hover: the picture scales to 1.02 and the client name
 * takes its underline.
 */
export function CategoryGrid({ category, projects }: { category: Category; projects: Project[] }) {
  const [open, setOpen] = useState(false);
  const shown = open ? projects : projects.slice(0, LIMIT);
  const rest = projects.length - LIMIT;
  const small = SMALL.includes(category.layout);
  const isLarge = (i: number) => (category.layout === "feature" && i % 3 === 0) || (category.layout === "murals" && i % 3 === 0);

  return (
    <div>
      <Reveal as="ul" className={GRID[category.layout]}>
        {shown.map((p, i) => (
          <RevealItem as="li" key={p.slug} className={clsx("min-w-0", itemClass(category.layout, i))}>
            <Link href={`/projets/${p.slug}`} className="group flex h-full flex-col gap-3 no-underline">
              <ProjectImage
                src={p.cover}
                alt={`${p.title}, ${p.client}`}
                ratio={category.ratio}
                sizes={sizes(category.layout, i)}
                index={String(i + 1).padStart(2, "0")}
                category={category.name}
                compact={small}
                zoom
                className={category.layout === "feature" && i % 3 === 0 ? "lg:aspect-auto lg:min-h-0 lg:flex-1" : undefined}
              />
              <span className="flex flex-col gap-0.5">
                <span
                  className={clsx(
                    "font-display decoration-ochre decoration-2 underline-offset-4 group-hover:underline group-focus-visible:underline",
                    small ? "text-body font-semibold" : isLarge(i) ? "text-h3" : "text-list",
                  )}
                >
                  {p.client}
                </span>
                <span className="flex flex-wrap gap-x-2 font-sans text-small text-ink-muted">
                  <span>{p.title}</span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular">{p.year}</span>
                </span>
              </span>
            </Link>
          </RevealItem>
        ))}
      </Reveal>
      {rest > 0 && !open ? (
        <button type="button" className="btn btn-secondary -ml-5 mt-10" onClick={() => setOpen(true)} aria-expanded={false}>
          <span className="btn-label">{home.category.more(rest)}</span>
        </button>
      ) : null}
    </div>
  );
}
