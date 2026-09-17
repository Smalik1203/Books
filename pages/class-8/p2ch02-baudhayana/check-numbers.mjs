#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed — squares, roots, searches, the triple machine — and compared
   with what is on the page.

     node pages/class-8/p2ch02-baudhayana/check-numbers.mjs [--skipped]

   Four parts:
     A  every identity set as maths, on every page and in ANSWERS.md, whose
        sides evaluate to numbers; every printed trap a < sqrt(n) < b
     B  the claims A cannot check: searches, classifications, the answers
        of the worked examples and the practice, read back off the page
     C  every multiple-choice and assertion-reason question: exactly one
        option is right, and it is the one the key prints
     D  ANSWERS.md prints the same key as the page

   Display maths ($$ ... $$) is taken out before inline maths ($ ... $),
   or the pair of dollars is read as an empty span and the text between two
   displays is read as maths.

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

const isSquare = (n) => Number.isInteger(n) && n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const isTriple = ([a, b, c]) => Math.abs(a * a + b * b - c * c) < 1e-9;
const primitive = (t) => t.reduce(gcd) === 1;
const machine = (m, n) => [m * m - n * n, 2 * m * n, m * m + n * n];
const hyp = (a, b) => Math.sqrt(a * a + b * b);
const leg = (c, a) => Math.sqrt(c * c - a * a);
const near = (x, y, eps = 1e-9) => Math.abs(x - y) < eps;
const r = (x, d = 6) => Number(x.toFixed(d));
// every triple with all three numbers at most N, smaller legs first
const triplesUpTo = (N) => { const o = []; for (let a = 1; a <= N; a++) for (let b = a; b <= N; b++) { const c = Math.sqrt(a * a + b * b); if (Number.isInteger(c) && c <= N) o.push([a, b, c]); } return o; };

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/\s+/g, ' ');

/* ---- A. every identity ---------------------------------------- */

// every maths span in a source, display maths first
function mathSpans(src) {
  const out = [];
  const rest = src.replace(/\$\$([\s\S]+?)\$\$/g, (m, x) => { out.push({ span: x, before: '' }); return ' '; });
  for (const m of rest.matchAll(/\$([^$]+)\$/g)) out.push({ span: m[1], before: rest.slice(Math.max(0, m.index - 12), m.index) });
  return out;
}

// LaTeX to a JS expression, or null when a side is not pure arithmetic
function toExpr(side) {
  let s = side
    .replace(/[.,]\s*$/, '')
    .replace(/\\left|\\right/g, '')
    .replace(/\{,\}/g, '')
    .replace(/\\%/g, '')
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\[td]?frac(\d)(\d)/g, '(($1)/($2))')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'Math.sqrt($1)')
    .replace(/\\sqrt(\d)/g, 'Math.sqrt($1)')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad/g, '')
    .replace(/\^\{([^{}]+)\}/g, '**($1)').replace(/\^(\d)/g, '**$1')
    .replace(/\s+/g, '');
  if (!s || !/^(Math\.sqrt|[-+*/().0-9])+$/.test(s)) return null;
  s = s.replace(/\)\(/g, ')*(');
  return s;
}
const evalExpr = (e) => { try { return Function(`"use strict";return (${e})`)(); } catch { return NaN; } };

