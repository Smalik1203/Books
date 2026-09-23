import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {lesson,exercises,projects} from './science-g7-ch12-content.mjs';
const history='assets/design-history/science-g7-ch12';
const source='C:/Books/6-10 Books/7/7 Science/Chapter 12.pdf';
const corrections=[
 {targets:['turning-task'],change:'Retains relative-motion experiment; slow supervised standing alternative added to seated playground-platform observation.'},
 {targets:['daily-sky','stars-question','pole-evidence'],change:'Avoids universal overhead-at-noon claim and universal rise/set claim; Pole Star is nearly, not exactly, stationary.'},
 {targets:['tilt','distance-misconception','calendar','equinox','polar-days'],change:'Explains both illumination angle and duration; distinguishes 23.5-degree axial tilt, solstice-date variation, approximate equinox day length and polar latitude dependence.'},
 {targets:['thumb-task','solar-safety','projection-picture','mirror-projection'],change:'No naked-eye Sun demonstration; contemporary solar-filter and optical-instrument safety; teacher-supervised indirect projection preferred.'},
 {targets:['solar-path','monthly','red-moon','lunar-view'],change:'Annular eclipses, tilted lunar orbit and reddened lunar light added to explain limits and close common misconceptions.'},
 {targets:['q3','q4','q6','q7'],change:'Assessed concepts retained with enough location/viewing information and explicit safety conditions.'},
 {targets:['project4'],change:'Source closing invitation to find clues on the original publisher cover adapted to this book’s illustrations and everyday observations; source Sun-wobble aside retained here.'}
];
const coverage={source,sourceSHA256:createHash('sha256').update(await fs.readFile(source)).digest('hex'),pdfPages:20,teachingSourcePages:[1,18],
 points:[{id:'opener',sourcePages:[1],targets:['opener'],treatment:'Rashmika, Kanniyakumari and changing coconut-tree shadows retained.'},...lesson.map(b=>({id:b.id,sourcePages:b.source,targets:[b.id],...(b.sourceActivity?{sourceActivity:b.sourceActivity}:{})})),...exercises.map(q=>({id:q.id,sourcePages:q.source,targets:[q.id]})),...projects.map(p=>({id:p.id,sourcePages:p.source,targets:[p.id]}))],corrections,
 sourceCounts:{activities:4,assessmentQuestions:12,projects:3},additionalClosingProject:'project4',
 omitted:'Publisher furniture, extraction duplicates, unneeded dialogue, original-cover-specific clue count, and blank Notes page 20. No substantive assessed concept omitted.',
 visualPolicy:'Every output page contains at least one contextual transparent PNG. Diagram geometry and all labels are live vector/text. The chapter-specific fitter reserves space for an illustrated recall prompt if a text-heavy page lacks an image; text is never reduced to make space.'};
await fs.writeFile(history+'/source-coverage.json',JSON.stringify(coverage,null,2));
await fs.writeFile(history+'/scientific-references.json',JSON.stringify({checked:'2026-09-23',references:[
 {topic:'Eclipse viewing safety and indirect projection',url:'https://science.nasa.gov/eclipses/safety/'},
 {topic:'Eclipse alignment and the tilted lunar orbit',url:'https://science.nasa.gov/eclipses/geometry/'},
 {topic:'Total, partial and annular solar eclipses',url:'https://science.nasa.gov/eclipses/types/'},
 {topic:'Axial tilt and seasons',url:'https://science.nasa.gov/helio-and-you-seasons-on-earth-mars-and-beyond/'},
 {topic:'Kodaikanal Solar Observatory, established 1899',url:'https://www.iiap.res.in/centers/kso/'},
 {topic:'Indian observatories and Bappu’s work',url:'https://www.iiap.res.in/about-us/history/'},
 {topic:'Aryabhata, Foucault and indigenous seasonal sky knowledge',source:'Supplied Chapter 12.pdf, PDF pages 5, 7 and 8; paraphrased with observational limits.'}
 ]},null,2));
console.log('Recorded source coverage, scientific qualifications and the image-per-page policy.');
