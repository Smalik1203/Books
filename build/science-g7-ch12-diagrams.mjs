// Painted celestial bodies; live text, axes and light paths retain exact geometry.
import fs from 'node:fs';
const assets=JSON.parse(fs.readFileSync('assets/design-history/science-g7-ch12/artwork.json','utf8'));
let serial=0;
const E=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;');
const text=(s,x,y,anchor='start')=>`<text class="v2-space-label" x="${x}" y="${y}" text-anchor="${anchor}">${E(s)}</text>`;
const line=(x1,y1,x2,y2,c='')=>`<line class="v2-space-line ${c}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
const path=(d,c='v2-space-line')=>`<path class="${c}" d="${d}"/>`;
const circle=(x,y,r,c)=>`<circle class="${c}" cx="${x}" cy="${y}" r="${r}"/>`;
function arrow(x1,y1,x2,y2){const a=Math.atan2(y2-y1,x2-x1),r=10;return path(`M${x1} ${y1}L${x2} ${y2}M${x2-r*Math.cos(a-.5)} ${y2-r*Math.sin(a-.5)}L${x2} ${y2}L${x2-r*Math.cos(a+.5)} ${y2-r*Math.sin(a+.5)}`,'v2-space-arrow');}
function pic(key,x,y,r,tilt=0){const a=assets.find(a=>a.key===key);if(!a)throw Error(key);const id='space-body-'+(++serial);return `<svg class="science-illustration" data-art="${key}" x="${x-r}" y="${y-r}" width="${2*r}" height="${2*r}" viewBox="0 0 200 200" overflow="hidden"><defs><clipPath id="${id}"><circle cx="100" cy="100" r="100"/></clipPath></defs><g clip-path="url(#${id})"><image data-art="${key}" href="../../${a.file}" x="-10" y="-10" width="220" height="220" transform="rotate(${tilt} 100 100)" preserveAspectRatio="xMidYMid meet"/></g></svg>`;}
function earth(x,y,r,night='right',tilt=-23.5){
 let s=pic('earth',x,y,r,tilt);
 if(night)s+=path(night==='right'?`M${x} ${y-r}A${r} ${r} 0 0 1 ${x} ${y+r}Z`:`M${x} ${y-r}A${r} ${r} 0 0 0 ${x} ${y+r}Z`,'v2-space-night');
 return s;
}
function axis(x,y,r){const dx=Math.sin(23.5*Math.PI/180)*(r+24),dy=Math.cos(23.5*Math.PI/180)*(r+24);return line(x-dx,y-dy,x+dx,y+dy,'v2-space-axis')+text('N',x-dx-4,y-dy-8,'middle');}
export function spaceDiagram(key){let html='',h=0;
 if(key==='rotation'){
  h=290;html=earth(526,140,107,null,0)+line(526,7,526,266,'v2-space-axis')+text('North Pole',680,35)+line(615,30,533,25)+text('South Pole',680,265)+line(628,260,533,245)+text('Equator',180,150)+line(286,143,416,143)+path('M426 143Q526 184 626 143')+arrow(478,190,567,190)+text('West → east',526,289,'middle');
 }else if(key==='daynight'||key==='tilt-question'){
  h=305;html=pic('sun',207,144,70)+earth(666,144,112)+axis(666,144,112);
  for(const y of [85,144,203])html+=arrow(310,y,536,y);
  html+=text('Sun',207,260,'middle')+text('Sunlight',413,50,'middle')+text('Earth',666,305,'middle');
  if(key==='daynight')html+=text('Day',527,277,'middle')+text('Night',794,277,'middle');
 }else if(key==='pole'){
  h=330;html=earth(805,196,79,null)+axis(805,196,79)+text('Earth’s axis',805,327,'middle');
  const cx=391,cy=150;
  for(const r of [52,91,128])html+=path(`M${cx-r} ${cy}A${r} ${r} 0 1 0 ${cx} ${cy-r}`,'v2-space-trail');
  html+=circle(cx,cy,6,'v2-space-dot')+text('Pole Star',391,178,'middle')+text('Apparent star paths',391,320,'middle')+line(591,69,750,63,'v2-space-dashed');
 }else if(key==='orbit'){
  h=355;html=`<ellipse class="v2-space-line v2-space-dashed" cx="526" cy="168" rx="262" ry="118"/>`+pic('sun',526,168,53);
  for(const [x,y,month] of [[264,168,'June'],[526,50,'March'],[788,168,'December'],[526,286,'September']]){
   html+=earth(x,y,36,null,0)+text(month,x===526?630:x,y===50?55:y===286?301:236,x===526?'start':'middle');
   const dx=x-526,dy=y-168,l=Math.hypot(dx,dy);html+=arrow(x+dx/l*42,y+dy/l*42,x+dx/l*92,y+dy/l*62);
  }
  html+=text('Sun',526,241,'middle')+text('View from night side',130,330);
 }else if(key==='seasons'||key==='polar'){
  h=310;
  // The left globe is in December: north leans away from the central Sun.
  // The right globe is in June: north leans towards the same Sun.
  // Illumination faces the central Sun, independently of the tilted geography.
  html=pic('sun',526,140,46)+earth(286,140,83,'left')+axis(286,140,83)+earth(766,140,83,'right')+axis(766,140,83);
  html+=arrow(465,140,386,140)+arrow(587,140,666,140)+text('December',286,275,'middle')+text('June',766,275,'middle')+text('Sun',526,225,'middle');
  if(key==='polar')html+=text('North Pole: darkness',286,309,'middle')+text('North Pole: daylight',766,309,'middle');
 }else if(key==='sun-angle'){
  h=295;html=pic('sun',162,105,47);
  html+=text('More direct',401,30,'middle')+text('More oblique',785,30,'middle');
  html+=path('M297 223H502','v2-space-surface')+path('M653 189L905 272','v2-space-surface');
  for(const x of [350,390,430])html+=arrow(x,70,x,216);
  for(const x of [705,745,785])html+=arrow(x,70,x,199+(x-705)*.33);
  html+=text('Smaller lit area',400,287,'middle')+text('Larger lit area',788,307,'middle');h=320;
 }else if(key==='apparent-size'){
  h=270;html=pic('moon',395,134,43)+pic('sun',780,134,125)+circle(164,134,5,'v2-space-dot')+line(164,134,780,9)+line(164,134,780,259)+text('Viewpoint',164,210,'middle')+text('Nearer, smaller',396,242,'middle')+text('Farther, larger',780,296,'middle');h=312;
 }else if(key==='solar'){
  h=318;html=path('M600 116L922 29L922 275L600 188Z','v2-space-penumbra')+path('M600 116L922 149L922 155L600 188Z','v2-space-umbra')+path('M600 116L922 149M600 188L922 155')+pic('sun',170,152,80)+pic('moon',600,152,36)+earth(866,152,62,null,0)+circle(811,152,7,'v2-space-night');
  html+=text('Sun',170,277,'middle')+text('Moon',600,254,'middle')+text('Earth',866,263,'middle')+text('Umbra',726,70,'middle')+line(726,78,742,144)+text('Penumbra',713,309,'middle')+line(751,285,787,218)+arrow(287,152,465,152);
 }else if(key==='lunar'){
  h=318;html=path('M525 88L928 6L928 298L525 216Z','v2-space-penumbra')+path('M525 88L928 107L928 197L525 216Z','v2-space-umbra')+pic('sun',170,152,80)+earth(525,152,64,null,0)+pic('moon',830,152,25)+circle(830,152,25,'v2-space-night')+path('M525 88L928 107M525 216L928 197');
  html+=text('Sun',170,276,'middle')+text('Earth',525,268,'middle')+text('Moon',830,247,'middle')+text('Earth’s umbra',768,54,'middle')+line(764,61,739,135)+arrow(287,152,425,152);
 }else if(key==='projection'){
  h=295;html=pic('sun',177,115,64)+path('M473 26L499 46V239L473 219Z','v2-space-card')+path('M850 30L926 62V272L850 240Z','v2-space-card')+circle(486,132,4,'v2-space-dot')+line(213,78,486,132)+line(486,132,878,211)+line(213,150,486,132)+line(486,132,878,107)+pic('sun',878,162,23)+text('Sun',177,226,'middle')+text('Card with pinhole',483,276,'middle')+text('Screen',879,304,'middle');h=320;
 }else if(key==='system'){
  h=244;html=pic('sun',264,100,76)+pic('earth',526,100,65)+pic('moon',788,100,46)+text('Sun: light source',264,228,'middle')+text('Earth: our planet',526,228,'middle')+text('Moon: Earth’s satellite',788,228,'middle');
 }else throw Error('Unknown diagram '+key);
 return {html:`<g class="v2-space-diagram" data-diagram="${key}">${html}</g>`,h};
}

// Dedicated reference art; never rotate stock planets onto text-heavy pages.
export function pageVisual(source=[],title=''){
 const choice=title==='Keywords'?['shadow-model','figures/class-7/science/ch11/shadow-setup.png','Use a light source and an opaque object to model a shadow.']:
  title==='Summary'?['observatory','figures/class-6/science/ch12/observatory.png','Observations help us test models of the sky.']:null;
 if(!choice)throw Error('Author a dedicated Chapter 12 illustration for this page; do not repeat stock planet art.');
 const [key,file,caption]=choice;
 return {h:340,html:`<g class="v2-page-visual"><image class="science-illustration" data-art="${key}" href="../../${file}" x="166" y="10" width="720" height="280" preserveAspectRatio="xMidYMid meet"/><text class="se-caption" x="526" y="318" text-anchor="middle">${caption}</text></g>`};
}
