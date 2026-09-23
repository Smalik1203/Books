import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {opener,lesson,glossary,summary,exercises,projects} from './science-g7-ch08-content.mjs';
import {questionSeven,questionTen} from './science-g7-ch08-diagrams.mjs';
import {scienceContract} from './science-contract.mjs';
const chapter='class-7/ch08-time-and-motion',dir='pages/'+chapter,history='assets/design-history/science-g7-ch08';
const files=(await fs.readdir(dir)).filter(f=>/^p\d+\.html$/.test(f)).sort();
const htmls=await Promise.all(files.map(f=>fs.readFile(dir+'/'+f,'utf8'))),all=htmls.join('\n');
const norm=s=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/\*/g,'').replace(/\s+/g,' ').trim();
const extract=s=>norm([...s.replace(/<text\b[^>]*class="[^"]*\bse-running\b[^"]*"[^>]*>[\s\S]*?<\/text>/g,'').matchAll(/<text\b[^>]*>[\s\S]*?<\/text>/g)].map(m=>m[0].replace(/<tspan\b[^>]*\bdy="[^"]*"[^>]*>/g,' ').replace(/<[^>]*>/g,'')).join(' '));
const pages=htmls.map(extract),text=pages.join(' '),has=s=>assert.ok(text.includes(norm(s)),'Missing teaching content: '+s);
assert.equal(files.length,21,'Reviewed extent with five whole concept-comparison tables');
htmls.forEach((s,i)=>{scienceContract(files[i],s);assert.ok(s.includes(`data-folio="${i+1}"`));});
opener.forEach(s=>assert.ok(pages[0].includes(norm(s))));
for(const b of lesson){
 for(const key of ['text','heading','caption','figureCaption','diagramCaption','note'])if(b[key])has(b[key]);
 for(const s of [...(b.paragraphs||[]),...(b.items||[]),...(b.rows||[]).flat()])has(s);
 for(const col of b.columns||[]){has(col.title);col.items.forEach(has);}
 if(b.type==='panel')assert.ok(pages.some(p=>b.paragraphs.every(s=>p.includes(norm(s)))),'Whole panel: '+b.id);
 if(b.type==='comparison')assert.ok(pages.some(p=>b.columns.every(c=>[c.title,...c.items].every(s=>p.includes(norm(s))))),'Whole comparison: '+b.id);
 if(b.type==='table')assert.ok(pages.some(p=>[b.caption,b.note,...b.rows.flat()].every(s=>p.includes(norm(s)))),'Whole table with guidance: '+b.id);
}
glossary.flat().forEach(has);summary.forEach(has);exercises.forEach(q=>{has(q.text);if(q.caption)has(q.caption);});projects.forEach(p=>{has(p.title);has(p.text);if(p.caption){has(p.caption);assert.ok(pages.some(page=>[p.title,p.text,p.caption].every(s=>page.includes(norm(s)))),'Project with illustration stays whole: '+p.id);}});
assert.deepEqual(lesson.filter(b=>b.sourceActivity).map(b=>b.sourceActivity),['8.1','8.2','8.3','8.4']);
assert.equal((all.match(/data-feature="setup"/g)||[]).length,4);
assert.equal((all.match(/data-feature="think"/g)||[]).length,3);
assert.equal(exercises.length,11);assert.equal(projects.length,5);assert.equal(glossary.length,10);
for(const value of ['Adults handle all cutting','bob’s centre','small release angle','same direction','Scheduled times are not observations','not a health test','never alter playground equipment','cannot reveal changes between readings','total elapsed time'])assert.ok(text.toLowerCase().includes(value.toLowerCase()),'Qualification: '+value);
for(const key of ['water-clock','pendulum','pendulum-setup','clock-face','train-stages','instruments','question-seven','question-ten','bowl-clock'])assert.ok(all.includes('data-diagram="'+key+'"'));
for(const [task,result] of [['water-task','water-evidence'],['pendulum-task','pendulum-evidence'],['clock-task','clock-evidence'],['train-task','train-evidence']])assert.ok(lesson.findIndex(b=>b.id===task)<lesson.findIndex(b=>b.id===result));
for(const task of lesson.filter(b=>b.sourceActivity))assert.ok(pages.some(p=>[...task.paragraphs,...(task.diagramCaption?[task.diagramCaption]:[])].every(s=>p.includes(norm(s)))),'Whole setup and diagram: '+task.id);
const coverage=JSON.parse(await fs.readFile(history+'/source-coverage.json','utf8'));
const ids=new Set(['opener','glossary','summary',...lesson.map(b=>b.id),...exercises.map(b=>b.id),...projects.map(b=>b.id)]);
assert.equal(coverage.points.length,40);
for(const p of [...coverage.points,...coverage.additions,...coverage.corrections])for(const id of p.targets)assert.ok(ids.has(id),'Coverage link '+id);
// Exact source tables, including the double blank at 60 seconds in Q7.
assert.deepEqual(questionSeven,[['Time (s)','0','10','20','30','?','50','?','70'],['Distance (m)','0','8','?','24','32','40','?','56']]);
assert.deepEqual(questionTen[1].slice(1).map(Number),[0,6,10,16,21,29,35,42,45,55,60]);
for(const row of [...questionSeven,...questionTen])has(row.join(' '));
const trains=lesson.find(b=>b.id==='motion-table').rows.slice(1);
assert.deepEqual(trains.map(r=>+r[1]),[0,20,40,60,80,100,120]);
assert.deepEqual(trains.map(r=>+r[3]),[0,20,35,50,75,95,120]);
trains.slice(1).forEach((r,i)=>{assert.equal(+r[2],+r[1]-trains[i][1]);assert.equal(+r[4],+r[3]-trains[i][3]);});
assert.equal(3600/(15*60),4);assert.equal(150/10*3.6,54);assert.equal(360000/25/3600,4);
assert.equal(1000/(200-500/10-500/5),20);assert.equal(2000/200,10);
assert.ok(Math.abs((400/45-400/50)-8/9)<1e-12);
const map=JSON.parse(await fs.readFile(history+'/page-map.json','utf8'));
for(const p of map){assert.ok(p.end<=1415,'Footer clearance');for(const b of (p.blocks||[]).filter(b=>b.type==='heading'))assert.ok(p.end-b.bottom>=160,'Heading has five lines: '+b.id);}
assert.ok(!/____|textLength=|lengthAdjust=|--head|--tail|style=/.test(all));
const assets=JSON.parse(await fs.readFile(history+'/artwork.json','utf8'));assert.equal(assets.length,12);
for(const a of assets){assert.equal(createHash('sha256').update(await fs.readFile(a.file)).digest('hex'),a.sha256);assert.ok(all.includes(a.file));}
for(const m of all.matchAll(/<image\b[^>]*href="([^"]+)"/g)){assert.ok(m[1].endsWith('.png')&&m[1].includes('/class-7/science/ch08/'));await fs.access(path.resolve('build/class-7',m[1]));}
const audit=JSON.parse(await fs.readFile(history+'/render-audit.json','utf8'));
const lessonPages=audit.pages.slice(1,map.findIndex(p=>p.title==='Keywords'));
for(const p of lessonPages)if(p.occupiedPercent<88)assert.ok(p.shortPageException?.protectedGroup.length||(map[p.page-1].breakReason==='End of lesson before reference pages'&&map[p.page-1].protectedNext===null&&map[p.page]?.title==='Keywords'),'Short page explained: '+p.page);
const mean=lessonPages.reduce((a,p)=>a+p.occupiedPercent,0)/lessonPages.length;
// Five whole comparisons add one lesson page. Retain the occupied-content
// budget of the former 13-page lesson; every short page still needs the
// protected-group explanation checked above. Do not shrink text to meet a mean.
assert.equal(lessonPages.length,14,'Reviewed whole-table lesson extent');
assert.ok(mean*lessonPages.length>=88*13,'Retained occupied lesson content across the additional table page');
await fs.writeFile(history+'/occupancy-summary.json',JSON.stringify({meanLessonOccupancy:mean,shortPages:lessonPages.filter(p=>p.occupiedPercent<88).map(p=>({page:p.page,occupiedPercent:p.occupiedPercent,...(map[p.page-1].protectedNext===null?{reason:'Lesson ends before dedicated glossary and summary; do not merge the reference sequence into the lesson.'}:p.shortPageException)})),aboveTarget:lessonPages.filter(p=>p.occupiedPercent>96).map(p=>({page:p.page,occupiedPercent:p.occupiedPercent,reason:'Complete teaching blocks retained at unchanged type and spacing; within the verified text block and clear of footer.'}))},null,2));
console.log(`Chapter 8 checks passed: ${files.length} pages, 4 source activities, 11 questions, 5 projects, 12 transparent assets. Mean lesson occupancy ${mean.toFixed(1)}%.`);
