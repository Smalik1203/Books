/* Class 6 · Chapter 1 · Example 1 (p008).
   Is 1 + 2 + 3 + 4 + 5 + 6 + 5 + 4 + 3 + 2 + 1 a square number?

   Two parts. First the book's own solution: add in any order, make
   tens, 36 = 6 x 6. Then the reason the book leaves to Question 1: a
   6 by 6 square of dots, read along its slanting lines, counts
   1, 2, … 6, … 2, 1 — the very sum. The working clears for the
   picture; the question stays up throughout. */

const VALUES = [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];

const terms = VALUES.map((v, i) => `<span class="n n${i}">${v}</span>`).join('<span class="op">+</span>');
const seq = VALUES.map((v, i) => (i ? `<span class="sc sc${i}">,</span> ` : '') + `<span class="s s${i} ${i > 5 ? 's--b' : ''}">${v}</span>`).join('');

/* 6 x 6 dots; a dot's slanting line is its column plus its row. The
   lines going up (1 to 6) are sky and the lines coming down (5 to 1)
   sunflower, so the square reads as two triangles of dots, and each
   line is struck through its dots as it is counted. Two things were
   tried first: alternating the colour line by line comes out as a
   checkerboard and the slant disappears; a tinted pill behind each
   line is wider than the gap between lines, so the pills merge. */
const N = 6, GAP = 88, PAD = 70;
const X = (c) => PAD + c * GAP, Y = (r) => PAD + r * GAP;
let pills = '', dots = '', labels = '';
for (let k = 0; k <= 10; k++) {
  const up = k <= 5;
  const [c0, r0, c1, r1] = up ? [k, 0, 0, k] : [5, k - 5, k - 5, 5];
  const e = 30 / Math.SQRT2; // run the stroke a little past the end dots
  pills += `<line class="pill pill${k} ${up ? '' : 'pill--b'}" x1="${X(c0) + e}" y1="${Y(r0) - e}" x2="${X(c1) - e}" y2="${Y(r1) + e}"/>`;
  const size = up ? k + 1 : 11 - k;
  const [x, y] = up ? [X(k), PAD - 50] : [X(5) + 64, Y(k - 5) + 12];
  labels += `<text class="lab lab${k} ${up ? '' : 'lab--b'}" x="${x}" y="${y}" text-anchor="middle">${size}</text>`;
}
for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
  dots += `<circle class="gd k${c + r} ${c + r > 5 ? 'gd--b' : ''}" cx="${X(c)}" cy="${Y(r)}" r="27"/>`;
}
const SIDE = PAD * 2 + GAP * (N - 1);

/* The count: one slanting line per spoken number, spread over the beat. */
const count = [];
for (let k = 0; k <= 10; k++) {
  const at = `${3 + k * 8.6}%`;
  count.push(['fadeIn', `.pill${k}`, { at, dur: 0.15 }]);
  count.push(['draw', `.pill${k}`, { at, dur: 0.4 }]);
  count.push(['cls', `.k${k}`, { c: 'lit', at }]);
  count.push(['pulse', `.k${k}`, { at, dur: 0.45, by: 0.22 }]);
  count.push(['fadeUp', `.lab${k}, .s${k}`, { at, dur: 0.4 }]);
  if (k) count.push(['fadeIn', `.sc${k}`, { at, dur: 0.2 }]);
}

