# Preview the favicon at real tab size (1x = 16px, 2x retina = 32px) on light and dark tabs, plus a zoom.
# Usage: python make-preview.py <iconDir with icon-16.png/icon-32.png> <out-tabs.png> <out-zoom.png> [compareDir]
import sys
from PIL import Image, ImageDraw, ImageFont
src, out_tabs, out_zoom = sys.argv[1:4]
sets = [('script AW', src)] + ([('Anton (old)', sys.argv[4])] if len(sys.argv) > 4 else [])
icons = [(name, {s: Image.open(f'{d}/icon-{s}.png').convert('RGBA') for s in (16, 32)}) for name, d in sets]
f1 = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 12); f2 = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 24)
rows = []
for scale, f in ((1, f1), (2, f2)):
    for bg, fg in (('#ffffff', '#202124'), ('#dfe1e5', '#202124'), ('#35363a', '#e8eaed')):
        W, H = len(icons) * 230 * scale, 34 * scale
        im = Image.new('RGBA', (W, H), bg); d = ImageDraw.Draw(im)
        for i, (name, ic) in enumerate(icons):
            x = i * 230 * scale + 10 * scale; img = ic[16 * scale]
            im.alpha_composite(img, (x, (H - img.height) // 2))
            d.text((x + 24 * scale, H // 2), f'{name}: Angela Wang', fill=fg, font=f, anchor='lm')
        rows.append(im)
W = max(r.width for r in rows); H = sum(r.height + 6 for r in rows)
sheet = Image.new('RGBA', (W, H), 'white'); y = 0
for r in rows: sheet.alpha_composite(r, (0, y)); y += r.height + 6
sheet.save(out_tabs)
zoom = Image.new('RGBA', (len(icons) * 290, 150), 'white')
for i, (name, ic) in enumerate(icons):
    zoom.alpha_composite(ic[16].resize((128, 128), Image.NEAREST), (i * 290 + 10, 10))
    zoom.alpha_composite(ic[32].resize((128, 128), Image.NEAREST), (i * 290 + 150, 10))
zoom.save(out_zoom)
