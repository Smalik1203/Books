// Trace the supplied Chapter 5 PDF to the rewritten teaching sequence.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {lesson,exercises,projects} from './science-g6-ch05-content.mjs';
const history='assets/design-history/science-g6-ch05';
const source='C:/Books/6-10 Books/6/6 Science/Chapter 5.pdf';
const blocks=[{id:'opener',source:[1]},...lesson,...exercises,...projects];
const points=Array.from({length:22},(_,i)=>({pdfPage:i+1,printedPage:i+79,targets:blocks.filter(b=>b.source.includes(i+1)).map(b=>b.id)}));
points[17].targets.push(...lesson.filter(b=>b.id==='connect').map(b=>b.id));
const corrections=[
 {targets:['periodic','periodic-think','q11'],reason:'Circular and oscillatory paths are not automatically periodic. Equal-time repetition is required.'},
 {targets:['project1'],reason:'Divide stack thickness by sheet count, not printed page faces.'},
 {targets:['project6'],reason:'Replace the source metal strip attached near spokes with a chalk mark and a bicycle walked by an adult.'},
 {targets:['circle-task'],reason:'Teacher demonstration uses a securely tied soft ball instead of a hard potato; clear space, slow motion and no release.'},
 {targets:['road-picture','reference','direction'],reason:'Redrawn model positions are explicitly illustrative. Location also needs a direction or route.'},
 {targets:['least-division','measurement-evidence'],reason:'Smallest graduation and agreement do not guarantee exactness or eliminate systematic error.'},
 {targets:['q7','project5'],reason:'Height measurements use permission, adult help and private records without ranking classmates.'}
];
await fs.writeFile(history+'/source-coverage.json',JSON.stringify({source,sha256:createHash('sha256').update(await fs.readFile(source)).digest('hex'),sourcePdfPages:22,points,corrections,counts:{investigations:7,questions:13,projects:6},referenceSourcePages:{glossary:[18],summary:[18]}},null,2));
await fs.writeFile(history+'/scientific-references.json',JSON.stringify([
 {url:'https://www.bipm.org/en/si-base-units/metre',supports:'Metre as SI base unit of length.'},
 {url:'https://www.bipm.org/en/publications/si-brochure',supports:'SI prefixes and unit-symbol conventions.'},
 {url:'https://media.aws.iaaf.org/competitioninfo/2023%20Course%20Measurement%20Book%20-%20ENG.pdf',supports:'Professional calibrated-bicycle road-course measurement and pre/post calibration.'}
],null,2));
console.log('Chapter 5 source coverage and scientific references recorded.');
