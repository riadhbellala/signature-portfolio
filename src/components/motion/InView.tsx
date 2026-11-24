"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

/**
 * Scroll reveal, once. Sets data-in when the element enters the viewport; the motion itself is CSS
 * (globals.css, [data-reveal]) so it runs on the compositor:
 * - "mask": the frame opens from the bottom (clip-path) while the picture inside settles from a
 *   slight zoom (image pan);
 * - "up": fade + 24px slide up. `delay` (ms) staggers siblings.
 */
export function InView({
  as: Tag = "div",
  kind = "up",
  delay = 0,
  className,
  style,
  children,
}: {
  as?: ElementType;
  kind?: "mask" | "up";
  delay?: number;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          el.dataset.in = "";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} data-reveal={kind} className={className} style={{ ...style, "--d": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}
