#!/usr/bin/env node
/* Re-derive the numbers this chapter prints.

     node pages/class-6/math-ch02-lines-and-angles/check-numbers.mjs

   Rewritten on 26 September 2026 for the maths-v2 chapter (summary page,
   By the Book in six forms, Beyond the Book by format). The version before
   it (1130 lines, 530 checks) measured a layout that no longer exists —
   its Beyond "Type" examples, its practice run of 29 and page-bound figure
   references — and is in git history. Its figure checks (every drawn angle
   read from the SVG coordinates) covered Figs 2.10–2.63, which did not
   change in this conversion except in size.

   A  every arithmetic identity set as maths ($…$) on every page and in
      ANSWERS.md, degrees included ($180^\circ - 65^\circ = 115^\circ$)
   B  the key is complete: By the Book 1–50, Beyond practice 1–15, and
      every solved example ends in an Answer row
   C  every single-correct question in By the Book and Beyond: the right
      value is computed here, and the option the key names must print it
   D  the assertion–reason and multi-correct keys, recomputed from the
      truth of each statement

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
const strip = t => [['^' + B + 'circ', ''], ['times', '*'], ['div', '/'], ['thinsp', ''], [',', ''], [';', ''], [' ', ''], ['left', ''], ['right', '']]
  .reduce((s, [k, v]) => s.split(k.startsWith('^') ? k : B + k).join(v), t);
const identities = (label, text) => {
  for (const m of text.matchAll(/\$([^$]+)\$/g)) {
    const js = strip(m[1]).replace(/−/g, '-').replace(/\s+/g, '');
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
ok('the Answers stage exists', keyStart >= 0);
ok('the Answers stage opens its page', /^\s*<div class="c-stage">/.test(HTML[PAGES[keyStart]].split('<div class="page__main">')[1]));
const key = PAGES.slice(keyStart).map(f => HTML[f]).join('\n');
const [boardKey, beyondKey] = key.split('c-practice__sub">Beyond the Book');
const numbered = s => new Set([...s.matchAll(/work__label">(\d+)<|class="n">(\d+)</g)].map(m => +(m[1] || m[2])));
const board = numbered(boardKey);
for (let n = 1; n <= 50; n++) ok(`By the Book key has ${n}`, board.has(n));
const beyondList = (beyondKey.match(/c-answers__list">([^<]*)</) || [, ''])[1];
const beyond = new Set([...numbered(beyondKey), ...[...beyondList.matchAll(/(?:^|&nbsp;)\s*(\d+)\s+[(\d]/g)].map(m => +m[1])]);
for (let n = 1; n <= 15; n++) ok(`Beyond key has ${n}`, beyond.has(n));
const boardPages = PAGES.filter(f => /^p09/.test(f)).map(f => HTML[f]).join('\n');
const beyondPages = PAGES.filter(f => /^p1/.test(f)).map(f => HTML[f]).join('\n');
const qs = html => [...html.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>/g)].map(m => +(m[1] || 1));
ok('By the Book numbers 1–50 in order', JSON.stringify(qs(boardPages)) === JSON.stringify([...Array(50)].map((_, i) => i + 1)));
const practice = beyondPages.slice(0, beyondPages.indexOf('c-stage__title">Answers'));
ok('Beyond practice numbers 1–15 in order', JSON.stringify(qs(practice)) === JSON.stringify([...Array(15)].map((_, i) => i + 1)));
const examples = [...beyondPages.matchAll(/c-example__tab">Example (\d+)<[\s\S]*?(?=c-example__tab"|c-stage__title">Answers|$)/g)];
ok('Beyond has 10 solved examples', examples.length === 10, `found ${examples.length}`);
for (const e of examples) ok(`Example ${e[1]} ends in an Answer row`, /work__label">Answer</.test(e[0]));
ok('By the Book has its six parts in order',
  [...boardPages.matchAll(/c-practice__sub">([^<]+)</g)].map(m => m[1]).join('|') ===
  'Very short answer|Short answer|Long answer|Assertion and reason|Case-based questions|Objective questions');
ok('Beyond has its five parts in order',
  [...practice.matchAll(/c-practice__sub">([^<]+)</g)].map(m => m[1]).join('|') ===
  'Single correct|More than one correct|Numerical answer|Matching|Paragraph-based');

/* ---- C: single-correct questions, recomputed ------------------------ */
const deg = v => `$${v}^${B}circ$`;
const BOARD_MCQ = {
  41: '1',                             // a ray has one end point
  42: 'right',
  43: deg(360 / 4 * 3),
  44: '$Y$',
  45: deg(180 / 4),                    // AOC = 3 COB, so 4 COB = 180
  46: deg(360 - 300),
  47: String(360 / 40),
  48: deg(65),                         // the arm is on the inner 0: read the inner scale
  49: '(i) and (iii)',
  50: `No: $2 ${B}times 50^${B}circ = 100^${B}circ$ is obtuse.`,
};
const BEYOND_MCQ = {
  1: deg(20 * 2 * 2),
  2: deg(360 / 6),
  3: deg(3 * 180 / 5),
  4: deg(3 * 90 - 45),
};
const letter = s => 'abcd'.indexOf(s);
const questionOptions = (html, n) => {
  const start = n === 1 ? html.search(/<ol class="c-questions">/) : html.indexOf(`data-start="${n}"`);
  if (start < 0) return null;
  const chunk = html.slice(start, html.indexOf('</li>\n', start) + 5);
  const opts = [...chunk.matchAll(/c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/g)].pop();
  return opts ? [...opts[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1].trim()) : null;
};
const boardLetters = Object.fromEntries([...boardKey.matchAll(/class="n">(\d+)<\/span> \((\w)\)/g)].map(m => [+m[1], m[2]]));
for (const [q, want] of Object.entries(BOARD_MCQ)) {
  const opts = questionOptions(boardPages, +q), l = boardLetters[q];
  ok(`By the Book Q${q}: key (${l}) prints ${want}`, !!(opts && l && opts[letter(l)] === want), opts ? `option is "${opts[letter(l)]}"` : 'options not found');
  if (opts) ok(`By the Book Q${q}: exactly one option prints the answer`, opts.filter(o => o === want).length === 1);
}
const beyondLetters = Object.fromEntries([...beyondList.matchAll(/(\d+) \((\w)\)(?! ?,)/g)].map(m => [+m[1], m[2]]));
for (const [q, want] of Object.entries(BEYOND_MCQ)) {
  const opts = questionOptions(practice, +q), l = beyondLetters[q];
  ok(`Beyond Q${q}: key (${l}) prints ${want}`, !!(opts && l && opts[letter(l)] === want), opts ? `option is "${opts[letter(l)]}"` : 'options not found');
  if (opts) ok(`Beyond Q${q}: exactly one option prints the answer`, opts.filter(o => o === want).length === 1);
}
// the letters spread over (a)-(d)
const spread = Object.values(boardLetters).filter((_, i) => true);
const count = l => [41, 42, 43, 44, 45, 46, 47, 48, 49, 50].filter(q => boardLetters[q] === l).length;
ok('By the Book objective letters use all four', ['a', 'b', 'c', 'd'].every(l => count(l) >= 2), ['a', 'b', 'c', 'd'].map(count).join('/'));

