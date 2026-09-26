#!/usr/bin/env node
/* Re-derive the numbers this chapter prints.

     node pages/class-8/ch04-quadrilaterals/check-numbers.mjs

   Rewritten on 26 September 2026 for the maths-v2 chapter (summary page,
   By the Book in six forms, Beyond the Book by format). The version before
   it checked a layout that no longer exists — its 31 board-form practice
   questions, its fifteen Beyond examples and the old exercise sets. It is in
   git history.

   A  every arithmetic identity set as maths ($…$) on every page and in
      ANSWERS.md: degree signs dropped, \times, \div and \frac evaluated;
      anything with a letter in it is skipped
   B  the key is complete: By the Book 1–50, Beyond practice 1–15, and every
      solved example ends in an Answer row
   C  every single-correct question in By the Book and Beyond: the right
      value is computed here from the chapter's rules, and the option the key
      names must print that value
   D  the body's worked examples and a sample of the exercise answers,
      recomputed from the rules

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

/* ---- the rules ------------------------------------------------------ */
const angleSum = n => (n - 2) * 180;
const exterior = n => 360 / n;
const interior = n => 180 - 360 / n;
const diagonals = n => n * (n - 3) / 2;
const fromDiagonals = d => { for (let n = 3; n < 1000; n++) if (diagonals(n) === d) return n; return null; };
const fromSum = s => (s % 180 === 0 ? s / 180 + 2 : null);
const fromExterior = e => (Number.isInteger(360 / e) ? 360 / e : null);

/* ---- A: identities -------------------------------------------------- */
function toJs(tex) {
  let s = tex;
  const frac = new RegExp(B + B + '[dt]?frac\\{([^{}]+)\\}\\{([^{}]+)\\}', 'g');
  s = s.replace(frac, '(($1)/($2))');
  s = s.split('^' + B + 'circ').join('').split('^{' + B + 'circ}').join('');
  s = s.split(B + 'times').join('*').split(B + 'div').join('/').split(B + 'cdot').join('*');
  s = s.split(B + 'left').join('').split(B + 'right').join('');
  s = s.replace(/&nbsp;|&thinsp;|,/g, '').replace(/−/g, '-').replace(/\s+/g, '');
  return s;
}
const identities = (label, text) => {
  for (const m of text.matchAll(/\$([^$]+)\$/g)) {
    const js = toJs(m[1]);
    if (!js.includes('=') || js.includes(B)) continue;
    const sides = js.split('=').filter(x => x !== '');
    if (sides.length < 2 || sides.some(x => !/^[\d+\-*/().]+$/.test(x))) continue;
    let vals;
    try { vals = sides.map(x => Function(`return (${x})`)()); } catch { continue; }
    ok(`${label}: $${m[1]}$`, vals.every(v => Math.abs(v - vals[0]) < 1e-9), vals.join(' vs '));
  }
};
for (const f of PAGES) identities(f, HTML[f]);
identities('ANSWERS.md', ANSWERS);

