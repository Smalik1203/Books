#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed — Roman numerals built and read by rule, numbers converted
   between bases, places of sixty and of the Mayan landmarks worked out,
   searches run — and compared with what is on the page.

     node pages/class-8/ch03-story-of-numbers/check-numbers.mjs

   Four parts:
     A  every identity set as maths, on every page and in ANSWERS.md, whose
        sides all evaluate to numbers (a numeral in another base is skipped
        here and checked in B)
     B  the claims A cannot check: Roman numerals, base conversions, place
        counts, searches, and the practice answers, read back out of the key
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

/* ---- the mathematics ----------------------------------------- */

const ROMAN = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
const roman = (n) => ROMAN.reduce((s, [v, r]) => { while (n >= v) { s += r; n -= v; } return s; }, '');
const RV = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
const unroman = (s) => [...s].reduce((t, c, i) => t + (RV[c] < (RV[s[i + 1]] || 0) ? -RV[c] : RV[c]), 0);
const LANDMARKS = [1, 5, 10, 50, 100, 500, 1000];
const inBase = (n, b) => n.toString(b);
const fromBase = (s, b) => parseInt(s, b);
const digitsIn = (n, b) => [...inBase(n, b)].map(d => parseInt(d, b));
const digitSum = (n, b = 10) => digitsIn(n, b).reduce((a, d) => a + d, 0);
const places60 = (n) => { const o = []; do { o.unshift(n % 60); n = Math.floor(n / 60); } while (n); return o; };
const maya = (n) => [Math.floor(n / 7200), Math.floor(n % 7200 / 360), Math.floor(n % 360 / 20), n % 20];
const base20 = (n) => [Math.floor(n / 8000), Math.floor(n % 8000 / 400), Math.floor(n % 400 / 20), n % 20];
const factors = (n) => [...Array(n)].map((_, i) => i + 1).filter(d => n % d === 0);
const primes = (n) => { const o = []; for (let d = 2; n > 1; d++) while (n % d === 0) { if (!o.includes(d)) o.push(d); n /= d; } return o; };
const exactIn = (den, b) => primes(den).every(p => b % p === 0);
const hms = (s) => `${Math.floor(s / 3600)} h ${Math.floor(s % 3600 / 60)} min ${s % 60} s`;
const bars = (d) => `${Math.floor(d / 5)} bars and ${d % 5} dots`;
const eg = ['strokes', 'arches', 'coils', 'lotuses', 'fingers', 'tadpoles'];

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/\\,/g, '').replace(/\s+/g, ' ');
const T = { body: text(body), beyond: text(beyond), md: answersMd.replace(/\\,/g, '').replace(/\s+/g, ' ') };
const printed = (where, s) => is(`${where} should print "${s}"`, T[where].includes(s));

/* ---- A. every identity ---------------------------------------- */

function toExpr(side) {
  let s = side.replace(/,\s*$/, '')
    // a numeral in another base, 1322_{\,5}, is read in that base
    .replace(/\b([0-9a-z]+)_\{\\,(\d+)\}/g, (m, d, b) => String(parseInt(d, Number(b))))
    .replace(/\\left|\\right/g, '')
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\tfrac(\d)(\d)/g, '(($1)/($2))')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad/g, '')
    .replace(/\^\{([^{}]+)\}/g, '**($1)').replace(/\^(\d)/g, '**$1')
    .replace(/\s+/g, '');
  if (!s || !/^[-+*/().0-9]+$/.test(s)) return null;
  return s.replace(/\)\(/g, ')*(');
}
const evalExpr = (e) => { try { return Function(`"use strict";return (${e})`)(); } catch { return NaN; } };

