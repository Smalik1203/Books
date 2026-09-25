import fs from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';

async function writeSource(file,source){
 for(let attempt=0;;attempt++){
  try{await fs.writeFile(file,source);return;}
  catch(error){if(!['UNKNOWN','EBUSY','EPERM'].includes(error.code)||attempt===5)throw error;
   await new Promise(resolve=>setTimeout(resolve,150*(attempt+1)));}
 }
}

const plain=s=>s.replace(/<tspan\b[^>]*\bx="[^"]*"[^>]*>/g,' ').replace(/<[^>]*>/g,'').replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&quot;','"').replace(/\s+/g,' ').trim();
// Small copy edits avoid large spaces before long, joined answer options and
// compound labels. They preserve the scientific meaning and every whole word.
const revised=s=>s.replaceAll('acidic/acidic/acidic; neutral/basic/basic; basic/basic/acidic; or basic/basic/basic',
 'acidic, acidic, acidic; neutral, basic, basic; basic, basic, acidic; or basic, basic, basic')
 .replaceAll('sulfur-dioxide','sulfur dioxide').replaceAll('menstrual-hygiene','menstrual hygiene')
 .replace('Compare this observation with the teacher’s sulfur dioxide demonstration.', 'Compare what you observed with what the teacher showed using sulfur dioxide.')
 .replace('Fireflies produce light through chemical reactions in their bodies.', 'Chemical reactions inside fireflies produce light.')
 .replace('Bhaskar notices leaves with green and cream patches. Such variegated leaves offer a comparison within one leaf.',
  'Bhaskar notices green and cream patches on a leaf. A variegated leaf like this allows comparisons within a single leaf.')
 .replace('Bhaskar notices green and cream patches on a leaf. A variegated leaf like this allows comparisons within a single leaf.',
  'Bhaskar sees green and cream areas on a leaf. He can compare these parts of the same variegated leaf.');
const key=s=>['class','x'].map(a=>s.match(new RegExp('\\b'+a+'="([^"]*)"'))?.[1]).join('|')+'|'+revised(plain(s));

export function justifiedProseLines(rows,x,y,cls,lead,size,{word,widths,replacements,narrowMeasure=500}){
 const natural=`<text class="${cls}" x="${x}" y="${y+size}">${rows.map((r,i)=>`<tspan x="${x}"${i?` dy="${lead}"`:''}>${r.map(word).join(' ')}</tspan>`).join('')}</text>`;
 if(cls!=='se-copy'&&cls!=='se-copy v2-intro')return natural;
 const html=`<text class="${cls}" x="${x}" y="${y+size}" data-prose-align="justify">${rows.map((r,i)=>{
  const pos=`x="${x}"${i?` dy="${lead}"`:''}`;
  if(r.paragraphEnd||r.length<2)return `<tspan ${pos} data-paragraph-end="true">${r.map(word).join(' ')}</tspan>`;
  // Narrow glossary columns and figure-side safety notes have their own small
  // measure. Natural setting keeps those technical terms readable.
  if(r.measure<narrowMeasure)return `<tspan ${pos} data-narrow-prose="true">${r.map(word).join(' ')}</tspan>`;
  const naturalSpace=widths[r.face][' ']*r.scale;
  const used=r.reduce((n,t)=>n+t.reduce((sum,p)=>sum+widths[r.face==='n'?p.k:r.face][p.s]*r.scale,0),0)+(r.length-1)*naturalSpace;
  const extra=(r.measure-used)/(r.length-1);
  if(extra<0)throw Error('Prose exceeds its measure');
  return `<tspan ${pos} data-justify-width="${r.measure}" data-natural-space="${naturalSpace.toFixed(5)}" data-extra-space="${extra.toFixed(5)}" data-space-ratio="${((naturalSpace+extra)/naturalSpace).toFixed(3)}">${r.map((t,j)=>j?`<tspan dx="${extra.toFixed(5)}"> ${word(t)}</tspan>`:word(t)).join('')}</tspan>`;
 }).join('')}</text>`;
 replacements.set(key(natural),html);
 return html;
}

