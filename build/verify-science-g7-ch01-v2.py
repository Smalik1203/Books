"""Verify the exported PDFs and preservation snapshot; render PDF review sheets."""
from pathlib import Path
from pypdf import PdfReader
from PIL import Image, ImageDraw
import hashlib, json, subprocess, urllib.request, re

root=Path(__file__).resolve().parent.parent
chapter='class-7/ch01-ever-evolving-world-of-science-v2'
history=root/'assets/design-history/science-v2-g7-ch01'
review=root/'build/_class7-ch01-review'; review.mkdir(exist_ok=True)
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
page_count=10
report={'chapter':chapter,'exports':[]}
alpha_report=[]
for photo in json.loads((history/'photographs.json').read_text(encoding='utf-8')):
    with Image.open(root/photo['file']) as im:
        assert im.format=='PNG' and im.mode=='RGBA',photo['key']+' must be a real RGBA PNG'
        histogram=im.getchannel('A').histogram()
        transparent_fraction=histogram[0]/(im.width*im.height)
        assert transparent_fraction>.1,photo['key']+' must have a removed background, not just a PNG extension'
        alpha_report.append({'key':photo['key'],'transparentPercent':round(100*transparent_fraction,1)})
report['transparentCutouts']=alpha_report
for suffix in ['', '-bleed']:
    file=root/'build'/f'{chapter}{suffix}.pdf'
    reader=PdfReader(file)
    assert len(reader.pages)==page_count
    sizes=[]; fonts=set(); image_sizes=[]; image_masks=0
    for page in reader.pages:
        w,h=[float(v)*25.4/72 for v in [page.mediabox.width,page.mediabox.height]]
        expected=(189,272) if not suffix else (209,292)
        assert abs(w-expected[0])<.2 and abs(h-expected[1])<.2,(w,h)
        assert len(page.extract_text())>250,'Live selectable page text is required'
        sizes.append([round(w,2),round(h,2)])
        resources=page['/Resources'].get_object()
        for ref in resources.get('/Font',{}).values():
            font=ref.get_object(); assert font['/Subtype']!='/Type3','Do not rasterise type'
            fonts.add(str(font.get('/BaseFont')))
            for descendant in font.get('/DescendantFonts',[ref]):
                face=descendant.get_object(); desc=face.get('/FontDescriptor')
                if desc:
                    desc=desc.get_object()
                    assert any(k in desc for k in ['/FontFile','/FontFile2','/FontFile3']),'Embed fonts'
        for ref in resources.get('/XObject',{}).values():
            obj=ref.get_object()
            if obj.get('/Subtype')=='/Image':
                image_sizes.append([obj['/Width'],obj['/Height']])
                if '/SMask' in obj:image_masks+=1
    assert any('SourceSerif4' in f for f in fonts) and any('SourceSans3' in f for f in fonts)
    assert [1536,1024] in image_sizes,'Native opener resolution retained in PDF'
    photos=json.loads((history/'photographs.json').read_text(encoding='utf-8'))
    assert len(image_sizes)==1+len(photos),'Opener plus every credited photograph embedded'
    assert image_masks==len(photos),'Every supporting cutout retains its transparency mask in the PDF'
    for photo in photos:
        assert photo['pixels'] in image_sizes,photo['key']+' missing from PDF'
    report['exports'].append(dict(file=str(file.relative_to(root)),sha256=sha(file),pages=page_count,mediaMM=sizes[0],embeddedFonts=sorted(fonts),imagePixels=image_sizes))

before=json.loads((review/'before.json').read_text(encoding='utf-8'))
changed=[name for name,expected in before.items() if not (root/name).is_file() or sha(root/name)!=expected]
assert not changed,changed
report['preservation']={'checkedFiles':len(before),'changedFiles':changed,'scope':'Class 6 pages and figures, existing CSS, original compositor/global builder files, four Class 6 V2 PDFs'}
inventory=json.loads((history/'reference-inventory.json').read_text(encoding='utf-8'))
assert len(inventory['chapters'])==12 and Path(inventory['index']).is_file()
assert all(Path(c['path']).is_file() for c in inventory['chapters'])
v2=[]
for config in (root/'pages/class-7').glob('*/chapter.json'):
    if json.loads(config.read_text(encoding='utf-8')).get('profile')=='science-v2':v2.append(config.parent.name)
assert v2==['ch01-ever-evolving-world-of-science-v2'],v2
report['referenceOnlyChapters']=list(range(2,13))
report['sourceSHA256']=sha(Path(json.loads((history/'source.json').read_text(encoding='utf-8'))['path']))

# A live library response confirms registration without changing studio settings.
library=urllib.request.urlopen('http://localhost:5180/',timeout=15).read().decode()
assert f'/read/{chapter}' in library
viewer=urllib.request.urlopen(f'http://localhost:5180/read/{chapter}',timeout=15).read().decode()
assert 'subject=Science' in viewer and 'Science V2' not in viewer and '· V2' not in viewer and 'Class 7' in viewer
(review/'studio-library.html').write_text(library,encoding='utf-8')
report['studio']={'url':f'http://localhost:5180/read/{chapter}','libraryCard':True,'viewer':True}

pdf=root/'build'/f'{chapter}.pdf'
subprocess.run(['pdftoppm','-png','-r','120',str(pdf),str(review/'reading')],check=True,capture_output=True)
subprocess.run(['pdftoppm','-png','-r','160','-f','1','-l','1',str(root/'build'/f'{chapter}-bleed.pdf'),str(review/'bleed-opener')],check=True,capture_output=True)
images=[Image.open(review/f'reading-{n:02}.png').convert('RGB') for n in range(1,page_count+1)]
for left,right in [(2,3),(4,5),(6,7),(8,9)]:
    a,b=images[left-1],images[right-1]
    sheet=Image.new('RGB',(a.width+b.width+20,max(a.height,b.height)), '#b5bcc0')
    sheet.paste(a,(0,0));sheet.paste(b,(a.width+20,0));sheet.save(review/f'spread-{left}-{right}.png')
images[0].crop((0,0,images[0].width,round(images[0].height*.26))).save(review/'opener-header.png')
history.joinpath('verification.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(f'Both {page_count}-page PDFs verified; live embedded fonts and native artwork retained. {len(before)} protected files byte-identical. Studio entry verified. PDF pages and spreads rendered.')
