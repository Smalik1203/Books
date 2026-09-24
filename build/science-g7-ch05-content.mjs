import {applyClass7ComparisonTables} from './science-g7-comparison-tables.mjs';
// Source-page references use the supplied sixteen-page Chapter 5 PDF.
// Procedures precede outcomes; source activities retain stable editorial IDs.
export const title='Changes Around Us: Physical and Chemical';
export const shortTitle='Changes Around Us';
export const opener=[
 'An ice cube becomes a puddle. A rosebud opens. A banana develops brown spots. Are all these changes alike?',
 'Two students compare what they notice today with what they saw earlier. Even a bottle of cold water grows warmer when left in a warm room. A change may take minutes, days or much longer.',
 'In this chapter, look beyond a change in appearance. Ask what has changed, whether a new substance has formed, and what evidence would help you decide.'
];
const h=(id,text,source,level=1)=>({id,type:'heading',text,source,level});
const p=(id,text,source,extra={})=>({id,type:'body',text,source,...extra});
const panel=(id,kind,paragraphs,source,extra={})=>({id,type:'panel',kind,paragraphs,source,...extra});
const fig=(id,figure,caption,source)=>({id,type:'figure',figure,caption,source});
const diagram=(id,key,caption,source)=>({id,type:'diagram',diagram:key,caption,source});
const compare=(id,columns,source)=>({id,type:'comparison',columns,source});
const eq=(id,text,caption,source)=>({id,type:'equation',text,caption,source});
export const lesson=[
 h('notice-head','Noticing a Change',[1,2]),
 p('notice','Describe what you can observe before trying to name a change. Size, shape, colour, state and temperature can change. Sometimes a sound or an odour provides another clue. Use sight first; never taste an unknown substance, deliberately inhale fumes, or touch a hot object.',[2]),
 panel('notice-task','think',[
  'Choose three changes from the table. For each one, describe the starting material and what you would notice afterwards. Keep an observation such as “a liquid appears” separate from an explanation such as “the ice has melted”.',
  'Add one change from your surroundings. Which changes appear similar? Propose a way to group them, and explain what you still need to find out. Record your ideas in your notebook.'
 ],[2],{sourceActivity:'5.1'}),
 {id:'notice-table',type:'table',source:[2],caption:'Table 5.1  Changes to discuss and observe',widths:[.5,.5],rows:[
  ['Everyday change','What could you compare before and after?'],
  ['Melting ice; boiling water','State and temperature'],
  ['Chopping vegetables; cutting paper','Size, shape and number of pieces'],
  ['Making popcorn from corn','Size, shape and texture'],
  ['Adding beetroot extract to water','Colour and how it spreads'],
  ['Burning wood; drying wet clothes','Material remaining; water remaining'],
  ['Making dough balls; rolling chapatis','Shape, size and texture']
 ],note:'Read across for observation clues; compare down to find similarities. These are prompts, not recorded results. Discuss burning and boiling from safe adult demonstrations.'},
 p('grouping','A useful grouping answers a particular question. Grouping by speed tells us how long a change takes. Grouping by appearance tells us what we notice. Neither alone tells us whether the material itself has become a different substance.',[2]),
 h('physical-head','5.1  Appearance Changes, Substance Remains',[3]),
 p('physical-intro','A sheet can become a paper boat without ceasing to be paper. Try changes in shape and size, then ask which features remain the same. A different outline is not enough to establish that a new substance has formed.',[3]),
 panel('physical-task','setup',[
  'Use paper, a balloon, a hand pump and a small piece of chalk. Keep balloon fragments away from young children; avoid latex if anyone is allergic. Do not breathe chalk dust.',
  '1. Fold paper into a boat or another object, then unfold it. Describe the shape and any creases that remain.',
  '2. Inflate a balloon with the pump without tying it, then let the air escape. Compare the rubber before and after. The teacher may puncture a second inflated balloon with a pin away from faces; stand back and protect ears.',
  '3. The teacher gently crushes chalk inside a sealed bag. Examine the fragments through the bag. Can you restore the original chalk stick simply by collecting its pieces?',
  '4. Record separately what changed and what material remains. Compare changes you could undo with those you could not.'
 ],[3],{sourceActivity:'5.2'}),
 fig('physical-art','physical-objects','Paper, rubber and chalk can change shape or size. Examine the material as well as its outline.',[3]),
 p('physical-definition','In a **physical change**, physical properties such as shape, size or state change without a new substance being formed. Folding paper, stretching a balloon and breaking chalk are physical changes. A burst balloon and crushed chalk are difficult to restore, but that does not make these changes chemical.',[3]),
 p('water-states','Ice, liquid water and water vapour are the same substance in different states. Water vapour is invisible. The visible white mist near a kettle contains tiny liquid droplets formed as vapour cools. Observe boiling water only from a safe distance with an adult.',[3,10],{addition:'Clarifies invisible vapour versus visible condensed droplets.'}),
 h('chemical-head','5.2  Evidence of a New Substance',[4,5]),
 p('chemical-intro','Bubbles can appear when air passes through a liquid, even if no new gas is made. To investigate further, compare what happens in two different liquids. Describe each observation before deciding what it means.',[4]),
 panel('exhaled-task','setup',[
  'Teacher-led comparison; wear goggles. Keep alkaline lime water away from skin, eyes and mouths. Never suck liquid through a straw.',
  '1. Put equal small volumes of tap water in A and fresh clear lime water in B. Record their appearance; retain untouched samples for comparison.',
  '2. The teacher collects exhaled air in a clean bag and delivers equal volumes through separate tubes using a needle-free syringe. No mouth touches the liquids or tubes.',
  '3. Record bubbles, cloudiness and any deposit after standing. If little changes, record that and ask the teacher to check the lime water and gas delivery.'
 ],[4],{sourceActivity:'5.3',diagram:'exhaled',diagramCaption:'The teacher delivers collected exhaled air through separate tubes. The diagram shows the setup before observation.'}),
 p('chemical-evidence','Typically, tap water shows bubbles but remains clear. Lime water becomes cloudy as a fine white solid forms; some may settle. The difference matters: the bubbles alone are not the evidence for a new solid. Compare the liquids after the bubbles have stopped.',[4]),
 p('chemical-definition','A **chemical change** forms one or more new substances through a **chemical reaction**. Carbon dioxide in exhaled air reacts with calcium hydroxide in lime water. It forms calcium carbonate, a white solid that is insoluble in water, and water. The suspended solid makes the mixture look milky.',[4,5]),
 eq('lime-equation','Calcium hydroxide + Carbon dioxide → Calcium carbonate + Water','A word equation names the starting substances and the products. The arrow means “reacts to form”.',[5]),
 p('lime-limit','Turning fresh lime water milky is a useful test for carbon dioxide in these experiments. Use a small amount of gas and observe promptly: passing excess carbon dioxide can eventually clear the cloudiness through a further reaction. A test must be read under its stated conditions.',[5],{addition:'Prevents a clear result after excess carbon dioxide being treated as proof of absence.'}),
 h('kitchen-head','A Gas from Kitchen Materials',[5],2),
 panel('vinegar-task','setup',[
  'Teacher-led; wear goggles. Never taste mixtures or block the gas outlet.',
  '1. Add a pinch of baking soda to a teaspoon of vinegar or lemon juice. Record sounds and visible changes.',
  '2. The teacher passes the gas into fresh lime water. Record any change or uncertainty.',
  '3. Compare with the same amount of baking soda stirred into water. The teacher lifts the delivery tube from the lime water before disconnecting to prevent backflow.'
 ],[5],{sourceActivity:'5.4',diagram:'gas-test',diagramCaption:'Supported test tubes or small bottles may be used; the receiver stays open.'}),
 p('gas-explanation','Vinegar and baking soda usually produce a fizzing sound and many bubbles. The gas turns fresh lime water milky, supporting its identification as carbon dioxide. Formation of this new substance is evidence of a chemical change. Lemon juice also reacts with baking soda to release carbon dioxide.',[5]),
 eq('vinegar-equation','Vinegar + Baking soda → Carbon dioxide + Other substances','Baking soda is sodium hydrogen carbonate. This simplified word equation focuses on the gas being tested.',[5]),
 p('dissolving','Baking soda stirred into water normally dissolves without the sustained fizzing seen with vinegar. We treat this dissolving as a physical change at this level: the substance spreads through the water. A few trapped-air bubbles during stirring do not establish a chemical reaction.',[5]),
 panel('evidence-pause','think',[
  'One student says, “Any bubbles prove a chemical change.” Another says, “If a liquid changes colour, it must be a chemical change.” Use blowing air through water and adding beetroot extract to water to examine these claims.',
  'What extra evidence did the lime-water test provide? Explain why you should combine observations with knowledge of the materials instead of using one visible sign as an infallible rule.'
 ],[2,4,5],{addition:'Focused enrichment: distinguishes indicators from proof.'}),
 h('process-head','5.3  Rusting and Combustion',[6,7,8]),
 h('rust-head','Rusting: a slow reaction',[6],2),
 p('rust','Recall the iron nails studied in the previous chapter. In the presence of water and oxygen, iron forms reddish-brown rust. Rust contains hydrated iron oxides and has different properties from iron. This is a chemical change, not simply a layer of soil or a change in the nail’s shape.',[6]),
 p('rust-time','Compare a protected iron surface with an exposed one over several days. Rust can weaken an object as more iron reacts. Painting or another suitable protective coating reduces contact with air and moisture. Its usefulness depends on keeping that barrier intact.',[6],{addition:'Connects the mechanism to the preceding chapter and a practical use.'}),
 h('combustion-head','Combustion: reacting with oxygen',[6],2),
 p('magnesium','In the earlier teacher demonstration, magnesium ribbon burned with a bright light and formed a white powder, magnesium oxide. A new substance was formed, while energy was released as heat and light. Recall the evidence; do not repeat the burning yourself or look directly at burning magnesium.',[6]),
 eq('magnesium-equation','Magnesium + Oxygen → Magnesium oxide','Energy is released as heat and light. Magnesium oxide is a new substance; light is not a material product.',[6]),
 p('combustion','**Combustion** is a chemical reaction with oxygen that releases energy as heat, often with light. Wood, paper, cotton and kerosene are **combustible** materials: they can serve as fuels. Not every chemical change is combustion, and not every combustion process has a visible flame.',[6]),
 panel('candle-air-task','setup',[
  'Teacher demonstration only. Use two identical short candles fixed upright on non-flammable dishes, a heat-resistant jar, a heatproof surface and a means of extinguishing the flames. Keep hair, clothing and paper away.',
  '1. The teacher lights both candles. Watch from the agreed distance and describe the flames before either is covered.',
  '2. The teacher places the jar over one candle while leaving the other uncovered. Compare what happens over the same observation period.',
  '3. Record how long each flame remains visible. Do not touch the jar or wax: both may stay hot after the flame is out. The teacher extinguishes the remaining candle and allows everything to cool.'
 ],[6,7],{sourceActivity:'5.5',figure:'candles',figureCaption:'Equipment before the teacher lights the candles. Only one candle will be covered.'}),
 p('oxygen-evidence','The uncovered candle can continue burning because fresh air reaches it. The covered flame usually goes out after a short time. Oxygen in the enclosed air falls to a level that no longer supports the flame; this does not mean that every bit of oxygen has been used up.',[7]),
 p('oxygen-product','A separate teacher-controlled test of the cooled collected gas with fresh lime water can show carbon dioxide among the products. The milkiness tests for carbon dioxide, not for oxygen. The covered-candle comparison supports the importance of an air supply; knowledge from other experiments identifies oxygen as the part needed for burning.',[7],{addition:'Corrects the source’s inference that a carbon dioxide test itself confirms oxygen.'}),
 h('fire-safety-head','Using this idea safely',[7],2),
 p('fire-safety','If your clothes catch fire, stop, drop to the ground and roll to smother the flames, covering your face with your hands. Shout for help. An adult may use a suitable fire blanket; synthetic cloth can melt and must not be used. Never practise with real flames. For a fire nearby, move to safety and alert an adult.',[7],{correction:'Adds current stop-drop-roll advice; preserves smothering and synthetic-cloth warning.'}),
 {id:'firefly-note',type:'illustrated-note',source:[7],heading:'Light from a living organism',text:'Chemical reactions inside fireflies produce light. This is called **bioluminescence**. It produces very little heat compared with an ordinary flame. A glowing firefly is not burning like a candle. Watch living insects without catching or disturbing them.',figure:'firefly',caption:'A firefly: chemical energy can produce light without a flame.'},
 h('ignition-head','Why does paper not burn in ordinary air?',[7,8],2),
 p('ignition-question','Paper is a fuel and air contains oxygen, yet a book does not burst into flame on a desk. Something more is needed. Compare heating by a lighted match with heating by concentrated sunlight. In both cases, energy reaches the paper. Use pieces from the same sheet: differences in thickness or dampness could affect how quickly they heat. A failed attempt to ignite one piece does not prove that paper is not combustible.',[7,8],{addition:'Makes the comparison conditions and limits of a negative result explicit.'}),
 panel('heat-task','setup',[
  'Teacher demonstration only, or use an approved video. Use tiny paper pieces on a non-flammable tray in a cleared area, with water ready and observers well back.',
  '1. The teacher holds paper with tongs and brings a lighted match near it. Record the change; let the remains cool.',
  '2. If school rules and conditions permit, the teacher focuses sunlight onto another piece. Never look through the lens or towards the Sun, or aim light at eyes, skin or dry vegetation.',
  '3. Record heating, darkening, smoke or flame, including no ignition. The teacher extinguishes and checks all remains. Never try fire-making on your own.'
 ],[8],{sourceActivity:'5.6',diagram:'focused-light',diagramCaption:'Parallel rays can be concentrated by a lens. This is a model of the teacher’s setup, not a student fire-making task.'}),
 p('ignition','Focused sunlight transfers energy to a small area, raising its temperature. Under suitable conditions, paper can reach its **ignition temperature**, the minimum temperature at which it catches fire under those conditions. A hot match can provide the needed heating more quickly. A pre-existing flame is not the only possible heat source.',[8]),
 diagram('triangle-diagram','fire-triangle','The fire triangle groups three requirements for sustained burning. Removing one can stop combustion.',[8]),
 p('triangle-use','The fuel must be combustible, oxygen must be available, and the fuel must be hot enough. Covering a small flame with suitable equipment restricts fresh air. Cooling removes heat. Keeping spare fuel away prevents a fire spreading. Choosing how to control a real fire is a job for trained adults.',[8]),
 h('both-head','5.4  Two Kinds of Change Together',[8,9]),
 panel('candle-think','think',[
  'Picture the teacher’s burning candle. One learner notices wax melting. Another notices liquid moving up the wick. A third says wax vapour burns; a fourth watches spilled wax become solid again.',
  'Discuss these four observations with a partner. Which describe changes of state or movement? Which suggest new substances? Can all four belong to one process? Explain your reasoning before reading on.'
 ],[9],{sourceActivity:'5.7'}),
 diagram('wax-diagram','wax-path','The wick supplies fuel to the flame. The arrows trace a sequence; they do not show the movement of heat.',[9]),
 compare('wax-comparison',[
  {title:'Physical changes',items:['Wax melts, travels up the wick and vaporises.','Wax that cools can solidify again.']},
  {title:'Chemical change',items:['Wax vapour reacts with oxygen, forming carbon dioxide and water.','Released heat melts and vaporises more wax.']}
 ],[9]),
 p('wax-explanation','The wick draws liquid wax through its tiny spaces. Vapour near the flame is the main fuel. Melting, solidifying and vaporising do not create new substances; burning the vapour does. One process includes both kinds of change.',[9]),
 h('faraday-head','Faraday’s candle',[9],2),
 p('faraday','Michael Faraday explored melting, vaporisation and combustion in his lectures, *The Chemical History of a Candle*, published in 1861. He showed how studying an ordinary object carefully can open up scientific questions.',[9]),
 h('reverse-head','5.5  Can a Change Be Reversed?',[10]),
 panel('reverse-task','think',[
  'Return to the changes in Table 5.1 and add folding paper and bursting a balloon. For each, decide whether you could recover the original material, the original shape, both, or neither using ordinary methods.',
  'Explain the method you have in mind. If you are uncertain, state what information is missing. Compare your reasoning with a partner before using the sample records below.'
 ],[10],{sourceActivity:'5.8'}),
 p('recover-material','Consider sugar dissolved in water. The sugar has not vanished simply because its crystals are no longer visible. If water evaporates under suitable conditions, sugar can be recovered, although the crystals need not have their original shapes or sizes. Recovering both sugar and water would require collecting and condensing the water vapour as well. That is a different aim from recovering only the sugar.',[10],{addition:'Focused enrichment supporting the source assessment on dissolving sugar and boiling water.'}),
 p('recover-object','Now compare a shirt stitched from cloth with wheat ground into flour. Removing stitches may recover pieces of cloth, but needle holes or cuts may remain. Collecting flour does not reconstruct the original grains. In each case, explain what “getting it back” means before choosing a category. An answer that states its assumptions is more informative than a yes or no alone.',[10,13],{addition:'Clarifies original material versus original object, supporting source question 2.'}),
 {id:'reverse-table',type:'table',source:[10],caption:'Table 5.2  Sample records: state your conditions',widths:[.28,.27,.45],rows:[
  ['Change','Undo it?','Conditions'],
  ['Melting ice','Yes, by cooling','Freeze it in a mould.'],
  ['Chopping vegetables','Not to its old form','Pieces cannot rejoin as an intact vegetable.'],
  ['Boiling water','Collect vapour','Cool captured vapour to water.'],
  ['Making popcorn','Not ordinarily','No intact kernel returns.']
 ],note:'Read across for conditions. Compare down: what is recovered, and how?'},
 p('reverse-meaning','A **reversible change** can be undone under suitable conditions; an **irreversible change** cannot be undone by ordinary methods. Tearing paper and crushing chalk are physical changes that do not easily restore the objects. Many chemical changes are difficult to reverse too. Reversibility and new-substance formation are separate questions.',[3,10]),
 h('desirable-head','5.6  Useful Here, Unwanted There',[10,11]),
 compare('desirable-comparison',[
  {title:'A useful change',items:['Milk becoming curd when we want curd.','Fruit ripening before it is eaten.','Vegetable scraps decomposing in a compost heap.']},
  {title:'An unwanted change',items:['Milk spoiling during storage.','Food decaying before it is eaten.','Iron rusting in a cycle or a bridge.']}
 ],[10,11]),
 p('context','Cutting fruit and cooking food can make them useful for a meal. Whether a change is desirable depends on its purpose and circumstances. “Useful” does not tell us whether a change is physical or chemical.',[10,11]),
 p('compost-pause','A family cools food to slow spoilage but encourages scraps to decompose into compost. Are these aims contradictory? Explain how purpose and location change what is desirable. Suggest an observation that would help judge each aim.',[11],{addition:'Focused enrichment: purpose and evidence in a familiar context.'}),
 p('environment','Burning fossil fuels for transport adds carbon dioxide to the atmosphere. Some paints release volatile substances while drying, affecting air quality. Follow adult guidance about ventilation and disposal, and avoid unnecessary fuel use or waste.',[11]),
 h('natural-head','5.7  Slow Changes in the Landscape',[11,12]),
 h('weathering-head','Weathering: change in place',[11],2),
 p('weathering','Loose stones, sand and soil can collect below rocky slopes. **Weathering** means physical breakdown or chemical alteration of rock at or near the surface. It changes rock in place, before material is carried away.',[11]),
 fig('weathering-art','weathering','Roots can widen cracks. Iron-bearing rock can also develop a reddish weathered surface through chemical reactions.',[11]),
 compare('weathering-comparison',[
  {title:'Physical weathering',items:['Growing roots widen cracks.','Repeated temperature changes can stress rock.','Water freezing in cracks can prise pieces apart.']},
  {title:'Chemical weathering',items:['Water and dissolved substances react with minerals.','Mineral composition changes as new substances form.','Iron-bearing minerals may produce red-brown iron oxides.']}
 ],[11]),
 p('basalt','In dark basalt, iron-bearing minerals can react with oxygen and water, producing reddish iron oxides. Physical and chemical weathering often work together to help soil form.',[11]),
 h('erosion-head','Erosion: material moves',[12],2),
 p('erosion','**Erosion** removes and transports weathered material. Flowing water, wind, ice and gravity can move particles. During transport, pieces may collide and become smaller or smoother. A landslide moves rock and soil downslope under gravity; do not approach an unstable slope to observe it.',[12]),
 diagram('landscape-diagram','landscape','Weathering, transport and deposition are connected processes. This diagram is a model, not a map to scale.',[11,12]),
 p('deposition','When water or wind loses enough energy, carried material settles: **deposition**. Coarser particles often settle first. Over long periods, buried sediments may be compacted and cemented into sedimentary rock; this is not instantaneous.',[12]),
 p('landscape-time','Many landscape changes take thousands of years or longer, although a landslide can move material rapidly. The sequence above connects changes at a cliff, along a river and on a lake bed.',[11,12]),
 p('landscape-evidence','A rounded pebble is evidence of wear, but its shape alone does not reveal the whole journey. Compare its surface with a freshly broken fragment of the same rock. To investigate a reddish coating, ask what minerals are present and whether they have reacted; colour alone is insufficient. Photographs taken from the same safe viewpoint over time can reveal movement of material without disturbing a slope.',[11,12],{addition:'Focused enrichment connecting landscape observations with the chapter’s evidence standard.'}),
 p('closing','Return to the opening scene. Melting ice and warming water remain water. A growing rose and a ripening banana involve many processes, including chemical reactions. Identify the process and support your classification with evidence.',[1,12])
];
export const glossary=[
 ['Physical change','A change of a physical property without forming a new substance.'],
 ['Chemical change','A change in which one or more new substances form.'],
 ['Chemical reaction','The process that changes starting substances into products.'],
 ['Combustion','Reaction with oxygen that releases heat, often with light.'],
 ['Ignition temperature','The minimum temperature for a substance to catch fire under given conditions.'],
 ['Reversible change','A change that can be undone under suitable conditions.'],
 ['Irreversible change','A change not undone by the ordinary methods being considered.'],
 ['Weathering','Physical breakdown or chemical alteration of rock in place.'],
 ['Erosion','Removal and transport of rock, soil or other particles.'],
 ['Deposition','Settling of material carried by water, wind or another transporting agent.']
];
export const summary=[
 'In a physical change, shape, size or state may change, but no new substance is formed.',
 'A chemical change forms new substances through a reaction. A word equation names the starting substances and the products.',
 'Bubbles, a colour change or a temperature change can be clues. Interpret them using comparisons and suitable tests; no single clue is an infallible rule.',
 'Fresh lime water turning milky provides evidence for carbon dioxide in the experiments studied here.',
 'Rusting, cooking and burning magnesium involve chemical changes. Combustion releases heat, often with light.',
 'A fuel, oxygen and enough heat to reach ignition temperature are needed for burning to start and continue under suitable conditions.',
 'A burning candle includes physical changes of wax and a chemical reaction of wax vapour with oxygen.',
 'Reversible and irreversible describe whether a change can be undone under stated conditions. They are not synonyms for physical and chemical.',
 'A desirable change is useful in a particular situation. The same process can be unwanted elsewhere.',
 'Weathering includes physical and chemical changes. Erosion transports material, and deposition occurs when it settles.',
 'Observe safely, record actual results and explain uncertainty. Heating, lime-water tests and gas-transfer equipment belong under teacher control.'
];
export const exercises=[
 {id:'q1',source:[13],text:'Which pair describes a physical change? (i) The state may or may not change. (ii) A substance with different properties is formed. (iii) No new substance is formed. (iv) A chemical reaction occurs. Choose: (a) i and ii; (b) ii and iii; (c) i and iii; (d) iii and iv. Explain your choice.'},
 {id:'q2',source:[13],text:'Predict whether each change can be reversed by ordinary methods. State your conditions and any uncertainty: (i) stitching cloth into a shirt; (ii) twisting a straight string; (iii) making idlis from batter; (iv) dissolving sugar in water; (v) drawing water from a well; (vi) ripening fruit; (vii) boiling water in an open pan; (viii) rolling up a mat; (ix) grinding wheat into flour; (x) forming soil from rocks.'},
 {id:'q3',source:[13],text:'State True or False and correct each false statement: (i) Melting wax helps supply fuel to a burning candle. (ii) Collecting water vapour by condensation is a chemical change. (iii) Converting leaves into compost involves chemical changes. (iv) Mixing baking soda with lemon juice produces a chemical change.'},
 {id:'q4',source:[14],text:'Complete these statements in your notebook. (i) Nalini’s iron cycle handle develops brown deposits called [name]; this is a [type] change. (ii) Folding a handkerchief is a [type] change that can be [undone or not undone]. (iii) A reaction with oxygen that releases heat is called [name] and is a [type] change. (iv) Burning magnesium forms [substance]; with water this gives a [acidic/basic/neutral] mixture. Burning magnesium is a [type] change.'},
 {id:'q5',source:[14],text:'Are water freezing into ice and liquid water becoming water vapour physical or chemical changes? Explain using the identity of the substance. Why should visible mist not be confused with invisible water vapour?'},
 {id:'q6',source:[14],text:'Is milk turning into curd a physical or chemical change? Justify your answer. Explain why saying only “it looks different” is not enough.'},
 {id:'q7',source:[14],text:'Wind, rain, temperature changes and other natural factors help form soil from rock. Explain how both physical and chemical changes can be involved. Distinguish weathering from the transport of the resulting particles.'},
 {id:'q8',source:[14],text:'Read “Eco-friendly Prithvi” and give it your own title. Prithvi chops vegetables, peels potatoes and cuts fruit. He gathers seeds and peelings in a clay pot. Bacteria and fungi decompose suitable scraps into compost. He plants some seeds, waters them and watches seedlings grow and later flower. Identify physical changes, chemical changes, and stages involving both. Gathering objects in a pot does not itself prove that a reaction has occurred.'},
 {id:'q9',source:[14,15],text:'Draw two overlapping circles in your notebook. Mark physical changes only as A, chemical changes only as B, and a process containing both as C. Place these examples: burning a candle; tearing paper; rusting; curdling milk; ripening fruit; melting ice; folding clothes; burning magnesium; mixing baking soda with vinegar. Explain any classification that depends on which part of the process you consider.'},
 {id:'q10',source:[15],text:'Four teacher-prepared setups pass any gas produced into fresh lime water. Predict which receivers will become milky and explain why. The starting mixtures are (a) vinegar and baking soda; (b) lemon juice and vinegar; (c) vinegar and common salt; (d) lemon juice and baking soda. Assume clean apparatus and working delivery tubes; explain how a leak would affect your conclusion.',diagram:'four-tests',caption:'Each receiver contains fresh lime water and is open to the air. Predict first; this is not an instruction to mix household products on your own.'}
];
export const projects=[
 {id:'project-ink',source:[15],title:'A message that appears on warming',text:'Write a short message with lemon juice on plain paper and let it dry. Ask an adult to reveal it using a gently warm iron over a protective sheet on a heatproof surface. The adult handles the iron throughout and stops if the paper scorches; do not hold paper over a flame. Compare drying with the later browning. Which changes could be reversed, by what method, and what evidence supports your answer?'},
 {id:'project-slopes',source:[15],title:'Protecting a slope',text:'Use reliable reports or speak with a geography teacher about landslides and rock erosion. Discuss how vegetation, drainage, construction choices and avoiding disturbance of unstable slopes can affect risk. Explain why no single measure prevents every landslide. Use photographs or published maps; do not visit a hazardous slope. Present two locally relevant precautions and name your sources.'},
 {id:'project-kitchen',source:[15],title:'A kitchen change diary',text:'With an adult, observe three ordinary kitchen activities from a safe distance. Record the material before and after, whether a new substance seems to form, and whether the change can be reversed under stated conditions. Include at least one change of shape and one involving heating. Do not taste experimental mixtures or handle a knife or hot vessel for this task.'},
 {id:'project-yeast',source:[16],title:'What makes bread dough rise?',text:'With your teacher, dissolve two teaspoons of sugar in a little lukewarm water in a small bottle. Add a spoonful of fresh yeast and fit a balloon. Compare with a matching bottle without yeast after about an hour. Do not use hot water or rigid caps. Record balloon expansion. The teacher tests collected gas with fresh lime water using tubing; do not shake or suck lime water. Explain each observation and any uncertainty. Identify physical and chemical changes, then connect gas production with bubbles in bread dough.',figure:'yeast',caption:'Equipment before mixing. A comparison without yeast helps test what causes any change.'},
 {id:'project-chameleon',source:[16],title:'A reversible colour change?',text:'Research chameleon colour changes using your school library or a reliable scientific source. Colour can relate to communication, temperature and camouflage, not deliberate matching to every background. Can the change reverse? Why does colour alone not prove a new substance formed? Identify the species and evidence. Use images or video; never stress an animal.',figure:'chameleon',caption:'A chameleon’s colour has several functions. Research the mechanism rather than classifying it from appearance alone.'}
];

applyClass7ComparisonTables(lesson,5);
