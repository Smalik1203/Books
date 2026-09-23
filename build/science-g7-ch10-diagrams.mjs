// Realistic painted structures; labels and explanatory arrows stay live vector text.
import fs from 'node:fs';
const assets=JSON.parse(fs.readFileSync('assets/design-history/science-g7-ch10/artwork.json','utf8'));
const E=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const text=(s,x,y,anchor='start')=>`<text class="v2-plant-label" x="${x}" y="${y}" text-anchor="${anchor}">${E(s)}</text>`;
const line=(x1,y1,x2,y2)=>`<line class="v2-plant-line" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
function arrow(x1,y1,x2,y2){const a=Math.atan2(y2-y1,x2-x1),r=10;return `<path class="v2-plant-arrow" d="M${x1} ${y1}L${x2} ${y2}M${x2-r*Math.cos(a-.5)} ${y2-r*Math.sin(a-.5)}L${x2} ${y2}L${x2-r*Math.cos(a+.5)} ${y2-r*Math.sin(a+.5)}"/>`;}
function picture(key,x,y,w,h){const a=assets.find(a=>a.key===key);if(!a)throw Error('Missing asset '+key);const s=Math.min(w/a.pixels[0],h/a.pixels[1]),iw=a.pixels[0]*s,ih=a.pixels[1]*s;return `<image class="science-illustration" data-art="${key}" href="../../${a.file}" x="${x+(w-iw)/2}" y="${y+(h-ih)/2}" width="${iw}" height="${ih}" preserveAspectRatio="xMidYMid meet"/>`;}
export function plantDiagram(key){let html='',h=0;
 if(key==='growth-setup'){
  h=303;html=picture(key,176,0,700,270)+text('A',391,298,'middle')+text('B',526,298,'middle')+text('C',661,298,'middle');
 }else if(key==='starch-bath'){
  h=364;html=picture(key,206,20,640,310)+text('Hot water',100,70)+line(216,65,332,167)
   +text('Ethanol',100,264)+line(190,259,448,194)
   +text('Iodine',802,111)+line(790,106,689,151)+text('Pale leaf on tile',670,355,'middle');
 }else if(key==='variegated-leaf'){
  h=266;html=picture(key,426,0,200,250)+text('Green patch',100,71)+line(240,66,491,90)
   +text('Cream patch',758,185)+line(746,180,592,161);
 }else if(key==='co2-setup'){
  h=350;html=picture(key,176,0,700,310)+text('A: absorber',409,341,'middle')+text('B: water',643,341,'middle');
 }else if(key==='pondweed'){
  h=352;html=picture(key,386,0,280,340)+text('Tube full',100,57)+text('of water',100,84)+line(215,72,526,57)
   +text('Water level',746,158)+line(735,153,611,140)
   +text('Inverted funnel',100,236)+line(274,231,493,227)
   +text('Pondweed',746,303)+line(735,298,554,280);
 }else if(key==='whole-plant'){
  h=520;html=picture(key,342,20,340,480)
   +text('Light energy',100,48)+arrow(256,54,459,99)
   +text('Carbon dioxide',100,209)+arrow(279,214,422,214)
   +text('Oxygen',767,166)+arrow(666,185,750,170)
   +text('Sugars made',744,276)+text('in green tissue',744,303)+line(731,287,600,255)
   +text('Water and',100,415)+text('minerals',100,442)+arrow(228,426,431,426);
 }else if(key==='stomata'){
  h=420;html=picture(key,251,25,550,350)+text('Surface cells',100,40)+line(248,43,327,111)
   +text('Guard cells',812,79)+line(799,74,555,187)
   +text('Pore',100,281)+line(159,276,523,207);
 }else if(key==='dye-setup'){
  h=326;html=picture(key,176,0,700,285)+text('A: plain water',418,318,'middle')+text('B: dyed water',634,318,'middle');
 }else if(key==='stem-detail'){
  h=385;html=picture(key,226,25,600,315)+text('Cut stem',446,375,'middle')+text('Vascular bundle',704,375,'middle')
   +text('Xylem',100,91)+line(181,86,459,83)
   +text('Phloem',840,110)+line(827,105,737,175);
 }else if(key==='seed-flasks'){
  h=342;html=picture(key,176,0,700,300)+text('A: seeds',440,336,'middle')+text('B: control',622,336,'middle');
 }else if(key==='growth-results'){
  h=310;html=picture(key,176,0,700,275)+text('Light',448,303,'middle')+text('Darkness',623,303,'middle');
 }else if(key==='snail-tubes'){
  h=330;html=picture(key,151,0,750,295);[388,478,570,661].forEach((x,i)=>{html+=text('ABCD'[i],x,323,'middle');});
 }else if(key==='four-conditions'){
  h=295;for(let i=0;i<4;i++){const x=119+i*218;html+=picture('whole-plant',x,10,164,225)+text('ABCD'[i],x+82,267,'middle');}
 }else throw Error('Unknown plant diagram '+key);
 return {html:`<g class="v2-plant-diagram" data-diagram="${key}">${html}</g>`,h};
}