export async function applyExistingProse(dir,replacements){
 const pending=[],missing=[];
 for(const file of (await fs.readdir(dir)).filter(f=>/^p\d+\.html$/.test(f)).sort()){
  const source=await fs.readFile(dir+'/'+file,'utf8');
  const result=source.replace(/<text\b[^>]*class="se-copy(?: v2-intro)?"[^>]*>[\s\S]*?<\/text>/g,s=>{
   if(!/<tspan\b/.test(s))return s; // numbers and bullet marks are not prose
   const replacement=replacements.get(key(s));
   if(!replacement){missing.push({file,text:plain(s)});return s;}
   if((replacement.match(/<tspan x=/g)||[]).length>(s.match(/<tspan x=/g)||[]).length)throw Error('Copy edit adds a line: '+plain(s));
   // A migration preserves all fitted baselines, including edited panel spacing.
   return replacement.replace(/\by="[^"]*"/,s.match(/\by="[^"]*"/)[0]);
  });
  pending.push([dir+'/'+file,result]);
 }
 if(missing.length)throw Error('Unmatched prose: '+JSON.stringify(missing));
 for(const [file,result] of pending)if(await fs.readFile(file,'utf8')!==result)await writeSource(file,result);
 await measureProseJustification(dir);
}

export async function measureProseJustification(dir){
 const config=JSON.parse(await fs.readFile(dir+'/chapter.json','utf8'));
 const files=(await fs.readdir(dir)).filter(f=>/^p\d+\.html$/.test(f)).sort();
 const sources=await Promise.all(files.map(f=>fs.readFile(dir+'/'+f,'utf8')));
 const grade=config.class;
 const probe=`build/class-${grade}/ch${config.number}-word-space-measure.html`;
 const sheets=['book','edition-'+config.edition,'palette-'+config.palette,'reference-fonts','food-reference','science-reference','science-editorial','science-locked','science-v2-fonts','science-v2'];
 const script=String.raw`<script>onload=async()=>{try{
  await document.fonts.ready;const result=[],wide=[];let count=0,maxError=0;
  for(const page of document.querySelectorAll('.page')){
   for(const line of page.querySelectorAll('[data-justify-width]')){
    const gaps=[...line.querySelectorAll(':scope > tspan[dx]')];
    const target=+line.getAttribute('x')+ +line.dataset.justifyWidth;
    for(let pass=0;pass<3;pass++){
     const b=line.getBBox(),delta=(target-b.x-b.width)/gaps.length;
     if(!Number.isFinite(delta))throw Error('A justified line needs word gaps');
     for(const gap of gaps)gap.setAttribute('dx',(+gap.getAttribute('dx')+delta).toFixed(5));
    }
    const space=+line.dataset.naturalSpace,extra=+gaps[0].getAttribute('dx');
    line.dataset.extraSpace=extra.toFixed(5);line.dataset.spaceRatio=((space+extra)/space).toFixed(3);
    const box=line.getBBox();maxError=Math.max(maxError,Math.abs(target-box.x-box.width));count++;
    if(+line.dataset.spaceRatio>3.4)wide.push({page:page.dataset.folio,text:line.textContent,ratio:+line.dataset.spaceRatio});
   }
   result.push([...page.querySelectorAll('text[data-prose-align]')].map(e=>e.outerHTML));
  }
  document.title='SPACES'+JSON.stringify({result,wide,count,maxError});
 }catch(e){document.title='SPACE_ERROR'+e.message;}};</script>`;
 await fs.mkdir(path.dirname(probe),{recursive:true});
 await fs.writeFile(probe,`<!doctype html><html><head><meta charset="utf-8">${sheets.map(s=>`<link rel="stylesheet" href="../../css/${s}.css">`).join('')}${script}</head><body>${sources.join('\n')}</body></html>`);
 let stdout;
 try{({stdout}=await promisify(execFile)(process.env.CHROME_PATH||'C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--virtual-time-budget=10000','--dump-dom',pathToFileURL(path.resolve(probe)).href],{maxBuffer:64e6}));}finally{await fs.unlink(probe);}
 const raw=stdout.match(/<title>SPACES(.*?)<\/title>/s)?.[1];if(!raw)throw Error('No word-space measurements');
 const report=JSON.parse(raw.replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>'));
 for(let p=0;p<files.length;p++){
  let i=0;const after=sources[p].replace(/<text\b[^>]*data-prose-align="justify"[^>]*>[\s\S]*?<\/text>/g,()=>report.result[p][i++]);
  if(i!==report.result[p].length)throw Error('Word-space text count mismatch');
  if(after!==sources[p])await writeSource(dir+'/'+files[p],after);
 }
 delete report.result;
 const history=`assets/design-history/science-g${grade}-table-rollout`;await fs.mkdir(history,{recursive:true});
 await writeSource(`${history}/ch${config.number}-justification.json`,JSON.stringify(report,null,2));
 console.log(`Chapter ${config.number}: ${report.count} justified lines; ${report.wide.length} wide spaces to review; maximum edge error ${report.maxError.toFixed(3)}.`);
}
