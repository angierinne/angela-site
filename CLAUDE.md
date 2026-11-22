# Angela Wang — personal site

Single-page personal site for Angela Wang, a CS student (Cornell). Vite + vanilla HTML/CSS/JS. No framework.

## Two audiences
1. **Recruiters**: must get name, one-liner, resume, and contact in the first 5 seconds. Experience and projects must be easy to scan (role, place, dates, 1–2 lines).
2. **Angela**: it should feel personal, creative, and handmade, not like a corporate template.

## Vibe
- Scrapbook / cork-board collage, but clean and easy to scan. Soft, warm, playful, **not cluttered**.
- Physical-object details: sticker cutouts with thick white borders, washi tape, pinned prints, photobooth strips, little stars.
- Personal motifs (use sparingly, not all at once): candles, yoga, matcha, smiski, angel wings, bunnies, cats, sushi, photography, stars, hair clips, her sticker-covered tin with "AW" inside the lid, and the wall collage above her bed (prints, photobooth strips, stars).
- Don't draw copyrighted characters (e.g. Smiski); use emoji or original shapes.

## Palette (tokens live in `:root` in `src/style.css`)
Three theme colors used across every section, plus a dark text color for readability.
| token | hex | use |
|---|---|---|
| `--pink` | `#F3D9D8` | dusty pink: work section background, button hovers |
| `--butter` | `#F2E6BE` | buttercream: hero + contact backgrounds, tape |
| `--sage` | `#A5A17B` | sage olive: tin section background, primary buttons |
| `--pink-deep` / `--sage-deep` | `#b06f6b` / `#5d5a3a` | darker shades for text-sized accents (contrast) |
| `--paper` / `--card` | `#FBF7EF` / `#FFFDF8` | off-white background / cards |
| `--ink` / `--muted` | `#3b302d` / `#6b5f59` | body text / secondary text (dates) |

## Type
- Body: **Figtree** (readable). Accent: **Gaegu** (handwritten; headings, notes, labels). Loaded from Google Fonts in `index.html`.

## Structure (one scrolling page, `index.html`, no top nav)
1. **Hero** (butter bg): "Hi, I'm Angela!" / "cs '28 @ cornell", quick links (Resume, Email, LinkedIn, GitHub), stop-motion sticker of Angela. No callout label next to the sticker.
2. **Work** (`#work`, pink bg): two groups, experience then projects. Each entry is a taped print (image) next to the title, a small muted date, and a 1-line description. The copy is Angela's exact text (lowercase titles), so don't rewrite it.
   - Experience: TPM intern @ mastercard, president of design consulting @ cornell, UX & research intern @ ptc.
   - Projects: docupal (developer and designer), microsoft (contract designer), pinpoint (designer, no date).
3. **The tin** (`#tin`, sage bg), centered: real photos of her tin, flattened. Closed → wiggle (1.4s) → pop (0.35s) → lid swings up on a hinge (1.5s) showing the "AW" inside, and the tray slides down. Then 5 charms appear inside the tray: sushi, yoga, smiski (placeholder spot for her own photo), traveling, crafting. Notes appear on hover (desktop) or tap (mobile). Note text is still a placeholder like "[sushi description]".
4. **The wall** (`#wall`): photo collage placeholder (prints, photobooth strip, pins, stars).
5. **Contact / footer** (`#contact`, butter bg).

## Files
- `index.html`: all content. Placeholders have `class="ph"` (gray italic, in [brackets]) plus `<!-- TODO -->` comments. Remove `ph` once real content is in.
- `src/style.css`: all styles, numbered sections matching the page.
- `src/main.js`: tin state machine (`data-state` = closed / wiggle / pop / open) + tap-to-show notes.
- `public/images/me_photo{1,2,3}.png`: hero frames. Already trimmed, scaled to the same height, aligned so the boots sit on one baseline (shared 696×1180 canvas, 40px transparent padding for the outline), and quantized to ~120KB each.
- `public/images/work/*.jpg`: experience photos cropped to 3:2 (900×600) and project mockups to 16:10 (960×600), JPEG q80.
- `public/images/tin_lid_top.jpg`, `tin_lid_inside.jpg`: perspective-flattened crops of the tin photos (1000×660). CSS rounds the corners.
- `images/`: original source photos (HEIC/JPG/PNG). **HEICs from an iPhone carry an EXIF rotation**: apply it when converting (e.g. Pillow `ImageOps.exif_transpose`), or the photo comes out sideways.
- `public/resume.pdf`: **not added yet**. All resume links point here.

## Implementation notes
- Hero stop-motion: 3 stacked `<img>`s, `animation: frame-cycle 2.1s steps(1, end) infinite` with delays 0 / -1.4s / -0.7s, giving a hard cut every 0.7s. The sticker outline is the SVG `#sticker` filter (feMorphology dilate → blur → threshold → white, plus a drop shadow) applied to `.me-sticker`.
- If hero photos are replaced, re-run the same pipeline (sips HEIC→PNG, trim to alpha bbox, equal height, center on the feet, bottom-align on a shared canvas) or the frames will jump.
- Tin lid uses a 3D hinge flip (`rotateX(180deg)`, `transform-origin` at the top edge, `backface-visibility`). **Never put `filter` on `.tin__lid` or its ancestors**: it flattens the 3D and both faces show. Shadows on `.lid-face` use `box-shadow`.
- Charms use the `#sticker-sm` SVG filter (thinner version of the hero outline). Position each with `--x/--y` (percent of the tray), tilt with `--r`, set the order they appear with `--i`, and pick the side its note pops out on with `data-side`.
- `prefers-reduced-motion`: all animation is off, the hero shows frame 1, and the tin starts open.
- Keep it responsive. Breakpoints are ~820px (hero stacks) and 600px (work entries stack). No horizontal scroll at 390px.
- Keep code simple and commented. Angela edits it herself.

## Commands
`npm run dev` (http://localhost:5173), `npm run build`, `npm run preview`.

## Where we left off (2026-11-22)
- Done: new 3-color theme, nav removed, new hero text, work section with real copy + images, tin rebuilt from real photos with a slower hinge reveal and hover/tap notes.
- Still placeholder: charm notes ("[sushi description]" etc.), smiski photo, email/LinkedIn/GitHub URLs, `public/resume.pdf`, the wall photos, the contact blurb.

### Next steps
1. Angela writes the charm notes and drops in a transparent PNG of her smiski (see the TODO in the tin markup).
2. Add real links + `public/resume.pdf`.
3. Build "the wall" with real prints and photobooth strips.
4. Polish + deploy: favicon (AW tiles), share-preview image, then deploy to Netlify or Vercel.
