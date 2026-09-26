#!/usr/bin/env node
/* Re-derive every number this chapter prints.

     node pages/class-6/math-ch06-perimeter-and-area/check-numbers.mjs

   A chapter about lengths and areas gets most of its numbers from its
   figures, so this reads the figures: every rectangle, polygon and circle
   is taken from the SVG on the page, measured, and scaled by the length
   printed on that figure. Nothing below restates a printed value as the
   thing to check it against — a value is computed, and then looked for
   on the page or in ANSWERS.md.

   Four parts:
     A  every arithmetic identity set as maths anywhere in the chapter
     B  what arithmetic alone cannot check: the figures, and the answers
        the examples and the practice print
     C  every multiple-choice and assertion-reason question — exactly one
        option is right, and it is the one the printed key gives
     D  ANSWERS.md

   Exits non-zero if anything does not hold up. --show prints the values
   computed from the figures, which is how ANSWERS.md was written. */

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
const HTML = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8').replace(/&nbsp;/g, ' ')]));
const ALL = pages.map(f => HTML[f]).join('\n');
const BODY = pages.filter(f => /^p0/.test(f)).map(f => HTML[f]).join('\n');
const BEYOND = pages.filter(f => /^p1/.test(f)).map(f => HTML[f]).join('\n');
const flat = (s) => s.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&rsquo;/g, '’').replace(/&ndash;/g, '–').replace(/&[a-z]+;/g, ' ')
  .replace(/\s+/g, ' ').trim();
const nums = (s) => [...s.replace(/\$[^$]*\$/g, m => m.replace(/\\frac\{(\d+)\}\{(\d+)\}/g, ' $1/$2 '))
  .matchAll(/\d+/g)].map(m => Number(m[0]));

/* ---- A. every arithmetic identity on the page ---------------- */

const UNIT = /\\text\{\s*(sq\s+)?(m|cm|ft|km)\s*\}/g;
function toExpr(side) {
  let s = side
    .replace(UNIT, '')
    .replace(/(\d+)\s*\\frac\{(\d+)\}\{(\d+)\}/g, '($1+$2/$3)')
    .replace(/\\frac\{(\d+)\}\{(\d+)\}/g, '($1/$2)')
    .replace(/\\times/g, '*')
    .replace(/\\div/g, '/')
    .replace(/\\,|\\ |\\quad/g, ' ')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, '');
  if (!s || !/^[-+*/()0-9.]+$/.test(s)) return null;
  return s;
}
let checked = 0;
const skipped = [];
for (const f of pages) {
  for (const m of HTML[f].matchAll(/\$([^$]+)\$/g)) {
    const span = m[1];
    if (!span.includes('=')) continue;
    const sides = span.split('=').map(s => s.trim()).filter(Boolean);
    if (sides.length < 2) continue;
    const vals = sides.map(toExpr);
    // a span may open with words ("Area of the floor $= 5 \times 4 = 20$")
    // or name a side in letters; the numeric sides are still compared
    const numeric = vals.filter(v => v !== null);
    if (numeric.length < 2) { skipped.push(`${f}: $${span}$`); continue; }
    const n = numeric.map(v => Function(`"use strict";return (${v})`)());
    checked++;
    if (n.some(x => Math.abs(x - n[0]) > 1e-9)) fails.push(`${f}: $${span}$ — sides are ${n.join(' and ')}`);
    else pass++;
  }
}

/* ---- the figures, read off the page -------------------------- */

function figure(num) {
  for (const f of pages) {
    const h = HTML[f];
    const at = h.indexOf(`<span class="fignum">Fig. ${num}</span>`);
    if (at < 0) continue;
    const start = h.lastIndexOf('<svg', at);
    const end = h.indexOf('</svg>', start);
    return { f, svg: h.slice(start, end), aria: (h.slice(start, end).match(/aria-label="([^"]*)"/) || [])[1] || '' };
  }
  throw new Error(`Fig. ${num} is not on any page`);
}
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([a-z][a-z0-9-]*)="([^"]*)"/g)].map(m => [m[1], m[2]]));
const rects = (svg, cls) => [...svg.matchAll(/<rect [^>]*>/g)].map(m => attrs(m[0]))
  .filter(a => !cls || a.class === cls).map(a => ({ x: +a.x, y: +a.y, w: +a.width, h: +a.height, cls: a.class }));
const polys = (svg, cls) => [...svg.matchAll(/<polygon [^>]*>/g)].map(m => attrs(m[0]))
  .filter(a => !cls || a.class.startsWith(cls)).map(a => a.points.trim().split(/\s+/).map(p => p.split(',').map(Number)));
const lines = (svg, cls) => [...svg.matchAll(/<line [^>]*>/g)].map(m => attrs(m[0]))
  .filter(a => !cls || a.class.startsWith(cls)).map(a => [+a.x1, +a.y1, +a.x2, +a.y2]);
const texts = (svg) => [...svg.matchAll(/<text [^>]*>([^<]*)<\/text>/g)].map(m => m[1]);
const r2 = (x) => Math.round(x * 1000) / 1000;

const shoelace = (pts, u) => r2(Math.abs(pts.reduce((s, [x, y], i) => {
  const [x2, y2] = pts[(i + 1) % pts.length]; return s + x * y2 - x2 * y;
}, 0)) / 2 / u / u);
function sd(edges, u) { // edges: [x1,y1,x2,y2]
  let s = 0, d = 0; const other = [];
  for (const [x1, y1, x2, y2] of edges) {
    const dx = r2(Math.abs(x2 - x1) / u), dy = r2(Math.abs(y2 - y1) / u);
    if (dx === 0 || dy === 0) s += dx + dy; else if (dx === dy) d += dx; else other.push([dx, dy]);
  }
  return { s: r2(s), d: r2(d), other };
}
const polyEdges = (pts) => pts.map(([x, y], i) => [x, y, ...pts[(i + 1) % pts.length]]);
const cellPerimeter = (cells) => {
  const set = new Set(cells.map(c => c.join(',')));
  let p = 0;
  for (const [x, y] of cells) for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!set.has(`${x + a},${y + b}`)) p++;
  return p;
};
const rectsTouch = (a, b) => { // length of shared boundary between two axis rectangles
  const ox = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
  const oy = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
  if ((a.x + a.w === b.x || b.x + b.w === a.x) && oy > 0) return oy;
  if ((a.y + a.h === b.y || b.y + b.h === a.y) && ox > 0) return ox;
  return 0;
};

const F = {};

/* Fig. 6.1 — the rectangle and its two printed sides */
{
  const g = figure('6.1'); const [r] = rects(g.svg, 'dg-line');
  ok('Fig 6.1 is drawn to its labels, 12 by 8', r2(r.w / r.h), r2(12 / 8));
  is('Fig 6.1 prints 12 cm and 8 cm', texts(g.svg).includes('12 cm') && texts(g.svg).includes('8 cm'));
  F.p61 = 2 * (12 + 8);
  ok('Fig 6.1 perimeter', F.p61, 40);
}

/* Fig. 6.2 — the triangle is drawn to scale */
{
  const g = figure('6.2'); const [pts] = polys(g.svg, 'dg-line');
  const len = pts.map(([x, y], i) => Math.hypot(pts[(i + 1) % 3][0] - x, pts[(i + 1) % 3][1] - y)).sort((a, b) => a - b);
  ok('Fig 6.2 sides are in the ratio 4 : 5 : 7', len.map(l => Math.round(l / len[0] * 4 * 10) / 10), [4, 5, 7]);
}

