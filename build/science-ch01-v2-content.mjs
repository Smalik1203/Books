// Source: the user's Chapter 1.pdf, Curiosity, reprint 2026-27, printed pp. 1–8.
// IDs are editorial anchors, not page numbers. Source activity numbers live in
// the ledger; the V2 feature labels are deliberately unnumbered in print.
export const title='The Wonderful World of Science';
export const opener=[
 'Look closely. What can you notice that you had not noticed before?',
 'A small beetle rests on a leaf. A seedling grows beside a puddle. Ripples spread across the water. Each observation can lead to a question: What is the beetle doing? What does the seedling need? What made the ripples?',
 'You have been exploring and asking questions since childhood. In Class 6, you will develop ways to investigate those questions. **Science** is a way of observing, thinking and testing ideas to understand the world. **Curiosity** is the desire to find out more.',
 'You do not need an answer before you begin. Start with something you can observe, then ask how you could learn more about it.',
 'Science can begin with a grain of sand, a mountain, a blade of grass or an entire forest. It reaches from the ocean floor to distant stars. It also belongs in familiar places: the kitchen, the playground and the path to school. A place does not have to be a laboratory for a question to be scientific.'
];
export const lesson=[
 {id:'science-everywhere',type:'heading',text:'1.1  Questions Are Everywhere',source:[1,2]},
 {id:'landscapes',type:'photos',source:[1,2],caption:'',note:'These pictures show very different scales. They are not shown at the same scale.'},
 {id:'question-detail',type:'body',text:'Instead of asking “What happens to plants?”, ask “Does this flower open at the same time each morning?” Record opening times on several days. Your records may raise another question about light or weather.',source:[1],addition:'Show how curiosity becomes a question that can be investigated.'},
 {id:'observation-task',type:'panel',kind:'setup',source:[1,7],addition:'Safe first-hand observation turns the introductory invitation into a concrete task.',paragraphs:[
  'Choose a safe place near your classroom. Observe it with a partner.',
  '1. Watch for five minutes. Notice shapes, colours, movement or changes. Record three observations in your notebook; a labelled sketch can help.',
  '2. Compare your records. Which details did you both notice? Which did only one of you record?',
  '3. Write one question raised by your observations.',
  'Stay with your group. Leave living things undisturbed. Never taste or touch unfamiliar substances, or look directly at the Sun.'
 ]},
 {id:'observing-defined',type:'body',text:'An **observation** is a detail you notice or measure. “Two ants crossed the leaf” describes what was seen. “The ants were searching for food” suggests a reason for their movement. The reason might be worth investigating, but it is not the same as the observation.',source:[6],addition:'Separate observation from interpretation before discussing evidence.'},
 {id:'changing-ideas-heading',type:'heading',level:2,text:'Knowledge Can Change',source:[2]},
 {id:'puzzle',type:'body',text:'Think of scientific knowledge as an unfinished jigsaw puzzle. New discoveries add pieces. Sometimes new evidence shows that a piece needs to be moved: an explanation that once seemed reasonable needs to change. Finding a mistake can improve our understanding.',source:[2]},
 {id:'evidence-defined',type:'body',text:'**Evidence** is information used to judge an idea. An observation becomes useful evidence when you explain what question it helps answer and how you made it. Another person should be able to understand your record and, where possible, check it.',source:[2,6,7],addition:'Connect the changing-puzzle analogy to a checkable record.'},
 {id:'sample-record',type:'table',source:[6],addition:'Model the distinction between a record and a possible explanation.',caption:'Table 1.1: Sample observations and possible explanations',widths:[.5,.5],rows:[
  ['What was observed','A possible explanation'],
  ['At 9 a.m., this flower was closed. At 11 a.m., it was open.','A change in light may be involved.'],
  ['The pen left no mark when moved across the paper.','Its refill may have run out of ink.']
 ],note:'Sample records, not your results. Read across to connect an observation with an idea. The right-hand column is not a list of established causes.'},
 {id:'flower-limits',type:'body',text:'The flower record does not show that light caused the change. Time passed, and temperature may also have changed. Repeated observations can reveal a pattern; a carefully planned comparison can help you test an explanation. Keep the question, the record and the explanation separate.',source:[2,6],addition:'Explain the limits of the sample record.'},
 {id:'book-heading',type:'heading',text:'1.2  A Journey Through This Book',source:[3,4,5]},
 {id:'earth',type:'body',text:'Begin with Earth, the only planet we know supports life. Its environments are home to many kinds of plants and animals, and need protection. You may have watched a seed become a seedling or a caterpillar change into a butterfly. Science helps us ask how living things grow, and how they depend on their surroundings.',source:[3]},
 {id:'roadmap',type:'roadmap',source:[3,4,5],caption:'Living things, food, materials, water and the sky connect the questions in this book.'},
 {id:'life-food',type:'comparison',source:[3],columns:[
  {title:'Living things',items:['Compare plants and animals.','Look closely at leaves, seeds and other structures.','Ask what living things need to grow and survive.']},
  {title:'Food',items:['Explore ingredients in dishes from different parts of India.','Ask where ingredients come from.','Investigate what food provides for our bodies.']}
 ]},
 {id:'materials-water',type:'comparison',source:[4],columns:[
  {title:'Materials',items:['Compare paper, metal, plastic, rubber and cloth.','Ask why a material suits a particular use.','Explore magnets and ways to separate materials.']},
  {title:'Water and temperature',items:['Notice ice, liquid water and water vapour.','Ask how rain forms and water changes state.','Measure how hot or cold something is.']}
 ]},
 {id:'sky',type:'body',text:'You will also investigate how things move, and look beyond Earth to the Sun, Moon and stars. Questions about the sky can grow from observations made on the ground. Questions about familiar objects can lead just as far: why is a key made of a hard material, while an eraser is soft?',source:[4,5]},
 {id:'connected',type:'body',text:'These topics are connected. Water, air and food matter to living things. A container’s material affects what it can be used for. Observations of motion involve changes in position and time. As you learn, look for links between ideas without assuming that similar-looking events have the same cause.',source:[2,3,4,5],addition:'Make the source’s connected-ideas claim concrete without teaching later chapters prematurely.'},
 {id:'pen-heading',type:'heading',text:'1.3  From a Question to a Test',source:[5,6]},
 {id:'pen-observation',type:'body',text:'Suppose your pen stops writing. You move its tip across paper, but it leaves no mark. That is your observation. “Why has it stopped writing?” is your question. One possible explanation is that the refill is empty.',source:[5]},
 {id:'hypothesis',type:'body',text:'A **hypothesis** is a possible explanation that can be checked. A **prediction** describes what you expect to observe if the explanation is right. These are connected, but they do different jobs.',source:[5,6],addition:'Distinguish a possible explanation from a prediction.'},
 {id:'pen-diagram',type:'pen',source:[5],caption:'A transparent ballpoint pen lets you inspect its refill. A dark section can show where ink remains; an opaque refill may not let you judge this.'},
 {id:'pen-alternatives',type:'comparison',source:[5,6],columns:[
  {title:'Possible explanation',items:['The refill has no ink left.','This is an idea about why the pen stopped.']},
  {title:'Prediction',items:['If the transparent refill is empty, I expect no ink to be visible inside it.','This says what to look for when checking the idea.']}
 ]},
 {id:'pen-test',type:'body',text:'You inspect the transparent refill. If it appears empty, the observation supports your explanation. If you can still see ink, “the ink has all been used up” does not fit that observation. You need another idea: perhaps ink is not reaching the tip.',source:[5]},
 {id:'pen-limits',type:'body',text:'Be careful about what the check can tell you. An opaque refill may hide its contents. Ink visible inside a refill does not show that it can flow through the tip. A useful conclusion says both what you found and what remains uncertain.',source:[5,6],addition:'Bound a negative result by what the check can actually reveal.'},
 {id:'pen-followup',type:'body',text:'You could compare the pen with one that writes on the same paper. If one writes and the other does not, the comparison gives you a reason to investigate the first pen further. It still does not identify exactly what is wrong inside. Never heat a pen, put its tip in your mouth or use sharp objects to open it.',source:[5],addition:'A safe, functioning comparison and its limits.'},
 {id:'reflection-own-problem',type:'panel',kind:'think',source:[5],sourceActivity:'1.1',paragraphs:[
  'Think of a problem you tried to solve recently. What did you first notice? What steps did you take, and what did each step tell you?',
  'Describe a point where you changed your idea, or explain why you kept it. If you solved the problem without finding its cause, say so. Fixing something and explaining why it failed are not always the same achievement.'
 ]},
 {id:'method-heading',type:'heading',level:2,text:'A Method You Can Check',source:[5,6]},
 {id:'method-intro',type:'body',text:'The pen example shows a **scientific method**: observe, ask a question, suggest an explanation, test it and examine the result. A test may be an experiment or further careful observation. The aim is to connect your conclusion to evidence.',source:[5,6]},
 {id:'method-diagram',type:'method',source:[6],caption:'A useful sequence, with a route back when the evidence calls for another idea.'},
 {id:'method-details',type:'bullets',source:[6],items:[
  'Observe: describe what happened before deciding why it happened.',
  'Question: choose something specific you want to find out.',
  'Suggest: give a possible explanation and a prediction.',
  'Test: decide what to observe or compare, then keep a record.',
  'Review: ask whether the result answers the question and what remains uncertain.'
 ]},
 {id:'method-not-rigid',type:'body',text:'The diagram is a guide, not a rule that every investigation must follow in a straight line. You may repeat an observation, improve a question or return to a different explanation. A result you did not expect can be useful if the record is clear and the test was carried out carefully.',source:[6],addition:'Avoid presenting science as one rigid universal recipe.'},
 {id:'fair-test-heading',type:'heading',level:2,text:'Make a Comparison Fair',source:[6]},
 {id:'fair-test-intro',type:'body',text:'Suppose you want to find out whether folding a strip of paper changes how much it can support. Comparing a wide card strip with a narrow paper strip would change several things at once. If their results differed, you would not know which change mattered.',source:[6],addition:'Introduce control of variables with a safe, accessible comparison.'},
 {id:'paper-investigation',type:'panel',kind:'setup',source:[6],addition:'First-hand fair comparison with prediction, repeat testing and an uncertain outcome allowed.',paragraphs:[
  'Use two identical paper strips, two books of equal height and a few identical counters. Ask your teacher to prepare the strips. Work on a low, steady table.',
  '1. Place the books a short distance apart. Bridge the gap with one flat strip. Make a zigzag fold along the length of the second strip.',
  '2. Before testing, predict which strip will support more counters, or whether there will be no difference. Explain your reason.',
  '3. Test each strip over the same gap. Add counters gently at the centre, one at a time. Record the greatest number supported before the strip slips or collapses.',
  '4. Repeat with fresh, identical strips. Keep the gap, paper, counters and loading position the same. Compare the repeated results, including any that differ.',
  'Keep fingers and faces clear of falling counters. Do not use heavy or sharp objects.'
 ]},
 {id:'test-reading',type:'body',text:'Compare the numbers your strips supported, not just whether they looked strong. If a strip slipped from a book before bending, record that too. Repeating a test can reveal how much results vary. Do not leave out a result simply because it disagrees with your prediction.',source:[6],addition:'Separate observed failure from assumed mechanism; retain unexpected evidence.'},
 {id:'test-conclusion',type:'body',text:'If the folded strips repeatedly support more counters, your records support that claim for the paper and gap you tested. They do not show that every folded sheet is stronger in every situation. If results overlap or vary widely, describe that uncertainty and suggest what you would check next.',source:[6],addition:'Qualify a fair-test conclusion and make inconclusive results discussable.'},
 {id:'everyday-heading',type:'heading',text:'1.4  Science Is a Shared Practice',source:[6,7]},
 {id:'everyone',type:'body',text:'Scientists investigate questions as part of their work, but the habits are useful to everyone. People who cook, repair bicycles or maintain electrical equipment often observe a problem, consider possible causes and check them. Their experience helps them choose a sensible place to begin.',source:[6]},
 {id:'everyday-examples',type:'bullets',source:[6],items:[
  'A cook notices dal has spilled from a cooker. Too much water is one possible cause; the observation alone does not establish it.',
  'A bicycle repairer checks a flat tyre to find where air is escaping. Finding a leak is evidence about the location of a problem.',
  'A qualified electrician checks whether a lamp fault is in the bulb, switch or another part. Electrical equipment needs trained, safe handling; this is not an activity to try yourself.'
 ]},
 {id:'reflection-daily-life',type:'panel',kind:'think',source:[6],sourceActivity:'1.2',paragraphs:[
  'Describe a daily-life situation in which someone used observations and a test to solve a problem. Name the question, the possible explanation and the check.',
  'If they changed several things at once, could they tell which change caused the result? Suggest a safer or clearer comparison, or explain what information is still missing.'
 ]},
 {id:'together',type:'body',text:'Science is rarely done alone. Scientists work in teams and share methods and evidence with others, sometimes across many countries. You can practise this in class: compare records, ask how a measurement was made and explain the reason for a conclusion.',source:[7]},
 {id:'team-photo',type:'team',source:[7],caption:'Compare records and methods, as well as answers.'},
 {id:'disagreement',type:'body',text:'If two groups disagree, voting for the most popular answer will not settle the scientific question. Look at how each group worked. Were they observing the same thing, for the same length of time? Did they use the same meaning for words such as “open”, “moving” or “supported”? A disagreement may show what needs to be checked again.',source:[7],addition:'Give collaboration a concrete evidence-checking purpose.'},
 {id:'reflection-next-question',type:'panel',kind:'think',source:[7],sourceActivity:'1.3',paragraphs:[
  'Choose one “Why?” question about something you have noticed. Describe how you would begin to find an answer: what could you observe, what could you compare and whom could you ask?',
  'Tell a partner your plan. Ask them to identify one detail you need to make clearer. Revise the plan, and explain how the change would help you answer your question.'
 ]},
 {id:'long-journey',type:'body',text:'Some questions need equipment, knowledge or time that you do not yet have. You will meet more ideas through the next five years of school and beyond. Keep a record of questions you cannot answer now. New learning may give you a way to return to them.',source:[7]},
 {id:'close',type:'body',text:'There is much still to discover. A careful look at something ordinary can be the start of an investigation. Keep observing, keep asking, and be ready to change an idea when evidence gives you a reason.',source:[8]}
];
export const glossary=[
 ['Science','A way of observing, thinking and testing ideas to understand the world.'],
 ['Curiosity','The desire to find out more.'],
 ['Observation','A detail noticed or measured.'],
 ['Evidence','Information used to judge an idea or answer a question.'],
 ['Hypothesis','A possible explanation that can be checked.'],
 ['Prediction','What you expect to observe under stated conditions.'],
 ['Scientific method','A way of linking questions, tests and conclusions to evidence.'],
 ['Fair comparison','A comparison that keeps other relevant conditions alike while testing a particular difference.']
];
export const summary=[
 'Science begins with questions about the world, from familiar objects to distant places.',
 'Curiosity leads to questions; careful observations make them easier to investigate.',
 'An observation describes a finding. A hypothesis offers an explanation. A prediction states an expected result.',
 'Tests and further observations provide evidence. Conclusions must stay within what that evidence can show.',
 'A fair comparison, clear records and repeated tests help make results more dependable.',
 'Unexpected results can lead to better questions and revised explanations.',
 'People use scientific reasoning in everyday work. Sharing methods lets others check our ideas.',
 'Learning continues beyond this chapter. Some questions need more knowledge, time or equipment.'
];
export const exercises=[
 'A leaf has three holes. A learner says, “An insect ate it.” Separate the observation from the possible explanation. What further evidence could help check the explanation?',
 'A pen leaves no mark on paper. Its transparent refill still contains ink. What idea does this observation challenge? What does it leave uncertain?',
 'Two groups test flat and folded paper. One also uses a wider strip and heavier counters. Explain why their results cannot show the effect of folding alone.',
 'Your result disagrees with your prediction. Describe two useful things to do before deciding what the result means.',
 'Two classmates record different numbers of moving ants in the same place. Suggest two details of their methods to compare before deciding whether either count is mistaken.',
 'Choose two topics from this chapter’s journey through the book. Write a question that connects them, and describe a safe first step towards investigating it.'
];
