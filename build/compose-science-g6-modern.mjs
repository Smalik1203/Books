import {pageIllustration,hasContentImage,pageImageReserve} from './science-page-illustrations.mjs';
// Class 6's current edited content, using Class 7's typography and protected pagination.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
import {chapterOpener} from './chapter-opener.mjs';
import {refitV2Lesson} from './refit-science-v2-blocks.mjs';
import {scienceContract} from './science-contract.mjs';
import {editClass6} from './science-g6-modern-editorial.mjs';
import {v2PanelIconPath} from './science-v2-cues.mjs';
import {scienceHeaderArt} from './science-header-art.mjs';
const history='assets/design-history/science-g6-modern';
const chapters=JSON.parse(await fs.readFile(history+'/content.json','utf8'));
async function writeSource(file,body){
 if(await fs.readFile(file,'utf8').catch(()=>null)===body)return;
 for(let attempt=0;;attempt++)try{await fs.writeFile(file,body);return;}catch(e){
  if(attempt===8||!['UNKNOWN','EBUSY','EPERM'].includes(e.code))throw e;
  await new Promise(resolve=>setTimeout(resolve,150));
 }
}
const E=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const text=s=>s.replace(/<[^>]*>/g,' ').replaceAll('&#x27;',"'").replaceAll('&amp;','&').replace(/\s+/g,' ').trim();
const unit=189/1052*96/25.4;
const titles={1:['The Wonderful','World of Science'],2:['Diversity in the','Living World'],3:['Food on','Our Plate'],4:['Exploring','Magnets'],10:['The Living','World']};
let currentChapter;
const icon=kind=>{
 const shared=kind==='think'&&['1','2','3','4','10'].includes(currentChapter);
 const d=shared?v2PanelIconPath('think'):currentChapter==='10'?v2PanelIconPath(kind):kind==='setup'?'M16 16l6 6M18 10A8 8 0 1 1 2 10A8 8 0 1 1 18 10':'M8 8a4 4 0 1 1 6 3.5c-2 1-2 2-2 3.5M12 19h.01';
 return `<svg class="g6-panel__icon${shared?' g6-panel__icon--shared-think':''}" viewBox="0 0 24 24" aria-hidden="true"><path d="${d}"/></svg>`;
};
const motif=(n,running=false)=>{
 if(!running&&['1','2','3','4','10'].includes(String(n)))return scienceHeaderArt(6,n);
 const shapes=n==='4'?'<path d="M18 12v35a26 26 0 0 0 52 0V12H56v35a12 12 0 0 1-24 0V12ZM18 30h14M56 30h14"/>':n==='3'?'<circle cx="44" cy="44" r="33"/><circle cx="44" cy="44" r="23"/>':n==='2'||n==='10'?'<path d="M45 85Q28 46 60 6M43 66Q14 67 9 45Q35 42 43 66ZM44 45Q48 16 77 16Q75 43 44 45ZM48 30Q19 32 16 8Q41 8 48 30Z"/>':'<circle cx="38" cy="35" r="25"/><path d="M57 54l25 26M26 35h24M38 23v24"/>';
 return `<g class="g6-motif" transform="${running?'translate(22 8) scale(.48)':'translate(942 88) scale(.9)'}">${shapes}</g>`;
};
function art(a,opener=false){
 const labelled=/<text\b/.test(a.svg||''),limit=opener?(currentChapter==='10'?520:390):labelled?900:400;
 const scale=Math.min(874/a.w,limit/a.h,1),dimensions=`width="${a.w*scale*unit}" height="${a.h*scale*unit}"`;
 if(a.kind==='image')return `<svg class="g6-art-image${opener?' g6-art-opener':''}" ${dimensions} viewBox="0 0 ${a.w} ${a.h}" xmlns="http://www.w3.org/2000/svg"><image href="${E(a.src)}" x="0" y="0" width="${a.w}" height="${a.h}" preserveAspectRatio="xMidYMid meet"><title>${E(a.alt)}</title></image></svg>`;
 return a.svg.replace(/ data-original-bounds="[^"]*"/g,'').replace(/ data-justified="[^"]*"/g,'').replace(/\bdx="[^"]*"/g,'').replace(/<svg\b([^>]*)>/,(_,attrs)=>'<svg '+attrs.replace(/\s(?:width|height|x|y)="[^"]*"/g,'').replace(/class="[^"]*"/,'')+` ${dimensions} class="${currentChapter==='10'?(attrs.match(/class="([^"]*)"/)?.[1]||'')+' ':''}g6-source-art${labelled?' g6-art-labelled':''}${opener?' g6-art-opener':''}">`);
}
function render(b,inside=false){
 let html='';
 if(b.type==='heading')html=`<h${b.level||3}>${b.html}</h${b.level||3}>`;
 else if(b.type==='question')html=`<ol class="g6-questions" start="${b.number}"><li><p>${b.html}</p><ol class="g6-options">${b.options.map(x=>`<li>${x}</li>`).join('')}</ol></li></ol>`;
 else if(b.type==='options')html=`<ol class="g6-options">${b.items.map(x=>`<li>${x}</li>`).join('')}</ol>`;
 else if(b.type==='lesson-group')html=b.blocks.map(x=>render(x,true)).join('');
 else if(b.type==='paragraph'){
  const match=b.html.match(/^•\s*(.*)/s);html=match?`<p class="g6-bullet">${match[1]}</p>`:`<p>${b.html}</p>`;
 }else if(b.type==='caption'||b.type==='table-caption')html=`<p class="g6-caption">${b.html}</p>`;
 else if(b.type==='feature')html=`<div class="g6-feature-label">${b.html}</div>`;
 else if(b.type==='figure')html=`<figure class="g6-figure"><div class="g6-art">${b.art.map(a=>art(a,b.opener)).join('')}</div>${b.caption?`<figcaption>${b.caption}</figcaption>`:''}</figure>`;
 else if(b.type==='figure-pair')html=`<div class="g6-photo-pair">${b.figures.map(x=>render(x,true)).join('')}</div>`;
 else if(b.type==='table')html=`<div class="g6-table-wrap"><table>${b.caption?`<caption>${b.caption}</caption>`:''}<thead><tr>${b.rows[0].map(c=>`<th scope="col">${c.html}</th>`).join('')}</tr></thead><tbody>${b.rows.slice(1).map(r=>'<tr>'+r.map(c=>`<td>${c.html}${(c.images||[]).map(a=>`<img class="g6-table-image" src="${E(a.src)}" alt="${E(a.alt||'')}"/>`).join('')}</td>`).join('')+'</tr>').join('')}</tbody></table></div>`;
 else if(b.type==='panel'){
  let step=0;
  const children=b.blocks.map(x=>{
   if(b.kind==='setup'&&x.step){step++;return `<div class="g6-block"><div class="g6-step"><span class="g6-step__number">${step}.</span><p>${x.html}</p></div></div>`;}
   return render(x,true);
  }).join('');
  html=`<div class="g6-panel g6-panel--${b.kind}">${b.kind==='glossary'?'':`<div class="g6-panel__title">${icon(b.kind)}${b.kind==='setup'?'Investigate':'Think It Through'}</div>`}<div class="g6-panel__body">${children}</div></div>`;
 }else if(b.type==='reference-group')html=`<div class="g6-reference-columns">${b.blocks.map(x=>render(x,true)).join('')}</div>`;
 else if(b.type==='media')html=`<div class="g6-media"><div>${b.blocks.map(x=>render(x,true)).join('')}</div>${render(b.figure,true)}</div>`;
 else if(b.type==='summary-group'){
  const items=[...b.blocks];let lead='';
  if(currentChapter==='3'){
   const first=items.splice(0,2),asset=pageIllustration('',6,3);
   lead=render(first[0],true)+`<div class="g6-summary-illustrated-lead"><div>${render(first[1],true)}</div><svg width="${190*unit}" height="${140*unit}" viewBox="0 0 190 140" xmlns="http://www.w3.org/2000/svg"><image href="../../${asset.file}" width="190" height="140" preserveAspectRatio="xMidYMid meet"><title>${E(asset.caption)}</title></image></svg></div>`;
  }
  html=`<div class="g6-summary">${lead}${items.map(x=>render(x,true)).join('')}</div>`;
 }
 else throw Error('Unknown content type '+b.type);
 return `<div class="g6-block${b.type==='heading'?' g6-block--heading':''}${b.intro?' g6-intro':''}"${b.id?` data-block="${b.id}"`:''}>${html}</div>`;
}
const styles=`<link rel="stylesheet" href="../../css/book.css"><link rel="stylesheet" href="../../css/reference-fonts.css"><link rel="stylesheet" href="../../css/food-reference.css"><link rel="stylesheet" href="../../css/science-editorial.css"><link rel="stylesheet" href="../../css/science-locked.css"><link rel="stylesheet" href="../../css/edition-science-tall.css"><link rel="stylesheet" href="../../css/science-v2-fonts.css"><link rel="stylesheet" href="../../css/science-v2.css"><link rel="stylesheet" href="../../css/palette-science-g6-modern.css">`;
const heading=s=>({type:'heading',level:2,html:s});
for(const raw of chapters){
 const {ch,ledger}=editClass6(structuredClone(raw));
 const number=ch.config.number;if(process.argv[2]&&process.argv[2]!==number)continue;
 currentChapter=String(number);
 const blocks=structuredClone(ch.blocks),dir='pages/class-6/'+ch.dir,record=history+'/'+ch.dir;
 await fs.mkdir(record,{recursive:true});
 await fs.writeFile(record+'/editorial-ledger.json',JSON.stringify(ledger,null,2));
 // The content model is deliberately independent of the old compositor.
 const openerArtIndex=blocks.findIndex(b=>b.type==='figure');
 const openerArt=blocks.splice(openerArtIndex,1)[0];openerArt.opener=true;
 const opening=[];
 if(number==='1'){
  const h=blocks.shift();opening.push(...blocks.splice(0,2),h);
  while(blocks[0]?.source==='p001.html')opening.push(blocks.shift());
 }else {
  while(blocks.length&&blocks[0].source==='p001.html'&&blocks[0].type!=='heading')opening.push(blocks.shift());
 }
 if(opening[0]?.type==='paragraph')opening[0].intro=true;
 const groups=[];let current={role:'lesson',blocks:[]};
 for(const b of blocks){
  const label=b.type==='heading'?text(b.html):'';
  let role=/^(Keywords|KEYWORDS|Words to use accurately)$/.test(label)?'glossary':/^(Summary|Recap|What this chapter established)/.test(label)?'summary':/^(Let Us Enhance|Practice — Recall|Explain without looking back)/.test(label)?'assessment':/^(Learning Further|Beyond the Book|Explore Further)/.test(label)?'projects':null;
  if(b.bridge&&!current.bridge)role='bridge';
  if(role&&role!==current.role){if(current.blocks.length)groups.push(current);current={role,bridge:b.bridge,blocks:[]};}
  if(role==='glossary')b.html='Keywords';if(role==='summary')b.html='Summary';
  current.blocks.push(b);
 }
 if(current.blocks.length)groups.push(current);
 for(let i=0;i<groups.length-1;i++)while(groups[i].blocks.at(-1)?.type==='heading')groups[i+1].blocks.unshift(groups[i].blocks.pop());
 // Keep reference pages together, including summaries previously divided over leaves.
 for(const g of groups)if(g.role==='glossary'){
  // A long keyword list needs two complete reference panels to leave room for
  // a useful illustration at the unchanged reading size. Never split a box.
  g.blocks=g.blocks.flatMap(b=>b.type==='panel'&&b.kind==='glossary'&&b.blocks.length>20?
   [{...b,id:b.id+'-a',blocks:b.blocks.slice(0,12)},
    {id:b.id+'-continued',type:'heading',level:2,html:'Keywords',source:b.source},
    {...b,id:b.id+'-b',blocks:b.blocks.slice(12)}]:[b]);
  const rest=g.blocks.slice(1);
  if(!rest.some(b=>b.type==='panel'))g.blocks=[g.blocks[0],{id:`g6-${number}-glossary`,type:'reference-group',blocks:rest,source:rest.map(b=>b.source).join(',')}];
 }
 for(const g of groups)if(g.role==='summary')g.blocks=[{id:`g6-${number}-summary`,type:'summary-group',blocks:g.blocks,source:g.blocks.map(b=>b.source).join(',')}];
 // Food's brief keyword index belongs with the closing lesson, not on a mostly empty leaf.
 if(String(number)==='3')for(let i=1;i<groups.length;i++)if(groups[i].role==='glossary'&&groups[i-1].role==='lesson'){
  groups[i-1].blocks.push(...groups[i].blocks);groups.splice(i,1);break;
 }
 for(let i=0;i<groups.length-1;i++)if(groups[i].role==='glossary'&&groups[i+1].role==='summary'){
  groups[i].role='reference';groups[i].blocks.push(...groups[i+1].blocks);groups.splice(i+1,1);
 }
 const all=[openerArt,...opening,...groups.flatMap(g=>g.blocks)];
 const probe=`build/class-6/${ch.dir}-modern-measure.html`;
 await fs.writeFile(probe,`<!doctype html><html><meta charset="utf-8">${styles}<body><section class="page page--food page--science-editorial page--science-v2 page--g6-modern" data-science-chapter="${number}"><div class="g6-measure">${all.map(b=>render(b)).join('')}</div></section><script>onload=async()=>{await document.fonts.ready;const out=[...document.querySelector('.g6-measure').children].map(e=>({id:e.dataset.block,h:e.getBoundingClientRect().height}));document.body.textContent=JSON.stringify(out);};</script></body></html>`);
 const {stdout}=await promisify(execFile)('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--virtual-time-budget=15000','--dump-dom',pathToFileURL(path.resolve(probe)).href],{maxBuffer:8e6});
 const measured=JSON.parse(stdout.match(/<body>([\s\S]*?)<\/body>/)[1]);await fs.unlink(probe);
 const heights=new Map(measured.map(x=>[x.id,x.h/unit]));
 await fs.writeFile(record+'/measured-blocks.json',JSON.stringify(all.map(b=>({id:b.id,type:b.type,height:heights.get(b.id)})),null,2));
 const pages=[];let openerHeight=0;const first=[openerArt];
 for(const b of opening){if(openerHeight+heights.get(b.id)+heights.get(openerArt.id)>1067)break;first.push(b);openerHeight+=heights.get(b.id);}
 const left=opening.slice(first.length-1);if(left.length)groups[0].blocks.unshift(...left);
 // Pull the next complete teaching unit onto a short opener; never strand a heading.
 let remaining=1067-first.reduce((s,b)=>s+heights.get(b.id),0),take=0,total=0;
 for(let i=0;i<groups[0].blocks.length;i++){
  total+=heights.get(groups[0].blocks[i].id);if(total>remaining)break;
  const trial=groups[0].blocks.slice(0,i+1);let legal=trial.at(-1).type!=='heading'&&trial.at(-1).type!=='feature';
  for(let j=0;j<trial.length;j++)if(trial[j].type==='heading'){
   let after=0;for(let k=j+1;k<trial.length;k++){if(trial[k].type==='heading')break;after+=heights.get(trial[k].id);}
   const nextHeading=groups[0].blocks.findIndex((b,k)=>k>j&&b.type==='heading');
   if(after<160&&nextHeading>i+1)legal=false;
  }
  if(legal)take=i+1;
 }
 first.push(...groups[0].blocks.splice(0,take));
 pages.push({role:'opener',blocks:first,end:348+first.reduce((s,b)=>s+heights.get(b.id),0)});
 for(const g of groups){
  const units=g.blocks.map((b,i)=>({atomId:b.id,type:b.type,top:0,h:heights.get(b.id)-(b.type==='heading'?12:0),html:render(b),text:text(b.html||b.caption||''),source:[b.source],keepNext:!!b.keepNext||b.type==='feature'||b.type==='paragraph'&&g.blocks[i+1]?.type==='figure'&&/^\d+\./.test(text(b.html)),model:b}));
  for(let i=0;i<units.length;i++)if(units[i].type==='heading'){
   let height=0;for(let j=i+1;j<units.length&&units[j].type!=='heading';j++)height+=units[j].h;
   units[i].completeUnitHeight=Math.min(160,height);
  }
  let packed;try{packed=refitV2Lesson([{blocks:units}],{imageReserve:pageImageReserve});}catch(e){throw Error(`Chapter ${number} / ${g.role}: ${e.message}`);}
  for(const p of packed)pages.push({...p,role:g.role,bridge:g.bridge,blocks:p.blocks.map(b=>b.model)});
 }
 const band=chapterOpener({number,titleLines:titles[number],id:'g6-'+number,height:310,motif:'none',bleed:3*1052/189,image:{href:'opener-rendered-in-flow',aspect:2}}).html.replace(/<image\b[\s\S]*?<\/image>/,'').replace(/<image\b[^>]*\/?>/,'')+motif(number);
 const label=(s,x,y,c,anchor='start')=>`<text class="${c}" x="${x}" y="${y}" text-anchor="${anchor}">${E(s)}</text>`;
 const map=[];let bridgeIndex=100,bodyIndex=0;
 for(const [i,p] of pages.entries()){
  let pageContent=p.blocks.map(b=>render(b)).join('\n');
  if(!hasContentImage(pageContent)){const a=pageIllustration(pageContent,6,number);if(p.end+a.height>1415)throw Error('Required image does not fit '+number+'/'+(i+1));pageContent+=`<svg class="g6-page-image" width="${874*unit}" height="${a.height*unit}" viewBox="89 0 874 ${a.height}" xmlns="http://www.w3.org/2000/svg">${a.html}</svg>`;p.end+=a.height;p.pageIllustration={file:a.file,caption:a.caption};}
  const n=i+1,verso=n%2===0;const filename='p'+String(p.bridge?++bridgeIndex:++bodyIndex).padStart(3,'0')+'.html';
  const running=i===0?band:`<g class="v2-header"><path class="v2-ribbon-underlay" d="M0 0H340L317 51Q312 63 291 63H0Z"/><path class="v2-ribbon" d="M0 0H321L300 49Q295 63 274 63H0Z"/>${motif(number,true)}${label('CHAPTER '+number,96,41,'v2-ribbon-label se-running')}${label(ch.config.title+(p.bridge?' · Beyond the Book':''),960,40,'v2-running se-running','end')}<line class="v2-furniture-rule" x1="340" x2="963" y1="58" y2="58"/></g>`;
  const footer=`<g class="v2-footer"><line class="v2-furniture-rule" x1="${verso?190:89}" x2="${verso?963:862}" y1="1485" y2="1485"/>${label('LEARNLAB · SCIENCE 6',verso?963:89,1465,'v2-foot-label se-running',verso?'end':'start')}<path class="v2-ribbon-underlay" d="${verso?'M0 1455H137Q152 1455 160 1470L179 1514H0Z':'M1052 1455H915Q900 1455 892 1470L873 1514H1052Z'}"/><path class="v2-ribbon" d="${verso?'M0 1455H117Q132 1455 140 1470L159 1514H0Z':'M1052 1455H935Q920 1455 912 1470L893 1514H1052Z'}"/>${label(n,verso?107:945,1487,'v2-folio se-running','middle')}</g>`;
  const close=i===pages.length-1||!p.bridge&&pages[i+1]?.bridge;
  const html=`<section class="page page--food page--science-editorial page--science-v2 page--g6-modern${i===0?' page--opener':''}" data-science-chapter="${number}" data-folio="${n}"${p.bridge?' data-bridge':''}${close?' data-close':''}><div class="page__body"><div class="page__main"><svg class="g6-furniture" viewBox="0 0 1052 1514" xmlns="http://www.w3.org/2000/svg">${running}${footer}</svg><div class="g6-content${i===0?' g6-content--opener':''}">${pageContent}</div></div></div></section>`;
  scienceContract(ch.dir+'/'+filename,html);await writeSource(dir+'/'+filename,html);
  map.push({page:n,file:filename,role:p.role,pageIllustration:p.pageIllustration,end:p.end,blocks:p.blocks.map(b=>({id:b.id,type:b.type,source:b.source})),protectedNext:p.protectedNext,breakReason:p.breakReason});
 }
 for(const file of await fs.readdir(dir))if(/^p\d+\.html$/.test(file)&&!map.some(p=>p.file===file))await fs.unlink(dir+'/'+file);
 await writeSource(dir+'/chapter.json',JSON.stringify({...ch.config,edition:'science-tall',design:'science-editorial',profile:'science-v2',palette:'science-g6-modern'},null,2)+'\n');
 await fs.writeFile(record+'/page-map.json',JSON.stringify(map,null,2));
 console.log(`Chapter ${number}: ${pages.length} pages; ${groups.map(g=>g.role+':'+g.blocks.length).join(', ')}`);
}
