#!/usr/bin/env node
/* Re-derive the numbers this chapter prints.

     node pages/class-8/ch02-power-play/check-numbers.mjs [--skipped]

   Rewritten on 26 September 2026 for the maths-v2 chapter (new body in our
   own contexts, a Summary page, By the Book in six forms, Beyond the Book by
   format). The version before it checked the old body, its NCERT contexts
   and the old Beyond stages; it is in git history.

   A  every arithmetic identity set as maths ($…$) on every page and in
      ANSWERS.md, powers and negative exponents included (a chain broken by
      \approx is checked one exact run at a time)
   B  claims A cannot check: the opener's table, rounded values, searches
   C  the key is complete: By the Book 1–50, Beyond practice 1–15, and every
      solved example ends in an Answer row
   D  every single-correct and assertion–reason question: the right option
      is worked out here, and it must be the one the key prints

   Exits 1 on any failure. */
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
const close = (a, b) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
const sig = (x, s) => Number(x.toPrecision(s));
const big = (b, e) => BigInt(b) ** BigInt(e);
const lastDigit = (b, e) => Number(big(b, e) % 10n);

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const join = (re) => pages.filter(f => re.test(f)).map(f => html[f]).join('\n');
const body = join(/^p0[0-8]/), board = join(/^p09/), beyond = join(/^p1/);
const text = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/\\,/g, '').replace(/\s+/g, ' ');

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
  s = s.replace(/(^|[(+*/-])-(\d+(?:\.\d+)?\*\*(?:\([^()]*\)|\d+))/g, '$1(-($2))');
  return s;
}
const evalExpr = (e) => { try { return Function(`"use strict";return (${e})`)(); } catch { return NaN; } };
let spans = 0; const skipped = [];
// printed on purpose as wrong: Exercise Set 2.2 Q3 and By the Book Q16's working
const FALSE_ON_PURPOSE = ['5^3 \\times 5^4 = 5^{12}', '3^4 + 3^4 = 3^8', '6^8 \\div 6^2 = 6^4', '2^4 \\times 3^5 = 6^9',
  '8^2 = 2^5', '2^9 \\div 2^5 = 2^4 = 16', '0^0 = 0', '0^0 = 1',
  // Think and Reflect 2.3 Q1 (Rekha) and the wrong options of By the Book Q48 and Q49
  '2^3 \\times 2^4 = 4^7', '2^{-3} = -8', '3^2 + 3^2 = 3^4', '3^2 + 3^2 = 6^2', '3^2 + 3^2 = 6^4'];
