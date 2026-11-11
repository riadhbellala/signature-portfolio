/**
 * Token reference for documentation (/styleguide). Values mirror @theme in
 * src/app/globals.css and DESIGN.md; this file and globals.css are the only places
 * hex values may appear (enforced by `npm run audit:colour`).
 */

export const FOUNDATION = [
  {
    token: "--color-cream",
    name: "Crème",
    hex: "#F5EBD9",
    share: 60,
    swatch: "bg-cream",
    role: "Le papier des posts et du logo. Fond de page.",
  },
  {
    token: "--color-teal",
    name: "Teal",
    hex: "#245056",
    share: 30,
    swatch: "bg-teal",
    role: "Tout le texte sur crème, les titres, la pièce teal, les sections pleines teal.",
  },
  {
    token: "--color-ochre",
    name: "Ocre",
    hex: "#E9B248",
    share: 10,
    swatch: "bg-ochre",
    role: "La pièce ocre, la ligne pointillée, le contour décalé, puces, filets, bouton principal.",
  },
] as const;

export const TONAL = [
  { token: "--color-sand", hex: "#E9D4BB", swatch: "bg-sand", from: "Papier sombre de l’affiche", use: "Encarts, emplacements d’image, tracé script sur crème" },
  { token: "--color-teal-muted", hex: "#3D6366", swatch: "bg-teal-muted", from: "Teal à 88 % sur crème", use: "Texte secondaire sur crème et sable" },
  { token: "--color-cream-muted", hex: "#BAC0B4", swatch: "bg-cream-muted", from: "Crème à 72 % sur teal", use: "Texte secondaire sur teal" },
  { token: "--color-rule", hex: "#D4D2C4", swatch: "bg-rule", from: "Teal à 16 % sur crème", use: "Filets 1px sur crème" },
  { token: "--color-rule-on-teal", hex: "#4A6C6E", swatch: "bg-rule-on-teal", from: "Crème à 18 % sur teal", use: "Filets 1px sur teal" },
  { token: "--color-trace-on-teal", hex: "#396063", swatch: "bg-trace-on-teal", from: "Crème à 10 % sur teal", use: "Tracé script en fond des sections teal" },
  { token: "--color-teal-deep", hex: "#18363A", swatch: "bg-teal-deep", from: "Teal à 68 % de lumière", use: "Tranche des pièces teal, ombre des pièces crème" },
  { token: "--color-ochre-deep", hex: "#9E7931", swatch: "bg-ochre-deep", from: "Ocre à 68 % de lumière", use: "Tranche et ombre des pièces ocre" },
  { token: "--color-cream-deep", hex: "#A7A094", swatch: "bg-cream-deep", from: "Crème à 68 % de lumière", use: "Tranche des pièces crème" },
  { token: "--color-sand-deep", hex: "#BFAE99", swatch: "bg-sand-deep", from: "Sable à 82 %", use: "Tranche des pièces sable (projets en attente d’image)" },
] as const;

/** WCAG 2.x contrast ratios, computed from the hex values above. */
export const CONTRAST = [
  { fg: "Teal", bg: "Crème", ratio: 7.54, use: "Texte courant, titres", pass: "AAA" },
  { fg: "Crème", bg: "Teal", ratio: 7.54, use: "Texte sur sections teal", pass: "AAA" },
  { fg: "Teal", bg: "Ocre", ratio: 4.64, use: "Bouton principal, texte dans la pièce ocre", pass: "AA" },
  { fg: "Ocre", bg: "Teal", ratio: 4.64, use: "Titres et libellés courts sur teal", pass: "AA" },
  { fg: "Teal", bg: "Sable", ratio: 6.19, use: "Texte sur encarts", pass: "AA" },
  { fg: "Teal atténué", bg: "Crème", ratio: 5.6, use: "Texte secondaire", pass: "AA" },
  { fg: "Teal atténué", bg: "Sable", ratio: 4.6, use: "Texte secondaire sur encarts", pass: "AA" },
  { fg: "Crème atténuée", bg: "Teal", ratio: 4.79, use: "Texte secondaire sur teal", pass: "AA" },
  { fg: "Ocre", bg: "Crème", ratio: 1.63, use: "Jamais de texte. Ligne, contour, puce ou fond seulement", pass: "Échec" },
] as const;

export const SPACING = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 160] as const;
