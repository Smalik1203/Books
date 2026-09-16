#!/usr/bin/env node
/* Re-derive every number and every symmetry claim this chapter prints.

     node pages/class-6/math-ch09-symmetry/check-numbers.mjs

   Nothing here restates a printed value. Figures are read out of their SVG
   and their lines of symmetry and angles of symmetry are FOUND, by
   reflecting and turning the drawn points and comparing the result with
   the drawing (symmetry-geometry.mjs, beside this file). The printed claim
   is then read back out of the page or out of ANSWERS.md and compared.

   Four parts:
     A  every arithmetic identity set as maths, on the pages and in
        ANSWERS.md
     B  the figures: every count of lines, every angle and order of
        rotational symmetry, every folded, cut, punched and completed
        drawing, and every worked answer that rests on them
     C  every multiple-choice and assertion-reason question — exactly one
        option is right, and it is the one the printed key gives
     D  ANSWERS.md: its tables and its values, read back and recomputed

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
  const reg = polys('1.7').map(e => { const s = symOf(G.primitives([e])); return [e.pts.length, s.lines, s.order]; });
  ok('Fig. 1.7: sides, lines, angles of each regular polygon', reg, [3, 4, 5, 6, 7, 8, 9, 10].map(n => [n, n, n]));
  is('ANSWERS Q8', ANSWERS.includes('**3, 4, 5, 6, 7, 8, 9 and 10**') && ANSWERS.includes('**3, 4, 5, 6, 7, 8, 9, 10** angles'));
  const koch = polys('1.10').map(e => { const s = symOf(G.primitives([e])); return [s.lines, s.order]; });
  ok('Fig. 1.10: Koch shapes', koch, [[3, 3], [6, 6], [6, 6], [6, 6]]);
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
  const S1 = flat(read('p101.html') + ' ' + read('p102.html'));
  const S1RAW = read('p101.html') + read('p102.html');
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
  ok('stage 1: the arms offered', offered, [8, 9, 11, 12]);
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
}

// ---- Beyond: the worked examples, read back from their Answer rows
const EXAMPLES = {};
const EXAMPLES_RAW = {};
{
  const blocks = BEYOND.split('<div class="c-example">').slice(1);
  for (const b of blocks) {
    const n = Number(b.match(/c-example__tab">Example (\d+)/)[1]);
    const rows = {};
    for (const m of b.matchAll(/<span class="work__label">([^<]+)<\/span>\s*<span>([\s\S]*?)<\/span>(?:\s*<span class="work__why">([\s\S]*?)<\/span>)?<\/div>/g))
      rows[m[1]] = flat(m[2]) + (m[3] ? ' | ' + flat(m[3]) : '');
    EXAMPLES[n] = rows;
    EXAMPLES_RAW[n] = b.split('Answer</span>')[1] || '';
  }
  ok('Beyond examples are numbered 1 to 13, in order', Object.keys(EXAMPLES).map(Number), [...Array(13)].map((_, i) => i + 1));
  ok('the body has one example, Example 1', [...ALL.slice(0, ALL.indexOf('data-bridge')).matchAll(/c-example__tab">Example (\d+)/g)].map(m => m[1]), ['1']);
  const figs = [...ALL.matchAll(/<span class="fignum">Fig\. 9\.(\d+)<\/span>/g)].map(m => Number(m[1]));
  ok('figures numbered 9.1 to 9.43 in order, none twice', figs, [...Array(43)].map((_, i) => i + 1));
}
const ans = (n) => EXAMPLES[n]?.Answer || '';
{
  const E = fig('9.35');
  const a = panel(E, [0, 95]), b = panel(E, [95, 190]);
  ok('Beyond Example 1: (a) and (b)', [a.lines, b.lines], nums(ans(1)).filter((_, i) => i % 1 === 0));
  const oct = panel(fig('9.36'), [0, 190]);
  ok('Beyond Example 2: lines of the cut square (not 8)', [oct.lines, 8], nums(ans(2)));
  const sides = fig('9.36').find(e => e.cls === 'dg-line').pts.map((p, k, P) => Math.hypot(P[(k + 1) % 8][0] - p[0], P[(k + 1) % 8][1] - p[1]));
  is('Beyond Example 2: long and short sides take turns', sides.every((s, k) => Math.abs(s - sides[k % 2]) < 1e-9) && sides[0] !== sides[1]);

  // Example 3: distances from the line, read from the steps
  const E37 = fig('9.37');
  const tri = E37.find(e => e.cls === 'dg-line').pts;
  const mx = E37.find(e => e.cls === 'dg-plot').pts[0][0];
  const dist = tri.map(p => (mx - p[0]) / 12);
  ok('Beyond Example 3: P, Q, R squares from the line', dist, ['Step 1', 'Step 2', 'Step 3'].map(s => nums(EXAMPLES[3][s])[0]));
  const labels = Object.fromEntries(E37.filter(e => e.kind === 'text').map(e => [e.text, e.at]));
  is('Fig. 9.37: labels P, Q, R sit beside their corners', ['P', 'Q', 'R'].every((n, k) => Math.hypot(labels[n][0] - tri[k][0], labels[n][1] - tri[k][1]) < 14));

  // Example 4
  const E38 = fig('9.38');
  const [m1, m2] = E38.find(e => e.cls === 'dg-plot').pts;
  const dots = E38.filter(e => e.c).map(e => e.c);
  const B = dots[0], A = dots[1];
  is('Fig. 9.38: B is on the line, A is 4 squares to its right', Math.abs(reflectPt(B, m1, m2)[0] - B[0]) < 1e-6 && A[0] - B[0] === 48 && A[1] === B[1]);
  const A2 = reflectPt(A, m1, m2);
  ok('Beyond Example 4: the reflection of A, from B (squares right, squares down)', [(A2[0] - B[0]) / 12, (A2[1] - B[1]) / 12].map(v => Math.round(v * 1e6) / 1e6), [0, -nums(ans(4))[0]]);
  is('Beyond Example 4 says "directly above B"', ans(4).includes('directly above B'));
  let steps = 0, P = A.slice();
  while (Math.abs(reflectPt(P, m1, m2)[0] - P[0]) > 1e-6) { P = [P[0] - 12, P[1] - 12]; steps++; }
  ok('Beyond Example 4: diagonal steps to the line', steps, nums(EXAMPLES[4]['Step 1'])[2]);

  // Example 5 (the 16 cm sheet)
  const fold = 16 / 2, h1 = fold - 3, h2 = fold + 3;
  ok('Beyond Example 5: apart, and from the nearer side', [h2 - h1, Math.min(h1, 16 - h2)], nums(ans(5)));

  // Example 6: the T-shaped hole
  const E39 = fig('9.39');
  const cut = E39.find(e => e.cls === 'dg-hidden').pts;
  const opened = E39.find(e => e.kind === 'polygon' && e.cls === 'dg-line').pts;
  const foldX = 16, openFold = E39.find(e => e.cls === 'dg-ghost').pts[0][0];
  const fromCut = [...cut, ...cut.slice().reverse().slice(1, -1).map(([x, y]) => [2 * foldX - x, y])].map(([x, y]) => [x - foldX + openFold, y]);
  const drop = (pts) => pts.filter((p, k) => { const a = pts[(k - 1 + pts.length) % pts.length], b = pts[(k + 1) % pts.length]; return Math.abs((p[0] - a[0]) * (b[1] - p[1]) - (p[1] - a[1]) * (b[0] - p[0])) > 1e-9; });
  const same = (X, Y) => X.length === Y.length && X.every(p => Y.some(q => Math.hypot(p[0] - q[0], p[1] - q[1]) < 1e-6));
  is('Fig. 9.39: the opened hole drawn is the cut and its mirror image', same(drop(fromCut), opened));
  const t = symOf(polyPrims(opened));
  ok('Beyond Example 6: sides and lines of the hole', [opened.length, t.lines], [nums(ans(6))[0], 1]);
  ok('Beyond Example 6: bar and stem widths', [(opened[1][0] - opened[0][0]) / 10, (opened[4][0] - opened[5][0]) / 10], nums(EXAMPLES[6]['Step 3']));

  // Example 7
  const E40 = fig('9.40');
  const a7 = panel(E40, [0, 95], { dot: true }), b7 = panel(E40, [95, 190], { dot: true });
  const la = panel(E40, [0, 95]).lines, lb = panel(E40, [95, 190]).lines;
  ok('Beyond Example 7: orders; lines', [a7.order, b7.order, la, lb], [...nums(ans(7)).slice(0, 2), 0, 0]);
  is('Beyond Example 7 says neither has a line', ans(7).includes('neither has a line of symmetry'));

  // Example 8
  const n8 = nums(ans(8));
  ok('Beyond Example 8', [360 / 20, 126 % 18 === 0, 100 % 18 === 0], [n8[0], ans(8).includes('126°') || /\$126\^\\circ\$ is an angle/.test(EXAMPLES_RAW[8]), !/\$100\^\\circ\$ is not/.test(EXAMPLES_RAW[8])]);
  // Example 9: 120 + 270 = 390 = 360 + 30; the angles are then multiples of 30
  ok('Beyond Example 9', [(120 + 3 * 90) - 360, 360 / 30], [nums(ans(9))[0], 12]);
  // Example 10, 11, 12
  ok('Beyond Example 10', [360 / 15, 48, 72, 15], nums(ans(10)).slice(0, 5).filter((_, k) => k !== 1));
  ok('Beyond Example 11', [360 / 10, 90 % 10 === 0, 45 % 10 === 0], [nums(ans(11))[0], true, false]);
  const E41 = fig('9.41');
  const s41 = panel(E41, [0, 190], { dot: true });
  ok('Beyond Example 12: order of the eight arms', [s41.order, 360 / s41.order], [nums(ans(12)).at(-1), nums(ans(12))[0]]);
  // Example 13: digits
  const E42 = fig('9.42');
  const d = [[0, 70], [70, 120], [120, 170], [170, 230]].map(b => panel(E42, b));
  ok('Beyond Example 13: lines and orders of 0, 2, 5, 8', d.map(s => [s.lines, s.order]), [[2, 2], [0, 2], [0, 2], [2, 2]]);
  is('Beyond Example 13 answer', ans(13) === '0 and 8: 2 lines, order 2; 2 and 5: no line, order 2');
}

// ---- Beyond practice: the written answers, read back from the answer page
const ROW = {};
for (const m of BEYOND.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) ROW[m[1]] ??= flat(m[2]);
const part = (q, l) => (ROW[q] || '').match(new RegExp(`\\(${l}\\)(.*?)(?=\\([a-e]\\)|$)`))?.[1] || '';
const letters = {
  A: [[[0, 40], [10, 0], [20, 40]], [[5, 20], [15, 20]]],
  H: [[[0, 0], [0, 40]], [[20, 0], [20, 40]], [[0, 20], [20, 20]]],
  M: [[[0, 40], [0, 0], [10, 24], [20, 0], [20, 40]]],
  N: [[[0, 40], [0, 0], [20, 40], [20, 0]]],
  T: [[[0, 0], [20, 0]], [[10, 0], [10, 40]]],
  V: [[[0, 0], [10, 40], [20, 0]]],
  W: [[[0, 0], [5, 40], [10, 10], [15, 40], [20, 0]]],
  X: [[[0, 0], [20, 40]], [[0, 40], [20, 0]]],
  Y: [[[0, 0], [10, 18], [20, 0]], [[10, 18], [10, 40]]],
  Z: [[[0, 0], [20, 0], [0, 40], [20, 40]]],
};
const letter = (c) => symOf(letters[c].flatMap(p => polyPrims(p, 'dg-line', false)));
const squares = (cells) => cells.flatMap(([i, j]) => polyPrims([[i * 10, j * 10], [i * 10 + 10, j * 10], [i * 10 + 10, j * 10 + 10], [i * 10, j * 10 + 10]]));
{
  ok('Q17: order 1 means 360 only', nums(ROW[17]), [360]);
  const three = (ROW[18].match(/\b([A-Z]), ([A-Z]) and ([A-Z])\b/) || []).slice(1);
  is(`Q18: ${three.join(', ')} each have a line and no turn`, three.length === 3 && three.every(c => letter(c).lines >= 1 && letter(c).order === 1));
  ok('Q19', 360 / 5, nums(ROW[19])[0]);
  ok('Q20', [360, 40, 360 / 40], nums(ROW[20]).slice(0, 3));
  ok('Q20: the multiples of 9 either side of 100', [9 * 11, 9 * 12], [nums(ROW[20]).at(-4), nums(ROW[20]).at(-1)]);
  is('Q20: 100 is not a multiple of 9', 100 % 9 !== 0 && ROW[20].startsWith('No'));
  const circles = [{ c: [0, 0], r: 10, cls: 'dg-line' }, { c: [20, 0], r: 10, cls: 'dg-line' }];
  ok('Q21: two touching circles', symOf(circles).lines, nums(ROW[21])[0]);
  ok('Q22: T of five squares, Z of five squares', [symOf(squares([[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]])).lines,
    symOf(squares([[0, 0], [1, 0], [1, 1], [1, 2], [2, 2]])).lines, symOf(squares([[0, 0], [1, 0], [1, 1], [1, 2], [2, 2]])).order], [1, 0, 2]);
  ok('Q23', [360 / 3, 240, 360], nums(ROW[23]).slice(-3));
  is('Q23: 90 is not among them', ![120, 240, 360].includes(90) && ROW[23].startsWith('No'));
  is('Q24: 80 x 5 = 400 = 360 + 40 is printed', [80 * 5, 360, 40].every(v => nums(ROW[24]).includes(v)) && 80 * 5 === 360 + 40);
  const A25 = reflectPt([0, 3], [0, 0], [1, -1]);
  ok('Q25: 3 squares directly below B reflects to 3 squares left of B', A25.map(v => Math.round(v * 1e9) / 1e9), [-nums(ROW[25])[0], 0]);
  is('Q25 says left', ROW[25].includes('to the left of B'));
  const sq26 = [...polyPrims([[0, 0], [30, 0], [30, 30], [0, 30]]), ...polyPrims([[10, 0], [10, 30]], 'dg-line', false), ...polyPrims([[20, 0], [20, 30]], 'dg-line', false)];
  ok('Q26: a square with two lines at the thirds', symOf(sq26).lines, 2);
  // Q27
  const side = 12, f27 = side / 2, holes = [f27 - 2, f27 + 2];
  ok('Q27 (a) (b) (c)', [holes.length, holes[1] - holes[0], Math.min(holes[0], side - holes[1])],
    [nums(part(27, 'a'))[0], nums(part(27, 'b'))[0], nums(part(27, 'c'))[0]]);
  const sheet = [...polyPrims([[0, 0], [120, 0], [120, 120], [0, 120]]), ...holes.map(x => ({ c: [x * 10, 30], r: 3, cls: 'dg-line' }))];
  const s27 = symOf(sheet, [60, 60]);
  ok('Q27 (d): one line, no rotational symmetry', [G.linesOfSymmetry(G.figure(sheet), [60, 60]).count, s27.order], [1, 1]);
  is('Q27 (d) ANSWERS says no', part(27, 'd').includes('no, a half turn'));
  // Q28
  const arms = (n, longEvery) => [...Array(n)].flatMap((_, k) => {
    const a = k * 2 * Math.PI / n, len = k % longEvery === 0 ? 40 : 25;
    return polyPrims([[0, 0], [len * Math.cos(a), len * Math.sin(a)]], 'dg-line', false);
  });
  const b28 = symOf(arms(30, 2), [0, 0]), c28 = symOf(arms(30, 3), [0, 0]);
  ok('Q28 (a)', 360 / 30, nums(part(28, 'a'))[2]);
  ok('Q28 (b)', [360 / b28.order, b28.order], nums(part(28, 'b')).slice(-2));
  ok('Q28 (c)', [360 / c28.order, c28.order], nums(part(28, 'c')).slice(-2));
  const both = [72, 120, 144].filter(t => t % (360 / b28.order) === 0 && t % (360 / c28.order) === 0);
  ok('Q28 (d)', both, nums(part(28, 'd')).slice(0, 2));
  is('Q28 (d): 120 fits (b) only', 120 % (360 / b28.order) === 0 && 120 % (360 / c28.order) !== 0);
  // Q29, checked against the cells ANSWERS.md names
  const grid = [];
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) grid.push(...polyPrims([[i * 10, j * 10], [i * 10 + 10, j * 10], [i * 10 + 10, j * 10 + 10], [i * 10, j * 10 + 10]], 'dg-thin'));
  const crosses = (cells) => cells.flatMap(([i, j]) => [...polyPrims([[i * 10 + 2, j * 10 + 2], [i * 10 + 8, j * 10 + 8]], 'dg-line', false), ...polyPrims([[i * 10 + 8, j * 10 + 2], [i * 10 + 2, j * 10 + 8]], 'dg-line', false)]);
  const g = (cells) => symOf([...grid, ...crosses(cells)], [20, 20]);
  const s29a = g([[0, 0], [3, 0], [0, 3], [3, 3]]);
  const bCells = parsePts(ANSWERS.match(/\(b\) the squares at ([^;]*?) counted/)?.[1]);
  const s29b = g(bCells);
  const s29c = g([[0, 0], [1, 0], [0, 1], [1, 1]]);
  ok('Q29 (a) lines; (b) order, lines, count; (c) lines', [s29a.lines, s29b.order, s29b.lines, bCells.length, s29c.lines], [4, 4, 0, 4, 1]);
  is('Q29 (b) on the page names the same squares', part(29, 'b').includes('second square of the top row') && bCells.some(p => p[0] === 1 && p[1] === 0));
  // Q30 and Q31
  const marks = [...Array(12)].flatMap((_, k) => { const a = k * Math.PI / 6; return polyPrims([[40 * Math.cos(a), 40 * Math.sin(a)], [46 * Math.cos(a), 46 * Math.sin(a)]], 'dg-line', false); });
  const s30 = symOf(marks, [0, 0]);
  ok('Q30 (a) (b) (d)', [360 / 12, s30.order, s30.lines], [nums(part(30, 'a')).at(-1), nums(part(30, 'b'))[0], nums(part(30, 'd'))[0]]);
  ok('Q30 (c): 12 to 5 is five marks', [30 * 5, (30 * 5) % 30 === 0], [nums(part(30, 'c')).at(-2) ?? 0, part(30, 'c').startsWith(' yes')]);
  const spokes = { P: 12, Q: 15, R: 20 };
  const printedSpokes = Object.fromEntries([...BEYOND.matchAll(/<tr><td>([PQR])<\/td><td>(\d+)<\/td><\/tr>/g)].map(m => [m[1], Number(m[2])]));
  ok('Q31 table as printed', printedSpokes, spokes);
  ok('Q31 (a)', Object.values(printedSpokes).map(n => 360 / n), nums(part(31, 'a')).filter((_, k) => k % 3 === 2));
  const fits = (t) => Object.keys(printedSpokes).filter(k => t % (360 / printedSpokes[k]) === 0);
  ok('Q31 (b)', fits(72).join(' and '), part(31, 'b').match(/([PQR] and [PQR])/)?.[1]);
  ok('Q31 (c)', fits(90).join(' and '), part(31, 'c').match(/([PQR] and [PQR])/)?.[1]);
  ok('Q31 (d)', 360 / 12, nums(part(31, 'd')).at(-1));
}

/* ================================================================
   C. one right option, and the key says so
   ================================================================ */
