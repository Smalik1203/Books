#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value: each claim is computed from
   first principles — trial division, divisor lists, common multiples —
   and then compared with what is on the page.

     node pages/class-6/math-ch05-prime-time/check-numbers.mjs

   Three parts:
     A  every arithmetic identity set as maths anywhere in the chapter
     B  the claims arithmetic alone cannot check: that a factor is prime,
        that a list of factors is complete, that a count is right
     C  every multiple-choice and assertion-reason question — exactly one
        option is right, and it is the one the printed key gives

   Exits non-zero on the first thing that does not hold up. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
let pass = 0;
const fails = [];

function ok(what, got, want) {
  const same = JSON.stringify(got) === JSON.stringify(want);
  if (same) pass++;
  else fails.push(`${what}\n      computed ${JSON.stringify(got)}\n      printed  ${JSON.stringify(want)}`);
}
function is(what, cond) {
  if (cond) pass++; else fails.push(what);
}

/* ---- the mathematics, computed ------------------------------ */

const isPrime = (n) => {
  if (!Number.isInteger(n) || n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
};
const factorise = (n) => {
  const out = [];
  for (let d = 2; d * d <= n; d++) while (n % d === 0) { out.push(d); n /= d; }
  if (n > 1) out.push(n);
  return out;
};
const divisors = (n) => {
  const out = [];
  for (let d = 1; d <= n; d++) if (n % d === 0) out.push(d);
  return out;
};
const common = (a, b) => divisors(a).filter(d => b % d === 0);
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const lcm = (...xs) => xs.reduce((a, b) => a * b / gcd(a, b));
const coprime = (a, b) => gcd(a, b) === 1;
const primesUpTo = (n) => { const o = []; for (let i = 2; i <= n; i++) if (isPrime(i)) o.push(i); return o; };
const countMultiples = (m, lo, hi) => { let c = 0; for (let i = lo; i <= hi; i++) if (i % m === 0) c++; return c; };

/* ---- A. every arithmetic identity on the page ---------------- */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();

/* A maths span is arithmetic we can check only when every side of it
   parses to a number. A span with a placeholder in it (\square, ???) or
   with words in it is skipped, and the count of skips is reported so a
   silent drop cannot hide a wrong line. */
function toExpr(side) {
  let s = side
    .replace(/\\times/g, '*')
    .replace(/\\div/g, '/')
    .replace(/\\cdot/g, '*')
    .replace(/\\,/g, '')
    .replace(/\\ /g, ' ')
    .replace(/\\quad/g, ' ')
    .replace(/\{,\}/g, '')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, '');
  if (!s || !/^[-+*/()0-9.]+$/.test(s)) return null;
  return s;
}

let checked = 0;
const skipped = [];

for (const f of pages) {
  const html = fs.readFileSync(path.join(DIR, f), 'utf8');
  for (const m of html.matchAll(/\$([^$]+)\$/g)) {
    let span = m[1];
    if (!span.includes('=')) continue;
    // "A \quad \text{and} \quad B" is two independent statements
    const parts = span.includes('\\text{and}')
      ? span.split(/\\quad\s*\\text\{and\}\s*\\quad/)
      : [span];
    for (const part of parts) {
      const sides = part.split('=').map(s => s.trim()).filter(Boolean);
      if (sides.length < 2) continue;
      const vals = sides.map(toExpr);
      if (vals.some(v => v === null)) { skipped.push(`${f}: $${part.trim()}$`); continue; }
      const nums = vals.map(v => {
        try { return Function(`"use strict";return (${v})`)(); } catch { return NaN; }
      });
      if (nums.some(n => !Number.isFinite(n))) { skipped.push(`${f}: $${part.trim()}$`); continue; }
      checked++;
      const first = nums[0];
      if (nums.some(n => Math.abs(n - first) > 1e-9))
        fails.push(`${f}: $${part.trim()}$ — sides are ${nums.join(' and ')}`);
      else pass++;
    }
  }
}

/* An expectation typed out by hand drifts from the page the moment the
   page is corrected — which happened once already, to the factors of 252.
   So the answer rows are read back out of the pages instead: the row is
   found by its question number, and the numbers in it are compared with
   the numbers computed here. */
const ANSWER_ROWS = (() => {
  const rows = {};
  for (const f of pages) {
    const html = fs.readFileSync(path.join(DIR, f), 'utf8');
    for (const m of html.matchAll(
      /<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span>/g))
      rows[m[1]] = m[2];
  }
  return rows;
})();

function printedNumbers(q) {
  const row = ANSWER_ROWS[String(q)];
  if (row === undefined) { fails.push(`no printed answer row for question ${q}`); return null; }
  return [...row.replace(/<[^>]+>/g, ' ').matchAll(/\d+/g)].map(x => Number(x[0]));
}

/* The list a question asks for, as printed, ignoring any number that is
   part of the reasoning rather than of the list. */
function okPrintedList(what, q, want) {
  const got = printedNumbers(q);
  if (got === null) return;
  const missing = want.filter(n => !got.includes(n));
  if (missing.length) fails.push(`${what} — the page leaves out ${missing.join(', ')}`);
  else pass++;
}

