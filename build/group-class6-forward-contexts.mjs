import fs from 'node:fs';
import {pageBlocks} from './jee-tools.mjs';
const r=JSON.parse(fs.readFileSync('build/forward-reference-audit.json','utf8'));
const keep=new Set(['1:*','2:Table 2.57','4:Table 4.1','4:Table 4.31','4:Figure 4.8','5:Figure 5.11','6:Figure 6.21','7:Figure 7.3','7:Figure 7.18','8:Figure 8.20']);
const targets=new Map();
for(const x of r.forward.filter(x=>x.class==='class-6')){
 if(keep.has(x.chapter+':*')||keep.has(x.chapter+':'+x.reference))continue;
 const k=x.source; if(!targets.has(k))targets.set(k,[]);targets.get(k).push(x);
}
const clean=s=>s.replace(/<[^>]*>/g,' ').replace(/&nbsp;/g,' ').replace(/\s+/g,' ');
function write(file,html,bs){const old=pageBlocks(html);const start=html.indexOf(old[0]),end=html.indexOf(old.at(-1),start)+old.at(-1).length;fs.writeFileSync(file,html.slice(0,start)+bs.join('\n\n')+html.slice(end));}
const changed=new Set();
// Process later source pages first so adjacent joins cannot overwrite each other.
for(const [source,items]of [...targets].sort((a,b)=>b[0].localeCompare(a[0]))){
 const target=items[0].target;if(items.some(x=>x.target!==target))throw Error('Nonadjacent targets');
 const a=fs.readFileSync(source,'utf8'),b=fs.readFileSync(target,'utf8');const aa=pageBlocks(a),bb=pageBlocks(b);
 const labels=items.map(x=>x.reference.replace('Figure','Fig.'));
 const start=aa.findIndex(block=>labels.some(label=>clean(block).includes(label))||items.some(x=>/\bFigs\./.test(clean(block))&&clean(block).includes(x.reference.split(' ')[1])));
 let end=-1;for(let i=0;i<bb.length;i++)if(items.some(x=>new RegExp('<(?:figcaption|caption)[\\s\\S]*?'+x.reference.split(' ')[1].replace('.','\\.')+'(?:<|\\s)').test(bb[i])))end=i;
 if(start<0||end<0)throw Error('Could not find context '+source+' '+labels);
 const moveStart=start>0&&/^<h[23]\b/.test(aa[start-1])?start-1:start;
 const group=[...aa.splice(moveStart),...bb.splice(0,end+1)];
 bb.unshift(`<div class="c-figure-context">\n${group.join('\n\n')}\n</div>`);
 if(!aa.length)throw Error('Would empty page '+source);
 write(source,a,aa);write(target,b,bb);changed.add(source.split('/').slice(1,-1).join('/'));
}
fs.writeFileSync('build/_class6-reference-checks/refit-targets.json',JSON.stringify([...changed]));
console.log([...changed]);
