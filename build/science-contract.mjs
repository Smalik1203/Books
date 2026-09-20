// Fast regression checks, not a substitute for the academic or printed-page review.
const allowed=new Set(['Investigate','What Did You Notice?','Think It Through','Imagine This','Follow the Evidence','How It Works']);
// Explicitly retained working copies may keep their original feature wording.
// Production chapters still use the current vocabulary by default.
const originalLabels=new Set(['The setup','What you saw','Work it out in your head','What this rules out','The mechanism']);
export function scienceContract(file,html,vocabulary='current'){
 if(!['current','september-2026-original'].includes(vocabulary))throw Error('Unknown science vocabulary: '+vocabulary);
 const labels=vocabulary==='september-2026-original'?originalLabels:allowed;
 const issues=[],plain=s=>s.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
 for(const m of html.matchAll(/<(?:text|div)\b[^>]*class="(?:se-cue-title|se-activity-tab-text|science-feature__title)"[^>]*>([\s\S]*?)<\/(?:text|div)>/g))if(!labels.has(plain(m[1])))issues.push('unlocked feature label: '+plain(m[1]));
 if(/class="se-cue-png"|science\/cues\/.*\.png/.test(html))issues.push('painted feature icon; use the locked 24-grid strokes');
 if(/se-cue--(?:evidence|comparison|connection|explanation|question|practical)/.test(html))issues.push('retired per-feature colour role');
 if(/THINK SPARK|The story begins|Threads of Curiosity|Pause and Ponder|Ready to Go Beyond/.test(plain(html)))issues.push('retired science feature alias');
 if(/<line class="fb-writing"/.test(html))issues.push('textbook answer rule');
 const text=plain(html);
 for(const phrase of ['If the pins cling to it, the needle has become a magnet.','being pulled around by the Earth','Whatever you put in the way, the magnet still turns','A plain piece of iron never repels anything.','He compared two groups of sailors who differed in one respect','water, which are essential but are not nutrients','roughage supplies no nutrients whatsoever'])if(text.toLowerCase().includes(phrase.toLowerCase()))issues.push('reintroduced misconception: '+phrase);
 if(issues.length)throw Error(file+' violates the science contract:\n'+issues.join('\n'));
}
