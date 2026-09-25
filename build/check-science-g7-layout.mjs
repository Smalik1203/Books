// Content, protected components, artwork and rendered geometry after repagination.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {scienceContract} from './science-contract.mjs';
const auditDir='assets/design-history/science-g7-layout-review';
const before=JSON.parse(fs.readFileSync(`${auditDir}/before-pages.json`,'utf8'));
const preserved=JSON.parse(fs.readFileSync(`${auditDir}/preserved-class6.json`,'utf8'));
const plans=JSON.parse(fs.readFileSync(`${auditDir}/page-art.json`,'utf8'));
const sha=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const norm=s=>String(s).replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/\*/g,'').replace(/\s+/g,' ').trim();
const extract=html=>norm([...html.replace(/<g\b[^>]*data-page-illustration=[\s\S]*?<\/g>/g,'').replace(/<text\b[^>]*class="[^"]*\bse-running\b[^"]*"[^>]*>[\s\S]*?<\/text>/g,'').matchAll(/<text\b[^>]*>[\s\S]*?<\/text>/g)].map(m=>m[0].replace(/<tspan\b[^>]*\bdy="[^"]*"[^>]*>/g,' ').replace(/<[^>]*>/g,'')).join(' '));
const report=[];
for(const dir of fs.readdirSync('pages/class-7')){
 const folder=`pages/class-7/${dir}`,config=JSON.parse(fs.readFileSync(folder+'/chapter.json','utf8'));
 if(config.subject!=='Science')continue;
 const n=Number(config.number),suffix=n===1?'01-v2':String(n).padStart(2,'0');
 const content=await import(`./science-g7-ch${suffix}-content.mjs`);
 const history=n===1?'assets/design-history/science-v2-g7-ch01':`assets/design-history/science-g7-ch${suffix}`;
 const files=fs.readdirSync(folder).filter(f=>/^p\d+\.html$/.test(f)).sort();
 const html=files.map(f=>fs.readFileSync(folder+'/'+f,'utf8')),pages=html.map(extract),all=html.join('\n'),text=pages.join(' ');
 const has=s=>assert.ok(text.includes(norm(s)),`Chapter ${n}: missing teaching text: ${s}`);
 const whole=(values,id)=>assert.ok(pages.some(p=>values.filter(Boolean).every(s=>p.includes(norm(s)))),`Chapter ${n}: divided ${id}`);
 for(const b of content.lesson){
  for(const key of ['text','heading','caption','figureCaption','diagramCaption','note'])if(b[key])has(b[key]);
  for(const s of [...(b.paragraphs||[]),...(b.items||[]),...(b.rows||[]).flat()])has(s);
  for(const c of b.columns||[]){has(c.title);c.items.forEach(has);if(c.figureCaption)has(c.figureCaption);}
  if(b.type==='panel')whole([...b.paragraphs,b.diagramCaption],b.id);
  if(b.type==='table')whole([b.caption,b.note,...b.rows.flat()],b.id);
  if(b.type==='comparison')for(const c of b.columns)whole([c.title,...c.items,c.figureCaption],b.id);
 }
 content.opener.forEach(has);content.glossary.flat().forEach(has);content.summary.forEach(has);
 for(const q of content.exercises){if(typeof q==='string'){has(q);continue;}has(q.text);if(q.caption)has(q.caption);whole([q.text,q.caption],q.id);}
 for(const p of content.projects||[]){has(p.title);has(p.text);whole([p.title,p.text,p.caption],p.id);}
 for(const [i,h] of html.entries()){
  scienceContract(`${dir}/${files[i]}`,h);
  assert.ok(h.includes(`data-folio="${i+1}"`),'Continuous folios');
  assert.ok(!/â€|Â·|Ã/.test(h),'No encoding damage');
  assert.ok(/<image\b|data-instructional-figure=/.test(h),'Illustrated page');
 }
 const old=Object.entries(before).filter(([f])=>f.startsWith(folder+'/')).map(([,h])=>h).join('\n');
 let oldReading=extract(old),newReading=extract(all);
 if(n===9){
  assert.ok(!oldReading.includes('Summary'),'Baseline lacks the authored animal-life summary');
  newReading=norm(newReading.replace(norm('Summary • '+content.summary.join(' • ')),''));
 }
 if(n===12)for(const caption of ['Use a light source and an opaque object to model a shadow.','Observations help us test models of the sky.'])oldReading=norm(oldReading.replace(caption,''));
 assert.equal(newReading,oldReading,`Chapter ${n}: original teaching text retained in order`);
 // Native art and its captions are retained; supplementary art is reviewed separately.
 const native=h=>[...h.replace(/<g\b[^>]*data-page-illustration=[\s\S]*?<\/g>/g,'').matchAll(/<image\b[^>]*href="([^"]+)"/g)].map(m=>m[1]);
 const referenceArt=n===12?['../../figures/class-6/science/ch12/observatory.png','../../figures/class-7/science/ch11/shadow-setup.png']:[];
 assert.deepEqual(native(all).filter(f=>!referenceArt.includes(f)).sort(),native(old).filter(f=>!referenceArt.includes(f)).sort(),`Chapter ${n}: native artwork retained`);
 for(const f of referenceArt)assert.ok(all.includes(f),'Existing reference artwork retained');
 const supplements=[...all.matchAll(/data-page-illustration="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(supplements.map(sha)).size,supplements.length,`Chapter ${n}: no repeated supplementary picture`);
 for(const f of supplements)assert.ok(n===1?old.includes(`data-page-illustration="${f}"`):plans[`7-${n}`]?.some(p=>p.file===f&&p.sha256===sha(f)),`Reviewed supplemental artwork: ${f}`);
 const map=JSON.parse(fs.readFileSync(history+'/page-map.json','utf8'));
 const audit=JSON.parse(fs.readFileSync(history+'/render-audit.json','utf8'));
 assert.equal(map.length,files.length);assert.equal(audit.pages.length,files.length);
 for(const p of audit.pages){assert.equal(p.collisions.length,0,`Chapter ${n} p${p.page}: collision`);assert.equal(p.escapedPanels.length,0);assert.ok(p.contentBounds.bottom<=1415,`Chapter ${n} p${p.page}: bottom overflow`);assert.ok(p.footerClearanceMM>=3);}
 report.push({chapter:n,beforePages:Object.keys(before).filter(f=>f.startsWith(folder+'/')).length,pages:files.length,supplements:supplements.length,shortPages:audit.pages.filter(p=>p.occupiedPercent<88).map(p=>({page:p.page,fill:p.occupiedPercent,reason:map[p.page-1].breakReason||map[p.page-1].titleRole}))});
}
for(const [file,hash] of Object.entries(preserved))assert.equal(sha(file),hash,`Class 6 / shared styles preserved: ${file}`);
assert.equal(report.length,12);
fs.writeFileSync(`${auditDir}/verification.json`,JSON.stringify({preservedFiles:Object.keys(preserved).length,chapters:report.sort((a,b)=>a.chapter-b.chapter)},null,2)+'\n');
console.log(`All 12 chapters: teaching text and native pictures retained; panels, tables and questions whole; geometry passed; ${Object.keys(preserved).length} Class 6/art/style files unchanged.`);
