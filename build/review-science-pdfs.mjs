import fs from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import sharp from 'sharp';
const run=promisify(execFile),chapters=['class-6/ch01-wonderful-world-of-science','class-6/ch02-diversity-in-the-living-world','class-6/ch03-food-on-our-plate','class-6/ch04-exploring-magnets','class-9/sci-ch01-exploration'];
const report=[];
for(const chapter of chapters){
 const slug=chapter.replace('/','-'),dir='build/_science-final-proof/'+slug;await fs.mkdir(dir,{recursive:true});
 const pdf='build/'+chapter+'.pdf',info=(await run('pdfinfo',[pdf])).stdout,count=+info.match(/Pages:\s+(\d+)/)[1];
 await run('pdftoppm',['-scale-to','1200','-png',pdf,dir+'/page'],{maxBuffer:2e6});
 const files=(await fs.readdir(dir)).filter(f=>/^page-\d+\.png$/.test(f)).sort().slice(0,count);
 for(let start=0;start<files.length;start+=6){const parts=[];for(let i=0;i<6&&start+i<files.length;i++)parts.push({input:await sharp(dir+'/'+files[start+i]).resize({width:400,height:576,fit:'contain',background:'white'}).png().toBuffer(),left:(i%3)*412,top:Math.floor(i/3)*590});await sharp({create:{width:1236,height:1180,channels:3,background:'#ddd'}}).composite(parts).png().toFile(dir+'/sheet-'+(start+1)+'.png');}
 const press=(await run('pdfinfo',['build/'+chapter+'-bleed.pdf'])).stdout;
 report.push({chapter,pages:count,trim:info.match(/Page size:\s+(.+)/)?.[1],press:press.match(/Page size:\s+(.+)/)?.[1],proofDirectory:dir});
 console.log(chapter+': '+count+' complete PDF pages rendered');
}
await fs.writeFile('assets/design-history/science-final-pdf-report.json',JSON.stringify(report,null,2));
