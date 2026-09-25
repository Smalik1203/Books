import fs from 'node:fs';
import path from 'node:path';
const clean=s=>s.replace(/<!--[\s\S]*?-->/g,'').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/g,' ').replace(/\s+/g,' ').trim();
const refs=s=>{
 const out=[];
 for(const m of s.matchAll(/\b(Fig(?:ure)?s?\.?|Tables?)\s*(\d+\.\d+(?:(?:\s*,\s*|\s+and\s+|\s+to\s+|\s*[–−-]\s*)\d+\.\d+)*)/gi)){
  const type=/^t/i.test(m[1])?'Table':'Figure', nums=m[2].match(/\d+\.\d+/g);
  if(/\bto\b|[–−-]/.test(m[2])&&nums.length===2){const [a,b]=nums.map(n=>n.split('.').map(Number));if(a[0]===b[0]&&b[1]-a[1]<100)for(let n=a[1]+1;n<b[1];n++)nums.push(`${a[0]}.${n}`);}
  for(const num of nums)out.push({key:`${type} ${num}`,index:m.index});
 }
 return out;
};
const results=[],unresolved=[],duplicates=[];let chapters=0,mentions=0;
for(const cls of ['class-6','class-7','class-8','class-9','class-10'])for(const ent of fs.readdirSync(`pages/${cls}`,{withFileTypes:true})){
 const dir=`pages/${cls}/${ent.name}`,mp=`${dir}/chapter.json`;
 if(!ent.isDirectory()||ent.name.startsWith('_')||!fs.existsSync(mp))continue;
 const meta=JSON.parse(fs.readFileSync(mp,'utf8'));if(!/^Mathematics/.test(meta.subject||'Mathematics I'))continue;
 chapters++;
 const files=fs.readdirSync(dir).filter(f=>/^p\d+\.html$/.test(f)).sort();
 const defs=new Map(),pages=[];
 const slug=(meta.subject||'Mathematics I').toLowerCase().replace(/\s+/g,'-');
 const book=`build/${cls}/${cls}-${slug}-book.html`;
 const bookText=fs.existsSync(book)?fs.readFileSync(book,'utf8'):'';
 const folios=[...bookText.matchAll(/<section\b[^>]*data-ch="([^"]+)"[^>]*data-folio="(\d+)"/g)].filter(m=>m[1]===String(meta.number)).map(m=>Number(m[2]));
 for(const [i,file]of files.entries()){
  const html=fs.readFileSync(`${dir}/${file}`,'utf8');
  const page={file:`${dir}/${file}`,ordinal:i+1,folio:folios[i]??null};
  for(const m of html.matchAll(/<(figcaption|caption)\b[^>]*>([\s\S]*?)<\/\1>/gi)){
   const r=refs(clean(m[2]))[0];if(!r)continue;
   if(defs.has(r.key))duplicates.push({chapter:dir,key:r.key});else defs.set(r.key,{...page,caption:clean(m[2])});
  }
  const text=clean(html.replace(/<(figcaption|caption|svg)\b[^>]*>[\s\S]*?<\/\1>/gi,''));
  pages.push({...page,text});
 }
 for(const page of pages)for(const r of refs(page.text)){
  mentions++;const target=defs.get(r.key);
  if(!target){unresolved.push({chapter:dir,reference:r.key,file:page.file});continue;}
  const gap=target.ordinal-page.ordinal;
  if(gap>0)results.push({class:cls,subject:meta.subject,chapter:meta.number,title:meta.title,reference:r.key,gap,from:page.folio,to:target.folio,source:page.file,target:target.file,excerpt:page.text.slice(Math.max(0,r.index-100),r.index+180),caption:target.caption});
 }
}
const report={chapters,mentions,duplicates,unresolved,forward:results};
fs.writeFileSync('build/forward-reference-audit.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({chapters,mentions,duplicates,unresolved:unresolved.length,twoOrMore:results.filter(r=>r.gap>=2),nextPage:results.filter(r=>r.gap===1).length},null,2));
