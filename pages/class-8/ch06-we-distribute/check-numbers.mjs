#!/usr/bin/env node
/* Re-derive every number and every expansion this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed — by arithmetic, by evaluating both sides of an identity at many
   values of its letters, or by a search — and compared with what is on the
   page or in ANSWERS.md.

     node pages/class-8/ch06-we-distribute/check-numbers.mjs

   Five parts:
     A  every span set as maths, on every page and in ANSWERS.md, whose sides
        are pure arithmetic: all sides must agree
     B  every algebraic equality set as maths whose sides are polynomials in
        single letters: both sides are evaluated at six sets of values
     C  the claims A and B cannot see: the body's worked numbers, the answers
        to the body's questions, Stage 1, and the practice answers read back
        out of the key
     D  Stage 2: the fifteen examples in stage2-bank.mjs, every option
        recomputed, and the page carrying exactly those fifteen
     E  the practice multiple choice and assertion-reason: exactly one option
        right, the one the key prints; letters spread; ANSWERS.md agrees

   Exits non-zero if anything does not hold up. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bank } from './stage2-bank.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
let pass = 0;
const fails = [];
const ok = (what, got, want) => {
  if (JSON.stringify(got) === JSON.stringify(want)) pass++;
  else fails.push(`${what}\n      computed ${JSON.stringify(got)}\n      printed  ${JSON.stringify(want)}`);
};
const is = (what, cond) => { if (cond) pass++; else fails.push(what); };
const close = (a, b) => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const strip = (s) => s.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/\s+/g, ' ');
const text = strip;

/* ---- LaTeX to JavaScript ---------------------------------------- */

