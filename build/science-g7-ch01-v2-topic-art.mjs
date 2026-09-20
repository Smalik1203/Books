// Photo-derived transparent cutouts; originals and editing prompts are archived.
// Size actual photographs, not empty meet viewports: captions share their edges.
export const topicArtWords='Metal Ceramic Earth from space Partial solar eclipse Candle Mountain lake';
const E=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const photo=(key,alt,x,y,w,h)=>`<image class="science-illustration v2-topic-photo" data-photo="${key}" href="../../figures/class-7/science/ch01-v2/cutouts/${key}.png" x="${x}" y="${y}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"><title>${E(alt)}</title></image>`;
const labels={substances:['lemon','A whole lemon and two cut lemon halves'],circuit:['circuit','Wires, a lamp and a switch in a classroom circuit demonstration'],changes:['ice','A real ice cube on a wet wooden surface'],time:['sundial','Wire shadows on a stainless-steel sundial'],runners:['runners','Three children running, isolated from the original athletics-track photograph'],plant:['plant','A sunflower photographed outdoors'],mirrors:['mirrors','Dice and their reflections in a shiny surface']};
const ratios={lemon:1200/848,circuit:1227/1282,ice:1.5,sundial:960/467,runners:960/643,plant:1.5,mirrors:1.5,refraction:4/3};
export function topicArt(key,t,w=336){
 if(key==='materials')return {html:photo('metal-spoon','A metal teaspoon',0,0,62,62*2622/960)+photo('ceramic-spoons','Two ceramic spoons',90,0,w-90,(w-90)*706/960)+t('Metal',31,207,'se-caption','middle')+t('Ceramic',90+(w-90)/2,207,'se-caption','middle'),h:222,w};
 const spec=labels[key];if(!spec)throw Error('Unknown photographic topic: '+key);
 const h=Math.min(w/ratios[spec[0]],234),width=h*ratios[spec[0]];
 return {html:photo(...spec,0,0,width,h),h:h+12,w:width};
}
export function lightPair(t){
 // Two observations belonging to one topic, with a common top and photo height.
 return [
  {html:photo('mirrors',labels.mirrors[1],0,0,354,236),x:0,w:354,h:248},
  {html:photo('refraction','A straight pencil appears displaced through a glass of water',0,0,314.667,236),x:459,w:314.667,h:248}
 ];
}
export function wideTopicArt(key,t){
 if(key==='heat-water')return {html:photo('candle','A burning candle',0,0,300,225)+photo('landscape','A mountain lake and surrounding peaks, isolated as a photographic vignette',453,0,338.558,225)+t('Candle',0,252,'se-caption')+t('Mountain lake',453,252,'se-caption'),h:266};
 if(key==='light-water')return {html:photo('refraction','A straight pencil appears displaced through a glass of water',0,0,874,248),h:260};
 if(key==='earth-light')return {html:photo('earth','Earth cutout derived from a Galileo spacecraft photograph',0,9,421,228)+photo('eclipse','A partial solar eclipse photographed at Joshua Tree National Park',453,0,421,246)+t('Earth from space',210,277,'se-caption','middle')+t('Partial solar eclipse',663,277,'se-caption','middle'),h:288};
 throw Error('Unknown wide photographic topic: '+key);
}
