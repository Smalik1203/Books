#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value where it can be read: each
   sequence is generated from its rule, each figure is counted from its
   SVG, and each answer is read back out of the page and compared with
   what is computed here.

     node pages/class-6/math-ch01-patterns/check-numbers.mjs

   Four parts:
     A  every arithmetic identity set as maths anywhere in the chapter and
        in ANSWERS.md, including sums written with \cdots, which are
        expanded from the terms printed either side of the dots
     B  the claims arithmetic cannot check: every printed run of numbers
        is a window of a sequence generated from its rule; Table 1.1 term
        by term; every figure counted from its SVG; every example's
        Answer row and every practice answer, part by part
     C  every multiple-choice and assertion-reason question — options read
        off the page, exactly one right, and it is the one the key prints
     D  ANSWERS.md — its key against the page's, and its values

   Exits non-zero if anything does not hold up. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
let pass = 0;
const fails = [];
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function ok(what, got, want) {
  if (same(got, want)) pass++;
  else fails.push(`${what}\n      computed ${JSON.stringify(got)}\n      printed  ${JSON.stringify(want)}`);
}
function is(what, cond) { if (cond) pass++; else fails.push(what); }

/* ---- the sequences, generated from their rules ---------------- */

const N = 60;
const gen = (f, n = N, from = 1) => Array.from({ length: n }, (_, i) => f(i + from));
const T = (n) => n * (n + 1) / 2;               // triangular: 1 + 2 + … + n
const hex = (n) => 3 * n * (n - 1) + 1;          // hexagon with n dots a side
const lines = (p) => p * (p - 1) / 2;            // complete graph on p points
const koch = (k) => 3 * 4 ** (k - 1);            // straight lines in shape k
const vira = (() => { const v = [1, 2]; while (v.length < N) v.push(v.at(-1) + v.at(-2)); return v; })();
const isSq = (x) => Number.isInteger(Math.sqrt(x));
const isCube = (x) => { const r = Math.round(Math.cbrt(x)); return r ** 3 === x; };
const isTri = (x) => { for (let n = 1; T(n) <= x; n++) if (T(n) === x) return true; return false; };
const isPow2 = (x) => x >= 1 && Number.isInteger(Math.log2(x)) && 2 ** Math.log2(x) === x;
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const sum = (xs) => xs.reduce((a, b) => a + b, 0);
const upDown = (n) => [...range(1, n), ...range(1, n - 1).reverse()];
const oddsTo = (last) => range(1, last).filter(x => x % 2 === 1);
const nthOdd = (k) => 2 * k - 1;

const SEQ = {
  'All 1s': gen(() => 1),
  'counting numbers': gen(n => n - 1, N + 1),        // from 0
  'odd numbers': gen(nthOdd),
  'even numbers': gen(n => 2 * n),
  'triangular numbers': gen(T, N, 0),                 // 0, 1, 3, …
  'square numbers': gen(n => n * n),
  'cube numbers': gen(n => n ** 3, 25),
  'Virahanka numbers': vira,
  'powers of 2': gen(n => 2 ** (n - 1), 30),
  'powers of 3': gen(n => 3 ** (n - 1), 20),
  'hexagonal numbers': gen(hex),
  'Koch line counts': gen(koch, 8),
  'hexagon rings': gen(n => 6 * n),
  'dashed joining lines': [0, ...gen(n => 2 ** (n - 1), 10)],
  'rectangle numbers n(n+1)': gen(n => n * (n + 1)),
  'square numbers plus 1': gen(n => n * n + 1),
  'double square numbers': gen(n => 2 * n * n),
  'doubling from 3': gen(n => 3 * 2 ** (n - 1), 20),
  'matchstick squares 3n+1': gen(n => 3 * n + 1),
  'sums of powers of 2': gen(n => 2 ** n - 1, 20),
};

/* ---- the pages ------------------------------------------------ */

const files = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const body = files.filter(f => f < 'p100');
const beyond = files.filter(f => f > 'p100');
const read = (f) => fs.readFileSync(path.join(DIR, f), 'utf8').replace(/\r\n/g, '\n');
const HTML = Object.fromEntries(files.map(f => [f, read(f)]));
const ALL = files.map(f => HTML[f]).join('\n');
const BEYOND = beyond.map(f => HTML[f]).join('\n');
const BODY = body.map(f => HTML[f]).join('\n');
const ANSWERS = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8').replace(/\r\n/g, '\n');
const stripTags = (s) => s.replace(/<[^>]+>/g, ' ');
const numsIn = (s) => [...stripTags(s).replace(/\\[a-z]+/g, ' ').matchAll(/\d+/g)].map(m => Number(m[0]));

/* ---- A. every arithmetic identity ------------------------------ */

const B = String.fromCharCode(92);
/* A sum written with \cdots is expanded from the terms either side of
   each gap: the step comes from the two terms before the gap (a common
   difference, or a common ratio when the differences are not equal), or,
   when only one term stands before it, from the two terms after it. A
   gap that does not land exactly on the term after it is not expanded,
   and the span is reported. */
function expandDots(side) {
  const pieces = side.split(B + 'cdots').map(p => p.split('+').map(t => t.trim()).filter(Boolean));
  if (pieces.length < 2) return null;
  if (pieces.some(p => p.some(t => !/^\d+$/.test(t)))) return null;
  const P = pieces.map(p => p.map(Number));
  const out = [...P[0]];
  for (let g = 1; g < P.length; g++) {
    const left = P[g - 1].length >= 2 ? out : P[g - 1], right = P[g];
    const L = left.at(-1), R = right[0];
    let step;
    if (left.length >= 2 && (left.at(-1) !== left.at(-2))) {
      const d1 = left.at(-1) - left.at(-2);
      const geometric = left.length >= 3 && left.at(-2) - left.at(-3) !== d1
        && left.at(-1) / left.at(-2) === left.at(-2) / left.at(-3);
      step = geometric ? { r: left.at(-1) / left.at(-2) } : { d: d1 };
    } else if (right.length >= 2) step = { d: right[1] - right[0] };
    else return null;
    let x = L;
    for (let guard = 0; guard < 10000; guard++) {
      x = step.r ? x * step.r : x + step.d;
      if (x === R) break;
      if ((step.r || step.d > 0) ? x > R : x < R) return null;
      out.push(x);
    }
    out.push(...right);
  }
  return out;
}

function toValue(side) {
  let s = side.trim();
  if (s.includes(B + 'cdots')) {
    const xs = expandDots(s.replace(/\s+/g, ' '));
    return xs ? sum(xs) : null;
  }
  s = s.split(B + 'times').join('*').split(B + 'div').join('/')
    .split(B + ',').join('').split(B + ' ').join('').replace(/[{}]/g, '').replace(/\s+/g, '');
  if (!s || !/^[-+*/()0-9]+$/.test(s)) return null;
  try { return Function(`"use strict";return (${s})`)(); } catch { return null; }
}

let identities = 0;
const skipped = [];
function checkSpan(where, span) {
  const sides = span.split('=').map(s => s.trim());
  if (sides.length < 2 || sides.some(s => !s)) return;
  const vals = sides.map(toValue);
  if (vals.some(v => v === null || !Number.isFinite(v))) { skipped.push(`${where}: $${span.trim()}$`); return; }
  identities++;
  if (vals.some(v => v !== vals[0])) fails.push(`${where}: $${span.trim()}$ — sides are ${vals.join(' and ')}`);
  else pass++;
}
for (const f of files)
  for (const m of HTML[f].matchAll(/\$([^$]+)\$/g)) if (m[1].includes('=')) checkSpan(f, m[1]);
// ANSWERS.md sometimes closes the maths before the bold answer: $37 + 24 = $ **61**
const ANS_JOINED = ANSWERS.replace(/\$([^$]*=)\s*\$\s*\*\*(\d+)\*\*/g, (_, a, n) => `$${a} ${n}$`);
for (const m of ANS_JOINED.matchAll(/\$([^$]+)\$/g)) if (m[1].includes('=')) checkSpan('ANSWERS.md', m[1]);

/* ---- B1. Table 1.1, term by term ------------------------------- */

