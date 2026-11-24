# Build the favicon SVG: script "AW" glyph outlines in dusty rose. Optional same-color stroke (0 = none, the original thin letters).
# The square viewBox crops off the A's far-left tail and the W's far-right flourish, so the letters can be bigger.
# Usage: favsvg.py glyphs.json out.svg crop_left crop_right stroke [bg]
import sys, json
g = json.load(open(sys.argv[1])); out = sys.argv[2]
L, R, stroke = float(sys.argv[3]), float(sys.argv[4]), float(sys.argv[5]); bg = sys.argv[6] if len(sys.argv) > 6 else None
x0, y0, x1, y1 = g['bounds']
W = R - L; cy = (y0 + y1) / 2
vb = f'{L:g} {cy - W / 2:g} {W:g} {W:g}'
bgrect = f'<rect x="{L:g}" y="{cy - W / 2:g}" width="{W:g}" height="{W:g}" fill="{bg}"/>' if bg else ''
strokeattr = f' stroke="#D9879A" stroke-width="{stroke:g}" stroke-linejoin="round" stroke-linecap="round"' if stroke > 0 else ''
open(out, 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}">{bgrect}<path d="{g["d"]}" fill="#D9879A"{strokeattr}/></svg>\n')
