// Compare the pre-redesign reading to the new page ledger, ignoring design copy.
import fs from 'node:fs/promises';
const before=JSON.parse(await fs.readFile('assets/design-history/ch04-before-fieldbook/page-audit.json','utf8'));
const after=JSON.parse(await fs.readFile('assets/design-history/ch04-page-audit.json','utf8'));
const norm=s=>s.replace(/\*|•/g,'').replace(/\s+/g,' ').trim();
const all=norm(after.flatMap(p=>p.text).join(' '));
const exceptions=['Copy these headings into your notebook and record your observations.','Answer the questions and complete the tables in your notebook.'];
const checked=[],missing=[];
for(const page of before)for(const text of page.text)for(const part of text.split('\n')){
 const s=norm(part);
 if(!s||s.startsWith('Figure:')||s==='Opening illustration'||s.startsWith('Table ')||s.includes(' | ')||exceptions.includes(s))continue;
 checked.push(s);if(!all.includes(s))missing.push({page:page.page,text:s});
}
const result={checked:checked.length,missing,changedRecordingDirections:exceptions};
await fs.writeFile('assets/design-history/ch04-fieldbook-content-audit.json',JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));if(missing.length)process.exitCode=1;
