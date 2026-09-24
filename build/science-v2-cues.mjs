// V2 panel headers share an optical size, title baseline and icon-to-label gap.
// Keep the familiar head/question mark and magnifier independent of V1 assets.
const cues = {
 think: {
  title: 'Think It Through',
  titleClass: 'se-cue-title',
  paths: 'M8 21v-4c-2.6-1.4-4-3.7-4-6.4C4 6.4 7.4 3 11.7 3c4.2 0 7.3 3.1 7.3 7.2v1l2 3.3h-3V18h-4v3Z M9 8a2.2 2.2 0 0 1 4.4 0c0 1.5-2.2 1.6-2.2 3.2 M11.2 14h.01',
 },
 setup: {
  title: 'Investigate',
  titleClass: 'se-activity-tab-text',
  paths: 'M16.5 10a6.5 6.5 0 1 1-13 0 6.5 6.5 0 1 1 13 0Z M14.7 14.7 21 21',
 },
};

export function v2PanelIconPath(kind) {
 const cue = cues[kind];
 if (!cue) throw new Error(`Unknown V2 panel heading: ${kind}`);
 return cue.paths;
}

export function v2PanelHeading(kind, left, baseline, {activityNumber}={}) {
 const cue = cues[kind];
 if (!cue) throw new Error(`Unknown V2 panel heading: ${kind}`);
 if(activityNumber!==undefined&&(kind!=='setup'||!/^\d+\.[1-9]\d*$/.test(activityNumber)))throw new Error('Activity numbering must be chapter.sequence on a setup panel');
 const title=activityNumber===undefined?cue.title:`Activity ${activityNumber}`;
 // Align visible icon ink with the label's capitals and descender, not its em box.
 return `<g class="v2-panel-heading v2-panel-heading--${kind}" data-feature="${kind}" aria-label="${title}"><svg class="v2-panel-icon" x="${left-4}" y="${baseline-22}" width="32" height="32" viewBox="0 0 24 24" aria-hidden="true"><path d="${cue.paths}"/></svg><text class="v2-panel-title ${cue.titleClass}" x="${left+40}" y="${baseline}">${title}</text></g>`;
}
