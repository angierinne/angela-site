# Angela Wang — personal site

Single-page personal site for Angela Wang, a CS student (Cornell). Vite + vanilla HTML/CSS/JS. No framework.

## Two audiences
1. **Recruiters**: must get name, one-liner, resume, and contact in the first 5 seconds. Experience and projects must be easy to scan (role, place, dates, 1–2 lines).
2. **Angela**: it should feel personal and creative, not like a corporate template.

## Sticker book (layered on the lookbook, since 2026-11-22)
- Personal images are presented as real **photo stickers**: white sticker border, soft shadow, slight tilt (about -4° to 4°, varied), playful bouncy motion. Same family as the hero cutout (SVG `#sticker` filter) and the tin items (`#sticker-item`).
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
- **Anton** (`.poster`): big uppercase type in Mocha Green: "ANGELA" only.
- **Mrs Saint Delafield** (`.script`): dusty rose signature script, layered over/across headlines. It's thin, so always use it LARGE.
  - **Script text must never be clipped.** Its swashes and descenders reach far outside the line box. Always give it room: anything that writes in (`.writes`, whose mask only covers the element's own box) gets `--room` (.55em) of padding above and below, cancelled by negative margins so layout doesn't move. If you set `padding` on a `.writes` element, keep `var(--room)` top and bottom. Never put `overflow: hidden` or a tight height on script text. Watch out: a negative margin next to it collapses into its negative margin instead of adding.
  - **Only for short accents (1–3 words)**: "lately", "where I’ve worked", item names on tin notes, "AW". Any sentence people need to read uses Afacad. `.script` adds a Soft Sand outline (`-webkit-text-stroke` + `paint-order`) so it stays readable where it crosses green letters.
  - Its apostrophe has wide built-in spacing. Write `’` wrapped in `<span class="apos">’</span>` so "What’s" doesn't gap.
- **Afacad**: all body text and small labels. `.label` = tiny uppercase, letter-spaced labels.
- Roycella was removed completely (the original download is still in `roycella-font/`, git-ignored and unused).

## Brand mark: "AW" signature
- Dusty Rose Mrs Saint Delafield "AW", like she signed the page.
- Used: small in the top-left of the hero (`.mark`, no nav bar), as the favicon (`public/favicon.png`, `public/apple-touch-icon.png`, rendered from the font), and as the sign-off at the very bottom (`.signoff`).

## Editorial details (use consistently, sparingly)
- Tiny uppercase Afacad labels for texture: "MY WORK", "CS '28". **No section counters.** Tag pills under work stickers: Mocha Green fill + sand text for experience tags; PROJECT = light rose fill (`--rose-tint`) + rose border + Mocha Green text (rose itself is too light behind small text).
- Thin Mocha Green hairlines (1px `--ink`) separate things instead of boxes or cards.
- Script notes: small dusty rose Mrs Saint Delafield notes with a tiny hand-drawn arrow (`<use href="#hand-arrow">`, an SVG symbol in the hidden defs, points down-left; flip with CSS). Used beside the work rows and on the tin items. The arrow draws in with `stroke-dashoffset` (its paths use `pathLength="1"`).
- Small dusty rose `///` tick marks (`.tick`) before section labels.
- Links: plain text; a dusty rose underline draws in from the left on hover (`.links a::after`).

## Page structure (one scrolling page, `index.html`)
1. **Hero** (`#top`): AW mark top-left (no other top labels). Huge "ANGELA" (Anton). The stop-motion sticker stands IN FRONT of the letters, over the right leg of the final A so the name still reads. Dusty rose script "Hi, I’m" is rotated across the top of ANGELA. Below: "/// CS '28 @ Cornell" label, "I like products, and I like people." (strong secondary line), a short quiet paragraph, and minimal links: Email (`mailto:aw858@cornell.edu`), LinkedIn (`https://www.linkedin.com/in/angela-wang-3b6767212/`), GitHub (`https://github.com/angierinne`). LinkedIn/GitHub open in a new tab (`target="_blank" rel="noopener noreferrer"`). **No Resume link.**
   - Desktop: the hero does NOT fill the screen (no `min-height: 100svh`); the links → "My work" gap is a fixed ~136px (hero padding-bottom 56px + `#work` padding-top 80px, inside `@media (min-width: 769px)`). Phones: 68px.
   - Entrance (~1.5s): ANGELA's letters rise in → the script writes in (mask wipe) → `[data-rise]` lines fade up in sequence.
2. **My work** (`#work`): small header ("/// MY WORK" label + dusty rose script "lately"). Two STATIC rows of 3 photo stickers, placed by hand (not a rigid grid):
   - Row 1 (experience): Design Consulting at Cornell (LEADERSHIP · President · 2026 – Present), Mastercard (INTERNSHIP · Technical Product Management Intern · 2026), PTC (INTERNSHIP · User Experience and Research Intern · 2025). Script note "where I’ve worked" + arrow on its RIGHT; the row sits slightly left.
   - Row 2 (projects): DocuPal (PROJECT · Developer and Designer · 2026), Microsoft Copilot for Sales (PROJECT · Contract Designer · 2025), Pinpoint (PROJECT · Designer · 2024).
   - Wide screens: each note's arrow tip points at the middle of the photo next to it (PTC / DocuPal). The CSS works this out from the sticker size (`--card-h`, container units) and that sticker's `--y` (`--aim-y`); if you change PTC's or DocuPal's `--y`, update `--aim-y` too. Script note "things I’ve made" + arrow on its LEFT; the row sits slightly right.
   - Each sticker: 4:3 photo with a white border + shadow, tilt `--tilt` (-4° to 4°), vertical wave offset `--y`, slap-in order `--i`. Underneath: tag pill, name and role · year at 17px (same as the landing paragraph).
   - Motion: on scroll each row's stickers get "slapped on" one by one (drop from above, a bit bigger and more tilted, land, bounce, settle), then the note fades in and its arrow draws in.
   - Flip (main.js adds `.is-flipped`): on desktop the cursor has to rest in the middle ~70% of the photo for ~150ms (edges ignored, so sweeping across the row doesn't flip everything). The sticker straightens, lifts and flips (3D) to a Soft Sand back with the name + description, and its neighbors nudge away (CSS `:has()`). It stays flipped anywhere on the sticker and flips back when the cursor leaves. Phones: tap to flip, tap again to flip back. Keyboard: focusing the card flips it.
   - Back links (small Afacad + ↗, rose underline on hover, new tab): DCC "Website", DocuPal "Demo", Microsoft "Case Study", Pinpoint "Case Study". The card is a focusable `<div>` (not a `<button>`, which can't hold links). The back only takes clicks while showing; tapping a link doesn't flip the card back.
   - Layout: ≤1000px the notes move above each row (arrow pointing down at it). ≤768px (phones) each row is a manually swipeable strip with scroll-snap: one sticker fully visible (86% wide), the next peeking in from the right; NO auto-slide. Dots under each row (built in main.js: rose = current, Mocha Green outline = others; tap a dot to jump). A swipe never flips a sticker; only a tap does (main.js checks how far the row scrolled / the finger moved). Neighbor nudge is off on phones.
   - Description text must fit inside the sticker (back font sizes use container query units `cqi`). If text grows, make the stickers bigger rather than cutting text.
   - **Skills ticker** at the bottom of the section, under the projects row: small Afacad uppercase, letter-spaced, Mocha Green, dusty rose `·` separators, a faint hairline above. Slow drift left (~34px/s, speed set from its width in main.js), pauses on hover, static with reduced motion. Written twice in the HTML for a seamless loop (edit both copies). No Anton.
   - (Removed: the auto-sliding carousel, the big interests marquee.)
3. **Finale: What’s in my tin?** (`#tin`): dusty rose script title + "A few of my favorite things" (Afacad) + on phones only a small hint "Tap the stickers" (`.tin-head__hint`). A stage (`.toss-stage`) with the DRAWN tin centered (original SVG inspired by her real tin; the photos have fingers/jeans covering the edges, so they can't be cut out cleanly). On phones (≤768px) the tin sits at the top and the items land in a tight "just spilled out" cluster right under it: 4 on top, 3 below, offset so they interlock (spread to the stage edges, rows ~20% apart beyond the item height), small tilts, never on the tin or each other (`clusterSpots()` in main.js, worked out from the real tin + item sizes). The stage is only as tall as the open tin + the two rows, and "Shake the tin" sits right below. Shaking re-scatters into the same cluster.
   - Sequence: closed → small wiggle → lid lifts → swings open on a hinge (inside of lid shows AW) → the 7 items POP OUT of the tray one by one and scatter around the tin, each landing at a random tilt with a bounce. Spots are random but balanced (3–4 per side on desktop) from the `SPOTS` lists in main.js; nothing overlaps the tin, the title, or each other.
   - Items (all with a white sticker border, `#sticker-item` filter): sushi, yoga, traveling, smiski (her photo), candles, crafting (a crochet yarn ball + hook), walks. Notes (on hover / tap) have two lines: the item name as a dusty rose script label ("sushi", "yoga", "traveling", "smiski", "candles", "crafting", "walks"), then the note in Afacad 16px (15px on phones), Mocha Green, plus a tiny arrow at the item. `placeNote()` in main.js tries above / below / left / right with small slides and picks the spot that stays inside the stage and clear of other items. On phones the note opens just above the tapped item (below only if there's no room on screen), fully on screen and in front of its neighbors, with a soft Soft Sand glow behind it (no box). Note text: Sushi "Toro nigiri and lots of tuna", Yoga "Flowing to savasana", Traveling "Favorite city so far: Barcelona!", Smiski "I have 14 in my room", Candles "Currently burning: warm vanilla", Crafting "I crochet bags and plushies", Walks "Daily walks while Ithaca weather allows".
   - Play: drag items with a mouse/pen (kept inside the stage); drop one on the tin and it goes back inside. Touch dragging is off so it doesn't fight page scrolling (tap shows the note). "Shake the tin" (Afacad, rose underline) collects every item, shakes the tin, and scatters them to new spots.
4. **Footer** (`#contact`): dusty rose script "Thanks for visiting!" at the same size as "lately" (writes in on scroll, a calm gap after "Shake the tin": `#tin` padding-bottom is smaller than other sections), then the hairline row (name, contact links, ©), then a quiet "AW" signature at the same size as the top-left AW mark (46px).

## Motion rules
- Smooth, confident, editorial: slides, reveals, writing-in, using `--ease` (ease-out) / `--ease-io` (ease-in-out) with no overshoot. Never chaotic.
- The ONE exception: stickers (work photos + tin items) get a small, polished bounce (`--bounce`): slap-on, lift, flip, neighbor nudge, toss, shake.
- Always respect `prefers-reduced-motion`: everything shows its final state, the hero shows frame 1, the ticker is static, work stickers don't slap/nudge/flip (description fades instead), the tin starts open with items already in place (no toss/scatter/shake; the shake button just re-places them), notes still work.
- Check desktop (1400px), tablet (~900px) and phone (390px) widths. No horizontal scroll.

## Files
- `index.html`: all content.
- `src/style.css`: all styles, numbered sections.
- `src/main.js`: hero entrance (letter split + stagger), scroll reveals (`[data-reveal]` → `.is-in`), skills ticker speed, sticker tap-to-flip on touch screens, tin state machine (`data-state` = closed / wiggle / pop / open), item toss/scatter, notes, drag, drop-into-tin, shake.
- `public/images/me_photo{1,2,3}.png`: hero frames, already trimmed, scaled to the same height, aligned on one baseline (shared 696×1180 canvas, 40px transparent padding for the outline), quantized to ~120KB each.
- `public/images/stickers/*.jpg`: the 6 work photos, all cropped to 4:3 (640×480), JPEG q80. `mastercard.jpg` was brightened ~20% with a gamma-0.75 curve (lifts shadows and mids, never clips highlights); the pre-brightening version is in `images/backup/mastercard_original.jpg`. `microsoft.jpg` is a left-anchored 4:3 crop of `images/microsoft.png` with a margin around the Microsoft logo (bottom-left) so the sticker border never clips it; the img also has `object-position: left bottom`. The previous crop is in `images/backup/microsoft_previous.jpg`.
- `public/images/tin/*.svg`: lid top, lid inside, tray. `public/images/charms/`: the tin items: original drawings (`sushi`, `yoga`, `travel`, `candles`, `craft` = crochet yarn ball, `walks` `.svg`) + `smiski.png` (her photo, trimmed to 245×324, transparent). Don't draw the Smiski character; use her photo.
- `images/`: original source photos (not served). **iPhone HEICs carry an EXIF rotation**: apply it when converting (Pillow `ImageOps.exif_transpose`), or the photo comes out sideways.

## Implementation notes
- Hero stop-motion: 3 stacked `<img>`s, `animation: frame-cycle 2.1s steps(1, end) infinite` with delays 0 / -1.4s / -0.7s, giving a hard cut every 0.7s. The sticker outline is the SVG `#sticker` filter (feMorphology dilate → blur → threshold → white, plus a drop shadow) applied to `.me-sticker`. **Keep this exactly as is.**
- If hero photos are replaced, re-run the same pipeline (HEIC→PNG, trim to alpha bbox, equal height, center on the feet, bottom-align on a shared canvas) or the frames will jump.
- "Writing in" = a left-to-right CSS mask wipe (`.writes`, `@keyframes write`). It runs when the element (or its `[data-reveal]` parent) gets `.is-in`. The hero script runs on `.hero.is-ready`.
- Tin lid uses a 3D hinge flip (`rotateX(180deg)`, `transform-origin` at the top edge, `backface-visibility`). **Never put `filter` on `.tin__lid` or its ancestors**: it flattens the 3D and both faces show. Shadows go on each `.lid-face`.
- The smiski photo is taller than the drawings, so `.toss__art--photo` sizes it by height to match.
- Tin items: absolutely positioned at the stage's top-left and moved with the `translate` / `scale` properties (the bouncy transition does the toss). Their tilt is `--r` on `.toss__art` (not the button), so notes stay level. Positions are stored as the item CENTER in stage fractions, so they survive resizes; crossing the 768px breakpoint re-scatters. `.no-anim` places things instantly. Notes open above / below / left / right (`data-v`), aligned start / center / end (`data-h`), plus a small slide (`--nx` / `--ny`), all chosen by `placeNote()`. Stage height: `clamp(660px, 58vw, 780px)`; on phones it's the open tin + 190px (`#tin` is a size container, so `100cqi` = its width).
- Work rows: the slap-on animation runs on the `<li>` (`translate`/`scale`/`rotate`, fill forwards), the neighbor nudge on `.sticker__body`, the tilt/lift on `.sticker__card`, so the three never fight. The generic fade-up reveal skips `.work-group`.
- Sticker flip: `.sticker__card` holds the tilt/lift (`rotate`/`translate` properties) and `perspective`; each face (`.sticker__front`, `.sticker__back`) rotates on its own with `backface-visibility: hidden`. Never put `filter` on the card (it flattens 3D); shadows are `box-shadow` on the faces. The pop-in animates the outer `<li>` (`scale`/`translate`), so it doesn't fight the hover lift.
- Breakpoints: 1000px (work notes above rows), 768px = phones (hero stacks with tighter spacing, swipeable work rows + dots, tin cluster). **Desktop must not change when editing phone styles**: put phone-only changes inside `@media (max-width: 768px)`.
- Taps vs hover: main.js decides per tap (`isTouchTap()`: the event's pointer type, the last pointerdown's type, and a LIVE `(hover: hover)` check), never once at load. So taps open tin notes / flip stickers on phones, touch laptops and in the browser's device mode, while mouse hover keeps working.
- Keep code simple and commented. Angela edits it herself.

## Commands
`npm run dev` (http://localhost:5173), `npm run build`, `npm run preview`.

## Where we left off (2026-11-24)
- **State:** feature-complete for a first launch, all committed. Hero, "My work" (hand-placed sticker rows on desktop, swipeable rows with dots on phones, flip-to-description with links on the backs), the tin finale (toss-and-scatter on desktop, spilled-out cluster on phones), and the footer.
- **Latest round (2026-11-24):** footer scaled down ("Thanks for visiting!" = "lately" size, AW = header mark size, smaller gap after the tin); desktop landing gap fixed at ~136px (was 272px+ and grew with screen height because the hero filled the screen); Microsoft renamed "Microsoft Copilot for Sales" and re-cropped so its logo is fully visible; phones: roomier tin cluster, "Tap the stickers" hint, and the tap-to-open-note bug fixed (hover was detected once at load, so taps were ignored on touch laptops / device mode).
- **Earlier (2026-11-23):** script swashes no longer clipped (`.writes` `--room`); "Thanks for visiting!" added; phone layout (tighter hero, swipe rows + dots, tin cluster).
- **Earlier (2026-11-22):** new landing paragraph; arrows aimed at PTC / DocuPal; calmer flip; back links; two-line tin notes; removed the marquee, counters, carousel and "Ithaca, NY".
- **How it was checked:** puppeteer (system Chrome) at 1440 / 1100 / 900px and 390 / 430px with touch emulation (+ a touch-enabled 1200px screen), plus reduced motion. Checks: no horizontal scroll, no sticker/tin overlaps, notes open on tap and stay on screen, one note at a time, desktop hover notes, swipe doesn't flip, links clickable when flipped, no console errors.

### Open questions for Angela
- "DocuPal" spelling.
- The tin hint is "Tap the stickers" (sentence case, per the brand rule); say if you want it all lowercase.
- The rose script headline "What’s in my tin?" is large but low contrast (~2.1:1). It's mostly decorative.
- Favicon script is thin at 16px tab size.
- On phones the sticker covers part of the final "A" in ANGELA.
- Phone tin cluster: within a row the items can only spread to the screen edges, so gaps grew ~20–50% but the center-to-center distance only ~4%; the rows are ~20% further apart.
- On phones a tap note covers its neighbors behind a soft sand glow; over the tin's shadow the glow can read as a faint lighter patch.
- Tablet (769–1000px) tin notes: in rare crowded random layouts a note's corner can brush another item's box by a few px.
- Flipped-sticker back text is small on tablets (~12.5px).

### Next steps
1. Answer the open questions above.
2. Test on a real iPhone (swipe feel, tap-to-flip, tin notes, Safari's script rendering).
3. Share-preview image + meta tags (title, description, Open Graph / Twitter card).
4. Deploy to Netlify or Vercel (`npm run build`, output in `dist/`), then check the live site at all widths.
