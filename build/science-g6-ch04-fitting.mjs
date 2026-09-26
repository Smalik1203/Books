import illustrations from '../assets/design-history/science-g6-ch04-fitting/illustrations.json' with {type:'json'};

export const materialThinkingPrompt = "A plastic-coated paper clip moves towards a magnet, but a plastic ruler does not. Does this show that some plastic is magnetic? Give another explanation and suggest a test that could distinguish between the two explanations.";

export function fitMagnetsLesson(ch,ledger){
 const get=id=>{const b=ch.blocks.find(b=>b.id==='g6-4-'+id);if(!b)throw Error('Missing magnet block '+id);return b;};
 const insert=(after,b)=>ch.blocks.splice(ch.blocks.indexOf(get(after))+1,0,b);
 const picture=(page,w,h)=>{
  const a=illustrations.find(a=>a.oldPage===page);
  return {id:'g6-4-context-'+page,type:'figure',source:'reviewed supplementary illustration',caption:a.caption,
   art:[{kind:'image',src:'../../'+a.file,alt:a.caption,w,h,displayScale:1}]};
 };
 const pair=(id,ids,w=300,h=230)=>{
  const f=get(id),prose=ids.map(get);
  f.art.forEach(a=>{a.w=w;a.h=h;a.displayScale=1;});
  const at=ch.blocks.slice(0,ch.blocks.indexOf(prose[0])).filter(b=>b!==f&&!prose.includes(b)).length;
  ch.blocks=ch.blocks.filter(b=>b!==f&&!prose.includes(b));
  ch.blocks.splice(at,0,{id:f.id+'-paired',source:prose[0].source,type:'media',figure:f,blocks:prose});
 };
 get('036').blocks[0].html=materialThinkingPrompt;
 ledger.push({sourceIds:['g6-4-036'],resultIds:['g6-4-036'],reason:'User-requested replacement of recall with competing explanations and a discriminating test for a coated object.'});
 // The specific topic heading already tells the reader what this explains.
 ch.blocks=ch.blocks.filter(b=>!['g6-4-009','g6-4-088'].includes(b.id));
 ledger.push({sourceIds:['g6-4-009'],resultIds:['g6-4-011'],reason:'Use the specific Hidden in Familiar Objects heading; remove the generic heading that stranded one introductory line at the foot of the opener.'});
 ledger.push({sourceIds:['g6-4-088'],resultIds:[],reason:'Remove How It Works beneath What Makes the Needle Work?; the specific heading already introduces the mechanism.'});
 // Existing contextual artwork belongs in the explanation, not in spare page space.
 for(const [page,after,w,h] of [[3,'023',460,240],[4,'030',300,210],[5,'035',300,220],[6,'039',300,170],[7,'042',460,230],[8,'051',300,210],[11,'064',300,240],[12,'076',300,260],[14,'085-r1',300,250],[15,'085-r2',300,200],[18,'121',480,210],[19,'102',460,230],[20,'112',300,240],[22,'128',300,240],[23,'130',460,240],[24,'138',300,200],[27,'156',620,400],[28,'167',520,270],[29,'180',300,220],[30,'185',300,180]])insert(after,picture(page,w,h));
 for(const [page,ids,w,h] of [[4,['026','027'],300,210],[5,['035'],300,220],[6,['037','038','039'],300,170],[8,['050','051'],300,210],[11,['062','063','064','065'],300,240],[12,['073','074','075','076'],300,260],[14,['084','085-r0','085-r1'],300,250],[20,['112','113'],300,240],[22,['128'],300,240],[24,['138'],300,200],[29,['170','171','172','173','174'],300,220],[30,['185'],300,180]])pair('context-'+page,ids,w,h);
 // Place apparatus inside its complete setup; no outcomes are shown early.
 for(const [page,id] of [[3,'024'],[7,'043'],[15,'085-r2'],[19,'099'],[23,'131']]){
  const f=get('context-'+page),panel=get(id);
  f.art.forEach(a=>{a.w=280;a.h=190;});
  ch.blocks=ch.blocks.filter(b=>b!==f);panel.inlineReference=true;
  panel.blocks.splice(1,0,f);
 }
 // The comparison of compass responses belongs to the compass investigation.
 get('121').keepNext=true;get('context-18').keepNext=true;
 // Split a composite illustration into its two teaching roles, retaining both.
 const composite=get('053');
 const pieces=[...composite.art[0].svg.matchAll(/<svg class="science-illustration[\s\S]*?<\/svg><text\b[^>]*>([\s\S]*?)<\/text>/g)];
 if(pieces.length!==2)throw Error('Expected broken-magnet and filings drawings');
 const fragments=pieces.map((m,i)=>{
  const inner=m[0].slice(0,m[0].indexOf('</svg>')+6);
  const h=Number(inner.match(/height="([^"]+)"/)[1]);
  const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 890 '+(h+16)+'">'+inner.replace(/ x="[^"]+"/,' x="8"').replace(/ y="[^"]+"/,' y="8"')+'</svg>';
  return {...composite,id:composite.id+'-'+i,caption:m[1],art:[{kind:'vector',svg,w:890,h:h+16,labelled:true}]};
 });
 ch.blocks.splice(ch.blocks.indexOf(composite),1,fragments[0]);
 insert('049',fragments[1]);
 get('052').keepNext=true;
 // Keep the concluding shape explanation with the shape examples.
 get('019').keepNext=true;
 // Definitions and examples form two readable rows, with a repeated header
 // when the comparison continues overleaf.
 const comparison=get('032-r0'),original=comparison.rows[1];
 const magnetic=original[0].html.split(/<br\s*\/?\s*>/);
 const nonmagnetic=original[1].html.match(/^([\s\S]*?exactly zero\.)\s*([\s\S]*)$/);
 if(!nonmagnetic)throw Error('Missing non-magnetic qualification');
 const examples={...comparison,id:'g6-4-material-examples',caption:'Examples from the same school test',rows:[comparison.rows[0],[{html:magnetic[1]},{html:nonmagnetic[2]}]]};
 comparison.rows=[comparison.rows[0],[{html:magnetic[0]},{html:nonmagnetic[1]}]];
 insert('032-r0',examples);
 // Compass construction and use are read with the dial and pivot illustration.
 const compass=get('079');ch.blocks=ch.blocks.filter(b=>b!==compass);insert('context-12-paired',compass);
 get('072').keepNext=true;get('context-12-paired').keepNext=true;
 // Put the floating model directly beside the paragraph that introduces it.
 pair('093',['091','092'],300,210);
 // Long explanations regain the full text measure below their illustration.
 for(const page of [4,6,8,11,12,20])get('context-'+page+'-paired').wrapReference=true;
 // The foil detail stays with the first paragraph; the following fair-test
 // discussion may continue at full width onto the next page.
 const foil=get('context-6-paired');
 ch.blocks.splice(ch.blocks.indexOf(foil),1,{...foil,blocks:foil.blocks.slice(0,1)},...foil.blocks.slice(1));
 // The equipment kit and compass surroundings need a broad view to distinguish
 // the small parts. Place them within the explanation at a readable scale.
 const kit=get('context-14-paired');
 kit.figure.art.forEach(a=>{a.w=540;a.h=350;});
 ch.blocks.splice(ch.blocks.indexOf(kit),1,kit.blocks[0],kit.blocks[1],kit.figure,kit.blocks[2]);
 const surroundings=get('context-22-paired');
 surroundings.figure.art.forEach(a=>{a.w=780;a.h=500;});
 ch.blocks.splice(ch.blocks.indexOf(surroundings),1,surroundings.figure,...surroundings.blocks);
 get('context-22').keepNext=true;
 // Enlarge the iron-filings pattern so its chains can be inspected.
 const filings=get('053-1').art[0];
 filings.w=890;filings.h=500;
 filings.svg=filings.svg.replace('viewBox="0 0 890 246"','viewBox="0 0 890 500"').replace('height="230"','height="484"');
 // Show the original magnet above its two pieces, using the existing cutouts.
 const broken=get('053-0').art[0],brokenSrc='../../figures/class-6/science/ch04/png/broken.png';
 broken.w=800;broken.h=340;
 broken.svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 340">'+
  [[20,8,760,157,'30 278 1045 216'],[80,182,640,152,'1100 290 860 204']].map(([x,y,w,h,v])=>`<svg x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${v}"><image href="${brokenSrc}" width="1983" height="793"/></svg>`).join('')+'</svg>';
 // Full-width materials views sit between the list and the numbered steps.
 for(const [id,w,h] of [['024',500,240],['043',500,270]]){
  const panel=get(id);panel.inlineReference=false;
  panel.blocks.find(b=>b.type==='figure').art.forEach(a=>{a.w=w;a.h=h;});
 }
 get('131').keepNext=true;
 // Give each of the four games its own picture beside its instructions.
 // This prevents a page turn separating the maze and water tests from their art.
 const fish=get('context-24-paired');
 ch.blocks.splice(ch.blocks.indexOf(fish),1,...fish.blocks,fish.figure);
 pair('context-24',['144'],300,240);
 const games=get('142');ch.blocks=ch.blocks.filter(b=>b!==games);
 const crops=[['138','35 40 670 430',300],['139','840 20 665 620',380],['140','30 500 675 440',300],['141','740 700 770 255',210]];
 for(const [id,viewBox,h] of crops){
  const [x,y,w,height]=viewBox.split(' '),clip='g6-game-crop-'+id;
  const figure={id:'g6-4-game-'+id,type:'figure',source:games.source,caption:'',art:[{kind:'vector',w:400,h,svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><defs><clipPath id="${clip}"><rect x="${x}" y="${y}" width="${w}" height="${height}"/></clipPath></defs><image clip-path="url(#${clip})" href="../../figures/class-6/science/ch04/png/games.png" width="1536" height="1024"/></svg>`}]};
  insert(id,figure);pair('game-'+id,[id],400,h);get('game-'+id+'-paired').wideReference=true;
 }
 // Enlarge the compass-making pictures, with captions kept at reading size.
 const compassSteps=get('085-r3');
 compassSteps.figures=compassSteps.art.map((a,i)=>{
  const inner=a.svg.match(/<svg class="science-illustration\b[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*?)<\/svg>/);
  if(!inner)throw Error('Missing compass-step artwork');
  const box=inner[1].split(' ').map(Number),width=420;
  return {id:compassSteps.id+'-image-'+i,type:'figure',source:compassSteps.source,caption:i?'Float the needle on cork.':'Stroke in one direction.',art:[{kind:'vector',w:width,h:width*box[3]/box[2],svg:`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${inner[1]}">${inner[2]}</svg>`}]};
 });
 compassSteps.type='figure-pair';delete compassSteps.art;
 for(const [id,caption] of [['138','Add clips one at a time.'],['139','Move the magnet below the card.'],['140','Keep the magnet outside the glass.'],['141','Compare the facing ends of the magnets.']])get('game-'+id+'-paired').figure.caption=caption;
 const gameTitle={id:'g6-4-games-caption',type:'caption',html:'Four ways to explore magnetic attraction and repulsion.',keepNext:true,source:games.source};
 insert('137',gameTitle);
 insert('game-139-paired',{id:'g6-4-maze-comparison',type:'paragraph',source:'User-requested page 20 activity extension',html:'Try the same maze route with the magnet close beneath the card, then slightly farther away. If the ball stops, is the attraction too weak, or is a wall blocking its path? How could you test these explanations separately?'});
 const mazeComparison=get('maze-comparison');
 ch.blocks=ch.blocks.filter(b=>b!==mazeComparison);
 get('game-139-paired').blocks.push(mazeComparison);
 get('game-139-paired').wrapReference=true;
 for(const id of ['138','139'])get('game-'+id+'-paired').figure.art.forEach(a=>{a.w*=1.1;a.h*=1.1;});
 for(const id of ['140','141'])get('game-'+id+'-paired').wrapReference=true;
 get('game-140-paired').blocks.push({id:'g6-4-clip-observation',type:'paragraph',source:'User-requested page 21 activity layout',html:'Watch the clip as you slide the magnet up the outside of the glass. Keep the glass still and record where the clip follows and where it stops.'});
 const carExplanation=get('145');
 ch.blocks=ch.blocks.filter(b=>b!==carExplanation);
 get('game-141-paired').blocks.push(carExplanation);
 ledger.push({sourceIds:['g6-4-140','g6-4-145'],resultIds:['g6-4-clip-observation','g6-4-game-141-paired'],reason:'Connect activity text to its illustration: add clip observation guidance and move the existing racing-car explanation beside the cars.'});
 ledger.push({sourceIds:['g6-4-139'],resultIds:['g6-4-maze-comparison'],reason:'User requested useful text beneath the page 20 activities: extend the maze investigation with a controlled distance comparison and distinguish weak attraction from a blocked path.'});
 const samples=get('context-4-paired');samples.wrapReference=false;samples.wideReference=true;
 samples.figure.art.forEach(a=>{a.w=400;a.h=280;});
 get('057').blocks.find(b=>b.type==='figure').art.forEach(a=>{const scale=340/a.w;a.w*=scale;a.h*=scale;});
 // Place the recording illustration within the exercise introduction.
 const record=get('context-29-paired');record.figure.art.forEach(a=>{a.w=460;a.h=250;});
 ch.blocks.splice(ch.blocks.indexOf(record),1,{id:record.id,type:'lesson-group',source:record.source,blocks:record.blocks},record.figure);
 // These two tall apparatus drawings sit beside the question they illustrate.
 pair('191',['190'],300,360);
 pair('197',['196'],300,330);
 // Fit the actual picture bounds, not the old full-width figure frame, and
 // keep captions as live text at the standard caption size.
 for(const [id,height] of [['093',210],['191',320],['197',270]]){
  const figure=get(id+'-paired').figure,a=figure.art[0];
  const inner=a.svg.match(/<svg class="science-illustration\b[^>]*viewBox="([^"]+)"[^>]*>([\s\S]*?)<\/svg>/);
  if(!inner)throw Error('Missing native picture bounds: '+id);
  figure.caption=[...a.svg.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)].map(m=>m[1]).join(' ');
  a.svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${inner[1]}">${inner[2]}</svg>`;
  a.h=height;
 }
 get('087').keepNext=true;get('089').keepNext=true;
 // Comparisons have distinct bullet points, while procedure steps retain numbers.
 for(const id of ['032-r0','material-examples','105-r0'])for(const row of get(id).rows.slice(1))for(const c of row){
  const parts=c.html.split(/<br\s*\/?\s*>|(?<=\.)\s+(?=[A-Z])/).map(s=>s.trim()).filter(Boolean);
  c.html='<ul class="g6-compare-points">'+parts.map(s=>'<li>'+s+'</li>').join('')+'</ul>';
 }
 // The end-and-middle illustration explains question 4's observations.
 const bars=get('context-30-paired'),q4=get('184');
 ch.blocks.splice(ch.blocks.indexOf(bars),1,...bars.blocks);
 ch.blocks.splice(ch.blocks.indexOf(q4),1,{id:'g6-4-clips-table',type:'media',source:q4.source,figure:bars.figure,blocks:[q4]});
 bars.figure.art.forEach(a=>{a.w=300;a.h=180;});
 q4.numericTable=true;
 for(const id of ['017','046','047','048','049','066','067','077','078','083','097','098','103','104','110','111','114','117','118','120','124','125','127','129','130','132','136','137','147','150','151','152','192'])get(id).keepNext=true;
 // Keep complete question groups together; questions may not lose their figure.
 for(const ids of [['175','176','177','178','179','180'],['192','193']]){
  const blocks=ids.map(get),at=ch.blocks.indexOf(blocks[0]);
  ch.blocks=ch.blocks.filter(b=>!blocks.includes(b));ch.blocks.splice(at,0,{id:blocks[0].id+'-group',type:'lesson-group',blocks,source:blocks[0].source});
 }
 // A reference page explains its terms rather than presenting an unexplained list.
 const meanings=[['Artificial magnet','A magnet made by people.'],['Attraction','A force that pulls objects towards one another.'],['Bar magnet','A straight magnet with a North pole and a South pole.'],['Lodestone','Naturally magnetised magnetite.'],['Magnetic compass','A freely turning magnetic needle used to find direction.'],['Magnetic material','A material strongly attracted in the school magnet test.'],['Non-magnetic material','A material showing no noticeable attraction in that test.'],['North pole','The north-seeking end of a freely turning magnet.'],['Poles','Regions where a simple magnet has its strongest effects.'],['Repulsion','A force that pushes objects apart.'],['Ring magnet','A magnet shaped like a ring; its poles depend on how it is made.'],['South pole','The south-seeking end of a freely turning magnet.'],['U-shaped magnet','A bent magnet with poles at its two tips.']];
 const glossary=get('156');glossary.type='panel';glossary.kind='glossary';glossary.blocks=meanings.map(([term,meaning])=>({type:'paragraph',html:'<strong>'+term+'</strong> — '+meaning}));delete glossary.html;
 ledger.push({sourceIds:['g6-4-156'],resultIds:[glossary.id],reason:'Retain all thirteen keywords and add concise meanings in a complete reference panel.'});
 ledger.push({reason:'Refit Chapter 4 using fixed-size contextual artwork, intact investigations, paired explanations, protected figure references and bulleted comparisons. Retain original teaching text, safety instructions and native illustrations.'});
}