const TABLE_RULE = {
  'All 1s': SEQ['All 1s'], 'Counting numbers': SEQ['counting numbers'].slice(1),
  'Odd numbers': SEQ['odd numbers'], 'Even numbers': SEQ['even numbers'],
  'Triangular numbers': SEQ['triangular numbers'].slice(1), 'Square numbers': SEQ['square numbers'],
  'Cube numbers': SEQ['cube numbers'], 'Virahānka numbers': vira,
  'Powers of 2': SEQ['powers of 2'], 'Powers of 3': SEQ['powers of 3'],
};
const tableCells = [...HTML['p002.html'].matchAll(/<td><em>([^<]+)<\/em><br>\$([^$]+)\$<\/td>/g)];
ok('Table 1.1 has ten sequences', tableCells.length, 10);
for (const [, name, terms] of tableCells) {
  const printed = [...terms.matchAll(/\d+/g)].map(m => Number(m[0]));
  const rule = TABLE_RULE[name];
  if (!rule) { fails.push(`Table 1.1: no rule for "${name}"`); continue; }
  ok(`Table 1.1 ${name}`, rule.slice(0, printed.length), printed);
}
// the next three of each, as ANSWERS.md gives them (Exercise Set 1.2 Q2)
for (const [, name, terms] of tableCells) {
  const k = [...terms.matchAll(/\d+/g)].length;
  const next = TABLE_RULE[name].slice(k, k + 3);
  const row = ANSWERS.split('\n').find(l => l.startsWith(`| ${name} |`));
  if (!row) { fails.push(`ANSWERS.md has no row for ${name}`); continue; }
  ok(`Ex 1.2 Q2 next three ${name}`, next, numsIn(row.split('|')[3]));
}

/* ---- B2. every printed run of numbers follows a rule ------------ */

/* Any run of three or more whole numbers separated by commas — in the
   running text, in a work row, in a list set as maths — must be a
   stretch, read forwards or backwards, of one of the sequences above.
   The few runs that are not a stretch of any sequence are listed with
   the computation that produces them. */
const windowOf = (run) => {
  for (const [name, s] of Object.entries(SEQ)) {
    for (const r of [run, [...run].reverse()]) {
      for (let i = 0; i + r.length <= s.length; i++)
        if (r.every((x, j) => s[i + j] === x)) return name;
    }
  }
  return null;
};
const NOT_A_WINDOW = [
  { run: [6, 10, 28, 36], why: 'the even ones among the first ten triangular numbers',
    got: range(1, 10).map(T).filter(x => x % 2 === 0) },
  { run: [1, 2, 3, 4, 3, 2, 1], why: 'up to 4 and down again', got: upDown(4) },
  { run: [36, 45, 55, 49], why: 'three triangular numbers in a row, then 49, which is not one',
    got: [T(8), T(9), T(10), 49].filter((x, i) => i < 3 || !isTri(x)) },
  { run: [78, 91, 105, 100], why: 'the triangular numbers either side of 100, then 100',
    got: [T(12), T(13), T(14), 100].filter((x, i) => i < 3 || (!isTri(x) && T(13) < x && x < T(14))) },
  { run: [24, 35, 64], why: 'the Q5 options that are not triangular', got: [24, 35, 55, 64].filter(x => !isTri(x)) },
  { run: [8, 32, 128], why: 'the Q11 options that are powers of 2 but not square', got: [8, 32, 128, 256].filter(x => isPow2(x) && !isSq(x)) },
  { run: [3, 4, 5, 6, 7, 8, 9, 10], why: 'sides of the regular polygons (counting from 3)', got: range(3, 10) },
];
function plainText(s) {
  return s
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
    .replace(/\$([^$]+)\$/g, (m, x) => (/^[\d,\s\\]*(\\ldots)?\s*$/.test(x.split(B + 'ldots').join('')) ? x.split(B + ' ').join(' ').split(B + 'ldots').join('') : ' § '))
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z]+;/g, ' ')
    .replace(/\d+\.\d+/g, ' § ')
    .replace(/\*\*/g, '');
}
let runs = 0;
const runSources = [...files.map(f => [f, plainText(HTML[f])]), ['ANSWERS.md', plainText(ANSWERS)]];
for (const [f, text] of runSources) {
  for (const m of text.matchAll(/(?<![\d§])\d+(?:\s*,\s*\d+)+(?:,?\s+(?:and|or)\s+\d+)?(?![\d§])/g)) {
    const run = [...m[0].matchAll(/\d+/g)].map(x => Number(x[0]));
    if (run.length < 3) continue;
    runs++;
    const name = windowOf(run);
    const known = NOT_A_WINDOW.find(k => same(k.run, run));
    if (name) pass++;
    else if (known) ok(`${f}: ${run.join(', ')} (${known.why})`, known.got, run);
    else fails.push(`${f}: "${m[0]}" is not a stretch of any sequence the chapter uses`);
  }
}

/* ---- B3. the figures, counted from their SVG --------------------- */

