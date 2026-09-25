// Explicit, reviewable changes on top of the immutable page transcription.
// Every replacement carries its original IDs into the editorial ledger.
import {fatSourceFigure} from './science-g6-food-fat-figure.mjs';
import {readFileSync} from 'node:fs';
export function editClass6(ch) {
 const ledger=[];
 const replace=(ids,items,reason)=>{
  const first=ch.blocks.findIndex(b=>b.id===ids[0]);
  const originals=ch.blocks.filter(b=>ids.includes(b.id));
  if(originals.length!==ids.length)throw Error('Missing editorial source '+ids);
  const source=[...new Set(originals.map(b=>b.source))].join(',');
  items.forEach((b,i)=>Object.assign(b,{id:ids[0]+'-r'+i,source,sourceIds:ids,bridge:originals[0].bridge}));
  ch.blocks=ch.blocks.filter(b=>!ids.includes(b.id));ch.blocks.splice(first,0,...items);
  ledger.push({sourceIds:ids,resultIds:items.map(b=>b.id),reason});
 };
 const n=ch.config.number;
 if(n==='10'){
  const opener=ch.blocks.find(b=>b.id==='g6-10-001');
  opener.art[0]={kind:'image',src:'../../figures/class-6/living-world/opener-illustration.png',alt:'Painted garden with a bean plant, seedling, snail, butterfly, stone, soil and a puddle',w:874,h:490};
  ledger.push({sourceIds:[opener.id],resultIds:[opener.id],reason:'Use a foreground painted PNG with genuine transparency in the same opener treatment as the completed chapters; retain the full opening observation and caption.'});
  const original=JSON.parse(readFileSync('assets/design-history/science-g6-modern/source-pages.json','utf8')).find(c=>c.config.number==='10');
  for(const [source,start,titleId] of [['p106.html',326,325],['p107.html',334,333],['p108.html',344,343]]){
   const html=original.pages.find(p=>p.file===source).html;
   const title=html.match(/<div class="c-practice__head">[\s\S]*?<\/svg>(.*?)<\/div>/)[1];
   replace([`g6-10-${titleId}`],[{type:'heading',level:3,html:title}],
    'Restore the original exercise-set title as a heading, rather than scaling its decorative icon into a figure.');
   const questions=[...html.matchAll(/<ol class="c-questions"[^>]*>\s*<li><p>([\s\S]*?)<\/p><ol[^>]*>([\s\S]*?)<\/ol><\/li>/g)];
   if(questions.length!==6)throw Error('Expected six original questions in '+source);
   questions.forEach((q,i)=>replace([`g6-10-${start+i}`],[{type:'question',number:i+1,html:q[1],options:[...q[2].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x=>x[1])}],
    'Recover the original question and four distinct A–D options, continuing numbering within each set; keep the complete question on one page.'));
  }
  for(const start of [271,281,290,300,310]){
   const ids=Array.from({length:4},(_,i)=>`g6-10-${start+i}`);
   replace(ids,[{type:'options',items:ids.map(id=>ch.blocks.find(b=>b.id===id).html.replace(/^\d+\.\s*/,''))}],
    'Restore lettered options to match the explained answer key, preserving each option verbatim.');
   const question=ch.blocks.find(b=>b.id===`g6-10-${start-1}`);question.keepNext=true;
  }
  for(const [first,last] of [[269,277],[279,287],[288,296],[298,306],[308,316]]){
   const ids=ch.blocks.filter(b=>{const match=b.id.match(/^g6-10-(\d+)/);return match&&+match[1]>=first&&+match[1]<=last;}).map(b=>b.id);
   replace(ids,[{type:'lesson-group',blocks:ch.blocks.filter(b=>ids.includes(b.id))}],
    'Keep each worked multiple-choice question, options and complete explanation together as one open teaching unit.');
  }
  for(const b of ch.blocks){
   if(b.type==='figure'&&b.caption)b.caption=b.caption.replace(/<\/strong>(?=\S)/g,'</strong> ');
  }
  const decoration=ch.blocks.find(b=>b.id==='g6-10-245');
  decoration.art[0].w=150;decoration.art[0].h=150;
  ledger.push({sourceIds:[decoration.id],resultIds:[decoration.id],reason:'Restore the closing leaf as a small line-art accent using its original class, rather than an enlarged black silhouette.'});
  const observation=ch.blocks.find(b=>b.id==='g6-10-114');
  observation.caption='Copy these headings into your notebook; enter your own daily observations.';
  observation.rows=observation.rows.slice(0,1);
  ledger.push({sourceIds:[observation.id],resultIds:[observation.id],reason:'Keep all six recording headings; remove placeholder writing lines that overflowed the table. Recording belongs in the notebook.'});
  const portrait=structuredClone(ch.blocks.find(b=>b.id==='g6-10-133'));
  portrait.art[0]={kind:'image',src:'../../figures/class-6/living-world/bose-illustration.png',alt:'Painted portrait of Jagadish Chandra Bose',w:226,h:300};
  portrait.caption+=' · illustrated portrait';
  replace(['g6-10-133','g6-10-134','g6-10-135'],[{type:'media',figure:portrait,blocks:ch.blocks.filter(b=>['g6-10-134','g6-10-135'].includes(b.id))}],
   'Set the painted transparent portrait beside the complete scientist explanation. Retain the historical source attribution in the credits.');
  const credit=ch.blocks.find(b=>b.id==='g6-10-399');credit.html+=' Reference for the painted portrait, generated with OpenAI image generation on 23 September 2026.';
  // The source transcription joined captions without their original line break.
  for(const b of ch.blocks)if(b.type==='figure'&&b.caption)b.caption=b.caption.replace(/(<\/strong>)\s*/g,'$1 ');
  // A stage opener must introduce an actual task on its page, not just a direction.
  for(const id of ['g6-10-268','g6-10-324','g6-10-352'])ch.blocks.find(b=>b.id===id).keepNext=true;
  const ratios=JSON.parse(readFileSync('assets/design-history/science-g6-modern/ch10-living-world/image-metrics.json','utf8'));
  for(const ids of [['g6-10-087','g6-10-088'],['g6-10-136','g6-10-137']]){
   const figures=ids.map(id=>structuredClone(ch.blocks.find(b=>b.id===id)));
   for(const f of figures)for(const a of f.art){const r=ratios[a.src];if(r){a.w=300*r.width/r.height;a.h=300;}}
   replace(ids,[{type:'figure-pair',figures}],
    'Keep the related specimen photographs side by side with separate captions and original image proportions. Remove empty image-canvas width; do not crop or enlarge specimens.');
  }
  const sample=structuredClone(ch.blocks.find(b=>b.id==='g6-10-204'));
  const cut=sample.blocks[1].html.indexOf('. ')+1;
  const introduction=sample.blocks[1].html.slice(0,cut);
  sample.blocks[1].html=sample.blocks[1].html.slice(cut).trim();
  replace(['g6-10-204'],[{type:'paragraph',html:introduction,keepNext:true},sample],
   'Place the invented observation record between the investigation and reasoning panels, retaining every sentence and keeping the reasoning panel whole.');
  function notebookTables(b){
   if(b.type==='table'){
    const old=b.rows.length;b.rows=b.rows.filter((r,i)=>i===0||!r.every(c=>/^[\s_]*$/.test(c.html)));
    if(old!==b.rows.length){b.caption=b.caption||'Record these observations in your notebook.';ledger.push({sourceIds:[b.id||'nested observation table'],reason:'Remove empty writing lines; preserve the observation headings and use the learner’s notebook.'});}
   }
   for(const x of b.blocks||[])notebookTables(x);
  }
  ch.blocks.forEach(notebookTables);
  for(const id of ['g6-10-379','g6-10-411']){
   const b=ch.blocks.find(b=>b.id===id);b.html='Earlier artwork record: '+b.html;
  }
  ch.blocks.find(b=>b.id==='g6-10-411').html+=' The current garden opener is a painted transparent illustration generated on 23 September 2026, replacing the earlier photorealistic scene.';
 }
 const compare=(ids,labels,caption)=>replace(ids,[{type:'table',caption,
  rows:[labels.map(html=>({html})),ids.map(id=>({html:ch.blocks.find(b=>b.id===id).html}))]}],
  'Present the existing differentiated descriptions in parallel table columns; preserve all wording and adjacent shared qualifications.');
 if(n==='1'){
  const story=ch.blocks.find(b=>b.id==='g6-1-046');
  replace([story.id],[{type:'heading',level:2,html:'1.3 Asking and Testing Questions'},...story.blocks],
   'The clock case is an extended worked explanation, not one short thinking pause. Set it as open teaching prose; retain every paragraph and its illustration. Restore the missing 1.3 section number.');
 }
 if(n==='3'){
  const protein=ch.blocks.find(b=>b.id==='g6-3-155');
  const precautions=protein.blocks[0];
  replace([protein.id],[{...precautions,type:'paragraph'}, {...protein,blocks:protein.blocks.slice(1)}],
   'Keep teacher precautions immediately before the complete Activity; retain every safety instruction at body size.');
  const recap=[
   'Regional foods reflect crops, soil, climate, culture, religion and taste. Technology, transport and communication change cooking practices, bringing benefits and losses.',
   'Carbohydrates, fats, proteins, vitamins, minerals and water are nutrients. Food also supplies dietary fibre.',
   'Carbohydrates and fats supply energy. Fat stores energy and provides more per gram; proteins build and repair tissues. Needs vary with growth and activity.',
   'Deficiencies can cause disorders: vitamin C deficiency causes scurvy; iodine deficiency can cause goitre. Similar symptoms have other causes; seek medical assessment.',
   'Our enzymes do not digest fibre, though gut microbes break down some. Fibre supports bowel function; water transports substances and regulates temperature.',
   'Positive tests: starch turns blue-black with iodine; fat leaves a translucent paper patch; protein turns violet with copper sulfate and caustic soda.',
   'Most foods contain several nutrients. A balanced diet meets individual needs, with enough fibre and water; age, sex, activity and health matter.',
   'Frequent sugary or fatty snacks can displace needed nutrients. Millets supply carbohydrate, fibre and minerals; many tolerate relatively dry conditions.',
   'Food miles records distance, not total environmental impact. Farming, transport and storage also matter. Wasting food wastes these resources.'
  ];
  replace(Array.from({length:11},(_,i)=>`g6-3-${195+i}`),recap.map(html=>({type:'paragraph',html:'• '+html})),
   'Consolidate the recap without losing its scientific relationships, safety qualifications or food-system concepts; replace the tiny stock food thumbnail with a full figure area.');
  const bearExplanation=structuredClone(ch.blocks.find(b=>b.id==='g6-3-062'));
  replace(['g6-3-061','g6-3-062'],[fatSourceFigure(),{
   type:'media',keepNext:true,blocks:[bearExplanation],figure:{type:'figure',
    art:[{kind:'image',src:'../../figures/reference/food/p009-polar-bear.png',alt:'Polar bear resting on snow',w:306,h:235}],
    caption:'Fat stores energy and insulates.'}
  }],'Separate the polar bear from the food-source figure and keep it with its complete existing explanation. Compact the food rows, identify plant and animal sources, and attach each caption to its own illustration. Preserve all food labels and original image assets.');
  const proteinFigure=structuredClone(ch.blocks.find(b=>b.id==='g6-3-072'));
  for(const a of proteinFigure.art){
   a.h-=32;
   a.svg=a.svg.replace(/viewBox="([^"]+)"/,(_,v)=>{const box=v.split(' ').map(Number);box[3]-=32;return `viewBox="${box.join(' ')}"`;})
    .replace(/\by="([\d.]+)"/g,(m,y)=>Number(y)>1070?`y="${Number(y)-32}"`:m);
  }
  replace(['g6-3-072'],[proteinFigure],'Reduce only the oversized gap between the two protein illustration rows by 32 units, so the adjacent protein explanation and its figure can share a page after the fats refit. Keep every image and label at its original size.');
  const introduction=ch.blocks.find(b=>b.id==='g6-3-002').html;
  const sentence=introduction.indexOf('. ')+1;
  replace(['g6-3-002'],[{type:'paragraph',html:introduction.slice(0,sentence)},{type:'paragraph',html:introduction.slice(sentence).trim()}],
   'Emphasise only the opening sentence; keep the rest of the lunch scene in regular body text.');
  const invitation=ch.blocks.find(b=>b.id==='g6-3-005');
  replace([invitation.id],[{...invitation},
   {type:'paragraph',html:'Choose one dish and trace it back to its ingredients. A roti may begin with wheat flour; dal with pulses. What else went into preparing it? Ask the person who made it, and separate what you observed from what you found out by asking.'},
   {type:'paragraph',html:'Keep these questions in your notebook. As you explore the chapter, connect the foods you know with nutrients, cooking practices and the journey from farm to plate. One lunch starts the enquiry; a week of observations gives you more to compare.'}],
   'Focused opener enrichment: add an ingredient-tracing invitation and preview how notebook observations connect to the chapter. Preserve the existing lunch prompt; add no answer spaces.');
  replace(['g6-3-193'],[{type:'paragraph',html:'<strong>Food and nutrition:</strong> carbohydrate · fat · protein · vitamin · mineral · nutrient · protective nutrient · energy-giving food · body-building food · roughage · balanced diet · deficiency disorder · scurvy · rickets · beriberi · goitre · anaemia · iodised salt · junk food · millet · nutri-cereal · culinary practice · cultivation · food miles<br/><strong>Ways of working:</strong> observe · predict · compare · analyse · infer · interpret · investigate · survey · correlate'}],
   'Restore clear separators between the existing keyword phrases; no terms or meanings are added or removed.');
  replace(['g6-3-007','g6-3-008'],[{type:'paragraph',html:ch.blocks.filter(b=>['g6-3-007','g6-3-008'].includes(b.id)).map(b=>b.html).join(' ')}],
   'Join the two introductory food-observation paragraphs without cutting text so the first complete investigation fits with its introduction.');
  const regional=structuredClone(ch.blocks.find(b=>b.id==='g6-3-020'));
  const illustrations=ch.blocks.find(b=>b.id==='g6-3-021');
  const paths=illustrations.art.flatMap(a=>[...(a.svg||'').matchAll(/href="([^"]+)"/g)].map(m=>m[1]));
  if(paths.length!==9)throw Error('Expected nine regional food illustrations');
  for(let row=1;row<4;row++)for(let col=1;col<4;col++)regional.rows[row][col].images=[{src:paths[(row-1)*3+col-1],alt:regional.rows[row][col].html}];
  replace(['g6-3-020','g6-3-021'],[regional],'Attach the nine crop, dish and drink illustrations to their matching state and table cell.');
  const refs=ch.blocks.filter(b=>b.type==='reference');
  for(const group of [refs.slice(0,3),refs.slice(3,5),refs.slice(5)])replace(group.map(b=>b.id),[{
   type:'table',caption:'Nutrients: sources, roles and deficiency',widths:[19,40,41],
   rows:[['Nutrient','Sources and role','Deficiency: possible signs, not a diagnosis'].map(html=>({html})),
    ...group.map(b=>[{html:b.title},{html:b.items.slice(0,2).join('<br/>'),images:b.art},
      {html:b.items.slice(2).join('<br/>')}])]
  }],'Replace parallel nutrient cards with a comparison table; preserve all sources, roles, qualifications and illustrations.');
 }
 if(n==='2'){
  const recap=[
   'Biodiversity is the variety of living things in a region. Careful observation reveals more than a quick glance.',
   'Living things depend on one another for food, shelter and other needs.',
   'Grouping uses shared features. Apply each rule consistently to answer a particular question.',
   'Woody stems and branching distinguish trees and shrubs from herbs. Climbing and trailing are overlapping growth habits.',
   'Venation is the pattern of leaf veins; two common patterns are reticulate and parallel.',
   'A taproot system has one main root; fibrous roots form a spreading bunch.',
   'Flowering plants called dicots have two cotyledons; monocots have one.',
   'Dicots generally have reticulate veins and taproots; monocots, parallel veins and fibrous roots. Check these predictions.',
   'Animals can be grouped by their movement and body parts, or by other shared features.',
   'Adaptations are inherited features aiding survival and reproduction. They evolve across generations, not through individual effort.',
   'Habitats are terrestrial (land) or aquatic (water). Many amphibians use both; not every animal using both is an amphibian.',
   'Habitat damage reduces biodiversity. Governments and communities protect habitats.'
  ];
  recap.forEach((html,i)=>replace([`g6-2-${String(185+i).padStart(3,'0')}`],[{type:'paragraph',html:'• '+html}],
   'Tighten the summary while retaining each concept and qualification; reserve a full-size contextual illustration.'));
  compare(['g6-2-053','g6-2-054','g6-2-055'],['Trees','Shrubs','Herbs'],'Compare stems and branching');
  compare(['g6-2-061','g6-2-062'],['Climbers','Creepers'],'Compare growth habits');
  compare(['g6-2-075','g6-2-076'],['Reticulate venation','Parallel venation'],'Compare vein patterns');
  compare(['g6-2-088','g6-2-089'],['Taproot system','Fibrous root system'],'Compare root systems');
  compare(['g6-2-148','g6-2-149'],['Rajasthan camel','Ladakh camel'],'Compare body form, feet, humps and coat');
  compare(['g6-2-165','g6-2-166'],['Terrestrial habitats','Aquatic habitats'],'Compare land and water habitats');
  replace(['g6-2-036','g6-2-037','g6-2-038','g6-2-039','g6-2-040'],[{type:'paragraph',html:'<strong>Some ways of grouping:</strong> Flowers · Stem · Food · Habitat'}],
   'Keep the four alternative grouping criteria together rather than treating diagram labels as independent headings.');
 }
 if(n==='4'){
  const get=id=>ch.blocks.find(b=>b.id===id).html;
  replace(['g6-4-032','g6-4-033','g6-4-034'],[{type:'table',caption:'Compare responses in the same school test',rows:[
   [{html:'Magnetic materials'},{html:'Non-magnetic materials'}],
   [{html:get('g6-4-032')+'<br/>'+get('g6-4-033')},{html:get('g6-4-034')}]
  ]}],'Compare magnetic and non-magnetic materials in parallel columns, retaining limits of the test and steel qualifications.');
  replace(['g6-4-105','g6-4-106','g6-4-107','g6-4-108','g6-4-109'],[{type:'table',caption:get('g6-4-107'),rows:[
   [{html:'Unlike poles: attraction'},{html:'Like poles: repulsion'}],
   [{html:get('g6-4-105')},{html:get('g6-4-106')}],
   [{html:get('g6-4-108').replace(/^•\s*/, '')},{html:get('g6-4-109').replace(/^•\s*/, '')}]
  ]}],'Replace the attraction/repulsion comparison and recap bullets with a paired table; keep every explanation.');
  replace(['g6-4-160','g6-4-161'],[{type:'paragraph',html:ch.blocks.find(b=>b.id==='g6-4-160').html+' '+ch.blocks.find(b=>b.id==='g6-4-161').html.replace(/^•\s*/, '')}],
   'Combine the two connected summary points about a magnet’s poles and breaking it; retain all words so the glossary and complete summary fit together.');
  const b=ch.blocks.find(b=>b.id==='g6-4-085');
  const figures=b.blocks.filter(x=>x.type==='figure');
  const materials=b.blocks.filter(x=>x.type==='paragraph'&&x.html.startsWith('You will need:'));
  const safety=b.blocks.filter(x=>x.type==='paragraph'&&x.html.startsWith('Safety:'));
  replace([b.id],[...materials,...safety,{...b,blocks:b.blocks.filter(x=>!figures.includes(x)&&!materials.includes(x)&&!safety.includes(x))},...figures],
   'Keep the nine-step investigation panel whole. Place materials and safety immediately before it, and attach the two setup illustrations after the complete procedure.');
 }
 // Attach this climbing detail before the lesson changes from stems to veins.
 if(n==='2'){
  const plantNote=ch.blocks.splice(ch.blocks.findIndex(b=>b.id==='g6-2-015'),1)[0];
  ch.blocks.splice(ch.blocks.findIndex(b=>b.id==='g6-2-013')+1,0,plantNote);
  const at=ch.blocks.findIndex(b=>b.id==='g6-2-064');
  ch.blocks.splice(at+1,0,{id:'g6-2-tendril-detail',type:'figure',source:ch.blocks[at].source,
   caption:'A tendril curls around a support.',art:[{kind:'image',src:'../../figures/class-6/living-world/tendril.jpg',alt:'A coiled plant tendril',w:600,h:400}]});
 }
 if(n==='3'){
  const vitamins=ch.blocks.find(b=>b.id==='g6-3-112');
  vitamins.art[0].labelled=true;
  vitamins.art[0].svg=vitamins.art[0].svg.replace(/<text\b[^>]*>[\s\S]*?<\/text>/g,'');
  vitamins.caption+='(c) Vitamin C (d) Vitamin D';
  const captionIndex=ch.blocks.findIndex(b=>b.id==='g6-3-104');
  const caption=ch.blocks.splice(captionIndex,1)[0];caption.keepNext=true;
  const tableIndex=ch.blocks.findIndex(b=>b.type==='table'&&b.caption==='Nutrients: sources, roles and deficiency');
  ch.blocks.splice(tableIndex,0,caption);
 }
 if(n==='10'){
  const assessment=ch.blocks.find(b=>b.id==='g6-10-245');
  assessment.art=[{kind:'image',src:'../../figures/class-6/science/review/animal-movement.png',alt:'A pigeon walking and flying',w:810,h:540}];
  assessment.caption='Describe the movement, then use other evidence to judge whether something is living.';
  ledger.push({reason:'Replace the small decorative leaf on the review page with a dimensional movement comparison tied to its first question.'});
 }
 if(n==='4')for(let i=0;i<ch.blocks.length-1;i++){
  if(ch.blocks[i].type==='paragraph'&&ch.blocks[i+1].type==='table'&&/^\d+\./.test(ch.blocks[i].html))ch.blocks[i].keepNext=true;
 }
 // Small illustrations accompany the paragraph they explain.
 for(let i=0;i<ch.blocks.length-1;i++){
  const b=ch.blocks[i],next=ch.blocks[i+1];
  if(b.type==='figure'&&b.source!=='p001.html'&&b.art.length===1&&b.art[0].w<440&&b.art[0].h<350&&next.type==='paragraph'&&!/^\d+\./.test(next.html)&&next.source===b.source){
   replace([b.id,next.id],[{type:'media',figure:b,blocks:[next]}],'Keep the small illustration beside its explanatory paragraph, retaining the original artwork size.');
  }
 }
 // Enlarge small teaching cutouts within the existing side-by-side component.
 const enlarge=b=>{
  if(b.type==='media')for(const a of b.figure.art){a.displayScale=1.8;a.maxHeight=300;}
  if(b.id==='g6-3-173')for(const a of b.art||[]){a.h=490;a.maxHeight=490;}
  if(['g6-2-013','g6-2-074','g6-2-087'].includes(b.id))for(const a of b.art||[]){
   const image=a.svg.match(/<image\b[^>]*height="([\d.]+)"[^>]*>/);
   const oldHeight=Number(image[1]),newHeight=450,delta=newHeight-oldHeight,ratio=newHeight/oldHeight;
   a.h+=delta;
   a.svg=a.svg.replace(/viewBox="([^"]+)"/,(_,v)=>{const box=v.split(' ').map(Number);box[3]+=delta;return `viewBox="${box.join(' ')}"`;})
    .replace(image[0],image[0].replace(`height="${oldHeight}"`,`height="${newHeight}"`))
    .replace(/<text\b([^>]+)>/g,(_,attrs)=>'<text'+attrs.replace(/ x="([\d.]+)"/,(_,x)=>` x="${526+(Number(x)-526)*ratio}"`).replace(/ y="([\d.]+)"/,(_,y)=>` y="${Number(y)+delta}"`)+'>');
  }
  if(b.type==='figure'&&b.art?.length===1&&b.art[0].w<300&&n==='3'){
   b.art[0].displayScale=1.35;b.art[0].maxHeight=440;
  }
  for(const child of b.blocks||[])enlarge(child);
 };
 ch.blocks.forEach(enlarge);
 return {ch,ledger};
}
