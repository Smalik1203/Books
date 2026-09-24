// Small, meaningful identification illustrations for otherwise text-only pages.
// Keep this separate from feature icons and from full instructional figures.
import fs from 'node:fs';
import {createHash} from 'node:crypto';
const catalog=JSON.parse(fs.readFileSync(new URL('../assets/design-history/science-page-images/catalog.json',import.meta.url),'utf8'));
const reviewed=JSON.parse(fs.readFileSync(new URL('../assets/design-history/science-g7-image-repetition/page-art.json',import.meta.url),'utf8'));
const hashes=new Map();
function assetHash(file){
 if(!hashes.has(file))hashes.set(file,createHash('sha256').update(fs.readFileSync(new URL('../'+file,import.meta.url))).digest('hex'));
 return hashes.get(file);
}
// A real figure area, fixed before pagination. Never reduce it to the space left.
export const pageImageReserve=360;
export function hasContentImage(html){
 return /data-instructional-figure="[^"]+"/.test(String(html)) || [...String(html).matchAll(/<(?:image|img)\b[^>]*(?:href|src)="([^"]+)"/g)].some(m=>!/(?:icon|cues\/|think-it-through)/i.test(m[1]));
}
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const selections=new Map();
export function resetPageIllustrations(grade,chapter){selections.delete(`${grade}-${Number(chapter)}`);}
export function pageIllustration(html,grade,chapter,{commit=false}={}){
 const key=`${grade}-${Number(chapter)}`,authored=reviewed[key];
 const choices=authored||catalog[key];if(!choices)throw Error('No page illustration catalogue for '+grade+'/'+chapter);
 const plain=html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').toLowerCase();
 const state=selections.get(key)||{used:new Map(),last:null,hashes:new Map()};
 const anchors=new Set([...html.matchAll(/data-block="([^"]+)"/g)].map(m=>m[1]));
 let choice,best=-Infinity;
 for(const [i,item] of choices.entries()){
  const uses=state.used.get(item.file)||0;
  if(authored){
   if(commit&&state.hashes.has(assetHash(item.file)))continue;
   const overlap=item.anchors.filter(a=>anchors.has(a)).length;
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
 if(!choice)throw Error(`No unused, nonconsecutive illustration available for ${key}; author another subject-specific figure.`);
 if(commit){state.used.set(choice.file,(state.used.get(choice.file)||0)+1);state.last=choice.file;state.hashes.set(assetHash(choice.file),'supplement');selections.set(key,state);}
 const caption=choice.caption.split('|');
 const markup=`<g data-page-illustration="${escape(choice.file)}"><image class="science-illustration" href="../../${choice.file}" x="166" y="10" width="720" height="280" preserveAspectRatio="xMidYMid meet"><title>${escape(caption.join(' '))}</title></image><text class="se-caption" x="526" y="318" text-anchor="middle">${caption.map((s,i)=>`<tspan x="526"${i?' dy="27"':''}>${escape(s)}</tspan>`).join('')}</text></g>`;
 return {html:markup,height:pageImageReserve,file:choice.file,caption:caption.join(' '),matchScore:best};
}
export function completeIllustratedPage(page,grade,chapter){
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
 const illustration=pageIllustration(page.parts,grade,chapter,{commit:true});
 if(page.end+illustration.height>1415)throw Error(`Class ${grade} chapter ${chapter}: reserve space for an image on ${page.title||page.titleRole} (ends ${page.end})`);
 const top=page.end;
 page.parts+=`<g transform="translate(0 ${top})">${illustration.html}</g>`;
 page.end+=illustration.height;page.pageIllustration=illustration;
 if(page.blockAudit)page.blockAudit.push({id:'page-illustration',type:'figure',text:illustration.caption,artKey:illustration.file,top,bottom:page.end});
 return page;
}
