import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {opener,lesson,glossary,summary,games,exercises,projects} from './science-g6-ch07-content.mjs';
import {scaleGeometry,temperatureDiagram} from './science-g6-ch07-diagrams.mjs';
import {scienceContract} from './science-contract.mjs';
const dir='pages/class-6/ch07-temperature-measurement',history='assets/design-history/science-g6-ch07';
const files=(await fs.readdir(dir)).filter(f=>/^p\d+\.html$/.test(f)).sort();
const html=await Promise.all(files.map(f=>fs.readFile(dir+'/'+f,'utf8')));
const norm=s=>s.replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&quot;','"').replaceAll('*','').replace(/\s+/g,' ').trim();
const pages=html.map(s=>norm([...s.replace(/<text\b[^>]*class="[^"]*\bse-running\b[^"]*"[^>]*>[\s\S]*?<\/text>/g,'').matchAll(/<text\b[^>]*>[\s\S]*?<\/text>/g)].map(m=>m[0].replace(/<tspan\b[^>]*\bdy="[^"]*"[^>]*>/g,' ').replace(/<[^>]*>/g,'')).join(' ')));
const text=pages.join(' '),has=s=>assert.ok(text.includes(norm(s)),'Missing content: '+s);
const together=(id,strings)=>assert.ok(pages.some(p=>strings.filter(Boolean).every(s=>p.includes(norm(s)))),'Split protected content: '+id);
html.forEach((s,i)=>{scienceContract(files[i],s);assert.ok(s.includes(`data-folio="${i+1}"`));});
opener.forEach(has);glossary.flat().forEach(has);summary.forEach(has);
together('summary',summary);together('glossary',glossary.flat());
for(const b of lesson){
 for(const k of ['text','caption','note','heading','diagramCaption','figureCaption'])if(b[k])has(b[k]);
 for(const s of [...(b.paragraphs||[]),...(b.rows||[]).flat()])has(s);
 if(b.type==='panel')together(b.id,b.paragraphs);
 if(b.type==='table')together(b.id,[b.caption,...b.rows.flat(),b.note]);
}
for(const q of exercises){const parts=[q.text,q.caption];if(q.table)parts.push(q.table.caption,...q.table.rows.flat(),q.table.note);parts.filter(Boolean).forEach(has);together(q.id,parts);}
for(const p of projects){const parts=[p.title,p.text,p.caption];parts.filter(Boolean).forEach(has);together(p.id,parts);}
assert.deepEqual(lesson.filter(b=>b.sourceActivity).map(b=>b.sourceActivity),['7.1','7.2','7.3','7.4','7.5','7.6','7.7']);
assert.equal(exercises.length,14);assert.equal(projects.length,4);assert.equal(glossary.length,16);assert.equal(summary.length,8);assert.equal(games.length,0);
for(const [task,evidence] of [['touch-task','touch-evidence'],['clinical-task','clinical-reference'],['range-task','range-evidence'],['division-task','division-equation'],['water-task','water-evidence'],['boiling-data-task','boiling-evidence'],['weather-task','weather-evidence']])assert.ok(lesson.findIndex(b=>b.id===task)<lesson.findIndex(b=>b.id===evidence));
for(const phrase of ['Count the spaces','read while the bulb remains','not enough to describe a place’s climate','Never share an oral thermometer','0.3 °C','without a degree sign'])has(phrase);
// These checks guard meaningful scientific outcomes, including endpoint counts.
const half=scaleGeometry(10,20,.5,17.5,400);assert.equal(half.ticks.length,21);assert.equal(half.level,300);
assert.equal(scaleGeometry(20,30,1,null,700).ticks.length,11);
assert.equal(scaleGeometry(-10,40,1,28,700).level,532);
assert.equal(scaleGeometry(25,30,.5,27.5,700).level,350);
assert.ok(scaleGeometry(20,30,.5,null,250).ticks.some(t=>t.value===22.5));
assert.ok(!scaleGeometry(20,30,1,null,250).ticks.some(t=>t.value===22.5));
assert.ok(!scaleGeometry(20,30,2,null,250).ticks.some(t=>t.value===22.5));
for(const key of ['structure','division','water','positions','blank-scales','read28','scale-choice','read275','room-water']){const d=temperatureDiagram(key);assert.ok(d.h>0);assert.ok(html.join('').includes(`data-diagram="${key}"`));}
const map=JSON.parse(await fs.readFile(history+'/page-map.json','utf8'));assert.equal(map.length,files.length);
for(const p of map){assert.ok(p.end<=1415);for(const b of (p.blocks||[]).filter(b=>b.type==='heading'))assert.ok(p.end-b.bottom>=160);}
const audit=JSON.parse(await fs.readFile(history+'/render-audit.json','utf8'));assert.equal(audit.pages.length,files.length);
for(const p of audit.pages){assert.equal(p.collisions.length,0);assert.equal(p.escapedPanels.length,0);assert.ok(p.contentBounds.bottom<=1415);}
for(const a of JSON.parse(await fs.readFile(history+'/artwork.json','utf8'))){assert.equal(createHash('sha256').update(await fs.readFile(a.file)).digest('hex'),a.sha256);assert.ok(html.join('').includes(a.file));assert.ok(a.transparentPercent>10);}
const coverage=JSON.parse(await fs.readFile(history+'/source-coverage.json','utf8'));
const ids=new Set(['opener',...lesson.map(b=>b.id),...exercises.map(q=>q.id),...projects.map(p=>p.id)]);
for(const p of [...coverage.points,...coverage.corrections])for(const id of p.targets)assert.ok(ids.has(id));
assert.ok(coverage.points.every(p=>p.targets.length));
assert.ok(!/textLength=|lengthAdjust=|--head|--tail|style=/.test(html.join('')));
const cfg=JSON.parse(await fs.readFile(dir+'/chapter.json','utf8'));assert.equal(cfg.subject,'Science');assert.equal(cfg.edition,'science-tall');
console.log(`Chapter 7 passed: ${files.length} pages; 7 activities, 14 questions, 4 projects; scientific scales, content retention, complete panels and rendered bounds verified.`);
