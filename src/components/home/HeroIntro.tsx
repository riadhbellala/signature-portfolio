"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.23, 1, 0.32, 1] as const;

/**
 * The hero's entrance, played once on load:
 * 1. each title line rises out of a mask (90ms apart);
 * 2. the ochre outline slides from under the letters to its offset, like a second print pass;
 * 3. the line and the buttons fade up; the hand lowers the showreel piece (VideoPiece).
 * Reduced motion (MotionRoot): everything is simply there.
 */
export function HeroTitle({ id, lines, className }: { id: string; lines: string[]; className?: string }) {
  const text = () =>
    lines.map((line, i) => (
      <span key={i} className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
        <motion.span
          className="block"
          initial={{ y: "105%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.09 }}
        >
          {line}
          {i < lines.length - 1 ? " " : null}
        </motion.span>
      </span>
    ));
  return (
    <h1 id={id} className={`relative isolate font-display text-display ${className ?? ""}`}>
      {/* The outline layer: same text as a 2px ochre stroke, printed 0.04em right and down. */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 -z-10 select-none text-transparent [-webkit-text-stroke:2px_var(--color-ochre)]"
        initial={{ x: "0em", y: "0em", opacity: 0 }}
        animate={{ x: "0.04em", y: "0.04em", opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.55 }}
      >
        {text()}
      </motion.span>
      <span className="text-ink">{text()}</span>
    </h1>
  );
}

export function HeroFade({ children, delay, className }: { children: ReactNode; delay: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}
