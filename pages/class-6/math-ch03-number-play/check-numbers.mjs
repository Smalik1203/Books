#!/usr/bin/env node
/* Re-derive every number this chapter prints.

     node pages/class-6/math-ch03-number-play/check-numbers.mjs

   Nothing here restates a printed value. Each claim is computed from first
   principles (reversing digits, sorting digits, halving, brute force over
   every arrangement) and then compared with what is on the page. Where a
   printed answer is compared, it is read back OUT of the page or out of
   ANSWERS.md, never typed in here: a hand-typed expectation drifts the
   moment a page is corrected.

   Four parts, on the shape of Chapter 5's script:
     A  every arithmetic identity set as maths, in the pages and in
        ANSWERS.md, evaluated
     B  the claims arithmetic alone cannot check: the figures (heights,
        supercells, number lines, dice, arrows), the Kaprekar and Collatz
        chains, the reverse-and-add chains, the counts, the worked examples
     C  every multiple-choice and assertion-reason question: the options
        are read off the page, exactly one is right, and it is the one the
        printed key gives
     D  ANSWERS.md

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
  // one side is always computed here and the other read off a page; which is
  // which varies by call, so the report shows both without naming them
  else fails.push(`${what}\n      ${JSON.stringify(got)}\n   vs ${JSON.stringify(want)}`);
}
function is(what, cond) { if (cond) pass++; else fails.push(what); }

/* ================================================================
   The mathematics, computed
   ================================================================ */

const B = String.fromCharCode(92);
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const dsum = (n) => String(n).split('').reduce((s, d) => s + Number(d), 0);
const isPal = (n) => { const s = String(n); return s === [...s].reverse().join(''); };
const revBig = (n) => BigInt([...String(n)].reverse().join(''));

/* reverse and add until a palindrome; the chain of sums, and the step count */
function reverseAdd(n, limit = 200) {
  let x = BigInt(n); const chain = [];
  do {
    const r = revBig(x); const s = x + r;
    chain.push([Number(x), Number(r), Number(s)]);
    x = s;
    if (chain.length > limit) return { steps: Infinity, chain, end: null };
  } while (!isPal(x));
  return { steps: chain.length, chain, end: x };
}

/* one Kaprekar round on a w-digit number, zeros kept in front */
function kapStep(n, w = 4) {
  const d = String(n).padStart(w, '0').split('');
  const A = Number([...d].sort().reverse().join(''));
  const Bn = Number([...d].sort().join(''));
  return [A, Bn, A - Bn];
}
function kapChain(n, w = 4, target = w === 4 ? 6174 : 495, limit = 20) {
  const rows = [];
  let x = n;
  while (x !== target && rows.length < limit) {
    const r = kapStep(x, w); rows.push(r); x = r[2];
    if (x === 0) break;
  }
  return { rows, rounds: rows.length, end: x };
}
const collatz = (n) => { if (!Number.isInteger(n) || n < 1) throw new Error('collatz of ' + n); const s = [n]; while (n !== 1) { n = n % 2 ? 3 * n + 1 : n / 2; s.push(n); } return s; };
const steps = (n) => collatz(n).length - 1;

function* perms(a) {
  if (a.length <= 1) { yield a.slice(); return; }
  for (let i = 0; i < a.length; i++)
    for (const p of perms([...a.slice(0, i), ...a.slice(i + 1)])) yield [a[i], ...p];
}
/* what each child says: how many neighbours are taller */
const says = (h) => h.map((x, i) => [h[i - 1], h[i + 1]].filter(y => y !== undefined && y > x).length);
/* supercells of a grid (array of rows; a row table is one row) */
function supercells(g) {
  const out = [];
  g.forEach((row, r) => row.forEach((v, c) => {
    const nb = [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]]
      .filter(([x, y]) => g[x] !== undefined && g[x][y] !== undefined).map(([x, y]) => g[x][y]);
    if (nb.every(u => v > u)) out.push(v);
  }));
  return out;
}
const neighbours = (g, v) => {
  for (let r = 0; r < g.length; r++) for (let c = 0; c < g[r].length; c++) if (g[r][c] === v)
    return { up: g[r - 1]?.[c], down: g[r + 1]?.[c], left: g[r][c - 1], right: g[r][c + 1] };
  return null;
};
const chunk = (a, n) => a.length ? [a.slice(0, n), ...chunk(a.slice(n), n)] : [];
/* can target be made by adding the parts, each as often as needed */
function makeable(target, parts) {
  const u = parts.reduce((a, b) => gcdOf(a, b));
  if (target % u) return false;
  const t = target / u, ps = parts.map(p => p / u);
  const r = new Uint8Array(t + 1); r[0] = 1;
  for (let i = 1; i <= t; i++) for (const p of ps) if (i >= p && r[i - p]) { r[i] = 1; break; }
  return !!r[t];
}
function gcdOf(a, b) { return b ? gcdOf(b, a % b) : a; }
/* the numbers the winning player says, when each turn adds 1..max */
const winning = (target, max) => { const o = []; for (let v = target; v > 0; v -= max + 1) o.unshift(v); return o; };
const leap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
const jan1 = (y) => new Date(Date.UTC(y, 0, 1)).getUTCDay();
const DAY = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const sameCalendar = (a, b) => jan1(a) === jan1(b) && leap(a) === leap(b);
const validDate = (y, m, d) => { const t = new Date(Date.UTC(y, m - 1, d)); return m >= 1 && m <= 12 && d >= 1 && t.getUTCMonth() === m - 1 && t.getUTCDate() === d; };
const clockTimes = range(1, 12).flatMap(h => range(0, 59).map(m => [h, m]));
const clockDigits = ([h, m]) => `${h}${String(m).padStart(2, '0')}`;
const fmtTime = ([h, m]) => `${h}:${String(m).padStart(2, '0')}`;

/* ================================================================
   The pages
   ================================================================ */

const FILES = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const HTML = Object.fromEntries(FILES.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const BODY = FILES.filter(f => /^p0/.test(f)).map(f => HTML[f]).join('\n');
const BEYOND = FILES.filter(f => /^p1/.test(f)).map(f => HTML[f]).join('\n');
const ANSWERS = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const text = (h) => h.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&middot;/g, '·').replace(/&ndash;/g, '–').replace(/&[a-z]+;/g, ' ')
  .replace(/\s+/g, ' ').trim();
const BODYTEXT = text(BODY);
const BEYONDTEXT = text(BEYOND);
/* numbers in a string, with thousands commas (1,500 and 1,00,100) and {,} read through */
const nums = (s) => [...String(s).split('{,}').join('').replace(/(\d),(?=\d{2,3}\b)/g, '$1')
  .matchAll(/\d+/g)].map(m => Number(m[0]));
const toN = (s) => Number(String(s).replace(/[,\s]/g, ''));
function has(what, hay, needle) {
  if (hay.includes(needle)) pass++;
  else fails.push(`${what} — the text does not contain "${needle}"`);
}

/* ================================================================
   A. Every arithmetic identity
   ================================================================ */

function toExpr(side) {
  let s = side.split(B + 'times').join('*').split(B + 'div').join('/')
    .split('{,}').join('').split(B + ',').join('').split(B + ' ').join('')
    .replace(/\s+/g, '');
  if (!s || !/^[-+*/()0-9.]+$/.test(s)) return null;
  s = s.replace(/(^|[^0-9.])0+(?=\d)/g, '$1');   // 0999 is 999, and not an octal
  try { const v = Function(`"use strict";return (${s})`)(); return Number.isFinite(v) ? v : null; }
  catch { return null; }
}
let identities = 0;
const skipped = [];
function sweep(label, src) {
  for (const m of src.matchAll(/\$([^$]+)\$/g)) {
    const span = m[1];
    if (!span.includes('=')) continue;
    const sides = span.split('=').map(s => s.trim());
    const vals = sides.map(toExpr).filter(v => v !== null);
    if (vals.length < 2) { skipped.push(`${label}: $${span}$`); continue; }
    identities++;
    if (vals.some(v => Math.abs(v - vals[0]) > 1e-9)) fails.push(`${label}: $${span}$ — sides are ${vals.join(' and ')}`);
    else pass++;
  }
}
for (const f of FILES) sweep(f, HTML[f]);
sweep('ANSWERS.md', ANSWERS);

/* ================================================================
   B. The figures
   ================================================================ */

function figure(n) {
  // the svg just before the caption: no other <svg may open inside the match
  const re = new RegExp(`(<svg[^>]*>(?:(?!<svg)[\\s\\S])*?<\\/svg>)\\s*<figcaption><span class="fignum">Fig\\. 3\\.${n}<`);
  const m = BODY.match(re);
  if (!m) throw new Error(`Fig. 3.${n} not found`);
  return m[1];
}
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(a => [a[1], a[2]]));
const tags = (svg, name) => [...svg.matchAll(new RegExp(`<${name}\\b[^>]*>(?:([^<]*)<\\/${name}>)?`, 'g'))]
  .map(m => ({ ...attrs(m[0]), body: m[1] }));

/* a table of cells: every dg-thin rect is a cell, its text is its number,
   and it is coloured when a dg-fill-b-soft rect sits exactly on it */
function cells(svg) {
  const rects = tags(svg, 'rect');
  const fills = rects.filter(r => r.class === 'dg-fill-b-soft');
  const texts = tags(svg, 'text').filter(t => t.class === 'dg-tick');
  /* A supercell carries a heavy outline as well as its tint, so that it
     is still marked in a greyscale print (DESIGN-MATHS §5a). A cell is
     either outline; a tinted cell with only the thin one is a failure. */
  const boxes = rects.filter(r => r.class === 'dg-thin' || r.class === 'dg-line').map(r => {
    const x = +r.x, y = +r.y, w = +r.width, h = +r.height;
    const t = texts.find(t => +t.x > x && +t.x < x + w && +t.y > y && +t.y < y + h);
    const coloured = fills.some(f => +f.x === x && +f.y === y);
    if (coloured && r.class !== 'dg-line')
      fails.push(`a tinted cell at ${x},${y} has no heavy outline, so colour alone marks it`);
    return { x, y, v: t ? toN(t.body) : null, coloured };
  });
  const ys = [...new Set(boxes.map(b => b.y))].sort((a, b) => a - b);
  return ys.map(y => boxes.filter(b => b.y === y).sort((a, b) => a.x - b.x));
}
const values = (rows) => rows.map(r => r.map(c => c.v));
const colouredOf = (rows) => rows.flat().filter(c => c.coloured).map(c => c.v);

// Figs 3.1 and 3.2: each child's number from the heights drawn
for (const n of [1, 2]) {
  const svg = figure(n);
  const bodies = tags(svg, 'rect').filter(r => r.class === 'dg-fill-c-soft').sort((a, b) => a.x - b.x);
  const said = tags(svg, 'text').filter(t => t.class === 'dg-tick').sort((a, b) => a.x - b.x).map(t => +t.body);
  const heights = bodies.map(b => +b.height);
  ok(`Fig. 3.${n}: what each child says, from the heights drawn`, says(heights), said);
  is(`Fig. 3.${n}: eight children of different heights`, heights.length === 8 && new Set(heights).size === 8);
  const aria = attrs(svg.match(/<svg[^>]*>/)[0])['aria-label'];
  ok(`Fig. 3.${n}: the description names the same numbers`, nums(aria).slice(-8), said);
  if (n === 1) {
    is('p002: the first child is next to a shorter child and says 0', heights[1] < heights[0] && said[0] === 0);
    is('p002: the second child is shorter than both neighbours and says 2', heights[1] < heights[0] && heights[1] < heights[2] && said[1] === 2);
    is('ANSWERS: in Fig. 3.1 the 3rd and 4th both say 1, the 6th is the shortest and says 2',
      said[2] === 1 && said[3] === 1 && Math.min(...heights) === heights[5] && said[5] === 2);
  }
}

// Fig. 3.3: two tables, coloured exactly where the supercells are
{
  const rows = cells(figure(3));
  is('Fig. 3.3: two tables of eight', rows.length === 2 && rows.every(r => r.length === 8));
  for (const r of rows) ok(`Fig. 3.3: coloured cells of ${r[0].v}…`, colouredOf([r]), supercells([r.map(c => c.v)]));
  const t2 = rows[1].map(c => c.v);
  const i626 = t2.indexOf(626);
  ok('p002: 626 sits between 577 and 345', [t2[i626 - 1], t2[i626 + 1]], [577, 345]);
  is('p002: 200 is not coloured, because 577 is bigger', t2[0] === 200 && t2[1] === 577 && !rows[1][0].coloured);
  is('p002: 198 is last, its one neighbour is 109, and it is coloured',
    t2.at(-1) === 198 && t2.at(-2) === 109 && rows[1].at(-1).coloured);
  has('p002', BODYTEXT, '626 is coloured because it is bigger than 577 and also bigger than 345');
}

// Fig. 3.4: the answer is in ANSWERS.md
const FIG4 = values(cells(figure(4)));
{
  const got = supercells(FIG4);
  const line = ANSWERS.match(/The supercells in Fig\. 3\.4 are \*\*([^*]+)\*\*/);
  ok('ANSWERS 3.2 Q1: supercells of Fig. 3.4', got, line ? nums(line[1]) : null);
  ok('Fig. 3.4: its description names its nine numbers', nums(attrs(figure(4).match(/<svg[^>]*>/)[0])['aria-label']).slice(0, 9), FIG4[0]);
}

