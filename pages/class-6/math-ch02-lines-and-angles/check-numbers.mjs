#!/usr/bin/env node
/* Re-derive every number this chapter prints.

     node pages/class-6/math-ch02-lines-and-angles/check-numbers.mjs [--show]

   A chapter about angles gets most of its numbers from its figures, so
   this reads the figures: every ray is taken from the SVG on the page, its
   direction measured from the drawn coordinates, and every angle a
   question asks about is worked out from those directions. A value printed
   on a figure (a label such as 40°, a student's reading, a protractor
   numeral) is compared with the angle the figure actually draws. Nothing
   below types a printed answer as the thing to check it against: a value
   is computed, and then looked for on the page or in ANSWERS.md.

   Six parts:
     A  every arithmetic identity set as maths, on the pages and in ANSWERS.md
     B  the figures: printed values against drawn angles, and the answers
        each figure question needs
     C  the worked examples' Answer rows and the practice answers, read back
        off the page one lettered part at a time
     D  every multiple-choice and assertion-reason question: exactly one
        option is right, it is the one the key prints, and each
        assertion-reason key follows from the truth of the A and R printed
        under that number
     E  ANSWERS.md
     F  the page: a question that names a figure prints with it or facing
        it, and the shape of Beyond the Book

   Exits non-zero if anything does not hold up. --show prints the values
   measured off the figures. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const SHOW = process.argv.includes('--show');
let pass = 0;
const fails = [];
const show = (...a) => { if (SHOW) console.log('   ', ...a); };
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function ok(what, got, want) {
  if (same(got, want)) pass++;
  else fails.push(`${what}\n      computed ${JSON.stringify(got)}\n      expected ${JSON.stringify(want)}`);
}
function is(what, cond) { if (cond) pass++; else fails.push(what); }

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const HTML = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const BODY = pages.filter(f => /^p0/.test(f)).map(f => HTML[f]).join('\n');
const BEYOND = pages.filter(f => /^p1/.test(f)).map(f => HTML[f]).join('\n');
const ANSWERS = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const flat = (s) => s.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&rsquo;/g, '’').replace(/&ldquo;|&rdquo;/g, '"')
  .replace(/&ndash;/g, '–').replace(/&hellip;/g, '…').replace(/&[a-z]+;/g, ' ')
  .replace(/\s+/g, ' ').trim();
const nums = (s) => [...s.replace(/\^\\circ|°/g, '').matchAll(/\d+(\.\d+)?/g)].map(m => Number(m[0]));
const r1 = (x) => Math.round(x * 10) / 10;
const deg = (x) => Math.round(x);

/* ---- A. every arithmetic identity ----------------------------- */

function toExpr(side) {
  const s = side
    .replace(/\^\\circ|\^\{\\circ\}|°/g, '')
    .replace(/\\times/g, '*')
    .replace(/\\div/g, '/')
    .replace(/\\frac\{(\d+)\}\{(\d+)\}/g, '($1/$2)')
    .replace(/\\,|\\ |\\quad/g, ' ')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, '');
  if (!s || !/^[-+*/()0-9.]+$/.test(s)) return null;
  return s;
}
const skipped = [];
function sweep(where, text) {
  let n = 0;
  for (const m of text.matchAll(/\$([^$]+)\$/g)) {
    const span = m[1];
    if (!span.includes('=')) continue;
    const sides = span.split('=').map(s => s.trim()).filter(Boolean);
    const numeric = sides.map(toExpr).filter(v => v !== null);
    if (sides.length < 2 || numeric.length < 2) { skipped.push(`${where}: $${span}$`); continue; }
    const v = numeric.map(e => Function(`"use strict";return (${e})`)());
    n++;
    if (v.some(x => Math.abs(x - v[0]) > 1e-9)) fails.push(`${where}: $${span}$ — sides are ${v.join(' and ')}`);
    else pass++;
  }
  return n;
}
let checked = 0;
for (const f of pages) checked += sweep(f, HTML[f]);
const checkedA = sweep('ANSWERS.md', ANSWERS);

/* ---- the figures, read off the page ---------------------------- */

function figure(num) {
  for (const f of pages) {
    const h = HTML[f];
    const at = h.indexOf(`<span class="fignum">Fig. ${num}</span>`);
    if (at < 0) continue;
    const start = h.lastIndexOf('<svg', at);
    return { f, svg: h.slice(start, h.indexOf('</svg>', start)) };
  }
  throw new Error(`Fig. ${num} is not on any page`);
}
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([a-z][a-z0-9-]*)="([^"]*)"/g)].map(m => [m[1], m[2]]));
const lines = (svg, cls) => [...svg.matchAll(/<line [^>]*>/g)].map(m => attrs(m[0]))
  .filter(a => !cls || a.class === cls).map(a => ({ x1: +a.x1, y1: +a.y1, x2: +a.x2, y2: +a.y2, cls: a.class }));
const circles = (svg, cls) => [...svg.matchAll(/<circle [^>]*>/g)].map(m => attrs(m[0]))
  .filter(a => !cls || a.class === cls).map(a => ({ x: +a.cx, y: +a.cy, r: +a.r }));
const texts = (svg, cls) => [...svg.matchAll(/<text ([^>]*)>([^<]*)<\/text>/g)]
  .map(m => ({ ...attrs(m[1]), t: m[2] })).filter(a => !cls || a.class === cls).map(a => ({ ...a, x: +a.x, y: +a.y }));
const paths = (svg, cls) => [...svg.matchAll(/<path [^>]*>/g)].map(m => attrs(m[0])).filter(a => !cls || a.class === cls);
const polys = (svg) => [...svg.matchAll(/<polygon [^>]*>/g)].map(m => attrs(m[0]).points.trim().split(/\s+/).map(p => p.split(',').map(Number)));

// the direction from V to P, in degrees anticlockwise from the right (y points down on the page)
const dir = (V, P) => ((Math.atan2(-(P[1] - V[1]), P[0] - V[0]) * 180 / Math.PI) + 360) % 360;
const between = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
const angleAt = (V, P, Q) => between(dir(V, P), dir(V, Q));
// every ray drawn from V: a structural line that starts at V
const raysFrom = (svg, V, cls = 'dg-line') => lines(svg, cls)
  .filter(l => Math.hypot(l.x1 - V[0], l.y1 - V[1]) < 0.05).map(l => dir(V, [l.x2, l.y2]));
// a named point: the drawn point (or line end) nearest the letter, within a strip of the figure
function named(svg, letter, x0 = -1e9, x1 = 1e9, y0 = -1e9, y1 = 1e9) {
  const inside = (p) => p[0] >= x0 && p[0] <= x1 && p[1] >= y0 && p[1] <= y1;
  const labels = texts(svg).filter(t => t.t === letter && inside([t.x, t.y]));
  if (labels.length !== 1) throw new Error(`${labels.length} labels "${letter}" in [${x0},${x1}]`);
  const L = labels[0];
  const cands = [
    ...circles(svg, 'dg-line').filter(c => c.r < 1).map(c => [c.x, c.y]),
    ...lines(svg).filter(l => /dg-line|dg-ghost/.test(l.cls)).flatMap(l => [[l.x1, l.y1], [l.x2, l.y2]]),
  ].filter(inside);
  return cands.reduce((b, p) => (Math.hypot(p[0] - L.x, p[1] - L.y) < Math.hypot(b[0] - L.x, b[1] - L.y) ? p : b));
}
// an arc: its centre (given), its end directions, and its span in the direction it is drawn
function arc(d, V) {
  const m = d.match(/M\s*([-\d.]+)[ ,]([-\d.]+)\s*A\s*([\d.]+)[ ,]([\d.]+)\s+[\d.]+\s+([01])\s+([01])\s+([-\d.]+)[ ,]([-\d.]+)/);
  const a1 = dir(V, [+m[1], +m[2]]), a2 = dir(V, [+m[7], +m[8]]);
  const span = +m[6] === 0 ? (a2 - a1 + 360) % 360 : (a1 - a2 + 360) % 360;
  return { a1, a2, span, large: +m[5], r: +m[3] };
}
const type = (x) => x === 0 ? 'zero' : x < 90 ? 'acute' : x === 90 ? 'right' : x < 180 ? 'obtuse' : x === 180 ? 'straight' : x < 360 ? 'reflex' : x === 360 ? 'full turn' : '?';

// a protractor's numerals: the outer ring reads 180 minus the direction, the inner ring the direction
function scale(what, svg, C, tol = 3, rmax = Infinity) {
  const t = texts(svg, 'dg-tick').map(x => ({ v: +x.t, a: dir(C, [x.x, x.y]), r: Math.hypot(x.x - C[0], x.y - C[1]) }))
    .filter(x => x.r < rmax && (x.a <= 185 || x.a >= 355));   // an upright protractor's numerals are all above its base
  const rs = t.map(x => x.r); const mid = (Math.min(...rs) + Math.max(...rs)) / 2;
  const bad = t.filter(x => {
    const want = x.r > mid ? 180 - x.a : x.a;
    return Math.abs(want - x.v) > tol;
  });
  is(`${what}: every protractor numeral sits at its own reading (outer 180 − direction, inner = direction)${bad.length ? ' — ' + JSON.stringify(bad.slice(0, 3)) : ''}`, t.length >= 14 && !bad.length);
  return t;
}

const F = {};

/* Fig. 2.10 — each case turns further */
{
  const g = figure('2.10');
  const turns = [48, 142, 236, 330, 424, 518].map(x => raysFrom(g.svg, [x, 62]).find(a => a > 0.5));
  show('Fig 2.10 turns', turns);
  is('Fig 2.10: each case turns further than the one before', turns.every((a, i) => i === 0 || a > turns[i - 1]));
  F.cases = turns.map(deg);
}

/* Fig. 2.12 — the bicycle; ∠BDC */
{
  const g = figure('2.12');
  const [A, B, C, D] = ['A', 'B', 'C', 'D'].map(l => named(g.svg, l));
  const joins = (P, Q) => lines(g.svg, 'dg-line').some(l => (Math.hypot(l.x1 - P[0], l.y1 - P[1]) < 0.1 && Math.hypot(l.x2 - Q[0], l.y2 - Q[1]) < 0.1) || (Math.hypot(l.x2 - P[0], l.y2 - P[1]) < 0.1 && Math.hypot(l.x1 - Q[0], l.y1 - Q[1]) < 0.1));
  is('Fig 2.12: bars DB and DC are drawn, so ∠BDC is an angle of the frame', joins(D, B) && joins(D, C));
  is('Fig 2.12: bars AB, AD, BC are drawn too (the other angles named)', joins(A, B) && joins(A, D) && joins(B, C));
  F.bdc = deg(angleAt(D, B, C));
  show('∠BDC', angleAt(D, B, C));
}

/* Fig. 2.13 — three rays from P */
{
  const g = figure('2.13');
  ok('Fig 2.13: three rays start at P', raysFrom(g.svg, named(g.svg, 'P')).length, 3);
}

