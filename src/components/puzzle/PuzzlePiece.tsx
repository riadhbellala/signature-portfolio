import clsx from "clsx";
import { useId, type CSSProperties, type ReactNode } from "react";
import { puzzlePath, stripPath, THICKNESS, UNIT, type Edge, type Edges } from "./geometry";

export type { Edge, Edges };
export { puzzlePath };

export type PieceTone = "teal" | "ochre" | "cream" | "sand";

/** Room around the body for tabs, thickness and shadow (as in the client's source SVGs). */
const PAD = 380;

const FACE: Record<PieceTone, string> = { teal: "fill-teal text-teal", ochre: "fill-ochre text-ochre", cream: "fill-cream text-cream", sand: "fill-sand text-sand" };
const SIDE: Record<PieceTone, string> = { teal: "fill-teal-deep", ochre: "fill-ochre-deep", cream: "fill-cream-deep", sand: "fill-sand-deep" };
/** The shadow takes the piece's own colour on paper; a light piece on teal casts a deep-teal one. */
const SHADOW: Record<PieceTone, string> = { teal: "fill-teal", ochre: "fill-ochre-deep", cream: "fill-teal-deep", sand: "fill-sand-deep" };
export const INK: Record<PieceTone, string> = {
  teal: "tone-ink-teal text-cream",
  ochre: "tone-ink-ochre text-teal",
  cream: "tone-ink-cream text-teal",
  sand: "tone-ink-cream text-teal",
};

/** Slices of the side, stacked downwards to build the thickness. */
const SLICES = Array.from({ length: 12 }, (_, i) => ((i + 1) * THICKNESS * UNIT) / 12);

const svgClass = "pointer-events-none absolute overflow-visible transition-[fill,color] duration-[var(--dur-ui)] ease-[var(--ease-out-quint)]";

/** Where the artwork frame sits relative to a body of w × h units, in % of that body. */
export function frameStyle(w: number, h: number): CSSProperties {
  return {
    left: `${(-PAD / w) * 100}%`,
    top: `${(-PAD / h) * 100}%`,
    width: `${((w + 2 * PAD) / w) * 100}%`,
    height: `${((h + 2 * PAD) / h) * 100}%`,
  };
}
export const frameViewBox = (w: number, h: number) => `${-PAD} ${-PAD} ${w + 2 * PAD} ${h + 2 * PAD}`;

function ShadowFilter({ id }: { id: string }) {
  return (
    <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="26" />
    </filter>
  );
}

function BevelFilter({ id }: { id: string }) {
  return (
    <filter id={id} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
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
  );
}

export interface SurfaceProps {
  /** Path in body units, body = (0,0)–(w,h). */
  d: string;
  w: number;
  h: number;
  tone: PieceTone;
  shadow?: boolean;
  /** "base": shadow and side; "face": the face only; "shadow": the shadow only; "all": both layers. */
  layer?: "all" | "base" | "face" | "shadow";
  image?: { src: string | null };
}

/**
 * Draws any Signature piece shape: soft shadow and side (base), then the bevelled face, each in
 * its own absolutely positioned SVG so that in a group every base sits under every face.
 * Place inside a relatively positioned box whose size is the body.
 */
export function PieceSurface({ d, w, h, tone, shadow = true, layer = "all", image }: SurfaceProps) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const viewBox = frameViewBox(w, h);
  const style = frameStyle(w, h);
  const base = layer !== "face";
  const face = layer === "all" || layer === "face";
  return (
    <>
      {base ? (
        <svg viewBox={viewBox} className={clsx(svgClass, "z-0", FACE[tone])} style={style} aria-hidden="true" focusable="false">
          <defs>
            <ShadowFilter id={`${id}s`} />
          </defs>
          {shadow ? <path d={d} transform="translate(18 78)" opacity="0.3" filter={`url(#${id}s)`} className={SHADOW[tone]} /> : null}
          {layer !== "shadow" ? (
            <g className={SIDE[tone]}>
              {SLICES.map((y) => (
                <path key={y} d={d} transform={`translate(0 ${y})`} />
              ))}
            </g>
          ) : null}
        </svg>
      ) : null}
      {face ? (
        <svg viewBox={viewBox} className={clsx(svgClass, "z-[1]", FACE[tone])} style={style} aria-hidden="true" focusable="false">
          <defs>
            <BevelFilter id={`${id}b`} />
            {image?.src ? (
              <clipPath id={`${id}c`}>
                <path d={d} />
              </clipPath>
            ) : null}
          </defs>
          {image?.src ? (
            <g filter={`url(#${id}b)`}>
              <g clipPath={`url(#${id}c)`}>
                <path d={d} />
                <image href={image.src} x={-300} y={-300} width={w + 600} height={h + 600} preserveAspectRatio="xMidYMid slice" />
              </g>
            </g>
          ) : (
            <path d={d} filter={`url(#${id}b)`} />
          )}
        </svg>
      ) : null}
    </>
  );
}

