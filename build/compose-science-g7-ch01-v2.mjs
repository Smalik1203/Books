import {writeScienceSource} from './write-science-source.mjs';
import {completeChapter1Page,chapter1ImageReserve as pageImageReserve} from './science-g7-ch01-page-art.mjs';
import {pageImageReserve as reviewedLessonImageReserve} from './science-page-illustrations.mjs';
import {comparisonTableBlock} from './science-g7-comparison-tables.mjs';
// Independent Chapter 1 authoring entry point. Shared V2 typography, opener,
// feature headings and protected-block pagination; no writes to Chapter 2/V1.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
import {title,opener,lesson,glossary,summary,exercises,topicRelationships} from './science-g7-ch01-v2-content.mjs';
import {planeMotif,setupDiagram,waterDiagram,artWords} from './science-g7-ch01-v2-art.mjs';
import {topicArt,wideTopicArt,lightPair,topicArtWords} from './science-g7-ch01-v2-topic-art.mjs';
import {chapterOpener} from './chapter-opener.mjs';
import {scienceHeaderArt} from './science-header-art.mjs';
import {v2PanelHeading} from './science-v2-cues.mjs';
import {refitV2Lesson} from './refit-science-v2-blocks.mjs';
import {scienceContract} from './science-contract.mjs';
import {sheetMetrics} from './sheet.mjs';
import {measureChapter1Justification} from './measure-science-g7-ch01-justification.mjs';
import {alignChapter1Figures} from './science-g7-ch01-figure-layout.mjs';

