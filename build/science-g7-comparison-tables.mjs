// Class 7-only editorial treatment. Existing activities, narrative explanations
// and topic overviews keep their teaching roles; genuine distinctions use tables.
const rules={
 2:{'three-natures':['Recognising acidic, basic and neutral samples',['Test or meaning','Typical samples','Classroom group']], 'soil-comparison':['Soil conditions and appropriate responses',['Evidence','Response','Follow-up']]},
 3:{'lamp-comparison':['Incandescent lamps and LEDs',['Light source','Connections','Polarity']], 'switch-comparison':['Open and closed circuits',['Contact','Path','Observation']], 'materials-use':['Conducting and insulating parts',['Purpose','Examples','Choice or limit']]},
 4:{'shape-comparison':['Malleable and brittle behaviour',['Under force','Resulting form','Examples']], 'protect':['Protecting iron from corrosion',['Protection and care'],true], 'oxide-comparison':['Products of magnesium and sulfur in air',['Element','Product','With water']]},
 5:{'wax-comparison':['Two kinds of change in a candle',['What happens'],true], 'desirable-comparison':['Useful and unwanted changes',['Examples'],true], 'weathering-comparison':['Physical and chemical weathering',['How it happens'],true]},
 6:{'pad-comparison':['Using and caring for menstrual pads',['Use and changing','After use']]},
 7:{'conductors':['Good and poor heat conductors',['Heat transfer','Examples','Use']], 'breeze-comparison':['Sea and land breezes',['Land and sea','Rising air','Surface airflow']], 'clothes-comparison':['Light and dark surfaces in sunlight',['Typical response'],true]},
 8:{'speed-comparison':['Comparing average speeds',['What to compare','Greater speed']], 'motion-comparison':['Uniform and non-uniform linear motion',['Path and speed','Equal intervals','Example']]},
 9:{'digestion-comparison':['Food processing in ruminants and birds',['Mechanical action','Distinctive part']], 'breathing-comparison':['Inhalation and quiet exhalation',['Muscle movement','Volume and pressure','Air movement']], 'breathing-respiration':['Breathing and cellular respiration',['What happens','Where','Role']]},
 10:{'transport-comparison':['Xylem and phloem',['Cargo','Direction','Connection']], 'process-comparison':['Photosynthesis and aerobic respiration',['Main role','Materials','Where and when']]}
};
const strip=s=>s.replace(/^[A-Za-z][A-Za-z -]*:\s*/,'');
function table(original,caption,rows,widths,note=''){
 return {id:original.id,type:'table',source:original.source||[],caption,rows,widths,note,comparisonTable:true,comparisonOriginal:structuredClone(original),editorialRevision:'2026-09: concept distinctions presented as aligned comparison tables'};
}
export function applyClass7ComparisonTables(lesson,chapter){
 for(let i=0;i<lesson.length;i++){
  const b=lesson[i],rule=rules[chapter]?.[b.id];
  if(rule){
   const [caption,criteria,grouped]=rule,cols=b.columns;
   if(!cols?.length)throw Error('Missing comparison '+b.id);
   const rows=[['Aspect',...cols.map(c=>c.title)],...criteria.map((criterion,j)=>[criterion,...cols.map(c=>grouped?c.items.join(' '):strip(c.items[j]))])];
   const first=cols.length===3?.17:.18;
   lesson[i]=table(b,caption,rows,[first,...cols.map(()=> (1-first)/cols.length)]);
   if(grouped)lesson[i].paragraphCells=true;
  }
 }
 const replace=(id,caption,rows,widths,note='')=>{const i=lesson.findIndex(b=>b.id===id);if(i<0)throw Error('Missing block '+id);lesson[i]=table(lesson[i],caption,rows,widths,note);};
 const listTable=(id,caption,headers)=>{const b=lesson.find(b=>b.id===id);replace(id,caption,[headers,...b.items.map(s=>{const m=s.match(/^(?:\*\*)?([^:]+):(?:\*\*)?\s*(.*)$/);if(!m)throw Error(id+': '+s);return [m[1].replaceAll('**',''),m[2]];})],[.24,.76]);};
 if(chapter===1)replace('water-explanation','Evaporation and condensation',[
  ['Evaporation','Condensation'],
  ['Liquid water enters the air as water vapour during **evaporation**.','When water vapour cools sufficiently, **condensation** forms tiny liquid droplets; clouds may contain droplets, ice crystals or both.']
 ],[.5,.5],'Water can later fall as rain, flow over land or soak into the ground. Sunlight supplies energy for much of this cycling; water vapour itself is invisible.');
 if(chapter===2)listTable('sorting','Group samples by both litmus observations',['Group','Observed pattern']);
 if(chapter===4)replace('properties-apart','Hardness and malleability',[
  ['Hardness','Malleability'],
  ['Hardness concerns resistance to local indentation or scratching.','Malleability concerns a change into a sheet without fracture.']
 ],[.5,.5],'Hardness and malleability answer different questions. A material can resist a small dent yet still be shaped with suitable tools. Keep the two descriptions separate in your notes.');
 if(chapter===6)replace('puberty','Puberty and adolescence',[
  ['Puberty','Adolescence'],
  ['**Puberty** is the process of physical changes through which the body becomes capable of reproduction. It includes internal changes as well as visible ones.','Adolescence is broader: it also includes emotional and social development.']
 ],[.5,.5],'Reproductive maturity does not mean that a young person is ready for marriage or parenthood.');
 if(chapter===5)replace('reverse-meaning','Reversible and irreversible changes',[
  ['Reversible change','Irreversible change'],
  ['A **reversible change** can be undone under suitable conditions.','An **irreversible change** cannot be undone by ordinary methods.']
 ],[.5,.5],'Tearing paper and crushing chalk are physical changes that do not easily restore the objects. Many chemical changes are difficult to reverse too. Reversibility and new-substance formation are separate questions.');
 if(chapter===8)listTable('clock-principles','How early clocks mark time',['Device','Working principle and conditions']);
 if(chapter===8){
  replace('clock-accuracy','Resolution and accuracy',[
   ['Resolution','Accuracy'],
   ['**Resolution** is the smallest interval its display or scale distinguishes.','Accuracy concerns how close a reading is to the actual interval.']
  ],[.5,.5],'Timekeeping has improved greatly from early mechanical clocks to modern atomic standards. Yet a device displaying many digits is not automatically accurate.');
  replace('instruments','Speedometer and odometer',[
   ['Speedometer','Odometer'],
   ['A **speedometer** indicates speed at the time of the reading.','An **odometer** records accumulated distance travelled.']
  ],[.5,.5],'Subtract two odometer readings to find the distance between them; use the elapsed time to find average speed. Neither a single speedometer reading nor an odometer reading alone gives the average for a journey.');
 }
 if(chapter===9){
  listTable('feeding-methods','Different ways of obtaining food',['Animals','How food is obtained']);
  listTable('stomach-components','Different roles in stomach secretions',['Component','Role']);
  listTable('secretions','Contributions to digestion in the small intestine',['Source','Contribution']);
  listTable('animal-comparison','Gas exchange in different animals',['Animal','Exchange surface and conditions']);
  replace('colon','Egestion and excretion',[
   ['Egestion','Excretion'],
   ['**Egestion** removes undigested remains.','**Excretion** removes wastes produced by the body’s chemical processes.']
  ],[.5,.5],'Material not absorbed in the small intestine moves into the large intestine, where more water and some salts are absorbed. Much water has already been absorbed in the small intestine. The remaining material forms stool, which is stored in the rectum and eventually passes out through the anus.');
 }
}