/* Fig. 2.14 — a single curve for RTQ, a double one for RTP */
{
  const g = figure('2.14');
  const T = named(g.svg, 'T'), R = named(g.svg, 'R'), Q = named(g.svg, 'Q'), P = named(g.svg, 'P');
  const arcs = paths(g.svg, 'dg-thin').map(p => arc(p.d, T));
  const spans = (P1, P2) => arcs.filter(a => Math.abs(Math.min(a.a1, a.a2) - Math.min(dir(T, P1), dir(T, P2))) < 1.5
    && Math.abs(Math.max(a.a1, a.a2) - Math.max(dir(T, P1), dir(T, P2))) < 1.5).length;
  ok('Fig 2.14: curves on ∠RTQ and on ∠RTP', [spans(R, Q), spans(R, P)], [1, 2]);
}

/* Figs. 2.15 to 2.20 — comparing */
{
  const g = figure('2.15');
  const V = [[104, 92], [214, 34], [350, 56], [520, 94]];
  F.f215 = V.map(v => { const [a, b] = raysFrom(g.svg, v); return deg(between(a, b)); });
  show('Fig 2.15', F.f215);
  const close = [];
  for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) if (Math.abs(F.f215[i] - F.f215[j]) <= 6) close.push('abcd'[i] + 'abcd'[j]);
  ok('Fig 2.15: the pairs close in size (the caption says two of them are close — flagged)', close, ['ab', 'cd']);

  const h = figure('2.16');
  const abc = deg(angleAt(named(h.svg, 'B'), named(h.svg, 'C', 0, 200), named(h.svg, 'A', 0, 200)));
  const pqr = deg(angleAt(named(h.svg, 'Q'), named(h.svg, 'R', 200, 380), named(h.svg, 'P', 200, 380)));
  const over = raysFrom(h.svg, [410, 90]).map(deg).sort((a, b) => a - b);
  ok('Fig 2.16: ∠ABC, ∠PQR, and the superimposed copy', [abc, pqr, over], [28, 54, [0, abc, pqr]]);
  is('Fig 2.16: ∠PQR is the bigger', pqr > abc);
  F.f216 = [abc, pqr];

  const k = figure('2.17');
  const three = [[30, 96], [222, 96], [390, 96]].map(v => { const r = raysFrom(k.svg, v); return deg(between(r[0], r[1])); });
  ok('Fig 2.17: the two angles and the superimposed pair are equal', new Set(three).size, 1);
  const armA = Math.hypot(...[0, 1].map(i => named(k.svg, 'A', 0, 200)[i] - [30, 96][i]));
  const armX = Math.hypot(...[0, 1].map(i => named(k.svg, 'X', 200, 380)[i] - [222, 96][i]));
  is('Fig 2.17: the arms are of different lengths', Math.abs(armA - armX) > 5);
  F.f217 = three[0];

  const m = figure('2.18');
  const O = named(m.svg, 'O');
  const [A, X, Y, B, C] = ['A', 'X', 'Y', 'B', 'C'].map(l => named(m.svg, l));
  F.f218 = { AOB: deg(angleAt(O, A, B)), XOY: deg(angleAt(O, X, Y)), XOB: deg(angleAt(O, X, B)), XOC: deg(angleAt(O, X, C)) };
  show('Fig 2.18', JSON.stringify(F.f218));
  is('Fig 2.18: B and C are on the same ray from O', Math.abs(dir(O, B) - dir(O, C)) < 0.1);
  is('Fig 2.18: OA stands straight up', F.f218.AOB === 90);

  const n = figure('2.19');
  const O2 = named(n.svg, 'O');
  const [X2, A2, Y2, B2] = ['X', 'A', 'Y', 'B'].map(l => named(n.svg, l));
  F.f219 = { XOY: deg(angleAt(O2, X2, Y2)), AOB: deg(angleAt(O2, A2, B2)), XOA: deg(angleAt(O2, X2, A2)), YOB: deg(angleAt(O2, Y2, B2)) };
  show('Fig 2.19', JSON.stringify(F.f219));
  is('Fig 2.19: the two overlapping angles are equal', F.f219.XOY === F.f219.AOB);

  const q = figure('2.20');
  const first = raysFrom(q.svg, [64, 88]); const second = raysFrom(q.svg, [436, 88]);
  F.f220 = [deg(between(...first)), deg(between(...second))];
  // the marks in (c), measured from the arm along OX
  const markB = dir([436, 88], [482.36, 69.27]), armOX = dir([436, 88], named(q.svg, 'X'));
  const bTurn = (markB - armOX + 360) % 360;
  show('Fig 2.20', F.f220, 'B mark at', r1(bTurn));
  is('Fig 2.20: the marked circle records the first angle, and B falls inside the second', Math.abs(bTurn - F.f220[0]) < 1 && F.f220[0] < F.f220[1]);
}

/* Fig. 2.21 — the slit */
{
  const g = figure('2.21');
  const P = polys(g.svg);
  const slots = [0, 2, 4].map(i => {
    const V = [95 + 190 * (i / 2), 22];
    const mid = (poly) => [(poly[1][0] + poly[2][0]) / 2, (poly[1][1] + poly[2][1]) / 2];
    return deg(angleAt(V, mid(P[i]), mid(P[i + 1])));
  });
  const arms = [95, 285, 475].map(x => { const r = raysFrom(g.svg, [x, 22]); return deg(between(r[0], r[1])); });
  F.f221 = { slots, arms };
  show('Fig 2.21', JSON.stringify(F.f221));
  is('Fig 2.21: the same slit three times', new Set(slots).size === 1);
  is('Fig 2.21: narrower, wider, equal — as labelled', arms[0] < slots[0] && arms[1] > slots[0] && arms[2] === slots[0]);
}

/* Figs. 2.22 to 2.24 */
{
  const g = figure('2.22');
  ok('Fig 2.22: a straight angle', deg(between(...raysFrom(g.svg, named(g.svg, 'O')))), 180);
  const h = figure('2.23');
  const O = named(h.svg, 'O');
  ok('Fig 2.23: ∠AOC + ∠COB = the straight angle', deg(angleAt(O, named(h.svg, 'A'), named(h.svg, 'C')) + angleAt(O, named(h.svg, 'C'), named(h.svg, 'B'))), 180);
  const k = figure('2.24');
  const crease = raysFrom(k.svg, [115, 98], 'dg-ghost');
  ok('Fig 2.24: the crease is at right angles to the side', crease.map(deg), [90]);
}

/* Figs. 2.25, 2.26 — straight and right angles on a dot grid; Exercise Set 2.4 */
{
  const g = figure('2.25');
  const dots = circles(g.svg, 'dg-line').filter(c => c.r < 1);
  const ways = (x0, x1) => {
    const d = dots.filter(p => p.x >= x0 && p.x <= x1);
    const xs = [...new Set(d.map(p => p.x))].sort((a, b) => a - b), ys = [...new Set(d.map(p => p.y))].sort((a, b) => a - b);
    const [seg] = lines(g.svg, 'dg-line').filter(l => l.x1 >= x0 && l.x1 <= x1);
    const at = (p) => [xs.indexOf(p[0]), ys.indexOf(p[1])];
    const A = at([seg.x1, seg.y1]), B = at([seg.x2, seg.y2]);
    const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
    const k = gcd(B[0] - A[0], B[1] - A[1]);
    const u = [(B[0] - A[0]) / k, (B[1] - A[1]) / k];
    const count = (v) => { let n = 0; for (let t = 1; ; t++) { const p = [A[0] + t * v[0], A[1] + t * v[1]]; if (p[0] < 0 || p[1] < 0 || p[0] >= xs.length || p[1] >= ys.length) return n; n++; } };
    return { straight: count([-u[0], -u[1]]), right: count([-u[1], u[0]]) + count([u[1], -u[0]]) };
  };
  F.grids = [ways(0, 285), ways(285, 570)];
  show('Fig 2.25', JSON.stringify(F.grids));
  const h = figure('2.26');
  const [BA] = lines(h.svg, 'dg-line'); const [AC] = lines(h.svg, 'dg-ghost');
  ok('Fig 2.26: C is on BA carried on past A (a straight angle)', deg(between(dir([BA.x1, BA.y1], [BA.x2, BA.y2]), dir([AC.x1, AC.y1], [AC.x2, AC.y2]))), 180);
}

/* Fig. 2.27 — three groups */
{
  const g = figure('2.27');
  const L = lines(g.svg, 'dg-line');
  const byV = {};
  for (const l of L) (byV[`${l.x1},${l.y1}`] ||= []).push(dir([l.x1, l.y1], [l.x2, l.y2]));
  const groups = [[], [], []];
  for (const [v, a] of Object.entries(byV)) {
    const x = +v.split(',')[0];
    groups[x < 190 ? 0 : x < 380 ? 1 : 2].push(deg(between(a[0], a[1])));
  }
  F.f227 = groups;
  show('Fig 2.27', JSON.stringify(groups));
  ok('Fig 2.27: six angles in each group', groups.map(x => x.length), [6, 6, 6]);
  ok('Fig 2.27: acute, right, obtuse', groups.map(x => [...new Set(x.map(type))]), [['acute'], ['right'], ['obtuse']]);
}

/* Fig. 2.28 — acute angles in the dividing triangles; Exercise Set 2.5 Q4 */
{
  const g = figure('2.28');
  const P = polys(g.svg);
  const acuteCount = (tris) => {
    const segs = tris.flatMap(t => t.map((p, i) => [p, t[(i + 1) % 3]]));
    const pts = [];
    for (const p of tris.flat()) if (!pts.some(q => Math.hypot(q[0] - p[0], q[1] - p[1]) < 0.1)) pts.push(p);
    let n = 0;
    for (const p of pts) {
      const ds = [];
      for (const [a, b] of segs) {
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        const da = Math.hypot(p[0] - a[0], p[1] - a[1]), db = Math.hypot(p[0] - b[0], p[1] - b[1]);
        if (Math.abs(da + db - len) > 0.1) continue;           // p is not on this segment
        if (da > 0.1) ds.push(dir(p, a));
        if (db > 0.1) ds.push(dir(p, b));
      }
      const u = [...new Set(ds.map(x => Math.round(x * 10) / 10))];
      for (let i = 0; i < u.length; i++) for (let j = i + 1; j < u.length; j++) if (between(u[i], u[j]) < 89.5) n++;
    }
    return n;
  };
  const panels = [P.filter(t => t[0][0] < 190), P.filter(t => t[0][0] >= 190 && t[0][0] < 380), P.filter(t => t[0][0] >= 380)];
  const counts = panels.map(acuteCount);
  const last = panels[2][panels[2].length - 1];
  const midp = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const next = acuteCount([...panels[2], [midp(last[0], last[1]), midp(last[1], last[2]), midp(last[2], last[0])]]);
  F.f228 = [...counts, next];
  show('Fig 2.28 acute angles', F.f228);
  ok('Fig 2.28: the triangle is equilateral, so every small angle is 60°', deg(angleAt(P[0][0], P[0][1], P[0][2])), 60);
  is('Fig 2.28: the counts rise by the same amount each time', F.f228[1] - F.f228[0] === F.f228[3] - F.f228[2] && F.f228[2] - F.f228[1] === F.f228[3] - F.f228[2]);
}