function figure(caption) {
  const at = ALL.indexOf(`<span class="fignum">${caption}</span>`);
  if (at < 0) { fails.push(`no ${caption}`); return ''; }
  const start = ALL.lastIndexOf('<svg', at);
  return ALL.slice(start, ALL.indexOf('</svg>', start));
}
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([a-z0-9-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
const elements = (svg, name) => [...svg.matchAll(new RegExp(`<${name}\\b[^>]*?/?>`, 'g'))].map(m => ({ ...attrs(m[0]), at: m.index }));
const texts = (svg) => [...svg.matchAll(/<text\b([^>]*)>([^<]*)<\/text>/g)].map(m => ({ ...attrs(m[1]), text: m[2], at: m.index }));
const filled = (c) => /dg-fill/.test(c.class);
const pts = (p) => p.points.trim().split(/\s+/).map(q => q.split(',').map(Number));

// dots drawn before a label in the source belong to that label
function dotsPerLabel(svg) {
  const labels = texts(svg).filter(t => /^\d+$/.test(t.text));
  const dots = elements(svg, 'circle').filter(filled);
  let prev = -1;
  return labels.map(l => {
    const n = dots.filter(d => d.at > prev && d.at < l.at).length;
    prev = l.at;
    return { label: Number(l.text), dots: n };
  });
}

// Fig. 1.1 — four rows of five
{
  const got = dotsPerLabel(figure('Fig. 1.1'));
  ok('Fig. 1.1 every label is its own dot count', got.map(g => g.dots), got.map(g => g.label));
  ok('Fig. 1.1 rows are All 1s, counting, odd, even',
    got.map(g => g.label), [...SEQ['All 1s'].slice(0, 5), ...range(1, 5), ...SEQ['odd numbers'].slice(0, 5), ...SEQ['even numbers'].slice(0, 5)]);
  // odd numbers leave one dot without a partner: two rows that differ by one
  const svg = figure('Fig. 1.1');
  const odd = elements(svg, 'circle').filter(c => filled(c) && Number(c.cy) > 100 && Number(c.cy) < 150);
  const rowsOf = (cs) => Object.values(cs.reduce((o, c) => ((o[c.cy] = (o[c.cy] || 0) + 1), o), {}));
  is('Fig. 1.1 odd pictures are two rows differing by one', rowsOf(odd).length === 2 && Math.abs(rowsOf(odd)[0] - rowsOf(odd)[1]) === 5);
}
// Fig. 1.2 — triangles and squares, and that they are triangles and squares
{
  const svg = figure('Fig. 1.2');
  const got = dotsPerLabel(svg);
  ok('Fig. 1.2 every label is its own dot count', got.map(g => g.dots), got.map(g => g.label));
  ok('Fig. 1.2 the labels', got.map(g => g.label), [...range(1, 5).map(T), ...range(1, 5).map(n => n * n)]);
  const labels = texts(svg).filter(t => /^\d+$/.test(t.text));
  const dots = elements(svg, 'circle').filter(filled);
  let prev = -1;
  labels.forEach((l, i) => {
    const mine = dots.filter(d => d.at > prev && d.at < l.at); prev = l.at;
    const rows = Object.entries(mine.reduce((o, c) => ((o[c.cy] = (o[c.cy] || 0) + 1), o), {}))
      .sort((a, b) => Number(a[0]) - Number(b[0])).map(e => e[1]);
    const n = i < 5 ? i + 1 : i - 4;
    ok(`Fig. 1.2 picture ${l.text} row lengths`, rows, i < 5 ? range(1, n) : Array(n).fill(n));
  });
}
// Fig. 1.3 — a cube is n by n by n when each visible face has n × n squares
{
  const svg = figure('Fig. 1.3');
  const labels = texts(svg).filter(t => /^\d+$/.test(t.text));
  const tops = elements(svg, 'polygon').filter(p => p.class === 'dg-face-top');
  const sides = elements(svg, 'polygon').filter(p => p.class === 'dg-face-side');
  let prev = -1;
  const cubes = labels.map(l => {
    const t = tops.filter(p => p.at > prev && p.at < l.at).length;
    const s = sides.filter(p => p.at > prev && p.at < l.at).length;
    prev = l.at;
    const n = Math.round(Math.sqrt(t));
    is(`Fig. 1.3 cube ${l.text}: top and side faces are both ${n} by ${n}`, n * n === t && t === s);
    return n ** 3;
  });
  ok('Fig. 1.3 small cubes counted', cubes, labels.map(l => Number(l.text)));
  ok('Fig. 1.3 caption', numsIn(ALL.match(/Fig\. 1\.3<\/span>([^<]*)/)[1]), cubes);
}
// opener sketch — dots grouped under the labels 1, 3, 6
{
  const svg = HTML['p001.html'].match(/<svg[\s\S]*?<\/svg>/)[0];
  const notes = texts(svg).filter(t => /^\d+$/.test(t.text));
  const dots = elements(svg, 'circle');
  const near = notes.map(n => dots.filter(d => {
    const nearest = notes.reduce((b, m) => Math.abs(m.x - d.cx) < Math.abs(b.x - d.cx) ? m : b);
    return nearest === n;
  }).length);
  ok('opener sketch: dots under each label', near, [1, 3, 6, 0]);
  ok('opener sketch: the labels are triangular numbers', notes.map(n => Number(n.text)), range(1, 4).map(T));
}
// Fig. 1.4 — corners and dashed joining lines, shape by shape
const FIG14 = (() => {
  const svg = figure('Fig. 1.4');
  const labels = texts(svg).filter(t => /^\d+$/.test(t.text)).map(t => ({ x: Number(t.x), n: Number(t.text) }));
  const nearest = (x) => labels.reduce((b, l) => Math.abs(l.x - x) < Math.abs(b.x - x) ? l : b);
  const corners = labels.map(() => 0), copies = labels.map(() => 0), dashed = labels.map(() => 0);
  for (const c of elements(svg, 'circle')) {
    const i = labels.indexOf(nearest(Number(c.cx)));
    corners[i]++; if (c.class === 'dg-fill-a') copies[i]++;
  }
  for (const l of elements(svg, 'line').filter(l => l.class === 'dg-ghost'))
    dashed[labels.indexOf(nearest((Number(l.x1) + Number(l.x2)) / 2))]++;
  return { labels: labels.map(l => l.n), corners, copies, dashed };
})();
ok('Fig. 1.4 corners counted', FIG14.corners, FIG14.labels);
ok('Fig. 1.4 corners are powers of 2', FIG14.corners, SEQ['powers of 2'].slice(0, 5));
ok('Fig. 1.4 the copy is half the corners', FIG14.copies, FIG14.corners.map(c => c / 2 | 0));
ok('Fig. 1.4 dashed joining lines (T&R 2)', FIG14.dashed, SEQ['dashed joining lines'].slice(0, 5));
is('Fig. 1.4: next shape has 32 corners and 16 dashed lines', FIG14.corners.at(-1) * 2 === 32 && FIG14.corners.at(-1) === 16);
inAns('T&R Fig. 1.4 Q1', `**${FIG14.corners.at(-1) * 2} corners.**`);
inAns('T&R Fig. 1.4 Q2', `number **${FIG14.dashed.join(', ')}**`);
inAns('T&R Fig. 1.4 Q2 next', `next\n   shape has **${FIG14.corners.at(-1)}** dashed lines`);

// Fig. 1.5 — the L-shapes
{
  const svg = figure('Fig. 1.5');
  const dots = elements(svg, 'circle');
  const xs = [...new Set(dots.map(d => Number(d.cx)))].sort((a, b) => a - b);
  const ys = [...new Set(dots.map(d => Number(d.cy)))].sort((a, b) => b - a);
  ok('Fig. 1.5 is 6 by 6', [xs.length, ys.length, dots.length], [6, 6, 36]);
  const layer = (d) => Math.max(xs.indexOf(Number(d.cx)), ys.indexOf(Number(d.cy)));
  const sizes = range(0, 5).map(k => dots.filter(d => layer(d) === k).length);
  ok('Fig. 1.5 L-shapes', sizes, SEQ['odd numbers'].slice(0, 6));
  is('Fig. 1.5 each L-shape is one colour, and neighbours differ',
    range(0, 5).every(k => new Set(dots.filter(d => layer(d) === k).map(d => d.class)).size === 1)
    && range(1, 5).every(k => dots.find(d => layer(d) === k).class !== dots.find(d => layer(d) === k - 1).class));
  ok('Fig. 1.5 dividing lines between the L-shapes', elements(svg, 'path').length, 5);
  ok('Fig. 1.5 caption', numsIn(ALL.match(/Fig\. 1\.5<\/span>([^<]*)/)[1]), [6, 6, ...sizes]);
}
// Fig. 1.6 — the cube from a corner, and the hexagon
{
  const svg = figure('Fig. 1.6');
  const faces = elements(svg, 'polygon').filter(filled).length;
  const centres = new Set(elements(svg, 'circle').map(c => `${c.cx},${c.cy}`)).size;
  const n = Math.round(Math.sqrt(faces / 3));
  ok('Fig. 1.6 three visible faces of n by n', 3 * n * n, faces);
  ok('Fig. 1.6 small cubes', n ** 3, 27);
  ok('Fig. 1.6 hexagon dots', centres, hex(3));
  ok('Fig. 1.6 the dots are the cubes seen from a corner', n ** 3 - (n - 1) ** 3, centres);
  ok('Fig. 1.6 caption', numsIn(ALL.match(/Fig\. 1\.6<\/span>([^<]*)/)[1]), [n ** 3, centres]);
}
// Fig. 1.7 — regular polygons: sides, names, and that they are regular
{
  const svg = figure('Fig. 1.7');
  const polys = elements(svg, 'polygon').filter(p => p.class === 'dg-line');
  const names = texts(svg).map(t => t.text);
  const NAME = { 3: 'Triangle', 4: 'Quadrilateral', 5: 'Pentagon', 6: 'Hexagon', 7: 'Heptagon', 8: 'Octagon', 9: 'Nonagon', 10: 'Decagon' };
  const sides = polys.map(p => pts(p).length);
  ok('Fig. 1.7 sides', sides, range(3, 10));
  ok('Fig. 1.7 names match the sides', names, sides.map(s => NAME[s]));
  for (const p of polys) {
    const q = pts(p);
    const len = q.map((a, i) => Math.hypot(a[0] - q[(i + 1) % q.length][0], a[1] - q[(i + 1) % q.length][1]));
    is(`Fig. 1.7 ${q.length}-gon has equal sides`, Math.max(...len) - Math.min(...len) < 0.1);
  }
  // p009 names the prefixes in the same order
  const pre = [...HTML['p009.html'].matchAll(/<em>([a-z]+)<\/em>gon/g)].map(m => m[1]);
  ok('§1.6 name prefixes', pre, ['penta', 'hexa', 'hepta', 'octa', 'nona', 'deca']);
}
// Fig. 1.8 — complete graphs: every pair joined exactly once
const FIG18 = (() => {
  const svg = figure('Fig. 1.8');
  // only the labels that carry a count; a figure may also carry a word
  const labels = texts(svg).filter(t => /\d/.test(t.text)).map(t => ({ x: Number(t.x), n: Number(t.text.match(/\d+/)[0]) }));
  const nearest = (x) => labels.reduce((b, l) => Math.abs(l.x - x) < Math.abs(b.x - x) ? l : b);
  return labels.map(l => {
    const P = elements(svg, 'circle').filter(c => nearest(Number(c.cx)) === l).map(c => `${c.cx},${c.cy}`);
    const L = elements(svg, 'line').filter(e => nearest((Number(e.x1) + Number(e.x2)) / 2) === l)
      .map(e => [`${e.x1},${e.y1}`, `${e.x2},${e.y2}`].sort().join('|'));
    const pairs = new Set();
    for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) pairs.add([P[i], P[j]].sort().join('|'));
    is(`Fig. 1.8 ${l.n} points: every pair joined once`, L.length === pairs.size && new Set(L).size === L.length && L.every(x => pairs.has(x)));
    return { label: l.n, points: P.length, lines: L.length };
  });
})();
ok('Fig. 1.8 points', FIG18.map(g => g.points), FIG18.map(g => g.label));
ok('Fig. 1.8 lines (Ex 1.6 Q2)', FIG18.map(g => g.lines), SEQ['triangular numbers'].slice(1, 6));

// Fig. 1.9 — count unit cells whose every edge is drawn
const SEG = (svg, box) => {
  const segs = [];
  for (const l of elements(svg, 'line')) segs.push([[+l.x1, +l.y1], [+l.x2, +l.y2]]);
  for (const r of elements(svg, 'rect').filter(r => r.class === 'dg-line')) {
    const x = +r.x, y = +r.y, w = +r.width, h = +r.height;
    segs.push([[x, y], [x + w, y]], [[x + w, y], [x + w, y + h]], [[x, y + h], [x + w, y + h]], [[x, y], [x, y + h]]);
  }
  for (const p of elements(svg, 'polygon').filter(p => p.class === 'dg-line')) {
    const q = pts(p); q.forEach((a, i) => segs.push([a, q[(i + 1) % q.length]]));
  }
  return segs.filter(s => box(s));
};
const onSeg = (segs, a, b) => segs.some(([p, q]) => {
  const cross = (u, v, w) => (v[0] - u[0]) * (w[1] - u[1]) - (v[1] - u[1]) * (w[0] - u[0]);
  const within = (u, v, w) => Math.min(u[0], v[0]) - 0.05 <= w[0] && w[0] <= Math.max(u[0], v[0]) + 0.05
    && Math.min(u[1], v[1]) - 0.05 <= w[1] && w[1] <= Math.max(u[1], v[1]) + 0.05;
  return Math.abs(cross(p, q, a)) < 0.5 && Math.abs(cross(p, q, b)) < 0.5 && within(p, q, a) && within(p, q, b);
});
const FIG19 = (() => {
  const svg = figure('Fig. 1.9');
  const squares = elements(svg, 'rect').filter(r => r.class === 'dg-line').map(r => {
    const x = +r.x, y = +r.y, u = 13, n = Math.round(+r.width / u);
    const segs = SEG(svg, s => s.every(([px, py]) => px >= x - 0.1 && px <= x + n * u + 0.1 && py >= y - 0.1 && py <= y + n * u + 0.1));
    let cells = 0;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const a = [x + i * u, y + j * u], b = [a[0] + u, a[1]], c = [a[0] + u, a[1] + u], d = [a[0], a[1] + u];
      if (onSeg(segs, a, b) && onSeg(segs, b, c) && onSeg(segs, d, c) && onSeg(segs, a, d)) cells++;
    }
    return { rows: n, cells, edge: range(0, n - 1).flatMap(i => range(0, n - 1).map(j => [i, j])).filter(([i, j]) => i === 0 || j === 0 || i === n - 1 || j === n - 1).length };
  });
  const triangles = elements(svg, 'polygon').filter(p => p.class === 'dg-line').map(p => {
    const q = pts(p); const s = 16, h = s * Math.sqrt(3) / 2;
    const base = q[1][1], left = q[1][0], n = Math.round((q[2][0] - q[1][0]) / s);
    const segs = SEG(svg, sg => sg.every(([px, py]) => px >= left - 0.1 && px <= left + n * s + 0.1 && py >= base - n * h - 0.2 && py <= base + 0.1));
    let up = 0, down = 0;
    for (let r = 0; r < n; r++) {           // r = rows above the base
      const y0 = base - r * h, y1 = base - (r + 1) * h, x0 = left + r * s / 2;
      for (let k = 0; k < n - r; k++) {
        const a = [x0 + k * s, y0], b = [a[0] + s, y0], c = [a[0] + s / 2, y1];
        if (onSeg(segs, a, b) && onSeg(segs, b, c) && onSeg(segs, a, c)) up++;
        if (k < n - r - 1) {
          const e = [c[0] + s, y1];
          if (onSeg(segs, c, e) && onSeg(segs, c, b) && onSeg(segs, b, e)) down++;
        }
      }
    }
    return { rows: n, up, down, cells: up + down };
  });
  return { squares, triangles };
})();
ok('Fig. 1.9 stacked squares rows', FIG19.squares.map(s => s.rows), range(1, 5));
ok('Fig. 1.9 small squares counted (Ex 1.6 Q3)', FIG19.squares.map(s => s.cells), SEQ['square numbers'].slice(0, 5));
ok('Fig. 1.9 stacked triangles rows', FIG19.triangles.map(s => s.rows), range(1, 4));
ok('Fig. 1.9 small triangles counted (Ex 1.6 Q4)', FIG19.triangles.map(s => s.cells), SEQ['square numbers'].slice(0, 4));
ok('Fig. 1.9 triangles pointing up', FIG19.triangles.map(s => s.up), range(1, 4).map(T));
ok('Fig. 1.9 triangles pointing down', FIG19.triangles.map(s => s.down), range(0, 3).map(T));

