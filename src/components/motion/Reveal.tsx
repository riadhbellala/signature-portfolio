"use client";

import { MotionConfig, motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.23, 1, 0.32, 1] as const;

const group: Variants = {
  hidden: {},
  shown: { transition: { staggerChildren: 0.04 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 8 },
  shown: { opacity: 1, y: 0, transition: { duration: 0.48, ease: EASE } },
};

/** Respect the OS reduced-motion setting for every motion component below it. */
export function MotionRoot({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Reveals its RevealItem children once, on scroll: opacity + 8px, 40ms stagger. */
export function Reveal({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "ul" | "ol" }) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={group} initial="hidden" whileInView="shown" viewport={{ once: true, margin: "0px 0px -10% 0px" }}>
      {children}
    </Tag>
  );
}

export function RevealItem({ children, className, as = "div" }: { children: ReactNode; className?: string; as?: "div" | "li" }) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={item}>
      {children}
    </Tag>
  );
}
