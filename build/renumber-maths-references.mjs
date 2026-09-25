import fs from 'node:fs';
import {chapters,definitions,references,targetFor,snapshot,checkRoot} from './maths-reference-data.mjs';
const report=`${checkRoot}/numbering.json`;
if(fs.existsSync(report))throw Error('Migration already applied; use the saved mapping, not a second migration.');
snapshot();
const cs=chapters(),defs=definitions(cs),counts={};
// Treat two separately captioned activities as standalone figures, not subparts.
for(const d of defs)if(d.rel==='class-10/ch10-circles'&&d.id==='10.3')d.key+=d.caption.includes('(ii)')?' (ii)':' (i)';
for(const d of defs)d.newId=`${d.meta.number}.${counts[d.rel]=(counts[d.rel]||0)+1}`;
const replacements=[],unresolved=[];
for(const c of cs){
 if(c.cls==='class-6')continue; // already migrated and validated
 for(const [page,f]of c.files.entries()){
  const p=`pages/${c.rel}/${f}`,html=fs.readFileSync(p,'utf8'),edits=[];
  for(const r of references(html)){
   let end=r.end,sub='';
   if(c.rel==='class-10/ch10-circles'&&r.ids.length===1&&r.ids[0]==='10.3'&&r.type==='Figure'){
    const m=html.slice(end).match(/^(?:\s|&nbsp;|&#160;)*\((ii|i)\)/);if(m){sub=` (${m[1]})`;end+=m[0].length;}
   }
   const ids=r.ids.map(id=>{
    const key=`${r.type} ${id}${sub}`;
    const own=defs.find(d=>d.rel===c.rel&&d.file===f&&r.index>=d.index&&r.index<d.end&&d.key===key);
    const d=own||targetFor(defs,c,key,page,r.index);
    if(!d){unresolved.push({file:p,reference:key});return id;}
    return d.newId;
   });
   const joined=ids.length===1?ids[0]:ids.length===2?ids.join(' and '):ids.slice(0,-1).join(', ')+' and '+ids.at(-1);
   const value=r.label+(r.space||' ')+joined;
   edits.push({start:r.index,end,value});
   replacements.push({file:p,old:html.slice(r.index,end),new:value});
  }
  let out=html;for(const e of edits.reverse())out=out.slice(0,e.start)+e.value+out.slice(e.end);
  if(out!==html)fs.writeFileSync(p,out);
 }
}
fs.writeFileSync(report,JSON.stringify({captions:defs.map(({files,...d})=>d),replacements,unresolved},null,2));
console.log(JSON.stringify({chapters:cs.length,captions:defs.length,changedLabels:replacements.filter(r=>r.old!==r.new).length,unresolved},null,2));
