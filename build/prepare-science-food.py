"""Recover semantic reading groups from the archived Chapter 3 geometry."""
import json,re,runpy
from pathlib import Path
d=json.loads(Path('assets/manuscripts/ch03-extracted.json').read_text(encoding='utf-8'))
layout=runpy.run_path('build/food-layout.py')['LAYOUT']
out=[]; omitted=[]
decor={'CHAPTER','CONCEPT','NARRATIVE','ACTIVITY','TABLE','THINK-SPOT','WHY-IT-MATTERS'}
def clean(s):return s.replace('\ufffd','—').strip()
def text(b):return clean(b['text'])
def inside(b,x,y,w,h):return x-5<=b['x']<=x+w+5 and y-4<=b['y']<=y+h+8
for p in d['pages']:
 ref=p['ref'];bs=p['blocks'];used=set();events=[];ims=p['images'];usedim=set()
 def emit(kind,y,**kw):events.append(dict(kind=kind,y=y,source=ref,**kw))
 for i,b in enumerate(bs):
  t=text(b)
  if t in decor or (ref==1 and b['y']<210) or t=='From where?':used.add(i);omitted.append(dict(source=ref,text=t,reason='replaced furniture or notebook writing label'))
 # Tables are grouped by their actual ruled column and row boundaries.
 for xs,ys in layout[ref].get('tables',[]):
  rows=[]
  for r in range(len(ys)-1):
   cells=[]
   for c in range(len(xs)-1):
    ids=[i for i,b in enumerate(bs) if i not in used and inside(b,xs[c],ys[r],xs[c+1]-xs[c]-6,ys[r+1]-ys[r]-8)]
    ids.sort(key=lambda i:bs[i]['y']);used.update(ids)
    pictures=[(i,im) for i,im in enumerate(ims) if i not in usedim and xs[c]-8<=im['x']<xs[c+1] and ys[r]-8<=im['y']<ys[r+1]]
    usedim.update(i for i,im in pictures)
    cells.append(dict(text=' '.join(text(bs[i]) for i in ids),images=[im for i,im in pictures]))
   if any(c['text'] or c['images'] for c in cells):rows.append(cells)
  if rows:emit('table',ys[0],rows=rows)
 # Real activity panels stay whole. Other boxes become calm reading sections.
 for rect in p['rects']:
  if rect['w']<300 or rect['h']<90:continue
  ids=[i for i,b in enumerate(bs) if i not in used and inside(b,rect['x'],rect['y'],rect['w'],rect['h'])]
  if not ids:continue
  ids.sort(key=lambda i:(round(bs[i]['y']/14),bs[i]['x']))
  titleids=[i for i in ids if 'Activity 3.' in text(bs[i])]
  if titleids:
   start=titleids[0];title=text(bs[start]).replace('ACTIVITY ','');used.add(start)
   # A wrapped activity title is a separate bold block in the trace.
   for i in ids:
    if i!=start and abs(bs[i]['y']-bs[start]['y'])<45 and bs[i]['x']>bs[start]['x']-5 and 'subheading' in bs[i]['role']:
     title+=' '+text(bs[i]);used.add(i)
   items=[]
   for i in ids:
    if i in used:continue
    b=bs[i];t=text(b);used.add(i)
    if re.fullmatch(r'\d+[.]?',t):continue
    t=re.sub(r'^(\d+) (?=[A-Z])',r'\1. ',t)
    if items and not re.match(r'\d+\.',t) and b['y']-items[-1]['bottom']<42 and not t.startswith('You will need'):
     items[-1]['text']+=' '+t;items[-1]['bottom']=b['bottom']
    else:items.append(dict(text=t,bottom=b['bottom']))
   emit('activity',rect['y'],title=title,items=[v['text'] for v in items])
  elif 'food-prompt' in rect['cls']:
   ts=[text(bs[i]) for i in ids if not re.fullmatch(r'\d+[.]?',text(bs[i]))];used.update(ids)
   if ts:emit('prompt',rect['y'],text=' '.join(ts))
 # Drop decorative icon crops, retain every explanatory illustration.
 image_rows=[]
 for i,im in enumerate(ims):
  if i in usedim:continue
  name=(im.get('title') or '').replace(' ','-')
  if any(k in name for k in ['icon','symbol','leaf-left','leaf-right','warning','reasons','observe','safety']):continue
  if ref==1 and name in ['lunch-upper-right','thought-bubble','lunch upper right','thought bubble']:continue
  im=dict(im);im['href']=im['href'];image_rows.append(im)
 for im in image_rows:
  same=next((ev for ev in events if ev['kind']=='images' and abs(ev['y']-im['y'])<45),None)
  if same:same['images'].append(im)
  else:emit('images',im['y'],images=[im])
 # Restore paragraphs broken by the OCR's slight indents, keeping headings.
 for i,b in enumerate(bs):
  if i in used:continue
  t=text(b)
  if not t:continue
  kind='heading' if b['role'] in ['title','heading','subheading','panel-heading','panel-subheading'] and len(t)<105 and not re.fullmatch(r'\d+[.]?',t) else 'text'
  emit(kind,b['y'],text=t,bottom=b['bottom'])
 events.sort(key=lambda e:e['y'])
 merged=[]
 for e in events:
  if merged and e['kind']=='text' and merged[-1]['kind']=='text' and e['y']-merged[-1].get('bottom',0)<40 and not re.match(r'^\d+[.)]',e['text']):
   merged[-1]['text']+=' '+e['text'];merged[-1]['bottom']=e.get('bottom',e['y'])
  else:merged.append(e)
 out.extend(merged)