let spans = 0, traps = 0; const skipped = [];
const sources = [...pages.map(f => [f, html[f]]), ['ANSWERS.md', answersMd]];
for (const [f, src] of sources) {
  for (const { span, before } of mathSpans(src)) {
    // "a < sqrt(n) < b": a trap, checked by squaring the ends
    const t = span.match(/^\s*([\d.]+)\s*(?:<|\\lt)\s*\\sqrt\{?(\d+)\}?\s*(?:<|\\lt)\s*([\d.]+)\s*\.?\s*$/);
    if (t) { traps++; is(`${f}: trap $${span}$`, Number(t[1]) ** 2 < Number(t[2]) && Number(t[2]) < Number(t[3]) ** 2); continue; }
    if (!span.includes('=')) continue;
    for (const part of span.split(/\\qquad|,\s*\\ |,\s*(?:so|and)\s/)) {
      // "\sqrt{2} \approx 1 + ..." : the approximated side is the one after it
      let sides = part.split('=').map(s => s.replace(/\\;/g, ' ').split('\\approx').pop().trim()).filter(Boolean);
      if (sides.length < 2) continue;
      // "half of $200 = 100$" is a sentence about 200, not an identity
      if (/half of\s*$/.test(before) && sides.length === 2) sides = [`${sides[0]} \\div 2`, sides[1]];
      // "1.4142156\ldots": a truncated decimal, checked to its last digit
      const trunc = sides.map(s => s.match(/^([\d.]+)\\ldots\.?$/));
      const vals = sides.map((s, i) => (trunc[i] ? null : toExpr(s)));
      const numeric = vals.map((v, i) => [v, i]).filter(([v]) => v !== null);
      if (trunc.some(Boolean)) {
        const i = trunc.findIndex(Boolean), d = trunc[i][1].split('.')[1].length;
        if (!numeric.length) { skipped.push(`${f}: $${part.trim()}$`); continue; }
        const v = evalExpr(numeric[0][0]);
        spans++;
        is(`${f}: $${part.trim()}$ — ${v} does not begin ${trunc[i][1]}`, Math.floor(v * 10 ** d) / 10 ** d === Number(trunc[i][1]));
        continue;
      }
      if (numeric.length < 2) { skipped.push(`${f}: $${part.trim()}$`); continue; }
      const nums = numeric.map(([v]) => evalExpr(v));
      if (nums.some(n => !Number.isFinite(n))) { skipped.push(`${f}: $${part.trim()}$`); continue; }
      spans++;
      if (nums.some(n => Math.abs(n - nums[0]) > 1e-9)) fails.push(`${f}: $${part.trim()}$ — sides are ${nums.join(' and ')}`);
      else pass++;
    }
  }
}

/* ---- B. claims arithmetic alone does not check ---------------- */

