# DESIGN.md — Signature creative co.

Single source of truth for the Signature Consulting portfolio. Every page and component reads this file. Tokens live in `src/app/globals.css` (`@theme`); the documentation mirror is `src/design/tokens.ts`; the live reference is `/styleguide`. Evidence for every value: `docs/brand-analysis.md`.

The site must look like it came from the same studio as the Instagram posts: warm cream paper, heavy deep-teal Poppins, small ochre details, a giant hairline script trace in the background, and the puzzle piece as the brand device. It must never look like an AI SaaS template.

---

## 1. Colour — three colours, 60 · 30 · 10, nothing else

Hard rule: the whole site uses the three colours of the logo. No fourth hue anywhere: not for hover, errors, links, illustrations. No black, no grey, no purple, no red/green states.

| Share | Token | Value | Role |
|---|---|---|---|
| 60 % | `--color-cream` | `#F5EBD9` | Page background. The flat ground of the logo card and text posts |
| 30 % | `--color-teal` | `#245056` | All text on cream, headlines, the teal puzzle piece, full teal sections |
| 10 % | `--color-ochre` | `#E9B248` | The ochre piece, dashed line, offset outline, bullets, rules, primary button |

Sampling (Pillow, cluster medians): teal confirmed exactly. Ochre corrected from `#EAAD48` to `#E9B248` (solid bullet dots of "On Recrute!"). Cream corrected from `#FBEDD3` to `#F5EBD9` (`#FBEDD3` only exists in the photo-lit poster; every flat graphic post reads `#F5EBD9`).

### Tonal steps (same colours, other strength; not new hues)

| Token | Value | Derived from | Use |
|---|---|---|---|
| `--color-sand` | `#E9D4BB` | Poster shadow paper (sampled) | Inset bands, image placeholders, script trace on cream |
| `--color-teal-muted` | `#3D6366` | Teal 88 % over cream | Secondary text on cream and sand |
| `--color-cream-muted` | `#BAC0B4` | Cream 72 % over teal | Secondary text on teal |
| `--color-rule` | `#D4D2C4` | Teal 16 % over cream | 1px hairlines on cream |
| `--color-rule-on-teal` | `#4A6C6E` | Cream 18 % over teal | 1px hairlines on teal |
| `--color-trace-on-teal` | `#396063` | Cream 10 % over teal | Script trace on teal |
| `--color-teal-deep` | `#18363A` | Teal at 68 % light | Side (thickness) of teal pieces; shadow of cream pieces on teal |
| `--color-ochre-deep` | `#9E7931` | Ochre at 68 % light | Side of ochre pieces and their shadow |
| `--color-cream-deep` | `#A7A094` | Cream at 68 % light | Side of cream pieces |
| `--color-sand-deep` | `#BFAE99` | Sand at 82 % | Side and shadow of sand (placeholder) pieces |

`teal-muted` was briefed at 72 %; that measures 3.90:1 on cream (fails AA). 88 % is the lowest step that passes on both cream and sand.

### Semantic tokens (set by `<Section tone>`)

`surface`, `ink`, `ink-muted`, `line`, `trace`, `focus`. Components use these (`text-ink`, `border-line`, `stroke-surface`), so the same component works on cream, sand and teal.

| Tone | surface | ink | ink-muted | line | trace | focus |
|---|---|---|---|---|---|---|
| cream | cream | teal | teal-muted | rule | sand | teal |
| sand | sand | teal | teal-muted | rule | cream | teal |
| teal | teal | cream | cream-muted | rule-on-teal | trace-on-teal | cream |

Inside a puzzle piece: teal piece → cream ink; ochre piece → teal ink (muted = teal, since teal-muted on ochre fails); cream piece → teal ink.

### Contrast (WCAG 2.x, computed)

| Text | Background | Ratio | Result | Use |
|---|---|---|---|---|
| Teal | Cream | 7.54:1 | AAA | Body, headings |
| Cream | Teal | 7.54:1 | AAA | Text on teal sections |
| Teal | Ochre | 4.64:1 | AA | Primary button, text in the ochre piece |
| Ochre | Teal | 4.64:1 | AA | Headings and short labels on teal |
| Teal | Sand | 6.19:1 | AA | Text on inset bands |
| Teal-muted | Cream | 5.60:1 | AA | Secondary text |
| Teal-muted | Sand | 4.60:1 | AA | Secondary text on bands |
| Cream-muted | Teal | 4.79:1 | AA | Secondary text on teal |
| Ochre | Cream | 1.63:1 | Fail | **Never text.** Line, outline, dot or fill behind teal text only |

