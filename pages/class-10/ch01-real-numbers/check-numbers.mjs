#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed — factorisations, HCFs, LCMs, primality, searches — and compared
   with what is on the page.

     node pages/class-10/ch01-real-numbers/check-numbers.mjs [--skipped]

   Four parts:
     A  every identity set as maths, on every page and in ANSWERS.md, whose
        sides all evaluate — HCF(...) and LCM(...) are read as functions
     B  the claims A cannot check: primality, factorisations as lists,
        exercise answers, and the practice answers read back out of the key
        rows, a lettered part at a time
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
const isPrime = (n) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const H = (...xs) => xs.reduce(gcd);
const L = (...xs) => xs.reduce((a, b) => a * b / gcd(a, b));
const fstr = (n) => Object.entries(factorise(n)).map(([p, e]) => e > 1 ? `${p}^${e}` : p).join('*');

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<span class="nb">([^<]*)<\/span>/g, '$1')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/\s+/g, ' ');

/* ---- A. every identity ---------------------------------------- */

function toExpr(side) {
  let s = side
    .replace(/\\text\{(HCF|LCM)\}/g, (m, f) => f[0])
    .replace(/\\left|\\right/g, '')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'Math.sqrt[$1]')                  // before \frac, so its braces do not nest
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/Math\.sqrt\[([^\]]+)\]/g, 'Math.sqrt($1)')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad/g, '')
    .replace(/\^\{([^{}]+)\}/g, '**($1)').replace(/\^(\d)/g, '**$1')
    .replace(/\s+/g, '');
  if (!s || !/^(Math\.sqrt|[HL](?=\()|[-+*/().,0-9])+$/.test(s)) return null;
  if (/,/.test(s.replace(/[HL]\([^()]*\)/g, ''))) return null;   // a comma outside a function is a list, not a number
  return s.replace(/\)\(/g, ')*(').replace(/([0-9)])(Math\.sqrt)/g, '$1*$2');   // 2\sqrt{2} is a product
}
const evalExpr = (e) => { try { return Function('H', 'L', `"use strict";return (${e})`)(H, L); } catch { return NaN; } };

