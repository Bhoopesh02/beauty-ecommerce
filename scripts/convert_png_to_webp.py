"""
Convert all PNG images under public/images/ to WebP format.
Uses lossless WebP to preserve full quality as requested.
"""

import os
from pathlib import Path
from PIL import Image

PUBLIC_DIR = Path(__file__).resolve().parent.parent / "public" / "images"

# All PNG files to convert
PNG_FILES = [
    # Products
    "products/Botanical-Face-Wash.png",
    "products/Herbal-Hair-Oil.png",
    "products/Hydraglow-Moisturizer.png",
    "products/NOURISHING-HERBAL-SHAMPOO.png",
    "products/Natural-Skin-&-Hair-Care-Combo.png",
    "products/Rose-Water-Face-Mist.png",
    # Stock
    "stock/categories/combos.png",
    "stock/decorative/404.png",
    "stock/decorative/success.png",
]


def convert_png_to_webp(relative_path: str) -> None:
    src = PUBLIC_DIR / relative_path
    dst = src.with_suffix(".webp")

    if not src.exists():
        print(f"  SKIP (not found): {relative_path}")
        return

    src_size = src.stat().st_size
    img = Image.open(src)

    # Use lossless WebP to preserve full image quality
    img.save(dst, "WEBP", lossless=True, quality=100)

    dst_size = dst.stat().st_size
    reduction = (1 - dst_size / src_size) * 100

    print(
        f"  OK: {relative_path}"
        f"  {src_size / 1_048_576:.1f}MB -> {dst_size / 1_048_576:.1f}MB"
        f"  ({reduction:+.1f}%)"
    )


def main() -> None:
    print(f"Converting {len(PNG_FILES)} PNG files to lossless WebP...\n")

    for rel_path in PNG_FILES:
        convert_png_to_webp(rel_path)

    print("\nDone. Original PNGs are preserved — delete them manually if desired.")


if __name__ == "__main__":
    main()
