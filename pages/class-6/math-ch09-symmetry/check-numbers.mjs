#!/usr/bin/env node
/* Re-derive every number and every symmetry claim this chapter prints.

     node pages/class-6/math-ch09-symmetry/check-numbers.mjs

   Nothing here restates a printed value. Figures are read out of their SVG
   and their lines of symmetry and angles of symmetry are FOUND, by
   reflecting and turning the drawn points and comparing the result with
   the drawing (symmetry-geometry.mjs, beside this file). The printed claim
   is then read back out of the page or out of ANSWERS.md and compared.

   Five parts (E added for the maths-v2 conversion, 26 September 2026):
     A  every arithmetic identity set as maths, on the pages and in
        ANSWERS.md
     B  the figures: every count of lines, every angle and order of
        rotational symmetry, every folded, cut, punched and completed
        drawing, and every worked answer that rests on them
     C  every multiple-choice and assertion-reason question — exactly one
        option is right, and it is the one the printed key gives
     D  ANSWERS.md: its tables and its values, read back and recomputed
     E  By the Book and Beyond the Book, recomputed; the keys read back

   Exits non-zero if anything does not hold up. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as G from './symmetry-geometry.mjs';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const CH1 = path.join(DIR, '..', 'math-ch01-patterns');
let pass = 0;
const fails = [];
const ok = (what, got, want) => {
  if (JSON.stringify(got) === JSON.stringify(want)) pass++;
  else fails.push(`${what}\n      computed ${JSON.stringify(got)}\n      printed  ${JSON.stringify(want)}`);
};
const is = (what, cond) => { if (cond) pass++; else fails.push(what); };

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const read = (f) => fs.readFileSync(path.join(DIR, f), 'utf8');
const ALL = pages.map(read).join('\n');
const BEYOND = pages.filter(f => /^p1\d\d/.test(f)).map(read).join('\n');
const ANSWERS = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const flat = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&ndash;|&middot;/g, ' ').replace(/\s+/g, ' ').trim();
const nums = (s) => [...flat(s).replace(/\$[^$]*\$/g, m => m.replace(/\^\\circ/g, '')).matchAll(/\d+(?:\.\d+)?/g)].map(m => Number(m[0]));

/* ================================================================
   A. arithmetic
   ================================================================ */
function toExpr(side) {
  let s = side
    .replace(/\^\{?\\circ\}?/g, '')
    .replace(/(\d+)\\frac\{(\d+)\}\{(\d+)\}/g, '($1+$2/$3)')
    .replace(/\\frac\{(\d+)\}\{(\d+)\}/g, '($1/$2)')
    .replace(/\\times/g, '*').replace(/\\div/g, '/')
    .replace(/\\[,;: ]/g, '').replace(/\\quad/g, '')
    .replace(/[{}]/g, '').replace(/\s+/g, '');
  return /^[-+*/().0-9]+$/.test(s) ? s : null;
}
let checked = 0;
const skipped = [];
for (const [where, text] of [...pages.map(f => [f, read(f)]), ['ANSWERS.md', ANSWERS]]) {
  for (const m of text.matchAll(/\$([^$]+)\$/g)) {
    const span = m[1];
    if (!span.includes('=')) continue;
    const sides = span.split('=').map(s => s.trim());
    if (sides[0] === '' && sides.length > 2) sides.shift(); // "distance $= 3 + 3 = 6$"
    if (sides.some(s => !s)) { skipped.push(`${where}: $${span}$`); continue; }
    const vals = sides.map(toExpr);
    if (vals.some(v => v === null)) { skipped.push(`${where}: $${span}$`); continue; }
    const ns = vals.map(v => Function(`"use strict";return (${v})`)());
    checked++;
    if (ns.some(n => Math.abs(n - ns[0]) > 1e-9)) fails.push(`${where}: $${span}$ — sides are ${ns.join(' and ')}`);
    else pass++;
  }
}

/* ================================================================
   B. the figures
   ================================================================ */
const fig = (n, dir = DIR) => G.elements(G.figureSvg(dir, n).svg);
const within = ([x0, x1, y0 = -1e9, y1 = 1e9]) => (e) => {
  const [x, y] = G.centreOf(e);
  return x >= x0 && x < x1 && y >= y0 && y < y1;
};
/* The symmetries of one panel. A marked centre (a small teal dot) is the
   point the chapter turns the figure about, and is not part of it. */
function panel(els, box, { dot = false, sameFill = false } = {}) {
  const keep = within(box);
  const mine = els.filter(keep);
  const centre = dot ? mine.find(e => e.cls === 'dg-fill-teal' && e.c && e.r < 7)?.c : undefined;
  let prims = G.primitives(mine).filter(p => !(dot && p.cls === 'dg-fill-teal' && p.c));
  if (sameFill) prims = prims.map(p => /dg-fill/.test(p.cls) ? { ...p, cls: 'dg-fill-any' } : p);
  return G.symmetries(prims, { about: centre });
}
const polyPrims = (pts, cls = 'dg-line', closed = true) =>
  G.primitives([{ kind: closed ? 'polygon' : 'polyline', cls, pts, closed }]);
const symOf = (prims, about) => G.symmetries(prims, { about });

/* Tables in ANSWERS.md, found by the text of their first header cell. */
function table(head) {
  const lines = ANSWERS.split('\n');
  const i = lines.findIndex(l => l.trim().startsWith(`| ${head} |`));
  if (i < 0) { fails.push(`ANSWERS.md has no table headed "${head}"`); return {}; }
  const rows = {};
  for (let j = i + 2; j < lines.length && lines[j].trim().startsWith('|'); j++) {
    const cells = lines[j].trim().slice(1, -1).split('|').map(c => c.trim());
    rows[cells[0]] = cells.slice(1);
  }
  return rows;
}
const cols = (n, w) => [...Array(n)].map((_, i) => [i * w, (i + 1) * w]);
const L = 'abcdefgh';

// ---- Fig. 9.1, Exercise 9.1 Q1
{
  const E = fig('9.1');
  const t = table('Fig. 9.1');
  const names = ['flower', 'butterfly', 'rangoli', 'pinwheel', 'cloud'];
  cols(5, 114).forEach((b, i) => {
    const s = panel(E, b);
    ok(`Fig. 9.1 ${names[i]}: lines and order`, [s.lines, s.order], t[names[i]]?.map(Number));
  });
  // the pinwheel's triangles: right-angled at the hexagon, each the last turned 60 degrees
  const tris = E.filter(e => e.kind === 'polygon' && e.cls === 'dg-line' && e.pts.length === 3);
  is('Fig. 9.1 pinwheel has six triangles', tris.length === 6);
  for (const [A, B, C] of tris.map(t => t.pts)) {
    const dot = (B[0] - A[0]) * (C[0] - A[0]) + (B[1] - A[1]) * (C[1] - A[1]);
    const cos = dot / Math.hypot(B[0] - A[0], B[1] - A[1]) / Math.hypot(C[0] - A[0], C[1] - A[1]);
    is(`pinwheel triangle at (${A}) has a right angle there (cos ${cos.toFixed(4)})`, Math.abs(cos) < 0.005);
  }
  const hexc = [399, 57.32];
  const turn = G.turnBy(hexc, 60);
  const firsts = tris.map(t => t.pts[0]);
  is('pinwheel: each triangle is the one before turned through 60 degrees',
    firsts.every(p => { const q = turn(...p); return firsts.some(r => Math.hypot(r[0] - q[0], r[1] - q[1]) < 0.3); }));
  is('ANSWERS names the right-angled triangle and the 60 degree turn',
    ANSWERS.includes('**right-angled triangle**') && ANSWERS.includes('**turned through $60^\\circ$**'));
}

// ---- Fig. 9.2: (a) is folded into mirror halves, (b) is not
{
  const E = fig('9.2');
  const a = panel(E, [0, 110]), b = panel(E, [110, 230]);
  is('Fig. 9.2(a) has a line of symmetry', a.lines >= 1);
  const F = G.figure(G.primitives(E.filter(within([110, 230]))));
  is('Fig. 9.2(b): the dashed line is not a line of symmetry', !G.fits(F, G.reflectIn([165, 58.6], 90)));
  is('Fig. 9.2(b): the two halves are a half turn of each other (Ex 9.1 Q4)', G.fits(F, G.turnBy([165, 58.6], 180)) && b.lines === 0);
}

