// Rebuild editorial references without touching the supplied PDF or older chapters.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {lesson,exercises,projects} from './science-g7-ch05-content.mjs';
const history='assets/design-history/science-g7-ch05';
const file='C:/Books/6-10 Books/7/7 Science/Chapter 5.pdf';
await fs.writeFile(history+'/source.json',JSON.stringify({file,title:'Changes Around Us: Physical and Chemical',class:7,chapter:5,pdfPages:16,printedPages:[57,72],sha256:createHash('sha256').update(await fs.readFile(file)).digest('hex'),scope:'Only Chapter 5 authored. Previously supplied Chapters 6–12 remain future references.'},null,2));
const points=[
 ['opening',[1],['opener','closing'],'Ice melting, water warming, rosebud opening and browning banana; distinguish observations from classifications.'],
 ['activity-5.1',[2],['notice','notice-task','notice-table','grouping'],'All ten named changes and one learner-chosen change retained; source observation blanks replaced by notebook recording. Safe sensory observation replaces unrestricted tasting/touching.'],
 ['activity-5.2',[3],['physical-intro','physical-task','physical-art','physical-definition'],'Fold/unfold paper, inflate/deflate/puncture balloon, crush chalk; original material versus original object. Adult pin handling and contained chalk dust.'],
 ['physical-definition',[3],['physical-definition','water-states'],'No new substance; shape, size and state. Water states preserved; visible mist distinguished from vapour.'],
 ['activity-5.3',[4],['chemical-intro','exhaled-task','chemical-evidence'],'Tap water and lime-water comparison with exhaled air. Teacher collects and delivers air without mouth-to-liquid connection; untouched controls and uncertain results added.'],
 ['chemical-definition',[4,5],['chemical-definition','lime-equation','lime-limit'],'Calcium hydroxide, carbon dioxide, insoluble calcium carbonate and water; word equation and lime-water test. Excess-gas limitation added.'],
 ['activity-5.4',[5],['vinegar-task','gas-explanation','vinegar-equation','dissolving'],'Vinegar or lemon juice plus baking soda, fizz, gas test and water comparison; test-tube/bottle alternatives. Open outlet and backflow prevention.'],
 ['rusting',[6],['rust','rust-time'],'Rusting is a chemical change; hydrated iron oxides rather than an oversimplified single dry oxide.'],
 ['magnesium-combustion',[6],['magnesium','magnesium-equation','combustion'],'Magnesium oxide, heat/light, combustible wood/paper/cotton/kerosene. Energy distinguished from material products; recall only, no student burning.'],
 ['activity-5.5',[6,7],['candle-air-task','oxygen-evidence','oxygen-product'],'Two candles, one covered; air supply versus carbon dioxide product test. Does not claim zero oxygen or that testing CO2 identifies oxygen.'],
 ['fire-safety',[7],['fire-safety'],'Smothering and no synthetic cloth retained; stop/drop/roll and adult help added.'],
 ['fireflies',[7],['firefly-note'],'Bioluminescence with very little heat rather than literally no heat.'],
 ['activity-5.6',[7,8],['ignition-question','heat-task','ignition','triangle-diagram','triangle-use'],'Match versus focused sunlight, ignition temperature and three requirements. Teacher-only or video, cleared area, heatproof tray, extinguishing, lens/eye precautions.'],
 ['activity-5.7',[8,9],['candle-think','wax-diagram','wax-comparison','wax-explanation'],'All four student observations: melting/evaporating, burning/new substances, wick transport, flowing/resolidifying. Physical and chemical changes together.'],
 ['faraday',[9],['faraday'],'Chemical History of a Candle and inquiry through familiar objects; 1861 publication verified.'],
 ['activity-5.8',[10],['reverse-task','reverse-table','reverse-meaning'],'Return to Table 5.1; source ice/vegetables/boiling/popcorn records and uncertainty preserved with explicit recovery conditions.'],
 ['desirable',[10,11],['desirable-comparison','context','compost-pause'],'Curd, ripe/cut fruit, cooked food, rust, spoilage and compost; purpose determines desirability.'],
 ['environment',[11],['environment'],'Fuel consumption/CO2 and substances released during paint drying; qualified to fossil fuels and some paints.'],
 ['weathering',[11],['weathering','weathering-art','weathering-comparison','basalt'],'Sediments below cliffs, temperature, roots, freezing water, chemical mineral change and red iron-bearing basalt; soil formation.'],
 ['erosion-deposition',[12],['erosion','landscape-diagram','deposition','landscape-time'],'Wind/water/gravity, landslide, abrasion, settling and sedimentary rocks. Distinguishes change in place from transport; long durations versus rapid events.'],
 ['nutshell',[12],['summary','glossary'],'All nine source summary points represented; ten reference definitions added.'],
 ...exercises.map((q,i)=>['question-'+(i+1),q.source,[q.id],'All source subparts retained. Notebook response format; scientific qualifications follow the revised lesson.']),
 ...projects.map(q=>[q.id,q.source,[q.id],'Source project retained; safety and evidence qualifications recorded below.'])
].map(([id,sourcePages,targets,treatment])=>({id,sourcePages,targets,treatment}));
const corrections=[
 {targets:['exhaled-task'],change:'Replace blowing directly through a straw into lime water with teacher-collected air and needle-free gas delivery; keep the same comparison.'},
 {targets:['oxygen-evidence','oxygen-product'],change:'A flame can go out before oxygen is exhausted; CO2 testing establishes a product, not which air component supports burning.'},
 {targets:['project-ink'],change:'Warm-iron adult method retained; paper-over-flame alternative removed to avoid an unnecessary fire task.'},
 {targets:['project-yeast'],change:'Yeast/no-yeast control added; teacher tubing transfers collected gas instead of learners shaking lime water with a balloon attached.'},
 {targets:['project-chameleon'],change:'Colour has several functions, including communication and temperature response; avoid universal deliberate camouflage claim.'},
 {targets:['q3'],change:'Candle statement asks whether melting helps supply fuel, rather than an absolute necessary-condition claim about every moment of ignition.'},
 {targets:['q8','q9'],change:'Growing plants and ripening organisms may involve several processes; permit justified mixed-process classifications. Gathering objects alone does not establish reaction.'},
 {targets:['physical-definition','reverse-meaning'],change:'Irreversibility is not the definition of chemical change.'}
];
await fs.writeFile(history+'/source-coverage.json',JSON.stringify({source:'Supplied Chapter 5.pdf; PDF pages 1–16, printed pages 57–72',points,additions:lesson.filter(b=>b.addition).map(b=>({targets:[b.id],reason:b.addition})),corrections,omitted:'Publisher furniture, duplicated OCR headings, decorative enquiry lettering and textbook writing spaces only.'},null,2));
const references=[
 {topic:'Vinegar/bicarbonate reaction',url:'https://edu.rsc.org/resources/bubble-volcanoes/2026.article'},
 {topic:'Lime water and excess carbon dioxide',url:'https://edu.rsc.org/experiments/the-reaction-of-carbon-dioxide-with-water/414.article'},
 {topic:'Clothing fire safety',url:'https://content.nfpa.org/-/media/Project/Storefront/Catalog/Files/Home-Fire-Safety/Lesson-plans/lntblevel1stopdroproll.pdf'},
 {topic:'Faraday lecture publication',url:'https://www.rigb.org/explore-science/explore/person/michael-faraday-1791-1867'},
 {topic:'Chameleon structural colour and signalling',url:'https://www.nature.com/articles/ncomms7368'},
 {topic:'Firefly light and minimal heat',url:'https://www.nps.gov/grsm/learn/nature/fireflies.htm'},
 {topic:'Weathering, transport and sedimentary rock formation',url:'https://pubs.usgs.gov/gip/fossils/rocks-layers.html'}
];
await fs.writeFile(history+'/scientific-references.json',JSON.stringify({checked:'2026-09-22',references},null,2));
console.log('Recorded '+points.length+' source-coverage links, additions, corrections and primary references.');
