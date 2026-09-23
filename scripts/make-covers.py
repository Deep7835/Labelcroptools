#!/usr/bin/env python3
"""Generate original cover art for each blog article.

Textless on purpose: the headline lives in the HTML next to the image, so putting it
in the artwork too would duplicate it for both readers and crawlers. Each motif is
drawn from the site's own palette so covers sit correctly on any card colour.

  python3 scripts/make-covers.py
"""
import json, os, random
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(ROOT, 'dist')
OUT = os.path.join(DIST, 'covers')
W, H = 1200, 750
SIZES = [1200, 600]

INK = (11, 12, 14)
MUTED = (140, 147, 156)
ACCENT = (20, 99, 156)
ACCENT_SOFT = (203, 224, 240)
CARD = (255, 255, 255)
PAPER = (232, 235, 238)
TINT = (223, 234, 243)
SURFACE = (227, 231, 235)

BACKDROPS = [PAPER, TINT, SURFACE]


def rr(d, box, r, **kw):
    d.rounded_rectangle(box, radius=r, **kw)


def dot_grid(d, colour, step=26, r=1.6):
    for x in range(0, W, step):
        for y in range(0, H, step):
            d.ellipse([x, y, x + r * 2, y + r * 2], fill=colour)


def barcode(d, x, y, w, h, colour=INK, seed=3):
    rnd = random.Random(seed)
    cx = x
    while cx < x + w:
        bw = rnd.choice([3, 3, 5, 8, 12])
        if cx + bw > x + w:
            break
        d.rectangle([cx, y, cx + bw, y + h], fill=colour)
        cx += bw + rnd.choice([5, 7, 10])


def page(d, x, y, w, h, fill=CARD, outline=MUTED, width=3, r=14):
    rr(d, [x, y, x + w, y + h], r, fill=fill, outline=outline, width=width)


