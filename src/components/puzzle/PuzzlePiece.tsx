import clsx from "clsx";
import { useId, type CSSProperties, type ReactNode } from "react";
import { puzzlePath, THICKNESS, UNIT, type Edge, type Edges } from "./geometry";

export type { Edge, Edges };
export { puzzlePath };

export type PieceTone = "teal" | "ochre" | "cream";

export interface PuzzlePieceProps {
  /** Side of the square body in px. Ignored with `fluid`. */
  size?: number;
  edges: Edges;
  tone: PieceTone;
  children?: ReactNode;
  /** Fill the parent's width instead of a fixed px size. The body stays square. */
  fluid?: boolean;
  /**
   * Soft shadow under the piece. Leave on for a piece lying alone; turn off inside a locked
   * group (pieces at the same level do not shade each other) and give the group one shadow.
   */
  shadow?: boolean;
  /** "shadow" draws only the shadow: for a piece whose shadow must sit under its neighbours. */
  layer?: "all" | "shadow";
  /** Accessible name when the piece carries no text. */
  label?: string;
  className?: string;
}

/** Artwork frame: the body plus room for tabs, thickness and shadow (as in the source SVGs). */
const PAD = 380;
const BOX = UNIT + 2 * PAD;
const frame: CSSProperties = {
  left: `${(-PAD / UNIT) * 100}%`,
  top: `${(-PAD / UNIT) * 100}%`,
  width: `${(BOX / UNIT) * 100}%`,
  height: `${(BOX / UNIT) * 100}%`,
};

const FACE: Record<PieceTone, string> = { teal: "fill-teal text-teal", ochre: "fill-ochre text-ochre", cream: "fill-cream text-cream" };
const SIDE: Record<PieceTone, string> = { teal: "fill-teal-deep", ochre: "fill-ochre-deep", cream: "fill-cream-deep" };
/** The shadow takes the piece's own colour on paper; a light piece on teal casts a deep-teal one. */
const SHADOW: Record<PieceTone, string> = { teal: "fill-teal", ochre: "fill-ochre-deep", cream: "fill-teal-deep" };
const INK: Record<PieceTone, string> = {
  teal: "tone-ink-teal text-cream",
  ochre: "tone-ink-ochre text-teal",
  cream: "tone-ink-cream text-teal",
};

/** Slices of the side, stacked downwards to build the thickness. */
const SLICES = Array.from({ length: 12 }, (_, i) => ((i + 1) * THICKNESS * UNIT) / 12);

/**
 * Keep text out of the piece's own sockets (where a neighbour's knob sits). The index sits
 * top-left, clear of every knob; the label sits at the bottom, so it moves up when the bottom
 * edge is a socket, and then also clears sockets on the left and right (the knob band is
 * 0.35–0.65 of the side, 0.3 deep).
 */
function contentPadding(edges: Edges): CSSProperties {
  const base = 12;
  const clear = 33;
  const raised = edges.bottom === "blank";
  return {
    paddingTop: `${base}%`,
    paddingBottom: `${raised ? clear : base}%`,
    paddingLeft: `${raised && edges.left === "blank" ? clear : base}%`,
    paddingRight: `${raised && edges.right === "blank" ? clear : base}%`,
  };
}

/**
 * A Signature puzzle piece, drawn from the client's own artwork (/public/puzzles): the organic
 * jigsaw knob, a bevelled face on the exact brand colour, a thin darker side and a soft shadow
 * in the piece's own colour. Two stacked layers (base, then face) so that in a group every base
 * sits under every face. Text on teal is cream; on ochre and cream it is teal.
 */
export function PuzzlePiece({ size = 240, edges, tone, children, fluid, shadow = true, layer = "all", label, className }: PuzzlePieceProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const d = puzzlePath(UNIT, edges);
  const style: CSSProperties = fluid ? { width: "100%", aspectRatio: "1" } : { width: size, height: size };
  const viewBox = `${-PAD} ${-PAD} ${BOX} ${BOX}`;
  const svg = "pointer-events-none absolute overflow-visible transition-[fill,color] duration-[var(--dur-ui)] ease-[var(--ease-out-quint)]";

  if (layer === "shadow") {
    return (
      <div className={clsx("relative", className)} style={style} aria-hidden="true">
        <svg viewBox={viewBox} className={clsx(svg, FACE[tone])} style={frame} focusable="false">
          <defs>
            <filter id={`${id}s`} x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="26" />
            </filter>
          </defs>
          <path d={d} transform="translate(18 78)" opacity="0.3" filter={`url(#${id}s)`} className={SHADOW[tone]} />
        </svg>
      </div>
    );
  }

  return (
    <div className={clsx("relative", className)} style={style} role={label ? "img" : undefined} aria-label={label}>
      {/* Base layer: shadow, then the side. */}
      <svg viewBox={viewBox} className={clsx(svg, "z-0", FACE[tone])} style={frame} aria-hidden="true" focusable="false">
        <defs>
          <filter id={`${id}s`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
        </defs>
        {shadow ? <path d={d} transform="translate(18 78)" opacity="0.3" filter={`url(#${id}s)`} className={SHADOW[tone]} /> : null}
        <g className={SIDE[tone]}>
          {SLICES.map((y) => (
            <path key={y} d={d} transform={`translate(0 ${y})`} />
          ))}
        </g>
      </svg>

      {/* Face layer: flat brand colour, lit by the bevel filter at the edges only. */}
      <svg viewBox={viewBox} className={clsx(svg, "z-[1]", FACE[tone])} style={frame} aria-hidden="true" focusable="false">
        <defs>
          <filter id={`${id}b`} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
            <feGaussianBlur in="SourceAlpha" stdDeviation="14" result="blur" />
            <feSpecularLighting in="blur" surfaceScale="5" specularConstant="0.7" specularExponent="64" result="spec" style={{ lightingColor: "var(--puzzle-light)" }}>
              <feDistantLight azimuth="225" elevation="48" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn" />
            <feDiffuseLighting in="blur" surfaceScale="5" diffuseConstant="1" result="diff" style={{ lightingColor: "var(--puzzle-light)" }}>
              <feDistantLight azimuth="225" elevation="58" />
            </feDiffuseLighting>
            {/* flat diffuse = sin(58°) = 0.848, so k1 = 1 / 0.848 keeps the flat face on the exact brand colour */}
            <feComposite in="SourceGraphic" in2="diff" operator="arithmetic" k1="1.179" k2="0" k3="0" k4="0" result="lit" />
            <feComposite in="lit" in2="specIn" operator="arithmetic" k1="0" k2="1" k3="0.5" k4="0" result="out" />
            <feComposite in="out" in2="SourceAlpha" operator="in" />
          </filter>
        </defs>
        <path d={d} filter={`url(#${id}b)`} />
      </svg>

      {children ? (
        <div
          style={contentPadding(edges)}
          className={clsx(
            "relative z-[2] flex h-full flex-col justify-between transition-colors duration-[var(--dur-ui)] ease-[var(--ease-out-quint)]",
            INK[tone],
          )}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}
