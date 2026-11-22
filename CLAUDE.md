# Angela Wang — personal site

Single-page personal site for Angela Wang, a CS student (Cornell). Vite + vanilla HTML/CSS/JS. No framework.

## Two audiences
1. **Recruiters**: must get name, one-liner, resume, and contact in the first 5 seconds. Experience and projects must be easy to scan (role, place, dates, 1–2 lines).
2. **Angela**: it should feel personal and creative, not like a corporate template.

## Sticker book (layered on the lookbook, since 2026-11-22)
- Personal images are presented as real **photo stickers**: white sticker border, soft shadow, slight tilt (about -3° to 3°, varied), playful bouncy motion. Same family as the hero cutout (SVG `#sticker` filter) and the tin charms (`#sticker-sm`).
- The page itself stays clean and spacious; the stickers and their motion carry the personality. Happy, bubbly, energetic, but polished, not childish.
- Bounce is allowed ONLY for sticker motion (`--bounce` ease: pop-in, lift, flip). Everything else stays smooth (`--ease`, `--ease-io`).
- Huge type is reserved for the landing. Other section headers are small: a tiny uppercase label + a pink script word.

## Brand concept: "a personal lookbook" (since 2026-11-22; the base style)
- Feels like a well-designed editorial spread about Angela: bold poster type, a signature script, earthy colors with one hot accent. Minimal and confident.
- NOT a literal magazine theme, NOT cutesy or scrapbook-y. **Never**: polaroid/photo frames, washi tape, dotted paper, colored section blocks, content cards/boxes, a top nav bar. (Photo stickers are the one exception, see above.)
- Normal sentence/title case in body copy (no all-lowercase style). Poster headlines are uppercase. Dates use an en dash: "June 2026 – August 2026".
- Don't draw copyrighted characters (e.g. Smiski, Yoshitomo Nara's art). Mentioning them in text is fine; images must be original drawings or Angela's own photos.

## Colors (~60 / 30 / 10; tokens in `:root` in `src/style.css`)
| token | hex | use |
|---|---|---|
| `--sand` | `#F0E5DB` | Soft Sand: the ONE background for the whole page |
| `--ink` | `#474329` | Mocha Green: text, headlines, hairlines |
| `--ink-soft` | `#6a6548` | lighter Mocha Green for quiet body text (still ~5:1 on sand) |
| `--pink` | `#FC75B4` | Watermelon Pink: ONLY the script font, small markers (`///`), link hover underlines, an occasional highlighted word. **Never body text** (too little contrast). |

## Fonts (all Google Fonts, loaded in `index.html`)
- **Anton** (`.poster`): big uppercase type in Mocha Green: "ANGELA" and the marquee only.
- **Mrs Saint Delafield** (`.script`): pink signature script, layered over/across headlines. It's thin, so always use it LARGE. `.script` adds a Soft Sand outline (`-webkit-text-stroke` + `paint-order`) so it stays readable where it crosses green letters.
  - Its apostrophe has wide built-in spacing. Write `’` wrapped in `<span class="apos">’</span>` so "What’s" doesn't gap.
- **Afacad**: all body text and small labels. `.label` = tiny uppercase, letter-spaced labels.
- Roycella was removed completely (the original download is still in `roycella-font/`, git-ignored and unused).

## Brand mark: "AW" signature
- Pink Mrs Saint Delafield "AW", like she signed the page.
- Used: small in the top-left of the hero (`.mark`, no nav bar), as the favicon (`public/favicon.png`, `public/apple-touch-icon.png`, rendered from the font), and as the sign-off at the very bottom (`.signoff`).

## Editorial details (use consistently, sparingly)
- Tiny uppercase Afacad labels for texture: section counters "01 / 03", "CS '28". Tag pills under work stickers: Mocha Green for experience tags, Watermelon Pink for PROJECT.
- Thin Mocha Green hairlines (1px `--ink`) separate things instead of boxes or cards.
- Small pink `///` tick marks (`.tick`) before section labels.
- Links: plain text; a pink underline draws in from the left on hover (`.links a::after`).

