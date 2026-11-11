/**
 * Puzzle geometry. Pure functions, no React, so it can be unit-tested.
 *
 * The knob is Signature's own jigsaw profile, taken from the client's SVG pieces in
 * /public/puzzles: an organic neck and head on the middle of the edge. On a 1000-unit body
 * the knob spans 350–650 along the edge and reaches 300 units out. A socket is the exact
 * mirror of a tab across the edge, so two pieces of the same size lock with no gap.
 * `puzzlePath(1000, edges)` reproduces the `d` of the supplied files exactly (see the test).
 */

export type Edge = "flat" | "tab" | "blank";
export type Side = "top" | "right" | "bottom" | "left";
export interface Edges {
  top: Edge;
  right: Edge;
  bottom: Edge;
  left: Edge;
}

/** Design units of the source artwork. */
export const UNIT = 1000;
/** Where the knob starts and ends along the edge, as fractions of the side. */
export const KNOB_FROM = 0.35;
export const KNOB_TO = 0.65;
/** How far a tab reaches past the body edge, as a fraction of size. */
export const REACH = 0.3;
/** Thickness of the piece's side below the face, as a fraction of size. */
export const THICKNESS = 0.048;

/**
 * The tab profile in edge-local units: [along the edge, outward from the edge].
 * Four cubic Béziers from (350, 0) to (650, 0); each row is c1, c2, end.
 */
const PROFILE: readonly (readonly [number, number])[][] = [
  [[420, 0], [430, 35], [400, 80]],
  [[370, 130], [330, 300], [500, 300]],
  [[670, 300], [630, 130], [600, 80]],
  [[570, 35], [580, 0], [650, 0]],
];

type Vec = readonly [number, number];

/** Corners walked clockwise (screen coordinates, y down), with each side's outward normal. */
const SIDES: Record<Side, { from: Vec; dir: Vec; out: Vec }> = {
  top: { from: [0, 0], dir: [1, 0], out: [0, -1] },
  right: { from: [1, 0], dir: [0, 1], out: [1, 0] },
  bottom: { from: [1, 1], dir: [-1, 0], out: [0, 1] },
  left: { from: [0, 1], dir: [0, -1], out: [-1, 0] },
};

const ORDER: Side[] = ["top", "right", "bottom", "left"];

const round = (n: number) => Math.round(n * 1000) / 1000 + 0; // +0 turns -0 into 0

/** A point given in edge-local design units, placed on one side of a piece of `size`. */
export function edgePoint(size: number, side: Side, edge: Edge, along: number, outward: number): Vec {
  const { from, dir, out } = SIDES[side];
  const k = size / UNIT;
  const sign = edge === "blank" ? -1 : 1;
  return [
    round(from[0] * size + dir[0] * along * k + out[0] * outward * sign * k),
    round(from[1] * size + dir[1] * along * k + out[1] * outward * sign * k),
  ];
}

/** Every control and end point of the knob on one side, in walking order. `null` if flat. */
export function knobPoints(size: number, side: Side, edge: Edge): Vec[] | null {
  if (edge === "flat") return null;
  return [
    edgePoint(size, side, edge, KNOB_FROM * UNIT, 0),
    ...PROFILE.flat().map(([a, o]) => edgePoint(size, side, edge, a, o)),
  ];
}

function edgeSegment(size: number, side: Side, edge: Edge): string {
  const end = edgePoint(size, side, "flat", UNIT, 0);
  const line = `L${end[0]} ${end[1]}`;
  if (edge === "flat") return line;
  const start = edgePoint(size, side, edge, KNOB_FROM * UNIT, 0);
  const curves = PROFILE.map((seg) => `C${seg.map(([a, o]) => edgePoint(size, side, edge, a, o).join(" ")).join(" ")}`);
  return [`L${start[0]} ${start[1]}`, ...curves, line].join(" ");
}

/**
 * SVG path of a piece whose body is the square (0,0)–(size,size).
 * Tabs extend up to `REACH * size` outside that square.
 */
export function puzzlePath(size: number, edges: Edges): string {
  return `M0 0 ${ORDER.map((side) => edgeSegment(size, side, edges[side])).join(" ")} Z`;
}

/** Path of the knob alone, hanging below a flat edge at y = 0: the section joint. */
export function knobPath(size: number): string {
  const pts = PROFILE.map((seg) => `C${seg.map(([a, o]) => `${round(((a - 350) * size) / UNIT)} ${round((o * size) / UNIT)}`).join(" ")}`);
  return `M0 0 ${pts.join(" ")} Z`;
}

export const opposite = (e: Edge): Edge => (e === "tab" ? "blank" : e === "blank" ? "tab" : "flat");

