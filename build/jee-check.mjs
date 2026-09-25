// Shared engine for check-jee-classN.mjs: arithmetic helpers, and run(),
// which checks a class's 15 examples per chapter against its records.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {readChapter,pageBlocks} from './jee-tools.mjs';
export const gcd=(a,b)=>b?gcd(b,a%b):a, hcf=(...n)=>n.reduce(gcd), lcm=(...n)=>n.reduce((a,b)=>a*b/gcd(a,b));
export const divides=(d,n)=>n%d===0, isSquare=n=>Number.isInteger(Math.sqrt(n));
export const ev=s=>Function(`return (${s.replaceAll('−','-').replaceAll('×','*').replaceAll('÷','/')})`)();
export const num=s=>Number(s.replaceAll(',',''));
export const round=(n,to)=>Math.round(n/to)*to;
export const pick=(opts,ok)=>opts.map((o,i)=>ok(o)?'abcd'[i]:'').join('');
// The value in List I that each List II entry must match, as a permutation.
export const matchMap=(left,right)=>left.map(l=>{const i=right.findIndex(r=>r===l);assert(i>=0&&right.indexOf(l,i+1)<0,`match ${l}`);return i+1;});
// An expression in letters, as printed ($3(a - b)$, $4p + 3n$), evaluated at given values.
export const alg=(s,v)=>{let e=s.replaceAll('$','').replaceAll('−','-').replaceAll('×','*');
  for(let k=0;k<3;k++)e=e.replace(/(\d|\))\s*([a-z(])/g,'$1*$2').replace(/([a-z])([a-z(])/g,'$1*$2');
  return Function(...Object.keys(v),`return (${e})`)(...Object.values(v));};
export const same=(x,y,names)=>[[1,2,3],[-4,7,2],[5,-3,11],[0,1,-6]].every(t=>{const v=Object.fromEntries(names.map((n,i)=>[n,t[i]]));return Math.abs(alg(x,v)-alg(y,v))<1e-9;});
export const close=(a,b)=>Math.abs(a-b)<1e-9;
export const virahanka=n=>{const v=[1,2];while(v.length<n)v.push(v.at(-1)+v.at(-2));return v[n-1];};
export const tri=(a,b,c)=>a+b>c&&a+c>b&&b+c>a;
export const fr=s=>ev(String(s).replace(/(\d+)\/(\d+)/g,'($1/$2)'));
// A congruence written as a correspondence of vertices: 'ABC','FED' maps A→F, B→E, C→D.
export const corr=(a,b)=>Object.fromEntries([...a].map((v,i)=>[v,b[i]]));
export const img=(m,s)=>[...s].map(c=>m[c]??c).join('');
export const same2=(x,y)=>x===y||x===[...y].reverse().join('');
export const mean=a=>a.reduce((x,y)=>x+y)/a.length;
export const median=a=>{const s=[...a].sort((x,y)=>x-y),n=s.length;return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;};
export const leap=y=>y%4===0&&(y%100!==0||y%400===0);
export const terminates=(p,q)=>{q/=gcd(p,q);while(q%2===0)q/=2;while(q%5===0)q/=5;return q===1;};
// Solutions of a linear equation in one letter, searched over a grid of values.
export const solve=(eq,x='x')=>{const [l,r]=eq.replaceAll('$','').split('=');const out=[];
  for(let k=-4000;k<=4000;k++){const v={[x]:k/20};if(close(alg(l.replace(/\\frac\{(\w)\}\{(\d+)\}/g,'($1/$2)'),v),alg(r.replace(/\\frac\{(\w)\}\{(\d+)\}/g,'($1/$2)'),v)))out.push(k/20);}return out;};
export const domino=(rows,cols,removed=[])=>{const dark=(r,c)=>(r+c)%2===0;let d=0,l=0;
  for(let r=1;r<=rows;r++)for(let c=1;c<=cols;c++)if(!removed.some(([a,b])=>a===r&&b===c))dark(r,c)?d++:l++;return d===l;};
const strip=s=>s.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
export function run(cls,records,only=process.argv[2]){
let checked=0;
for(const [name,{singles,multis,numbers,verify}] of Object.entries(records)){
  if(only&&only!==name)continue;
  const rel=cls+"/"+name,c=readChapter(rel);
  assert.equal(c.examples.length,15,rel);
  const types=c.examples.map(e=>e.match(/data-question-type="([^"]+)"/)?.[1]);
  assert.deepEqual(types,[...Array(6).fill('Single correct'),...Array(4).fill('Multiple correct'),...Array(3).fill('Numerical answer'),...Array(2).fill('Matching')],rel);
  c.examples.forEach((e,i)=>{
    assert(e.includes(`Example ${i+1} · `),`${rel}: numbering`);
    const answer=strip(e.match(/<span class="work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span>/)?.[1]||'');
    const key=[...answer.matchAll(/\(([a-d])\)/g)].map(m=>m[1]).join('');
    if(i<6)assert.equal(key,singles[i],`${rel} example ${i+1}`);
    else if(i<10)assert.equal(key,multis[i-6],`${rel} example ${i+1}`);
    else if(i<13)assert(close(Number(answer),numbers[i-10]),`${rel} example ${i+1}: ${answer} vs ${numbers[i-10]}`);
    if(i<10||i>=13){
      const opts=e.match(/<ol class="c-parts[^>]*>([\s\S]*?)<\/ol>/)?.[1];
      assert(opts,`${rel}: options missing`);
      const items=[...opts.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m=>strip(m[1]));
      assert.equal(items.length,4);assert.equal(new Set(items).size,4);
      if(i<6)assert(answer.endsWith(items['abcd'.indexOf(key)]),`${rel} example ${i+1}: answer text is not option ${key}`);
      if(i>=13){
        const selected=items['abcd'.indexOf(key)];
        assert.equal(answer.slice(4),selected,`${rel}: matching key`);
        assert.equal(new Set([...selected.matchAll(/[PQRS]–([1-4])/g)].map(m=>m[1])).size,4);
      }
    }
    checked++;
  });
  verify();
  // Stage 1 and everything from Practice on must match the pre-edit snapshot.
  const oldDir=path.join('build','_jee-backups',rel);
  const old=fs.readdirSync(oldDir).filter(f=>/^p1\d\d\.html$/.test(f)).sort().flatMap(f=>pageBlocks(fs.readFileSync(path.join(oldDir,f),'utf8')));
  const start=old.findIndex(b=>b.includes('c-stage__title">Solved Examples'));
  assert.equal(strip(old.slice(0,start).join('')),strip(c.blocks.slice(0,c.start).join('')),`${rel}: Stage 1 changed`);
  const end=old.findIndex((b,i)=>i>start&&/c-practice__num">3</.test(b));
  const normalize=s=>strip(s.replace(/<div class="c-practice__head">[\s\S]*?<\/div>/g,''));
  assert.equal(normalize(old.slice(end).join('')),normalize(c.blocks.slice(c.end).join('')),`${rel}: practice or answers changed`);
  console.log(`${rel}: 15 examples; keys, options, numerical answers, matching and preserved stages checked`);
}
console.log(`PASS: ${checked} ${cls.replace("class-","Class ")} solved examples. Prose and geometric statements also need editorial review.`);
}
