/* Class 6 · Chapter 1 · the chapter introduction (p001).

   Four parts, each clearing the one before: the title; three patterns
   from the world (the opener's strip — sunrise, the moon through a
   month, a tiled floor); the triangular numbers of the opener sketch,
   1, 3, 6, 10 and the next; and the key idea with the sections to
   come. The words follow section 1.1, shortened for the ear. */

/* ---- the world strip ---- */
const W = 520, H = 330;
const sun = `<svg class="panel-art" viewBox="0 0 ${W} ${H}">
  <rect class="sky-bg" width="${W}" height="${H}"/>
  <g class="sun"><circle cx="260" cy="290" r="62" class="sun-disc"/>
    ${Array.from({ length: 9 }, (_, i) => { const a = Math.PI * (i / 8); return `<line class="ray" x1="${260 + 82 * Math.cos(a)}" y1="${290 - 82 * Math.sin(a)}" x2="${260 + 112 * Math.cos(a)}" y2="${290 - 112 * Math.sin(a)}"/>`; }).join('')}</g>
  <rect class="sea" y="200" width="${W}" height="${H - 200}"/>
  ${[228, 256, 284, 312].map((y, i) => `<path class="wave" d="M${10 + i * 14} ${y} q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0"/>`).join('')}
</svg>`;

const moonPhase = (cx, i) => {
  const r = 38, cy = 165, top = cy - r, bot = cy + r;
  const lit = [
    '',
    `<path class="moon-lit" d="M${cx} ${top} A${r} ${r} 0 0 1 ${cx} ${bot} A${r * 0.56} ${r} 0 0 0 ${cx} ${top}Z"/>`,
    `<path class="moon-lit" d="M${cx} ${top} A${r} ${r} 0 0 1 ${cx} ${bot} A0 ${r} 0 0 1 ${cx} ${top}Z"/>`,
    `<path class="moon-lit" d="M${cx} ${top} A${r} ${r} 0 0 1 ${cx} ${bot} A${r * 0.56} ${r} 0 0 1 ${cx} ${top}Z"/>`,
    `<circle class="moon-lit" cx="${cx}" cy="${cy}" r="${r}"/>`,
  ][i];
  return `<g class="moon moon${i}"><circle class="moon-dark" cx="${cx}" cy="${cy}" r="${r}"/>${lit}</g>`;
};
const stars = [[40, 50], [130, 280], [215, 60], [300, 290], [390, 45], [480, 270], [270, 110], [90, 130], [450, 120]];
const moon = `<svg class="panel-art" viewBox="0 0 ${W} ${H}">
  <rect class="night" width="${W}" height="${H}"/>
  ${stars.map(([x, y]) => `<circle class="star" cx="${x}" cy="${y}" r="3.2"/>`).join('')}
  ${[0, 1, 2, 3, 4].map((i) => moonPhase(68 + i * 96, i)).join('')}
</svg>`;

let tileCells = '';
const T = 65;
for (let r = 0; r < 6; r++) for (let c = 0; c < 8; c++) {
  const a = (r + c) % 2 === 0;
  const x = c * T, y = r * T;
  tileCells += `<g class="tile"><rect class="${a ? 'tile-a' : 'tile-b'}" x="${x}" y="${y}" width="${T}" height="${T}"/>`
    + `<path class="${a ? 'tile-c' : 'tile-d'}" d="M${x + T / 2} ${y + 9} L${x + T - 9} ${y + T / 2} L${x + T / 2} ${y + T - 9} L${x + 9} ${y + T / 2}Z"/></g>`;
}
const tiles = `<svg class="panel-art" viewBox="0 0 ${W} ${H}"><g>${tileCells}</g></svg>`;

/* ---- triangular numbers, as the opener sketch ---- */
const D = 50, R = 19;
let tri = '', x0 = 40;
[1, 2, 3, 4, 5].forEach((rows, t) => {
  const width = (rows - 1) * D;
  const cx = x0 + width / 2;
  for (let r = 0; r < rows; r++) for (let i = 0; i <= r; i++) {
    const x = cx - (r * D) / 2 + i * D, y = 330 - (rows - 1 - r) * D * 0.88;
    tri += `<circle class="tdot t${t} ${r === rows - 1 && t ? 'tdot--new' : ''}" cx="${x}" cy="${y}" r="${R}"/>`;
  }
  tri += `<text class="tnum tn${t}" x="${cx}" y="420" text-anchor="middle">${rows * (rows + 1) / 2}</text>`;
  x0 += width + 150;
});

