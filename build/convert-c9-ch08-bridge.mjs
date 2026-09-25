// Rebuild Class 9 Chapter 8's Beyond the Book into the four stages of the
// Class 7 shape (DESIGN-MATHS §6a), from its old one: Using What You Know,
// Behind Each Answer, Problem Sets, Answers & Takeaways.
//
//   node build/convert-c9-ch08-bridge.mjs
//
// Reads the chapter as committed (git HEAD), so it can be run again safely.
// Stage 1 keeps its questions and framing word for word, and each question's
// worked answer moves under it as running text, as in Chapters 1-7. Three
// Stage 1 questions repeated the chapter's own exercises (the AP from t3 = 16,
// the multiples of 7, the runs summing to 100) and are replaced by questions
// of the same kind, with their explanations reworked to match. Stage 2 is
// left as a bare head for jee-class9.mjs to fill. Problem Sets become one
// numbered practice run in the six examination forms, keeping every question
// except Set C Q9, which repeated Stage 1's first question; Stage 4 is the key.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {pageBlocks, root} from './jee-tools.mjs';

const rel = 'pages/class-9/ch08-sequences';
const dir = path.join(root, rel);
const head = f => execFileSync('git', ['show', `HEAD:${rel}/${f}`], {cwd: root, encoding: 'utf8'});
const blocks = ['p101', 'p102', 'p103', 'p104', 'p105', 'p106', 'p107', 'p108', 'p109']
  .flatMap(p => pageBlocks(head(p + '.html')));
const cls = b => (b.match(/^<div class="([^"]+)"/) || [])[1] || '';

// ---- Stage 1 -------------------------------------------------------------
const bridge = blocks.find(b => cls(b) === 'c-bridge');
const stage = (n, title) => `<div class="c-stage">
        <div class="c-stage__num">${n}</div>
        <div class="c-stage__text">
          <div class="c-stage__title">${title}</div>
        </div>
      </div>`;
const s1 = blocks.findIndex(b => b.includes('c-stage__title">Using What You Know'));
const s2 = blocks.findIndex(b => b.includes('c-stage__title">Behind Each Answer'));
const s3 = blocks.findIndex(b => b.includes('c-stage__title">Problem Sets'));
const stage1 = blocks.slice(s1 + 1, s2);
const tries = stage1.filter(b => cls(b) === 'c-try');
const firstTry = stage1.indexOf(tries[0]), lastTry = stage1.indexOf(tries.at(-1));
const intro = stage1.slice(0, firstTry);
const closing = stage1.slice(lastTry + 1).map(b => b.replace('Every solution overleaf begins that way', 'Every solution above begins that way'));
if (tries.length !== 8 || closing.length !== 5) throw Error(`expected 8 tries and 5 closing paragraphs, got ${tries.length} and ${closing.length}`);
const solutions = blocks.slice(s2 + 1, s3).filter(b => cls(b) === 'c-solution');
if (solutions.length !== 8) throw Error('expected 8 solutions');
// A solution's content, without its panel or its title: running text after the question.
const inner = b => b.replace(/^<div class="c-solution">\s*<div class="c-solution__turn">[\s\S]*?<\/div>\s*/, '').replace(/\s*<\/div>\s*$/, '')
  .split(/\n(?=        <(?:p|div class="work")[ >])/).map(s => s.replace(/^ {8}/gm, '      ').trim());

