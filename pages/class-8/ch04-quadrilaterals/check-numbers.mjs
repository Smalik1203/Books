#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed from the chapter's rules — angle sums, exterior angles,
   diagonal counts, the parallelogram properties, Pythagoras for the
   rhombus and rectangle questions — and compared with what is on the page
   or in ANSWERS.md, which is read back rather than retyped.

     node pages/class-8/ch05-quadrilaterals/check-numbers.mjs [--skipped]

   Four parts:
     A  every identity set as maths, on every page and in ANSWERS.md, whose
        sides all evaluate to numbers
     B  the claims A cannot check: counts, searches, tables, the body
        exercise answers in ANSWERS.md, the Beyond examples and the
        practice answers, read back out of the key one part at a time
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

const near = (a, b) => Math.abs(a - b) < 1e-9;
const angleSum = (n) => (n - 2) * 180;
const exterior = (n) => 360 / n;
const interior = (n) => 180 - 360 / n;
const diagonals = (n) => n * (n - 3) / 2;
const fromDiagonals = (d) => { for (let n = 3; n < 1000; n++) if (diagonals(n) === d) return n; return null; };
const fromSum = (s) => (s % 180 === 0 ? s / 180 + 2 : null);
const fromExterior = (e) => (Number.isInteger(360 / e) && 360 / e >= 3 ? 360 / e : null);
const fromInterior = (i) => fromExterior(180 - i);
const hyp = (a, b) => Math.sqrt(a * a + b * b);
const leg = (h, a) => Math.sqrt(h * h - a * a);
// the three-rod rule only: each side of a triangle is shorter than the other two together
const triangle = (a, b, c) => a < b + c && b < a + c && c < a + b;
// a diagonal x of quadrilateral with sides a, b on one side of it and c, d on the other
const diagonalFits = (a, b, c, d, x) => triangle(a, b, x) && triangle(c, d, x);
// four rods, the longest as DA and the diagonal BD: 20 < AB + BD and BD < BC + CD together need longest < the other three
const quadByTriangles = (rods) => { const s = [...rods].sort((a, b) => a - b);
  // is there any diagonal length making both triangles (s0, s3, x) and (s1, s2, x) possible?
  for (let x = 0.01; x < 200; x += 0.01) if (triangle(s[0], s[3], x) && triangle(s[1], s[2], x)) return true;
  return false; };
// solve a x + b = c x + d
const lin = (a, b, c, d) => (d - b) / (a - c);

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const md = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-')
  .replace(/\\circ/g, '').replace(/\^\s*/g, '^').replace(/\s+/g, ' ');

/* ---- A. every identity ---------------------------------------- */

function toExpr(side) {
  let s = side
    .replace(/\\left|\\right/g, '')
    .replace(/\^\{\\circ\}|\^\\circ/g, '')
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/(\d+)\\tfrac\{?(\d+)\}?\{?(\d+)\}?/g, '($1+$2/$3)')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad/g, '')
    .replace(/\^\{([^{}]+)\}/g, '**($1)').replace(/\^(\d)/g, '**$1')
    .replace(/\s+/g, '');
  if (!s || !/^[-+*/().0-9]+$/.test(s)) return null;
  return s.replace(/\)\(/g, ')*(').replace(/(\d)\(/g, '$1*(');
}
const evalExpr = (e) => { try { return Function(`"use strict";return (${e})`)(); } catch { return NaN; } };

