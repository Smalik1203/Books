from pathlib import Path
from PIL import Image,ImageDraw
from pypdf import PdfReader
import json,subprocess,re,hashlib,sys,unicodedata,os,shutil
root=Path(__file__).resolve().parent.parent;review=root/'build/_comparison-tables-review'
review.mkdir(exist_ok=True)
history=root/'assets/design-history/science-g7-comparison-tables'
chapters=json.loads((history/'before-content.json').read_text())
ledger=json.loads((history/'editorial-ledger.json').read_text())['chapters']
norm=lambda s:re.sub(r'[^\w]+',' ',unicodedata.normalize('NFKC',s).replace('ʼ',"'").replace('_',' ')).lower().strip()
poppler=os.environ.get('PDFTOPPM') or shutil.which('pdftoppm') or str(Path.home()/'.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe')
exports=[]
for c in chapters:
    selected=[int(n) for n in sys.argv[1:] if n.isdigit()]
    if selected and c['number'] not in selected: continue
    slug=c['chapter'];folder=review/f"ch{c['number']:02}";folder.mkdir(exist_ok=True)
    pages=sorted((root/'pages'/slug).glob('p*.html'));count=len(pages)
    for suffix in ['', '-bleed']:
        f=root/'build'/f'{slug}{suffix}.pdf';pdf=PdfReader(f);assert len(pdf.pages)==count
        fonts=set()
        for page in pdf.pages:
            expected=(209,292) if suffix else (189,272)
            assert all(abs(float(a)*25.4/72-b)<.2 for a,b in zip((page.mediabox.width,page.mediabox.height),expected))
            assert len(page.extract_text())>90
            for ref in page['/Resources'].get_object().get('/Font',{}).values():
                font=ref.get_object();assert font['/Subtype']!='/Type3';fonts.add(str(font.get('/BaseFont')))
        assert any('SourceSerif4' in s for s in fonts) and any('SourceSans3' in s for s in fonts)
        for table in next(ch for ch in ledger if ch['number']==c['number'])['tables']:
            printed=norm(pdf.pages[table['page']-1].extract_text())
            for value in [table['caption'],table['revised']['note'],*[v for row in table['revised']['rows'] for v in row]]:
                assert norm(value) in printed, f"Missing PDF table text: chapter {c['number']} / {table['id']} / {value}"
        exports.append({'chapter':c['number'],'file':str(f.relative_to(root)),'pages':count,'sha256':hashlib.sha256(f.read_bytes()).hexdigest(),'trimMM':expected})
    if '--render' not in sys.argv:
        print(f"Chapter {c['number']}: both PDFs verified, including all comparison cells.",flush=True)
        continue
    subprocess.run([poppler,'-png','-r','100',str(root/'build'/f'{slug}.pdf'),str(folder/'reading')],check=True,capture_output=True)
    images=sorted(folder.glob('reading-*.png'))
    for start in range(0,len(images),6):
        sheet=Image.new('RGB',(1500,1500),'#cbd1cf');d=ImageDraw.Draw(sheet)
        for i,p in enumerate(images[start:start+6]):
            im=Image.open(p);im.thumbnail((488,708));x=i%3*500;y=i//3*750
            sheet.paste(im,(x+(500-im.width)//2,y+28));d.text((x+12,y+8),f"CH{c['number']} / {p.stem}",fill='black')
        sheet.save(folder/f'contact-{start//6+1}.png')
    print(f"Chapter {c['number']}: verified both PDFs; rendered {count} pages.",flush=True)
report=root/'assets/design-history/science-g7-comparison-tables/pdf-verification.json'
previous=json.loads(report.read_text()) if report.exists() else []
numbers={e['chapter'] for e in exports}
report.write_text(json.dumps(sorted([e for e in previous if e['chapter'] not in numbers]+exports,key=lambda e:(e['chapter'],e['file'])),indent=2))
