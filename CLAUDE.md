# Angela Wang — personal site

Single-page personal site for Angela Wang, a CS student (Cornell). Vite + vanilla HTML/CSS/JS. No framework.

## Two audiences
1. **Recruiters**: must get name, one-liner, resume, and contact in the first 5 seconds. Experience and projects must be easy to scan (role, place, dates, 1–2 lines).
2. **Angela**: it should feel personal and creative, not like a corporate template.

## Brand concept: "a personal lookbook" (since 2026-11-22; replaces ALL earlier style directions)
- Feels like a well-designed editorial spread about Angela: bold poster type, a signature script, earthy colors with one hot accent. Minimal and confident.
- NOT a literal magazine theme, NOT cutesy or scrapbook-y. **Never**: photo frames, washi tape, polaroids, dotted paper, colored section blocks, cards/boxes, a top nav bar.
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
- **Anton** (`.poster`): big uppercase headlines in Mocha Green: "ANGELA", "EXPERIENCE", "PROJECTS", the marquee.
- **Mrs Saint Delafield** (`.script`): pink signature script, layered over/across headlines. It's thin, so always use it LARGE. `.script` adds a Soft Sand outline (`-webkit-text-stroke` + `paint-order`) so it stays readable where it crosses green letters.
  - Its apostrophe has wide built-in spacing. Write `’` wrapped in `<span class="apos">’</span>` so "What’s" doesn't gap.
- **Afacad**: all body text and small labels. `.label` = tiny uppercase, letter-spaced labels.
- Roycella was removed completely (the original download is still in `roycella-font/`, git-ignored and unused).

## Brand mark: "AW" signature
- Pink Mrs Saint Delafield "AW", like she signed the page.
- Used: small in the top-left of the hero (`.mark`, no nav bar), as the favicon (`public/favicon.png`, `public/apple-touch-icon.png`, rendered from the font), and as the sign-off at the very bottom (`.signoff`).

## Editorial details (use consistently, sparingly)
- Tiny uppercase Afacad labels for texture: section counters "01 / 04", "ITHACA, NY", "CS '28".
- Thin Mocha Green hairlines (1px `--ink`) separate things instead of boxes or cards.
- Small pink `///` tick marks (`.tick`) before section labels.
- Links: plain text; a pink underline draws in from the left on hover (`.links a::after`).

## Page structure (one scrolling page, `index.html`)
1. **Hero** (`#top`): AW mark + labels on top. Huge "ANGELA" (Anton). The stop-motion sticker stands IN FRONT of the letters, over the right leg of the final A so the name still reads. Pink script "Hi, I’m" is rotated across the top of ANGELA. Below: "/// CS '28 @ Cornell" label, "I like products, and I like people." (strong secondary line), a short quiet paragraph, and minimal links (Resume, Email, LinkedIn, GitHub).
   - Entrance (~1.5s): ANGELA's letters rise in → the script writes in (mask wipe) → `[data-rise]` lines fade up in sequence.
