#!/usr/bin/env node
/* Re-derive every number this chapter's answers rest on.
   Nothing here restates a printed value as its own truth: each answer is
   computed from the rule or the facts the question gives, and compared with
   what ANSWERS.md and the pages print.

     node pages/class-9/ch08-sequences/check-numbers.mjs

   Four parts:
     A  the body's worked examples: each Answer row's values
     B  every exercise and Think-and-Reflect answer in ANSWERS.md, and the
        two printed statements corrected on 23 September 2026
     C  Beyond the Book: Stage 1's answers, and every multiple-choice and
        assertion-reason question — exactly one option is right, and it is
        the one the printed key names
     D  the printed practice key, the practice answers, and ANSWERS.md agree

   Exits non-zero if anything does not hold up. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
let pass = 0;
const fails = [];
const ok = (what, got, want) => {
  if (JSON.stringify(got) === JSON.stringify(want)) pass++;
  else fails.push(`${what}\n      computed ${JSON.stringify(got)}\n      printed  ${JSON.stringify(want)}`);
};
const is = (what, cond) => { if (cond) pass++; else fails.push(what); };
const near = (a, b, t = 1e-9) => Math.abs(a - b) < t;

const seq = (f, n, from = 1) => Array.from({ length: n }, (_, i) => f(i + from));
const rec = (first, step, n) => { const out = [first]; while (out.length < n) out.push(step(out.at(-1), out.length + 1, out)); return out; };
const S = n => n * (n + 1) / 2;
const termIndex = (f, value, max = 100000) => { for (let n = 1; n <= max; n++) if (near(f(n), value)) return n; return null; };
const isAP = s => s.slice(2).every((x, i) => near(x - s[i + 1], s[1] - s[0]));
const isGP = s => s.slice(2).every((x, i) => near(x / s[i + 1], s[1] / s[0]));

const answers = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const pages = fs.readdirSync(DIR).filter(f => /^p\d{3}\.html$/.test(f)).sort()
  .map(f => fs.readFileSync(path.join(DIR, f), 'utf8')).join('\n');
const inAnswers = (what, s) => is(`ANSWERS.md prints ${what}: ${s}`, answers.includes(s));

/* ---- A  the body's worked examples ---------------------------------- */
ok('Ex 1 first three terms of 2n - 1', seq(n => 2 * n - 1, 3), [1, 3, 5]);
ok('Ex 2 308 a term of 5n - 2, 471 not', [termIndex(n => 5 * n - 2, 308), termIndex(n => 5 * n - 2, 471)], [62, null]);
ok('Ex 3 u1 = 1, u = 2u + 3', rec(1, u => 2 * u + 3, 4), [1, 5, 13, 29]);
ok('Ex 4 s1 = 3, s = s(s - 1)', rec(3, s => s * (s - 1), 4), [3, 6, 30, 870]);
ok('Ex 4 fifth term 870 x 869', 870 * 869, 756030);
ok('Ex 5 fare for 10 km', 200 + 40 * 10, 600);
ok('Ex 6 25 + ... + 58', S(58) - S(24), 1411);
is('Ex 7 the three lists are GPs', [[1, 2, 4, 8, 16], [1, 3, 9, 27, 81], [1, -1, 1, -1]].every(isGP));
is('Ex 8 5, 15/4, 45/16, 135/64 is a GP with r = 3/4', isGP([5, 15 / 4, 45 / 16, 135 / 64]) && near(15 / 4 / 5, 0.75));

