import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {opener,lesson,glossary,summary,exercises,projects} from './science-g6-ch05-content.mjs';
import {scienceContract} from './science-contract.mjs';
const dir='pages/class-6/ch05-measurement-length-motion',history='assets/design-history/science-g6-ch05';
const files=(await fs.readdir(dir)).filter(f=>/^p\d+\.html$/.test(f)).sort();
const html=await Promise.all(files.map(f=>fs.readFile(dir+'/'+f,'utf8')));
const norm=s=>s.replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&quot;','"').replaceAll('*','').replace(/\s+/g,' ').trim();
const pages=html.map(s=>norm([...s.replace(/<g\b[^>]*data-page-illustration=[\s\S]*?<\/g>/g,'').replace(/<text\b[^>]*class="[^"]*\bse-running\b[^"]*"[^>]*>[\s\S]*?<\/text>/g,'').matchAll(/<text\b[^>]*>[\s\S]*?<\/text>/g)].map(m=>m[0].replace(/<tspan\b[^>]*\bdy="[^"]*"[^>]*>/g,' ').replace(/<[^>]*>/g,'')).join(' ')));
const text=pages.join(' '),has=s=>assert.ok(text.includes(norm(s)),'Missing content: '+s);
assert.equal(files.length,24,'Reviewed extent with an image on every page');
html.forEach((s,i)=>{scienceContract(files[i],s);assert.ok(s.includes(`data-folio="${i+1}"`));});
opener.forEach(has);glossary.flat().forEach(has);summary.forEach(has);
for(const b of lesson){
 for(const k of ['text','caption','note','heading','diagramCaption','figureCaption'])if(b[k])has(b[k]);
 for(const s of [...(b.paragraphs||[]),...(b.rows||[]).flat(),...(b.items||[])])has(s);
 if(b.type==='panel')assert.ok(pages.some(p=>b.paragraphs.every(s=>p.includes(norm(s)))),'Panel split: '+b.id);
 if(b.type==='table')assert.ok(pages.some(p=>[b.caption,...b.rows.flat()].every(s=>p.includes(norm(s)))),'Table split: '+b.id);
}
for(const q of exercises){has(q.text);if(q.caption)has(q.caption);assert.ok(pages.some(p=>p.includes(norm(q.text))),'Question split: '+q.id);}
for(const p of projects){[p.title,p.text,p.caption].forEach(has);assert.ok(pages.some(s=>s.includes(norm(p.text))&&s.includes(norm(p.caption))),'Project split: '+p.id);}
assert.deepEqual(lesson.filter(b=>b.sourceActivity).map(b=>b.sourceActivity),['5.1','5.2','5.3','5.4','5.5','5.6','5.7']);
assert.equal(exercises.length,13);assert.equal(projects.length,6);assert.equal(glossary.length,14);assert.equal(summary.length,7);
for(const [task,evidence] of [['measure-task','measurement-evidence'],['linear-task','linear-evidence'],['circle-task','circle-evidence'],['swing-task','oscillation'],['strip-task','strip-evidence']])assert.ok(lesson.findIndex(b=>b.id===task)<lesson.findIndex(b=>b.id===evidence));
assert.equal(lesson.filter(b=>b.comparisonTable).length,4);
for(const phrase of ['1 km = 1000 m','equal time intervals','subtract the starting reading','Count sheets','Do not attach a metal strip'])has(phrase);
const map=JSON.parse(await fs.readFile(history+'/page-map.json','utf8'));
for(const p of map){assert.ok(p.end<=1415);for(const b of (p.blocks||[]).filter(b=>b.type==='heading'))assert.ok(p.end-b.bottom>=160);}
const audit=JSON.parse(await fs.readFile(history+'/render-audit.json','utf8'));
for(const p of audit.pages){assert.equal(p.collisions.length,0);assert.equal(p.escapedPanels.length,0);assert.ok(p.contentBounds.bottom<=1415);}
const assets=JSON.parse(await fs.readFile(history+'/artwork.json','utf8'));
for(const a of assets){assert.equal(createHash('sha256').update(await fs.readFile(a.file)).digest('hex'),a.sha256);assert.ok(html.join('').includes(a.file));assert.ok(a.transparentPixels>0);}
const coverage=JSON.parse(await fs.readFile(history+'/source-coverage.json','utf8'));
const ids=new Set(['opener',...lesson.map(b=>b.id),...exercises.map(q=>q.id),...projects.map(p=>p.id)]);
for(const p of [...coverage.points,...coverage.corrections])for(const id of p.targets)assert.ok(ids.has(id));
assert.ok(!/textLength=|lengthAdjust=|--head|--tail|style=/.test(html.join('')));
const cfg=JSON.parse(await fs.readFile(dir+'/chapter.json','utf8'));assert.equal(cfg.subject,'Science');assert.equal(cfg.edition,'science-tall');
console.log('Chapter 5 passed: 24 pages, 7 investigations, all 13 source questions and 6 projects; complete tables, panels and measurement explanations.');