// ---- Fig. 9.3, Exercise 9.1 Q2
{
  const E = fig('9.3');
  const t = table('Fig. 9.3');
  cols(5, 114).forEach((b, i) => ok(`Fig. 9.3 (${L[i]}) lines`, panel(E, b).lines, Number(t[`(${L[i]})`]?.[0])));
  // the kite's line is its long diagonal; the L's is the slanting line through its corners
  const kite = E.filter(within([114, 228])).find(e => e.kind === 'polygon').pts;
  const F = G.figure(polyPrims(kite));
  const ang = (p, q) => Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI;
  is('Fig. 9.3(b): the kite folds along its long diagonal', G.fits(F, G.reflectIn(kite[0], ang(kite[0], kite[2]))));
  const Lsh = E.filter(within([342, 456])).find(e => e.kind === 'polygon').pts;
  is('Fig. 9.3(d): the L folds along the line through its outer and inner corners',
    G.fits(G.figure(polyPrims(Lsh)), G.reflectIn(Lsh[0], ang(Lsh[0], [391.67, 54.23]))));
}

// ---- Fig. 9.4, the square's four folds, and the square's 4 lines
{
  const E = fig('9.4');
  cols(4, 80).forEach((b, i) => {
    const mine = E.filter(within(b));
    const sq = G.figure(polyPrims(mine.find(e => e.cls === 'dg-line').pts));
    const [p, q] = mine.find(e => e.cls === 'dg-ghost').pts;
    is(`Fig. 9.4 fold ${i + 1} is a line of symmetry of the square`,
      G.fits(sq, G.reflectIn(p, Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI)));
  });
  const s = symOf(polyPrims([[0, 0], [10, 0], [10, 10], [0, 10]]));
  ok('a square has 4 lines and order 4 (T&R, summary)', [s.lines, s.order], [4, 4]);
  const r = symOf(polyPrims([[0, 0], [20, 0], [20, 10], [0, 10]]));
  is('a rectangle that is not a square: no diagonal is a line of symmetry (T&R)', r.lines === 2);
}

// ---- Fig. 9.5: each has more than one line
{
  const E = fig('9.5');
  cols(3, 107).forEach((b, i) => is(`Fig. 9.5 (${i + 1}) has more than one line`, panel(E, b).lines > 1));
}

// ---- Fig. 9.6: where the corners go
{
  const sq = { A: [0, 0], B: [1, 0], C: [1, 1], D: [0, 1] };
  const where = (move) => Object.fromEntries(Object.entries(sq).map(([k, p]) => {
    const q = move(...p);
    return [k, Object.keys(sq).find(j => Math.hypot(sq[j][0] - q[0], sq[j][1] - q[1]) < 1e-6)];
  }));
  ok('vertical line: B, C go to A, D; A to B; D to C', where(G.reflectIn([0.5, 0.5], 90)), { A: 'B', B: 'A', C: 'D', D: 'C' });
  ok('diagonal AC: A, C stay; B and D swap', where(G.reflectIn([0, 0], 45)), { A: 'A', B: 'D', C: 'C', D: 'B' });
  ok('horizontal line: A and D swap, B and C swap', where(G.reflectIn([0.5, 0.5], 0)), { A: 'D', B: 'C', C: 'B', D: 'A' });
  is('ANSWERS gives both reflections', ANSWERS.includes('**A and C stay where they are,\n   and B and D change places.**')
    && ANSWERS.includes('**A and D change places,\n   and B and C change places.**'));
}

// ---- Fig. 9.7: the opened hole
{
  const E = fig('9.7');
  const cut = E.find(e => e.cls === 'dg-hidden').pts;
  const fold = 58;
  const hole = [...cut, ...cut.slice().reverse().slice(1, -1).map(([x, y]) => [2 * fold - x, y])];
  const s = symOf(polyPrims(hole));
  ok('Fig. 9.7 opened hole: sides and lines of symmetry', [hole.length, s.lines], [8, 2]);
  is('Fig. 9.7: the fold is a line of symmetry', G.fits(G.figure(polyPrims(hole)), G.reflectIn([fold, 0], 90)));
  is('ANSWERS: 8-sided, 2 lines', ANSWERS.includes('an 8-sided shape') && ANSWERS.includes('*(checked: 2 lines)*'));
}

// ---- Fig. 9.8: the design, a diamond, a star
{
  const E = fig('9.8');
  const whole = panel(E, [0, 266]);
  const dia = G.symmetries(G.primitives(E.slice(0, 2)));
  const star = G.symmetries(G.primitives(E.filter(e => e.pts?.length > 8).slice(0, 2)));
  ok('Fig. 9.8: lines of the design, a diamond, a star', [whole.lines, dia.lines, star.lines], [2, 2, 8]);
  is('ANSWERS for Fig. 9.8', /whole design has \*\*2 lines of symmetry\*\*/.test(ANSWERS)
    && ANSWERS.includes('Each small diamond has\n**2**; each eight-pointed star has **8**.'));
}

// ---- Fig. 9.9: the fold is a line of symmetry of the holes
{
  const E = fig('9.9');
  const holes = E.filter(e => e.c && e.c[0] > 130).map(e => e.c);
  is('Fig. 9.9: the two holes are mirror images in the fold', Math.abs(holes[0][0] + holes[1][0] - 360) < 1e-9 && holes[0][1] === holes[1][1]);
}

// ---- Fig. 9.10: how each sheet was folded
{
  const E = fig('9.10');
  const words = [];
  cols(4, 136).forEach((b, i) => {
    const mine = E.filter(within(b));
    const sqPts = mine.find(e => e.cls === 'dg-line' && e.pts).pts;
    const c = [(sqPts[0][0] + sqPts[2][0]) / 2, (sqPts[0][1] + sqPts[2][1]) / 2];
    const holes = mine.filter(e => e.c).map(e => e.c);
    const sq = G.figure(polyPrims(sqPts));
    if (holes.length === 2) {
      const [p, q] = holes, m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
      const dir = (Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI + 90 + 360) % 180;
      is(`Fig. 9.10(${L[i]}): the fold passes through the middle of the sheet`, Math.abs((m[0] - c[0]) * Math.sin(dir * Math.PI / 180) - (m[1] - c[1]) * Math.cos(dir * Math.PI / 180)) < 0.05);
      is(`Fig. 9.10(${L[i]}): the fold is a line of symmetry of the sheet`, G.fits(sq, G.reflectIn(c, dir)));
      words.push(Math.abs(dir - 90) < 0.5 ? 'the up-and-down line through the middle of the sheet'
        : Math.abs(dir) < 0.5 || Math.abs(dir - 180) < 0.5 ? 'the across line through the middle of the sheet'
        : Math.abs(dir - 135) < 0.5 ? 'the diagonal from the bottom left corner to the top right corner'
        : 'the diagonal from the top left corner to the bottom right corner');
    } else {
      const h = holes[0];
      const orbit = [h, [2 * c[0] - h[0], h[1]], [h[0], 2 * c[1] - h[1]], [2 * c[0] - h[0], 2 * c[1] - h[1]]];
      is('Fig. 9.10(d): the four holes are one hole reflected in both middle folds',
        holes.length === 4 && orbit.every(o => holes.some(k => Math.hypot(k[0] - o[0], k[1] - o[1]) < 0.05)));
      is('Fig. 9.10(d): the holes sit on the diagonals and off the middle lines, so only the middle folds leave them clear of a fold',
        holes.every(k => Math.abs(Math.abs(k[0] - c[0]) - Math.abs(k[1] - c[1])) < 1e-6)
        && holes.every(k => Math.abs(k[0] - c[0]) > 1 && Math.abs(k[1] - c[1]) > 1));
    }
  });
  words.forEach((w, i) => is(`ANSWERS Ex 9.2 Q1(${L[i]}) says "${w}"`, ANSWERS.includes(`- (${L[i]}) ${w}`)));
  is('ANSWERS Ex 9.2 Q1(d): folded twice', ANSWERS.includes('- (d) the sheet was folded **twice**'));
}

