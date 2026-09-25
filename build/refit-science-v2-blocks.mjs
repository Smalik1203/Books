// Refit the lesson's authored blocks, retaining exact type and artwork sizes.
// The opener and dedicated reference pages are excluded by the caller.
import {hasContentImage} from './science-page-illustrations.mjs';
export function refitV2Lesson(plans,{imageReserve=0,frontLoad=false}={}){
 const top=112,bottom=1415,capacity=bottom-top;
 const blocks=plans.flatMap(p=>p.blocks).map((b,i)=>({...b,id:b.atomId||`reading-${i}`,before:b.type==='heading'?12:0,h:b.h+(b.type==='heading'?12:0)}));
 const n=blocks.length,prefix=[0],images=[0];
 for(const b of blocks){
  if(b.h<=0||b.h>capacity)throw Error('Invalid V2 reading block: '+b.type+' '+b.h);
  prefix.push(prefix.at(-1)+b.h);
  images.push(images.at(-1)+(hasContentImage(b.html)?1:0));
 }
 function legal(start,end){
  if(frontLoad&&end===n&&start>0&&prefix[end]-prefix[start]<320)return false;
  if(blocks[start].type==='rule')return false;
  const last=blocks[end-1],next=blocks[end];
  if(last.type==='heading')return false;
  if(next){
   if(next.type==='rule')return false;
   if(last.keepNext)return false;
   if(/^The pictures show the three plants/.test(next.text||'')&&(next.paragraphPart===0||frontLoad&&next.paragraphPart===undefined))return false;
  }
  for(let i=start;i<end;i++)if(blocks[i].type==='heading'&&prefix[end]-prefix[i+1]<(blocks[i].completeUnitHeight??160))return false;
  return true;
 }
 // Fewest pages first; then balance lower margins without distributing spare
 // height between paragraphs or changing type and artwork sizes.
 const best=Array(n+1).fill(null);best[n]={pages:0,cost:0};
 for(let start=n-1;start>=0;start--){
  for(let end=start+1;end<=n&&prefix[end]-prefix[start]-blocks[start].before<=capacity;end++){
   if(!best[end]||!legal(start,end))continue;
   const used=prefix[end]-prefix[start]-blocks[start].before;
   const reserve=images[end]===images[start]?imageReserve:0;
   if(used+reserve>capacity)continue;
   const gap=capacity-used-reserve;
   const proposal={pages:best[end].pages+1,cost:best[end].cost+gap*gap,end,gap};
   // Class 6: fill the earlier leaf before balancing later leaves. This moves
   // continuation prose forward without adding pages or splitting a panel.
   if(!best[start]||proposal.pages<best[start].pages||(proposal.pages===best[start].pages&&
    (frontLoad ? proposal.gap<best[start].gap || proposal.gap===best[start].gap&&proposal.cost<best[start].cost : proposal.cost<best[start].cost)))best[start]=proposal;
  }
 }
 if(!best[0])throw Error('V2 blocks cannot be fitted without dividing a protected component.');
 const result=[];
 for(let start=0;start<n;){
  const end=best[start].end,selected=blocks.slice(start,end);let y=top;
  const blockAudit=[];
  const parts=selected.map((b,i)=>{const before=i?b.before:0,h=b.h-b.before; y+=before;const dy=y-b.top;blockAudit.push({id:b.id,type:b.type,text:b.text,artKey:b.artKey,top:y,bottom:y+h,before,keepNext:!!b.keepNext,comparisonItems:b.comparisonItems,conceptId:b.conceptId});y+=h;return `<g class="v2-reading-block" data-block="${b.id}" transform="translate(0 ${dy})">${b.html}</g>`;}).join('\n');
  const first=selected[0],next=blocks[end];
  result.push({title:first.type==='heading'?first.text:'',titleRole:first.type==='heading'?first.role:'continuation',
   source:[...new Set(selected.flatMap(b=>b.source))],parts,blocks:selected,end:y,blockAudit,
   protectedNext:next?{id:next.id,type:next.type,height:next.h,keepNext:!!next.keepNext}:null,
   breakReason:next?`Next ${next.type}: ${next.text?.slice(0,65)||next.artKey||'illustrated comparison'}`:'End of lesson before reference pages'});
  start=end;
 }
 return result;
}
