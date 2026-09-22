// Precise relationships use live SVG labels; contextual artwork uses painted PNGs.
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const text=(s,x,y,bold=false)=>`<text class="v2-change-label${bold?' se-bold':''}" x="${x}" y="${y}" text-anchor="middle">${esc(s)}</text>`;
const path=d=>`<path class="v2-change-line" d="${d}"/>`;
const arrow=(x1,y1,x2,y2)=>path(`M${x1} ${y1}L${x2} ${y2}`)+path(`M${x2-8} ${y2-6}L${x2} ${y2}L${x2-8} ${y2+6}`);
const box=(x,y,w,words)=>`<rect class="v2-change-box" x="${x}" y="${y}" width="${w}" height="${words.length*30+26}" rx="9"/>`+words.map((s,i)=>text(s,x+w/2,y+32+i*30)).join('');
function vessel(x,y,receiver=false,compact=false){
 const bottom=compact?83:143,shoulder=bottom-18,water=bottom-47;
 let s=path(`M${x} ${y}V${y+shoulder}Q${x} ${y+bottom} ${x+20} ${y+bottom}H${x+90}Q${x+110} ${y+bottom} ${x+110} ${y+shoulder}V${y}`);
 s+=`<path class="v2-change-water" d="M${x+2} ${y+water}H${x+108}V${y+shoulder}Q${x+108} ${y+bottom-2} ${x+90} ${y+bottom-2}H${x+20}Q${x+2} ${y+bottom-2} ${x+2} ${y+shoulder}Z"/>`;
 if(!receiver)s+=`<rect class="v2-change-cap" x="${x-4}" y="${y-12}" width="118" height="18" rx="3"/>`;
 return s;
}
function gasPair(x,y,compact=false){
 const gap=compact?212:360;
 const lift=compact?25:65;
 return vessel(x,y,false,compact)+vessel(x+gap,y,true,compact)+path(`M${x+55} ${y+20}V${y-lift+8}Q${x+55} ${y-lift} ${x+63} ${y-lift}H${x+gap+47}Q${x+gap+55} ${y-lift} ${x+gap+55} ${y-lift+8}V${y+(compact?63:120)}`);
}
function gasTest(){
 let s=vessel(257,82,false,true)+vessel(617,82,true,true)+path('M312 102V49Q312 41 320 41H664Q672 41 672 49V145');
 s+=text('Delivery tube',490,25)+text('Open receiver',814,90)+path('M749 99L715 81');
 s+=text('Vinegar + baking soda',312,201)+text('Fresh lime water',672,201);
 return {html:s,h:220};
}
function exhaled(){
 let s='';
 for(const [i,name] of ['A · Tap water','B · Fresh lime water'].entries()){
  const x=290+i*360;
  s+=vessel(x,140,true)+path(`M${x+55} 260V105H${x-55}`);
  s+=`<rect class="v2-change-box" x="${x-144}" y="87" width="89" height="36" rx="3"/>`+path(`M${x-144} 105H${x-167}M${x-167} 91V119`);
  s+=text(name,x+55,326)+text('Collected exhaled air',x+40,42)+text('Needle-free syringe',x+40,72);
 }
 return {html:s,h:345};
}
function focusedLight(){
 let s=text('Sunlight',254,25)+path('M260 46V98M380 46V98M500 46V98');
 s+=`<ellipse class="v2-change-glass" cx="380" cy="112" rx="154" ry="14"/>`;
 s+=path('M260 130L380 218M380 130V218M500 130L380 218 M235 232H529L562 249H208Z');
 s+=text('Lens held by the teacher',753,118)+path('M587 113H541');
 s+=text('Small paper piece on a heatproof tray',526,287);
 s+=text('Concentrated light',751,199)+text('heats a small spot.',751,230)+path('M616 218H403');
 return {html:s,h:302};
}
function fireTriangle(){
 let s=path('M526 52L308 184H744Z');
 s+=box(375,0,302,['Fuel'])+box(148,174,320,['Oxygen'])+box(584,174,320,['Enough heat']);
 s+=text('Combustion',526,129,true);
 return {html:s,h:239};
}
function waxPath(){
 const s=box(105,10,216,['Solid wax'])+arrow(326,38,375,38)+box(382,10,267,['Liquid wax'])+arrow(655,38,704,38)+box(711,10,235,['Wax vapour'])
 +text('Melting',351,98)+text('Vaporising',683,98)+text('Travels up the wick',514,143)
 +path('M829 66V181M822 173L829 181L836 173')+box(646,188,300,['Reacts with oxygen','in the flame'])
 +text('Carbon dioxide + water',380,229)+text('Energy released as heat and light',380,262)+path('M640 230H610M618 224L610 230L618 236');
 return {html:s,h:284};
}
function landscape(){
 let s=box(89,0,255,['Weathering','Rock changes in place.'])+arrow(350,43,391,43)+box(398,0,255,['Erosion','Particles are carried.'])+arrow(659,43,700,43)+box(707,0,255,['Deposition','Particles settle.']);
 s+=text('Roots, water, air',216,128)+text('Wind, water, gravity',525,128)+text('Transport slows',834,128);
 return {html:s,h:147};
}
function fourTests(){
 let s='';
 for(const [i,words] of [['(a) Vinegar','+ baking soda'],['(b) Lemon juice','+ vinegar'],['(c) Vinegar','+ common salt'],['(d) Lemon juice','+ baking soda']].entries()){
  const x=133+(i%2)*450,y=42+Math.floor(i/2)*228;
  s+=gasPair(x,y,true)+text(words[0],x+55,y+125)+text(words[1],x+55,y+155)+text('Lime water',x+267,y+125);
 }
 return {html:s,h:443};
}
export function changeDiagram(key){const factory={'exhaled':exhaled,'gas-test':gasTest,'focused-light':focusedLight,'fire-triangle':fireTriangle,'wax-path':waxPath,landscape,'four-tests':fourTests}[key];if(!factory)throw Error('Unknown Chapter 5 diagram '+key);const d=factory();return {...d,html:`<g class="v2-change-diagram" data-diagram="${key}">${d.html}</g>`};}
