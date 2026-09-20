import fs from 'node:fs/promises';
import {scienceContract} from './science-contract.mjs';
import {refitV2Lesson} from './refit-science-v2-blocks.mjs';
import {sheetMetrics} from './sheet.mjs';
import {chapterOpener,botanicalMotif} from './chapter-opener.mjs';
import {enrichments} from './science-v2-enrichment.mjs';

export async function composeV2(atoms,{wrap,linesSVG,label,dir,E,comparison,think,plantThinking,conservationThinking,refinementLedger,reviseProse}) {
 const config=JSON.parse(await fs.readFile(`${dir}/chapter.json`,'utf8'));
 const sheetSize=await sheetMetrics(process.cwd(),config.edition);
 const openerBleed=Math.ceil(sheetSize.bleed*1052/sheetSize.trimW);
 const pages=[], audit=[], additions=[];
 const groups=n=>atoms.filter(a=>a.sourcePage===n);
 // Headings belong to the lesson outline, never to the page template.
 const continuationTitles=new Set([
  'Read the field records','A record is evidence','A Grouping Needs a Clear Rule',
  'Herbs, Shrubs and Trees','Two Patterns','Two Kinds of Root','The Two Go Together',
  'Compare the evidence','Continue the investigation','What Movement Tells Us',
  'Built for the Place','Put your ideas to work'
 ]);
 const referenceTitles=new Set(['Keywords','Summary','Let Us Enhance Our Learning','Learning Further']);
 function headingStyle(original){
  const text=continuationTitles.has(original)?'':original==='A Pattern Appears'?'Comparing Leaves and Roots':original;
  const major=/^2\.\d\s/.test(text)||referenceTitles.has(text);
  const size=major?38:30,lead=major?46:36,after=12;
  const lines=text?wrap(text,874,'h',size/30):[];
  return {text,lines,size,lead,height:lines.length*lead+(text?after:0),cls:major?'v2-title':'se-heading',role:text?(major?'section':'subtopic'):'continuation'};
 }
 function prepare(list){return list.flatMap(a=>{
  if(a.type!=='heading')return [a];
  const style=headingStyle(a.text);
  return style.text?[{...a,text:style.text,h:style.height,render:y=>linesSVG(style.lines,89,y,style.cls,style.lead,style.size)}]:[];
 });}
 const image=(key,x,y,w,h)=>`<image class="science-illustration" href="../../figures/class-6/science/ch02-v2/${key}.png" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;
 function sheet(title,source,build){
  let y=112,parts=[],blocks=[],depth=0;
  const capture=(type,draw,meta={})=>{
   const top=y,start=parts.length,outer=depth++===0;draw();depth--;
   if(outer)blocks.push({type,top,h:y-top,html:parts.slice(start).join('\n'),source,...meta});
  };
  const style=headingStyle(title);title=style.text;
  if(title)capture('heading',()=>{parts.push(linesSVG(style.lines,89,y,style.cls,style.lead,style.size));y+=style.height;},{text:title,role:style.role});
  const appendAddition=(s,x=89,w=874,gap=16)=>{
   const addition=enrichments.find(e=>s.startsWith(e.after));
   if(!addition)return;
   if(additions.some(e=>e.id===addition.id))throw Error('Repeated enrichment anchor: '+addition.id);
   additions.push({...addition,anchorText:s});
   for(const paragraph of addition.paragraphs)text(paragraph,x,w,gap);
  };
  const text=(s,x=89,w=874,gap=16)=>{
   if(s.startsWith('Go outside your classroom.'))return capture('body',()=>{const lines=wrap(s,w,'b',26/24);parts.push(linesSVG(lines,x,y,'se-copy v2-intro',34,26));y+=lines.length*34+20;},{text:s});
   if(s.startsWith('In these two example tables, a dash means')){
    if(!refinementLedger.some(r=>r.before===s))refinementLedger.push({before:s,after:['— means not recorded; it does not mean absent. A flower not seen today may appear in another season.'],reason:'Legend attached directly to each sample table instead of a detached paragraph.'});
    return;
   }
   if(s.startsWith('A banana plant is a large herb')){
    refinementLedger.push({before:s,after:[plantThinking],reason:'Height versus stem evidence thinking pause.'});return pause(plantThinking,'plant-classification');
   }
   const cmp=comparison(s,x,w);
   if(cmp)return capture('comparison',()=>{parts.push(cmp.render(y));y+=cmp.h;},{text:s,comparisonTitle:cmp.title,comparisonItems:cmp.items.map((text,i)=>({id:`${cmp.title}-${i+1}`,text}))});
   s=reviseProse(s);
   const bullet=s.startsWith('• '),indent=bullet?23:0;
   const ls=wrap(bullet?s.slice(2):s,w-6-indent),chunks=[];
   // Open prose can continue overleaf with at least two lines on either side.
   for(let i=0;i<ls.length;){const n=ls.length-i>3?2:ls.length-i;chunks.push(ls.slice(i,i+n));i+=n;}
   const follows=/^Now put all three findings together\.|^Habitats can be sorted into two broad kinds\.|^\*\*[1267]\.\*\*|^Horse · Dolphin/.test(s);
   chunks.forEach((chunk,i)=>capture('body',()=>{parts.push((bullet&&i===0?label('•',x,y+24,'se-copy'):'')+linesSVG(chunk,x+indent,y));y+=chunk.length*32+(i===chunks.length-1?gap:0);},{text:s,paragraphPart:i,paragraphParts:chunks.length,keepNext:follows}));
   appendAddition(s,x,w,gap);
  };
  const keep=a=>{
   if(a.type==='body'&&!a.text.startsWith('Inherited features')&&!a.text.startsWith('Also separate an observation'))return text(a.text);
   const keepAddition=enrichments.some(e=>e.keepWithAnchor&&(a.revisedText||a.text).startsWith(e.after));
   capture(a.type,()=>{parts.push(a.render(y));y+=a.h;},{text:a.revisedText||a.text,atomId:a.id,keepNext:a.keepNext||keepAddition,comparisonTitle:a.comparisonTitle,role:a.type==='heading'?headingStyle(a.text).role:undefined});
   appendAddition(a.revisedText||a.text);
  };
  // Comparison columns already have a clear natural end; a second separator
  // made their following explanation look like a disconnected topic.
  const rule=()=>{};
  const pic=(key,h,captions=[])=>capture('figure',()=>{h=Math.min(h,key==='forms-v2'?380:350);parts.push(image(key,89,y,874,h));y+=h;captions.forEach(([s,x])=>parts.push(label(s,x,y+27,'se-caption','middle')));y+=captions.length?49:20;},{artKey:key,keepNext:['forms-v2','climbers','veins','roots','desert','camels'].includes(key)});
  const cols=(ss)=>capture('comparison',()=>{const w=(874-32*(ss.length-1))/ss.length,top=y;let bottom=y;ss.forEach((s,i)=>{y=top;for(const p of Array.isArray(s)?s:[s])text(p,89+i*(w+32),w,16);bottom=Math.max(bottom,y);});y=bottom+12;},{comparisonItems:ss.flatMap(s=>(Array.isArray(s)?s:[s]).flatMap(p=>{const c=comparison(p);return c?c.items.map((text,i)=>({id:`${c.title}-${i+1}`,alternative:c.title,text})):[];}))});
  const sub=s=>capture('heading',()=>{parts.push(label(s,89,y+30,'se-heading'));y+=52;},{text:s,role:'subtopic'});
  const raw=(s,h)=>capture('graphic',()=>{parts.push(s);y+=h;});
  const group=fn=>capture('illustrated-note',fn);
  const pause=(s,id)=>capture('panel',()=>{const p=think(s);parts.push(p.render(y));y+=p.h;},{text:s,conceptId:id});
  build({text,keep,rule,pic,cols,sub,raw,group,pause,get y(){return y;},set y(v){y=v;}});
  pages.push({title,titleRole:style.role,source,parts:parts.join('\n'),blocks,end:y});
 }
 // Opener is a designed scene, with live typography and a separate reading entry.
 sheet('',[1],c=>{
  const opener=chapterOpener({id:'science-v2-ch02',number:config.number,titleLines:['Diversity in the','Living World'],bleed:openerBleed,motif:'leaf',image:{href:'../../figures/class-6/science/ch02-v2/opener-v2.png',aspect:1.5,alt:'Living things in a school garden'}});
  c.raw(opener.html,0);
  c.y=opener.bodyTop;
  for(const a of groups(1).filter(a=>a.type==='body'))c.text(a.text);
 });
 // A page turn does not introduce a topic. Continue with the next reading block.
 function normal(list,source){
  list=prepare(list);const title=list[0]?.type==='heading'?list.shift().text:'';
  if(list.length)sheet(title,source,c=>{for(const a of list)c.keep(a);});
 }
 const field=groups(2);sheet(field[0].text,[2],c=>{
  c.keep(field[1]);c.text(reviseProse(field[2].text)+' '+reviseProse(field[3].text));
  for(const a of field.slice(4))c.keep(a);
 });
 const records=groups(3);
 normal([
  records.find(a=>a.text.startsWith('In these two example tables')),
  records.find(a=>a.type==='table'),
  records.find(a=>a.text.startsWith('Read across a row')),
  records.find(a=>a.type==='figure'),
  records.find(a=>a.text.startsWith('The pictures show')),
  records.find(a=>a.text.startsWith('Were any two plants')),
 ],[3]);
 normal(groups(4),[4]);
 sheet('Living Things Need Each Other',[5],c=>{
  const a=groups(5);c.text(a[1].text);c.text(a[2].text);
  c.group(()=>{
   const t=c.y;
   const caption=(ls,x,y)=>ls.map((s,i)=>label(s,x,y+i*25,'se-caption')).join('');
   c.raw(image('tree-relationships',245,t,560,374)
    +caption(['Small plants','grow beneath','the canopy.'],89,t+240)
    +caption(['A branch','supports','a nest.'],821,t+65)
    +caption(['A bird feeds','on fallen','fruit.'],821,t+268)
    +`<path class="v2-figure-leader" d="M225 ${t+266}H270L402 ${t+314}M813 ${t+93}H778L639 ${t+115}M813 ${t+294}H761L650 ${t+321}"/>`,398);
  });
  c.text(a[3].text);
 });
 normal([groups(5)[4]],[5]);
 normal(groups(6),[6]);
 sheet('',[7],c=>{
  const a=groups(7);c.text(a[1].text);c.text(a[2].text);
  c.group(()=>{
   c.text('Compare these four leaves. You can sort the same set by its outline or by its edge.');
   const t=c.y;
   c.raw(image('leaf-sorting',89,t,414,276)
    +[['A',153],['B',264],['C',356],['D',462]].map(([s,x])=>label(s,x,t+298,'se-caption','middle')).join(''),0);
   const y=t+42;
   const rows=[['Grouping rule','First group','Second group'],['Outline','Broad: A, B','Narrow: C, D'],['Edge','Smooth: A, C','Toothed: B, D']];
   c.raw(`<rect class="se-table-head" x="535" y="${y}" width="428" height="60"/><rect class="v2-table-frame" x="535" y="${y}" width="428" height="180"/>`
    +[60,120].map(d=>`<line class="v2-rule" x1="535" x2="963" y1="${y+d}" y2="${y+d}"/>`).join('')
    +rows.map((r,i)=>r.map((s,j)=>label(s,[545,687,827][j],y+37+i*60,'se-caption')).join('')).join(''),326);
   c.text('Leaf C belongs with D when you compare outlines, but with A when you compare edges. The leaves have not changed; the grouping rule has.',89,874,18);
  });
 });
 normal([4,5,6,7].map(i=>groups(7)[i]),[7]);
 normal(groups(8),[8]);
 sheet('',[9],c=>{
  const a=groups(9);c.text(a[1].text);c.pic('forms-v2',460,[['Tomato · herb',235],['Rose · shrub',526],['Mango · tree',817]]);
  c.cols([a[2].text,a[3].text,a[4].text]);c.rule();c.text(a[5].text);c.text(a[7].text);
 });
 sheet('Plants That Cannot Stand Up',[10],c=>{
  const a=groups(10);c.text(a[1].text);c.pic('climbers',437,[['Grape vine · climber',308],['Pumpkin · creeper',744]]);c.cols([a[2].text,a[3].text]);c.rule();c.text(a[4].text);c.text(a[6].text);c.text(a[7].text);
 });
 normal(groups(11),[11]);
 sheet('',[12],c=>{const a=groups(12);c.text(a[1].text);c.pic('veins',437,[['Hibiscus',235],['Banana',526],['Grass',817]]);c.cols([a[2].text,a[3].text]);c.rule();for(const i of [5,6,7])c.text(a[i].text);});
 // The setup artwork sits beside a short preparation note, away from the result plate.
 const rootGroup=groups(13);
 normal(rootGroup,[13]);
 sheet('',[14],c=>{const a=groups(14);c.text(a[1].text);c.pic('roots',437,[['Chana · taproot',308],['Wheat · fibrous roots',744]]);c.cols([a[2].text,a[3].text]);c.rule();c.text(a[5].text);c.cols([a[6].text,a[7].text]);});
 normal(groups(15),[15]);
 // Seed explanation precedes the anatomical plate. Never split the plate itself.
 const seed=groups(17),seedFigure=seed.findIndex(a=>a.type==='figure');
 // The seed topic starts at the investigation, not at the next page's results.
 const seedPreparation=groups(16),seedTask=seedPreparation.findIndex(a=>a.type==='activity');
 normal([...seedPreparation.slice(0,seedTask),seed[0],...seedPreparation.slice(seedTask)],[16]);
 sheet('',[17],c=>{c.cols([seed[1].text,seed[2].text]);for(const a of seed.slice(3,seedFigure+1))c.keep(a);});normal([...seed.slice(seedFigure+1),...groups(18)],[17,18]);
 normal(groups(19),[19]);normal(groups(20),[20]);
 sheet('',[21],c=>{const a=groups(21);c.text(a[1].text+' '+a[3].text);c.pic('desert',437,[['Cactus · hot desert',308],['Deodar · cold mountain',744]]);c.cols([a[2].text,a[4].text]);c.rule();c.text(a[6].text);c.text(a[7].text);});
 sheet('Two Camels, Two Deserts',[22],c=>{const a=groups(22);c.text(a[1].text);c.text(a[2].text);c.pic('camels',390,[['Dromedary · one hump',308],['Bactrian · two humps',744]]);c.cols([a[3].text,a[4].text]);c.rule();c.text(a[6].text);c.text(a[7].text);});
 const adaptation=groups(23);
 // Put the foot plate immediately after the movement comparison it explains.
 normal([...adaptation.slice(0,4),adaptation[6],...adaptation.slice(4,6)],[23]);
 const habitat=groups(24);sheet(habitat[0].text,[24],c=>{for(const a of habitat.slice(1,5))c.keep(a);c.cols([habitat[5].text,habitat[6].text]);for(const a of habitat.slice(7))c.keep(a);});
 sheet('When a Habitat Is Lost',[25],c=>{
  const a=groups(25);for(const i of [1,2,3,4])c.text(a[i].text);
  c.rule();c.group(()=>{const top=c.y;c.raw(image('grove',89,top,414,276)+label('A sacred grove',296,top+301,'se-caption','middle'),0);c.text(a[5].text,542,421);c.y=Math.max(c.y,top+330);});c.rule();c.pause(conservationThinking,'conservation-comparison');
  c.text('A useful conclusion must account for both the evidence and its limits.',89,874,0);
 });
 refinementLedger.push({before:'Suppose a class records more kinds of birds in a protected grove than in a nearby clearing. Does that record alone show that protection caused the difference? Check how the records were made. Were both places watched for the same length of time, at similar times of day? Could differences in area, water or vegetation also matter? Plan repeated visits using the same method. Decide what to record so another class could check your comparison.',after:[conservationThinking],reason:'Consolidate the existing conservation discussion into one substantial thinking pause.'});
 const review=groups(26),summaryAt=review.findIndex(a=>a.text==='Summary');normal(review.slice(0,summaryAt),[26]);normal(review.slice(summaryAt),[26]);
 normal(groups(27),[27]);normal(groups(28),[28]);normal(groups(29),[29]);
 const referenceStart=pages.findIndex(p=>p.title==='Keywords');
 for(const entry of enrichments)if(!additions.some(e=>e.id===entry.id))throw Error('Missing enrichment anchor: '+entry.id);
 await fs.writeFile('assets/design-history/science-v2/enrichment-ledger.json',JSON.stringify(additions,null,2));
 const exerciseStart=pages.findIndex(p=>p.title==='Let Us Enhance Our Learning');
 const fitted=[pages[0],...refitV2Lesson(pages.slice(1,referenceStart)),...pages.slice(referenceStart,exerciseStart),...refitV2Lesson(pages.slice(exerciseStart))];
 await fs.mkdir(dir,{recursive:true});
 for(let i=0;i<fitted.length;i++){
  const p=fitted[i],n=i+1,verso=n%2===0;
  const running=i===0?'':'<g class="v2-header"><path class="v2-ribbon-underlay" d="M0 0H340L317 51Q312 63 291 63H0Z"/><path class="v2-ribbon" d="M0 0H321L300 49Q295 63 274 63H0Z"/><g transform="translate(-148 3) scale(.2)">'+botanicalMotif(0,'v2-ribbon')+'</g>'+label('CHAPTER 2',96,41,'v2-ribbon-label se-running')+label('Diversity in the Living World',960,40,'v2-running se-running','end')+'<line class="v2-furniture-rule" x1="340" x2="963" y1="58" y2="58"/></g>';
  const foot='<g class="v2-footer">'+`<line class="v2-furniture-rule" x1="${verso?190:89}" x2="${verso?963:862}" y1="1485" y2="1485"/>`+label('LEARNLAB · SCIENCE 6',verso?963:89,1465,'v2-foot-label se-running',verso?'end':'start')+`<path class="v2-ribbon-underlay" d="${verso?'M0 1455H137Q152 1455 160 1470L179 1514H0Z':'M1052 1455H915Q900 1455 892 1470L873 1514H1052Z'}"/><path class="v2-ribbon" d="${verso?'M0 1455H117Q132 1455 140 1470L159 1514H0Z':'M1052 1455H935Q920 1455 912 1470L893 1514H1052Z'}"/>`+label(String(n),verso?107:945,1487,'v2-folio se-running','middle')+'</g>';
  const html=`<section class="page page--food page--science-editorial page--science-v2${i===0?' page--opener':''}" data-folio="${n}"${i===fitted.length-1?' data-close':''}><div class="page__body"><div class="page__main"><svg class="food-sheet science-sheet science-editorial" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1052 1514" aria-label="Diversity in the Living World V2, page ${n}">${running}${p.parts}${foot}</svg></div></div></section>`;
  const isolated=html.replaceAll('science/ch02/','science/ch02-v2/');
  scienceContract('V2 '+n,isolated);
  await fs.writeFile(`${dir}/p${String(n).padStart(3,'0')}.html`,isolated);
  audit.push({page:n,title:p.title,titleRole:p.titleRole,sourcePages:p.source,end:p.end,fill:Math.round((p.end-112)/1303*100),breakReason:p.breakReason,blocks:p.blockAudit,protectedNext:p.protectedNext});
 }
 // Remove only obsolete generated page fragments in this exact V2 directory.
 for(const file of await fs.readdir(dir))if(/^p\d+\.html$/.test(file)&&Number(file.slice(1,-5))>fitted.length)await fs.unlink(`${dir}/${file}`);
 await fs.writeFile('assets/design-history/science-v2/page-map.json',JSON.stringify(audit,null,2));
 console.log('V2: '+fitted.length+' pages composed (was '+pages.length+' before continuous refit).');
}
