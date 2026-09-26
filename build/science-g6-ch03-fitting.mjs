import illustrations from '../assets/design-history/science-g6-ch03-fitting/illustrations.json' with {type:'json'};

export function fitFoodLesson(ch,ledger){
 const get=id=>ch.blocks.find(b=>b.id==='g6-3-'+id);
 // Author contextual figures before measuring, rather than filling a chosen
 // page's spare space with a picture after pagination.
 for(const [i,item] of illustrations.entries()){
  const at=ch.blocks.findIndex(b=>b.id===item.after);
  if(at<0)throw Error('Missing food illustration anchor '+item.after);
  ch.blocks.splice(at+1,0,{id:'g6-3-context-'+i,type:'figure',source:ch.blocks[at].source,caption:item.caption,
   art:[{kind:'image',src:'../../'+item.file,alt:item.caption,w:720,h:280}]});
 }
 const pair=(figureId,ids,height=240)=>{
  const figure=get(figureId),prose=ids.map(get);
  const at=ch.blocks.slice(0,ch.blocks.indexOf(prose[0])).filter(b=>b!==figure&&!prose.includes(b)).length;
  figure.art.forEach(a=>{a.w=280;a.h=height;a.displayScale=1;});
  ch.blocks=ch.blocks.filter(b=>b!==figure&&!prose.includes(b));
  ch.blocks.splice(at,0,{id:figure.id+'-paired',type:'media',source:figure.source,blocks:prose,figure});
 };
 // The diary already illustrates the opening investigation; an additional
 // breakfast plate here would force a mostly empty introductory page.
 const meals=get('context-0');ch.blocks=ch.blocks.filter(b=>b!==meals);
 ch.blocks.splice(ch.blocks.indexOf(get('114'))+1,0,meals);
 pair('context-0',['113','114']);
 pair('context-1',['014','015']);
 pair('context-2',['027','028']);
 pair('context-3',['033']);
 pair('context-4',['041','042']);
 pair('context-5',['049'],280);
 pair('context-7',['096','097']);
 pair('context-8',['163']);
 pair('099',['100'],210);
 ch.blocks=ch.blocks.filter(b=>!['g6-3-context-6','g6-3-context-11'].includes(b.id));
 for(const [figureId,panelId,at] of [['context-9','144',2],['context-10','155-r1',3]]){
  const figure=get(figureId);figure.art.forEach(a=>{a.w=480;a.h=180;});
  ch.blocks=ch.blocks.filter(b=>b!==figure);get(panelId).blocks.splice(at,0,figure);
 }
 // Nutrient names need less width than their explanations. Keep every row,
 // illustration and medical qualification; bullets separate sources and roles.
 for(const b of ch.blocks.filter(b=>b.type==='table'&&b.caption==='Nutrients: sources, roles and deficiency')){
  b.nutrientTable=true;
  for(const row of b.rows.slice(1))for(const cell of row.slice(1))cell.html='<ul class="g6-compare-points">'+cell.html.split(/<br\s*\/?\s*>/).map(s=>'<li>'+s.trim()+'</li>').join('')+'</ul>';
 }
 // Keep the diary illustration at its original readable size.
 const diary=get('010').blocks.find(b=>b.type==='figure');
 diary.art.forEach(a=>{a.displayScale=1;});
 // Keep introducing words, figures and their captions as one teaching unit.
 for(const id of ['035','052','053','055','057','058','059','060','064','065','066','067','068','069','070','071','076','077','078','079','089','098','104','146','147','151','152','157','158','165','166','171','172','180','181','182','186']){
  const b=get(id);if(b)b.keepNext=true;
 }
 get('061-r0').keepNext=false;
 get('061-r1').keepNext=false;
 for(const id of ['059','064','065','066','067','068','069','076','077','078'])get(id).keepNext=false;
 const nutrients=['105-r0','108-r0','110-r0'].map(get);
 const rows=nutrients.flatMap(b=>b.rows.slice(1));
 nutrients[0].rows=[nutrients[0].rows[0],...rows.slice(0,4)];
 nutrients[1].rows=[nutrients[1].rows[0],...rows.slice(4)];
 ch.blocks=ch.blocks.filter(b=>b!==nutrients[2]);
 // A compact two-by-two food reference retains all four original raster
 // groups and their captions; labels are live at the unchanged caption size.
 const vitamins=get('112');
 const paths=[...vitamins.art[0].svg.matchAll(/href="([^"]+)"/g)].map(m=>m[1]);
 vitamins.art=[{kind:'vector',w:700,h:460,labelled:true,svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 460">'+paths.map((src,i)=>`<image href="${src}" x="${i%2*350}" y="${Math.floor(i/2)*230}" width="340" height="210" preserveAspectRatio="xMidYMid meet"/>`).join('')+'</svg>'}];
 // Longer explanations wrap around a reference image and recover the full
 // measure below it, rather than leaving a permanently empty second column.
 for(const [id,ids] of [
  ['context-4',['041','042','043','044','045']],
  ['context-5',['047','048','049','050','051']]
 ]){
  const old=get(id+'-paired');
  ch.blocks.splice(ch.blocks.indexOf(old),1,...old.blocks,old.figure);
  pair(id,ids,id==='context-5'?280:240);
  get(id+'-paired').wrapReference=true;
 }
 const digestion=get('context-5-paired');
 ch.blocks.splice(ch.blocks.indexOf(digestion),1,...digestion.blocks);
 const cooking=get('036');
 const cookingPaths=[...cooking.art[0].svg.matchAll(/href="([^"]+)"/g)].map(m=>m[1]);
 cooking.art=[{kind:'vector',w:700,h:400,labelled:true,svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 400">'+cookingPaths.map((src,i)=>`<image href="${src}" x="${i%2*350}" y="${Math.floor(i/2)*200}" width="340" height="190" preserveAspectRatio="xMidYMid meet"/>`).join('')+'</svg>'}];
 cooking.caption+=' (c) Sil-batta — stone grinder (d) Electric mixer-grinder';
  const meal=get('context-8-paired');
  ch.blocks.splice(ch.blocks.indexOf(meal),1,...meal.blocks);
 meal.figure.art[0].w=360;meal.figure.art[0].h=190;
 get('164').blocks.splice(1,0,meal.figure);
 // The packet comparison already has its own picture; retain that complete
 // comparison with its table instead of introducing a second meal picture.
 for(const id of ['165','166','167'])get(id).keepNext=true;
 get('155-r0').keepNext=true;
 for(const id of ['144','155-r1','164']){
  const p=get(id),f=p.blocks.find(b=>b.type==='figure');
  p.inlineReference=true;
  p.blocks=p.blocks.filter(b=>b!==f);p.blocks.unshift(f);
  f.art.forEach(a=>{a.w=280;a.h=190;});
 }
 // Put each illustrated test explanation beside its apparatus photograph.
 pair('148',['146','147'],210);
 pair('159',['157','158'],210);
 pair('173',['172'],240);
 // Keep the packet and its comparison together at reference-image scale.
 get('167').art.forEach(a=>{a.displayScale=.65;});
 for(const id of ['context-2-paired','099-paired','context-0-paired','159-paired']){
  const b=get(id);b.wideReference=true;
  b.figure.art.forEach(a=>{a.w=400;a.h=260;});
 }
 const millet=get('173-paired');
 ch.blocks.splice(ch.blocks.indexOf(millet),1,...millet.blocks,millet.figure);
 pair('173',['172','174','175','176'],260);
 get('173-paired').wideReference=true;
 get('173-paired').figure.art[0].w=400;
 const protein=get('159-paired');
 protein.figure.art[0].w=810;protein.figure.art[0].h=330;
 ch.blocks.splice(ch.blocks.indexOf(protein),1,...protein.blocks,protein.figure);
 for(const b of ch.blocks.filter(b=>b.type==='table'&&/Crops and food/.test(b.caption||'')))
  for(const row of b.rows.slice(1))for(const c of row.slice(1))
   c.html='<ul class="g6-compare-points">'+c.html.split(/,\s*/).map(s=>'<li>'+s.trim()+'</li>').join('')+'</ul>';
 const washing=get('121');
 const advice=washing.html.trim().match(/^(Two sensible conclusions follow\.) (First,.*?) (Second,.*)$/);
 if(!advice)throw Error('Washing advice anchor changed');
 washing.type='lesson-group';washing.blocks=[{type:'paragraph',html:advice[1]},...advice.slice(2).map(html=>({type:'paragraph',html:'• '+html}))];delete washing.html;
 const scale=get('context-14');
 ch.blocks=ch.blocks.filter(b=>b!==scale);ch.blocks.splice(ch.blocks.indexOf(get('223'))+1,0,scale);
 pair('context-14',['223'],230);
 for(const [id,after] of [['context-12','209'],['context-13','219']]){
  const b=get(id);ch.blocks=ch.blocks.filter(x=>x!==b);ch.blocks.splice(ch.blocks.indexOf(get(after))+1,0,b);
 }
 const diaryPanel=get('010');
 diary.art=[{kind:'image',src:'../../figures/reference/food/p002-diary-transparent.png',alt:'Food diary notebook and pencil',w:280,h:336}];
 diaryPanel.inlineReference=true;
 diaryPanel.blocks=diaryPanel.blocks.filter(b=>b!==diary);diaryPanel.blocks.splice(1,0,diary);
 const repeatedDiary=get('context-1-paired');
 ch.blocks.splice(ch.blocks.indexOf(repeatedDiary),1,...repeatedDiary.blocks);
 const regions=get('020-r0');
 const continued={...structuredClone(regions),id:'g6-3-020-continued',caption:regions.caption+' (continued)',rows:[regions.rows[0],...regions.rows.slice(2)]};
 regions.rows=regions.rows.slice(0,2);ch.blocks.splice(ch.blocks.indexOf(regions)+1,0,continued);
 const field=get('173-paired');field.wrapReference=true;
 field.figure.art[0].w=240;field.figure.art[0].h=430;
 const crops=get('context-2-paired');ch.blocks.splice(ch.blocks.indexOf(crops),1,...crops.blocks,crops.figure);
 pair('context-2',['027'],190);get('context-2-paired').wideReference=true;get('context-2-paired').figure.art[0].w=400;
 get('context-2-paired').wrapReference=true;get('context-2-paired').figure.art[0].w=280;get('context-2-paired').figure.art[0].h=170;
 get('context-3-paired').figure.art[0].h=200;
 const journey=get('context-4-paired');ch.blocks.splice(ch.blocks.indexOf(journey),1,...journey.blocks,journey.figure);
 pair('context-4',['041','042'],190);get('context-4-paired').wrapReference=true;
 const transport=get('context-4-paired');ch.blocks.splice(ch.blocks.indexOf(transport),1,...transport.blocks,transport.figure);
 pair('context-4',['041'],190);get('context-4-paired').wrapReference=true;
 ch.blocks.splice(ch.blocks.indexOf(get('049'))+1,0,digestion.figure);
 // Digestion is a substantive concept: use a large anatomical reference,
 // with the complete introduction flowing alongside and below it.
 pair('context-5',['049','050'],420);get('context-5-paired').wrapReference=true;
 for(const id of ['046','047','048'])get(id).keepNext=true;
 const points=b=>{b.type='lesson-group';b.blocks=b.html.trim().split(/(?<=\.)\s+(?=[A-Z])/).map(html=>({type:'paragraph',html:'• '+html}));delete b.html;};
 for(const id of ['054','131'])points(get(id));
 points(get('173-paired').blocks.find(b=>b.id==='g6-3-175'));
 const gains=get('043'),tradeoffs=get('044');
 ch.blocks.splice(ch.blocks.indexOf(gains),2,{id:'g6-3-cooking-comparison',source:gains.source,type:'table',caption:'Changes in cooking practices',rows:[[{html:'Benefits'},{html:'What to consider'}],[{html:'<ul class="g6-compare-points"><li>'+gains.html+'</li></ul>'},{html:'<ul class="g6-compare-points"><li>'+tradeoffs.html+'</li></ul>'}]]});
 for(const id of ['207','211','212','217','218']){
  const b=get(id),parts=b.html.split(/(?=\([ivx]+\))/);
  ch.blocks.splice(ch.blocks.indexOf(b),1,...parts.map((html,i)=>({id:b.id+'-part-'+i,type:'paragraph',html,source:b.source,keepNext:i===0})));
 }
 const cases=get('103').blocks[0];
 const caseParts=cases.html.match(/^(Consider fictional cases\.) (A .*?\.) (B .*?\.) (.*)$/);
 if(!caseParts)throw Error('Fictional cases anchor changed');
 get('103').blocks=[{type:'paragraph',html:caseParts[1]},...caseParts.slice(2,4).map(html=>({type:'paragraph',html:'• '+html})),{type:'paragraph',html:caseParts[4]}];
 get('context-14-paired').wideReference=true;get('context-14-paired').figure.art[0].w=400;
 const starch=get('148-paired');starch.wideReference=true;starch.figure.art[0].w=400;starch.figure.art[0].h=220;
 const dialogue=get('123-r0'),answer=get('125');
 const portrait=(name,id,prose)=>({id,type:'media',dialogue:true,source:dialogue.source,blocks:[prose],figure:{type:'figure',art:[{kind:'image',src:'../../figures/reference/food/p016-'+name+'.png',alt:name,w:160,h:180}]}});
 ch.blocks.splice(ch.blocks.indexOf(dialogue),2,portrait('ira','g6-3-ira-question',dialogue.blocks[0]),portrait('aarav','g6-3-aarav-answer',answer));
 // Measure the summary illustration as authored content, too; a late SVG
 // supplement is visible in print but omitted by the generic fill diagnostic.
 ch.blocks.splice(ch.blocks.indexOf(get('195-r8'))+1,0,{id:'g6-3-summary-foods',type:'figure',source:get('195-r8').source,caption:'Foods supply different nutrients.',art:[{kind:'image',src:'../../figures/science/page-references/foods.png',alt:'Foods supply different nutrients.',w:550,h:367}]});
 ch.blocks.splice(ch.blocks.indexOf(washing),1,...washing.blocks.map((b,i)=>({...b,id:'g6-3-121-'+i,source:washing.source,keepNext:i===0})));
 ledger.push({reason:'Chapter 3 fitting: contextual pictures in the teaching flow, paired reference layouts, bulleted nutrient comparisons with a narrower name column, and protected illustration introductions.'});
}