// the body
is('Fig 2.1: doubling the side gives four times the area', (2 * 3) ** 2 === 4 * 3 ** 2);
ok('Fig 2.6: 9 + 16 = 25 unit squares', [3 * 3, 4 * 4, 5 * 5, isTriple([3, 4, 5])], [9, 16, 25, true]);
ok('p005: sqrt 2 to eight places', Math.floor(Math.SQRT2 * 1e8) / 1e8, 1.41421356);
ok('p006: sqrt 2 to seven places', Math.floor(Math.SQRT2 * 1e7) / 1e7, 1.4142135);
{ const b = 1 + 1 / 3 + 1 / 12 - 1 / 408;
  ok("p006: Baudhayana's value agrees to five places", Math.floor(b * 1e5), Math.floor(Math.SQRT2 * 1e5));
  is("p006: ...and not to six", Math.floor(b * 1e6) !== Math.floor(Math.SQRT2 * 1e6));
  // "about two parts in a million"
  ok('p006: error in millionths, rounded', Math.round((b - Math.SQRT2) * 1e6), 2);
  // "a fifth of a hair's breadth" on ten metres: 10 m x error, against a
  // hair taken as 0.1 mm thick
  ok("p006: ten-metre error as a share of a 0.1 mm hair, to one figure", Math.round(10 * (b - Math.SQRT2) * 1000 / 0.1 * 10) / 10, 0.2);
}
ok('Example 1', hyp(9, 12), 15);
is('Example 1: 15 is longer than 9 and 12, shorter than 21', 15 > 12 && 15 < 9 + 12);
ok('Example 2', leg(41, 40), 9);
ok('Example 3: depth', (() => { for (let x = 1; x < 100; x++) if (9 + x * x === (x + 1) ** 2) return x; })(), 4);
ok('Example 4: side of the rhombus', hyp(24 / 2, 70 / 2), 37);
// the body examples' Answer rows, read off the page
{ const bodyAns = {};
  for (const m of body.matchAll(/c-example__tab">Example (\d+)<\/div>([\s\S]*?)<span class="work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) bodyAns[m[1]] = text(m[3]).replace(/\$/g, '');
  const want = { 1: hyp(9, 12), 2: leg(41, 40), 3: (() => { for (let x = 1; x < 100; x++) if (9 + x * x === (x + 1) ** 2) return x; })(), 4: hyp(12, 35) };
  ok('body has 4 stepped examples', Object.keys(bodyAns).length, 4);
  for (const [n, v] of Object.entries(want)) is(`body Example ${n} should answer ${v}: "${bodyAns[n]}"`, new RegExp(`(^|\\D)${v}(\\D|$)`).test(bodyAns[n] || ''));
  // the step rows that state the unknown
  const plain = text(body).replace(/\$/g, '');
  for (const s of [`b = ${leg(41, 40)} m`, `x = ${want[3]}`, `c = \\sqrt{225} = ${hyp(9, 12)}`, `s = \\sqrt{1369} = ${hyp(12, 35)}`]) is(`body prints "${s}"`, plain.includes(s));
}
// Stage 1's stated results, read off the page
{ const plain = text(beyond).replace(/\$/g, '');
  for (const s of ['so a = 28', 'The sides are 28 and 45', '(28, 45, 53)', 'the tops are 13 m apart', 'so 7 m out', 'so 20 m up', 'The top has come down 4 m', 'd = 61 cm', 'd \\approx 141.4 m', 'about 29\\%'])
    is(`Stage 1 prints "${s}"`, plain.includes(s)); }
ok('2.6.1: 13, 84, 85 and 9, 12, 16', [isTriple([13, 84, 85]), isTriple([9, 12, 16]), isTriple([9, 12, 15])], [true, false, true]);
ok('2.6.2: the hall', Math.sqrt(4 ** 2 + 3 ** 2 + 12 ** 2), 13);
ok('2.6.2: triples on the way', [isTriple([3, 4, 5]), isTriple([5, 12, 13])], [true, true]);
ok('2.7: side of 1 and 2', hyp(1, 2), Math.sqrt(5));
{ const list = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [12, 35, 37], [15, 36, 39]];
  is('2.7: all six are triples', list.every(isTriple));
  ok('2.7: five of the six are primitive', list.filter(primitive).length, 5);
  ok('2.7: (15, 36, 39) / 3', [15, 36, 39].map(x => x / 3), [5, 12, 13]);
  ok('2.7: a cord of twelve lengths', 3 + 4 + 5, 12);
  ok('2.7: multiples of (3, 4, 5)', [[6, 8, 10], [9, 12, 15], [30, 40, 50]].map(isTriple), [true, true, true]);
  // the machine: the five pairs make exactly the five primitive triples
  const made = [[2, 1], [3, 2], [4, 1], [4, 3], [6, 1]].map(([m, n]) => machine(m, n));
  ok('2.7: what the machine makes', made, [[3, 4, 5], [5, 12, 13], [15, 8, 17], [7, 24, 25], [35, 12, 37]]);
  const key = (t) => [...t].sort((a, b) => a - b).join();
  ok('2.7: every primitive triple on the list, from the machine', made.map(key).sort(), list.filter(primitive).map(key).sort());
  is('2.7: the machine always makes a triple (m, n up to 40)', [...Array(40)].every((_, m) => [...Array(m)].every((_, n) => n === 0 || isTriple(machine(m, n)))));
}
// dates (sources are logged in EDIT-LOG.md)
ok('Wiles: ten in 1963, forty-one in 1994', [1963 - 1953, 1994 - 1953], [10, 41]);
ok('twenty-eight centuries since 800 BCE, to the nearest', Math.round((2026 + 800) / 100), 28);

// Stage 1, read back off the page
ok('S1 Q1', [200 / 2, Math.sqrt(100)], [100, 10]);
ok('S1 Q2', [hyp(11, 60), 61 ** 2], [61, 3721]);
ok('S1 Q3', [isTriple([12, 16, 20]), 12 * 16 / 2, [12, 16, 20].map(x => x / 4)], [true, 96, [3, 4, 5]]);
{ const foot = leg(25, 24), h2 = leg(25, foot + 8);
  ok('S1 Q4', [foot, foot + 8, h2, 24 - h2, (24 - h2) * 2], [7, 15, 20, 4, 8]); }
