// Simplified explanatory models. All labels remain live text at the body scale.
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const text=(s,x,y,bold=false)=>`<text class="v2-change-label${bold?' se-bold':''}" x="${x}" y="${y}" text-anchor="middle">${esc(s)}</text>`;
const path=d=>`<path class="v2-change-line" d="${d}"/>`;
const arrow=(x1,y1,x2,y2)=>path(`M${x1} ${y1}L${x2} ${y2}`)+path(`M${x2-8} ${y2-6}L${x2} ${y2}L${x2-8} ${y2+6}`);
const box=(x,y,w,words)=>`<rect class="v2-change-box" x="${x}" y="${y}" width="${w}" height="${words.length*31+28}" rx="9"/>`+words.map((s,i)=>text(s,x+w/2,y+33+i*31)).join('');
function neck(){
 let s=path('M435 12Q430 53 429 85L416 203Q412 236 332 264M617 12Q622 53 623 85L636 203Q640 236 720 264');
 s+=`<path class="v2-change-box" d="M494 67L526 54L558 67L550 122L526 143L502 122Z"/>`;
 s+=`<path class="v2-change-contact" d="M512 142H540V243H512Z"/>`;
 for(let y=150;y<240;y+=15)s+=path(`M513 ${y}H539`);
 s+=`<path class="v2-change-cap" d="M516 170C477 117 476 233 508 214L516 195H536L544 214C576 233 575 117 536 170Z"/>`;
 s+=text('Larynx (voice box)',745,67,true)+path('M649 74H570L545 90');
 s+=text('Thyroid gland',272,170,true)+path('M362 178H480');
 s+=text('Windpipe',745,244)+path('M687 236H550');
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
 let s='';
 for(const [i,x] of [316,736].entries()){
  s+=`<circle class="v2-change-box" cx="${x}" cy="99" r="69"/><circle class="v2-change-contact" cx="${x}" cy="99" r="${i?34:54}"/>`;
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
