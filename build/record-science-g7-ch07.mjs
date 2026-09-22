import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {title,lesson,exercises,projects} from './science-g7-ch07-content.mjs';
const history='assets/design-history/science-g7-ch07',file='C:/Books/6-10 Books/7/7 Science/Chapter 7.pdf';
await fs.writeFile(history+'/source.json',JSON.stringify({file,title,class:7,chapter:7,pdfPages:16,printedPages:[89,104],sha256:createHash('sha256').update(await fs.readFile(file)).digest('hex'),scope:'Only Chapter 7 authored. Chapters 8–12 remain future references.'},null,2));
const points=[
 ['family-setting',[1],['opener','pan-question'],'Pema, Palden, grandparents, Gangtok/Kerala, climate, Sun and metal thukpa pan. Altitude made explicit.'],
 ['activity-7.1',[2,3],['strip-task','strip-evidence'],'15 cm strip, four wax-attached pins at about 2 cm, numbered from heated free end; prediction, observed order and reasons. Clamped stand selected instead of loose brick support; teacher demonstration and safe catching tray.'],
 ['conduction',[3],['conduction-mechanism','conductors','conductor-limits'],'Hot-to-cold energy transfer; particles vibrate rather than remaining literally motionless; metal electrons added. Wood/glass comparison discussed, not put in a flame.'],
 ['table-7.2',[3],['materials-table'],'Good/poor conductor classification and material list. Source blank table becomes a notebook task with two explicit sample records.'],
 ['insulating-air',[3,4],['clothing','insulation-art','blanket-pause'],'Still air, wool, clothing layers and two blankets; qualification on compression and insulation performance. Figure 7.2 represented by painted materials and explanation.'],
 ['houses',[4],['houses','insulation-art'],'Mori, Uttarkashi wood/mud/cow-dung wall example and hollow bricks retained. No claim of perfect insulation.'],
 ['activity-7.2',[4,5],['rising-air','cups-task','cups-evidence'],'Equal cups/threads, horizontal stick, candle and observation/reason record; before-heating diagram. Added fire precautions and check for draughts/imbalance.'],
 ['balloon-smoke',[5],['air-expansion'],'Balloon expanding in sunlight; warm rising air carries smoke gases/particles; mass versus density clarified.'],
 ['activity-7.3',[5,6],['water-task','water-evidence','water-flow','convection-definition'],'500 mL beaker half-filled, central potassium permanganate grain, straw guide and gentle heating; initial apparatus then observed circulation model. Chemical handling, eye protection, tripod/gauze and safe disposal added.'],
 ['activity-7.4',[6,7],['coast-question','bowls-task','temperature-table','bowls-evidence'],'Identical half-filled soil/water bowls, suspended bulbs clear of base/sides, clear sunny day, five-minute records for twenty minutes, followed by cooling. Source Table 7.4 becomes notebook guide with every time retained.'],
 ['breezes',[7,8],['breeze-comparison','breeze-model','coastal-life'],'Both labelled circulation models, land/sea heating differences and coastal windows; weather qualification added to avoid universal daily reversal.'],
 ['radiation',[8],['radiation-intro','radiation-exchange'],'Warmth from fire, solar radiation through space, no required medium and all-object radiation retained. Other cooling pathways made explicit.'],
 ['surface-colour',[8],['clothes-comparison','clothing-limits'],'Light/dark clothing comparison retained for sunlight; avoid equating visible colour with every thermal property.'],
 ['pan-and-stove',[9],['processes-together','bukhari-art','pan-processes','stove-safety'],'Pan heating and bukhari, flat cooking top and chimney. Correct flame-to-pan conduction-only claim; distinguish gas convection, radiation, metal conduction and water circulation.'],
 ['three-process-summary',[9],['mechanisms-table'],'Source wrap-up retained as mechanism/example comparison table with read-across guidance.'],
 ['sun-drying',[10],['sun-water'],'Sun and evaporation from drying clothes and natural water bodies; wind/humidity acknowledged.'],
 ['states-and-snow',[10],['water-states'],'Liquid water, snow/ice/glaciers and vapour; snowmelt and winter replenishment retained without guaranteeing glacier recovery.'],
 ['water-cycle',[10],['cycle-landscape','cycle-stages','cycle-conservation'],'Figure 7.9 replaced by painted landscape and explicit process bullets: evaporation, transpiration, condensation, rain/snow/hail, runoff and return/storage; conserved total water versus scarce usable freshwater.'],
 ['activity-7.5',[11,12],['ground-question','seepage-task','seepage-table','seepage-evidence'],'Three 1 L cut bottle tops, cap holes, clay/sand/gravel, 200 mL and 10 min; all three predictions/observations retained in notebook guide. Adult preparation and controls added; no result in setup.'],
 ['infiltration',[12],['infiltration-definition','aquifer-model'],'Open connected pore spaces and fractures; clay pore-size qualification; figures 7.11 and 7.12 integrated into live aquifer model.'],
 ['groundwater',[11,12],['aquifer-definition','aquifer-model'],'Wells/handpumps, pore storage, saturated layers, aquifers and depth variability retained. Explicitly not an underground cavern.'],
 ['groundwater-conservation',[12],['recharge','harvesting','recharge-pause'],'Growing demand, over-extraction, vegetation loss, paving, harvesting and recharge pits. Recharge rates and pollution precautions made explicit.'],
 ['history',[11],['history','varahamihira'],'Varahamihira, sixth century Ujjaini and Brihatsamhita rainfall methods retained as historical enquiry; not endorsement of celestial signs as modern causal science.'],
 ['ice-stupas',[13],['ice-storage','ice-stupa','stupa-art','stupa-limits'],'Ladakh spring scarcity, winter stream-water pipes/spray/freezing, cone growth and seasonal melt retained. Replaces guaranteed whole-summer supply with dependence on weather and size.'],
 ['reference-pages',[13,14],['glossary','summary'],'All substantive source nutshell concepts retained, with ten useful definitions.'],
 ...exercises.map((q,i)=>['question-'+(i+1),q.source,[q.id],'All original assessment prompts/subparts retained. Question 1 includes all twelve options; precise apparatus conditions and safety qualifications made explicit.']),
 ...projects.map(q=>[q.id,q.source,[q.id],'Original enquiry retained. Fire tasks restricted to a teacher demonstration or approved recording; spiral alternative uses controlled warm air.'])
].map(([id,sourcePages,targets,treatment])=>({id,sourcePages,targets,treatment}));
const corrections=[
 {targets:['conduction-mechanism'],change:'Solid particles vibrate about fixed positions; they are not motionless. Mobile electrons contribute in metals.'},
 {targets:['cups-evidence','air-expansion','water-evidence'],change:'Use expansion and lower density, not an unexplained loss of mass. Cups may respond to draughts or imbalance.'},
 {targets:['clothing','conductor-limits'],change:'Insulation slows rather than stops transfer; two thin blankets are not unconditionally better than one thick blanket.'},
 {targets:['coastal-life','breeze-model'],change:'Breeze reversal is a typical local pattern, not an everyday guarantee.'},
 {targets:['pan-processes','radiation-exchange'],change:'Several mechanisms act simultaneously; do not describe the gas-flame-to-pan path solely as conduction or cooling solely as radiation.'},
 {targets:['cycle-stages','water-states'],change:'Clouds contain condensed droplets/ice, not simply vapour; seasonal snowfall does not necessarily replace all melted glacier ice.'},
 {targets:['aquifer-definition','recharge','harvesting'],change:'An aquifer stores and transmits water in connected openings. Recharge is finite, can be slow, and is not all infiltrating water.'},
 {targets:['varahamihira'],change:'Historical rainfall methods retained as history, not validated modern forecasting.'},
 {targets:['stupa-limits'],change:'No guarantee of supplying water all summer; capacity and weather matter.'},
 {targets:['q1'],change:'Make equal spacing/wax and heat between II/III explicit to resolve the source pin diagram.'},
 {targets:['q2'],change:'Nested tumblers help through trapped air only if leakage/contact does not eliminate the insulating gap.'},
 {targets:['q6'],change:'Make equal starting temperature, water amount and heating time explicit; retain differing heat/bulb positions.'},
 {targets:['project-paper','project-spiral'],change:'Paper near flames is not an unsupervised learner task. Preserve the question through teacher-controlled demonstration or video; paper can still burn.'}
];
await fs.writeFile(history+'/source-coverage.json',JSON.stringify({source:'Supplied Chapter 7.pdf; PDF pages 1–16, printed 89–104',points,additions:lesson.filter(b=>b.addition).map(b=>({targets:[b.id],reason:b.addition})),corrections,omitted:'Publisher furniture, decorative enquiry words, duplicated OCR lines and printed answer spaces only. The optional loose-brick support is replaced by a secure stand. No substantive concept, experiment, assessment subpart or project intentionally omitted.'},null,2));
const references=[
 ['Varahamihira historical context','https://mathshistory.st-andrews.ac.uk/Biographies/Varahamihira/'],
 ['Heat transfer mechanisms','https://www.weather.gov/source/zhu/ZHU_Training_Page/definitions/Transfer_Heat_Energy/Transfer_Heat_Energy.htm'],
 ['Coastal circulation and water heat capacity','https://www.weather.gov/bgm/WeatherInActionLakeShadowBreeze'],
 ['Water cycle and stores','https://water.usgs.gov/vizlab/water-cycle/'],
 ['Groundwater flow and recharge','https://www.usgs.gov/water-science-school/science/groundwater-flow-and-water-cycle'],
 ['Aquifers and recharge','https://pubs.usgs.gov/gip/gw/how_a.html'],
 ['Convection demonstration and chemical precautions','https://edu.rsc.org/download?ac=538195'],
 ['Combustion gases and ventilation','https://www.usfa.fema.gov/prevention/life-safety-hazards/carbon-monoxide/'],
 ['Ice-stupa operation','https://glaciersalive.ch/en/projekt-ice-stupa/'],
 ['Meteorology and ice-reservoir yield','https://www.frontiersin.org/journals/earth-science/articles/10.3389/feart.2021.771342/full']
].map(([topic,url])=>({topic,url}));
await fs.writeFile(history+'/scientific-references.json',JSON.stringify({checked:'2026-09-22',references,qualification:'Source-local cultural examples retained as source examples. No weather forecast, guaranteed water yield or unsupervised flame experiment is asserted.'},null,2));
console.log(`Recorded ${points.length} source links, 3 reasoning additions and ${corrections.length} corrections.`);
