# Angela Wang — personal site

Single-page personal site for Angela Wang, a CS student (Cornell). Vite + vanilla HTML/CSS/JS. No framework.

## Two audiences
1. **Recruiters**: must get name, one-liner, resume, and contact in the first 5 seconds. Experience and projects must be easy to scan (role, place, dates, 1–2 lines).
2. **Angela**: it should feel personal and creative, not like a corporate template.

## Sticker book (layered on the lookbook, since 2026-11-22)
- Personal images are presented as real **photo stickers**: white sticker border, soft shadow, slight tilt (about -3° to 3°, varied), playful bouncy motion. Same family as the hero cutout (SVG `#sticker` filter) and the tin charms (`#sticker-sm`).
- The page itself stays clean and spacious; the stickers and their motion carry the personality. Happy, bubbly, energetic, but polished, not childish.
- Bounce is allowed ONLY for sticker motion (`--bounce` ease: pop-in, lift, flip). Everything else stays smooth (`--ease`, `--ease-io`).
- Huge type is reserved for the landing. Other section headers are small: a tiny uppercase label + a dusty rose script word.

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
| `--rose` | `#D9879A` | Dusty Rose (since 2026-11-22; replaced Dusty Rose #FC75B4): the script font, small markers (`///`, `·`), link hover underlines, tag accents. Only ~2.1:1 on sand, so **never small text**. |
| `--rose-tint` | `#F4D6DD` | light rose fill behind small Mocha Green text (PROJECT tags), ~6:1 |

## Fonts (all Google Fonts, loaded in `index.html`)
- **Anton** (`.poster`): big uppercase type in Mocha Green: "ANGELA" and the marquee only.
- **Mrs Saint Delafield** (`.script`): dusty rose signature script, layered over/across headlines. It's thin, so always use it LARGE. `.script` adds a Soft Sand outline (`-webkit-text-stroke` + `paint-order`) so it stays readable where it crosses green letters.
  - Its apostrophe has wide built-in spacing. Write `’` wrapped in `<span class="apos">’</span>` so "What’s" doesn't gap.
- **Afacad**: all body text and small labels. `.label` = tiny uppercase, letter-spaced labels.
- Roycella was removed completely (the original download is still in `roycella-font/`, git-ignored and unused).

## Brand mark: "AW" signature
- Dusty Rose Mrs Saint Delafield "AW", like she signed the page.
- Used: small in the top-left of the hero (`.mark`, no nav bar), as the favicon (`public/favicon.png`, `public/apple-touch-icon.png`, rendered from the font), and as the sign-off at the very bottom (`.signoff`).

## Editorial details (use consistently, sparingly)
- Tiny uppercase Afacad labels for texture: section counters "01 / 03", "CS '28". Tag pills under work stickers: Mocha Green fill + sand text for experience tags; PROJECT = light rose fill (`--rose-tint`) + rose border + Mocha Green text (rose itself is too light behind small text).
- Thin Mocha Green hairlines (1px `--ink`) separate things instead of boxes or cards.
- Small dusty rose `///` tick marks (`.tick`) before section labels.
- Links: plain text; a dusty rose underline draws in from the left on hover (`.links a::after`).

## Page structure (one scrolling page, `index.html`)
1. **Hero** (`#top`): AW mark top-left (no other top labels). Huge "ANGELA" (Anton). The stop-motion sticker stands IN FRONT of the letters, over the right leg of the final A so the name still reads. Dusty rose script "Hi, I’m" is rotated across the top of ANGELA. Below: "/// CS '28 @ Cornell" label, "I like products, and I like people." (strong secondary line), a short quiet paragraph, and minimal links: Email (`mailto:aw858@cornell.edu`), LinkedIn (`https://www.linkedin.com/in/angela-wang-3b6767212/`), GitHub (`https://github.com/angierinne`). LinkedIn/GitHub open in a new tab (`target="_blank" rel="noopener noreferrer"`). **No Resume link.**
   - Entrance (~1.5s): ANGELA's letters rise in → the script writes in (mask wipe) → `[data-rise]` lines fade up in sequence.
   - **Skills ticker** on the hero's bottom edge: small Afacad uppercase, letter-spaced (label size), Mocha Green, dusty rose `·` separators, a faint hairline above. Slow drift left (~34px/s, set from its width in main.js), pauses on hover, static with reduced motion. Written twice in the HTML for a seamless loop (edit both copies). Clear space before "My work". No Anton.
2. **My work** (`#work`, 01 / 03): small header ("/// MY WORK" label + dusty rose script "lately" + counter). 6 large photo stickers (~380px wide on desktop, ~250px on phones) in a **sliding carousel**. Order: Design Consulting at Cornell (LEADERSHIP · President · 2026 – Present), Mastercard (INTERNSHIP · Technical Product Management Intern · 2026), PTC (INTERNSHIP · User Experience and Research Intern · 2025), DocuPal (PROJECT · Developer and Designer · 2026), Microsoft (PROJECT · Contract Designer · 2025), Pinpoint (PROJECT · Designer · 2025). Each sticker: 4:3 photo with white border + shadow + tilt; underneath a tag pill, the name and role · year at 17px (same as the landing paragraph).
   - Sticker motion: pop in one by one with a small bounce when the carousel scrolls into view. On hover the sticker straightens, lifts (bouncy) and flips (3D) to a Soft Sand back with the name + description. Phones: tap to flip, tap again to flip back. Reduced motion: no pop/flip; the description fades in over the photo.
   - Carousel: slides left slowly (~16px/s, slower than the skills ticker) and loops seamlessly. Pauses on hover, while dragging/swiping, while a sticker is flipped, and while keyboard focus is inside. Mouse drag + touch swipe + trackpad scroll all work; it resumes 3s after the user lets go. Reduced motion: no clones, no auto-slide, a plain scrollable row.
   - Description text must fit inside the sticker (back font sizes use container query units `cqi`). If text grows, make the stickers bigger rather than cutting text.
3. **Interests marquee** (02 / 03): a hairline band with one line of Anton slowly scrolling sideways, showing the RANGE of her interests (not just the tin's items). Dusty rose `·` separators. Pauses on hover; static with reduced motion. The text is written twice in the HTML for a seamless loop (edit both copies).
4. **Finale: What’s in my tin?** (`#tin`, 03 / 03): dusty rose script title, centered DRAWN tin (original SVG illustration inspired by her real tin; the photos have fingers/jeans covering the edges, so they can't be cut out cleanly). Closed → small wiggle → lid lifts → swings open on a hinge to show the inside of the lid (AW) → 7 items fade in, **visual only (no hover/tap notes)**: sushi, yoga, smiski (her own photo, `public/images/charms/smiski.png`), candles, traveling, walks, crafting. Top row 4, bottom row 3.
5. **Footer** (`#contact`): hairline row (name, Ithaca, contact links, ©), then the big dusty rose "AW" sign-off that writes itself in.

## Motion rules
- Smooth, confident, editorial: slides, reveals, writing-in, using `--ease` (ease-out) / `--ease-io` (ease-in-out) with no overshoot. Never chaotic.
- The ONE exception: photo stickers get a small, polished bounce (`--bounce`) for pop-in, lift and flip.
- Always respect `prefers-reduced-motion`: everything shows its final state, the hero shows frame 1, the tin starts open, the marquee is static, stickers don't pop or flip (description fades instead).
- Check desktop (1400px), tablet (~900px) and phone (390px) widths. No horizontal scroll.

## Files
- `index.html`: all content.
- `src/style.css`: all styles, numbered sections.
- `src/main.js`: hero entrance (letter split + stagger), scroll reveals (`[data-reveal]` → `.is-in`), skills ticker speed, work carousel (clones, slide loop, pauses, drag), sticker tap-to-flip on touch screens, tin state machine (`data-state` = closed / wiggle / pop / open).
- `public/images/me_photo{1,2,3}.png`: hero frames, already trimmed, scaled to the same height, aligned on one baseline (shared 696×1180 canvas, 40px transparent padding for the outline), quantized to ~120KB each.
- `public/images/stickers/*.jpg`: the 6 work photos, all cropped to 4:3 (640×480), JPEG q80. `mastercard.jpg` was brightened ~20% with a gamma-0.75 curve (lifts shadows and mids, never clips highlights); the pre-brightening version is in `images/backup/mastercard_original.jpg`. Microsoft is cropped from the left so its logo stays in.
- `public/images/tin/*.svg`: lid top, lid inside, tray. `public/images/charms/`: original item drawings (`*.svg`) + `smiski.png` (her photo, trimmed to 245×324, transparent). Don't draw the Smiski character; use her photo.
- `images/`: original source photos (not served). **iPhone HEICs carry an EXIF rotation**: apply it when converting (Pillow `ImageOps.exif_transpose`), or the photo comes out sideways.

## Implementation notes
- Hero stop-motion: 3 stacked `<img>`s, `animation: frame-cycle 2.1s steps(1, end) infinite` with delays 0 / -1.4s / -0.7s, giving a hard cut every 0.7s. The sticker outline is the SVG `#sticker` filter (feMorphology dilate → blur → threshold → white, plus a drop shadow) applied to `.me-sticker`. **Keep this exactly as is.**
- If hero photos are replaced, re-run the same pipeline (HEIC→PNG, trim to alpha bbox, equal height, center on the feet, bottom-align on a shared canvas) or the frames will jump.
- "Writing in" = a left-to-right CSS mask wipe (`.writes`, `@keyframes write`). It runs when the element (or its `[data-reveal]` parent) gets `.is-in`. The hero script runs on `.hero.is-ready`.
- Tin lid uses a 3D hinge flip (`rotateX(180deg)`, `transform-origin` at the top edge, `backface-visibility`). **Never put `filter` on `.tin__lid` or its ancestors**: it flattens the 3D and both faces show. Shadows go on each `.lid-face`.
- Charms use the `#sticker-sm` SVG filter. Position each with `--x/--y` (percent of the tray), tilt with `--r`, set the order they appear with `--i`. The smiski photo is taller than the drawings, so `.charm__art--photo` sizes it by height to match.
- Carousel loop: the 6 stickers are cloned on both sides ([copy][originals][copy]); scrollLeft is kept inside the middle set and shifted by exactly one set width when it leaves it, which lands on identical stickers, so the jump is invisible. Clones are `aria-hidden` with `tabIndex=-1`. The pop-in is triggered by the visible `.carousel` window (`data-reveal`), NOT the `<ul>`, which is far wider than the screen and would never reach the reveal threshold. Pauses use `holdFor(ms)`, which never shortens a longer pause. Only keyboard focus (`:focus-visible`) pauses, since a mouse click also focuses the button.
- Sticker flip: `.sticker__card` holds the tilt/lift (`rotate`/`translate` properties) and `perspective`; each face (`.sticker__front`, `.sticker__back`) rotates on its own with `backface-visibility: hidden`. Never put `filter` on the card (it flattens 3D); shadows are `box-shadow` on the faces. The pop-in animates the outer `<li>` (`scale`/`translate`), so it doesn't fight the hover lift.
- Breakpoint: 760px (hero shrinks and stacks). Sticker width scales with `clamp()`.
- Keep code simple and commented. Angela edits it herself.

## Commands
`npm run dev` (http://localhost:5173), `npm run build`, `npm run preview`.

## Where we left off (2026-11-22)
- Done: Dusty Rose accent (+ favicon re-rendered), real Email/LinkedIn/GitHub links (Resume removed everywhere), skills ticker on the hero, bigger stickers in a sliding/draggable carousel, Pinpoint year. Checked at 1400 / 390px + reduced motion: ticker ~30–34px/s, carousel 16px/s, hover pause, drag → 3s hold → resume, seamless wrap, tap-flip pauses the row, no description overflow, no horizontal page scroll.
- Open questions for Angela:
  - "DocuPal" spelling.
  - The rose script headline "What’s in my tin?" is large but low contrast (~2.1:1). It's mostly decorative; consider Mocha Green if readability matters.
  - Favicon script is thin at 16px tab size.
  - On phones the sticker covers part of the final "A" in ANGELA.

### Next steps
1. Answer the open questions above.
2. Share-preview image + meta tags, then deploy to Netlify or Vercel (`npm run build`, output in `dist/`).