ok('S1 Q5', [2 ** 10, Math.sqrt(2 ** 10)], [1024, 32]);
ok('S1 Q6', [hyp(12, 12 - 7), hyp(12, 107 - 102)], [13, 13]);
ok('S1 Q7: sides differing by 17 with hypotenuse 53', (() => { for (let a = 1; a < 53; a++) if (a * a + (a + 17) ** 2 === 53 * 53) return [a, a + 17]; })(), [28, 45]);
ok('S1 Q7: from the machine', machine(7, 2), [45, 28, 53]);
{ const d = hyp(100, 100);
  ok('S1 Q8', [Math.sqrt(10000), r(d, 1), r(200 - r(d, 1), 1), Math.round(58.6 / 200 * 100)], [100, 141.4, 58.6, 29]);
  ok('S1 Q8: the share saved, for any square', Math.round((1 - Math.SQRT2 / 2) * 100), 29);
  ok('S1 Q8: a hectare', 100 * 100, 10000); }
is('S1: the intro says most questions mention no right angle — only one of eight does', (() => {
  const tries = [...beyond.matchAll(/<div class="c-try">([\s\S]*?)<\/div>/g)].map(m => text(m[1]));
  return tries.length === 8 && tries.filter(t => /right[- ]angle/.test(t)).length <= 2;
})());