/* ---- B  the exercises and Think-and-Reflect, in ANSWERS.md ---------- */
ok('Set 8.1 Q1 (a)', seq(n => 2 + 4 * (n - 1), 3, 5), [18, 22, 26]);
ok('Set 8.1 Q1 (b)', seq(n => 2 ** (n - 1), 3, 5), [16, 32, 64]);
ok('Set 8.1 Q1 (c)', seq(n => 100 - 9 * (n - 1), 3, 5), [64, 55, 46]);
ok('Set 8.1 Q2 triangular t5..t8', seq(S, 4, 5), [15, 21, 28, 36]);
ok('Set 8.1 Q3', 49 - 36, 2 * 7 - 1);
ok('Set 8.2 Q1 (a)', seq(n => 3 * n - 4, 5), [-1, 2, 5, 8, 11]);
ok('Set 8.2 Q1 (b)', seq(n => 2 - 5 * n, 5), [-3, -8, -13, -18, -23]);
ok('Set 8.2 Q1 (c)', seq(n => n * n - 2 * n + 3, 5), [2, 3, 6, 11, 18]);
ok('Set 8.2 Q2', [5 * 10 - 3, 5 * 15 - 3], [47, 72]);
ok('Set 8.2 Q3 neither 97 nor 172', [termIndex(n => 5 * n + 3, 97), termIndex(n => 5 * n + 3, 172)], [null, null]);
ok('Set 8.2 Q4', termIndex(n => 5 * n - 3, 607), 122);
ok('Set 8.2 Q5 terms', [1, 2, 3, 12, 50].map(n => 3 * n + 7), [10, 13, 16, 43, 157]);
ok('Set 8.2 Q5: 331 is the 108th term, 557 is not', [termIndex(n => 3 * n + 7, 331), termIndex(n => 3 * n + 7, 557)], [108, null]);
is('Set 8.2 Q5 asks for 331 (it asked for 332, not a term, until 23 Sep 2026)', pages.includes('say which term is $331$'));
ok('Set 8.3 Q1', rec(-5, t => t + 3, 5), [-5, -2, 1, 4, 7]);
ok('Set 8.3 Q1 52 is the 20th', termIndex(n => 3 * n - 8, 52), 20);
ok('Set 8.3 Q2', rec(1, (t, n, a) => n === 2 ? 2 : n === 3 ? 4 : a[n - 2] + a[n - 3] + a[n - 4], 8).slice(3), [7, 13, 24, 44, 81]);
is('Set 8.3 Q3 3n - 1 gives 2, 5, 8, 11', seq(n => 3 * n - 1, 4).join() === '2,5,8,11');
ok('Set 8.3 Q4', [rec(1, t => t + 3, 8).at(-1), 3 * 8 - 2], [22, 22]);
ok('Set 8.4 Q1', [3 + 8 * 5, 3 + 25 * 5], [43, 128]);
ok('Set 8.4 Q2 -81 is the 35th, 0 the 8th', [termIndex(n => 24 - 3 * n, -81), termIndex(n => 24 - 3 * n, 0)], [35, 8]);
is('Set 8.4 Q3 14 - 3n gives 11, 8, 5, 2', seq(n => 14 - 3 * n, 4).join() === '11,8,5,2');
is('Set 8.4 Q4 rules', seq(n => 3 * n - 1, 4).join() === '2,5,8,11' && seq(n => 4 * n - 9, 4).join() === '-5,-1,3,7' && seq(n => 2 * n - 0.5, 4).join() === '1.5,3.5,5.5,7.5');
ok('Set 8.5 Q1', (() => { const d = (106 - 12) / 47, a = 12 - 2 * d; return [d, a, a + 28 * d]; })(), [2, 8, 64]);
ok('Set 8.5 Q2', (() => { const m = []; for (let k = 10; k <= 99; k++) if (k % 3 === 0) m.push(k); return [m.length, m.reduce((a, b) => a + b)]; })(), [30, 1665]);
ok('Set 8.5 Q3 years', (700000 - 500000) / 20000, 10);
ok('Set 8.5 Q4', S(25), 325);
ok('Set 8.5 Q5', S(100) - S(99), 100);
ok('Set 8.6 Q1', [5 ** 10], [9765625]);
ok('Set 8.6 Q2', 192 * 2 ** 4, 3072);
ok('Set 8.6 Q3', termIndex(n => 2 * 3 ** (n - 1), 4374, 30), 8);
is('Set 8.6 Q4 (a), (b) GPs, (c) not', isGP([2, 10, 50, 250]) && isGP([4, 2, 1, 0.5]) && !isGP([3, 6, 9, 12]));
ok('Set 8.6 Q5 (a)', +(80 * 0.6 ** 5).toFixed(4), 6.2208);
ok('Set 8.6 Q5 (b)', +(80 + 2 * [1, 2, 3, 4, 5].reduce((s, k) => s + 80 * 0.6 ** k, 0)).toFixed(4), 301.3376);
ok('Set 8.6 Q6', rec(2, t => 3 * t - 2, 7), [2, 4, 10, 28, 82, 244, 730]);
ok('Set 8.6 Q7', (() => { const d = (73 - 38) / 5; return [d, 38 - 10 * d]; })(), [7, -32]);
ok('Set 8.6 Q8', (() => { const d = 12 / 2; return [16 - 2 * d, d]; })(), [4, 6]);
ok('Set 8.6 Q9', (() => { const m = []; for (let k = 100; k <= 999; k++) if (k % 7 === 0) m.push(k); return [m.length, m[0], m.at(-1)]; })(), [128, 105, 994]);
ok('Set 8.6 Q10', (() => { let c = 0; for (let k = 11; k < 250; k++) if (k % 4 === 0) c++; return c; })(), 60);
ok('Set 8.6 Q11', [30 * 4, 30 * 16], [120, 480]);
ok('Set 8.6 Q12', (() => { const d = (44 - 24) / 4, a = (24 - 10 * d) / 2; return [a, a + d, a + 2 * d]; })(), [-13, -8, -3]);
ok('Set 8.6 Q13', termIndex(n => (S(n) > 1000 ? 1 : 0), 1), 45);
const runs = total => { const out = []; for (let k = 2; k <= total; k++) for (let a = 1; a <= total; a++) if (k * (2 * a + k - 1) / 2 === total) out.push([a, k]); return out; };
ok('Set 8.6 Q14 runs summing to 100', runs(100), [[18, 5], [9, 8]]);
ok('T&R 8.1 next three of each list', [seq(n => n, 3, 7), seq(n => 2 * n - 1, 3, 7), seq(S, 3, 7), seq(n => n * n, 3, 7)], [[7, 8, 9], [13, 15, 17], [28, 36, 45], [49, 64, 81]]);
ok('T&R 8.5 sums and triangular numbers', [S(20), S(50), S(1000), S(10), S(17), S(80)], [210, 1275, 500500, 55, 153, 3240]);
ok('T&R 8.6 tile pattern 4n - 3 reaches 81 at stage 21, passes 1000 at 251', [termIndex(n => 4 * n - 3, 81), termIndex(n => (4 * n - 3 > 1000 ? 1 : 0), 1)], [21, 251]);
ok('T&R 8.6 doubling 3 x 2^(n-1) first passes 81 at stage 6 and 1000 at stage 10', [termIndex(n => (3 * 2 ** (n - 1) >= 81 ? 1 : 0), 1), termIndex(n => (3 * 2 ** (n - 1) >= 1000 ? 1 : 0), 1)], [6, 10]);
is('p017 prints the doubling stages as corrected', pages.includes('reaches eighty-one at its sixth stage and a thousand at its tenth'));
ok('T&R 8.6 Sierpinski stages 4 and 5', [3 ** 4, 3 ** 5, 81 / 256, 243 / 1024], [81, 243, (3 / 4) ** 4, (3 / 4) ** 5]);
for (const s of ['$18, 22, 26$', '$t_5 = 15$, $t_6 = 21$, $t_7 = 28$, $t_8 = 36$', '$2, 3, 6, 11, 18$', '$t_{10} = 47$ and $t_{15} = 72$', 'the $122$nd term',
  '$t_{12} = 43$, $t_{50} = 157$', '$3n = 324$', '$108$th term', '$T_4 = 7$, $T_5 = 13$, $T_6 = 24$, $T_7 = 44$, $T_8 = 81$', '$t_{26} = 3 + 25 \\times 5 = 128$',
  'the $35$th', 'the $8$th term', '$t_{29} = 8 + 28 \\times 2 = 64$', '1665', 'after $10$ years', '325$ marbles', '$S_{100} - S_{99} = 100$', '9\\,765\\,625$',
  '3072', '6.2208$ m', '301.3376$ m', 'the $7$th term', '$a = 38 - 10 \\times 7 = -32$', '$4, 10, 16, 22, \\ldots$', '$142 - 15 + 1 = 128$', '+ 1 = 60$',
  '$120$ after $2$ hours, $480$ after $4$', '$-13, -8, -3$', '13. $45$', '$18 + 19 + 20 + 21 + 22$ and $9 + 10 + \\cdots + 16$',
  'at stage $251$', 'stage $6$', 'at stage\n   $10$', '$3^4 = 81$', '$\\tfrac{243}{1024}$']) inAnswers('a value', s);

