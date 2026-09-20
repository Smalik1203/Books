// Reuse the measured Science audit; document the designed end-of-lesson break.
import fs from 'node:fs/promises';
const history='assets/design-history/science-g7-ch03';
process.argv[2]='class-7/ch03-electricity-circuits';
process.argv[3]=history;
await import('./audit-science-v2.mjs');
const map=JSON.parse(await fs.readFile(history+'/page-map.json','utf8'));
const audit=JSON.parse(await fs.readFile(history+'/render-audit.json','utf8'));
const index=map.findIndex(p=>p.title==='Keywords');
const last=audit.pages[index-1];
if(last.occupiedPercent<88){
 last.shortPageException={
  remainingMM:last.bottomGapMM,
  protectedGroup:[{id:'keywords-reference',type:'reference',title:'Keywords',height:map[index].end-112}],
  requiredMM:Math.round((map[index].end-112)*272/1514*10)/10,
  reason:'The lesson ends here. The complete glossary begins on its dedicated reference page; there is no remaining lesson prose to pull back.'
 };
}
await fs.writeFile(history+'/render-audit.json',JSON.stringify(audit,null,2));
