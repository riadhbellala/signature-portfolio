"use client";

import { agencyVideos } from "@/content/projects";
import { MediaPiece } from "./MediaPiece";

/**
 * Signature's own promotional videos (presented by Zahra, commerciale de l'agence): three
 * vertical pieces locked in a row, widths ∝ ratio so they share one height, a caption under each.
 */
export function AgencyVideos({ label }: { label: string }) {
  const n = agencyVideos.length;
  return (
    <figure>
      <div className="flex">
        {agencyVideos.map((v, k) => (
          <div key={v.title} className="relative min-w-0" style={{ flex: `${v.media.ratio} 1 0` }}>
            <MediaPiece
              media={v.media}
              edges={{ top: "flat", bottom: "flat", left: k > 0 ? "blank" : "flat", right: k < n - 1 ? "tab" : "flat" }}
              sizes="(min-width: 1024px) 200px, 33vw"
            />
          </div>
        ))}
      </div>
      <div className="mt-3 flex">
        {agencyVideos.map((v) => (
          <p key={v.title} className="min-w-0 pr-2 font-display text-small font-semibold" style={{ flex: `${v.media.ratio} 1 0` }}>
            {v.title}
          </p>
        ))}
      </div>
      <figcaption className="mt-3 text-small text-ink-muted">{label}</figcaption>
    </figure>
  );
}
