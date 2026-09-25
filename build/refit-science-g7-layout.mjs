// Fit whole teaching components and assign each contextual picture only once.
// Solve page/art decisions together so an early continuation cannot consume
// the only relevant illustration for a later page of the same topic.
import fs from 'node:fs';
import {hasContentImage,renderPageIllustration} from './science-page-illustrations.mjs';
const plans=JSON.parse(fs.readFileSync(new URL('../assets/design-history/science-g7-layout-review/page-art.json',import.meta.url),'utf8'));
function enlargeStandalone(blocks,spare){
 for(let index=blocks.length-1;index>=0;index--){
  const block=blocks[index],images=[...block.html.matchAll(/<image\b[^>]*>/g)];
  if(block.type!=='figure'||images.length!==1||/<(?:path|line|rect|polygon|circle)\b/.test(block.html))continue;
  const tag=images[0][0],value=name=>Number(tag.match(new RegExp(`\\b${name}="([\\d.]+)"`))?.[1]);
  const x=value('x'),y=value('y'),w=value('width'),h=value('height');
  const factor=Math.min(824/w,540/h,1+spare/h),delta=h*(factor-1);
  if(!Number.isFinite(delta)||delta<=12)continue;
  const enlarged=tag.replace(/\bx="[^"]+"/,`x="${x+w*(1-factor)/2}"`).replace(/\bwidth="[^"]+"/,`width="${w*factor}"`).replace(/\bheight="[^"]+"/,`height="${h*factor}"`);
  const html=block.html.replace(/<text\b[^>]*>/g,t=>t.replace(/\by="([\d.]+)"/,(_,baseline)=>`y="${Number(baseline)>=y+h?Number(baseline)+delta:baseline}"`)).replace(tag,enlarged);
  return {index,delta,html};
 }
 return null;
}
export function refitClass7Lesson(input,{chapter}={}){
 const top=112,bottom=1415,capacity=bottom-top;
 const blocks=input.flatMap(p=>p.blocks).map((b,i)=>({...b,id:b.atomId||`reading-${i}`,before:b.type==='heading'?12:0,h:b.h+(b.type==='heading'?12:0)}));
 const art=(plans[`7-${chapter}`]||[]).filter(a=>a.anchors.length),n=blocks.length,prefix=[0],images=[0];
 for(const b of blocks){if(b.h<=0||b.h>capacity)throw Error(`Chapter ${chapter}: oversize ${b.id} (${b.h})`);prefix.push(prefix.at(-1)+b.h);images.push(images.at(-1)+(hasContentImage(b.html)?1:0));}
 const choices=Array.from({length:n},()=>[]);
 for(let start=0;start<n;start++)for(let end=start+1;end<=n;end++){
  const used=prefix[end]-prefix[start]-blocks[start].before;if(used>capacity)break;
  const last=blocks[end-1],next=blocks[end];
  if(blocks[start].type==='rule'||last.type==='heading'||next?.type==='rule'||next&&last.keepNext)continue;
  const shortHeadings=blocks.slice(start,end).filter((b,j)=>b.type==='heading'&&prefix[end]-prefix[start+j+1]<(b.completeUnitHeight??160));
  const illustrated=images[end]>images[start],gap=capacity-used-(illustrated?0:360);
  if(gap<0)continue;
  if(illustrated){if(!shortHeadings.length){const growth=enlargeStandalone(blocks.slice(start,end),gap);choices[start].push({end,used,gap:gap-(growth?.delta||0),art:-1,score:0});}continue;}
  const ids=new Set(blocks.slice(start,end).map(b=>b.id));
  for(const [a,item] of art.entries()){
   const overlap=item.anchors.filter(id=>ids.has(id)).length;
   if(overlap&&shortHeadings.every(h=>item.anchors.some(id=>blocks.slice(blocks.indexOf(h),end).some(b=>b.id===id)))){
    const actualGap=capacity-used-renderPageIllustration(item,7,capacity-used).height;
    choices[start].push({end,used,gap:actualGap,art:a,score:overlap/item.anchors.length});
   }
  }
 }
 const memo=new Map();
 function solve(start,mask){
  if(start===n)return {pages:0,cost:0};
  const key=start+':'+mask;if(memo.has(key))return memo.get(key);
  let best=null;
  for(const candidate of choices[start]){
   const bit=candidate.art<0?0n:1n<<BigInt(candidate.art);if(mask&bit)continue;
   const tail=solve(candidate.end,mask|bit);if(!tail)continue;
   const proposal={...candidate,mask:mask|bit,pages:tail.pages+1,cost:tail.cost+candidate.gap*candidate.gap};
   if(!best||proposal.pages<best.pages||proposal.pages===best.pages&&(proposal.cost<best.cost||proposal.cost===best.cost&&(proposal.gap<best.gap||proposal.gap===best.gap&&proposal.score>best.score)))best=proposal;
  }
  memo.set(key,best);return best;
 }
 if(!solve(0,0n)){
  const stop=blocks.findIndex((_,i)=>solve(i,0n));
  throw Error(`Chapter ${chapter}: no complete illustrated fit near ${blocks.slice(Math.max(0,stop-3),stop+3).map(b=>b.id).join(', ')}; add topic-specific art or revise the teaching join.`);
 }
 const result=[];let start=0,mask=0n;
 while(start<n){
  const chosen=solve(start,mask),selected=blocks.slice(start,chosen.end).map(b=>({...b})),blockAudit=[];let y=top;
  const growth=chosen.art<0?enlargeStandalone(selected,capacity-chosen.used):null;
  if(growth){selected[growth.index].html=growth.html;selected[growth.index].h+=growth.delta;}
  let parts=selected.map((b,i)=>{const before=i?b.before:0,h=b.h-b.before;y+=before;const dy=y-b.top;
   blockAudit.push({id:b.id,type:b.type,text:b.text,artKey:b.artKey,top:y,bottom:y+h,before,keepNext:!!b.keepNext,comparisonItems:b.comparisonItems,conceptId:b.conceptId});
   y+=h;return `<g class="v2-reading-block" data-block="${b.id}" transform="translate(0 ${dy})">${b.html}</g>`;
  }).join('\n');
  let illustration;
  if(chosen.art>=0){illustration=renderPageIllustration(art[chosen.art],7,bottom-y);const imageTop=y;parts+=`<g transform="translate(0 ${y})">${illustration.html}</g>`;y+=illustration.height;
   blockAudit.push({id:'page-illustration',type:'figure',text:illustration.caption,artKey:illustration.file,top:imageTop,bottom:y});}
  const first=selected[0],next=blocks[chosen.end];
  result.push({title:first.type==='heading'?first.text:'',titleRole:first.type==='heading'?first.role:'continuation',source:[...new Set(selected.flatMap(b=>b.source))],parts,blocks:selected,end:y,blockAudit,pageIllustration:illustration,
   protectedNext:next?{id:next.id,type:next.type,height:next.h,keepNext:!!next.keepNext}:null,
   breakReason:next?`Next ${next.type}: ${next.text?.slice(0,65)||next.artKey||'illustrated comparison'}`:'End of lesson before reference pages'});
  start=chosen.end;mask=chosen.mask;
 }
 return result;
}