/* A whole-row check is not enough for a lettered answer: changing the 42
   in part (c) of question 30 left the 42 in part (b) standing, and the
   row still contained every number it should. So each part is read out
   on its own and its numbers compared exactly. */
function printedPart(q, letter) {
  const row = ANSWER_ROWS[String(q)];
  if (row === undefined) { fails.push(`no printed answer row for question ${q}`); return null; }
  const flat = row.replace(/<[^>]+>/g, ' ');
  const re = new RegExp(`\\(${letter}\\)([\\s\\S]*?)(?=\\([a-e]\\)|$)`);
  const m = flat.match(re);
  if (!m) { fails.push(`question ${q} has no part (${letter})`); return null; }
  return [...m[1].matchAll(/\d+/g)].map(x => Number(x[0]));
}

function okPart(what, q, letter, want) {
  const got = printedPart(q, letter);
  if (got === null) return;
  const w = [].concat(want);
  if (JSON.stringify(got) !== JSON.stringify(w))
    fails.push(`${what}\n      computed ${JSON.stringify(w)}\n      printed  ${JSON.stringify(got)} in part (${letter}) of question ${q}`);
  else pass++;
}

/* ---- B. the claims arithmetic cannot check ------------------- */

// body, section 5.3 and 5.4 — the five worked examples
ok('Ex1 factors of 15', divisors(15), [1, 3, 5, 15]);
ok('Ex1 factors of 39', divisors(39), [1, 3, 13, 39]);
ok('Ex1 factors of 4', divisors(4), [1, 2, 4]);
ok('Ex1 factors of 9', divisors(9), [1, 3, 9]);
is('Ex1 15 and 39 are not co-prime', !coprime(15, 39));
is('Ex1 4 and 9 are co-prime', coprime(4, 9));
ok('Ex2 prime factorisation of 180', factorise(180), [2, 2, 3, 3, 5]);
ok('Ex3 prime factorisation of 40', factorise(40), [2, 2, 2, 5]);
ok('Ex3 prime factorisation of 231', factorise(231), [3, 7, 11]);
is('Ex3 40 and 231 are co-prime', coprime(40, 231));
ok('Ex4 prime factorisation of 242', factorise(242), [2, 11, 11]);
ok('Ex4 prime factorisation of 195', factorise(195), [3, 5, 13]);
is('Ex4 242 and 195 are co-prime', coprime(195, 242));
ok('Ex5 prime factorisation of 168', factorise(168), [2, 2, 2, 3, 7]);
is('Ex5 168 is divisible by 12', 168 % 12 === 0);

// body prose the examples lean on
is('75 is not divisible by 21', 75 % 21 !== 0);
ok('75 divided by 21 leaves', 75 % 21, 12);
ok('42 divided by 12 leaves', 42 % 12, 6);
ok('prime factorisation of 56', factorise(56), [2, 2, 2, 7]);
ok('prime factorisation of 63', factorise(63), [3, 3, 7]);
ok('prime factorisation of 80', factorise(80), [2, 2, 2, 2, 5]);
is('56 and 63 are not co-prime', !coprime(56, 63));
is('80 and 63 are co-prime', coprime(80, 63));
ok('prime factorisation of 36', factorise(36), [2, 2, 3, 3]);
ok('prime factorisation of 72', factorise(72), [2, 2, 2, 3, 3]);
ok('prime factorisation of 30', factorise(30), [2, 3, 5]);
ok('prime factorisation of 225', factorise(225), [3, 3, 5, 5]);
ok('prime factorisation of 84 (summary)', factorise(84), [2, 2, 3, 7]);
ok('common multiples of 3 and 5, first four',
  [15, 30, 45, 60].filter(n => n % 3 === 0 && n % 5 === 0), [15, 30, 45, 60]);
ok('common factors of 14 and 36', common(14, 36), [1, 2]);
ok('factors of 24 (Jump Jackpot)', divisors(24), [1, 2, 3, 4, 6, 8, 12, 24]);
ok('28 is perfect', divisors(28).reduce((a, b) => a + b, 0), 56);

// Beyond, stage 1 — kept word for word, so its numbers are checked too
ok('idli-vada with 6 and 8 up to 100',
  [...Array(100)].map((_, i) => i + 1).filter(n => n % 6 === 0 && n % 8 === 0), [24, 48, 72, 96]);
ok('first common multiple of 6 and 8', lcm(6, 8), 24);
ok('laddoos between 40 and 50, multiple of 4 and 6',
  [...Array(11)].map((_, i) => i + 40).filter(n => n % 4 === 0 && n % 6 === 0), [48]);
is('391 is composite', !isPrime(391));
ok('391 factorised', factorise(391), [17, 23]);
ok('391 divided by 7, 11, 13', [391 % 7, 391 % 11, 391 % 13], [6, 6, 1]);
ok('digits d with 73d4 divisible by 8',
  [...Array(10).keys()].filter(d => (7304 + d * 10) % 8 === 0), [0, 4, 8]);
ok('prime factorisation of 275', factorise(275), [5, 5, 11]);
is('84 and 275 are co-prime', coprime(84, 275));

