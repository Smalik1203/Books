import {applyClass7ComparisonTables} from './science-g7-comparison-tables.mjs';
// The supplied Grade 7 Chapter 1 is the source, not the Grade 6 adaptation.
// Stable IDs link source coverage, page groups, additions and retention checks.
export const title='The Ever-Evolving World of Science';
// Explicit teaching relationships keep photographs, safety and explanations
// with their topic even when the chapter is regenerated or repaginated.
export const topicRelationships={
 'topics-2-3-1':{explanations:['circuit-image-guidance']},
 'topics-4-5-1':{explanations:['battery-qualification']},
 'topics-6-7-1':{gallery:'water-sequence',explanations:['water-explanation']},
 'topics-10-11-1':{gallery:'light-water-art'}
};
export const opener=[
 'Watch a paper plane. What would you like to find out about its flight?',
 'Perhaps it turns, dips or travels farther than you expected. One flight may raise several questions: What changed its direction? Would it follow the same path again? What could you measure instead of guessing?',
 'In Class 6, you began observing, questioning and testing ideas. In Class 7, you will look more closely at how things work, why changes happen and what patterns can tell you. Curiosity still starts the journey; careful evidence helps you decide where to go next.',
 'Science reaches from tiny cells in a leaf to the movement of Earth and the Moon. It also begins with things near you: a stain on cloth, a lamp that will not light or water soaking into the ground. Familiar things can lead to unfamiliar questions.'
];
export const lesson=[
 {id:'deeper-heading',type:'heading',text:'1.1  Ask Deeper Questions',source:[1,2]},
 {id:'flight-question',type:'body',text:'Suppose you think that folding up a paper plane’s wingtips will change how far it travels. Your explanation is an idea to investigate. A **prediction** states what you expect to observe under particular conditions. Before launching, predict whether the folded tips will increase the distance, decrease it or make no clear difference.',source:[1,2],addition:'Turn the source’s flight invitation into a testable comparison.'},
 {id:'plane-investigation',type:'panel',kind:'setup',source:[1,2,5],addition:'One fair-comparison investigation with repeated trials and no prescribed result.',paragraphs:[
  'With your teacher, make two paper planes from identical sheets using the same basic folds. Label them A and B. Keep A’s wingtips flat; fold both of B’s wingtips upward by the same amount. Use only paper, without clips or pointed attachments.',
  '1. Choose a clear indoor space. Mark a launch line. Use the same launcher, launch height and direction, and aim for the same gentle release each time.',
  '2. Launch A, then B. Measure straight from the launch line to the point where each plane first touches the floor, in the intended forward direction. Record each distance and its unit in your notebook.',
  '3. Alternate A and B until each has made three flights. Note turns, collisions or damaged folds; do not quietly replace an inconvenient result.',
  '4. Compare all three distances for each plane. Describe any pattern and any overlap. What would you test again?',
  'Keep everyone behind the launch line. Never aim at a person. Retrieve planes only when launching has stopped. Hand launches vary, so these trials cannot establish a rule for every plane.'
 ],figure:'plane-setup'},
 {id:'record-guidance',type:'body',text:'A **fair comparison** keeps other relevant conditions alike while testing a particular difference. Here the intended difference is the wingtips. The paper, basic folds and launch conditions should stay alike. A record of only the longest flight would hide how much the other flights varied.',source:[2,5],addition:'Explain controls and why all trial records matter.'},
 {id:'flight-thinking',type:'panel',kind:'think',source:[5],addition:'A substantial evidence pause after the first-hand comparison.',paragraphs:[
  'Suppose one plane travelled farther on its first flight, but the distances for the two planes overlapped across the three trials. Would “This design always flies farther” be a justified conclusion?',
  'Discuss how differences in a hand launch, a bent wing or where a plane first lands could affect your record. Choose one detail to control more carefully on the next set of flights. Explain what more evidence would help you decide.'
 ]},
 {id:'evidence-limits',type:'body',text:'Your conclusion should describe what your records support. “B travelled farther in two of our three pairs of flights” is a narrower claim than “B is the better plane”. Better for what: distance, time in the air or a straight path? The question determines what you need to measure.',source:[2,5],addition:'Distinguish observed patterns from universal claims and define the comparison criterion.'},
 {id:'changing-knowledge',type:'body',text:'Scientific explanations can change when new evidence becomes available. An unexpected result is a reason to examine the test, the record and the explanation. It is not a reason to hide the result. Even a result that agrees with your prediction may leave something unanswered.',source:[2,5]},
 {id:'connections-heading',type:'heading',text:'1.2  Ideas Connect Across Science',source:[2,3,4,5]},
 {id:'connections-intro',type:'body',text:'This book brings together physics, chemistry, biology and earth science. Their questions overlap. A paper plane involves the properties of paper, forces, motion and measurement. Understanding rain brings together water, heat, air and the ground beneath our feet. The chapters ahead develop these connections.',source:[2,3]},
 {id:'topics-2-3',type:'comparison',source:[2,3],columns:[
  {title:'Substances around us',art:'substances',figureCaption:'Everyday materials can start a question.',items:['Compare acidic, basic and neutral substances.','Investigate questions about sour fruits and a haldi stain.','Use safe tests; never taste an unknown substance.']},
  {title:'Electric circuits',art:'circuit',figureCaption:'Wires connect circuit components.',items:['Explore batteries, lamps, wires and other components.','Test which materials let a lamp glow in a circuit.','Work only with teacher-approved low-voltage equipment, never mains sockets.']}
 ],chapters:[2,3]},
 {id:'topics-4-5',type:'comparison',source:[3],columns:[
  {title:'Metals and non-metals',art:'materials',figureCaption:'Similar uses, different materials.',items:['Compare properties of materials.','Use several properties when grouping them.','Connect a material’s properties with its uses.']},
  {title:'Changes around us',art:'changes',figureCaption:'Melting ice: solid changes to liquid.',items:['Investigate physical and chemical changes.','Compare melting ice, ripening fruit and rocks breaking.','Ask which changes can be reversed, and how.']}
 ],chapters:[4,5]},
 {id:'battery-qualification',type:'body',text:'A battery running out is one example of change, but not all batteries are alike. Some are designed to be recharged; others are not. Never try to recharge a battery that is not designed for it. The label and correct equipment matter. “Used up” does not tell the whole story.',source:[3],correction:'Replace the source’s blanket claim that a depleted torch battery cannot be used again.'},
 {id:'circuit-image-guidance',type:'body',text:'A spoon can form part of a test circuit’s path. If a lamp stays dark, check the cell, lamp and connections before drawing a conclusion about the object. A faulty connection can also interrupt the path.',source:[3],addition:'Retain the spoon test and bound a negative observation; the photo is a component close-up, not that exact test.'},
 {id:'topics-6-7',type:'comparison',source:[3,4],columns:[
  {title:'Growing and changing',items:['Explore adolescence as a stage of growth and change.','Recognise that people develop at different rates.','Discuss questions respectfully, without comparing classmates’ bodies.']},
  {title:'Heat in nature',items:['Investigate how heat moves between places.','Connect heating and cooling with changes in water.','Follow links among sunlight, evaporation and rain.']}
 ],chapters:[6,7]},
 {id:'water-sequence',type:'topic-figure',art:'heat-water',source:[3],caption:'From a candle to sunlight: heating connects everyday changes with water in nature. Observe flames only in a teacher-led demonstration.',addition:'Use real candle and lake photographs with the complete evaporation/condensation explanation adjacent.'},
 {id:'water-explanation',type:'body',text:'Liquid water enters the air as water vapour during **evaporation**. When water vapour cools sufficiently, **condensation** forms tiny liquid droplets; clouds may contain droplets, ice crystals or both. Water can later fall as rain, flow over land or soak into the ground. Sunlight supplies energy for much of this cycling; water vapour itself is invisible.',source:[3],correction:'Make condensation explicit between evaporation and rain; do not represent visible cloud as vapour.'},
 {id:'topics-8-9',type:'comparison',source:[4],columns:[
  {title:'Time and motion',art:'time',figureCaption:'A sundial uses shadows to track time.',items:['Investigate ways to measure time.','Relate a moving object’s distance to the time taken.','Compare measurements, rather than impressions such as “fast”.']},
  {title:'Life processes in animals',art:'runners',figureCaption:'Moving bodies depend on life processes.',items:['Explore how animals obtain and use food.','Study breathing and how blood carries nutrients.','Connect these processes with growth and survival.']}
 ],chapters:[8,9]},
 {id:'topics-10-11',type:'comparison',source:[4,5],columns:[
  {title:'Life processes in plants',art:'plant',figureCaption:'Plant structures support life processes.',items:['Investigate how plants make food and exchange gases.','Explore how plants obtain water and other substances.','Compare plant and animal processes without assuming they work identically.']},
  {title:'Light and shadows',art:'mirrors',figureCaption:'Dice reflected in a shiny surface.',items:['Explore how light helps us see.','Investigate shadows and reflections.','Connect changing shadows with ways of tracking time.']}
 ],chapters:[10,11]},
 {id:'light-water-art',type:'topic-figure',art:'light-water',source:[5],caption:'A pencil seen through water and glass. Keep light beams away from eyes.',addition:'Use a real pencil-in-water photograph to preview the source light-and-water connection; retain eye safety.'},
 {id:'earth-moon-sun',type:'body',text:'The final chapter turns to Earth, the Moon and the Sun. Earth rotates about its axis and travels around the Sun; the Moon travels around Earth. These movements help explain day and night and the changing positions we observe. Earth and the Moon can also cast shadows that produce eclipses. Never look directly at the Sun to investigate these ideas.',source:[5],chapters:[12]},
 {id:'earth-light-art',type:'topic-figure',art:'earth-light',source:[5],caption:'Sunlight illuminates one half of Earth. During a solar eclipse, the Moon lies between the Sun and Earth and its shadow falls on part of Earth. These photographs show separate views.',addition:'Use real Galileo and National Park Service photographs as separate observations, not an alignment diagram.'},
 {id:'living-processes',type:'body',text:'Plant and animal life processes developed through evolution over many generations. Organisms did not plan these changes. Compare their shared needs and different structures without assuming they work identically.',source:[4],correction:'Replace purposeful “life figured out how” wording with a non-teleological explanation.'},
 {id:'responsibility-heading',type:'heading',text:'1.3  Explore with Care',source:[2]},
 {id:'environment',type:'body',text:'Investigating the world also brings responsibility. Human activities affect water, soil, air and living things. Scientific evidence can help people understand environmental problems and judge proposed solutions. A useful suggestion needs a reason for expecting it to help, and a way to check what happens.',source:[2]},
 {id:'environment-example',type:'body',text:'For example, rainwater may soak into open ground or flow across a paved surface. If a school wants to reduce puddling, it needs to understand where the water comes from and where it goes. One photograph after one shower cannot show how the site behaves in every storm.',source:[2,3],addition:'Use the source’s groundwater link to illustrate responsible evidence gathering.'},
 {id:'environment-records',type:'body',text:'Compare records after different showers from a safe, dry place; consider slope, surface and drainage. Never enter floodwater or open drains. Discuss changes with responsible adults, considering evidence, safety, cost and how people use the space.',source:[2],addition:'Give environmental responsibility a concrete evidence-based application without adding a second investigation.'},
 {id:'collaboration',type:'body',text:'Share your question, method and evidence. If others disagree, discuss which observation could help resolve it. Ask for guidance when you need unfamiliar equipment.',source:[2,5]},
 {id:'question-answer-heading',type:'heading',text:'1.4  Question the Answer',source:[5,6]},
 {id:'question-answer-intro',type:'body',text:'Usually you are given a question and asked for an answer. Try reversing the task. A single answer may fit very different questions. “Just make it half!” could respond to sharing a cake equally, shortening an essay, fitting something into an envelope or reducing the length of a dance song.',source:[6]},
 {id:'question-answer-panel',type:'panel',kind:'think',source:[5,6],sourceActivity:'1.1',paragraphs:[
  'For each answer below, invent an interesting question or situation that could lead to it. Write your questions in your notebook, then compare them with a partner.',
  '• Because the cat’s teeth were crooked.',
  '• Just add some milk.',
  '• Don’t panic, I have my towel.',
  '• 42',
  'Try different contexts, rather than an obvious arithmetic question for 42. Which facts would need to be true for each answer to fit? Identify an assumption in one of your situations.'
 ]},
 {id:'creative-vs-evidence',type:'body',text:'This is an exercise in creative question-making. An imagined situation is not scientific evidence, and an answer can contain an assumption that turns out to be mistaken. Choose one of your questions and discuss whether observation could help answer it. If not, explain what kind of question it is.',source:[6],correction:'Retain the creative task without treating every premise as true or every question as scientifically testable.'},
 {id:'questions-and-observations',type:'body',text:'A question about a story may invite imaginative answers. A question about a material needs observations that other people can check. State which kind of question you are asking, and which information your answer depends on.',source:[5,6],addition:'Link the restored experiment-preview pictures with the limits of creative question-making.'},
 {id:'close',type:'body',text:'Keep room for questions that you cannot answer yet. New knowledge, a better measurement or a different comparison may let you return to them. The next chapters offer places to begin: look closely, test carefully and let the evidence help you rethink.',source:[5,6]}
];
export const glossary=[
 ['Prediction','An expected observation under stated conditions.'],
 ['Evidence','Information used to judge an idea or answer a question.'],
 ['Fair comparison','A comparison that keeps other relevant conditions alike while testing a particular difference.'],
 ['Assumption','Something accepted for the moment without having checked it.'],
 ['Evaporation','The change of liquid water into water vapour at its surface.'],
 ['Condensation','The change of water vapour into liquid water.']
];
export const summary=[
 'Science develops through questions, observations, tests and explanations that can change with evidence.',
 'A clear question tells you what to observe or measure. A prediction states what you expect before a test.',
 'Fair comparisons and repeated trials help you interpret results, including those you did not expect.',
 'Materials, energy, motion, life processes and Earth’s systems are connected topics.',
 'Responsible investigation considers the environment, other people and safe ways of working.',
 'Creative questions can open new directions. Check their assumptions before treating an answer as an explanation.'
];
export const exercises=[
 'A class studies water drying from a wet cloth. Identify two topics from this year’s book that connect to its question, and explain each connection.',
 'Two paper planes are launched by different students from different heights. Their distances differ. Explain why this does not isolate the effect of the wingtips. Describe a fairer comparison.',
 'A learner reports only the longest of three flights. What information has been lost? Explain why three flights cannot establish that a design always travels farther.',
 'Someone suggests paving a school’s muddy patch. What evidence about water movement and the uses of the space would help judge the proposal? Name one safety precaution when gathering it.'
];

applyClass7ComparisonTables(lesson,1);
