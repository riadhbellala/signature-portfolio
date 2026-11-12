"use client";

import clsx from "clsx";
import { useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import type { Media } from "@/content/projects";
import { sound, useSound, vimeoCommand } from "@/lib/sound";
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

const icon = { width: 18, height: 18, viewBox: "0 0 20 20", "aria-hidden": true, focusable: false, className: "fill-current" } as const;
function Play() {
  return (
    <svg {...icon}>
      <path d="M6 4.5v11l9-5.5z" />
    </svg>
  );
}
export function SoundOn() {
  return (
    <svg {...icon}>
      <path d="M9.5 4.5 5.5 8H2v4h3.5l4 3.5v-11zm4.5 5.5c0-1.8-1-3.3-2.5-4v8c1.5-.7 2.5-2.2 2.5-4zm1.5 0c0 2.8-1.8 5.2-4.3 6.1v1.6c3.4-1 5.8-4.2 5.8-7.7s-2.4-6.7-5.8-7.7v1.6c2.5.9 4.3 3.3 4.3 6.1z" />
    </svg>
  );
}
export function SoundOff() {
  return (
    <svg {...icon}>
      <path d="M9.5 4.5 5.5 8H2v4h3.5l4 3.5v-11zm6.7 4.1-1.4-1.4-1.8 1.8-1.8-1.8-1.4 1.4 1.8 1.8-1.8 1.8 1.4 1.4 1.8-1.8 1.8 1.8 1.4-1.4-1.8-1.8 1.8-1.8z" />
    </svg>
  );
}

/**
 * A puzzle piece in the real shape of its picture or video (width = ratio × height), or in a
 * fixed `shape` ratio when it sits in a grid of equal cards. The picture covers the body plus
 * the knobs that stick out of it. Videos: the player mounts as the piece nears the screen, is
 * revealed once playing, and takes the page's sound when it is the video most on screen
 * (after the visitor's first click). Its button mutes or unmutes. `href` makes the piece a link.
 */
export function MediaPiece({
  media,
  edges,
  sizes,
  href,
  label,
  shape,
  tone = "sand",
  vertical = false,
  still = false,
  className,
  style,
}: {
  /** Thumbnail only: no player, no button (for a piece inside a larger link). */
  still?: boolean;
  media: Media;
  edges: Edges;
  sizes: string;
  href?: string;
  label?: string;
  /** Force this width/height ratio (cover-cropped), e.g. 4/3 for an even grid. */
  shape?: number;
  tone?: PieceTone;
  vertical?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ratio = shape ?? media.ratio;
  const w = vertical ? PIECE_H : Math.round(ratio * PIECE_H);
  const h = vertical ? Math.round(PIECE_H / ratio) : PIECE_H;
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

  const id = useId();
  const ref = useRef<HTMLDivElement>(null);
  const player = useRef<HTMLIFrameElement>(null);
  const reduce = useReducedMotion();
  const [near, setNear] = useState(false);
  const [live, setLive] = useState(false);
  const [ready, setReady] = useState(false);
  const { audible } = useSound(id);
  const isVideo = media.kind === "video" && !still;

  // Lazy: mount the player within one screen of the viewport, drop it when far.
  useEffect(() => {
    if (!isVideo || !ref.current) return;
    const el = ref.current;
    const far = new IntersectionObserver(
      ([e]) => {
        setNear(e.isIntersecting);
        if (!e.isIntersecting) {
          setLive(false);
          setReady(false);
        }
      },
      { rootMargin: "100% 0px 100% 0px" },
    );
    // How much of it is on screen: the most visible video gets the sound.
    const seen = new IntersectionObserver(([e]) => sound.report(id, e.intersectionRatio), { threshold: [0, 0.25, 0.5, 0.75, 1] });
    far.observe(el);
    seen.observe(el);
    return () => {
      far.disconnect();
      seen.disconnect();
      sound.report(id, 0);
    };
  }, [isVideo, id]);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== "https://player.vimeo.com" || e.source !== player.current?.contentWindow) return;
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data?.event === "ready") {
          vimeoCommand(player.current, "addEventListener", "play");
          setReady(true);
        }
        if (data?.event === "play") setLive(true);
      } catch {}
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // Follow the page's sound: unmute when this is the video on screen, mute otherwise.
  useEffect(() => {
    if (!ready) return;
    vimeoCommand(player.current, "setMuted", !audible);
    if (audible) vimeoCommand(player.current, "setVolume", 1);
  }, [audible, ready]);

  const play = isVideo && near && !reduce;
  const boxRatio = (w + ext.l + ext.r) / (h + ext.t + ext.b);
  const videoFill = isVideo && media.ratio < boxRatio ? "left-0 top-1/2 w-full -translate-y-1/2" : "left-1/2 top-0 h-full -translate-x-1/2";

  return (
    <div ref={ref} className={clsx("group relative", className)} style={{ aspectRatio: `${w} / ${h}`, ...style }}>
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

      {href ? <Link href={href} aria-label={label} className="absolute inset-0 z-[2] outline-offset-[-10px]" /> : null}

      {media.kind === "video" && still ? (
        <span aria-hidden="true" className="pointer-events-none absolute bottom-[8%] right-[8%] z-[3] flex size-11 items-center justify-center bg-teal text-cream">
          <Play />
        </span>
      ) : null}
      {isVideo ? (
        live ? (
          <button
            type="button"
            onClick={() => sound.toggle(id)}
            aria-label={audible ? `Couper le son : ${media.title}` : `Activer le son : ${media.title}`}
            aria-pressed={audible}
            className="absolute bottom-[8%] right-[8%] z-[3] flex size-11 items-center justify-center bg-teal text-cream transition-transform duration-[var(--dur-press)] active:scale-[0.97]"
          >
            {audible ? <SoundOn /> : <SoundOff />}
          </button>
        ) : (
          <span aria-hidden="true" className="pointer-events-none absolute bottom-[8%] right-[8%] z-[3] flex size-11 items-center justify-center bg-teal text-cream">
            <Play />
          </span>
        )
      ) : null}
    </div>
  );
}
