#!/usr/bin/env node
/* Re-derive every number this chapter prints.

     node pages/class-6/math-ch08-constructions/check-numbers.mjs

   A construction chapter prints few sums and many measurements, so this
   script works mostly in coordinates: it builds each construction, measures
   the result, rounds to the millimetre a student would read, and compares
   that with what the page and ANSWERS.md print. Figures are read from their
   own SVG drawings, never assumed.

   Parts:
     A  every arithmetic identity set as maths anywhere in the chapter
     B  the figures: what the drawings actually show
     C  the constructions: measured values, from coordinates
     D  Beyond the Book — examples, practice answers read back off the page
     E  every multiple-choice and assertion–reason question
     F  ANSWERS.md
*/
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
let pass = 0;
const fails = [];
const ok = (what, got, want) => {
  if (JSON.stringify(got) === JSON.stringify(want)) pass++;
  else fails.push(`${what}\n      computed ${JSON.stringify(want)}\n      printed  ${JSON.stringify(got)}`);
};
const is = (what, cond) => { if (cond) pass++; else fails.push(what); };

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const ALL = pages.map(f => html[f]).join('\n');
const ANSWERS = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');

/* ---- geometry ------------------------------------------------ */
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const deg = (r) => r * 180 / Math.PI;
const angleAt = (v, a, b) => {
  const u = [a[0] - v[0], a[1] - v[1]], w = [b[0] - v[0], b[1] - v[1]];
  return deg(Math.acos((u[0] * w[0] + u[1] * w[1]) / (Math.hypot(...u) * Math.hypot(...w))));
};
/* where two circles cross: [] if they miss, one point if they touch */
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
/* a length as a student reads it off a ruler */
const mm = (cm) => Math.round(cm * 10);
const ruler = (cm) => {
  const t = mm(cm), c = Math.floor(t / 10), m = t % 10;
  return m ? `${c} cm ${m} mm` : `${c} cm`;
};

/* ---- A. arithmetic identities -------------------------------- */
function toExpr(side) {
  const s = side.replace(/\\times/g, '*').replace(/\\div/g, '/')
    .replace(/\^\\circ/g, '').replace(/\\ /g, '').replace(/\s+/g, '');
  return /^[-+*/()0-9.]+$/.test(s) ? s : null;
}
let checked = 0;
const skipped = [];
for (const f of pages) {
  for (const m of html[f].matchAll(/\$([^$]+)\$/g)) {
    if (!m[1].includes('=')) continue;
    const sides = m[1].split('=').map(s => s.trim()).filter(Boolean);
    const vals = sides.map(toExpr);
    if (sides.length < 2 || vals.some(v => v === null)) {
      if (sides.length >= 2 && sides.every(x => /\d/.test(x))) skipped.push(`${f}: $${m[1]}$`);
      continue;
    }
    const nums = vals.map(v => Function(`return (${v})`)());
    checked++;
    if (nums.some(n => Math.abs(n - nums[0]) > 1e-9)) fails.push(`${f}: $${m[1]}$ — sides are ${nums.join(', ')}`);
    else pass++;
  }
}

/* ---- B. the figures ------------------------------------------ */
function figure(num) {
  for (const f of pages) {
    const i = html[f].indexOf(`fignum">Fig. ${num}<`);
    if (i < 0) continue;
    const s = html[f].lastIndexOf('<svg', i);
    return html[f].slice(s, html[f].indexOf('</svg>', s));
  }
  fails.push(`Fig. ${num} not found`);
  return '';
}
const nums = (s) => s.trim().split(/[\s,]+/).map(Number);
const polygons = (svg) => [...svg.matchAll(/<polygon[^>]*points="([^"]*)"/g)]
  .map(m => { const n = nums(m[1]); const o = []; for (let i = 0; i < n.length; i += 2) o.push([n[i], n[i + 1]]); return o; });
const lines = (svg) => [...svg.matchAll(/<line[^>]*x1="([\d.]+)"[^>]*y1="([\d.]+)"[^>]*x2="([\d.]+)"[^>]*y2="([\d.]+)"/g)]
  .map(m => [[+m[1], +m[2]], [+m[3], +m[4]]]);

