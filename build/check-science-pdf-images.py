"""Verify embedded images and trim in all Class 6/7 science reading PDFs."""
import json
from pathlib import Path
from pypdf import PdfReader

history=Path('assets/design-history/science-page-images')
report=[]
for chapter in json.loads((history/'coverage-audit.json').read_text())['chapters']:
    key=chapter['chapter'].removeprefix('pages/')
    reader=PdfReader(Path('build')/(key+'.pdf'))
    errors=[]
    if len(reader.pages)!=chapter['pagesAfter']:errors.append('PDF page count differs from sources')
    for number,page in enumerate(reader.pages,1):
        objects=page['/Resources'].get('/XObject',{})
        if not any(obj.get_object().get('/Subtype')=='/Image' for obj in objects.values()):
            errors.append(f'p{number}: no embedded image')
        width,height=float(page.mediabox.width)*25.4/72,float(page.mediabox.height)*25.4/72
        if abs(width-189)>.5 or abs(height-272)>.5:errors.append(f'p{number}: incorrect trim')
    report.append(dict(chapter=key,pages=len(reader.pages),errors=errors))
(history/'pdf-image-audit.json').write_text(json.dumps(report,indent=2)+'\n')
print(f'{len(report)} PDFs, {sum(c["pages"] for c in report)} pages, {sum(len(c["errors"]) for c in report)} errors')
raise SystemExit(any(c['errors'] for c in report))