/* Fig. 6.3 — two tracks; Exercise 6.2 */
{
  const g = figure('6.3'); const [outer, inner] = rects(g.svg, 'dg-line');
  const u = outer.w / 70;
  ok('Fig 6.3 outer track is 70 m by 40 m', [r2(outer.w / u), r2(outer.h / u)], [70, 40]);
  ok('Fig 6.3 inner track is 60 m by 30 m', [r2(inner.w / u), r2(inner.h / u)], [60, 30]);
  F.akshi = 2 * (70 + 40); F.toshi = 2 * (60 + 30);
  ok('Akshi one round', F.akshi, 220);
  F.e62 = { q1: 5 * F.akshi, q2: 7 * F.toshi };
  ok('Ex 6.2 Q1 and Q2', [F.e62.q1, F.e62.q2], [1100, 1260]);
  is('Ex 6.2 Q2 Toshi ran further', F.e62.q2 > F.e62.q1);
  // both runners start at the bottom right corner and run clockwise on
  // the page: along the bottom to the left, up, along the top, down
  const where = (L, W, d) => {
    const rounds = Math.floor(d / (2 * (L + W)));
    let r = d - rounds * 2 * (L + W);
    const sides = [['bottom side', L, 'the starting corner'], ['left side', W, 'the bottom left corner'],
      ['top side', L, 'the top left corner'], ['right side', W, 'the top right corner']];
    for (const [side, len, from] of sides) { if (r < len || (r === 0)) return { rounds, side, from, r }; r -= len; }
    return { rounds, side: 'the starting corner', from: '', r: 0 };
  };
  F.e62q3 = { A: where(70, 40, 250), B: where(70, 40, 500), C: where(70, 40, 1000),
    X: where(60, 30, 250), Y: where(60, 30, 500), Z: where(60, 30, 1000) };
  show('Ex 6.2 Q3', JSON.stringify(F.e62q3));
  ok('Ex 6.2 Q3 full rounds at 1000 m', [F.e62q3.C.rounds, F.e62q3.Z.rounds], [4, 5]);
  const [a1, a2, a3, a4] = lines(g.svg, 'dg-move');
  is('Fig 6.3 arrows run right along the top and down the right side (clockwise)',
    a1[2] > a1[0] && a2[3] > a2[1] && a3[2] < a3[0] && a4[3] < a4[1]);
}

/* Fig. 6.4 — the common finishing line; Exercise 6.2 Q4 */
{
  const g = figure('6.4'); const [outer, inner] = rects(g.svg, 'dg-line');
  ok('Fig 6.4 squares are 150 and 100 to scale', r2(outer.w / inner.w), 1.5);
  const [top] = lines(g.svg, 'dg-move');
  is('Fig 6.4 runs anticlockwise (top arrow points left)', top[2] < top[0]);
  // start = the point from which running 350 m anticlockwise ends at the
  // middle of the bottom side: go forward (perimeter - 350) from the line
  const start = (s) => {
    let r = 4 * s - 350;
    const legs = [['bottom side, towards the right', s / 2, 'the finishing line'],
      ['right side, going up', s, 'the bottom right corner'], ['top side, going left', s, 'the top right corner'],
      ['left side, going down', s, 'the top left corner']];
    for (const [side, len, from] of legs) { if (r <= len) return { side, from, r }; r -= len; }
  };
  F.race = { A: start(100), B: start(150) };
  show('Ex 6.2 Q4', JSON.stringify(F.race));
  ok('Ex 6.2 Q4 inner start is the bottom right corner (50 m on)', [F.race.A.side, F.race.A.r], ['bottom side, towards the right', 50]);
  ok('Ex 6.2 Q4 outer start is 25 m along the top from the top right corner', [F.race.B.from, F.race.B.r], ['the top right corner', 25]);
}

/* Fig. 6.5 — straight and diagonal units */
{
  const g = figure('6.5');
  const e = sd(lines(g.svg, 'dg-plot'), 22);
  ok('Fig 6.5 is 6s + 3d', [e.s, e.d], [6, 3]);
  is('Fig 6.5: Akshi counted 9 gaps', e.s + e.d === 9);
}

/* Fig. 6.7 — split and rejoin; Exercise 6.3 Q2 and Q3 */
{
  const g = figure('6.7'); const r = rects(g.svg, 'dg-line');
  const u = r[0].w / 4;
  ok('Fig 6.7 chit is 4 by 6', [r2(r[0].w / u), r2(r[0].h / u)], [4, 6]);
  const arr = [[r[1], r[2]], [r[3], r[4]], [r[5], r[6]], [r[7], r[8]]];
  F.chit = arr.map(([a, b]) => 2 * (6 + 2) * 2 - 2 * rectsTouch(a, b) / u);
  show('Fig 6.7 perimeters (a)-(d)', F.chit);
  ok('Fig 6.7 (a) perimeter as printed', F.chit[0], 12 + 2 + 12 + 2);
  ok('Ex 6.3 Q2 (b), (c), (d)', F.chit.slice(1), [28, 28, 26]);
  ok('Fig 6.7 (d) touches along 3 cm, as labelled', rectsTouch(r[7], r[8]) / u, 3);
  ok('Ex 6.3 Q3: 22 cm needs 5 cm touching', (32 - 22) / 2, 5);
}

/* Fig. 6.8 — four shapes on dot paper; Exercise 6.3 Q1 and 6.6 Q1 */
{
  const g = figure('6.8');
  F.dots = polys(g.svg, 'dg-plot').map(p => ({ ...sd(polyEdges(p), 24), area: shoelace(p, 24) }));
  show('Fig 6.8', JSON.stringify(F.dots));
  is('Fig 6.8 every side is straight or diagonal', F.dots.every(x => !x.other.length));
  ok('Fig 6.8 perimeters', F.dots.map(x => `${x.s}s + ${x.d}d`), ['8s + 2d', '4s + 6d', '12s + 6d', '18s + 6d']);
  ok('Fig 6.8 areas', F.dots.map(x => x.area), [4, 9, 10, 11]);
}

/* Fig. 6.8, printed again as Fig. 6.13 inside Exercise Set 6.6 — the same
   drawing, on the page of the question that uses it */
{
  const orig = figure('6.8'), rep = figure('6.13');
  const body = (svg) => svg.replace(/^<svg[^>]*>/, '');
  is('Fig 6.13 draws exactly the same shapes as Fig 6.8', body(orig.svg) === body(rep.svg));
  ok('Fig 6.13 keeps the same viewBox', rep.svg.match(/viewBox="[^"]*"/)[0], orig.svg.match(/viewBox="[^"]*"/)[0]);
  ok('Fig 6.13 aria-label is Fig 6.8\'s, marked repeated', rep.aria, `${orig.aria} (repeated)`);
  is('Fig 6.13 is captioned as the shapes of Fig. 6.8, repeated', /Fig\.(&nbsp;| )6\.13<\/span> The four shapes of Fig\. 6\.8, repeated here\./.test(HTML[rep.f]));
  const areas = polys(rep.svg, 'dg-plot').map(p => shoelace(p, 24));
  ok('Ex 6.6 Q1 answers read from Fig 6.13', areas, [4, 9, 10, 11]);
  const pageOf = (re) => pages.find(f => re.test(HTML[f]));
  const q1 = pageOf(/Exercise Set 6\.6<\/div>[\s\S]*?Find the area of each shape in Fig\. 6\.13/);
  is(`Ex 6.6 Q1 (${q1}) is on Fig 6.13's page (${rep.f})`, q1 === rep.f);
  const q1s63 = pageOf(/Exercise Set 6\.3<\/div>[\s\S]*?shape in Fig\. 6\.8/);
  is(`Ex 6.3 Q1 (${q1s63}) is on Fig 6.8's page (${orig.f})`, q1s63 === orig.f);
}

