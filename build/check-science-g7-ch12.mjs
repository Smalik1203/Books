import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {opener,lesson,glossary,summary,exercises,projects} from './science-g7-ch12-content.mjs';
import {scienceContract} from './science-contract.mjs';
const dir='pages/class-7/ch12-earth-moon-sun',history='assets/design-history/science-g7-ch12';
const files=(await fs.readdir(dir)).filter(f=>/^p\d+\.html$/.test(f)).sort();
const html=await Promise.all(files.map(f=>fs.readFile(dir+'/'+f,'utf8')));
const norm=s=>s.replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&quot;','"').replaceAll('*','').replace(/\s+/g,' ').trim();
const pages=html.map(s=>norm([...s.replace(/<text\b[^>]*class="[^"]*\bse-running\b[^"]*"[^>]*>[\s\S]*?<\/text>/g,'').matchAll(/<text\b[^>]*>[\s\S]*?<\/text>/g)].map(m=>m[0].replace(/<tspan\b[^>]*\bdy="[^"]*"[^>]*>/g,' ').replace(/<[^>]*>/g,'')).join(' ')));
const text=pages.join(' '),has=s=>assert.ok(text.includes(norm(s)),'Missing content: '+s);
assert.equal(files.length,20);
html.forEach((s,i)=>{scienceContract(files[i],s);assert.ok(s.includes(`data-folio="${i+1}"`));assert.ok(/<image\b/.test(s),'Every page needs a raster image: '+files[i]);});
opener.forEach(has);glossary.flat().forEach(has);summary.forEach(has);
for(const b of lesson){
 for(const k of ['text','caption','note','heading','diagramCaption','figureCaption'])if(b[k])has(b[k]);
 for(const s of [...(b.paragraphs||[]),...(b.rows||[]).flat(),...(b.items||[])])has(s);
 if(b.type==='panel')assert.ok(pages.some(p=>b.paragraphs.every(s=>p.includes(norm(s)))),'Panel split: '+b.id);
 if(b.type==='table')assert.ok(pages.some(p=>[b.caption,...b.rows.flat()].every(s=>p.includes(norm(s)))),'Table split: '+b.id);
}
for(const q of exercises){has(q.text);if(q.caption)has(q.caption);assert.ok(pages.some(p=>p.includes(norm(q.text))),'Question split: '+q.id);}
for(const p of projects){[p.title,p.text,p.caption].forEach(has);assert.ok(pages.some(s=>s.includes(norm(p.text))&&s.includes(norm(p.caption))),'Project split: '+p.id);}
assert.deepEqual(lesson.filter(b=>b.sourceActivity).map(b=>b.sourceActivity),['12.1','12.2','12.3','12.4']);
assert.equal(exercises.length,12);assert.equal(projects.length,4);assert.equal(glossary.length,14);assert.equal(summary.length,7);
for(const [task,evidence] of [['turning-task','turning-evidence'],['globe-task','daynight-evidence'],['stars-task','pole-evidence'],['thumb-task','apparent-evidence']])assert.ok(lesson.findIndex(b=>b.id===task)<lesson.findIndex(b=>b.id===evidence));
assert.equal(lesson.filter(b=>b.comparisonTable).length,3);
for(const phrase of ['not overhead everywhere','does not lean towards the Sun at every position','about four minutes earlier','neither hemisphere is tilted towards','not to scale','ISO 12312-2','not require the observer to stand in a narrow track'])has(phrase);
const map=JSON.parse(await fs.readFile(history+'/page-map.json','utf8'));
for(const p of map){assert.ok(p.end<=1415);for(const b of (p.blocks||[]).filter(b=>b.type==='heading'))assert.ok(p.end-b.bottom>=160);}
const audit=JSON.parse(await fs.readFile(history+'/render-audit.json','utf8'));
for(const p of audit.pages){assert.equal(p.collisions.length,0);assert.equal(p.escapedPanels.length,0);assert.ok(p.contentBounds.bottom<=1415);}
const assets=JSON.parse(await fs.readFile(history+'/artwork.json','utf8'));
for(const a of assets){assert.equal(createHash('sha256').update(await fs.readFile(a.file)).digest('hex'),a.sha256);assert.ok(html.join('').includes(a.file));assert.ok(a.transparentPercent>10);}
const coverage=JSON.parse(await fs.readFile(history+'/source-coverage.json','utf8'));
const ids=new Set(['opener',...lesson.map(b=>b.id),...exercises.map(q=>q.id),...projects.map(p=>p.id)]);
for(const p of [...coverage.points,...coverage.corrections])for(const id of p.targets)assert.ok(ids.has(id));
assert.ok(!/textLength=|lengthAdjust=|--head|--tail|style=/.test(html.join('')));
const cfg=JSON.parse(await fs.readFile(dir+'/chapter.json','utf8'));assert.equal(cfg.subject,'Science');assert.equal(cfg.edition,'science-tall');
console.log('Chapter 12 passed: 20 illustrated pages, 4 investigations, all 12 source questions, 3 source projects plus the closing exploration, complete tables and panels.');
