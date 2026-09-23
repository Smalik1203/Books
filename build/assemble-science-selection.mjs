// A separate combined edition. Chapter sources and standalone PDFs stay untouched.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
import {sheetMetrics} from './sheet.mjs';
const run=promisify(execFile),root=process.cwd(),scratch=path.resolve('tmp/pdfs/science-selection');
await fs.mkdir(scratch,{recursive:true});
const chapters=[],preserved={};
for(const grade of [6,7]){
 for(const dir of await fs.readdir(`pages/class-${grade}`)){
  const folder=`pages/class-${grade}/${dir}`;
  let meta;try{meta=JSON.parse(await fs.readFile(folder+'/chapter.json','utf8'));}catch{continue;}
  if(meta.subject!=='Science'||Number(meta.number)>(grade===6?4:6))continue;
  const files=(await fs.readdir(folder)).filter(f=>/^p\d+\.html$/.test(f)).sort();
  for(const f of [...files,'chapter.json'])preserved[folder+'/'+f]=createHash('sha256').update(await fs.readFile(folder+'/'+f)).digest('hex');
  chapters.push({grade,number:Number(meta.number),title:meta.title,chapter:`class-${grade}/${dir}`,count:files.length});
 }
}
chapters.sort((a,b)=>a.grade-b.grade||a.number-b.number);
const frontPages=4;
let next=1;
for(const [i,c] of chapters.entries()){
 c.start=next;c.end=next+c.count-1;next=c.end+1;
 if(i<chapters.length-1&&next%2===0){c.review=next;next++;}
 if(c.start%2!==1)throw Error('Chapter must begin on a recto');
}
const metrics=await sheetMetrics(root,'science-tall');
await fs.writeFile(scratch+'/manifest.json',JSON.stringify({chapters,frontPages,numberedPages:next-1,pages:frontPages+next-1,metrics,preserved},null,2));
for(const c of chapters){
 const built=await run(process.execPath,['build/build.mjs',c.chapter],{maxBuffer:8e6});
 if(/(?:! page|design violation|overruns by)/i.test(built.stdout+built.stderr))throw Error(built.stdout+built.stderr);
 const source=path.resolve('build/'+c.chapter+'.html');
 let html=await fs.readFile(source,'utf8'),count=0;
 html=html.replace('<head>','<head><base href="'+pathToFileURL(source).href+'">');
 html=html.replace(/<section class="page[\s\S]*?<\/section>/g,section=>{
  const n=c.start+count++;
  return section.replace(/data-folio="\d+"/,`data-folio="${n}"`)
   .replace(/(<span class="pagefoot__folio">)\d+(<\/span>)/g,(_,a,b)=>a+n+b)
   .replace(/(<text\b[^>]*class="v2-folio\b[^\"]*"[^>]*>)\d+(<\/text>)/g,(_,a,b)=>a+n+b)
   .replace(/(aria-label="[^"]*, page )\d+(")/g,(_,a,b)=>a+n+b);
 });
 if(count!==c.count)throw Error('Unexpected page count '+c.chapter);
 const name=`${scratch}/class-${c.grade}-chapter-${c.number}`;
 await fs.writeFile(name+'.html',html);
 await run('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--no-pdf-header-footer','--print-to-pdf-no-header','--virtual-time-budget=15000','--print-to-pdf='+name+'.pdf',pathToFileURL(name+'.html').href],{maxBuffer:8e6});
 console.log(`Class ${c.grade}, chapter ${c.number}: ${c.start}-${c.end}${c.review?'; review '+c.review:''}`);
}
for(const [file,hash] of Object.entries(preserved))if(createHash('sha256').update(await fs.readFile(file)).digest('hex')!==hash)throw Error('Chapter source changed: '+file);
console.log('Chapter sources preserved. Ready to bind '+(frontPages+next-1)+' pages, with '+(next-1)+' numbered chapter pages.');
