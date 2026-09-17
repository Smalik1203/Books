#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed — powers (exactly, with BigInt where they are large), last
   digits, searches, orderings — and compared with what is on the page.

     node pages/class-8/ch02-power-play/check-numbers.mjs [--skipped]

   Four parts:
     A  every identity set as maths, on every page and in ANSWERS.md, whose
        sides all evaluate to numbers (a chain broken by \approx is checked
        one exact run at a time)
     B  the claims A cannot check: rounded values, digit counts, searches,
        orderings, and the practice answers read back out of the answer key,
        one lettered part at a time
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
const isSquare = (n) => Number.isInteger(n) && n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n;
const isCube = (n) => Number.isInteger(n) && Math.round(Math.cbrt(n)) ** 3 === n;
const mulTo = (n, p) => Object.entries(factorise(n)).reduce((k, [q, e]) => k * Number(q) ** ((p - e % p) % p), 1);
const big = (b, e) => BigInt(b) ** BigInt(e);
const lastDigit = (b, e) => Number(big(b, e) % 10n);
const digits = (b, e) => String(big(b, e)).length;
const isPowerOf2 = (n) => Number.isInteger(n) && n > 0 && (n & (n - 1)) === 0;
const round = (x, d) => Number(x.toFixed(d));
const sig = (x, s) => Number(x.toPrecision(s));
const close = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/\\,/g, '').replace(/\s+/g, ' ');
const all = text(body + beyond);
const says = (where, re, what) => is(`${what}: /${re.source}/ not found`, re.test(where));

/* ---- A. every identity ---------------------------------------- */

function toExpr(side) {
  let s = side
    .replace(/,\s*$/, '')
    .replace(/\\left|\\right/g, '')
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\[td]?frac(\d)(\d)/g, '(($1)/($2))')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'Math.sqrt($1)')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad/g, '')
    .replace(/\^\{([^{}]+)\}/g, '**($1)').replace(/\^(\d)/g, '**$1')
    .replace(/\s+/g, '');
  if (!s || !/^(Math\.sqrt|[-+*/().0-9])+$/.test(s)) return null;
  s = s.replace(/\)\(/g, ')*(');
  // a minus in front of a power belongs to the whole power: -4^2 is -16
  s = s.replace(/(^|[(+*/-])-(\d+(?:\.\d+)?\*\*(?:\([^()]*\)|\d+))/g, '$1(-($2))');
  return s;
}
const evalExpr = (e) => { try { return Function(`"use strict";return (${e})`)(); } catch { return NaN; } };

let spans = 0; const skipped = [];
// printed as the two sides of a pull that no value satisfies
const FALSE_ON_PURPOSE = ['0^0 = 0', '0^0 = 1',
  // Exercise Set 2.2 Q6: four statements printed to be explained as wrong
  '3^4 \\times 3^2 = 3^8', '2^5 + 2^5 = 2^{10}', '5^6 \\div 5^2 = 1^3', '2^3 \\times 5^4 = 10^7'];
const sources = [...pages.map(f => [f, html[f]]), ['ANSWERS.md', answersMd]];
for (const [f, src] of sources) {
  for (const m of src.matchAll(/\$([^$]+)\$/g)) {
    const span = m[1].trim();
    if (!span.includes('=') || FALSE_ON_PURPOSE.includes(span)) continue;
    for (const part of span.split(/\\qquad|,\s*\\ /)) {
      for (const run of part.split(/\\approx/)) {
        const sides = run.split('=').map(s => s.trim()).filter(Boolean);
        if (sides.length < 2) continue;
        let vals = sides.map(toExpr);
        if (vals.filter(v => v !== null).length >= 2) vals = vals.filter(v => v !== null);
        if (vals.some(v => v === null) || vals.length < 2) { skipped.push(`${f}: $${run.trim()}$`); continue; }
        const nums = vals.map(evalExpr);
        if (nums.some(n => !Number.isFinite(n))) { skipped.push(`${f}: $${run.trim()}$`); continue; }
        spans++;
        if (nums.some(n => !close(n, nums[0]))) fails.push(`${f}: $${run.trim()}$ — sides are ${nums.join(' and ')}`);
        else pass++;
      }
    }
  }
}