// Solved examples: each Answer row, read off the page, against a computation
const exAnswer = {};
for (const m of beyond.matchAll(/c-example__tab">Example (\d+)<\/div>([\s\S]*?)<span class="work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) exAnswer[m[1]] = text(m[3]).replace(/\$/g, '');
const exSays = (n, ...vals) => { for (const v of vals) is(`Example ${n} should say ${v}: "${exAnswer[n]}"`, new RegExp(`(^|[^\\d.])${String(v).replace('.', '\\.')}([^\\d]|$)`).test(exAnswer[n] || '')); };
ok('Beyond has 16 examples', Object.keys(exAnswer).length, 16);
exSays(1, Math.sqrt(2 * 18), Math.sqrt(18 / 2));
exSays(2, 5 * 5, Math.sqrt(49));
{ const trap = (n, d) => { const lo = Math.floor(Math.sqrt(n) * 10 ** d) / 10 ** d; return [lo, r(lo + 10 ** -d, d)]; };
  exSays(3, ...trap(3, 1), ...trap(3, 2));
  exSays(4, ...trap(2 * 9, 2)); }
exSays(5, hyp(20, 48));
exSays(6, r(hyp(1.2, 0.5)));
exSays(7, leg(65, 16));
exSays(8, r(leg(8.9, 3.9)));
exSays(9, 33, 56, 65);
ok('Example 9', [isTriple([33, 56, 65]), isTriple([6, 7, 9])], [true, false]);
is('Example 9 says the other is not', /other is not/.test(exAnswer[9]));
ok('Example 10', [isTriple([60, 80, 99]), hyp(60, 80)], [false, 100]);
exSays(10, hyp(60, 80));
exSays(11, Math.sqrt(2 ** 2 + 3 ** 2 + 6 ** 2));
ok('Example 11: the base diagonal is not whole', isSquare(13), false);
exSays(12, leg(51, 24) + leg(40, 24));
ok('Example 12: BD and CD', [leg(51, 24), leg(40, 24)], [45, 32]);
ok('Example 13', [isTriple([27, 36, 45]), primitive([27, 36, 45]), [27, 36, 45].reduce(gcd)], [true, false, 9]);
exSays(13, 9);
{ const k = 111 / 37; exSays(14, ...[12, 35, 37].map(x => k * x)); is('Example 14 is a triple', isTriple([36, 105, 111])); }
exSays(15, ...machine(8, 3));
{ const found = []; for (let m = 2; m < 20; m++) for (let n = 1; n < m; n++) { const t = machine(m, n); if (t[0] === 13 && t[1] === 84 && t[2] === 85) found.push([m, n]); }
  ok('Example 16: the only m, n', found, [[7, 6]]); exSays(16, 7, 6);
  ok('Example 16: pairs with product 42', [[42, 1], [21, 2], [14, 3], [7, 6]].map(([a, b]) => [a * b, a * a + b * b]), [[42, 1765], [42, 445], [42, 205], [42, 85]]); }

// the practice answers, read back out of the key rather than typed here
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= text(m[2]).replace(/\$/g, '');
const row = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const x = keyRows[n] || '';
  if (!part) return x;
  const m = x.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\) |$)`));
  return m ? m[1] : '';
};
const says = (q, ...vals) => { for (const v of vals) is(`key ${q} should say ${v}: "${row(q)}"`, new RegExp(`(^|[^\\d.])${String(v).replace('.', '\\.')}([^\\d]|$)`).test(row(q))); };
says(22, 98 / 2, Math.sqrt(98 / 2));
says(23, r(hyp(1.6, 6.3)));
is('key 24 says No, and 7', /^\s*No\b/.test(row(24)) && [21, 28, 35].reduce(gcd) === 7 && /\b7\b/.test(row(24)));
says(25, leg(65, 25));
says(26, ...machine(9, 2));
says(27, Math.sqrt(2 * 72));
says(28, Math.floor(Math.sqrt(7) * 10) / 10, Math.ceil(Math.sqrt(7) * 10) / 10);
{ const x = (() => { for (let x = 1; x < 32; x++) if (x * x + 256 === (32 - x) ** 2) return x; })(); says(29, x, 32 - x, 64 * x); }
{ const b = (() => { for (let b = 1; b < 500; b++) if ((b + 2) ** 2 === b * b + 196) return b; })(); says(30, b, b + 2); }
{ const D = Math.sqrt(64 + 81 + 144), d = Math.sqrt(64 + 81);
  says(31, D, Math.floor(d), Math.ceil(d));
  ok('Q31: the pencil', [16 > d, 16 <= D], [true, true]);
  is('key 31 says cannot lie flat', /cannot lie flat/.test(row(31))); }
{ const cords = { P: [15, 20, 25], Q: [10, 12, 16], R: [24, 32, 40] };
  const right = Object.entries(cords).filter(([, t]) => isTriple(t)).map(([k]) => k);
  ok('Q32 (a): the right-angled cords', right, ['P', 'R']);
  is('key 32 (a): P and R a right angle, Q not', /P:.*a right angle; Q:.*no right angle; R:.*a right angle/.test(row('32a')));
  says('32b', cords.P.reduce((a, b) => a + b));
  says('32c', cords.P[0] / 3, cords.R[0] / 3); }
{ const scr = { A: [40, 30], B: [80, 60], C: [48, 20] };
  says('33a', ...Object.values(scr).map(([w, h]) => hyp(w, h)));
  says('33b', 80 * 60, 40 * 30);
  ok('Q33 (b): twice and four times', [hyp(80, 60) / hyp(40, 30), 80 * 60 / (40 * 30)], [2, 4]);
  says('33c', leg(65, 25)); }

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] = m[2];
const optsOf = (n) => [...(qs[n] || '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => text(x[1]).trim());
const num = (s) => Number(s.replace(/\$|m$|\s/g, '').replace(/m$/, ''));
const tup = (s) => s.replace(/[$()\s]/g, '').split(',').map(Number);
const key = {};
{ const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2]; }

const solve = {
  1: o => o.map(num).map(v => v === 2 * 9),
  2: o => o.map(num).map(v => v === 32 / 2),
  3: o => o.map(tup).map(isTriple),
  4: o => o.map(s => { const f = { '(3a, 3b, 3c)': t => t.map(x => 3 * x), '(a+1, b+1, c+1)': t => t.map(x => x + 1), '(a^2, b^2, c^2)': t => t.map(x => x * x), '(a-1, b-1, c-1)': t => t.map(x => x - 1) }[s.replace(/\$/g, '')];
    return !!f && [[3, 4, 5], [5, 12, 13], [8, 15, 17]].every(t => isTriple(f(t))); }),
  5: o => o.map(num).map(v => v === hyp(16, 30)),
  6: o => o.map(num).map(v => near(v, leg(5, 1.4))),
  7: o => o.map(num).map(v => v === 60 + 80 - hyp(60, 80)),
  8: o => o.map(s => s === '$3$'),
  9: o => o.map(tup).map(t => JSON.stringify(t) === JSON.stringify(machine(5, 3))),
  10: o => o.map(s => (/not enough/.test(s) ? !isTriple([20, 99, 101]) : num(s) === 20 * 99 / 2 && isTriple([20, 99, 101]))),
  11: o => o.map(num).map(v => v === 10 * 10 / 2),
  12: o => o.map(num).map(v => v === hyp(15, 20)),
  13: o => o.map(s => s.match(/\d+/g).map(Number)).map(([a, b]) => a * a + b * b === 53 * 53),
  14: o => o.map(s => { const cs = triplesUpTo(60).map(t => t[2]); return { 'always odd': cs.every(c => c % 2), 'always even': cs.every(c => !(c % 2)), 'sometimes odd, sometimes even': cs.some(c => c % 2) && cs.some(c => !(c % 2)), 'always prime': false }[s]; }),
  15: o => o.map(num).map(v => v === 5 * 5 + 5 * 5),
  16: o => o.map(s => /four copies of a triangle, and two copies make the old square/.test(s)),
  17: o => o.map(tup).map(t => !isTriple(t)),
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Q${q}: the right option`, right, [key[q]]);
}
// Q16 is a reason, not a number: the other three are checked false here
is('Q16: the diagonal is not twice the side', !near(Math.SQRT2, 2));
is('Q16: doubling a length does not double an area', (2 * 1) ** 2 !== 2 * 1 ** 2);
// Q14: the one false claim, checked
is('Q14: c is not always prime (10)', isTriple([6, 8, 10]));

