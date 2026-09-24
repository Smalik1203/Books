"""Render complete trim PDF sheets with Poppler and make labelled review sheets."""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json,subprocess,os,sys
from PIL import Image,ImageDraw
root=Path(__file__).resolve().parent.parent
poppler=Path(os.environ['USERPROFILE'])/'.cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/Library/bin/pdftoppm.exe'
out=root/'tmp/g6-format/proofs';out.mkdir(parents=True,exist_ok=True)
def proof(d):
 c=json.loads((d/'chapter.json').read_text());n=int(c['number']);dest=out/f'ch{n:02}';dest.mkdir(exist_ok=True)
 pdf=root/'build/class-6'/f'{d.name}.pdf'
 subprocess.run([str(poppler),'-r','100','-png',str(pdf),str(dest/'page')],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
 files=sorted(dest.glob('page-*.png'))
 for start in range(0,len(files),9):
  grid=Image.new('RGB',(1056,1584),'#dadfdd');draw=ImageDraw.Draw(grid)
  for j,p in enumerate(files[start:start+9]):
   im=Image.open(p).convert('RGB');im.thumbnail((342,496));x=(j%3)*352+5;y=(j//3)*528+25
   grid.paste(im,(x,y));draw.text((x,y-19),f'Class 6 | Chapter {n} | Page {start+j+1}',fill='#162530')
  grid.save(dest/f'review-{start//9+1:02}.jpg',quality=92)
 print(f'Chapter {n}: {len(files)} full-sheet proofs',flush=True)
chapters=[]
for d in sorted((root/'pages/class-6').iterdir()):
 if not (d/'chapter.json').exists():continue
 c=json.loads((d/'chapter.json').read_text())
 if c.get('subject')=='Science' and (not sys.argv[1:] or str(c['number']) in sys.argv[1:]):chapters.append(d)
with ThreadPoolExecutor(max_workers=3) as pool:list(pool.map(proof,chapters))
