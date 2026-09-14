// Shared, repeatable furniture pass. Changes no reading copy or page breaks.
import fs from 'node:fs/promises';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {scienceSourceContract} from './science-source-contract.mjs';
const E=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
export async function applyBotanical(dir){
 const ch=JSON.parse(await fs.readFile(path.join(dir,'chapter.json'),'utf8'));
 for(const file of (await fs.readdir(dir)).filter(f=>/^p\d+\.html$/.test(f))){
  let html=await fs.readFile(path.join(dir,file),'utf8');
  html=html.replace(/ data-science-chapter="[^"]*"/g,'').replace(/(<section class="[^"]*")/,'$1 data-science-chapter="'+ch.number+'"');
  const n=Number(html.match(/data-folio="(\d+)"/)[1]),even=n%2===0;
  html=html.replace(/<!-- botanical-header -->[\s\S]*?<!-- \/botanical-header -->/g,'');
  html=html.replace(/<text class="se-running se-header-(?:title|tag)"[\s\S]*?<\/text>/g,'').replace(/<line class="se-rule" x1="89" y1="65" x2="963" y2="65"\/>/g,'');
  if(n!==1){let header=`<!-- botanical-header --><path class="se-botanical-shadow" d="M0 0H340L317 51Q312 63 291 63H0Z"/><path class="se-botanical-ribbon" d="M0 0H321L300 49Q295 63 274 63H0Z"/><path class="se-botanical-stem" d="M31 63Q34 30 60 7"/><path class="se-botanical-leaf" d="M36 46Q10 38 20 14Q38 23 36 46M42 33Q42 8 70 4Q64 26 42 33M33 60Q45 35 73 37Q61 57 33 60"/><text class="se-running se-botanical-chapter" x="96" y="41">CHAPTER ${E(ch.number)}</text><text class="se-running se-header-title" x="963" y="40" text-anchor="end">${E(ch.title)}</text><line class="se-footer-rule" x1="340" y1="58" x2="963" y2="58"/><!-- /botanical-header -->`;
   if(String(ch.number)==='1')header=header.replace(/<path class="se-botanical-stem"[\s\S]*?<text class="se-running se-botanical-chapter"/,'<circle class="se-botanical-stem" cx="46" cy="29" r="17"/><path class="se-botanical-stem" d="M59 42l14 15M38 29h16M46 21v16"/><text class="se-running se-botanical-chapter"');
   if(String(ch.number)==='3')header=header.replace(/<path class="se-botanical-stem"[\s\S]*?<text class="se-running se-botanical-chapter"/,'<circle class="se-botanical-stem" cx="46" cy="30" r="21"/><circle class="se-botanical-stem" cx="46" cy="30" r="14"/><text class="se-running se-botanical-chapter"');
   if(String(ch.number)==='4')header=header.replace(/<path class="se-botanical-stem"[\s\S]*?<text class="se-running se-botanical-chapter"/,'<path class="se-botanical-stem" d="M24 13v23q0 22 22 22t22 -22V13H56v23q0 10 -10 10t-10 -10V13ZM24 25h12M56 25h12"/><text class="se-running se-botanical-chapter"');
   html=html.replace(/(<svg class="food-sheet science-sheet science-editorial"[^>]*>)/,'$1'+header);
  }
  html=html.replace(/<!-- botanical-footer -->[\s\S]*?<!-- \/botanical-footer -->/g,'');
  html=html.replace(/<line class="se-footer-rule" x1="(?:154|89)" y1="1332"[\s\S]*?(?=<\/svg>)/,'');
  const footer=`<!-- botanical-footer --><line class="se-footer-rule" x1="${even?190:89}" y1="1340" x2="${even?963:862}" y2="1340"/><text class="se-running se-footer-label" x="${even?963:89}" y="1320" text-anchor="${even?'end':'start'}">LEARNLAB · SCIENCE 6</text><path class="se-botanical-shadow" d="${even?'M0 1320H137Q152 1320 160 1335L179 1369H0Z':'M1052 1320H915Q900 1320 892 1335L873 1369H1052Z'}"/><path class="se-botanical-ribbon" d="${even?'M0 1320H117Q132 1320 140 1335L159 1369H0Z':'M1052 1320H935Q920 1320 912 1335L893 1369H1052Z'}"/><text class="se-folio" x="${even?107:945}" y="1354" text-anchor="middle">${n}</text><!-- /botanical-footer -->`;
  html=html.replace(/<\/svg>(<\/div><\/div><\/section>)/,(ch.edition==='science-tall'?footer.replace('<!-- botanical-footer -->','<!-- botanical-footer --><g transform="translate(0 145)">').replace('<!-- /botanical-footer -->','</g><!-- /botanical-footer -->'):footer)+'</svg>$1');
  html=html.replace(/<text class="se-caption se-bold" x="89" y="([\d.]+)"[^>]*>(Table [\d.]+): ([^<]+)<\/text>/g,(_,y,num,title)=>`<rect class="se-table-band" x="89" y="${Number(y)-27}" width="874" height="40" rx="3"/><rect class="se-table-number" x="89" y="${Number(y)-27}" width="149" height="40" rx="3"/><text class="se-caption se-table-number-text" x="109" y="${y}">${num}</text><text class="se-caption se-bold" x="260" y="${y}">${title}</text>`);
  await fs.writeFile(path.join(dir,file),scienceSourceContract(html));
 }
}
if(process.argv[1]&&import.meta.url===pathToFileURL(path.resolve(process.argv[1])).href){for(const dir of process.argv.slice(2))await applyBotanical(dir);}
