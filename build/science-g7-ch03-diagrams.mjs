// Live, code-native electrical symbols. No bitmap labels or decorative frames.
const E=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
const path=d=>`<path class="v2-circuit-wire" d="${d}"/>`;
const text=(s,x,y,anchor='middle')=>`<text class="v2-circuit-label" x="${x}" y="${y}" text-anchor="${anchor}">${E(s)}</text>`;
const dot=(x,y)=>`<circle class="v2-circuit-contact" cx="${x}" cy="${y}" r="4"/>`;
const group=(html,x=0,y=0)=>`<g transform="translate(${x} ${y})">${html}</g>`;
function cell(x,y,{reverse=false,battery=false}={}){
 let h='';const count=battery?2:1,start=x-(count===2?18:7);
 for(let i=0;i<count;i++){const a=start+i*22,b=a+12;h+=path(`M${a} ${y-(reverse?10:21)}v${reverse?20:42}M${b} ${y-(reverse?21:10)}v${reverse?42:20}`);}
 const left=start,right=start+(count-1)*22+12;
 return path(`M${x-40} ${y}H${left}M${right} ${y}H${x+40}`)+h;
}
function lamp(x,y){return `<circle class="v2-circuit-wire" cx="${x}" cy="${y}" r="20"/>`+path(`M${x-14} ${y-14}l28 28M${x-14} ${y+14}l28 -28M${x-40} ${y}h20M${x+20} ${y}h20`);}
function led(x,y){return path(`M${x-40} ${y}h24M${x-16} ${y-17}l30 17l-30 17ZM${x+14} ${y-19}v38M${x+14} ${y}h26M${x-1} ${y-26}l15 -17m-9 2l9 -2l-1 9M${x+17} ${y-26}l15 -17m-9 2l9 -2l-1 9`);}
function resistor(x,y){return path(`M${x-40} ${y}h15M${x-25} ${y-11}h50v22h-50ZM${x+25} ${y}h15`);}
function sw(x,y,closed=false){return path(`M${x-40} ${y}h18M${x+22} ${y}h18M${x-18} ${y}L${x+18} ${y-(closed?0:22)}`)+dot(x-20,y)+dot(x+20,y);}
function loop({diode=false,reverse=false,two=false,switches=false,open=false,tester=false,label=false}={}){
 // 360 x 180, no invisible automatic wire crossings.
 let h=path('M40 55H140M220 55H320V155H220M140 155H40V55');
 h+=cell(180,155,{reverse,battery:diode||two});
 if(two){h=path('M40 55H50M130 55H230M310 55H320V155H220M140 155H40V55')+lamp(90,55)+lamp(270,55)+cell(180,155,{battery:true});}
 else h+=diode?led(180,55):lamp(180,55);
 if(diode){h=h.replace(path('M40 55H140M220 55H320V155H220M140 155H40V55'),path('M40 55H140M220 55H320V155H220M140 155H40V135'));
  // Resistor in the left vertical branch, rotated without rotating any type.
  h+=`<g transform="translate(40 95) rotate(90)">${resistor(0,0)}</g>`;
 }
 if(open||switches){
  // Switch on right vertical branch. Replace the continuous branch first.
  h=h.replace('H320V155H220','H320V65M320 145V155H220');
  h+=`<g transform="translate(320 105) rotate(90)">${sw(0,0,!open&&!switches)}</g>`;
 }
 if(tester){h=h.replace('H320V155H220','H320V80M320 125V155H220');h+=dot(320,80)+dot(320,125)+text('A',342,85,'start')+text('B',342,131,'start');}
 if(label)h+=text('Cell',180,199);
 return h;
}
export function circuitDiagram(key){
 let html='',h=240;
 if(key==='cells'){
  html=path('M210 90H310M390 90H550M630 90H770')+cell(350,90)+cell(590,90)+dot(210,90)+dot(770,90);
  html+=text('+',210,58)+text('−',770,58)+text('Positive joins negative between cells',490,160)+text('Two 1.5 V cells in series: about 3 V',490,203);h=230;
 }
 else if(key==='symbols'){
  const names=['Cell','Battery (two cells)','Incandescent lamp','LED','Closed switch','Open switch','Wire','Resistor'];
  const marks=[cell, (x,y)=>cell(x,y,{battery:true}),lamp,led,(x,y)=>sw(x,y,true),(x,y)=>sw(x,y,false),(x,y)=>path(`M${x-40} ${y}h80`),resistor];
  html='<rect class="se-table-head" x="89" y="0" width="874" height="54"/><g class="v2-circuit-heading">'+text('Component',113,34,'start')+text('Symbol',700,34)+'</g>';
  names.forEach((n,i)=>{const y=54+i*78;html+=text(n,113,y+45,'start')+marks[i](700,y+39+(i===3?8:0))+`<line class="v2-table-rule" x1="89" x2="963" y1="${y+78}" y2="${y+78}"/>`;});
  h=54+8*78;html+=`<rect class="v2-table-frame" x="89" y="0" width="874" height="${h}"/><line class="v2-table-rule" x1="580" x2="580" y1="0" y2="${h}"/>`;h+=12;
 }
 else if(key==='arrangements'){
  // Maps preserve all six source topologies without pretending to be apparatus photos.
  const wires=[['M45 62H170V102H190','M45 162H320V102H270'],['M45 62H170V102H190','M45 162H100M135 162H320V102H270'],['M45 62H100M135 62H170V102H190','M45 162H320V102H270'],['M45 62H130V102H190M130 62H320V102H270','M45 162H100'],['M45 162H130V102H190M130 162H320V102H270','M45 62H100'],['M45 62H320V102H270','M45 162H170V102H190']];
  for(let i=0;i<6;i++){
   let a=text(String(i+1),10,25,'start')+text('P',45,48)+text('N',45,195)+text('X',190,83)+text('Y',270,83);
   a+=path(wires[i].join(' '))+dot(45,62)+dot(45,162)+dot(190,102)+dot(270,102);
   // Show the internal route without colour or glow that would reveal a result.
   a+=lamp(230,102)+`<g transform="translate(45 112) rotate(90)">${cell(0,0)}</g>`+path('M45 62V72M45 152V162');
   a+=text('cell',103,120)+text('lamp',230,205);
   html+=group(a,110+(i%2)*437,Math.floor(i/2)*225);
  }h=680;
 }
 else if(key==='led'){
  html=group(loop({diode:true}),340,12)+text('Resistor',316,112,'end')+text('Anode',480,34,'end')+text('Cathode',560,34,'start')+text('+',478,207)+text('−',558,207)+text('Two-cell supply',518,240);h=265;
 }
 else if(key==='examples'){
  html=group(loop({open:true}),120,18)+group(loop({diode:true}),570,18)+text('Lamp and open switch',300,240)+text('LED and resistor',750,240);h=263;
 }
 else if(key==='two-lamps'){html=group(loop({two:true}),340,10);h=210;}
 else if(key==='tester'){html=group(loop({tester:true}),320,10);h=208;}
 else if(key==='two-switches'){
  html=path('M275 60H305M385 60H465M545 60H625M705 60H755V200H610M530 200H425M345 200H275V60')+lamp(345,60)+sw(505,60,false)+lamp(665,60)+cell(570,200,{battery:true})+sw(385,200,false)+text('L1',345,25)+text('S2',505,25)+text('L2',665,25)+text('S1',385,244);h=266;
 }
 else if(key==='four-circuits'){
  for(let i=0;i<4;i++){html+=group(loop({diode:i>1,reverse:i===0||i===2,open:true}),120+(i%2)*450,Math.floor(i/2)*245+25)+text(String.fromCharCode(65+i),300+(i%2)*450,Math.floor(i/2)*245+245);}h=510;
 }
 else if(key==='opposed-cells'){
  // Both cells have positive terminals on the right, joined negatives on left.
  html=path('M270 60H410M490 60H570M650 60H680V95M270 200H410M490 200H680V175M270 60V200')+cell(450,60,{reverse:true})+cell(450,200,{reverse:true})+resistor(610,60)+`<g transform="translate(680 135) rotate(90)">${led(0,0)}</g>`;
  html+=text('−',410,34)+text('+',490,34)+text('−',410,240)+text('+',490,240)+text('Identical cells',450,285);h=305;
 } else throw Error('Unknown circuit diagram '+key);
 return {html:`<g class="v2-circuit" data-diagram="${key}">${html}</g>`,h};
}
