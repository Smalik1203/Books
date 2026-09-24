"""One-time table rollout on fitted SVG pages, preserving text and artwork sizes.

Uses lxml. Run from the repository root. Existing page breaks are preferred;
only whole authored blocks may move, within the same lesson/assessment section.
The in-memory plan is validated before any page is written.
"""
from pathlib import Path
from lxml import etree as ET
from functools import lru_cache
from collections import Counter
import copy, json, re

ROOT = Path(__file__).resolve().parent.parent
HISTORY = ROOT / 'assets/design-history/science-g7-table-rollout'

def parse(s):
    return ET.fromstring(s.replace(' xmlns="http://www.w3.org/2000/svg"', '').replace(' data-close>', ' data-close="">').encode())

def serial(t):
    for svg in t.iter('svg'):
        if 'science-sheet' in svg.get('class', ''):
            svg.set('xmlns', 'http://www.w3.org/2000/svg')
    return ET.tostring(t, encoding='unicode').replace(' data-close=""', ' data-close')

def cls(e, name):
    return name in e.get('class', '').split()

def number(e, key):
    return float(e.get(key))

def inc(e, key, delta):
    e.set(key, f'{number(e,key)+delta:g}')

def shift_text(e, delta):
    inc(e, 'y', delta)

def signature(t):
    # Running furniture is position-dependent; teaching text and every image
    # placement size must survive verbatim, including repeated occurrences.
    text = [''.join(e.itertext()) for e in t.iter('text') if not cls(e, 'se-running')]
    images = [tuple(e.get(k, '') for k in ('href','width','height','preserveAspectRatio')) for e in t.iter('image')]
    return Counter(text), Counter(images)

def restyle(block):
    delta = 0
    for frame in list(block.iter('rect')):
        if not cls(frame, 'v2-table-frame'): continue
        group = frame.getparent()
        if group.get('data-table-spacing') == 'airy': continue
        # The electrical symbol key is an already spacious instructional diagram.
        # It receives the common palette/corners without disturbing its symbols.
        if not any(cls(e,'v2-table-caption') for e in group): continue
        top, height = number(frame,'y'), number(frame,'height')
        rows = [e for e in group if e.get('data-comparison-row') is not None]
        rules = [e for e in group if cls(e,'v2-table-rule') and e.get('y1') == e.get('y2')]
        row_extra, cumulative = [], 0
        start = top
        for i, rule in enumerate(rules):
            end = number(rule,'y1')
            if rows:
                texts = list(rows[i].iter('text'))
                count = max(len(e.findall('tspan')) for e in texts)
                padding = (end-start-count*28)/2
                extra = max(0, 10-padding)
                for e in texts: shift_text(e,12+cumulative+extra)
            else:
                extra = 0 # ordinary record tables already have 12-unit padding
                for e in group:
                    if e.tag == 'text' and (cls(e,'v2-table-heading') or cls(e,'se-table-copy')) and start < number(e,'y') <= end:
                        shift_text(e,12)
            row_extra.append(extra*2)
            cumulative += extra*2
            inc(rule,'y1',12+cumulative); inc(rule,'y2',12+cumulative)
            start = end
        for e in group:
            if cls(e,'v2-table-caption'): shift_text(e,12)
            elif cls(e,'se-table-head'):
                inc(e,'y',12); inc(e,'height',row_extra[0])
            elif cls(e,'v2-table-note'): shift_text(e,12+cumulative+8)
            elif cls(e,'v2-table-rule') and e not in rules:
                inc(e,'y1',12); inc(e,'y2',12+cumulative)
        inc(frame,'y',12); inc(frame,'height',cumulative)
        notes = [e for e in group if cls(e,'v2-table-note') and ''.join(e.itertext()).strip()]
        change = 12+cumulative+(8 if notes else 0)+(12 if rows else (8 if notes else -4))
        delta += change
        group.set('data-table-spacing','airy')
    return delta

def has_image(e):
    return any(x.tag=='image' or x.get('data-instructional-figure') for x in e.iter())

