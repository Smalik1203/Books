import fs from 'node:fs/promises';
import {scienceContract} from './science-contract.mjs';
import {refitV2Lesson} from './refit-science-v2-blocks.mjs';

export async function composeV2(atoms,{wrap,linesSVG,label,dir,E}) {
 const pages=[], audit=[];
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
  const size=major?42:30,lead=major?48:38,after=major?30:24;
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
  const text=(s,x=89,w=874,gap=18)=>capture('body',()=>{const ls=wrap(s,w-6);parts.push(linesSVG(ls,x,y,'se-copy',32,24,w>600?w:null));y+=ls.length*32+gap;},{text:s});
  const keep=a=>capture(a.type,()=>{parts.push(a.render(y));y+=a.h;},{text:a.text,role:a.type==='heading'?headingStyle(a.text).role:undefined});
  const rule=()=>capture('rule',()=>{parts.push(`<line class="v2-rule" x1="89" x2="963" y1="${y}" y2="${y}"/>`);y+=24;});
  const pic=(key,h,captions=[])=>capture('figure',()=>{parts.push(image(key,89,y,874,h));y+=h;captions.forEach(([s,x])=>parts.push(label(s,x,y+27,'se-caption','middle')));y+=captions.length?53:20;},{artKey:key});
  const cols=(ss)=>capture('comparison',()=>{const w=(874-32*(ss.length-1))/ss.length,top=y;let bottom=y;ss.forEach((s,i)=>{y=top;for(const p of Array.isArray(s)?s:[s])text(p,89+i*(w+32),w,16);bottom=Math.max(bottom,y);});y=bottom+12;});
  const sub=s=>capture('heading',()=>{parts.push(label(s,89,y+29,'se-heading'));y+=56;},{text:s,role:'subtopic'});
  const raw=(s,h)=>capture('graphic',()=>{parts.push(s);y+=h;});
  const group=fn=>capture('illustrated-note',fn);
  build({text,keep,rule,pic,cols,sub,raw,group,get y(){return y;},set y(v){y=v;}});
  if(y>1415)throw Error(`V2 page ${pages.length+1} (${title}) ends at ${y}`);
  pages.push({title,titleRole:style.role,source,parts:parts.join('\n'),blocks,end:y});
 }
 // Opener is a designed scene, with live typography and a separate reading entry.
 sheet('',[1],c=>{
  c.raw(label('CHAPTER',89,88,'v2-chapter-label se-running')+label('2',89,224,'v2-display-number se-running')+label('Diversity in the',230,154,'v2-cover-title')+label('Living World',230,224,'v2-cover-title'),0);
  c.raw(image('opener-v2',-17,300,1086,724),0);
  c.y=1044;
  for(const a of groups(1).filter(a=>a.type==='body'))c.text(a.text);
 });
 // A page turn does not introduce a topic. Continue with the next reading block.
 function normal(list,source){
  list=prepare(list);let title=list[0]?.type==='heading'?list.shift().text:'';
  while(list.length){
   const budget=1415-112-headingStyle(title).height;let take=0,h=0;
   while(take<list.length&&h+list[take].h<=budget){h+=list[take].h;take++;}
   if(!take)throw Error('Oversized V2 block '+list[0].text.slice(0,50));
   // Keep the practical task with its recording table; avoid a heading with
   // fewer than five lines of following matter before the page turn.
   if(take<list.length&&list[take-1].type==='activity'&&list[take].type==='table')take--;
   if(take<list.length&&list[take-1]?.type==='body'&&list[take]?.type==='figure'&&take>1)take--;
   if(take<list.length){
    const lastHead=list.slice(0,take).findLastIndex(a=>a.type==='heading');
    if(lastHead>=0&&list.slice(lastHead+1,take).reduce((sum,a)=>sum+a.h,0)<160)take=lastHead;
   }
   if(!take)throw Error('V2 heading or investigation needs an editorial page break: '+list[0].text.slice(0,70));
   const current=list.splice(0,take);
   sheet(title,source,c=>{for(const a of current)c.keep(a);});
   title=list[0]?.type==='heading'?list.shift().text:'';
  }
 }
 normal(groups(2),[2]); normal(groups(3),[3]);
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
   c.raw(image('leaf-sorting',89,t,874,350)
    +[['A',342],['B',485],['C',615],['D',731]].map(([s,x])=>label(s,x,t+376,'se-caption','middle')).join(''),400);
   const y=c.y;
   const rows=[['Grouping rule','First group','Second group'],['Outline','Broad: A, B','Narrow: C, D'],['Edge','Smooth: A, C','Toothed: B, D']];
   c.raw(`<rect class="se-table-head" x="89" y="${y}" width="874" height="46"/><rect class="v2-table-frame" x="89" y="${y}" width="874" height="138"/>`
    +[46,92].map(d=>`<line class="v2-rule" x1="89" x2="963" y1="${y+d}" y2="${y+d}"/>`).join('')
    +rows.map((r,i)=>r.map((s,j)=>label(s,[105,363,667][j],y+31+i*46,'se-caption')).join('')).join(''),158);
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
 normal(seed.slice(1,seedFigure+1),[17]);normal([...seed.slice(seedFigure+1),...groups(18)],[17,18]);
 normal(groups(19),[19]);normal(groups(20),[20]);
 sheet('',[21],c=>{const a=groups(21);c.pic('desert',437,[['Cactus · hot desert',308],['Deodar · cold mountain',744]]);c.cols([[a[1].text,a[2].text],[a[3].text,a[4].text]]);c.rule();c.text(a[6].text);c.text(a[7].text);});
 sheet('Two Camels, Two Deserts',[22],c=>{const a=groups(22);c.text(a[1].text);c.text(a[2].text);c.pic('camels',390,[['Dromedary · one hump',308],['Bactrian · two humps',744]]);c.cols([a[3].text,a[4].text]);c.rule();c.text(a[6].text);c.text(a[7].text);});
 normal(groups(23),[23]);normal(groups(24),[24]);
 sheet('When a Habitat Is Lost',[25],c=>{
  const a=groups(25);for(const i of [1,2,3,4])c.text(a[i].text);
  c.rule();c.group(()=>{const top=c.y;c.raw(image('grove',89,top,414,276)+label('A sacred grove',296,top+301,'se-caption','middle'),0);c.text(a[5].text,542,421);c.y=Math.max(c.y,top+330);});c.rule();c.sub('Checking whether protection helps');
  c.text('Suppose a class records more kinds of birds in a protected grove than in a nearby clearing. Does that record alone show that protection caused the difference?');
  c.text('Check how the records were made. Were both places watched for the same length of time, at similar times of day? Could differences in area, water or vegetation also matter?');
  c.text('Plan repeated visits using the same method. Decide what to record so another class could check your comparison. A useful conclusion must account for both the evidence and its limits.',89,874,0);
 });
 const review=groups(26),summaryAt=review.findIndex(a=>a.text==='Summary');normal(review.slice(0,summaryAt),[26]);normal(review.slice(summaryAt),[26]);
 normal(groups(27),[27]);normal(groups(28),[28]);normal(groups(29),[29]);
 const referenceStart=pages.findIndex(p=>p.title==='Keywords');
 const fitted=[pages[0],...refitV2Lesson(pages.slice(1,referenceStart)),...pages.slice(referenceStart)];
 await fs.mkdir(dir,{recursive:true});
 for(let i=0;i<fitted.length;i++){
  const p=fitted[i],n=i+1,verso=n%2===0;
  const running=i===0?'':'<g class="v2-header"><path class="v2-ribbon-underlay" d="M0 0H340L317 51Q312 63 291 63H0Z"/><path class="v2-ribbon" d="M0 0H321L300 49Q295 63 274 63H0Z"/><path class="v2-ribbon-stem" d="M31 63Q34 30 60 7"/><path class="v2-ribbon-leaf" d="M36 46Q10 38 20 14Q38 23 36 46M42 33Q42 8 70 4Q64 26 42 33M33 60Q45 35 73 37Q61 57 33 60"/>'+label('CHAPTER 2',96,41,'v2-ribbon-label se-running')+label('Diversity in the Living World',960,40,'v2-running se-running','end')+'<line class="v2-furniture-rule" x1="340" x2="963" y1="58" y2="58"/></g>';
  const foot='<g class="v2-footer">'+`<line class="v2-furniture-rule" x1="${verso?190:89}" x2="${verso?963:862}" y1="1485" y2="1485"/>`+label('LEARNLAB · SCIENCE 6',verso?963:89,1465,'v2-foot-label se-running',verso?'end':'start')+`<path class="v2-ribbon-underlay" d="${verso?'M0 1465H137Q152 1465 160 1480L179 1514H0Z':'M1052 1465H915Q900 1465 892 1480L873 1514H1052Z'}"/><path class="v2-ribbon" d="${verso?'M0 1465H117Q132 1465 140 1480L159 1514H0Z':'M1052 1465H935Q920 1465 912 1480L893 1514H1052Z'}"/>`+label(String(n),verso?107:945,1499,'v2-folio se-running','middle')+'</g>';
  const html=`<section class="page page--food page--science-editorial page--science-v2${i===0?' page--opener':''}" data-folio="${n}"${i===fitted.length-1?' data-close':''}><div class="page__body"><div class="page__main"><svg class="food-sheet science-sheet science-editorial" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1052 1514" aria-label="Diversity in the Living World V2, page ${n}">${running}${p.parts}${foot}</svg></div></div></section>`;
  const isolated=html.replaceAll('science/ch02/','science/ch02-v2/');
  scienceContract('V2 '+n,isolated);
  await fs.writeFile(`${dir}/p${String(n).padStart(3,'0')}.html`,isolated);
  audit.push({page:n,title:p.title,titleRole:p.titleRole,sourcePages:p.source,end:p.end,fill:Math.round((p.end-112)/1303*100),breakReason:p.breakReason});
 }
 // Remove only obsolete generated page fragments in this exact V2 directory.
 for(const file of await fs.readdir(dir))if(/^p\d+\.html$/.test(file)&&Number(file.slice(1,-5))>fitted.length)await fs.unlink(`${dir}/${file}`);
 await fs.writeFile('assets/design-history/science-v2/page-map.json',JSON.stringify(audit,null,2));
 console.log('V2: '+fitted.length+' pages composed (was '+pages.length+' before continuous refit).');
}
