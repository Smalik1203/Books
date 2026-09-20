// Opt-in opener for the 1052-unit editorial page grid. Colours and faces are
// supplied by the edition; no chapter-specific title or palette lives here.
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export function botanicalMotif(shift=0,namespace='chapter-opener') {
 // Alternating lanceolate leaves grow from a single continuous curved stem.
 // Each attachment is evaluated on that curve, so no leaf floats beside it.
 const point=t=>{
  const u=1-t;
  return [u*u*u*1005+3*u*u*t*930+3*u*t*t*932+t*t*t*1018,
   u*u*u*35+3*u*u*t*117+3*u*t*t*200+t*t*t*275];
 };
 const xy=p=>p.map(n=>+n.toFixed(2)).join(' ');
 const leaves=[],veins=[];
 for(const [t,tip,halfWidth] of [
  [.05,[1024,20],10], [.14,[1041,46],14], [.25,[912,52],18],
  [.36,[1040,97],19], [.46,[885,112],21], [.57,[1034,156],20],
  [.68,[899,180],19], [.79,[1042,218],17], [.88,[937,230],14],
 ]){
  const base=point(t),v=[tip[0]-base[0],tip[1]-base[1]],length=Math.hypot(...v);
  const normal=[-v[1]/length,v[0]/length];
  const at=(along,across)=>base.map((n,i)=>n+v[i]*along+normal[i]*halfWidth*across);
  leaves.push(`M${xy(base)}C${xy(at(.16,.92))} ${xy(at(.67,1))} ${xy(tip)}C${xy(at(.69,-.45))} ${xy(at(.24,-.7))} ${xy(base)}Z`);
  veins.push(`M${xy(at(.06,0))}Q${xy(at(.43,.14))} ${xy(at(.89,.05))}`);
 }
 return `<g class="${namespace}__motif" transform="translate(0 ${shift})" aria-hidden="true"><path class="${namespace}__stem" d="M1005 35C930 117 932 200 1018 275"/><path class="${namespace}__leaves" d="${leaves.join(' ')}"/><path class="${namespace}__veins" d="${veins.join(' ')}"/></g>`;
}
export function chapterOpener({id,number,titleLines,bleed=0,motif='none',image}) {
 if(!/^[a-z][a-z0-9-]*$/.test(id))throw Error('Opener needs a unique, safe ID');
 if(!/^\d{1,2}$/.test(String(number)))throw Error('Opener supports one- or two-digit chapter numbers');
 if(!Array.isArray(titleLines)||titleLines.length<1||titleLines.length>3||titleLines.some(s=>!String(s).trim()))throw Error('Supply one to three complete title lines');
 if(!['none','leaf'].includes(motif))throw Error('Unknown opener motif');
 if(!image?.href||!(image.aspect>0))throw Error('Supply illustration path and natural aspect ratio');
 const extra=Math.max(0,titleLines.length-2)*86,height=300+extra,shift=extra/2;
 const double=String(number).length===2,numberY=242+shift-(double?20:0),labelY=80+shift;
 const firstTitle=titleLines.length===1?199:156;
 const gradient=`${id}-gradient`,titleX=284;
 const title=(s,x,y,cls,anchor='start')=>`<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${escape(s)}</text>`;
 const decoration=motif==='leaf'?botanicalMotif(shift):'';
 const imageBox={x:89,y:height+36,width:874,height:874/image.aspect};
 const bodyTop=Math.ceil(imageBox.y+imageBox.height+36);
 return {bodyTop,layout:{height,numberY,labelY,titleX,titleRight:motif==='none'?963:844,imageBox},html:
  `<g class="chapter-opener" data-opener="${id}"><defs><linearGradient id="${gradient}" x1="0%" y1="0%" x2="100%" y2="100%"><stop class="chapter-opener__gradient-start" offset="0%"/><stop class="chapter-opener__gradient-end" offset="100%"/></linearGradient></defs>`
  +`<path class="chapter-opener__band" fill="url(#${gradient})" d="M${-bleed} ${-bleed}H${1052+bleed}V${height}H${-bleed}Z"/>`
  +`<path class="chapter-opener__edge" d="M${-bleed} ${height-4}H${1052+bleed}V${height}H${-bleed}Z"/>`
  +`<line class="chapter-opener__divider" x1="240" x2="240" y1="${94+shift}" y2="${252+shift}"/>`
  +decoration+title('CHAPTER',151,labelY,'chapter-opener__label se-running','middle')
  +title(number,151,numberY,`chapter-opener__number${double?' chapter-opener__number--double':''} se-running`,'middle')
  +titleLines.map((s,i)=>title(s,titleX,firstTitle+i*86,'chapter-opener__title')).join('')
  +`<image class="science-illustration chapter-opener__image" href="${escape(image.href)}" x="${imageBox.x}" y="${imageBox.y}" width="${imageBox.width}" height="${imageBox.height}" preserveAspectRatio="xMidYMid meet"><title>${escape(image.alt||'Chapter illustration')}</title></image></g>`};
}