def fitted(segment):
    atoms = [b for p in segment for b in p['atoms']]
    n, total = len(atoms), len(segment)
    @lru_cache(None)
    def solve(start, page):
        if page==total: return (0,[]) if start==n else None
        if start==n: return None
        best=None; y=112; image=False; gap_budget=0
        for end in range(start+1,n+1):
            b=atoms[end-1]
            y+=(12 if b['type']=='heading' and end-1>start else 0)+b['h']
            gap_budget+=b.get('gap_budget',0)
            excess=max(0,y+segment[page]['reserve']-1415)
            tail_budget=24 if segment[page]['reserve'] else b.get('tail_budget',0)
            if excess>gap_budget+tail_budget: continue
            image |= has_image(b['el'])
            if not (image or segment[page]['reserve']) or b['type']=='heading' or b.get('keepNext'): continue
            if any(a['type']=='heading' and sum(z['h']+(12 if z['type']=='heading' else 0) for z in atoms[i+1:end])+segment[page]['reserve']<160 for i,a in enumerate(atoms[start:end],start)): continue
            tail=solve(end,page+1)
            if tail is None: continue
            movement=sum(abs(a['origin']-segment[page]['page'])*10000 for a in atoms[start:end])
            cost=movement+tail[0]+excess*100+abs(end-sum(len(p['atoms']) for p in segment[:page+1]))
            if best is None or cost<best[0]: best=(cost,[(start,end)]+tail[1])
        return best
    answer=solve(0,0)
    if answer is None: raise ValueError('Cannot fit section without extra pages: '+str([p['page'] for p in segment]))
    for p,(start,end) in zip(segment,answer[1]):
        y=112; audits=[]; chosen=atoms[start:end]+p['anchors']
        excess=max(0,112+sum(b['h']+(12 if i and b['type']=='heading' else 0) for i,b in enumerate(chosen))-1415)
        reductions={}
        for b in reversed(chosen):
            available=24 if b in p['anchors'] else b.get('gap_budget',0)+(b.get('tail_budget',0) if b is chosen[-1] else 0)
            take=min(excess,available);reductions[id(b)]=take;excess-=take
        assert excess==0
        for i,b in enumerate(chosen):
            before=12 if b['type']=='heading' and i else 0
            y+=before
            b['el'].set('transform',f'translate(0 {y:g})')
            if b.get('audit'):
                audit=copy.deepcopy(b['audit']); audit.update(top=y,bottom=y+b['h']-reductions[id(b)],before=before)
                audits.append(audit)
            y+=b['h']-reductions[id(b)]
        svg=p['svg']
        for e in list(svg):
            if not cls(e,'v2-header') and not cls(e,'v2-footer'): svg.remove(e)
        at=1 if cls(svg[0],'v2-header') else 0
        for b in chosen: svg.insert(at,b['el']); at+=1
        p['map']['blocks']=audits; p['map']['end']=y; p['map']['fill']=round((y-112)/1303*100)
        p['map']['sourcePages']=sorted(set(s for b in chosen for s in b['source']))
        nxt=atoms[end] if end<n else None
        p['map']['protectedNext']=({ 'id':nxt['id'],'type':nxt['type'],'height':nxt['h'],'keepNext':bool(nxt.get('keepNext')) } if nxt else None)
        if nxt: p['map']['breakReason']='Next '+nxt['type']+': '+nxt['id']
        p['map']['title']=chosen[0].get('audit',{}).get('text','') if chosen[0]['type']=='heading' else ''
        illustrations=[e.get('data-page-illustration') for e in svg.iter() if e.get('data-page-illustration')]
        if not illustrations: p['map'].pop('pageIllustration',None)
        elif illustrations[0]!=(p['map'].get('pageIllustration') or {}).get('file'):
            # Preserve the caption metadata belonging to the moved illustration.
            art=next(e for e in svg.iter() if e.get('data-page-illustration'))
            p['map']['pageIllustration']={'file':illustrations[0],'caption':' '.join(''.join(e.itertext()) for e in art.iter('text'))}