let spans = 0; const skipped = [];
const sources = [...pages.map(f => [f, html[f]]), ['ANSWERS.md', md]];
let solved = 0;
for (const [f, src] of sources) {
  const all = [...src.matchAll(/\$\$?([^$]+)\$\$?/g)].map(m => m[1]);
  for (const [idx, span0] of all.entries()) {
    let span = span0;
    if (!span.includes('=')) continue;
    // an equation in one letter: put in the value the working goes on to
    // print for that letter (the next "x = 20"), and check it balances
    const letters = [...new Set((span.replace(/\\[a-z]+/g, '').match(/\b[nxyke]\b|(?<=\d)[nxyke]\b/g) || []))];
    // Example 2's 1500-degree case is a hypothetical with an n of its own; B checks it
    const HYPOTHETICAL = ['n - 2 = 8\\tfrac13'];
    if (letters.length === 1 && !/^\s*[nxyke]\s*=\s*[\d.]+\s*$/.test(span) && !HYPOTHETICAL.includes(span.trim())) {
      const v = letters[0];
      // the nearest such span, within a few spans either side
      const re = new RegExp(`^\\s*${v}\\s*=\\s*([\\d.]+)\\s*$`);
      let val = null;
      for (let d = 1; d <= 6 && !val; d++) val = (all[idx + d] || '').match(re) || (all[idx - d] || '').match(re);
      if (val) {
        span = span.replace(new RegExp(`(\\d)${v}\\b`, 'g'), `$1*(${val[1]})`).replace(new RegExp(`\\b${v}\\b`, 'g'), `(${val[1]})`);
        solved++;
      }
    }
    const sides = span.split('=').map(s => s.trim()).filter(Boolean);
    if (sides.length < 2) continue;
    let vals = sides.map(toExpr);
    // "angle A = 70 = ..." : check the numeric sides against each other
    if (vals.filter(v => v !== null).length >= 2) vals = vals.filter(v => v !== null);
    if (vals.some(v => v === null) || vals.length < 2) { skipped.push(`${f}: $${span0.trim()}$`); continue; }
    const nums = vals.map(evalExpr);
    if (nums.some(n => !Number.isFinite(n))) { skipped.push(`${f}: $${span0.trim()}$`); continue; }
    spans++;
    if (nums.some(n => Math.abs(n - nums[0]) > 1e-9)) fails.push(`${f}: $${span.trim()}$ — sides are ${nums.join(' and ')}`);
    else pass++;
  }
}
// "... = 110$, so $110^\circ$": the value restated after the working must be
// the value the working reached — an identity check alone cannot see it
for (const [f, src] of sources) {
  for (const m of src.matchAll(/= ([\d.]+)\$,? so (?:the \w+ is |each is )?\$([\d.]+)\^\\circ\$/g)) {
    is(`${f}: "= ${m[1]}, so ${m[2]}°" restates a different value`, m[1] === m[2]);
  }
}
// spans with a letter in them that still assert arithmetic
const bodyText = text(body);
ok('p003: 20-gon diagonals', diagonals(20), Number((bodyText.match(/twenty-sided figure has \$(\d+)\$/) || [])[1]));
ok('p003: quadrilateral and pentagon diagonals', [diagonals(4), diagonals(5)], [2, 5]);

/* ---- B. claims arithmetic alone does not check ---------------- */

// the body
{
  const names = ['triangle', 'quadrilateral', 'pentagon', 'hexagon', 'heptagon', 'octagon', 'nonagon', 'decagon'];
  for (const [i, nm] of names.entries()) {
    const m = body.match(new RegExp(`work__label--wide">${nm}</span>\\s*<span>\\$(\\d+)\\^\\\\circ\\$`));
    ok(`angle-sum table: ${nm}`, angleSum(i + 3), m ? Number(m[1]) : null);
  }
}
ok('p006 Example 1', 360 - (85 + 110 + 47), 118);
ok('p006 Example 2', fromSum(1440), 10);
ok('p006 Example 2: 1500 does not fit', fromSum(1500), null);
ok('p006 Example 2: n - 2 = 8 1/3', 1500 / 180, 8 + 1 / 3);
ok('p007 hexagon and pentagon angles', [angleSum(6) / 6, angleSum(5) / 5], [120, 108]);
ok('p008 decagon angle sum', angleSum(10), 1440);
ok('p008 hexagon turns', [exterior(6), interior(6)], [60, 120]);
ok('Example 3', [fromExterior(24), interior(15), angleSum(15), angleSum(15) / 15], [15, 156, 2340, 156]);
ok('Example 4', [360 / 25, fromExterior(25)], [14.4, null]);
ok('Example 4: whole numbers 1-90 dividing 360', [...Array(90)].map((_, i) => i + 1).filter(d => 360 % d === 0).length,
  { twenty_one: 21 }.twenty_one);
