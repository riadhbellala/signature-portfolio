"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { frameStyle, frameViewBox, PieceSurface } from "../puzzle/PuzzlePiece";
import { rectPiecePath, UNIT, type Edges } from "../puzzle/geometry";
import { sound, useSound, vimeoCommand } from "@/lib/sound";
import { vimeoSrc } from "@/lib/vimeo";

const EASE = [0.23, 1, 0.32, 1] as const;
/**
 * Two portrait half-pieces that lock into one 2:3 card (the 9:16 reel keeps most of its frame).
 * The left half is already in place; the hand brings the right half and locks it.
 */
const W = UNIT; // whole card
const H = 1200; // 5:6: wider card, the 9:16 reel is cropped top and bottom
const HALF = W / 2;
const KNOB = 520; // knob sized for a half piece
const LEFT_EDGES: Edges = { top: "flat", right: "tab", bottom: "flat", left: "flat" };
const RIGHT_EDGES: Edges = { top: "flat", right: "flat", bottom: "flat", left: "blank" };
const D_LEFT = rectPiecePath(HALF, H, LEFT_EDGES, KNOB);
const D_RIGHT = rectPiecePath(HALF, H, RIGHT_EDGES, KNOB);
const maskOf = (d: string, w: number, h: number) =>
  `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='${frameViewBox(w, h)}'><path d='${d}'/></svg>`)}")`;
const MASK_LEFT = maskOf(D_LEFT, HALF, H);
const MASK_RIGHT = maskOf(D_RIGHT, HALF, H);
/** Both halves locked = one plain card: the playing video is cut to its outline (no seam, no gap). */
const MASK_WHOLE = maskOf(rectPiecePath(W, H, { top: "flat", right: "flat", bottom: "flat", left: "flat" }, KNOB), W, H);
const PAD = 380; // frame padding (PuzzlePiece)
/** Where the whole picture sits inside a half piece's frame, so each half shows its half of it. */
const pictureIn = (offsetX: number) => ({
  left: `${((PAD - offsetX) / (HALF + 2 * PAD)) * 100}%`,
  top: `${(PAD / (H + 2 * PAD)) * 100}%`,
  width: `${(W / (HALF + 2 * PAD)) * 100}%`,
  height: `${(H / (H + 2 * PAD)) * 100}%`,
});
const pictureWhole = {
  left: `${(PAD / (W + 2 * PAD)) * 100}%`,
  top: `${(PAD / (H + 2 * PAD)) * 100}%`,
  width: `${(W / (W + 2 * PAD)) * 100}%`,
  height: `${(H / (H + 2 * PAD)) * 100}%`,
};

/**
 * Hand dimensions and grip geometry.
 * Sized and positioned so the hand physically grips the card in 3D:
 * - Base hand (index finger, under-fingers, palm, arm) sits BEHIND the card.
 * - The card is rotated -2.5° around the hand's grip point (85% 0%).
 * - The thumb overlay sits IN FRONT of the card, pressing firmly onto the card face.
 */