let spans = 0; const skipped = [];
// a line whose right-hand side is a numeral in another base, not a number:
// 48 = 6 x 7 + 6, written 66 in base 7. Checked in B.
const NOT_DECIMAL = ['= 6 \\times 7 + 6 = 66'];
const sources = [...pages.map(f => [f, html[f]]), ['ANSWERS.md', answersMd]];
for (const [f, src0] of sources) {
  // a division with a remainder: a = b x q + r, with r < b
  const src = src0.replace(/\$(\d+) \\div (\d+) = (\d+)\$ remainder \$(\d+)\$/g, (all, a, b, q, r) => {
    spans++;
    if (+a === +b * +q + +r && +r < +b) pass++;
    else fails.push(`${f}: ${all} — ${b} x ${q} + ${r} is ${+b * +q + +r}`);
    return '';
  });
  for (const m of src.matchAll(/\$([^$]+)\$/g)) {
    const span = m[1].replace(/\s+/g, ' ');
    if (!span.includes('=') || NOT_DECIMAL.includes(span.trim())) continue;
    for (const part of span.split(/\\qquad|,\s*\\ |,\s*\\quad/)) {
      const sides = part.split('=').map(s => s.trim()).filter(Boolean);
      if (sides.length < 2) continue;
      let vals = sides.map(toExpr);
      if (vals.filter(v => v !== null).length >= 2) vals = vals.filter(v => v !== null);
      if (vals.some(v => v === null) || vals.length < 2) { skipped.push(`${f}: $${part.trim()}$`); continue; }
      const nums = vals.map(evalExpr);
      if (nums.some(n => !Number.isFinite(n))) { skipped.push(`${f}: $${part.trim()}$`); continue; }
      spans++;
      if (nums.some(n => Math.abs(n - nums[0]) > 1e-9)) fails.push(`${f}: $${part.trim()}$ — sides are ${nums.join(' and ')}`);
      else pass++;
    }
  }
}

/* ---- B. claims arithmetic alone does not check ---------------- */

// the body
ok('Example 1: 2367 in Roman, ten characters', [roman(2367), roman(2367).length], ['MMCCCLXVII', 10]);
printed('body', 'Answer MMCCCLXVII');
ok('Example 2: CCXXXII + CCCCXIII', [unroman('CCXXXII') + unroman('CCCCXIII'), roman(645)], [645, 'DCXLV']);
ok('Example 2: the gathered counts', [[...'CCXXXIICCCCXIII'].filter(c => c === 'C').length, [...'CCXXXIICCCCXIII'].filter(c => c === 'X').length, [...'CCXXXIICCCCXIII'].filter(c => c === 'I').length], [6, 4, 5]);
ok('Example 3: 143 in base 5', digitsIn(143, 5), [1, 0, 3, 3]);
ok('Example 3: seven symbols against eight', [digitSum(143, 5), digitSum(143)], [7, 8]);
ok('Example 4: 324 x 10', [324 * 10, digitsIn(324, 10)], [3240, [3, 2, 4]]);
ok('V x X, V x V, L x L', [5 * 10, roman(25), roman(2500)], [50, 'XXV', 'MMD']);
is('V x X is a landmark; V x V and L x L are not', LANDMARKS.includes(50) && !LANDMARKS.includes(25) && !LANDMARKS.includes(2500));
ok('Fig. 3.4: 7530 in sixties', places60(7530), [2, 5, 30]);
ok('3605 misread as 65 or 216 005', [1 * 60 + 5, 1 * 60 ** 3 + 5], [65, 216005]);
is('base 60 splits into halves ... thirtieths', [2, 3, 4, 5, 6, 10, 12, 15, 20, 30].every(d => 60 % d === 0));
ok('base 10 manages only halves and fifths', factors(10).filter(d => d > 1 && d < 10), [2, 5]);
ok('the Mayan 7200', 7200 / 360, 20);
is('360 is not 20 x 20', 360 !== 20 * 20);
ok('324 in Egyptian: 3 + 2 + 4 symbols', digitSum(324), 9);
ok('Roman Ex 3.2 Q3 (body) 3888 needs the most', (() => { let b = [0, 0]; for (let n = 1; n < 4000; n++) if (roman(n).length > b[1]) b = [n, roman(n).length]; return b; })(), [3888, 15]);

