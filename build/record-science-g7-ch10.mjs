import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {title,lesson,exercises,projects} from './science-g7-ch10-content.mjs';
const history='assets/design-history/science-g7-ch10',file='C:/Books/6-10 Books/7/7 Science/Chapter 10.pdf';
await fs.writeFile(history+'/source.json',JSON.stringify({file,title,class:7,chapter:10,pdfPages:16,printedPages:[137,152],sha256:createHash('sha256').update(await fs.readFile(file)).digest('hex'),scope:'Chapter 10 only; Chapters 11–12 remain future references.'},null,2));
const points=[
 ['opening',[1],['opener','growth-changes'],'Class 6 growth and Chapter 9 animal nutrition links; material and energy questions retained.'],
 ['growth-hypotheses',[2],['growth-changes','growth-ideas'],'New leaves, branches, height and stem thickness; sunlight/water/soil alternatives.'],
 ['activity-10.1',[2,3],['growth-task','growth-record','growth-evidence','growth-limits','growth-pause'],'Three initial comparable plants; A lit/watered, B lit/withheld water, C dark/watered; two-week plan and all Table 10.1 fields. Stop/rescue deterioration rather than prescribing death; height not sole growth metric. Fig. 10.1 repainted.'],
 ['historical-agriculture',[4],['vrikshayurveda'],'Vrikshayurveda, crop care, manure, water/barley/pulse examples retained without untested universal claims.'],
 ['food-origin',[1,4],['food-origin'],'Food for growth, direct/indirect animal dependence; soil minerals distinguished from carbohydrate food.'],
 ['leaf-structure',[4],['leaf-structure'],'Broad/thin leaf, chlorophyll and starch; purpose wording replaced with functional explanation.'],
 ['activity-10.2',[4,5],['starch-task','starch-evidence'],'Softening, ethanol decolourisation, rinse, iodine and interpretation. Figure 10.2 uses flame-free water bath; teacher-only handling and no result in setup.'],
 ['starch-question',[5],['starch-question','variegation-question'],'Bhaskar question, light/starch relationship, green/cream patch mapping retained.'],
 ['activity-10.3',[5,6,7],['patch-task','patch-record','patch-evidence'],'Comparable plants, original 36-hour dark idea refined with starting starch check for both plants; traced leaf patches. Table 10.2 given observations explicitly separate from learner results.'],
 ['non-green-leaves',[6],['coloured-leaves','patch-evidence'],'Hidden chlorophyll and low detectable starch; not every non-green pigment assumed to capture energy for photosynthesis.'],
 ['air-role',[7],['co2-question'],'Air question and destarching definition retained.'],
 ['activity-10.4',[7,8],['co2-task','co2-record','co2-evidence','half-leaf'],'CO2 absorber, sunlight, watered green tissue, starch testing and Table 10.3 factors retained. Matched bell jars replace a half-leaf apparatus as main practical; the half-leaf comparison and its confounds remain in prose. Fig. 10.3 represented by painted matched setups.'],
 ['photosynthesis-inference',[8],['photosynthesis-definition','photosynthesis-equation'],'Four necessary factors, carbohydrate production, other green parts retained.'],
 ['activity-10.5',[9],['oxygen-task','oxygen-evidence','evidence-pause'],'Barkha investigation of light/dark pondweed, inverted funnel/tube and collected gas retained; name omitted as non-substantive. Fig. 10.4 initial apparatus repainted. Glowing-splint evidence replaces vague intense flame; trapped initial air and net production addressed.'],
 ['photosynthesis-overview',[10],['photosynthesis-definition','photosynthesis-equation','plant-map','sugar-use'],'Fig. 10.5 plant, live arrows, raw materials/products, light/chlorophyll and sugar/starch storage.'],
 ['dastur',[10],['dastur'],'Rustom Hormusji Dastur dates, botany leadership and research into water/temperature/light retained.'],
 ['gas-exchange-question',[10,11],['stomata-question'],'Microscopic structures and gas exchange introduced after photosynthetic evidence.'],
 ['activity-10.6',[11],['peel-task','stomata-art','stomata-evidence'],'Leaf peel, water, watch glass, forceps, slide, stain/coverslip/microscope preserved. Suitable school stain replaces arbitrary ink; prepared-slide fallback and distinction from artefacts. Fig. 10.6 is painted interpretation, no invented scale bar.'],
 ['water-minerals',[11,12],['water-route','xylem'],'Roots, water and mineral supply retained; dye is tracer, not food.'],
 ['activity-10.7',[11,12],['dye-task','dye-evidence','transport-detail'],'Two tumblers, one-third water, red tracer, matched white-flowered stems, underwater oblique cut, next-day observations and cut cross-section retained. School dye replaces arbitrary ink; adult cutting. Fig. 10.7 initial setup and stem detail repainted.'],
 ['transport-tissues',[12],['transport-detail','xylem','phloem','transport-comparison'],'Fig. 10.8 conducting tissues represented by structural close-up; live labels. Water/minerals versus sugars, storage roots/seeds; phloem directions corrected.'],
 ['respiration-question',[13],['respiration-question'],'Class 6 living-process link and germinating seed energy question.'],
 ['activity-10.8',[13],['seed-task','seed-evidence','seed-method-limit'],'Moong soaking, damp cotton, dark flask, gas connections and lime-water test retained. Defined syringe transfer, matched bead/cotton control and shorter monitored period replace passive unspecified flow and prolonged sealed incubation. Fig. 10.9 repainted sampling apparatus.'],
 ['respiration-equation',[13],['respiration-equation','living-cells'],'Glucose/oxygen to CO2/water with released energy; all living regions respire, distinction from dead mature conducting cells.'],
 ['nature-connections',[14,16],['process-comparison','day-night-pause','plant-connections'],'Day/night, simultaneous processes, crop/ecosystem energy and transport links, net exchange clarified.'],
 ['summary',[14],['summary','glossary'],'All six substantive source summary themes retained in ten points; fourteen full-size definitions added.'],
 ['sohonie',[16],['sohonie'],'Kamala Sohonie dates, Cambridge plant-respiration work, return to Indian medical/nutrition research, institute leadership and neera retained; cytochrome c connection supported by Cambridge biography.'],
 ...exercises.map((q,i)=>['question-'+(i+1),q.source,[q.id],i===5?'Fig. 10.10 painted light/dark growth comparison; prediction distinguished from prescribed outcome.':i===6?'All four light/CO2 conditions and all four question parts retained; Fig. 10.11 painted plants with live condition key.':i===7?'Fig. 10.12 four snail/plant/empty tubes, equal initial colour and missing indicator/light conditions retained as conceptual analysis, not animal confinement.':'All substantive question requirements retained with conditions and scientific qualifications.']),
 ...projects.map(p=>[p.id,p.source,[p.id],p.id==='project-garden'?'Fig. 10.13 bottle garden painted. Humidity-loving plants replace unsuitable sealed-jar jade; survival is not proof of measured gas rates.':'Source project retained with observation and evidence requirements.'])
].map(([id,sourcePages,targets,treatment])=>({id,sourcePages,targets,treatment}));
const corrections=[
 {targets:['growth-task','growth-evidence','growth-limits'],change:'One-factor pairwise comparisons, several growth measures, replicate limitations and rescue endpoint; do not prescribe plant death.'},
 {targets:['starch-task','starch-evidence'],change:'Flame-free indirect warming of ethanol, rinse leaf, positive control and bounded detection; no test result shown in initial art.'},
 {targets:['patch-task','patch-record','patch-evidence'],change:'Check starting starch in both plants; distinguish given observations from fresh results and absent colour from proof of absent chlorophyll.'},
 {targets:['co2-task','co2-record','half-leaf'],change:'Matched jars control enclosure; original half-leaf concept retained with shade/humidity limitations. Corrosive handling remains teacher-only.'},
 {targets:['oxygen-task','oxygen-evidence'],change:'Initial tube water-filled; identity tested by teacher glowing splint, not bubble appearance; net oxygen collection qualified.'},
 {targets:['phloem','transport-comparison'],change:'Soluble sugars move source-to-sink in multiple directions; starch does not move as intact storage grains.'},
 {targets:['seed-task','seed-evidence','seed-method-limit'],change:'Matched control and defined equal-volume headspace sampling replace unspecified passive gas flow; shorter incubation and ample air address oxygen depletion.'},
 {targets:['living-cells','process-comparison','day-night-pause'],change:'Respiration occurs in living plant cells day and night; net exchange is not the rate of one process.'},
 {targets:['q8','project-garden'],change:'Snail tubes analysed from records rather than enacted; bottle garden plant choice corrected and survival inference bounded.'}
];
await fs.writeFile(history+'/source-coverage.json',JSON.stringify({source:'Supplied Chapter 10.pdf, PDF pages 1–16 / printed pages 137–152',points,corrections,additions:lesson.filter(b=>b.addition).map(b=>({targets:[b.id],reason:b.addition})),omitted:'Publisher decoration, duplicated OCR, writing blanks, portraits and nonessential dialogue names. Scientist profiles retained as live prose.'},null,2));
const references=[
 ['Leaf starch-test technique and flame-free bath','https://practicalbiology.org/standard-techniques/testing-leaves-for-starch-the-technique.html'],
 ['Controlled requirements of photosynthesis','https://practicalbiology.org/energy/photosynthesis/identifying-the-conditions-needed-for-photosynthesis.html'],
 ['Leaf structures','https://openstax.org/books/biology/pages/30-4-leaves'],
 ['Conducting tissues','https://openstax.org/books/biology-2e/pages/30-1-the-plant-body'],
 ['Water and sugar transport','https://openstax.org/books/biology-2e/pages/30-5-transport-of-water-and-solutes-in-plants'],
 ['Oxygen collection','https://www.saps.org.uk/teaching-resources/resources/190/demonstrating-oxygen-evolution-during-photosynthesis-using-pondweed/'],
 ['Germinating seed CO2 investigation','https://www.pasco.com/resources/lab-experiments/177'],
 ['Dastur history','https://repository.ias.ac.in/40177/1/2-PUB.pdf'],
 ['Sohonie biography','https://newn.cam.ac.uk/about/history/biographies'],
 ['Bottle-garden conditions','https://www.rhs.org.uk/plants/types/houseplants/bottle-gardens-and-terrariums']
].map(([topic,url])=>({topic,url}));
await fs.writeFile(history+'/scientific-references.json',JSON.stringify({checked:'2026-09-23',references},null,2));
console.log(`Recorded ${points.length} source links and ${corrections.length} correction groups.`);
