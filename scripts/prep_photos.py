#!/usr/bin/env python3
"""Prepare job photos for the website.

Drop originals (phone photos, any size) into  photos-raw/  named the way the
site expects — e.g. driveway-removal-before.jpg, home-hero.jpg — then run:

    pip install pillow pillow-heif   # once (pillow-heif only needed for iPhone HEIC)
    python3 scripts/prep_photos.py

Each photo is auto-rotated, resized to 1920px on the long edge, stripped of
EXIF metadata (including GPS location of customers' homes) and saved as WebP
in src/assets/photos/. Rebuild the site afterwards (npm run build).
"""
import pathlib, sys
from PIL import Image, ImageOps

try:
    import pillow_heif  # type: ignore
    pillow_heif.register_heif_opener()
except ImportError:
    pass

SRC = pathlib.Path("photos-raw")
OUT = pathlib.Path("src/assets/photos")
MAX = 1920

def main() -> int:
    if not SRC.exists():
        SRC.mkdir()
        print(f"Created {SRC}/ — add photos there and run again.")
        return 0
    OUT.mkdir(parents=True, exist_ok=True)
    n = 0
    for f in sorted(SRC.iterdir()):
        if f.suffix.lower() not in {".jpg", ".jpeg", ".png", ".heic", ".webp", ".tif", ".tiff"}:
            continue
        im = ImageOps.exif_transpose(Image.open(f)).convert("RGB")
        im.thumbnail((MAX, MAX), Image.LANCZOS)
        dest = OUT / (f.stem.lower().replace(" ", "-") + ".webp")
        im.save(dest, "WEBP", quality=80, method=6)  # no exif= → metadata dropped
        print(f"  {f.name} → {dest} ({im.width}×{im.height}, {dest.stat().st_size // 1024} KB)")
        n += 1
    print(f"Processed {n} photo(s).")
    return 0

if __name__ == "__main__":
    sys.exit(main())
