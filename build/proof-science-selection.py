from pathlib import Path
import subprocess, json
from PIL import Image, ImageOps, ImageDraw
root=Path(__file__).resolve().parent.parent
folder=root/'tmp/pdfs/science-selection'
pages=sorted(folder.glob('page-*.png'))
assert len(pages)==217,len(pages)
for start in range(0,len(pages),36):
    group=pages[start:start+36]
    sheet=Image.new('RGB',(6*266,6*384),'#e4e8eb')
    draw=ImageDraw.Draw(sheet)
    for i,file in enumerate(group):
        im=Image.open(file).convert('RGB');x=(i%6)*266;y=(i//6)*384
        sheet.paste(im,(x+8,y+19));draw.text((x+10,y+3),str(start+i+1),fill='black')
    sheet.save(folder/f'contact-{start//36+1}.png')
poppler=Path('C:/Users/ragha/.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe')
pdf=root/'output/pdf/science-class-6-ch01-04-class-7-ch01-06.pdf'
for n in [14,15,100,101,178,179,199,217]:
    subprocess.run([str(poppler),'-f',str(n),'-l',str(n),'-singlefile','-scale-to','1300','-png',str(pdf),str(folder/f'detail-{n}')],check=True)
for n in [14,100,178]:
    left=Image.open(folder/f'detail-{n}.png');right=Image.open(folder/f'detail-{n+1}.png')
    pair=Image.new('RGB',(left.width+right.width+12,max(left.height,right.height)),'#d4dade')
    pair.paste(left,(0,0));pair.paste(right,(left.width+12,0));pair.save(folder/f'spread-{n}.png')
print('Rendered all pages and the three added review/opener spreads.')