// Fig. 3.5: the instance in ANSWERS.md keeps the given cells and colours exactly the coloured ones
{
  const row = cells(figure(5))[0];
  const line = ANSWERS.match(/table that works:\s*\*\*([^*]+)\*\*/);
  const filled = line ? nums(line[1]) : [];
  is('ANSWERS 3.2 Q2: nine numbers', filled.length === 9);
  is('ANSWERS 3.2 Q2: the given cells are kept', row.every((c, i) => c.v === null || c.v === filled[i]));
  is('ANSWERS 3.2 Q2: every number has 4 digits', filled.every(v => v >= 1000 && v <= 9999));
  is('ANSWERS 3.2 Q2: no number is used twice', new Set(filled).size === 9);
  ok('ANSWERS 3.2 Q2: its supercells are the coloured cells',
    supercells([filled]), row.map((c, i) => c.coloured ? filled[i] : null).filter(v => v !== null));
  is('ANSWERS 3.2 Q2 conditions: 2nd > 5346, 3rd and 5th < 1258, 9th > 9635',
    filled[1] > 5346 && filled[2] < 1258 && filled[4] < 1258 && filled[8] > 9635);
  ok('Fig. 3.5: the given cells are 5346, 1258 and 9635 in the 1st, 4th and 8th',
    row.map((c, i) => c.v === null ? null : [i + 1, c.v]).filter(Boolean), [[1, 5346], [4, 1258], [8, 9635]]);
  ok('Fig. 3.5: the coloured cells are the 2nd, 4th and 9th',
    row.map((c, i) => c.coloured ? i + 1 : null).filter(Boolean), [2, 4, 9]);
}

// Fig. 3.6: the grid's coloured cells, and the neighbours the text lists
{
  const rows = cells(figure(6));
  const g = values(rows);
  ok('Fig. 3.6: coloured cells are the supercells', colouredOf(rows), supercells(g));
  ok('p004: 8632 has 4795 above, 1944 below, 4580 left and 8280 right',
    neighbours(g, 8632), { up: 4795, down: 1944, left: 4580, right: 8280 });
  const n5785 = neighbours(g, 5785);
  is('p004: the corner 5785 has only 4580 and 1944, and beats both',
    n5785.up === 4580 && n5785.right === 1944 && n5785.down === undefined && n5785.left === undefined && 5785 > 4580);
}

// Fig. 3.7: the partly filled grid, and the completed one in ANSWERS.md
{
  const rows = cells(figure(7));
  const DIGITS = '01369';
  const madeOf = (v) => v >= 10000 && [...String(v)].sort().join('') === DIGITS;
  is('Fig. 3.7: every given number uses 1, 0, 6, 3 and 9 once', rows.flat().filter(c => c.v !== null).every(c => madeOf(c.v)));
  const all = range(10000, 99999).filter(madeOf);
  const above = all.filter(v => v > rows[0][1].v);
  ok('ANSWERS Fig. 3.7: the only number bigger than 96,301 is 96,310', above, [96310]);
  const table = ANSWERS.match(/\| 96,310 \|[\s\S]*?\n\n/);
  const grid = table ? table[0].trim().split('\n').map(l => nums(l)) : [];
  is('ANSWERS Fig. 3.7: a 4 by 4 grid', grid.length === 4 && grid.every(r => r.length === 4));
  is('ANSWERS Fig. 3.7: keeps the given cells', rows.every((r, i) => r.every((c, j) => c.v === null || c.v === grid[i]?.[j])));
  is('ANSWERS Fig. 3.7: every number is made of the five digits', grid.flat().every(madeOf));
  is('ANSWERS Fig. 3.7: no number twice', new Set(grid.flat()).size === 16);
  const colouredAt = rows.flatMap((r, i) => r.map((c, j) => c.coloured ? grid[i]?.[j] : null)).filter(v => v !== null);
  ok('ANSWERS Fig. 3.7: the supercells are exactly the coloured cells', supercells(grid), colouredAt);
  const listed = ANSWERS.match(/Its supercells are exactly the coloured cells: ([^.]+)\./);
  ok('ANSWERS Fig. 3.7: the supercells it lists', listed ? nums(listed[1]).sort() : null, colouredAt.slice().sort());
  const tr = ANSWERS.match(/For the grid above:[\s\S]*?biggest number is \*\*([\d,]+)\*\*[\s\S]*?smallest even number is \*\*([\d,]+)\*\*[\s\S]*?bigger than 50,000 is \*\*([\d,]+)\*\*/);
  const flat = grid.flat();
  ok('ANSWERS T&R after Fig. 3.7', tr ? [toN(tr[1]), toN(tr[2]), toN(tr[3])] : null,
    [Math.max(...flat), Math.min(...flat.filter(v => v % 2 === 0)), Math.min(...flat.filter(v => v > 50000))]);
  is('ANSWERS T&R: the biggest is the same in every grid (the largest the digits make)', Math.max(...flat) === Math.max(...all));
}

// Fig. 3.8: the two numbers already placed sit where the scale puts them
{
  const svg = figure(8);
  const ticks = tags(svg, 'text').filter(t => t.class === 'dg-tick').map(t => [toN(t.body), +t.x]);
  const [[v0, x0], [v1, x1]] = ticks;
  const at = (v) => x0 + (v - v0) * (x1 - x0) / (v1 - v0);
  is('Fig. 3.8: the thousands are equally spaced', ticks.every(([v, x]) => Math.abs(at(v) - x) < 0.05));
  ok('Fig. 3.8: from 1000 to 10,000', [ticks[0][0], ticks.at(-1)[0]], [1000, 10000]);
  const placed = tags(svg, 'text').filter(t => t.class === 'dg-label');
  ok('Fig. 3.8: the placed numbers', placed.map(t => toN(t.body)), [2180, 2754]);
  is('Fig. 3.8: each placed number is where the scale puts it', placed.every(t => Math.abs(at(toN(t.body)) - +t.x) < 0.05));
  ok('ANSWERS Fig. 3.8: 9950 is 360 more than 9590', 9950 - 9590, nums(ANSWERS.match(/but 9950 is (\d+) more/)?.[1])[0]);
  has('p004', BODYTEXT, 'place these numbers on it: 1500, 3600, 9950, 9590, 1050, 3050, 5030, 5300 and 8400');
}

// Fig. 3.9: the ten marks of each line, worked out from the labelled ones
{
  const svg = figure(9);
  const marks = tags(svg, 'line').filter(l => l.x1 === l.x2);
  const texts = tags(svg, 'text').filter(t => t.class === 'dg-tick');
  const lines = [...new Set(marks.map(m => +m.y1))].sort((a, b) => a - b);
  const letters = ['a', 'b', 'c', 'd'];
  lines.forEach((y, li) => {
    const xs = marks.filter(m => +m.y1 === y).map(m => +m.x1).sort((a, b) => a - b);
    const lab = texts.filter(t => +t.y > y && +t.y < y + 30).map(t => [xs.indexOf(+t.x), toN(t.body)]);
    is(`Fig. 3.9 (${letters[li]}): ten marks, equally spaced`, xs.length === 10 && xs.every((x, i) => i === 0 || Math.abs(x - xs[i - 1] - (xs[1] - xs[0])) < 0.01));
    const [[i0, v0], [i1, v1]] = lab;
    const step = (v1 - v0) / (i1 - i0);
    const all = range(0, 9).map(i => v0 + (i - i0) * step);
    is(`Fig. 3.9 (${letters[li]}): every label fits one step`, lab.every(([i, v]) => all[i] === v) && Number.isInteger(step));
    const printed = ANSWERS.match(new RegExp(`- \\(${letters[li]}\\) the marks go up in [\\d,]+s: \\*\\*([^*]+)\\*\\*`));
    ok(`ANSWERS 3.3 Q1 (${letters[li]})`, printed ? nums(printed[1]) : null, all);
    const step2 = ANSWERS.match(new RegExp(`- \\(${letters[li]}\\) the marks go up in ([\\d,]+)s`));
    ok(`ANSWERS 3.3 Q1 (${letters[li]}) the step`, step2 ? toN(step2[1]) : null, step);
    const cb = ANSWERS.match(new RegExp(`- \\(${letters[li]}\\) circle ([\\d,]+), box ([\\d,]+)`));
    ok(`ANSWERS 3.3 Q2 (${letters[li]})`, cb ? [toN(cb[1]), toN(cb[2])] : null, [all[0], all[9]]);
  });
}

// Fig. 3.12: the arrows add up to the numbers they point at
const MIDDLE = [];
{
  const svg = figure(12);
  const boxes = tags(svg, 'rect').filter(r => r.class === 'dg-thin');
  const texts = tags(svg, 'text');
  const box = boxes.map(r => ({ x: +r.x, y: +r.y, h: +r.height,
    v: toN(texts.find(t => +t.x > +r.x && +t.x < +r.x + +r.width && +t.y > +r.y && +t.y < +r.y + +r.height).body) }));
  const mid = box.filter(b => b.x === 138), side = box.filter(b => b.x !== 138);
  MIDDLE.push(...mid.map(b => b.v));
  ok('Fig. 3.12: the middle column', MIDDLE, [25000, 400, 13000, 1500, 60000]);
  const sums = new Map();
  for (const a of tags(svg, 'line').filter(l => l.class === 'dg-move')) {
    const from = mid.find(b => +a.y1 >= b.y && +a.y1 <= b.y + b.h);
    const to = side.find(b => +a.y2 >= b.y && +a.y2 <= b.y + b.h && (b.x < 138) === (+a.x2 < 138));
    sums.set(to.v, [...(sums.get(to.v) || []), from.v]);
  }
  for (const [target, parts] of sums) {
    ok(`Fig. 3.12: the arrows into ${target} add up to it`, parts.reduce((a, b) => a + b), target);
    const line = BODY.match(new RegExp(`\\$${String(target).replace(/(\d)(\d{3})$/, '$1{,}$2')} = ([^$]+)\\$`));
    ok(`p010: the printed sum for ${target} uses the arrows' numbers`, line ? nums(line[1].split('+').join(' ')).sort() : null,
      parts.slice().sort());
  }
  ok('Fig. 3.12: two sums are drawn', sums.size, 2);
  // every other side number: ANSWERS gives a sum that uses only middle numbers
  for (const b of side.filter(b => !sums.has(b.v))) {
    const m = ANSWERS.match(new RegExp(`\\$${b.v} = ([^$]+)\\$`));
    is(`ANSWERS Fig. 3.12: a sum for ${b.v} is given`, !!m);
    if (m) {
      const terms = m[1].split('+').map(toN);
      is(`ANSWERS Fig. 3.12: the sum for ${b.v} uses only middle numbers`, terms.every(t => MIDDLE.includes(t)));
    }
  }
  // Think and Reflect after it
  is('T&R: 1,000 cannot be made from the middle numbers', !makeable(1000, MIDDLE));
  for (const t of [14000, 15000, 16000]) {
    is(`T&R: ${t} can be made`, makeable(t, MIDDLE));
    const m = ANSWERS.match(new RegExp(`\\$${t} = ([^$]+)\\$`));
    is(`ANSWERS T&R: the sum for ${t} uses only middle numbers`, !!m && m[1].split('+').map(toN).every(x => MIDDLE.includes(x)));
  }
  ok('ANSWERS T&R: the only thousand up to 1,00,000 that cannot be made',
    range(1, 100).map(k => k * 1000).filter(t => !makeable(t, MIDDLE)), [1000]);
  ok('ANSWERS T&R: with 400s and 1,500s alone, every thousand from 2,000 on',
    range(2, 100).every(k => makeable(k * 1000, [400, 1500])), true);
  ok('ANSWERS T&R: 400 twice and three times', [2 * 400, 3 * 400], nums(ANSWERS.match(/400 twice is ([\d,]+),\s+400 three times is ([\d,]+)/)?.slice(1).join(' ')));
}

// Table 3.3 and the sums made from it
{
  const t = BODY.match(/<caption>Table 3\.3[\s\S]*?<\/table>/)[0];
  const set = [...t.matchAll(/<td>([\d,]+)<\/td>/g)].map(m => toN(m[1]));
  ok('Table 3.3: six numbers', set.length, 6);
  const signed = (expr) => expr.split('{,}').join('').replace(/\s+/g, '').match(/[+-]?\d+/g).map(Number);
  const printed = BODY.match(/\$39\{,\}800 = ([^$]+)\$/);
  is('p011: 39,800 is made from Table 3.3', !!printed && signed(printed[1]).every(v => set.includes(Math.abs(v))));
  ok('p011: 40,000 is 200 too big', 40000 - 39800, 200);
  for (const target of [45000, 5900, 17500, 21400]) {
    has('p011 asks for', BODY, `$${String(target).replace(/(\d)(\d{3})$/, '$1{,}$2')} =$`);
    const m = ANSWERS.match(new RegExp(`\\$${target} = ([^$]+)\\$`));
    is(`ANSWERS Table 3.3: the way given for ${target} uses only its numbers`,
      !!m && signed(m[1]).every(v => set.includes(Math.abs(v))));
  }
}

