import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {opener,lesson,glossary,summary,exercises,projects} from './science-g6-ch08-content.mjs';
import {stateEdges,waterDiagram} from './science-g6-ch08-diagrams.mjs';
import {scienceContract} from './science-contract.mjs';
const dir='pages/class-6/ch08-states-of-water',history='assets/design-history/science-g6-ch08';
const files=(await fs.readdir(dir)).filter(f=>/^p\d+\.html$/.test(f)).sort();
const html=await Promise.all(files.map(f=>fs.readFile(dir+'/'+f,'utf8')));
const norm=s=>s.replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&quot;','"').replaceAll('*','').replace(/\s+/g,' ').trim();
const pages=html.map(s=>norm([...s.replace(/<g\b[^>]*data-page-illustration=[\s\S]*?<\/g>/g,'').replace(/<text\b[^>]*class="[^"]*\bse-running\b[^"]*"[^>]*>[\s\S]*?<\/text>/g,'').matchAll(/<text\b[^>]*>[\s\S]*?<\/text>/g)].map(m=>m[0].replace(/<tspan\b[^>]*\bdy="[^"]*"[^>]*>/g,' ').replace(/<[^>]*>/g,'')).join(' ')));
const text=pages.join(' '),has=s=>assert.ok(text.includes(norm(s)),'Missing content: '+s);
const together=(id,strings)=>assert.ok(pages.some(p=>strings.filter(Boolean).every(s=>p.includes(norm(s)))),'Split protected content: '+id);
html.forEach((s,i)=>{scienceContract(files[i],s);assert.ok(s.includes(`data-folio="${i+1}"`));});
opener.forEach(has);glossary.flat().forEach(has);summary.forEach(has);
together('summary',summary);together('glossary',glossary.flat());
for(const b of lesson){
 for(const k of ['text','caption','note','heading','diagramCaption','figureCaption'])if(b[k])has(b[k]);
 for(const s of [...(b.paragraphs||[]),...(b.rows||[]).flat()])has(s);
 if(b.paragraphs)together(b.id,b.paragraphs);
 if(b.type==='table')together(b.id,[b.caption,...b.rows.flat(),b.note]);
}
for(const q of exercises){const parts=[q.text,q.caption];if(q.table)parts.push(q.table.caption,...q.table.rows.flat(),q.table.note);parts.filter(Boolean).forEach(has);together(q.id,parts);}
for(const p of projects){const parts=[p.title,p.text,p.caption];parts.filter(Boolean).forEach(has);together(p.id,parts);}
assert.deepEqual(lesson.filter(b=>b.sourceActivity).map(b=>b.sourceActivity),Array.from({length:11},(_,i)=>'8.'+(i+1)));
assert.equal(lesson.filter(b=>b.kind==='setup').length,9);
assert.equal(exercises.length,10);assert.equal(projects.length,4);assert.equal(glossary.length,16);assert.equal(summary.length,10);
for(const [task,evidence] of [['ice-task','ice-evidence'],['plate-task','plate-evidence'],['cold-task','cold-evidence'],['mass-task','mass-evidence'],['states-task','states-table'],['state-map-task','state-map-explain'],['area-task','area-evidence'],['sun-task','rate-table'],['cooler-task','cooler-evidence'],['cloud-task','cloud-evidence'],['cycle-task','water-cycle']])assert.ok(lesson.findIndex(b=>b.id===task)<lesson.findIndex(b=>b.id===evidence));
for(const phrase of ['Water vapour is invisible','mass of the entire assembly','does not rule out a leak happening at the same time','Melting ice and changing temperature can alter the level','not a refrigerator','not simply larger liquid drops','Do not touch or collect drain sludge'])has(phrase);
assert.deepEqual(stateEdges.map(e=>[e.from,e.to,e.answer,e.energy]),[['solid','liquid','melting','gain'],['liquid','solid','freezing','release'],['liquid','gas','evaporation','gain'],['gas','liquid','condensation','release']]);
for(const key of ['state-map','game']){assert.ok(waterDiagram(key).h>0);assert.ok(html.join('').includes(`data-diagram="${key}"`));}
const map=JSON.parse(await fs.readFile(history+'/page-map.json','utf8'));assert.equal(map.length,files.length);
for(const p of map){assert.ok(p.end<=1415);for(const b of (p.blocks||[]).filter(b=>b.type==='heading'))assert.ok(p.end-b.bottom>=160);}
const audit=JSON.parse(await fs.readFile(history+'/render-audit.json','utf8'));assert.equal(audit.pages.length,files.length);
for(const p of audit.pages){assert.equal(p.collisions.length,0);assert.equal(p.escapedPanels.length,0);assert.ok(p.contentBounds.bottom<=1415);}
for(const a of JSON.parse(await fs.readFile(history+'/artwork.json','utf8'))){assert.equal(createHash('sha256').update(await fs.readFile(a.file)).digest('hex'),a.sha256);assert.ok(html.join('').includes(a.file));assert.ok(a.transparentPercent>10);}
const coverage=JSON.parse(await fs.readFile(history+'/source-coverage.json','utf8'));
const ids=new Set(['opener','glossary','summary',...lesson.map(b=>b.id),...exercises.map(q=>q.id),...projects.map(p=>p.id)]);
for(const p of [...coverage.points,...coverage.corrections])for(const id of p.targets)assert.ok(ids.has(id),'Unknown source target '+id);
assert.ok(coverage.points.every(p=>p.targets.length));
assert.ok(!/textLength=|lengthAdjust=|--head|--tail|style=/.test(html.join('')));
const cfg=JSON.parse(await fs.readFile(dir+'/chapter.json','utf8'));assert.equal(cfg.subject,'Science');assert.equal(cfg.edition,'science-tall');
console.log(`Chapter 8 passed: ${files.length} pages; all 11 source activities, 10 questions and 4 extensions; complete content, state-change map and rendered bounds verified.`);
