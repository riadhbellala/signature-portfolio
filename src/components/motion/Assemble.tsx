"use client";

import { motion, type Variants } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

const EASE = [0.23, 1, 0.32, 1] as const;

/** Deterministic scatter for piece i: where it starts before it locks into place. */
function scatter(i: number) {
  const a = (i * 137.5 * Math.PI) / 180; // golden angle: pieces leave in every direction
  const r = 70 + (i % 3) * 22;
  return { x: Math.round(Math.cos(a) * r), y: Math.round(Math.sin(a) * r * 0.7) + 24, rotate: ((i * 47) % 19) - 9 };
}

const group: Variants = { hidden: {}, shown: { transition: { staggerChildren: 0.07 } } };
const piece: Variants = {
  hidden: (i: number) => ({ opacity: 0, ...scatter(i) }),
  shown: { opacity: 1, x: 0, y: 0, rotate: 0, transition: { duration: 0.7, ease: EASE } },
};

/**
 * Puzzle pieces fly in from scattered positions and lock together the first time the group
 * enters the screen. Reduced motion: MotionRoot drops the travel, pieces only fade in.
 */
export function Assemble({ children, className, as = "ul", label }: { children: ReactNode; className?: string; as?: "ul" | "div"; label?: string }) {
  const Tag = motion[as];
  return (
    <Tag className={className} aria-label={label} variants={group} initial="hidden" whileInView="shown" viewport={{ once: true, amount: 0.25 }}>
      {children}
    </Tag>
  );
}

export function AssemblePiece({ i, children, className, style, as = "li" }: { i: number; children: ReactNode; className?: string; style?: CSSProperties; as?: "li" | "div" }) {
  const Tag = motion[as];
  return (
    <Tag custom={i} variants={piece} className={className} style={style}>
      {children}
    </Tag>
  );
}

/** A piece that arrives after the group has locked (the clients banner), rising into its slot. */
export function AssembleLast({ delay, children, className }: { delay: number; children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{ hidden: { opacity: 0, y: 48 }, shown: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE, delay } } }}
    >
      {children}
    </motion.div>
  );
}
