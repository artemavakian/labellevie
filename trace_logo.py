"""Vectorise the wordmark so the intro can render it at any size.

The source PNG is 1024px wide but the intro draws it at ~676 CSS px, which is
an upscale on any 2x display — hence the softness. Tracing the alpha channel
gives a resolution-independent outline instead.
"""
import numpy as np
import potrace
from PIL import Image

SRC = 'public/lbvlogo.png'
OUT = 'public/lbvlogo.svg'
# Supersample before thresholding so the traced edge lands on the sub-pixel
# position implied by the original anti-aliasing.
SCALE = 4

img = Image.open(SRC).convert('RGBA')
w, h = img.size
alpha = img.getchannel('A').resize((w * SCALE, h * SCALE), Image.LANCZOS)

# potracer's Bitmap constructor inverts what it is handed, so pass the
# background and it traces the letterforms.
mask = np.array(alpha) <= 127
bmp = potrace.Bitmap(mask)
path = bmp.trace(turdsize=2, alphamax=1.0, opticurve=True, opttolerance=0.2)

parts = []
for curve in path:
    p = curve.start_point
    parts.append(f'M{p.x / SCALE:.2f},{p.y / SCALE:.2f}')
    for seg in curve:
        e = seg.end_point
        if seg.is_corner:
            c = seg.c
            parts.append(f'L{c.x / SCALE:.2f},{c.y / SCALE:.2f}L{e.x / SCALE:.2f},{e.y / SCALE:.2f}')
        else:
            c1, c2 = seg.c1, seg.c2
            parts.append(
                f'C{c1.x / SCALE:.2f},{c1.y / SCALE:.2f} '
                f'{c2.x / SCALE:.2f},{c2.y / SCALE:.2f} '
                f'{e.x / SCALE:.2f},{e.y / SCALE:.2f}'
            )
    parts.append('Z')

d = ''.join(parts)
svg = (
    f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}">'
    f'<path fill="currentColor" fill-rule="evenodd" d="{d}"/>'
    f'</svg>'
)
with open(OUT, 'w') as f:
    f.write(svg)

print(f'{OUT}: {len(svg) / 1024:.1f} kB, {len(path)} contours')