const replaced = {
  1: {q: `<div class="c-try">
        <p>The fourth term of an AP is $19$ and the ninth exceeds the sixth by $15$.
        Find the first term and the common difference.</p>
      </div>`, a: [`<p>
        Write both facts in terms of $a$ and $d$ and the question becomes a pair of
        equations. The ninth term exceeding the sixth by $15$ is worth reading
        carefully: it says $t_9 - t_6 = 15$, and $t_9 - t_6$ is three steps of $d$.
      </p>`, `<div class="work">
        <div class="work__row">
          <span class="work__label">given</span>
          <span>$a + 3d = 19$</span>
        </div>
        <div class="work__row">
          <span class="work__label">and</span>
          <span>$3d = 15$, so $d = 5$</span>
        </div>
        <div class="work__row">
          <span class="work__label">then</span>
          <span>$a = 19 - 15$</span>
          <span class="chip">4</span>
        </div>
      </div>`, `<p>
        The AP is $4, 9, 14, 19, \\ldots$ Notice that the second fact never needed the
        first: any two terms the same distance apart differ by that many $d$'s, whether
        they are the sixth and ninth or the sixtieth and sixty-third.
      </p>`, null]},
  3: {q: `<div class="c-try">
        <p>How many three-digit numbers are divisible by $9$? You are not asked to list
        them.</p>
      </div>`, a: [`<p>
        The multiples of $9$ form an AP with $d = 9$, so the whole question is: where
        does it start, where does it stop, and how many steps between?
      </p>`, `<div class="work">
        <div class="work__row">
          <span class="work__label work__label--wide">first</span>
          <span>$9 \\times 12 = 108$</span>
        </div>
        <div class="work__row">
          <span class="work__label work__label--wide">last</span>
          <span>$9 \\times 111 = 999$</span>
        </div>
        <div class="work__row">
          <span class="work__label work__label--wide">count</span>
          <span>$111 - 12 + 1$</span>
          <span class="chip">100</span>
        </div>
      </div>`, `<p>
        The $+1$ is the whole difficulty. From the twelfth multiple to the
        hundred-and-eleventh there are $99$ <em>steps</em> but $100$
        <em>multiples</em>, because both ends are being counted. It is the same
        off-by-one as the $n-1$ in $t_n = a + (n-1)d$, met from the other side.
      </p>`, `<p>
        The same could be had from the formula: solve $108 + (n-1)9 = 999$ to get
        $n = 100$. The arithmetic is identical; the fence-post is just easier to see
        when the multiples are numbered.
      </p>`, `<p>
        Finding the two ends is the part worth practising. The smallest three-digit
        multiple of $9$ is not $100$ rounded somehow — it is the first multiple at or
        above $100$, and $100 \\div 9$ is a little over $11$, so it is the twelfth.
        The largest is found the same way from the top: $999 \\div 9$ is exactly
        $111$, so the hundred-and-eleventh, $999$ itself, is the last one that fits.
      </p>`, null]},
  6: {q: `<div class="c-try">
        <p>Find all the ways of writing $45$ as a sum of two or more consecutive natural
        numbers.</p>
      </div>`, a: [`<p>
        Suppose the run has $k$ terms and starts at $a$. It is an AP with $d = 1$, so
        by the rule from the chapter — first plus last, halved, times the count —
      </p>`, `<div class="work">
        <div class="work__row">
          <span class="work__label">sum</span>
          <span>$= \\dfrac{k\\,\\bigl(2a + k - 1\\bigr)}{2} = 45$</span>
        </div>
        <div class="work__row">
          <span class="work__label">so</span>
          <span>$k\\,(2a + k - 1) = 90$</span>
        </div>
      </div>`, `<p>
        Now look at the two brackets. If $k$ is even then $2a + k - 1$ is odd, and if
        $k$ is odd then $2a + k - 1$ is even — one of the two factors is always odd.
        And $90 = 2 \\times 3^2 \\times 5$ has plenty of odd factors: $1, 3, 5, 9, 15, 45$.
        The smaller bracket is $k$, since $a$ is at least $1$.
      </p>`, `<div class="work">
        <div class="work__row">
          <span class="work__label work__label--wide">$k = 2$</span>
          <span>$2a + 1 = 45$, so $a = 22$</span>
          <span class="chip">22 + 23</span>
        </div>
        <div class="work__row">
          <span class="work__label work__label--wide">$k = 3$</span>
          <span>$2a + 2 = 30$, so $a = 14$</span>
          <span class="chip">14 + 15 + 16</span>
        </div>
        <div class="work__row">
          <span class="work__label work__label--wide">$k = 5$</span>
          <span>$2a + 4 = 18$, so $a = 7$</span>
          <span class="chip">7 + 8 + &hellip; + 11</span>
        </div>
        <div class="work__row">
          <span class="work__label work__label--wide">$k = 6$</span>
          <span>$2a + 5 = 15$, so $a = 5$</span>
          <span class="chip">5 + 6 + &hellip; + 10</span>
        </div>
        <div class="work__row">
          <span class="work__label work__label--wide">$k = 9$</span>
          <span>$2a + 8 = 10$, so $a = 1$</span>
          <span class="chip">1 + 2 + &hellip; + 9</span>
        </div>
      </div>`, `<p>
        Any other $k$ leaves no whole $a$ or needs $a \\lt 1$. So there are exactly
        five ways — one for each odd factor of $90$ other than $1$ — and the reason
        there are so many is that $90$ is rich in odd factors. A number with few, such
        as a power of $2$, has no way at all.
      </p>`]},
};
const stage1Out = [bridge, stage(1, 'Using What You Know'), ...intro];
tries.forEach((t, i) => {
  const r = replaced[i];
  stage1Out.push(r ? r.q : t, ...(r ? r.a.filter(Boolean) : inner(solutions[i])));
});
stage1Out.push(...closing);
// The AP answer's last paragraph (about gaps depending only on distance) is kept.
{
  const apTail = inner(solutions[1]).at(-1);
  if (!apTail.includes('never on where they stand')) throw Error('AP closing paragraph moved');
  const at = stage1Out.findIndex(b => b.includes('sixtieth and sixty-third')) + 1;
  stage1Out.splice(at, 0, apTail);
}
// The multiples answer's last paragraph generalises, and names the example it replaced.
{
  const tail = inner(solutions[3]).at(-1).replace('multiples of $7$', 'multiples of $9$');
  if (!tail.includes('Every counting question of this shape')) throw Error('multiples closing paragraph moved');
  const at = stage1Out.findIndex(b => b.includes('$999$ itself, is the last one')) + 1;
  stage1Out.splice(at, 0, tail);
}

