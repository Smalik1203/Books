// Chapter 1 pilot: centre each image/caption pair on a shared column axis.
// Keep native artwork, displayed sizes, prose positions and page breaks intact.
import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';

const attr=(tag,name,value)=>tag.includes(` ${name}="`)
 ?tag.replace(new RegExp(` ${name}="[^"]*"`),` ${name}="${value}"`)
 :tag.replace('>',` ${name}="${value}">`);
const centre=(text,x)=>{
 text=text.replace(/<(?:text|tspan)\b[^>]*>/g,tag=>tag.includes(' x="')?attr(tag,'x',x):tag);
 return text.replace(/<text\b[^>]*>/,tag=>attr(tag,'text-anchor','middle'));
};

export function alignChapter1Figures(html){
 // A single image beside prose uses the whole 336-unit figure column,
 // including the narrow circuit illustration. No image is resized.
 html=html.replace(/<g transform="translate\(627 0\)">([\s\S]*?)<\/g>(<text class="se-caption"[\s\S]*?<\/text>)/g,(_,art,caption)=>{
  const images=[...art.matchAll(/<image\b[^>]*>/g)];
  if(images.length===1){
   const width=+images[0][0].match(/ width="([^"]+)"/)[1];
   art=art.replace(images[0][0],attr(images[0][0],'x',(336-width)/2));
  }
  return `<g transform="translate(627 0)">${art}</g>${centre(caption,795)}`;
 });
 // Two observations sit in equal 421-unit columns, separated by 32 units.
 html=html.replace(/<g transform="translate\((89|548|542) ([\d.]+)\)">(<image\b[^>]*data-photo="(mirrors|refraction)"[\s\S]*?<\/image>)<\/g>(<text class="se-caption"[\s\S]*?<\/text>)/g,(_,x,y,art,key,caption)=>{
  const width=+art.match(/ width="([^"]+)"/)[1],left=key==='mirrors'?89:542;
  art=art.replace(/<image\b[^>]*>/,tag=>attr(tag,'x',(421-width)/2));
  return `<g transform="translate(${left} ${y})">${art}</g>${centre(caption,left+210.5)}`;
 });
 // The heating/nature pair uses the same column axes as the light pair.
 html=html.replace(/<image\b[^>]*data-photo="(candle|landscape)"[^>]*>/g,(tag,key)=>{
  const width=+tag.match(/ width="([^"]+)"/)[1];
  return attr(tag,'x',(key==='candle'?0:453)+(421-width)/2);
 });
 const axes={'Candle':210.5,'Mountain lake':663.5,'Earth from space':210.5,'Partial solar eclipse':663.5};
 html=html.replace(/<text class="se-caption"[^>]*>(Candle|Mountain lake|Earth from space|Partial solar eclipse)<\/text>/g,(text,label)=>centre(text,axes[label]));
 return html;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
 const dir='pages/class-7/ch01-ever-evolving-world-of-science-v2';let count=0;
 for(const file of await fs.readdir(dir))if(/^p\d+\.html$/.test(file)){
  const name=dir+'/'+file,before=await fs.readFile(name,'utf8'),after=alignChapter1Figures(before);
  if(after!==before){await fs.writeFile(name,after);count++;}
 }
 console.log(`Aligned figure columns on ${count} Chapter 1 pages; image sizes and prose preserved.`);
}
