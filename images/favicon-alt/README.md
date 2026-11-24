# Favicon pipeline (not served)

The live favicon is just the script "A" from the AW (Mrs Saint Delafield, dusty rose, transparent), built from the
font's real glyph outline (an SVG favicon can't load web fonts). The complete A is shown (including its bottom-left
curve), scaled to fill the square with a hairline margin (viewBox x -140 to 957 font units). Strokes are ~20% bolder
than the font's own (6.2-unit same-color outline; 60 units on the 16px PNG so it stays visible).

**Switch back to the full AW (v6):** copy everything in `aw-v6/` into `public/` (same file names) and bump `?v=` in
`index.html`.

1. `1-glyphs.py msd.ttf [TEXT] > glyphs.json`: outlines as one SVG path; TEXT = `A` (live) or `AW` (default). Get the TTF from Google Fonts.
2. `2-favsvg.py glyphs.json out.svg LEFT RIGHT STROKE [bg]`: square icon SVG (STROKE 0 = no outline). Used for the A:
   - `public/favicon.svg`, 32 / 48 / 64px PNGs: -140 957 6.2
   - 16px PNG: -140 957 60
   - apple-touch-icon 180: -180 997 6.2 '#F0E5DB' (Soft Sand background; iOS shows transparency as black)
   (The full AW v6 used the AW glyphs with -140 2074 6.2 / 16px 60 / apple -200 2134.)
3. `node 3-rasterize.mjs SIZE in.svg out.png`: exact-size PNG via Chrome (needs puppeteer-core).
   `favicon.ico` = the 16/32/48 PNGs (Pillow).
4. `4-preview.py out.png "name=16.png,32.png" ...`: tab-size preview next to typical solid favicons.
   `preview-tabs.png` = the A (v8, live) vs the full AW (v6).

`index.html` links: favicon.ico (fallback) + favicon.svg (main) + apple-touch-icon. `favicon-16/32.png` and
`favicon.png` (64) are kept as files (the .ico is built from them) but not linked separately, because Chrome
tends to pick sized PNGs over the SVG. After changing the icons, bump `?v=` on the `<link>`s.
