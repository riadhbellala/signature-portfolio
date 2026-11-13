"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.23, 1, 0.32, 1] as const;

/**
 * The hero's entrance, played once on load:
 * 1. each title line rises out of a mask (90ms apart);
 * 2. the ochre outline slides from under the letters to its offset, like a second print pass;
 * 3. the line and the buttons fade up; the reel card fades in (HeroReel).
 * Reduced motion (MotionRoot): everything is simply there.
 */
export function HeroTitle({ id, lines, className }: { id: string; lines: string[]; className?: string }) {
  // The title is the page's largest paint: it is there from the first frame, never hidden behind
  // an entrance. Only the ochre outline (decoration) slides to its offset, like a second print pass.
  // Each line rises out of its own mask (CSS, so it starts with the first paint), 90 ms apart.
  const text = lines.map((line, i) => (
    <span key={i} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
      <span className="hero-line block" style={{ animationDelay: `${60 + i * 90}ms` }}>
        {line}
        {i < lines.length - 1 ? " " : null}
      </span>
    </span>
  ));
  return (
    <h1 id={id} className={`relative isolate font-display text-display ${className ?? ""}`}>
      <span aria-hidden="true" className="hero-outline absolute inset-0 -z-10 select-none text-transparent [-webkit-text-stroke:2px_var(--color-ochre)]">
        {text}
      </span>
      <span className="text-ink">{text}</span>
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
