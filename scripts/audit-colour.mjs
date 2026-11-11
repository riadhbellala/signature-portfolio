#!/usr/bin/env node
/**
 * Colour audit: fails if any colour literal or off-palette Tailwind colour class appears
 * outside the token files. Run: npm run audit:colour
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC = join(ROOT, "src");
const ALLOWED = new Set(["src/app/globals.css", "src/design/tokens.ts"]);
const EXT = /\.(tsx?|css|mjs|jsx?)$/;

const PALETTE = ["cream", "teal", "ochre", "sand", "teal-muted", "cream-muted", "rule", "rule-on-teal", "trace-on-teal", "surface", "ink", "ink-muted", "line", "trace", "focus", "accent", "on-accent", "transparent", "current", "inherit"];
const COLOUR_UTIL = "(?:bg|text|border(?:-[trblxy])?|fill|stroke|outline|ring|decoration|divide|caret|accent|placeholder|from|to|via|shadow)";

const checks = [
  { name: "hex colour", re: /(?<![\w&/-])#[0-9a-fA-F]{3,8}\b/g },
  { name: "rgb()/hsl()/oklch()", re: /\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/g },
  { name: "named CSS colour", re: /(?:color|fill|stroke|background)\s*[:=]\s*["']?(?:white|black|red|green|blue|gray|grey|purple|yellow|orange)\b/gi },
  {
    name: "off-palette colour class",
    re: new RegExp(`\\b${COLOUR_UTIL}-(?!(?:${PALETTE.join("|")})\\b)(?:[a-z]+-\\d{2,3}|white|black|\\[#|\\[rgb|\\[hsl)`, "g"),
  },
];

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXT.test(f)) out.push(p);
  }
  return out;
}

let problems = 0;
for (const file of walk(SRC)) {
  const rel = relative(ROOT, file);
  if (ALLOWED.has(rel)) continue;
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    for (const { name, re } of checks) {
      re.lastIndex = 0;
      const m = line.match(re);
      if (m) {
        problems++;
        console.log(`${rel}:${i + 1}  ${name}: ${m.join(", ")}`);
      }
    }
  });
}

if (problems) {
  console.error(`\n✗ colour audit: ${problems} problem(s). Use the tokens in DESIGN.md.`);
  process.exit(1);
}
console.log("✓ colour audit: only tokens in use (cream, teal, ochre and their tonal steps).");
