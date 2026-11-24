# Preview: both favicons at real tab size (1x = 16px, 2x retina = 32px) on light and dark tabs, plus zoomed.
import sys
from PIL import Image, ImageDraw, ImageFont
src, out_tabs, out_zoom = sys.argv[1:4]
icons = {k: {s: Image.open(f'{src}/{k}/icon-{s}.png').convert('RGBA') for s in (16, 32)} for k in ('anton', 'script')}
f1 = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 12); f2 = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 24)
rows = []
for scale, f in ((1, f1), (2, f2)):
    for bg, fg in (('#ffffff', '#202124'), ('#dfe1e5', '#202124'), ('#35363a', '#e8eaed')):
        W, H = 2 * 220 * scale, 34 * scale
        im = Image.new('RGBA', (W, H), bg); d = ImageDraw.Draw(im)
        for i, k in enumerate(('anton', 'script')):
            x = i * 220 * scale + 10 * scale; ic = icons[k][16 * scale]
            im.alpha_composite(ic, (x, (H - ic.height) // 2))
            d.text((x + 24 * scale, H // 2), f'{k}: Angela Wang', fill=fg, font=f, anchor='lm')
        rows.append(im)
W = max(r.width for r in rows); H = sum(r.height + 6 for r in rows)
sheet = Image.new('RGBA', (W, H), 'white'); y = 0
for r in rows: sheet.alpha_composite(r, (0, y)); y += r.height + 6
sheet.save(out_tabs)
zoom = Image.new('RGBA', (2 * 290, 150), 'white')
for i, k in enumerate(('anton', 'script')):
    zoom.alpha_composite(icons[k][16].resize((128, 128), Image.NEAREST), (i * 290 + 10, 10))
    zoom.alpha_composite(icons[k][32].resize((128, 128), Image.NEAREST), (i * 290 + 150, 10))
zoom.save(out_zoom)
