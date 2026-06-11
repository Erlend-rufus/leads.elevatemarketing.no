#!/usr/bin/env python3
"""
Self-host the webfonts used by the GEO-audit landing page.

The design system loads Montserrat + Poppins from Google Fonts via @import.
The brief requires self-hosted fonts (LCP < ~1.5s on mobile), so this script
downloads the `latin` subset (which fully covers Norwegian, incl. æ ø å) for
the weights actually used, writes them to /fonts, and prints the @font-face
block to paste into css/site.css.

Run from the repo root:  python3 scripts/fetch-fonts.py
Idempotent: re-running re-downloads and overwrites.
"""
import os
import re
import sys
import urllib.request

# Weights actually used on the page:
#   Montserrat 700 (bold mark), 800 (heavy headings), 900 (black H1/CTA numbers)
#   Poppins    300 (light body, default), 400 (regular), 500 (medium eyebrow/labels), 600 (reserve)
FAMILY_SPEC = "family=Montserrat:wght@700;800;900&family=Poppins:wght@300;400;500;600"
CSS_URL = f"https://fonts.googleapis.com/css2?{FAMILY_SPEC}&display=swap"

# A modern desktop UA makes Google Fonts return woff2 (smallest, universally supported).
CHROME_UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0 Safari/537.36"
)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONTS_DIR = os.path.join(ROOT, "fonts")


def fetch(url, ua=CHROME_UA):
    req = urllib.request.Request(url, headers={"User-Agent": ua})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def main():
    os.makedirs(FONTS_DIR, exist_ok=True)
    css = fetch(CSS_URL).decode("utf-8")

    # Walk the CSS, tracking the current subset comment, and capture each
    # @font-face's family / weight / src url. Keep only the `latin` subset.
    subset = None
    blocks = []  # (family, weight, url)
    for chunk in re.split(r"(/\*[^*]+\*/)", css):
        m = re.match(r"/\*\s*([a-z0-9-]+)\s*\*/", chunk.strip())
        if m:
            subset = m.group(1)
            continue
        if "@font-face" not in chunk:
            continue
        if subset != "latin":
            continue
        fam = re.search(r"font-family:\s*'([^']+)'", chunk)
        wgt = re.search(r"font-weight:\s*(\d+)", chunk)
        url = re.search(r"src:\s*url\(([^)]+)\)", chunk)
        if fam and wgt and url:
            blocks.append((fam.group(1), wgt.group(1), url.group(1)))

    if not blocks:
        print("ERROR: no latin @font-face blocks found", file=sys.stderr)
        sys.exit(1)

    face_css = []
    for fam, weight, url in sorted(blocks, key=lambda b: (b[0], int(b[1]))):
        fname = f"{fam.lower()}-{weight}.woff2"
        dest = os.path.join(FONTS_DIR, fname)
        data = fetch(url)
        with open(dest, "wb") as f:
            f.write(data)
        print(f"  saved fonts/{fname:<24} {len(data):>7,} bytes  <- {url}")
        face_css.append(
            "@font-face {\n"
            f"  font-family: '{fam}';\n"
            "  font-style: normal;\n"
            f"  font-weight: {weight};\n"
            "  font-display: swap;\n"
            f"  src: url('../fonts/{fname}') format('woff2');\n"
            "  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC,"
            " U+0304, U+0308, U+0329, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212,"
            " U+2215, U+FEFF, U+FFFD;\n"
            "}"
        )

    print("\n/* ---- paste into css/site.css ---- */\n")
    print("\n".join(face_css))


if __name__ == "__main__":
    main()
