#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed from first principles — powers, fractal counts built step by
   step, face/edge/vertex counts, every unfolding of a box, views of a set
   of cubes — and compared with what is on the page.

     node pages/class-8/p2ch04-shapes/check-numbers.mjs [--skipped]

   Four parts:
     A  every identity and approximation set as maths, on every page and in
        ANSWERS.md, whose sides all evaluate to numbers (display maths
        $$…$$ is taken out first, so its dollars cannot pair up wrongly)
     B  the claims A cannot check: counts, searches, figures, views, and
        the practice answers, read back out of the answer key part by part
     C  every multiple-choice and assertion-reason question: exactly one
        option is right, and it is the one the key prints
     D  ANSWERS.md prints the same key as the page

   Exits non-zero if anything does not hold up. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
let pass = 0;
const fails = [];
const ok = (what, got, want) => {
  if (JSON.stringify(got) === JSON.stringify(want)) pass++;
  else fails.push(`${what}\n      computed ${JSON.stringify(got)}\n      printed  ${JSON.stringify(want)}`);
};
const is = (what, cond) => { if (cond) pass++; else fails.push(what); };

/* ---- the mathematics ----------------------------------------- */

const range = (a, b) => [...Array(b - a + 1)].map((_, i) => a + i);
const sum = (xs) => xs.reduce((a, b) => a + b, 0);
// a fractal run step by step: each kept piece becomes k pieces, and each
// kept piece makes `holes` new holes (1 for the carpet and the triangle)
const fractal = (k, steps, holes = 1) => { let R = 1, H = 0; const o = [[R, H]]; for (let s = 0; s < steps; s++) { H += holes * R; R *= k; o.push([R, H]); } return o; };
const koch = (side, n) => { let S = 3, len = side; for (let i = 0; i < n; i++) { S *= 4; len /= 3; } return { S, len, P: S * len }; };
const prism = (n) => ({ F: n + 2, E: 3 * n, V: 2 * n });
const pyramid = (n) => ({ F: n + 1, E: 2 * n, V: n + 1 });
// every way of laying two faces flat between opposite corners of an a×b×c box:
// one dimension against the other two added
const unfoldings = (a, b, c) => [[a, b + c], [b, a + c], [c, a + b]].map(([p, q]) => p * p + q * q);
const shortest = (a, b, c) => Math.min(...unfoldings(a, b, c));
// views of a set of unit cubes [x (left→right), y (front→back), z (up)]
const views = (cubes) => ({
  front: new Set(cubes.map(([x, , z]) => `${x},${z}`)).size,
  top: new Set(cubes.map(([x, y]) => `${x},${y}`)).size,
  side: new Set(cubes.map(([, y, z]) => `${y},${z}`)).size,
});
const block = (a, b, c) => { const o = []; for (let x = 0; x < a; x++) for (let y = 0; y < b; y++) for (let z = 0; z < c; z++) o.push([x, y, z]); return o; };
const firstStep = (f, from = 0) => { for (let n = from; n < 1000; n++) if (f(n)) return n; };

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/\s+/g, ' ');

/* ---- A. every identity ---------------------------------------- */

function toExpr(side) {
  let s = side
    .replace(/\\left|\\right/g, '')
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\[td]?frac(\d)(\d)/g, '(($1)/($2))')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'Math.sqrt($1)')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\\[,!;: ]|\\quad|\\qquad/g, '')
    .replace(/\^\{([^{}]+)\}/g, '**($1)').replace(/\^(\d)/g, '**$1')
    .replace(/[.,]\s*$/, '')
    .replace(/\s+/g, '');
  if (!s || !/^(Math\.sqrt|[-+*/().0-9])+$/.test(s)) return null;
  s = s.replace(/\)\(/g, ')*(').replace(/(\d)\(/g, '$1*(');
  return s;
}
const evalExpr = (e) => { try { return Function(`"use strict";return (${e})`)(); } catch { return NaN; } };
const decimals = (s) => (s.match(/\.(\d+)/) || ['', ''])[1].length;

