// Locked science roles: one 24-unit grid and one stroke weight.
export const featureNames={setup:'The setup',observe:'What you saw',imagine:'Work it out in your head',reason:'What this rules out',explain:'The mechanism'};
const paths={setup:'M5 4h14v17H5ZM9 4V2h6v2M8 9h2m3 0h3M8 13h2m3 0h3M8 17h2m3 0h3',observe:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12ZM15 12a3 3 0 1 1-6 0 3 3 0 1 1 6 0',imagine:'M5 15a7 7 0 1 1 13-4v4h-3v6h-5v-4H5ZM9 8h5m-5 3h3',reason:'M3 6h8m-8 6h8m-8 6h8M16 4l5 5m0-5-5 5M16 15l2 2 4-5',explain:'M2 12h5m10 0h5M7 7l3 3m4 4 3 3M7 17l3-3m4-4 3-3M15 12a3 3 0 1 1-6 0 3 3 0 1 1 6 0'};
export function featureIcon(kind,x,y,size=40){if(!paths[kind])throw Error('Unknown science feature '+kind);return `<svg class="se-feature-icon se-feature--${kind}" x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[kind]}"/></svg>`;}
export function learningCue(kind,title,x,y,escape){
 if(kind==='connect')return `<text class="se-section-opener" x="${x}" y="${y+30}">${escape(title)}</text>`;
 if(kind==='compare')kind='observe';
 if(!featureNames[kind])throw Error('Unknown science cue '+kind);
 return `<g class="se-learning-cue se-feature--${kind}" data-feature="${kind}" aria-label="${featureNames[kind]}">${featureIcon(kind,x,y+1)}<text class="se-cue-title" x="${x+56}" y="${y+30}">${featureNames[kind]}</text></g>`;
}
