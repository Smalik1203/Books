"""Render final PDFs with Poppler, verify their boxes, and make review contact sheets."""
import json,subprocess,hashlib,sys
from pathlib import Path
from PIL import Image,ImageOps,ImageDraw
from pypdf import PdfReader
H=Path('assets/design-history/science-g6-modern');out=Path('build/class-6/modern-review');out.mkdir(exist_ok=True)
poppler=Path('C:/Users/ragha/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe')
reports=[]
for ch in json.loads((H/'content.json').read_text(encoding='utf8')):
    if sys.argv[1:] and str(ch['config']['number']) not in sys.argv[1:]:continue
    name=ch['dir'];d=out/name;d.mkdir(exist_ok=True)
    for suffix in ['', '-bleed']:
        p=Path('build/class-6')/(name+suffix+'.pdf');pdf=PdfReader(p)
        sizes=[[round(float(pg.mediabox.width)*25.4/72,2),round(float(pg.mediabox.height)*25.4/72,2)]for pg in pdf.pages]
        expected=[208.87,292.10] if suffix else [189,272]
        assert all(abs(w-expected[0])<.3 and abs(h-expected[1])<.3 for w,h in sizes),(p,sizes)
        reports.append({'file':str(p),'pages':len(pdf.pages),'sizeMM':sizes[0]})
        if suffix:continue
        digest=hashlib.sha256(p.read_bytes()).hexdigest();stamp=d/'pdf.sha256'
        if not stamp.exists() or stamp.read_text()!=digest:
            subprocess.run([str(poppler),'-scale-to','1200','-png',str(p),str(d/'page')],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
            stamp.write_text(digest)
        files=[d/('page-'+str(i).zfill(len(str(len(pdf.pages))))+'.png') for i in range(1,len(pdf.pages)+1)]
        for start in range(0,len(files),6):
            sheet=Image.new('RGB',(1440,1440),'#dce0e0');draw=ImageDraw.Draw(sheet)
            for j,f in enumerate(files[start:start+6]):
                im=Image.open(f).convert('RGB');im.thumbnail((464,678))
                x=(j%3)*480+(480-im.width)//2;y=(j//3)*720+28
                sheet.paste(im,(x,y));draw.text((j%3*480+12,j//3*720+8),f'Chapter {ch["config"]["number"]} / page {start+j+1}',fill='black')
            sheet.save(d/f'contact-{start//6+1:02}.jpg',quality=92)
    print(name,'rendered')
(H/'pdf-audit.json').write_text(json.dumps(reports,indent=2))
