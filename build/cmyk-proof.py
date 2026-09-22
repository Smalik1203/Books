"""Standalone, one-page CMYK proof of the current Class 7 Science palettes.

Reads chapter tokens without changing their RGB sources. All painted PDF colour
is DeviceCMYK, converted with LittleCMS and an embedded destination output intent.
Run with --profile to use a printer-supplied CMYK ICC profile instead of SWOP.
"""
from pathlib import Path
import argparse, io, json, re
from PIL import Image, ImageCms
from reportlab.pdfgen import canvas
from reportlab.lib.colors import CMYKColor, HexColor
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from pypdf import PdfReader, PdfWriter
from pypdf.generic import ArrayObject, DictionaryObject, NameObject, NumberObject, TextStringObject, DecodedStreamObject, ContentStream

ROOT = Path(__file__).resolve().parent.parent
parser = argparse.ArgumentParser()
parser.add_argument('--profile', default='C:/Windows/System32/spool/drivers/color/RSWOP.icm')
parser.add_argument('--mode', choices=['rgb','cmyk'], default='cmyk')
parser.add_argument('--output', default='output/pdf/CMYK.pdf')
args = parser.parse_args()
is_cmyk=args.mode=='cmyk'
profile_path = Path(args.profile)
profile = ImageCms.getOpenProfile(str(profile_path))
assert profile.profile.xcolor_space.strip() == 'CMYK', 'A CMYK output profile is required'
profile_name = ImageCms.getProfileDescription(profile).strip()
transform = ImageCms.buildTransform(ImageCms.createProfile('sRGB'), profile, 'RGB', 'CMYK',
    renderingIntent=ImageCms.Intent.RELATIVE_COLORIMETRIC,
    flags=ImageCms.Flags.BLACKPOINTCOMPENSATION)
out = ROOT/args.output
out.parent.mkdir(parents=True, exist_ok=True)
review = ROOT/'tmp/pdfs/cmyk'
review.mkdir(parents=True, exist_ok=True)

for name, file in [('Body','SourceSerif4-Regular'),('Sans','SourceSans3-Regular'),('Head','SourceSans3-Semibold'),('Bold','SourceSans3-Bold')]:
    pdfmetrics.registerFont(TTFont(name, str(ROOT/'fonts/science-v2'/f'{file}.ttf')))

def tokens(filename):
    return dict(re.findall(r'--(v2-[\w-]+)\s*:\s*(#[0-9a-fA-F]{6})', (ROOT/'css'/filename).read_text()))

shared = tokens('science-v2.css')
chapters = [
    ('01', 'Blue', 'Questions open new possibilities.', 'palette-science-v2-g7-ch01.css'),
    ('02', 'Leaf green', 'Observe, compare and record.', 'palette-science-g7-ch02.css'),
    ('03', 'Terracotta', 'Look closely at the evidence.', 'palette-science-g7-ch03.css'),
    ('04', 'Ocean blue', 'Connect properties with uses.', 'palette-science-g7-ch04.css'),
]
palette_records = []
cache = {}
def cmyk(hexcode):
    if hexcode not in cache:
        rgb = tuple(int(hexcode[i:i+2],16) for i in (1,3,5))
        channels = ImageCms.applyTransform(Image.new('RGB',(1,1),rgb),transform).getpixel((0,0))
        cache[hexcode] = tuple(v/255 for v in channels)
    return cache[hexcode]
def colour(hexcode): return CMYKColor(*cmyk(hexcode)) if is_cmyk else HexColor(hexcode)
BLACK = CMYKColor(0,0,0,1) if is_cmyk else HexColor('#000000')
WHITE = CMYKColor(0,0,0,0) if is_cmyk else HexColor('#ffffff')
INK = colour(tokens(chapters[0][3])['v2-ink'])
BLUE = colour(tokens(chapters[0][3])['v2-forest'])
W,H = 189*mm,272*mm
stream = io.BytesIO()
c = canvas.Canvas(stream,pagesize=(W,H),pageCompression=1,enforceColorSpace='CMYK' if is_cmyk else 'RGB')
c.setTitle(('CMYK' if is_cmyk else 'Existing colours')+' | Class 7 Science colour proof')
c.setAuthor('LearnLab')

