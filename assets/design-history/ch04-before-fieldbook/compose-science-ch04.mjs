// Chapter 4 authoring compositor; printing sources are the emitted fixed pages.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
const run=promisify(execFile),dir='pages/class-6/ch04-exploring-magnets';
let md=await fs.readFile('assets/manuscripts/LearnLab_G6_Ch04_Exploring_Magnets.md','utf8');
const changes=[];
function edit(a,b,reason){if(!md.includes(a))throw Error('Missing anchor '+a);md=md.replaceAll(a,b);changes.push({before:a,after:b,reason});}
edit('There were no engines then, and no maps of the open ocean.','Those sailing ships had no engines, and finding a course across open water was difficult.','Avoid claiming that historical sailors had no charts.');
edit('Steel is made mostly of iron, so steel is magnetic too.','Steel is made mostly of iron. Many kinds of steel are magnetic, though some stainless steels are not.','Steel composition and structure affect magnetic behaviour.');
edit('Iron, steel, nickel and cobalt are magnetic.','Iron, nickel, cobalt and many kinds of steel are magnetic.','Consistent qualification.');
edit('Try the same thing with a U-shaped magnet and with a ring magnet. You will find the same result. The filings gather at two places. Every magnet has two poles, whatever its shape.','A U-shaped magnet has poles at its two tips. In many school ring magnets, one flat face is North and the other is South. Pole positions depend on how a magnet is made; they need not look like the ends of a bar.','Do not misrepresent ring magnet poles.');
edit('So the pull of a magnet is strongest at its two ends.','For this bar magnet, the pull is strongest near its two ends.','Specify bar geometry.');
edit('The pull of a magnet is strongest at its two ends. These ends are called the North pole and the South pole.','A bar magnet pulls most strongly near its two ends, called the North pole and the South pole.','Specify bar geometry in summary.');
edit('A magnet with only one pole does not exist.','Breaking an ordinary magnet does not give a piece with just one pole.','Limit the claim to the experiment.');
edit('A magnet with a single pole does not exist.','Each broken piece still has both poles.','Consistent school-level statement.');
edit('You will find that the hanging magnet stops along the north-south line, every single time.','Away from nearby magnets and iron objects, it settles along the magnetic north-south line. This is usually close to geographic north-south, but not exactly the same.','Magnetic declination; NOAA.');
edit('If it always settles north-south, it is a magnet. If it settles anywhere at all, it is not.','If the same end repeatedly points towards magnetic north, that is evidence that the bar is magnetised. Check that it turns freely and that no nearby magnet is disturbing it.','A negative test is not conclusive.');
edit('an iron sewing needle','a steel sewing needle','Ordinary sewing needles are steel.');
edit('Push the needle sideways through the piece of cork, so the needle stays level.','Ask an adult to secure the needle flat on top of the cork with a small piece of tape, so it stays level.','Avoid pushing a sharp needle towards a hand.');
edit('Long before the modern compass came into common use, Indian sailors used something very similar. A piece of iron was magnetised and shaped like a fish. It was placed in a vessel of oil, where it could turn freely and settle along the north-south line.','Accounts of Indian navigation describe a fish-shaped magnetised iron device placed in oil so that it could turn towards north-south. This is often compared with a floating compass.','Avoid unsupported dating and an unexplained solid-iron floating claim.');
edit('The oil served a purpose. It was thicker than water, so the fish did not swing wildly every time the ship rocked.','A liquid can slow down a turning magnet. The essential idea is to support the magnet so it can turn freely. A solid piece of iron will sink unless its shape or a floating support keeps it at the surface.','Clarify buoyancy and avoid unsupported historical mechanism.');
edit('So repulsion is the sure test. **If something repels a magnet, it must itself be a magnet.**','For the magnets and plain iron bars in these experiments, repulsion is the sure test. **A bar that repels one pole of a magnet is itself magnetised.**','Scope the rule to the school experiment.');
edit('Mobile phones, watches, television remotes, computers and bank cards can all be damaged by a magnet kept close to them.','Keep strong magnets away from compasses, mechanical watches, magnetic-stripe cards and magnetically stored data. Follow the maker’s advice for electronic devices; not every device is affected in the same way.','Remove blanket claim about all electronics.');
edit('Three bar magnets are arranged end to end on a table in a zigzag shape. One end is marked N.','Three bar magnets are arranged end to end on a table in a zigzag shape. Each pair of neighbouring ends attracts. One end is marked N.','The original question is underdetermined without the attraction condition.');
edit('and will not come down, however long you wait','and remains suspended','Avoid an absolute duration claim.');
const context=JSON.parse(await fs.readFile('assets/manuscripts/ch04-editorial-context.json','utf8'));
const finalContext={
2:['A fridge seal can contain a flexible magnetic strip. A school bar magnet is rigid. These are different designs, but both use magnetic attraction to do a job. Look for the material the magnet pulls on as well as the magnet itself.'],
3:['An object that does not stick may simply be too far from the magnet. Bring the magnet close without forcing the object against it. If a result surprises you, repeat the test and compare it with a known steel paper clip.','Record what you tested precisely: “steel blade” is more useful than “sharpener”. Another group can then repeat your test on the same material.'],
4:['A non-magnetic covering can hide a magnetic material. For example, a plastic-coated steel clip may still be attracted. This does not show that the plastic is magnetic; it shows that the magnet can act on the steel inside.'],
6:['A ring magnet deserves a closer look. In a common school ring magnet, the poles are on the two broad faces, not on the inside and outside edges. Two such rings on a rod can attract or repel depending on which faces meet.','The letters N and S are a useful record of the poles. If the letters rub off, the poles remain. You can identify them again by comparing the magnet with a marked magnet or by letting it turn freely.'],
8:['A compass direction is a local observation. Nearby iron and other magnets can change it. That is why checking the surroundings is part of the experiment, just as important as waiting for the magnet to stop.'],
9:['Keep the compass level while reading it. A tilted needle may catch against its support or case. If it seems stuck, put the compass on a flat surface and wait before trusting the direction it shows.'],
11:['A model helps us understand a working principle without reproducing every historical detail. Your bowl compass demonstrates free turning and magnetic alignment. It does not establish exactly how a particular old instrument was built.'],
12:['The round pencils reduce rubbing between magnet A and the table. Without them, the magnetic force might be present but too weak to overcome the friction. A magnet that does not move immediately has not necessarily stopped exerting a force.'],
16:['For the racing cars, identify the two ends that face each other before you let the cars move. Then turn just one magnet around. This changes the facing poles while keeping the cars and their wheels the same.'],
17:['The soft-iron pieces used for storage are called keepers. They join unlike poles across each end of the pair. This arrangement is useful for traditional school bar magnets; different modern magnets may come with their own storage instructions.','Store the magnets in a secure container so they cannot snap onto tools or slide off a shelf. Keep the keeper pieces together with their magnets. A missing keeper cannot do its job if it is left at the bottom of a drawer.','Use a separate place for the compass. Its needle is a small magnet, and a nearby strong magnet can disturb its direction. Put the compass away only after you have moved the experimental magnets back to their storage place.'],
18:['Check the evidence behind each idea. For magnetic materials, recall the object test. For pole strength, recall the filings. For direction, recall the freely hanging magnet. For attraction and repulsion, recall the two magnets on pencils.','Explain these differences to a partner: a magnet and a magnetic material; attraction and repulsion; a prediction and an observation. Give one example from an activity for each pair.','Finally, choose one result that surprised you. State what you predicted, what you observed and how the observation changed your explanation. Use the result itself as your reason.']
};
for(const [k,v] of Object.entries(finalContext))context[k]=[...(context[k]||[]),...v];
context[5].push('Compare the pattern before and after gently tapping the paper. Tapping helps the grains move; it does not create the magnetic poles.');
context[6].push('Size and pole identity are different properties of a magnet.');
context[17].push('Handle magnets gently when taking them out for the next lesson.');
await fs.writeFile('assets/design-history/ch04-complete-context.json',JSON.stringify(context,null,2));
edit('Now stand the piece of wood upright between the magnet and the compass. Do not move the magnet or the compass.','Stand the wood in the gap. Keep both the magnet and compass still.','Shorten the instruction to keep Activity 4.7 and its observations together.');
await fs.writeFile('assets/manuscripts/ch04-edited-reading-copy.md',md);
await fs.writeFile('assets/design-history/ch04-editorial-changes.json',JSON.stringify(changes,null,2));
const E=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function tokens(s){let b=false,i=false;return s.split(/\s+/).filter(Boolean).map(w=>{const p=[];for(const t of w.split(/(\*\*|\*)/)){if(t==='**')b=!b;else if(t==='*')i=!i;else if(t)p.push({s:t,k:b?'b':i?'i':'n'});}return p;});}