### Colour rules

- Ochre budget about 10 % of any screen. One ochre puzzle piece per group. Never two ochre (primary) buttons visible at once.
- No gradients, glow, blurred blobs, glassmorphism. The poster's light ray and the old posts' lamp glow are photo lighting, not brand devices.
- No soft shadows on interface elements. Two things only may cast one: display type (the hard ochre offset outline) and puzzle pieces, which are physical objects (soft shadow in the piece's own deep tone, from the client's artwork).
- `--puzzle-light` (`#fff`) is the light source of the bevel filter. It is a light, not a surface colour: never a fill.
- Errors, success and focus use the same three colours. Focus: 2px outline, 2px offset, teal on cream/sand, cream on teal. Error: teal text with a 2px ochre left rule.
- The logo file keeps its own colours. Never recolour it.
- No dark mode. Teal sections are the dark moments.
- Enforcement: Tailwind's default palette, radii, shadows and blurs are removed in `@theme` (`--color-*: initial` etc.), so off-system classes do not compile. `npm run audit:colour` fails on any hex/rgb/hsl outside `globals.css` and `src/design/tokens.ts`.

---

## 2. Typography

| Role | Token | Font | Spec |
|---|---|---|---|
| Display | `text-display` | Poppins 800 | clamp(56px, 9vw, 140px) / 0.9 / −0.045em. Stacked on 2 lines, sentence case. With ochre offset outline (DisplayTitle) |
| H1 | `text-h1` | Poppins 700 | clamp(40px, 5.5vw, 76px) / 0.95 / −0.035em |
| H2 | `text-h2` | Poppins 700 | clamp(32px, 4vw, 56px) / 1 / −0.03em |
| H3 | `text-h3` | Poppins 700 | 24px / 1.15 / −0.02em |
| List | `text-list` | Poppins 600 | 20–24px / 1.3 / −0.01em. The poster's job list |
| Piece label | `text-piece` | Poppins 600 | 16–22px / 1.15 / −0.01em. Text inside puzzle pieces |
| Button | `text-button` | Poppins 600 | 16px / 1 / −0.01em |
| Lead | `text-lead` | Inter Tight 400 | 18px / 1.55, max 60ch |
| Body | `text-body` | Inter Tight 400/500 | 16px / 1.55, max 60ch (`.measure`) |
| Small | `text-small` | Inter Tight 400 | 14px / 1.45. Captions, specs |
| Meta | `text-meta` | Inter Tight 500 | 12px, uppercase, +0.06em, ink-muted |

- Font decision: Poppins is confirmed by the current posts (01, 04, 05, 06). Body uses Inter Tight because Poppins is too wide for long reading.
- Poppins only ever heavy, tight and large. Never default tracking, never 500 for headings.
- Tabular figures (`.tabular`) for indexes, figures, dates, stats.
- Headline measure 8–14ch (`max-w-[14ch]`), body 60ch max. `text-wrap: balance` on headings.
- The logo is a script image. Never set it in a font.
- No emoji anywhere.

---

## 3. Space and layout

- 4px base. Scale: **4 8 12 16 24 32 48 64 96 128 160** (Tailwind `1 2 3 4 6 8 12 16 24 32 40`). No other values.
- Container `max-w-[var(--page-max)]` (1680px), gutters `--gutter`: 20px mobile, 40px from 768px, 56px from 1024px, 80px from 1536px.
- 12-column grid (4 on phones), 24px column gap (`<Grid>`).
- Section padding: `full` 80 / 96 / 128px, `compact` 64 / 80 / 96px (project sections, services, clients). Mobile / tablet / desktop.
- Left-aligned on the grid, like the poster: headline top-left, list bottom-left. Centre at most one moment per page.
- One idea per screen. Big open paper around the headline.
- Rhythm: mostly cream, sand for inset bands, full teal sections to break the page. Never two teal sections in a row.

---

## 4. Radius

| Token | Value | Use |
|---|---|---|
| (none) | 0 | Everything: buttons, cards, images, inputs, tiles, tags |
| `rounded-xs` | 2px | Input fields only, if needed |
| `rounded-full` | 50 % | Puzzle knobs and 8px bullet dots only |

All other radius utilities are removed from the theme. No pills, no rounded cards. The knob is the only real curve on the site, so it reads as the brand.

