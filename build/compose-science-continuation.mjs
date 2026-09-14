// Initial composition helper only. Rerunning replaces pages 6–8, including
// subsequent proof corrections. Final page files are the source of truth.
import fs from 'node:fs';
const dir='pages/class-6/ch01-wonderful-world-of-science';
const manuscript=fs.readFileSync('assets/manuscripts/LearnLab_G6_Ch01_Wonderful_World_of_Science.md','utf8');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function runs(s){return s.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).flatMap(t=>{const cls=t.startsWith('**')?'food-bold':t.startsWith('*')?'science-italic':'';return t.replace(/^\*+|\*+$/g,'').split(/\s+/).filter(Boolean).map(w=>({w,cls}));});}
function wrap(s,max=78){const lines=[];let line=[],len=0;for(const r of runs(s)){if(len+r.w.length+1>max&&line.length){lines.push(line);line=[];len=0;}line.push(r);len+=r.w.length+1;}if(line.length)lines.push(line);return lines;}
function text(s,y,{x=89,max=78,cls='science-copy',leading=29}={}){const lines=wrap(s,max);return {svg:`<text class="food-text ${cls}" x="${x}" y="${y}">${lines.map((line,i)=>`<tspan x="${x}"${i?` dy="${leading}"`:''}>${line.map(r=>r.cls?`<tspan class="${r.cls}">${esc(r.w)}</tspan>`:esc(r.w)).join(' ')}</tspan>`).join('')}</text>`,height:lines.length*leading};}
function shell(n,title,inside){return `<section class="page page--food" data-folio="${n}" data-reference-page="${n}"${n===8?' data-close':''}>
<div class="page__body"><div class="page__main"><svg class="food-sheet science-sheet" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1052 1369" aria-label="${title}">
<text class="food-text food-bold food-navy science-running" x="85" y="40">The Wonderful World of Science</text>
<line class="food-gold-rule" x1="422" y1="35" x2="957" y2="35"/><circle class="food-gold-tag" cx="957" cy="35" r="6"/>
${text(title,112,{cls:'food-teal science-section',max:45}).svg}
${inside}
<circle class="food-teal" cx="92" cy="1330" r="21"/><text class="food-text food-white science-folio" x="92" y="1338" text-anchor="middle">${n}</text>
<line class="food-gold-rule" x1="126" y1="1334" x2="957" y2="1334"/><circle class="food-gold-tag" cx="957" cy="1334" r="6"/>
</svg></div></div></section>\n`;}
function rules(y,count,gap){return Array.from({length:count},(_,i)=>`<line class="science-answer-rule" x1="89" y1="${y+i*gap}" x2="963" y2="${y+i*gap}"/>`).join('\n');}
function flow(y){const labels=['Observe','Question','Guess','Test','Examine the result'];let out='';labels.forEach((t,i)=>{const x=89+i*177;out+=`<rect class="food-panel" x="${x}" y="${y}" width="166" height="66" rx="12"/>`;out+=text(t,y+28,{x:x+12,max:13,cls:'food-bold science-running',leading:22}).svg;if(i<4)out+=`<path class="food-rule" d="M${x+166} ${y+33}h11m-5 -5 5 5 -5 5"/>`;});out+=`<path class="food-rule food-dots" d="M880 ${y+66}v28q0 18 -18 18H548q-18 0 -18 -18v-28"/><path class="food-rule" d="M525 ${y+73}l5 -7 5 7"/>`;return out;}
for(const n of [6,7,8]){
const section=manuscript.split(`**[ PAGE ${n} ]**`)[1].split('***')[0].trim();
const blocks=section.split(/\r?\n\s*\r?\n/).filter(b=>!b.startsWith('>'));
const title=blocks.shift().replace(/^## /,'');let y=160,out='',activity=false;
for(const b of blocks){
if(b.startsWith('### ')){
 if(n===6){out+=flow(y+4);y+=158;}
 if(n===7){out+=`<svg class="science-illustration" x="89" y="${y}" width="874" height="190" viewBox="0 0 2172 724" preserveAspectRatio="xMidYMid meet" overflow="hidden"><image href="../../figures/class-6/science/ch01-p007-everyday-science.png" width="2172" height="724"><title>A cook inspecting batter, a tailor checking a sewing machine, and an electrician inspecting a disconnected light fitting.</title></image></svg>`;y+=214;for(const [x,label] of [[235,'Cook'],[526,'Tailor'],[817,'Electrician']])out+=`<text class="food-text food-bold science-running" x="${x}" y="${y}" text-anchor="middle">${label}</text>`;y+=45;}
 const t=text(b.replace(/^### /,''),y,{cls:'food-teal food-bold science-lead',max:65});out+=t.svg;y+=t.height+18;activity=true;continue;
}
if(b.startsWith('- ')){for(const item of b.split(/\r?\n/)){const t=text('• '+item.replace(/^- /,''),y);out+=t.svg;y+=t.height+8;}const count=n===7?6:5;const gap=n===7?22:28;out+=rules(y+6,count,gap);y+=6+(count-1)*gap+40;continue;}
if(/^\d\. /.test(b)){for(const item of b.split(/\r?\n/)){const t=text(item,y);out+=t.svg;y+=t.height+12;}continue;}
const final=n===8&&b.startsWith('Science begins');const t=text(b,y,{cls:final?'food-teal food-bold science-lead':'science-copy',max:final?68:78});out+=t.svg;y+=t.height+12;
}
console.log(`page ${n}: last block ends near ${y}`);fs.writeFileSync(`${dir}/p00${n}.html`,shell(n,title,out));
}