def run():
    if (HISTORY/'report.json').exists():
        print('The one-time table rollout is already recorded; no pages changed.')
        return
    pending=[]; reports=[]
    for directory in sorted((ROOT/'pages/class-7').glob('ch*')):
        config=json.loads((directory/'chapter.json').read_text(encoding='utf8'))
        chapter=int(config['number'])
        if config.get('subject')!='Science' or not 2<=chapter<=12: continue
        hist=ROOT/f'assets/design-history/science-g7-ch{chapter:02}'
        maps=json.loads((hist/'page-map.json').read_text(encoding='utf8'))
        pages=[]; before_text=Counter(); before_images=Counter(); tables=0
        all_audits={b['id']:b for p in maps for b in p.get('blocks',[]) if b['id']!='page-illustration'}
        phase='lesson'
        for index,file in enumerate(sorted(directory.glob('p*.html'))):
            mapping=copy.deepcopy(maps[index]) if index<len(maps) else {'page':index+1,'sourcePages':[],'end':1415,'titleRole':'projects'}
            original=file.read_text(encoding='utf8'); tree=parse(original)
            svg=tree.find('.//svg'); sig=signature(tree); before_text.update(sig[0]);before_images.update(sig[1])
            p=dict(file=file,original=original,tree=tree,svg=svg,map=copy.deepcopy(mapping),page=mapping['page'],atoms=[],anchors=[],reserve=0)
            audit={b['id']:b for b in mapping.get('blocks',[])}
            actual=[e for e in svg if e.get('data-block') or e.xpath('.//*[@data-page-illustration]')]
            ids=[e.get('data-block') for e in actual]
            if 'assessment-heading' in ids:phase='assessment'
            if 'project-heading' in ids:phase='projects'
            if any(ids):
                p['map']['titleRole']=phase
                last=112
                for pos,e in enumerate(actual):
                    if cls(e,'v2-header') or cls(e,'v2-footer'): continue
                    key=e.get('data-block')
                    if key:
                        if key not in all_audits:
                            # Old trailing pages outside the current authoring map
                            # are not part of this spacing migration.
                            p['atoms']=[];p['anchors']=[];p['reserve']=0;break
                        a=all_audits[key]; h=a['bottom']-a['top']
                        if pos+1<len(actual):
                            next_e=actual[pos+1]
                            here=float(re.search(r'translate\(0 ([\d.]+)\)',e.get('transform'))[1])
                            nxt=float(re.search(r'translate\(0 ([\d.]+)\)',next_e.get('transform'))[1])
                            next_type=all_audits.get(next_e.get('data-block'),{}).get('type')
                            h=nxt-here-(12 if next_type=='heading' else 0)
                        added=restyle(e)
                        tables+=len(e.xpath('descendant-or-self::*[@data-table-spacing="airy"]'))
                        atom=dict(id=key,type=a['type'],h=h+added,el=e,audit=a,origin=mapping['page'],source=mapping['sourcePages'],keepNext=a.get('keepNext'),gap_budget=8 if a['type']=='body' and h%32==16 else 0)
                        if a['type'] in ('activity','panel'): atom['gap_budget']=8
                        if a['type']=='figure' and not added: atom['gap_budget']=12
                        # A final table needs no inter-block gap after it; retain
                        # eight units beyond its note/grid before the body limit.
                        atom['tail_budget']=20 if added else 8 if a['type']=='body' and h%32==16 else 0
                        last=float(re.search(r'translate\(0 ([\d.]+)\)',e.get('transform'))[1])+h
                    else:
                        assert e.get('transform') and e.xpath('.//*[@data-page-illustration]'), ('Unknown page block',file,ET.tostring(e)[:80])
                        atom=dict(id='page-art-'+str(mapping['page']),type='illustration',h=360,el=e,origin=mapping['page'],source=mapping['sourcePages'],illustration=mapping.get('pageIllustration'))
                    if e.xpath('descendant-or-self::*[@data-page-illustration]'):
                        atom['illustration']=mapping.get('pageIllustration')
                        if chapter==8 and mapping['page']==15:
                            # The instrument figure moves here beside the table.
                            # The stock cyclist is already shown on the next page.
                            removed=signature(e);before_text.subtract(removed[0]);before_images.subtract(removed[1])
                        else:
                            p['anchors'].append(atom);p['reserve']+=atom['h']
                    else: p['atoms'].append(atom)
            pages.append(p)
        segment=[]; category=None
        for p in pages+[None]:
            cat=('assessment' if p['map']['titleRole']=='assessment' else 'projects' if p['map']['titleRole']=='projects' else 'lesson') if p and p['atoms'] else None
            if segment and (not p or cat!=category): fitted(segment);segment=[]
            if cat: segment.append(p)
            category=cat
        after_text=Counter();after_images=Counter();changed=[]
        for p in pages:
            sig=signature(p['tree']);after_text.update(sig[0]);after_images.update(sig[1])
            updated=serial(p['tree'])
            # Do not reserialize untouched pages merely for XML attribute ordering.
            if parse(p['original']) is not None and ET.tostring(parse(p['original'])) != ET.tostring(parse(updated)):
                pending.append((p['file'],updated));changed.append(p['page'])
        assert before_text==after_text, ('Teaching text changed',directory)
        assert before_images==after_images, ('Image asset/size changed',directory)
        pending.append((hist/'page-map.json',json.dumps([p['map'] for p in pages],ensure_ascii=False,indent=2)))
        reports.append(dict(chapter=chapter,pages=len(pages),tables=tables,changedPages=changed,textPreserved=True,imageAssetsAndSizesPreserved=True))
        print(json.dumps(reports[-1]))
    HISTORY.mkdir(parents=True,exist_ok=True)
    backup=ROOT/'tmp/science-table-rollout-before'
    for file,content in pending:
        dest=backup/file.relative_to(ROOT);dest.parent.mkdir(parents=True,exist_ok=True)
        if not dest.exists(): dest.write_bytes(file.read_bytes())
        file.write_text(content,encoding='utf8')
    (HISTORY/'report.json').write_text(json.dumps(reports,indent=2),encoding='utf8')

if __name__=='__main__': run()
