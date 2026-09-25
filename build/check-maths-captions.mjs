import fs from 'node:fs';
import path from 'node:path';
const voids=new Set(['br','hr','img','input','meta','link','col','wbr','area','base','embed','source','track']);
let figures=0,tables=0,chapters=0;const misplaced=[];
for(const cls of ['class-6','class-7','class-8','class-9','class-10']){
 for(const ent of fs.readdirSync(path.join('pages',cls),{withFileTypes:true})){
  if(!ent.isDirectory()||ent.name.startsWith('_'))continue;
  const dir=path.join('pages',cls,ent.name),metaPath=path.join(dir,'chapter.json');
  if(!fs.existsSync(metaPath))continue;
  const meta=JSON.parse(fs.readFileSync(metaPath,'utf8'));
  if(!/^Mathematics/.test(meta.subject||'Mathematics I'))continue;
  chapters++;
  for(const f of fs.readdirSync(dir).filter(f=>/^p\d+.*\.html$/.test(f))){
   const html=fs.readFileSync(path.join(dir,f),'utf8');
   const masked=html.replace(/\$\$[\s\S]*?\$\$|\$[^$]*?\$/g,m=>' '.repeat(m.length)).replace(/<!--[\s\S]*?-->/g,m=>' '.repeat(m.length));
   const stack=[];
   for(const m of masked.matchAll(/<\/?[a-zA-Z][^>]*>/g)){
    const tag=m[0].match(/^<\/?([\w-]+)/)[1].toLowerCase(),close=m[0].startsWith('</');
    if(close){
     const node=stack.pop();
     if(node?.tag==='figure'&&node.kids.includes('figcaption')){
      figures++;
      if(node.kids.at(-1)!=='figcaption')misplaced.push(path.join(dir,f));
     }
    }else{
     if(tag==='caption')tables++;
     stack.at(-1)?.kids.push(tag);
     if(!voids.has(tag)&&!m[0].endsWith('/>'))stack.push({tag,kids:[]});
    }
   }
  }
 }
}
console.log(JSON.stringify({chapters,figureCaptions:figures,tableCaptions:tables,figureCaptionsNotLast:misplaced},null,2));
if(misplaced.length)process.exitCode=1;
