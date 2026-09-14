import fs from 'node:fs/promises';
import {featureNames,featureIcon} from './science-learning-cues.mjs';
const dir='pages/class-9/sci-ch01-exploration',ledger=[];
const replacements=[
 ['Notice that a model is not really true or false.', 'Models make claims that can agree or disagree with evidence. Their usefulness depends on the purpose and accuracy required; calling something a model does not exempt it from testing.'],
 ['Three things have to be in it:', 'A first model needs launch speed, launch direction, launch height and gravitational acceleration. It also needs the boundary distance and landing level to answer the question. Treat the ball as a point and neglect air resistance initially.'],
 ['And three things sit in between', 'Air resistance, spin and the seam can substantially affect a ball\'s path. Whether ignoring them is acceptable depends on the accuracy needed, especially near the boundary. Compare the model with measurements.'],
 ['In physics, holding', null],
 ['A theory is what an idea is promoted to', 'A scientific theory is an explanatory framework supported and tested using evidence. A hypothesis is a testable proposed explanation. These are different roles, not automatic stages on a ladder: theories do not become laws when enough evidence accumulates.'],
 ['Newton\'s laws of motion are laws', 'Newton\'s laws explain the motion of a passenger relative to a braking bus: without a sufficient backward force, the passenger continues forwards while the bus slows. The passenger is not thrown forwards by a new forward force.'],
 ['These are not guesses dressed up.', 'A prediction specifies an expected observation before the test, clearly enough to compare it with a result. It may follow from a model or a tentative explanation. A prediction can be qualitative or numerical.'],
 ['Notice which arrow does the work.', 'Both outcomes matter. Agreement supports a model within the tested conditions, though alternatives may fit too. Disagreement prompts checks of observations, assumptions and calculations. Neither outcome alone settles the whole theory.'],
 ['The claim is not wrong —', '“It will rain this afternoon” is already testable if the place, time interval and meaning of rain are clear. Dark clouds are a proposed reason, whose reliability needs separate checks. A yes-or-no prediction can fail.'],
 ['Each of those can be answered', 'Measurements and past records help assess whether dark clouds predict rain reliably. Define a location, an interval such as noon to 6 p.m., and a detectable amount of rain. Record both rainy and dry afternoons, including cases where the prediction failed.'],
 ['That is why a forecast for this evening', 'Forecast uncertainty usually grows with lead time. A detailed forecast for one place on one day differs from a probabilistic outlook for average conditions over a month. Computing, measurements and models all affect skill; there is no single time limit for every forecast question.'],
 ['The difficulty is of a different kind.', 'Small differences in initial atmospheric conditions can grow as a model runs forward. Forecasters use sets of model runs to explore uncertainty. Model limitations and incomplete observations also contribute to error.'],
 ['So ask: by what mechanism?', 'Ask what change to food is proposed and what evidence would distinguish it from ordinary spoilage. An eclipse blocks sunlight; it does not introduce a special food-poisoning radiation. Food still needs normal hygiene and safe storage. Absence of a proposed mechanism alone would not disprove a measured effect.'],
 ['Nobody should trust that to the nearest kilogram.', 'This is an energy-equivalent calculation for four adult-sized energy needs, not a balanced diet or an estimate of what a real household buys. Actual rice purchases depend on ages, portions, other foods and waste. State those limits with the result.'],
 ['The volume of one breath is harder', 'For a resting adult, use half a litre as an approximate quiet-breath volume. Do not infer it from blowing up a balloon: those breaths are usually deeper than normal breathing. The estimate varies with body size and activity.'],
 ['Is that believable? Check it another way.', 'The same assumptions give about 7.5 litres per minute. Multiplying by 1440 minutes checks the arithmetic but is not independent evidence: it reuses the same breathing rate and volume. An independent check would need different measurements.'],
 ['Turn back to the foot of the first page', 'Choose one claim in this chapter. State the evidence for it, an alternative explanation and an observation that would help distinguish them.'],
 ['Look at the bottom of this page before', 'An observation is a record of an event. An inference suggests what it means. A measurement adds a quantity, a unit and an estimate of uncertainty. Keep these distinct when you read a claim.'],
 ['Read them as a pair and they are', 'Suppose a plant beside a window is taller than one across the room. The height difference is an observation; saying that light caused it is an inference. Different watering or starting sizes could also explain it. A comparison needs to account for those alternatives.'],
 ['Boxes with a rule above and below', 'Throughout this book, teal marks first-hand work, amber marks questions to think through, and brown marks evidence or mechanisms. Record your work in your notebook. Judge each conclusion by the observations supporting it.']
];
const normal=s=>s.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
function divRanges(html){const stack=[],ranges=[];for(const m of html.matchAll(/<div\b[^>]*>|<\/div>/g)){if(m[0].startsWith('</')){const a=stack.pop();if(a)ranges.push({...a,end:m.index+m[0].length});}else stack.push({start:m.index,tag:m[0],contentStart:m.index+m[0].length});}return ranges;}
for(const f of (await fs.readdir(dir)).filter(f=>/^p\d+\.html$/.test(f))){
 let html=await fs.readFile(`${dir}/${f}`,'utf8');
 const archive=`assets/design-history/science-nine-before/${f}`;await fs.mkdir('assets/design-history/science-nine-before',{recursive:true});try{await fs.access(archive);}catch{await fs.writeFile(archive,html);}
 html=html.replace(/<p\b([^>]*)>([\s\S]*?)<\/p>/g,(all,attrs,body)=>{const text=normal(body);const entry=replacements.find(([a,b])=>b&&text.startsWith(a));if(!entry)return all;ledger.push({file:f,before:text,after:entry[1]});return `<p${attrs}>${entry[1]}</p>`;});
 const local=[
 ['the candela for the brightness of a light','the candela for luminous intensity in a specified direction'],
 ['One system, and only seven units in it','One system with seven base units'],
 ['What the foot of the page is telling you','Separating evidence from explanation'],
 ['The loop only closes when a prediction fails.','The loop includes both agreement and disagreement with observations.'],
 ['Everyone outside that patch sees an ordinary day.','Outside the path of totality, a wider region sees a partial eclipse; beyond that region there is no eclipse.'],
 ['Nothing else about that patch changes.','Reduced sunlight can also affect temperature and animal behaviour.'],
 ['a model is not true or false but useful or useless','a model must be tested against evidence'],
 ['A model is not true or false but useful or useless','A model must be tested against evidence'],
 ['In science a theory is a conclusion, not a guess.','A scientific theory is a tested explanatory framework, not a promotion stage between a hypothesis and a law.'],
 ['A prediction is worth more than an explanation offered afterwards, because it can fail. The useful arrow in the cycle is the one that runs back from a failed test.','A prediction can be checked against an observation. Both agreement and disagreement provide evidence; neither alone proves or disproves every aspect of a model.'],
 ['a thermometer compares a warmth with the kelvin','a thermometer measures temperature on a defined scale'],
 ['All three are the same car and all three are correct.','All three represent the same car for different questions; each needs checking within its intended use.'],
 ['holding a heavy bag perfectly still is no work at all','holding a bag still does no mechanical work on the bag, though your muscles use energy'],
 ['The whole flight follows from three quantities.','This first model requires launch conditions, gravity and the relevant distances.'],
 ['Everything written below the ground line is true of the ball and makes no difference to the question.','Compare omitted effects with the accuracy needed before deciding that they do not matter.'],
 ['This one is for deciding what size of sack to buy.','This one estimates an energy equivalent, not a real family\'s shopping requirement.']
 ];
 for(const [a,b] of local){const pattern=new RegExp(a.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/\s+/g,'\\s+'),'g');if(pattern.test(html)){html=html.replace(pattern,b);ledger.push({file:f,before:a,after:b});}}
 // Remove production-only photo placeholders; retain substantive captions only when a real figure remains.
 for(const r of divRanges(html).filter(r=>/class="c-figure/.test(r.tag)&&html.slice(r.start,r.end).includes('class="c-photo"')).sort((a,b)=>b.start-a.start)){ledger.push({file:f,reason:'Remove unfulfilled photo production brief'});html=html.slice(0,r.start)+html.slice(r.end);}
 const kinds={'c-example':'imagine','c-reflect':'observe','c-keyidea':'explain','c-tip':'reason','c-curiosity':'reason','c-beyond':f==='p013.html'?'imagine':f==='p010.html'||f==='p015.html'?'explain':'reason','c-activity':'setup'};
 // Only feature roots change; inner typography remains readable but loses legacy boxes and ornaments.
 html=html.replace(/class="(c-example|c-reflect|c-keyidea|c-tip|c-curiosity|c-beyond|c-activity)"/g,(_,old)=>`class="science-feature science-feature--${kinds[old]}" data-feature="${kinds[old]}"`);
 html=html.replace(/<div class="(?:c-reflect__icon|c-tip__icon)"[\s\S]*?<\/div>/g,'').replace(/<div class="c-reflect__mark">[\s\S]*?<\/div>/g,'');
 html=html.replace(/<div class="(c-example__tab|c-reflect__title|c-keyidea__title|c-curiosity__tab|c-beyond__tab|c-activity__head|c-activity__tab)">[\s\S]*?<\/div>/g,(all,cl,offset)=>{const prior=html.slice(0,offset),kind=[...prior.matchAll(/data-feature="([^"]+)"/g)].at(-1)?.[1];return kind?`<div class="science-feature__title">${featureNames[kind]}</div>`:all;});
 html=html.replace(/class="c-reflect__box"/g,'class="science-feature__body"');
 await fs.writeFile(`${dir}/${f}`,html);
}
await fs.writeFile('assets/design-history/science-nine-editorial-changes.json',JSON.stringify(ledger,null,2));
console.log(`${ledger.length} Class 9 editorial changes`);
