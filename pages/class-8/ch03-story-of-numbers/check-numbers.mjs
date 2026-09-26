#!/usr/bin/env node
/* Re-derive the numbers this chapter prints.

     node pages/class-8/ch03-story-of-numbers/check-numbers.mjs

   Rewritten on 27 September 2026 for the maths-v2 chapter (new exercise
   sets, summary page, By the Book in six forms, Beyond the Book by format).
   The version before it checked a layout that no longer exists — the old
   practice run of 31 and its Types — and is in git history.

   A  every arithmetic identity set as maths ($...$) on every page and in
      ANSWERS.md (a numeral in another base, 1322_{\,5}, is skipped here)
   B  the key is complete: By the Book 1–50, Beyond practice 1–15, ten
      solved examples each ending in an Answer row
   C  every single-correct question: the right value is computed here
      from its rule, and the option the key names must print that value
   D  the claims arithmetic alone cannot check: Roman numerals built and
      read by rule, base conversions, places of sixty, the Mayan places

   Exits 1 on any failure. */
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const B = String.fromCharCode(92);
const PAGES = readdirSync(DIR).filter(f => /^p\d{3}\.html$/.test(f)).sort();
const HTML = Object.fromEntries(PAGES.map(f => [f, readFileSync(path.join(DIR, f), 'utf8').replace(/\r\n/g, '\n')]));
const ANSWERS = readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const ALL = PAGES.map(f => HTML[f]).join('\n');
let fails = 0, checks = 0;
const ok = (label, cond, detail = '') => { checks++; if (!cond) { fails++; console.log(`  x ${label}${detail ? '  ' + detail : ''}`); } };
const eq = (label, got, want) => ok(label, JSON.stringify(got) === JSON.stringify(want), `computed ${JSON.stringify(got)}, printed ${JSON.stringify(want)}`);
const text = s => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/\s+/g, ' ');
const says = (where, s) => ok(`prints "${s}"`, text(where).includes(s) || where.includes(s));

/* ---- the mathematics ------------------------------------------------ */
const ROMAN = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
const roman = n => ROMAN.reduce((s, [v, r]) => { while (n >= v) { s += r; n -= v; } return s; }, '');
const RV = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
const unroman = s => [...s].reduce((t, c, i) => t + (RV[c] < (RV[s[i + 1]] || 0) ? -RV[c] : RV[c]), 0);
const inBase = (n, b) => n.toString(b);
const fromBase = (s, b) => parseInt(s, b);
const digitSum = (n, b = 10) => [...inBase(n, b)].reduce((a, d) => a + parseInt(d, b), 0);
const places60 = n => { const o = []; do { o.unshift(n % 60); n = Math.floor(n / 60); } while (n); return o; };
const maya = n => [Math.floor(n / 7200), Math.floor(n % 7200 / 360), Math.floor(n % 360 / 20), n % 20];
const hms = s => [Math.floor(s / 3600), Math.floor(s % 3600 / 60), s % 60];
const longest = (a, b) => { let best = [0, 0]; for (let n = a; n <= b; n++) if (roman(n).length > best[1]) best = [n, roman(n).length]; return best; };

/* ---- A: identities -------------------------------------------------- */
const strip = t => [['times', '*'], ['div', '/'], ['thinsp', ''], [',', ''], [';', ''], [' ', ''], ['left', ''], ['right', ''], ['quad', '']]
  .reduce((s, [k, v]) => s.split(B + k).join(v), t);