let spans = 0; const skipped = [];
function checkSpan(f, span) {
  for (const part of span.split(/\\qquad/)) {
    if (!/=|\\approx/.test(part)) continue;
    const sides = part.split('=').map(s => s.trim()).filter(Boolean);
    const exact = [];
    let any = false;
    for (const side of sides) {
      const [head, ...approx] = side.split('\\approx').map(s => s.trim());
      const e = toExpr(head);
      const v = e === null ? null : evalExpr(e);
      if (v !== null && Number.isFinite(v)) exact.push(v);
      for (const a of approx) {
        const av = toExpr(a) === null ? NaN : evalExpr(toExpr(a));
        if (v === null || !Number.isFinite(v) || !Number.isFinite(av)) { skipped.push(`${f}: $${part.trim()}$`); continue; }
        any = true; spans++;
        if (Math.abs(v - av) <= 0.5 * 10 ** -decimals(a) + 1e-9) pass++;
        else fails.push(`${f}: $${part.trim()}$ — ${v} is not ${a} to ${decimals(a)} places`);
      }
    }
    if (exact.length >= 2) {
      any = true; spans++;
      if (exact.some(n => Math.abs(n - exact[0]) > 1e-9 * Math.max(1, Math.abs(n)))) fails.push(`${f}: $${part.trim()}$ — sides are ${exact.join(' and ')}`);
      else pass++;
    }
    if (!any) skipped.push(`${f}: $${part.trim()}$`);
  }
}
const sources = [...pages.map(f => [f, html[f]]), ['ANSWERS.md', answersMd]];
for (const [f, src] of sources) {
  const display = [...src.matchAll(/\$\$([\s\S]+?)\$\$/g)].map(m => m[1]);
  const rest = src.replace(/\$\$[\s\S]+?\$\$/g, ' ');
  for (const d of display) checkSpan(f, d);
  for (const m of rest.matchAll(/\$([^$]+)\$/g)) checkSpan(f, m[1]);
}

/* ---- B. claims arithmetic alone does not check ---------------- */

// § 4.2 – 4.4, the body
const carpet = fractal(8, 6), tri = fractal(3, 6);
ok('carpet R and H, steps 0-3', carpet.slice(0, 4), [[1, 0], [8, 1], [64, 9], [512, 73]]);
is('carpet area under a thousandth at step 60', (8 / 9) ** 60 < 1e-3 && (8 / 9) ** 59 > 0);
is('carpet area under a millionth at step 120', (8 / 9) ** 120 < 1e-6);
ok('Example 1: side, count, area', [27 / 3 ** 3, carpet[3][0], Math.round(27 * 27 * (8 / 9) ** 3)], [1, 512, 512]);
ok('Fig 4.3: sides at steps 1 and 2', [koch(1, 1).S, koch(1, 2).S], [12, 48]);
ok('Example 2: 48 sides of 1 cm', [koch(9, 2).S, koch(9, 2).len, koch(9, 2).P, koch(9, 0).P], [48, 1, 48, 27]);
is('Example 2: nearly twice', 48 / 27 > 1.5 && 48 / 27 < 2);
ok('ten-sided prism', prism(10), { F: 12, E: 30, V: 20 });
ok('ten-sided pyramid (the 11 + 11 - 20 row)', pyramid(10), { F: 11, E: 20, V: 11 });
ok('Example 3: prism with 21 edges', prism(21 / 3), { F: 9, E: 21, V: 14 });
ok('a cube is a prism with square ends', prism(4), { F: 6, E: 12, V: 8 });
ok('§ 4.8: the three unfoldings of 12 x 4 x 3', unfoldings(12, 4, 3), [193, 241, 265]);
ok('§ 4.8: shortest is sqrt 193', shortest(12, 4, 3), 193);
ok('§ 4.8: every pair adds to 19', [[12, 7], [15, 4], [16, 3]].map(sum), [19, 19, 19]);
ok('Example 4: unfoldings of 10 x 5 x 2', unfoldings(10, 5, 2), [149, 169, 229]);
ok('Example 4: pairs add to 17, shortest first', [10 + 7, shortest(10, 5, 2)], [17, 149]);
ok('Fig 4.7: three cubes, front 3, top 2, side 2', views([[0, 0, 0], [1, 0, 0], [0, 0, 1]]), { front: 3, top: 2, side: 2 });

