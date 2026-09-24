// Regenerate every Science chapter through its authoring entry point.
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const run=promisify(execFile),queue=Array.from({length:12},(_,i)=>i+1);
async function worker(){while(queue.length){const n=queue.shift();const args=[1,2,3,4,10].includes(n)?['build/compose-science-g6-modern.mjs',String(n)]:[`build/compose-science-g6-ch${String(n).padStart(2,'0')}.mjs`];const {stdout}=await run(process.execPath,args,{maxBuffer:4e6});console.log(stdout.trim().split('\n')[0]);}}
await Promise.all([worker(),worker()]);
