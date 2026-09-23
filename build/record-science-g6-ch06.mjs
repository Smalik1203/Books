import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {lesson,games,exercises,projects} from './science-g6-ch06-content.mjs';
const history='assets/design-history/science-g6-ch06';
const source='C:/Books/6-10 Books/6/6 Science/Chapter 6.pdf';
const blocks=[{id:'opener',source:[1]},...lesson,...games,...exercises,...projects];
const points=Array.from({length:21},(_,i)=>({pdfPage:i+1,printedPage:i+101,targets:blocks.filter(b=>b.source.includes(i+1)).map(b=>b.id)}));
const corrections=[
 {targets:['hardness-task','hardness-evidence','mechanical-table','q5','q8'],reason:'Separate scratch hardness, stiffness, compressibility and chair strength. Object geometry matters; pressing does not uniquely establish scratch hardness.'},
 {targets:['bounce-task','bounce-evidence'],reason:'Control drop height, release, floor and repetition. Real sports balls may differ in construction, size, pressure and mass; the test does not isolate material alone.'},
 {targets:['dissolve-task','dissolve-evidence','limits','solubility-table','q10'],reason:'Predictions precede addition and stirring. Dissolving is not destruction; distinguish dissolution from suspension, sediment and flotation and qualify finite solubility.'},
 {targets:['ors'],reason:'WHO emergency mixture retained with level measures and adult/medical guidance. Packet-specific volume replaces the incorrect blanket one-litre instruction. This is explanatory prose, never a learner tasting activity.'},
 {targets:['mass-task','mass-weight','volume-evidence','labels','units'],reason:'Subtract empty cup mass; distinguish mass from weight and volume from capacity. Same-height granular samples contain air spaces. Equal labelled liquid volumes need not have equal masses.'},
 {targets:['air-evidence'],reason:'Trapped-air observation demonstrates occupied space, not mass; each claim needs separate evidence.'},
 {targets:['clay-story','clay-evidence','historical','historical-table'],reason:'Retain craft and historical classification context without reproducing uncertain earliest-pottery dates or presenting traditional categories as measured science or medical evidence.'},
 {targets:['tumbler-think','purpose-evidence','tumbler-table'],reason:'Distinguish ordinary uncoated cloth from waterproof-lined construction; qualify food-contact and heating suitability.'},
 {targets:['light-evidence','light-table','hide-explain','q9'],reason:'Scattering explains translucency. Samples, thickness and lighting qualify the categories; vague cannot-see-clearly riddle made unambiguous.'},
 {targets:['project1','project2','project4'],reason:'Recycling acceptance is local. Adult supervision and handling restrictions for scrap and cutting retained or strengthened.'}
];
await fs.writeFile(history+'/source-coverage.json',JSON.stringify({source,sha256:createHash('sha256').update(await fs.readFile(source)).digest('hex'),sourcePdfPages:22,omittedPages:[{page:22,reason:'Blank Notes page; notebook work is used throughout.'}],points,corrections,counts:{numberedActivities:8,investigatePanels:7,reasoningActivity:'6.3',games:2,questions:10,projects:4},referenceSourcePages:{glossary:[17],summary:[18]}},null,2));
await fs.writeFile(history+'/scientific-references.json',JSON.stringify([
 {url:'https://www.who.int/news-room/questions-and-answers/item/cholera-outbreaks',supports:'ORS sachet directions, emergency sugar–salt mixture and medical care.'},
 {url:'https://www.bipm.org/en/measurement-units/si-base-units',supports:'Kilogram as SI base unit of mass.'},
 {url:'https://www.bipm.org/en/publications/si-brochure',supports:'Volume units, litre relationships and unit-symbol conventions.'},
 {url:'https://nationalmuseumindia.gov.in/assets/pdf/Life-in-Harappan-Civilization-activity-booklet.pdf',supports:'Red-slip pottery, patterned vessels and storage uses.'}
],null,2));
console.log('Chapter 6 source coverage and scientific corrections recorded.');
