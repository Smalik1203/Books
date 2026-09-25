import fs from 'node:fs';
import assert from 'node:assert/strict';
import {chapters,definitions,references,targetFor,clean,checkRoot,backupRoot} from './maths-reference-data.mjs';
const cs=chapters(),defs=definitions(cs),starts=new Map(),volumes=new Map();
for(const c of cs){const key=c.cls+'/'+c.meta.subject;if(!volumes.has(key))volumes.set(key,[]);volumes.get(key).push(c);}
for(const list of volumes.values()){let folio=1;for(const c of list.sort((a,b)=>+a.meta.number-+b.meta.number)){starts.set(c.rel,folio);folio+=c.files.length;}}
const forward=[],unresolved=[],nonSequential=[],contentChanges=[];let totalRefs=0;
const normalize=s=>clean(s).replace(/\bFig(?:ure)?\.?\s*10\.3\s*\((?:i|ii)\)/g,'REF').replace(/\bFig(?:ure)?\.?\s*10\.[34](?!\d)/g,'REF').replace(new RegExp('x^'),'').replace(/\b(?:Fig(?:ure)?s?\.?|Tables?)\s*\d+[A-Za-z]?\.\d+(?:(?:\s*,\s*|\s+and\s+|\s+to\s+|\s*[–−-]\s*)\d+[A-Za-z]?\.\d+)*/gi,'REF').replace(/\s+/g,'');
for(const c of cs){
 const own=defs.filter(d=>d.rel===c.rel);own.forEach((d,i)=>{if(d.id!==`${c.meta.number}.${i+1}`)nonSequential.push({rel:c.rel,id:d.id,expected:`${c.meta.number}.${i+1}`});});
 let now='';
 for(const [page,file]of c.files.entries()){
  const html=fs.readFileSync(`pages/${c.rel}/${file}`,'utf8');now+=html;
  const prose=html.replace(/<(figcaption|caption|svg)\b[^>]*>[\s\S]*?<\/\1>/gi,m=>' '.repeat(m.length));
  for(const r of references(prose))for(const id of r.ids){
   totalRefs++;const d=targetFor(defs,c,`${r.type} ${id}`,page,r.index);
   if(!d){unresolved.push({rel:c.rel,file,ref:`${r.type} ${id}`});continue;}
   if(d.rel===c.rel&&d.page>page)forward.push({rel:c.rel,subject:c.meta.subject,title:c.meta.title,chapter:c.meta.number,reference:`${r.type} ${id}`,source:`pages/${c.rel}/${file}`,target:`pages/${c.rel}/${d.file}`,from:starts.get(c.rel)+page,to:starts.get(c.rel)+d.page,gap:d.page-page,excerpt:clean(prose.slice(Math.max(0,r.index-170),r.index+600)),caption:d.caption});
  }
 }
 const backup=`${backupRoot}/${c.rel}`;
 if(fs.existsSync(backup)){
  const before=fs.readdirSync(backup).filter(f=>/^p\d+\.html$/.test(f)).sort().map(f=>fs.readFileSync(`${backup}/${f}`,'utf8')).join('');
  const a=normalize(before),b=normalize(now);if(a!==b){let i=0;while(a[i]===b[i])i++;contentChanges.push({rel:c.rel,at:i,before:a.slice(i-80,i+180),after:b.slice(i-80,i+180)});}
 }
}
const result={chapters:cs.length,captions:defs.length,totalRefs,nonSequential,unresolved,contentChanges,forward};
fs.writeFileSync(`${checkRoot}/audit.json`,JSON.stringify(result,null,2));
console.log(JSON.stringify({...result,forward:forward.length},null,2));
if(nonSequential.length||unresolved.length||contentChanges.length)process.exitCode=1;
