import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {lesson,exercises,projects} from './science-g6-ch07-content.mjs';
const history='assets/design-history/science-g6-ch07';
const source='C:/Books/6-10 Books/6/6 Science/Chapter 7.pdf';
const blocks=[{id:'opener',source:[1]},...lesson,...exercises,...projects];
const points=Array.from({length:19},(_,i)=>({pdfPage:i+1,printedPage:i+123,targets:blocks.filter(b=>b.source.includes(i+1)).map(b=>b.id)}));
const corrections=[
 {targets:['touch-task','touch-evidence','bowls-art'],reason:'Use comfortably warm/cool water and brief contact, remove ice, stop on discomfort. Actual sensations are recorded before the explanation.'},
 {targets:['clinical-task','clinical-method','clinical-reference','site-qualification','q9','q14'],reason:'Adult-supervised, optional measurements; permission, privacy, manufacturer-approved site and hygiene. Do not share oral thermometers, apply fixed site corrections, diagnose from a classroom record or equate reaching 37 °C with recovery.'},
 {targets:['mercury','lab-intro','instrument-table','q8'],reason:'Teacher-approved mercury-free laboratory equipment; clinical and laboratory uses distinguished. Broken mercury thermometers require adult response, not pupil cleanup.'},
 {targets:['division-task','division-equation','resolution','q6','q7','q10','q11','q12','q13'],reason:'Count intervals, not marks; construct scales numerically so half-degree readings are unambiguous. Distinguish scale resolution from instrument accuracy.'},
 {targets:['water-task','water-apparatus','water-evidence','removal','q5'],reason:'Bulb immersed and clear of beaker; steady reading at eye level while immersed. Diagrams distinguish tilt, correct placement, bottom contact and side contact.'},
 {targets:['teacher-demo','phase-change','pressure','boiling-data-task','boiling-table','boiling-evidence'],reason:'Boiling only teacher-led. Qualify 0/100 °C by purity, phase coexistence and pressure. Source Shillong readings retained, spread 0.3 °C, different readings not automatically errors.'},
 {targets:['air-start','weather-reading','max-min','weather-task','weather-evidence','air-think'],reason:'Distinguish room and properly sheltered outdoor air temperatures. Daily extremes require records; ten days do not establish climate.'},
 {targets:['project-animals','project-india','project-planets','project-room-water'],reason:'Retain all four extensions. No pupil animal measurements; distinguish forecasts from records and planetary surface/atmosphere values; fixed site and proper immersion for the two-week comparison.'}
];
await fs.writeFile(history+'/source-coverage.json',JSON.stringify({source,sha256:createHash('sha256').update(await fs.readFile(source)).digest('hex'),sourcePdfPages:20,omittedPages:[{page:20,reason:'Notes page: all recording is in the notebook.'}],points,corrections,counts:{numberedActivities:7,investigatePanels:7,questions:14,projects:4},referenceSourcePages:{glossary:[14],summary:[14]},editorialChoices:['Source anecdote adapted to adult-supported measurement.','Source historical quotation omitted; Anna Mani’s measurement work retained without an unverified quotation.','Peripheral Sun-core temperature fact omitted; absolute-zero and planetary-temperature extension retained.','Source repeated scan text is not duplicated.','All three comparison/data tables numbered sequentially in this edition.']},null,2));
await fs.writeFile(history+'/scientific-references.json',JSON.stringify([
 {url:'https://www.nhs.uk/baby/health/how-to-take-your-babys-temperature/',supports:'Age/site-specific clinical technique and manufacturer instructions.'},
 {url:'https://www.bipm.org/en/measurement-units/si-base-units',supports:'Kelvin as the SI base unit of thermodynamic temperature.'},
 {url:'https://www.bipm.org/en/publications/si-brochure',supports:'Kelvin/Celsius relationship, 273.15 offset and temperature unit symbols.'},
 {url:'https://www.usgs.gov/observatories/yvo/news/how-hot-are-yellowstones-boiling-waters-some-are-hotter-others',supports:'Boiling temperature depends on pressure and dissolved substances.'},
 {url:'https://public.wmo.int/media/news/celebrating-pioneer-indian-meteorologist-anna-mani',supports:'Anna Mani’s instrument standardisation and meteorological work.'}
],null,2));
console.log('Chapter 7 source coverage, qualifications and references recorded.');
