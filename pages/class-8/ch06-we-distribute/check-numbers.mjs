#!/usr/bin/env node
/* Re-derive every number and every expansion this chapter prints.

     node pages/class-8/ch06-we-distribute/check-numbers.mjs

   Rewritten on 26 September 2026 for the maths-v2 chapter: the body in the
   book's own contexts, By the Book in six forms (p090 up), and Beyond the
   Book by format (p101 up). The version before it checked the NCERT-context
   body and the old fifteen-example bank in stage2-bank.mjs; both are gone,
   and it is in git history.

     A  every span set as maths, on every page and in ANSWERS.md, whose sides
        are pure arithmetic: all sides must agree
     B  every algebraic equality set as maths whose sides are polynomials in
        single letters: both sides are evaluated at six sets of values
     C  the key is complete: By the Book 1–50, Beyond practice 1–15, and ten
        solved examples, each ending in an Answer row
     D  every single-answer multiple choice (By the Book 41–50, Beyond 1–4 and
        the paragraph parts) and every assertion–reason pair: the right
        option is computed here and must be the one the key names; the
        multiple-correct and matching keys likewise
     E  the body's own worked numbers and the answers to its exercises

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
  { a: 3, b: 5, c: 7, d: 2, m: 4, n: 6, u: 9, v: 11, x: 2, y: 3, z: 5, p: 7, q: 2, r: 3.5, s: 9, w: 4, g: 6, k: 3, j: 2, l: 5, t: 4 },
  { a: -2, b: 7, c: 1.5, d: -3, m: 5, n: -4, u: 2, v: 3, x: -1.5, y: 4, z: 2, p: -3, q: 5, r: 1, s: 2, w: 3, g: 10, k: 7, j: -5, l: -3, t: 2.5 },
  { a: 11, b: -6, c: 2, d: 9, m: -1, n: 8, u: -3, v: 7, x: 5, y: -2, z: -4, p: 2, q: -7, r: 4, s: 12, w: 1.5, g: 2, k: -2, j: 3, l: 8, t: -1 },
  { a: 0.5, b: 2.5, c: -4, d: 1, m: 3, n: 3, u: 1, v: -2, x: 10, y: 1, z: 7, p: 1, q: 3, r: 2, s: 5, w: 2, g: 7, k: 10, j: 4, l: 1.5, t: 6 },
  { a: 23, b: 27, c: 1, d: 13, m: 2, n: -3, u: 6, v: 5, x: 8, y: 3, z: 9, p: 6, q: 11, r: 3.5, s: 9, w: 5, g: 3, k: 1, j: 1, l: 11, t: 3 },
  { a: -7, b: -9, c: 3, d: -1, m: 7, n: 1, u: -5, v: -8, x: 3, y: 7, z: 1, p: 9, q: 4, r: 6, s: 20, w: 7, g: 1, k: 15, j: 7, l: -2, t: 9 },
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
  // Section 6.3: the expansions to be checked, and the Think and Reflect
  '= 8a - 12b', '= y + 4', '= p^2 + 9', '= 7k^3', 'x^2 + x = 2x',
  // By the Book: statements printed to be judged
  '(y - 3)^2 = y^2 - 9', '4p + 5q = 9pq', '(a - b)^2 = a^2 - b^2', '99^2 = 100^2 - 1^2 = 9999', '= 2x^2 - 12x + 9',
];
// conditions on a letter, not identities
const CONDITIONS = ['(x + a)^2 = x^2 + 14x + 49', '(2x + 3)(x - k) = 2x^2 - 5x - 12', '(x + 4)(x - k) = x^2 + x - 12', '3b = 2a + 6',
  '(a + b)^2 - (a - b)^2 = 48'];
const EQUATIONS = [];
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


/* ---- C. the key is complete ------------------------------------ */

const has = (src, s) => is(`prints: ${s}`, src.includes(s));

