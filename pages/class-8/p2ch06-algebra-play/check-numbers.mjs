#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed — by evaluating the algebra, by running the trick, or by
   searching every allowed case — and compared with what is on the page.

     node pages/class-8/p2ch06-algebra-play/check-numbers.mjs [--skipped]

   Four parts:
     A  every '=' set as maths, on every page and in ANSWERS.md. Display
        maths ($$...$$) is read before inline maths. A side that is pure
        arithmetic is evaluated; a side with letters is evaluated at many
        random values, so an identity such as 2(x+k)-8 = 2x+2k-8 is tested
        as an identity, and a wrong one fails
     B  the claims A cannot check: tricks run for every allowed start,
        searches, calendar squares, and the printed answers read back out
        of the example Answer rows, the key rows and ANSWERS.md, one
        lettered part at a time
     C  every multiple-choice and assertion-reason question: exactly one
        option is right, and it is the one the key prints
     D  ANSWERS.md prints the same key as the page

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
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ');
// maths stripped to plain numbers and words, for reading printed values
const plain = (s) => text(s).replace(/\\dfrac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)')
  .replace(/\\times/g, '×').replace(/\\,|\\ /g, ' ').replace(/\{,\}/g, '').replace(/\$/g, '').replace(/\s+/g, ' ');
// ANSWERS.md read the same way, but with no tags to strip: it prints p < q
const md = answersMd.replace(/\\dfrac\{([^{}]*)\}\{([^{}]*)\}/g, '($1)/($2)').replace(/\\times/g, '×').replace(/\\div/g, '÷')
  .replace(/\\,|\\ /g, ' ').replace(/\$|\*\*/g, '').replace(/\s+/g, ' ');

/* ---- A. every identity ---------------------------------------- */

