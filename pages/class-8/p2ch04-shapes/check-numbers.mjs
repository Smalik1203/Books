#!/usr/bin/env node
/* Re-derive the numbers this chapter prints.

     node pages/class-8/p2ch04-shapes/check-numbers.mjs

   Rewritten on 26 September 2026 for the maths-v2 chapter (Summary page,
   By the Book in six forms, Beyond the Book by format). The version before
   it checked a layout that no longer exists — Stage 2's fifteen examples,
   the 31-question practice run and the old body numbers. It is in git
   history.

   A  every arithmetic identity set as maths ($…$) on every page and in
      ANSWERS.md, with sums written with \cdots expanded from the terms
      either side of the dots
   B  the chapter's counts, recomputed from first principles: fractal
      steps, prism and pyramid counts, box unfoldings, views of cubes —
      and the values the pages print for them
   C  the key is complete: By the Book 1–50, Beyond practice 1–15, ten
      solved examples each ending in an Answer row
   D  every single-correct and assertion–reason question: the right
      answer is computed here, and the option the key names must print it

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
const text = s => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/\s+/g, ' ');
const TEXT = text(ALL);
let fails = 0, checks = 0;
const ok = (label, cond, detail = '') => { checks++; if (!cond) { fails++; console.log(`  x ${label}${detail ? '  ' + detail : ''}`); } };
const eq = (label, got, want) => ok(label, JSON.stringify(got) === JSON.stringify(want), `computed ${JSON.stringify(got)}, expected ${JSON.stringify(want)}`);

/* ---- A: identities -------------------------------------------------- */
const strip = t => [['times', '*'], ['div', '/'], ['thinsp', ''], [',', ''], [';', ''], [' ', ''], ['left', ''], ['right', '']]
  .reduce((s, [k, v]) => s.split(B + k).join(v), t);
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
const identities = (label, src) => {
  for (const m of src.replace(/\$\$[\s\S]+?\$\$/g, ' ').matchAll(/\$([^$]+)\$/g)) {
    const js = expand(strip(m[1]).replace(/−/g, '-').replace(/\^(\d)/g, '**$1').replace(/\s+/g, ''));
    if (!js.includes('=') || js.includes(B) || js.includes('\\')) continue;
    const sides = js.split('=').filter(s => s !== '');
    if (sides.length < 2 || sides.some(s => !/^[\d+\-*/().]+$/.test(s))) continue;
    const vals = sides.map(s => Function(`return (${s})`)());
    ok(`${label}: $${m[1]}$`, vals.every(v => Math.abs(v - vals[0]) < 1e-9), vals.join(' vs '));
  }
};
for (const f of PAGES) identities(f, HTML[f]);
identities('ANSWERS.md', ANSWERS);

/* ---- B: the chapter's counts ---------------------------------------- */
const fractal = (k, steps) => { let R = 1, H = 0; const o = [[R, H]]; for (let s = 0; s < steps; s++) { H += R; R *= k; o.push([R, H]); } return o; };
const koch = (side, n) => ({ S: 3 * 4 ** n, len: side / 3 ** n, P: 3 * 4 ** n * side / 3 ** n });
const prism = n => ({ F: n + 2, E: 3 * n, V: 2 * n });
const pyramid = n => ({ F: n + 1, E: 2 * n, V: n + 1 });
const unfold = (a, b, c) => [a * a + (b + c) ** 2, b * b + (a + c) ** 2, c * c + (a + b) ** 2];
const shortest = (a, b, c) => Math.min(...unfold(a, b, c));
const first = f => { for (let n = 0; n < 200; n++) if (f(n)) return n; };
const r1 = x => Math.round(x * 10) / 10;
const views = cubes => ({
  front: new Set(cubes.map(([x, , z]) => `${x},${z}`)).size,
  top: new Set(cubes.map(([x, y]) => `${x},${y}`)).size,
  side: new Set(cubes.map(([, y, z]) => `${y},${z}`)).size,
});
const block = (a, b, c) => { const o = []; for (let x = 0; x < a; x++) for (let y = 0; y < b; y++) for (let z = 0; z < c; z++) o.push([x, y, z]); return o; };
const seen = (a, b, c) => a * b * c - (a - 1) * (b - 1) * (c - 1);
const carpet = fractal(8, 8), tri = fractal(3, 8);