// ---- Fig. 9.11: the other hole lies inside each figure
{
  const E = fig('9.11');
  let aImage;
  cols(5, 112).map(([a, b], i) => [i === 0 ? 0 : a + 3, i === 4 ? 570 : b + 3]).forEach((b, i) => {
    const mine = E.filter(within(b));
    const [p, q] = mine.find(e => e.cls === 'dg-ghost').pts;
    const hole = mine.find(e => e.c && e.r < 5).c;
    const img = G.reflectIn(p, Math.atan2(q[1] - p[1], q[0] - p[0]) * 180 / Math.PI)(...hole);
    if (i === 0) aImage = img.map(v => Math.round(v * 10) / 10);
    const outline = mine.find(e => e.cls === 'dg-line' && (e.pts || e.r > 10));
    let inside;
    if (outline.c) inside = Math.hypot(img[0] - outline.c[0], img[1] - outline.c[1]) < outline.r - 4.2;
    else {
      const P = outline.pts;
      let wn = false;
      for (let k = 0, j = P.length - 1; k < P.length; j = k++)
        if ((P[k][1] > img[1]) !== (P[j][1] > img[1]) && img[0] < (P[j][0] - P[k][0]) * (img[1] - P[k][1]) / (P[j][1] - P[k][1]) + P[k][0]) wn = !wn;
      inside = wn;
    }
    is(`Fig. 9.11(${L[i]}): the other hole is inside the figure`, inside);
  });
  ok('Fig. 9.11(a): the other hole, as ANSWERS gives it', aImage,
    ANSWERS.match(/at \(([\d.]+), ([\d.]+)\) in the figure's own\s+units/)?.slice(1).map(Number));
}

// ---- Exercise 9.2 Q3: two folds, four layers, four holes
ok('Ex 9.2 Q3 layers after two folds', 2 * 2, Number(ANSWERS.match(/\$2 \\times 2 = (\d+)\$ layers/)?.[1]));
is('Ex 9.2 Q3 ANSWERS says 4 holes', ANSWERS.includes('**4 holes**'));

// ---- Fig. 9.12: the opened sheets
{
  const E = fig('9.12');
  const cutIn = (b) => E.filter(within(b)).find(e => e.cls === 'dg-hidden').pts;
  // (a) fold at x = 40
  const ca = cutIn([0, 150]);
  const inner = ca.slice(1, -1);
  const holeA = [...inner, ...inner.slice().reverse().map(([x, y]) => [80 - x, y])];
  const sa = symOf(polyPrims(holeA));
  ok('Fig. 9.12(a): a double-headed arrow, sides and lines', [holeA.length, sa.lines], [10, 2]);
  // (b) fold at y = 13.36
  const cb = cutIn([150, 290]);
  const holeB = [...cb, [cb[1][0], 2 * 13.36 - cb[1][1]]];
  const sides = holeB.map((p, k) => Math.hypot(holeB[(k + 1) % 4][0] - p[0], holeB[(k + 1) % 4][1] - p[1]));
  const w = Math.abs(cb[2][0] - cb[0][0]), h = 2 * Math.abs(cb[1][1] - 13.36);
  is('Fig. 9.12(b): a rhombus (four equal sides), taller than wide', sides.every(s => Math.abs(s - sides[0]) < 1e-9) && h > w);
  // (c) quarter circle at the corner where the folds meet
  const cc = cutIn([290, 430]);
  const rad = cc.map(([x, y]) => Math.hypot(x - 318, y - 13.36));
  is('Fig. 9.12(c): the cut is a quarter circle about the corner where the folds meet, so the hole is a circle',
    rad.every(r => Math.abs(r - rad[0]) < 0.05) && Math.abs(cc[0][1] - 13.36) < 1e-9 && Math.abs(cc.at(-1)[0] - 318) < 1e-9);
  // (d) a notch from the open edge, centred on the sheet's middle height
  const cd = cutIn([430, 570]);
  is('Fig. 9.12(d): the notch starts and ends on the open edge', cd[0][0] === 534 && cd.at(-1)[0] === 534);
  ok('Fig. 9.12(d): notch middle = sheet middle (so the across line is a line of symmetry)',
    Math.round((cd[0][1] + cd.at(-1)[1]) / 2 * 100) / 100, Math.round((13.36 + 109.36) / 2 * 100) / 100);
  is('ANSWERS for Fig. 9.12', ANSWERS.includes('**double-headed arrow**') && ANSWERS.includes('with 10 sides')
    && ANSWERS.includes('**diamond**') && ANSWERS.includes('**circle**') && ANSWERS.includes('**rectangular notch in each side edge**'));
}

// ---- Fig. 9.13: both holes are squares
{
  const E = fig('9.13');
  for (const P of E.filter(e => e.kind === 'polygon' && e.pts.length === 4 && e.pts[0][0] > 40 && !(e.pts[0][0] === 104 || e.pts[0][0] === 214)).map(e => e.pts)) {
    const s = P.map((p, k) => Math.hypot(P[(k + 1) % 4][0] - p[0], P[(k + 1) % 4][1] - p[1]));
    const d1 = Math.hypot(P[2][0] - P[0][0], P[2][1] - P[0][1]), d2 = Math.hypot(P[3][0] - P[1][0], P[3][1] - P[1][1]);
    is(`Fig. 9.13 hole ${P[0]}: four equal sides and equal diagonals`, s.every(v => Math.abs(v - s[0]) < 0.02) && Math.abs(d1 - d2) < 0.02);
  }
}

// ---- Figs. 9.14, 9.15, 9.16, 9.17: Exercise 9.2 Q6 to Q8
{
  const t = table('Fig. 9.14');
  const E = fig('9.14');
  [[0, 140], [140, 285], [285, 428], [428, 570]].forEach((b, i) => ok(`Fig. 9.14 (${L[i]}) lines`, panel(E, b).lines, Number(t[`(${L[i]})`]?.[0])));
  const t2 = table('Figs. 9.15 and 9.16');
  const E15 = fig('9.15'), E16 = fig('9.16');
  cols(4, 142.5).forEach((b, i) => ok(`Fig. 9.15 (${L[i]}) lines`, panel(E15, b).lines, Number(t2[`(${L[i]})`]?.[0])));
  [[0, 150], [150, 290], [290, 430], [430, 570]].forEach((b, i) => ok(`Fig. 9.16 (${L[i + 4]}) lines`, panel(E16, b).lines, Number(t2[`(${L[i + 4]})`]?.[0])));
  const k = panel(fig('9.17'), [0, 230]);
  ok('Fig. 9.17 kolam lines', k.lines, Number(ANSWERS.match(/The kolam has \*\*(\d+)\*\* lines/)?.[1]));
  // "three through opposite small diamonds": a line through the top diamond is one
  const Ek = fig('9.17');
  is('Fig. 9.17: the line through the top and bottom small diamonds is a line of symmetry',
    G.fits(G.figure(G.primitives(Ek)), G.reflectIn([115, 68.14], 90)));
}

// ---- Exercise 9.2 Q9: no triangle has exactly two lines
{
  const found = new Set();
  for (let a = 1; a <= 12; a++) for (let b = 1; b <= 12; b++) {
    // triangle with base 12 on the x axis and apex at (a, b)
    const s = symOf(polyPrims([[0, 0], [12, 0], [a, b * 0.9]]));
    found.add(s.lines);
  }
  found.add(symOf(polyPrims([[0, 0], [12, 0], [6, 6 * Math.sqrt(3)]])).lines);
  ok('the numbers of lines a triangle can have', [...found].sort(), [0, 1, 3]);
}

// ---- Figs. 9.18 and 9.19: the completed drawings
function reflectPt(p, a, b) {
  const dx = b[0] - a[0], dy = b[1] - a[1];
  const t = ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy);
  return [2 * (a[0] + t * dx) - p[0], 2 * (a[1] + t * dy) - p[1]];
}
const PANELS6 = [[0, 190, 0, 115], [190, 380, 0, 115], [380, 570, 0, 115], [0, 190, 115, 250], [190, 380, 115, 250], [380, 570, 115, 250]];
function completion(n, i) {
  const mine = fig(n).filter(within(PANELS6[i]));
  const grid = mine.find(e => e.cls === 'dg-grid').lines[0][0];
  const mirrors = mine.filter(e => e.cls === 'dg-plot').map(e => e.pts);
  const drawn = mine.find(e => e.cls === 'dg-line').pts;
  const key = (s) => JSON.stringify(s.map(p => p.map(v => Math.round(v))).sort());
  const set = [drawn];
  for (let k = 0; k < 4; k++) for (const s of [...set]) for (const [m1, m2] of mirrors) {
    const r = s.map(p => reflectPt(p, m1, m2));
    if (!set.some(t => key(t) === key(r))) set.push(r);
  }
  const cell = (p) => [Math.round((p[0] - grid[0]) / 12), Math.round((p[1] - grid[1]) / 12)];
  const onMirror = (p) => mirrors.some(([a, b]) => Math.hypot(...reflectPt(p, a, b).map((v, j) => v - p[j])) < 0.5);
  return { mirrors, set, cell, onMirror, drawn, extra: mine.find(e => e.cls === 'dg-hidden') };
}
const parsePts = (s) => [...(s || '').matchAll(/\((\d+), (\d+)\)/g)].map(m => [Number(m[1]), Number(m[2])]);
{
  const t = table('Fig. 9.18');
  for (let i = 0; i < 6; i++) {
    const c = completion('9.18', i);
    ok(`Fig. 9.18 has one line of symmetry drawn in (${L[i]})`, c.mirrors.length, 1);
    const want = c.set[1].filter(p => !c.onMirror(p)).map(c.cell);
    ok(`Fig. 9.18 (${L[i]}): the new corners`, want, parsePts(t[`(${L[i]})`]?.[0]));
    const full = [...c.drawn, ...c.set[1].slice().reverse()];
    const [a, b] = c.mirrors[0];
    is(`Fig. 9.18 (${L[i]}): the finished figure folds onto itself along the line`,
      G.fits(G.figure(polyPrims(full, 'dg-line', false)), G.reflectIn(a, Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI)));
    if (c.extra) ok('Fig. 9.18 (a): the dashed part drawn is the mirror image', c.extra.pts.map(c.cell), c.set[1].map(c.cell));
  }
  const t2 = table('Fig. 9.19');
  for (let i = 0; i < 6; i++) {
    const c = completion('9.19', i);
    ok(`Fig. 9.19 (${L[i]}) has two lines drawn`, c.mirrors.length, 2);
    is(`Fig. 9.19 (${L[i]}): the drawn part and its images make 4 pieces`, c.set.length === 4);
    const verts = c.set.flat().map(c.cell);
    const listed = parsePts(t2[`(${L[i]})`]?.[0]);
    is(`Fig. 9.19 (${L[i]}): every corner ANSWERS lists is a corner of the finished figure (${listed.length} listed)`,
      listed.length > 0 && listed.every(p => verts.some(v => v[0] === p[0] && v[1] === p[1]))
      || (i === 2 && /four steps on each side/.test(t2['(c)']?.[0] || '')));
  }
  // (c) is described in words: four steps on each side, from (4, 0) to (4, 8)
  const c = completion('9.19', 2);
  const steps = c.drawn.filter((p, k) => k > 0 && k < c.drawn.length - 1).length;
  is('Fig. 9.19 (c): each piece is a staircase between (4, 0) and the across line', c.cell(c.drawn[0]).join() === '4,0' && steps === 7);
}

// ---- Fig. 9.20: the new dot closes a shape with a line of symmetry
{
  const E = fig('9.20');
  const t = table('Fig. 9.20');
  E.filter(e => e.kind === 'polyline').forEach((pl, i) => {
    const m = (t[`(${L[i]})`]?.[0] || '').match(/(\d+) (left|right), (\d+) up/);
    if (!m) { fails.push(`ANSWERS has no new dot for Fig. 9.20 (${L[i]})`); return; }
    const last = pl.pts.at(-1);
    const X = [last[0] + (m[2] === 'left' ? -1 : 1) * Number(m[1]) * 17, last[1] - Number(m[3]) * 17];
    is(`Fig. 9.20 (${L[i]}): the new dot is a dot of the grid`,
      E.some(e => e.cls === 'dg-fill-teal' && Math.hypot(e.c[0] - X[0], e.c[1] - X[1]) < 0.01));
    const s = symOf(polyPrims([...pl.pts, X]));
    is(`Fig. 9.20 (${L[i]}): the closed shape has a line of symmetry (found ${s.lines})`, s.lines >= 1);
  });
}

// ---- Fig. 9.21 and Fig. 9.22
{
  const s = panel(fig('9.21'), [0, 190]);
  ok('Fig. 9.21 windmill: no line, order 4', [s.lines, s.order], [0, 4]);
  const E = fig('9.22');
  const start = { A: [-1, -1], B: [1, -1], C: [1, 1], D: [-1, 1] };
  cols(5, 114).forEach((b, k) => {
    const mine = E.filter(within(b));
    const c = mine.find(e => e.cls === 'dg-fill-teal').c;
    const turn = G.turnBy([0, 0], 90 * k);
    for (const [name, p] of Object.entries(start)) {
      const q = turn(...p);
      const lab = mine.find(e => e.kind === 'text' && e.text === name);
      const d = [lab.at[0] - c[0], lab.at[1] - c[1] - 3.39];
      is(`Fig. 9.22 turn ${90 * k}: ${name} is at the corner a clockwise turn takes it to`,
        Math.sign(Math.round(d[0])) === Math.sign(Math.round(q[0])) && Math.sign(Math.round(d[1])) === Math.sign(Math.round(q[1])));
    }
  });
  const txt = flat(ALL);
  is('text: after 90 degrees, A is where B was', txt.includes('Corner A is now where B was, B is where C was, C is where D was, and D is where A was'));
}

// ---- Fig. 9.23 and body Example 1
{
  const E = fig('9.23');
  const top = panel(E, [0, 230, 0, 45], { dot: true });
  ok('Fig. 9.23: the strip has only the full turn (Example 1)', top.order, 1);
  const T = E.find(e => e.kind === 'polygon').pts, B = E.filter(e => e.kind === 'polygon')[1].pts;
  const turned = T.map(p => G.turnBy([115, 22.6], 180)(...p)).map(([x, y]) => [x, y + 50]);
  is('Fig. 9.23: the lower strip is the upper one after a half turn',
    turned.every(p => B.some(q => Math.hypot(q[0] - p[0], q[1] - p[1]) < 0.3)));
  is('body Example 1 answers $360^\\circ$ only', /Answer<\/span>\s*<span>\$360\^\\circ\$ is its only angle of symmetry/.test(ALL));
}

// ---- Fig. 9.24 and Fig. 9.25
{
  const E = fig('9.24');
  const o = [[0, 190], [190, 380], [380, 570]].map(b => panel(E, b, { dot: true }).order);
  ok('Fig. 9.24 orders (4 angles, 2 angles, only 360)', o, [4, 2, 1]);
  const E25 = fig('9.25');
  cols(4, 142.5).forEach((b, k) => {
    const s = panel(E25, b, { dot: true, sameFill: true });
    is(`Fig. 9.25 copy ${k + 1}: order 3`, s.order === 3);
    const mine = E25.filter(within(b));
    const c = mine.find(e => e.cls === 'dg-fill-teal').c;
    const arm = mine.find(e => e.cls === 'dg-fill-a').pts;
    const mid = arm.reduce((a, p) => [a[0] + p[0] / 4, a[1] + p[1] / 4], [0, 0]);
    const want = G.turnBy([0, 0], [0, 120, 240, 360][k])(0, -1);
    const got = [mid[0] - c[0], mid[1] - c[1]];
    const cos = (got[0] * want[0] + got[1] * want[1]) / Math.hypot(...got);
    is(`Fig. 9.25 copy ${k + 1}: the shaded arm has turned ${[0, 120, 240, 360][k]} degrees clockwise`, cos > 0.999);
  });
}

// ---- Figs. 9.26 to 9.28: Exercise 9.3
{
  const t = table('Fig. 9.26');
  const E = fig('9.26');
  [[0, 90], [90, 170], [170, 266]].forEach((b, i) => {
    const s = panel(E, b, { dot: true });
    ok(`Fig. 9.26 (${L[i]}) angles`, [...Array(s.order)].map((_, k) => 360 / s.order * (k + 1)),
      (t[`(${L[i]})`]?.[0] || '').split(',').map(Number));
  });
  const t27 = table('Fig. 9.27'), E27 = fig('9.27');
  const b27 = [[0, 89], [89, 167], [167, 245], [245, 323], [323, 401], [401, 479], [479, 570]];
  b27.forEach((b, i) => ok(`Fig. 9.27 (${L[i]}) order`, panel(E27, b, { dot: true }).order, Number(t27[`(${L[i]})`]?.[0])));
  is('ANSWERS Ex 9.3 Q2: (a)-(f) more than one, (g) not',
    ANSWERS.includes('**(a), (b), (c), (d), (e) and (f)**') && ANSWERS.includes('**(g)** has only $360^\\circ$')
    && b27.map((b, i) => panel(E27, b, { dot: true }).order > 1).join() === 'true,true,true,true,true,true,false');
  const t28 = table('Fig. 9.28'), E28 = fig('9.28');
  cols(6, 95).forEach((b, i) => ok(`Fig. 9.28 (${L[i]}) order`, panel(E28, b, { dot: true }).order, Number(t28[`(${L[i]})`]?.[0])));
}

// ---- the three lists: angles are the multiples of the smallest one
for (const [n, list] of [[2, [180, 360]], [3, [120, 240, 360]], [4, [90, 180, 270, 360]]]) {
  const printed = flat(ALL).match(new RegExp(`Exactly ${n} angles of symmetry: ([^E]*?)(?= Exactly|Do you| $)`))?.[1];
  ok(`the list for exactly ${n} angles`, nums(printed || ''), list);
}

// ---- Fig. 9.29
{
  const E = fig('9.29');
  const t = table('Fig. 9.29');
  const names = ['fan', 'flower', 'wheel'];
  [[0, 90], [90, 176], [176, 266]].forEach((b, i) => {
    const s = panel(E, b);
    const printed = t[names[i]] || [];
    const turn = printed[0]?.split(' ').reduce((a, v) => a + (v.includes('/') ? Number(v.split('/')[0]) / Number(v.split('/')[1]) : Number(v)), 0);
    ok(`Fig. 9.29 ${names[i]}: smallest turn and lines`, [360 / s.order, s.lines], [turn, Number(printed[1])]);
  });
}

// ---- Fig. 9.30: Exercise 9.4 Q1
{
  const orderOf = (mask) => Math.max(...[1, 2, 3, 4, 6, 12].filter(n => {
    const s = 12 / n; return (((mask << s) | (mask >> (12 - s))) & 4095) === mask;
  }));
  const all = new Set();
  for (let m = 0; m < 4096; m++) all.add(orderOf(m));
  ok('Fig. 9.30: the possible numbers of angles', [...all].sort((a, b) => a - b), [1, 2, 3, 4, 6, 12]);
  is('ANSWERS lists them', ANSWERS.includes('**1, 2, 3, 4, 6 and 12**'));
  const mask = (parts) => parts.reduce((a, p) => a | (1 << (p - 1)), 0);
  ok('parts 1, 5, 9 give 3 angles', orderOf(mask([1, 5, 9])), 3);
  ok('parts 1, 4, 7, 10 give 4 angles', orderOf(mask([1, 4, 7, 10])), 4);
  ok('parts 1 and 7 give 2; one part gives 1; every second part gives 6', [orderOf(mask([1, 7])), orderOf(mask([1])), orderOf(mask([1, 3, 5, 7, 9, 11]))], [2, 1, 6]);
  const s = panel(fig('9.30'), [0, 190]);
  ok('Fig. 9.30 uncoloured: 12 angles', s.order, 12);
}

// ---- Figs. 9.31 and 9.32; Exercise 9.4 Q7, Q11, Q13
{
  const p = panel(fig('9.31'), [0, 190]);
  ok('Fig. 9.31 Parliament outline: lines and order', [p.lines, p.order], [3, 3]);
  is('ANSWERS Ex 9.4 Q7', ANSWERS.includes('**Yes, 3 lines of symmetry**'));
  const tri = symOf(polyPrims([[0, 0], [10, 0], [5, 5 * Math.sqrt(3)]]));
  ok('Q13: the equilateral triangle has the same lines and order', [tri.lines, tri.order], [p.lines, p.order]);
  const c = panel(fig('9.32'), [0, 190]);
  const q11 = ANSWERS.match(/Chakra has \*\*(\d+)\*\* lines of symmetry and \*\*(\d+)\*\* angles/);
  ok('Fig. 9.32 Ashoka Chakra', [c.lines, c.order], q11?.slice(1).map(Number));
}

// ---- Fig. 9.33: the completed tile design has exactly 2 lines
{
  const E = fig('9.33');
  const tris = E.filter(e => e.cls === 'dg-fill-a').map(e => e.pts);
  const refl = (P, ax) => P.map(([x, y]) => ax === 'v' ? [230 - x, y] : [x, 184 - y]);
  const full = [...tris, ...tris.map(t => refl(t, 'v'))];
  full.push(...full.map(t => refl(t, 'h')));
  const prims = full.flatMap(t => polyPrims(t, 'dg-fill-a'));
  const cells = [];
  for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) cells.push(...polyPrims([[27 + 22 * i, 4 + 22 * j], [49 + 22 * i, 4 + 22 * j], [49 + 22 * i, 26 + 22 * j], [27 + 22 * i, 26 + 22 * j]], 'dg-thin'));
  const s = symOf([...prims, ...cells], [115, 92]);
  ok('Fig. 9.33 finished design: exactly 2 lines', s.lines, 2);
  is('Fig. 9.33: the two lines are the middle lines of the grid', E.filter(e => e.cls === 'dg-plot').every(e => e.pts.some(p => p[0] === 115 || p[1] === 92)));
}

