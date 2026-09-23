// Concept maps are live vector diagrams, with full-size labels and explicit edges.
const text=(s,x,y,c='v2-water-label')=>`<text class="${c}" x="${x}" y="${y}" text-anchor="middle">${s}</text>`;
export const stateEdges=[
 {from:'solid',to:'liquid',label:'Melting',answer:'melting',energy:'gain'},
 {from:'liquid',to:'solid',label:'1',answer:'freezing',energy:'release'},
 {from:'liquid',to:'gas',label:'2',answer:'evaporation',energy:'gain'},
 {from:'gas',to:'liquid',label:'3',answer:'condensation',energy:'release'}
];
const arrow=(x1,y,x2)=>{const s=x2>x1?1:-1;return `<path class="v2-water-arrow" d="M${x1} ${y}H${x2}M${x2-s*11} ${y-7}L${x2} ${y}L${x2-s*11} ${y+7}"/>`;};
export function waterDiagram(key){let html='',h=0;
 if(key==='state-map'){
  h=252;
  for(const [i,label] of ['Solid','A','B'].entries()){const x=230+i*296;html+=`<rect class="v2-water-card" x="${x-79}" y="86" width="158" height="76" rx="14"/>`+text(label,x,133);}
  for(const [i,e] of stateEdges.entries()){const right=i%2===0,pair=i<2?0:1,x1=317+pair*296,x2=439+pair*296,y=right?96:151;html+=arrow(right?x1:x2,y,right?x2:x1)+text(e.label,(x1+x2)/2,right?62:199);}
  html+=text('Use each word once in your notebook.',526,243);
 }else if(key==='game'){
  h=220;
  const data=[['Lake','Name a change','that takes water','into the air.'],['Cloud','Name one way','water can return','to the surface.'],['Groundwater','Describe a store','where water may','remain for a while.']];
  data.forEach((row,i)=>{const x=119+i*278;html+=`<rect class="v2-water-card" x="${x}" y="12" width="256" height="192" rx="14"/>`;row.forEach((s,j)=>{html+=text(s,x+128,j?77+j*30:52,j?'v2-water-label':'v2-water-card-title');});});
 }else throw Error('Unknown water diagram '+key);
 return {html:`<g class="v2-water-diagram" data-diagram="${key}">${html}</g>`,h};
}
