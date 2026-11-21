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
| token | hex | use |
|---|---|---|
| `--pink` / `--pink-deep` | `#e7b7b9` / `#c9868b` | dusty pink, accents, handwritten notes |
| `--butter` | `#f6e6b4` | buttercream, tape, contact block |
| `--sage` / `--sage-deep` | `#a4a979` / `#6f7548` | sage olive, place names, focus rings |
| `--paper` / `--card` | `#fbf7f0` / `#fffdf9` | background / cards |
| `--ink` / `--muted` | `#3b302d` / `#7a6c66` | text |

## Type
- Body: **Figtree** (readable). Accent: **Gaegu** (handwritten; headings, notes, labels). Loaded from Google Fonts in `index.html`.

## Structure (one scrolling page, `index.html`)
1. **Hero**: name, one-liner, quick links (Resume, Email, LinkedIn, GitHub), short about, stop-motion sticker of Angela.
2. **Experience** (`#experience`): TPM Intern @ Mastercard; President, design consulting @ Cornell; UX & Research Intern @ PTC.
3. **Projects** (`#projects`): DocuPal (developer & designer), Microsoft Copilot for Sales (contract product designer), PinPoint (designer). Image slots are placeholders.
4. **The tin** (`#tin`): illustrated SVG of her real tin. On scroll into view the lid wiggles, pops off and flips to show "AW", and interest stickers rise out. Hover/tap shows a one-sentence note. Interests: sushi & food, hot pot, pickles, yoga, smiskis, candles, crafting, traveling, Barcelona (fav place).
5. **The wall** (`#wall`): photo collage placeholder (prints, photobooth strip, pins, stars).
6. **Contact / footer** (`#contact`).

## Files
- `index.html`: all content. Placeholders have `class="ph"` (gray italic, in [brackets]) plus `<!-- TODO -->` comments. Remove `ph` once real content is in.
- `src/style.css`: all styles, numbered sections matching the page.
- `src/main.js`: tin open/close logic only (IntersectionObserver + state classes).
- `public/images/me_photo{1,2,3}.png`: hero frames. Already trimmed, scaled to the same height, aligned so the boots sit on one baseline (shared 696×1180 canvas, 40px transparent padding for the outline), and quantized to ~120KB each. Original HEICs are in `images/`.
- `public/resume.pdf`: **not added yet**. All resume links point here.

## Implementation notes
- Hero stop-motion: 3 stacked `<img>`s, `animation: frame-cycle 2.1s steps(1, end) infinite` with delays 0 / -1.4s / -0.7s, giving a hard cut every 0.7s. The sticker outline is the SVG `#sticker` filter (feMorphology dilate → blur → threshold → white, plus a drop shadow) applied to `.me-sticker`.
- If hero photos are replaced, re-run the same pipeline (sips HEIC→PNG, trim to alpha bbox, equal height, center on the feet, bottom-align on a shared canvas) or the frames will jump.
- Tin lid uses a 3D flip (`backface-visibility`). **Never put `filter` on `.tin__lid`**: it flattens the 3D and both faces show. Shadows go on `.lid-face`.
- `prefers-reduced-motion`: all animation is off, the hero shows frame 1, and the tin starts open.
- Keep it responsive. Breakpoints are ~820px (hero stacks), 760px (tin stacks), and 640px (nav trims). No horizontal scroll at 390px.
- Keep code simple and commented. Angela edits it herself.

## Commands
`npm run dev` (http://localhost:5173), `npm run build`, `npm run preview`.

## Where we left off (2026-11-21)
- Done: Vite setup, full 6-section skeleton, finished hero (stop-motion sticker, quick links), tin animation with hover notes, responsive layout + reduced-motion.
- Still placeholder: experience dates/descriptions, project descriptions/tech/links/images, about blurb, email/LinkedIn/GitHub URLs, `public/resume.pdf`, the wall photos.

### Next steps
1. Angela fills in real content (search `index.html` for `ph` / `TODO`) and adds `public/resume.pdf` + project images.
2. Build "the wall" with real prints and photobooth strips (maybe a hover tilt on each).
3. Polish + deploy: share-preview image, favicon (AW tiles), then deploy to Netlify or Vercel.