// Stage 1
ok('Stage 1 Q1: 1000 in base 6', [inBase(1000, 6), inBase(1000, 6).length], ['4344', 4]);
ok('Stage 1 Q1: powers of six', [0, 1, 2, 3, 4].map(k => 6 ** k), [1, 6, 36, 216, 1296]);
ok('Stage 1 Q2: 2025 in base 2', [inBase(2025, 2), inBase(2025, 2).length], ['11111101001', 11]);
ok('Stage 1 Q2: a million needs twenty binary digits', inBase(1e6, 2).length, 20);
is('Stage 1 Q2: 64 binary digits reach past 10^19', 2 ** 64 > 1e19);
ok('Stage 1 Q3: four readings', [2 * 60 + 3, 2 * 3600 + 3, 2 * 3600 + 3 * 60, 2 * 60 ** 3 + 3], [123, 7203, 7380, 432003]);
ok('Stage 1 Q5: 48 in base 7', [inBase(48, 7), digitSum(48, 7), 48 % 6], ['66', 12, 0]);
is('Stage 1 Q5: base-7 digit sum tests for 6', [...Array(3000)].every((_, n) => n % 6 === digitSum(n, 7) % 6));
ok('Stage 1 Q6: exact in base 12', [2, 3, 4, 5].map(d => exactIn(d, 12)), [true, true, true, false]);
ok('Stage 1 Q6: exact in base 10', [2, 5, 3, 7].map(d => exactIn(d, 10)), [true, true, false, false]);
ok('Stage 1 Q7: Egyptian symbols to a million, a billion, a trillion', [6, 9, 12].map(k => k + 1), [7, 10, 13]);
{ const q = []; const r = []; let n = 212; while (n) { r.push(n % 5); n = Math.floor(n / 5); q.push(n); }
  ok('Stage 1 Q8: dividing 212 by 5', [q, r, inBase(212, 5)], [[42, 8, 1, 0], [2, 2, 3, 1], '1322']); }
printed('beyond', '1322');

// Stage 2
ok('Ex 1: 83 in gates and in tens', [Math.floor(83 / 5), 83 % 5, Math.floor(83 / 10), 83 % 10], [16, 3, 8, 3]);
printed('beyond', '16 gates and 3 loose marks; in tens, 8 groups and 3 over');
ok('Ex 2: 1649', roman(1649), 'MDCXLIX');
printed('beyond', 'Answer MDCXLIX');
ok('Ex 3: MMCDXCVI', unroman('MMCDXCVI'), 2496);
ok('Ex 4: CLXVI + CCLXXVII', [unroman('CLXVI'), unroman('CCLXXVII'), roman(unroman('CLXVI') + unroman('CCLXXVII'))], [166, 277, 'CDXLIII']);
{ const both = 'CLXVI' + 'CCLXXVII'; const c = (x) => [...both].filter(y => y === x).length;
  ok('Ex 4: gathered counts C L X V I', ['C', 'L', 'X', 'V', 'I'].map(c), [3, 2, 3, 2, 3]);
  ok('Ex 4: after trading, Cs and Xs', [c('C') + c('L') / 2, c('X') + c('V') / 2], [4, 4]); }
