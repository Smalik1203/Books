// Small, meaningful identification illustrations for otherwise text-only pages.
// Keep this separate from feature icons and from full instructional figures.
import fs from 'node:fs';
const catalog=JSON.parse(fs.readFileSync(new URL('../assets/design-history/science-page-images/catalog.json',import.meta.url),'utf8'));
export const pageImageReserve=220;
export function hasContentImage(html){
 return [...String(html).matchAll(/<(?:image|img)\b[^>]*(?:href|src)="([^"]+)"/g)].some(m=>!/(?:icon|cues\/|think-it-through)/i.test(m[1]));
}
const escape=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
export function pageIllustration(html,grade,chapter){
 const choices=catalog[`${grade}-${Number(chapter)}`];if(!choices)throw Error('No page illustration catalogue for '+grade+'/'+chapter);
 const plain=html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').toLowerCase();
 let choice=choices[0],best=-1;
 for(const [i,item] of choices.entries()){
  const score=(item.priorityTerms?.some(t=>plain.includes(t.toLowerCase()))?1000:0)+item.terms.reduce((n,t)=>n+(plain.includes(t.toLowerCase())?t.split(' ').length:0)+(plain.slice(0,500).includes(t.toLowerCase())?6*t.split(' ').length:0),0)*(i===0?.45:1);
  if(score>best){choice=item;best=score;}
 }
 const caption=choice.caption.split('|');
 // A 180-unit subject, with its identification beside it, at normal caption size.
 const markup=`<g data-page-illustration="${escape(choice.file)}"><image class="science-illustration" href="../../${choice.file}" x="209" y="20" width="290" height="180" preserveAspectRatio="xMidYMid meet"><title>${escape(caption.join(' '))}</title></image><text class="se-caption" x="539" y="100">${caption.map((s,i)=>`<tspan x="539"${i?' dy="27"':''}>${escape(s)}</tspan>`).join('')}</text></g>`;
 return {html:markup,height:pageImageReserve,file:choice.file,caption:caption.join(' '),matchScore:best};
}
export function completeIllustratedPage(page,grade,chapter){
 if(hasContentImage(page.parts))return page;
 const illustration=pageIllustration(page.parts,grade,chapter);
 if(page.end+illustration.height>1415)throw Error(`Class ${grade} chapter ${chapter}: reserve space for an image on ${page.title||page.titleRole} (ends ${page.end})`);
 const top=page.end;
 page.parts+=`<g transform="translate(0 ${top})">${illustration.html}</g>`;
 page.end+=illustration.height;page.pageIllustration=illustration;
 if(page.blockAudit)page.blockAudit.push({id:'page-illustration',type:'figure',text:illustration.caption,artKey:illustration.file,top,bottom:page.end});
 return page;
}