const extra=['Activity','Safety','Comparing poles','Object','Material','Prediction','Observation','Complete the tables in your notebook.','Exploring Magnets'];
const terms=new Set([' ']);for(const w of tokens(md+' '+extra.join(' ')+' '+Object.values(context).flat().join(' ')))for(const p of w)terms.add(p.s);
const probe=path.resolve('build/_ch04-type-measure.html');
await fs.writeFile(probe,`<html><head><link rel="stylesheet" href="../css/fonts.css"><link rel="stylesheet" href="../css/reference-fonts.css"></head><body><script>onload=async()=>{await Promise.all(['500 23px Spectral','700 23px Spectral','italic 500 23px Spectral','700 19.55px Food Poppins','700 28.06px Food Poppins'].map(f=>document.fonts.load(f)));const c=document.createElement('canvas').getContext('2d'),m={};for(const [k,f] of [['n','500 23px Spectral'],['b','700 23px Spectral'],['i','italic 500 23px Spectral'],['t','700 19.55px Food Poppins'],['h','700 28.06px Food Poppins']]){c.font=f;m[k]={};for(const w of ${JSON.stringify([...terms])})m[k][w]=c.measureText(w).width;}document.title='METRICS'+JSON.stringify(m);};</script></body></html>`);
const {stdout}=await run('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--virtual-time-budget=8000','--dump-dom',pathToFileURL(probe).href],{maxBuffer:20e6});
await fs.unlink(probe);
const widths=JSON.parse(stdout.match(/METRICS(.*?)<\/title>/s)[1].replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>'));
function textWidth(s,k='n'){return tokens(s).reduce((v,w,ix)=>v+(ix?widths[k][' ']:0)+w.reduce((a,p)=>a+(widths[k==='n'?p.k:k][p.s]??p.s.length*12),0),0);}
function wrap(s,w,k='n',scale=1){const lines=[];let row=[],len=0;for(const t of tokens(s)){const tw=t.reduce((a,p)=>a+(widths[k==='n'?p.k:k][p.s]??p.s.length*12)*scale,0);if(row.length&&len+widths[k][' ']*scale+tw>w){lines.push(row);row=[];len=0;}if(row.length)len+=widths[k][' ']*scale;row.push(t);len+=tw;}if(row.length)lines.push(row);return lines;}
const word=t=>t.map(p=>p.k==='n'?E(p.s):`<tspan class="${p.k==='b'?'se-bold':'se-italic'}">${E(p.s)}</tspan>`).join('');
function linesSVG(lines,x,y,cls='se-copy',lead=31,size=23){return `<text class="${cls}" x="${x}" y="${y+size}">${lines.map((l,i)=>`<tspan x="${x}"${i?` dy="${lead}"`:''}>${l.map(word).join(' ')}</tspan>`).join('')}</text>`;}
function label(s,x,y,cls='se-caption',anchor='start'){return `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${E(s)}</text>`;}
let atoms=[],sourcePage=0;
function add(h,render,type='body',text=''){atoms.push({h,render,type,text,sourcePage});}
function para(s,options={}){const {x=89,w=874,gap=14,cls='se-copy'}=options,l=wrap(s,w);add(l.length*31+gap,y=>linesSVG(l,x,y,cls),'body',s);}
function heading(s){const l=wrap(s,874,'h');add(l.length*39+16,y=>linesSVG(l,89,y,'se-heading',39,28),'heading',s);}
function prompt(s){const l=wrap(s,826),h=l.length*31+36;add(h+18,y=>`<rect class="se-prompt" x="89" y="${y}" width="874" height="${h}" rx="10"/>`+linesSVG(l,113,y+16),'panel',s);}
function table(raw,title){let rows=raw.split('\n').filter(s=>s.trim().startsWith('|')).map(s=>s.trim().slice(1,-1).split('|').map(v=>v.trim())).filter(r=>!r.every(v=>/^:?-+:?$/.test(v)));
rows=rows.filter((r,i)=>i===0||r.some(v=>v));
if(rows[0][0]==='S. no.')rows=rows.map(r=>r.slice(1));
// Shorter column captions retain the same observation fields at readable size.
const names={'Name (or your description)':'Name / description','Stem — soft or hard, thin or thick':'Stem','Leaves — shape and how they sit':'Leaves','Flowers — colour and shape':'Flowers','Shorter / same / taller than you':'Height compared with you','Stem green or brown':'Stem colour','Stem soft or hard':'Stem texture','Branches low or high':'Branching','Venation (reticulate / parallel)':'Venation','What it was doing or eating':'Doing / eating','Any other region':'Other region'};
rows[0]=rows[0].map(s=>names[s]??s);const count=rows[0].length,cell=874/count,pad=12;
let yy=title?42:12;const entries=rows.map((r,i)=>{const ls=r.map(s=>wrap(s||'—',cell-pad*2,'n',.8)),h=Math.max(...ls.map(l=>l.length))*25+22;const row={ls,yy,h,i};yy+=h;return row;});
const h=yy+14;add(h,y=>(title?label(title,89,y+23,'se-caption se-bold'):'')+entries.map(r=>`${r.i===0?`<rect class="se-table-head" x="89" y="${y+r.yy}" width="874" height="${r.h}"/>`:''}<line class="se-rule" x1="89" x2="963" y1="${y+r.yy+r.h}" y2="${y+r.yy+r.h}"/>`+r.ls.map((l,i)=>linesSVG(l,89+i*cell+pad,y+r.yy+9,`se-copy se-table-copy${r.i===0?' se-bold':''}`,25,18.4)).join('')).join(''),'table',title+'\n'+rows.map(r=>r.join(' | ')).join('\n'));
}
const {drawing}=await import('./magnets-diagrams.mjs');
function figure(key){const d=drawing(key);return {h:d.h+28,type:'figure',text:'Figure: '+key,sourcePage,render:y=>`<svg class="science-illustration" x="89" y="${y}" width="874" height="${d.h}" viewBox="0 0 874 ${d.h}">${d.svg}</svg>`};}
function activity(title,blocks,key){let yy=57;const inner=[];for(const b of blocks){if(b==='**What to do:**')continue;const m=b.match(/^(\d+)\.\s+([\s\S]+)/),s=m?m[2]:b,x=m?146:113,w=m?793:826,l=wrap(s,w);inner.push({l,x,y:yy,n:m?.[1]});yy+=l.length*31+12;}
const d=key?drawing(key):null,artY=yy;if(d)yy+=d.h+18;const h=yy+15,tab=Math.min(874,Math.ceil(textWidth(title,'t'))+36);if(h>1280)throw Error('Activity too tall: '+title+' '+h);
add(h+33,y=>`<rect class="se-activity-panel" x="89" y="${y+14}" width="874" height="${h}" rx="20"/><rect class="se-activity-tab" x="89" y="${y}" width="${tab}" height="40" rx="12"/>`+label(title,107,y+28,'se-activity-tab-text')+inner.map(r=>(r.n?label(r.n+'.',130,y+r.y+23,'se-activity-step','end'):'')+linesSVG(r.l,r.x,y+r.y)).join('')+(d?`<svg class="science-illustration" x="113" y="${y+artY}" width="826" height="${d.h}" viewBox="0 0 874 ${d.h}">${d.svg}</svg>`:''),'activity',title+'\n'+blocks.join('\n'));}
const safety={1:'**Safety:** Keep small magnets and objects away from young children. Never put a magnet in your mouth.',2:'**Safety:** Do not touch your eyes or breathe in iron filings. Keep them on the paper, collect them carefully and wash your hands afterwards.',4:'**Safety:** Sewing needles are sharp. Ask an adult to tape the needle to the cork. Keep its point away from hands.',7:'**Safety:** Use only smooth-edged glass handled by your teacher; do not use broken glass.'};
const activityArt={2:'filings',3:'hanging',4:'bowl',5:'forces',6:'near',7:'barrier'};
const sections=[...md.matchAll(/\*\*\[ PAGE (\d+)[^\n]*\*\*([\s\S]*?)(?=\*\*\[ PAGE|$)/g)];
for(const match of sections){sourcePage=Number(match[1]);const bs=match[2].split(/\r?\n\s*\r?\n/).map(s=>s.trim()).filter(s=>s&&s!=='***');let fig=0;
for(let i=0;i<bs.length;i++){const b=bs[i];if(b.startsWith('# '))continue;
if(b.startsWith('### Activity')){const title=b.replace(/^### /,'').replace(' — ',' · '),num=+title.match(/4\.(\d+)/)[1],items=[];while(i+1<bs.length&&!/^(#|\*\*Table|\||>)/.test(bs[i+1])){const next=bs[i+1];if(num===6&&next.startsWith('When the North'))break;i++;if(/^\d+\./.test(next))items.push(...next.split(/\r?\n(?=\d+\.)/));else items.push(next);}if(safety[num])items.push(safety[num]);activity(title,items,activityArt[num]);continue;}
if(/^#{2,3} /.test(b)){heading(b.replace(/^#{2,3} /,''));if(sourcePage===19)para('Answer the questions and complete the tables in your notebook.');continue;}
if(b.startsWith('>')){if(b.includes('**Illustration:')){fig++;const key=({2:'shapes',6:'broken',8:'hanging',9:'compass',11:'fish',16:'games',17:'store'})[sourcePage]||(sourcePage===20?(fig===1?'rings':'zigzag'):null);if(sourcePage===1){add(345,y=>`<image class="science-illustration" href="../../figures/class-6/science/ch04/opener.png" x="89" y="${y}" width="874" height="325" preserveAspectRatio="xMidYMid meet"/>`,'figure','Opening illustration');}else if(key)atoms.push(figure(key));}continue;}
if(b.startsWith('**Table')){if(bs[i+1]?.startsWith('|')){if(sourcePage!==15)para('Copy these headings into your notebook and record your observations.');let raw=bs[++i].replace('Material it is made of','Material').replace('Will it stick? (my prediction)','Prediction').replace('Did it stick? (what I saw)','Observation').replace('Material placed in between','Material').replace('What happened to the needle','Needle observation');raw=raw.split('\n').filter(r=>!/^\| [4-8] \|\s*\|/.test(r)).join('\n');table(raw,b.replaceAll('**',''));}continue;}
if(b.startsWith('|')){table(b,'');continue;}
if(/^\*\*(Think:|Predict:)/.test(b)){prompt(b);continue;}
if(b.startsWith('- ')){for(const item of b.split(/\r?\n(?=- )/))para('• '+item.slice(2),{gap:12});continue;}
if(b.startsWith('(i)')){for(const item of b.split(/\r?\n/))para(item,{gap:10});continue;}
para(b);
}}
// Keep questions with their figure or answer table; these are single reading units.
for(let i=1;i<atoms.length;i++){if(['figure','table'].includes(atoms[i].type)&&/^\*\*\d+\.\*\*/.test(atoms[i-1].text)){const a=atoms[i-1],b=atoms[i];atoms.splice(i-1,2,{...a,type:'question',h:a.h+b.h,render:y=>a.render(y)+b.render(y+a.h),text:a.text+'\n'+b.text});i--;}}
// Place the pole comparison beside the explanation of attraction and repulsion.
sourcePage=13;atoms.splice(atoms.findLastIndex(a=>a.sourcePage===13)+1,0,figure('forces'));
// Add explanatory context at each manuscript join; preserve the original separately.
for(const [sp,notes] of Object.entries(context)){let at=atoms.findLastIndex(a=>a.sourcePage===+sp)+1;for(const note of notes){const l=wrap(note,874);atoms.splice(at++,0,{h:l.length*31+14,render:y=>linesSVG(l,89,y),type:'context',text:note,sourcePage:+sp});}}
// Keep the final invitation as one unit, and do not let it trail over a page turn.
const learningAt=atoms.findIndex(a=>a.type==='heading'&&a.text==='Learning Further');
if(learningAt>=0){const group=atoms.splice(learningAt),height=group.reduce((s,a)=>s+a.h,0);atoms.push({type:'closing',text:group.map(a=>a.text).join('\n'),h:height,sourcePage:21,render:y=>{let yy=y;return group.map(a=>{const s=a.render(yy);yy+=a.h;return s;}).join('');}});}
const first=atoms.filter(a=>a.sourcePage===1),openerArt=first.find(a=>a.type==='figure');
openerArt.h=535;openerArt.render=y=>`<image class="science-illustration" href="../../figures/class-6/science/ch04/opener.png" x="89" y="${y}" width="874" height="515" preserveAspectRatio="xMidYMid meet"/>`;
atoms=atoms.filter(a=>a.sourcePage!==1);
const pages=[{atoms:[openerArt,...first.filter(a=>a!==openerArt)],start:265}];
const N=atoms.length,cap=1310;
if(atoms.some(a=>a.h>cap))throw Error('A complete component exceeds the reading area.');
// The manuscript's lesson units make deliberate page turns. Keep each together
// where it fits; only a longer unit may break between complete components.
for(let start=0;start<N;){let end=start+1;while(end<N&&atoms[end].sourcePage===atoms[start].sourcePage)end++;
 const group=atoms.slice(start,end);let chunk=[],height=0;
 for(const atom of group){if(height+atom.h>cap&&chunk.length){if(chunk.at(-1).type==='heading')throw Error('Heading would strand');pages.push({atoms:chunk,start:96});chunk=[];height=0;}chunk.push(atom);height+=atom.h;}
 if(chunk.length){if(height<200&&pages.at(-1).atoms.at(-1).sourcePage===chunk[0].sourcePage){const prev=pages.at(-1);while(height<450&&prev.atoms.length>1){const moved=prev.atoms.pop();chunk.unshift(moved);height+=moved.h;} }pages.push({atoms:chunk,start:96});}start=end;
}
await fs.mkdir(dir,{recursive:true});await fs.writeFile(dir+'/chapter.json',JSON.stringify({class:'6',number:'4',title:'Exploring Magnets',subject:'Science',startFolio:1,design:'science-editorial',edition:'science-tall'},null,2));
const audit=[];
for(let ix=0;ix<pages.length;ix++){const n=ix+1,page=pages[ix];let y=page.start,content=page.atoms.map(a=>{const s=a.render(y);y+=a.h;return s;}).join('\n');
if(n===1)content=`<g aria-label="Chapter 4"><path class="food-gold-tag" d="M92 45H215V163Q215 230 147 230Q81 230 81 165V70Q81 45 92 45Z"/><path class="food-navy" d="M105 45H206V164Q206 234 143 234Q81 234 81 164V73Q81 45 105 45Z"/><text class="food-text food-white science-chapter-label" x="143" y="94" text-anchor="middle">CHAPTER</text><text class="food-text food-white science-chapter-number" x="143" y="211" text-anchor="middle">4</text></g>`+label('Exploring',248,137,'se-title')+label('Magnets',248,204,'se-title')+content;
if(y>1415)throw Error('Overflow '+n+' '+y);
await fs.writeFile(`${dir}/p${String(n).padStart(3,'0')}.html`,`<section class="page page--food page--science-editorial${n===1?' page--opener':''}" data-folio="${n}"${n===pages.length?' data-close':''}><div class="page__body"><div class="page__main"><svg class="food-sheet science-sheet science-editorial" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1052 1514" aria-label="Exploring Magnets, page ${n}">${content}</svg></div></div></section>\n`);
audit.push({page:n,end:y,fill:Math.round((y-page.start)/(1415-page.start)*100),sourcePages:[...new Set(page.atoms.map(a=>a.sourcePage))],text:page.atoms.map(a=>a.text)});console.log(`Page ${n}: ${y}/1415 (${audit.at(-1).fill}%)`);}
// Remove only superseded page sources generated by this compositor.
for(const f of await fs.readdir(dir))if(/^p\d+\.html$/.test(f)&&+f.slice(1,4)>pages.length)await fs.unlink(path.join(dir,f));
await fs.writeFile('assets/design-history/ch04-page-audit.json',JSON.stringify(audit,null,2));
await (await import('./science-botanical.mjs')).applyBotanical(dir);
console.log(`${pages.length} pages; ${changes.length} logged editorial corrections.`);