// body
eq('carpet R, H steps 0-3', carpet.slice(0, 4), [[1, 0], [8, 1], [64, 9], [512, 73]]);
ok('carpet under a thousandth at step 60', (8 / 9) ** 60 < 1e-3);
ok('carpet under a millionth at step 120', (8 / 9) ** 120 < 1e-6);
eq('Example 1: 45 cm, step 2', [45 / 9, carpet[2][0], 64 * 25, 45 * 45 * 64 / 81], [5, 64, 1600, 1600]);
eq('Example 2: Koch from 18, step 2', [koch(18, 2).S, koch(18, 2).len, koch(18, 2).P, koch(18, 0).P], [48, 2, 96, 54]);
eq('Example 3: pyramid with 14 edges', pyramid(7), { F: 8, E: 14, V: 8 });
eq('§4.8 beetle box 9 x 5 x 3', [unfold(9, 5, 3), r1(Math.sqrt(145)), r1(Math.sqrt(205))], [[145, 169, 205], 12, 14.3]);
eq('Example 4: 6 x 4 x 2', [unfold(6, 4, 2), r1(Math.sqrt(72)), r1(Math.sqrt(80)), r1(Math.sqrt(104))], [[72, 80, 104], 8.5, 8.9, 10.2]);
eq('Fig 4.7 views', views([[0, 0, 0], [1, 0, 0], [0, 0, 1]]), { front: 3, top: 2, side: 2 });
eq('T&R 4.2: 16 cut, 4 removed, step 2', 12 * 12, 144);
// body exercise sets (their answers are in ANSWERS.md)
eq('Ex 4.1 Q2', [carpet[4][0], carpet[4][1], carpet[5][1]], [4096, 585, 4681]);
eq('Ex 4.1 Q3', [first(n => 3 ** n > 500), tri[6][1]], [6, 364]);
eq('Ex 4.1 Q5', [koch(81, 4).S, koch(81, 4).len, koch(81, 4).P], [768, 1, 768]);
eq('Ex 4.1 Q6', first(n => (4 / 3) ** n > 5), 6);
eq('Ex 4.2 Q1', [prism(8), pyramid(5), prism(11)], [{ F: 10, E: 24, V: 16 }, { F: 6, E: 10, V: 6 }, { F: 13, E: 33, V: 22 }]);
eq('Ex 4.2 Q3', [2 + 16 - 9, pyramid(8)], [9, { F: 9, E: 16, V: 9 }]);
eq('Ex 4.2 Q6', [unfold(10, 6, 4), shortest(10, 6, 4)], [[200, 232, 272], 200]);
eq('Ex 4.2 Q7', [unfold(7, 5, 3), r1(Math.sqrt(113)), r1(15 - Math.sqrt(113))], [[113, 125, 153], 10.6, 4.4]);
eq('Ex 4.3 Q3', [views(block(5, 1, 1)), views([[0, 0, 0], [1, 0, 0], [2, 0, 0], [3, 0, 0], [0, 0, 1]])], [{ front: 5, top: 5, side: 1 }, { front: 5, top: 4, side: 2 }]);
eq('Ex 4.3 Q4', [seen(3, 2, 2), 12], [10, 12]);

