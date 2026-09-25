import fs from 'node:fs';
import {pageBlocks} from './jee-tools.mjs';
import {checkRoot,clean,references} from './maths-reference-data.mjs';
const accepted={
 'class-7/ch01-large-numbers|Table 1.6':'General census introduction; read-aloud instruction moved beside the data.',
 'class-7/ch01-large-numbers|Table 1.7':'General census introduction; read-aloud instruction moved beside the data.',
 'class-7/ch04-letter-numbers|Table 4.3':'Introduces the conversion table; work follows with the table.',
 'class-7/p2ch01-geometric-twins|Figure 1.15':'Introduces a construction; its steps and diagrams follow together.',
 'class-7/p2ch02-integers|Table 2.6':'Summary table after a complete multiplication argument.',
 'class-7/p2ch05-data|Table 5.19':'Introduces the data; questions follow on the table page.',
 'class-7/p2ch06-constructions|Figure 6.30':'The next page supplies one possible tiling; dimensions are stated.',
 'class-9/ch04-algebraic-identities|Figure 4.5':'Introduces the next visual identity; investigation follows with the figure.',
 'class-10/ch01-real-numbers|Figure 1.1':'Introduces the factor tree; its interpretation follows with it.',
 'class-10/ch02-polynomials|Figure 2.9':'Introduces two graphs; analysis follows on their page.',
 'class-10/ch12-surface-areas-and-volumes|Figure 12.3':'Supplementary familiar object, fully described in text.'
};
const extra=`${checkRoot}/accepted-transitions.json`;
if(fs.existsSync(extra))Object.assign(accepted,JSON.parse(fs.readFileSync(extra,'utf8')));
fs.writeFileSync(extra,JSON.stringify(accepted,null,2));
const audit=JSON.parse(fs.readFileSync(`${checkRoot}/audit.json`,'utf8'));
const jobs=new Map(),log=[];
for(const r of audit.forward){
 if(r.rel.startsWith('class-6/'))continue;
 if(r.gap===1&&(r.from%2===0||accepted[r.rel+'|'+r.reference]))continue;
 if(!jobs.has(r.source))jobs.set(r.source,[]);jobs.get(r.source).push(r);
}
const changed=new Set();
function write(f,h,bs){const old=pageBlocks(h),s=h.indexOf(old[0]),e=h.indexOf(old.at(-1),s)+old.at(-1).length;fs.writeFileSync(f,h.slice(0,s)+bs.join('\n\n')+h.slice(e));}
for(const [source,rs]of [...jobs].sort((a,b)=>b[0].localeCompare(a[0]))){
 const target=rs[0].target;if(rs.some(r=>r.target!==target))throw Error('Multiple target pages: '+source);
 const a=fs.readFileSync(source,'utf8'),b=fs.readFileSync(target,'utf8'),aa=pageBlocks(a),bb=pageBlocks(b);
 const wanted=new Set(rs.map(r=>r.reference));
 const hits=s=>references(clean(s)).some(r=>r.ids.some(id=>wanted.has(`${r.type} ${id}`)));
 let start=aa.findIndex(hits),end=-1;
 for(let i=0;i<bb.length;i++)for(const m of bb[i].matchAll(/<(figcaption|caption)\b[^>]*>([\s\S]*?)<\/\1>/gi))if(hits(m[2]))end=i;
 if(start<0||end<0)throw Error('Context not found: '+source);
 if(start>0&&/^<h[23]\b/.test(aa[start-1]))start--;
 if(start===0)throw Error('Would empty source page: '+source);
 const group=[...aa.splice(start),...bb.splice(0,end+1)];
 bb.unshift(`<div class="c-figure-context">\n${group.join('\n\n')}\n</div>`);
 write(source,a,aa);write(target,b,bb);
 const part=/\/p1\d\d\.html$/.test(source)?'bridge':'body';changed.add(rs[0].rel+'|'+part);
 log.push({source,target,refs:[...wanted]});
}
fs.writeFileSync(`${checkRoot}/refit-targets.json`,JSON.stringify([...changed]));
fs.appendFileSync(`${checkRoot}/grouping.jsonl`,log.map(x=>JSON.stringify(x)).join('\n')+(log.length?'\n':''));
console.log(JSON.stringify({groups:log.length,targets:[...changed]},null,2));