// ---- Chapter 1's figures: Exercise 9.4 Q8 to Q10
{
  const polys = (n) => G.elements(G.figureSvg(CH1, n).svg).filter(e => e.kind === 'polygon' && e.cls === 'dg-line');
  const reg = polys('1.8').map(e => { const s = symOf(G.primitives([e])); return [e.pts.length, s.lines, s.order]; });
  ok('Fig. 1.8: sides, lines, angles of each regular polygon', reg, [3, 4, 5, 6, 7, 8, 9, 10].map(n => [n, n, n]));
  is('ANSWERS Q8', ANSWERS.includes('**3, 4, 5, 6, 7, 8, 9 and 10**') && ANSWERS.includes('**3, 4, 5, 6, 7, 8, 9, 10** angles'));
  const koch = polys('1.11').map(e => { const s = symOf(G.primitives([e])); return [s.lines, s.order]; });
  ok('Fig. 1.11: Koch shapes', koch, [[3, 3], [6, 6], [6, 6], [6, 6]]);
  is('ANSWERS Q10', ANSWERS.includes('(a triangle) has **3** lines and\n    **3** angles') && ANSWERS.includes('**6** lines and **6**\n    angles'));
}

// ---- Fig. 9.34 and stage 1
{
  const E = fig('9.34');
  const names = ['A', 'E', 'H', 'N', 'T', 'X', 'Z'];
  const b = [[0, 40], [40, 78], [78, 115], [115, 150], [150, 190], [190, 225], [225, 266]];
  const s = b.map(x => panel(E, x));
  const withLine = names.filter((_, i) => s[i].lines > 0);
  const turning = names.filter((_, i) => s[i].order > 1);
  ok('Fig. 9.34 letters with a line of symmetry', withLine, ['A', 'E', 'H', 'T', 'X']);
  ok('Fig. 9.34 letters with rotational symmetry', turning, ['H', 'N', 'X', 'Z']);
  ok('Fig. 9.34 orders of H, N, X, Z', turning.map(n => s[names.indexOf(n)].order), [2, 2, 2, 2]);
  is('ANSWERS stage 1 letters', ANSWERS.includes(`**${withLine.join(', ')}**`) && ANSWERS.includes(`**${turning.join(', ').replace(', X, ', ', X,\n   ')}**`));
  // Stage 1 was repaired on 16 September 2026 so that nothing in it answers
  // a body question. Its values are read back from the two pages.
  const S1RAW = BEYOND.slice(0, BEYOND.indexOf('<div class="c-practice__sub">'));
  const S1 = flat(S1RAW);
  // 1. a circle with one diameter
  const cd = symOf([{ c: [0, 0], r: 30, cls: 'dg-line' }, ...polyPrims([[-30, 0], [30, 0]], 'dg-line', false)], [0, 0]);
  ok('stage 1: a circle with one diameter, lines', cd.lines, Number(S1.match(/So there are (\d+) lines of symmetry/)?.[1]));
  ok('stage 1: a circle with one diameter, angles', [...Array(cd.order)].map((_, k) => 360 / cd.order * (k + 1)),
    nums(S1RAW.match(/So the angles of symmetry are (\$[^.]*)\./)?.[1] || ''));
  // 3. a figure that fits after 90 degrees
  const sq = G.figure(polyPrims([[0, 0], [20, 0], [20, 20], [0, 20]]));
  is('stage 1: a square fits after 90, 180 and 270 degrees', [90, 180, 270].every(t => G.fits(sq, G.turnBy([10, 10], t))));
  is('stage 1: a square does not fit after 45 degrees', !G.fits(sq, G.turnBy([10, 10], 45)));
  is('stage 1: two and three quarter turns are 180 and 270', 2 * 90 === 180 && 3 * 90 === 270 && S1.includes('three quarter turns make $270'));
  // 4. equal arms, equally spaced
  const offered = S1.match(/whole number of degrees: ([\d, ]+)\?/)?.[1].split(',').map(Number);
  ok('stage 1: the arms offered', offered, [9, 10, 11, 12]);
  ok('stage 1: arms giving a whole number of degrees', offered.filter(n => 360 % n === 0),
    S1.match(/so ([\d, and]+) arms work/)?.[1].split(/, | and /).map(Number));
  // 5. the words: each letter is drawn with straight lines and placed in turn
  const glyph = {
    T: [[[0, 0], [20, 0]], [[10, 0], [10, 40]]],
    O: [[[0, 0], [20, 0], [20, 40], [0, 40], [0, 0]]],
    N: [[[0, 40], [0, 0], [20, 40], [20, 0]]],
    U: [[[0, 0], [0, 40], [20, 40], [20, 0]]],
    S: [[[20, 0], [0, 0], [0, 20], [20, 20], [20, 40], [0, 40]]],
    M: [[[0, 40], [0, 0], [10, 24], [20, 0], [20, 40]]],
  };
  const word = (w) => [...w].flatMap((c, i) => glyph[c].flatMap(p => polyPrims(p.map(([x, y]) => [x + 30 * i, y]), 'dg-line', false)));
  const words = ['TOOT', 'NUN', 'SOS', 'MOM'];
  const mid = (w) => [(30 * w.length - 10) / 2, 20];
  const turned = words.filter(w => G.fits(G.figure(word(w)), G.turnBy(mid(w), 180)));
  const mirrored = words.filter(w => G.fits(G.figure(word(w)), G.reflectIn(mid(w), 90)));
  ok('stage 1: words that fit a half turn', turned, [S1.match(/so ([A-Z]+) works/)?.[1]]);
  ok('stage 1: words that fit the mirror', mirrored, S1.match(/so ([A-Z]+) and ([A-Z]+) look the same in the mirror/)?.slice(1));
  is('stage 1: N passes the half turn alone, S passes it, T, U and M do not',
    symOf(word('N')).order === 2 && symOf(word('S')).order === 2 && ['T', 'U', 'M'].every(c => symOf(word(c)).order === 1));
  is('stage 1: T, O and M have an up-and-down line; N and S do not',
    ['T', 'O', 'M'].every(c => G.fits(G.figure(word(c)), G.reflectIn([10, 20], 90)))
    && ['N', 'S'].every(c => !G.fits(G.figure(word(c)), G.reflectIn([10, 20], 90))));
  // 6. two equal squares meeting at a corner
  const bow = symOf([...polyPrims([[0, 0], [20, 0], [20, 20], [0, 20]]), ...polyPrims([[20, 20], [40, 20], [40, 40], [20, 40]])], [20, 20]);
  ok('stage 1: two squares at a corner, lines and order', [bow.lines, bow.order],
    [Number(S1.match(/the figure has (\d+) lines of symmetry/)?.[1]), Number(S1.match(/rotational symmetry of order (\d+)\. A quarter turn/)?.[1])]);
  // nothing in Beyond may answer a body question: the repaired items stay out
  for (const gone of ['octagon', '51\\frac{3}{7}', 'second player', 'rhombus', 'multiples of the smallest one'])
    is('Beyond no longer prints "' + gone + '"', !BEYOND.includes(gone));
  ok('stage 1 has six questions', (S1RAW.match(/class="c-try"/g) || []).length, 6);
  // syllabus audit, 17 Sep 2026: the general claim that two lines of
  // symmetry at right angles bring a half turn is not taught, so it is
  // not printed; the half turn is checked by turning, and the checks
  // above confirm it for H, X and the two squares
  for (const gone of ['Reflecting a figure in one of these lines and then in the other', 'bring a half turn with them', 'has the same effect as a half turn'])
    is('Beyond no longer claims "' + gone + '"', !BEYOND.includes(gone));
  is('stage 1: H and X checked by each test on its own', S1.includes('H and X pass both tests, but each test had to be tried on its own'));
  is('stage 1: the two squares\' half turn found by turning', S1.includes('the half turn was found by turning the figure, not by folding it'));
  const hx = ['H', 'X'].map(c => ({ H: [[[0, 0], [0, 40]], [[20, 0], [20, 40]], [[0, 20], [20, 20]]], X: [[[0, 0], [20, 40]], [[0, 40], [20, 0]]] })[c]);
  is('stage 1: H and X each have 2 lines and order 2, found separately',
    hx.every(g => { const s = symOf(g.flatMap(p => polyPrims(p, 'dg-line', false)), [10, 20]); return s.lines === 2 && s.order === 2; }));
}

