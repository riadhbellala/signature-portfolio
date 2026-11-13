"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Inertial smooth scroll (Lenis) over the native scroll: the page still scrolls natively (find,
 * keyboard, scrollbar, sticky all work); Lenis only eases the wheel. Touch keeps the phone's own
 * momentum. Off for visitors who ask for reduced motion. In-page links land under the header.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ autoRaf: true, lerp: 0.11, anchors: { offset: -64 } });
    return () => lenis.destroy();
  }, []);
  return null;
}
