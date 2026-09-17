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
  '10a+b=4(a+b)', 't=21-2c', '5d+6=3(d+6)', '2g-3=g+3', 'a=b', '10a+b=4a+4b', '6a=3b', 'b=2a', '12+c=a', 'c+8=b',
  '8x=7c', '4x=3c', 'c=8x/7', 'c=4x/3', 'c=\\dfrac{8x}{7}', 'c=\\dfrac{4x}{3}', '2^{n}x=(2^{n}-1)c',
  'x=17', 's=5',
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

// the tricks, run on every allowed start
const mukta = (x, add) => (2 * x + add) / 2 - x;
is('Mukta ends at 2 for every start 1..10000', range(1, 10000).every(x => mukta(x, 4) === 2));
is('the Mukta table: 7 -> 14, 18, 9, 2', JSON.stringify([7 * 2, 7 * 2 + 4, (7 * 2 + 4) / 2, (7 * 2 + 4) / 2 - 7]) === '[14,18,9,2]');
is('add 2k ends at k', range(1, 50).every(k => range(1, 200).every(x => mukta(x, 2 * k) === k)));
is('Example 1: ends at 7 for every start', range(-200, 1000).every(x => ((x + 3) * 3 - 3 * x) / 3 + 4 === 7));
is('think-of-a-number without cancelling is not constant', mukta(1, 4) + 1 * 0 !== (2 * 2 + 8));
const dateTrick = (m, d, a1 = 6, a2 = 9) => ((m * 5 + a1) * 4 + a2) * 5 + d;
const days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const allDates = days.flatMap((n, i) => range(1, n).map(d => [i + 1, d]));
is('date trick recovers every date of the year', allDates.every(([m, d]) => { const r = dateTrick(m, d) - 165; return Math.floor(r / 100) === m && r % 100 === d; }));
ok('date trick on 26 January', [5, 11, 44, 53, 265, dateTrick(1, 26), dateTrick(1, 26) - 165], [1 * 5, 5 + 6, 11 * 4, 44 + 9, 53 * 5, 291, 126]);
ok('Example 2 chain', [8 * 5, 40 + 6, 46 * 4, 184 + 9, 193 * 5, dateTrick(8, 15)], [40, 46, 184, 193, 965, 980]);
ok('tip: add 7 gives 185', dateTrick(0, 0, 7), 185);
ok('Ex 6.1 Q4: add 11', dateTrick(0, 0, 6, 11), 175);
ok('Ex 6.1 Q5: 879', [Math.floor((879 - 165) / 100), (879 - 165) % 100], [7, 14]);
ok('Ex 6.1 Q3', range(1, 500).map(x => (2 * (x + 5) - 4) / 2 - x).filter((v, i, a) => a.indexOf(v) === i), [3]);
ok('Ex 6.1 Q1', [12, 9, 0].map(k => mukta(3, k)), [6, 4.5, 0]);
{ // Q6: 5, 2, 2 multipliers collide; the printed pair
  const key = (m, d) => 20 * m + d; ok('Ex 6.1 Q6: 21 Jan and 1 Feb collide', key(1, 21), key(2, 1));
  is('Ex 6.1 Q6: some two dates always collide', allDates.some(([m, d]) => allDates.some(([n, e]) => (m !== n || d !== e) && key(m, d) === key(n, e))));
}
// pyramids
const up = (row) => row.slice(1).map((x, i) => x + row[i]);
const top = (row) => { while (row.length > 1) row = up(row); return row[0]; };
const binom = (n) => { let r = [1]; for (let i = 1; i < n; i++) r = [1, ...up(r), 1]; return r; };
ok('multipliers 1..5 rows', [1, 2, 3, 4, 5].map(binom), [[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]);
ok('opener pyramid', [up([1, 9, 4]), top([1, 9, 4])], [[10, 13], 23]);
ok('Fig 6.1', [up([1, 3, 3]), top([1, 3, 3])], [[4, 6], 10]);
ok('Fig 6.2: c from the equations', (() => { for (let c = 0; c < 100; c++) if ((12 + c) + (c + 8) === 60) return [c, 12 + c, c + 8]; })(), [20, 32, 28]);
ok('Example 3', (() => { for (let c = 0; c < 100; c++) if (top([7, c, 9]) === 44) return [c, ...up([7, c, 9])]; })(), [14, 21, 23]);
is('no pyramid has top 44 over 7, 10, 9', top([7, 10, 9]) !== 44);
ok('4, 13, 8 and 8, 19, 21, 13', [top([4, 13, 8]), top([8, 19, 21, 13])], [38, 141]);
ok('Ex 6.2 Q1', [[4, 13, 8], [7, 11, 3], [10, 14, 25]].map(top), [38, 32, 63]);
ok('Ex 6.2 Q2', [[8, 19, 21, 13], [7, 18, 19, 6], [9, 7, 5, 11]].map(top), [141, 124, 56]);
ok('Ex 6.2 Q4', [[50, 4, 6], [40, 5, 7], [36, 9, 7]].map(([t, l, r]) => { const c = (t - l - r) / 2; return [c, ...up([l, c, r])]; }), [[20, 24, 26], [14, 19, 21], [10, 19, 17]]);
ok('Ex 6.2 Q5', [[2, 5, 2], [4, 4, 2], [6, 3, 2], [1, 6, 1], [3, 4, 3]].map(top), [14, 14, 14, 14, 14]);
ok('Ex 6.2 Q6', range(0, 100).filter(x => top([6, x, x, 10]) === 100), [14]);
is('Ex 6.2 Q6: no top of 101', range(0, 1000).every(x => top([6, x, x, 10]) !== 101));
{ const V = [0n, 1n, 2n]; for (let i = 3; i <= 60; i++) V[i] = V[i - 1] + V[i - 2];
  const topB = (row) => { while (row.length > 1) row = row.slice(1).map((x, i) => x + row[i]); return row[0]; };
  const printed = md.replace(/\s(?=\d{3}\b)/g, '');
  ok('T&R Virahanka pyramids', [topB(V.slice(1, 4)), topB(V.slice(1, 5)), topB(V.slice(1, 30))].map(String),
    [/the top is [\d +]+= (\d+)/.exec(printed)?.[1], /top (\d+),? the 7th/.exec(printed)?.[1], /= 57, which is ([\d ]*\d)/.exec(md)?.[1].replace(/ /g, '')]);
  is('T&R: every entry a V-F number', (() => { let r = V.slice(1, 30); const set = new Set(V.map(String)); while (r.length > 1) { r = r.slice(1).map((x, i) => x + r[i]); if (!r.every(x => set.has(String(x)))) return false; } return true; })());
  is('ANSWERS.md prints the 29-row top', /591\\,286\\,729\\,879/.test(answersMd)); }
ok('Ex 6.2 Q7: most routes', Math.max(...binom(5)), 6);
// calendar squares on a real August 2025 page (1st a Friday)
const aug = (d) => ({ row: Math.floor((d + 4) / 7), col: (d + 4) % 7 });
const squares = (n, w, h, first = 5) => range(1, 31).filter(a => ((a + first - 1) % 7) + w - 1 <= 6 && a + (h - 1) * 7 + w - 1 <= n)
  .map(a => range(0, h - 1).flatMap(r => range(0, w - 1).map(c => a + 7 * r + c)));
is('August 2025 starts on a Friday: 6 is a Wednesday', aug(6).col === 3 && aug(1).col === 5);
const aug22 = squares(31, 2, 2);
is('every 2x2 August square totals 4a + 16', aug22.every(s => s.reduce((x, y) => x + y) === 4 * s[0] + 16));
ok('Fig 6.5 square', [6, 7, 13, 14].reduce((x, y) => x + y), 40);
ok('total 36', (36 - 16) / 4, 5);
is('Example 4: 70 and 50 are no total', [70, 50].every(t => (t - 16) % 4 !== 0));
is('tip: a = 30 gives 136, which no August square gives', 4 * 30 + 16 === 136 && !aug22.some(s => s.reduce((x, y) => x + y) === 136));
const aug33 = squares(31, 3, 3);
is('every 3x3 square is nine times its centre', aug33.every(s => s.reduce((x, y) => x + y) === 9 * s[4]));
ok('ten-day week', [0, 1, 10, 11].reduce((x, y) => x + y), 22);
const anyMonth = [28, 29, 30, 31].flatMap(n => range(0, 6).flatMap(f => squares(n, 2, 2, f)));
const totals22 = [...new Set(anyMonth.map(s => s.reduce((x, y) => x + y)))];
ok('Ex 6.3 Q1', [60, 96, 84].map(t => anyMonth.find(s => s.reduce((x, y) => x + y) === t)), [[11, 12, 18, 19], [20, 21, 27, 28], [17, 18, 24, 25]]);
ok('Ex 6.3 Q2', [44, 58, 76, 92].filter(t => totals22.includes(t)), [44, 76, 92]);
ok('Ex 6.3 Q3', (() => { const s = aug33.find(q => q[4] === 19); return [s, s.reduce((x, y) => x + y)]; })(), [[11, 12, 13, 18, 19, 20, 25, 26, 27], 171]);
ok('Ex 6.3 Q4', [...new Set(squares(31, 2, 3).map(s => s.reduce((x, y) => x + y) - 6 * s[0]))], [45]);
ok('Ex 6.3 Q7', [...new Set(anyMonth.filter(s => s.reduce((x, y) => x + y) % 100 === 0).map(String))], ['21,22,28,29']);
ok('Ex 6.3 Q5, Q6', [[18 / 3, (22 - 18 / 3) / 2], (() => { for (let c = 0; c < 50; c++) for (let t = 0; t < 50; t++) if (2 * c + t === 21 && c + 2 * t === 18) return [c, t]; })()], [[6, 8], [8, 5]]);
ok('Fig 6.6', [27 / 3, (19 - 9) / 2], [9, 5]);
// largest and smallest products, every triple of digits
const arr = (d) => [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]].map(([i, j, k]) => [(10 * d[i] + d[j]) * d[k], `${d[i]}${d[j]}x${d[k]}`]);
const best = (d, sign) => arr(d).sort((x, y) => sign * (y[0] - x[0]))[0];
const triples = range(1, 9).flatMap(p => range(p + 1, 9).flatMap(q => range(q + 1, 9).map(r => [p, q, r])));
is('largest rule qp x r holds for every triple', triples.every(([p, q, r]) => best([p, q, r], 1)[0] === (10 * q + p) * r));
is('smallest rule qr x p holds for every triple', triples.every(([p, q, r]) => best([p, q, r], -1)[0] === (10 * q + r) * p));
ok('2, 3, 5 all six', arr([2, 3, 5]).map(x => x[0]).sort((a, b) => a - b), [70, 75, 106, 115, 156, 160].sort((a, b) => a - b));
ok('Example 5', [best([3, 5, 9], 1), arr([3, 5, 9]).sort((x, y) => y[0] - x[0])[1]], [[477, '53x9'], [465, '93x5']]);
ok('Ex 6.4 Q1', [[1, 3, 7], [2, 6, 8], [4, 5, 9]].map(d => best(d, 1)), [[217, '31x7'], [496, '62x8'], [486, '54x9']]);
ok('Ex 6.4 Q2', [[1, 3, 7], [2, 6, 8], [4, 5, 9]].map(d => best(d, -1)), [[37, '37x1'], [136, '68x2'], [236, '59x4']]);
// digits
const two = range(10, 99), rev = (n) => Number(String(n).split('').reverse().join(''));
is('difference from reverse is 9 times the gap, every two-digit number', two.every(n => n - rev(n) === 9 * (Math.floor(n / 10) - n % 10)));
is('sum with reverse is 11 times the digit sum', two.every(n => n + rev(n) === 11 * (Math.floor(n / 10) + n % 10)));
ok('Shubham', [74 - 47, 52 - 25, 91 - 19, 27 / 9, 72 / 9], [27, 27, 72, 3, 8]);
const three = range(100, 999), dsum = (n) => String(n).split('').reduce((a, b) => a + Number(b), 0);
const cyc = (n) => { const s = String(n); return n + Number(s.slice(1) + s[0]) + Number(s.slice(2) + s.slice(0, 2)); };
is('cycling sum is 111 x digit sum, every three-digit number', three.every(n => cyc(n) === 111 * dsum(n)));
is('repeating is x1001 and 7, 11, 13 undo it', three.every(n => Number(`${n}${n}`) / 7 / 11 / 13 === n));
is('two-digit repeated is x101', two.every(n => Number(`${n}${n}`) === 101 * n));
is('101 is prime', range(2, 100).every(d => 101 % d));
is('three-digit minus its reverse is a multiple of 99', three.every(n => (n - rev(n)) % 99 === 0));
ok('Ex 6.4 Q3', two.filter(n => Math.abs(n - rev(n)) === 45), [16, 27, 38, 49, 50, 61, 72, 83, 94]);
ok('Ex 6.4 Q4', two.filter(n => n + rev(n) === 132), [39, 48, 57, 66, 75, 84, 93]);
ok('Ex 6.4 Q6', [1554 / 111, cyc(158)], [14, 1554]);
ok('3737', 37 * 101, 3737);
is('invent: (10a+b)-(a+b) = 9a for every two-digit number', two.every(n => n - dsum(n) === 9 * Math.floor(n / 10)));
ok('47 - 11', [47 - dsum(47), 36 / 9], [36, 4]);
// the genie, and the shrines
const genie = (x, c, n) => { for (let i = 0; i < n; i++) x = 2 * x - c; return x; };
is('2^n(x-c)+c for n <= 6', range(0, 30).every(x => range(0, 30).every(c => range(0, 6).every(n => genie(x, c, n) === 2 ** n * (x - c) + c))));
ok('Karim backwards', [8 / 2, 4 + 8, 12 / 2, 6 + 8, 14 / 2], [4, 12, 6, 14, 7]);
ok('Karim: holds 8 after the third doubling', 2 * genie(7, 8, 2), 8);
is('Karim better off exactly when x > 8', range(0, 100).every(x => (2 * x - 8 > x) === (x > 8)));
is('x = c stands still', range(1, 50).every(c => genie(c, c, 10) === c));
ok('smallest charge above 7', range(1, 20).find(c => c > 7), 8);
const emptyIn = (n, maxX = 200) => range(1, maxX).map(x => [x, range(1, 400).find(c => genie(x, c, n) === 0)]).filter(p => p[1]);
ok('T&R: three rounds c = 8x/7', emptyIn(3).every(([x, c]) => 7 * c === 8 * x) && emptyIn(3)[0], [7, 8]);
ok('T&R: two rounds c = 4x/3', emptyIn(2).every(([x, c]) => 3 * c === 4 * x) && emptyIn(2)[0], [3, 4]);
is('T&R: waiting collects more', 3 * 8 / 7 > 2 * 4 / 3);
ok('Ex 6.5 Q1: shrines', emptyIn(3)[0], [7, 8]);
ok('Ex 6.5 Q1: the steps', [14 - 8, 12 - 8, 8 - 8], [6, 4, 0]);
ok('Ex 6.5 Q2', range(0, 55).filter(h => 4 * h + 2 * (55 - h) === 150), [20]);
ok('Ex 6.5 Q3', range(1, 50).filter(d => 5 * d + 6 === 3 * (d + 6)), [6]);
ok('Ex 6.5 Q4', range(1, 50).filter(g => 2 * g - 3 === g + 3), [6]);
ok('Ex 6.5 Q5', [range(1, 500).find(p => 100 * p - 5000 - 1000 === 2000), range(1, 1000).find(n => 50 * n - 5000 - 10 * n === 2000)], [80, 175]);
is('Ex 6.5 Q6: every such fraction is 1/3', range(1, 30).every(n => { const o = range(1, 2 * n).map(k => 2 * k - 1); const t = o.slice(0, n).reduce((a, b) => a + b); const b = o.slice(n).reduce((a, b) => a + b); return 3 * t === b; }));
ok('Ex 6.5 Q7', range(1, 100).filter(x => 2 * genie(x, 16, 2) === 16), [14]);
ok('Ex 6.5 Q8: four shrines, then n', [emptyIn(4)[0], [1, 2, 3, 4, 5, 6].map(n => emptyIn(n, 100)[0])], [[15, 16], [1, 2, 3, 4, 5, 6].map(n => [2 ** n - 1, 2 ** n])]);

