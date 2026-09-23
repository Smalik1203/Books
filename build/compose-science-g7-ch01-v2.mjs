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
import {v2PanelHeading} from './science-v2-cues.mjs';
import {refitV2Lesson} from './refit-science-v2-blocks.mjs';
import {scienceContract} from './science-contract.mjs';
import {sheetMetrics} from './sheet.mjs';

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
function wrap(s,w=874,k='n',scale=1){const rows=[];let row=[],used=0;for(const token of tokens(s)){const size=token.reduce((a,p)=>{const value=widths[k==='n'?p.k:k][p.s];if(value===undefined)throw Error('Unmeasured word: '+p.s);return a+value*scale;},0);if(row.length&&used+widths[k][' ']*scale+size>w-5){rows.push(row);row=[];used=0;}if(row.length)used+=widths[k][' ']*scale;row.push(token);used+=size;}if(row.length)rows.push(row);return rows;}
const word=parts=>parts.map(p=>p.k==='n'?E(p.s):`<tspan class="${p.k==='b'?'se-bold':'se-italic'}">${E(p.s)}</tspan>`).join('');
function lines(rows,x,y,cls='se-copy',lead=32,size=24){return `<text class="${cls}" x="${x}" y="${y+size}">${rows.map((r,i)=>`<tspan x="${x}"${i?` dy="${lead}"`:''}>${r.map(word).join(' ')}</tspan>`).join('')}</text>`;}
const label=(s,x,y,cls='se-caption',anchor='start')=>`<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${E(s)}</text>`;
const image=(file,x,y,w,h)=>`<image class="science-illustration" href="../../figures/class-${grade}/science/ch01-v2/${file}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;
const caption=(s,y)=>{const rows=wrap(s,874,'n',.87);return {html:lines(rows,89,y,'se-caption',27,20.88),h:rows.length*27};};
function paragraph(s,{x=89,w=874,y=0,gap=16,cls='se-copy',scale=1,k='n',lead=32}={}){const rows=wrap(s,w,k,scale);return {html:lines(rows,x,y,cls,lead,24*scale),h:rows.length*lead+gap};}
const blocks=[];
function add(meta,html,h,extra={}){blocks.push({atomId:meta.id,type:meta.type,top:0,h,html,source:meta.source||[],text:meta.text||meta.caption||meta.paragraphs?.join(' ')||'',...extra});}
function body(meta){const rows=wrap(meta.text),chunks=[];for(let i=0;i<rows.length;){const n=rows.length-i>3?2:rows.length-i;chunks.push(rows.slice(i,i+n));i+=n;}chunks.forEach((rows,i)=>add({...meta,id:meta.id+'-'+i},lines(rows,89,0),rows.length*32+(i===chunks.length-1?16:0),{paragraphPart:i,paragraphParts:chunks.length}));}
function bulletList(items,x,w,y=0){let html='';for(const s of items){const p=paragraph(s,{x:x+23,w:w-23,y,gap:10});html+=label('•',x,y+24,'se-copy')+p.html;y+=p.h;}return {html,h:y};}
function render(meta){
 if(meta.comparisonTable){const t=comparisonTableBlock(meta,{wrap,lines});return add(meta,t.html,t.h,{conceptId:meta.id});}
 if(meta.type==='body')return body(meta);
 if(meta.type==='heading'){const major=meta.level!==2,rows=wrap(meta.text,874,'h',major?38/30:1);return add(meta,lines(rows,89,0,major?'v2-title':'se-heading',major?46:36,major?38:30),rows.length*(major?46:36)+12,{role:major?'section':'subtopic'});}
 if(meta.type==='panel'){
  let y=68,html='';for(const [index,s] of meta.paragraphs.entries()){const match=s.match(/^(\d+)\. (.*)$/),p=paragraph(match?match[2]:s,{x:match?146:113,w:match?793:826,y,gap:12});if(match)html+=label(match[1]+'.',132,y+24,'se-activity-step','end');html+=p.html;y+=p.h;if(index===0&&meta.figure==='plane-setup'){const art=setupDiagram(y,label);html+=art.html;y+=art.h;}}
  const h=y+10,kind=meta.kind==='setup'?'se-activity-panel':'se-prompt se-thought-panel';
  const header=meta.kind==='setup'?`<path class="v2-activity-header" d="M107 0H945Q963 0 963 18V58H89V18Q89 0 107 0Z"/>`:'';
  return add({...meta,type:meta.kind==='setup'?'activity':'panel'},`<rect class="${kind}" x="89" y="0" width="874" height="${h}" rx="18"/>`+header+v2PanelHeading(meta.kind,113,meta.kind==='setup'?39:43)+html,h+22,{conceptId:meta.id});
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
    const explanation=lesson.find(b=>b.id===relatedId),t=explanation.comparisonTable?comparisonTableBlock(explanation,{wrap,lines}):null,p=t?{html:`<g transform="translate(0 ${y})">${t.html}</g>`,h:t.h}:paragraph(explanation.text,{y});
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
const fitted=refitV2Lesson([{blocks}]);
const band=chapterOpener({id:'science-v2-g7-ch01',number,titleLines:['The Ever-Evolving','World of Science'],bleed:Math.ceil(metrics.bleed*1052/metrics.trimW),image:{href:`../../figures/class-${grade}/science/ch01-v2/opener.png`,aspect:1.5,alt:'Students observing a paper-plane flight in a clear school hall'}});
const motif=planeMotif();
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
const map=[];
for(let i=0;i<pages.length;i++){
 const p=pages[i],n=i+1,verso=n%2===0;
 const running=i===0?'':'<g class="v2-header"><path class="v2-ribbon-underlay" d="M0 0H340L317 51Q312 63 291 63H0Z"/><path class="v2-ribbon" d="M0 0H321L300 49Q295 63 274 63H0Z"/>'+planeMotif(true)+''+label('CHAPTER '+number,96,41,'v2-ribbon-label se-running')+label(title,960,40,'v2-running se-running','end')+'<line class="v2-furniture-rule" x1="340" x2="963" y1="58" y2="58"/></g>';
 const foot='<g class="v2-footer">'+`<line class="v2-furniture-rule" x1="${verso?190:89}" x2="${verso?963:862}" y1="1485" y2="1485"/>`+label('LEARNLAB · SCIENCE '+grade,verso?963:89,1465,'v2-foot-label se-running',verso?'end':'start')+`<path class="v2-ribbon-underlay" d="${verso?'M0 1455H137Q152 1455 160 1470L179 1514H0Z':'M1052 1455H915Q900 1455 892 1470L873 1514H1052Z'}"/><path class="v2-ribbon" d="${verso?'M0 1455H117Q132 1455 140 1470L159 1514H0Z':'M1052 1455H935Q920 1455 912 1470L893 1514H1052Z'}"/>`+label(n,verso?107:945,1487,'v2-folio se-running','middle')+'</g>';
 const html=`<section class="page page--food page--science-editorial page--science-v2 page--v2-g7-ch01${i===0?' page--opener':''}" data-folio="${n}"${i===pages.length-1?' data-close':''}><div class="page__body"><div class="page__main"><svg class="food-sheet science-sheet science-editorial" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1052 1514" aria-label="${title}, page ${n}">${running}${p.parts}${foot}</svg></div></div></section>`;
 scienceContract('Chapter 1 V2 '+n,html);await fs.writeFile(`${dir}/p${String(n).padStart(3,'0')}.html`,html);
 map.push({page:n,title:p.title,titleRole:p.titleRole,sourcePages:p.source,end:p.end,fill:Math.round((p.end-112)/1303*100),breakReason:p.breakReason,blocks:p.blockAudit,protectedNext:p.protectedNext});
}
for(const file of await fs.readdir(dir))if(/^p\d+\.html$/.test(file)&&+file.slice(1,-5)>pages.length)await fs.unlink(path.join(dir,file));
await fs.mkdir(history,{recursive:true});
await fs.writeFile(history+'/page-map.json',JSON.stringify(map,null,2));
await fs.writeFile(history+'/editorial-ledger.json',JSON.stringify({opener:{source:[1],paragraphs:opener},lesson,topicRelationships,glossary:{purpose:'Reference definitions for terms taught in the chapter',entries:glossary},summary,assessment:{purpose:'New retrieval and evidence-reasoning questions aligned to the revised lesson',questions:exercises}},null,2));
console.log(`Chapter 1 V2: ${pages.length} pages; ${fitted.length} lesson pages; ${blocks.length} protected/prose blocks.\n`+map.map(p=>`p${p.page}: ${p.fill}% ${p.title||'continued lesson'}`).join('\n'));
