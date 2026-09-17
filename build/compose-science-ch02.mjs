import {scienceWord} from './science-defined-terms.mjs';
// Authoring compositor. The emitted HTML fragments, one per printed page,
// remain the printing sources. Do not rerun over manual page edits.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
import {learningCue,featureIcon} from './science-learning-cues.mjs';
const run=promisify(execFile), dir='pages/class-6/ch02-diversity-in-the-living-world';
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
await fs.writeFile('assets/manuscripts/ch02-edited-reading-copy.md',md);
await fs.writeFile('assets/design-history/ch02-editorial-changes.json',JSON.stringify(changes,null,2));

const glossaryEntries=JSON.parse(await fs.readFile('build/science-ch02-glossary.json','utf8'));
const E=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function tokens(s){let b=false,i=false;return s.split(/\s+/).filter(Boolean).map(w=>{const p=[];for(const t of w.split(/(\*\*|\*)/)){if(t==='**')b=!b;else if(t==='*')i=!i;else if(t)p.push({s:t,k:b?'b':i?'i':'n'});}return p;});}
const art={1:['opener','',600],3:['plants','Grass                         Tulsi                         Hibiscus',290],9:['forms','Mango · tree                 Rose · shrub                 Tomato · herb',310],10:['climbers','Climber · grape vine                       Creeper · pumpkin',300],12:['veins','Hibiscus · reticulate             Banana · parallel             Grass · parallel',325],14:['roots','Chana · taproot                              Wheat · fibrous roots',325],17:['seeds','Chana · two cotyledons                         Maize · one cotyledon',320],21:['desert','Cactus · hot desert                         Deodar · cold mountain',300],22:['camels','Dromedary · one hump                         Bactrian · two humps',310],23:['feet','Duck · webbed foot                            Pigeon · no webbing',260],25:['grove','A sacred grove — a surviving patch of forest',300],27:['grains','(a) Wheat grains                              (b) Kidney beans',185],28:['goats','(a) Mountain goat                              (b) Goat of the plains',245]};
const extra=['Observe the illustration. How many kinds of living things can you find? Which might you miss if you were walking quickly?','Stay with your group. Do not touch any animal. Do not put your fingers into holes or under stones.','Copy the headings into your notebook and add your own observations. The rows below are examples, not a complete record.','Use scissors carefully, with your teacher’s guidance.','Use your notebook for the activities and questions in this chapter.','Some ways of grouping','Flowers','Stem','Food','Habitat','Reticulate venation?','Yes','No','A','B','C','Water','Land','A plant','Know a scientist',...Object.values(art).map(a=>a[1])];
const terms=new Set([' ']);for(const w of tokens(md+' '+extra.join(' ')+' '+glossaryEntries.flat().join(' ')))for(const p of w)terms.add(p.s);
const probe=path.resolve('build/_ch02-type-measure.html');
await fs.writeFile(probe,`<html><head><link rel="stylesheet" href="../css/fonts.css"><link rel="stylesheet" href="../css/reference-fonts.css"></head><body><script>onload=async()=>{await Promise.all(['500 23px Spectral','700 23px Spectral','italic 500 23px Spectral','700 19.55px Food Poppins','700 28.06px Food Poppins'].map(f=>document.fonts.load(f)));const c=document.createElement('canvas').getContext('2d'),m={};for(const [k,f] of [['n','500 23px Spectral'],['b','700 23px Spectral'],['i','italic 500 23px Spectral'],['t','700 19.55px Food Poppins'],['h','700 28.06px Food Poppins']]){c.font=f;m[k]={};for(const w of ${JSON.stringify([...terms])})m[k][w]=c.measureText(w).width;}document.title='METRICS'+JSON.stringify(m);};</script></body></html>`);
const {stdout}=await run('C:/Program Files/Google/Chrome/Application/chrome.exe',['--headless=new','--disable-gpu','--virtual-time-budget=8000','--dump-dom',pathToFileURL(probe).href],{maxBuffer:20e6});
await fs.unlink(probe);
const widths=JSON.parse(stdout.match(/METRICS(.*?)<\/title>/s)[1].replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&gt;','>'));
function textWidth(s,k='n'){return tokens(s).reduce((v,w,ix)=>v+(ix?widths[k][' ']:0)+w.reduce((a,p)=>a+(widths[k==='n'?p.k:k][p.s]??p.s.length*12),0),0);}
function wrap(s,w,k='n',scale=1){const lines=[];let row=[],len=0;for(const t of tokens(s)){const tw=t.reduce((a,p)=>a+(widths[k==='n'?p.k:k][p.s]??p.s.length*12)*scale,0);if(row.length&&len+widths[k][' ']*scale+tw>w){lines.push(row);row=[];len=0;}if(row.length)len+=widths[k][' ']*scale;row.push(t);len+=tw;}if(row.length)lines.push(row);return lines;}
const word=t=>scienceWord(t,E);
function linesSVG(lines,x,y,cls='se-copy',lead=31,size=23,measure=null){return `<text class="${cls}"${measure?` data-measure="${measure}"`:""} x="${x}" y="${y+size}">${lines.map((l,i)=>`<tspan x="${x}"${i?` dy="${lead}"`:''}>${l.map(word).join(' ')}</tspan>`).join('')}</text>`;}
function label(s,x,y,cls='se-caption',anchor='start'){return `<text class="${cls}" x="${x}" y="${y}" text-anchor="${anchor}">${E(s)}</text>`;}
let atoms=[],sourcePage=0;
function add(h,render,type='body',text=''){atoms.push({h,render,type,text,sourcePage});}
function para(s,options={}){const {x=89,w=874,gap=14,cls='se-copy'}=options,l=wrap(s,w),kind=s.startsWith('Inherited features')?'explain':s.startsWith('Also separate an observation')?'reason':null,offset=kind?56:0;add(l.length*31+gap+offset,y=>(kind?learningCue(kind,'',x,y,E):'')+linesSVG(l,x,y+offset,cls,31,23,w),'body',s);}
function heading(s){const l=wrap(s,874,'h');add(l.length*39+16,y=>linesSVG(l,89,y,'se-heading',39,28),'heading',s);}
function prompt(s){s=s.replace(/^\*\*(Think:|Observe:|Predict:|What do you notice\?|What do you predict\?|Can you explain why\?)\*\*\s*/,'');
 const pause=/^Your search lasted|^A pigeon walks|^Could drawings alone/.test(s);
 if(!pause){para(s);return;}
 const l=wrap(s,826),h=l.length*31+92;
 add(h+18,y=>`<rect class="se-prompt se-thought-panel" x="89" y="${y}" width="874" height="${h}"/>`+learningCue('think','',113,y+17,E)+linesSVG(l,113,y+72),'panel',s);
}
function illustration(spec){const [key,caption,h]=spec;
if(key==='seeds'){
 add(582,y=>label('Two cotyledons',350,y+23,'se-caption','middle')+label('One cotyledon',760,y+23,'se-caption','middle')+
 `<image class="science-illustration" href="../../figures/class-6/science/ch02/seeds.png" x="89" y="${y+68}" width="874" height="427" preserveAspectRatio="xMidYMid meet"/>`+
 `<path class="se-accent" d="M330 ${y+30}L238 ${y+210}M370 ${y+30}L510 ${y+210}M760 ${y+30}L747 ${y+305}M866 ${y+525}L864 ${y+285}"/>`+
 label('Chana opened',350,y+530,'se-caption','middle')+label('Endosperm (food store)',817,y+555,'se-caption','middle')+
 label('Maize cut lengthwise',800,y+580,'se-caption','middle'),'figure','Seed anatomy: two chana cotyledons; one maize cotyledon beside the endosperm.');return;
}
if(false&&key==='grove'&&atoms.at(-1)?.type==='body'){
 const preceding=atoms.pop(),ls=wrap(preceding.text,540),height=Math.max(ls.length*31+14,285);
 add(height+20,y=>linesSVG(ls,89,y)+`<image class="science-illustration" href="../../figures/class-6/science/ch02/${key}.png" x="657" y="${y}" width="306" height="240" preserveAspectRatio="xMidYMid meet"/>`+label('A sacred grove',810,y+270,'se-caption','middle'),'figure',preceding.text+' '+caption);return;
}
const render=(y,grow=0)=>{const height=h+grow,parts=caption.split(/ {2,}/),iw=Math.min(874,height*2),left=526-iw/2;
const positions=key==='forms'?[.25,.63,.9]:key==='seeds'?[.30,.82]:parts.length===3?[1/6,.5,5/6]:parts.length===2?[.25,.75]:[.5];
return `<image class="science-illustration" href="../../figures/class-6/science/ch02/${key}.png" x="89" y="${y}" width="874" height="${height}" preserveAspectRatio="xMidYMid meet"><title>${E(caption||'Living things in a schoolyard')}</title></image>`+(caption?parts.map((s,i)=>label(s,left+iw*positions[i],y+height+28,'se-caption','middle')).join(''):'');};
add(h+(caption?49:20),render,'figure',caption);atoms.at(-1).artKey=key;atoms.at(-1).artHeight=h;}
function glossary(){
 const columns=[glossaryEntries.slice(0,12),glossaryEntries.slice(12)], rows=columns.map(col=>{let top=0;return col.map(([term,meaning])=>{const lines=wrap('**'+term+'** — '+meaning,398);const row={top,lines};top+=lines.length*31+12;return row;});});
 const h=Math.max(...rows.map(col=>col.at(-1).top+col.at(-1).lines.length*31))+54;
 if(h>1240)throw Error('Glossary exceeds one page');
 add(h,y=>'<rect class="se-glossary-panel" x="89" y="'+y+'" width="874" height="'+h+'" rx="20"/>'+rows.map((col,i)=>col.map(r=>linesSVG(r.lines,113+i*428,y+25+r.top)).join('')).join(''),'glossary',glossaryEntries.map(e=>e.join(': ')).join('\n'));
}
function activity(title,blocks){if(/^Activity 2\.2 /.test(title)){prompt(blocks.filter(b=>b!=='**What to do:**').map(b=>b.replace(/^\d+\.\s*/, '').replace(/^\*\*(Observe:|Think:|Predict:)\*\*\s*/, '')).join(' '));return;}const questions=[];blocks=blocks.map(b=>b.replace(/^\*\*(Observe:|Think:|Predict:)\*\*\s*/,''));title='Investigate';const inner=[];let yy=53;for(const b of blocks){if(b==='**What to do:**')continue;const match=b.match(/^(\d+)\.\s+([\s\S]+)/),s=match?match[2]:b,x=match?146:113,w=match?793:826,l=wrap(s,w);inner.push({l,x,y:yy,n:match?.[1]});yy+=l.length*31+12;}
const h=yy+12,tab=Math.min(874,Math.ceil(textWidth(title,'t'))+32);if(h+20>1174)throw Error('Activity too tall: '+title+' '+h);
let breathing=0;
add(h+34,y=>`<rect class="se-activity-panel" x="89" y="${y+14}" width="874" height="${h+breathing*inner.length}" rx="20"/><rect class="se-activity-tab" x="89" y="${y}" width="${tab}" height="40" rx="12"/>`+label(title,105,y+28,'se-activity-tab-text')+inner.map((r,i)=>(r.n?label(r.n+'.',128,y+r.y+i*breathing+23,'se-activity-step','end'):'')+linesSVG(r.l,r.x,y+r.y+i*breathing)).join(''),'activity',title+'\n'+blocks.join('\n'));
atoms.at(-1).breathe=amount=>{breathing=amount/inner.length;};atoms.at(-1).breathingLimit=inner.length*8;
if(questions.length)prompt(questions.map(s=>s.replace(/^\*\*(Observe:|Think:|Predict:)\*\*\s*/,'')).join(' '));
}
function table(raw,title){let rows=raw.split('\n').filter(s=>s.trim().startsWith('|')).map(s=>s.trim().slice(1,-1).split('|').map(v=>v.trim())).filter(r=>!r.every(v=>/^:?-+:?$/.test(v)));
rows=rows.filter((r,i)=>i===0||r.slice(1).some(v=>v));
if(rows[0][0]==='S. no.')rows=rows.map(r=>r.slice(1));
// Shorter column captions retain the same observation fields at readable size.
const names={'Name (or your description)':'Name / description','Stem — soft or hard, thin or thick':'Stem','Leaves — shape and how they sit':'Leaves','Flowers — colour and shape':'Flowers','Shorter / same / taller than you':'Height compared with you','Stem green or brown':'Stem colour','Stem soft or hard':'Stem texture','Branches low or high':'Branching','Venation (reticulate / parallel)':'Venation','What it was doing or eating':'Doing / eating','Any other region':'Other region'};
rows[0]=rows[0].map(s=>names[s]??s);const count=rows[0].length,cell=874/count,pad=12;
let yy=title?42:12;const entries=rows.map((r,i)=>{const ls=r.map(s=>wrap(s||'—',cell-pad*2,'n',.8)),h=Math.max(...ls.map(l=>l.length))*25+22;const row={ls,yy,h,i};yy+=h;return row;});
const h=yy+14;add(h,y=>(title?label(title,89,y+23,'se-caption se-bold'):'')+entries.map(r=>`${r.i===0?`<rect class="se-table-head" x="89" y="${y+r.yy}" width="874" height="${r.h}"/>`:''}<line class="se-rule" x1="89" x2="963" y1="${y+r.yy+r.h}" y2="${y+r.yy+r.h}"/>`+r.ls.map((l,i)=>linesSVG(l,89+i*cell+pad,y+r.yy+9,`se-copy se-table-copy${r.i===0?' se-bold':''}`,25,18.4)).join('')).join(''),'table',title+'\n'+rows.map(r=>r.join(' | ')).join('\n'));
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
// The opener keeps its illustration above the reading. Its text is not shortened.
const first=atoms.filter(a=>a.sourcePage===1),openerArt=first.find(a=>a.type==='figure');atoms=atoms.filter(a=>a.sourcePage!==1);const openerBody=first.filter(a=>a!==openerArt);
const pages=[{atoms:[openerArt,...openerBody],start:280}];
// Whole components in fixed order. Choose breaks with a global rag penalty;
// don't strand a heading with fewer than five lines of following matter.
const N=atoms.length,cap=1319,dp=Array(N+1).fill(Infinity),ends=Array(N);dp[N]=0;
const boundaries=new Set(atoms.flatMap((atom,i)=>atom.type==='heading'&&['Keywords','Summary','Let Us Enhance Our Learning','Learning Further'].includes(atom.text)?[i]:[]));
function validBreak(a,b){if([...boundaries].some(i=>i>a&&i<b))return false;if(atoms[b]?.type==='activity'&&atoms[b-1]?.sourcePage===15)return false;for(let h=b-1;h>=a;h--){if(atoms[h].type==='heading'){const after=atoms.slice(h+1,b).reduce((v,x)=>v+x.h,0);return after>=155;}if(atoms[h].h>=155)break;}return atoms[b-1]?.type!=='heading';}
for(let a=N-1;a>=0;a--){let sum=0;for(let b=a+1;b<=N;b++){sum+=atoms[b-1].h;if(sum>cap)break;if(!validBreak(a,b))continue;const gap=cap-sum,cost=(b===N?gap*gap*.025:gap*gap)+dp[b]+10000000;if(cost<dp[a]){dp[a]=cost;ends[a]=b;}}}
if(!Number.isFinite(dp[0]))throw Error('No valid page packing; inspect oversized atom.');
for(let a=0;a<N;){const b=ends[a];pages.push({atoms:atoms.slice(a,b),start:96});a=b;}
// Keep the closing invitation together rather than stranding a few bullets.
const beforeLast=pages.at(-2),last=pages.at(-1);
if(beforeLast&&last){const at=beforeLast.atoms.findIndex(a=>a.type==='heading'&&a.text==='Learning Further');
 if(at>=0){const closing=[...beforeLast.atoms.slice(at),...last.atoms];if(closing.reduce((s,a)=>s+a.h,0)<=1319){beforeLast.atoms=beforeLast.atoms.slice(0,at);last.atoms=closing;}}
}
// Finish the summary on its own page instead of leaving one bullet above
// the exercise opener. The whole bullet fits without changing any type.
if(false&&pages[25]?.atoms[0]?.sourcePage===26&&pages[25].atoms[0].type==='body'){
 const lastSummary=pages[25].atoms[0];
 if(pages[24].start+pages[24].atoms.reduce((s,a)=>s+a.h,0)+lastSummary.h<=1415)pages[24].atoms.push(pages[25].atoms.shift());
}
// Keep the two instructions for interpreting a rubbing on its activity page.
for(let i=0;i<pages.length-1;i++){
 const next=pages[i+1].atoms[0];
 if(next?.text.startsWith('Compare the vein pattern separately')&&pages[i].start+pages[i].atoms.reduce((s,a)=>s+a.h,0)+next.h<=1415)pages[i].atoms.push(pages[i+1].atoms.shift());
}
// Keep the last plant inference with its table, and the movement question with its records.
for(let i=0;i<pages.length-1;i++){
 const p=pages[i],q=pages[i+1],next=q.atoms[0];
 const preferred=next?.text.startsWith('Suppose a leaf pattern is clear')||next?.text.startsWith('A pigeon walks');
 if(preferred&&p.start+p.atoms.reduce((s,a)=>s+a.h,0)+next.h<=1415)p.atoms.push(q.atoms.shift());
 if(q.atoms[0]?.text==='2.3 Living Things and Their Surroundings'){
  const stop=q.atoms.findIndex(a=>a.type==='table');
  const move=q.atoms.slice(0,stop);
  if(stop>0&&p.start+[...p.atoms,...move].reduce((s,a)=>s+a.h,0)<=1415)p.atoms.push(...q.atoms.splice(0,stop));
 }
}
// Seat each habitat comparison with its picture; the conservation section closes the lesson.
const habitatStart=pages.findIndex(p=>p.atoms[0]?.text.startsWith('Table 2.6:'));
const glossaryStart=pages.findIndex(p=>p.atoms[0]?.text==='Keywords');
if(habitatStart>=0&&glossaryStart>habitatStart){
 const flow=pages.slice(habitatStart,glossaryStart).flatMap(p=>p.atoms),groups=[];
 const endings=[a=>a.text.startsWith('These features were not chosen'),a=>a.text.startsWith('You may have heard that a camel'),a=>a.artKey==='feet',a=>a.text.startsWith('**Salim Ali')];
 for(const ends of endings){const ix=flow.findIndex(ends);if(ix<0)throw Error('Missing habitat boundary');groups.push({start:96,atoms:flow.splice(0,ix+1)});}
 groups.push({start:96,atoms:flow});
 for(const p of groups)if(p.atoms.reduce((v,a)=>v+a.h,96)>1415)throw Error('Habitat composition too tall');
 pages.splice(habitatStart,glossaryStart-habitatStart,...groups);
}
// Read habitat and habitat loss as one sequence. Seat the conservation biography
// with conservation, instead of stretching habitat paragraphs to fill a sheet.
const habitatPage=pages.find(p=>p.atoms[0]?.text==='Habitat');
const conservationPage=pages.find(p=>p.atoms[0]?.text==='When a Habitat Is Lost');
if(habitatPage&&conservationPage){
 const scientist=habitatPage.atoms.findIndex(a=>a.text==='Know a scientist');
 const biography=habitatPage.atoms.splice(scientist);
 const until=conservationPage.atoms.findIndex(a=>a.text.startsWith('Habitat loss has threatened'));
 habitatPage.atoms.push(...conservationPage.atoms.splice(0,until));
 conservationPage.atoms.unshift(...biography);
}
// Art-directed illustration sizes: complexity and instructional role, never page fill.
const illustrationHeights={opener:600,plants:290,forms:390,climbers:360,veins:400,roots:380,desert:300,camels:340,feet:260,grove:300,grains:185,goats:245};
// Keep existing page joins while restoring each illustration's intended scale.
// Content is authored in lesson order, never appended according to a gap.
for(const [pageIndex,page] of pages.entries()){
 const used=()=>page.start+page.atoms.reduce((s,a)=>s+a.h,0),target=1280;
 if(pageIndex===pages.length-1||page.atoms.some(a=>a.type==='glossary'))continue;
 const artAtom=page.atoms.find(a=>a.artKey);
 if(artAtom){const gain=illustrationHeights[artAtom.artKey]-artAtom.artHeight;if(!Number.isFinite(gain))throw Error('Missing illustration size: '+artAtom.artKey);const original=artAtom.render;artAtom.render=y=>original(y,gain);artAtom.h+=gain;}
 for(const a of page.atoms.filter(a=>a.breathe)){
  const gain=Math.max(0,Math.min(a.breathingLimit,target-used()));a.breathe(gain);a.h+=gain;
 }
 const spaces=page.atoms.slice(0,-1).filter(a=>a.type==='body'||a.type==='figure'||a.type==='table');
 const extra=Math.max(0,Math.min(page.atoms[0]?.text==='Summary'?22:8,(target-used())/Math.max(1,spaces.length)));
 for(const a of spaces)a.h+=extra;
}
const editorialLayouts=(await import('./layout-science-ch02.mjs')).layoutDiversity(pages,{wrap,linesSVG,label});
await fs.writeFile('assets/design-history/ch02-editorial-layouts.json',JSON.stringify(editorialLayouts,null,2));
const editorialAdditions=editorialLayouts.flatMap(p=>p.addedText||[]);
if(editorialAdditions.length)await fs.appendFile('assets/manuscripts/ch02-edited-reading-copy.md','\n\n## Conservation: checking the evidence\n\n'+editorialAdditions.join('\n\n')+'\n');
await fs.writeFile('assets/design-history/ch02-added-context.json',JSON.stringify({retired:true,reason:'No page-fill-driven prose. Editorial guidance is sequenced in the reading copy.'},null,2));
await fs.mkdir(dir,{recursive:true});const old=await fs.readdir(dir);for(const f of old)if(/^p\d+\.html$/.test(f))await fs.unlink(path.join(dir,f));
const audit=[];
for(let ix=0;ix<pages.length;ix++){const n=ix+1,page=pages[ix],verso=n%2===0;let y=page.start;
let content=page.atoms.map(a=>{const s=a.render(y);y+=a.h;return s;}).join('\n');
if(n===1)content=`<g aria-label="Chapter 2"><path class="food-gold-tag" d="M92 45H215V163Q215 230 147 230Q81 230 81 165V70Q81 45 92 45Z"/><path class="food-navy" d="M105 45H206V164Q206 234 143 234Q81 234 81 164V73Q81 45 105 45Z"/><text class="food-text food-white science-chapter-label" x="143" y="94" text-anchor="middle">CHAPTER</text><text class="food-text food-white science-chapter-number" x="143" y="211" text-anchor="middle">2</text></g>`+label('Diversity in the',248,137,'se-title')+label('Living World',248,204,'se-title')+content;
const head=n===1?'':label('Diversity in the Living World',verso?89:963,48,'se-running se-header-title',verso?'start':'end')+label('CHAPTER 2',verso?963:89,48,'se-running se-header-tag',verso?'end':'start')+'<line class="se-rule" x1="89" y1="65" x2="963" y2="65"/>';
const fx=verso?89:917,footer=`<line class="se-footer-rule" x1="${verso?154:89}" y1="1332" x2="${verso?963:898}" y2="1332"/>`+label('LEARNLAB · SCIENCE 6',verso?963:89,1317,'se-running se-footer-label',verso?'end':'start')+`<path class="food-gold-tag" d="M${fx+7} 1306h39v25q0 22 -23 22t-23 -22v-18q0 -7 7 -7Z"/><path class="food-navy" d="M${fx+7} 1306h35v25q0 22 -21 22t-21 -22v-18q0 -7 7 -7Z"/>`+label(String(n),fx+21,1338,'se-folio','middle');
if(y>1415)throw Error(`Page ${n} overflows: ${y}`);
await fs.writeFile(`${dir}/p${String(n).padStart(3,'0')}.html`,`<section class="page page--food page--science-editorial${n===1?' page--opener':''}" data-folio="${n}"${n===pages.length?' data-close':''}><div class="page__body"><div class="page__main"><svg class="food-sheet science-sheet science-editorial" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1052 1514" aria-label="Diversity in the Living World, page ${n}">${head}\n${content}\n${footer}</svg></div></div></section>\n`);
audit.push({page:n,end:y,fill:Math.round((y-96)/1319*100),sourcePages:[...new Set(page.atoms.map(a=>a.sourcePage))],text:page.atoms.flatMap(a=>a.readingText||[a.text])});console.log(`Page ${n}: ${Math.round(y)}/1415, manuscript ${audit.at(-1).sourcePages.join(', ')}`);
}
await fs.writeFile('assets/design-history/ch02-page-audit.json',JSON.stringify(audit,null,2));
console.log(`${pages.length} pages; ${changes.length} explicit editorial replacements.`);
await (await import('./science-botanical.mjs')).applyBotanical(dir);