/* ---- D: assertion-reason and multiple correct ----------------------- */
const code = (A, R, explains) => !A && R ? 'd' : A && !R ? 'c' : A && R ? (explains ? 'a' : 'b') : '?';
const AR = {
  31: code(250 > 180 && 250 < 360, true, true),
  32: code(true, true, true),                   // equal turns, any arm lengths
  33: code(360 / 2 === 180, 360 / 4 === 90, false),
  34: code([91, 120, 179].every(a => a / 2 < 90), [20, 44].every(a => 2 * a > 90), false),
  35: code(false, true, false),                 // through two points there is exactly one line
};
for (const [q, want] of Object.entries(AR)) ok(`By the Book Q${q}: key is (${want})`, boardLetters[q] === want, `key (${boardLetters[q]})`);

const truths = arr => arr.map((t, i) => t ? '(' + 'abcd'[i] + ')' : null).filter(Boolean).join(', ');
const MULTI = {
  5: truths([210 > 180 && 210 < 360, 210 < 180, 210 + 150 === 360, 210 - 180 === 30]),
  6: truths([170 / 2 < 90, 2 * 50 < 90, 180 / 3 < 90, 360 / 4 < 90]),
  7: truths([4 * 3 / 2 === 6, 1 + 3 === 4, true, false]),
  8: truths([90 / 3 === 30, 90 / 3 * 2 === 60, 90 / 3 * 2 > 90, false]),
};
for (const [q, want] of Object.entries(MULTI)) ok(`Beyond Q${q}: key is ${want}`, beyondList.includes(`${q} ${want}`), beyondList);
const EX_MULTI = {
  3: truths([124 < 90, 124 > 90 && 124 < 180, 124 / 2 === 62, 124 - 90 === 24]),
  4: truths([180 - 42 - 68 === 70, Math.max(42, 68, 70) > 90, [42, 68, 70].every(a => a < 90), 42 + 68 === 110]),
};
for (const [n, want] of Object.entries(EX_MULTI)) {
  const e = examples.find(x => x[1] === n);
  ok(`Beyond Example ${n}: answer is ${want}`, !!e && e[0].includes(`work__label">Answer</span><span>${want}<`));
}
const NUMERIC = { 9: 360 / 8, 10: (180 - 60) / 4 + 30, 11: 234 / 6 };
for (const [q, want] of Object.entries(NUMERIC)) ok(`Beyond Q${q}: key is ${want}`, beyondList.includes(`${q} ${want} `) || beyondList.endsWith(`${q} ${want}`), beyondList);

