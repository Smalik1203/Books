"""Render all Chapter 12 pages and verify print geometry and embedded images."""
from pathlib import Path
from pypdf import PdfReader
from PIL import Image,ImageDraw
import json,subprocess,hashlib
root=Path(__file__).resolve().parent.parent
chapter='class-6/ch12-beyond-earth'
history=root/'assets/design-history/science-g6-ch12'
review=root/'build/_class6-ch12-review';review.mkdir(exist_ok=True)
count=len(json.loads((history/'page-map.json').read_text(encoding='utf-8')))
report={'chapter':chapter,'assets':[],'exports':[]}
for a in json.loads((history/'artwork.json').read_text(encoding='utf-8')):
    p=root/a['file'];im=Image.open(p)
    assert im.mode=='RGBA' and im.format=='PNG'
    assert hashlib.sha256(p.read_bytes()).hexdigest()==a['sha256']
    transparency=sum(im.getchannel('A').histogram()[:3])/im.width/im.height
    assert transparency>.1
    report['assets'].append({'key':a['key'],'transparentPercent':round(transparency*100,2)})
for suffix in ['', '-bleed']:
    pdf=PdfReader(root/'build'/f'{chapter}{suffix}.pdf')
    assert len(pdf.pages)==count
    images=[]
    for i,p in enumerate(pdf.pages):
        expected=[189,272] if not suffix else [209,292]
        actual=[float(v)*25.4/72 for v in [p.mediabox.width,p.mediabox.height]]
        assert all(abs(a-b)<.2 for a,b in zip(actual,expected)),actual
        assert len(p.extract_text())>200
        objects=p['/Resources'].get_object().get('/XObject',{})
        n=sum(ref.get_object().get('/Subtype')=='/Image' for ref in objects.values())
        images.append(n)
        for ref in objects.values():
            o=ref.get_object()
            if o.get('/Subtype')=='/Image':assert '/SMask' in o
    report['exports'].append({'file':f'{chapter}{suffix}.pdf','pages':len(pdf.pages),'imagesPerPage':images})
poppler='C:/Users/ragha/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe'
subprocess.run([poppler,'-scale-to','1450','-png',str(root/'build'/f'{chapter}.pdf'),str(review/'page')],check=True)
digits=len(str(count))
proofs=[review/f'page-{i:0{digits}d}.png' for i in range(1,count+1)]
assert all(p.exists() for p in proofs)
for batch in range((count+4)//5):
    sheet=Image.new('RGB',(2100,680),'#e5e8e7');draw=ImageDraw.Draw(sheet)
    for j,p in enumerate(proofs[batch*5:(batch+1)*5]):
        im=Image.open(p);im.thumbnail((404,622));x=8+j*420
        sheet.paste(im,(x,32));draw.text((x,10),'Page '+str(batch*5+j+1),fill='black')
    sheet.save(review/f'contact-{batch+1}.png')
(history/'export-verification.json').write_text(json.dumps(report,indent=2))
print(str(count)+' pages rendered; transparent assets, live text, trim and bleed dimensions verified.')
