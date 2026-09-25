import fs from 'node:fs';
import {pageBlocks} from './jee-tools.mjs';
const base='pages/class-6';
const backup='build/_class6-reference-before';
fs.mkdirSync(backup,{recursive:true});
for(const d of fs.readdirSync(base).filter(d=>d.startsWith('math-ch'))){
 fs.mkdirSync(`${backup}/${d}`,{recursive:true});
 for(const f of fs.readdirSync(`${base}/${d}`).filter(f=>/^p\d+\.html$/.test(f))){if(fs.existsSync(`${backup}/${d}/${f}`))throw Error('Backup already exists; do not rerun');fs.copyFileSync(`${base}/${d}/${f}`,`${backup}/${d}/${f}`);}
}
function move(ch,p,count){
 const dir=fs.readdirSync(base).find(d=>d.startsWith(`math-ch${String(ch).padStart(2,'0')}-`));
 const file=n=>`${base}/${dir}/p${String(n).padStart(3,'0')}.html`;
 const a=fs.readFileSync(file(p),'utf8'),b=fs.readFileSync(file(p+1),'utf8');
 const aa=pageBlocks(a),bb=pageBlocks(b),moved=aa.splice(-count);
 if(!bb[0].includes('c-figure'))throw Error('Expected first figure');
 bb[0]=`<div class="c-figure-context">\n${moved.join('\n\n')}\n\n${bb[0]}\n</div>`;
 const write=(f,h,blocks)=>{const old=pageBlocks(h);const start=h.indexOf(old[0]),end=h.indexOf(old.at(-1),start)+old.at(-1).length;fs.writeFileSync(f,h.slice(0,start)+blocks.join('\n\n')+h.slice(end));};
 write(file(p),a,aa);write(file(p+1),b,bb);
}
// Move complete introductions, questions or examples; no panel is divided.
move(2,15,4); // protractor heading, definition and markings
move(4,14,3); // expenditure data, table and complete worked example
move(6,7,3); // area heading and unit-square explanation
move(6,15,4); // house-plan heading and explanation
move(7,3,3); // fractional-unit heading and folding sequence
move(8,4,1); // named rectangle's corners, sides and angles
move(9,6,1); // paper-hole question
move(9,8,1); // copying question
move(10,1,3); // building questions and lift description
console.log('Grouped nine Class 6 reference/visual contexts; originals saved.');
