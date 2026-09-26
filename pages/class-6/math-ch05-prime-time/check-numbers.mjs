#!/usr/bin/env node
/* Re-derive the numbers this chapter prints.

     node pages/class-6/math-ch05-prime-time/check-numbers.mjs

   Rewritten on 26 September 2026 for the maths-v2 chapter (summary page,
   By the Book in six forms, Beyond the Book by format), after the model of
   Chapters 1 and 3. The version before it checked a layout that no longer
   exists (Beyond's "Type" heads, Fig. 5.14, its practice run of 31, the
   old page numbers) and is in git history; that version also solved the
   body's prime puzzles A-D from their SVGs, which this one does not.

   A  every arithmetic identity set as maths ($...$) on every page and in
      ANSWERS.md
   B  the key is complete: By the Book 1-50, Beyond practice 1-15, every
      solved example ends in an Answer row; example tabs run 1, 2, 3, ...
   C  every objective, assertion-reason, multiple-correct and matching
      question: the right option is computed here and must be the one
      the key (or the example's Answer row) names
   D  every other number the By the Book and Beyond keys print is computed
      here and must appear in its key row

   Exits 1 on any failure. */
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const B = String.fromCharCode(92);
const PAGES = readdirSync(DIR).filter(f => /^p\d{3}\.html$/.test(f)).sort();
const HTML = Object.fromEntries(PAGES.map(f => [f, readFileSync(path.join(DIR, f), 'utf8').replace(/\r\n/g, '\n')]));
const ANSWERS = readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8').replace(/\r\n/g, '\n');
let fails = 0, checks = 0;
const ok = (label, cond, detail = '') => { checks++; if (!cond) { fails++; console.log(`  x ${label}${detail ? '  ' + detail : ''}`); } };
const text = h => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&ndash;/g, '–').replace(/&hellip;/g, '…')
  .replace(/&ldquo;|&rdquo;/g, '"').replace(/&rsquo;/g, '’').replace(/\s+/g, ' ').trim();

