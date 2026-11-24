"use client";

import { agencyVideos } from "@/content/projects";
import { InView } from "../motion/InView";
import { MediaPiece } from "./MediaPiece";

/** Desktop: an editorial step, not three equal cards. Large, medium, small, each set lower. */
const LAYOUT = [
  "lg:col-span-5",
  "lg:col-span-4 lg:mt-[var(--space-block)]",
  "lg:col-span-3 lg:mt-[calc(var(--space-block)*2)]",
];

/**
 * Signature's own promotional videos: one vertical (9:16) tile each, play and sound buttons
 * at the bottom, the title under it. Rendered as items of the parent row / grid.
 */
export function AgencyVideos({ label }: { label: string }) {
  return (
    <>
      {agencyVideos.map((v, i) => (
        <InView
          as="figure"
          key={v.title}
          delay={i * 90}
          className={`flex w-[72%] shrink-0 snap-start scroll-ml-[var(--gutter)] flex-col gap-4 sm:w-[44%] lg:w-auto lg:min-w-0 ${LAYOUT[i] ?? ""}`}
        >
          <MediaPiece
            plain
            shape={9 / 16}
            media={v.media}
            edges={{ top: "flat", bottom: "flat", left: "flat", right: "flat" }}
            sizes="(min-width: 1024px) 22vw, 33vw"
            className="!rounded-[var(--radius-sm)]"
          />
          <figcaption className="font-display text-body font-semibold">
            {v.title}
          </figcaption>
        </InView>
      ))}
      {label ? <p className="sr-only">{label}</p> : null}
    </>
  );
}
