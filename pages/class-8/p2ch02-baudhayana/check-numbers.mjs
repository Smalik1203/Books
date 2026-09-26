#!/usr/bin/env node
/* Re-derive the numbers this chapter prints.

     node pages/class-8/p2ch02-baudhayana/check-numbers.mjs

   Rewritten on 26 September 2026 for the maths-v2 chapter (Summary page,
   By the Book in six forms, Beyond the Book by format), on the pattern of
   Class 6 Chapter 1's. The version before it checked a layout that no
   longer exists (the old Beyond stages, its 33 practice questions and
   15 examples) and is in git history.

   A  every arithmetic identity set as maths ($…$) on every page and in
      ANSWERS.md, and every trap a < sqrt(n) < b
   B  the key is complete: By the Book 1–50, Beyond practice 1–15, and
      every solved example ends in an Answer row
   C  every single-correct question: the right value is computed here, and
      the option the key names must print it; the body's worked examples
      and exercise answers are recomputed from the theorem

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

/* ---- A: identities and traps ---------------------------------------- */
const strip = t => [['times', '*'], ['div', '/'], ['thinsp', ''], [',', ''], [';', ''], [' ', ''], ['left', ''], ['right', ''], ['cdot', '*']]
  .reduce((s, [k, v]) => s.split(B + k).join(v), t);
const sqrtToJs = s => s.replace(new RegExp(B + B + 'sqrt\\{([^{}]+)\\}', 'g'), 'Math.sqrt($1)');
const identities = (label, text) => {
  const noDisplay = text.replace(/\$\$[\s\S]+?\$\$/g, ' ');
  for (const m of noDisplay.matchAll(/\$([^$]+)\$/g)) {
    const raw = m[1];
    const trap = raw.match(new RegExp('^\\s*([\\d.]+)\\s*(?:<|' + B + B + 'lt)\\s*' + B + B + 'sqrt\\{?(\\d+)\\}?\\s*(?:<|' + B + B + 'lt)\\s*([\\d.]+)\\s*$'));
    if (trap) { ok(`${label}: trap $${raw}$`, (+trap[1]) ** 2 < +trap[2] && +trap[2] < (+trap[3]) ** 2); continue; }
    if (/[<>]/.test(raw) || raw.includes(B + 'lt') || raw.includes(B + 'gt') || raw.includes(B + 'ne')) continue;
    let js = strip(raw).replace(/−/g, '-').replace(/\s+/g, '');
    js = sqrtToJs(js).replace(/\^(\d)/g, '**$1').replace(/\)\(/g, ')*(');
    if (!js.includes('=') || js.includes(B)) continue;
    // the numeric sides of a chain like b^2 = 2809 - 2025 = 784 must agree
    const sides = js.split('=').filter(s => s !== '').filter(s => /^(Math\.sqrt|[\d+\-*/().])+$/.test(s));
    if (sides.length < 2) continue;
    const vals = sides.map(s => Function(`return (${s})`)());
    ok(`${label}: $${raw}$`, vals.every(v => Math.abs(v - vals[0]) < 1e-9), vals.join(' vs '));
  }
};
for (const f of PAGES) identities(f, HTML[f]);
identities('ANSWERS.md', ANSWERS);

