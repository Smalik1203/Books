import fs from 'node:fs/promises';
// The live studio can briefly hold a source open while watching a refit.
export async function writeScienceSource(file,html){
 if(await fs.readFile(file,'utf8').catch(()=>null)===html)return;
 for(let attempt=0;;attempt++)try{await fs.writeFile(file,html);return;}catch(error){
  if(attempt===8||!['UNKNOWN','EBUSY','EPERM'].includes(error.code))throw error;
  await new Promise(resolve=>setTimeout(resolve,150));
 }
}