export default {
  id: '01-introduction',
  source: 'class-6/math-ch01-patterns',
  title: 'Chapter 1 · Looking for Patterns',
  footer: 'Introduction',

  css: `
    .part { position: absolute; inset: 0; }
    .title-card__num { display: inline-block; font: 700 150px/1 var(--sans); color: #fff; background: var(--sky); padding: 26px 50px 30px; border-radius: var(--radius); margin-bottom: 40px; align-self: flex-start; }
    .title-card__title { font-size: 120px; }
    .title-card__rule { width: 420px; height: 10px; background: var(--sun); border-radius: 5px; margin-top: 34px; }

    .p1b { display: flex; align-items: center; justify-content: center; gap: 50px; top: 240px; bottom: auto; }
    .twostep { display: flex; align-items: center; gap: 26px; font-size: 58px; font-weight: 600; background: var(--sky-tint); border-radius: var(--radius); padding: 34px 50px 38px; }
    .twostep b { font: 700 44px/1 var(--sans); color: #fff; background: var(--sky-deep); width: 70px; height: 70px; border-radius: 50%; display: grid; place-items: center; }
    .ts2 { background: var(--berry-tint); } .ts2 b { background: var(--berry); }
    .twostep__arrow { font: 600 70px/1 var(--sans); color: var(--ink-faint); }
    .sketch { position: absolute; right: 0; top: 120px; width: 620px; height: 354px; }
    .sk-grid { fill: none; stroke: var(--ch-tint); stroke-width: 0.6; }
    .sk-dot { fill: var(--sky); }
    .sk-ghost { fill: none; stroke: var(--ch-soft); stroke-width: 0.8; stroke-dasharray: 2.5 2; }
    .sk-q { font: 700 16px var(--sans); fill: var(--ch-soft); }
    .sk-n { font: 700 8px var(--sans); fill: var(--ink-soft); }
    .strip { position: absolute; top: 40px; left: 0; right: 0; display: flex; gap: 84px; }
    .panel { width: 520px; }
    .panel-art { width: 520px; height: 330px; border-radius: var(--radius); display: block; overflow: hidden; }
    .panel figcaption { font-size: 38px; color: var(--ink-soft); margin-top: 18px; text-align: center; }
    .sky-bg { fill: var(--sun-tint); } .sun-disc { fill: var(--sun); }
    .ray { stroke: var(--sun); stroke-width: 8; stroke-linecap: round; }
    .sea { fill: var(--sky); } .wave { fill: none; stroke: #fff; stroke-opacity: 0.55; stroke-width: 4; stroke-linecap: round; }
    .night { fill: var(--ch-deep); } .star { fill: #fff; opacity: 0.7; }
    .moon-dark { fill: #4d6384; } .moon-lit { fill: var(--sun-tint); }
    .tile-a { fill: var(--sky); } .tile-b { fill: var(--sky-tint); }
    .tile-c { fill: var(--sun); } .tile-d { fill: var(--sky); }
    .world-line { position: absolute; top: 560px; left: 0; width: 1728px; text-align: center; font-size: 50px; }

    .tri { position: absolute; left: 50%; top: 40px; margin-left: -620px; overflow: visible; }
    .tdot { fill: var(--sky); } .tdot--new { fill: var(--sun); }
    .tnum { font: 700 54px var(--sans); fill: var(--ink); }
    .tn4 { fill: var(--berry-deep); }
    .tri-q { position: absolute; top: 560px; left: 0; width: 1728px; text-align: center; font-size: 50px; }
    .tri-rule { position: absolute; top: 650px; left: 0; width: 1728px; text-align: center; font-size: 44px; color: var(--ink-soft); }

    .p4 .keyidea { position: absolute; top: 20px; left: 0; width: 1728px; }
    .p4 .keyidea p { font-size: 56px; }
    .sections { position: absolute; top: 300px; left: 0; width: 1728px; display: grid; grid-template-columns: 1fr 1fr; gap: 26px 60px; }
    .sections__head { grid-column: 1 / -1; font: 700 30px/1 var(--sans); letter-spacing: 0.12em; text-transform: uppercase; color: var(--ch); }
    .sec { display: flex; align-items: center; gap: 24px; font-size: 46px; }
    .sec b { font: 700 32px/1 var(--sans); color: #fff; background: var(--ch); padding: 12px 16px; border-radius: 10px; min-width: 84px; text-align: center; }
  `,

  html: String.raw`
    <div class="part p1 title-card">
      <div class="title-card__num">1</div>
      <div class="title-card__kicker">Chapter 1</div>
      <div class="title-card__title">Looking for Patterns</div>
      <div class="title-card__rule"></div>
      <svg class="sketch" viewBox="0 0 210 120" aria-hidden="true">
        <path class="sk-grid" d="M17 0V120M39 0V120M61 0V120M83 0V120M105 0V120M127 0V120M149 0V120M171 0V120M193 0V120M0 5H210M0 27H210M0 49H210M0 71H210M0 93H210M0 115H210"/>
        <circle class="sk-dot" cx="24" cy="96" r="3.4"/>
        <circle class="sk-dot" cx="62" cy="86" r="3.4"/><circle class="sk-dot" cx="56.5" cy="96" r="3.4"/><circle class="sk-dot" cx="67.5" cy="96" r="3.4"/>
        <circle class="sk-dot" cx="112" cy="76" r="3.4"/><circle class="sk-dot" cx="106.5" cy="86" r="3.4"/><circle class="sk-dot" cx="117.5" cy="86" r="3.4"/>
        <circle class="sk-dot" cx="101" cy="96" r="3.4"/><circle class="sk-dot" cx="112" cy="96" r="3.4"/><circle class="sk-dot" cx="123" cy="96" r="3.4"/>
        <rect class="sk-ghost" x="150" y="52" width="46" height="50" rx="2"/>
        <text class="sk-q" x="173" y="84" text-anchor="middle">?</text>
        <text class="sk-n" x="24" y="113" text-anchor="middle">1</text><text class="sk-n" x="62" y="113" text-anchor="middle">3</text>
        <text class="sk-n" x="112" y="113" text-anchor="middle">6</text><text class="sk-n" x="173" y="113" text-anchor="middle">10</text>
      </svg>
    </div>

    <div class="part p1b">
      <div class="twostep ts1"><b>1</b>Look for patterns</div>
      <div class="twostep__arrow">→</div>
      <div class="twostep ts2"><b>2</b>Explain them</div>
    </div>

    <div class="part p2">
      <div class="strip">
        <figure class="panel pa">${sun}<figcaption>The sun rises every morning</figcaption></figure>
        <figure class="panel pb">${moon}<figcaption>The moon through a month</figcaption></figure>
        <figure class="panel pc">${tiles}<figcaption>Tiles repeat across a floor</figcaption></figure>
      </div>
      <div class="world-line">Once you start looking, patterns are everywhere.</div>
    </div>

    <div class="part p3">
      <svg class="tri" width="1240" height="440" viewBox="0 0 1240 440">${tri}</svg>
      <div class="tri-q">What is the next number?</div>
      <div class="tri-rule">Each picture adds one more row: $+2$, then $+3$, then $+4$, then $+5$.</div>
    </div>

    <div class="part p4">
      <div class="keyidea"><div class="keyidea__title">What mathematics does</div>
        <p>Mathematics looks for patterns, and for the reasons why those <span class="nb">patterns happen.</span></p></div>
      <div class="sections">
        <div class="sections__head">In this chapter</div>
        <div class="sec s2"><b>1.2</b>Patterns in Numbers</div>
        <div class="sec s3"><b>1.3</b>Numbers as Pictures</div>
        <div class="sec s4"><b>1.4</b>Sequences That Are Connected</div>
        <div class="sec s5"><b>1.5</b>Patterns in Shapes</div>
        <div class="sec s6"><b>1.6</b>Shapes That Count</div>
      </div>
    </div>
  `,

  beats: [
    { say: 'Chapter one. Looking for patterns.',
      do: [['pop', '.title-card__num', { at: 0, dur: 0.6 }], ['fadeUp', '.title-card__kicker', { at: 0.3 }],
           ['fadeUp', '.title-card__title', { at: 0.5, dur: 0.8 }], ['wipe', '.title-card__rule', { at: 1, dur: 0.8 }],
           ['fadeIn', '.sk-grid', { at: 0.2, dur: 1 }], ['pop', '.sk-dot', { at: 0.8, stagger: 0.08, dur: 0.4 }],
           ['fadeIn', '.sk-n', { at: 1, stagger: 0.25 }], ['fadeIn', '.sk-ghost, .sk-q', { at: 2.1 }]], hold: 0.8 },

    { say: 'Ask mathematicians what their work is, and many will give the same answer. They look for patterns. And then they try to explain them.',
      do: [['fadeOut', '.p1', { at: '8%', dur: 0.6 }], ['fadeUp', '.ts1', { at: '52%' }],
           ['fadeIn', '.twostep__arrow', { at: '75%' }], ['fadeUp', '.ts2', { at: '82%' }]], hold: 0.6 },

    { say: 'Patterns are all around you. The sun rises in the east, every morning.',
      do: [['fadeOut', '.p1b', { at: 0, dur: 0.4 }], ['fadeUp', '.pa', { at: 0.2 }],
           ['move', '.sun', { at: '30%', y: -110, dur: 2.6 }]] },

    { say: 'The moon grows round, and then thin again, about once a month.',
      do: [['fadeUp', '.pb', { at: 0 }], ['pop', '.moon', { at: '20%', stagger: 0.5, dur: 0.5 }]] },

    { say: 'And the tiles on a floor repeat across the room.',
      do: [['fadeUp', '.pc', { at: 0 }], ['pop', '.tile', { at: '15%', stagger: 0.035, dur: 0.35 }]] },

    { say: 'Once you start looking, you will find patterns in cooking, in games, in music, and in the weather.',
      do: [['fadeUp', '.world-line', { at: '20%' }]], hold: 0.4 },

    { say: 'Numbers have patterns too. Look at these pictures of dots.',
      do: [['fadeOut', '.p2', { at: 0, dur: 0.5 }], ['pop', '.t0', { at: '50%' }], ['fadeUp', '.tn0', { at: '55%' }]] },

    { say: 'One dot. Then three. Then six. Then ten.',
      do: [['pop', '.t1', { at: '28%', stagger: 0.05 }], ['fadeUp', '.tn1', { at: '30%' }],
           ['pop', '.t2', { at: '52%', stagger: 0.05 }], ['fadeUp', '.tn2', { at: '55%' }],
           ['pop', '.t3', { at: '78%', stagger: 0.05 }], ['fadeUp', '.tn3', { at: '80%' }]], hold: 0.3 },

    { say: 'What is the next number in the pattern?',
      do: [['fadeUp', '.tri-q', { at: 0.1 }]], hold: 1.2 },

    { say: 'Each picture adds one more row. Two dots, then three, then four. So the next one adds a row of five, and ten plus five is fifteen.',
      do: [['fadeUp', '.tri-rule', { at: '10%' }], ['pop', '.t4', { at: '55%', stagger: 0.06 }], ['fadeUp', '.tn4', { at: '75%' }],
           ['pulse', '.tn4', { at: '88%', by: 0.3 }]], hold: 0.6 },

    { say: 'But noticing a pattern is only the first step. The second step is to ask why the pattern happens. When you know the reason, you can use it somewhere new.',
      do: [['dim', '.p3', { at: '30%', to: 0.2, dur: 1 }]] },

    { say: 'That is what mathematics does. It looks for patterns, and for the reasons why those patterns happen.',
      do: [['fadeOut', '.p3', { at: 0, dur: 0.5 }], ['fadeUp', '.p4 .keyidea', { at: 0.4 }]], hold: 0.4 },

    { say: 'In this chapter, you will find patterns in numbers, turn numbers into pictures, see how one sequence is hidden inside another, and find patterns in shapes. Let us begin.',
      do: [['fadeUp', '.sections__head', { at: 0.1 }], ['fadeUp', '.sec', { at: '12%', stagger: 0.9 }]], hold: 1.2 },
  ],
};