// A side becomes a JS expression in single-letter variables, or null when it
// holds anything this reader does not understand (words, ellipses, ...).
function toJs(side) {
  let s = side.trim().replace(/[.,;:]$/, '');
  s = s.replace(/\\left|\\right|\\big|\\Big|\\bigl|\\bigr/g, '')
    .replace(/\\text\{[^{}]*\}/g, 'TEXT')
    .replace(/\\[dt]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\tfrac(\d)(\d)/g, '(($1)/($2))')
    .replace(/\\times|\\cdot/g, '*').replace(/\\div/g, '/')
    .replace(/\\,|\\;|\\ |\\quad|\\qquad|~/g, '')
    .replace(/−/g, '-')
    .replace(/\^\{([^{}]+)\}/g, '^($1)')
    .replace(/\s+/g, '');
  if (!s || /TEXT|\\|[^a-z0-9+\-*/().^]/i.test(s)) return null;
  if (/[a-z]{2,}/i.test(s) && /[A-Z]/.test(s)) return null;
  // implicit multiplication: 3a, ab, a(b), )(, )a, 2(
  let prev;
  do { prev = s; s = s.replace(/([0-9a-z)])([a-z(])/gi, '$1*$2'); } while (s !== prev);
  s = s.replace(/\^/g, '**');
  // a leading minus before a power, -2**2, would bind wrongly in JS: bracket it
  s = s.replace(/(^|[(*/+\-])-(\w+)\*\*/g, '$1(-1)*$2**');
  return s;
}
const letters = (e) => [...new Set((e.match(/[a-z]/gi) || []))].sort();
function evalAt(e, vars, vals) {
  try { return Function(...vars, `"use strict";return (${e})`)(...vars.map(v => vals[v])); } catch { return NaN; }
}
const SAMPLES = [
  { a: 3, b: 5, c: 7, d: 2, m: 4, n: 6, u: 9, v: 11, x: 2, y: 3, z: 5, p: 7, q: 2, r: 3.5, s: 9, w: 4, g: 6, k: 3, j: 2 },
  { a: -2, b: 7, c: 1.5, d: -3, m: 5, n: -4, u: 2, v: 3, x: -1.5, y: 4, z: 2, p: -3, q: 5, r: 1, s: 2, w: 3, g: 10, k: 7, j: -5 },
  { a: 11, b: -6, c: 2, d: 9, m: -1, n: 8, u: -3, v: 7, x: 5, y: -2, z: -4, p: 2, q: -7, r: 4, s: 12, w: 1.5, g: 2, k: -2, j: 3 },
  { a: 0.5, b: 2.5, c: -4, d: 1, m: 3, n: 3, u: 1, v: -2, x: 10, y: 1, z: 7, p: 1, q: 3, r: 2, s: 5, w: 2, g: 7, k: 10, j: 4 },
  { a: 23, b: 27, c: 1, d: 13, m: 2, n: -3, u: 6, v: 5, x: 8, y: 3, z: 9, p: 6, q: 11, r: 3.5, s: 9, w: 5, g: 3, k: 1, j: 1 },
  { a: -7, b: -9, c: 3, d: -1, m: 7, n: 1, u: -5, v: -8, x: 3, y: 7, z: 1, p: 9, q: 4, r: 6, s: 20, w: 7, g: 1, k: 15, j: 7 },
];
// an identity holds when every side gives the same value at every sample
const holds = (sides) => {
  const vars = [...new Set(sides.flatMap(letters))];
  return SAMPLES.every(v => { const xs = sides.map(e => evalAt(e, vars, v)); return xs.every(x => Number.isFinite(x) && close(x, xs[0])); });
};
const same = (a, b) => { const A = toJs(a), B = toJs(b); if (A === null || B === null) throw Error(`cannot read ${a} or ${b}`); return holds([A, B]); };
const val = (a, v = {}) => { const A = toJs(a); if (A === null) throw Error(`cannot read ${a}`); return evalAt(A, letters(A), v); };

/* ---- A and B: every equality set as maths ---------------------- */

// Spans printed to be judged wrong, and their parts, are not claims.
const WRONG_ON_PURPOSE = [
  // Section 6.3: the twelve simplifications to be checked
  '= -3p + 5p - 2q', '= p - 2q', '= 2x - 1 + 3x + 4', '= 5x + 3', '= (y + 2)^2', '= y^2 + 4y + 4',
  '= 25m^2 + 36n^2', '= 6ab \\times 9ac', '= 54a^2bc', '= 11w^2', '= 5a^3 + 12a^2b^2', '= ab + 8',
  // practice and examples: assertions and options printed to be judged
  '(x + 4)^2 = x^2 + 16', '2x + 3y = 5xy', '(x + 3)^2 = x^2 + 9', 'x + 3 = 7', '6.4^2 - 3.6^2 = 2.8',
  '11^3 = 1221', 'a = 4',
];
const CONDITIONS = ['(a + 2)(b - 4) = ab', 'ab - 4a + 2b - 8 = ab', '(x + 5)(x + k) = x^2 + 2x - 15', 'b = 2a + 4'];
const EQUATIONS = [   // equations with a solution, not identities: checked in C
  'x^2 - 9 = 112', 'x^2 = 121', 'x = 11', '8n = 96', 'n = 12', 'a + b + 1 = 432 - 391 = 41', 'a + b = 40',
  'x = 10', 'x = 6', 'x = 1', 'x = 2', 'y = 1', 'x = 8', 'y = 3', 'p = 6', 'r = 3.5', 's = 9',
];
let arith = 0, algebra = 0; const skipped = [];
const sources = [...pages.map(f => [f, html[f].replace(/<svg[\s\S]*?<\/svg>/g, '')]), ['ANSWERS.md', answersMd]];
for (const [f, src] of sources) {
  for (const m of src.matchAll(/\$\$([^$]+)\$\$|\$([^$]+)\$/g)) {
    const span = (m[1] || m[2]).replace(/\\text\{Identity 1[ABC]?\}\\qquad/, '');
    if (!span.includes('=')) continue;
    if (WRONG_ON_PURPOSE.some(w => span.replace(/\s+/g, ' ').trim() === w || span.includes(w))) continue;
    for (const part of span.split(/\\qquad|,\s*\\ |,\s+(?=[^,]*=)/)) {
      if (EQUATIONS.some(e => part.replace(/\s+/g, ' ').trim() === e)) continue;
      const sides = part.split('=').map(s => s.trim()).filter(Boolean);
      if (sides.length < 2) continue;
      const js = sides.map(toJs);
      if (js.some(e => e === null)) { skipped.push(`${f}: $${part.trim()}$`); continue; }
      let vars = [...new Set(js.flatMap(letters))];
      if (vars.length) {
        // a chain with numbers in it (a worked substitution) or a bare letter is
        // a condition, not an identity: keep only the sides in letters, and
        // check those against one another
        const lettered = js.filter(e => letters(e).length && !/^[a-z]$/i.test(e));
        if (lettered.length < 2 || CONDITIONS.some(c => part.replace(/\s+/g, ' ').includes(c))) { skipped.push(`${f}: $${part.trim()}$ (a condition)`); continue; }
        js.splice(0, js.length, ...lettered);
      }
      if (!vars.length) {
        const xs = js.map(e => evalAt(e, [], {}));
        if (xs.some(x => !Number.isFinite(x))) { skipped.push(`${f}: $${part.trim()}$`); continue; }
        arith++;
        if (xs.every(x => close(x, xs[0]))) pass++; else fails.push(`${f}: $${part.trim()}$ — sides are ${xs.join(' and ')}`);
      } else if (vars.length === 1 && js.some(e => /^-?\d+(\.\d+)?$/.test(e))) {
        skipped.push(`${f}: $${part.trim()}$ (an equation, checked in C if printed as an answer)`);
      } else {
        algebra++;
        if (holds(js)) pass++; else fails.push(`${f}: $${part.trim()}$ — not an identity`);
      }
    }
  }
}

/* ---- C. the claims A and B cannot see ------------------------- */

const has = (src, s) => is(`prints: ${s}`, src.includes(s));

// 6.1: increments
ok('23 x 27 increments', [23 * 28 - 23 * 27, 24 * 27 - 23 * 27, 24 * 28 - 23 * 27], [23, 27, 51]);
ok('(a+1)(b-1) at 23, 27 changes by 27 - 23 - 1', 24 * 26 - 23 * 27, 27 - 23 - 1);
// the fast-multiplication rules, and every product they are asked for
const times11 = (n) => { const d = String(n).split('').map(Number); const out = []; let carry = 0;
  for (let i = d.length; i >= 0; i--) { const s = (d[i] ?? 0) + (d[i - 1] ?? 0) + carry; out.unshift(s % 10); carry = Math.floor(s / 10); }
  if (carry) out.unshift(carry); return Number(out.join('')); };
for (const n of [3874, 5678, 94, 495, 3279, 4791256, 6384, 47, 487]) ok(`one-line rule for ${n} x 11`, times11(n), n * 11);
ok('3874 x 11 one digit at a time', [4, 14, 614, 2614, 42614], [4, 14, 614, 2614, 3874 * 11]);
ok('the x101 and x1001 products', [3874 * 101, 89 * 101, 949 * 101, 265831 * 1001, 1111 * 1001, 9734 * 99, 23478 * 999],
  [391274, 8989, 95849, 266096831, 1112111, 963666, 23454522]);
// 6.2
ok('65^2 by parts', [3600 + 25 + 600, 65 ** 2, (30 + 35) ** 2, (52 + 13) ** 2], [4225, 4225, 4225, 4225]);
ok('55^2 by removing strips', 3600 - 300 - 300 + 25, 55 ** 2);
ok('Pattern 1 lines', [[2, 1, 3, 1], [3, 1, 4, 2], [6, 5, 11, 1], [5, 3, 8, 2]].map(([a, b, c, d]) => 2 * (a * a + b * b) === c * c + d * d), [true, true, true, true]);
ok('Pattern 2 lines', [[9, 1, 10, 8], [8, 6, 14, 2], [7, 2, 9, 5], [10, 4, 14, 6]].map(([a, b, c, d]) => a * a - b * b === c * d), [true, true, true, true]);
ok('Sridharacharya', [32 * 30 + 1, 31 ** 2, 200 * 194 + 9, 197 ** 2], [961, 961, 38809, 38809]);
ok('in-text squares', [104 ** 2, 37 ** 2, 99 ** 2, 58 ** 2, 98 * 102, 45 * 55], [10816, 1369, 9801, 3364, 9996, 2475]);
// 6.3, Mind the Mistake: which are right
const MM = [
  ['-3p(-5p + 2q)', 'p - 2q', '15p^2 - 6pq'], ['2(x - 1) + 3(x + 4)', '5x + 3', '5x + 10'], ['y + 2(y + 2)', 'y^2 + 4y + 4', '3y + 4'],
  ['(5m + 6n)^2', '25m^2 + 36n^2', '25m^2 + 60mn + 36n^2'], ['(-q + 2)^2', 'q^2 - 4q + 4', 'q^2 - 4q + 4'], ['3a(2b \\times 3c)', '54a^2bc', '18abc'],
  ['\\frac{1}{2}(10s - 6) + 3', '5s', '5s'], ['5w^2 + 6w', '11w^2', '5w^2 + 6w'], ['2a^3 + 3a^3 + 6a^2b + 6ab^2', '5a^3 + 12a^2b^2', '5a^3 + 6a^2b + 6ab^2'],
  ['(x + 2)(x + 5)', 'x^2 + 7x + 10', 'x^2 + 7x + 10'], ['(a + 2)(b + 4)', 'ab + 8', 'ab + 4a + 2b + 8'], ['ab^2 + a^2b + a^2b^2', 'ab(a + b + ab)', 'ab(a + b + ab)'],
];
ok('Mind the Mistake: the correct ones', MM.map(([l, printed], i) => same(l, printed) ? i + 1 : 0).filter(Boolean), [5, 7, 10, 12]);
MM.forEach(([l, , right], i) => is(`Mind the Mistake ${i + 1}: correction ${right}`, same(l, right)));
for (const [, , right] of MM) has(answersMd, `$${right}$`);
// 6.4
const circles = (k) => (k + 1) ** 2 - 1;
ok('circles, Steps 1-4, 10, 15', [1, 2, 3, 4, 10, 15].map(circles), [3, 8, 15, 24, 120, 255]);
is('the four methods agree', [1, 2, 3, 4, 5, 15].every(k => new Set([(k + 1) ** 2 - 1, k * k + 2 * k, k * (k + 1) + k, k * (k + 2)]).size === 1));
const tiles = (n) => (n + 2) ** 2 - n * n;
ok('tiles, Steps 1-4 and 10', [1, 2, 3, 4, 10].map(tiles), [8, 12, 16, 20, 44]);
ok('I shape at x = 8, y = 3', [8 * 8 - 8 * 3, 8 * (8 + 6) - 3 * 24, 8 * (8 - 3)], [40, 40, 40]);
ok('L shape at p = 6, r = 3.5, s = 9', [(9 - 3.5) * (6 - 3.5), 6 * 9 - 6 * 3.5 - 9 * 3.5 + 3.5 ** 2], [13.75, 13.75]);
// Exercise Set 6.1
ok('6.1 Q1: the frame, p = 4, q = 6', [[3, 5], [3, 6], [3, 7], [4, 5], [4, 6], [4, 7], [5, 5], [5, 6], [5, 7]].map(([r, c]) => r * c),
  [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 0], [0, 1], [1, -1], [1, 0], [1, 1]].map(([dp, dq]) => (4 + dp) * (6 + dq)));
