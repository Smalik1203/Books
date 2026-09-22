// Chapter-local scientific schematics. Lettering remains live at print size.
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const text=(s,x,y,cls='v2-metal-label',anchor='middle')=>`<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${esc(s)}</text>`;
const path=d=>`<path class="v2-metal-line" d="${d}"/>`;
// Crop transparent margins in SVG, preserving the native PNG and its alpha.
const art={tester:{size:[1536,1024],crop:'12 78 1518 732'},rust:{size:[2172,724],crop:'70 115 2040 540'}};
const apparatus=(key,x,y,w,h,labels='')=>`<svg class="science-illustration" data-photo="apparatus-${key}" x="${x}" y="${y}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><svg width="${w}" height="${h}" viewBox="${art[key].crop}" preserveAspectRatio="xMidYMid meet"><image href="../../figures/class-7/science/ch04/apparatus-${key}.png" width="${art[key].size[0]}" height="${art[key].size[1]}"/></svg>${labels?`<g transform="translate(${-x} ${-y})">${labels}</g>`:''}</svg>`;
const box=(x,y,w,h,words)=>`<rect class="v2-metal-box" x="${x}" y="${y}" width="${w}" height="${h}" rx="9"/>`+words.map((s,i)=>text(s,x+w/2,y+31+i*29)).join('');
function tester(){
 let s=text('Low-voltage lamp tester',526,28,'v2-metal-label se-bold');
 // Painted apparatus contains the same single series path; no glow predicts a result.
 s+=apparatus('tester',236,56,580,232,text('+',333,90)+text('−',523,90));
 s+=text('Cell',210,150)+path('M241 144H315');
 s+=text('Lamp',850,150)+path('M815 144H735');
 s+=text('Test sample',526,316)+path('M526 292V277')+text('Firm contacts at both ends',526,350);
 return {html:`<g class="v2-metal-diagram">${s}</g>`,h:368};
}
function rust(){
 // One unlabelled painted triptych; all starting conditions remain live type.
 let s=apparatus('rust',89,46,874,292);
 for(const [i,name] of ['A · Dry air','B · Limited oxygen','C · Air and water'].entries()){
  const x=125+i*294,c=x+105;
  s+=text(name,c,28,'v2-metal-label se-bold');
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