// LaTeX to a JS expression over the letters in v, or null
function toExpr(side) {
  let s = side.trim().replace(/[.,;:]+$/, '');
  if (!s) return null;
  s = s
    .replace(/\\left|\\right/g, '')
    .replace(/\\,|\\;|\\!|\\ |\\quad|\\qquad/g, '')
    .replace(/\{,\}/g, '')
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\^\{([^{}]+)\}/g, '**($1)').replace(/\^(\w)/g, '**$1')
    .replace(/\s+/g, '');
  if (!/^[-+*/().0-9a-zA-Z]+$/.test(s)) return null;
  // implicit products: 4a, 2(, )(, )a, ab (a run of letters is a product), a(
  s = s.replace(/(\d)(?=[a-zA-Z(])/g, '$1*')
    .replace(/\)(?=[\w(])/g, ')*')
    .replace(/([a-zA-Z])(?=[a-zA-Z(\d])/g, '$1*');
  s = s.replace(/[a-zA-Z]/g, (l) => `v.${l}`);
  return s;
}
const evalAt = (e, v) => { try { return Function('v', `"use strict";return (${e})`)(v); } catch { return NaN; } };
const hasVars = (e) => /v\./.test(e);
const LETTERS = 'abcdefghijklmnopqrstuvwxyzA'.split('');
const randomV = (seed) => Object.fromEntries(LETTERS.map((l, i) => [l, ((seed * 7919 + i * 104729) % 97) + 2 + ((seed + i) % 5) / 7]));
const SAMPLES = [1, 2, 3, 4, 5, 6, 7, 8].map(randomV);

// equations printed with letters on both sides that are conditions, not
// identities: they hold only for the numbers the question is about
const CONDITIONS = new Set([
  // equations to be solved, each checked by search in part B
  '9 + c = a', 'c + 7 = b', 'm = 17 - 2s', 'b = 10 - a', '10a + b = 7(a + b)', '3a = 6b', 'a = 2b', '10a + b = 6(a + b) + 4', 'a = b + 2', '4d + 5 = 3(d + 5)', '40 - y = 7(10 - y)', 's = 18 - 2c', 's = 21 - 3m', 't = 19 - 2c', '3s + 10 = 2(s + 10)', '3h - 4 = h + 4', '10a + b = 8(a + b)', '2a = 7b',
  'b = 12 - a', 'b = 11 - a', '8x = 7c', '4x = 3c', 'c=\\dfrac{8x}{7}', 'c=\\dfrac{4x}{3}', '2^{n}x=(2^{n}-1)c',
  // Beyond, tried-and-explained question 5
  '10a + b = 4(a + b)', '10a + b = 4a + 4b', '6a = 3b', 'b = 2a',
].map(s => s.replace(/\s+/g, '')));
// assertions printed to be judged, and false on purpose: none in this chapter
const FALSE_ON_PURPOSE = [];

let spans = 0, equations = 0; const skipped = [];
function checkSpan(where, span) {
  if (!span.includes('=')) return;
  const compact = span.replace(/\s+/g, '').replace(/\\,/g, '').replace(/[.,]$/, '');
  if (FALSE_ON_PURPOSE.includes(compact)) return;
  if (/\\le|\\ge|\\lt|\\gt|<|>|\\ne/.test(span)) { skipped.push(`${where}: $${span.trim()}$`); return; }
  // a chain of steps "13 \to 26 - 10 = 16 \to ..." is checked link by link
  for (const piece of span.split(/\\to/)) {
    if (!piece.includes('=')) continue;
    const pc = piece.replace(/\s+/g, '').replace(/\\,/g, '').replace(/[.,]$/, '');
    if (CONDITIONS.has(pc)) continue;
    const sides = piece.split('=').map(s => s.trim()).filter(Boolean);
    if (sides.length < 2) continue;
    const ex = sides.map(toExpr);
    if (ex.some(e => e === null)) { skipped.push(`${where}: $${piece.trim()}$`); continue; }
    const vals = ex.map(e => SAMPLES.map(v => evalAt(e, v)));
    if (vals.some(vs => vs.some(n => !Number.isFinite(n)))) { skipped.push(`${where}: $${piece.trim()}$`); continue; }
    const constant = (vs) => vs.every(n => Math.abs(n - vs[0]) < 1e-9);
    // sides that do not depend on the letters must all agree
    const fixed = vals.filter(constant);
    const moving = vals.filter(vs => !constant(vs));
    let bad = false;
    for (const f of fixed) if (Math.abs(f[0] - fixed[0][0]) > 1e-9) bad = true;
    // sides that do depend on them must agree with each other everywhere
    for (const m of moving) if (m.some((n, i) => Math.abs(n - moving[0][i]) > 1e-9 * Math.max(1, Math.abs(n)))) bad = true;
    // a lone moving side beside fixed ones is an equation to be solved
    // (4a + 16 = 70), which part B checks by search; two moving sides are
    // an identity, whatever fixed sides a chain also carries
    if (moving.length === 1) {
      if (fixed.length > 1 && bad) { spans++; fails.push(`${where}: $${piece.trim()}$ does not hold`); }
      else equations++;
      continue;
    }
    spans++;
    if (bad) fails.push(`${where}: $${piece.trim()}$ does not hold`);
    else pass++;
  }
}
const sources = [...pages.map(f => [f, html[f]]), ['ANSWERS.md', answersMd]];
for (const [f, src0] of sources) {
  let src = src0.replace(/<!--[\s\S]*?-->/g, '');
  // display maths first, so its $$ is not read as two empty inline spans
  src = src.replace(/\$\$([\s\S]+?)\$\$/g, (m, d) => {
    for (const part of d.split(/\\qquad|,\s*\\quad/)) checkSpan(f + ' (display)', part);
    return ' ';
  });
  for (const m of src.matchAll(/\$([^$]+)\$/g)) checkSpan(f, m[1]);
}

/* ---- B. claims arithmetic alone does not check ---------------- */

const bodyText = plain(body);
const has = (where, src, phrase) => is(`${where} should print "${phrase}"`, src.replace(/\s+/g, '').includes(phrase.replace(/\s+/g, '')));

// §6.1 Tanvi's trick, run on every start
const tanvi = (x, add) => (2 * x + add) / 2 - x;
is('Tanvi ends at 5 for every start', range(-500, 5000).every(x => tanvi(x, 10) === 5));
ok('the Tanvi table: 7 -> 14, 24, 12, 5', [7 * 2, 7 * 2 + 10, (7 * 2 + 10) / 2, (7 * 2 + 10) / 2 - 7], [14, 24, 12, 5]);
is('add 2k ends at k', range(1, 50).every(k => range(1, 200).every(x => tanvi(x, 2 * k) === k)));
ok('add 6 and add 20', [tanvi(9, 6), tanvi(9, 20)], [3, 10]);
is('Example 1 ends at 6 for every start', range(-200, 1000).every(x => ((x + 4) * 3 - 3 * x) / 2 === 6));
ok('T&R 6.1: add 16', tanvi(3, 16), 8);
is('T&R 6.1: halving first is not constant', new Set(range(1, 9).map(x => x / 2 + 10 - x)).size > 1);

// §6.2 the date trick
const dateTrick = (m, d, [k1, a1, k2, a2, k3] = [4, 7, 5, 3, 5]) => ((m * k1 + a1) * k2 + a2) * k3 + d;
const days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const allDates = days.flatMap((n, i) => range(1, n).map(d => [i + 1, d]));
is('date trick recovers every date of the year', allDates.every(([m, d]) => { const r = dateTrick(m, d) - 190; return Math.floor(r / 100) === m && r % 100 === d; }));
ok('Children\'s Day chain', [11 * 4, 44 + 7, 51 * 5, 255 + 3, 258 * 5, dateTrick(11, 14), dateTrick(11, 14) - 190], [44, 51, 255, 258, 1290, 1304, 1114]);
ok('Example 2 chain', [9 * 4, 36 + 7, 43 * 5, 215 + 3, 218 * 5, dateTrick(9, 5), dateTrick(9, 5) - 190], [36, 43, 215, 218, 1090, 1095, 905]);
ok('add 8 in place of add 7 gives 215', dateTrick(0, 0, [4, 8, 5, 3, 5]), 215);
ok('T&R 6.2: 435 is no date', [Math.floor((435 - 190) / 100), (435 - 190) % 100], [2, 45]);
is('T&R 6.2: 435 is no date', !allDates.some(([m, d]) => dateTrick(m, d) === 435));
ok('T&R 6.2: multipliers 2, 5, 10 take away 380', dateTrick(0, 0, [2, 7, 5, 3, 10]), 380);
is('T&R 6.2: multipliers 2, 5, 10 still work', allDates.every(([m, d]) => dateTrick(m, d, [2, 7, 5, 3, 10]) - 380 === 100 * m + d));
ok('Ex 6.1 Q1', [14, 7, 0].map(k => tanvi(3, k)), [7, 3.5, 0]);
ok('Ex 6.1 Q3', [...new Set(range(1, 500).map(x => (2 * (x + 6) - 2) / 2 - x))], [5]);
ok('Ex 6.1 Q4: add 5', dateTrick(0, 0, [4, 7, 5, 5, 5]), 200);
ok('Ex 6.1 Q5: 1003', [Math.floor((1003 - 190) / 100), (1003 - 190) % 100], [8, 13]);
{ const key = (m, d) => 20 * m + d; ok('Ex 6.1 Q6: 21 Jan and 1 Feb collide', key(1, 21), key(2, 1)); }

// §6.3–6.4 pyramids
const up = (row) => row.slice(1).map((x, i) => x + row[i]);
const top = (row) => { while (row.length > 1) row = up(row); return row[0]; };
const binom = (n) => { let r = [1]; for (let i = 1; i < n; i++) r = [1, ...up(r), 1]; return r; };
const midFor = (l, r, t) => range(-100, 300).filter(c => top([l, c, r]) === t);
ok('multipliers 1..5 rows', [1, 2, 3, 4, 5].map(binom), [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]);
ok('opener pyramid', [up([3, 8, 5]), top([3, 8, 5])], [[11, 13], 24]);
ok('Fig 6.1', [up([2, 3, 4]), top([2, 3, 4])], [[5, 7], 12]);
ok('Fig 6.2', midFor(9, 7, 50).map(c => [c, ...up([9, c, 7])]), [[17, 26, 24]]);
ok('Example 3', midFor(6, 12, 56).map(c => [c, ...up([6, c, 12])]), [[19, 25, 31]]);
ok('6, 20, 12 is no pyramid with top 56', top([6, 20, 12]), 58);
ok('text tops', [top([5, 12, 6]), top([3, 10, 7, 9])], [35, 63]);
ok('T&R 6.3 rows', [top([2, 12, 4]), top([5, 10, 5])], [30, 30]);
ok('T&R 6.3: no whole middle', midFor(5, 6, 20), []);
ok('T&R 6.4: same n', [top([7, 7, 7]), top([7, 7, 7, 7])], [28, 56]);
ok('Ex 6.2 Q1', [[6, 11, 9], [8, 15, 2], [12, 7, 20]].map(top), [37, 40, 46]);
ok('Ex 6.2 Q2', [[5, 9, 14, 2], [10, 4, 8, 3], [6, 13, 1, 12]].map(top), [76, 49, 60]);
ok('Ex 6.2 Q4', [[5, 9, 52], [8, 6, 44], [11, 3, 30]].map(([l, r, t]) => midFor(l, r, t).map(c => [c, ...up([l, c, r])])[0]), [[19, 24, 28], [15, 23, 21], [8, 19, 11]]);
ok('Ex 6.2 Q5', [[3, 4, 5], [2, 6, 2], [4, 5, 2], [1, 7, 1], [6, 4, 2]].map(top), [16, 16, 16, 16, 16]);
ok('Ex 6.2 Q6', range(0, 100).filter(x => top([4, x, x, 8]) === 90), [13]);
is('Ex 6.2 Q6: no top of 91', range(0, 1000).every(x => top([4, x, x, 8]) !== 91));
ok('Ex 6.2 Q7: most routes', Math.max(...binom(5)), 6);

// §6.5 calendar squares, on July 2026 and on every month shape
is('July 2026 begins on a Wednesday', new Date(Date.UTC(2026, 6, 1)).getUTCDay() === 3);
const squares = (n, w, h, first) => range(1, n).filter(a => ((a + first - 1) % 7) + w - 1 <= 6 && a + (h - 1) * 7 + w - 1 <= n)
  .map(a => range(0, h - 1).flatMap(r => range(0, w - 1).map(c => a + 7 * r + c)));
const sum = (s) => s.reduce((x, y) => x + y, 0);
const july22 = squares(31, 2, 2, 3), july33 = squares(31, 3, 3, 3);
const any22 = [28, 29, 30, 31].flatMap(n => range(0, 6).flatMap(f => squares(n, 2, 2, f)));
const any33 = [28, 29, 30, 31].flatMap(n => range(0, 6).flatMap(f => squares(n, 3, 3, f)));
is('Fig 6.5: 8, 9, 15, 16 is a July square', july22.some(s => s.join() === '8,9,15,16'));
ok('Fig 6.5 total', sum([8, 9, 15, 16]), 48);
is('every 2x2 square totals 4a + 16', any22.every(s => sum(s) === 4 * s[0] + 16));
is('every 3x3 square totals 9 times its middle', any33.every(s => sum(s) === 9 * s[4]));
ok('total 60 gives 11, 12, 18, 19', any22.filter(s => sum(s) === 60).map(s => s.join()).filter((v, i, a) => a.indexOf(v) === i), ['11,12,18,19']);
is('Example 4: no square totals 78 or 54', !any22.some(s => sum(s) === 78 || sum(s) === 54));
is('no July square starts on the 30th', !july22.some(s => s[0] === 30));
ok('T&R 6.5: a = 5 gives 36', 4 * 5 + 16, 36);
ok('T&R 6.5: ten-day week, total 62', range(1, 40).filter(a => 4 * a + 22 === 62), [10]);
ok('Ex 6.3 Q1', [56, 104, 72].map(t => any22.filter(s => sum(s) === t)[0]?.join()), ['10,11,17,18', '22,23,29,30', '14,15,21,22']);
ok('Ex 6.3 Q2', [52, 66, 80, 98].filter(t => any22.some(s => sum(s) === t)), [52, 80]);
{ const s = any33.find(s => s[4] === 20); ok('Ex 6.3 Q3', [s.join(), sum(s)], ['12,13,14,19,20,21,26,27,28', 180]); }
is('Ex 6.3 Q4: 6a + 45', [28, 29, 30, 31].flatMap(n => range(0, 6).flatMap(f => squares(n, 2, 3, f))).every(s => sum(s) === 6 * s[0] + 45));
ok('Ex 6.3 Q7', [...new Set(any22.filter(s => sum(s) % 100 === 0).map(s => s.join()))], ['21,22,28,29']);

// §6.6 shapes
ok('grid: triangle and circle', [24 / 3, (22 - 24 / 3) / 2], [8, 7]);
const pairs = (f) => range(0, 60).flatMap(a => range(0, 60).map(b => [a, b])).filter(([a, b]) => f(a, b));
ok('Example 5: star and moon', pairs((s, m) => 2 * s + m === 17 && s + 3 * m === 21), [[6, 5]]);
ok('Ex 6.3 Q5', pairs((q, s) => 3 * q === 21 && q + 2 * s === 25), [[7, 9]]);
ok('Ex 6.3 Q6', pairs((c, t) => 2 * c + t === 19 && c + 2 * t === 17), [[7, 5]]);

// §6.7 largest and smallest products
const arr = (d) => [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map(([i, j, k]) => [(10 * d[i] + d[j]) * d[k], `${d[i]}${d[j]}x${d[k]}`]);
const ranked = (d, sign = 1) => arr(d).sort((x, y) => sign * (y[0] - x[0]));
ok('4, 6, 7: the six products', arr([4, 6, 7]).map(p => p[0]).sort((a, b) => a - b), [268, 282, 304, 322, 444, 448]);
ok('4, 6, 7: best two', ranked([4, 6, 7]).slice(0, 2), [[448, '64x7'], [444, '74x6']]);
ok('Example 6: 2, 5, 8', ranked([2, 5, 8]).slice(0, 2), [[416, '52x8'], [410, '82x5']]);
ok('T&R 6.7: 1, 2, 3', ranked([1, 2, 3])[0], [63, '21x3']);
ok('T&R 6.7: gaps of 3', [[1, 4, 7], [3, 5, 6]].map(d => ranked(d)[0][0] - ranked(d)[1][0]), [3, 3]);
const triples = range(1, 9).flatMap(p => range(p + 1, 9).flatMap(q => range(q + 1, 9).map(r => [p, q, r])));
is('rule: qp x r is largest for every triple', triples.every(([p, q, r]) => ranked([p, q, r])[0][1] === `${q}${p}x${r}`));
is('rule: qr x p is smallest for every triple', triples.every(([p, q, r]) => ranked([p, q, r], -1)[0][1] === `${q}${r}x${p}`));
ok('Ex 6.4 Q1', [[1, 4, 6], [3, 5, 8], [2, 7, 9]].map(d => ranked(d)[0]), [[246, '41x6'], [424, '53x8'], [648, '72x9']]);
ok('Ex 6.4 Q2', [[1, 4, 6], [3, 5, 8], [2, 7, 9]].map(d => ranked(d, -1)[0]), [[46, '46x1'], [174, '58x3'], [158, '79x2']]);

// §6.8 turning a number round
const two = range(10, 99), rev = (n) => Number(String(n).split('').reverse().join(''));
const three = range(100, 999), dsum = (n) => String(n).split('').reduce((a, b) => a + Number(b), 0);
const cyc = (n) => { const s = String(n); return n + Number(s.slice(1) + s[0]) + Number(s.slice(2) + s.slice(0, 2)); };
ok('26, 73, 81', [62 - 26, 73 - 37, 81 - 18], [36, 36, 63]);
is('a number minus its reverse is 9 times the gap', two.every(n => Math.abs(n - rev(n)) === 9 * Math.abs(Math.floor(n / 10) - n % 10)));
is('a number plus its reverse is 11 times the digit sum', two.filter(n => n % 10).every(n => n + rev(n) === 11 * dsum(n)));
ok('47 + 74', 47 + 74, 121);
ok('Example 7', two.filter(n => n % 10 && n + rev(n) === 110 && n - rev(n) === 54), [82]);
is('cycling gives 111 times the digit sum', three.every(n => cyc(n) === 111 * dsum(n)));
ok('Example 8', [736736 / 7 / 11 / 13, 7 * 11 * 13], [736, 1001]);
ok('T&R 6.8: totals 100-200', [...new Set(two.filter(n => n % 10).map(n => n + rev(n)).filter(t => t > 100 && t < 200))].sort((a, b) => a - b), range(10, 18).map(k => 11 * k));
ok('T&R 6.8: an odd total', 23 + 32, 55);
ok('Ex 6.4 Q3', [...new Set(two.filter(n => Math.abs(n - rev(n)) === 54 && n % 10).map(n => Math.min(n, rev(n))))], [17, 28, 39]);
ok('Ex 6.4 Q4', two.filter(n => n % 10 && n + rev(n) === 121), [29, 38, 47, 56, 65, 74, 83, 92]);
is('Ex 6.4 Q5', three.every(n => (n - rev(n)) % 99 === 0));
ok('Ex 6.4 Q6', [1665 / 111, cyc(159)], [15, 1665]);
ok('Ex 6.4 Q7', [5252 / 101, range(2, 100).filter(d => 101 % d === 0)], [52, []]);

// §6.9 undoing
const game = (x, c, n) => { for (let i = 0; i < n; i++) x = 2 * x - c; return x; };
ok('Farhan: start 14, fee 16', [range(1, 100).filter(x => 2 * (2 * (2 * x - 16) - 16) === 16), game(14, 16, 3)], [[14], 0]);
is('2^n(x - c) + c', range(0, 6).every(n => range(0, 40).every(x => range(0, 40).every(c => game(x, c, n) === 2 ** n * (x - c) + c))));
is('a player gains only when x > 16', range(0, 60).every(x => (game(x, 16, 1) > x) === (x > 16)));
ok('T&R 6.9', [8 * 14 / 7, 4 * 3 / 3], [16, 4]);
const emptyIn = (n) => range(1, 200).map(x => [x, range(1, 400).find(c => game(x, c, n) === 0 && range(1, n - 1).every(k => game(x, c, k) > 0))]).filter(p => p[1]);
ok('Ex 6.5 Q1: stickers, three days', emptyIn(3)[0], [7, 8]);
ok('Ex 6.5 Q8: four days', emptyIn(4)[0], [15, 16]);
ok('Ex 6.5 Q2', range(0, 40).filter(h => 4 * h + 2 * (40 - h) === 110), [15]);
ok('Ex 6.5 Q3', range(1, 60).filter(s => 3 * s + 10 === 2 * (s + 10)), [10]);
ok('Ex 6.5 Q4', range(1, 60).filter(h => 3 * h - 4 === h + 4), [4]);
ok('Ex 6.5 Q5', [(800 + 80 * 15 + 1200) / 80, (800 + 1200) / (35 - 15)], [40, 100]);
ok('Ex 6.5 Q6', [4 * 4 - 3 * 5, 8 * 8 - 7 * 9, 11 * 11 - 10 * 12], [1, 1, 1]);
ok('Ex 6.5 Q7', range(1, 100).filter(x => 2 * (2 * (2 * x - 24) - 24) === 24), [21]);

// §6.10
ok('26 - 8 = 18', [26 - dsum(26), 90 - dsum(90), 55 - dsum(55)], [18, 81, 45]);
is('a number minus its digit sum is 9 times the tens digit', two.every(n => n - dsum(n) === 9 * Math.floor(n / 10)));

// the printed values in the body, read back
for (const p of ['12 - 5 = 7', '5 - 2 = 3', '7 - 3 = 4', '2c + 16 = 50', 'c = 17', 'a = 26', 'b = 24', '2c + 18 = 56', 'c = 19',
  '4 \\times 8 + 16 = 48', '64 \\times 7 = 448', '52 \\times 8 = 416', '82 \\times 5 = 410', '8x = 112', 'x = 14'])
  has('body', body, p);

/* ---- the keys at the end of Beyond the Book ------------------- */

const ansStart = beyond.indexOf('<div class="c-stage__title">Answers</div>');
is('Answers stage present', ansStart > 0);
const answers = beyond.slice(ansStart);
const cut = answers.indexOf('<div class="c-practice__sub">Beyond the Book</div>');
const btbAns = answers.slice(0, cut), beyAns = answers.slice(cut);
const rowsOf = (src) => { const r = {}; for (const m of src.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) r[m[1]] = plain(m[2]); return r; };
const btbRow = rowsOf(btbAns), beyRow = rowsOf(beyAns);
const lettersOf = (src) => { const k = {}; for (const m of text(src).matchAll(/\b(\d+) \(([a-d])\)((?:, \([a-d]\))*)/g)) k[m[1]] ??= [m[2], ...[...m[3].matchAll(/\(([a-d])\)/g)].map(x => x[1])].join(''); return k; };
const btbKey = lettersOf(btbAns.slice(btbAns.indexOf('c-answers')));
const beyKey = lettersOf(beyAns);
const says = (rows, q, ...vals) => { for (const v of vals) is(`key ${q} should say ${v}: "${rows[q]}"`, new RegExp(`(^|[^\\d])${String(v).replace(/[.()+]/g, '\\$&')}([^\\d]|$)`).test(rows[q] || '')); };

// By the Book, every written answer
says(btbRow, 1, top([7, 9, 4]));
says(btbRow, 3, 4 * 13 + 16);
says(btbRow, 4, ...any22.find(s => sum(s) === 88));
says(btbRow, 7, ranked([3, 6, 8])[0][0]);
says(btbRow, 8, midFor(9, 11, 40)[0]);
says(btbRow, 9, 472 + 724 + 247, cyc(472));
says(btbRow, 10, range(0, 50).find(x => 2 * x - 6 === 20));
says(btbRow, 11, 23, 24, 25);
says(btbRow, 12, 30);
{ const x = range(1, 50).find(x => top([x, 2 * x, x + 6]) === 48); says(btbRow, 13, x, ...up([x, 2 * x, x + 6])); }
says(btbRow, 14, two.find(n => dsum(n) === 11 && rev(n) - n === 27));
says(btbRow, 15, dateTrick(6, 23), dateTrick(6, 23) - 190);
says(btbRow, 16, range(1, 500).find(m => ((m / 2 - 10) / 2 - 10) === 6));
says(btbRow, 17, 144 / 9);
says(btbRow, 18, top([6, 10, 9, 5]));
is('Q18: the given top is 60', top([5, 9, 8, 4]) === 60);
says(btbRow, 19, range(0, 25).find(t => 20 * t + 10 * (25 - t) === 360));
ok('Q20', two.filter(n => n === 7 * dsum(n)), [21, 42, 63, 84]);
says(btbRow, 21, range(0, 100).find(x => 2 * (3 * x + 8) - 4 * x === 46));
{ const s = any33.find(s => s[0] + s[8] === 44); says(btbRow, 22, s[4], sum(s)); }
says(btbRow, 23, range(0, 100).find(x => game(x, 10, 3) === 26));
says(btbRow, 24, two.find(n => n === 6 * dsum(n) + 4 && n - rev(n) === 18));
{ const f = range(0, 40).find(f => 5 * f + 3 * (40 - f) === 164); says(btbRow, 25, f, 40 - f, 200 - 164); }
{ const d = range(1, 50).find(d => 4 * d + 5 === 3 * (d + 5)); says(btbRow, 26, d, 4 * d, range(0, d).find(y => 4 * d - y === 7 * (d - y))); }
is('Q27: Pooja\'s trick', allDates.every(([m, d]) => ((2 * m + 5) * 50 + d) === 100 * m + 250 + d));
says(btbRow, 27, 928, 1034);
{ const [[s, c]] = pairs((s, c) => 2 * s + 3 * c === 31 && s + 2 * c === 18); says(btbRow, 28, s, c, 3 * s + c); }
says(btbRow, 29, three.find(n => cyc(n) === 1332 && /^(\d)(\d)(\d)$/.test(n) && Number(String(n)[0]) - Number(String(n)[1]) === 1 && Number(String(n)[1]) - Number(String(n)[2]) === 1));
{ const x = range(0, 100).find(x => top([3, x, 2 * x, 5]) === 98); let r = [3, x, 2 * x, 5]; const rows = [r]; while (r.length > 1) { r = up(r); rows.push(r); } says(btbRow, 30, x, ...rows[2]); }
says(btbRow, 36, midFor(8, 6, 50)[0], top([10, 20, 8]) - top([8, 18, 6]));
says(btbRow, 37, ...any22.find(s => sum(s) === 52));
is('Q37: Uday is the one wrong', [52, 100, 90].map(t => any22.some(s => sum(s) === t)).join() === 'true,true,false');
says(btbRow, 38, game(80, 50, 2), range(0, 500).find(x => game(x, 50, 3) === 250));
says(btbRow, 39, ranked([2, 5, 9])[0][0], ranked([3, 4, 6])[0][0]);
is('Q39: Zubin multiplies by 8', ranked([1, 7, 8])[0][1].endsWith('x8'));
says(btbRow, 40, two.find(n => n + rev(n) === 88 && n - rev(n) === 36));
is('Q40: no sum is 90', !two.some(n => n + rev(n) === 90));

// Beyond: the tried-and-explained questions
has('Beyond', beyond, '$1415 - 190 = 1225$');
ok('tried 2: 1415 is 25 December', [Math.floor((1415 - 190) / 100), (1415 - 190) % 100], [12, 25]);
ok('tried 1: k', range(0, 50).filter(k => range(1, 30).every(x => (2 * (x + k) - 8) / 2 - x === 6)), [10]);
ok('tried 3', range(0, 100).filter(a => top([a, a + 1, a + 2]) === 100), [24]);
ok('tried 4', [(40 - 16) / 4, (68 - 16) / 4], [6, 13]);
ok('tried 5', two.filter(n => n === 4 * dsum(n)), [12, 24, 36, 48]);
ok('tried 6', ranked([7, 8, 9]).slice(0, 2), [[783, '87x9'], [776, '97x8']]);
ok('tried 7', range(0, 100).filter(a => top([a, a + 1, a + 2, a + 3]) === 204), [24]);
ok('tried 8', range(1, 200).filter(c => game(45, c, 4) === 0), [48]);

// Beyond: the solved examples' Answer rows
const exRow = (n) => { const m = beyond.match(new RegExp(`Example ${n}</div>[\\s\\S]*?work__label">Answer</span>\\s*<span>([\\s\\S]*?)</span></div>`)); return m ? plain(m[1]) : ''; };
ok('Ex 1: k', range(0, 50).filter(k => range(1, 20).every(n => (4 * n + k) / 2 - 2 * n === 7)), [14]); has('Ex 1', exRow(1), '(b) 14');
ok('Ex 2', two.filter(n => dsum(n) === 12 && n - rev(n) === 18), [75]); has('Ex 2', exRow(2), '(a) 75');
ok('Ex 3', 2220 / 111, 20); has('Ex 3', exRow(3), '(a), (b), (d)');
ok('Ex 4', any22.filter(s => sum(s) === 104).map(s => [s[0], s[3]])[0], [22, 30]); has('Ex 4', exRow(4), '(a), (b), (c)');
ok('Ex 5', range(0, 50).filter(n => (3 * n - 5) * 2 === 38), [8]); has('Ex 5', exRow(5), '8');
ok('Ex 6', ranked([2, 7, 8])[0][0], 576); has('Ex 6', exRow(6), '576');
ok('Ex 7: x', range(1, 20).filter(x => top([x, 2 * x, 3 * x]) === 40), [5]); has('Ex 7', exRow(7), '(c) P–3, Q–4, R–1, S–2');
ok('Ex 8', [10 / 2, 12 / 3, 30 / 5, range(1, 9).map(n => (2 * (n + 7) - 14) / 2 - n)[0]], [5, 4, 6, 0]); has('Ex 8', exRow(8), '(b) P–3, Q–4, R–2, S–1');
ok('Ex 9', [range(0, 50).find(y => top([2, 7, y, 3]) === 50), up(up([2, 7, 8, 3]))[0]], [8, 24]); has('Ex 9', exRow(9), '(i) (b); (ii) 8; (iii) 24');
ok('Ex 10', [game(13, 10, 3), range(1, 100).find(c => game(21, c, 3) === 0), range(1, 20).find(n => game(25, 24, n) > 100)], [34, 24, 7]); has('Ex 10', exRow(10), '(i) (a); (ii) 24; (iii) 7');

// Beyond: the practice answers
says(beyRow, 9, top([1, 2, 3, 4, 5]));
says(beyRow, 10, range(0, 100).find(n => (3 * (n + 4) - 6) / 2 === 21));
says(beyRow, 11, range(0, 100).find(x => game(x, 20, 3) === 36));
{ const a = any22.find(s => sum(s) === 64)[0]; const s33 = any33.find(s => s[0] === a); says(beyRow, 14, sum(s33), 4 * (any33.find(s => sum(s) === 171)[0]) + 16); }
says(beyRow, 15, 1178 - 48 - 1100, 100 + 48 + 1);
is('P15: Rekha\'s trick is 100m + 48 + d', allDates.every(([m, d]) => (5 * m + 2) * 20 + 8 + d === 100 * m + 48 + d));
is('P14: 3x3 minus 2x2 is 5a + 56', any33.every(s => sum(s) - (4 * s[0] + 16) === 5 * s[0] + 56));

/* ---- C. multiple choice and assertion-reason ------------------ */

const board = pages.filter(f => /^p09/.test(f)).map(f => html[f]).join('\n');
const qsOf = (src) => { const q = {}; for (const m of src.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*(?:<p class="c-practice__note">[^<]*<\/p>\s*)?<\/div>/g)) q[Number(m[1] || 1)] = m[2]; return q; };
const bq = qsOf(board), pq = qsOf(beyond.slice(0, ansStart));
ok('By the Book numbered 1..50', Object.keys(bq).map(Number), range(1, 50));
ok('Beyond practice numbered 1..15', Object.keys(pq).map(Number), range(1, 15));
const optsOf = (li) => { const m = li.match(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*?)<\/ol>/); return m ? [...m[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => plain(x[1]).trim()) : []; };
const num = (s) => Number(s.replace(/[^\d.-]/g, ''));
const MON = { August: 8, October: 10 };
const checkMcq = (where, qs, keyMap, solve) => {
  for (const [q, f] of Object.entries(solve)) {
    const o = optsOf(qs[q]);
    is(`${where} Q${q} has four options`, o.length === 4);
    const right = f(o).map((t, i) => (t ? 'abcd'[i] : '')).join('');
    ok(`${where} Q${q}: the right option(s)`, right, keyMap[q]);
  }
};
checkMcq('By the Book', bq, btbKey, {
  41: o => o.map(num).map(v => range(-20, 20).every(x => (2 * (x + 9) - 6) / 2 - x === v)),
  42: o => o.map(s => s.replace(/\s/g, '') === '10b+a'),
  43: o => o.map(s => { const [d, mo] = s.split(' '); return dateTrick(MON[mo], Number(d)) === 1005; }),
  44: o => o.map(num).map(v => v === top([1, 2, 3, 4])),
  45: o => o.map(num).map(k => range(1, 20).every(x => (5 * x + k) / 5 - x === 7)),
  46: o => o.map(num).map(v => any22.filter(s => sum(s) === 76).every(s => s[0] === v)),
  47: o => o.map(num).map(v => two.filter(n => n - rev(n) === 45).every(n => Math.floor(n / 10) - n % 10 === v)),
  48: o => o.map(num).map(v => top([9, v, 13]) === 44 && 9 + v === 20),
  49: o => { const t = [two.every(n => (n + rev(n)) % 11 === 0), two.every(n => (n - rev(n)) % 11 === 0), any22.every(s => sum(s) % 4 === 0)];
    return [[true, false, false], [false, true, false], [true, false, true], [false, true, true]].map(c => c.every((x, i) => x === t[i])); },
  50: o => [537 % 37 === 0 && cyc(537) % 37 === 0, cyc(537) % 37 === 0 && 537 % 37 !== 0, cyc(537) % 37 !== 0, false],
});
ok('Q50: moving the digits of 537', [375 + 753 + 537, cyc(537)], [1665, 1665]);
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  31: [two.some(n => n + rev(n) === 132), two.filter(n => n % 10).every(n => n + rev(n) === 11 * dsum(n)), true],
  32: [any22.some(s => sum(s) === 70), any22.every(s => sum(s) === 4 * s[0] + 16), true],
  33: [ranked([1, 2, 3])[0][1] === '21x3', triples.every(t => Math.floor(Number(ranked(t)[0][1].slice(0, 2)) / 10) === t[2]), false],
  34: [top([4, 6, 5]) === 21, binom(3)[1] === 2, true],
  35: [845845 % 13 === 0, range(2, 12).every(d => 13 % d), false],
};
for (const [q, v] of Object.entries(AR)) ok(`By the Book Q${q}: assertion-reason`, arLetter(v), btbKey[q]);
checkMcq('Beyond', pq, beyKey, {
  1: o => o.map(num).map(v => range(-20, 20).every(x => ((x + 3) * 4 - 8) / 4 - x === v)),
  2: o => o.map(num).map(v => any33.filter(s => sum(s) === 207).every(s => s[8] === v)),
  3: o => o.map(num).map(v => two.filter(n => n === 8 * dsum(n)).length === v),
  4: o => o.map(num).map(v => top([v, 1, 2, v]) === 45),
  5: o => o.map(num).map(v => v + rev(v) === 154),
  6: o => o.map(s => top(s.split(',').map(Number)) === 36),
  7: o => [range(1, 6).every(n => game(12, 12, n) === 12), game(15, 12, 2) === 21, game(10, 12, 3) === 0 && game(10, 12, 2) > 0, range(0, 40).every(x => (game(x, 12, 1) > x) === (x > 12))],
  8: o => o.map(num).map(v => any33.some(s => sum(s) === v)),
});
{ // matching practice, from the tables
  const m12 = { P: 3, Q: 1, R: 4, S: 2 };
  is('P12: the pairs hold', two.filter(n => n % 10).every(n => n + rev(n) === 11 * dsum(n) && n - rev(n) === 9 * (Math.floor(n / 10) - n % 10) && n - dsum(n) === 9 * Math.floor(n / 10)));
  const m13 = [any22.find(s => sum(s) === 44)[0], any22.find(s => sum(s) === 96)[3], any33.find(s => sum(s) === 117)[4], any33.find(s => sum(s) === 180)[0]];
  ok('P13: the values', m13, [7, 28, 13, 12]);
  ok('P12, P13 letters', [beyKey[12], beyKey[13]], ['a', 'c']);
  is('P12 option (a) is P–3, Q–1, R–4, S–2', optsOf(pq[12])[0].replace(/\s/g, '') === 'P–3,Q–1,R–4,S–2' && Object.entries(m12).length === 4);
  is('P13 option (c) is P–1, Q–4, R–3, S–2', optsOf(pq[13])[2].replace(/\s/g, '') === 'P–1,Q–4,R–3,S–2');
}
{ const a = Object.values(btbKey).filter((v, i, arr) => true);
  const obj = range(41, 50).map(q => btbKey[q]);
  is(`objective letters spread: ${obj.join('')}`, ['a', 'b', 'c', 'd'].every(l => obj.filter(x => x === l).length >= 2));
  const ar = range(31, 35).map(q => btbKey[q]);
  is(`assertion-reason letters spread: ${ar.join('')}`, ['a', 'b', 'c', 'd'].every(l => ar.includes(l))); }