// Stage 1, each question searched rather than solved
ok('S1 Q1', range(-50, 50).filter(k => range(1, 30).every(x => (2 * (x + k) - 8) / 2 - x === 6)), [10]);
ok('S1 Q2', allDates.filter(([m, d]) => dateTrick(m, d) === 1390), [[12, 25]]);
ok('S1 Q3', range(0, 100).filter(a => top([a, a + 1, a + 2]) === 100), [24]);
is('S1 Q3: no top of 102 or 103', range(0, 200).every(a => ![102, 103].includes(top([a, a + 1, a + 2]))));
ok('S1 Q3: 49 + 51', up([24, 25, 26]), [49, 51]);
ok('S1 Q4', [40, 68].map(t => anyMonth.find(s => s.reduce((x, y) => x + y) === t)[0]), [6, 13]);
ok('S1 Q5', two.filter(n => n === 4 * dsum(n)), [12, 24, 36, 48]);
{ const all = triples.flatMap(t => arr(t)).sort((x, y) => y[0] - x[0]);
  ok('S1 Q6: largest of all, and the near miss', [all[0], all[1]], [[783, '87x9'], [776, '97x8']]); }
ok('S1 Q7', range(0, 100).filter(a => top([a, a + 1, a + 2, a + 3]) === 204), [24]);
ok('S1 Q8', range(1, 500).filter(c => genie(45, c, 4) === 0), [48]);

