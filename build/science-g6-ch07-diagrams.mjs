// Numerically constructed scales: ticks and liquid levels share one mapping.
const text=(s,x,y,anchor='middle')=>`<text class="v2-temperature-label" x="${x}" y="${y}" text-anchor="${anchor}">${s}</text>`;
const path=(d,c='v2-temperature-line')=>`<path class="${c}" d="${d}"/>`;
const line=(x1,y1,x2,y2,c='v2-temperature-line')=>path(`M${x1} ${y1}L${x2} ${y2}`,c);
export function scaleGeometry(min,max,step,value,length){
 const count=Math.round((max-min)/step);
 if(Math.abs(count*step-(max-min))>1e-8)throw Error('Non-integral scale');
 return {ticks:Array.from({length:count+1},(_,i)=>({value:min+i*step,position:length*i/count})),level:value==null?null:length*(value-min)/(max-min)};
}
function vertical(cx,y,{min=0,max=20,step=1,value=null,height=270,labelEvery=5,labels=true}={}){
 const g=scaleGeometry(min,max,step,value,height),bottom=y+height;
 let out=path(`M${cx-17} ${bottom+9}V${y-14}Q${cx-17} ${y-32} ${cx} ${y-32}Q${cx+17} ${y-32} ${cx+17} ${y-14}V${bottom+9}A28 28 0 1 1 ${cx-17} ${bottom+9}Z`,'v2-temperature-glass');
 out+=line(cx,y-9,cx,bottom+27,'v2-temperature-capillary');
 if(value!=null)out+=line(cx,bottom-g.level,cx,bottom+27,'v2-temperature-liquid');
 out+=`<circle class="v2-temperature-bulb" cx="${cx}" cy="${bottom+31}" r="17"/>`;
 for(const t of g.ticks){const yy=bottom-t.position,major=Math.abs(t.value/labelEvery-Math.round(t.value/labelEvery))<1e-8;out+=line(cx+20,yy,cx+(major?42:32),yy);if(labels&&major)out+=text(t.value,cx+52,yy+8,'start');}
 return out;
}
function horizontal(min,max,step,value,{x=176,y=80,width=700,labelEvery=5}={}){
 const g=scaleGeometry(min,max,step,value,width);
 let out=`<rect class="v2-temperature-glass" x="${x-31}" y="${y-21}" width="${width+58}" height="42" rx="20"/>`+line(x,y,x+width,y,'v2-temperature-capillary');
 if(value!=null)out+=line(x,y,x+g.level,y,'v2-temperature-liquid');
 out+=`<circle class="v2-temperature-bulb" cx="${x-13}" cy="${y}" r="13"/>`;
 for(const t of g.ticks){const xx=x+t.position,major=Math.abs(t.value/labelEvery-Math.round(t.value/labelEvery))<1e-8;out+=line(xx,y-23,xx,y-(major?44:34));if(major)out+=text(t.value,xx,y-55);}
 return out;
}
function beaker(cx,y,w=164,h=165){return path(`M${cx-w/2} ${y}V${y+h}Q${cx} ${y+h+17} ${cx+w/2} ${y+h}V${y}`,'v2-temperature-glass')+path(`M${cx-w/2+4} ${y+43}H${cx+w/2-4}V${y+h-4}Q${cx} ${y+h+10} ${cx-w/2+4} ${y+h-4}Z`,'v2-temperature-water')+`<ellipse class="v2-temperature-line" cx="${cx}" cy="${y}" rx="${w/2}" ry="9"/>`;}
function probe(cx,top,length=245){return path(`M${cx-6} ${top+length-16}V${top}Q${cx} ${top-12} ${cx+6} ${top}V${top+length-16}A10 10 0 1 1 ${cx-6} ${top+length-16}Z`,'v2-temperature-glass')+line(cx,top+length*.33,cx,top+length-9,'v2-temperature-liquid')+`<circle class="v2-temperature-bulb" cx="${cx}" cy="${top+length-9}" r="5"/>`+Array.from({length:10},(_,i)=>line(cx+7,top+16+i*12,cx+14,top+16+i*12)).join('');}
export function temperatureDiagram(key){let html='',h;
 if(key==='structure'){
  h=435;html=vertical(380,53,{min:10,max:30,step:1,value:24,height:280})+text('°C',446,26)+line(398,33,573,33)+text('Glass stem',588,41,'start')+line(381,137,573,137)+text('Liquid column',588,145,'start')+line(423,263,573,263)+text('Scale',588,271,'start')+line(409,364,573,364)+text('Bulb',588,372,'start')+text('Narrow tube inside the stem',526,425);
 }else if(key==='division'){
  h=165;html=horizontal(20,30,1,null,{y:90,labelEvery:5})+text('20 °C to 30 °C: ten equal intervals',526,153);
 }else if(key==='water'){
  h=385;html=beaker(421,142,220,192)+probe(421,30,277)+line(437,122,636,122,'v2-temperature-dashed')+path('M639 122Q664 101 689 122Q664 143 639 122Z')+`<circle class="v2-temperature-bulb" cx="664" cy="122" r="7"/>`+text('Eye level',716,130,'start')+line(434,294,624,268)+text('Bulb in water',642,276,'start')+text('Clear of sides and bottom',526,380);
 }else if(key==='positions'){
  h=338;for(let i=0;i<4;i++){const cx=210+i*208;html+=beaker(cx,126,148,166);let p;if(i===0)p=`<g transform="rotate(19 ${cx} 275)">${probe(cx,33,250)}</g>`;if(i===1)p=probe(cx,20,250);if(i===2)p=probe(cx,42,259);if(i===3)p=probe(cx+64,20,250);html+=p+text('Student '+(i+1),cx,330);}
 }else if(key==='blank-scales'){
  // Horizontal scale details give equal, generous tick spacing without
  // repeating the long glass bodies; the learner supplies each column.
  h=300;for(let i=0;i<3;i++){html+=horizontal(0,i===2?10:20,i===2?.5:1,null,{x:240,y:77+i*100,width:590,labelEvery:i===2?2:5})+text(['(a)','(b)','(c)'][i],156,84+i*100)+text('°C',903,84+i*100);}
 }else if(key==='read28'){
  h=138;html=horizontal(-10,40,1,28,{y:95,labelEvery:10});
 }else if(key==='scale-choice'){
  h=405;[270,526,782].forEach((cx,i)=>{html+=vertical(cx,64,{min:20,max:30,step:[1,.5,2][i],height:250,labelEvery:i===2?10:5})+text(['(a)','(b)','(c)'][i],cx,29)+text('°C',cx+75,29);});
 }else if(key==='read275'){
  h=138;html=horizontal(25,30,.5,27.5,{y:95,labelEvery:1});
 }else if(key==='room-water'){
  h=365;html=probe(294,38,260)+beaker(697,136,208,178)+probe(697,30,270)+text('Room air',294,356)+text('Water',697,356);
 }else throw Error('Unknown temperature diagram '+key);
 return {html:`<g class="v2-temperature-diagram" data-diagram="${key}">${html}</g>`,h};
}
