import fs from 'node:fs/promises';
const dir='pages/class-9/sci-ch01-exploration',ledger=[];
const edits=[
 ['A theory is what an idea is promoted to','In everyday speech, theory can mean an untested guess. A scientific theory is a broad explanatory framework assessed against evidence. It makes predictions and connects observations; the label does not make it immune to revision.'],
 ['Nothing arrives as a theory.','A hypothesis is a testable proposed explanation. A theory is not a hypothesis promoted after a fixed number of successful tests, and a theory does not become a law. The terms describe different roles, not ranks of certainty.'],
 ['Suppose, to keep it simple, that all their food is rice.','For an energy-equivalent estimate, assume four adults each need 2100 kilocalories daily and uncooked rice supplies 350 kilocalories per 100 g. That gives 600 g per adult daily, or about 72 kg for four adults over 30 days. These are stated model assumptions, not a diet recommendation.'],
 ['You ride from school to home.','With your teacher, mark a safe, unobstructed 10 m corridor. One learner walks normally while a partner times the walk. Repeat three times and record each time.'],
 ['Write two lists: what your model keeps','Use the measured average time to predict a 20 m walk at the same pace. Test that prediction. What changes if the walker starts from rest, turns a corner or changes speed? Keep observations separate from explanations.'],
 ['The symbol comes from the Latin','The speed of light in vacuum is exactly 299 792 458 metres per second in SI. Its fixed value helps define the metre. Measurements still test instruments and physical models, but the numerical value of this defining constant is not an experimental uncertainty.'],
 ['The whole flight follows','This model requires launch speed, angle, height, gravity and the relevant distances. Test whether its omissions are small enough for the question.'],
 ['one for a date next month','Forecast usefulness depends on the question and time scale. A prediction of one afternoon\'s rain differs from a probability for a month\'s average rainfall. Compare each forecast with the observation it actually claims to predict.']
];
const text=s=>s.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
function ranges(html){const stack=[],out=[];for(const m of html.matchAll(/<div\b[^>]*>|<\/div>/g)){if(m[0].startsWith('</')){const a=stack.pop();if(a)out.push({...a,end:m.index+6,close:m.index});}else stack.push({start:m.index,content:m.index+m[0].length,tag:m[0]});}return out;}
for(const f of (await fs.readdir(dir)).filter(f=>f.endsWith('.html'))){let s=await fs.readFile(`${dir}/${f}`,'utf8');
 s=s.replace(/<p\b([^>]*)>([\s\S]*?)<\/p>/g,(all,attrs,body)=>{const t=text(body),e=edits.find(([a])=>t.includes(a));if(!e)return all;ledger.push({file:f,before:t,after:e[1]});return `<p${attrs}>${e[1]}</p>`;});
 s=s.replace(/<div class="c-activity__safety">[\s\S]*?<\/div>/g,'<p>Walk; do not run. Keep the corridor clear and stop if anyone enters it.</p>');
 // Open explanations can break between paragraphs. They are not indivisible panels.
 const open=ranges(s).filter(r=>/class="science-feature science-feature--(?:reason|explain)"/.test(r.tag));
 for(const r of open.sort((a,b)=>b.start-a.start)){
  let body=s.slice(r.content,r.close);
  body=body.replace(/^(\s*)(<svg[\s\S]*?<\/svg>)\s*<div class="science-feature__title">([^<]*)<\/div>/,(_,sp,icon,title)=>`<h3 class="science-open-title ${r.tag.includes('--reason')?'se-feature--reason':'se-feature--explain'}">${icon}${title}</h3>`);
  // Remove obsolete inner wrappers, preserving their paragraphs and subheads.
  body=body.replace(/<div class="(?:c-thread__body|c-beyond__body|c-tip__body)">([\s\S]*)<\/div>\s*$/, '$1');
  body=body.replace(/<div class="(?:c-thread__title|c-beyond__title)">([\s\S]*?)<\/div>/g,'<h4>$1</h4>');
  s=s.slice(0,r.start)+body+s.slice(r.end);
 }
 await fs.writeFile(`${dir}/${f}`,s);
}
await fs.writeFile('assets/design-history/science-nine-final-revisions.json',JSON.stringify(ledger,null,2));
console.log(ledger.length+' additional corrections; open explanations released for fitting');