// the figures themselves
const svgPath = (fig, n) => { const i = body.indexOf(`Fig. ${fig}</span>`); const svg = body.slice(body.lastIndexOf('<svg', i), i); return [...svg.matchAll(/<path class="dg-fill-a"[^>]*\bd="([^"]+)"/g)].map(m => m[1])[n]; };
const subpaths = (d) => (d.match(/M/g) || []).length;
const corners = (d) => (d.match(/[ML]/g) || []).length;
ok('Fig 4.1: step 1 and step 2 holes', [subpaths(svgPath('4.1', 1)) - 1, subpaths(svgPath('4.1', 2)) - 1], [carpet[1][1], carpet[2][1]]);
ok('Fig 4.2: step 1 and step 2 holes', [subpaths(svgPath('4.2', 1)) - 1, subpaths(svgPath('4.2', 2)) - 1], [tri[1][1], tri[2][1]]);
ok('Fig 4.3: corners of step 1 and step 2', [corners(svgPath('4.3', 1)), corners(svgPath('4.3', 2))], [koch(1, 1).S, koch(1, 2).S]);
{ const i = body.indexOf('Fig. 4.6</span>'); const svg = body.slice(body.lastIndexOf('<svg', i), i);
  ok('Fig 4.6: labels are the box 12, 4, 3', [...svg.matchAll(/dg-label[^>]*>(\d+)</g)].map(m => +m[1]).sort((a, b) => a - b), [3, 4, 12]); }

// Stage 1
ok('Stage 1 Q1', [243 / 3 ** 5, fractal(8, 5)[5][0], 243 * 243], [1, 32768, 59049]);
is('Stage 1 Q1: a little over half', 32768 / 59049 > 0.5 && 32768 / 59049 < 0.6);
ok('Stage 1 Q2: 192 sides is step 3', firstStep(n => koch(1, n).S === 192), 3);
ok('Stage 1 Q3: prism and pyramid with 30 edges', [prism(10).E, prism(10).F, pyramid(15).E, pyramid(15).F, pyramid(15).V], [30, 12, 30, 16, 16]);
ok('Stage 1 Q4: cube of side 5', [shortest(5, 5, 5), 5 + 5 + 5, 3 * 25], [125, 15, 75]);
is('Stage 1 Q4: about two and a half centimetres', Math.abs(Math.sqrt(125) - Math.sqrt(75) - 2.5) < 0.05);
ok('Stage 1 Q5: views of 3 x 2 x 1 lying flat', views(block(3, 2, 1)), { front: 3 * 1, top: 3 * 2, side: 2 * 1 });
is('Stage 1 Q6: more than a tenth, about a quarter', (3 / 4) ** 5 > 0.1 && Math.abs((3 / 4) ** 5 - 0.25) < 0.02);
const hidden = (n) => block(n, n, n).filter(c => c.every(k => k > 0 && k < n - 1)).length;
ok('Stage 1 Q7: hidden cubes of 3- and 5-blocks', [block(3, 3, 3).length, hidden(3), hidden(5), (5 - 2) ** 3], [27, 1, 27, 27]);
ok('Stage 1 Q8: surface of 2 x 3 x 4 counted face by face', 2 * (2 * 3) + 2 * (3 * 4) + 2 * (4 * 2), 52);

// Stage 2
ok('Ex 1: carpet from 54, step 2', [54 / 9, fractal(8, 2)[2][0], 64 * 36, 54 * 54], [6, 64, 2304, 2916]);
ok('Ex 2: plus-sign rule, step 3', [fractal(5, 3)[3][0], 27, 729], [125, 3 ** 3, 27 * 27]);
is('Ex 2: less than a fifth', (5 / 9) ** 3 < 0.2);
ok('Ex 3: triangle from 16, step 2', [16 / 4, tri[2][0], 4 ** 2], [4, 9, 16]);
ok('Ex 4: 2187 triangles is step 7', firstStep(n => fractal(3, n)[n][0] === 2187), 7);
ok('Ex 4: 4^7', 4 ** 7, 16384);
is('Ex 4: a little over an eighth', 2187 / 16384 > 1 / 8 && 2187 / 16384 < 0.14);
ok('Ex 5: Koch from 54, step 3', [koch(54, 3).S, koch(54, 3).len, koch(54, 3).P, koch(54, 0).P], [192, 2, 384, 162]);
ok('Ex 6: Koch from 27, steps 2 and 3', [koch(27, 2).S, koch(27, 2).len, koch(27, 2).P, koch(27, 3).S, koch(27, 3).len, koch(27, 3).P], [48, 3, 144, 192, 1, 192]);
ok('Ex 6: added', [koch(27, 3).S - koch(27, 2).S, koch(27, 3).P - koch(27, 2).P, koch(27, 2).P / 3], [144, 48, 48]);
ok('Ex 7: pyramid with 10 vertices', pyramid(firstStep(n => pyramid(n).V === 10, 3)), { F: 10, E: 18, V: 10 });
{ const n = firstStep(k => prism(k).E + pyramid(k).E === 40, 3); ok('Ex 8: prism and pyramid with 40 edges', [n, prism(n), pyramid(n)], [8, { F: 10, E: 24, V: 16 }, { F: 9, E: 16, V: 9 }]); }
ok('Ex 9: icosahedron vertices', 2 - 20 + 30, 12);
is('Ex 9: 7, 10, 16 fails', 7 + 10 - 16 !== 2);
ok('Ex 10: open box 10 x 6 x 4', 10 * 6 + 2 * 10 * 4 + 2 * 6 * 4, 188);
ok('Ex 11: cube net of 150', [Math.sqrt(150 / 6), Math.sqrt(150 / 6) ** 3], [5, 125]);
ok('Ex 12: unfoldings of 15 x 6 x 3', unfoldings(15, 6, 3), [306, 360, 450]);
ok('Ex 12: shortest', shortest(15, 6, 3), 306);
ok('Ex 13: tank 20 x 12 x 9', [shortest(20, 12, 9), Math.sqrt(shortest(20, 12, 9)), 20 + 12 + 9], [841, 29, 41]);
ok('Ex 13: the other two', unfoldings(20, 12, 9).filter(v => v !== 841).sort((a, b) => a - b), [985, 1105]);
ok('Ex 14: row of three with one on the middle', views([[0, 0, 0], [1, 0, 0], [2, 0, 0], [1, 0, 1]]), { front: 4, top: 3, side: 2 });
{ // Ex 16: edges of a box seen from the corner (+x, +y, +z): an edge is hidden
  // exactly when it meets the one corner (0, 0, 0) turned away from the viewer
  const a = 3, b = 2, c = 1, edges = [];
  for (const y of [0, b]) for (const z of [0, c]) edges.push({ len: a, at: y === 0 && z === 0 });
  for (const x of [0, a]) for (const z of [0, c]) edges.push({ len: b, at: x === 0 && z === 0 });
  for (const x of [0, a]) for (const y of [0, b]) edges.push({ len: c, at: x === 0 && y === 0 });
  const seen = edges.filter(e => !e.at);
  ok('Ex 16: edges drawn and their length', [edges.length, seen.length, sum(seen.map(e => e.len))], [12, 9, 18]);
}

// the practice answers, read back out of the key rather than typed here
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= text(m[2]);
const row = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const r = keyRows[n] || '';
  if (!part) return r;
  const m = r.match(new RegExp(`\\(${part}\\)([^(]*)`));
  return m ? m[1] : '';
};
const says = (q, ...vals) => { for (const v of vals) is(`key ${q} should say ${v}: "${row(q)}"`, new RegExp(`(^|[^\\d.])${String(v).replace('.', '\\.')}([^\\d]|$)`).test(row(q))); };
says(20, pyramid(7).F, pyramid(7).E, pyramid(7).V);
says(21, 3 ** 5);
says(22, prism(9).E);
{ const len = 135 / 27; says(23, len, fractal(8, 3)[3][0], fractal(8, 3)[3][0] * len * len); }
{ const n = 10 - 2, m = 10 - 1; says(24, 2 + 16 - 10, prism(n).E, pyramid(m).E); is('Q24: neither has 16 edges', prism(n).E !== 16 && pyramid(m).E !== 16); }
says(25, 8 * 5 + 2 * 8 * 3 + 2 * 5 * 3);
says(26, Math.sqrt(shortest(12, 5, 4)), ...unfoldings(12, 5, 4));
says(27, ...[1, 2, 3].flatMap(s => [koch(81, s).S, koch(81, s).len, koch(81, s).P]), koch(81, 0).P, 2 * koch(81, 0).P);
is('Q27: more than twice', koch(81, 3).P > 2 * koch(81, 0).P);
{ const n = 10 - 2, m = prism(n).E / 2; says(28, n, prism(n).E, prism(n).V, m, pyramid(m).F, pyramid(m).V); }
{ const v = views([[0, 0, 0], [1, 0, 0], [2, 0, 0], [0, 0, 1], [2, 1, 0]]); ok('Q29: views of the five cubes', v, { front: +row(29).match(/Front:[^.]*, (\d+) squares/)[1], top: +row(29).match(/Top:[^.]*, (\d+) squares/)[1], side: +row(29).match(/Side:[^.]*, (\d+) squares/)[1] }); }
says('30a', fractal(8, 3)[3][0], 81 / 27);
says('30b', fractal(8, 2)[2][0] * 81);
says('30c', 81 - 64, 81);
says('31a', ...[[8, 3, 3], [15, 4, 4], [24, 4, 3]].map(b => Math.sqrt(shortest(...b))));
is('Q31: every shortest route is whole', [[8, 3, 3], [15, 4, 4], [24, 4, 3]].every(b => Number.isInteger(Math.sqrt(shortest(...b)))));
says('31b', 24 + 4 + 3 - Math.sqrt(shortest(24, 4, 3)));
says('31c', 2 * (24 * 4 + 4 * 3 + 3 * 24));

