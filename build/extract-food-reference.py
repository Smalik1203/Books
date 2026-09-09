"""Extract the supplied PDF's embedded artwork losslessly; never resample it."""
import argparse
import json
from pathlib import Path
from pypdf import PdfReader

parser = argparse.ArgumentParser()
parser.add_argument('pdf')
parser.add_argument('--output', default='assets/food-reference/originals')
args = parser.parse_args()
out = Path(args.output)
out.mkdir(parents=True, exist_ok=True)
manifest = []
for number, page in enumerate(PdfReader(args.pdf).pages, 1):
    images = list(page.images)
    if len(images) != 1:
        raise ValueError(f'Page {number}: expected one reference image, found {len(images)}')
    image = images[0].image
    image.save(out / f'p{number:03}.png')
    manifest.append(dict(page=number, width=image.width, height=image.height,
                         mediaBox=list(map(float, page.mediabox))))
(out.parent / 'manifest.json').write_text(json.dumps(manifest, indent=2))
print(f'Extracted {len(manifest)} original page images to {out}')
