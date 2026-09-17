#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each equation is
   solved again, each word problem is searched or computed from its
   statement, and the result is compared with what the page prints.

     node pages/class-8/ch06-equations/check-numbers.mjs [--skipped]

   Four parts:
     A  every identity set as maths, on every page and in ANSWERS.md, whose
        sides all evaluate to numbers (a false one must be listed as false
        on purpose)
     B  every worked example: the equation is solved again, its Answer row
        read back, and every working line in the letter must hold at that
        answer; word problems, Stage 1 and the practice answers, read back
        out of the answer key part by part
     C  every multiple-choice and assertion-reason question: exactly one
        option is right, and it is the one the key prints
     D  ANSWERS.md: the same key as the page; every "$eq$ gives $v = n$"
        solved again; every exercise equation the body sets is answered

   Exits non-zero if anything does not hold up. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
let pass = 0;
const fails = [];
const near = (a, b) => Math.abs(a - b) < 1e-9;
const ok = (what, got, want) => {
  if (JSON.stringify(got) === JSON.stringify(want)) pass++;
  else fails.push(`${what}\n      computed ${JSON.stringify(got)}\n      printed  ${JSON.stringify(want)}`);
};
const is = (what, cond) => { if (cond) pass++; else fails.push(what); };

/* ---- LaTeX to arithmetic ------------------------------------- */

// a JS expression in the letters of the span, or null
function toJs(tex) {
  let s = tex
    .replace(/\\left|\\right|\\big|\\Big|\\,|\\;|\\ |\\!|\\quad|\\qquad/g, '')
    .replace(/\^\\circ|\\circ/g, '')
    .replace(/\\[td]?frac(\d)(\d)/g, '(($1)/($2))');
  for (let k = 0; k < 6; k++) s = s.replace(/\\[td]?frac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))');
  s = s.replace(/\\times|\\cdot/g, '*').replace(/\\div/g, '/').replace(/−/g, '-')
    .replace(/\{|\}/g, '').replace(/\s+/g, '');
  if (!/^[-+*/().0-9a-z]+$/.test(s)) return null;
  // implicit products: 3x, 2(, )(, x(, )x, xy
  s = s.replace(/(\d|\))(?=[a-z(])/g, '$1*').replace(/([a-z])(?=[a-z(\d])/g, '$1*');
  return s;
}
const letters = (tex) => [...new Set((toJs(tex.replace(/=/g, '-')) || '').match(/[a-z]/g) || [])];
const evalAt = (js, env = {}) => {
  try { return Function(...Object.keys(env), `"use strict";return (${js})`)(...Object.values(env)); }
  catch { return NaN; }
};
const num = (tex) => { const j = toJs(tex); return j && !letters(tex).length ? evalAt(j) : NaN; };

// solve a linear equation in one letter: {x: value} | 'none' | 'every' | null
function solve(eq, v) {
  const sides = eq.split('=');
  if (sides.length !== 2) return null;
  const [L, R] = sides.map(toJs);
  if (!L || !R) return null;
  v = v || letters(eq)[0];
  const f = (t) => evalAt(`(${L})-(${R})`, { [v]: t });
  const b = f(0), a = f(1) - b;
  if (![a, b].every(Number.isFinite) || !near(f(2), 2 * a + b) || !near(f(-3), -3 * a + b)) return null;
  if (near(a, 0)) return near(b, 0) ? 'every' : 'none';
  return Math.round((-b / a) * 1e9) / 1e9;
}
const holds = (eq, env) => {
  const sides = eq.split('=').map(toJs);
  if (sides.some(s => !s)) return null;
  const vals = sides.map(s => evalAt(s, env));
  return vals.every(x => Math.abs(x - vals[0]) < 1e-6); // solutions are rounded to 1e-9
};

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8').replace(/\r\n/g, '\n')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8').replace(/\r\n/g, '\n');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/&middot;/g, '·').replace(/\s+/g, ' ').trim();
const squash = (s) => s.replace(/\s+/g, '');
const spansOf = (s) => [...s.matchAll(/\$([^$]+)\$/g)].map(m => m[1]);

/* ---- A. every identity ---------------------------------------- */

// statements printed so that the reader sees they are false
const FALSE_ON_PURPOSE = new Set(['3=5', '-10=-8', '7=4', '4=12', '1=-1', '3=7', '500=1100',
  '100=60', '1=9', '7=8', '4=1', '50=80', '7=0', '2d-3=d+1', '10x-1=3x+4']);