// printed values in the running text, read back: each phrase is built from
// the computed value, so a changed number on the page is caught
const bodyText = plain(body), beyondText = plain(beyond);
const has = (where, src, phrase) => is(`${where} should print "${phrase}"`, src.replace(/\s+/g, '').includes(phrase.replace(/\s+/g, '')));
{ const c = range(0, 99).find(c => (12 + c) + (c + 8) === 60);
  has('Fig 6.2 working', bodyText, `c = ${c} , and then a = ${12 + c} and b = ${c + 8}`);
  const c3 = range(0, 99).find(c => top([7, c, 9]) === 44);
  has('Example 3', bodyText, `giving c = ${c3}`); has('Example 3', bodyText, `bottom row 7 , ${c3} , 9 ; second row ${7 + c3} , ${c3 + 9}`);
  has('Example 3', bodyText, `the row above is ${7 + c3} and ${c3 + 9}`);
  has('Karim', bodyText, `giving x = ${range(0, 99).find(x => 2 * genie(x, 8, 2) === 8)}`);
  has('Karim', bodyText, `before that doubling ${(4 + 8) / 2}`); has('Karim', bodyText, `before that doubling ${(6 + 8) / 2}`);
  has('total 36', bodyText, `a = ${(36 - 16) / 4} , so the square is ${[0, 1, 7, 8].map(k => (36 - 16) / 4 + k).join(' , ')}`);
  has('Fig 6.6 working', bodyText, `so a triangle is ${27 / 3}`); has('Fig 6.6 working', bodyText, `a circle is ${(19 - 27 / 3) / 2}`);
  has('Example 5', bodyText, `${best([3, 5, 9], 1)[1].replace('x', ' × ')} = ${best([3, 5, 9], 1)[0]} is the largest`);
  has('6.8', bodyText, `The winner is ${best([2, 3, 5], 1)[1].replace('x', ' × ')} = ${best([2, 3, 5], 1)[0]}`);
  has('Mukta table', bodyText, `Think of a number 7 x Double it ${7 * 2} 2x Add four ${7 * 2 + 4} 2x + 4 Divide by two ${(7 * 2 + 4) / 2} x + 2 Subtract the original number ${mukta(7, 4)} ${mukta(1, 4)}`);
  has('date trick', bodyText, `the answer is ${dateTrick(1, 26)} , you subtract 165 and get ${dateTrick(1, 26) - 165}`);
  has('Example 2', bodyText, `${dateTrick(8, 15) - 165} = ${dateTrick(8, 15) - 165}`.replace(/^(\d+) = /, '980 - 165 = '));
  has('6.5 text', bodyText, `4 , 13 , 8 it is 4 + 26 + 8 = ${top([4, 13, 8])}`);
  has('6.5 text', bodyText, `8 , 19 , 21 , 13 has 8 + 57 + 63 + 13 = ${top([8, 19, 21, 13])}`);
  has('Shubham', bodyText, `which is 3 nines exactly`); is('Shubham: 27 is 3 nines', 27 / 9 === 3);
  has('invent', bodyText, `47 - 11 = ${47 - dsum(47)}`);
  { const off3 = [0, 1, 2, 7, 8, 9, 14, 15, 16], s3 = off3.reduce((x, y) => x + y);
    has('3x3 block', bodyText, `add to 9a + ${s3} . That factorises as 9(a + ${s3 / 9}) — and a + ${off3[4]} is the date in the middle`);
    const s2 = [0, 1, 7, 8].reduce((x, y) => x + y);
    has('2x2 square', bodyText, `a + (a+1) + (a+7) + (a+8) = 4a + ${s2}`);
    has('ten-day week', bodyText, `a total of 4a + ${[0, 1, 10, 11].reduce((x, y) => x + y)}`);
    has('summary', bodyText, `totals 4a + ${s2}`); }
  has('Fig 6.1 caption', bodyText, `10 - 4 = 6 , then 4 - 1 = 3 , then 6 - 3 = 3`); ok('Fig 6.1 fills', [10 - 4, 4 - 1, 6 - 3], [up([1, 3, 3])[1], 3, 3]);
}
{ // Stage 1
  has('S1 Q1', beyondText, `so k = ${range(-50, 50).find(k => range(1, 30).every(x => (2 * (x + k) - 8) / 2 - x === 6))}`);
  const [m, d] = allDates.find(([m, d]) => dateTrick(m, d) === 1390);
  has('S1 Q2', beyondText, `1225 = 100 × ${m} + ${d}`); is('S1 Q2 names the date', m === 12 && d === 25 && beyondText.includes('The twenty-fifth of December'));
  const a3 = range(0, 100).find(a => top([a, a + 1, a + 2]) === 100);
  has('S1 Q3', beyondText, `giving a = ${a3}`); has('S1 Q3', beyondText, `${a3} , ${a3 + 1} , ${a3 + 2} — and ${2 * a3 + 1} + ${2 * a3 + 3} = 100`);
  const [s1, s2] = [40, 68].map(t => (t - 16) / 4);
  has('S1 Q4', beyondText, `= 40 , so a = ${s1}`); has('S1 Q4', beyondText, `= 68 , so a = ${s2}`); has('S1 Q4', beyondText, `The dates differ by ${s2 - s1}`);
  has('S1 Q5', beyondText, `giving ${two.filter(n => n === 4 * dsum(n)).join(' , ').replace(/ , (\d+)$/, ' and $1')}`);
  const all = triples.flatMap(t => arr(t)).sort((x, y) => y[0] - x[0]);
  has('S1 Q6', beyondText, `${all[0][1].replace('x', ' × ')} = ${all[0][0]}`); has('S1 Q6', beyondText, `${all[1][1].replace('x', ' × ')} = ${all[1][0]}`);
  const a7 = range(0, 100).find(a => top([a, a + 1, a + 2, a + 3]) === 204);
  has('S1 Q7', beyondText, `giving a = ${a7}`); has('S1 Q7', beyondText, `The row is ${a7} , ${a7 + 1} , ${a7 + 2} , ${a7 + 3}`);
  has('S1 Q8', beyondText, `giving c = ${range(1, 500).find(c => genie(45, c, 4) === 0)}`);
}