## Page structure (one scrolling page, `index.html`)
1. **Hero** (`#top`): AW mark top-left (no other top labels). Huge "ANGELA" (Anton). The stop-motion sticker stands IN FRONT of the letters, over the right leg of the final A so the name still reads. Pink script "Hi, I’m" is rotated across the top of ANGELA. Below: "/// CS '28 @ Cornell" label, "I like products, and I like people." (strong secondary line), a short quiet paragraph, and minimal links (Resume, Email, LinkedIn, GitHub).
   - Entrance (~1.5s): ANGELA's letters rise in → the script writes in (mask wipe) → `[data-rise]` lines fade up in sequence.
2. **My work** (`#work`, 01 / 03): small header ("/// MY WORK" label + pink script "lately" + counter). ONE row of 6 photo stickers (3×2 under 1100px, 2×3 under 640px); the whole section fits about one screen. Order: Design Consulting at Cornell (LEADERSHIP), Mastercard (INTERNSHIP), PTC (INTERNSHIP), DocuPal (PROJECT), Microsoft (PROJECT), Pinpoint (PROJECT). Each sticker: 4:3 photo with white border + shadow + tilt; underneath a tag pill, the name (Afacad 500), role · year (small).
   - Motion: the stickers pop in one by one with a small bounce on scroll. On hover the sticker straightens, lifts (bouncy) and flips (3D) to a Soft Sand back with the name + description. Phones: tap to flip, tap again to flip back. Reduced motion: no pop/flip; the description fades in over the photo.
   - Description text must fit inside the sticker (back font sizes use container query units `cqi`). If text grows, make the stickers bigger rather than cutting text.
