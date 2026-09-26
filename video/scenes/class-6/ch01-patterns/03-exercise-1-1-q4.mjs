/* Class 6 · Chapter 1 · Exercise Set 1.1, Question 4 (p003).
   Today is Monday. What day of the week will it be in 15 days?

   The picture is a calendar: the days laid out in rows of seven, so
   "every seven days the day comes round again" is a column you can
   see. The count reaches Monday at 7 and 14, then the one day left
   over lands on Tuesday. The answer is ANSWERS.md's: 15 = 2 x 7 + 1. */

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const head = DAYS.map((d, i) => `<div class="dh dh${i}">${d}</div>`).join('');
let cells = '', place = '';
for (let n = 0; n <= 15; n++) {
  place += `.c${n} { grid-row: ${Math.floor(n / 7) + 2}; grid-column: ${(n % 7) + 1}; }
`;
  cells += `<div class="cell c${n} ${n % 7 === 0 ? 'col-mon' : ''}">`
    + (n ? `<span class="cell__n">${n}</span>` : '<span class="cell__today">Today</span>') + '</div>';
}

export default {
  id: '03-exercise-1-1-q4',
  source: 'class-6/math-ch01-patterns',
  title: 'Exercise Set 1.1 · Question 4 · Fifteen days from Monday',
  footer: 'Exercise Set 1.1 · Question 4',

  css: `
    .qwrap { position: absolute; left: 0; top: 0; width: 1728px; }
    .q { font-size: 46px; }
    .cal { position: absolute; left: 0; top: 262px; display: grid; grid-template-columns: repeat(7, 112px); grid-auto-rows: 104px; gap: 8px; }
    .dh { grid-row: 1; align-self: end; text-align: center; font: 700 28px/1 var(--sans); letter-spacing: 0.08em; text-transform: uppercase; color: var(--ch); padding-bottom: 12px; }
    .dh.on { color: var(--berry-deep); }
    ${place}
    .cell { background: var(--ch-tint); border-radius: 12px; display: grid; place-items: center; }
    .cell__n { font-size: 46px; color: var(--ink-soft); }
    .cell__today { font: 700 26px/1 var(--sans); color: #fff; letter-spacing: 0.04em; }
    .c0 { background: var(--ch); }
    .cell.mon { background: var(--sky-tint); box-shadow: inset 0 0 0 4px var(--sky); }
    .cell.mon .cell__n { color: var(--sky-deep); font-weight: 600; }
    .c0.mon { background: var(--sky-deep); box-shadow: none; }
    .cell.hit { background: var(--berry); box-shadow: none; }
    .cell.hit .cell__n { color: #fff; font-weight: 700; }
    .cal__cap { position: absolute; left: 0; top: 730px; width: 830px; font: italic 36px/1.3 var(--serif); color: var(--ink-soft); }

    .work { position: absolute; left: 930px; top: 290px; width: 800px; grid-template-columns: 150px 1fr; row-gap: 30px; }
    .work > span:nth-child(even) { font-size: 44px; }
    .ans { position: absolute; left: 930px; top: 650px; }
    .ans .answer__text { font-size: 60px; }
  `,

  html: String.raw`
    <div class="qwrap"><div class="kind kind--mauve">Exercise Set 1.1 · Question 4</div>
      <div class="card card--mauve"><div class="q">Today is Monday. What day of the week will it be in 15 days? Say how the pattern of the week helps you to answer without counting every day.</div></div></div>

    <div class="cal">${head}${cells}</div>
    <div class="cal__cap">The numbers count the days after today.</div>

    <div class="work">
      <span class="work__label r1">Pattern</span><span class="r1">Every 7 days, the same day.</span>
      <span class="work__label r2">Step 1</span><span class="r2">$15 = 2 \times 7 + 1$</span>
      <span class="work__label r3">Step 2</span><span class="r3">After 14 days: Monday</span>
      <span class="work__label r4">Step 3</span><span class="r4">1 more day: Tuesday</span>
    </div>
    <div class="ans"><div class="answer"><div class="answer__label">Answer</div><div class="answer__text">Tuesday</div></div></div>
  `,

  beats: [
    { say: 'Exercise one point one, question four. Today is Monday. What day of the week will it be in fifteen days? And how does the pattern of the week help you answer, without counting every day?',
      do: [['fadeUp', '.kind', { at: 0 }], ['fadeUp', '.card', { at: 0.15 }]] },

    { say: 'Let us lay the days out in rows of seven, like a calendar. Today is Monday.',
      do: [['fadeUp', '.dh', { at: 0.3, stagger: 0.12 }], ['pop', '.c0', { at: '80%' }]] },

    { say: 'Count on. One day later is Tuesday. Two days later is Wednesday. And so on, to the end of the week.',
      do: [['pop', '.c1, .c2, .c3, .c4, .c5, .c6', { at: '12%', stagger: 0.55, dur: 0.4 }], ['fadeUp', '.cal__cap', { at: '30%' }]] },

    { say: 'Seven days after today, we are back to Monday. The week starts again.',
      do: [['pop', '.c7', { at: '20%' }], ['cls', '.c0, .c7', { c: 'mon', at: '45%' }], ['cls', '.dh0', { c: 'on', at: '45%' }],
           ['pop', '.c8, .c9, .c10, .c11, .c12, .c13', { at: '70%', stagger: 0.12, dur: 0.35 }]] },

    { say: 'And fourteen days after today, it is Monday once more. Every seven days, the same day comes round again.',
      do: [['pop', '.c14', { at: '8%' }], ['cls', '.c14', { c: 'mon', at: '25%' }], ['pulse', '.col-mon', { at: '35%', stagger: 0.15, by: 0.12 }],
           ['fadeUp', '.r1', { at: '70%' }]], hold: 0.4 },

    { say: 'So there is no need to count all fifteen days. Fifteen is two full weeks, and one more day.',
      do: [['fadeUp', '.r2', { at: '55%' }]] },

    { say: 'Two full weeks bring us back to Monday. One more day makes it Tuesday.',
      do: [['pulse', '.c14', { at: '10%', by: 0.12 }], ['pop', '.c15', { at: '62%' }], ['cls', '.c15', { c: 'hit', at: '70%' }],
           ['cls', '.dh1', { c: 'on', at: '70%' }], ['fadeUp', '.r3', { at: '25%' }], ['fadeUp', '.r4', { at: '75%' }]], hold: 0.4 },

    { say: 'So in fifteen days, it will be Tuesday.',
      do: [['fadeUp', '.ans', { at: '40%' }]], hold: 0.3 },

    { say: 'The pattern of the week does the work. Take away the full weeks, and only the days left over move the day on.',
      do: [['pulse', '.answer', { at: '10%', by: 0.05 }]], hold: 1 },
  ],
};