// matching: the keyed option must print the combination worked out here
const combo = map => Object.entries(map).map(([k, v]) => `${k}&ndash;${v}`).join(', ');
const MATCH = {
  12: combo({ P: [45, 270, 180, 360, 90].indexOf(4 * 90) + 1, Q: [45, 270, 180, 360, 90].indexOf(2 * 90) + 1, R: [45, 270, 180, 360, 90].indexOf(90 / 2) + 1, S: [45, 270, 180, 360, 90].indexOf(3 * 90) + 1 }),
  13: combo({ P: [60, 72, 36, 45, 30].indexOf(360 / 10) + 1, Q: [60, 72, 36, 45, 30].indexOf(360 / 8) + 1, R: [60, 72, 36, 45, 30].indexOf(360 / 6) + 1, S: [60, 72, 36, 45, 30].indexOf(360 / 5) + 1 }),
};
for (const [q, want] of Object.entries(MATCH)) {
  const opts = questionOptions(practice, +q), l = beyondLetters[q];
  ok(`Beyond Q${q}: key (${l}) is ${want}`, !!(opts && l && opts[letter(l)] === want), opts ? `option is "${opts[letter(l)]}"` : 'options not found');
}
const EX_MATCH = {
  7: combo({ P: 4, Q: 3, R: 1, S: 2 }),      // 89 acute, 90 right, 179 obtuse, 181 reflex
  8: combo({ P: [45, 213, 62, 67].indexOf(360 - 147) + 1, Q: [45, 213, 62, 67].indexOf(360 / 8) + 1, R: [45, 213, 62, 67].indexOf(180 - 113) + 1, S: [45, 213, 62, 67].indexOf(90 - 28) + 1 }),
};
for (const [n, want] of Object.entries(EX_MATCH)) {
  const e = examples.find(x => x[1] === n);
  ok(`Beyond Example ${n}: answer is ${want}`, !!e && e[0].includes(want + '</span></div>'));
}

console.log(`${checks} checks, ${fails} failed`);
process.exit(fails ? 1 : 0);
