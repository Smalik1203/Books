// Edit the recovered reading groups before layout; keep a verifiable change ledger.
import fs from 'node:fs/promises';
export async function reviseFood(groups){
 const ledger=[];
 const set=(i,text)=>{const g=groups[i];if(!g||typeof g.text!=='string')throw Error('Missing food text '+i);ledger.push({group:i,before:g.text,after:text});g.text=text;};
 for(const i of [10,133,186,190]){groups[i].kind='text';delete groups[i].caption;}
 const nutrition=groups[101].rows;
 nutrition[0][4].text='Possible signs; not a diagnosis';
 nutrition[2][1].text='Helps release energy from food and supports nerve function';
 nutrition[3][1].text='Needed to make collagen for connective tissues and wound healing';
 nutrition[4][2].text='Skin makes it in sunlight; oily fish, egg yolk, fortified milk';
 nutrition[5][2].text='Milk, curd, cheese, paneer; calcium-fortified soya milk';
 nutrition[5][3].text='Poor bone mineralisation';
 nutrition[5][4].text='Low intake over time can weaken bones; tooth decay has other causes';
 nutrition[6][1].text='Needed to make thyroid hormones, supporting growth and development';
 nutrition[6][2].text='Iodised salt, seafood, dairy and eggs; amounts vary';nutrition[6][2].images=[];nutrition[6][0].images=[];
 nutrition[7][1].text='Part of haemoglobin, which carries oxygen in blood';
 nutrition[7][2].text='Pulses, leafy greens, meat and iron-fortified foods; absorption varies';nutrition[7][2].images=[];nutrition[7][0].images=[];
 groups[101].caption='Fig. 3.5 — Nutrient functions and possible deficiency signs; symptoms alone do not diagnose a deficiency';
 set(2,'Aarav looks around the room: the lunches differ. Which ingredients do they share, and what does the body obtain from them?');
 set(13,'Your diaries may share ingredients, but check rather than assume this. A food absent from four diaries may appear in another household. Four diaries cannot represent the whole class or region.');
 set(17,'A traveller eating in Amritsar, Bengaluru and Imphal could find different dishes and shared ingredients. A regional label does not describe every household. Compare examples before generalising.');
 set(23,'The examples link wheat with Punjabi dishes, ragi with dishes in Karnataka, and rice with dishes in Manipur. Is the same relationship present in your other rows? Look for an exception as well.');
 set(24,'Local crops can influence food traditions, but proximity alone does not guarantee the cheapest or freshest food. Transport, storage, season and farming costs also matter.');
 set(25,'Soil, rainfall and temperature affect which crops grow well. Rice is often grown in flooded fields, though not all rice requires standing water. Ragi can tolerate relatively dry conditions. Farmers can also change irrigation and soil management.');
 set(27,'Regional food reflects crops, trade, cost, taste, culture and tradition. A crops-and-dishes table suggests relationships; it does not isolate a single cause.');
 set(28,'Choose a dish common in your state. Is it also eaten across the border? Check with two sources before explaining any difference using crops, trade or tradition.');
 set(30,'Food varies across the map. Does it also vary across the years? Interview an older person about dishes, fuel and cooking tools. Record continuity as well as change; one memory cannot represent every household.');
 set(36,'A chulha burns fuel such as wood or dung cakes; a gas stove burns gas. A sil-batta grinds food by hand; a mixer-grinder uses an electric motor. These tools coexist today. Your interviews can show which changes occurred in particular homes and when.');
 set(40,'Television, phones and the internet can spread recipes beyond a region. To test a claim about how quickly one dish spread, we would need dated evidence from several places.');
 set(42,'Changes can also reduce the use of familiar grains or cooking skills. Whether a replacement is more nourishing depends on its ingredients, preparation and quantity. Compare examples rather than assuming that older or newer food is better.');
 set(45,'Aarav misses breakfast and feels hungry during class. Ira shares a banana at break. Later he says he feels better.');
 set(46,'Does that observation prove what caused the change? Rest, water and other factors may matter too. We need knowledge of digestion to explain what food can supply; this story is not a blood-sugar test.');
 set(49,'Begin with carbohydrates, one group of food components.');
 set(51,'Glucose is a simple sugar and a carbohydrate. Cells can release energy from glucose. Starch is also a carbohydrate; digestion breaks it down into smaller sugars before absorption. Foods supply mixtures, so a banana is not a dose of pure glucose.');
 set(55,'Ghee and cooking oils contain fats. Fat supplies about twice as much energy per gram as carbohydrate. The body can use fat for energy or store it; it does not automatically store all dietary fat. Stored fat also cushions organs and reduces heat loss. These functions do not establish a special need for laddoos in winter.');
 set(61,'Stored fat in a polar bear: pregnant females can spend months in a den without feeding, drawing on stored reserves while giving birth and nursing cubs. Most other polar bears remain active and hunt through winter. Fat also provides insulation.');
 set(64,'Carbohydrates and fats supply energy, and fats also form parts of cells. Proteins have an essential role in building and repairing tissues. These job labels overlap; they are not exclusive compartments.');
 set(68,'Pulses, soya beans, nuts and seeds supply protein. Milk, curd, paneer, eggs, fish and meat are other sources. Compare amounts as well as presence: fresh mushrooms contain protein but are mostly water and supply less per usual serving than pulses.');
 set(74,'Mushrooms belong to the fungi, not the plants. They obtain nutrients from organic matter rather than making sugars by photosynthesis. Fresh edible mushrooms contain water, fibre and nutrients, but are not interchangeable with pulses as a protein source. Never taste a wild mushroom to identify it.');
 set(81,'In May 1747, James Lind compared six treatments among twelve sailors with scurvy, two sailors per treatment. The pair receiving oranges and lemons improved most rapidly.');
 set(85,'The comparison supplied evidence favouring citrus fruit over the other treatments tested. It did not identify Vitamin C, and two sailors per treatment is a small sample. More observations and later research were needed to establish the cause.');
 set(92,'Iodine deficiency can enlarge the thyroid gland, causing goitre. Diets relying on crops from iodine-poor soil can contribute. But a neck swelling can have other causes: symptoms alone do not diagnose a nutrient deficiency.');
 set(93,'Iodised salt is a way to supply a small, controlled amount of iodine through a widely used ingredient. This does not mean eating extra salt; it means using iodised salt within the usual limited amount.');
 set(97,'In the Little Rann of Kutch, Agariya salt workers pump underground brine into evaporation pans. Water evaporates and salt crystallises. This example connects a food ingredient to separation by evaporation and to the people who produce it.');
 set(104,'A **nutrient** is a substance the body needs for energy, growth, repair or normal functioning. Carbohydrates, fats, proteins, vitamins and minerals are nutrient groups; water is an essential nutrient too.');
 set(105,'The labels energy-giving, body-building and protective highlight important functions, but the jobs overlap. Proteins can supply energy, fats form parts of cells, and vitamins and minerals support many processes.');
 set(106,'Vitamins and minerals help body processes work normally. Calling them protective does not mean that eating one food prevents every disease or treats every symptom.');
 set(115,'Two further components to consider are dietary fibre and water. Water is an essential nutrient even though it supplies no energy.');
 set(116,'Dietary fibre, or roughage, comes mainly from plant foods such as whole grains, pulses, fruit and vegetables. Our own digestive enzymes do not break it down, although gut microbes can break down some fibre. Fibre helps bowel function; constipation can have several causes.');
 set(117,'Water dissolves and transports substances, helps remove waste in urine and helps regulate temperature through sweating and evaporation. Needs vary with activity and weather. Water is a nutrient, not a source of food energy.');
 set(121,'To study diets in India, researchers needed reliable measurements of the foods people ate, along with records of amounts and preparation. A foreign food table could not represent every local ingredient or recipe.');
 set(124,'The national school nutrition programme began in 1995 and developed into the cooked school-meal programme now called PM POSHAN. Nutrition research helped shape school feeding policy. A programme date alone does not prove its effects: those require measurements of children and meals.');
 set(127,'In your notebook, compare two possible lunches using the food groups in this chapter. State what information about portion size and ingredients you would need before comparing nutrient amounts or cost.');
 set(130,'Before each test, record what you expect and why. This is a prediction. Keep it beside the observation even if they disagree. Both matching and unexpected results matter; neither alone proves a complete explanation.');
 set(135,'Read across each row. Which samples gave positive results in more than one test? A food may contain several nutrients. A negative result can mean too little to detect, a preparation problem or a failed reagent: compare with your controls before concluding absence.');
 set(143,'For these example labels, chana has more protein and fibre and less fat per 100 g. That supports a comparison on those measures, not a universal ranking of foods. Portion size, ingredients and the rest of the diet also matter. Foods high in free sugars, salt or unhealthy fats can displace needed nutrients when eaten frequently.');
 set(148,'Compare the grains by named nutrients and growing conditions. A single label such as healthy cannot replace those comparisons.');
 set(150,'Many millets tolerate relatively dry conditions and can need less irrigation than flooded rice. Water use still depends on crop, yield, climate and farming practice. Compare like growing conditions before making a numerical claim.');
 set(151,'Millets can add variety and nutrients and can suit dry regions. This does not make every millet superior to every rice dish on every measure.');
 set(159,'Food miles is the distance food travels from producer to consumer. A shorter journey may reduce transport, but total cost, freshness and emissions also depend on farming, storage, transport method and waste. Distance alone cannot establish the best choice.');
 set(173,'• Carbohydrates, fats, proteins, vitamins and minerals are nutrient groups studied here. Water is also an essential nutrient. Food supplies dietary fibre as well.');
 set(176,'• Lack of a nutrient can cause a deficiency disorder. Symptoms can also have other causes, so medical assessment matters. Examples include Vitamin C deficiency causing scurvy and iodine deficiency contributing to goitre.');
 set(177,'• Dietary fibre resists digestion by our own enzymes; gut microbes can break down some of it. Fibre helps bowel function. Water transports dissolved substances and helps regulate body temperature.');
 set(181,'• Food miles measures distance, not total environmental impact. Transport method, farming and storage also matter. Wasted food wastes resources used to produce it.');
 set(184,'2. For each condition below, name a deficiency that could contribute and a relevant food source. Explain why symptoms alone cannot diagnose it: bleeding gums; poor vision in dim light; soft bones; neck swelling; weakness.');
 set(192,'7. Ira records few vegetables, fruits or whole grains in her diary and has difficulty passing stool. Which food component might be low? Suggest sources and state why the diary cannot establish the medical cause of her symptoms.');
 set(198,'13. Explain how iodine-poor soil could contribute to iodine deficiency in a local diet. How does iodised salt help prevent it? Why should a person with neck swelling seek medical assessment rather than diagnose themselves?');
 set(202,'16. A teacher provides known iodine solution, starch paste and water. Design positive and negative controls for a starch test. What would a failed positive control mean for a negative food result? Never test or taste an unlabelled chemical.');
 set(204,'18. Lind compared six treatments in 1747, with two sailors per treatment. What does this comparison support? What does it not establish? Explain how a larger, repeated comparison would strengthen the evidence.');
 for(const g of groups){if(g.text)g.text=g.text.replace('water, which are essential but are not nutrients','water, which are essential').replace('roughage supplies no nutrients','roughage resists digestion by our own enzymes');}
 const survey=groups[100];ledger.push({group:100,before:survey.items});survey.title='Read fictional evidence';survey.kind='prompt';survey.text='Consider fictional cases. A reports bleeding gums and eats few fruits or vegetables. B reports the same symptom but eats a varied diet. Give one nutritional explanation for A. Does B rule out every nutritional cause? What information would a clinician need? Explain why a symptom and a food diary cannot establish a diagnosis.';delete survey.items;
 // Results follow the work, never inside a procedure or its side illustration.
 for(const i of [131,132,134]){
  const g=groups[i],resultIndex=g.items.findIndex(t=>/^(A blue-black|An oily patch|A violet colour)/.test(t));
  if(resultIndex<0)throw Error('Missing nutrient-test result '+i);
  const removed=g.items.splice(resultIndex);ledger.push({group:i,before:removed,reason:'Move interpretation after observations'});
  const control=i===131?'Use starch paste as a positive control and water as a negative control.':i===132?'Use cooking oil as a positive control and water as a negative control.':'The teacher should include egg white as a positive control and water as a negative control.';
  g.items.splice(1,0,control+' Keep sample amounts and waiting times alike. Record observations before interpreting them.');
  const result=i===131?'Iodine forms a blue-black complex with starch. Compare with the starch control: a matching change supports starch being present. A negative result cannot establish absence if the control failed.':i===132?'Oil leaves paper translucent after water has evaporated. A persistent patch matching the oil control supports fat being present. A faint or absent patch can also depend on sample amount and transfer to the paper.':'In alkaline solution, copper ions form a violet complex with peptide bonds in proteins. Compare with the positive control before interpreting the food sample. A negative result has limits, including concentration and reagent performance.';
  g.after=[{kind:'prompt',source:g.source,text:'Compare each sample with both controls. What changed? Did the controls behave as expected? What would you repeat before concluding absence?'},{kind:'text',source:g.source,feature:'explain',text:result}];
  if(g.figure){g.after.push({kind:'images',source:g.source,images:g.figure.images||[],caption:g.figure.caption||'',height:g.figure.height||200});delete g.figure;}
 }
 for(const i of [23,27,85,135,159])groups[i].feature='reason';
 for(const i of [25,51,55,67,92])groups[i].feature='explain';
 await fs.writeFile('assets/design-history/ch03-editorial-changes.json',JSON.stringify(ledger,null,2));
 groups[138].items=['Return to your week-long food diary.','1. Identify foods that could supply each nutrient group, including water. A diary alone cannot measure nutrient amounts.','2. Compare the variety across days. Which groups have few recorded sources?','3. Suggest two locally available foods that would add variety. Explain what information about portions you would need before judging adequacy.'];
 for(const g of groups){if(g.text)g.text=g.text.replaceAll('your Table 3.1 diary','your food diary').replaceAll('Table 3.3','your notebook results table');if(g.items)g.items=g.items.map(t=>t.replaceAll('Activity 3.5','the iodine investigation').replaceAll('Table 3.3','the results-table headings given below').replaceAll('your data will be wrong, and wrong data is worse than no data','you may forget or misremember items; mark any uncertain entries'));}
 return groups.flatMap((g,i)=>{if([15,20,126,154,166,167].includes(i))return [];const after=g.after||[];delete g.after;return[g,...after];});
}
