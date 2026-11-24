# Extract "AW" outlines from Mrs Saint Delafield as one SVG path (font units, y pointing down).
import sys, json
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen
f = TTFont(sys.argv[1]); gs = f.getGlyphSet(); cmap = f.getBestCmap(); hmtx = f['hmtx']
upm = f['head'].unitsPerEm
names = [cmap[ord(c)] for c in 'AW']
# kerning between A and W (GPOS pair adjustment), if any
kern = 0
if 'GPOS' in f:
    for lookup in f['GPOS'].table.LookupList.Lookup:
        for st in lookup.SubTable:
            st = getattr(st, 'ExtSubTable', st)
            if getattr(st, 'Format', None) == 1 and hasattr(st, 'PairSet') and names[0] in st.Coverage.glyphs:
                ps = st.PairSet[st.Coverage.glyphs.index(names[0])]
                for pv in ps.PairValueRecord:
                    if pv.SecondGlyph == names[1] and pv.Value1 is not None: kern += getattr(pv.Value1, 'XAdvance', 0) or 0
spen = SVGPathPen(gs); bpen = BoundsPen(gs)
x = 0
for i, n in enumerate(names):
    t = (1, 0, 0, -1, x, 0)          # flip y so it reads top-down in SVG
    gs[n].draw(TransformPen(spen, t)); gs[n].draw(TransformPen(bpen, t))
    x += hmtx[n][0] + (kern if i == 0 else 0)
print(json.dumps({'upm': upm, 'kern': kern, 'advA': hmtx[names[0]][0], 'bounds': bpen.bounds, 'd': spen.getCommands()}))
