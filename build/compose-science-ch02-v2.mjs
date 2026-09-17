import {scienceWord} from './science-defined-terms.mjs';
// Authoring compositor. The emitted HTML fragments, one per printed page,
// remain the printing sources. Do not rerun over manual page edits.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
import {learningCue,featureIcon} from './science-learning-cues.mjs';
const run=promisify(execFile), dir='pages/class-6/ch02-diversity-in-the-living-world-v2';
let md=await fs.readFile('assets/manuscripts/LearnLab_G6_Ch02_Diversity_in_the_Living_World.md','utf8');
const changes=[];
function replace(a,b,why){if(!md.includes(a))throw Error('Missing editorial anchor: '+a);md=md.replaceAll(a,b);changes.push({before:a,after:b,reason:why});}
replace('Write what you find in Tables 2.1 and 2.2.','Copy the headings of Tables 2.1 and 2.2 into your notebook. Add a row for each plant or animal you observe.','Textbook, not a workbook.');
replace('Fill in Table 2.3. Leave the last column empty for now.','Use the headings in Table 2.3 to make your own notebook table. Leave the last column empty for now.','Observation tables are models; recording belongs in the notebook.');
replace('Fill in Table 2.5.','Use Table 2.5 as a guide for your notebook table.','Textbook recording.');
replace('Draw what grew from each kind of seed. Draw both at the same size.','Draw what grew from each kind of seed in your notebook. Use the same scale for both drawings.','Keep the observed size difference.');
replace('In other leaves there is no thick middle vein and no net. Instead, many veins of the same thickness run side by side. They go from the base of the leaf to its tip, staying parallel all the way. This pattern is called **parallel venation**. A banana leaf has it. So does every blade of grass.','In other leaves, many veins run alongside one another. This pattern is called **parallel venation**. In a grass blade they run along the length of the leaf. A banana leaf has a strong middle vein, with many parallel side veins running out towards its edges. Parallel venation does not mean that a leaf has no middle vein.','Correct banana venation and remove the false absence of a midrib.');
replace('Once you know these two names, you can sort almost any leaf you pick up.','These two patterns help you compare many of the leaves around you. Look closely: real leaves sometimes show exceptions.','Avoid an absolute rule.');
replace('A taproot goes deep. It reaches water that lies far below the surface. This is why a deep-rooted tree can stay green through a dry month.','A taproot can grow deep and reach water below the surface. A deep root system can help a plant through a dry spell, although root depth also depends on the species and the soil.','Root type alone does not determine rooting depth.');
replace('Fibrous roots stay near the top and spread wide. They hold a large area of loose soil, and they catch light rain before it sinks away. This is why grass grows so well on a bank of loose earth.','Many fibrous root systems spread through the upper soil. A dense network helps hold loose soil together and take up water near the surface. Some fibrous roots also reach deep into the ground.','Qualify root distribution.');
replace('From the wheat seed, there will be no single main root. Instead, a bunch of thin roots of about the same thickness will have come out together and spread outward.','As the wheat seedling develops, several thin roots appear. Later, more roots grow from the base of the stem, forming a spreading bunch without one dominant main root.','A very young cereal seedling need not yet show its mature fibrous root system.');
replace('Later she became the head of the Botanical Survey of India. There she began the long job of recording India\'s plants properly.','In 1952 she became Officer on Special Duty at the Botanical Survey of India and helped reorganise its work.','Correct her documented appointment.');
replace('The columns hardly overlap. Almost nothing that lives easily in one column could survive in another. There is a reason for this. It is not chance.','Some living things occur in several surroundings; others have a much narrower range. Compare the conditions in each column. The features of a living thing help explain where it can survive.','Habitats overlap; broad habitat columns are not exclusive.');
replace('Its hooves are broad and flat.','Its two-toed feet have broad, spreading pads.','Camels have padded feet, not broad flat hooves.');
replace('Its legs are shorter, which keeps it steady on rock and steep ground.','Its sturdy legs also end in broad, padded, two-toed feet.','Avoid unsupported hoof and terrain contrast.');
replace('They hardly sweat at all.','They can allow their body temperature to rise during the day, reducing the water needed for cooling. They do sweat when necessary.','Camels can sweat.');
replace("the camel's hooves and hump","the camel's padded feet and hump",'Consistent anatomy.');
replace('Even the same kind of plant can show different adaptations in different places. Rhododendrons grow high in the Nilgiris, where the wind is strong. There they stay short, with small leaves that the wind cannot tear. The same kind of plant grows in more sheltered mountains in Sikkim. There it becomes a tall tree.','Rhododendrons include low shrubs and tall trees in different mountain regions. Their features reflect both inherited differences and growing conditions. Even plants of the same species may grow differently in a windy, exposed place and in a sheltered one. A change in one plant\'s growth is not the same as an inherited adaptation developing over generations.','Distinguish adaptation from growth responses and differences between species.');
replace('Some animals do not fit into either one. A frog spends part of its life in water and part on land. Animals that live in both ways are called **amphibians**.','Some animals use both land and water. Frogs belong to a group called **amphibians**; many amphibians spend part of their lives in each. But using both habitats does not make every animal an amphibian. A crocodile does so too, and it is a reptile.','Amphibian is an animal group, not a label for every land-and-water animal.');
replace('His surveys led directly to the protection of Keoladeo in Rajasthan and Ranganathittu in Karnataka.','His fieldwork and advocacy helped strengthen bird conservation in India.','Avoid overstating a direct causal claim.');
replace('In India, the Bengal tiger, the cheetah and the Great Indian bustard have all become fewer as their habitats have shrunk. Project Tiger began in 1973 to protect the tiger\'s forests. The bustard\'s grasslands are now protected areas in Gujarat, Rajasthan and Maharashtra.','Habitat loss has threatened animals such as the Bengal tiger and the Great Indian bustard. Project Tiger began in 1973 to protect tigers and their habitats. The cheetah was declared extinct in India in 1952; a reintroduction programme began in 2022. Protecting suitable habitat is essential to conservation.','Distinguish cheetah extinction and reintroduction from a continuing population decline.');
replace('They are protected not by law, but by agreement.','Community traditions and agreements protect many groves; some also have legal protection.','Avoid an inaccurate blanket statement about legal protection.');
replace('It is either reticulate or parallel.','Two common patterns are reticulate and parallel.','Qualify the summary.');
replace('Seeds have either two cotyledons (dicots) or one cotyledon (monocots).','Among flowering plants, dicots have two cotyledons and monocots have one.','Restrict the seed grouping to flowering plants.');
replace('Animals that live both ways are amphibians.','Many amphibians use both land and water, but not all animals that do so are amphibians.','Correct the summary too.');
replace('Write the aquatic ones in region A, the terrestrial ones in region B, and any that live in both in the middle part, C.','Draw the diagram in your notebook. Put the aquatic ones in region A, the terrestrial ones in region B, and any that use both in the middle part, C.','No write-in space in the textbook.');
replace('What could A and B be? Name one plant for each.','What leaf-venation group could A and B represent? Name one plant for each.','Do not imply that all non-reticulate plants are monocots.');
replace('Explain what is happening. Use the word *adaptation* in your answer.','Suggest how wind and shelter could affect its growth. Explain why this observation alone does not prove that a new inherited *adaptation* has developed.','Align the exercise with adaptation versus growth response.');
replace('This time keep one tray in bright light and one in a dark cupboard. Water both the same.','For each kind of seed, keep one tray in bright light and another in a dark cupboard. Water all trays equally.','Change one factor at a time, without confounding seed species with light.');
replace('Features that make a living thing fit to survive in a particular place are called **adaptations**.','Inherited features that help organisms survive and reproduce in their usual environment are called **adaptations**. They develop in populations over generations; an individual does not acquire a needed feature simply by trying.','Definition must support the later distinction from a growth response.');
replace('However many leaves you print, the patterns almost always fall into two kinds.','Compare the leaves you printed. Two common patterns help describe many flowering plants, but a small sample cannot establish a rule for every leaf.','Do not prescribe the observed result.');
replace('Which of your two root systems would be easier to pull out of soil? What would that mean for the plant?','Could drawings alone tell you which plant is harder to pull out? What would you need to keep alike in a comparison of root anchorage?','Root type does not by itself determine anchorage.');
replace('A climber and a creeper both have weak stems. Which one do you think gets more sunlight? Why?','A climber and a creeper both have stems that need support or spread along the ground. What observations would you need before deciding which receives more light?','Remove an underdetermined comparison.');
replace('And they pull water and minerals out of the soil.','They take up water and dissolved minerals from the soil.','Do not describe absorption as a mechanical pull.');
replace('A maize seed does not split like that. It has only one thin cotyledon.','A maize grain does not separate into two large cotyledons like chana. Its single cotyledon is visible in the cut-open diagram. Failure to split a seed is not itself proof of its cotyledon count.','Distinguish a convenient handling test from anatomical evidence.');
const revision= (await import('./revise-science-diversity.mjs')).reviseDiversity(md);
md=revision.md;changes.push(...revision.ledger);
await fs.writeFile('assets/design-history/science-v2/reading-copy.md',md);
await fs.writeFile('assets/design-history/science-v2/editorial-changes.json',JSON.stringify(changes,null,2));

