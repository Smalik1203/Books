"""Archive the source evidence and reference inventory without changing PDFs."""
from pathlib import Path
from pypdf import PdfReader
from PIL import Image
import json, hashlib, shutil, argparse

parser=argparse.ArgumentParser(description=__doc__)
parser.add_argument('--opener',type=Path,help='Optional native generated image to import; otherwise retain the vendored opener.')
args=parser.parse_args()

root=Path(__file__).resolve().parent.parent
base=Path(r'C:\Books\6-10 Books\7\7 Science')
history=root/'assets/design-history/science-v2-g7-ch01'
art=root/'figures/class-7/science/ch01-v2'
review=root/'build/_class7-ch01-review'
for p in [history,art,review]: p.mkdir(parents=True,exist_ok=True)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
snapshot=review/'before.json'
if not snapshot.exists():
    protected=[p for parent in [root/'pages/class-6',root/'figures/class-6',root/'css'] for p in parent.rglob('*') if p.is_file()]
    protected += [root/p for p in ['build/build.mjs','build/science-contract.mjs','build/compose-science-ch01-v2.mjs','build/compose-science-ch02-v2.mjs']]
    protected += list((root/'build/class-6').glob('*v2*.pdf'))
    snapshot.write_text(json.dumps({str(p.relative_to(root)):sha(p) for p in protected},indent=2),encoding='utf-8')
source=base/'Chapter 1.pdf';reader=PdfReader(source)
(history/'source-extraction.txt').write_text('\n\n'.join(f'PAGE {i+1}\n{p.extract_text()}' for i,p in enumerate(reader.pages)),encoding='utf-8')
(history/'source.json').write_text(json.dumps(dict(path=str(source),sha256=sha(source),pages=len(reader.pages),edition='Curiosity Grade 7, reprint 2026-27',note='Visible six-page source reviewed; repeated heading fragments and page furniture are not duplicated as teaching content.'),indent=2),encoding='utf-8')
titles=['The Ever-Evolving World of Science','Exploring Substances: Acidic, Basic, and Neutral','Electricity: Circuits and their Components','The World of Metals and Non-metals','Changes Around Us: Physical and Chemical','Adolescence: A Stage of Growth and Change','Heat Transfer in Nature','Measurement of Time and Motion','Life Processes in Animals','Life Processes in Plants','Light: Shadows and Reflections','Earth, Moon, and the Sun']
(history/'reference-inventory.json').write_text(json.dumps(dict(index=str(base/'Index.pdf'),chapters=[dict(number=i,title=t,path=str(base/f'Chapter {i}.pdf'),status='current source' if i==1 else 'reference only; not built') for i,t in enumerate(titles,1)]),indent=2),encoding='utf-8')
target=art/'opener.png'
if args.opener: shutil.copyfile(args.opener,target)
if not target.is_file(): parser.error('Supply --opener with the native generated image on first import.')
artworks=[dict(file=str(target.relative_to(root)),pixels=list(Image.open(target).size),sha256=sha(target),method='Built-in image_gen; copied without resampling',role='Contextual opener, not an investigation result',printedWidthMM=874/1052*189)]
photos=history/'photographs.json'
if photos.is_file():
    for photo in json.loads(photos.read_text(encoding='utf-8')):
        image=root/photo['file']
        artworks.append(dict(file=photo['file'],pixels=list(Image.open(image).size),sha256=sha(image),method='Real photograph; licensed source recorded in photographs.json',role=photo['label']))
(history/'artwork.json').write_text(json.dumps(artworks,indent=2),encoding='utf-8')
print('Source archived, future-reference inventory recorded, independent opener prepared.')
