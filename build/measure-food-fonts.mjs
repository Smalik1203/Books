import { readFile, writeFile, readdir } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dir=path.join(root,'assets/food-reference');
const words=new Set();
for (const file of await readdir(path.join(dir,'ocr'))) {
  const data=JSON.parse((await readFile(path.join(dir,'ocr',file),'utf8')).replace(/^\uFEFF/,''));
  for(const line of data.lines) for(const word of line.words) words.add(word.text);
}
const input=JSON.stringify([...words]).replace(/</g,'\\u003c');
const html=`<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="../../css/food-reference.css"><body><pre id="result"></pre><script>
Promise.all([document.fonts.load('400 100px "Food Poppins"'),document.fonts.load('700 100px "Food Poppins"')]).then(()=>{
const ctx=document.createElement('canvas').getContext('2d'); const result={};
for(const weight of [400,700]){ ctx.font=weight+' 100px "Food Poppins"'; for(const word of ${input}){const m=ctx.measureText(word);result[weight+'|'+word]={ascent:m.actualBoundingBoxAscent,descent:m.actualBoundingBoxDescent,width:m.width};}}
document.getElementById('result').textContent=JSON.stringify(result);
});</script>`;
const temp=path.join(root,'tmp/pdfs/food-fonts.html');
await writeFile(temp,html);
const chrome=process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const {stdout}=await promisify(execFile)(chrome,['--headless=new','--disable-gpu','--virtual-time-budget=8000','--dump-dom','file:///'+temp.replace(/\\/g,'/')],{maxBuffer:32*1024*1024});
const value=stdout.match(/<pre id="result">([\s\S]*?)<\/pre>/)?.[1];
if(!value)throw new Error('Font metrics did not render');
const decoded=value.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
JSON.parse(decoded);
await writeFile(path.join(dir,'font-metrics.json'),decoded);
console.log('Measured both font weights for '+words.size+' distinct words.');