const glossaryEntries=JSON.parse(await fs.readFile('build/science-ch02-glossary.json','utf8'));
const E=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function tokens(s){let b=false,i=false;return s.split(/\s+/).filter(Boolean).map(w=>{const p=[];for(const t of w.split(/(\*\*|\*)/)){if(t==='**')b=!b;else if(t==='*')i=!i;else if(t)p.push({s:t,k:b?'b':i?'i':'n'});}return p;});}
const art={1:['opener','',600],3:['plants','Grass                         Tulsi                         Hibiscus',290],9:['forms','Mango · tree                 Rose · shrub                 Tomato · herb',310],10:['climbers','Climber · grape vine                       Creeper · pumpkin',300],12:['veins','Hibiscus · reticulate             Banana · parallel             Grass · parallel',325],14:['roots','Chana · taproot                              Wheat · fibrous roots',325],17:['seeds','Chana · two cotyledons                         Maize · one cotyledon',320],21:['desert','Cactus · hot desert                         Deodar · cold mountain',300],22:['camels','Dromedary · one hump                         Bactrian · two humps',310],23:['feet','Duck · webbed foot                            Pigeon · no webbing',260],25:['grove','A sacred grove — a surviving patch of forest',300],27:['grains','(a) Wheat grains                              (b) Kidney beans',185],28:['goats','(a) Mountain goat                              (b) Goat of the plains',245]};
const extra=['Observe the illustration. How many kinds of living things can you find? Which might you miss if you were walking quickly?','Stay with your group. Do not touch any animal. Do not put your fingers into holes or under stones.','Copy the headings into your notebook and add your own observations. The rows below are examples, not a complete record.','Use scissors carefully, with your teacher’s guidance.','Use your notebook for the activities and questions in this chapter.','Some ways of grouping','Flowers','Stem','Food','Habitat','Reticulate venation?','Yes','No','A','B','C','Water','Land','A plant','Know a scientist',...Object.values(art).map(a=>a[1])];
extra.push('Compare these four leaves. You can sort the same set by its outline or by its edge.','Leaf C belongs with D when you compare outlines, but with A when you compare edges. The leaves have not changed; the grouping rule has.');
const terms=new Set([' ']);for(const w of tokens(md+' '+extra.join(' ')+' '+glossaryEntries.flat().join(' ')))for(const p of w)terms.add(p.s);
const probe=path.resolve('build/_ch02-v2-type-measure.html');
await fs.writeFile(probe,`<html><head><link rel="stylesheet" href="../css/fonts.css"><link rel="stylesheet" href="../css/science-v2-fonts.css"></head><body><script>onload=async()=>{await Promise.all(['400 24px "Source Serif 4"','700 24px "Source Serif 4"','italic 400 24px "Source Serif 4"','700 19.55px "Source Sans 3"','700 28.06px "Source Sans 3"'].map(f=>document.fonts.load(f)));const c=document.createElement('canvas').getContext('2d'),m={};for(const [k,f] of [['n','400 24px "Source Serif 4"'],['b','700 24px "Source Serif 4"'],['i','italic 400 24px "Source Serif 4"'],['t','700 19.55px "Source Sans 3"'],['h','700 28.06px "Source Sans 3"']]){c.font=f;m[k]={};for(const w of ${JSON.stringify([...terms])})m[k][w]=c.measureText(w).width;}document.title='METRICS'+JSON.stringify(m);};</script></body></html>`);
const {stdout}=await run('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--virtual-time-budget=8000','--dump-dom',pathToFileURL(probe).href],{maxBuffer:20e6});
await fs.unlink(probe);
const widths=JSON.parse(stdout.match(/METRICS(.*?)<\/title>/s)[1].replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>'));
function textWidth(s,k='n'){return tokens(s).reduce((v,w,ix)=>v+(ix?widths[k][' ']:0)+w.reduce((a,p)=>a+(widths[k==='n'?p.k:k][p.s]??p.s.length*12),0),0);}
function wrap(s,w,k='n',scale=1){const lines=[];let row=[],len=0;for(const t of tokens(s)){const tw=t.reduce((a,p)=>a+(widths[k==='n'?p.k:k][p.s]??p.s.length*12)*scale,0);if(row.length&&len+widths[k][' ']*scale+tw>w){lines.push(row);row=[];len=0;}if(row.length)len+=widths[k][' ']*scale;row.push(t);len+=tw;}if(row.length)lines.push(row);return lines;}
const word=t=>scienceWord(t,E);
function linesSVG(lines,x,y,cls='se-copy',lead=32,size=24,measure=null){return `<text class="${cls}"${measure?` data-measure="${measure}"`:""} x="${x}" y="${y+size}">${lines.map((l,i)=>`<tspan x="${x}"${i?` dy="${lead}"`:''}>${l.map(word).join(' ')}</tspan>`).join('')}</text>`;}
function label(s,x,y,cls='se-caption',anchor='start'){return `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${E(s)}</text>`;}
let atoms=[],sourcePage=0;
function add(h,render,type='body',text=''){atoms.push({h,render,type,text,sourcePage});}
function para(s,options={}){const {x=89,w=874,gap=14,cls='se-copy'}=options,l=wrap(s,w),kind=s.startsWith('Inherited features')?'explain':s.startsWith('Also separate an observation')?'reason':null,offset=kind?56:0;add(l.length*32+gap+offset,y=>(kind?learningCue(kind,'',x,y,E):'')+linesSVG(l,x,y+offset,cls,31,23,w),'body',s);}
function heading(s){const l=wrap(s,874,'h');add(l.length*42+20,y=>linesSVG(l,89,y,'se-heading',42,30),'heading',s);}
function prompt(s){s=s.replace(/^\*\*(Think:|Observe:|Predict:|What do you notice\?|What do you predict\?|Can you explain why\?)\*\*\s*/,'');
 const pause=/^Your search lasted|^A pigeon walks|^Could drawings alone/.test(s);
 if(!pause){para(s);return;}
 const l=wrap(s,826),h=l.length*32+92;
 add(h+18,y=>`<rect class="se-prompt se-thought-panel" x="89" y="${y}" width="874" height="${h}"/>`+learningCue('think','',113,y+17,E)+linesSVG(l,113,y+72),'panel',s);
}
function illustration(spec){const [key,caption,h]=spec;
if(key==='seeds'){
 add(582,y=>label('Two cotyledons',350,y+23,'se-caption','middle')+label('One cotyledon',760,y+23,'se-caption','middle')+
 `<image class="science-illustration" href="../../figures/class-6/science/ch02-v2/seeds.png" x="89" y="${y+68}" width="874" height="427" preserveAspectRatio="xMidYMid meet"/>`+
 `<path class="se-accent" d="M330 ${y+30}L238 ${y+210}M370 ${y+30}L510 ${y+210}M760 ${y+30}L747 ${y+305}M866 ${y+525}L864 ${y+285}"/>`+
 label('Chana opened',350,y+530,'se-caption','middle')+label('Endosperm (food store)',817,y+555,'se-caption','middle')+
 label('Maize cut lengthwise',800,y+580,'se-caption','middle'),'figure','Seed anatomy: two chana cotyledons; one maize cotyledon beside the endosperm.');return;
}
if(false&&key==='grove'&&atoms.at(-1)?.type==='body'){
 const preceding=atoms.pop(),ls=wrap(preceding.text,540),height=Math.max(ls.length*32+14,285);
 add(height+20,y=>linesSVG(ls,89,y)+`<image class="science-illustration" href="../../figures/class-6/science/ch02-v2/${key}.png" x="657" y="${y}" width="306" height="240" preserveAspectRatio="xMidYMid meet"/>`+label('A sacred grove',810,y+270,'se-caption','middle'),'figure',preceding.text+' '+caption);return;
}
const render=(y,grow=0)=>{const height=h+grow,parts=caption.split(/ {2,}/),iw=Math.min(874,height*2),left=526-iw/2;
const positions=key==='forms'?[.25,.63,.9]:key==='seeds'?[.30,.82]:parts.length===3?[1/6,.5,5/6]:parts.length===2?[.25,.75]:[.5];
return `<image class="science-illustration" href="../../figures/class-6/science/ch02-v2/${key}.png" x="89" y="${y}" width="874" height="${height}" preserveAspectRatio="xMidYMid meet"><title>${E(caption||'Living things in a schoolyard')}</title></image>`+(caption?parts.map((s,i)=>label(s,left+iw*positions[i],y+height+28,'se-caption','middle')).join(''):'');};
add(h+(caption?49:20),render,'figure',caption);atoms.at(-1).artKey=key;atoms.at(-1).artHeight=h;}
function glossary(){
 const columns=[glossaryEntries.slice(0,12),glossaryEntries.slice(12)], rows=columns.map(col=>{let top=0;return col.map(([term,meaning])=>{const lines=wrap('**'+term+'** — '+meaning,398);const row={top,lines};top+=lines.length*32+12;return row;});});
 const h=Math.max(...rows.map(col=>col.at(-1).top+col.at(-1).lines.length*32))+54;
 if(h>1240)throw Error('Glossary exceeds one page');
 add(h,y=>'<rect class="se-glossary-panel" x="89" y="'+y+'" width="874" height="'+h+'" rx="20"/>'+rows.map((col,i)=>col.map(r=>linesSVG(r.lines,113+i*428,y+25+r.top)).join('')).join(''),'glossary',glossaryEntries.map(e=>e.join(': ')).join('\n'));
}
function activity(title,blocks){if(/^Activity 2\.2 /.test(title)){prompt(blocks.filter(b=>b!=='**What to do:**').map(b=>b.replace(/^\d+\.\s*/, '').replace(/^\*\*(Observe:|Think:|Predict:)\*\*\s*/, '')).join(' '));return;}const questions=[];blocks=blocks.map(b=>b.replace(/^\*\*(Observe:|Think:|Predict:)\*\*\s*/,''));title='Investigate';const rootSetup=sourcePage===13;const inner=[];let yy=65;for(const b of blocks){if(b==='**What to do:**')continue;const match=b.match(/^(\d+)\.\s+([\s\S]+)/),s=match?match[2]:b,x=match?146:113,w=rootSetup&&inner.length===0?500:match?793:826,l=wrap(s,w);inner.push({l,x,y:yy,n:match?.[1]});yy+=l.length*32+12;if(rootSetup&&inner.length===1)yy=Math.max(yy,245);}
const h=yy+12,tab=Math.min(874,Math.ceil(textWidth(title,'t'))+32);if(h+20>1174)throw Error('Activity too tall: '+title+' '+h);
let breathing=0;
add(h+34,y=>`<rect class="se-activity-panel" x="89" y="${y}" width="874" height="${h+breathing*inner.length}" rx="18"/><g class="v2-investigate-icon"><circle cx="128" cy="${y+30}" r="12"/><path d="M137 ${y+39}l10 10"/></g>`+label(title,160,y+39,'se-activity-tab-text')+(rootSetup?`<image class="science-illustration" href="../../figures/class-6/science/ch02-v2/root-setup-v2.png" x="648" y="${y+57}" width="285" height="190" preserveAspectRatio="xMidYMid meet"/>`:'')+inner.map((r,i)=>(r.n?label(r.n+'.',128,y+r.y+i*breathing+23,'se-activity-step','end'):'')+linesSVG(r.l,r.x,y+r.y+i*breathing)).join(''),'activity',title+'\n'+blocks.join('\n'));
atoms.at(-1).breathe=amount=>{breathing=amount/inner.length;};atoms.at(-1).breathingLimit=inner.length*8;
if(questions.length)prompt(questions.map(s=>s.replace(/^\*\*(Observe:|Think:|Predict:)\*\*\s*/,'')).join(' '));
}
function table(raw,title){let rows=raw.split('\n').filter(s=>s.trim().startsWith('|')).map(s=>s.trim().slice(1,-1).split('|').map(v=>v.trim())).filter(r=>!r.every(v=>/^:?-+:?$/.test(v)));
rows=rows.filter((r,i)=>i===0||r.slice(1).some(v=>v));
if(rows[0][0]==='S. no.')rows=rows.map(r=>r.slice(1));
// Shorter column captions retain the same observation fields at readable size.
const names={'Name (or your description)':'Name / description','Stem — soft or hard, thin or thick':'Stem','Leaves — shape and how they sit':'Leaves','Flowers — colour and shape':'Flowers','Shorter / same / taller than you':'Height compared with you','Stem green or brown':'Stem colour','Stem soft or hard':'Stem texture','Branches low or high':'Branching','Venation (reticulate / parallel)':'Venation','What it was doing or eating':'Doing / eating','Any other region':'Other region'};
rows[0]=rows[0].map(s=>names[s]??s);const count=rows[0].length,cell=874/count,pad=12;
let yy=title?42:12;const entries=rows.map((r,i)=>{const ls=r.map(s=>wrap(s||'—',cell-pad*2,'n',.88)),h=Math.max(...ls.map(l=>l.length))*27+22;const row={ls,yy,h,i};yy+=h;return row;});
const h=yy+14;add(h,y=>(title?label(title,89,y+23,'se-caption se-bold'):'')+`<rect class="v2-table-frame" x="89" y="${y+entries[0].yy}" width="874" height="${yy-entries[0].yy}"/>`+Array.from({length:count-1},(_,i)=>`<line class="v2-rule" x1="${89+(i+1)*cell}" x2="${89+(i+1)*cell}" y1="${y+entries[0].yy}" y2="${y+yy}"/>`).join('')+entries.map(r=>`${r.i===0?`<rect class="se-table-head" x="89" y="${y+r.yy}" width="874" height="${r.h}"/>`:''}<line class="se-rule" x1="89" x2="963" y1="${y+r.yy+r.h}" y2="${y+r.yy+r.h}"/>`+r.ls.map((l,i)=>linesSVG(l,89+i*cell+pad,y+r.yy+9,`se-copy se-table-copy${r.i===0?' se-bold':''}`,27,21.12)).join('')).join(''),'table',title+'\n'+rows.map(r=>r.join(' | ')).join('\n'));
}
function diagram(kind){if(kind==='grouping'){add(120,y=>['Flowers','Stem','Food','Habitat'].map((s,i)=>label(s,198+i*217,y+44,'se-heading','middle')).join('')+`<line class="se-accent" x1="89" x2="963" y1="${y+64}" y2="${y+64}"/>`+label('Some ways of grouping',526,y+98,'se-caption','middle'),'figure','Some ways of grouping');}
if(kind==='venn'){add(220,y=>`<ellipse class="se-accent" cx="436" cy="${y+100}" rx="150" ry="84"/><ellipse class="se-accent" cx="616" cy="${y+100}" rx="150" ry="84"/>`+label('A',374,y+106,'se-heading','middle')+label('C',526,y+106,'se-heading','middle')+label('B',677,y+106,'se-heading','middle')+label('Water',365,y+207,'se-caption','middle')+label('Land',686,y+207,'se-caption','middle'),'figure','Habitat diagram A water, B land, C both');}
if(kind==='flow'){add(205,y=>`<rect class="se-process" x="319" y="${y+8}" width="414" height="55" rx="10"/>`+label('Reticulate venation?',526,y+42,'se-caption','middle')+`<path class="se-accent" d="M430 ${y+63}v49H350v40m-5 -6 5 6 5 -6M622 ${y+63}v49h80v40m-5 -6 5 6 5 -6"/>`+label('Yes',400,y+97,'se-caption')+label('No',647,y+97,'se-caption')+label('A',350,y+182,'se-heading','middle')+label('B',702,y+182,'se-heading','middle'),'figure','Reticulate venation? Yes A, No B');}}

const sections=[...md.matchAll(/\*\*\[ PAGE (\d+)[^\n]*\*\*([\s\S]*?)(?=\*\*\[ PAGE|$)/g)];
for(const match of sections){sourcePage=Number(match[1]);const bs=match[2].split(/\r?\n\s*\r?\n/).map(s=>s.trim()).filter(s=>s&&s!=='***');let figure=0;
for(let i=0;i<bs.length;i++){const b=bs[i];if(b.startsWith('# '))continue;
if(b.startsWith('### Activity')){const title=b.replace(/^### /,'').replace(' — ',' · '),items=[];while(i+1<bs.length&&!/^(#|\*\*Table|\||>)/.test(bs[i+1])){const next=bs[++i];if(/^\d+\./.test(next))items.push(...next.split(/\r?\n(?=\d+\.)/));else items.push(next);}
if(title.startsWith('Activity 2.1 '))items.push('**Safety:** '+extra[1]);if(title.startsWith('Activity 2.3 '))items.push('**Safety:** '+extra[3]);activity(title,items);continue;}
if(b==='## Keywords'){heading('Keywords');glossary();i++;continue;}
if(/^#{2,3} /.test(b)){heading(b.replace(/^#{2,3} /,''));continue;}
if(b.startsWith('>')){if(b.includes('**Illustration:')){figure++;if(sourcePage===7)diagram('grouping');else if(sourcePage===27&&figure===2)diagram('venn');else if(sourcePage===28&&figure===2)diagram('flow');else if(art[sourcePage])illustration(art[sourcePage]);}continue;}
if(b.startsWith('**Table')){if(bs[i+1]?.startsWith('|')){table(bs[++i],b.replaceAll('**',''));}continue;}
if(b.startsWith('|')){table(b,'Comparing flowering plants — typical features');continue;}
if(/^\*\*(Think:|Predict:|What do|Can you)/.test(b)){prompt(b);continue;}
if(b.startsWith('**Janaki')||b.startsWith('**Salim')){heading('Know a scientist');para(b);continue;}
if(b.startsWith('- ')){for(const item of b.split(/\r?\n(?=- )/))para('• '+item.slice(2),{gap:12});continue;}
para(b);
}}

await fs.writeFile('assets/design-history/science-v2/atoms.json',JSON.stringify(atoms.map(({h,type,text,sourcePage,artKey})=>({h,type,text,sourcePage,artKey})),null,2));
await (await import('./layout-science-ch02-v2.mjs')).composeV2(atoms,{wrap,linesSVG,label,dir,E});
