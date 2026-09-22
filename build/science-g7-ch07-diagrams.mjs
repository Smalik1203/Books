// Painted apparatus with live labels and precise analytical overlays.
// Heights are the reviewed pagination contract. Native PNGs retain their alpha.
import {readFileSync} from 'node:fs';
const artwork=JSON.parse(readFileSync(new URL('../assets/design-history/science-g7-ch07/artwork.json',import.meta.url),'utf8'));
const E=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const t=(s,x,y,a='middle')=>'<text class="v2-heat-label" x="'+x+'" y="'+y+'" text-anchor="'+a+'">'+E(s)+'</text>';
const line=d=>'<path class="v2-heat-line" d="'+d+'"/>';
const arrow=(x,y,xx,yy)=>{const a=Math.atan2(yy-y,xx-x),l=10;return line('M'+x+' '+y+'L'+xx+' '+yy+'M'+(xx-l*Math.cos(a-.5))+' '+(yy-l*Math.sin(a-.5))+'L'+xx+' '+yy+'L'+(xx-l*Math.cos(a+.5))+' '+(yy-l*Math.sin(a+.5)));};
function painted(key,x,y,h,crop){
 const a=artwork.find(a=>a.key==='apparatus-'+key);if(!a)throw Error('Missing apparatus '+key);
 const [l,top,r,b]=crop||a.alphaBounds,w=(r-l)*h/(b-top);
 return '<svg class="science-illustration" data-apparatus="'+key+'" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" viewBox="'+l+' '+top+' '+(r-l)+' '+(b-top)+'" preserveAspectRatio="xMidYMid meet"><image href="../../'+a.file+'" width="'+a.pixels[0]+'" height="'+a.pixels[1]+'"/></svg>';
}
const candle=(x,y,h=58)=>painted('candle',x,y,h);
function strip(x,y,mid=false){
 const scale=195/982,px=s=>(s-36)*scale;
 let html=painted('strip',0,0,195);
 for(const [i,s] of [297,543,781,1019].entries())html+=t(['I','II','III','IV'][i],px(s),43);
 // Reuse the equipment; move the flame from the free end to midway II/III.
 const flame=mid?(px(543)+px(781))/2:px(60);
 // The flame tip is just beneath the metal (y~63); the holder rests
 // level with the stand. Numerals above the bar stay clear of the candle.
 const candleH=124,candleW=979*candleH/1031;
 html+=candle(flame-candleW/2,66,candleH);
 // Pin numerals sit in transparent space within this apparatus viewport.
 return '<svg class="science-illustration" x="'+(x-60)+'" y="'+y+'" width="370" height="195" viewBox="-60 0 370 195">'+html+'</svg>';
}
export function heatDiagram(key){
 let html='',h=270;
 if(key==='strip'){
  h=225;html=strip(345,10)+t('Metal strip',232,54)+line('M297 59L363 69')
   +t('Clamp and stand',792,70)+line('M690 75L621 76')
   +t('Candle',213,192)+line('M259 185L338 178');
 }else if(key==='cups'){
  h=295;
  html=painted('cups',280,25,186)+candle(290,232,40)
   +t('Central suspension',479,20,'end')+line('M493 17L434 31')
   +t('Equal threads',802,95)+line('M737 102L553 111')
   +t('Inverted cups',783,179)+line('M686 184L581 190')
   +t('Candle well below paper',547,285);
 }else if(key==='beaker-setup'){
  h=280;html=painted('beaker',429,3,269)
   +t('Straw guide',350,29,'end')+line('M366 25L461 20')
   +t('Water',715,108,'start')+line('M694 105L565 106')
   +t('Colour grain',715,174,'start')+line('M695 168L593 168L528 136')
   +t('Gauze and tripod',309,237,'end')+line('M326 229L461 158');
 }else if(key==='beaker-flow'){
  h=160;html=painted('beaker-flow',435,3,147);
  // Arrows lie within the lower, water-filled half of the painted vessel.
  html+=arrow(517,126,517,78)+arrow(509,79,465,79)+arrow(525,79,574,79)
   +arrow(465,85,465,127)+arrow(574,85,574,127)
   +arrow(473,130,505,130)+arrow(566,130,529,130)
   +t('Warmer water',309,68,'end')+t('rises',309,96,'end')+line('M326 85H492L510 93')
   +t('Cooler water',721,68,'start')+t('sinks',721,96,'start')+line('M702 85H610L581 100');
 }else if(key==='bowls'){
  h=225;
  html=painted('bowls',190,4,178,[50,45,755,930])+painted('bowls',630,4,178,[790,45,1490,930]);
  for(const [i,x] of [270,710].entries()){
   html+=t(i?'Water':'Soil',x,219)+t('Bulb clear',x+139,112,'start')
    +t('of base',x+139,140,'start')+line('M'+(x+129)+' 148H'+(x+50)+'L'+(x+14)+' 144');
  }
 }else if(key==='breezes'){
  h=300;
  for(let i=0;i<2;i++){
   const x=101+i*440;
   html+='<g transform="translate('+x+' 0)">'
    +t(i?'Night · land breeze':'Day · sea breeze',200,29)
    +painted('coast',0,202,78,[18,210,2160,660])
    +t(i?'Warmer sea':'Cooler sea',92,297)+t(i?'Cooler land':'Warmer land',303,297);
   html+=i?arrow(280,215,110,215)+arrow(85,205,85,100)+arrow(110,89,290,89)+arrow(310,103,310,194)
    :arrow(110,215,290,215)+arrow(310,205,310,100)+arrow(290,89,110,89)+arrow(85,103,85,194);
   html+=t('Near-surface air',200,196)+t('Return flow aloft',200,68)+'</g>';
  }
 }else if(key==='seepage'){
  h=280;
  for(const [i,name] of ['Clay','Sand','Gravel'].entries()){
   const x=200+i*280,left=[55,549,1040][i];
   html+=painted('seepage',x,65,204,[left,93,left+440,932])
    +t(name,x+53,24)+t('200 mL',x+53,55);
  }
 }else if(key==='aquifer'){
  h=330;html=painted('aquifer',330,22,271);
  // Source y=560 is the saturation boundary; the screened well ends below it.
  html+=line('M337 172H747')
   +t('Ground surface',165,46,'start')+line('M305 51L378 90')
   +'<text class="v2-heat-label" x="299" y="107" text-anchor="end"><tspan x="299">Unsaturated soil</tspan><tspan x="299" dy="28"> and rock</tspan></text>'+line('M307 128L378 126')
   +t('Water table',161,181,'start')+line('M299 174H336')
   +'<text class="v2-heat-label" x="299" y="231" text-anchor="end"><tspan x="299">Saturated, permeable</tspan><tspan x="299" dy="28"> aquifer</tspan></text>'+line('M310 235L379 233')
   +t('Well',819,29,'start')+line('M798 34H729L634 44')
   +t('Recharge',865,103)+arrow(816,114,737,202)
   +arrow(424,129,424,202)+arrow(552,129,552,202)
   +t('Less permeable layer',543,327)+line('M543 304V278')
   +[395,448,492,579,706].map(x=>'<circle class="v2-heat-pore" cx="'+x+'" cy="240" r="3"/>').join('');
 }else if(key==='assessment-objects'){
  h=232;html=painted('pan',145,19,166)+strip(565,5,true)
   +t('A',351,227)+line('M351 207L348 171')
   +t('B',119,85)+line('M135 79L191 62');
 }else if(key==='test-tubes'){
  h=315;
  for(let i=0;i<2;i++){
   const x=231+i*420,l=i?797:122;
   html+=painted('test-tubes',x,51,211,[l,65,l+680,955])
    +t(i?'(b) Heating higher up':'(a) Heating lower down',x+71,28)
    +t('Thermometer',x+172,82,'start')+line('M'+(x+162)+' 87L'+(x+130)+' 101')
    +t('Water',x+150,279)+line('M'+(x+126)+' 266L'+(x+79)+' 209');
   const flameX=i?x+109:x+32,flameY=i?166:260;
   html+=candle(flameX-23,flameY,49);
  }
 }else if(key==='spiral'){
  h=205;html=painted('spiral',231,3,169,[51,109,836,877])
   +painted('spiral',661,3,169,[879,0,1508,940])
   +t('Cut line',318,198)+t('Suspended centre',728,198);
 }else throw Error('Unknown diagram '+key);
 return {h,html:'<g class="v2-heat-diagram" data-diagram="'+key+'">'+html+'</g>'};
}
