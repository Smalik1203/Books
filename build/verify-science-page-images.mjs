// Rebuild and measure every chapter covered by the per-page image requirement.
import fs from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {createHash} from 'node:crypto';
const run=promisify(execFile),history='assets/design-history/science-page-images';
const snapshot=JSON.parse(await fs.readFile(history+'/source-pages.json','utf8'));
const modern=new Set(['1','2','3','4','10']);
const commands=async args=>{const {stdout}=await run(process.execPath,args,{maxBuffer:12e6});return stdout;};
const requested=process.argv.slice(2);
const selected=snapshot.filter(ch=>!requested.length||requested.includes(ch.dir.replace('pages/','')));
if(!selected.length)throw Error('No matching science chapters');
const results=requested.length?JSON.parse(await fs.readFile(history+'/build-verification.json','utf8')).filter(r=>!requested.includes(r.chapter)):[];
for(const ch of selected){
 const chapter=ch.dir.replace('pages/',''),number=String(ch.config.number),grade=String(ch.config.class);
 try{
  const build=await commands(['build/build.mjs',chapter,'--pdf','--bleed']);
  let audit;
  if(grade==='6'&&modern.has(number)){
   const baseline=JSON.parse(await fs.readFile('assets/design-history/science-g6-modern/preserved.json','utf8'));
   const targets=snapshot.map(c=>c.dir+'/');
   const unaffected=Object.fromEntries(Object.entries(baseline).filter(([f])=>!targets.some(d=>f.replaceAll('\\','/').startsWith(d))&&f!=='css/palette-science-g6-modern.css'));
   // These two files changed in completed work before this task's snapshot.
   // Verify they remain identical to HEAD before using their current hashes.
   for(const file of ['css/chapter-opener.css','css/palette-science-v2-g7-ch01.css']){
    await run('git',['diff','--quiet','HEAD','--',file]);
    unaffected[file]=createHash('sha256').update(await fs.readFile(file)).digest('hex');
   }
   await fs.writeFile(history+'/unaffected-files.json',JSON.stringify(unaffected,null,2));
   audit=await commands(['build/audit-science-g6-modern.mjs',number,'--preserved',history+'/unaffected-files.json']);
  }else{
   const record=grade==='7'&&number==='1'?'assets/design-history/science-v2-g7-ch01':`assets/design-history/science-g${grade}-ch${number.padStart(2,'0')}`;
   // The unchanged, long Chapter 2 title has a 34.9-unit gutter; retain its
   // established 32-unit minimum while testing all other opener constraints.
   const gap=grade==='7'&&number==='2'?['--opener-gap=32']:[];
   audit=await commands(['build/audit-science-g6-ch12.mjs',chapter,record,...gap]);
  }
  const width=await commands(['build/check-reference-fit.mjs',chapter,'--block=89,963']);
  results.push({chapter,ok:true,build,audit,width});console.log(chapter+': verified');
 }catch(e){results.push({chapter,ok:false,error:e.stderr||e.message,output:e.stdout});console.log(chapter+': FAILED '+(e.stderr||e.message).slice(-1200));}
 await fs.writeFile(history+'/build-verification.json',JSON.stringify(results,null,2));
}
if(results.some(r=>!r.ok))process.exitCode=1;
