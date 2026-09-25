from pathlib import Path
from pypdf import PdfReader, PdfWriter
import pypdfium2 as pdfium
from PIL import Image, ImageOps, ImageDraw
root=Path(__file__).resolve().parent.parent
file=root/'output/pdf/ClassBridge-Textbook-Colour-Sample.pdf'
sample=PdfReader(file); assert len(sample.pages)==7
book=PdfReader(root/'build/class-7/class-7-mathematics-i-book.pdf')
matches=[p for p in book.pages if 'Fig. 7.12' in p.extract_text() and '7.6' in p.extract_text()]
assert len(matches)==1,len(matches)
w=PdfWriter()
for page in sample.pages:w.add_page(page)
w.add_page(matches[0])
w.add_metadata({'/Title':'ClassBridge - Textbook Colour Sample (Original RGB)','/Author':'Team ClassBridge'})
with file.open('wb') as f:w.write(f)
r=PdfReader(file);assert len(r.pages)==8
assert '/OutputIntents' not in r.trailer['/Root']
for p in r.pages:
 assert abs(float(p.mediabox.width)*25.4/72-196)<.5
 assert abs(float(p.mediabox.height)*25.4/72-276)<.5
 assert b' rg' in p.get_contents().get_data()
doc=pdfium.PdfDocument(str(file)); tiles=[]
for i in range(8):
 im=doc[i].render(scale=1.2).to_pil(); im.save(root/f'build/_print-colour-checks/textbook-page-{i+1}.png')
 im.thumbnail((290,410));tile=Image.new('RGB',(310,440),'#dddddd');tile.paste(im,((310-im.width)//2,20));ImageDraw.Draw(tile).text((10,425),str(i+1),fill='black');tiles.append(tile)
sheet=Image.new('RGB',(1240,880),'white')
for i,im in enumerate(tiles):sheet.paste(im,((i%4)*310,(i//4)*440))
sheet.save(root/'build/_print-colour-checks/textbook-contact.png')
print('Verified: 8 pages, book trim 196 x 276 mm, original RGB, no CMYK output intent.')
