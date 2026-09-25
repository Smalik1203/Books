import fs from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {sheetMetrics,px} from './sheet.mjs';
import {windowPad} from './viewport.mjs';
import {cropHeight} from './png.mjs';
const rel=process.argv[2], number=Number(process.argv[3]||1);
const folio=process.argv.find(a=>a.startsWith('--folio='))?.split('=')[1];
const root=path.resolve(import.meta.dirname,'..');
const file=path.join(root,'build',rel+'.html');
const meta=JSON.parse(await fs.readFile(path.join(root,'pages',rel,'chapter.json'),'utf8'));
let html=await fs.readFile(file,'utf8');let seen=false;
html=html.replace(/<section class="page[\s\S]*?<\/section>/g,s=>{
  if(folio?s.includes(`data-folio="${folio}"`):s.includes(`Example ${number} · `)){seen=true;return s;}
  return '';
});
if(!seen)throw Error('Example not found');
html=html.replace('</head>','<style>body{margin:0;background:white}.spread{padding:0;gap:0;display:block}.page{margin:0;box-shadow:none}</style></head>');
const temp=path.join(path.dirname(file),'_jee-proof.html');await fs.writeFile(temp,html);
const out=path.join(root,'build','_jee-checks',`${rel.replaceAll('/','-')}-${folio?'page-'+folio:'example-'+number}.png`);
const chrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
const sheet=await sheetMetrics(root,meta.edition);
await promisify(execFile)(chrome,['--headless=new','--disable-gpu','--hide-scrollbars','--force-device-scale-factor=2',`--window-size=${px(sheet.trimW)},${px(sheet.trimH)+await windowPad(chrome)}`,'--virtual-time-budget=5000',`--screenshot=${out}`,'file:///'+temp.replaceAll('\\','/')],{maxBuffer:1<<24});
await cropHeight(out,px(sheet.trimH)*2);await fs.rm(temp);console.log(out);
