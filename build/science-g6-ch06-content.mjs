export const title='Materials Around Us';
export const shortTitle=title;
export const opener=[
 'A notebook, a tumbler and a school bag serve different purposes. What makes their materials right for the job?',
 'Ghulan and Sheeta bring new notebooks and pens to class after the summer break. Madam Vidya asks everyone to look more closely: Which objects shine? Which can bend? Which let you see through them? The same classroom now offers many questions to investigate.',
 'Begin by naming objects and their materials. Choose a property, make a careful comparison and explain your grouping. Then test how materials behave with light and water, and discover two properties shared by all matter: mass and volume.'
];
const b=(id,text,source)=>({id,type:'body',text,source});
const h=(id,text,source,level=1)=>({id,type:'heading',text,source,level});
const f=(id,figure,caption,source)=>({id,type:'figure',figure,caption,source});
const d=(id,diagram,caption,source)=>({id,type:'diagram',diagram,caption,source});
const a=(id,sourceActivity,paragraphs,source,extra={})=>({id,type:'panel',kind:'setup',sourceActivity,paragraphs,source,...extra});
const t=(id,caption,rows,widths,source,note='')=>({id,type:'table',comparisonTable:true,caption,rows,widths,source,note});
export const lesson=[
 h('objects-head','6.1 Objects and Their Materials',[1,2]),
 b('objects-story','Look around your classroom. A table, a pen and a notebook are objects with different uses. Wood, metal, plastic, paper, glass, cloth and clay are examples of materials used to make objects. A **material** is a substance or mixture of substances from which an object can be made.',[1,2]),
 a('identify-task','6.1',[
  '1. Choose several safe objects around you. Look at each whole object, then at its separate parts. Do not pull electrical equipment apart or handle broken objects.',
  '2. Make a notebook table headed Object, Part, Material and Evidence. Record what you can identify. If appearance is not enough, write “uncertain” and ask your teacher or check a label.',
  '3. Compare with a partner. Did you name a material, such as wood, or only describe a property, such as brown? Can one object belong to several material groups?'
 ],[2]),
 b('identify-evidence','A notebook combines paper pages with a cover and a binding. A pen may contain plastic, metal and ink. Naming just one material can miss important parts. Equally, the same material can become different objects: steel can be used for a spoon, a tumbler or a chair frame.',[2,3,4]),
 t('object-material-table','Keep object, material and property distinct',[
  ['Object or part','Material','A property worth checking'],
  ['Notebook page','Paper','Can it fold? Can you see through it?'],
  ['Spoon','Stainless steel','Does its surface shine?'],
  ['Tabletop','Wood','What does its surface feel like?'],
  ['Water bottle','Glass, plastic or steel','Does this particular bottle let light through?']
 ],[.28,.27,.45],[2,3],'The material of your own object may differ from these examples.'),
 h('clay-head','From Clay to a Useful Vessel',[2],2),
 b('clay-story','People have chosen and worked materials for a very long time. Clay can be cleaned, mixed with water, shaped and fired in a kiln. Fired clay is called **terracotta**. Harappan pottery includes red surfaces with painted patterns. Jars, bowls and dishes show how one material can serve cooking, storage and other purposes.',[2]),
 f('pottery-picture','pottery','A clay jar and bowl illustrate different forms made from one material. This is a craft illustration, not a reconstruction of a particular museum object.',[2]),
 b('clay-evidence','Shape is only one part of the choice. A storage jar must hold its contents; a vessel used for heating must tolerate the conditions. The historical text Rasaratnasamuchchaya mentions clay and iron as materials for crucibles, vessels used to heat substances strongly. Historical examples raise questions about materials; heating tests belong with trained adults.',[1,2]),
 h('group-head','6.2 Grouping for a Purpose',[3,4]),
 a('group-task','6.2',[
  '1. Collect safe objects such as a notebook, spoon, eraser, wooden block, plastic lid and piece of cloth. Choose one property for grouping: shape, colour, surface texture or material.',
  '2. State your rule before you sort. Make groups and explain where each object belongs. Mark uncertain examples instead of guessing.',
  '3. Ask a partner to choose a different rule for the same collection. Record both groupings in your notebook. Which objects move into new groups?'
 ],[3]),
 b('group-evidence','**Classification** means arranging things into groups using a stated basis. The same collection can be classified in more than one useful way. A grocer groups grains and spices to help customers find them. A kitchen may group utensils by use or size. A good rule tells another person how to repeat the grouping.',[3,6]),
 {id:'tumbler-think',type:'panel',kind:'think',sourceActivity:'6.3',source:[4],paragraphs:[
  'Suggest materials for a drinking tumbler. For each suggestion, explain how it could hold water, keep its shape and be cleaned. Would a bag sewn from ordinary uncoated cloth do the same job? What extra layer might change your answer?',
  'Now consider a cooking vessel. Why is holding water alone not enough? Explain why ordinary paper or cloth should not be used as a cooking vessel over a flame.'
 ]},
 b('purpose-evidence','Choose materials by the conditions of use, not one attractive property. Ordinary woven cloth has spaces through which water can pass. A waterproof lining changes the construction. Glass and steel can both form tumblers, but differ in how they break, conduct heat and allow a view of the contents.',[4]),
 t('tumbler-table','One purpose, different material choices',[
  ['Material or construction','Useful feature','A limitation to consider'],
  ['Clear glass','Contents can be seen; rigid walls hold the shape','Can break into sharp pieces'],
  ['Stainless steel','Durable and holds liquids','Opaque; can become hot with a hot drink'],
  ['Suitable reusable plastic','Often light and resistant to breaking','Suitability for hot food varies; follow its label'],
  ['Ordinary uncoated cloth','Flexible and easy to fold','Usually lets water pass through or soak in']
 ],[.28,.34,.38],[4]),
 b('sports-story','Would a cricket ball be a good substitute for a tennis ball? Think about its surface, mass and behaviour after it hits the ground. The name “ball” describes a kind of object; it does not guarantee the same behaviour.',[5]),
 f('balls-picture','balls','A tennis ball, a cricket ball and a hand-exercise ball have different constructions. Compare the actual sizes of the balls you use.',[5]),
 a('bounce-task','6.4',[
  '1. With a teacher, select a tennis ball, a cricket ball and a hand-exercise ball, or safe available alternatives. Note their sizes and surfaces. Keep feet and other people away from the landing area.',
  '2. Release each ball without pushing from the same marked height above the same firm floor. Measure the starting height from the bottom of the ball. A partner observes the highest point of the first rebound.',
  '3. Repeat each drop three times. Record Ball, Release height, Rebound observations and Repeat in a notebook table. Compare actual heights if you can measure them; otherwise use clearly defined high, medium and low categories.',
  '4. Compare the results. Which conditions did you keep the same? What could make two trials differ? Do not assume in advance which ball will bounce highest.'
 ],[5]),
 b('bounce-evidence','A bounce depends on the material and the ball’s construction, as well as the surface and release conditions. Real sports balls may differ in size, mass, seams and internal pressure. This comparison investigates the balls you used; it does not isolate the effect of material alone.',[5,6]),
 h('appearance-head','6.3 Appearance and Surface',[6,7]),
 b('appearance-task','Try a sorting challenge with paper, cardboard, wood, chalk, copper wire and aluminium foil. Include brass, bronze or steel only if a teacher has a safe sample. Observe under the same light. Record colour, texture and whether a surface shines. Do not cut metal or use sharp wire ends to expose a fresh surface.',[6,7]),
 f('samples-picture','hardness','Material samples can be compared in several ways. Describe the particular surface you inspect, rather than judging by colour alone.',[6,7]),
 b('lustre','A shiny appearance is called **lustre**. Many clean metal surfaces are lustrous, including copper, aluminium, iron and zinc. A surface may become dull after reacting with air or moisture. Paper, untreated wood and jute usually look non-lustrous, but coatings can change their appearance.',[7]),
 {id:'shine-think',type:'panel',kind:'think',source:[7],paragraphs:['A polished wooden table and a piece of aluminium foil both shine. Is shine enough to identify a metal? Suggest another observation and explain why a coating could make appearance misleading.']},
 b('shine-evidence','A shiny surface is evidence about how that surface reflects light, not a complete identification of its material. Plastic, wax and polished surfaces can shine too. Compare several relevant properties before deciding what an unknown object is made from.',[7]),
 h('hardness-head','6.4 Hard, Soft or Easy to Bend?',[7,8]),
 a('hardness-task','6.5',[
  '1. Examine a brick, water bottle, pillow, tumbler, table and sweater, using safe examples chosen by your teacher. Identify the part and material you are comparing.',
  '2. Press gently where appropriate. Record whether the part changes shape easily. Do not press glass, crush containers, scrape furniture or break materials.',
  '3. Make a notebook table headed Object or part, Material, What I did and Observation. Compare the same kind of test with a friend. Keep “easy to squeeze” separate from “easy to scratch”.',
  '4. If your teacher demonstrates scratching, use small approved samples and a blunt tool, not a sharp key. Observe without making dust. Which surface is marked more easily?'
 ],[7,8]),
 b('hardness-evidence','In everyday speech, hard and soft describe several feelings. In a scratch comparison, **hardness** means resistance to scratching or indentation. A sponge is easy to compress; a rubber eraser may be less easy; a metal block hardly compresses under a hand. Always say which comparison you made.',[7,8]),
 t('mechanical-table','Different tests answer different questions',[
  ['Observation','Property being compared','Why the distinction matters'],
  ['A surface is difficult to scratch','Hardness','A surface can resist scratching yet the object may still break'],
  ['An object changes shape little when pressed','Stiffness or resistance to deformation','Shape and thickness, as well as material, affect the result'],
  ['A sponge squeezes easily','Compressibility','Air spaces help the whole sponge change volume'],
  ['Thin metal foil bends easily','Flexibility of this thin sheet','Easy bending does not mean that metal is a soft sponge']
 ],[.32,.3,.38],[7,8]),
 b('relative','Comparisons need a reference: “softer than a metal block” is more informative than “soft” alone. Hardness does not by itself tell you whether a chair is strong enough to support a person. Its design, joints and thickness matter too.',[7,8,20]),
 h('light-head','6.5 Seeing Through Materials',[8,9]),
 b('hide-story','Ghulan hides behind a wall, Sheeta behind a tree and Sara behind a frosted-glass door. Sheeta’s brother watches from a clear window. Which barriers hide a person completely, and which might leave a visible outline? Consider the material between observer and object.',[8,9]),
 a('light-task','6.6',[
  '1. Gather safe examples of a clear tumbler, butter paper, eraser, wooden board and clear or frosted plastic. A teacher may show glass samples with protected edges.',
  '2. Put the same coloured object behind each sample in the same light and at the same distance. Look from the front. Do not look at the Sun or use a laser.',
  '3. Record Sample, Can I see the object clearly?, Can I see a hazy shape? and Does light pass through? in your notebook. Use these observations to make three groups.',
  '4. Compare groupings and explain uncertain cases. Does doubling the paper layer change what you see? Keep the object and lighting the same.'
 ],[9,10]),
 b('light-evidence','A **transparent** sample transmits light so that an object can be seen clearly through it. A **translucent** sample transmits light but scatters it enough to prevent a clear view. An **opaque** sample blocks a view through it; it transmits no appreciable light under the test conditions.',[8,9]),
 f('panes-picture','panes','Clear glass gives a clear view; frosted glass gives a diffuse view; wood blocks the view. Compare equally thick samples under the same lighting.',[9]),
 t('light-table','Compare the view through each sample',[
  ['Group','View of an object behind it','Examples in ordinary thicknesses'],
  ['Transparent','Clear details','Clear window glass, clean water, air'],
  ['Translucent','Hazy light or shape; no clear details','Frosted glass, butter paper'],
  ['Opaque','No view through the sample','Wood, cardboard, a metal sheet']
 ],[.23,.4,.37],[8,9,10],'Thickness, coatings and suspended particles can change the result. A material name alone does not describe every sample.'),
 b('hide-explain','The wall and tree trunk block the view of Ghulan and Sheeta. Frosted glass may show Sara’s blurred outline, while clear window glass lets the brother look out. Clean water is transparent in a shallow clear container; adding suspended chalk can make the mixture cloudy and, at sufficient concentration, prevent a view through it.',[9,10]),
 h('dissolve-head','6.6 Mixing Materials with Water',[10,11]),
 b('lemonade-story','After playing, Ghulan watches his mother stir salt and sugar into water for shikanji. The crystals become difficult to see. Have they stopped existing, or has something else happened? Keep food preparation separate from classroom experiments: never taste an experimental mixture.',[10]),
 f('mixing-picture','mixing','Prepare separate samples and equal amounts of water before mixing. The tumblers shown here contain only water.',[10]),
 a('dissolve-task','6.7',[
  '1. Label five identical clear containers Sugar, Salt, Chalk, Sand and Sawdust. Add the same amount of water at the same temperature to each. A teacher supplies small samples and handles any dusty powder.',
  '2. Predict what will happen before adding anything. Add the same small level spoonful of the named material to each container. Use a clean spoon for each sample to avoid mixing them together.',
  '3. Stir for the same length of time, then let the containers stand for several minutes. Record visible grains, cloudiness, floating material or sediment. Do not taste any sample.',
  '4. Make a notebook table headed Material, Prediction, Observation after stirring, Observation after standing and Interpretation. If a sample is uncertain, repeat with less material and explain why.'
 ],[10,11]),
 b('dissolve-evidence','When salt or sugar **dissolves**, it spreads through the water at a scale too small to see as separate grains. The substance remains present. A **solution** can be clear even though it contains dissolved material. “No grains visible” is an observation; “the material no longer exists” is an incorrect conclusion.',[11]),
 t('solubility-table','Dissolving is different from floating or settling',[
  ['Sample in room-temperature water','Usual observation with a small amount','Interpretation'],
  ['Sugar or salt','Separate grains are no longer visible after stirring','Soluble in these conditions; remains in solution'],
  ['Sand','Grains remain and commonly settle','Does not dissolve appreciably'],
  ['Chalk powder','Water may become cloudy; some material settles','Mostly remains as undissolved particles'],
  ['Sawdust','Pieces remain; some may float','Floating is not dissolving']
 ],[.28,.37,.35],[11],'Record your own observations first. Amount, temperature, stirring time and the exact sample can affect what you see.'),
 b('limits','**Soluble** means a material can dissolve in the specified liquid. **Insoluble** usually means that so little dissolves that it is negligible for the situation. A fixed amount of water cannot dissolve unlimited salt or sugar. Undissolved grains after adding a large amount do not prove that the substance is insoluble.',[11]),
 b('liquids','Try a teacher-approved comparison of small amounts of vinegar, honey and mustard oil added separately to water. Vinegar mixes with water. Honey’s dissolved sugars can spread through water when stirred. Oil may break into tiny droplets during stirring, but commonly separates into a layer on standing. A temporary cloudy mixture is not the same as a solution.',[12]),
 d('oil-picture','oil-water','Oil and water can separate after standing. The two layers represent a mixture of liquids that do not mix completely.',[12]),
 b('gases','Some gases dissolve in water too. Dissolved oxygen is important for many aquatic living things. It is different from a visible air bubble and from the oxygen chemically combined with hydrogen in water itself. Water dissolves many substances, but it does not dissolve everything.',[12]),
 h('ors-head','When Accurate Mixing Matters',[12],2),
 b('ors','Oral rehydration solution (ORS) helps replace water and salts lost during diarrhoea. An adult should follow a health worker’s advice and the packet’s exact water quantity; do not assume every packet makes one litre. If packets are unavailable, WHO describes an emergency home mixture of six level teaspoons of sugar and half a level teaspoon of salt in one litre of safe drinking water. Accurate level measures matter: do not guess, heap the spoons or add extra salt. This is not a classroom tasting activity or a substitute for medical care. Its connection to this lesson is precise measurement and dissolved substances.',[12]),
 h('mass-head','6.7 Comparing Mass',[12,13]),
 a('mass-task','6.8',[
  '1. Take three identical cups and mark each at the same halfway height. Label them A, B and C. Fill A to the mark with water, B with sand and C with pebbles. Predict their relative masses.',
  '2. Check that the balance is level and reads zero. Measure each filled cup in the same unit. Record Cup, Contents, Empty-cup mass, Filled-cup mass and Difference in your notebook. Use the tare function only after your teacher explains it.',
  '3. Compare the measured contents masses by subtracting the empty-cup mass. Repeat a doubtful reading. Keep spills away from the balance and do not exceed its capacity.',
  '4. Explain which prediction the readings support. Notice the gaps between pebbles and sand grains. Does filling to the same height guarantee that the solid material alone occupies equal volumes?'
 ],[12,13],{figure:'mass',figureCaption:'Read your own balance; the illustration deliberately supplies no measurement.'}),
 b('mass-evidence','**Mass** is a measurable property of an object, reported in units such as grams and kilograms. Under the same local conditions, an object that is heavier has more mass. A balance makes the comparison more reliable than judging by hand. Larger-looking objects do not always have more mass.',[13,15]),
 b('mass-weight','People often use “weight” for a reading in kilograms. In science, mass and weight are different quantities: weight is the gravitational force on an object. Here, use the balance’s mass reading and state the unit. Equal-size cups and subtraction of their masses make the comparison clearer.',[13]),
 h('volume-head','6.8 Space, Volume and Capacity',[13,14]),
 b('bags-story','Madam Vidya asks the class to put school bags on their seats. There is no longer room to sit: the bags occupy space. Water occupies space too. Two identical tumblers may hold different amounts of water even though the containers are the same size.',[13,14]),
 d('volume-picture','volume','The containers have the same capacity, but the water occupies different volumes.',[13,14]),
 b('volume-evidence','The space occupied by something is its **volume**. A container’s **capacity** is the volume it can hold up to a specified limit. A half-filled tumbler has the same capacity as when it is full, but contains a smaller volume of water. A jug’s contents cannot all fit in a bottle if they exceed its available capacity.',[14]),
 t('mass-volume-table','Do not confuse the quantities',[
  ['Quantity','What it describes','Common units'],
  ['Mass','A property compared using a balance','gram (g), kilogram (kg)'],
  ['Volume','Space occupied by a substance or object','millilitre (mL), litre (L), cubic metre (m³)'],
  ['Capacity','How much a container can hold','mL or L, for many everyday containers']
 ],[.23,.46,.31],[14,15]),
 b('labels','A milk carton and a water bottle may each say 500 mL. That states equal volumes of contents, not equal masses or necessarily equal container capacities. To compare masses, use a balance. To compare volumes, use a suitable graduated container.',[14]),
 d('labels-picture','bottles','Both labels state 500 mL of contents. Equal volume does not by itself establish equal mass.',[14]),
 b('units','The SI base unit of mass is the kilogram (kg); 1 kg = 1000 g. The SI unit of volume is the cubic metre (m³). For everyday liquids, litres and millilitres are convenient: 1 L = 1000 mL and 1 m³ = 1000 L. Write a space between number and symbol, as in 7 kg and 500 mL. Do not add a plural s or a full stop unless it ends the sentence.',[15]),
 h('matter-head','6.9 What Is Matter?',[15,16]),
 b('matter','Anything that has mass and occupies space is called **matter**. The cup, its water, sand and pebbles are matter. Materials are kinds of matter selected to make objects. Air is matter too, even though we usually cannot see it: it occupies space and has mass.',[15,16]),
 d('air-picture','air-space','A model of air trapped in an inverted cup. The trapped air occupies space; it is not an empty region.',[16]),
 b('air-evidence','A teacher can lower an inverted empty cup straight down into water. Much of the water is kept out by the trapped air. Tilting the cup allows bubbles to escape and water to enter. This shows that air occupies space; by itself, it does not measure air’s mass. A suitable balance and controlled experiment are needed for that separate claim.',[16]),
 {id:'plastic-think',type:'panel',kind:'think',source:[16],paragraphs:['Plastic can make objects light, durable and resistant to water. The same durability can make discarded plastic persist. Choose one use and compare benefits, waste and available alternatives. Can one label, “good” or “bad”, answer every material-choice question?']},
 b('classification-close','Grouping helps us find patterns, whether we study materials, rocks or living things. It also helps us choose objects for a purpose. Keep the rule explicit, test more than one property and revise a grouping when new evidence gives a better explanation.',[16]),
 h('historical-head','Ways of Describing Properties',[17],2),
 b('historical','Historical Indian traditions also used paired descriptions. The Ayurvedic text Ashtanga Hridaya lists ten pairs of qualities, including heavy–light and soft–hard. The table gives their everyday English senses. These are historical descriptive categories, not a replacement for defined measurements or controlled scientific tests.',[17]),
 t('historical-table','Ten traditional pairs of descriptions',[
  ['One description','Contrasting description'],['Heavy','Light'],['Slow','Quick or sharp'],['Cold','Hot'],['Oily or unctuous','Dry'],['Smooth','Rough'],['Dense or solid','Fluid or liquid'],['Soft','Hard'],['Stable','Moving or unstable'],['Subtle or small','Large or gross'],['Non-slimy','Slimy']
 ],[.5,.5],[17],'Meanings depend on their historical context; the pairs do not establish an object’s composition or a medical effect.')
];
// Keep the complete adult-facing health guidance together, including qualifications.
lesson.find(block=>block.id==='ors').keepWhole=true;
export const glossary=[
 ['Material','A substance or mixture used to make an object.'],['Classification','Grouping using a stated basis or property.'],['Lustre','A shiny surface appearance.'],['Non-lustrous','Without a shiny appearance in the conditions observed.'],['Hardness','Resistance to scratching or indentation.'],['Transparent','Transmits light and permits a clear view through it.'],['Translucent','Transmits light but prevents a clear view through it.'],
 ['Opaque','Does not transmit appreciable light through the sample.'],['Soluble','Able to dissolve in a specified liquid.'],['Insoluble','Dissolves only negligibly in the stated conditions.'],['Mass','A physical quantity measured in grams or kilograms using a balance.'],['Volume','The space occupied by something.'],['Capacity','The volume a container can hold to a stated limit.'],['Matter','Anything that has mass and occupies space.'],['Soft','Easily scratched or indented compared with another material; state the test.'],['Solution','A uniform mixture containing a dissolved substance.']
];
export const summary=[
 'Objects can be made from one material or several. The same material can be used for many objects, and different materials can serve a similar purpose.',
 'Classification groups things using a stated rule. Colour, texture, lustre and other properties provide different possible groupings.',
 'Select a material by its purpose and conditions of use. A single property is seldom enough.',
 'Shiny does not always mean metallic. Hardness, stiffness and compressibility describe different comparisons.',
 'Transparent samples allow a clear view, translucent samples scatter light and give a hazy view, and opaque samples block a view through them.',
 'Dissolving does not destroy a substance. Solubility depends on the substance, liquid and conditions; floating or settling is not dissolving.',
 'Mass is compared using a balance. Volume is occupied space; capacity is how much a container can hold.',
 'Matter has mass and occupies space. Solids, liquids and gases, including air, are matter.'
];
export const games=[
 {id:'game1',title:'Find a companion',text:'Write these words on separate cards: iron, copper, glass, wood, plastic, bottle, solid, transparent, opaque and lustrous. Connect pairs that can have a meaningful relationship and explain each connection. There can be more than one valid link; qualify claims such as “plastic is transparent” by naming a particular sample.',source:[18]},
 {id:'game2',title:'Play Word-hub',text:'Choose nine words from lustrous, non-lustrous, soluble, insoluble, hard, soft, matter, mass, transparent, opaque, volume and translucent. Write them in a three-by-three notebook grid. A facilitator randomly reads a word or definition. Mark a matching word and explain it when asked. The first player with nine checked entries wins after the group verifies the meanings.',source:[19]}
];
export const exercises=[
 {id:'q1',text:'Observe with an adult how edible items are organised in your kitchen. Describe the present rule, suggest another useful sorting method and explain why it would help. Do not rearrange stored food without permission.',source:[19]},
 {id:'q2',text:'Unscramble each set of letters, then match the word with one of the descriptions. The rows below are not already matched.',table:{caption:'Words and descriptions',rows:[['Scrambled letters','Description choices'],['T R E M A T','Objects can be seen clearly through it'],['U L S B E L O','Has mass and occupies space'],['T N E R P A S N A R T','Shiny appearance'],['E R U S T L','Can dissolve in water']],widths:[.43,.57],note:'Write the words and matching descriptions in your notebook.'},source:[19]},
 {id:'q3',text:'Why are many storage containers transparent? Suggest one situation where an opaque container would be a better choice, and explain why.',source:[20]},
 {id:'q4',text:'Decide whether each statement is true or false for the samples described, and correct false statements. (a) A wooden board is translucent while clear window glass is opaque. (b) Clean aluminium foil is lustrous while an ordinary uncoated eraser is non-lustrous. (c) A small amount of sugar dissolves in enough water, while sawdust remains as pieces. (d) An apple is matter because it has mass but occupies no space.',source:[20]},
 {id:'q5',text:'Compare wood, iron, plastic, bamboo, concrete and stone for making a chair. Use a table with the criteria: supports a seated person without bending or shaking, easy to lift, comfortable to touch in winter, and easy to clean. Explain how thickness, joints, coatings and chair design affect your choices. Why is resistance to bending not the same as surface hardness?',source:[20]},
 {id:'q6',text:'Choose container materials for food waste, broken glass and wastepaper. For each, state the properties needed. Explain why broken glass must be handled by an adult and placed in a rigid, puncture-resistant, clearly marked container rather than a thin bag.',source:[20]},
 {id:'q7',text:'Air does not usually prevent us from seeing one another, but a wooden door does. Choose the correct pair describing air and the door: (a) transparent, opaque; (b) translucent, transparent; (c) opaque, translucent; (d) transparent, translucent. Explain your choice.',source:[20]},
 {id:'q8',text:'Sample X resists gentle pressing and dissolves in enough water. Sample Y changes shape easily when pressed and remains as a separate sample in water. Suggest possible materials, and describe X and Y using the tests performed. Do these observations uniquely identify either material? Would they alone establish scratch hardness?',source:[20,21]},
 {id:'q9',text:'Give a possible example for each clue: (a) has lustre; (b) compresses easily; (c) is hard and soluble in water; (d) lets some light through but no clear image; (e) has mass and volume but is usually invisible. Explain why some clues allow several answers. Then write a “Who am I?” riddle using enough properties to narrow the choices.',source:[21]},
 {id:'q10',text:'Consider vinegar, honey, mustard oil, water, glucose and wheat flour. Give two pairs that can form a uniform solution when mixed in suitable amounts, and two pairs that leave a separate layer or undissolved particles after standing. State the liquid and the material added in each case. Explain why a briefly cloudy mixture is not necessarily a solution.',source:[21]}
];
export const projects=[
 {id:'project1',title:'Find out what is recycled locally',text:'With an adult, consult your local collection service, a reliable local website or community information. List materials accepted for recycling, how they should be cleaned or separated, and which are not accepted. Record the source and date. A recyclable material is not necessarily collected everywhere, so distinguish material properties from local facilities.',figure:'reuse',caption:'Reusing an object and recycling its material are different ways to reduce waste.',source:[21]},
 {id:'project2',title:'Ask a recycler about sorting',text:'With an adult, interview a recycler about the properties used to sort and value old objects. Ask whether contamination, mixed materials, coatings or damage affect acceptance. Record reasons for materials they do not buy. Observe from a safe place; do not handle sharp scrap, batteries, electronic waste or unknown containers.',figure:'hardness',caption:'The material, its condition and the possibility of separating it can matter more than the object’s old use.',source:[21]},
 {id:'project3',title:'Sort a larger collection',text:'Choose 20–30 safe household objects with permission. Classify them by one property, then by another. Make a table linking Object, Material or parts, Observed properties and Use. Show where groups overlap and where more information is needed. Explain one choice of material using at least two properties.',figure:'opener',caption:'An object with several parts can belong to several material groups.',source:[21]},
 {id:'project4',title:'Make, test and improve',text:'Use clean discarded materials to make a useful object, such as a cardboard organiser. Ask an adult to do any cutting; avoid broken glass, sharp cans and containers that held chemicals. Test whether the object performs its intended task. Ask a partner for specific feedback on stability, durability and usefulness, then revise one feature and explain the improvement.',figure:'reuse',caption:'Choose materials for the task, then use a test to decide what to improve.',source:[21]}
];
