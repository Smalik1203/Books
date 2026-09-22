import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {opener,lesson,glossary,summary,exercises,projects} from './science-g7-ch06-content.mjs';
import {scienceContract} from './science-contract.mjs';

const chapter='class-7/ch06-adolescence',dir='pages/'+chapter,history='assets/design-history/science-g7-ch06';
const files=(await fs.readdir(dir)).filter(f=>/^p\d+\.html$/.test(f)).sort();
const htmls=await Promise.all(files.map(f=>fs.readFile(dir+'/'+f,'utf8'))),all=htmls.join('\n');
const norm=s=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/\*/g,'').replace(/\s+/g,' ').trim();
const extract=s=>norm([...s.replace(/<text\b[^>]*class="[^"]*\bse-running\b[^"]*"[^>]*>[\s\S]*?<\/text>/g,'').matchAll(/<text\b[^>]*>[\s\S]*?<\/text>/g)].map(m=>m[0].replace(/<tspan\b[^>]*\bdy="[^"]*"[^>]*>/g,' ').replace(/<[^>]*>/g,'')).join(' '));
const pages=htmls.map(extract),text=pages.join(' '),has=s=>assert.ok(text.includes(norm(s)),'Missing teaching content: '+s);
assert.equal(files.length,18,'Reviewed chapter extent');
htmls.forEach((s,i)=>{scienceContract(files[i],s);assert.ok(s.includes(`data-folio="${i+1}"`));});
opener.forEach(s=>assert.ok(pages[0].includes(norm(s))));
for(const b of lesson){
 for(const key of ['text','heading','caption','figureCaption','diagramCaption','note'])if(b[key])has(b[key]);
 for(const s of [...(b.paragraphs||[]),...(b.items||[]),...(b.rows||[]).flat()])has(s);
 for(const col of b.columns||[]){has(col.title);col.items.forEach(has);}
 if(b.type==='panel')assert.ok(pages.some(p=>b.paragraphs.every(s=>p.includes(norm(s)))),'Panel stays whole: '+b.id);
 if(b.type==='comparison')assert.ok(pages.some(p=>b.columns.every(c=>[c.title,...c.items].every(s=>p.includes(norm(s))))),'Whole comparison: '+b.id);
 if(b.type==='table')assert.ok(pages.some(p=>[b.caption,b.note,...b.rows.flat()].every(s=>p.includes(norm(s)))),'Whole table with guidance: '+b.id);
}
glossary.flat().forEach(has);summary.forEach(has);exercises.forEach(q=>has(q.text));projects.forEach(p=>{has(p.title);has(p.text);if(p.caption){has(p.caption);assert.ok(pages.some(page=>[p.title,p.text,p.caption].every(s=>page.includes(norm(s)))),'Project with its illustration stays whole: '+p.id);}});
assert.deepEqual(lesson.filter(b=>b.sourceActivity).map(b=>b.sourceActivity),Array.from({length:4},(_,i)=>'6.'+(i+1)));
assert.equal((all.match(/data-feature="setup"/g)||[]).length,4);
assert.equal((all.match(/data-feature="think"/g)||[]).length,3);
assert.equal(exercises.length,10);assert.equal(projects.length,3);assert.equal(glossary.length,10);
for(const value of ['Do not identify anyone','nobody needs to disclose','21 to 45 days','never flush it','dry completely','appearance alone','teacher approval','14446','not readiness for marriage','Never force a stretch','prescribed medicines should be used only as directed'])assert.ok(text.toLowerCase().includes(value.toLowerCase()),'Safety or qualification: '+value);
for(const key of ['neck','cycle','smoke','hormones'])assert.ok(all.includes('data-diagram="'+key+'"'),'Missing diagram '+key);
for(const [task,table] of [['anonymous-task','growth-table'],['feelings-task','feelings-table'],['food-task','food-table'],['digital-task','digital-table']])assert.ok(all.indexOf('data-block="'+task+'"')<all.indexOf('data-block="'+table+'"'),'Instructions precede recording table: '+task);
const coverage=JSON.parse(await fs.readFile(history+'/source-coverage.json','utf8'));
const ids=new Set(['opener','glossary','summary',...lesson.map(b=>b.id),...exercises.map(b=>b.id),...projects.map(b=>b.id)]);
assert.equal(coverage.points.length,38);
for(const p of [...coverage.points,...(coverage.additions||[]),...coverage.corrections])for(const id of p.targets)assert.ok(ids.has(id),'Valid coverage link '+id);
const map=JSON.parse(await fs.readFile(history+'/page-map.json','utf8'));
for(const p of map){assert.ok(p.end<=1415,'No footer clipping');for(const b of (p.blocks||[]).filter(b=>b.type==='heading'))assert.ok(p.end-b.bottom>=160,'Heading has five lines: '+b.id);}
assert.ok(!/____|textLength=|lengthAdjust=|--head|--tail|style=/.test(all),'No writing lines, stretched type, split panels or inline style');
const assets=JSON.parse(await fs.readFile(history+'/artwork.json','utf8'));assert.equal(assets.length,6);
for(const a of assets){assert.equal(createHash('sha256').update(await fs.readFile(a.file)).digest('hex'),a.sha256);assert.ok(all.includes(a.file));}
for(const m of all.matchAll(/<image\b[^>]*href="([^"]+)"/g)){assert.ok(m[1].endsWith('.png')&&m[1].includes('/class-7/science/ch06/'));await fs.access(path.resolve('build/class-7',m[1]));}
const audit=JSON.parse(await fs.readFile(history+'/render-audit.json','utf8'));
const lessonPages=audit.pages.slice(1,map.findIndex(p=>p.title==='Keywords'));
for(const p of lessonPages)if(p.occupiedPercent<88)assert.ok(p.shortPageException?.protectedGroup.length||(map[p.page-1].breakReason==='End of lesson before reference pages'&&map[p.page-1].protectedNext===null&&map[p.page]?.title==='Keywords'),'Short page explained: '+p.page);
const mean=lessonPages.reduce((a,p)=>a+p.occupiedPercent,0)/lessonPages.length;
assert.ok(mean>=88,'Mean occupied lesson height');
await fs.writeFile(history+'/occupancy-summary.json',JSON.stringify({meanLessonOccupancy:mean,shortPages:lessonPages.filter(p=>p.occupiedPercent<88).map(p=>({page:p.page,occupiedPercent:p.occupiedPercent,...(map[p.page-1].protectedNext===null?{reason:'Lesson ends before the dedicated glossary and summary; do not merge the reference sequence into the lesson.'}:p.shortPageException)}))},null,2));
console.log(`Chapter 6 checks passed: ${files.length} pages, all 4 source activities, 10 questions, 3 projects, 6 transparent assets. Mean lesson occupancy ${mean.toFixed(1)}%.`);