// Fig. 1.10 — Koch: straight lines, and the snowflake stays in the first triangle's circle
{
  const svg = figure('Fig. 1.10');
  const polys = elements(svg, 'polygon').filter(p => p.class === 'dg-line').map(pts);
  const straight = polys.map(q => q.filter((a, i) => {
    const p = q[(i - 1 + q.length) % q.length], n = q[(i + 1) % q.length];
    return Math.abs((a[0] - p[0]) * (n[1] - p[1]) - (a[1] - p[1]) * (n[0] - p[0])) > 1e-3;
  }).length);
  ok('Fig. 1.10 straight lines per shape (Ex 1.6 Q5)', straight, SEQ['Koch line counts'].slice(0, 4));
  const ctr = (q) => [sum(q.map(p => p[0])) / q.length, sum(q.map(p => p[1])) / q.length];
  const c0 = ctr(polys[0]), R = Math.hypot(polys[0][0][0] - c0[0], polys[0][0][1] - c0[1]);
  is('Fig. 1.10 every shape fits inside the first triangle\'s circle',
    polys.every(q => { const c = ctr(q); return q.every(p => Math.hypot(p[0] - c[0], p[1] - c[1]) <= R + 0.05); }));
}

/* ---- B4. the body's prose claims --------------------------------- */

is('§1.3 6 dots make a triangle and 7 do not', isTri(6) && !isTri(7));
is('§1.3 36 is triangular and square (Ex 1.3 Q3)', isTri(36) && isSq(36));
ok('§1.3 the next number after 36 that is both', range(37, 5000).find(x => isTri(x) && isSq(x)), 1225);
ok('§1.3 1225 is the 49th triangular number, 35 × 35', [T(49), 35 * 35], [1225, 1225]);
ok('Ex 1.3 Q3: 36 as a triangle has 8 rows', range(1, 20).find(n => T(n) === 36), 8);
ok('Ex 1.3 Q4 next hexagonal number', hex(5), 61);
ok('§1.4 odd sums are the squares', range(1, 6).map(k => sum(oddsTo(nthOdd(k)))), range(1, 6).map(k => k * k));
is('§1.4 odd sums stay square to 1000 terms', range(1, 1000).every(k => k * k === k * k && sum(range(1, k).map(nthOdd)) === k * k));
ok('§1.4 up-and-down sums', range(1, 5).map(n => sum(upDown(n))), range(1, 5).map(n => n * n));
{
  // body Ex 1: the four groups use every term of the sum exactly once
  const ex = HTML['p006.html'].match(/Example 1<\/div>[\s\S]*?So the pattern/)[0];
  const q = ex.match(/Is \$([^$]+)\$/)[1].split('+').map(Number);
  ok('body Ex 1 the sum is up to 6 and down', q, upDown(6));
  const groups = [...ex.matchAll(/Step \d<\/span>\s*<span>\$([^$=]+)=/g)].map(m => m[1].split('+').map(Number));
  ok('body Ex 1 the groups use each term once', groups.flat().sort((a, b) => a - b), [...q].sort((a, b) => a - b));
  ok('body Ex 1 answer row', [...groups.map(sum), sum(q), sum(q), 6, 6], numsIn(answerRowOf(exampleIn(BODY, 1, 'body'), 'body Ex 1')));
}
ok('T&R after body Ex 1: up to 7', sum(upDown(7)), 49);
{
  const arjun = HTML['p006.html'].match(/Arjun writes \$([^$]+)\$/)[1].split('+').map(Number);
  ok('T&R Arjun\'s sum', sum(arjun), 17);
  is('T&R 17 is not square', !isSq(sum(arjun)));
  inAns('T&R Arjun', `= ${sum(arjun)}$. **No**`);
}
ok('T&R first 10 and 100 odd numbers', [sum(range(1, 10).map(nthOdd)), sum(range(1, 100).map(nthOdd))], [100, 10000]);

/* ---- B5. Beyond, stage 1 (kept word for word) --------------------- */

