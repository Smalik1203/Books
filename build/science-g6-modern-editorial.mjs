// Explicit, reviewable changes on top of the immutable page transcription.
// Every replacement carries its original IDs into the editorial ledger.
import {fatSourceFigure} from './science-g6-food-fat-figure.mjs';
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
 const compare=(ids,labels,caption)=>replace(ids,[{type:'table',caption,
  rows:[labels.map(html=>({html})),ids.map(id=>({html:ch.blocks.find(b=>b.id===id).html}))]}],
  'Present the existing differentiated descriptions in parallel table columns; preserve all wording and adjacent shared qualifications.');
 if(n==='1'){
  const story=ch.blocks.find(b=>b.id==='g6-1-046');
  replace([story.id],[{type:'heading',level:2,html:'1.3 Asking and Testing Questions'},...story.blocks],
   'The clock case is an extended worked explanation, not one short thinking pause. Set it as open teaching prose; retain every paragraph and its illustration. Restore the missing 1.3 section number.');
 }
 if(n==='3'){
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
 // Small illustrations accompany the paragraph they explain at their original size.
 for(let i=0;i<ch.blocks.length-1;i++){
  const b=ch.blocks[i],next=ch.blocks[i+1];
  if(b.type==='figure'&&b.source!=='p001.html'&&b.art.length===1&&b.art[0].w<440&&b.art[0].h<350&&next.type==='paragraph'&&!/^\d+\./.test(next.html)&&next.source===b.source){
   replace([b.id,next.id],[{type:'media',figure:b,blocks:[next]}],'Keep the small illustration beside its explanatory paragraph, retaining the original artwork size.');
  }
 }
 return {ch,ledger};
}
