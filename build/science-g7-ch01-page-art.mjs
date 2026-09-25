// Deliberately authored illustrations for Chapter 1's four closing pages.
// Match the teaching role, never fall back to a repeated paper-plane cutout.
import {hasContentImage} from './science-page-illustrations.mjs';
// These figures no longer print a caption. Reserve the unchanged 280-unit image
// plus its top gap and lower breathing room, without the retired caption area.
export const chapter1ImageReserve=312;
const pageImageReserve=chapter1ImageReserve;
export const chapter1PageArt={
 'question-contexts':'A cake divided into equal halves beside folded paper and an envelope: different contexts for making something half.',
 'observable-evidence':'A magnifying glass over a leaf beside a notebook drawing of the same leaf.',
 'measuring-tools':'A ruler, pencil and stopwatch used to make and record measurements.',
 'rainwater-observation':'A shallow puddle on paving beside damp soil and grass after rain.'
};
export function completeChapter1Page(page){
 if(hasContentImage(page.parts))return page;
 const ids=(page.blockAudit||[]).map(b=>b.id);
 const key=page.titleRole==='reference'?'measuring-tools':page.titleRole==='assessment'?'rainwater-observation':
  ids.includes('question-answer-panel')?'question-contexts':
  ids.some(id=>id.startsWith('creative-vs-evidence'))?'observable-evidence':null;
 if(!key)throw Error('Author a meaningful Chapter 1 illustration for '+page.title+' ('+ids.join(', ')+')');
 const file=`figures/class-7/science/ch01-v2/${key}.png`,alt=chapter1PageArt[key],top=page.end;
 if(top+pageImageReserve>1415)throw Error('Chapter 1 illustration exceeds its reserved area');
 const height=Math.min(440,1415-top-32),width=824;
 // The image is sufficiently self-explanatory; accessibility text stays in title.
 // Do not print an extra generic identification sentence beneath it.
 page.parts+=`<g transform="translate(0 ${top})"><g data-page-illustration="${file}"><image class="science-illustration" href="../../${file}" x="114" y="10" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"><title>${alt}</title></image></g></g>`;
 page.end+=height+32;page.pageIllustration={file,caption:'',alt};
 if(page.blockAudit)page.blockAudit.push({id:'page-illustration',type:'figure',text:'',artKey:file,top,bottom:page.end});
 return page;
}
