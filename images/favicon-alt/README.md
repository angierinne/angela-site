# Favicon pipeline (not served)

The live favicon is the script "AW" (Mrs Saint Delafield, dusty rose), built from the font's real glyph outlines
(an SVG favicon can't load web fonts). The A's far-left tail and the W's far-right flourish are cropped off by the
square viewBox (x 300–1800 font units) so the letters are ~42% bigger. The strokes are the font's ORIGINAL thin
strokes (matching the AW in the header); only the 16px PNG gets a hairline outline (45 units ≈ half a pixel) so it
doesn't disappear. (v4 had a thick outline at every size; it looked too heavy and was dropped.)

1. `1-glyphs.py msd.ttf > aw-glyphs.json`: AW outlines as one SVG path (get the TTF from Google Fonts).
2. `2-favsvg.py aw-glyphs.json out.svg LEFT RIGHT STROKE [bg]`: square icon SVG (STROKE 0 = no outline). Used:
   - `public/favicon.svg`, 32 / 48 / 64px PNGs: 300 1800 0
   - 16px PNG: 300 1800 45 (hairline, 16px only)
   - apple-touch-icon 180: 300 1800 0 '#F0E5DB' (Soft Sand background; iOS shows transparency as black)
3. `node 3-rasterize.mjs SIZE in.svg out.png`: exact-size PNG via Chrome (needs puppeteer-core).
   `favicon.ico` = the 16/32/48 PNGs (Pillow).
4. `4-preview.py out.png "name=16.png,32.png" ...`: tab-size preview next to typical solid favicons.
   `preview-tabs.png` = v5 (live) vs the thin original vs v4 (thick).

`index.html` links: favicon.ico (fallback) + favicon.svg (main) + apple-touch-icon. `favicon-16/32.png` and
`favicon.png` (64) are kept as files (the .ico is built from them) but not linked separately, because Chrome
tends to pick sized PNGs over the SVG. After changing the icons, bump `?v=` on the `<link>`s.
`script/` is an older, unused rounded-square variant.