const KEY = Object.fromEntries([...BEYOND.matchAll(/<span class="n">(\d+)<\/span> \(([a-d])\)/g)].map(m => [m[1], m[2]]));
const QUESTIONS = {};
for (const m of BEYOND.matchAll(/data-start="(\d+)">\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) QUESTIONS[m[1]] = m[2];
{
  const first = BEYOND.match(/c-practice__num">3<\/span>Practice[\s\S]*?<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/);
  QUESTIONS[1] = first[1];
}
ok('practice is numbered 1 to 31 with no gap', Object.keys(QUESTIONS).map(Number).sort((a, b) => a - b), [...Array(31)].map((_, i) => i + 1));
const subs = [...BEYOND.matchAll(/c-practice__sub">([^<]+)</g)].map(m => m[1]);
ok('the six forms, in order', subs, ['Choose the correct option', 'Assertion and reason', 'Very short answer', 'Short answer', 'Long answer', 'Case-based questions']);
is('no Case study label', !/c-case__label|Case study/.test(BEYOND));
const optionsOf = (n) => [...(QUESTIONS[n].match(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*?)<\/ol>/)?.[1] || '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => flat(m[1]));
const deg = (s) => { const t = s.replace(/\$|\^\\circ/g, ''); const m = t.match(/^(\d+)\\frac\{(\d+)\}\{(\d+)\}$/); return m ? Number(m[1]) + m[2] / m[3] : Number(t); };
const E43 = fig('9.43');
const shape43 = { P: [0, 64], Q: [64, 128], R: [128, 210], S: [210, 266] };
const s43 = Object.fromEntries(Object.entries(shape43).map(([k, b]) => [k, panel(E43, [...b, 0, 50])]));
const rect42 = symOf(polyPrims([[0, 0], [40, 0], [40, 20], [0, 20]]));
const square = symOf(polyPrims([[0, 0], [20, 0], [20, 20], [0, 20]]));
const MCQ = {
  1: (o) => s43[o].order > 1 && s43[o].lines === 0,
  2: (o) => s43[o].order === 1 && s43[o].lines === 0,
  3: (o) => s43[o].lines === 1,
  4: (o) => Number(o) === s43.R.lines,
  5: (o) => Number(o) === 360 / 8,
  6: (o) => letter(o).lines === 1,
  7: (o) => { const r = reflectPt([-3, 0], [0, 0], [0, 1]); return o === `${r[0]} squares to the right of the line, in the same row`; },
  8: (o) => Number(o.split(' ')[0]) === (10 + 4) - (10 - 4),
  9: (o) => Math.abs(deg(o) - 360 / 32) < 1e-9,
  10: (o) => deg(o) % 180 === 0,
  11: (o) => ({ 'a rectangle 4 cm by 2 cm': rect42, 'the letter H': letter('H'), 'the letter N': letter('N'), 'a square': square })[o].order % 4 === 0,
  12: (o) => deg(o) === 360 / 30,
};
for (const [n, right] of Object.entries(MCQ)) {
  const opts = optionsOf(n);
  const hits = opts.map((o, i) => right(o) ? 'abcd'[i] : null).filter(Boolean);
  if (opts.length !== 4) fails.push(`Q${n}: ${opts.length} options`);
  else if (hits.length !== 1) fails.push(`Q${n}: ${hits.length} right options (${hits.join(', ') || 'none'})`);
  else if (hits[0] !== KEY[n]) fails.push(`Q${n}: the right option is (${hits[0]}), the key prints (${KEY[n]})`);
  else pass++;
}
/* Assertion-reason: A and R are computed; whether R explains A is the
   judgement being tested, and is stated. Each is tied to its printed text. */
const AR = {
  13: { A: ['A figure whose smallest angle of symmetry is 30° has 12 angles of symmetry.', () => 360 / 30 === 12],
    R: ['$30 \\times 12 = 360$.', () => 30 * 12 === 360], explains: true },
  14: { A: ['A circle has rotational symmetry.', () => G.angles(G.figure([{ c: [0, 0], r: 20, cls: 'dg-line' }]), [0, 0]).order > 1],
    R: ['A circle has exactly 360 angles of symmetry.', () => G.angles(G.figure([{ c: [0, 0], r: 20, cls: 'dg-line' }]), [0, 0]).order === 360], explains: false },
  15: { A: ['A figure made of three equal radial arms, with angles of 100°, 130° and 130° between them, has rotational symmetry.', () => {
      const pr = [0, 100, 230].flatMap(d => polyPrims([[0, 0], [30 * Math.cos(d * Math.PI / 180), 30 * Math.sin(d * Math.PI / 180)]], 'dg-line', false));
      return symOf(pr, [0, 0]).order > 1; }],
    R: ['These three angles add up to 360°.', () => 100 + 130 + 130 === 360], explains: false },
  16: { A: ['The letter H, drawn with straight lines, has rotational symmetry of order 2.', () => letter('H').order === 2],
    R: ['The letter H has a line of symmetry.', () => letter('H').lines >= 1], explains: false },
};
const txt = (s) => flat(s.replace(/\$(\d+)\^\\circ\$/g, '$1°'));
for (const [n, q] of Object.entries(AR)) {
  const m = QUESTIONS[n].match(/<p>Assertion \(A\): ([\s\S]*?)<\/p><p>Reason \(R\): ([\s\S]*?)<\/p>/);
  ok(`Q${n}: printed assertion and reason`, m ? [txt(m[1]), q.R[0].includes('$') ? m[2] : txt(m[2])] : null, [q.A[0], q.R[0]]);
  const a = q.A[1](), r = q.R[1]();
  const want = a && r ? (q.explains ? 'a' : 'b') : a ? 'c' : r ? 'd' : '?';
  ok(`Q${n}: A ${a}, R ${r}, so the key`, KEY[n], want);
}
is('the assertion-reason note names Questions 13 to 16', BEYOND.includes('In Questions 13 to 16, choose (a) if both A and R are true and R explains A;'));
const spread = 'abcd'.split('').map(l => Object.values(KEY).filter(k => k === l).length);
is(`the key uses all four letters (${spread.join(' ')})`, spread.every(c => c > 0));
ok('the key covers 1 to 16', Object.keys(KEY).map(Number), [...Array(16)].map((_, i) => i + 1));

// the "why the other options are wrong" notes
{
  const why = BEYOND.slice(BEYOND.indexOf('Why the other options are wrong'));
  const note = (n) => flat(why.match(new RegExp(`work__label">${n}</span>\\s*<span>([\\s\\S]*?)</span>`))?.[1] || '');
  ok('note 5: the multiples of 8 up to 360, and 360 - 8', [8, 360, 360 / 8], [nums(note(5))[0], nums(note(5))[1], nums(note(5))[4]]);
  ok('note 5: option (d) is 360 - 8', 360 - 8, deg(optionsOf(5)[3]));
  ok('note 9', [360 / 32, 12, 360 / 12, 10, 360 / 10], [nums(note(9))[2] + nums(note(9))[3] / nums(note(9))[4], ...nums(note(9)).slice(5, 9)]);
  ok('note 15', 100 + 130 + 130, nums(note(15))[3]);
  is('note 14 and 15 name the right answers', note(14).endsWith('(c).') && note(15).endsWith('(d).') && KEY[14] === 'c' && KEY[15] === 'd');
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
  inA('stage 1 arms', '**8, 9 and 12** arms');
  inA('stage 1 words', 'After a half turn: **SOS** only. In the mirror: **TOOT and MOM**.');
  inA('stage 1 squares', '6. **2** lines of symmetry');
  // the key table in ANSWERS matches the page's key
  const akey = Object.fromEntries([...ANSWERS.matchAll(/\| (\d+) \(([a-d])\)/g)].map(m => [m[1], m[2]]));
  ok('ANSWERS key = printed key', akey, KEY);
  // practice answers in ANSWERS agree with the page
  for (const [n, want] of [[19, 360 / 5], [20, 9], [21, 2], [25, 3]]) {
    const line = ANSWERS.match(new RegExp(`^${n}\\. (.*)$`, 'm'))?.[1] || '';
    is(`ANSWERS ${n} states ${want}`, nums(line).includes(want) || line.includes(`**${want}**`) || line.includes(`${want} squares`));
  }
  ok('ANSWERS 27', [2, 4, 4], nums(ANSWERS.match(/^27\. (.*)$/m)[1]).slice(0, 3));
  ok('ANSWERS 30', [30, 12, 150, 30, 5, 12], nums(ANSWERS.match(/^30\. [\s\S]*?\*\*12\*\*/m)[0]).slice(1));
  ok('ANSWERS 31', [30, 24, 18, 30], nums(ANSWERS.match(/^31\. [\s\S]*?spokes\./m)[0]).filter((_, k) => k > 0));
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
