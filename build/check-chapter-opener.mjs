// Actual font metrics and illustration gaps for the reusable opener variants.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
import assert from 'node:assert/strict';
import {chapterOpener} from './chapter-opener.mjs';
const cases=[
 {id:'short-title',number:7,titleLines:['Fractions']},
 {id:'botanical',number:2,titleLines:['Diversity in the','Living World'],motif:'leaf'},
 {id:'two-digit',number:10,titleLines:['The Other Side','of Zero']},
 {id:'three-lines',number:12,titleLines:['Methods of','Separation in','Everyday Life']},
 {id:'long-title',number:3,titleLines:['The Wonderful','World of Science']},
];
const frames=cases.map(c=>({...c,...chapterOpener({...c,bleed:17,image:{href:'../../figures/class-6/science/ch02-v2/opener-v2.png',aspect:1.5}})}));
assert.equal(new Set(frames.flatMap(f=>[...f.html.matchAll(/ id="([^"]+)"/g)].map(m=>m[1]))).size,cases.length,'Each chapter owns its gradient ID');
const dir='build/_opener-system-review';await fs.mkdir(dir,{recursive:true});
const file=path.resolve(dir,'variants.html');
const probe=String.raw`<script>onload=async()=>{
 await document.fonts.ready;const out=[];
 for(const svg of document.querySelectorAll('.science-sheet')){
  const inverse=svg.getScreenCTM().inverse(),box=e=>{const r=e.getBoundingClientRect(),a=new DOMPoint(r.left,r.top).matrixTransform(inverse),b=new DOMPoint(r.right,r.bottom).matrixTransform(inverse);return {left:a.x,top:a.y,right:b.x,bottom:b.y};};
  const band=box(svg.querySelector('.chapter-opener__band')),image=box(svg.querySelector('.chapter-opener__image')),titles=[...svg.querySelectorAll('.chapter-opener__title')];
  const canvas=document.createElement('canvas').getContext('2d');
  const ink=e=>{const s=getComputedStyle(e);canvas.font=s.fontStyle+' '+s.fontWeight+' '+s.fontSize+' '+s.fontFamily;const m=canvas.measureText(e.textContent),y=+e.getAttribute('y');return {...box(e),top:y-m.actualBoundingBoxAscent,bottom:y+m.actualBoundingBoxDescent};};
  const number=ink(svg.querySelector('.chapter-opener__number')),label=ink(svg.querySelector('.chapter-opener__label')),title=titles.map(ink);
  const limit=+svg.dataset.titleRight,errors=[];
  if(title.some(b=>b.left<284-.1||b.right>limit||b.top<40||b.bottom>band.bottom-30))errors.push('title overflow');
  if(number.left<89||number.right>213||number.top<label.bottom+12||number.bottom>band.bottom-30)errors.push('number/label collision');
  if(Math.abs(image.top-band.bottom-36)>.1||Math.abs(image.left-89)>.1||Math.abs(image.right-963)>.1)errors.push('image grid/gap');
  out.push({id:svg.dataset.case,errors});
 }
 document.title='OPENERCHECK'+JSON.stringify(out);
};</script>`;
await fs.writeFile(file,`<!doctype html><html><head><link rel="stylesheet" href="../../css/science-v2-fonts.css"><link rel="stylesheet" href="../../css/science-v2.css"><style>body{margin:0;background:#ddd}.sample{background:white;width:1052px;margin:24px auto}.science-sheet{display:block;width:1052px}</style>${probe}</head><body>${frames.map(f=>`<section class="page--science-v2 sample"><svg class="science-sheet" data-case="${f.id}" data-title-right="${f.layout.titleRight}" viewBox="0 0 1052 ${f.layout.height+45}">${f.html.replace(/<image[\s\S]*?<\/image>/,'<image class="chapter-opener__image" x="89" y="'+f.layout.imageBox.y+'" width="874" height="'+f.layout.imageBox.height+'"/>')}</svg></section>`).join('')}</body></html>`);
const {stdout}=await promisify(execFile)(process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--virtual-time-budget=12000','--dump-dom',pathToFileURL(file).href],{maxBuffer:8e6});
const report=JSON.parse(stdout.match(/<title>OPENERCHECK(.*?)<\/title>/s)[1]);
for(const result of report)assert.deepEqual(result.errors,[],result.id);
assert.equal(report.length,cases.length);
console.log('Reusable opener: five rendered cases passed, including one/three title lines, a two-digit number and optional motif.');
