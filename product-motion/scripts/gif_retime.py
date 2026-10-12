#!/usr/bin/env python3
"""gif_retime.py <in.gif> <fps> [out.gif]
Rewrites GIF frame delays (stored in 1/100 s) so the total duration matches the target fps exactly,
by distributing rounding error (24 fps -> 4,4,4,4,4,5 hundredths). Needs Pillow."""
import sys
from PIL import Image, ImageSequence

src = sys.argv[1]
fps = float(sys.argv[2])
dst = sys.argv[3] if len(sys.argv) > 3 else src

im = Image.open(src)
frames = [f.copy() for f in ImageSequence.Iterator(im)]
delays, acc = [], 0.0
for i in range(len(frames)):
    target = round((i + 1) * 100 / fps)
    delays.append(int(target - acc))
    acc = target
frames[0].save(dst, save_all=True, append_images=frames[1:], duration=[d * 10 for d in delays],
               loop=0, optimize=False, disposal=1)
print(f"{dst}: {len(frames)} frames, total {sum(delays)/100:.2f} s")
