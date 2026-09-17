import assert from 'node:assert/strict';
import {scienceContract} from './science-contract.mjs';
import fs from 'node:fs/promises';
import {reviseFood} from './revise-science-food.mjs';
for(const title of ['Investigate','What Did You Notice?','Imagine This','Follow the Evidence','How It Works'])assert.doesNotThrow(()=>scienceContract('fixture',`<text class="se-cue-title">${title}</text>`));
for(const bad of ['<text class="se-cue-title">Read the evidence</text>','<image class="se-cue-png" href="painted.png"/>','<p>If the pins cling to it, the needle has become a magnet.</p>','<p>water, which are essential but are not nutrients</p>','<line class="fb-writing"/>'])assert.throws(()=>scienceContract('fixture',bad));
console.log('10 science contract regression cases passed');
const food=await reviseFood(JSON.parse(await fs.readFile('assets/manuscripts/ch03-reading-groups.json','utf8')));
for(const title of ['Test for starch','Test for fat','Test for protein']){
 const i=food.findIndex(g=>g.kind==='activity'&&g.title.endsWith(title));
 assert.ok(i>=0,title);
 assert.ok(!food[i].items.some(t=>/indicates the presence|shows that the food contains/.test(t)),title+' gives away the result');
 assert.equal(food[i+1].kind,'prompt');assert.equal(food[i+2].feature,'explain');
}
assert.ok(!JSON.stringify(food).includes('p017-screen.png'));
assert.ok(!JSON.stringify(food).includes('Activity 3.5.'));
console.log('Food investigation order and retired-reference regressions passed');
