"""Front matter, purposeful recto transitions, binding and verification."""
from pathlib import Path
import json, re, hashlib
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor, white
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from pypdf import PdfReader, PdfWriter
from pypdf.annotations import Link
import pdfplumber

ROOT=Path(__file__).resolve().parent.parent
TMP=ROOT/'tmp/pdfs/science-selection'
OUT=ROOT/'output/pdf/science-class-6-ch01-04-class-7-ch01-06.pdf'
m=json.loads((TMP/'manifest.json').read_text())
FRONT=m['frontPages']
def page_index(folio):return FRONT+folio-1
W=m['metrics']['trimW']*72/25.4; H=m['metrics']['trimH']*72/25.4
M=W*89/1052; MEASURE=W-2*M; UNIT=W/1052
for name,file in [('Body','SourceSerif4-Regular.ttf'),('Bold','SourceSerif4-Bold.ttf'),('Sans','SourceSans3-Regular.ttf'),('Heading','SourceSans3-Semibold.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(ROOT/'fonts/science-v2'/file)))
INK=HexColor('#203849'); BLUE=HexColor('#285573'); RULE=HexColor('#bdcbd3'); PALE=HexColor('#edf3f6')
BODY=24*UNIT; LEAD=32*UNIT
styles={
 'body':ParagraphStyle('body',fontName='Body',fontSize=BODY,leading=LEAD,textColor=INK),
 'small':ParagraphStyle('small',fontName='Sans',fontSize=20*UNIT,leading=27*UNIT,textColor=INK),
 'head':ParagraphStyle('head',fontName='Heading',fontSize=30*UNIT,leading=38*UNIT,textColor=BLUE),
 'index':ParagraphStyle('index',fontName='Sans',fontSize=24*UNIT,leading=30*UNIT,textColor=INK),
}
def para(c,text,y,style='body',x=M,width=MEASURE):
    p=Paragraph(text,styles[style]); _,h=p.wrap(width,H)
    assert y+h<H-45,(text,y,h)
    p.drawOn(c,x,H-y-h)
    return y+h
def label(c,text,y):
    c.setFont('Heading',10);c.setFillColor(BLUE);c.drawString(M,H-y,text)
def title(c,text,y=83):
    c.setFont('Heading',38*UNIT);c.setFillColor(BLUE);c.drawString(M,H-y,text)
def footer(c,n):
    if n is not None:
        c.setStrokeColor(RULE);c.setLineWidth(.55);c.line(M,28,W-M,28)
    c.setFillColor(BLUE);c.setFont('Sans',8.5)
    c.drawString(M,37,'LEARNLAB · SCIENCE')
    c.setFont('Body',11)
    if n is not None:c.drawRightString(W-M,37,str(n))
def start(c,labeltext,heading,n):
    label(c,labeltext,43);title(c,heading);footer(c,n)

def finish_front_page(c):
    # A restrained frame sits outside the text and footer on front matter only.
    inset=8*72/25.4
    c.saveState()
    c.setStrokeColor(BLUE);c.setLineWidth(.6)
    c.rect(inset,inset,W-2*inset,H-2*inset,stroke=1,fill=0)
    c.restoreState()
    c.showPage()

front=canvas.Canvas(str(TMP/'front.pdf'),pagesize=(W,H))
front.setTitle('Science | Class 6 and Class 7')
# Cover: typography only, no image or pictorial decoration.
label(front,'LEARNLAB',64)
front.setFillColor(BLUE);front.setFont('Heading',56);front.drawString(M,H-240,'SCIENCE')
front.setStrokeColor(BLUE);front.setLineWidth(1.2);front.line(M,H-267,W-M,H-267)
para(front,'Class 6 and Class 7',295,'head')
finish_front_page(front)

start(front,'ABOUT THIS VOLUME','Science: curiosity into understanding',None)
y=para(front,'Class 6 · Chapters 1–4<br/>Class 7 · Chapters 1–6',112,'head')+30
y=para(front,'This volume brings together ten chapters from two classes. Class 6 begins with scientific questions, the diversity of living things, food and magnets. Class 7 develops these habits through investigations of substances, circuits, materials, changes and adolescence.',y)+27
y=para(front,'A connected route through science',y,'head')+12
y=para(front,'Look for connections without treating the two classes as one syllabus. Read the class label and chapter number together: each class keeps its own chapter sequence, activity numbers and figure numbers.',y)+27
y=para(front,'Using the page numbers',y,'head')+12
y=para(front,'Page 1 begins with Class 6 Chapter 1. Numbering continues through the Class 7 chapters, and the index uses these printed page numbers. The cover and introductory pages are unnumbered.',y)+27
y=para(front,'Space to think',y,'head')+12
para(front,'Short review pages follow selected chapters. They offer a chance to connect ideas and record questions before the next chapter begins.',y)
finish_front_page(front)

start(front,'FIND YOUR CHAPTER','Index',None)
index_links=[]
y=108
for grade in [6,7]:
    y=para(front,f'Class {grade}',y,'head')+13
    for ch in [c for c in m['chapters'] if c['grade']==grade]:
        top=y
        front.setFont('Heading',BODY);front.setFillColor(BLUE);front.drawString(M,H-y-BODY,str(ch['number']))
        end=para(front,ch['title'],y,'index',M+27,MEASURE-92)
        front.setFont('Sans',BODY);front.setFillColor(INK)
        front.drawRightString(W-M,H-y-BODY,f"{ch['start']}–{ch['end']}")
        index_links.append((page_index(ch['start']),[M,H-end-3,W-M,H-top+2]))
        y=max(y+30,end+11)
    y+=13
finish_front_page(front)

start(front,'HOW TO USE THIS BOOK','Read, investigate, explain',None)
y=115
for head,body in [
 ('Begin with a question','Look closely at the opening scene. Write down one thing you notice and one question you would like the chapter to help you answer.'),
 ('Make a fair comparison','For an investigation, identify what you will change, what you will observe or measure, and what you will keep the same. Record what actually happens, even when it differs from your prediction.'),
 ('Separate evidence from explanation','An observation tells you what you noticed. An explanation suggests why it happened. Use the evidence in the chapter to connect the two, and say what remains uncertain.'),
 ('Work with care','Follow each activity’s safety guidance and your teacher’s instructions. Use approved materials. Respect living things, avoid waste, and treat questions about people and development with privacy and respect.'),
 ('Return to your first question','After the chapter, revisit your question. Explain what you now understand, name the evidence that helped you, and write one new question to investigate.')]:
    y=para(front,head,y,'head')+9;y=para(front,body,y)+24
finish_front_page(front);front.save()

reviews={
 (6,1):('From curiosity to a fair investigation',[
  ('Notice and question','Choose an everyday event: clothes drying, a shadow moving or a plant bending towards light. Describe only what you can observe. Then write a question that could be investigated.'),
  ('Plan the comparison','Choose one factor to change. State what you would keep the same and what you would record. Explain how another learner could repeat your comparison.'),
  ('Connect to the next chapter','Observe two nearby plants without damaging them. Record similarities and differences. Which features might help you group them, and what would you need to observe more closely?')]),
 (6,4):('Connect the ideas from Class 6',[
  ('Group using evidence','Living things, foods and materials can be grouped for different purposes. Give one example from each topic. State the feature you used and explain why one feature may not tell the whole story.'),
  ('Test a magnetic claim','Someone says, “Every shiny object is attracted to a magnet.” Describe a safe comparison using several familiar objects. Record a prediction separately from the result you would observe.'),
  ('Carry your questions forward','Choose a question from these four chapters that you can now answer. Explain the evidence. Then write a new question about materials or changes to carry into Class 7.')]),
 (7,4):('A material, a property, a purpose',[
  ('Explain a choice','Choose a familiar tool or utensil made from more than one material. Name its parts and link each material to a useful property. Consider why the same material may not suit every part.'),
  ('Look beyond appearance','Two objects look equally shiny. What further observations or teacher-approved tests would help you compare their materials? State what each observation could tell you and what it could not establish.'),
  ('Prepare to study change','A metal object is bent; another develops a surface coating over time. Describe what you would observe before and after each change. What evidence would help you decide whether a new substance formed?')]),
}
for ch in m['chapters']:
    if 'review' not in ch:continue
    heading,items=reviews[ch['grade'],ch['number']]
    c=canvas.Canvas(str(TMP/f"review-{ch['review']}.pdf"),pagesize=(W,H))
    start(c,f"CLASS {ch['grade']} · CHAPTER {ch['number']} REVIEW",heading,ch['review'])
    y=para(c,'Use this page to organise your ideas. Continue longer answers in your notebook.',111,'small')+24
    for i,(head,body) in enumerate(items,1):
        y=para(c,f'{i}. {head}',y,'head')+8
        y=para(c,body,y)+14
        c.setStrokeColor(RULE);c.setLineWidth(.45)
        for k in range(3):c.line(M,H-y,W-M,H-y);y+=LEAD
        y+=17
    c.showPage();c.save()

writer=PdfWriter();writer.append(str(TMP/'front.pdf'))
for ch in m['chapters']:
    source=TMP/f"class-{ch['grade']}-chapter-{ch['number']}.pdf"
    assert len(PdfReader(source).pages)==ch['count'],source
    assert len(writer.pages)==page_index(ch['start'])
    writer.append(str(source),import_outline=False)
    if 'review' in ch:writer.append(str(TMP/f"review-{ch['review']}.pdf"))
assert len(writer.pages)==m['pages']
writer.add_outline_item('Index',2)
writer.add_outline_item('Read, investigate, explain',3)
for grade in [6,7]:
    group=[c for c in m['chapters'] if c['grade']==grade]
    parent=writer.add_outline_item(f'Class {grade}',page_index(group[0]['start']))
    for ch in group:
        writer.add_outline_item(f"{ch['number']}. {ch['title']}",page_index(ch['start']),parent=parent)
        if 'review' in ch:writer.add_outline_item('Chapter review',page_index(ch['review']),parent=parent)
for target,rect in index_links:writer.add_annotation(2,Link(rect=rect,target_page_index=target))
writer.page_layout='/TwoPageRight'
for i,name in enumerate(['Cover','About this volume','Index','Reading guide']):
    writer.set_page_label(i,i,prefix=name)
writer.set_page_label(FRONT,len(writer.pages)-1,style='/D',start=1)
writer.add_metadata({'/Title':'Science | Class 6 Chapters 1–4 and Class 7 Chapters 1–6','/Author':'LearnLab','/Subject':'Selected science chapters with continuous pagination'})
OUT.parent.mkdir(parents=True,exist_ok=True)
with OUT.open('wb') as f:writer.write(f)

# The PDF itself is the authority for the index, page size, folios and retention.
with pdfplumber.open(OUT) as pdf:
    texts=[]
    for i,page in enumerate(pdf.pages,1):
        assert abs(float(page.width)-W)<1 and abs(float(page.height)-H)<1,(i,page.width,page.height)
        text=page.extract_text() or '';texts.append(text)
        if i==1:
            assert all(s in text for s in ['LEARNLAB','SCIENCE','Class 6 and Class 7']),('Incomplete cover',text)
            assert 'Selected chapters' not in text and 'Chapters 1' not in text
        else:
            assert len(text.strip())>40,('Empty page',i)
        if i>FRONT:
            folio=i-FRONT
            foot=page.crop((0,page.height-31,page.width,page.height)).extract_text() or ''
            # Chapter folios and new front matter use different footer baselines.
            if not re.search(rf'(?<!\d){folio}(?!\d)',foot):
                foot=page.crop((0,page.height-49,page.width,page.height)).extract_text() or ''
            assert re.search(rf'(?<!\d){folio}(?!\d)',foot),('Wrong folio',i,folio,foot)
        else:
            foot=page.crop((0,page.height-49,page.width,page.height)).extract_text() or ''
            assert not re.search(r'\d',foot),('Numbered front matter',i,foot)
    for ch in m['chapters']:
        assert ch['start']%2==1
        assert (page_index(ch['start'])+1)%2==1
        assert 'CHAPTER' in texts[page_index(ch['start'])],('Missing opener',ch)
        assert f"{ch['start']}–{ch['end']}" in texts[2],('Wrong index range',ch)
        with pdfplumber.open(TMP/f"class-{ch['grade']}-chapter-{ch['number']}.pdf") as src:
            for j,p in enumerate(src.pages):
                assert p.extract_text()==texts[page_index(ch['start'])+j],('Binding changed content',ch,j)
labels=PdfReader(OUT).page_labels
assert labels[:FRONT]==['Cover','About this volume','Index','Reading guide']
assert labels[FRONT:]==[str(i) for i in range(1,m['numberedPages']+1)]
for file,digest in m['preserved'].items():assert hashlib.sha256((ROOT/file).read_bytes()).hexdigest()==digest,file
(TMP/'verification.json').write_text(json.dumps({'pages':len(texts),'unnumberedFrontPages':FRONT,'numberedPages':m['numberedPages'],'chapters':len(m['chapters']),'blankPages':0,'allChapterStartsOdd':True,'continuousFoliosVerified':True,'pdfPageLabelsVerified':True,'sourcesUnchanged':True,'index':m['chapters']},indent=2))
print(f'Created and verified {OUT}: {len(texts)} pages; all 10 chapters start on rectos; no blank pages.')