/* ---- C  Beyond the Book --------------------------------------------- */
// Stage 1.
{
  const s = [2, 6, 12, 20, 30];
  is('Stage 1 Q1 neither AP nor GP, and n(n + 1) fits', !isAP(s) && !isGP(s) && s.every((x, i) => x === (i + 1) * (i + 2)));
  const d = 15 / 3, a = 19 - 3 * d;
  ok('Stage 1 Q2 a, d', [a, d], [4, 5]);
  is('Stage 1 Q3 a GP with a = 5, r = 1/2 stays positive', seq(n => 5 * 0.5 ** (n - 1), 60).every(x => x > 0));
  const m9 = []; for (let k = 100; k <= 999; k++) if (k % 9 === 0) m9.push(k);
  ok('Stage 1 Q4 three-digit multiples of 9', [m9.length, m9[0], m9.at(-1)], [100, 108, 999]);
  ok('Stage 1 Q5', rec(1, (t, n) => t + 2 * n - 1, 5), [1, 4, 9, 16, 25]);
  is('Stage 1 Q6 3, 6, 9 is an AP and 3, 6, 12 a GP', isAP([3, 6, 9]) && isGP([3, 6, 12]));
  ok('Stage 1 Q7 runs summing to 45', runs(45), [[22, 2], [14, 3], [7, 5], [5, 6], [1, 9]]);
  const gp = r => [-1 / r, -1, -r];
  is('Stage 1 Q8 r = -3/4 and -4/3 give sum 13/12 and product -1', [-3 / 4, -4 / 3].every(r => near(gp(r).reduce((x, y) => x + y), 13 / 12) && near(gp(r).reduce((x, y) => x * y), -1)));
  for (const s of ['$22 + 23$, $14 + 15 + 16$', '$a = 4$, $d = 5$', 'from $108 = 9 \\times 12$ to $999 = 9 \\times 111$']) inAnswers('a Stage 1 value', s);
}
// Practice: every multiple-choice question, with the option each computation picks.
const pick = (opts, test) => { const hits = opts.map((o, i) => (test(o) ? 'abcd'[i] : '')).join(''); return hits; };
const expected = [
  pick([11, 14, 17, 20], x => x === 2 + 4 * 3),
  pick([3, 4, 9, 15], x => x === 12 / 3),
  pick(['a + nd', 'a + (n-1)d', 'a(n-1)d', 'ad^(n-1)'], x => x === 'a + (n-1)d'),
  pick([190, 200, 210, 400], x => x === S(20)),
  pick([12, 16, 32, 64], x => x === 2 ** 5),
  pick([[1, 2, 4, 8], [1, 4, 9, 16], [5, 9, 13, 17], [2, 6, 18, 54]], isAP),
  pick([13, 15, 18, 23], x => x === rec(3, t => t + 5, 4).at(-1)),
  pick(['a + (n-1)r', 'ar^n', 'ar^(n-1)', 'a + nr'], x => x === 'ar^(n-1)'),
  pick([45, 50, 55, 100], x => x === S(10)),
  pick(['increasing', 'decreasing', 'equal', 'none'], x => x === 'equal'),
  pick(['(i)', '(ii)', '(ii)(iii)', 'all'], x => x === (isAP([1, 4, 9, 16]) ? 'all' : '(ii)(iii)')),
  pick([2, 3, 4, 6], x => x === (24 - 12) / 4),
  pick([2, 3, 6, 9], x => x === Math.sqrt(54 / 6)),
  pick([33, 34, 35, 36], x => x === (205 - 7) / 6 + 1),
  pick(['n(n+1)/2', 'n^2', '2n-1', 'n(n+1)'], x => x === 'n^2' && seq(n => n * n, 5).every((v, i) => v === seq(k => 2 * k - 1, i + 1).reduce((a, b) => a + b))),
  pick([77, 81, 85, 89], x => x === 5 + 19 * 4),
  pick([855, 900, 945, 990], x => { let s = 0; for (let k = 10; k <= 99; k++) if (k % 5 === 0) s += k; return x === s; }),
  pick([2, 3, 4, 9], x => x ** 4 === 162 / 2),
  pick(['3n', 'n^3', '3^n', '3^(n-1)'], x => x === '3^n'),
  pick([25, 12.5, 6.25, 3.125], x => x === 100 / 2 ** 4),
  pick([13, 14, 15, 20], x => x === termIndex(n => (S(n) > 100 ? 1 : 0), 1)),
  pick(['x + z = 2y', 'y^2 = xz', 'xz = y', 'x + y = z'], x => x === 'y^2 = xz' && near((3 * 2 ** 9) ** 2, (3 * 2 ** 3) * (3 * 2 ** 15))),
  pick(['9 GP', '9 AP', '256 GP', 'same'], x => x === `${termIndex(n => 4 * 2 ** (n - 1), 1024)} GP` && termIndex(n => 4 + 4 * (n - 1), 1024) === 256),
  pick(['(3/4)^n', '(1/4)^n', '3/(4n)', 'n/4'], x => x === '(3/4)^n'),
  // Assertion and reason: 2, 4, 8, 16 is not an AP (A false) but each term is twice the last (R true).
  !isAP([2, 4, 8, 16]) && isGP([2, 4, 8, 16]) ? 'd' : '?',
  // An AP with d = -3 goes negative, and R is exactly why.
  termIndex(n => (100 - 3 * (n - 1) < 0 ? 1 : 0), 1) ? 'a' : '?',
  // 5, 5, 5 is an AP (d = 0) and a GP (r = 1), and that is why.
  isAP([5, 5, 5]) && isGP([5, 5, 5]) ? 'a' : '?',
  // S20 = 210, but n(n+1)/2 is not the sum of every AP (2, 4, 6 has sum 12, not 6).
  S(20) === 210 && 2 + 4 + 6 !== S(3) ? 'c' : '?',
];
const keyPrinted = [...pages.matchAll(/<span class="n">(\d+)<\/span> \(([a-d])\)/g)].map(m => [+m[1], m[2]]);
ok('the printed key covers questions 1 to 28 in order', keyPrinted.map(k => k[0]), seq(n => n, 28));
expected.forEach((e, i) => ok(`practice Q${i + 1}: exactly one option right, the printed one`, e, keyPrinted[i][1]));

