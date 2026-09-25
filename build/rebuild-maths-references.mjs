import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const logDir=path.resolve('build/_reference-table-checks');fs.mkdirSync(logDir,{recursive:true});
const results=[];
function run(args,label){
 const result=spawnSync(process.execPath,['build/build.mjs',...args],{encoding:'utf8',maxBuffer:64*1024*1024});
 const output=(result.stdout||'')+(result.stderr||'');fs.writeFileSync(path.join(logDir,label+'.log'),output);
 const clipping=output.split('\n').filter(s=>/content is being clipped|design violation|Build stopped/.test(s));
 results.push({target:label,status:result.status,clipping});
 fs.writeFileSync(path.join(logDir,'summary.json'),JSON.stringify(results,null,2));
 if(result.status!==0)throw Error('Build failed: '+label);
}
for(const cls of ['class-6','class-7','class-8','class-9','class-10']){
 const subjects=new Set();
 for(const ent of fs.readdirSync(path.join('pages',cls),{withFileTypes:true})){
  if(!ent.isDirectory()||ent.name.startsWith('_'))continue;
  const metadata=path.join('pages',cls,ent.name,'chapter.json');if(!fs.existsSync(metadata))continue;
  const meta=JSON.parse(fs.readFileSync(metadata,'utf8'));
  if(!/^Mathematics/.test(meta.subject||'Mathematics I'))continue;
  subjects.add(meta.subject||'Mathematics I');
  console.log('Checking '+cls+'/'+ent.name);
  run([cls+'/'+ent.name],cls+'-'+ent.name);
 }
 for(const subject of subjects){
  console.log('Binding '+cls+' '+subject);
  run([cls,'--book','--volume='+subject,'--pdf','--bleed'],cls+'-'+subject.replaceAll(' ','-'));
 }
}
console.log(JSON.stringify({builds:results.length,clipped:results.filter(r=>r.clipping.length)},null,2));
