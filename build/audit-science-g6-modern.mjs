import fs from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const history='assets/design-history/science-g6-modern';
const selected=process.argv.slice(2);
const preservationFlag=selected.indexOf('--preserved');
const preservationFile=preservationFlag<0?history+'/preserved.json':selected.splice(preservationFlag,2)[1];
const chapters=JSON.parse(await fs.readFile(history+'/content.json','utf8')).filter(c=>!selected.length||selected.includes(String(c.config.number)));
const result=[];
for(const ch of chapters){
 const file=`build/class-6/${ch.dir}.html`,src=await fs.readFile(file,'utf8');
 const script=String.raw`<script>onload=async()=>{
 await document.fonts.ready;const pages=[],errors=[];
 for(const page of document.querySelectorAll('.page--g6-modern')){
  const folio=+page.dataset.folio,furniture=page.querySelector('.g6-furniture').getBoundingClientRect(),u=furniture.width/1052,body=page.querySelector('.g6-content'),br=body.getBoundingClientRect();
  const blocks=[...body.children],last=blocks.at(-1).getBoundingClientRect(),end=(last.bottom-furniture.top)/u;
  const report=(kind,data)=>errors.push({page:folio,kind,...data});
  if(end>1416)report('body-overflow',{end});
  for(const e of body.querySelectorAll('p,h2,h3,table,td,th,figcaption,.g6-panel')){
   const r=e.getBoundingClientRect();if(r.left<br.left-1||r.right>br.right+1)report('horizontal-overflow',{text:e.textContent.slice(0,75)});
  }
  const p=body.querySelector('p');if(p){const s=getComputedStyle(p);if(!s.fontFamily.includes('Source Serif 4')||s.textAlign!=='left')report('body-type',{font:s.fontFamily,align:s.textAlign});}
  for(const e of body.querySelectorAll('h2,h3')){
   const s=getComputedStyle(e);if(!s.fontFamily.includes('Source Sans 3')||s.fontVariantCaps!=='normal')report('heading-type',{font:s.fontFamily,caps:s.fontVariantCaps});
   if(e.getBoundingClientRect().bottom>last.bottom-32*u)report('detached-heading',{text:e.textContent});
  }
  for(const svg of body.querySelectorAll('.g6-art > svg')){
   const r=svg.getBoundingClientRect();
   for(const t of svg.querySelectorAll('text')){if(!t.textContent.trim())continue;const b=t.getBoundingClientRect();if(b.left<r.left-2||b.right>r.right+2||b.top<r.top-2||b.bottom>r.bottom+2)report('svg-label-bounds',{text:t.textContent.slice(0,80)});}
  }
  for(const e of page.querySelectorAll('.chapter-opener__title,.chapter-opener__number,.chapter-opener__label')){const r=e.getBoundingClientRect();if(r.left<furniture.left+40*u||r.right>furniture.right-40*u)report('opener-text-bounds',{text:e.textContent});}
  pages.push({page:folio,top:+((br.top-furniture.top)/u).toFixed(1),bottom:+end.toFixed(1),occupied:+((last.bottom-br.top)/(furniture.top+1415*u-br.top)*100).toFixed(1),blocks:blocks.map(b=>b.dataset.block)});
 }
 const images=[...new Set([...document.querySelectorAll('image,img')].map(e=>e.getAttribute('href')||e.getAttribute('src')))];
 await Promise.all(images.map(src=>new Promise(resolve=>{const i=new Image();i.onload=resolve;i.onerror=()=>{errors.push({kind:'missing-image',src});resolve();};i.src=src;})));
 document.body.textContent=JSON.stringify({pages,errors});
};</script>`;
 const probe=file.replace('.html','-audit-modern.html');await fs.writeFile(probe,src.replace('</body>',script+'</body>'));
 const {stdout}=await promisify(execFile)('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--virtual-time-budget=20000','--dump-dom',pathToFileURL(path.resolve(probe)).href],{maxBuffer:10e6});
 const raw=stdout.match(/<body[^>]*>([\s\S]*?)<\/body>/)[1];if(!raw.startsWith('{'))throw Error('Audit did not finish '+ch.dir);
 const audit=JSON.parse(raw.replaceAll('&amp;','&'));await fs.unlink(probe);
 const map=JSON.parse(await fs.readFile(`${history}/${ch.dir}/page-map.json`,'utf8'));
 audit.pages=audit.pages.map((p,i)=>({...p,role:map[i].role,protectedNext:map[i].protectedNext,breakReason:map[i].breakReason}));
 await fs.writeFile(`${history}/${ch.dir}/render-audit.json`,JSON.stringify(audit,null,2));
 console.log(ch.dir+': '+audit.pages.length+' pages, '+audit.errors.length+' issues');
 for(const e of audit.errors.slice(0,12))console.log(JSON.stringify(e));result.push({chapter:ch.dir,...audit});
}
const preserved=JSON.parse(await fs.readFile(preservationFile,'utf8')),changed=[];
for(const [file,hash]of Object.entries(preserved)){if(createHash('sha256').update(await fs.readFile(file)).digest('hex')!==hash)changed.push(file);}
console.log('Existing Class 7 sources, shared CSS and artwork changed: '+changed.length);
await fs.writeFile(history+'/audit-summary.json',JSON.stringify({chapters:result.map(c=>({chapter:c.chapter,pages:c.pages.length,issues:c.errors.length})),preservedChanges:changed},null,2));
if(changed.length||result.some(c=>c.errors.length))process.exitCode=1;