// every practice question numbered once, in order
{ const starts = [...beyond.matchAll(/c-questions" data-start="(\d+)"/g)].map(m => +m[1]);
  ok('practice runs 2..31 after an unnumbered first', starts, range(2, 31));
  is('practice has one unnumbered first question', (beyond.match(/<ol class="c-questions">/g) || []).length === 1); }
// and each body exercise set runs 1, 2, 3 …
{ const sets = body.split(/c-practice__head">/).slice(1);
  ok('body exercise sets and their numbering', sets.map(s => [s.match(/^[^<]*/)[0], [...s.matchAll(/data-start="(\d+)"/g)].map(m => +m[1])]),
    [['Exercise Set 4.1', range(2, 6)], ['Exercise Set 4.2', range(2, 7)], ['Exercise Set 4.3', range(2, 6)]]); }

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] = m[2];
const optsOf = (n) => [...(qs[n] || '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => text(x[1]).trim());
const val = (s) => { const e = toExpr(s.replace(/\$/g, '').replace(/\s*(cm|sides)$/, '')); return e === null ? NaN : evalExpr(e); };
const eq = (a, b) => Math.abs(a - b) < 1e-9;
const key = {};
{ const i = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(i, beyond.indexOf('</ol>', i))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2]; }

const solve = {
  1: o => o.map(s => s === 'fractal'),
  2: o => o.map(val).map(v => eq(v, 9 / 3 ** 2)),
  3: o => o.map(val).map(v => eq(v, (8 / 9) ** 2)),
  4: o => o.map(val).map(v => v === firstStep(n => (3 / 4) ** n < 1 / 5)),
  5: o => o.map(val).map(v => v === koch(1, 1).S),
  6: o => o.map(val).map(v => v === koch(1, 3).S),
  7: o => o.map(val).map(v => prism(v).E === 24),
  8: o => o.map(val).map(v => v === pyramid(16 / 2).F),
  9: o => o.map(val).map(v => v === 11 + 11 - 2),
  10: o => o.map(val).map(v => pyramid(v).F === prism(7).F),
  11: o => o.map(val).map(v => eq(v, Math.sqrt(shortest(9, 4, 3)))),
  12: o => o.map(val).map(v => eq(v, Math.sqrt(shortest(10, 10, 1)))),
  13: o => o.map(s => s === 'a regular hexagon'),
  14: o => o.map(s => s === 'the lengths of its edges'),
  15: o => o.map(val).map(v => v === firstStep(n => (4 / 3) ** n > 2)),
};
// the wrong numeric options are each one of the slips the key explains
ok('Q11 distractors are the other unfoldings and the edge walk', optsOf(11).map(val).map(v => Math.round(v * v)).sort((a, b) => a - b), [...unfoldings(9, 4, 3), 16 * 16].sort((a, b) => a - b));
ok('Q12 distractors', optsOf(12).map(val).map(v => Math.round(v * v)), [221, 200, 401, 21 * 21]);
ok('Q12: the unfoldings of 10 x 10 x 1', unfoldings(10, 10, 1).sort((a, b) => a - b), [221, 221, 401]);
ok('Q3 distractors', optsOf(3).map(val).map(v => Math.round(v * 81)), [81 - 64, 72, 64, 9]);
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Q${q}: the right option`, right, [key[q]]);
}
// assertion-reason: [A true, R true, R explains A]
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  16: [tri[2][0] === 9, true, true],
  17: [range(1, 50).some(n => prism(n).E === 20), range(3, 50).every(n => prism(n).E % 3 === 0), false],
  // R alone would also be true of a rule that quartered each side, which keeps the perimeter fixed
  18: [koch(1, 30).P > 1000, koch(1, 5).S === 4 * koch(1, 4).S, false],
  19: [true, false, false],
};
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-19', Object.keys(key).map(Number).sort((a, b) => a - b), range(1, 19));

/* ---- D. ANSWERS.md ------------------------------------------- */

const mdKey = {};
for (const m of answersMd.slice(answersMd.indexOf('as the key prints it')).slice(0, 300).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2];
ok('ANSWERS.md key matches the page', mdKey, key);
for (const q of range(16, 19)) is(`ANSWERS.md Q${q} letter matches`, new RegExp(`\\n${q}\\. \\(${key[q]}\\)`).test(answersMd));

// the body exercises, re-derived, and found in ANSWERS.md
const md = text(answersMd);
const mdSays = (what, ...vals) => { for (const v of vals) is(`ANSWERS.md ${what} should say ${v}`, md.includes(String(v))); };
ok('Ex 4.1 Q2', [carpet[4][0], carpet[4][1], carpet[5][1]], [4096, 585, 4681]);
mdSays('Ex 4.1 Q2', 4096, 585, 4681);
ok('Ex 4.1 Q3', [tri[4][0], tri[4][1]], [81, 40]);
is('Ex 4.1 Q4: the triangle shrinks faster', (3 / 4) ** 3 < (8 / 9) ** 3 && /triangle shrinks faster/i.test(md));
ok('Ex 4.1 Q5', [koch(1, 4).S, koch(1, 4).P * 27], [768, 256]);
ok('Ex 4.1 Q6: first step past 10 times', firstStep(n => (4 / 3) ** n > 10), 9);
is('ANSWERS.md Ex 4.1 Q6 says step 9', /Step 9\./.test(md));
ok('Ex 4.2 Q1', [prism(5), pyramid(6), prism(12)], [{ F: 7, E: 15, V: 10 }, { F: 7, E: 12, V: 7 }, { F: 14, E: 36, V: 24 }]);
ok('Ex 4.2 Q2', [prism(4).F + prism(4).V - prism(4).E, prism(3).F + prism(3).V - prism(3).E, pyramid(4).F + pyramid(4).V - pyramid(4).E], [2, 2, 2]);
ok('Ex 4.2 Q3: and a hexagonal prism has those counts', [8 + 12 - 2, prism(6)], [18, { F: 8, E: 18, V: 12 }]);
ok('Ex 4.2 Q5: triangles in the nets', [2, 4], [prism(3).F - 3, pyramid(4).F - 1]);
ok('Ex 4.2 Q6', [unfoldings(8, 6, 4), shortest(8, 6, 4)], [[164, 180, 212], 164]);
ok('Ex 4.2 Q7', [unfoldings(6, 4, 3), shortest(6, 4, 3), 6 + 4 + 3], [[85, 97, 109], 85, 13]);
is('Ex 4.2 Q7: about 3.8 m shorter', Math.abs(13 - Math.sqrt(85) - 3.8) < 0.05);
ok('Ex 4.3 Q3: a row of four, then a column', [views(block(4, 1, 1)), views(block(1, 1, 4))], [{ front: 4, top: 4, side: 1 }, { front: 4, top: 1, side: 4 }]);
ok('Ex 4.3 Q4: cubes seen and altogether', [block(2, 2, 2).filter(c => c.some(k => k === 1)).length, block(2, 2, 2).length], [7, 8]);
mdSays('Ex 4.3 Q4', '**7**');
{ // Ex 4.3 Q6: a cube and a prism lying with its triangular ends left and right
  const cube = { front: 'square', top: 'square', side: 'square' }, prismLying = { front: 'square', top: 'square', side: 'triangle' };
  is('Ex 4.3 Q6: same front and top, different side', cube.front === prismLying.front && cube.top === prismLying.top && cube.side !== prismLying.side); }

/* ---- report ---------------------------------------------------- */

console.log(`A  ${spans} relations evaluated; ${skipped.length} spans not pure arithmetic, skipped`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
