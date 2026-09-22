import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {opener,lesson,glossary,summary,exercises,topicRelationships} from './science-g7-ch01-v2-content.mjs';
import {scienceContract} from './science-contract.mjs';

const chapter='class-7/ch01-ever-evolving-world-of-science-v2';
const dir='pages/'+chapter,history='assets/design-history/science-v2-g7-ch01';
const files=(await fs.readdir(dir)).filter(n=>/^p\d+\.html$/.test(n)).sort();
const htmls=await Promise.all(files.map(f=>fs.readFile(dir+'/'+f,'utf8')));
const norm=s=>s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/\*/g,'').replace(/\s+/g,' ').trim();
const extract=s=>norm([...s.replace(/<text\b[^>]*class="[^"]*\bse-running\b[^"]*"[^>]*>[\s\S]*?<\/text>/g,'').matchAll(/<text\b[^>]*>[\s\S]*?<\/text>/g)].map(m=>m[0].replace(/<tspan\b[^>]*\bdy="[^"]*"[^>]*>/g,' ').replace(/<[^>]*>/g,'')).join(' '));
const pageTexts=htmls.map(extract),text=pageTexts.join(' '),all=htmls.join('\n');
const contains=(s,why)=>assert.ok(text.includes(norm(s)),why||'Missing printed content: '+s);
assert.equal(files.length,10,'Reviewed ten-page illustrated extent');
htmls.forEach((s,i)=>{scienceContract(files[i],s);assert.ok(s.includes(`data-folio="${i+1}"`),'Continuous folios');});
opener.forEach(s=>assert.ok(pageTexts[0].includes(norm(s)),'Complete opener introduction'));
for(const b of lesson){
 if(b.text)contains(b.text,b.id);
 for(const p of b.paragraphs||[])contains(p,b.id);
 for(const col of b.columns||[]){contains(col.title);col.items.forEach(s=>contains(s));if(col.figureCaption)contains(col.figureCaption);}
 if(b.caption)contains(b.caption,b.id+' caption');
 if(b.type==='panel')assert.ok(pageTexts.some(s=>b.paragraphs.every(p=>s.includes(norm(p)))),'Whole bordered panel: '+b.id);
 if(b.type==='comparison')for(const c of b.columns)assert.ok(pageTexts.some(s=>[c.title,c.figureCaption,...c.items].filter(Boolean).every(p=>s.includes(norm(p)))),'Whole named topic, artwork caption and bullets: '+c.title);
}
glossary.flat().forEach(s=>contains(s));summary.forEach(s=>contains(s));exercises.forEach(s=>contains(s));
for(const [id,relationship] of Object.entries(topicRelationships)){
 const page=htmls.findIndex(s=>s.includes(`data-topic="${id}"`));
 assert.ok(page>=0,'Named teaching group: '+id);
 for(const relatedId of [relationship.gallery,...(relationship.explanations||[])].filter(Boolean)){
  const related=lesson.find(b=>b.id===relatedId);
  assert.ok(pageTexts[page].includes(norm(related.text||related.caption)),'Topic and related explanation/photo remain together: '+relatedId);
 }
}
assert.equal(glossary.length,6);assert.equal(summary.length,6);assert.equal(exercises.length,4);
assert.ok(pageTexts.at(-2).includes('Keywords')&&pageTexts.at(-2).includes('Summary'),'Combined reference page');
assert.ok(exercises.every(s=>pageTexts.at(-1).includes(norm(s))),'Four complete closing questions');
assert.equal((all.match(/data-feature="setup"/g)||[]).length,1,'One investigation');
assert.equal((all.match(/data-feature="think"/g)||[]).length,2,'Two thinking panels');
assert.deepEqual(lesson.filter(b=>b.sourceActivity).map(b=>b.sourceActivity),['1.1'],'Source activity retained');
assert.deepEqual(lesson.flatMap(b=>b.chapters||[]),[2,3,4,5,6,7,8,9,10,11,12],'Index order');
// Frozen source-specific expectations supplement retention of the mutable authoring model.
for(const s of ['Because the cat’s teeth were crooked.','Just add some milk.','Don’t panic, I have my towel.','• 42','Just make it half!','sharing a cake equally','shortening an essay','fitting something into an envelope','length of a dance song'])contains(s);
for(const s of ['Some are designed to be recharged','condensation','Organisms did not plan these changes','An imagined situation is not scientific evidence','Identify an assumption'])contains(s);
const task=lesson.find(b=>b.id==='plane-investigation').paragraphs.join(' ');
for(const s of ['identical sheets','same basic folds','both of B’s wingtips','same amount','same launcher','launch height and direction','clear indoor space','first touches the floor','Alternate A and B','three flights','Never aim at a person','launching has stopped'])assert.ok(task.includes(s),'Investigation requirement: '+s);
assert.ok(text.indexOf('Before launching, predict')<text.indexOf('With your teacher, make two paper planes'),'Prediction before test');
assert.ok(text.indexOf('With your teacher, make two paper planes')<text.indexOf('Suppose one plane travelled farther'),'Hypothetical interpretation follows test');
contains('make no clear difference');contains('distances for the two planes overlapped');
const coverage=JSON.parse(await fs.readFile(history+'/source-coverage.json','utf8'));
assert.equal(coverage.points.length,22,'Independent visible-source inventory');
const ids=new Set(['opener','glossary','summary','assessment',...lesson.map(b=>b.id)]);
for(const p of [...coverage.points,...coverage.additions]){assert.ok(p.targets.length);for(const id of p.targets)assert.ok(ids.has(id),'Coverage anchor: '+id);}
const map=JSON.parse(await fs.readFile(history+'/page-map.json','utf8'));
for(const p of map){assert.ok(p.end<=1415,'Footer clearance');const bs=p.blocks||[];for(const b of bs.filter(b=>b.type==='heading'))assert.ok(p.end-b.bottom>=160,'Heading has five lines or complete unit');}
assert.ok(!/____|textLength=|lengthAdjust=|--head|--tail|style=/.test(all),'No writing spaces, justified SVG text, divided panels or inline styles');
for(const m of all.matchAll(/<image\b[^>]*href="([^"]+)"/g)){assert.ok(m[1].includes('/class-7/science/ch01-v2/'),'Independent Class 7 asset');assert.ok(m[1].endsWith('.png'),'Every placed image is PNG');await fs.access(path.resolve('build/class-7',m[1]));}
const artworks=JSON.parse(await fs.readFile(history+'/artwork.json','utf8'));
for(const artwork of artworks)assert.equal(createHash('sha256').update(await fs.readFile(artwork.file)).digest('hex'),artwork.sha256,'Reviewed native artwork integrity');
const photos=JSON.parse(await fs.readFile(history+'/photographs.json','utf8'));
assert.equal(photos.length,14,'Fourteen supporting images cover the eleven topic groups');
const usedPhotos=[...all.matchAll(/<image\b[^>]*data-photo="([^"]+)"[^>]*>/g)];
assert.equal(usedPhotos.length,photos.length,'Every supporting image is printed exactly once');
for(const p of photos){
 assert.equal(createHash('sha256').update(await fs.readFile(p.file)).digest('hex'),p.sha256,'Vendored supporting-image integrity: '+p.key);
 const matches=usedPhotos.filter(m=>m[1]===p.key);assert.equal(matches.length,1,p.key);
 const attr=name=>Number(matches[0][0].match(new RegExp(`\\b${name}="([^"]+)"`))[1]);
 const ppi=25.4*1052/189/Math.min(attr('width')/p.pixels[0],attr('height')/p.pixels[1]);
 assert.ok(ppi>=300,'Supporting image below 300 ppi: '+p.key+' '+ppi);
 assert.ok(p.sourceURL.startsWith('https://commons.wikimedia.org/wiki/File:')&&p.license,'Traceable photographic source and licence');
}
assert.ok(!/v2-art-|ch01-v2\/runners\.png/.test(all),'Retired flat topic drawings and old runner assets are not printed');
assert.ok(!text.includes('Photograph credits'),'No printed photograph credits section');
const config=JSON.parse(await fs.readFile(dir+'/chapter.json','utf8'));
assert.equal(config.subject,'Science');assert.equal(config.title,'The Ever-Evolving World of Science');assert.equal(config.class,'7');assert.equal(config.edition,'science-tall');
const audit=JSON.parse(await fs.readFile(history+'/render-audit.json','utf8'));
assert.equal(audit.pages.length,files.length);
const body=audit.pages.slice(1,-2),mean=body.reduce((sum,p)=>sum+p.occupiedPercent,0)/body.length;
assert.ok(body.every(p=>p.occupiedPercent>=85),'No substantial unfinished lesson gap');
for(const p of body.filter(p=>p.occupiedPercent<88))assert.ok(p.shortPageException?.protectedGroup.length,'Documented complete topic/panel behind short page');
assert.ok(body.every(p=>p.occupiedPercent<=97),'Lesson pages retain footer breathing room');
assert.ok(audit.pages.every(p=>!p.collisions.length&&!p.escapedPanels.length),'Live text and panel bounds pass');
const visualKeys=lesson.flatMap(b=>[...(b.columns||[]).map(c=>c.art).filter(Boolean),...(b.type==='topic-figure'?[b.art]:[])]);
assert.deepEqual(visualKeys,['substances','circuit','materials','changes','heat-water','time','runners','plant','mirrors','light-water','earth-light'],'All restored visual references in teaching order');
for(const key of visualKeys)assert.ok(JSON.parse(await fs.readFile(history+'/illustration-coverage.json','utf8')).figures.some(f=>f.key===key),'Visual source ledger: '+key);
console.log(`Class 7 Science V2 Chapter 1: ${files.length} pages; 22 source points; 1 investigation; 2 thinking panels; 6 definitions; 6 summary points; 4 questions. Mean actual lesson occupancy ${mean.toFixed(1)}%.`);