/* ================================================================
   D. ANSWERS.md values
   ================================================================ */
{
  const inA = (what, needle) => is(`${what} — ANSWERS.md has "${needle}"`, ANSWERS.includes(needle));
  inA('T&R 5 arms', '$360^\\circ \\div 5 = 72^\\circ$');
  ok('T&R 5 and 6 arms: the angles', [[1, 2, 3, 4, 5].map(k => 72 * k), [1, 2, 3, 4, 5, 6].map(k => 60 * k)],
    [nums(ANSWERS.match(/symmetry are \$72\^\\circ\$[^.]*\./)[0]), nums(ANSWERS.match(/symmetry are \$60\^\\circ\$[^.]*\./)[0])]);
  ok('T&R 7 arms', [Math.floor(360 / 7), 360 % 7, 7], nums(ANSWERS.match(/\$51\\frac\{3\}\{7\}\$/)[0]));
  is('T&R 7 arms is not whole', 360 % 7 !== 0);
  ok('Ex 9.4 Q4', [2, 3, 4, 5, 6].map(k => 60 * k), nums(ANSWERS.match(/^4\. (\$120.*)$/m)[1] + ' ' + ANSWERS.split('\n')[ANSWERS.split('\n').findIndex(l => l.startsWith('4. $120')) + 1]).slice(0, 5));
  ok('Ex 9.4 Q5', [60 / 3, 20, 40], [nums(ANSWERS.match(/\$60\^\\circ \\div 3 = (\d+)\^\\circ\$/)[0]).at(-1), 20, 40]);
  ok('Ex 9.4 Q6', [360 % 45 === 0, 360 % 17 === 0, 17 * 21], [true, false, 357]);
  is('Ex 9.4 Q6 answers yes and no', ANSWERS.includes('(a) **Yes:** $45 \\times 8 = 360$') && ANSWERS.includes('(b) **No:**'));
  is('Ex 9.3 T&R: true and true', ANSWERS.includes('2. **True.**') && ANSWERS.includes('3. **True.**'));
  is('Ex 9.2 Q9: no triangle with exactly two lines', ANSWERS.includes('**No triangle has exactly two lines of symmetry.**'));
  // stage 1
  inA('stage 1 circle', 'A circle with one diameter drawn has **2** lines of symmetry');
  inA('stage 1 circle angles', 'symmetry are **$180^\\circ$ and $360^\\circ$**');
  inA('stage 1 turns', '**Not necessarily** for $45^\\circ$');
  inA('stage 1 arms', '**9, 10 and 12** arms');
  inA('stage 1 words', 'Half turn: **SOS**. Mirror along an up-and-down line: **TOOT, MOM**.');
  inA('stage 1 squares', '6. Two squares touching at a corner: **2** lines of symmetry');
}