const dir='pages/class-7/ch01-ever-evolving-world-of-science-v2',history='assets/design-history/science-v2-g7-ch01';
const config=JSON.parse(await fs.readFile(dir+'/chapter.json','utf8'));
const grade=config.class,number=config.number;
const metrics=await sheetMetrics(process.cwd(),config.edition);
const E=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function tokens(s){let bold=false,italic=false;return s.split(/\s+/).filter(Boolean).map(w=>{const parts=[];for(const p of w.split(/(\*\*|\*)/)){if(p==='**')bold=!bold;else if(p==='*')italic=!italic;else if(p)parts.push({s:p,k:bold?'b':italic?'i':'n'});}return parts;});}
const labels='Observe Question Suggest Test Review Revisit the question or explanation Refill Tip Ink visible Paper Living things Food Materials Water Sky Desert Coast Ocean Galaxy Keywords Summary Let Us Enhance Our Learning Use your notebook for these questions CHAPTER 1 LEARNLAB SCIENCE 6';
const strings=value=>typeof value==='string'?[value]:value&&typeof value==='object'?Object.values(value).flatMap(strings):[];
const terms=new Set([' ','—']);for(const w of tokens(strings({title,opener,lesson,glossary,summary,exercises}).join(' ')+' '+labels+' '+artWords+' '+topicArtWords))for(const p of w)terms.add(p.s);
const probe=path.resolve('build/_g7-ch01-v2-type-measure.html');
const faces={n:'400 24px "Source Serif 4"',b:'700 24px "Source Serif 4"',i:'italic 400 24px "Source Serif 4"',h:'700 30px "Source Sans 3"',s:'600 24px "Source Sans 3"'};
await fs.writeFile(probe,`<html><head><meta charset="utf-8"><link rel="stylesheet" href="../css/science-v2-fonts.css"></head><body><script>onload=async()=>{const faces=${JSON.stringify(faces)};await Promise.all(Object.values(faces).map(f=>document.fonts.load(f)));const c=document.createElement('canvas').getContext('2d'),out={};for(const [k,f] of Object.entries(faces)){c.font=f;out[k]={};for(const s of ${JSON.stringify([...terms])})out[k][s]=c.measureText(s).width;}document.title='METRICS'+JSON.stringify(out);};</script></body></html>`);
let widths;try{const {stdout}=await promisify(execFile)(process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--virtual-time-budget=8000','--dump-dom',pathToFileURL(probe).href],{maxBuffer:24e6});widths=JSON.parse(stdout.match(/METRICS(.*?)<\/title>/s)[1].replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>'));}finally{await fs.unlink(probe);}
function wrap(s,w=874,k='n',scale=1){const rows=[];let row=[],used=0;for(const token of tokens(s)){const size=token.reduce((a,p)=>{const value=widths[k==='n'?p.k:k][p.s];if(value===undefined)throw Error('Unmeasured word: '+p.s);return a+value*scale;},0);if(row.length&&used+widths[k][' ']*scale+size>w-5){rows.push(row);row=[];used=0;}if(row.length)used+=widths[k][' ']*scale;row.push(token);used+=size;}if(row.length)rows.push(row);return rows.map((r,i)=>Object.assign(r,{measure:w,face:k,scale,paragraphEnd:i===rows.length-1}));}
const word=parts=>parts.map(p=>p.k==='n'?E(p.s):`<tspan class="${p.k==='b'?'se-bold':'se-italic'}">${E(p.s)}</tspan>`).join('');
// Chapter 1 pilot: distribute spare line width between whole words only.
// Row metadata survives body-fragment slicing, so a continuation at a page
// break is justified; only the true paragraph ending stays naturally short.
const typographyReplacements=new Map(),typographyByText=new Map();
const proseText=s=>s.replace(/<tspan\b[^>]*\bx="[^"]*"[^>]*>/g,' ').replace(/<[^>]*>/g,'').replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&quot;','"').replace(/\s+/g,' ').trim();
const proseKey=(s,text=proseText(s))=>['class','x','y'].map(a=>s.match(new RegExp('\\b'+a+'="([^"]*)"'))?.[1]).join('|')+'|'+text;
function lines(rows,x,y,cls='se-copy',lead=32,size=24){
 const natural=`<text class="${cls}" x="${x}" y="${y+size}">${rows.map((r,i)=>`<tspan x="${x}"${i?` dy="${lead}"`:''}>${r.map(word).join(' ')}</tspan>`).join('')}</text>`;
 if(cls!=='se-copy'&&cls!=='se-copy v2-intro')return natural;
 const html=`<text class="${cls}" x="${x}" y="${y+size}" data-prose-align="justify">${rows.map((r,i)=>{
  const pos=`x="${x}"${i?` dy="${lead}"`:''}`;
  if(r.paragraphEnd||r.length<2)return `<tspan ${pos} data-paragraph-end="true">${r.map(word).join(' ')}</tspan>`;
  const naturalSpace=widths[r.face][' ']*r.scale;
  const used=r.reduce((n,t)=>n+t.reduce((sum,p)=>sum+widths[r.face==='n'?p.k:r.face][p.s]*r.scale,0),0)+(r.length-1)*naturalSpace;
  const extra=(r.measure-used)/(r.length-1);
  if(extra<0)throw Error('Prose line exceeds its measure without justification');
  return `<tspan ${pos} data-justify-width="${r.measure}" data-natural-space="${naturalSpace.toFixed(5)}" data-extra-space="${extra.toFixed(5)}" data-space-ratio="${((naturalSpace+extra)/naturalSpace).toFixed(3)}">${r.map((t,j)=>j?`<tspan dx="${extra.toFixed(5)}"> ${word(t)}</tspan>`:word(t)).join('')}</tspan>`;
 }).join('')}</text>`;
 typographyReplacements.set(natural,html);typographyByText.set(proseKey(natural),html);return html;
}
const label=(s,x,y,cls='se-caption',anchor='start')=>`<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${E(s)}</text>`;
const image=(file,x,y,w,h)=>`<image class="science-illustration" href="../../figures/class-${grade}/science/ch01-v2/${file}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;
// Full-width scientific explanations and safety directions are ordinary prose.
// Only the short labels directly identifying pictures use caption typography.
const caption=(s,y)=>paragraph(s,{y,gap:0});
function paragraph(s,{x=89,w=874,y=0,gap=16,cls='se-copy',scale=1,k='n',lead=32}={}){const rows=wrap(s,w,k,scale);return {html:lines(rows,x,y,cls,lead,24*scale),h:rows.length*lead+gap};}
const blocks=[];
const tableSpacing={before:12,after:28,cellPadding:10,noteGap:20};
let activitySequence=0;
function add(meta,html,h,extra={}){blocks.push({atomId:meta.id,type:meta.type,top:0,h,html,source:meta.source||[],text:meta.text||meta.caption||meta.paragraphs?.join(' ')||'',...extra});}
function body(meta){
 const rows=wrap(meta.text),chunks=[];
 if(meta.id==='earth-moon-sun')return add(meta,lines(rows,89,0),rows.length*32+16);
 for(let i=0;i<rows.length;){const n=rows.length-i>3?2:rows.length-i;chunks.push(rows.slice(i,i+n));i+=n;}chunks.forEach((rows,i)=>add({...meta,id:meta.id+'-'+i},lines(rows,89,0),rows.length*32+(i===chunks.length-1?16:0),{paragraphPart:i,paragraphParts:chunks.length}));}
function bulletList(items,x,w,y=0){let html='';for(const s of items){const p=paragraph(s,{x:x+23,w:w-23,y,gap:10});html+=label('•',x,y+24,'se-copy')+p.html;y+=p.h;}return {html,h:y};}
function render(meta){
 if(meta.comparisonTable){const t=comparisonTableBlock(meta,{wrap,lines,spacing:tableSpacing});return add(meta,t.html,t.h,{conceptId:meta.id});}
 if(meta.type==='body')return body(meta);
 if(meta.type==='heading'){const major=meta.level!==2,rows=wrap(meta.text,874,'h',major?38/30:1);return add(meta,lines(rows,89,0,major?'v2-title':'se-heading',major?46:36,major?38:30),rows.length*(major?46:36)+12,{role:major?'section':'subtopic'});}
 if(meta.type==='panel'){
  let y=68,html='';for(const [index,s] of meta.paragraphs.entries()){const match=s.match(/^(\d+)\. (.*)$/),p=paragraph(match?match[2]:s,{x:match?146:113,w:match?793:826,y,gap:12});if(match)html+=label(match[1]+'.',132,y+24,'se-activity-step','end');html+=p.html;y+=p.h;if(index===0&&meta.figure==='plane-setup'){const art=setupDiagram(y,label);html+=art.html;y+=art.h;}}
  const h=y+10,kind=meta.kind==='setup'?'se-activity-panel':'se-prompt se-thought-panel';
  const header=meta.kind==='setup'?`<path class="v2-activity-header" d="M107 0H945Q963 0 963 18V58H89V18Q89 0 107 0Z"/>`:'';
  const heading=v2PanelHeading(meta.kind,113,meta.kind==='setup'?39:43,meta.kind==='setup'?{activityNumber:`${number}.${++activitySequence}`}:{}) ;
  return add({...meta,type:meta.kind==='setup'?'activity':'panel'},`<rect class="${kind}" x="89" y="0" width="874" height="${h}" rx="18"/>`+header+heading+html,h+22,{conceptId:meta.id,keepNext:meta.id==='question-answer-panel'});
 }
 if(meta.type==='bullets'){const p=bulletList(meta.items,89,874);return add({...meta,type:'comparison'},p.html,p.h+6,{comparisonItems:meta.items.map((text,i)=>({id:meta.id+'-'+i,text}))});}
 if(meta.type==='comparison'){
  for(const [i,col] of meta.columns.entries()){
   const id=meta.id+'-'+i,relationship=topicRelationships[id]||{};
   const head=wrap(col.title,col.art&&!relationship.gallery?506:874,'h');let y=head.length*36+14;
   let html=lines(head,89,0,'v2-comparison-title',36,30);
   const relatedIds=[relationship.gallery,...(relationship.explanations||[])].filter(Boolean);
   if(relationship.gallery){
    const gallery=lesson.find(b=>b.id===relationship.gallery);
    const p=bulletList(col.items,89,874,y);html+=p.html;y=p.h+12;
    if(col.art==='mirrors'){
     const arts=lightPair(label),caps=[col.figureCaption,gallery.caption];let end=y;
     for(const [j,art] of arts.entries()){
      const rows=wrap(caps[j],art.w,'n',.87),x=89+art.x;
      html+=`<g transform="translate(${x} ${y})">${art.html}</g>`+lines(rows,x,y+art.h,'se-caption',27,20.88);
      end=Math.max(end,y+art.h+rows.length*27);
     }
     y=end+18;
    }else{
     const art=wideTopicArt(gallery.art,label);
     html+=`<g transform="translate(89 ${y})">${art.html}</g>`;y+=art.h;
     const c=caption(gallery.caption,y);html+=c.html;y+=c.h+18;
    }
   }else if(col.art){
    const art=topicArt(col.art,label),rows=wrap(col.figureCaption,art.w,'n',.87);
    const p=bulletList(col.items,89,506,y);
    html+=p.html+`<g transform="translate(627 0)">${art.html}</g>`+lines(rows,627,art.h,'se-caption',27,20.88);
    y=Math.max(p.h,art.h+rows.length*27)+18;
   }else{
    const p=bulletList(col.items,89,874,y);html+=p.html;y=p.h+12;
   }
   for(const relatedId of relationship.explanations||[]){
    const explanation=lesson.find(b=>b.id===relatedId),t=explanation.comparisonTable?comparisonTableBlock(explanation,{wrap,lines,spacing:tableSpacing}):null,p=t?{html:`<g transform="translate(0 ${y})">${t.html}</g>`,h:t.h}:paragraph(explanation.text,{y});
    html+=`<g data-related-block="${relatedId}">${p.html}</g>`;y+=p.h;
   }
   html=`<g data-topic="${id}" data-related="${relatedIds.join(' ')}">${html}</g>`;
   add({...meta,id},html,y+14,{conceptId:meta.id,comparisonItems:col.items.map((text,j)=>({id:id+'-'+j,alternative:col.title,text}))});
  }
  return;
 }
 if(meta.type==='table'){
  const head=wrap(meta.caption,874,'h',.72);let y=head.length*28+14;
  const top=y,ws=meta.widths.map(v=>v*874),xs=[89,89+ws[0]];let html=lines(head,89,0,'v2-table-caption',28,21.6);
  meta.rows.forEach((row,i)=>{const rows=row.map((s,j)=>wrap(s,ws[j]-28,i?'n':'b',.92)),h=Math.max(...rows.map(r=>r.length))*28+24;if(!i)html+=`<rect class="se-table-head" x="89" y="${y}" width="874" height="${h}"/>`;html+=rows.map((r,j)=>lines(r,xs[j]+14,y+12,i?'se-copy se-table-copy':'v2-table-heading',28,22.08)).join('');y+=h;html+=`<line class="v2-table-rule" x1="89" x2="963" y1="${y}" y2="${y}"/>`;});
  html+=`<rect class="v2-table-frame" x="89" y="${top}" width="874" height="${y-top}"/><line class="v2-table-rule" x1="${xs[1]}" x2="${xs[1]}" y1="${top}" y2="${y}"/>`;
  const note=wrap(meta.note,874,'n',.87);html+=lines(note,89,y+12,'v2-table-note',26,20.88);return add(meta,html,y+12+note.length*26+20);
 }
 let html='',y=0;
 if(meta.type==='water'){const art=waterDiagram(label);html=art.html;y=art.h;}
 if(meta.type==='topic-figure'){const art=wideTopicArt(meta.art,label);html=`<g transform="translate(89 0)">${art.html}</g>`;y=art.h;}
 if(meta.caption){const c=caption(meta.caption,y);html+=c.html;y+=c.h+10;}
 if(meta.note){const rows=wrap(meta.note,874,'n',.87);html+=lines(rows,89,y,'v2-table-note',26,20.88);y+=rows.length*26+6;}
 return add({...meta,type:'figure'},html,y+18,{artKey:meta.type});
}
const attachedIds=new Set(Object.values(topicRelationships).flatMap(r=>[r.gallery,...(r.explanations||[])].filter(Boolean)));
for(const meta of lesson)if(!attachedIds.has(meta.id))render(meta);
// Refit the closing question lesson independently: changing pages 8–9 must not
// pull astronomy or safety prose across the already reviewed earlier page joins.
const closingStart=blocks.findIndex(b=>b.atomId==='collaboration-0');
if(closingStart<0)throw Error('Missing closing-lesson boundary');
const fitted=[
 ...refitV2Lesson([{blocks:blocks.slice(0,closingStart)}],{imageReserve:reviewedLessonImageReserve,frontLoad:true,minLastHeight:0}),
 ...refitV2Lesson([{blocks:blocks.slice(closingStart)}],{imageReserve:pageImageReserve,frontLoad:true,minLastHeight:0})
];
const band=chapterOpener({id:'science-v2-g7-ch01',number,titleLines:['The Ever-Evolving','World of Science'],bleed:Math.ceil(metrics.bleed*1052/metrics.trimW),image:{href:`../../figures/class-${grade}/science/ch01-v2/opener.png`,aspect:1.5,alt:'Students observing a paper-plane flight in a clear school hall'}});
const motif=scienceHeaderArt(7,1);
let openerHtml=band.html.replace('<line class="chapter-opener__divider"',motif+'<line class="chapter-opener__divider"'),y=band.bodyTop;
opener.forEach((s,i)=>{const p=paragraph(s,{y,cls:i?'se-copy':'se-copy v2-intro',scale:i?1:26/24,k:i?'n':'b',lead:i?32:34,gap:i?16:20});openerHtml+=p.html;y+=p.h;});
if(y>1415)throw Error('Opener overfull: '+y);
const pages=[{title:'',titleRole:'opener',source:[1],parts:openerHtml,end:y},...fitted];
// These short reference lists can share one comfortable dedicated page.
let ref=label('Keywords',89,150,'v2-title'),top=174,refBottom=top;
let refContents='';for(let col=0;col<2;col++){let yy=top+24;for(const [term,meaning] of glossary.slice(col*Math.ceil(glossary.length/2),(col+1)*Math.ceil(glossary.length/2))){const p=paragraph('**'+term+'** — '+meaning,{x:113+col*428,w:398,y:yy,gap:14});refContents+=p.html;yy+=p.h;}refBottom=Math.max(refBottom,yy+10);}
ref+=`<rect class="se-glossary-panel" x="89" y="${top}" width="874" height="${refBottom-top}" rx="18"/>`+refContents;
y=refBottom+30;ref+=label('Summary',89,y+38,'v2-title');y+=62;
const sum=bulletList(summary,89,874,y);ref+=sum.html;y=sum.h;
if(y>1415)throw Error('Combined reference page does not fit: '+y);
pages.push({title:'Keywords',titleRole:'reference',source:[1,2,3,4,5,6],parts:ref,end:y});
let assessment=label('Let Us Enhance Our Learning',89,150,'v2-title');y=180;
const lead=paragraph('Use your notebook for these questions.',{y});assessment+=lead.html;y+=lead.h+8;
exercises.forEach((s,i)=>{assessment+=label(i+1+'.',111,y+24,'se-copy','end');const p=paragraph(s,{x:132,w:831,y,gap:23});assessment+=p.html;y+=p.h;});
if(y>1415)throw Error('Assessment page does not fit: '+y);
pages.push({title:'Let Us Enhance Our Learning',titleRole:'assessment',source:[],parts:assessment,end:y});
// Apply this typography pilot to the current reviewed page boundaries without
// recomposing the separately paused illustration work.
if(process.argv.includes('--justify-existing')){
 const baseline=JSON.parse(await fs.readFile(history+'/justification-pilot/before.json','utf8'));
 for(const file of Object.keys(baseline))baseline[file]=baseline[file].replace(v2PanelHeading('setup',113,39),v2PanelHeading('setup',113,39,{activityNumber:'1.1'}));
 const revisions=JSON.parse(await fs.readFile(history+'/justification-pilot/wording.json','utf8'));
 const rephrases=new Map(revisions.map(r=>[r.before,r.after]));let count=0;
 const inverseRephrases=new Map(revisions.map(r=>[r.after,r.before]));
 const structural=s=>s.replace(/<text\b[^>]*>[\s\S]*?<\/text>/g,t=>proseKey(t,inverseRephrases.get(proseText(t))||proseText(t))).replaceAll('\r\n','\n');
 const pilotFiles=(await fs.readdir(dir)).filter(f=>/^p\d+\.html$/.test(f));
 if(pilotFiles.length!==Object.keys(baseline).length)throw Error('Chapter pagination changed since the pilot snapshot; regenerate normally instead.');
 for(const file of pilotFiles){
  if(!baseline[file]||structural(await fs.readFile(`${dir}/${file}`,'utf8'))!==structural(alignChapter1Figures(baseline[file])))throw Error('Chapter content or artwork changed since the pilot snapshot: '+file);
 }
 for(const file of pilotFiles){
  const before=baseline[file];if(!before)throw Error('Pilot baseline has no page '+file);
  const after=before.replace(/<text\b[^>]*>[\s\S]*?<\/text>/g,t=>{
   const replacement=typographyReplacements.get(t)||typographyByText.get(proseKey(t,rephrases.get(proseText(t))||proseText(t)));
   if(replacement){count++;return replacement;}return t;
  });
  if(after!==before)await fs.writeFile(`${dir}/${file}`,alignChapter1Figures(after));
 }
 const revise=value=>typeof value==='string'?(rephrases.get(value)||value):Array.isArray(value)?value.map(revise):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).map(([k,v])=>[k,revise(v)])):value;
 const pageMap=JSON.parse(await fs.readFile(history+'/page-map.json','utf8'));
 await writeScienceSource(history+'/page-map.json',JSON.stringify(revise(pageMap),null,2));
 await writeScienceSource(history+'/editorial-ledger.json',JSON.stringify({opener:{source:[1],paragraphs:opener},lesson,topicRelationships,glossary:{purpose:'Reference definitions for terms taught in the chapter',entries:glossary},summary,assessment:{purpose:'New retrieval and evidence-reasoning questions aligned to the revised lesson',questions:exercises}},null,2));
 await measureChapter1Justification();
 console.log(`Justified ${count} prose blocks on the existing Chapter 1 pages; retained page breaks and artwork.`);
 process.exit(0);
}
const map=[];
for(let i=0;i<pages.length;i++){
 const p=completeChapter1Page(pages[i]),n=i+1,verso=n%2===0;
 const running=i===0?'':'<g class="v2-header"><path class="v2-ribbon-underlay" d="M0 0H340L317 51Q312 63 291 63H0Z"/><path class="v2-ribbon" d="M0 0H321L300 49Q295 63 274 63H0Z"/>'+planeMotif(true)+''+label('CHAPTER '+number,96,41,'v2-ribbon-label se-running')+label(title,960,40,'v2-running se-running','end')+'<line class="v2-furniture-rule" x1="340" x2="963" y1="58" y2="58"/></g>';
 const foot='<g class="v2-footer">'+`<line class="v2-furniture-rule" x1="${verso?190:89}" x2="${verso?963:862}" y1="1485" y2="1485"/>`+label('LEARNLAB · SCIENCE '+grade,verso?963:89,1465,'v2-foot-label se-running',verso?'end':'start')+`<path class="v2-ribbon-underlay" d="${verso?'M0 1455H137Q152 1455 160 1470L179 1514H0Z':'M1052 1455H915Q900 1455 892 1470L873 1514H1052Z'}"/><path class="v2-ribbon" d="${verso?'M0 1455H117Q132 1455 140 1470L159 1514H0Z':'M1052 1455H935Q920 1455 912 1470L893 1514H1052Z'}"/>`+label(n,verso?107:945,1487,'v2-folio se-running','middle')+'</g>';
 const html=`<section class="page page--food page--science-editorial page--science-v2 page--v2-g7-ch01${i===0?' page--opener':''}" data-folio="${n}"${i===pages.length-1?' data-close':''}><div class="page__body"><div class="page__main"><svg class="food-sheet science-sheet science-editorial" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1052 1514" aria-label="${title}, page ${n}">${running}${p.parts}${foot}</svg></div></div></section>`;
 const aligned=alignChapter1Figures(html);
 scienceContract('Chapter 1 V2 '+n,aligned);await writeScienceSource(`${dir}/p${String(n).padStart(3,'0')}.html`,aligned);
 map.push({page:n,title:p.title,titleRole:p.titleRole,sourcePages:p.source,pageIllustration:p.pageIllustration?{file:p.pageIllustration.file,caption:p.pageIllustration.caption}:undefined,end:p.end,fill:Math.round((p.end-112)/1303*100),breakReason:p.breakReason,blocks:p.blockAudit,protectedNext:p.protectedNext});
}
for(const file of await fs.readdir(dir))if(/^p\d+\.html$/.test(file)&&+file.slice(1,-5)>pages.length)await fs.unlink(path.join(dir,file));
await measureChapter1Justification();
await fs.mkdir(history,{recursive:true});
await writeScienceSource(history+'/page-map.json',JSON.stringify(map,null,2));
await writeScienceSource(history+'/editorial-ledger.json',JSON.stringify({opener:{source:[1],paragraphs:opener},lesson,topicRelationships,glossary:{purpose:'Reference definitions for terms taught in the chapter',entries:glossary},summary,assessment:{purpose:'New retrieval and evidence-reasoning questions aligned to the revised lesson',questions:exercises}},null,2));
console.log(`Chapter 1 V2: ${pages.length} pages; ${fitted.length} lesson pages; ${blocks.length} protected/prose blocks.\n`+map.map(p=>`p${p.page}: ${p.fill}% ${p.title||'continued lesson'}`).join('\n'));
