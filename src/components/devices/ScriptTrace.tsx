import clsx from "clsx";

/**
 * The giant hairline script stroke that sits behind Signature's posts: one looping,
 * single-weight line, cropped by the frame, one tone off the ground (sand on cream,
 * cream 10% on teal). It is a gesture, not lettering: never set the logo with a font.
 * Place inside a <Section> (which clips it). Decorative: hidden from assistive tech.
 */
const PATH = [
  // entry swash rising from the lower left
  "M-60 900 C 80 760, 260 560, 470 330",
  // big upper bowl of the S, looping back over itself
  "C 600 190, 690 40, 600 10 C 470 -30, 300 90, 290 240",
  // spine of the S
  "C 280 400, 520 470, 640 610 C 780 770, 720 1010, 520 1080",
  // lower bowl curling into a small loop
  "C 330 1150, 170 1060, 210 950 C 250 840, 420 860, 450 980",
  // exit stroke running off the frame
  "C 480 1100, 420 1260, 300 1400",
].join(" ");

export interface ScriptTraceProps {
  className?: string;
  /** Mirror horizontally. */
  flip?: boolean;
}

export function ScriptTrace({ className, flip }: ScriptTraceProps) {
  return (
    <svg
      viewBox="-60 -40 860 1440"
      preserveAspectRatio="xMidYMid meet"
      className={clsx("pointer-events-none absolute text-trace", flip && "-scale-x-100", className)}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d={PATH} stroke="currentColor" strokeWidth={1.5} vectorEffect="non-scaling-stroke" strokeLinecap="round" />
    </svg>
  );
}
