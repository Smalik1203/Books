// Chapter-local scientific schematics. Lettering remains live at print size.
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const text=(s,x,y,cls='v2-metal-label',anchor='middle')=>`<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${esc(s)}</text>`;
const path=d=>`<path class="v2-metal-line" d="${d}"/>`;
const box=(x,y,w,h,words)=>`<rect class="v2-metal-box" x="${x}" y="${y}" width="${w}" height="${h}" rx="9"/>`+words.map((s,i)=>text(s,x+w/2,y+31+i*29)).join('');
function tester(){
 let s=text('Low-voltage lamp tester',526,28,'v2-metal-label se-bold');
 s+=path('M220 90H486M514 90H832V256H645M407 256H220V90 M486 65V115M514 75V105');
 s+=text('+',469,55)+text('−',530,55)+text('Cell',501,153);
 s+=`<circle class="v2-metal-box" cx="722" cy="90" r="28"/>`+path('M703 71L741 109M703 109L741 71')+text('Lamp',722,153);
 s+=`<circle class="v2-metal-contact" cx="407" cy="256" r="6"/><circle class="v2-metal-contact" cx="645" cy="256" r="6"/>`;
 s+=path('M420 243H632V269H420Z')+text('Test sample',526,316)+text('Firm contacts at both ends',526,350);
 return {html:`<g class="v2-metal-diagram">${s}</g>`,h:368};
}
function rust(){
 let s='';
 for(const [i,name] of ['A · Dry air','B · Limited oxygen','C · Air and water'].entries()){
  const x=125+i*294,c=x+105;
  s+=text(name,c,28,'v2-metal-label se-bold');
  s+=path(`M${x+25} 85V111L${x+7} 135V312Q${x+7} 329 ${x+23} 329H${x+188}Q${x+203} 329 ${x+203} 312V135L${x+185} 111V85`);
  if(i<2)s+=`<rect class="v2-metal-cap" x="${x+17}" y="67" width="176" height="22" rx="3"/>`;
  if(i>0)s+=`<path class="v2-metal-water" d="M${x+9} ${i===1?159:234}H${x+201}V312Q${x+201} 327 ${x+188} 327H${x+23}Q${x+9} 327 ${x+9} 312Z"/>`;
  if(i===1)s+=`<rect class="v2-metal-oil" x="${x+9}" y="145" width="192" height="14"/>`;
  s+=path(`M${c} ${i===2?87:89}V${i===1?190:166} M${c-15} ${i===1?190:166}H${c+15} M${c-4} ${i===1?190:166}V290L${c} 304L${c+4} 290V${i===1?190:166}`);
  if(i===0)for(let j=0;j<12;j++)s+=`<circle class="v2-metal-granule" cx="${x+22+j*15}" cy="${313-(j%2)*5}" r="5"/>`;
  const labels=i===0?['Capped; silica gel','removes moisture.']:i===1?['Capped; boiled, cooled','water under an oil layer.']:['Open; nail partly','immersed in water.'];
  labels.forEach((a,j)=>s+=text(a,c,367+j*29));
 }
 s+=text('Same kind of clean nail; same place and observation period.',526,442);
 return {html:`<g class="v2-metal-diagram">${s}</g>`,h:456};
}
function oxideQuestion(){
 let s=box(300,0,452,48,['Magnesium + air + heat']);
 s+=path('M526 48V72M520 64L526 72L532 64')+box(353,72,346,48,['Ash: name the oxide']);
 s+=path('M526 120V158M520 150L526 158L532 150')+text('Add water',625,146);
 s+=box(300,158,452,48,['Mixture: state its nature']);
 s+=path('M526 206V230H289V258M526 230H763V258M283 250L289 258L295 250M757 250L763 258L769 250');
 s+=box(125,258,328,76,['Add blue litmus','Final colour: ?'])+box(599,258,328,76,['Add red litmus','Final colour: ?']);
 return {html:`<g class="v2-metal-diagram">${s}</g>`,h:342};
}
export function metalDiagram(key){const factory={tester,rust,'oxide-question':oxideQuestion}[key];if(!factory)throw Error('Unknown Chapter 4 diagram '+key);const d=factory();return {...d,html:d.html.replace('<g ',`<g data-diagram="${key}" `)};}
