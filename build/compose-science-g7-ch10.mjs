import {completeIllustratedPage,pageImageReserve} from './science-page-illustrations.mjs';
import {comparisonTableBlock} from './science-g7-comparison-tables.mjs';
// Independent Grade 7 Chapter 10 authoring entry point. Shared Science typography,
// opener, feature headings and protected-block pagination; no writes to older chapters.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
import {title,shortTitle,opener,lesson,glossary,summary,exercises,projects} from './science-g7-ch10-content.mjs';
import {plantDiagram} from './science-g7-ch10-diagrams.mjs';
import {chapterOpener} from './chapter-opener.mjs';
import {scienceHeaderArt} from './science-header-art.mjs';
import {v2PanelHeading} from './science-v2-cues.mjs';
import {refitV2Lesson} from './refit-science-v2-blocks.mjs';
import {scienceContract} from './science-contract.mjs';
import {sheetMetrics} from './sheet.mjs';

const dir='pages/class-7/ch10-life-processes-in-plants',history='assets/design-history/science-g7-ch10';
const config=JSON.parse(await fs.readFile(dir+'/chapter.json','utf8'));
const grade=config.class,number=config.number;
const artwork=JSON.parse(await fs.readFile(history+'/artwork.json','utf8'));
const motifs=(running=false)=>`<g class="${running?'v2-plant-motif':'chapter-opener__motif v2-plant-motif'}" transform="${running?'translate(25 8) scale(.40)':'translate(945 73) scale(1.05)'}"><path d="M36 111C24 84 30 45 48 9M31 76C4 71 4 42 7 35C29 39 39 52 31 76ZM33 61C58 61 76 34 73 24C50 26 39 38 33 61ZM35 92C55 94 76 79 79 65C53 59 40 74 35 92Z"/></g>`;
function photo(key,x,y,w=600,h=220){const asset=artwork.find(a=>a.key===key);if(!asset)throw Error('Missing art '+key);const scale=Math.min(w/asset.pixels[0],h/asset.pixels[1]),iw=asset.pixels[0]*scale,ih=asset.pixels[1]*scale;return `<image class="science-illustration" data-photo="${key}" href="../../${asset.file}" x="${x+(w-iw)/2}" y="${y+(h-ih)/2}" width="${iw}" height="${ih}" preserveAspectRatio="xMidYMid meet"/>`;}
const metrics=await sheetMetrics(process.cwd(),config.edition);
const E=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function tokens(s){let bold=false,italic=false;return s.split(/\s+/).filter(Boolean).map(w=>{const parts=[];for(const p of w.split(/(\*\*|\*)/)){if(p==='**')bold=!bold;else if(p==='*')italic=!italic;else if(p)parts.push({s:p,k:bold?'b':italic?'i':'n'});}return parts;});}
const labels='Keywords Summary Let Us Enhance Our Learning Use your notebook. Support each answer with evidence and explain any uncertainty. Explore Further';
const strings=value=>typeof value==='string'?[value]:value&&typeof value==='object'?Object.values(value).flatMap(strings):[];
const terms=new Set([' ','—']);for(const w of tokens(strings({title,opener,lesson,glossary,summary,exercises,projects}).join(' ')+' '+labels))for(const p of w)terms.add(p.s);
const probe=path.resolve('build/_g7-ch10-type-measure.html');
const faces={n:'400 24px "Source Serif 4"',b:'700 24px "Source Serif 4"',i:'italic 400 24px "Source Serif 4"',h:'700 30px "Source Sans 3"',s:'600 24px "Source Sans 3"'};
await fs.writeFile(probe,`<html><head><meta charset="utf-8"><link rel="stylesheet" href="../css/science-v2-fonts.css"></head><body><script>onload=async()=>{const faces=${JSON.stringify(faces)};await Promise.all(Object.values(faces).map(f=>document.fonts.load(f)));const c=document.createElement('canvas').getContext('2d'),out={};for(const [k,f] of Object.entries(faces)){c.font=f;out[k]={};for(const s of ${JSON.stringify([...terms])})out[k][s]=c.measureText(s).width;}document.title='METRICS'+JSON.stringify(out);};</script></body></html>`);
let widths;try{const {stdout}=await promisify(execFile)(process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--virtual-time-budget=8000','--dump-dom',pathToFileURL(probe).href],{maxBuffer:24e6});widths=JSON.parse(stdout.match(/METRICS(.*?)<\/title>/s)[1].replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>'));}finally{await fs.unlink(probe);}
function wrap(s,w=874,k='n',scale=1){const rows=[];let row=[],used=0;for(const token of tokens(s)){const size=token.reduce((a,p)=>{const value=widths[k==='n'?p.k:k][p.s];if(value===undefined)throw Error('Unmeasured word: '+p.s);return a+value*scale;},0);if(row.length&&used+widths[k][' ']*scale+size>w-5){rows.push(row);row=[];used=0;}if(row.length)used+=widths[k][' ']*scale;row.push(token);used+=size;}if(row.length)rows.push(row);return rows;}
const word=parts=>parts.map(p=>p.k==='n'?E(p.s):`<tspan class="${p.k==='b'?'se-bold':'se-italic'}">${E(p.s)}</tspan>`).join('');
function lines(rows,x,y,cls='se-copy',lead=32,size=24){return `<text class="${cls}" x="${x}" y="${y+size}">${rows.map((r,i)=>`<tspan x="${x}"${i?` dy="${lead}"`:''}>${r.map(word).join(' ')}</tspan>`).join('')}</text>`;}
const label=(s,x,y,cls='se-caption',anchor='start')=>`<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${E(s)}</text>`;
const caption=(s,y)=>{const rows=wrap(s,874,'n',.87);return {html:lines(rows,89,y,'se-caption',27,20.88),h:rows.length*27};};
function paragraph(s,{x=89,w=874,y=0,gap=16,cls='se-copy',scale=1,k='n',lead=32}={}){const rows=wrap(s,w,k,scale);return {html:lines(rows,x,y,cls,lead,24*scale),h:rows.length*lead+gap};}
const blocks=[];
function add(meta,html,h,extra={}){blocks.push({atomId:meta.id,type:meta.type,top:0,h,html,source:meta.source||[],text:meta.text||meta.caption||meta.paragraphs?.join(' ')||'',...extra});}
function body(meta){const rows=wrap(meta.text),chunks=[];if(meta.keepWhole)return add(meta,lines(rows,89,0),rows.length*32+16,{keepNext:!!meta.keepNext});for(let i=0;i<rows.length;){const n=rows.length-i>3?2:rows.length-i;chunks.push(rows.slice(i,i+n));i+=n;}chunks.forEach((rows,i)=>add({...meta,id:meta.id+'-'+i},lines(rows,89,0),rows.length*32+(i===chunks.length-1?16:0),{paragraphPart:i,paragraphParts:chunks.length,keepNext:!!meta.keepNext&&i===chunks.length-1}));}
function bulletList(items,x,w,y=0){let html='';for(const s of items){const p=paragraph(s,{x:x+23,w:w-23,y,gap:10});html+=label('•',x,y+24,'se-copy')+p.html;y+=p.h;}return {html,h:y};}
function render(meta){
 if(meta.comparisonTable){const t=comparisonTableBlock(meta,{wrap,lines});return add(meta,t.html,t.h,{conceptId:meta.id});}
 if(meta.type==='project'){
  const rows=wrap(meta.title,874,'h');let y=rows.length*36+12;
  const p=paragraph(meta.text,{y});let html=lines(rows,89,0,'se-heading',36,30)+p.html;y+=p.h;
  if(meta.figure){html+=photo(meta.figure,276,y,500,280);y+=290;const c=caption(meta.caption,y);html+=c.html;y+=c.h+12;}
  return add(meta,html,y+12,{conceptId:meta.id});
 }

 if(meta.type==='diagram'){
  const d=plantDiagram(meta.diagram),c=caption(meta.caption,d.h+10);
  return add({...meta,type:'figure'},d.html+c.html,d.h+10+c.h+22,{artKey:meta.diagram});
 }
 if(meta.type==='body')return body(meta);
 if(meta.type==='heading'){const major=meta.level!==2,rows=wrap(meta.text,874,'h',major?38/30:1);return add(meta,lines(rows,89,0,major?'v2-title':'se-heading',major?46:36,major?38:30),rows.length*(major?46:36)+12,{role:major?'section':'subtopic'});}
 if(meta.type==='panel'){
  const sideSafety=['growth-setup','co2-setup','dye-setup','seed-flasks'].includes(meta.diagram);
  const paragraphs=sideSafety?meta.paragraphs.slice(0,-1):meta.paragraphs;
  let y=68,html='';for(const [index,s] of paragraphs.entries()){const match=s.match(/^(\d+)\. (.*)$/),p=paragraph(match?match[2]:s,{x:match?146:113,w:match?793:826,y,gap:12});if(match)html+=label(match[1]+'.',132,y+24,'se-activity-step','end');html+=p.html;y+=p.h;}
  if(meta.figure){html+=photo(meta.figure,176,y,700,215);y+=225;const rows=wrap(meta.figureCaption,826,'n',.87);html+=lines(rows,113,y,'se-caption',27,20.88);y+=rows.length*27+12;}
  if(sideSafety){
   const dimensions={'growth-setup':[405,270,['A','B','C']],'co2-setup':[465,310,['A: absorber','B: water']],'dye-setup':[427.5,285,['A: plain water','B: dyed water']],'seed-flasks':[450,300,['A: seeds','B: control']]};
   const [w,h,names]=dimensions[meta.diagram],x=113;
   html+=photo(meta.diagram,x,y,w,h);
   const fractions=names.length===3?[.18,.5,.82]:[.25,.75];
   names.forEach((name,i)=>{html+=label(name,x+w*fractions[i],y+h+28,'se-caption','middle');});
   const sx=x+w+28,p=paragraph(meta.paragraphs.at(-1),{x:sx,w:939-sx,y:y+12,gap:0});
   html+=p.html;y+=Math.max(h+42,p.h+12)+12;
   const rows=wrap(meta.diagramCaption,826,'n',.87);html+=lines(rows,113,y,'se-caption',27,20.88);y+=rows.length*27+12;
  }else if(meta.diagram){const d=plantDiagram(meta.diagram);html+=`<g transform="translate(0 ${y})">${d.html}</g>`;y+=d.h+12;const rows=wrap(meta.diagramCaption,826,'n',.87);html+=lines(rows,113,y,'se-caption',27,20.88);y+=rows.length*27+12;}
  const h=y+10,kind=meta.kind==='setup'?'se-activity-panel':'se-prompt se-thought-panel';
  return add({...meta,type:meta.kind==='setup'?'activity':'panel'},`<rect class="${kind}" x="89" y="0" width="874" height="${h}" rx="18"/>`+(meta.kind==='setup'?`<path class="v2-activity-header" d="M107 0H945Q963 0 963 18V58H89V18Q89 0 107 0Z"/>`:'')+v2PanelHeading(meta.kind,113,39)+html,h+22,{conceptId:meta.id});
 }
 if(meta.type==='bullets'){
  // These lists contain separate growth traits or services, not a comparison
  // that must be read across. Keep each complete bullet, not the entire list.
  return meta.items.forEach((text,i)=>{const p=bulletList([text],89,874);add({...meta,id:meta.id+'-'+i,type:'bullet',text},p.html,p.h+(i===meta.items.length-1?6:0),{comparisonItems:[{id:meta.id+'-'+i,text}]});});
 }
 if(meta.type==='comparison'){
  let html='',y=0;
  for(const [i,col] of meta.columns.entries()){
   const step=874/meta.columns.length,x=89+i*step,w=step-26,head=wrap(col.title,w,'h');let top=head.length*36+14;
   html+=lines(head,x,0,'v2-comparison-title',36,30);
   const p=bulletList(col.items,x,w,top);html+=p.html;y=Math.max(y,p.h+12);
  }
  return add(meta,html,y+4,{comparisonItems:meta.columns.flatMap((c,i)=>c.items.map((text,j)=>({id:meta.id+'-'+i+'-'+j,alternative:c.title,text})))});
 }
 if(meta.type==='illustrated-note'){
  let y=0,html=lines(wrap(meta.heading,530,'h'),89,0,'se-heading',36,30);y+=wrap(meta.heading,530,'h').length*36+12;
  const p=paragraph(meta.text,{x:89,w:530,y});html+=p.html;y=p.h+y;
  html+=photo(meta.figure,655,8,308,220);
  const rows=wrap(meta.caption,308,'n',.87);html+=lines(rows,655,238,'se-caption',27,20.88);
  return add(meta,html,Math.max(y,238+rows.length*27)+22);
 }
 if(meta.type==='equation'){
  const rows=wrap(meta.text,874,'s',1.25);let html=lines(rows,89,0,'v2-equation',38,30),y=rows.length*38+12;
  const c=caption(meta.caption,y);return add(meta,html+c.html,y+c.h+20);
 }
 if(meta.type==='question'){
  let y=0,html=label(meta.number+'.',111,24,'se-copy','end');const p=paragraph(meta.text,{x:132,w:831,y:0,gap:16});html+=p.html;y=p.h;
  if(meta.diagram){const d=plantDiagram(meta.diagram);html+=`<g transform="translate(0 ${y})">${d.html}</g>`;y+=d.h+10;const c=caption(meta.caption,y);html+=c.html;y+=c.h+12;}
  if(meta.figure){const height=meta.figureHeight||215;html+=photo(meta.figure,186,y,680,height);y+=height+5;const c=caption(meta.caption,y);html+=c.html;y+=c.h+12;}
  return add(meta,html,y+14);
 }
 if(meta.type==='table'){
  const head=wrap(meta.caption,874,'h',.72);let y=head.length*28+14;
  const top=y,ws=meta.widths.map(v=>v*874),xs=ws.map((_,i)=>89+ws.slice(0,i).reduce((a,v)=>a+v,0));let html=lines(head,89,0,'v2-table-caption',28,21.6);
  meta.rows.forEach((row,i)=>{const rows=row.map((s,j)=>wrap(s,ws[j]-28,i?'n':'b',.92)),h=Math.max(...rows.map(r=>r.length))*28+24;if(!i)html+=`<rect class="se-table-head" x="89" y="${y}" width="874" height="${h}"/>`;html+=rows.map((r,j)=>lines(r,xs[j]+14,y+12,i?'se-copy se-table-copy':'v2-table-heading',28,22.08)).join('');y+=h;html+=`<line class="v2-table-rule" x1="89" x2="963" y1="${y}" y2="${y}"/>`;});
  html+=`<rect class="v2-table-frame" x="89" y="${top}" width="874" height="${y-top}"/>`+xs.slice(1).map(x=>`<line class="v2-table-rule" x1="${x}" x2="${x}" y1="${top}" y2="${y}"/>`).join('');
  const note=wrap(meta.note,874,'n',.87);html+=lines(note,89,y+12,'v2-table-note',26,20.88);return add(meta,html,y+12+note.length*26+20);
 }
 let html='',y=0;
 if(meta.figure){html=photo(meta.figure,176,0,700,270);y=280;}
 if(meta.caption){const c=caption(meta.caption,y);html+=c.html;y+=c.h+10;}
 if(meta.note){const rows=wrap(meta.note,874,'n',.87);html+=lines(rows,89,y,'v2-table-note',26,20.88);y+=rows.length*26+6;}
 return add({...meta,type:'figure'},html,y+18,{artKey:meta.type});
}
for(const meta of lesson)render(['dastur','sohonie','vrikshayurveda','net-exchange-example'].includes(meta.id)?{...meta,keepWhole:true}:meta);
const lessonBlockCount=blocks.length;
const fitted=refitV2Lesson([{blocks}],{imageReserve:pageImageReserve});
const band=chapterOpener({id:'science-g7-ch10',number,titleLines:['Life Processes','in Plants'],bleed:Math.ceil(metrics.bleed*1052/metrics.trimW),image:{href:`../../figures/class-${grade}/science/ch10/opener.png`,aspect:1.5,alt:'Children observing the growth of plants in a school garden'}});
const motif=scienceHeaderArt(grade,number);
let openerHtml=band.html.replace(/(class="chapter-opener__number[^>]* y=")222"/,'$1242"').replace('<line class="chapter-opener__divider"',motif+'<line class="chapter-opener__divider"'),y=band.bodyTop;
opener.forEach((s,i)=>{const p=paragraph(s,{y,cls:i?'se-copy':'se-copy v2-intro',scale:i?1:26/24,k:i?'n':'b',lead:i?32:34,gap:i?16:20});openerHtml+=p.html;y+=p.h;});
if(y>1415)throw Error('Opener overfull: '+y);
const pages=[{title:'',titleRole:'opener',source:[1],parts:openerHtml,end:y},...fitted];
// Dedicated reference pages keep full-size definitions and comfortable columns.
let ref=label('Keywords',89,150,'v2-title'),top=174,refBottom=top,refContents='';
for(let col=0;col<2;col++){let yy=top+24;for(const [term,meaning] of glossary.slice(col*7,(col+1)*7)){const p=paragraph('**'+term+'** — '+meaning,{x:113+col*428,w:398,y:yy,gap:20});refContents+=p.html;yy+=p.h;}refBottom=Math.max(refBottom,yy+10);}
ref+=`<rect class="se-glossary-panel" x="89" y="${top}" width="874" height="${refBottom-top}" rx="18"/>`+refContents;
if(refBottom>1415)throw Error('Glossary overflow');
pages.push({title:'Keywords',titleRole:'reference',source:[2,4,7,8,10,11,12,13],parts:ref,end:refBottom});
let sum=label('Summary',89,150,'v2-title');const sp=bulletList(summary,89,874,180);sum+=sp.html;
if(sp.h>1415)throw Error('Summary overflow');
pages.push({title:'Summary',titleRole:'reference',source:[14],parts:sum,end:sp.h});
blocks.length=0;
render({id:'assessment-heading',type:'heading',text:'Let Us Enhance Our Learning',source:[14,15]});
render({id:'assessment-intro',type:'body',text:'Use your notebook. Support each answer with evidence and explain any uncertainty.',source:[]});
exercises.forEach((q,i)=>render({...q,type:'question',number:i+1}));
pages.push(...refitV2Lesson([{blocks}],{imageReserve:pageImageReserve}).map(p=>({...p,titleRole:'assessment'})));
blocks.length=0;
render({id:'project-heading',type:'heading',text:'Explore Further',source:[15,16]});
for(const p of projects)render({...p,type:'project'});
pages.push(...refitV2Lesson([{blocks}],{imageReserve:pageImageReserve}).map(p=>({...p,titleRole:'projects'})));
const map=[];
for(let i=0;i<pages.length;i++){
 const p=completeIllustratedPage(pages[i],grade,number),n=i+1,verso=n%2===0;
 const running=i===0?'':'<g class="v2-header"><path class="v2-ribbon-underlay" d="M0 0H340L317 51Q312 63 291 63H0Z"/><path class="v2-ribbon" d="M0 0H321L300 49Q295 63 274 63H0Z"/>'+motifs(true)+''+label('CHAPTER '+number,96,41,'v2-ribbon-label se-running')+label(shortTitle,960,40,'v2-running se-running','end')+'<line class="v2-furniture-rule" x1="340" x2="963" y1="58" y2="58"/></g>';
 const foot='<g class="v2-footer">'+`<line class="v2-furniture-rule" x1="${verso?190:89}" x2="${verso?963:862}" y1="1485" y2="1485"/>`+label('LEARNLAB · SCIENCE '+grade,verso?963:89,1465,'v2-foot-label se-running',verso?'end':'start')+`<path class="v2-ribbon-underlay" d="${verso?'M0 1455H137Q152 1455 160 1470L179 1514H0Z':'M1052 1455H915Q900 1455 892 1470L873 1514H1052Z'}"/><path class="v2-ribbon" d="${verso?'M0 1455H117Q132 1455 140 1470L159 1514H0Z':'M1052 1455H935Q920 1455 912 1470L893 1514H1052Z'}"/>`+label(n,verso?107:945,1487,'v2-folio se-running','middle')+'</g>';
 const html=`<section class="page page--food page--science-editorial page--science-v2 page--g7-ch10${i===0?' page--opener':''}" data-folio="${n}"${i===pages.length-1?' data-close':''}><div class="page__body"><div class="page__main"><svg class="food-sheet science-sheet science-editorial" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1052 1514" aria-label="${title}, page ${n}">${running}${p.parts}${foot}</svg></div></div></section>`;
 scienceContract('Chapter 10 '+n,html);await fs.writeFile(`${dir}/p${String(n).padStart(3,'0')}.html`,html);
 map.push({page:n,title:p.title,titleRole:p.titleRole,sourcePages:p.source,pageIllustration:p.pageIllustration?{file:p.pageIllustration.file,caption:p.pageIllustration.caption}:undefined,end:p.end,fill:Math.round((p.end-112)/1303*100),breakReason:p.breakReason,blocks:p.blockAudit,protectedNext:p.protectedNext});
}
for(const file of await fs.readdir(dir))if(/^p\d+\.html$/.test(file)&&+file.slice(1,-5)>pages.length)await fs.unlink(path.join(dir,file));
await fs.mkdir(history,{recursive:true});
await fs.writeFile(history+'/page-map.json',JSON.stringify(map,null,2));
await fs.writeFile(history+'/editorial-ledger.json',JSON.stringify({opener:{source:[1],paragraphs:opener},lesson,glossary:{purpose:'Reference definitions for terms taught in the chapter',entries:glossary},summary,assessment:{purpose:'All ten source questions retained with safety and evidence qualifications',questions:exercises},projects},null,2));
console.log(`Chapter 10: ${pages.length} pages; ${fitted.length} lesson pages; ${lessonBlockCount} protected/prose blocks.\n`+map.map(p=>`p${p.page}: ${p.fill}% ${p.title||'continued lesson'}`).join('\n'));
