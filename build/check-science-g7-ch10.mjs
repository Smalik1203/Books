import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {opener,lesson,glossary,summary,exercises,projects} from './science-g7-ch10-content.mjs';
import {scienceContract} from './science-contract.mjs';
const chapter='class-7/ch10-life-processes-in-plants',dir='pages/'+chapter,history='assets/design-history/science-g7-ch10';
const files=(await fs.readdir(dir)).filter(f=>/^p\d+\.html$/.test(f)).sort();
const htmls=await Promise.all(files.map(f=>fs.readFile(dir+'/'+f,'utf8'))),all=htmls.join('\n');
const norm=s=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/\*/g,'').replace(/\s+/g,' ').trim();
const extract=s=>norm([...s.replace(/<g\b[^>]*data-page-illustration=[\s\S]*?<\/g>/g,'').replace(/<text\b[^>]*class="[^"]*\bse-running\b[^"]*"[^>]*>[\s\S]*?<\/text>/g,'').matchAll(/<text\b[^>]*>[\s\S]*?<\/text>/g)].map(m=>m[0].replace(/<tspan\b[^>]*\bdy="[^"]*"[^>]*>/g,' ').replace(/<[^>]*>/g,'')).join(' '));
const pages=htmls.map(extract),text=pages.join(' '),has=s=>assert.ok(text.includes(norm(s)),'Missing teaching content: '+s);
assert.equal(files.length,27,'Reviewed extent with an image on every page');
htmls.forEach((s,i)=>{scienceContract(files[i],s);assert.ok(s.includes(`data-folio="${i+1}"`));});
opener.forEach(s=>assert.ok(pages[0].includes(norm(s))));
for(const b of lesson){
 for(const key of ['text','heading','caption','figureCaption','diagramCaption','note'])if(b[key])has(b[key]);
 for(const s of [...(b.paragraphs||[]),...(b.items||[]),...(b.rows||[]).flat()])has(s);
 for(const col of b.columns||[]){has(col.title);col.items.forEach(has);}
 if(b.type==='panel')assert.ok(pages.some(p=>[...b.paragraphs,...(b.diagramCaption?[b.diagramCaption]:[])].every(s=>p.includes(norm(s)))),'Whole panel with apparatus: '+b.id);
 if(b.type==='comparison')assert.ok(pages.some(p=>b.columns.every(c=>[c.title,...c.items].every(s=>p.includes(norm(s))))),'Whole comparison: '+b.id);
 if(b.type==='table')assert.ok(pages.some(p=>[b.caption,b.note,...b.rows.flat()].every(s=>p.includes(norm(s)))),'Whole table and guidance: '+b.id);
}
glossary.flat().forEach(has);summary.forEach(has);
exercises.forEach(q=>{has(q.text);if(q.caption){has(q.caption);assert.ok(pages.some(p=>[q.text,q.caption].every(s=>p.includes(norm(s)))),'Whole question and figure: '+q.id);}});
projects.forEach(p=>{has(p.title);has(p.text);assert.ok(pages.some(page=>[p.title,p.text].every(s=>page.includes(norm(s)))),'Whole project: '+p.id);});
assert.deepEqual(lesson.filter(b=>b.sourceActivity).map(b=>b.sourceActivity),['10.1','10.2','10.3','10.4','10.5','10.6','10.7','10.8']);
assert.equal((all.match(/data-feature="setup"/g)||[]).length,8);
assert.equal((all.match(/data-feature="think"/g)||[]).length,3);
assert.equal(exercises.length,10);assert.equal(projects.length,3);assert.equal(glossary.length,14);assert.equal(summary.length,10);
for(const value of ['no flames','Corrosive','Adult cutting only','needle-free','Never suck or blow','equal small volumes','starch reduced below detection','not every cell in a plant respires','upwards or downwards','not a measured micrograph','do not confine animals','not every carbohydrate','not a fixed ratio']){
 if(value==='no flames')assert.ok(text.toLowerCase().includes('keep all flames and ignition sources away'));
 else if(value==='not every carbohydrate')assert.ok(text.includes('not a measurement of every carbohydrate'));
 else if(value==='not a fixed ratio')assert.ok(text.includes('not measured rates or a fixed ratio'));
 else assert.ok(text.toLowerCase().includes(value.toLowerCase()),'Scientific qualification: '+value);
}
for(const [task,result] of [['growth-task','growth-evidence'],['starch-task','starch-evidence'],['patch-task','patch-record'],['co2-task','co2-evidence'],['oxygen-task','oxygen-evidence'],['peel-task','stomata-evidence'],['dye-task','dye-evidence'],['seed-task','seed-evidence']])assert.ok(lesson.findIndex(b=>b.id===task)<lesson.findIndex(b=>b.id===result),'Observe before explanation: '+task);
assert.ok(lesson.find(b=>b.id==='oxygen-task').paragraphs.join(' ').includes('without trapped air'));
assert.ok(lesson.find(b=>b.id==='patch-record').note.includes('supplied observations'));
assert.ok(exercises[6].caption.includes('A: light with CO₂. B: light with CO₂ removed. C: darkness with CO₂. D: darkness with CO₂ removed.'));
const coverage=JSON.parse(await fs.readFile(history+'/source-coverage.json','utf8'));
const ids=new Set(['opener','glossary','summary',...lesson.map(b=>b.id),...exercises.map(b=>b.id),...projects.map(b=>b.id)]);
assert.equal(coverage.points.length,40);
for(const p of [...coverage.points,...coverage.additions,...coverage.corrections])for(const id of p.targets)assert.ok(ids.has(id),'Coverage link '+id);
const map=JSON.parse(await fs.readFile(history+'/page-map.json','utf8'));
for(const p of map){assert.ok(p.end<=1415,'Footer clearance');for(const b of (p.blocks||[]).filter(b=>b.type==='heading'))assert.ok(p.end-b.bottom>=160,'Heading has five lines: '+b.id);}
assert.ok(!/____|textLength=|lengthAdjust=|--head|--tail|style=/.test(all));
const cfg=JSON.parse(await fs.readFile(dir+'/chapter.json','utf8'));assert.equal(cfg.subject,'Science');assert.equal(cfg.edition,'science-tall');
const assets=JSON.parse(await fs.readFile(history+'/artwork.json','utf8'));assert.equal(assets.length,14);
for(const a of assets){assert.equal(createHash('sha256').update(await fs.readFile(a.file)).digest('hex'),a.sha256);assert.ok(all.includes(a.file));}
for(const m of all.matchAll(/<image\b[^>]*href="([^"]+)"/g)){assert.ok(m[1].endsWith('.png')&&m[1].includes('/class-7/science/ch10/'));await fs.access(path.resolve('build/class-7',m[1]));}
const audit=JSON.parse(await fs.readFile(history+'/render-audit.json','utf8'));
const lessonPages=audit.pages.slice(1,map.findIndex(p=>p.title==='Keywords'));
for(const p of lessonPages)if(p.occupiedPercent<88)assert.ok(p.shortPageException?.protectedGroup.length||(map[p.page-1].breakReason==='End of lesson before reference pages'&&map[p.page-1].protectedNext===null&&map[p.page]?.title==='Keywords'),'Short page explained: '+p.page);
const mean=lessonPages.reduce((a,p)=>a+p.occupiedPercent,0)/lessonPages.length;
await fs.writeFile(history+'/occupancy-summary.json',JSON.stringify({targetPercent:[88,96],meanLessonOccupancy:mean,targetMetOnEveryPage:lessonPages.every(p=>p.occupiedPercent>=88&&p.occupiedPercent<=96),shortPages:lessonPages.filter(p=>p.occupiedPercent<88).map(p=>({page:p.page,occupiedPercent:p.occupiedPercent,...(map[p.page-1].protectedNext===null?{reason:'Lesson ends before dedicated glossary and summary; reference pages remain separate.'}:p.shortPageException)})),aboveTarget:lessonPages.filter(p=>p.occupiedPercent>96).map(p=>({page:p.page,occupiedPercent:p.occupiedPercent,reason:'Complete teaching units remain within the measured text block with unchanged type and footer clearance.'}))},null,2));
console.log(`Chapter 10 checks passed: ${files.length} pages, 8 source activities, 10 questions, 3 projects, 14 transparent assets. Actual mean lesson occupancy ${mean.toFixed(1)}%; short-page exceptions recorded.`);
