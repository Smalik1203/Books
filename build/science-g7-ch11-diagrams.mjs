// Painted apparatus with explicit vector light paths. Setup figures have no outcomes.
import fs from 'node:fs';
const assets=JSON.parse(fs.readFileSync('assets/design-history/science-g7-ch11/artwork.json','utf8'));
const E=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const text=(s,x,y,anchor='start')=>`<text class="v2-light-label" x="${x}" y="${y}" text-anchor="${anchor}">${E(s)}</text>`;
const line=(x1,y1,x2,y2,extra='')=>`<line class="v2-light-line ${extra}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
function arrow(x1,y1,x2,y2){const a=Math.atan2(y2-y1,x2-x1),r=10;return `<path class="v2-light-arrow" d="M${x1} ${y1}L${x2} ${y2}M${x2-r*Math.cos(a-.5)} ${y2-r*Math.sin(a-.5)}L${x2} ${y2}L${x2-r*Math.cos(a+.5)} ${y2-r*Math.sin(a+.5)}"/>`;}
function picture(key,x,y,w,h){const a=assets.find(a=>a.key===key);if(!a)throw Error('Missing asset '+key);const s=Math.min(w/a.pixels[0],h/a.pixels[1]),iw=a.pixels[0]*s,ih=a.pixels[1]*s;return `<image class="science-illustration" data-art="${key}" href="../../${a.file}" x="${x+(w-iw)/2}" y="${y+(h-ih)/2}" width="${iw}" height="${ih}" preserveAspectRatio="xMidYMid meet"/>`;}
const rect=(x,y,w,h,cls='v2-light-screen')=>`<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}"/>`;
export function lightDiagram(key){let html='',h=0;
 if(key==='shadow-rays'){
  h=330;
  for(let i=0;i<2;i++){
   const sx=140,sy=80+i*150,ox=i?640:430,screen=880,half=23,spread=half*(screen-sx)/(ox-sx);
   html+=text(i?'Object nearer screen':'Object nearer source',110,sy-45)+rect(screen,sy-65,12,130)+rect(screen,sy-spread,12,spread*2,'v2-light-shadow')
    +`<circle class="v2-light-solid" cx="${sx}" cy="${sy}" r="5"/>`+rect(ox-5,sy-half,10,half*2,'v2-light-solid')
    +arrow(sx,sy,screen,sy-spread)+arrow(sx,sy,screen,sy+spread);
  }
  html+=text('Small source',140,325,'middle')+text('Screen',890,325,'middle');
 }else if(key==='reflection-rays'){
  h=275;html=rect(200,234,652,14)+line(526,35,526,234,'v2-light-dashed')
   +arrow(346,54,526,234)+arrow(526,234,706,54)
   +text('Incoming ray',180,40)+text('Reflected ray',705,40)
   +text('Normal',542,88)+text('Plane mirror',788,273,'middle');
 }else if(key==='mirror-pen'){
  h=345;html=picture('mirror-pen',236,0,580,340);
 }else if(key==='mirror-word'){
  h=135;html=text('Word facing mirror',300,30,'middle')+text('Mirror writing',754,30,'middle')
   +'<text class="v2-light-word" x="300" y="99" text-anchor="middle">AMBULANCE</text>'
   +'<g transform="translate(1508 0) scale(-1 1)"><text class="v2-light-word" x="754" y="99" text-anchor="middle">AMBULANCE</text></g>';
 }else if(key==='pinhole-rays'){
  h=365;
  // Corresponding painted points are related by a half turn about the hole.
  // Both representative rays therefore cross exactly at (526,184).
  html=picture('tree',111,70,172,250)+rect(519.5,40,13,138,'v2-light-solid')+rect(519.5,190,13,140,'v2-light-solid')
   +'<g transform="translate(1052 368) rotate(180)">'+picture('tree',111,70,172,250)+'</g>'
   +arrow(170,80,882,288)+arrow(205,306,847,62)
   +text('Object',195,355,'middle')+text('Pinhole',526,30,'middle')+text('Image on screen',855,355,'middle');
 }else if(key==='pinhole-assembly'){
  h=300;html=picture('pinhole-kit',156,0,740,285);
 }else if(key==='periscope'){
  h=410;html=picture('periscope',157,0,300,400);
  html+=`<path class="v2-light-housing" d="M570 42H780V317H876V391H705V116H570"/>`
   +line(704,42,778,116,'v2-light-mirror')+line(704,316,778,390,'v2-light-mirror')
   +arrow(570,79,741,79)+arrow(741,79,741,353)+arrow(741,353,876,353)
   +text('From object',573,25)+text('Towards eye',827,409,'middle');
 }else if(key==='kaleidoscope'){
  h=360;html=picture('kaleidoscope',206,0,640,350);
 }else if(key==='shadow-question'){
  h=220;html=picture('shadow-setup',176,0,700,210);
 }else if(key==='pipe-question'){
  h=350;html=picture('pipe-question',206,35,700,290)+text('Sahil',270,28)+text('Rekha',191,180,'end')+text('Patrick',270,349)+text('Qasima',640,349)+text('LED',844,28);
 }else if(key==='periscope-question'){
  h=285;html=`<path class="v2-light-housing" d="M745 20H910V265H745M745 80H850V205H745"/>`
   +text('Upper',725,57,'end')+text('Lower',725,240,'end');
 }else throw Error('Unknown light diagram '+key);
 return {html:`<g class="v2-light-diagram" data-diagram="${key}">${html}</g>`,h};
}
