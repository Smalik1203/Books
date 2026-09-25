import fs from 'node:fs';
const root='pages/class-6',report='build/_class6-reference-checks/numbering.json';
if(fs.existsSync(report))throw Error('One-time migration already applied');
const dirs=fs.readdirSync(root).filter(d=>d.startsWith('math-ch'));
const clean=s=>s.replace(/<[^>]*>/g,'').replace(/&nbsp;|&#160;/g,' ').trim();
const maps={},definitions=[];
// Distinguish the repeated artwork so each caption has a unique identifier.
const area=`${root}/math-ch06-perimeter-and-area`;
let repeatSeen=false;
for(const f of fs.readdirSync(area).filter(f=>/^p\d+\.html$/.test(f)).sort()){
 let h=fs.readFileSync(`${area}/${f}`,'utf8');
 if(/Fig\. 6\.8<\/span>\s*\(repeated/.test(h)){repeatSeen=true;h=h.replace(/Fig\. 6\.8<\/span>\s*\(repeated from Section 6\.1, for Exercise Set 6\.6\)/,'Fig. 6.800</span> (the shapes from Section 6.1, repeated for Exercise Set 6.6)');}
 if(repeatSeen)h=h.replace(/Find the area of each shape in Fig\. 6\.8\./g,'Find the area of each shape in Fig. 6.800.');
 fs.writeFileSync(`${area}/${f}`,h);
}
for(const d of dirs){
 const meta=JSON.parse(fs.readFileSync(`${root}/${d}/chapter.json`,'utf8'));let n=0;
 for(const f of fs.readdirSync(`${root}/${d}`).filter(f=>/^p\d+\.html$/.test(f)).sort()){
  const h=fs.readFileSync(`${root}/${d}/${f}`,'utf8');
  for(const m of h.matchAll(/<(figcaption|caption)\b[^>]*>([\s\S]*?)<\/\1>/g)){
   const label=clean(m[2]).match(/^(Fig(?:ure)?\.?|Table)\s*(\d+\.\d+)/i);if(!label)continue;
   const type=/^t/i.test(label[1])?'Table':'Figure',key=type+' '+label[2];
   if(maps[key])throw Error('Duplicate definition: '+key);
   maps[key]=`${meta.number}.${++n}`;definitions.push({chapter:d,file:f,type,old:label[2],new:maps[key]});
  }
 }
}
const unresolved=[];
function convert(h,file){
 return h.replace(/\b(Fig(?:ure)?s?\.?|Tables?)(\s*|&nbsp;|&#160;)(\d+\.\d+(?:(?:\s*,\s*|\s+and\s+|\s+to\s+|\s*[–−-]\s*)\d+\.\d+)*)/gi,(all,label,space,group)=>{
  const type=/^t/i.test(label)?'Table':'Figure';
  let nums=group.match(/\d+\.\d+/g);
  if(/\bto\b|[–−-]/.test(group)&&nums.length===2){
   const [a,b]=nums.map(s=>s.split('.').map(Number));
   if(a[0]===b[0]&&b[1]-a[1]<100)nums=Array.from({length:b[1]-a[1]+1},(_,i)=>`${a[0]}.${a[1]+i}`);
  }
  const mapped=nums.map(n=>{if(!maps[type+' '+n]){unresolved.push({file,ref:type+' '+n});return n;}return maps[type+' '+n];});
  const content=mapped.length<=1?mapped[0]:mapped.length===2?mapped.join(' and '):mapped.slice(0,-1).join(', ')+' and '+mapped.at(-1);
  return label+(space||' ')+content;
 });
}
let files=0;
for(const d of dirs){
 for(const f of fs.readdirSync(`${root}/${d}`).filter(f=>/^p\d+\.html$/.test(f)||f==='ANSWERS.md')){
  const p=`${root}/${d}/${f}`;fs.writeFileSync(p,convert(fs.readFileSync(p,'utf8'),p));files++;
 }
 // Future regeneration must not restore obsolete identifiers in untouched stages.
 const backup=`build/_jee-backups/class-6/${d}`;
 if(fs.existsSync(backup))for(const f of fs.readdirSync(backup).filter(f=>/^p\d+\.html$/.test(f))){const p=`${backup}/${f}`;fs.writeFileSync(p,convert(fs.readFileSync(p,'utf8'),p));}
}
fs.writeFileSync(report,JSON.stringify({files,definitions,maps,unresolved},null,2));
console.log(JSON.stringify({files,captions:definitions.length,unresolved},null,2));
