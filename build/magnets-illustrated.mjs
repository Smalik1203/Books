import {learningCue,featureIcon} from './science-learning-cues.mjs';
export async function compose({md,context,wrap,textWidth,word,E,dir,fs}) {
 const L=89,R=963,W=874,LEAD=31,CAP=1310,START=96;
 const artMeta=JSON.parse(await fs.readFile('assets/design-history/ch04-png-art-metadata.json','utf8'));
 const artwork=(key,x,y,w,h,bounds)=>{const m=artMeta[key];if(!m)throw Error('Missing PNG '+key);return `<svg class="science-illustration ip-art" x="${x}" y="${y}" width="${w}" height="${h}" viewBox="${(bounds||m.bounds).join(' ')}" preserveAspectRatio="xMidYMid meet"><image href="../../figures/class-6/science/ch04/png/${key}.png" x="0" y="0" width="${m.width}" height="${m.height}"/></svg>`;};
 md=md.replace(/(?<!### )Activity 4\.5/g,'the investigation with two bar magnets').replace(/(?<!### )Activity 4\.6/g,'the preceding compass investigation');
 let sourcePage=1,atoms=[];
 const label=(s,x,y,c='se-caption',anchor='start')=>`<text class="${c}" x="${x}" y="${y}" text-anchor="${anchor}">${E(s)}</text>`;
 const lineSource=l=>l.map(w=>w.map(p=>p.k==='n'?p.s:(p.k==='b'?'**':'*')+p.s+(p.k==='b'?'**':'*')).join('')).join(' ');
 const lines=(ls,x,y,c='se-copy',lead=LEAD,size=23,measure=R-x)=>`<text class="${c}" x="${x}" y="${y+size}">${ls.map((l,i)=>{
  const justify=c==='se-copy'&&i<ls.length-1&&l.length>2;
  const extra=justify?Math.max(0,(measure-textWidth(lineSource(l)))/(l.length-1)):0;
  return `<tspan x="${x}"${i?` dy="${lead}"`:''}${justify?' data-justified="'+measure+'"':''}>${l.map((w,j)=>j&&justify?`<tspan dx="${extra.toFixed(4)}"> ${word(w)}</tspan>`:(j?' ':'')+word(w)).join('')}</tspan>`;
 }).join('')}</text>`;

 const txt=(s,x,y,w=W,c='se-copy')=>lines(wrap(s,w),x,y,c);
 const add=(h,render,type,text='',extra={})=>{const a={h,render,type,text,sourcePage,...extra};atoms.push(a);return a;};
 const icon=(kind,x,y,size=38)=>{const paths={magnet:'M6 4v15q0 11 10 11t10 -11V4h-7v15q0 4 -3 4t-3 -4V4ZM6 12h7M19 12h7',compass:'M16 2a14 14 0 1 0 0 28a14 14 0 1 0 0 -28M21 8l-3 10 -7 6 3 -10Z',eye:'M2 16q14 -19 28 0q-14 19 -28 0ZM16 11a5 5 0 1 0 0 10a5 5 0 1 0 0 -10',pencil:'M7 25l2 -9L23 2l7 7L16 23ZM9 16l7 7M21 4l7 7',compare:'M3 9h23m-6 -6 6 6 -6 6M29 23H6m6 -6 -6 6 6 6',clip:'M10 23V9q0 -8 8 -8t8 8v14q0 7 -6 7t-6 -7V9q0 -3 3 -3t3 3v14',question:'M8 9q0 -8 9 -8t9 8q0 5 -9 10v4M17 28v2'};return `<svg class="fb-icon" x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 32 32"><path d="${paths[kind]||paths.magnet}"/></svg>`;};
 const rule=(y,x=L,w=W,c='fb-rule')=>`<line class="${c}" x1="${x}" x2="${x+w}" y1="${y}" y2="${y}"/>`;
 const cues=[
  ['Some pencil boxes shut','connect','Everyday connection'],
  ['The filings help you locate','reason','What this rules out'],
  ['The pattern suggests','explain','The mechanism'],
  ['Now here is a question. Suppose you break','imagine','A thought experiment'],
  ['Earth has a magnetic field','explain','The mechanism'],
  ['The stroking magnet does not','explain','The mechanism'],
  ['The round pencils reduce','explain','The mechanism'],
  ['An initially unmagnetised iron bar','explain','The mechanism'],
  ['A magnet attracts a plain piece','reason','What this rules out'],
  ['The needle turns in response','explain','The mechanism'],
  ['A compass responds to the local','connect','Everyday connection']
 ];
 function para(s,opt={}){const {x=L,w=W,gap=14,c='se-copy'}=opt,ls=wrap(s,w),cue=cues.find(([prefix])=>s.startsWith(prefix)),offset=cue?64:0;return add(ls.length*LEAD+gap+offset,y=>(cue?learningCue(cue[1],cue[2],x+3,y,E):'')+lines(ls,x,y+offset,c,LEAD,23,w),'body',s);}
 function heading(s){const ls=wrap(s,W,'h'),h=ls.length*40+22;return add(h,y=>lines(ls,L,y,'se-heading',40,28),'heading',s);}

 function writing(y,n=2,x=L+59,w=W-59){return Array.from({length:n},(_,i)=>rule(y+i*46,x,w,'fb-writing')).join('');}
 function prompt(s,kind='observe'){
  const copy=s.replace(/^\*\*(Think:|Observe:|Predict:)\*\*\s*/,''),measure=W-48,ls=wrap(copy,measure),h=ls.length*LEAD+80;
  add(h+20,y=>`<g class="se-feature--${kind}"><rect class="se-prompt" x="${L}" y="${y}" width="${W}" height="${h}"/><line class="se-think-rule" x1="${L}" x2="${R}" y1="${y}" y2="${y}"/>`+learningCue(kind,'',L+24,y+10,E)+lines(ls,L+24,y+61,'se-copy',LEAD,23,measure)+'</g>','prompt',copy);
 }
 function imageAtom(key,height,caption='',width=W){const m=artMeta[key];if(m)height=Math.min(height,width*m.bounds[3]/m.bounds[2]);return add(height+(caption?48:20),y=>artwork(key,526-width/2,y,width,height)+(caption?label(caption,526,y+height+29,'se-caption','middle'):''),'art','Illustration: '+key,{art:key});}
 const figureSpec={shapes:['types',166,'Bar · U-shaped · Ring · Disc · Cylinder'],filings:['filings',310,'Iron filings gather most densely near the two poles.'],broken:['broken',255,'Each piece has both poles. A thought experiment: do not break a magnet.'],hanging:['suspended',320,'A suspended magnet must be free to turn.'],compass:['compass',435,'A freely turning needle rests on a pivot.'],fish:['fish',275,'A floating model demonstrates the principle.'],games:['games',380,'Four ways to explore magnetic attraction and repulsion.'],store:['keepers',215,'Soft-iron keepers join unlike poles at both ends.'],rings:['rings',385,'X: upper ring. Y: lower ring.'],zigzag:['zigzag',215,'Neighbouring ends attract. Identify all six poles.']};
 function figure(key){
 const [art,h,caption]=figureSpec[key];const a=imageAtom(art,h,caption);a.type='figure';a.text='Figure: '+key;return a;}
 function activity(title,blocks,key,num){
  const reflections=blocks.filter(b=>/^\*\*(Think:|Predict:|Observe:)/.test(b));
  blocks=blocks.filter(b=>!/^\*\*(Think:|Predict:|Observe:)/.test(b));
  const sideX=656,sideW=283,textRight=625,inner=[],pictures=[];
  const zones={
   3:[{from:1,to:6,art:[{key:'suspended',caption:['Suspend the magnet','from its centre.']}]}],
   4:[{from:1,to:5,art:[{key:'stroke',caption:['Stroke in one direction.']}]},{from:7,to:9,art:[{key:'floating-compass',caption:['Float the needle on cork.']}]}],
  }[num]||[];
  let yy=72;
  for(const b of blocks){
   if(b==='**What to do:**')continue;
   const m=b.match(/^(\d+)\.\s+([\s\S]+)/),n=m?+m[1]:0,copy=m?m[2]:b;
   const zone=zones.find(z=>n>=z.from&&n<=z.to);
   if(zone&&n===zone.from){
    zone.top=yy;let ay=yy+3;
    for(const a of zone.art){const bounds=[...artMeta[a.key].bounds];if(a.half!==undefined){bounds[2]/=2;bounds[0]+=a.half*bounds[2];}
     const ah=sideW*bounds[3]/bounds[2];pictures.push({...a,bounds,y:ay,h:ah});ay+=ah+24+a.caption.length*23+28;}
    zone.bottom=ay-14;
   }
   const x=m?143:L+24,w=(zone?textRight:R-24)-x,ls=wrap(copy,w);
   inner.push({ls,x,w,y:yy,n:m?.[1]});yy+=ls.length*LEAD+12;
   if(zone&&n===zone.to)yy=Math.max(yy,zone.bottom)+10;
  }
  const h=yy+16;if(h>CAP)throw Error('Activity needs refitting: '+title+' '+h);
  const tabW=W;
  add(h+22,y=>`<rect class="se-activity-panel" x="${L}" y="${y}" width="${W}" height="${h}"/><rect class="se-activity-tab" x="${L}" y="${y}" width="${tabW}" height="43"/>`+label('The setup',L+24,y+29,'se-activity-tab-text')+inner.map(r=>(r.n?label(r.n+'.',L+25,y+r.y+23,'se-activity-step'):'')+lines(r.ls,r.x,y+r.y,'se-copy',LEAD,23,r.w)).join('')+pictures.map(a=>artwork(a.key,sideX,y+a.y,sideW,a.h,a.bounds)+a.caption.map((t,i)=>label(t,sideX+sideW/2,y+a.y+a.h+27+i*23,'se-caption','middle')).join('')).join(''),'activity',title+'\n'+blocks.join('\n'),{activity:num});
  if(reflections.length)prompt(reflections.map(s=>s.replace(/^\*\*(Think:|Observe:|Predict:)\*\*\s*/,'')).join(' '));
 }

 function table(raw,title){let rows=raw.split('\n').filter(s=>s.trim().startsWith('|')).map(s=>s.trim().slice(1,-1).split('|').map(v=>v.trim())).filter(r=>!r.every(v=>/^:?-+:?$/.test(v)));
 rows=rows.filter((r,i)=>i===0||r.some(v=>v));if(rows[0][0]==='S. no.')rows=rows.map(r=>r.slice(1));const count=rows[0].length,cw=W/count;let yy=title?48:8;
 const rr=rows.map((r,i)=>{const ls=r.map(s=>wrap(s,cw-24,'n',.8));const h=Math.max(i?56:52,Math.max(...ls.map(l=>l.length))*25+24),o={ls,y:yy,h,i};yy+=h;return o;});
 add(yy+24,y=>(title?label(title,L,y+23,'se-caption se-bold'):'')+rr.map(r=>(r.i===0?`<rect class="fb-table-head" x="${L}" y="${y+r.y}" width="${W}" height="${r.h}" rx="8"/>`:'')+rule(y+r.y+r.h)+r.ls.map((l,i)=>lines(l,L+i*cw+12,y+r.y+12,'se-copy se-table-copy'+(r.i===0?' se-bold':''),25,18.4)).join('')).join(''),'table',title+'\n'+rows.map(r=>r.join(' | ')).join('\n'));}
 const safety={1:'**Safety:** Keep small magnets and objects away from young children. Never put a magnet in your mouth.',2:'**Safety:** Do not touch your eyes or breathe in iron filings. Keep them on the paper, collect them carefully and wash your hands afterwards.',4:'**Safety:** Sewing needles are sharp. Ask an adult to tape the needle to the cork. Keep its point away from hands.',7:'**Safety:** Use only smooth-edged glass handled by your teacher; do not use broken glass.'};
 const activityArt={2:'filings',3:'hanging',4:'bowl',5:'forces',6:'near',7:'barrier'};
 for(const match of md.matchAll(/\*\*\[ PAGE (\d+)[^\n]*\*\*([\s\S]*?)(?=\*\*\[ PAGE|$)/g)){sourcePage=+match[1];let fig=0;
 const bs=match[2].split(/\r?\n\s*\r?\n/).map(s=>s.trim()).filter(s=>s&&s!=='***');
 for(let i=0;i<bs.length;i++){const b=bs[i];if(b.startsWith('# '))continue;
 if(b.startsWith('### Activity')){const title=b.replace(/^### /,'').replace(' — ',' · '),num=+title.match(/4\.(\d+)/)[1],items=[];while(i+1<bs.length&&!/^(#|\*\*Table|\||>)/.test(bs[i+1])){const next=bs[i+1];if(num===6&&next.startsWith('The needle turns in response'))break;i++;if(/^\d+\./.test(next))items.push(...next.split(/\r?\n(?=\d+\.)/));else items.push(next);}if(safety[num])items.push(safety[num]);activity(title,items,activityArt[num],num);continue;}
 if(/^#{2,3} /.test(b)){heading(b.replace(/^#{2,3} /,''));if(sourcePage===19)para('Write answers and copy any tables into your notebook. Explain which observation supports each conclusion.');continue;}
 if(b.startsWith('Now here is a question. Suppose you break')){let thought=b;while(i+1<bs.length&&!bs[i+1].startsWith('***'))thought+=' '+bs[++i];prompt(thought,'imagine');continue;}
 if(b.startsWith('>')){if(b.includes('**Illustration:')){fig++;const key=({2:'shapes',6:'broken',9:'compass',11:'fish',16:'games',17:'store'})[sourcePage]||(sourcePage===20?(fig===1?'rings':'zigzag'):null);if(sourcePage===1)imageAtom('opener-vignette',479,'',1052);else if(key)figure(key);}continue;}
 if(b.startsWith('**Table')){if(bs[i+1]?.startsWith('|')){para('Copy these headings into your notebook and record your predictions and observations there.');let raw=bs[++i].replace('Material it is made of','Material').replace('Will it stick? (my prediction)','Prediction').replace('Did it stick? (what I saw)','Observation').replace('Material placed in between','Material').replace('What happened to the needle','Needle observation');raw=raw.split('\n').filter(r=>!/^\| [4-8] \|\s*\|/.test(r)).join('\n');table(raw,b.replaceAll('**',''));}continue;}
 if(b.startsWith('|')){table(b,'');continue;}
 if(/^\*\*(Think:|Predict:)/.test(b)){prompt(b);continue;}
 if(b.startsWith('- ')){for(const item of b.split(/\r?\n(?=- )/))para('• '+item.slice(2),{gap:16});continue;}
 if(b.startsWith('(i)')){for(const item of b.split(/\r?\n/))para(item,{gap:18});continue;}
 para(b);
 }
 // Preserve the added explanatory reading in the main text measure.
 if(sourcePage===6)imageAtom('filings',230,'Filings align and form chains; the pattern is not a direct force measurement.');
 if(sourcePage===13)imageAtom('forces',280,'Compare facing poles with the observed direction of movement.');
 const notes=context[sourcePage]||[];for(const note of notes)para(note);
 }
 // The optional butterfly experiment has its own foreground image and caption.
 sourcePage=21;imageAtom('butterfly',340,'Keep a visible gap between the magnet and the paper clip.',460);
 {const a=atoms.pop(),i=atoms.findIndex(a=>a.sourcePage===21&&a.text.includes('Make a flying butterfly'));atoms.splice(i+1,0,a);}
 {const i=atoms.findIndex(a=>a.text==='Figure: broken');if(i>=0){const a=atoms.splice(i,1)[0],j=atoms.findIndex(a=>a.text.startsWith('Now here is a question. Suppose you break'));atoms.splice(j+1,0,a);}}
 // Figures stay with the passage that introduces them, never as orphan pictures.
 for(let i=1;i<atoms.length;i++)if(['figure','art'].includes(atoms[i].type)&&atoms[i].sourcePage!==1&&atoms[i-1].type==='body'){
  const a=atoms[i-1],b=atoms[i];if(a.h+b.h<=CAP){atoms.splice(i-1,2,{h:a.h+b.h,type:'illustrated-reading',sourcePage:a.sourcePage,text:a.text+'\n'+b.text,render:y=>a.render(y)+b.render(y+a.h)});i--;}
 }
 // Exercise stems, response space and their diagrams stay together.
 for(let i=0;i<atoms.length;i++){if(/^\*\*\d+\.\*\*/.test(atoms[i].text)){let end=i+1;while(end<atoms.length&&atoms[end].sourcePage>=19&&!/^\*\*\d+\.\*\*/.test(atoms[end].text)&&!['heading','closing'].includes(atoms[end].type))end++;
 const group=atoms.slice(i,end),num=+group[0].text.match(/\d+/)[0],space=0,h=group.reduce((s,a)=>s+a.h,0)+space;
 if(h>CAP)continue;atoms.splice(i,end-i,{h,type:'question',text:group.map(a=>a.text).join('\n'),sourcePage:group[0].sourcePage,render:y=>{let yy=y;return group.map(a=>{const s=a.render(yy);yy+=a.h;return s;}).join('')+(space?writing(yy+32,2,L,W):'');}});}}
 // Place the illustration first on the opening page, as a large narrative scene.
 const first=atoms.filter(a=>a.sourcePage===1),art=first.find(a=>a.type==='art');atoms=atoms.filter(a=>a.sourcePage!==1);
 const pages=[{atoms:[art,...first.filter(a=>a!==art)],start:230}];
 // Deliberate page plan: one complete lesson per sheet, then exercise pages.
 for(let sp=2;sp<=0;sp++){
  const unit=atoms.filter(a=>a.sourcePage===sp);let h=unit.reduce((s,a)=>s+a.h,0);
  if(h>CAP){const body=unit.filter(a=>a.type==='body'),trim=Math.min(8,(h-CAP)/body.length);for(const a of body)a.h-=trim;h=unit.reduce((s,a)=>s+a.h,0);}
  if(h>CAP+0.001)throw Error('Lesson '+sp+' needs editing its page plan: '+h+' / '+CAP);
  pages.push({atoms:unit,start:START});
 }
 // Refit the full chapter after the edited opener, keeping each component whole.
 atoms=atoms.filter(a=>a.sourcePage>=2);
 // Whole-component packing, with a strong preference for lesson boundaries.
 const N=atoms.length,dp=Array(N+1).fill(Infinity),ends=Array(N);dp[N]=0;
 function valid(a,b){if(atoms[b-1].type==='heading')return false;for(let j=b-1;j>=a;j--){if(atoms[j].type==='heading'){return atoms.slice(j+1,b).reduce((s,x)=>s+x.h,0)>=165;}if(atoms[j].h>180)break;}return true;}
 for(let a=N-1;a>=0;a--){let h=0;for(let b=a+1;b<=N;b++){h+=atoms[b-1].h;if(h>CAP)break;if(!valid(a,b))continue;const gap=CAP-h,boundary=b===N||atoms[b].sourcePage!==atoms[b-1].sourcePage;const cost=1e7+gap*gap*(b===N?.1:1)+(boundary?0:12000)+dp[b];if(cost<dp[a]){dp[a]=cost;ends[a]=b;}}}
 if(!Number.isFinite(dp[0])){const i=dp.findLastIndex((v,i)=>i<N&&!Number.isFinite(v));throw Error('Unable to fit near '+JSON.stringify(atoms.slice(Math.max(0,i-2),i+5).map(a=>({type:a.type,h:a.h,text:a.text.slice(0,65)}))));}
 for(let a=0;a<N;){const b=ends[a];pages.push({atoms:atoms.slice(a,b),start:START});a=b;}
 if(process.argv.includes('--measure')){
  for(let i=0;i<pages.length;i++){const p=pages[i];console.log(JSON.stringify({page:i+1,end:p.start+p.atoms.reduce((s,a)=>s+a.h,0),blocks:p.atoms.map(a=>({kind:a.type,h:a.h,source:a.sourcePage,text:a.text.slice(0,80)}))}));}
  return;
 }
 // Preserve the original navy-and-gold chapter badge and display title.
 const opener=()=>`<g aria-label="Chapter 4"><path class="food-gold-tag" d="M65 0H222V168Q222 204 187 214L80 239V0Z"/><path class="food-navy" d="M65 0H210V157Q210 192 178 203L65 231Z"/><text class="food-text food-white science-chapter-label" x="138" y="58" text-anchor="middle">CHAPTER</text><text class="food-text food-white science-chapter-number" x="138" y="177" text-anchor="middle">4</text></g>`+label('SCIENCE AROUND US',248,67,'se-label')+label('Exploring Magnets',248,160,'se-title')+rule(195,248,715,'se-accent');
 await fs.mkdir(dir,{recursive:true});const audit=[];
 for(let ix=0;ix<pages.length;ix++){const n=ix+1,p=pages[ix];let y=p.start;const content=p.atoms.map(a=>{const s=a.render(y);y+=a.h;return `<g data-content-kind="${a.type}">${s}</g>`;}).join('\n');if(y>1415)throw Error('Overflow page '+n+' '+y);
 const html=`<section class="page page--food page--science-editorial page--illustrated${n===1?' page--opener':''}" data-science-chapter="4" data-folio="${n}"${n===pages.length?' data-close':''}><div class="page__body"><div class="page__main"><svg class="food-sheet science-sheet science-editorial" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1052 1514" aria-label="Exploring Magnets, page ${n}">${n===1?opener():''}${content}</svg></div></div></section>\n`;
 await fs.writeFile(`${dir}/p${String(n).padStart(3,'0')}.html`,html);audit.push({page:n,end:y,fill:Math.round((y-p.start)/(1415-p.start)*100),sourcePages:[...new Set(p.atoms.map(a=>a.sourcePage))],text:p.atoms.map(a=>a.text)});console.log(`p${n}: ${y}/1415, ${audit.at(-1).fill}%`);}
 for(const f of await fs.readdir(dir))if(/^p\d+\.html$/.test(f)&&+f.slice(1,4)>pages.length)await fs.unlink(`${dir}/${f}`);
 await fs.writeFile('assets/design-history/ch04-page-audit.json',JSON.stringify(audit,null,2));
 await fs.writeFile('assets/design-history/ch04-illustrated-manifest.json',JSON.stringify({pages:pages.length,trim:'189 × 272 mm',bodyLeading:LEAD,writingRuleSpacingMM:46*189/1052,source:'ch04-edited-reading-copy.md',design:'Class 6 illustrated; established furniture; justified paragraphs'},null,2));
 await (await import('./science-botanical.mjs')).applyBotanical(dir);
}




