import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {title,lesson,exercises,projects} from './science-g7-ch08-content.mjs';
const history='assets/design-history/science-g7-ch08',file='C:/Books/6-10 Books/7/7 Science/Chapter 8.pdf';
await fs.writeFile(history+'/source.json',JSON.stringify({file,title,class:7,chapter:8,pdfPages:16,printedPages:[105,120],sha256:createHash('sha256').update(await fs.readFile(file)).digest('hex'),scope:'Only Chapter 8 authored. Chapters 9–12 remain future references.'},null,2));
const points=[
 ['race-and-access',[1],['opener','accessible-clocks'],'Prerna, district/state/India aspirations, sister and Olympics, stopwatch, wristwatch, phone, tactile/Braille and talking timepieces.'],
 ['natural-cycles',[2],['natural-cycles'],'Day, lunar phases and seasons; smaller intervals require clocks.'],
 ['early-devices',[2],['old-clocks','clock-principles','project-bowl'],'Figures 8.1–8.4: sundial, outflow water clock, sinking bowl, hourglass and candle clock.'],
 ['activity-8.1',[3],['make-clock','water-intro','water-task','water-evidence','water-flow'],'0.5 L or larger reused bottle, cut/cap hole/inversion, optional colour, one-minute marks, reset and compare. Figure 8.5 replaced by live labelled apparatus. Adult cutting and spill safety added.'],
 ['jantar-mantar',[3],['jantar','solar-time'],'Early eighteenth century, Jaipur, UNESCO, monumental approximately 27 m sundial and local solar time retained. Fine graduations separated from actual accuracy; exact 1 mm/s shadow and guaranteed 2 s reading removed as context-dependent rather than essential mechanisms.'],
 ['indian-history',[4,7],['indian-timekeeping','ghatika'],'Arthashastra, Shardulakarnavadana, Varahamihira, Aryabhata-associated tradition, ghatika-yantra, public signalling, 24 min ghati and 60 per day. Contested first-ever claims and exact text dating not asserted.'],
 ['mechanical-history',[4],['mechanical-clocks','clock-history-art'],'Weights/gears/springs; Galileo and qualified lamp tradition; Huygens 1656 construction/1657 patent. Birth/death dates and claimed daily error omitted as non-instructional biographical/precision trivia.'],
 ['pendulum-definition',[5],['pendulum-definition','pendulum-positions','oscillation','period'],'Bob, thread, support, mean and extreme positions, full oscillation from O or A, period, Class 6 hanging eraser. Figure 8.7 live and geometrically consistent.'],
 ['activity-8.2',[5,6],['pendulum-task','pendulum-evidence','period-example','period-record'],'150 cm thread, approximately 100 cm pivot-to-centre length, gentle release, ten oscillations, three/four trials, source Table 8.1 fields and division by ten. Repeated-trial sample explicitly illustrative and follows own data collection.'],
 ['pendulum-variables',[6],['pendulum-variables','length-extension','mass-extension','pendulum-conclusion'],'Both additional experiments retained: 2–3 lengths with same bob and different masses at same length. One variable at a time, small-angle/local-gravity qualifications.'],
 ['modern-clocks',[7],['modern-mechanisms','accessible-clocks','clock-accuracy'],'Quartz and atomic timekeeping; source Figure 8.8 replaced by painted accessible examples. No unverified contemporary accuracy record or literal oscillating-atom picture.'],
 ['time-units',[7],['second','time-units','unit-writing'],'SI second and symbol; min/h, 60/3600 conversions; lowercase names, no plural symbol/full stop and space between number and unit.'],
 ['activity-8.3',[8],['clock-task','clock-evidence'],'Source Figure 8.9 replaced by live 60-division, three-hand dial. Determine smallest interval before explanation; distinguish display resolution and timing accuracy.'],
 ['science-society',[8],['time-applications'],'Sport, ECG, digital sound, computing, space and precise measurements. No clinical interpretation.'],
 ['slow-fast',[8,9],['race-comparison','speed-comparison','different-distances'],'Source Figure 8.10 represented by painted race opener. Equal distances/times; correct inference about runner ahead to average since common start.'],
 ['speed-definition',[9,11],['average-definition','speed-rule'],'Distance/time, SI m/s and km/h, clearly called average from first definition.'],
 ['example-8.1',[10],['cycling-art','example-one','swati-work','speed-units'],'Swati 3.6 km / 15 min = 4 m/s, explicit distance/time conversion and added m/s–km/h factor.'],
 ['activity-8.4',[10],['railways','train-task','train-record','train-evidence'],'Official timetable, local station and next stop, 4–5 trains and service types; every source Table 8.2 field retained. Cumulative subtraction, midnight dates and schedule-versus-measurement distinction added.'],
 ['relationships-examples',[11],['relationships','relationships-intro','distance-rule','time-rule','interval-check'],'All three formulas; bus 50 km/h × 2 h = 100 km and train 360 km / 90 km/h = 4 h.'],
 ['uniform-nonuniform',[12,13],['linear','train-stages','motion-comparison','everyday-motion'],'Straight-track A–B acceleration, B–C steady, C–D slowing; uniform/non-uniform definitions and real-world idealisation. Source Figure 8.11 native schematic.'],
 ['instruments',[12],['instruments','instrument-art'],'Speedometer versus odometer, source Figure 8.12 rendered live, distinguish current reading from journey average.'],
 ['table-8.3',[13],['motion-table','motion-table-reading','motion-pause'],'All seven times and both train distance series retained. First interval marked —, not a measured zero. Sampling limitation added.'],
 ['summary',[14],['summary','glossary'],'All six original summary concepts retained with qualifications and reference definitions.'],
 ...exercises.map((q,i)=>['assessment-'+(i+1),q.source,[q.id],'Source question '+(i+1)+' and all subparts retained. Tables 7 and 10 visually cross-checked against PDF pages 14 and 15; no answer spaces.']),
 ...projects.map(p=>[p.id,p.source,[p.id],'Source project retained, with safe participation and limits of inference explicit.']),
 ['closing-time',[16],['time-questions'],'When/how long and fractional seconds through centuries; cosmological beginning reframed as an open question rather than a demonstrated fact.']
].map(([id,sourcePages,targets,treatment])=>({id,sourcePages,targets,treatment}));
const corrections=[
 {targets:['water-flow','water-pause'],change:'Declining head and collector shape affect mark spacing; calibration belongs to one setup.'},
 {targets:['mechanical-clocks','indian-timekeeping','jantar'],change:'Do not present legendary history, first-ever attributions or scale resolution as guaranteed accuracy.'},
 {targets:['pendulum-definition','pendulum-task','pendulum-conclusion'],change:'Length is pivot to bob centre; near-constant period requires small angles, fixed length and location. Mass comparison keeps length fixed.'},
 {targets:['modern-mechanisms','second','clock-accuracy'],change:'Atomic transition frequencies, current SI definition, and resolution distinct from accuracy.'},
 {targets:['race-comparison','average-definition','relationships-intro'],change:'Distance/time gives average speed over the specified interval, not necessarily speed at a particular instant.'},
 {targets:['motion-table','motion-table-reading','motion-pause'],change:'Equal distances at ten-minute checkpoints do not prove constant speed between readings; first interval not recorded.'},
 {targets:['q5','q6'],change:'18 m/s is an example horse speed, not a record. Empty highway or city location alone does not define uniform/non-uniform linear motion.'},
 {targets:['project-pulse','project-swing'],change:'Voluntary private resting-pulse activity, no medical diagnosis; adult-supervised small swing, no weighing children or modifying equipment.'},
 {targets:['time-questions'],change:'Replace categorical claim that time began with the Universe by a bounded discussion of measurable intervals and open cosmological questions.'}
];
await fs.writeFile(history+'/source-coverage.json',JSON.stringify({source:'Supplied Chapter 8.pdf, PDF pages 1–16 / printed 105–120',points,additions:lesson.filter(b=>b.addition).map(b=>({targets:[b.id],reason:b.addition})),corrections,omitted:'Publisher furniture, decorative enquiry words, answer spaces and repeated instructions. Historical trivia and precision claims are treated explicitly in the relevant ledger entries; every substantive experiment, comparison, calculation, question and project is represented.'},null,2));
const references=[
 ['SI second','https://www.bipm.org/en/si-base-units/second'],
 ['Clock mechanisms','https://www.nist.gov/pml/time-and-frequency-division/timekeeping-and-clocks-faqs'],
 ['Huygens and mechanical clock history','https://www.nist.gov/pml/time-and-frequency-division/popular-links/walk-through-time/walk-through-time-revolution'],
 ['Simple pendulum assumptions','https://openstax.org/books/university-physics-volume-1/pages/15-4-pendulums'],
 ['Jantar Mantar chronology and status','https://whc.unesco.org/en/list/1338'],
 ['Samrat Yantra dimensions','https://www.tourism.rajasthan.gov.in/jantar-mantar.html'],
 ['Resting wrist-pulse method','https://collingwoodsurgery.nhs.uk/new-york/common-questions/accidents-first-aid-and-treatmentshow-do-i-check-someones-pulse']
].map(([topic,url])=>({topic,url}));
await fs.writeFile(history+'/scientific-references.json',JSON.stringify({checked:'2026-09-22',references,qualification:'Historical Indian text associations retained as source accounts, not independent first-ever invention claims. No contemporary sporting records or live railway timetable values are invented.'},null,2));
console.log(`Recorded ${points.length} coverage links and ${corrections.length} scientific/editorial corrections.`);
