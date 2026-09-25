import fs from 'node:fs';
export const checkRoot='build/_all-maths-reference-checks';
export const backupRoot='build/_all-maths-reference-before';
export const clean=s=>s.replace(/<!--[\s\S]*?-->/g,'').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/\s+/g,' ').trim();
export const chapters=()=>['class-6','class-7','class-8','class-9','class-10'].flatMap(cls=>fs.readdirSync(`pages/${cls}`,{withFileTypes:true}).filter(e=>e.isDirectory()&&!e.name.startsWith('_')&&fs.existsSync(`pages/${cls}/${e.name}/chapter.json`)).map(e=>{const rel=`${cls}/${e.name}`,meta=JSON.parse(fs.readFileSync(`pages/${rel}/chapter.json`,'utf8'));return {rel,cls,meta,files:fs.readdirSync(`pages/${rel}`).filter(f=>/^p\d+\.html$/.test(f)).sort()};}).filter(c=>/^Mathematics/.test(c.meta.subject||'Mathematics I')));
const id='[0-9]+[A-Za-z]?\\.[0-9]+';
const ws='(?:\\s|&nbsp;|&#160;)';
export const pattern=()=>new RegExp(`\\b(Fig(?:ure)?s?\\.?|Tables?)(${ws}*)(${id}(?:(?:${ws}*,${ws}*|${ws}+and${ws}+|${ws}+to${ws}+|${ws}*[–−-]${ws}*)${id})*)`,'gi');
export function references(s){return [...s.matchAll(pattern())].map(m=>{let ids=m[3].match(new RegExp(id,'g'));if(/\bto\b|[–−-]/.test(m[3])&&ids.length===2){const [a,b]=ids.map(x=>x.split('.'));if(a[0]===b[0]&&+b[1]>=+a[1]&&+b[1]-a[1]<100)ids=Array.from({length:+b[1]-a[1]+1},(_,i)=>`${a[0]}.${+a[1]+i}`);}return {raw:m[0],label:m[1],space:m[2],ids,type:/^t/i.test(m[1])?'Table':'Figure',index:m.index,end:m.index+m[0].length};});}
export function definitions(cs=chapters()){
 return cs.flatMap(c=>c.files.flatMap((f,page)=>{const html=fs.readFileSync(`pages/${c.rel}/${f}`,'utf8');return [...html.matchAll(/<(figcaption|caption)\b[^>]*>([\s\S]*?)<\/\1>/gi)].flatMap(m=>{
  const text=clean(m[2]),r=references(text)[0];if(!r||r.index!==0)return [];
  return [{...c,files:undefined,file:f,page,index:m.index,end:m.index+m[0].length,key:`${r.type} ${r.ids[0]}`,type:r.type,id:r.ids[0],caption:text}];
 });}));
}
export function targetFor(defs,c,key,page,index){
 let candidates=defs.filter(d=>d.rel===c.rel&&d.key===key);
 if(!candidates.length)candidates=defs.filter(d=>d.cls===c.cls&&d.meta.subject===c.meta.subject&&d.key===key);
 if(!candidates.length)candidates=defs.filter(d=>d.cls===c.cls&&d.key===key);
 if(!candidates.length)return null;
 return candidates.sort((a,b)=>score(a)-score(b))[0];
 function score(d){return d.rel===c.rel?Math.abs(d.page-page)*1e7+Math.abs(d.index-index):1e10;}
}
export function snapshot(){fs.mkdirSync(checkRoot,{recursive:true});for(const c of chapters()){fs.mkdirSync(`${backupRoot}/${c.rel}`,{recursive:true});for(const f of [...c.files,'chapter.json']){const p=`${backupRoot}/${c.rel}/${f}`;if(!fs.existsSync(p))fs.copyFileSync(`pages/${c.rel}/${f}`,p);}}}
