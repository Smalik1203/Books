export const title='Earth, Moon, and the Sun';
export const shortTitle=title;
export const opener=[
 'A coconut tree casts a long morning shadow. By midday, the shadow is shorter. What has moved?',
 'Rashmika cycles through Kanniyakumari and notices how shadows change during the day. The Sun seems to cross the sky, yet the ground beneath her feels still. An everyday observation has opened a question about a moving planet.',
 'Use globes, light and careful observations to connect day and night, the changing night sky, seasons and eclipses. Ask what each model helps you explain—and where the model differs from Earth, the Moon and the Sun.'
];
const b=(id,text,source)=>({id,type:'body',text,source});
const h=(id,text,source,level=1)=>({id,type:'heading',text,source,level});
const d=(id,diagram,caption,source)=>({id,type:'diagram',diagram,caption,source});
const a=(id,sourceActivity,paragraphs,source)=>({id,type:'panel',kind:'setup',sourceActivity,paragraphs,source});
const t=(id,caption,rows,source,widths=[.24,.38,.38])=>({id,type:'table',comparisonTable:true,caption,rows,widths,note:'',source});
export const lesson=[
 h('rotation-head','12.1 Rotation of the Earth',[2]),
 b('relative-motion','When you travel in a bus, a nearby tree appears to move backwards. The tree need not be moving: your changing viewpoint produces its apparent motion. Could a changing viewpoint help explain what we see in the sky?',[2]),
 a('turning-task','12.1',[
  '1. Work in a clear, level space with a teacher. Choose a fixed tree, door or building as a landmark. Stand still and note its direction.',
  '2. Turn slowly anticlockwise, as seen from above your head. Stop after a small turn. In which direction did the landmark seem to move across your view?',
  '3. Repeat slowly in the other direction. Describe the relation between your turn and the landmark’s apparent motion. Stop if you feel dizzy.',
  '4. A teacher may demonstrate the same idea on a slowly turning playground platform, with everyone safely seated and holding on. Compare the observation with your standing model.'
 ],[2]),
 d('turning-picture','rotation','A fixed landmark can appear to move when the observer turns. The globe helps us change viewpoint in a controlled way.',[2,3]),
 b('turning-evidence','Your viewpoint changes as you turn. A fixed object appears to move across your view in the opposite direction. This model suggests an explanation for apparent motion; it does not, by itself, prove that Earth rotates.',[2,3]),
 b('rotation-definition','A spinning top, a fan and Earth all turn about an **axis**. This turning is **rotation**. Earth’s axis is an imaginary line through its North and South Poles. The equator divides Earth into the Northern and Southern Hemispheres.',[3]),
 b('rotation-direction','Earth rotates from west to east. Viewed from above the North Pole, this is anticlockwise. A place returns to approximately the same position relative to the Sun after about 24 hours: one day. Earth does not have a physical rod through its centre; a globe uses one to represent the axis.',[3,4]),
 a('globe-task','12.2',[
  '1. Find the poles, equator and India on a globe. Mark a chosen place with a small removable sticker. Turn the globe anticlockwise as seen from above its North Pole. Follow the sticker through one turn.',
  '2. In a dim room, a teacher holds a torch about 1.5 metres from the globe. Keep the beam away from eyes. Leave the torch fixed and note which part of the globe receives light.',
  '3. Turn the globe slowly in the same direction. Follow your sticker as it enters and leaves the illuminated region. Record the changes without moving the torch.',
  '4. Compare two places in India, one farther east. Which enters the light first? Sketch your setup and explain what each object represents.'
 ],[3,4]),
 d('daynight-picture','daynight','Sunlight reaches the Sun-facing half of Earth. Rotation carries a place into daylight and then into darkness. Sizes and distances are not to scale.',[4]),
 b('daynight-evidence','The lit side represents **day**; the side facing away from the Sun represents **night**. At sunrise, a place turns into sunlight. At sunset, it turns out of sunlight. The Sun need not travel around Earth once a day to produce this sequence.',[4,5]),
 b('daily-sky','This eastward rotation makes the Sun appear to move westwards across our sky. At comparable latitudes, places farther east generally reach sunrise earlier. Exact sunrise times also depend on the date and latitude. The Sun is usually higher around local noon, but it is not overhead everywhere or on every day.',[4,5]),
 h('stars-head','Watching the night sky',[5,6],2),
 b('stars-question','The Moon, planets and many stars also appear to move across the sky during a night. Some stars near the celestial pole circle it without rising or setting at a particular location. Can you compare a star pattern with a fixed landmark?', [5,6]),
 a('stars-task','12.3',[
  '1. With an adult, choose a safe place away from traffic. On a clear evening, use a sky chart to identify Saptarishi (the Big Dipper) and Dhruva Tara (the Pole Star), if visible from your location. March to May can be convenient in much of India.',
  '2. Record the date, time and viewing direction. Draw the stars and a fixed landmark such as a roof edge. Never climb onto an unprotected roof.',
  '3. Return to the same position about two hours later. Draw the pattern again relative to the landmark. A later observation is optional and needs adult supervision; a planetarium simulation can extend the record.',
  '4. Which positions changed? Which point appears nearly fixed? Compare observations before deciding what the pattern means.'
 ],[6]),
 d('pole-picture','pole','A view towards the northern sky: apparent star paths curve around a point close to the Pole Star. These schematic arcs do not show the exact positions of Saptarishi.',[6]),
 b('pole-evidence','The Pole Star lies nearly in the direction of Earth’s northern axis, so it appears almost stationary while other northern stars seem to circle it. Long-exposure photographs record these paths as star trails. A photograph combines positions observed over time; the stars are not luminous rings.',[6]),
 b('history-rotation','In the Aryabhatiya, written in 499 CE, Aryabhata compared the apparent westward motion of stars with the backward appearance of stationary objects from a moving boat. The comparison separates what an observer sees from what causes the view to change.',[7]),
 b('sidereal','Earth turns once relative to distant stars in about **23 hours 56 minutes**. A solar day is about 24 hours because Earth also moves along its orbit: it must turn a little farther to bring the Sun back to the same direction. A star therefore returns to a similar position about four minutes earlier on the next night.',[7]),
 b('foucault','A Foucault pendulum provides another line of evidence. Its swing direction gradually changes relative to the floor as Earth rotates beneath it. Léon Foucault demonstrated this in 1851. This is a different purpose from using a pendulum to measure time in Chapter 8; a large installation makes the slow change easier to observe.',[5]),
 h('orbit-head','12.2 Revolution of the Earth',[7,8]),
 b('orbit-definition','While rotating, Earth travels around the Sun. Motion around another body is called **revolution**, and the path is its **orbit**. Earth takes about 365 days and 6 hours to complete a revolution. The extra fraction of a day helps explain why calendars need leap years.',[7,8]),
 d('orbit-picture','orbit','An oblique view of Earth’s nearly circular orbit. The night side looks away from the Sun in different directions through the year. Sizes and distances are not to scale.',[8]),
 b('seasonal-stars','At the same clock time in different months, we see different parts of the surrounding star field. Some constellations that would be in our daytime sky are hidden by bright sunlight. Their stars have not disappeared. Compare the sky at the same time on dates about a month apart to look for this slow annual change.',[8]),
 b('sky-tradition','The source describes how Bhil and Pawara communities of the Tapi Valley used the appearance of star patterns as seasonal markers for the monsoon. A sky pattern can mark a time of year without causing the rain; local weather still needs its own observations.',[8]),
 t('motions-table','Two motions, two different questions',[
  ['Aspect','Rotation','Revolution'],
  ['What moves?','Earth turns about its own axis.','Earth travels around the Sun.'],
  ['Time scale','About 24 hours relative to the Sun.','About 365 days and 6 hours.'],
  ['What it explains','The daily cycle of day and night.','The yearly change in the night-sky view; with axial tilt, the seasonal cycle.']
 ],[7,8]),
 h('seasons-head','12.2.1 Why Do Seasons Change?',[9,10]),
 b('tilt','Earth’s axis is tilted by about **23.5°** from a line perpendicular to its orbital plane. During one year, the axis keeps nearly the same direction in space. It does not lean towards the Sun at every position on the orbit.',[9]),
 d('seasons-picture','seasons','At the June and December positions, the axes remain parallel. The hemisphere tilted towards the Sun changes as Earth moves to the other side of its orbit.',[9,10]),
 b('june','In June, the Northern Hemisphere is tilted towards the Sun. Across much of this hemisphere, sunlight arrives at a higher angle and daylight lasts longer. A given amount of incoming light is spread over a smaller surface area when it arrives more directly. More concentrated light and longer days increase the energy received.',[9,10]),
 b('december','In December, the Northern Hemisphere is tilted away. Sunlight arrives more obliquely and daylight is shorter. Less energy is received per unit area over the day. These changes produce the broad summer–winter cycle, although land, oceans and air take time to warm or cool.',[9,10]),
 d('angle-picture','sun-angle','Equal incoming beams can cover different areas. Oblique light spreads the same incoming energy over a larger area.',[10]),
 t('hemispheres-table','Seasons are opposite across the equator',[
  ['Position','Northern Hemisphere','Southern Hemisphere'],
  ['Around June','Tilted towards the Sun; summer.','Tilted away from the Sun; winter.'],
  ['Around December','Tilted away from the Sun; winter.','Tilted towards the Sun; summer.'],
  ['At an equinox','Day and night are approximately equal.','Day and night are approximately equal.']
 ],[9,10,11]),
 b('distance-misconception','Earth is closest to the Sun in early January, when it is winter in the Northern Hemisphere and summer in the Southern Hemisphere. A changing Earth–Sun distance cannot explain those opposite seasons. Nor is a hemisphere’s tiny change in distance due to tilt the explanation. The important effects of tilt are sunlight angle and duration.',[10]),
 h('calendar-head','Solstices, equinoxes and local seasons',[11],2),
 b('calendar','Around 21 June, the Northern Hemisphere has its **summer solstice**, with its longest daylight of the year. Around 21–22 December comes its **winter solstice**, with the shortest daylight. The Southern Hemisphere has the opposite solstices. These calendar dates can vary slightly from year to year.',[11]),
 b('equinox','At the **equinoxes**, around 20–21 March and 22–23 September, neither hemisphere is tilted towards the Sun. Day and night are approximately equal. “Approximately” matters: the Sun has a visible disc, and the atmosphere bends some sunlight.',[11]),
 d('polar-picture','polar','Near a solstice, the pole tilted towards the Sun stays in light throughout a rotation; the opposite pole stays in darkness.',[10,11]),
 b('polar-days','At the poles, daylight can last roughly six months, followed by roughly six months of darkness. Across the wider polar regions, the duration varies with latitude. Near the equator, day length stays close to 12 hours throughout the year. This does not mean there are no seasonal changes there.',[11]),
 b('local-seasons','A place’s seasons are also shaped by monsoon winds, ocean currents, altitude and distance from the sea. India’s rainy season cannot be described simply as “more daylight”. Connect the large astronomical pattern with the local pattern you actually observe.',[11]),
 {id:'seasons-think',type:'panel',kind:'think',source:[10,11],paragraphs:['Two friends claim that summer occurs because Earth is nearer the Sun. One lives in India and the other in Australia. How do their opposite seasons help you test the claim? Use both the direction of Earth’s axis and the changing distribution of sunlight in your explanation.']},
 h('eclipse-head','12.3 Eclipses: Light and Alignment',[11,12]),
 b('alignment-intro','The Moon travels around Earth while Earth travels around the Sun. From our viewpoint, one body can sometimes pass in front of another. Before explaining an eclipse, separate an object’s real size from how large it looks.',[11,12]),
 a('thumb-task','12.4',[
  '1. Indoors or with your back to the Sun, stand about five metres from a friend. Close one eye and hold your thumb at arm’s length.',
  '2. Align your thumb with your friend’s head. Move the thumb gently towards or away from your eye. At what position can it hide the head?',
  '3. Compare the thumb’s actual size with the head’s actual size. Record what changed when you moved your thumb. Never use the Sun as the object to hide.'
 ],[12]),
 d('size-picture','apparent-size','A nearer small object and a farther large object can occupy similar angles in a view. This is a comparison of apparent size, not actual diameter.',[12]),
 b('apparent-evidence','The thumb is smaller than the head, but it is much closer to your eye. **Apparent size** depends on both size and distance. The Sun is about 400 times wider than the Moon and about 400 times farther away, so their apparent sizes are similar. The distances vary, so the match is not exact at every eclipse.',[12]),
 b('transits','Mercury and Venus can pass across the Sun’s disc as viewed from Earth. Their apparent discs are much smaller than the Sun’s, so such a **transit** does not hide the whole Sun. These are specialist observations made with safe solar equipment, not naked-eye viewing tasks.',[11,12]),
 h('solar-head','12.3.1 Solar Eclipses',[12,13]),
 b('solar-definition','A **solar eclipse** occurs when the Moon comes between the Sun and Earth and its shadow falls on part of Earth. In the central, darkest shadow—the **umbra**—the Sun can be completely hidden. This is a total solar eclipse. In the surrounding **penumbra**, only part of the Sun is hidden: a partial solar eclipse.',[12,13]),
 d('solar-picture','solar','Solar eclipse: Sun → Moon → Earth. The narrow central shadow reaches only a small region of Earth. The model exaggerates sizes and is not to scale.',[12,13]),
 b('solar-path','As Earth rotates and the Moon moves, the shadow sweeps a path over Earth. Totality lasts only a few minutes at a particular place, and daylight may briefly become dim there. The whole Earth does not become dark. If the Moon looks too small to cover the Sun completely, a bright ring remains: an annular eclipse.',[13]),
 b('monthly','A solar eclipse requires a new Moon, but there is no solar eclipse at every new Moon. The Moon’s orbit is tilted relative to Earth’s orbital plane, so the Moon usually passes above or below the required alignment. An eclipse needs the Moon to be close to the line where those planes cross.',[11,13]),
 {id:'solar-safety',type:'panel',kind:'think',source:[13,14],paragraphs:['An eclipse is predictable, but looking at the Sun can damage the eyes. Ordinary sunglasses, smoked glass and exposed film are not safe solar filters. Do not look through binoculars, a camera or a telescope while wearing eclipse glasses: these instruments concentrate sunlight.','For school observation, use a teacher-supervised projection onto a screen and look only at the screen. Direct viewing needs an undamaged, correctly used solar viewer meeting ISO 12312-2, obtained from a trusted supplier and checked by a knowledgeable adult. Keep that protection in place throughout the school observation.']},
 d('projection-picture','projection','An indirect pinhole projection: turn your back to the Sun and view its image on a screen. Never look through the hole towards the Sun.',[13,14]),
 b('mirror-projection','The source also describes a teacher-operated mirror projector: a small mirror fixed securely in a weighted support directs sunlight onto a shaded wall. Only the teacher positions it, keeps the beam away from people and supervises the screen. A pinhole projector is a simpler classroom alternative. Neither method requires looking at the Sun.',[14]),
 b('eclipse-myths','There is no scientific evidence that an eclipse makes cooking, eating or ordinary outdoor activity harmful. The specific hazard is looking at the Sun without proper protection. A planetarium or astronomy club can organise safe observations and explain why careful prediction is possible.',[14]),
 b('eclipse-history','Indian astronomical works such as the Surya Siddhanta developed methods for calculating eclipses. Predictions can be compared with observed times and places. Such a comparison tests a model against an event; it is different from attaching a harmful omen to an eclipse.',[14]),
 h('lunar-head','12.3.2 Lunar Eclipses',[14,15]),
 b('lunar-definition','A **lunar eclipse** occurs when Earth is between the Sun and the Moon and the Moon passes into Earth’s shadow. When all of the Moon enters the umbra, the eclipse is total; when only part enters it, the eclipse is partial. A lunar eclipse requires a full Moon and suitable alignment.',[14,15]),
 d('lunar-picture','lunar','Lunar eclipse: Sun → Earth → Moon. Earth’s shadow extends beyond Earth; the Moon passes through it. Sizes and distances are not to scale.',[14,15]),
 b('red-moon','During a total lunar eclipse the Moon may appear reddish. Some sunlight passes through Earth’s atmosphere, where shorter wavelengths are scattered more strongly. Redder light bends into the shadow and reaches the Moon. The exact colour depends partly on conditions in the atmosphere.',[15]),
 b('lunar-view','A lunar eclipse can be seen from much of Earth’s night side, wherever the Moon is above the horizon and the sky is clear. It is safe to observe with unaided eyes. Unlike a solar eclipse, it does not require the observer to stand in a narrow track of the Moon’s shadow.',[15]),
 t('eclipses-table','Comparing the two eclipses',[
  ['Aspect','Solar eclipse','Lunar eclipse'],
  ['Order','Sun → Moon → Earth','Sun → Earth → Moon'],
  ['Shadow falls on','Part of Earth','The Moon'],
  ['Moon phase','New Moon','Full Moon'],
  ['Where visible','A limited part of Earth’s day side','Much of the night side where the Moon is visible'],
  ['Eye safety','Requires safe solar viewing or indirect projection','Safe to watch with unaided eyes']
 ],[13,14,15]),
 h('astronomy-head','Observing, recording, predicting',[15,16],2),
 b('astronomy-india','Kodaikanal Solar Observatory, established in 1899 in the Palani hills, has a long record of observations of the Sun. M. K. Vainu Bappu helped develop modern observational astronomy in India, including facilities at Nainital and Kavalur. Instruments, careful records and trained observers make small or slow changes measurable.',[15,16]),
 b('prediction','Use a planetarium programme such as Stellarium to explore a predicted eclipse for a selected place and date. Compare the simulation with a reliable observatory’s information. Whether an eclipse is visible depends on your location, the time and whether the relevant body is above the horizon; a worldwide event list alone is not enough.',[15]),
 d('system-picture','system','Three bodies, several linked ideas: rotation, revolution, illumination and shadows. Use each model to answer a particular question.',[16]),
 b('closing-evidence','Return to Rashmika’s changing shadows. Daily rotation changes the direction of sunlight at a place. Revolution and axial tilt produce a yearly pattern of sunlight. Particular alignments produce eclipses. The same bodies help explain several patterns—but each explanation needs its own evidence.',[1,16])
];
export const glossary=[
 ['Axis','An imaginary line about which an object rotates.'],['Rotation','Turning about an axis.'],['Revolution','Motion around another body.'],['Orbit','The path followed during revolution.'],['Hemisphere','Half of a sphere; Earth’s equator separates its northern and southern halves.'],['Axial tilt','The angle between the rotation axis and a line perpendicular to the orbital plane.'],['Solstice','Either yearly extreme of daylight duration caused by axial tilt.'],
 ['Equinox','A time when neither hemisphere tilts towards the Sun and day and night are approximately equal.'],['Apparent motion','A change in observed position that can result from the observer’s motion.'],['Apparent size','How large an object looks from a given viewpoint.'],['Solar eclipse','The Sun is hidden partly or wholly by the Moon from some places on Earth.'],['Lunar eclipse','The Moon passes through Earth’s shadow.'],['Umbra','The region where the light source is completely blocked.'],['Penumbra','The region where the light source is partly blocked.']
];
export const summary=[
 'Earth rotates eastwards. The Sun-facing side has day; the side facing away has night. A solar day lasts about 24 hours.',
 'A changing viewpoint makes the Sun and many other celestial bodies appear to cross the sky. The Pole Star lies close to the direction of Earth’s northern axis.',
 'Earth revolves around the Sun in about 365 days and 6 hours. The night side faces different star fields as the year progresses.',
 'Earth’s tilted axis keeps nearly the same direction through the year. Changes in sunlight angle and daylight duration produce opposite seasons in the two hemispheres.',
 'Solstices mark extremes of daylight duration; at equinoxes day and night are approximately equal. Local weather has additional influences.',
 'Apparent size depends on actual size and distance. Suitable Sun–Moon–Earth alignment produces a solar eclipse; Sun–Earth–Moon alignment produces a lunar eclipse.',
 'Observe solar eclipses only through safe, supervised methods. Lunar eclipses are safe to watch with unaided eyes. Use models and records to test explanations.'
];
export const exercises=[
 {id:'q1',text:'The diagram shows sunlight arriving from the left and Earth’s North Pole tilted towards it. (a) Which hemisphere has summer? (b) Explain using the angle of sunlight and duration of daylight, not distance from the Sun.',diagram:'tilt-question',caption:'Use the shown direction of incoming light.',source:[16]},
 {id:'q2',text:'Complete the statements. (a) Stars that rise and set generally appear to rise in the ___ and set in the ___. (b) Day and night are caused by Earth’s ___. (c) When the Moon completely hides the Sun at an observer’s location, that observer sees a ___ solar eclipse.',source:[16]},
 {id:'q3',text:'Decide whether each statement is true or false. Correct every false statement: (a) In a lunar eclipse, the Sun is between Earth and the Moon. (b) Gujarat, west of Jharkhand, generally sees sunrise earlier. (c) Chennai has its longest daylight around the June solstice. (d) An eclipse makes it safe to look at the Sun without protection. (e) Axial tilt changes how sunlight is distributed over spherical Earth as it revolves. (f) Earth’s revolution causes the daily alternation of day and night.',source:[17]},
 {id:'q4',text:'Orion was in a particular position at 8 p.m. yesterday. About what time will it return to nearly the same position tonight? Explain why the answer differs slightly from 8 p.m.',source:[17]},
 {id:'q5',text:'A student records a star pattern at midnight on 21 June. Around which date next year should the same pattern return to a similar position at midnight? Distinguish this yearly change from the stars’ apparent motion during one night.',source:[17]},
 {id:'q6',text:'It is daytime in India when you call an uncle in a part of the United States where it is night. Explain this using a rotating globe. Why is “all of the United States always has night when India has day” too broad a statement?',diagram:'daynight',caption:'Use different places on the globe to explain the call.',source:[17]},
 {id:'q7',text:'Which proposed solar-eclipse observations are acceptable, and under what conditions? (a) Proper solar viewers checked by a knowledgeable adult. (b) A teacher’s mirror projection onto a wall. (c) Direct naked-eye viewing. (d) An organised planetarium event. Explain why the name of a device or event alone is not enough to guarantee safety.',source:[17]},
 {id:'q8',text:'Draw and label two arrangements: (a) a solar eclipse and (b) a lunar eclipse. Mark the direction of sunlight and the body whose shadow is involved. Explain why your drawing is not to scale and why an eclipse does not happen every month.',diagram:'system',caption:'Use the Sun, Earth and Moon to build both arrangements; decide their order yourself.',source:[17]},
 {id:'q9',text:'The Sun is vastly larger than the Moon, yet the Moon can hide it during a total solar eclipse. Explain using actual size, distance and apparent size. Relate your explanation to the thumb investigation.',source:[18]},
 {id:'q10',text:'You are travelling from India to Australia in December. Which broad seasonal difference should guide your packing? What local information would you still check before choosing clothes?',source:[18]},
 {id:'q11',text:'Why can a total lunar eclipse be seen from a much larger region of Earth than a total solar eclipse? State where an observer needs to be in each case.',source:[18]},
 {id:'q12',text:'Imagine that Earth’s axis were perpendicular to its orbital plane, with no axial tilt. Which familiar seasonal effects would be greatly reduced? Would day and night stop? Explain why this change would not remove every possible variation in weather.',source:[18]}
];
export const projects=[
 {id:'project1',title:'Follow one tilted axis around an orbit',text:'With a teacher, place a cool lamp at the centre of a clear table and move a globe around four positions. Keep the axis pointing in the same room direction at every position. Rotate the globe at each position and compare how long a marked place in each hemisphere spends in the light. Draw the four positions and explain both daily and seasonal patterns. Record limits of the model: the lamp is nearby, the orbit is small, and the sizes are not to scale.',figure:'opener',caption:'Keep the lamp fixed and the globe’s axis parallel to its earlier direction.',source:[18]},
 {id:'project2',title:'How different are the two distances?',text:'Using the scale 1 cm for 10 million km, draw two concentric circles with radii 14.7 cm and 15.2 cm on a large sheet. They represent about 147 million and 152 million km, Earth’s nearest and farthest distances from the Sun. Compare the small difference with the radii. These circles mark distance limits, not two Earth orbits. Explain why opposite seasons in the two hemispheres are better evidence for axial tilt than for the distance explanation.',figure:'earth',caption:'Earth follows one slightly elliptical, nearly circular orbit.',source:[18]},
 {id:'project3',title:'Imagine a much more tilted planet',text:'Research Uranus, whose axial tilt is about 98°. Compare this with Earth’s tilt of about 23.5°. Use a ball model to reason about daylight near the poles over an orbit, then write a short illustrated newspaper article about extreme seasons. Distinguish facts from your predictions and name your sources. Do not assume that Earth’s air, oceans or yearly time scale also apply to Uranus.',figure:'earth',caption:'Changing the axis changes the pattern of illumination; the model has limits.',source:[18]},
 {id:'project4',title:'Keep the questions going',text:'The Sun also moves slightly as planets orbit: the bodies move about their common centre of mass. Astronomers can detect a star’s small motion as one clue to unseen planets. Find five connections among this chapter’s pictures and earlier science ideas—light, heat, motion, measurement or living things. Write one new question for each connection, and decide which could be investigated safely nearby and which needs astronomical observations.',figure:'sun',caption:'A model can open a further question as well as explain an observation.',source:[18,19]}
];