def lines(d, x, y, w, n, gap=16, colour=MUTED, h=6, shrink=0.0):
    for i in range(n):
        ww = w * (1 - shrink * i)
        rr(d, [x, y + i * gap, x + ww, y + i * gap + h], h // 2, fill=colour)


# ── motifs ───────────────────────────────────────────────────────────────
def m_label_crop(d):
    page(d, 300, 90, 420, 570)
    rr(d, [330, 130, 690, 330], 10, fill=ACCENT_SOFT, outline=ACCENT, width=4)
    lines(d, 352, 158, 160, 4, 18, INK, 7)
    barcode(d, 352, 250, 300, 58, INK, 5)
    d.line([300, 360, 720, 360], fill=ACCENT, width=5)
    for x in range(310, 720, 26):
        d.line([x, 360, x + 13, 360], fill=PAPER, width=7)
    lines(d, 330, 400, 360, 7, 26, (206, 211, 216), 8, .05)
    rr(d, [760, 150, 1080, 350], 14, fill=CARD, outline=ACCENT, width=4)
    rr(d, [786, 180, 1054, 320], 8, fill=ACCENT_SOFT)
    barcode(d, 806, 252, 220, 44, ACCENT, 9)
    d.line([724, 240, 756, 240], fill=ACCENT, width=5)
    d.polygon([(756, 240), (742, 232), (742, 248)], fill=ACCENT)


def m_return(d):
    d.arc([330, 150, 870, 600], start=200, end=350, fill=ACCENT, width=14)
    d.polygon([(330, 400), (362, 356), (368, 428)], fill=ACCENT)
    rr(d, [520, 300, 700, 460], 16, fill=CARD, outline=INK, width=5)
    d.line([520, 356, 700, 356], fill=INK, width=5)
    d.line([610, 300, 610, 356], fill=INK, width=5)
    for i, wdt in enumerate([300, 250, 200, 150]):
        rr(d, [820, 200 + i * 62, 820 + wdt, 200 + i * 62 + 34], 17,
           fill=CARD if i else ACCENT_SOFT, outline=MUTED if i else ACCENT, width=3)


def m_statement(d):
    page(d, 260, 80, 680, 590)
    lines(d, 300, 130, 300, 1, 0, INK, 12)
    for i in range(6):
        y = 200 + i * 56
        lines(d, 300, y, 300 - i * 18, 1, 0, MUTED, 8)
        rr(d, [740, y - 4, 900, y + 12], 8, fill=(214, 219, 224))
    d.line([300, 552, 900, 552], fill=INK, width=4)
    rr(d, [640, 580, 900, 626], 12, fill=ACCENT_SOFT, outline=ACCENT, width=4)
    lines(d, 668, 598, 160, 1, 0, ACCENT, 10)


def m_photo(d):
    for i, (x, ok) in enumerate([(200, False), (480, True), (760, True)]):
        col = ACCENT if ok else (192, 47, 52)
        page(d, x, 220, 240, 300, CARD, col, 5)
        rr(d, [x + 34, 260, x + 206, 420], 10, fill=ACCENT_SOFT if ok else (247, 224, 224))
        d.ellipse([x + 70, 296, x + 110, 336], fill=col)
        d.polygon([(x + 60, 412), (x + 120, 340), (x + 180, 412)], fill=col)
        cx, cy = x + 120, 476
        d.ellipse([cx - 22, cy - 22, cx + 22, cy + 22], fill=col)
        if ok:
            d.line([cx - 10, cy, cx - 2, cy + 9], fill=CARD, width=5)
            d.line([cx - 2, cy + 9, cx + 11, cy - 9], fill=CARD, width=5)
        else:
            d.line([cx - 9, cy - 9, cx + 9, cy + 9], fill=CARD, width=5)
            d.line([cx + 9, cy - 9, cx - 9, cy + 9], fill=CARD, width=5)


def m_checklist(d):
    rr(d, [200, 230, 520, 540], 18, fill=CARD, outline=INK, width=5)
    d.line([200, 300, 520, 300], fill=INK, width=5)
    d.line([360, 230, 360, 300], fill=INK, width=5)
    rr(d, [300, 190, 420, 246], 14, fill=ACCENT_SOFT, outline=ACCENT, width=4)
    for i in range(4):
        y = 250 + i * 76
        cx, cy = 640, y + 20
        d.ellipse([cx - 20, cy - 20, cx + 20, cy + 20], fill=ACCENT)
        d.line([cx - 9, cy, cx - 2, cy + 8], fill=CARD, width=5)
        d.line([cx - 2, cy + 8, cx + 10, cy - 8], fill=CARD, width=5)
        lines(d, 690, cy - 5, 290 - i * 36, 1, 0, MUTED if i else INK, 10)


def m_compare(d):
    d.ellipse([190, 250, 430, 490], fill=CARD, outline=INK, width=6)
    d.ellipse([268, 328, 352, 412], fill=PAPER, outline=INK, width=5)
    rr(d, [300, 470, 420, 640], 8, fill=ACCENT_SOFT, outline=ACCENT, width=4)
    barcode(d, 322, 540, 76, 30, ACCENT, 4)
    d.line([560, 180, 560, 570], fill=MUTED, width=4)
    page(d, 640, 150, 380, 470)
    for r_ in range(2):
        for c in range(2):
            x, y = 672 + c * 178, 186 + r_ * 218
            rr(d, [x, y, x + 152, y + 186], 8, fill=ACCENT_SOFT, outline=ACCENT, width=3)
            barcode(d, x + 18, y + 120, 116, 28, ACCENT, 7 + r_ * 2 + c)


def m_barcode(d):
    for i in range(3):
        x = 180 + i * 300
        rr(d, [x, 230, x + 240, 520], 16, fill=CARD, outline=INK, width=5)
        rr(d, [x + 28, 264, x + 212, 350], 8, fill=ACCENT_SOFT)
        barcode(d, x + 44, 282, 152, 50, ACCENT, 11 + i)
        lines(d, x + 28, 386, 184, 3, 26, MUTED, 8, .18)
    d.line([180, 560, 960, 560], fill=MUTED, width=5)


def m_box(d):
    rr(d, [190, 180, 520, 470], 14, fill=CARD, outline=INK, width=6)
    d.line([190, 262, 520, 262], fill=INK, width=5)
    d.line([355, 180, 355, 262], fill=INK, width=5)
    for i in range(3):
        d.line([214 + i * 14, 300 + i * 10, 496 - i * 14, 300 + i * 10], fill=(214, 219, 224), width=4)
    rr(d, [700, 330, 860, 470], 14, fill=ACCENT_SOFT, outline=ACCENT, width=6)
    d.line([700, 380, 860, 380], fill=ACCENT, width=5)
    d.line([250, 520, 990, 520], fill=INK, width=8)
    d.polygon([(560, 520), (600, 596), (520, 596)], fill=INK)
    rr(d, [520, 596, 600, 620], 8, fill=INK)


def m_frame(d):
    rr(d, [400, 170, 800, 570], 16, fill=CARD, outline=ACCENT, width=6)
    rr(d, [424, 290, 776, 452], 10, fill=ACCENT_SOFT)
    d.ellipse([472, 322, 528, 378], fill=ACCENT)
    d.polygon([(456, 444), (556, 356), (656, 444)], fill=ACCENT)
    d.polygon([(620, 444), (688, 388), (748, 444)], fill=(140, 180, 214))
    for y in (222, 512):
        for x in range(430, 780, 34):
            d.line([x, y, x + 17, y], fill=(200, 208, 216), width=6)
    for x0, y0, dx, dy in [(400, 170, 1, 1), (800, 170, -1, 1), (400, 570, 1, -1), (800, 570, -1, -1)]:
        d.line([x0, y0, x0 + 46 * dx, y0], fill=INK, width=7)
        d.line([x0, y0, x0, y0 + 46 * dy], fill=INK, width=7)


def m_flow(d):
    for i in range(4):
        x = 150 + i * 250
        rr(d, [x, 300, x + 170, 450], 16,
           fill=ACCENT_SOFT if i % 2 == 0 else CARD, outline=ACCENT if i % 2 == 0 else MUTED, width=5)
        lines(d, x + 26, 340, 118 - i * 8, 3, 26, ACCENT if i % 2 == 0 else MUTED, 8)
        if i < 3:
            d.line([x + 186, 375, x + 236, 375], fill=INK, width=6)
            d.polygon([(x + 244, 375), (x + 228, 366), (x + 228, 384)], fill=INK)
    for i in range(4):
        cx = 235 + i * 250
        d.ellipse([cx - 24, 226, cx + 24, 274], fill=INK)


def m_label_4x6(d):
    page(d, 190, 90, 400, 570, CARD, (208, 214, 220), 3)
    lines(d, 226, 132, 320, 9, 30, (214, 219, 224), 8, .04)
    rr(d, [640, 170, 1010, 620], 16, fill=CARD, outline=ACCENT, width=7)
    rr(d, [672, 206, 978, 330], 8, fill=ACCENT_SOFT)
    lines(d, 694, 232, 160, 3, 26, ACCENT, 8)
    barcode(d, 694, 372, 262, 74, INK, 6)
    lines(d, 694, 486, 262, 3, 30, MUTED, 8, .2)
    d.line([600, 300, 628, 300], fill=ACCENT, width=6)
    d.polygon([(636, 300), (620, 291), (620, 309)], fill=ACCENT)
    d.line([640, 660, 1010, 660], fill=ACCENT, width=5)
    d.line([1040, 170, 1040, 620], fill=ACCENT, width=5)


def m_chart(d):
    base_y, top_y = 600, 180
    rr(d, [180, top_y, 340, base_y], 12, fill=ACCENT, outline=None)
    cuts = [('', 300, 96), ('', 420, 70), ('', 540, 58), ('', 660, 46)]
    prev = base_y
    for i, (_, x, hgt) in enumerate(cuts):
        rr(d, [x, prev - hgt, x + 140, prev], 12, fill=(201, 208, 215))
        d.line([348, prev - hgt // 2, x - 12, prev - hgt // 2], fill=MUTED, width=3)
        prev -= hgt
    rr(d, [820, prev, 980, base_y], 12, fill=INK)
    d.line([150, base_y + 20, 1020, base_y + 20], fill=MUTED, width=4)


def m_whitebox(d):
    rr(d, [370, 130, 830, 590], 18, fill=CARD, outline=(206, 212, 218), width=4)
    rr(d, [452, 230, 748, 470], 14, fill=ACCENT_SOFT)
    d.ellipse([500, 268, 560, 328], fill=ACCENT)
    d.polygon([(486, 462), (596, 330), (706, 462)], fill=ACCENT)
    for x0, y0, dx, dy in [(392, 152, 1, 1), (808, 152, -1, 1), (392, 568, 1, -1), (808, 568, -1, -1)]:
        d.line([x0, y0, x0 + 54 * dx, y0], fill=ACCENT, width=8)
        d.line([x0, y0, x0, y0 + 54 * dy], fill=ACCENT, width=8)
    d.ellipse([876, 306, 980, 410], outline=INK, width=8)
    d.line([966, 396, 1024, 454], fill=INK, width=10)


def m_routes(d):
    for i in range(3):
        y = 230 + i * 140
        rr(d, [140, y - 46, 300, y + 46], 14,
           fill=ACCENT_SOFT if i == 0 else CARD, outline=ACCENT if i == 0 else MUTED, width=5)
        d.line([320, y, 880, y], fill=ACCENT if i == 0 else MUTED, width=6 if i == 0 else 4)
        for k in range(3):
            cx = 400 + k * 170
            d.ellipse([cx - 13, y - 13, cx + 13, y + 13], fill=ACCENT if i == 0 else MUTED)
        rr(d, [900, y - 46, 1060, y + 46], 14,
           fill=ACCENT_SOFT if i == 0 else CARD, outline=ACCENT if i == 0 else MUTED, width=5)


def m_funnel(d):
    for i in range(4):
        y = 170 + i * 96
        rr(d, [140, y, 470, y + 66], 16, fill=CARD, outline=MUTED, width=4)
        lines(d, 172, y + 28, 250 - i * 30, 1, 0, MUTED, 9)
        d.line([486, y + 33, 590, 375], fill=(201, 208, 215), width=4)
    d.polygon([(620, 210), (1000, 210), (880, 430), (880, 560), (740, 600), (740, 430)], fill=ACCENT_SOFT,
              outline=ACCENT, width=6)
    d.line([690, 300, 930, 300], fill=ACCENT, width=5)



# ── motifs for the tool-led articles ─────────────────────────────────────
def m_sort_sku(d):
    """Shuffled labels on the left resolving into grouped runs on the right."""
    rnd = random.Random(9)
    order = [0, 2, 1, 2, 0, 1, 2, 0]
    tone = [ACCENT_SOFT, (214, 222, 229), CARD]
    for i, k in enumerate(order):
        rr(d, [170, 110 + i * 76, 470, 170 + i * 76], 8, fill=tone[k], outline=MUTED, width=3)
        barcode(d, 190, 126 + i * 76, 120, 28, INK, rnd.randint(1, 40))
    d.line([530, 375, 650, 375], fill=ACCENT, width=6)
    d.polygon([(650, 356), (690, 375), (650, 394)], fill=ACCENT)
    y = 110
    for k, n in ((0, 3), (1, 2), (2, 3)):
        for _ in range(n):
            rr(d, [740, y, 1040, y + 60], 8, fill=tone[k], outline=MUTED, width=3)
            barcode(d, 760, y + 16, 120, 28, INK, 5 + k)
            y += 66
        y += 16


def m_invoice_split(d):
    page(d, 150, 110, 400, 540)
    rr(d, [180, 145, 520, 330], 10, fill=ACCENT_SOFT, outline=ACCENT, width=4)
    barcode(d, 206, 250, 270, 52, INK, 6)
    lines(d, 180, 370, 340, 8, 30, (208, 213, 218), 9, .06)
    for x in range(150, 555, 26):
        d.line([x, 350, x + 13, 350], fill=MUTED, width=5)
    d.line([620, 375, 720, 375], fill=ACCENT, width=6)
    d.polygon([(720, 356), (758, 375), (720, 394)], fill=ACCENT)
    rr(d, [800, 150, 1090, 330], 12, fill=ACCENT_SOFT, outline=ACCENT, width=5)
    barcode(d, 828, 250, 230, 48, INK, 6)
    page(d, 800, 400, 290, 250, fill=PAPER, outline=(205, 210, 215))
    lines(d, 828, 436, 230, 6, 30, (205, 210, 215), 8, .07)


def m_scale_small(d):
    rr(d, [150, 160, 520, 610], 14, fill=CARD, outline=INK, width=5)
    rr(d, [186, 200, 484, 420], 10, fill=ACCENT_SOFT, outline=ACCENT, width=4)
    barcode(d, 212, 330, 240, 58, INK, 4)
    lines(d, 186, 460, 260, 4, 30, MUTED, 8, .1)
    rr(d, [700, 160, 1070, 610], 14, fill=CARD, outline=MUTED, width=5)
    rr(d, [815, 300, 955, 420], 8, fill=ACCENT_SOFT, outline=ACCENT, width=3)
    barcode(d, 830, 370, 110, 28, INK, 4)
    for xy in ([700, 160, 815, 300], [1070, 160, 955, 300], [700, 610, 815, 420], [1070, 610, 955, 420]):
        d.line(xy, fill=(210, 215, 220), width=3)


def m_margins(d):
    page(d, 260, 90, 680, 570, fill=CARD, outline=MUTED, width=4)
    rr(d, [400, 210, 800, 540], 8, fill=ACCENT_SOFT, outline=ACCENT, width=4)
    lines(d, 430, 250, 320, 5, 32, INK, 8, .08)
    for x0, y0, x1, y1 in ((400, 170, 400, 210), (800, 170, 800, 210), (400, 540, 400, 580), (800, 540, 800, 580)):
        d.line([x0, y0, x1, y1], fill=ACCENT, width=4)
    for x0, y0, x1, y1 in ((360, 210, 400, 210), (840, 210, 800, 210), (360, 540, 400, 540), (840, 540, 800, 540)):
        d.line([x0, y0, x1, y1], fill=ACCENT, width=4)


def m_local_merge(d):
    rr(d, [150, 120, 1050, 640], 18, fill=CARD, outline=INK, width=5)
    d.line([150, 196, 1050, 196], fill=INK, width=5)
    for i in range(3):
        d.ellipse([186 + i * 34, 148, 208 + i * 34, 170], fill=MUTED)
    for i in range(3):
        page(d, 230 + i * 30, 260 + i * 26, 170, 230, fill=PAPER, outline=MUTED, width=3)
        lines(d, 252 + i * 30, 292 + i * 26, 118, 4, 24, (206, 211, 216), 7)
    d.line([500, 400, 600, 400], fill=ACCENT, width=6)
    d.polygon([(600, 380), (640, 400), (600, 420)], fill=ACCENT)
    page(d, 700, 250, 250, 320, fill=ACCENT_SOFT, outline=ACCENT, width=5)
    lines(d, 734, 296, 180, 7, 30, ACCENT, 8, .05)


def m_split_docs(d):
    page(d, 130, 200, 260, 350, fill=CARD, outline=INK, width=5)
    lines(d, 164, 248, 190, 8, 32, MUTED, 8, .04)
    d.line([440, 375, 530, 375], fill=ACCENT, width=6)
    for k in range(3):
        d.polygon([(530, 375), (568, 200 + k * 175), (536, 200 + k * 175)], fill=None, outline=None)
        d.line([530, 375, 600, 210 + k * 165], fill=ACCENT, width=5)
    for k in range(3):
        page(d, 640, 130 + k * 170, 230, 140, fill=ACCENT_SOFT if k == 1 else CARD, outline=ACCENT if k == 1 else MUTED, width=4)
        lines(d, 668, 158 + k * 170, 160, 3, 26, ACCENT if k == 1 else MUTED, 7, .1)


def m_rotate(d):
    """Same page upright and turned, with an unmistakable quarter-turn arrow."""
    page(d, 150, 250, 240, 320, fill=CARD, outline=MUTED, width=5)
    lines(d, 184, 292, 172, 6, 34, (205, 210, 215), 8, .05)
    d.rectangle([150, 250, 196, 296], fill=MUTED)
    # quarter-turn arrow arcing over the gap
    d.arc([380, 60, 860, 420], start=185, end=355, fill=ACCENT, width=14)
    d.polygon([(846, 180), (900, 212), (842, 250)], fill=ACCENT)
    # the same page, turned on its side
    rr(d, [640, 330, 1060, 620], 12, fill=ACCENT_SOFT, outline=ACCENT, width=5)
    for i in range(6):
        x = 686 + i * 34
        rr(d, [x, 372, x + 8, 372 + 206 * (1 - .05 * i)], 4, fill=ACCENT)
    d.rectangle([1014, 330, 1060, 376], fill=ACCENT)

def m_photo_stack(d):
    for i in range(3):
        x, y = 160 + i * 54, 180 + i * 58
        rr(d, [x, y, x + 300, y + 240], 12, fill=CARD, outline=MUTED, width=4)
        rr(d, [x + 24, y + 24, x + 276, y + 176], 8, fill=ACCENT_SOFT)
        d.ellipse([x + 52, y + 52, x + 104, y + 104], fill=ACCENT)
        d.polygon([(x + 40, y + 176), (x + 130, y + 88), (x + 220, y + 176)], fill=ACCENT)
    d.line([600, 400, 690, 400], fill=ACCENT, width=6)
    d.polygon([(690, 380), (728, 400), (690, 420)], fill=ACCENT)
    page(d, 790, 170, 290, 420, fill=CARD, outline=ACCENT, width=5)
    for i in range(3):
        rr(d, [818, 202 + i * 132, 1052, 316 + i * 132], 8, fill=ACCENT_SOFT, outline=ACCENT, width=3)


def m_raster(d):
    page(d, 200, 130, 340, 490, fill=CARD, outline=INK, width=5)
    lines(d, 234, 186, 260, 9, 34, INK, 9, .05)
    barcode(d, 234, 520, 250, 56, ACCENT, 8)
    d.line([600, 375, 690, 375], fill=ACCENT, width=6)
    d.polygon([(690, 355), (728, 375), (690, 395)], fill=ACCENT)
    rnd = random.Random(21)
    for r_ in range(12):
        for c in range(9):
            x, y = 790 + c * 32, 190 + r_ * 32
            if rnd.random() < .55:
                d.rectangle([x, y, x + 28, y + 28], fill=ACCENT_SOFT if rnd.random() < .6 else ACCENT)
    rr(d, [782, 182, 1074, 574], 10, fill=None, outline=INK, width=5)


def m_tips(d):
    for i in range(5):
        y = 130 + i * 100
        w = 760 - i * 40
        rr(d, [200, y, 200 + w, y + 72], 12, fill=CARD if i else ACCENT_SOFT, outline=ACCENT if not i else MUTED, width=4)
        d.ellipse([224, y + 14, 268, y + 58], fill=ACCENT if not i else ACCENT_SOFT, outline=ACCENT, width=3)
        lines(d, 296, y + 26, w - 150, 2, 20, MUTED if i else ACCENT, 7, .25)


def m_mismatch(d):
    for r_ in range(2):
        for c in range(4):
            x, y = 180 + c * 220, 210 + r_ * 220
            odd = (r_ == 1 and c == 2)
            rr(d, [x, y, x + 170, y + 170], 14,
               fill=ACCENT_SOFT if not odd else CARD,
               outline=ACCENT if not odd else INK, width=4 if not odd else 6)
            if odd:
                d.line([x + 46, y + 46, x + 124, y + 124], fill=INK, width=7)
                d.line([x + 124, y + 46, x + 46, y + 124], fill=INK, width=7)
            else:
                d.ellipse([x + 58, y + 58, x + 112, y + 112], fill=ACCENT)


def m_waterfall(d):
    base = 600
    vals = [420, 330, 268, 214, 150, 104]
    for i, v in enumerate(vals):
        x = 190 + i * 150
        top = base - v
        rr(d, [x, top, x + 108, base], 8,
           fill=ACCENT_SOFT if i else ACCENT, outline=ACCENT, width=3)
        if i:
            d.line([x - 42, base - vals[i - 1], x, base - vals[i - 1]], fill=MUTED, width=4)
    d.line([160, base, 1060, base], fill=INK, width=5)


def m_weigh(d):
    """A light item on a scale losing to the space its box occupies."""
    d.line([300, 300, 300, 600], fill=INK, width=9)
    d.line([170, 300, 430, 300], fill=INK, width=9)
    d.line([232, 600, 368, 600], fill=INK, width=9)
    rr(d, [206, 300, 394, 372], 10, fill=CARD, outline=INK, width=5)
    rr(d, [268, 256, 332, 300], 6, fill=ACCENT)
    # the box, with dimension marks on all three edges
    d.polygon([(600, 300), (830, 226), (1060, 300), (830, 374)], fill=(216, 222, 228), outline=INK)
    d.polygon([(600, 300), (600, 540), (830, 614), (830, 374)], fill=CARD, outline=INK)
    d.polygon([(1060, 300), (1060, 540), (830, 614), (830, 374)], fill=ACCENT_SOFT, outline=INK)
    for a, b in (((600, 566), (830, 640)), ((860, 634), (1080, 562)), ((1090, 530), (1090, 306))):
        d.line([a[0], a[1], b[0], b[1]], fill=ACCENT, width=5)
    d.line([490, 430, 560, 430], fill=MUTED, width=5)
    d.line([490, 462, 560, 462], fill=MUTED, width=5)

def m_code_types(d):
    rr(d, [150, 190, 560, 560], 16, fill=CARD, outline=INK, width=5)
    barcode(d, 188, 280, 334, 130, INK, 12)
    lines(d, 188, 456, 240, 2, 26, MUTED, 8, .2)
    rr(d, [660, 190, 1070, 560], 16, fill=CARD, outline=ACCENT, width=5)
    rnd = random.Random(33)
    for r_ in range(8):
        for c in range(8):
            if rnd.random() < .5:
                x, y = 700 + c * 42, 230 + r_ * 42
                d.rectangle([x, y, x + 34, y + 34], fill=ACCENT_SOFT if rnd.random() < .5 else ACCENT)


def m_qr(d):
    rr(d, [330, 105, 870, 645], 18, fill=CARD, outline=INK, width=6)
    rnd = random.Random(7)
    for r_ in range(11):
        for c in range(11):
            if rnd.random() < .48:
                x, y = 380 + c * 42, 155 + r_ * 42
                d.rectangle([x, y, x + 34, y + 34], fill=INK)
    for cx, cy in ((380, 155), (716, 155), (380, 491)):
        d.rectangle([cx, cy, cx + 118, cy + 118], fill=CARD)
        d.rectangle([cx, cy, cx + 118, cy + 118], outline=ACCENT, width=10)
        d.rectangle([cx + 34, cy + 34, cx + 84, cy + 84], fill=ACCENT)


def m_card_insert(d):
    d.polygon([(220, 330), (600, 240), (980, 330), (600, 430)], fill=(214, 220, 226), outline=INK)
    d.polygon([(220, 330), (220, 570), (600, 660), (600, 430)], fill=CARD, outline=INK)
    d.polygon([(980, 330), (980, 570), (600, 660), (600, 430)], fill=PAPER, outline=INK)
    rr(d, [470, 110, 780, 330], 10, fill=ACCENT_SOFT, outline=ACCENT, width=5)
    lines(d, 502, 152, 220, 4, 34, ACCENT, 8, .12)


def m_invoice_fields(d):
    page(d, 300, 80, 600, 590, fill=CARD, outline=INK, width=5)
    lines(d, 340, 130, 300, 2, 34, INK, 10, .3)
    for i in range(6):
        y = 250 + i * 66
        rr(d, [340, y, 760, y + 34], 6, fill=ACCENT_SOFT if i % 2 == 0 else PAPER)
        d.ellipse([796, y, 830, y + 34], fill=ACCENT if i < 5 else CARD, outline=ACCENT, width=4)
        if i < 5:
            d.line([804, y + 18, 812, y + 26], fill=CARD, width=5)
            d.line([812, y + 26, 824, y + 9], fill=CARD, width=5)


def m_sweep(d):
    d.pieslice([180, 60, 1020, 760], start=180, end=360, fill=CARD)
    d.rectangle([180, 410, 1020, 640], fill=CARD)
    d.line([180, 410, 180, 640], fill=(226, 231, 236), width=4)
    d.line([1020, 410, 1020, 640], fill=(226, 231, 236), width=4)
    rr(d, [500, 300, 700, 560], 14, fill=ACCENT_SOFT, outline=ACCENT, width=5)
    d.ellipse([470, 540, 730, 600], fill=(234, 238, 242))
    for i in range(4):
        d.line([250 + i * 24, 150 + i * 16, 330 + i * 24, 230 + i * 16], fill=(222, 228, 234), width=6)


def m_nup_grid(d):
    page(d, 290, 70, 620, 610, fill=CARD, outline=INK, width=5)
    for r_ in range(2):
        for c in range(2):
            x, y = 326 + c * 296, 108 + r_ * 292
            rr(d, [x, y, x + 258, y + 250], 10, fill=ACCENT_SOFT, outline=ACCENT, width=4)
            barcode(d, x + 30, y + 160, 196, 52, INK, 14 + r_ * 2 + c)
            lines(d, x + 30, y + 40, 150, 3, 26, INK, 7, .12)
    for x in range(300, 905, 24):
        d.line([x, 380, x + 12, 380], fill=MUTED, width=4)
    for y in range(80, 675, 24):
        d.line([600, y, 600, y + 12], fill=MUTED, width=4)


def m_compress(d):
    rr(d, [150, 180, 500, 580], 16, fill=CARD, outline=INK, width=5)
    rr(d, [186, 220, 464, 470], 10, fill=ACCENT_SOFT)
    d.ellipse([222, 256, 290, 324], fill=ACCENT)
    d.polygon([(206, 470), (300, 356), (394, 470)], fill=ACCENT)
    lines(d, 186, 508, 220, 2, 26, MUTED, 8, .2)
    d.line([560, 380, 660, 380], fill=ACCENT, width=6)
    d.polygon([(660, 358), (702, 380), (660, 402)], fill=ACCENT)
    rr(d, [760, 290, 1000, 470], 12, fill=CARD, outline=ACCENT, width=5)
    rr(d, [782, 312, 978, 424], 8, fill=ACCENT_SOFT)
    d.ellipse([806, 336, 846, 376], fill=ACCENT)
    d.polygon([(796, 424), (860, 348), (924, 424)], fill=ACCENT)


def m_tax_split(d):
    rr(d, [180, 180, 1020, 300], 14, fill=ACCENT_SOFT, outline=ACCENT, width=5)
    d.line([600, 340, 600, 400], fill=MUTED, width=5)
    d.line([330, 400, 870, 400], fill=MUTED, width=5)
    d.line([330, 400, 330, 450], fill=MUTED, width=5)
    d.line([870, 400, 870, 450], fill=MUTED, width=5)
    rr(d, [180, 450, 620, 600], 14, fill=CARD, outline=INK, width=5)
    lines(d, 216, 496, 300, 3, 34, INK, 9, .12)
    rr(d, [700, 450, 1020, 600], 14, fill=ACCENT, outline=ACCENT, width=5)
    lines(d, 736, 496, 220, 3, 34, CARD, 9, .12)


MOTIFS = {
    'label-crop': m_label_crop, 'return': m_return, 'statement': m_statement, 'photo': m_photo,
    'checklist': m_checklist, 'compare': m_compare, 'barcode': m_barcode, 'box': m_box,
    'frame': m_frame, 'flow': m_flow, 'label-4x6': m_label_4x6, 'chart': m_chart,
    'whitebox': m_whitebox, 'routes': m_routes, 'funnel': m_funnel,
    # tool-led articles
    'sort-sku': m_sort_sku, 'invoice-split': m_invoice_split, 'scale-small': m_scale_small,
    'margins': m_margins, 'local-merge': m_local_merge, 'split-docs': m_split_docs,
    'rotate': m_rotate, 'photo-stack': m_photo_stack, 'raster': m_raster, 'tips': m_tips,
    'mismatch': m_mismatch, 'waterfall': m_waterfall, 'weigh': m_weigh,
    'code-types': m_code_types, 'qr': m_qr, 'card-insert': m_card_insert,
    'invoice-fields': m_invoice_fields, 'sweep': m_sweep, 'nup-grid': m_nup_grid,
    'compress': m_compress, 'tax-split': m_tax_split,
}


def build(item, index):
    bg = BACKDROPS[index % len(BACKDROPS)]
    im = Image.new('RGB', (W, H), bg)
    d = ImageDraw.Draw(im)
    dot_grid(d, tuple(max(0, c - 14) for c in bg))
    # soft light wash, matching the site background treatment
    wash = Image.new('RGB', (W, H), bg)
    ImageDraw.Draw(wash).ellipse([-300, -420, 900, 420], fill=tuple(min(255, c + 12) for c in bg))
    im = Image.blend(im, wash.filter(ImageFilter.GaussianBlur(120)), 0.5)
    d = ImageDraw.Draw(im)
    MOTIFS[item['motif']](d)
    return im


def main():
    man = json.load(open(os.path.join(DIST, 'cover-manifest.json')))
    os.makedirs(OUT, exist_ok=True)
    for i, item in enumerate(man['covers']):
        master = build(item, i)
        for w in SIZES:
            img = master.resize((w, round(w * H / W)), Image.LANCZOS)
            suffix = '' if w == SIZES[0] else f'-{w}'
            img.save(os.path.join(OUT, f"{item['slug']}{suffix}.webp"), quality=86, method=6)
            img.convert('RGB').quantize(colors=128, method=Image.MEDIANCUT, dither=Image.NONE) \
               .save(os.path.join(OUT, f"{item['slug']}{suffix}.png"), optimize=True)
    print(f"covers: {len(man['covers'])} x {len(SIZES)} sizes")


if __name__ == '__main__':
    main()
