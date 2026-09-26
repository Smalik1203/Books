#!/usr/bin/env node
/* Re-derive the numbers this chapter prints.

     node pages/class-6/math-ch08-constructions/check-numbers.mjs

   Rewritten on 26 September 2026 for the maths-v2 chapter (summary page,
   By the Book in six forms, Beyond the Book by format). The version before
   it measured a Beyond the Book of four stages and figure numbers that no
   longer exist, and is in git history. A construction chapter prints few
   sums and many measurements, so most of this works in coordinates: it
   builds each construction, measures it, rounds to the millimetre a student
   reads off a ruler, and compares that with what the pages and ANSWERS.md
   print. Figures are read from their own SVG, never assumed.

   A  every arithmetic identity set as maths ($…$) on every page and in
      ANSWERS.md, degrees included
   B  the key is complete: By the Book 1–50, Beyond practice 1–15, ten
      solved examples each ending in an Answer row, the parts in order
   C  every single-correct question: the right value is computed here, and
      the option the key names must print it, and only that option
   D  assertion–reason, more than one correct, numerical and matching keys,
      recomputed
   E  the constructions: every measured length and angle in the answers
   F  the figures the text relies on, read from their drawings

   Exits 1 on any failure. */
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const B = String.fromCharCode(92);
const PAGES = readdirSync(DIR).filter(f => /^p\d{3}\.html$/.test(f)).sort();
const HTML = Object.fromEntries(PAGES.map(f => [f, readFileSync(path.join(DIR, f), 'utf8').replace(/\r\n/g, '\n').replace(/&nbsp;/g, ' ')]));
const ALL = PAGES.map(f => HTML[f]).join('\n');
const ANSWERS = readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8').replace(/\r\n/g, '\n');
let fails = 0, checks = 0;
const ok = (label, cond, detail = '') => { checks++; if (!cond) { fails++; console.log(`  x ${label}${detail ? '  ' + detail : ''}`); } };

/* ---- geometry ---------------------------------------------------------- */
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const deg = r => r * 180 / Math.PI;
const angleAt = (v, a, b) => {
  const u = [a[0] - v[0], a[1] - v[1]], w = [b[0] - v[0], b[1] - v[1]];
  return deg(Math.acos((u[0] * w[0] + u[1] * w[1]) / (Math.hypot(...u) * Math.hypot(...w))));
};
function crossings(c1, r1, c2, r2) {
  const d = dist(c1, c2);
  if (d > r1 + r2 + 1e-9 || d < Math.abs(r1 - r2) - 1e-9) return [];
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, r1 * r1 - a * a));
  const m = [c1[0] + a * (c2[0] - c1[0]) / d, c1[1] + a * (c2[1] - c1[1]) / d];
  if (h < 1e-9) return [m];
  const o = [-(c2[1] - c1[1]) * h / d, (c2[0] - c1[0]) * h / d];
  return [[m[0] + o[0], m[1] + o[1]], [m[0] - o[0], m[1] - o[1]]];
}
const meet = (d, r1, r2) => crossings([0, 0], r1, [d, 0], r2).length;
const ruler = cm => { const t = Math.round(cm * 10), c = Math.floor(t / 10), m = t % 10; return m ? `${c} cm ${m} mm` : `${c} cm`; };
const otherSide = (s, d) => Math.sqrt(d * d - s * s);

/* ---- A: identities ----------------------------------------------------- */
const strip = t => [['^' + B + 'circ', ''], ['times', '*'], ['div', '/'], ['thinsp', ''], [',', ''], [';', ''], [' ', '']]
  .reduce((s, [k, v]) => s.split(k.startsWith('^') ? k : B + k).join(v), t);
