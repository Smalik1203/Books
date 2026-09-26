"""Check teaching copy and image paths against the immutable pre-migration pages.
Whitespace and furniture may change; substantive words and qualifications may not.
"""
import json,re,html,sys
from pathlib import Path
from lxml import etree as E
H=Path('assets/design-history/science-g6-modern')
source=json.loads((H/'source-pages.json').read_text(encoding='utf8'))
summary_revisions=json.loads(Path('assets/design-history/science-g6-format-rollout/summary-revisions.json').read_text(encoding='utf8'))
painted_replacements={
    '../../figures/class-6/living-world/bose.jpg':'../../figures/class-6/living-world/bose-illustration.png',
    '../../figures/class-6/living-world/photo-garden.png':'../../figures/class-6/living-world/opener-illustration.png',
}
def norm(s):return re.sub(r'[^\w]','',html.unescape(s)).lower()
results=[]
for ch in source:
    if sys.argv[1:] and str(ch['config']['number']) not in sys.argv[1:]:continue
    pages=sorted((Path('pages/class-6')/ch['dir']).glob('p*.html'))
    output='\n'.join(p.read_text(encoding='utf8') for p in pages)
    root=E.HTML(output)
    # A paragraph may now continue over a page turn. Running furniture is
    # outside its reading sequence and must not interrupt the retention match.
    for furniture in root.xpath('//*[contains(concat(" ",normalize-space(@class)," ")," g6-furniture ")]'):
        furniture.getparent().remove(furniture)
    target=norm(' '.join(root.itertext()))
    missing=[];checked=0;allowed=[];image_missing=[]
    for page in ch['pages']:
        old=E.HTML(page['html'])
        nodes=old.xpath('//text') if ch['config']['number']!='10' else old.xpath('//p|//li|//h2|//h3|//h4|//td|//th|//figcaption')
        for node in nodes:
            s=''.join(node.itertext());n=norm(s);c=node.get('class','')
            if len(n)<5:continue
            if ch['config']['number']=='10' and re.fullmatch(r'[\s_]+',s):
                allowed.append({'source':page['file'],'text':s,'reason':'Retired textbook writing lines; recording headings remain for notebook work'});continue
            if any(k in c for k in ['running','footer','se-title','chapter-label','chapter-number','activity-tab-text','cue-title']):continue
            checked+=1
            if n in target:continue
            if ch['config']['number']=='3' and n==norm('Begin with carbohydrates, one group of food components.'):
                allowed.append({'source':page['file'],'text':s,'reason':'User-requested removal of the redundant transition immediately before the Carbohydrates heading.'});continue
            revision=next((r for r in summary_revisions if str(r['chapter'])==ch['config']['number'] and r['source']==page['file'] and norm(r['original'])==n),None)
            if revision and all(norm(s) in target for s in revision['replacement']):
                allowed.append({'source':page['file'],'text':s,'reason':revision['reason']});continue
            if ch['config']['number']=='10' and s.startswith('In this invented picture record,') and all(norm(part) in target for part in s.split('. ',1)):
                allowed.append({'source':page['file'],'text':s,'reason':'The unchanged first sentence introduces the record before the panel; the unchanged interpretation follows its title.'});continue
            # Explicit naming changes in the common design system.
            alias={'keywords':'keywordssummary','recapthechapterinshort':'summary','wordstouseaccurately':'keywords','whatthischapterestablished':'summary'}
            stripped=re.sub(r'^investigation\d+','',n)
            if n in alias and ('keywords' in target if n=='keywords' else alias[n] in target) or stripped!=n and stripped in target or n=='sciencearoundus':
                allowed.append({'source':page['file'],'text':s,'reason':'Retired furniture or common feature/reference naming'});continue
            missing.append({'source':page['file'],'text':s})
        for image in old.xpath('//image|//img'):
            src=image.get('href') or image.get('src')
            if src and src not in output:
                if src.endswith('/think-it-through-icon.png'):allowed.append({'source':page['file'],'image':src,'reason':'Retired raster feature icon replaced by the shared live vector icon'})
                elif ch['config']['number']=='10' and src in painted_replacements and painted_replacements[src] in output:
                    allowed.append({'source':page['file'],'image':src,'reason':'Documented painted PNG replacement; original file and photographic credit retained in the repository.'})
                elif ch['config']['number']=='3' and src=='../../figures/reference/food/p002-diary.png' and '../../figures/reference/food/p002-diary-transparent.png' in output:
                    allowed.append({'source':page['file'],'image':src,'reason':'User-requested transparent PNG notebook replacement; original retained. See science-g6-ch03-fitting/image-edit.md.'})
                else:image_missing.append({'source':page['file'],'image':src})
    result={'chapter':ch['dir'],'originalPages':len(ch['pages']),'newPages':len(pages),'checkedTextUnits':checked,'documentedAliases':allowed,'missingText':missing,'missingImages':image_missing}
    results.append(result);print(ch['dir'],checked,'units;',len(missing),'missing text;',len(image_missing),'missing images')
    for m in missing[:8]:print(' ',m)
(H/'retention-audit.json').write_text(json.dumps(results,ensure_ascii=False,indent=2),encoding='utf8')
if any(r['missingText'] or r['missingImages'] for r in results):sys.exit(1)
