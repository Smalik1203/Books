"""Render the eight changed opener pages and collect their header crops for QA."""
from pathlib import Path
import subprocess,json
from PIL import Image,ImageDraw
root=Path('build/header-art-review');root.mkdir(exist_ok=True)
chapters=['class-6/'+c['dir'] for c in json.loads(Path('assets/design-history/science-g6-modern/content.json').read_text()) if int(c['config']['number'])<=4]+['class-7/ch01-ever-evolving-world-of-science-v2','class-7/ch02-exploring-substances','class-7/ch03-electricity-circuits','class-7/ch04-metals-non-metals']
poppler='C:/Users/ragha/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe'
for i,ch in enumerate(chapters):
    out=root/('opener-'+str(i+1))
    subprocess.run([poppler,'-f','1','-l','1','-scale-to','1600','-png','-singlefile','build/'+ch+'.pdf',str(out)],check=True)
for group in range(2):
    sheet=Image.new('RGB',(1400,500),'#eeeeea');draw=ImageDraw.Draw(sheet)
    for j in range(4):
        im=Image.open(root/('opener-'+str(group*4+j+1)+'.png'))
        crop=im.crop((0,0,im.width,round(im.height*302/1514)));crop.thumbnail((680,390))
        x=10+(j%2)*700;y=32+(j//2)*250;sheet.paste(crop,(x,y));draw.text((x,y-20),'Class '+str(group+6)+' / Chapter '+str(j+1),fill='black')
    sheet.save(root/('headers-class-'+str(group+6)+'.png'))
