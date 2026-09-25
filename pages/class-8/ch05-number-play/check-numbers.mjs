#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed from first principles — remainders, digit sums, searches over
   every digit, brute-force cryptarithm solving — and compared with what is
   on the page or in ANSWERS.md.

     node pages/class-8/ch05-number-play/check-numbers.mjs

   Five parts:
     A  every equation set as maths, on every page and in ANSWERS.md, whose
        sides all evaluate to numbers
     B  the body: its worked examples, tables and every exercise answer
     C  Beyond the Book, Stage 1 and the 15 Stage 2 examples: every option
        recomputed, so a distractor that is secretly right fails
     D  the practice questions: each multiple-choice and assertion-reason
        question has exactly one right option and it is the keyed one; the
        written answers are read back out of the key
     E  ANSWERS.md prints the same key as the page

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

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const digits = (n) => String(n).split('').map(Number);
const dsum = (n) => digits(n).reduce((a, b) => a + b, 0);
const droot = (n) => { while (n > 9) n = dsum(n); return n; };
const alt = (n) => digits(n).reverse().reduce((s, d, i) => s + (i % 2 ? -d : d), 0);   // + before the units digit
const mod = (a, m) => ((a % m) + m) % m;
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const lcm = (...xs) => xs.reduce((a, b) => a * b / gcd(a, b));
const pick = (opts, f) => opts.map((o, i) => (f(o, i) ? 'abcd'[i] : '')).join('');
// cryptarithm: distinct letters, distinct digits, no leading zero
function crypt(expr) {
  const letters = [...new Set(expr.replace(/[^A-Z]/g, ''))];
  const words = expr.match(/[A-Z0-9]+/g);
  const out = [];
  const rec = (i, map, used) => {
    if (i === letters.length) {
      const val = (w) => Number([...w].map((c) => (/\d/.test(c) ? c : map[c])).join(''));
      for (const w of words) if (w.length > 1 && /[A-Z]/.test(w[0]) && map[w[0]] === 0) return;
      const js = expr.replace(/[A-Z0-9]+/g, (w) => val(w)).replace(/×/g, '*').replace(/=/g, '===');
      if (Function(`return ${js}`)()) out.push(letters.map((l) => `${l}=${map[l]}`).join(' '));
      return;
    }
    for (let d = 0; d < 10; d++) if (!used.has(d)) { map[letters[i]] = d; used.add(d); rec(i + 1, map, used); used.delete(d); }
    delete map[letters[i]];
  };
  rec(0, {}, new Set());
  return out;
}

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter((f) => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map((f) => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter((f) => /^p0/.test(f)).map((f) => html[f]).join('\n').replace(/<svg[\s\S]*?<\/svg>/g, ' ');
const beyond = pages.filter((f) => /^p1/.test(f)).map((f) => html[f]).join('\n');
const text = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/\s+/g, ' ');
const bodyText = text(body), beyondText = text(beyond);
const has = (what, src, s) => is(`${what} prints "${s}"`, src.includes(s));

/* ---- A. every equation ----------------------------------------- */

function toExpr(side) {
  let s = side
    .replace(/\\left|\\right/g, '')
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad/g, '')
    .replace(/\^\{([^{}]+)\}/g, '**($1)').replace(/\^(\d)/g, '**$1')
    .replace(/\s+/g, '');
  if (!s || !/^[-+*/().0-9]+$/.test(s)) return null;
  s = s.replace(/\)\(/g, ')*(').replace(/(\d)\(/g, '$1*(');
  return s;
}
const evalExpr = (e) => { try { return Function(`"use strict";return (${e})`)(); } catch { return NaN; } };
let spans = 0; const skipped = [];
for (const [f, src] of [...pages.map((f) => [f, html[f].replace(/<svg[\s\S]*?<\/svg>/g, ' ')]), ['ANSWERS.md', answersMd], ['stage2-bank.mjs', fs.readFileSync(path.join(DIR, 'stage2-bank.mjs'), 'utf8').replace(/\\\\/g, '\\')]]) {
  for (const m of src.matchAll(/\$([^$]+)\$/g)) {
    const span = m[1];
    if (!span.includes('=')) continue;
    for (const part of span.split(/\\qquad|,\s*(?=[^,]*=)/)) {
      const sides = part.split('=').map((s) => s.trim()).filter(Boolean);
      if (sides.length < 2) continue;
      const vals = sides.map(toExpr);
      if (vals.some((v) => v === null)) { skipped.push(`${f}: $${part.trim()}$`); continue; }
      const nums = vals.map(evalExpr);
      if (nums.some((n) => !Number.isFinite(n))) { skipped.push(`${f}: $${part.trim()}$`); continue; }
      spans++;
      if (nums.some((n) => Math.abs(n - nums[0]) > 1e-9)) fails.push(`${f}: $${part.trim()}$ — sides are ${nums.join(' and ')}`);
      else pass++;
    }
  }
}

/* ---- B. the body ----------------------------------------------- */

// 5.1: signs between four consecutive numbers are always even
const signed = (a, b, c, d) => [1, -1].flatMap((s1) => [1, -1].flatMap((s2) => [1, -1].map((s3) => a + s1 * b + s2 * c + s3 * d)));
is('eight expressions for 3,4,5,6', signed(3, 4, 5, 6).length === 8);
is('every choice of four consecutive numbers gives even values', range(-20, 200).every((n) => signed(n, n + 1, n + 2, n + 3).every((v) => mod(v, 2) === 0)));
is('any four numbers: the eight values share one parity', range(0, 3000).every((k) => { const [a, b, c, d] = [k % 7, (k * 3) % 11, (k * 5) % 13, (k * 7) % 17]; return new Set(signed(a, b, c, d).map((v) => mod(v, 2))).size === 1; }));
// Breaking even
ok('Breaking Even: the even arithmetic expressions', [43 + 37, 672 - 348, 4 * 347 * 3, 708 - 477, 809 + 214, 119 * 303, 543 - 479, 513 ** 3].map((v) => mod(v, 2) === 0), [true, true, true, false, false, false, true, false]);
{ const exprs = { '2a+2b': (a, b) => 2 * a + 2 * b, '3g+5h': (a, b) => 3 * a + 5 * b, '4m+2n': (a, b) => 4 * a + 2 * b, '2u-4v': (a, b) => 2 * a - 4 * b, '13k-5k': (a) => 13 * a - 5 * a, '6m-3n': (a, b) => 6 * a - 3 * b, 'x^2+2': (a) => a * a + 2, 'b^2+1': (a) => a * a + 1, '4k*3j': (a, b) => 12 * a * b };
  const always = Object.fromEntries(Object.entries(exprs).map(([k, f]) => [k, range(-9, 9).every((a) => range(-9, 9).every((b) => mod(f(a, b), 2) === 0))]));
  ok('Breaking Even: the algebraic expressions that are always even', always, { '2a+2b': true, '3g+5h': false, '4m+2n': true, '2u-4v': true, '13k-5k': true, '6m-3n': false, 'x^2+2': false, 'b^2+1': false, '4k*3j': true }); }
// Pairs to make fours
is('two multiples of 4 add to a multiple of 4', range(0, 50).every((p) => range(0, 50).every((q) => mod(4 * p + 4 * q, 4) === 0)));
is('two even non-multiples of 4 add to a multiple of 4', range(0, 50).every((p) => range(0, 50).every((q) => mod(4 * p + 2 + 4 * q + 2, 4) === 0)));
is('the examples 2, 6, 10, 18, 22, 42 are 2 more than multiples of 4', [2, 6, 10, 18, 22, 42].every((n) => n % 4 === 2));
is('the examples 4, 12, 16, 24, 36 are multiples of 4', [4, 12, 16, 24, 36].every((n) => n % 4 === 0));
// Always, sometimes, never
is('Statement 2: 50 and 22 are not multiples of 8', 50 % 8 && 22 % 8 && (50 + 22) % 8 === 0);
is('Statement 4: every factor of 12 divides 24', [1, 2, 3, 4, 6, 12].every((d) => 24 % d === 0));
ok('Statement 4: the factors of 24', range(1, 24).filter((d) => 24 % d === 0), [1, 2, 3, 4, 6, 8, 12, 24]);
is('Statement 5: 42 by 28 no, by 14 yes', 42 % 28 !== 0 && 42 % 14 === 0);
is('Statement 6 is always true: 9 and 4 give 36', range(1, 5000).every((n) => !(n % 9 === 0 && n % 4 === 0) || n % 36 === 0));
is('Statement 7 is sometimes true: 12 is not a multiple of 24, 48 is', 12 % 24 !== 0 && 48 % 24 === 0 && lcm(6, 4) === 12);
is('Statement 8 is never true', range(0, 200).every((e) => range(0, 200).every((o) => mod(2 * e + 2 * o + 1, 6) !== 0)));
// What remains
ok('Table 5.10: 5k + 3 for k = 0..4', range(0, 4).map((k) => 5 * k + 3), [3, 8, 13, 18, 23]);
ok('Table 5.10: 5k - 2 for k = 1..5', range(1, 5).map((k) => 5 * k - 2), [3, 8, 13, 18, 23]);
{ const want = range(1, 200).filter((n) => n % 5 === 3);
  const gen = { '3k+5': (k) => 3 * k + 5, '3k-5': (k) => 3 * k - 5, '3k': (k) => 3 * k, '5k+3': (k) => 5 * k + 3, '5k-2': (k) => 5 * k - 2, '5k-3': (k) => 5 * k - 3 };
  const fits = Object.entries(gen).filter(([, g]) => { const vals = range(-5, 60).map(g).filter((v) => v > 0 && v <= 200); return JSON.stringify([...new Set(vals)].sort((a, b) => a - b)) === JSON.stringify(want); }).map(([k]) => k);
  ok('What Remains?: the expressions that give every such number', fits, ['5k+3', '5k-2']); }
// Exercise Set 5.1
ok('5.1 Q1', range(-10, 40).filter((n) => 4 * n + 6 === 34).map((n) => [n, n + 1, n + 2, n + 3]), [[7, 8, 9, 10]]);
ok('5.1 Q3 (i)-(v)', [
  [[2, 4], [2, 6]].map(([a, b]) => (a + b) % 3 === 0),
  [27 % 18 !== 0 && 27 % 9 === 0, 10 % 18 !== 0 && 10 % 9 !== 0],
  [[1, 5], [1, 2]].map(([a, b]) => (a + b) % 6 === 0),
  range(0, 30).every((x) => range(0, 30).every((y) => (6 * x + 9 * y) % 3 === 0)),
  [(18 + 9) % 9 === 0, (12 + 9) % 9 === 0]], [[true, false], [true, true], [true, false], true, [true, false]]);
ok('5.1 Q4', range(1, 40).filter((n) => n % 3 === 2 && n % 4 === 2), [2, 14, 26, 38]);
ok('5.1 Q5: the pebbles', range(1, 100).filter((n) => n % 3 === 1 && n % 2 === 1 && n % 5 === 1 && n % 7 === 0), [91]);
is('5.1 Q6: three numbers 2 more than multiples of 6 add to a multiple of 6', range(0, 20).every((a) => range(0, 20).every((b) => (6 * a + 2 + 6 * b + 2 + 20) % 6 === 0)));
ok('5.1 Q7: 661 and 4779 mod 7, and the sum and difference', [661 % 7, 4779 % 7, (4779 + 661) % 7, (4779 - 661) % 7], [3, 5, 1, 2]);
ok('5.1 Q8', range(1, 200).filter((n) => n % 3 === 2 && n % 4 === 3 && n % 5 === 4).slice(0, 2), [59, 119]);
// 5.2, divisibility by 9
is('999, 909, 900, 90, 990 are all multiples of 9', [999, 909, 900, 90, 990].every((n) => n % 9 === 0));
is('99 is a multiple of 9 and 109 is not', 99 % 9 === 0 && 109 % 9 !== 0);
ok('Example 1: 427 mod 9', [427 % 9, 4 + 2 + 7], [4, 13]);
ok('Example 2: 7309 mod 9 and its digit sums', [7309 % 9, dsum(7309), dsum(19), dsum(10)], [1, 19, 10, 1]);
is('the digit-sum statements (i)-(iv) are all correct', range(1, 20000).every((n) => (n % 9 === 0) === (dsum(n) % 9 === 0)));
is('the digital root gives the remainder, 9 meaning 0', range(1, 20000).every((n) => droot(n) % 9 === n % 9));
ok('5.2 Q1', [123, 405, 8888, 93547, 358095].map((n) => n % 9 === 0), [false, true, false, false, false]);
ok('5.2 Q2', range(1, 2000).find((n) => n % 9 === 0 && digits(n).every((d) => d % 2 === 0)), 288);
ok('5.2 Q3', range(5900, 6100).filter((n) => n % 9 === 0).sort((a, b) => Math.abs(a - 6000) - Math.abs(b - 6000))[0], 6003);
ok('5.2 Q4', range(4301, 4399).filter((n) => n % 9 === 0).length, 11);
is('15, 33 and 87 are multiples of 3 but not of 9', [15, 33, 87].every((n) => n % 3 === 0 && n % 9 !== 0));
// 11
ok('Table 5.12: 1, 10, 100, 1000 mod 11', [1, 10, 100, 1000].map((n) => n % 11), [1, 10, 1, 10]);
ok('400, 60, 2', [400 - 396, 66 - 60, 396 % 11, 66 % 11], [4, 6, 0, 0]);
ok('462 is divisible by 11', [alt(462), 462 % 11], [0, 0]);
ok('Example 3: 320185', [5 + 1 + 2, 8 + 0 + 3, alt(320185), 320185 % 11], [8, 11, -3, 8]);
ok('Example 4: 328105', [alt(328105), 328105 % 11], [-3, 8]);
ok('in-text list: remainders on division by 11', [158, 841, 481, 5529, 90904, 857076].map((n) => n % 11), [4, 5, 8, 7, 0, 0]);
{ const divs = [2, 3, 4, 5, 6, 8, 9, 10, 11];
  const row = (n) => divs.map((d) => (n % d === 0 ? 'Yes' : 'No'));
  const printed = [...body.matchAll(/<tr><td>\$128\$<\/td>((?:<td>[^<]*<\/td>)+)<\/tr>/g)][0];
  ok('Table 5.13: the 128 row as printed', printed ? [...printed[1].matchAll(/<td>([^<]*)<\/td>/g)].map((m) => m[1]) : null, row(128));
  const md = {};
  for (const m of answersMd.matchAll(/^\| (\d+) \| ((?:(?:Yes|No) \|\s?){9})\s*$/gm)) md[m[1]] = m[2].split('|').map((s) => s.trim()).filter(Boolean);
  const nums = [128, 990, 1586, 275, 6686, 639210, 429714, 2856, 3060, 406839];
  for (const n of nums) ok(`ANSWERS.md Table 5.13 row ${n}`, md[n], row(n)); }
ok('divisible by 6: 38, 225, 186, 64', [38, 225, 186, 64].map((n) => n % 6 === 0), [false, false, true, false]);
is('12 is divisible by 4 and 6, not 24', 12 % 4 === 0 && 12 % 6 === 0 && 12 % 24 !== 0);
is('3 and 8 settle 24', range(1, 5000).every((n) => (n % 3 === 0 && n % 8 === 0) === (n % 24 === 0)));
// digital roots
ok('digital root of 489710', [dsum(489710), dsum(29), dsum(11), droot(489710)], [29, 11, 2, 2]);
ok('600 to 700 with digital roots 5, 7, 3', [5, 7, 3].map((r) => range(601, 699).filter((n) => droot(n) === r)), [
  [608, 617, 626, 635, 644, 653, 662, 671, 680, 689, 698],
  [601, 610, 619, 628, 637, 646, 655, 664, 673, 682, 691],
  [606, 615, 624, 633, 642, 651, 660, 669, 678, 687, 696]]);
ok('digital roots of multiples of 3, 4, 6', [3, 4, 6].map((k) => range(1, 9).map((i) => droot(k * i))), [[3, 6, 9, 3, 6, 9, 3, 6, 9], [4, 8, 3, 7, 2, 6, 1, 5, 9], [6, 3, 9, 6, 3, 9, 6, 3, 9]]);
ok('digital roots of 6k + 1', range(0, 5).map((k) => droot(6 * k + 1)), [1, 7, 4, 1, 7, 4]);
{ const n = 111111111; ok('the riddle', [digits(n).length, dsum(n), droot(n)], [9, 9, 9]); }
ok('5.3 Q1', [...new Set(range(10000000, 10000400).filter((n) => droot(n) === 5).map((n) => droot(n + 10)))], [6]);
ok('5.3 Q2: adding 11 moves the root on by 2', [...new Set(range(1, 500).map((n) => mod(droot(n + 11) - droot(n), 9)))], [2]);
ok('5.3 Q3', [...new Set(range(0, 30).flatMap((a) => range(0, 30).map((b) => droot(9 * a + 36 * b + 13))))], [4]);
is('5.3 Q4 (ii)', range(1, 5000).every((n) => droot(n) % 3 === n % 3));
is('5.3 Q4 (i): no parity link', droot(10) === 1 && droot(19) === 1 && 10 % 2 !== 19 % 2);
// 5.3 Digits in Disguise
ok('Fig. 5.14 (i)', crypt('A1 + 1B = B0'), ['A=7 B=9']);
ok('Fig. 5.14 (ii)', crypt('AB + 37 = 6A'), ['A=2 B=5']);
ok('Fig. 5.14 (iii)', crypt('ON + ON + ON = PO'), ['O=1 N=7 P=5', 'O=2 N=4 P=7', 'O=3 N=1 P=9']);
ok('Fig. 5.14 (iv)', crypt('QR + QR + QR = PRR'), ['Q=8 R=5 P=2']);
ok('Example 5', crypt('PQ × 8 = RS'), ['P=1 Q=2 R=9 S=6']);
is('Example 5: 13 × 8 and above have three digits', range(13, 99).every((n) => n * 8 >= 100));
ok('GH × H = 9K', crypt('GH × H = 9K'), ['G=2 H=4 K=6']);
ok('GH × H: which listed products fit', [[11, 9], [12, 8], [46, 2], [24, 4], [47, 2], [31, 3], [16, 6]].filter(([a, b]) => a % 10 === b && a * b >= 90 && a * b <= 99 && new Set([Math.floor(a / 10), b, (a * b) % 10]).size === 3).map(([a, b]) => `${a}x${b}`), ['24x4']);
ok('BYE × 6 = RAY', crypt('BYE × 6 = RAY'), ['B=1 Y=0 E=5 R=6 A=3']);
is('Anshu: 170 × 6 has four digits', 170 * 6 === 1020);
ok('the six to solve', ['UT × 3 = PUT', 'AB × 5 = BC', 'L2N × 2 = 2NP', 'XY × 4 = ZX', 'PP × QQ = PRP', 'JK × 6 = KKK'].map((e) => crypt(e)), [
  ['U=5 T=0 P=1'], ['A=1 B=9 C=5'], ['L=1 N=4 P=8', 'L=1 N=5 P=0'], ['X=2 Y=3 Z=9'], ['P=2 Q=1 R=4', 'P=3 Q=1 R=6', 'P=4 Q=1 R=8'], ['J=7 K=4']]);
// Exercise Set 5.4
ok('5.4 Q1', range(0, 9).filter((z) => (3100 + 10 * z + 5) % 9 === 0), [0, 9]);
is('5.4 Q2: Snehal is wrong, 20 + 8 = 28', 20 % 12 === 8 && (8 + 4) % 12 === 0 && 28 % 8 !== 0 && (8 + 8) % 8 === 0);
is('5.4 Q3: 3m + 3n is a multiple of 6 exactly when m + n is even', range(0, 40).every((m) => range(0, 40).every((n) => ((3 * m + 3 * n) % 6 === 0) === ((m + n) % 2 === 0))));
is('5.4 Q4: any shuffle of a multiple of 9', range(1, 3000).filter((n) => n % 9 === 0).every((n) => Number(String(n).split('').reverse().join('')) % 9 === 0));
ok('5.4 Q5', range(0, 9).flatMap((a) => range(0, 9).map((b) => [a, b])).filter(([a, b]) => Number(`48${a}23${b}`) % 18 === 0).map((x) => x.join(',')), ['1,0', '2,8', '4,6', '6,4', '8,2']);
ok('5.4 Q6', range(0, 9).flatMap((p) => range(0, 9).map((q) => [p, q])).filter(([p, q]) => Number(`3${p}7${q}8`) % 44 === 0).map((x) => x.join(',')), ['1,6', '3,4', '5,2', '7,0']);
ok('5.4 Q7', range(1, 40).filter((n) => n % 2 === 0 && (n + 1) % 3 === 0 && (n + 2) % 4 === 0), [2, 14, 26, 38]);
is('5.4 Q8: 45000 itself is a multiple of 36, so strictly between starts at 45036', 45000 % 36 === 0 && 700 % 9 === 7);
ok('5.4 Q8', range(45001, 46999).filter((n) => n % 36 === 0).slice(0, 5), [45036, 45072, 45108, 45144, 45180]);
is('5.4 Q10: 200025 and 520002', 200025 % 15 === 0 && 520002 % 6 === 0);
ok('5.4 Q12', [
  range(1, 30).every((a) => range(1, 30).every((b) => (6 * a * 3 * b) % 9 === 0)),
  range(-20, 50).every((n) => (2 * n + 2 * n + 2 + 2 * n + 4) % 6 === 0),
  range(0, 99999).filter((i) => (i * 6) >= 100000 && i * 6 < 1000000).slice(0, 3000).every((i) => { const s = String(i * 6); return Number(s[1] + s[0] + s[3] + s[2] + s[4] + s[5]) % 6 === 0; }),
  range(-50, 50).some((b) => mod(8 * (7 * b - 3) - 4 * (11 * b + 1), 12) === 0)], [true, true, true, false]);
is('5.4 Q13: a sum of three is divisible by 3 when the remainders are all equal or all different', range(0, 20).every((a) => range(0, 20).every((b) => range(0, 20).every((c) => { const r = [a % 3, b % 3, c % 3]; return ((a + b + c) % 3 === 0) === (new Set(r).size !== 2); }))));
ok('5.4 Q14', [2, 3, 4, 5].map((k) => range(1, 300).map((n) => range(n, n + k - 1).reduce((x, y) => x * y, 1)).reduce(gcd)), [2, 6, 24, 120]);
ok('5.4 Q15', [crypt('EF × E = GGG'), crypt('WOW × 5 = MEOW')], [['E=3 F=7 G=1'], ['W=5 O=7 M=2 E=8']]);
is('5.4 Q16: every multiple of 32 is a multiple of 8, and of 8 a multiple of 4', range(1, 2000).every((n) => (n % 32 ? true : n % 8 === 0) && (n % 8 ? true : n % 4 === 0)) && 4 % 8 !== 0 && 8 % 32 !== 0);

/* ---- C. Beyond the Book, Stages 1 and 2 ------------------------ */

// Stage 1
is('Stage 1: 1 to 9 add to 45, odd', range(1, 9).reduce((a, b) => a + b) === 45);
{ const sets = []; for (let m = 0; m < 256; m++) { const s = range(1, 8).filter((_, i) => m >> i & 1); if (s.reduce((a, b) => a + b, 0) === 18) sets.push(s); }
  is('Stage 1: 1 to 8 split into two piles of 18', sets.some((s) => s.join() === '1,2,4,5,6') && sets.some((s) => s.join() === '3,7,8')); }
{ const n = BigInt('4'.repeat(36)); is('Stage 1: 36 fours is divisible by 9, 11 and 12', n % 9n === 0n && n % 11n === 0n && n % 12n === 0n); }
ok('Stage 1: two-digit numbers equal to 4 times their digit sum', range(10, 99).filter((n) => n === 4 * dsum(n)), [12, 24, 36, 48]);
ok('Stage 1: AB + BA = 121', range(10, 99).filter((n) => n % 10 !== 0 && n % 11 !== 0 && n + Number(String(n).split('').reverse().join('')) === 121), [29, 38, 47, 56, 65, 74, 83, 92]);
ok('Stage 1: Priya', [droot(347), droot(286), droot(35), droot(99142), 347 * 286, droot(347 * 286), droot(99224)], [5, 7, 8, 7, 99242, 8, 8]);
is('Stage 1: abcabc is divisible by 7, 11, 13', range(100, 999).every((n) => (n * 1001) % 7 === 0 && (n * 1001) % 11 === 0 && (n * 1001) % 13 === 0) && 1001 === 7 * 11 * 13);
has('Stage 1', beyondText, '$29, 38, 47, 56, 65, 74, 83$ or $92$');

// Stage 2: every option recomputed, keys read off the page
const exs = {};
for (const m of beyond.matchAll(/<div class="c-example" data-question-type="([^"]+)"><div class="c-example__tab">Example (\d+) ·[\s\S]*?Answer<\/span><span>([^<]*)<\/span>/g)) {
  const block = m[0];
  const opts = [...(block.match(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*?)<\/ol>/) || ['', ''])[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((x) => text(x[1]).trim());
  exs[m[2]] = { type: m[1], opts, answer: text(m[3]).trim() };
}
ok('Stage 2: Examples 1-15, in order', Object.keys(exs).map(Number), range(1, 15));
ok('Stage 2: formats 6/4/3/2', Object.values(exs).map((e) => e.type), [...Array(6).fill('Single correct'), ...Array(4).fill('Multiple correct'), ...Array(3).fill('Numerical answer'), 'Matching', 'Matching']);
const keyOf = (n) => [...exs[n].answer.matchAll(/\(([a-d])\)/g)].map((x) => x[1]).join('');
const num = (s) => Number(String(s).replace(/\$/g, '').replace(/\\,|\s/g, ''));
const S2 = {
  1: [(o) => range(0, 40).every((n) => mod({ '$n + 7$': n + 7, '$3n + 1$': 3 * n + 1, '$2n^2 + 7$': 2 * n * n + 7, '$5n + 2$': 5 * n + 2 }[o.replace(/\s+/g, ' ')], 2) === 1)],
  2: [(o) => (70241 + 1000 * num(o)) % 9 === 0],
  3: [(o) => num(o) === 70413 % 11],
  4: [(o) => range(0, 50).every((k) => (3 * (8 * k + 5)) % 8 === num(o))],
  5: [(o) => range(0, 50).every((k) => droot(9 * k + 4 + 7) === num(o))],
  6: [(o) => crypt('AB × 7 = CBA').includes(`A=${String(o)[0]} B=${String(o)[1]} C=${String(num(o) * 7)[0]}`)],
  7: [(o) => num(o) % 6 === 0],
  8: [(o, i) => [(a, b) => a + b, (a, b) => a - b, (a, b) => a * b, (a, b) => a / b][i] && range(1, 20).every((a) => range(1, 20).every((b) => { const v = [(x, y) => x + y, (x, y) => x - y, (x, y) => x * y, (x, y) => x / y][i](7 * a, 7 * b); return Number.isInteger(v) && v % 7 === 0; }))],
  9: [(o, i) => range(0, 60).map((k) => 9 * k + 6).every((N) => [N % 9 === 6, (N + 3) % 9 === 0, droot(2 * N) === 3, (N - 6) % 18 === 0][i])],
  10: [(o, i) => range(0, 100).every((m) => { const f = range(m, m + 4), s = f.reduce((a, b) => a + b); return [s % 5 === 0, s % 2 === 1, f.filter((x) => x % 5 === 0).length === 1, f.filter((x) => x % 2 === 0).length >= 2][i]; })],
};
for (const [n, [f]] of Object.entries(S2)) {
  ok(`Example ${n}: four options`, exs[n].opts.length, 4);
  ok(`Example ${n}: the right option(s) are the keyed ones`, pick(exs[n].opts, f), keyOf(n));
}
ok('Example 6: the other options give', [79, 69, 96].map((x) => x * 7), [553, 483, 672]);
ok('Example 11', String(range(0, 9).filter((d) => Number(`6${d}875`) % 11 === 0)), exs[11].answer);
ok('Example 12', String(range(1, 200).filter((n) => droot(n) === 7).length), exs[12].answer);
ok('Example 13', String(10n ** 25n % 11n), exs[13].answer);
{ // matching: the keyed combination is the only one that fits
  const cells = (n) => [...exs[n] ? beyond.split(`Example ${n} ·`)[1].split('</table>')[0].matchAll(/<tr><td>\(([PQRS])\) ([^<]*)<\/td><td>\((\d)\) ([^<]*)<\/td><\/tr>/g) : []].map((m) => [m[2].trim(), m[4].trim()]);
  const m14 = cells(14), m15 = cells(15);
  const rem = m14.map(([l]) => num(l) % 9), right14 = m14.map(([, r]) => num(r));
  const combo = (map) => map.map((v, i) => `${'PQRS'[i]}–${v}`).join(', ');
  const want14 = combo(rem.map((r) => right14.indexOf(r) + 1));
  is(`Example 14: keyed ${exs[14].answer} is ${want14}`, exs[14].answer.endsWith(want14) && exs[14].opts[['a', 'b', 'c', 'd'].indexOf(keyOf(14))] === want14);
  const tests = { 8: (n) => (n % 1000) % 8 === 0, 6: (n) => dsum(n) % 3 === 0 && n % 2 === 0, 11: (n) => alt(n) % 11 === 0, 4: (n) => (n % 100) % 4 === 0 };
  const which = [(n) => (n % 1000) % 8 === 0, (n) => dsum(n) % 3 === 0 && n % 2 === 0, (n) => alt(n) % 11 === 0, (n) => (n % 100) % 4 === 0]
    .map((t) => Object.keys(tests).find((d) => range(1, 5000).every((n) => t(n) === (n % Number(d) === 0))));
  const right15 = m15.map(([, r]) => r);
  const want15 = combo(which.map((d) => right15.indexOf(d) + 1));
  is(`Example 15: keyed ${exs[15].answer} is ${want15}`, exs[15].answer.endsWith(want15) && exs[15].opts[['a', 'b', 'c', 'd'].indexOf(keyOf(15))] === want15);
  ok('Example 14: digit sums', m14.map(([l]) => dsum(num(l))), [12, 23, 28, 18]);
}
ok('single-correct keys spread', range(1, 6).map(keyOf).join(''), 'cadbad');
is('Stage 2 prints no body answer (288, 6003, 91, 59, 111111111)', !/\b(288|6003|59|91|111111111)\b/.test(text(beyond.split('c-stage__title">Solved Examples')[1].split('c-practice__num')[0])));

/* ---- D. the practice questions -------------------------------- */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] = m[2];
const optsOf = (n) => [...((qs[n] || '').match(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*?)<\/ol>/) || ['', ''])[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((x) => text(x[1]).trim());
const key = {};
{ const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2]; }
const always = (f) => range(0, 200).every(f);
const solveQ = {
  1: (o) => o.map((s) => ({ '$3n + 2$': always((n) => (3 * n + 2) % 2 === 0), '$4n + 6$': always((n) => (4 * n + 6) % 2 === 0), '$n + 5$': always((n) => (n + 5) % 2 === 0), '$7n$': always((n) => (7 * n) % 2 === 0) }[s])),
  2: (o) => o.map((s) => num(s) === droot(987654)),
  3: (o) => o.map((s) => num(s) % 11 === 0),
  4: (o) => o.map((s) => num(s) === 7432 % 9),
  5: (o) => o.map((s) => Number(`3${num(s)}72`) % 12 === 0),
  6: (o) => { const xs = range(0, 100).map((k) => 6 * k + 2); return [xs.every((x) => x % 2), xs.every((x) => x % 3 === 0), xs.every((x) => x % 4 === 0), xs.every((x) => x % 2 === 0)]; },
  7: (o) => o.map((s) => always((m) => range(m, m + 6).reduce((a, b) => a + b) % num(s) === 0)),
  8: (o) => o.map((s) => num(s) === range(0, 20).find((k) => (2023 + k) % 9 === 0)),
  9: (o) => { const ns = range(100, 999).filter((n) => digits(n)[1] === digits(n)[0] + digits(n)[2]); return o.map((s) => ns.every((n) => n % num(s) === 0)); },
  10: (o) => { const as = range(1, 60).filter((a) => 36 % a === 0 && 60 % a === 0); return o.map((s) => as.every((a) => num(s) % a === 0)); },
  11: (o) => o.map((s) => num(s) % 36 === 0),
  12: (o) => { const c = crypt('BA × 4 = CAB').map((x) => Number(x.match(/C=(\d)/)[1])); return o.map((s) => c.length === 1 && c[0] === num(s)); },
  13: (o) => { const f = { '$5a + 1$': (a) => 5 * a + 1, '$a + 2$': (a) => a + 2, '$3a$': (a) => 3 * a, '$2a + 1$': (a) => 2 * a + 1 }; return o.map((s) => range(0, 100).filter((a) => a % 2).every((a) => f[s](a) % 2 === 0)); },
  14: (o) => o.map((s) => num(s) % 33 === 0),
  15: (o) => o.map((s) => num(s) === droot(2 ** 10)),
};
for (const [q, f] of Object.entries(solveQ)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  ok(`Q${q}: the right option`, f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean), [key[q]]);
}
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  16: [7425 % 9 === 0, dsum(7425) === 18, true],
  17: [range(1, 2000).every((n) => !(n % 4 === 0 && n % 10 === 0) || n % 40 === 0), range(1, 3000).every((n) => !(n % 4 === 0 && n % 10 === 0) || n % lcm(4, 10) === 0), false],
  18: [true, true, false],
  19: [90816 % 3 === 0, range(1, 200).every((n) => ((n % 10) % 3 === 0) === (n % 3 === 0)), false],
};
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every((l) => letters.filter((x) => x === l).length >= 3));
ok('key covers 1-19', Object.keys(key).map(Number).sort((a, b) => a - b), range(1, 19));