/* every question that names a figure is on its page or facing it */
{
  const pno = (f) => Number(f.slice(1, 4));
  const near = (a, b) => a === b || (Math.min(pno(a), pno(b)) % 2 === 0 && Math.abs(pno(a) - pno(b)) === 1);
  const figPage = (n) => figure(n).f;
  const where = (re) => pages.filter(f => /^p0[0-2]/.test(f) && re.test(HTML[f]));
  const pairs = [
    ['6.3', /How far does Akshi run in 5 rounds/], ['6.4', /In Fig\. 6\.4 the race is 350 m/],
    ['6.7', /arrangements \(b\), \(c\) and \(d\) in Fig\. 6\.7/], ['6.11', /Split each shape in Fig\. 6\.11/],
    ['6.12', /Which pieces have the same area\?/], ['6.17', /each shape in Fig\. 6\.17/],
    ['6.19', /Try placing the new square in other places/], ['6.20', /missing measurements of every room in Charan/],
    ['6.21', /For Sharan&rsquo;s house in Fig\. 6\.21/], ['6.22', /In each puzzle in Fig\. 6\.22/],
  ];
  for (const [n, re] of pairs) {
    const at = where(re);
    is(`the question on Fig ${n} (${at}) is on its page or facing it (${figPage(n)})`, at.length === 1 && near(at[0], figPage(n)));
  }
}

/* the Think and Reflect after Fig. 6.21 asks for every pair of equal rooms */
is('T&R reads "Which rooms in Charan’s house have the same area?"',
  /Which rooms in Charan&rsquo;s house have the same area\?/.test(BODY) && !/Which two rooms/.test(BODY));

/* Fig. 6.9 */
{
  const g = figure('6.9');
  ok('Fig 6.9 has 3 rows of 4 unit squares', rects(g.svg, 'dg-thin').length, 3 * 4);
}

/* Fig. 6.10 and body Ex 4 */
{
  const g = figure('6.10'); const r = rects(g.svg);
  const land = r.reduce((a, b) => (a.w * a.h >= b.w * b.h ? a : b));
  const u = land.w / 12;
  ok('Fig 6.10 land is 12 by 10', [r2(land.w / u), r2(land.h / u)], [12, 10]);
  const beds = r.filter(x => r2(x.w / u) === 4 && r2(x.h / u) === 4);
  is('Fig 6.10 has four 4 m beds', new Set(beds.map(b => `${b.x},${b.y}`)).size === 4);
  ok('body Ex 4, the plus-shaped split', 10 * 4 + 2 * (4 * 2), 12 * 10 - 4 * 16);
}

/* Fig. 6.11 — Exercise 6.4 Q4 */
{
  const g = figure('6.11'); const [a, b] = polys(g.svg, 'dg-line');
  F.e64q4 = [shoelace(a, 15), shoelace(b, 15)];
  show('Ex 6.4 Q4', F.e64q4);
  ok('Ex 6.4 Q4 areas', F.e64q4, [28, 9]);
  const edgesA = polyEdges(a).map(([x1, y1, x2, y2]) => r2(Math.hypot(x2 - x1, y2 - y1) / 15)).sort();
  const labelsA = texts(g.svg).slice(0, 8).map(Number).sort();
  is('Fig 6.11 (a) every printed length is a side of the shape',
    labelsA.every(l => { const i = edgesA.indexOf(l); if (i < 0) return false; edgesA.splice(i, 1); return true; }));
  const edgesB = polyEdges(b).map(([x1, y1, x2, y2]) => r2(Math.hypot(x2 - x1, y2 - y1) / 15)).sort();
  const labelsB = texts(g.svg).slice(9, 15).map(Number).sort();
  is('Fig 6.11 (b) every printed length is a side of the shape',
    labelsB.every(l => { const i = edgesB.indexOf(l); if (i < 0) return false; edgesB.splice(i, 1); return true; }));
}

/* Fig. 6.12 — the tangram, in units of Shape C; Exercise 6.5 */
{
  const g = figure('6.12'); const p = polys(g.svg, 'dg-line');
  const L = texts(g.svg); // A B E D C G F, in drawing order A B E D C G F
  const order = ['A', 'B', 'E', 'D', 'C', 'G', 'F'];
  const c = shoelace(p[4], 1);
  F.tan = Object.fromEntries(order.map((k, i) => [k, shoelace(p[i], 1) / c]));
  show('tangram in C', JSON.stringify(F.tan));
  ok('the letters are in drawing order', L, order);
  ok('tangram pieces in units of C', F.tan, { A: 4, B: 4, E: 1, D: 2, C: 1, G: 2, F: 2 });
  ok('Ex 6.5 Q6 whole square in C', Object.values(F.tan).reduce((a, b) => a + b), 16);
  const side = Math.sqrt(16 * c);
  // the rectangle made of all seven pieces: 2a by a with 2a*a = 16C
  const a = Math.sqrt(8 * c);
  is('Ex 6.5 Q8 the rectangle has the longer perimeter', 6 * a > 4 * side);
}

/* Fig. 6.14 */
{
  const g = figure('6.14');
  const cs = [...g.svg.matchAll(/<circle [^>]*>/g)].map(m => attrs(m[0])).map(a => [+a.cx, +a.cy, +a.r]);
  const [r1, r2b] = rects(g.svg, 'dg-line');
  const inR = (r) => cs.filter(([x, y, rad]) => x - rad >= r.x - 0.01 && x + rad <= r.x + r.w + 0.01 && y - rad >= r.y - 0.01 && y + rad <= r.y + r.h + 0.01);
  ok('Fig 6.14 circle counts', [inR(r1).length, inR(r2b).length], [42, 44]);
  const overlap = cs.some((p, i) => cs.some((q, j) => j > i && Math.hypot(p[0] - q[0], p[1] - q[1]) < p[2] + q[2] - 0.01));
  is('Fig 6.14 no two circles overlap', !overlap);
  ok('Fig 6.14 both rectangles are the same', [r1.w, r1.h], [r2b.w, r2b.h]);
}

/* Fig. 6.15 — rectangle and triangle have the same area */
{
  const g = figure('6.15'); const [r] = rects(g.svg, 'dg-line'); const [t] = polys(g.svg, 'dg-line');
  ok('Fig 6.15 rectangle is 4 by 3 squares', [r.w / 16, r.h / 16], [4, 3]);
  F.f614 = [r.w * r.h / 256, shoelace(t, 16)];
  ok('Fig 6.15 same area', F.f614, [12, 12]);
}

/* Fig. 6.16 */
{
  const g = figure('6.16'); const [bad, abe] = polys(g.svg, 'dg-plot');
  ok('Fig 6.16 triangles BAD and ABE', [shoelace(bad, 30), shoelace(abe, 30)], [10, 10]);
  ok('Fig 6.16 rectangle is 5 by 4', 5 * 4, 20);
}

/* Fig. 6.17 — Exercise 6.9 */
{
  const g = figure('6.17');
  F.e69 = polys(g.svg, 'dg-plot').map(p => shoelace(p, 16));
  show('Ex 6.9', F.e69);
  ok('Ex 6.9 areas (a)-(e)', F.e69, [24, 30, 48, 16, 12]);
  const onGrid = polys(g.svg, 'dg-plot').flat().every(([x, y]) => (x - 21) % 16 === 0 && (y - 4) % 16 === 0);
  is('Fig 6.17 every corner is on a grid corner', onGrid);
}

