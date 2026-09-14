import fs from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
const run=promisify(execFile),chapter=process.argv[2];
if(!chapter)throw Error('Supply a science chapter');
const built='build/'+chapter+'.html',probe=built.replace('.html','-prose-measure.html');
const script=`<script>addEventListener('load',async()=>{await document.fonts.ready;const pages=[];for(const sheet of document.querySelectorAll('.science-sheet')){const texts=[];for(const t of sheet.querySelectorAll('text[data-measure]')){const ls=[...t.querySelectorAll(':scope>tspan')];for(const line of ls.slice(0,-1)){if(line.textContent.trim().split(/\\s+/).length<3)continue;const nodes=[],walk=document.createTreeWalker(line,NodeFilter.SHOW_TEXT);while(walk.nextNode())nodes.push(walk.currentNode);for(const n of nodes){if(!/\\s/.test(n.textContent))continue;const frag=document.createDocumentFragment();for(const part of n.textContent.split(/(\\s+)/)){if(!part)continue;if(/^\\s+$/.test(part)){const gap=document.createElementNS('http://www.w3.org/2000/svg','tspan');gap.setAttribute('data-gap','');gap.setAttribute('dx','0');gap.textContent=part;frag.append(gap);}else frag.append(document.createTextNode(part));}n.replaceWith(frag);}const gaps=[...line.querySelectorAll('[data-gap]')];for(let j=0;j<2;j++){const b=line.getBBox(),d=(+line.getAttribute('x')+ +t.dataset.measure-b.x-b.width)/gaps.length;for(const g of gaps)g.setAttribute('dx',(+g.getAttribute('dx')+d).toFixed(5));}}texts.push(t.outerHTML);}pages.push({folio:sheet.closest('.page').dataset.folio,texts});}document.title='PROSE'+JSON.stringify(pages);});</script>`;
await fs.writeFile(probe,(await fs.readFile(built,'utf8')).replace('</head>',script+'</head>'));
const {stdout}=await run('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--virtual-time-budget=10000','--dump-dom',pathToFileURL(path.resolve(probe)).href],{maxBuffer:64e6});
await fs.unlink(probe);
const raw=stdout.match(/PROSE(.*?)<\/title>/s)?.[1];if(!raw)throw Error('No font measurement result');
const pages=JSON.parse(raw.replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>'));
for(const p of pages){const file='pages/'+chapter+'/p'+String(p.folio).padStart(3,'0')+'.html';let html=await fs.readFile(file,'utf8'),i=0;html=html.replace(/<text\b[^>]*data-measure="[^"]+"[^>]*>[\s\S]*?<\/text>/g,()=>p.texts[i++]);if(i!==p.texts.length)throw Error('Text count mismatch '+file);await fs.writeFile(file,html);}
console.log('Justified measured prose in '+pages.length+' pages');
