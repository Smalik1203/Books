// Objects are painted PNGs; measurement divisions and geometric paths are exact.
import fs from 'node:fs';
import {measurementProjection} from './science-g6-ch05-projections.mjs';
const assets=JSON.parse(fs.readFileSync('assets/design-history/science-g6-ch05/artwork.json','utf8'));
const E=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
const text=(s,x,y,anchor='start')=>`<text class="v2-measure-label" x="${x}" y="${y}" text-anchor="${anchor}">${E(s)}</text>`;
const line=(x1,y1,x2,y2,c='')=>`<line class="v2-measure-line ${c}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
const path=(d,c='v2-measure-line')=>`<path class="${c}" d="${d}"/>`;
const rect=(x,y,w,h,c='v2-measure-object')=>`<rect class="${c}" x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/>`;
const circle=(x,y,r,c='v2-measure-dot')=>`<circle class="${c}" cx="${x}" cy="${y}" r="${r}"/>`;
function arrow(x1,y1,x2,y2){const a=Math.atan2(y2-y1,x2-x1),r=10;return path(`M${x1} ${y1}L${x2} ${y2}M${x2-r*Math.cos(a-.5)} ${y2-r*Math.sin(a-.5)}L${x2} ${y2}L${x2-r*Math.cos(a+.5)} ${y2-r*Math.sin(a+.5)}`,'v2-measure-arrow');}
export function picture(key,x,y,w,h){const a=assets.find(a=>a.key===key);if(!a)throw Error('Missing art '+key);const [bx,by,bw,bh]=a.bounds||[0,0,...a.pixels],s=Math.min(w/bw,h/bh),iw=bw*s,ih=bh*s;return `<svg class="science-illustration" data-art="${key}" x="${x+(w-iw)/2}" y="${y+(h-ih)/2}" width="${iw}" height="${ih}" viewBox="${bx} ${by} ${bw} ${bh}" overflow="hidden"><image href="../../${a.file}" x="0" y="0" width="${a.pixels[0]}" height="${a.pixels[1]}" preserveAspectRatio="xMidYMid meet"/></svg>`;}
function ruler(x,y,{start=0,end=15,step=48,broken=false}={}){
 let s=rect(x-18,y,(end-start)*step+36,78,'v2-measure-ruler');
 for(let i=start*10;i<=end*10;i++){const xx=x+(i/10-start)*step,major=i%10===0,half=i%5===0;s+=line(xx,y,xx,y+(major?29:half?22:13));if(major)s+=text(i/10,xx,y+58,'middle');}
 if(broken)s+=path(`M${x-18} ${y}l8 13l-8 13l8 13l-8 13l8 13l-8 13`);
 return `<g data-ruler-start="${start}" data-ruler-end="${end}" data-ruler-step="${step}">${s}</g>`;
}
function pencil(x,y,width){return picture('pencil',x,y,width,width*.105);}
export function measureDiagram(key){let html='',h=0;
 const projection=measurementProjection(key,{text,line,path,arrow,pencil});
 if(projection)return {...projection,html:`<g class="v2-measure-diagram" data-diagram="${key}">${projection.html}</g>`};
 if(key==='handspan'){
  h=310;html=picture('hand',340,0,370,258)+text('Thumb tip ↔ little-finger tip',526,298,'middle');
 }else if(key==='ruler'){
  h=275;html=ruler(154,35)+text('cm',916,95,'middle')+text('One centimetre enlarged',526,151,'middle');
  for(let i=0;i<=10;i++)html+=line(346+i*36,176,346+i*36,i%10===0?216:200);
  html+=line(346,176,706,176)+text('1 cm',346,250,'middle')+text('2 cm',706,250,'middle')+text('10 intervals of 1 mm',526,275,'middle');
 }else if(key==='alignment'){
  h=350;html=pencil(166,18,520)+ruler(166,82,{end:12,step:55})+text('Aligned',844,51,'middle');
  html+=pencil(166,193,520)+`<g transform="rotate(6 166 257)">${ruler(166,257,{end:12,step:55})}</g>`+text('Slanting',844,218,'middle');h=410;
 }else if(key==='eye'){
  h=340;html=pencil(153,210,480)+ruler(153,267,{end:15,step:48});
  for(const [x,name] of [[453,'A'],[633,'B'],[813,'C']]){html+=path(`M${x-28} 59Q${x} 35 ${x+28} 59Q${x} 83 ${x-28} 59Z`)+circle(x,59,7)+text(name,x,26,'middle')+line(x,87,633,238,x===633?'':'v2-measure-dashed');}
  h=357;
 }else if(key==='broken'){
  const x=164,step=62,end=x+9.4*step;
  h=235;html=pencil(x,40,9.4*step)+ruler(x,124,{start:1,end:12,step,broken:true})+line(x,17,x,122,'v2-measure-dashed')+line(end,17,end,122,'v2-measure-dashed')+text('1.0 cm',x,21,'middle')+text('10.4 cm',end,21,'middle');
 }else if(key==='curve'){
  h=345;html=path('M159 160C241 -8 405 315 504 99C540 18 634 36 682 116','v2-measure-thread')+circle(159,160,5)+circle(682,116,5)+text('Mark both ends',845,133,'middle')+arrow(789,145,697,125);
  // The marked straight thread preserves the 643.369-unit arc length above.
  html+=path('M159 250H802.369','v2-measure-thread')+ruler(159,263,{end:12,step:55})+text('A',145,190,'middle')+text('B',705,88,'middle');
 }else if(key==='road'){
  h=308;html=line(133,156,917,156,'v2-measure-road');
  const names=[['Bus','stand'],['Deepa’s','house'],['Anish’s','house'],['School',''],['Hardeep’s','house'],['Garden',''],['Tasneem’s','house'],['Padma’s','house']];
  names.forEach(([one,two],i)=>{const x=133+i*112,top=i%2===0;html+=circle(x,156,5)+line(x,156,x,top?98:216)+text(one,x,top?48:250,'middle')+(two?text(two,x,top?77:279,'middle'):'')+text(i,x,top?190:139,'middle');});
  html+=text('Positions in km from the bus stand',526,308,'middle');
 }else if(key==='court'){
  h=280;html=rect(250,45,580,175,'v2-measure-court')+line(540,45,540,220)+circle(250,220,6)+text('Reference corner',225,276,'middle')+arrow(279,242,816,242)+arrow(221,215,221,56)+text('Length',540,280,'middle')+text('Width',151,139,'middle')+path('M250 194H276V220');
 }else if(key==='paths'){
  h=240;html=picture('bus',120,8,310,160)+arrow(139,189,437,189)+text('Straight path',289,230,'middle')+circle(750,110,87,'v2-measure-orbit')+circle(750,110,4)+circle(837,110,14,'v2-measure-ball')+arrow(815,57,833,88)+text('Circular path',750,230,'middle');
 }else if(key==='circumference'){
  h=252;html=`<ellipse class="v2-measure-object" cx="526" cy="96" rx="112" ry="31"/>`+path('M414 96L436 217Q526 258 616 217L638 96','v2-measure-glass')+`<ellipse class="v2-measure-thread" cx="526" cy="216" rx="90" ry="28"/>`+text('Around the base',788,217,'middle')+line(683,210,620,216)+text('Tumbler',526,38,'middle');
 }else if(key==='track'){
  h=330;const route='M158 34L300 202Q381 284 493 276A104 104 0 1 1 497 275L890 275';
  html=path(route,'v2-measure-track')+path(route,'v2-measure-rail')+circle(209,94,13,'v2-measure-ball');
  for(const [name,x,y] of [['A',143,27],['B',295,237],['C',486,315],['D',500,58],['E',641,250],['F',906,281]])html+=text(name,x,y,'middle');
  html+=arrow(260,130,293,168)+arrow(749,301,834,301);
 }else if(key==='paper-stack'){
  h=215;html=rect(285,65,390,115,'v2-measure-paper');
  for(let i=0;i<18;i++)html+=line(286,72+i*5.8,674,72+i*5.8,'v2-measure-sheetline');
  html+=line(704,65,704,180)+line(693,65,715,65)+line(693,180,715,180)+text('Stack thickness',729,124)+text('Count sheets, not page faces',478,213,'middle');
 }else if(key==='maze'){
  html=path('M200 95V30H850V220M850 275V320H200V155M330 30V210M460 140V320M590 30V210M720 140V320','v2-measure-track')+text('In',151,133,'middle')+text('Out',902,256,'middle')+pencil(222,358,640);h=440;
 }else if(key==='wheel'){
  h=292;html=circle(322,131,104,'v2-measure-tyre')+circle(322,131,92,'v2-measure-rim')+circle(322,131,12,'v2-measure-ball');
  for(let i=0;i<12;i++){const a=i*Math.PI/6;html+=line(322+15*Math.cos(a),131+15*Math.sin(a),322+91*Math.cos(a),131+91*Math.sin(a));}
  html+=circle(322,231,7,'v2-measure-chalk')+line(142,242,910,242)+arrow(494,199,864,199)+text('Chalk mark',592,66)+line(557,79,335,231)+text('One full turn → one circumference',586,285,'middle');
 }else throw Error('Unknown measurement diagram '+key);
 return {html:`<g class="v2-measure-diagram" data-diagram="${key}">${html}</g>`,h};
}
