import clsx from "clsx";
import Image from "next/image";
import type { Ratio } from "@/content/categories";
import { placeholderImage } from "@/content/site";

export type { Ratio };

const RATIO: Record<Ratio, string> = {
  "16/10": "aspect-[16/10]",
  "1/1": "aspect-square",
  "3/2": "aspect-[3/2]",
  "4/5": "aspect-[4/5]",
};

export interface ProjectImageProps {
  /** Path in /public, or null for the placeholder. */
  src: string | null;
  alt: string;
  ratio: Ratio;
  /** next/image sizes hint. */
  sizes: string;
  /** Print-label corners on the placeholder. */
  index?: string;
  category?: string;
  priority?: boolean;
  /** Small tiles: below 768px keep only the index label. */
  compact?: boolean;
  /** Full-bleed use: keep the corner labels on the page gutter, not the screen edge. */
  bleed?: boolean;
  /** Scale the picture to 1.02 while a `group` parent is hovered or focused. */
  zoom?: boolean;
  className?: string;
}

const zoomClass =
  "transition-transform duration-[480ms] ease-[var(--ease-out-quint)] motion-safe:group-hover:scale-[1.02] motion-safe:group-focus-visible:scale-[1.02]";

/**
 * A project picture at its category's ratio. With no file yet it is a flat sand block with a
 * 1px teal hairline and print-style labels in the corners, so the layout does not move when the
 * photo arrives. Swapping in a real image needs only the path in src/content/projects.ts.
 */
export function ProjectImage({ src, alt, ratio, sizes, index, category, priority, compact, bleed, zoom, className }: ProjectImageProps) {
  if (src) {
    return (
      <div className={clsx("relative overflow-hidden bg-sand", RATIO[ratio], className)}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className={clsx("object-cover", zoom && zoomClass)} />
      </div>
    );
  }
  const x = bleed ? "px-[var(--gutter)]" : "px-3";
  return (
    <div role="img" aria-label={`${alt} (${placeholderImage.pending})`} className={clsx("relative overflow-hidden border border-teal", RATIO[ratio], className)}>
      <div aria-hidden="true" className={clsx("absolute inset-0 bg-sand", zoom && zoomClass)} />
      <span className={clsx("absolute inset-x-0 top-3 font-sans", x)}>
        <span className="float-left font-sans text-meta uppercase text-teal-muted tabular">{index ? `(${index})` : null}</span>
        <span className={clsx("float-right max-w-[60%] text-right font-sans text-meta uppercase text-teal-muted", compact && "max-md:hidden")}>{category}</span>
      </span>
      <span className={clsx("absolute bottom-3 left-0 font-sans text-meta uppercase text-teal-muted", x, compact && "max-md:hidden")}>{placeholderImage.pending}</span>
    </div>
  );
}
