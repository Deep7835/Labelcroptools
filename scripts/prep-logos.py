#!/usr/bin/env python3
"""Turn raw brand logos in logos/ into trimmed, transparent, web-sized assets.

Drop a file named <slug>.(png|webp|jpg) into logos/ and re-run. Any brand listed in
src/site.config.mjs without a matching file falls back to a styled text wordmark.

  python3 scripts/prep-logos.py
"""
import json, os, sys
from collections import deque
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'logos')
OUT = os.path.join(ROOT, 'src', 'assets', 'img', 'brands')
TARGET_H = 144          # 2x of a ~72px display height
MAX_W = 560             # keeps very wide wordmarks in check
PAD = 6                 # transparent padding in source pixels, pre-resize

# Per-file pre-crop (fraction of height) for sources that embed reflections/banners.
PRECROP = {'flipkart': (0.0, 0.30, 1.0, 0.68)}


def is_bg(r, g, b, min_v, max_sat):
    """Light and unsaturated = background. Absolute test, so the fill cannot creep
    up an anti-aliased ramp into the letterforms the way a tolerance-based one does."""
    mx, mn = max(r, g, b), min(r, g, b)
    if mx < min_v:
        return False
    return (0 if mx == 0 else (mx - mn) / mx) <= max_sat


def flood_background(im, min_v=196, max_sat=0.16):
    """Mark every border-connected background-like pixel. Interior light areas that a
    logo actually uses (a bag highlight, a counter inside a letter) are kept."""
    w, h = im.size
    px = im.convert('RGB').load()
    bg = bytearray(w * h)
    q = deque()

    def push(x, y):
        i = y * w + x
        if not bg[i] and is_bg(*px[x, y], min_v, max_sat):
            bg[i] = 1
            q.append((x, y))

    for x in range(w):
        push(x, 0); push(x, h - 1)
    for y in range(h):
        push(0, y); push(w - 1, y)
    while q:
        x, y = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h:
                push(nx, ny)
    return bg


def process(path, slug):
    im = Image.open(path)
    im = im.convert('RGBA') if im.mode in ('RGBA', 'LA', 'P') else im.convert('RGB').convert('RGBA')
    if slug in PRECROP:
        l, t, r, b = PRECROP[slug]
        W, H = im.size
        im = im.crop((int(l * W), int(t * H), int(r * W), int(b * H)))
    # Respect an existing alpha channel; otherwise derive one from the background.
    alpha = im.getchannel('A')
    if alpha.getextrema()[0] == 255:
        w, h = im.size
        bg = flood_background(im)
        a = alpha.load()
        for y in range(h):
            row = y * w
            for x in range(w):
                if bg[row + x]:
                    a[x, y] = 0
        im.putalpha(alpha)
    bbox = im.getchannel('A').getbbox()
    if not bbox:
        raise SystemExit(f'{slug}: nothing left after background removal')
    l, t, r, b = bbox
    im = im.crop((max(0, l - PAD), max(0, t - PAD), min(im.width, r + PAD), min(im.height, b + PAD)))
    scale = TARGET_H / im.height
    if im.width * scale > MAX_W:
        scale = MAX_W / im.width
    im = im.resize((max(1, round(im.width * scale)), max(1, round(im.height * scale))), Image.LANCZOS)
    os.makedirs(OUT, exist_ok=True)
    im.save(os.path.join(OUT, slug + '.png'), optimize=True)
    im.save(os.path.join(OUT, slug + '.webp'), quality=92, method=6)
    return {'slug': slug, 'w': im.width, 'h': im.height}


def main():
    if not os.path.isdir(SRC):
        print('no logos/ folder — nothing to do'); return
    made = []
    for f in sorted(os.listdir(SRC)):
        slug, ext = os.path.splitext(f)
        if ext.lower() not in ('.png', '.webp', '.jpg', '.jpeg'):
            continue
        info = process(os.path.join(SRC, f), slug.lower().strip())
        made.append(info)
        print(f"  {info['slug']}: {info['w']}x{info['h']}")
    with open(os.path.join(OUT, 'index.json'), 'w') as fh:
        json.dump({m['slug']: {'w': m['w'], 'h': m['h']} for m in made}, fh, indent=2)
    print(f'{len(made)} logo(s) → src/assets/img/brands/')


if __name__ == '__main__':
    main()
