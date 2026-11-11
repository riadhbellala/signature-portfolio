import clsx from "clsx";
import { KNOB_FROM, KNOB_TO, knobPath, REACH } from "./geometry";

export interface PuzzleJointProps {
  /** Which edge of the teal section the knob leaves from. */
  edge?: "top" | "bottom";
  /** Horizontal position of the knob centre, as a CSS length or percentage. */
  at?: string;
  /** Size of the imaginary piece the knob belongs to; same profile as PuzzlePiece. */
  size?: number;
  className?: string;
}

/**
 * The single teal knob where a teal section meets a lighter one: the section itself is the
 * piece. Flat (the section has no bevel), same jigsaw profile as the pieces. Set through
 * <Section tone="teal" joint>. Two per page at most.
 */
export function PuzzleJoint({ edge = "bottom", at = "50%", size = 180, className }: PuzzleJointProps) {
  const w = (KNOB_TO - KNOB_FROM) * size;
  const h = REACH * size;
  // The head is wider than the neck: leave room on both sides so it is not clipped.
  const pad = 0.05 * size;
  return (
    <svg
      viewBox={`${-pad} -1 ${w + 2 * pad} ${h + 1}`}
      width={w + 2 * pad}
      height={h + 1}
      aria-hidden="true"
      focusable="false"
      className={clsx(
        "pointer-events-none absolute z-10 -translate-x-1/2 overflow-visible",
        edge === "bottom" ? "top-full -mt-px" : "bottom-full -mb-px -scale-y-100",
        className,
      )}
      style={{ left: at }}
    >
      {/* 1px overlap into the section so no hairline shows at the seam */}
      <rect x="0" y="-1" width={w} height="1.5" className="fill-teal" />
      <path d={knobPath(size)} className="fill-teal" />
    </svg>
  );
}

/**
 * A flat knob sticking out of the left edge of a button, so the action reads as the piece that
 * completes the page. `size` is the imaginary piece side; fill follows `className`.
 */
export function PuzzleKnobLeft({ size = 80, className }: { size?: number; className?: string }) {
  const w = (KNOB_TO - KNOB_FROM) * size;
  const h = REACH * size;
  const pad = 0.05 * size;
  // knobPath hangs below a flat edge; rotated 90° it points left out of the button's edge.
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width={h + 1}
      height={w + 2 * pad}
      viewBox={`${-h} ${-pad} ${h + 1} ${w + 2 * pad}`}
      className={clsx("pointer-events-none absolute right-full top-1/2 -translate-y-1/2 overflow-visible", className)}
    >
      <g transform="rotate(90)">
        <path d={knobPath(size)} transform={`translate(0 ${-0})`} />
      </g>
    </svg>
  );
}