const HAND = { w: 2116, h: 715 };
// Same grip on the card as before, now in right-half widths (the hand travels with that half).
const HAND_W = 3.24; // hand width in half-piece widths
const HAND_H_RATIO = HAND.h / HAND.w; // 0.3379
const HAND_LEFT = 0.276;
const HAND_TOP = -0.884;

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
  const userPaused = useRef(false);
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
  // The right half has been set in place (instant with reduced motion).
  const [locked, setLocked] = useState(false);
  const showVideo = live && (locked || Boolean(reduce));

  // Vimeo player API over postMessage: play / pause / mute / unmute.
  const send = (method: string, value?: unknown) =>
    frame.current?.contentWindow?.postMessage(JSON.stringify(value === undefined ? { method } : { method, value }), "https://player.vimeo.com");

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      // Only our own player: other Vimeo players on the page must not trigger the reveal.
      if (e.origin !== "https://player.vimeo.com" || e.source !== frame.current?.contentWindow) return;
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data?.event === "ready") {
          setReady(true);
          frame.current?.contentWindow?.postMessage(JSON.stringify({ method: "addEventListener", value: "play" }), "https://player.vimeo.com");
          frame.current?.contentWindow?.postMessage(JSON.stringify({ method: "addEventListener", value: "pause" }), "https://player.vimeo.com");
        }
        if (data?.event === "play") setLive(true);
        // Paused without the visitor asking: the browser refused sound on open. Play on muted;
        // sound comes on at the first click or tap.
        if (data?.event === "pause" && !userPaused.current) {
          sound.blocked();
          vimeoCommand(frame.current, "setMuted", true);
          vimeoCommand(frame.current, "play");
        }
      } catch {}
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);


  const togglePlay = () => {
    userPaused.current = playing;
    send(playing ? "pause" : "play");
    setPlaying(!playing);
  };
  const toggleMute = () => {
    sound.toggle("hero");
  };

  const hasVideo = Boolean(vimeoId || src);
  const btn = "flex size-11 items-center justify-center bg-teal text-cream transition-transform duration-[var(--dur-press)] active:scale-[0.97]";

  const hand = (src: string, z: string) => (
    <Image
      src={src}
      alt=""
      width={HAND.w}
      height={HAND.h}
      priority
      sizes="(min-width: 1024px) 600px, 60vw"
      className={`pointer-events-none absolute ${z} max-w-none -scale-x-100 select-none`}
      style={{ width: `${HAND_W * 100}cqw`, height: `${HAND_W * HAND_H_RATIO * 100}cqw`, left: `${HAND_LEFT * 100}cqw`, top: `${HAND_TOP * 100}cqw` }}
    />
  );
  const carry = {
    initial: reduce ? false : { x: "70%", y: "-12%", rotate: 4 },
    animate: { x: 0, y: 0, rotate: 0 },
    transition: { duration: 0.9, ease: EASE, delay: 0.75 },
  } as const;
  const poster$ = (offsetX: number) =>
    poster ? (
      // eslint-disable-next-line @next/next/no-img-element -- poster of the reel, preloaded in <head>
      <img src={poster} alt="" className="absolute object-cover" style={pictureIn(offsetX)} />
    ) : null;

  return (
    <motion.div
      ref={box}
      className="relative ml-[8vw] w-[min(78vw,420px)] lg:ml-0 lg:w-[min(38vw,calc((100svh-24.5rem)*5/6),560px)]"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.35 }}
    >
      {/* Brand echo: the title's ochre outline, repeated as an offset frame behind the card. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 translate-x-[-5%] translate-y-[4%] border-2 border-ochre" />
      <div className="relative w-full" style={{ aspectRatio: `${W} / ${H}` }}>
        {/* Left half: already in place, showing the left half of the reel. */}
        <div className="absolute inset-y-0 left-0 w-1/2">
          {locked ? null : <PieceSurface d={D_LEFT} w={HALF} h={H} tone="sand" layer="base" />}
          <div className="absolute z-[1] overflow-hidden bg-sand" style={{ ...frameStyle(HALF, H), maskImage: MASK_LEFT, WebkitMaskImage: MASK_LEFT, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}>
            {poster$(0)}
          </div>
        </div>

        {/* Right half: brought in by the hand, then locked. The hand travels with it. */}
        <motion.div
          className="absolute inset-y-0 right-0 z-[2] w-1/2 [container-type:inline-size]"
          {...carry}
          onAnimationComplete={() => setLocked(true)}
        >
          {hand("/brand/hand-arm.webp", "z-0")}
          <div className="absolute inset-0 z-[1]">
            {/* Edge and shadow only while apart: once locked it is one flat card. */}
            {locked ? null : <PieceSurface d={D_RIGHT} w={HALF} h={H} tone="sand" layer="base" />}
            <div className="absolute z-[1] overflow-hidden bg-sand" style={{ ...frameStyle(HALF, H), maskImage: MASK_RIGHT, WebkitMaskImage: MASK_RIGHT, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}>
              {poster$(HALF)}
            </div>
          </div>
        </motion.div>

        {/* Once locked: one video across both halves, cut to their joined shape. It has been
            loading since the page opened, so it is usually ready the moment the pieces meet. */}
        {vimeoId || src ? (
          <div
            className={`pointer-events-none absolute z-[3] overflow-hidden transition-opacity duration-500 ${locked || reduce ? "opacity-100" : "opacity-0"}`}
            style={{ ...frameStyle(W, H), maskImage: MASK_WHOLE, WebkitMaskImage: MASK_WHOLE, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}
          >
            <div className="absolute overflow-hidden" style={pictureWhole}>
              {/* Whole poster under the player: the locked card reads as one piece even before play. */}
              {poster ? (
                // eslint-disable-next-line @next/next/no-img-element -- same preloaded poster
                <img src={poster} alt="" className="absolute inset-0 size-full object-cover" />
              ) : null}
              {vimeoId ? (
                <iframe
                  ref={frame}
                  src={`${vimeoSrc(vimeoId, !reduce)}&api=1`}
                  title={label}
                  allow="autoplay; fullscreen; picture-in-picture"
                  loading="eager"
                  tabIndex={-1}
                  className={`absolute left-0 top-1/2 w-full -translate-y-1/2 border-0 transition-opacity duration-500 ${showVideo ? "opacity-100" : "opacity-0"}`} style={{ aspectRatio: "9 / 16" }}
                />
              ) : (
                <video className="absolute inset-0 size-full object-cover" src={src ?? undefined} poster={poster ?? undefined} autoPlay={!reduce} muted loop playsInline aria-label={label} onPlay={() => setLive(true)} />
              )}
            </div>
          </div>
        ) : null}


        {/* The thumb, in front of the card (and the video): the piece is pinched between the fingers. */}
        <motion.div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-[4] w-1/2 [container-type:inline-size]" {...carry}>
          {hand("/brand/hand-thumb-overlay.webp", "z-0")}
        </motion.div>

        {hasVideo ? (
          <div className="absolute bottom-[6%] left-[8%] z-[5] flex gap-2">
            <button type="button" onClick={togglePlay} disabled={!ready && Boolean(vimeoId)} className={btn} aria-label={playing ? `Mettre en pause : ${label}` : `Lire : ${label}`}>
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button type="button" onClick={toggleMute} disabled={!ready && Boolean(vimeoId)} className={btn} aria-label={muted ? "Activer le son" : "Couper le son"}>
              {muted ? <VolumeOffIcon /> : <VolumeOnIcon />}
            </button>
          </div>
        ) : (
          <div role="img" aria-label={`${label} (${pending})`} className="absolute inset-0 z-[5] flex items-end p-[10%]">
            <span className="font-sans text-meta uppercase text-teal-muted">{pending}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
