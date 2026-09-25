import fs from 'node:fs';
import assert from 'node:assert/strict';
const dirs=fs.readdirSync('pages/class-6').filter(d=>d.startsWith('math-ch'));
const clean=s=>s.replace(/<!--[\s\S]*?-->/g,'').replace(/<[^>]+>/g,'').replace(/&nbsp;|&#160;/g,' ');
const closingOld='A picture of data can look good and still give the wrong idea of the facts. When you make one, check that it does not mislead the people who will read it. When you read one, check it too, so that you are not misled yourself.';
const closingNew='A picture of data can look good but mislead. Check that your pictures show the facts fairly, and check the pictures you read too.';
const norm=s=>clean(s).replace(/\s+/g,' ').replace(closingOld,'CLOSING').replace(closingNew,'CLOSING').replace(/\b(?:Fig(?:ure)?s?\.?|Tables?)\s*\d+\.\d+(?:(?:\s*,\s*|\s+and\s+|\s+to\s+|\s*[–−-]\s*)\d+\.\d+)*/gi,'REF').replace(/\(repeated from Section 6\.1, for Exercise Set 6\.6\)|\(the shapes from Section 6\.1, repeated for Exercise Set 6\.6\)/g,'REPEATED').replace(/\s+/g,'');
let captions=0;const defs=new Set(),texts=[];
for(const d of dirs){
 const read=base=>fs.readdirSync(`${base}/${d}`).filter(f=>/^p\d+\.html$/.test(f)).sort().map(f=>fs.readFileSync(`${base}/${d}/${f}`,'utf8')).join('\n');
 const old=norm(read('build/_class6-reference-before')),h=read('pages/class-6'),now=norm(h);
 if(old!==now){let i=0;while(old[i]===now[i])i++;throw Error(`${d}: text differs at ${i}: BEFORE ${old.slice(i-65,i+160)} AFTER ${now.slice(i-65,i+160)}`);}
 let n=0;const ch=JSON.parse(fs.readFileSync(`pages/class-6/${d}/chapter.json`,'utf8')).number;
 for(const m of h.matchAll(/<(figcaption|caption)\b[^>]*>([\s\S]*?)<\/\1>/g)){
  const label=clean(m[2]).trim().match(/^(Fig(?:ure)?\.?|Table)\s*(\d+\.\d+)/);if(!label)continue;
  assert.equal(label[2],`${ch}.${++n}`,d+' caption sequence');
  const key=(label[1].startsWith('T')?'Table ':'Figure ')+label[2];assert(!defs.has(key),'duplicate '+key);defs.add(key);captions++;
 }
 texts.push([d,clean(h)]);
}
let refs=0;
for(const [d,h] of texts)for(const m of h.matchAll(/\b(Fig(?:ure)?s?\.?|Tables?)\s*(\d+\.\d+(?:(?:\s*,\s*|\s+and\s+)\d+\.\d+)*)/g))for(const num of m[2].match(/\d+\.\d+/g)){
 const key=(m[1].startsWith('T')?'Table ':'Figure ')+num;assert(defs.has(key),`${d}: missing ${key}`);refs++;
}
console.log(`PASS: 10 chapters retain original content except the documented closing-paragraph edit; ${captions} captions in shared reading-order sequences; ${refs} caption/reference labels resolve.`);