def rect(x,y,w,h,fill,stroke=None,r=0):
    c.setFillColor(fill)
    if stroke: c.setStrokeColor(stroke); c.setLineWidth(.5)
    if r: c.roundRect(x*mm,H-(y+h)*mm,w*mm,h*mm,r*mm,fill=1,stroke=bool(stroke))
    else: c.rect(x*mm,H-(y+h)*mm,w*mm,h*mm,fill=1,stroke=bool(stroke))

text_bounds=[]
def text(x,y,s,font='Sans',size=9,fill=INK):
    c.setFillColor(fill);c.setFont(font,size);c.drawString(x*mm,H-y*mm,s)
    right=x*mm+pdfmetrics.stringWidth(s,font,size)
    assert right <= W-10*mm,(s,right/mm)
    assert y<=262 and y-size/mm>=7,(s,y)
    text_bounds.append([s,x,y,right/mm])

def rule(x,y,w,fill=BLUE,width=.5):
    c.setStrokeColor(fill);c.setLineWidth(width);c.line(x*mm,H-y*mm,(x+w)*mm,H-y*mm)

def wrapped(x,y,s,width,font='Body',size=9.5,lead=4.4,fill=INK):
    row=''
    for word in s.split():
        candidate=(row+' '+word).strip()
        if row and pdfmetrics.stringWidth(candidate,font,size)>width*mm:
            text(x,y,row,font,size,fill);y+=lead;row=word
        else: row=candidate
    if row:text(x,y,row,font,size,fill)
    return y

def swatches(x,y,width,items):
    step=width/len(items)
    for i,(label,hx) in enumerate(items):
        xx=x+i*step
        rect(xx,y,step-1.5,7,colour(hx))
        text(xx,y+11,label,'Head',7.2)
        vals=[round(v*100) for v in cmyk(hx)]
        palette_records.append({'label':label,'sourceRGB':hx,'CMYKpercent':vals})

# Identical proof content with matching colour-space labels.
text(14,19,'LEARNLAB  /  SCIENCE 7  /  COLOUR PROOF','Head',8.2,BLUE)
text(14,35,'Science in colour','Bold',28,BLUE)
text(147,34,'CMYK' if is_cmyk else 'RGB','Bold',18,BLUE)
text(14,44,'Four chapter palettes. Shared feature colours. One printed page.','Body',10)
text(14,50,'Observe the dark headings, soft tints and fine rules alongside the reading text.','Sans',8)
rule(14,55,161)

