"use client";

import clsx from "clsx";
import { motion } from "motion/react";
import Image from "next/image";
import { PieceIndex, PieceText } from "./PieceLabel";
import { PuzzlePiece } from "./PuzzlePiece";

const EASE = [0.23, 1, 0.32, 1] as const;

/** hand-arm.webp, mirrored: the arm leaves by the right edge, thumb and index pinch at the left. */
const HAND = { w: 2116, h: 715, pinchX: 0.1, pinchY: 0.93 };
/** Hand width in piece sides, and where on the ochre piece's right edge the fingers hold it. */
const HAND_W = 3;
const GRIP_Y = 0.6;

/**
 * Hero device: the teal piece ("votre marque") is waiting; a hand brings the ochre piece
 * ("nos solutions") in from the right and locks it. One move, 560ms, no bounce, no loop.
 * Reduced motion (MotionRoot): rendered already locked.
 *
 * Sizes are in piece sides (--p), so the whole scene scales from one number.
 */
export function HeroSnap({ a, b, groupLabel, className }: { a: string; b: string; groupLabel: string; className?: string }) {
  const transition = { duration: 0.56, ease: EASE, delay: 0.15 };
  const handH = (HAND_W * HAND.h) / HAND.w; // in piece sides
  return (
    <div
      role="group"
      aria-label={groupLabel}
      className={clsx("relative [--p:clamp(148px,17vw,236px)]", className)}
      style={{ width: "calc(var(--p) * 2)", height: "var(--p)", marginTop: `calc(var(--p) * ${Math.max(0, HAND.pinchY * handH - GRIP_Y).toFixed(3)})` }}
    >
      {/* The ochre piece's shadow travels with it but lies under both faces. */}
      <motion.div className="absolute left-[var(--p)] top-0 z-0 size-[var(--p)]" initial={{ x: 40 }} animate={{ x: 0 }} transition={transition}>
        <PuzzlePiece fluid tone="ochre" layer="shadow" edges={{ top: "flat", right: "flat", bottom: "flat", left: "flat" }} />
      </motion.div>

      {/* Teal piece: static, it has been waiting for the other one. */}
      <div className="absolute left-0 top-0 z-[1] size-[var(--p)]">
        <PuzzlePiece fluid tone="teal" edges={{ top: "flat", right: "tab", bottom: "flat", left: "flat" }}>
          <PieceIndex n={1} />
          <PieceText oneLine>{a}</PieceText>
        </PuzzlePiece>
      </div>

      {/* Ochre piece and the hand that places it travel together. */}
      <motion.div className="absolute left-[var(--p)] top-0 z-[2] size-[var(--p)]" initial={{ x: 40 }} animate={{ x: 0 }} transition={transition}>
        <PuzzlePiece fluid tone="ochre" shadow={false} edges={{ top: "flat", right: "flat", bottom: "flat", left: "blank" }}>
          <PieceIndex n={2} />
          <PieceText oneLine>{b}</PieceText>
        </PuzzlePiece>
        <Image
          src="/brand/hand-arm.webp"
          alt=""
          width={HAND.w}
          height={HAND.h}
          priority
          sizes="(min-width: 1024px) 640px, 360px"
          className="pointer-events-none absolute z-[3] max-w-none -scale-x-100 select-none"
          style={{
            width: `calc(var(--p) * ${HAND_W})`,
            left: `calc(var(--p) * ${(1 - HAND.pinchX * HAND_W - 0.07).toFixed(3)})`,
            top: `calc(var(--p) * ${(GRIP_Y - HAND.pinchY * handH).toFixed(3)})`,
          }}
        />
      </motion.div>
    </div>
  );
}