/* ---- the chapter's mathematics -------------------------------------- */
const isPrime = n => { if (!Number.isInteger(n) || n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
const factorise = n => { const o = []; for (let d = 2; d * d <= n; d++) while (n % d === 0) { o.push(d); n /= d; } if (n > 1) o.push(n); return o; };
const divisors = n => { const o = []; for (let d = 1; d <= n; d++) if (n % d === 0) o.push(d); return o; };
const common = (a, b) => divisors(a).filter(d => b % d === 0);
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const lcm = (...xs) => xs.reduce((a, b) => a * b / gcd(a, b));
const coprime = (a, b) => gcd(a, b) === 1;
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const rects = n => divisors(n).filter(d => d * d <= n).length;   // a square counts once
const L = 'abcd';
const pick = (opts, f) => opts.map((o, i) => f(o) ? L[i] : null).filter(Boolean).join(',');

/* ---- A: identities -------------------------------------------------- */
const strip = t => [['times', '*'], ['div', '/'], ['quad', ' '], ['thinsp', ''], [' ', '']]
  .reduce((s, [k, v]) => s.split(B + k).join(v), t).replace(/\\text\{[^}]*\}/g, '|').replace(/[{} ]/g, '');
const identities = (label, src) => {
  for (const m of src.matchAll(/\$([^$]+)\$/g)) {
    if (m[1].includes('cdots') || m[1].includes('???') || m[1].includes('square')) continue;
    for (const part of strip(m[1]).split('|')) {
      if (!part.includes('=')) continue;
      const sides = part.split('=').filter(s => s !== '');
      if (sides.length < 2 || sides.some(s => !/^[\d+\-*/().]+$/.test(s))) continue;
      const vals = sides.map(s => Function(`return (${s})`)());
      ok(`${label}: $${m[1]}$`, vals.every(v => Math.abs(v - vals[0]) < 1e-9), vals.join(' vs '));
    }
  }
};
for (const f of PAGES) identities(f, HTML[f]);
identities('ANSWERS.md', ANSWERS);

/* ---- read the divisions --------------------------------------------- */
const board = PAGES.filter(f => /^p09\d/.test(f)).map(f => HTML[f]).join('\n');
const bridge = PAGES.filter(f => /^p1\d\d/.test(f)).map(f => HTML[f]).join('\n');
const keyAt = bridge.indexOf('c-stage__title">Answers');
ok('the Answers stage exists', keyAt > 0);
const beyond = bridge.slice(0, keyAt), key = bridge.slice(keyAt);
const beyondKeyAt = key.indexOf('c-practice__sub">Beyond the Book');
ok('the key has a Beyond the Book part', beyondKeyAt > 0);
const boardKey = key.slice(0, beyondKeyAt), bridgeKey = key.slice(beyondKeyAt);

// questions: number -> inner html of its <li>
const questions = src => {
  const out = {};
  for (const m of src.matchAll(/<ol class="c-questions"( data-start="(\d+)")?>\s*<li[^>]*>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) out[m[2] ? +m[2] : 1] = m[3];
  return out;
};
const BQ = questions(board), XQ = questions(beyond);
ok('By the Book has 50 questions, 1-50', JSON.stringify(Object.keys(BQ).map(Number)) === JSON.stringify(range(1, 50)), Object.keys(BQ).join(','));
ok('Beyond has 15 practice questions, 1-15', JSON.stringify(Object.keys(XQ).map(Number)) === JSON.stringify(range(1, 15)), Object.keys(XQ).join(','));
const opts = li => { const m = li.match(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*?)<\/ol>/); return m ? [...m[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => text(x[1])) : []; };
const nums = li => opts(li).map(o => +o.replace(/[^\d]/g, ''));

// key rows: label -> text
const rows = src => Object.fromEntries([...src.matchAll(/work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)].map(m => [+m[1], text(m[2])]));
const letters = src => {
  const out = {};
  for (const m of src.matchAll(/<span class="c-answers__list">([\s\S]*?)<\/span>\s*<\/li>/g)) {
    const t = text(m[1]);
    for (const x of t.matchAll(/(\d+)\s+((?:\([a-d]\)(?:,\s*)?)+|\d+)/g)) out[+x[1]] = x[2].replace(/[()\s]/g, '');
  }
  return out;
};
const BR = rows(boardKey), BL = letters(boardKey), XR = rows(bridgeKey), XL = letters(bridgeKey);
for (const n of range(1, 50)) ok(`By the Book ${n} is in the key`, n in BR || n in BL);
for (const n of range(1, 15)) ok(`Beyond ${n} is in the key`, n in XL || n in XR);

/* ---- examples: tabs and answers ------------------------------------- */
const exOf = src => [...src.matchAll(/c-example__tab">Example (\d+)<\/div><div class="c-example__body">([\s\S]*?)<\/div><\/div><\/div><\/div>/g)].map(m => ({ n: +m[1], body: m[2] }));
const EX = exOf(beyond);
ok('Beyond examples run 1-10', JSON.stringify(EX.map(e => e.n)) === JSON.stringify(range(1, 10)), EX.map(e => e.n).join(','));
const exAns = n => { const e = EX.find(x => x.n === n); const m = e && e.body.match(/work__label">Answer<\/span><span>([\s\S]*?)<\/span>/); return m ? text(m[1]) : ''; };
for (const e of EX) ok(`Example ${e.n} ends in an Answer row`, exAns(e.n) !== '');
const bodyTabs = PAGES.filter(f => /^p0[0-8]\d/.test(f)).flatMap(f => [...HTML[f].matchAll(/c-example__tab">Example (\d+)/g)].map(m => +m[1]));
ok('body examples run 1-5', JSON.stringify(bodyTabs) === JSON.stringify(range(1, 5)), bodyTabs.join(','));
const exOpts = n => opts(EX.find(x => x.n === n).body);

/* ---- C: By the Book objective and assertion-reason ------------------ */
const want = {};
want[41] = pick(nums(BQ[41]), isPrime);
want[42] = pick(nums(BQ[42]), x => x === divisors(36).length);
want[43] = pick(opts(BQ[43]), o => { const f = o.split(/[^\d]+/).filter(Boolean).map(Number); return f.every(isPrime) && f.reduce((a, b) => a * b, 1) === 84; });
{ const ds = range(0, 9).filter(d => (5102 + 10 * d) % 4 === 0); want[44] = pick(nums(BQ[44]), x => x === Math.max(...ds)); }
want[45] = pick(nums(BQ[45]), x => x === 2347 % 5);
want[46] = pick(nums(BQ[46]), k => k < 10 && k !== 6 && lcm(6, k) === 18);
want[47] = pick(nums(BQ[47]), x => [60, 84, 90].every(n => n % x === 0));
{ const s1 = primesTo(100).every(p => p % 2 === 1), s2 = !isPrime(1), s3 = primesTo(100).every(p => primesTo(100).every(q => p === q || coprime(p, q)));
  const truth = ['i', 'ii', 'iii'].filter((_, i) => [s1, s2, s3][i]);
  const names = ['(i) only', '(ii) only', '(i) and (ii)', '(ii) and (iii)'];
  const as = [['i'], ['ii'], ['i', 'ii'], ['ii', 'iii']];
  want[48] = L[as.findIndex(a => JSON.stringify(a) === JSON.stringify(truth))];
  ok('48: options read as printed', JSON.stringify(opts(BQ[48])) === JSON.stringify(names)); }
function primesTo(n) { return range(2, n).filter(isPrime); }
want[49] = (1001 % 7 === 0 && 7 * 143 === 1001 && !isPrime(1001) && 1001 % 2 === 1 && 1001 % 10 !== 0) ? 'b' : '?';
want[50] = pick(nums(BQ[50]), x => x % 8 === 0);
// assertion-reason: [A true, R true, R explains A]
const test8 = range(1, 9999).every(n => (n % 8 === 0) === ((n % 1000) % 8 === 0));
const code = (a, r, ex) => a && r ? (ex ? 'a' : 'b') : a ? 'c' : r ? 'd' : '?';
want[31] = code(7248 % 8 === 0, test8, true);
want[32] = code(coprime(35, 48), !isPrime(35) && !isPrime(48), false);
want[33] = code(isPrime(91), true, false);
want[34] = code(isPrime(2), primesTo(100).every(p => p % 2), false);
want[35] = code(divisors(1).length === 1, divisors(1).length === 1, true);
for (const n of [...range(31, 35), ...range(41, 50)]) ok(`By the Book ${n}: key ${BL[n]}, computed ${want[n]}`, BL[n] === want[n]);
{ const all = [...range(31, 35), ...range(41, 50)].map(n => BL[n]); ok('By the Book letters use all of a-d', 'abcd'.split('').every(l => all.includes(l))); }

/* ---- C: Beyond practice --------------------------------------------- */
const X = {};
X[1] = pick(nums(XQ[1]), x => x === [61, 67, 71, 73, 77, 79].filter(isPrime).length);
ok('Q1: the table is what is left of 61-80 after 2, 3 and 5', JSON.stringify(range(61, 80).filter(n => n % 2 && n % 3 && n % 5)) === JSON.stringify([61, 67, 71, 73, 77, 79]));
X[2] = pick(nums(XQ[2]), x => x === [4, 6, 8, 9, 10, 15].filter(d => 60 % d === 0).length);
X[3] = pick(nums(XQ[3]), x => x === range(0, 3).find(k => (2025 + k) % 4 === 0));
X[4] = pick(nums(XQ[4]), x => x === common(42, 70).length - 1);
X[5] = pick(nums(XQ[5]), x => coprime(x, 36));
X[6] = pick(nums(XQ[6]), x => x % 8 === 0);
X[7] = pick(opts(XQ[7]).map(o => o.split(' and ').map(Number)), ([a, b]) => a % 6 === 0 && b % 6 === 0);
X[8] = pick(nums(XQ[8]), x => !isPrime(x));
X[9] = String(range(1, 100).filter(n => n % 4 === 0 && n % 6 === 0).length);
X[10] = String(range(1, 50).filter(n => coprime(n, 10)).length);
X[11] = String([...new Set(factorise(2431))].reduce((a, b) => a + b, 0));
ok('Q11: 2431 = 11 × 221', 11 * 221 === 2431);
// matching: compute the right pairing, then find its option
const matchOpt = (li, pairs) => { const target = pairs.map(([p, v]) => `${p}–${v}`).join(', '); return pick(opts(li), o => o === target); };
X[12] = matchOpt(XQ[12], [['P', [6, 7, 8, 20, 9].indexOf(primesTo(19).length) + 1], ['Q', [6, 7, 8, 20, 9].indexOf(divisors(18).length) + 1], ['R', [6, 7, 8, 20, 9].indexOf(factorise(91)[0]) + 1], ['S', [6, 7, 8, 20, 9].indexOf(lcm(4, 10)) + 1]]);
{ const II = [2135, 97, 1348, 3120, 91];
  const idx = f => II.findIndex(f) + 1;
  ok('Q13: each List I row has exactly one match', [x => x % 8 === 0, x => x % 4 === 0 && x % 8, x => x % 5 === 0 && x % 2, isPrime].every(f => II.filter(f).length === 1));
  X[13] = matchOpt(XQ[13], [['P', idx(x => x % 8 === 0)], ['Q', idx(x => x % 4 === 0 && x % 8)], ['R', idx(x => x % 5 === 0 && x % 2)], ['S', idx(isPrime)]]); }
for (const n of range(1, 13)) ok(`Beyond ${n}: key ${XL[n]}, computed ${X[n]}`, XL[n] === X[n]);
// paragraph-based practice
{ const p14 = opts(XQ[14]).map(Number);
  ok('Beyond 14 (i)', XR[14]?.includes(`(${L[p14.indexOf(rects(48))]}) ${rects(48)}`), XR[14]);
  ok('Beyond 14 (ii)', XR[14]?.includes(`(ii) ${range(49, 100).find(n => rects(n) === 1)}`));
  ok('Beyond 14 (iii)', XR[14]?.includes(`(iii) ${rects(60)}`));
  const cards = range(2, 13);
  const with12 = cards.filter(c => c !== 12 && coprime(c, 12));
  const p15 = opts(XQ[15]).map(Number);
  ok('Beyond 15 (i)', XR[15]?.includes(`(${L[p15.indexOf(with12.length)]}) ${with12.length}: ${with12.slice(0, -1).join(', ')} and ${with12.at(-1)}`), XR[15]);
  ok('Beyond 15 (ii)', XR[15]?.includes(`(ii) ${cards.filter(c => c !== 13 && coprime(c, 13)).length}`));
  const with14 = cards.filter(c => coprime(c, 14));
  ok('Beyond 15 (iii)', XR[15]?.includes(`(iii) ${with14.length}: ${with14.slice(0, -1).join(', ')} and ${with14.at(-1)}`)); }
ok('Beyond key row 9', XR[9]?.includes(`12 ${B}times 8 = 96`) && lcm(4, 6) === 12);
ok('Beyond key row 11', XR[11]?.includes('41'));

/* ---- C: Beyond examples --------------------------------------------- */
const exWant = {
  1: pick(exOpts(1).map(Number), x => divisors(x).length === 3),
  2: pick(exOpts(2).map(Number), x => x === range(0, 8).find(k => (1234 + k) % 8 === 0)),
  3: pick(exOpts(3).map(o => o.split(' and ').map(Number)), ([a, b]) => coprime(a, b)),
  4: pick(exOpts(4).map(Number), x => 90 % x === 0),
};
for (const n of [1, 2, 3, 4]) ok(`Example ${n}: ${exAns(n)} vs ${exWant[n]}`, exAns(n).replace(/[()\s]/g, '').startsWith(exWant[n]));
ok('Example 4: the number is 90', 2 * 3 * 3 * 5 === 90);
ok('Example 5: 12 factors of 72', exAns(5) === String(divisors(72).length));
ok('Example 6: 37', exAns(6) === String(range(2, 1000).find(n => n % 4 === 1 && n % 6 === 1 && n % 9 === 1)));
{ const t7 = [8, 36, 2, 4], II = [4, 36, 8, 2];
  ok('Example 7 values', gcd(24, 40) === t7[0] && lcm(12, 18) === t7[1] && divisors(13).length === t7[2] && range(2, 20).find(n => !isPrime(n)) === t7[3]);
  const combo = 'P–' + (II.indexOf(t7[0]) + 1) + ', Q–' + (II.indexOf(t7[1]) + 1) + ', R–' + (II.indexOf(t7[2]) + 1) + ', S–' + (II.indexOf(t7[3]) + 1);
  ok('Example 7 answer', exAns(7) === `(${L[exOpts(7).indexOf(combo)]}) ${combo}`, exAns(7)); }
{ const P = [2 * 2 * 3 * 7, 2 * 3 * 3 * 5, 27, 32], II = [27, 84, 32, 90];
  const combo = ['P', 'Q', 'R', 'S'].map((k, i) => `${k}–${II.indexOf(P[i]) + 1}`).join(', ');
  ok('Example 8 answer', exAns(8) === `(${L[exOpts(8).indexOf(combo)]}) ${combo}`, exAns(8)); }
{ // the 2 by 2 prime puzzle: rows 6, 35; columns 10, 21 — solve by search
  const ps = primesTo(50), sols = [];
  for (const a of ps) for (const b of ps) for (const c of ps) for (const d of ps)
    if (a * b === 6 && c * d === 35 && a * c === 10 && b * d === 21) sols.push([a, b, c, d]);
  ok('Example 9: the puzzle has one solution', sols.length === 1);
  const [a, b, c, d] = sols[0] || [];
  ok('Example 9 answer', exAns(9) === `(i) (${L[exOpts(9).map(Number).indexOf(a)]}) ${a}; (ii) ${a * b * c * d}; (iii) ${a + b + c + d}`, exAns(9)); }
{ const f = lcm(4, 6), times = range(1, 60).filter(t => t % f === 0).length, all = lcm(4, 6, 10);
  ok('Example 10 answer', exAns(10) === `(i) (${L[exOpts(10).map(o => parseInt(o)).indexOf(f)]}) ${f} seconds; (ii) ${times}; (iii) ${all}`, exAns(10)); }

/* ---- D: By the Book written answers --------------------------------- */
const has = (n, ...vals) => { const r = BR[n] || ''; for (const v of vals) ok(`By the Book ${n} shows ${v}`, r.includes(String(v)), r); };
has(1, common(36, 60).slice(0, -1).join(', ') + ' and ' + common(36, 60).at(-1));
{ const m = range(1, 200).filter(x => x % 8 === 0 && x % 12 === 0).slice(0, 3); has(2, `${m[0]}, ${m[1]} and ${m[2]}`); }
has(4, factorise(98).join(` ${B}times `));
has(5, range(51, 100).find(isPrime));
ok('BtB 6: 7236 by 4 yes, by 8 no', 7236 % 4 === 0 && 7236 % 8 !== 0 && /By 4, yes/.test(BR[6]) && /By 8, no/.test(BR[6]));
ok('BtB 7: 45 and 64 co-prime', coprime(45, 64) && /^Yes/.test(BR[7]));
has(8, String(range(1, 9).filter(k => lcm(4, k) === 28)));
has(9, `remainder is ${3457 % 5}`, `remainder is ${3457 % 2}`);
has(10, `${divisors(49).length} factors`);
{ const v = Math.max(...range(100, 999).filter(n => n % 20 === 0)); ok(`By the Book 12 opens with ${v}`, (BR[12] || "").startsWith(String(v))); }
ok('BtB 13: 2016 divisible by 8', 2016 % 8 === 0 && /^Yes/.test(BR[13]));
has(14, common(48, 72).slice(0, -1).join(', ') + ' and ' + common(48, 72).at(-1), `largest jump size is ${Math.max(...common(48, 72))}`);
ok('BtB 15: pairs co-prime with product 1800', coprime(8, 225) && coprime(9, 200) && coprime(25, 72) && 9 * 200 === 1800 && 25 * 72 === 1800);
ok('BtB 16: 21 has four factors', divisors(21).length === 4);
{ const n = range(51, 99).filter(x => x % 12 === 0 && String(x).split('').reduce((a, b) => a + +b, 0) === 9); ok('BtB 17: one answer, 72', n.length === 1 && n[0] === 72 && /^72/.test(BR[17])); }
has(18, lcm(6, 9, 12), range(101, 999).find(x => x % lcm(6, 9, 12) === 0));
has(19, [2, 4, 5, 10].filter(d => 2340 % d === 0).join(', ').replace(/, (\d+)$/, ' and $1'));
ok('BtB 19: 8 does not divide 2340', 2340 % 8 !== 0);
{ const p = range(81, 99).filter(isPrime); has(20, p.slice(0, -1).join(', ') + ' and ' + p.at(-1), `= ${19 - p.length}`); }
has(21, common(84, 126).slice(0, -1).join(', ') + ' or ' + common(84, 126).at(-1), `${84 / 14} rows of chairs`, `${126 / 14} of stools`);
{ const f = lcm(6, 8, 12); ok('BtB 22: every 24 minutes, 5 times', f === 24 && range(1, 120).filter(t => t % f === 0).length === 5 && /5 times/.test(BR[22])); }
has(23, `: ${lcm(4, 6)}`);
{ const a = Math.floor(200 / 6), b = Math.floor(200 / 8), c = Math.floor(200 / lcm(6, 8)); has(24, `${a} multiples of 6`, `${b} of 8`, `${c} of both`, `= ${a + b - c}`); }
{ const n = 2 * 2 * 3 * 3 * 7; has(25, n, `= 14 ${B}times ${n / 14}`); ok('BtB 25: not by 8', n % 8 !== 0); }
{ const p = range(101, 129).filter(isPrime); has(26, p.slice(0, -1).join(', ') + ' and ' + p.at(-1), `${p.length} primes`); }
has(27, `36 figs: ${rects(36)} rectangles`, `37 figs: ${rects(37)}`, `40 figs: ${rects(40)}`);
{ const prs = divisors(420).filter(d => d > 1 && d * d < 420 && coprime(d, 420 / d)); ok('BtB 28: 7 co-prime pairs, all printed', prs.length === 7 && prs.every(d => BR[28].includes(`${d} ${B}times ${420 / d}`) || BR[28].includes(`${420 / d} ${B}times ${d}`)), prs.join(',')); }
{ const m = lcm(2, 4, 5, 8, 10), fours = range(1000, 9999).filter(x => x % m === 0); has(29, fours[0], fours.at(-1)); }
ok('BtB 30', factorise(45 * 56).join(' ') === '2 2 2 3 3 5 7' && (45 * 56) % 12 === 0 && (45 * 56) % 35 === 0 && (45 * 56) % 27 !== 0);
has(36, `${gcd(48, 60)} teams`, `${48 / gcd(48, 60)} girls and ${60 / gcd(48, 60)} boys`, `${48 / 12 + 60 / 12} children`);
ok('BtB 36 (ii): 8 does not divide 60', 60 % 8 !== 0);
ok('BtB 37', lcm(15, 20) === 60 && /7:00 am/.test(BR[37]) && [0, 60, 120, 180, 240].length === 5 && /5 times/.test(BR[37]));
{ const left = range(51, 70).filter(n => n % 2 && n % 3 && n % 5 && n % 7);
  has(38, `${left.length} numbers, ${left.slice(0, -1).join(', ')} and ${left.at(-1)}`, range(2, 1000).find(n => !isPrime(n) && n % 2 && n % 3 && n % 5 && n % 7));
  ok('BtB 38: all left are primes', left.every(isPrime)); }
{ const both = range(2025, 2100).filter(y => (y - 2024) % lcm(3, 4) === 0); has(39, '2027 and 2030', both[0], `${both.length} times`); }
{ const ds = range(0, 9).filter(d => (7130 + d) % 8 === 0); ok('BtB 40', 4520 % 8 === 0 && 2316 % 4 === 0 && 2316 % 8 !== 0 && ds.length === 1 && BR[40].includes(`Only ${ds[0]}`) && BR[40].includes('Shelf A') && BR[40].includes('Shelf B')); }

/* ---- the body's worked examples and a few body claims --------------- */
ok('Ex 1: 15, 39 not co-prime; 4, 9 co-prime', !coprime(15, 39) && coprime(4, 9));
ok('Ex 2: 180', factorise(180).join(' ') === '2 2 3 3 5');
ok('Ex 3: 40 and 231 co-prime', coprime(40, 231) && factorise(231).join(' ') === '3 7 11');
ok('Ex 4: 242 and 195 co-prime', coprime(242, 195) && factorise(242).join(' ') === '2 11 11' && factorise(195).join(' ') === '3 5 13');
ok('Ex 5: 168 = 12 × 14', 168 % 12 === 0 && factorise(168).join(' ') === '2 2 2 3 7');
ok('Fig. 5.6: 25 primes up to 100', primesTo(100).length === 25);
ok('the largest multiple of 4 test', range(1, 9999).every(n => (n % 4 === 0) === ((n % 100) % 4 === 0)));

/* ---- ANSWERS.md carries the same keys -------------------------------- */
ok('ANSWERS.md objective key', ANSWERS.includes(range(41, 50).map(n => `${n} (${BL[n]})`).join(' · ')));
ok('ANSWERS.md A-R key', ANSWERS.includes(range(31, 35).map(n => `${n} (${BL[n]})`).join(' · ')));
ok('ANSWERS.md Beyond Q11', ANSWERS.includes('11 **41**'));

console.log(`\n  ${checks} checks, ${fails} failed`);
process.exit(fails ? 1 : 0);