2. **Experience** (`#experience`, 01 / 04) and **Projects** (`#projects`, 02 / 04): hairline + counter label, big Anton title with a pink script word written across/below it ("my work", "lately"). Lookbook entries: big photo, off-grid, alternating sides, nudging into the text column. The text sits under a hairline: small date label → role title (strongest) → description. On scroll the photo slides in from its side and the text slides up. Photos lift slightly on hover.
3. **Interests marquee** (03 / 04): a hairline band with one line of Anton slowly scrolling sideways, showing the RANGE of her interests (not just the tin's items). Pink `·` separators. Pauses on hover; static with reduced motion. The text is written twice in the HTML for a seamless loop (edit both copies).
4. **Finale: What’s in my tin?** (`#tin`, 04 / 04): pink script title, centered DRAWN tin (original SVG illustration inspired by her real tin; the photos have fingers/jeans covering the edges, so they can't be cut out cleanly). Closed → small wiggle → lid lifts → swings open on a hinge to show the inside of the lid (AW) → charms fade in: sushi, yoga, smiski (placeholder slot for her own photo), traveling, crafting. Notes show beside a charm on hover (desktop) or tap (mobile).
5. **Footer** (`#contact`): hairline row (name, Ithaca, contact links, ©), then the big pink "AW" sign-off that writes itself in.

## Motion rules
- Smooth, confident, editorial: slides, reveals, writing-in. Never bouncy or chaotic: use `--ease` (ease-out) / `--ease-io` (ease-in-out), no overshoot.
- Always respect `prefers-reduced-motion`: everything shows its final state, the hero shows frame 1, the tin starts open, the marquee is static.
- Check desktop (1400px) and phone (390px) widths. No horizontal scroll.

## Files
- `index.html`: all content. Placeholders: `[... description]` charm notes, `you@example.com`, `YOUR-HANDLE` links, `<!-- TODO -->` comments.
- `src/style.css`: all styles, numbered sections.
- `src/main.js`: hero entrance (letter split + stagger), scroll reveals (`[data-reveal]` → `.is-in`), tin state machine (`data-state` = closed / wiggle / pop / open), tap-to-show notes.
- `public/images/me_photo{1,2,3}.png`: hero frames, already trimmed, scaled to the same height, aligned on one baseline (shared 696×1180 canvas, 40px transparent padding for the outline), quantized to ~120KB each.
- `public/images/work/*.jpg`: experience photos at 3:2 (900×600), project mockups at 16:10 (960×600), JPEG q80. `mastercard.jpg` was brightened ~20% with a gamma-0.75 curve (lifts shadows and mids, never clips highlights); the original is in `images/backup/mastercard_original.jpg`.
- `public/images/tin/*.svg`: lid top, lid inside, tray. `public/images/charms/*.svg`: charm drawings.
- `images/`: original source photos (not served). **iPhone HEICs carry an EXIF rotation**: apply it when converting (Pillow `ImageOps.exif_transpose`), or the photo comes out sideways.
- `public/resume.pdf`: **not added yet**. All resume links point here.

## Implementation notes
- Hero stop-motion: 3 stacked `<img>`s, `animation: frame-cycle 2.1s steps(1, end) infinite` with delays 0 / -1.4s / -0.7s, giving a hard cut every 0.7s. The sticker outline is the SVG `#sticker` filter (feMorphology dilate → blur → threshold → white, plus a drop shadow) applied to `.me-sticker`. **Keep this exactly as is.**
- If hero photos are replaced, re-run the same pipeline (HEIC→PNG, trim to alpha bbox, equal height, center on the feet, bottom-align on a shared canvas) or the frames will jump.
- "Writing in" = a left-to-right CSS mask wipe (`.writes`, `@keyframes write`). It runs when the element (or its `[data-reveal]` parent) gets `.is-in`. The hero script runs on `.hero.is-ready`.
- Tin lid uses a 3D hinge flip (`rotateX(180deg)`, `transform-origin` at the top edge, `backface-visibility`). **Never put `filter` on `.tin__lid` or its ancestors**: it flattens the 3D and both faces show. Shadows go on each `.lid-face`.
- Charms use the `#sticker-sm` SVG filter. Position each with `--x/--y` (percent of the tray), tilt with `--r`, set the order they appear with `--i`, and pick the side its note shows on with `data-side`.
- Photo hover lift uses the `translate` property so it doesn't fight the reveal `transform`.
- Breakpoint: 760px (hero shrinks and stacks, entries stack).
- Keep code simple and commented. Angela edits it herself.

## Commands
`npm run dev` (http://localhost:5173), `npm run build`, `npm run preview`.

## Where we left off (2026-11-22)
- Done: "personal lookbook" redesign. New palette + fonts (Roycella removed), ANGELA hero with the sticker in front and script "Hi, I’m", AW mark + favicon + sign-off, Anton section heads with script words, lookbook entries, interests marquee, tin restyled as the finale, Mastercard photo brightened. Checked at 1400px and 390px, plus reduced motion.
- Still placeholder: charm notes, smiski photo slot, email/LinkedIn/GitHub URLs, `public/resume.pdf`.
- Open questions for Angela:
  - "PinPoint" vs "Pinpoint" (the app mockup says "Pinpoint"), and "DocuPal" spelling.
  - PinPoint has no date, so its small label says "Mobile app". Replace it with a year if there is one.
  - The favicon script is very thin at 16px tab size. Consider a bolder favicon variant if it's hard to see.

### Next steps
1. Angela writes the charm notes and adds a transparent PNG of her smiski (see the TODO in the tin markup; use `class="charm__art"`).
2. Add real links + `public/resume.pdf`.
3. Answer the open questions above.
4. Share-preview image + meta tags, then deploy to Netlify or Vercel (`npm run build`, output in `dist/`).
