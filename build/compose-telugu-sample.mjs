import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'pages/class-3/ch01-chinni-thota');
const drawings = {
  chat: '<path d="M5 5h21v15H16l-6 5v-5H5z"/><path d="M10 10h11M10 15h7"/>',
  book: '<path d="M16 8C11 4 6 5 3 6v20c5-2 9-1 13 2 4-3 8-4 13-2V6c-4-1-9-2-13 2v20"/><path d="M7 11l5 1M7 16l5 1M21 12l4-1M21 17l4-1"/>',
  pencil: '<path d="M5 23L22 6l5 5-17 17-6 1zM19 9l5 5M5 23l5 5M21 28h8"/>',
  music: '<path d="M13 23V7l14-3v17M13 12l14-3"/><ellipse cx="8" cy="25" rx="5" ry="3"/><ellipse cx="22" cy="23" rx="5" ry="3"/>',
  leaf: '<path d="M5 27C-1 12 12 4 28 4c0 15-8 26-23 23zM5 27L24 8M12 20l-1-8M17 15l8 1"/>',
  eye: '<path d="M2 16C10 3 23 3 30 16 22 29 10 29 2 16z"/><circle cx="16" cy="16" r="5"/>',
  flower: '<path d="M16 21v10M16 27q-9-7-11-2 5 6 11 4"/><path d="M12 8C5-3-2 12 8 14-2 24 13 29 16 19c8 11 17-1 8-6 11-5-2-16-6-7-2-6-8-5-6 2z"/><circle cx="16" cy="13" r="4"/>',
  butterfly: '<path d="M16 13C1-4-3 15 11 18-2 26 14 32 16 19c7 16 20 3 8-1C38 6 23-2 16 13zM16 10v15M16 11l-4-6M16 11l5-6"/>',
  sun: '<circle cx="16" cy="16" r="7"/><path d="M16 1v4M16 27v4M1 16h4M27 16h4M5 5l3 3M24 24l3 3M5 27l3-3M24 8l3-3"/>',
};
const icon = (name, extra='') => `<svg class="tg-icon ${extra}" viewBox="0 0 32 32" aria-hidden="true">${drawings[name]}</svg>`;
const heading=(name,text)=>`<h3 class="tg-heading"><span class="tg-icon-disc">${icon(name)}</span>${text}</h3>`;
const kicker=(text)=>`<div class="tg-kicker"><span>${icon('leaf')} తెలుగు · 3వ తరగతి</span><span>${text}</span></div>`;
const footer=()=>`<div class="tg-garden-foot" aria-hidden="true">${icon('leaf')}${icon('flower')}${icon('leaf')}<span></span>${icon('butterfly')}</div>`;
const page=(n,content)=>`<section class="page telugu-page${n===1?' page--opener':''}" lang="te"${n===4?' data-close':''}>
<div class="page__body"><main class="page__main">${content}</main></div>${footer()}</section>`;
const img=(name,cls,alt)=>`<img class="${cls}" src="../../figures/class-3/telugu/${name}.png" alt="${alt}">`;
const line='<span class="tg-blank"></span>';
const pages = [
page(1,`${kicker('చూడు · చెప్పు')}
<div class="tg-title-row"><div class="tg-chapter-seed"><span>పాఠం</span><strong>1</strong>${icon('leaf')}</div><div><h1>చిన్ని తోట</h1><p class="tg-deck">ఒక విత్తనం... ఎన్నో ఆనందాలు!</p></div>${icon('butterfly','tg-title-butterfly')}</div>
<div class="tg-scene">${img('garden','tg-art','తోటలో నీరు పోస్తున్న పిల్లలు, అమ్మమ్మ, నీటి గిన్నె దగ్గర పిచ్చుక.')}${icon('sun','tg-scene-sun')}</div>
${heading('eye','చూద్దాం · మాట్లాడుదాం')}
<ol class="tg-prompts"><li>బొమ్మలో పిల్లలు ఏమి చేస్తున్నారు?</li><li>పిచ్చుక ఎక్కడ ఉంది? అది ఎందుకు వచ్చింది?</li><li>నీకు ఏ పువ్వు నచ్చింది? దాని రంగు చెప్పు.</li></ol>
<div class="tg-whisper">${icon('chat')}<p>నీ చుట్టూ ఉన్న మొక్కల గురించి స్నేహితులతో మాట్లాడు.</p></div>`),
page(2,`${kicker('చిన్ని తోట · చదువు')}
<h2 class="tg-heading">${icon('book')} మొలక వచ్చింది!</h2>
<div class="tg-story-opening"><div class="tg-story-text"><p>సిరి, రవి ఒక కుండీలో మట్టి పోశారు. అమ్మమ్మ ఇచ్చిన విత్తనాన్ని అందులో నాటారు.</p><p>రోజూ కొద్దిగా నీరు పోశారు. ఒక ఉదయం చిన్న మొలక కనిపించింది.</p></div>${img('seedling','tg-story-picture','మొలకను ఆనందంగా చూస్తున్న సిరి, రవి.')}</div>
<div class="tg-dialogue"><span class="tg-speaker">సిరి</span><p>“రవి! చూడు, మొలక వచ్చింది!”</p></div>
<div class="tg-dialogue tg-dialogue--ravi"><span class="tg-speaker">రవి</span><p>“దీనికి రెండు ఆకులు కూడా ఉన్నాయి!”</p></div>
<div class="tg-story-end"><p>అంతలో ఒక పిచ్చుక వచ్చింది. “దీనికీ నీళ్లు పెడదాం” అంది సిరి. రవి చిన్న గిన్నెలో నీళ్లు పోశాడు.</p><p>పిచ్చుక నీళ్లు తాగింది. పిల్లలు దూరంగా నిలబడి చూశారు. అమ్మమ్మ నవ్వింది.</p></div>
<div class="tg-observe">${icon('chat')}<div><strong>నువ్వు చెప్పు</strong><p>పిల్లలు పిచ్చుకకు ఎలా సాయం చేశారు?</p></div></div>
<div class="tg-word-trail"><span>విత్తనం</span><b>→</b><span>మొలక</span><b>→</b><span>మొక్క</span>${icon('leaf')}</div>`),
page(3,`${kicker('చిన్ని తోట · పదాలతో ఆట')}
<h2 class="tg-heading">${icon('pencil')} బొమ్మ చూడు · పేరు రాయి</h2>
<p>పదాలు చదువు. సరైన బొమ్మ కింద రాయి.</p>
<div class="tg-word-bank"><span>కుండీ</span><span>పిచ్చుక</span><span>ఆకు</span><span>పువ్వు</span></div>
${img('words','tg-art tg-vocabulary-art','ఆకు, పువ్వు, పిచ్చుక, కుండీ.')}
<div class="tg-picture-words">${[0,1,2,3].map((n)=>`<div class="tg-picture-word"><span class="tg-word-number">${n+1}</span>${line}</div>`).join('')}</div>
${heading('leaf','ఒకటి · ఎన్నో')}
<p>చదువు. ఖాళీలను పూరించు.</p>
<div class="tg-plurals"><div><p>ఆకు <span>→</span> ఆకులు</p><p>మొక్క <span>→</span> ${line}</p></div><div><p>పువ్వు <span>→</span> పువ్వులు</p><p>కుండీ <span>→</span> ${line}</p></div></div>
${heading('pencil','నీ వాక్యం')}
<p>“మొక్క” అనే పదంతో ఒక వాక్యం రాయి.</p>${line}`),
page(4,`${kicker('చిన్ని తోట · పాడు · గీయి')}
<h2 class="tg-heading">${icon('music')} మన తోట పాట</h2>
<div class="tg-poem-garden"><div class="tg-song"><p>చిన్ని చిన్ని మొక్కలు,<br>పచ్చనైన ఆకులు!<br>పూల కోసం సీతాకోక,<br>నీళ్ల కోసం పిచ్చుక!</p></div><div class="tg-poem-art">${img('sparrow-vignette','tg-poem-bird','పూల కొమ్మపై పిచ్చుక, దగ్గరగా సీతాకోకచిలుక.')}${icon('music','tg-poem-music')}</div></div>
<div class="tg-whisper">${icon('music')}<p>చప్పట్లు కొడుతూ పాట పాడు!</p></div>
${heading('pencil','నీ ఊహలో తోట')}
<p>ఒక మొక్కను, దాని దగ్గరికి వచ్చిన పక్షిని గీయి.</p>
<div class="tg-drawing">${icon('sun','tg-draw-sun')}${icon('leaf','tg-draw-leaf')}<span>నా చిన్ని తోట</span></div>
<p>నీ బొమ్మ గురించి రెండు వాక్యాలు రాయి.</p>${line}${line}
<div class="tg-whisper">${icon('book')}<p>నీ బొమ్మను చూపిస్తూ ఒక చిన్న కథ చెప్పు.</p></div>`),
];
for (let i=0;i<pages.length;i++) await writeFile(path.join(dir,`p${String(i+1).padStart(3,'0')}.html`),pages[i]);
console.log('Wrote four Telugu sample pages.');
