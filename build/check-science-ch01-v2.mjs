import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {opener,lesson,glossary,summary,exercises} from './science-ch01-v2-content.mjs';
import {scienceContract} from './science-contract.mjs';
const dir='pages/class-6/ch01-wonderful-world-of-science-v2',history='assets/design-history/science-v2-ch01';
const files=(await fs.readdir(dir)).filter(n=>/^p\d+\.html$/.test(n)).sort();
const htmls=await Promise.all(files.map(f=>fs.readFile(dir+'/'+f,'utf8')));
const norm=s=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/\*/g,'').replace(/\s+/g,' ').trim();
const extract=s=>norm([...s.replace(/<text\b[^>]*class="[^"]*\bse-running\b[^"]*"[^>]*>[\s\S]*?<\/text>/g,'').matchAll(/<text\b[^>]*>[\s\S]*?<\/text>/g)].map(m=>m[0].replace(/<tspan\b[^>]*\bdy="[^"]*"[^>]*>/g,' ').replace(/<[^>]*>/g,'')).join(' '));
const pageTexts=htmls.map(extract),text=pageTexts.join(' '),all=htmls.join('\n');
const contains=(s,why)=>assert.ok(text.includes(norm(s)),why||'Missing printed content: '+s);
assert.equal(files.length,10,'Reviewed ten-page extent');
htmls.forEach((s,i)=>{scienceContract(files[i],s);assert.ok(s.includes(`data-folio="${i+1}"`),'Continuous folios');});
for(const s of opener)assert.ok(pageTexts[0].includes(norm(s)),'Opener retains its complete introduction');
for(const block of lesson){
 if(block.text)contains(block.text,block.id);
 for(const p of block.paragraphs||[])contains(p,block.id);
 for(const s of block.items||[])contains(s,block.id);
 for(const col of block.columns||[]){contains(col.title);col.items.forEach(s=>contains(s));}
 for(const row of block.rows||[])row.forEach(s=>contains(s));
 if(block.caption)contains(block.caption,block.id+' caption');
 if(block.note)contains(block.note,block.id+' note');
 if(block.type==='panel')assert.ok(pageTexts.some(s=>block.paragraphs.every(p=>s.includes(norm(p)))),'Complete bordered panel: '+block.id);
 if(block.type==='table')assert.ok(pageTexts.some(s=>[block.caption,block.note,...block.rows.flat()].every(t=>s.includes(norm(t)))),'Table, caption and explanation stay together');
}
for(const [term,meaning] of glossary){contains(term);contains(meaning);}
summary.forEach(s=>contains(s));exercises.forEach(s=>contains(s));
assert.ok(pageTexts.at(-2).includes('Keywords')&&pageTexts.at(-2).includes('Summary'),'Dedicated reference page');
assert.ok(exercises.every(s=>pageTexts.at(-1).includes(norm(s))),'Complete final assessment');
assert.equal((all.match(/data-feature="think"/g)||[]).length,3,'Three source reflection tasks');
assert.equal((all.match(/data-feature="setup"/g)||[]).length,2,'Two first-hand investigations');
assert.deepEqual(lesson.filter(b=>b.sourceActivity).map(b=>b.sourceActivity),['1.1','1.2','1.3'],'Original source activities retained in order');
const coverage=JSON.parse(await fs.readFile(history+'/source-coverage.json','utf8'));
assert.equal(coverage.points.length,20,'Independent source teaching-point inventory');
const ids=new Set(['opener',...lesson.map(b=>b.id)]);
for(const point of coverage.points){assert.ok(point.point&&point.sourcePages.length&&point.targets.length);for(const id of point.targets)assert.ok(ids.has(id),'Source coverage anchor exists: '+id);}
const map=JSON.parse(await fs.readFile(history+'/page-map.json','utf8'));
for(const p of map){assert.ok(p.end<=1415,'Content stays above the footer');const blocks=p.blocks||[];for(let i=0;i<blocks.length;i++)if(blocks[i].type==='heading')assert.ok(p.end-blocks[i].bottom>=160,'Heading has five lines or its complete explanatory unit');}
assert.ok(text.indexOf('Before testing, predict')<text.indexOf('If the folded strips repeatedly'),'Prediction and setup precede interpretation');
assert.ok(text.indexOf('Use two identical paper strips')<text.indexOf('If the folded strips repeatedly'),'No outcome in setup');
assert.ok(!/____|textLength=|lengthAdjust=|--head|--tail|style=/.test(all),'No writing spaces, justification, divided panels or inline styles');
for(const match of all.matchAll(/<image\b[^>]*href="([^"]+)"/g)){assert.ok(match[1].includes('/science/ch01-v2/'),'Independent Chapter 1 artwork');await fs.access(path.resolve('build/class-6',match[1]));}
const source=JSON.parse(await fs.readFile(history+'/source.json','utf8'));
for(const art of source.artwork){const bytes=await fs.readFile(art.file);assert.equal(createHash('sha256').update(bytes).digest('hex'),art.sha256,'Native source artwork preserved: '+art.file);}
const audit=JSON.parse(await fs.readFile(history+'/render-audit.json','utf8'));
assert.equal(audit.pages.length,files.length,'All final pages measured');
const lessons=audit.pages.slice(1,-2),mean=lessons.reduce((s,p)=>s+p.occupiedPercent,0)/lessons.length;
assert.ok(mean>=88,'Average actual lesson occupancy at least 88%');
assert.ok(lessons.every(p=>p.occupiedPercent>=85),'No large unfinished lesson gaps');
for(const p of lessons.filter(p=>p.occupiedPercent<88))assert.ok(p.shortPageException?.protectedGroup.length,'Documented protected group behind short page');
console.log(`Chapter 1 V2: ${files.length} pages, 20 source teaching points, 3 reflections, 2 investigations, 8 glossary entries, 8 summary points and 6 questions retained. Mean actual lesson occupancy ${mean.toFixed(1)}%.`);