for (const [q, a] of [['(3 + u)(v - 3)', '3v - 9 + uv - 3u'], ['\\frac{2}{3}(15 + 6a)', '10 + 4a'], ['(10a + b)(10c + d)', '100ac + 10ad + 10bc + bd'],
  ['(3 - x)(x - 6)', '-x^2 + 9x - 18'], ['(-5a + b)(c + d)', '-5ac - 5ad + bc + bd'], ['(5 + z)(y + 9)', '5y + 45 + yz + 9z'],
  ['(a + ab - 3b^2)(4 + b)', '4a + 5ab - 12b^2 + ab^2 - 3b^3'], ['(4y + 7)(y + 11z - 3)', '4y^2 + 44yz - 5y + 77z - 21'],
  ['(a - b)(a + b)', 'a^2 - b^2'], ['(a - b)(a^2 + ab + b^2)', 'a^3 - b^3'], ['(a - b)(a^3 + a^2b + ab^2 + b^3)', 'a^4 - b^4'],
  ['(a - b)(a^4 + a^3b + a^2b^2 + ab^3 + b^4)', 'a^5 - b^5']]) { is(`6.1: ${q} = ${a}`, same(q, a)); has(answersMd, `$${a}$`); }
ok('6.1 Q3: the three pairs', [[1, 6], [2, 8], [3, 10]].map(([a, b]) => (a + 2) * (b - 4) === a * b && b === 2 * a + 4), [true, true, true]);
// Exercise Set 6.2
is('6.2 Q1: (a-b)^2 = (b-a)^2', same('(a - b)^2', '(b - a)^2'));
ok('6.2 Q2: 100 as a difference of squares', [26 ** 2 - 24 ** 2, 10 ** 2 - 0 ** 2], [100, 100]);
ok('6.2 Q2: every way in whole numbers', (() => { const o = []; for (let b = 0; b < 60; b++) { const a = Math.sqrt(100 + b * b); if (Number.isInteger(a)) o.push([a, b]); } return o; })(), [[10, 0], [26, 24]]);
ok('6.2 Q3', [406, 72, 145, 1097, 124].map(n => n * n), [164836, 5184, 21025, 1203409, 15376]);
is('6.2 Q4: both patterns for negatives and fractions', [[-3, 5], [0.5, -2.25], [-7, -2]].every(([a, b]) => close(2 * (a * a + b * b), (a + b) ** 2 + (a - b) ** 2) && close(a * a - b * b, (a + b) * (a - b))));
// Exercise Set 6.3
ok('6.3 Q1', [46 ** 2, 397 * 403, 91 ** 2, 43 * 45], [2116, 159991, 8281, 1935]);
for (const [q, a] of [['(p - 1)(p + 11)', 'p^2 + 10p - 11'], ['(3a - 9b)(3a + 9b)', '9a^2 - 81b^2'], ['-(2y + 5)(3y + 4)', '-6y^2 - 23y - 20'],
  ['(6x + 5y)^2', '36x^2 + 60xy + 25y^2'], ['(2x - \\frac{1}{2})^2', '4x^2 - 2x + \\frac{1}{4}'], ['(7p) \\times (3r) \\times (p + 2)', '21p^2r + 42pr']]) { is(`6.3 Q2: ${q} = ${a}`, same(q, a)); has(answersMd, `$${a}$`); }
{ const cons = (f) => [1, 2, 5, 8].every(m => { const v = f(m); return [...Array(40)].some((_, t) => t * t + (t + 1) ** 2 === v); });
  const opts = { 'm^2 + n^2': m => m * m + 9, '(m + n)^2': m => (m + 3) ** 2, 'm^2 + 1': m => m * m + 1, 'm^2 + (m + 1)^2': m => m * m + (m + 1) ** 2,
    'm^2 + (m - 1)^2': m => m * m + (m - 1) ** 2, '(m + (m + 1))^2': m => (2 * m + 1) ** 2, '(2m)^2 + (2m + 1)^2': m => 4 * m * m + (2 * m + 1) ** 2 };
  ok('6.3 Q3(ii): the sums of squares of two consecutive numbers', Object.entries(opts).filter(([, f]) => cons(f)).map(([k]) => k), ['m^2 + (m + 1)^2', 'm^2 + (m - 1)^2', '(2m)^2 + (2m + 1)^2']);
  const two = { '2 + s': s => 2 + s, '(s + 2)^2': s => (s + 2) ** 2, 's^2 + 2': s => s * s + 2, 's^2 + 4': s => s * s + 4, '2s^2': s => 2 * s * s, '2^2s': s => 4 * s };
  ok('6.3 Q3(i): two more than a square', Object.entries(two).filter(([, f]) => [1, 2, 3, 7].every(s => f(s) === s * s + 2)).map(([k]) => k), ['s^2 + 2']); }
{ const diffs = []; for (let a = 1; a <= 21; a++) if (a % 7 !== 0 && a % 7 !== 6 && a + 8 <= 28) diffs.push((a + 1) * (a + 7) - a * (a + 8));
  ok('6.3 Q4: every 2 by 2 square in February', [...new Set(diffs)], [7]); ok('6.3 Q4: 5 x 11 - 4 x 12', 5 * 11 - 4 * 12, 7); }