// assertion-reason: [A true, R true, R explains A]
const arLetter = ([a, rr, x]) => (a && rr ? (x ? 'a' : 'b') : a ? 'c' : rr ? 'd' : 'e');
const AR = {
  18: [!isTriple([6, 7, 10]), true, true],
  19: [isTriple([30, 72, 78]), triplesUpTo(80).every(primitive), false],
  20: [2 * 4 * 4 === 16, true, false],
  21: [2.2 ** 2 < 5 && 5 < 2.3 ** 2, near(hyp(1, 2), Math.sqrt(5)), false],
};
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
ok('Q19: (30, 72, 78) is 6 times (5, 12, 13)', [30, 72, 78].map(x => x / 6), [5, 12, 13]);
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 4));
ok('key covers 1-21', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(21)].map((_, i) => i + 1));
ok('practice numbered 1-33 with no repeats', Object.keys(qs).map(Number).sort((a, b) => a - b), [...Array(33)].map((_, i) => i + 1));

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
const mdLine = answersMd.slice(answersMd.indexOf('as the key prints it'));
for (const m of mdLine.slice(0, 300).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2];
ok('ANSWERS.md key matches the page', mdKey, key);

// ANSWERS.md: body exercise claims A cannot see. Where a value is printed in
// bold it is read back out of the file, not typed here.
const mdSection = (head) => { const i = answersMd.indexOf(head); return answersMd.slice(i, answersMd.indexOf('\n## ', i + 1)); };
const bold = (s) => [...s.matchAll(/\*\*([^*]+)\*\*/g)].map(m => m[1]);
ok('Ex 2.1 Q2', bold(mdSection('### Exercise Set 2.1'))[0], [1, 2, 3, 4].map(k => 2 ** k).join(', '));
ok('Ex 2.1 Q4: diagonal square beats side 7 by', 2 * 25 - 49, 1);
ok('Ex 2.1 Q5', [64 / 2, 64 / 4], [32, 16]);
ok('Ex 2.1 Q6: which sides are whole', [100, 200, 400].map(isSquare), [true, false, true]);
ok('Ex 2.1 Q6: sqrt 200 between', [Math.floor(Math.sqrt(200) * 10) / 10, Math.ceil(Math.sqrt(200) * 10) / 10], [14.1, 14.2]);
ok('Ex 2.2 Q1', [hyp(6, 8), hyp(5, 12), hyp(9, 40), hyp(1, 1)], [10, 13, 41, Math.SQRT2]);
ok('Ex 2.2 Q2', [leg(10, 6), leg(25, 7), leg(17, 15)], [8, 24, 8]);
ok('Ex 2.2 Q3', [Math.floor(Math.sqrt(50) * 100) / 100, hyp(9, 12)], [7.07, 15]);
ok('Ex 2.2 Q4', [leg(13, 5), leg(13, 12)], [12, 5]);
{ const t = [[8, 15, 17], [7, 8, 11], [20, 21, 29], [4, 5, 6]];
  ok('Ex 2.2 Q6', t.map(isTriple), [true, false, true, false]);
  const md = mdSection('### Exercise Set 2.2');
  ok('Ex 2.2 Q6 in ANSWERS.md', ['(a)', '(b)', '(c)', '(d)'].map(p => /\*\*right-angled\*\*/.test(md.slice(md.indexOf(`${p} $${t['abcd'.indexOf(p[1])][0]}^2`)).split(/\n\s*\([a-d]\)/)[0])), t.map(isTriple)); }
{ const t = [[9, 12, 15], [4, 5, 6], [20, 21, 29], [10, 24, 26]];
  ok('Ex 2.3 Q1', t.map(isTriple), [true, false, true, true]); }
{ const all = triplesUpTo(20);
  const shown = (s) => [...s.matchAll(/\((\d+), (\d+), (\d+)\)/g)].map(m => [+m[1], +m[2], +m[3]]);
  const md = mdSection('### Exercise Set 2.3');
  const q2 = md.slice(md.indexOf('\n2. '), md.indexOf('\n3. '));
  const [list, prim] = bold(q2);
  const byC = (xs) => [...xs].sort((p, q) => p[2] - q[2] || p[0] - q[0]);
  ok('Ex 2.3 Q2: every triple up to 20', byC(shown(list)), byC(all));
  ok('Ex 2.3 Q2: the primitive ones', shown(prim), all.filter(primitive));
  ok('Ex 2.3 Q2: the others are 2, 3 and 4 times (3, 4, 5)', all.filter(t => !primitive(t)).map(t => t[0] / 3), [2, 3, 4]); }
