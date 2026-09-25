import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {readChapter,pageBlocks} from './jee-tools.mjs';
const sum=n=>n*(n+1)/2;
const countFactors=n=>Array.from({length:n},(_,i)=>i+1).filter(d=>n%d===0).length;
const records=[
['math-ch01-patterns','bdacbd',['ac','bcd','ad','abd'],[25**2,15**2-5**2,6]],
['math-ch02-lines-and-angles','bcb dac'.replaceAll(' ',''),['acd','bc','abd','acd'],[360/15,152/4,360-75-88-109]],
['math-ch03-number-play','babdbb',['abd','abc','acd','abd'],[Array.from({length:9},(_,i)=>i+1).filter(a=>12-2*a>=0&&12-2*a<=9).length,125+4*(305-125)/6,22%4]],
['math-ch04-data-handling','cacdbd',['abd','acd','abd','bcd'],[84/7*4,45-9-14-8,42/6]],
['math-ch05-prime-time','cabdba',['ac','abc','acd','acd'],[countFactors(72),36+1,Math.floor(999/72)*72]],
['math-ch06-perimeter-and-area','abcdca',['abc','acd','acd','acd'],[5*2*(85+45),14*11-5*4,104/8]],
['math-ch07-fractions','cabdba',['abd','ac','abd','abc'],[48*3/8,7*(84/12),6/(3/4)]],
['math-ch08-constructions','cab cdb'.replaceAll(' ',''),['acd','acd','ac','ad'],[34/4,46/2-8,1]],
['math-ch09-symmetry','bbdbca',['bcd','abd','ad','abd'],[360/24,3+4+6,13/2]],
['math-ch10-other-side-of-zero','accabd',['acd','abcd','abd','abd'],[-7+18,6-(-8)-1,13-8+6]],
];
const strip=s=>s.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
let checked=0;
for(const [name,singles,multis,numbers] of records){
  const rel='class-6/'+name,c=readChapter(rel);
  assert.equal(c.examples.length,15,rel);
  const types=c.examples.map(e=>e.match(/data-question-type="([^"]+)"/)?.[1]);
  assert.deepEqual(types,[...Array(6).fill('Single correct'),...Array(4).fill('Multiple correct'),...Array(3).fill('Numerical answer'),...Array(2).fill('Matching')],rel);
  c.examples.forEach((e,i)=>{
    assert(e.includes(`Example ${i+1} · `),`${rel}: numbering`);
    const answer=strip(e.match(/<span class="work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span>/)?.[1]||'');
    const key=[...answer.matchAll(/\(([a-d])\)/g)].map(m=>m[1]).join('');
    if(i<6)assert.equal(key,singles[i],`${rel} example ${i+1}`);
    else if(i<10)assert.equal(key,multis[i-6],`${rel} example ${i+1}`);
    else if(i<13)assert.equal(Number(answer),numbers[i-10],`${rel} example ${i+1}`);
    if(i<10||i>=13){
      const opts=e.match(/<ol class="c-parts[^>]*>([\s\S]*?)<\/ol>/)?.[1];
      assert(opts,`${rel}: options missing`);
      const items=[...opts.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m=>strip(m[1]));
      assert.equal(items.length,4);assert.equal(new Set(items).size,4);
      if(i>=13){
        const selected=items['abcd'.indexOf(key)];
        assert.equal(answer.slice(4),selected,`${rel}: matching key`);
        assert.equal(new Set([...selected.matchAll(/[PQRS]–([1-4])/g)].map(m=>m[1])).size,4);
      }
    }
    checked++;
  });
  // Compare unchanged prose and questions with the pre-edit snapshot. Refit may
  // split question lists; compare text and omit generated continuation bands.
  const oldDir=path.join('build','_jee-backups',rel);
  const old=fs.readdirSync(oldDir).filter(f=>/^p1\d\d\.html$/.test(f)).sort().flatMap(f=>pageBlocks(fs.readFileSync(path.join(oldDir,f),'utf8')));
  const start=old.findIndex(b=>b.includes('c-stage__title">Solved Examples'));
  assert.equal(strip(old.slice(0,start).join('')),strip(c.blocks.slice(0,c.start).join('')),`${rel}: Stage 1 changed`);
  const end=old.findIndex((b,i)=>i>start&&/c-practice__num">3</.test(b));
  const normalize=s=>strip(s.replace(/<div class="c-practice__head">[\s\S]*?<\/div>/g,''));
  assert.equal(normalize(old.slice(end).join('')),normalize(c.blocks.slice(c.end).join('')),`${rel}: practice or answers changed`);
  console.log(`${rel}: 15 examples; keys, numeric calculations, options, matching permutations and Stage 1 checked`);
}
assert.equal(sum(11),66);assert.equal(sum(12),78);assert.equal(countFactors(25),3);
console.log(`PASS: ${checked} Class 6 solved examples. Conceptual and geometric statements also require editorial review; this is not a symbolic proof of prose.`);
