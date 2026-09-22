// Painted anatomical cutaways; models and all labels remain live SVG.
import {readFileSync} from 'node:fs';
const artwork=JSON.parse(readFileSync(new URL('../assets/design-history/science-g7-ch06/artwork.json',import.meta.url),'utf8'));
function painted(key,x,y,h,crop){
 const a=artwork.find(a=>a.key==='apparatus-'+key);if(!a)throw Error('Missing apparatus '+key);
 const [l,top,r,b]=crop||a.alphaBounds,w=(r-l)*h/(b-top);
 return `<svg class="science-illustration" data-apparatus="${key}" x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${l} ${top} ${r-l} ${b-top}" preserveAspectRatio="xMidYMid meet"><image href="../../${a.file}" width="${a.pixels[0]}" height="${a.pixels[1]}"/></svg>`;
}
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const text=(s,x,y,bold=false)=>`<text class="v2-change-label${bold?' se-bold':''}" x="${x}" y="${y}" text-anchor="middle">${esc(s)}</text>`;
const path=d=>`<path class="v2-change-line" d="${d}"/>`;
const arrow=(x1,y1,x2,y2)=>path(`M${x1} ${y1}L${x2} ${y2}`)+path(`M${x2-8} ${y2-6}L${x2} ${y2}L${x2-8} ${y2+6}`);
const box=(x,y,w,words)=>`<rect class="v2-change-box" x="${x}" y="${y}" width="${w}" height="${words.length*31+28}" rx="9"/>`+words.map((s,i)=>text(s,x+w/2,y+33+i*31)).join('');
function neck(){
 let s=painted('neck',379,4,264);
 s+=text('Larynx (voice box)',791,62,true)+path('M685 69H626L547 81');
 s+=text('Thyroid gland',246,162,true)+path('M337 169H443L492 156');
 s+=text('Windpipe',778,243)+path('M717 236H626L545 240');
 return {html:s,h:280};
}
function cycle(){
 let s=arrow(172,94,883,94);
 s+=path('M220 72V116M820 72V116');
 s+=text('First day of one period',264,39,true)+text('First day of next period',784,39,true);
 s+=text('Start counting here',264,154)+text('A new cycle starts',784,154);
 s+=text('One menstrual cycle',526,210,true);
 return {html:s,h:230};
}
function smoke(){
 let s=painted('airway',246,41,137,[45,35,867,846])+painted('airway',666,41,137,[936,35,1753,846]);
 for(const [i,x] of [316,736].entries()){
  s+=text(i?'Inflamed airway':'Open airway',x,211,true);
  s+=text(i?'Less space for air':'Air moves through',x,247);
 }
 s+=text('Airway cross-sections · simplified model',526,20);
 return {html:s,h:268};
}
function hormones(){
 let s=box(100,10,252,['Brain and glands']);
 s+=arrow(365,39,402,39)+box(414,10,232,['Hormones in blood']);
 s+=arrow(660,39,697,39)+box(709,10,244,['Responsive tissues']);
 return {html:s,h:80};
}
export function adolescenceDiagram(key){
 const fn={neck,cycle,smoke,hormones}[key];if(!fn)throw Error('Unknown diagram '+key);
 const d=fn();return {...d,html:`<g class="v2-change-diagram" data-diagram="${key}">${d.html}</g>`};
}