---

## 5. Signature devices (from the posts)

| Device | Component | Rule |
|---|---|---|
| Ochre offset outline | `DisplayTitle` | Teal (or cream on teal) text, with the same text behind as a 2px ochre stroke shifted 0.04em right and down. No blur. Hero title + at most one other title per page |
| Dashed looping line | `DashedLoop` | 2px ochre, dash 8 / gap 8, round caps, one loop. Max 2 per page. Draws once on scroll (800ms) |
| Ochre rule under a label | `SectionLabel` | 2px ochre rule running out to the left screen edge. It names the block below; it is never an eyebrow above a bigger heading |
| Ochre bullets | `BulletList` | 8px ochre dots instead of icons. Poppins 600 list text |
| Index numbers | `IndexLabel` | (01), (02) in meta style, tabular. Pieces, service rows and case studies only |
| Meta labels | `MetaLabel` | 12px uppercase. Meta lines only (category, year, place) |
| **Script trace** | `ScriptTrace`, `<Section trace>` | Added after reading the posts: a giant single hairline (1.5px) looping script stroke, cropped by the frame, one tone off the ground (sand on cream, cream on sand, cream 10 % on teal). At most every other section |
| The hand | `HeroSnap` | The client's hand photo (`/public/brand/hand-arm.webp`), sleeve recoloured to brand teal and cuff to cream (source `/public/hand1.webp`; script in the repo history). It places the ochre piece in the hero. One use per page. The only photograph that is not a project or team picture |
| Logo | `Logo` | Real file from `public/brand/` (missing: labelled placeholder). Never redrawn, never recoloured |

---

## 6. The puzzle system

`src/components/puzzle/` — `geometry.ts` (pure, unit-tested), `PuzzlePiece`, `PuzzleJoint`, `HeroSnap`, `PieceLabel`.

**The pieces are Signature's own artwork** (`/public/puzzles`, 66 SVGs). The code does not load those files; it generates the same shapes from their knob profile, so any edge combination exists. `npm test` checks that `puzzlePath(1000, edges)` equals the `d` of every supplied file, character for character, and that a tab and a socket lock with no gap.

Geometry on a 1000-unit square body: the knob is an organic jigsaw neck and head on the middle third of the edge (350–650), reaching 300 units out. A socket is the mirror of a tab.

Rendering, as in the supplied files, in two stacked layers so that in a group every base lies under every face:

1. **Base:** soft shadow (offset 18 / 78, blur 26, 30 %) and the side, 48 units thick, in the tone's deep step.
2. **Face:** the exact brand colour, lit by a bevel filter at the edges only.

| Tone | Face | Side | Shadow | Ink |
|---|---|---|---|---|
| teal | teal | teal-deep | teal | cream |
| ochre | ochre | ochre-deep | ochre-deep | teal |
| cream (on teal sections only) | cream | cream-deep | teal-deep | teal |

Rules:

- One ochre piece per group: it is always the piece that matters (the solution, the selected service, the invitation).
- Text keeps clear of the piece's own sockets. Pieces that carry a sentence use tabs only.
- Inside a locked group, pieces do not shade each other: bases under faces (`z-0` / `z-[1]`), or `shadow={false}` plus a `layer="shadow"` copy placed under the neighbours (hero).
- Labels: `PieceIndex` top-left, `PieceText` at the bottom (`oneLine` on small pieces).

Where pieces are used (only here):

1. **Hero** (`HeroSnap`): the teal piece "votre marque" waits; a hand brings the ochre piece "nos solutions" from the right and locks it.
2. **Clients wall** (`Clients`): cream pieces on a teal section, one per client, plus a last ochre piece, "Votre marque ici ?", linking to contact. 4 columns, 2 on phones.
3. **Services** (`ServicePicker`): one large ochre piece carries the selected service; its shape changes with the pole.
4. **Wide strips** (`PuzzleStrip`): a piece several cells wide locking under a row (the clients banner).
5. **The showreel** (`VideoPiece`): the video cut to a piece shape with a CSS mask.

Never as background decoration, icons next to list items, or floating shapes.

---

## 7. Components