/* ---- B. claims arithmetic alone does not check ---------------- */

// the folded sheet: 0.001 cm doubled, as the opener's table prints it
const cm = (n) => 0.001 * 2 ** n;
ok('7 folds, cm', round(cm(7), 3), 0.128);
ok('10 folds, cm', round(cm(10), 2), 1.02);
ok('17 folds, m', round(cm(17) / 100, 2), 1.31);
ok('26 folds, m', Math.round(cm(26) / 100), 671);
ok('30 folds, km', round(cm(30) / 1e5, 1), 10.7);
ok('46 folds, km', Math.round(cm(46) / 1e5), 703687);
says(all, /\$671\$ m/, 'table: 671 m'); says(all, /\$703687\$ km/, 'table: 703 687 km');
ok('46 folds: four-fifths of the way back', round((cm(46) / 1e5 - 384400) / 384400, 1), 0.8);
ok('46 folds exactly, standard form', sig(cm(46) / 1e5 / 1e5, 3), 7.04);
ok('estimate out by about a tenth', round(1 - 6.4 / (cm(46) / 1e10), 1), 0.1);
ok('doubling: tenth entry, and past half a million by the twentieth', [2 ** 9, 2 ** 19 > 5e5], [512, true]);
ok('Saturn about ten times further', Math.round(1.4335e12 / 1.496e11), 10);
ok('digits of 6.022e23 and 9.5e15', [String(602200000000000000000000n).length, String(9500000000000000n).length], [24, 16]);
ok('Ex 7: letter lock about three thousand times', Math.round(26 ** 6 / 1e5 / 1000) * 1000, 3000);
ok('Ex 7: 26^6 in standard form', sig(26 ** 6 / 1e8, 2), 3.1);
ok('Ex 7: (27/26)^6 about 1.25', round((27 / 26) ** 6, 2), 1.25);
ok('Ex 1: 32400 is a square of 180', [isSquare(32400), Math.sqrt(32400)], [true, 180]);
ok('p015: 142395 in standard form', 142395 / 1e5, 1.42395);

// Stage 1
ok('Q1: 2^60 over 60^3, to one figure', sig(2 ** 60 / 60 ** 3, 1), 5e12);
ok('Q1: table', [[...Array(10)].map((_, i) => 2 ** (i + 1)), [...Array(10)].map((_, i) => (i + 1) ** 3)], [
  [...beyond.matchAll(/<tr><th>\$2\^n\$<\/th>([\s\S]*?)<\/tr>/g)][0][1].match(/\d+/g).map(Number),
  [...beyond.matchAll(/<tr><th>\$n\^3\$<\/th>([\s\S]*?)<\/tr>/g)][0][1].match(/\d+/g).map(Number)]);
