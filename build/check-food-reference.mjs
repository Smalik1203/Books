/* The ordinary fill probe sees the SVG sheet, not the text inside it.
   Check the actual printed glyph bounds separately. */
import { readFile, writeFile, access } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const built=path.join(root,'build/class-6/ch03-food-on-our-plate.html');
const html=await readFile(built,'utf8');
const assets=[...new Set([...html.matchAll(/<image href="([^"]+)"/g)].map(m=>m[1]))];
for(const asset of assets)await access(path.resolve(path.dirname(built),asset));
const probe=`<script>window.addEventListener('load',async()=>{
await document.fonts.ready;
const result={pages:0,words:0,clipped:[],overlaps:[]};
const ctx=document.createElement('canvas').getContext('2d');
for(const svg of document.querySelectorAll('.food-sheet')){
 result.pages++; const p=svg.closest('.page').dataset.referencePage;
 const vb=svg.viewBox.baseVal; const inverse=svg.getScreenCTM().inverse();
 const texts=[...svg.querySelectorAll('text')].map(el=>{
  result.words++; const b=el.getBBox(), t=el.getScreenCTM();
  const style=getComputedStyle(el); ctx.font=style.fontWeight+' '+style.fontSize+' '+style.fontFamily;
  const ink=ctx.measureText(el.textContent); b.y=-ink.actualBoundingBoxAscent; b.height=ink.actualBoundingBoxAscent+ink.actualBoundingBoxDescent;
  const tl=new DOMPoint(b.x,b.y).matrixTransform(t).matrixTransform(inverse);
  const br=new DOMPoint(b.x+b.width,b.y+b.height).matrixTransform(t).matrixTransform(inverse);
  if(tl.x<-.5||tl.y<-.5||br.x>vb.width+.5||br.y>vb.height+.5)result.clipped.push({page:p,text:el.textContent});
  return {text:el.textContent,x:tl.x,y:tl.y,right:br.x,bottom:br.y};
 });
 for(let i=0;i<texts.length;i++)for(let j=i+1;j<texts.length;j++){
  const a=texts[i],b=texts[j]; const w=Math.min(a.right,b.right)-Math.max(a.x,b.x),h=Math.min(a.bottom,b.bottom)-Math.max(a.y,b.y);
  if(w>3 && h>3 && w*h>Math.min((a.right-a.x)*(a.bottom-a.y),(b.right-b.x)*(b.bottom-b.y))*.35)
   result.overlaps.push({page:p,a:a.text,b:b.text});
 }
}
document.title='FOODCHECK'+JSON.stringify(result);
});</script>`;
const temp=built.replace('.html','-qa.html');
await writeFile(temp,html.replace('</head>',probe+'</head>'));
const chrome=process.env.CHROME||'C:/Program Files/Google/Chrome/Application/chrome.exe';
const {stdout}=await promisify(execFile)(chrome,['--headless=new','--disable-gpu','--virtual-time-budget=12000','--dump-dom','file:///'+temp.replace(/\\/g,'/')],{maxBuffer:64*1024*1024});
const raw=stdout.match(/FOODCHECK(\{.*?\})<\/title>/s)?.[1];
if(!raw)throw new Error('Rendered text check did not report');
const result=JSON.parse(raw.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>'));
result.illustrations=assets.length;
await writeFile(path.join(root,'assets/food-reference/render-check.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
if(result.pages!==28||result.clipped.length||result.overlaps.length)process.exitCode=1;
