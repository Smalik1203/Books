"""Guard the restored exercise structure, page sequence and transparent artwork."""
import json,hashlib
from pathlib import Path
from lxml import etree as E
from PIL import Image
from pypdf import PdfReader

folder=Path('pages/class-6/ch10-living-world')
files=sorted(folder.glob('p*.html'))
pages=[E.HTML(p.read_text(encoding='utf8')) for p in files]
assert len(pages)==50
assert [int(p.xpath('//section')[0].get('data-folio')) for p in pages]==list(range(1,51))
assert all(('data-bridge' in p.xpath('//section')[0].attrib)==(int(f.stem[1:])>=101) for f,p in zip(files,pages))
root=E.HTML('\n'.join(p.read_text(encoding='utf8') for p in files))
questions=root.xpath('//ol[@class="g6-questions"]')
assert [int(q.get('start')) for q in questions]==list(range(1,7))*3
options=root.xpath('//ol[@class="g6-options"]')
assert len(options)==23 and all(len(q.xpath('./li'))==4 for q in options)
assert len(root.xpath('//*[@data-header-art="6-10"]/*[@data-art-element]'))==3
assert len(root.xpath('//*[@data-block="g6-10-269-r0"]'))==1
art=[]
for name in ['opener-illustration.png','bose-illustration.png']:
    p=Path('figures/class-6/living-world')/name
    with Image.open(p) as im:
        assert im.mode=='RGBA' and im.getchannel('A').getextrema()==(0,255)
        art.append({'file':str(p),'size':list(im.size),'alphaRange':[0,255],'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
pdfs=[]
for suffix in ['', '-bleed']:
    p=Path('output/pdf')/('class-6-science-chapter-10'+suffix+'.pdf')
    pdf=PdfReader(p);assert len(pdf.pages)==50
    pdfs.append({'file':str(p),'pages':50,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
report={'chapter':'Class 6 Science Chapter 10','pages':50,'bodyPages':37,'beyondTheBookPages':13,'practiceQuestions':18,'workedQuestions':5,'optionsPerQuestion':4,'artwork':art,'pdfs':pdfs,'visualReview':'All 50 full-sheet PDF proofs reviewed; final changes on pages 32 and 47–50 rechecked at full size.','pagination':'Short pages preserve whole figures, panels, reference matter and questions. No type shrinking or spacing inflation.'}
Path('assets/design-history/science-g6-modern/ch10-living-world/design-verification.json').write_text(json.dumps(report,indent=2),encoding='utf8')
print('Chapter 10: 50 sequential folios, 18 numbered questions, 23 complete A–D option sets, 2 transparent PNGs and both 50-page PDFs verified.')