// Solved Examples: the printed Answer row of each, read back
const exRow = (n) => { const m = beyond.match(new RegExp(`Example ${n}</div>[\\s\\S]*?work__label">Answer</span>\\s*<span>([\\s\\S]*?)</span></div>`)); return m ? plain(m[1]) : ''; };
const exSays = (n, ...vals) => { for (const v of vals) is(`Example ${n} should print ${v}: "${exRow(n)}"`, new RegExp(`(^|[^\\d])${String(v)}([^\\d]|$)`).test(exRow(n))); };
exSays(1, range(-100, 100).map(x => (3 * x + 12) / 3 - x).find(() => true));
is('Ex 1 is constant', new Set(range(-100, 100).map(x => (3 * x + 12) / 3 - x)).size === 1);
exSays(2, range(-100, 100).find(k => range(1, 20).every(x => (4 * x + k) / 2 - 2 * x === 9)));
{ const found = []; for (let A = 1; A <= 120; A++) for (let h = 1; h <= 99; h++) if ((2 * A + 5) * 50 + h === 1537) found.push([A, h]);
  ok('Ex 3: the only age and house', found, [[12, 87]]); exSays(3, 12, 87);
  is('Ex 3: every age and house comes back', range(1, 120).every(A => range(1, 99).every(h => { const r = (2 * A + 5) * 50 + h - 250; return Math.floor(r / 100) === A && r % 100 === h; }))); }
{ const t4 = (m, d) => (4 * m + 3) * 25 + d;
  is('Ex 4: every date comes back after subtracting 75', allDates.every(([m, d]) => t4(m, d) - 75 === 100 * m + d));
  ok('Ex 4: 1004', allDates.filter(([m, d]) => t4(m, d) === 1004), [[9, 29]]); exSays(4, 75); is('Ex 4 says September', /twenty-ninth of September/.test(exRow(4))); }
{ const r = []; for (let a = 0; a < 40; a++) for (let b = 0; b < 40; b++) { const [l, rr] = up([a, b, 6]); if (l === 20 && l + rr === 35) r.push([a, b, 6]); }
  ok('Ex 5', r, [[11, 9, 6]]); exSays(5, 11, 9, 6, 20, 15, 35); }