/* ---- B: the key is complete ----------------------------------------- */
const keyStart = PAGES.findIndex(f => HTML[f].includes('c-stage__title">Answers'));
ok('Beyond has an Answers stage', keyStart >= 0);
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
for (const e of examples) ok(`Beyond Example ${e[1]} ends in an Answer row`, /work__label">Answer</.test(e[0]));

/* ---- C: single-correct questions, recomputed ------------------------ */
const hyp = (a, b) => Math.sqrt(a * a + b * b);
const leg = (c, a) => Math.sqrt(c * c - a * a);
const isTriple = ([a, b, c]) => a * a + b * b === c * c;
const machine = (m, n) => [m * m - n * n, 2 * m * n, m * m + n * n];
const firstInt = s => { const m = String(s).replace(new RegExp(B + B + 'sqrt\\{[^}]*\\}', 'g'), 'R').match(/-?\d+(\.\d+)?/); return m ? +m[0] : NaN; };
const letter = s => 'abcd'.indexOf(s);
const questionOptions = (html, n) => {
  const start = n === 1 ? html.search(/<ol class="c-questions">/) : html.indexOf(`data-start="${n}"`);
  if (start < 0) return null;
  const chunk = html.slice(start, html.indexOf('</ol>\n', start) + 5);
  const opts = [...chunk.matchAll(/c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/g)].pop();
  return opts ? [...opts[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1].trim()) : null;
};
const boardPages = PAGES.filter(f => /^p09/.test(f)).map(f => HTML[f]).join('\n');
const boardLetters = Object.fromEntries([...boardKey.matchAll(/class="n">(\d+)<\/span> \((\w)\)/g)].map(m => [+m[1], m[2]]));
// question -> test on the text of the option the key names
const BOARD_MCQ = {
  41: o => firstInt(o) === hyp(9, 12),
  42: o => isTriple(o.match(/\d+/g).map(Number)),
  43: o => firstInt(o) === 2 * 6 * 6,
  44: o => firstInt(o) === hyp(8, 15),
  45: o => firstInt(o) === leg(17, 15),
  46: o => { const [a, b] = o.match(/\d+/g).map(Number); return a * a < 30 && 30 < b * b && b === a + 1; },
  47: o => JSON.stringify(o.match(/\d+/g).map(Number)) === JSON.stringify(machine(4, 2)),
  48: o => o === '(i) and (iii)',          // (ii) fails: (5, 6, 7)
  49: o => o.includes('25 + 25 = 50') && 5 * 5 + 5 * 5 !== 7 * 7,
  50: o => firstInt(o) === 10 * 10 / 2,
};
for (const [q, test] of Object.entries(BOARD_MCQ)) {
  const opts = questionOptions(boardPages, +q), l = boardLetters[q];
  const right = opts ? opts.filter(o => { try { return test(o); } catch { return false; } }) : [];
  ok(`By the Book Q${q}: key (${l}) is the one right option`, !!(opts && l && test(opts[letter(l)]) && right.length === 1), opts ? `key option "${opts[letter(l)]}", right options ${right.length}` : 'options not found');
}
const AR = { 31: 'a', 32: 'b', 33: 'd', 34: 'c', 35: 'a' };
ok('Q31: 9, 40, 41 is right-angled', isTriple([9, 40, 41]));
ok('Q32: (20, 21, 29) is a triple', isTriple([20, 21, 29]));
ok('Q33: doubling the side quadruples the area', (2 * 5) ** 2 === 4 * 5 ** 2);
ok('Q34: 4 < sqrt 20 < 5, sqrt 20 not whole', 16 < 20 && 20 < 25);
ok('Q35: 5, 12, 13', hyp(5, 12) === 13);
for (const [q, l] of Object.entries(AR)) ok(`By the Book Q${q} key (${l})`, boardLetters[q] === l, `key prints (${boardLetters[q]})`);

const practice = beyondPages.slice(0, beyondPages.indexOf('c-stage__title">Answers'));
const beyondLetters = Object.fromEntries([...beyondList.matchAll(/(\d+) \((\w)\)/g)].map(m => [+m[1], m[2]]));
const BEYOND_MCQ = {
  1: o => firstInt(o) === 4 * 49,
  2: o => firstInt(o) === 26 / 13 * 5,
  3: o => firstInt(o) === ((17 ** 2) - 169) / 2,   // (l + b)^2 - (l^2 + b^2) = 2lb
  4: o => o.includes('10') && o.includes('or') && 64 - 36 === 28 && hyp(6, 8) === 10,
};
for (const [q, test] of Object.entries(BEYOND_MCQ)) {
  const opts = questionOptions(practice, +q), l = beyondLetters[q];
  const right = opts ? opts.filter(o => { try { return test(o); } catch { return false; } }) : [];
  ok(`Beyond Q${q}: key (${l}) is the one right option`, !!(opts && l && test(opts[letter(l)]) && right.length === 1), opts ? `key option "${opts[letter(l)]}", right ${right.length}` : 'options not found');
}
// more than one correct, numerical, matching, paragraph
const sq = x => Math.round(x * x * 1e6) / 1e6;
ok('Beyond Q5 (a), (c)', sq(1.5) + sq(2) === sq(2.5) && sq(0.9) + sq(1.2) === sq(1.5) && 49 + 576 !== 676 && 200 !== 196);
ok('Beyond Q6 (a), (b)', isTriple([7, 24, 25]) && isTriple([15, 20, 25]) && !isTriple([10, 15, 25]) && !isTriple([12, 13, 25]));
ok('Beyond Q7 (a), (b): (c), (d) fail at m = 3, n = 1', machine(3, 1)[0] % 2 === 0);
ok('Beyond Q8 (a), (b), (d)', Math.sqrt(100) === 10 && 50 / 2 === 25 && Math.sqrt(50) !== 25);
ok('Beyond Q9 = 34', hyp(30, 16) === 34);
ok('Beyond Q10 = 15', Math.sqrt(4 + 100 + 121) === 15);
ok('Beyond Q11 = 37', (() => { const x = (144 - 4) / 4; return x + 2 === 37 && hyp(x, 12) === 37; })());
ok('Beyond Q12 (a)', hyp(9, 40) === 41 && leg(85, 84) === 13 && hyp(12, 35) === 37 && hyp(9, 12) === 15);
ok('Beyond Q13 (c)', [[4, 1, 17], [5, 2, 29], [5, 4, 41], [6, 5, 61]].every(([m, n, c]) => machine(m, n)[2] === c));
ok('Beyond Q14', leg(13, 5) === 12 && leg(13, 12) === 5);
ok('Beyond Q15', 60 / 12 * 5 === 25 && 15 * 20 / 2 === 150 && 2 * (5 + 12 + 13) === 60);
for (const [q, l] of Object.entries({ 5: '(a), (c)', 6: '(a), (b)', 7: '(a), (b)', 8: '(a), (b), (d)', 12: '(a)', 13: '(c)' }))
  ok(`Beyond key ${q} prints ${l}`, beyondList.includes(`${q} ${l}`));

// Beyond solved examples
ok('Beyond Ex 1: 63', leg(65, 16) === 63);
ok('Beyond Ex 2: 8', Math.abs(leg(8.9, 3.9) - 8) < 1e-9);
ok('Beyond Ex 3: rod 7', Math.sqrt(4 + 9 + 36) === 7);
ok('Beyond Ex 4: 100', hyp(60, 80) === 100);
ok('Beyond Ex 5: 24', (49 - 1) / 2 === 24);
ok('Beyond Ex 6: 1.3', Math.abs(hyp(1.2, 0.5) - 1.3) < 1e-9);
ok('Beyond Ex 7', hyp(5, 12) === 13 && hyp(8, 15) === 17 && hyp(7, 24) === 25 && hyp(20, 21) === 29);
ok('Beyond Ex 8', 1.41 ** 2 < 2 && 2 < 1.42 ** 2 && 1.73 ** 2 < 3 && 3 < 1.74 ** 2 && 2.23 ** 2 < 5 && 5 < 2.24 ** 2 && 2.82 ** 2 < 8 && 8 < 2.83 ** 2);
ok('Beyond Ex 9', hyp(80, 60) === 100 && 140 - 100 === 40);
ok('Beyond Ex 10', 256 / 2 === 128 && Math.sqrt(256 / 4) === 8 && 256 / 16 === 16);

// the body's worked examples and exercise answers
ok('Body Ex 1: 72 / 2 = 36, side 6', Math.sqrt(72 / 2) === 6);
ok('Body Ex 2: 16, 30 -> 34', hyp(16, 30) === 34);
ok('Body Ex 3: 53, 45 -> 28', leg(53, 45) === 28);
ok('Body Ex 4: wall 12, ladder 13', (() => { const x = (25 - 1) / 2; return x === 12 && hyp(5, x) === x + 1; })());
ok('Body Ex 5: rhombus 42, 40 -> 29', hyp(21, 20) === 29);
ok('Body 2.6.1: 13, 84, 85 yes; 10, 24, 27 no', isTriple([13, 84, 85]) && !isTriple([10, 24, 27]));
ok('Body 2.6.2: room 12, 9, 8 -> 17', Math.sqrt(144 + 81 + 64) === 17);
ok('Body machine list', [[2, 1, [3, 4, 5]], [3, 2, [5, 12, 13]], [4, 1, [15, 8, 17]], [4, 3, [7, 24, 25]], [6, 1, [35, 12, 37]]]
  .every(([m, n, t]) => JSON.stringify(machine(m, n)) === JSON.stringify(t)));
ok('Body 2.8: 6^3 + 8^3 = 9^3 - 1', 6 ** 3 + 8 ** 3 === 9 ** 3 - 1);
const triplesIn = (lo, hi) => { const o = []; for (let c = lo; c <= hi; c++) for (let a = 1; a < c; a++) for (let b = a; b < c; b++) if (a * a + b * b === c * c) o.push([a, b, c]); return o; };
const gcd = (a, b) => (b ? gcd(b, a % b) : a);
ok('Ex 2.3 Q2: five triples with largest number 21-30', JSON.stringify(triplesIn(21, 30)) === JSON.stringify([[7, 24, 25], [15, 20, 25], [10, 24, 26], [20, 21, 29], [18, 24, 30]]), JSON.stringify(triplesIn(21, 30)));
ok('Ex 2.3 Q2: primitive ones are (7, 24, 25), (20, 21, 29)', JSON.stringify(triplesIn(21, 30).filter(t => t.reduce(gcd) === 1)) === JSON.stringify([[7, 24, 25], [20, 21, 29]]));
ok('Ex 2.3 Q3', JSON.stringify(machine(8, 1)) === '[63,16,65]' && JSON.stringify(machine(7, 4)) === '[33,56,65]');

console.log(`${checks} checks, ${fails} failed`);
process.exit(fails ? 1 : 0);
