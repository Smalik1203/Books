#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed from first principles — factorisations, divisor counts, powers,
   searches — and compared with what is on the page.

     node pages/class-8/ch01-square-and-cube/check-numbers.mjs

   Four parts:
     A  every identity set as maths, on every page and in ANSWERS.md, whose
        sides all evaluate to numbers
     B  the claims A cannot check: counts, classifications, searches, and
        the practice answers, read back out of the answer key
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

const factorise = (n) => { const o = {}; for (let d = 2; d * d <= n; d++) while (n % d === 0) { o[d] = (o[d] || 0) + 1; n /= d; } if (n > 1) o[n] = (o[n] || 0) + 1; return o; };
const divisors = (n) => { const o = []; for (let d = 1; d <= n; d++) if (n % d === 0) o.push(d); return o; };
const isSquare = (n) => Number.isInteger(n) && n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;
const isCube = (n) => Number.isInteger(n) && Math.round(Math.cbrt(n)) ** 3 === n;
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const lcm = (...xs) => xs.reduce((a, b) => a * b / gcd(a, b));
// smallest k with n*k a perfect p-th power, and smallest k with n/k one
const mulTo = (n, p) => Object.entries(factorise(n)).reduce((k, [q, e]) => k * Number(q) ** ((p - e % p) % p), 1);
const divTo = (n, p) => Object.entries(factorise(n)).reduce((k, [q, e]) => k * Number(q) ** (e % p), 1);
const trailingZeros = (n) => { let z = 0; while (n > 0 && n % 10 === 0) { z++; n /= 10; } return z; };
const nearestRoot = (n) => { const r = Math.floor(Math.sqrt(n)); return n - r * r <= (r + 1) ** 2 - n ? r : r + 1; };
const tri = (n) => n * (n + 1) / 2;
const diffs = (xs) => xs.slice(1).map((x, i) => x - xs[i]);
const roundsToFlat = (xs) => { let r = 0; while (new Set(xs).size > 1) { xs = diffs(xs); r++; } return [r, xs[0]]; };

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/\s+/g, ' ');

/* ---- A. every identity ---------------------------------------- */

// LaTeX to a JS expression, or null when a side is not pure arithmetic
function toExpr(side) {
  side = side.replace(/,\s*$/, '').replace(/^(\d+) \+ (\d+) \+ \\cdots \+ (\d+)$/, (m, a, b, z) => { const d = b - a; let t = 0; for (let x = +a; x <= +z; x += d) t += x; return String(t); });
  let s = side
    .replace(/\\left|\\right/g, '')
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\tfrac(\d)(\d)/g, '(($1)/($2))')
    .replace(/\\sqrt\[3\]\{([^{}]+)\}/g, 'Math.cbrt($1)')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'Math.sqrt($1)')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad/g, '')
    .replace(/\^\{([^{}]+)\}/g, '**($1)').replace(/\^(\d)/g, '**$1')
    .replace(/\s+/g, '');
  if (!s || !/^(Math\.(sqrt|cbrt)|[-+*/().0-9])+$/.test(s)) return null;
  // juxtaposed brackets are a product: (40+5)(40+5)
  s = s.replace(/\)\(/g, ')*(');
  return s;
}
const evalExpr = (e) => { try { return Function(`"use strict";return (${e})`)(); } catch { return NaN; } };