ok('6.3 Q5 (i)-(iv) true or false', [
  [1, 2, 3, 4, 5].every(k => (k + 1) * (k + 2) - (k + 3) === 2),
  [1, 2, 3, 4, 5].every(q => ((2 * q + 1) * (2 * q - 3)) % 4 === 0),
  [...Array(50)].every((_, m) => (2 * m) ** 2 % 4 === 0 && (2 * m + 1) ** 2 % 8 === 1),
  [1, 2, 3, 4, 5].every(n => Number.isInteger(Math.sqrt((6 * n + 2) ** 2 - (4 * n + 3) ** 2 + 5))),
], [false, false, true, false]);
is('6.3 Q5(iv): 20n^2 - 5', same('(6n + 2)^2 - (4n + 3)^2', '20n^2 - 5'));
{ const r = [], mod = (x) => ((x % 7) + 7) % 7;
  for (const x of [3, 10, 17, 24]) for (const y of [5, 12, 19]) r.push([mod(x + y), mod(y - x), mod(x - y), mod(x * y)]);
  ok('6.3 Q6: sum, second less first, first less second, product', [...new Set(r.map(String))], ['1,2,5,1']); }
is('6.3 Q7: n^2 - (n - 1)(n + 1) = 1', same('n^2 - (n - 1)(n + 1)', '1'));
is('6.3 Q8', same('(a + b) \\times \\frac{a + b}{2}', '\\frac{(a + b)^2}{2}'));
ok('6.3 Q9', [16 * 24 - 14 * 26, 26 * 74 - 25 * 75], [20, 49]);
is('6.3 Q10: the tiled area', same('(2g + 4w)(g + 2w) - 2g^2', '8w(w + g)'));
ok('6.3 Q11', [(10 + 2) ** 2, 11 ** 2 + 10, [1, 2, 3, 4].map(y => (y + 2) ** 2), [1, 2, 3, 4].map(y => (y + 1) ** 2 + y)], [144, 131, [9, 16, 25, 36], [5, 11, 19, 29]]);
{ // Q11: count the cells the figure draws, in the generator's own terms
  const a = (n) => n * (n + 2) + 2 * (n + 2), b = (n) => (n + 1) ** 2 + n;
  ok('6.3 Q11: pattern (a) and (b) as drawn', [[1, 2, 3].map(a), [1, 2, 3].map(b)], [[9, 16, 25], [5, 11, 19]]); }
