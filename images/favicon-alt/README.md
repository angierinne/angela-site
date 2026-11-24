# Favicon pipeline (not served)

The live favicon is the script "AW" (Mrs Saint Delafield, dusty rose), built from the font's real glyph outlines
(an SVG favicon can't load web fonts). The COMPLETE AW is shown (nothing cropped), scaled to fit the square edge to
edge with a hairline margin (viewBox x -140 to 2074 font units). The strokes are ~20% bolder than the font's own
(average stroke ≈ 31 units, so a 6.2-unit same-color outline); the 16px PNG gets a 60-unit outline so it stays visible.
(History: v4 thick outline + cropped tails, v5 thin + tighter crop; both dropped.)

1. `1-glyphs.py msd.ttf > aw-glyphs.json`: AW outlines as one SVG path (get the TTF from Google Fonts).
2. `2-favsvg.py aw-glyphs.json out.svg LEFT RIGHT STROKE [bg]`: square icon SVG (STROKE 0 = no outline). Used:
   - `public/favicon.svg`, 32 / 48 / 64px PNGs: -140 2074 6.2
   - 16px PNG: -140 2074 60
   - apple-touch-icon 180: -200 2134 6.2 '#F0E5DB' (Soft Sand background; iOS shows transparency as black)
3. `node 3-rasterize.mjs SIZE in.svg out.png`: exact-size PNG via Chrome (needs puppeteer-core).
   `favicon.ico` = the 16/32/48 PNGs (Pillow).
4. `4-preview.py out.png "name=16.png,32.png" ...`: tab-size preview next to typical solid favicons.
   `preview-tabs.png` = v6 (live) vs v5.

`index.html` links: favicon.ico (fallback) + favicon.svg (main) + apple-touch-icon. `favicon-16/32.png` and
`favicon.png` (64) are kept as files (the .ico is built from them) but not linked separately, because Chrome
tends to pick sized PNGs over the SVG. After changing the icons, bump `?v=` on the `<link>`s.
`script/` is an older, unused rounded-square variant.