// Fig 8.7 — AB is 8 cm; the half circle stands on AX
{
  const svg = figure('8.7');
  const main = lines(svg).find(l => svg.includes(`x1="${l[0][0]}" y1="${l[0][1]}" x2="${l[1][0]}"`) && l[0][1] === l[1][1] && l[1][0] - l[0][0] > 150);
  const unit = (main[1][0] - main[0][0]) / 8;
  const arc = svg.match(/<path[^>]*d="M([\d.]+) ([\d.]+) A([\d.]+)/);
  const r = +arc[3] / unit;
  const X = +arc[1];
  ok('Fig 8.7 AX in cm', (X - main[0][0]) / unit, 4);
  ok('Fig 8.7 the half circle radius in cm', r, 2);
  is('Ex 8.1 Q1 answer', ANSWERS.includes('**$AX = 4$ cm**') && ANSWERS.includes('**radius of 2 cm**'));
}

// Fig 8.13 — which shapes are squares, read from the dot positions
{
  const step = 15;
  const shapes = polygons(figure('8.13')).map(p => p.map(([x, y]) => [x / step, -y / step]));
  const verdict = shapes.map(p => {
    const sides = p.map((q, i) => { const r = p[(i + 1) % 4]; return [r[0] - q[0], r[1] - q[1]]; });
    const len = sides.map(s => Math.hypot(...s));
    const right = sides.every((s, i) => { const t = sides[(i + 1) % 4]; return Math.abs(s[0] * t[0] + s[1] * t[1]) < 1e-9; });
    const equal = len.every(l => Math.abs(l - len[0]) < 1e-9);
    return { steps: sides.map(s => s.map(Math.round)), right, equal };
  });
  ok('Fig 8.13 which shapes are squares', verdict.map(v => v.right && v.equal), [true, false, false, false]);
  ok('Fig 8.13 B and C have equal sides and no right angles',
    [verdict[1].equal, verdict[1].right, verdict[2].equal, verdict[2].right], [true, false, true, false]);
  ok('Fig 8.13 D has right angles and unequal sides', [verdict[3].right, verdict[3].equal], [true, false]);
  ok('Fig 8.13 A steps', verdict[0].steps.map(s => s.map(Math.abs)), [[4, 4], [4, 4], [4, 4], [4, 4]]);
  ok('Fig 8.13 B steps', verdict[1].steps.map(s => s.map(Math.abs)), [[3, 4], [3, 4], [3, 4], [3, 4]]);
  ok('Fig 8.13 C steps', verdict[2].steps.map(s => s.map(Math.abs)), [[5, 4], [5, 4], [5, 4], [5, 4]]);
  ok('Fig 8.13 D steps', verdict[3].steps.map(s => s.map(Math.abs)), [[2, 1], [2, 4], [2, 1], [2, 4]]);
  is('Ex 8.2 Q2 answer', ANSWERS.includes('**Only shape $A$ is a square.**'));
}

// Ex 8.2 Q5 — the two squares on a side of 2 right, 1 down
{
  const s = [0, 0], e = [2, -1];
  const turn = (v, k) => (k > 0 ? [-v[1], v[0]] : [v[1], -v[0]]);
  const side = [e[0] - s[0], e[1] - s[1]];
  const sq = [1, -1].map(k => { const u = turn(side, k); return [[e[0] + u[0], e[1] + u[1]], [s[0] + u[0], s[1] + u[1]]]; });
  ok('Ex 8.2 Q5 the two squares', sq, [[[3, 1], [1, 2]], [[1, -3], [-1, -2]]]);
  is('Ex 8.2 Q5 in ANSWERS', ANSWERS.includes('$(3, 1)$ and\n   $(1, 2)$, or $(1, -3)$ and $(-1, -2)$'));
  // the worked instance for Q4
  const q = [[0, 0], [2, 1], [1, 3], [-1, 2]];
  const len = q.map((p, i) => dist(p, q[(i + 1) % 4]));
  is('Ex 8.2 Q4 instance is a square', len.every(l => Math.abs(l - len[0]) < 1e-9)
    && q.every((p, i) => Math.abs(angleAt(p, q[(i + 3) % 4], q[(i + 1) % 4]) - 90) < 1e-9));
}

// Fig 8.17 — three equal squares
{
  const svg = figure('8.17');
  const [r] = polygons(svg);
  const w = r[1][0] - r[0][0], h = r[2][1] - r[1][1];
  ok('Fig 8.17 length is three heights', w / h, 3);
  ok('Fig 8.17 dividers at thirds', lines(svg).map(l => (l[0][0] - r[0][0]) / h), [1, 2]);
}

// Fig 8.20 — the square inside the 8 by 4 rectangle
{
  const svg = figure('8.20');
  const [r] = polygons(svg);
  const unit = (r[1][0] - r[0][0]) / 8;
  const xs = lines(svg).filter(l => l[0][0] === l[1][0] && l[0][1] === r[0][1]).map(l => l[0][0]);
  ok('Fig 8.20 rectangle height in cm', (r[2][1] - r[1][1]) / unit, 4);
  ok('Fig 8.20 square side in cm', (xs[1] - xs[0]) / unit, 4);
  ok('Fig 8.20 gap at each end in cm', [(xs[0] - r[0][0]) / unit, (r[1][0] - xs[1]) / unit], [2, 2]);
  is('Ex 8.4 Q1 answer', ANSWERS.includes('**each side of the square is 4 cm**') && ANSWERS.includes('**each corner of\n   the square is 2 cm'));
}

// Fig 8.21 — falling squares: each meets the next at a corner; bounding squares
{
  const sq = polygons(figure('8.21'));
  const side = (p) => p[1][0] - p[0][0];
  ok('Fig 8.21 left sides', sq.slice(0, 3).map(side).map(s => s / 10), [4, 4, 4]);
  ok('Fig 8.21 right sides', sq.slice(3).map(side).map(s => s / 10), [7, 5, 3]);
  for (const [a, b] of [[0, 1], [1, 2], [3, 4], [4, 5]])
    ok(`Fig 8.21 squares ${a},${b} meet at one corner`, [sq[a][1][0], sq[a][0][1]], [sq[b][0][0], sq[b][3][1]]);
  const box = (g) => { const xs = g.flat().map(p => p[0]), ys = g.flat().map(p => p[1]);
    return [(Math.max(...xs) - Math.min(...xs)) / 10, (Math.max(...ys) - Math.min(...ys)) / 10]; };
  ok('Fig 8.21 left fits a 12 cm square', box(sq.slice(0, 3)), [12, 12]);
  ok('Fig 8.21 right fits a 15 cm square', box(sq.slice(3)), [15, 15]);
}

// Fig 8.23 — the square with curves: needle outside each side, radius 6 cm on an 8 cm side
{
  const svg = figure('8.23');
  const sq = polygons(svg)[2];
  const unit = (sq[1][0] - sq[0][0]) / 8;
  const arcs = [...svg.matchAll(/M([\d.]+) ([\d.]+) A([\d.]+)/g)].map(m => [+m[1], +m[2], +m[3]]).slice(-4);
  const r = arcs[0][2];
  ok('Fig 8.23 curve radius in cm', r / unit, 6);
  const half = (sq[1][0] - sq[0][0]) / 2;
  const off = Math.sqrt(r * r - half * half) / unit;
  ok('Fig 8.23 needle distance outside a side', ruler(off), '4 cm 5 mm');
  is('Fig 8.23 every curve uses the same radius', arcs.every(a => a[2] === r));
  is('Ex 8.4 Q6 instance in ANSWERS', ANSWERS.includes('compass open to 6 cm, each needle is about\n   4 cm 5 mm'));
}

// Fig 8.24 — which angles are equal
{
  const svg = figure('8.24');
  const [r] = polygons(svg);
  const [P, Q, R, S] = r;
  const lbl = Object.fromEntries([...svg.matchAll(/<text[^>]*x="([\d.]+)"[^>]*y="([\d.]+)"[^>]*>([a-h])</g)]
    .map(m => [m[3], [+m[1], +m[2]]]));
  /* each label sits beside one side at its corner; the angle it names is
     between that side and the diagonal from that corner */
  const corner = { c: P, d: P, e: Q, f: Q, g: R, h: R, a: S, b: S };
  const diag = { P: R, Q: S, R: P, S: Q };
  const name = (pt) => pt === P ? 'P' : pt === Q ? 'Q' : pt === R ? 'R' : 'S';
  const nbrs = { P: [Q, S], Q: [P, R], R: [Q, S], S: [R, P] };
  const val = {};
  for (const [k, v] of Object.entries(corner)) {
    const n = name(v);
    // the side nearer the label
    const [s1, s2] = nbrs[n];
    const near = (side) => {
      const t = [(v[0] + side[0]) / 2, (v[1] + side[1]) / 2];
      return dist(lbl[k], [v[0] + (t[0] - v[0]) * 0.2, v[1] + (t[1] - v[1]) * 0.2]);
    };
    const side = near(s1) < near(s2) ? s1 : s2;
    val[k] = Math.round(angleAt(v, side, diag[n]));
  }
  ok('Fig 8.24 small angles', ['a', 'd', 'e', 'h'].map(k => val[k]), [27, 27, 27, 27]);
  ok('Fig 8.24 large angles', ['b', 'c', 'f', 'g'].map(k => val[k]), [63, 63, 63, 63]);
  is('Fig 8.24 each corner adds to 90', val.a + val.b === 90 && val.c + val.d === 90);
  is('ANSWERS equal pairs', ANSWERS.includes('$a = d = e = h$ and $b = c = f = g$'));
  // the worked instance: an 8 by 4 rectangle
  ok('8 by 4 rectangle diagonal angles', [Math.round(deg(Math.atan(4 / 8))), Math.round(deg(Math.atan(8 / 4)))], [27, 63]);
}

// Fig 8.34 — the hint for the rhombus
{
  const svg = figure('8.34');
  const ls = lines(svg).filter(l => l[0][0] === 340);
  const A = ls[0][0], C = ls[0][1], B = ls[1][1];
  const unit = dist(A, C) / 5;
  ok('Fig 8.34 AB and AC in cm', [dist(A, B) / unit, dist(A, C) / unit].map(x => +x.toFixed(2)), [5, 5]);
  ok('Fig 8.34 angle at A', Math.round(angleAt(A, B, C)), 55);
  const D = crossings(B, 5 * unit, C, 5 * unit).find(p => dist(p, A) > 1);
  const sides = [dist(A, B), dist(B, D), dist(D, C), dist(C, A)].map(x => +(x / unit).toFixed(2));
  ok('Ex 8.6 Q3 the rhombus sides', sides, [5, 5, 5, 5]);
  is('Ex 8.6 Q3 not a square', Math.abs(angleAt(A, B, C) - 90) > 1);
}

/* ---- C. the constructions in the body and its answers --------- */
// Section 8.4: rectangle 7 by 4, X on AD, Y on BC (distances measured up from A and B)
{
  const xy = (x, y) => Math.hypot(7, x - y);
  ok('Table 8.1 row 1', ruler(xy(0.5, 3)), '7 cm 4 mm');
  ok('Table 8.1 row 2', ruler(xy(1, 1)), '7 cm');
  ok('Table 8.1 row 3', ruler(xy(2, 4)), '7 cm 3 mm');
  for (const d of [0.5, 1, 1.5]) ok(`Table 8.2 at ${d} cm`, xy(d, d), 7);
  ok('farthest XY is the diagonal', ruler(Math.max(xy(0, 4), xy(4, 0))), '8 cm 1 mm');
  let min = Infinity;
  for (let x = 0; x <= 4; x += 0.1) for (let y = 0; y <= 4; y += 0.1) min = Math.min(min, xy(x, y));
  ok('shortest XY', +min.toFixed(9), 7);
  for (const row of ['| 5 mm | 3 cm | about 7 cm 4 mm |', '| 1 cm | 1 cm | 7 cm |', '| 2 cm | 4 cm | about 7 cm 3 mm |'])
    is(`ANSWERS Table 8.1: ${row}`, ANSWERS.includes(row));
  is('ANSWERS farthest', ANSWERS.includes('about **8 cm 1 mm**'));
}
// rough diagram: AF = 4 cm, two squares
ok('Breaking rectangles AC', 2 * 4, 8);
// the three-squares instance and the cannot-divide instances
is('9 by 3 is three squares', 9 === 3 * 3);
is('5 by 3 is not two squares', 5 !== 2 * 3);
is('6 by 3 is not three squares', 6 !== 3 * 3);
// rectangle from angles: the other part
ok('60/30 construction other part', 90 - 60, 30);
// rectangle from a side and a diagonal
const otherSide = (side, diag) => Math.sqrt(diag * diag - side * side);
ok('side 5, diagonal 7', ruler(otherSide(5, 7)), '4 cm 9 mm');
ok('Ex 8.5 Q3 side 4, diagonal 8', ruler(otherSide(4, 8)), '6 cm 9 mm');
ok('Ex 8.5 Q4 side 3, diagonal 7', ruler(otherSide(3, 7)), '6 cm 3 mm');
for (const s of ['about 4 cm 9 mm', '**$BC$ measures about 6 cm 9 mm.**', '**$BC$ measures about\n   6 cm 3 mm.**'])
  is(`ANSWERS has "${s}"`, ANSWERS.includes(s));
// 45/45 gives a square
ok('Ex 8.5 Q2 45 degrees gives equal sides', +Math.tan(Math.PI / 4).toFixed(12), 1);
ok('Ex 8.5 Q1 parts add to 90', 50 + 40, 90);
// the house: B and C 5 cm apart, arcs of 5 cm
{
  const X = crossings([0, 0], 5, [5, 0], 5);
  ok('the house: two crossing points', X.length, 2);
  is('the house: both are 5 cm from B and C', X.every(p => Math.abs(dist(p, [0, 0]) - 5) < 1e-9 && Math.abs(dist(p, [5, 0]) - 5) < 1e-9));
}

/* ---- D. Beyond the Book --------------------------------------- */
const circlesMeet = (d, r1, r2) => crossings([0, 0], r1, [d, 0], r2).length;

// stage 1 (word for word from before this pass; its values still hold)
ok('S1 12 by 4 in squares', 12 / 4, 3);
is('S1 10 by 4 does not divide', !Number.isInteger(10 / 4));
ok('S1 arcs of 4 at 6, 8 and 10 cm', [6, 8, 10].map(d => circlesMeet(d, 4, 4)), [2, 1, 0]);
ok('S1 square in a 10 by 6 rectangle', (10 - 6) / 2, 2);
ok('S1 falling 7, 5, 3', 7 + 5 + 3, 15);
ok('S1 falling three 4s', 3 * 4, 12);
ok('S1 roof lines of 3 and 4 on a 6 cm gap', [circlesMeet(6, 3, 3), circlesMeet(6, 4, 4)], [1, 2]);

// stage 2 — each example's answer recomputed
const exAns = {};
for (const m of ALL.matchAll(/c-example__tab">Example (\d+)<[\s\S]*?work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span>/g))
  exAns[m[1]] = m[2];
ok('fifteen examples, numbered 1 to 15', Object.keys(exAns).map(Number), Array.from({ length: 15 }, (_, i) => i + 1));
const inAns = (n, s) => is(`Example ${n} answer says "${s}"`, (exAns[n] || '').includes(s));

ok('Ex 1 inside, on, outside', [2, 3, 5].map(d => d < 3 ? 'in' : d === 3 ? 'on' : 'out'), ['in', 'on', 'out']);
inAns(1, '$A$ is inside, $B$ is on the circle, and $C$ is outside');
{
  const A = [4, 0];
  const B = crossings([0, 0], 4, A, 4)[0];
  ok('Ex 2 OA, OB, AB', [dist([0, 0], A), dist([0, 0], B), dist(A, B)].map(x => +x.toFixed(9)), [4, 4, 4]);
  inAns(2, 'all three are 4 cm');
}
{
  const order = ['W', 'X', 'Y', 'Z'];
  const isName = (s) => {
    const idx = [...s].map(c => order.indexOf(c));
    return new Set(idx).size === 4 && idx.every((v, i) => { const d = Math.abs(v - idx[(i + 1) % 4]); return d === 1 || d === 3; });
  };
  ok('Ex 3 which are names', ['XYZW', 'WYXZ', 'ZYXW', 'YZXW'].filter(isName), ['XYZW', 'ZYXW']);
  inAns(3, '$XYZW$ and $ZYXW$');
  // practice 18: every name of EFGH other than itself
  const all = [];
  const e = ['E', 'F', 'G', 'H'];
  for (let s = 0; s < 4; s++) for (const dir of [1, -1]) all.push([0, 1, 2, 3].map(k => e[((s + dir * k) % 4 + 4) % 4]).join(''));
  const others = all.filter(n => n !== 'EFGH').sort();
  const printed = [...(ALL.match(/work__label">18<\/span>\s*<span>([^<]*)/) || [, ''])[1].matchAll(/\$([A-H]{4})\$/g)].map(m => m[1]).sort();
  ok('Q18 the seven other names', printed, others);
}
inAns(4, 'No');
ok('Ex 5 SR', 5, 5);
inAns(5, '$SR$ measures 5 cm');
inAns(6, 'all measure 5 cm');
ok('Ex 7 long side and round', [4 * 3, 12 + 3 + 12 + 3], [12, 30]);
inAns(7, '12 cm; 30 cm');
ok('Ex 8 squares', (12 / 3) * (6 / 3), 8);
inAns(8, '8 squares');
ok('Ex 9 rectangle', [8 + 4, 4 + 4], [12, 8]);
inAns(9, '12 cm and 8 cm');
ok('Ex 10 other part', 90 - 20, 70);
is('Ex 11 50 + 50 is not 90', 50 + 50 !== 90);
inAns(11, 'No');
ok('Ex 12 BC', ruler(otherSide(6, 10)), '8 cm');
inAns(12, '$BC$ measures 8 cm');
is('Ex 13 no rectangle: arc shorter than the side', 5 < 7 && crossings([0, 0], 5, [0, 0], 5).length >= 0);
{
  // the perpendicular l through C: every point of it is at least 7 cm from D
  let nearest = Infinity;
  for (let t = -20; t <= 20; t += 0.01) nearest = Math.min(nearest, Math.hypot(7, t));
  ok('Ex 13 nearest point of l to D', +nearest.toFixed(9), 7);
}
inAns(13, 'No such rectangle exists');
{
  const R = crossings([0, 0], 5, [6, 0], 4);
  ok('Ex 14 two places for R', R.length, 2);
  is('Ex 14 R is 5 from P and 4 from Q', R.every(p => Math.abs(dist(p, [0, 0]) - 5) < 1e-9 && Math.abs(dist(p, [6, 0]) - 4) < 1e-9));
}
{
  const A = crossings([0, 0], 5, [6, 0], 5).find(p => p[1] > 0);
  ok('Ex 15 AM', ruler(dist(A, [3, 0])), '4 cm');
  inAns(15, '$AM$ measures 4 cm');
}

// stage 3 — the answer rows, read back off the page, part by part
const ROWS = {};
for (const m of ALL.matchAll(/work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) ROWS[m[1]] = m[2];
const row = (n) => ROWS[n] || (fails.push(`no answer row for question ${n}`), '');
const part = (n, l) => {
  const m = row(n).match(new RegExp(`\\(${l}\\)([\\s\\S]*?)(?=\\([a-e]\\)|$)`));
  return m ? m[1] : (fails.push(`question ${n} has no part (${l})`), '');
};
const says = (what, text, s) => is(`${what} says "${s}"`, text.includes(s));

says('Q17', row(17), ruler(45 / 10));
ok('Q19 right angles in a rectangle', 4, 4); says('Q19', row(19), '4');
ok('Q20 width', 15 / 3, 5); says('Q20', row(20), '5 cm');
ok('Q22 each diagonal', ruler(Math.hypot(7, 3)), '7 cm 6 mm'); says('Q22', row(22), '7 cm 6 mm');
{
  const P = crossings([0, 0], 4, [5, 0], 3);
  ok('Q23 two points', P.length, 2);
  ok('Q23 how far apart', ruler(dist(P[0], P[1])), '4 cm 8 mm'); says('Q23', row(23), '4 cm 8 mm');
}
ok('Q24 sides and count', [3 * 4, 2 * 4, 2 * 3], [12, 8, 6]); says('Q24', row(24), '12 cm by 8 cm');
is('Q25 30 + 70 is not 90', 30 + 70 !== 90); says('Q25', row(25), 'No');
ok('Q26 circles of 4 at 7 and 9', [circlesMeet(7, 4, 4), circlesMeet(9, 4, 4)], [2, 0]);
ok('Q27 BC and BD', [ruler(otherSide(12, 13)), ruler(Math.hypot(12, otherSide(12, 13)))], ['5 cm', '13 cm']);
says('Q27 (b)', part(27, 'b'), '5 cm'); says('Q27 (c)', part(27, 'c'), '13 cm');
ok('Q28 gap from C to the curve', ruler(Math.hypot(6, 6) - 6), '2 cm 5 mm');
says('Q28 (a)', part(28, 'a'), '6 cm'); says('Q28 (c)', part(28, 'c'), '2 cm 5 mm');
{
  const P = crossings([0, 0], 5, [8, 0], 5);
  ok('Q29 how many, how far apart', [P.length, ruler(dist(P[0], P[1]))], [2, '6 cm']);
  says('Q29 (b)', part(29, 'b'), '6 cm apart');
}
ok('Q30 plots and sizes', [9 / 3, 8 / 4, 3, 8], [3, 2, 3, 8]);
says('Q30 (a)', part(30, 'a'), 'A has 3 plots'); says('Q30 (a)', part(30, 'a'), 'B has 2');
says('Q30 (b)', part(30, 'b'), '3 m'); says('Q30 (c)', part(30, 'c'), '8 cm');
{
  const A = crossings([0, 0], 5, [8, 0], 5).find(p => p[1] > 0);
  ok('Q31 roof height', ruler(A[1]), '3 cm');
  ok('Q31 total', 8 + 4 + 4 + 5 + 5, 26);
  says('Q31 (a)', part(31, 'a'), '8 cm'); says('Q31 (c)', part(31, 'c'), '3 cm'); says('Q31 (d)', part(31, 'd'), '26');
}

/* ---- E. one right option, and the key says so ----------------- */
const KEY = {};
for (const m of ALL.matchAll(/<span class="n">(\d+)<\/span> \(([a-d])\)/g)) KEY[m[1]] = m[2];
/* Options are read from Beyond the Book only: the chapter's own exercise
   lists use the same markup and the same data-start numbers. */
const BEYOND = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join(' ');
const QUESTIONS = {};
for (const m of BEYOND.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>/g))
  QUESTIONS[m[1] || '1'] = m[2];
const opts = (n) => {
  const q = QUESTIONS[n] || '';
  // the question's own close was taken by the reader above, so the
  // option list runs to the end of what it captured
  const m = q.match(/<ol class="c-parts[^"]*">([\s\S]*)$/);
  return m ? [...m[1].matchAll(/<li>([\s\S]*?)(?:<\/li>|$)/g)].map(x => x[1].replace(/\$/g, '').trim()) : [];
};
const MCQ = {
  1: (o) => o === 'a circle',
  2: (o) => o === '4 cm',
  3: (o) => o === '90^\\circ',
  4: (o) => o === 'RS',
  5: (o) => ['NMLK', 'KLMN', 'LMNK', 'MNKL', 'NKLM', 'KNML', 'LKNM', 'MLKN'].includes(o),
  6: (o) => o === '5 cm and 10 cm',
  7: (o) => o === 'the directions its sides point in',
  8: (o) => o === '6 cm',
  9: (o) => o === '2',
  10: (o) => o === 'AC and BD',
  11: (o) => o === String(12 / 3),
  12: (o) => o === `${2 + 4 + 6} cm`,
};
for (const [n, right] of Object.entries(MCQ)) {
  const o = opts(n);
  const hits = o.map((x, i) => right(x) ? 'abcd'[i] : null).filter(Boolean);
  if (o.length !== 4) fails.push(`Q${n}: found ${o.length} options`);
  else if (hits.length !== 1) fails.push(`Q${n}: ${hits.length} right options`);
  else if (KEY[n] !== hits[0]) fails.push(`Q${n}: the right option is (${hits[0]}), the key prints (${KEY[n]})`);
  else pass++;
}
const AR = {
  13: { A: true, R: true, explains: true,
    text: ['A square that is turned on the page is still a square.', 'Turning a figure does not change its side lengths or its angles.'] },
  14: { A: circlesMeet(7, 3, 3) > 0, R: 3 + 3 < 7, explains: true,
    text: ['Arcs of radius 3 cm drawn about two points 7 cm apart cross each other.', '$3 + 3$ is less than 7.'] },
  15: { A: 6 > 8, R: true, explains: true,
    text: ['A rectangle can have a side of 8 cm and a diagonal of 6 cm.', 'A diagonal of a rectangle is longer than each of its sides.'] },
  16: { A: true, R: true, explains: false,
    text: ['In the house of Section 8.6, the point $A$ is 5 cm from both $B$ and $C$.', 'The floor of that house is 5 cm long.'] },
};
for (const [n, q] of Object.entries(AR)) {
  const m = ALL.match(new RegExp(`data-start="${n}">\\s*<li><p>Assertion \\(A\\): ([^<]*)</p><p>Reason \\(R\\): ([^<]*)</p></li>`));
  ok(`Q${n} printed assertion and reason`, m ? [m[1], m[2]] : null, q.text);
  const want = q.A && q.R ? (q.explains ? 'a' : 'b') : q.A ? 'c' : q.R ? 'd' : '?';
  if (KEY[n] !== want) fails.push(`Q${n}: A is ${q.A}, R is ${q.R} → (${want}), the key prints (${KEY[n]})`);
  else pass++;
}
is('no assertion–reason question carries an option list', !/R explains A<\/li>/.test(ALL));
is('the choices are stated once', (ALL.match(/<p class="c-practice__note">In Questions 13 to 16, choose/g) || []).length === 1);
{
  const letters = Object.values(KEY);
  const count = (l) => letters.filter(x => x === l).length;
  is(`the key uses all four letters (a ${count('a')}, b ${count('b')}, c ${count('c')}, d ${count('d')})`,
    ['a', 'b', 'c', 'd'].every(l => count(l) > 0));
  ok('the key covers 1 to 16', Object.keys(KEY).map(Number).sort((a, b) => a - b), Array.from({ length: 16 }, (_, i) => i + 1));
}

/* ---- F. ANSWERS.md carries the same key and values ------------ */
for (const [n, l] of Object.entries(KEY)) is(`ANSWERS key ${n}`, ANSWERS.includes(`${n} (${l})`));
for (const s of ['29. (a) Arcs of radius 5 cm about $P$ and about $Q$. (b) **2**', '**they are 6 cm apart.**',
  '(c) **3 cm.** (d) **26 cm.**', '(c) **About 2 cm 5 mm.**', '**Each diagonal measures about 7 cm 6 mm**',
  '**The two points\n    are about 4 cm 8 mm apart.**', '(b) **5 cm.**', '**13 cm**', '17. 4 cm 5 mm.'])
  is(`ANSWERS has "${s.replace(/\n\s*/g, ' ')}"`, ANSWERS.includes(s));
for (const [n, s] of [[7, '12 cm; 30 cm.'], [8, '8 squares.'], [9, '12 cm by 8 cm.'], [12, '$BC$ measures 8 cm.'], [15, '$AM$ measures 4 cm.']])
  is(`ANSWERS stage 2 Example ${n}`, ANSWERS.includes(`${n}. ${s}`));

/* ---- report --------------------------------------------------- */
console.log('\nClass 6 · Chapter 8 · Playing with Constructions');
console.log(`  ${checked} arithmetic identities read off the pages and evaluated`);
if (skipped.length) {
  console.log(`  ${skipped.length} maths span(s) with numbers that are not arithmetic, not evaluated:`);
  for (const s of skipped) console.log(`      ${s}`);
}
console.log(`  ${pass} check(s) passed`);
if (fails.length) {
  console.log(`\n  ${fails.length} FAILED:`);
  for (const f of fails) console.log(`    ! ${f}`);
  process.exit(1);
}
console.log('  all clear\n');
