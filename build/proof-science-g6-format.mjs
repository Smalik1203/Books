// Rebuild both print sheets and run the existing page-geometry audits.
import fs from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const run=promisify(execFile),root='pages/class-6';
const only=process.argv.slice(2).map(Number),chapters=[];
for(const name of await fs.readdir(root)){
 const meta=JSON.parse(await fs.readFile(`${root}/${name}/chapter.json`,'utf8').catch(()=>'{}'));
 if(meta.subject==='Science'&&(!only.length||only.includes(Number(meta.number))))chapters.push({name,number:Number(meta.number)});
}
let failures=0;
async function worker(){
 while(chapters.length){
  const {name,number}=chapters.shift();
  try{
   const built=await run(process.execPath,['build/build.mjs',`class-6/${name}`,'--pdf','--bleed'],{maxBuffer:8e6});
   await fs.mkdir('tmp/g6-format/logs',{recursive:true});
   await fs.writeFile(`tmp/g6-format/logs/ch${number}-build.txt`,built.stdout+built.stderr);
   if(![1,2,3,4,10].includes(number)){
    const audit=await run(process.execPath,['build/audit-science-g6-ch12.mjs',`class-6/${name}`,`assets/design-history/science-g6-ch${String(number).padStart(2,'0')}`],{maxBuffer:8e6});
    await fs.writeFile(`tmp/g6-format/logs/ch${number}-audit.txt`,audit.stdout+audit.stderr);
   }
   console.log(`Chapter ${number}: print PDFs and geometry checks complete.`);
  }catch(e){failures++;console.error(`Chapter ${number}: ${e.stdout||''}\n${e.stderr||e.message}`);}
 }
}
await Promise.all([worker(),worker()]);
process.exitCode=failures?1:0;
