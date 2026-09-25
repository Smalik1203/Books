// Check final source pages and the regeneration plan by content hash, not filename.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pageIllustration,completeIllustratedPage,resetPageIllustrations} from './science-page-illustrations.mjs';
const root='pages/class-7',report=[];
const plan=JSON.parse(fs.readFileSync('assets/design-history/science-g7-layout-review/page-art.json','utf8'));
const sizes=JSON.parse(fs.readFileSync('assets/design-history/science-g7-layout-review/image-sizes.json','utf8'));
const approved=JSON.parse(fs.readFileSync('assets/design-history/science-g7-image-repetition/approved-instructional-reuse.json','utf8'));
for(const directory of fs.readdirSync(root)){
 const dir=path.join(root,directory),metaPath=path.join(dir,'chapter.json');
 if(!fs.existsSync(metaPath))continue;
 const meta=JSON.parse(fs.readFileSync(metaPath,'utf8'));
 if(meta.subject!=='Science')continue;
 const chapter=Number(meta.number),byHash=new Map();let activities=0,illustrated=0,supplements=0;
 resetPageIllustrations(7,chapter);
 for(const file of fs.readdirSync(dir).filter(f=>/^p\d+\.html$/.test(f)).sort()){
  const html=fs.readFileSync(path.join(dir,file),'utf8');
  const supplement=html.match(/<g data-page-illustration="([^"]+)".*?<\/g>/s);
  const images=[...html.matchAll(/<image\b[^>]*href="\.\.\/\.\.\/(figures\/[^"]+)"/g)].filter(m=>!/(?:icon|cues\/)/.test(m[1]));
  assert(images.length||/data-instructional-figure="[^"]+"/.test(html),`${directory}/${file}: missing content illustration`);illustrated++;
  for(const m of images){
   const hash=createHash('sha256').update(fs.readFileSync(m[1])).digest('hex');
   const list=byHash.get(hash)||[];list.push({file,page:file,asset:m[1],supplement:supplement?.[1]===m[1]});byHash.set(hash,list);
  }
  for(const heading of html.matchAll(/<g class="v2-panel-heading v2-panel-heading--setup".*?<\/g>/gs)){
   assert(!heading[0].includes('Investigate'),`${directory}/${file}: old heading`);
   const expected=`Activity ${chapter}.${++activities}`;
   assert(heading[0].includes(`>${expected}</text>`),`${directory}/${file}: expected ${expected}`);
  }
  if(chapter>=2&&chapter<=12){
   if(supplement){
    const tag=supplement[0].match(/<image\b[^>]*>/)[0],w=+tag.match(/width="([^"]+)"/)[1],h=+tag.match(/height="([^"]+)"/)[1];
    const dimensions=sizes[supplement[1]];
    assert(w<=824&&h<=540&&h>=260,`${directory}/${file}: figure frame outside reviewed range`);
    assert(Math.abs(w/h-dimensions[0]/dimensions[1])<.001,'Preserve natural figure proportions');
    const selected=plan[`7-${chapter}`].find(a=>a.file===supplement[1]);
    assert(selected,`${directory}/${file}: unreviewed art`);
    assert(selected.anchors.some(id=>html.includes(`data-block="${id}"`))||!selected.anchors.length&&html.includes(selected.title),'Art has its teaching context');supplements++;
   }else completeIllustratedPage({parts:html},7,chapter);
  }
 }
 const repeats=[...byHash.values()].filter(list=>list.length>1);
 for(const list of repeats)assert(!list.some(x=>x.supplement),`${directory}: repeated filler ${list[0].asset}`);
 const signature=group=>JSON.stringify(group.map(x=>x.asset).sort());
 const allowed=new Set((approved[chapter]?.groups||[]).map(signature));
 for(const group of repeats)assert(allowed.has(signature(group)),`${directory}: unreviewed instructional reuse of ${group[0].asset}`);
 report.push({chapter,pages:illustrated,activities,supplements,retainedInstructionalReuse:repeats});
}
report.sort((a,b)=>a.chapter-b.chapter);
assert.equal(report.length,12);
fs.writeFileSync('assets/design-history/science-g7-image-repetition/after.json',JSON.stringify(report,null,2)+'\n');
console.log(`${report.reduce((s,r)=>s+r.pages,0)} illustrated pages, ${report.reduce((s,r)=>s+r.activities,0)} numbered activities; no repeated supplementary images. Figure sizes and topic anchors match the reviewed plan.`);