| Component | Notes |
|---|---|
| `Section` | `tone="cream" \| "sand" \| "teal"`, `trace`, `joint`, `spacing`. Sets every semantic token. Clips horizontally |
| `SectionHead` | The one way a section opens: `text-h2` title on columns 1–7, one lead sentence on columns 9–12, shared baseline. Every section uses it |
| `NextLink` | The hand-off at the end of each section: names the next section, ink text with ochre underline |
| `ProjectImage` | Project or team picture at its real ratio; with no file, a sand block with a 1px teal hairline and print labels in the corners |
| `Container`, `Grid` | 1280px container with gutters; 12-col grid |
| `Button` | Primary: ochre fill + teal label. Secondary: ink label + 2px ochre underline. Same on teal. Rectangular, 0 radius, 48px tall, 20px padding. `href` → link, else `<button>`. Hover: primary draws a 2px underline under the label, secondary thickens its underline to 4px. Press: scale 0.97. Disabled: `line` fill / `ink-muted` label |
| `DisplayTitle`, `SectionLabel`, `BulletList`, `IndexLabel`, `MetaLabel` | See §5 |
| `PuzzlePiece` + `puzzlePath` | `edges`, `tone` (teal, ochre, cream), `size` or `fluid`, `shadow`, `layer`, children |
| `PuzzleJoint` | The single flat knob between a teal section and its neighbour |
| `ServicePicker` | Services as a list grouped by pole. Wide: the selected service fills the ochre piece (hover, focus, click). Narrow: accordion |
| `DashedLoop`, `ScriptTrace` | See §5 |
| `Reveal`, `RevealItem`, `MotionRoot` | Scroll reveal and the reduced-motion root |
| Icons (`ui/icons.tsx`) | Inline SVG, 1.5px stroke, square caps, mitred joins. No icon library |

---

## 8. Motion

- Easing: `cubic-bezier(0.23, 1, 0.32, 1)` (ease-out-quint, `--ease-out-quint`) for everything.
- Durations: press 120ms, UI 160–240ms (`--dur-ui` 200ms), puzzle snap 560ms, line draw 800ms. Nothing over 600ms except the line draw.
- Hero snap: the ochre piece and the hand start 40px to the right, slide in and lock. No bounce, overshoot, loop or wobble.
- Dashed line: draws once on scroll, 800ms.
- Service list: the active row takes full ink and a 2px ochre underline (200ms); the piece's text and shape change with it. No lift or scale.
- Buttons: press scale 0.97 / 120ms. Hover only draws or thickens an underline. Hover effects gated by `(hover: hover) and (pointer: fine)`.
- Scroll reveal: opacity + 8px y, once, 40ms stagger, 480ms. Small groups only (never stagger 80 items).
- `prefers-reduced-motion`: `MotionRoot` (`reducedMotion="user"`) removes transforms (pieces render locked); the line renders drawn; CSS transitions drop to ~0ms.

---

## 9. Anti-slop rules

- No fourth colour, no gradients, glow, blobs, glass, soft shadows.
- Puzzle pieces follow the client's artwork (bevel, side, soft shadow). Nothing else on the site is bevelled, extruded or shadowed, and there are no 3D characters or icon renders.
- No rounded cards, pill buttons or pill tags.
- No centred-everything layout.
- No icons next to list items (ochre dots), no emoji, no filler adjectives ("innovant", "haute performance", "révolutionnaire").
- One photograph is part of the system: the hand in the hero. No other stock photos, no fake testimonials, fake client logos, invented numbers or lorem. Missing content is a clearly marked placeholder (`[PHOTO PROJET]`, `[CHIFFRE À CONFIRMER]`), and empty proof rows are hidden, not faked.

### Deliberate exceptions to the taste-skill house rules

