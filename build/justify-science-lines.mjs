import fs from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
const run=promisify(execFile);
export async function justify(chapter){
 const base='build/'+chapter+'.html',probe=base.replace('.html','-justify.html');
 const script=`<script>addEventListener('load',async()=>{await document.fonts.ready;const out=[];for(const sheet of document.querySelectorAll('.food-sheet')){const corrections=[];for(const line of sheet.querySelectorAll('[data-justified]')){const gaps=[...line.querySelectorAll(':scope>tspan[dx]')],target=+line.getAttribute('x') + +line.dataset.justified;if(!gaps.length)continue;for(let pass=0;pass<2;pass++){const b=line.getBBox(),delta=(target-b.x-b.width)/gaps.length;for(const gap of gaps)gap.setAttribute('dx',(+gap.getAttribute('dx')+delta).toFixed(5));}corrections.push(gaps.map(g=>g.getAttribute('dx')));}out.push({page:sheet.closest('.page').dataset.folio,corrections});}document.title='WORDSPACING'+JSON.stringify(out);});</script>`;
 await fs.writeFile(probe,(await fs.readFile(base,'utf8')).replace('</head>',script+'</head>'));
 const {stdout}=await run('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--virtual-time-budget=10000','--dump-dom',pathToFileURL(path.resolve(probe)).href],{maxBuffer:64e6});
 await fs.unlink(probe);const raw=stdout.match(/WORDSPACING(.*?)<\/title>/s)?.[1];if(!raw)throw Error('Word spacing probe failed');
 const pages=JSON.parse(raw);let count=0;
 for(const {page,corrections} of pages){const file='pages/'+chapter+'/p'+String(page).padStart(3,'0')+'.html';let html=await fs.readFile(file,'utf8'),i=0;const values=corrections.flat();html=html.replace(/(<tspan dx=")[^"]+/g,(_,prefix)=>{if(i>=values.length)throw Error('Spacing count mismatch');return prefix+values[i++];});if(i!==values.length)throw Error('Missing spacing adjustments');count+=corrections.length;await fs.writeFile(file,html);}
 console.log('Justified '+count+' lines using rendered glyph bounds.');
}
