#!/usr/bin/env node
/* Re-derive the numbers this chapter prints.

     node pages/class-8/ch05-number-play/check-numbers.mjs

   Rewritten on 26 September 2026 for the maths-v2 chapter (our own body
   questions, a Summary page, By the Book in six forms, Beyond the Book by
   format). The version before it checked the NCERT-shaped layout that the
   conversion replaced — its Stage 2 bank, its four-stage Beyond and its
   exercise answers. It is in git history.

   A  every arithmetic identity set as maths ($…$) on every page and in
      ANSWERS.md, with \cdots sums expanded from the terms either side
   B  the key is complete: By the Book 1–50, Beyond practice 1–15, ten
      solved examples each ending in an Answer row
   C  every objective, assertion–reason, single-correct and multiple-correct
      question: the right option is computed here and must be the keyed one
   D  the body: every cryptarithm solved by brute force, and the exercise
      answers in ANSWERS.md recomputed

   Exits 1 on any failure. */
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const B = String.fromCharCode(92);
const PAGES = readdirSync(DIR).filter(f => /^p\d{3}\.html$/.test(f)).sort();
const HTML = Object.fromEntries(PAGES.map(f => [f, readFileSync(path.join(DIR, f), 'utf8').replace(/\r\n/g, '\n')]));
const ANSWERS = readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
let fails = 0, checks = 0;
const ok = (label, cond, detail = '') => { checks++; if (!cond) { fails++; console.log(`  x ${label}${detail ? '  ' + detail : ''}`); } };
const eq = (label, got, want) => ok(label, JSON.stringify(got) === JSON.stringify(want), `computed ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`);

/* ---- the mathematics ------------------------------------------------ */
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const digits = n => String(n).split('').map(Number);
const dsum = n => digits(n).reduce((a, b) => a + b, 0);
const droot = n => { while (n > 9) n = dsum(n); return n; };
const alt = n => digits(n).reverse().reduce((s, d, i) => s + (i % 2 ? -d : d), 0);
const mod = (a, m) => ((a % m) + m) % m;
function crypt(expr) {
  const letters = [...new Set(expr.replace(/[^A-Z]/g, ''))];
  const words = expr.match(/[A-Z0-9]+/g);
  const out = [];
  const rec = (i, map, used) => {
    if (i === letters.length) {
      const val = w => Number([...w].map(c => (/\d/.test(c) ? c : map[c])).join(''));
      for (const w of words) if (w.length > 1 && map[w[0]] === 0) return;
      const js = expr.replace(/[A-Z0-9]+/g, w => val(w)).replace(/×/g, '*').replace(/=/g, '===');
      if (Function(`return ${js}`)()) out.push(expr.replace(/[A-Z0-9]+/g, w => val(w)));
      return;
    }
    for (let d = 0; d < 10; d++) if (!used.has(d)) { map[letters[i]] = d; used.add(d); rec(i + 1, map, used); used.delete(d); }
    delete map[letters[i]];
  };
  rec(0, {}, new Set());
  return out;
}

/* ---- A: identities -------------------------------------------------- */
const strip = t => [['times', '*'], ['div', '/'], ['thinsp', ''], [',', ''], [';', ''], [' ', ''], ['left', ''], ['right', '']]
  .reduce((s, [k, v]) => s.split(B + k).join(v), t);
