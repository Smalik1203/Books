#!/usr/bin/env node
/* Re-derive the numbers this chapter prints.

     node pages/class-8/p2ch05-data/check-numbers.mjs

   Rewritten on 26 September 2026 for the maths-v2 conversion (body in our
   own contexts and data, Summary page, By the Book in six forms, Beyond the
   Book by format). The version before it checked a layout that no longer
   exists — its figures, its practice run and its key — and is in git
   history.

   A  every arithmetic identity set as maths ($…$) on every page and in
      ANSWERS.md
   B  the figures and data the body prints: the tally of Fig. 5.3 against
      the thirty raw answers, the frequency table's mean and median, the
      six readings of Fig. 5.4 read back off its SVG, and the day strip of
      Fig. 5.6 counted box by box
   C  the key is complete: By the Book 1–50, Beyond practice 1–15, and
      every solved example in Beyond ends in an Answer row
   D  every single-correct question: the right value is computed here from
      its data, and the option the key names must print that value

   Exits 1 on any failure. */
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const B = String.fromCharCode(92);
const PAGES = readdirSync(DIR).filter(f => /^p\d{3}\.html$/.test(f)).sort();
const HTML = Object.fromEntries(PAGES.map(f => [f, readFileSync(path.join(DIR, f), 'utf8').replace(/\r\n/g, '\n')]));
const ALL = PAGES.map(f => HTML[f]).join('\n');
const ANSWERS = readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
let fails = 0, checks = 0;
const ok = (label, cond, detail = '') => { checks++; if (!cond) { fails++; console.log(`  x ${label}${detail ? '  ' + detail : ''}`); } };
const sum = a => a.reduce((x, y) => x + y, 0);
const mean = a => sum(a) / a.length;
const median = a => { const s = [...a].sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const near = (x, y) => Math.abs(x - y) < 1e-9;

/* ---- A: identities -------------------------------------------------- */
const strip = t => [['times', '*'], ['div', '/'], ['thinsp', ''], [',', ''], [';', ''], [' ', ''], ['left', ''], ['right', ''], ['{,}', '']]
  .reduce((s, [k, v]) => s.split(B + k).join(v), t).replace(/\{,\}/g, '');
const identities = (label, text) => {
  for (const m of text.matchAll(/\$([^$]+)\$/g)) {
    let js = strip(m[1]).replace(/−/g, '-').replace(/\s+/g, '');
    js = js.replace(new RegExp(B + B + 'd?frac\\{([^{}]+)\\}\\{([^{}]+)\\}', 'g'), '(($1)/($2))');
    if (!js.includes('=') || js.includes(B)) continue;
    const sides = js.split('=').filter(s => s !== '');
    if (sides.length < 2 || sides.some(s => !/^[\d+\-*/().]+$/.test(s))) continue;
    let vals;
    try { vals = sides.map(s => Function(`return (${s})`)()); } catch { continue; }
    ok(`${label}: $${m[1]}$`, vals.every(v => Math.abs(v - vals[0]) < 1e-9), vals.join(' vs '));
  }
};
for (const f of PAGES) identities(f, HTML[f]);
identities('ANSWERS.md', ANSWERS);

/* ---- B: the body's data --------------------------------------------- */
// Fig. 5.3: the thirty library answers, their tally and the table
const rawEq = [...ALL.matchAll(/<div class="eq">\$\$([\d\s\\quad]+)\$\$<\/div>/g)]
  .map(m => m[1].split(B + 'quad').map(t => +t.trim()));
const raw = rawEq.flat();
ok('library list has 30 answers', raw.length === 30, `found ${raw.length}`);
const freq = [1, 2, 3, 4, 5, 6].map(v => raw.filter(x => x === v).length);
ok('tally counts 4, 6, 8, 6, 4, 2', JSON.stringify(freq) === '[4,6,8,6,4,2]', freq.join(','));
const tally = ALL.match(/aria-label="A tally sheet[\s\S]*?<\/svg>/)[0];
const strokes = tally.match(/<path class="dg-line" d="([^"]+)"/)[1];
const rowCount = y0 => (strokes.match(new RegExp(`M\\d+ ${y0} V${y0 + 12}`, 'g')) || []).length
  + (strokes.match(new RegExp(`L54 ${y0}(?!\\d)`, 'g')) || []).length;
ok('Fig. 5.3 strokes match the list', JSON.stringify([14, 28, 42, 56, 70, 84].map(rowCount)) === JSON.stringify(freq),
  [14, 28, 42, 56, 70, 84].map(rowCount).join(','));
ok('library mean 3.2', near(mean(raw), 3.2));
ok('library median 3', median(raw) === 3);
// Fig. 5.4: dots at y = 100 - 5(T - 20)
const lg = ALL.match(/aria-label="A line graph of temperature[\s\S]*?<\/svg>/)[0];
const temps = [...lg.matchAll(/cy="([\d.]+)" r="2.4"/g)].map(m => 20 + (100 - +m[1]) / 5);
ok('Fig. 5.4 reads 21 25 30 33 29 24', temps.join(' ') === '21 25 30 33 29 24', temps.join(' '));
ok('Example 9 mean 27', mean(temps) === 27);
// Fig. 5.6: 48 half-hour boxes from x = 8, 3.75 wide
const strip56 = ALL.match(/aria-label="A strip of forty-eight[\s\S]*?<\/svg>/)[0];
const boxes = cls => sum([...strip56.matchAll(new RegExp(`<path class="${cls}" d="([^"]+)"`, 'g'))]
  .flatMap(m => [...m[1].matchAll(/M([\d.]+) 20 H([\d.]+)/g)].map(r => (+r[2] - +r[1]) / 3.75)));
const day = { sleep: boxes('dg-fill-b'), other: boxes('dg-fill-b-soft'), eat: boxes('dg-fill-a'), travel: boxes('dg-fill-teal'), school: boxes('dg-fill-c') };
ok('Fig. 5.6 has 48 boxes', near(sum(Object.values(day)), 48), JSON.stringify(day));
ok('Fig. 5.6: sleep 16, school 12, travel 2', near(day.sleep, 16) && near(day.school, 12) && near(day.travel, 2), JSON.stringify(day));
// body examples
ok('Example 4: tea stall mean 1000, median 800', mean([780, 820, 760, 850, 2200, 800, 790]) === 1000 && median([780, 820, 760, 850, 2200, 800, 790]) === 800);
ok('Example 5: missing height 29', 8 * 29.5 - sum([24, 31, 28, 35, 26, 30, 33]) === 29);
ok('Example 6: mangoes 46', (46.5 * 12 - 6) / 12 === 46);
ok('Example 7: 62.6', near((24 * 60 + 26 * 65) / 50, 62.6));
ok('Example 8: f = 6, median 1', near((0 * 4 + 1 * 7 + 2 * 6 + 3 * 3) / 20, 1.4));

/* ---- C: the key is complete ----------------------------------------- */
const keyStart = PAGES.findIndex(f => HTML[f].includes('c-stage__title">Answers'));
const key = PAGES.slice(keyStart).map(f => HTML[f]).join('\n');
const [boardKey, beyondKey] = key.split('c-practice__sub">Beyond the Book');
const numbered = s => new Set([...s.matchAll(/work__label">(\d+)<|class="n">(\d+)</g)].map(m => +(m[1] || m[2])));
const board = numbered(boardKey);
for (let n = 1; n <= 50; n++) ok(`By the Book key has ${n}`, board.has(n));
const beyondList = (beyondKey.match(/c-answers__list">([^<]*)</) || [, ''])[1];
const beyond = new Set([...numbered(beyondKey), ...[...beyondList.matchAll(/(\d+) [(\d]/g)].map(m => +m[1])]);
for (let n = 1; n <= 15; n++) ok(`Beyond key has ${n}`, beyond.has(n));
const beyondPages = PAGES.filter(f => /^p1/.test(f)).map(f => HTML[f]).join('\n');
const examples = [...beyondPages.matchAll(/c-example__tab">Example (\d+)<[\s\S]*?(?=c-example__tab"|c-stage__title">Answers|$)/g)];
ok('Beyond has 10 solved examples', examples.length === 10, `found ${examples.length}`);
for (const e of examples) ok(`Example ${e[1]} ends in an Answer row`, /work__label">Answer</.test(e[0]));
const boardPages = PAGES.filter(f => /^p09/.test(f)).map(f => HTML[f]).join('\n');
const qs = [...boardPages.matchAll(/data-start="(\d+)"/g)].map(m => +m[1]);
ok('By the Book numbered 2–50 in order', JSON.stringify(qs) === JSON.stringify([...Array(49)].map((_, i) => i + 2)));

/* ---- D: single-correct questions, recomputed ------------------------ */
const BOARD_MCQ = {
  41: '$' + mean([6, 12, 18, 24, 30]) + '$',
  42: '$' + median([5, 2, 9, 4, 7, 3]) + '$',
  43: '$' + (10 - 2) + '$',                          // x + 2 is the mean
  44: '$' + (12 * 20 - 20) / 11 + '$',
  45: '$' + (0 * 4 + 1 * 3 + 2 * 2 + 3 * 1) / 10 + '$',
  46: '$' + [1, 2, 3, 4, 5, 6, 7, 8].find(k => (6 + 3 * k) / (6 + k) === 2) + '$',
  47: '(ii) and (iii)',
  49: '2 and 3',                                      // gains 3, 4, 2
  50: '$' + (120 - 90) / (100 - 90) + '$',
};
const BEYOND_MCQ = {
  1: '$' + (7 * 20 - 6 * 19) + '$',
  2: '$' + median([2, 3, 5, 7, 11, 13, 17, 19, 23, 29]) + '$',
  3: '$' + (26 + 4) / 3 + '$',
  4: '$' + (2 * 3 + 4 * 5 + 6 * 2) / 10 + '$',
};
const letter = s => 'abcd'.indexOf(s);
const questionOptions = (html, n) => {
  const start = n === 1 ? html.search(/<ol class="c-questions">/) : html.indexOf(`data-start="${n}"`);
  if (start < 0) return null;
  const chunk = html.slice(start, html.indexOf('</li>\n', start) + 5);
  const opts = [...chunk.matchAll(/c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/g)].at(-1);
  return opts ? [...opts[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1].trim()) : null;
};
const boardLetters = Object.fromEntries([...boardKey.matchAll(/class="n">(\d+)<\/span> \((\w)\)/g)].map(m => [+m[1], m[2]]));
for (const [q, want] of Object.entries(BOARD_MCQ)) {
  const opts = questionOptions(boardPages, +q), l = boardLetters[q];
  ok(`By the Book Q${q}: key (${l}) prints ${want}`, !!(opts && l && opts[letter(l)] === want), opts ? `option is "${opts[letter(l)]}"` : 'options not found');
}
const practice = beyondPages.slice(0, beyondPages.indexOf('c-stage__title">Answers'));
const beyondLetters = Object.fromEntries([...beyondList.matchAll(/(\d+) \((\w)\)/g)].map(m => [+m[1], m[2]]));
for (const [q, want] of Object.entries(BEYOND_MCQ)) {
  const opts = questionOptions(practice, +q), l = beyondLetters[q];
  ok(`Beyond Q${q}: key (${l}) prints ${want}`, !!(opts && l && opts[letter(l)] === want), opts ? `option is "${opts[letter(l)]}"` : 'options not found');
}
// numerical answers in the Beyond key
ok('Beyond 9: 16.5', (5 * 18 - 12 - 20 - 25) / 2 === 16.5);
ok('Beyond 10: 65', (30 * 62 - 18 * 60) / 12 === 65);
ok('Beyond 11: x = 10', (40 + 20 * 10 + 180) / 20 === 21 * 20 / 20 && (40 + 200 + 180) / 20 === 21);
ok('Beyond 14: 64 and 52', mean([64, 58, 71, 58, 69]) === 64 && 6 * 62 - 320 === 52);

console.log(`${checks} checks, ${fails} failed`);
process.exit(fails ? 1 : 0);
