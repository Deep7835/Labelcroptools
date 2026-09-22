#!/usr/bin/env python3
"""Generate OG images (1200x630), PWA icons and favicon from dist/og-manifest.json."""
import json, os, sys
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, 'dist')
FONTS = os.path.join(ROOT, 'scripts', 'fonts')
man = json.load(open(os.path.join(DIST, 'og-manifest.json')))
PAPER, INK, ACCENT, MUTED, LINE = (232, 235, 238), (11, 12, 14), (20, 99, 156), (95, 102, 110), (208, 213, 218)
CARD = (255, 255, 255)

def font(path, size, axes=None):
    f = ImageFont.truetype(os.path.join(FONTS, path), size)
    if axes:
        try: f.set_variation_by_axes(axes)
        except Exception: pass
    return f

def wrap(draw, text, f, max_w):
    words, lines, cur = text.split(), [], ''
    for w in words:
        t = (cur + ' ' + w).strip()
        if draw.textlength(t, font=f) > max_w and cur: lines.append(cur); cur = w
        else: cur = t
    if cur: lines.append(cur)
    return lines

def brand_mark(draw, x, y, s):
    r = s * 0.22
    draw.rounded_rectangle([x, y, x + s, y + s], radius=r * 1.3, fill=INK)
    lw = max(3, int(s * 0.085)); pad = s * 0.28
    for i, frac in enumerate([1.0, 1.0, 0.6]):
        yy = y + pad + i * (s - 2 * pad) / 2
        draw.line([x + pad, yy, x + pad + (s - 2 * pad) * frac, yy], fill=CARD, width=lw)

def brand_mark_inv(draw, x, y, s):
    lw = max(3, int(s * 0.12)); pad = s * 0.12
    for i, frac in enumerate([1.0, 1.0, 0.6]):
        yy = y + pad + i * (s - 2 * pad) / 2
        draw.line([x + pad, yy, x + pad + (s - 2 * pad) * frac, yy], fill=CARD, width=lw)


def og(item):
    W, H = 1200, 630
    im = Image.new('RGB', (W, H), PAPER); d = ImageDraw.Draw(im)
    for gx in range(0, W, 28):
        for gy in range(0, H, 28): d.ellipse([gx, gy, gx + 2, gy + 2], fill=LINE)
    # barcode strip bottom
    d.rounded_rectangle([0, H - 8, W, H + 40], radius=0, fill=ACCENT)
    # accent tab
    d.rounded_rectangle([64, 64, 64 + 430, 64 + 46], radius=23, fill=CARD, outline=LINE, width=2)
    mono = font('PlexMono.ttf', 20)
    d.text((64 + 215, 64 + 23), item['eyebrow'].upper(), font=mono, fill=MUTED, anchor='mm')
    # title
    title_f = font('Outfit.ttf', 78, [700])
    lines = wrap(d, item['title'], title_f, W - 128)
    if len(lines) > 3: title_f = font('Outfit.ttf', 62, [700]); lines = wrap(d, item['title'], title_f, W - 128)
    y = 150
    for ln in lines[:3]:
        d.text((64, y), ln, font=title_f, fill=INK); y += int(title_f.size * 1.05)
    sub_f = font('Outfit.ttf', 30, [450])
    for ln in wrap(d, item['sub'], sub_f, W - 128)[:2]:
        d.text((64, y + 14), ln, font=sub_f, fill=MUTED); y += 40
    # footer brand
    brand_mark(d, 64, H - 130, 56)
    d.text((136, H - 124), item['brand'], font=font('Outfit.ttf', 34, [700]), fill=INK)
    d.text((136, H - 84), item['domain'] + '  ·  free  ·  no upload  ·  no signup', font=font('PlexMono.ttf', 18), fill=MUTED)
    return im

os.makedirs(os.path.join(DIST, 'og'), exist_ok=True)
for it in man['pages']:
    im = og(it)
    # These are flat-colour graphics, so an adaptive 128-colour palette is visually
    # identical and roughly a quarter of the bytes.
    im.convert('RGB').quantize(colors=128, method=Image.MEDIANCUT, dither=Image.NONE) \
      .save(os.path.join(DIST, 'og', it['slug'] + '.png'), optimize=True)
print(f"OG images: {len(man['pages'])}")

# icons
def icon(size, maskable=False):
    im = Image.new('RGBA', (size, size), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    if maskable:
        d.rectangle([0, 0, size, size], fill=INK); brand_mark_inv(d, size * 0.22, size * 0.22, size * 0.56)
    else: brand_mark(d, 0, 0, size)
    return im
icon(192).save(os.path.join(DIST, 'icon-192.png')); icon(512).save(os.path.join(DIST, 'icon-512.png'))
icon(512, True).save(os.path.join(DIST, 'icon-512-maskable.png'))
a = Image.new('RGB', (180, 180), CARD); brand_mark(ImageDraw.Draw(a), 18, 18, 144); a.save(os.path.join(DIST, 'apple-touch-icon.png'))
print('icons done')