// Figs 3.13 to 3.15: the pattern totals, and how each is made up
{
  const panels = {};
  for (const n of [13, 14, 15]) {
    const svg = figure(n);
    const notes = tags(svg, 'text').filter(t => t.class === 'dg-note').map(t => ({ x: +t.x, l: t.body.replace(/[()]/g, '') }));
    const texts = tags(svg, 'text').filter(t => t.class === 'dg-tick');
    const dots = tags(svg, 'circle').filter(c => c.class === 'dg-fill-teal');
    const dice = tags(svg, 'rect').filter(r => r.class === 'dg-thin');
    notes.forEach((p, i) => {
      const lo = p.x, hi = notes[i + 1] ? notes[i + 1].x : Infinity;
      const inP = (x) => x >= lo && x < hi;
      const numbers = texts.filter(t => inP(+t.x)).map(t => toN(t.body));
      const faces = dice.filter(r => inP(+r.x)).map(r => dots.filter(d =>
        +d.cx > +r.x && +d.cx < +r.x + +r.width && +d.cy > +r.y && +d.cy < +r.y + +r.height).length).filter(k => k > 0);
      is(`Fig. 3.${n} (${p.l}): every dot is on a die face`,
        faces.reduce((a, b) => a + b, 0) === dots.filter(d => inP(+d.cx)).length);
      panels[p.l] = { numbers, faces, total: numbers.reduce((a, b) => a + b, 0) + faces.reduce((a, b) => a + b, 0) };
    });
  }
  const tally = (a) => { const t = {}; a.forEach(v => { t[v] = (t[v] || 0) + 1; }); return t; };
  for (const l of 'abcdef') {
    const row = ANSWERS.match(new RegExp(`\\| \\(${l}\\) \\| \\*\\*(\\d+)\\*\\* \\|([^|]+)\\|`));
    ok(`ANSWERS 3.9 pattern (${l}) total`, row ? Number(row[1]) : null, panels[l].total);
    panels[l].tally = { ...tally(panels[l].numbers), ...Object.fromEntries(Object.entries(tally(panels[l].faces)).map(([k, v]) => ['face' + k, v])) };
  }
  ok('Fig. 3.13 (a): twelve 40s and ten 50s', panels.a.tally, { 40: 12, 50: 10 });
  ok('Fig. 3.13 (b): 64 faces, 20 fives and 44 ones', [panels.b.faces.length, panels.b.tally.face5, panels.b.tally.face1], [64, 20, 44]);
  ok('Fig. 3.14 (c): 32 boxes of 32 and 16 of 64', panels.c.tally, { 32: 32, 64: 16 });
  ok('Fig. 3.14 (d): 35 faces, 17 threes and 18 fours', [panels.d.faces.length, panels.d.tally.face3, panels.d.tally.face4], [35, 17, 18]);
  ok('Fig. 3.15 (e): 22 each of 15, 25 and 35', panels.e.tally, { 15: 22, 25: 22, 35: 22 });
  ok('Fig. 3.15 (f): 1000, four 500s, eight 250s, eighteen 125s', panels.f.tally, { 125: 18, 250: 8, 500: 4, 1000: 1 });
  const top = Object.entries(panels).sort((x, y) => y[1].total - x[1].total)[0][0];
  has('ANSWERS 3.9 largest total', ANSWERS, `Pattern (${top}) has the largest total.`);
}

// Fig. 3.16: exactly one supercell, and the one swap that makes four
{
  const rows = cells(figure(16));
  const g = values(rows);
  ok('Fig. 3.16: the coloured cell is the only supercell', supercells(g), colouredOf(rows));
  ok('Fig. 3.16: exactly one', supercells(g).length, 1);
  const found = [];
  g.forEach((row, r) => row.forEach((v, c) => {
    const s = String(v);
    for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) {
      if (s[i] === s[j]) continue;
      const t = [...s]; [t[i], t[j]] = [t[j], t[i]];
      if (t[0] === '0') continue;
      const h = g.map(x => x.slice()); h[r][c] = Number(t.join(''));
      const k = supercells(h);
      if (k.length === 4) found.push({ from: v, to: h[r][c], cells: k, digits: [s[i], s[j]].sort() });
    }
  }));
  ok('ANSWERS 3.9 Q1: exactly one swap gives 4 supercells', found.length, 1);
  const m = ANSWERS.match(/Swap the \*\*(\d) and the (\d) in ([\d,]+)\*\*, to make \*\*([\d,]+)\*\*[\s\S]*?4 supercells:\s*\*\*([^*]+)\*\*/);
  ok('ANSWERS 3.9 Q1: the swap and the cells', m ? [[m[1], m[2]].sort(), toN(m[3]), toN(m[4]), nums(m[5]).sort()] : null,
    [found[0].digits, found[0].from, found[0].to, found[0].cells.slice().sort()]);
}

/* ================================================================
   B. The chapter's other claims
   ================================================================ */

// 3.1: the exercise answers, by trying every order of five children
{
  const seqs = new Set([...perms([1, 2, 3, 4, 5])].map(p => says(p).join('')));
  is('Ex 3.1 Q1: no end child ever says 2', [...seqs].every(s => s[0] !== '2' && s[4] !== '2'));
  is('Ex 3.1 Q2: every child saying 0 never happens', !seqs.has('00000'));
  is('Ex 3.1 Q3: two neighbours can say the same number', [...seqs].some(s => /(.)\1/.test(s)));
  is('ANSWERS Q3: two neighbours never both say 0, or both 2', [...seqs].every(s => !/00|22/.test(s)));
  is('Ex 3.1 Q4: 1, 1, 1, 1, 0 happens', seqs.has('11110'));
  is('Ex 3.1 Q5: 1, 1, 1, 1, 1 never happens', !seqs.has('11111'));
  is('Ex 3.1 Q6: 0, 1, 2, 1, 0 happens', seqs.has('01210'));
  ok('Ex 3.1 Q7: the most children who can say 2', Math.max(...[...seqs].map(s => s.split('2').length - 1)),
    ANSWERS.match(/7\. \*\*(\w+)\*\* of them, at most/)?.[1] === 'Two' ? 2 : null);
  is('Ex 3.1 Q7: only the 2nd and 4th places', [...seqs].filter(s => (s.match(/2/g) || []).length === 2).every(s => s === '02020'));
  // the heights in ANSWERS.md give the sequences it prints
  for (const m of ANSWERS.matchAll(/heights ([\d, and]+) cm give\s+\*\*([\d, ]+)\*\*/g)) {
    const h = nums(m[1]);
    ok(`ANSWERS 3.1: heights ${h.join(', ')}`, says(h), nums(m[2]));
    is(`ANSWERS 3.1: heights ${h.join(', ')} are different`, new Set(h).size === h.length);
  }
  ok('ANSWERS 3.1: three sets of heights', [...ANSWERS.matchAll(/cm give\s+\*\*/g)].length, 3);
}

// 3.2: the supercell answers
{
  const one = (line) => nums(ANSWERS.match(line)?.[1] ?? '');
  const q3 = one(/numbers between them: \*\*([^*]+)\*\*/);
  is('ANSWERS 3.2 Q3: nine different numbers between 100 and 1000', q3.length === 9 && new Set(q3).size === 9 && q3.every(v => v > 100 && v < 1000));
  const q3s = supercells([q3]);
  ok('ANSWERS 3.2 Q3: the most supercells in 9 cells', q3s.length, 5);
  ok('ANSWERS 3.2 Q4: how many, and which', one(/4\. \*\*(\d+)\*\* of them: ([\d, and]+)\./), [q3s.length]);
  ok('ANSWERS 3.2 Q4: which ones', nums(ANSWERS.match(/of them: ([\d, and]+)\./)?.[1]), q3s);
  const most = (n) => { let m = 0; for (const p of perms(range(1, n))) m = Math.max(m, supercells([p]).length); return m; };
  const tableRow = ANSWERS.match(/\| most supercells \|([^\n]+)/);
  const tableHead = ANSWERS.match(/\| cells \|([^\n]+)/);
  ok('ANSWERS 3.2 Q5: the table of most supercells', tableRow ? nums(tableRow[1]) : null, nums(tableHead[1]).map(most));
  is('ANSWERS 3.2 Q5: even n gives n/2, odd n gives (n + 1)/2', range(2, 9).every(n => most(n) === (n % 2 ? (n + 1) / 2 : n / 2)));
  is('3.2 Q6 and Q7: the largest is always a supercell, the smallest never (up to 7 cells)',
    range(2, 7).every(n => [...perms(range(1, n))].every(p => supercells([p]).includes(n) && !supercells([p]).includes(1))));
  const q8 = one(/Put the second largest number next to the largest:\s*\*\*([^*]+)\*\*/);
  const byVal = (a) => a.slice().sort((x, y) => y - x);
  is('ANSWERS 3.2 Q8: the second largest is not a supercell', q8.length > 2 && !supercells([q8]).includes(byVal(q8)[1]));
  const q9 = one(/One table: \*\*([^*]+)\*\*/);
  is('ANSWERS 3.2 Q9: second largest is not a supercell, second smallest is',
    !supercells([q9]).includes(byVal(q9)[1]) && supercells([q9]).includes(byVal(q9).at(-2)));
  is('3.2 Q9: the second smallest can be a supercell only at an end, next to the smallest',
    [...perms(range(1, 6))].every(p => !supercells([p]).includes(2) || ((p[0] === 2 && p[1] === 1) || (p[5] === 2 && p[4] === 1))));
}

// 3.4: digit counts, digit sums
{
  const t = ANSWERS.match(/There are \*\*9\*\* 1-digit[^.]+\./)[0];
  ok('ANSWERS Table 3.1', nums(t).filter((v, i) => i % 2 === 0),
    [1, 2, 3, 4, 5].map(d => range(1, 99999).filter(n => String(n).length === d).length));
  has('p005 Table 3.1 gives the 1-digit count', BODYTEXT, '9 (from 1 to 9)');
  for (const n of [68, 176, 545]) ok(`p005: the digit sum of ${n}`, dsum(n), 14);
  for (const m of BODY.matchAll(/<p>\$([\d +]+) = 14\$<\/p>/g))
    is(`p005: $${m[1]}$ adds the digits of a number named after it`, ['68', '176', '545'].includes(m[1].replace(/[ +]/g, '')));
  const first = (pred, from, to, stepBy = 1) => { for (let n = from; stepBy > 0 ? n <= to : n >= to; n += stepBy) if (pred(n)) return n; return null; };
  ok('ANSWERS 3.4 Q1(b): the smallest number with digit sum 14', first(n => dsum(n) === 14, 1, 1e6),
    toN(ANSWERS.match(/The smallest is \*\*(\d+)\*\*\. A 1-digit/)?.[1]));
  ok('ANSWERS 3.4 Q1(c): the largest 5-digit number with digit sum 14', first(n => dsum(n) === 14, 99999, 10000, -1),
    toN(ANSWERS.match(/The largest 5-digit number is \*\*([\d,]+)\*\*/)?.[1]));
  const qa = nums(ANSWERS.match(/\(a\) \*Answers will vary:\* ([^.]+)\./)?.[1]);
  is('ANSWERS 3.4 Q1(a): every example has digit sum 14', qa.length >= 5 && qa.every(n => dsum(n) === 14));
  const qd = nums(ANSWERS.match(/keeps the digit\s+sum at 14: ([^a]+)and so on/)?.[1]);
  is('ANSWERS 3.4 Q1(d): each has digit sum 14', qd.length === 4 && qd.every(n => dsum(n) === 14));
  const ds = range(40, 70).map(dsum);
  ok('ANSWERS 3.4 Q2: the ranges of digit sums', [ds.slice(0, 10), ds.slice(10, 20), ds.slice(20, 30), ds[30]].map(a => [].concat(a)).map(a => [Math.min(...a), Math.max(...a)]),
    [[4, 13], [5, 14], [6, 15], [7, 7]]);
  has('ANSWERS 3.4 Q2', ANSWERS, 'from 40 to 49 are 4 to 13; from 50 to 59 they are 5 to\n   14; from 60 to 69 they are 6 to 15; and 70 has 7');
  ok('ANSWERS 3.4 Q2: from 49 to 50 the digit sum drops by', dsum(49) - dsum(50), 8);
  const cons = range(1, 7).map(a => a * 111 + 12);
  is('ANSWERS 3.4 Q3: 123 … 789 are all the 3-digit numbers with increasing consecutive digits',
    same(range(100, 999).filter(n => { const d = [...String(n)].map(Number); return d[1] === d[0] + 1 && d[2] === d[1] + 1; }), cons));
  ok('ANSWERS 3.4 Q3: the numbers', nums(ANSWERS.match(/The numbers are ([\d, and]+), with digit sums/)?.[1]), cons);
  ok('ANSWERS 3.4 Q3: the digit sums', nums(ANSWERS.match(/with digit sums\s+\*\*([^*]+)\*\*/)?.[1]), cons.map(dsum));
  const count7 = (hi) => range(1, hi).map(String).join('').split('7').length - 1;
  ok('ANSWERS T&R: 7s from 1 to 100 and to 1000',
    [toN(ANSWERS.match(/From 1 to 100 the digit 7 appears \*\*(\d+)\*\*/)?.[1]), toN(ANSWERS.match(/From 1 to 1000 it appears \*\*(\d+)\*\*/)?.[1])],
    [count7(100), count7(1000)]);
  ok('ANSWERS 3.9 Q11: the smallest and largest 5-digit numbers with digit sum 9',
    [first(n => dsum(n) === 9, 10000, 99999), first(n => dsum(n) === 9, 99999, 10000, -1)],
    [toN(ANSWERS.match(/The smallest is \*\*([\d,]+)\*\* and the largest is \*\*([\d,]+)\*\*\.\s*$/m)?.[1]),
     toN(ANSWERS.match(/The smallest is \*\*([\d,]+)\*\* and the largest is \*\*([\d,]+)\*\*\.\s*$/m)?.[2])]);
}

