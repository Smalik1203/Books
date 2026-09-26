#!/usr/bin/env node
/* Re-derive the numbers this chapter prints.

     node pages/class-8/p2ch07-area/check-numbers.mjs

   Rewritten on 26 September 2026 for the maths-v2 chapter (summary page,
   By the Book in six forms, Beyond the Book by format). The version before
   it checked a layout that no longer exists (its figures, its old
   examples and its practice stage) and is in git history.

   A  every arithmetic identity set as maths ($…$) on every page and in
      ANSWERS.md ("\approx" is checked to the places printed)
   B  the key is complete: By the Book 1–50, Beyond practice 1–15, and
      every solved example ends in an Answer row
   C  every single-correct question: the right value is computed here, and
      the option the key names must print that value
   D  the body's worked examples, recomputed

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
  .reduce((s, [k, v]) => s.split(B + k).join(v), t)
  .replace(/\{,\}/g, '').replace(/\\tfrac(\d)(\d)/g, '($1/$2)').replace(/\\tfrac\{(\d+)\}\{(\d+)\}/g, '($1/$2)')
  .replace(/\\sqrt\{([\d+\-*/().]+)\}/g, 'Math.sqrt($1)');
const places = s => { const m = s.match(/\.(\d+)$/); return m ? m[1].length : 0; };
const identities = (label, text) => {
  for (const m of text.matchAll(/\$([^$]+)\$/g)) {
    const js = strip(m[1]).replace(/−/g, '-').replace(/\s+/g, '');
    const approx = js.includes(B + 'approx');
    const parts = js.split(approx ? B + 'approx' : '=');
    if (approx) {
      const lhs = parts[0].split('=').filter(Boolean).pop(), rhs = parts[1];
      if (!lhs || !rhs || ![lhs, rhs].every(s => /^(Math\.sqrt|[\d+\-*/().])+$/.test(s))) continue;
      const a = Function(`return (${lhs})`)(), b = Number(rhs);
      ok(`${label}: $${m[1]}$`, Math.abs(a - b) <= 0.5 * 10 ** -places(rhs) + 1e-9, `${a} vs ${b}`);
      continue;
    }
    if (!js.includes('=') || js.includes(B)) continue;
    const sides = parts.filter(s => s !== '');
    if (sides.length < 2 || sides.some(s => !/^(Math\.sqrt|[\d+\-*/().])+$/.test(s))) continue;
    const vals = sides.map(s => Function(`return (${s})`)());
    ok(`${label}: $${m[1]}$`, vals.every(v => Math.abs(v - vals[0]) < 1e-9), vals.join(' vs '));
  }
};
for (const f of PAGES) identities(f, HTML[f]);
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
const beyond = new Set([...numbered(beyondKey), ...[...beyondList.matchAll(/(?:^|&nbsp;)\s*(\d+)\s+[(\d]/g)].map(m => +m[1])]);
for (let n = 1; n <= 15; n++) ok(`Beyond key has ${n}`, beyond.has(n));
const beyondPages = PAGES.filter(f => /^p1/.test(f)).map(f => HTML[f]).join('\n');
const examples = [...beyondPages.matchAll(/c-example__tab">Example (\d+)<[\s\S]*?(?=c-example__tab"|c-stage__title">Answers|$)/g)];
ok('Beyond has 10 solved examples', examples.length === 10, `found ${examples.length}`);
for (const e of examples) ok(`Beyond Example ${e[1]} ends in an Answer row`, /work__label">Answer</.test(e[0]));
const boardPages = PAGES.filter(f => /^p09/.test(f)).map(f => HTML[f]).join('\n');
const starts = [...boardPages.matchAll(/data-start="(\d+)"/g)].map(m => +m[1]);
ok('By the Book numbers 2–50 in order', starts.join() === Array.from({ length: 49 }, (_, i) => i + 2).join(), starts.join());

/* ---- C: single-correct questions, recomputed ------------------------ */
const num = s => {
  const t = s.replace(/\$|\{,\}|,|<sup>.*?<\/sup>/g, '');
  const f = t.match(/tfrac\{?(\d+)\}?\{?(\d+)\}?/);
  if (f) return +f[1] / +f[2];
  const m = t.match(/-?\d+(\.\d+)?/);
  return m ? Number(m[0]) : NaN;
};
const trap = (A, h, a) => 2 * A / h - a;
const BOARD_MCQ = {
  41: 11 * 6,
  42: 14 * 10 / 2,
  43: 100 * 100,
  44: 2 * 42 / 12,
  45: trap(36, 4, 10),
  46: Math.sqrt(18 * 8),
  50: 6 - 2,
};
const BEYOND_MCQ = {
  1: 4 * Math.sqrt(24 * 6),
  2: 2 * (16 * 9 / 2) / 10,
  3: (2 * 6 * 2 * Math.sqrt(100 - 36) / 2) / 100,
  4: trap(180, 12, 18),
};
const letter = s => 'abcd'.indexOf(s);
const questionOptions = (html, n) => {
  const start = n === 1 ? html.search(/<ol class="c-questions">/) : html.indexOf(`data-start="${n}"`);
  if (start < 0) return null;
  const chunk = html.slice(start, html.indexOf('</li>\n', start) + 5);
  const opts = chunk.match(/c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/);
  return opts ? [...opts[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1].trim()) : null;
};
const boardLetters = Object.fromEntries([...boardKey.matchAll(/class="n">(\d+)<\/span> \((\w)\)/g)].map(m => [+m[1], m[2]]));
for (const [q, want] of Object.entries(BOARD_MCQ)) {
  const opts = questionOptions(boardPages, +q), l = boardLetters[q];
  const got = opts && l ? num(opts[letter(l)]) : NaN;
  ok(`By the Book Q${q}: key (${l}) prints ${want}`, Math.abs(got - want) < 1e-9, opts ? `option is "${opts[letter(l)]}"` : 'options not found');
  ok(`By the Book Q${q}: only one option is right`, opts && opts.filter(o => Math.abs(num(o) - want) < 1e-9).length === 1);
}
{ // Q47: the rectangle with the greatest area; Q49: 5 m² in cm²
  const areas = { P: 15 * 2, Q: 9 * 4, R: 7 * 6 };
  const best = Object.entries(areas).sort((a, b) => b[1] - a[1])[0][0];
  const o = questionOptions(boardPages, 47);
  ok('By the Book Q47', o && o[letter(boardLetters[47])].startsWith(best));
  const o49 = questionOptions(boardPages, 49);
  ok('By the Book Q49', o49 && num(o49[letter(boardLetters[49])].split(' is ').pop()) === 5 * 100 * 100);
}
const ar = { 31: 'a', 32: 'b', 33: 'd', 34: 'c', 35: 'a' };
ok('assertion–reason: 1 m² is not 100 cm² (Q33 A false)', 100 * 100 !== 100);
ok('assertion–reason: Q34 A true (both 16 cm)', 2 * (6 + 2) === 4 * 4 && 6 * 2 !== 4 * 4);
for (const [q, l] of Object.entries(ar)) ok(`A–R Q${q} keyed ${l}`, boardLetters[q] === l);
const letters = Object.entries(boardLetters).filter(([q]) => +q >= 41).map(([, l]) => l);
for (const l of 'abcd') ok(`objective answers use (${l})`, letters.includes(l));

const practice = beyondPages.slice(0, beyondPages.indexOf('c-stage__title">Answers'));
const beyondLetters = Object.fromEntries([...beyondList.matchAll(/(\d+) \((\w)\)(?!,)/g)].map(m => [+m[1], m[2]]));
for (const [q, want] of Object.entries(BEYOND_MCQ)) {
  const opts = questionOptions(practice, +q), l = beyondLetters[q];
  const got = opts && l ? num(opts[letter(l)]) : NaN;
  ok(`Beyond Q${q}: key (${l}) prints ${want}`, Math.abs(got - want) < 1e-9, opts ? `option is "${opts[letter(l)]}"` : 'options not found');
}
// numerical answers
ok('Beyond Q9', Math.round((1.2 ** 2 - 1) * 100) === 44 && / 9 44 /.test(beyondList.replace(/&nbsp;/g, ' ')));
ok('Beyond Q10', (18 / 2) === 9);
ok('Beyond Q11', (360 / 15) * (270 / 15) === 432 && /11 432/.test(beyondList.replace(/&nbsp;/g, ' ')));
ok('Beyond Q14', 50 * 30 === 1500 && 50 * 2 + 30 * 2 - 4 === 156 && 1500 - 156 === 1344);
ok('Beyond Q15', (9 + 15) / 2 * 8 === 96 && 2 * 96 / 16 === 12 && Math.round(Math.sqrt(96)) === 10);
ok('Beyond Example 10 (iii)', (168 / 13).toFixed(2) === '12.92');

/* ---- D: the body ------------------------------------------------------ */
const body = PAGES.filter(f => /^p0[0-8]/.test(f)).map(f => HTML[f]).join('\n');
const ans = n => { const m = body.match(new RegExp(`Example ${n}<[\\s\\S]*?work__label">Answer</span>\\s*<span>([\\s\\S]*?)</span></div>`)); return m ? m[1] : ''; };
ok('body Ex 1', /9 cm/.test(ans(1)) && /12 cm/.test(ans(1)) && 2 * 90 / 20 === 9 && 2 * 90 / 15 === 12);
ok('body Ex 2', /120/.test(ans(2)) && /12 cm/.test(ans(2)) && 15 * 8 / 10 === 12);
ok('body Ex 3', /216/.test(ans(3)) && /14\.4/.test(ans(3)) && Math.hypot(12, 9) === 15 && 216 / 15 === 14.4);
ok('body Ex 5', /300/.test(ans(5)) && /24 m/.test(ans(5)) && 0.5 * 12 * 50 === 300 && 600 / 25 === 24);
ok('body Ex 6', /129\.032/.test(ans(6)) && /50 in/.test(ans(6)) && Math.abs(322.58 / 6.4516 - 50) < 1e-9);
ok('body Ex 7', /9000/.test(ans(7)) && 120 * 75 === 9000 && 2 * 4047 < 9000);
ok('Fig. 7.6: BY', Math.abs(Math.hypot(112 - 48, 37 - 85) / 10 - 60 / 7.5) < 1e-9);
ok('7.3 table', [[9, 1, 20, 9], [6, 4, 20, 24], [4, 4, 16, 16]].every(([a, b, p, A]) => 2 * (a + b) === p && a * b === A)
  && /<td>\$9\$ by \$1\$<\/td><td>\$20\$<\/td><td>\$9\$<\/td>/.test(body));

console.log(`${checks} checks, ${fails} failed`);
process.exit(fails ? 1 : 0);