# Repair the trace's reading order and replace write-in grids with notebook guides.
# The lossless extraction remains alongside this edited typesetting source.
for g in out:
 if 'text' in g:
  g['text']=g['text'].replace('3.1. I','3.1.1').replace('grandfatber','grandfather').replace('flbre','fibre').replace('Wth ','With ').replace('salted rneat','salted meat').replace('bums fuel','burns fuel').replace('most Of','most of').replace('source Of','source of').replace('CONTENT VOCABULARY','').replace('PROCESS VOCABULARY','').replace('THINK-SPOT ','').replace('RECAP Recap','Recap').replace('(page 20) ','').replace('on the next page ','').replace('on page 11','in Case 1')
  if g['text'].startswith('•'):g['kind']='text'
# Rebuild the interleaved conversation as a single legible exchange.
a=next(i for i,g in enumerate(out) if g.get('text','').startswith('Ira: So every'))
b=next(i for i in range(a,len(out)) if out[i].get('text','').startswith('Ira is right'))
out[a:b]=[dict(kind='text',source=16,text=t) for t in [
 "Ira: So every nutrient we need comes from a plant or an animal?",
 "Aarav: That's what the chapter says.",
 "Ira: Then where does salt come from? Not a plant. Not an animal.",
 "Aarav: Seawater. Or rock.",
 "Ira: And Vitamin D — the teacher said our own skin makes it in sunlight. That isn't food either."]]
for g in out:
 if g.get('title','').startswith('Activity 3.3'):
  g['items']=["1. Choose someone at least fifty years older than you — a grandparent, a neighbour, a retired teacher.","2. Prepare your questions before you meet them. Write them down. Good starting points: What did you eat as a child that you still eat today? What did you eat then that you never eat now? How was the food cooked, and on what? How long did the cooking take? What changed, and when did it change?","3. Listen more than you talk. Write their answers in their words, not yours.","4. Bring your notes to class and pool them with your classmates'."]
 if g.get('title','').startswith('Activity 3.2'):
  g['items']=[re.sub(r'^\d+[.]?\s*','',v) for v in g['items']]
  g['items']=[f'{i+1}. {v}' for i,v in enumerate(g['items'])]
