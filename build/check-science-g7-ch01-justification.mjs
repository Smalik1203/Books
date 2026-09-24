// Inspect real font geometry, text preservation and the scope of the pilot.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
import {alignChapter1Figures} from './science-g7-ch01-figure-layout.mjs';
import {v2PanelHeading} from './science-v2-cues.mjs';
const chapter='class-7/ch01-ever-evolving-world-of-science-v2';
const history='assets/design-history/science-v2-g7-ch01/justification-pilot';
const before=JSON.parse(await fs.readFile(history+'/before.json','utf8'));
// The subsequent image-alignment pilot moves only figure/caption axes.
// Compare against those explicit adjustments; retain all prose/furniture guards.
for(const file of Object.keys(before))before[file]=alignChapter1Figures(before[file]).replace(v2PanelHeading('setup',113,39),v2PanelHeading('setup',113,39,{activityNumber:'1.1'}));
const edits=JSON.parse(await fs.readFile(history+'/wording.json','utf8'));
const explanationEdits=[
 {before:'From a candle to sunlight: heating connects everyday changes with water in nature. Observe flames only in a teacher-led demonstration.',after:'Observe flames only in a teacher-led demonstration.'},
 {before:'Sunlight illuminates one half of Earth. During a solar eclipse, the Moon lies between the Sun and Earth and its shadow falls on part of Earth. These photographs show separate views.',after:'Sunlight illuminates half of Earth. During a solar eclipse, the Moon lies between the Sun and Earth, casting a shadow on part of Earth.'}
];
edits.push(...explanationEdits);
edits.push(
 {before:'Relate a moving object’s distance to the time taken.',after:'Relate distance travelled to the time taken.'},
 {before:'A sundial uses shadows to track time.',after:'Shadows mark time on a sundial.'}
);
const untouched=JSON.parse(await fs.readFile(history+'/other-pages.json','utf8'));
// The user subsequently approved the same typography/table rollout for Class 7
// Science 2–12. Retain the historical guard for every other class and subject.
const rollout=[];
for(const dir of await fs.readdir('pages/class-7')){
 const config=await fs.readFile(`pages/class-7/${dir}/chapter.json`,'utf8').then(JSON.parse).catch(()=>null);
 if(config?.subject==='Science'&&+config.number>=2&&+config.number<=12)rollout.push(`pages/class-7/${dir}/`);
}
const unaffected=Object.entries(untouched).filter(([file])=>!rollout.some(prefix=>file.startsWith(prefix)));
for(const [file,hash] of unaffected)assert.equal(createHash('sha256').update(await fs.readFile(file)).digest('hex'),hash,'Unrelated page changed: '+file);
const built='build/'+chapter+'.html',probe='build/class-7/ch01-justification-audit.html';
const script=String.raw`<script>onload=async()=>{
 await document.fonts.ready;
 const before=BASELINE,edits=REVISIONS,rephrases=new Map(edits.map(e=>[e.before,e.after]));
 const resetAsProse=new Set(EXPLANATIONS.map(e=>e.before));
 const norm=s=>s.replace(/\s+/g,' ').trim();
 const prose=t=>norm([...t.children].length?[...t.children].map(r=>r.textContent).join(' '):t.textContent);
 const result={pages:[],errors:[],changed:[],maxEdgeError:0,justifiedLines:0};
 const fail=(page,message)=>result.errors.push({page,message});
 for(const page of document.querySelectorAll('.page--v2-g7-ch01')){
  const folio=page.dataset.folio,file='p'+folio.padStart(3,'0')+'.html';
  const old=new DOMParser().parseFromString(before[file],'text/html');
  // Four explicitly replaced closing illustrations have no printed captions.
  // Their distinct assets and per-page presence are checked by the chapter audit.
  const retained=el=>!el.closest('[data-page-illustration], [data-block^="answer-context-example-"], [data-block="question-evidence-comparison"], [data-block^="observation-record-example-"]');
  const a=[...old.querySelectorAll('text')].filter(retained),b=[...page.querySelectorAll('text')].filter(retained);
  if(a.length!==b.length)fail(file,'Text block count changed');
  a.forEach((t,i)=>{
   const n=b[i];if(!n)return;
   const oldText=prose(t),expected=rephrases.get(oldText)||oldText;
   if(prose(n)!==expected)fail(file,'Unexpected text change: '+oldText);
   if(prose(n)!==oldText)result.changed.push({page:file,before:oldText,after:prose(n)});
   const refittedTable=t.closest('[data-comparison-table], [data-topic="topics-8-9-0"]');
   if(!resetAsProse.has(oldText)&&!refittedTable){
    for(const attr of ['x','y','class'])if(t.getAttribute(attr)!==n.getAttribute(attr))fail(file,'Text geometry changed: '+oldText);
    if(t.children.length!==n.children.length)fail(file,'Line count changed: '+oldText);
   }else if(resetAsProse.has(oldText)&&!n.hasAttribute('data-prose-align'))fail(file,'Explanation still styled as a caption');
  });
  for(const tag of ['image','path','rect','line','circle','ellipse']){
   const attributes=e=>[...e.attributes].map(a=>[a.name,a.value]).sort();
   const retainedArt=e=>retained(e)&&!e.closest('[data-comparison-table]');
   if(JSON.stringify([...old.querySelectorAll('.science-sheet '+tag)].filter(retainedArt).map(attributes))!==JSON.stringify([...page.querySelectorAll('.science-sheet '+tag)].filter(retainedArt).map(attributes)))fail(file,'Changed artwork or furniture: '+tag);
  }
  let count=0;
  for(const line of page.querySelectorAll('[data-justify-width]')){
   const box=line.getBBox(),target=+line.getAttribute('x')+ +line.dataset.justifyWidth;
   const error=Math.abs(box.x+box.width-target);
   result.maxEdgeError=Math.max(result.maxEdgeError,error);
   if(error>2)fail(file,'Line misses the right edge by '+error.toFixed(3)+': '+line.textContent);
   if(!Number.isFinite(+line.dataset.spaceRatio)||+line.dataset.spaceRatio>3.4)fail(file,'Invalid or excessive word spacing: '+line.textContent);
   if(line.hasAttribute('data-paragraph-end'))fail(file,'Stretched final line');
   count++;
  }
  if(page.querySelector('[textLength],[lengthAdjust]'))fail(file,'Glyph or letter stretching');
  if(page.textContent.includes('\u00ad'))fail(file,'Soft hyphen inserted');
  result.justifiedLines+=count;result.pages.push({page:+folio,justifiedLines:count});
 }
 if(result.changed.length!==edits.length)fail('chapter','Not all reviewed rephrases were applied');
 document.title='JUSTIFY'+JSON.stringify(result);
};</script>`.replace('BASELINE',JSON.stringify(before)).replace('REVISIONS',JSON.stringify(edits)).replace('EXPLANATIONS',JSON.stringify(explanationEdits));
await fs.writeFile(probe,(await fs.readFile(built,'utf8')).replace('</head>',script+'</head>'));
let stdout;
try{({stdout}=await promisify(execFile)(process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--virtual-time-budget=10000','--dump-dom',pathToFileURL(path.resolve(probe)).href],{maxBuffer:32e6}));}finally{await fs.unlink(probe);}
const raw=stdout.match(/JUSTIFY(.*?)<\/title>/s)?.[1];assert.ok(raw,'No browser measurement result');
const report=JSON.parse(raw.replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>'));
report.unaffectedPages=unaffected.length;
await fs.writeFile(history+'/render-audit.json',JSON.stringify(report,null,2));
assert.equal(report.pages.length,11);assert.ok(report.justifiedLines>100);
assert.deepEqual(report.errors,[]);
console.log(`${report.pages.length} pages, ${report.justifiedLines} justified lines; maximum edge error ${report.maxEdgeError.toFixed(3)} units. Chapter 1 words/artwork and unrelated pages preserved.`);
