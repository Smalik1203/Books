import fs from 'node:fs';
export const catalogue=JSON.parse(fs.readFileSync('assets/design-history/science-g6-ch12/star-coordinates.json','utf8'));
const byHR=new Map(catalogue.stars.map(s=>[s.hr,s]));
export const dipperStars=[424,6789,6322,5903,6116,5735,5563,4301,4295,4554,4660,4905,5054,5191];
export const winterStars=[1165,1457,1791,1910,1543,1713,1790,1852,1879,1903,1948,2004,2061,2491];
const txt=(s,x,y,anchor='start')=>`<text class="v2-light-label" x="${x}" y="${y}" text-anchor="${anchor}">${s}</text>`;
const stroke=(d,c='ch12-star-guide')=>`<path class="${c}" d="${d}"/>`;
export function starPositions(kind){
 const ids=kind==='dippers'?dipperStars:winterStars;
 const raw=ids.map(hr=>{
  const s=byHR.get(hr);if(!s)throw Error('Missing catalogue star '+hr);
  // North-polar azimuthal projection, or a small-region sky chart.
  // Both preserve positions rather than copying an arbitrary dot pattern.
  const a=s.raHours*Math.PI/12,r=90-s.decDegrees;
  return {hr,...s,x:kind==='dippers'?-r*Math.sin(a):-s.raHours*15*Math.cos(6*Math.PI/180),y:kind==='dippers'?-r*Math.cos(a):-s.decDegrees};
 });
 const xs=raw.map(s=>s.x),ys=raw.map(s=>s.y),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
 const scale=Math.min(465/(maxX-minX),330/(maxY-minY));
 return raw.map(s=>({...s,x:380+(s.x-(minX+maxX)/2)*scale,y:190+(s.y-(minY+maxY)/2)*scale}));
}
export function chapterDiagram(key){
 let html='',h=0;
 if(key==='pattern'){
  const points=[[220,45],[330,85],[460,40],[620,75],[805,45],[255,165],[420,150],[550,185],[730,150],[850,215]];
  html=points.map(([x,y],i)=>`<circle class="ch12-star" cx="${x}" cy="${y}" r="${i%3+3}"/>`).join('');h=235;
 }else if(key.startsWith('dippers')||key.startsWith('winter')){
  const kind=key.startsWith('dippers')?'dippers':'winter',question=key.endsWith('question'),stars=starPositions(kind),map=new Map(stars.map(s=>[s.hr,s]));
  const chain=ids=>stroke(ids.map((id,i)=>{const s=map.get(id);return (i?'L':'M')+s.x+' '+s.y;}).join(''));
  if(!question){
   if(kind==='dippers'){
    html+=chain([424,6789,6322,5903,5563,5735,6116,5903])+chain([5191,5054,4905,4660,4554,4295,4301,4660]);
    const a=map.get(4295),b=map.get(4301),p=map.get(424);
    html+=stroke(`M${a.x} ${a.y}L${b.x} ${b.y}L${p.x} ${p.y}`,'ch12-star-pointer');
   }else{
    html+=chain([2061,1879,1790,1852,1713,2004,1948,2061])+chain([1852,1903,1948]);
    const a=map.get(1948),b=map.get(2491);html+=stroke(`M${a.x} ${a.y}L${b.x} ${b.y}`,'ch12-star-pointer');
   }
  }
  html+=stars.map(s=>`<circle class="ch12-star" data-star-hr="${s.hr}" cx="${s.x}" cy="${s.y}" r="${Math.max(3,6-s.magnitude*.65)}"/>`).join('');
  if(!question){
   const legends=kind==='dippers'?[[424,'Polaris'],[4301,'Dubhe'],[4295,'Merak']]:[[2061,'Betelgeuse'],[1713,'Rigel'],[2491,'Sirius'],[1457,'Aldebaran'],[1165,'Alcyone']];
   legends.forEach(([hr,name],i)=>{const s=map.get(hr);html+=txt(String(i+1),s.x+12,s.y-10)+txt((i+1)+' · '+name,686,58+i*45);});
   if(kind==='dippers')html+=txt('Long handle: Big Dipper',686,235)+txt('Polaris ends the',686,280)+txt('Little Dipper’s handle.',686,309);
   else html+=txt('Alcyone belongs to',686,286)+txt('the Pleiades cluster.',686,315)+txt('Orion’s belt: three',686,367)+txt('close, aligned stars.',686,396);
  }else html+=txt('Selected stars only',686,190)+txt('Copy into your notebook.',686,222);
  h=kind==='winter'?415:380;
 }else if(key==='membership'){
  const groups=[['Earth',112,140],['Solar System',313,182],['Milky Way',546,190],['Universe',787,150]];
  for(let i=0;i<groups.length;i++){
   const [s,x,w]=groups[i];html+=`<rect class="v2-light-screen" x="${x}" y="20" width="${w}" height="64" rx="12"/>`+txt(s,x+w/2,61,'middle');
   if(i<groups.length-1){const nx=groups[i+1][1],e=nx-10;html+=stroke(`M${x+w+8} 52H${e}M${e-9} 46L${e} 52L${e-9} 58`,'v2-light-line');}
  }
  html+=txt('Each arrow means “belongs within”.',526,135,'middle');h=155;
 }else throw Error('Unknown Chapter 12 diagram '+key);
 return {html:`<g data-diagram="${key}">${html}</g>`,h};
}