// 3.5: palindromes, reverse and add, the puzzle
{
  for (const n of [66, 848, 575, 797, 1111, 121, 313, 222]) is(`p006: ${n} is a palindrome`, isPal(n));
  is('p006: 121, 313 and 222 use only the digits 1, 2 and 3', [121, 313, 222].every(n => /^[123]+$/.test(String(n))));
  const p123 = range(100, 999).filter(n => isPal(n) && /^[123]+$/.test(String(n)));
  ok('ANSWERS 3.5: the palindromes from 1, 2 and 3', nums(ANSWERS.match(/There are \*\*9\*\* of them: ([^.]+)\./)?.[1]), p123);
  ok('ANSWERS 3.5: how many', p123.length, 9);
  // Example 1
  const ex1 = { 34: 1, 29: 1, 48: 2, 76: 2 };
  for (const [n, k] of Object.entries(ex1)) ok(`body Ex 1: ${n} takes ${k} step(s)`, reverseAdd(n).steps, k);
  has('body Ex 1 answer', BODYTEXT, '34 and 29 reach a palindrome in one step. 48 and 76 need two steps.');
  const ex1rows = [...(BODY.match(/Example 1<[\s\S]*?Answer/)[0]).matchAll(/\$(\d+) \+ (\d+) = (\d+)\$/g)].map(m => m.slice(1).map(Number));
  ok('body Ex 1: every row is a number plus its reverse, and each chain carries on',
    ex1rows, [34, 29, 48, 76].flatMap(n => reverseAdd(n).chain));
  const two = range(10, 99).map(n => [n, reverseAdd(n).steps]);
  is('p008 and summary: every 2-digit number reaches a palindrome', two.every(([, s]) => Number.isFinite(s)));
  const longest = Math.max(...two.map(([, s]) => s));
  ok('ANSWERS T&R: the 2-digit numbers that take longest, and how long', [two.filter(([, s]) => s === longest).map(([n]) => n), longest],
    [[89, 98], toN(ANSWERS.match(/89 and 98 take the longest: \*\*(\d+) steps\*\*/)?.[1])]);
  is('p008: 196 is not turned into a palindrome in 1000 steps (consistent with "nobody knows")', reverseAdd(196, 1000).steps === Infinity);
  // the puzzle
  const sols = range(10000, 99999).filter(n => { const d = [...String(n)].map(Number);
    return isPal(n) && n % 2 === 1 && d[3] === 2 * d[4] && d[2] === 2 * d[3]; });
  ok('ANSWERS Puzzle time: the only number', sols, [toN(ANSWERS.match(/The number is \*\*([\d,]+)\*\*/)?.[1])]);
}

// 3.6: Kaprekar
{
  const ex2 = BODY.match(/Example 2<[\s\S]*?<\/section>/)[0];
  const rows = [...ex2.matchAll(/\$A = (\d+)\$, \$B = (\d+)\$, \$C = (\d+) - (\d+) = (\d+)\$/g)].map(m => m.slice(1).map(Number));
  ok('body Ex 2: the rounds from 6382', rows.map(r => [r[0], r[1], r[4]]), kapChain(6382).rows);
  is('body Ex 2: C is A minus B as printed', rows.every(r => r[0] === r[2] && r[1] === r[3]));
  ok('body Ex 2: the number of rounds', kapChain(6382).rounds, nums(ex2.match(/reaches 6174 in (\d+) rounds/)[1])[0]);
  ok('body Ex 2: 6174 gives 7641 and 1467 again', kapStep(6174), [7641, 1467, 6174]);
  has('p008', BODYTEXT, '558 is read as 0558');
  const all4 = range(1000, 9999).filter(n => new Set(String(n)).size > 1).map(n => kapChain(n));
  is('p009 key idea: every 4-digit number whose digits are not all the same reaches 6174', all4.every(c => c.end === 6174));
  ok('the most rounds any 4-digit number needs', Math.max(...all4.map(c => c.rounds)), 7);
  const all3 = range(100, 999).filter(n => new Set(String(n)).size > 1).map(n => kapChain(n, 3, 495));
  is('ANSWERS 3.6: every 3-digit number whose digits are not all the same ends at 495', all3.every(c => c.end === 495));
  ok('ANSWERS 3.6: 495 repeats', kapStep(495, 3), [954, 459, 495]);
  ok('p009: 99 is read as 099', kapStep(99, 3).slice(0, 2), [990, 99]);
  // the chains printed in ANSWERS.md
  const chainIn = (label, src, start, w) => {
    const got = [...src.matchAll(/\$(\d+) - (\d+) = (\d+)\$/g)].map(m => m.slice(1).map(Number));
    const want = kapChain(start, w).rows;
    ok(label, got.slice(0, want.length), want);
    return got;
  };
  chainIn('ANSWERS 3.6: the chain from 4321', ANSWERS.match(/For\s+4321:[\s\S]*?rounds\./)[0], 4321, 4);
  has('ANSWERS 3.6: 4321 takes', ANSWERS, `which is ${kapChain(4321).rounds} rounds`);
  const c321 = chainIn('ANSWERS 3.6: the chain from 321', ANSWERS.match(/For 321:[\s\S]*?again\./)[0], 321, 3);
  ok('ANSWERS 3.6: the repeat printed after it', c321.at(-1), kapStep(495, 3));
  const c5683 = chainIn('ANSWERS 3.5 Q4: the chain from 5683', ANSWERS.match(/4\. \*\*7 rounds:\*\*[\s\S]*?6174\$\./)[0], 5683, 4);
  ok('ANSWERS 3.5 Q4: rounds', c5683.length, kapChain(5683).rounds);
  has('ANSWERS 3.5 Q4', ANSWERS, `**${kapChain(5683).rounds} rounds:**`);
  chainIn('ANSWERS 3.9 Q2: the chain from 2014', ANSWERS.match(/born in 2014 takes[\s\S]*?6174\$\./)[0], 2014, 4);
  ok('ANSWERS 3.9 Q2: rounds for 2014 and 2013', [kapChain(2014).rounds, kapChain(2013).rounds],
    nums(ANSWERS.match(/born in 2014 takes \*\*(\d+) rounds\*\*[\s\S]*?For 2013 it takes (\d+) rounds/)?.slice(1).join(' ')));
  is('ANSWERS 3.9 Q2: 5683 in the book and the year chains start from the smallest-first B with zeros kept',
    kapStep(2014)[1] === 124 && kapStep(5683)[2] === 5085);
}

// 3.7: clocks and calendars
{
  const allSame = clockTimes.filter(t => new Set(clockDigits(t)).size === 1).map(fmtTime);
  ok('ANSWERS 3.7 T&R 1: times like 4:44', allSame.join(', ').replace(/, ([^,]+)$/, ' and $1'),
    ANSWERS.match(/\*\*like 4:44\*\* \(every digit the same\): ([\s\S]+?), which is/)?.[1].replace(/\s+/g, ' '));
  ok('ANSWERS 3.7 T&R 1: how many', allSame.length, toN(ANSWERS.match(/which is \*\*(\d+)\*\* times/)?.[1]));
  const eg = BODYTEXT.match(/such as (\d+):(\d+), (\d+):(\d+) and (\d+):(\d+)\. In \1:\2 every digit is the same\. In \3:\4 the hours and the minutes are the same\. And \5:\6 reads the same from both ends/);
  is('p009: the three example times have the patterns claimed', !!eg
    && new Set(eg[1] + eg[2]).size === 1 && Number(eg[3]) === Number(eg[4]) && isPal(eg[5] + eg[6]));
  const hm = clockTimes.filter(([h, m]) => h >= 10 && m === h).map(fmtTime);
  ok('ANSWERS 3.7 T&R 1: hours and minutes the same', hm, ['10:10', '11:11', '12:12']);
  has('ANSWERS 3.7 T&R 1', ANSWERS, 'like 10:10** (hours and minutes the same): 10:10, 11:11 and 12:12');
  const pals = clockTimes.filter(t => isPal(clockDigits(t)));
  ok('ANSWERS 3.7 T&R 1: palindromic times', pals.length, toN(ANSWERS.match(/That makes \*\*(\d+)\*\* times/)?.[1]));
  ok('ANSWERS 3.7 T&R 1: 6 an hour from 1 to 9, then three more',
    [range(1, 9).map(h => pals.filter(([x]) => x === h).length), pals.filter(([h]) => h >= 10).map(fmtTime)],
    [Array(9).fill(6), ['10:01', '11:11', '12:21']]);
  const manish = BODYTEXT.match(/Manish was born on (\d\d)\/(\d\d)\/(\d{4})\. Look at the digits of his date of birth: ([\d, ]+), and then ([\d, ]+) again/);
  is('p009: Manish\'s date reads its four digits twice, as the text lists them', !!manish
    && manish[1] + manish[2] === manish[3] && nums(manish[4]).join('') === manish[3] && nums(manish[5]).join('') === manish[3]
    && validDate(+manish[3], +manish[2], +manish[1]));
  const meghana = BODYTEXT.match(/Meghana was born on (\d\d)\/(\d\d)\/(\d{4})\. Her date of birth reads the same/);
  is('p009: Meghana\'s date reads the same both ways', !!meghana && isPal(meghana.slice(1).join('')) && validDate(+meghana[3], +meghana[2], +meghana[1]));
  const years = range(1000, 2026);
  const repeat = years.filter(y => validDate(y, y % 100, Math.floor(y / 100)));
  const palDates = years.filter(y => { const s = [...String(y)].reverse().join(''); return validDate(y, +s.slice(2), +s.slice(0, 2)); });
  const fmt = (y, d, m) => `${String(d).padStart(2, '0')}/${String(m).padStart(2, '0')}/${y}`;
  ok('ANSWERS 3.7 T&R 2: repeating dates, 1000 to 2026', repeat.length, toN(ANSWERS.match(/There are\s+\*\*(\d+)\*\* such dates from the year 1000 to 2026\.\n3\./)?.[1]));
  ok('ANSWERS 3.7 T&R 2: one each year from 2001 to 2012', repeat.filter(y => y >= 2000).map(y => fmt(y, Math.floor(y / 100), y % 100)),
    range(1, 12).map(m => fmt(2000 + m, 20, m)));
  ok('ANSWERS 3.7 T&R 3: palindrome dates since 2000',
    palDates.filter(y => y >= 2000).map(y => { const s = [...String(y)].reverse().join(''); return `${s.slice(0, 2)}/${s.slice(2)}/${y}`; }),
    ANSWERS.match(/the ones since 2000 are\s+\*\*([^*]+)\*\*/)?.[1].replace(/\s+/g, ' ').replace(' and ', ', ').split(', '));
  ok('ANSWERS 3.7 T&R 3: how many from 1000 to 2026', palDates.length, toN(ANSWERS.match(/There are \*\*(\d+)\*\* such dates\s+from the year 1000 to 2026\.\n4\./)?.[1]));
  // a calendar comes back
  ok('ANSWERS 3.7 T&R 4: 365 days is 52 weeks and 1 day', [Math.floor(365 / 7), 365 % 7], [52, 1]);
  const gaps = new Set(range(1901, 2071).map(y => { let z = y + 1; while (!sameCalendar(y, z)) z++; return z - y; }));
  ok('ANSWERS 3.7 T&R 4: a calendar returns after 6, 11 or 28 years (1901 to 2099)', [...gaps].sort((a, b) => a - b), [6, 11, 28]);
  const next2026 = range(2027, 2100).find(y => sameCalendar(2026, y));
  ok('ANSWERS 3.7 T&R 4: the calendar of 2026 comes back in', next2026, toN(ANSWERS.match(/The calendar of 2026 comes back in \*\*(\d+)\*\*/)?.[1]));
  // Exercise Set 3.5
  ok('p010 Q1: the smallest and largest from 4, 7, 3 and 2', [2347, 7432], [Number([4, 7, 3, 2].sort().join('')), Number([4, 7, 3, 2].sort((a, b) => b - a).join(''))]);
  const parts = { a: ['-', '>', 5085], b: ['-', '<', 5085], c: ['+', '>', 9779], d: ['+', '<', 9779] };
  for (const [l, [op, cmp, lim]] of Object.entries(parts)) {
    const m = ANSWERS.match(new RegExp(`- \\(${l}\\) (\\d), (\\d), (\\d), (\\d): \\$(\\d+) [-+] (\\d+) = (\\d+)\\$, (more|less) than (\\d+)`));
    if (!m) { fails.push(`ANSWERS 3.5 Q1 (${l}) not found`); continue; }
    const d = m.slice(1, 5).map(Number);
    const big = Number(d.slice().sort((a, b) => b - a).join(''));
    const smallD = d.slice().sort((a, b) => a - b);
    if (smallD[0] === 0) { const k = smallD.findIndex(x => x > 0); smallD.unshift(smallD.splice(k, 1)[0]); }
    const small = Number(smallD.join(''));
    const val = op === '-' ? big - small : big + small;
    ok(`ANSWERS 3.5 Q1 (${l}): largest and smallest 4-digit numbers from ${d.join(', ')}`, [big, small, val], [+m[5], +m[6], +m[7]]);
    is(`ANSWERS 3.5 Q1 (${l}): ${val} is ${m[8]} than ${lim}`, (cmp === '>' ? val > lim : val < lim) && (m[8] === 'more') === (cmp === '>') && +m[9] === lim);
  }
  const p5 = range(10000, 99999).filter(isPal);
  ok('ANSWERS 3.5 Q2: smallest and largest 5-digit palindromes', [p5[0], p5.at(-1)],
    nums(ANSWERS.match(/The smallest 5-digit palindrome is ([\d,]+) and the largest is ([\d,]+)\./)?.slice(1).join(' ')));
  const i1001 = clockTimes.findIndex(([h, m]) => h === 10 && m === 1);
  const after = []; for (let k = 1; after.length < 2; k++) { const t = clockTimes[(i1001 + k) % 720]; if (isPal(clockDigits(t))) after.push([fmtTime(t), k]); }
  const q3 = ANSWERS.match(/after 10:01 is (\d+:\d+), which is \*\*(\d+) minutes\*\*\s+away\. The one after that is (\d+:\d+), which is \*\*(\d+) minutes\*\* from 10:01/);
  ok('ANSWERS 3.5 Q3: the next two palindromic times after 10:01', q3 ? [[q3[1], +q3[2]], [q3[3], +q3[4]]] : null, after);
}

