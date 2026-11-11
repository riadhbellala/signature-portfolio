"use client";

import { motion } from "motion/react";
import type { ElementType } from "react";

const EASE = [0.23, 1, 0.32, 1] as const;

/**
 * A title whose words rise out of a mask, one after the other, the first time it enters the
 * screen. The words are real text (no aria tricks needed): only their position animates.
 * Reduced motion (MotionRoot): the words simply appear.
 */
export function RiseText({ text, as: Tag = "h2", id, className }: { text: string; as?: ElementType; id?: string; className?: string }) {
  const words = text.split(" ");
  return (
    <Tag id={id} className={className}>
      <motion.span
        className="block"
        initial="hidden"
        whileInView="shown"
        viewport={{ once: true, amount: 0.6 }}
        variants={{ hidden: {}, shown: { transition: { staggerChildren: 0.06 } } }}
      >
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-top -mb-[0.12em]">
            <motion.span
              className="inline-block"
              variants={{ hidden: { y: "105%" }, shown: { y: "0%", transition: { duration: 0.7, ease: EASE } } }}
            >
              {w}
              {i < words.length - 1 ? " " : null}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