# One six-step figure replaces the source's radial arrangement and crossed labels.
a=next(i for i,g in enumerate(out) if g.get('text','').startswith('Fig. 3.10'))
b=next(i for i in range(a,len(out)) if out[i].get('text','').startswith('The total distance'))
ims={im['title']:im for g in out[a:b] for im in g.get('images',[])}
out[a:b]=[dict(kind='journey',source=23,title='Fig. 3.10 · The story of a chapati: from field to plate',images=[ims[k] for k in ['farmer','threshing','storage','milling','transport','meal']],labels=['1. Growing wheat','2. Threshing and winnowing','3. Storing grain','4. Milling and packing','5. Transport to the shop','6. Food on our plate'])]
# Restore prose that wrapped around the millet photograph.
a=next(i for i,g in enumerate(out) if g.get('text','').startswith('Jowar, bajra'))
b=next(i for i in range(a,len(out)) if out[i].get('text','').startswith('They are coming'))
im=next(g for g in out[a:b] if g['kind']=='images')
out[a:b]=[dict(kind='text',source=22,text='Jowar, bajra, ragi, sanwa, kodo, kutki — these are millets, and they are among the oldest cultivated grains in India. For centuries they were ordinary food across large parts of the country. Then, within a few decades, they largely disappeared from urban plates, pushed aside by polished rice and refined wheat.'),dict(**im,caption='Fig. 3.9 · Sanwa (barnyard millet) growing in a field')]
# Preserve the requested task without printing empty response grids.
for g in out:
 if g['kind']=='table' and all(not c['text'] and not c['images'] for row in g['rows'][1:] for c in row[1:]):
  source=g['source'];headers=[c['text'] for c in g['rows'][0]];names=[r[0]['text'] for r in g['rows'][1:]]
  if source==3:t='In your notebook, use two columns: Day and What I ate and drank. Record one entry for each day, Monday to Sunday.'
  elif source==20:t='Make your observation table in your notebook. For each food, record your prediction, the colour before and after the starch and protein tests, and the paper-patch result for fat. Finish with three conclusions: starch present, fat present, protein present. Test potato, cucumber, boiled rice, boiled gram, peanut, bread or chapati, butter, coconut and one other food.'
  elif len(headers)==2:t='Use two notebook columns: Nutrient and Type (energy-giving, body-building or protective).'
  else:t='In your notebook, compare the starch, fat and protein tests under these headings: What you add; Positive result; Nutrient detected.'
  g.clear();g.update(kind='prompt',source=source,text=t)
# Remove duplicated category labels, not instructional copy.
out=[g for g in out if g.get('text','') not in ['CASE','PRACTICE','BEYOND','KNOW A SCIENTIST','ON THE LEARNLAB SCREEN']]
# Keep the scientist's name ahead of the portrait and explanation.
for i,g in enumerate(out):
 if g['kind']=='images' and g.get('images',[{}])[0].get('title')=='gopalan' and out[i+1]['kind']=='heading':out[i],out[i+1]=out[i+1],out[i]
# Numbered activity steps are separate lines inside one panel.
fixed=[];i=0
while i<len(out):
 g=out[i]
 if g.get('text','').startswith('Activity 3.'):
  items=[];j=i+1
  while j<len(out) and out[j]['kind']=='text':
   items.extend(re.split(r'\s+(?=\d+\.\s+[A-Z])',out[j]['text']));j+=1
  if g['text'].startswith('Activity 3.7'):
   items=[('1. '+v if v.startswith('Take a small') else v) for v in items]
  if g['text'].startswith('Activity 3.8'):
   items=[('1. '+v if v.startswith('Grind each') else v) for v in items]
  fixed.append(dict(kind='activity',source=g['source'],title=g['text'],items=items));i=j
 else:fixed.append(g);i+=1
out=fixed
# Place chemical precautions immediately before the teacher demonstration.
a=next(i for i,g in enumerate(out) if g.get('text','').startswith('PRECAUTIONS'))
b=a+1
while b<len(out) and out[b]['kind']=='text':b+=1
prec=dict(kind='prompt',source=19,text='Teacher demonstration — precautions. '+' '.join(g['text'] for g in out[a+1:b]))
del out[a:b]
a=next(i for i,g in enumerate(out) if g.get('title','').startswith('Activity 3.8'))
out.insert(a,prec)
# Captions move with the figure or table they identify.
i=0
while i<len(out):
 g=out[i];t=g.get('text','')
 if t.startswith(('Fig.','Table ')) and i+1<len(out) and out[i+1]['kind'] in ['images','table','prompt']:
  out[i+1]['caption']=t;out.pop(i);continue
 if g['kind']=='images' and i+1<len(out):
  t=out[i+1].get('text','')
  if t.startswith(('(a)','(c)')):
   g['caption']=(g.get('caption','')+' · '+t).strip(' ·');out.pop(i+1)
 i+=1
# Repair small traced fragments at joins.
i=0
while i<len(out)-1:
 a,b=out[i:i+2]
 if 'text' in a and 'text' in b and (a['text'].endswith(('and his','Go back for','in the plate,','nutrients are','producer to consumer.')) or b['text'].startswith(('What does this tell','She often has'))):
  a['text']+=' '+b['text'];out.pop(i+1);continue
 i+=1
for g in out:
 if g.get('text','').startswith('You are offered canned'):g['text']='10. '+g['text']
