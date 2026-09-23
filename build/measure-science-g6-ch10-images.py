"""Record source image ratios so illustrations do not occupy false wide canvases."""
import json
from pathlib import Path
from PIL import Image

history=Path('assets/design-history/science-g6-modern')
chapter=next(c for c in json.loads((history/'content.json').read_text(encoding='utf8')) if c['config']['number']=='10')
metrics={}
def visit(value):
    if isinstance(value,dict):
        if value.get('kind')=='image':
            src=value['src']
            with Image.open(Path(src.removeprefix('../../'))) as im:
                metrics[src]={'width':im.width,'height':im.height}
        for item in value.values(): visit(item)
    elif isinstance(value,list):
        for item in value: visit(item)
visit(chapter)
(history/'ch10-living-world/image-metrics.json').write_text(json.dumps(metrics,indent=2),encoding='utf8')
print(f'Recorded {len(metrics)} image aspect ratios without changing their pixels.')
