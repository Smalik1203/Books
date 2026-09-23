// One-time snapshot and extraction of the current, edited Class 6 printing sources.
// Never overwrite this baseline after migration.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
const history='assets/design-history/science-g6-modern';
await fs.mkdir(history,{recursive:true});
const remeasure=process.argv.includes('--remeasure');
if(!remeasure)try { await fs.access(history+'/source-pages.json'); throw Error('Baseline exists; do not overwrite.'); } catch(e) { if(e.code!=='ENOENT')throw e; }
const chapters=remeasure?JSON.parse(await fs.readFile(history+'/source-pages.json','utf8')):[];
if(!remeasure){
for(const dir of await fs.readdir('pages/class-6')){
 let config;try{config=JSON.parse(await fs.readFile(`pages/class-6/${dir}/chapter.json`,'utf8'));}catch{continue;}
 if(config.subject!=='Science')continue;
 const pages=[];for(const file of (await fs.readdir(`pages/class-6/${dir}`)).filter(f=>/^p\d+\.html$/.test(f)).sort())pages.push({file,html:await fs.readFile(`pages/class-6/${dir}/${file}`,'utf8')});
 chapters.push({dir,config,pages});
}
await fs.writeFile(history+'/source-pages.json',JSON.stringify(chapters,null,2));
const preserved={};
async function walk(dir){for(const e of await fs.readdir(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())await walk(p);else preserved[p]=createHash('sha256').update(await fs.readFile(p)).digest('hex');}}
await walk('pages/class-7');await walk('css');await walk('figures');
await fs.writeFile(history+'/preserved.json',JSON.stringify(preserved,null,2));
}
for(const ch of chapters){
 if(ch.config.number==='10')continue;
 const body=ch.pages.map(p=>p.html.replace(/<!-- botanical-header -->[\s\S]*?<!-- \/botanical-header -->/g,'').replace(/<!-- botanical-footer -->[\s\S]*?<!-- \/botanical-footer -->/g,'')).join('\n');
 const script=String.raw`onload=async()=>{await document.fonts.ready;const pages=[];for(const svg of document.querySelectorAll('svg.science-sheet')){
 const inv=svg.getScreenCTM().inverse();
 const box=e=>{const r=e.getBoundingClientRect(),a=new DOMPoint(r.left,r.top).matrixTransform(inv),b=new DOMPoint(r.right,r.bottom).matrixTransform(inv);return {x:a.x,y:a.y,w:b.x-a.x,h:b.y-a.y};};
 const words=e=>{if(e.nodeType===3)return e.textContent;let s=[...e.childNodes].map(words).join('');if(e.matches?.('tspan[x]'))s+=' ';if(e.matches?.('.se-bold,.term'))s='**'+s.trim()+'**';return s;};
 for(const e of svg.querySelectorAll('g > text,g > image,g > svg,g > path,g > circle'))e.setAttribute('data-original-bounds',JSON.stringify(box(e)));
 const node=e=>({tag:e.tagName,cls:e.getAttribute('class')||'',html:e.outerHTML,box:box(e),text:words(e).replace(/\s+/g,' ').trim(),texts:[...e.querySelectorAll('text')].map(t=>({text:words(t).replace(/\s+/g,' ').trim(),box:box(t),cls:t.getAttribute('class')||''})),href:e.getAttribute('href')});
 pages.push([...svg.children].map(node));}document.body.textContent=JSON.stringify(pages);};`;
 const probe=`build/class-6/${ch.dir}-extract.html`;
 await fs.writeFile(probe,`<html><meta charset="utf-8"><link rel="stylesheet" href="../../css/book.css"><link rel="stylesheet" href="../../css/reference-fonts.css"><link rel="stylesheet" href="../../css/food-reference.css"><link rel="stylesheet" href="../../css/science-editorial.css"><link rel="stylesheet" href="../../css/science-locked.css"><link rel="stylesheet" href="../../css/edition-science-tall.css"><body>${body}<script>${script}</script></body></html>`);
 const {stdout}=await promisify(execFile)('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--virtual-time-budget=5000','--dump-dom',pathToFileURL(path.resolve(probe)).href],{maxBuffer:30e6});
 const txt=stdout.match(/<body>([\s\S]*?)<\/body>/)[1].replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&');
 await fs.writeFile(history+`/nodes-${ch.config.number}.json`,JSON.stringify(JSON.parse(txt),null,2));await fs.unlink(probe);
 console.log(ch.dir+': '+ch.pages.length+' pages extracted');
}