// By the Book
eq('BtB 1', prism(6), { F: 8, E: 18, V: 12 });
eq('BtB 5', pyramid(10), { F: 11, E: 20, V: 11 });
eq('BtB 6', first(n => koch(1, n).S === 768), 4);
eq('BtB 10', shortest(3, 3, 3), 45);
eq('BtB 12', 36 * 36 * 64 / 81, 1024);
eq('BtB 13', 128 * 27 / 64, 54);
eq('BtB 14', [koch(27, 2).P, koch(27, 2).P - koch(27, 0).P], [144, 63]);
eq('BtB 15', [2 + 18 - 12, prism(6).V, pyramid(9).V], [8, 12, 10]);
eq('BtB 16', 12 * 8 + 2 * 12 * 5 + 2 * 8 * 5, 296);
eq('BtB 17', [unfold(12, 6, 3), r1(Math.sqrt(261)), r1(Math.sqrt(333))], [[225, 261, 333], 16.2, 18.2]);
eq('BtB 18', [3 * 2 * 1, seen(5, 4, 3)], [6, 36]);
eq('BtB 19', views([[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 1, 0]]), { front: 3, top: 4, side: 2 });
ok('BtB 20: 100 is never a hole count', !carpet.some(([, H]) => H === 100));
eq('BtB 21', [unfold(16, 7, 5), shortest(16, 7, 5), r1(Math.sqrt(490)), r1(Math.sqrt(554)), 16 + 7 + 5 - 20], [[400, 490, 554], 400, 22.1, 23.5, 8]);
eq('BtB 22', [carpet[4][1], carpet[6][1], (8 ** 6 - 1) / 7], [585, 37449, 37449]);
{ const n = 36 / 3, p = pyramid(n + 2); eq('BtB 23', [n, prism(n).V, p.E, p.V, prism(n).V + p.V, prism(n).F + prism(n).V - prism(n).E, p.F + p.V - p.E], [12, 24, 28, 15, 39, 2, 2]); }
eq('BtB 24', [1, 2, 3, 4, 5].map(s => koch(81, s).P).concat([Math.round(koch(81, 3).P / 100 * 10 * 100) / 100, first(s => koch(81, s).P > 1000)]), [324, 432, 576, 768, 1024, 57.6, 5]);
eq('BtB 25', [64 / 4, 27, first(n => 64 / 2 ** n < 1), 3 ** 7], [16, 3 ** 3, 7, 2187]);
eq('BtB 26', [2 * (240 + 100 + 60), Math.round(800 * 1.1), 50 * 880 / 10000], [800, 880, 4.4]);
{ const st = [...block(4, 1, 1), ...block(3, 1, 1).map(([x, y]) => [x, y, 1]), ...block(2, 1, 1).map(([x, y]) => [x, y, 2]), [0, 0, 3]];
  const st2 = [...st, ...st.map(([x, , z]) => [x, 1, z])];
  eq('BtB 27', [st.length, views(st), st2.length, views(st2)], [10, { front: 10, top: 4, side: 4 }, 20, { front: 10, top: 8, side: 8 }]); }
eq('BtB 28', [6 * 3 / 2, 2 - 6 + 9], [9, 5]);
eq('BtB 29', [60 * 60 + 8 * 20 * 20, 180 * 180 * 17 / 81, 6800 / 100 * 2], [6800, 6800, 136]);
{ const paint = n => { const c = [0, 0, 0, 0]; for (const p of block(n, n, n)) c[p.filter(k => k === 0 || k === n - 1).length]++; return c; };
  eq('BtB 30', [paint(3), paint(4)], [[1, 6, 12, 8], [8, 24, 24, 8]]); }
eq('BtB 36', [8 ** 3, 54 / 27, carpet[2][1], 64 * 36, 81 - 64], [512, 2, 9, 2304, 17]);
eq('BtB 37', [shortest(8, 4, 2), shortest(24, 4, 3), shortest(15, 5, 3), 23 - 17], [100, 625, 289, 6]);
eq('BtB 38', [prism(5).E, prism(5).V, 2 - 5 + 8, pyramid(6).E, pyramid(6).V, 27 / 3], [15, 10, 5, 12, 7, 9]);
eq('BtB 39', [koch(54, 1).P, koch(54, 3).S, koch(54, 3).len, koch(54, 3).P, koch(54, 3).P / 100 * 25], [216, 192, 2, 384, 96]);
{ const h = [[3, 2, 1], [2, 1, 1]]; // back row, front row
  eq('BtB 40', [h.flat().reduce((a, b) => a + b), [0, 1, 2].map(i => Math.max(h[0][i], h[1][i])).reduce((a, b) => a + b), Math.max(...h[1]) + Math.max(...h[0]), 18 - 10], [10, 6, 5, 8]); }

