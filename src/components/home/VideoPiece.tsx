"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { frameStyle, frameViewBox, PieceSurface } from "../puzzle/PuzzlePiece";
import { rectPiecePath, UNIT, type Edges } from "../puzzle/geometry";
import { sound, useSound, vimeoCommand } from "@/lib/sound";
import { vimeoSrc } from "@/lib/vimeo";

const EASE = [0.23, 1, 0.32, 1] as const;
const EDGES: Edges = { top: "flat", right: "flat", bottom: "tab", left: "tab" };
/** Portrait piece (2:3) so the 9:16 reel keeps most of its frame. */
const W = UNIT;
const H = 1500;
const D = rectPiecePath(W, H, EDGES);
/** The piece's outline as a CSS mask: the video is cut to the jigsaw shape, scaling with it. */
const MASK = `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='${frameViewBox(W, H)}'><path d='${D}'/></svg>`)}")`;

/**
 * Hand dimensions and grip geometry.
 * Sized and positioned so the hand physically grips the card in 3D:
 * - Base hand (index finger, under-fingers, palm, arm) sits BEHIND the card.
 * - The card is rotated -2.5° around the hand's grip point (85% 0%).
 * - The thumb overlay sits IN FRONT of the card, pressing firmly onto the card face.
 */
const HAND = { w: 2116, h: 715 };
const HAND_W = 1.62; // Hand width in piece widths
const HAND_H_RATIO = HAND.h / HAND.w; // 0.3379
const HAND_LEFT = 0.638; // 63.8cqw
const HAND_TOP = -0.442; // -44.2cqw

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="fill-current">
      <path d="M6 4.5v11l9-5.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="fill-current">
      <path d="M5 4h3v12H5zm7 0h3v12h-3z" />
    </svg>
  );
}

function VolumeOnIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="fill-current">
      <path d="M9.5 4.5L5.5 8H2v4h3.5l4 3.5v-11zm4.5 5.5c0-1.8-1-3.3-2.5-4v8c1.5-.7 2.5-2.2 2.5-4zm1.5 0c0 2.8-1.8 5.2-4.3 6.1v1.6c3.4-1 5.8-4.2 5.8-7.7s-2.4-6.7-5.8-7.7v1.6c2.5.9 4.3 3.3 4.3 6.1z" />
    </svg>
  );
}

function VolumeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="fill-current">
      <path d="M9.5 4.5L5.5 8H2v4h3.5l4 3.5v-11zm6.7 4.1l-1.4-1.4-1.8 1.8-1.8-1.8-1.4 1.4 1.8 1.8-1.8 1.8 1.4 1.4 1.8-1.8 1.8 1.8 1.4-1.4-1.8-1.8 1.8-1.8z" />
    </svg>
  );
}

export interface VideoPieceProps {
  src?: string | null;
  vimeoId?: string | null;
  poster?: string | null;
  label: string;
  pending: string;
}

/**
 * The hero showreel, cut as a puzzle piece and held naturally in 3D by the hand.
 * Supports interactive Play/Pause and Mute/Unmute audio controls.
 */
