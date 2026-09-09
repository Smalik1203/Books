"""Create the editable first reconstruction from measured OCR and art crops.

Run this importer deliberately: it replaces the reconstruction's page fragments.
Normal rebuilds use build.mjs and preserve manual edits to those fragments.
"""
import html
import json
import statistics
from collections import Counter
from pathlib import Path
from PIL import Image
import runpy
LAYOUT = runpy.run_path(str(Path(__file__).with_name('food-layout.py')))['LAYOUT']

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'assets/food-reference'
PAGES = ROOT / 'pages/reference/ch03-food-on-our-plate'
ART = ROOT / 'figures/reference/food'
PAGES.mkdir(parents=True, exist_ok=True)
ART.mkdir(parents=True, exist_ok=True)
METRICS = json.loads((SRC / 'font-metrics.json').read_text(encoding='utf-8'))
FOLIOS = [28,34,35,36,38,39,40,41,42,43,44,45,46,None,47,48,49,50,51,52,53,54,55,56,57,58,59,60]

def esc(value):
    return html.escape(str(value), quote=True)

def rect(kind,x,y,w,h,r=18):
    return f'<rect class="food-{kind}" x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}"/>'

def line(x1,y1,x2,y2,kind='rule'):
    return f'<line class="food-{kind}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}"/>'

def circle(x,y,r,kind='tag'):
    return f'<circle class="food-{kind}" cx="{x}" cy="{y}" r="{r}"/>'

def text(value,x,y,size,color='teal',bold=True,width=None):
    length = f' textLength="{width*100/size:.3f}" lengthAdjust="spacingAndGlyphs"' if width else ''
    return f'<text class="food-text food-{color}{" food-bold" if bold else ""}" transform="translate({x:.3f} {y:.3f}) scale({size/100:.5f})"{length}>{esc(value)}</text>'

def icon(x,y,r=24):
    # Shared line-drawn bulb used by the reference's concept rail.
    return circle(x,y,r,'icon') + f'<g class="food-icon-stroke" transform="translate({x-12} {y-17})"><path d="M7 25C7 19 1 18 1 11a11 11 0 0 1 22 0c0 7-6 8-6 14M7 25h10M8 29h8M10 32h4M12 24V13m-4-2 4 4 4-4M12-5v-4M-5 0l-3-3M29 0l3-3M-5 13h-4M29 13h4"/></g>'

def word_color(im,word):
    x,y,w,h = [int(word[k]) for k in ('x','y','width','height')]
    pixels = list(im.crop((x,y,x+w,y+h)).convert('RGB').getdata())
    if not pixels: return 'ink'
    ring=[im.getpixel((a,b)) for a in range(max(0,x),min(im.width,x+w)) for b in [max(0,y-3),min(im.height-1,y+h+2)]]
    dark_ground=sum((max(p)-min(p)>40 and min(p)<130) for p in ring)/max(1,len(ring))
    if dark_ground>.65: return 'white'
    dark = [p for p in pixels if sum(p)<440]
    if not dark: return 'ink'
    r,g,b = [statistics.median(p[i] for p in dark) for i in range(3)]
    if r>g+40 and r>b+35: return 'red'
    if b>g+25 and r>g+15: return 'purple'
    if g>r+25 and b>r+20: return 'teal'
    if g>r+15 and g>b+15: return 'green'
    if b>r+25 and b>g+15: return 'navy'
    return 'ink'

def inside(word,box):
    _,x,y,w,h=box
    return x<=word['x']+word['width']/2<=x+w and y<=word['y']+word['height']/2<=y+h

def set_line(words):
    """Set each line on one baseline with natural, undistorted letterforms.

    OCR boxes measure ink, not font size. Fitting every word independently
    stretches short words and gives neighbouring words different baselines.
    Retain measured columns, but give each run a shared size and word space.
    """
    groups=[]
    for word in sorted(words,key=lambda z:z['x']):
        if not groups or word['x']-(groups[-1][-1]['x']+groups[-1][-1]['width'])>48:
            groups.append([])
        groups[-1].append(word)
    result=[]
    for group in groups:
        measured=[]
        for word in group:
            table_label=any(ys[0]<=word['y']<ys[1] or (xs[0]<=word['x']<xs[1] and ys[0]<=word['y']<ys[-1]) for xs,ys in cfg.get('tables',[]))
            bold=word['color']!='ink' or word['height']>30 or table_label
            m=METRICS[('700|' if bold else '400|')+word['text']]
            s=word['height']/max(1,m['ascent']+m['descent'])
            measured.append((word,bold,m,s,word['y']+m['ascent']*s))
        usable=[v for v in measured if len(v[0]['text'])>2]
        size=statistics.median(v[3] for v in usable or measured)
        # Round the source estimates onto a small consistent scale.
        scale=min([.16,.18,.20,.22,.24,.26,.30,.34,.38,.44,.52,.64,.76],key=lambda s:abs(s-size))
        extent=group[-1]['x']+group[-1]['width']-group[0]['x']
        advance=sum(v[2]['width'] for v in measured)+28*(len(group)-1)
        scale=min(scale,extent/max(1,advance))
        baseline=statistics.median(v[4] for v in usable or measured)
        x=group[0]['x']
        for word,bold,m,_,_ in measured:
            value=word['text'].replace('dassroom','classroom').replace('WHY-IT-MAI-rERS','WHY-IT-MATTERS')
            if page==22 and value=='Iow': value='low'
            if page in [14,15] and value in ['Bl','BI']: value='B₁'
            if page==28 and word['x']<100 and word['width']<15: value='•'
            result.append(text(value,x,baseline,scale*100,word['color'],bold))
            x+=(m['width']+28)*scale
    return result