is('Example 4 prints "twenty-one"', /only twenty-one of them do/.test(bodyText));
ok('Example 5', [65, 180 - 65, 180 - 65, 65 + 115 + 65 + 115], [65, 115, 115, 360]);
ok('Example 6', [lin(3, 4, 5, -6), 3 * 5 + 4, 5 * 5 - 6], [5, 19, 19]);
ok('Example 7', hyp(16 / 2, 12 / 2), 10);
{ // the body examples' Answer rows, read back and re-derived
  const exs = [...body.matchAll(/c-example__tab">Example (\d+)<\/div>([\s\S]*?)(?=c-example__tab|$)/g)];
  ok('body has Examples 1-7 in order', exs.map(m => Number(m[1])), [1, 2, 3, 4, 5, 6, 7]);
  const ans = Object.fromEntries(exs.map(m => [m[1], text((m[2].match(/work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/) || [])[1] || '')]));
  const want = {
    1: [360 - (85 + 110 + 47)],
    2: [fromSum(1440)],
    3: [fromExterior(24), interior(fromExterior(24))],
    4: [360 / 25],
    5: [65, 180 - 65],
    6: [lin(3, 4, 5, -6), 3 * lin(3, 4, 5, -6) + 4],
    7: [hyp(16 / 2, 12 / 2)],
  };
  for (const [n, vals] of Object.entries(want)) mentions(`body Example ${n} Answer row`, ans[n] || '', ...vals);
  is('Example 4 answers No', /^\s*No\b/.test(ans[4] || ''));
}

// ANSWERS.md, read back set by set
const mdSet = (heading) => {
  const i = md.indexOf(heading);
  if (i < 0) return '';
  const rest = md.slice(i + heading.length);
  const j = rest.search(/\n##/);
  return j < 0 ? rest : rest.slice(0, j);
};
const mdItem = (heading, q) => {
  const set = mdSet(heading);
  const m = set.match(new RegExp(`\\n${q}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`));
  return m ? text(m[1]) : '';
};
// a part of an item: (i) ... up to the next (ii)
const mdPart = (heading, q, part) => {
  const t = mdItem(heading, q);
  const m = t.match(new RegExp(`\\(${part}\\)([^()]*(?:\\([^ivx][^()]*\\)[^()]*)*)`));
  return m ? m[1] : '';
};
function mentions(where, t, ...vals) {
  for (const v of vals) is(`${where} should say ${v}: "${t.slice(0, 160)}"`,
    new RegExp(`(^|[^\\d.])${String(v).replace('.', '\\.')}([^\\d.]|\\.(?!\\d)|$)`).test(t));
}
const S1 = '### Exercise Set 4.1', S2 = '### Exercise Set 4.2', S3 = '### Exercise Set 4.3';
const S4 = '### Exercise Set 4.4', S5 = '### Exercise Set 4.5', S6 = '### Exercise Set 4.6';
const R = ['i', 'ii', 'iii', 'iv'];

// 4.1
mentions('4.1 Q2', mdItem(S1, 2), 7, 14);
[6, 8, 10, 12].forEach((n, k) => mentions(`4.1 Q4 (${R[k]})`, mdPart(S1, 4, R[k]), diagonals(n)));
mentions('4.1 Q5', mdItem(S1, 5), fromDiagonals(35));
is('4.1 Q10: n(n-3) always even', [...Array(200)].every((_, n) => (n * (n - 3)) % 2 === 0));

// 4.2
[5, 8, 15, 100].forEach((n, k) => mentions(`4.2 Q1 (${R[k]})`, mdPart(S2, 1, R[k]), angleSum(n)));
[[70, 95, 105], [60, 60, 120], [90, 90, 58]].forEach((a, k) =>
  mentions(`4.2 Q2 (${R[k]})`, mdPart(S2, 2, R[k]), 360 - a.reduce((x, y) => x + y)));
[900, 1620, 2340].forEach((s, k) => mentions(`4.2 Q3 (${R[k]})`, mdPart(S2, 3, R[k]), fromSum(s)));
ok('4.2 Q3 (iv): 1000 fits no polygon', fromSum(1000), null);
is('4.2 Q3 (iv) says no polygon', /no polygon/.test(mdPart(S2, 3, 'iv')));
[8, 9, 12, 20].forEach((n, k) => mentions(`4.2 Q4 (${R[k]})`, mdPart(S2, 4, R[k]), interior(n)));
mentions('4.2 Q5', mdItem(S2, 5), ...[1, 2, 3, 4].map(k => k * 360 / 10));
mentions('4.2 Q6', mdItem(S2, 6), (360 - 120) / 3);
mentions('4.2 Q7', mdItem(S2, 7), fromInterior(150));
ok('4.2 Q8: 100, 100, 100 leaves', 360 - 300, 60);
mentions('4.2 Q10', mdItem(S2, 10), 144, 10, 11);
ok('4.2 Q10: 145 fits no regular polygon', fromInterior(145), null);
{ // nearest regular angles either side of 145
  const below = Math.max(...[...Array(200)].map((_, i) => i + 3).map(interior).filter(a => a < 145));
  const above = Math.min(...[...Array(200)].map((_, i) => i + 3).map(interior).filter(a => a > 145));
  ok('4.2 Q10: nearest below and above', [below, above], [interior(10), interior(11)]);
  ok('4.2 Q10: 147 3/11 and 32 8/11', [interior(11), exterior(11)], [147 + 3 / 11, 32 + 8 / 11]);
  is('4.2 Q10 prints 147 3/11', /147\\tfrac\{3\}\{11\}/.test(mdSet(S2)));
}

// 4.3
[4, 6, 10, 18].forEach((n, k) => mentions(`4.3 Q1 (${R[k]})`, mdPart(S3, 1, R[k]), exterior(n)));
[45, 30, 18, 5].forEach((e, k) => mentions(`4.3 Q2 (${R[k]})`, mdPart(S3, 2, R[k]), fromExterior(e)));
{ const ext = [65, 80, 70, 55]; const fifth = 360 - ext.reduce((a, b) => a + b);
  mentions('4.3 Q3', mdItem(S3, 3), fifth);
  // the answer list itself, in order — the check line after it repeats the numbers
  const list = (mdSet(S3).match(/\*\*(\$115[\s\S]*?)\*\*/) || [])[1] || '';
  ok('4.3 Q3: the five interior angles', (text(list).match(/\d+/g) || []).map(Number), [...ext, fifth].map(e => 180 - e)); }
mentions('4.3 Q4', mdItem(S3, 4), fromInterior(162));
ok('4.3 Q5: 7 and 130 fit nothing', [fromExterior(7), fromInterior(130)], [null, null]);
ok('4.3 Q6: octagon interior = 3 x exterior', interior(8), 3 * exterior(8));
is('4.3 Q6: only the octagon', [...Array(300)].map((_, i) => i + 3).filter(n => near(interior(n), 3 * exterior(n))).join() === '8');
mentions('4.3 Q7', mdItem(S3, 7), [...Array(300)].map((_, i) => i + 3).find(n => near(interior(n), 5 * exterior(n))));
mentions('4.3 Q8', mdItem(S3, 8), fromSum(2160));
ok('4.3 Q8: the exterior route', (2160 + 360) / 180, fromSum(2160));
ok('4.3 Q10: regular polygons that fill a point', [...Array(300)].map((_, i) => i + 3).filter(n => near(360 / interior(n), Math.round(360 / interior(n)))), [3, 4, 6]);

// 4.4
mentions('4.4 Q7', mdItem(S4, 7), 180 - 72);

// 4.5
[50, 90, 128, 37].forEach((a, k) => {
  const after = mdPart(S5, 1, R[k]).split(':').slice(1).join(':');
  ok(`4.5 Q1 (${R[k]}): the other three`, (after.match(/\d+/g) || []).map(Number), [180 - a, a, 180 - a]);
});
mentions('4.5 Q2', mdItem(S5, 2), 9, 5, 2 * (9 + 5));
mentions('4.5 Q3', mdItem(S5, 3), 2 * 180 / 5, 3 * 180 / 5);
mentions('4.5 Q4', mdItem(S5, 4), 2 * 7, 2 * 4);
{ const y = lin(2, 1, 1, 8); mentions('4.5 Q5', mdItem(S5, 5), y, 2 * y + 1); }
{ const a = (48 / 2 - 3) / 2; mentions('4.5 Q6', mdItem(S5, 6), a, a + 3); }

// 4.6
{ const s = hyp(5, 12); mentions('4.6 Q2', mdItem(S6, 2), s, 4 * s); }
mentions('4.6 Q3', mdItem(S6, 3), hyp(8, 15));
mentions('4.6 Q4', mdItem(S6, 4), 2 * leg(13, 10 / 2));
mentions('4.6 Q5', mdItem(S6, 5), 90, 45);
mentions('4.6 Q9', mdItem(S6, 9), 10);
{ // diagonals 6 and 8 at right angles, the 8 cut 4 + 4 and the 6 cut 2 + 4: sides
  const sides = [hyp(4, 2), hyp(4, 2), hyp(4, 4), hyp(4, 4)];
  ok('4.6 Q7: a kite, and not a rhombus', [sides[0] === sides[1] && sides[2] === sides[3], new Set(sides).size === 1], [true, false]);
  is('4.6 Q7 prints the instance', /6 cm and\s+8 cm/.test(mdItem(S6, 7)) && /2 cm and 4 cm/.test(mdItem(S6, 7))); }

// Stage 1
ok('Stage 1 Q1', [20 * 180, 20 * 180 - 360], [3600, angleSum(20)]);
ok('Stage 1 Q2: the only n with equal sums', [...Array(300)].map((_, i) => i + 3).filter(n => angleSum(n) === 360), [4]);
ok('Stage 1 Q3: 3, 4, 5, 20 will not close', quadByTriangles([3, 4, 5, 20]), false);
ok('Stage 1 Q3: 20 < 3 + 4 + 5 fails', [3 + 4 + 5, 20 < 3 + 4 + 5], [12, false]);
is('Stage 1 Q3 prints 20 < ... = 12', beyond.includes('$20 < AB + BC + CD = 3 + 4 + 5 = 12$'));
is('Stage 1 no longer states the four-rod rule', !/other three/.test(beyond.slice(0, beyond.indexOf('Solved Examples'))));
ok('Stage 1 Q4', [360 - 3 * 90, angleSum(5) - 4 * 90], [90, 180]);
{ // triangle, hexagon and two copies of what?
  const left = (360 - interior(3) - interior(6)) / 2;
  ok('Stage 1 Q7: the third polygon', [...Array(300)].map((_, i) => i + 3).filter(n => near(interior(n), left)), [4]);
}
{ const count = [...Array(360)].map((_, i) => i + 3).filter(n => Number.isInteger(interior(n))).length;
  ok('Stage 1 Q8: whole-number angles', count, 22);
  const divs = [...Array(360)].map((_, i) => i + 1).filter(d => 360 % d === 0);
  const pairs = divs.filter(d => d < 360 / d).map(d => `${d} \\times ${360 / d}`);
  ok('Stage 1 Q8: 12 pairs, 24 divisors', [pairs.length, divs.length, divs.length - 2], [12, 24, count]);
  const s1 = beyond.slice(0, beyond.indexOf('Solved Examples'));
  is('Stage 1 Q8 prints every pair', pairs.every(p => s1.includes(p)));
  is('Stage 1 Q8 prints the count', s1.includes('$12$ pairs, so $24$ of them') && s1.includes('$22$ values'));
  is('Stage 1 Q8: 7 and 16 do not divide 360', 360 % 7 !== 0 && 360 % 16 !== 0);
  is('Stage 1 Q8: after 18 x 20 the next divisor is 20', divs[divs.indexOf(18) + 1] === 20);
  is('Stage 1 Q8 no longer counts from prime powers', !/2\^3 \\times 3\^2/.test(s1)); }

// Solved Examples
ok('Ex 1', fromDiagonals(44), 11);
ok('Ex 2', [diagonals(9), diagonals(7), diagonals(9) - diagonals(7)], [27, 14, 13]);
{ const x = (angleSum(5) - 100) / 5; ok('Ex 3', [x, x + 10, x + 20, x + 30, x + 40], [88, 98, 108, 118, 128]); }
ok('Ex 4', angleSum(6) - 5 * 112, 160);
{ const fifth = angleSum(5) - (90 + 90 + 90 + 70); ok('Ex 5: the fifth angle', [90 + 90 + 90 + 70, fifth], [340, 200]); is('Ex 5: more than 180, so concave', fifth > 180); }
ok('Ex 6', [angleSum(16) / 16, interior(16)], [157.5, 157.5]);
ok('Ex 7', fromInterior(168), 30);
{ const x = 360 / 12; ok('Ex 8', [x, 2 * x, 3 * x].map(e => 180 - e), [150, 120, 90]); }
{ const e = 180 / 12; ok('Ex 9', [e, 360 / e, 11 * e], [15, 24, 165]); }
ok('Ex 10: opposite sides 5 and 8 differ', 5 !== 8, true);
ok('Ex 11', [70 + 110, 110 + 70, 70 + 110 + 70 + 110], [180, 180, 360]);
{ const x = lin(3, 10, 5, -30); ok('Ex 12', [x, 3 * x + 10, 5 * x - 30, 180 - (3 * x + 10)], [20, 70, 70, 110]); }
{ const k = 60 / 10; ok('Ex 13', [2 * k, 3 * k], [12, 18]); }
{ const x = lin(1, 3, 2, -1); ok('Ex 14', [x, 2 * (x + 3), 14 / 2], [4, 14, 7]); is('Ex 14: AC = BD, so a rectangle', 2 * (x + 3) === 14); }
{ const x = lin(2, 1, 1, 4); ok('Ex 15', [x, 2 * x + 1, x + 4, 2 * (2 * x + 1)], [3, 7, 7, 14]); }
ok('Ex 16', [(180 - 110) / 2, 90 - (180 - 110) / 2], [35, 55]);
ok('Ex 17', [(180 - 70) / 2, 180 - 90 - (180 - 70) / 2, 70 / 2], [55, 35, 35]);
{ // brace BD: triangle ABD (5, 7) and triangle BCD (6, 4)
  ok('Ex 18: 9, 11, 2', [9, 11, 2].map(x => diagonalFits(5, 7, 6, 4, x)), [true, false, false]);
  ok('Ex 18: the bounds', [5 + 7, 7 - 5, 6 + 4, 6 - 4], [12, 2, 10, 2]);
  is('Ex 18: 11 fails in BCD only', triangle(5, 7, 11) && !triangle(6, 4, 11));
  is('Ex 18: 2 lays ABD flat', 5 + 2 === 7); }
ok('Ex 19', [5 - 3, 5 - 2], [2, 3]);
{ // Beyond's examples read back: every Answer row must carry its value
  const exs = [...beyond.matchAll(/c-example__tab">Example (\d+)<\/div>([\s\S]*?)(?=c-example__tab|c-practice__head|$)/g)];
  ok('Beyond has Examples 1-19 in order', exs.map(m => Number(m[1])), [...Array(19)].map((_, i) => i + 1));
  const ans = Object.fromEntries(exs.map(m => [m[1], text((m[2].match(/work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/) || [])[1] || '')]));
  const want = { 1: [11], 2: [13], 3: [88, 98, 108, 118, 128], 4: [160], 5: [200], 6: [157.5], 7: [30], 8: [150, 120, 90], 9: [24, 165],
    12: [70, 110], 13: [12, 18], 14: [4, 14, 7], 15: [3, 14, 90], 16: [35, 55], 17: [55, 35], 18: [9, 11, 2] };
  is('Example 5 Answer says concave', /concave/.test(ans[5] || ''));
  for (const [n, vals] of Object.entries(want)) mentions(`Example ${n} Answer row`, ans[n] || '', ...vals);
}

// the practice answers, read back out of the key
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= text(m[2]);
const row = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const r = keyRows[n] || '';
  if (!part) return r;
  const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\)|$)`));
  return m ? m[1] : '';
};
const says = (q, ...vals) => mentions(`key ${q}`, row(q), ...vals);
says(20, 15 - 3, 15 - 2);
says(21, angleSum(22));
says(22, 180 - 64, 64);
says(23, fromSum(3060));
says(24, fromInterior(171));
{ const x = (38 / 2 - 7) / 3; says(25, x, 2 * x + 3, x + 4); }
{ const y = lin(3, -2, 2, 5); says(26, y, 3 * y - 2, (3 * y - 2) / 2); }
{ const i = (180 + 160) / 2, e = 180 - i, n = fromExterior(e); says(27, i, e, n, angleSum(n)); }
says(28, 30 / 2, 16 / 2, 90, 180 - 90 - 28);
says('29a', 90, 37, 180 - 90 - 37);
says('29c', 6 - 3, 6 - 2);
{ const t = { A: 120, B: 95, C: 110, D: 105 }; const E = angleSum(5) - Object.values(t).reduce((a, b) => a + b);
  says('30a', E);
  const ext = [...Object.values(t), E].map(a => 180 - a);
  says('30b', ...ext, ext.reduce((a, b) => a + b));
  const most = Math.max(...ext);
  says('30c', most);
  is(`key 30c names B, the corner with the largest turn: "${row('30c')}"`, ext.indexOf(most) === 1 && /\bB\b/.test(row('30c'))); }
says('31a', 40, 25, 2 * (40 + 25));
says('31b', 180 - 65, 65);
says('31c', 90, 2 * (40 + 25));

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) {
  if (!m[1] && !/c-practice__num/.test(beyond.slice(Math.max(0, m.index - 300), m.index))) continue;
  qs[Number(m[1] || 1)] = m[2];
}
const optsOf = (n) => [...(qs[n] || '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => text(x[1]).trim());
const num = (s) => Number(s.replace(/\$/g, '').replace(/\^/g, '').replace(/cm|sides/g, '').trim());
const key = {};
{ const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2]; }

const solve = {
  1: o => o.map(num).map(v => v === angleSum(13)),
  2: o => o.map(num).map(v => v === diagonals(7)),
  3: o => o.map(num).map(v => near(v, exterior(45))),
  4: o => o.map(num).map(v => near(v, interior(60))),
  5: o => o.map(s => s === ['', '', '', 'triangle', 'square', 'pentagon', 'hexagon'][fromExterior(72)]),
  6: o => o.map(num).map(v => fromExterior(v) === null),
  7: o => o.map(s => /two pairs of adjacent sides equal/.test(s)),
  8: o => o.map(num).map(v => v === 58),
  9: o => o.map(s => s.match(/\d+/g).map(Number)).map(([a, b]) => a === 18 / 2 && b === 2 * 5),
  10: o => o.map(s => s.match(/\d+/g).map(Number)).map(([a, b]) => a === 18 / 2 && b === 90),
  11: o => o.map(num).map(v => v === (180 - 120) / 2),
  12: o => o.map(num).map(x => diagonalFits(3, 4, 6, 8, x)),   // AC: triangle ABC (3, 4) and ACD (6, 8)
  13: o => o.map(num).map(v => v === 2 * 360 / (2 + 3 + 3 + 4)),
  14: o => o.map(num).map(v => v === fromDiagonals(65)),
  15: o => o.map(num).map(v => v === fromSum(7 * 360)),
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options: ${JSON.stringify(o)}`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Q${q}: the right option`, right, [key[q]]);
}
// assertion-reason: [A true, R true, R explains A]
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  16: [fromExterior(70) !== null, true, true],
  17: [true, false, false],           // opposite angles equal; adjacent angles are not equal in general (100 and 80)
  18: [angleSum(5) === 540, diagonals(5) === 5, false],
  19: [!quadByTriangles([2, 3, 4, 9]), triangle(3, 4, 5) && !triangle(1, 2, 5), true],   // R: the diagonal and the three-rod rule, which is the argument for A
};
ok('Q17: adjacent angle of 100 is not 100', 180 - 100 === 100, false);
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-19', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(19)].map((_, i) => i + 1));
ok('practice runs 1-31', Object.keys(qs).map(Number).sort((a, b) => a - b), [...Array(31)].map((_, i) => i + 1));

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
const mdLine = md.slice(md.indexOf('as the key prints it'));
for (const m of mdLine.slice(0, 400).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2];
ok('ANSWERS.md key matches the page', mdKey, key);

/* ---- report ---------------------------------------------------- */

console.log(`A  ${spans} identities evaluated (${solved} equations checked with the value the working finds); ${skipped.length} spans not pure arithmetic, skipped`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