const DOTS = B + 'cdots';
function expand(expr) {
  const i = expr.indexOf(DOTS);
  if (i < 0) return expr;
  const before = expr.slice(0, i), after = expr.slice(i + DOTS.length);
  const head = before.match(/((?:\d+\+){2,})$/), tail = after.match(/^\+(\d+)/);
  if (!head || !tail) return expr;
  const t = head[1].split('+').filter(Boolean).map(Number);
  const step = t[1] - t[0];
  if (!step || t.some((v, k) => k && v - t[k - 1] !== step)) return expr;
  const out = [];
  for (let v = t[0]; step > 0 ? v <= +tail[1] : v >= +tail[1]; v += step) out.push(v);
  return expand(before.slice(0, before.length - head[1].length) + out.join('+') + after.slice(tail[0].length));
}
const identities = (label, text) => {
  for (const m of text.matchAll(/\$([^$]+)\$/g)) {
    const js = expand(strip(m[1]).replace(/−/g, '-').replace(/\s+/g, '')).replace(/(\d)\(/g, '$1*(').replace(/\)\(/g, ')*(');
    if (!js.includes('=') || js.includes(B)) continue;
    const sides = js.split('=').filter(s => s !== '');
    if (sides.length < 2 || sides.some(s => !/^[\d+\-*/().]+$/.test(s))) continue;
    const vals = sides.map(s => Function(`return (${s})`)());
    ok(`${label}: $${m[1]}$`, vals.every(v => Math.abs(v - vals[0]) < 1e-9), vals.join(' vs '));
  }
};
for (const f of PAGES) identities(f, HTML[f].replace(/<svg[\s\S]*?<\/svg>/g, ''));
identities('ANSWERS.md', ANSWERS);

/* ---- B: the key is complete ----------------------------------------- */
const keyStart = PAGES.findIndex(f => HTML[f].includes('c-stage__title">Answers'));
ok('an Answers stage exists', keyStart >= 0);
const key = PAGES.slice(keyStart).map(f => HTML[f]).join('\n');
const [boardKey, beyondKey] = key.split('c-practice__sub">Beyond the Book');
const numbered = s => new Set([...s.matchAll(/work__label">(\d+)<|class="n">(\d+)</g)].map(m => +(m[1] || m[2])));
const board = numbered(boardKey);
for (let n = 1; n <= 50; n++) ok(`By the Book key has ${n}`, board.has(n));
const beyondList = (beyondKey.match(/c-answers__list">([^<]*)</) || [, ''])[1];
const beyondLetters = {};
for (const m of beyondList.matchAll(/(\d+) ((?:\([a-d]\)(?:, )?)+|\d+)/g)) beyondLetters[+m[1]] = m[2].trim();
for (let n = 1; n <= 15; n++) ok(`Beyond key has ${n}`, n in beyondLetters);
const bridge = PAGES.filter(f => /^p1/.test(f)).map(f => HTML[f]).join('\n');
const examples = [...bridge.matchAll(/c-example__tab">Example (\d+)<[\s\S]*?(?=c-example__tab"|c-stage__title">Answers|$)/g)];
eq('Beyond has 10 solved examples', examples.map(e => +e[1]), range(1, 10));
for (const e of examples) ok(`Beyond Example ${e[1]} ends in an Answer row`, /work__label">Answer</.test(e[0]));
const bodyEx = PAGES.filter(f => /^p0[0-8]/.test(f)).map(f => HTML[f]).join('\n');
eq('body examples numbered 1–6', [...bodyEx.matchAll(/c-example__tab">Example (\d+)</g)].map(m => +m[1]), range(1, 6));

/* ---- C: options recomputed ------------------------------------------ */
const L = 'abcd';
const qOptions = (html, n) => {
  const start = n === 1 ? html.search(/<ol class="c-questions">/) : html.indexOf(`data-start="${n}"`);
  if (start < 0) return null;
  const next = html.indexOf('<div class="c-practice', start + 20);
  const chunk = html.slice(start, next < 0 ? undefined : next);
  const all = [...chunk.matchAll(/c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/g)];
  if (!all.length) return null;
  return [...all.at(-1)[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1].replace(/\$/g, '').trim());
};
const boardPages = PAGES.filter(f => /^p09/.test(f)).map(f => HTML[f]).join('\n');
const boardLetters = Object.fromEntries([...boardKey.matchAll(/class="n">(\d+)<\/span> \(([a-d])\)/g)].map(m => [+m[1], m[2]]));
// value-type objective questions: the keyed option must print this value
const BOARD_VALUE = {
  41: 7432 % 9, 42: [2728, 3719, 4817, 6051].find(n => n % 11 === 0),
  43: [1, 5, 3, 8].find(d => (3072 + 100 * d) % 12 === 0), 44: droot(987654),
  45: range(0, 9).find(a => (208 + 10 * a) % 9 === 0), 46: 7,
  47: (2 + 4 + 3) % 5, 50: mod(-2023, 9),
};
for (const [q, v] of Object.entries(BOARD_VALUE)) {
  const o = qOptions(boardPages, +q), l = boardLetters[q];
  ok(`By the Book Q${q}: (${l}) prints ${v}`, !!(o && l && o[L.indexOf(l)] === String(v)), o ? `option "${o[L.indexOf(l)]}"` : 'no options');
  if (o) ok(`By the Book Q${q}: only one option is ${v}`, o.filter(x => x === String(v)).length === 1);
}
// Q46 is not also a multiple of the other options
ok('By the Book Q46: 7 consecutive numbers are not always even, a multiple of 3 or of 14', (1 + 2 + 3 + 4 + 5 + 6 + 7) % 2 === 0 && (2 + 3 + 4 + 5 + 6 + 7 + 8) % 2 !== 0 && (2 + 3 + 4 + 5 + 6 + 7 + 8) % 3 !== 0);
// Q48 multi-statement: (i) true, (ii) false (12), (iii) true -> "(i) and (iii)"
eq('By the Book Q48', [range(1, 50).every(a => range(1, 50).every(b => (7 * a + 7 * b) % 7 === 0)), 12 % 24 === 0, range(1, 99).every(k => (18 * k) % 6 === 0)], [true, false, true]);
ok('By the Book Q48 keyed (c)', boardLetters[48] === 'c');
// Q49: 4356 divisible by 36, and 3-and-12 is not a valid test (24)
ok('By the Book Q49: 4356 = 36 x 121, 24 passes 3 and 12', 4356 % 36 === 0 && 24 % 3 === 0 && 24 % 12 === 0 && 24 % 36 !== 0 && boardLetters[49] === 'b');
// assertion-reason
const AR = { 31: 'a', 32: 'd', 33: 'b', 34: 'c', 35: 'a' };
ok('A-R 31: 7425 divisible by 9, digit sum 18', 7425 % 9 === 0 && dsum(7425) === 18);
ok('A-R 32: 20 divisible by 4 and 10, not 40', 20 % 4 === 0 && 20 % 10 === 0 && 20 % 40 !== 0);
ok('A-R 34: 90816 divisible by 3; 6 divides units but 16 is not', 90816 % 3 === 0 && 16 % 3 !== 0);
ok('A-R 35: 6k + 4 leaves 1 on division by 3', range(0, 100).every(k => (6 * k + 4) % 3 === 1));
for (const [q, l] of Object.entries(AR)) ok(`A-R ${q} keyed (${l})`, boardLetters[q] === l, `key has ${boardLetters[q]}`);
const spread = Object.values(boardLetters).reduce((c, l) => (c[l] = (c[l] || 0) + 1, c), {});
ok('By the Book letters use all of (a)-(d)', Object.keys(spread).length === 4, JSON.stringify(spread));

// Beyond practice
const practice = bridge.slice(0, bridge.indexOf('c-stage__title">Answers'));
const BEYOND_VALUE = {
  1: 1111111111 % 9,
  2: range(10, 99).filter(n => n % 12 === 0 && n % 8 !== 0).length,
  3: 37,
  4: range(0, 9).filter(d => (7040 + 100 * d + d) % 6 === 0).length,
};
for (const [q, v] of Object.entries(BEYOND_VALUE)) {
  const o = qOptions(practice, +q), l = beyondLetters[q];
  ok(`Beyond Q${q}: (${l}) prints ${v}`, !!(o && /^\([a-d]\)$/.test(l) && o[L.indexOf(l[1])] === String(v)), o ? `options ${o}` : 'no options');
}
ok('Beyond Q3: ababab is always divisible by 37 and not always by 11, 9 or 17',
  range(10, 99).every(ab => (ab * 10101) % 37 === 0) && [11, 9, 17].every(d => range(10, 99).some(ab => (ab * 10101) % d !== 0)));
const multi = (label, truth, keyed) => eq(label, truth.map((t, i) => t ? `(${L[i]})` : '').filter(Boolean).join(', '), keyed);
multi('Beyond Q5', [1001, 12321, 91828, 4015].map(n => n % 11 === 0), beyondLetters[5]);
{ const pq = []; for (const p of [1, 3, 5, 7, 9]) for (const q of [0, 2, 4, 6]) pq.push([p, q]);
  multi('Beyond Q6', [(p, q) => p + q, (p, q) => p * q, (p, q) => p * p + q, (p, q) => p + 2 * q + 1].map(f => pq.every(([p, q]) => f(p, q) % 2 === 1)), beyondLetters[6]); }
{ const Ns = range(0, 40).map(k => 6 * k + 2);
  multi('Beyond Q7', [N => N % 2 === 0, N => N % 3 === 2, N => N % 12 === 2, N => (N + 4) % 6 === 0].map(f => Ns.every(f)), beyondLetters[7]); }
multi('Beyond Q8', [1002, 64, 111, 5550].map(n => droot(n) === 3), beyondLetters[8]);
eq('Beyond Q9', range(101, 1000).find(n => [2, 3, 4, 5, 6].every(d => n % d === 1)), +beyondLetters[9]);
eq('Beyond Q10', range(100, 999).filter(n => dsum(n) === 26).length, +beyondLetters[10]);
eq('Beyond Q11', 777777777 % 11, +beyondLetters[11]);
eq('Beyond Q12: remainders', [1234, 5005, 9876, 2019].map(n => n % 11), [2, 0, 9, 6]);
ok('Beyond Q12 keyed (a) P–2, Q–1, R–4, S–3', beyondLetters[12] === '(a)');
{ let p = 2; while (![2, 3, 4].every(d => p % d === 1)) p++;
  const s = range(1, 999).find(n => n % 11 === 0 && dsum(n) === 10);
  eq('Beyond Q13: 13, 12, 18, 55', [p, 12, range(1, 99).find(n => n % 2 === 0 && droot(n) === 9), s], [13, 12, 18, 55]); }
ok('Beyond Q13 keyed (d)', beyondLetters[13] === '(d)');
{ const d = []; for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) for (let c = 1; c <= 9; c++) d.push(Math.abs((100 * a + 10 * b + c) - (100 * c + 10 * b + a)));
  ok('Beyond Q14: differences are multiples of 99, largest 792, eight non-zero values', d.every(x => x % 99 === 0) && Math.max(...d) === 792 && new Set(d.filter(Boolean)).size === 8); }
{ const bal = n => alt(n) === 0;
  ok('Beyond Q15: balanced numbers are multiples of 11; 9 two-digit; smallest three-digit is 110',
    range(1, 99999).filter(bal).every(n => n % 11 === 0) && range(10, 99).filter(bal).length === 9 && range(100, 999).find(bal) === 110); }

// Beyond examples 9 and 10
{ const codes = []; for (let a = 0; a <= 9; a++) for (let b = 0; b <= 9; b++) { const n = 40702 + 1000 * a + 10 * b; if (n % 36 === 0) codes.push(n); }
  ok('Beyond Example 9: b odd, 6 codes, largest 49752', codes.length === 6 && Math.max(...codes) === 49752 && codes.every(n => (Math.floor(n / 10) % 10) % 2 === 1)); }
{ const t = n => 7 + 8 * (n - 1);
  ok('Beyond Example 10: roots 4 and 6, 11 multiples of 9', droot(t(4)) === 4 && droot(t(20)) === 6 && range(1, 100).filter(n => t(n) % 9 === 0).length === 11); }
ok('Beyond Example 5: 22 numbers with digital root 7 up to 200', range(1, 200).filter(n => droot(n) === 7).length === 22);
ok('Beyond Example 6: 10^25 leaves 10 on division by 11', (() => { let r = 1; for (let i = 0; i < 25; i++) r = (r * 10) % 11; return r === 10; })());
ok('Beyond Example 8: remainders P 1, Q 3, R 2, S 5', range(0, 30).every(k => (3 * (4 * k + 3)) % 4 === 1 && (6 * k + 5 + 6 * (k + 2) + 4) % 6 === 3 && (4 * k + 6) % 4 === 2 && (2 * (9 * k + 7)) % 9 === 5));

/* ---- D: the body ---------------------------------------------------- */
const CRYPT = {
  'A3 + 3A = 77': 1, 'PQ + 5P = Q2': 1, 'KL + KL + KL = MKL': 1, 'AB + B = BA': 1,
  'AB × 4 = CA': 1, 'PQ × Q = 6R': 2, 'PQ × Q = 1PQ': 1, 'GH × 4 = HJ': 1, 'KLM × 3 = LMN': 1,
  'XY × 9 = ZXY': 2, 'SUN × 6 = NUT': 1, 'DE × 2 + 7 = ED': 1, 'AB × 9 = CBA': 1, 'XY × 9 = 6XY': 1,
  'ABC × 3 = CCC': 1, 'ABCD × 4 = DCBA': 1,
};
for (const [e, n] of Object.entries(CRYPT)) eq(`cryptarithm ${e} has ${n} solution(s)`, crypt(e).length, n);
const signs = (a, b, c, d) => [1, -1].flatMap(s1 => [1, -1].flatMap(s2 => [1, -1].map(s3 => a + s1 * b + s2 * c + s3 * d)));
eq('signs between 7, 8, 9, 10', signs(7, 8, 9, 10), [34, 14, 16, -4, 18, -2, 0, -20]);
eq('signs between 12, 13, 14, 15', signs(12, 13, 14, 15), [54, 24, 26, -4, 28, -2, 0, -30]);
eq('Even Without Working It Out', [57 + 29, 614 - 283, 5 * 219 * 7, 906 - 358, 441 + 368, 127 * 315, 835 - 267, 24 * 111].map(v => v % 2 === 0), [true, false, false, true, false, false, true, true]);
{ const f = { '6p+4q': (a, b) => 6 * a + 4 * b, '3a+7b': (a, b) => 3 * a + 7 * b, '8x-2y': (a, b) => 8 * a - 2 * b, '5m+5n': (a, b) => 5 * a + 5 * b, '9k-3k': a => 6 * a, '4a-5b': (a, b) => 4 * a - 5 * b, 'y2+4': a => a * a + 4, 'c2+c': a => a * a + a, '10r*3s': (a, b) => 30 * a * b };
  eq('algebraic expressions always even', Object.fromEntries(Object.entries(f).map(([k, g]) => [k, range(-9, 9).every(a => range(-9, 9).every(b => mod(g(a, b), 2) === 0))])),
    { '6p+4q': true, '3a+7b': false, '8x-2y': true, '5m+5n': false, '9k-3k': true, '4a-5b': false, 'y2+4': false, 'c2+c': true, '10r*3s': true }); }
eq('cannot be broken up, 1 to 20', range(1, 20).filter(n => !range(1, n).some(a => range(a + 1, n).some(b => (a + b) * (b - a + 1) / 2 === n))), [1, 2, 4, 8, 16]);
eq('Table 5.9', [range(0, 4).map(k => 6 * k + 4), range(1, 5).map(k => 6 * k - 2)], [[4, 10, 16, 22, 28], [4, 10, 16, 22, 28]]);
eq('Set 5.1 Q1', range(0, 50).filter(n => 3 * n + 3 === 72), [23]);
eq('Set 5.1 Q4', range(1, 40).filter(n => n % 4 === 1 && n % 6 === 1), [1, 13, 25, 37]);
eq('Set 5.1 Q5', range(1, 49).filter(n => [2, 3, 4, 6].every(d => n % d === 1) && n % 5 === 0), [25]);
eq('Set 5.1 Q7', [853 % 9, 1241 % 9, (1241 + 853) % 9, (1241 - 853) % 9], [7, 8, 6, 1]);
eq('Set 5.1 Q8', range(1, 100).find(n => n % 2 === 1 && n % 3 === 2 && n % 4 === 3), 11);
eq('Set 5.2 Q1', [234, 5071, 6453, 80919, 111111, 7777].map(n => n % 9 === 0), [true, false, true, true, false, false]);
eq('Set 5.2 Q2', range(100, 999).filter(n => n % 9 === 0 && new Set(String(n)).size === 3).at(-1), 981);
eq('Set 5.2 Q3', [4995, 5004].reduce((b, n) => Math.abs(n - 5000) < Math.abs(b - 5000) ? n : b), 5004);
eq('Set 5.2 Q4', range(2101, 2199).filter(n => n % 9 === 0).length, 11);
eq('test for 11 list', [297, 518, 616, 4052, 70514, 924011].map(n => n % 11), [0, 1, 0, 4, 4, 0]);
eq('Example 4 and 5', [416253 % 11, 283916 % 11, alt(416253), alt(283916)], [2, 6, -9, 17]);
{ const row = n => [2, 3, 4, 5, 6, 8, 9, 10, 11].map(d => n % d === 0 ? 'Yes' : 'No').join(' ');
  for (const n of [216, 770, 1452, 4716, 528, 2310]) {
    const line = ANSWERS.split('\n').find(l => l.startsWith(`| ${n} |`));
    eq(`Table 5.12 row ${n}`, line ? line.split('|').slice(2, -1).map(s => s.trim()).join(' ') : null, row(n));
  } }
eq('combining tests: 54 111 244 318 by 6', [54, 111, 244, 318].map(n => n % 6 === 0), [true, false, false, true]);
eq('digital root 4 in 301..399', range(301, 399).filter(n => droot(n) === 4), [301, 310, 319, 328, 337, 346, 355, 364, 373, 382, 391]);
eq('T&R: two-digit multiple of 7 below 50 with digital root 5', range(10, 49).filter(n => n % 7 === 0 && droot(n) === 5), [14]);
eq('Set 5.3', [mod(7 + 5 - 1, 9) + 1, mod(7 + 15 - 1, 9) + 1, range(0, 7).map(k => droot(4 + 12 * k)), droot(23)], [3, 4, [4, 7, 1, 4, 7, 1, 4, 7], 5]);
eq('Set 5.4 Q1', range(0, 9).filter(k => (4038 + 100 * k) % 3 === 0), [0, 3, 6, 9]);
{ const p = []; for (let a = 0; a <= 9; a++) for (let b = 0; b <= 9; b++) if ((72040 + 100 * a + b) % 15 === 0) p.push([a, b]);
  eq('Set 5.4 Q4', p, [[0, 5], [2, 0], [3, 5], [5, 0], [6, 5], [8, 0], [9, 5]]); }
{ const p = []; for (let m = 0; m <= 9; m++) for (let n = 0; n <= 9; n++) if ((5040 + 100 * m + n) % 22 === 0) p.push([m, n]);
  eq('Set 5.4 Q5', p, [[1, 8], [3, 6], [5, 4], [7, 2], [9, 0]]); }
ok('Set 5.4 Q6 (iii) is 34', range(0, 20).every(c => 6 * (2 * c + 5) - 4 * (3 * c - 1) === 34));
// By the Book written answers
eq('BtB VSA', [73254 % 9, 123456789 % 9, range(1000, 1100).find(n => n % 11 === 0), droot(8888888), range(0, 9).find(k => (5072 + 100 * k) % 9 === 0), 918 % 18, range(0, 9).find(d => (305 + 10 * d) % 11 === 0)], [3, 0, 1001, 2, 4, 0, 8]);
eq('BtB SA 11', range(0, 9).filter(d => (5064 + 100 * d) % 12 === 0), [0, 3, 6, 9]);
eq('BtB SA 14', [58432 % 11, 2 + 3 - 4 + 8 - 5, alt(58432)], [0, 4, 0]);
eq('BtB SA 17', range(1, 200).filter(n => n % 4 === 0 && n % 6 === 0).length, 16);
eq('BtB SA 18', [range(501, 699).filter(n => n % 11 === 0).length, range(501, 699).filter(n => n % 11 === 0 && new Set(String(n)).size === 3).at(-1)], [18, 693]);
eq('BtB SA 19', range(0, 9).filter(a => (7050 + 100 * a) % 90 === 0), [6]);
eq('BtB LA 21', range(100, 200).filter(n => n % 6 === 4 && n % 8 === 6 && n % 9 === 7), [142]);
eq('BtB LA 22', range(0, 9).filter(d => (407 + 10 * d) % 9 === 0), [7]);
eq('BtB LA 23', [759 % 11, 846 % 11], [0, 10]);
ok('BtB LA 25: 100a+10b+c and 2a+3b+c agree mod 7', range(100, 999).every(n => { const [a, b, c] = digits(n); return mod(n - (2 * a + 3 * b + c), 7) === 0; }) && 581 % 7 === 0 && 692 % 7 === 6);
eq('BtB LA 26', range(10, 99).filter(n => dsum(n) === 11 && Number(String(n).split('').reverse().join('')) - n === 27), [47]);
eq('BtB LA 27', range(0, 100).filter(n => 8 * n + 12 === 156).map(n => [2 * n, 2 * n + 2, 2 * n + 4, 2 * n + 6]), [[36, 38, 40, 42]]);
eq('BtB LA 28', range(300, 400).filter(n => n % 5 === 3 && n % 7 === 3 && n % 4 === 0).map(n => [n, n % 9, n % 11]), [[388, 1, 3]]);
eq('BtB cases', [[35728, 47219, 80916].map(n => n % 11), range(0, 9).find(d => (61900 + d) % 11 === 0), [26352, 58062, 70236].map(n => n % 9), range(0, 9).find(d => (47310 + d) % 9 === 0), 1 - 2 + 3 + 4 - 5 - 6, 23 * 48, 12 * 115, droot(1480), droot(droot(12) * droot(115))],
  [[0, 7, 0], 8, [0, 3, 0], 3, -5, 1104, 1380, 4, 3]);
ok('BtB case 36: no sign choice between 1..6 gives 0', (() => { for (let m = 0; m < 32; m++) { let v = 1; for (let i = 0; i < 5; i++) v += (m >> i & 1 ? -1 : 1) * (i + 2); if (v === 0) return false; } return true; })());

console.log(`${checks} checks, ${fails} failed`);
process.exit(fails ? 1 : 0);
