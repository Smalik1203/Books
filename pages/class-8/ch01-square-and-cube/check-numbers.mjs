#!/usr/bin/env node
/* Re-derive the numbers this chapter prints.

     node pages/class-8/ch01-square-and-cube/check-numbers.mjs

   Rewritten on 26 September 2026 for the maths-v2 conversion (summary
   page, By the Book in six forms, Beyond the Book by format), on the model
   of Class 6 Chapter 1's. The version before it checked the old body,
   the locker corridor and the old Beyond stages; it is in git history.

   A  every arithmetic identity set as maths ($…$) on every page and in
      ANSWERS.md, with \cdots sums expanded
   B  the key is complete: By the Book 1–50, Beyond practice 1–15, and
      every solved example ends in an Answer row
   C  every single-correct question in By the Book and Beyond: the right
      value is computed here, and the option the key names must print it
   D  the numerical answers in Beyond's key, recomputed

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
const strip = t => [['times', '*'], ['div', '/'], ['thinsp', ''], [',', ''], [';', ''], [' ', ''], ['left', ''], ['right', '']]
  .reduce((s, [k, v]) => s.split(B + k).join(v), t);
// a + b + \cdots + z, where the terms before the dots set the step
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
    const js = expand(strip(m[1]).replace(/−/g, '-').replace(/\s+/g, ''));
    if (!js.includes('=') || js.includes(B)) continue;
    const sides = js.split('=').filter(s => s !== '');
    if (sides.length < 2 || sides.some(s => !/^[\d+\-*/().]+$/.test(s))) continue;
    const vals = sides.map(s => Function(`return (${s})`)());
    ok(`${label}: $${m[1]}$`, vals.every(v => Math.abs(v - vals[0]) < 1e-9), vals.join(' vs '));
  }
};
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
const beyond = new Set([...numbered(beyondKey), ...[...beyondList.matchAll(/(?:^|;)\s*(\d+)\s+[(\d]/g)].map(m => +m[1])]);
for (let n = 1; n <= 15; n++) ok(`Beyond key has ${n}`, beyond.has(n));
const beyondPages = PAGES.filter(f => /^p1/.test(f)).map(f => HTML[f]).join('\n');
const examples = [...beyondPages.matchAll(/c-example__tab">Example (\d+)<[\s\S]*?(?=c-example__tab"|c-stage__title">Answers|$)/g)];
ok('Beyond has 10 solved examples', examples.length === 10, `found ${examples.length}`);
for (const e of examples) ok(`Example ${e[1]} ends in an Answer row`, /work__label">Answer</.test(e[0]));

/* ---- C: single-correct questions, recomputed ------------------------ */
const factorise = n => { const o = {}; for (let d = 2; d * d <= n; d++) while (n % d === 0) { o[d] = (o[d] || 0) + 1; n /= d; } if (n > 1) o[n] = (o[n] || 0) + 1; return o; };
const mulTo = (n, p) => Object.entries(factorise(n)).reduce((k, [q, e]) => k * Number(q) ** ((p - e % p) % p), 1);
const isCube = n => Math.round(Math.cbrt(n)) ** 3 === n;
const odd = n => 2 * n - 1;
const BOARD_MCQ = {
  41: Math.sqrt(1225),
  42: [216, 256, 196, 625].find(isCube),
  43: mulTo(180, 2),
  44: Math.sqrt(2401),
  45: 2 * 45,
  46: odd(Math.sqrt(576)),
  47: `${343 % 10} and ${512 % 10}`,
  50: -Math.round(Math.cbrt(3375)),
};
let squares = 0; for (let k = 1; k * k < 2000; k++) if (k * k > 1000) squares++;
const BEYOND_MCQ = {
  1: squares,
  2: mulTo(12, 3),
  3: 25 * 25 - 20 * 20,
  4: `${String(Math.ceil(Math.sqrt(100000))).length} digits`,
};
const letter = s => 'abcd'.indexOf(s);
const clean = s => s.replace(/\$/g, '').trim();
const questionOptions = (html, n) => {
  const start = n === 1 ? html.search(/<ol class="c-questions">/) : html.indexOf(`data-start="${n}"`);
  if (start < 0) return null;
  const chunk = html.slice(start, html.indexOf('</li>\n', start) + 5);
  const opts = chunk.match(/c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/);
  return opts ? [...opts[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => clean(m[1])) : null;
};
const boardPages = PAGES.filter(f => /^p09/.test(f)).map(f => HTML[f]).join('\n');
const boardLetters = Object.fromEntries([...boardKey.matchAll(/class="n">(\d+)<\/span> \((\w)\)/g)].map(m => [+m[1], m[2]]));
for (const [q, want] of Object.entries(BOARD_MCQ)) {
  const opts = questionOptions(boardPages, +q), l = boardLetters[q];
  ok(`By the Book Q${q}: key (${l}) prints ${want}`, !!(opts && l && opts[letter(l)] === String(want)), opts ? `option is "${opts[letter(l)]}"` : 'options not found');
}
const practice = beyondPages.slice(0, beyondPages.indexOf('c-stage__title">Answers'));
const beyondLetters = Object.fromEntries([...beyondList.matchAll(/(\d+) \((\w)\)/g)].map(m => [+m[1], m[2]]));
for (const [q, want] of Object.entries(BEYOND_MCQ)) {
  const opts = questionOptions(practice, +q), l = beyondLetters[q];
  ok(`Beyond Q${q}: key (${l}) prints ${want}`, !!(opts && l && opts[letter(l)] === String(want)), opts ? `option is "${opts[letter(l)]}"` : 'options not found');
}

/* ---- D: Beyond's numerical answers ---------------------------------- */
let sixth = 0; for (let k = 1; k ** 6 < 5000; k++) sixth++;
const NUMERIC = { 9: Math.ceil(Math.sqrt(1000)) ** 2 - 1000, 10: mulTo(540, 3), 11: sixth };
for (const [q, want] of Object.entries(NUMERIC))
  ok(`Beyond Q${q} key is ${want}`, new RegExp(`(^|;)\\s*${q}\\s+${want}(\\s|&|$)`).test(beyondList), beyondList.slice(0, 80));

console.log(`${checks} checks, ${fails} failed`);
process.exit(fails ? 1 : 0);