ok('Ex 2.3 Q3', [machine(5, 2), machine(5, 4)], [[21, 20, 29], [9, 40, 41]]);
is('Ex 2.3 Q4: no triple of three odd numbers up to 200', triplesUpTo(200).every(t => t.some(x => x % 2 === 0)));
ok('Ex 2.3 Q4: the worked instance', [9 + 25, isSquare(34)], [34, false]);
is('ANSWERS.md S1 results match the page', /\(1\) 10 cm; \(2\) diagonal 61 cm, and\s+the square on it 3721 cm²; \(3\) 96; \(4\) 4 m; \(5\) area 1024, side 32;\s+\(6\) 13 m; \(7\) 28 and 45; \(8\) about 58\.6 m, about 29%/.test(answersMd));
{ const md = answersMd.slice(answersMd.indexOf('### Stage 2'), answersMd.indexOf('### Stage 3'));
  for (const [n, a] of Object.entries(exAnswer)) {
    const m = md.match(new RegExp(`\\(${n}\\) ([^;]*?)(?=;|\\.\\n|$)`));
    const nums = (s) => s.match(/\d+(\.\d+)?/g) || [];
    // every number the booklet prints for an example is one the page prints
    is(`ANSWERS.md Stage 2 (${n}) printed`, !!m);
    if (m) ok(`ANSWERS.md Stage 2 (${n}): numbers not on the page`, nums(m[1]).filter(x => !nums(a).includes(x)), []);
  }
}

/* ---- report ---------------------------------------------------- */

console.log(`A  ${spans} identities evaluated, ${traps} traps; ${skipped.length} spans not pure arithmetic, skipped`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
