import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {opener,lesson,glossary,summary,games,exercises,projects} from './science-g6-ch09-content.mjs';
import {scienceContract} from './science-contract.mjs';
const dir='pages/class-6/ch09-methods-of-separation',history='assets/design-history/science-g6-ch09';
const files=(await fs.readdir(dir)).filter(f=>/^p\d+\.html$/.test(f)).sort();
const html=await Promise.all(files.map(f=>fs.readFile(dir+'/'+f,'utf8')));
const norm=s=>s.replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&quot;','"').replaceAll('*','').replace(/\s+/g,' ').trim();
const pages=html.map(s=>norm([...s.replace(/<text\b[^>]*class="[^"]*\bse-running\b[^"]*"[^>]*>[\s\S]*?<\/text>/g,'').matchAll(/<text\b[^>]*>[\s\S]*?<\/text>/g)].map(m=>m[0].replace(/<tspan\b[^>]*\bdy="[^"]*"[^>]*>/g,' ').replace(/<[^>]*>/g,'')).join(' ')));
const text=pages.join(' '),has=s=>assert.ok(text.includes(norm(s)),'Missing content: '+s);
const together=(id,strings)=>assert.ok(pages.some(p=>strings.filter(Boolean).every(s=>p.includes(norm(s)))),'Split protected content: '+id);
html.forEach((s,i)=>{scienceContract(files[i],s);assert.ok(s.includes(`data-folio="${i+1}"`));});
opener.forEach(has);glossary.flat().forEach(has);summary.forEach(has);
together('summary',summary);together('glossary',glossary.flat());
for(const b of [...lesson,...games]){
 for(const k of ['text','caption','note','heading','diagramCaption','figureCaption','title'])if(b[k])has(b[k]);
 for(const s of [...(b.paragraphs||[]),...(b.rows||[]).flat()])has(s);
 if(b.paragraphs)together(b.id,b.paragraphs);
 if(b.type==='table')together(b.id,[b.caption,...b.rows.flat(),b.note]);
}
for(const q of exercises){const parts=[q.text,q.caption];if(q.table)parts.push(q.table.caption,...q.table.rows.flat(),q.table.note);parts.filter(Boolean).forEach(has);together(q.id,parts);}
for(const p of projects){const parts=[p.title,p.text,p.caption];parts.filter(Boolean).forEach(has);together(p.id,parts);}
assert.deepEqual(lesson.filter(b=>b.sourceActivity).map(b=>b.sourceActivity),Array.from({length:6},(_,i)=>'9.'+(i+1)));
assert.equal(exercises.length,10);assert.equal(projects.length,6);assert.equal(glossary.length,16);assert.equal(summary.length,10);
assert.equal(lesson.find(b=>b.id==='purpose-cards').rows.length-1,10);
assert.equal(games.find(b=>b.id==='fish-cards').rows.length-1,11);
for(const [task,evidence] of [['air-task','winnowing'],['salt-art-task','salt-art-evidence'],['heat-task','heat-evidence'],['filter-task','filter-results'],['design-task','design-evidence']])assert.ok(lesson.findIndex(b=>b.id===task)<lesson.findIndex(b=>b.id===evidence));
for(const phrase of ['Ordinary filter paper does not remove dissolved common salt','not necessarily safe drinking water','not every metal is strongly attracted','Churning cream or suitable curd produces butter','do not assume cooking will make it safe']){
 if(phrase==='do not assume cooking will make it safe')has('do not taste it or assume cooking will make it safe');
 else if(phrase.startsWith('not every'))has('Not every metal is strongly attracted');
 else has(phrase);
}
for(const id of ['heat-task','filter-task'])assert.ok(lesson.find(b=>b.id===id).figure,'Apparatus belongs with its activity');
assert.ok(exercises[1].text.includes('butter from cream or suitable curd'),'Churning question must not confuse cream separation with butter making');
assert.ok(exercises[9].table.note.includes('boiling cannot remove every harmful chemical'),'Water story must not guarantee drinking safety');
const pairs=games.find(b=>b.id==='fish-cards').rows.slice(1);
assert.deepEqual(pairs.map(r=>r[0]),['Filtration','Decantation','Condensation','Handpicking','Churning','Evaporation','Winnowing','Sedimentation','Sieving','Threshing','Magnetic separation']);
const map=JSON.parse(await fs.readFile(history+'/page-map.json','utf8'));assert.equal(map.length,files.length);
for(const p of map){assert.ok(p.end<=1415);for(const b of (p.blocks||[]).filter(b=>b.type==='heading'))assert.ok(p.end-b.bottom>=160);}
const audit=JSON.parse(await fs.readFile(history+'/render-audit.json','utf8'));assert.equal(audit.pages.length,files.length);
for(const p of audit.pages){assert.equal(p.collisions.length,0);assert.equal(p.escapedPanels.length,0);assert.ok(p.contentBounds.bottom<=1415);}
for(const a of JSON.parse(await fs.readFile(history+'/artwork.json','utf8'))){assert.equal(createHash('sha256').update(await fs.readFile(a.file)).digest('hex'),a.sha256);assert.ok(html.join('').includes(a.file));assert.ok(a.transparentPercent>10);}
const coverage=JSON.parse(await fs.readFile(history+'/source-coverage.json','utf8'));
const ids=new Set(['opener','glossary','summary',...lesson.map(b=>b.id),...games.map(b=>b.id),...exercises.map(q=>q.id),...projects.map(p=>p.id)]);
for(const p of [...coverage.points,...coverage.corrections])for(const id of p.targets)assert.ok(ids.has(id),'Unknown source target '+id);
assert.ok(coverage.points.every(p=>p.targets.length));
assert.ok(!/textLength=|lengthAdjust=|--head|--tail|style=/.test(html.join('')));
const cfg=JSON.parse(await fs.readFile(dir+'/chapter.json','utf8'));assert.equal(cfg.subject,'Science');assert.equal(cfg.edition,'science-tall');
console.log(`Chapter 9 passed: ${files.length} pages; all 6 source activities, 10 questions, 6 extensions and 11 game matches; complete content and rendered bounds verified.`);
