from PIL import Image
from pathlib import Path
import hashlib,json
assets=[]
for p in sorted(Path('figures/class-7/science/ch09').glob('*.png')):
    im=Image.open(p)
    assert im.mode=='RGBA' and im.getchannel('A').getextrema()[0]==0, p
    assets.append(dict(key=p.stem,file=p.as_posix(),pixels=list(im.size),sha256=hashlib.sha256(p.read_bytes()).hexdigest(),style='Painted 2D; genuine transparent PNG',mode='built-in imagegen'))
Path('assets/design-history/science-g7-ch09/artwork.json').write_text(json.dumps(assets,indent=2))
print('Registered',len(assets),'transparent assets')
