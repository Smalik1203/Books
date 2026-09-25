import fs from 'node:fs';
import {chapters,references,checkRoot,backupRoot} from './maths-reference-data.mjs';
const defs=JSON.parse(fs.readFileSync(`${checkRoot}/numbering.json`,'utf8')).captions;
const report=[];
for(const c of chapters().filter(c=>c.cls!=='class-6')){
 const file=`pages/${c.rel}/ANSWERS.md`;if(!fs.existsSync(file))continue;
 const backup=`${backupRoot}/${c.rel}/ANSWERS.md`;
 if(fs.existsSync(backup))continue;
 const h=fs.readFileSync(file,'utf8');fs.copyFileSync(file,backup);let out=h;
 const edits=[];
 for(const r of references(h)){
  let end=r.end,sub='';
  if(c.rel==='class-10/ch10-circles'&&r.ids.length===1&&r.ids[0]==='10.3'&&r.type==='Figure'){
   const m=h.slice(end).match(/^(?:\s|&nbsp;|&#160;)*\((ii|i)\)/);if(m){sub=` (${m[1]})`;end+=m[0].length;}
  }
  const ids=r.ids.map(id=>{
   const key=`${r.type} ${id}${sub}`;
   let ds=defs.filter(d=>d.rel===c.rel&&d.key===key);
   if(!ds.length)ds=defs.filter(d=>d.cls===c.cls&&d.meta.subject===c.meta.subject&&d.key===key);
   if(!ds.length){report.push({file,unmapped:key});return id;}
   // Answer notes refer to the original artwork. Reproductions show the same object.
   return ds[0].newId;
  });
  const value=r.label+(r.space||' ')+(ids.length===1?ids[0]:ids.length===2?ids.join(' and '):ids.slice(0,-1).join(', ')+' and '+ids.at(-1));
  edits.push({start:r.index,end,value});
 }
 for(const e of edits.reverse())out=out.slice(0,e.start)+e.value+out.slice(e.end);
 if(out!==h){fs.writeFileSync(file,out);report.push({file,updated:true});}
}
fs.writeFileSync(`${checkRoot}/answer-notes.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
