#!/usr/bin/env node
/* Re-derive the numbers this chapter prints.

     node pages/class-8/p2ch01-percentages/check-numbers.mjs

   Rewritten on 26 September 2026 for the maths-v2 chapter (our own
   contexts in the body, a Summary page, By the Book in six forms, Beyond
   the Book by format). The version before it checked a layout and a set
   of numbers that no longer exist; it is in git history.

   A  every arithmetic identity set as maths ($…$) on every page and in
      ANSWERS.md. Fractions, per cent signs, thousands separators and
      multipliers are read; a side printed with k decimal places may be
      rounded to k places, and \approx allows the same rounding
   B  the key is complete: By the Book 1–50, Beyond practice 1–15, and
      every solved example ends in an Answer row
   C  every single-correct question with a computable answer: the right
      value is computed here, and the option the key names must print it

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

/* ---- A: identities -------------------------------------------------- */
const FRAC = new RegExp(B + B + '[dt]?frac\\{([^{}]*)\\}\\{([^{}]*)\\}', 'g');
const FRAC_SHORT = new RegExp(B + B + '[dt]?frac(\\d)(\\d)', 'g');
function toJs(t) {
  let s = t.split(B + 'approx').join('=');
  s = s.replace(FRAC, '(($1)/($2))').replace(FRAC_SHORT, '(($1)/($2))');
  for (const [k, v] of [['times', '*'], ['div', '/'], ['%', ''], ['left', ''], ['right', ''], [',', ''], [';', ''], [' ', ''], ['!', '']])
    s = s.split(B + k).join(v);
  s = s.replace(/\{,\}/g, '').replace(/[{}]/g, '').replace(/−/g, '-').replace(/\s+/g, '');
  // implicit multiplication after a closing bracket or before an opening one
  s = s.replace(/\)\(/g, ')*(').replace(/(\d)\(/g, '$1*(');
  return s;
}
const places = s => { const m = s.match(/^-?\d+\.(\d+)$/); return m ? m[1].length : null; };
// a side printed as n% may be read as n or as n/100: "3/5 = 60%" and
// "3/5 x 100 = 60" are both how this chapter writes it
const readings = (raw, v) => (raw.split(B + '%').length > 1 ? [v, v / 100] : [v]);
const near = (a, b, k) => Math.abs(a - b) < 1e-9
  || (k !== null && (Math.abs(Number(a.toFixed(k)) - b) < 1e-9 || Math.abs(Number(b.toFixed(k)) - a) < 1e-9));
function identities(label, text) {
  for (const m of text.matchAll(/\$([^$]+)\$/g)) {
    const t = m[1];
    if (!t.includes('=') && !t.includes(B + 'approx')) continue;
    // "$20\%$ of $150 = ...$": the span continues a phrase, so its first
    // side is not the whole of what is said
    if (/\bof\s*$/.test(text.slice(Math.max(0, m.index - 6), m.index))) continue;
    const rawSides = t.split(B + 'approx').join('=').split('=').filter(s => s.trim() !== '');
    const js = toJs(t.replace(/(\d)\s*(\\[dt]?frac)/g, '$1+$2'));
    if (js.includes(B)) continue;
    const sides = js.split('=').filter(s => s !== '');
    if (sides.length < 2 || sides.length !== rawSides.length || sides.some(s => !/^[\d+\-*/().^]+$/.test(s))) continue;
    let vals;
    try { vals = sides.map(s => Function(`return (${s.replace(/\^/g, '**')})`)()); } catch { continue; }
    const opts = vals.map((v, i) => readings(rawSides[i], v));
    const good = opts[0].some(a => opts.every((o, i) => o.some(v => near(a, v, places(sides[i]) ?? places(sides[0])))));
    ok(`${label}: $${t}$`, good, vals.join(' vs '));
  }
}
for (const f of PAGES) identities(f, HTML[f]);
identities('ANSWERS.md', ANSWERS);

/* ---- B: the key is complete ----------------------------------------- */
const keyStart = PAGES.findIndex(f => HTML[f].includes('c-stage__title">Answers'));
const key = PAGES.slice(keyStart).map(f => HTML[f]).join('\n');
const [boardKey, beyondKey] = key.split('c-practice__sub">Beyond the Book');
const numbered = s => new Set([...s.matchAll(/work__label">(\d+)<|class="n">(\d+)</g)].map(m => +(m[1] || m[2])));
const board = numbered(boardKey);
for (let n = 1; n <= 50; n++) ok(`By the Book key has ${n}`, board.has(n));
const beyondList = (beyondKey.match(/c-answers__list">([^<]*)</) || [, ''])[1];
const beyond = new Set([...numbered(beyondKey), ...[...beyondList.matchAll(/(?:^|&nbsp;)\s*(\d+)\s+[(\d]/g)].map(m => +m[1])]);
for (let n = 1; n <= 15; n++) ok(`Beyond key has ${n}`, beyond.has(n));
const beyondPages = PAGES.filter(f => /^p1/.test(f)).map(f => HTML[f]).join('\n');
const examples = [...beyondPages.matchAll(/c-example__tab">Example (\d+)<[\s\S]*?(?=c-example__tab"|c-stage__title">Answers|$)/g)];
ok('Beyond has 10 solved examples', examples.length === 10, `found ${examples.length}`);
for (const e of examples) ok(`Example ${e[1]} ends in an Answer row`, /work__label">Answer</.test(e[0]));
const boardPagesAll = PAGES.filter(f => /^p09/.test(f)).map(f => HTML[f]).join('\n');
const boardQs = new Set([...boardPagesAll.matchAll(/data-start="(\d+)"/g)].map(m => +m[1]));
for (let n = 2; n <= 50; n++) ok(`By the Book prints question ${n}`, boardQs.has(n));

/* ---- C: single-correct questions, recomputed ------------------------ */
const norm = s => s.replace(/<[^>]+>/g, '').replace(/\$/g, '').split(B + '%').join('%')
  .split(B + 'dfrac').join('frac').replace(/[₹,\s]|\{,\}/g, '').replace(/%$/, '');
const r2 = x => String(Math.round(x * 100) / 100);
const BOARD_MCQ = {
  41: r2(7 / 20 * 100),                 // 35
  42: 'frac{9}{25}',                    // 36/100 in lowest terms
  43: r2(42 / 0.3),                     // 140
  44: r2((80 - 60) / 80 * 100),         // 25
  45: r2(1 + 35 / 100),                 // 1.35
  46: r2(22400 / 1.12),                 // 20000
  47: r2(4000 * 1.05 ** 2),             // 4410
  48: [['Hindi', 36 / 40], ['Maths', 68 / 80], ['Science', 44 / 50], ['English', 26 / 30]].sort((a, b) => b[1] - a[1])[0][0],
  50: 'Noitwas' + r2(150 / 1.25) + '.',
};
const BEYOND_MCQ = {
  1: 'increasesby' + r2((1.2 * 0.9 - 1) * 100),   // 8
  2: r2(45 / (0.30 - 0.15)),                     // 300
  3: r2((1 - 0.9 * 0.8) * 100),                  // 28
  4: r2(1120 / (0.58 - 0.42)),                   // 7000
};
const letter = s => 'abcd'.indexOf(s);
const questionOptions = (html, n) => {
  const start = n === 1 ? html.search(/<ol class="c-questions">/) : html.indexOf(`data-start="${n}"`);
  if (start < 0) return null;
  const chunk = html.slice(start, html.indexOf('</li>\n        </ol>', start) + 5);
  const all = [...chunk.matchAll(/c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/g)];
  const opts = all.at(-1);
  return opts ? [...opts[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => norm(m[1])) : null;
};
const boardLetters = Object.fromEntries([...boardKey.matchAll(/class="n">(\d+)<\/span> \((\w)\)/g)].map(m => [+m[1], m[2]]));
for (const [q, want] of Object.entries(BOARD_MCQ)) {
  const opts = questionOptions(boardPagesAll, +q), l = boardLetters[q];
  ok(`By the Book Q${q}: key (${l}) prints ${want}`, !!(opts && l && opts[letter(l)] === String(want)), opts ? `option is "${opts[letter(l)]}"` : 'options not found');
  if (opts) ok(`By the Book Q${q}: only one option prints ${want}`, opts.filter(o => o === String(want)).length === 1);
}
const practice = beyondPages.slice(0, beyondPages.indexOf('c-stage__title">Answers'));
const beyondLetters = Object.fromEntries([...beyondList.matchAll(/(\d+) \((\w)\)(?! ?,)/g)].map(m => [+m[1], m[2]]));
for (const [q, want] of Object.entries(BEYOND_MCQ)) {
  const opts = questionOptions(practice, +q), l = beyondLetters[q];
  ok(`Beyond Q${q}: key (${l}) prints ${want}`, !!(opts && l && opts[letter(l)] === String(want)), opts ? `option is "${opts[letter(l)]}"` : 'options not found');
}

/* ---- C2: the assertion–reason and objective letters are spread ------ */
const ar = [31, 32, 33, 34, 35].map(n => boardLetters[n]);
ok('assertion–reason uses all four letters', new Set(ar).size === 4, ar.join(''));
const obj = [41, 42, 43, 44, 45, 46, 47, 48, 49, 50].map(n => boardLetters[n]);
ok('objective letters are spread (each used 2 or 3 times)', 'abcd'.split('').every(c => { const k = obj.filter(x => x === c).length; return k >= 2 && k <= 3; }), obj.join(''));

console.log(`${checks} checks, ${fails} failed`);
process.exit(fails ? 1 : 0);