/* ---- D  the practice answers, and ANSWERS.md agrees -------------------- */
ok('Q29', 4 + 6 * 5, 34);
ok('Q30', 27 / 81, 1 / 3);
ok('Q31', 6 * 6 + 1, 37);
ok('Q32', termIndex(n => (4 * n - 1 >= 200 ? 1 : 0), 1) - 1, 50);
ok('Q33', (() => { const r = Math.sqrt(48 / 12); return [r, 12 / r ** 2]; })(), [2, 3]);
ok('Q34', S(40) - S(10), 765);
ok('Q35', rec(4, t => 2 * t - 3, 5), [4, 5, 7, 11, 19]);
ok('Q36', [10 + 19 * 5, 20 / 2 * (10 + 105), termIndex(n => (10 + 5 * (n - 1) > 200 ? 1 : 0), 1)], [105, 1150, 40]);
ok('Q37', [2000 * 1.5, 2000 * 1.5 ** 2, 2000 * 1.5 ** 3, termIndex(n => (2000 * 1.5 ** n > 20000 ? 1 : 0), 1)], [3000, 4500, 6750, 6]);
ok('Q38', [20 + 9 * 2, 20 + 24 * 2, 25 / 2 * (20 + 68), termIndex(n => 20 + 2 * (n - 1), 50)], [38, 68, 1100, 16]);
ok('Q39', [+(0.1 * 2 ** 3).toFixed(4), +(0.1 * 2 ** 10).toFixed(4), termIndex(n => (0.1 * 2 ** n > 1000 ? 1 : 0), 1)], [0.8, 102.4, 14]);
const keyAnswers = [...answers.matchAll(/^\d+–\d+: (.+)$/gm)].flatMap(m => [...m[1].matchAll(/\(([a-d])\)/g)].map(x => x[1]));
ok('ANSWERS.md prints the same key as the book', keyAnswers, keyPrinted.map(k => k[1]));
for (const s of ['$4 + 6 \\times 5 = 34$', '$6^2 + 1 = 37$', '$S_{40} - S_{10} = 820 - 55 = 765$', '$4, 5, 7, 11, 19$', '= 1100$', '$102.4$ mm'])
  is(`the book prints ${s}`, pages.includes(s));

console.log(`${pass} checks passed${fails.length ? `, ${fails.length} failed:\n  ${fails.join('\n  ')}` : ''}.`);
process.exit(fails.length ? 1 : 0);
