"""Vendor sourced photographs and retain source/licence metadata for this chapter.

The selection file is checked in; a rebuild never depends on external images.
No synthetic image generation or raster enlargement is used.
"""
from pathlib import Path
import urllib.request,json,hashlib,time,io,shutil
from PIL import Image
root=Path(__file__).resolve().parent.parent
history=root/'assets/design-history/science-v2-g7-ch01'
dest=root/'figures/class-7/science/ch01-v2/photos';dest.mkdir(parents=True,exist_ok=True)
selection=history/'photographs.json'
if not selection.exists():raise FileNotFoundError('The reviewed photographs.json selection is required.')
records=json.loads(selection.read_text('utf-8'))
for r in records:
 f=root/r['file']
 # Commons asks bulk consumers to use its standard-size derivatives.
 # 960 px exceeds 300 ppi at the largest 75.6 mm topic-photo width.
 r.setdefault('nativePixels',r['pixels'])
 r.setdefault('assetURL',r['originalURL'])
 if r.get('editingMethod'):
  if not f.exists():
   generated=Path(r['generatedPath'])
   if not generated.is_file():raise FileNotFoundError(f'Restore the reviewed transparent cutout {f}; do not substitute the opaque source photograph.')
   f.parent.mkdir(parents=True,exist_ok=True)
   shutil.copyfile(generated,f)
  with Image.open(f) as image:
   assert image.mode=='RGBA' and image.getchannel('A').getextrema()[0]==0,f
  assert hashlib.sha256(f.read_bytes()).hexdigest()==r['sha256'],f
  print(r['key'],'reviewed transparent cutout retained',flush=True)
  continue
 if not f.exists():
  source=root/r['sourceFile'] if r.get('sourceFile') else None
  if source and source.exists():
   with Image.open(source) as image:image.save(f,format='PNG',optimize=True)
  else:
   for attempt in range(4):
    try:
     with urllib.request.urlopen(urllib.request.Request(r['assetURL'],headers={'User-Agent':'LearnLabBookPhotoReview/1.0'}),timeout=60) as response:data=response.read()
     with Image.open(io.BytesIO(data)) as image:image.save(f,format='PNG',optimize=True)
     break
    except Exception:
     if attempt==3:raise
     time.sleep(15)
 r['pixels']=list(Image.open(f).size)
 r.setdefault('changes','Lossless PNG encoding of the downloaded photograph; no resampling or added frame.')
 r['sha256']=hashlib.sha256(f.read_bytes()).hexdigest()
 print(r['key'],r['pixels'],r['license'],flush=True)
 selection.write_text(json.dumps(records,ensure_ascii=False,indent=2),'utf-8')
 time.sleep(2)
selection.write_text(json.dumps(records,ensure_ascii=False,indent=2),'utf-8')
