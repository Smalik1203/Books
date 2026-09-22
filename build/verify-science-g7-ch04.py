"""Verify native assets, PDFs, preservation and studio; render every PDF page."""
from pathlib import Path
from pypdf import PdfReader
from PIL import Image, ImageDraw
import json, hashlib, re, urllib.request, subprocess

root=Path(__file__).resolve().parent.parent
chapter='class-7/ch04-metals-non-metals'
history=root/'assets/design-history/science-g7-ch04'
review=root/'build/_class7-ch04-review'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
assets=json.loads((history/'artwork.json').read_text())
report={'chapter':chapter,'assets':[],'exports':[]}
for a in assets:
    im=Image.open(root/a['file']);assert im.format=='PNG' and im.mode=='RGBA'
    alpha=im.getchannel('A').histogram()[0]/(im.width*im.height)
    assert alpha>.1 and list(im.size)==a['pixels']
    if not a['key'].startswith('apparatus-'): assert min(im.size)>=1024
    report['assets'].append({'key':a['key'],'transparentPercent':round(alpha*100,1),'pixels':list(im.size)})
for suffix in ['', '-bleed']:
    file=root/'build'/f'{chapter}{suffix}.pdf';pdf=PdfReader(file)
    assert len(pdf.pages)==23
    fonts=set();masks=0;native=0
    for p in pdf.pages:
        size=[float(v)*25.4/72 for v in [p.mediabox.width,p.mediabox.height]]
        expected=[189,272] if not suffix else [209,292]
        assert all(abs(a-b)<.2 for a,b in zip(size,expected)),size
        assert len(p.extract_text())>200,'Live text required'
        r=p['/Resources'].get_object()
        for ref in r.get('/Font',{}).values():
            f=ref.get_object();assert f['/Subtype']!='/Type3';fonts.add(str(f.get('/BaseFont')))
            for item in f.get('/DescendantFonts',[ref]):
                fd=item.get_object().get('/FontDescriptor')
                if fd:assert any(k in fd.get_object() for k in ['/FontFile','/FontFile2','/FontFile3'])
        for ref in r.get('/XObject',{}).values():
            o=ref.get_object()
            if o.get('/Subtype')=='/Image':
                assert '/SMask' in o,'Every image must retain real transparency'
                assert [o['/Width'],o['/Height']] in [a['pixels'] for a in assets], 'Native manifest image dimensions'
                masks+=1;native+=1
    assert masks==9,(suffix,masks)
    assert any('SourceSerif4' in f for f in fonts) and any('SourceSans3' in f for f in fonts)
    report['exports'].append({'file':str(file.relative_to(root)),'pages':23,'mediaMM':[round(n,2) for n in size],'transparentImages':masks,'fonts':sorted(fonts),'sha256':sha(file)})
before=json.loads((review/'before.json').read_text())
changed=[p for p,h in before.items() if not (root/p).is_file() or sha(root/p)!=h]
assert not changed,changed
report['preservation']={'checkedFiles':len(before),'changedFiles':changed}
library=urllib.request.urlopen('http://localhost:5180/',timeout=20).read().decode()
assert f'/read/{chapter}' in library
viewer=urllib.request.urlopen(f'http://localhost:5180/read/{chapter}',timeout=20).read().decode()
assert 'subject=Science' in viewer and 'Science V2' not in viewer
report['studio']={'url':f'http://localhost:5180/read/{chapter}','registered':True,'subject':'Science'}
subprocess.run(['pdftoppm','-png','-r','110',str(root/'build'/f'{chapter}.pdf'),str(review/'reading')],check=True,capture_output=True)
subprocess.run(['pdftoppm','-f','1','-l','1','-png','-r','150',str(root/'build'/f'{chapter}-bleed.pdf'),str(review/'bleed')],check=True,capture_output=True)
files=sorted(review.glob('reading-*.png'))
for start in range(0,len(files),2):
    sheet=Image.new('RGB',(1300,980),'#d1d5d2');d=ImageDraw.Draw(sheet)
    for j,f in enumerate(files[start:start+2]):
        im=Image.open(f);im.thumbnail((635,930));sheet.paste(im,(j*650+(650-im.width)//2,30));d.text((j*650+18,10),f'Page {start+j+1}',fill='black')
    sheet.save(review/f'spread-{start//2+1:02}.png')
# Actual facing-page review: even folio at left, next odd folio at right.
for left in range(2,len(files),2):
    sheet=Image.new('RGB',(1300,980),'#d1d5d2');d=ImageDraw.Draw(sheet)
    for j,folio in enumerate([n for n in [left,left+1] if n<=len(files)]):
        im=Image.open(files[folio-1]);im.thumbnail((635,930));sheet.paste(im,(j*650+(650-im.width)//2,30));d.text((j*650+18,10),f'Page {folio}',fill='black')
    sheet.save(review/f'facing-{left:02}.png')
(history/'verification.json').write_text(json.dumps(report,indent=2))
print(f'PDFs verified: 23 pages each; 9 native transparent image placements; {len(before)} existing files unchanged; Science studio registration confirmed.')
