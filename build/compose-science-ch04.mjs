import {scienceWord} from './science-defined-terms.mjs';
import {requireLegacyScience} from './science-g6-legacy-guard.mjs';
await requireLegacyScience('pages/class-6/ch04-exploring-magnets');
// Chapter 4 authoring compositor; printing sources are the emitted fixed pages.
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {pathToFileURL} from 'node:url';
import {magnetRevisions,revise} from './science-editorial-revisions.mjs';
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
md=revise(md,magnetRevisions,changes);
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
// Remove padding and claims superseded by the revised mechanisms.
context[5]=['Compare the pattern before and after gently tapping the paper. Tapping helps grains move; it does not create poles. Keep the amount of filings and the paper position the same.'];
context[6]=context[6].filter(s=>s!=='Size and pole identity are different properties of a magnet.');
context[11]=context[11].filter(s=>!s.startsWith('A model helps'));
context[16].push('In a clip chain, the nearby magnet induces magnetisation in the clips. Remove it and compare the chain: some steel may retain magnetisation, so do not prescribe that every chain must fall apart.');
context[17]=context[17].filter(s=>!s.includes('missing keeper')&&!s.startsWith('Handle magnets gently'));
context[18]=context[18].filter(s=>!s.startsWith('Check the evidence'));
// Keep useful controls; cut repeated explanations that merely pad the original page plan.
context[2]=context[2].filter(s=>s.startsWith('A magnet’s shape'));
context[3]=context[3].filter(s=>s.startsWith('Test a part')||s.startsWith('An object that'));
context[6]=context[6].filter(s=>s.startsWith('The letters N'));
context[11]=context[11].filter(s=>s.startsWith('Compare the two designs'));
context[17]=context[17].slice(0,1);
context[18]=context[18].filter(s=>s.startsWith('Explain these differences'));
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
const word=t=>scienceWord(t,E);

await (await import('./magnets-illustrated.mjs')).compose({md,context,wrap,textWidth,word,E,dir,fs});
if(!process.argv.includes('--measure')){
 await run(process.execPath,['build/build.mjs','class-6/ch04-exploring-magnets'],{maxBuffer:16e6});
 await (await import('./justify-science-lines.mjs')).justify('class-6/ch04-exploring-magnets');
}
