import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {opener,lesson,glossary,summary,games,exercises,projects,closing} from './science-g6-ch12-content.mjs';
import {scienceContract} from './science-contract.mjs';
const dir='pages/class-6/ch12-beyond-earth',history='assets/design-history/science-g6-ch12';
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
assert.deepEqual(lesson.filter(b=>b.sourceActivity).map(b=>b.sourceActivity),['12.1','12.2','12.3','12.4']);
assert.equal(exercises.length,11);assert.equal(projects.length,5);assert.equal(glossary.length,16);assert.equal(summary.length,10);
closing.paragraphs.forEach(has);has(closing.title);together('closing',closing.paragraphs);
for(const [task,evidence] of [['pattern-task','patterns'],['pole-task','pole-explain'],['orion-task','observation'],['venus-task','twinkling']])assert.ok(lesson.findIndex(b=>b.id===task)<lesson.findIndex(b=>b.id===evidence));
for(const phrase of ['about 27.3 days','about 29.5 days','southern high-latitude region','not physical walls','No life beyond Earth has yet been confirmed','not a certain test','simulated clear night'])has(phrase);
const {chapterDiagram,catalogue,dipperStars,winterStars}=await import('./science-g6-ch12-diagrams.mjs');
for(const kind of ['dippers','winter']){
 const reference=chapterDiagram(kind).html,question=chapterDiagram(kind+'-question').html;
 const circles=x=>[...x.matchAll(/<circle[^>]*data-star-hr=[^>]*>/g)].map(m=>m[0]);
 assert.deepEqual(circles(reference),circles(question),'Exercise must reuse reference star positions and sizes');
 assert.equal(circles(reference).length,14);assert.ok(!question.includes('<path'),'Exercise must not expose guide lines');
 for(const hr of kind==='dippers'?dipperStars:winterStars){const star=catalogue.stars.find(s=>s.hr===hr);assert.ok(star&&star.raHours>=0&&star.raHours<24&&Math.abs(star.decDegrees)<=90&&Number.isFinite(star.magnitude));}
}
const idsInQuestion=exercises.filter(q=>q.diagram).map(q=>q.diagram);assert.deepEqual(idsInQuestion,['dippers-question','winter-question']);
const map=JSON.parse(await fs.readFile(history+'/page-map.json','utf8'));assert.equal(map.length,files.length);
for(const p of map){assert.ok(p.end<=1415);for(const b of (p.blocks||[]).filter(b=>b.type==='heading'))assert.ok(p.end-b.bottom>=160);}
const audit=JSON.parse(await fs.readFile(history+'/render-audit.json','utf8'));assert.equal(audit.pages.length,files.length);
for(const p of audit.pages){assert.equal(p.collisions.length,0);assert.equal(p.escapedPanels.length,0);assert.ok(p.contentBounds.bottom<=1415);}
for(const a of JSON.parse(await fs.readFile(history+'/artwork.json','utf8'))){assert.equal(createHash('sha256').update(await fs.readFile(a.file)).digest('hex'),a.sha256);assert.ok(html.join('').includes(a.file));assert.ok(a.transparentPercent>10);}
const coverage=JSON.parse(await fs.readFile(history+'/source-coverage.json','utf8'));
const ids=new Set(['opener','glossary','summary','closing',...lesson.map(b=>b.id),...games.map(b=>b.id),...exercises.map(q=>q.id),...projects.map(p=>p.id)]);
for(const p of [...coverage.points,...coverage.corrections])for(const id of p.targets)assert.ok(ids.has(id),'Unknown source target '+id);
assert.ok(coverage.points.every(p=>p.targets.length));
assert.deepEqual(coverage.points.map(p=>p.pdfPage),Array.from({length:23},(_,i)=>i+1));
assert.deepEqual(coverage.omissions.map(p=>p.pdfPage),[24]);
assert.ok(!/textLength=|lengthAdjust=|--head|--tail|style=/.test(html.join('')));
const cfg=JSON.parse(await fs.readFile(dir+'/chapter.json','utf8'));assert.equal(cfg.subject,'Science');assert.equal(cfg.edition,'science-tall');
console.log(`Chapter 12 passed: ${files.length} pages; all 4 source activities, 11 questions and 5 extensions; complete content and rendered bounds verified.`);
