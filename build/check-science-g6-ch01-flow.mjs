// Guard text retention, complete illustrated topics and measured page geometry.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
const history='assets/design-history/science-g6-ch01-fitting';
const name='ch01-wonderful-world-of-science';
const before=JSON.parse(await fs.readFile(history+'/before.json','utf8'));
const baseline=Object.values(before).join('\n');
const built=await fs.readFile(`build/class-6/${name}.html`,'utf8');
const probe=String.raw`<script>onload=async()=>{
 await document.fonts.ready;
 const before=new DOMParser().parseFromString(BASELINE,'text/html');
 const words=root=>[...root.querySelectorAll('.g6-content')].map(el=>{
  const copy=el.cloneNode(true);
  copy.querySelectorAll('svg,.g6-art,figcaption,.g6-panel__title').forEach(e=>e.remove());
  copy.querySelectorAll('p,h2,h3,h4,li').forEach(e=>e.append(document.createTextNode(' ')));
  return copy.textContent.replace(/\s+/g,' ').trim();
 }).join(' ').replace(/\s+/g,' ').trim();
 const contentEqual=words(before)===words(document),errors=[],pages=[],panels=[];
 const associations=[
  ['g6-1-009','g6-1-010','g6-1-012','g6-1-011'],
  ['g6-1-013','g6-1-014','g6-1-016','g6-1-015'],
  ['g6-1-018','g6-1-019','g6-1-021','g6-1-020'],
  ['g6-1-026','g6-1-027','g6-1-028','g6-1-029'],
  ['g6-1-035','g6-1-036','g6-1-037'],
  ['g6-1-046-r0','g6-1-046-r1','g6-1-046-r2','g6-1-046-r3','g6-1-046-r4'],
  ['g6-1-047','g6-1-048','g6-1-049','g6-1-050','g6-1-051','g6-1-052','g6-1-053','g6-1-056'],
  ['g6-1-060','g6-1-061','g6-1-063','g6-1-065','g6-1-067','g6-1-062','g6-1-064','g6-1-066'],
  ['g6-1-080','g6-1-closing-scene']
 ];
 for(const ids of associations){
  const locations=ids.map(id=>document.querySelector('[data-block="'+id+'"]')?.closest('.page').dataset.folio);
  if(locations.some(p=>!p)||new Set(locations).size!==1)errors.push('Separated illustration/reference: '+ids.join(', '));
 }
 const originalPanels=[...before.querySelectorAll('.g6-panel')].map(e=>e.textContent.replace(/\s+/g,' ').trim());
 const finalPanels=[...document.querySelectorAll('.g6-panel')].map(e=>e.textContent.replace(/\s+/g,' ').trim());
 const originalImages=[...before.querySelectorAll('.g6-art image,.g6-art img')].map(e=>e.getAttribute('href')||e.getAttribute('src')).sort();
 const finalImages=[...document.querySelectorAll('.g6-art image,.g6-art img')].map(e=>e.getAttribute('href')||e.getAttribute('src')).sort();
 for(const src of originalImages)if(!finalImages.includes(src))errors.push('Missing native picture: '+src);
 for(const pg of document.querySelectorAll('.page--g6-modern')){
  const number=Number(pg.dataset.folio),frame=pg.querySelector('.g6-furniture').getBoundingClientRect(),u=frame.width/1052,body=pg.querySelector('.g6-content'),r=body.getBoundingClientRect();
  const bottom=Math.max(...[...body.children].map(e=>e.getBoundingClientRect().bottom));
  const end=(bottom-frame.top)/u,fill=(bottom-r.top)/(frame.top+1415*u-r.top)*100;
  pages.push({page:number,fill:+fill.toFixed(1),bottom:+end.toFixed(1)});
  if(end>1416||fill<91.5)errors.push('Page '+number+' fit: '+fill+' / '+end);
  for(const b of body.querySelectorAll(':scope > .g6-block--think')){
   const box=b.querySelector('.g6-panel').getBoundingClientRect(),outer=b.getBoundingClientRect();
   const previous=b.previousElementSibling,next=b.nextElementSibling;
   const above=previous?(box.top-previous.getBoundingClientRect().bottom)/u:null;
   const below=next?(next.getBoundingClientRect().top-box.bottom)/u:null;
   panels.push({page:number,above,below,internalTop:(box.top-outer.top)/u});
   if(Math.abs((above??(box.top-outer.top)/u)-32)>.2)errors.push('Think gap above p'+number+': '+above);
   if(below!==null&&Math.abs(below-32)>.2)errors.push('Think gap below p'+number+': '+below);
  }
  for(const e of body.querySelectorAll('p,h2,h3,.g6-panel')){
   const box=e.getBoundingClientRect();
   if(box.left<r.left-1||box.right>r.right+1)errors.push('Horizontal overflow p'+number);
   if(e.tagName==='P'&&/<\/?(?:em|strong)>/.test(e.textContent))errors.push('Printed HTML p'+number);
  }
 }
 document.body.textContent=JSON.stringify({contentEqual,panelsEqual:JSON.stringify(originalPanels)===JSON.stringify(finalPanels),pages,panels,associations,errors});
};</script>`.replace('BASELINE',JSON.stringify(baseline).replaceAll('</script','<\/script'));
const file=`build/class-6/${name}-flow-check.html`;
await fs.writeFile(file,built.replace('</body>',probe+'</body>'));
const {stdout}=await promisify(execFile)('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--virtual-time-budget=15000','--dump-dom',pathToFileURL(path.resolve(file)).href],{maxBuffer:8e6});
const report=JSON.parse(stdout.match(/<body[^>]*>([\s\S]*?)<\/body>/)[1].replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&'));
await fs.unlink(file);
await fs.writeFile(history+'/verification.json',JSON.stringify(report,null,2)+'\n');
assert.ok(report.contentEqual,'All reading text retained in original order');
assert.ok(report.panelsEqual,'Every original panel retained whole');
assert.deepEqual(report.errors,[]);
console.log(`${report.pages.length} pages: all reading text and panels retained; every page at least 92% full; equal 32-unit thinking-panel gaps; no overflow.`);
