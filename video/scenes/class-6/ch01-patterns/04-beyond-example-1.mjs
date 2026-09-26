/* Class 6 · Chapter 1 · Beyond the Book, Solved Examples, Example 1 (p102).
   The sum of the first several odd counting numbers is 121. What is
   the last number added? (a) 11 (b) 23 (c) 21 (d) 121

   The picture is the chapter's own: odd numbers are the L-shapes that
   grow a square. 121 dots is an 11 by 11 square, so eleven L-shapes,
   and the outside one — 11 down the side and 10 more along the foot —
   is 21. The film ends on why each wrong option is tempting, since a
   Beyond question is chosen for its traps. */

const N = 11, G = 32, P = 20, RAD = 11.5;
let dots = '';
for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
  const k = Math.max(r, c);
  dots += `<circle class="od L${k} ${k % 2 ? 'od--b' : ''}" cx="${P + c * G}" cy="${P + r * G}" r="${RAD}"/>`;
}
const SIDE = P * 2 + G * (N - 1);

export default {
  id: '04-beyond-example-1',
  source: 'class-6/math-ch01-patterns',
  title: 'Beyond the Book · Example 1 · The last odd number',
  footer: 'Beyond the Book · Solved Examples',

  css: `
    .qwrap { position: absolute; left: 0; top: 0; width: 1728px; }
    .q { font-size: 48px; }
    .opts { display: grid; grid-template-columns: repeat(4, 1fr); margin-top: 18px; font-size: 48px; }
    .opt { position: relative; justify-self: start; padding: 4px 22px 6px 14px; border-radius: 12px; }
    .opt i { font-style: normal; font-family: var(--sans); font-weight: 700; font-size: 34px; color: var(--sky-deep); margin-right: 12px; }
    .opt.right { background: var(--berry); color: #fff; } .opt.right i { color: #fff; }
    .opt.wrong { color: var(--ink-faint); text-decoration: line-through; text-decoration-thickness: 3px; }
    .traps { position: absolute; left: 620px; top: 400px; width: 1108px; }
    .traps__head { font: 700 28px/1 var(--sans); letter-spacing: 0.12em; text-transform: uppercase; color: var(--berry-deep); margin-bottom: 22px; }
    .trap { font-size: 44px; margin-bottom: 14px; }
    .trap b { font: 700 34px var(--sans); color: var(--ink-faint); display: inline-block; width: 150px; }

    .sq { position: absolute; left: 30px; top: 380px; overflow: visible; }
    .od { fill: var(--sky); } .od--b { fill: var(--sun); }
    .od.last { fill: var(--berry); }
    .sq-lab { font: 700 34px var(--sans); fill: var(--berry-deep); }

    .work { position: absolute; left: 620px; top: 400px; width: 1108px; grid-template-columns: 150px 1fr; row-gap: 28px; }
    .work > span:nth-child(even) { font-size: 44px; }
    .ans { position: absolute; left: 620px; top: 676px; }
    .ans .answer__text { font-size: 56px; }
  `,

  html: String.raw`
    <div class="qwrap"><div class="kind">Beyond the Book · Example 1</div>
      <div class="card"><div class="q">The sum of the first several odd counting numbers is 121. What is the last number added?</div>
        <div class="opts">
          <span class="opt oa"><i>(a)</i>11</span>
          <span class="opt ob"><i>(b)</i>23</span>
          <span class="opt oc"><i>(c)</i>21</span>
          <span class="opt od4"><i>(d)</i>121</span>
        </div></div></div>

    <svg class="sq" width="${SIDE + 120}" height="${SIDE + 60}" viewBox="0 0 ${SIDE + 120} ${SIDE + 60}">${dots}
      <text class="sq-lab lab-side" x="${SIDE + 14}" y="${SIDE / 2 + 12}">11</text>
      <text class="sq-lab lab-foot" x="${P + 4.5 * G}" y="${SIDE + 44}" text-anchor="middle">10 more</text>
    </svg>

    <div class="work">
      <span class="work__label r1">Step 1</span><span class="r1">$121 = 11 \times 11$, so 11 odd numbers were added.</span>
      <span class="work__label r2">Step 2</span><span class="r2">The 11th odd number is $2 \times 11 - 1 = 21$.</span>
      <span class="work__label r3">Check</span><span class="r3">$1, 3, 5, \ldots, 21$ are 11 numbers, and $11 \times 11 = 121$.</span>
    </div>
    <div class="traps">
      <div class="traps__head">Why not the others?</div>
      <div class="trap na"><b>(a) 11</b>is how many numbers were added.</div>
      <div class="trap nb2"><b>(b) 23</b>is the 12th odd number, one too far.</div>
      <div class="trap nd"><b>(d) 121</b>is the total, not a number in the sum.</div>
    </div>
    <div class="ans"><div class="answer"><div class="answer__label">Answer</div><div class="answer__text">(c) 21</div></div></div>
  `,

  beats: [
    { say: 'Beyond the Book, example one. The sum of the first few odd counting numbers is one hundred and twenty-one. What is the last number added? Is it eleven, twenty-three, twenty-one, or one hundred and twenty-one?',
      do: [['fadeUp', '.kind', { at: 0 }], ['fadeUp', '.card', { at: 0.15 }],
           ['pulse', '.oa', { at: '66%', by: 0.1 }], ['pulse', '.ob', { at: '74%', by: 0.1 }],
           ['pulse', '.oc', { at: '82%', by: 0.1 }], ['pulse', '.od4', { at: '90%', by: 0.1 }]] },

    { say: 'Remember what happens when you add odd numbers, starting from one. One. Add three, and you get four. Add five, and you get nine. Add seven, and you get sixteen.',
      do: [['pop', '.L0', { at: '26%' }], ['pop', '.L1', { at: '44%', stagger: 0.06 }],
           ['pop', '.L2', { at: '64%', stagger: 0.05 }], ['pop', '.L3', { at: '84%', stagger: 0.04 }]] },

    { say: 'Every time, you get a square. Each odd number is an L-shape that fits around the square before it, and makes it one row taller and one column wider.',
      do: [['pulse', '.L3', { at: '45%', by: 0.3, stagger: 0.03 }]], hold: 0.3 },

    { say: 'One hundred and twenty-one is eleven times eleven. So the square has eleven rows, and it took eleven odd numbers to build it.',
      do: [['pop', '.L4, .L5, .L6, .L7, .L8, .L9, .L10', { at: '5%', stagger: 0.022, dur: 0.35 }], ['fadeUp', '.r1', { at: '65%' }]], hold: 0.3 },

    { say: 'The last number added is the outside L-shape. It has eleven dots down the side, and ten more along the bottom. Eleven plus ten is twenty-one. That is the same as two times eleven, minus one.',
      do: [['cls', '.L10', { c: 'last', at: '12%' }], ['pulse', '.L10', { at: '12%', by: 0.3, stagger: 0.02 }],
           ['fadeIn', '.lab-side', { at: '28%' }], ['fadeIn', '.lab-foot', { at: '45%' }], ['fadeUp', '.r2', { at: '75%' }]], hold: 0.3 },

    { say: 'Check. The odd numbers from one up to twenty-one are eleven numbers, and eleven times eleven is one hundred and twenty-one.',
      do: [['fadeUp', '.r3', { at: '10%' }]] },

    { say: 'So the answer is c, twenty-one.',
      do: [['cls', '.oc', { c: 'right', at: '40%' }], ['fadeUp', '.ans', { at: '50%' }]], hold: 0.4 },

    { say: 'Watch out for the other choices. Eleven is how many numbers were added, not the last one. Twenty-three is the twelfth odd number, one too far. And one hundred and twenty-one is the total, not a number in the sum.',
      do: [['fadeOut', '.work', { at: 0, dur: 0.4 }], ['fadeUp', '.traps__head', { at: 0.3 }],
           ['cls', '.oa', { c: 'wrong', at: '14%' }], ['fadeUp', '.na', { at: '14%' }],
           ['cls', '.ob', { c: 'wrong', at: '45%' }], ['fadeUp', '.nb2', { at: '45%' }],
           ['cls', '.od4', { c: 'wrong', at: '76%' }], ['fadeUp', '.nd', { at: '76%' }]], hold: 1.2 },
  ],
};