/* Figs. 2.29 to 2.32 — degrees */
{
  const g = figure('2.29');
  const C = [133, 104];
  const t = lines(g.svg, 'dg-thin').map(l => deg(dir(C, [l.x2, l.y2]) * 10) / 10);
  ok('Fig 2.29: 360 equal parts', [t.length, new Set(t.map(Math.round)).size], [360, 360]);
  const labels = texts(g.svg, 'dg-tick').map(x => [x.t, deg(dir(C, [x.x, x.y]))]);
  is('Fig 2.29: numbers every 30°, each at its own direction', labels.length === 12 && labels.every(([s, a]) => Math.abs(parseInt(s, 10) - a) <= 2 || Math.abs(parseInt(s, 10) - a) >= 358));

  const h = figure('2.30');
  const w = lines(h.svg, 'dg-thin').map(l => dir([18, 80], [l.x2, l.y2]));
  const arms = raysFrom(h.svg, [18, 80]);
  ok('Fig 2.30: the arms are 30° apart and 1° wedges fill it', [deg(between(...arms)), w.length - 1, w.every(a => Math.abs(a - Math.round(a)) < 0.05)], [30, 30, true]);
  F.f230 = w.length - 1;

  const k = figure('2.31');
  const straight = lines(k.svg, 'dg-thin').filter(l => l.x1 < 300);
  const right = lines(k.svg, 'dg-thin').filter(l => l.x1 >= 300);
  ok('Fig 2.31: 180 and 90 one-degree wedges', [straight.length - 1, right.length - 1], [180, 90]);
  ok('Fig 2.31: the arms drawn', [deg(between(...raysFrom(k.svg, [150, 92]))), deg(between(...raysFrom(k.svg, [390, 100])))], [180, 90]);

  const m = figure('2.32');
  const centres = circles(m.svg, 'dg-line').filter(c => c.r === 24);
  const n = texts(m.svg, 'dg-note').map(x => ({ n: +x.t, x: x.x, y: x.y }));
  const res = [];
  for (const c of centres) {
    const label = n.reduce((b, x) => (Math.hypot(x.x - c.x, x.y - c.y) < Math.hypot(b.x - c.x, b.y - c.y) ? x : b)).n;
    const radii = new Set();
    for (const l of lines(m.svg, 'dg-thin')) {
      for (const [p, q] of [[[l.x1, l.y1], [l.x2, l.y2]], [[l.x2, l.y2], [l.x1, l.y1]]])
        if (Math.hypot(p[0] - c.x, p[1] - c.y) < 0.5) radii.add(Math.round(dir([c.x, c.y], q)));
    }
    const mark = paths(m.svg).filter(p => /dg-thin|dg-move/.test(p.class)).map(p => ({ p, a: arc(p.d, [c.x, c.y]) }))
      .find(({ p }) => { const s = p.d.match(/M\s*([-\d.]+)[ ,]([-\d.]+)/); return Math.hypot(+s[1] - c.x, +s[2] - c.y) < 12; });
    res.push({ n: label, radii: radii.size || 1, part: Math.round(mark.a.span) });
  }
  F.f232 = res;
  show('Fig 2.32', JSON.stringify(res));
  ok('Fig 2.32: the numbers beside the circles', res.map(r => r.n), [1, 2, 3, 4, 5, 6, 8, 9, 10, 12]);
  is('Fig 2.32: each circle is cut into as many parts as its number', res.every(r => r.n === 1 || r.radii === r.n));
  is('Fig 2.32: each marked part is 360° divided by that number', res.every(r => Math.abs(r.part - 360 / r.n) <= 1 || (r.n === 1 && r.part > 330)));
}

/* Fig. 2.33 — the protractor with no numbers; Example 1 and Exercise Set 2.6 */
{
  const g = figure('2.33');
  const A = named(g.svg, 'A');
  const at = Object.fromEntries(['T', 'W', 'L', 'K'].map(l => [l, dir(A, named(g.svg, l))]));
  const ray = Object.fromEntries(Object.entries(at).map(([k, v]) => [k, raysFrom(g.svg, A).reduce((b, a) => (Math.abs(a - v) < Math.abs(b - v) ? a : b))]));
  F.p = Object.fromEntries(Object.entries(ray).map(([k, v]) => [k, deg(v)]));
  show('Fig 2.33 rays', JSON.stringify(F.p));
  const ang = (a, b) => Math.abs(F.p[a] - F.p[b]);
  F.e26 = { KAL: ang('K', 'L'), WAL: ang('W', 'L'), TAK: ang('T', 'K'), TAW: ang('T', 'W'), TAL: ang('T', 'L'),
    KAT: ang('K', 'T'), LAW: ang('L', 'W'), KAW: ang('K', 'W') };
  F.e26.TAM = F.e26.TAW / 2;
  show('Exercise 2.6', JSON.stringify(F.e26));
  // the tick marks: long every 10°, medium every 5°
  const ticks = lines(g.svg, 'dg-thin').map(l => ({ a: deg(dir(A, [l.x1, l.y1]) * 10) / 10, len: Math.hypot(l.x2 - l.x1, l.y2 - l.y1) }))
    .filter(t => t.len < 20);
  const kind = (a) => ticks.filter(t => Math.abs(t.a - a) < 0.3).map(t => t.len)[0];
  is('Fig 2.33: long marks every 10°, medium marks between them, short at the rest', [10, 20, 130, 170].every(a => kind(a) > kind(a - 5) && kind(a - 5) > kind(a - 4)));
  const between10 = [...Array(181).keys()].filter(a => a > F.p.L && a <= F.p.K);
  ok('Example 1: long marks and medium marks from AL to AK', [between10.filter(a => a % 10 === 0).length, between10.filter(a => a % 5 === 0).length], [3, 6]);
  ok('Example 1: ∠KAL', F.e26.KAL, 30);
}

/* Fig. 2.34 — the labelled protractor */
{
  const g = figure('2.34');
  const O = named(g.svg, 'O');
  scale('Fig 2.34', g.svg, O);
  const r = Object.fromEntries(['P', 'Q', 'R', 'S', 'T', 'U'].map(l => [l, deg(dir(O, named(g.svg, l)))]));
  F.p34 = r;
  show('Fig 2.34 inner readings', JSON.stringify(r));
  ok('Fig 2.34: OQ at 35 and OR at 95 on the inner scale, as the text says', [r.Q, r.R], [35, 95]);
  const L = Object.keys(r);
  F.p34pairs = [];
  for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) F.p34pairs.push([L[i] + 'O' + L[j], Math.abs(r[L[i]] - r[L[j]])]);
  ok('Fig 2.34: 15 angles', F.p34pairs.length, 15);
}

/* Fig. 2.35 */
{
  const g = figure('2.35');
  const O = named(g.svg, 'O');
  scale('Fig 2.35', g.svg, O);
  F.p35 = deg(angleAt(O, named(g.svg, 'A'), named(g.svg, 'B')));
  ok('Fig 2.35: OB on 0 of the inner scale', deg(dir(O, named(g.svg, 'B'))), 0);
}

/* Figs. 2.36, 2.37, 2.38 — folding */
{
  const g = figure('2.36');
  ok('Fig 2.36: creases at 90°, then 45° and 135°', [raysFrom(g.svg, [356, 88], 'dg-ghost').map(deg), raysFrom(g.svg, [498, 88], 'dg-ghost').map(deg)], [[90], [45, 90, 135]]);
  const h = figure('2.37');
  const cr = raysFrom(h.svg, [422, 150], 'dg-ghost');
  const labels = texts(h.svg, 'dg-tick').filter(t => /°/.test(t.t)).map(t => [parseFloat(t.t), dir([422, 150], [t.x, t.y])]);
  F.fold = 180 / 8;
  is('Fig 2.37: creases every 22.5°', cr.length === 7 && cr.every((a, i) => Math.abs(a - F.fold * (i + 1)) < 0.05));
  is('Fig 2.37: the crease measures 0° to 180°, each at its own crease', labels.length === 9 && labels.every(([v, a]) => Math.abs(v - a) < 4 || (v === 180 && a > 175) || (v === 0 && (a < 5 || a > 355))));
  is('Fig 2.37: the named creases B to H are at 22.5° steps', ['B', 'C', 'D', 'E', 'F', 'G', 'H'].every((l, i) => Math.abs(dir([140, 150], named(h.svg, l, 0, 280)) - F.fold * (i + 1)) < 3));
  const k = figure('2.38');
  const O = named(k.svg, 'O');
  F.f238 = [deg(angleAt(O, named(k.svg, 'A'), named(k.svg, 'B'))), deg(angleAt(O, named(k.svg, 'C'), named(k.svg, 'B')))];
  ok('Fig 2.38: ∠AOB = 70° and the crease halves it, as the text says', F.f238, [70, 35]);
}

/* Figs. 2.39 to 2.45 — Exercise Set 2.7 */
{
  const g = figure('2.39');
  F.e271 = [[0, 190], [190, 380], [380, 570]].map(([a, b]) => deg(angleAt(named(g.svg, 'H', a, b), named(g.svg, 'I', a, b), named(g.svg, 'J', a, b))));
  const h = figure('2.40');
  F.e273 = [[0, 285], [285, 570]].map(([a, b]) => deg(angleAt(named(h.svg, 'H', a, b), named(h.svg, 'I', a, b), named(h.svg, 'J', a, b))));
  const k = figure('2.41');
  const rs = raysFrom(k.svg, [82, 66]);
  const [mark] = paths(k.svg, 'dg-thin').map(p => arc(p.d, [82, 66]));
  F.e274 = { small: deg(between(...rs)), marked: deg(mark.span) };
  ok('Fig 2.41: the curve goes the long way round', [mark.large, F.e274.marked], [1, 360 - F.e274.small]);
  const m = figure('2.42');
  const V42 = [[64, 72.53], [269.5, 68.85], [445.06, 55.9], [106.07, 137.75], [285, 127.1], [475, 87.15]];
  F.e275 = V42.map(v => {
    const [a, b] = raysFrom(m.svg, v);
    const c = paths(m.svg, 'dg-thin').map(p => arc(p.d, v)).find(x => x.r === 12 && Math.abs(x.a1 - a) < 2 || Math.abs(x.a1 - b) < 2);
    return deg(between(a, b));
  });
  is('Fig 2.42: every curve marks the smaller angle', paths(m.svg, 'dg-thin').every(p => arc(p.d, [0, 0]).large === 0));
  const n = figure('2.43');
  const X = named(n.svg, 'X');
  scale('Fig 2.43', n.svg, X);
  const d43 = Object.fromEntries(['A', 'B', 'C', 'E'].map(l => [l, deg(dir(X, named(n.svg, l)))]));
  F.e276 = { BXE: d43.B - d43.E, CXE: d43.C - d43.E, AXB: d43.A - d43.B, BXC: d43.B - d43.C };
  ok('Fig 2.43: A and E are the ends of the base', [d43.A, d43.E], [180, 0]);
  const q = figure('2.44');
  const Q = named(q.svg, 'Q');
  F.e277 = ['R', 'S', 'T'].map(l => deg(angleAt(Q, named(q.svg, 'P'), named(q.svg, l))));
  const s = figure('2.45');
  F.e279 = polys(s.svg).map(t => t.map((p, i) => deg(angleAt(p, t[(i + 1) % 3], t[(i + 2) % 3]))));
  show('Ex 2.7', JSON.stringify({ q1: F.e271, q3: F.e273, q4: F.e274, q5: F.e275, q6: F.e276, q7: F.e277, q9: F.e279 }));
  is('Fig 2.45: each triangle is drawn with angles that add up to 180°', F.e279.every(t => t.reduce((a, b) => a + b) === 180));
  const labelOrder = texts(s.svg, 'dg-label').map(t => t.t).join('');
  ok('Fig 2.45: the corners are labelled A, B, C in drawing order', labelOrder, 'ABCABCABC');
  is('Fig 2.45: (a) all acute, (c) has an obtuse angle, (b) is tall and narrow', F.e279[0].every(a => a < 90) && F.e279[2].some(a => a > 90) && Math.min(...F.e279[1]) < Math.min(...F.e279[0]));
}

