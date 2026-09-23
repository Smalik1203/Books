import fs from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
const chapters=process.argv.length>2?process.argv.slice(2):[...(JSON.parse(await fs.readFile('assets/design-history/science-g6-modern/content.json','utf8'))).filter(c=>Number(c.config.number)<=4).map(c=>'class-6/'+c.dir),'class-7/ch01-ever-evolving-world-of-science-v2','class-7/ch02-exploring-substances','class-7/ch03-electricity-circuits','class-7/ch04-metals-non-metals','class-7/ch05-physical-chemical-changes','class-7/ch06-adolescence'];
const results=[];
for(const chapter of chapters){
 const file='build/'+chapter+'.html',html=await fs.readFile(file,'utf8');
 const script=`<script>onload=async()=>{await document.fonts.ready;const art=document.querySelector('[data-header-art]'),svg=art.ownerSVGElement,u=svg.getBoundingClientRect().width/1052,root=svg.getBoundingClientRect(),errors=[];const items=[...art.querySelectorAll('[data-art-element]')];if(items.length<3)errors.push('Too few elements');const titles=[...document.querySelectorAll('.chapter-opener__title')].map(t=>t.getBoundingClientRect());for(const e of [...items,...art.querySelectorAll('.science-header-art__trail')]){const r=e.getBoundingClientRect();const rightColumn=Math.max(root.left+880*u,...titles.map(t=>t.right+24*u));if(r.left<rightColumn)errors.push('Outside right artwork column: '+e.dataset.artElement);if(r.left<root.left||r.right>root.right||r.top<root.top||r.bottom>root.top+296*u)errors.push('Outside header: '+e.dataset.artElement);if(titles.some(t=>r.left<t.right+8*u&&r.right>t.left-8*u&&r.top<t.bottom+8*u&&r.bottom>t.top-8*u))errors.push('Title clearance: '+e.dataset.artElement);}document.body.textContent=JSON.stringify({elements:items.length,errors});};</script>`;
 const probe=file.replace('.html','-header-check.html');await fs.writeFile(probe,html.replace('</body>',script+'</body>'));
 const {stdout}=await promisify(execFile)('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--virtual-time-budget=10000','--dump-dom',pathToFileURL(path.resolve(probe)).href],{maxBuffer:15e6});
 const result=JSON.parse(stdout.match(/<body[^>]*>([\s\S]*?)<\/body>/)[1]);await fs.unlink(probe);results.push({chapter,...result});console.log(chapter+': '+JSON.stringify(result));
}
await fs.writeFile('assets/design-history/science-header-art-audit.json',JSON.stringify(results,null,2));
if(results.some(r=>r.errors.length))process.exitCode=1;
