// Recompose the Class 7 Science volume at its declared reading size.
import fs from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const run=promisify(execFile),only=process.argv.slice(2).map(Number);
const queue=Array.from({length:12},(_,i)=>i+1).filter(n=>!only.length||only.includes(n));
await fs.mkdir('tmp/g7-layout/logs',{recursive:true});let failed=0;
async function worker(){while(queue.length){const n=queue.shift(),id=String(n).padStart(2,'0');
 try{const r=await run(process.execPath,[`build/compose-science-g7-ch${id}${n===1?'-v2':''}.mjs`],{maxBuffer:8e6});
  await fs.writeFile(`tmp/g7-layout/logs/compose-${id}.txt`,r.stdout+r.stderr);console.log(`Chapter ${n}: composed.`);
 }catch(e){failed++;await fs.writeFile(`tmp/g7-layout/logs/compose-${id}.txt`,(e.stdout||'')+(e.stderr||e.message));console.error(`Chapter ${n}: ${e.stderr||e.message}`);}
}}
await Promise.all([worker(),worker()]);process.exitCode=failed?1:0;
