"""Profile-specific palette proof, not certification of a press or PDF/X file."""
import argparse, hashlib, html, json, re
from pathlib import Path
from PIL import Image, ImageCms
from pypdf import PdfReader

p = argparse.ArgumentParser()
p.add_argument('--profile', required=True)
p.add_argument('--pdfs', action='store_true')
a = p.parse_args()
root = Path(__file__).resolve().parent.parent
out = root / 'build/_print-colour-checks'
out.mkdir(exist_ok=True)
profile = ImageCms.getOpenProfile(a.profile)
assert profile.profile.xcolor_space.strip() == 'CMYK'
srgb = ImageCms.createProfile('sRGB')
lab = ImageCms.createProfile('LAB')
flags = ImageCms.Flags.BLACKPOINTCOMPENSATION
to_cmyk = ImageCms.buildTransform(srgb, profile, 'RGB', 'CMYK', renderingIntent=1, flags=flags)
# Do not apply reverse black-point compensation: that would expand the paper's
# compressed black back to monitor black and hide the print change.
to_rgb = ImageCms.buildTransform(profile, srgb, 'CMYK', 'RGB', renderingIntent=1)
to_lab = ImageCms.buildTransform(srgb, lab, 'RGB', 'LAB', renderingIntent=1)
from_cmyk_lab = ImageCms.buildTransform(profile, lab, 'CMYK', 'LAB', renderingIntent=1)
def pixel(rgb): return Image.new('RGB', (1, 1), rgb)
def luminance(rgb):
    v=[x/255 for x in rgb]
    v=[x/12.92 if x<=0.04045 else ((x+0.055)/1.055)**2.4 for x in v]
    return sum(x*y for x,y in zip(v,[.2126,.7152,.0722]))
def contrast(x,y):
    x,y=sorted([luminance(x),luminance(y)])
    return (y+.05)/(x+.05)
names=set()
for f in (root/'pages').glob('class-*/**/chapter.json'):
    m=json.loads(f.read_text(encoding='utf-8'))
    if str(m.get('subject','')).startswith('Mathematics'): names.add(m['palette'])
rows=[]
for name in sorted(names):
    css=(root/f'css/palette-{name}.css').read_text(encoding='utf-8')
    css=re.sub(r'/\*[\s\S]*?\*/','',css)
    for token,h in re.findall(r'--([\w-]+)\s*:\s*(#[\da-fA-F]{6})\s*;',css):
        rgb=tuple(bytes.fromhex(h[1:])); src=pixel(rgb)
        ink=ImageCms.applyTransform(src,to_cmyk)
        proof=ImageCms.applyTransform(ink,to_rgb).getpixel((0,0))
        l1=ImageCms.applyTransform(src,to_lab).getpixel((0,0))
        l2=ImageCms.applyTransform(ink,from_cmyk_lab).getpixel((0,0))
        de=((100*(l1[0]-l2[0])/255)**2+(l1[1]-l2[1])**2+(l1[2]-l2[2])**2)**.5
        cmyk=[round(x*100/255,1) for x in ink.getpixel((0,0))]
        rows.append(dict(palette=name,token=token,rgb=h,proof='#'+bytes(proof).hex(),cmyk=cmyk,tac=round(sum(cmyk),1),deltaE76=round(de,1),whiteContrast=round(contrast(proof,(255,255,255)),2)))
pdfs=[]
if a.pdfs:
    for f in sorted((root/'build').glob('class-*/class-*-mathematics-*-book-bleed.pdf')):
        reader=PdfReader(f); rgb_pages=0; cmyk_pages=0
        for page in reader.pages:
            content=page.get_contents()
            data=content.get_data() if content is not None else b''
            rgb_pages+=bool(re.search(rb'\s(?:rg|RG)\s',data))
            cmyk_pages+=bool(re.search(rb'\s(?:k|K)\s',data))
        pdfs.append(dict(file=str(f.relative_to(root)),pages=len(reader.pages),pagesWithRGBOperators=rgb_pages,pagesWithCMYKOperators=cmyk_pages,hasOutputIntent=bool(reader.trailer['/Root'].get('/OutputIntents'))))
result=dict(profile=ImageCms.getProfileName(profile).strip(),profileSha256=hashlib.sha256(Path(a.profile).read_bytes()).hexdigest(),intent='relative colorimetric with black-point compensation; paper-relative preview',status='PROVISIONAL — printer profile and physical proof required',rows=rows,pdfs=pdfs)
(out/'audit.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
blocks=[]
for name in sorted(names):
    cells=[]
    for r in [x for x in rows if x['palette']==name]:
        cells.append(f"<tr><td>{r['token']}</td><td style='background:{r['rgb']}'></td><td style='background:{r['proof']}'></td><td>{'/'.join(map(str,r['cmyk']))}</td><td>{r['tac']}%</td><td>{r['deltaE76']}</td></tr>")
    blocks.append(f"<section><h2>{name.title()}</h2><table><tr><th>Role token</th><th>Screen</th><th>CMYK preview</th><th>C/M/Y/K %</th><th>Total ink</th><th>ΔE76</th></tr>{''.join(cells)}</table></section>")
(out/'index.html').write_text("<!doctype html><meta charset='utf-8'><title>Maplitho palette check</title><style>body{font:16px system-ui;margin:40px auto;max-width:1100px;color:#222;background:#fafafa}section{background:white;padding:20px;margin:20px 0}table{border-collapse:collapse;width:100%;font-size:14px}td,th{padding:9px;border:1px solid #ccc;text-align:left}td:nth-child(2),td:nth-child(3){width:100px}h1{font-size:28px}</style><h1>Maths palettes · provisional uncoated print check</h1><p>"+html.escape(result['profile'])+". Relative colorimetric with black-point compensation; paper-relative preview. Screen previews do not simulate your exact paper or press.</p><p>CMYK recipes and colour differences are profile-specific diagnostics. ΔE76 is an 8-bit approximation, not a press acceptance test. Do not substitute these preview RGB colours into the source CSS. Current book PDFs still require colour-managed prepress conversion.</p>"+''.join(blocks),encoding='utf-8')
print(json.dumps(dict(palettes=len(names),tokens=len(rows),maxTAC=max(x['tac'] for x in rows),largestShifts=sorted(rows,key=lambda x:x['deltaE76'],reverse=True)[:8],pdfs=pdfs),indent=2))