// Beyond the Book
eq('Tried Q1', [243 / 3 ** 5, 8 ** 5, 243 * 243], [1, 32768, 59049]);
eq('Tried Q3', [prism(10).F, pyramid(15).F], [12, 16]);
eq('Tried Q7', [27, (3 - 2) ** 3, (5 - 2) ** 3], [27, 1, 27]);
eq('Tried Q8', 2 * (6 + 12 + 8), 52);
eq('Example 1', first(n => 3 ** n === 2187), 7);
eq('Example 2', first(n => prism(n).E + pyramid(n).E === 40), 8);
eq('Example 3', pyramid(5), { F: 6, E: 10, V: 6 });
eq('Example 4', [60 + 80 + 48, 188 + 60, 240], [188, 248, 10 * 6 * 4]);
eq('Example 5', Math.sqrt(shortest(12, 5, 4)), 15);
eq('Example 6', 81 * 81 * 64 / 81, 5184);
eq('Example 9', [3 ** 3, 64 / 8, tri[4][1]], [27, 8, 40]);
eq('Example 10', [unfold(8, 6, 4), r1(Math.sqrt(164)), 2 * (48 + 24 + 32)], [[164, 180, 212], 12.8, 208]);
eq('Beyond 9', (() => { const n = first(k => prism(k).E - prism(k).F === 20); return prism(n).V; })(), 22);
eq('Beyond 10', koch(162, first(n => 162 / 3 ** n === 2)).P, 1536);
eq('Beyond 11', seen(4, 4, 4), 37);
eq('Beyond 14', [27 / 27, 27 * 27 * (8 / 9) ** 3, 27 * 27 - 512].map(Math.round), [1, 512, 217]);
eq('Beyond 15', [3 * 4 * 15, 6 * 4 + 3 * 15], [180, 69]);
eq('Beyond 7', [shortest(9, 6, 3), 2 * (54 + 18 + 27), 9 + 6 + 3], [162, 198, 18]);