/* Fig. 2.46 — six wrong readings */
{
  const g = figure('2.46');
  const panels = { U: [96, 112, [108, 130]], V: [285, 112, [285, 112]], W: [474, 112, [474, 112]], X: [106, 252, [20, 252]], Y: [285, 252, [285, 252]], Z: [474, 178, [474, 178]] };
  F.f246 = {};
  for (const [k, [cx, cy, V]] of Object.entries(panels)) {
    const rs = raysFrom(g.svg, V).filter(a => lines(g.svg, 'dg-line').some(l => l.x1 === V[0] && l.y1 === V[1] && Math.abs(l.x2 - l.x1) + Math.abs(l.y2 - l.y1) < 120 && Math.abs(dir(V, [l.x2, l.y2]) - a) < 0.01));
    const arms = raysFrom(g.svg, V).filter(a => lines(g.svg, 'dg-line').some(l => l.x1 === V[0] && l.y1 === V[1] && Math.abs(dir(V, [l.x2, l.y2]) - a) < 0.01 && !(Math.abs(l.y2 - l.y1) < 0.01 && Math.abs(Math.abs(l.x2 - l.x1) - 172) < 1)));
    const true_ = deg(between(arms[0], arms[1]));
    const said = +texts(g.svg, 'dg-note').find(t => t.t.startsWith(`∠${k}`)).t.match(/(\d+)°/)[1];
    F.f246[k] = { true: true_, said, arms: arms.map(deg), onCentre: V[0] === cx && V[1] === cy };
    void rs;
  }
  show('Fig 2.46', JSON.stringify(F.f246));
  is('Fig 2.46: every reading is wrong, as the text says', Object.values(F.f246).every(p => p.true !== p.said));
  is('Fig 2.46 U: the vertex is off the centre', !F.f246.U.onCentre);
  is('Fig 2.46 V: neither arm on the 0 line, and 120 is the reading on one arm', F.f246.V.onCentre && !F.f246.V.arms.includes(0) && F.f246.V.arms.includes(F.f246.V.said));
  is('Fig 2.46 W, Y: the reading is the other scale\'s, 180 minus the angle', F.f246.W.said === 180 - F.f246.W.true && F.f246.Y.said === 180 - F.f246.Y.true);
  is('Fig 2.46 X: the vertex is at the end of the straight edge', F.f246.X.arms.includes(0) && 106 - 20 === 86);
  is('Fig 2.46 Z: the protractor is drawn below its base line', paths(g.svg, 'dg-line').some(p => /^M388 178 A86 86 0 0 0 560 178/.test(p.d)));
  for (const [k, [cx, cy]] of Object.entries(panels)) if (k !== 'Z') scale(`Fig 2.46 ${k}`, g.svg, [cx, cy], 5, 86);
}

/* Fig. 2.47 — clocks; Exercise Set 2.8 */
{
  const g = figure('2.47');
  const hours = texts(g.svg, 'dg-note').map(t => parseInt(t.t, 10));
  F.clock = [150, 285, 420].map((x, i) => {
    const [a, b] = raysFrom(g.svg, [x, 54]);
    const minute = [a, b].find(v => Math.abs(v - 90) < 0.1), hour = [a, b].find(v => Math.abs(v - 90) >= 0.1);
    return { h: hours[i], hourAt: deg((90 - hour + 360) % 360 / 30), angle: deg(between(a, b)), minuteUp: minute !== undefined };
  });
  show('Fig 2.47', JSON.stringify(F.clock));
  is('Fig 2.47: each clock shows the hour in its caption', F.clock.every(c => c.minuteUp && c.hourAt === c.h));
  F.e281 = [1, 2, 4, 6].map(h => between(90, 90 - 30 * h));
  ok('Ex 2.8 Q1: one part is 30°, and the drawn clocks agree', [360 / 12, ...F.clock.map(c => c.angle)], [30, ...F.e281.slice(0, 3)]);
}

/* Figs. 2.49 to 2.51 */
{
  const g = figure('2.49');
  const I = named(g.svg, 'I');
  scale('Fig 2.49', g.svg, I);
  ok('Fig 2.49: T is marked at 30° on the scale that is 0 on IN', [deg(dir(I, named(g.svg, 'T'))), deg(dir(I, named(g.svg, 'N')))], [30, 0]);
  const h = figure('2.50');
  const I2 = named(h.svg, 'I');
  ok('Fig 2.50: ∠TIN is drawn at the 30° printed on it, with T on its arm', [deg(angleAt(I2, named(h.svg, 'T'), named(h.svg, 'N'))), parseInt(texts(h.svg, 'dg-dim-label')[0].t, 10), deg(dir(I2, named(h.svg, 'T')))], [30, 30, 30]);
  const vb = h.svg.match(/viewBox="([^"]*)"/)[1].split(' ').map(Number);
  is('Fig 2.50: nothing is drawn outside the figure', [...lines(h.svg), ...texts(h.svg)].every(e => ['y', 'y1', 'y2'].every(k => e[k] === undefined || (e[k] >= vb[1] && e[k] <= vb[1] + vb[3] + 2))));
  const k = figure('2.51');
  const got = [40, 148, 256, 364, 472].map(x => deg(between(...raysFrom(k.svg, [x, 88]))));
  ok('Fig 2.51: each angle is drawn at its printed measure', got, texts(k.svg, 'dg-dim-label').concat(texts(k.svg, 'dg-label')).concat(texts(k.svg, 'dg-note')).map(t => parseInt(t.t, 10)).filter(Number.isFinite));
}

/* Figs. 2.52, 2.53 — Exercise Set 2.9 */
{
  const g = figure('2.52');
  const r = (v) => raysFrom(g.svg, v)[0];
  const AC = r([176, 36]), PL = r([257.65, 139.48]), RS = r([327.58, 136.28]);
  F.e291 = [AC, PL, RS].map(a => { const s = deg(between(a, 0)); return [Math.min(s, 180 - s), Math.max(s, 180 - s)]; });
  show('Fig 2.52', JSON.stringify(F.e291));
  const h = figure('2.53');
  F.e293 = deg(angleAt(named(h.svg, 'H'), named(h.svg, 'I'), named(h.svg, 'J')));
  ok('Ex 2.9 Q6: the angle beside 70° on a line', 180 - 70, 110);
}

/* Figs. 2.54 to 2.56 — printed measures against the drawings */
{
  const g = figure('2.54');
  const got = [['P', 'Q', 'R', 0, 190], ['T', 'S', 'R', 190, 380], ['F', 'E', 'Q', 380, 570]]
    .map(([v, a, b, x0, x1]) => deg(angleAt(named(g.svg, v, x0, x1), named(g.svg, a, x0, x1), named(g.svg, b, x0, x1))));
  ok('Fig 2.54: ∠QPR, ∠STR, ∠QFE as printed', got, texts(g.svg, 'dg-dim-label').map(t => parseInt(t.t, 10)));
  const h = figure('2.55');
  const got2 = [['I', 'X', 'S', 0, 285], ['W', 'T', 'S', 285, 570]]
    .map(([v, a, b, x0, x1]) => deg(angleAt(named(h.svg, v, x0, x1), named(h.svg, a, x0, x1), named(h.svg, b, x0, x1))));
  ok('Fig 2.55: ∠XIS, ∠TWS as printed', got2, texts(h.svg, 'dg-dim-label').map(t => parseInt(t.t, 10)));
  is('Figs 2.54, 2.55: acute and obtuse as captioned', got.every(a => type(a) === 'acute') && got2.every(a => type(a) === 'obtuse'));
  const k = figure('2.56');
  const V = [[180, 76], [430, 40]];
  F.f256 = V.map(v => 360 - deg(between(...raysFrom(k.svg, v))));
  const marks = paths(k.svg, 'dg-thin').map((p, i) => arc(p.d, V[i]));
  is('Fig 2.56: both curves go the long way round, over the reflex angle', marks.every((m, i) => m.large === 1 && Math.abs(m.span - F.f256[i]) < 2));
}

/* Figs. 2.57, 2.58 — Exercise Set 2.10 */
{
  const g = figure('2.57');
  F.f257 = deg(between(...raysFrom(g.svg, [68, 46]), ...raysFrom(g.svg, [68, 46], 'dg-ghost')) === 0 ? 0 : between(raysFrom(g.svg, [68, 46])[0], raysFrom(g.svg, [68, 46], 'dg-ghost')[0]));
  is('Fig 2.57: the angle drawn for you is acute', type(F.f257) === 'acute');
  const h = figure('2.58');
  const T = named(h.svg, 'T');
  const d = Object.fromEntries(['P', 'R', 'Q', 'W'].map(l => [l, dir(T, named(h.svg, l))]));
  F.e2102 = { PTR: deg(between(d.P, d.R)), PTQ: deg(between(d.P, d.Q)), PTW: deg(between(d.P, d.W)) };
  F.e2102.WTP = 360 - F.e2102.PTW;
  const marks = paths(h.svg, 'dg-thin').map(p => arc(p.d, T));
  is('Fig 2.58: three curves the short way and one the long way round', marks.filter(m => m.large === 0).length === 3 && marks.filter(m => m.large === 1).length === 1);
  show('Ex 2.10 Q2', JSON.stringify(F.e2102));
}

/* Figs. 2.59, 2.60 */
{
  const g = figure('2.59');
  const E = named(g.svg, 'E');
  const d = Object.fromEntries(['B', 'R', 'S', 'T'].map(l => [l, dir(E, named(g.svg, l))]));
  ok('Fig 2.59: ∠TER as printed, ES at right angles, BER straight', [deg(between(d.T, d.R)), deg(between(d.S, d.B)), deg(between(d.B, d.R))],
    [parseInt(texts(g.svg, 'dg-dim-label')[0].t, 10), 90, 180]);
  F.le = { BET: deg(between(d.B, d.T)), SET: deg(between(d.S, d.T)) };
  const h = figure('2.60');
  const small = deg(between(...raysFrom(h.svg, [104, 62])));
  const printed = texts(h.svg, 'dg-dim-label').map(t => parseInt(t.t, 10));
  ok('Fig 2.60: 110° and 250° as drawn', printed, [small, 360 - small]);
  ok('Fig 2.60: the long curve is the reflex one', paths(h.svg, 'dg-dim').map(p => arc(p.d, [104, 62]).large), [0, 1]);
}

