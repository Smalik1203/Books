// Set recovered Chapter 3 copy in the shared science type scale.
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
import {reviseFood} from './revise-science-food.mjs';
import {learningCue,featureIcon} from './science-learning-cues.mjs';
const run=promisify(execFile),dir='pages/class-6/ch03-food-on-our-plate';
const groups=await reviseFood(JSON.parse(await fs.readFile('assets/manuscripts/ch03-reading-groups.json','utf8')));
for(const g of groups)for(const im of (g.images||[])){const m=await sharp(path.resolve('build/class-6',im.href)).metadata();im.pixelW=m.width;im.pixelH=m.height;}
const E=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const terms=[...new Set(JSON.stringify(groups).split(/\s+/).concat(groups.flatMap(g=>[g.text||'',g.title||'',g.caption||'',g.figure?.caption||'',...(g.figure?.labels||[]),g.precautions||'',...(g.images||[]).flatMap(im=>[...(im.labelsTop||[]),...(im.labelsBottom||[])].map(v=>v[0])),...(g.labels||[]),...(g.items||[]),...(g.rows||[]).flat().map(c=>c.text)].join(' ').split(/\s+/)),[' ']))];
const probe=path.resolve('build/_food-types.html');
await fs.writeFile(probe,`<link rel="stylesheet" href="../css/fonts.css"><link rel="stylesheet" href="../css/reference-fonts.css"><script>onload=async()=>{await Promise.all(['500 23px Spectral','700 23px Spectral','700 28.06px Food Poppins','700 19.55px Food Poppins'].map(f=>document.fonts.load(f)));const c=document.createElement('canvas').getContext('2d'),m={};for(const [k,f] of [['b','500 23px Spectral'],['e','700 23px Spectral'],['h','700 28.06px Food Poppins'],['t','700 19.55px Food Poppins']]){c.font=f;m[k]={};for(const w of ${JSON.stringify(terms)})m[k][w]=c.measureText(w).width;}document.title='METRICS'+JSON.stringify(m);};</script>`);
const {stdout}=await run('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--virtual-time-budget=8000','--dump-dom',pathToFileURL(probe).href],{maxBuffer:20e6});await fs.unlink(probe);
const metrics=JSON.parse(stdout.match(/<title>METRICS(.*?)<\/title>/s)[1].replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>'));
function wrap(s,w=874,k='b',scale=1){const lines=[];let row=[],len=0;for(const word of s.split(/\s+/)){const size=(metrics[k][word]??word.length*12)*scale,space=metrics[k][' ']*scale;if(row.length&&len+space+size>w){lines.push(row.join(' '));row=[];len=0;}if(row.length)len+=space;row.push(word);len+=size;}if(row.length)lines.push(row.join(' '));return lines;}
function txt(ls,x,y,cls='se-copy',lead=31,size=23,measure=null){return `<text class="${cls}"${measure?` data-measure="${measure}"`:""} x="${x}" y="${y+size}">${ls.map((s,i)=>`<tspan x="${x}"${i?` dy="${lead}"`:''}>${E(s).replaceAll('**nutrient**','<tspan class="se-bold">nutrient</tspan>')}</tspan>`).join('')}</text>`;}
const atoms=[];function add(h,render,g){
 const band=g.caption?.match(/^(Table [\d.]+)\s*[—·:]\s*(.+)$/);
 const cap=g.caption?wrap(band?band[2]:g.caption,band?685:850,'b',.8):[],ch=cap.length?cap.length*25+(band?28:16):0;
 const before=g.kind==='table'||g.kind==='prompt';
 const caption=y=>band?`<rect class="se-table-band" x="89" y="${y}" width="874" height="${ch-12}" rx="3"/><rect class="se-table-number" x="89" y="${y}" width="149" height="${ch-12}" rx="3"/>`+txt([band[1]],105,y+8,'se-copy se-table-copy se-table-number-text',25,18.4)+txt(cap,254,y+8,'se-copy se-table-copy se-bold',25,18.4):txt(cap,89,y,'se-copy se-table-copy',25,18.4);
 atoms.push({h:h+ch,render:y=>(before&&ch?caption(y):'')+render(y+(before?ch:0))+(!before&&ch?caption(y+h-6):''),kind:g.kind,source:g.source,text:g.text||g.title||g.caption||''});
}
function pic(im,x,y,w,h){return `<image class="science-illustration" href="${E(im.href)}" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"><title>${E(im.title||'Science illustration')}</title></image>`;}
for(let gi=0;gi<groups.length;gi++){
 const g=groups[gi];
 if(g.kind==='text'||g.kind==='heading'||g.kind==='prompt'){
  const head=g.kind==='heading',panel=g.kind==='prompt',cue=panel?'observe':g.feature,offset=cue?56:0,ls=wrap(g.text,panel?826:874,head?'h':'b'),lead=head?38:31,size=head?28.06:23,h=ls.length*lead+offset+(panel?44:head?18:g.source===1?18:14);
  add(h,y=>(panel?`<rect class="se-prompt" x="89" y="${y}" width="874" height="${h-14}"/><line class="se-think-rule" x1="89" x2="963" y1="${y}" y2="${y}"/>`:'')+(cue?learningCue(cue,'',panel?113:89,y+8,E):'')+txt(ls,panel?113:89,y+offset+(panel?15:0),head?'se-heading':'se-copy',lead,size,head?null:panel?826:874),g);
 }else if(g.kind==='activity'){
  const title=g.title.replace(/\s*—\s*/g,' · '),titles=['Investigate'];
  const figure=g.figure,side=figure?.layout==='side',measure=side?516:818;
  let off=16+titles.length*28+20;
  const textTop=off;
  const safety=g.precautions?wrap(g.precautions,818,'b',.8):[];
  let safetyY=0;
  const items=g.items.map((s,index)=>{const match=s.match(/^(\d+)\.\s+(.*)/s),ls=wrap(match?match[2]:s,match?measure-38:measure),row={ls,y:off,num:match?.[1]};off+=ls.length*31+14;if(safety.length&&index===1){safetyY=off+4;off+=safety.length*25+20;}return row;});
  const caption=figure?.caption?wrap(figure.caption,side?270:818,'b',.8):[];
  const stageLabelHeight=figure?.labels?.length?32:0;
  const figureY=side?textTop+Math.max(0,(off-textTop-figure.height-caption.length*25)/2):off+8;
  if(figure)off=side?Math.max(off,figureY+figure.height+caption.length*25+16):off+figure.height+stageLabelHeight+caption.length*25+32;
  const h=off+14;
  add(h+22,y=>`<g aria-label="${E(title)}"><rect class="se-activity-panel" x="89" y="${y+14}" width="874" height="${h-8}" rx="18"/><rect class="se-activity-tab" x="89" y="${y}" width="${Math.min(874,Math.max(...titles.map(s=>s.split(' ').reduce((v,w)=>v+(metrics.t[w]??12*w.length)+metrics.t[' '],0)))+32)}" height="${titles.length*28+14}" rx="10"/>`+txt(titles,105,y+3,'se-activity-tab-text',28,24)+(safety.length?txt(safety,113,y+safetyY,'se-copy se-table-copy',25,18.4):'')+items.map(r=>(r.num?txt([r.num+'.'],113,y+r.y,'se-activity-step'):'')+txt(r.ls,r.num?151:113,y+r.y)).join('')+(figure?`<g class="se-activity-art">`+figure.images.map((im,i)=>pic(im,(side?669:113)+i*(side?270:826)/figure.images.length,y+figureY,(side?270:826)/figure.images.length,figure.height)).join('')+'</g>'+(figure.labels||[]).map((v,i)=>`<text class="se-copy se-table-copy se-bold" x="${113+(i+.5)*826/figure.labels.length}" y="${y+figureY+figure.height+23}" text-anchor="middle">${E(v)}</text>`).join('')+txt(caption,side?669:113,y+figureY+figure.height+stageLabelHeight+8,'se-copy se-table-copy',25,18.4):'')+'</g>',g);
 }else if(g.kind==='dialogue'){
  const ls=g.items.map(t=>wrap(t,595));const ht=Math.max(290,ls.reduce((v,r)=>v+r.length*31+12,0));
  add(ht+18,y=>g.images.map((im,i)=>pic(im,89,y+i*150,235,140)).join('')+ls.map((r,i)=>txt(r,358,y+ls.slice(0,i).reduce((v,p)=>v+p.length*31+12,0))).join(''),g);
 }else if(g.kind==='journey'){
  const rows=g.labels.map(v=>wrap(v,265,'b',.8));
  add(530,y=>txt(wrap(g.title,874,'b',.8),89,y,'se-copy se-table-copy',25,18.4)+g.images.map((im,i)=>{const x=89+(i%3)*294,yy=y+45+Math.floor(i/3)*235;return pic(im,x,yy,270,170)+txt(rows[i],x,yy+176,'se-copy se-table-copy',25,18.4);}).join(''),g);
 }else if(g.kind==='images'){
  if(g.source===1){const im=g.images[0],height=Math.min(390,874*im.pixelH/im.pixelW);add(height+30,y=>pic(im,89,y,874,height),g);continue;}

  if(g.images.some(im=>im.labelsTop)){
   const cell=874/g.images.length,height=Math.min(350,...g.images.map(im=>(cell-12)*im.pixelH/im.pixelW));
   const bottom=g.images.some(im=>im.labelsBottom?.length)?34:0;
   add(36+height+bottom+18,y=>g.images.map((im,i)=>{const iw=Math.min(cell-12,height*im.pixelW/im.pixelH),ih=iw*im.pixelH/im.pixelW,x=89+i*cell+(cell-iw)/2,yy=y+36+(height-ih)/2;
    const labels=(ls,by)=>ls.map(([label,f])=>`<text class="se-copy se-table-copy" x="${x+f*iw}" y="${by}" text-anchor="middle">${E(label)}</text>`).join('');
    return labels(im.labelsTop||[],yy-8)+pic(im,x,yy,iw,ih)+labels(im.labelsBottom||[],yy+ih+25);
   }).join(''),g);continue;
  }
  const ims=g.images,n=ims.length,cell=874/n,height=Math.min(g.maxHeight||(n>2?210:350),...ims.map(im=>cell*im.h/im.w));
  // A compact object accompanies the following explanation, not a new full row.
  const next=groups[gi+1];
  if(n===1&&(g.compact||ims[0].w/ims[0].h<1.35)&&next?.kind==='text'&&next.text.length>160){
   const ls=wrap(next.text,540),h=Math.max(ls.length*31+14,245);add(h+18,y=>pic(ims[0],657,y,306,235)+txt(ls,89,y),{...g,text:next.text});gi++;
  }else add(height+25,y=>ims.map((im,i)=>pic(im,89+i*cell,y,cell-12,height)).join(''),g);
 }else if(g.kind==='table'){
  const columns=g.rows[0].length,cw=874/columns;let off=0;
  const rows=g.rows.map((row,ri)=>{const cells=row.map(c=>({ls:wrap(c.text||'—',cw-20,'b',.8),images:c.images}));const imageHeight=Math.min(140,cw*.65),h=Math.max(...cells.map(c=>c.ls.length*25+(c.images.length?imageHeight+8:0)))+24;const r={cells,h,y:off,ri,imageHeight};off+=h;return r;});
  if(off>1319||columns>6){
   // A wide reference table becomes complete labelled entry panels, never a
   // cut bordered table. Every source cell and picture is retained.
   const headers=g.rows[0].map(c=>c.text);
   for(const [index,row] of g.rows.slice(1).entries()){
    const title=wrap(row[0].text,810,'h');let yy=24+title.length*38;
    const images=row[2]?.images?.length?row[2].images:(row[0].images||[]),left=wrap(row[2]?.text||'',240,'b',.8);
    const right=[1,3,4].filter(i=>row[i]).map(i=>wrap(headers[i]+': '+row[i].text,552,'b',.8));
    const height=Math.max((images.length?150:0)+left.length*25,right.reduce((v,r)=>v+r.length*25+16,0));
    const h=yy+height+22;
    add(h+18,y=>`<rect class="se-reference-card" x="89" y="${y}" width="874" height="${h}" rx="10"/>`+txt(title,113,y+14,'se-heading',38,28.06)+images.map(im=>pic(im,113,y+yy,240,130)).join('')+txt(left,113,y+yy+(images.length?140:0),'se-copy se-table-copy',25,18.4)+right.map((r,i)=>txt(r,386,y+yy+right.slice(0,i).reduce((v,p)=>v+p.length*25+16,0),'se-copy se-table-copy',25,18.4)).join(''),{...g,caption:index===0?g.caption:undefined});
   }
  }else add(off+22,y=>rows.map(r=>(r.ri===0?`<rect class="se-table-head" x="89" y="${y+r.y}" width="874" height="${r.h}"/>`:'')+r.cells.map((c,i)=>txt(c.ls,99+i*cw,y+r.y+10,r.ri===0?'se-copy se-table-copy se-bold':'se-copy se-table-copy',25,18.4)+c.images.map(im=>pic(im,99+i*cw,y+r.y+18+c.ls.length*25,cw-20,r.imageHeight)).join('')).join('')+`<line class="se-rule" x1="89" x2="963" y1="${y+r.y+r.h}" y2="${y+r.y+r.h}"/>`).join(''),g);
 }
}
// Whole components, balanced pages, and five body lines under an opener.
for(const a of atoms)if(a.h>1319)throw Error('Oversized '+a.kind+' source '+a.source+' '+a.h);
const memo=new Map();
function pack(start,first=false){
 if(start===atoms.length)return {cost:0,pages:[]};
 const key=start+':'+first;if(memo.has(key))return memo.get(key);
 const cap=first?1135:1319;let used=0,best=null;
 for(let end=start;end<atoms.length;end++){
  used+=atoms[end].h;if(used>cap)break;
  let head=-1;for(let j=end;j>=start;j--)if(atoms[j].kind==='heading'){head=j;break;}
  if(head>=0&&end<atoms.length-1&&atoms.slice(head+1,end+1).reduce((v,a)=>v+(a.kind==='images'?0:a.h),0)<155)continue;
  const rest=pack(end+1),last=end===atoms.length-1;
  if(!rest)continue;
  const cost=10000+(cap-used)**2*(last?.15:1)+rest.cost;
  if(!best||cost<best.cost)best={cost,pages:[atoms.slice(start,end+1),...rest.pages]};
 }
 memo.set(key,best);return best;
}
const bodyStart=atoms.findIndex(a=>a.source!==1);
// The opener carries section 3.1 and its first two paragraphs (seven lines).
const openerEnd=bodyStart+3;
const packed=pack(openerEnd);if(!packed)throw Error('Cannot fit complete components');
const pages=[atoms.slice(0,openerEnd),...packed.pages];
for(const f of await fs.readdir(dir))if(/^p\d+\.html$/.test(f))await fs.unlink(path.join(dir,f));
const audit=[];
for(let ix=0;ix<pages.length;ix++){
 let y=ix?96:260;const n=ix+1;let body='';
 if(ix===0)body='<path class="food-gold-tag" d="M92 45H215V163Q215 230 147 230Q81 230 81 165V70Q81 45 92 45Z"/><path class="food-navy" d="M105 45H206V164Q206 234 143 234Q81 234 81 164V73Q81 45 105 45Z"/><text class="food-text food-white science-chapter-label" x="143" y="94" text-anchor="middle">CHAPTER</text><text class="food-text food-white science-chapter-number" x="143" y="211" text-anchor="middle">3</text><text class="se-title se-title--single" x="248" y="157">Food on Our Plate</text>';
 for(const a of pages[ix]){body+=a.render(y);y+=a.h;}
 if(y>1415)throw Error('Page '+n+' exceeds the content area: '+y);
 await fs.writeFile(`${dir}/p${String(n).padStart(3,'0')}.html`,`<section class="page page--food page--science-editorial${ix?'':' page--opener'}" data-folio="${n}"${n===pages.length?' data-close':''}><div class="page__body"><div class="page__main"><svg class="food-sheet science-sheet science-editorial" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1052 1514" aria-label="Food on Our Plate, page ${n}">${body}</svg></div></div></section>`);
 audit.push({page:n,end:y,sources:[...new Set(pages[ix].map(a=>a.source))],text:pages[ix].map(a=>a.text)});
}
await fs.writeFile('assets/design-history/ch03-tall-audit.json',JSON.stringify(audit,null,2));
await (await import('./science-botanical.mjs')).applyBotanical(dir);
console.log(`${pages.length} pages reset; ${atoms.length} reading components.`);
