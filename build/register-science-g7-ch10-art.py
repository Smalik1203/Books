from pathlib import Path
from PIL import Image
import hashlib,json,shutil
root=Path(__file__).resolve().parent.parent;history=root/'assets/design-history/science-g7-ch10'
records=json.loads((history/'image-prompts.json').read_text())
assets=[]
for a in records:
    if not a.get('source'): continue
    dest=root/a['file'];dest.parent.mkdir(parents=True,exist_ok=True);shutil.copyfile(a['source'],dest)
    im=Image.open(dest);assert im.mode=='RGBA' and im.getchannel('A').getextrema()[0]<=2 and im.getchannel('A').getextrema()[1]>=250
    assets.append({'key':a['key'],'file':a['file'],'pixels':list(im.size),'sha256':hashlib.sha256(dest.read_bytes()).hexdigest(),'style':'Painted 2D; genuine transparent PNG','mode':'built-in imagegen'})
(history/'artwork.json').write_text(json.dumps(assets,indent=2))
print(f'Registered {len(assets)} transparent PNG assets.')
