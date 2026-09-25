import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const names=['ember','bronze','olive','lagoon','cobalt','indigo','moss','fern','emerald','teal','violet','amethyst','mulberry','garnet'];
const rel='_print-samples/textbook-colours',dir=`pages/${rel}`;
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(`${dir}/chapter.json`,JSON.stringify({class:'7',number:'1',title:'Patterns in Numbers · Colour Print Sample',subject:'Mathematics I',edition:'196x276',palette:'cobalt',startFolio:1},null,2));
const lesson=(name,n)=>`<div class="c-figure-context" data-palette="${name}">
<h2><span class="badge">${n}</span><span class="name">Patterns in Numbers · ${name[0].toUpperCase()+name.slice(1)}</span></h2>
<p>A number sequence follows a rule. Look at the numbers below. Each new term is found by adding 3 to the previous term.</p>
<table><caption>Table ${n}.1 A growing number sequence</caption><thead><tr><th>Term</th><th>First</th><th>Second</th><th>Third</th><th>Fourth</th></tr></thead><tbody><tr><th>Value</th><td>3</td><td>6</td><td>9</td><td>12</td></tr></tbody></table>
<div class="c-example"><div class="c-example__tab">Example ${n}</div><div class="c-example__body"><p>What are the next two terms of $3, 6, 9, 12, \\ldots$?</p><p><strong>Solution.</strong> Add 3 each time: $12 + 3 = 15$ and $15 + 3 = 18$. The next two terms are <strong>15 and 18</strong>.</p></div></div>
<div class="c-reflect"><div class="c-reflect__box"><div class="c-reflect__mark">?</div><div class="c-reflect__title">Think and Reflect</div><div class="c-reflect__body"><p>Will 100 appear in this sequence? Explain how you can decide without writing every term.</p></div></div></div>
<div class="c-practice"><div class="c-practice__head">Practice Questions</div><ol class="c-questions"><li>Write the next three terms of $5, 10, 15, 20, \\ldots$.</li><li>Find the tenth term of the sequence in Table ${n}.1.</li></ol></div>
</div>`;
for(let i=0;i<7;i++){
 const top=lesson(names[i*2],i*2+1).replace(/<div class="c-reflect">[\s\S]*?(?=<div class="c-practice">)/,'');
 const bottom=lesson(names[i*2+1],i*2+2).replace(/<table>[\s\S]*?<\/table>/,'').replace(/the sequence in Table \d+\.1/,'the sequence $3, 6, 9, 12, ...$');
 fs.writeFileSync(`${dir}/p${String(i+1).padStart(3,'0')}.html`,`<section class="page"><div class="page__body"><div class="page__main">${top}${bottom}</div></div></section>`);
}
let r=spawnSync(process.execPath,['build/build.mjs',rel],{stdio:'inherit'});if(r.status)process.exit(r.status);
const file=`build/${rel}.html`;let html=fs.readFileSync(file,'utf8');
const css=names.map(n=>fs.readFileSync(`css/palette-${n}.css`,'utf8').replace(':root',`[data-palette="${n}"]`)).join('\n');
html=html.replace('</head>',`<style>${css}</style></head>`);
fs.writeFileSync(file,html);
fs.mkdirSync('output/pdf',{recursive:true});
const path=fs.realpathSync('output/pdf').replaceAll('\\','/')+'/ClassBridge-Textbook-Colour-Sample.pdf';
r=spawnSync('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--no-pdf-header-footer','--virtual-time-budget=5000',`--print-to-pdf=${path}`,'file:///'+fs.realpathSync(file).replaceAll('\\','/')],{encoding:'utf8'});
if(r.status)throw Error(r.stderr);console.log(path);
