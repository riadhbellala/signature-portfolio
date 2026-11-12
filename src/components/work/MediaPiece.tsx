"use client";

import clsx from "clsx";
import { useReducedMotion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Media } from "@/content/projects";
import { vimeoSrc } from "@/lib/vimeo";
import { frameStyle, frameViewBox, PieceSurface, type PieceTone } from "../puzzle/PuzzlePiece";
import { REACH, rectPiecePath, type Edges } from "../puzzle/geometry";

export { vimeoSrc };

/** Every piece is 1000 units tall; its width follows the media (ratio × 1000). */
export const PIECE_H = 1000;
/** Knob size shared by all media pieces, so neighbours of any width lock together. */
export const KNOB = 640;
const reach = REACH * KNOB;

const masks = new Map<string, string>();
function maskFor(d: string, w: number, h: number) {
  const key = `${w}x${h}:${d}`;
  let m = masks.get(key);
  if (!m) {
    m = `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='${frameViewBox(w, h)}'><path d='${d}'/></svg>`)}")`;
    masks.set(key, m);
  }
  return m;
}

function Play() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="fill-cream">
      <path d="M6 4.5v11l9-5.5z" />
    </svg>
  );
}

/**
 * A puzzle piece in the real shape of its picture or video (width = ratio × height), so the work
 * is shown whole, not cropped to a square. The picture covers the body plus the knobs that stick
 * out of it; sockets are cut out of it. Videos: the Vimeo player is mounted as the piece nears
 * the screen and revealed when it is actually playing; reduced motion keeps the thumbnail.
 *
 * `vertical`: the piece sits in a vertical chain (knobs top/bottom); then the width is fixed
 * and the height follows the ratio.
 */
export function MediaPiece({
  media,
  edges,
  sizes,
  tone = "sand",
  vertical = false,
  className,
  style,
}: {
  media: Media;
  edges: Edges;
  sizes: string;
  tone?: PieceTone;
  vertical?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const w = vertical ? PIECE_H : Math.round(media.ratio * PIECE_H);
  const h = vertical ? Math.round(PIECE_H / media.ratio) : PIECE_H;
  const d = rectPiecePath(w, h, edges, KNOB);
  const mask = maskFor(d, w, h);
  const frame = frameStyle(w, h);

  // Picture box: the body, grown by the knob reach on the sides that have a tab.
  const ext = { t: edges.top === "tab" ? reach : 0, r: edges.right === "tab" ? reach : 0, b: edges.bottom === "tab" ? reach : 0, l: edges.left === "tab" ? reach : 0 };
  const pad = 380; // frameStyle padding (PuzzlePiece)
  const fw = w + 2 * pad;
  const fh = h + 2 * pad;
  const box = {
    left: `${((pad - ext.l) / fw) * 100}%`,
    top: `${((pad - ext.t) / fh) * 100}%`,
    width: `${((w + ext.l + ext.r) / fw) * 100}%`,
    height: `${((h + ext.t + ext.b) / fh) * 100}%`,
  };

  const ref = useRef<HTMLDivElement>(null);
  const player = useRef<HTMLIFrameElement>(null);
  const reduce = useReducedMotion();
  const [near, setNear] = useState(false);
  const [live, setLive] = useState(false);

  // Lazy: mount the player when the piece is within one screen of the viewport, drop it when far.
  useEffect(() => {
    if (media.kind !== "video" || !ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setNear(e.isIntersecting);
        if (!e.isIntersecting) setLive(false);
      },
      { rootMargin: "100% 0px 100% 0px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [media.kind]);

  // Reveal the player only once Vimeo says it is playing (no black frame, no spinner).
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== "https://player.vimeo.com" || e.source !== player.current?.contentWindow) return;
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data?.event === "ready") player.current?.contentWindow?.postMessage(JSON.stringify({ method: "addEventListener", value: "play" }), "https://player.vimeo.com");
        if (data?.event === "play") setLive(true);
      } catch {}
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  const play = media.kind === "video" && near && !reduce;
  // Cover the box with the video (portrait: full width, centred vertically; landscape: the reverse).
  const boxRatio = (w + ext.l + ext.r) / (h + ext.t + ext.b);
  const videoFill = media.kind === "video" && media.ratio < boxRatio ? "left-0 top-1/2 w-full -translate-y-1/2" : "left-1/2 top-0 h-full -translate-x-1/2";

  return (
    <div ref={ref} className={clsx("relative", className)} style={{ aspectRatio: `${w} / ${h}`, ...style }}>
      <PieceSurface d={d} w={w} h={h} tone={tone} layer="base" />
      <div className="absolute z-[1] overflow-hidden bg-sand" style={{ ...frame, maskImage: mask, WebkitMaskImage: mask, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}>
        <div className="absolute" style={box}>
          <Image
            src={media.kind === "image" ? media.src : media.thumb}
            alt={media.kind === "image" ? media.alt : media.title}
            fill
            sizes={sizes}
            className="object-cover transition-transform duration-[480ms] ease-[var(--ease-out-quint)] motion-safe:group-hover:scale-[1.03]"
          />
          {play ? (
            <iframe
              ref={player}
              src={`${vimeoSrc(media.vimeo, true)}&api=1`}
              title={media.title}
              allow="autoplay; fullscreen; picture-in-picture"
              tabIndex={-1}
              className={clsx("pointer-events-none absolute border-0 transition-opacity duration-500", videoFill, live ? "opacity-100" : "opacity-0")}
              style={{ aspectRatio: `${media.ratio}` }}
            />
          ) : null}
        </div>
      </div>
      {media.kind === "video" ? (
        <span aria-hidden="true" className={clsx("absolute bottom-[8%] right-[8%] z-[2] flex size-10 items-center justify-center bg-teal transition-opacity duration-300", live && "opacity-0")}>
          <Play />
        </span>
      ) : null}
    </div>
  );
}
