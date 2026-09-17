import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
const dir=await fs.mkdtemp(path.resolve('pages/_fit-transform-'));
const chapter=path.basename(dir),built=path.resolve('build',chapter+'.html'),source=path.join(dir,'p001.html');
try{
 for(const [y,count] of [[130,0],[530,1]]){
  const html=`<!doctype html><html><head><style>body{margin:0}svg{width:1052px;height:1514px}text{font:24px Arial}</style></head><body><section class="page" data-folio="1"><svg class="food-sheet science-editorial" viewBox="0 0 1052 1514" xmlns="http://www.w3.org/2000/svg"><g transform="translate(0 400)"><rect class="science-illustration" x="100" y="100" width="200" height="120"/></g><text x="110" y="${y}">Test line</text></svg></section></body></html>`;
  await fs.writeFile(source,html);await fs.writeFile(built,html);
  let output;
  try{output=execFileSync(process.execPath,['build/check-reference-fit.mjs',chapter,'--block=0,1052','--json'],{encoding:'utf8'});}catch(error){output=error.stdout;}
  const result=JSON.parse(output);
  assert.equal(result.collide.length,count,'Translated artwork collision at y='+y);
  assert.equal(result.over.length+result.vertical.length+result.letterbox.length,0);
 }
 console.log('Transformed-viewport checks passed: false overlap rejected, real overlap detected.');
}finally{
 await fs.unlink(source);await fs.rmdir(dir);await fs.unlink(built);
}
