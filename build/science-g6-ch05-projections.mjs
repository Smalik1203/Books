// Authored depth views. Scale ticks and motion paths remain deterministic.
export function measurementProjection(key,{text,line,path,arrow,pencil}){
 const defs=id=>`<defs><linearGradient id="${id}-surface"><stop class="measure-stop-light"/><stop offset=".48" class="measure-stop-mid"/><stop offset="1" class="measure-stop-light"/></linearGradient><radialGradient id="${id}-metal" cx=".3" cy=".25"><stop class="measure-stop-light"/><stop offset=".45" class="measure-stop-mid"/><stop offset="1" class="measure-stop-dark"/></radialGradient></defs>`;
 if(key==='circumference')return {h:300,html:defs('g5-glass')+
  `<ellipse class="measure-ground" cx="499" cy="255" rx="145" ry="18"/>`+
  `<path class="measure-glass-volume" fill="url(#g5-glass-surface)" d="M370 78C370 40 630 40 630 78L599 243C590 280 410 280 401 243Z"/>`+
  `<ellipse class="measure-glass-rim" cx="500" cy="78" rx="130" ry="33"/><ellipse class="measure-glass-inner" cx="500" cy="79" rx="119" ry="25"/>`+
  `<path class="measure-glass-highlight" d="M390 100L414 228M606 102L587 220"/>`+
  `<ellipse class="v2-measure-thread v2-measure-dashed" cx="500" cy="244" rx="100" ry="26"/>`+
  path('M400 244A100 26 0 0 0 600 244','v2-measure-thread')+
  text('Tumbler',500,28,'middle')+text('Around the base',794,214,'middle')+line(710,224,601,246)};
 if(key==='paper-stack'){
  let sheets='';for(let i=0;i<12;i++){const y=142+i*5;sheets+=path(`M250 ${y}L630 ${y}L716 ${y-52}`,'measure-paper-edge');}
  return {h:265,html:`<path class="measure-ground" d="M238 220L640 220L745 151L337 151Z"/>`+
   path('M250 125L630 125L716 73V145L630 207H250Z','measure-paper-side')+
   sheets+path('M250 125L335 63H716L630 125Z','measure-paper-top')+
   line(752,75,752,146)+line(741,75,763,75)+line(741,146,763,146)+text('Stack thickness',775,117)+
   text('Count sheets, not page faces',485,254,'middle')};
 }
 if(key==='track'){
  const route='M158 34L300 202Q381 284 493 276A104 104 0 1 1 497 275L890 275';
  let supports='';for(const [x,y] of [[205,89],[296,198],[401,245],[507,273],[730,275],[873,275]])supports+=path(`M${x} ${y}V310l20 -12V${y+10}Z`,'measure-track-support');
  let html=defs('g5-track')+path('M145 314H909L928 299H165Z','measure-paper-side')+supports+
   `<g transform="translate(9 7)">${path(route,'measure-track-back')}</g>`+path(route,'v2-measure-track')+path(route,'v2-measure-rail')+
   `<circle class="measure-metal-ball" fill="url(#g5-track-metal)" cx="209" cy="94" r="15"/>`;
  for(const [name,x,y] of [['A',143,24],['B',280,242],['C',486,349],['D',500,50],['E',641,252],['F',912,281]])html+=text(name,x,y,'middle');
  return {h:360,html:html+arrow(260,130,293,168)+arrow(749,337,834,337)};
 }
 if(key==='maze'){
  let grid='';for(let x=190;x<=870;x+=40)grid+=line(x,42,x,340,'measure-grid');for(let y=42;y<=340;y+=40)grid+=line(190,y,870,y,'measure-grid');
  return {h:450,html:path('M168 28H897V356H168Z','measure-paper-side')+path('M160 20H889V348H160Z','measure-paper-top')+grid+
   path('M200 95V42H850V220M850 275V322H200V155M330 42V210M460 140V322M590 42V210M720 140V322','v2-measure-track')+
   text('In',125,133,'middle')+text('Out',934,256,'middle')+arrow(142,124,194,124)+arrow(855,247,910,247)+pencil(222,377,640)};
 }
 return null;
}
