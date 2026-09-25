import fs from 'node:fs';
import {pageBlocks} from './jee-tools.mjs';
for(const [rel,last,count] of [['class-10/ch10-circles',11,1],['class-7/ch06-number-play',14,3]]){
 const name=n=>`pages/${rel}/p${String(n).padStart(3,'0')}.html`;
 const prev=fs.readFileSync(name(last-1),'utf8'),end=fs.readFileSync(name(last),'utf8');
 const a=pageBlocks(prev),b=pageBlocks(end);
 if(b.length!==1)throw Error('Already balanced');
 const moved=a.splice(-count);
 const write=(html,blocks)=>html.slice(0,html.indexOf('<div class="page__main">')+24)+'\n'+blocks.join('\n\n')+'\n    </div>\n  </div>\n</section>\n';
 fs.writeFileSync(name(last-1),write(prev,a));
 fs.writeFileSync(name(last),write(end,[...moved,...b]));
}