let spans = 0; const skipped = [];
// an assertion printed to be judged false is not an identity the page claims
const FALSE_ON_PURPOSE = ['(-4)^2 = -16'];
const sources = [...pages.map(f => [f, html[f]]), ['ANSWERS.md', answersMd]];
for (const [f, src] of sources) {
  for (const m of src.matchAll(/\$([^$]+)\$/g)) {
    const span = m[1];
    if (!span.includes('=') || FALSE_ON_PURPOSE.includes(span.trim())) continue;
    for (const part of span.split(/\\qquad|,\s*\\ /)) {
      const sides = part.split('=').map(s => s.trim()).filter(Boolean);
      if (sides.length < 2) continue;
      const vals = sides.map(toExpr);
      if (vals.filter(v => v !== null).length >= 2 && vals.some(v => v === null)) { vals.splice(0, vals.length, ...vals.filter(v => v !== null)); }
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
ok('open lockers of 100', [...Array(100)].map((_, i) => i + 1).filter(n => divisors(n).length % 2), [1, 4, 9, 16, 25, 36, 49, 64, 81, 100]);
ok('factors of 16', divisors(16), [1, 2, 4, 8, 16]);
ok('last digits of 1..20 squared', [...Array(20)].map((_, i) => (i + 1) ** 2 % 10), [1, 4, 9, 6, 5, 6, 9, 4, 1, 0, 1, 4, 9, 6, 5, 6, 9, 4, 1, 0]);
ok('last digits of cubes', [...Array(10)].map((_, i) => i ** 3 % 10), [0, 1, 8, 7, 4, 5, 6, 3, 2, 9]);
ok('numbers between 16^2 and 17^2', 17 ** 2 - 16 ** 2 - 1, 32);
ok('numbers between 99^2 and 100^2', 100 ** 2 - 99 ** 2 - 1, 198);
ok('subtracting odd numbers from 38', (() => { const o = []; let n = 38; for (let k = 1; n > 0; k += 2) { n -= k; o.push(n); } return o; })(), [37, 34, 29, 22, 13, 2, -11]);
ok('cubes below 30, below 1000; squares below 1000', [[1, 2, 3, 4].filter(n => n ** 3 < 30).length, [...Array(10)].map((_, i) => i + 1).filter(n => n ** 3 < 1000).length, [...Array(40)].map((_, i) => i + 1).filter(n => n * n < 1000).length], [3, 9, 31]);
ok('1729 is the first number with two cube pairs', (() => { for (let n = 2; ; n++) { let c = 0; for (let a = 1; 2 * a ** 3 <= n; a++) if (isCube(n - a ** 3)) c++; if (c >= 2) return n; } })(), 1729);
ok('Example 6: multiply 9408 by', [mulTo(9408, 2), Math.sqrt(9408 * 3)], [3, 168]);
ok('Example 7: smallest square divisible by 4, 9, 10', lcm(4, 9, 10) * mulTo(lcm(4, 9, 10), 2), 900);
ok('Example 11: 3375 and 500', [isCube(3375), isCube(500)], [true, false]);
ok('156 x 39 = 78^2', [mulTo(156, 2), Math.sqrt(156 * 39)], [39, 78]);
ok('fourth powers flatten at 24', roundsToFlat([1, 16, 81, 256, 625, 1296]), [4, 24]);
ok('cubes flatten at 6', roundsToFlat([1, 8, 27, 64, 125, 216]), [3, 6]);
ok('12167 and 32768 cube roots', [Math.cbrt(12167), Math.round(Math.cbrt(32768))], [23, 32]);
is('4900 is not a cube', !isCube(4900));
is('2000 is not a cube', !isCube(2000));

// Stage 1
ok('Stage 1 Q1: numbers with five factors', [...Array(200)].map((_, i) => i + 1).filter(n => divisors(n).length === 5).slice(0, 2), [16, 81]);
ok('Stage 1 Q1: 100 has nine factors', divisors(100).length, 9);
ok('Stage 1 Q2', [...Array(25)].map((_, i) => 51 + 2 * i).reduce((a, b) => a + b), 1875);
is('Stage 1 Q3: n^2+n never a square to 10^5', [...Array(100000)].every((_, i) => !isSquare((i + 1) ** 2 + i + 1)));
ok('Stage 1 Q4: smallest n with 2n square, 3n cube', (() => { for (let n = 1; ; n++) if (isSquare(2 * n) && isCube(3 * n)) return n; })(), 72);
is('Stage 1 Q6: odd squares leave 1 mod 8', [...Array(500)].every((_, i) => ((2 * i + 1) ** 2) % 8 === 1));
ok('Stage 1 Q6: 2019 mod 8', 2019 % 8, 3);
ok('Stage 1 Q7: digit counts of two-digit squares', [...new Set([...Array(90)].map((_, i) => String((i + 10) ** 2).length))], [3, 4]);
ok('Stage 1 Q7: first four-digit square', [...Array(90)].map((_, i) => i + 10).find(n => n * n >= 1000), 32);
const pairs2 = (n) => { let c = 0; for (let a = 1; 2 * a * a <= n; a++) if (isSquare(n - a * a) && n - a * a > 0) c++; return c; };
ok('Stage 1 Q8: first number with two square pairs', (() => { for (let n = 2; ; n++) if (pairs2(n) >= 2) return n; })(), 50);
ok('Stage 1 Q8: 25, 34, 45 give exactly one', [25, 34, 45].map(pairs2), [1, 1, 1]);

// Stage 2
ok('Ex 1: factor counts of 81, 45, 100, 72', [81, 45, 100, 72].map(n => divisors(n).length), [5, 6, 9, 12]);
ok('Ex 1: factor lists', [81, 45, 100, 72].map(n => divisors(n).join(', ')), [
  ...['81', '45', '100', '72'].map(n => text(beyond).match(new RegExp(`\\b${n}: ((?:\\d+, )+\\d+)`))[1])]);
ok('Ex 2: factors of 196', divisors(196).length, 9);
ok('Ex 3: which cannot be squares', [3528, 6724, 5000, 91003].filter(n => !isSquare(n)), [3528, 5000, 91003]);
ok('Ex 3: 6724 is a square', isSquare(6724), true);
ok('Ex 4: endings whose square ends in 9', [...Array(10)].map((_, i) => i).filter(d => d * d % 10 === 9), [3, 7]);
ok('Ex 7: numbers between 25^2 and 26^2', [26 ** 2 - 25 ** 2 - 1, 25 ** 2 + 1, 26 ** 2 - 1], [50, 626, 675]);
ok('Ex 8: triangular numbers adding to 144', [tri(11), tri(12)], [66, 78]);
ok('Ex 10: 1800', [mulTo(1800, 2), Math.sqrt(1800 * 2)], [2, 60]);
ok('Ex 11: 3380', [divTo(3380, 2), Math.sqrt(3380 / 5)], [5, 26]);
ok('Ex 13: garden of 500', nearestRoot(500), 22);
ok('Ex 14: 2560', [mulTo(2560, 3), Math.round(Math.cbrt(2560 * 25))], [25, 40]);
ok('Ex 15: 4375', [divTo(4375, 3), Math.round(Math.cbrt(4375 / 35))], [35, 5]);
ok('Ex 18: list flattens like squares', roundsToFlat([5, 8, 13, 20, 29, 40]), [2, 2]);
ok('Ex 18: n^2 + 4', [1, 2, 3, 4, 5, 6].map(n => n * n + 4), [5, 8, 13, 20, 29, 40]);

// the practice answers, read back out of the key rather than typed here
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= text(m[2]);
// a lettered row is checked part by part: a right number in (a) must not
// hide a wrong one in (c), which is how a whole-row check was fooled once
const row = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const r = keyRows[n] || '';
  if (!part) return r;
  const m = r.match(new RegExp(`\\(${part}\\)([^(]*)`));
  return m ? m[1] : '';
};
const says = (q, ...vals) => { for (const v of vals) is(`key ${q} should say ${v}: "${row(q)}"`, new RegExp(`(^|[^\\d])${String(v).replace('.', '\\.')}([^\\d]|$)`).test(row(q))); };
const nearer = (q, n) => is(`key ${q} should say nearer ${nearestRoot(n)}: "${row(q)}"`, new RegExp(`nearer ${nearestRoot(n)}\\b`).test(row(q)));
says(20, 2 * 12 - 1, 12 ** 2);
says(21, -Math.cbrt(343));
is('Q22: 7^3 * 2^2 is not a cube', !isCube(343 * 4));
says(23, mulTo(1250, 3), Math.round(Math.cbrt(1250 * mulTo(1250, 3))));
says(24, Math.sqrt(5929));
says(25, Math.sqrt(2025), 4 * Math.sqrt(2025));
says(26, Math.sqrt(4 * 81 * 49));
{ const r = [...Array(40)].map((_, i) => i).find(n => tri(n) + tri(n + 1) === 400); says(27, tri(r), tri(r + 1), r, r + 1); }
says(28, 5 ** 3, 3 ** 3, 6 * 9);
is('Q28: the small cubes add up', 8 + 12 * 3 + 6 * 9 + 27 === 125);
says(29, Math.sqrt(32 * 18), 2 * (32 + 18), 4 * Math.sqrt(32 * 18), 2 * (32 + 18) - 4 * Math.sqrt(32 * 18));
{ const table = [216, 343, 1331]; says('30a', ...table.map(n => Math.round(Math.cbrt(n)))); says('30b', 343 - 216);
  const e = Math.floor(Math.cbrt(250)); says('30c', e, 250 - e ** 3); }
says('31a', ...[169, 289, 400].map(Math.sqrt));
says('31b', 15 ** 2 - 169, 15);
says('31c', Math.floor(Math.sqrt(300)), Math.floor(Math.sqrt(300)) + 1);
nearer('31c', 300);
is('Q31: 169, 289, 400 are squares', [169, 289, 400].every(isSquare));

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) {
  const n = Number(m[1] || 1);
  if (/c-practice__head/.test(beyond) && n) qs[n] = m[2];
}
const optsOf = (n) => [...(qs[n] || '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => text(x[1]).trim());
const num = (s) => Number(s.replace(/\$/g, '').replace(/\\,/g, '').trim());
const key = {};
for (const m of text(beyond.slice(beyond.indexOf('<ol class="c-answers">'), beyond.indexOf('</ol>', beyond.indexOf('<ol class="c-answers">')))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2];

const solve = {
  1: o => o.map(num).map(v => v === 17 ** 2),
  2: o => o.map(num).map(v => !isSquare(v) && [2, 3, 7, 8].includes(v % 10)),
  3: o => o.map(num).map(v => v === 15 ** 2),
  4: o => o.map(num).map(v => v === divisors(36).length),
  5: o => o.map(num).map(v => Math.abs(v - 0.3 ** 2) < 1e-12),
  6: o => o.map(num).map(v => v === trailingZeros(300 ** 2)),
  7: o => o.map(num).map(v => v === 99 ** 2 % 10),
  8: o => o.map(num).map(v => v === mulTo(45, 2)),
  9: o => o.map(num).map(v => v * v === 6561),
  10: o => o.map(num).map(v => v ** 3 === 13824),
  11: o => o.map(num).map(v => v === lcm(8, 12, 15) * mulTo(lcm(8, 12, 15), 2)),
  12: o => o.map(num).map(v => v === 50 ** 2 - 49 ** 2),
  13: o => o.map(s => s === `$${[...Array(10)].map((_, i) => i).find(d => d ** 3 % 10 === 3)}$`),
  14: o => o.map(num).map(v => v ** 3 === 91125),
  15: o => o.map(s => /no such/.test(s) ? ![...Array(100)].some((_, n) => n * n + n === 110) : num(s) * num(s) + num(s) === 110),
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
  16: [!isCube(16000), true, trailingZeros(16000) % 3 !== 0],
  17: [isCube(2 ** 6 * 3 ** 3), true, true],
  18: [isSquare(7744), [4, 14, 24, 34].every(isSquare), false],
  19: [(-4) ** 2 === -16, (-4) ** 2 > 0, false],
};
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-19', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(19)].map((_, i) => i + 1));

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
const mdLine = answersMd.slice(answersMd.indexOf('as the key prints it'));
for (const m of mdLine.slice(0, 400).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2];
ok('ANSWERS.md key matches the page', mdKey, key);

// ANSWERS.md, body exercise claims not already caught by A
ok('Ex 1.1 Q1: open or shut', [18, 25, 30, 49].map(n => divisors(n).length % 2 ? 'open' : 'shut'), ['shut', 'open', 'shut', 'open']);
ok('Ex 1.1 Q3: open lockers of 200', [...Array(200)].map((_, i) => i + 1).filter(isSquare).length, 14);
ok('Ex 1.1 Q4: three factors', [...Array(50)].map((_, i) => i + 1).filter(n => divisors(n).length === 3).slice(0, 2), [4, 9]);
ok('Ex 1.2 Q1', [4093, 6250, 1444, 8877].filter(n => [2, 3, 7, 8].includes(n % 10) || trailingZeros(n) % 2), [4093, 6250, 8877]);
ok('Ex 1.2 Q3', [...Array(10)].map((_, i) => i).filter(d => d * d % 10 === 6), [4, 6]);
ok('Ex 1.2 Q4', trailingZeros(4000 ** 2), 6);
ok('Ex 1.2 Q6', [64, 108, 292, 36].filter(n => n * n % 10 === 4), [108, 292]);
ok('Ex 1.3 Q3', [[16, 17], [40, 41], [99, 100]].map(([a, b]) => b * b - a * a - 1), [32, 80, 198]);
ok('Ex 1.4 Q6', [80, 300, 1000].map(nearestRoot), [9, 17, 32]);
ok('Ex 1.4 Q3-5', [mulTo(2800, 2), divTo(2925, 2), lcm(14, 20, 35) * mulTo(lcm(14, 20, 35), 2)], [7, 13, 4900]);
ok('Ex 1.5 Q2-3', [mulTo(1323, 3), divTo(8640, 3)], [7, 5]);
ok('Ex 1.5 Q4 (c)(d): digit counts of two-digit cubes', [String(10 ** 3).length, String(99 ** 3).length], [4, 6]);
ok('Ex 1.6 Q1', [64, 216, 1000, 4225].map(n => (isSquare(n) ? 'S' : '') + (isCube(n) ? 'C' : '')), ['SC', 'C', 'C', 'S']);
ok('Ex 1.6 Q3', [2744, 9261, 54872].map(n => Math.round(Math.cbrt(n))), [14, 21, 38]);
ok('Ex 1.6 Q5', [[...Array(99)].map((_, i) => i + 101).filter(isSquare).length, [...Array(900)].map((_, i) => i + 100).filter(isCube).length], [4, 5]);
ok('Ex 1.6 Q7', divTo(7290, 3), 10);
ok('Ex 1.6 Q8', [[...Array(9999)].map((_, i) => i + 1).filter(isSquare).length, [...Array(9999)].map((_, i) => i + 1).filter(isCube).length], [99, 21]);
ok('Ex 1.6 Q9', [isSquare(1800), nearestRoot(1800)], [false, 42]);
ok('Ex 1.6 Q14', roundsToFlat([2, 9, 28, 65, 126, 217]), [3, 6]);
ok('Ex 1.6 Q15', [...Array(5000)].map((_, i) => i + 1).filter(n => isSquare(n) && isCube(n)).slice(0, 4), [1, 64, 729, 4096]);
ok('Ex 1.6 Q18', roundsToFlat([1, 2, 3, 4, 5].map(n => n * n + n ** 3))[0], 3);
ok('Ex 1.6 Q19', [isSquare(26), isSquare(1001), JSON.stringify(factorise(1001))], [false, false, '{"7":1,"11":1,"13":1}']);
ok('taxicab 4104 and 13832', [4104, 13832].map(n => { const o = []; for (let a = 1; 2 * a ** 3 <= n; a++) if (isCube(n - a ** 3)) o.push(a); return o; }), [[2, 9], [2, 18]]);

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