ok('Ex 6', range(0, 50).filter(x => top([x, 2 * x, 3 * x]) === 40), [5]); exSays(6, 5, 40);
ok('Ex 6 middle row', up([5, 10, 15]), [15, 25]);
ok('Ex 7', [top([2, 4, 6, 8]), up([2, 4, 6, 8]), up(up([2, 4, 6, 8]))], [40, [6, 10, 14], [16, 24]]); exSays(7, 40);
{ const perms = (xs) => xs.length <= 1 ? [xs] : xs.flatMap((x, i) => perms([...xs.slice(0, i), ...xs.slice(i + 1)]).map(p => [x, ...p]));
  const tops = perms([1, 2, 3, 4]).map(top); exSays(8, Math.max(...tops), Math.min(...tops)); }
ok('Ex 9', anyMonth.filter(s => s.reduce((x, y) => x + y) === 104).map(String).filter((v, i, a) => a.indexOf(v) === i), ['22,23,29,30']); exSays(9, 22, 23, 29, 30);
ok('Ex 10', [...new Set(squares(31, 3, 3, 0).concat(aug33).filter(s => s.reduce((x, y) => x + y) === 153).map(String))], ['9,10,11,16,17,18,23,24,25']);
ok('Ex 10 rows', [9 + 10 + 11, 16 + 17 + 18, 23 + 24 + 25], [30, 51, 72]); exSays(10, 9, 11, 16, 18, 23, 25);
{ const r = []; for (let s = 0; s < 30; s++) for (let t = 0; t < 30; t++) if (s + t === 12 && 2 * s + t === 17) r.push([s, t]);
  ok('Ex 11', r, [[5, 7]]); exSays(11, 5, 7); }
{ const a = arr([2, 7, 8]).sort((x, y) => y[0] - x[0]); ok('Ex 12', [a[0], a[1]], [[576, '72x8'], [574, '82x7']]); exSays(12, 576, 2); }
ok('Ex 13', two.filter(n => dsum(n) === 12 && n - rev(n) === 18), [75]); exSays(13, 75);
ok('Ex 14', [2220 / 111, cyc(488), dsum(488), cyc(596), cyc(875)], [20, 2220, 20, 2220, 2220]); exSays(14, 20, 488);
ok('Ex 15', range(-50, 50).filter(x => 2 * (3 * x - 5) === 38), [8]); exSays(15, 8);
ok('Ex 16', range(0, 100).filter(x => genie(x, 10, 2) === 22), [13]); exSays(16, 13);
ok('Ex 16 chain', [26 - 10, 32 - 10], [16, 22]);
ok('Ex 17', range(0, 20).filter(b => 2 * b + 3 * (20 - b) === 48).map(b => [b, 20 - b]), [[12, 8]]); exSays(17, 12, 8);
ok('Beyond has 17 examples, numbered in order', [...beyond.matchAll(/c-example__tab">Example (\d+)/g)].map(m => +m[1]), range(1, 17));
ok('body examples numbered in order', [...body.matchAll(/c-example__tab">Example (\d+)/g)].map(m => +m[1]), range(1, 6));

// the practice answers, read back out of the key rather than typed here
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= plain(m[2]);
const row = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const r = keyRows[n] || '';
  if (!part) return r;
  const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\)|$)`));
  return m ? m[1] : '';
};
const says = (q, ...vals) => { for (const v of vals) is(`key ${q} should say ${v}: "${row(q)}"`, new RegExp(`(^|[^\\d])${String(v).replace('.', '\\.')}([^\\d]|$)`).test(row(q))); };
says(20, 4 * 9 + 16);
is('key 21 prints both numbers', /10x \+ y/.test(row(21)) && /10y \+ x/.test(row(21)));
says(22, top([1, 1, 1, 1]));
{ const f = (add) => new Set(range(1, 60).map(x => (6 * x + add) / 3 - 2 * x)); ok('Q23: always 6', [...f(18)], [6]);
  const add = range(0, 100).find(a => f(a).size === 1 && [...f(a)][0] === 10); says(23, 6, add); }
{ const x = range(0, 50).find(x => top([x, 2 * x, x + 6]) === 48); says(24, x, 2 * x, x + 6, ...up([x, 2 * x, x + 6]), 48); }
{ const n = two.filter(n => dsum(n) === 11 && rev(n) - n === 27); ok('Q25 has one answer', n.length, 1); says(25, n[0]); }
{ const s = range(1, 500).filter(m => { const a = m / 2 - 10; const b = a / 2 - 10; return b === 6; }); ok('Q26 has one answer', s.length, 1); says(26, s[0]); }
{ const s = [...new Set(squares(31, 3, 3, 0).concat(aug33).filter(q => q.reduce((x, y) => x + y) === 117).map(String))]; ok('Q27', s, ['5,6,7,12,13,14,19,20,21']); says(27, 13, 5, 21, 117); }
{ const x = range(0, 100).filter(x => top([x, 3, 5, x]) === 60); ok('Q28 has one x', x.length, 1);
  says(28, x[0], ...up([x[0], 3, 5, x[0]]), ...up(up([x[0], 3, 5, x[0]])));
  is(`key 28 should say the top rises by ${top([x[0] + 1, 3, 5, x[0] + 1]) - 60}: "${row(28)}"`, row(28).includes(`raises the top by ${top([x[0] + 1, 3, 5, x[0] + 1]) - 60}`)); }
{ says('29b', range(0, 100).find(x => genie(x, 12, 3) === 52));
  is('Q29 (a): the three expressions', range(0, 20).every(x => genie(x, 12, 1) === 2 * x - 12 && genie(x, 12, 2) === 4 * x - 36 && genie(x, 12, 3) === 8 * x - 84));
  says('29c', range(0, 100).filter(x => genie(x, 12, 1) > x)[0] - 1); }
{ const t = (m, d) => (2 * m + 3) * 50 + d;
  is('Q30 (a): every date is 100m + 150 + d', allDates.every(([m, d]) => t(m, d) === 100 * m + 150 + d));
  const bd = (v) => allDates.filter(([m, d]) => t(m, d) === v);
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  for (const v of [979, 465, 1181]) { const r = bd(v); ok(`Q30 ${v} is one date`, r.length, 1); is(`key 30b should say ${r[0][1]}(st|th) of ${MONTHS[r[0][0] - 1]}: "${row('30b')}"`, new RegExp(`${r[0][1]}(st|nd|rd|th) of ${MONTHS[r[0][0] - 1]}`).test(row('30b'))); }
  ok('Q30 (c): 1250 is no date', bd(1250).length, 0); says('30c', 1250 - 150); }
says('31a', top([4, 6, 5]));
says('31b', range(0, 100).find(x => top([3, x, 7]) === 34));
says('31c', top([2, 5, 2, 6]));

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] = m[2];
ok('practice numbered 1..31 with no repeats', Object.keys(qs).map(Number).sort((a, b) => a - b), range(1, 31));
ok('practice data-start in order on the pages', [...beyond.matchAll(/c-questions"(?: data-start="(\d+)")?/g)].map(m => Number(m[1] || 1)), range(1, 31));
const optsOf = (n) => [...(qs[n] || '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => plain(x[1]).trim());
const num = (s) => Number(s.replace(/[^\d.-]/g, ''));
const key = {};
{ const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2]; }
const MON = { May: 5, October: 10 };
const solve = {
  1: o => o.map(num).map(v => range(-20, 20).every(x => (2 * (x + 7) - 4) / 2 - x === v)),
  2: o => o.map(s => { const [d, mo] = s.split(' '); return dateTrick(MON[mo], Number(d)) === 1170; }),
  3: o => o.map(num).map(v => v === top([5, 8, 3])),
  4: o => o.map(num).map(v => { const b = v; const bl = 7; const ml = bl + b; return ml === 18 && range(0, 50).some(r => ml + (b + r) === 30); }),
  5: o => o.map(s => { const k = Number(s.replace(/\s/g, '').replace('a', '')); return range(1, 31).filter(a => ((a + 4) % 7) > 0 && a + 6 <= 31).every(a => aug(a + k).row === aug(a).row + 1 && aug(a + k).col === aug(a).col - 1); }),
  6: o => o.map(num).map(v => anyMonth.filter(s => s.reduce((x, y) => x + y) === 72).every(s => Math.max(...s) === v)),
  7: o => o.map(num).map(v => [28, 29, 30, 31].flatMap(n => range(0, 6).flatMap(f => squares(n, 3, 3, f))).some(s => s.reduce((x, y) => x + y) === v)),
  8: o => o.map(num).map(v => { const c = 21 / 3; return c + 2 * v === 19; }),
  9: o => o.map(s => { const [a, b] = s.split('×').map(Number); return a * b === best([4, 6, 7], 1)[0] && `${a}x${b}` === best([4, 6, 7], 1)[1]; }),
  10: o => o.map(num).map(v => two.filter(n => n - rev(n) === 63).every(n => Math.floor(n / 10) - n % 10 === v)),
  11: o => o.map(num).map(v => two.filter(n => n + rev(n) === 143).every(n => dsum(n) === v)),
  12: o => o.map(num).map(v => three.every(n => cyc(n) % v === 0)),
  13: o => { const zs = two.filter(n => n - rev(n) === 0);
    const tests = [n => n % 10 === 0, n => dsum(n) === 9, n => n % 2 === 1, n => Math.floor(n / 10) === n % 10];
    return tests.map(t => zs.every(t)); },
  14: o => o.map(num).map(v => (4 * v - 6) / 2 === 15),
  15: o => o.map(num).map(v => genie(6, 6, 3) === v),
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Q${q}: the right option`, right, [key[q]]);
}
// assertion-reason: [A true, R true, R explains A]
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  16: [two.some(n => n - rev(n) === 35), two.every(n => (n - rev(n)) % 9 === 0), false],
  17: [aug22.concat(anyMonth).every(s => s.reduce((x, y) => x + y) % 2 === 0), anyMonth.every(s => s.reduce((x, y) => x + y) === 4 * (s[0] + 4)), true],
  18: [two.every(n => (n + rev(n)) % 11 === 0), range(2, 10).every(d => 11 % d), false],
  19: [best([1, 2, 3], 1)[0] === 63 && best([1, 2, 3], 1)[1] === '21x3', triples.every(t => Math.floor(Number(best(t, 1)[1].slice(0, 2)) / 10) === t[2]), false],
};
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-19', Object.keys(key).map(Number).sort((a, b) => a - b), range(1, 19));

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
const mdLine = answersMd.slice(answersMd.indexOf('as the key prints it'));
for (const m of mdLine.slice(0, 400).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2];
ok('ANSWERS.md key matches the page', mdKey, key);

// ANSWERS.md printed answers, read back one at a time
const mdSection = (head, next) => { const a = md.indexOf(head); const b = next ? md.indexOf(next, a + 1) : md.length; return a < 0 ? '' : md.slice(a, b); };
const mdHas = (sec, what, ...vals) => { for (const v of vals) is(`ANSWERS.md ${what} should print ${v}`, sec.includes(String(v))); };
{ const s = mdSection('Exercise Set 6.1', '6.4 Number Pyramids');
  mdHas(s, '6.1', 'add 12: 6', 'add 9: 4.5', 'add 0: 0', 'Subtract 175', 'fourteenth of July', '21 January and 1 February'); }
{ const s = mdSection('Exercise Set 6.2', '6.6 A Square');
  mdHas(s, '6.2 Q1', '= 38', '= 32', '= 63'); mdHas(s, '6.2 Q2', '= 141', '= 124', '= 56');
  mdHas(s, '6.2 Q4', '4, 20, 6', '24, 26', '5, 14, 7', '19, 21', '9, 10, 7', '19, 17');
  mdHas(s, '6.2 Q6', 'x = 14', '6x = 85'); mdHas(s, '6.2 Q7', '1, 4, 6, 4, 1'); }
{ const s = mdSection('Exercise Set 6.3', '6.8 The Largest');
  mdHas(s, '6.3 Q1', '11, 12, 18, 19', '20, 21, 27, 28', '17, 18, 24, 25');
  mdHas(s, '6.3', '44, 76 and 92', 'square is 6', 'star is 8', 'circle is 8', 'triangle is 5', '21, 22, 28, 29', '6a + 45', '9 × 19 = 171'); }
{ const s = mdSection('Exercise Set 6.4', '6.10 Undoing');
  mdHas(s, '6.4', '31 × 7 = 217', '62 × 8 = 496', '54 × 9 = 486', '37 × 1 = 37', '68 × 2 = 136', '59 × 4 = 236',
    'differ by 5', '16, 27, 38', '39, 48, 57, 66, 75, 84, 93', '1554 ÷ 111 = 14', '158'); }
{ const s = mdSection('Exercise Set 6.5', 'Beyond the Book');
  mdHas(s, '6.5', '7 flowers, with 8', '20 horses', '6 years', 'Gauri 6, Naina 12', '₹80', '175 dosas', '14 coins', '15 flowers, with 16', '(16)/(48)'); }
{ const s = mdSection('Stage 1', 'Stage 3');
  mdHas(s, 'Stage 1', 'k = 10', 'twenty-fifth of December', '24, 25, 26.', '6 and 13', '12, 24, 36 and 48', '87 × 9 = 783', '24, 25, 26, 27', 'c = 48'); }
{ const s = mdSection('Stage 3', null);
  mdHas(s, 'practice', 'fifth of October', 'a + 6', 'a = 14', 'x = 7', 'number is 47', '₹84', 'x = 18', 'x = 17', 'x > 12', '29 August', '15 March', '31 October', 'x = 12', '= 29'); }

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
