import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {lesson,exercises,projects,games} from './science-g6-ch09-content.mjs';
const history='assets/design-history/science-g6-ch09';
const source='C:/Books/6-10 Books/6/6 Science/Chapter 9.pdf';
const blocks=[{id:'opener',source:[1]},{id:'glossary',source:[14]},{id:'summary',source:[15]},...lesson,...games,...exercises,...projects];
const points=Array.from({length:19},(_,i)=>({pdfPage:i+1,printedPage:i+163,targets:blocks.filter(b=>b.source.includes(i+1)).map(b=>b.id)}));
const corrections=[
 {targets:['handpicking','hand-limits'],reason:'Do not reproduce the eyes-closed stone-picking challenge or prescribe enjoyment. Recognisable clean blunt pieces and open eyes are appropriate. Peppercorn removal illustrates sorting without unsupported health persuasion.'},
 {targets:['threshing','machines','winnowing','air-task','air-think'],reason:'Threshing releases attached grain. Winnowing depends on aerodynamic response, not mass alone. Card fanning replaces blowing by mouth; peanut-allergy alternative and dust precautions retained. Machinery observed from safe distance.'},
 {targets:['sieve-start','sieve-art','sieving','dry-table'],reason:'Relate aperture to particle size. Bran is not inherently harmful; removal is purpose-dependent. An empty apparatus image avoids pre-answering a trial.'},
 {targets:['salt-start','salt-pans','salt-art-task','salt-art-evidence','heat-task','heat-evidence','both'],reason:'Seawater contains several salts and requires processing. Use a plain-water comparison; touch/appearance alone is not identification. Heating is teacher-operated, avoids spitting and heating dry. Open evaporation does not recover water; distillation additionally condenses and collects it.'},
 {targets:['drying-plants','project-kitchen'],reason:'Retain drying and straining examples without prescribing herbal remedies, efficacy or safety. No unknown plant tasting.'},
 {targets:['sediment','decant','oil-water','wet-table'],reason:'Not all leaves or fine solids settle. Partial separation is useful, not an invalid method. Dissolved salt does not settle like sand. Liquid-layer decantation distinguished from sedimentation.'},
 {targets:['filter-task','filter-results','dissolved-limit','design-task','design-evidence','tea-net','q10'],reason:'Prepared safe classroom samples replace pond-water collection. Filter paper may retain some particles; dissolved salt and some fine particles pass. Clarity is not potability. No claim boiling removes chemicals. Filter medium mechanisms differ. Tea-bag history omitted because not established by provided source evidence.'},
 {targets:['churn-art','milk','q2'],reason:'Churning promotes fat aggregation into butter, not simply flotation. Correct erroneous cream-from-milk MCQ to butter-from-cream/curd. Accidental spoilage is not intentional acid-curdling of fresh milk; do not salvage suspect milk.'},
 {targets:['magnet-art','magnet-limit','recycling','q5'],reason:'Not all metals strongly attract. Use large steel clips for pupil modelling, not sharp nails, iron powder or dust. Entrained non-magnetic pieces mean recovery may be incomplete.'},
 {targets:['purpose-task','purpose-cards','wise-fish','fish-cards'],reason:'Retain all ten source sorting cases and eleven source matching methods. Either purpose basket can be justified by the intended use. Magnet secured; use large clips away from young children.'},
 {targets:['q3','q4','q8','q9','q10','project-mixture','project-community'],reason:'Questions state needed conditions and avoid guaranteed outcomes. Masks depend on filtration and fit. The Leela story is evaluated, not used as instructions to purify arbitrary pond water. Multi-component plans explicitly ask which information is needed. Adult-led respectful worker interview, no handling waste.'}
];
await fs.writeFile(history+'/source-coverage.json',JSON.stringify({source,sha256:createHash('sha256').update(await fs.readFile(source)).digest('hex'),sourcePdfPages:20,points,corrections,counts:{numberedActivities:6,questions:10,closingProjects:6,sortingCases:10,matchingMethods:11},omittedPages:[{pdfPage:20,reason:'Blank Notes page; no lesson content.'}],editorialChoices:['Introductory literary quotation omitted; family journey and enquiry retained.','Repeated embedded text on source pages 7 and 11 is included only once.','Folksong and Salt March poster prompts are retained in the reporting project.','River-pollution poem is an original learner prompt, not a reproduction of the printed verse.','All source review questions retained; faulty answers, unsafe implications and absolute claims are corrected explicitly in the ledger.','The learner records observations in a notebook; no answer lines or pre-filled experimental results.']},null,2));
await fs.writeFile(history+'/scientific-references.json',JSON.stringify([
 {url:'https://www.cdc.gov/drinking-water/prevention/water-treatment-hiking-camping-traveling.html',supports:'Boiling or disinfection cannot make chemically contaminated water safe.'},
 {url:'https://www.cdc.gov/drinking-water/prevention/about-choosing-home-water-filters.html',supports:'Filter performance depends on what it is designed to remove.'},
 {url:'https://books.lib.uoguelph.ca/dairyscienceandtechnologyebook/chapter/butter-manufacture/',supports:'Churning agitates cream and promotes fat aggregation into butter grains.'},
 {url:'https://www.fda.gov/consumers/consumer-updates/are-you-storing-food-safely',supports:'Discard spoiled or mishandled perishable food; appearance is not a reliable safety test.'},
 {url:'https://www.cdc.gov/respiratory-viruses/prevention/masks.html',supports:'Masks filter inhaled/exhaled particles; design and fit affect protection.'},
 {url:'https://www.gandhiashramsabarmati.org/en/about-gandhi-ashram-menu.html',supports:'Salt March left Sabarmati Ashram in 1930.'}
],null,2));
console.log('Chapter 9 source coverage and scientific corrections recorded.');