// Every conversion uses the existing table tokens and measured type. Complete
// rows, borders and guidance are one indivisible pagination block.
export function comparisonTableBlock(meta,{wrap,lines}){
 const head=wrap(meta.caption,874,'h',.72);let y=head.length*28+14;
 const top=y,ws=meta.widths.map(v=>v*874),xs=ws.map((_,i)=>89+ws.slice(0,i).reduce((a,v)=>a+v,0));
 let html=lines(head,89,0,'v2-table-caption',28,21.6);
 meta.rows.forEach((row,i)=>{
  if(row.length!==ws.length)throw Error('Unequal table row '+meta.id);
  // Multi-sentence summary cells need more air than short criterion rows.
  const padding=meta.paragraphCells?12:6;
  const rows=row.map((s,j)=>wrap(s,ws[j]-28,i?'n':'b',.92)),h=Math.max(...rows.map(r=>r.length))*28+padding*2;
  if(!i)html+=`<rect class="se-table-head" x="89" y="${y}" width="874" height="${h}"/>`;
  html+=`<g data-comparison-row="${i}">`+rows.map((r,j)=>`<g data-comparison-cell="${j}">`+lines(r,xs[j]+14,y+padding,i?'se-copy se-table-copy':'v2-table-heading',28,22.08)+'</g>').join('')+'</g>';
  y+=h;html+=`<line class="v2-table-rule" x1="89" x2="963" y1="${y}" y2="${y}"/>`;
 });
 html+=`<rect class="v2-table-frame" x="89" y="${top}" width="874" height="${y-top}"/>`+xs.slice(1).map(x=>`<line class="v2-table-rule" x1="${x}" x2="${x}" y1="${top}" y2="${y}"/>`).join('');
 if(meta.note){const note=wrap(meta.note,874,'n',.87);html+=lines(note,89,y+12,'v2-table-note',26,20.88);y+=12+note.length*26;}
 return {html:`<g data-comparison-table="${meta.id}">${html}</g>`,h:y+16};
}
