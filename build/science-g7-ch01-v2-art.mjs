// Instructional vector art; all lettering is live and all inks are scoped CSS.
export const planeMotif=(small=false)=>small
 ? '<g class="v2-plane-motif"><path d="M30 20L77 8L58 45L51 30ZM51 30L77 8M43 27L41 39L51 30"/><path class="v2-plane-trail" d="M33 41Q15 49 9 35"/></g>'
 : '<g class="chapter-opener__motif v2-plane-motif"><path d="M914 112L1030 75L993 179L970 137ZM970 137L1030 75M947 130L947 167L970 137"/><path class="v2-plane-trail" d="M944 180C923 181 915 205 938 215S985 226 974 249"/></g>';

export const artWords='A · flat tips B · tips folded up Fold both tips equally Same paper and basic folds Before launching Sunlight Evaporation Condensation Rain Water vapour Cloud droplets Liquid water Surface water Water enters the air Cooling forms droplets Some water soaks into the ground';

export function setupDiagram(y,label){
 const plane=(x,folded)=>`<svg class="science-illustration" x="${x-82}" y="${y+2}" width="164" height="140" viewBox="${folded?'300 20 940 960':'0 0 1312 1199'}" preserveAspectRatio="xMidYMid meet"><image href="../../figures/class-7/science/ch01-v2/apparatus-plane-${folded?'folded':'flat'}.png" width="${folded?1536:1312}" height="${folded?1024:1199}"/></svg>`;
 return {html:plane(310,false)+plane(738,true)+label('A · flat tips',310,y+164,'se-caption','middle')+label('B · tips folded up',738,y+164,'se-caption','middle')+label('Same paper and basic folds',524,y+202,'se-caption','middle'),h:224};
}

export function waterDiagram(label){
 const arrow=(x,y)=>`<path class="v2-diagram-stroke" d="M${x} ${y}h35m-7-6 7 6-7 6"/>`;
 let html='';
 const stages=[['Evaporation','Liquid water','Water vapour'],['Condensation','Water vapour','Cloud droplets'],['Rain','Cloud droplets','Surface water']];
 stages.forEach(([title,a,b],i)=>{const x=89+i*302;html+=`<rect class="v2-diagram-light" x="${x}" y="34" width="270" height="176" rx="14"/>`+label(title,x+135,68,'v2-small-head','middle')+label(a,x+135,118,'se-caption','middle')+`<path class="v2-diagram-stroke" d="M${x+135} 128v24m-5-6 5 6 5-6"/>`+label(b,x+135,182,'se-caption','middle');if(i<2)html+=arrow(x+271,124);});
 html+=label('Sunlight',224,23,'se-caption','middle')+label('Cooling forms droplets',526,23,'se-caption','middle');
 html+='<path class="v2-diagram-return" d="M829 215V235Q829 248 812 248H240Q224 248 224 231V215"/>';
 html+=label('Some water soaks into the ground',526,282,'se-caption','middle');
 return {html,h:301};
}
