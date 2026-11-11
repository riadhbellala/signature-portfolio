"use client";

import clsx from "clsx";
import { motion, useInView, useReducedMotion } from "motion/react";
import { useId, useRef } from "react";

/**
 * Build the loop once: a prolate cycloid (one loop) with a downward drift, sampled and
 * smoothed into cubic Béziers. Deterministic, so server and client render the same path.
 */
function loopPath(): { d: string; w: number; h: number } {
  const r = 46;
  const d = 92;
  const drift = 30;
  const pts: [number, number][] = [];
  const t0 = -Math.PI * 1.15;
  const t1 = Math.PI * 1.55;
  const n = 48;
  for (let i = 0; i <= n; i++) {
    const t = t0 + ((t1 - t0) * i) / n;
    pts.push([r * t - d * Math.sin(t), r - d * Math.cos(t) + drift * t]);
  }
  const minX = Math.min(...pts.map((p) => p[0]));
  const minY = Math.min(...pts.map((p) => p[1]));
  const m = 4;
  const P = pts.map(([x, y]) => [x - minX + m, y - minY + m] as [number, number]);
  const f = (n: number) => Math.round(n * 10) / 10;
  let path = `M${f(P[0][0])} ${f(P[0][1])}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[i - 1] ?? P[i];
    const p1 = P[i];
    const p2 = P[i + 1];
    const p3 = P[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    path += ` C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  }
  return {
    d: path,
    w: Math.ceil(Math.max(...P.map((p) => p[0])) + m),
    h: Math.ceil(Math.max(...P.map((p) => p[1])) + m),
  };
}

const LOOP = loopPath();

export interface DashedLoopProps {
  className?: string;
  /** Mirror horizontally so the loop can travel the other way. */
  flip?: boolean;
  /** Draw once when scrolled into view. Off: drawn from the start. */
  draw?: boolean;
}

/**
 * The thin ochre dashed line that loops once across the "On Recrute!" poster.
 * 2px stroke, 8/8 dash, round caps. Max two per page. Decorative: hidden from assistive tech.
 */
export function DashedLoop({ className, flip, draw = true }: DashedLoopProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();
  const id = useId().replace(/:/g, "");
  // Always render the mask (same markup on server and client); reduced motion or
  // draw={false} simply snaps it to fully drawn.
  const drawn = !draw || reduce || inView;

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${LOOP.w} ${LOOP.h}`}
      width={LOOP.w}
      height={LOOP.h}
      className={clsx("pointer-events-none overflow-visible text-ochre", flip && "-scale-x-100", className)}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <mask id={`loop-${id}`} maskUnits="userSpaceOnUse" style={{ maskType: "alpha" }}>
          <motion.path
            d={LOOP.d}
            stroke="currentColor"
            strokeWidth={8}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: drawn ? 1 : 0 }}
            transition={{ duration: !draw || reduce ? 0 : 0.8, ease: [0.23, 1, 0.32, 1] }}
          />
        </mask>
      </defs>
      <path
        d={LOOP.d}
        stroke="currentColor"
        strokeWidth={2}
        strokeDasharray="8 8"
        strokeLinecap="round"
        mask={`url(#loop-${id})`}
      />
    </svg>
  );
}