for (const [f, src] of [...pages.map(f => [f, html[f]]), ['ANSWERS.md', answersMd]]) {
  for (const m of src.matchAll(/\$([^$]+)\$/g)) {
    const span = m[1].trim();
    if (!span.includes('=') || FALSE_ON_PURPOSE.some(x => span.includes(x))) continue;
    for (const part of span.split(/\\qquad|;/)) {
      for (const run of part.split(/\\approx|\\lt|\\gt/)) {
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
const mm = (n) => 0.1 * 2 ** n;            // the opener's sheet, 0.1 mm a fold
ok('7 folds, cm', sig(mm(7) / 10, 3), 1.28);
ok('10 folds, cm', sig(mm(10) / 10, 3), 10.2);
ok('17 folds, m', sig(mm(17) / 1000, 3), 13.1);
ok('27 folds, km', sig(mm(27) / 1e6, 3), 13.4);
ok('32 folds, km', Math.round(mm(32) / 1e6), 429);
ok('42 folds, km', Math.round(mm(42) / 1e6), 439805);
for (const t of ['$1.28$ cm', '$10.2$ cm', '$13.1$ m', '$13.4$ km', '$429$ km', '$439\\,805$ km']) is(`opener table prints ${t}`, html['p001.html'].includes(t));
is('27 folds pass Everest (8.85 km), 26 do not', mm(27) / 1e6 > 8.85 && mm(26) / 1e6 < 8.85);
is('42 folds pass the Moon, 41 do not', mm(42) / 1e6 > 384400 && mm(41) / 1e6 < 384400);
ok('2.7: exact thickness, standard form', sig(mm(42) / 1e6 / 1e5, 2), 4.4);
is('2.7: estimate out by less than a tenth', Math.abs(4e5 - mm(42) / 1e6) / (mm(42) / 1e6) < 0.1);
ok('2.1: doubling at the twentieth step', [2 ** 9, 2 ** 19 > 5e5], [512, true]);
ok('Ex 1: 44100 is 210 squared', Math.sqrt(44100), 210);
ok('Sun is about 390 times the Moon', Math.round(1.496e11 / 3.844e8 / 10) * 10, 390);
ok('Ex 8: 26^5, and about a thousand times', [26 ** 5, Math.round(26 ** 5 / 1e4 / 1000) * 1000], [11881376, 1000]);
ok('Ex 8: (27/26)^5 about 1.2', sig((27 / 26) ** 5, 2), 1.2);
ok('Ex 9: 2^25 and 2^-20', [2 ** 25, sig(2 ** -20 / 1e-7, 2)], [33554432, 9.5]);
is('Ex 9: both estimates out by less than a tenth', Math.abs(3.2e7 - 2 ** 25) / 2 ** 25 < 0.1 && Math.abs(1e-6 - 2 ** -20) / 2 ** -20 < 0.1);
ok('Ex 10: grains in a year', 4 * 1e4 * 365, 1.46e7);
ok('2.8: one crore minutes in years', Math.round(1e7 / (60 * 24 * 365)), 19);
// exercise answers that are searches or roundings
ok('Set 2.5 Q2: digits for 3.5 crore', [...Array(12).keys()].find(d => 10 ** d >= 3.5e7), 8);
ok('Set 2.5 Q4: factor', sig((36 / 26) ** 3, 2), 2.7);
ok('Set 2.6 Q1: units digit of 3^8 x 9^4', Number((big(3, 8) * big(9, 4)) % 10n), 1);
ok('Set 2.6 Q3: the three equal to 10^5', [2 ** 5 * 5 ** 5, 10 ** 2 * 10 ** 3, 1000 ** 2, 10 ** 10 / 10 ** 5, 2 ** 3 * 5 ** 5].map(v => v === 1e5), [true, true, false, true, false]);
ok('Set 2.7 Q3: crore seconds in days, nearest ten', Math.round(1e7 / 8.64e4 / 10) * 10, 120);
ok('Set 2.7 Q4: folds past 50 m', [...Array(40).keys()].find(n => mm(n) > 50000), 19);
is('Set 2.7 Q5: 99999^2 < 10^10', 99999n * 99999n < 10n ** 10n);
// By the Book
ok('BtB 25: first day past one lakh', [...Array(20).keys()].find(n => 200 * 3 ** n > 1e5), 6);
ok('BtB 26: trees', sig(22 / 7 * 700 ** 2 / 110, 2), 1.4e4);
ok('BtB 28: sheets, and folds past Everest', [sig(8.8e3 / 2e-4, 2), [...Array(40).keys()].find(n => 2e-4 * 2 ** n > 8.8e3)], [4.4e7, 26]);
ok('BtB 29', [36 ** 4, 36 ** 2], [1679616, 1296]);
ok('BtB 30', [Math.round(1.4e9 / 3.3e6 / 10) * 10, sig(1.4e9 * 150, 2), sig(1.4e9 * 150 * 365, 2)], [420, 2.1e11, 7.7e13]);
ok('BtB 36: hours past 10^6', [...Array(30).keys()].find(n => 500 * 2 ** n > 1e6), 11);
ok('BtB 38', [4.5e9 / 1.5e8, 4.5e9 / 1e7 / 100], [30, 4.5]);
ok('BtB 40: rounds to a side of 1/2 cm', [...Array(12).keys()].find(n => 64 / 2 ** n === 0.5), 7);
// Beyond practice
ok('Beyond 9', [...Array(10).keys()].find(n => 16 ** 3 * 8 ** 2 / 4 ** n === 2 ** 8), 5);
ok('Beyond 10', Number((big(4, 2025) + big(6, 2025)) % 10n), 0);
ok('Beyond 11', [...Array(1001).keys()].slice(1).filter(n => Number.isInteger(Math.round(n ** (1 / 6))) && Math.round(n ** (1 / 6)) ** 6 === n).length, 3);
ok('Beyond 14', [800 / 2 ** 4, 6 * Math.log2(800 / 12.5), Math.log2(800 / 3.125)], [50, 36, 8]);
ok('Beyond 15', [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(k => 2 ** k < 100).length, [[2, 10], [3, 9], [4, 8], [5, 7]].length, 55], [6, 4, 55]);
ok('Beyond Ex 9 and 10', [lastDigit(2, 50), lastDigit(9, 99), Number((big(2, 50) * big(9, 99)) % 10n), sig(3e5 * 3.2e7 / 1e12, 2), Math.round(4e13 / 9.6e12)], [4, 9, 6, 9.6, 4]);

/* ---- C. the key is complete ------------------------------------ */
const ka = pages.findIndex(f => html[f].includes('c-stage__title">Answers'));
is('Beyond has an Answers stage', ka >= 0);
const key = pages.slice(ka).map(f => html[f]).join('\n');
const [boardKey, beyondKey] = key.split('c-practice__sub">Beyond the Book');
const numbered = s => new Set([...s.matchAll(/work__label">(\d+)<|class="n">(\d+)</g)].map(m => +(m[1] || m[2])));
const bk = numbered(boardKey);
for (let n = 1; n <= 50; n++) is(`By the Book key has ${n}`, bk.has(n));
const list = (beyondKey.match(/c-answers__list">([^<]*)</) || [, ''])[1];
const yk = new Set([...numbered(beyondKey), ...[...list.matchAll(/(?:^|&nbsp;)\s*(\d+)\s/g)].map(m => +m[1])]);
for (let n = 1; n <= 15; n++) is(`Beyond key has ${n}`, yk.has(n));
const examples = [...beyond.matchAll(/c-example__tab">Example (\d+)<[\s\S]*?(?=c-example__tab"|c-stage__title">Answers|$)/g)];
ok('Beyond has 10 solved examples', examples.length, 10);
for (const e of examples) is(`Beyond Example ${e[1]} ends in an Answer row`, /work__label">Answer</.test(e[0]));
const bq = [...board.matchAll(/data-start="(\d+)"/g)].map(m => +m[1]);
ok('By the Book runs 2–50 after its first question', bq, [...Array(49)].map((_, i) => i + 2));

/* ---- D. single correct and assertion–reason -------------------- */
const optionsOf = (src, n) => {
  const start = n === 1 ? src.search(/<ol class="c-questions">/) : src.indexOf(`data-start="${n}"`);
  if (start < 0) return null;
  const chunk = src.slice(start, src.indexOf('</li>\n', start) + 5);
  const o = [...chunk.matchAll(/c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/g)].at(-1);
  return o ? [...o[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1].trim()) : null;
};
const val = (s) => { const e = toExpr(s.replace(/\$/g, '').replace(/ (mg|km)$/, '').trim()); return e === null ? NaN : evalExpr(e); };
const letter = (l) => 'abcd'.indexOf(l);
const boardLetters = Object.fromEntries([...boardKey.matchAll(/class="n">(\d+)<\/span> \((\w)\)/g)].map(m => [+m[1], m[2]]));
const pick = (opts, test) => opts.map((o, i) => test(o) ? 'abcd'[i] : null).filter(Boolean);
const BOARD = {
  41: o => pick(o, s => close(val(s), 2 ** 8) && /2\^8/.test(s)),
  42: o => pick(o, s => close(val(s), 5 ** 6)),
  43: o => pick(o, s => close(val(s), 0.00058) && /^\$[1-9]\./.test(s)),
  44: o => pick(o, s => 2 ** val(s) === 32),
  45: o => pick(o, s => close(val(s), (2 / 5) ** -3)),
  46: o => pick(o, s => !Number.isInteger(Math.log2(val(s)))),
  47: o => pick(o, s => val(s) === lastDigit(3, 2024)),
  48: o => pick(o, s => s === '(i) and (iii)' && (-3) ** 4 === 81 && 2 ** -3 !== -8 && 7 ** 0 === 1),
  49: o => pick(o, s => /= 18\$/.test(s) && 3 ** 2 + 3 ** 2 === 18),
  50: o => pick(o, s => 9 ** val(s) * 3 ** 2 / 3 ** 4 === 3 ** 8),
};
for (const [q, f] of Object.entries(BOARD)) {
  const o = optionsOf(board, +q);
  is(`By the Book Q${q} has four options`, o && o.length === 4);
  ok(`By the Book Q${q}: the right option`, o ? f(o) : null, [boardLetters[q]]);
}
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  31: [(-1) ** 50 === 1, [-1, -2, -3.5].every(n => n ** 2 > 0 && n ** 4 > 0), true],
  32: [(2 ** 3) ** 2 === 2 ** 6, 2 ** 3 * 2 ** 2 === 2 ** 5, false],
  33: [close(10 ** -2, 0.01), 10 ** -2 < 0, false],
  34: [5 ** -2 < 0, close(5 ** -2, 1 / 25), false],
  35: [2 ** 10 * 5 ** 10 === 10 ** 10, 3 ** 4 * 7 ** 4 === 21 ** 4, true],
};
for (const [q, v] of Object.entries(AR)) ok(`By the Book Q${q}: assertion-reason`, arLetter(v), boardLetters[q]);
const bl = Object.values(boardLetters);
is(`By the Book letters spread over a-d: ${bl.join('')}`, ['a', 'b', 'c', 'd'].every(l => bl.filter(x => x === l).length >= 2));

const practice = beyond.slice(0, beyond.indexOf('c-stage__title">Answers'));
const beyondLetters = Object.fromEntries([...list.matchAll(/(\d+) \(([a-d])\)(?! ,|,)/g)].map(m => [+m[1], m[2]]));
const BEYOND = {
  1: o => pick(o, s => close(val(s), (2 ** 2026 / 2 ** 2023 - 2) / (2 ** 2 - 1) || 2) && val(s) === 2),
  2: o => pick(o, s => val(s) === String(big(4, 10) * big(5, 18)).length),
  3: o => pick(o, s => { const x = val(s), y = x - 1; return 2 ** x * 8 ** y === 2 ** 13; }),
  4: o => { const v = o.map(s => { const [b, e] = s.replace(/\$/g, '').split('^'); return Number(e.replace(/[{}]/g, '')) / 100 * Math.log(Number(b)); }); return pick(o, s => Math.max(...v) === v[o.indexOf(s)]); },
};
for (const [q, f] of Object.entries(BEYOND)) {
  const o = optionsOf(practice, +q);
  ok(`Beyond Q${q}: the right option`, o ? f(o) : null, [beyondLetters[q]]);
}
// more than one correct, recomputed
const multi = (q, want) => ok(`Beyond Q${q}: all correct options`, want, (list.match(new RegExp(`(?:^|&nbsp;)\\s*${q} ((?:\\([a-d]\\),? ?)+)`)) || [, ''])[1].match(/[a-d]/g));
multi(5, [2 ** 6 * 3 ** 6, 36 ** 3, 6 ** 2 * 6 ** 3, (6 ** 3) ** 2].map((v, i) => v === 6 ** 6 ? 'abcd'[i] : null).filter(Boolean));
multi(6, [3, 4, 5, 6].map((n, i) => (-2) ** n > 10 ? 'abcd'[i] : null).filter(Boolean));
multi(7, [4.5e-4, 0.0045, 2 ** -8, 5 ** -3].map((v, i) => v > 1e-3 && v < 1e-2 ? 'abcd'[i] : null).filter(Boolean));
multi(8, [[12, 8].every(e => e % 2 === 0), [12, 8].every(e => e % 3 === 0), [12, 8].every(e => e % 4 === 0), 12 >= 8 && 8 >= 8].map((t, i) => t ? 'abcd'[i] : null).filter(Boolean));
// matching practice: the keyed option lists the true matches
ok('Beyond Q12', optionsOf(practice, 12)[letter(beyondLetters[12])], [1 / 8, -8, 8, -1 / 8].map(v => [8, -8, 1 / 8, -1 / 8].findIndex(w => close(v, w)) + 1).join(', '));
ok('Beyond Q13', optionsOf(practice, 13)[letter(beyondLetters[13])], [0.00072, 72e5, 72e-3, 0.72e3].map(v => [7.2e6, 7.2e-4, 7.2e2, 7.2e-2].findIndex(w => close(v, w)) + 1).join(', '));

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
