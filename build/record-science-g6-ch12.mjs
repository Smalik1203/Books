import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {lesson,exercises,projects,closing} from './science-g6-ch12-content.mjs';
const history='assets/design-history/science-g6-ch12',source='C:/Books/6-10 Books/6/6 Science/Chapter 12.pdf';
const blocks=[{id:'opener',source:[1]},{id:'glossary',source:[18]},{id:'summary',source:[18,19]},...lesson,...exercises,...projects,closing];
const points=Array.from({length:23},(_,i)=>({pdfPage:i+1,printedPage:i+231,targets:blocks.filter(b=>b.source.includes(i+1)).map(b=>b.id)}));
const corrections=[
 {targets:['opener','visibility','light-pollution'],reason:'Ladakh is not guaranteed to be cloud-free or free of pollution. Visibility depends on local conditions, date, time and horizon.'},
 {targets:['pattern-task','patterns','constellations','winter-map','dipper-map','names'],reason:'Separate invented pictures, asterisms and the 88 defined constellation regions. Stars in a pattern need not be close in space. Cultural names are not equated with all modern constellation boundaries. Real star maps use J2000 catalogue positions.'},
 {targets:['telescope-art','sun-safety','pole-task','pole-explain','orion-task','venus-task','twinkling'],reason:'Adult-guided safe-ground observations. Never direct optical instruments at the Sun. Verify actual dates rather than promise year-round visibility. Polaris is near, not exactly on, the north axis. Merak-to-Dubhe pointer and belt-to-Sirius direction are specific; left/right on paper is not a fixed sky direction. Twinkling is a clue, not an infallible identification.'},
 {targets:['sun-art','day-stars','energy','planet-definition','motions','planet-groups','rings','temperature','pluto'],reason:'Fusion is not ordinary burning. Sun diameter about 109 Earth diameters. Rotation differs from revolution; seasons involve axial tilt. IAU planet definition includes orbital dominance. Distinguish gas and ice giants, particles from solid rings, and atmospheric effects from distance alone. Pluto remains a Solar System member.'},
 {targets:['moon-art','moon-phase','craters'],reason:'Distinguish 27.3-day sidereal orbit from 29.5-day phase cycle. Phases are not normally Earth’s shadow. Some moons exceed Mercury in size. The Moon has a tenuous exosphere and polar water ice; avoid absolute no-air/no-water claims.'},
 {targets:['lander-art','missions','mission-evidence'],reason:'Chandrayaan-3 landed in the southern high-latitude region, not at the exact pole. Generic commissioned lander image is identified as an artist’s impression, not a technical replica. Later mission plans are referred to current ISRO information rather than dated promises.'},
 {targets:['small-bodies','asteroids','comet-art','comet-process','comet-orbits'],reason:'Asteroids vary widely in size and are not a tightly packed wall. Comet ice can sublime; tails extend generally away from the Sun under sunlight and solar wind, rather than simply trailing motion. Not all comets return.'},
 {targets:['milky-band','galaxy-art','galaxy','membership','life-search','life-think'],reason:'Milky Way sky orientation varies. External galaxy view is an illustration, not a photograph taken from Earth. The membership chain does not show scale. Searches include the Solar System and exoplanets; a water detection is not confirmation of life.'},
 {targets:['q1','q5','q6','q7','q8','q10'],reason:'Matching rows deliberately do not give answers. Brightness alone does not prove proximity. The source’s incorrect planet-order image becomes incorrect named cards with the same two swapped pairs. Recognition maps reuse exact catalogue positions without solutions. Overnight repeated observation becomes a simulation or optional adult-approved observation that does not disrupt sleep.'},
 {targets:['project-stories','project-visit','project-light','project-hanle','project-art','closing'],reason:'Retain five extensions and an original end-of-book reflection. Separate cultural stories from scientific evidence; verify current visits and sources. No child electrical work. Observatory image is conceptual, not a specific Hanle building.'}
];
await fs.writeFile(history+'/source-coverage.json',JSON.stringify({source,sha256:createHash('sha256').update(await fs.readFile(source)).digest('hex'),sourcePdfPages:24,points,corrections,omissions:[{pdfPage:24,reason:'Blank Notes page; no instructional content.'}],counts:{numberedActivities:4,questions:11,closingProjects:5},editorialChoices:['Original prose and commissioned illustrations retain source topics, four activities, eleven questions and five extensions.','Repeated paragraphs in the source appear once.','Dedicated glossary and summary; complete panels, tables and questions stay together.','Star charts show selected catalogue stars, not complete constellation boundaries; brightness symbols are qualitative.','Planet sizes and spacing are explicitly not to scale.','Source book-closing message rewritten as an evidence-based notebook reflection.']},null,2));
const refs=[
 ['https://iauarchive.eso.org/public/themes/constellations/','Constellation regions and asterisms.'],
 ['https://vizier.cds.unistra.fr/viz-bin/VizieR?-source=V/50/catalog','Bright Star Catalogue, 5th revised edition: J2000 coordinates and visual magnitudes.'],
 ['https://cdsarc.cds.unistra.fr/viz-bin/ReadMe/V/50?format=html&tex=true','Catalogue field definitions.'],
 ['https://science.nasa.gov/solar-system/what-is-the-north-star-and-how-do-you-find-it/','Polaris, pointer stars and north rotation axis.'],
 ['https://science.nasa.gov/sun/facts/','Solar fusion, scale, distance and stellar neighbours.'],
 ['https://iauarchive.eso.org/news/pressreleases/detail/iau0603/','Adopted 2006 planet and dwarf-planet definitions.'],
 ['https://science.nasa.gov/solar-system/planets/','Eight planets and rocky, gas-giant and ice-giant groups.'],
 ['https://science.nasa.gov/learn/basics-of-space-flight/chapter1-2/','Planet composition and rings.'],
 ['https://science.nasa.gov/venus/venus-facts/','Venus atmosphere and surface temperature.'],
 ['https://science.nasa.gov/moon/moon-phases/','Orbit and phase-cycle distinction.'],
 ['https://science.nasa.gov/moon/facts/','Lunar size, distance, exosphere and water ice.'],
 ['https://science.nasa.gov/jupiter/jupiter-moons/ganymede/facts/','A moon can be larger than Mercury.'],
 ['https://www.isro.gov.in/Chandrayaan3.html','Chandrayaan-3 mission results.'],
 ['https://www.isro.gov.in/NSPD2026/','23 August 2023 landing and National Space Day.'],
 ['https://www.isro.gov.in/NSPD2025/assets/pdf/Scientific_Mission-Brochure.pdf','Southern high-latitude landing location.'],
 ['https://science.nasa.gov/solar-system/comets/facts/','Coma and tail formation.'],
 ['https://science.nasa.gov/solar-system/comets/1p-halley/','Halley period and 1986 passage.'],
 ['https://science.nasa.gov/exoplanets/search-for-life/','Evidence standards and no confirmed extraterrestrial life.'],
 ['https://www.iiap.res.in/centers/iao/?q=iao_site','Hanle site conditions.'],
 ['https://www.iiap.res.in/centers/iao/hdsr/','Hanle Dark Sky Reserve.']
];
await fs.writeFile(history+'/scientific-references.json',JSON.stringify(refs.map(([url,supports])=>({url,supports,checked:'2026-09-24'})),null,2));
console.log('Chapter 12: all 23 instructional source pages mapped; blank Notes page excluded.');
