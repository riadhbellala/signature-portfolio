"use client";

import { AnimatePresence, motion } from "motion/react";
import { SoundOn } from "../work/MediaPiece";
import { useSoundWaiting } from "@/lib/sound";

/**
 * Browsers refuse video sound until the visitor clicks or taps once; scrolling does not count.
 * While a video is on screen and sound is still waiting, this asks for that one tap. After it,
 * every video speaks by itself as it reaches the screen.
 */
export function SoundPrompt() {
  const waiting = useSoundWaiting();
  return (
    <AnimatePresence>
      {waiting ? (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          className="fixed bottom-5 left-1/2 z-50 flex min-h-12 -translate-x-1/2 items-center gap-3 bg-teal px-5 font-display text-body font-semibold text-cream shadow-[0_12px_32px_color-mix(in_oklab,var(--color-teal-deep)_35%,transparent)]"
        >
          <SoundOn />
          Activer le son des vidéos
        </motion.button>
      ) : null}
    </AnimatePresence>
  );
}
