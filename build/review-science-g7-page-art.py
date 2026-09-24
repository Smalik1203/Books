"""Apply the reviewed, page-specific art plan without changing text or pagination."""
import hashlib, html, json, re, time
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
HISTORY=ROOT/'assets/design-history/science-g7-image-repetition'
def write(path,text):
    if path.exists() and path.read_text(encoding='utf8')==text:return
    for attempt in range(8):
        try:path.write_text(text,encoding='utf8');return
        except OSError:
            if attempt==7:raise
            time.sleep(.2*(attempt+1))
def digest(file):return hashlib.sha256((ROOT/file).read_bytes()).hexdigest()
def main():
    replacements=json.loads((HISTORY/'replacements.json').read_text(encoding='utf8'))
    plans={}; report=[]
    for chapter,entries in replacements.items():
        directory=next(p for p in (ROOT/'pages/class-7').iterdir() if (p/'chapter.json').exists() and
          (lambda m:m.get('subject')=='Science' and int(m.get('number',0))==int(chapter))(json.loads((p/'chapter.json').read_text())))
        mapfile=ROOT/f'assets/design-history/science-g7-ch{int(chapter):02}/page-map.json'
        page_map=json.loads(mapfile.read_text(encoding='utf8'));approved=[]; used=set()
        primary={digest(src) for p in directory.glob('p*.html') for src in re.findall(r'<image\b[^>]*href="../../([^"]+)"',re.sub(r'<g data-page-illustration=.*?</g>','',p.read_text(encoding='utf8'),flags=re.S)) if (ROOT/src).is_file()}
        for number,item in sorted(entries.items(),key=lambda x:int(x[0])):
            file=directory/f'p{int(number):03}.html';before=file.read_text(encoding='utf8')
            match=re.search(r'<g data-page-illustration=.*?</g>',before,re.S)
            if not match:raise ValueError(f'Missing supplementary figure: {file}')
            h=digest(item['file'])
            if h in primary or h in used:raise ValueError(f'Repeated image: {chapter}/{number}: {item["file"]}')
            used.add(h)
            old=match.group();caption=html.escape(item['caption'],quote=True);asset=item['file']
            attrs=dict(re.findall(r'(\w+)="([^"]+)"',re.search(r'<image\b[^>]*>',old)[0]))
            assert float(attrs['width'])<=720 and float(attrs['height'])<=280, 'Never shrink an existing figure'
            enlarged=float(attrs['width'])<720 or float(attrs['height'])<280
            top=float(re.search(r'<g transform="translate\(0 ([\d.]+)\)">$' ,before[:match.start()].rstrip())[1])
            if enlarged:assert top+340<=1415, f'Figure needs refitting: {file}'
            new=f'<g data-page-illustration="{asset}"><image class="science-illustration" href="../../{asset}" x="166" y="10" width="720" height="280" preserveAspectRatio="xMidYMid meet"><title>{caption}</title></image><text class="se-caption" x="526" y="318" text-anchor="middle"><tspan x="526">{caption}</tspan></text></g>'
            after=before[:match.start()]+new+before[match.end():]
            backup=ROOT/'tmp/science-page-art-before'/directory.name/file.name
            if not backup.exists():backup.parent.mkdir(parents=True,exist_ok=True);write(backup,before)
            write(file,after)
            row=next(r for r in page_map if r['page']==int(number))
            if enlarged:row['end']=max(row['end'],top+340);row['fill']=round((row['end']-112)/1303*100)
            row['pageIllustration']={'file':asset,'caption':item['caption']}
            for block in row.get('blocks',[]):
                if block['id']=='page-illustration':block.update(artKey=asset,text=item['caption'],bottom=top+360)
            anchors=re.findall(r'data-block="([^"]+)"',before)
            approved.append({**item,'page':int(number),'sha256':h,'anchors':anchors,'titleRole':row.get('titleRole'),'title':row.get('title','')})
            report.append({'chapter':int(chapter),'page':int(number),'before':re.search(r'data-page-illustration="([^"]+)"',backup.read_text(encoding='utf8'))[1],**item})
        # Preserve already-distinct supplemental art in the regeneration plan too.
        for file in sorted(directory.glob('p*.html')):
            number=int(file.stem[1:])
            if str(number) in entries:continue
            source=file.read_text(encoding='utf8');match=re.search(r'<g data-page-illustration="([^"]+)".*?</g>',source,re.S)
            if not match:continue
            asset=match[1];caption=html.unescape(re.search(r'<title>(.*?)</title>',match[0],re.S)[1]);h=digest(asset)
            if h in primary or h in used:raise ValueError(f'Unreviewed repetition: {chapter}/{number}')
            used.add(h);row=next(r for r in page_map if r['page']==number)
            approved.append({'file':asset,'caption':caption,'page':number,'sha256':h,'anchors':re.findall(r'data-block="([^"]+)"',source),'titleRole':row.get('titleRole'),'title':row.get('title','')})
        plans[f'7-{chapter}']=approved
        write(mapfile,json.dumps(page_map,ensure_ascii=False,indent=2)+'\n')
    write(HISTORY/'page-art.json',json.dumps(plans,ensure_ascii=False,indent=2)+'\n')
    write(HISTORY/'changes.json',json.dumps(report,ensure_ascii=False,indent=2)+'\n')
    print(f'Reviewed {len(report)} supplementary figures at full size; preserved all surrounding content.')
if __name__=='__main__':main()
