import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {opener,lesson,glossary,summary,games,exercises,projects} from './science-g6-ch06-content.mjs';
import {scienceContract} from './science-contract.mjs';
const dir='pages/class-6/ch06-materials-around-us',history='assets/design-history/science-g6-ch06';
const files=(await fs.readdir(dir)).filter(f=>/^p\d+\.html$/.test(f)).sort();
const html=await Promise.all(files.map(f=>fs.readFile(dir+'/'+f,'utf8')));
const norm=s=>s.replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&quot;','"').replaceAll('*','').replace(/\s+/g,' ').trim();
const pages=html.map(s=>norm([...s.replace(/<g\b[^>]*data-page-illustration=[\s\S]*?<\/g>/g,'').replace(/<text\b[^>]*class="[^"]*\bse-running\b[^"]*"[^>]*>[\s\S]*?<\/text>/g,'').matchAll(/<text\b[^>]*>[\s\S]*?<\/text>/g)].map(m=>m[0].replace(/<tspan\b[^>]*\bdy="[^"]*"[^>]*>/g,' ').replace(/<[^>]*>/g,'')).join(' ')));
const text=pages.join(' '),has=s=>assert.ok(text.includes(norm(s)),'Missing content: '+s);
const together=(id,strings)=>assert.ok(pages.some(p=>strings.every(s=>p.includes(norm(s)))),'Content split: '+id);
assert.equal(files.length,29,'Reviewed extent with enlarged painted diagrams and whole paragraphs');
html.forEach((s,i)=>{scienceContract(files[i],s);assert.ok(s.includes(`data-folio="${i+1}"`));});
opener.forEach(has);glossary.flat().forEach(has);summary.forEach(has);
together('summary',summary);together('glossary',glossary.flat());
for(const b of lesson){
 for(const k of ['text','caption','note','heading','diagramCaption','figureCaption'])if(b[k])has(b[k]);
 for(const s of [...(b.paragraphs||[]),...(b.rows||[]).flat(),...(b.items||[])])has(s);
 if(b.type==='panel')together(b.id,b.paragraphs);
 if(b.type==='table')together(b.id,[b.caption,...b.rows.flat(),b.note||'']);
 if(b.keepWhole)together(b.id,[b.text]);
}
for(const q of exercises){has(q.text);const parts=[q.text];if(q.table)parts.push(q.table.caption,...q.table.rows.flat(),q.table.note);parts.forEach(has);together(q.id,parts);}
for(const p of projects){[p.title,p.text,p.caption].forEach(has);together(p.id,[p.title,p.text,p.caption]);}
for(const g of games){[g.title,g.text].forEach(has);together(g.id,[g.title,g.text]);}
assert.deepEqual(lesson.filter(b=>b.sourceActivity).map(b=>b.sourceActivity),['6.1','6.2','6.3','6.4','6.5','6.6','6.7','6.8']);
assert.equal(lesson.filter(b=>b.kind==='setup').length,7);
assert.equal(exercises.length,10);assert.equal(games.length,2);assert.equal(projects.length,4);assert.equal(glossary.length,16);assert.equal(summary.length,8);
for(const [task,evidence] of [['identify-task','identify-evidence'],['group-task','group-evidence'],['bounce-task','bounce-evidence'],['hardness-task','hardness-evidence'],['light-task','light-evidence'],['dissolve-task','dissolve-evidence'],['mass-task','mass-evidence']])assert.ok(lesson.findIndex(b=>b.id===task)<lesson.findIndex(b=>b.id===evidence));
assert.equal(lesson.filter(b=>b.comparisonTable).length,7);
for(const phrase of ['does not isolate the effect of material alone','same length of time','does not measure air’s mass','1 L = 1000 mL','1 m³ = 1000 L','packet’s exact water quantity','six level teaspoons','half a level teaspoon','not a classroom tasting activity'])has(phrase);
const map=JSON.parse(await fs.readFile(history+'/page-map.json','utf8'));
assert.equal(map.length,files.length);
for(const p of map){assert.ok(p.end<=1415);for(const b of (p.blocks||[]).filter(b=>b.type==='heading'))assert.ok(p.end-b.bottom>=160);}
const audit=JSON.parse(await fs.readFile(history+'/render-audit.json','utf8'));
assert.equal(audit.pages.length,files.length);
for(const p of audit.pages){assert.equal(p.collisions.length,0);assert.equal(p.escapedPanels.length,0);assert.ok(p.contentBounds.bottom<=1415);}
const assets=JSON.parse(await fs.readFile(history+'/artwork.json','utf8'));
for(const a of assets){assert.equal(createHash('sha256').update(await fs.readFile(a.file)).digest('hex'),a.sha256);assert.ok(html.join('').includes(a.file));assert.ok(a.transparentPercent>10);}
const coverage=JSON.parse(await fs.readFile(history+'/source-coverage.json','utf8'));
const ids=new Set(['opener',...lesson.map(b=>b.id),...games.map(g=>g.id),...exercises.map(q=>q.id),...projects.map(p=>p.id)]);
for(const p of [...coverage.points,...coverage.corrections])for(const id of p.targets)assert.ok(ids.has(id));
assert.ok(!/textLength=|lengthAdjust=|--head|--tail|style=/.test(html.join('')));
const cfg=JSON.parse(await fs.readFile(dir+'/chapter.json','utf8'));assert.equal(cfg.subject,'Science');assert.equal(cfg.edition,'science-tall');
console.log(`Chapter 6 passed: ${files.length} pages, all 8 numbered activities, 2 games, 10 questions and 4 projects; complete definitions, summary, tables and panels.`);
