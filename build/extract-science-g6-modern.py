"""Convert the preserved, edited pages to a reusable semantic content model.
No OCR or historic manuscript regeneration: the final existing copy is the source.
"""
import json,re,html,copy
from pathlib import Path
from lxml import etree as E
H=Path('assets/design-history/science-g6-modern')
chapters=json.loads((H/'source-pages.json').read_text(encoding='utf8'))
def tag(e): return E.QName(e).localname if isinstance(e.tag,str) else ''
def cls(e): return e.get('class','')
def clean(s): return re.sub(r'\s+',' ',s).strip()
def plain(e): return clean(''.join(e.itertext()))
def rich(e):
    s=html.escape(e.text or '')
    for c in e:
        t=rich(c)
        if tag(c) in ['strong','b'] or 'se-bold' in cls(c).split() or 'term' in cls(c).split(): t='<strong>'+t+'</strong>'
        elif tag(c) in ['em','i'] or 'se-italic' in cls(c).split(): t='<em>'+t+'</em>'
        elif tag(c)=='br':t='<br/>'
        elif tag(c)=='svg' or tag(c)=='title':t=''
        s+=t+(' ' if tag(c)=='tspan' and c.get('x') is not None or tag(c)=='span' and 'term' not in cls(c) else '')+html.escape(c.tail or '')
    return re.sub(r'\s+',' ',s)
def num(e,a,default=0):
    try:return float(e.get(a,default))
    except:return default
def texts(e):return [e] if tag(e)=='text' else list(e.iter('text'))
def serial(e):return E.tostring(e,encoding='unicode',method='xml')
def top(e):
    if tag(e)=='g':return min([top(c) for c in e] or [0])
    return num(e,'y',num(e,'y1',num(e,'cy',0)))
def bottom(e):
    if tag(e)=='g':return max([bottom(c) for c in e] or [0])
    if tag(e)=='text':return num(e,'y')+sum(num(c,'dy') for c in e.iter('tspan'))+8
    return top(e)+num(e,'height')
def composite(group):
    boxes=[]
    for e in group:
        if tag(e)=='text' and not plain(e):continue
        b=json.loads(e.get('data-original-bounds','null'))
        if b and tag(e)!='svg':boxes.append(b)
        else:boxes.append({'x':num(e,'x',89),'y':top(e),'w':num(e,'width',874),'h':bottom(e)-top(e)})
    x0=min(b['x'] for b in boxes);y0=min(b['y'] for b in boxes)
    w=max(b['x']+b['w'] for b in boxes)-x0;h=max(b['y']+b['h'] for b in boxes)-y0
    return {'kind':'vector','svg':f'<svg class="g6-source-art" xmlns="http://www.w3.org/2000/svg" viewBox="{x0-8} {y0-8} {max(w,1)+16} {max(h,1)+16}">'+''.join(serial(n) for n in group)+'</svg>','w':max(w,1)+16,'h':max(h,1)+16}
def source_text(e):
    return [clean(html.unescape(re.sub('<[^>]+>',' ',rich(t)))) for t in texts(e) if plain(t)]
def art(e):
    if tag(e)=='image':
        return {'kind':'image','src':e.get('href'),'alt':e.findtext('title') or 'Science illustration','w':num(e,'width',874),'h':num(e,'height',240)}
    if tag(e)=='svg':
        out=copy.deepcopy(e);out.attrib.pop('x',None);out.attrib.pop('y',None)
        return {'kind':'vector','svg':serial(out),'w':num(e,'width',874),'h':num(e,'height',240)}
    return None