ok('Ex 5: V x C, L x C', [LANDMARKS.includes(5 * 100) && roman(500) === 'D', LANDMARKS.includes(50 * 100)], [true, false]);
ok('Ex 6: 40 506', [digitsIn(40506, 10), digitSum(40506)], [[4, 0, 5, 0, 6], 15]);
printed('beyond', '4 fingers, 5 coils, 6 strokes: 15 symbols');
ok('Ex 7: 2305 x 100', [2305 * 100, digitsIn(2305 * 100, 10)], [230500, [2, 3, 0, 5, 0, 0]]);
ok('Ex 7: two lotuses, three coils, five strokes up two landmarks', [eg[3 + 2], eg[2 + 2], eg[0 + 2]], ['tadpoles', 'fingers', 'coils']);
ok('Ex 8: base-4 landmarks to 1000', [0, 1, 2, 3, 4, 5].map(k => 4 ** k).filter(x => x <= 1000), [1, 4, 16, 64, 256]);
ok('Ex 8: 300 in base 4', digitsIn(300, 4), [1, 0, 2, 3, 0]);
ok('Ex 9: base, next landmark, largest digit', [81 / 9, 729 / 81, 729 * 9, 9 - 1], [9, 9, 6561, 8]);
ok('Ex 10: 100 in base 3', inBase(100, 3), '10201');
ok('Ex 11: 3042 in base 5', fromBase('3042', 5), 397);
ok('Ex 12: 110101 in base 2', [fromBase('110101', 2), [...'110101'].map((d, i) => d === '1' ? 2 ** (5 - i) : 0).filter(Boolean)], [53, [32, 16, 4, 1]]);
ok('Ex 13: 4000 in sixties, and its marks', [places60(4000), 1 + 6 + Math.floor(40 / 10) + 40 % 10], [[1, 6, 40], 11]);
ok('Ex 14: 10 000 seconds', hms(10000), '2 h 46 min 40 s');
ok('Ex 15: 1000 in Mayan places', [maya(1000), bars(14)], [[0, 2, 14, 0], '2 bars and 4 dots']);
// an identity can stay true with the wrong count in a place (280 = 13 x 20 + 20),
// so the place counts are read back off the page as the working prints them
const raw = beyond.replace(/\s+/g, ' ');
const B = String.fromCharCode(92);
const pageSays = (what, s) => is(`${what}: the page should print "${s}"`, raw.includes(s));
{ const [, a, b, c] = maya(1000);
  pageSays('Ex 15', `$1000 = ${a} ${B}times 360 + ${b * 20 + c}$`);
  pageSays('Ex 15', `$${b * 20 + c} = ${b} ${B}times 20 + ${c}$`); }
{ const [h, m, s] = places60(4000);
  pageSays('Ex 13', `$4000 = ${h} ${B}times 3600 + ${m * 60 + s}$`);
  pageSays('Ex 13', `$${m * 60 + s} = ${m} ${B}times 60 + ${s}$`);
  pageSays('Ex 13', `$${h} ${B}mid ${m} ${B}mid ${s}$`); }
{ const [h, m, s] = places60(10000);
  pageSays('Ex 14', `$10${B},000 = ${h} ${B}times 3600 + ${m * 60 + s}$`);
  pageSays('Ex 14', `$${m * 60 + s} = ${m} ${B}times 60 + ${s}$`);
  pageSays('Ex 14', `$${h} ${B}mid ${m} ${B}mid ${s}$`); }
{ const [a, b, c, d] = digitsIn(300, 4).slice(0, 4);
  pageSays('Ex 8', `one $256$ leaves $300 - 256 = ${300 - a * 256}$`);
  pageSays('Ex 8', `two $16$s leave $${300 - 256} - ${c * 16} = ${300 - 256 - c * 16}$`);
  pageSays('Ex 8', `three $4$s leave $12 - 12 = 0$`);
  is('Ex 8: no 64s, three 4s', b === 0 && d === 3); }
ok('Ex 16: 50 207 without its zeros', [digitsIn(50207, 10), Number(String(50207).replace(/0/g, ''))], [[5, 0, 2, 0, 7], 527]);
ok('Ex 17', 7e5 + 3e2 + 9, 700309);
printed('beyond', '700309');
ok('Ex 18: 2764 in three systems', [roman(2764), roman(2764).length, digitSum(2764), String(2764).length], ['MMDCCLXIV', 9, 19, 4]);
printed('beyond', 'Hindu 4, Roman 9, Egyptian 19');

// the practice answers, read back out of the key rather than typed here
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= text(m[2]);
// a lettered row is checked part by part
const row = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const r = keyRows[n] || '';
  if (!part) return r;
  const m = r.match(new RegExp(`\\(${part}\\)([^(]*)`));
  return m ? m[1] : '';
};
const says = (q, ...vals) => { for (const v of vals) is(`key ${q} should say ${v}: "${row(q)}"`, new RegExp(`(^|[^\\d])${String(v).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\d]|$)`).test(row(q))); };
says(20, inBase(45, 2));
says(21, 2 * 3600 + 30 * 60 + 15);
says(22, unroman('MMDCCCXLI'));
says(23, inBase(500, 4));
{ const n = fromBase('34017', 10); says(24, n, digitSum(n), n * 10);
  is('Q24: three fingers, four lotuses, one arch, seven strokes', n === 3 * 1e4 + 4 * 1e3 + 1 * 10 + 7); }
{ const b = [...Array(20)].map((_, i) => i + 2).find(b => fromBase('21', b) === 15); says(25, b, fromBase('21', 9)); }
says(26, inBase(fromBase('1101', 2) + fromBase('111', 2), 2), fromBase('1101', 2) + fromBase('111', 2));
{ const d = digitsIn(2000, 12); ok('Q27: 2000 in twelves', d, [1, 1, 10, 8]);
  is(`key 27 should say ${d[0]} crate, ${d[1]} carton, ${d[2]} boxes and ${d[3]} loose: "${row(27)}"`, row(27).includes(`${d[0]} crate, ${d[1]} carton, ${d[2]} boxes and ${d[3]} loose`)); says(27, 12); }
{ const m = maya(5000), t = base20(5000);
  ok('Q28: 5000 in Mayan and base-20 places', [m, t], [[0, 13, 16, 0], [0, 12, 10, 0]]);
  says(28, ...m.slice(1), ...t.slice(1), 360, 400); }
