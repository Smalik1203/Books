// Measure real line breaks so page fitting can continue prose without splitting boxes.
export const paragraphLineProbe = String.raw`
function paragraphLines(block) {
 const p=block.querySelector(':scope > p');
 if(!p || p.classList.contains('g6-caption') || p.classList.contains('g6-bullet')) return null;
 const walker=document.createTreeWalker(p,NodeFilter.SHOW_TEXT), words=[];
 while(walker.nextNode()) {
  const node=walker.currentNode;
  for(const m of node.textContent.matchAll(/\S+/g)) {
   const range=document.createRange();range.setStart(node,m.index);range.setEnd(node,m.index+m[0].length);
   words.push({node,start:m.index,end:m.index+m[0].length,y:range.getBoundingClientRect().top});
  }
 }
 if(!words.length)return null;
 const starts=[words[0]];
 for(let i=1;i<words.length;i++)if(Math.abs(words[i].y-words[i-1].y)>2)starts.push(words[i]);
 return starts.map((word,i)=>{
  const range=document.createRange();
  if(i===0)range.setStart(p,0);else range.setStart(word.node,word.start);
  if(i+1<starts.length)range.setEnd(starts[i+1].node,starts[i+1].start);else range.setEnd(p,p.childNodes.length);
  const holder=document.createElement('div');holder.append(range.cloneContents());return holder.innerHTML.trim();
 });
}`;

export function expandParagraphLines(blocks,measurements,heights,unit) {
 const measured=new Map(measurements.map(x=>[x.id,x]));
 return blocks.flatMap(b=>{
  const m=measured.get(b.id);
  if(b.type!=='paragraph'||!m?.lines||m.lines.length<3||b.keepNext)return [b];
  return m.lines.map((html,i)=>{
   const id=b.id+'-line-'+i;
   heights.set(id,m.lineHeight/unit+(i===m.lines.length-1?m.paddingBottom/unit:0));
   return {...b,id,html,paragraphId:b.id,paragraphLine:i,paragraphLines:m.lines.length,flowContinues:i<m.lines.length-1};
  });
 });
}

export function joinParagraphLines(blocks) {
 const out=[];
 for(const b of blocks){
  const previous=out.at(-1);
  if(b.paragraphId&&previous?.paragraphId===b.paragraphId){previous.html+=' '+b.html;previous.flowContinues=b.flowContinues;}
  else out.push({...b});
 }
 return out.map(b=>b.paragraphId?{...b,id:b.paragraphId+(b.paragraphLine?'-continued-'+b.paragraphLine:'')}:b);
}
