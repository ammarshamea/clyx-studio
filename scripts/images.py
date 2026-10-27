"""Write WebP derivatives next to the PNG originals in public/images/clyx.

The PNGs stay untouched and remain the fallback. Run: python scripts/images.py
"""

from pathlib import Path

from PIL import Image

FOLDER = Path(__file__).resolve().parent.parent / "public" / "images" / "clyx"
WIDTHS = (960, 1672)

for source in sorted(FOLDER.glob("*.png")):
    with Image.open(source) as image:
        image = image.convert("RGB")
        long_edge = max(image.size)
        for width in WIDTHS:
            scale = min(1.0, width / long_edge)
            size = (round(image.width * scale), round(image.height * scale))
            resized = image if scale == 1.0 else image.resize(size, Image.LANCZOS)
            target = FOLDER / f"{source.stem}-{width}.webp"
            resized.save(target, "WEBP", quality=82, method=6)
            print(f"{target.name} {size[0]}x{size[1]} {target.stat().st_size // 1024}KB")