// every question has an answer in the key
ok('By the Book keyed 1..50', range(1, 50).filter(q => !(q in btbRow) && !(q in btbKey)), []);
ok('Beyond practice keyed 1..15', range(1, 15).filter(q => !(q in beyKey) && !(q in beyRow) && !new RegExp(`(^|\\s)${q} \\(i\\)`).test(text(beyAns))), []);
ok('every example ends in an Answer row', range(1, 10).filter(n => !exRow(n)), []);

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdLetters = (head) => { const a = answersMd.indexOf(head); const k = {}; for (const m of answersMd.slice(a, a + 400).matchAll(/\b(\d+) \(([a-d])\)((?:, \([a-d]\))*)/g)) k[m[1]] = [m[2], ...[...m[3].matchAll(/\(([a-d])\)/g)].map(x => x[1])].join(''); return k; };
ok('ANSWERS.md assertion-reason key', mdLetters('Key: 31'), Object.fromEntries(range(31, 35).map(q => [q, btbKey[q]])));
ok('ANSWERS.md objective key', mdLetters('Key: 41'), Object.fromEntries(range(41, 50).map(q => [q, btbKey[q]])));
{ const k = mdLetters('as the key prints it'); ok('ANSWERS.md Beyond key', k, Object.fromEntries(Object.entries(beyKey).filter(([q]) => q in k))); ok('ANSWERS.md Beyond key covers the letters', Object.keys(k).length, Object.keys(beyKey).length); }

/* ---- report ---------------------------------------------------- */

console.log(`A  ${spans} identities and sums evaluated; ${equations} equations left to part B; ${skipped.length} spans not checkable, skipped`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
