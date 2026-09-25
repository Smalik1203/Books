import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

export const root = path.resolve(import.meta.dirname, '..');
export function pageBlocks(html) {
  const open=/<div class="page__main">/.exec(html);assert(open,'Missing page body');
  // Ignore angle brackets inside TeX, and HTML comments, when counting tags.
  // The generic fragment helper treats bare mathematical < as an opening tag.
  const masked=html.replace(/\$\$[\s\S]*?\$\$|\$[^$]*?\$/g,m=>' '.repeat(m.length)).replace(/<!--[\s\S]*?-->/g,m=>' '.repeat(m.length));
  const tags=/<\/?[a-zA-Z][^>]*>/g;tags.lastIndex=open.index+open[0].length;
  const voids=new Set(['br','hr','img','input','meta','link','col','wbr','area','base','embed','source','track']);
  let depth=0,start=-1,out=[];
  for(let m;(m=tags.exec(masked));){
    const token=m[0],close=token.startsWith('</');
    const name=token.match(/^<\/?([\w-]+)/)[1].toLowerCase();
    if(close){if(depth===0)return out;depth--;if(depth===0){out.push(html.slice(start,tags.lastIndex));start=-1;}}
    else if(voids.has(name)||token.endsWith('/>')){if(depth===0)out.push(html.slice(m.index,tags.lastIndex));}
    else{if(depth===0)start=m.index;depth++;}
  }
  throw Error('Unbalanced page body');
}
export function readChapter(rel,fromBackup=false) {
  const dir=path.join(root,fromBackup?'build/_jee-backups':'pages',rel);
  const files=fs.readdirSync(dir).filter(f=>/^p1\d\d\.html$/.test(f)).sort();
  const blocks=files.flatMap(f=>pageBlocks(fs.readFileSync(path.join(dir,f),'utf8')));
  const start=blocks.findIndex(b=>b.includes('c-stage__title">Solved Examples'));
  const end=blocks.findIndex((b,i)=>i>start && /c-practice__num">3</.test(b));
  assert(start>=0 && end>start, `Stage boundaries: ${rel}`);
  return {dir,files,blocks,start,end,examples:blocks.slice(start+1,end).filter(b=>/^<div class="c-example"/.test(b))};
}
const labels=['Single correct','Multiple correct','Numerical answer','Matching'];
export function panel(n,type,q,options,steps,answer) {
  assert(labels.includes(type));
  if(type!=='Numerical answer') assert.equal(options.length,4);
  if(options?.length)assert.equal(new Set(options).size,4,'Duplicate options');
  const keyLetters=[...answer.matchAll(/\(([a-d])\)/g)].map(m=>m[1]);
  if(type==='Single correct'||type==='Matching')assert.equal(keyLetters.length,1,'A single-correct question needs one key');
  if(type==='Multiple correct')assert(keyLetters.length>=2&&keyLetters.length<=4,'Multiple-correct set needs all key letters');
  if(type==='Numerical answer')assert(Number.isFinite(Number(answer)),'Numerical answer must be a number');
  const fraction=s=>s.replace(/\$?(\d+)\/(\d+)\$?/g,(_,a,b)=>'$'+String.fromCharCode(92)+`frac{${a}}{${b}}$`);
  q=fraction(q);options=options?.map(fraction);steps=steps.map(fraction);answer=fraction(answer);
  const instruction=type==='Multiple correct'?'Select all correct options.':type==='Numerical answer'?'Enter the numerical value.':type==='Matching'?'Choose the correct combination.':'Choose one correct option.';
  const columns=options?.every(s=>s.length<17)?' c-parts--4':type==='Matching'||options?.every(s=>s.length<46)?'':' c-parts--1';
  return `<div class="c-example" data-question-type="${type}"><div class="c-example__tab">Example ${n} · ${type}</div><div class="c-example__body"><p>${q}</p><p><em>${instruction}</em></p>${options?.length?`<ol class="c-parts c-parts--alpha${columns}">${options.map(s=>`<li>${s}</li>`).join('')}</ol>`:''}<p><strong>Solution.</strong></p><div class="work">${steps.map((s,i)=>`<div class="work__row"><span class="work__label">Step ${i+1}</span><span>${s}</span></div>`).join('')}<div class="work__row"><span class="work__label">Answer</span><span>${answer}</span></div></div></div></div>`;
}
export function matching(n,left,right,map,steps,position=0) {
  assert.equal(new Set(map).size,4); assert(map.every(x=>x>=1&&x<=4));
  const variants=[map,[map[1],map[0],map[2],map[3]],[map[0],map[2],map[1],map[3]],[map[3],map[1],map[2],map[0]]];
  [variants[0],variants[position]]=[variants[position],variants[0]];
  const fmt=m=>m.map((v,i)=>`${'PQRS'[i]}–${v}`).join(', ');
  const table=`Match List I with List II.</p><table><thead><tr><th>List I</th><th>List II</th></tr></thead><tbody>${left.map((x,i)=>`<tr><td>(${'PQRS'[i]}) ${x}</td><td>(${i+1}) ${right[i]}</td></tr>`).join('')}</tbody></table><p>Each entry has exactly one match.`;
  return panel(n,'Matching',table,variants.map(fmt),steps,`(${'abcd'[position]}) ${fmt(map)}`);
}
export function writeChapter(rel,questions) {
  assert.equal(questions.length,15);
  for(const [type,count] of [['Single correct',6],['Multiple correct',4],['Numerical answer',3],['Matching',2]]) assert.equal(questions.filter(q=>q.includes(`data-question-type="${type}"`)).length,count);
  const backup=path.join(root,'build','_jee-backups',rel);
  const fromBackup=fs.existsSync(backup);
  const c=readChapter(rel,fromBackup);
  const targetDir=path.join(root,'pages',rel);
  const blocks=[...c.blocks.slice(0,c.start+1),...questions,...c.blocks.slice(c.end)];
  // Preserve both untouched stages byte-for-byte as blocks. Initial pages are
  // deliberately conservative; refit measures and packs the whole bridge.
  const pages=[]; let current=[];
  for(const b of blocks) {
    if(current.length && (/^<div class="c-example"/.test(b)|| /c-stage__title">Answers/.test(b))) {pages.push(current);current=[];}
    current.push(b);
    if(/^<div class="c-example"/.test(b)){pages.push(current);current=[];}
  }
  if(current.length)pages.push(current);
  // Keep original non-example blocks on their existing grouping by letting the
  // builder's refit split practice lists and repack; source snapshot aids review.
  fs.mkdirSync(backup,{recursive:true});
  for(const f of c.files)if(!fs.existsSync(path.join(backup,f)))fs.copyFileSync(path.join(c.dir,f),path.join(backup,f));
  for(const f of fs.readdirSync(targetDir).filter(f=>/^p1\d\d\.html$/.test(f)))fs.unlinkSync(path.join(targetDir,f));
  pages.forEach((bs,i)=>fs.writeFileSync(path.join(targetDir,`p${101+i}.html`),`<section class="page" data-bridge><div class="page__body"><div class="page__main">\n${bs.join('\n\n')}\n</div></div></section>\n`));
  console.log(`${rel}: installed 15 examples (6/4/3/2)`);
}
