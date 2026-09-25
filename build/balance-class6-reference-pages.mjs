import fs from 'node:fs';
import {pageBlocks} from './jee-tools.mjs';
function read(d,n){const f=`pages/class-6/${d}/p${String(n).padStart(3,'0')}.html`,h=fs.readFileSync(f,'utf8');return {f,h,bs:pageBlocks(h)};}
function write(p){const old=pageBlocks(p.h),start=p.h.indexOf(old[0]),end=p.h.indexOf(old.at(-1),start)+old.at(-1).length;fs.writeFileSync(p.f,p.h.slice(0,start)+p.bs.join('\n\n')+p.h.slice(end));}
const d='math-ch04-data-handling';
const p13=read(d,13),p14=read(d,14),p15=read(d,15),p25=read(d,25),p26=read(d,26);
if(p14.bs.length!==3||p26.bs.length!==1)throw Error('Unexpected page structure');
p13.bs.push(p14.bs[0]);
p15.bs.unshift(...p14.bs.slice(1));
p25.bs.push('<p>A picture of data can look good but mislead. Check that your pictures show the facts fairly, and check the pictures you read too.</p>');
p25.h=p25.h.replace('<section class="page">','<section class="page" data-close>');
write(p13);write(p15);write(p25);
fs.unlinkSync(p14.f);fs.unlinkSync(p26.f);
// Renumber only the body; Beyond the Book remains p101 onward.
for(let n=15;n<=25;n++)fs.renameSync(`pages/class-6/${d}/p${String(n).padStart(3,'0')}.html`,`pages/class-6/${d}/p${String(n-1).padStart(3,'0')}.html`);
const a=read('math-ch06-perimeter-and-area',14),b=read('math-ch06-perimeter-and-area',15);
if(!a.bs[7].includes('Exercise Set 6.10'))throw Error('Unexpected exercise');
b.bs.unshift(...a.bs.splice(7));write(a);write(b);
console.log('Closed isolated ending and balanced the graph and perimeter exercises.');