export interface PuzzlePieceProps {
  /** Side of the square body in px. Ignored with `fluid`. */
  size?: number;
  edges: Edges;
  tone: PieceTone;
  children?: ReactNode;
  /** Fill the parent's width instead of a fixed px size. The body stays square. */
  fluid?: boolean;
  /** Soft shadow under the piece. Off inside a locked group where a neighbour carries it. */
  shadow?: boolean;
  /** "shadow" draws only the shadow: for a piece whose shadow must sit under its neighbours. */
  layer?: "all" | "shadow";
  /** A picture printed on the face, clipped to the shape. `src: null` keeps the flat face. */
  image?: { src: string | null };
  /** Accessible name when the piece carries no text. */
  label?: string;
  className?: string;
}

/**
 * Keep text out of the piece's own sockets (where a neighbour's knob sits). The index sits
 * top-left, clear of every knob; the label sits at the bottom, so it moves up when the bottom
 * edge is a socket, and then also clears sockets on the left and right.
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
 * A square Signature puzzle piece from the client's artwork (/public/puzzles): organic jigsaw
 * knob, bevelled face on the exact brand colour, darker side, soft shadow.
 * Text on teal is cream; on ochre, cream and sand it is teal.
 */
export function PuzzlePiece({ size = 240, edges, tone, children, fluid, shadow = true, layer = "all", image, label, className }: PuzzlePieceProps) {
  const style: CSSProperties = fluid ? { width: "100%", aspectRatio: "1" } : { width: size, height: size };
  const onlyShadow = layer === "shadow";
  return (
    <div
      // Own compositor layer: the blurred shadow and bevel filters are drawn once, not again on
      // every frame while the page colour fades behind them (smooth on phones).
      className={clsx("relative [transform:translateZ(0)]", className)}
      style={style}
      role={label && !onlyShadow ? "img" : undefined}
      aria-label={onlyShadow ? undefined : label}
      aria-hidden={onlyShadow ? true : undefined}
    >
      <PieceSurface d={puzzlePath(UNIT, edges)} w={UNIT} h={UNIT} tone={tone} shadow={shadow} layer={layer} image={image} />
      {children && !onlyShadow ? (
        <div
          style={contentPadding(edges)}
          className={clsx("relative z-[2] flex h-full flex-col justify-between transition-colors duration-[var(--dur-ui)] ease-[var(--ease-out-quint)]", INK[tone])}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

/**
 * A piece several cells wide that locks under (or over) a row of square pieces: `top` and
 * `bottom` give one edge per cell. Height in cell sides (e.g. 0.6). Width fills the parent.
 */
export function PuzzleStrip({ top, bottom, height, tone, children, className }: { top: Edge[]; bottom: Edge[]; height: number; tone: PieceTone; children?: ReactNode; className?: string }) {
  const w = top.length * UNIT;
  const h = height * UNIT;
  return (
    <div className={clsx("relative [transform:translateZ(0)]", className)} style={{ width: "100%", aspectRatio: `${w} / ${h}` }}>
      <PieceSurface d={stripPath(UNIT, top, bottom, h)} w={w} h={h} tone={tone} />
      {children ? <div className={clsx("relative z-[2] h-full", INK[tone])}>{children}</div> : null}
    </div>
  );
}
