"use client";

import { agencyVideos } from "@/content/projects";
import { MediaPiece } from "./MediaPiece";

/**
 * Signature's own promotional videos: one bento tile each (vertical, 9:16), the title in a chip
 * at the top, play and sound buttons at the bottom. Rendered as grid items of the parent bento.
 */
export function AgencyVideos({ label }: { label: string }) {
  return (
    <>
      {agencyVideos.map((v) => (
        <figure key={v.title} className="relative w-[64%] shrink-0 snap-start scroll-ml-[var(--gutter)] sm:w-[40%] lg:w-auto lg:min-w-0">
          <MediaPiece
            plain
            shape={9 / 16}
            media={v.media}
            edges={{ top: "flat", bottom: "flat", left: "flat", right: "flat" }}
            sizes="(min-width: 1024px) 22vw, 33vw"
            className="!rounded-[var(--radius-lg)]"
          />
          <figcaption className="pointer-events-none absolute left-3 top-3 z-[3] rounded-full bg-cream/90 px-3 py-1.5 font-display text-meta font-semibold text-teal backdrop-blur">
            {v.title}
          </figcaption>
        </figure>
      ))}
      {label ? <p className="sr-only">{label}</p> : null}
    </>
  );
}