export default {
  id: '02-example-1',
  source: 'class-6/math-ch01-patterns',
  title: 'Example 1 · Is it a square number?',
  footer: 'Example 1 · page 8',

  css: `
    .qwrap { position: absolute; left: 0; top: 0; width: 1728px; }
    .terms { position: absolute; left: 0; top: 226px; display: flex; align-items: center; gap: 10px; font-size: 66px; line-height: 1; }
    .n { display: inline-block; min-width: 58px; text-align: center; padding: 10px 8px 14px; border-radius: 12px; border-bottom: 6px solid transparent; }
    .op { color: var(--ink-faint); font-size: 52px; }
    .n.g1 { background: var(--sky-tint); border-color: var(--sky); }
    .n.g2 { background: var(--sun-tint); border-color: var(--sun); }
    .n.g3 { background: var(--berry-tint); border-color: var(--berry); }
    .n.g4 { background: #f0ecf9; border-color: var(--violet); }

    .work { position: absolute; left: 0; top: 372px; width: 1000px; row-gap: 20px; }
    .sw { display: inline-block; width: 26px; height: 26px; border-radius: 6px; margin-right: 18px; vertical-align: -2px; }
    .sw.g1 { background: var(--sky); } .sw.g2 { background: var(--sun); } .sw.g3 { background: var(--berry); } .sw.g4 { background: var(--violet); }
    .why-inline { display: inline; margin-left: 16px; }

    .ans { position: absolute; left: 1110px; top: 470px; width: 618px; }
    .ans .answer { display: block; text-align: center; padding: 30px 30px 34px; }
    .ans .answer__text { font-size: 64px; }

    .grid { position: absolute; left: 60px; top: 226px; overflow: visible; }
    .gd { fill: var(--ch-soft); }
    .gd.lit { fill: var(--sky); } .gd--b.lit { fill: var(--sun); }
    .pill { stroke: var(--sky-deep); stroke-width: 7; stroke-linecap: round; fill: none; }
    .pill--b { stroke: #a87700; }
    .lab { font: 700 40px var(--sans); fill: var(--sky-deep); }
    .lab--b { fill: #a87700; }

    .side { position: absolute; left: 830px; top: 250px; width: 898px; }
    .side__lead { font-size: 46px; color: var(--ink-soft); margin-bottom: 26px; }
    .seq { font-size: 64px; line-height: 1.2; min-height: 160px; }
    .s { color: var(--sky-deep); font-weight: 600; } .s--b { color: #a87700; }
    .sc { color: var(--ink-faint); }
    .side .keyidea { margin-top: 40px; }
    .side .keyidea p { font-size: 50px; }
  `,

  html: String.raw`
    <div class="qwrap"><div class="kind">Example 1</div>
      <div class="card"><div class="q">Is $1 + 2 + 3 + 4 + 5 + 6 + 5 + 4 + 3 + 2 + 1$ a square number?</div></div></div>

    <div class="part1">
      <div class="terms">${terms}</div>
      <div class="work">
        <span class="work__label r1">Step 1</span><span class="r1"><span class="sw g1"></span>$1 + 2 + 3 + 4 = 10$</span>
        <span class="work__label r2">Step 2</span><span class="r2"><span class="sw g2"></span>$6 + 4 = 10$</span>
        <span class="work__label r3">Step 3</span><span class="r3"><span class="sw g3"></span>$5 + 5 = 10$</span>
        <span class="work__label r4">Step 4</span><span class="r4"><span class="sw g4"></span>$3 + 2 + 1 = 6$<span class="work__why why-inline">the numbers left</span></span>
        <span class="work__label work__label--ans r5">Total</span><span class="r5">$10 + 10 + 10 + 6 = 36$</span>
      </div>
      <div class="ans"><div class="answer"><div class="answer__label">Answer</div><div class="answer__text">Yes. $36 = 6 \times 6$</div></div></div>
    </div>

    <div class="part2">
      <svg class="grid" width="${SIDE + 70}" height="${SIDE}" viewBox="0 0 ${SIDE + 70} ${SIDE}">${dots}${pills}${labels}</svg>
      <div class="side">
        <div class="side__lead">Dots on each slanting line:</div>
        <div class="seq">${seq}</div>
        <div class="keyidea"><div class="keyidea__title">So</div><p>Up to 6 and back down makes $6 \times 6$.</p></div>
      </div>
    </div>
  `,

  beats: [
    { say: 'Example one. Is this sum a square number?',
      do: [['fadeUp', '.kind', { at: 0 }], ['fadeUp', '.card', { at: 0.15 }]] },

    { say: 'The numbers go up: one, two, three, four, five, six. Then they come back down: five, four, three, two, one.',
      do: [['fadeUp', '.n, .op', { at: '6%', stagger: 0.36, dur: 0.45 }]] },

    { say: 'You can add numbers in any order. So instead of going from left to right, let us put together numbers that make ten.' },

    { say: 'First, one, two, three and four. Together they make ten.',
      do: [['cls', '.n0, .n1, .n2, .n3', { c: 'g1', at: '20%', stagger: 0.18 }], ['fadeUp', '.r1', { at: '75%' }]] },

    { say: 'Next, the six, and the four just after it. Six plus four is ten.',
      do: [['cls', '.n5', { c: 'g2', at: '15%' }], ['cls', '.n7', { c: 'g2', at: '45%' }], ['fadeUp', '.r2', { at: '75%' }]] },

    { say: 'Then the two fives. Five plus five is ten.',
      do: [['cls', '.n4, .n6', { c: 'g3', at: '25%', stagger: 0.25 }], ['fadeUp', '.r3', { at: '70%' }]] },

    { say: 'The numbers left are three, two and one. They make six.',
      do: [['cls', '.n8, .n9, .n10', { c: 'g4', at: '30%', stagger: 0.2 }], ['fadeUp', '.r4', { at: '70%' }]] },

    { say: 'So the total is ten, plus ten, plus ten, plus six. That is thirty-six.',
      do: [['fadeUp', '.r5', { at: 0.2 }]] },

    { say: 'And thirty-six is six times six. So yes, it is a square number.',
      do: [['fadeUp', '.ans', { at: '35%' }], ['pulse', '.answer', { at: '80%', dur: 0.6, by: 0.05 }]], hold: 0.6 },

    { say: 'But why does it come out as a square? Here is a picture that shows the reason. Thirty-six dots make a square: six rows of six.',
      do: [['fadeOut', '.part1', { at: 0, dur: 0.5 }], ['pop', '.gd', { at: '45%', stagger: 0.04, dur: 0.45 }]], hold: 0.8 },

    { say: 'Now count the dots along each slanting line.',
      do: [['fadeUp', '.side__lead', { at: 0.2 }]] },

    { say: 'One. Two. Three. Four. Five. Six. Five. Four. Three. Two. One.',
      do: count, hold: 0.4 },

    { say: 'The slanting lines go up to six and back down: that is our sum. So the sum is six times six, and the pattern works for six as well.',
      do: [['fadeUp', '.keyidea', { at: '40%' }]], hold: 1 },
  ],
};
