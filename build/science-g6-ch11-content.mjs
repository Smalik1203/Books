export const title='Nature’s Treasures';
export const shortTitle=title;
export const opener=[
 'A stream, a handful of soil, a breath of air: how many treasures do we use without buying them?',
 'Bhoomi and Surya are visiting Ajji, their grandmother, near the forests of the Western Ghats. They notice birds among the trees, water flowing over rocks and leaves moving in the breeze. Ajji invites them to look for the connections among these things.',
 'Their breakfast, the house around them and the energy used for cooking all depend on materials or energy from nature. Some resources are replenished by natural processes. Others form so slowly that using them reduces a stock we cannot quickly replace.',
 'Follow the children’s questions from the forest to the classroom. Observe what people use, trace where it comes from, and look for ways to reduce waste while meeting everyone’s needs.'
];
const h=(id,text,source)=>({id,type:'heading',text,source});
const b=(id,text,source)=>({id,type:'body',text,source,keepWhole:true});
const task=(id,sourceActivity,paragraphs,source,extra={})=>({id,type:'panel',kind:'setup',sourceActivity,paragraphs,source,...extra});
const table=(id,caption,rows,widths,source,note='')=>({id,type:'table',caption,rows,widths,source,note});
const side=(id,figure,figureHeight,paragraphs,caption,source)=>({id,type:'illustrated-prose',figure,figureHeight,paragraphs,caption,source});
export const lesson=[
 h('air-heading','11.1 The Air Around Us',[2,3]),
 b('resources','Materials and sources of energy obtained from nature are **natural resources**. Air, water, sunlight, forests, soil, rocks and minerals are examples. A notebook is manufactured, but its paper, ink and the energy used to make it depend on natural resources.',[1,2,18]),
 task('breathing-task','11.1',[
  '1. Sit comfortably and breathe normally. Without changing your breathing, notice the gentle movement of your chest or abdomen as air enters and leaves.',
  '2. Watch leaves or a light paper strip move in a breeze. What observations suggest that air is present even when you cannot see it?',
  '3. Record what you observed and what you inferred. Do not hold your breath, breathe rapidly or compete to change your breathing. Share observations without comparing classmates’ bodies.'
 ],[2]),
 b('air-mixture','Air is a **mixture of gases**. Our bodies use oxygen from air to release energy from food. Many other living organisms also depend on oxygen. Nitrogen is the largest part of dry air; oxygen is the next largest. Small amounts of other gases are present too.',[2,3]),
 {id:'air-grid',type:'diagram',diagram:'air',caption:'Fig. 11.1 · Each square represents about 1 part in 100 by volume of dry air.',source:[3]},
 b('air-percent','A percentage means parts in every hundred. The diagram rounds dry air to 78% nitrogen, 21% oxygen and 1% other gases. The last group includes argon and carbon dioxide; it is not 1% carbon dioxide. Water vapour is also present in ordinary air, in an amount that varies with place and weather.',[3]),
 {...h('wind-heading','Moving Air Can Do Work',[3,4]),level:2},
 b('wind','Moving air is called **wind**. A fluttering flag or swaying branch gives evidence of its movement. Wind can exert a force on a surface. Can you use that force to turn an object?', [3,4]),
 task('pinwheel-task','11.2',[
  '1. Take a square of paper about 15 cm on each side. Mark its diagonals. With adult help, cut inward from each corner, stopping well before the centre.',
  '2. Bring alternate corner tips towards the centre. Ask an adult to fasten them loosely to a stick with a pin, leaving room to turn and covering the sharp point securely.',
  '3. Hold the handle still. Compare still air with a gentle breeze made by fanning a card. Do not run with the pinwheel or blow towards anyone’s face.',
  '4. Change its direction relative to the airflow. Record when it turns and when it does not. Which observation supports the idea that moving air exerts a force?'
 ],[4],{figure:'pinwheel',figureHeight:225,figureCaption:'Fig. 11.2 · Paper stages and an assembled pinwheel, or firki.'}),
 b('wind-energy','Air pushes on the angled paper surfaces and can make the pinwheel rotate. Windmills use moving air to turn blades and a shaft. The shaft may drive a pump or a mill; in a wind turbine, a generator converts the motion into electrical energy. The device transfers energy rather than creating it.',[4]),
 b('wind-farms','Groups of wind turbines form wind farms. India has wind farms in several states, including Tamil Nadu, Rajasthan and Maharashtra. Their output changes with wind conditions. A good site needs suitable winds as well as careful attention to people, wildlife and the land.',[4]),
 h('water-heading','11.2 Water: Available and Usable',[5,6]),
 b('water-uses','Think of drinking, preparing food, washing, growing crops and making goods. Each use depends on water. About 71% of Earth’s surface is covered by water, but most of this is salty ocean water. A large surface area of water does not mean a large supply of fresh water ready to use.',[5]),
 b('freshwater','Fresh water occurs in ice, underground, and in rivers and lakes. Much of it is frozen or difficult to reach. Supplies vary with rainfall, season and place. Removing salts from seawater is possible, but it requires equipment and energy. Water quality must suit the use: fresh water is not automatically safe to drink.',[5]),
 task('water-task','11.3',[
  '1. Observe water use at home or school with an adult’s permission. Use the seven situations below as a checklist. Do not waste water deliberately to make a measurement.',
  '2. In your notebook, record the activity, any avoidable loss you actually observed, and a practical change. Write “no avoidable loss observed” when that is your finding.',
  '3. Choose one agreed change, such as closing a tap while brushing. Compare observations before and after over similar periods. Keep necessary drinking, cooking and handwashing.',
  '4. Explain what your comparison can show. If the number of people or the activity changed, record that too.'
 ],[6]),
 table('water-checklist','Table 11.1 · Where could water be used more carefully?',[
  ['Observe','Look for avoidable loss','Possible change to discuss'],
  ['Washing hands','Tap left running after use','Close it properly; retain thorough washing'],
  ['Washing clothes','Unnecessary repeated washing','Use suitable loads and the needed water'],
  ['Washing utensils','Running water throughout','Soak or scrub before a careful rinse'],
  ['Bathing or showering','Long periods of unused flow','Shorten unused flow; keep good hygiene'],
  ['Cooking','More wash water than needed','Use a suitable amount for the task'],
  ['Gardening','Water spilling away from roots','Water where plants need it'],
  ['Brushing teeth','Tap running while brushing','Turn it off between uses']
 ],[.22,.35,.43],[6],'These are possibilities to check, not results to copy. Report leaks to an adult.'),
 b('water-results','A tap left open wastes water only if the flowing water is not needed for the task. A leaking tap can lose water even when nobody is using it. Repairs, suitable equipment and changed habits can all help. Reuse water only for an appropriate purpose approved by an adult; cleaning chemicals can make reuse unsuitable.',[6]),
 b('pollution','Litter, untreated sewage and some industrial wastes can pollute water. Clear water may still contain harmful microbes or dissolved substances. Keeping waste out protects people and other organisms; simply moving pollution downstream does not solve the problem.',[7]),
 {id:'harvest-art',type:'figure',figure:'rain',figureHeight:340,caption:'Fig. 11.3 · Cutaway view of covered storage. The overflow carries water away when the tank fills.',source:[7]},
 b('harvesting','**Rainwater harvesting** collects and stores rainwater, or helps it enter suitable ground for later use. Rooftop systems need maintained gutters, an inlet that limits debris, covered storage and a safe overflow. Collected water is not automatically drinking water. Adults must arrange any treatment needed for its intended use.',[7]),
 b('traditional','Communities have long built tanks, ponds and stepwells to manage water. Stepwells are known by regional names such as bawadi and vav; Toorji ka Jhalra in Jodhpur is one example. Ask how a local structure receives, stores or gives access to water. Designs differ; do not assume every stepwell is fed by a nearby river. Never enter tanks or climb onto roofs for an investigation.',[7]),
 h('sun-heading','11.3 Energy from the Sun',[8,9,10]),
 b('sun-start','Ajji spreads washed clothes and chillies out to dry. Sunlight can warm them and their surroundings, helping water evaporate. Moving air also helps carry water vapour away. Which conditions would you keep the same to compare drying in sun and shade fairly?', [8]),
 b('sun-food','The Sun supplies much of the energy driving processes at Earth’s surface. Green plants use light energy to make food by photosynthesis. When a cow eats grass, it obtains stored chemical energy from that food. This is different from sunlight warming the cow’s body.',[8,9]),
 {id:'solar-art',type:'figure',figure:'solar',figureHeight:275,caption:'Fig. 11.4 · A photovoltaic panel (left) and a solar water heater (right) use sunlight differently.',source:[9,10]},
 table('solar-table','Table 11.2 · Using sunlight',[
  ['Device','Useful energy transfer','A condition or limit'],
  ['Photovoltaic panel','Light to electrical energy','Output depends on available light; none at night'],
  ['Solar water heater','Sunlight warms water','Performance depends on conditions and design'],
  ['Solar cooker','Sunlight heats food and the pot','Needs suitable sunlight; cooking can be slow']
 ],[.26,.37,.37],[9,10],'A photovoltaic panel and a solar water heater are not the same device.'),
 b('clouds','Clouds reduce the sunlight reaching a panel; they do not make the Sun disappear. Some diffuse daylight may still generate electricity, at reduced output. A battery can supply previously stored energy, but only until its usable stored energy runs out. A solar device alone is not a promise of continuous supply.',[10]),
 {id:'sun-think',type:'panel',kind:'think',paragraphs:['A family says, “Our lamp uses sunlight even after sunset.” What equipment could make this possible? What information would you need before predicting whether it could keep the lamp lit through several cloudy days?'],source:[10]},
 h('forest-heading','11.4 Forests Are Living Systems',[10,11,12]),
 b('forest-start','Near Ajji’s home, the children find an amla tree, called nellikai locally. Its fruit can feed animals as well as people. They leave fallen fruit where it is and collect nothing without permission. Looking closely can reveal birds, insects, fungi and small plants as well as tall trees.',[10,11]),
 side('forest-art','forest',385,[
  'A **forest** includes many interacting living things and their physical surroundings. It supplies habitats, food and materials such as timber, fibres, fruits and other plant products. Name five forest products and identify the plant or material from which each comes.',
  'Roots help hold soil. Leaf litter slows some surface runoff and shelters organisms. Decomposers break down dead material, returning nutrients to the environment. Nutrients are reused; energy flows through the system.'
 ],'Fig. 11.5 · Roots, litter, fungi and animals are parts of the forest system.',[11,12]),
 b('forest-loss','Clearing a forest removes more than a collection of trunks. It can disrupt habitats, expose soil and affect water movement. A planted row of trees does not immediately replace an established forest with its many species and relationships. Recovery may take a long time and depends on local conditions.',[11,12]),
 b('forest-care','People have worked together to protect forests. In the Chipko movement of the 1970s in the Himalayan region, villagers, including many women, resisted tree felling. Forest care can also include preventing damage, supporting regeneration and using wood carefully. Planting must suit the local habitat; every open area is not a place that needs trees.',[12]),
 b('forest-action','A school tree-planting programme, including one during Van Mahotsav, needs a plan for what happens after planting. Choose suitable species with local guidance, obtain permission, and arrange watering and protection. Check survival and growth later. Counting planted saplings alone does not show that a forest has been restored.',[12]),
 h('soil-heading','11.5 Soil, Rocks and Minerals',[12,13]),
 b('soil-start','Bhoomi notices that soil beside the stream looks different from soil near the path. Soil contains mineral particles, organic material, living organisms, air and water. Roots and many small organisms use spaces in it. Can colour and texture help us describe samples without telling us everything about them?', [12,13]),
 task('soil-task','11.4',[
  '1. Let your teacher provide small soil samples from approved, safe places. Avoid roadside, waste-dump or industrial soil. Use a spoon and do not taste or deliberately smell the samples.',
  '2. Before looking closely, predict how the samples may differ. Examine each without a lens, then with a magnifying glass. Keep the lens away from direct sunlight.',
  '3. Record four headings in your notebook: sample location, prediction, observation without lens, observation with lens. Describe colour, visible pieces and clumps without assuming what each is.',
  '4. Compare the samples and revise your predictions. Leave organisms in their habitat, return samples only as the teacher directs, and wash your hands afterwards.'
 ],[13],{figure:'soil',figureHeight:195,figureCaption:'Fig. 11.6 · Small samples and a lens help compare visible features.'}),
 b('soil-evidence','A lens may reveal grains or plant fragments that were hard to see before. A darker sample is not automatically more fertile, and a dry surface does not show all the water deeper down. Further tests would be needed to compare water retention or how well a plant grows in each soil.',[13,14]),
 b('soil-formation','Weathering breaks down rocks and changes their minerals. Remains of organisms add organic material as they decompose. These processes, together with living organisms, air and water, help form soil. Useful topsoil usually develops far more slowly than it can be removed by erosion, so it cannot be readily replaced within a human lifetime.',[13,14]),
 {id:'rocks-art',type:'figure',figure:'rocks',figureHeight:205,caption:'Fig. 11.7 · From left: slate, laterite, granite, sandstone and marble specimens.',source:[14]},
 table('rocks-table','Table 11.3 · Choosing earth materials for different uses',[
  ['Material','A useful property','A familiar use'],
  ['Slate','Can split into thin sheets','Roofing or writing slates'],
  ['Laterite','Some deposits can be cut into blocks','Building blocks where suitable'],
  ['Granite','Hard, durable rock','Building stone and work surfaces'],
  ['Sandstone','Can be cut and shaped','Building stone and carving'],
  ['Marble','Can take a smooth polish','Flooring and sculpture'],
  ['Clay-rich material','Can be shaped when moist','Pottery and fired bricks']
 ],[.23,.38,.39],[14],'Materials vary. Suitability must be checked for the particular job.'),
 b('minerals','Rocks contain minerals. A **mineral** is a naturally occurring solid with a characteristic composition and structure. Some minerals contain metals that can be extracted; an ore is material worth processing to obtain a useful substance. A metal spoon has therefore passed through several human processes after its raw material was obtained from Earth.',[14,15]),
 b('rock-time','Early tools used suitably shaped stone; modern objects still depend on rocks and minerals. Their extraction changes land and uses energy. Not every rock takes millions of years to form, but useful mineral deposits are not replenished on the timescale on which we mine them. Repair, reuse and recycling reduce the need for new extraction.',[14,15]),
 h('fuel-heading','11.6 Fuels from the Distant Past',[15,16]),
 task('transport-task','11.5',[
  '1. With an adult, list familiar forms of transport. Observe only from a safe place away from moving vehicles. Do not approach fuel tanks or filling equipment.',
  '2. Make a table with columns for vehicle, fuel or energy source, and how you checked. Ask a known adult or use reliable vehicle information; appearance alone may not identify the fuel.',
  '3. Include a bicycle or walking journey and an electric vehicle if these are familiar. Record “not known” when you cannot verify an answer.',
  '4. Group the verified examples. Which rely on fuels made from petroleum? Which use electricity? What must you find out to trace the source of that electricity?'
 ],[15]),
 b('fossil-origin','Petrol and diesel are made by refining **petroleum**, also called crude oil. Coal, petroleum and natural gas are **fossil fuels**. They formed from ancient organic matter that was buried and transformed over geological time. Coal formed mainly from ancient plant material; much petroleum formed from tiny organisms living in ancient seas.',[15,16]),
 b('fossil-time','Burial, heat, pressure and time contributed to these changes over millions of years. A tank can be emptied in days, while the fuel it contained cannot be replaced on that timescale. Finding another deposit increases the stock people know about; it does not make fossil fuels renewable.',[16]),
 table('fuel-table','Table 11.4 · Fossil fuels and some uses',[
  ['Fuel or product','Where it comes from','Examples of use'],
  ['Coal','Ancient organic matter, mainly plants','Heat and electricity generation'],
  ['Petrol, diesel, kerosene','Refining petroleum','Transport and other energy uses'],
  ['Natural gas','Underground deposits; mainly methane','Cooking, heating and electricity'],
  ['CNG','Natural gas compressed for storage','Fuel in suitably designed vehicles'],
  ['LPG','Processing petroleum or natural gas','Fuel in suitable cooking appliances']
 ],[.27,.36,.37],[15,16,17],'CNG and LPG are different fuels. Compressing or processing a fuel does not renew its source.'),
 b('fuel-effects','Burning fossil fuels releases carbon dioxide and may release harmful air pollutants. Natural gas can produce less carbon dioxide than coal for the same energy released, but it still produces carbon dioxide. Leaked methane also affects climate. “Cleaner” does not mean “without any environmental impact”.',[17]),
 b('cooking-effects','Smoke from burning wood, dung or coal can harm health, especially indoors. Gas appliances also need safe installation and ventilation. Students should not operate or test stoves, cylinders or fuels in this chapter. Compare information and observations made safely with an adult.',[17]),
 b('transport-care','Walking or cycling on a safe route, sharing a journey and using suitable public transport can reduce fuel use. Battery-electric vehicles have no exhaust emissions at the vehicle, but producing their electricity and materials still has environmental effects. Ask where energy comes from before comparing choices.',[17,19]),
 h('renew-heading','11.7 Renewable Does Not Mean Endless',[17,18]),
 table('renew-table','Table 11.5 · How quickly is a resource replaced?',[
  ['Resource','Replenishment','Why careful use still matters'],
  ['Sunlight and wind','Continuing natural energy flows','Availability changes with time and weather'],
  ['Water','Circulates through the water cycle','Local supplies can be depleted or polluted'],
  ['Forests','Can regenerate under suitable conditions','Loss may be faster than recovery'],
  ['Fossil fuels','Form over geological time','Stocks fall as they are extracted and used'],
  ['Mineral deposits','Not replaced on human-use timescales','Reuse and recycling reduce new mining'],
  ['Soil','Generally develops slowly','Rapid erosion can remove a long-built layer']
 ],[.23,.37,.40],[17,18],'Soil is effectively non-renewable on human timescales; water and forests need protection to remain usable.'),
 b('renew-explain','A **renewable resource** can be replenished by natural processes on a useful human timescale, provided its use and condition allow this. A **non-renewable resource** is not replaced on that timescale. Neither label tells us that extraction or use has no costs. Recycling a metal conserves a stock; it does not make its mineral deposit renewable.',[18]),
 {id:'renew-think',type:'panel',kind:'think',paragraphs:['A town pumps underground water faster than local rain can replace it. Someone says, “Water is renewable, so the supply cannot run out.” Use the water cycle and the idea of a local supply to explain what is missing from this claim.'],source:[18]},
 h('daily-heading','11.8 Trace a Resource, Reduce Waste',[18,19]),
 task('daily-task','11.6',[
  '1. List these activities in your notebook: washing clothes, making clay toys, collecting firewood, flying a kite and preparing breakfast. Treat firewood collection as a discussion, not a task to carry out.',
  '2. For each, name a resource used directly. Then trace one less obvious resource: for example, making a kite needs paper, and making paper requires raw material, water and energy.',
  '3. Choose one activity and suggest a change that avoids waste without reducing essential needs. Explain who would need to agree or help.',
  '4. Decide what evidence would show improvement. Record a starting observation, try the agreed change, and compare again under similar conditions.'
 ],[19]),
 b('daily-evidence','A useful plan links an action to a result that can be checked. “Save nature” is too broad to measure by itself. “Report the leaking tap, have an adult repair it, and check whether it still drips” names a problem, an action and evidence. Looking clean or smelling fresh alone cannot establish that air or water is safe.',[19]),
 b('shared','Ajji’s treasures connect. Trees depend on soil, water and air; people depend on those resources too. Responsible use means meeting needs, reducing avoidable waste and considering effects on others. Before choosing an action, ask: what resource is involved, how is it replenished, and what evidence will show that our action helped?', [19,20])
];
export const glossary=[
 ['Natural resource','Material or energy source obtained from nature.'],
 ['Air','The mixture of gases surrounding Earth.'],
 ['Wind','Air moving from place to place.'],
 ['Fresh water','Water containing relatively little dissolved salt.'],
 ['Rainwater harvesting','Collecting rainwater for storage or suitable recharge.'],
 ['Solar energy','Energy received from the Sun.'],
 ['Forest','Trees and other organisms interacting with their surroundings.'],
 ['Decomposer','An organism that breaks down dead organic material.'],
 ['Soil','Mineral and organic material with organisms, air and water.'],
 ['Weathering','Breakdown and alteration of rock at or near Earth’s surface.'],
 ['Mineral','A natural solid with characteristic composition and structure.'],
 ['Fossil fuel','Fuel formed from ancient organic matter over geological time.'],
 ['Petroleum','Crude oil, processed to obtain petrol and other products.'],
 ['Renewable resource','A resource naturally replenished on a useful human timescale.'],
 ['Non-renewable resource','A resource not replaced on the timescale of human use.'],
 ['Conservation','Careful protection and use of resources to reduce loss.']
];
export const summary=[
 'Natural resources include air, water, sunlight, forests, soil, rocks and minerals. Manufactured objects depend on them too.',
 'Dry air is about 78% nitrogen and 21% oxygen by volume. Ordinary air also contains a variable amount of water vapour.',
 'Moving air can turn blades, operate pumps or drive generators. Available wind energy changes with conditions.',
 'Most Earth water is salty. Fresh water may be inaccessible or unsafe; reducing waste and pollution protects usable supplies.',
 'Rainwater harvesting can store water or support suitable recharge. Storage and water quality need adult management.',
 'Sunlight provides energy for photosynthesis, heating and solar devices. Photovoltaic panels produce electricity.',
 'Forests supply habitats and materials and help protect soil. Restoring a forest involves more than planting trees.',
 'Soil develops through slow interacting processes. Rocks and minerals supply materials that should be used carefully.',
 'Coal, petroleum and natural gas are non-renewable fuels. Their formation is far slower than our use of them.',
 'Renewable does not mean unlimited. Trace a resource, propose a realistic action and check whether it reduces waste.'
];
export const games=[];
export const exercises=[
 {id:'q1',text:'Unscramble these resource names: ocrk, refost, ndiw, atwre. Classify each as renewable or non-renewable on human timescales. For each renewable example, explain one reason why its usable supply still needs care.',source:[21]},
 {id:'q2',text:'State whether each statement is true or false, and correct the false ones: (a) Nature supplies resources used to meet human needs. (b) Machines are natural resources. (c) Fossil natural gas is non-renewable. (d) Calling air renewable means that clean air cannot be damaged by pollution.',source:[21]},
 {id:'q3',text:'Choose and explain: (a) Which fuel is commonly used in a petrol-engine scooter: kerosene, petrol, diesel or LPG? (b) Which is renewed through a natural cycle on human timescales: coal, water, fossil natural gas or petrol? Explain why your second answer does not mean an unlimited local supply.',source:[22]},
 {id:'q4',text:'Make a two-column table headed Renewable and Non-renewable. Place coal, fossil natural gas, forests and mineral deposits in it. Add a note explaining the condition under which forests can regenerate.',source:[22]},
 {id:'q5',text:'Why is petroleum called non-renewable? Compare the timescale of its formation with the timescale on which a vehicle uses fuel. Does discovering a new oil deposit change your answer?',source:[22]},
 {id:'q6',text:'Explain why regrowing a forest is harder than planting a row of trees. Include living organisms, soil and time in your answer.',source:[22]},
 {id:'q7',text:'List five daily activities that use natural resources. For each, name the resource and suggest one way to reduce avoidable use or waste. Keep essential needs such as drinking and hygiene.',source:[22]},
 {id:'q8',text:'Describe four activities or processes that depend on air. Distinguish examples needing moving air from examples depending on a gas within air.',source:[22]},
 {id:'q9',text:'Prepare a plan to care for greenery in your locality. Include permission, suitable sites and species, care of existing plants and how you would check survival. Explain why planting trees everywhere would not be a sensible rule.',source:[22]},
 {id:'q10',text:'The illustrated cooker heats a pot using a reflective dish. (a) What source of energy does it use? (b) Give one benefit and one limitation. (c) Why should children avoid touching the pot or looking at concentrated reflected light?',figure:'cooker',figureHeight:280,layout:'side',caption:'Fig. 11.8 · A solar cooker directs sunlight towards a cooking pot.',source:[22]},
 {id:'q11',text:'How can large-scale tree removal affect soil? Explain two links among roots, leaf litter, rainfall, erosion and soil organisms.',source:[22]},
 {id:'q12',text:'Explain two ways human activities pollute air. Suggest one practical action to reduce a source of pollution, and describe what evidence could help evaluate it.',source:[22]},
 {id:'q13',text:'A family uses photovoltaic panels for electricity, a gas stove for cooking and a windmill to pump water. A cloudy week brings much less sunlight. Predict how each service might be affected. State what you need to know about stored electricity, gas supply and wind before making a definite prediction.',source:[23]},
 {id:'q14',text:'Complete the resource tree in your notebook using these seven terms: fossil fuels, forests, air, petroleum, coal, water, non-renewable resources. Letters show the spaces to fill; each term is used once. The tree shows selected examples, not every resource.',diagram:'resources',caption:'Fig. 11.9 · Complete the named groups and examples.',source:[23]},
 {id:'q15',text:'Trees are cut to meet demands for housing and industry. Write a short report considering these needs alongside habitat, soil and water protection. Discuss reducing waste, reusing materials, appropriate alternatives and protecting existing forests; explain your recommendations.',source:[23]},
 {id:'q16',text:'Propose a school water-saving plan. Name the problem, people who can help, steps to take and how you would compare water use before and after. Explain how it could help the environment while preserving drinking water and hygiene.',source:[23]}
];
export const projects=[
 {id:'project-water',title:'1. Learn from local water systems',text:'Find out about a traditional rainwater-harvesting system in your state or elsewhere in India. Use a reliable source or an adult-led conversation with someone who knows the system. Draw its water route, name its intended uses and describe maintenance. Separate what you observed from what you were told. Do not enter wells or tanks, or climb onto roofs.',source:[23]},
 {id:'project-air',title:'2. Investigate an air-quality concern',text:'With permission, talk to older people about changes they have noticed in local air and possible sources of pollution. Record observations respectfully, without names or private medical details. Compare the accounts with reliable public information on air pollution. An interview alone cannot prove what caused an illness. Suggest two practical actions and explain which source each addresses.',source:[24]},
 {id:'project-rocks',title:'3. Trace materials in your surroundings',text:'Look for uses of rock or mineral-derived materials in buildings, utensils and other familiar objects. Make a table of object, material, useful property and source of your identification. Ask a knowledgeable adult to check uncertain names. Use photographs, drawings or supplied specimens; do not enter quarries, damage structures or take samples from protected places.',source:[24]},
 {id:'project-club',title:'4. Turn a planting day into a care plan',text:'With a teacher or eco-club, choose a suitable planting or plant-care project. Obtain permission and local advice on species and habitat. Record plant names, why they suit the site, who will water them and how they will be protected. Prepare a one-page report, then revisit at agreed intervals to record survival and growth. Discuss what needs changing if plants do not thrive.',source:[24]}
];