ok('Q1: 2^n ahead only at 1 up to 9', [...Array(9)].map((_, i) => i + 1).filter(n => 2 ** n > n ** 3), [1]);
ok('Q1: from 10, 2^n stays ahead (to 200)', [...Array(191)].map((_, i) => i + 10).every(n => big(2, n) > big(n, 3)), true);
ok('Q1: 11^3 under one and a half times 1000', 1331 < 1500, true);
ok('Q2: last digit of 7^100', lastDigit(7, 100), 1);
ok('Q2: cycle of 7', [1, 2, 3, 4, 5].map(e => lastDigit(7, e)), [7, 9, 3, 1, 7]);
ok('Q3: 2.4% and 1.024^10', [round((1024 - 1000) / 10, 1), round(1.024 ** 10, 2)], [2.4, 1.27]);
ok('Q3: 2^100 to three figures', sig(2 ** 100 / 1e30, 3), 1.27);
is('Q3: 2^100 > 10^30', big(2, 100) > big(10, 30));
is('Q4: 3^500 > 5^300', big(3, 500) > big(5, 300));
ok('Q4: margin around 10^29', Math.round(100 * Math.log10(243 / 125)), 29);
ok('Q5: smallest n with 3^n >= 10^6', [...Array(30)].findIndex((_, n) => 3 ** n >= 1e6), 13);
ok('Q6: 2^64 to two figures', [sig(2 ** 64 / 1e19, 2), 16e18 / 1e19], [1.8, 1.6]);
ok('Q6: rice mass', [sig(2 ** 64 * 0.025 / 1000 / 1e14, 2), sig(2 ** 64 * 0.025 / 1e6 / 1e11, 2)], [4.6, 4.6]);
ok('Q6: roughly a thousand years', Math.round(4.6e11 / 5e8 / 1000) * 1000, 1000);
ok('Q6: 1 + 2 + ... + 2^63 = 2^64 - 1', [...Array(64)].reduce((s, _, i) => s + big(2, i), 0n) === big(2, 64) - 1n, true);
ok('Q6: sums one short of the next power', [1 + 2, 1 + 2 + 4, 1 + 2 + 4 + 8], [2 ** 2 - 1, 2 ** 3 - 1, 2 ** 4 - 1]);
ok('Q8: fifth powers keep the last digit', [...Array(10)].map((_, d) => lastDigit(d, 5)), [...Array(10)].map((_, d) => d));
ok('Q8: every cycle has length 1, 2 or 4', [...new Set([...Array(10)].map((_, d) => { const c = [lastDigit(d, 1)]; for (let e = 2; lastDigit(d, e) !== c[0]; e++) c.push(lastDigit(d, e)); return c.length; }))].sort(), [1, 2, 4]);
ok('Q8: ninth and thirteenth powers too', [...Array(10)].every((_, d) => lastDigit(d, 9) === d && lastDigit(d, 13) === d), true);
ok('remark: digits of 2^100 and 3^500', [digits(2, 100), digits(3, 500)], [31, 239]);

// Stage 2
ok('Ex 1: 2352', [factorise(2352), mulTo(2352, 2), Math.sqrt(2352 * 3)], [{ 2: 4, 3: 1, 7: 2 }, 3, 84]);
is('Ex 1: 2352 is not a square', !isSquare(2352));
ok('Ex 4: n', [...Array(20)].findIndex((_, n) => (2 ** 3) ** n * 2 ** 2 === 2 ** 14), 4);
ok('Ex 10', [3 * 4 / (3 + 4)], [12 / 7]);
says(beyond, /Answer<\/span>\s*<span>\$\\dfrac\{12\}\{7\}\$/, 'Ex 10 answer');
ok('Ex 11: m', [...Array(20)].map((_, i) => i - 10).find(m => close(5 ** m / 5 ** -3, 5 ** 5)), 2);
ok('Ex 12: exponent of x', -2 * 3 + 4 - (-5), 3);
ok('Ex 13', round(3e4 + 5e2 + 7e-1 + 2e-3, 3), 30500.702);
ok('Ex 13: columns holding 0', ['thousands', 'hundreds', 'tens', 'units', 'tenths', 'hundredths', 'thousandths'].filter((_, i) => '0500702'[i] === '0'), ['thousands', 'tens', 'units', 'hundredths']);
ok('Ex 15: ascending', [3.2e-3, 4.1e-4, 2.9e-3, 1.5e-2].sort((a, b) => a - b), [4.1e-4, 2.9e-3, 3.2e-3, 1.5e-2]);
says(beyond, /4\.1 \\times 10\^\{-4\}\$, \$\\ 2\.9 \\times 10\^\{-3\}\$, \$\\ 3\.2 \\times 10\^\{-3\}\$, \$\\ 1\.5 \\times 10\^\{-2\}/, 'Ex 15 answer order');
ok('Ex 16', sig(4.5e5 * 300 / 1e8, 3), 1.35);
ok('Ex 17: factor about 5.6', round(4 ** 6 / 3 ** 6, 1), 5.6);
ok('Ex 18', 5 ** 3 * 10 ** 2, 12500);
ok('Ex 19: exact and estimate', [sig(2 ** 45 / 1e13, 2), 32e12 / 1e13], [3.5, 3.2]);
ok('Ex 20', [7 * 24 * 60 * 60, sig(604800, 1)], [604800, 6e5]);
ok('Ex 21', Number((big(3, 25) + big(7, 25)) % 10n), 0);
ok('Ex 21: 3^25 and 7^25 end in 3 and 7', [lastDigit(3, 25), lastDigit(7, 25)], [3, 7]);

