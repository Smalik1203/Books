// Verify real artwork, sequence labels, fixed image size and reproducible choices.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {pageIllustration,completeIllustratedPage,resetPageIllustrations,hasContentImage} from './science-page-illustrations.mjs';
const history='assets/design-history/science-g6-format-rollout';
const approved=JSON.parse(fs.readFileSync(history+'/instructional-reuse.json','utf8'));
const report=[];
// Re-pagination changes folios, not the allowed asset or number of instructional uses.
const signature=group=>JSON.stringify(group.map(x=>x.asset).sort());
const sizes=JSON.parse(fs.readFileSync(history+'/image-sizes.json','utf8'));
for(const name of fs.readdirSync('pages/class-6')){
 const dir='pages/class-6/'+name;if(!fs.existsSync(dir+'/chapter.json'))continue;
 const meta=JSON.parse(fs.readFileSync(dir+'/chapter.json','utf8'));if(meta.subject!=='Science')continue;
 const n=Number(meta.number),hashes=new Map();let pages=0,activities=0,supplements=0;
 resetPageIllustrations(6,n);
 for(const file of fs.readdirSync(dir).filter(f=>/^p\d+\.html$/.test(f)).sort()){
  const html=fs.readFileSync(dir+'/'+file,'utf8');pages++;
  assert(hasContentImage(html),`${name}/${file}: no teaching illustration`);
  const supplement=html.match(/<g data-page-illustration="([^"]+)".*?<\/g>/s);
  const images=[...html.matchAll(/<(?:image|img)\b[^>]*(?:href|src)="\.\.\/\.\.\/(figures\/[^"]+)"/g)].filter(m=>!/(?:icon|cues\/)/.test(m[1]));
  for(const [,asset] of images){const hash=createHash('sha256').update(fs.readFileSync(asset)).digest('hex'),list=hashes.get(hash)||[];list.push({page:file,asset,supplement:supplement?.[1]===asset});hashes.set(hash,list);}
  const headings=[...html.matchAll(/<g class="v2-panel-heading v2-panel-heading--setup".*?<\/g>|<div class="g6-panel g6-panel--setup(?: [^"]+)?">\s*<div class="g6-panel__title">.*?<\/div>/gs)];
  for(const [heading] of headings){const text=heading.replace(/<[^>]*>/g,'').trim();assert.equal(text,`Activity ${n}.${++activities}`,`${name}/${file}: activity sequence`);}
  if(supplement){
   const frame=supplement[0].match(/<image\b[^>]*width="([\d.]+)" height="([\d.]+)"/);
   assert(frame,`${name}/${file}: missing image dimensions`);
   const [iw,ih]=sizes[supplement[1]],scale=Math.min(+frame[1]/iw,+frame[2]/ih);
   assert(scale+1e-8>=Math.min(720/iw,280/ih),`${name}/${file}: artwork reduced below its previous size`);
   assert(+frame[1]<=824&&+frame[2]<=540,`${name}/${file}: image outside the reviewed size steps`);
   const chosen=pageIllustration(html.replace(supplement[0],''),6,n,{commit:true});
   assert.equal(chosen.file,supplement[1],`${name}/${file}: artwork changed on regeneration`);
   assert(supplement[0].includes(chosen.caption.replaceAll('&','&amp;')),`${name}/${file}: outdated caption`);supplements++;
  }else completeIllustratedPage({parts:html},6,n);
 }
 const repeats=[...hashes.values()].filter(g=>g.length>1),allowed=new Set((approved[n]||[]).map(r=>signature(r.occurrences)));
 for(const group of repeats){assert(!group.some(x=>x.supplement),`${name}: repeated supplementary image ${group[0].asset}`);assert(allowed.has(signature(group)),`${name}: unreviewed reuse ${group[0].asset}`);}
 report.push({chapter:n,pages,activities,supplements,instructionalReuse:repeats});
}
assert.equal(report.length,12);report.sort((a,b)=>a.chapter-b.chapter);
fs.writeFileSync(history+'/format-check.json',JSON.stringify(report,null,2)+'\n');
console.log(`${report.reduce((s,r)=>s+r.pages,0)} illustrated pages; ${report.reduce((s,r)=>s+r.activities,0)} numbered Activities; ${report.reduce((s,r)=>s+r.supplements,0)} unique supplementary figures. No repeated filler or reduced figure areas; regeneration matches.`);
