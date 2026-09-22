// Painted physical apparatus with native SVG scales and live instructional labels.
// Viewports crop only unused transparent margins or select an instrument from a pair.
const art=(key,x,y,w,h,view='0 0 1536 1024')=>`<svg class="science-illustration" x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${view}" preserveAspectRatio="xMidYMid meet"><image href="../../figures/class-7/science/ch08/apparatus-${key}.png" width="1536" height="1024"/></svg>`;
const E=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
const t=(s,x,y,a='middle')=>`<text class="v2-motion-label" x="${x}" y="${y}" text-anchor="${a}">${E(s)}</text>`;
const line=d=>`<path class="v2-motion-line" d="${d}"/>`;
const dot=(x,y,r=6)=>`<circle class="v2-motion-grain" cx="${x}" cy="${y}" r="${r}"/>`;
const arrow=(x,y,xx,yy)=>{const a=Math.atan2(yy-y,xx-x),l=10;return line(`M${x} ${y}L${xx} ${yy}M${xx-l*Math.cos(a-.5)} ${yy-l*Math.sin(a-.5)}L${xx} ${yy}L${xx-l*Math.cos(a+.5)} ${yy-l*Math.sin(a+.5)}`);};
function grid(rows){const first=154,w=(874-first)/(rows[0].length-1),top=10,rh=56;let html='';rows.forEach((row,i)=>{let x=89;row.forEach((s,j)=>{const cw=j?w:first;html+=`<rect class="${j?'v2-motion-soft':'v2-motion-water'}" x="${x}" y="${top+i*rh}" width="${cw}" height="${rh}"/>`+t(s,x+cw/2,top+i*rh+36);x+=cw;});});return {h:top+rows.length*rh,html};}
export const questionSeven=[['Time (s)','0','10','20','30','?','50','?','70'],['Distance (m)','0','8','?','24','32','40','?','56']];
export const questionTen=[['Time (s)','0','10','20','30','40','50','60','70','80','90','100'],['Distance (m)','0','6','10','16','21','29','35','42','45','55','60']];
export function motionDiagram(key){let html='',h=270;
 if(key==='water-clock'){
  h=284;
  html=art('water-clock',409,0,224,284,'370 0 800 1015')+t('Same starting level',252,59)+line('M374 56L465 63')+t('Covered cut edges',756,58)+line('M641 56L580 20')+t('Hole in cap',734,185)+line('M661 182L525 165')+t('Collecting vessel',755,254)+line('M654 248L579 225');
 }
 else if(key==='pendulum'){
  h=316;html=art('pendulum',286,0,474,316);
  for(const [x,y,name] of [[449,311,'A'],[523,311,'O'],[596,311,'B']])html+=t(name,x,y);
  html+=t('Pivot',397,32)+line('M435 29L518 38')+line('M650 39V275M642 39H658M642 275H658')+t('Length: pivot',704,123,'start')+t('to bob centre',704,153,'start')+line('M689 140H656')+t('Thread',330,137)+line('M378 134L485 139')+t('Bob',340,260)+line('M377 257L435 260');
 }
 else if(key==='pendulum-setup'){
  h=255;html=art('pendulum-setup',300,0,382.5,255)+t('Firm clamp',291,36)+line('M357 31L445 36')+t('Small displacement',749,112)+line('M646 109L535 109')+t('Clear swing space',730,219)+line('M623 215L552 182');
 }
 else if(key==='clock-face'){
  h=310;const cx=345,cy=151;
  html=art('clock-housing',197,3,296,300,'270 0 995 1010');
  for(let i=0;i<60;i++){const a=i*Math.PI/30-Math.PI/2,r1=i%5?119:111;html+=line(`M${cx+r1*Math.cos(a)} ${cy+r1*Math.sin(a)}L${cx+125*Math.cos(a)} ${cy+125*Math.sin(a)}`);}
  for(let i=1;i<=12;i++){const a=i*Math.PI/6-Math.PI/2;html+=t(i,cx+91*Math.cos(a),cy+91*Math.sin(a)+8);}
  html+=`<path class="v2-motion-hour" d="M345 151L315 102"/><path class="v2-motion-minute" d="M345 151L419 108"/><path class="v2-motion-second" d="M345 166V35"/>`+dot(345,151,5);
  html+=t('Hand key',666,69)+`<path class="v2-motion-hour" d="M560 111H610"/><path class="v2-motion-minute" d="M560 160H610"/><path class="v2-motion-second" d="M560 209H610"/>`+t('Hour · short, thick',639,119,'start')+t('Minute · long',639,168,'start')+t('Second · thin, teal',639,217,'start');
 }
 else if(key==='train-stages'){
  h=159;const xs=[135,390,650,917];html=line('M135 93H917');for(let i=0;i<4;i++)html+=dot(xs[i],93,5)+t('ABCD'[i],xs[i],134);html+=t('Speeds up',260,45)+t('Steady speed',522,45)+t('Slows to stop',790,45)+arrow(180,75,339,75)+arrow(434,75,599,75)+arrow(694,75,865,75);
 }
 else if(key==='instruments'){
  h=237;html=art('instrument-housing',217,-8,234,228,'0 100 780 760');
  for(let n=0;n<=120;n+=20){const a=(-180+n*1.5)*Math.PI/180;html+=line(`M${333+70*Math.cos(a)} ${106+70*Math.sin(a)}L${333+80*Math.cos(a)} ${106+80*Math.sin(a)}`)+t(n,333+55*Math.cos(a),106+55*Math.sin(a)+7);}
  html+=arrow(333,106,310,67)+dot(333,106,4)+t('km/h',333,155)+t('Speedometer',333,232)+art('instrument-housing',584,38,296.4,150,'795 315 741 375')+t('012345 km',732,127)+t('Odometer',732,218);
 }
 else if(key==='question-seven'){({html,h}=grid(questionSeven));}
 else if(key==='question-ten'){({html,h}=grid(questionTen));}
 else if(key==='bowl-clock'){
  h=221;html=art('bowl-clock',331,30,390,189,'60 190 1415 690')+t('Small hole',795,87)+line('M730 84L527 138')+t('Floating bowl',526,23)+line('M526 28V54')+t('Water',244,113)+line('M287 108L375 111');
 }
 else throw Error('Unknown diagram '+key);
 const painted=['water-clock','pendulum','pendulum-setup','clock-face','instruments','bowl-clock'].includes(key);
 return {h,html:painted?`<svg class="science-illustration v2-motion-diagram" data-diagram="${key}" x="89" y="0" width="874" height="${h}" viewBox="89 0 874 ${h}">${html}</svg>`:`<g class="v2-motion-diagram" data-diagram="${key}">${html}</g>`};
}
