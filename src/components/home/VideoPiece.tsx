"use client";

import { motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { frameStyle, frameViewBox, PieceSurface } from "../puzzle/PuzzlePiece";
import { puzzlePath, UNIT, type Edges } from "../puzzle/geometry";

const EASE = [0.23, 1, 0.32, 1] as const;
const EDGES: Edges = { top: "flat", right: "flat", bottom: "tab", left: "tab" };
const D = puzzlePath(UNIT, EDGES);
/** The piece's outline as a CSS mask: the video is cut to the jigsaw shape, scaling with it. */
const MASK = `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='${frameViewBox(UNIT, UNIT)}'><path d='${D}'/></svg>`)}")`;

/**
 * hand-arm.webp (measured): index fingertip at (0.969, 0.831), thumb tip at (0.832, 0.972) of the
 * image, both pointing down — the pose of fingers pinching the top edge of something below them.
 * Mirrored, the arm leaves up and to the right and the fingertips grip the piece's top edge.
 */
const HAND = { w: 2116, h: 715, indexX: 0.969, indexY: 0.831 };
const HAND_W = 1.35; // hand width in piece widths: thumb-to-index span ≈ 0.18 of the piece
const HAND_H = (HAND_W * HAND.h) / HAND.w;
/** Where the index fingertip lands on the piece (x from the left, y below the top edge). */
const GRIP = { x: 0.78, y: 0.09 };

function Play() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="fill-cream">
      <path d="M6 4.5v11l9-5.5z" />
    </svg>
  );
}

/**
 * The hero showreel, cut as a puzzle piece (same knob as every piece, with its side and shadow),
 * brought in by the hand on load. Plays muted and looped; reduced motion shows the poster.
 * With no file yet: a sand face with a play mark and "Vidéo à venir".
 */
export function VideoPiece({ src, poster, label, pending }: { src: string | null; poster: string | null; label: string; pending: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className="relative ml-[17vw] w-[min(66vw,440px)] [container-type:inline-size] lg:ml-0"
      initial={{ x: 70, y: -50, opacity: 0 }}
      animate={{ x: 0, y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: EASE, delay: 0.55 }}
    >
      <div className="relative aspect-square w-full">
        <PieceSurface d={D} w={UNIT} h={UNIT} tone="sand" layer="base" />
        <div
          className="absolute z-[1] overflow-hidden bg-sand"
          style={{ ...frameStyle(UNIT, UNIT), maskImage: MASK, WebkitMaskImage: MASK, maskSize: "100% 100%", WebkitMaskSize: "100% 100%" }}
        >
          {src ? (
            <video
              className="absolute inset-0 size-full object-cover"
              src={src}
              poster={poster ?? undefined}
              autoPlay={!reduce}
              muted
              loop
              playsInline
              aria-label={label}
            />
          ) : null}
        </div>
        {src ? null : (
          <div role="img" aria-label={`${label} (${pending})`} className="absolute inset-0 z-[2] flex flex-col justify-between p-[9%]">
            <span className="font-sans text-meta uppercase text-teal-muted">{label}</span>
            <span className="flex items-center gap-4">
              <span className="flex size-14 items-center justify-center bg-teal">
                <Play />
              </span>
              <span className="font-sans text-meta uppercase text-teal-muted">{pending}</span>
            </span>
          </div>
        )}
      </div>
      <Image
        src="/brand/hand-arm.webp"
        alt=""
        width={HAND.w}
        height={HAND.h}
        priority
        sizes="(min-width: 1024px) 1000px, 80vw"
        className="pointer-events-none absolute z-[3] max-w-none -scale-x-100 select-none"
        style={{
          width: `${HAND_W * 100}cqw`,
          left: `${((GRIP.x - (1 - HAND.indexX) * HAND_W) * 100).toFixed(2)}cqw`,
          top: `${((GRIP.y - HAND.indexY * HAND_H) * 100).toFixed(2)}cqw`,
        }}
      />
    </motion.div>
  );
}
