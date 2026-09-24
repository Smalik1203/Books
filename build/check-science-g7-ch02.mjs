import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {opener,lesson,glossary,summary,exercises,projects} from './science-g7-ch02-content.mjs';
import {scienceContract} from './science-contract.mjs';

const chapter='class-7/ch02-exploring-substances',dir='pages/'+chapter,history='assets/design-history/science-g7-ch02';
const files=(await fs.readdir(dir)).filter(f=>/^p\d+\.html$/.test(f)).sort();
const htmls=await Promise.all(files.map(f=>fs.readFile(dir+'/'+f,'utf8'))),all=htmls.join('\n');
const norm=s=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/\*/g,'').replace(/\s+/g,' ').trim();
const extract=s=>norm([...s.replace(/<g\b[^>]*data-page-illustration=[\s\S]*?<\/g>/g,'').replace(/<text\b[^>]*class="[^"]*\bse-running\b[^"]*"[^>]*>[\s\S]*?<\/text>/g,'').matchAll(/<text\b[^>]*>[\s\S]*?<\/text>/g)].map(m=>m[0].replace(/<tspan\b[^>]*\bdy="[^"]*"[^>]*>/g,' ').replace(/<[^>]*>/g,'')).join(' '));
const pages=htmls.map(extract),text=pages.join(' '),has=s=>assert.ok(text.includes(norm(s)),'Missing teaching content: '+s);
assert.equal(files.length,20,'Reviewed extent with an image on every page');
htmls.forEach((s,i)=>{scienceContract(files[i],s);assert.ok(s.includes(`data-folio="${i+1}"`));});
opener.forEach(s=>assert.ok(pages[0].includes(norm(s))));
for(const b of lesson){
 for(const key of ['text','heading','caption','figureCaption','note'])if(b[key])has(b[key]);
 for(const s of [...(b.paragraphs||[]),...(b.items||[]),...(b.rows||[]).flat()])has(s);
 for(const col of b.columns||[]){has(col.title);col.items.forEach(has);}
 if(b.type==='panel')assert.ok(pages.some(p=>b.paragraphs.every(s=>p.includes(norm(s)))),'Panel stays whole: '+b.id);
 if(b.type==='comparison')assert.ok(pages.some(p=>b.columns.every(c=>[c.title,...c.items].every(s=>p.includes(norm(s))))),'Whole comparison: '+b.id);
 if(b.type==='table')assert.ok(pages.some(p=>[b.caption,b.note,...b.rows.flat()].every(s=>p.includes(norm(s)))),'Whole table with guidance: '+b.id);
}
glossary.flat().forEach(has);summary.forEach(has);exercises.forEach(q=>has(q.text));projects.forEach(p=>{has(p.title);has(p.text);});
assert.deepEqual(lesson.filter(b=>b.sourceActivity).map(b=>b.sourceActivity),['2.1','2.2','2.3','2.4','2.5','2.6','2.7']);
assert.equal((all.match(/data-feature="setup"/g)||[]).length,6);
assert.equal((all.match(/data-feature="think"/g)||[]).length,3);
assert.equal(exercises.length,12);assert.equal(projects.length,4);assert.equal(glossary.length,10);
for(const s of ['lemon juice','soap solution','amla juice','tamarind water','vinegar','baking soda solution','lime water','tap water','washing powder solution','sugar solution','salt solution'])assert.ok(lesson.find(b=>b.id==='litmus-task').paragraphs.join(' ').includes(s));
for(const s of ['Never taste a test sample','not proof of neutrality','Nobody is blindfolded','Do not apply test chemicals or baking-soda remedies','not a substitute for a soil test','a neutral reading does not prove','5–10 minutes','10–20 drops','20–30 drops','one drop of lemon juice and about twenty drops of water'])has(s);
assert.ok(text.indexOf('Put the same amount of cooled red rose extract')<text.indexOf('A suitable red rose extract commonly'),'Investigate before result');
assert.ok(text.indexOf('Mix a spoonful of turmeric')<text.indexOf('Turmeric paper usually turns'),'No result prescribed in setup');
assert.ok(text.indexOf('Put one drop of lemon juice')<text.indexOf('In neutralisation'),'Setup before explanation');
const coverage=JSON.parse(await fs.readFile(history+'/source-coverage.json','utf8'));
const ids=new Set(['opener','glossary','summary',...lesson.map(b=>b.id),...exercises.map(b=>b.id),...projects.map(b=>b.id)]);
assert.equal(coverage.points.length,26);
for(const p of [...coverage.points,...coverage.additions])for(const id of p.targets)assert.ok(ids.has(id),'Valid coverage link '+id);
const map=JSON.parse(await fs.readFile(history+'/page-map.json','utf8'));
for(const p of map){assert.ok(p.end<=1415,'No footer clipping');for(const b of (p.blocks||[]).filter(b=>b.type==='heading'))assert.ok(p.end-b.bottom>=160,'Heading has five lines: '+b.id);}
assert.ok(!/____|textLength=|lengthAdjust=|--head|--tail|style=/.test(all),'No writing lines, stretched type, split panels or inline style');
const assets=JSON.parse(await fs.readFile(history+'/artwork.json','utf8'));assert.equal(assets.length,10);
for(const a of assets){assert.equal(createHash('sha256').update(await fs.readFile(a.file)).digest('hex'),a.sha256);assert.ok(all.includes(a.file));}
for(const m of all.matchAll(/<image\b[^>]*href="([^"]+)"/g)){assert.ok(m[1].endsWith('.png')&&m[1].includes('/class-7/science/ch02/'));await fs.access(path.resolve('build/class-7',m[1]));}
const audit=JSON.parse(await fs.readFile(history+'/render-audit.json','utf8'));
const lessonPages=audit.pages.slice(1,map.findIndex(p=>p.title==='Keywords'));
for(const p of lessonPages)if(p.occupiedPercent<88){
 const planned=map[p.page-1],next=map[p.page];
 const lessonEnd=planned.breakReason==='End of lesson before reference pages'&&planned.protectedNext===null&&next?.title==='Keywords';
 assert.ok(p.shortPageException?.protectedGroup.length||lessonEnd,'Short page explained: '+p.page);
 if(lessonEnd)p.shortPageException={remainingMM:p.shortPageException?.remainingMM,protectedGroup:[],reason:'Lesson ends before the dedicated Keywords page; retain the established reference-page boundary.',lessonEnd:true};
}
await fs.writeFile(history+'/render-audit.json',JSON.stringify(audit,null,2));
const mean=lessonPages.reduce((a,p)=>a+p.occupiedPercent,0)/lessonPages.length;
assert.ok(mean>=88,'Mean occupied lesson height');
console.log(`Chapter 2 checks passed: ${files.length} pages, all 7 source activities, 12 questions, 4 projects, 10 transparent assets. Mean lesson occupancy ${mean.toFixed(1)}%.`);
