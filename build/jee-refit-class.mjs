import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
const cls=process.argv[2];
if(!/^class-(6|7|8|9|10)$/.test(cls||''))throw Error('Provide class-6 through class-10');
const logDir=path.resolve('build/_jee-checks',cls);fs.mkdirSync(logDir,{recursive:true});
for(const name of fs.readdirSync(path.join('pages',cls)).filter(n=>!n.startsWith('_'))){
  const rel=`${cls}/${name}`,dir=path.join('pages',rel);
  if(!fs.statSync(dir).isDirectory())continue;
  if(process.argv[3]&&process.argv[3]!==name)continue;
  const files=fs.readdirSync(dir).filter(f=>/^p1\d\d\.html$/.test(f));
  if(!files.some(f=>fs.readFileSync(path.join(dir,f),'utf8').includes('data-question-type')))continue;
  const log=fs.openSync(path.join(logDir,name+'.log'),'w');
  console.log('Refitting '+rel);
  function run(args){
    const r=spawnSync(process.execPath,args,{encoding:'utf8',maxBuffer:64*1024*1024});
    fs.writeSync(log,(r.stdout||'')+(r.stderr||''));
    if(r.status!==0){fs.closeSync(log);throw Error(`${args.join(' ')} failed (${r.status})`);}
    return r.stdout||'';
  }
  run(['build/refit.mjs',rel,'bridge']);
  let options=run(['build/fit-options.mjs',rel]);
  if(options.includes('to narrow')){
    run(['build/fit-options.mjs',rel,'--fix']);
    run(['build/refit.mjs',rel,'bridge']);
    options=run(['build/fit-options.mjs',rel]);
    if(options.includes('to narrow'))throw Error('Option widths still need attention: '+rel);
  }
  run(['build/orphans.mjs',rel]);
  fs.closeSync(log);
}
