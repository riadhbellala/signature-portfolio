"use client";

import clsx from "clsx";
import { useReducedMotion } from "motion/react";
import Image from "next/image";
import * as React from "react";

/* ------------------------------------------------------------------ */
/*  Icon Folder — adapted from the 21st.dev component to the Signature  */
/*  system: a flat teal (or ochre, when open) file folder with square  */
/*  corners, the project pictures fanned out of it. It pops in when it */
/*  scrolls into view; hover / focus spreads the pictures wider; the   */
/*  hovered picture lifts and shows its label. No glass, no gradients, */
/*  no pills (DESIGN.md).                                               */
/* ------------------------------------------------------------------ */

export type FolderItem = { src: string; label: string };

export type IconFolderProps = {
  index: string;
  title: string;
  /** e.g. "5 projets" */
  count: string;
  items: FolderItem[];
  /** The folder is the selected one: ochre front, items spread. */
  active?: boolean;
  /** Horizontal distance between fanned pictures, px. */
  spread?: number;
  onSelect?: () => void;
  controls?: string;
  className?: string;
};

const EASE = "cubic-bezier(.23,1,.32,1)";

/* Folder outlines with square corners: front pocket has its tab on the left, back plate on the right. */
const pathFront = (w: number, h: number, d: number, tw: number, s: number) =>
  `M0 0L${tw} 0C${tw + s * 0.55} 0 ${tw + s * 0.45} ${d} ${tw + s} ${d}L${w} ${d}L${w} ${h}L0 ${h}Z`;
const pathBack = (w: number, h: number, d: number, tw: number, s: number) => {
  const x = w - tw;
  return `M0 ${d}L${x - s} ${d}C${x - s * 0.45} ${d} ${x - s * 0.55} 0 ${x} 0L${w} 0L${w} ${h}L0 ${h}Z`;
};

function useShape(ref: React.RefObject<HTMLDivElement | null>, make: (w: number, h: number) => string) {
  const [d, setD] = React.useState("");
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setD(make(el.offsetWidth, el.offsetHeight)));
    ro.observe(el);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return d;
}

export function IconFolder({ index, title, count, items, active = false, spread = 64, onSelect, controls, className }: IconFolderProps) {
  const rootRef = React.useRef<HTMLButtonElement>(null);
  const frontRef = React.useRef<HTMLDivElement>(null);
  const backRef = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const [hi, setHi] = React.useState<number | null>(null);
  const reduced = useReducedMotion() ?? false;

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShown(true), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const frontD = useShape(frontRef, (w, h) => pathFront(w, h, 22, Math.round(w * 0.42), 40));
  const backD = useShape(backRef, (w, h) => pathBack(w, h, 22, Math.round(w * 0.4), 40));

  const fan = items.slice(0, 4);
  const n = fan.length;
  const rs = n > 1 ? 22 / (n - 1) : 0;
  const wide = active || hover;
  const on = shown || reduced;

  return (
    <button
      ref={rootRef}
      type="button"
      aria-pressed={active}
      aria-controls={controls}
      aria-label={`${title}, ${count}`}
      onClick={onSelect}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
      onPointerLeave={() => {
        setHover(false);
        setHi(null);
      }}
      className={clsx(
        "relative isolate block h-[280px] w-full cursor-pointer select-none text-left outline-none [-webkit-tap-highlight-color:transparent] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal",
        className,
      )}
      style={{
        zIndex: wide ? 2 : undefined,
        opacity: on ? 1 : 0,
        transform: on ? (wide ? "translateY(-6px)" : "none") : "translateY(34px) scale(.94)",
        transition: reduced ? "none" : `transform .8s ${EASE}, opacity .5s ease`,
      }}
    >
      {/* back plate */}
      <div ref={backRef} className={clsx("absolute inset-x-0 bottom-0 top-[14px]", active ? "bg-ochre-deep" : "bg-teal-deep")} style={{ clipPath: backD ? `path('${backD}')` : undefined }} />

      {/* fanned project pictures */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {fan.map((item, i) => {
          const k = i - (n - 1) / 2;
          const gap = wide ? spread * 1.2 : spread;
          const y = k * k * 8 - (wide ? 10 : 0);
          const rot = k * rs * (wide ? 1.2 : 1);
          return (
            <div
              key={i}
              className="absolute left-1/2 top-[30px] -ml-[52px] h-[118px] w-[104px]"
              style={{
                zIndex: hi === i ? 5 : undefined,
                opacity: on ? 1 : 0,
                transform: on ? `translate3d(${k * gap}px, ${y}px, 0) rotate(${rot}deg)` : `translate3d(${k * spread * 0.5}px, 70px, 0)`,
                transition: reduced ? "none" : `transform ${wide ? 0.5 : 0.8}s ${EASE}, opacity .4s`,
                transitionDelay: reduced ? "0s" : wide ? `${i * 0.035}s` : `${0.3 + i * 0.07}s`,
              }}
            >
              <div
                className="pointer-events-auto relative h-full w-full border-[3px] border-cream bg-sand shadow-[0_14px_28px_-14px_var(--color-teal-deep)]"
                onPointerEnter={(e) => e.pointerType === "mouse" && setHi(i)}
                onPointerLeave={() => setHi((h) => (h === i ? null : h))}
                style={{
                  transform: hi === i ? `translateY(-22px) rotate(${-rot}deg) scale(1.08)` : "none",
                  transition: reduced ? "none" : `transform .4s ${EASE}`,
                }}
              >
                <Image src={item.src} alt="" fill sizes="110px" className="object-cover" />
                <span
                  className="pointer-events-none absolute bottom-full left-1/2 mb-2 whitespace-nowrap bg-teal px-2 py-1 font-sans text-meta text-cream"
                  style={{
                    opacity: hi === i ? 1 : 0,
                    transform: `translateX(-50%) translateY(${hi === i ? 0 : 6}px)`,
                    transition: reduced ? "none" : `opacity .2s ease, transform .3s ${EASE}`,
                  }}
                >
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* front pocket */}
      <div
        ref={frontRef}
        className={clsx(
          "absolute inset-x-0 bottom-0 h-[168px] transition-[background-color,color,transform] duration-300",
          active ? "bg-ochre text-teal" : "bg-teal text-cream",
        )}
        style={{
          clipPath: frontD ? `path('${frontD}')` : undefined,
          transform: wide ? "translateY(6px)" : "none",
          transitionTimingFunction: EASE,
        }}
      >
        <span className={clsx("block px-5 pt-9 font-sans text-meta tabular", active ? "text-teal" : "text-cream-muted")}>({index})</span>
        <span className="mt-1 block px-5 font-display text-h3">{title}</span>
        <span className={clsx("absolute bottom-4 right-5 font-sans text-small tabular", active ? "text-teal" : "text-cream-muted")}>{count}</span>
      </div>
    </button>
  );
}

export default IconFolder;
