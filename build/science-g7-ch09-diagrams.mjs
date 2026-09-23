// Painted structures with live callouts. Sizes are selected by teaching role,
// never by the amount of unused space on a page.
import fs from 'node:fs';
const assets=JSON.parse(fs.readFileSync('assets/design-history/science-g7-ch09/artwork.json','utf8'));
const E=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const text=(s,x,y,anchor='start')=>`<text class="v2-life-label" x="${x}" y="${y}" text-anchor="${anchor}">${E(s)}</text>`;
const line=(x1,y1,x2,y2)=>`<line class="v2-life-line" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
function arrow(x1,y1,x2,y2){const a=Math.atan2(y2-y1,x2-x1),r=10;return `<path class="v2-life-arrow" d="M${x1} ${y1}L${x2} ${y2}M${x2-r*Math.cos(a-.5)} ${y2-r*Math.sin(a-.5)}L${x2} ${y2}L${x2-r*Math.cos(a+.5)} ${y2-r*Math.sin(a+.5)}"/>`;}
function picture(key,x,y,w,h){const a=assets.find(a=>a.key===key);if(!a)throw Error('Missing asset '+key);const s=Math.min(w/a.pixels[0],h/a.pixels[1]),iw=a.pixels[0]*s,ih=a.pixels[1]*s;return `<image class="science-illustration" data-art="${key}" href="../../${a.file}" x="${x+(w-iw)/2}" y="${y+(h-ih)/2}" width="${iw}" height="${ih}" preserveAspectRatio="xMidYMid meet"/>`;}
export function lifeDiagram(key){let html='',h=0;
 if(key==='digestive'){
  h=640;html=picture(key,330,15,400,600)
   +text('Mouth',100,78)+line(180,73,459,70)
   +text('Oesophagus',100,180)+line(241,175,534,176)
   +text('Liver',100,285)+line(157,280,480,278)
   +text('Gallbladder',100,350)+line(235,345,463,316)
   +text('Small intestine',100,442)+line(270,437,512,445)
   +text('Rectum',100,565)+line(188,560,526,558)
   +text('Stomach',755,260)+line(742,255,598,290)
   +text('Pancreas',755,364)+line(742,359,557,340)
   +text('Large intestine',755,477)+line(742,472,624,428)
   +text('Anus',755,610)+line(742,605,526,596);
 }else if(key==='peristalsis'){
  h=370;html=picture(key,296,10,480,320)+text('Contraction',100,80)+line(238,75,435,77)
   +text('Food',100,139)+line(160,134,437,125)
   +text('Relaxed wall',100,254)+line(241,249,457,246)
   +text('Later',805,88)+line(798,94,621,145)
   +arrow(537,116,537,217)+text('First',440,355,'middle')+text('Next',627,355,'middle');
 }else if(key==='villi'){
  h=405;html=picture(key,226,40,600,350)+text('Villi',100,64)+line(151,58,301,120)
   +text('Thin surface',100,192)+line(249,187,293,193)
   +text('Blood vessels',783,36)+line(798,45,674,186)
   +text('Lymph',840,351)+text('vessel',840,377)+line(827,369,670,243);
 }else if(key==='ruminant'){
  h=398;html=picture(key,204,35,630,340)+text('Oesophagus',100,26)+line(242,31,402,163)
   +text('Rumen',755,24)+line(754,29,566,175)
   +text('Intestine',789,326)+line(779,319,704,208);
 }else if(key==='bird'){
  h=375;html=picture(key,270,26,510,330)+text('Oesophagus',100,59)+line(241,54,386,105)
   +text('Crop',100,139)+line(155,134,418,174)
   +text('Glandular',100,228)+text('stomach',100,254)+line(222,240,454,196)
   +text('Gizzard',787,249)+line(776,244,519,224)
   +text('Intestine',787,321)+line(776,316,624,243);
 }else if(key==='respiratory'){
  h=602;html=picture(key,340,12,380,570)+text('Nostrils',100,139)+line(190,134,439,144)
   +text('Nasal passage',100,200)+line(261,195,478,121)
   +text('Windpipe',100,296)+line(210,291,527,285)
   +text('Rib cage',100,414)+line(198,409,395,410)
   +text('Diaphragm',100,570)+line(225,565,528,520)
   +text('Branch to lung',752,327)+line(741,322,556,346)
   +text('Lung',752,440)+line(741,435,624,441);
 }else if(key==='lung-model'){
  h=366;html=picture(key,385,0,240,350)+text('Open tube',123,36)+line(241,31,512,24)
   +text('Airtight seal',123,100)+line(261,95,510,68)
   +text('Balloon',705,206)+line(694,201,564,221)
   +text('Rubber sheet',123,315)+line(278,310,501,305)
   +text('Pull tab',705,340)+line(694,335,519,336);
 }else if(key==='breathing-states'){
  h=320;html=picture(key,186,38,680,260)+text('Inhalation',421,26,'middle')+text('Quiet exhalation',627,26,'middle')
   +arrow(421,34,421,60)+arrow(627,60,627,34);
 }else if(key==='alveoli'){
  h=465;html=picture(key,281,27,520,390)
   +text('Air space',100,115)+line(212,110,489,193)
   +text('Thin wall',100,300)+line(210,295,440,320)
   +text('Blood capillary',745,448)+line(734,439,621,355)
   +arrow(469,247,469,335)+text('Oxygen',100,240)+line(190,235,459,251)
   +arrow(593,336,593,253)+text('Carbon',817,225)+text('dioxide',817,253)+line(806,238,611,258);
 }else if(key==='animal-gas-exchange'){
  h=314;html=picture(key,99,30,850,225)+text('Gills',100,26)+line(154,30,329,133)
   +text('Fish',380,285,'middle')+text('Adult frog',585,285,'middle')+text('Earthworm',735,285,'middle');
 }else if(key==='iodine-setup'||key==='iodine-results'){
  h=270;html=picture(key,316,5,420,240)+text('A',key==='iodine-setup'?459:471,267,'middle')+text('B',key==='iodine-setup'?529:540,267,'middle');
 }else if(key==='lime-setup'){
  h=338;html=picture(key,146,4,760,290)+text('A: room air',359,327,'middle')+text('B: exhaled air',571,327,'middle');
 }else throw Error('Unknown life diagram '+key);
 return {html:`<g class="v2-life-diagram" data-diagram="${key}">${html}</g>`,h};
}