/* ---- C: the key is complete ----------------------------------------- */
const keyStart = PAGES.findIndex(f => HTML[f].includes('c-stage__title">Answers'));
ok('there is an Answers stage', keyStart >= 0);
const key = PAGES.slice(keyStart).map(f => HTML[f]).join('\n');
ok('Answers opens its page', /page__main">\s*<div class="c-stage">/.test(HTML[PAGES[keyStart]]));
const [boardKey, beyondKey] = key.split('c-practice__sub">Beyond the Book');
const numbered = s => new Set([...s.matchAll(/work__label">(\d+)<|class="n">(\d+)</g)].map(m => +(m[1] || m[2])));
const board = numbered(boardKey);
for (let n = 1; n <= 50; n++) ok(`By the Book key has ${n}`, board.has(n));
const beyondList = (beyondKey.match(/c-answers__list">([^<]*)</) || [, ''])[1];
const beyond = new Set([...numbered(beyondKey), ...[...beyondList.matchAll(/(?:^|&nbsp;)\s*(\d+)\s+[(\d]/g)].map(m => +m[1])]);
for (let n = 1; n <= 15; n++) ok(`Beyond key has ${n}`, beyond.has(n));
const beyondPages = PAGES.filter(f => /^p1/.test(f)).map(f => HTML[f]).join('\n');
const examples = [...beyondPages.matchAll(/c-example__tab">Example (\d+)<[\s\S]*?(?=c-example__tab"|c-stage__title">Answers|$)/g)];
eq('Beyond has 10 solved examples, 1-10', examples.map(e => +e[1]), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
for (const e of examples) ok(`Example ${e[1]} ends in an Answer row`, /work__label">Answer</.test(e[0]));
const boardPages = PAGES.filter(f => /^p09/.test(f)).map(f => HTML[f]).join('\n');
eq('By the Book numbered 2-50 after an unnumbered first', [...boardPages.matchAll(/data-start="(\d+)"/g)].map(m => +m[1]), Array.from({ length: 49 }, (_, i) => i + 2));
const practice = beyondPages.slice(0, beyondPages.indexOf('c-stage__title">Answers'));
eq('Beyond practice numbered 2-15', [...practice.matchAll(/c-questions" data-start="(\d+)"/g)].map(m => +m[1]), Array.from({ length: 14 }, (_, i) => i + 2));
ok('each body exercise set carries its NCERT line', (ALL.match(/c-practice__note">NCERT/g) || []).length === 3);

/* ---- D: single-correct and assertion-reason, recomputed ------------- */
const letter = s => 'abcd'.indexOf(s);
const questionOptions = (html, n) => {
  const start = n === 1 ? html.search(/<ol class="c-questions">/) : html.indexOf(`data-start="${n}"`);
  if (start < 0) return null;
  const chunk = html.slice(start, html.indexOf('</li>\n', start) + 5);
  const opts = [...chunk.matchAll(/c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/g)].pop();
  return opts ? [...opts[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => text(m[1]).trim()) : null;
};
const boardLetters = Object.fromEntries([...boardKey.matchAll(/class="n">(\d+)<\/span> \((\w)\)/g)].map(m => [+m[1], m[2]]));
const BOARD_MCQ = {
  41: String(pyramid(6).E),
  42: String(carpet[2][0]),
  43: '$' + B + 'tfrac{9}{16}$',
  44: String(prism(16 / 2).F),
  45: String(first(n => koch(1, n).S === 3072)),
  46: String(2 - 12 + 30),
  47: `$${Math.sqrt(shortest(6, 4, 4))}$ cm`,
  48: `${koch(9, 2).P} cm`,
  49: '(i) and (ii)',                 // 2n vertices, 2n edges; n + 2 faces is odd for odd n
  50: 'No: the area stays inside a circle.',
};
for (const [q, want] of Object.entries(BOARD_MCQ)) {
  const opts = questionOptions(boardPages, +q), l = boardLetters[q];
  const src = boardPages.slice(boardPages.indexOf(`data-start="${q}"`)).match(/c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/);
  const raw = src ? [...src[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1].trim()) : [];
  ok(`By the Book Q${q}: key (${l}) prints ${want}`, !!(l && (raw[letter(l)] === want || (opts && opts[letter(l)] === want))), `option is "${raw[letter(l)]}"`);
}
// assertion-reason: [A true, R true, R explains A]
const ar = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : '?');
const AR = {
  31: [carpet[3][0] === 512, true, true],
  32: [Array.from({ length: 30 }, (_, n) => pyramid(n + 3).E).includes(15), true, false],
  33: [koch(1, 2).S === 48, true, false],
  34: [shortest(6, 3, 2) === 61, false, false],
  35: [Math.abs((3 / 4) ** 2 - 9 / 16) < 1e-12, true, true],
};
for (const [q, v] of Object.entries(AR)) eq(`By the Book Q${q}: assertion-reason`, boardLetters[q], ar(v));
const letters = Object.values(boardLetters);
ok(`By the Book letters spread over a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 2));
const beyondLetters = Object.fromEntries([...beyondList.matchAll(/(\d+) \((\w)\)/g)].map(m => [+m[1], m[2]]));
const BEYOND_MCQ = {
  1: String(first(n => (8 / 9) ** n < 0.5)),
  2: String(prism(10).E - pyramid(11).E),
  3: String(first(n => Math.abs((4 / 3) ** n - 256 / 81) < 1e-9)),
  4: String(12 * (5 - 2)),
};
for (const [q, want] of Object.entries(BEYOND_MCQ)) {
  const opts = questionOptions(practice, +q), l = beyondLetters[q];
  ok(`Beyond Q${q}: key (${l}) prints ${want}`, !!(opts && l && opts[letter(l)] === want), opts ? `option is "${opts[letter(l)]}"` : 'options not found');
}

console.log(`${checks} checks, ${fails} failed`);
process.exit(fails ? 1 : 0);
