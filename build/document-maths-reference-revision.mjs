import fs from 'node:fs';
import {chapters,backupRoot,checkRoot} from './maths-reference-data.mjs';
const groups=fs.readFileSync(`${checkRoot}/grouping.jsonl`,'utf8').trim().split('\n').map(s=>JSON.parse(s));
for(const c of chapters()){
 const backup=`${backupRoot}/${c.rel}`;
 const changed=c.files.some(f=>!fs.existsSync(`${backup}/${f}`)||fs.readFileSync(`pages/${c.rel}/${f}`,'utf8')!==fs.readFileSync(`${backup}/${f}`,'utf8'));
 if(!changed)continue;
 const log=`pages/${c.rel}/EDIT-LOG.md`,old=fs.existsSync(log)?fs.readFileSync(log,'utf8'):'';
 if(old.includes('21 September 2026 — figure/table reference review'))continue;
 const n=groups.filter(g=>g.source.startsWith(`pages/${c.rel}/`)).length;
 fs.writeFileSync(log,old+`\n\n## 21 September 2026 — figure/table reference review\n\nReviewed this chapter in the all-maths reference audit. Figures and tables now use one chapter sequence, including Beyond the Book; captions and references were updated together. ${n?`${n} dependent text/visual group(s) were kept together and the body refitted. `:''}Questions, calculations and artwork were preserved. The chapter and its volume were rebuilt; detailed layout checks and any remaining warnings are recorded in build/_all-maths-reference-checks/.\n`);
}