const identities = (label, src) => {
  for (const m of src.matchAll(/\$([^$]+)\$/g)) {
    let js = strip(m[1]).replace(/−/g, '-').replace(/\s+/g, '').replace(/\^(\d)/g, '**$1');
    if (!js.includes('=') || js.includes(B) || js.includes('_')) continue;
    for (const part of js.split(/,(?=[^,]*=)/)) {
      const sides = part.split('=').filter(s => s !== '');
      if (sides.length < 2 || sides.some(s => !/^[\d+\-*/().]+$/.test(s))) continue;
      const vals = sides.map(s => Function(`return (${s})`)());
      ok(`${label}: $${m[1]}$`, vals.every(v => Math.abs(v - vals[0]) < 1e-9), vals.join(' vs '));
    }
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
const beyond = new Set([...numbered(beyondKey), ...[...beyondList.matchAll(/(?:^|&nbsp;)\s*(\d+)\s+[(\d]/g)].map(m => +m[1])]);
for (let n = 1; n <= 15; n++) ok(`Beyond key has ${n}`, beyond.has(n));
const beyondPages = PAGES.filter(f => /^p1/.test(f)).map(f => HTML[f]).join('\n');
const examples = [...beyondPages.matchAll(/c-example__tab">Example (\d+)<[\s\S]*?(?=c-example__tab"|c-stage__title">Answers|$)/g)];
ok('Beyond has 10 solved examples', examples.length === 10, `found ${examples.length}`);
for (const e of examples) ok(`Example ${e[1]} ends in an Answer row`, /work__label">Answer</.test(e[0]));
const boardPages = PAGES.filter(f => /^p09/.test(f)).map(f => HTML[f]).join('\n');
const qnums = [...boardPages.matchAll(/data-start="(\d+)"/g)].map(m => +m[1]);
eq('By the Book numbered 2-50 in order', qnums, [...Array(49)].map((_, i) => i + 2));
for (const [sub, n] of [['Very short answer', 1], ['Short answer', 11], ['Long answer', 21], ['Assertion and reason', 31], ['Case-based questions', 36], ['Objective questions', 41]]) {
  const re = new RegExp(`c-practice__sub">${sub}</div>[\\s\\S]*?<ol class="c-questions"(?: data-start="(\\d+)")?`);
  const m = boardPages.match(re);
  ok(`${sub} opens at ${n}`, m && +(m[1] || 1) === n);
}
// every exercise set cites NCERT, once, as the last thing in its last block
const bodyPages = PAGES.filter(f => /^p0[0-8]/.test(f)).map(f => HTML[f]).join('\n');
eq('five exercise sets, five NCERT notes', [(bodyPages.match(/c-practice__head">Exercise Set/g) || []).length, (bodyPages.match(/c-practice__note">NCERT/g) || []).length], [5, 5]);

/* ---- C: single-correct questions, recomputed ------------------------ */
const BOARD_MCQ = {
  41: unroman('CDXCIX'),
  42: fromBase('2101', 3),
  43: 7 ** 3,
  44: [...Array(40)].map((_, n) => n).find(n => n > 4 && 2 * n + 4 === 22),
  45: '60&thinsp;507',
  46: 2 * 3600 + 0 * 60 + 45,
  49: inBase(100, 2).length,
  50: 2 * 3600 + 5 * 60,
};
const BEYOND_MCQ = {
  1: unroman('MMCDLXXIX'),
  2: fromBase('245', 6),
  3: 3 ** 5,
  4: [...Array(20)].map((_, b) => b).find(b => b > 1 && fromBase('1010', b) === 130),
};
eq('Q45 is 60 507', 6e4 + 5e2 + 7, 60507);
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
  ok(`By the Book Q${q}: key (${l}) prints ${want}`, !!(opts && l && opts[letter(l)] === String(want)), opts ? `option is "${opts[letter(l)]}"` : 'options not found');
}
eq('By the Book 47: (i) and (iii) true, (ii) false', boardLetters[47], 'b');
eq('By the Book 48: V x V is not a landmark', [boardLetters[48], [1, 5, 10, 50, 100, 500, 1000].includes(25)], ['b', false]);
eq('By the Book 31-35', [31, 32, 33, 34, 35].map(q => boardLetters[q]).join(''),
  [fromBase('1000', 5) === 125 ? 'a' : '?', unroman('MCMXC') === 1990 ? 'b' : '?', 'c', maya(8000)[0] === 1 && maya(8000).slice(1).some(Boolean) ? 'd' : '?', fromBase('1111', 2) === 15 && fromBase('10000', 2) === 16 ? 'a' : '?'].join(''));
const practice = beyondPages.slice(0, beyondPages.indexOf('c-stage__title">Answers'));
const beyondLetters = Object.fromEntries([...beyondList.matchAll(/(\d+) \((\w)\)/g)].map(m => [+m[1], m[2]]));
for (const [q, want] of Object.entries(BEYOND_MCQ)) {
  const opts = questionOptions(practice, +q), l = beyondLetters[q];
  ok(`Beyond Q${q}: key (${l}) prints ${want}`, !!(opts && l && opts[letter(l)] === String(want)), opts ? `option is "${opts[letter(l)]}"` : 'options not found');
}
eq('Beyond 5: which stand for 12', [['1100', 2], ['22', 5], ['110', 3], ['15', 8]].map(([s, b]) => fromBase(s, b) === 12), [true, true, true, false]);
eq('Beyond 7: well-formed Roman', ['MCMXCIX', 'IM', 'CDXLIV', 'XCX'].map(s => roman(unroman(s)) === s), [true, false, true, false]);
eq('Beyond 8: 10 < n + 3 < 20', [7, 8, 9, 17].map(n => n + 3 > 10 && n + 3 < 20), [false, true, true, false]);
eq('Beyond 9-11', [roman(1888).length, fromBase('3021', 4), 5 ** 4 - 1], [13, 201, 624]);
eq('Beyond 12: 110 in bases 2-5', [2, 3, 4, 5].map(b => fromBase('110', b)), [6, 12, 20, 30]);
eq('Beyond 13', [7200, 3605, 3 * 60 + 20, 900], [2 * 3600, 3600 + 5, 200, 3600 / 4]);
eq('Beyond 14', [fromBase('305', 8), digitSum(100, 8), digitSum(511, 8)], [197, 9, 21]);
eq('Beyond 15', [32 + 8 + 4 + 1, [...inBase(58, 2)].filter(d => d === '1').length, 2 ** 6 - 1], [45, 4, 63]);
eq('Beyond 1-15 letters', [1, 2, 3, 4, 12, 13].map(q => beyondLetters[q]).join(''), 'dcbaab');

/* ---- D: numerals, bases and places --------------------------------- */
// body
eq('Example 1: 2758', [roman(2758), roman(2758).length], ['MMDCCLVIII', 10]);
eq('Example 2: MCMLXXIV', unroman('MCMLXXIV'), 1974);
eq('Example 3: CCXXXIII + CCCCXXII', roman(unroman('CCXXXIII') + unroman('CCCCXXII')), 'DCLV');
eq('Example 4: 187 in base 5', [inBase(187, 5), digitSum(187, 5), digitSum(187)], ['1222', 7, 16]);
eq('Example 5: 324 x 10', 324 * 10, 3240);
eq('Example 6: 1206', [digitSum(1206), roman(1206), roman(1206).length], [9, 'MCCVI', 5]);
eq('Fig. 3.4: 7530 in sixties', places60(7530), [2, 5, 30]);
eq('T and R 3.4: longest year 2000-2099', longest(2000, 2099), [2088, 10]);
eq('Set 3.1', [[Math.floor(38 / 5), 38 % 5], [Math.floor(47 / 10), 47 % 10, Math.floor(47 / 5), 47 % 5], 9 * 5 + 3 + 12], [[7, 3], [4, 7, 9, 2], 60]);
eq('Set 3.2 Q1', [1386, 2649, 407, 3094].map(roman), ['MCCCLXXXVI', 'MMDCXLIX', 'CDVII', 'MMMXCIV']);
eq('Set 3.2 Q2', ['MDCCCLVII', 'CCCXCIV', 'MMXLVIII', 'LXXIX'].map(unroman), [1857, 394, 2048, 79]);
eq('Set 3.2 Q3', roman(unroman('LXVIII') + unroman('CXXVII')), 'CXCV');
eq('Set 3.2 Q4', [10 * 10, 5 * 100, 50 * 20, 9 * 6].map(roman), ['C', 'D', 'M', 'LIV']);
eq('Set 3.2 Q5-7', [roman(99), longest(1, 100), roman(1005), roman(1500)], ['XCIX', [88, 8], 'MV', 'MD']);
eq('Set 3.3 Q2', [40, 158, 312].map(n => inBase(n, 5)), ['130', '1113', '2222']);
eq('Set 3.3 Q6', [digitSum(150, 5), digitSum(150), digitSum(223, 5), digitSum(223)], [2, 6, 11, 7]);
eq('Set 3.4 Q1', [75, 150, 3700, 7200, 3610, 7322].map(places60), [[1, 15], [2, 30], [1, 1, 40], [2, 0, 0], [1, 0, 10], [2, 2, 2]]);
eq('Set 3.4 Q4', [maya(45), maya(390)], [[0, 0, 2, 5], [0, 1, 1, 10]]);
eq('Set 3.5 Q6, Q10', [inBase(30, 2), inBase(30, 4), inBase(30, 8), inBase(20, 3)], ['11110', '132', '36', '202']);
// By the Book
eq('BtB 1, 6, 15', [roman(2946), roman(unroman('MCMXLVII') - unroman('MDCCCLXXXIX')), roman(unroman('CDXXIV') + unroman('CCLXXXVIII'))], ['MMCMXLVI', 'LVIII', 'DCCXII']);
eq('BtB 2, 4, 11, 14', [fromBase('3214', 5), inBase(83, 2), inBase(250, 6), fromBase('250', 6), inBase(468, 5)], [434, '1010011', '1054', 102, '3333']);
eq('BtB 13: 75 in base 3', inBase(75, 3), '2210');
eq('BtB 16, 17', [fromBase('1000', 8), fromBase('7777', 8), hms(4750)], [512, 4095, [1, 19, 10]]);
eq('BtB 19, 21', [inBase(23, 4), fromBase('32', 5), inBase(17, 2), fromBase('23', 7)], ['113', 17, '10001', 17]);
eq('BtB 22', [inBase(3981, 12), 3981 - 2 * 1728 - 7 * 12 - 9, 3 * 1728 - 3981], ['2379', 3 * 144, 1203]);
eq('BtB 23', [fromBase('444', 5), fromBase('777', 8)], [124, 511]);
eq('BtB 24', [hms(13675), hms(6 * 3600 + 48 * 60 + 35 + 13675)], [[3, 47, 55], [10, 36, 30]]);
eq('BtB 25', [3416 + 1798, digitSum(5214)], [5214, 12]);
eq('BtB 26', [fromBase('2403', 5), inBase(353 + 17, 5)], [353, '2440']);
eq('BtB 27', [unroman('MCMLXXXIII') - unroman('MDCCCLXXXVIII'), roman(95), roman(1888 + 150)], [95, 'XCV', 'MMXXXVIII']);
eq('BtB 28', [54 - fromBase('54', 8), 5 + 4], [10, 9]);
eq('BtB 29', maya(14751), [2, 0, 17, 11]);
eq('BtB 30', [roman(3648).length * 12, digitSum(3648) * 12, 4 * 12], [132, 252, 48]);
eq('BtB 36', [hms(5400), hms(12600), hms(7 * 3600 + 15 * 60 + 9045)], [[1, 30, 0], [3, 30, 0], [9, 45, 45]]);
eq('BtB 37', [unroman('MDCCCXCVII'), roman(2047), roman(2047).length], [1897, 'MMXLVII', 7]);
eq('BtB 38', ['01011', '10110', '11001'].map(s => fromBase(s, 2)).concat([2 ** 5 - 1, inBase(40, 2).length]), [11, 22, 25, 31, 6]);
eq('BtB 39', [2 * 3600 + 13 * 60 + 20, places60(5000)], [8000, [1, 23, 20]]);
eq('BtB 40', [4 * 144 + 2 * 12 + 9, inBase(700, 12)], [609, '4a4']);
// Beyond examples
eq('Ex 1, 2', [roman(1649), inBase(100, 3)], ['MDCXLIX', '10201']);
eq('Ex 3', hms(10000), [2, 46, 40]);
eq('Ex 4', inBase(300, 4), '10230');
eq('Ex 5, 6', [maya(1000), places60(4000)], [[0, 2, 14, 0], [1, 6, 40]]);
eq('Ex 7', ['XLIX', 'XCIV', 'CDXL', 'MCM'].map(unroman), [49, 94, 440, 1900]);
eq('Ex 8', [['1011', 2], ['32', 4], ['44', 5], ['120', 3]].map(([s, b]) => fromBase(s, b)), [11, 14, 24, 15]);
eq('Ex 9', [inBase(38, 5), fromBase('444', 5) + 1, fromBase('342', 5)], ['123', 125, 97]);
eq('Ex 10', [fromBase('2053', 6), digitSum(100, 6), inBase(fromBase('1555', 6) + 1, 6)], [465, 10, '2000']);
// Stage 1 (kept word for word)
eq('Tried 1, 2, 8', [inBase(1000, 6), inBase(2025, 2), inBase(212, 5)], ['4344', '11111101001', '1322']);
eq('Tried 6', [3 * 144 + 5 * 12 + 7, inBase(499, 12), inBase(576, 12)], [499, '357', '400']);
for (const s of ['MMDCCLVIII', 'MCMLXXIV', 'DCLV', 'MMCMXLVI', 'DCCXII', 'MMXXXVIII', 'MMXLVII', '2440', '2210', '10201']) says(ALL, s);

console.log(`${checks} checks, ${fails} failed`);
process.exit(fails ? 1 : 0);
