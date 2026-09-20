"""Extract source artwork without resampling; preserve the supplied PDF."""
from pathlib import Path
from pypdf import PdfReader
from PIL import Image
import hashlib, json, shutil

root=Path(__file__).resolve().parent.parent
source=Path(r'C:\Books\6-10 Books\6\6 Science\Chapter 1.pdf')
art=root/'figures/class-6/science/ch01-v2'
history=root/'assets/design-history/science-v2-ch01'
art.mkdir(parents=True,exist_ok=True)
history.mkdir(parents=True,exist_ok=True)
reader=PdfReader(source)
records=[]
for page,index,name in [(1,2,'desert'),(1,3,'coast'),(1,4,'ocean'),(1,5,'galaxy'),(6,2,'team')]:
    im=reader.pages[page].images[index]
    target=art/(name+Path(im.name).suffix)
    target.write_bytes(im.data)
    records.append(dict(file=target.relative_to(root).as_posix(),sourcePage=page+1,
                        sourceObject=im.name,pixels=list(im.image.size),
                        sha256=hashlib.sha256(im.data).hexdigest(),method='Extracted embedded image, no resampling'))
original=root/'figures/class-6/science/ch01-p001-curiosity-cutout-v4.png'
shutil.copyfile(original,art/'opener.png')
records.append(dict(file='figures/class-6/science/ch01-v2/opener.png',source=original.relative_to(root).as_posix(),
                    pixels=list(Image.open(original).size),sha256=hashlib.sha256(original.read_bytes()).hexdigest(),method='Independent byte-identical copy of existing chapter artwork'))
# PDF page 7 contains a hidden repetition of page 6 in its text layer. The
# source ledger maps visible printed content, checked against page renders.
text='\n\n'.join(f'PAGE {i+1}\n{p.extract_text()}' for i,p in enumerate(reader.pages))
(history/'source-extraction.txt').write_text(text,encoding='utf-8')
(history/'source.json').write_text(json.dumps(dict(path=str(source),sha256=hashlib.sha256(source.read_bytes()).hexdigest(),
    pages=len(reader.pages),edition='Curiosity, Grade 6, reprint 2026-27',
    extractionNote='Hidden duplicate text on PDF page 7 is not a second teaching requirement; printed pages visually inspected.',artwork=records),indent=2),encoding='utf-8')
print(f'Prepared {len(records)} independent illustrations; original PDF and original chapter unchanged.')
