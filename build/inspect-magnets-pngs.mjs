import sharp from 'sharp';
import fs from 'node:fs/promises';
const dir='figures/class-6/science/ch04/png',out={};
for(const name of (await fs.readdir(dir)).filter(f=>f.endsWith('.png'))){
 const file=dir+'/'+name,m=await sharp(file).metadata();
 if(!m.hasAlpha)throw Error(name+' has no alpha channel');
 const {data,info}=await sharp(file).ensureAlpha().raw().toBuffer({resolveWithObject:true});
 let x0=info.width,y0=info.height,x1=0,y1=0,clear=0;
 for(let y=0;y<info.height;y++)for(let x=0;x<info.width;x++){
  const a=data[(y*info.width+x)*4+3];if(a<8)clear++;
  if(a>15){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
 }
 if(clear<info.width*info.height*.05)throw Error(name+' does not have a transparent surround');
 const pad=12;x0=Math.max(0,x0-pad);y0=Math.max(0,y0-pad);x1=Math.min(info.width-1,x1+pad);y1=Math.min(info.height-1,y1+pad);
 out[name.slice(0,-4)]={width:m.width,height:m.height,bounds:[x0,y0,x1-x0+1,y1-y0+1],transparentPercent:Math.round(clear/(info.width*info.height)*100)};
}
await fs.writeFile('assets/design-history/ch04-png-art-metadata.json',JSON.stringify(out,null,2));
console.log(JSON.stringify(out,null,2));