The brand brief requires some devices the generic taste rules ban. They are allowed here, on purpose, and only in their defined roles: index numbers `(01)`; 12px uppercase meta labels; 1px rules in tables, the header and proof strip; the cream ground (it is the client's paper); dashed placeholder outlines. Inspector runs pass `--allow numbering,micro-label,palette-cream,small-text,dashed` and, until real photos exist, `few-pictures,no-footage`.

---

## 10. Quality bar

- AA contrast for every text/background pair (table above).
- `npm run audit:colour`: no hex, `rgb(`, `hsl(` or off-palette colour class outside the token files.
- Visible focus ring everywhere: 2px, 2px offset.
- No horizontal page scroll at 360px.
- `npm run build`, `npm run lint`, `npm test` pass with no errors or warnings.

---

## 11. Page structure

A portfolio, not the agency site (signature-alg.com is linked from the header and contact). One page, then one template.

**One page, no cuts.** Sections do not paint their own background once script runs (`FlowBackground`): the page colour fades (700ms) to the tone of the section crossing the middle of the screen, and every section takes the ink of that colour, so text stays readable during the fade. Pieces, the folder panel and the flyer keep their own colours. Without script, each section keeps its own background. No hairlines between sections; the footer continues the contact's teal.

| Section | Tone | What it does |
|---|---|---|
| Header | cream | Sticky 64px; hides while scrolling down, returns on the way up. "Projets" opens the seven types (number, name, count, definition), each opening its folder; Services, Clients, Contact with an ochre underline that slides to the section in view; "signature-alg.com ↗"; "Nous contacter" in ochre with a puzzle knob on its left edge (steps down to the underlined style, without knob, while another ochre button is on screen) |
| Hero | cream + trace | Display title, one line, "Démarrer un projet" + "Voir les projets", and the **showreel cut as a puzzle piece** (CSS mask of the same path, base side and shadow), brought in by the hand |
| Projets choisis | cream | One project per type as a jigsaw (pictures printed on the pieces), the last piece ochre "Votre projet ici ?". Pieces fly in and lock on first view |
| Tous les projets, par type | cream | The filing cabinet: folder tabs stagger in; the open folder is a teal panel with the type's definition and its projects in the layout of the medium. `#dossier-<type>` opens a folder |
| Services | sand | The tear-off flyer drops in and its tabs fall into line; the pulled tab's description prints under the flyer |
| Clients | cream | One sand piece per client (placeholders until real logos), flying in and locking; then a full-width ochre strip (`PuzzleStrip`) rises and locks under the group: "Vous voulez devenir l’un de nos clients ?". Hidden when `clients.ts` is empty |
| Contact | teal | Outlined title, then the ways to reach the studio as four interlocking pieces that assemble on view: WhatsApp (ochre, primary), phone, e-mail, Instagram. Address, map, agency site below |
| Footer | teal | One line |

**Motion vocabulary** (all ease-out-quint, once, reduced motion keeps only the fades): section titles rise word by word out of a mask (`RiseText`, 700ms, 60ms stagger); groups of pieces assemble from scattered positions (`Assemble`, 700ms, 70ms stagger); the hand and the showreel slide in on load (800ms); the flyer drops (800ms); folder content cross-fades 280ms on tab change; header hide/show 300ms. Hover: pieces rise 6px; flyer tabs pull down 8px.

Physical objects may carry a soft shadow, because they lie on the paper: puzzle pieces, the showreel piece and the flyer. Nothing else does.

Container: full width up to 1680px; gutters 20 / 40 / 56 / 80px.

Layouts per type inside a folder (`CategoryGrid`): screens 16:10 two per row · boards 1:1 three per row · murals 3:2, one full width then two · gallery 4:5 three per row · landscape 3:2 two per row · feature 3:2, one large and two stacked · posts 4:5, four per row (two on phones).

Project page `/projets/[slug]`: cover at the type's ratio, title, brief, client / type / year, gallery stacked at the type's ratio, next project of the same type, "Nous contacter".

Content: `src/content/categories.ts`, `projects.ts` (`featured`: in Projets choisis), `services.ts`, `clients.ts`, `contact.ts`, plus `site.ts` (interface labels, hero video path). Counts are computed, never typed.

## 2026-11 — Bento system (supersedes the square, puzzle-everywhere rules above)

Kept: colours, Poppins + Inter Tight, the hero title (Poppins 800, ochre outline offset).
Changed:
- **Radius scale** (`--radius-sm/md/lg/xl` = 12/20/28/40px). Nested shapes: inner = outer − padding (card 28 + 8 padding → media 20).
- **Buttons are pills** (52px). Primary teal on light, ochre on teal. Secondary = 1.5px outline, fills on hover. Round arrow button (`CircleLink`) for "go there".
- **Panels**: a section's key block sits in a rounded teal panel on cream (Développement), like the references' dark block.
- **Cards**: cream cards on sand, number in a round chip, whole card is the link (Services). One ochre card = the exit (ask).
- **Media**: clean rounded rectangles in the real ratio. Puzzle shapes only on the clients wall (each brand = a piece).
- **Hero**: giant title right-aligned, line + one CTA under it, two figures; reel in a rounded card with a notch (sound) and a shortcut column on its left edge.
- **Word band**: giant service words sliding between two blocks of work (decoration).
- **No page-wide colour flow**: each section keeps its ground. Reveals: fade-up only where content arrives (client blocks).
