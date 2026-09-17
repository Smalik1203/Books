#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth. Each experiment's
   sample space is built and counted here — one die, two dice, coins, a coin
   with a die, a 52-card deck, numbered cards, bags — and every probability is
   an exact fraction in lowest terms, compared with what is on the page.

     node pages/class-10/ch14-probability/check-numbers.mjs [--skipped]

   Four parts:
     A  every identity set as maths, on every page and in ANSWERS.md, whose
        sides all evaluate (fractions, surds, pi)
     B  the claims A cannot check: counts of outcomes, the probabilities in
        the examples, the exercise answers, Stage 1, the solved examples and
        the practice answers, each read back off the page a part at a time;
        complementary events printed together add to 1
     C  every multiple-choice and assertion-reason question: exactly one
        option is right, and it is the one the key (or the Answer row) prints
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

/* ---- exact fractions ------------------------------------------ */

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const F = (n, d = 1) => { const g = gcd(n, d) || 1; n /= g; d /= g; if (d < 0) { n = -n; d = -d; } return d === 1 ? `${n}` : `${n}/${d}`; };
const P = (space, pred) => F(space.filter(pred).length, space.length);
const val = (f) => { const [n, d = 1] = String(f).split('/').map(Number); return n / d; };
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const isPrime = (n) => { if (n < 2) return false; for (let d = 2; d * d <= n; d++) if (n % d === 0) return false; return true; };
const isSquare = (n) => Number.isInteger(Math.sqrt(n));

/* ---- the sample spaces ---------------------------------------- */

const DIE = range(1, 6);
const DICE = DIE.flatMap(a => DIE.map(b => [a, b]));
const COIN = ['H', 'T'];
const COINS = (k) => (k === 0 ? [''] : COINS(k - 1).flatMap(s => COIN.map(c => s + c)));
const COIN_DIE = COIN.flatMap(c => DIE.map(d => [c, d]));
const RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const SUITS = ['S', 'H', 'D', 'C'];
const DECK = SUITS.flatMap(s => RANKS.map(r => ({ r, s, red: s === 'H' || s === 'D', face: 'JQK'.includes(r) && r.length === 1 })));
is('a deck has 52 cards, 26 red, 12 face cards', DECK.length === 52 && DECK.filter(c => c.red).length === 26 && DECK.filter(c => c.face).length === 12);
const bag = (counts) => Object.entries(counts).flatMap(([k, n]) => Array(n).fill(k));

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');

// text with maths flattened: \dfrac{a}{b} -> a/b, tags and $ gone
const norm = (s) => s.replace(/<span class="nb">([^<]*)<\/span>/g, '$1')
  .replace(/\\[dt]?frac\{\s*(-?\d+)\s*\}\{\s*(\d+)\s*\}/g, '$1/$2')
  .replace(/\\[dt]?frac\{\\pi\}\{(\d+)\}/g, 'pi/$1')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-')
  .replace(/\$/g, '').replace(/[{}]/g, '').replace(/\s+/g, ' ');
const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const has = (text, v) => new RegExp(`(^|[^\\d/.])${esc(v)}(?![\\d/]|\\.\\d)`).test(text);
const PARTS = '(?:i|ii|iii|iv|v|vi|a|b|c|d)';
const part = (text, p) => {
  if (!p) return text;
  const m = text.match(new RegExp(`\\(${p}\\)(.*?)(?=\\(${PARTS}\\)|$)`));
  return m ? m[1] : '';
};

/* ---- A. every identity ---------------------------------------- */

function toExpr(side) {
  let s = side.replace(/\\left|\\right/g, '').replace(/\\,|\\ |\\;|\\quad|\\qquad/g, '');
  for (let i = 0; i < 4; i++) {
    s = s.replace(/\\sqrt\{([^{}]+)\}/g, 'Math.sqrt[$1]')                     // before \frac
      .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))');
  }
  s = s.replace(/Math\.sqrt\[([^\]]+)\]/g, 'Math.sqrt($1)')
    .replace(/\\pi/g, 'Math.PI')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\^\{([^{}]+)\}/g, '**($1)').replace(/\^(\d)/g, '**$1')
    .replace(/[{}]/g, '').replace(/\s+/g, '');
  if (!s || !/^(Math\.sqrt|Math\.PI|[-+*/().0-9])+$/.test(s)) return null;
  return s.replace(/\)\(/g, ')*(').replace(/([0-9)])(Math\.)/g, '$1*$2');   // juxtaposition is a product
}
const evalExpr = (e) => { try { return Function(`"use strict";return (${e})`)(); } catch { return NaN; } };