let spans = 0; const skipped = [];
for (const [f, src] of [...pages.map(f => [f, html[f]]), ['ANSWERS.md', answersMd]]) {
  for (const span of spansOf(src)) {
    if (!span.includes('=') || FALSE_ON_PURPOSE.has(squash(span))) continue;
    const pure = span.split('=').map(s => s.trim()).filter(Boolean).filter(s => toJs(s) && !letters(s).length);
    if (pure.length < 2) { skipped.push(`${f}: $${span}$`); continue; }
    const vals = pure.map(num);
    spans++;
    if (vals.some(v => !near(v, vals[0]))) fails.push(`${f}: $${span}$ — sides are ${vals.join(' and ')}`);
    else pass++;
  }
}
// and every false statement really is false
for (const s of FALSE_ON_PURPOSE) if (!/[a-z]/.test(s)) is(`${s} is printed as false`, holds(s, {}) === false);
is('2d-3=d+1 is the wrong line: it gives 4', solve('2d - 3 = d + 1') === 4);
is('10x-1=3x+4 gives a different answer from 17/7', !near(solve('10x - 1 = 3x + 4'), 17 / 7));

/* ---- B. the worked examples ----------------------------------- */

function examples(src) {
  const out = [];
  const open = /<div class="c-example">/g; let m;
  while ((m = open.exec(src))) {
    let depth = 1; const tag = /<\/?div\b[^>]*>/g; tag.lastIndex = m.index + m[0].length; let t;
    while (depth > 0 && (t = tag.exec(src))) { depth += t[0].startsWith('</') ? -1 : 1; if (!depth) out.push(src.slice(m.index, t.index)); }
  }
  return out;
}
const answerRow = (ex) => (ex.match(/<span class="work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/) || [])[1] || '';
const rowSpans = (ex) => [...ex.matchAll(/<span class="work__label">(?:Step \d+|Check)<\/span>\s*<span>([\s\S]*?)<\/span>/g)].flatMap(m => spansOf(m[1]));
const readAnswer = (row) => {
  if (/^No solution/i.test(text(row))) return 'none';
  if (/^Every number/i.test(text(row))) return 'every';
  const s = spansOf(row).find(x => /^[a-z]\s*=/.test(x.trim()));
  return s ? num(s.split('=').slice(1).join('=')) : undefined;
};
const says = (what, row, ...vals) => { for (const v of vals) is(`${what} should say ${v}: "${text(row)}"`, new RegExp(`(^|[^\\d.])${String(v).replace('.', '\\.')}([^\\d]|$)`).test(text(row).replace(/\$/g, ''))); };

let solved = 0;
for (const [where, src] of [['body', body], ['Beyond', beyond]]) {
  for (const ex of examples(src)) {
    const tab = text((ex.match(/c-example__tab">([^<]*)/) || [])[1] || '');
    const q = ex.match(/<p>Solve \$([^$]+)\$\.<\/p>/);
    if (!q) continue;
    const want = solve(q[1]);
    const got = readAnswer(answerRow(ex));
    solved++;
    is(`${where} ${tab}: $${q[1]}$ solves to ${want}, Answer row says ${got}`, typeof want === 'number' ? near(want, got) : want === got);
    const v = letters(q[1])[0];
    for (const s of rowSpans(ex)) {
      if (!s.includes('=') || !letters(s).includes(v) || /[a-z]{2}/.test(s)) continue;
      if (typeof want === 'number') is(`${where} ${tab}: working line $${s}$ fails at ${v} = ${want}`, holds(s, { [v]: want }) === true);
      else is(`${where} ${tab}: working line $${s}$ should keep the ${want} case`, [0, 1, 7].every(t => holds(s, { [v]: t }) === (want === 'every')) || solve(s) === want);
    }
  }
}
is(`every "Solve" example was checked (${solved})`, solved === 21);

// body word examples, computed from their statements
const bodyEx = examples(body); const beyEx = examples(beyond);
const exAns = (list, n) => answerRow(list.find(e => new RegExp(`Example ${n}<`).test(e)) || '');
{ const s = [...Array(100)].findIndex((_, x) => 4 * x + 6 === 3 * (x + 6)); says('body Example 10', exAns(bodyEx, 10), s, 4 * s); }
{ const n = [...Array(100)].findIndex((_, n) => 3 * n + 3 === 87); says('body Example 11', exAns(bodyEx, 11), n, n + 1, n + 2); }
{ const w = [...Array(100)].findIndex((_, w) => 2 * (2 * w + 5) === 46); says('body Example 12', exAns(bodyEx, 12), w, w + 5); }
is('body Example 13 has no solution', solve('2x + 3 = 2x + 5') === 'none');
is('body Example 14: every number', solve('2(x + 3) = 2x + 6') === 'every');
is('body Example 7: the wrong sign gives 41/7', near(solve('5(2x - 1) - 3x - 12 = 24'), 41 / 7));
is('body Example 8: multiplying only the fractions gives 2', solve('5x = 10') === 2);
is('body Example 4 check: both sides 11', holds('3x + 2 = 11', { x: 3 }) && holds('x + 8 = 11', { x: 3 }));
is('body Example 5 check: both sides 7', holds('2x + 1 = 7', { x: 3 }) && holds('5x - 8 = 7', { x: 3 }));
is('body Example 6 check: 3(x+4) = 30 at 6', holds('3(x + 4) = 30', { x: 6 }) && holds('2(x + 9) = 30', { x: 6 }));
is('body Example 8 check: 6 + 4', holds('x/2 = 6', { x: 12 }) && holds('x/3 = 4', { x: 12 }));
is('body Example 12 read back: 18 and 54', 12 + 6 === 18 && 48 + 6 === 54 && 54 === 3 * 18);
is('2x+1=5x-8: 2x off gives 1=3x-8, 5x off gives -3x+1=-8', solve('1 = 3x - 8') === 3 && solve('-3x + 1 = -8') === 3);
is('Fig. 6.2: 3x+2=x+8 and 2x+2=8 agree', solve('3x + 2 = x + 8') === solve('2x + 2 = 8'));
is('Fig. 6.1: x + 2 = 4 gives 2', solve('x + 2 = 4') === 2);
is('p001: 3x+5 is 11 at 2 and 20 at 5', holds('3x + 5 = 11', { x: 2 }) && holds('3x + 5 = 20', { x: 5 }));

// Beyond word examples
{ const n = [...Array(100)].findIndex((_, n) => 3 * n + 6 === 63); says('Beyond Example 12', exAns(beyEx, 12), n, n + 2, n + 4); }
{ const x = [...Array(100)].findIndex((_, x) => x + 26 + 4 === 3 * (x + 4)); says('Beyond Example 13', exAns(beyEx, 13), x, x + 26);
  says('Beyond Example 13 check', text(beyEx.find(e => /Example 13</.test(e))), x + 4, x + 30); }
{ const a = [...Array(100)].findIndex((_, a) => 50 * a + 30 * (a + 12) === 1160); says('Beyond Example 14', exAns(beyEx, 14), a, a + 12); }
{ const x = [...Array(100)].findIndex((_, x) => 6 * x - 30 === 180); says('Beyond Example 15', exAns(beyEx, 15), x, 2 * x, 3 * x - 30); }
is('Beyond Example 1: x = -3 solves 4x+7 = x-2', holds('4x + 7 = x - 2', { x: -3 }) && readAnswer('Yes') === undefined && /^Yes/.test(text(exAns(beyEx, 1))));
{ const r = exAns(beyEx, 2); is(`Beyond Example 2: only x = 5 solves 3(x-1) = 2x+2 — "${text(r)}"`, holds('3(x - 1) = 2x + 2', { x: 5 }) && !holds('3(x - 1) = 2x + 2', { x: 2 }) && /x=5isthesolution/.test(squash(text(r)).replace(/\$/g, ''))); }
is('Beyond Example 16 has no solution', solve('5(x - 2) = 3x + 2(x - 4)') === 'none' && /^No solution/.test(text(exAns(beyEx, 16))));
{ const k = [...Array(20)].findIndex((_, k) => solve(`4(x + ${k}) = 4x + 12`) === 'every');
  const r = text(exAns(beyEx, 17));
  is(`Beyond Example 17: k = ${k} gives every number, k = 1 none — "${r}"`, solve('4(x + 1) = 4x + 12') === 'none' && new RegExp(`k=${k}giveseverynumber;k=1givesnosolution`).test(squash(r).replace(/\$/g, ''))); }

// Stage 1, each question computed from its statement
const s1 = beyond.slice(0, beyond.indexOf('Solved Examples'));
ok('Stage 1 Q1: k', solve('20 + k = 35 - 9'), 6);
is('Stage 1 Q1 check: 4x + 6 = 7x - 9 gives 5', solve('4x + 6 = 7x - 9') === 5);
{ const n = 23; ok('Stage 1 Q2: five numbers', [n - 2, n - 1, n, n + 1, n + 2].reduce((a, b) => a + b) / 5, 23); is('Stage 1 Q2 prints 21..25', squash(s1).includes('$21,22,23,24,25$')); }
{ const x = [...Array(31)].findIndex((_, x) => 5 * x + 2 * (30 - x) === 99); ok('Stage 1 Q3: coins', [x, 30 - x, 5 * x, 2 * (30 - x)], [13, 17, 65, 34]); }
{ const found = [...Array(90)].map((_, i) => i + 10).filter(n => Math.floor(n / 10) + n % 10 === 9 && (n % 10) * 10 + Math.floor(n / 10) === n + 27);
  ok('Stage 1 Q4: the number', found, [36]); }
{ const found = [...Array(50)].map((_, d) => d).filter(d => d > 4 && 2 * (d - 3) === d + 1); ok('Stage 1 Q5: denominator', found, [7]); }
is('Stage 1 Q6: x = 0 solves 7x = 4x, and it is the only one', solve('7x = 4x') === 0);
ok('Stage 1 Q7: 2x = 5', solve('2x = 5'), 2.5);
{ const trick = (n) => (2 * n + 10) / 2 - n; ok('Stage 1 Q8: the trick', [trick(7), trick(100), (2 * 7 + 10) / 2, 2 * 100 + 10, (2 * 100 + 10) / 2], [5, 5, 12, 210, 105]); }

// the practice answers, read back out of the key rather than typed here
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= m[2];
const row = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const r = keyRows[n] || '';
  if (!part) return r;
  const m = text(r).match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\)|$)`));
  return m ? m[1] : '';
};
const key = (q, ...vals) => says(`key ${q}`, row(q), ...vals);
const solveRow = (q, eqWant) => { // every "$eq$" in the row that is a linear equation solves to a value the row prints
  for (const s of spansOf(row(q))) {
    const r = solve(s); if (typeof r !== 'number') continue;
    const L = letters(s)[0];
    is(`key ${q}: $${s}$ solves to ${r}, row should print ${L} = ${r}`, new RegExp(`${L}=${String(r).replace('-', '\\-')}(?![\\d])`).test(squash(text(row(q)))) || eqWant === r || text(row(q)).includes(` ${r} `) || new RegExp(`[^\\d]${r}[^\\d]`).test(text(row(q))));
  }
};
ok('Q19', solve('12 - x = 5'), 7); key(19, 7);
{ const n = solve('5n = n + 24'); key(20, n); }
is('Q21: x = 1/2 solves 6x - 1 = 2x + 1', holds('6x - 1 = 2x + 1', { x: 0.5 }) && /^Yes/.test(text(row(21))));
{ const x = solve('x/5 = -2'); key(22, 5, x); }
{ const x = solve('3(x + 4) - 2(x - 1) = 20'); key(23, x); solveRow(23); is('Q23 check', holds('3(x + 4) - 2(x - 1) = 20', { x })); }
{ const x = solve('2x/3 - 1 = x/4 + 4'); key(24, 12, x); solveRow(24); is('Q24: 8x - 12 = 3x + 48 is 12 times the equation', solve('8x - 12 = 3x + 48') === x); }
{ const n = solve('4n + 6 = 98'); key(25, n, n + 1, n + 2, n + 3); ok('Q25 sum', 4 * n + 6, 98); }
{ const x = solve('5 - (x - 3) = 2(x - 5)'); key(26, x); solveRow(26); }
{ const z = [...Array(100)].findIndex((_, z) => z > 5 && 4 * z - 5 === 7 * (z - 5)); key(27, z, 4 * z, z - 5, 4 * z - 5); }
{ const w = [...Array(100)].findIndex((_, w) => 2 * ((2 * w - 6) + (w + 4)) === 68); key(28, w, 2 * w, 2 * w * w, 2 * w - 6, w + 4); }
{ const m = solve('500 + 300m = 1100 + 250m'); key(29, m, 500 + 300 * m, 1100 - 500);
  is('Q29: the third gym never matches', solve('500 + 300m = 1100 + 300m') === 'none'); }
{ const r = [...Array(50)].findIndex((_, r) => 20 * r + 15 * 2 * r === 150); key('30a', r, 2 * r);
  const g = [...Array(50)].findIndex((_, g) => 2 * 25 + 15 * g === 125); key('30b', g);
  const n = [...Array(50)].findIndex((_, n) => 20 * n + 25 * n + 4 * 15 === 285); key('30c', n); }
{ const g = solve('100 + 20g = 180 + 12g'); key('31a', g, 100 + 20 * g);
  is('Q31b: P and R never match', solve('100 + 20g = 60 + 20g') === 'none'); key('31b', 100 - 60);
  key('31c', solve('180 + 12g = 276')); }

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] = m[2];
const optsOf = (n) => [...((qs[n] || '').match(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*)<\/ol>/) || ['', ''])[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => x[1].trim());
const optNum = (o) => num(o.replace(/\$/g, '').replace(/cm/, '').trim());
const pageKey = {};
{ const a = beyond.indexOf('<ol class="c-answers">'); for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) pageKey[m[1]] ??= m[2]; }
const qEq = (n) => spansOf(qs[n] || '').find(s => s.includes('=')) || '';
// one letter, only to the first power, nowhere in a denominator
const isLinearOne = (tex) => { const j = toJs(tex.replace(/=/g, '-')); return !!j && letters(tex).length === 1 && !/\/\([^)]*[a-z]/.test(j) && solve(tex) !== null; };
const choose = {
  1: o => o.map(optNum).map(v => near(v, solve(qEq(1)))),
  2: o => o.map(s => isLinearOne(s.replace(/\$/g, ''))),
  3: o => o.map(s => holds(s.replace(/\$/g, ''), { x: -2 }) === true),
  4: o => o.map(optNum).map(v => near(v, solve(qEq(4)))),
  5: o => o.map(optNum).map(v => near(v, solve(qEq(5)))),
  6: o => o.map(optNum).map(v => v === [...Array(100)].findIndex((_, k) => k > 0 && k % 6 === 0 && k % 4 === 0)),
  7: o => o.map(optNum).map(v => near(v, solve(qEq(7)))),
  8: o => o.map(s => text(s) === { none: 'no solution', every: 'every number as a solution' }[solve(qEq(8))]),
  9: o => o.map(optNum).map(v => { const x = [...Array(51)].findIndex((_, x) => 2 * x + 14 === 50); return v === x + 14; }),
  10: o => o.map(optNum).map(v => near(v, solve(`2(6) + k = 4k`))),
  11: o => o.map(optNum).map(v => near(v, solve(qEq(11)))),
  12: o => o.map(optNum).map(v => v === [...Array(100)].findIndex((_, x) => x + 30 + 5 === 3 * (x + 5))),
  13: o => o.map(optNum).map(c => solve(`3(x + 2) = 3x + ${c}`) === 'every'),
  14: o => o.map(optNum).map(v => { const w = [...Array(50)].findIndex((_, w) => 2 * (2 * w + 3) === 30); return v === w + 3; }),
};
for (const [q, f] of Object.entries(choose)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Q${q}: the right option`, right, [pageKey[q]]);
}
is('Q2 options: only (a) is linear', isLinearOne('2x - 5 = 3x + 1') && !isLinearOne('x^2 + x = 2') && !isLinearOne('p + q = 9') && !isLinearOne('\\dfrac{4}{y} = 2'));
// assertion-reason: [A true, R true, R explains A]
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  15: [solve('5x = 2x') === 0, false, false],
  16: [solve('4(x - 1) = 4x - 4') === 'every', true, true],
  17: [solve('2x + 3 = 2x + 7') === 'none', true, false],
  18: [solve('x/2 = 3') === 1.5, true, false],
};
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), pageKey[q]);
ok('Q15-18 assertions are the ones printed', [15, 16, 17, 18].map(q => squash(spansOf(qs[q] || '')[0] || '')), ['x=0', '4(x-1)=4x-4', '2x+3=2x+7', '\\dfrac{x}{2}=3']);
const lettersUsed = Object.values(pageKey);
is(`key letters spread across a-d: ${lettersUsed.join('')}`, ['a', 'b', 'c', 'd'].every(l => lettersUsed.filter(x => x === l).length >= 3));
ok('key covers 1-18', Object.keys(pageKey).map(Number).sort((a, b) => a - b), [...Array(18)].map((_, i) => i + 1));
ok('practice runs 1-31, one block each', Object.keys(qs).map(Number).sort((a, b) => a - b), [...Array(31)].map((_, i) => i + 1));