says(29, fromBase('333', 4), 4 ** 3, fromBase('2222', 3));
is('Q29: 2222 is the largest four-place base-3 numeral', inBase(3 ** 4 - 1, 3) === '2222');
{ const t = { P: 3725, Q: 5400, R: 7384 };
  for (const [k, s] of Object.entries(t)) is(`key 30a should give ${k} as ${hms(s)}: "${row('30a')}"`, row('30a').includes(`${k}: ${hms(s)}`));
  const empty = Object.keys(t).filter(k => places60(t[k]).includes(0));
  ok('Q30b: the only time with an empty place', empty, ['Q']);
  is(`key 30b should name Q: "${row('30b')}"`, /^\s*Q\b/.test(row('30b')));
  says('30c', t.R - t.P); is(`key 30c should say ${hms(t.R - t.P)}`, row('30c').includes(hms(t.R - t.P))); }
{ const panels = { X: '101100', Y: '011111', Z: '110010' };
  for (const [k, s] of Object.entries(panels)) says('31a', fromBase(s, 2));
  says('31b', 2 ** 6 - 1);
  const need = [...Array(20)].map((_, i) => i + 1).find(k => 2 ** k - 1 >= 200);
  says('31c', need, 2 ** 7 - 1, 2 ** 8 - 1); }

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] = m[2];
const optsOf = (n) => [...(qs[n] || '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => text(x[1]).trim());
const bare = (s) => s.replace(/\$/g, '').replace(/\s+/g, '').trim();
const num = (s) => Number(bare(s));
const den = (s) => Number(bare(s).match(/\\tfrac1\{?(\d+)\}?/)[1]);
const key = {};
{ const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2]; }

const PLACE = ['units', 'tens', 'hundreds'];
const solve = {
  1: o => o.map(num).map(v => v === unroman('XIV')),
  2: o => o.map(num).map(v => v === fromBase('1011', 2)),
  3: o => o.map(s => s === `no ${PLACE[String(305).length - 1 - String(305).indexOf('0')]}`),
  4: o => o.map(s => bare(s) === inBase(27, 5)),
  5: o => o.map(num).map(v => v === unroman('CDXLIV')),
  6: o => o.map(s => bare(s) === inBase(255, 2)),
  7: o => o.map(num).map(v => v === inBase(1000, 3).length),
  8: o => o.map(num).map(v => [...Array(6)].every((_, k) => (8 ** (k + 1)) % v === 1 % v) && v > 1),
  9: o => o.map(s => !exactIn(den(s), 10)),
  10: o => o.map(s => bare(s) === inBase(1000, 5)),
  11: o => o.map(num).map(v => v === fromBase('121', 5) - fromBase('121', 3)),
  12: o => o.map(num).map(v => v === [...Array(4 ** 3)].map((_, n) => n).filter(n => inBase(n, 4).length === 3).length),
  13: o => o.map(num).map(v => { const all = [...Array(7 ** 3)].map((_, n) => n).filter(n => inBase(n, 7).length === 3 && digitSum(n, 7) === 12); return all.every(n => n % v === 0); }),
  14: o => o.map(s => { const [a, b] = bare(s).split('to').map(Number); const four = [...Array(8 ** 5)].map((_, n) => n).filter(n => inBase(n, 8).length === 4); return a === four[0] && b === four[four.length - 1]; }),
  15: o => o.map(num).map(v => v === 2 * 360 + 0 * 20 + 5),
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Q${q}: the right option`, right, [key[q]]);
}
// the counter-examples the key prints for Q13
ok('Q13: 606 and 156 in base 7', [fromBase('606', 7), fromBase('156', 7), digitSum(300, 7), digitSum(90, 7)], [300, 90, 12, 12]);
is('Q13: 300 not divisible by 7 or 9, 90 not by 12', 300 % 7 && 300 % 9 && 90 % 12);

// assertion-reason: [A true, R true, R explains A]
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  16: [[...Array(5000)].every((_, n) => !inBase(n, 9).includes('9')), [0, 1, 2, 3].every(k => 9 * 9 ** k === 9 ** (k + 1)), true],
  17: [fromBase('100', 6) === 36, new Set([...Array(1000)].flatMap((_, n) => [...inBase(n, 6)])).size === 6, false],
  18: [exactIn(4, 6), primes(6).length === 1 && primes(6)[0] === 2, false],
  19: [fromBase('1000', 2) === 1000, fromBase('1000', 2) === 8, false],
};
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-19', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(19)].map((_, i) => i + 1));

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
for (const m of answersMd.slice(answersMd.indexOf('as the key prints it')).slice(0, 400).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2];
ok('ANSWERS.md key matches the page', mdKey, key);

// ANSWERS.md, the body's own questions, read back out of the file
for (const m of answersMd.matchAll(/\$(\d[\d\\, ]*)\$ = \*\*([IVXLCDM]+)\*\*/g)) ok(`ANSWERS.md: ${m[1]} in Roman`, roman(Number(m[1].replace(/\D/g, ''))), m[2]);
for (const m of answersMd.matchAll(/\b([IVXLCDM]{2,}) = \$[^$]*\$ = \*\*(\d+)\*\*/g)) ok(`ANSWERS.md: ${m[1]}`, unroman(m[1]), Number(m[2]));
ok('3.1 Q1: Gumulgal 7, 8, 11', [7, 8, 11].map(n => [...Array(Math.floor(n / 2)).fill('ukasar'), ...(n % 2 ? ['urapon'] : [])].join('-')), ['ukasar-ukasar-ukasar-urapon', 'ukasar-ukasar-ukasar-ukasar', 'ukasar-ukasar-ukasar-ukasar-ukasar-urapon']);
for (const g of ['ukasar-ukasar-ukasar-urapon', 'ukasar-ukasar-ukasar-ukasar**', 'ukasar-ukasar-ukasar-ukasar-ukasar-urapon']) printed('md', g);
{ const name = (n) => { let s = ''; while (n > 0) { n--; s = String.fromCharCode(97 + n % 26) + s; n = Math.floor(n / 26); } return s; };
  ok('3.1 Q4: aa, az, ba', [name(27), name(52), name(53)], ['aa', 'az', 'ba']); }
ok('3.1 Q6: 100 in circles of five', 100 / 5, 20);
printed('md', '100$ needs twenty circles');
ok('3.2 Q3', [unroman('LXXXVII') + unroman('LXXVIII'), roman(165)], [165, 'CLXV']);
printed('md', 'Total **CLXV**');
ok('3.2 Q4: products, none a landmark', [5 * 50, 50 * 500, 5 * 500, 7 * 9].map(p => LANDMARKS.includes(p)), [false, false, false, false]);
ok('3.2 Q4: CCL, MMD, LXIII', [roman(250), roman(2500), roman(63)], ['CCL', 'MMD', 'LXIII']);
ok('3.2 Q6', [roman(3888), roman(3888).length], ['MMMDCCCLXXXVIII', 15]);
ok('3.2 Q8: lengths', [1947, 2000, 2026].map(n => roman(n).length), [8, 2, 6]);
printed('md', '**MCMXLVII** (8 symbols), $2000$ = **MM** (2), $2026$ = **MMXXVI** (6)');
ok('3.3 Q1: Egyptian symbols', [1023, 2660, 70707].map(n => digitsIn(n, 10).reverse().map((d, i) => d ? `${d} ${eg[i]}` : '').filter(Boolean).reverse().join(', ')), ['1 lotuses, 2 arches, 3 strokes', '2 lotuses, 6 coils, 6 arches', '7 fingers, 7 coils, 7 strokes']);
for (const s of ['1 lotus, 2 arches, 3 strokes', '2 lotuses, 6 coils, 6 arches', '7 fingers, 7 coils, 7 strokes']) printed('md', s);
ok('3.3 Q2: base-5 digits', [15, 137, 293].map(n => digitsIn(n, 5)), [[3, 0], [1, 0, 2, 2], [2, 1, 3, 3]]);
for (const s of ['**three 5s**', '**one 125, two 5s, two 1s**', '**two 125s, one 25, three 5s, three 1s**']) printed('md', s);
ok('3.3 Q3: base-7 landmarks', [0, 1, 2, 3, 4, 5].map(k => 7 ** k).join(', '), '1, 7, 49, 343, 2401, 16807');
printed('md', '$1, 7, 49, 343, 2401, 16807$');
ok('3.3 Q6: 18 and 90 in base 5', [inBase(18, 5), inBase(90, 5)], ['33', '330']);
ok('3.3 Q7: symbols in base 5 and 10', [digitSum(324, 5), digitSum(324), digitSum(99), digitSum(99, 5)], [12, 9, 18, 11]);
ok('3.4 Q1: places of sixty', [63, 132, 200, 3605, 3600, 7261].map(places60), [[1, 3], [2, 12], [3, 20], [1, 0, 5], [1, 0, 0], [2, 1, 1]]);
ok('3.4 Q2: pairs that look alike', [places60(120), places60(300)], [[2, 0], [5, 0]]);
ok('3.4 Q4: 77 and 361 in Mayan places', [maya(77), bars(17), maya(361)], [[0, 0, 3, 17], '3 bars and 2 dots', [0, 1, 0, 1]]);
printed('md', 'units **three bars and two dots**');
ok('3.4 Q6 and 3.5 Q12: factors', [factors(60).join(', '), factors(10).join(', ')], ['1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60', '1, 2, 5, 10']);
printed('md', '$1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60$');
ok('T and R: 41 in uprights, misread', [4 + 1, 4 * 100 + 1], [5, 401]);
ok('3.5 Q2: 305 without its zero', Number('305'.replace('0', '')), 35);
ok('3.5 Q3: three thousand and five', [digitSum(3005), roman(3005), String(3005).length], [8, 'MMMV', 4]);
ok('3.5 Q3: four-digit digit sums range', [Math.min(...[...Array(9000)].map((_, i) => digitSum(i + 1000))), Math.max(...[...Array(9000)].map((_, i) => digitSum(i + 1000)))], [1, 36]);
ok('3.5 Q4: 10 in Hindu and Egyptian marks', [String(10).length, digitSum(10)], [2, 1]);
ok('3.5 Q6: 25 in bases 8, 5, 2', [inBase(25, 8), inBase(25, 5), inBase(25, 2)], ['31', '100', '11001']);
for (const s of ['**$31$** in base 8', '**$100$** in base 5', '**$11001$** in base 2']) printed('md', s);
ok('3.5 Q11: 1 to 10 in base 3, and 2025', [[...Array(10)].map((_, i) => inBase(i + 1, 3)).join(', '), inBase(2025, 3)], ['1, 2, 10, 11, 12, 20, 21, 22, 100, 101', '2210000']);
printed('md', '$1, 2, 10, 11, 12, 20, 21, 22, 100, 101$');
printed('md', '**$2210000$**');
ok('3.5 Q13: 10, 16, 100 in base 2', [10, 16, 100].map(n => inBase(n, 2)), ['1010', '10000', '1100100']);
printed('md', '$10$ is **$1010$**, $16$ is **$10000$** and $100$ is **$1100100$**');
// Stage 1 and practice as ANSWERS.md prints them
for (const s of ['$1000 = 4344_{6}$', '$2025 = 11111101001_{2}$', '$48 = 66_{7}$', '$212 = 1322_{5}$', '$123$, $7203$, $7380$, $432003$']) printed('md', s);
is('ANSWERS.md Stage 1 values hold', inBase(1000, 6) === '4344' && inBase(2025, 2) === '11111101001' && inBase(48, 7) === '66' && inBase(212, 5) === '1322');
for (const [n, b, s] of [[27, 5, '102'], [255, 2, '11111111'], [1000, 5, '13000'], [45, 2, '101101'], [500, 4, '13310'], [20, 2, '10100']]) {
  ok(`ANSWERS.md: ${n} in base ${b}`, inBase(n, b), s); printed('md', s);
}
ok('ANSWERS.md Q14 ends', [fromBase('1000', 8), fromBase('7777', 8)], [512, 4095]);
ok('ANSWERS.md Q31', [fromBase('101100', 2), fromBase('011111', 2), fromBase('110010', 2)], [44, 31, 50]);
printed('md', 'X $= 44$, Y $= 31$, Z $= 50$');
printed('md', `${hms(3725)}; Q: ${hms(5400)}; R: ${hms(7384)}`);

/* ---- report ---------------------------------------------------- */

console.log(`A  ${spans} identities evaluated; ${skipped.length} spans not pure arithmetic, skipped`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