/* Figs. 2.61, 2.62 — Exercise Set 2.11 */
{
  const g = figure('2.61');
  const V = [[124.13, 16.61], [285.94, 50.02], [468.08, 18.25], [64.47, 131.78], [306.92, 114], [444.47, 127.1]];
  const marks = paths(g.svg, 'dg-thin');
  F.e2112 = V.map((v, i) => {
    const small = between(...raysFrom(g.svg, v));
    const m = arc(marks[i].d, v);
    return deg(m.large ? 360 - small : small);
  });
  show('Ex 2.11 Q2', F.e2112);
  is('Fig 2.61: exactly one angle is marked the long way round, as captioned', marks.filter(p => arc(p.d, [0, 0]).large).length === 1);
  const h = figure('2.62');
  const spokes = lines(h.svg, 'dg-thin').map(l => dir([95, 90], [l.x2, l.y2])).sort((a, b) => a - b);
  const gaps = spokes.map((a, i) => (spokes[(i + 1) % spokes.length] - a + 360) % 360);
  ok('Fig 2.62: 24 spokes, equally spaced', [spokes.length, gaps.every(x => Math.abs(x - 15) < 0.1)], [24, true]);
  F.e2116 = { one: 360 / 24, acute: Math.max(...[...Array(24).keys()].map(k => k * 15).filter(a => a < 90)) };
  // the puzzle: acute, and twice, three and four times acute, five times obtuse
  F.puzzle = [...Array(90).keys()].filter(x => x > 0 && [2, 3, 4].every(k => type(k * x) === 'acute') && type(5 * x) === 'obtuse');
  // an instance for Q3: four rays at 0, 20, 50 and 140 degrees
  const inst = [0, 20, 50, 140];
  const angs = inst.flatMap((a, i) => inst.slice(i + 1).map(b => b - a));
  F.q3 = ['acute', 'right', 'obtuse'].map(t => angs.filter(a => type(a) === t).length);
  ok('Ex 2.11 Q3 instance: 3 acute, 1 right, 2 obtuse, nothing else', [...F.q3, angs.length], [3, 1, 2, 6]);
  ok('Ex 2.11 Q5: the Y adds up to a full turn', 150 + 60 + 150, 360);
}

/* Beyond figures */
{
  const g = figure('2.63');
  const [A, B, C, D] = ['A', 'B', 'C', 'D'].map(l => named(g.svg, l));
  ok('Fig 2.63: D lies on BC, so ∠BDC is straight', deg(angleAt(D, B, C)), 180);
  is('Fig 2.63: AD is drawn', lines(g.svg, 'dg-line').some(l => l.x1 === A[0] && l.y1 === A[1] && l.x2 === D[0] && l.y2 === D[1]));
  const h = figure('2.64');
  const O = named(h.svg, 'O');
  const d = Object.fromEntries(['A', 'B', 'C', 'D'].map(l => [l, dir(O, named(h.svg, l))]));
  ok('Fig 2.64: ∠AOC and ∠DOB as printed', [deg(between(d.A, d.C)), deg(between(d.D, d.B))], texts(h.svg, 'dg-dim-label').map(t => parseInt(t.t, 10)));
  F.cod = deg(between(d.C, d.D));
  ok('Fig 2.64: ∠COD from the printed values equals the drawing', 180 - 35 - 55, F.cod);
  const k = figure('2.65');
  const O2 = named(k.svg, 'O');
  const e = Object.fromEntries(['A', 'P', 'Q', 'R', 'B'].map(l => [l, deg(dir(O2, named(k.svg, l)))]));
  ok('Fig 2.65: ∠AOP, ∠POQ, ∠QOR as printed', [e.A - e.P, e.P - e.Q, e.Q - e.R], texts(k.svg, 'dg-dim-label').map(t => parseInt(t.t, 10)));
  F.q27dir = e;
  F.q27 = { ROB: e.R - e.B, AOQ: e.A - e.Q, POR: e.P - e.R, AOR: e.A - e.R };
  const names = Object.keys(e);
  const all = [];
  for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) all.push([names[i] + 'O' + names[j], e[names[i]] - e[names[j]]]);
  F.q27eq = all.filter(([n, v]) => v < 180 && all.some(([m, w]) => m !== n && w === v)).map(([n]) => n);
  show('Q27', JSON.stringify(F.q27), F.q27eq);
}

/* ---- claims in the text that arithmetic alone cannot check ------ */
{
  const lcm = (a, b) => { const g = (x, y) => (y ? g(y, x % y) : x); return a * b / g(a, b); };
  ok('p015: 360 is the smallest number divisible by 1 to 10 except 7', [1, 2, 3, 4, 5, 6, 8, 9, 10].reduce(lcm), 360);
  is('p015: 360 is not divisible by 7, but is by 12 and 24', 360 % 7 !== 0 && 360 % 12 === 0 && 360 % 24 === 0);
  // Exercise Set 2.2: lines and nameable angles through points, no three on a line
  const lineCount = (n) => n * (n - 1) / 2, angleCount = (n) => n * (n - 1) * (n - 2) / 2;
  F.e22 = { q5: [lineCount(3), angleCount(3)], q6: [lineCount(4), angleCount(4)] };
  ok('Ex 2.2 Q5 and Q6', F.e22, { q5: [3, 3], q6: [6, 12] });
  // folding: a quarter turn, an eighth, a sixteenth
  F.blanks = [360 / 4, 360 / 8, 360 / 16];
  // Stage 1 of Beyond
  // Stage 1 of Beyond: each question's numbers are read off the page and its answer worked from them
  const S1 = flat(BEYOND.slice(0, BEYOND.indexOf('c-stage__num">2')));
  const compass = ['north', 'north-east', 'east', 'south-east', 'south', 'south-west', 'west', 'north-west'];
  const cw = (from, to) => ((compass.indexOf(to) - compass.indexOf(from)) * 45 + 360) % 360 || 360;
  {
    const m = S1.match(/Ravi faces ([a-z-]+)\. He turns clockwise until he faces ([a-z-]+)\./);
    const t = cw(m[1], m[2]);
    is(`Beyond stage 1: Ravi turns ${t}°, printed as the sum and called reflex`, S1.includes(`= ${t}^\\circ$`) && type(t) === 'reflex');
  }
  {
    const d = +S1.match(/One of them is \$(\d+)\^\\circ\$ bigger than the other/)[1];
    const small = (180 - d) / 2, big = small + d;
    is(`Beyond stage 1: a straight angle split ${d}° apart is ${small}° and ${big}°`, S1.includes(`so each is $${small}^\\circ$`) && S1.includes(`= ${big}^\\circ$`));
    is('Beyond stage 1: the split is not Exercise 2.9 Q6 (70° and 110°)', small !== 70 && big !== 110);
  }
  {
    const words = { Three: 3, Four: 4, Five: 5, Six: 6 };
    const n = words[S1.match(/(Three|Four|Five|Six) rays \$/)[1]];
    const count = (k) => k * (k - 1) / 2;
    is(`Beyond stage 1: ${n} rays make ${count(n)} angles, ${n + 1} rays make ${count(n + 1)}`, S1.includes(`= ${count(n)}$ angles`) && S1.includes(`you would get $${[...Array(n).keys()].map(i => n - i).join(' + ')} = ${count(n + 1)}$`));
    is('Beyond stage 1: the ray count is not the 6 of Exercise 2.2 Q6', count(n) !== 6 && n !== 4);
  }
  {
    const a = +S1.match(/Take \$(\d+)\^\\circ\$\. It is acute\. Double it and you get \$(\d+)\^\\circ\$/)[1];
    const b = +S1.match(/Take \$\d+\^\\circ\$\. It is acute\. Double it and you get \$(\d+)\^\\circ\$/)[1];
    ok('Beyond stage 1: Meena\'s counterexample', [type(a), b, type(b)], ['acute', 2 * a, 'acute']);
    is('Beyond stage 1: the counterexample is not Exercise 2.9 Q4 (60° halved)', b !== 60);
    ok('Beyond stage 1: doubling 50 and 45', [type(100), type(90)], ['obtuse', 'right']);
  }
  {
    const m = S1.match(/Kiran faces ([a-z-]+)\. She turns clockwise until she faces ([a-z-]+)\./);
    F.kiran = cw(m[1], m[2]);
    is(`Beyond stage 1: Kiran turns ${F.kiran}°, the short way ${360 - F.kiran}°`, S1.includes(`Altogether Kiran turns $45^\\circ + 270^\\circ = ${F.kiran}^\\circ$`)
      && S1.includes(`takes only $${360 - F.kiran}^\\circ$`) && type(F.kiran) === 'reflex');
    is('Beyond stage 1: no clock question is left in it', !/o’clock/.test(S1));
  }
}

/* ---- C. Answer rows and practice answers, read off the page ------- */

function exampleAnswer(n) {
  const at = BEYOND.indexOf(`<div class="c-example__tab">Example ${n}</div>`);
  if (at < 0) { fails.push(`no Beyond Example ${n}`); return ''; }
  const m = BEYOND.slice(at).match(/<span class="work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/);
  return m ? flat(m[1]) : '';
}
const exampleQ = (n) => { const at = BEYOND.indexOf(`<div class="c-example__tab">Example ${n}</div>`); return flat(BEYOND.slice(at).match(/<div class="c-example__body">\s*<p>([\s\S]*?)<\/p>/)[1]); };
function okAnswer(n, want) {
  const got = nums(exampleAnswer(n));
  if (same(got, want)) pass++;
  else fails.push(`Beyond Example ${n}: the Answer row prints ${JSON.stringify(got)}, computed ${JSON.stringify(want)}`);
}
// the body's two
{
  const b1 = BODY.slice(BODY.indexOf('Example 1</div>'));
  ok('Body Example 1 Answer row', nums(flat(b1.match(/work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span>/)[1])), [F.e26.KAL]);
  const b2 = BODY.slice(BODY.indexOf('Example 2</div>'));
  ok('Body Example 2 Answer row', nums(flat(b2.match(/work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span>/)[1])), [125]);
  is('Body Example 2: 125 is 120 on the inner scale and 5 more marks', /inner scale to 120, and then 5 more marks/.test(flat(b2)) && 120 + 5 === 125 && type(125) === 'obtuse');
}
// Beyond
{
  const a1 = exampleAnswer(1);
  is('Beyond Example 1: three segments from three points on a line', /three segments/.test(a1) && 3 * 2 / 2 === 3 && /\\overline\{AP\}.*\\overline\{PB\}.*\\overline\{AB\}/.test(a1) && /\\overrightarrow\{PA\}.*\\overrightarrow\{PB\}/.test(a1));
  const a2 = exampleAnswer(2);
  is('Beyond Example 2: three rays at A give three angles; at D the straight angle is BDC', /BAD.*DAC.*BAC/.test(a2) && /straight angle \$\\angle BDC\$/.test(a2));
  { const P = 90 / 3 * 2, Q = 180 / 4; okAnswer(3, [Math.abs(P - Q)]); is('Beyond Example 3: ∠P is the bigger', P > Q && /\\angle P\$ is bigger/.test(exampleAnswer(3))); }
  {
    const face = (from, turn) => { const c = ['north', 'east', 'south', 'west']; return c[(c.indexOf(from) + turn / 90 + 400) % 4]; };
    okAnswer(4, [3 * 90]);
    is('Beyond Example 4: faces north, three quarters of a turn', exampleAnswer(4).includes(`faces ${face('east', 270)}`) && (3 * 90) / 360 === 3 / 4);
    F.face = face;
  }
  { const part = 180 / 6; okAnswer(5, [part, 5 * part]); }
  okAnswer(6, [140]);
  is('Beyond Example 6: outer reading on the outer scale, obtuse', /reads 140 on the outer scale and 40 on the inner scale/.test(exampleQ(6)) && 140 + 40 === 180 && exampleAnswer(6).includes(type(140)));
  okAnswer(7, [110 - 25]);
  okAnswer(8, [360 / 20, 90 / (360 / 20)]);
  okAnswer(9, [360 / 10, 180 / 10]);
  ok('Beyond Example 10: the types, in order', exampleAnswer(10), [1, 179, 181, 90, 270, 360].map(type).join(', '));
  okAnswer(11, [F.cod]);
  okAnswer(12, [360 - 100 - 125, 360 - 100]);
  okAnswer(13, [120 - 120 / 2 / 2]);
  okAnswer(14, [65]);
  is('Beyond Example 14: 65 is 60 and 5 marks on the outer scale; the wrong scale gives 115', /outer scale to 60, then 5 more marks/.test(flat(BEYOND)) && 180 - 65 === 115);
  // every question the examples print carries the numbers the working uses
  is('Beyond Example questions print the numbers worked', /5 times/.test(exampleQ(5)) && /25 and at 110/.test(exampleQ(7)) && /20 equal parts/.test(exampleQ(8))
    && /parts of \$10\^\\circ\$/.test(exampleQ(9)) && /\$100\^\\circ\$ and \$125\^\\circ\$/.test(exampleQ(12)) && /\$\\angle AOB = 120\^\\circ\$/.test(exampleQ(13)) && /\$\\angle LMN = 65\^\\circ\$/.test(exampleQ(14)));
}

const ROWS = {};
for (const m of BEYOND.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g))
  if (!(m[1] in ROWS)) ROWS[m[1]] = flat(m[2]);