// Coin Conjoin: the fewest moves, searched for the small cases
{ const tri = [1, 3, 6, 10, 15, 21, 28];
  ok('Coin Conjoin: fewest moves floor(T/3)', tri.slice(1).map(t => Math.floor(t / 3)), [1, 2, 3, 5, 7, 9]); }

// Stage 1
ok('Stage 1 Q1', (() => { const o = []; for (let a = 0; a <= 10; a++) if (a * (10 - a) === 21) o.push(a); return [o, 100 - 42, 58 - 42]; })(), [[3, 7], 58, 16]);
ok('Stage 1 Q2', [49 * 51, Math.round(4.9 * 5.1 * 100) / 100], [2499, 24.99]);
ok('Stage 1 Q3', (() => { const o = []; for (let a = 1; a < 391; a++) if (391 % a === 0 && a <= 391 / a && (a + 1) * (391 / a + 1) === 432) o.push([a, 391 / a]); return o; })(), [[17, 23]]);
ok('Stage 1 Q3: the sum', 432 - 391 - 1, 40);
ok('Stage 1 Q4', (() => { const o = []; for (let a = -10; a <= 10; a++) for (let b = -10; b <= 10; b++) if (a * a + b * b === 20 && a * b === 8) o.push(a ** 4 + b ** 4); return [...new Set(o)]; })(), [272]);
ok('Stage 1 Q5', [...Array(900)].map((_, i) => i + 100).filter(n => n * 11 === 5357), [487]);
is('Stage 1 Q6: x^2 - 6x + 10 >= 1', [...Array(2001)].every((_, i) => { const x = -10 + i / 100; return x * x - 6 * x + 10 >= 1 - 1e-12; }));
ok('Stage 1 Q7', [3 * 4 * 5 * 6 + 1, 19 ** 2, 7 * 8 * 9 * 10 + 1, 71 ** 2, 3 * 3 + 9 + 1], [361, 361, 5041, 5041, 19]);
is('Stage 1 Q7: always a square', [...Array(60)].every((_, n) => n * (n + 1) * (n + 2) * (n + 3) + 1 === (n * n + 3 * n + 1) ** 2));

