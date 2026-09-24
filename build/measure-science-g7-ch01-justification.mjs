// Finish word-space placement against the browser's actual glyph bounds.
// Canvas advance widths alone miss the small overhang on letters such as f.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
export async function measureChapter1Justification(){
 const dir='pages/class-7/ch01-ever-evolving-world-of-science-v2';
 const files=(await fs.readdir(dir)).filter(f=>/^p\d+\.html$/.test(f)).sort();
 const sources=await Promise.all(files.map(f=>fs.readFile(dir+'/'+f,'utf8')));
 const probe='build/class-7/ch01-word-space-measure.html';
 const sheets=['book','edition-science-tall','palette-science-v2-g7-ch01','reference-fonts','food-reference','science-reference','science-editorial','science-locked','science-v2-fonts','science-v2'];
 const script=String.raw`<script>onload=async()=>{try{
  await document.fonts.ready;const result=[];
  for(const page of document.querySelectorAll('.page')){
   for(const line of page.querySelectorAll('[data-justify-width]')){
    const gaps=[...line.querySelectorAll(':scope > tspan[dx]')];
    const target=+line.getAttribute('x')+ +line.dataset.justifyWidth;
    for(let pass=0;pass<3;pass++){
     const b=line.getBBox(),delta=(target-b.x-b.width)/gaps.length;
     if(!Number.isFinite(delta))throw Error('A justified line needs word gaps');
     for(const gap of gaps)gap.setAttribute('dx',(+gap.getAttribute('dx')+delta).toFixed(5));
    }
    const space=+line.dataset.naturalSpace;
    if(!Number.isFinite(space)||space<=0)throw Error('Missing natural word-space measurement');
    const extra=+gaps[0].getAttribute('dx');
    line.dataset.extraSpace=extra.toFixed(5);
    line.dataset.spaceRatio=((space+extra)/space).toFixed(3);
   }
   result.push([...page.querySelectorAll('text[data-prose-align]')].map(e=>e.outerHTML));
  }
  document.title='SPACES'+JSON.stringify(result);
 }catch(e){document.title='SPACE_ERROR'+e.message;}};</script>`;
 await fs.mkdir(path.dirname(probe),{recursive:true});
 await fs.writeFile(probe,`<!doctype html><html><head><meta charset="utf-8">${sheets.map(s=>`<link rel="stylesheet" href="../../css/${s}.css">`).join('')}${script}</head><body>${sources.join('\n')}</body></html>`);
 let stdout;
 try{({stdout}=await promisify(execFile)(process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--virtual-time-budget=10000','--dump-dom',pathToFileURL(path.resolve(probe)).href],{maxBuffer:32e6}));}finally{await fs.unlink(probe);}
 const raw=stdout.match(/<title>SPACES(.*?)<\/title>/s)?.[1];if(!raw)throw Error(stdout.match(/<title>(.*?)<\/title>/s)?.[1]||'No word-space measurements');
 const result=JSON.parse(raw.replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>'));
 if(result.length!==files.length)throw Error('Word-space measurement lost a page');
 for(let p=0;p<files.length;p++){
  let i=0;const after=sources[p].replace(/<text\b[^>]*data-prose-align="justify"[^>]*>[\s\S]*?<\/text>/g,()=>result[p][i++]);
  if(i!==result[p].length)throw Error('Word-space text count mismatch');
  if(after!==sources[p])await fs.writeFile(dir+'/'+files[p],after);
 }
}
