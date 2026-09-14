import {scienceWord} from './science-defined-terms.mjs';
// Rebuild the complete editorial chapter from the archived manuscript.
// Final page fragments remain the printing source; preserve manual edits before rerunning.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
import {introductionRevisions,revise} from './science-editorial-revisions.mjs';
import {learningCue,featureIcon} from './science-learning-cues.mjs';
const run=promisify(execFile),root=process.cwd();
const dir='pages/class-6/ch01-wonderful-world-of-science';
const editorialChanges=[];
const md=revise(await fs.readFile('assets/manuscripts/LearnLab_G6_Ch01_Wonderful_World_of_Science.md','utf8'),introductionRevisions,editorialChanges);
await fs.writeFile('assets/design-history/ch01-editorial-changes.json',JSON.stringify(editorialChanges,null,2));
const E=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function tokens(s){let bold=false,italic=false;return s.split(/\s+/).filter(Boolean).map(word=>{let parts=[];for(const bit of word.split(/(\*\*|\*)/)){if(bit==='**')bold=!bold;else if(bit==='*')italic=!italic;else if(bit)parts.push({s:bit,k:bold?'b':italic?'i':'n'});}return parts;});}
const context=JSON.parse(await fs.readFile('assets/manuscripts/ch01-editorial-context.json','utf8'));
const terms=new Set([' ','Activity 1.1 · Think and Write','Activity 1.2 · Watch and Record','Activity 1.3 · Think and Write']);for(const word of tokens(md+" "+Object.values(context).join(" ")) )for(const p of word)terms.add(p.s);
const probe=path.join(root,'build/_science-type-measure.html');
await fs.writeFile(probe,`<html><head><link rel="stylesheet" href="../css/fonts.css"><link rel="stylesheet" href="../css/reference-fonts.css"></head><body><script>window.onload=async()=>{await Promise.all(['500 23px Spectral','700 23px Spectral','italic 500 23px Spectral','700 19.55px Food Poppins'].map(f=>document.fonts.load(f)));const c=document.createElement('canvas').getContext('2d'),m={};for(const [k,f] of [['n','500 23px Spectral'],['b','700 23px Spectral'],['i','italic 500 23px Spectral'],['t','700 19.55px Food Poppins']]){c.font=f;m[k]={};for(const w of ${JSON.stringify([...terms])})m[k][w]=c.measureText(w).width;}document.title='METRICS'+JSON.stringify(m);};</script></body></html>`);
const {stdout}=await run('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--virtual-time-budget=6000','--dump-dom',pathToFileURL(probe).href],{maxBuffer:16e6});
await fs.unlink(probe);
const widths=JSON.parse(stdout.match(/METRICS(.*?)<\/title>/s)[1].replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>'));
function wrap(s,w){const lines=[];let row=[],len=0;for(const t of tokens(s)){const tw=t.reduce((a,p)=>a+(widths[p.k][p.s]??p.s.length*12),0);if(row.length&&len+widths.n[' ']+tw>w){lines.push(row);row=[];len=0;}if(row.length)len+=widths.n[' '];row.push(t);len+=tw;}if(row.length)lines.push(row);return lines;}
const word=t=>scienceWord(t,E);
function explain(n){for(const s of context[n].split('\n\n'))para(s);}
const texts=[];let out='',y=0;
function para(s,{x=89,w=874,cls='',gap=14,lead=31}={}){const lines=wrap(s,w);out+=`<text class="se-copy ${cls}" data-measure="${w}" x="${x}" y="${y+23}">${lines.map((l,i)=>`<tspan x="${x}"${i?` dy="${lead}"`:''}>${l.map(word).join(' ')}</tspan>`).join('')}</text>\n`;texts.push(s.replaceAll('*',''));y+=lines.length*lead+gap;}
function label(s,x,baseline,cls='se-label'){out+=`<text class="${cls}" x="${x}" y="${baseline}">${E(s)}</text>\n`;}
function head(s,number){label(number?number+' '+s:s,89,y+28,'se-heading');y+=52;}
function rule(yy,cls='se-rule',x=89,r=963){out+=`<line class="${cls}" x1="${x}" y1="${yy}" x2="${r}" y2="${yy}"/>\n`;}
function prompt(s){if(s.startsWith('Science is not a pile')){para(s);return;}const kind=s.includes('hypothesis')?'imagine':'observe';const lines=wrap(s,826);const h=lines.length*31+96;out+=`<rect class="se-prompt" x="89" y="${y}" width="874" height="${h}"/><line class="se-think-rule" x1="89" x2="963" y1="${y}" y2="${y}"/>`+learningCue(kind,'',113,y+8,E);y+=74;para(s,{x:113,w:826,gap:0});y+=42;}
function activity(title,items){
  if(title.includes('Think and Write')){prompt(items.map(s=>s.replace(/^• /,'')).join(' '));return;}
  title='The setup';
  const hasIntro=!items[0].startsWith('• ');
  const steps=hasIntro?items.slice(1):items;
  const tabWidth=874;
  y+=18;const top=y,previous=out;out='';
  label(title,105,top+14,'se-activity-tab-text');y=top+45;
  if(hasIntro)para(items[0],{x:113,w:826,gap:16});
  out+='<g aria-label="Activity steps">';
  steps.forEach((s,i)=>{
    out+=`<text class="se-activity-step" x="126" y="${y+23}" text-anchor="end">${i+1}.</text>`;
    para(s.replace(/^• /,''),{x:146,w:799,gap:12});
  });
  out+='</g>';const content=out,bottom=y+6;
  out=previous+`<rect class="se-activity-panel" x="89" y="${top}" width="874" height="${bottom-top}" rx="20"/><rect class="se-activity-tab" x="89" y="${top-14}" width="${tabWidth}" height="40" rx="12"/>`+content;
  y=bottom+14;
}
let clipCount=0;
function img(file,vb,x,yy,w,h,title,extra='',clipShape=''){const [cx,cy,cw,ch]=vb.split(' ').map(Number),id='se-art-clip-'+(++clipCount);out+=`<svg class="science-illustration" x="${x}" y="${yy}" width="${w}" height="${h}" viewBox="${vb}" preserveAspectRatio="xMidYMid meet" overflow="hidden"><defs><clipPath id="${id}">${clipShape||`<rect x="${cx}" y="${cy}" width="${cw}" height="${ch}"/>`}</clipPath></defs><image clip-path="url(#${id})" href="../../figures/class-6/science/${file}" x="0" y="0" width="${file.includes('everyday')?2172:file.includes('cutout')?1979:1052}" height="${file.includes('everyday')?724:file.includes('cutout')?795:file.includes('p002')?1494:1495}"><title>${E(title)}</title></image>${extra}</svg>\n`;}
function crop(file,vb,x,yy,w,h,title){img(file,vb,x,yy,w,h,title);}
function blocks(n){const match=md.match(new RegExp('\\*\\*\\[ PAGE '+n+'[^\\n]*\\*\\*([\\s\\S]*?)(?=\\*\\*\\[ PAGE|$)'));return match[1].split(/\r?\n\s*\r?\n/).map(s=>s.trim()).filter(s=>s&&!s.startsWith('>')&&s!=='***'&&!s.startsWith('# '));}
function start(n){out='';y=96;}
async function finish(n){
const verso=n%2===0;
const head=n===1?'':`<text class="se-running se-header-title" x="${verso?89:963}" y="48" text-anchor="${verso?'start':'end'}">The Wonderful World of Science</text><text class="se-running se-header-tag" x="${verso?963:89}" y="48" text-anchor="${verso?'end':'start'}">CHAPTER 1</text><line class="se-rule" x1="89" y1="65" x2="963" y2="65"/>`;
const fx=verso?89:917;
const footer=`<line class="se-footer-rule" x1="${verso?154:89}" y1="1332" x2="${verso?963:898}" y2="1332"/><text class="se-running se-footer-label" x="${verso?963:89}" y="1317" text-anchor="${verso?'end':'start'}">LEARNLAB · SCIENCE 6</text><path class="food-gold-tag" d="M${fx+7} 1306h39v25q0 22 -23 22t-23 -22v-18q0 -7 7 -7Z"/><path class="food-navy" d="M${fx+7} 1306h35v25q0 22 -21 22t-21 -22v-18q0 -7 7 -7Z"/><text class="se-folio" x="${fx+21}" y="1338" text-anchor="middle">${n}</text>`;
await fs.writeFile(`${dir}/p${String(n).padStart(3,'0')}.html`,`<section class="page page--food page--science-editorial${n===1?' page--opener':''}" data-folio="${n}" data-reference-page="${n}"${n===8?' data-close':''}><div class="page__body"><div class="page__main"><svg class="food-sheet science-sheet science-editorial" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1052 1514" aria-label="The Wonderful World of Science, page ${n}">${head}\n${out}\n${footer}</svg></div></div></section>\n`);if(y>1415)throw new Error(`Page ${n} extends beyond the content area: ${y}`);console.log(`Page ${n}: content ends at ${Math.round(y)} / 1415`);}
// Opener: the only display title in the chapter.
start(1);out+='<g aria-label="Chapter 1"><path class="food-gold-tag" d="M92 45H215V163Q215 230 147 230Q81 230 81 165V70Q81 45 92 45Z"/><path class="food-navy" d="M105 45H206V164Q206 234 143 234Q81 234 81 164V73Q81 45 105 45Z"/><text class="food-text food-white science-chapter-label" x="143" y="94" text-anchor="middle">CHAPTER</text><text class="food-text food-white science-chapter-number" x="143" y="211" text-anchor="middle">1</text></g>';label('The Wonderful',248,137,'se-title');label('World of Science',248,204,'se-title');img('ch01-p001-curiosity-cutout-v4.png','0 0 1979 795',55,270,942,435,'Two children observing a beetle, seedling and ripples in a puddle.');y=735;head('What Is Science?','1.1');
const b1=blocks(1).filter(s=>!s.startsWith('##'));for(let i=0;i<b1.length;i++)if(i===b1.length-1){explain(1);prompt(b1[i]);}else para(b1[i]);await finish(1);
// Reading page: compact subheads; the main column stays uninterrupted.
start(2);let topic=0;
for(const b of blocks(2)){
  if(b.startsWith('## ')){head(b.slice(3));y-=5;topic++;}
  else if(b.startsWith('**Why'))prompt(b);
  else if(b.startsWith('It is in the kitchen')||b.startsWith('Think of what we know')||b.startsWith('Curiosity is what')){
    const yy=y;
    const crops=['748 95 290 292','715 474 326 307','757 917 278 289'];
    const titles=['A dosa cooking in a pan.','An unfinished map and pencil.','An open flower and a closed bud.'];
    img('ch01-p002-reference.png',crops[topic-1],809,yy,154,156,titles[topic-1],'',topic===2?'<polygon points="810,474 1041,474 1041,781 950,781 715,720 715,705"/>':'');
    para(b,{w:704,gap:10});y=Math.max(y,yy+166);
  }else para(b,{gap:10});
}
await finish(2);
// The shared process is illustrated at the point it is introduced.
start(3);const b3=blocks(3);head(b3.shift().slice(3));for(let i=0;i<b3.length;i++){const b=b3[i];if(i===b3.length-1)explain(3);if(b.startsWith('**Can'))prompt(b);else para(b,{cls:i===b3.length-1?'se-takeaway':''});if(b==='Two involve evaporation directly; cloud formation needs another change as well.'){
const yy=y;for(const [x,vb,t] of [[89,'51 1047 300 296','Drying'],[386,'374 1047 300 296','Cooling'],[683,'702 1047 300 296','Cloud forming']]){crop('ch01-p003-one-idea-reference.png',vb,x,yy,280,216,t);label(t,x+60,yy+241,'se-caption');}y+=272;}}await finish(3);
// An invitation to the book: everyday objects introduce the text.
start(4);const b4=blocks(4);head(b4.shift().slice(3),'1.2');para(b4.shift());img('ch01-p003-reference.png','30 1080 994 270',89,y,874,170,'A seedling, food, water, everyday materials and the Moon.');y+=198;for(let i=0;i<b4.length;i++){if(i===b4.length-1)explain(4);para(b4[i],{cls:i===b4.length-1?'se-takeaway':''});}await finish(4);
// A worked observation: the picture belongs beside the first question.
start(5);const b5=blocks(5);b5.shift();out+=`<rect class="se-prompt" x="65" y="96" width="922" height="1210"/><line class="se-think-rule" x1="89" x2="963" y1="96" y2="96"/>`+learningCue('imagine','',89,y,E);y+=52;for(let i=0;i<b5.length;i++){para(b5[i],{cls:b5[i].startsWith('Question. Guess.')?'se-takeaway':''});if(i===2){
img('ch01-p005-reference.png','80 1045 925 350',89,y,874,295,'Clock hands touching and a replacement cell.','<rect class="food-white" x="603" y="1087" width="147" height="28"/><rect class="food-white" x="831" y="1090" width="47" height="28"/><text class="se-caption se-bold" x="608" y="1109">Hands touching</text><text class="se-caption se-bold" x="837" y="1112">Cell</text>');y+=317;}}await finish(5);
// Activity page: clear sequence, followed by visual prompts without writing space.
start(6);const b6=blocks(6);head(b6.shift().slice(3));for(const b of b6){if(b.startsWith('###'))break;if(/^\d\./.test(b)){for(const s of b.split(/\r?\n/))para(s,{gap:9});}else para(b);}
const fy=y+8;for(const [i,t] of ['Observe','Question','Guess','Test','Examine result'].entries()){const x=89+i*177;out+=`<rect class="se-process" x="${x}" y="${fy}" width="166" height="64" rx="8"/>`;label(t,x+12,fy+37,'se-caption');if(i<4)out+=`<path class="se-accent" d="M${x+167} ${fy+32}h10m-4 -4 4 4 -4 4"/>`;}
out+=`<path class="se-return" d="M880 ${fy+64}v18q0 18 -18 18H544q-14 0 -14 -14v-22"/><path class="se-accent" d="M525 ${fy+71}l5 -7 5 7"/>`;y=fy+128;
explain(6);activity('Activity 1.1 · Think and Write',b6.find(s=>s.startsWith('- ')).split(/\r?\n/).map(s=>'• '+s.slice(2)));await finish(6);
// People using science: individual pictures paired with the relevant prose.
start(7);y=86;const b7=blocks(7);head(b7.shift().slice(3));let k=0;for(const b of b7){if(b.startsWith('###'))break;if(k>=1&&k<=3){const yy=y;const vb=['0 0 680 724','690 0 758 724','1448 0 724 724'][k-1];img('ch01-p007-everyday-science.png',vb,777,yy,186,133,['','Cook inspecting batter','Tailor checking a needle','Electrician checking a disconnected fitting'][k]);para(b,{w:660});y=Math.max(y,yy+146);}else para(b);k++;}
const ai=b7.findIndex(s=>s.startsWith('###'));const items=[b7[ai+1],...b7[ai+2].split(/\r?\n/).map(s=>'• '+s.slice(2))];explain(7);activity('Activity 1.2 · Watch and Record',items);await finish(7);
// Quiet closing page; the final statement is a takeaway, not another title.
start(8);const b8=blocks(8);head(b8.shift().slice(3),'1.4');for(const b of b8){if(b.startsWith('###'))break;para(b);}explain(8);activity('Activity 1.3 · Think and Write',b8.find(s=>s.startsWith('- ')).split(/\r?\n/).map(s=>'• '+s.slice(2)));para(b8.at(-1),{cls:'se-takeaway'});await finish(8);
await fs.writeFile('assets/design-history/science-editorial-text-audit.json',JSON.stringify(texts,null,2));
await (await import('./science-botanical.mjs')).applyBotanical(dir);
