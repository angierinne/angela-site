# Angela Wang — personal site

Single-page personal site for Angela Wang, a CS student (Cornell). Vite + vanilla HTML/CSS/JS. No framework.

## Two audiences
1. **Recruiters**: must get name, one-liner, resume, and contact in the first 5 seconds. Experience and projects must be easy to scan (role, place, dates, 1–2 lines).
2. **Angela**: it should feel personal, creative, and handmade, not like a corporate template.

## Direction (since 2026-11-22; replaces the old scrapbook style)
- Minimal and simple, but creative in placement and movement: a mostly empty light canvas, one script display font for big moments, small quiet supporting text, and a few real objects (the sticker cutout of Angela, her tin) placed with intent.
- **No scrapbook styling**: no photo frames, washi-tape titles, polaroids, dotted paper, or colored section blocks.
- Sentence/title case everywhere (no all-lowercase style). Dates use an en dash: "June 2026 – August 2026".
- Motion is smooth and intentional, never bouncy or chaotic (ease-out / ease-in-out curves, no overshoot). Always respect `prefers-reduced-motion` (show the final state).
- Don't draw copyrighted characters (e.g. Smiski); use original shapes or her own photos.

## Palette (tokens in `:root` in `src/style.css`)
| token | hex | use |
|---|---|---|
| `--bg` | `#FAF5E8` | the ONE background for the whole page (soft buttercream off-white) |
| `--ink` | `#1f1a17` | strong dark: body text + display titles |
| `--muted` / `--soft` | `#5f5650` / `#8a807a` | supporting text / dates and captions |
| `--pink` | `#F3D9D8` | accent only (link underlines, disc behind the hero sticker, charms) |
| `--sage` / `--sage-deep` | `#A5A17B` / `#67633f` | accent only; `--sage-deep` for small text like "CS '28 @ Cornell" |

## Type
- **Roycella** (script, self-hosted at `public/fonts/Roycella.woff2`, converted from `roycella-font/`, which is git-ignored): ONLY for big titles: "Hi, I'm Angela!", "Experience", "Projects", "What's in my tin?", "Let's chat". Use the `.display` class, which adds padding + line-height so swashes have room. Keep it large.
  - It has straight `'` `!` `?` but NO curly apostrophe (’) or en/em dashes. Use a straight `'` in Roycella text.
  - License: demo version, "free for personal use only, no commercial use". A commercial license is at letterhend.com.
- **Afacad** (Google Fonts) for everything else: 600 for role titles and the "I like products…" line, 400 for body.

## Structure (one scrolling page, `index.html`)
1. **Hero**: "Hi, I'm Angela!" (Roycella, huge) → "CS '28 @ Cornell" → "I like products, and I like people." (strong secondary line) → short paragraph → minimal text links (Resume, Email, LinkedIn, GitHub). Stop-motion sticker on the right, with a pink disc behind it. Entrance: name letters rise in one by one, then lines fade up (~1.4s total).
2. **Experience** (`#experience`) and **Projects** (`#projects`): entries alternate image left/right, images tilted (`--tilt`) and pushing slightly into the text column. Role title is the strongest text, dates small. Images "print" out of a thin slot on scroll, then float gently and lift on hover.
3. **What's in my tin?** (`#tin`), centered: a DRAWN tin (SVGs in `public/images/tin/`: `lid-top.svg`, `lid-inside.svg`, `tray.svg`), an original illustration inspired by her real tin. Closed → small wiggle → lid lifts → swings open on a hinge to show the inside of the lid (AW) → charms fade in: sushi, yoga, smiski (placeholder slot for her photo), traveling, crafting (SVGs in `public/images/charms/`). Notes show on hover (desktop) or tap (mobile); text is still a placeholder.
4. **Contact / footer** (`#contact`): "Let's chat" + links.
(The "wall" collage section was removed.)

## Files
- `index.html`: all content. Placeholders: `[... description]` charm notes, `you@example.com`, `YOUR-HANDLE` links, `<!-- TODO -->` comments.
- `src/style.css`: all styles, numbered sections.
- `src/main.js`: hero entrance (letter split + stagger), scroll reveals + printing images, tin state machine (`data-state` = closed / wiggle / pop / open), tap-to-show notes.
- `public/images/me_photo{1,2,3}.png`: hero frames, already trimmed, scaled to the same height, aligned on one baseline (shared 696×1180 canvas, 40px transparent padding for the outline), and quantized to ~120KB each.
- `public/images/work/*.jpg`: experience photos at 3:2 (900×600), project mockups at 16:10 (960×600), JPEG q80.
- `images/`: original source photos. **iPhone HEICs carry an EXIF rotation**: apply it when converting (Pillow `ImageOps.exif_transpose`), or the photo comes out sideways.
- `public/resume.pdf`: **not added yet**. All resume links point here.

## Implementation notes
- Hero stop-motion: 3 stacked `<img>`s, `animation: frame-cycle 2.1s steps(1, end) infinite` with delays 0 / -1.4s / -0.7s, giving a hard cut every 0.7s. The sticker outline is the SVG `#sticker` filter (feMorphology dilate → blur → threshold → white, plus a drop shadow) applied to `.me-sticker`.
- If hero photos are replaced, re-run the same pipeline (sips HEIC→PNG, trim to alpha bbox, equal height, center on the feet, bottom-align on a shared canvas) or the frames will jump.
- Tin lid uses a 3D hinge flip (`rotateX(180deg)`, `transform-origin` at the top edge, `backface-visibility`). **Never put `filter` on `.tin__lid` or its ancestors**: it flattens the 3D and both faces show. Shadows go on each `.lid-face` (a drop-shadow filter on the face itself is fine).
- Printing images: `.shot__window` clips only its top edge while the photo slides down out of it. After printing, JS adds `.is-printed`, which removes the clip and starts the float. Hover lift uses the `translate` property so it doesn't fight the print `transform`.
- The hero name is split into letter spans by JS. Roycella has no ligatures (no GSUB), so splitting doesn't break any letter joins.
- Charms use the `#sticker-sm` SVG filter (thinner version of the hero outline). Position each with `--x/--y` (percent of the tray), tilt with `--r`, set the order they appear with `--i`, and pick the side its note pops out on with `data-side`.
- `prefers-reduced-motion`: all animation is off, everything shows in its final state, the hero shows frame 1, and the tin starts open.
- Keep it responsive. Breakpoints are 860px (hero stacks) and 720px (work entries stack). No horizontal scroll at 390px.
- Keep code simple and commented. Angela edits it herself.

## Commands
`npm run dev` (http://localhost:5173), `npm run build`, `npm run preview`.

## Where we left off (2026-11-22)
- Done: minimal redesign (one background, Roycella + Afacad, no scrapbook styling), new hero copy + entrance animation, alternating "printing" work entries, wall section removed, tin redrawn as SVG with a slower hinge reveal.
- Still placeholder: charm notes, smiski photo, email/LinkedIn/GitHub URLs, `public/resume.pdf`.

### Next steps
1. Angela writes the charm notes and adds a transparent PNG of her smiski (see the TODO in the tin markup).
2. Add real links + `public/resume.pdf`.
3. Decide on the Roycella license (personal-use demo) before treating the site as anything commercial.
4. Polish + deploy: favicon, share-preview image, then deploy to Netlify or Vercel.