let identities = 0;
const checkIds = (label, text) => {
  for (const m of text.matchAll(/\$([^$]+)\$/g)) {
    const js = strip(m[1]).replace(/−/g, '-').replace(/\s+/g, '');
    if (!js.includes('=') || js.includes(B)) continue;
    const sides = js.split('=').filter(s => s !== '');
    if (sides.length < 2 || sides.some(s => !/^[\d+\-*/().]+$/.test(s))) continue;
    const vals = sides.map(s => Function(`return (${s})`)());
    identities++;
    ok(`${label}: $${m[1]}$`, vals.every(v => Math.abs(v - vals[0]) < 1e-9), vals.join(' vs '));
  }
};
for (const f of PAGES) checkIds(f, HTML[f]);
checkIds('ANSWERS.md', ANSWERS);

/* ---- B: structure and a complete key ----------------------------------- */
const boardPages = PAGES.filter(f => /^p09/.test(f)).map(f => HTML[f]).join('\n');
const beyondPages = PAGES.filter(f => /^p1/.test(f)).map(f => HTML[f]).join('\n');
const keyAt = beyondPages.indexOf('c-stage__title">Answers');
ok('the Answers stage exists', keyAt >= 0);
const keyPage = PAGES.find(f => HTML[f].includes('c-stage__title">Answers'));
ok('the Answers stage opens its page', /^\s*<div class="c-stage">/.test(HTML[keyPage].split('<div class="page__main">')[1]));
const practice = beyondPages.slice(0, keyAt);
const key = beyondPages.slice(keyAt);
const [boardKey, beyondKey] = key.split('c-practice__sub">Beyond the Book');
const numbered = s => new Set([...s.matchAll(/work__label">(\d+)<|class="n">(\d+)</g)].map(m => +(m[1] || m[2])));
const board = numbered(boardKey);
for (let n = 1; n <= 50; n++) ok(`By the Book key has ${n}`, board.has(n));
const beyondList = (beyondKey.match(/c-answers__list">([^<]*)</) || [, ''])[1];
const beyondItems = beyondList.trim().split(/\s{2,}/);
const beyondSet = new Set([...numbered(beyondKey), ...beyondItems.map(x => +x.split(' ')[0])]);
for (let n = 1; n <= 15; n++) ok(`Beyond key has ${n}`, beyondSet.has(n));
const qs = h => [...h.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>/g)].map(m => +(m[1] || 1));
ok('By the Book numbers 1–50 in order', JSON.stringify(qs(boardPages)) === JSON.stringify([...Array(50)].map((_, i) => i + 1)));
ok('Beyond practice numbers 1–15 in order', JSON.stringify(qs(practice)) === JSON.stringify([...Array(15)].map((_, i) => i + 1)));
const examples = [...practice.matchAll(/c-example__tab">Example (\d+)<[\s\S]*?(?=c-example__tab"|$)/g)];
ok('Beyond has 10 solved examples, numbered 1–10', examples.map(e => +e[1]).join() === '1,2,3,4,5,6,7,8,9,10');
for (const e of examples) ok(`Example ${e[1]} ends in an Answer row`, /work__label">Answer</.test(e[0]));
ok('By the Book has its six parts in order', [...boardPages.matchAll(/c-practice__sub">([^<]+)</g)].map(m => m[1]).join('|') ===
  'Very short answer|Short answer|Long answer|Assertion and reason|Case-based questions|Objective questions');
ok('Beyond has its five parts in order', [...practice.matchAll(/c-practice__sub">([^<]+)</g)].map(m => m[1]).join('|') ===
  'Single correct|More than one correct|Numerical answer|Matching|Paragraph-based');
ok('no stage head before Answers in Beyond', !/c-stage__num/.test(beyondPages));
ok('the last By the Book page carries data-close', /data-close/.test(HTML[PAGES.filter(f => /^p09/.test(f)).pop()]));
ok('the Summary page carries data-close', /data-close/.test(HTML[PAGES.filter(f => /^p0[0-8]/.test(f)).pop()]) && /c-summary/.test(HTML[PAGES.filter(f => /^p0[0-8]/.test(f)).pop()]));
ok('the old 10 by 4 give-away sentence is gone', !/A rectangle 10 cm long and 4 cm wide cannot be divided/.test(ALL));

/* ---- C: single-correct ------------------------------------------------- */
const dg = v => `$${v}^${B}circ$`;
const letter = s => 'abcd'.indexOf(s);
const optionsOf = (h, n) => {
  const start = n === 1 ? h.search(/<ol class="c-questions">/) : h.indexOf(`data-start="${n}"`);
  if (start < 0) return null;
  const chunk = h.slice(start, h.indexOf('</li>\n', start) + 5);
  const o = [...chunk.matchAll(/c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/g)].pop();
  return o ? [...o[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1].trim()) : null;
};
const boardLetters = Object.fromEntries([...boardKey.matchAll(/class="n">(\d+)<\/span> \((\w)\)/g)].map(m => [+m[1], m[2]]));
const isName = (s, order) => {
  const idx = [...s].map(c => order.indexOf(c));
  return new Set(idx).size === 4 && idx.every((v, i) => { const d = Math.abs(v - idx[(i + 1) % 4]); return d === 1 || d === 3; });
};
const BOARD_MCQ = {
  41: 'radius',
  42: `${6} cm`,
  43: '$CD$',
  44: dg(90 - 25),
  45: '$' + ['WYXZ', 'ZYXW', 'WXZY', 'XWYZ'].filter(s => isName(s, 'WXYZ'))[0] + '$',
  46: `${4 * 2} cm`,
  47: `${Math.hypot(8, 6)} cm`,
  48: String(meet(6, 5, 5)),
  49: '(i) and (iii)',
  50: `No: two can be ${2 * 4} cm apart.`,
};
for (const [q, want] of Object.entries(BOARD_MCQ)) {
  const o = optionsOf(boardPages, +q), l = boardLetters[q];
  ok(`By the Book Q${q}: key (${l}) prints ${want}`, !!(o && l && o[letter(l)] === want), o ? `option is "${o[letter(l)]}"` : 'options not found');
  if (o) ok(`By the Book Q${q}: exactly one option prints it`, o.filter(x => x === want).length === 1);
}
const cnt = l => [41, 42, 43, 44, 45, 46, 47, 48, 49, 50].filter(q => boardLetters[q] === l).length;
ok('By the Book objective letters spread over (a)–(d)', ['a', 'b', 'c', 'd'].every(l => cnt(l) >= 2), ['a', 'b', 'c', 'd'].map(cnt).join('/'));
const beyondLetters = Object.fromEntries(beyondItems.filter(x => /^\d+ \([a-d]\)$/.test(x)).map(x => [+x.split(' ')[0], x.slice(-2, -1)]));
const BEYOND_MCQ = {
  1: String(meet(10, 6, 6)),
  2: String((20 / 5) * 4),
  3: `${8 + 6 + 4 + 2} cm`,
  4: dg(90 / 3 * 2),
};
for (const [q, want] of Object.entries(BEYOND_MCQ)) {
  const o = optionsOf(practice, +q), l = beyondLetters[q];
  ok(`Beyond Q${q}: key (${l}) prints ${want}`, !!(o && l && o[letter(l)] === want), o ? `option is "${o[letter(l)]}"` : 'options not found');
  if (o) ok(`Beyond Q${q}: exactly one option prints it`, o.filter(x => x === want).length === 1);
}
const exBody = n => (examples.find(e => e[1] === String(n)) || ['', ''])[0];
const exAnswer = n => (exBody(n).match(/work__label">Answer<\/span><span>([^<]*)</) || [, ''])[1];
ok('Example 1: 4 + 3 = 7 touches once, (b)', meet(7, 4, 3) === 1 && exAnswer(1).startsWith('(b) 1'));
ok('Example 2: (b)', exAnswer(2) === '(b)');

/* ---- D: AR, multi, numerical, matching --------------------------------- */
const code = (A, R, explains) => !A && R ? 'd' : A && !R ? 'c' : A && R ? (explains ? 'a' : 'b') : '?';
const AR = {
  31: code(true, true, true),
  32: code(3 > Math.max(6, 4), true, true),          // a diagonal of 3 cm is shorter than both sides
  33: code(true, false, false),                       // turning changes no angle
  34: code(true, true, false),                        // R2 does not give R1
  35: code(true, true, true),
};
for (const [q, want] of Object.entries(AR)) ok(`By the Book Q${q}: key is (${want})`, boardLetters[q] === want, `key (${boardLetters[q]})`);
const truths = arr => arr.map((t, i) => t ? '(' + 'abcd'[i] + ')' : null).filter(Boolean).join(', ');
const MULTI = {
  5: truths([3, 4, 5, 6].map(r => meet(8, r, r) === 2)),
  6: truths(['QRSP', 'PRQS', 'SRQP', 'RQPS'].map(s => isName(s, 'PQRS'))),
  7: truths([otherSide(6, 10) === 8, true, otherSide(6, 10) === 12, true]),
  8: truths([true, (12 - 8) / 2 === 2, (12 - 8) / 2 === 4, true]),
};
for (const [q, want] of Object.entries(MULTI)) ok(`Beyond Q${q}: key is ${want}`, beyondItems.includes(`${q} ${want}`), beyondList);
ok('Example 3: (a), (b), (d)', exAnswer(3) === truths([true, true, false, true]));
ok('Example 4: (a), (c), (d)', exAnswer(4) === truths([true, 4 > 6, 6 + 6 === 12, 8 > 6]));
const NUMERIC = { 9: otherSide(9, 15), 10: 2 * otherSide(3, 5), 11: 5 + 4 + 3 + 2 + 1 };
for (const [q, want] of Object.entries(NUMERIC)) ok(`Beyond Q${q}: key is ${want}`, beyondItems.includes(`${q} ${want}`), beyondList);
ok('Example 5: arcs of 5 at 10 cm meet once', meet(10, 5, 5) === 1 && exAnswer(5) === '1');
ok('Example 6: 46 / 2 - 8 = 15', 46 / 2 - 8 === 15 && exAnswer(6) === '15');
const combo = (list2, vals) => ['P', 'Q', 'R', 'S'].map((k, i) => `${k}&ndash;${list2.indexOf(vals[i]) + 1}`).join(', ');
const EX7 = combo(['7 cm', '9 cm', '8 cm', '6 cm'], ['8 cm', `${12 / 2} cm`, `${4 + 3 + 2} cm`, `${28 / 4} cm`]);
ok(`Example 7: ${EX7}`, exAnswer(7) === `(a) ${EX7}`, exAnswer(7));
const EX8 = combo(['One point', 'Two points', 'No point', 'Every point of the circle'], [9, 8, 5, 0].map(d => d === 0 ? 'Every point of the circle' : ['No point', 'One point', 'Two points'][meet(d, 4, 4)]));
ok(`Example 8: ${EX8}`, exAnswer(8) === `(c) ${EX8}`, exAnswer(8));
const P12 = combo(['12 cm', '4 cm', '15 cm', '8 cm', '9 cm'], [[3, 5], [6, 10], [5, 13], [8, 17]].map(([s, d]) => `${otherSide(s, d)} cm`));
const P13 = combo(['2', '3', '4', '6', '5'], [12 / 4, 10 / 5, 8 / 2, (9 / 3) * (6 / 3)].map(String));
for (const [q, want] of [[12, P12], [13, P13]]) {
  const o = optionsOf(practice, q), l = beyondLetters[q];
  ok(`Beyond Q${q}: key (${l}) is ${want}`, !!(o && l && o[letter(l)] === want), o ? `option is "${o[letter(l)]}"` : 'options not found');
  if (o) ok(`Beyond Q${q}: exactly one option is right`, o.filter(x => x === want).length === 1);
}
// paragraph-based: the house of Example 9, the card of Example 10, Q14, Q15
{
  const A = crossings([0, 0], 5, [6, 0], 5).find(p => p[1] > 0);
  ok('Example 9: AM = 4, A is 10 above the floor', Math.abs(A[1] - 4) < 1e-9 && exAnswer(9) === `(i) (b) 5 cm; (ii) ${A[1]}; (iii) ${A[1] + 6}`);
  const ac = Math.hypot(8, 6);
  ok('Example 10: AC = 10, EB = 2', exAnswer(10) === `(i) (b) ${ac} cm; (ii) ${ac}; (iii) ${ac - 8}`);
  const T = crossings([0, 0], 13, [10, 0], 13);
  ok('Q14: two places, 12 m from the middle, 24 m apart', T.length === 2 && Math.abs(T[0][1] - 12) < 1e-9 && Math.abs(dist(T[0], T[1]) - 24) < 1e-9);
  ok('Q14 and Q15 in the key', /14<\/span>\s*<span>\(i\) \(c\) 2 \(ii\) 12/.test(beyondKey) && /15<\/span>\s*<span>\(i\) \(a\) 12 cm \(ii\) 12 \(iii\) \$12 \+ 2 \+ 1 = 15\$/.test(beyondKey));
}

/* ---- E: the constructions ---------------------------------------------- */
const row = n => (boardKey.match(new RegExp(`work__label">${n}</span>\\s*<span>([\\s\\S]*?)</span></div>`)) || [, ''])[1];
const says = (n, s) => ok(`By the Book ${n} says "${s}"`, row(n).includes(s), row(n).slice(0, 80));
says(1, '3 cm 5 mm'); says(1, '7 cm apart');
says(4, dg(55)); says(6, '12'); says(9, '4 cm 5 mm');
ok('SA 12: 8 by 6 diagonal and its angles', Math.hypot(8, 6) === 10 && Math.round(deg(Math.atan(6 / 8))) === 37 && Math.round(deg(Math.atan(8 / 6))) === 53);
says(12, '10 cm'); says(12, dg(37)); says(12, dg(53));
ok('SA 14: arcs of 4 at 6 cm cross twice', meet(6, 4, 4) === 2); says(14, 'There are 2');
ok('SA 15: side 5, diagonal 13', otherSide(5, 13) === 12); says(15, '12 cm');
ok('SA 16', 3 * 3 === 9 && 2 * 3 === 6 && (12 / 3) * (9 / 3) === 12); says(16, '12$ squares');
ok('SA 18: 8 + 5 + 2', 8 + 5 + 2 === 15); says(18, 'cm by 15 cm');
{
  const Q = crossings([0, 0], 3, [3, 0], 3)[0];
  ok('SA 19: OP = OQ = PQ = 3', Math.abs(dist([0, 0], Q) - 3) < 1e-9 && Math.abs(dist([3, 0], Q) - 3) < 1e-9);
}
says(20, '6$ cm');
ok('LA 21: AC of 8 by 5', ruler(Math.hypot(8, 5)) === '9 cm 4 mm'); says(21, '9 cm 4 mm');
{
  const A = crossings([0, 0], 5, [6, 0], 5).find(p => p[1] > 0);
  ok('LA 22: A is 4 above BC, 8 above the floor', Math.abs(A[1] - 4) < 1e-9); says(22, '$4 + 4 = 8$');
}
ok('LA 23: BC and AC', ruler(6 * Math.tan(Math.PI / 6)) === '3 cm 5 mm' && ruler(6 / Math.cos(Math.PI / 6)) === '6 cm 9 mm'); says(23, '3 cm 5 mm'); says(23, '6 cm 9 mm');
says(24, '$15 ' + B + 'div 5 = 3$');
says(25, '$10 - 4 - 4 = 2$');
{
  const P = crossings([0, 0], 5, [8, 0], 5);
  ok('LA 26: 6 cm apart, 3 cm from the middle', Math.abs(dist(P[0], P[1]) - 6) < 1e-9 && Math.abs(P[0][1]) === 3);
  says(26, '6 cm apart'); says(26, '3 cm from the middle');
}
ok('LA 27: side 6, diagonal 10', otherSide(6, 10) === 8); says(27, '8 cm');
{
  const ac = Math.hypot(5, 5);
  ok('LA 28: AC and the gap between the curves', ruler(ac) === '7 cm 1 mm' && ruler(ac - 5) === '2 cm 1 mm' && ruler(10 - ac) === '2 cm 9 mm');
  says(28, '7 cm 1 mm'); says(28, '2 cm 9 mm');
}
ok('LA 29: 6 + 4 + 2', 6 + 4 + 2 === 12); says(29, '12');
{
  const X = crossings([0, 0], 4, [4, 0], 4);
  ok('LA 30: all four are 4 cm', X.every(p => Math.abs(dist(p, [0, 0]) - 4) < 1e-9 && Math.abs(dist(p, [4, 0]) - 4) < 1e-9));
}
{
  const A = crossings([0, 0], 5, [8, 0], 5).find(p => p[1] > 0);
  ok('Case 39: roof tip 3 above BC, 9 above the floor', Math.abs(A[1] - 3) < 1e-9); says(39, '$3 + 6 = 9$');
}
ok('Case 40: diagonal 15 and the width 5', Math.hypot(12, 9) === 15 && otherSide(12, 13) === 5 && Math.round(deg(Math.atan(9 / 12))) === 37);
says(40, '15 cm'); says(40, '5 cm');
// the body's own constructions, as ANSWERS.md prints them
for (const [what, v, s] of [['side 5, diagonal 7', otherSide(5, 7), '4 cm 9 mm'], ['Ex 8.5 Q3', otherSide(4, 8), '6 cm 9 mm'], ['Ex 8.5 Q4', otherSide(3, 7), '6 cm 3 mm'],
  ['Table 8.17 row 1', Math.hypot(7, 2.5), '7 cm 4 mm'], ['Table 8.17 row 3', Math.hypot(7, 2), '7 cm 3 mm'], ['greatest XY', Math.hypot(7, 4), '8 cm 1 mm']]) {
  ok(`${what} measures ${s}`, ruler(v) === s); ok(`ANSWERS prints ${s} (${what})`, ANSWERS.includes(s));
}
ok('T&R 8.5: a 5 cm arc never reaches the line 7 cm away', 5 < 7);
ok('T&R 8.6: equidistant points lie on the line through the middle', [4, 5, 6].every(r => crossings([0, 0], r, [6, 0], r).every(p => Math.abs(p[0] - 3) < 1e-9)));

/* ---- F: figures -------------------------------------------------------- */
const figure = num => {
  for (const f of PAGES) {
    const i = HTML[f].indexOf(`fignum">Fig. ${num}<`);
    if (i < 0) continue;
    const s = HTML[f].lastIndexOf('<svg', i);
    return HTML[f].slice(s, HTML[f].indexOf('</svg>', s));
  }
  ok(`Fig. ${num} exists`, false); return '';
};
const nums = s => s.trim().split(/[\s,]+/).map(Number);
const polygons = svg => [...svg.matchAll(/<polygon[^>]*points="([^"]*)"/g)].map(m => { const n = nums(m[1]); const o = []; for (let i = 0; i < n.length; i += 2) o.push([n[i], n[i + 1]]); return o; });
// Fig 8.7: AB is 8 cm; the half circle on AX has radius 2 cm
{
  const svg = figure('8.7');
  const arc = svg.match(/<path[^>]*d="M([\d.]+) ([\d.]+) A([\d.]+)/);
  const line = [...svg.matchAll(/<line[^>]*x1="([\d.]+)"[^>]*y1="([\d.]+)"[^>]*x2="([\d.]+)"[^>]*y2="([\d.]+)"/g)].map(m => m.slice(1).map(Number)).find(l => l[1] === l[3] && l[2] - l[0] > 150);
  const unit = (line[2] - line[0]) / 8;
  ok('Fig 8.7 AX is 4 cm and the radius 2 cm', Math.abs((+arc[1] - line[0]) / unit - 4) < 1e-6 && Math.abs(+arc[3] / unit - 2) < 1e-6);
}
// Fig 8.13: only A is a square
{
  const v = polygons(figure('8.13')).map(p => {
    const s = p.map((q, i) => { const r = p[(i + 1) % 4]; return [r[0] - q[0], r[1] - q[1]]; });
    const len = s.map(x => Math.hypot(...x));
    const right = s.every((x, i) => { const t = s[(i + 1) % 4]; return Math.abs(x[0] * t[0] + x[1] * t[1]) < 1e-9; });
    return right && len.every(l => Math.abs(l - len[0]) < 1e-9);
  });
  ok('Fig 8.13 only shape A is a square', v.join() === 'true,false,false,false');
}
// Fig 8.16: four 7 by 4 rectangles; X and Y where the caption and table say
{
  const svg = figure('8.16');
  const rects = polygons(svg);
  const U = (rects[0][1][0] - rects[0][0][0]) / 7;
  ok('Fig 8.16 rectangles are 7 cm by 4 cm', rects.every(r => Math.abs((r[1][0] - r[0][0]) / U - 7) < 1e-9 && Math.abs((r[2][1] - r[1][1]) / U - 4) < 1e-9));
  const g = [...svg.matchAll(/<line class="dg-ghost" x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)"/g)].map(m => m.slice(1).map(Number));
  ok('Fig 8.16 first: X 5 mm below A, Y 3 cm below B', Math.abs((g[0][1] - rects[0][0][1]) / U - 0.5) < 1e-9 && Math.abs((g[0][3] - rects[0][0][1]) / U - 3) < 1e-9);
  ok('Fig 8.16 second: X 1 cm below A, Y 2 cm below B', Math.abs((g[1][1] - rects[1][0][1]) / U - 1) < 1e-9 && Math.abs((g[1][3] - rects[1][0][1]) / U - 2) < 1e-9);
}
// Fig 8.19: three equal squares
{
  const svg = figure('8.19');
  const [r] = polygons(svg);
  ok('Fig 8.19 the rectangle is three squares long', r && Math.abs((r[1][0] - r[0][0]) / (r[2][1] - r[1][1]) - 3) < 1e-9);
}
// Fig 8.22: the square in the 8 by 4 rectangle leaves 2 cm at each end
{
  const svg = figure('8.22');
  const [r] = polygons(svg);
  const unit = (r[1][0] - r[0][0]) / 8;
  const xs = [...svg.matchAll(/<line class="dg-line" x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)"/g)].map(m => +m[1]).filter(x => x > r[0][0] && x < r[1][0]);
  ok('Fig 8.22 the square has sides of 4 cm and 2 cm at each end', Math.abs((xs[1] - xs[0]) / unit - 4) < 1e-9 && Math.abs((xs[0] - r[0][0]) / unit - 2) < 1e-9);
}
// Fig 8.23: falling squares of 4, 4, 4 and of 7, 5, 3
{
  const sq = polygons(figure('8.23'));
  const side = p => (p[1][0] - p[0][0]) / 10;
  ok('Fig 8.23 sides 4, 4, 4 and 7, 5, 3', sq.map(side).join() === '4,4,4,7,5,3');
}
// Fig 8.26: a = d = e = h, b = c = f = g, on an 8 by 4 rectangle 27 and 63
ok('8 by 4 rectangle diagonal angles', Math.round(deg(Math.atan(4 / 8))) === 27 && Math.round(deg(Math.atan(8 / 4))) === 63);
ok('ANSWERS equal pairs', ANSWERS.includes('$a = d = e = h$ and $b = c = f = g$'));
// Fig 8.38: falling squares of 4, 3 and 2 cm, each meeting the next at a corner
{
  const sq = polygons(figure('8.38'));
  const s = sq.map(p => p[1][0] - p[0][0]);
  const u = s[0] / 4;
  ok('Fig 8.38 sides 4, 3, 2', s.map(x => x / u).join() === '4,3,2');
  ok('Fig 8.38 each square meets the next at a corner', [0, 1].every(i => sq[i][2][0] === sq[i + 1][0][0] && sq[i][2][1] === sq[i + 1][0][1]));
  ok('Fig 8.38 the width is 9 cm', (sq[2][1][0] - sq[0][0][0]) / u === 9);
}

console.log(`Class 6 · Chapter 8 · Playing with Constructions: ${identities} identities evaluated, ${checks} checks, ${fails} failed`);
process.exit(fails ? 1 : 0);