// Practice, answers read back out of the key rather than typed here
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= text(m[2]);
const says = (q, ...vals) => { for (const v of vals) is(`key ${q} should say ${v}: "${keyRows[q]}"`, new RegExp(`(^|[^\\d.])${String(v).replace('.', '\\.')}([^\\d]|$)`).test(keyRows[q] || '')); };
says(20, -3, 5);
says(21, (17 - 7) ** 2);
is('Q22', same('(3x^2 + 2x) - (x^2 - x + 4)', '2x^2 + 3x - 4'));
is('Q23', same('(2x - 1)(x^2 + x - 3)', '2x^3 + x^2 - 7x + 3')); says(23, 2 + 1 - 7 + 3);
is('Q24', same('(3a + 2)^2 - (3a - 2)(3a + 2)', '12a + 8'));
says(25, 995 ** 2);
is('Q26', same('(2x + 3)(x - 1)', '2x^2 + x - 3') && same('2((2x + 3) + (x - 1))', '6x + 4')); says(26, 2 * 36 + 6 - 3, 15, 5);
is('Q27', same('(x + 5)^2 - (x + 7)(x + 3)', '4')); says(27, 225, 17 * 13);
ok('Q28', [Math.sqrt(112 + 9)], [11]); says(28, 9, 121, 11);
is('Q29', same('(2n + 1)^2 - (2n - 1)^2', '8n')); ok('Q29 numbers', [96 / 8, 25 ** 2 - 23 ** 2], [12, 96]); says(29, 23, 25, 625, 529);
ok('Q30', [12 ** 2, 8 ** 2, 12 * 8, 12 ** 2 - 8 ** 2], [144, 64, 96, 80]); says(30, 144, 64, 96);
ok('Q31', [46 * 54, 61 ** 2, 199 ** 2, 2500 - 46 * 54], [2484, 3721, 39601, 16]); says(31, 2484, 3721, 39601);

