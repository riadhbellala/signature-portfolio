"use client";

import { agencyVideos } from "@/content/projects";
import { MediaPiece } from "./MediaPiece";

/**
 * Signature's own promotional videos (presented by Zahra, commerciale de l'agence): three
 * vertical videos in a row, widths ∝ ratio so they share one height, a caption under each.
 */
export function AgencyVideos({ label }: { label: string }) {
  return (
    <figure>
      <div className="flex gap-2">
        {agencyVideos.map((v) => (
          <div key={v.title} className="relative min-w-0" style={{ flex: `${v.media.ratio} 1 0` }}>
            <MediaPiece
              plain
              media={v.media}
              edges={{ top: "flat", bottom: "flat", left: "flat", right: "flat" }}
              sizes="(min-width: 1024px) 200px, 33vw"
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        {agencyVideos.map((v) => (
          <p key={v.title} className="min-w-0 pr-2 font-display text-small font-semibold" style={{ flex: `${v.media.ratio} 1 0` }}>
            {v.title}
          </p>
        ))}
      </div>
      {label ? <figcaption className="mt-3 text-small text-ink-muted">{label}</figcaption> : null}
    </figure>
  );
}
