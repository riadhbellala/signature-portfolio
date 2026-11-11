# Brand analysis — Signature creative co.

Source: 9 Instagram screenshots supplied by the client, moved from `src/app/assets/signature-posts/` to `references/post-01.png` … `post-09.png`. Sampled with Python + Pillow (median of patches and of hue/lightness-filtered pixel clusters, never single pixels, because the screenshots are JPEG-compressed and anti-aliased).

## 1. Post by post

| # | Post | Background | Text colour | Accent | Type | Stacking & space | Devices |
|---|---|---|---|---|---|---|---|
| 01 | "On Recrute!" | Warm cream paper, photo-lit: a diagonal light ray from top-left and a darker sand floor at the bottom (`#F4DBBE` lit, `#EAD6C0` shadow) | Deep teal `#245056` | Ochre | Poppins ExtraBold/Black, sentence case, very tight tracking, leading below 1. Lists in Poppins SemiBold, date line in Poppins Medium | Headline stacked on 2 lines top-left ("On / Recrute!"), date right-aligned under it, list block bottom-left, product photo (ochre chair) bottom-right. About 45% of the page is open paper | Ochre offset outline behind the teal headline (misregistration look, offset down-right). Thin ochre dashed line with round caps looping across the page with one loop (top-right) and a second loop fragment (bottom-left). Ochre rule under "Signature Cherche :" running to the left edge. Ochre bullet dots. Logo placed small next to the label |
| 02 | Logo card (carousel) | Flat cream `#F5EBD9` | Teal script | Ochre "creative co." | Script logo + rounded geometric sans (Poppins-like) for "creative co." | Logo centred, everything else empty | **Giant hairline script trace in the background**: a single looping stroke tracing an oversized "S", in a tone barely darker than the paper. The logo's swash runs off the right edge |
| 03 | "Le marketing… semble compliqué sans Signature" | Flat cream `#F5EBD9` | Teal | Ochre paint dab | Neo-grotesk (Helvetica/Inter-like) bold for the headline, regular for the lead-in. Not Poppins: this carousel breaks the system | Headline top-left on 2 lines, label mid-left | Giant hairline script trace again (looping letters). A thick teal curve sweeps across. A 3D icon render (rejected by the brief) |
| 04 | "Social Media Marketing" | Flat cream `#F3E7D4` | Teal | Ochre dashed line, ochre fountain-pen line icon | Poppins Medium, centred label | Logo top-left, globe icon top-right, cards centred | Ochre dashed line looping around the rounded photo stack. Hairline script trace in the background. Teal circles with emoji (rejected by the brief) |
| 05 | "Avis important" | Flat cream `#F3E7D4` | Teal `#234B45` (antialiased) | Ochre in the logo only | Poppins Bold uppercase headline, Poppins Regular body with Bold emphasis | Fully centred notice | Two thin teal rules framing the body |
| 06 | "Créatif? Développeur?" | Very light cream `#FCF1E7` | Teal | Ochre "creative co." | Poppins SemiBold list stacked one word per line, Poppins Regular lead | Logo + list left, stock photo right | Contact lines with small outline icons. Stock photography (rejected by the brief) |
| 07 | "We are hiring" (older Signature Consulting identity) | Deep teal `#204C47` with a radial lamp glow | Cream | Brighter yellow `#F5C343` | Roboto-like bold caps + script | Chair left, headline right | Hairline script trace in lighter teal (`#2C615E`, about cream at 8–10%) plus a feather outline |
| 08 | "Seniors Graphic Designers" (older identity) | Same teal | Cream + yellow | Yellow outline type | Montserrat; "GRAPHIC" set as outline only; "DESIGNERS" with an offset echo | Right-aligned block | Same background trace. Offset echo on display type again |
| 09 | "Site web professionnel" (older identity, "Agence 360°") | Teal | Cream | Yellow brush strokes | Condensed caps, Arabic display, script | Collage | Script trace in background. Brush strokes (not carried over) |

## 2. What recurs (the brand, distilled)

1. **Paper ground.** Every current post (02–06) sits on a flat warm cream. The teal posts are the older "Consulting" identity but show the same teal used as a full field.
2. **Teal does all the talking, ochre is the small warm detail.** Ochre never carries words on cream except inside the logo itself. It appears as a line, an outline, a dot or a fill.
3. **Poppins, set heavy and tight.** The current identity (01, 04, 05, 06) is Poppins throughout: ExtraBold for the headline, SemiBold for lists, Medium/Regular for small lines. Post 03 (neo-grotesk) and 07–09 (Montserrat, Roboto) belong to earlier or off-system carousels.
4. **Hairline script trace in the background.** The device the client points to as "the same things in background": a giant, single-weight, looping script stroke, cropped by the frame, one tone off the ground. On cream it reads as a sand line; on teal as a slightly lighter teal line. Present in 02, 03, 04, 07, 08, 09. It is the biggest recurring device after the logo itself and was missing from the original brief; it is added to the system as `ScriptTrace`.
5. **Ochre offset outline** (01) and its older cousin, the offset echo (08): print misregistration on display type.
6. **Dashed ochre line with a loop** (01, 04): thin, round caps, dashes about equal to gaps, wraps around things or loops once.
7. **Rule under a label** (01: ochre rule to the left edge; 05: teal rules).
8. **Bullet dots** in ochre (01).
9. **Left-aligned headline top-left, list bottom-left** (01, 03, 06), with large open paper.

## 3. Colour check

| Token | Brief value | Measured | Where | Decision |
|---|---|---|---|---|
| teal | `#245056` | `#245056` (105 704 px cluster, "On Recrute!" letters) | 01 | **Confirmed** |
| ochre | `#EAAD48` | `#E9B248` (median of solid bullet dots); logo "creative co." `#E4AF51`, rule `#E5B255` | 01, 05 | **Corrected to `#E9B248`.** Same hue, 5 points more green. The bullets are the only solid, unlit ochre areas large enough to sample. Bonus: teal on ochre goes from 4.48:1 (fails AA) to 4.64:1 (passes) |
| cream | `#FBEDD3` | `#F5EBD9` on the flat logo and text cards (02, 03, 1.5 M px each); `#F3E7D4` (04, 05); `#FCF1E7` (06). The "On Recrute!" poster is a photograph lit by a ray: `#F4DBBE` lit, `#EAD6C0` in shadow; `#FBEDD3` does not appear as a flat area in any post | 02, 03 | **Corrected to `#F5EBD9`**, the ground of the logo card. Slightly less yellow, slightly greyer. Teal on cream: 7.54:1 |
| sand | `#E9D4BB` | `#EAD6C0` / `#E6D2BD` (poster shadow paper) | 01 | **Confirmed** |

Discarded from the references, as the brief asks: the lamp glow and light ray (photo lighting), the brighter yellow `#F5C343` and brush strokes of the old Consulting posts, emoji, 3D icon renders, stock photography, rounded photo cards.

## 4. Font decision

Display, headings and lists: **Poppins** (800 display, 700 headings, 600 lists). The current posts are unambiguously Poppins: double-storey `a`, geometric `e` with horizontal bar, flat-topped `t`, round `R` bowl. No Gilroy or other custom face is used. Body: Inter Tight, as briefed (Poppins is too wide for long reading).

## 5. Gaps

- **"We just build" puzzle campaign post is not among the references.** The puzzle geometry is built from the brief's numbers alone; please send that post so the knob proportions can be checked against it.
- **No logo file.** `public/brand/` is empty. A labelled placeholder is used everywhere the logo goes. Send the SVG (or a high-res PNG) of the "Signature creative co." lock-up.
