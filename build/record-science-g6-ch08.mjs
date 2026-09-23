import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {lesson,exercises,projects} from './science-g6-ch08-content.mjs';
const history='assets/design-history/science-g6-ch08';
const source='C:/Books/6-10 Books/6/6 Science/Chapter 8.pdf';
const blocks=[{id:'opener',source:[1]},{id:'glossary',source:[18]},{id:'summary',source:[18,19]},...lesson,...exercises,...projects];
const points=Array.from({length:20},(_,i)=>({pdfPage:i+1,printedPage:i+143,targets:blocks.filter(b=>b.source.includes(i+1)).map(b=>b.id)}));
const corrections=[
 {targets:['ice-task','ice-evidence','ice-change','changes','states-table'],reason:'Retain reversible state changes without implying that freezer additives are needed or that volume is unchanged across freezing. Compare each state under similar conditions.'},
 {targets:['plate-task','plate-evidence','drying-table','invisible-vapour'],reason:'Check underside, cracks, spills and disturbances. Puddles can lose water by both evaporation and infiltration. Vapour is invisible; white mist is droplets.'},
 {targets:['cold-task','cold-evidence','condensation-art','dew'],reason:'Dry external surfaces first; compare room-temperature glass. Record actual outcomes. No visible level change alone is not proof against leakage.'},
 {targets:['mass-task','mass-evidence','mass-limits'],reason:'Measure total mass of tumbler, contents, cover and drip tray, not just cold water. Melting and temperature affect volume; gain supports incoming condensation but does not rule out simultaneous leakage. Protect balance electronics and account for resolution.'},
 {targets:['humidity','awg','project-humidity'],reason:'Distinguish reported relative humidity from a simple amount of vapour. Condensation does not by itself guarantee safe drinking water.'},
 {targets:['other-liquids','area-task','area-evidence','sun-task','rate-table','milk'],reason:'Use water only, not flammable sanitiser. Control starting amount, temperature, airflow and intervals. Cap versus plate also changes container; weather changes multiple factors. Residue after milk dries is not zero evaporation.'},
 {targets:['cooling','earthen-pot','cooler-task','cooler-evidence','cooler-think'],reason:'Cooling is energy transfer during evaporation, not production of cold. Retain pores, wet sand, airflow and humidity. Model cooler is not a refrigerator or guarantee of food safety; no tasting test vegetables.'},
 {targets:['clouds','rising-air','rain','cloud-task','cloud-evidence'],reason:'Moist air can rise, expand and cool; vapour does not separately rise like a balloon. Clouds contain droplets and/or ice; hail and snow are not just merged liquid drops. Replace pupil burning-paper bottle procedure with teacher-led approved demonstration or comparable recorded observations; distinguish mist from visible particles.'},
 {targets:['cycle-art','cycle-task','water-cycle','groundwater','water-care'],reason:'Retain all source labels and movements, distinguish porous groundwater from a giant underground lake, and explain multiple routes and times. Painted landscape intentionally unlabelled for the learner mapping task.'},
 {targets:['q2','q3','q5','q6','q10'],reason:'Qualify paint and ink formulation, transpiration versus other temperature factors, and fan airflow. Sludge drying reduces transport mass but is not evidence of pathogen or pollutant removal. Hot-seat cooling is adult-assisted and kept away from electrical parts.'}
];
await fs.writeFile(history+'/source-coverage.json',JSON.stringify({source,sha256:createHash('sha256').update(await fs.readFile(source)).digest('hex'),sourcePdfPages:20,points,corrections,counts:{numberedActivities:11,investigatePanels:9,reasoningActivities:['8.6','8.11'],questions:10,sourceClosingExtensions:3,additionalSourceExtension:'Humidity record from source page 7',projects:4},referenceSourcePages:{glossary:[18],summary:[18,19]},editorialChoices:['Repeated text embedded in neighbouring PDF pages is not repeated in the lesson.','The introductory literary quotation is omitted; the Aavi/Thirav ice-and-water enquiry is retained.','The poem task uses an original prompt instead of reproducing the source verse.','The state-map task has five missing labels and two supplied labels, preserving all three states and all four transformations.','Clinical and molecular details beyond the source syllabus are not introduced.']},null,2));
await fs.writeFile(history+'/scientific-references.json',JSON.stringify([
 {url:'https://www.usgs.gov/water-science-school/science/condensation-and-water-cycle',supports:'Condensation, droplets on cold surfaces and atmospheric water.'},
 {url:'https://www.usgs.gov/water-science-school/science/evaporation-and-water-cycle',supports:'Evaporation and evaporative cooling.'},
 {url:'https://www.usgs.gov/water-science-school/science/precipitation-and-water-cycle',supports:'Growth of droplets/ice and liquid versus solid precipitation.'},
 {url:'https://psl.noaa.gov/outreach/education/activities/cloudbottle.html',supports:'Expansion/cooling and condensation nuclei in a demonstration. Archived scientific background only; old powder-handling instructions are not reproduced.'},
 {url:'https://www.epa.gov/biosolids/pathogens-and-vector-attraction-sewage-sludge',supports:'Sludge safety requires treatment and assessment; ordinary drying is not proof of safety.'}
],null,2));
console.log('Chapter 8 source coverage and scientific corrections recorded.');