report=[]
for page in range(1,29):
    name=f'p{page:03}'
    im=Image.open(SRC/'originals'/f'{name}.png').convert('RGB')
    data=json.loads((SRC/'ocr'/f'{name}.json').read_text(encoding='utf-8-sig'))
    cfg=LAYOUT[page]
    w,h=im.size
    bg=[]; art=[]; tags=[]; content=[]
    for panel in cfg.get('panels',[]): bg.append(rect(*panel))
    for xs,ys in cfg.get('tables',[]):
        bg.append(rect('table-head',xs[0],ys[0],xs[-1]-xs[0],ys[1]-ys[0],0))
        if cfg.get('rainbow'):
            bg[-1]=rect('tag',xs[0],ys[0],xs[-1]-xs[0],ys[1]-ys[0],12)
            for i,(a,b) in enumerate(zip(ys[1:],ys[2:])):
                bg.append(rect('row-'+chr(97+i),xs[0],a,xs[-1]-xs[0],b-a,0))
        else:
            bg.append(rect('table-side',xs[0],ys[1],xs[1]-xs[0],ys[-1]-ys[1],0))
        rule='table-white-rule' if cfg.get('rainbow') else 'table-rule'
        bg.extend(line(x,ys[0],x,ys[-1],rule) for x in xs)
        bg.extend(line(xs[0],y,xs[-1],y,rule) for y in ys)
    if cfg.get('rail',True):
        bg.append(line(38,70,38,h-85,'rule food-dots'))
        bg.append(icon(38,48))
    for label,x,y,aw,ah in cfg.get('art',[]):
        filename=f'{name}-{label}.png'
        im.crop((x,y,x+aw,y+ah)).save(ART/filename)
        symbol=' class="food-symbol"' if label.endswith('-icon') or label.endswith('-symbol') else ''
        art.append(f'<image{symbol} href="../../figures/reference/food/{filename}" x="{x}" y="{y}" width="{aw}" height="{ah}"><title>{esc(label.replace("-"," "))}</title></image>')
    for x,y,value in cfg.get('numbers',[]):
        tags.extend([circle(x,y,17),text(value,x-8,y+9,26,'white')])
    count=0
    for index,ln in enumerate(data['lines']):
        if (page==18 and index in [29,30]) or (page==22 and index in [26,27]) or (page==21 and index in [20,21]): continue
        words=[]
        for word in ln['words']:
            if any(inside(word,b) for b in cfg.get('art',[])): continue
            if cfg.get('footer',True) and word['y']>h-66: continue # explicit folio below
            if word['text'] in ['O','1)']: continue
            if word['text']=='Q' and word['x']<150: continue
            if page==1 and index in [3,23,24]: continue
            if page==4 and index==0 and word['text']=='9': continue
            if page==8 and index==1 and word['text']=='ag': continue
            if len(word['text'])==1 and word['x']<80: continue # icon mistaken for a letter
            if page==16 and index in [15,17]: continue # distorted dialogue in the supplied image
            word=word.copy()
            word['color']=word_color(im,word)
            words.append(word)
        if not words: continue
        # White words are badges. Their shape is native SVG, not a text crop.
        whites=[z for z in words if z['color']=='white']
        if whites and not cfg.get('rainbow') and not(page==1 and index==0):
            x=min(z['x'] for z in whites); y=min(z['y'] for z in whites)
            right=max(z['x']+z['width'] for z in whites); bottom=max(z['y']+z['height'] for z in whites)
            kind='gold-tag' if 'THINK' in ln['text'] else 'red-tag' if 'PRECAUTIONS' in ln['text'] else 'green-tag' if page==22 else 'tag'
            tags.append(rect(kind,x-19,y-9,right-x+38,bottom-y+18,17))
        content.append(f'<!-- {esc(ln["text"])} -->')
        content.extend(set_line(words))
        count+=len(words)
    if cfg.get('footer',True):
        folio=FOLIOS[page-1]
        tags.extend([line(90,h-37,w-49,h-37,'gold-rule'),circle(w-49,h-37,4,'gold-tag'),circle(43,h-38,20),text(str(folio),29,h-30,23,'white')])
    # Distinct structural details in the opening sequence.
    if page==1:
        bg.extend(['<path class="food-navy" d="M33 0H188V144C188 246 33 246 33 144Z"/>','<path class="food-gold-rule" d="M216 41H906Q961 41 961 96V216"/>',line(81,676,81,1170,'rule food-dots')])
        tags.append(text('3',68,185,151,'white'))
        tags.extend(circle(81,y,6) for y in [720,908,1043])
        bg.append(line(367,1207,367,1325,'gold-rule'))
        for j,y in enumerate([1220,1255,1290]):
            tags.append(text(str(j+1)+'.',390,y,14,'ink',False))
            bg.append(line(405,y,689,y,'rule food-dots'))
    if page==2:
        tags.extend([rect('gold-tag',62,91,100,71,12),text('3.1',76,146,52,'white')])
        bg.append(line(32,180,1080,180,'gold-rule food-dots'))
        bg.append(line(308,806,881,806))
        bg.extend(line(97,y,931,y,'rule food-dots') for y in [948,1092,1208])
    if page==3:
        bg.extend(line(287,y,1030,y,'rule food-dots') for y in range(216,674,35))
        bg.append(line(238,841,238,1283,'rule food-dots'))
    if page==4:
        bg.extend(line(47,y,487,y,'rule food-dots') for y in [574,684,823])
    # Original OCR sometimes omits figure numbers and activity badges.
    if page==6: tags.append(text('Fig. 3.1',33,778,26,'teal',True))
    if page==18: tags.extend([rect('tag',90,391,164,43),text('ACTIVITY',110,423,23,'white'),text('1.',90,613,22),text('Fig. 3.7 — Testing food samples for starch',90,1020,24,'teal',True,463)])
    if page==22: tags.append(text('Fig. 3.9 — Sanwa (barnyard millet)',564,137,22,'teal',True,332))
    if page==21:
        tags.extend([text('Table 3.4 —',110,982,21),text('Nutritional information per 100 g',258,982,21,'ink',False),text('1.',88,529,21)])
    if page==13:
        tags.append(text('1.',95,684,22))
    if page==26:
        tags.append(text('1.',139,1304,19,'ink',False))
        for x,y,end in [(665,1022,921),(643,1055,921),(704,1089,921),(418,1126,921),(473,1162,793)]:
            bg.append(line(x,y,end,y))
    if page==5:
        for y in [644,701]:
            for x,end in [(56,139),(201,398),(475,689),(774,933)]: bg.append(line(x,y,end,y,'rule food-dots'))
    if page==16:
        tags.extend([text("Aarav: That's what",320,622,18,'teal',False,138),text('Aarav: Seawater. Or rock.',310,743,16,'teal',False,152)])
    if page==23:
        # Connections between the six separately extracted illustrations.
        for ax,ay,bx,by in [(303,625,377,574),(580,574,649,625),(757,804,757,872),(649,1047,579,1093),(393,1093,316,1047),(217,876,214,810)]:
            bg.append(line(ax,ay,bx,by,'flow-arrow'))
            import math
            angle=math.atan2(by-ay,bx-ax)
            for offset in [-.5,.5]:
                bg.append(line(bx,by,round(bx-13*math.cos(angle+offset),2),round(by-13*math.sin(angle+offset),2),'flow-arrow'))
    if page==28:
        bg.extend(line(88,y,936,y,'rule food-dots') for y in [989,1143,1294])
    svg=f'<svg class="food-sheet" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" aria-label="Food on Our Plate, reference page {page}">\n'+ '\n'.join(bg+art+tags+content)+'\n</svg>'
    fragment=f'<section class="page page--food" data-folio="{FOLIOS[page-1] or 47}" data-reference-page="{page}">\n<div class="page__body"><div class="page__main">\n{svg}\n</div></div>\n</section>\n'
    (PAGES/f'{name}.html').write_text(fragment,encoding='utf-8')
    report.append(dict(page=page,folio=FOLIOS[page-1],editableWords=count,illustrations=len(art)))
(PAGES/'chapter.json').write_text(json.dumps(dict(number='3',title='Food on Our Plate',subject='Science',**{'class':'Reference'},edition='a4',design='food-reference',startFolio=28),indent=2))
(SRC/'reconstruction-report.json').write_text(json.dumps(report,indent=2))
print(f'Created 28 editable page fragments, {sum(r["editableWords"] for r in report)} live words and {sum(r["illustrations"] for r in report)} illustration crops.')
