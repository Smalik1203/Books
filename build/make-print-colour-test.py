import json
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import Color, CMYKColor
from pypdf import PdfReader, PdfWriter
from pypdf.generic import DictionaryObject, NameObject, NumberObject, ArrayObject, DecodedStreamObject, TextStringObject
from PIL import ImageCms
import pypdfium2 as pdfium

root=Path(__file__).resolve().parent.parent
out=root/'output/pdf'; out.mkdir(parents=True,exist_ok=True)
scratch=root/'build/_print-colour-checks'
data=json.loads((scratch/'audit.json').read_text())
profile=scratch/'profile/pso-uncoated_v3_FOGRA52/PSOuncoated_v3_FOGRA52.icc'
rows={(r['palette'],r['token']):r for r in data['rows']}
names=['ember','bronze','olive','lagoon','cobalt','indigo','moss','fern','emerald','teal','violet','amethyst','mulberry','garnet']
raw=scratch/'colour-test-raw.pdf'
c=canvas.Canvas(str(raw),pagesize=A4,pageCompression=1)
c.setTitle('ClassBridge - Maplitho colour print test')
c.setAuthor('Team ClassBridge')
W,H=A4
def neutral(v=0): c.setFillColor(CMYKColor(0,0,0,v)); c.setStrokeColor(CMYKColor(0,0,0,v))
def text(x,y,s,size=9,bold=False):
    neutral(1); c.setFont('Helvetica-Bold' if bold else 'Helvetica',size); c.drawString(x,y,s)
def ink(name,token,mode):
    r=rows[name,token]
    if mode=='CMYK': return CMYKColor(*[x/100 for x in r['cmyk']])
    return Color(*[x/255 for x in bytes.fromhex(r['rgb'][1:])])
for num,mode in enumerate(['RGB','CMYK'],1):
    text(36,H-38,'CLASSBRIDGE / MAPLITHO PRINT TEST',16,True)
    text(36,H-57,f'{num} / {mode} '+('original book colours' if mode=='RGB' else 'PSO Uncoated v3 (FOGRA52) conversion'),11,True)
    text(36,H-76,'Print both pages on your intended paper, at 100% / Actual size, with identical settings.',9)
    text(36,H-90,'Colour on. Turn off draft/toner-save and photo enhancement. Do not print screenshots.',9)
    text(36,H-104,'Use one colour-management path; do not apply a second CMYK conversion manually.',9)
    y=H-129
    for x,label in [(36,'PALETTE'),(126,'STRUCTURE'),(272,'EXAMPLES'),(418,'ATTENTION')]:text(x,y,label,8,True)
    for i,name in enumerate(names):
        y=H-147-i*29
        text(36,y-10,name.title(),9,True)
        for x,role in [(126,'teal'),(272,'rust'),(418,'gold')]:
            c.setFillColor(ink(name,role,mode));c.rect(x,y-19,57,23,stroke=0,fill=1)
            neutral(0);c.setFont('Helvetica-Bold',9);c.drawCentredString(x+28.5,y-11,'Aa 123')
            c.setFillColor(ink(name,role+'-tint',mode));c.rect(x+61,y-19,70,23,stroke=0,fill=1)
            c.setStrokeColor(ink(name,role,mode));c.setLineWidth(.5);c.rect(x+61,y-19,70,23,stroke=1,fill=0)
            c.setFillColor(ink(name,role+'-deep',mode));c.setFont('Helvetica',9);c.drawString(x+66,y-11,'Aa 123')
    y=H-574
    text(36,y,'TEXT, TINTS AND FINE RULES',10,True)
    text(36,y-17,'Read at normal distance: check pale fills, coloured text and white letters in the bands.',9)
    c.setFillColor(ink('cobalt','teal-tint',mode));c.rect(36,y-79,250,49,fill=1,stroke=0)
    c.setStrokeColor(ink('cobalt','teal',mode));c.setLineWidth(.5);c.rect(36,y-79,250,49,fill=0,stroke=1)
    c.setFillColor(ink('cobalt','teal-deep',mode));c.setFont('Times-Roman',11)
    c.drawString(45,y-48,'A number sequence follows a rule.')
    neutral(1);c.setFont('Times-Roman',11);c.drawString(45,y-65,'2, 4, 6, 8, 10 ...   Black text uses K only.')
    for j,width in enumerate([.25,.5,.75,1]):
        yy=y-35-j*12; text(310,yy-3,f'{width:g} pt',8)
        c.setStrokeColor(ink('cobalt','teal',mode));c.setLineWidth(width);c.line(349,yy,554,yy)
    y-=102
    text(36,y,'BLACK-ONLY CONTROL',9,True)
    for i,k in enumerate([0,.05,.1,.2,.4,.6,.8,1]):
        x=180+i*47;neutral(k);c.rect(x,y-4,42,16,fill=1,stroke=0)
        text(x,y-16,f'{round(k*100)}% K',7)
    text(36,97,'Printer / press: _____________________  Paper / GSM: _____________________',9)
    text(36,81,'Settings: __________________________  Date: __________  Result: __________',9)
    text(36,59,'Compare the print with this PDF on screen, not with the faded soft-proof webpage.',8)
    text(36,46,'A home-printer test applies to that printer. Confirm a press proof for the final production run.',8)
    text(36,33,'Page 2 is a provisional reference conversion, not a certified PDF/X or a stock-specific proof.',8)
    c.showPage()
c.save()

reader=PdfReader(raw);writer=PdfWriter();writer.clone_document_from_reader(reader)
# Define the source RGB and provisional CMYK output condition explicitly.
rgb=DecodedStreamObject();rgb.set_data(ImageCms.ImageCmsProfile(ImageCms.createProfile('sRGB')).tobytes());rgb[NameObject('/N')]=NumberObject(3)
rgbref=writer._add_object(rgb)
for page in writer.pages:
    res=page['/Resources']; spaces=res.get('/ColorSpace',DictionaryObject())
    spaces[NameObject('/DefaultRGB')]=ArrayObject([NameObject('/ICCBased'),rgbref]);res[NameObject('/ColorSpace')]=spaces
icc=DecodedStreamObject();icc.set_data(profile.read_bytes());icc[NameObject('/N')]=NumberObject(4)
intent=DictionaryObject({NameObject('/Type'):NameObject('/OutputIntent'),NameObject('/S'):NameObject('/GTS_PDFX'),NameObject('/OutputConditionIdentifier'):TextStringObject('FOGRA52'),NameObject('/Info'):TextStringObject('PSO Uncoated v3 - provisional maplitho test; not PDF/X certified'),NameObject('/DestOutputProfile'):writer._add_object(icc)})
writer._root_object[NameObject('/OutputIntents')]=ArrayObject([writer._add_object(intent)])
final=out/'ClassBridge-Maplitho-Colour-Test.pdf'
with final.open('wb') as f:writer.write(f)
check=PdfReader(final)
assert len(check.pages)==2
for p in check.pages:assert abs(float(p.mediabox.width)-W)<.1 and abs(float(p.mediabox.height)-H)<.1
assert b' rg' in check.pages[0].get_contents().get_data()
assert b' rg' not in check.pages[1].get_contents().get_data()
assert b' k' in check.pages[1].get_contents().get_data()
doc=pdfium.PdfDocument(str(final))
for i in range(2):doc[i].render(scale=1.4).to_pil().save(scratch/f'print-test-page-{i+1}.png')
print(final)
