# Favicon pipeline (not served)

The live favicon is the script "AW" (Mrs Saint Delafield, dusty rose), built from the font's real glyph outlines
(an SVG favicon can't load web fonts). The A's far-left tail and the W's far-right flourish are cropped off by the
square viewBox (x 230–1870 font units) so the letters can be ~30% bigger; a same-color stroke thickens them.

1. `1-glyphs.py msd.ttf > aw-glyphs.json`: AW outlines as one SVG path (get the TTF from Google Fonts).
2. `2-favsvg.py aw-glyphs.json out.svg LEFT RIGHT STROKE [bg]`: square icon SVG. Used:
   - `public/favicon.svg`: 230 1870 120
   - PNGs: 16px → stroke 150, 32 → 105, 48 → 85, 64 → 75 (smaller icons need heavier strokes)
   - apple-touch-icon 180: 160 1940 55 '#F0E5DB' (Soft Sand background; iOS shows transparency as black)
3. `node 3-rasterize.mjs SIZE in.svg out.png`: exact-size PNG via Chrome (needs puppeteer-core).
   `favicon.ico` = the 16/32/48 PNGs (Pillow).
4. `4-preview.py out.png "name=16.png,32.png" ...`: tab-size preview next to typical solid favicons.

`index.html` links: favicon.ico (fallback) + favicon.svg (main) + apple-touch-icon. `favicon-16/32.png` and
`favicon.png` (64) are kept as files (the .ico is built from them) but not linked separately, because Chrome
tends to pick sized PNGs over the SVG. After changing the icons, bump `?v=` on the `<link>`s.
`script/` is an older, unused rounded-square variant.