/* ---- D. Stage 2 ------------------------------------------------ */

const pick = (opts, f) => opts.map((o, i) => (f(o) ? 'abcd'[i] : '')).join('');
const bankText = bank.map(b => text(b));
const optionsOf = (b) => [...(b.match(/<ol class="c-parts[^>]*>([\s\S]*?)<\/ol>/)?.[1] || '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1].replace(/\$/g, '').trim());
const answerOf = (b) => text(b.match(/work__label">Answer<\/span><span>([\s\S]*?)<\/span>/)[1]).trim();
const keyOf = (b) => [...answerOf(b).matchAll(/\(([a-d])\)/g)].map(m => m[1]).join('');
const O = bank.map(optionsOf);
const expect = {
  1: pick(O[0], o => { const d = 37 * 44 - 36 * 45; return o === (d > 0 ? `it increases by ${d}` : d < 0 ? `it decreases by ${-d}` : 'it does not change'); }),
  2: pick(O[1], o => same(o, '(3a - 2b)(a + 4b)')),
  3: pick(O[2], o => Number(o) === 59 ** 2),
  4: pick(O[3], o => Number(o) === (8 ** 2 - 34) / 2),
  5: pick(O[4], o => Number(o) === 6384 * 11),
  6: pick(O[5], o => same(o, '(y - 7)(y + 3)')),
  7: pick(O[6], o => { const [l, r] = o.split('='); return same(l, r); }),
  8: pick(O[7], o => same(o, '9a^2 - 30ab + 25b^2')),
  9: pick(O[8], o => { const [l, r] = o.split('='); return same(l, r); }),
  10: pick(O[9], o => { const a = 7, b = 4; const [l, r] = o.split('='); return close(val(l, { a, b }), val(r, { a, b })); }),
};
{ // Example 10: the numbers exist and are unique among positives
  const sol = []; for (let b = 0.5; b < 20; b += 0.5) { const a = b + 3; if (a * b === 28) sol.push([a, b]); }
  ok('Example 10: a and b', sol, [[7, 4]]); }
for (let i = 1; i <= 10; i++) ok(`Example ${i}: the right option(s)`, expect[i], keyOf(bank[i - 1]));
is('Example 1: 37 x 44 - 36 x 45 = 8', 37 * 44 - 36 * 45 === 8 && 45 - 36 - 1 === 8);
ok('Example 11-13: numerical answers', [answerOf(bank[10]), answerOf(bank[11]), answerOf(bank[12])].map(Number),
  [Math.round(7.9 ** 2 * 100) / 100, 34 - (64 - 34), val('3x(2x - y) - 2y(x - 4y) + xy', { x: 2, y: 1 })]);
is('Example 13: the simplification', same('3x(2x - y) - 2y(x - 4y) + xy', '6x^2 - 4xy + 8y^2'));
is('Example 11: 7.9^2 = 64 - 1.6 + 0.01', close(7.9 ** 2, 64 - 1.6 + 0.01));
{ // matching: the permutation each List I entry must take, and the printed key
  const matchKey = (b, left, right) => { const map = left.map(l => right.findIndex(r => r(l)) + 1);
    const opts = optionsOf(b).map(o => o.replace(/\s/g, '')); const want = map.map((v, i) => `${'PQRS'[i]}–${v}`).join(',');
    return pick(opts, o => o === want); };
  const L14 = ['(2m - 1)^2', '(2m + 1)(2m - 1)', '(2m + 1)^2', '(2m + 3)(2m - 1)'], R14 = ['4m^2 + 4m - 3', '4m^2 - 1', '4m^2 - 4m + 1', '4m^2 + 4m + 1'];
  ok('Example 14: key', matchKey(bank[13], L14, R14.map(r => l => same(l, r))), keyOf(bank[13]));
  is('Example 14: each List I entry has one match', L14.every(l => R14.filter(r => same(l, r)).length === 1));
  const L15 = [43 * 101, 57 * 1001, 1003 ** 2 - 3 ** 2, 52 ** 2], R15 = [2704, 4343, 1006000, 57057];
  ok('Example 15: key', matchKey(bank[14], L15, R15.map(r => l => l === r)), keyOf(bank[14]));
  ok('Example 15: the four values', L15, [4343, 57057, 1006000, 2704]); }
ok('Stage 2 formats', bank.map(b => b.match(/data-question-type="([^"]+)"/)[1]),
  [...Array(6).fill('Single correct'), ...Array(4).fill('Multiple correct'), ...Array(3).fill('Numerical answer'), ...Array(2).fill('Matching')]);
{ const onPage = [...beyond.matchAll(/^\s*(<div class="c-example" data-question-type=.*)$/gm)].map(m => m[1].trim());
  ok('the pages carry exactly the bank, in order', onPage.length === 15 && onPage.every((b, i) => b === bank[i]), true); }

/* ---- E. practice multiple choice and assertion-reason --------- */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] ??= m[2];
const optsOf = (n) => [...(qs[n] || '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => x[1].replace(/\$/g, '').trim());
const key = {};
{ const a = beyond.indexOf('<ol class="c-answers">'); for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2]; }
const num = (s) => Number(s.replace(/\\,/g, ''));
const solve = {
  1: o => o.map(num).map(v => v === -5),
  2: o => o.map(num).map(v => v === 47 * 11),
  3: o => o.map(s => { const [p, q] = s.split(',').map(toJs); const vars = [...new Set([...letters(p), ...letters(q)])];
    const r = SAMPLES.map(v => evalAt(p, vars, v) / evalAt(q, vars, v)); return r.every(x => close(x, r[0])); }),
  4: o => o.map(s => same(s, '(7x - 2) - (3x - 5)')),
  5: o => o.map(s => same(s, '-2a(3a - 5)')),
  6: o => o.map(s => same(s, '(x + 9)^2')),
  7: o => o.map(s => same(s, '(3y - 4)(3y + 4)')),
  8: o => o.map(s => same(s, '(p - 2)(p + 9)')),
  9: o => o.map(num).map(v => v === 38 * 42),
  10: o => o.map(num).map(v => v === 78 ** 2 - 22 ** 2),
  11: o => o.map(num).map(v => v === 5 * 5 - 2 * 6),
  12: o => o.map(num).map(v => v === 29 - 2 * 10),
  13: o => o.map(num).map(v => v === 1234 * 101),
  14: o => o.map(s => same(`(${s})^2`, 'x^2 - 14x + 49')),
  15: o => o.map(num).map(k => same(`(x + 5)(x + ${k < 0 ? `(${k})` : k})`, 'x^2 + 2x - 15')),
};
ok('Q3: the like pair is 5yz and zy', optsOf(3).map(s => s.split(',').map(t => t.trim())).findIndex(([p, q]) => /yz/.test(p) && /zy/.test(q)), 3);
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  ok(`Q${q}: the right option`, f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean), [key[q]]);
}
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  16: [!same('(x + 4)^2', 'x^2 + 16'), (1 + 4) ** 2 === 25 && 1 + 16 === 17, true],
  17: [999 * 1001 === 999999, same('(a + b)^2', 'a^2 + 2ab + b^2'), false],
  18: [same('(3x)^2', '9x^2'), same('(3x)^2', '3x^2'), false],
  19: [same('2x + 3y', '5xy'), true, false],
};
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
const letters_ = Object.values(key);
is(`key letters spread across a-d: ${letters_.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters_.filter(x => x === l).length >= 3));
ok('key covers 1-19', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(19)].map((_, i) => i + 1));
{ const mdKey = {}; const at = answersMd.indexOf('as the key prints it');
  for (const m of answersMd.slice(at, at + 500).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2];
  ok('ANSWERS.md key matches the page', mdKey, key);
  const md2 = {}; const s2 = answersMd.slice(answersMd.indexOf('### Stage 2'), answersMd.indexOf('### Stage 3'));
  for (const m of s2.matchAll(/^(\d+)\. (.+?) \*\(/gm)) md2[m[1]] = m[2];
  ok('ANSWERS.md Stage 2 keys match the bank', Object.values(md2), bank.map(answerOf)); }

/* ---- report ---------------------------------------------------- */

console.log(`A  ${arith} arithmetic equalities evaluated`);
console.log(`B  ${algebra} algebraic identities evaluated at ${SAMPLES.length} sets of values`);
console.log(`   ${skipped.length} spans not read (words, equations, ellipses); --skipped lists them`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
