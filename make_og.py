#!/usr/bin/env python3
"""
Generate og.png (1200x630) for ninkoro.com social cards.

Run (one line):
    python make_og.py

Requires Pillow. No external network, no web fonts — uses system serif fonts
with sane cross-platform fallbacks. The card is intentionally text-light
(English monogram + tagline) so it never depends on a CJK font being present;
the Chinese title/description are carried by the page's OG/Twitter meta instead.
"""
import os
from PIL import Image, ImageDraw, ImageFont

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "og.png")
W, H = 1200, 630

BG = (14, 13, 11)          # #0e0d0b
PANEL = (22, 20, 15)       # slightly lifted panel
GOLD = (211, 162, 74)      # #d3a24a
DIM = (150, 140, 120)      # muted text


def load_font(size, bold=False):
    candidates = [
        # Linux
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf" if bold
        else "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf",
        # macOS
        "/System/Library/Fonts/Supplemental/Times New Roman.ttf",
        "/System/Library/Fonts/Georgia.ttf",
        # Windows
        "C:/Windows/Fonts/times.ttf",
        "C:/Windows/Fonts/georgia.ttf",
    ]
    for p in candidates:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()


def main():
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    # subtle vertical vignette via horizontal bands
    for y in range(0, H, 4):
        t = y / H
        r = int(BG[0] + (8 - BG[0]) * (1 - abs(t - 0.5) * 2) * 0.4)
        g = int(BG[1] + (8 - BG[1]) * (1 - abs(t - 0.5) * 2) * 0.4)
        b = int(BG[2] + (6 - BG[2]) * (1 - abs(t - 0.5) * 2) * 0.4)
        d.rectangle([0, y, W, y + 4], fill=(r, g, b))

    # centered monogram panel
    box = 200
    bx0, by0 = (W - box) // 2, 150
    bx1, by1 = bx0 + box, by0 + box
    d.rounded_rectangle([bx0, by0, bx1, by1], radius=36, fill=PANEL,
                        outline=GOLD, width=3)
    nf = load_font(140, bold=True)
    d.text((W // 2, by0 + box // 2), "N", font=nf, fill=GOLD,
           anchor="mm")

    # tagline
    tf = load_font(34, bold=True)
    d.text((W // 2, 420), "AI BUILDER · PERSONAL LAB", font=tf,
           fill=GOLD, anchor="mm")
    sf = load_font(26)
    d.text((W // 2, 470), "ninkoro.com", font=sf, fill=DIM, anchor="mm")

    img.save(OUT)
    print("wrote", OUT, os.path.getsize(OUT), "bytes")


if __name__ == "__main__":
    main()