/* ---- B: the key is complete ----------------------------------------- */
const keyStart = PAGES.findIndex(f => HTML[f].includes('c-stage__title">Answers'));
ok('an Answers stage exists', keyStart >= 0);
const key = PAGES.slice(keyStart).map(f => HTML[f]).join('\n');
const [boardKey, beyondKey = ''] = key.split('c-practice__sub">Beyond the Book');
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
const boardPages = PAGES.filter(f => /^p09/.test(f)).map(f => HTML[f]).join('\n');
ok('By the Book has 50 questions', (boardPages.match(/<ol class="c-questions/g) || []).length === 50);

/* ---- C: single-correct questions, recomputed ------------------------ */
const deg = v => `$${v}^${B}circ$`;
const BOARD_MCQ = {
  41: String(fromDiagonals(77)),
  42: deg(exterior(60)),
  43: String(360 / 6),                                   // x + x + 2x + 2x = 360
  44: deg(180 - 180 / 4),                                // A = 3B, A + B = 180, C = A
  47: deg(360 - (95 + 85 + 110)),
  48: String(fromSum(2160)),
  49: String(360 / 12),                                  // x + 2x + 3x + 3x + 3x = 360
  50: deg((180 - 80) / 2),
};
const BEYOND_MCQ = {
  1: String([...Array(50).keys()].find(n => n >= 3 && diagonals(n) === 3 * n)),
  2: String(diagonals(fromSum(3960))),
  3: deg(110 - 70),                                      // 7 : 11 of 180
};
const letter = s => 'abcd'.indexOf(s);
const questionOptions = (html, n) => {
  const start = n === 1 ? html.search(/<ol class="c-questions">/) : html.indexOf(`data-start="${n}"`);
  if (start < 0) return null;
  const chunk = html.slice(start, html.indexOf('</li>\n', start) + 5);
  const all = [...chunk.matchAll(/c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/g)];
  if (!all.length) return null;
  return [...all.at(-1)[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1].trim());
};
const boardLetters = Object.fromEntries([...boardKey.matchAll(/class="n">(\d+)<\/span> \((\w)\)/g)].map(m => [+m[1], m[2]]));
for (const [q, want] of Object.entries(BOARD_MCQ)) {
  const opts = questionOptions(boardPages, +q), l = boardLetters[q];
  ok(`By the Book Q${q}: key (${l}) prints ${want}`, !!(opts && l && opts[letter(l)] === want), opts ? `option is "${opts[letter(l)]}"` : 'options not found');
}
const practice = beyondPages.slice(0, beyondPages.indexOf('c-stage__title">Answers'));
// practice blocks only: examples carry their own options
const practiceOnly = practice.replace(/<div class="c-example"[\s\S]*?<\/div><\/div><\/div><\/div>/g, '');
const beyondLetters = Object.fromEntries([...beyondList.matchAll(/(\d+) \((\w)\)/g)].map(m => [+m[1], m[2]]));
for (const [q, want] of Object.entries(BEYOND_MCQ)) {
  const opts = questionOptions(practiceOnly, +q), l = beyondLetters[q];
  ok(`Beyond Q${q}: key (${l}) prints ${want}`, !!(opts && l && opts[letter(l)] === want), opts ? `option is "${opts[letter(l)]}"` : 'options not found');
}
// assertion-reason letters and the objective key agree with ANSWERS.md
ok('ANSWERS.md has the assertion-reason key', ANSWERS.includes('31 (a) · 32 (c) · 33 (b) · 34 (d) · 35 (a)'));
const objLine = Object.entries(boardLetters).filter(([n]) => n >= 41).map(([n, l]) => `${n} (${l})`).join(' · ');
ok('ANSWERS.md has the page objective key', ANSWERS.includes(objLine), objLine);

/* ---- D: the body, recomputed ---------------------------------------- */
const body = PAGES.filter(f => /^p0[0-8]/.test(f)).map(f => HTML[f]).join('\n');
const has = (label, s) => ok(label, body.includes(s), s);
has('Example 1', `The fourth angle is $${360 - (72 + 124 + 95)}^${B}circ$`);
has('Example 2', `$n = ${fromSum(1620)}$`);
has('Example 3', `The fourth exterior angle is $${360 - (70 + 95 + 110)}^${B}circ$`);
has('Example 4', `${fromExterior(30)} sides; each interior angle is $${interior(12)}^${B}circ$`);
ok('Example 5: 26 does not divide 360', fromExterior(26) === null);
has('Example 7', `$x = ${(9 + 3) / (4 - 2)}$ and $AB = ${4 * 6 - 3}$ cm`);
has('Example 8', `$${B}angle BAO = ${180 - 90 - 110 / 2}^${B}circ$`);
has('Example 9', `$${B}angle POQ = ${180 - 35 - 35}^${B}circ$ and $${B}angle OQR = ${90 - 35}^${B}circ$`);
// the angle-sum table
for (const [name, n] of [['heptagon', 7], ['octagon', 8], ['nonagon', 9], ['decagon', 10]]) {
  ok(`table: ${name}`, new RegExp(`${name}</span>\\s*<span>\\$${angleSum(n)}\\^`).test(body));
}
// a sample of the exercise answers in ANSWERS.md
const md = (label, s) => ok(`ANSWERS.md ${label}`, ANSWERS.includes(s), s);
md('4.1 Q2', `$\\frac{13 \\times 10}{2} = ${diagonals(13)}$`);
md('4.1 Q5', `**${fromDiagonals(54)}** sides`);
md('4.2 Q3 (iv)', `$3240 \\div 180 = 18$, so\n   **${fromSum(3240)}**`);
md('4.2 Q7', `**${fromExterior(180 - 140)}**`);
md('4.3 Q4', `**${fromExterior(180 - 165)}**`);
md('4.3 Q6', `$360 \\div 45 = ${fromExterior(45)}$`);
md('4.5 Q8', `$y = ${(10 + 25)}$`);
md('4.6 Q8', `$\\angle LKM = (180 - 124) \\div 2 = ${(180 - 124) / 2}$`);

console.log(`${checks} checks, ${fails} failed`);
process.exit(fails ? 1 : 0);
