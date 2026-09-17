// Refit the lesson's authored blocks, retaining exact type and artwork sizes.
// The opener and dedicated reference pages are excluded by the caller.
export function refitV2Lesson(plans){
 const top=112,bottom=1415,capacity=bottom-top;
 const blocks=plans.flatMap(p=>p.blocks);
 const n=blocks.length,prefix=[0];
 for(const b of blocks){
  if(b.h<=0||b.h>capacity)throw Error('Invalid V2 reading block: '+b.type+' '+b.h);
  prefix.push(prefix.at(-1)+b.h);
 }
 function legal(start,end){
  if(blocks[start].type==='rule')return false;
  const last=blocks[end-1],next=blocks[end];
  if(last.type==='heading')return false;
  if(next){
   if(next.type==='rule')return false;
   // These instructions refer to the plate immediately above. A short page
   // is preferable to making the scale warning refer to a picture overleaf.
   if(/^(Read across a row to connect a plant|The pictures show the three plants)/.test(next.text||''))return false;
   if(last.type==='activity'&&next.type==='table')return false;
   if(last.type==='figure'&&next.type==='comparison')return false;
   if(last.type==='body'&&next.type==='figure')return false;
  }
  for(let i=start;i<end;i++)if(blocks[i].type==='heading'&&prefix[end]-prefix[i+1]<160)return false;
  return true;
 }
 // Fewest pages first; within that extent minimise uneven lower margins.
 const best=Array(n+1).fill(null);best[n]={pages:0,cost:0};
 for(let start=n-1;start>=0;start--){
  for(let end=start+1;end<=n&&prefix[end]-prefix[start]<=capacity;end++){
   if(!best[end]||!legal(start,end))continue;
   const used=prefix[end]-prefix[start],gap=capacity-used;
   const proposal={pages:best[end].pages+1,cost:best[end].cost+gap*gap,end};
   if(!best[start]||proposal.pages<best[start].pages||(proposal.pages===best[start].pages&&proposal.cost<best[start].cost))best[start]=proposal;
  }
 }
 if(!best[0])throw Error('V2 blocks cannot be fitted without dividing a protected component.');
 const result=[];
 for(let start=0;start<n;){
  const end=best[start].end,selected=blocks.slice(start,end);let y=top;
  const parts=selected.map(b=>{const dy=y-b.top;y+=b.h;return `<g class="v2-reading-block" transform="translate(0 ${dy})">${b.html}</g>`;}).join('\n');
  const first=selected[0],next=blocks[end];
  result.push({title:first.type==='heading'?first.text:'',titleRole:first.type==='heading'?first.role:'continuation',
   source:[...new Set(selected.flatMap(b=>b.source))],parts,blocks:selected,end:y,
   breakReason:next?`Next ${next.type}: ${next.text?.slice(0,65)||next.artKey||'illustrated comparison'}`:'End of lesson before reference pages'});
  start=end;
 }
 return result;
}
