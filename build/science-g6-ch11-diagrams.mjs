// Quantitative and classification figures retain selectable, sharp vector labels.
export const airParts={nitrogen:78,oxygen:21,other:1};
const text=(s,x,y,anchor='start')=>`<text class="v2-light-label" x="${x}" y="${y}" text-anchor="${anchor}">${s}</text>`;
export function chapterDiagram(name){
 if(name==='air'){
  let html='';for(let i=0;i<100;i++)html+=`<rect class="ch11-air ch11-air--${i<78?'nitrogen':i<99?'oxygen':'other'}" data-air="${i<78?'nitrogen':i<99?'oxygen':'other'}" x="${150+i%10*27}" y="${Math.floor(i/10)*27}" width="24" height="24"/>`;
  html+=text('Dry air: about 100 parts',487,43)+text('Nitrogen: 78 parts',487,104)+text('Oxygen: 21 parts',487,159)+text('Other gases: 1 part',487,214);
  for(const [i,k] of ['nitrogen','oxygen','other'].entries())html+=`<rect class="ch11-air ch11-air--${k}" x="447" y="${85+i*55}" width="24" height="24"/>`;
  return {html,h:275};
 }
 if(name==='resources'){
  const box=(s,x,y,w)=>`<rect class="v2-light-screen" x="${x}" y="${y}" width="${w}" height="54" rx="12"/>`+text(s,x+w/2,y+35,'middle');
  const line=(x,y,xx,yy)=>`<path class="v2-light-line" d="M${x} ${y}V${(y+yy)/2}H${xx}V${yy}"/>`;
  let html=line(526,54,301,96)+line(526,54,749,96);
  html+=line(301,150,301,205)+line(749,150,627,205)+line(749,150,749,205)+line(749,150,871,205);
  html+=line(301,259,177,322)+line(301,259,301,322)+line(301,259,425,322);
  html+=box('Natural resources',396,0,260)+box('A',171,96,260)+box('Renewable resources',607,96,284);
  html+=box('B',216,205,170)+box('C',575,205,104)+box('D',697,205,104)+box('E',819,205,104);
  html+=box('F',125,322,104)+box('Natural gas',237,322,128)+box('G',373,322,104);
  html+=text('Selected examples only',642,352);
  return {html,h:388};
 }
 throw Error('Unknown Chapter 11 diagram '+name);
}
