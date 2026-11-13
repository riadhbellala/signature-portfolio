"use client";

import { useEffect, useRef } from "react";

/**
 * Phones: while this row is on screen, it slides to the next picture every 2.6 s, then back to
 * the first. Only a sideways swipe by the visitor stops it (a vertical scroll over the row does
 * not). Snap is lifted during our own slide, so iOS Safari does not cancel it. Off with
 * reduced motion.
 */
export function AutoScroll({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: number | undefined;
    let stopped = false;
    let x0 = 0;
    let y0 = 0;
    const step = () => {
      const items = Array.from(el.children) as HTMLElement[];
      const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
      const next = items.find((c) => c.offsetLeft - pad > el.scrollLeft + 4);
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.style.scrollSnapType = "none";
      el.scrollTo({ left: !next || atEnd ? 0 : next.offsetLeft - pad, behavior: "smooth" });
      window.setTimeout(() => {
        el.style.scrollSnapType = "";
      }, 900);
    };
    const start = () => {
      if (stopped || timer) return;
      timer = window.setInterval(step, 2600);
    };
    const pause = () => {
      window.clearInterval(timer);
      timer = undefined;
    };
    const io = new IntersectionObserver(([e]) => (e.intersectionRatio >= 0.4 ? start() : pause()), { threshold: [0, 0.4] });
    io.observe(el);
    const down = (e: TouchEvent) => {
      x0 = e.touches[0].clientX;
      y0 = e.touches[0].clientY;
    };
    const move = (e: TouchEvent) => {
      const dx = Math.abs(e.touches[0].clientX - x0);
      const dy = Math.abs(e.touches[0].clientY - y0);
      if (dx > 12 && dx > dy) {
        stopped = true;
        pause();
      }
    };
    el.addEventListener("touchstart", down, { passive: true });
    el.addEventListener("touchmove", move, { passive: true });
    return () => {
      io.disconnect();
      pause();
      el.removeEventListener("touchstart", down);
      el.removeEventListener("touchmove", move);
    };
  }, []);
  return (
    // `relative`: children measure offsetLeft from this row, not from a far ancestor.
    <div ref={ref} className={`relative ${className ?? ""}`}>
      {children}
    </div>
  );
}
