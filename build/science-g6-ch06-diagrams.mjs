// Live labels and measured container geometry supplement the painted objects.
const text=(s,x,y,anchor='middle')=>`<text class="v2-material-label" x="${x}" y="${y}" text-anchor="${anchor}">${s}</text>`;
const path=(d,c='v2-material-line')=>`<path class="${c}" d="${d}"/>`;
const line=(x1,y1,x2,y2)=>`<line class="v2-material-line" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
function vessel(cx,y,{water=0,milk=false}={}){
 const w=156,h=210,level=y+h-water*h;
 let out=path(`M${cx-w/2} ${y}V${y+h}Q${cx} ${y+h+24} ${cx+w/2} ${y+h}V${y}`,'v2-material-glass');
 if(water)out+=path(`M${cx-w/2+3} ${level}H${cx+w/2-3}V${y+h-3}Q${cx} ${y+h+19} ${cx-w/2+3} ${y+h-3}Z`,milk?'v2-material-milk':'v2-material-water')+`<ellipse class="${milk?'v2-material-milk':'v2-material-water'}" cx="${cx}" cy="${level}" rx="75" ry="11"/>`;
 out+=`<ellipse class="v2-material-rim" cx="${cx}" cy="${y}" rx="78" ry="12"/>`;
 return out;
}
export function materialDiagram(key){let html='',h=0;
 if(key==='oil-water'){
  h=305;const cx=468,y=35;html=vessel(cx,y,{water:.56});
  html+=path('M393 69H543V127Q468 150 393 127Z','v2-material-oil')+`<ellipse class="v2-material-oil" cx="468" cy="69" rx="75" ry="11"/>`;
  html+=line(548,93,619,93)+text('Oil layer',638,101,'start')+line(548,179,619,179)+text('Water layer',638,187,'start')+text('After standing',468,294);
 }else if(key==='volume'){
  h=305;html=vessel(322,30,{water:.45})+vessel(730,30,{water:.85})+text('Smaller water volume',322,289)+text('Larger water volume',730,289);
 }else if(key==='bottles'){
  h=320;
  for(const [cx,milk] of [[333,false],[719,true]]){
   html+=path(`M${cx-38} 21H${cx+38}V58L${cx+77} 98V255Q${cx} 275 ${cx-77} 255V98L${cx-38} 58Z`,'v2-material-glass');
   html+=path(`M${cx-74} 126H${cx+74}V252Q${cx} 268 ${cx-74} 252Z`,milk?'v2-material-milk':'v2-material-water');
   html+=path(`M${cx-39} 11H${cx+39}V29H${cx-39}Z`,'v2-material-cap')+text(milk?'Milk':'Water',cx,187)+text('500 mL',cx,222);
  }
  html+=text('Volume of contents',526,310);
 }else if(key==='air-space'){
  h=335;
  html=path('M240 86V269Q526 293 812 269V86','v2-material-glass')+path('M245 132H807V264Q526 286 245 264Z','v2-material-water');
  // Inverted cup open at the bottom; trapped gas and water shown separately.
  html+=path('M424 231V46Q526 24 628 46V231','v2-material-glass')+path('M428 224V50Q526 30 624 50V224Z','v2-material-air');
  html+=line(628,72,704,41)+text('Inverted cup',713,38,'start')+text('Trapped air',526,114)+line(629,199,704,221)+text('Water',717,230,'start')+text('Opening faces down',526,324)+line(526,298,526,236);
 }else throw Error('Unknown materials diagram '+key);
 return {html:`<g class="v2-material-diagram" data-diagram="${key}">${html}</g>`,h};
}