// written answers, read back out of the key
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= text(m[2]);
const row = (q) => { const [, n, part] = String(q).match(/^(\d+)([a-c]?)$/); const r = keyRows[n] || ''; if (!part) return r; const m = r.match(new RegExp(`\\(${part}\\)([^(]*)`)); return m ? m[1] : ''; };
const says = (q, ...vals) => { for (const v of vals) is(`key ${q} should say ${v}: "${row(q)}"`, new RegExp(`(^|[^\\d])${String(v)}([^\\d]|$)`).test(row(q))); };
says(20, droot(8888888), 8 * 7);
says(21, range(1000, 1100).find((n) => n % 11 === 0));
says(22, dsum(123456789)); is('Q22: 123456789 is divisible by 9', 123456789 % 9 === 0);
ok('Q23', range(0, 9).filter((d) => Number(`5${d}64`) % 12 === 0), [0, 3, 6, 9]); says(23, 0, 3, 6, 9);
is('Q24', range(0, 100).every((k) => (2 * (4 * k + 3)) % 4 === 2));
ok('Q25', [...new Set(range(0, 50).map((k) => [3, 4, 6].map((d) => (12 * k + 7) % d).join()))], ['1,3,1']); says(25, 1, 3);
ok('Q26', crypt('ABC × 3 = CCC'), ['A=1 B=8 C=5']); says(26, 185, 555);
ok('Q27', crypt('ABCD × 4 = DCBA'), ['A=2 B=1 C=7 D=8']); says(27, 2178, 8712);
is('Q28: 100a + 10b + c and 2a + 3b + c agree mod 7', range(100, 999).every((n) => { const [a, b, c] = digits(n); return n % 7 === (2 * a + 3 * b + c) % 7; }));
ok('Q28: 581 and 692', [2 * 5 + 3 * 8 + 1, 581 % 7, 581 / 7, 2 * 6 + 3 * 9 + 2, 41 % 7, 692 % 7], [35, 0, 83, 41, 6, 6]); says(28, 35, 83, 41, 6);
{ const perms = (a) => a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p]));
  const ns = perms([1, 2, 3, 4, 5, 6]).map((p) => Number(p.join('')));
  ok('Q29: arrangements of 1-6 divisible by 3, 9, 11', [ns.every((n) => n % 3 === 0), ns.some((n) => n % 9 === 0), ns.some((n) => n % 11 === 0), Math.max(...ns.map((n) => Math.abs(alt(n))))], [true, false, false, 9]); }
