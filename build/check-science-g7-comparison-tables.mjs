import fs from 'node:fs/promises';import assert from 'node:assert/strict';import {createHash} from 'node:crypto';
const history='assets/design-history/science-g7-comparison-tables';
const old=JSON.parse(await fs.readFile(history+'/before-content.json','utf8'));
const norm=s=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/\*/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').toLowerCase().trim();
const text=s=>[...s.matchAll(/<text\b[^>]*>[\s\S]*?<\/text>/g)].map(m=>m[0].replace(/<tspan\b[^>]*\bdy="[^"]*"[^>]*>/g,' ').replace(/<[^>]*>/g,'')).join(' ');
const strip=s=>s.replace(/^(?:\*\*)?[^:]+:(?:\*\*)?\s*/,'');
const report=[];
for(const c of old){
 const m=await import(`./science-g7-ch${c.suffix}-content.mjs`),files=(await fs.readdir('pages/'+c.chapter)).filter(f=>/^p\d+\.html$/.test(f)).sort();
 const html=await Promise.all(files.map(f=>fs.readFile('pages/'+c.chapter+'/'+f,'utf8'))),pages=html.map(s=>norm(text(s)));
 const entry={number:c.number,chapter:c.chapter,pages:files.length,tables:[],unchangedRoles:[]};
 for(const b of m.lesson){
  const before=c.content.lesson.find(x=>x.id===b.id);assert.ok(before,'Existing teaching anchor '+b.id);
  if(!b.comparisonTable){assert.deepEqual(b,before,'Unrelated content changed: '+b.id);if(b.type==='comparison'||b.type==='bullets')entry.unchangedRoles.push({id:b.id,reason:b.type==='comparison'?'Chapter 1 topic overview, not alternative concepts':'Procedure, applications or connected stages, not contrasting alternatives'});continue;}
  assert.deepEqual(b.comparisonOriginal,before,'Recorded source matches original: '+b.id);
  const hits=html.map((s,i)=>s.includes(`data-comparison-table="${b.id}"`)?i:-1).filter(n=>n>=0);assert.equal(hits.length,1,'Table appears once: '+b.id);
  const page=pages[hits[0]],target=norm([...b.rows.flat(),b.note].join(' '));
  for(const s of [b.caption,...b.rows.flat(),b.note])assert.ok(page.includes(norm(s)),'Complete table on one page: '+b.id+' '+s);
  const concepts=before.columns||[];
  for(const col of concepts){assert.ok(target.includes(norm(col.title)));for(const s of col.items)assert.ok(target.includes(norm(strip(s))),'Original teaching point retained: '+b.id+' '+s);}
  for(const s of before.items||[])assert.ok(target.includes(norm(strip(s))),'List content retained: '+s);
  for(const s of before.text?.split(/(?<=[.!?])\s+/)||[])assert.ok(target.includes(norm(s)),'Sentence retained: '+b.id+' '+s);
  assert.ok(!b.rows.flat().some(s=>s.includes('•')),'No bullet lists masquerading as tables');
  entry.tables.push({id:b.id,page:hits[0]+1,caption:b.caption,original:before,revised:{rows:b.rows,note:b.note},treatment:'Whole framed table; matching criteria or explicitly grouped examples; qualifications retained'});
 }
 for(const k of ['opener','glossary','summary','exercises','projects'])if(c.content[k])assert.deepEqual(m[k],c.content[k],'Unrelated '+k+' unchanged');
 assert.equal(m.lesson.length,c.content.lesson.length,'No teaching block lost');
 if(c.number!==1)assert.ok(!m.lesson.some(b=>b.type==='comparison'),'No unconverted conceptual comparison');
 const audit=JSON.parse(await fs.readFile(c.history+'/render-audit.json','utf8'));
 assert.equal(audit.pages.length,files.length);assert.ok(audit.pages.every(p=>!p.collisions.length&&!p.escapedPanels.length&&p.contentBounds.bottom<=1415&&p.footerClearanceMM>=3));
 const map=JSON.parse(await fs.readFile(c.history+'/page-map.json','utf8'));
 for(const t of entry.tables){const block=map[t.page-1].blocks?.find(b=>b.id===t.id);if(block)assert.equal(block.type,'table');}
 entry.meanLessonOccupancy=+(audit.pages.slice(1,c.number===1?-2:map.findIndex(p=>p.title==='Keywords')).reduce((a,p)=>a+p.occupiedPercent,0)/(c.number===1?files.length-3:map.findIndex(p=>p.title==='Keywords')-1)).toFixed(1);
 report.push(entry);
}
const hashes=JSON.parse(await fs.readFile(history+'/before-hashes.json','utf8'));let preserved=0;
for(const [f,hash] of Object.entries(hashes)){
 const affected=old.some(c=>f.startsWith('pages/'+c.chapter+'/')&&/p\d+\.html$/.test(f)&&!f.endsWith('/p001.html'));
 if(affected)continue;
 assert.equal(createHash('sha256').update(await fs.readFile(f)).digest('hex'),hash,'Preserved source/art/style/opener: '+f);preserved++;
}
assert.equal(report.reduce((n,c)=>n+c.tables.length,0),35);
await fs.writeFile(history+'/editorial-ledger.json',JSON.stringify({chapters:report,preservedFiles:preserved},null,2));
console.log(`All ten chapters checked: 35 comparisons in whole tables; original teaching content retained; ${preserved} unrelated files and openers unchanged.`);
