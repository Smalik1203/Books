import {featureIcon} from './science-learning-cues.mjs';
// Geometry-preserving cleanup for all fixed Class 6 pages. Called by their compositors.
export function scienceSourceContract(html){
 // Chapter 2 table pilot: preserve every measured cell and page break.
 if(/data-science-chapter="2"/.test(html)){
  html=html.replace(/<!-- table-frame -->[\s\S]*?<!-- \/table-frame -->/g,'');
  html=html.replace(/<rect class="se-table-head"[^\n]+/g,table=>{
   const head=table.match(/^<rect[^>]*>/)[0],value=(s,a)=>Number(s.match(new RegExp('\\b'+a+'="([^"]+)"'))[1]);
   const x=value(head,'x'),y=value(head,'y'),w=value(head,'width');
   const rules=[...table.matchAll(/<line class="(?:se-rule|se-table-row-rule)"[^>]*\/>/g)];
   if(!rules.length)return table;
   const bottom=Math.max(...rules.map(m=>value(m[0],'y1')));
   const xs=[...table.matchAll(/<text class="se-copy se-table-copy se-bold"[^>]*>/g)].map(m=>value(m[0],'x'));
   const inset=xs[0]-x;
   const columns=xs.slice(1).map(cx=>`<line class="se-table-column-rule" x1="${cx-inset}" x2="${cx-inset}" y1="${y}" y2="${bottom}"/>`).join('');
   return table.replaceAll('class="se-rule"','class="se-table-row-rule"')+`<!-- table-frame -->${columns}<rect class="se-table-frame" x="${x}" y="${y}" width="${w}" height="${bottom-y}"/><!-- /table-frame -->`;
  });
 }
 const insetSetup=/data-science-chapter="[1-4]"/.test(html);
 html=html.replace(/<path class="se-activity-tab" d="M109 ([\d.]+)[^"]*"\/>/g,(_,y)=>`<rect class="se-activity-tab" x="89" y="${y}" width="874" height="43"/>`);
 html=html.replace(/<svg class="se-feature-icon se-feature--setup"[^>]*>[\s\S]*?<\/svg>/g,'');
 html=html.replace(/<rect class="se-activity-tab"[^>]*\/>/g,tag=>{
  const y=Number(tag.match(/\by="([^"]+)"/)[1]);
  tag=tag.replace(/\bx="[^"]+"/,'x="89"').replace(/\bwidth="[^"]+"/,'width="874"').replace(/\s+rx="[^"]+"/,'');
  return tag+(insetSetup?featureIcon('setup',109,y+6,30):featureIcon('setup',41,y+1));
 });
 html=html.replace(/(<rect class="se-activity-panel"[^>]*?)\s+rx="[^"]+"/g,'$1');
 html=html.replace(/<line class="fb-writing"[^>]*\/>/g,'');
 // Science activity headers: rounded upper corners join the header to the soft panel.
 if(insetSetup)html=html.replace(/<rect class="se-activity-tab"[^>]*\/>/g,tag=>{
  const y=Number(tag.match(/\by="([^"]+)"/)[1]);
  return `<path class="se-activity-tab" d="M109 ${y}H943Q963 ${y} 963 ${y+20}V${y+43}H89V${y+20}Q89 ${y} 109 ${y}Z"/>`;
 });
 if(insetSetup)html=html.replace(/<text class="se-activity-tab-text"[^>]*>[\s\S]*?<\/text>/g,tag=>tag.replace(/\bx="[^"]+"/g,'x="149"'));
 return html;
}
