// Chapter 3: protect the reviewed page joins, intact activities and transparent diary.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
const history='assets/design-history/science-g6-ch03-fitting';
const name='ch03-food-on-our-plate';
const before=Object.values(JSON.parse(await fs.readFile(history+'/before.json','utf8'))).join('\n');
const built=await fs.readFile(`build/class-6/${name}.html`,'utf8');
const script=String.raw`<script>onload=async()=>{
 await document.fonts.ready;
 const baseline=new DOMParser().parseFromString(BASELINE,'text/html'),errors=[],pages=[],spacing=[];
 const norm=s=>s.replace(/[^\p{L}\p{N}]/gu,'').toLowerCase();
 const panelText=e=>{const c=e.cloneNode(true);c.querySelectorAll('svg,figcaption').forEach(x=>x.remove());return norm(c.textContent);};
 const oldPanels=[...baseline.querySelectorAll('.g6-panel')].map(panelText);
 const newPanels=[...document.querySelectorAll('.g6-panel')].map(panelText);
 if(JSON.stringify(oldPanels)!==JSON.stringify(newPanels))errors.push('Activity/thinking panel wording or order changed');
 const associated=[['006','010'],['035','036'],['055','056'],['057','059','060'],['070','071','072-r0'],['079','080-r0'],['089','090-r0'],['098','099-paired'],['104','105-r0'],['144','145','146','147','148'],['149','150','151','152','153'],['155-r0','155-r1'],['156','157','158','159'],['165','166','167','168'],['171','173'],['180','181','182','183']];
 for(const ids of associated){
  const found=ids.map(id=>document.querySelector('[data-block="g6-3-'+id+'"]')?.closest('.page').dataset.folio);
  if(found.some(p=>!p)||new Set(found).size!==1)errors.push('Separated illustrated unit: '+ids.join(', '));
 }
 const digestive=document.querySelector('[data-block="g6-3-context-5-paired"]');
 const digestivePage=digestive?.closest('.page');
 for(const id of ['046','047','048','049','050'])if(!digestivePage?.querySelector('[data-block="g6-3-'+id+'"]'))errors.push('Digestive illustration separated from Section 3.2: '+id);
 if(digestivePage){
  const u=digestivePage.querySelector('.g6-furniture').getBoundingClientRect().width/1052;
  if(digestive.querySelector('.g6-art svg').getBoundingClientRect().height/u<400)errors.push('Digestive-system illustration reduced below reviewed size');
 }
 const diary=document.querySelector('[data-block="g6-3-010"]');
 if(!diary?.querySelector('.g6-panel--inline-reference image[href$="p002-diary-transparent.png"]'))errors.push('Transparent diary missing from instructions');
 for(const table of document.querySelectorAll('table')){
  const caption=table.caption?.textContent||'';
  if(!/Nutrients:|Crops and food|Changes in cooking/.test(caption))continue;
  for(const row of table.tBodies[0].rows)for(const [i,cell] of [...row.cells].entries()){
   if(i===0&&!/Changes in cooking/.test(caption))continue;
   if(!cell.querySelector('ul.g6-compare-points > li'))errors.push('Unbulleted comparison cell: '+caption);
  }
 }
 for(const page of document.querySelectorAll('.page--g6-modern')){
  const number=Number(page.dataset.folio),frame=page.querySelector('.g6-furniture').getBoundingClientRect(),u=frame.width/1052,body=page.querySelector('.g6-content'),r=body.getBoundingClientRect();
  const bottom=Math.max(...[...body.children].map(e=>e.getBoundingClientRect().bottom));
  const end=(bottom-frame.top)/u,fill=(bottom-r.top)/(frame.top+1415*u-r.top)*100;
  pages.push({page:number,fill:+fill.toFixed(1),end:+end.toFixed(1)});
  if(number>1&&number<=30&&Math.round(fill)<88)errors.push('Short page '+number+': '+fill);
  if(end>1416)errors.push('Overflow page '+number+': '+end);
  for(const b of body.querySelectorAll(':scope > .g6-block--think')){
   const box=b.querySelector('.g6-panel').getBoundingClientRect(),previous=b.previousElementSibling,next=b.nextElementSibling;
   const above=previous?(box.top-previous.getBoundingClientRect().bottom)/u:null;
   const below=next?(next.getBoundingClientRect().top-box.bottom)/u:null;
   spacing.push({page:number,above,below});
   if(above!==null&&Math.abs(above-32)>1||below!==null&&Math.abs(below-32)>1)errors.push('Unequal thinking gaps on page '+number);
  }
 }
 document.body.textContent=JSON.stringify({pages,spacing,panelCount:newPanels.length,errors});
};</script>`;
const probe=`build/class-6/${name}-flow-check.html`;
await fs.writeFile(probe,built.replace('</body>',script.replace('BASELINE',JSON.stringify(before).replaceAll('</script','<\\/script'))+'</body>'));
try{
 const {stdout}=await promisify(execFile)('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--virtual-time-budget=15000','--dump-dom',pathToFileURL(path.resolve(probe)).href],{maxBuffer:8e6});
 const match=stdout.match(/<body[^>]*>([\s\S]*?)<\/body>/);
 const result=JSON.parse(match[1].replaceAll('&quot;','"').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&'));
 await fs.writeFile(history+'/flow-check.json',JSON.stringify(result,null,2)+'\n');
 assert.deepEqual(result.errors,[]);
 console.log(`${result.pages.length} pages: intact panels, connected illustrations, comparison bullets, equal thinking gaps and verified page geometry.`);
}finally{await fs.unlink(probe);}