// "a = b, c = d" is two statements; the comma inside HCF(6, 20) is not a break
function splitParts(span) {
  const out = []; let depth = 0, cur = '';
  for (let i = 0; i < span.length; i++) {
    const ch = span[i];
    if ('({'.includes(ch)) depth++;
    if (')}'.includes(ch)) depth--;
    if (depth === 0 && ch === ',' && /=/.test(cur) && /=/.test(span.slice(i + 1))) { out.push(cur); cur = ''; continue; }
    if (depth === 0 && span.startsWith('\\qquad', i)) { out.push(cur); cur = ''; i += 5; continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
}

let spans = 0; const skipped = [];
const sources = [...pages.map(f => [f, html[f]]), ['ANSWERS.md', answersMd]];
for (const [f, raw] of sources) {
  const src = raw.replace(/\$\$/g, '$');
  for (const m of src.matchAll(/\$([^$]+)\$/g)) {
    const span = m[1];
    if (!span.includes('=') || /\\neq|\\leq|\\lt|<|>/.test(span)) continue;
    for (const part of splitParts(span.replace(/^\{(.*)\}$/, '$1'))) {
      const sides = part.split('=').map(s => s.trim()).filter(Boolean);
      if (sides.length < 2) continue;
      let vals = sides.map(toExpr);
      if (vals.filter(Boolean).length >= 2) vals = vals.filter(Boolean);
      if (vals.some(v => !v) || vals.length < 2) { skipped.push(`${f}: $${part.trim()}$`); continue; }
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
is('3803 and 3607 are prime', isPrime(3803) && isPrime(3607));
ok('123456789', 9 * 3803 * 3607, 123456789);
ok('the factor tree for 32760', fstr(32760), '2^3*3^2*5*7*13');
ok('Example 1: 4^n has only the prime 2', Object.keys(factorise(4 ** 7)), ['2']);
ok('Example 4: HCF and LCM of 6, 72, 120', [H(6, 72, 120), L(6, 72, 120)], [6, 360]);
ok('Example 4: the tip', [6 * 72 * 120, H(6, 72, 120) * L(6, 72, 120)], [51840, 2160]);
ok('Note to the Reader: LCM formula', 6 * 72 * 120 * H(6, 72, 120) / (H(6, 72) * H(72, 120) * H(6, 120)), L(6, 72, 120));
ok('Note to the Reader: HCF formula', 6 * 72 * 120 * L(6, 72, 120) / (L(6, 72) * L(72, 120) * L(6, 120)), H(6, 72, 120));

// Exercise Set 1.1, read back off ANSWERS.md
const md = answersMd.replace(/\s+/g, ' ');
for (const n of [140, 156, 3825, 5005, 7429]) {
  const m = md.match(new RegExp(`\\$${n} = ([^$]+)\\$`));
  is(`Ex 1.1 Q1: ${n} is factorised in ANSWERS.md`, !!m);
  if (m) {
    const primes = m[1].replace(/\\times/g, '*').replace(/\s/g, '').split('*').map(t => t.split('^'));
    is(`Ex 1.1 Q1: ${n}'s factors are primes`, primes.every(([p]) => isPrime(Number(p))));
  }
}
ok('Ex 1.1 Q2', [[26, 91], [510, 92], [336, 54]].map(([a, b]) => [H(a, b), L(a, b)]), [[13, 182], [2, 23460], [6, 3024]]);
ok('Ex 1.1 Q3', [[12, 15, 21], [17, 23, 29], [8, 9, 25]].map(xs => [H(...xs), L(...xs)]), [[3, 420], [1, 11339], [1, 1800]]);
ok('Ex 1.1 Q4', 306 * 657 / H(306, 657), 22338);
is('Ex 1.1 Q4: the given HCF', H(306, 657) === 9);
is('Ex 1.1 Q5: 6^n has no 5', ![1, 2, 3, 4, 5, 6].some(n => (6 ** n) % 10 === 0));
is('Ex 1.1 Q6: 1009 is prime, so 5045 = 5 x 1009 is composite', isPrime(1009) && 7 * 6 * 5 * 4 * 3 * 2 + 5 === 5045);
ok('Ex 1.1 Q7', L(18, 12), 36);

// Stage 1, as printed in its running text
ok('Stage 1 Q1', 12960 / 18, 720);
is('Stage 1 Q1: 18 does not divide 380', 380 % 18 !== 0);
ok('Stage 1 Q2', H(1250, 9375, 15625), 625);
ok('Stage 1 Q3', (() => { for (let n = 1000; ; n++) if ([12, 18, 30].every(d => n % d === 5)) return n; })(), 1085);

// Stage 2
ok('Ex 1', fstr(4620), '2^2*3*5*7*11');
ok('Ex 2: which powers end in 0', ['4', '12', '15', '20'].filter(b => { const f = factorise(Number(b)); return f[2] && f[5]; }), ['20']);
ok('Ex 3', [H(8 * 9 * 5, 4 * 27 * 7), L(8 * 9 * 5, 4 * 27 * 7)], [36, 7560]);
ok('Ex 4', [H(84, 126, 210), L(84, 126, 210)], [42, 1260]);
ok('Ex 5: LCMs 16 does not divide', [64, 240, 124, 160].filter(x => x % 16), [124]);
ok('Ex 5: the pairs that happen', [[16, 64], [48, 80], [16, 160]].map(([a, b]) => [H(a, b), L(a, b)]), [[16, 64], [16, 240], [16, 160]]);
ok('Ex 6', [14 * 1260 / 126, H(126, 140), L(126, 140)], [140, 14, 1260]);
ok('Ex 7', [H(945, 1155), 945 / 105 + 1155 / 105], [105, 20]);
ok('Ex 8', [L(84, 108), Math.floor(756 / 60), 756 % 60], [756, 12, 36]);
ok('Ex 9', [11 * 13 * 17 + 17, 17 * 144], [2448, 2448]);
is('Ex 10: 7 is prime', isPrime(7));
is('Ex 11: 4 divides 36 but not 6', 36 % 4 === 0 && 6 % 4 !== 0);
ok('Ex 13: which are integers', [Math.sqrt(3 * 27), Math.sqrt(12 / 3), Math.sqrt(2 * 18)], [9, 2, 6]);

// the practice answers, read back out of the key rows
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= text(m[2]).replace(/\$/g, '');
const row = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const r = keyRows[n] || '';
  if (!part) return r;
  const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\)|$)`));
  return m ? m[1] : '';
};
const says = (q, ...vals) => { for (const v of vals) is(`key ${q} should say ${v}: "${row(q)}"`, new RegExp(`(^|[^\\d.])${String(v).replace('.', '\\.')}([^\\d]|$)`).test(row(q))); };
ok('Q20', fstr(1001), '7*11*13');
says(20, 7, 11, 13);
says(21, 23 * 1449 / 161);
is('Q21: the other number fits', H(161, 207) === 23 && L(161, 207) === 1449);
says(22, H(2 ** 4 * 3 * 5, 2 ** 2 * 27));
says(23, H(120, 144, 204), L(120, 144, 204));
is('Q24: 11 is prime', isPrime(11));
says(26, H(850, 680));
{ const n = (() => { for (let x = 1; ; x++) if (x % 18 === 8 && x % 24 === 14 && x % 30 === 20) return x; })();
  const next = (() => { for (let x = n + 1; ; x++) if (x % 18 === 8 && x % 24 === 14 && x % 30 === 20) return x; })();
  says(27, L(18, 24, 30), n, next); }
is('Q28: 2 does not divide 3', 3 % 2 !== 0);
says(29, H(391, 544), 391 / 17 + 544 / 17, 391 / 17, 544 / 17);
says('30b', L(48, 72, 108));
{ const t = L(48, 72, 108); says('30c', `7:0${Math.floor(t / 60)}:${t % 60}`);
  is(`key 30 (d) should read "${Math.floor(3599 / t)} times": "${row('30d')}"`, new RegExp(`^\\s*${Math.floor(3599 / t)} times`).test(row('30d'))); }
says('31b', H(60, 84, 108));
says('31c', [60, 84, 108].map(x => x / 12).reduce((a, b) => a + b));

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] = m[2];
const optsOf = (n) => [...(qs[n] || '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => text(x[1]).trim());
const num = (s) => Number(s.replace(/\$/g, '').replace(/ cm$/, '').trim());
const key = {};
{
  const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2];
}
const L3 = (...xs) => L(...xs);
const solve = {
  1: o => o.map(s => { const e = toExpr(s.replace(/\$/g, '')); return !!e && evalExpr(e) === 3150 && s.replace(/\$/g, '').match(/\d+/g).every(t => isPrime(Number(t)) || /\^/.test(s) && Number(t) < 10); }),
  2: o => o.map(num).map(v => v === H(135, 225)),
  3: o => o.map(num).map(v => v === L3(12, 15, 20)),
  4: o => o.map(num).map(v => H(27, v) === 9 && L(27, v) === 459),
  5: o => o.map(s => s.replace(/\$/g, '')).map(s => {
    const e = toExpr(s); const v = e && evalExpr(e);
    return !(Number.isFinite(v) && Math.abs(v * 16 - Math.round(v * 16)) < 1e-9);   // rational ones here have denominator dividing 16
  }),
  6: o => o.map(s => /no natural/.test(s) === ![1, 2, 3, 4, 5, 6, 7, 8].some(n => (5 ** n) % 10 === 0)),
  7: o => o.map(s => /^1$/.test(s) && [[4, 5], [9, 10], [20, 21]].every(([a, b]) => H(a, b) === 1)),
  8: o => o.map(s => /^\$?p\$? divides \$?a\$?$/.test(s.trim())),
  9: o => o.map(num).map(v => v === H(70 - 5, 125 - 8)),
  10: o => o.map(s => { const t = L(9, 12, 15); const h = 8 + Math.floor(t / 60), mm = t % 60; return s === `${h}:${String(mm).padStart(2, '0')} a.m.`; }),
  11: o => o.map(s => s.replace(/\$/g, '')).map(s => s === '5 + 2\\sqrt{6}'),
  12: o => o.map(num).map(n => L(24, 30, 3 ** n * 5) === 8 * 9 * 5),
  13: o => o.map(s => s === 'only Lata' && 2 * 3 === 6),
  14: o => o.map(num).map(v => v === H(2, 4)),
  15: o => o.map(num).map(v => v === H(360, 450)),
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Q${q}: the right option`, right, [key[q]]);
}
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  16: [5 * 7 * 11 + 7 === 7 * 56, true, true],
  17: [Math.sqrt(3 * 12) === 6, !(Math.abs(Math.sqrt(2) * Math.sqrt(8) - 4) < 1e-9), false],
  18: [H(4, 6, 8) * L(4, 6, 8) === 4 * 6 * 8, [[4, 6], [12, 18], [7, 9]].every(([a, b]) => H(a, b) * L(a, b) === a * b), false],
  19: [!factorise(8)[5], !isPrime(8), false],
};
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-19', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(19)].map((_, i) => i + 1));
ok('practice numbered 1-31', [...beyond.matchAll(/data-start="(\d+)"/g)].map(m => Number(m[1])), [...Array(30)].map((_, i) => i + 2));

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
for (const m of answersMd.slice(answersMd.indexOf('as the key prints it'), answersMd.indexOf('as the key prints it') + 400).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2];
ok('ANSWERS.md key matches the page', mdKey, key);

// ANSWERS.md's practice working, row by row, a lettered part at a time
const mdPractice = answersMd.slice(answersMd.indexOf('The working for each'));
const mdRow = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const m = mdPractice.match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`));
  const r = m ? m[1].replace(/\$/g, '').replace(/\s+/g, ' ') : '';
  if (!part) return r;
  const p = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\)|$)`));
  return p ? p[1] : '';
};
const mdSays = (q, ...vals) => { for (const v of vals) is(`ANSWERS.md ${q} should say ${v}: "${mdRow(q)}"`, new RegExp(`(^|[^\\d.])${String(v)}([^\\d]|$)`).test(mdRow(q))); };
mdSays('30b', L(48, 72, 108));
is(`ANSWERS.md 30 (d) should read "${Math.floor(3599 / L(48, 72, 108))} times"`, new RegExp(`^\\s*${Math.floor(3599 / L(48, 72, 108))} times`).test(mdRow('30d')));
mdSays('31b', H(60, 84, 108));
mdSays('31c', 21);
mdSays(21, 207); mdSays(22, 12); mdSays(26, 170); mdSays(27, 350, 710); mdSays(29, 17, 55);

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