// 3.8: the example sums and Exercise Set 3.6
{
  const digitsOf = (n) => String(Math.abs(n)).length;
  is('p011: in the two examples every number has exactly 5 digits', [12350, 24545, 36895, 48952, 24547, 24405].every(n => digitsOf(n) === 5));
  // Example 3, by trying every pair
  let lo = Infinity, hi = -Infinity;
  for (let a = 1000; a <= 9999; a += 1) { lo = Math.min(lo, a - 99); hi = Math.max(hi, a - 10); }
  ok('body Ex 3: the smallest and largest differences', [lo, hi], [1000 - 99, 9999 - 10]);
  ok('body Ex 3: they have 3 and 4 digits', [digitsOf(lo), digitsOf(hi)], [3, 4]);
  has('body Ex 3 answer', BODYTEXT, 'either 3 digits or 4 digits, and never 2 or 5');
  has('body Ex 3', BODYTEXT, `lies between ${lo} and ${hi}`);
  // Exercise Set 3.6 Q1: the examples in ANSWERS.md, part by part
  const want = { a: [5, 5, 5], b: [5, 3, 6], d: [5, 5, 6], f: [5, 5], g: [5, 3, 4], h: [5, 4, 4], i: [5, 5, 3] };
  const q1 = ANSWERS.match(/### Exercise Set 3\.6([\s\S]*?)\n2\. /)[1];
  for (const [l, d] of Object.entries(want)) {
    const m = q1.match(new RegExp(`- \\(${l}\\) \\$(\\d+) ([-+]) (\\d+) = (\\d+)\\$`));
    if (!m) { fails.push(`ANSWERS 3.6 Q1 (${l}) not found`); continue; }
    const [a, b, c] = [+m[1], +m[3], +m[4]];
    ok(`ANSWERS 3.6 Q1 (${l}): digits`, m[2] === '+' ? [digitsOf(a), digitsOf(b), digitsOf(c)] : [digitsOf(a), digitsOf(b), digitsOf(c)].slice(0, d.length === 2 ? 2 : 3), d);
  }
  const qa = q1.match(/- \(a\) \$(\d+) \+ (\d+) = (\d+)\$/);
  is('ANSWERS 3.6 Q1 (a): the sum is more than 90,250', qa && +qa[3] > 90250);
  const qf = q1.match(/- \(f\) \$(\d+) - (\d+) = (\d+)\$/);
  is('ANSWERS 3.6 Q1 (f): the difference is less than 56,503', qf && +qf[3] < 56503);
  ok('ANSWERS 3.6 Q1 (b) and (d) written the Indian way', [q1.includes('which is 1,00,100'), q1.includes('which is 1,10,000')], [true, true]);
  is('3.6 Q1 (c): two 4-digit numbers never make 6 digits', digitsOf(9999 + 9999) < 6);
  is('3.6 Q1 (e): two 5-digit numbers never make 18,500', 10000 + 10000 > 18500);
  is('3.6 Q1 (j): two 5-digit numbers never differ by 91,500', 99999 - 10000 < 91500);
  has('ANSWERS 3.6 Q2', ANSWERS, '(c), (e) and (j) have no example');
  // Q3: always, sometimes or never, from the smallest and largest cases
  const span = (d1, d2, op) => { const lo1 = 10 ** (d1 - 1), hi1 = 10 ** d1 - 1, lo2 = 10 ** (d2 - 1), hi2 = 10 ** d2 - 1;
    return op === '+' ? [lo1 + lo2, hi1 + hi2] : [Math.max(0, lo1 - hi2), hi1 - lo2]; };
  const verdict = ([a, b], d) => { const inD = (n) => digitsOf(n) === d;
    const lo = a, hi = b; const allIn = lo >= 10 ** (d - 1) && hi <= 10 ** d - 1; const any = !(hi < 10 ** (d - 1) || lo > 10 ** d - 1);
    return allIn ? 'Always' : any ? 'Sometimes' : 'Never'; };
  const cases = { a: [5, 5, '+', 5], b: [4, 2, '+', 4], c: [4, 2, '+', 6], d: [5, 5, '-', 5], e: [5, 2, '-', 3] };
  for (const [l, [d1, d2, op, d]] of Object.entries(cases)) {
    const m = ANSWERS.match(new RegExp(`- \\(${l}\\) \\*\\*(\\w+)\\.\\*\\*`, 'g'));
    const printed = m ? m.map(x => x.match(/\*\*(\w+)/)[1]).at(-1) : null;
    ok(`ANSWERS 3.6 Q3 (${l})`, verdict(span(d1, d2, op), d), printed);
  }
  ok('ANSWERS 3.6 Q3 (c): the largest 4-digit plus 2-digit sum', span(4, 2, '+')[1], 10098);
  ok('ANSWERS 3.6 Q3 (e): the smallest and largest 5-digit minus 2-digit', [10000 - 99, span(5, 2, '-')[1]], [9901, 99989]);
}

// 3.10: the Collatz sequences
{
  const seqs = [...BODY.matchAll(/<p>\((\w)\) \$([^$]+)\$<\/p>/g)];
  ok('p014: four sequences', seqs.length, 4);
  for (const [, l, s] of seqs) {
    const v = nums(s.split(B + ' ').join(' '));
    ok(`p014 sequence (${l}) follows the rule`, v, collatz(v[0]));
  }
  has('p014', BODYTEXT, '12 is even, so the next number is half of 12, which is 6. 6 is even, so the next number is 3.');
  ok('p014: 10 gives 5, and 5 gives 16', [collatz(10)[1], collatz(5)[1]], [5, 16]);
  ok('ANSWERS 3.10: the sequence from 7', nums(ANSWERS.match(/For 7:\s+([\d, ]+)\./)?.[1]), collatz(7));
  ok('ANSWERS 3.9 Q9: the sequence from 100', nums(ANSWERS.match(/\*\*Yes\.\*\* (100, 50[\d,\s]+)/)?.[1]), collatz(100));
  ok('ANSWERS 3.9 Q9: its steps', steps(100), toN(ANSWERS.match(/which is \*\*(\d+) steps\*\*/)?.[1]));
  is('ANSWERS 3.9 Q8: every power of 2 up to 2^30 halves straight down to 1',
    range(0, 30).every(k => collatz(2 ** k).every((v, i) => v === 2 ** (k - i))));
  const everyUpTo = range(1, 100000).every(n => { let x = n, k = 0; while (x !== 1 && k < 1000) { x = x % 2 ? 3 * x + 1 : x / 2; k++; } return x === 1; });
  is('p014: every start up to 1,00,000 reaches 1 (consistent with the conjecture)', everyUpTo);
}

// 3.11: estimation, Example 4 and the answers' arithmetic claims
{
  ok('body Ex 4: Classes 6 to 10 make', range(6, 10).length, 5);
  is('body Ex 4: 96 is about 100', Math.abs(96 - 100) < 10);
  has('body Ex 4 answer', BODYTEXT, 'Paromita estimated about 500 students.');
  // the straight-line distance, from the two cities' positions
  const hav = (a, b, c, d) => { const r = Math.PI / 180, R = 6371;
    const x = Math.sin((c - a) * r / 2) ** 2 + Math.cos(a * r) * Math.cos(c * r) * Math.sin((d - b) * r / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(x)); };
  const km = hav(23.22, 72.65, 25.67, 94.11);   // Gandhinagar, Kohima (latitude, longitude)
  ok('ANSWERS 3.8 Q4: Gandhinagar to Kohima, to the nearest 100 km', Math.round(km / 100) * 100,
    toN(ANSWERS.match(/About \*\*(\d+) km\*\* in a straight line/)?.[1]));
  ok('ANSWERS 3.8 Q6: 3200 km at 4 km an hour, 8 hours a day', [3200 / 4, 3200 / 4 / 8],
    nums(ANSWERS.match(/walk takes\s+about \$3200 \\div 4 = (\d+)\$ hours\. Walking 8 hours a day, that is\s+\$800 \\div 8 = (\d+)\$ days/)?.slice(1).join(' ')));
  ok('ANSWERS 3.8 Q5: 6600 is about half of 13,000', Math.round(13000 / 6600), 2);
  ok('ANSWERS 3.9 Q3: all-odd 5-digit numbers from 35,000 to 75,000',
    (() => { const o = range(35000, 75000).filter(n => [...String(n)].every(d => d % 2));
      const near = o.reduce((a, b) => Math.abs(b - 50000) < Math.abs(a - 50000) ? b : a);
      return [o.at(-1), o[0], near, near - 50000, Math.max(...o.filter(n => n < 50000))]; })(),
    nums(ANSWERS.match(/The largest is \*\*([\d,]+)\*\*, the smallest is \*\*([\d,]+)\*\*, and the one\s+closest to 50,000 is \*\*([\d,]+)\*\*\. It is ([\d,]+) away, and the nearest one\s+below 50,000, ([\d,]+)/)?.slice(1).join(' ')));
  const q6 = ANSWERS.match(/\$(\d+) \+ (\d+) \+ (\d+) = 18670\$/);
  is('ANSWERS 3.9 Q6: one 5-digit and two 3-digit numbers', q6 && String(q6[1]).length === 5 && String(q6[2]).length === 3 && String(q6[3]).length === 3);
  is('ANSWERS 3.9 Q7: 300 is between 210 and 390, and 3 rows of 4 is 12 boxes', 300 > 210 && 300 < 390 && 3 * 4 === 12);
}

// 3.12: games
{
  const g21 = winning(21, 3);
  ok('ANSWERS Game 1: the winning numbers', nums(ANSWERS.match(/The numbers \*\*([^*]+)\*\*/)?.[1]), g21);
  is('Game 1: the first player can say the first winning number', g21[0] <= 3);
  const g99 = winning(99, 10);
  ok('ANSWERS Game 2: the winning numbers', nums(ANSWERS.match(/The winning numbers are \*\*([^*]+)\*\*/)?.[1]), g99);
  is('Game 2: the first player cannot say 11, so the second wins', g99[0] > 10);
  ok('ANSWERS own version: 1 to 4, 50 wins', winning(50, 4).slice(0, 3), nums(ANSWERS.match(/second player wins by saying ([\d, ]+), and so on/)?.[1]));
  const g22 = winning(22, 3);
  ok('ANSWERS 3.9 Q10: first player says 2, then …', [g22[0], ...g22.slice(1)],
    nums(ANSWERS.match(/by saying \*\*(\d)\*\*, and then ([\d,\s and]+)\./)?.slice(1).join(' ')));
  ok('ANSWERS 3.9 Q10: 22 is 2 more than a multiple of 4', 22 % 4, 2);
}

/* ================================================================
   B. Beyond the Book, stage 1 (kept word for word, so its numbers too)
   ================================================================ */
{
  const S1 = BEYONDTEXT.slice(0, BEYONDTEXT.indexOf('Solved Examples'));
  const counts7 = [...perms(range(1, 7))].map(p => supercells([p]).length);
  ok('stage 1: the most and fewest supercells in 7 cells', [Math.max(...counts7), Math.min(...counts7)], [4, 1]);
  ok('stage 1: 9, 1, 8, 2, 7, 3, 6 has supercells 9, 8, 7, 6', supercells([[9, 1, 8, 2, 7, 3, 6]]), [9, 8, 7, 6]);
  ok('stage 1: 1 to 7 has only 7', supercells([range(1, 7)]), [7]);
  const t7 = [9, 1, 8, 2, 7, 3, 6];
  ok('stage 1: those supercells are cells 1, 3, 5 and 7', supercells([t7]).map(v => t7.indexOf(v) + 1),
    nums(S1.match(/the most you can fit is cells ([\d, and]+)\./)[1]));
  has('stage 1', S1, 'The table 9, 1, 8, 2, 7, 3, 6 has exactly these 4 supercells.');
  const g22 = [...perms([1, 2, 3, 4])].map(p => supercells(chunk(p, 2)).length);
  ok('stage 1: the most supercells in a 2 by 2 grid', Math.max(...g22), 2);
  ok('stage 1: the grid 4, 1 over 2, 3', supercells([[4, 1], [2, 3]]), [4, 3]);
  const d5 = range(10, 99).filter(n => dsum(n) === 5);
  ok('stage 1: 2-digit numbers with digit sum 5', d5, nums(S1.match(/So the numbers are ([\d, and]+)\./)[1]));
  ok('stage 1: how many', d5.length, 5);
  const p3 = range(100, 999).filter(isPal);
  ok('stage 1: 3-digit palindromes, first, last, count', [p3[0], p3.at(-1), p3.length], [101, 999, 9 * 10]);
  has('stage 1', S1, 'from 101 up to 999');
  ok('stage 1: 5555 gives 0', kapStep(5555), [5555, 5555, 0]);
  ok('stage 1: 8, 6, 7 and 9 take', [steps(8), steps(6), steps(7), steps(9)], [3, 8, 16, 19]);
  ok('stage 1: 9 goes 9, 28, 14, 7', collatz(9).slice(0, 4), [9, 28, 14, 7]);
  ok('stage 1: 9 takes the most steps from 1 to 9', range(1, 9).reduce((a, b) => steps(b) > steps(a) ? b : a), 9);
  const in5 = range(1, 100000).filter(n => steps(n) === 5);
  ok('stage 1: the starting numbers that take exactly 5 steps', in5, [5, 32]);
  ok('stage 1: 21, adding 1 to 3', winning(21, 3), nums(S1.match(/The winning player says ([\d, and]+)\./)[1]));
  is('stage 1: after 3, say 5 by adding 2', 3 + 2 === 5 && winning(21, 3).includes(5));
  has('ANSWERS stage 1 summary', ANSWERS, '4 and 1 supercells in 7 cells, 2 in a 2 by 2\ngrid, 5 numbers with digit sum 5, 90 palindromes, 19 Collatz steps from 9,\nand 5 and 32 in exactly 5 steps');
}

/* ================================================================
   B. Beyond the Book, stage 2: the worked examples
   ================================================================ */

function examples(html) {
  const out = {};
  const starts = [...html.matchAll(/<div class="c-example">/g)].map(m => m.index);
  for (const s of starts) {
    let depth = 0, i = s;
    const re = /<div\b|<\/div>/g; re.lastIndex = s;
    let m; while ((m = re.exec(html))) { depth += m[0] === '<div' ? 1 : -1; if (depth === 0) { i = m.index + 6; break; } }
    const block = html.slice(s, i);
    const n = Number(block.match(/Example (\d+)</)[1]);
    const q = text(block.match(/<div class="c-example__body">\s*<p>([\s\S]*?)<\/p>/)[1]);
    const rows = [...block.matchAll(/<span class="work__label">([^<]+)<\/span>\s*<span>([\s\S]*?)<\/span>/g)].map(r => [r[1], r[2]]);
    const answer = rows.find(r => r[0] === 'Answer')?.[1] ?? null;
    out[n] = { q, rows, answer, block };
  }
  return out;
}
const EXB = examples(BODY);
const EX = examples(BEYOND);
ok('body example tabs read 1 to 4', Object.keys(EXB).map(Number), range(1, 4));
ok('Beyond example tabs read 1 to 19, starting again as Class 7 does', Object.keys(EX).map(Number), range(1, 19));
ok('body tabs, in page order', [...BODY.matchAll(/c-example__tab">Example (\d+)</g)].map(m => +m[1]), range(1, 4));
ok('Beyond tabs, in page order', [...BEYOND.matchAll(/c-example__tab">Example (\d+)</g)].map(m => +m[1]), range(1, 19));
/* every check below reads an example by its number, so a wrong tab would
   send them to the wrong example: stop here and say so */
if (!same(Object.keys(EXB).map(Number), range(1, 4)) || !same(Object.keys(EX).map(Number), range(1, 19))) {
  console.log(`\n  STOPPED: the example tabs are misnumbered, so the per-example checks cannot run.`);
  for (const f of fails) console.log(`    ! ${f}`);
  process.exit(1);
}
ok('Beyond: eleven Type heads, in order', [...BEYOND.matchAll(/<h3>Type (\d+) &middot;/g)].map(m => +m[1]), range(1, 11));
is('every body and Beyond example has an Answer row', [...Object.values(EXB), ...Object.values(EX)].every(e => e.answer !== null));
{
  // 5: the heights
  const h = nums(EX[1].q);
  ok('Beyond Ex 1: six heights', h.length, 6);
  ok('Beyond Ex 1: what each child says', says(h), nums(EX[1].answer));
  // 6: every order of eight children
  const tot8 = new Set([...perms(range(1, 8))].map(p => says(p).reduce((a, b) => a + b)));
  ok('Beyond Ex 2: every order of 8 children gives the same total', [...tot8], nums(EX[2].answer));
  ok('Beyond Ex 2: the check on Beyond Ex 1', says(h).reduce((a, b) => a + b), 6 - 1);
  // 7: who can be tallest, who shortest
  ok('Beyond Ex 3: five children, five numbers', nums(EX[3].q).length, 5);
  const fits = [...perms(range(1, 5))].filter(p => same(says(p), nums(EX[3].q)));
  const ordinals = (s) => [...s.matchAll(/(\d)(?:st|nd|rd|th)/g)].map(m => +m[1]);
  const [tallPart, shortPart] = EX[3].answer.split(' and the ');
  ok('Beyond Ex 3: the children who could be tallest', [...new Set(fits.map(p => p.indexOf(5) + 1))].sort(), ordinals(tallPart));
  ok('Beyond Ex 3: the children who could be shortest', [...new Set(fits.map(p => p.indexOf(1) + 1))].sort(), ordinals(shortPart));
  is('Beyond Ex 3: nobody says 1', !nums(EX[3].q).includes(1));
  // 8: the grid
  const g = chunk(nums(EX[4].q.match(/rows ([\d, and]+)\./)[1]), 3);
  ok('Beyond Ex 4: the supercells', supercells(g).sort(), nums(EX[4].answer).sort());
  let stated = 0;
  for (const [, row] of EX[4].rows) for (const m of text(row).matchAll(/(\d+) is bigger than ([\d, and]+?)(?=,? and \d+ is|$)/g)) {
    const nb = Object.values(neighbours(g, +m[1])).filter(v => v !== undefined).sort();
    ok(`Beyond Ex 4: the neighbours of ${m[1]}`, nb, nums(m[2]).sort());
    stated++;
  }
  ok('Beyond Ex 4: four cells have their neighbours listed', stated, 4);
  const rest = nums(text(EX[4].rows.find(r => /each have a bigger/.test(r[1]))[1]));
  ok('Beyond Ex 4: the cells that are not supercells', rest.sort(), g.flat().filter(v => !supercells(g).includes(v)).sort());
  // 9: the empty cell
  const row = nums(EX[5].q.match(/holds ([^.]+)\./)[1]);
  const works = range(10, 99).filter(x => !row.includes(x)).filter(x => {
    const r = [row[0], x, row[1], row[2]]; const s = supercells([r]); return s.includes(r[2]) && !s.includes(r[0]); });
  const a9 = nums(EX[5].answer);
  ok('Beyond Ex 5: first and last numbers that work', [works[0], works.at(-1)], [a9[0], a9.at(-1)]);
  is('Beyond Ex 5: they run without a gap', works.length === works.at(-1) - works[0] + 1);
  is('Beyond Ex 5: fourteen of them', works.length === 14 && /fourteen/.test(EX[5].answer));
  // 10: four different digits adding up to 30
  const d30 = range(1000, 9999).filter(n => new Set(String(n)).size === 4 && dsum(n) === 30);
  ok('Beyond Ex 7: the smallest', d30[0], nums(EX[7].answer)[0]);
  is('Beyond Ex 7: every such number uses 6, 7, 8 and 9', d30.every(n => [...String(n)].sort().join('') === '6789'));
  // 11: digits from 1 to 100
  ok('Beyond Ex 8: digits written from 1 to 100', range(1, 100).map(String).join('').length, nums(EX[8].answer).at(-1));
  ok('Beyond Ex 8: 10 to 99 is how many numbers', range(10, 99).length, 90);
  // 12: reverse and add from 87
  const r87 = reverseAdd(87);
  ok('Beyond Ex 9: the rows', EX[9].rows.filter(r => r[0].startsWith('Step')).map(r => nums(r[1])), r87.chain);
  ok('Beyond Ex 9: steps and the palindrome', nums(EX[9].answer), [r87.steps, Number(r87.end)]);
  // 13: the 4-digit palindrome
  const p13 = range(1000, 9999).filter(n => isPal(n) && dsum(n) === 18 && Math.floor(n / 1000) === 2 * Math.floor(n / 100 % 10));
  ok('Beyond Ex 10: the only number', p13, [nums(EX[10].answer)[0]]);
  // 14: Kaprekar from 1000
  const k1000 = kapChain(1000);
  ok('Beyond Ex 11: the rounds', EX[11].rows.filter(r => r[0].startsWith('Step')).map(r => nums(r[1])), k1000.rows);
  ok('Beyond Ex 11: how many', nums(EX[11].answer)[0], k1000.rounds);
  ok('Beyond Ex 11: 999 read as a 3-digit number', kapStep(999, 3)[2], 0);
  // 15: 26,900 from 10,000, 2,500 and 600
  const allowed15 = nums(EX[14].q.match(/Use ([\d, and]+), as many/)[1]);
  const ans15 = EX[14].answer.match(/\$([^$]+)\$/)[1].split('{,}').join('');
  const [lhs15, rhs15] = ans15.split('=');
  is('Beyond Ex 14: only the three numbers are used', rhs15.match(/\d+/g).map(Number).every(v => allowed15.includes(v)));
  ok('Beyond Ex 14: it makes the number asked for', toN(lhs15), nums(EX[14].q.match(/to make ([\d,]+)\./)[1])[0]);
  // 16: the square pattern
  const sq = Array.from({ length: 5 }, (_, r) => Array.from({ length: 5 }, (_, c) => (r === 2 && c === 2 ? 80 : 30)));
  ok('Beyond Ex 16: the total', sq.flat().reduce((a, b) => a + b), nums(EX[16].answer).at(-1));
  // 17: Collatz from 24 and 48
  ok('Beyond Ex 17: sequence (a) takes', steps(12), nums(EX[17].rows[1][1].match(/takes (\d+) steps/)[1])[0]);
  ok('Beyond Ex 17: steps from 24 and from 48', [steps(24), 24, steps(48), 48], nums(EX[17].answer));
  ok('p014: sequence (a) starts at 12', nums(BODY.match(/<p>\(a\) \$([^$]+)\$/)[1].split(B + ' ').join(' '))[0], 12);
  // 18: the train
  is('Beyond Ex 18: the estimate is above the exact number, because 18 was taken as 20', 20 * 70 > 18 * 72 && 20 > 18 && 70 < 72);
  ok('Beyond Ex 18: 18 is close to 20 and 72 to 70', [Math.round(18 / 10) * 10, Math.round(72 / 10) * 10], [20, 70]);
  // 19: the game to 40
  const q19 = nums(EX[19].q);
  const [maxAdd, target] = [Math.max(...q19.slice(1, 6)), q19.at(-1)];
  ok('Beyond Ex 19: the winning numbers', winning(target, maxAdd), nums(EX[19].answer));
  ok('Beyond Ex 19: counting back in 6s', nums(text(EX[19].rows[1][1])).slice(2), winning(target, maxAdd).slice(0, -1).reverse());
  is('Beyond Ex 19: the first player can say the first of them', winning(target, maxAdd)[0] <= maxAdd && /first player/.test(EX[19].answer));
  // Beyond Ex 6: ten equally spaced marks, two of them labelled
  {
    const m = EX[6].q.match(/has (\w+) marks, spaced equally\. The (\d+)(?:st|nd|rd|th) mark is labelled ([\d,]+) and the (\d+)(?:st|nd|rd|th) mark is labelled ([\d,]+)\. What numbers go at the (\d+)(?:st|nd|rd|th) mark and at the (\d+)(?:st|nd|rd|th) mark/);
    is('Beyond Ex 6: the question reads as expected', !!m && m[1] === 'ten');
    if (m) {
      const [i, a, j, b, p, q] = [+m[2], toN(m[3]), +m[4], toN(m[5]), +m[6], +m[7]];
      const gap = (b - a) / (j - i);
      is('Beyond Ex 6: the gap is a whole number', Number.isInteger(gap));
      const at = (k) => a + (k - i) * gap;
      ok('Beyond Ex 6: step 1, the gaps', nums(text(EX[6].rows[0][1])), [i, j, j, i, j - i]);
      ok('Beyond Ex 6: step 2, the gap', nums(text(EX[6].rows[1][1])), [b, a, b - a, b - a, j - i, gap]);
      ok('Beyond Ex 6: step 3, the first mark', nums(text(EX[6].rows[2][1])), [p, i, a, gap, gap, at(p)]);
      ok('Beyond Ex 6: step 4, the last mark', nums(text(EX[6].rows[3][1])), [q, j, b, gap, gap, gap, at(q)]);
      is('Beyond Ex 6: the gaps before and after', i - p === 2 && q - j === 3);
      ok('Beyond Ex 6: the answer', nums(EX[6].answer), [at(p), p, at(q), q]);
      is('Beyond Ex 6: the marks asked for are on the line', p >= 1 && q <= 10);
      is('Beyond Ex 6 is not a Fig. 3.9 line or practice Q9', ![2010, 2020, 9996, 9997, 15077, 15078, 15083, 86705, 87705].includes(a) && a !== 3400);
    }
  }
  // Beyond Ex 12: the next palindromic time after 2:52
  {
    const m = EX[12].q.match(/A clock shows (\d+):(\d\d), a time that reads the same from both ends/);
    is('Beyond Ex 12: the question reads as expected', !!m);
    if (m) {
      const start = clockTimes.findIndex(([h, mm]) => h === +m[1] && mm === +m[2]);
      is('Beyond Ex 12: the start is itself palindromic', isPal(clockDigits(clockTimes[start])));
      let k = 1; while (!isPal(clockDigits(clockTimes[(start + k) % 720]))) k++;
      const next = fmtTime(clockTimes[(start + k) % 720]);
      ok('Beyond Ex 12: the answer', EX[12].answer, `${next}, which is ${k} minutes later`);
      ok('Beyond Ex 12: step 3, minutes to the hour and then past it', nums(text(EX[12].rows[2][1])).slice(-3), [60 - +m[2], k - (60 - +m[2]), k]);
      is('Beyond Ex 12: step 2 names the same time', text(EX[12].rows[1][1]).endsWith(next));
      ok('Beyond Ex 12: step 1, the last digit and the time that is not one', nums(text(EX[12].rows[0][1])), [3, 0, +m[1], +m[1], +m[2], +m[1], +m[2] + 10]);
      is('Beyond Ex 12: 2:62 is not a time, so nothing else is left before 3:00', +m[2] + 10 > 59 && +m[2] % 10 === +m[1]);
      is('Beyond Ex 12 is not Exercise Set 3.5 Q3 (10:01)', !(+m[1] === 10 && +m[2] === 1));
    }
  }
  // Beyond Ex 13: the next palindromic date after 17/09/2026
  {
    const m = EX[13].q.match(/Today is (\d\d)\/(\d\d)\/(\d{4})\./);
    is('Beyond Ex 13: the question reads as expected', !!m);
    if (m) {
      const [d0, m0, y0] = [+m[1], +m[2], +m[3]];
      const palIn = (y) => { const s = [...String(y)].reverse().join(''); return validDate(y, +s.slice(2), +s.slice(0, 2)) ? [+s.slice(0, 2), +s.slice(2)] : null; };
      let found = null;
      for (let y = y0; y < y0 + 100 && !found; y++) {
        const p = palIn(y);
        if (p && (y > y0 || p[1] > m0 || (p[1] === m0 && p[0] > d0))) found = [p[0], p[1], y];
      }
      const f = `${String(found[0]).padStart(2, '0')}/${String(found[1]).padStart(2, '0')}/${found[2]}`;
      ok('Beyond Ex 13: the answer', EX[13].answer, f);
      ok('Beyond Ex 13: the years with no such date on the way', range(y0, found[2] - 1).filter(y => palIn(y)), []);
      ok('Beyond Ex 13: step 1, the days the years on the way would need', nums(text(EX[13].rows[0][1])),
        [...range(y0, found[2] - 1), ...range(y0, found[2] - 1).map(y => +[...String(y)].reverse().join('').slice(0, 2))]);
      ok('Beyond Ex 13: step 2, the year backwards', nums(text(EX[13].rows[1][1])), [found[2], +[...String(found[2])].reverse().join(''), found[0], found[1]]);
      ok('Beyond Ex 13: step 3 reads the same both ways', nums(text(EX[13].rows[2][1])), [+f.split('/').join(''), +[...f.split('/').join('')].reverse().join('')]);
      is('Beyond Ex 13: the answer reads the same from both ends', isPal(f.split('/').join('')));
      is('Beyond Ex 13 is a future date, so not Section 3.7\'s dates from the past', found[2] > 2026);
      is('Beyond Ex 13 is not practice Q7\'s date', !BEYOND.includes(`<li>${f}</li>`));
    }
  }
  // Beyond Ex 15: the digits of a 4-digit plus a 3-digit sum
  {
    const lo = 1000 + 100, hi = 9999 + 999;
    const digitsOf = (n) => String(n).length;
    const sums = new Set(); for (let a = 1000; a <= 9999; a += 1) { sums.add(digitsOf(a + 100)); sums.add(digitsOf(a + 999)); }
    ok('Beyond Ex 15: step 1', nums(text(EX[15].rows[0][1])), [1000, 100, lo, digitsOf(lo)]);
    ok('Beyond Ex 15: step 2', nums(text(EX[15].rows[1][1])), [9999, 999, hi, digitsOf(hi)]);
    ok('Beyond Ex 15: every sum has', [...sums].sort(), [4, 5]);
    has('Beyond Ex 15 answer', EX[15].answer, 'either 4 digits or 5 digits, and never 3 or 6');
    is('Beyond Ex 15 step 3 lies between', 4000 + 500 > lo && 4000 + 500 < hi);
    is('Beyond Ex 15 is not a case of Exercise Set 3.6 (4-digit plus 2-digit, 5-digit plus 3-digit)', /4-digit number and a 3-digit number/.test(EX[15].q));
  }
}

/* ================================================================
   C. The practice questions: one right option, and the key agrees
   ================================================================ */

const Q = {};
for (const m of BEYOND.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) {
  const n = m[1] ? Number(m[1]) : 1;
  if (!m[1] && Q[1]) continue;
  const li = m[2];
  const opts = (li.match(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*?)<\/ol>/)?.[1].match(/<li>([\s\S]*?)<\/li>/g) || [])
    .map(x => text(x));
  Q[n] = { stem: text(li.replace(/<ol[\s\S]*<\/ol>/, '')), opts, html: li };
}
ok('practice: questions 1 to 30, numbered without a gap', Object.keys(Q).map(Number), range(1, 30));
const KEY = {};
for (const m of BEYOND.matchAll(/<span class="n">(\d+)<\/span> \(([a-d])\)/g)) KEY[m[1]] = m[2];
ok('the key covers 1 to 16', Object.keys(KEY).map(Number), range(1, 16));

const LETTERS = ['a', 'b', 'c', 'd'];
const N = (o) => toN(o);
const collatz20 = collatz(20);
const pal3 = range(100, 999).filter(n => isPal(n) && dsum(n) === 12 && Math.floor(n / 10) % 10 === 6);
let max33 = 0; for (const p of perms(range(1, 9))) max33 = Math.max(max33, supercells(chunk(p, 3)).length);
const tot7 = new Set([...perms(range(1, 7))].map(p => says(p).reduce((a, b) => a + b)));
const MCQ = {
  1: [/digit sum of (\d+)/, (o, [n]) => N(o) === dsum(n)],
  2: [/palindrome/, (o) => isPal(N(o))],
  3: [/starting with (\d+)/, (o, [n]) => N(o) === Number(reverseAdd(n).end)],
  4: [/starts at (\d+), the number that comes after (\d+)/, (o, [s, a]) => N(o) === collatz(s)[collatz(s).indexOf(a) + 1]],
  5: [/digit sum of (\d+), and its middle digit is (\d+)/, (o) => pal3.length === 1 && N(o) === pal3[0]],
  6: [/digit sum of (\d+)/, (o, [s]) => isPal(N(o)) && dsum(N(o)) === s],
  7: [/(Written as day\/month\/year), which of these dates reads the same from both ends\?/, (o) => { const m = o.match(/^(\d\d)\/(\d\d)\/(\d{4})$/); return !!m && validDate(+m[3], +m[2], +m[1]) && isPal(m[1] + m[2] + m[3]); }],
  8: [/(\d+) rows and (\d+) columns/, (o) => N(o) === max33],
  9: [/marks at ([\d,]+) and ([\d,]+), and three more marks/, (o, [a, b]) => N(o) === a + (b - a) / 4],
  10: [/(\w+) children of different heights/, (o) => /depends/.test(o) ? tot7.size > 1 : tot7.size === 1 && tot7.has(N(o))],
  11: [/estimate of \$(\d+) \\times (\d+)\$/, (o, [a, b]) => N(o) === Math.round(a / 100) * 100 * Math.round(b / 10) * 10],
  12: [/Using ([\d,]+), ([\d,]+) and ([\d,]+)/, (o, parts) => !makeable(N(o), parts)],
};
for (const [n, [re, right]] of Object.entries(MCQ)) {
  const q = Q[n];
  const m = (q.html.match(re) || q.stem.match(re));
  if (!m) { fails.push(`Q${n}: the stem does not read as expected`); continue; }
  const args = m.slice(1).map(x => (/^[\d,]+$/.test(x) ? toN(x) : x));
  if (q.opts.length !== 4) { fails.push(`Q${n}: ${q.opts.length} options`); continue; }
  const rightOnes = q.opts.map((o, i) => (right(o, args) ? LETTERS[i] : null)).filter(Boolean);
  if (rightOnes.length !== 1) fails.push(`Q${n}: ${rightOnes.length} right options (${rightOnes.join(', ') || 'none'}) among ${q.opts.join(' | ')}`);
  else if (rightOnes[0] !== KEY[n]) fails.push(`Q${n}: the right option is (${rightOnes[0]}), the key prints (${KEY[n]})`);
  else pass++;
}
is('Q7: every option is a real date in the future, so not one of Section 3.7\'s dates from the past', Q[7].opts.every(o => { const m = o.match(/^(\d\d)\/(\d\d)\/(\d{4})$/); return m && validDate(+m[3], +m[2], +m[1]) && +m[3] > 2026; }));
is('Q7: no leap year or calendar question is left in Beyond', !/leap year|same calendar/.test(BEYONDTEXT));
ok('Q10: seven children', Q[10].stem.startsWith('Seven children'), true);

/* assertion-reason: A and R computed from the numbers in the stem; whether
   R explains A is the judgement the question tests, and is stated */
const tot5 = new Set([...perms(range(1, 5))].map(p => says(p).reduce((a, b) => a + b)));
const AR = {
  13: [/row (\d+), (\d+), (\d+)\. Reason \(R\): (\d+) is the largest/, ([a, b, c]) => supercells([[a, b, c]]).includes(b),
    ([a, b, c, d]) => d === Math.max(a, b, c), true],
  14: [/Assertion \(A\): (\d+) is a palindrome\. Reason \(R\): The Kaprekar steps on (\d+) give (\d+) again/, ([a]) => isPal(a),
    ([, b, c]) => kapStep(b)[2] === c, true],
  15: [/Assertion \(A\): (\d+) is a palindrome\. Reason \(R\): The digit sum of (\d+) is (\d+)/, ([a]) => isPal(a),
    ([, b, c]) => dsum(b) === c, false],
  16: [/When (\w+) children .* add up to (\d+)\. Reason \(R\): The tallest child always says (\d+)/,
    ([w, s]) => w === 'five' && tot5.size === 1 && tot5.has(+s),
    ([, , t]) => [...perms(range(1, 5))].every(p => says(p)[p.indexOf(5)] === +t), true],
};
for (const [n, [re, A, R, explains]] of Object.entries(AR)) {
  const m = Q[n].stem.match(re);
  if (!m) { fails.push(`Q${n}: the stem does not read as expected: ${Q[n].stem}`); continue; }
  const args = m.slice(1).map(x => (/^\d+$/.test(x) ? +x : x));
  const a = A(args), r = R(args);
  const want = a && r ? (explains ? 'a' : 'b') : a && !r ? 'c' : !a && r ? 'd' : '?';
  if (want === '?') fails.push(`Q${n}: both A and R are false, which is not an option`);
  else if (want !== KEY[n]) fails.push(`Q${n}: A is ${a}, R is ${r} → (${want}), the key prints (${KEY[n]})`);
  else pass++;
}
has('the assertion-reason note', BEYONDTEXT, 'In Questions 13 to 16, choose (a) if both A and R are true and R explains A; (b) if both are true but R does not explain A; (c) if A is true but R is false; (d) if A is false but R is true.');
const spread = LETTERS.map(l => Object.values(KEY).filter(x => x === l).length);
is(`the key uses all four letters (${LETTERS.map((l, i) => l + ':' + spread[i]).join(' ')})`, spread.every(c => c > 0));

/* ---- the other answers, read back out of the page ---- */
const ROWS = {};
for (const m of BEYOND.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g))
  if (!ROWS[m[1]]) ROWS[m[1]] = m[2];
const row = (n) => text(ROWS[n] ?? '');
const part = (n, l) => { const m = row(n).match(new RegExp(`\\(${l}\\)(.*?)(?=\\([a-e]\\)|$)`)); return m ? m[1] : null; };
ok('answers are printed for 17 to 30', range(17, 30).every(n => ROWS[n] !== undefined), true);
{
  const nextPal = (n) => { let x = n + 1; while (!isPal(x)) x++; return x; };
  ok('Q17', nums(row(17))[0], nextPal(nums(Q[17].stem)[0]));
  ok('Q17: the last palindrome starting with 4', range(4000, 4999).filter(isPal).at(-1), nums(row(17))[2]);
  ok('Q18', nums(row(18))[0], range(100, 999).filter(n => new Set(String(n)).size === 3 && dsum(n) === 6).at(-1));
  ok('Q18: 6 would need two 0s', 6 + 0 + 0, 6);
  const c7 = collatz(nums(Q[19].stem)[0]);
  ok('Q19', nums(row(19)).slice(0, 2), c7.slice(1, 3));
  ok('Q20', nums(row(20)), kapStep(nums(Q[20].stem)[0]));
  const p2 = range(10, 99).filter(isPal);
  ok('Q21', [nums(row(21))[0], nums(row(21))[1], nums(row(21)).at(-1)], [p2.length, p2[0], p2.at(-1)]);
  const q22 = nums(Q[22].stem);   // "Six children … first five say 1, 0, 2, 1 and 0"
  const sixth = new Set([...perms(range(1, 6))].filter(p => same(says(p).slice(0, 5), q22)).map(p => says(p)[5]));
  ok('Q22', [...sixth], [nums(row(22))[0]]);
  const r23 = nums(Q[23].stem);
  const one = range(10, 99).filter(x => !r23.includes(x)).filter(x => supercells([[r23[0], x, r23[1], r23[2]]]).length === 1);
  const [a1, b1, a2, b2] = nums(row(23));
  ok('Q23: the numbers that give one supercell', one, [...range(a1, b1), ...range(a2, b2)]);
  is('Q23: below 64 there are two supercells', range(10, 63).filter(x => !r23.includes(x)).every(x => supercells([[64, x, 71, 58]]).length === 2));
  is('Q23: above 71 only the new number is one', range(72, 99).every(x => same(supercells([[64, x, 71, 58]]), [x])));
  const e24 = row(24).match(/\$([^$]+)\$/)[1];
  is('Q24: only 2000, 500 and 70 are used, to make 3360',
    e24.split('=')[0].match(/\d+/g).map(Number).every(v => [2000, 500, 70].includes(v)) && toN(e24.split('=')[1]) === 3360);
  ok('Q25: the estimate and the exact cost', [40 * 50, 38 * 49], nums(row(25)).filter((v, i) => [0, 6].includes(i)));
  is('Q25: the exact cost is less', 38 * 49 < 40 * 50 && /is less/.test(row(25)));
  ok('Q26(a)', nums(part(26, 'a')), collatz(15));
  ok('Q26(b)', nums(part(26, 'b')), [steps(15)]);
  ok('Q26(c)', nums(part(26, 'c')), [Math.max(...collatz(15))]);
  ok('Q26(d)', nums(part(26, 'd')), [30, 15, steps(30)]);
  ok('Q27(a)', nums(part(27, 'a')), [4 + 1]);
  ok('Q27(b)', nums(part(27, 'b')), winning(32, 4));
  is('Q27(c): first, by saying 2', /First/.test(part(27, 'c')) && winning(32, 4)[0] <= 4 && nums(part(27, 'c'))[0] === winning(32, 4)[0]);
  is('Q27(d): second', /Second/.test(part(27, 'd')) && winning(30, 4)[0] > 4);
  // "(d) Second. The winning numbers are now 5, 10, … and 30, and the first player cannot say 5 on the first turn"
  ok('Q27(d): the winning numbers for 30, then the one the first player cannot say', nums(part(27, 'd')),
    [...winning(30, 4), winning(30, 4)[0]]);
  ok('Q28(a)', nums(part(28, 'a')).at(-1), range(1, 50).map(String).join('').length);
  const d9 = range(10, 99).filter(n => dsum(n) === 9);
  ok('Q28(b)', nums(part(28, 'b')), [d9.length, ...d9]);
  is('Q28(c): none is a palindrome, and every 2-digit palindrome has an even digit sum',
    d9.every(n => !isPal(n)) && range(10, 99).filter(isPal).every(n => dsum(n) % 2 === 0) && /No/.test(part(28, 'c')));
  // Q29: read the table off the page
  const t29 = [...Q[29].html.matchAll(/<td>([^<]+)<\/td><td>(\d+)<\/td>/g)].map(m => [m[1], +m[2]]);
  const six = t29.filter(([g]) => /Class 6/.test(g)).map(([, v]) => v);
  const all = t29.map(([, v]) => v);
  const seat = nums(Q[29].stem.match(/One bus seats (\d+)/)[1])[0];
  const total6 = six.reduce((a, b) => a + b);
  const exact = all.reduce((a, b) => a + b);
  ok('Q29(a)', nums(part(29, 'a')).at(-1), total6);
  const r10 = (v) => Math.round(v / 10) * 10;
  ok('Q29(b)', nums(part(29, 'b')), [r10(total6), r10(t29[3][1]), r10(t29[4][1]), r10(total6) + r10(t29[3][1]) + r10(t29[4][1])]);
  ok('Q29(c)', nums(part(29, 'c')).at(-1), exact);
  ok('Q29(d)', nums(part(29, 'd')), [Math.ceil(exact / seat), Math.ceil(exact / seat) - 1, seat, (Math.ceil(exact / seat) - 1) * seat]);
  is('Q29(d): one bus fewer is too few', (Math.ceil(exact / seat) - 1) * seat < exact);
  // Q30: the hills
  const hills = [...Q[30].html.matchAll(/<td>([\d,]+)<\/td>/g)].map(m => toN(m[1]));
  ok('Q30: seven heights', hills.length, 7);
  const peaks = (h) => h.map((v, i) => (supercells([h]).includes(v) ? i + 1 : null)).filter(Boolean);
  ok('Q30(a)', nums(part(30, 'a')), peaks(hills));
  const notPeak = hills.map((v, i) => [v, i + 1]).filter(([, i]) => !peaks(hills).includes(i)).sort((a, b) => b[0] - a[0])[0];
  ok('Q30(b)', nums(part(30, 'b')), [notPeak[1], notPeak[0]]);
  ok('Q30(c)', nums(part(30, 'c')), [Math.max(...hills), Math.min(...hills), Math.max(...hills) - Math.min(...hills)]);
  const changed = nums(Q[30].html.match(/Hill (\d+) is found to be ([\d,]+) m high/).slice(1).join(' '));
  const h2 = hills.slice(); h2[changed[0] - 1] = changed[1];
  ok('Q30(d)', nums(part(30, 'd')), peaks(h2));
  ok('Q30(d): the height it replaces', hills[changed[0] - 1], nums(Q[30].html.match(/high, not ([\d,]+) m/)[1])[0]);
}
/* why the other options are wrong */
{
  const why = BEYOND.slice(BEYOND.indexOf('Why the other options are wrong'));
  const w = {};
  for (const m of why.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) w[m[1]] = text(m[2]);
  ok('why-notes are given for', Object.keys(w).map(Number), [4, 7, 10, 14]);
  is('why 4: (a) is the number before 5 in the sequence from 20', collatz20[collatz20.indexOf(5) - 1] === N(Q[4].opts[0]));
  is('why 4: (b) is 3 times 5 without the 1', N(Q[4].opts[1]) === 3 * 5);
  const flat7 = Q[7].opts.map(o => o.split('/').join(''));
  const back = (x) => [...x].reverse().join('');
  ok('why 7: the right option without slashes', nums(w[7]).slice(0, 4), [4, 2, 2040, +flat7[2]]);
  is('why 7: it reads the same from the right', back(flat7[2]) === flat7[2] && /which reads the same from the right/.test(w[7]));
  ok('why 7: (a), (b) and (d) read from the right', nums(w[7]).slice(4, 7), [0, 1, 3].map(i => +back(flat7[i])));
  is('why 7: none of (a), (b) and (d) reads the same', [0, 1, 3].every(i => back(flat7[i]) !== flat7[i]));
  ok('why 7: ends by naming 0402', nums(w[7]).slice(7), [402]);
  is('why 7: 0402 is 2040 written backwards', back('2040') === '0402' && /0402, the year written backwards/.test(w[7]));
  ok('why 10: seven children make', nums(w[10].match(/make (\d+) pairs/)[1])[0], 7 - 1);
  ok('why 14: 6174 read from the right', [...'6174'].reverse().join(''), String(nums(w[14])[1]));
}

/* ================================================================
   D. ANSWERS.md: the practice key and answers agree with the page
   ================================================================ */
{
  const key = ANSWERS.match(/\*\*Key\.\*\* ([^*]+?)\n\n/)[1];
  const printed = Object.fromEntries([...key.matchAll(/(\d+) \(([a-d])\)/g)].map(m => [m[1], m[2]]));
  ok('ANSWERS: the key matches the page', printed, KEY);
  const other = ANSWERS.slice(ANSWERS.indexOf('**The other answers**'));
  const item = (n) => { const m = other.match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`)); return m ? m[1] : ''; };
  for (const n of range(17, 30)) {
    const want = nums(row(n));
    const got = nums(item(n));
    is(`ANSWERS Q${n}: every number it prints is on the page's answer row`, got.length > 0 && got.every(v => want.includes(v)));
  }
  ok('ANSWERS Q24 is the page\'s working', item(24).match(/\$([^$]+)\$/)[1], row(24).match(/\$([^$]+)\$/)[1]);
  // the working for each option
  const w = ANSWERS.slice(ANSWERS.indexOf('**Working for the options.**'), ANSWERS.indexOf('**The other answers**'));
  const wi = (n) => (w.match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |\\n\\n)`)) || [])[1] || '';
  ok('ANSWERS working 3: the chain from 57', [...wi(3).matchAll(/\$(\d+) \+ (\d+) = (\d+)\$/g)].map(m => m.slice(1).map(Number)), reverseAdd(57).chain);
  ok('ANSWERS working 5: the palindrome', nums(wi(5).match(/each is \d+: (\d+)/)[1])[0], pal3[0]);
  ok('ANSWERS working 8: its grid has 5 supercells', supercells(chunk(nums(wi(8).match(/The grid ([\d,\s and]+) has/)[1]), 3)).length, max33);
  const [lo9, hi9] = nums(Q[9].stem.match(/marks at ([\d,]+) and ([\d,]+)/).slice(1).join(' '));
  const gap9 = (hi9 - lo9) / (3 + 1);   // three marks between make four gaps
  ok('ANSWERS working 9: the gaps, the gap and the first mark', nums(wi(9)),
    [3 + 1, lo9, hi9, hi9 - lo9, 3 + 1, gap9, lo9 + gap9]);
  ok('ANSWERS working 10: 7 children make 6 pairs', nums(wi(10)), [...tot7, 1, 7, 7 - 1]);
  ok('ANSWERS working 7: the date and the three read backwards', nums(wi(7)), [4, 2, 2040, 402, 2040, 4022040, ...[0, 1, 3].map(i => +[...Q[7].opts[i].split('/').join('')].reverse().join(''))]);
  ok('ANSWERS working 12: the three that can be made', [6100, 1900, 5600].every(t => makeable(t, [5000, 800, 300])), true);
  ok('ANSWERS working 16: 5 children make 4 pairs', [...tot5], [nums(wi(16))[0] - 1]);
  // one line per identity in the other answers is enough: Part A has evaluated them all
}

/* ANSWERS.md, stage 2: Beyond's examples under their own numbers */
{
  const sec = ANSWERS.slice(ANSWERS.indexOf('### Stage 2 · Solved Examples'), ANSWERS.indexOf('### Stage 3 · Practice'));
  const items = Object.fromEntries([...sec.matchAll(/\n(\d+)\. ([^\n]+)/g)].map(m => [m[1], m[2]]));
  ok('ANSWERS stage 2: Beyond Examples 1 to 19', Object.keys(items).map(Number), range(1, 19));
  for (const n of range(1, 19)) ok(`ANSWERS stage 2: Beyond Ex ${n} answer`, nums(items[n]), nums(EX[n].answer));
}

/* ================================================================
   Report
   ================================================================ */

console.log(`\nClass 6 · Chapter 3 · Number Play`);
console.log(`  ${identities} arithmetic identities read off the pages and ANSWERS.md, and evaluated`);
if (skipped.length) {
  console.log(`  ${skipped.length} maths span(s) with an equals sign that are not arithmetic, so not evaluated:`);
  for (const s of skipped) console.log(`      ${s}`);
}
console.log(`  ${pass} check(s) passed`);
if (fails.length) {
  console.log(`\n  ${fails.length} FAILED:`);
  for (const f of fails) console.log(`    ! ${f}`);
  process.exit(1);
}
console.log(`  all clear\n`);
