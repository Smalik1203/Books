// Check final source pages and the regeneration plan by content hash, not filename.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pageIllustration,completeIllustratedPage,resetPageIllustrations} from './science-page-illustrations.mjs';
const root='pages/class-7',report=[];
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
  if(chapter>=2&&chapter<=11){
   if(supplement){
    assert(/<image\b[^>]*width="720" height="280"/.test(supplement[0]),`${directory}/${file}: illustration was shrunk`);
    const regenerated=pageIllustration(html.replace(supplement[0],''),7,chapter,{commit:true});
    assert.equal(regenerated.file,supplement[1],`${directory}/${file}: regeneration changed the approved art`);supplements++;
   }else completeIllustratedPage({parts:html},7,chapter);
  }
 }
 const repeats=[...byHash.values()].filter(list=>list.length>1);
 for(const list of repeats)assert(!list.some(x=>x.supplement),`${directory}: repeated filler ${list[0].asset}`);
 const signature=group=>JSON.stringify(group.map(x=>({page:x.page,asset:x.asset})).sort((a,b)=>(a.page+a.asset).localeCompare(b.page+b.asset)));
 const allowed=new Set((approved[chapter]?.groups||[]).map(signature));
 for(const group of repeats)assert(allowed.has(signature(group)),`${directory}: unreviewed instructional reuse of ${group[0].asset}`);
 report.push({chapter,pages:illustrated,activities,supplements,retainedInstructionalReuse:repeats});
}
report.sort((a,b)=>a.chapter-b.chapter);
assert.equal(report.length,12);
fs.writeFileSync('assets/design-history/science-g7-image-repetition/after.json',JSON.stringify(report,null,2)+'\n');
console.log(`${report.reduce((s,r)=>s+r.pages,0)} illustrated pages, ${report.reduce((s,r)=>s+r.activities,0)} numbered activities; no repeated supplementary images. Regeneration choices match the reviewed pages.`);