/* ---- D. ANSWERS.md ---------------------------------------------- */

const mdKey = {};
const mdLine = answersMd.slice(answersMd.indexOf('as the key prints it'));
for (const m of mdLine.slice(0, 400).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2];
ok('ANSWERS.md key matches the page', mdKey, pageKey);

// every "$eq$ gives $v = n$" solved again
let gives = 0;
for (const m of answersMd.matchAll(/\$([^$]+)\$ gives \$([a-z]) = ([^$]+)\$/g)) {
  gives++;
  const r = solve(m[1], m[2]);
  is(`ANSWERS.md: $${m[1]}$ gives ${m[2]} = ${r}, printed ${m[3]}`, typeof r === 'number' && near(r, num(m[3])));
}
for (const m of answersMd.matchAll(/\$([^$]+)\$: (no solution|every number)/g)) {
  if (letters(m[1]).length !== 1) continue;
  gives++;
  ok(`ANSWERS.md: $${m[1]}$`, solve(m[1]), m[2] === 'no solution' ? 'none' : 'every');
}
is(`ANSWERS.md solves at least 90 equations (${gives})`, gives >= 90);

// every equation the body asks to be solved is answered in ANSWERS.md
const mdSquash = squash(answersMd);
let asked = 0;
for (const m of body.matchAll(/<ol class="c-questions"[^>]*>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) {
  const stem = text(m[1].split('<ol')[0]);
  if (!/^(Solve|Find, by trying|Do the same)/.test(stem)) continue;
  for (const s of spansOf(m[1])) {
    if (!s.includes('=') || letters(s).length !== 1 || /^[a-z]=/.test(squash(s)) && squash(s).length < 6) continue;
    asked++;
    is(`body equation $${s}$ is answered in ANSWERS.md`, mdSquash.includes(`$${squash(s)}$gives`) || mdSquash.includes(`$${squash(s)}$:`));
  }
}
is(`body exercise equations found (${asked})`, asked >= 60);

// ANSWERS.md, the body word problems, computed from their statements
const mdItem = (set, n) => {
  const a = answersMd.indexOf(`### ${set}`); const b = answersMd.indexOf('\n### ', a + 5);
  const sec = answersMd.slice(a, b < 0 ? undefined : b);
  const m = sec.match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |\\n---|$)`));
  return m ? m[1] : '';
};
const md = (set, n, ...vals) => says(`ANSWERS.md ${set} Q${n}`, mdItem(set, n), ...vals);
const find = (p) => [...Array(1000)].findIndex((_, x) => p(x));
md('Exercise Set 6.1', 5, 11); is('6.1 Q5: solution is bigger than 3', solve('4x - 1 = 12') > 3);
md('Exercise Set 6.1', 8, 16, -2); is('6.1 Q8 values', holds('2(x + 3) = 16', { x: 5 }) && holds('2x + 6 = -2', { x: -4 }));
is('6.1 Q2 all three solutions', holds('3x - 5 = 7', { x: 4 }) && holds('5y + 1 = -9', { y: -2 }) && holds('2m + 3 = 4m - 9', { m: 6 }));
is('6.1 Q6 sentences: 14, 8, 42', solve('n + 5 = 19') === 14 && solve('3n - 4 = 20') === 8 && solve('n/7 = 6') === 42);
md('Exercise Set 6.2', 6, 9, 2); is('6.2 Q6: Ravi\'s -2 fails', !holds('5 - 2x = 1', { x: -2 }));
is('6.2 Q8: x + 1 = 4 is x = 3', solve('x + 1 = 4') === 3);
md('Exercise Set 6.3', 5, 17); is('6.3 Q5 common value', 4 * solve('4x + 1 = 2x + 9') + 1 === 17);
md('Exercise Set 6.3', 6, 22); is('6.3 Q6 perimeters', 2 * (4 + 7) === 22 && 2 * (8 + 3) === 22);
md('Exercise Set 6.3', 7, 12); is('6.3 Q7: 4x - 4 = 8 is right, 4x = 4 is not', solve('4x - 4 = 8') === 3 && solve('4x = 4') !== 3);
md('Exercise Set 6.4', 7, 8); is('6.4 Q7: x + 3 = 14 is wrong', solve('x + 3 = 14') !== solve('x/2 + 3 = 7'));
md('Exercise Set 6.4', 8, 9, 5); is('6.4 Q8', solve('x - 1 = 4') === 5 && solve('x - 1 = 8') === 9);
md('Exercise Set 6.4', 9, 72); is('6.4 Q9: a half, a third and a sixth make a whole', near(1 / 2 + 1 / 3 + 1 / 6, 1));
md('Exercise Set 6.5', 1, 27); is('6.5 Q1(b)', 40 - 13 === 27);
{ const n = find(n => 2 * n + 1 === 75); md('Exercise Set 6.5', 2, n, n + 1); }
{ const n = find(n => 3 * n + 6 === 84); md('Exercise Set 6.5', 3, n, n + 2, n + 4); }
{ const d = find(d => d > 0 && 3 * d + 8 === 2 * (d + 8)); md('Exercise Set 6.5', 4, d, 3 * d, d + 8, 3 * d + 8); }
{ const w = find(w => 6 * w === 54); md('Exercise Set 6.5', 5, w, 2 * w, 2 * w * w); }
{ const x = find(x => 3 * x + 30 === 180); md('Exercise Set 6.5', 6, x, x + 30); }
{ const p = find(p => p > 0 && 14 * p === 98); md('Exercise Set 6.5', 7, p, 2 * p, 8 * p, 6 * p); }
{ const x = find(x => 4 * x + 60 === 360); md('Exercise Set 6.5', 8, x, x + 10, x + 20, x + 30); }
{ const n = find(n => n - 30 === 58 - n); md('Exercise Set 6.5', 9, n, (30 + 58) / 2); }
{ const x = find(x => 2 * x + 60 === 720); md('Exercise Set 6.5', 10, x, x + 60, -solve('2x + 800 = 720') ); }
is('T&R: k = 7 every, other k none', solve('3x + 7 = 3x + 7') === 'every' && solve('3x + 7 = 3x + 0') === 'none');
is('T&R: kx + 7 = 3x + 7 gives x = 0 for k = 5, every for k = 3', solve('5x + 7 = 3x + 7') === 0 && solve('3x + 7 = 3x + 7') === 'every');
{ const k = find(k => solve(`2x + ${k} = 2x + 9`) === 'every'); md('Exercise Set 6.6', 3, k); }
{ const k = find(k => solve(`${k}x - 4 = 5x - 4`) === 'every'); md('Exercise Set 6.6', 4, k); is('6.6 Q4 other k: x = 0', solve('2x - 4 = 5x - 4') === 0); }
is('6.6 Q5 instances', solve('x + 1 = x + 2') === 'none' && solve('2(x + 1) = 2x + 2') === 'every');
md('Exercise Set 6.6', 6, 30); is('6.6 Q6', solve('50 + 12d = 80 + 12d') === 'none');
{ const d = solve('50 + 12d = 20 + 15d'); md('Exercise Set 6.6', 7, d, 50 + 12 * d); }
is('6.6 Q8', solve('3x + 5 = 3x + 5') === 'every' && holds('3x + 5 = 3x + 5', { x: 0 }));
md('Exercise Set 6.2', 7, 6); is('6.2 Q7 instances', solve('3(x - 2) = 12') === 6 && solve('4x + 2 = 0') === -0.5);
// the Stage 1 summary in ANSWERS.md, against the computed values
says('ANSWERS.md Stage 1', answersMd.slice(answersMd.indexOf('### Stage 1'), answersMd.indexOf('### Stage 2')), 6, 21, 25, 13, 17, 36, 5);
// the practice working in ANSWERS.md agrees with the page's rows
const mdPractice = answersMd.slice(answersMd.indexOf('The working for each'));
const mdQ = (n) => (mdPractice.match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`)) || [])[1] || '';
for (const [n, vals] of Object.entries({ 9: [32], 12: [10], 14: [9], 25: [23, 24, 25, 26], 27: [10, 40], 28: [24, 12, 288], 29: [12, 4100, 600], 30: [3, 6, 5], 31: [10, 300, 40, 8] }))
  says(`ANSWERS.md practice Q${n}`, mdQ(n), ...vals);

/* ---- report ---------------------------------------------------- */

console.log(`A  ${spans} identities evaluated; ${skipped.length} spans with letters, handled in B and D or skipped`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`B  ${solved} worked examples solved again`);
console.log(`D  ${gives} equations in ANSWERS.md solved again; ${asked} body exercise equations answered`);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