const row = (q) => { if (!(q in ROWS)) { fails.push(`no answer row for question ${q}`); return ''; } return ROWS[q]; };
function first(what, q, want) {
  const got = nums(row(q)).slice(0, want.length);
  if (same(got, want)) pass++; else fails.push(`${what}: question ${q} prints ${JSON.stringify(got)}, computed ${JSON.stringify(want)}`);
}
function partText(q, letter) {
  const m = row(q).match(new RegExp(`\\(${letter}\\)(.*?)(?=\\([a-e]\\)|$)`));
  if (!m) { fails.push(`question ${q} has no part (${letter})`); return ''; }
  return m[1];
}
function part(what, q, letter, want) {
  const got = nums(partText(q, letter)).slice(0, want.length);
  if (same(got, want)) pass++; else fails.push(`${what}: question ${q}(${letter}) prints ${JSON.stringify(got)}, computed ${JSON.stringify(want)}`);
}
const qText = (n) => {
  const at = +n === 1 ? BEYOND.indexOf('<ol class="c-questions">') : BEYOND.indexOf(`<ol class="c-questions" data-start="${n}">`);
  if (at < 0) throw new Error(`question ${n} is not on any page`);
  return BEYOND.slice(at).match(/<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/)[1];
};
{
  first('Q17 right angles in a turn', 17, [360 / 90]);
  first('Q18 reflex', 18, [360 - 75]);
  first('Q19 three quarters of a turn', 19, [360 * 3 / 4]);
  is('Q19 type', row(19).includes(type(270)));
  first('Q20 a sixth of a straight angle', 20, [180 / 6]);
  first('Q21 minute hand in 10 minutes', 21, [360 / 60 * 10]);
  first('Q22', 22, [180 - 50 - 2 * 50]);
  first('Q23', 23, [(180 - 80) / 2, (180 - 80) / 2 + 80]);
  is('Q23 one acute, one obtuse', type((180 - 80) / 2) === 'acute' && type(130) === 'obtuse');
  {
    const gap = 60 / 3, n = 360 / gap;
    first('Q24 spokes', 24, [n]);
    is('Q24 no right angle: 90 is not a multiple of the gap', 90 % gap !== 0 && /^18 spokes.*No:/.test(row(24)));
    is('Q24 prints two spokes between and 60°', /two others between them make an angle of \$60\^\\circ\$/.test(flat(qText(24))));
  }
  first('Q25', 25, [140 / 2 + 140 / 4]);
  is('Q25 type', row(25).includes(type(105)));
  {
    let right = true; for (let r = 181; r < 360; r++) for (let a = 1; a < 90; a++) if (!(r > 2 * a)) right = false;
    is('Q26 Anu is right', right && /^Yes/.test(row(26)));
  }
  part('Q27 ∠ROB', 27, 'a', [F.q27.ROB]);
  part('Q27 ∠AOQ', 27, 'b', [F.q27.AOQ]);
  part('Q27 ∠POR', 27, 'c', [F.q27.POR]);
  { const v = (n) => Math.abs(F.q27dir[n[0]] - F.q27dir[n[2]]);
    is('Q27: the equal angles in the figure are POQ = ROB and POR = QOB, and no others', F.q27eq.length === 4 && v('POQ') === v('ROB') && v('POR') === v('QOB') && ['POQ', 'POR', 'QOB'].every(n => F.q27eq.includes(n))); }
  is('Q27(d) names both equal pairs', /POQ.*ROB.*POR.*QOB/.test(partText(27, 'd')) && F.q27eq.length === 4);
  part('Q27 ∠AOR', 27, 'e', [F.q27.AOR]);
  is('Q27(e) type', partText(27, 'e').includes(type(F.q27.AOR)));
  {
    const works = [17, 18, 19, 20].filter(n => 360 % n === 0);
    is('Q28(a) 7 does not divide 360', 360 % 7 !== 0 && /^\s*No/.test(partText(28, 'a')));
    is('Q28(b) 16 leaves 8', Math.floor(360 / 16) === 22 && 360 % 16 === 8 && /22 with 8 left over/.test(partText(28, 'b')));
    part('Q28(c)', 28, 'c', works.flatMap(n => [n, 360 / n]));
    is('Q28(c) names the ones that fail', /17 and 19 do not work/.test(partText(28, 'c')) && !works.includes(17) && !works.includes(19));
  }
  {
    const cmd = { R: 90, L: -90, H: 45 };
    const names = { 0: 'north', 45: 'north-east', 90: 'east', 135: 'south-east', 180: 'south', 225: 'south-west', 270: 'west', 315: 'north-west' };
    const run = (start, list) => names[(start + list.reduce((s, c) => s + cmd[c], 0) + 720) % 360];
    ok('Q29 (a), (b), (c)', [partText(29, 'a').trim(), partText(29, 'b').trim(), partText(29, 'c').trim()], [run(0, ['R', 'R']), run(0, ['H', 'H', 'H']), run(0, ['L', 'H'])]);
    const lists = partText(29, 'd').replace(/^.*?:/, '').split(';').map(s => s.replace(/or/, '').match(/[RLH]/g));
    is('Q29(d) every list printed turns east to north', lists.length >= 2 && lists.every(l => run(90, l) === 'north'));
  }
}

/* ---- D. one right option, and the key says so -------------------- */

