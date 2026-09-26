// Guard text retention, complete illustrated topics and measured page geometry.
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
const history='assets/design-history/science-g6-ch02-fitting';
const name='ch02-diversity-in-the-living-world';
const before=JSON.parse(await fs.readFile(history+'/before.json','utf8'));
const baseline=Object.values(before).join('\n');
const built=await fs.readFile(`build/class-6/${name}.html`,'utf8');
const probe=String.raw`<script>onload=async()=>{
 await document.fonts.ready;
 const before=new DOMParser().parseFromString(BASELINE,'text/html');
 // These two editorial moves are explicit: introduce the definition before
 // its examples, and read the plant-comparison header row before its cells.
 for(const id of ['152','154','155'])before.querySelector('[data-block="g6-2-136"]').before(before.querySelector('[data-block="g6-2-'+id+'"]'));
 before.querySelector('[data-block="g6-2-154"]').remove(); // Reviewed redundant feature label.
 before.querySelector('[data-block="g6-2-139"]').before(before.querySelector('[data-block="g6-2-140"]'));
 const words=root=>[...root.querySelectorAll('.g6-content')].map(el=>{
  const copy=el.cloneNode(true);
  copy.querySelectorAll('svg,.g6-art,figcaption,.g6-panel__title').forEach(e=>e.remove());
  copy.querySelectorAll('p,h2,h3,h4,li,td,th,.g6-feature-label').forEach(e=>e.append(document.createTextNode(' ')));
  return copy.textContent.replace(/\s+/g,' ').trim();
 }).join(' ').replace(/\s+/g,' ').trim();
 const contentEqual=words(before)===words(document),errors=[],pages=[],panels=[];
 const associations=[
  ['g6-2-012','g6-2-013','g6-2-015'],
  ['g6-2-028','g6-2-029','g6-2-030','g6-2-031','g6-2-context-3'],
  ['g6-2-050','g6-2-051','g6-2-052','g6-2-053-r0'],
  ['g6-2-058','g6-2-059','g6-2-060','g6-2-061-r0'],
  ['g6-2-063','g6-2-064','g6-2-tendril-detail'],
  ['g6-2-069','g6-2-context-7'],
  ['g6-2-072','g6-2-073','g6-2-074'],
  ['g6-2-077','g6-2-078','g6-2-079','g6-2-context-8'],
  ['g6-2-085','g6-2-086','g6-2-087'],
  ['g6-2-091','g6-2-092','g6-2-context-10'],
  ['g6-2-144','g6-2-145','g6-2-147','g6-2-146','g6-2-148-r0'],
  ['g6-2-156','g6-2-159'],
  ['g6-2-120','g6-2-context-15'],
  ['g6-2-137','g6-2-plant-comparison'],
  ['g6-2-198','g6-2-199'],['g6-2-200','g6-2-201','g6-2-202'],
  ['g6-2-206','g6-2-207'],['g6-2-208','g6-2-209']
 ];
 for(const ids of associations){
  const locations=ids.map(id=>document.querySelector('[data-block="'+id+'"]')?.closest('.page').dataset.folio);
  if(locations.some(p=>!p)||new Set(locations).size!==1)errors.push('Separated illustration/reference: '+ids.join(', '));
 }
 const panelWords=e=>{const c=e.cloneNode(true);c.querySelectorAll('svg,figcaption').forEach(x=>x.remove());return c.textContent.replace(/\s+/g,' ').trim();};
 const originalPanels=[...before.querySelectorAll('.g6-panel')].map(panelWords);
 const finalPanels=[...document.querySelectorAll('.g6-panel')].map(panelWords);
 const originalImages=[...before.querySelectorAll('.g6-art image,.g6-art img')].map(e=>e.getAttribute('href')||e.getAttribute('src')).sort();
 const finalImages=[...document.querySelectorAll('.g6-art image,.g6-art img')].map(e=>e.getAttribute('href')||e.getAttribute('src')).sort();
 const referenceStart=Number(document.querySelector('[data-block="g6-2-182"]').closest('.page').dataset.folio);
 for(const src of originalImages)if(!finalImages.includes(src))errors.push('Missing native picture: '+src);
 for(const table of document.querySelectorAll('table')){
  if(!/^Compar/.test(table.caption?.textContent||'')&&!table.closest('[data-block="g6-2-plant-comparison"]'))continue;
  for(const row of table.tBodies[0].rows)for(const [i,cell] of [...row.cells].entries()){
   if(table.closest('[data-block="g6-2-113"]')&&i===0)continue;
   if(!cell.querySelector(':scope > ul.g6-compare-points > li'))errors.push('Comparison missing bullet points');
  }
 }
 for(const pg of document.querySelectorAll('.page--g6-modern')){
  const number=Number(pg.dataset.folio),frame=pg.querySelector('.g6-furniture').getBoundingClientRect(),u=frame.width/1052,body=pg.querySelector('.g6-content'),r=body.getBoundingClientRect();
  const bottom=Math.max(...[...body.children].map(e=>e.getBoundingClientRect().bottom));
  const end=(bottom-frame.top)/u,fill=(bottom-r.top)/(frame.top+1415*u-r.top)*100;
  pages.push({page:number,fill:+fill.toFixed(1),bottom:+end.toFixed(1)});
  if(number>1&&number<referenceStart&&Math.round(fill)<88)errors.push('Underfilled lesson page '+number+': '+fill);
  if(end>1416)errors.push('Page '+number+' fit: '+fill+' / '+end);
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
 document.body.textContent=JSON.stringify({contentEqual,panelsEqual:JSON.stringify(originalPanels)===JSON.stringify(finalPanels),pages,panels,associations,errors,...(!contentEqual?{beforeText:words(before),afterText:words(document)}:{})});
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
console.log(`${report.pages.length} pages: all reading text and panels retained; illustration associations verified; equal 32-unit thinking-panel gaps; no overflow.`);