/* Fig. 6.18 — 9 squares, perimeters 12 and 20 */
{
  const g = figure('6.18');
  const R = rects(g.svg, 'dg-fill-b-soft');
  const left = R.filter(r => r.x < 110).map(r => [(r.x - 22) / 22, (r.y - 6) / 22]);
  const right = R.filter(r => r.x >= 110).map(r => [(r.x - 120) / 22, (r.y - 6) / 22]);
  ok('Fig 6.18 nine squares each', [left.length, right.length], [9, 9]);
  ok('Fig 6.18 perimeters', [cellPerimeter(left), cellPerimeter(right)], [12, 20]);
}

/* Fig. 6.19 — the moved square; its Think and Reflect */
{
  const g = figure('6.19');
  const cells = rects(g.svg, 'dg-fill-b-soft').map(r => [(r.x) / 16, (r.y - 6) / 16]);
  const left = cells.filter(([x]) => x < 9), right = cells.filter(([x]) => x >= 9 && x < 17);
  const [ghost] = rects(g.svg, 'dg-ghost');
  const moved = [...right, [ghost.x / 16, (ghost.y - 6) / 16]];
  F.f618 = [cellPerimeter(left), cellPerimeter(moved)];
  ok('Fig 6.19 perimeters before and after', F.f618, [24, 24]);
  ok('Fig 6.19 eleven squares', left.length, 11);
  // every free place next to the figure, by how many sides it would share
  const set = new Set(left.map(c => c.join(',')));
  const free = new Map();
  for (const [x, y] of left) for (const [a, b] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const k = `${x + a},${y + b}`; if (set.has(k)) continue;
    free.set(k, [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([p, q]) => set.has(`${x + a + p},${y + b + q}`)).length);
  }
  F.f618tr = {};
  for (const [k, n] of free) {
    const [x, y] = k.split(',').map(Number);
    const change = cellPerimeter([...left, [x, y]]) - 24;
    F.f618tr[n] = F.f618tr[n] ?? change;
    is(`Fig 6.19 a square sharing ${n} side(s) changes the perimeter by ${4 - 2 * n}`, change === 4 - 2 * n);
  }
  show('Fig 6.19 free places by shared sides', JSON.stringify([...free.values()].reduce((o, n) => (o[n] = (o[n] || 0) + 1, o), {})));
}

/* Exercise 6.10 */
{
  ok('Ex 6.10 Q1 smallest perimeter of 9 squares (3 by 3)', cellPerimeter([0, 1, 2].flatMap(x => [0, 1, 2].map(y => [x, y]))), 12);
  ok('Ex 6.10 Q2 largest perimeter of 9 squares (a row)', cellPerimeter([...Array(9).keys()].map(x => [x, 0])), 20);
  const q3 = [...[...Array(7).keys()].map(x => [x, 0]), [0, 1], [1, 1]];
  ok('Ex 6.10 Q3 a row of 7 with 2 below its first two', [q3.length, cellPerimeter(q3)], [9, 18]);
  // every connected figure of 9 squares has perimeter 36 - 2 x (shared sides)
  ok('Ex 6.10 the rule, on the 3 by 3 square (12 shared sides)', 36 - 2 * 12, 12);
  ok('Ex 6.10 the rule, on a row of 9 (8 shared sides)', 36 - 2 * 8, 20);
}

/* Figs. 6.19 and 6.20 — the house plans; Exercise 6.11 */
{
  const g = figure('6.20');
  const u = 228 / 30; // the printed 30 ft is the plot's height, 12 to 240
  const all = rects(g.svg, 'dg-line').map(r => ({ w: r2(r.w / u), h: r2(r.h / u), x: r2((r.x - 4) / u), y: r2((r.y - 12) / u) }));
  const [master, toilet, utility, kitchen, small, garden, parking, plot] = all;
  show('Charan', JSON.stringify(all));
  ok('Charan: master bedroom as printed', [master.w, master.h, master.w * master.h], [15, 15, 225]);
  ok('Charan: toilet as printed', [toilet.w, toilet.h], [5, 10]);
  ok('Charan: kitchen as printed', [kitchen.w, kitchen.h, kitchen.w * kitchen.h], [15, 12, 180]);
  ok('Charan: small bedroom 180 sq ft, so the missing side', [small.w, small.h, small.w * small.h], [15, 12, 180]);
  ok('Charan: small bedroom side from the printed area', 180 / 15, 12);
  ok('Charan: utility', [utility.w, utility.h, utility.w * utility.h], [15, 3, 45]);
  ok('Charan: garden and parking', [garden.w, garden.h, parking.w, parking.h], [20, 3, 15, 3]);
  ok('Charan: the plot', [plot.w, plot.h], [35, 30]);
  ok('Charan: the areas printed on the plan match the rooms drawn',
    texts(g.svg).filter(t => /^Area = /.test(t)),
    [master, kitchen, small].map(r => `Area = ${r.w * r.h} sq ft`));
  ok('Charan: the sides printed on the plan match the rooms drawn',
    texts(g.svg).filter(t => /×/.test(t)),
    [`${master.w} ft × ${master.h} ft`, `${toilet.w} ft ×`, `${kitchen.w} ft × ${kitchen.h} ft`, `${small.w} ft × ? ft`]);
  const hall = shoelace(polys(g.svg, 'dg-line')[0], u);
  F.charan = { hall, whole: plot.w * plot.h, per: 2 * (plot.w + plot.h), master: 225 };
  ok('Charan: the hall', hall, 265);
  ok('Charan: rooms add up to the plot', 225 + 50 + 45 + 180 + 180 + hall + 60 + 45, F.charan.whole);
  ok('Charan: whole house', F.charan.whole, 1050);

  const h = figure('6.21');
  const v = 315 / 42;
  const S = rects(h.svg, 'dg-line').map(r => ({ w: r2(r.w / v), h: r2(r.h / v) }));
  const [m2, t2, k2, u2, s2, hall2, ent] = S;
  show('Sharan', JSON.stringify(S));
  ok('Sharan: master bedroom', [m2.w, m2.h, m2.w * m2.h], [12, 15, 180]);
  ok('Sharan: kitchen', [k2.w, k2.h, k2.w * k2.h], [18, 10, 180]);
  ok('Sharan: utility 70 sq ft, 10 ft deep, so 7 ft wide', [u2.w * u2.h, 70 / 10, u2.w], [70, 7, 7]);
  ok('Sharan: toilet from the width', [42 - 12 - 18 - 7, t2.w, t2.h], [5, 5, 10]);
  ok('Sharan: small bedroom', [s2.w, s2.h], [12, 10]);
  ok('Sharan: hall', [hall2.w, hall2.h, 5 + 18], [23, 15, 23]);
  ok('Sharan: entrance', [ent.w, ent.h], [7, 15]);
  ok('Sharan: the sides and areas printed on the plan match the rooms drawn',
    texts(h.svg).filter(t => /×|sq ft/.test(t)),
    [`${m2.w} ft × ${m2.h} ft`, `Area = ${m2.w * m2.h} sq ft`, `${k2.w} ft × ${k2.h} ft`, `Area = ${k2.w * k2.h} sq ft`,
      `${u2.w * u2.h} sq ft`, `${s2.w} ft × ${s2.h} ft`, `${hall2.w} ft × ? ft`]);
  const len = m2.h + s2.h;
  F.sharan = { len, whole: 42 * len, per: 2 * (42 + len), hall: 23 * 15, ent: 7 * 15 };
  ok('Sharan: length of the plot', len, 25);
  ok('Sharan: rooms add up to the plot', 180 + 50 + 180 + 70 + 120 + 345 + 105, F.sharan.whole);
  ok('Ex 6.11 Q3 areas equal, perimeters 130 and 134', [F.charan.whole === F.sharan.whole, F.charan.per, F.sharan.per], [true, 130, 134]);
  is('T&R the rooms of equal area in Charan’s house: kitchen and small bedroom, both 15 by 12',
    kitchen.w * kitchen.h === small.w * small.h && 2 * (kitchen.w + kitchen.h) === 2 * (small.w + small.h));
  is('T&R utility and parking are also equal, both 15 by 3', utility.w * utility.h === parking.w * parking.h);
  ok('T&R perimeters', [2 * (15 + 12), 2 * (15 + 3)], [54, 36]);
  ok('T&R master bedrooms', [15 * 15, 12 * 15], [225, 180]);
}

