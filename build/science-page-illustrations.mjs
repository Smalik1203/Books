// Meaningful identification illustrations for otherwise text-only pages.
// Keep this separate from feature icons and from full instructional figures.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const catalog=JSON.parse(fs.readFileSync(new URL('../assets/design-history/science-page-images/catalog.json',import.meta.url),'utf8'));
const reviewed=Object.assign({},...['science-g7-image-repetition','science-g6-format-rollout'].map(dir=>JSON.parse(fs.readFileSync(new URL(`../assets/design-history/${dir}/page-art.json`,import.meta.url),'utf8'))));
Object.assign(reviewed,JSON.parse(fs.readFileSync(new URL('../assets/design-history/science-g7-layout-review/page-art.json',import.meta.url),'utf8')));
const hashes=new Map();
const imageSizes=JSON.parse(fs.readFileSync(new URL('../assets/design-history/science-g6-format-rollout/image-sizes.json',import.meta.url),'utf8'));
const class7ImageSizes=JSON.parse(fs.readFileSync(new URL('../assets/design-history/science-g7-layout-review/image-sizes.json',import.meta.url),'utf8'));
function assetHash(file){
 if(!hashes.has(file))hashes.set(file,createHash('sha256').update(fs.readFileSync(new URL('../'+file,import.meta.url))).digest('hex'));
 return hashes.get(file);
}
// Reserve a minimum figure area before pagination; Classes 6 and 7 may enlarge it into spare space.
export const pageImageReserve=360;
export function hasContentImage(html){
 return /data-instructional-figure="[^"]+"/.test(String(html)) || [...String(html).matchAll(/<(?:image|img)\b[^>]*(?:href|src)="([^"]+)"/g)].some(m=>!/(?:icon|cues\/|think-it-through)/i.test(m[1]));
}
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const selections=new Map();
export function resetPageIllustrations(grade,chapter){selections.delete(`${grade}-${Number(chapter)}`);}
export function pageIllustration(html,grade,chapter,{commit=false,availableHeight=pageImageReserve}={}){
 const key=`${grade}-${Number(chapter)}`,authored=reviewed[key];
 const choices=authored||catalog[key];if(!choices)throw Error('No page illustration catalogue for '+grade+'/'+chapter);
 const plain=html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').toLowerCase();
 const state=selections.get(key)||{used:new Map(),last:null,hashes:new Map()};
 const anchors=new Set([...html.matchAll(/data-block="([^"]+)"/g)].map(m=>m[1]));
 const anchorMatch=a=>anchors.has(a)||Number(grade)===6&&!a.startsWith('g6-')&&anchors.has(a.replace(/-\d+$/,''));
 let choice,best=-Infinity;
 for(const [i,item] of choices.entries()){
  const uses=state.used.get(item.file)||0;
  if(authored){
   if(commit&&state.hashes.has(assetHash(item.file)))continue;
   const overlap=item.anchors.filter(anchorMatch).length;
   const reference=!item.anchors.length&&item.title&&plain.includes(item.title.toLowerCase());
   if(!overlap&&!reference)continue;
   const score=reference?100:100*overlap/Math.max(anchors.size,item.anchors.length);
   if(score>best){choice=item;best=score;}
   continue;
  }
  if(commit&&(uses>=2||state.last===item.file))continue;
  const score=(item.priorityTerms?.some(t=>plain.includes(t.toLowerCase()))?30:0)+item.terms.reduce((n,t)=>n+(plain.includes(t.toLowerCase())?t.split(' ').length:0)+(plain.slice(0,500).includes(t.toLowerCase())?3*t.split(' ').length:0),0)-(commit?uses*12:0);
  if(score>best){choice=item;best=score;}
 }
 if(!choice)throw Error(`No unused, nonconsecutive illustration available for ${key} (${[...anchors].join(', ')||plain.slice(0,180)}); author another subject-specific figure.`);
 if(commit){state.used.set(choice.file,(state.used.get(choice.file)||0)+1);state.last=choice.file;state.hashes.set(assetHash(choice.file),'supplement');selections.set(key,state);}
 return renderPageIllustration(choice,grade,availableHeight);
}
export function renderPageIllustration(choice,grade,availableHeight=pageImageReserve){
 const caption=choice.caption.split('|');
 let width=720,artHeight=280,captionY=318,height=pageImageReserve;
 if([6,7].includes(Number(grade))){
  const size=(Number(grade)===6?imageSizes:class7ImageSizes)[choice.file];
  if(!size)throw Error('Missing reviewed image dimensions: '+choice.file);
  const ratio=size[0]/size[1],captionSpace=Number(grade)===7&&caption.length>1?88:80;
  width=824;artHeight=Math.min(540,availableHeight-captionSpace,width/ratio);
  width=Math.min(width,artHeight*ratio);captionY=artHeight+48;height=artHeight+captionSpace;
 }
 const markup=`<g data-page-illustration="${escape(choice.file)}"><image class="science-illustration" href="../../${choice.file}" x="${526-width/2}" y="10" width="${width}" height="${artHeight}" preserveAspectRatio="xMidYMid meet"><title>${escape(caption.join(' '))}</title></image><text class="se-caption" x="526" y="${captionY}" text-anchor="middle">${caption.map((s,i)=>`<tspan x="526"${i?' dy="27"':''}>${escape(s)}</tspan>`).join('')}</text></g>`;
 return {html:markup,height,file:choice.file,caption:caption.join(' ')};
}
export function completeIllustratedPage(page,grade,chapter){
 if([6,7].includes(Number(grade))&&page.blocks?.length){
  const last=page.blocks.at(-1),images=[...last.html.matchAll(/<image\b[^>]*>/g)];
  if(last.type==='figure'&&images.length===1&&!/<(?:path|line|rect|polygon|circle)\b/.test(last.html)){
   const tag=images[0][0],value=name=>Number(tag.match(new RegExp(`\\b${name}="([\\d.]+)"`))?.[1]);
   const x=value('x'),y=value('y'),w=value('width'),h=value('height');
   const factor=Math.min(824/w,540/h,1+(1415-page.end)/h),delta=h*(factor-1);
   if(Number.isFinite(delta)&&delta>12){
    const newTag=tag.replace(/\bx="[^"]+"/,`x="${x+w*(1-factor)/2}"`).replace(/\bwidth="[^"]+"/,`width="${w*factor}"`).replace(/\bheight="[^"]+"/,`height="${h*factor}"`);
    let enlarged=last.html.replace(/<text\b[^>]*>/g,t=>t.replace(/\by="([\d.]+)"/,(_,baseline)=>`y="${Number(baseline)>=y+h?Number(baseline)+delta:baseline}"`)).replace(tag,newTag);
    page.parts=page.parts.replace(last.html,enlarged);last.html=enlarged;last.h+=delta;page.end+=delta;
    if(page.blockAudit?.length)page.blockAudit.at(-1).bottom+=delta;
   }
  }
 }
 if(hasContentImage(page.parts)){
  const key=`${grade}-${Number(chapter)}`;
  if(reviewed[key]){
   const state=selections.get(key)||{used:new Map(),last:null,hashes:new Map()};
   for(const m of page.parts.matchAll(/<image\b[^>]*href="\.\.\/\.\.\/(figures\/[^"]+)"/g)){
    const hash=assetHash(m[1]);
    if(state.hashes.get(hash)==='supplement')throw Error(`A supplementary illustration repeats a lesson figure in ${key}: ${m[1]}`);
    state.hashes.set(hash,'instruction');
   }
   selections.set(key,state);
  }
  return page;
 }
 const illustration=pageIllustration(page.parts,grade,chapter,{commit:true,availableHeight:1415-page.end});
 if(page.end+illustration.height>1415)throw Error(`Class ${grade} chapter ${chapter}: reserve space for an image on ${page.title||page.titleRole} (ends ${page.end})`);
 const top=page.end;
 page.parts+=`<g transform="translate(0 ${top})">${illustration.html}</g>`;
 page.end+=illustration.height;page.pageIllustration=illustration;
 if(page.blockAudit)page.blockAudit.push({id:'page-illustration',type:'figure',text:illustration.caption,artKey:illustration.file,top,bottom:page.end});
 return page;
}