# Keep food names beside their illustrations, rather than as loose prose.
labels={
 'carbohydrates':'Fig. 3.2 · Sources of carbohydrates: wheat, rice, bajra, maize, potato, sweet potato, sugarcane, banana, mango and pineapple.',
 'nuts':'Fig. 3.3 · Sources of fats: groundnut, walnut, cashew, almond and pistachio.',
 'seeds oils':'Sesame seed, sunflower seed, soya bean, coconut oil and mustard oil.',
 'dairy oil':'Sunflower oil, butter, ghee and curd.',
 'plant protein top':'Fig. 3.4 · Plant sources: moong, tuar dal and gram. Animal sources: milk, curd and paneer.',
 'plant protein bottom':'Plant sources: kidney beans, peas and soya bean. Animal sources: egg, fish and chicken.'}
loose=['sweet potato sugarcane banana mango pineapple','sesame seed sunflower seed soya bean coconut oil mustard oil','sunflower oil butter ghee curd','moong tuar dal gram milk curd paneer','kidney beans peas soya bean egg fish chicken']
out=[g for g in out if g.get('text','') not in loose]
for g in out:
 if g['kind']=='images' and g['images'][0]['title'] in labels:g['caption']=labels[g['images'][0]['title']]
 if 'text' in g and ' Fig. 3.3' in g['text']:g['text']=g['text'].split(' Fig. 3.3')[0]
# Dialogue and its two portraits form one comparison block.
a=next(i for i,g in enumerate(out) if g['kind']=='images' and g['images'][0]['title']=='aarav')
b=next(i for i in range(a,len(out)) if out[i].get('text','').startswith('Ira is right'))
out[a:b]=[dict(kind='dialogue',source=16,images=out[a]['images'],items=[g['text'] for g in out[a+1:b]])]
# Small illustration + explanation pairs are especially useful in the extension.
for g in out:
 if g['source']==28 and g['kind']=='images':g['compact']=True
# Pair the case illustration with its heading and remove the redundant figure heading.
a=next(i for i,g in enumerate(out) if g['kind']=='images' and g['images'][0]['title']=='sailing ship')
if out[a+1].get('text','').startswith('Case 1'):out[a],out[a+1]=out[a+1],out[a]
out=[g for g in out if g.get('text','')!='Fig. 3.4 — Some sources of proteins']
for g in out:
 if g.get('text','').startswith('— Cooking tools'):g['text']='Cooking tools, then and now';g['kind']='heading'
 if g.get('caption','').startswith('Fig. 3 8'):g['caption']=g['caption'].replace('Fig. 3 8','Fig. 3.8 ·')
 if g['kind']=='images':
  if g['images'][0]['title']=='gopalan':g['compact']=True
  if g['images'][0]['title']=='starch experiment':g['maxHeight']=225
# The blank label-map is a write-in artefact; the illustrated regional map replaces it.
mapgroup=next(g for g in out if g['kind']=='images' and g['images'][0]['title']=='food map')
out=[g for g in out if g is not mapgroup]
for g in out:
 if g['kind']=='images' and g['images'][0]['title']=='india map':g['images']=mapgroup['images']
# Match instructions to the redesigned notebook guides and continuous activity sequence.
for g in out:
 for key in ['text','title','caption']:
  if key in g:g[key]=re.sub(r'Activity 3\.([6-9])',lambda m:'Activity 3.'+str(int(m[1])-1),g[key])
 if 'items' in g:
  g['items']=[re.sub(r'Activity 3\.([6-9])',lambda m:'Activity 3.'+str(int(m[1])-1),t).replace('Copy Table 3.1 into your notebook, leaving four lines for each day.','Create a food diary in your notebook, with one entry for each day.').replace('Enter your findings in Table 3.2. Three rows are filled in as examples.','Record your findings in your notebook using the headings in Table 3.2. The printed rows are examples.').replace('the symptoms listed in the last column','the symptoms listed for each nutrient') for t in g['items']]
# Activity artwork belongs to its instruction panel, not the surrounding flow.
for title,artname,height in [('Keep a food diary','diary',190),('A survey in your neighbourhood','interview',210),('Test for starch','starch experiment',300),('Test for protein','protein experiment',300)]:
 activity=next(g for g in out if g['kind']=='activity' and title in g['title'])
 figure=next((g for g in out if g['kind']=='images' and any(im['title']==artname for im in g['images'])),None)
 if figure:
  activity['figure']=dict(images=figure['images'],caption=figure.get('caption',''),height=height)
  out.remove(figure)
# Deliberate per-activity composition: small objects share the text measure;
# detailed demonstrations occupy a large lower illustration, not a thumbnail.
for g in out:
 if g['kind']=='activity' and g.get('figure'):
  f=g['figure'];name=f['images'][0]['title']
  if name in ['diary','interview']:f.update(layout='side',height=300)
  elif name=='starch experiment':f.update(layout='below',height=390)
  elif name=='protein experiment':f.update(layout='below',height=450)