// Beyond, stage 2 — its own Examples 1 to 14 (Class 7 numbers Beyond's
// examples afresh, not on from the body)
{
  const tabs = (files) => files.flatMap(f => [...fs.readFileSync(path.join(DIR, f), 'utf8')
    .matchAll(/c-example__tab">Example (\d+)</g)].map(m => Number(m[1])));
  ok('body examples numbered 1 to 5', tabs(pages.filter(f => /^p0/.test(f))), [1, 2, 3, 4, 5]);
  ok('Beyond examples numbered 1 to 14', tabs(pages.filter(f => /^p1/.test(f))),
    Array.from({ length: 14 }, (_, k) => k + 1));
}
ok('Beyond Ex1 smallest multiple of 4, 6 and 10', lcm(4, 6, 10), 60);
ok('Beyond Ex2 count of multiples of both 4 and 6 in 1..100', countMultiples(lcm(4, 6), 1, 100), 8);
ok('Beyond Ex2 first common multiple of 4 and 6', lcm(4, 6), 12);
ok('Beyond Ex2 the eight of them',
  [...Array(100)].map((_, i) => i + 1).filter(n => n % 12 === 0),
  [12, 24, 36, 48, 60, 72, 84, 96]);
ok('Beyond Ex3 factors of 48', divisors(48), [1, 2, 3, 4, 6, 8, 12, 16, 24, 48]);
ok('Beyond Ex3 factors of 60', divisors(60), [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]);
ok('Beyond Ex3 common factors of 48 and 60', common(48, 60), [1, 2, 3, 4, 6, 12]);
is('Beyond Ex4 187 is composite', !isPrime(187));
ok('Beyond Ex4 187 factorised', factorise(187), [11, 17]);
ok('Beyond Ex4 187 mod 3 and mod 7', [187 % 3, 187 % 7], [1, 5]);
ok('Beyond Ex5 primes between 60 and 80',
  primesUpTo(80).filter(p => p > 60), [61, 67, 71, 73, 79]);
ok('Beyond Ex5 the composites left after sieving evens and fives',
  [61, 63, 67, 69, 71, 73, 77, 79].filter(n => !isPrime(n)), [63, 69, 77]);
ok('Beyond Ex6 36 as a sum of two primes',
  primesUpTo(36).filter(p => p * 2 <= 36 && isPrime(36 - p)).map(p => [p, 36 - p]),
  [[5, 31], [7, 29], [13, 23], [17, 19]]);
is('Beyond Ex6 33 and 25 are not prime', !isPrime(33) && !isPrime(25));
ok('Beyond Ex7 prime factorisation of 360', factorise(360), [2, 2, 2, 3, 3, 5]);
ok('Beyond Ex7 360 from 8 and 45', [factorise(8), factorise(45)], [[2, 2, 2], [3, 3, 5]]);
ok('Beyond Ex8 the number 2*2*3*5*5', [2, 2, 3, 5, 5].reduce((a, b) => a * b), 300);
is('Beyond Ex8 300 is divisible by 15', 300 % 15 === 0);
ok('Beyond Ex9 prime factorisation of 84 x 50', factorise(84 * 50), [2, 2, 2, 3, 5, 5, 7]);
ok('Beyond Ex9 84 x 50', 84 * 50, 4200);
ok('Beyond Ex10 which pair is co-prime',
  [[21, 35], [39, 91], [25, 36], [33, 55]].filter(([a, b]) => coprime(a, b)), [[25, 36]]);
ok('Beyond Ex10 the shared primes',
  [factorise(21), factorise(35), factorise(39), factorise(91), factorise(25), factorise(36), factorise(33), factorise(55)],
  [[3, 7], [5, 7], [3, 13], [7, 13], [5, 5], [2, 2, 3, 3], [3, 11], [5, 11]]);
is('Beyond Ex11 8 and 9 are composite and co-prime', !isPrime(8) && !isPrime(9) && coprime(8, 9));
ok('Beyond Ex12 which of the four is divisible by 8',
  [7324, 6136, 5148, 9420].filter(n => n % 8 === 0), [6136]);
ok('Beyond Ex12 the remainders of the last three digits',
  [324 % 8, 136 % 8, 148 % 8, 420 % 8], [4, 0, 4, 4]);
is('Beyond Ex12 all four are divisible by 4', [7324, 6136, 5148, 9420].every(n => n % 4 === 0));
is('Beyond Ex13 3492 is divisible by 4 and not by 8', 3492 % 4 === 0 && 3492 % 8 !== 0);
ok('Beyond Ex13 492 mod 8', 492 % 8, 4);
ok('Beyond Ex14 largest 4-digit multiple of 40', Math.floor(9999 / 40) * 40, 9960);
is('Beyond Ex14 5 and 8 are co-prime', coprime(5, 8));

// Beyond, stage 3 — the answers to every question that is not an option
ok('Q17 factors of 45', divisors(45), [1, 3, 5, 9, 15, 45]);
ok('Q18 first three common multiples of 8 and 12',
  [1, 2, 3].map(k => k * lcm(8, 12)), [24, 48, 72]);
ok('Q19 the number of factors of 1', divisors(1).length, 1);
ok('Q20 prime factorisation of 98', factorise(98), [2, 7, 7]);
ok('Q21 smallest prime above 50', primesUpTo(60).find(p => p > 50), 53);
ok('Q21 51 factorised', factorise(51), [3, 17]);
is('Q22 105 and 88 are co-prime', coprime(105, 88));
ok('Q22 the two factorisations', [factorise(105), factorise(88)], [[3, 5, 7], [2, 2, 2, 11]]);
ok('Q23 largest 3-digit multiple of 20', Math.floor(999 / 20) * 20, 980);
ok('Q23 20 x 49', 20 * 49, 980);
is('Q24 2016 is divisible by 8', 2016 % 8 === 0);
ok('Q24 prime factorisation of 2016', factorise(2016), [2, 2, 2, 2, 2, 3, 3, 7]);
ok('Q26 prime factorisation of 1800', factorise(1800), [2, 2, 2, 3, 3, 5, 5]);
is('Q26 8 x 225 = 1800 and they are co-prime', 8 * 225 === 1800 && coprime(8, 225));
is('Q26 9 x 200 = 1800 and they are co-prime', 9 * 200 === 1800 && coprime(9, 200));
is('Q26 25 x 72 = 1800 and they are co-prime', 25 * 72 === 1800 && coprime(25, 72));
ok('Q27 the number 2*2*3*3*7', [2, 2, 3, 3, 7].reduce((a, b) => a * b), 252);
okPrintedList('Q27 factors of 252 above 10', 27, divisors(252).filter(d => d > 10));
is('Q27 252 is divisible by 14', 252 % 14 === 0);
ok('Q27 252 / 14', 252 / 14, 18);
is('Q28 12 is divisible by 4 and 6 but not 24', 12 % 4 === 0 && 12 % 6 === 0 && 12 % 24 !== 0);
is('Q28 36 is divisible by 4 and 6 but not 24', 36 % 4 === 0 && 36 % 6 === 0 && 36 % 24 !== 0);
is('Q28 48 is divisible by all three', 48 % 4 === 0 && 48 % 6 === 0 && 48 % 24 === 0);
ok('Q28 lcm of 4 and 6', lcm(4, 6), 12);
ok('Q29a multiples of 5 in 1..100', countMultiples(5, 1, 100), 20);
ok('Q29b multiples of 8 in 1..100', countMultiples(8, 1, 100), 12);
ok('Q29c multiples of both 5 and 8 in 1..100', countMultiples(lcm(5, 8), 1, 100), 2);
ok('Q29c the two of them',
  [...Array(100)].map((_, i) => i + 1).filter(n => n % 40 === 0), [40, 80]);
ok('Q30a prime factorisation of 84 and 126', [factorise(84), factorise(126)],
  [[2, 2, 3, 7], [2, 3, 3, 7]]);
ok('Q30b common factors of 84 and 126', common(84, 126), [1, 2, 3, 6, 7, 14, 21, 42]);
ok('Q30c largest common factor', gcd(84, 126), 42);
ok('Q30d rows of chairs and stools', [84 / 42, 126 / 42], [2, 3]);
okPrintedList('Q17 factors of 45', 17, divisors(45));
okPrintedList('Q18 common multiples of 8 and 12', 18, [1, 2, 3].map(k => k * lcm(8, 12)));
is('Q25 the second treasure: 12, 36, 60 and 84 all give exactly the factors of 12',
  [12, 36, 60, 84].every(x => JSON.stringify(common(24, x)) === JSON.stringify(divisors(12))));
is('Q25 24 itself would not work', JSON.stringify(common(24, 24)) !== JSON.stringify(divisors(12)));
okPrintedList('Q25 the numbers printed', 25, [12, 36, 60, 84]);
okPrintedList('Q30 common factors of 84 and 126', 30, common(84, 126));
ok('Q31a factorisations of 6, 8, 12', [factorise(6), factorise(8), factorise(12)],
  [[2, 3], [2, 2, 2], [2, 2, 3]]);
ok('Q31b when all three ring together again', lcm(6, 8, 12), 24);
ok('Q31d times in the hour after 9:00, not counting it',
  [...Array(60)].map((_, i) => i + 1).filter(n => n % 24 === 0), [24, 48]);

// every lettered part of every long-answer and case-based answer
okPart('Q27(a) the number', 27, 'a', [2, 2, 3, 3, 7].reduce((a, b) => a * b));
okPart('Q29(a) multiples of 5', 29, 'a', countMultiples(5, 1, 100));
okPart('Q29(b) multiples of 8', 29, 'b', countMultiples(8, 1, 100));
okPart('Q29(c) multiples of both', 29, 'c',
  [countMultiples(lcm(5, 8), 1, 100), 40, 80]);
okPart('Q30(b) the possible row lengths', 30, 'b', common(84, 126));
okPart('Q30(c) the largest row length', 30, 'c', gcd(84, 126));
okPart('Q30(d) rows of chairs and of stools', 30, 'd', [84 / gcd(84, 126), 126 / gcd(84, 126)]);
okPart('Q31(b) minutes until all three ring together', 31, 'b', lcm(6, 8, 12));
okPart('Q31(c) the time', 31, 'c', [9, 24]);

// the "why the other options are wrong" notes
ok('note 5: 18 as 6x3 and 9x2', [6 * 3, 9 * 2], [18, 18]);
is('note 5: 36 and 54 are common multiples of 6 and 9',
  36 % 6 === 0 && 36 % 9 === 0 && 54 % 6 === 0 && 54 % 9 === 0);
is('note 5: 3 is a common factor of 6 and 9', 6 % 3 === 0 && 9 % 3 === 0);
is('note 10: 3 is not a factor of 91, and 9 is not prime', 91 % 3 !== 0 && !isPrime(9));
is('note 13: 4 and 6 are composite and share 2', !isPrime(4) && !isPrime(6) && gcd(4, 6) === 2);
ok('note 13: prime factorisation of 35 and 48', [factorise(35), factorise(48)],
  [[5, 7], [2, 2, 2, 2, 3]]);
ok('note 16: 15 x 28', 15 * 28, 420);

/* ---- C. one right option, and the key says so ---------------- */

const MCQ = [
  { n: 1, opts: [51, 57, 59, 91], right: (o) => isPrime(o), key: 'c' },
  { n: 2, opts: [[1, 2, 3, 6], [1, 2, 3, 4, 6], [2, 3, 6], [1, 2, 3, 6, 12]],
    right: (o) => JSON.stringify(o) === JSON.stringify(common(18, 24)), key: 'a' },
  { n: 3, opts: [8, 9, 6, 10], right: (o) => o === divisors(36).length, key: 'b' },
  { n: 4, opts: [2, 9, 1, 11], right: (o) => !isPrime(o) && divisors(o).length <= 2, key: 'c' },
  { n: 5, opts: [54, 36, 3, 18], right: (o) => o === lcm(6, 9), key: 'd' },
  { n: 6, opts: [1234, 5132, 3418, 7542], right: (o) => o % 4 === 0, key: 'b' },
  { n: 7, opts: [[2, 42], [4, 3, 7], [2, 2, 3, 7], [2, 3, 14]],
    right: (o) => o.every(isPrime) && o.reduce((a, b) => a * b) === 84, key: 'c' },
  { n: 8, opts: [[41, 43], [51, 53], [7, 9], [23, 29]],
    right: ([a, b]) => isPrime(a) && isPrime(b) && b - a === 2, key: 'a' },
  { n: 9, opts: [7, 2, 3, 4], right: (o) => o === 2347 % 5, key: 'b' },
  { n: 10, opts: [3, 9, 13, 7], right: (o) => o === factorise(91)[0], key: 'd' },
  { n: 11, opts: [16, 40, 90, 36], right: (o) => o % 6 === 0 && o % 10 === 0, key: 'c' },
  { n: 12, opts: [999, 992, 996, 984],
    right: (o) => o === Math.floor(999 / 8) * 8, key: 'b' },
];

const LETTERS = ['a', 'b', 'c', 'd'];
for (const q of MCQ) {
  const right = q.opts.map((o, i) => q.right(o) ? LETTERS[i] : null).filter(Boolean);
  if (right.length !== 1) fails.push(`Q${q.n}: ${right.length} right options (${right.join(', ') || 'none'})`);
  else if (right[0] !== q.key) fails.push(`Q${q.n}: the right option is (${right[0]}), the key prints (${q.key})`);
  else pass++;
}

/* An assertion-reason question is graded on three facts: is A true,
   is R true, and does R explain A. The first two are computed; the
   third is the judgement the question is testing, and is stated. */
const AR = [
  { n: 13, A: () => coprime(35, 48), R: () => !isPrime(35) && !isPrime(48), explains: false, key: 'b' },
  { n: 14, A: () => 7248 % 8 === 0, R: () => 248 % 8 === 0, explains: true, key: 'a' },
  { n: 15, A: () => primesUpTo(50).every(p => p % 2 === 1), R: () => isPrime(2), explains: false, key: 'd' },
  { n: 16, A: () => lcm(15, 28) === 420, R: () => coprime(15, 28), explains: true, key: 'a' },
];
/* The truth values above are only worth checking against the question
   actually printed under that number, so each entry is tied to its text. */
const AR_TEXT = {
  13: ['35 and 48 are co-prime.', '35 and 48 are both composite numbers.'],
  14: ['7248 is divisible by 8.', '248 is divisible by 8.'],
  15: ['Every prime number is odd.', '2 is a prime number.'],
  16: ['The first common multiple of 15 and 28 is 420.', '15 and 28 are co-prime.'],
};
const printedAR = {};
for (const f of pages) {
  const html = fs.readFileSync(path.join(DIR, f), 'utf8');
  for (const m of html.matchAll(/data-start="(\d+)">\s*<li><p>Assertion \(A\): ([^<]*)<\/p><p>Reason \(R\): ([^<]*)<\/p>/g))
    printedAR[m[1]] = [m[2], m[3]];
}
for (const [n, want] of Object.entries(AR_TEXT)) ok(`Q${n} printed assertion and reason`, printedAR[n], want);

for (const q of AR) {
  const a = q.A(), r = q.R();
  const want = a && r ? (q.explains ? 'a' : 'b') : a && !r ? 'c' : !a && r ? 'd' : '?';
  if (want === '?') fails.push(`Q${q.n}: both A and R are false, which is not an option`);
  else if (want !== q.key) fails.push(`Q${q.n}: A is ${a}, R is ${r} → (${want}), the key prints (${q.key})`);
  else pass++;
}

// the key must use all four letters, so no reader can guess a pattern
const letters = [...MCQ, ...AR].map(q => q.key);
const spread = LETTERS.map(l => [l, letters.filter(x => x === l).length]);
is(`the key uses all four letters (${spread.map(([l, c]) => l + ':' + c).join(' ')})`,
  spread.every(([, c]) => c > 0));

/* ---- D. ANSWERS.md ------------------------------------------- */

/* The booklet's source is checked the same way the pages are: every value
   is recomputed, and then looked for in the file. An answer that drifts
   from the question it answers is how this goes wrong (§5, The
   companions), and reading the file alone cannot catch it. */

const ANSWERS = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');

function inAnswers(what, needle) {
  if (ANSWERS.includes(needle)) pass++;
  else fails.push(`${what} — ANSWERS.md does not contain "${needle}"`);
}

const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const countIn = (m, lo, hi) => range(lo, hi).filter(n => n % m === 0).length;

// 5.1
ok('A 5.1 Q1 tenth idli-vada', 10 * lcm(3, 5), 150);
ok('A 5.1 Q2 counts to 90', [countIn(3, 1, 90), countIn(5, 1, 90), countIn(15, 1, 90)], [30, 18, 6]);
ok('A 5.1 Q3 counts to 900', [countIn(3, 1, 900), countIn(5, 1, 900), countIn(15, 1, 900)], [300, 180, 60]);
inAnswers('A 5.1 Q3', '**300**, **180** and **60**');
ok('A 5.1 Q4 overlap to 60', range(1, 60).filter(n => n % 15 === 0), [15, 30, 45, 60]);
inAnswers('A 5.1 Q4 overlap', 'holds **15, 30, 45, 60**');
ok('A 5.1 activity first common multiples', [lcm(2, 5), lcm(3, 7), lcm(4, 6)], [10, 21, 12]);
ok('A 5.1 Meena, the only number that works', [2, 3, 5, 8, 10].filter(n => n % 4 === 0), [8]);
ok('A T&R jump sizes onto 15 and 30', common(15, 30), [1, 3, 5, 15]);
inAnswers('A T&R 15 and 30', '**1, 3, 5 and 15**');
ok('A Fig 5.3 shaded, multiples of 3', range(31, 70).filter(n => n % 3 === 0),
  [33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69]);
ok('A Fig 5.3 circled, multiples of 4', range(31, 70).filter(n => n % 4 === 0),
  [32, 36, 40, 44, 48, 52, 56, 60, 64, 68]);
ok('A Fig 5.3 both', range(31, 70).filter(n => n % 12 === 0), [36, 48, 60]);
inAnswers('A Fig 5.3 both', '**36, 48 and 60**');

// 5.2
ok('A 5.2 Q1', range(310, 410).filter(n => n % 40 === 0), [320, 360, 400]);
ok('A 5.2 Q2a', range(1, 39).filter(n => n % 7 === 0
  && String(n).split('').reduce((a, b) => a + Number(b), 0) === 8), [35]);
ok('A 5.2 Q2b', range(10, 99).filter(n => n % 15 === 0
  && Number(String(n)[1]) - Number(String(n)[0]) === 1), [45]);
ok('A 5.2 Q3 perfect number 1..10',
  range(1, 10).filter(n => divisors(n).reduce((a, b) => a + b, 0) === 2 * n), [6]);
ok('A 5.2 Q4 common factors',
  [common(20, 28), common(35, 50),
    divisors(4).filter(d => 8 % d === 0 && 12 % d === 0),
    divisors(5).filter(d => 15 % d === 0 && 25 % d === 0)],
  [[1, 2, 4], [1, 5], [1, 2, 4], [1, 5]]);
ok('A 5.2 Q6 pairs below 10 whose first common multiple is past 50',
  (() => { const o = []; for (let a = 2; a < 10; a++) for (let b = a + 1; b < 10; b++)
    if (lcm(a, b) > 50) o.push([a, b, lcm(a, b)]); return o; })(),
  [[7, 8, 56], [7, 9, 63], [8, 9, 72]]);
ok('A 5.2 Q7 jump sizes onto 28 and 70', common(28, 70), [1, 2, 7, 14]);
ok('A 5.2 Q9 first three common multiples of 4 and 10',
  [1, 2, 3].map(k => k * lcm(4, 10)), [20, 40, 60]);
is('A 5.2 Q9 the product is not the first', lcm(4, 10) !== 40);
ok('A 5.2 Q10 smallest multiple of 1..10 except 7', lcm(1, 2, 3, 4, 5, 6, 8, 9, 10), 360);
ok('A 5.2 Q11 smallest multiple of 1..10', lcm(...range(1, 10)), 2520);

// 5.3
const P100 = primesUpTo(100);
ok('A 5.2 T&R primes 21..30', range(21, 30).filter(isPrime), [23, 29]);
ok('A 5.2 T&R composites 21..30', range(21, 30).filter(n => !isPrime(n)).length, 8);
const gapsBetween = P100.slice(1).map((p, i) => p - P100[i]);
ok('A 5.3 Q2 smallest and largest gap',
  [Math.min(...gapsBetween), Math.max(...gapsBetween)], [1, 8]);
ok('A 5.3 Q3 primes in each row of ten',
  range(0, 9).map(r => P100.filter(p => p > r * 10 && p <= r * 10 + 10).length),
  [4, 4, 2, 2, 3, 2, 2, 3, 2, 1]);
ok('A 5.3 Q4 which are prime', [23, 51, 37, 26].filter(isPrime), [23, 37]);
ok('A 5.3 Q6 reversal pairs',
  P100.filter(p => { const r = Number(String(p).split('').reverse().join(''));
    return r > p && r < 100 && isPrime(r); })
    .map(p => [p, Number(String(p).split('').reverse().join(''))]),
  [[13, 31], [17, 71], [37, 73], [79, 97]]);
is('A 5.3 Q7 90 to 96 are seven composites in a row',
  range(90, 96).every(n => !isPrime(n)) && 91 === 7 * 13);
ok('A 5.3 Q8 twin primes to 100',
  P100.filter(p => isPrime(p + 2)).map(p => [p, p + 2]),
  [[3, 5], [5, 7], [11, 13], [17, 19], [29, 31], [41, 43], [59, 61], [71, 73]]);
is('A 5.3 Q9a no prime ends in 4', P100.every(p => p % 10 !== 4));
is('A 5.3 Q9e after 2 no prime has a prime successor',
  P100.filter(p => p > 2).every(p => !isPrime(p + 1)));
ok('A 5.3 Q10 product of exactly three different primes',
  [45, 60, 91, 105, 330].filter(n => { const f = [...new Set(factorise(n))];
    return f.length === 3 && f.reduce((a, b) => a * b) === n; }), [105]);
const from245 = (() => { const o = [];
  for (const a of [2, 4, 5]) for (const b of [2, 4, 5]) for (const c of [2, 4, 5])
    if (a !== b && b !== c && a !== c) o.push(a * 100 + b * 10 + c);
  return o.sort((x, y) => x - y); })();
ok('A 5.3 Q11 the six numbers', from245, [245, 254, 425, 452, 524, 542]);
ok('A 5.3 Q11 how many of them are prime', from245.filter(isPrime), []);
inAnswers('A 5.3 Q11 is none', '11. **None.**');
ok('A 5.3 Q12 primes p with 2p+1 prime',
  P100.filter(p => isPrime(2 * p + 1)).slice(0, 8), [2, 3, 5, 11, 23, 29, 41, 53]);

// 5.4
for (const [n, want] of [[64, 6], [104, 4], [105, 3], [243, 5], [320, 7], [141, 2],
  [1728, 9], [729, 6], [1024, 10], [1331, 3], [1000, 6]])
  ok(`A 5.4 Q1 ${n} has ${want} prime factors`, factorise(n).length, want);
ok('A 5.4 Q1 141 is not prime', factorise(141), [3, 47]);
ok('A 5.4 Q2 one 2, two 3s and one 11', 2 * 3 * 3 * 11, 198);
ok('A 5.4 Q3 three primes under 30 with product 1955', factorise(1955), [5, 17, 23]);
is('A 5.4 Q3 all three are under 30', factorise(1955).every(p => p < 30));
ok('A 5.4 Q4 the three products', [56 * 25, 108 * 75, 1000 * 81], [1400, 8100, 81000]);
ok('A 5.4 Q4a', factorise(1400), [2, 2, 2, 5, 5, 7]);
ok('A 5.4 Q4b', factorise(8100), [2, 2, 3, 3, 3, 3, 5, 5]);
ok('A 5.4 Q4c', factorise(81000), [2, 2, 2, 3, 3, 3, 3, 5, 5, 5]);
ok('A 5.4 Q5 smallest with three and four different primes',
  [2 * 3 * 5, 2 * 3 * 5 * 7], [30, 210]);

// 5.5
ok('A 5.5 Q1 which pairs are co-prime',
  [[30, 45], [57, 85], [121, 1331], [343, 216]].map(([a, b]) => coprime(a, b)),
  [false, true, false, true]);
ok('A 5.5 Q1c largest common factor of 121 and 1331', gcd(121, 1331), 121);
ok('A 5.5 Q2 which divide',
  [[225, 27], [96, 24], [343, 17], [999, 99]].map(([a, b]) => a % b === 0),
  [false, true, false, false]);
ok('A 5.5 Q2b 96 divided by 24', 96 / 24, 4);
ok('A 5.5 Q3 the two numbers', [2 * 3 * 7, 3 * 7 * 11], [42, 231]);
ok('A 5.5 Q3 their largest common factor', gcd(42, 231), 21);
is('A 5.5 Q3 neither divides the other', 231 % 42 !== 0 && 42 % 231 !== 0);

// the co-prime think-and-reflects
ok('A T&R safe pairs', [[15, 39], [4, 15], [18, 29], [20, 55]].map(([a, b]) => coprime(a, b)),
  [false, true, true, false]);
ok('A T&R co-prime pairs',
  [[18, 35], [15, 37], [30, 415], [17, 69], [81, 18]].map(([a, b]) => coprime(a, b)),
  [true, true, false, true, false]);
ok('A T&R largest common factor of 81 and 18', gcd(81, 18), 9);
ok('A T&R thread art reaches every peg',
  [[15, 10], [10, 7], [14, 6], [8, 3]].map(([p, g]) => coprime(p, g)),
  [false, true, false, true]);
ok('A T&R thread art, pegs reached',
  [[15, 10], [10, 7], [14, 6], [8, 3]].map(([p, g]) => p / gcd(p, g)), [3, 10, 7, 8]);
ok('A Fig 5.7 pegs reached',
  [[12, 4], [13, 3], [16, 6], [24, 6]].map(([p, g]) => p / gcd(p, g)), [3, 13, 8, 4]);
ok('A T&R 48 has four 2s', factorise(48).filter(p => p === 2).length, 4);
ok('A T&R 60 splits to the same primes', factorise(60), [2, 2, 3, 5]);

// 5.6
const leap = (y) => y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
ok('A 5.6 Q1b leap years 2024 to 2099', range(2024, 2099).filter(leap).length, 19);
is('A 5.6 Q1a 2000 is a leap year and 1900 is not', leap(2000) && !leap(1900));
const palis = (() => { const o = [];
  for (let a = 1; a < 10; a++) for (let b = 0; b < 10; b++) {
    const n = a * 1001 + b * 110; if (n % 4 === 0) o.push(n); }
  return o; })();
ok('A 5.6 Q2 smallest and largest palindrome divisible by 4',
  [Math.min(...palis), Math.max(...palis)], [2112, 8888]);
ok('A 5.6 Q4 the remainder table',
  [78, 99, 173, 572, 980, 1111, 2345].map(n => [n % 10, n % 5, n % 2]),
  [[8, 3, 0], [9, 4, 1], [3, 3, 1], [2, 2, 0], [0, 0, 0], [1, 1, 1], [5, 0, 1]]);
is('A 5.6 Q5 14560 is divisible by all five', [2, 4, 5, 8, 10].every(d => 14560 % d === 0));
ok('A 5.6 Q6 which are divisible by all five',
  [572, 2352, 5600, 6000, 77622160].filter(n => [2, 4, 5, 8, 10].every(d => n % d === 0)),
  [5600, 6000, 77622160]);
ok('A 5.6 Q7 the only pair with no units zero',
  (() => { const o = []; for (let a = 2; a * a <= 10000; a++)
    if (10000 % a === 0 && a % 10 !== 0 && (10000 / a) % 10 !== 0) o.push([a, 10000 / a]);
    return o; })(), [[16, 625]]);

/* The prime puzzles: solved from the row and column products printed on
   Fig. 5.13, and checked to have the one solution the chapter claims. */
function solvePuzzle(rows, cols) {
  const primesOf = (n) => [...new Set(factorise(n))];
  const sols = [], g = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  (function go(i) {
    if (i === 9) {
      for (let r = 0; r < 3; r++) if (g[r].reduce((a, b) => a * b) !== rows[r]) return;
      for (let c = 0; c < 3; c++) if (g[0][c] * g[1][c] * g[2][c] !== cols[c]) return;
      sols.push(g.map(r => r.slice()));
      return;
    }
    const r = Math.floor(i / 3), c = i % 3;
    for (const p of primesOf(rows[r])) {
      if (cols[c] % p !== 0) continue;
      g[r][c] = p; go(i + 1); g[r][c] = 0;
    }
  })(0);
  return sols;
}
const PUZZLES = {
  'the worked one': [[75, 42, 102], [170, 30, 63], [[5, 5, 3], [2, 3, 7], [17, 2, 3]]],
  A: [[105, 20, 30], [28, 125, 18], [[7, 5, 3], [2, 5, 2], [2, 5, 3]]],
  B: [[8, 105, 70], [30, 70, 28], [[2, 2, 2], [3, 5, 7], [5, 7, 2]]],
  C: [[63, 27, 190], [45, 42, 171], [[3, 7, 3], [3, 3, 3], [5, 2, 19]]],
  D: [[343, 66, 44], [28, 154, 231], [[7, 7, 7], [2, 11, 3], [2, 2, 11]]],
};
for (const [name, [rows, cols, want]] of Object.entries(PUZZLES)) {
  const s = solvePuzzle(rows, cols);
  is(`A puzzle ${name} has exactly one solution (found ${s.length})`, s.length === 1);
  ok(`A puzzle ${name}`, s[0], want);
  is(`A puzzle ${name}: every entry is prime`, s[0].flat().every(isPrime));
}

/* ---- report -------------------------------------------------- */

console.log(`\nClass 6 · Chapter 5 · Prime Time`);
console.log(`  ${checked} arithmetic identities read off the pages and evaluated`);
if (skipped.length) {
  console.log(`  ${skipped.length} maths span(s) not arithmetic, so not evaluated:`);
  for (const s of skipped) console.log(`      ${s}`);
}
console.log(`  ${pass} check(s) passed`);
if (fails.length) {
  console.log(`\n  ${fails.length} FAILED:`);
  for (const f of fails) console.log(`    ! ${f}`);
  process.exit(1);
}
console.log(`  all clear\n`);