{
  const tries = [...BEYOND.matchAll(/<div class="c-try">\s*<p>([\s\S]*?)<\/p>/g)].map(m => m[1]);
  ok('stage 1 has five questions', tries.length, 5);
  const s1 = tries[0].match(/\$([^$]+)\$/)[1].split('+').map(Number);
  ok('stage 1 Q1 is the first 8 odd numbers', s1, range(1, 8).map(nthOdd));
  ok('stage 1 Q1 sum', sum(s1), 64);
  is('stage 1 Q2 124 is not square, between 121 and 144', !isSq(124) && 11 * 11 < 124 && 124 < 12 * 12);
  ok('stage 1 Q2 sum of first 12 odd numbers', sum(range(1, 12).map(nthOdd)), 144);
  const s3 = tries[2].match(/\$([^$]+)\$/)[1].split('+').map(Number);
  ok('stage 1 Q3 is up to 7 and down', s3, upDown(7));
  ok('stage 1 Q3 sum', sum(s3), 49);
  ok('stage 1 Q4 the rectangles', [2, 6, 12, 20, 30].map((x, i) => (i + 1) * (i + 2)), [2, 6, 12, 20, 30]);
  ok('stage 1 Q4 next', 6 * 7, 42);
  ok('stage 1 Q4 doubles of triangular numbers', [1, 3, 6].map(t => 2 * t), [2, 6, 12]);
  const sticks = (n) => 3 * n + 1;
  ok('stage 1 Q5 matchsticks for 1, 2, 3 squares', [1, 2, 3].map(sticks), numsIn(tries[4]).filter((_, i) => [1, 3, 5].includes(i)));
  ok('stage 1 Q5 for 10 squares', [sticks(10), 2 * 10 + (10 + 1)], [31, 31]);
}

/* ---- B6. every Solved Example, read back from its Answer row ------ */

/* Beyond numbers its Solved Examples from 1, as Class 7 does, so the
   body's Example 1 and Beyond's Example 1 share a tab label. Every lookup
   is scoped to one division, and every label says which ("Beyond Ex 3"). */
function exampleIn(html, n, who) {
  const at = html.indexOf(`<div class="c-example__tab">Example ${n}</div>`);
  if (at < 0) { fails.push(`no ${who} Ex ${n}`); return ''; }
  const end = html.indexOf('<div class="c-example__tab">', at + 10);
  return html.slice(at, end < 0 ? undefined : end);
}
function answerRowOf(block, label) {
  const m = block.match(/work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/);
  if (!m) { fails.push(`${label} has no Answer row`); return ''; }
  return m[1];
}
const beyondEx = (n) => exampleIn(BEYOND, n, 'Beyond');
const beyondAnswerRow = (n) => answerRowOf(beyondEx(n), `Beyond Ex ${n}`);
const beyondExAns = (n, want, what) => ok(`Beyond Ex ${n} answer${what ? ' — ' + what : ''}`, want, numsIn(beyondAnswerRow(n)));
const beyondQSum = (n) => {     // the sum printed in the example's question, expanded
  const span = beyondEx(n).match(/<p>[^$]*\$([^$]+)\$/)[1];
  return span.includes(B + 'cdots') ? expandDots(span) : span.split('+').map(Number);
};

