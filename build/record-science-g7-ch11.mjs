import fs from 'node:fs/promises';
import {lesson,exercises,projects} from './science-g7-ch11-content.mjs';
const history='assets/design-history/science-g7-ch11';
const points=[
 ['opening',[1],['opener','fireflies'],'Western Ghats visit, Keshav/Jatin, firefly communication, habitat and lighting threats; Moon and vehicle-light questions retained in new prose.'],
 ['sources',[2],['seeing','luminous','natural-artificial'],'Natural and human-controlled sources, luminous/non-luminous definitions and Moon distinction; source illustrations represented by examples and firefly art.'],
 ['lighting-society',[2],['led'],'Efficient lamps, Indian lighting programmes and end-of-life handling retained; compare equal lumens instead of claiming every LED is brighter.'],
 ['activity-11.1',[3],['straight-question','holes-task','holes-evidence'],'Three aligned holes, torch, screen, displaced card and restored control; painted setup without outcome.'],
 ['activity-11.2',[3],['tube-task','tube-evidence'],'Straight/bent tube investigation; battery tealight preferred and teacher candle version retained. Dull interior, direct view and reflected glow distinguished.'],
 ['beam-extension',[4],['ray-model','beam-visibility'],'Teacher-only laser/milky water extension, beam stop and eye protection by geometry, safer torch alternative, scattering and limits of straight-line model.'],
 ['activity-11.3',[4,5],['materials-question','materials-task','material-record'],'Torch/screen and glass, tracing paper, paper, cardboard, thick cloth. Every Table 11.1 prediction/observation/classification field retained; notebook recording guide.'],
 ['transmission',[5],['transmission-table','material-limits'],'Transparent/translucent/opaque comparison in aligned criteria; qualified for scattering and sample thickness.'],
 ['activity-11.4',[6],['shadow-task','shadow-record'],'All Table 11.2 changes: remove screen/object/light, change colour, move towards source/screen, tilt. Setup art before results.'],
 ['shadows',[5,6,7],['shadow-explanation','shadow-size','shadow-rays','shadow-colour','soft-shadows','shadow-pause'],'Shadow conditions, everyday surfaces, size/shape/sharpness, colour, faint shadows and incomplete object identification. Region distinguished from screen.'],
 ['activity-11.5',[7,8],['shiny-question','redirect-task','reflection-definition'],'Polished plate/plane mirror redirects light; turning changes spot. Torch preferred; adult sunlight version retained with safe direction.'],
 ['activity-11.6',[8],['slit-task','reflection-evidence','reflection-rays','reflection-rule'],'Masked comb, narrow slit, torch, white paper, mirror and changed direction. Initial apparatus repainted; explanatory rays separate from setup.'],
 ['activity-11.7',[9],['mirror-question','pen-task','virtual-image','pen-image','mirror-size'],'Pen, moving object, erect/same-size image and screen test. Virtual location and apparent angular size clarified.'],
 ['activity-11.8',[9,10],['self-task','lateral'],'Moving observer, distance relation, left arm/right ear and orientation. Safe optional position-matching measurement added.'],
 ['mirror-writing',[10],['mirror-word','ambulance'],'Ambulance mirror writing, live transformed lettering, symmetric letter qualification.'],
 ['mirror-craft',[10],['metal-mirror'],'Aranmula Kannadi and polished-metal craft retained; unsupported universal loss of metal-mirror craft omitted.'],
 ['activity-11.9',[11],['pinhole-question','pinhole-task','pinhole-explanation','pinhole-rays','pinhole-tradeoff'],'Card pinhole, source, screen and inverted image; battery LED shape preferred, teacher candle alternative retained; brightness/clarity comparison added.'],
 ['activity-11.10',[11],['camera-task','camera-distance'],'Two sliding boxes, pinhole, 5–6 cm tracing-paper screen, shaded viewing, sunlit tree/building, sliding and colour/orientation retained. Explicit Sun and cutting safety.'],
 ['image-distinction',[12],['image-comparison','image-pause'],'Mirror lateral inversion versus inverted pinhole image, plus shadow comparison, aligned by criteria.'],
 ['periscope',[12],['periscope-heading','periscope-build','periscope-model','periscope-use','periscope-world'],'Two mirrors in bent housing, hidden view and practical uses; parallel 45-degree geometry explicit. Painted housing with separate exact path model.'],
 ['kaleidoscope',[12,13],['kaleidoscope-heading','kaleidoscope-build','kaleidoscope-parts','kaleidoscope-explain','kaleidoscope-open','device-comparison'],'Three inward mirrors, tube, clear window, coloured pieces, diffuser, turning and multiple reflections; open-ended variant and design/art links retained. Smooth plastic replaces broken bangles.'],
 ['summary',[13],['summary','glossary'],'Seven source themes retained in ten summary points; fourteen definitions added.'],
 ['travel-time',[16],['light-time','connections-pause'],'Approximately 8 min 20 s Sun–Earth light delay retained; average distance qualified.'],
 ...exercises.map((q,i)=>['question-'+(i+1),q.source,[q.id],({2:'Source four-person pipe figure rewritten as four named, explicitly defined tube arrangements; same direct-line-of-sight reasoning and sketch response.',3:'Source shadow-image options rewritten as four unambiguous relative-position alternatives, with required labelled sketch.',4:'Source ball-position shadow options rewritten as two size predictions; painted apparatus identifies common conditions.',5:'All four torch/ball/two-light matching conditions retained; two-shadow separation and overlap qualified.',6:'Asymmetric painted tree replaces source tree; learner tracks top and unequal crown orientation.',8:'All three source clock times retained; actual observations and solar-noon qualification replace a prescribed noon result.',10:'Empty periscope tube redrawn with live vector geometry; learners place both mirrors.'})[i]||'All substantive question requirements retained with scientific and safety qualifications.']),
 ...projects.map(q=>[q.id,q.source,[q.id],'Source project retained with explicit prediction/observation and safe materials; cause and evidence distinguished.'])
].map(([id,sourcePages,targets,treatment])=>({id,sourcePages,targets,treatment}));
points.find(p=>p.id==='question-3').treatment='Source five-mouth branched tube repainted; original four observer positions retained with live names. Battery LED replaces candle; dull walls and direct-view criterion explicit.';
points.find(p=>p.id==='question-11').treatment='Source U-shaped tube with both openings on the same side retained, distinct from lesson periscope; learners choose orientations for this geometry.';
const corrections=[
 [['led'],'Compare lamps at similar lumen output; qualify efficiency and avoid blanket brightness claims.'],
 [['ray-model','beam-visibility','tube-evidence'],'Straight paths in uniform media; side visibility needs scattering, bent shiny tubes may reflect light, diffraction acknowledged.'],
 [['transmission-table','material-limits'],'Transparent does not mean 100% transmission; translucency involves scattering; thickness and gaps matter.'],
 [['shadow-explanation','shadow-colour','soft-shadows','q12'],'Shadow region versus visible surface, extended-source partial blocking and colour/ambient-light qualifications.'],
 [['reflection-definition','lateral','virtual-image'],'Rough surfaces reflect too; virtual image does not send light from behind mirror; lateral inversion is a front–back reflection.'],
 [['pinhole-task','camera-task','camera-distance'],'Prefer low-power battery light, retain supervised flame option; sliding pinhole screen changes scale without lens focusing; never view Sun.'],
 [['kaleidoscope-build','kaleidoscope-explain'],'Smooth plastic replaces sharp fragments; no guarantee of a novel pattern after every possible turn.'],
 [['q9'],'Shortest observed shadow depends on local solar time, not necessarily clock noon.']
].map(([targets,change])=>({targets,change}));
await fs.writeFile(history+'/source-coverage.json',JSON.stringify({source:'Supplied Chapter 11.pdf, PDF pages 1–16 / printed pages 153–168',points,corrections,additions:lesson.filter(b=>b.addition).map(b=>({targets:[b.id],reason:b.addition})),omitted:'Publisher decoration, duplicated extraction text, blank writing cells, unsupported historical generalisations and nonessential dialogue. Exercise figures 11.17–11.18 adapted to explicit verbal alternatives and painted apparatus; no assessed concept removed.'},null,2));
const references=[
 ['Plane mirrors, real/virtual distinction and multiple reflections','https://openstax.org/books/university-physics-volume-3/pages/2-1-images-formed-by-plane-mirrors'],
 ['Pinhole image orientation and construction','https://dev-annex.exploratorium.edu/science-explorer/pringles_pinhole.html'],
 ['Light and pinhole brightness/sharpness','https://www.exploratorium.edu/sites/default/files/pdfs/facets_of_light1980.pdf'],
 ['Efficient LED lighting','https://www.energy.gov/cmei/ssl/led-basics'],
 ['Equal-output lighting comparisons','https://www.energy.gov/cmei/femp/purchasing-energy-efficient-light-bulbs'],
 ['Indian UJALA programme','https://eeslindia.org/img/news_m/Government-of-Indias-UJALA-Street-Lighting.pdf'],
 ['Firefly light disturbance','https://www.xerces.org/publications/fact-sheets/firefly-friendly-lighting'],
 ['Firefly habitat and tourism','https://xerces.org/publications/guidelines/conserving-jewels-of-night'],
 ['Aranmula metal mirrors','https://www.keralatourism.org/campaigns/kerala365/aranmula-kannadi-pathanamthitta']
].map(([topic,url])=>({topic,url}));
await fs.writeFile(history+'/scientific-references.json',JSON.stringify({checked:'2026-09-23',references},null,2));
console.log(`Recorded ${points.length} coverage links and ${corrections.length} correction groups.`);