def table(nodes):
    head=next(e for e in nodes if 'se-table-head' in cls(e) or 'fb-table-head' in cls(e))
    x0,y0,w=num(head,'x'),num(head,'y'),num(head,'width')
    ends=sorted(set(num(e,'y1') for e in nodes if tag(e)=='line' and num(e,'y1')==num(e,'y2') and num(e,'y1')>y0))
    cells=[t for e in nodes for t in texts(e) if num(t,'y')>=y0 and ('se-table-copy' in cls(t) or 'se-caption' in cls(t))]
    xs=sorted(set(round(num(e,'x'),1) for e in cells if num(e,'y')<y0+num(head,'height')+1))
    if not xs:raise ValueError('No table columns')
    boundaries=[y0]+ends
    if len(boundaries)<2: boundaries.append(max(bottom(e) for e in nodes))
    rows=[]
    for lo,hi in zip(boundaries,boundaries[1:]):
        row=[]
        for i,x in enumerate(xs):
            nxt=xs[i+1]-5 if i+1<len(xs) else x0+w+1
            ts=[t for t in cells if lo<num(t,'y')<=hi and x-5<=num(t,'x')<nxt]
            ims=[im for e in nodes for im in ([e] if tag(e)=='image' else list(e.iter('image'))) if lo<=num(im,'y')<hi and x-5<=num(im,'x')<nxt]
            row.append({'html':' '.join(rich(t) for t in ts),'images':[art(im) for im in ims]})
        if any(c['html'] or c['images'] for c in row):rows.append(row)
    caption=' · '.join(rich(t) for e in nodes for t in texts(e) if num(t,'y')<y0)
    return {'type':'table','caption':caption,'rows':rows}