export function VideoPiece({ src, vimeoId, poster, label, pending }: VideoPieceProps) {
  const reduce = useReducedMotion();
  const frame = useRef<HTMLIFrameElement>(null);
  // null = not touched yet: plays unless reduced motion; after a click the visitor decides.
  const [choice, setPlaying] = useState<boolean | null>(null);
  const playing = choice ?? !reduce;
  // Page-wide sound: the hero reel speaks when it is the video most on screen (after a first click).
  const { audible } = useSound("hero");
  const muted = !audible;
  const box = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!box.current) return;
    const io = new IntersectionObserver(([e]) => sound.report("hero", e.intersectionRatio), { threshold: [0, 0.25, 0.5, 0.75, 1] });
    io.observe(box.current);
    return () => {
      io.disconnect();
      sound.report("hero", 0);
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    vimeoCommand(frame.current, "setMuted", muted);
    if (!muted) vimeoCommand(frame.current, "setVolume", 1);
  }, [muted, ready]);
  const [live, setLive] = useState(false);

  // Vimeo player API over postMessage: play / pause / mute / unmute.
  const send = (method: string, value?: unknown) =>
    frame.current?.contentWindow?.postMessage(JSON.stringify(value === undefined ? { method } : { method, value }), "https://player.vimeo.com");

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== "https://player.vimeo.com") return;
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data?.event === "ready") {
          setReady(true);
          frame.current?.contentWindow?.postMessage(JSON.stringify({ method: "addEventListener", value: "play" }), "https://player.vimeo.com");
        }
        if (data?.event === "play") setLive(true);
      } catch {}
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);


  const togglePlay = () => {
    send(playing ? "pause" : "play");
    setPlaying(!playing);
  };
  const toggleMute = () => {
    sound.toggle("hero");
  };

  const hasVideo = Boolean(vimeoId || src);
  const btn = "flex size-11 items-center justify-center bg-teal text-cream transition-transform duration-[var(--dur-press)] active:scale-[0.97]";

  return (
    <motion.div
      ref={box}
      className="relative ml-[17vw] w-[min(56vw,360px)] [container-type:inline-size] lg:ml-0"
      initial={{ x: 70, y: -50, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
    >
      {/* Base hand: behind the card. */}
      <Image
        src="/brand/hand-arm.webp"
        alt=""
        width={HAND.w}
        height={HAND.h}
        priority
        sizes="(min-width: 1024px) 600px, 60vw"
        className="pointer-events-none absolute z-0 max-w-none -scale-x-100 select-none"
        style={{ width: `${HAND_W * 100}cqw`, height: `${HAND_W * HAND_H_RATIO * 100}cqw`, left: `${HAND_LEFT * 100}cqw`, top: `${HAND_TOP * 100}cqw` }}
      />

      {/* The card, tilted a touch around the grip point. */}
      <div className="relative z-[1] w-full origin-[85%_0%] -rotate-[2.5deg]" style={{ aspectRatio: `${W} / ${H}` }}>
        <PieceSurface d={D} w={W} h={H} tone="sand" layer="base" />
        <div
          className="absolute z-[1] overflow-hidden bg-sand"
          style={{ ...frameStyle(W, H), maskImage: MASK, WebkitMaskImage: MASK, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}
        >
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element -- poster under the player
            <img src={poster} alt="" className="absolute inset-0 size-full object-cover" />
          ) : null}
          {vimeoId ? (
            <iframe
              ref={frame}
              src={`${vimeoSrc(vimeoId, !reduce)}&api=1`}
              title={label}
              allow="autoplay; fullscreen; picture-in-picture"
              loading="eager"
              // @ts-expect-error -- fetchpriority is valid HTML, not yet in React's iframe types
              fetchpriority="high"
              className={`pointer-events-none absolute left-1/2 top-1/2 h-[118%] w-[118%] -translate-x-1/2 -translate-y-1/2 border-0 transition-opacity duration-500 ${live ? "opacity-100" : "opacity-0"}`}
              tabIndex={-1}
            />
          ) : src ? (
            <video className="absolute inset-0 size-full object-cover" src={src} poster={poster ?? undefined} autoPlay={!reduce} muted loop playsInline aria-label={label} />
          ) : null}
        </div>
        {hasVideo ? (
          <div className="absolute bottom-[8%] left-[10%] z-[2] flex gap-2">
            <button type="button" onClick={togglePlay} disabled={!ready && Boolean(vimeoId)} className={btn} aria-label={playing ? `Mettre en pause : ${label}` : `Lire : ${label}`}>
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button type="button" onClick={toggleMute} disabled={!ready && Boolean(vimeoId)} className={btn} aria-label={muted ? "Activer le son" : "Couper le son"}>
              {muted ? <VolumeOffIcon /> : <VolumeOnIcon />}
            </button>
          </div>
        ) : (
          <div role="img" aria-label={`${label} (${pending})`} className="absolute inset-0 z-[2] flex items-end p-[10%]">
            <span className="font-sans text-meta uppercase text-teal-muted">{pending}</span>
          </div>
        )}
      </div>

      {/* Thumb overlay: in front of the card, pressing on its face. */}
      <Image
        src="/brand/hand-thumb-overlay.webp"
        alt=""
        width={HAND.w}
        height={HAND.h}
        sizes="(min-width: 1024px) 600px, 60vw"
        className="pointer-events-none absolute z-[3] max-w-none -scale-x-100 select-none"
        style={{ width: `${HAND_W * 100}cqw`, height: `${HAND_W * HAND_H_RATIO * 100}cqw`, left: `${HAND_LEFT * 100}cqw`, top: `${HAND_TOP * 100}cqw` }}
      />
    </motion.div>
  );
}
