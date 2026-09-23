import {readFile} from 'node:fs/promises';
export async function requireLegacyScience(dir){
 const metadata=JSON.parse(await readFile(dir+'/chapter.json','utf8'));
 if(metadata.palette==='science-g6-modern')throw Error(`This chapter uses the shared Class 6/Class 7 design. Run node build/compose-science-g6-modern.mjs ${metadata.number}; the historic compositor would overwrite preserved editorial corrections.`);
}
