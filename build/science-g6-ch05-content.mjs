export const title='Measurement of Length and Motion';
export const shortTitle=title;
export const opener=[
 'A shopkeeper measures cloth with a rod. A tailor uses a flexible tape. Why do they choose different tools?',
 'Deepa, an eleven-year-old from Haryana, needs a new school uniform because she has grown taller. Her mother asks for two metres of cloth, then asks the tailor to leave an extra char angula—four fingers’ width—in the length.',
 'Deepa takes these questions to her friends. What makes a measurement reliable? How can we describe a place, or decide whether something is moving? Begin with familiar objects, then use a common unit and a clear reference point to compare observations.'
];
const b=(id,text,source)=>({id,type:'body',text,source});
const h=(id,text,source,level=1)=>({id,type:'heading',text,source,level});
const d=(id,diagram,caption,source)=>({id,type:'diagram',diagram,caption,source});
const f=(id,figure,caption,source)=>({id,type:'figure',figure,caption,source});
const a=(id,sourceActivity,paragraphs,source,extra={})=>({id,type:'panel',kind:'setup',sourceActivity,paragraphs,source,...extra});
const t=(id,caption,rows,widths,source,note='')=>({id,type:'table',comparisonTable:true,caption,rows,widths,source,note});
export const lesson=[
 h('measure-head','5.1 How Do We Measure?',[2]),
 b('body-units','People sometimes estimate a length using a handspan, a foot, an arm or a stride. Deepa’s mother calls a handspan balisht. Such methods are convenient when no scale is available, but will two people always obtain the same number?',[2]),
 b('handspan-task','Choose one edge of a classroom table. Without stretching your fingers uncomfortably, use the distance from your thumb tip to your little-finger tip as one handspan. Move it along the edge, keeping each new starting point at the previous endpoint. Do not leave gaps or overlap. Record the number of handspans, including any part-span left over. Ask two friends to measure the same edge independently.',[2,3]),
 d('handspan-picture','handspan','A unit must be repeated along the same length, without gaps or overlaps. Compare the handspans before comparing the counts.',[2,3]),
 t('sample-handspans','One table, five reported measurements',[
  ['Student','Length in that student’s handspans'],['Anish','Slightly more than 13'],['Padma','13'],['Tasneem','Slightly less than 13'],['Deepa','Between 13 and 14'],['Hardeep','14']
 ],[.26,.74],[3],'These are the group’s results. Measure your own table and record what you observe.'),
 b('handspan-evidence','The table has not changed length. Different-sized handspans can give different counts: a smaller handspan usually fits more times along the same edge. Inconsistent placement can add another difference. Compare both the size of the chosen unit and how it was placed.',[3]),
 b('unit-definition','To **measure a length**, we compare it with an agreed length called a **unit**. A measurement needs a number and a unit. In “13 handspans”, 13 is the number and handspan is the unit. A number alone does not tell another person how long the table is.',[3]),
 b('history','Angula (finger width), dhanusa and yojana occur in historical Indian measurement traditions. Traditional craftspeople still use some body-based measures. Objects with ruled markings have been excavated at Harappan sites. A named historical unit did not necessarily have exactly the same value in every period or region.',[4]),
 h('standard-head','5.2 Standard Units',[4,5]),
 b('standard-definition','A **standard unit** is defined so that different people can use the same length for comparison. Countries use the **International System of Units**, abbreviated **SI**. The SI base unit of length is the **metre**, whose symbol is **m**. A standard unit makes results comparable; careful use of the measuring tool still matters.',[4]),
 d('ruler-picture','ruler','A 15 cm ruler: numbered centimetres, with ten equal millimetre intervals in each centimetre. Illustrations are enlarged or reduced; do not use this printed picture as a calibrated ruler.',[4,5]),
 b('divisions','One metre contains 100 centimetres. On a common school ruler, each centimetre is divided into ten equal intervals of one millimetre. A millimetre is therefore one-tenth of a centimetre. Count the spaces between marks, not just the marks themselves.',[4,5]),
 t('units-table','Choose a convenient unit',[
  ['Unit','Symbol','Relationship','A useful scale of length'],
  ['kilometre','km','1 km = 1000 m','Distance between towns'],
  ['metre','m','1 m = 100 cm','Length of a room'],
  ['centimetre','cm','1 cm = 10 mm','Length of an eraser'],
  ['millimetre','mm','1 mm = 0.1 cm','Thickness of a coin']
 ],[.2,.13,.28,.39],[5],'The choice of unit changes the number you write, not the actual length.'),
 b('least-division','The smallest marked interval on the illustrated ruler is 1 mm. That tells you the ruler’s graduation, not a guarantee that every measurement is exact to 1 mm. A fuzzy endpoint, a bent ruler or a slanting view can make the reading uncertain. Very thin paper may need a different method.',[5,6]),
 b('other-units','Some rulers also have an inch scale. One inch equals exactly 2.54 cm. Inches and feet remain in use in some settings, but do not mix readings from the two sides of a ruler. Check the unit before comparing two numbers.',[5]),
 b('unit-writing','Write the symbols **km, m, cm and mm** in lowercase, with a space between the number and symbol: for example, 12 cm. Do not add s to a symbol for the plural, and do not add a full stop unless it ends the sentence. Unit names normally begin with a lowercase letter, except at the start of a sentence.',[8]),
 {id:'units-think',type:'panel',kind:'think',source:[5,6],paragraphs:['Two pupils report the same length as 125 cm and 1.25 m. Have they disagreed? Explain what must be checked before comparing the numbers. Then explain why kilometres are a convenient choice for the distance between cities, although that distance can also be written in metres.']},
 h('method-head','5.3 Measuring Length Correctly',[6]),
 b('tool-choice','Choose a tool that can follow the length you need. A short rigid ruler suits a pencil. A longer tape suits a room or a sports ground. A flexible tape can follow a curved surface, such as the girth of a tree; a rigid metre rod cannot wrap around it.',[6]),
 f('tape-picture','tape','A flexible tape follows a curved surface. Keep it in contact without stretching it or pulling it tight enough to compress the object.',[6]),
 b('alignment','Place the ruler alongside the object, in contact with it, with the scale parallel to the length being measured. Align the object’s first endpoint with the **zero mark**, not automatically with the physical edge of the ruler. A margin may lie before zero.',[6]),
 d('alignment-picture','alignment','Align the pencil’s endpoints with the scale. A slanting ruler measures along a different direction and gives a poor reading of the pencil’s length.',[6]),
 b('eye-position','Read the second endpoint with your eye directly above it. A sideways view can make the endpoint seem to line up with the wrong mark, especially if there is a gap between the object and scale. This apparent shift is called **parallax**.',[6,7]),
 d('eye-picture','eye','B is directly above the endpoint. A and C look obliquely. The sight lines explain why viewing position matters.',[7]),
 h('broken-head','When zero cannot be used',[7],2),
 b('broken-rule','A ruler with a worn zero or a damaged end may still be useful if the remaining graduations are clear and the ruler is straight. Start at another clear mark. Read both endpoints, then subtract the starting reading from the ending reading. Do not use a broken ruler with a sharp exposed edge.',[7]),
 d('broken-picture','broken','The endpoints are at 1.0 cm and 10.4 cm. The length is 10.4 cm − 1.0 cm = 9.4 cm; the final reading alone is not the length.',[7]),
 b('accessible','Raised markings and tactile labels on accessible rulers let a learner identify divisions by touch. A partner can help position the object while the learner makes the reading. The same principles—clear endpoints, a known unit and consistent placement—still apply.',[7]),
 a('measure-task','5.1',[
  '1. Choose a comb, pen, pencil and eraser. Check that your ruler is long enough for each object and identify its smallest marked division.',
  '2. Measure each object along the length you chose. Keep the ruler straight, align an endpoint with a clear mark and read directly from above.',
  '3. In your notebook, record the object, starting reading, ending reading, calculated length and unit. If you start at zero, still note that starting reading.',
  '4. Ask a partner to measure the same objects independently. Compare results and investigate any differences in placement, endpoints or reading direction. Repeat a doubtful reading.'
 ],[8]),
 b('measurement-evidence','Close agreement supports the consistency of your method, but identical readings do not prove that a damaged tool is correct. If results differ, check the setup before averaging numbers or deciding that one person is wrong. State a sensible precision for the marks you can read.',[8]),
 h('curve-head','5.4 Measuring a Curved Line',[9]),
 b('curve-story','Anish’s family wants to decorate an arch with a string of lights. A straight line between its ends is shorter than the path along the arch. The required length follows the curve. For classroom work, model the arch on paper; leave real electrical fitting and work at height to adults.',[9]),
 b('curve-method','Lay a non-stretchy thread carefully along a drawn curve, beginning at one end. Mark the thread at the other endpoint. Straighten the marked section alongside a ruler without stretching it, and read its length. Repeat the placement to check whether it followed the entire curve. A suitable flexible tape can measure the same path directly.',[9]),
 d('curve-picture','curve','First follow the curve, then measure the marked thread straight. The straight endpoint-to-endpoint distance is a different measurement.',[9]),
 h('position-head','5.5 Describing Position',[9,10,11]),
 b('position-story','The class plans a visit to a garden. Deepa and Anish think the school is nearer their homes; Tasneem and Padma think the garden is nearer. Hardeep thinks the two are equally far away. Could all of them be right? They are starting from different homes.',[9,10]),
 d('road-picture','road','A model road with positions in kilometres from the bus stand. The numbers illustrate comparisons rather than actual surveyed distances.',[9,10]),
 b('reference','A **reference point** is a chosen point used to describe a position or a change in position. Using the same reference point makes statements easier to compare. On this road, the school is at 3 km and the garden at 5 km from the bus stand, whichever pupil describes them.',[10]),
 b('direction','Distance alone may not locate a place: two places can be equally far from the same point in different directions. Give a direction, a route or another detail when it is needed. “Two metres to the right of the door” is clearer than “two metres from the door”.',[10,11]),
 b('court','When marking a kabaddi court, choose a fixed starting corner, measure from it and establish the required directions. Use the same starting point and keep the measuring tape straight. A teacher can guide the marking with safe chalk; avoid raising clouds of loose powder.',[10]),
 d('court-picture','court','A fixed corner and two perpendicular directions organise a rectangular layout. Use the dimensions your teacher gives; this sketch is not an official court plan.',[10]),
 b('milestones','On a journey towards Delhi, Padma sees signs reading “Delhi 70 km” and later “Delhi 60 km”. Along the same signed route, the indicated distance to the destination has decreased by 10 km. The distance refers to the route and its chosen endpoint in Delhi—not necessarily to her grandparents’ front door.',[11]),
 f('bus-picture','bus','A seated passenger can describe the journey using roadside landmarks or objects inside the bus. The choice of reference matters.',[11,13]),
 h('moving-head','5.6 Moving Things',[12,13]),
 a('rest-task','5.2',[
  '1. Observe your surroundings safely from one place. Choose five objects that seem to move and five that seem to remain still.',
  '2. For each object, name a reference point and observe it at two or more times. Do not rely only on whether it appears lively or makes a sound.',
  '3. Make a notebook table with the headings Object, Reference point, Observation over time and Conclusion with reason. A tree trunk and a grazing cow can begin your list, but record what you actually observe.',
  '4. Compare explanations. Did two people use different reference points, or look at different parts of the same object?'
 ],[12]),
 b('motion-definition','An object is in **motion** if its position changes with time relative to the chosen reference point. It is **at rest** if its position does not change relative to that point during the observation. Name both the reference and the time interval; “moving” is incomplete without that context.',[12,13]),
 t('bus-table','One passenger, two reference points',[
  ['Reference','Observation','Description'],
  ['The passenger’s seat','The seated passenger remains beside the same parts of the seat.','At rest relative to the seat.'],
  ['A roadside building','The passenger’s position relative to the building changes as the bus travels.','In motion relative to the building.']
 ],[.24,.47,.29],[13]),
 b('parts','A tree trunk may remain in the same place relative to the ground while its leaves move in the wind. A grazing cow may move its head without walking. Say which object or part you are following, rather than assigning one description carelessly to everything in the scene.',[12,13]),
 h('types-head','5.7 Types of Motion',[13,14]),
 a('linear-task','5.3',[
  '1. Hold a small eraser a short distance above a clear tabletop or a tray. Keep feet and other people clear of the drop.',
  '2. Release it without throwing it sideways. Watch the path before it strikes the surface.',
  '3. Repeat and sketch the path you observed. Which reference point did you use? Compare it with the path of a toy car pushed along a straight guide.'
 ],[13]),
 b('linear-evidence','Motion along a straight path is called **linear motion**. A gently released eraser has an approximately straight downward path over this short distance. Marchers on a straight stretch of a parade route and a box pushed straight across a floor are further examples. The path, not the object’s name, decides the classification.',[13,14]),
 a('circle-task','5.4',[
  '1. A teacher ties a small soft foam ball securely to a short thread and checks the knot. Keep a wide clear space around the demonstration.',
  '2. The teacher moves the ball slowly around a circle, below shoulder height. Learners watch from outside the reach of the thread; nobody lets go.',
  '3. Sketch the path and compare it with the path of one seat on a turning merry-go-round. Explain what is similar and what is different.'
 ],[14,15]),
 b('circle-evidence','An object following a circular path has **circular motion**. A seat on a merry-go-round travels around its centre. A point on a rotating fan blade also follows a circle. Always identify the point or part being observed: the centre and the blade tip do not follow the same path.',[14,15]),
 d('paths-picture','paths','A straight path and a circular path describe different changes of position. The arrows show direction, not how fast the object moves.',[14]),
 a('swing-task','5.5',[
  '1. Tie a small eraser securely to a thread. Hold the other end still, or have a teacher secure it to a firm support. Leave clear space below and around it.',
  '2. Move the eraser a small distance to one side and release it without pushing. Watch until the motion becomes small.',
  '3. Sketch its positions on either side of the central resting position. Compare its path with a swing, and note whether it travels all the way around a circle.'
 ],[15]),
 f('pendulum-picture','pendulum','A firmly supported pendulum is another way to observe to-and-fro motion. A small suspended eraser can serve the same classroom purpose.',[15]),
 b('oscillation','Movement to and fro about a central position is called **oscillatory motion**. The suspended eraser and a playground swing are examples. The path can be curved: an oscillation need not be a straight line. Releasing gently makes the observation easier to compare.',[15]),
 a('strip-task','5.6',[
  '1. Ask a teacher to secure one end of a flexible ruler or a smooth-edged springy strip on a table, leaving part of it projecting beyond the edge. A strip about 50 cm long can be used; an adult must check any metal edges first.',
  '2. Use a clamp or a stable book stack to hold it firmly. Keep faces away from the free end. Press that end down only slightly, then let go.',
  '3. Observe the free end. Compare its movement with the part held on the table. Stop if the support loosens; do not bend the strip sharply.'
 ],[16],{figure:'strip',figureCaption:'The fixed portion is held securely; the free end has room to move.'}),
 b('strip-evidence','The free end moves up and down around its resting position. This is also oscillatory motion, even though it looks different from a hanging swing. Its movement gradually becomes smaller as energy is transferred to the surroundings.',[16]),
 t('motion-table','Compare the path, not just the object',[
  ['Type','What to look for','Example'],
  ['Linear','A straight path','An eraser falling straight down before impact'],
  ['Circular','A path around a centre at a fixed radius','One seat on a turning merry-go-round'],
  ['Oscillatory','To-and-fro motion about a central position','The free end of a vibrating strip']
 ],[.22,.43,.35],[14,15,16]),
 b('periodic','Motion is **periodic** when the motion repeats after equal time intervals. A steadily turning wheel or a regularly swinging pendulum can be approximately periodic. Circular or to-and-fro motion is not automatically periodic: stopping, changing speed irregularly or changing the pattern can destroy the equal-time repetition.',[16]),
 {id:'periodic-think',type:'panel',kind:'think',source:[16],paragraphs:['A merry-go-round completes one turn, stops for a while, then turns faster. Its seat still follows a circle when it moves. Is that enough to call the whole motion periodic? State what else you would need to observe or measure.']},
 a('park-task','5.7',[
  '1. Observe the playground illustration, or visit a park with an adult. Keep clear of moving equipment and use it only as intended.',
  '2. Identify an object or a particular part and describe its path over a chosen interval. Look for straight, circular and to-and-fro motion.',
  '3. Record Object or part, Reference point, Observed path, Category and Reason in your notebook. If the motion changes or combines types, describe the separate parts instead of forcing one label.',
  '4. Discuss how a still picture limits your evidence. Which details would you need to watch over time?'
 ],[16,17]),
 f('park-picture','park','Watch a particular seat, child or point over time. A still illustration suggests questions; actual motion needs observations at different times.',[17]),
 b('connect','Measurement and motion share an important habit: state exactly what you compare. A length needs a unit and clear endpoints. A description of motion needs an object, a reference point and a time interval. Clear comparisons let other people check your result.',[18])
];
export const glossary=[
 ['Length','The extent of an object or path between chosen endpoints.'],['Measurement','A comparison of a quantity with a chosen unit.'],['Unit','An agreed amount used for comparison.'],['Standard unit','A unit defined consistently for different users.'],['Metre (m)','The SI base unit of length.'],['Centimetre (cm)','One-hundredth of a metre.'],['Millimetre (mm)','One-thousandth of a metre; one-tenth of a centimetre.'],
 ['Kilometre (km)','A length of 1000 metres.'],['Reference point','A chosen point used to describe a position or its change.'],['Motion','Change of position with time relative to a reference.'],['Linear motion','Motion along a straight path.'],['Circular motion','Motion along a circular path.'],['Oscillatory motion','To-and-fro motion about a central position.'],['Periodic motion','Motion that repeats after equal time intervals.']
];
export const summary=[
 'A length measurement needs a number and a unit. Body-based units can differ between people; standard units make results comparable.',
 'The SI base unit of length is the metre (m). The conversions are 1 km = 1000 m, 1 m = 100 cm and 1 cm = 10 mm.',
 'Choose a suitable measuring tool. Align clear endpoints, keep the ruler parallel to the length and read directly from above.',
 'When measurement starts at a non-zero mark, subtract the starting reading from the ending reading.',
 'Measure a curved path with a flexible tape or mark a non-stretchy thread along it and then measure the thread straight.',
 'A reference point helps describe position. An object is moving or at rest relative to the chosen reference during an observation.',
 'Straight, circular and to-and-fro paths are described as linear, circular and oscillatory motion. Periodic motion also requires repetition at equal time intervals.'
];
export const exercises=[
 {id:'q1',text:'Match each length with a convenient unit from the second column. Each unit is to be used once.',table:{id:'match-units',caption:'Lengths and possible units',rows:[['Length','Unit choices'],['Delhi–Lucknow distance','centimetre'],['Thickness of a coin','kilometre'],['Length of an eraser','metre'],['Length of a school ground','millimetre']],widths:[.7,.3],note:'The rows are not matched. Write the correct pairs in your notebook.'},source:[19]},
 {id:'q2',text:'State whether each statement is true or false and correct the false ones. (a) A car travelling along a straight road has linear motion over that stretch. (b) An object changing position with time relative to a reference point is in motion. (c) 1 km = 100 cm.',source:[19]},
 {id:'q3',text:'Which is not a standard unit of length: millimetre, centimetre, kilometre or handspan? Explain your choice.',source:[19]},
 {id:'q4',text:'Find different rulers or measuring tapes at home or school. Identify the smallest marked interval on each. Make a table of Tool, Unit shown and Smallest marked interval. Why does this interval not guarantee that every reading is perfectly accurate?',figure:'tape',caption:'Inspect the scale on your own tool; the illustration shows the material and form only.',source:[19]},
 {id:'q5',text:'The distance between a school and a home is 1.5 km. Express it in metres and show your conversion.',source:[19]},
 {id:'q6',text:'Choose an unbroken tumbler or bottle. Measure the distance around its circular base with a flexible tape or thread. Record the method, result and unit. Explain why a straight measurement across the base is different.',diagram:'circumference',caption:'Decide which path your thread must follow.',source:[20]},
 {id:'q7',text:'With permission and an adult’s help, measure a friend’s height safely against a wall. Express the same height in metres, centimetres and millimetres. Do not rank or compare classmates’ bodies.',source:[20]},
 {id:'q8',text:'Estimate how many identical coins placed edge to edge, without gaps, would cover one chosen side of a notebook. Check by measuring that side and one coin’s diameter with a 15 cm ruler. Explain how you would handle a remaining fraction of a coin’s width.',source:[20]},
 {id:'q9',text:'Give two examples each of linear, circular and oscillatory motion. For every example, identify the part moving and the reference point.',source:[20]},
 {id:'q10',text:'List three objects whose sizes are conveniently written in millimetres, three in centimetres and three in metres. Arrange them in a notebook table headed Unit and Objects. Explain why another unit could still be used.',source:[20]},
 {id:'q11',text:'A ball enters the model track at A, moves through B and C, completes the loop through D, returns near E and leaves at F. Identify straight, circular and other curved portions. Does one trip through the loop necessarily make the motion periodic? Explain.',diagram:'track',caption:'The straight entry and exit, curved transition and circular loop are shown separately by labelled points.',source:[20]},
 {id:'q12',text:'Tasneem wants to make a metre scale. She considers plywood, paper, cloth, stretchable rubber and steel. Which material is especially unsuitable because its length changes when pulled? What other precautions would make a scale from the remaining materials reliable?',source:[21]},
 {id:'q13',text:'Design a card game for converting units of length. Make matching cards such as equivalent lengths in different units, explain the rules, and include a way for players to check disputed pairs.',source:[21]}
];
export const projects=[
 {id:'project1',title:'Measure one sheet by measuring many',text:'A single sheet may be thinner than a ruler’s smallest division. Select a stack of many sheets, count the sheets, measure its thickness without the covers, and divide by the number of sheets. Repeat with a different stack size. A sheet has two page faces: do not divide by the printed page-number difference without checking the sheet count. Report an approximate thickness and discuss the effects of gaps and compression.',diagram:'paper-stack',caption:'Measure the complete stack of sheets, excluding the covers.',source:[21]},
 {id:'project2',title:'Compare leaves from one tree',text:'Collect several fallen leaves from the same tree and identify it with help. Define length consistently from the base of the leaf blade to its tip, excluding the stalk, and breadth as the widest distance across the blade. Use a 15 cm ruler where suitable. Record leaf number, tree name, length, breadth and units. Discuss why leaves from the same tree need not have identical dimensions.',figure:'leaf',caption:'Use the same definition of length and breadth for every leaf.',source:[21]},
 {id:'project3',title:'Investigate older measures',text:'Ask elders which length units they remember using, where they used them and how each was defined. With an adult, look for museum or archaeological information about ruled objects found at Indian sites. Record the source and distinguish measured evidence from an interpretation of what an ancient object was used for. Compare one traditional method with a metric measurement. Different tools and traditions can be compared by stating the unit and method clearly.',caption:'',source:[22]},
 {id:'project4',title:'Build a measured maze',text:'Use a ruler to draw a maze with straight segments 1 cm or 2 cm long, or combinations of these lengths. Measure carefully from the marks, not the ruler’s end. Ask a partner to trace a route, add its segment lengths and check the total. The printed sketch is a design idea, not a full-size measurement template.',diagram:'maze',caption:'Choose a scale for your own maze and mark the entrance and exit.',source:[22]},
 {id:'project5',title:'Keep a private height record',text:'Stand safely against a wall while an adult uses a flat book to mark your height. Record the date, unit and method. Repeat about every three months using the same method and similar conditions. Keep your own record private and include a sibling only with permission. Small apparent differences can come from posture or measurement, so check the method before drawing a conclusion.',figure:'review-project5',caption:'A useful comparison keeps the method consistent across measurements.',source:[22]},
 {id:'project6',title:'Count wheel turns to estimate distance',text:'With an adult, mark a bicycle tyre with chalk and measure the distance rolled in one complete turn on level ground. Walk the bicycle slowly through several complete turns, counting the mark’s returns, then multiply turns by distance per turn. Compare with a tape measurement. Do not attach a metal strip or loose object to the spokes or frame. Discuss slipping, steering and tyre pressure. Professional road-course measurers use calibrated bicycles with devices such as a Jones Counter; their procedure includes checks before and after measuring.',diagram:'wheel',caption:'Use a harmless chalk mark and walk the bicycle. A rolling wheel connects repeated motion with distance.',source:[22]}
];