3. **Interests marquee** (02 / 03): a hairline band with one line of Anton slowly scrolling sideways, showing the RANGE of her interests (not just the tin's items). Pink `·` separators. Pauses on hover; static with reduced motion. The text is written twice in the HTML for a seamless loop (edit both copies).
4. **Finale: What’s in my tin?** (`#tin`, 03 / 03): pink script title, centered DRAWN tin (original SVG illustration inspired by her real tin; the photos have fingers/jeans covering the edges, so they can't be cut out cleanly). Closed → small wiggle → lid lifts → swings open on a hinge to show the inside of the lid (AW) → 7 items fade in, **visual only (no hover/tap notes)**: sushi, yoga, smiski (her own photo, `public/images/charms/smiski.png`), candles, traveling, walks, crafting. Top row 4, bottom row 3.
5. **Footer** (`#contact`): hairline row (name, Ithaca, contact links, ©), then the big pink "AW" sign-off that writes itself in.

## Motion rules
- Smooth, confident, editorial: slides, reveals, writing-in, using `--ease` (ease-out) / `--ease-io` (ease-in-out) with no overshoot. Never chaotic.
- The ONE exception: photo stickers get a small, polished bounce (`--bounce`) for pop-in, lift and flip.
- Always respect `prefers-reduced-motion`: everything shows its final state, the hero shows frame 1, the tin starts open, the marquee is static, stickers don't pop or flip (description fades instead).
- Check desktop (1400px), tablet (~900px) and phone (390px) widths. No horizontal scroll.

## Files
- `index.html`: all content. Placeholders: `you@example.com`, `YOUR-HANDLE` links, `<!-- TODO -->` comments.
- `src/style.css`: all styles, numbered sections.
- `src/main.js`: hero entrance (letter split + stagger), scroll reveals (`[data-reveal]` → `.is-in`), sticker tap-to-flip on touch screens, tin state machine (`data-state` = closed / wiggle / pop / open).
- `public/images/me_photo{1,2,3}.png`: hero frames, already trimmed, scaled to the same height, aligned on one baseline (shared 696×1180 canvas, 40px transparent padding for the outline), quantized to ~120KB each.
- `public/images/stickers/*.jpg`: the 6 work photos, all cropped to 4:3 (640×480), JPEG q80. `mastercard.jpg` was brightened ~20% with a gamma-0.75 curve (lifts shadows and mids, never clips highlights); the pre-brightening version is in `images/backup/mastercard_original.jpg`. Microsoft is cropped from the left so its logo stays in.
- `public/images/tin/*.svg`: lid top, lid inside, tray. `public/images/charms/`: original item drawings (`*.svg`) + `smiski.png` (her photo, trimmed to 245×324, transparent). Don't draw the Smiski character; use her photo.
- `images/`: original source photos (not served). **iPhone HEICs carry an EXIF rotation**: apply it when converting (Pillow `ImageOps.exif_transpose`), or the photo comes out sideways.
- `public/resume.pdf`: **not added yet**. All resume links point here.

## Implementation notes
- Hero stop-motion: 3 stacked `<img>`s, `animation: frame-cycle 2.1s steps(1, end) infinite` with delays 0 / -1.4s / -0.7s, giving a hard cut every 0.7s. The sticker outline is the SVG `#sticker` filter (feMorphology dilate → blur → threshold → white, plus a drop shadow) applied to `.me-sticker`. **Keep this exactly as is.**
- If hero photos are replaced, re-run the same pipeline (HEIC→PNG, trim to alpha bbox, equal height, center on the feet, bottom-align on a shared canvas) or the frames will jump.
- "Writing in" = a left-to-right CSS mask wipe (`.writes`, `@keyframes write`). It runs when the element (or its `[data-reveal]` parent) gets `.is-in`. The hero script runs on `.hero.is-ready`.
- Tin lid uses a 3D hinge flip (`rotateX(180deg)`, `transform-origin` at the top edge, `backface-visibility`). **Never put `filter` on `.tin__lid` or its ancestors**: it flattens the 3D and both faces show. Shadows go on each `.lid-face`.
- Charms use the `#sticker-sm` SVG filter. Position each with `--x/--y` (percent of the tray), tilt with `--r`, set the order they appear with `--i`. The smiski photo is taller than the drawings, so `.charm__art--photo` sizes it by height to match.
- Sticker flip: `.sticker__card` holds the tilt/lift (`rotate`/`translate` properties) and `perspective`; each face (`.sticker__front`, `.sticker__back`) rotates on its own with `backface-visibility: hidden`. Never put `filter` on the card (it flattens 3D); shadows are `box-shadow` on the faces. The pop-in animates the outer `<li>` (`scale`/`translate`), so it doesn't fight the hover lift.
- Breakpoints: 1100px (stickers 3×2), 760px (hero shrinks and stacks), 640px (stickers 2×3).
- Keep code simple and commented. Angela edits it herself.

## Commands
`npm run dev` (http://localhost:5173), `npm run build`, `npm run preview`.

## Where we left off (2026-11-22)
- Done: sticker-book pass. Hero top labels removed; Experience + Projects merged into one compact "My work" section with 6 flipping photo stickers; tin items are visual only, smiski uses her photo, candles + walks added (7 items). Checked at 1400 / 900 / 390px, plus reduced motion. All sticker descriptions fit (checked for overflow).
- Still placeholder: email/LinkedIn/GitHub URLs (`you@example.com`, `YOUR-HANDLE`), `public/resume.pdf`.
- Open questions for Angela:
  - "DocuPal" spelling (Pinpoint is now "Pinpoint", per her latest copy).
  - The favicon script is very thin at 16px tab size. Consider a bolder favicon variant if it's hard to see.
  - On phones the sticker covers part of the final "A" in ANGELA. It reads, but it's tight.

### Next steps
1. Add real links + `public/resume.pdf`.
2. Answer the open questions above.
3. Share-preview image + meta tags, then deploy to Netlify or Vercel (`npm run build`, output in `dist/`).
