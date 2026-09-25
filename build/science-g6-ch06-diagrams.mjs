// Painted containers with editable, independently positioned teaching labels.
const text=(s,x,y,anchor='middle')=>`<text class="v2-material-label" x="${x}" y="${y}" text-anchor="${anchor}">${s}</text>`;
const line=(x1,y1,x2,y2)=>`<line class="v2-material-line" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
const picture=(name,x,y,w,h)=>`<image class="science-illustration" href="../../figures/class-6/science/ch06/${name}-painted.png" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/>`;
export function materialDiagram(key){let html='',h=0;
 if(key==='oil-water'){
  h=410;html=picture('oil-water',204,0,558,372);
  html+=line(582,151,650,151)+text('Oil layer',669,159,'start')+line(582,230,650,230)+text('Water layer',669,238,'start')+text('After standing',483,402);
 }else if(key==='volume'){
  h=400;html=picture('volumes',114,0,824,360)+text('Smaller water volume',324,392)+text('Larger water volume',728,392);
 }else if(key==='bottles'){
  h=600;html=picture('bottles',95,0,862,575);
  html+=text('Water',365,307)+text('500 mL',365,341)+text('Milk',690,307)+text('500 mL',690,341)+text('Volume of contents',526,594);
 }else if(key==='air-space'){
  h=450;html=picture('air-cup',205,12,642,428);
  html+=line(601,77,729,29)+text('Inverted cup',737,27,'start')+text('Trapped air',526,238)+line(751,269,820,269)+text('Water',832,277,'start')+text('Opening faces down',526,446)+line(526,422,526,321);
 }else throw Error('Unknown materials diagram '+key);
 return {html:`<g class="v2-material-diagram" data-diagram="${key}">${html}</g>`,h};
}
