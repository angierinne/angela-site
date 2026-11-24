# Tab-size preview: candidate favicons next to typical solid favicons, light + dark tabs, 1x (16px) and 2x (32px).
# Usage: python preview.py out.png name=path16,path32 [name=path16,path32 ...]
import sys
from PIL import Image, ImageDraw, ImageFont
out = sys.argv[1]
cands = []
for arg in sys.argv[2:]:
    name, paths = arg.split('=', 1); p16, p32 = paths.split(',')
    cands.append((name, {16: Image.open(p16).convert('RGBA'), 32: Image.open(p32).convert('RGBA')}))
def generic(size, kind):   # stand-ins for "normal" favicons: solid, high-contrast shapes
    im = Image.new('RGBA', (size, size), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    if kind == 'dark': d.rounded_rectangle((0, 0, size - 1, size - 1), radius=size // 5, fill='#1f2328')
    else: d.ellipse((0, 0, size - 1, size - 1), fill='#2f6fde')
    f = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', int(size * .7))
    d.text((size / 2, size / 2), 'N' if kind == 'dark' else 'b', fill='white', font=f, anchor='mm'); return im
cands += [('typical site', {s: generic(s, 'dark') for s in (16, 32)}), ('typical site', {s: generic(s, 'blue') for s in (16, 32)})]
f1 = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 12); f2 = ImageFont.truetype('/System/Library/Fonts/Helvetica.ttc', 24)
rows = []
for scale, f in ((1, f1), (2, f2)):
    for bg, fg in (('#ffffff', '#202124'), ('#dfe1e5', '#202124'), ('#35363a', '#e8eaed')):
        W, H = len(cands) * 170 * scale, 34 * scale
        im = Image.new('RGBA', (W, H), bg); d = ImageDraw.Draw(im)
        for i, (name, ic) in enumerate(cands):
            x = i * 170 * scale + 10 * scale; img = ic[16 * scale]
            im.alpha_composite(img, (x, (H - img.height) // 2))
            d.text((x + 24 * scale, H // 2), name, fill=fg, font=f, anchor='lm')
        rows.append(im)
W = max(r.width for r in rows); H = sum(r.height + 6 for r in rows)
sheet = Image.new('RGBA', (W, H), 'white'); y = 0
for r in rows: sheet.alpha_composite(r, (0, y)); y += r.height + 6
sheet.save(out)