const keyPage = pages.find(f => html[f].includes('c-stage__title">Answers'));
const keyStart = pages.indexOf(keyPage);
const keyHtml = pages.slice(keyStart).map(f => html[f]).join('\n');
const [boardKey, beyondKey] = keyHtml.split('c-practice__sub">Beyond the Book');
is('the key has a Beyond the Book group', !!beyondKey);
const numbered = s => new Set([...s.matchAll(/work__label">(\d+)<|class="n">(\d+)</g)].map(m => +(m[1] || m[2])));
{ const b = numbered(boardKey); for (let n = 1; n <= 50; n++) is(`By the Book key has ${n}`, b.has(n)); }
const beyondList = text((beyondKey.match(/c-answers__list">([\s\S]*?)<\/span>\s*<\/li>/) || [, ''])[1]);
{ const b = new Set([...numbered(beyondKey), ...[...beyondList.matchAll(/(?:^|\s)(\d+)\s+[(\d]/g)].map(m => +m[1])]);
  for (let n = 1; n <= 15; n++) is(`Beyond key has ${n}`, b.has(n)); }
const beyondPages = pages.filter(f => /^p1/.test(f) && pages.indexOf(f) < keyStart).map(f => html[f]).join('\n');
const examples = [...beyondPages.matchAll(/c-example__tab">Example (\d+)<[\s\S]*?(?=c-example__tab"|$)/g)];
ok('Beyond has ten solved examples, numbered 1-10', examples.map(e => +e[1]), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
const exAnswer = {};
for (const e of examples) { const a = e[0].match(/work__label">Answer<\/span><span>([\s\S]*?)<\/span>/); is(`Example ${e[1]} ends in an Answer row`, !!a); if (a) exAnswer[e[1]] = text(a[1]).trim(); }
is('no Beyond page carries a stage numeral', !/c-stage__num/.test(beyondPages + keyHtml));

/* ---- D. multiple choice and assertion-reason, recomputed -------- */

const letter = (i) => 'abcd'[i];
const optsAfter = (src, n) => {
  const start = n === 1 ? src.search(/<ol class="c-questions">/) : src.indexOf(`data-start="${n}"`);
  if (start < 0) return null;
  const chunk = src.slice(start, src.indexOf('</ol>\n      </div>', start));
  const o = chunk.match(/c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/);
  return o ? [...o[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1].replace(/\$/g, '').trim()) : null;
};
const board = pages.filter(f => /^p09/.test(f)).map(f => html[f]).join('\n');
const boardLetters = Object.fromEntries([...boardKey.matchAll(/class="n">(\d+)<\/span> \((\w)\)/g)].map(m => [+m[1], m[2]]));
const pickOne = (opts, f) => opts.map((o, i) => f(o) ? letter(i) : null).filter(Boolean);
const num = s => Number(s.replace(/\s|cm²/g, ''));
const BOARD_MCQ = {
  41: o => same(o, '(x - 6)^2'),
  42: o => num(o) === 73 * 67,
  43: o => num(o) === 34 ** 2 - 16 ** 2,
  44: o => num(o) === 2753 * 11,
  45: o => same(`(x + (${num(o)}))^2`, 'x^2 + 14x + 49'),
  46: o => num(o) === 11 ** 2 - 2 * 24,
  47: o => same(`(2x + 3)(x - (${num(o)}))`, '2x^2 - 5x - 12'),
  48: o => num(o) === 15 ** 2 - 14 ** 2,
  49: o => o === '(i) and (iii)' && same('(a + b)^2', 'a^2 + b^2 + 2ab') && !same('(a - b)^2', 'a^2 - b^2') && same('(a + b)(a - b)', 'a^2 - b^2'),
  50: o => o === 'The increase is 2(a + b) + 4.' && same('(a + 2)(b + 2) - ab', '2(a + b) + 4'),
};
for (const [q, f] of Object.entries(BOARD_MCQ)) {
  const o = optsAfter(board, +q);
  is(`By the Book Q${q} has four options`, o && o.length === 4);
  if (o) ok(`By the Book Q${q}: the right option`, pickOne(o, f), [boardLetters[q]]);
}
{ const l = Object.values(Object.fromEntries(Object.entries(boardLetters).filter(([q]) => q > 40)));
  is(`By the Book objective letters spread: ${l.join('')}`, ['a', 'b', 'c', 'd'].every(x => l.filter(y => y === x).length >= 2)); }
// assertion-reason: [A true, R true, R explains A]
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  31: [203 * 197 === 39991, same('(a + b)(a - b)', 'a^2 - b^2'), true],
  32: [501 * 499 === 249999, same('(a + b)^2', 'a^2 + 2ab + b^2'), false],
  33: [same('(3m)^2', '9m^2'), same('(3m)^2', '3m^2'), false],
  34: [same('4p + 5q', '9pq'), true, false],
  35: [same('(x + 1)(x + 1) - x \\times x', '2x + 1'), same('(a + 1)(b + 1) - ab', 'a + b + 1'), true],
};
for (const [q, v] of Object.entries(AR)) ok(`By the Book Q${q}: assertion-reason`, arLetter(v), boardLetters[q]);

// Beyond practice
const practice = beyondPages;
const beyondLetters = {};
for (const m of beyondList.matchAll(/(\d+) ((?:\([a-d]\)(?:, )?)+)/g)) beyondLetters[m[1]] = m[2].match(/[a-d]/g).join('');
const beyondNums = Object.fromEntries([...beyondList.matchAll(/(\d+) (\d+(?:\.\d+)?)(?=\s|$)/g)].map(m => [m[1], +m[2]]));
const BEYOND = {
  1: o => num(o) === 3 ** 2 + 2,
  2: o => num(o) === 1001 ** 2 - 999 ** 2,
  3: o => (num(o) + 3) ** 2 - num(o) ** 2 === 51,
  4: o => num(o) === 48 / 4,
  5: o => same(o, '(x + 3)(x - 3)'),
  6: o => { const js = toJs(o); return [0, 1, 2, 3, 4, 5, 6, 7].every(n => evalAt(js, ['n'], { n }) % 4 === 0); },
  7: o => { const a = 7, b = 5; if (/numbers are/.test(o)) return 5 + 7 === 12 && 5 * 7 === 35; const [l, r] = o.split('='); return close(val(l, { a, b }), val(r, { a, b })); },
  8: o => (/^\d+$/.test(o) ? num(o) : val(o)) === 59 * 61,
};
for (const [q, f] of Object.entries(BEYOND)) {
  const o = optsAfter(practice, +q);
  is(`Beyond Q${q} has four options`, o && o.length === 4);
  if (o) ok(`Beyond Q${q}: the right option(s)`, pickOne(o, f).join(''), beyondLetters[q]);
}
ok('Beyond Q9-11', [beyondNums[9], beyondNums[10], beyondNums[11]],
  [(87 ** 2 - 13 ** 2) / 74, 113 - (15 ** 2 - 113), (() => { let n = 0; while ((n + 5) ** 2 - (n - 5) ** 2 <= 500) n++; return n; })()]);
{ // matching: the permutation each List I entry must take, and the printed key
  const matchKey = (src, n, left, right) => {
    const want = left.map((l, i) => `${'PQRS'[i]}–${right.findIndex(r => r(l)) + 1}`).join(',');
    const o = optsAfter(src, n).map(x => x.replace(/\s/g, ''));
    return pickOne(o, x => x === want);
  };
  const R12 = ['x^2 - 16', 'x^2 + 8x + 16', 'x^2 + 10x + 16', 'x^2 - 8x + 16', 'x^2 + 16'].map(r => l => same(l, r));
  ok('Beyond Q12: key', matchKey(practice, 12, ['(x + 4)^2', '(x - 4)^2', '(x + 4)(x - 4)', '(x + 2)(x + 8)'], R12).join(''), beyondLetters[12]);
  const R13 = [2496, 1225, 2255, 4200, 2525].map(r => l => l === r);
  ok('Beyond Q13: key', matchKey(practice, 13, [35 ** 2, 48 * 52, 205 * 11, 71 ** 2 - 29 ** 2], R13).join(''), beyondLetters[13]);
}
{ // the paragraph-based practice, read from the key rows
  const row = n => text((keyHtml.split('c-practice__sub">Beyond the Book')[1].match(new RegExp(`work__label">${n}</span>\\s*<span>([\\s\\S]*?)</span>`)) || [, ''])[1]);
  is('Beyond Q14 key: (a), 96, 176', /\(a\)/.test(row(14)) && /96/.test(row(14)) && /176/.test(row(14)));
  ok('Beyond Q14 values', [(10 + 6 - 4) * (10 + 2 - 4), 16 * 12 - 16], [96, 176]);
  is('Beyond Q14 (i): option (a) is the base', /^\(a \+ 2\) cm by \(a - 2\) cm$/.test(optsAfter(practice, 14)[0]));
  is('Beyond Q15 key: (a) 21, 120, 25th', /\(a\) 21/.test(row(15)) && /120/.test(row(15)) && /25th/.test(row(15)));
  ok('Beyond Q15 values', [11 ** 2 - 10 ** 2, 11 ** 2 - 1, (51 - 1) / 2], [21, 120, 25]);
  ok('Beyond Q15 (i) option (a)', optsAfter(practice, 15)[0], '21');
}
// the examples' answers
ok('Example answers', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => exAnswer[n]), [
  `(b) it increases by ${37 * 44 - 36 * 45}`, `(a) ${(8 ** 2 - 34) / 2}`, '(a), (b), (c)', '(a), (b), (c)',
  String(Math.round(7.9 ** 2 * 100) / 100), String(val('3x(2x - y) - 2y(x - 4y) + xy', { x: 2, y: 1 })),
  '(b) P–3, Q–2, R–4, S–1', '(d) P–2, Q–4, R–3, S–1',
  `(i) (c) $4a + 4$; (ii) ${17 ** 2}; (iii) ${(84 - 4) / 4}`, `(i) (a) ${104 * 107}; (ii) ${97 * 94}; (iii) ${103 * 98}`]);
is('Example 3 options: (a), (b), (c) equal, (d) not', ['(3a - 5b)^2', '(5b - 3a)^2', '(3a + 5b)^2 - 60ab'].every(o => same(o, '9a^2 - 30ab + 25b^2')) && !same('(3a - 5b)(3a + 5b)', '9a^2 - 30ab + 25b^2'));
is('Example 7: each List I entry has one match', ['(2m - 1)^2', '(2m + 1)(2m - 1)', '(2m + 1)^2', '(2m + 3)(2m - 1)'].every((l, i) => same(l, ['4m^2 - 4m + 1', '4m^2 - 1', '4m^2 + 4m + 1', '4m^2 + 4m - 3'][i])));
ok('Example 8 values', [43 * 101, 57 * 1001, 1003 ** 2 - 9, 52 ** 2], [4343, 57057, 1006000, 2704]);
{ const bl = Object.values(beyondLetters).filter(v => v.length === 1); is(`Beyond single letters spread: ${bl.join('')}`, new Set(bl).size === 4); }

/* ---- E. the body's worked numbers and exercise answers ---------- */

ok('24 x 35 increments', [24 * 36 - 24 * 35, 25 * 35 - 24 * 35, 25 * 36 - 24 * 35, 25 * 34 - 24 * 35], [24, 35, 60, 10]);
const times11 = (n) => { const d = String(n).split('').map(Number); const out = []; let carry = 0;
  for (let i = d.length; i >= 0; i--) { const s = (d[i] ?? 0) + (d[i - 1] ?? 0) + carry; out.unshift(s % 10); carry = Math.floor(s / 10); }
  if (carry) out.unshift(carry); return Number(out.join('')); };
for (const n of [4786, 6395, 86, 572, 4958, 3620917, 3572, 2753, 243, 578, 1869, 487]) ok(`one-line rule for ${n} x 11`, times11(n), n * 11);
ok('4786 x 11 one digit at a time', [6, 46, 646, 2646, 52646], [6, 46, 646, 2646, 4786 * 11]);
ok('x101, x1001, x99, x999', [4786 * 101, 76 * 101, 358 * 101, 412736 * 1001, 2323 * 1001, 6857 * 99, 31694 * 999],
  [483386, 7676, 36158, 413148736, 2325323, 678843, 31662306]);
ok('squares in 6.2', [43 ** 2, 47 ** 2, 103 ** 2, 52 ** 2, 98 ** 2, 69 ** 2, 41 ** 2, 296 ** 2, 97 * 103, 36 * 44], [1849, 2209, 10609, 2704, 9604, 4761, 1681, 87616, 9991, 1584]);
ok('Pattern 1 lines', [[3, 1, 4, 2], [4, 3, 7, 1], [7, 2, 9, 5], [6, 4, 10, 2], [8, 3, 11, 5]].map(([a, b, c, d]) => 2 * (a * a + b * b) === c * c + d * d), [true, true, true, true, true]);
ok('Pattern 2 lines', [[6, 2, 8, 4], [9, 5, 14, 4], [11, 3, 14, 8], [7, 4, 11, 3]].map(([a, b, c, d]) => a * a - b * b === c * d), [true, true, true, true]);
ok('Brahmagupta by parts', [37 * 20 + 37 * 6, 37 * 30 - 37 * 4, 37 * 26], [962, 962, 962]);
ok('plus pattern', [1, 2, 3, 4, 10, 15].map(k => k * k + 4 * k), [5, 12, 21, 32, 140, 285]);
is('plus pattern: the three methods agree, and Fig. 6.7 draws them', [1, 2, 3, 20].every(k => new Set([k * k + 4 * k, (k + 2) ** 2 - 4, k * (k + 2) + 2 * k]).size === 1));
ok('tile frame', [1, 2, 3, 4, 10].map(n => (n + 2) * (2 * n + 2) - 2 * n * n), [10, 16, 22, 28, 64]);
ok('four rectangles, m = 2, n = 5', [(2 + 5) ** 2 - 4 * 10, (5 - 2) ** 2], [9, 9]);
ok('crossing strips, x = 20, y = 6', [2 * 120 - 36, 120 + 6 * 14, 400 - 14 ** 2], [204, 204, 204]);
ok('rug, 5 by 4, r = 0.5', [20 - 4 * 3, 2 * 5 * 0.5 + 2 * 0.5 * 3], [8, 8]);
ok('Mistakes: which are right', [['4a(2a - 3b)', '8a - 12b'], ['3(y + 2) - 2(y - 1)', 'y + 4'], ['(p + 3)^2', 'p^2 + 9'], ['(2m - n)^2', '4m^2 - 4mn + n^2'], ['5k + 2k^2', '7k^3'], ['(a - 3)(a + 5)', 'a^2 + 2a - 15']]
  .map(([l, r], i) => same(l, r) ? i + 1 : 0).filter(Boolean), [4, 6]);
for (const [l, r] of [['4a(2a - 3b)', '8a^2 - 12ab'], ['3(y + 2) - 2(y - 1)', 'y + 8'], ['(p + 3)^2', 'p^2 + 6p + 9']]) { is(`Mistakes: ${l} = ${r}`, same(l, r)); has(answersMd, `$${r}$`); }
// Exercise Set 6.1
for (const [q, a] of [['(4 + m)(n - 2)', '4n - 8 + mn - 2m'], ['\\frac{3}{4}(8 + 12b)', '6 + 9b'], ['(x - 5)(2 - x)', '-x^2 + 7x - 10'], ['(-3p + q)(r + s)', '-3pr - 3ps + qr + qs'],
  ['(7 + y)(z + 4)', '7z + 28 + yz + 4y'], ['(2a - 3b)(4c + d)', '8ac + 2ad - 12bc - 3bd'], ['(2x + y - 3)(x + 4)', '2x^2 + xy + 5x + 4y - 12'], ['(p^2 - 2p + 5)(3 - p)', '-p^3 + 5p^2 - 11p + 15'],
  ['(x + 9)(x + 10)', 'x^2 + 19x + 90']]) { is(`6.1: ${q} = ${a}`, same(q, a)); has(answersMd, `$${a}$`); }
ok('6.1 Q2 pairs', [[3, 4], [6, 6], [9, 8]].map(([a, b]) => (a + 3) * (b - 2) === a * b), [true, true, true]);
ok('6.1 Q5', 47 * 63 - 45 * 60, 3 * 45 + 2 * 60 + 6);
// Exercise Set 6.2
ok('6.2', [75 ** 2 - 25 ** 2, 7 ** 2 - 1, 8 ** 2 - 16, 13 ** 2 - 11 ** 2, 502 ** 2, 89 ** 2, 215 ** 2, 998 ** 2, 61 ** 2, 1.5 ** 2 - 0.5 ** 2],
  [5000, 48, 48, 48, 252004, 7921, 46225, 996004, 3721, 2]);
// Exercise Set 6.3
ok('6.3 Q1', [53 ** 2, 79 ** 2, 296 * 304, 61 * 63], [2809, 6241, 89984, 3843]);
for (const [q, a] of [['(q - 2)(q + 13)', 'q^2 + 11q - 26'], ['(4m - 7n)(4m + 7n)', '16m^2 - 49n^2'], ['-(3x + 2)(x + 5)', '-3x^2 - 17x - 10'], ['(5a + 3b)^2', '25a^2 + 30ab + 9b^2'],
  ['(3y - \\frac{1}{3})^2', '9y^2 - 2y + \\frac{1}{9}'], ['(4s) \\times (2t) \\times (s - 3)', '8s^2t - 24st']]) { is(`6.3 Q2: ${q} = ${a}`, same(q, a)); has(answersMd, `$${a}$`); }
is('6.3 Q3', same('(n + 5)^2 - (n - 5)^2', '20n'));
ok('6.3 Q4 true or false', [same('(m + 2)(m + 3) - m(m + 5)', '6'), [0, 1, 2, 3].every(k => ((2 * k + 1) * (2 * k + 3)) % 2 === 0),
  [0, 1, 2, 3, 4].every(n => ((n + 4) ** 2 - (n + 2) ** 2) % 8 === 0), [0, 1, 2, 3, 4, 5].every(p => ((3 * p + 1) ** 2 - (3 * p - 1) ** 2) % 12 === 0)], [true, false, false, true]);
ok('6.3 Q6', [65 ** 2, 105 ** 2, 100 * 42 + 25, 100 * 110 + 25], [4225, 11025, 4225, 11025]);
ok('6.3 Q7', [35 * 45 - 32 * 48, 59 * 61 - 58 * 62], [39, 3]);
is('6.3 Q8', same('(x + 5)(x + 2) - x^2', '7x + 10') && same('5(x + 2) + 2x', '7x + 10'));
is('6.3 Q9', same('(a + b + c)^2', 'a^2 + b^2 + c^2 + 2ab + 2bc + 2ca'));
// By the Book, values the key prints
ok('By the Book values', [104 * 96, 40 ** 2, Math.round((7.2 ** 2 - 2.8 ** 2) * 100) / 100, 81 - 28, 195 - 180, 3572 * 11, Math.round(10.3 ** 2 * 100) / 100, 49.5 * 50.5, 144 / 16, 16 * 8,
  (2 * 2 - 3) ** 2, 25 + 48, 5047 * 101, 638 * 99, (57 - 9) / 6, 38 * 57 - 37 * 55], [9984, 1600, 44, 53, 15, 39292, 106.09, 2499.75, 9, 128, 1, 73, 509747, 63162, 8, 131]);
is('By the Book 5: the first number exists', Number.isInteger(180 / 15));
ok('By the Book long answers', [Math.sqrt(119 + 25), 17 * 7, 15 * 12 - 11 * 8, 10 ** 2, (17 ** 2 - 7 ** 2) / 4, 37 ** 2 % 8, Math.sqrt(336 + 64), 28 * 12, 100 - 91, ((7 + 3) ** 2 - 9) / 7 - 6, 96 / 12, 11 ** 2 - 5 ** 2, 76 * 11],
  [12, 119, 92, 100, 60, 1, 20, 336, 9, 7, 8, 96, 836]);
ok('By the Book cases', [15 ** 2, 180 / 12, 48 * 52, 71 ** 2, 99 ** 2, 243 * 11, 578 * 11, 1869 * 11, (4 * 20 * 2 + 4 * 4) * 50, 5 * 8, 6 + 1, 7 * 10],
  [225, 15, 2496, 5041, 9801, 2673, 6358, 20559, 8800, 40, 7, 70]);
is('By the Book 40: the table', [1, 2, 3].every((n, i) => (n + 1) * (n + 4) === [10, 18, 28][i]));
is('By the Book 48: the table', [1, 2, 3].every((x, i) => (x + 4) ** 2 === [25, 36, 49][i]));
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
