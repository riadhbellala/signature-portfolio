import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { gridEdges, knobPoints, opposite, puzzlePath, REACH, type Edge, type Edges, type Side } from "./geometry";

const S = 1000;
const sides: Side[] = ["top", "right", "bottom", "left"];
const flat: Edges = { top: "flat", right: "flat", bottom: "flat", left: "flat" };

/** Every SVG the client supplied under /public/puzzles. */
function suppliedFiles(dir = join(process.cwd(), "public/puzzles"), out: string[] = []): string[] {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) suppliedFiles(p, out);
    else if (f.endsWith(".svg")) out.push(p);
  }
  return out;
}

const word: Record<string, Edge> = { flat: "flat", tab: "tab", socket: "blank" };

function reflect([x, y]: readonly [number, number], side: Side): [number, number] {
  if (side === "top") return [x, -y];
  if (side === "bottom") return [x, 2 * S - y];
  if (side === "left") return [-x, y];
  return [2 * S - x, y];
}

describe("puzzlePath", () => {
  it("draws a plain square when every edge is flat", () => {
    expect(puzzlePath(S, flat)).toBe(`M0 0 L${S} 0 L${S} ${S} L0 ${S} L0 0 Z`);
  });

  const files = suppliedFiles();
  it("finds the supplied artwork", () => {
    expect(files.length).toBeGreaterThanOrEqual(60);
  });

  it.each(files.map((f) => [f.split("public/puzzles/")[1], f]))("reproduces the supplied path exactly: %s", (_name, file) => {
    const svg = readFileSync(file, "utf8");
    const [, t, r, b, l] = svg.match(/edges t\/r\/b\/l: (\w+) \/ (\w+) \/ (\w+) \/ (\w+)/)!;
    const d = svg.match(/ d="([^"]+)"/)![1];
    expect(puzzlePath(S, { top: word[t], right: word[r], bottom: word[b], left: word[l] })).toBe(d);
  });

  it.each(sides)("tab and socket on the %s side are mirror images across the edge", (side) => {
    const tab = knobPoints(S, side, "tab")!;
    const socket = knobPoints(S, side, "blank")!;
    tab.forEach((p, i) => {
      const [x, y] = reflect(p, side);
      expect(socket[i][0]).toBeCloseTo(x, 3);
      expect(socket[i][1]).toBeCloseTo(y, 3);
    });
  });

  it("a right tab locks exactly into the left socket of the piece next to it", () => {
    const tab = knobPoints(S, "right", "tab")!;
    // The neighbour sits one body to the right and is walked in the opposite direction.
    const socket = knobPoints(S, "left", "blank")!.map(([x, y]) => [x + S, y]).reverse();
    expect(socket).toEqual(tab.map((p) => [...p]));
  });

  it("a bottom tab locks exactly into the top socket of the piece below", () => {
    const tab = knobPoints(S, "bottom", "tab")!;
    const socket = knobPoints(S, "top", "blank")!.map(([x, y]) => [x, y + S]).reverse();
    expect(socket).toEqual(tab.map((p) => [...p]));
  });

  it("scales with size and a tab reaches 0.3 of the size past the edge", () => {
    const xs = knobPoints(200, "right", "tab")!.map((p) => p[0]);
    expect(Math.max(...xs)).toBeCloseTo(200 + REACH * 200, 6);
  });
});

describe("gridEdges", () => {
  it("gives every inner joint a tab on one side and a socket on the other, and flat outer edges", () => {
    const rows = 3;
    const cols = 4;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const e = gridEdges(r, c, rows, cols);
        if (r === 0) expect(e.top).toBe("flat");
        if (c === 0) expect(e.left).toBe("flat");
        if (r === rows - 1) expect(e.bottom).toBe("flat");
        if (c === cols - 1) expect(e.right).toBe("flat");
        if (c < cols - 1) {
          expect(["tab", "blank"]).toContain(e.right);
          expect(gridEdges(r, c + 1, rows, cols).left).toBe(opposite(e.right));
        }
        if (r < rows - 1) expect(gridEdges(r + 1, c, rows, cols).top).toBe(opposite(e.bottom));
      }
    }
  });

  it("keeps the edge flat next to an empty cell in a short last row", () => {
    expect(gridEdges(2, 0, 3, 3, { row: 2, cols: 1 }).right).toBe("flat");
    expect(gridEdges(1, 1, 3, 3, { row: 2, cols: 1 }).bottom).toBe("flat");
    expect(gridEdges(1, 0, 3, 3, { row: 2, cols: 1 }).bottom).not.toBe("flat");
  });
});