def svg_sequence(nodes):
    # Most magnet pages already expose their teaching units as groups.
    expanded=[]
    for e in nodes:
        if tag(e)=='g' and not e.get('aria-label','').startswith('Chapter') and not e.get('data-feature'):
            expanded.extend(list(e))
        else:expanded.append(e)
    nodes=expanded;used=set();blocks=[]
    for i,e in enumerate(nodes):
        if i in used:continue
        c=cls(e);t=tag(e)
        if t in ['defs','title'] or e.get('aria-label','').startswith('Chapter') or any(k in c for k in ['se-title','science-chapter-','food-gold-tag','food-navy','se-footer','se-running','se-botanical']):used.add(i);continue
        if t=='text' and plain(e)=='SCIENCE AROUND US':used.add(i);continue
        if c=='se-reference-card':
            inside=[n for j,n in enumerate(nodes) if j>i and top(e)<=top(n)<bottom(e) and 'se-reference-card' not in cls(n)]
            for n in inside:used.add(nodes.index(n))
            used.add(i)
            title=next(n for n in inside if 'se-heading' in cls(n))
            blocks.append({'type':'reference','title':rich(title),'items':[rich(n) for n in inside if tag(n)=='text' and n is not title],'art':[art(n) for n in inside if tag(n) in ['image','svg']]});continue
        if c=='se-process' or t=='ellipse' and c=='se-accent':
            group=[]
            for j in range(i,len(nodes)):
                n=nodes[j];nc=cls(n)
                if j in used:continue
                if tag(n)=='text' and ('se-copy' in nc and 'se-table-copy' not in nc or 'se-heading' in nc and len(plain(n))>2):break
                group.append(n);used.add(j)
            blocks.append({'type':'figure','art':[composite(group)],'caption':''});continue
        if 'se-activity-panel' in c or 'se-prompt' in c or 'se-glossary-panel' in c:
            lo,hi=top(e),bottom(e);inside=[]
            for j,n in enumerate(nodes):
                if j==i or j in used:continue
                ny=top(n)
                if lo-16<=ny<hi and (j>i or 'se-activity-tab' in cls(n)):
                    inside.append(n);used.add(j)
            used.add(i)
            kind='setup' if 'activity' in c else 'glossary' if 'glossary' in c else 'think'
            content=svg_sequence(inside)
            blocks.append({'type':'panel','kind':kind,'blocks':content});continue
        if 'se-table-head' in c or 'fb-table-head' in c:
            # Tables may have their frame at the end of a page, after prose.
            lo=top(e);frame=next((n for n in nodes if 'se-table-frame' in cls(n) and abs(top(n)-lo)<2),None)
            hi=bottom(frame) if frame is not None else None
            selected=[]
            for j,n in enumerate(nodes):
                if j in used:continue
                nc=cls(n);ny=top(n)
                istable='se-table-' in nc or nc in ['se-rule','fb-rule','fb-table-head']
                if (istable and (hi is None and j>=i or hi is not None and lo<=ny<=hi)) or (tag(n)=='image' and lo<=ny<(hi if hi is not None else 0)):
                    if hi is None and j>i and tag(n)=='text' and 'se-table-copy' not in nc:continue
                    selected.append(n);used.add(j)
            # In tables without an outer frame, stop at the next ordinary paragraph.
            if hi is None:
                stop=next((top(n) for n in nodes[i+1:] if tag(n)=='text' and 'se-table-copy' not in cls(n) and 'se-copy' in cls(n)),9999)
                for n in selected[:]:
                    if top(n)>=stop:selected.remove(n);used.discard(nodes.index(n))
            cap=[]
            while blocks and blocks[-1]['type']=='table-caption':cap.insert(0,blocks.pop()['html'])
            b=table(selected);b['caption']=' · '.join(cap) or b['caption'];blocks.append(b);continue
        if 'se-table-band' in c or 'se-table-number' in c and t!='text':used.add(i);continue
        if t=='text' and ('se-table-number-text' in c or ('se-table-copy' in c or 'se-caption' in c) and i+1<len(nodes) and ('se-table-head' in cls(nodes[i+1]) or 'fb-table-head' in cls(nodes[i+1]))):
            blocks.append({'type':'table-caption','html':rich(e)});used.add(i);continue
        if t=='g' and e.get('data-feature'):
            label=next(iter(e.iter('text')),None)
            if label is not None and plain(label) not in ['Investigate','What Did You Notice?','Imagine This','Think It Through']:
                blocks.append({'type':'feature','html':rich(label)})
            used.add(i);continue
        if t=='svg' and 'se-feature-icon' in c or 'se-activity-tab' in c or 'se-think-rule' in c:used.add(i);continue
        if t=='text':
            if 'se-activity-step' in c:
                for n in nodes[i+1:]:
                    if tag(n)=='text' and 'se-copy' in cls(n):
                        n.set('data-step',plain(e).rstrip('.'));break
                used.add(i);continue
            typ='heading' if any(k in c for k in ['se-heading','se-section-opener','se-label']) else 'paragraph'
            if 'se-caption' in c:typ='caption'
            if 'se-table-copy' in c:typ='table-caption'
            if typ=='heading' and len(plain(e))>95:typ='paragraph'
            b={'type':typ,'html':rich(e)}
            if typ in ['caption','table-caption']:b['labelSvg']=serial(e)
            if e.get('data-step'):b['step']=e.get('data-step')
            if typ=='heading':b['level']=2 if re.match(r'^\d+\.\d+\s',plain(e)) else 3
            blocks.append(b);used.add(i);continue
        a=art(e)
        if a:
            group=[e];caption=[];used.add(i)
            while blocks and blocks[-1]['type'] in ['caption','table-caption']:
                prev=blocks.pop()
                if prev.get('labelSvg') and not prev['html'].startswith('Fig.'):
                    group.insert(0,E.fromstring(prev['labelSvg'].encode()))
                else:caption.insert(0,prev['html'])
            for j in range(i+1,len(nodes)):
                n=nodes[j];nc=cls(n)
                if j in used:continue
                if tag(n) in ['image','svg'] and 'se-feature-icon' not in nc:group.append(n);used.add(j)
                elif nc=='se-accent':group.append(n);used.add(j)
                elif tag(n)=='text' and any(k in nc for k in ['se-caption','se-table-copy','se-label']):
                    if plain(n).startswith('Fig.'):caption.append(rich(n))
                    else:group.append(n)
                    used.add(j)
                else:break
            pictures=[n for n in group if tag(n) in ['image','svg']]
            if len(pictures)==2 and max(top(n) for n in pictures)-min(top(n) for n in pictures)>150 and max(num(n,'width',874) for n in pictures)<440:
                parts=[]
                for n in group:
                    if tag(n) in ['image','svg']:parts.append([n])
                    elif parts:parts[-1].append(n)
                arts=[composite(g) for g in parts]
            elif len(group)==1:arts=[a]
            else:
                arts=[composite(group)]
            blocks.append({'type':'figure','art':arts,'caption':' '.join(caption)});continue
        if t in ['line','rect','path','circle','ellipse','polygon','polyline']:
            # Non-art top-level shapes are table rules or retired decoration.
            used.add(i);continue
        if t=='g':
            blocks+=svg_sequence(list(e));used.add(i);continue
        if t:raise ValueError('Unhandled SVG node '+t)
    # Captions/letter labels remain with their image, never independent page blocks.
    result=[]
    for b in blocks:
        if b['type']=='caption' and result and result[-1]['type']=='figure':result[-1]['caption']+=' '+b['html']
        elif b['type']=='figure' and result and result[-1]['type']=='figure' and not result[-1]['caption'] and result[-1]['art'][0]['w']<700 and b['art'][0]['w']<700:result[-1]['art']+=b['art']
        else:result.append(b)
    return result
