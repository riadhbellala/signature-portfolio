"use client";

import { useEffect, useRef } from "react";

/**
 * Phones: while this row is on screen, it slides to the next picture every 2.6 s, then back to
 * the first. A touch hands control to the visitor (auto-scroll stops for that row). Off with
 * reduced motion.
 */
export function AutoScroll({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: number | undefined;
    let stopped = false;
    const step = () => {
      const items = Array.from(el.children) as HTMLElement[];
      const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
      const next = items.find((c) => c.offsetLeft - pad > el.scrollLeft + 4);
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      el.scrollTo({ left: !next || atEnd ? 0 : next.offsetLeft - pad, behavior: "smooth" });
    };
    const start = () => {
      if (stopped || timer) return;
      timer = window.setInterval(step, 2600);
    };
    const pause = () => {
      window.clearInterval(timer);
      timer = undefined;
    };
    const io = new IntersectionObserver(([e]) => (e.intersectionRatio >= 0.6 ? start() : pause()), { threshold: [0, 0.6] });
    io.observe(el);
    const takeOver = () => {
      stopped = true;
      pause();
    };
    el.addEventListener("touchstart", takeOver, { passive: true });
    return () => {
      io.disconnect();
      pause();
      el.removeEventListener("touchstart", takeOver);
    };
  }, []);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
