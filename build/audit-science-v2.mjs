// Rendered bounds supplement the compositor's allocated block heights.
// Run after building V2; the chapter's own edition supplies physical units.
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import assert from 'node:assert/strict';
import {sheetMetrics} from './sheet.mjs';
const run=promisify(execFile),chapter=process.argv[2]||'class-6/ch02-diversity-in-the-living-world-v2';
const history=process.argv[3]||'assets/design-history/science-v2';
const built=path.resolve('build',chapter+'.html'),mapFile=history+'/page-map.json';
const map=JSON.parse(await fs.readFile(mapFile,'utf8'));
const config=JSON.parse(await fs.readFile('pages/'+chapter+'/chapter.json','utf8'));
const metrics=await sheetMetrics(process.cwd(),config.edition);
assert.ok((await fs.stat(built)).mtimeMs>=(await fs.stat(mapFile)).mtimeMs,'Rebuild before measuring V2');
const probe=String.raw`<script>
onload=async()=>{
 await document.fonts.ready;
 const report=[];
 for(const svg of document.querySelectorAll('.science-sheet')){
  const inverse=svg.getScreenCTM().inverse();
  const box=el=>{
   const r=el.getBoundingClientRect(),a=new DOMPoint(r.left,r.top).matrixTransform(inverse),b=new DOMPoint(r.right,r.bottom).matrixTransform(inverse);
   const result={left:a.x,top:a.y,right:b.x,bottom:b.y};
   // A painted source can be placed through a cropped SVG viewport. Measure
   // its visible placement, not the unused pixels beyond the clipping frame.
   if(el.tagName==='image')for(let port=el.parentElement;port&&port!==svg;port=port.parentElement){
    if(port.tagName!=='svg'||getComputedStyle(port).overflow==='visible')continue;
    const matrix=inverse.multiply(port.parentElement.getScreenCTM()).multiply(port.transform.baseVal.consolidate()?.matrix||svg.createSVGMatrix());
    const x=port.x.baseVal.value,y=port.y.baseVal.value,w=port.width.baseVal.value,h=port.height.baseVal.value;
    const points=[[x,y],[x+w,y],[x,y+h],[x+w,y+h]].map(([px,py])=>new DOMPoint(px,py).matrixTransform(matrix));
    result.left=Math.max(result.left,Math.min(...points.map(p=>p.x)));result.right=Math.min(result.right,Math.max(...points.map(p=>p.x)));
    result.top=Math.max(result.top,Math.min(...points.map(p=>p.y)));result.bottom=Math.min(result.bottom,Math.max(...points.map(p=>p.y)));
   }
   return result;
  };
  const union=els=>{const b=els.map(box);return {left:Math.min(...b.map(b=>b.left)),top:Math.min(...b.map(b=>b.top)),right:Math.max(...b.map(b=>b.right)),bottom:Math.max(...b.map(b=>b.bottom))};};
  const content=[...svg.querySelectorAll('text,image,rect,line,path,ellipse')].filter(e=>!e.closest('.v2-header,.v2-footer'));
  const blocks=[...svg.querySelectorAll('.v2-reading-block')].map(e=>({id:e.dataset.block,...union([...e.querySelectorAll('text,image,rect,line,path,ellipse')])}));
  // SVG client boxes include the font's unused ascender/descender allowance.
  // Compare actual glyph ink at the measured baseline, not overlapping em boxes.
  const canvas=document.createElement('canvas').getContext('2d');
  const lines=content.filter(e=>e.tagName==='text').flatMap(e=>{const children=[...e.querySelectorAll(':scope > tspan')];return children.length?children:[e];}).map(e=>{
   const style=getComputedStyle(e);canvas.font=style.fontStyle+' '+style.fontWeight+' '+style.fontSize+' '+style.fontFamily;
   const metrics=canvas.measureText(e.textContent),start=e.getStartPositionOfChar(0),baseline=new DOMPoint(start.x,start.y).matrixTransform(inverse.multiply(e.getScreenCTM())).y;
   return {text:e.textContent,...box(e),top:baseline-metrics.actualBoundingBoxAscent,bottom:baseline+metrics.actualBoundingBoxDescent};
  });
  const collisions=[];
  for(let i=0;i<lines.length;i++)for(let j=i+1;j<lines.length;j++){
   const a=lines[i],b=lines[j],w=Math.min(a.right,b.right)-Math.max(a.left,b.left),h=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);
   if(w>2&&h>2)collisions.push([a.text,b.text]);
  }
  const escapedPanels=[];
  for(const panel of svg.querySelectorAll('.se-activity-panel,.se-thought-panel')){
   const b=box(panel),group=panel.closest('.v2-reading-block');
   for(const e of group.querySelectorAll('text')){const a=box(e);if(a.left<b.left||a.right>b.right||a.top<b.top||a.bottom>b.bottom)escapedPanels.push(e.textContent);}
  }
  const band=svg.querySelector('.chapter-opener__band');
  let opener;
  if(band){
   const bleed=svg.viewBox.baseVal.width*${metrics.bleed}/${metrics.trimW},width=svg.viewBox.baseVal.width;
   const text=[...svg.querySelectorAll('.chapter-opener__title,.chapter-opener__label,.chapter-opener__number')];
   const ink=text.map(e=>lines.find(l=>l.text===e.textContent));
   const number=svg.querySelector('.chapter-opener__number'),label=svg.querySelector('.chapter-opener__label'),titles=[...svg.querySelectorAll('.chapter-opener__title')];
   opener={bandBounds:box(band),textBounds:ink,bleedCovered:[-bleed,width/2,width+bleed].every(x=>[-bleed,0,266].every(y=>band.isPointInFill(new DOMPoint(x,y)))),safeText:ink.every(b=>b.left>=89&&b.right<=963&&b.top>=30&&b.bottom<=270),alignedBaseline:number.getAttribute('y')===titles.at(-1).getAttribute('y'),centredLabel:label.getAttribute('x')===number.getAttribute('x'),numberTitleGap:box(titles[0]).left-box(number).right,decorationGap:box(svg.querySelector('.chapter-opener__motif')).left-Math.max(...titles.map(e=>box(e).right))};
   const garden=box(svg.querySelector('image.science-illustration'));
   opener.headerImageGap=garden.top-Math.max(box(band).bottom,box(svg.querySelector('.chapter-opener__motif')).bottom);
   opener.imageIntroGap=box(svg.querySelector('.v2-intro')).top-garden.bottom;
   // Alignment belongs to the text origin; a serif glyph may overhang it.
   const intro=svg.querySelector('.v2-intro'),start=intro.getStartPositionOfChar(0);
   const introX=new DOMPoint(start.x,start.y).matrixTransform(inverse.multiply(intro.getScreenCTM())).x;
   opener.sharedReadingGrid=Math.abs(garden.left-89)<.1&&Math.abs(garden.right-963)<.1&&Math.abs(introX-garden.left)<.1;
  }
  report.push({page:+svg.closest('.page').dataset.folio,viewBoxHeight:svg.viewBox.baseVal.height,contentBounds:union(content),blocks,collisions,escapedPanels,folioBounds:box(svg.querySelector('.v2-folio')),opener});
 }
 document.title='V2AUDIT'+JSON.stringify(report);
};</script>`;
const temp=built.replace('.html','-audit.html');
let report;
try{
 await fs.writeFile(temp,(await fs.readFile(built,'utf8')).replace('</head>',probe+'</head>'));
 const {stdout}=await run(process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--virtual-time-budget=15000','--dump-dom',pathToFileURL(temp).href],{maxBuffer:32e6});
 report=JSON.parse(stdout.match(/V2AUDIT([\s\S]*?)<\/title>/)[1].replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>'));
}finally{await fs.unlink(temp);}
const round=n=>Math.round(n*10)/10;
const glossary=map.find(p=>p.title==='Keywords').page;
for(const p of report){
 const planned=map[p.page-1],mm=metrics.trimH/p.viewBoxHeight;
 p.contentBounds=Object.fromEntries(Object.entries(p.contentBounds).map(([k,n])=>[k,round(n)]));
 p.bottomGapMM=round((1415-p.contentBounds.bottom)*mm);
 p.occupiedPercent=round((p.contentBounds.bottom-112)/1303*100);
 p.footerClearanceMM=round((p.viewBoxHeight-p.folioBounds.bottom)*mm);
 for(const b of p.blocks)for(const key of ['left','top','right','bottom'])b[key]=round(b[key]);
 if(p.occupiedPercent<88&&p.page>1&&p.page<glossary){
  const following=map[p.page]?.blocks||[],remaining=1415-planned.end;
  let total=0,barrier=[];
  for(let i=0;i<following.length;i++){
   const b=following[i];total+=b.bottom-b.top+b.before;barrier.push(b);
   if(total>remaining&&!b.keepNext&&['table','figure','activity','panel','illustrated-note','comparison'].includes(b.type))break;
  }
  p.shortPageException={remainingMM:round(remaining*mm),protectedGroup:barrier.map(b=>({id:b.id,type:b.type,title:b.text?.slice(0,100)||b.artKey||'Labelled illustration',height:round(b.bottom-b.top)})),requiredMM:round(total*mm),reason:'The following protected unit and intervening prose exceed the remaining space. The compositor balances the break within that prose while keeping the unit whole; paragraph spacing is unchanged.'};
 }
}
await fs.writeFile(history+'/render-audit.json',JSON.stringify({trim:metrics,pages:report},null,2));
const failures=report.flatMap(p=>[...p.collisions.map(c=>`p${p.page} text collision: ${c.join(' / ')}`),...p.escapedPanels.map(s=>`p${p.page} panel overflow: ${s}`),...(p.contentBounds.bottom>1415?[`p${p.page} content past foot`]:[]),...(p.footerClearanceMM<3?[`p${p.page} folio too close to trim (${p.footerClearanceMM}mm)`]:[])]);
const opener=report[0].opener;
assert.ok(opener?.bleedCovered,'Opener band must cover top and side bleed');
assert.ok(opener.safeText&&opener.alignedBaseline&&opener.centredLabel,'Opener lettering is aligned and inside safe bounds');
assert.ok(opener.numberTitleGap>=50&&opener.decorationGap>=40,'Opener number, title and leaves have clear separation');
assert.ok(opener.headerImageGap>=32&&opener.imageIntroGap>=32&&opener.sharedReadingGrid,'Opener illustration and body share the reading grid and deliberate white gutters');
assert.equal(failures.length,0,failures.join('\n'));
console.log(`V2 rendered audit: ${report.length} pages; no text collisions or panel overflow; all folios at least 3mm inside trim.`);
