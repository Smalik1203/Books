import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {opener,lesson,glossary,summary,games,exercises,projects} from './science-g6-ch11-content.mjs';
import {scienceContract} from './science-contract.mjs';
const dir='pages/class-6/ch11-natures-treasures',history='assets/design-history/science-g6-ch11';
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
assert.deepEqual(lesson.filter(b=>b.sourceActivity).map(b=>b.sourceActivity),Array.from({length:6},(_,i)=>'11.'+(i+1)));
assert.equal(exercises.length,16);assert.equal(projects.length,4);assert.equal(glossary.length,16);assert.equal(summary.length,10);
for(const [task,evidence] of [['breathing-task','air-mixture'],['pinwheel-task','wind-energy'],['water-task','water-results'],['soil-task','soil-evidence'],['transport-task','fossil-origin'],['daily-task','daily-evidence']])assert.ok(lesson.findIndex(b=>b.id===task)<lesson.findIndex(b=>b.id===evidence));
assert.equal(lesson.find(b=>b.id==='water-checklist').rows.length,8);
const all=html.join('');
for(const [gas,count] of [['nitrogen',78],['oxygen',21],['other',1]])assert.equal((all.match(new RegExp('data-air="'+gas+'"','g'))||[]).length,count);
for(const phrase of ['Water vapour is also present in ordinary air','fresh water is not automatically safe to drink','Soil is effectively non-renewable on human timescales','Do not hold your breath','Selected examples only'])has(phrase);
assert.ok(exercises[12].text.includes('stored electricity, gas supply and wind'));
assert.equal(exercises[13].diagram,'resources');
assert.ok(lesson.find(b=>b.id==='pinwheel-task').figure);
assert.ok(lesson.find(b=>b.id==='soil-task').figure);
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
console.log(`Chapter 11 passed: ${files.length} pages; all 6 source activities, 16 questions and 4 extensions; complete content and rendered bounds verified.`);