# Each sample uses all five chapter tokens: dark ink, main, accent, rule, wash.
for i,(number,name,sample,filename) in enumerate(chapters):
    p=tokens(filename);x=14+(i%2)*84;y=62+(i//2)*45
    rect(x,y,77,17,colour(p['v2-wash']))
    rect(x,y,1.2,17,colour(p['v2-leaf']))
    text(x+4,y+6.5,number+'  '+name,'Bold',11,colour(p['v2-forest']))
    text(x+4,y+13,sample,'Body',8.5,colour(p['v2-ink']))
    rule(x,y+17,77,colour(p['v2-rule']))
    swatches(x,y+20,77,[(label,p['v2-'+key]) for label,key in [('Main','forest'),('Accent','leaf'),('Ink','ink'),('Rule','rule'),('Wash','wash')]])

text(14,158,'Learning features','Bold',13,BLUE)

# Resolve approved translucent teal surfaces before ICC conversion.
chapter_css=(ROOT/'css'/chapters[0][3]).read_text()
def teal_surface(token):
    match=re.search(r'--'+token+r':rgb\((\d+) (\d+) (\d+) / (\d+)%\)',chapter_css)
    assert match,token
    r,g,b,a=map(int,match.groups());a/=100
    return '#'+''.join(f'{round(v*a+255*(1-a)):02x}' for v in (r,g,b))
soft=teal_surface('v2-investigate-wash');bar=teal_surface('v2-investigate-bar');edge=teal_surface('v2-investigate-rule')
rect(14,163,77,32,colour(soft),colour(edge),2)
rect(14,163,77,9,colour(bar),r=2)
text(18,169.3,'Investigate','Bold',10,colour(shared['v2-teal']))
wrapped(18,179,'Compare two paper planes. Keep the paper and launch position the same. Record three trials for each plane.',69,size=9)
rect(98,163,77,32,colour(shared['v2-amber-wash']),colour(shared['v2-amber']),2)
text(102,169.3,'Think It Through','Bold',10,colour(shared['v2-amber-ink']))
wrapped(102,179,'One plane flies farther once. Is that enough evidence to call it the better design? Explain your reasoning.',69,size=9)

swatches(14,199,161,[('Teal',shared['v2-teal']),('Soft body',soft),('Title bar',bar),('Soft rule',edge),('Teal wash',shared['v2-teal-wash']),('Amber',shared['v2-amber']),('Think ink',shared['v2-amber-ink']),('Think wash',shared['v2-amber-wash']),('Clay',shared['v2-clay'])])
text(14,225,'How It Works','Bold',11,colour(shared['v2-clay']))
wrapped(14,231,'A fair comparison changes one feature while keeping other relevant conditions alike. Repeated trials help reveal variation in the evidence.',161,size=10,lead=4.5)
text(14,244,'Black-only text sample: clear letters, clean edges, accurate registration.','Body',9,BLACK)
rule(14,250,161)
text(14,256,'Chapter identities: blue, leaf green, terracotta and ocean blue.','Sans',7.3,BLACK)
text(14,261,'189 x 272 mm  |  Vector artwork and embedded live type  |  Print at 100%','Sans',7.3,BLACK)
c.showPage();c.save()

# Attach the exact profile used to calculate ink values; do not claim PDF/X.
reader=PdfReader(stream);writer=PdfWriter();writer.clone_document_from_reader(reader)
icc=DecodedStreamObject();icc.set_data(profile_path.read_bytes());icc[NameObject('/N')]=NumberObject(4)
intent=DictionaryObject({NameObject('/Type'):NameObject('/OutputIntent'),NameObject('/S'):NameObject('/GTS_PDFX'),
    NameObject('/OutputConditionIdentifier'):TextStringObject(profile_name),NameObject('/Info'):TextStringObject(profile_name),
    NameObject('/DestOutputProfile'):writer._add_object(icc)})
if is_cmyk:
    writer._root_object[NameObject('/OutputIntents')]=ArrayObject([writer._add_object(intent)])
else:
    srgb=DecodedStreamObject();srgb.set_data(ImageCms.ImageCmsProfile(ImageCms.createProfile('sRGB')).tobytes());srgb[NameObject('/N')]=NumberObject(3)
    writer.pages[0]['/Resources'][NameObject('/ColorSpace')]=DictionaryObject({NameObject('/DefaultRGB'):ArrayObject([NameObject('/ICCBased'),writer._add_object(srgb)])})
with out.open('wb') as f:writer.write(f)

# Require one trim-sized page and only CMYK painting operators.
pdf=PdfReader(out);assert len(pdf.pages)==1
ops=ContentStream(pdf.pages[0].get_contents(),pdf).operations
forbidden=(b'rg',b'RG',b'g',b'G',b'cs',b'CS',b'sc',b'SC',b'scn',b'SCN') if is_cmyk else (b'k',b'K',b'g',b'G')
assert not any(op in forbidden for _,op in ops),'Unexpected paint colour space'
assert sum(op==(b'k' if is_cmyk else b'rg') for _,op in ops)>30
assert pdf.pages[0]['/Resources'].get('/XObject') is None,'Proof should retain vector artwork'
assert all(f.get_object()['/Subtype']!='/Type3' for f in pdf.pages[0]['/Resources']['/Font'].values())
if is_cmyk:assert pdf.trailer['/Root']['/OutputIntents'][0]['/DestOutputProfile']['/N']==4
assert ('CMYK' in pdf.pages[0].extract_text())==is_cmyk
for dimension,expected in zip(pdf.pages[0].mediabox[2:],(W,H)):assert abs(float(dimension)-expected)<.01
(review/f'verification-{args.mode}.json').write_text(json.dumps({'file':str(out),'profile':profile_name if is_cmyk else 'sRGB','pages':1,'trimMM':[189,272],'CMYKOnly':is_cmyk,'swatches':palette_records,'textBounds':text_bounds},indent=2))
print(f'Created {out}: 1 page; {len(palette_records)} palette swatches; {args.mode.upper()} vector paint.')
