"""Inventory the fixed Class 6 science pages before/after the formatting rollout."""
import json, re, hashlib, sys
from pathlib import Path
from collections import defaultdict
from lxml import etree as ET
ROOT=Path(__file__).resolve().parent.parent
H=ROOT/'assets/design-history/science-g6-format-rollout'
H.mkdir(parents=True,exist_ok=True)
def inventory():
    result=[]
    for d in sorted((ROOT/'pages/class-6').glob('*')):
        if not (d/'chapter.json').exists():continue
        c=json.loads((d/'chapter.json').read_text())
        if c.get('subject')!='Science':continue
        pages=[];images=defaultdict(list)
        for f in sorted(d.glob('p*.html')):
            s=f.read_text(encoding='utf8'); tree=ET.fromstring(s.encode(),ET.XMLParser(recover=True))
            assets=[]
            for e in tree.iter():
                if ET.QName(e).localname not in ('image','img'):continue
                src=e.get('href') or e.get('src')
                if not src or re.search('icon|cues/|think-it-through',src):continue
                file=src.removeprefix('../../'); p=ROOT/file
                if not p.exists():continue
                h=hashlib.sha256(p.read_bytes()).hexdigest();assets.append(file)
                images[h].append({'page':f.name,'asset':file,'supplement':f'data-page-illustration="{file}"' in s})
            pages.append({'file':f.name,'sha256':hashlib.sha256(s.encode()).hexdigest(),'assets':assets,'text':' '.join(tree.itertext()),'anchors':re.findall(r'data-block="([^"]+)"',s)})
        result.append({'chapter':int(c['number']),'directory':str(d.relative_to(ROOT)).replace('\\','/'),'pages':pages,'repeats':[v for v in images.values() if len(v)>1]})
    return result
if __name__=='__main__':
    report=inventory();name=sys.argv[1] if len(sys.argv)>1 else 'before'
    dest=H/(name+'.json')
    if name=='before' and dest.exists():raise SystemExit('Baseline already exists')
    dest.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf8')
    for ch in report:
        print(ch['chapter'],len(ch['pages']),'pages')
        for r in ch['repeats']:print(' ',r[0]['asset'],','.join(x['page']+('*' if x['supplement'] else '') for x in r))