def native(nodes):
    out=[]
    for e in nodes:
        t,c=tag(e),cls(e)
        if t in ['h1']:continue
        if t in ['h2','h3','h4']:
            text=rich(e)
            # Badge/name spans have no whitespace in the old HTML.
            if e.find('span') is not None:text=re.sub(r'^(\d+\.\d+(?:\.\d+)?)',r'\1 ',text)
            out.append({'type':'heading','level':2 if t=='h2' else 3,'html':text});continue
        if t=='p':out.append({'type':'paragraph','html':rich(e)});continue
        if t in ['ul','ol']:
            start=int(e.get('start','1'))
            for k,li in enumerate(e.findall('li')):out.append({'type':'paragraph','html':(str(start+k)+'. ' if t=='ol' else '• ')+rich(li)})
            continue
        if t=='figure':
            arts=[]
            for a in e:
                if tag(a)=='img':arts.append({'kind':'image','src':a.get('src'),'alt':a.get('alt','Science illustration'),'w':874,'h':300})
                elif tag(a)=='svg':
                    vb=[float(v) for v in (a.get('viewbox') or a.get('viewBox') or '0 0 874 300').split()]
                    width=400 if 'lw-micrograph' in cls(a) else 874
                    arts.append({'kind':'vector','svg':serial(a),'w':width,'h':width*vb[3]/vb[2]})
            cap=e.find('figcaption');out.append({'type':'figure','art':arts,'caption':rich(cap) if cap is not None else ''});continue
        if t=='table':
            rows=[]
            for r in e.iter('tr'):rows.append([{'html':rich(c),'images':[]} for c in r if tag(c) in ['th','td']])
            out.append({'type':'table','caption':'','rows':rows});continue
        if t in ['div','section','aside']:
            children=native(list(e))
            if any(k in c for k in ['life-activity','life-example','life-reflect','c-reflect']) or 'life-note--question' in c:
                kind='setup' if 'life-activity' in c else 'think'
                if children and children[0]['type']=='heading':
                    title=children[0]['html']
                    if title.strip().lower()=='think it through':children.pop(0)
                    else:children[0]={'type':'paragraph','html':'<strong>'+re.sub(r'^Investigation \d+\s*·\s*','',title)+'</strong>'}
                out.append({'type':'panel','kind':kind,'blocks':children})
            else:out+=children
            continue
        if t in ['svg','img']:
            a=art(e) if t=='svg' else {'kind':'image','src':e.get('src'),'alt':e.get('alt',''),'w':874,'h':300}
            out.append({'type':'figure','art':[a],'caption':''});continue
        if t in ['style','script']:continue
        if plain(e):out.append({'type':'paragraph','html':rich(e)})
    return out
model=[]
for ch in chapters:
    number=ch['config']['number'];blocks=[]
    for pi,page in enumerate(ch['pages']):
        if number=='10':
            root=E.HTML(page['html']);main=root.xpath('//*[contains(concat(" ",@class," ")," page__main ")]')[0]
            if pi==0:
                first=main[0];main.remove(first)
                fig=first.find('.//figure')
                subtitle=first.xpath('.//*[contains(@class,"chapter-opening__subtitle")]')
                bs=native([fig])+[{'type':'paragraph','html':rich(s)} for s in subtitle]+native(list(main))
            else:bs=native(list(main))
        else:
            ns=json.loads((H/f'nodes-{number}.json').read_text(encoding='utf8'))[pi]
            es=[]
            for n in ns:
                el=E.fromstring(n['html'].encode());el.set('data-original-bounds',json.dumps(n['box']));es.append(el)
            bs=svg_sequence(es)
        for b in bs:
            b['source']=page['file'];b['bridge']=int(page['file'][1:4])>=101
            blocks.append(b)
    for i,b in enumerate(blocks):b['id']=f'g6-{number}-{i+1:03}'
    model.append({'dir':ch['dir'],'config':ch['config'],'blocks':blocks})
(H/'content.json').write_text(json.dumps(model,ensure_ascii=False,indent=2),encoding='utf8')
for ch in model:
    kinds={t:sum(b['type']==t for b in ch['blocks']) for t in set(b['type'] for b in ch['blocks'])}
    print(ch['dir'],len(ch['blocks']),kinds)
    (H/f"reading-{ch['config']['number']}.json").write_text(json.dumps(ch['blocks'],ensure_ascii=False,indent=2),encoding='utf8')
