// Precise relationships use live SVG labels; contextual artwork uses painted PNGs.
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const text=(s,x,y,bold=false)=>`<text class="v2-change-label${bold?' se-bold':''}" x="${x}" y="${y}" text-anchor="middle">${esc(s)}</text>`;
const path=d=>`<path class="v2-change-line" d="${d}"/>`;
// Native alpha is preserved; nested SVGs remove only unused image margins.
const art={'gas-pair':{size:[1774,887],crop:'150 85 1530 730'},exhaled:{size:[1536,1024],crop:'35 74 1480 866'},'focused-light':{size:[1536,1024],crop:'26 114 1500 828'}};
const apparatus=(key,x,y,w,h)=>`<svg class="science-illustration" data-photo="apparatus-${key}" x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${art[key].crop}" preserveAspectRatio="xMidYMid meet"><image href="../../figures/class-7/science/ch05/apparatus-${key}.png" width="${art[key].size[0]}" height="${art[key].size[1]}"/></svg>`;
const arrow=(x1,y1,x2,y2)=>path(`M${x1} ${y1}L${x2} ${y2}`)+path(`M${x2-8} ${y2-6}L${x2} ${y2}L${x2-8} ${y2+6}`);
const box=(x,y,w,words)=>`<rect class="v2-change-box" x="${x}" y="${y}" width="${w}" height="${words.length*30+26}" rx="9"/>`+words.map((s,i)=>text(s,x+w/2,y+32+i*30)).join('');
function gasTest(){
 // Reused only in an initial state: both liquids clear, no bubbles or precipitate.
 let s=apparatus('gas-pair',302,34,414,150);
 s+=text('Delivery tube',490,25)+path('M490 30V50');
 s+=text('Open receiver',814,90)+path('M738 98L658 98');
 s+=text('Vinegar + baking soda',401,201)+text('Fresh lime water',666,201);
 return {html:s,h:220};
}
function exhaled(){
 let s='';
 for(const [i,name] of ['A · Tap water','B · Fresh lime water'].entries()){
  const x=290+i*360;
  s+=apparatus('exhaled',x-155,83,330,220);
  s+=text(name,x+55,326)+text('Collected exhaled air',x+40,42)+text('Needle-free syringe',x+40,72);
 }
 return {html:s,h:345};
}
function focusedLight(){
 let s=apparatus('focused-light',185,45,430,225)+text('Sunlight',254,25);
 // Rays are a live geometric model, not painted smoke or a predicted fire.
 s+=path('M335 32V97M380 32V97M425 32V97 M335 108L380 202M380 108V202M425 108L380 202');
 s+=text('Lens held by the teacher',753,118)+path('M620 112H555');
 s+=text('Small paper piece on a heatproof tray',526,287);
 s+=text('Concentrated light',751,199)+text('heats a small spot.',751,230)+path('M616 202H384');
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
  s+=apparatus('gas-pair',x,y-42,322,140)+text(words[0],x+55,y+125)+text(words[1],x+55,y+155)+text('Lime water',x+267,y+125);
 }
 return {html:s,h:443};
}
export function changeDiagram(key){const factory={'exhaled':exhaled,'gas-test':gasTest,'focused-light':focusedLight,'fire-triangle':fireTriangle,'wax-path':waxPath,landscape,'four-tests':fourTests}[key];if(!factory)throw Error('Unknown Chapter 5 diagram '+key);const d=factory();return {...d,html:`<g class="v2-change-diagram" data-diagram="${key}">${d.html}</g>`};}
