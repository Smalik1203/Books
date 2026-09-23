import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {title,lesson,exercises,projects} from './science-g7-ch09-content.mjs';
const history='assets/design-history/science-g7-ch09',file='C:/Books/6-10 Books/7/7 Science/Chapter 9.pdf';
await fs.writeFile(history+'/source.json',JSON.stringify({file,title,class:7,chapter:9,pdfPages:16,printedPages:[121,136],sha256:createHash('sha256').update(await fs.readFile(file)).digest('hex'),scope:'Chapter 9 only. Chapters 10–12 remain future references; existing chapters unchanged.'},null,2));
const points=[
 ['introductory-purpose',[1],['opener','life-processes','historical-diet'],'Life processes and Class 6 connection retained; reproductive continuity distinguished from individual survival. Thirukkural acknowledged without repeating a medical guarantee.'],
 ['feeding-methods',[2],['feeding-intro','feeding-methods'],'Nectar, mammalian milk, whole-prey swallowing and filter feeding retained in parallel bullets.'],
 ['food-and-digestion',[2],['nutrient-intro','digestion-stages'],'Complex carbohydrates, protein and fat; mechanical and chemical breakdown; absorption and use.'],
 ['digestive-system',[2,5],['human-digestion','canal','digestive-map'],'Figure 9.1 replaced by labelled painted anatomy with all nine original labels plus gallbladder. Food path is separate from glands. Figure 9.4 length comparison explained without a misleading stretched-to-scale drawing.'],
 ['mouth',[2,3],['mouth-work','chewing-observation','saliva-question'],'Teeth, tongue, salivation and optional 30–60-second chapati/rice observation. Taste is not prescribed; amylase defined.'],
 ['activity-9.1',[3,4],['starch-task','starch-record','starch-evidence','starch-uncertainty','starch-pause'],'Original starch/saliva question and rice, water, iodine and four recording fields retained. Safer prepared amylase replaces classroom biological sampling; chewed-rice comparison explained and preserved in Q2/Q9. Matched quantities, temperature and time; no pre-filled outcomes.'],
 ['oral-hygiene',[3],['oral-care','project-oral'],'Brushing, oral hygiene and elders’ practices retained; current fluoride/interdental advice and evidence comparison replace guarantees.'],
 ['oesophagus',[4],['food-pipe','peristalsis','peristalsis-art'],'Saliva/tongue assist swallowing; travelling muscular contraction and relaxation, not gravity-only descent. Figure 9.2 two successive painted views.'],
 ['stomach',[4,5],['stomach-actions','stomach-components','stomach-exit'],'Churning, enzyme action, acid, protection and semi-liquid exit. Figure 9.3 structural reference integrated in full digestive painting; roles expressed in parallel bullets.'],
 ['beaumont',[5],['beaumont'],'1822 St. Martin injury and Beaumont observations retained with ethical context; graphic wound illustration and unsupported emotion inference omitted.'],
 ['intestinal-length',[5,6],['lengths'],'Adult approximate 6 m / 1.5 m, coiling and width distinction; lengths qualified rather than assuming a child’s dimensions.'],
 ['secretions',[5,6],['secretions','neutralisation'],'Liver/bile, pancreas and intestinal lining all retained. Bile dispersal distinguished from enzyme hydrolysis; pancreatic bicarbonate identified in neutralisation.'],
 ['absorption',[6],['villi-intro','villi-art','absorption'],'Figure 9.5 replaced by painted villi and live labels; thin surface, expanded area and nutrient transport retained. Most absorbed fat first enters lymph.'],
 ['celiac',[6],['celiac'],'Gluten, wheat/barley/rye, villous damage, absorption and naturally gluten-free millets retained; clinician diagnosis, contamination and no self-prescribed restriction added.'],
 ['large-intestine',[6,7],['colon'],'Water/salts, stool, rectum, anus and egestion retained. Earlier water absorption and egestion/excretion distinction clarified.'],
 ['microbiome',[7],['microbes','digestive-health'],'Gut microbes, fibre and vitamins retained. Regional fermented foods retained as examples without universal benefit claims; hygiene and salt/sugar qualifications.'],
 ['traditional-advice',[1,7],['historical-diet'],'Thirukkural and Charaka Samhita cultural context and ginger/pepper/cumin retained without unsupported medical efficacy claims.'],
 ['ruminants',[7,8],['rumination','ruminant-art','digestion-comparison'],'Cow, buffalo/goat, cud return, rumen and microbial digestion; Figure 9.6 replaced. Eight-hour chewing figure omitted because diet and conditions vary.'],
 ['birds',[8],['bird-digestion','bird-art','digestion-comparison'],'Toothless birds, muscular gizzard, glandular secretions and grit where relevant; Figure 9.7 replaced and connected crop shown.'],
 ['digestion-to-respiration',[8],['nutrition-respiration-link','respiration-intro'],'Food supplies nutrients; respiration releases energy in cells. Adaptation framed across generations.'],
 ['air-path',[9],['air-route','respiratory-art','nose-limits'],'Figure 9.8 replaced: nostrils, nasal passage, windpipe, branches, lungs, ribs and diaphragm; alveoli enlarged separately. Filtering limited; no universal ban on mouth breathing.'],
 ['respiratory-infection',[9],['nose-limits'],'COVID-19 example retained, no current clinical claims or survival-time challenges.'],
 ['activity-9.2',[10,11],['model-question','lung-task','model-evidence','model-limits','model-pause'],'Figure 9.9 initial assembly: Y tube, two balloons, airtight cap, cut bottle and flexible sheet. Observation precedes explanation. Pressure mechanism, adult cutting, latex and hygiene; model limits explicit.'],
 ['breathing-mechanism',[10],['breathing-states-art','breathing-comparison'],'Rib and diaphragm movements, volume/pressure and quiet exhalation explained. Paired anatomical views supplement the bottle model.'],
 ['activity-9.3',[11],['lime-question','lime-task','lime-evidence'],'Figure 9.11 replaced by two physically connected syringe setups; collection bag replaces mouth on reagent tubing. Equal gas volumes/liquid/time and repeated fresh samples; both air samples contain CO2.'],
 ['breathing-traditions',[11],['breathing-traditions','project-breathing'],'Pranayama, chanting and Tummo acknowledged without unsupported cure, lung improvement or cold-protection guarantees; project is research, not a challenge.'],
 ['alveolar-exchange',[12],['alveoli-mechanism','alveoli-art','gas-transport'],'Figure 9.12 replaced by painted cutaway, correct opposing live arrows and separate air/blood spaces.'],
 ['air-percentages',[12],['air-comparison','air-reading'],'Figure 9.13 values retained in a readable table: oxygen 21% / 16–17%, CO2 0.04% / 4–5%; approximate and not inferred quantitatively from lime water.'],
 ['respiration-equation',[12],['cell-chemistry','respiration-equation','breathing-respiration'],'Glucose, oxygen, CO2, water and released energy retained; aerobic scope and breathing/cellular distinction explicit.'],
 ['circulation',[13],['circulation','connections-pause'],'Heart, blood, vessels, nutrient/oxygen delivery and waste transport; connects organ systems.'],
 ['smoking',[13],['smoke'],'Lung injury, cancer risk and second-hand harm retained without individual diagnosis.'],
 ['other-respiratory-surfaces',[13,14],['animal-intro','animal-exchange-art','animal-comparison','adaptation'],'Lungs, fish gills (Figure 9.14), tadpole/adult frog and earthworm retained. Dissolved oxygen, skin on land/water and generational evolution clarified.'],
 ['summary',[14],['summary','glossary'],'All twelve source summary themes represented with corrections; glossary adds fourteen full-size definitions.'],
 ...exercises.map((q,i)=>['question-'+(i+1),q.source,[q.id],i===8?'Source Fig. 9.15 colours preserved: A dark blue-black, B amber; hypothesis and controls.':i===9?'Source Fig. 9.16 investigation retained, unsafe mouth suction replaced by established syringe method.':'All source question parts retained, with explanations and qualifications.']),
 ...projects.map(p=>[p.id,p.source,[p.id],'Source project retained; safe research and evidence requirements made explicit.'])
].map(([id,sourcePages,targets,treatment])=>({id,sourcePages,targets,treatment}));
const corrections=[
 {targets:['life-processes'],change:'Individual survival is distinct from reproductive continuity.'},
 {targets:['starch-task','starch-evidence','starch-uncertainty'],change:'Prepared amylase replaces shared oral material. A negative iodine test is not proof of no starch or proof of sugar; test limits and controls explicit.'},
 {targets:['secretions','absorption','colon'],change:'Bile disperses rather than chemically digests fats; absorbed fats largely enter lymph; much water absorbed before large intestine.'},
 {targets:['celiac','oral-care','digestive-health','historical-diet'],change:'Current health guidance replaces blanket claims, with cultural accounts distinguished from treatment evidence.'},
 {targets:['model-evidence','model-limits','breathing-comparison'],change:'Volume and pressure cause airflow. Quiet expiration uses recoil; model cannot show rib motion or actual diaphragm contraction.'},
 {targets:['lime-task','lime-evidence','q10'],change:'No mouth suction/blowing through alkaline reagent. Both air samples contain carbon dioxide; matched gas volumes and early clouding are essential.'},
 {targets:['respiration-intro','cell-chemistry','breathing-respiration'],change:'Breathing, gas exchange and cellular aerobic respiration are distinct; energy is released from food.'},
 {targets:['animal-comparison','adaptation','project-birds'],change:'Frog skin works on land and in water; development is not evolution; altitude changes oxygen pressure more than its atmospheric percentage.'}
];
await fs.writeFile(history+'/source-coverage.json',JSON.stringify({source:'Supplied Chapter 9.pdf, PDF pages 1–16 / printed pages 121–136',points,corrections,additions:lesson.filter(b=>b.addition).map(b=>({targets:[b.id],reason:b.addition})),omitted:'Publisher decoration, QR codes, writing spaces and repeated labels. Decorative wounds, unsupported health guarantees and exact chewing duration are addressed explicitly above. Figures 9.3/9.4 are integrated into digestive anatomy and length explanation; Fig. 9.17 is described in the reading project.'},null,2));
const references=[
 ['Digestive mechanisms','https://www.niddk.nih.gov/health-information/digestive-diseases/digestive-system-how-it-works'],
 ['Fat absorption and villi','https://training.seer.cancer.gov/anatomy/lymphatic/'],
 ['Coeliac disease','https://www.niddk.nih.gov/health-information/digestive-diseases/celiac-disease'],
 ['Avoid self-directed pre-diagnosis gluten restriction','https://www.niddk.nih.gov/health-information/digestive-diseases/celiac-disease/diagnosis'],
 ['Oral health','https://www.nidcr.nih.gov/health-info/oral-hygiene'],
 ['Breathing and gas exchange','https://www.nhlbi.nih.gov/health/lungs/breathing-benefits'],
 ['Control of breathing and irritant response','https://www.nhlbi.nih.gov/health/lungs/body-controls-breathing'],
 ['Smoke exposure','https://www.cdc.gov/tobacco/secondhand-smoke/health.html'],
 ['Relaxation evidence and limits','https://www.nccih.nih.gov/health/relaxation-techniques-what-you-need-to-know'],
 ['Bird respiratory anatomy','https://openstax.org/books/biology-2e/pages/29-5-birds'],
 ['Gas-exchange surfaces','https://openstax.org/books/biology/pages/39-1-systems-of-gas-exchange'],
 ['Official Indian AQI for the project','https://airquality.cpcb.gov.in/AQI_India/'],
 ['Historical record','https://jamanetwork.com/journals/jama/article-abstract/1388300']
].map(([topic,url])=>({topic,url}));
await fs.writeFile(history+'/scientific-references.json',JSON.stringify({checked:'2026-09-23',references},null,2));
console.log(`Recorded ${points.length} substantive source links and ${corrections.length} correction groups.`);
