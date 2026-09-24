"""Check every science page, and retain all pre-change text and images."""
from pathlib import Path
from lxml import etree as E
from PIL import Image
import json,re,html,hashlib,difflib
H=Path('assets/design-history/science-page-images')
before=json.loads((H/'source-pages.json').read_text(encoding='utf8'))
def tree(s):return E.HTML(s)
def norm(s):return re.sub(r'\W','',html.unescape(s)).lower()
def clean(root):
    for e in root.xpath('//*[@data-page-illustration] | //*[contains(concat(" ",normalize-space(@class)," ")," v2-header ")] | //*[contains(concat(" ",normalize-space(@class)," ")," v2-footer ")] | //*[contains(concat(" ",normalize-space(@class)," ")," se-running ")] | //title'):
        if e.getparent() is not None:e.getparent().remove(e)
    return root
def strings(root):
    return [norm(' '.join(e.itertext())) for e in root.xpath('//text | //p | //h2 | //h3 | //li | //td | //th | //figcaption') if norm(' '.join(e.itertext()))]
def images(root):return [s for s in root.xpath('//image/@href | //img/@src') if not re.search(r'icon|cues/|think-it-through',s,re.I)]
report=[];errors=[];assets={}
for ch in before:
    d=Path(ch['dir']);files=sorted(d.glob('p*.html'));pages=[tree(p.read_text(encoding='utf8')) for p in files]
    afterText=norm(' '.join(' '.join(clean(tree(p.read_text(encoding='utf8'))).itertext()) for p in files))
    allImages={i for p in pages for i in images(p)}
    missing=[]
    for old in ch['pages']:
        for s in strings(clean(tree(old['html']))):
            if len(s)>12 and s not in afterText:missing.append(s)
        for i in images(tree(old['html'])):
            if i not in allImages:errors.append({'chapter':ch['dir'],'missingOriginalImage':i})
    for i,(p,root) in enumerate(zip(files,pages)):
        imgs=images(root)
        if not imgs:errors.append({'page':str(p),'error':'No content image'})
        folio=root.xpath('//section/@data-folio');assert folio==[str(i+1)],(p,folio)
        for src in imgs:
            f=Path(src.removeprefix('../../'))
            if not f.exists():errors.append({'page':str(p),'missingAsset':src})
        for g in root.xpath('//*[@data-page-illustration]'):
            f=Path(g.get('data-page-illustration'))
            if str(f) not in assets:
                im=Image.open(f);alpha=sum(im.getchannel('A').histogram()[:3])/im.width/im.height if im.mode=='RGBA' else 0
                if alpha<.05:errors.append({'asset':str(f),'error':'Newly placed art lacks transparent background'})
                assets[str(f)]={'pixels':list(im.size),'transparentPercent':round(alpha*100,2),'sha256':hashlib.sha256(f.read_bytes()).hexdigest()}
    if missing:errors.append({'chapter':ch['dir'],'missingText':missing})
    report.append({'chapter':ch['dir'],'pagesBefore':len(ch['pages']),'pagesAfter':len(files),'illustratedPages':sum(bool(images(p)) for p in pages),'newReferenceImages':sum(len(p.xpath('//*[@data-page-illustration]')) for p in pages)})
(H/'coverage-audit.json').write_text(json.dumps({'chapters':report,'assets':assets,'errors':errors},indent=2))
for c in report:print(c['chapter'],str(c['illustratedPages'])+'/'+str(c['pagesAfter']))
print('ERRORS',len(errors))
for e in errors[:15]:print(str(e)[:600])
raise SystemExit(bool(errors))