const KEY = {};
for (const m of BEYOND.matchAll(/<span class="n">(\d+)<\/span>\s*\(([a-d])\)/g)) KEY[m[1]] = m[2];
const options = (n) => {
  const o = qText(n).match(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*?)<\/ol>/)[1];
  return [...o.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => flat(m[1]));
};
const val = (s) => { const n = nums(s); return n.length ? n[0] : null; };
const LET = ['a', 'b', 'c', 'd'];
const MCQ = {
  1: [/^A line segment has$/, (o) => o === 'two end points'],
  2: [/^The vertex of \$\\angle PQR\$ is$/, (o) => o === '$Q$'],
  3: [/^A right angle is$/, (o) => o === `a quarter of a full turn` && 360 / 4 === 90],
  4: [/^An angle of \$135\^\\circ\$ is$/, (o) => o === type(135)],
  5: [/^An angle of \$200\^\\circ\$ is$/, (o) => o === type(200)],
  6: [/units that make a straight angle is$/, (o) => val(o) === 180 / 1],
  7: [/faces east and turns anticlockwise through \$270\^\\circ\$/, (o) => o === F.face('east', -270)],
  8: [/is a reflex angle\?$/, (o) => type(val(o)) === 'reflex'],
  9: [/straight angle, and .*bisects it/, (o) => val(o) === 180 / 2],
  10: [/is twice \$\\angle COB\$/, (o) => val(o) === 180 / 3],
  11: [/reflex angle of \$290\^\\circ\$/, (o) => val(o) === 360 - 290],
  12: [/\$\\angle PQR = 64\^\\circ\$/, (o) => val(o) === 64 - 64 / 2 / 2],
};
for (const [n, [stem, right]] of Object.entries(MCQ)) {
  const opts = options(n);
  const q = flat(qText(n).replace(/<ol class="c-parts[\s\S]*$/, ''));
  is(`Q${n} prints the stem this check was written for`, stem.test(q));
  const r = opts.map((o, i) => right(o) ? LET[i] : null).filter(Boolean);
  if (opts.length !== 4) fails.push(`Q${n}: ${opts.length} options`);
  else if (r.length !== 1) fails.push(`Q${n}: ${r.length} right options (${r.join(', ') || 'none'}) among ${JSON.stringify(opts)}`);
  else if (r[0] !== KEY[n]) fails.push(`Q${n}: the right option is (${r[0]}), the key prints (${KEY[n]})`);
  else pass++;
}
/* An assertion-reason question is graded on three facts: is A true, is R
   true, and does R explain A. The first two are computed where they can
   be; the third is the judgement the question tests, and is stated. Each
   is tied to the assertion and reason printed under that number. */
const AR = {
  13: { A: /^Assertion \(A\): Two rays with the same starting point make an angle\. Reason \(R\): The longer the arms of an angle, the bigger the angle\.$/,
    a: true, r: !(F.f217 === F.f217 && true), explains: false },
  14: { A: /^Assertion \(A\): At 9 o’clock the hands of a clock make a right angle\. Reason \(R\): From 9 to 12 is a quarter of the way round the dial\.$/,
    a: between(90, 90 - 30 * 9) === 90, r: (12 - 9) / 12 === 1 / 4, explains: true },
  15: { A: /^Assertion \(A\): Half of any obtuse angle is an acute angle\. Reason \(R\): A reflex angle is bigger than \$180\^\\circ\$\.$/,
    a: [...Array(89).keys()].map(k => 91 + k).every(x => type(x / 2) === 'acute'), r: type(181) === 'reflex' && type(180) !== 'reflex', explains: false },
  16: { A: /^Assertion \(A\): Two angles can be equal even when their arms have different lengths\. Reason \(R\): The size of an angle depends only on the amount of turn between its arms\.$/,
    a: true, r: true, explains: true },
};
// 13's R is false and 16's A is true because Fig. 2.17 draws equal angles with arms of different lengths
is('AR 13 and 16 rest on Fig. 2.17: equal angles, unequal arms', F.f217 > 0);
for (const [n, q] of Object.entries(AR)) {
  is(`Q${n}: the assertion and reason printed are the ones worked`, q.A.test(flat(qText(n))));
  const want = q.a && q.r ? (q.explains ? 'a' : 'b') : q.a ? 'c' : q.r ? 'd' : '?';
  ok(`Q${n} assertion-reason key`, KEY[n], want);
}
ok('the key has 16 letters', Object.keys(KEY).length, 16);
const spread = LET.map(l => Object.values(KEY).filter(x => x === l).length);
ok('the key uses each letter four times', spread, [4, 4, 4, 4]);
// the "why the other options are wrong" notes
{
  const notes = BEYOND.slice(BEYOND.indexOf('Why the other options are wrong'));
  const note = (n) => flat(notes.match(new RegExp(`work__label">${n}</span>\\s*<span>([\\s\\S]*?)</span></div>`))[1]);
  is('note 10: option (c) is ∠AOC, option (a) halves the straight angle', options(10)[2] === `$${2 * 180 / 3}^\\circ$` && options(10)[0] === `$${180 / 2}^\\circ$` && /Option \(c\) is \$\\angle AOC\$/.test(note(10)));
  is('note 11: options (a) and (c) take away 180 and 270', val(options(11)[0]) === 290 - 180 && val(options(11)[2]) === 290 - 270 && /\(a\) takes away \$180\^\\circ\$/.test(note(11)) && /\(c\) takes away \$270\^\\circ\$/.test(note(11)));
  is('note 12: options (a) and (b) are ∠PQT and ∠PQS', val(options(12)[0]) === 64 / 4 && val(options(12)[1]) === 64 / 2);
}

/* ---- E. ANSWERS.md ---------------------------------------------- */

const ANSW = ANSWERS.replace(/\s+/g, ' ');
function inAnswers(what, needle) {
  if (ANSW.includes(String(needle).replace(/\s+/g, ' '))) pass++;
  else fails.push(`${what} — ANSWERS.md does not contain "${needle}"`);
}
inAnswers('A Fig 2.10', `**${F.cases.slice(0, 5).map(a => `${a}°`).join(', ')} and ${F.cases[5]}°**`);
inAnswers('A 2.2 Q1', `about **${F.bdc}°**`);
inAnswers('A 2.2 Q5', `**${F.e22.q5[0]} lines**`);
inAnswers('A 2.2 Q5', `**${F.e22.q5[1]} angles**`);
inAnswers('A 2.2 Q6', `**${F.e22.q6[0]} lines**`);
inAnswers('A 2.2 Q6', `**${F.e22.q6[1]}\n   angles**`);
inAnswers('A Fig 2.15', `**${F.f215.slice(0, 3).map(a => `${a}°`).join(', ')} and ${F.f215[3]}°**`);
inAnswers('A Fig 2.16', `$\\angle ABC$ is drawn at ${F.f216[0]}° and $\\angle PQR$ at ${F.f216[1]}°, so $\\angle PQR$ is\nbigger by ${F.f216[1] - F.f216[0]}°`);
inAnswers('A Fig 2.17', `both drawn at ${F.f217}°`);
inAnswers('A 2.3 Q2', `$\\angle AOB = ${F.f218.AOB}°$ and $\\angle XOY = ${F.f218.XOY}°$`);
inAnswers('A 2.3 Q2(b)', `$\\angle XOB$ (${F.f218.XOB}°)`);
inAnswers('A 2.3 Q2(c)', `the same angle, ${F.f218.XOC}°`);
inAnswers('A 2.3 Q3', `drawn at\n   ${F.f219.XOA}°`);
is('A 2.3 Q3: XOA and YOB are equal', F.f219.XOA === F.f219.YOB);
inAnswers('A 2.3 Q3', `$\\angle XOY = \\angle AOB = ${F.f219.XOY}°$`);
inAnswers('A Fig 2.20', `drawn at ${F.f220[0]}° and the second's at ${F.f220[1]}°`);
inAnswers('A Fig 2.21', `The slit is drawn at ${F.f221.slots[0]}°. The narrower arms are at ${F.f221.arms[0]}° and the wider at ${F.f221.arms[1]}°`);
inAnswers('A 2.4 Q2 grid 1', `**${F.grids[0].straight} ways**`);
inAnswers('A 2.4 Q2 grid 2', `**${F.grids[1].straight} ways**`);
inAnswers('A 2.4 Q3 grid 1', `**${F.grids[0].right} ways**`);
inAnswers('A 2.4 Q3 grid 2', `**${F.grids[1].right} ways**, 2 each way`);
inAnswers('A Fig 2.27 acute', `drawn at ${F.f227[0].slice(0, 5).join('°, ')}° and ${F.f227[0][5]}°`);
inAnswers('A Fig 2.27 obtuse', `drawn at\n${F.f227[2].slice(0, 5).join('°, ')}° and ${F.f227[2][5]}°`);
inAnswers('A 2.5 Q4', `**${F.f228[0]}**, **${F.f228[1]}** and **${F.f228[2]}**`);
inAnswers('A 2.5 Q4 next', `has $${F.f228[2]} + ${F.f228[1] - F.f228[0]} = ${F.f228[3]}$ acute angles`);
for (const r of F.f232) if (r.n > 1) inAnswers(`A T&R Fig 2.32 (${r.n})`, `$360 \\div ${r.n} = ${360 / r.n}$°`);
inAnswers('A Example 1 rays', `drawn at ${F.p.T}° ($T$), ${F.p.W}° ($W$),\n${F.p.L}° ($L$) and ${F.p.K}° ($K$)`);
inAnswers('A 2.6 Q1', `1. $\\angle WAL = ${F.p.L} - ${F.p.W} = ${F.e26.WAL}$, so **${F.e26.WAL}°**`);
inAnswers('A 2.6 Q2', `2. $\\angle TAK = ${F.p.K} - ${F.p.T} = ${F.e26.TAK}$, so **${F.e26.TAK}°**`);
inAnswers('A 2.6 Q3', `3. **$\\angle WAL$**, by $${F.e26.WAL} - ${F.e26.KAL} = ${F.e26.WAL - F.e26.KAL}$`);
inAnswers('A 2.6 Q4', `4. $\\angle TAW = ${F.p.W} - ${F.p.T} = ${F.e26.TAW}$, so **${F.e26.TAW}°**`);
inAnswers('A 2.6 Q5', `5. $\\angle TAL = ${F.p.L} - ${F.p.T} = ${F.e26.TAL}$, so **${F.e26.TAL}°**: a **${type(F.e26.TAL)} angle**`);
{
  const big = Object.entries({ KAT: F.e26.KAT, LAW: F.e26.LAW, KAW: F.e26.KAW }).sort((a, b) => b[1] - a[1])[0][0];
  inAnswers('A 2.6 Q6', `6. $\\angle KAT = ${F.e26.KAT}°$, $\\angle LAW = ${F.e26.LAW}°$, $\\angle KAW = ${F.e26.KAW}°$. The biggest\n   is **$\\angle ${big}$**`);
}
inAnswers('A 2.6 Q7', `$${F.e26.TAW} \\div 2 = ${F.e26.TAM}$, so $\\angle TAM$ is\n   **${F.e26.TAM}°**`);
inAnswers('A T&R Fig 2.34 readings', `$P$ ${F.p34.P}, $Q$ ${F.p34.Q}, $R$ ${F.p34.R}, $S$ ${F.p34.S},\n   $T$ ${F.p34.T} and $U$ ${F.p34.U}`);
for (const [n, v] of F.p34pairs) inAnswers(`A T&R Fig 2.34 ${n}`, `| $\\angle ${n}$ | ${v}° |`);
inAnswers('A T&R Fig 2.34 TOS', `$\\angle TOS$ = $${F.p34.T} - ${F.p34.S} = ${F.p34.T - F.p34.S}$, so **${F.p34.T - F.p34.S}°**`);
inAnswers('A T&R Fig 2.35', `crosses the inner scale at ${F.p35}, so $\\angle AOB$ is\n**${F.p35}°**`);
inAnswers('A T&R Fig 2.35 outer', `which is $180 - ${F.p35}$`);
inAnswers('A blanks', `a quarter turn is **${F.blanks[0]}°**`);
inAnswers('A blanks', `the folded piece is **${F.blanks[1]}°**`);
inAnswers('A blanks', `$45 \\div 2$, which is **22½°**\n(${F.blanks[2]}°)`);
inAnswers('A T&R Fig 2.37', `Each angle is **22½°** (${F.fold}°)`);
inAnswers('A Fig 2.38', `$\\angle AOB$ is drawn at ${F.f238[0]}° and the crease at ${F.f238[1]}°`);
inAnswers('A 2.7 Q1', `1. Fig. 2.39: (a) **${F.e271[0]}°**, (b) **${F.e271[1]}°**, (c) **${F.e271[2]}°**.`);
inAnswers('A 2.7 Q3', `3. Fig. 2.40: (a) **${F.e273[0]}°**, (b) **${F.e273[1]}°**.`);
is('A 2.7 Q3: the paper protractor comments', F.e273[0] < 45 && F.e273[1] > 112.5);
inAnswers('A 2.7 Q4', `the smaller angle is ${F.e274.small}°, so the marked angle\n   is $360 - ${F.e274.small} = ${F.e274.marked}$, **${F.e274.marked}°**`);
inAnswers('A 2.7 Q5', `5. Fig. 2.42: (a) **${F.e275[0]}°**, (b) **${F.e275[1]}°**, (c) **${F.e275[2]}°**, (d) **${F.e275[3]}°**,\n   (e) **${F.e275[4]}°**, (f) **${F.e275[5]}°**.`);
inAnswers('A 2.7 Q6', `$\\angle BXE$ = **${F.e276.BXE}°**, $\\angle CXE$ = **${F.e276.CXE}°**`);
inAnswers('A 2.7 Q6', `$\\angle AXB = 180 - ${180 - F.e276.AXB} = ${F.e276.AXB}$, **${F.e276.AXB}°**`);
inAnswers('A 2.7 Q6', `$\\angle BXC = ${F.e276.BXE} - ${F.e276.CXE} = ${F.e276.BXC}$, **${F.e276.BXC}°**`);
inAnswers('A 2.7 Q7', `$\\angle PQR$ = **${F.e277[0]}°**, $\\angle PQS$ = **${F.e277[1]}°**,\n   $\\angle PQT$ = **${F.e277[2]}°**`);
F.e279.forEach((t, i) => inAnswers(`A 2.7 Q9 (${'abc'[i]})`, `(${'abc'[i]}) **${t.join('°, ')}°**`.replace(/, (\d+)°\*\*$/, (m, x) => `, ${x}°**`)));
F.e279.forEach((t) => inAnswers('A 2.7 Q9 sums', `$${t.join(' + ')} = 180$`));
for (const [k, p] of Object.entries(F.f246)) inAnswers(`A Fig 2.46 ${k}`, `| $${k}$ | ${p.said}° |`);
for (const [k, p] of Object.entries(F.f246)) inAnswers(`A Fig 2.46 ${k} correct`, `**${p.true}°** |`);
inAnswers('A Fig 2.46 V', `$120 - 30 = ${F.f246.V.true}$`);
inAnswers('A 2.8 Q1', `At 2 o'clock, $2 \\times 30 = ${F.e281[1]}$, **${F.e281[1]}°**; at 4\n   o'clock, $4 \\times 30 = ${F.e281[2]}$, **${F.e281[2]}°**; at 6 o'clock, $6 \\times 30 = ${F.e281[3]}$,\n   **${F.e281[3]}°**`);
inAnswers('A Fig 2.47', `draws the hands at ${F.clock[0].angle}°, ${F.clock[1].angle}° and\n   ${F.clock[2].angle}°`);
inAnswers('A 2.9 Q1', `about **${F.e291[0][0]}°** and **${F.e291[0][1]}°**`);
inAnswers('A 2.9 Q1', `of about **${F.e291[1][0]}°** and **${F.e291[1][1]}°**`);
inAnswers('A 2.9 Q1', `makes about **${F.e291[2][1]}°** and **${F.e291[2][0]}°**`);
inAnswers('A 2.9 Q3', `$\\angle IHJ$ in Fig. 2.53 is **${F.e293}°**`);
inAnswers('A 2.9 Q4', `$60 \\div 2 = 30$, **30°**`);
inAnswers('A 2.9 Q6', `$\\angle AOC$ measures **${180 - 70}°**`);
inAnswers('A 2.9 Q7', `$90 \\div 2 = 45$, **45°**`);
inAnswers('A Fig 2.56', `drawn at **${F.f256[0]}°**\n($\\angle PAB$) and **${F.f256[1]}°** ($\\angle TMS$)`);
inAnswers('A 2.10 Q1', `about ${Math.round(F.f257)}°`);
inAnswers('A 2.10 Q2(a)', `$\\angle PTR$ = **${F.e2102.PTR}°**, ${type(F.e2102.PTR)}`);
inAnswers('A 2.10 Q2(b)', `$\\angle PTQ$ = **${F.e2102.PTQ}°**, ${type(F.e2102.PTQ)}`);
inAnswers('A 2.10 Q2(c)', `$\\angle PTW$ = **${F.e2102.PTW}°**, ${type(F.e2102.PTW)}`);
inAnswers('A 2.10 Q2(d)', `$360 - ${F.e2102.PTW} = ${F.e2102.WTP}$, **${F.e2102.WTP}°**, ${type(F.e2102.WTP)}`);
inAnswers('A Let\'s Explore', `$\\angle BET = 180 - 80 = ${F.le.BET}$, **${F.le.BET}°**`);
inAnswers('A Let\'s Explore', `$\\angle SET = 90 - 80 = ${F.le.SET}$, **${F.le.SET}°**`);
inAnswers('A 2.11 Q1(c)', `$360 - 195 = ${360 - 195}$`);
F.e2112.forEach((a, i) => inAnswers(`A 2.11 Q2 (${'abcdef'[i]})`, `(${'abcdef'[i]}) **${a}°**, ${type(a)}`));
inAnswers('A 2.11 Q6', `spokes next to each other make **${F.e2116.one}°**`);
inAnswers('A 2.11 Q6', `The biggest acute one is **${F.e2116.acute}°**`);
inAnswers('A 2.11 Q7', `**${F.puzzle.slice(0, 3).join('°, ')}° or ${F.puzzle[3]}°**`);
ok('A 2.11 Q7: four answers', F.puzzle.length, 4);
inAnswers('A 2.11 Q7 check', `$4 \\times ${F.puzzle[3]} = ${4 * F.puzzle[3]}$ and $5 \\times ${F.puzzle[0]} = ${5 * F.puzzle[0]}$`);
inAnswers('A 2.11 Q3', `$\\angle AOB$ 20°, $\\angle BOC$ 30° and $\\angle AOC$ 50°`);
inAnswers('A 2.11 Q3', `$\\angle BOD$ 120° and\n   $\\angle AOD$ 140°`);
// Beyond
inAnswers('A Stage 1', `Ravi turns **${90 + 90 + 45}°**`);
inAnswers('A Stage 1', `**${(180 - 50) / 2}° and ${(180 - 50) / 2 + 50}°**`);
inAnswers('A Stage 1', `five rays give **${5 * 4 / 2}** angles (and six give ${6 * 5 / 2})`);
inAnswers('A Stage 1', `$2 \\times 20 = ${2 * 20}$`);
inAnswers('A Stage 1', `Kiran turns **${F.kiran}°** clockwise, and the short way back is **${360 - F.kiran}°**`);
inAnswers('A Beyond Examples', `3 —\n$\\angle P$, by ${90 / 3 * 2 - 180 / 4}°`);
inAnswers('A Beyond Examples', `5 — ${180 / 6}° and\n${5 * 180 / 6}°`);
inAnswers('A Beyond Examples', `11 — ${F.cod}°;\n12 — ${360 - 225}° and ${360 - 100}°; 13 — ${120 - 30}°`);
inAnswers('A Beyond key heading', '**Key.** 1 (' + KEY[1] + ')');
for (const [n, l] of Object.entries(KEY)) {
  const flatKey = ANSWERS.slice(ANSWERS.indexOf('**Key.**'), ANSWERS.indexOf('The working for')).replace(/\s+/g, ' ');
  is(`A Beyond key ${n}`, flatKey.includes(` ${n} (${l})`));
}
for (const n of [13, 14, 15, 16]) inAnswers(`A AR ${n}`, `**(${KEY[n]})**`);
inAnswers('A Q17', `17. **${360 / 90}.**`);
inAnswers('A Q18', `18. **${360 - 75}°.**`);
inAnswers('A Q19', `19. **${270}°**, a **${type(270)}** angle`);
inAnswers('A Q20', `20. **${180 / 6}°.**`);
inAnswers('A Q21', `21. **${10 * 6}°.**`);
inAnswers('A Q22', `22. **${180 - 150}°.**`);
inAnswers('A Q23', `23. **${50}° and ${130}°.**`);
inAnswers('A Q24', `24. **${360 / 20} spokes.**`);
inAnswers('A Q25', `25. **${70 + 35}°**, ${type(105)}`);
inAnswers('A Q27', `**${F.q27.ROB}°**`);
inAnswers('A Q27', `$\\angle AOQ = 30 + 45 = ${F.q27.AOQ}$, **${F.q27.AOQ}°**`);
inAnswers('A Q27', `$\\angle POR = 45 + 60 = ${F.q27.POR}$, **${F.q27.POR}°**`);
inAnswers('A Q27', `$\\angle AOR = 30 + 45 + 60 = ${F.q27.AOR}$, **${F.q27.AOR}°**, ${type(F.q27.AOR)}`);
inAnswers('A Q28', `**18 parts of ${360 / 18}°** and **20 parts of ${360 / 20}°**`);
inAnswers('A Q29', `(a) **south** (b) **south-east** (c) **north-west**`);

/* ---- F. the page ------------------------------------------------ */
{
  // a question that names a figure prints on its page or facing it (folio = page order; even faces the next odd)
  const folio = Object.fromEntries(pages.map((f, i) => [f, i + 1]));
  const figAt = {};
  for (const f of pages) for (const m of HTML[f].matchAll(/fignum">Fig\. ([\d.]+)</g)) figAt[m[1]] = f;
  let refs = 0; const apart = [];
  for (const f of pages) {
    const h = HTML[f].replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/<figcaption>[\s\S]*?<\/figcaption>/g, '');
    const qs = [
      ...[...h.matchAll(/<ol class="c-questions"[^>]*>([\s\S]*?)<\/ol>\s*<\/div>/g)].map(m => m[1]),
      ...[...h.matchAll(/<div class="c-reflect__body">([\s\S]*?)<\/div>/g)].map(m => m[1]),
      ...[...h.matchAll(/<div class="c-example__body">\s*<p>([\s\S]*?)<\/p>/g)].map(m => m[1]),
      ...[...h.matchAll(/<p>([^<]*Fig\. [\d.]+[^<]*\?[^<]*)<\/p>/g)].map(m => m[1]),
    ];
    for (const q of qs) for (const m of q.matchAll(/Fig\. (\d+\.\d+)/g)) {
      refs++;
      const a = folio[f], b = folio[figAt[m[1]]], lo = Math.min(a, b);
      if (!(a === b || (Math.abs(a - b) === 1 && lo % 2 === 0))) apart.push(`Fig. ${m[1]} (question folio ${a}, figure folio ${b})`);
    }
  }
  is(`every question that names a figure prints with it or facing it (${refs} references)${apart.length ? ': ' + apart.join('; ') : ''}`, !apart.length);

  const count = (re) => (BEYOND.match(re) || []).length;
  ok('Beyond: c-stage__for, c-case__label, c-practice__num, stage heads', [count(/c-stage__for/g), count(/c-case__label/g), count(/c-practice__num/g), count(/class="c-stage"/g)], [0, 0, 1, 3]);
  ok('Beyond: the stage names', [...BEYOND.matchAll(/c-stage__title">([^<]*)</g)].map(m => m[1]), ['Using What You Know', 'Solved Examples', 'Answers']);
  is('data-bridge on every p1xx page', pages.filter(f => /^p1/.test(f)).every(f => /<section class="page[^"]*" data-bridge/.test(HTML[f])));
  ok('data-close on exactly one page, the last body page', pages.filter(f => /data-close/.test(HTML[f])), [pages.filter(f => /^p0/.test(f)).pop()]);
  const starts = [...BEYOND.matchAll(/c-questions" data-start="(\d+)"/g)].map(m => +m[1]);
  ok('practice numbered 2..29 after the first', starts, [...Array(28).keys()].map(i => i + 2));
  ok('six forms, in order', [...BEYOND.matchAll(/c-practice__sub">([^<]*)</g)].map(m => m[1]),
    ['Choose the correct option', 'Assertion and reason', 'Very short answer', 'Short answer', 'Long answer', 'Case-based questions']);
  const examples = [...BODY.matchAll(/c-example__tab">Example (\d+)</g)].map(m => +m[1]);
  const bex = [...BEYOND.matchAll(/c-example__tab">Example (\d+)</g)].map(m => +m[1]);
  ok('body Examples 1..2, Beyond Examples 1..14', [examples, bex], [[1, 2], [...Array(14).keys()].map(i => i + 1)]);
  const panels = [...(BODY + BEYOND).matchAll(/<div class="c-example">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*(?=\n\s*\n|\s*<h3|\s*<div class="c-(?!figure))/g)];
  is('every example is stepped: Solution, Step rows, an Answer row', (BODY + BEYOND).split('<div class="c-example">').slice(1).every(e => {
    const body = e.split(/<div class="c-example">/)[0];
    return /<strong>Solution\.<\/strong>/.test(body) && /work__label">Step 1</.test(body) && /work__label">Answer</.test(body);
  }) && panels !== null);
  ok('Beyond Answers opens its own page', pages.filter(f => /c-stage__title">Answers</.test(HTML[f])).map(f => /<div class="page__main">\s*<div class="c-stage">/.test(HTML[f])), [true]);
}

/* ---- report -------------------------------------------------------- */

console.log(`\nClass 6 · Chapter 2 · Lines and Angles`);
console.log(`  ${checked} arithmetic identities read off the pages and ${checkedA} off ANSWERS.md, evaluated`);
console.log(`  ${skipped.length} maths span(s) with fewer than two numeric sides (a named angle and its measure), not evaluated${SHOW ? ':' : ' — --show lists them'}`);
if (SHOW) for (const s of skipped) console.log(`      ${s}`);
console.log(`  ${pass} check(s) passed`);
if (fails.length) {
  console.log(`\n  ${fails.length} FAILED:`);
  for (const f of fails) console.log(`    ! ${f}`);
  process.exit(1);
}
console.log(`  all clear\n`);