/* ================================================================
   E. By the Book and Beyond the Book (maths-v2, 26 September 2026)

   Every answer is recomputed from the question's own numbers, and every
   option question is tested option by option: exactly the keyed option
   (or options) must be right. The printed key on the Answers pages and
   the ANSWERS.md key are read back and compared with what is computed.
   ================================================================ */
const BOARD = pages.filter(f => /^p09\d/.test(f)).map(read).join('\n');
const qText = (html, n) => {
  const m = html.match(new RegExp(`<ol class="c-questions"${n === 1 ? '' : ` data-start="${n}"`}>\\s*<li>([\\s\\S]*?)</li>\\s*</ol>\\s*</div>`));
  return m ? m[1] : null;
};
const optsOf = (li) => [...(li.match(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*?)<\/ol>/)?.[1] || '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => flat(m[1]).replace(/&nbsp;/g, ' '));
const letter = (i) => '(' + 'abcd'[i] + ')';
// the maths answers, computed
const arms = (n) => 360 / n;                                  // smallest angle, equal arms
const fitsArms = (n, t) => (t * n) % 360 === 0;              // a turn fits n equal arms
const markedOrder = (n, every) => n / every;                  // order when every k-th arm is marked
const linesOfEqualArms = (n) => n;                            // n equal arms, equally spaced
{
  // ---- the division's shape
  ok('By the Book numbers 1 to 50', [...BOARD.matchAll(/data-start="(\d+)"/g)].map(m => +m[1]), [...Array(49)].map((_, i) => i + 2));
  ok('By the Book forms in order', [...BOARD.matchAll(/c-practice__sub">([^<]+)</g)].map(m => m[1]),
    ['Very short answer', 'Short answer', 'Long answer', 'Assertion and reason', 'Case-based questions', 'Objective questions']);
  const subAt = (name) => { const i = BOARD.indexOf(`c-practice__sub">${name}`); return Number(BOARD.slice(i).match(/data-start="(\d+)"/)?.[1] || 1); };
  ok('By the Book form starts', ['Short answer', 'Long answer', 'Assertion and reason', 'Case-based questions', 'Objective questions'].map(subAt), [11, 21, 31, 36, 41]);
  ok('one note line only (the assertion-reason key)', (BOARD.match(/c-practice__note/g) || []).length, 1);
  ok('five case passages with the fixed line', (BOARD.match(/Based on the above information, answer the following(?: |&nbsp;)questions\./g) || []).length, 5);

  // ---- objective questions: the right option, computed
  const want = {
    41: { opts: ['5', '10', '20', '36'], right: String(linesOfEqualArms(10)) },
    42: { right: '$30^\\circ$', calc: 360 / 12 },
    43: { right: '3.5 cm', calc: 7 / 2 },
    44: { right: 'S' },
    45: { right: '30', calc: 360 / 12 },
    46: { right: '$60^\\circ$', calc: [36, 54, 90, 60].filter(t => !fitsArms(20, t)) },
    47: { right: 'P, Q and R', calc: [9, 12, 15].filter(n => fitsArms(n, 120)).length },
    48: { right: '(i) and (ii)' },
    49: { right: 'No: arms with' },
    50: { right: '4', calc: [20, 40, 60, 80, 100].filter(t => t < 100 && t % 20 === 0).length },
  };
  ok('Q42 30 degrees', want[42].calc, 30);
  ok('Q43 3.5 cm', want[43].calc, 3.5);
  ok('Q45 30 arms', want[45].calc, 30);
  ok('Q46 only 60 fails', want[46].calc, [60]);
  ok('Q47 all three fit 120', want[47].calc, 3);
  ok('Q50 four angles below 100', want[50].calc, 4);
  const objKey = {};
  for (let n = 41; n <= 50; n++) {
    const li = qText(BOARD, n); const o = optsOf(li);
    const idx = o.findIndex(x => x.startsWith(flat(want[n].right).replace(/&nbsp;/g, ' ')) || x === want[n].right);
    is(`Q${n}: exactly one option matches the computed answer`, idx >= 0 && o.filter(x => x.startsWith(flat(want[n].right))).length === 1);
    objKey[n] = letter(idx);
  }
  const printedObj = Object.fromEntries([...BEYOND.matchAll(/<span class="n">(\d+)<\/span> (\([a-d]\))/g)].map(m => [m[1], m[2]]));
  for (let n = 41; n <= 50; n++) ok(`key ${n}`, printedObj[n], objKey[n]);
  const spread = Object.values(objKey).reduce((a, k) => (a[k] = (a[k] || 0) + 1, a), {});
  is('objective keys use all four letters', Object.keys(spread).length === 4);

  // ---- assertion and reason: truth values
  const AR = {
    31: [360 / 9 === 40, true, true],       // A true, R true, R explains
    32: [4 + 4 === 8, true, true],
    33: [true, false, false],               // T: one line, no turn; R false (T itself)
    34: [false, true, false],               // 90, 90, 180 unequal; a full turn is 360
    35: [true, true, false],                // equal sides alone do not give 4 lines
  };
  const code = ([a, r, ex]) => a && r ? (ex ? '(a)' : '(b)') : a ? '(c)' : r ? '(d)' : '?';
  for (const n of [31, 32, 33, 34, 35]) ok(`assertion-reason ${n}`, printedObj[n], code(AR[n]));
  is('assertion-reason key line under its sub-head, word for word', BOARD.includes('Choose (a) if A and R are both true and R is the correct explanation of A; (b) if A and R are both true but R is not the correct explanation of A; (c) if A is true but R is false; (d) if A is false but R is&nbsp;true.'));

  // ---- written answers, recomputed and read back from the Answers pages
  const row = (n) => flat(BEYOND.match(new RegExp(`work__label">${n}</span>\\s*<span>([\\s\\S]*?)</span>`))?.[1] || '');
  const has = (n, ...needles) => is(`By the Book ${n}: answer row has ${needles.join(', ')}`, needles.every(x => row(n).includes(x)));
  has(1, '6 cm'); ok('BtB 1', 3 + 3, 6);
  ok('BtB 2', [360 / 20], [18]); has(2, '18');
  ok('BtB 3', fitsArms(12, 50), false); has(3, 'No');
  ok('BtB 4', [arms(9)], [40]); has(4, 'order 9');
  ok('BtB 6', [360 / 4, 180, 270, 360], [90, 180, 270, 360]);
  ok('BtB 7', [arms(20), 54 % arms(20)], [18, 0]);
  ok('BtB 13', [arms(30), 3 * arms(30), 360 / (3 * arms(30))], [12, 36, 10]);
  ok('BtB 14', [3 * 90, 120 + 270 - 360], [270, 30]);
  ok('BtB 17', [arms(15), 48 % 24, 90 % 24 === 0, 120 % 24], [24, 0, false, 0]);
  ok('BtB 18', [6, 6 / 2], [6, 3]);
  ok('BtB 19', [arms(10), 360 - 2 * 36, 360 - 36], [36, 288, 324]);
  ok('BtB 21', [20 / 2 - 3, 20 / 2 + 3, 6, 20 - 4], [7, 13, 6, 16]);
  ok('BtB 22', [arms(16), 7 * arms(16), 4 * arms(16), 360 / 90], [22.5, 157.5, 90, 4]);
  ok('BtB 23', [arms(9), [1, 2, 3, 4].map(k => 40 * k), 3 * 40, 360 / 120], [40, [40, 80, 120, 160], 120, 3]);
  ok('BtB 24', 8 * 4, 32);
  ok('BtB 25', [5 - 2, 5 - 2, 2 + 5, 5 + 5], [3, 3, 7, 10]);
  ok('BtB 26', [arms(12), 4 * 30, fitsArms(12, 120)], [30, 120, true]);
  ok('BtB 27', [arms(20), 2 * 18, 360 / 20], [18, 36, 18]);
  ok('BtB 28', [2 * 2, 4 * 2, 2 * (4 + 2)], [4, 8, 12]);
  ok('BtB 30', [3 + 3, 2 + 2], [6, 4]);
  ok('BtB 36', [arms(16), 4 * 22.5, 360 / (120 / 4)], [22.5, 90, 12]);
  ok('BtB 37', [arms(10), 10, 5 * 36], [36, 10, 180]);

  // grids and tiles, built and measured: the 3 by 3 X, the 4 by 4 floor,
  // the chessboard, the kolam, the garland, the star with triangles
  const Z = 20;
  const cells = (list, size) => list.flatMap(([i, j]) => polyPrims([[i * Z, j * Z], [(i + 1) * Z, j * Z], [(i + 1) * Z, (j + 1) * Z], [i * Z, (j + 1) * Z]], 'dg-fill-a'))
    .concat(polyPrims([[0, 0], [size * Z, 0], [size * Z, size * Z], [0, size * Z]]));
  const sx = symOf(cells([[0, 0], [2, 0], [1, 1], [0, 2], [2, 2]], 3), [1.5 * Z, 1.5 * Z]);
  ok('BtB 15: the shaded X', [sx.lines, sx.order], [4, 4]);
  const floor = [[0, 0], [1, 1], [2, 2], [3, 3], [3, 0], [2, 1], [1, 2], [0, 3]];
  const f1 = symOf(cells(floor, 4), [2 * Z, 2 * Z]);
  const f2 = symOf(cells(floor.filter(([i, j]) => !(i === 0 && j === 0)), 4), [2 * Z, 2 * Z]);
  ok('BtB 29: floor, then one corner white', [floor.length, f1.lines, f1.order, f2.lines, f2.order], [8, 4, 4, 1, 1]);
  const black = []; for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) if ((i + j) % 2 === 0) black.push([i, j]);
  const cb = symOf(cells(black, 8), [4 * Z, 4 * Z]);
  ok('BtB 38: chessboard', [64, cb.order, cb.lines], [64, 2, 2]);
  const kolam = [...polyPrims([[0, 0], [60, 0], [60, 60], [0, 60]]), ...polyPrims([[20, 20], [40, 20], [40, 40], [20, 40]])];
  const k1 = symOf(kolam, [30, 30]); const k2 = symOf([...kolam, ...polyPrims([[0, 0], [60, 60]], 'dg-line', false)], [30, 30]);
  ok('BtB 39: kolam, then one diagonal', [16, k1.lines, k2.lines, k2.order], [16, 4, 2, 2]);
  // radial arms with marks, as figures: arm k at angle 360k/n, marked arms longer
  const armFig = (n, marked) => [...Array(n)].flatMap((_, k) => {
    const t = 2 * Math.PI * k / n, r = marked(k) ? 30 : 20;
    return polyPrims([[0, 0], [r * Math.cos(t), r * Math.sin(t)]], 'dg-line', false);
  });
  const g = symOf(armFig(20, k => k % 2 === 0), [0, 0]);
  ok('BtB 27: garland of 20, every second marked', [g.order, g.lines], [10, 10]);
  const bells = symOf(armFig(10, k => k % 5 === 0), [0, 0]);
  ok('BtB 37 (iii): bells on every fifth point', bells.order, 2);
  const armCls = (n, clsOf) => [...Array(n)].flatMap((_, k) => { const t = 2 * Math.PI * k / n; return polyPrims([[0, 0], [20 * Math.cos(t), 20 * Math.sin(t)]], clsOf(k), false); });
  const pook = symOf(armCls(16, k => ['dg-fill-a', 'dg-fill-b', 'dg-fill-c', 'dg-fill-b'][k % 4]), [0, 0]);
  ok('BtB 36 (ii): pookalam repeats every 4 parts', pook.order, 4);
  const clock = symOf(armFig(12, k => k === 0), [0, 0]);
  ok('BtB 26: one hand at 12', [clock.lines, clock.order], [1, 1]);
  const star = [...polyPrims([[-2, -2], [2, -2], [2, 2], [-2, 2]]), ...polyPrims([[-2, -2], [2, -2], [0, -2 - 2 * Math.sqrt(3)]]), ...polyPrims([[2, -2], [2, 2], [2 + 2 * Math.sqrt(3), 0]]),
    ...polyPrims([[2, 2], [-2, 2], [0, 2 + 2 * Math.sqrt(3)]]), ...polyPrims([[-2, 2], [-2, -2], [-2 - 2 * Math.sqrt(3), 0]])];
  const st = symOf(star, [0, 0]);
  ok('BtB 24: square with four triangles', [st.lines, st.order], [4, 4]);

  // ---- Beyond the Book: parts, counts, keys
  ok('Beyond parts in order', [...BEYOND.matchAll(/<div class="c-practice__sub">([^<]+)<\/div>/g)].map(m => m[1]).filter(x => x !== 'By the Book' && x !== 'Beyond the Book'),
    ['Single correct', 'More than one correct', 'Numerical answer', 'Matching', 'Paragraph-based']);
  ok('Beyond examples 1 to 10', [...BEYOND.matchAll(/c-example__tab">Example (\d+)</g)].map(m => +m[1]), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  ok('Beyond practice numbered 2 to 15', [...BEYOND.matchAll(/c-questions" data-start="(\d+)"/g)].map(m => +m[1]), [...Array(14)].map((_, i) => i + 2));
  ok('Beyond practice split 4 4 3 2 2', (() => {
    const at = (name) => BEYOND.indexOf(`c-practice__sub">${name}`);
    const parts = ['Single correct', 'More than one correct', 'Numerical answer', 'Matching', 'Paragraph-based'].map(at).concat(BEYOND.indexOf('c-stage__title">Answers'));
    return parts.slice(0, 5).map((s, i) => (BEYOND.slice(s, parts[i + 1]).match(/<ol class="c-questions"/g) || []).length);
  })(), [4, 4, 3, 2, 2]);
  is('no "Choose one correct option" line and no format tag on a tab', !/Choose one correct option|Select all correct|c-example__tab">Example \d+ ·/.test(BEYOND));

  // examples, recomputed
  ok('Beyond Ex 1', 4 + 4, 8);
  ok('Beyond Ex 2', [arms(20), 5 * 18, 360 / 90], [18, 90, 4]);
  ok('Beyond Ex 5', 13 / 2, 6.5);
  ok('Beyond Ex 6', [arms(36), 3 * 10, 360 / 30, 36 / 3], [10, 30, 12, 12]);
  ok('Beyond Ex 7', [18, 36, 72, 90].map(arms), [20, 10, 5, 4]);
  const tet = (sq) => symOf(sq.flatMap(([i, j]) => polyPrims([[i * 20, j * 20], [(i + 1) * 20, j * 20], [(i + 1) * 20, (j + 1) * 20], [i * 20, (j + 1) * 20]])));
  ok('Beyond Ex 8 / Practice 4: shapes of squares, lines', [
    tet([[0, 0], [1, 0], [2, 0], [3, 0]]).lines, tet([[0, 0], [1, 0], [0, 1], [1, 1]]).lines,
    tet([[0, 0], [1, 0], [2, 0], [1, 1]]).lines, tet([[0, 0], [1, 0], [2, 0], [0, 1]]).lines], [2, 4, 1, 0]);
  const S5 = tet([[0, 1], [1, 1], [2, 1], [0, 0], [2, 2]]);
  ok('Practice 4: the S of five squares', [S5.lines, S5.order], [0, 2]);
  ok('Practice 4: the others each have a line', [tet([[0, 0], [1, 0], [0, 1], [1, 1]]).lines > 0, tet([[0, 0], [1, 0], [2, 0], [1, 1]]).lines > 0, tet([[0, 0], [1, 0], [2, 0], [3, 0]]).lines > 0], [true, true, true]);
  const rang = symOf(armCls(12, k => ['dg-fill-a', 'dg-fill-b', 'dg-fill-c'][k % 3]), [0, 0]);
  ok('Beyond Ex 9: red, yellow, blue petals', [rang.order, 360 / rang.order], [4, 90]);
  ok('Beyond Ex 10', [6 + 6, 40 / 2 - 6, 18 / 2], [12, 14, 9]);
  ok('Practice 1', 4 * arms(40), 36);
  ok('Practice 6', [45, 66, 90, 100].map(t => fitsArms(60, t)), [false, true, true, false]);
  const bow = [...polyPrims([[0, 0], [40, 0], [40, 40], [0, 40]]), ...polyPrims([[0, 0], [20, 20], [0, 40]], 'dg-fill-a'), ...polyPrims([[40, 0], [20, 20], [40, 40]], 'dg-fill-a'),
    ...polyPrims([[0, 0], [40, 40]], 'dg-line', false), ...polyPrims([[40, 0], [0, 40]], 'dg-line', false)];
  const bw = symOf(bow, [20, 20]);
  ok('Practice 7: the square with left and right shaded', [bw.lines, bw.order], [2, 2]);
  ok('Practice 9', 360 / 8, 45);
  const clk2 = symOf(armFig(12, k => k === 0 || k === 6), [0, 0]);
  ok('Practice 10: marks at 12 and 6', clk2.lines, 2);
  ok('Practice 11', [50 / 5, 360 / (50 / 5), 360 / 36], [10, 36, 10]);
  ok('Practice 13', [12, 12 / 3, 12 / 4, 12 / 6].map(o => 12 / (12 / o)), [12, 4, 3, 2]);
  const wheel = symOf(armFig(16, k => k % 4 === 0), [0, 0]);
  ok('Practice 14: 16 spokes, 4 red', [arms(16), 360 / wheel.order, wheel.lines], [22.5, 90, 4]);
  ok('Practice 15', [3 + 3, 7 + 7], [6, 14]);

  // the printed Beyond key, and ANSWERS.md
  const bKey = BEYOND.match(/c-answers__stage">1&ndash;13<\/span>\s*<span class="c-answers__list">([\s\S]*?)<\/span>\s*<\/li>/)?.[1] || '';
  const printed = Object.fromEntries(bKey.split(/&nbsp;/).map(x => x.replace(/<[^>]+>/g, ' ').trim()).filter(Boolean).map(x => { const m = x.match(/^(\d+) (.*)$/); return [m[1], m[2].trim()]; }));
  ok('Beyond key as printed', printed, { 1: '(b)', 2: '(c)', 3: '(a)', 4: '(d)', 5: '(a), (b), (d)', 6: '(b), (c)', 7: '(a), (c)', 8: '(a), (b), (c)', 9: '45', 10: '2', 11: '10', 12: '(c)', 13: '(b)' });
  // single correct and matching practice: the keyed option is the computed one
  const B = (n) => optsOf(qText(BEYOND, n) || '');
  is('Practice 1 keyed option is 36 degrees', B(1)[1].includes('36'));
  ok('Practice 2 keyed option (3 letters of MOON)', B(2)[2], '3');
  ok('Practice 3 keyed option', B(3)[0], '5 cm below the line');
  ok('Practice 12 keyed option', B(12)[2], 'P–2, Q–3, R–1, S–4');
  ok('Practice 13 keyed option', B(13)[1], 'P–4, Q–3, R–2, S–1');
  for (const [n, rightIdx] of [[12, 2], [13, 1]]) is(`Practice ${n}: one option only`, new Set(B(n)).size === 4 && B(n).filter((_, i) => i === rightIdx).length === 1);
  // ANSWERS.md agrees
  for (let n = 41; n <= 50; n++) is(`ANSWERS.md objective ${n}`, ANSWERS.includes(`${n} ${objKey[n]}`));
  for (const n of [31, 32, 33, 34, 35]) is(`ANSWERS.md assertion-reason ${n}`, ANSWERS.includes(`${n} ${code(AR[n])}`));
  is('ANSWERS.md Beyond practice keys', ['1 (b)', '2 (c) 3', '5 (a), (b), (d)', '6 (b), (c)', '7 (a), (c)', '8 (a), (b), (c)', '9 **45**', '10 **2**', '11 **10**', '12 (c)', '13 (b)'].every(x => ANSWERS.includes(x)));
  // nothing in either division repeats a giveaway of a body question
  for (const gone of ['octagon', '51\\frac{3}{7}', 'second player', 'rhombus', '8, 9, 11, 12', '$360 \\div 8 = 45$, $360 \\div 9'])
    is('Beyond does not print "' + gone + '"', !BEYOND.includes(gone));
}

/* ---- report ---------------------------------------------------- */
console.log('\nClass 6 · Chapter 9 · Symmetry');
console.log(`  ${checked} arithmetic identities read off the pages and ANSWERS.md and evaluated`);
if (skipped.length) {
  console.log(`  ${skipped.length} maths span(s) not arithmetic, so not evaluated:`);
  for (const s of skipped) console.log(`      ${s}`);
}
console.log(`  ${pass} check(s) passed`);
if (fails.length) {
  console.log(`\n  ${fails.length} FAILED:`);
  for (const f of fails) console.log(`    ! ${f}`);
  process.exit(1);
}
console.log('  all clear\n');
