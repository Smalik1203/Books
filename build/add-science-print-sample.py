from pathlib import Path
from pypdf import PdfReader, PdfWriter
import pypdfium2 as pdfium
root=Path(__file__).resolve().parent.parent
target=root/'output/pdf/ClassBridge-Textbook-Colour-Sample.pdf'
sample=PdfReader(target)
assert len(sample.pages) in (8,10)
science=PdfReader(root/'build/class-6/ch02-diversity-in-the-living-world-v2.pdf')
selected=[science.pages[9],science.pages[10]]
assert 'Plants That Cannot Stand Up' in selected[0].extract_text()
assert 'Lines on a Leaf' in selected[1].extract_text()
w=PdfWriter()
for p in list(sample.pages)[:8]+selected:w.add_page(p)
w.add_metadata({'/Title':'ClassBridge - Maths and Science Colour Print Sample','/Author':'Team ClassBridge'})
with target.open('wb') as f:w.write(f)
r=PdfReader(target)
assert len(r.pages)==10
assert '/OutputIntents' not in r.trailer['/Root']
for i,p in enumerate(selected):
 assert r.pages[i+8].get_contents().get_data()==p.get_contents().get_data()
 assert r.pages[i+8].mediabox==p.mediabox
doc=pdfium.PdfDocument(str(target))
for i in (8,9):doc[i].render(scale=1).to_pil().save(root/f'build/_print-colour-checks/combined-science-{i+1}.png')
print('Verified 10 pages: 8 maths + 2 unchanged Science V2 pages; original colour streams and page sizes preserved.')
