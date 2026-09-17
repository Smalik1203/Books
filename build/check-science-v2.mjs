import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {scienceContract} from './science-contract.mjs';
const dir='pages/class-6/ch02-diversity-in-the-living-world-v2';
const names=(await fs.readdir(dir)).filter(n=>/^p\d+\.html$/.test(n)).sort();
const htmls=await Promise.all(names.map(n=>fs.readFile(dir+'/'+n,'utf8')));
const extract=s=>[...s.matchAll(/<text\b[^>]*>[\s\S]*?<\/text>/g)].map(m=>m[0].replace(/<tspan\b[^>]*\bdy="[^"]*"[^>]*>/g,' ').replace(/<[^>]*>/g,'')).join('\n');
const norm=s=>s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/\*/g,'').replace(/\s+/g,' ').trim();
const text=norm(htmls.map(extract).join('\n'));
assert.ok(!/SCIENCE FIELD JOURNAL/i.test(text),'No invented field-journal branding');
assert.ok(htmls.every(s=>!s.includes('class="v2-accent"')&&!s.includes('class="v2-green"')),'No decorative dashes or full-width heading bars');
const headingTexts=htmls.flatMap(s=>[...s.matchAll(/<text class="(?:v2-title|se-heading)"[^>]*>[\s\S]*?<\/text>/g)].map(m=>norm(extract(m[0]))));
for(const retired of ['Read the field records','A record is evidence','A Grouping Needs a Clear Rule','Herbs, Shrubs and Trees','Two Patterns','Two Kinds of Root','The Two Go Together','Compare the evidence','Continue the investigation','What Movement Tells Us','Built for the Place','Put your ideas to work','A Pattern Appears','One tree, several relationships']){
 assert.ok(!headingTexts.includes(retired),'No page-driven heading: '+retired);
}
assert.equal(headingTexts.filter(s=>s==='What Is Inside a Seed').length,1,'Seed topic starts once');
assert.ok(text.indexOf('What Is Inside a Seed')<text.indexOf('Soak a few chana seeds'),'Seed heading belongs before its investigation');
assert.ok(headingTexts.includes('2.2.2 Grouping Animals'),'Real topic transition retained inside the lesson');
const majorHeads=htmls.flatMap(s=>[...s.matchAll(/<text class="v2-title"[^>]*>[\s\S]*?<\/text>/g)].map(m=>norm(extract(m[0]))));
assert.ok(majorHeads.every(s=>/^2\.\d\s/.test(s)||['Keywords','Summary','Let Us Enhance Our Learning','Learning Further'].includes(s)),'Large headings reserved for main sections and reference matter');
const atoms=JSON.parse(await fs.readFile('assets/design-history/science-v2/atoms.json','utf8'));
for(const atom of atoms.filter(a=>a.type==='body'||a.type==='panel'))assert.ok(text.includes(norm(atom.text)),'Missing reading content: '+atom.text.slice(0,85));
for(let i=0;i<htmls.length;i++){
 scienceContract(names[i],htmls[i]);
 assert.ok(htmls[i].includes('page--science-v2'),'V2 scoping');
 assert.ok(!htmls[i].includes('science/ch02/'),'No mutable V1 image references');
 assert.ok(!htmls[i].includes('science-botanical'),'Furniture remains scoped to V2');
 assert.ok(htmls[i].includes('class="v2-footer"'),'V1-inspired outer folio treatment on every page');
 assert.equal(htmls[i].includes('class="v2-header"'),i>0,'Leaf ribbon on lesson pages, not the chapter opener');
}
assert.equal((text.match(/Think It Through/g)||[]).length,2,'Two substantial thinking pauses');
assert.equal((text.match(/Before the visit, copy the headings of Tables 2.1 and 2.2/g)||[]).length,1,'No duplicate fieldwork directions');
assert.ok(text.includes('not itself proof of the cotyledon count'),'Anatomical evidence caveat');
assert.ok(text.includes('cotyledon number causes the other two'),'Association versus cause');
assert.ok(text.includes('A useful conclusion must account for both the evidence and its limits.'),'Conservation reasoning retained');
const map=JSON.parse(await fs.readFile('assets/design-history/science-v2/page-map.json','utf8'));
assert.equal(map.length,names.length,'Map matches files');
assert.ok(map.every(p=>p.end<=1415),'All body content inside page block');
const glossary=map.find(p=>p.title==='Keywords'),summary=map.find(p=>p.title==='Summary');
const lesson=map.filter(p=>p.page>1&&p.page<glossary.page);
assert.ok(lesson.every(p=>p.fill>=70),'No half-empty lesson pages left by source-page boundaries');
assert.ok(lesson.some(p=>p.sourcePages.length>1),'Related source pages actually flow together');
assert.ok(lesson.every(p=>p.breakReason),'Every remaining page break has a recorded content reason');
assert.equal(summary.page,glossary.page+1,'Dedicated consecutive reference pages');
assert.equal((extract(htmls[summary.page-1]).match(/•/g)||[]).length,12,'All summary points together');
assert.ok(htmls.some(s=>s.includes('root-setup-v2.png')),'Setup artwork installed');
assert.ok(htmls.some(s=>s.includes('forms-v2.png')),'New plant art installed');
assert.ok(norm(extract(htmls.find(s=>s.includes('ch02-v2/plants.png'))||'')).includes('They are enlarged by different amounts'),'Plant scale guidance stays with the plate');
assert.ok(htmls[0].includes('opener-v2.png'),'New opener installed');
assert.ok(!htmls[0].includes('v2-book-running'),'No running head on chapter opener');
const number=htmls[0].match(/<text class="v2-display-number[^"]*"[^>]* y="([^"]+)"[^>]*>2<\/text>/);
const lastTitle=[...htmls[0].matchAll(/<text class="v2-cover-title"[^>]* y="([^"]+)"/g)].at(-1);
assert.equal(number?.[1],lastTitle?.[1],'Chapter numeral and title form an aligned block');
console.log(`V2 checks passed: ${names.length} pages, full prose retention, science safeguards, reference pages and isolated assets.`);

assert.ok(htmls.some(s=>s.includes('tree-relationships.png')),'Tree relationships use labelled artwork');
assert.ok(htmls.some(s=>s.includes('leaf-sorting.png')),'Grouping uses a shared specimen set');
assert.ok(text.includes('Smooth: A, C') && text.includes('Toothed: B, D'),'Worked grouping preserves the visible leaf-edge comparison');
assert.ok(!text.includes('Fruits and fallen leaves') && !text.includes('A different question can require a different grouping.'),'Retired feature strips stay removed');