// the practice answers, read back out of the key rather than typed here
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= text(m[2]);
const row = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const r = keyRows[n] || '';
  if (!part) return r;
  const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\)|$)`));
  return m ? m[1] : '';
};
const keySays = (q, ...vals) => { for (const v of vals) is(`key ${q} should say ${v}: "${row(q)}"`, new RegExp(`(^|[^\\d.])${String(v).replace('.', '\\.')}([^\\d]|$)`).test(row(q))); };
keySays(20, 3 + 2 + 1);                                           // 5^6
is('Q20: 125 x 25 x 5 is 5^6', 125 * 25 * 5 === 5 ** 6);
{ const v = 2 ** -1 + 3 ** 0 + 4 ** -1; const m = row(21).match(/\\tfrac(\d)(\d)\$$/);
  is(`key 21 should end in ${v * 4}/4: "${row(21)}"`, m && Number(m[1]) / Number(m[2]) === v); }
is('Q22', close(0.000305, 3.05e-4)); keySays(22, 3.05, -4);
{ const e = 2 * 3 + 3 - 2 - 2 * 4; ok('Q23 exponent', e, -1); is('Q23 value', close(9 ** 3 * 27 * 3 ** -2 / 81 ** 2, 1 / 3)); keySays(23, 1, 3); }
{ const x = [...Array(20)].findIndex((_, x) => x - 4 === 3); keySays(24, x); }
keySays(25, (26 ** 2 * 10 ** 3).toLocaleString('en-US').replace(/,/g, ''), sig(26 ** 2 * 1e3 / 1e5, 3));
{ const splits = 4 * 60 / 20; keySays(26, splits, 2 ** splits); }
{ const v = (2 ** 5) ** 2 * 7 ** 3 * 3 ** -2 / (8 ** 3 * 7 ** 2 * 3 ** -4); is('Q27 value', close(v, 126)); keySays(27, Math.round(v)); }
is('Q28: 3^50 > 2^75 > 5^25', big(3, 50) > big(2, 75) && big(2, 75) > big(5, 25));
keySays(28, 25);
{ const g = 26000 / 6.5e-4; ok('Q29', sig(g / 1e7, 2), 4); keySays(29, 4, 7); }
keySays('30b', 500 * 1024, sig(500 * 1024 / 1e5, 3));
{ const h = [...Array(30)].findIndex((_, n) => 500 * 2 ** n > 1e6); keySays('30c', 2 ** h, 2 ** (h - 1));
  // the hour count is read on its own: 11 also appears inside 2^{11}
  ok('key 30c: the hours', Number((row('30c').match(/after (\d+) hours/) || [])[1]), h); }
is('Q30: the table doubles from 500', [500, 1000, 2000, 4000].every((v, i) => v === 500 * 2 ** i));
keySays('31a', 34); is('Q31a: 16 GB is 2^34', 16 * 2 ** 30 === 2 ** 34);
{ const s = 2 ** 34 / (4 * 2 ** 20); keySays('31b', s, Math.log2(s)); }
keySays('31c', 12); is('Q31c: 2^40 about 10^12', Math.round(2 ** 40 / 1e12) === 1);

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] = m[2];
const optsOf = (n) => [...(qs[n] || '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => text(x[1]).trim());
const val = (s) => { const e = toExpr(s.replace(/\$/g, '').trim()); return e === null ? NaN : evalExpr(e); };
const key = {};
{ const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2]; }
const is2 = (s, e) => s.replace(/\$/g, '').trim() === e;
const solve = {
  1: o => o.map(s => close(val(s), 2 ** 5 * 2 ** 3)),
  2: o => o.map(s => close(val(s), (5 ** 2) ** 3)),
  3: o => o.map(s => close(val(s), 7 ** 9 / 7 ** 6)),
  4: o => o.map(s => close(val(s), 4 ** 3 * 5 ** 3)),
  // the value alone is not enough: standard form needs 1 <= coefficient < 10
  5: o => o.map(s => close(val(s), 0.00058) && /^\$[1-9]\./.test(s)),
  6: o => o.map(s => close(val(s), 3 ** 5 * 3 ** 2 / 3 ** 4)),
  7: o => { const v = o.map(val); return v.map(x => x === Math.max(...v)); },
  8: o => o.map(s => close(val(s), (2 / 5) ** -3)),
  9: o => o.map(s => 2 ** val(s) === 32),
  10: o => o.map(s => (big(2, 40) > big(3, 30) ? is2(s, '2^{40}') : big(2, 40) < big(3, 30) ? is2(s, '3^{30}') : /equal/.test(s))),
  11: o => o.map(s => val(s) === lastDigit(3, 2024)),
  12: o => o.map(s => !isPowerOf2(val(s))),
  13: o => { const r = 1.67e-27 / 9.11e-31; const d = o.map(s => Math.abs(Math.log10(val(s) / r))); return d.map(x => x === Math.min(...d)); },
  14: o => o.map(s => val(s) === 6.7e4),
  15: o => o.map(s => /at least \$1\$ and less than \$10\$/.test(s)),
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
  16: [(-1) ** 50 === 1, [-1, -2, -3.5].every(n => n ** 2 > 0 && n ** 4 > 0), true],
  17: [(2 ** 3) ** 2 === 2 ** 6, 2 ** 3 * 2 ** 2 === 2 ** 5, false],
  18: [close(10 ** -2, 0.01), 10 ** -2 < 0, false],
  19: [5 ** -2 < 0, close(5 ** -2, 1 / 25), false],
};
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-19', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(19)].map((_, i) => i + 1));
ok('practice runs 1-31 with no number twice', Object.keys(qs).map(Number).sort((a, b) => a - b), [...Array(31)].map((_, i) => i + 1));

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
const mdLine = answersMd.slice(answersMd.indexOf('as the key prints it'));
for (const m of mdLine.slice(0, 400).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2];
ok('ANSWERS.md key matches the page', mdKey, key);

// ANSWERS.md, body exercise claims not already caught by A
const md = answersMd.replace(/\\,/g, '');
const mdSays = (re, what) => says(md, re, `ANSWERS.md ${what}`);
ok('Ex 2.1 Q4 differences', [3 ** 4 - 3 * 4, 5 ** 3 - 15, 2 ** 6 - 6 ** 2], [69, 110, 28]);
mdSays(/by \*\*69\*\*[\s\S]*by \*\*110\*\*[\s\S]*by \*\*28\*\*/, 'Ex 2.1 Q4');
ok('Ex 2.1 Q5 signs', [(-7) ** 10 > 0, (-7) ** 11 > 0, -(7 ** 10) > 0, (-1) ** 99 > 0], [true, false, false, false]);
ok('Ex 2.1 Q6', [isSquare(3600), Math.sqrt(3600)], [true, 60]);
ok('Ex 2.2 Q5: exponents for bases 4 and 8, none for 3', [Math.log(2 ** 12) / Math.log(4), Math.round(Math.log(2 ** 12) / Math.log(8)), Number.isInteger(Math.log(2 ** 12) / Math.log(3))], [6, 4, false]);
ok('Ex 2.2 Q6 (d)', 2 ** 3 * 5 ** 4, 5000);
ok('Ex 2.2 Q7: pond full on day 30', [29, 28].map(d => 2 ** (d - 30)), [1 / 2, 1 / 4]);
mdSays(/\*\*day 29\*\*[\s\S]*\*\*day 28\*\*/, 'Ex 2.2 Q7');
is('Ex 2.2 Q8: 2^20 > 10^6', 2 ** 20 > 1e6);
ok('Ex 2.2 numbering on the page', [...body.matchAll(/data-start="(\d+)">\s*<li>(Write \$2\^\{12\}|Explain in one|A pond|Which is larger, \$2\^\{20\})/g)].map(m => m[1]), ['5', '6', '7', '8']);
ok('Ex 2.3 Q4', 4 - (-2), 6);
ok('Ex 2.3 Q5 order', [-2, 0, -5, 1, -1].sort((a, b) => a - b), [-5, -2, -1, 0, 1]);
mdSays(/\$3\^\{-5\}\$, \$3\^\{-2\}\$, \$3\^\{-1\}\$, \$3\^0\$, \$3\^1\$/, 'Ex 2.3 Q5');
ok('Ex 2.3 Q6 exponents', [5 - 9, 12 - 9], [-4, 3]);
ok('Ex 2.4 Q2 page numbers', ['65950', '3430000', '7004000000', '608000'].map(Number), [65950, 3430000, 7004000000, 608000]);
says(text(body), /65950.*3430000.*7004000000.*608000/, 'Ex 2.4 Q2 as printed');
ok('Ex 2.4 Q4', [3.4e7 > 8.1e6, 2.9e-4 > 7.7e-5, 5e9 > 4.9e9], [true, true, true]);
ok('Ex 2.4 Q5', [round(5.976 / 7.35, 3), Math.round(5.976e24 / 7.35e22), Math.round(5.976e24 / 7.35e22 / 10) * 10], [0.813, 81, 80]);
mdSays(/\*\*about 80 times\*\*/, 'Ex 2.4 Q5');
ok('Ex 2.5 Q2: fewest digits for 8.5 billion', [...Array(15)].findIndex((_, d) => 10 ** d >= 8.5e9), 10);
ok('Ex 2.5 Q3', 3 * 4 * 2, 24);
ok('Ex 2.5 Q4 factor', round((36 / 26) ** 4, 1), 3.7);
ok('Ex 2.5 Q6', 9 * 10 ** 5, 900000);
ok('Ex 2.6 Q1', lastDigit(2, 24 + 2 * 32), 6);
mdSays(/units digit is \*\*6\*\*/, 'Ex 2.6 Q1');
ok('Ex 2.6 Q3 (a)', [isSquare(8) && isCube(8), isSquare(64) && isCube(64)], [false, true]);
ok('Ex 2.6 Q3 (e)', [46 % 4, 46 % 6], [2, 4]);
ok('Ex 2.6 Q4', [1.2 ** 2, 0.12 ** 2, 0.012 ** 2, 120 ** 2].map(x => sig(x, 3)), [1.44, 0.0144, 0.000144, 14400]);
ok('Ex 2.6 Q5: which three equal 6^6', [2 ** 6 * 3 ** 6, 6 ** 4 * 6 ** 2, 36 ** 3, 6 ** 12, 2 ** 4 * 3 ** 6].map(v => v === 6 ** 6), [true, true, true, false, false]);
ok('Ex 2.6 Q5: 6^6', 6 ** 6, 46656);
ok('Ex 2.6 Q6', [3 ** 4 > 4 ** 3, 2 ** 8 > 8 ** 2, big(2, 100) > 10000n], [true, true, true]);
ok('Ex 2.6 Q9', [sig(8e9 * 30 / 1e11, 2), sig(2.4e11, 1) / 1e11], [2.4, 2]);
ok('Ex 2.6 Q10', 2 ** 30, 1073741824);
ok('billion seconds: years and months', [round(1e9 / 3.15e7, 1), Math.round((1e9 / 3.15e7 % 1) * 12)], [31.7, 9]);
ok('billion seconds before September 2026', Math.floor(2026 + 8.5 / 12 - 1e9 / 3.15e7), 1994);
mdSays(/nearly \*\*31 years and 9 months\*\*/, 'T&R billion seconds');
ok('Ex 2.7 Q1 instance', 80 * 60 * 24 * 365 * 13, 546624000);
ok('Ex 2.7 Q3 instance', [round(2.1e6 / 3.844e5, 1)], [5.5]);
ok('Ex 2.7 Q4 instance', [1.5 * 3600 * 365 * 70, 24 * 3600 * 365 * 70, sig(1.5 * 3600 * 365 * 70, 2)], [137970000, 2207520000, 1.4e8]);
ok('Ex 2.7 Q6: smallest n past 100 m', [...Array(40)].findIndex((_, n) => 0.001 * 2 ** n >= 10000), 24);
mdSays(/\*\*\$n = 24\$\*\*/, 'Ex 2.7 Q6');
is('Ex 2.7 Q7', 999999 * 999999 < 1e12 && 1e12 < 1e13);

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