# Keep precautions with the demonstration that uses the chemicals.
protein=next(g for g in out if g.get('title','').endswith('Test for protein'))
prec=next(g for g in out if g.get('text','').startswith('Teacher demonstration — precautions.'))
protein['precautions']=prec['text'];protein['figure']['height']=330
out.remove(prec)
# The shared recording guide is useful as soon as the first tests are complete.
guide=next(g for g in out if g.get('caption','').startswith('Table 3.3'))
out.remove(guide)
fat=next(i for i,g in enumerate(out) if g.get('title','').endswith('Test for fat'))
out.insert(fat+1,guide)
# Restore labels at the objects' existing leader lines, with editable text.
label_specs={
 'carbohydrates':([('Wheat',93/933),('Rice',270/933),('Bajra',464/933),('Maize',648/933),('Potato',819/933)],[('Sweet potato',99/933),('Sugarcane',277/933),('Banana',468/933),('Mango',652/933),('Pineapple',848/933)]),
 'nuts':(list(zip(['Groundnut','Walnut','Cashew','Almond','Pistachio'],[89/910,284/910,450/910,628/910,809/910])),[]),
 'seeds oils':(list(zip(['Sesame seed','Sunflower seed','Soya bean','Coconut oil','Mustard oil'],[78/919,266/919,451/919,636/919,816/919])),[]),
 'dairy oil':(list(zip(['Sunflower oil','Butter','Ghee','Curd'],[94/824,326/824,522/824,737/824])),[]),
 'plant protein top':(list(zip(['Moong','Tuar dal','Gram'],[.165,.495,.825])),[]),
 'animal protein top':(list(zip(['Milk','Curd','Paneer'],[.165,.495,.825])),[]),
 'plant protein bottom':(list(zip(['Kidney beans','Peas','Soya bean'],[.165,.495,.825])),[]),
 'animal protein bottom':(list(zip(['Egg','Fish','Chicken'],[.165,.495,.825])),[])}
for g in out:
 if g['kind']=='images':
  for im in g['images']:
   if im['title'] in label_specs:im['labelsTop'],im['labelsBottom']=label_specs[im['title']]
  if any(im.get('labelsTop') for im in g['images']):
   first=g['images'][0]['title']
   g['caption']={'carbohydrates':'Fig. 3.2 · Some sources of carbohydrates','nuts':'Fig. 3.3 · Some sources of fats','plant protein top':'Fig. 3.4 · Plant sources (left) and animal sources (right)'}.get(first,'')
fat=next(g for g in out if g.get('title','').endswith('Test for fat'))
fat['figure']=dict(layout='below',height=290,images=[dict(href='../../figures/reference/food/fat-test-sequence-v2.png',title='Paper test for fat: place, press and inspect',w=2172,h=724)],labels=['Place the sample','Fold and press','Hold up to the light'],caption='An oily patch remains translucent after the paper dries.')
# Keep the vocabulary list together instead of breaking between its terms.
a=next(i for i,g in enumerate(out) if g.get('text','')=='KEYWORDS')
b=next(i for i in range(a+1,len(out)) if out[i].get('text','').startswith('Recap'))
terms=' '.join(g.get('text','') for g in out[a+1:b])
out[a+1:b]=[dict(kind='text',source=24,text=terms)]
protein=next(g for g in out if g.get('title','').endswith('Test for protein'))
protein['figure']['height']=410
# Page 1: user requested removal of the secondary thinking-boy illustration.
out=[g for g in out if not (g['kind']=='images' and g['source']==1 and any(im['title']=='thinking' for im in g['images']))]
# Foreground opener and an unboxed observation prompt, per page-one review.
for g in out:
 if g['source']==1 and g['kind']=='images':
  g['images']=[dict(href='../../figures/reference/food/p001-lunch-foreground-v2.png',title='Children comparing their lunches',w=2500,h=1000)]
 if g['source']==1 and g['kind']=='prompt':g['kind']='text';g['emphasis']=True
Path('assets/manuscripts/ch03-reading-groups.json').write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding='utf-8')
Path('assets/design-history/ch03-removed-furniture.json').write_text(json.dumps(omitted,ensure_ascii=False,indent=2),encoding='utf-8')
print(len(out),'reading groups; source retained in ch03-extracted.json')