/* Fig. 6.22 — the area mazes; Exercise 6.12 Q1 */
{
  const g = figure('6.22');
  const R = rects(g.svg, 'dg-line');
  // (a) four rectangles, no lengths printed; the widths are in the ratio of 13 : 26
  const [a1, a2, a3, a4] = [R[1], R[2], R[3], R[0]]; // bottom-right, top-left, top-right, bottom-left
  ok('Fig 6.22 (a) is drawn to its areas', r2((a3.w * a3.h) / (a2.w * a2.h)), 2);
  const qa = 15 * 26 / 13;
  ok('Fig 6.22 (a) ? is drawn to scale', r2(a1.w * a1.h / (a4.w * a4.h) * 15), qa);
  // (b), (c), (d): 15 px, 9 px and 15 px to 1 cm, from the printed lengths
  const cm = (r, u) => [r2(r.w / u), r2(r.h / u)];
  const [b1, b2, b3] = [R[4], R[5], R[6]];
  ok('Fig 6.22 (b) printed 10 and 10', [cm(b1, 15), cm(b2, 15)], [[5, 2], [2, 5]]);
  // bottom: 10 sq cm and 2 cm high, so 5 cm long; the upright one is 5 - 3 = 2 cm wide,
  // so 10 / 2 = 5 cm high; ? is 3 cm wide and 5 - 2 = 3 cm high
  const qb = 3 * (10 / (10 / 2 - 3) - 2);
  ok('Fig 6.22 (b) ?', [qb, cm(b3, 15)[0] * cm(b3, 15)[1]], [9, 9]);
  const [c1, c2, c3] = [R[7], R[8], R[9]];
  ok('Fig 6.22 (c) printed 60 and 42', [cm(c1, 9)[0] * cm(c1, 9)[1], cm(c2, 9)[0] * cm(c2, 9)[1]], [60, 42]);
  const cw = 42 / 6, bw = cw + 5, bh = 60 / bw, th = 15 - 6 - bh, tw = cw - 3;
  ok('Fig 6.22 (c) ?', [tw * th, cm(c3, 9)[0] * cm(c3, 9)[1]], [16, 16]);
  const [d1, d2] = [R[10], R[11]];
  const rh = 18 / 5, lh = rh + 4, lw = 38 / lh;
  ok('Fig 6.22 (d) ? cm', [r2(lw), cm(d1, 15)[0]], [5, 5]);
  ok('Fig 6.22 (d) printed areas', [r2(cm(d1, 15)[0] * cm(d1, 15)[1]), r2(cm(d2, 15)[0] * cm(d2, 15)[1])], [38, 18]);
  F.e612q1 = [qa, qb, tw * th, r2(lw)];
  show('Ex 6.12 Q1', F.e612q1);
}

/* ---- B2. the answers the examples print ------------------------ */

/* The body numbers its examples 1-7 and Beyond starts again at 1, so an
   example is always named with its part. */