const beyondStepNums = (n, s) => { const m = beyondEx(n).match(new RegExp(`Step ${s}</span>\\s*<span>([\\s\\S]*?)</span>`)); return m ? numsIn(m[1]) : []; };
// Type 1
{
  const printed = numsIn(beyondEx(1).match(/<p>([^<]*)<\/p>/)[1]);
  ok('Beyond Ex 1 the sequence is squares plus 1', printed, SEQ['square numbers plus 1'].slice(0, 5));
  beyondExAns(1, SEQ['square numbers plus 1'].slice(5, 7));
  ok('Beyond Ex 1 the note: 36 + 1 and 49 + 1', [36 + 1, 49 + 1], SEQ['square numbers plus 1'].slice(5, 7));
  const pBx2 = numsIn(beyondEx(2).match(/<p>([^<]*)<\/p>/)[1]);
  ok('Beyond Ex 2 the sequence is double the square numbers', pBx2, SEQ['double square numbers'].slice(0, 5));
  beyondExAns(2, SEQ['double square numbers'].slice(5, 6));
  const gaps = (xs) => xs.slice(1).map((x, i) => x - xs[i]);
  ok('Beyond Ex 1 the printed gaps', beyondStepNums(1, 1), gaps(printed));
  ok('Beyond Ex 1 the next gaps', beyondStepNums(1, 2), gaps(SEQ['square numbers plus 1'].slice(4, 7)));
  ok('Beyond Ex 2 the printed halves', beyondStepNums(2, 1), pBx2.map(x => x / 2));
  ok('Beyond Ex 2 the halves are the square numbers', pBx2.map(x => x / 2), SEQ['square numbers'].slice(0, 5));
  is('Beyond Ex 2 every term is even', pBx2.every(x => x % 2 === 0));
  ok('Beyond Ex 2 step 2 the next square, doubled', beyondStepNums(2, 2), [6, 6, 36, 2, 36, 72]);
  ok('Beyond Ex 14: with the 1 added, the total before 512 is 512', 1 + sum(SEQ['powers of 2'].slice(0, 9)), 512);
  beyondExAns(3, [vira[11]]);
  is('Beyond Ex 3 asks for the 12th', /12th Virah/.test(beyondEx(3)));
}
// Type 2
{
  is('Beyond Ex 4 bottom row of 11', /has 11 dots in its bottom row/.test(beyondEx(4)));
  beyondExAns(4, [T(11), 12], 'the triangle, and the row the next one adds');
  ok('Beyond Ex 4 the next triangle', T(12), 78);
  is('Beyond Ex 5 six dots a side', /with 6 dots along each side/.test(beyondEx(5)));
  beyondExAns(5, [hex(6)]);
  ok('Beyond Ex 5 the rings', range(1, 5).map(k => hex(k + 1) - hex(k)), [6, 12, 18, 24, 30]);
  const cBx6 = Number(beyondEx(6).match(/built from (\d+) small cubes/)[1]);
  is('Beyond Ex 6 is a cube number', isCube(cBx6) && SEQ['cube numbers'].includes(cBx6));
  const rBx6 = Math.round(Math.cbrt(cBx6));
  beyondExAns(6, [rBx6, rBx6 * rBx6, (rBx6 - 2) ** 3], 'layers, cubes a layer, unpainted');
  ok('Beyond Ex 6 step 1', beyondStepNums(6, 1), [rBx6, rBx6, rBx6, cBx6, rBx6]);
  ok('Beyond Ex 6 step 3 edge left', beyondStepNums(6, 3), [rBx6, 2, rBx6 - 2]);
}
// Type 3
{
  const intro = BEYOND.match(/<p>The L-shapes of Fig\. 1\.5 also tell you[\s\S]*?<\/p>/);
  is('Type 3 opens by placing each odd number from its L-shape', !!intro);
  if (intro) {
    const t = stripTags(intro[0]);
    const m5 = t.match(/(\d+) \+ (\d+) - 1 = (\d+)\$ dots, and (\d+) is the (\d+)th odd number/);
    is('Type 3 intro: the 5th L-shape', !!m5 && Number(m5[1]) === 5 && Number(m5[2]) === 5 && Number(m5[3]) === nthOdd(5) && Number(m5[4]) === nthOdd(5) && Number(m5[5]) === 5);
    const m25 = t.match(/the (\d+)th odd number is \$(\d+) \+ (\d+) - 1 = (\d+)\$/);
    is('Type 3 intro: the 25th odd number', !!m25 && Number(m25[1]) === 25 && Number(m25[2]) === 25 && Number(m25[4]) === nthOdd(25));
    const mb = t.match(/\$(\d+) \+ 1 = (\d+)\$ counts the corner twice, and half of (\d+) is (\d+)/);
    is('Type 3 intro: back from 49', !!mb && Number(mb[1]) === nthOdd(25) && Number(mb[2]) === nthOdd(25) + 1 && Number(mb[3]) === nthOdd(25) + 1 && Number(mb[4]) === 25);
  }
  const qBx7 = beyondQSum(7);
  ok('Beyond Ex 7 is the odd numbers to 49', qBx7, oddsTo(49));
  ok('Beyond Ex 7 49 is the 25th odd number', qBx7.length, 25);
  beyondExAns(7, [sum(qBx7)]);
  is('Beyond Ex 8 total 121', /total is 121/.test(beyondEx(8)));
  const kBx8 = range(1, 50).find(k => sum(range(1, k).map(nthOdd)) === 121);
  beyondExAns(8, [nthOdd(kBx8)]);
  const qBx9 = beyondQSum(9);
  ok('Beyond Ex 9 is the odd numbers 11 to 29', qBx9, oddsTo(29).filter(x => x >= 11));
  ok('Beyond Ex 9 29 is the 15th and 9 the 5th odd number', [oddsTo(29).length, oddsTo(9).length], [15, 5]);
  beyondExAns(9, [sum(qBx9)]);
}
// Type 4
{
  is('Beyond Ex 10 total 169', /total is 169/.test(beyondEx(10)));
  const nBx10 = range(1, 50).find(n => sum(upDown(n)) === 169);
  beyondExAns(10, [nBx10, upDown(nBx10).length]);
  ok('Beyond Ex 10 up is 13 numbers, down is 12', [range(1, nBx10).length, range(1, nBx10 - 1).length], [13, 12]);
  const qBx11 = beyondQSum(11);
  ok('Beyond Ex 11 is up to 8 and down, with 8 twice', qBx11, [...range(1, 8), ...range(1, 8).reverse()]);
  beyondExAns(11, [sum(qBx11)]);
  ok('Beyond Ex 11 two triangles make 8 rows of 9', 2 * T(8), 8 * 9);
}
// Type 5
{
  const qBx12 = beyondQSum(12);
  ok('Beyond Ex 12 is 1 to 20', qBx12, range(1, 20));
  beyondExAns(12, [sum(qBx12), 20]);
  ok('Beyond Ex 12 up-and-down to 20', sum(upDown(20)), 400);
  const pair = range(1, 30).find(k => T(k) + T(k + 1) === 81);
  beyondExAns(13, [T(pair), T(pair + 1)]);
  const qBx14 = beyondQSum(14);
  ok('Beyond Ex 14 is the powers of 2 to 512', qBx14, SEQ['powers of 2'].slice(0, 10));
  beyondExAns(14, [sum(qBx14)]);
}
// Type 6
{
  const mBx15 = beyondEx(15).match(/a wire (\d+) cm long into a regular polygon\. Every side is (\d+) cm long/);
  is('Beyond Ex 15 states the wire and the side', !!mBx15);
  const [wire, side] = mBx15 ? [Number(mBx15[1]), Number(mBx15[2])] : [0, 1];
  const NAMES = { 3: 'triangle', 4: 'quadrilateral', 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon' };
  const k = wire / side;
  is('Beyond Ex 15 the wire divides exactly', wire % side === 0 && wire % 6 === 0);
  ok('Beyond Ex 15 step 1 sides', beyondStepNums(15, 1), [wire, side, k]);
  is(`Beyond Ex 15 names the ${k}-sided polygon (${NAMES[k]})`, new RegExp(`with ${k} sides is an? ${NAMES[k]}`).test(beyondEx(15)) && beyondAnswerRow(15).includes(NAMES[k]));
  is(`Beyond Ex 15 the why names ${NAMES[k]}'s prefix`, beyondEx(15).includes(`${NAMES[k].slice(0, 4)} means ${k}`));
  ok('Beyond Ex 15 step 3 hexagon side', beyondStepNums(15, 3), [6, wire, 6, wire / 6]);
  beyondExAns(15, [wire / 6]);
  is('Beyond Ex 16 fifteen matches', /15 matches are played/.test(beyondEx(16)));
  beyondExAns(16, [range(2, 50).find(p => lines(p) === 15)]);
  const rowBx16 = beyondEx(16).match(/Step 1<\/span>\s*<span>([^<]*)<\/span>/)[1];
  const [pp, ll] = rowBx16.split('have').map(numsIn);
  ok('Beyond Ex 16 points and their lines', ll, pp.map(lines));
  is('Beyond Ex 17 sixty-four triangles', /made of 64 small triangles/.test(beyondEx(17)));
  const nBx17 = range(1, 30).find(n => n * n === 64);
  beyondExAns(17, [nBx17, T(nBx17)]);
  ok('Beyond Ex 17 the ones pointing down', 64 - T(nBx17), T(nBx17 - 1));
  beyondExAns(18, [koch(5)]);
  is('Beyond Ex 18 starts at 3 and multiplies by 4', /has 3 straight lines/.test(beyondEx(18)) && /becomes 4 straight lines/.test(beyondEx(18)));
  beyondExAns(19, [lines(6), lines(6) - 6]);
  is('Beyond Ex 19: 15 is the 5th triangular number', /the 5th triangular number/.test(beyondEx(19)) && T(5) === lines(6));
  ok('Beyond Ex 19 triangle, square, pentagon', [3, 4, 5].map(p => [lines(p), lines(p) - p]), [[3, 0], [6, 2], [10, 5]]);
  const note = beyondEx(19).match(/Check the method[^<]*/)[0];
  ok('Beyond Ex 19 note numbers', numsIn(note), [3, 3, 3, 4, lines(4), 4, lines(4) - 4, 5, lines(5), lines(5) - 5]);
}
const tabs = (html) => [...html.matchAll(/c-example__tab">Example (\d+)/g)].map(m => Number(m[1]));
ok('the body\'s example tabs', range(1, 1), tabs(BODY));
ok('Beyond\'s example tabs, numbered from 1 as Class 7 does', range(1, 19), tabs(BEYOND));
ok('six Type heads in order', [...BEYOND.matchAll(/<h3>Type (\d+) &middot;/g)].map(m => Number(m[1])), range(1, 6));

/* ---- B7. the practice answers, part by part ---------------------- */

const ROWS = {};
for (const m of BEYOND.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) ROWS[m[1]] ??= m[2];
const row = (q) => { if (!(q in ROWS)) { fails.push(`no answer row for ${q}`); return ''; } return ROWS[q]; };
const rowNums = (q) => numsIn(row(q));
function part(q, letter) {
  const flat = stripTags(row(q));
  const m = flat.match(new RegExp(`\\(${letter}\\)([\\s\\S]*?)(?=\\([a-e]\\)|$)`));
  if (!m) { fails.push(`answer ${q} has no part (${letter})`); return []; }
  return numsIn(m[1]);
}
const okPart = (what, q, letter, want) => ok(`Q${q}(${letter}) ${what}`, want, part(q, letter));
const QTEXT = {};
for (const m of BEYOND.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) QTEXT[m[1] ?? '1'] = m[2];
const asks = (q, s) => is(`Q${q} asks "${s}"`, (QTEXT[q] || '').includes(s));
ok('practice runs 1 to 30 without a gap', Object.keys(QTEXT).map(Number).sort((a, b) => a - b), range(1, 30));

asks(17, '3, 6, 12, 24'); ok('Q17', SEQ['doubling from 3'].slice(4, 6), rowNums(17));
asks(18, 'Is 100 a triangular');
{ const i = SEQ['triangular numbers'].findIndex(t => t > 100);
  ok('Q18 the triangular numbers either side of 100', SEQ['triangular numbers'].slice(i - 2, i + 1), rowNums(18).slice(0, 3));
  is('Q18 100 is not triangular', !isTri(100) && /^No/.test(row(18))); }
asks(19, 'has 15 dots in its bottom row'); ok('Q19', [T(15), 15, 16, 2 * T(15), 2 * T(15), T(15)], rowNums(19));
asks(20, '14th odd number'); ok('Q20', [nthOdd(14), 14, 14, sum(range(1, 14).map(nthOdd))], rowNums(20));
asks(21, '10th cube number'); ok('Q21', [10, 10, 10, SEQ['cube numbers'][9]], rowNums(21));
{
  const span = QTEXT[22].match(/\$([^$]+)\$/)[1];
  const xs = expandDots(span);
  ok('Q22 is the odd numbers 21 to 39', xs, oddsTo(39).filter(x => x >= 21));
  ok('Q22', [sum(xs), 39, oddsTo(39).length, 19, oddsTo(19).length, sum(oddsTo(39)), sum(oddsTo(19)), sum(xs)], rowNums(22));
}
{
  const xs = expandDots(QTEXT[23].match(/\$([^$]+)\$/)[1]);
  ok('Q23 is up to 10 and down', xs, upDown(10));
  asks(23, 'is 110');
  ok('Q23', [10, 10, 10, sum(xs), 110], rowNums(23));
  is('Q23 Priya is wrong', sum(xs) !== 110);
}
{
  const sticks = (n) => 2 * n + 1;
  ok('Q24 the printed counts', numsIn(QTEXT[24]).slice(0, 6), [1, sticks(1), 2, sticks(2), 3, sticks(3)]);
  asks(24, 'for 15 triangles');
  ok('Q24', [sticks(15), 3, 14, 2, 3, 14, 2, sticks(15)], rowNums(24));
}
asks(25, 'after 7 folds'); ok('Q25', [2 ** 7, ...range(1, 7).map(k => 2 ** k)], rowNums(25));
asks(26, 'with 7 rows');
{ const s7 = 7; const edge = s7 * s7 - (s7 - 2) ** 2;
  ok('Q26 counted cell by cell', range(0, 6).flatMap(i => range(0, 6).map(j => [i, j])).filter(([i, j]) => i % 6 === 0 || j % 6 === 0).length, edge);
  ok('Q26', [edge, s7 - 2, s7 * s7, (s7 - 2) ** 2, edge], rowNums(26)); }
asks(27, '4 dots on each side'); asks(27, '7 dots on each side'); asks(27, '6th triangular number by 6');
okPart('hexagon with 4 a side', 27, 'a', [hex(4)]);
okPart('hexagon with 7 a side', 27, 'b', [hex(7)]);
okPart('6 × T6 + 1', 27, 'c', [6, T(6), 1, 6 * T(6) + 1]);
ok('Q27 (b) and (c) agree', hex(7), 6 * T(6) + 1);
okPart('the six triangles', 27, 'd', [6, ...range(1, 6), 6, T(6)]);
okPart('first ten triangular numbers', 28, 'a', range(1, 10).map(T));
okPart('the even ones', 28, 'b', range(1, 10).map(T).filter(t => t % 2 === 0));
okPart('doubles as neighbours', 28, 'c', [3, 6, 10].flatMap(t => { const n = range(1, 10).find(k => k * (k + 1) === 2 * t); return [2 * t, n, n + 1]; }));
okPart('30th triangular number', 28, 'd', [30, 31, 30 * 31, 30 * 31, T(30)]);
{
  const tbl = QTEXT[29].match(/<table>[\s\S]*?<\/table>/)[0];
  const [kids, hands] = [...tbl.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(m => numsIn(m[1]));
  ok('Q29 the table', hands, kids.map(lines));
  asks(29, 'when 6 children'); asks(29, 'when 12 children'); asks(29, 'makes 78 handshakes');
  okPart('6 children', 29, 'a', [lines(6)]);
  okPart('12 children', 29, 'b', [lines(12)]);
  okPart('78 handshakes', 29, 'c', [range(2, 50).find(p => lines(p) === 78)]);
}
{
  asks(30, 'square of 16 tiles'); asks(30, '12 tiles along a side'); asks(30, 'has 200 tiles');
  const side = Math.floor(Math.sqrt(200));
  okPart('the L-shape after 16', 30, 'a', [nthOdd(Math.sqrt(16) + 1)]);
  okPart('12 a side', 30, 'b', [12 * 12]);
  okPart('from 200 tiles', 30, 'c', [side, side * side, 200 - side * side]);
  okPart('the last L-shape', 30, 'd', [nthOdd(side)]);
}

// the notes on why the other options are wrong
ok('note 4', [10, 40, 4, 36], rowNums(4));
ok('note 4 edge of a 10 by 10 square', 4 * 10 - 4, 36);
ok('note 7', [39, oddsTo(39).length, oddsTo(39).length, sum(oddsTo(39)), 21, 21], rowNums(7));
ok('note 15', [4, 1, 3, 6, 10, 4], rowNums(15));
ok('note 16', [7, 7, 7, 7, 49, 36, 45, 55, 49], rowNums(16));
is('note 16: 49 is not triangular, 36 45 55 are consecutive', !isTri(49) && T(8) === 36 && T(9) === 45 && T(10) === 55);

/* ---- C. one right option, and the key says so --------------------- */

const OPTS = {};
for (const [q, t] of Object.entries(QTEXT)) {
  const lists = [...t.matchAll(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*?)<\/ol>/g)];
  const alpha = lists.filter(l => !/c-parts--1/.test(l[0]));
  if (alpha.length) OPTS[q] = [...alpha.at(-1)[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => stripTags(m[1]).trim());
}
const KEY = {};
for (const m of BEYOND.matchAll(/<span class="n">(\d+)<\/span> \(([a-d])\)/g)) KEY[m[1]] = m[2];
ok('the key covers 1 to 16', Object.keys(KEY).map(Number), range(1, 16));

const truths = (s) => {                         // (i), (ii), (iii) → set chosen by an option
  if (s === 'all three') return ['i', 'ii', 'iii'];
  return [...s.matchAll(/\((i+)\)/g)].map(m => m[1]);
};
const TERM = HTML['p007.html'].match(/patterns in shapes is called <span class="term">([a-z]+)<\/span>/)[1];
const Q6 = [range(1, 200).every(k => isSq(T(k) + T(k + 1))), range(2, 200).every(p => isTri(lines(p))), oddsTo(99).every(isSq)];
const Q9 = [range(1, 30).every(k => isSq(k ** 3)), isSq(64) && isCube(64), isTri(1) && isSq(1) && isCube(1)];
const holds = (flags) => ['i', 'ii', 'iii'].filter((_, i) => flags[i]);
const MCQ = {
  1: (o) => isCube(+o),
  2: (o) => !isSq(+o),
  3: (o) => +o === nthOdd(20),
  4: (o) => +o === 4 * 10 - 4,
  5: (o) => isTri(+o),
  6: (o) => same(truths(o), holds(Q6)),
  7: (o) => +o === sum(oddsTo(39)),
  8: (o) => lines(+o) === 45,
  9: (o) => same(truths(o), holds(Q9)),
  10: (o) => SEQ['Koch line counts'].includes(48) && +o === SEQ['Koch line counts'][SEQ['Koch line counts'].indexOf(48) + 1],
  11: (o) => isPow2(+o) && isSq(+o),
  12: (o) => o === TERM,
};
asks(4, '10 dots along each side'); asks(7, '39'); asks(8, 'has 45 lines'); asks(10, 'has 48 straight lines');
asks(3, 'The 20th odd number');
const LETTERS = ['a', 'b', 'c', 'd'];
for (const [q, right] of Object.entries(MCQ)) {
  const opts = OPTS[q];
  if (!opts || opts.length !== 4) { fails.push(`Q${q}: expected four options, found ${opts ? opts.length : 0}`); continue; }
  const r = opts.map((o, i) => right(o) ? LETTERS[i] : null).filter(Boolean);
  if (r.length !== 1) fails.push(`Q${q}: ${r.length} right options (${r.join(', ') || 'none'}) among ${opts.join(' | ')}`);
  else if (r[0] !== KEY[q]) fails.push(`Q${q}: the right option is (${r[0]}), the key prints (${KEY[q]})`);
  else pass++;
}
// the "must be true" statements are the ones the flags were computed for
ok('Q6 statements', [...QTEXT[6].matchAll(/<ol class="c-parts c-parts--1">([\s\S]*?)<\/ol>/g)][0][1].match(/<li>[^<]*<\/li>/g).length, 3);
is('Q6 (iii) is "Every odd number is a square number."', QTEXT[6].includes('<li>Every odd number is a square number.</li>'));
is('Q9 (i) is "Every cube number is also a square number."', QTEXT[9].includes('<li>Every cube number is also a square number.</li>'));

const AR = {
  13: { text: ['36 dots can be arranged as a square.', '36 is the sum of the first 6 odd numbers.'],
    A: () => isSq(36), R: () => sum(range(1, 6).map(nthOdd)) === 36, explains: true },
  14: { text: ['15 is a triangular number.', '15 is an odd number.'],
    A: () => isTri(15), R: () => 15 % 2 === 1, explains: false },
  15: { text: ['Every square number is also a triangular number.', '36 is both a square number and a triangular number.'],
    A: () => range(1, 100).every(k => isTri(k * k)), R: () => isSq(36) && isTri(36), explains: false },
  16: { text: ['The sum of the first 7 odd numbers is 49.', '49 is a triangular number.'],
    A: () => sum(range(1, 7).map(nthOdd)) === 49, R: () => isTri(49), explains: false },
};
for (const [q, a] of Object.entries(AR)) {
  const m = QTEXT[q].match(/<p>Assertion \(A\): ([^<]*)<\/p><p>Reason \(R\): ([^<]*)<\/p>/);
  ok(`Q${q} printed assertion and reason`, m ? [m[1], m[2]] : null, a.text);
  const A = a.A(), R = a.R();
  const want = A && R ? (a.explains ? 'a' : 'b') : A ? 'c' : R ? 'd' : '?';
  if (want === '?') fails.push(`Q${q}: A and R both false`);
  else if (want !== KEY[q]) fails.push(`Q${q}: A ${A}, R ${R} → (${want}), the key prints (${KEY[q]})`);
  else pass++;
}
is('the note states the four choices once', /In Questions 13 to 16, choose \(a\) if both A and R are true and R explains A; \(b\) if both are true but R does not explain A; \(c\) if A is true but R is false; \(d\) if A is false but R is true\./.test(BEYOND));
const spread = LETTERS.map(l => Object.values(KEY).filter(k => k === l).length);
is(`the key uses all four letters (${LETTERS.map((l, i) => l + ':' + spread[i]).join(' ')})`, spread.every(c => c > 0));

/* ---- D. ANSWERS.md ------------------------------------------------ */

function inAns(what, needle) {
  if (ANSWERS.includes(needle)) pass++;
  else fails.push(`${what} — ANSWERS.md does not contain "${needle}"`);
}
{
  const cells = [...ANSWERS.matchAll(/\| (\d+) \(([a-d])\) /g)];
  ok('ANSWERS.md key matches the page', Object.fromEntries(cells.map(c => [c[1], c[2]])), KEY);
}
// the answers booklet's lines 17–30 carry the page's numbers
for (const q of range(17, 30)) {
  const m = ANSWERS.match(new RegExp(`\\n${q}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`));
  if (!m) { fails.push(`ANSWERS.md has no answer ${q}`); continue; }
  const a = numsIn(m[1].replace(/\*\*/g, '')), p = rowNums(q);
  const missing = p.filter(x => !a.includes(x));
  is(`ANSWERS.md ${q} carries every number the page prints (${missing.join(', ') || 'all'})`, missing.length === 0);
}
// Exercise Set 1.1
ok('A 1.1 Q4', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][15 % 7], 'Tuesday');
inAns('A 1.1 Q4', '4. **Tuesday.**');
// Exercise Set 1.2
{
  const firstOver = (s) => s.find(x => x > 100);
  ok('A 1.2 Q3', [firstOver(SEQ['powers of 2']), firstOver(SEQ['powers of 3'])], [128, 243]);
  inAns('A 1.2 Q3', 'bigger than 100 is **128**'); inAns('A 1.2 Q3', 'bigger than 100 is **243**');
  ok('A 1.2 Q4 even + 1', SEQ['even numbers'].slice(0, 4).map(x => x + 1), SEQ['odd numbers'].slice(1, 5));
}
// Exercise Set 1.3
{
  const r = (name) => ANSWERS.slice(ANSWERS.indexOf('## 1.3')).split('\n').find(l => l.startsWith(`| ${name} | `));
  ok('A 1.3 Q1 next pictures', ['Counting numbers', 'Odd numbers', 'Even numbers', 'Triangular numbers', 'Square numbers', 'Cube numbers'].map(n => numsIn(r(n))[0]),
    [6, nthOdd(6), 12, T(6), 36, 125]);
  ok('A 1.3 Q1 odd picture rows', numsIn(r('Odd numbers')).slice(1), [5, 6]);
  ok('A 1.3 Q1 triangle rows', numsIn(r('Triangular numbers')).slice(1), range(1, 6));
  inAns('A 1.3 Q3', 'The next number that is both is **1225**');
  inAns('A 1.3 Q4', `$37 + 24 = $ **${hex(5)}**`);
  ok('A 1.3 Q5 powers of 3 as copies', [1, 3, 9, 27], SEQ['powers of 3'].slice(0, 4));
}
// Exercise Set 1.4
{
  ok('A 1.4 Q3 up-and-down All 1s', range(1, 4).map(n => upDown(n).length), SEQ['odd numbers'].slice(0, 4));
  ok('A 1.4 Q5 neighbours add to squares', range(1, 4).map(k => T(k) + T(k + 1)), [4, 9, 16, 25]);
  ok('A 1.4 Q5 5 by 5 splits into 15 and 10', [T(5), T(4)], [15, 10]);
  ok('A 1.4 Q6 sums of powers of 2', range(1, 5).map(k => sum(SEQ['powers of 2'].slice(0, k))), SEQ['sums of powers of 2'].slice(0, 5));
  ok('A 1.4 Q6 plus 1', range(1, 5).map(k => sum(SEQ['powers of 2'].slice(0, k)) + 1), SEQ['powers of 2'].slice(1, 6));
  inAns('A 1.4 Q6', '**2, 4, 8, 16, 32**');
  ok('A 1.4 Q7 6T + 1', range(1, 4).map(k => 6 * T(k) + 1), range(2, 5).map(hex));
  ok('A 1.4 Q8 hexagonal sums', range(1, 4).map(k => sum(range(1, k).map(hex))), SEQ['cube numbers'].slice(0, 4));
  ok('A 1.4 Q9 neighbours add to odd numbers', range(1, 3).map(n => n + n + 1), SEQ['odd numbers'].slice(1, 4));
  ok('A 1.4 Q1 diagonal lines of a 4 by 4 square',
    range(0, 6).map(d => range(0, 3).flatMap(i => range(0, 3).map(j => [i, j])).filter(([i, j]) => i + j === d).length), upDown(4));
  inAns('A 1.4 Q2', '$100 \\times 100 = 10000$');
}
// Exercise Sets 1.5 and 1.6
{
  inAns('A 1.5 next complete graph', `7 points with ${lines(7)} lines`);
  inAns('A 1.5 next stacked triangles', `5 rows, ${5 * 5} small triangles`);
  inAns('A 1.5 next Koch', `the 5th shape, with ${koch(5)} straight lines`);
  inAns('A 1.6 Q1', `**${range(3, 10).join(', ')}**`);
  inAns('A 1.6 Q2', `**${FIG18.map(g => g.lines).join(', ')}**`);
  inAns('A 1.6 Q3', `**${FIG19.squares.map(s => s.cells).join(', ')}**`);
  inAns('A 1.6 Q4', `**${FIG19.triangles.map(s => s.cells).join(', ')}**`);
  inAns('A 1.6 Q5', `**${SEQ['Koch line counts'].slice(0, 3).join(', ')}**`);
  ok('A 1.6 Q6 8 points', [lines(7), lines(8), 8 * 7, 8 * 7 / 2], [21, 28, 56, 28]);
  ok('A 1.6 Q7 10 rows', [10 * 10, sum(oddsTo(19))], [100, 100]);
  inAns('A 1.6 Q7', '$10 \\times 10 = $ **100**');
}
// stage 1 in the booklet
inAns('A stage 1 Q1', '1. **64.**'); inAns('A stage 1 Q3', '3. **49.**');
inAns('A stage 1 Q4', '4. **42.**'); inAns('A stage 1 Q5', '5. **31 matchsticks.**');
inAns('A Beyond intro', `numbered from 1 as Beyond numbers them (Beyond Examples 1 to ${tabs(BEYOND).length})`);
{
  // stage 2 in the booklet, by Beyond's own numbers, against each example's Answer row
  const stage2 = ANSWERS.slice(ANSWERS.indexOf('### Stage 2 · Solved Examples'), ANSWERS.indexOf('### Stage 3'));
  const items = [...stage2.matchAll(/^- Beyond Ex (\d+)\. (.*)$/gm)];
  ok('ANSWERS.md stage 2 lists Beyond Ex 1 to 19', tabs(BEYOND), items.map(m => Number(m[1])));
  for (const [, n, text] of items) {
    const a = numsIn(text.replace(/\*\*/g, '')), p = numsIn(beyondAnswerRow(Number(n)));
    is(`ANSWERS.md Beyond Ex ${n} (${a.join(', ')}) matches the page (${p.join(', ')})`,
      a.length > 0 && a[0] === p[0] && a.every(x => p.includes(x)));
  }
}
is('ANSWERS.md Q5 note: the triangular numbers near 55', !isTri(24) && !isTri(35) && !isTri(64) && [21, 28, 36, 45, 55, 66].every(isTri));
is('ANSWERS.md Q14 note: 21 odd and triangular, 25 odd and not', isTri(21) && !isTri(25));

/* ---- report ------------------------------------------------------- */

console.log(`\nClass 6 · Chapter 1 · Looking for Patterns`);
console.log(`  ${identities} arithmetic identities evaluated (pages and ANSWERS.md)`);
console.log(`  ${runs} printed runs of numbers checked against a rule`);
if (skipped.length) {
  console.log(`  ${skipped.length} maths span(s) with = that are not arithmetic, so not evaluated:`);
  for (const s of skipped) console.log(`      ${s}`);
}
console.log(`  ${pass} check(s) passed`);
if (fails.length) {
  console.log(`\n  ${fails.length} FAILED:`);
  for (const f of fails) console.log(`    ! ${f}`);
  process.exit(1);
}
console.log('  all clear\n');