/**
 * Edges for a cell in an interlocking grid. Inner edges alternate in a checkerboard
 * so every neighbour pair is tab/socket; outer edges are flat.
 * `last` describes a short final row, so edges next to an empty cell stay flat.
 */
export function gridEdges(row: number, col: number, rows: number, cols: number, last?: { row: number; cols: number }): Edges {
  const exists = (r: number, c: number) => {
    if (r < 0 || c < 0 || r >= rows || c >= cols) return false;
    if (last && r === last.row && c >= last.cols) return false;
    return true;
  };
  // Horizontal joint between (r,c) and (r,c+1): tab on the left piece when (r+c) is even.
  const hJoint = (r: number, c: number): Edge => ((r + c) % 2 === 0 ? "tab" : "blank");
  // Vertical joint between (r,c) and (r+1,c): tab on the upper piece when (r+c) is odd.
  const vJoint = (r: number, c: number): Edge => ((r + c) % 2 === 1 ? "tab" : "blank");
  return {
    top: exists(row - 1, col) ? opposite(vJoint(row - 1, col)) : "flat",
    right: exists(row, col + 1) ? hJoint(row, col) : "flat",
    bottom: exists(row + 1, col) ? vJoint(row, col) : "flat",
    left: exists(row, col - 1) ? opposite(hJoint(row, col - 1)) : "flat",
  };
}

/**
 * A rectangular piece several cells wide: `top` and `bottom` give one edge per cell (left to
 * right), so it locks under or over a row of square pieces. Sides are flat. `height` is in the
 * same units as a cell side (UNIT = one cell). Body: (0,0)–(cells × size, height × size / UNIT).
 */
export function stripPath(size: number, top: Edge[], bottom: Edge[], height: number): string {
  const k = size / UNIT;
  const W = top.length * size;
  const H = height * k;
  const segs = (from: Vec, dir: Vec, out: Vec, edges: Edge[]) =>
    edges
      .map((edge, i) => {
        const o: Vec = [from[0] + dir[0] * i * size, from[1] + dir[1] * i * size];
        const p = (along: number, outward: number) => {
          const sign = edge === "blank" ? -1 : 1;
          return `${round(o[0] + dir[0] * along * k + out[0] * outward * sign * k)} ${round(o[1] + dir[1] * along * k + out[1] * outward * sign * k)}`;
        };
        const end = `L${p(UNIT, 0)}`;
        if (edge === "flat") return end;
        const curves = PROFILE.map((seg) => `C${seg.map(([a, ou]) => p(a, ou)).join(" ")}`);
        return [`L${p(KNOB_FROM * UNIT, 0)}`, ...curves, end].join(" ");
      })
      .join(" ");
  return [
    "M0 0",
    segs([0, 0], [1, 0], [0, -1], top),
    `L${round(W)} ${round(H)}`,
    segs([W, H], [-1, 0], [0, 1], [...bottom].reverse()),
    "L0 0 Z",
  ].join(" ");
}

/**
 * A rectangular piece w × h (units), one knob centred on each non-flat side. The knob keeps the
 * size it has on a square piece of side min(w, h), so a portrait piece reads as the same family.
 * For w = h = UNIT this is exactly `puzzlePath`.
 */
export function rectPiecePath(w: number, h: number, edges: Edges): string {
  const s = Math.min(w, h);
  const k = s / UNIT;
  const side = (from: Vec, dir: Vec, out: Vec, len: number, edge: Edge) => {
    const end: Vec = [from[0] + dir[0] * len, from[1] + dir[1] * len];
    const line = `L${round(end[0])} ${round(end[1])}`;
    if (edge === "flat") return line;
    const sign = edge === "blank" ? -1 : 1;
    const start = (len - s) / 2; // knob segment of length s, centred
    const p = (along: number, outward: number) =>
      `${round(from[0] + dir[0] * (start + along * k) + out[0] * outward * sign * k)} ${round(from[1] + dir[1] * (start + along * k) + out[1] * outward * sign * k)}`;
    const curves = PROFILE.map((seg) => `C${seg.map(([a, o]) => p(a, o)).join(" ")}`);
    return [`L${p(KNOB_FROM * UNIT, 0)}`, ...curves, line].join(" ");
  };
  return [
    "M0 0",
    side([0, 0], [1, 0], [0, -1], w, edges.top),
    side([w, 0], [0, 1], [1, 0], h, edges.right),
    side([w, h], [-1, 0], [0, 1], w, edges.bottom),
    side([0, h], [0, -1], [-1, 0], h, edges.left),
    "Z",
  ].join(" ");
}