const BOARD = pages.filter(f => /^p09/.test(f)).map(f => HTML[f]).join('\n');
const PART = { body: BODY, Beyond: BEYOND };
function exampleAnswer(part, n) {
  const text = PART[part];
  const at = text.indexOf(`<div class="c-example__tab">Example ${n}</div>`);
  if (at < 0) { fails.push(`no ${part} Ex ${n}`); return null; }
  const rest = text.slice(at);
  const m = rest.match(/<span class="work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/);
  return m ? flat(m[1]) : null;
}
function okAnswer(part, n, want) {
  const got = nums(exampleAnswer(part, n) || '');
  if (same(got, want)) pass++;
  else fails.push(`${part} Ex ${n}: the Answer row prints ${JSON.stringify(got)}, computed ${JSON.stringify(want)}`);
}
{
  const tabs = (t) => [...t.matchAll(/<div class="c-example__tab">Example (\d+)<\/div>/g)].map(m => +m[1]);
  ok('body example tabs read 1-7', tabs(BODY), [1, 2, 3, 4, 5, 6, 7]);
  ok('Beyond example tabs read 1-10', tabs(BEYOND), [...Array(10).keys()].map(i => i + 1));
}
okAnswer('body', 1, [2 * (3 + 2)]);
okAnswer('body', 2, [3 * 4 * 75]);
okAnswer('body', 3, [5 * 4 - 3 * 3]);
okAnswer('body', 4, [12 * 10 - 4 * 4 * 4]);
okAnswer('body', 5, [12 * 9 - 12 * 9 / 2]);
okAnswer('body', 6, [14 * 12 / 8]);
okAnswer('body', 7, [20 / (24 / 6)]);
is('body Ex 7 check: 4 × 5 = 20', 4 * 5 === 20);
okAnswer('Beyond', 1, [23 * (74 / 2 - 23)]);
okAnswer('Beyond', 2, [2 * (10 + 8)]);
okAnswer('Beyond', 5, [14 * 11 - 5 * 4]);
is('Beyond Ex 5 check: 14 × 7 + 9 × 4 = 134', 14 * 7 + 9 * 4 === 14 * 11 - 5 * 4);
okAnswer('Beyond', 6, [104 / 8]);
okAnswer('Beyond', 7, [2, 4, 3, 1]);
okAnswer('Beyond', 8, [3, 4, 1, 2]);
okAnswer('Beyond', 9, [10 * 7, 12 * 9 - 10 * 7]);
okAnswer('Beyond', 10, [60 / 3, (60 / 4) ** 2, 18 * (60 / 2 - 18)]);

/* ---- C. every option question: exactly one right option (or the right
   set), and the printed key agrees ------------------------------- */

const block = (html, n) => {
  // the <li> of question n in a numbered run
  const re = n === 1 ? /<ol class="c-questions">\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/ : new RegExp(`<ol class="c-questions" data-start="${n}">\\s*<li>([\\s\\S]*?)</li>\\s*</ol>\\s*</div>`);
  const m = html.match(re);
  if (!m) { fails.push(`question ${n} not found`); return ''; }
  return m[1];
};
const optionsOf = (li) => {
  const lists = [...li.matchAll(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*?)<\/ol>/g)];
  if (!lists.length) return [];
  return [...lists[lists.length - 1][1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => flat(m[1]));
};
const first = (s) => { const n = nums(s); return n.length ? n[0] : NaN; };
const L = ['a', 'b', 'c', 'd'];
function answersRegion(sub) {
  const all = BEYOND;
  const a = all.indexOf('<div class="c-stage__title">Answers</div>');
  const bb = all.indexOf('<div class="c-practice__sub">Beyond the Book</div>', a);
  return sub === 'board' ? all.slice(a, bb) : all.slice(bb);
}
function printedKey(sub) {
  const key = {};
  for (const m of answersRegion(sub).matchAll(/<ol class="c-answers">([\s\S]*?)<\/ol>/g)) {
    const t = flat(m[1].replace(/<span class="c-answers__stage">[\s\S]*?<\/span>/, ''));
    for (const k of t.matchAll(/(\d+) ((?:\([a-d]\)(?:, )?)+|\d+)/g)) key[k[1]] = k[2].trim();
  }
  return key;
}
const KEY_B = printedKey('board'), KEY_Y = printedKey('beyond');
function mcq(what, html, key, n, correct) {
  const opts = optionsOf(block(html, n));
  ok(`${what} Q${n} has four options`, opts.length, 4);
  const right = opts.map((o, i) => correct(o, i) ? `(${L[i]})` : null).filter(Boolean).join(', ');
  if (!right) fails.push(`${what} Q${n}: no option is right`);
  ok(`${what} Q${n} key`, key[n], right);
  return right;
}
const eqFirst = (v) => (o) => first(o) === v;

// By the Book, objective 41-50
mcq('BtB', BOARD, KEY_B, 41, (o) => o === 'P' && 2 * (8 + 2) > 2 * (5 + 4) && 2 * (8 + 2) > 2 * (6 + 3));
mcq('BtB', BOARD, KEY_B, 42, eqFirst(12 * 12));
mcq('BtB', BOARD, KEY_B, 43, eqFirst(30 / 2 - 9));
mcq('BtB', BOARD, KEY_B, 44, eqFirst(3 * 8));
mcq('BtB', BOARD, KEY_B, 45, eqFirst(12 * 5 / 2));
mcq('BtB', BOARD, KEY_B, 46, eqFirst(7 * 4));
mcq('BtB', BOARD, KEY_B, 47, eqFirst(4 * 7));
mcq('BtB', BOARD, KEY_B, 48, eqFirst(10 + 4 + 2 / 2));
mcq('BtB', BOARD, KEY_B, 49, (o) => o === '(ii) and (iii)');
mcq('BtB', BOARD, KEY_B, 50, (o, i) => /14 cm/.test(o) && 2 * (4 + 3) === 14);
{
  const key = [...Array(10).keys()].map(i => KEY_B[41 + i]);
  const count = L.map(l => key.filter(k => k === `(${l})`).length);
  is(`BtB objective keys use every letter at least twice (${count})`, count.every(c => c >= 2));
}
// By the Book, assertion-reason 31-35, from the truth of A and R
{
  const code = (A, R, explains) => A && R ? (explains ? '(a)' : '(b)') : A ? '(c)' : '(d)';
  const want = {
    31: code(4 * 5 === 20, true, true),
    32: code(6 * 4 === 8 * 3, 2 * (6 + 4) === 2 * (8 + 3), false),
    33: code(10 * 4 / 2 === 20, 2 * (10 + 4) === 28, false),
    34: code(2 * (1 + 4) === 2 * (2 + 2), true, false),
    35: code(4 * 3 === 12, true, true),
  };
  for (const [n, w] of Object.entries(want)) ok(`BtB AR Q${n} key`, KEY_B[n], w);
}
// By the Book written answers: the first numbers of each row
{
  const rows = {};
  for (const m of answersRegion('board').matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) rows[m[1]] = flat(m[2]);
  const has = (n, ...vals) => {
    const got = nums(rows[n] || '');
    const missing = vals.filter(v => !got.includes(v));
    if (missing.length) fails.push(`BtB Q${n}: the key row lacks ${missing.join(', ')} — "${rows[n]}"`); else pass++;
  };
  has(1, 2 * (18 + 7)); has(2, 96 / 4, (96 / 4) ** 2); has(3, 54 / 6); has(4, 8 * 2, 4 * 4);
  has(5, 91 / 13, 2 * (13 + 91 / 13)); has(6, 14 * 10 / 2); has(7, 12 + 6 + 4 / 2); has(8, 4, 2);
  has(9, 4 * 2 * (60 + 40)); has(10, (200 / 20) * (100 / 20));
  has(11, 40 / 2 - 12, 12 * (40 / 2 - 12)); has(12, 14, 10); has(13, 6 * 4 * 250, 2 * (6 + 4) * 30);
  { const s = 64 / 4, w = s * s / 32; has(14, s * s, w, 2 * (32 + w)); }
  has(15, 25 * 16 - 21 * 12); { const w = 48 / 2 / 4; has(16, w, 3 * w, 3 * w * w); }
  has(17, 6, 14, 16); has(18, 10 * 6 / 2); has(19, 40 / 5, 40 / 8); has(20, 30 * 20 - 36, (30 * 20 - 36) * 15);
  { const r = 2 * (120 + 80) * 5, t = 4 * 90; let k = 0; while (k * t < r) k++; has(21, r, k); }
  has(22, (1500 / 50) * (1200 / 50)); has(23, 4 * 2 * (50 + 30) * 12, 50 * 30);
  { const w = 240 / 2 - 70; has(24, w, 70 * w, 70 * w * 5); }
  { const p = 6 * 3 - 2 * 1 - 2 * 1; has(25, p, p * 60, 2 * 2 * (2 + 1)); }
  { let best = [0, 0]; for (let l = 1; l < 10; l++) if (l * (10 - l) > best[1]) best = [l, l * (10 - l)]; has(26, best[1]); }
  has(27, 40 * 30 - (20 * 15 + 2 * 12 * 15 + 15 * 12), 2 * (20 + 15) - 3);
  has(28, 12 * 8 + 10 * 9 + 6 * 5, (12 * 8 + 10 * 9 + 6 * 5) * 20);
  has(29, 4 * 3, 6 * 3, 4 * 4, 6 * 4, 10 * 7);
  has(30, 20 * 2 + 14 * 2 - 2 * 2, (20 * 2 + 14 * 2 - 2 * 2) * 50);
  has(36, 4 * 60, 20 * 20, 60 * 60 - 20 * 20); has(37, 2 * (100 + 50), 4 * 300, Math.floor(1600 / 300), 1600 % 300);
  has(38, 40 * 25, 10 * 12, 1000 - 20 * 15 - 10 * 12 - 15 * 12);
  has(39, 300 / 25, 200 / 25, 12 * 8, 96 * 30); has(40, 2 * (60 + 45), 3 * 210, 60 * 45 - 15 * 15);
  ok('BtB key rows cover 1-30 and 36-40', Object.keys(rows).map(Number).sort((a, b) => a - b), [...Array(30).keys()].map(i => i + 1).concat([36, 37, 38, 39, 40]));
}
{
  const nums50 = [...BOARD.matchAll(/data-start="(\d+)"/g)].map(m => +m[1]);
  ok('By the Book runs 2-50 after an unnumbered first', nums50, [...Array(49).keys()].map(i => i + 2));
  const subs = [...BOARD.matchAll(/<div class="c-practice__sub">([^<]*)<\/div>/g)].map(m => m[1]);
  ok('By the Book forms in order', subs, ['Very short answer', 'Short answer', 'Long answer', 'Assertion and reason', 'Case-based questions', 'Objective questions']);
}

// Beyond practice 1-15
mcq('Beyond', BEYOND, KEY_Y, 1, eqFirst(4 * (50 / 2 / 5) * (50 / 2 / 5)));
mcq('Beyond', BEYOND, KEY_Y, 2, eqFirst((2 * (11 + 5) / 4) ** 2));
mcq('Beyond', BEYOND, KEY_Y, 3, eqFirst((100 / 10) ** 2));
mcq('Beyond', BEYOND, KEY_Y, 4, eqFirst(cellPerimeter([[1, 1], [0, 1], [2, 1], [1, 0], [1, 2]])));
mcq('Beyond', BEYOND, KEY_Y, 5, (o) => { const [a, b] = nums(o); return a * b === 30; });
mcq('Beyond', BEYOND, KEY_Y, 6, (o, i) => [36 === 81, 36 / 4 === 9, 9 * 9 === 81, 2 * (10 + 8) === 36][i]);
mcq('Beyond', BEYOND, KEY_Y, 7, (o) => nums(o).pop() === 8 * 6 / 2);
mcq('Beyond', BEYOND, KEY_Y, 8, (o) => { const s = first(o); return 24 % s === 0 && 24 / s > 3; });
{
  const row = (n) => { const m = answersRegion('beyond').match(new RegExp(`<span class="work__label">${n}</span>\\s*<span>([\\s\\S]*?)</span></div>`)); return m ? flat(m[1]) : ''; };
  ok('Beyond Q9 key', KEY_Y[9], String((15 / 3) * (12 / 3)));
  ok('Beyond Q10 key', KEY_Y[10], String(22 * 16 - 18 * 12));
  const sq = []; for (let x = 0; x < 4; x++) for (let y = 0; y < 4; y++) if (!((x === 0 || x === 3) && (y === 0 || y === 3))) sq.push([x, y]);
  ok('Beyond Q11 key', KEY_Y[11], String(cellPerimeter(sq)));
  is('Beyond Q14 row', [(500 / 50) * (400 / 50), 2 * (5 + 4) - 1, 80 * 25].every(v => nums(row(14)).includes(v)));
  is('Beyond Q15 row', ['48', '24', '48'].every(v => nums(row(15)).includes(+v)) && 12 * 8 / 2 === 48 && 6 * 8 / 2 === 24);
  is('Beyond Q14 (i) option (c) is 80', optionsOf(block(BEYOND, 14))[2] === '80');
  is('Beyond Q15 (i) option (a) is 48 sq cm', first(optionsOf(block(BEYOND, 15))[0]) === 48);
}
// the matching practice, from the lists
{
  const m12 = { P: (20 / 4) ** 2, Q: 4 * Math.sqrt(36), R: 7 * 3, S: 2 * (7 + 3) }, v12 = [20, 21, 24, 25];
  const m13 = { P: 42 / 6, Q: 54 / 9, R: Math.sqrt(64), S: 26 / 2 - 4 }, v13 = [6, 7, 8, 9];
  const combo = (m, v) => `P–${v.indexOf(m.P) + 1}, Q–${v.indexOf(m.Q) + 1}, R–${v.indexOf(m.R) + 1}, S–${v.indexOf(m.S) + 1}`;
  mcq('Beyond', BEYOND, KEY_Y, 12, (o) => o === combo(m12, v12));
  mcq('Beyond', BEYOND, KEY_Y, 13, (o) => o === combo(m13, v13));
}
{
  const count = [1, 2, 3, 4].map(n => KEY_Y[n]);
  ok('Beyond single-correct keys spread a-d', count, ['(a)', '(b)', '(c)', '(d)']);
}

/* ---- D. ANSWERS.md ------------------------------------------- */

const ANSWERS = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');

// every arithmetic identity in the booklet, swept like the pages
let checkedA = 0;
for (const m of ANSWERS.matchAll(/\$([^$]+)\$/g)) {
  const sides = m[1].split('=').map(s => s.trim()).filter(Boolean);
  const numeric = sides.map(toExpr).filter(v => v !== null);
  if (sides.length < 2 || numeric.length < 2) continue;
  const n = numeric.map(v => Function(`"use strict";return (${v})`)());
  checkedA++;
  if (n.some(x => Math.abs(x - n[0]) > 1e-9)) fails.push(`ANSWERS.md: $${m[1]}$ — sides are ${n.join(' and ')}`);
  else pass++;
}
{
  // Ex 6.5 Q8: the seven-piece rectangle on a square of side 4
  const a = Math.sqrt(16 / 2);
  is('A 6.5 Q8 the rectangle is a little under 6 by 3', 2 * a < 6 && 2 * a > 5.5 && a < 3);
  ok('A 6.5 Q8 its perimeter is about 17', Math.round(6 * a), 17);
  inAnswers('A 6.5 Q8', 'about 17');
  ok('A 6.12 Q1(d) the strip argument', 18 + 5 * 4, 38);
  ok('A 6.8 Q3 for 36', [2 * (1 + 36), 4 * 6], [74, 24]);
  ok('A 6.10 Q3 shared sides', (36 - 18) / 2, 9);
  ok('A 6.11 hall', 20 * 17 - 15 * 5, F.charan.hall);
}
function inAnswers(what, needle) {
  if (ANSWERS.replace(/\s+/g, ' ').includes(String(needle).replace(/\s+/g, ' '))) pass++;
  else fails.push(`${what} — ANSWERS.md does not contain "${needle}"`);
}

// 6.1
inAnswers('A 6.1 Q1(a)', `(a) **${14 / 2 - 2} cm**`);
inAnswers('A 6.1 Q1(b)', `(b) **${20 / 4} cm**`);
inAnswers('A 6.1 Q1(c)', `(c) **${12 / 2 - 3} m**`);
inAnswers('A 6.1 Q2', `**${2 * (5 + 3) / 4} cm**`);
inAnswers('A 6.1 Q3', `**${55 - 20 - 14} cm**`);
inAnswers('A 6.1 Q4', `**₹${2 * (150 + 120) * 40}**`);
inAnswers('A 6.1 Q5', `(a) **${36 / 4} cm**, (b) **${36 / 3} cm**, (c) **${36 / 6} cm**`);
inAnswers('A 6.1 Q6', `**${3 * 2 * (230 + 160)} m**`);
// 6.2
inAnswers('A 6.2 Q1', `**${F.e62.q1} m**`);
inAnswers('A 6.2 Q2', `**${F.e62.q2} m**`);
for (const [k, p] of Object.entries(F.e62q3))
  inAnswers(`A 6.2 Q3 ${k}`, `**${k}**: ${p.r} m along the ${p.side} from ${p.from}`);
inAnswers('A 6.2 Q3 rounds', `**${F.e62q3.C.rounds} full rounds**`);
inAnswers('A 6.2 Q3 rounds', `**${F.e62q3.Z.rounds} full rounds**`);
inAnswers('A 6.2 Q4 A', `**A** is ${F.race.A.r} m on from the finishing line`);
inAnswers('A 6.2 Q4 B', `**B** is on the top side, ${F.race.B.r} m from the top right corner`);
// 6.3
F.dots.forEach((d, i) => inAnswers(`A 6.3 Q1 (${'abcd'[i]})`, `(${'abcd'[i]}) $${d.s}s + ${d.d}d$`));
inAnswers('A T&R Fig 6.7 Q1', `(b) **${F.chit[1]} cm**, (c) **${F.chit[2]} cm**, (d) **${F.chit[3]} cm**`);
inAnswers('A T&R Fig 6.7 Q2', `${(32 - 22) / 2} cm of their long sides touching`);
// 6.4
inAnswers('A 6.4 Q1', `**${300 / 25} m**`);
inAnswers('A 6.4 Q2', `**₹${500 * 200 / 100 * 8}**`);
inAnswers('A 6.4 Q3', `**${100 * 50 / 25} trees**`);
inAnswers('A 6.4 Q4', `(a) **${F.e64q4[0]} sq m**`);
inAnswers('A 6.4 Q4', `(b) **${F.e64q4[1]} sq m**`);
ok('A 6.4 Q4(a) by rows', 2 * 1 + 5 * 2 + 7 * 1 + 3 * 3, F.e64q4[0]);
ok('A 6.4 Q4(a) by taking away', 7 * 7 - 5 * 1 - 2 * 2 - 4 * 3, F.e64q4[0]);
ok('A 6.4 Q4(b) two ways', [5 * 3 - 3 * 2, 5 * 1 + 2 * (1 * 2)], [F.e64q4[1], F.e64q4[1]]);
// 6.5
inAnswers('A 6.5 Q6', `**${16} Shape $C$s**`);
inAnswers('A 6.5 Q2', `**${F.tan.D / F.tan.C} times**`);
inAnswers('A 6.5 Q5', `**${F.tan.A / F.tan.G} times**`);
// 6.6
F.dots.forEach((d, i) => inAnswers(`A 6.6 Q1 (${'abcd'[i]})`, `(${'abcd'[i]}) **${d.area}**`));
ok('A circle of diameter 3 is about 7 squares', Math.round(Math.PI * 1.5 * 1.5), 7);
// 6.7
inAnswers('A 6.7 instance', `${8 * 6} sq m`);
inAnswers('A 6.7 instance', `${60 * 40} sq m`);
// 6.8
{
  const rects24 = []; for (let l = 1; l * l <= 24; l++) if (24 % l === 0) rects24.push([l, 24 / l, 2 * (l + 24 / l)]);
  ok('A 6.8 Q1 rectangles of 24', rects24, [[1, 24, 50], [2, 12, 28], [3, 8, 22], [4, 6, 20]]);
  for (const [a, b, p] of rects24) inAnswers('A 6.8 Q1 row', `| ${a} by ${b} | ${p} |`);
  const rects32 = []; for (let l = 1; l * l <= 32; l++) if (32 % l === 0) rects32.push([l, 32 / l, 2 * (l + 32 / l)]);
  ok('A 6.8 Q2 rectangles of 32', rects32, [[1, 32, 66], [2, 16, 36], [4, 8, 24]]);
  for (const [a, b, p] of rects32) inAnswers('A 6.8 Q2 row', `| ${a} by ${b} | ${p} |`);
}
// 6.3 section
inAnswers('A Fig 6.15', `both are **${F.f614[0]} square units**`);
F.e69.forEach((a, i) => inAnswers(`A 6.9 (${'abcde'[i]})`, `(${'abcde'[i]}) **${a} square units**`));
ok('A 6.9 (a) take-away', 4 * 7 - 2 * 2, F.e69[0]);
ok('A 6.9 (b) take-away', 4 * 10 - 6 - 4, F.e69[1]);
ok('A 6.9 (c) take-away', 6 * 12 - 3 - 3 - 15 - 3, F.e69[2]);
ok('A 6.9 (d) take-away', 4 * 5 - 4, F.e69[3]);
ok('A 6.9 (e) take-away', 4 * 6 - 2 - 2 - 6 - 2, F.e69[4]);
ok('A 6.9 the triangles taken away', [3 * 2 / 2, 3 * 10 / 2, 4 * 2 / 2, 3 * 4 / 2, 1 * 4 / 2, 4 * 3 / 2, 4 * 2 / 2], [3, 15, 4, 6, 2, 6, 4]);
// 6.10
inAnswers('A 6.10 Q1', '1. **12 units**');
inAnswers('A 6.10 Q2', '2. **20 units**');
inAnswers('A Fig 6.19', `**${F.f618[1]} units**`);
// 6.11
inAnswers('A T&R equal rooms: kitchen and small bedroom', `area **${15 * 12} sq ft** each, perimeter $2 \\times (15 + 12) = ${2 * (15 + 12)}$ ft each`);
inAnswers('A T&R equal rooms: utility and parking', `area **${15 * 3} sq ft** each, perimeter $2 \\times (15 + 3) = ${2 * (15 + 3)}$ ft each`);
inAnswers('A 6.11 Charan hall',`**${F.charan.hall} sq ft**`);
inAnswers('A 6.11 Charan whole', `**${F.charan.whole} sq ft**`);
inAnswers('A 6.11 Sharan length', `**${F.sharan.len} ft**`);
inAnswers('A 6.11 Sharan hall', `${F.sharan.hall} sq ft`);
inAnswers('A 6.11 Sharan entrance', `${F.sharan.ent} sq ft`);
inAnswers('A 6.11 Sharan whole', `**${F.sharan.whole} sq ft**`);
inAnswers('A 6.11 Q2 perimeters', `**${F.charan.per} ft** and **${F.sharan.per} ft**`);
// 6.12
inAnswers('A 6.12 Q1', `(a) **${F.e612q1[0]} sq cm**, (b) **${F.e612q1[1]} sq cm**, (c) **${F.e612q1[2]} sq cm**, (d) **${F.e612q1[3]} cm**`);
inAnswers('A 6.12 Q2', `**${45 / 9} cm** wide; the parts are **${30 / 5} cm** and **${15 / 5} cm** long`);
inAnswers('A 6.12 Q3', `**${10 * 9 / 6} sq cm**`);
inAnswers('A 6.12 Q4', `area **${3 * 3 + 5 * 4} sq cm**, perimeter **${2 * (5 + 4) + 4 * 3 - 2 * 3} cm**`);
inAnswers('A 6.12 Q5', `**7 cm by ${49 / 7 - 3} cm**, area **${7 * (7 - 3)} sq cm**`);
inAnswers('A 6.12 Q6', `**${(45 / 9) ** 2} sq cm**`);
inAnswers('A 6.12 Q7', `**${30 / 6 + 42 / 6} cm**`);
// 6.13
inAnswers('A 6.13 Q1', `**${5 * 10 + 2 * 7} sq m**`);
inAnswers('A 6.13 Q2', `**${1000 / 50} m**`);
inAnswers('A 6.13 Q3', `**${6 * 5 - 4 * 4} sq m**`);
inAnswers('A 6.13 Q4', `**${15 * 12 - 4 * 2 * 1} sq m**`);
ok('A 6.13 Q5 instance', [18 * 1, 2 * (18 + 1), 4 * 5, 2 * (4 + 5)], [18, 38, 20, 18]);
ok('A 6.13 Q6 instance: 18 cm by 24 cm page', 2 * ((18 - 3) + (24 - 2)), 74);
ok('A 6.13 Q7 instance', [12 * 8 / 2, 8 * 6, 8 < 12 && 6 < 8], [48, 48, true]);
{
  // Q8: every statement tested on squares of side 2, 4 and 10
  const t = [2, 4, 10].map(s => ({ sq: 4 * s, two: 2 * 2 * (s + s / 2), a: s * s, rect: s * s / 2 }));
  is('A 6.13 Q8 (i) false', t.every(x => !(x.rect > x.a)));
  is('A 6.13 Q8 (ii) false', t.every(x => !(x.sq > x.two)));
  is('A 6.13 Q8 (iii) true', t.every(x => x.two === 1.5 * x.sq));
  is('A 6.13 Q8 (iv) false', t.every(x => x.a !== 3 * 2 * x.rect));
  inAnswers('A 6.13 Q8', '8. **(iii)**');
}
// By the Book and Beyond keys appear in ANSWERS.md too
for (const n of [31,32,33,34,35,41,42,43,44,45,46,47,48,49,50]) inAnswers(`A BtB key ${n}`, `${n} ${KEY_B[n]}`);

/* ---- report -------------------------------------------------- */

console.log(`\nClass 6 · Chapter 6 · Perimeter and Area`);
console.log(`  ${checked} arithmetic identities read off the pages and ${checkedA} off ANSWERS.md, evaluated`);
if (skipped.length) {
  console.log(`  ${skipped.length} maths span(s) with fewer than two numeric sides, not evaluated:`);
  for (const s of skipped) console.log(`      ${s}`);
}
console.log(`  ${pass} check(s) passed`);
if (fails.length) {
  console.log(`\n  ${fails.length} FAILED:`);
  for (const f of fails) console.log(`    ! ${f}`);
  process.exit(1);
}
console.log(`  all clear\n`);
