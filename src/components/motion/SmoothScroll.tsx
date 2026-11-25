"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Inertial smooth scroll (Lenis) over the native scroll: the page still scrolls natively (find,
 * keyboard, scrollbar, sticky all work); Lenis only eases the wheel. Touch keeps the phone's own
 * momentum. Off for visitors who ask for reduced motion. In-page links land under the header.
 * On a route change Lenis would ease back to the old page's scroll position (it keeps its own
 * target), so a new page jumps to its top, unless the URL carries a #hash to land on.
 */
export function SmoothScroll() {
  const lenis = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    lenis.current = new Lenis({ autoRaf: true, lerp: 0.11, anchors: { offset: -64 } });
    return () => {
      lenis.current?.destroy();
      lenis.current = null;
    };
  }, []);

  useEffect(() => {
    if (window.location.hash) return;
    lenis.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
