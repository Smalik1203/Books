import sharp from 'sharp';
import fs from 'node:fs/promises';
const pdf=process.argv.includes('--pdf'),dir='build/class-6/ch04-exploring-magnets'+(pdf?'-pdf-proofs':'-proofs');
const count=JSON.parse(await fs.readFile('assets/design-history/ch04-page-audit.json','utf8')).length;
for(let start=1;start<=count;start+=6){const composite=[];for(let i=0;i<6&&start+i<=count;i++){const file=pdf?`page-${String(start+i).padStart(2,'0')}.png`:`p${String(start+i).padStart(3,'0')}.png`;const input=await sharp(`${dir}/${file}`).resize({width:420}).png().toBuffer();composite.push({input,left:(i%3)*432,top:Math.floor(i/3)*617});}await sharp({create:{width:1296,height:1234,channels:3,background:'#d6d6d6'}}).composite(composite).png().toFile(`build/_magnets-${pdf?'pdf-':''}review-${start}.png`);}