// ---- Stage 3: one numbered run ------------------------------------------
const setBlocks = blocks.slice(s3 + 1).filter(b => /^<div class="c-practice/.test(b));
const questions = setBlocks.flatMap(b => {
  const ol = b.match(/<ol class="c-questions"[^>]*>([\s\S]*)<\/ol>/)[1];
  // Top-level <li> items of the question list.
  const out = []; let depth = 0, start = -1;
  for (const m of ol.matchAll(/<\/?li\b[^>]*>/g)) {
    if (m[0].startsWith('</')) { depth--; if (depth === 0) out.push(ol.slice(start, m.index + 5)); }
    else { if (depth === 0) start = m.index; depth++; }
  }
  return out.map(li => li.replace(/\s+/g, ' ').replace(/^<li>\s*/, '').replace(/\s*<\/li>$/, ''));
});
if (questions.length !== 27) throw Error(`expected 27 set questions, got ${questions.length}`);
const [A, B, C] = [questions.slice(0, 10), questions.slice(10, 17), questions.slice(17)];
const ar = B.slice(0, 2).map(q => {
  const [, a, r] = q.match(/^<strong>A\.<\/strong> ([\s\S]*?) &nbsp;<strong>R\.<\/strong> ([\s\S]*?)<ol/);
  return `<p>Assertion (A): ${a.trim()}</p><p>Reason (R): ${r.trim()}</p>`;
});
// Set B Q7 carried a hint below its options; the other questions do not, and it goes.
const b7 = B[6].replace(/<\/ol>[\s\S]*$/, '</ol>');
const mcq = [...A, ...B.slice(2, 6), b7, ...C.filter((_, i) => i !== 8)];
const newAR = [
  `<p>Assertion (A): The sequence $5, 5, 5, \\ldots$ is both an AP and a GP.</p><p>Reason (R): Its common difference is $0$ and its common ratio is $1$.</p>`,
  `<p>Assertion (A): $1 + 2 + 3 + \\cdots + 20 = 210$.</p><p>Reason (R): The sum of any AP of $n$ terms is $\\dfrac{n(n+1)}{2}$.</p>`,
];
const vsa = [
  `Write the $7$th term of the AP $4, 9, 14, \\ldots$`,
  `Write the common ratio of the GP $81, 27, 9, \\ldots$`,
  `A sequence has $t_n = n^2 + 1$. Write $t_6$.`,
];
const sa = [
  `How many terms of the AP $3, 7, 11, \\ldots$ are less than $200$?`,
  `The $3$rd term of a GP is $12$ and its $5$th term is $48$. Find its first term, taking the common ratio to be positive.`,
  `Find $11 + 12 + 13 + \\cdots + 40$.`,
  `A sequence is given by $t_1 = 4$ and $t_n = 2t_{n-1} - 3$ for $n \\geq 2$. Find its first five terms.`,
];
const la = [
  `Riya saves <span class="nb">₹10</span> in the first week, <span class="nb">₹15</span> in the second, <span class="nb">₹20</span> in the third, and so on.<ol class="c-parts c-parts--alpha c-parts--1"><li>How much does she save in the $20$th week?</li><li>How much has she saved in all after $20$ weeks?</li><li>In which week does she first save more than <span class="nb">₹200</span>?</li></ol>`,
  `A population of $2000$ insects grows by $50\\%$ every week.<ol class="c-parts c-parts--alpha c-parts--1"><li>Find the population after $1$, $2$ and $3$ weeks.</li><li>Write the population after $n$ weeks.</li><li>After how many weeks does it first exceed $20\\,000$?</li></ol>`,
];
const cases = [
  `<div class="c-case"><p>The first row of a school hall has $20$ seats, and every row after it has $2$ seats more than the row in front. The hall has $25$ rows.</p></div><ol class="c-parts c-parts--alpha c-parts--1"><li>How many seats are in the $10$th row?</li><li>How many seats are in the last row?</li><li>How many seats does the hall have in all?</li><li>Which row has $50$ seats?</li></ol>`,
  `<div class="c-case"><p>A sheet of paper $0.1$ mm thick is folded in half, then in half again, and so on. Each fold doubles the thickness of the stack.</p></div><ol class="c-parts c-parts--alpha c-parts--1"><li>How thick is the stack after $3$ folds?</li><li>Write its thickness after $n$ folds.</li><li>How thick is it after $10$ folds?</li><li>What is the fewest number of folds that makes it thicker than $1$ m?</li></ol>`,
];
const run = [
  ['Choose the correct option', mcq],
  ['Assertion and reason', [...ar, ...newAR]],
  ['Very short answer', vsa],
  ['Short answer', sa],
  ['Long answer', la],
  ['Case-based questions', cases],
];
const practice = []; let n = 0;
for (const [sub, qs] of run) {
  qs.forEach((q, i) => {
    n++;
    const first = n === 1;
    const lines = [];
    if (first) lines.push('<div class="c-practice__head"><span class="c-practice__num">3</span>Practice questions</div>');
    if (i === 0) lines.push(`<div class="c-practice__sub">${sub}</div>`);
    if (i === 0 && sub === 'Assertion and reason') lines.push(`<p class="c-practice__note">In Questions ${n} to ${n + qs.length - 1}, choose (a) if both A and R are true and R explains A; (b) if both are true but R does not explain A; (c) if A is true but R is false; (d) if A is false but R is true.</p>`);
    lines.push(`<ol class="c-questions"${first ? '' : ` data-start="${n}"`}>`, `  <li>${q}</li>`, '</ol>');
    practice.push(`<div class="c-practice${first ? '' : ' c-practice--cont'}">\n        ${lines.join('\n        ')}\n      </div>`);
  });
}

// ---- Stage 4: the key -----------------------------------------------------
const key = ['b', 'b', 'b', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'c', 'b', 'b', 'b', 'b', 'b', 'c', 'b', 'c', 'c', 'b', 'b', 'a', 'a', 'd', 'a', 'a', 'c'];
if (key.length !== mcq.length + 4) throw Error('key length');
const keyRow = (from, to) => `<li>
          <span class="c-answers__stage">${from}&ndash;${to}</span>
          <span class="c-answers__list">${key.slice(from - 1, to).map((k, i) => `<span class="n">${from + i}</span> (${k})`).join(' &nbsp; ')}</span>
        </li>`;
const worked = [
  ['29', '$4 + 6 \\times 5 = 34$'],
  ['30', '$\\tfrac{27}{81} = \\tfrac13$'],
  ['31', '$6^2 + 1 = 37$'],
  ['32', '$t_n = 4n - 1$, and $4n - 1 \\lt 200$ for $n \\leq 50$, since $t_{50} = 199$ and $t_{51} = 203$: $50$ terms'],
  ['33', '$r^2 = \\tfrac{48}{12} = 4$, so $r = 2$ and $a = \\tfrac{12}{4} = 3$'],
  ['34', '$S_{40} - S_{10} = 820 - 55 = 765$'],
  ['35', '$4, 5, 7, 11, 19$'],
  ['36', '(a) $10 + 19 \\times 5 = 105$ rupees (b) $\\tfrac{20}{2}(10 + 105) = 1150$ rupees (c) $10 + 5(n - 1) \\gt 200$ first when $n = 40$, when she saves <span class="nb">₹205</span>'],
  ['37', '(a) $3000$, $4500$, $6750$ (b) $2000 \\times \\left(\\tfrac32\\right)^n$ (c) $\\left(\\tfrac32\\right)^5 \\approx 7.6$ and $\\left(\\tfrac32\\right)^6 \\approx 11.4$, so after $6$ weeks'],
  ['38', '(a) $20 + 9 \\times 2 = 38$ (b) $20 + 24 \\times 2 = 68$ (c) $\\tfrac{25}{2}(20 + 68) = 1100$ (d) $20 + 2(n - 1) = 50$ gives $n = 16$'],
  ['39', '(a) $0.8$ mm (b) $0.1 \\times 2^n$ mm (c) $102.4$ mm (d) $1$ m is $1000$ mm, and $0.1 \\times 2^{13} = 819.2$ but $0.1 \\times 2^{14} = 1638.4$, so $14$ folds'],
];
const answers = [stage(4, 'Answers'), `<ol class="c-answers">
        ${keyRow(1, 12)}
        ${keyRow(13, 24)}
        ${keyRow(25, 28)}
      </ol>`, `<div class="work work--trace">
${worked.map(([l, t]) => `        <div class="work__row"><span class="work__label">${l}</span>
          <span>${t}</span></div>`).join('\n')}
      </div>`];

// ---- write: conservative pages, refit packs them --------------------------
const pages = [[...stage1Out, stage(2, 'Solved Examples')], practice, answers];
for (const f of fs.readdirSync(dir).filter(f => /^p1\d\d\.html$/.test(f))) fs.unlinkSync(path.join(dir, f));
pages.forEach((bs, i) => fs.writeFileSync(path.join(dir, `p${101 + i}.html`),
  `<section class="page" data-bridge>\n  <div class="page__body">\n    <div class="page__main">\n\n      ${bs.join('\n\n      ')}\n\n    </div>\n  </div>\n</section>\n`));
console.log(`Stage 1: ${tries.length} questions (3 replaced), ${stage1Out.length} blocks; practice: ${n} questions; key ${key.length} letters.`);