function splitParts(span) {
  const out = []; let depth = 0, cur = '';
  for (let i = 0; i < span.length; i++) {
    const ch = span[i];
    if ('({'.includes(ch)) depth++;
    if (')}'.includes(ch)) depth--;
    if (depth === 0 && ch === ',' && /=/.test(cur) && /=/.test(span.slice(i + 1))) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
}

let spans = 0; const skipped = [];
const sources = [...pages.map(f => [f, html[f]]), ['ANSWERS.md', answersMd]];
for (const [f, raw] of sources) {
  const src = raw.replace(/\$\$([\s\S]*?)\$\$/g, (m, x) => `$${x}$`);      // display maths first
  for (const m of src.matchAll(/\$([^$]+)\$/g)) {
    const span = m[1];
    if (!span.includes('=') || /\\neq|\\leq|\\geq|<|>/.test(span)) continue;
    for (const pt of splitParts(span.replace(/^\s*\{(.*)\}\s*$/s, '$1'))) {
      const sides = pt.split('=').map(s => s.trim()).filter(Boolean);
      if (sides.length < 2) continue;
      let vals = sides.map(toExpr);
      if (vals.filter(Boolean).length >= 2) vals = vals.filter(Boolean);
      if (vals.some(v => !v) || vals.length < 2) { skipped.push(`${f}: $${pt.trim()}$`); continue; }
      const nums = vals.map(evalExpr);
      if (nums.some(n => !Number.isFinite(n))) { skipped.push(`${f}: $${pt.trim()}$`); continue; }
      spans++;
      if (nums.some(n => Math.abs(n - nums[0]) > 1e-9)) fails.push(`${f}: $${pt.trim()}$ — sides are ${nums.join(' and ')}`);
      else pass++;
    }
  }
}
// a fraction printed as a final answer is in lowest terms
for (const [f, raw] of sources) {
  for (const m of raw.matchAll(/[\d}] = \\[dt]?frac\{(\d+)\}\{(\d+)\}\s*\}?\$/g)) {   // a fraction that ends a chain
    is(`${f}: final fraction ${m[1]}/${m[2]} is in lowest terms`, gcd(Number(m[1]), Number(m[2])) === 1);
  }
}

/* ---- B. the body ---------------------------------------------- */