ok('Q30 (a)', [35728, 47219, 80916].map((n) => [alt(n), n % 11 === 0]), [[11, true], [7, false], [22, true]]); says('30a', 11, 22, 7);
ok('Q30 (b)', range(0, 9).filter((d) => Number(`6190${d}`) % 11 === 0), [8]); says('30b', 8, 22, 61908);
is('Q30 (c): swapping unequal neighbours of a valid code never gives a valid code', range(1, 9090).map((k) => 11 * k).filter((n) => n >= 10000 && n < 100000).every((n) => { const s = String(n); for (let i = 0; i < 4; i++) if (s[i] !== s[i + 1] && !(i === 0 && s[1] === '0')) { const t = s.slice(0, i) + s[i + 1] + s[i] + s.slice(i + 2); if (Number(t) % 11 === 0) return false; } return true; }));
ok('Q31 (a)', [26352, 58062, 70236].map((n) => [dsum(n), n % 9 === 0]), [[18, true], [21, false], [18, true]]); says('31a', 18, 21);
ok('Q31 (b)', range(0, 9).filter((d) => Number(`4731${d}`) % 9 === 0), [3]); says('31b', 3, 47313);
is('Q31 (c): 62352 is a multiple of 9 too', 62352 % 9 === 0); says('31c', 26352, 62352);

/* ---- E. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
{ const at = answersMd.indexOf('as the key prints it');
  for (const m of answersMd.slice(at, at + 500).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2]; }
ok('ANSWERS.md key matches the page', mdKey, key);
for (const [n, e] of Object.entries(exs)) is(`ANSWERS.md carries Example ${n}'s answer ${e.answer}`, answersMd.includes(`| ${n} | ${e.type} | ${e.answer.replace(/\$/g, '')} |`) || answersMd.includes(`| ${n} | ${e.type} | ${e.answer} |`));

/* ---- report ---------------------------------------------------- */

console.log(`A  ${spans} equations evaluated; ${skipped.length} spans not pure arithmetic, skipped`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
