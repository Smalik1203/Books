import {materialThinkingPrompt} from './science-g6-ch04-fitting.mjs';
// Chapter 4: preserve complete investigations and their instructional pictures.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
const history='assets/design-history/science-g6-ch04-fitting',name='ch04-exploring-magnets';
const baseline=Object.values(JSON.parse(await fs.readFile(history+'/before.json','utf8'))).join('\n');
const built=await fs.readFile(`build/class-6/${name}.html`,'utf8');
const script=String.raw`<script>onload=async()=>{
 await document.fonts.ready;
 const old=new DOMParser().parseFromString(BASELINE,'text/html'),errors=[],pages=[],spacing=[];
 const revised=old.querySelector('[data-block="g6-4-036"] .g6-panel__body p');
 if(!revised||revised.textContent.trim()!=="Which materials in your table were non-magnetic?")errors.push('Missing original material thinking prompt');
 else revised.textContent=REVISED_PROMPT;
 const norm=s=>s.replace(/[^\p{L}\p{N}]/gu,'').toLowerCase();
 const panelText=e=>{const c=e.cloneNode(true);c.querySelectorAll('svg,figcaption').forEach(x=>x.remove());return norm(c.textContent);};
 const selector='.g6-panel:not(.g6-panel--glossary)';
 const before=[...old.querySelectorAll(selector)].map(panelText),after=[...document.querySelectorAll(selector)].map(panelText);
 if(JSON.stringify(before)!==JSON.stringify(after))errors.push('Activity/thinking panel wording or order changed');
 const samePage=ids=>{
  const found=ids.map(id=>document.querySelector('[data-block="g6-4-'+id+'"]')?.closest('.page').dataset.folio);
  if(found.some(p=>!p)||new Set(found).size!==1)errors.push('Separated illustrated unit: '+ids.join(', '));
 };
 for(const ids of [['017','018'],['048','049','053-1'],['052','053-0'],['072','context-12-paired','079'],['083','085-r0','context-14','085-r1'],['085-r2','085-r3'],['087','089','093-paired'],['117','118'],['120','121','context-18','122'],['127','context-22','128'],['129','131','132','133'],['150','151','152'],['183','184'],['190','191'],['192','193'],['196','197']])samePage(ids);
 for(const id of ['138','139','140','141'])samePage([id,'game-'+id]);
 if(document.querySelector('[data-block="g6-4-088"]'))errors.push('Redundant mechanism subheading restored');
 if(document.querySelector('[data-block="g6-4-009"]'))errors.push('Orphaned generic opener heading restored');
 for(const id of ['138','139','140','141']){
  const svg=document.querySelector('[data-block="g6-4-game-'+id+'"] .g6-art > svg');
  if(!svg||getComputedStyle(svg).overflow!=='hidden'||!svg.querySelector('clipPath rect')||!svg.querySelector('image[clip-path]'))errors.push('Unclipped game picture '+id);
 }
 for(const id of ['093','191','197']){
  const figure=document.querySelector('[data-block="g6-4-'+id+'"]');
  if(!figure?.querySelector('figcaption')||figure.querySelector('svg text'))errors.push('Caption scaled with picture '+id);
 }
 for(const id of ['032-r0','material-examples','105-r0']){
  const table=document.querySelector('[data-block="g6-4-'+id+'"] table');
  if(!table)errors.push('Missing comparison '+id);
  for(const td of table?.querySelectorAll('td')||[])if(!td.querySelector('ul.g6-compare-points > li'))errors.push('Unbulleted comparison '+id);
 }
 for(const page of document.querySelectorAll('.page--g6-modern')){
  const number=Number(page.dataset.folio),frame=page.querySelector('.g6-furniture').getBoundingClientRect(),u=frame.width/1052,body=page.querySelector('.g6-content'),r=body.getBoundingClientRect();
  const bottom=Math.max(...[...body.children].map(e=>e.getBoundingClientRect().bottom));
  const end=(bottom-frame.top)/u,fill=(bottom-r.top)/(frame.top+1415*u-r.top)*100;
  pages.push({page:number,fill:+fill.toFixed(1),end:+end.toFixed(1)});
  if(!page.hasAttribute('data-close')&&Math.round(fill)<88)errors.push('Short page '+number+': '+fill);
  if(end>1416)errors.push('Overflow page '+number+': '+end);
  for(const b of body.querySelectorAll(':scope > .g6-block--think')){
   const box=b.querySelector('.g6-panel').getBoundingClientRect(),previous=b.previousElementSibling,next=b.nextElementSibling;
   const above=previous?(box.top-previous.getBoundingClientRect().bottom)/u:null;
   const below=next?(next.getBoundingClientRect().top-box.bottom)/u:null;
   spacing.push({page:number,above,below});
   if(above!==null&&Math.abs(above-32)>1||below!==null&&Math.abs(below-32)>1)errors.push('Unequal thinking gaps on page '+number);
  }
 }
 document.body.textContent=JSON.stringify({pages,spacing,panelCount:after.length,errors});
};</script>`;
const probe=`build/class-6/${name}-flow-check.html`;
await fs.writeFile(probe,built.replace('</body>',script.replace('REVISED_PROMPT',JSON.stringify(materialThinkingPrompt)).replace('BASELINE',JSON.stringify(baseline).replaceAll('</script','<\\/script'))+'</body>'));
try{
 const {stdout}=await promisify(execFile)('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--virtual-time-budget=15000','--dump-dom',pathToFileURL(path.resolve(probe)).href],{maxBuffer:8e6});
 const match=stdout.match(/<body[^>]*>([\s\S]*?)<\/body>/);
 const result=JSON.parse(match[1].replaceAll('&quot;','"').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&'));
 await fs.writeFile(history+'/flow-check.json',JSON.stringify(result,null,2)+'\n');
 assert.deepEqual(result.errors,[]);
 console.log(result.pages.length+' pages: intact investigations, connected illustrations, comparison bullets, equal thinking gaps and verified geometry.');
}finally{await fs.unlink(probe);}