const bodyEx = {};
for (const m of body.matchAll(/c-example__tab">Example (\d+)<\/div>([\s\S]*?)(?=c-example__tab"|<div class="c-practice|$)/g)) bodyEx[m[1]] = m[2];
const ansRow = (src, n) => {
  const m = (src[n] || '').match(/work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/);
  return m ? norm(m[1]) : '';
};
const exSays = (n, p, v) => is(`body Example ${n}${p ? ` (${p})` : ''} should print ${v}: "${part(ansRow(bodyEx, n), p)}"`, has(part(ansRow(bodyEx, n), p), v));

exSays(1, '', P(COINS(1), s => s === 'H'));
exSays(1, '', P(COINS(1), s => s === 'T'));
exSays(2, '', P(['red', 'blue', 'yellow'], c => c === 'yellow'));
exSays(3, 'i', P(DIE, x => x > 4));
exSays(3, 'ii', P(DIE, x => x <= 4));
exSays(4, 'i', P(DECK, c => c.r === 'A'));
exSays(4, 'ii', P(DECK, c => c.r !== 'A'));
{ const m = norm(bodyEx[5]).match(/is (0\.\d+)\./); const given = Number(m && m[1]);
  is(`body Example 5: 1 - ${given} is printed`, has(ansRow(bodyEx, 5), String(+(1 - given).toFixed(10)))); }
{ const year = range(1, 365); exSays(6, 'i', P(year, d => d !== 1)); exSays(6, 'ii', P(year, d => d === 1)); }
{ const cls = bag({ girl: 25, boy: 15 }); exSays(7, 'i', P(cls, s => s === 'girl')); exSays(7, 'ii', P(cls, s => s === 'boy')); }
{ const box = bag({ blue: 3, white: 2, red: 4 });
  exSays(8, 'i', P(box, c => c === 'white')); exSays(8, 'ii', P(box, c => c === 'blue')); exSays(8, 'iii', P(box, c => c === 'red')); }
is(`body Example 9 should print ${P(COINS(2), s => s.includes('H'))}`, has(ansRow(bodyEx, 9), P(COINS(2), s => s.includes('H'))));
is('body Example 9: the note counts one outcome with no head', COINS(2).filter(s => !s.includes('H')).length === 1);
// Example 10: length ratio, read off the question and the figure
{ const q = norm(bodyEx[10]); const total = Number(q.match(/within (\d+) minutes/)[1]);
  is('Fig. 14.1 runs from 0 to the total', /<text class="dg-tick"[^>]*>2<\/text>/.test(body) && total === 2);
  is(`body Example 10 should print ${F(1, 2 * total)}`, has(ansRow(bodyEx, 10), F(1, 2 * total))); }
// Example 11: the lake, from the dimension labels on Fig. 14.2
{ const labels = [...body.matchAll(/dg-dim-label"[^>]*>([\d.]+) km</g)].map(m => Number(m[1]));
  ok('Fig. 14.2 dimension labels', labels, [6, 9, 4.5, 2]);
  const [left, len, wid, below] = labels;
  const ratio = ((len - left) * (wid - below)) / (len * wid);
  is(`body Example 11: lake over region is ${ratio}`, has(ansRow(bodyEx, 11), F(Math.round(ratio * 27 * 1000), 27 * 1000)));
  ok('body Example 11: 5/27 exactly', F(75, 405), '5/27'); }
{ const carton = bag({ good: 88, minor: 8, major: 4 });
  const q = ansRow(bodyEx, 12);
  is(`body Example 12 (i): ${val(P(carton, s => s === 'good'))}`, has(part(q, 'i'), String(val(P(carton, s => s === 'good')))));
  is(`body Example 12 (ii): ${val(P(carton, s => s !== 'major'))}`, has(part(q, 'ii'), String(val(P(carton, s => s !== 'major'))))); }
exSays(13, 'i', P(DICE, ([a, b]) => a + b === 8));
exSays(13, 'ii', P(DICE, ([a, b]) => a + b === 13));
exSays(13, 'iii', P(DICE, ([a, b]) => a + b <= 12));
is('body Example 13: the table lists 36 pairs', (body.match(/<td>\(\d, \d\)<\/td>/g) || []).length === 36);
is(`body Example 13: the pairs for 8 are listed`, /\(2, 6\), \(3, 5\), \(4, 4\), \(5, 3\), \(6, 2\)/.test(bodyEx[13]) && DICE.filter(([a, b]) => a + b === 8).length === 5);
// complementary events printed together
for (const [n, a, b] of [[4, 'i', 'ii'], [6, 'i', 'ii'], [7, 'i', 'ii']]) {
  const x = part(ansRow(bodyEx, n), a).match(/\d+\/\d+/g).pop(), y = part(ansRow(bodyEx, n), b).match(/\d+\/\d+/g).pop();
  is(`body Example ${n}: ${x} + ${y} = 1`, Math.abs(val(x) + val(y) - 1) < 1e-12);
}
// the exercise's Q4 has exactly one impossible value
{ const q4 = body.match(/data-start="4">([\s\S]*?)<\/ol>\s*<\/li>/)[1];
  const opts = [...q4.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => norm(m[1]).trim())
    .map(s => /%$/.test(s) ? Number(s.slice(0, -1)) / 100 : val(s.replace(/−/g, '-')));
  ok('Ex 14.1 Q4: the options that cannot be probabilities', opts.map((v, i) => (v < 0 || v > 1 ? 'abcd'[i] : null)).filter(Boolean), ['b']); }

// Exercise Set 14.1, read back off ANSWERS.md
const exSet = answersMd.slice(answersMd.indexOf('### Exercise Set 14.1'), answersMd.indexOf('## Beyond the Book'));
const mdQ = (src, n) => { const m = src.match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |\\n---|$)`)); return m ? norm(m[1]) : ''; };
const mdSays = (src, label, n, p, ...vals) => { for (const v of vals) is(`ANSWERS.md ${label} Q${n}${p ? ` (${p})` : ''} should say ${v}: "${part(mdQ(src, n), p)}"`, has(part(mdQ(src, n), p), v)); };
const ex = (n, p, ...v) => mdSays(exSet, 'Ex 14.1', n, p, ...v);

ex(1, 'ii', 0); ex(1, 'iii', 1); ex(1, 'iv', 1); ex(1, 'v', 0, 1);
ex(4, '', '-1.5');
ex(5, '', String(+(1 - 0.05).toFixed(10)));
{ const sweets = bag({ lemon: 10 }); ex(6, 'i', P(sweets, s => s === 'orange')); ex(6, 'ii', P(sweets, s => s === 'lemon')); }
ex(7, '', String(+(1 - 0.992).toFixed(10)));
{ const b = bag({ red: 3, black: 5 }); ex(8, 'i', P(b, c => c === 'red')); ex(8, 'ii', P(b, c => c !== 'red')); }
{ const b = bag({ red: 5, white: 8, green: 4 }); ex(9, 'i', P(b, c => c === 'red')); ex(9, 'ii', P(b, c => c === 'white')); ex(9, 'iii', P(b, c => c !== 'green')); }
{ const b = bag({ p50: 100, r1: 50, r2: 20, r5: 10 }); ex(10, '', b.length); ex(10, 'i', P(b, c => c === 'p50')); ex(10, 'ii', P(b, c => c !== 'r5')); }
ex(11, '', P(bag({ male: 5, female: 8 }), f => f === 'male'));
{ const w = range(1, 8); ex(12, 'i', P(w, x => x === 8)); ex(12, 'ii', P(w, x => x % 2 === 1)); ex(12, 'iii', P(w, x => x > 2)); ex(12, 'iv', P(w, x => x < 9)); }
ex(13, 'i', P(DIE, isPrime)); ex(13, 'ii', P(DIE, x => x > 2 && x < 6)); ex(13, 'iii', P(DIE, x => x % 2 === 1));
ex(14, 'i', P(DECK, c => c.red && c.r === 'K'));
ex(14, 'ii', P(DECK, c => c.face));
ex(14, 'iii', P(DECK, c => c.red && c.face));
ex(14, 'iv', P(DECK, c => c.r === 'J' && c.s === 'H'));
ex(14, 'v', P(DECK, c => c.s === 'S'));
ex(14, 'vi', P(DECK, c => c.r === 'Q' && c.s === 'D'));
{ const five = ['10', 'J', 'Q', 'K', 'A']; const rest = five.filter(c => c !== 'Q');
  ex(15, 'i', P(five, c => c === 'Q')); for (const v of [P(rest, c => c === 'A'), P(rest, c => c === 'Q')]) is(`Ex 14.1 Q15 (ii) should say ${v}`, has(mdQ(exSet, 15).split('(ii)')[1] || '', v)); }
ex(16, '', P(bag({ bad: 12, good: 132 }), p => p === 'good'));
{ const lot = bag({ bad: 4, good: 16 }); ex(17, 'i', P(lot, b => b === 'bad'));
  const after = bag({ bad: 4, good: 15 }); ex(17, 'ii', P(after, b => b === 'good')); }
{ const d = range(1, 90); ex(18, 'i', P(d, x => x >= 10)); ex(18, 'ii', P(d, isSquare)); ex(18, 'iii', P(d, x => x % 5 === 0)); }
{ const faces = ['A', 'B', 'C', 'D', 'E', 'A']; ex(19, 'i', P(faces, x => x === 'A')); ex(19, 'ii', P(faces, x => x === 'D')); }
{ const q20 = mdQ(exSet, 20); const coef = F(1, 4 * 6);   // pi (1/2)^2 over 3 x 2
  is(`Ex 14.1 Q20 should say pi/${coef.split('/')[1]}: "${q20}"`, q20.includes(`pi/${coef.split('/')[1]}`)); }
{ const lot = bag({ bad: 20, good: 124 }); ex(21, 'i', P(lot, p => p === 'good')); ex(21, 'ii', P(lot, p => p === 'bad')); }
{ const counts = range(2, 12).map(s => DICE.filter(([a, b]) => a + b === s).length);
  is(`Ex 14.1 Q22 (i) lists the counts ${counts.join(', ')}`, part(mdQ(exSet, 22), 'i').includes(counts.join(', ')));
  is('Ex 14.1 Q22 (i) lists each as a fraction of 36', counts.every(c => part(mdQ(exSet, 22), 'i').includes(`${c}/36`)));
  const tbl = body.match(/<th>Sum<\/th>[\s\S]*?<\/tbody>/)[0];
  const printed = [...tbl.matchAll(/<td>([\s\S]*?)<\/td>/g)].map(m => norm(m[1]).trim());
  ok('Ex 14.1 Q22: the given cells of the table', [printed[1], printed[7], printed[11]], [F(counts[0], 36), F(counts[6], 36), F(counts[10], 36)]);
  ex(22, 'ii', counts[5], counts[0]); }
{ const c3 = COINS(3); ex(23, '', P(c3, s => !/^(HHH|TTT)$/.test(s))); ok('Ex 14.1 Q23: 8 outcomes', c3.length, 8); }
ex(24, 'i', P(DICE, ([a, b]) => a !== 5 && b !== 5)); ex(24, 'ii', P(DICE, ([a, b]) => a === 5 || b === 5));
ex(25, 'i', P(COINS(2), s => s === 'HT' || s === 'TH'), P(COINS(2), s => s === 'HH'));
ex(25, 'ii', P(DIE, x => x % 2 === 1));
for (const [n, a, b] of [[8, 'i', 'ii'], [21, 'i', 'ii'], [24, 'i', 'ii']]) {
  const x = part(mdQ(exSet, n), a).match(/\d+\/\d+/g).pop(), y = part(mdQ(exSet, n), b).match(/\d+\/\d+/g).pop();
  is(`ANSWERS.md Ex 14.1 Q${n}: ${x} + ${y} = 1`, Math.abs(val(x) + val(y) - 1) < 1e-12);
}
{ const running = norm(answersMd.slice(answersMd.indexOf('### Questions in the running text'), answersMd.indexOf('### Exercise Set')));
  is('running text: 2 + 3 + 4 = 9 marbles', running.includes('2/9 + 3/9 + 4/9 = 9/9 = 1'));
  const counts = [COINS(1).length, 3, DIE.length, DECK.length, 2, 365, 40, 3 + 2 + 4, COINS(2).length];
  is(`running text: the outcome counts of Examples 1-9 are ${counts.join(', ')}`, running.includes(`${counts.slice(0, -1).join(', ')} and ${counts.at(-1)}`)); }

/* ---- B. Beyond the Book --------------------------------------- */

// Stage 1, the running text after each question
const tries = [...beyond.matchAll(/<div class="c-try">([\s\S]*?)<\/div>([\s\S]*?)(?=<div class="c-try">|<div class="c-stage">)/g)].map(m => norm(m[2]));
ok('Stage 1 has five questions', tries.length, 5);
is(`Stage 1 Q1: odd product ${P(DICE, ([a, b]) => a * b % 2 === 1)}, even ${P(DICE, ([a, b]) => a * b % 2 === 0)}`,
  has(tries[0], P(DICE, ([a, b]) => a * b % 2 === 1)) && has(tries[0], P(DICE, ([a, b]) => a * b % 2 === 0)) && has(tries[0], DICE.filter(([a, b]) => a * b % 2 === 0).length));
is(`Stage 1 Q2: red or king ${P(DECK, c => c.red || c.r === 'K')}`, has(tries[1], P(DECK, c => c.red || c.r === 'K')) && has(tries[1], DECK.filter(c => c.red || c.r === 'K').length));
is(`Stage 1 Q3: exactly two heads ${P(COINS(3), s => s.split('H').length - 1 === 2)}`, has(tries[2], P(COINS(3), s => s.split('H').length - 1 === 2)));
ok('Stage 1 Q3: the eight outcomes listed', tries[2].match(/[HT]{3}/g).sort(), COINS(3).sort());
{ const red = 6; const blue = range(0, 100).find(b => b === 3 * red); is(`Stage 1 Q4: ${blue} blue balls`, has(tries[3], blue)); }
is(`Stage 1 Q5: same number ${P(range(1, 3).flatMap(a => range(1, 3).map(b => [a, b])), ([a, b]) => a === b)}`,
  has(tries[4], P(range(1, 3).flatMap(a => range(1, 3).map(b => [a, b])), ([a, b]) => a === b)));

// Solved examples
const bEx = {};
for (const m of beyond.matchAll(/c-example__tab">Example (\d+)<\/div>([\s\S]*?)(?=c-example__tab"|<div class="c-practice|<h3>|$)/g)) bEx[m[1]] = m[2];
ok('Solved examples numbered 1-15', Object.keys(bEx).map(Number), range(1, 15));
const bSays = (n, p, v) => is(`Beyond Example ${n}${p ? ` (${p})` : ''} should print ${v}: "${part(ansRow(bEx, n), p)}"`, has(part(ansRow(bEx, n), p), v));
const optsIn = (s) => { const m = s.match(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*?)<\/ol>/); return m ? [...m[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => norm(x[1]).trim()) : []; };
const letterOf = (opts, test) => opts.map((o, i) => (test(o) ? 'abcd'[i] : null)).filter(Boolean);
const eqF = (want) => (o) => o === want;
const exMCQ = (n, test) => {
  const o = optsIn(bEx[n]); is(`Beyond Example ${n} has four options`, o.length === 4);
  const right = letterOf(o, test);
  ok(`Beyond Example ${n}: the right option`, right.map(l => `(${l})`), [ansRow(bEx, n).trim()]);
};
exMCQ(1, eqF(P(DIE, x => x % 3 !== 0)));
{ const w = 'PROBABILITY'.split(''); exMCQ(2, eqF(P(w, c => c === 'B'))); }
bSays(3, '', P(range(1, 50), x => x % 4 !== 0));
exMCQ(4, eqF(P(COINS(2), s => (s.match(/H/g) || []).length <= 1)));
bSays(5, '', P(COIN_DIE, ([c, d]) => c === 'H' && d % 2 === 0));
is('Beyond Example 5: 12 outcomes', COIN_DIE.length === 12);
exMCQ(6, eqF(P(DICE, ([a, b]) => a === b)));
exMCQ(7, eqF(P(DICE, ([a, b]) => Math.abs(a - b) === 2)));
is('Beyond Example 7: 8 pairs listed', (bEx[7].match(/\(\d, \d\)/g) || []).length === DICE.filter(([a, b]) => Math.abs(a - b) === 2).length);
bSays(8, '', P(DICE, ([a, b]) => a * b <= 6));
is('Beyond Example 8: 14 pairs', DICE.filter(([a, b]) => a * b <= 6).length === 14);
exMCQ(9, eqF(P(DECK, c => c.r !== 'K' && c.s !== 'H')));
is('Beyond Example 9: 16 kings or hearts', DECK.filter(c => c.r === 'K' || c.s === 'H').length === 16);
{ const rest = DECK.filter(c => !(c.face && !c.red));
  is('Beyond Example 10: 46 cards left', rest.length === 46);
  bSays(10, 'i', P(rest, c => c.red)); bSays(10, 'ii', P(rest, c => c.face)); bSays(10, 'iii', P(rest, c => c.r === 'K')); }
// Example 11: a bag of 18 whose colour probabilities are given; the counts are found, then checked as a bag
{ const q = norm(bEx[11].split('Solution')[0]);
  const total = Number(q.match(/holds (\d+) balls/)[1]);
  const [pr, pb] = [...q.matchAll(/red is (\d+)\/(\d+)|black is (\d+)\/(\d+)/g)].map(m => (m[1] ? Number(m[1]) / Number(m[2]) : Number(m[3]) / Number(m[4])));
  const red = pr * total, black = pb * total, white = total - red - black;
  is('Beyond Example 11: whole numbers of balls', [red, black, white].every(Number.isInteger));
  const b = bag({ red, black, white });
  ok('Beyond Example 11: the given probabilities come back', [P(b, c => c === 'red'), P(b, c => c === 'black')], [F(1, 6), F(1, 2)]);
  bSays(11, 'i', P(b, c => c === 'white'));
  bSays(11, 'ii', String(b.filter(c => c === 'white').length));
  bSays(11, 'iii', P(b, c => c === 'green'));
  bSays(11, 'iii', P(b, c => ['red', 'black', 'white'].includes(c)));
  const w = norm(bEx[11]);
  is('Beyond Example 11: Step 3 multiplies by the total', w.includes(`= 1/3 \\times ${total} = ${white}`) || /\\times 18 = 6/.test(bEx[11]));
  is('Beyond Example 11: 0/18 and 18/18 printed', /\\dfrac\{0\}\{18\} = 0/.test(bEx[11]) && /\\dfrac\{18\}\{18\} = 1/.test(bEx[11]));
  is('Beyond Example 11: names the impossible and the sure event', /an impossible event/.test(w) && /a sure event/.test(w));
  is('Beyond Example 11: 1 - 1/6 - 1/2 = 1/3', F(6 - 1 - 3, 6) === '1/3' && /1 - \\dfrac\{1\}\{6\} - \\dfrac\{1\}\{2\} = \\dfrac\{1\}\{3\}/.test(bEx[11])); }
exMCQ(12, eqF(P(range(1, 50), x => isSquare(x) || x % 10 === 0)));
exMCQ(13, (o) => { const x = Number(o); return F(x + 6, 18) === F(2 * x, 12); });
exMCQ(14, (o) => { const x = Number(o); return F(x, 100 + x) === '1/6'; });
{ const cls = bag({ redB: 8, redG: 12, blueB: 10, blueG: 5, greenB: 14, greenG: 11 });
  const t = [...bEx[15].matchAll(/<tr><td>\w+<\/td><td>(\d+)<\/td><td>(\d+)<\/td><\/tr>/g)].map(m => [Number(m[1]), Number(m[2])]);
  ok('Beyond Example 15: the table', t, [[8, 12], [10, 5], [14, 11]]);
  is('Beyond Example 15: 60 students', cls.length === 60 && has(norm(bEx[15]), 60));
  bSays(15, 'i', P(cls, s => s === 'redG')); bSays(15, 'ii', P(cls, s => !s.startsWith('blue'))); bSays(15, 'iii', P(cls, s => s.endsWith('B'))); }

// the practice answers, read back out of the key rows
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= norm(m[2]);
const says = (q, p, ...vals) => { for (const v of vals) is(`key ${q}${p ? ` (${p})` : ''} should say ${v}: "${part(keyRows[q] || '', p)}"`, has(part(keyRows[q] || '', p), v)); };
const PR = {
  16: [['', P(DIE, x => 12 % x === 0)]],
  17: [['', P(range(1, 100), x => x % 7 === 0)]],
  18: [['', P(DECK, c => !c.red && ['2', '3', '4', '5'].includes(c.r))]],
  19: [['', P(bag({ prize: 10, blank: 240 }), t => t === 'blank')]],
  20: [['', P(DICE, ([a, b]) => a >= 5 && b >= 5)]],
  21: [['i', P(range(1, 20), isPrime)], ['ii', P(range(1, 20), x => x % 3 === 0)], ['iii', P(range(1, 20), x => x % 20 === 0)]],
  22: [['', P(COIN_DIE, ([c, d]) => c === 'H' || d > 4)]],
  23: (() => { const r = DECK.filter(c => c.r !== 'A' && c.r !== 'K');
    return [['', r.length], ['i', P(r, c => c.s === 'H')], ['ii', P(r, c => c.face)], ['iii', P(r, c => !c.red && !c.face)]]; })(),
  24: (() => { const f = [0, 1, 1, 1, 6, 6]; const sp = f.flatMap(a => f.map(b => a + b));
    return [['i', P(sp, s => s === 7)], ['ii', P(sp, s => s === 2)]]; })(),
  25: [['', (() => { for (let d = 1; d < 50; d++) for (let n = 0; n <= d; n++) if (n === 3 * (d - n)) return F(n, d); })()]],   // P(win) = 3 P(lose)
  26: [['i', P(DICE, ([a, b]) => isSquare(a * b))], ['ii', P(DICE, ([a, b]) => a * b > 20)], ['iii', P(DICE, ([a, b]) => Math.max(a, b) === 4)], ['iv', P(DICE, ([a, b]) => a === 2 * b || b === 2 * a)]],
  27: (() => { const c = range(3, 35).filter(x => x % 2 === 1);
    return [['', c.length], ['i', P(c, isPrime)], ['ii', P(c, x => x % 15 === 0)], ['iii', P(c, isSquare)], ['iv', P(c, x => x % 7 !== 0)]]; })(),
  28: (() => { const one = 60 / 3, two = 60 / 4, five = 60 - one - two; const jar = bag({ r1: one, r2: two, r5: five + 10 });
    return [['i', five], ['ii', P(jar, c => c === 'r5')]]; })(),
  29: (() => { const box = bag({ pencil: 30, eraser: 25, pen: 15, sticker: 20, empty: 10 }); const after = bag({ pencil: 30, eraser: 25, pen: 14, sticker: 20, empty: 10 });
    return [['a', P(box, t => t === 'pen')], ['b', P(box, t => t !== 'empty')], ['c', P(box, t => t === 'pencil' || t === 'eraser')], ['d', P(after, t => t === 'pen')]]; })(),
  30: (() => { const w = bag({ r0: 5, r10: 4, r20: 2, r50: 1 });
    return [['a', P(w, s => s === 'r0')], ['b', P(w, s => s !== 'r0')], ['c', P(w, s => s !== 'r10')], ['d', P(w, s => s === 'r50')]]; })(),
};
for (const [q, list] of Object.entries(PR)) for (const [p, v] of list) says(q, p, v);
is('key 30 (d) says No', /^\s*No/.test(part(keyRows[30], 'd')));
// the case tables are the ones computed from
{ const t29 = [...beyond.matchAll(/<tr><td>(Pencil|Eraser|Pen|Sticker|Empty)<\/td><td>(\d+)<\/td><\/tr>/g)].map(m => Number(m[2]));
  ok('Q29 table', t29, [30, 25, 15, 20, 10]);
  const t30 = [...beyond.matchAll(/<tr><td><span class="nb">₹\d+<\/span><\/td><td>(\d+)<\/td><\/tr>/g)].map(m => Number(m[1]));
  ok('Q30 table', t30, [5, 4, 2, 1]); }

// equations in one unknown: put the printed solution back into every equation of its block
function substitute(label, block, v) {
  const spansIn = [...block.matchAll(/\$([^$]+)\$/g)].map(m => m[1].replace(/^\s*\{(.*)\}\s*$/s, '$1'));
  const sol = spansIn.map(s => s.match(new RegExp(`^\\s*${v} = ([^=]+)$`))).filter(Boolean).pop();
  is(`${label}: a solution for ${v} is printed`, !!sol);
  if (!sol) return;
  const value = evalExpr(toExpr(sol[1]));
  let n = 0;
  for (const s of spansIn) {
    if (!new RegExp(`\\b${v}\\b|\\d${v}`).test(s) || !s.includes('=') || /\\text/.test(s)) continue;
    const sides = s.split('=').map(x => toExpr(x.replace(new RegExp(`(\\d)${v}`, 'g'), `$1*(${value})`).replace(new RegExp(`\\b${v}\\b`, 'g'), `(${value})`).replace(/(\d)\(/g, '$1*(')));
    if (sides.some(x => !x)) { fails.push(`${label}: could not read $${s}$`); continue; }
    const nums = sides.map(evalExpr);
    n++;
    is(`${label}: $${s}$ holds at ${v} = ${value}`, nums.every(x => Math.abs(x - nums[0]) < 1e-9));
  }
  is(`${label}: at least two equations checked`, n >= 2);
}
substitute('Beyond Example 13', bEx[13], 'x');
substitute('Beyond Example 14', bEx[14], 'x');
substitute('key 25', beyond.match(/work__label">25<\/span>[\s\S]*?<\/div>/)[0], 'p');
substitute('ANSWERS.md practice 25', mdPractice25(), 'p');
function mdPractice25() { const s = answersMd.slice(answersMd.indexOf('The working for each')); return s.match(/\n25\. [\s\S]*?(?=\n26\. )/)[0]; }

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] = m[2];
const optsOf = (n) => [...(qs[n] || '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => norm(x[1]).trim());
const key = {};
{
  const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of norm(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2];
}
const solve = {
  1: eqF(P(DIE, x => x < 3)),
  2: eqF(P('EXAMINATION'.split(''), c => 'AEIOU'.includes(c))),
  3: eqF(P(range(1, 30), isPrime)),
  4: eqF(P(COINS(2), s => !s.includes('H'))),
  5: eqF(P(DECK, c => (c.r === 'A' && !c.red) || (c.r === 'K' && c.red))),
  6: eqF(P(bag({ red: 4, white: 5, black: 6 }), c => c !== 'white')),
  7: null,
  8: eqF(P(DICE, ([a, b]) => a !== b)),
  9: eqF(P(range(1, 25), x => x % 2 === 0)),
  10: (() => { const [lo, hi] = norm(qs[10] || '').match(/numbered (\d+) to (\d+)/).slice(1).map(Number);
    const cards = range(lo, hi);
    is('Q10: the distractors are multiples of 2, of 3, and of 2 or 3', JSON.stringify(optsOf(10).slice(0, 3)) === JSON.stringify([P(cards, x => x % 2 === 0), P(cards, x => x % 3 === 0), P(cards, x => x % 2 === 0 || x % 3 === 0)]));
    return eqF(P(cards, x => x % 2 === 0 && x % 3 === 0)); })(),
  11: (o) => { const asha = P(DIE, x => x % 3 === 0) === '1/3', ravi = P(DIE, x => 6 % x !== 0) === '1/3';
    return o === (asha && ravi ? 'both' : asha ? 'only Asha' : ravi ? 'only Ravi' : 'neither'); },
};
{ const o = optsOf(7).map(Number); const min = Math.min(...o); solve[7] = (s) => Number(s) === min && min < 0.01; }
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  ok(`Q${q}: the right option`, letterOf(o, f), [key[q]]);
}
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const AR = {
  12: [P(DICE, ([a, b]) => a * b === 13) === '0', [0, 1].every(v => v >= 0 && v <= 1), false],
  13: [P(week, d => d === 'Sun' || d === 'Mon') === '1/7', true, false],
  14: [P(DECK, c => !c.red) === '1/2', DECK.filter(c => !c.red).length === 26, true],
  15: [P(bag({ red: 4, green: 5 }), c => c === 'red') === '4/9', 4 === 5, false],
};
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
{ const txt = (n) => norm(qs[n] || '');
  is('Q13 prints 1/7', /1\/7/.test(txt(13))); is('Q15 prints 4/9 and 4 red, 5 green', /4\/9/.test(txt(15)) && /4 red and 5 green/.test(txt(15))); }
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-15', Object.keys(key).map(Number).sort((a, b) => a - b), range(1, 15));
ok('practice numbered 1-30', [...beyond.matchAll(/data-start="(\d+)"/g)].map(m => Number(m[1])), range(2, 30));
// the why-rows agree with the key
for (const m of beyond.slice(beyond.indexOf('Why the other options')).matchAll(/work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) {
  const q = m[1], t = norm(m[2]);
  const letter = t.match(/\(([a-d])\)\.\s*$/);
  if (letter) ok(`why-row ${q} names the key letter`, letter[1], key[q]);
  const f = t.match(/(\d+\/\d+)\.\s*Option/);
  if (f) is(`why-row ${q}: ${f[1]} is option (${key[q]})`, optsOf(q)['abcd'.indexOf(key[q])] === f[1] || F(...f[1].split('/').map(Number)) === optsOf(q)['abcd'.indexOf(key[q])]);
}

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
{ const at = answersMd.indexOf('as the key prints it');
  for (const m of answersMd.slice(at, at + 300).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2]; }
ok('ANSWERS.md key matches the page', mdKey, key);
const mdPractice = answersMd.slice(answersMd.indexOf('The working for each'));
for (const [q, list] of Object.entries(PR)) for (const [p, v] of list) mdSays(mdPractice, 'practice', q, p, v);
for (const q of [1, 2, 3, 4, 5, 6, 8, 9, 10]) {
  const want = optsOf(q)['abcd'.indexOf(key[q])];
  mdSays(mdPractice, 'practice', q, '', want);
}
{ const md1 = norm(answersMd.slice(answersMd.indexOf('### Stage 1'), answersMd.indexOf('### Stage 3')));
  for (const v of ['3/4', '7/13', '3/8', '18', '1/3']) is(`ANSWERS.md Stage 1 should say ${v}`, has(md1, v));
  ok('ANSWERS.md Stage 1 matches the page', ['3/4', '7/13', '3/8', '18', '1/3'].every((v, i) => has(tries[i], v)), true); }

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
