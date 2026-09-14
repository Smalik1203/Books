import {featureIcon} from './science-learning-cues.mjs';
// Geometry-preserving cleanup for all fixed Class 6 pages. Called by their compositors.
export function scienceSourceContract(html){
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
