import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {chapters,checkRoot} from './maths-reference-data.mjs';
const mode=process.argv[2]||'build',tag=process.argv[3]||'final';
const run=(name,args)=>{console.log(name);const r=spawnSync(process.execPath,args,{encoding:'utf8',maxBuffer:50e6});fs.writeFileSync(`${checkRoot}/${name.replaceAll('/','-')}-${tag}.log`,(r.stdout||'')+(r.stderr||''));if(r.status!==0)throw Error(`${name} failed; see log`);};
if(mode==='refit')for(const target of JSON.parse(fs.readFileSync(`${checkRoot}/refit-targets.json`,'utf8'))){const [rel,part]=target.split('|');run(rel,['build/refit.mjs',rel,part]);}
if(mode==='build')for(const c of chapters())run(c.rel,['build/build.mjs',c.rel]);
if(mode==='checks')for(const c of chapters())for(const tool of ['orphans','fit-options','check-labels'])run(c.rel+'-'+tool,[`build/${tool}.mjs`,c.rel]);
if(mode==='books'){
 const vs=[...new Map(chapters().map(c=>[c.cls+'|'+c.meta.subject,[c.cls,c.meta.subject]])).values()];
 for(const [cls,vol]of vs)run(`${cls}-${vol.toLowerCase().replaceAll(' ','-')}-book`,['build/build.mjs',cls,'--book',`--volume=${vol}`,...(tag==='pdf'?['--pdf','--bleed']:[])]);
}
