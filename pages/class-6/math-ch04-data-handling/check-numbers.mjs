#!/usr/bin/env node
/* Re-derive every number this chapter prints.

     node pages/class-6/math-ch04-data-handling/check-numbers.mjs [--show]

   A chapter about data gets its numbers from its data, so this reads the
   data where it is printed: every table cell, every tally mark (counted
   stroke by stroke out of the SVG), every pictograph symbol (counted, with
   half symbols, and multiplied by the key printed on that figure) and
   every bar (measured from its SVG coordinates against the figure's own
   axis ticks). Each value is then compared with the other places that
   print it — a table against its figure, a figure against its prose — and
   with every question and answer that uses it. Nothing below restates a
   printed value as the thing to check it against, except where a line
   says so and why.

   Four parts:
     A  every arithmetic identity set as maths, on the pages and in ANSWERS.md
     B  the data: tables, tallies, pictographs, bar graphs, and the answers
        the chapter, the worked examples and the practice print from them
     C  every multiple-choice and assertion-reason question — exactly one
        option is right, and it is the one the printed key gives
     D  ANSWERS.md

   Exits non-zero if anything does not hold up. */

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
const sum = (xs) => xs.reduce((a, b) => a + b, 0);
const r2 = (x) => Math.round(x * 100) / 100;
const near = (a, b, tol = 0.02) => Math.abs(a - b) <= tol;
/* a coordinate is printed to two decimals, so a bar read through it can
   miss its value by what 0.01 of a drawing unit is worth on that axis:
   150.01 is 150. `perPx` is the axis's value for one drawing unit. */
const snap = (v, perPx) => Math.abs(v - Math.round(v)) <= 0.01 * Math.abs(perPx) + 1e-6 ? Math.round(v) : r2(v);

/* ---- the pages ------------------------------------------------ */

const files = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const HTML = Object.fromEntries(files.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const bodyFiles = files.filter(f => /^p0/.test(f));
const beyondFiles = files.filter(f => /^p1/.test(f));
const BODY = bodyFiles.map(f => HTML[f]).join('\n');
const BEYOND = beyondFiles.map(f => HTML[f]).join('\n');
const meta = JSON.parse(fs.readFileSync(path.join(DIR, 'chapter.json'), 'utf8'));
const folio = Object.fromEntries([...bodyFiles, ...beyondFiles].map((f, i) => [f, meta.startFolio + i]));

const flat = (s) => s.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&middot;/g, '·').replace(/&ndash;/g, '–').replace(/&amp;/g, '&')
  .replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
/* "4 and a half" is how this chapter writes 4.5; read it as a number */
const halves = (s) => s.replace(/(\d+) and a half/g, (_, n) => `${n}.5`);
const nums = (s) => [...halves(s).replace(/\\(times|div)/g, ' ').matchAll(/\d+(\.5)?/g)].map(m => Number(m[0]));

/* ---- A. every arithmetic identity ------------------------------ */

function toExpr(side) {
  const s = side.replace(/\\times/g, '*').replace(/\\div/g, '/')
    .replace(/\\,|\\ |\\quad/g, ' ').replace(/[{}]/g, '').replace(/\s+/g, '');
  return s && /^[-+*/()0-9.]+$/.test(s) ? s : null;
}
function sweep(text, where) {
  let n = 0;
  const skipped = [];
  for (const m of text.matchAll(/\$([^$]+)\$/g)) {
    if (!m[1].includes('=')) continue;
    const sides = m[1].split('=').map(s => s.trim()).filter(Boolean);
    const vals = sides.map(toExpr);
    if (sides.length < 2 || vals.some(v => v === null)) { skipped.push(`${where}: $${m[1]}$`); continue; }
    const got = vals.map(v => Function(`"use strict";return (${v})`)());
    n++;
    if (got.some(x => Math.abs(x - got[0]) > 1e-9)) fails.push(`${where}: $${m[1]}$ — sides are ${got.join(' and ')}`);
    else pass++;
  }
  return { n, skipped };
}
let identities = 0;
const skippedSpans = [];
for (const f of files) {
  const r = sweep(HTML[f], f);
  identities += r.n; skippedSpans.push(...r.skipped);
}

/* ---- reading tables ------------------------------------------- */

function tableAt(html, at) {
  const start = html.lastIndexOf('<table', at);
  const end = html.indexOf('</table>', at);
  return parseTable(html.slice(start, end));
}
function parseTable(t) {
  return [...t.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(r =>
    [...r[1].matchAll(/<t[hd]>([\s\S]*?)<\/t[hd]>/g)].map(c => c[1]));
}
function captioned(num) {
  const cap = `<caption>Table ${num} `;
  const at = BODY.indexOf(cap);
  if (at < 0) throw new Error(`Table ${num} is not on any page`);
  return tableAt(BODY, at);
}
/* a table with no caption, found by words just before it */
function tableAfter(src, words) {
  const at = src.indexOf(words);
  if (at < 0) throw new Error(`no text "${words}"`);
  return parseTable(src.slice(src.indexOf('<table', at), src.indexOf('</table>', at)));
}
const num = (c) => Number(flat(c));
// a table set across: first row heads, second row values
const across = (t) => Object.fromEntries(t[0].slice(1).map((h, i) => [flat(h), num(t[1][i + 1])]));

/* ---- reading tally marks -------------------------------------- */

// every stroke is one mark: an upright "M x y V y2" or a slash "M x y L x2 y2"
const tallyCount = (svg) => (svg.match(/M[\d.]+ [\d.]+ V/g) || []).length + (svg.match(/ L[\d.]+ [\d.]+/g) || []).length;
function tallyCell(cell, what) {
  const n = tallyCount(cell);
  const aria = Number((cell.match(/aria-label="(\d+) tally marks"/) || [])[1]);
  ok(`${what}: strokes drawn against the tally's aria-label`, n, aria);
  return n;
}

/* ---- reading figures ------------------------------------------ */

function figure(n) {
  for (const f of files) {
    const h = HTML[f];
    const at = h.indexOf(`<span class="fignum">Fig. ${n}</span>`);
    if (at < 0) continue;
    const start = h.lastIndexOf('<svg', at);
    const svg = h.slice(start, h.indexOf('</svg>', start));
    return { f, svg, aria: (svg.match(/aria-label="([^"]*)"/) || [])[1] || '' };
  }
  throw new Error(`Fig. ${n} is not on any page`);
}
const attrs = (s) => Object.fromEntries([...s.matchAll(/([a-z-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
const texts = (svg) => [...svg.matchAll(/<text ([^>]*)>([\s\S]*?)<\/text>/g)]
  .map(m => { const a = attrs(m[1]); return { cls: a.class, x: +a.x, y: +a.y, anchor: a['text-anchor'], t: flat(m[2]) }; });
const shapes = (svg) => [...svg.matchAll(/<(circle|path|polygon|rect) ([^>]*?)\/>/g)].map(m => {
  const a = attrs(m[2]);
  const s = { tag: m[1], cls: a.class, a };
  if (m[1] === 'circle') { s.cx = +a.cx; s.cy = +a.cy; s.w = 2 * +a.r; }
  else if (m[1] === 'rect') { s.cx = +a.x + +a.width / 2; s.cy = +a.y + +a.height / 2; s.w = +a.width; }
  else if (m[1] === 'polygon') {
    const p = a.points.trim().split(/\s+/).map(q => q.split(',').map(Number));
    s.pts = p; s.cy = sum(p.map(q => q[1])) / p.length;
    s.w = Math.max(...p.map(q => q[0])) - Math.min(...p.map(q => q[0]));
    s.cx = (Math.max(...p.map(q => q[0])) + Math.min(...p.map(q => q[0]))) / 2;
  } else {
    const v = (a.d.match(/-?[\d.]+/g) || []).map(Number);
    s.d = a.d; s.v = v;
    if (/^M[\d.]+ [\d.]+ A/.test(a.d)) { s.cx = v[0]; s.cy = (v[1] + v[8]) / 2; }
  }
  return s;
});

/* A pictograph: count the symbols in each row, halves included, and
   multiply by the key printed on the figure. `weight` says what one drawn
   shape is worth: 1 for a whole symbol, 0.5 for a half, 0 for a part that
   is not counted (an outline, an eye). */
function pictograph(n, weight) {
  const g = figure(n);
  const labels = texts(g.svg).filter(t => t.cls === 'dg-tick' && t.anchor === 'start');
  const keyNote = texts(g.svg).find(t => t.cls === 'dg-note' && /^=/.test(t.t));
  const key = nums(keyNote.t)[0];
  const rows = Object.fromEntries(labels.map(l => [l.t, 0]));
  let keySymbols = 0;
  for (const s of shapes(g.svg)) {
    const w = weight(s);
    if (!w) continue;
    if (s.cy < 22) { keySymbols += w; continue; }
    const l = labels.reduce((b, c) => Math.abs(c.y - 3.6 - s.cy) < Math.abs(b.y - 3.6 - s.cy) ? c : b);
    rows[l.t] += w;
  }
  ok(`Fig ${n}: the key shows one whole symbol`, keySymbols, 1);
  const values = Object.fromEntries(Object.entries(rows).map(([k, v]) => [k, v * key]));
  show(`Fig ${n}`, JSON.stringify({ key, symbols: rows, values }));
  return { key, symbols: rows, values, g };
}
const byClass = (cls, halfTag) => (s) => s.cls !== cls ? 0 : s.tag === halfTag ? 0.5 : s.tag === 'path' ? 0.5 : 1;

/* A bar graph: the numeric ticks fix the axis — value = a + b × position —
   and every bar is read at its end. The ticks must lie on one straight
   line, or the scale is not a scale; a figure that is meant to break that
   rule says so with `linear: false`. */
function barGraph(n, { across = false, linear = true } = {}) {
  const g = figure(n);
  const T = texts(g.svg);
  const ticks = T.filter(t => t.cls === 'dg-tick' && /^\d+$/.test(t.t) && (across ? t.anchor === 'middle' : t.anchor === 'end'))
    .map(t => ({ v: +t.t, p: across ? t.x : t.y - 3.6 })).sort((a, b) => a.v - b.v);
  const lo = ticks[0], hi = ticks[ticks.length - 1];
  const slope = (hi.v - lo.v) / (hi.p - lo.p);
  const onLine = ticks.every(t => near(lo.v + (t.p - lo.p) * slope, t.v, 0.01 * (hi.v - lo.v)));
  if (linear) is(`Fig ${n}: the axis ticks lie on one straight scale`, onLine);
  // read a position through the ticks (piecewise, so an unequal scale reads right too)
  const read = (p) => {
    for (let i = 0; i < ticks.length - 1; i++) {
      const a = ticks[i], b = ticks[i + 1];
      const k = (b.v - a.v) / (b.p - a.p);
      if ((p - a.p) * (p - b.p) <= 1e-6) return snap(a.v + (p - a.p) * k, k);
    }
    return snap(lo.v + (p - lo.p) * slope, slope);
  };
  const bars = shapes(g.svg).filter(s => s.tag === 'rect' && s.cls === 'dg-fill-b').map(s => ({ ...s, ...attrs(`x="${s.a.x}" y="${s.a.y}" width="${s.a.width}" height="${s.a.height}"`) }));
  const out = {};
  if (!across) {
    const base = lo.p;
    const cats = T.filter(t => t.cls === 'dg-tick' && t.anchor === 'middle' && t.y > base);
    for (const c of cats) {
      const b = bars.find(r => near(+r.x + +r.width / 2, c.x, 0.6));
      if (b) is(`Fig ${n}: the bar for ${c.t} stands on 0`, near(+b.y + +b.height, base, 0.05));
      out[c.t] = b ? read(+b.y) : 0;
    }
    is(`Fig ${n}: every bar has a label`, bars.every(b => cats.some(c => near(+b.x + +b.width / 2, c.x, 0.6))));
    is(`Fig ${n}: every bar is the same width`, bars.every(b => +b.width === +bars[0].width));
  } else {
    const base = lo.p;
    const cats = T.filter(t => t.cls === 'dg-tick' && t.anchor === 'end');
    for (const c of cats) {
      const b = bars.find(r => c.y >= +r.y && c.y <= +r.y + +r.height + 1);
      if (b) is(`Fig ${n}: the bar for ${c.t} starts at 0`, near(+b.x, base, 0.05));
      out[c.t] = b ? read(+b.x + +b.width) : 0;
    }
    is(`Fig ${n}: every bar is the same thickness`, bars.every(b => +b.height === +bars[0].height));
  }
  // the unit the note names is the step between two grid lines
  const note = T.find(t => /unit length =/.test(t.t));
  const grid = ((g.svg.match(/class="dg-grid" d="([^"]*)"/) || [])[1] || '');
  const gpos = [...grid.matchAll(across ? /M([\d.]+) [\d.]+ V/g : /M[\d.]+ ([\d.]+) H/g)].map(m => +m[1]).sort((a, b) => a - b);
  const step = gpos.length > 1 ? Math.abs(read(gpos[1]) - read(gpos[0])) : null;
  if (note) ok(`Fig ${n}: the note "${note.t}" is the step between grid lines`, step, nums(note.t)[nums(note.t).length - 1]);
  show(`Fig ${n}`, JSON.stringify(out), 'step', step);
  return { values: out, step, ticks, g, onLine, read };
}
const vals = (o, keys) => keys.map(k => o[k]);

/* ---- B. the data ------------------------------------------------ */

const F = {};

// Table 4.1 and Exercise Set 4.1
{
  const t = captioned('4.1').slice(1);
  const games = t.flatMap(r => [[r[0], r[1]], [r[2], r[3]], [r[4], r[5]]]).filter(([n]) => flat(n)).map(([, g]) => flat(g));
  const count = {};
  for (const g of games) count[g] = (count[g] || 0) + 1;
  const sorted = Object.entries(count).sort((a, b) => b[1] - a[1]);
  F.games = { total: games.length, count, most: sorted[0], fewest: sorted[sorted.length - 1] };
  show('Table 4.1', JSON.stringify(F.games));
  is('Table 4.1 has one most popular game', sorted[0][1] > sorted[1][1]);
  is('Table 4.1 has one least popular game', sorted[sorted.length - 1][1] < sorted[sorted.length - 2][1]);
}

// Fig. 4.1 — tally marks, grouped as they are drawn
{
  const g = figure('4.1');
  const marks = [...g.svg.matchAll(/M([\d.]+) [\d.]+ [VL]/g)].map(m => +m[1]).sort((a, b) => a - b);
  const groups = [];
  for (const x of marks) {
    if (groups.length && x - groups[groups.length - 1].last < 12) { groups[groups.length - 1].n++; groups[groups.length - 1].last = x; }
    else groups.push({ n: 1, last: x });
  }
  const labels = texts(g.svg).map(t => +t.t);
  ok('Fig 4.1: each group of strokes against the number under it', groups.map(q => q.n), labels);
}

// Table 4.2, Table 4.7, Fig. 4.11 — the sweets
{
  const t = captioned('4.2').slice(1);
  F.sweets = Object.fromEntries(t.map(r => [flat(r[0]), tallyCell(r[1], `Table 4.2 ${flat(r[0])}`)]));
  for (const r of t) if (flat(r[2])) ok(`Table 4.2 ${flat(r[0])}: printed frequency`, num(r[2]), F.sweets[flat(r[0])]);
  const t7 = Object.fromEntries(captioned('4.7').slice(1).map(r => [flat(r[0]), num(r[1])]));
  ok('Table 4.7 repeats Table 4.2', t7, F.sweets);
  const b = barGraph('4.11');
  ok('Fig 4.11 is Table 4.7', Object.values(b.values), Object.values(t7));
  ok('Fig 4.11 uses 1 unit for 1 student, as the steps say', b.step, 1);
  const p4 = flat(HTML['p004.html']);
  is('p004: "the frequency of jalebi is 6, and the frequency of gulab jamun is 9"',
    p4.includes(`frequency of jalebi is ${F.sweets.Jalebi}, and the frequency of gulab jamun is ${F.sweets['Gulab jamun']}`));
  is('p013: "Jalebi was chosen by 6 students"', flat(BODY).includes(`Jalebi was chosen by ${F.sweets.Jalebi} students, so draw its bar ${F.sweets.Jalebi} units tall`));
}

// Table 4.3 — the shoe sizes, and the ordered list printed under it
{
  const sizes = captioned('4.3').flat().map(num);
  const ordered = [...sizes].sort((a, b) => a - b);
  const printed = nums(flat(HTML['p004.html'].match(/<div class="work work--centred">([\s\S]*?)<\/div>/)[1]));
  ok('Table 4.3 in ascending order is the list printed under it', printed, ordered);
  F.shoes = { max: Math.max(...sizes), min: Math.min(...sizes), five: sizes.filter(s => s === 5).length, over4: sizes.filter(s => s > 4).length, n: sizes.length,
    freq: [3, 4, 5, 6, 7].map(s => sizes.filter(x => x === s).length) };
  show('Table 4.3', JSON.stringify(F.shoes));
}

// Fig. 4.2 — how students travel
{
  const p = pictograph('4.2', byClass('dg-fill-a'));
  F.travel = p.values;
  ok('Fig 4.2 against its aria-label', Object.values(p.values), nums(p.g.aria));
}

// Fig. 4.3 and Example 1 — sleep
{
  const p = pictograph('4.3', (s) => s.cls === 'dg-fill-b' ? (near(s.w, 15, 0.1) ? 1 : near(s.w, 7.5, 0.1) ? 0.5 : NaN) : 0);
  F.sleep = p.values;
  ok('Fig 4.3 key', p.key, 10);
  ok('Fig 4.3 symbols', Object.values(p.symbols), [5, 2.5, 4]);
  is('p006: "one symbol stands for 10 children"', flat(HTML['p006.html']).includes(`one symbol stands for ${p.key} children`));
}

// Table 4.4, Fig. 4.4, Fig. 4.8 — absent students
{
  F.absent = across(captioned('4.4'));
  const p = pictograph('4.4', byClass('dg-fill-a'));
  ok('Fig 4.4 is Table 4.4', p.values, F.absent);
  const b = barGraph('4.8');
  ok('Fig 4.8 is Table 4.4', b.values, F.absent);
  ok('Fig 4.8 uses 1 unit for 1 student', b.step, 1);
}

// Table 4.5, Figs 4.5 and 4.6 — present students
{
  F.present = across(captioned('4.5'));
  const five = pictograph('4.5', byClass('dg-fill-a'));
  ok('Fig 4.5 is Table 4.5', five.values, F.present);
  ok('Fig 4.5 key is 5', five.key, 5);
  const ten = pictograph('4.6', byClass('dg-fill-a'));
  ok('Fig 4.6 is Table 4.5', ten.values, F.present);
  ok('Fig 4.6 key is 10', ten.key, 10);
  is('p008: "30 students are just 3 symbols"', flat(HTML['p008.html']).includes(`${3 * ten.key} students are just 3 symbols`));
  is('p008: "half a symbol can stand for 5 students"', flat(HTML['p008.html']).includes(`half a symbol can stand for ${ten.key / 2} students`));
  is('every class in Table 4.5 is a multiple of 5, so Fig 4.6 needs only halves', Object.values(F.present).every(v => v % 5 === 0));
  // Think and Reflect: 33 and 27 are not multiples of 5 or of 10
  is('33 and 27 cannot be drawn with keys of 5 or 10 and half symbols', [33, 27].every(v => v % 5 !== 0));
}

// Fig. 4.7 — library books; Table 4.6 — kites
{
  const p = pictograph('4.7', (s) => s.cls === 'dg-fill-c-soft' && s.tag === 'polygon' ? 0.5 : 0);
  F.books = p.values;
  ok('Fig 4.7 against its aria-label (Thursday none)', Object.values(p.values), nums(p.g.aria.replace('none', '0')));
  const t = captioned('4.6').slice(1);
  F.kites = Object.fromEntries(t.map(r => [flat(r[0]), num(r[1])]));
  is('Table 4.6 can be drawn with one symbol for 100 and half symbols', Object.values(F.kites).every(v => (v / 100) * 2 % 1 === 0));
}

// Fig. 4.9 — traffic, and the prose that reads it
{
  const b = barGraph('4.9', { across: true });
  F.traffic = b.values;
  ok('Fig 4.9 against its aria-label', Object.values(b.values), [150, 1200, 1000, 800, 700, 600]);
  const p = flat(HTML['p011.html']);
  const v = F.traffic;
  is('p011 reads the longest bar', p.includes(`7 to 8 a.m., when ${v['7–8']} vehicles passed`) && v['7–8'] === Math.max(...Object.values(v)));
  is('p011 reads the next longest bar', p.includes(`8 to 9 a.m., with ${v['8–9']} vehicles`) && v['8–9'] === [...Object.values(v)].sort((a, b) => b - a)[1]);
  is('p011 reads the shortest bar', p.includes(`about ${v['6–7']} vehicles passed`) && v['6–7'] === Math.min(...Object.values(v)));
  is('p011 reads the next shortest bar', p.includes(`with about ${v['11–12']} vehicles`) && v['11–12'] === [...Object.values(v)].sort((a, b) => a - b)[1]);
  ok('p011: 8 a.m. to 10 a.m.', nums(p.match(/\$1000 \+ 800 = 1800\$/)?.[0] || ''), [v['8–9'], v['9–10'], v['8–9'] + v['9–10']]);
  ok('Fig 4.9 uses 1 unit for 100 vehicles', b.step, 100);
  is('Exercise 4.5 Q6: the traffic falls each hour after 8 a.m.', v['8–9'] > v['9–10'] && v['9–10'] > v['10–11'] && v['10–11'] > v['11–12']);
}

// Fig. 4.10 — population; the labels on the bars
{
  const b = barGraph('4.10');
  const onBars = texts(b.g.svg).filter(t => t.anchor === 'middle' && t.y < 150 && /^\d+$/.test(t.t)).map(t => +t.t);
  F.pop = b.values;
  ok('Fig 4.10: each bar is as tall as the number on it', Object.values(b.values), onBars);
  ok('Fig 4.10 against its aria-label', Object.values(b.values), nums(b.g.aria).filter((_, i) => i % 2));
  ok('Fig 4.10 uses 1 unit for 10 crores', b.step, 10);
  is('p012: "5 units tall stands for 50 crores ... 8 units tall stands for 80 crores"',
    flat(HTML['p012.html']).includes(`5 units tall stands for ${5 * b.step} crores, and a bar 8 units tall stands for ${8 * b.step} crores`));
}

// Table 4.8, Fig. 4.12, Example 2
{
  F.runs = across(captioned('4.8'));
  const b = barGraph('4.12');
  ok('Fig 4.12 is Table 4.8', Object.values(b.values), Object.values(F.runs));
  ok('Fig 4.12 uses 1 unit for 10 runs', b.step, 10);
  const ex = flat(BODY.slice(BODY.indexOf('Example 2</div>'), BODY.indexOf('Example 3</div>')));
  is('Example 2: lowest 0 and highest 100', ex.includes(`lowest score is ${Math.min(...Object.values(F.runs))} and her highest score is ${Math.max(...Object.values(F.runs))}`));
}

// Table 4.9, Fig. 4.13, Example 3
{
  const t = captioned('4.9').slice(1);
  F.spend = Object.fromEntries(t.map(r => [flat(r[0]), num(r[1])]));
  const b = barGraph('4.13');
  ok('Fig 4.13 is Table 4.9', Object.values(b.values), Object.values(F.spend));
  ok('Fig 4.13 uses 1 unit for ₹200', b.step, 200);
  const ex = BODY.slice(BODY.indexOf('Example 3</div>'));
  for (const [item, v] of Object.entries(F.spend))
    is(`Example 3 works out ${item}`, flat(ex).includes(`${item}: $${v} \\div 200 = ${v / 200}$ units`.replace(/\$/g, '').replace(/\\div/g, '÷')) ||
      ex.includes(`${item}: $${v} \\div 200 = ${v / 200}$ units`));
}

// Table 4.10 and 4.11, Fig. 4.14 — Pooja's graph
{
  F.creatures = across(captioned('4.10'));
  F.tickets = across(captioned('4.11'));
  const g = figure('4.14');
  is('Fig 4.14 has no numbers on its scale', !texts(g.svg).some(t => /^\d+$/.test(t.t)));
  const grid = [...g.svg.match(/class="dg-grid" d="([^"]*)"/)[1].matchAll(/M[\d.]+ ([\d.]+) H/g)].map(m => +m[1]).sort((a, b) => b - a);
  const base = +g.svg.match(/class="dg-axis" d="M[\d.]+ [\d.]+ V([\d.]+)/)[1];
  const unit = r2(base - grid[0]);
  is('Fig 4.14 grid lines are equally spaced', grid.every((y, i) => near(base - y, unit * (i + 1), 0.05)));
  const units = {};
  for (const c of texts(g.svg).filter(t => t.cls === 'dg-tick')) {
    const b = shapes(g.svg).find(s => s.tag === 'rect' && near(s.cx, c.x, 0.6));
    units[c.t] = b ? r2(+b.a.height / unit) : 0;
  }
  F.pooja = { units, lines: grid.length, scale: F.tickets.Vidisha / units.Vidisha };
  show('Fig 4.14', JSON.stringify(F.pooja));
  ok('Fig 4.14: the question says Vidisha 6 units and Jabalpur 5 units', [units.Vidisha, units.Jabalpur], nums(flat(BODY).match(/The bar for Vidisha is (\d+) units long, and the bar for Jabalpur is (\d+) units long/).slice(1).join(' ')));
  ok('Fig 4.14: Jabalpur gives the same scale as Vidisha', F.tickets.Jabalpur / units.Jabalpur, F.pooja.scale);
  F.pooja.right = Object.fromEntries(Object.entries(F.tickets).map(([k, v]) => [k, v / F.pooja.scale]));
  F.pooja.wrong = Object.keys(units).filter(k => units[k] !== F.pooja.right[k]);
  ok('Fig 4.14: the bars that are wrong or missing', F.pooja.wrong, ['Indore', 'Sagar']);
  is('Fig 4.14: the tallest correct bar fits under the top line', Math.max(...Object.values(F.pooja.right)) <= grid.length);
}

// Chinu's vehicles (Exercise 4.6 Q3)
{
  const t = tableAfter(BODY, 'Chinu listed');
  const v = t.flat().map(flat).filter(Boolean);
  const count = {};
  for (const x of v) count[x] = (count[x] || 0) + 1;
  F.chinu = { n: v.length, count: Object.fromEntries(Object.entries(count).sort((a, b) => b[1] - a[1])) };
  show('Chinu', JSON.stringify(F.chinu));
}

// Bumrah's wickets (Exercise 4.6 Q5)
{
  const t = tableAfter(BODY, 'Faiz made');
  const w = t[0].slice(1).map(num), m = t[1].slice(1).map(num);
  F.bumrah = { matches: sum(m), four: m[w.indexOf(4)], plain: sum(w), total: sum(w.map((x, i) => x * m[i])) };
  ok('Bumrah table: the matches add up to the 30 the question names', F.bumrah.matches, nums(flat(BODY).match(/his last (\d+) matches/)[0])[0]);
  show('Bumrah', JSON.stringify(F.bumrah));
}

// Fig. 4.15 — tractors; Fig. 4.16 — girls
{
  const p = pictograph('4.15', (s) => s.tag === 'rect' && s.cls === 'dg-fill-b' ? 1 : 0);
  F.tractors = p.values;
  ok('Fig 4.15 against its aria-label', Object.values(p.values), nums(p.g.aria));
  const q = pictograph('4.16', byClass('dg-fill-c-soft'));
  F.girls = q.values;
  ok('Fig 4.16 key', q.key, 4);
  // the label spells the counts: "Class 2 four and a half, Class 3 five, …"
  const W = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8 };
  const spelt = q.g.aria.split(': ')[1].split(', ').map(part => {
    const m = part.match(/Class \d+ (?:has )?(\w+)( and a half)?/);
    return (W[m[1]] ?? Number(m[1])) + (m[2] ? 0.5 : 0);
  });
  ok('Fig 4.16 symbols against its aria-label', Object.values(q.symbols), spelt);
}

// Mudhol Hounds (Q8) and free time (Q9)
{
  const t = tableAfter(BODY, 'Mudhol Hounds are');
  F.dogs = across(t);
  const d = Object.values(F.dogs);
  F.dogKeys = [5, 6, 10, 12].filter(k => d.every(v => (v * 2) % k === 0));
  ok('Q8: keys that draw every village with whole and half symbols', F.dogKeys, [6, 12]);
  const f = tableAfter(BODY, 'students were asked what they like');
  F.free = Object.fromEntries(f.slice(1).map(r => [flat(r[0]), num(r[1])]));
  ok('Q9: the activities add up to the 120 students named', sum(Object.values(F.free)), nums(flat(BODY).match(/(\d+) school students were asked/)[0])[0]);
}

// Fig. 4.17 — saplings
{
  const b = barGraph('4.17');
  F.saplings = b.values;
  ok('Fig 4.17 against its aria-label', Object.values(b.values), nums(b.g.aria));
}

// Table 4.12, Fig. 4.18 — tigers, and the wrong bars
{
  F.tigers = across(captioned('4.12'));
  const b = barGraph('4.18', { across: true });
  F.tigerDrawn = b.values;
  F.tigerWrong = Object.keys(F.tigers).filter(y => Math.round(b.values[y] / 100) * 100 !== F.tigers[y]);
  ok('Fig 4.18: the bars drawn wrongly', F.tigerWrong, ['2006', '2010', '2014', '2018']);
  ok('Fig 4.18 as drawn, to the nearest 100', Object.fromEntries(Object.entries(b.values).map(([k, v]) => [k, Math.round(v / 100) * 100])),
    { 2022: 3700, 2018: 2200, 2014: 3000, 2010: 1500, 2006: 800 });
}

// Table 4.13, Figs 4.19–4.22 — mountains
{
  const t = captioned('4.13').slice(1);
  F.peaks = Object.fromEntries(t.map(r => [flat(r[1]), num(r[2])]));
  const side = barGraph('4.19', { across: true });
  ok('Fig 4.19 is Table 4.13', side.values, F.peaks);
  const up = barGraph('4.20');
  ok('Fig 4.20 is Table 4.13', Object.values(up.values), Object.values(F.peaks));
  // Fig 4.21: triangles, read at their apex, on the same axis as Fig 4.20
  const tri = barGraph('4.21', {});
  const polys = shapes(tri.g.svg).filter(s => s.tag === 'polygon' && /^dg-fill-/.test(s.cls));
  const apex = polys.map(s => tri.read(Math.min(...s.pts.map(q => q[1]))));
  ok('Fig 4.21: each triangle reaches its mountain’s height', apex.map(Math.round), Object.values(F.peaks));
  is('Fig 4.21: the taller triangles are also wider, as the caption says', polys.every((s, i) => i === 0 || s.w < polys[i - 1].w));
  is('Fig 4.21: every triangle has its own fill, and its name under it', new Set(polys.map(s => s.cls)).size === polys.length);
  // Fig 4.22: the range, read at each name
  const g = figure('4.22');
  const d = g.svg.match(/class="dg-line" d="([^"]*)"/)[1];
  const pts = [...d.matchAll(/[ML]([\d.]+) ([\d.]+)/g)].map(m => [+m[1], +m[2]]);
  const ground = pts[0][1];
  const at = (x) => ground - pts.find(p => p[0] === x)[1];
  const nameX = Object.fromEntries(texts(g.svg).filter(t => t.cls === 'dg-note').map(t => [t.t, t.x]));
  const heightLabels = texts(g.svg).filter(t => t.cls === 'dg-tick').map(t => nums(t.t)[0]);
  ok('Fig 4.22: the heights printed under the range', heightLabels, Object.values(F.peaks));
  const drawn = at(nameX.Everest) / at(nameX.Elbrus);
  F.range = { drawn: r2(drawn), real: r2(F.peaks.Everest / F.peaks.Elbrus) };
  show('Fig 4.22', JSON.stringify(F.range));
  is(`Fig 4.22: Everest is drawn "about twice as tall as Elbrus" (${F.range.drawn})`, drawn > 1.8 && drawn < 2.2);
  is('Fig 4.22: the order of the drawn peaks matches the order of the heights',
    Object.keys(F.peaks).map(k => at(nameX[k === 'Vinson Massif' ? 'Vinson' : k])).every((h, i, a) => i === 0 || h < a[i - 1]));
  is('Everest is not twice as tall as Elbrus', F.peaks.Everest < 2 * F.peaks.Elbrus);
  is('p023 asks for 5642 × 2', HTML['p023.html'].includes(`$${F.peaks.Elbrus} \\times 2$`));
}

/* ---- B. the chapter's worked answers --------------------------- */

// Example 1, read against Fig. 4.3
{
  const ex = BODY.slice(BODY.indexOf('Example 1</div>'), BODY.indexOf('<h3>Drawing a pictograph'));
  const ans = flat(ex.match(/work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span>/)[1]);
  ok('Example 1 Answer', nums(ans), [1, F.sleep.Always, 2, F.sleep.Sometimes, 3, F.sleep.Never]);
  is('Example 1 Step 2: 2 whole symbols and half a symbol', F.sleep.Sometimes === 2 * 10 + 5);
}

/* ---- B. Beyond the Book --------------------------------------- */

const stage1 = flat(HTML['p101.html'] + HTML['p102.html']);
is('Stage 1: 17 is 3 groups and 2 marks', stage1.includes('there are 3 groups and 2 marks left over') && Math.floor(17 / 5) === 3 && 17 % 5 === 2);
ok('Stage 1: a key of 8 with halves shows', nums(stage1.match(/can show ([\d, ]+), and so on/)[1]), [1, 2, 3, 4, 5, 6, 7].map(k => 4 * k));
is('Stage 1: 27 is not a multiple of 4', 27 % 4 !== 0);
is('Stage 1: 35 students are 3 and a half symbols of 10', 35 / 10 === 3.5 && stage1.includes('3 and a half symbols'));
{
  const pen = [120, 260, 340, 90];
  is('Stage 1: 340 ÷ 10 is taller than 20 squares', 340 / 10 > 20);
  ok('Stage 1: bars with 1 square for 20 pencils', pen.map(p => p / 20), [6, 13, 17, 4.5]);
  is('Stage 1 prints them', stage1.includes('the bars are 6, 13 and 17 squares tall, and the bar for Thursday is 4 and a half squares'));
  ok('Stage 1: kites above 50', [60 - 50, 70 - 50, (70 - 50) / (60 - 50), 70 - 60], [10, 20, 2, 10]);
  ok('Stage 1: goals', [3 + 5 + 4 + 2, 0 * 3 + 1 * 5 + 2 * 4 + 3 * 2], [14, 19]);
  // removed 16 Sep 2026 by the user's decision: nothing in Beyond may answer a body question
  is('Stage 1 no longer names Mayank, Bumrah, Jarina or Sangita', !/Mayank|Bumrah|Jarina|Sangita/.test(stage1));
  is('Stage 1 prints 3 goals in 2 matches as 6', stage1.includes('3 goals in 2 matches') && 3 * 2 === 6);
}

function example(n) {
  const at = BEYOND.indexOf(`c-example__tab">Example ${n}</div>`);
  if (at < 0) throw new Error(`Beyond Example ${n} is missing`);
  const nx = BEYOND.indexOf('c-example__tab">Example ', at + 20);
  const end = nx < 0 ? BEYOND.indexOf('c-practice', at) : nx;
  const html = BEYOND.slice(at, end);
  const q = html.slice(html.indexOf('c-example__body">'), html.indexOf('<strong>Solution.'));
  const answer = flat((html.match(/work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span>/) || [, ''])[1]);
  const opts = ((q.match(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*?)<\/ol>/) || [])[1] || '');
  return { html, q, qt: flat(q), answer, opts: [...opts.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => flat(m[1])) };
}
const LET = ['a', 'b', 'c', 'd'];
function oneRight(what, opts, right, printed) {
  const r = opts.map((o, i) => right(o, i) ? LET[i] : null).filter(Boolean);
  if (opts.length !== 4) fails.push(`${what}: ${opts.length} options`);
  else if (r.length !== 1) fails.push(`${what}: ${r.length} right options (${r.join(', ') || 'none'}) among ${JSON.stringify(opts)}`);
  else if (r[0] !== printed) fails.push(`${what}: the right option is (${r[0]}), the page prints (${printed})`);
  else pass++;
}
const letterOf = (s) => (s.match(/^\(([a-d])\)/) || [])[1];
const partOf = (s, l) => { const m = s.match(new RegExp(`\\(${l}\\)(.*?)(?=\\([a-e]\\)|$)`)); return m ? m[1] : null; };
function partNums(what, s, l, want) {
  const p = partOf(s, l);
  if (p === null) { fails.push(`${what}: no part (${l})`); return; }
  ok(`${what} (${l})`, nums(p), want);
}

// Beyond Example 1 — Arun's fruit
{
  const e = example(1);
  const list = e.qt.match(/they said: ([a-z, ]+)\./)[1].split(', ');
  ok('Beyond Ex 1: the list has 20 answers, as the question says', list.length, 20);
  const count = {};
  for (const x of list) count[x] = (count[x] || 0) + 1;
  const rows = parseTable(e.html.slice(e.html.indexOf('<table'))).slice(1);
  for (const r of rows) {
    const k = flat(r[0]).toLowerCase();
    ok(`Beyond Ex 1 ${k}: tally strokes`, tallyCell(r[1], `Beyond Ex 1 ${k}`), count[k]);
    ok(`Beyond Ex 1 ${k}: frequency`, num(r[2]), count[k]);
  }
  ok('Beyond Ex 1 covers every fruit', rows.length, Object.keys(count).length);
  const top = Object.entries(count).sort((a, b) => b[1] - a[1]);
  is('Beyond Ex 1 Answer names the most liked fruit', e.answer.toLowerCase().startsWith(top[0][0]) && top[0][1] > top[1][1]);
  ok('Beyond Ex 1 Answer', nums(e.answer), [top[0][1]]);
  ok('Beyond Ex 1 Step 3', nums(flat(e.html.match(/Step 3<\/span>\s*<span>([\s\S]*?)<\/span>/)[1])), [...rows.map(r => count[flat(r[0]).toLowerCase()]), 20]);
}

// Beyond Example 2 — the quiz
{
  const e = example(2);
  const t = parseTable(e.html.slice(e.html.indexOf('<table')));
  const right = t[0].slice(1).map(num), students = t[1].slice(1).map(num);
  const total = sum(students), atLeast3 = sum(students.filter((_, i) => right[i] >= 3));
  const mode = right[students.indexOf(Math.max(...students))];
  is('Beyond Ex 2 has one most common value', students.filter(s => s === Math.max(...students)).length === 1);
  partNums('Beyond Ex 2 Answer', e.answer, 'a', [total]);
  partNums('Beyond Ex 2 Answer', e.answer, 'b', [atLeast3]);
  partNums('Beyond Ex 2 Answer', e.answer, 'c', [mode]);
}

// Beyond Example 3 — Fig. 4.23
{
  const p = pictograph('4.23', byClass('dg-fill-d'));
  const v = p.values;
  const e = example(3);
  partNums('Beyond Ex 3 Answer', e.answer, 'a', [v.Tuesday]);
  partNums('Beyond Ex 3 Answer', e.answer, 'b', [v.Friday - v.Thursday]);
  partNums('Beyond Ex 3 Answer', e.answer, 'c', [sum(Object.values(v))]);
  const s4 = flat(e.html.match(/Step 4<\/span>\s*<span>([\s\S]*?)<\/span>/)[1]);
  ok('Beyond Ex 3 Step 4 reads the symbols', nums(s4), [...Object.values(p.symbols), sum(Object.values(p.symbols))]);
  const s5 = flat(e.html.match(/Step 5<\/span>\s*<span>([\s\S]*?)<\/span>/)[1]);
  ok('Beyond Ex 3 Step 5 multiplies by the key', nums(s5), [sum(Object.values(p.symbols)), p.key, sum(Object.values(v))]);
  ok('Beyond Ex 3 Step 3 reads Friday and Thursday', nums(flat(e.html.match(/Step 3<\/span>\s*<span>([\s\S]*?)<\/span>/)[1])),
    [p.symbols.Friday, p.key, v.Friday, v.Thursday - p.key / 2, p.key / 2, v.Thursday, v.Friday, v.Thursday, v.Friday - v.Thursday]);
  is('Fig 4.23 key text', p.key === 20 && e.qt.includes('Fig. 4.23'));
}

// Beyond Example 4 — two keys
{
  const e = example(4);
  const [k1, r1, k2, r2_] = nums(e.qt);
  const ravi = k1 * r1, sara = k2 * r2_;
  const test = [sara > ravi, ravi - sara === 5, ravi === sara, sara - ravi === 3];
  ok('Beyond Ex 4 option wording', e.opts, ['Sara has more, as her row is longer.', 'Ravi has 5 more than Sara.', 'Both have the same number.', 'Ravi has 3 fewer than Sara.']);
  oneRight('Beyond Ex 4', e.opts, (_, i) => test[i], letterOf(e.answer));
}

// Beyond Example 5 — choosing a key; Fig. 4.24
{
  const e = example(5);
  const milk = nums(e.qt.match(/sold ([\d, and]+) litres/)[1]);
  const fits = (k) => milk.every(v => (2 * v) % k === 0 && v / k <= 5);
  oneRight('Beyond Ex 5', e.opts, (o) => fits(nums(o)[1]), letterOf(e.answer));
  const key = nums(e.opts[LET.indexOf(letterOf(e.answer))])[1];
  const p = pictograph('4.24', (s) => s.cls === 'dg-fill-b-soft' ? (near(s.w, 10, 0.1) ? 1 : near(s.w, 5, 0.1) ? 0.5 : NaN) : 0);
  ok('Fig 4.24 key is the key Beyond Ex 5 chose', p.key, key);
  ok('Fig 4.24 is the milk sold', Object.values(p.values), milk);
  ok('Fig 4.24 against its aria-label', Object.values(p.symbols), nums(p.g.aria).slice(1));
  is('Beyond Ex 5: 20 is not half of 25', 120 % 25 === 20 && 20 !== 25 / 2);
}

// Beyond Example 6 — the key from a row
{
  const e = example(6);
  const [sym, cars, tue] = nums(e.qt);
  const key = cars / sym;
  ok('Beyond Ex 6 Answer', nums(e.answer), [key, tue / key]);
  is('Beyond Ex 6: Tuesday is whole and half symbols', (2 * tue) % key === 0);
}

// Beyond Examples 7 and 8 — Fig. 4.25
{
  const b = barGraph('4.25');
  const v = b.values;
  F.fair = v;
  ok('Fig 4.25 against its aria-label', Object.values(v), nums(b.g.aria));
  const e = example(7);
  const most = Object.entries(v).sort((a, c) => c[1] - a[1])[0];
  is('Beyond Ex 7 (a) names the day with the most visitors', partOf(e.answer, 'a').includes('Friday') && most[0] === 'Fri');
  partNums('Beyond Ex 7 Answer', e.answer, 'a', [most[1]]);
  partNums('Beyond Ex 7 Answer', e.answer, 'b', [v.Wed - v.Mon]);
  partNums('Beyond Ex 7 Answer', e.answer, 'c', [sum(Object.values(v))]);
  ok('Beyond Ex 7 Step 3 adds the units', nums(flat(e.html.match(/Step 3<\/span>\s*<span>([\s\S]*?)<\/span>/)[1])),
    [...Object.values(v).map(x => x / b.step), sum(Object.values(v)) / b.step, sum(Object.values(v)) / b.step, b.step, sum(Object.values(v))]);
  const f = example(8);
  ok('Beyond Ex 8 Step 1 reads every bar', nums(flat(f.html.match(/Step 1<\/span>\s*<span>([\s\S]*?)<\/span>/)[1])), Object.values(v));
  const test = [v.Fri === 2 * v.Tue, v.Mon + v.Tue === v.Fri, v.Thu * 2 === v.Mon, v.Wed - v.Tue === 100];
  ok('Beyond Ex 8 option wording', f.opts, ['Friday had twice as many visitors as Tuesday.', 'Monday and Tuesday together had as many visitors as Friday.', 'Thursday had half as many visitors as Monday.', 'Wednesday had 100 more visitors than Tuesday.']);
  oneRight('Beyond Ex 8', f.opts, (_, i) => test[i], letterOf(f.answer));
}

// Beyond Example 9 — the scale
{
  const e = example(9);
  const t = nums(e.qt.match(/show ([\d, and]+) tickets/)[1]);
  const max = nums(e.qt.match(/taller than (\d+) units/)[1])[0];
  oneRight('Beyond Ex 9', e.opts, (o) => { const k = nums(o)[1]; return t.every(x => x % k === 0 && x / k <= max); }, letterOf(e.answer));
}

// Beyond Example 10 — bottles; Fig. 4.26
{
  const e = example(10);
  const data = Object.fromEntries([...e.qt.matchAll(/Class (\w+) (\d+)/g)].map(m => [m[1], +m[2]]));
  const b = barGraph('4.26');
  ok('Fig 4.26 is the data of Beyond Ex 10', b.values, data);
  const scale = nums(flat(e.html.match(/Step 1<\/span>\s*<span>([\s\S]*?)<\/span>/)[1]));
  ok('Beyond Ex 10: the largest value and the scale', scale, [Math.max(...Object.values(data)), 1, b.step]);
  is('Beyond Ex 10 Answer is Fig. 4.26', e.answer === 'Fig. 4.26');
  ok('Beyond Ex 10 Step 3 marks', nums(flat(e.html.match(/Step 3<\/span>\s*<span>([\s\S]*?)<\/span>/)[1])), [0, 10, 20, 30, 40, 50]);
  ok('Fig 4.26 ticks', b.ticks.map(t => t.v), [0, 10, 20, 30, 40, 50]);
}

// Beyond Example 11 — Fig. 4.27, the unequal scale
{
  const b = barGraph('4.27', { linear: false });
  is('Fig 4.27 is NOT on a straight scale, which is its point', !b.onLine);
  const px = b.ticks.map(t => t.p);
  is('Fig 4.27: its steps are drawn equal', px.slice(1).every((p, i) => near(px[i] - p, px[0] - px[1], 0.01)));
  const stepsFor = b.ticks.slice(1).map((t, i) => t.v - b.ticks[i].v);
  ok('Fig 4.27 values', b.values, { 'Team A': 20, 'Team B': 50, 'Team C': 100 });
  const e = example(11);
  const stepsTall = (v) => b.ticks.findIndex(t => t.v === v);
  partNums('Beyond Ex 11 Answer', e.answer, 'a', [b.values['Team C'] / b.values['Team A']]);
  partNums('Beyond Ex 11 Answer', e.answer, 'b', [stepsTall(b.values['Team C']) / stepsTall(b.values['Team A'])]);
  ok('Beyond Ex 11 Step 3: what the steps stand for', nums(flat(e.html.match(/Step 3<\/span>\s*<span>([\s\S]*?)<\/span>/)[1])), stepsFor);
  ok('Beyond Ex 11 Step 2: steps', nums(flat(e.html.match(/Step 2<\/span>\s*<span>([\s\S]*?)<\/span>/)[1])),
    [stepsTall(20), stepsTall(100), stepsTall(100), stepsTall(20), stepsTall(100) / stepsTall(20)]);
}

// Beyond Example 12 — the wide bar
{
  const e = example(12);
  const [, unit, aT, aW, bT, bW] = nums(e.qt);  // "1 unit of length for 10 runs …" 
  const arjun = aT * unit, bilal = bT * unit;
  const test = [bilal - arjun === 10, arjun > bilal, arjun === 40 && bilal === 40, arjun === 2 * bilal];
  ok('Beyond Ex 12 option wording', e.opts, ['Bilal scored 10 more runs.', 'Arjun scored more; his bar is bigger.', 'Both scored 40 runs.', 'Arjun scored twice as many.']);
  oneRight('Beyond Ex 12', e.opts, (_, i) => test[i], letterOf(e.answer));
  ok('Beyond Ex 12 Step 4', nums(flat(e.html.match(/Step 4<\/span>\s*<span>([\s\S]*?)<\/span>/)[1])), [aT, aW, aT * aW, bT * bW]);
  is('Beyond Ex 12: the bigger bar has the smaller score', aT * aW > bT * bW && arjun < bilal);
}

ok('Beyond has twelve examples, numbered from 1', [...BEYOND.matchAll(/c-example__tab">Example (\d+)</g)].map(m => +m[1]), [...Array(12).keys()].map(i => i + 1));
ok('the body has Examples 1 to 3', [...BODY.matchAll(/c-example__tab">Example (\d+)</g)].map(m => +m[1]), [1, 2, 3]);

/* ---- B. figures and tables: numbering and placement ------------ */

{
  const figs = [...(BODY + BEYOND).matchAll(/class="fignum">Fig\. 4\.(\d+)</g)].map(m => +m[1]);
  ok('figures are numbered 4.1 to 4.27, once each, in order', figs, [...Array(27).keys()].map(i => i + 1));
  const tabs = [...BODY.matchAll(/<caption>Table 4\.(\d+) /g)].map(m => +m[1]);
  ok('tables are numbered 4.1 to 4.13, in order', tabs, [...Array(13).keys()].map(i => i + 1));
  is('Beyond prints no numbered table', !/<caption>/.test(BEYOND));
  // every question that names a figure or table prints on its page, or facing it
  const where = {};
  for (const f of files) {
    for (const m of HTML[f].matchAll(/class="fignum">(Fig\. 4\.\d+)</g)) where[m[1]] = f;
    for (const m of HTML[f].matchAll(/<caption>(Table 4\.\d+) /g)) where[m[1]] = f;
  }
  const facing = (a, b) => a === b || (Math.min(a, b) % 2 === 0 && Math.abs(a - b) === 1);
  let asked = 0;
  for (const f of files) {
    const h = HTML[f];
    const blocks = [
      ...[...h.matchAll(/<ol class="c-questions"[^>]*>([\s\S]*?)<\/ol>\s*<\/div>/g)].map(m => m[1]),
      ...[...h.matchAll(/<div class="c-reflect__body">([\s\S]*?)<\/div>/g)].map(m => m[1]),
      ...[...h.matchAll(/<div class="c-try">([\s\S]*?)<\/div>/g)].map(m => m[1]),
      ...[...h.matchAll(/c-example__body">([\s\S]*?)<strong>Solution/g)].map(m => m[1]),
    ];
    for (const b of blocks) for (const m of flat(b).matchAll(/(Fig\. 4\.\d+|Table 4\.\d+)/g)) {
      asked++;
      if (!where[m[1]]) fails.push(`${f} names ${m[1]}, which is on no page`);
      else is(`${f} (folio ${folio[f]}) names ${m[1]}, printed on folio ${folio[where[m[1]]]}: same page or facing`, facing(folio[f], folio[where[m[1]]]));
    }
  }
  show('questions naming a figure or table', asked);
}

/* ---- B. the practice answers ----------------------------------- */

const ROWS = {}, NOTES = {};
{
  const [answers, notes] = BEYOND.split('Why the other options are wrong');
  for (const m of answers.matchAll(/work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) ROWS[m[1]] = flat(m[2]);
  for (const m of (notes || '').matchAll(/work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) NOTES[m[1]] = flat(m[2]);
}
const row = (q) => { if (!(q in ROWS)) { fails.push(`no answer row for question ${q}`); return ''; } return ROWS[q]; };
const rowNums = (what, q, want) => ok(`${what} (Q${q})`, nums(row(q)), want);
const rowPart = (what, q, l, want) => partNums(`${what} (Q${q})`, row(q), l, want);
ok('answer rows are printed for questions 17 to 30', Object.keys(ROWS).map(Number), [...Array(14).keys()].map(i => i + 17));

const questionText = (n) => {
  const at = +n === 1 ? BEYOND.indexOf('<ol class="c-questions">') : BEYOND.indexOf(`<ol class="c-questions" data-start="${n}">`);
  if (at < 0) throw new Error(`question ${n} is not on any page`);
  return BEYOND.slice(at).match(/<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/)[1];
};
const QT = (n) => flat(questionText(n));

{
  // 17
  const [k, s] = nums(QT(17));  // "One symbol stands for 50 trees ... 3 and a half symbols" 
  rowNums('trees', 17, [Math.floor(s), k, Math.floor(s) * k, k, k / 2, s * k]);
  // 18
  const [, u, c] = nums(QT(18));  // "1 unit of length stands for 25 cars ... 225 cars" 
  rowNums('bar height', 18, [c, u, c / u]);
  // 19
  const d = nums(QT(19).match(/data ([\d, ]+) in/)[1]);
  const sorted = [...d].sort((a, b) => a - b);
  const counts = sorted.map(x => d.filter(y => y === x).length);
  const mode = sorted[counts.indexOf(Math.max(...counts))];
  rowNums('ordered, and the value seen most', 19, [...sorted, mode, Math.max(...counts)]);
  // 20
  const g = nums(QT(20));
  rowNums('hockey', 20, [...g, g[0] - g[1] - g[2] - g[3]]);
  // 21
  is('Q21 says only the height shows the number', /height or length of a bar shows its number/.test(row(21)));
  // 22
  const homes = nums(QT(22).match(/is ([\d, ]+)\./)[1]);
  ok('Q22 lists 20 homes', homes.length, 20);
  const vals22 = [...new Set(homes)].sort((a, b) => a - b);
  const freq22 = vals22.map(v => homes.filter(h => h === v).length);
  const over4 = freq22.filter((_, i) => vals22[i] > 4);
  rowNums('homes', 22, [...vals22.flatMap((v, i) => [v, freq22[i]]), ...over4, sum(over4)]);
  // 23
  const k23 = nums(QT(23))[0];
  const [c6, c7, c8] = nums(QT(23).split(' have ')[1]);
  const b23 = [c6, c7, c8].map(s => s * k23);
  rowNums('books', 23, [...b23, sum(b23), b23[2], b23[1], b23[2] - b23[1]]);
  // 24
  const [, k24, ...bars24] = nums(QT(24));
  const p24 = bars24.map(b => b * k24);
  rowNums('villages', 24, [...p24, ...p24, sum(p24)]);
  // 25
  const [kg, ka, kb] = nums(QT(25));
  rowNums('rice', 25, [kg, ka, kg / ka, kg, kb, kg / kb, Math.min(kg / ka, kg / kb)]);
  // 26
  const [start, x, y, zero, , unit] = nums(QT(26));
  rowPart('truncated scale', 26, 'a', [(y - start) / (x - start), y, start, y - start, x, start, x - start]);
  rowPart('truncated scale', 26, 'b', [y - x]);
  rowPart('truncated scale', 26, 'c', [x / unit, y / unit]);
  is('Q26 (c) starts at 0 with 1 unit for 50', zero === 0 && unit === 50);
  // 27
  const t27 = across(tableAfter(BEYOND, 'plates of idli'));
  const v27 = Object.values(t27);
  const most = Object.entries(t27).sort((a, b) => b[1] - a[1]);
  rowPart('idli', 27, 'a', [1, 5, ...v27.map(v => v / 5)]);
  is('Q27 (b) names Friday and Wednesday', /most on Friday, fewest on Wednesday/.test(row(27)) && most[0][0] === 'Fri' && most[most.length - 1][0] === 'Wed');
  rowPart('idli', 27, 'c', [t27.Fri, t27.Wed, t27.Fri - t27.Wed]);
  rowPart('idli', 27, 'd', [sum(v27)]);
  // 28
  const c28 = nums(QT(28).match(/mended ([\d, and]+) cycles/)[1]);
  const bad20 = c28.filter(c => (2 * c) % 20 !== 0);
  ok('Q28 (a): the weeks a key of 20 cannot draw', bad20, [25, 35]);
  rowPart('cycles', 28, 'a', [bad20[0], 20, bad20[0] - 20, bad20[0] - 20, 20, bad20[1]]);
  rowPart('cycles', 28, 'b', c28.map(c => c / 10));
  rowPart('cycles', 28, 'c', [...c28, sum(c28)]);
  const twice = c28.findIndex(c => c === 2 * c28[1]);
  rowPart('cycles', 28, 'd', [twice + 1, 2, c28[1], c28[twice]]);
  ok('Q28 (d) has one answer', c28.filter(c => c === 2 * c28[1]).length, 1);
  // 29
  const w = across(tableAfter(BEYOND, 'weather chart'));
  const days = nums(QT(29).match(/for the (\d+) days/)[0])[0];
  ok('Q29: the table covers the days of June', sum(Object.values(w)), days);
  rowPart('weather', 29, 'a', [...Object.values(w), days]);
  rowPart('weather', 29, 'b', Object.values(w).map(v => v / 2));
  rowPart('weather', 29, 'c', [w.Sunny, w.Cloudy, w.Sunny - w.Cloudy]);
  rowPart('weather', 29, 'd', [w.Sunny, w.Cloudy, days - w.Rainy]);
  // 30
  const s30 = across(tableAfter(BEYOND, 'books it sold'));
  const k30 = nums(QT(30).match(/1 unit of length for (\d+) books/)[1])[0];
  rowPart('bookshop', 30, 'a', Object.values(s30).map(v => v / k30));
  rowPart('bookshop', 30, 'b', [...Object.values(s30), sum(Object.values(s30))]);
  const dbl = Object.keys(s30).filter(k => s30[k] === 2 * s30.Thu);
  ok('Q30 (c): the one day with twice Thursday', dbl, ['Mon']);
  rowPart('bookshop', 30, 'c', [2, s30.Thu, s30.Mon]);
  is('Q30 (c) names Monday', /\(c\) Monday/.test(row(30)));
  F.practice = { t27, c28, w, s30, homes };
}

/* ---- C. one right option, and the key says so ------------------ */

const KEY = {};
for (const m of BEYOND.matchAll(/<span class="n">(\d+)<\/span>\s*\(([a-d])\)/g)) KEY[m[1]] = m[2];
const options = (n) => {
  const o = questionText(n).match(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*?)<\/ol>/)[1];
  return [...o.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => flat(m[1]));
};
const val = (s) => { const n = nums(s); return n.length ? n[0] : null; };
{
  const q1 = questionText(1);
  const tally = tallyCell(q1.match(/<svg[\s\S]*?<\/svg>/)[0], 'Q1');
  const [k3, b3] = nums(QT(3));
  const [, u4, h4] = nums(QT(4));
  const [, u5, t5] = nums(QT(5));
  const pets = nums(QT(8)).slice(0, 8); // 0 pets in 8, 1 in 10, 2 in 5, 3 in 2
  const withPet = sum(pets.filter((_, i) => i % 2 === 1).filter((_, i) => i > 0));
  const d10 = nums(QT(10).match(/show ([\d, and]+),/)[1]);
  const [k11a, r11a, k11b, r11b] = nums(QT(11));
  const hina = k11a * r11a, tara = k11b * r11b;
  const [, u12, t12] = nums(QT(12));
  const MCQ = {
    1: (o) => val(o) === tally,
    2: (o) => o === 'frequency',
    3: (o) => val(o) === b3 / k3,
    4: (o) => val(o) === h4 * u4,
    5: (o) => val(o) === t5 / u5,
    6: (o) => o === '0',
    7: (o) => o === '(i) and (iii)',   // (i) and (iii) are true; (ii) contradicts "equal gaps" (p011)
    8: (o) => val(o) === withPet,
    9: (o) => o === 'a scale from 0 in equal steps',
    10: (o) => d10.every(x => x % nums(o)[1] === 0),
    11: (o, i) => [hina > tara, tara - hina === 2, hina === tara, hina - tara === 10][i],
    12: (o) => val(o) === t12 * u12,
  };
  for (const [n, right] of Object.entries(MCQ)) oneRight(`Q${n}`, options(n), right, KEY[n]);
  ok('Q8 reads 0, 1, 2, 3 pets in 8, 10, 5, 2 homes', pets, [0, 8, 1, 10, 2, 5, 3, 2]);
  ok('Q11 options', options(11), ['Hina has more stickers.', 'Tara has 2 more stickers.', 'Both have the same number.', 'Hina has 10 more stickers.']);
  is('p011 says the gaps are equal, which makes Q7 (ii) false', flat(HTML['p011.html']).includes('leave equal gaps between the bars'));
  is('Q7 lists the three statements it is keyed on', /A pictograph needs a key\. The gaps between the bars of a bar graph may be of different widths\. A frequency table can be made using tally marks\./.test(QT(7)));
}

/* An assertion-reason question is graded on three facts: is A true, is R
   true, and does R explain A. The first two are computed; the third is the
   judgement the question tests, and is stated — and each is tied to the
   words printed under its number. */
{
  const AR = {
    13: { A: 10 / 2 === 5, R: 10 / 2 === 5, explains: true,
      text: ['If one symbol stands for 10 people, half a symbol stands for 5 people.', 'Half of 10 is 5.'] },
    14: { A: 0 / 10 === 0, R: true, explains: false,
      text: ['In a bar graph with 1 unit for 10 runs, a score of 0 runs has no bar.', 'All the bars in a bar graph have the same width.'] },
    15: { A: 6 * 20 === 120, R: false /* height = value ÷ scale: 120 ÷ 20 = 6, not 120 × 20 */, explains: false,
      text: ['On a scale of 1 unit for 20, a bar 6 units tall stands for 120.', 'To find the height of a bar, multiply its value by the scale.'] },
    16: { A: tallyCount('<path d="M2 2 V18 M6.5 2 V18 M11 2 V18 M15.5 2 V18"/><path d="M0 15 L17.5 5"/>') === 5 && false /* five marks are four and a slash, not five uprights */,
      R: true, explains: false,
      text: ['The tally marks for 5 are five separate lines, side by side.', 'In tally marks, the fifth mark is drawn across the first four.'] },
  };
  is('Q15: the height really is value ÷ scale', 120 / 20 === 6 && 120 * 20 !== 6);
  is('p003 draws the fifth tally mark across the first four', flat(HTML['p003.html']).includes('draws it across the first four'));
  const printed = {};
  for (const m of BEYOND.matchAll(/data-start="(\d+)">\s*<li><p>Assertion \(A\): ([^<]*)<\/p><p>Reason \(R\): ([^<]*)<\/p>/g)) printed[m[1]] = [m[2], m[3]];
  for (const [n, q] of Object.entries(AR)) {
    ok(`Q${n} printed assertion and reason`, printed[n], q.text);
    const want = q.A && q.R ? (q.explains ? 'a' : 'b') : q.A ? 'c' : q.R ? 'd' : '?';
    ok(`Q${n} assertion-reason key`, KEY[n], want);
  }
  is('the assertion-reason note names Questions 13 to 16', /In Questions 13 to 16, choose \(a\) if both A and R are true and R explains A; \(b\) if both are true but R does not explain A; \(c\) if A is true but R is false; \(d\) if A is false but R is true\./.test(flat(BEYOND)));
}
ok('the key has 16 letters', Object.keys(KEY).map(Number), [...Array(16).keys()].map(i => i + 1));
{
  const spread = LET.map(l => Object.values(KEY).filter(x => x === l).length);
  is(`the key uses all four letters (${spread.join(' ')})`, spread.every(c => c > 0));
  const mcq = LET.map(l => Object.entries(KEY).filter(([n, x]) => +n <= 12 && x === l).length);
  ok('the multiple-choice key is spread evenly', mcq, [3, 3, 3, 3]);
  const starts = [...BEYOND.matchAll(/data-start="(\d+)"/g)].map(m => +m[1]);
  ok('practice numbered 2..30 after the first', starts, [...Array(29).keys()].map(i => i + 2));
  const subs = [...BEYOND.matchAll(/c-practice__sub">([^<]*)</g)].map(m => m[1]);
  ok('six forms, in order', subs, ['Choose the correct option', 'Assertion and reason', 'Very short answer', 'Short answer', 'Long answer', 'Case-based questions']);
  ok('the six forms start at', ['Choose the correct option', 'Assertion and reason', 'Very short answer', 'Short answer', 'Long answer', 'Case-based questions']
    .map(s => { const at = BEYOND.indexOf(`c-practice__sub">${s}<`); const m = BEYOND.slice(at).match(/c-questions"(?: data-start="(\d+)")?/); return m[1] ? +m[1] : 1; }), [1, 13, 17, 22, 27, 29]);
}

// the "why the other options are wrong" notes
{
  const [k3, b3] = nums(QT(3));
  ok('note 3', nums(NOTES[3] || ''), [b3, Math.floor(b3 / k3), k3, b3 % k3, b3 % k3, k3, b3 % k3]);
  is('note 3: (d) is 4 and a half', /: \(d\)/.test(NOTES[3]) && KEY[3] === 'd');
  ok('note 8', nums(NOTES[8] || ''), [10, 5, 2, 17, 8, 1, 2, 3]);
  ok('note 11', nums(NOTES[11] || ''), [6, 5, 30, 4, 8, 32]);
  ok('note 15', nums(NOTES[15] || ''), [6, 20, 120, 120, 20, 6]);
  ok('notes are given for', Object.keys(NOTES).map(Number), [3, 8, 11, 15]);
}

/* ---- D. ANSWERS.md ---------------------------------------------- */

const ANSWERS = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const ws = (x) => x.replace(/\s+/g, ' ');
function inAnswers(what, needle) {
  if (ws(ANSWERS).includes(ws(needle))) pass++;
  else fails.push(`${what} — ANSWERS.md does not contain "${needle}"`);
}
const ra = sweep(ANSWERS, 'ANSWERS.md');
const answerIdentities = ra.n;
skippedSpans.push(...ra.skipped);
{
  const A = F;
  const [topGame, topN] = A.games.most;
  inAnswers('4.1 Q2', `**${topGame}**, chosen by **${topN}** students`);
  inAnswers('4.1 Q2 counts', `hockey ${A.games.count.Hockey}, kabaddi ${A.games.count.Kabaddi}, cricket ${A.games.count.Cricket}, satoliya (pittu) ${A.games.count['Satoliya (Pittu)']}, football ${A.games.count.Football} and`);
  inAnswers('4.1 Q2 badminton', `badminton ${A.games.count.Badminton}.`);
  inAnswers('4.1 Q3', `**${A.games.total}** students`);
  inAnswers('4.1 Q3 fewest', `**${A.games.fewest[0].toLowerCase()}**, ${A.games.fewest[1]} students`);
  const s = A.sweets;
  inAnswers('4.2 Q1 blanks', `gujiya **${s.Gujiya}**, barfi **${s.Barfi}** and rasgulla\n   **${s.Rasgulla}**`);
  inAnswers('4.2 Q1 parts', `(i) **${s.Jalebi}** (ii) **${s.Barfi}** (iii) **${s.Gujiya}** (iv) **${s.Rasgulla}** (v) **${s['Gulab jamun']}**`);
  inAnswers('4.2 Q3', `**${sum(Object.values(s))}** children`);
  const sh = A.shoes;
  inAnswers('4.3 frequencies', `three 3s, nine 4s, ten 5s, four 6s and one 7, ${sh.n}`);
  ok('4.3 frequencies computed', sh.freq, [3, 9, 10, 4, 1]);
  inAnswers('4.3 Q1', `(i) **${sh.max}** (ii) **${sh.min}** (iii) **${sh.five}** (iv) **${sh.over4}**`);
  const tr = A.travel;
  const most = Object.entries(tr).sort((a, b) => b[1] - a[1]);
  inAnswers('T&R Fig 4.2 most', `**${most[0][0]}**, ${most[0][1]} students`);
  inAnswers('T&R Fig 4.2 fewest', `**${most[most.length - 1][0]}**, ${most[most.length - 1][1]} students`);
  inAnswers('T&R one symbol each', `Class II would need ${A.present.II} symbols`);
  inAnswers('4.4 Q1 read', `From Fig. 4.7: ${Object.entries(A.books).map(([k, v]) => `${k} ${v}`).join(', ')}`.replace(/, Saturday/, ',\n   Saturday'));
  const bk = Object.entries(A.books).sort((a, b) => a[1] - b[1]);
  inAnswers('4.4 Q1 (i)', `(i) **${bk[0][0]}**`);
  inAnswers('4.4 Q1 (ii)', `**${sum(Object.values(A.books))}** books`);
  inAnswers('4.4 Q1 (iii)', `(iii) **${bk[bk.length - 1][0]}**, ${bk[bk.length - 1][1]} books`);
  const kt = A.kites;
  const words = (x) => x % 100 ? `${Math.floor(x / 100)} and a half` : `${x / 100}`;
  inAnswers('4.4 Q2 drawing', `Chaman ${words(kt.Chaman)} symbols, Rani ${words(kt.Rani)},\n   Rukhsana ${words(kt.Rukhsana)}, Jasmeet ${words(kt.Jasmeet)}, Jetha Lal ${words(kt['Jetha Lal'])}, Poonam Ben ${words(kt['Poonam Ben'])}.`);
  const kmax = Object.entries(kt).sort((a, b) => b[1] - a[1])[0];
  inAnswers('4.4 Q2 parts', `(i) **${kt.Rani / 100}** (ii) **${kmax[0]}**, ${kmax[1]} kites (iii) **${kt.Jasmeet > kt.Chaman ? 'Jasmeet' : 'Chaman'}**`);
  is('4.4 Q2 (iv) Poonam Ben bought more than double Rani', kt['Poonam Ben'] > 2 * kt.Rani);
  const ab = A.absent;
  const abMax = Object.entries(ab).sort((a, b) => b[1] - a[1])[0];
  inAnswers('T&R Fig 4.8', `1. **${ab.II}** students. 2. **Class ${abMax[0]}**, ${abMax[1]} students. 3. **Class ${Object.keys(ab).find(k => ab[k] === 0)}**`);
  inAnswers('T&R Fig 4.9', `would be **${A.traffic['7–8']}** units long, instead of ${A.traffic['7–8'] / 100}`);
  inAnswers('4.5 read', `Read from Fig. 4.9: ${Object.values(A.traffic).slice(0, -1).join(', ')} and ${A.traffic['11–12']} vehicles`);
  inAnswers('4.5 Q1', `**${sum(Object.values(A.traffic))}** vehicles`);
  inAnswers('4.5 Q2', `**${A.traffic['9–10'] - A.traffic['10–11']}** more`);
  inAnswers('4.5 Q3', `**${A.traffic['7–8'] - A.traffic['6–7']}** more`);
  const pop = Object.values(A.pop);
  inAnswers('T&R population', `**${pop[pop.length - 1] - pop[0]} crores**`);
  ok('T&R population, each ten years', pop.slice(1).map((p, i) => p - pop[i]), [8, 10, 14, 16, 18]);
  const sp = Object.entries(A.spend).sort((a, b) => b[1] - a[1]);
  inAnswers('T&R Fig 4.13 (1)', `**${sp[0][0].toLowerCase()}** (₹${sp[0][1]}), the second most on **${sp[1][0].toLowerCase()}**`);
  is('T&R Fig 4.13 (2): electricity is half of education', A.spend.Electricity * 2 === A.spend.Education);
  is('T&R Fig 4.13 (3): education is less than a fourth of food', A.spend.Education < A.spend.Food / 4);
  inAnswers('T&R Fig 4.13 (3)', `One-fourth of ₹${A.spend.Food} is ₹${A.spend.Food / 4}`);
  inAnswers('Imran sideways', `${Object.values(A.spend).map(v => v / 200).slice(0, -1).join(', ')} and ${A.spend['Other items'] / 200} units long`);
  inAnswers('4.6 Q1', `bars of ${Object.values(A.creatures).slice(0, 2).join(',\n   ')}, ${Object.values(A.creatures).slice(2, 4).join(', ')} and ${A.creatures.Grasshoppers} units`);
  const pj = A.pooja;
  inAnswers('4.6 Q2 (i)-(iii)', `(i) **${A.tickets.Vidisha}** (ii) **${A.tickets.Jabalpur}** (iii) **1 unit for ${pj.scale} tickets**`);
  inAnswers('4.6 Q2 (iv)', `**${pj.right.Sagar} units**`);
  inAnswers('4.6 Q2 (v)', `${[1, 2, 3, 4, 5, 6].map(i => i * pj.scale).join(', ').replace(/, (\d+)$/, ',\n   $1')} and ${7 * pj.scale} on the ${['', '', '', '', '', '', 'seven'][pj.lines - 1]} lines`);
  inAnswers('4.6 Q2 (vi)', `it is drawn ${pj.units.Indore === 4.5 ? '4 and a half' : pj.units.Indore} units tall, and should be ${pj.right.Indore} units`);
  is('4.6 Q2 (vi): Seoni is right', pj.units.Seoni === pj.right.Seoni);
  const ch = A.chinu.count;
  inAnswers('4.6 Q3', `bike **${ch.bike}**, scooter **${ch.scooter}**, auto rickshaw **${ch['auto rickshaw']}**, bicycle **${ch.bicycle}**, car\n   **${ch.car}**, bus **${ch.bus}**, bullock cart **${ch['bullock cart']}**; ${A.chinu.n} vehicles`);
  is('4.6 Q3 (ii): bike is the one most common', Object.values(ch)[0] > Object.values(ch)[1] && Object.keys(ch)[0] === 'bike');
  inAnswers('4.6 Q5 (iv)', `(iv) **${A.bumrah.four}** matches`);
  inAnswers('4.6 Q5 (v)', `= ${A.bumrah.plain}$`);
  inAnswers('4.6 Q5 (vi)', `= ${A.bumrah.total}$`);
  const tc = A.tractors;
  inAnswers('4.6 Q6 read', `A ${tc['Village A']}, B ${tc['Village B']}, C ${tc['Village C']}, D ${tc['Village D']}, E ${tc['Village E']}`);
  const tcs = Object.entries(tc).sort((a, b) => a[1] - b[1]);
  inAnswers('4.6 Q6', `(i) **${tcs[0][0]}**\n   (ii) **${tcs[tcs.length - 1][0]}** (iii) **${tc['Village C'] - tc['Village B']}** more`);
  is('4.6 Q6 (iv): D is half of E', tc['Village D'] * 2 === tc['Village E']);
  inAnswers('4.6 Q6 (v)', `(v) **${sum(Object.values(tc))}**`);
  const gl = Object.values(A.girls);
  inAnswers('4.6 Q7 read', `Classes 1 to 8 have ${gl.slice(0, 3).join(', ')},\n   ${gl.slice(3, 7).join(', ')} and ${gl[7]} girls`);
  inAnswers('4.6 Q7 (i)', `(i) **Class ${Object.keys(A.girls)[gl.indexOf(Math.min(...gl))]}** (${Math.min(...gl)} girls)`);
  inAnswers('4.6 Q7 (ii)', `(ii) **${Math.abs(A.girls['5'] - A.girls['6'])}**`);
  inAnswers('4.6 Q7 (iii)', `**${(A.girls['2'] + 2) / 4} whole symbols**`);
  inAnswers('4.6 Q7 (iv)', `(iv) **${A.girls['7']}**`);
  inAnswers('4.6 Q7 (v)', `(v) **${sum(gl)}**`);
  const dg = A.dogs;
  inAnswers('4.6 Q8 (ii)', `**${dg.B / 6}** symbols\n   with the key of 6`);
  inAnswers('4.6 Q8 (ii) key 12', `or ${dg.B / 12} with the key of 12`);
  is('4.6 Q8 (iii): Kamini is right', dg.B + dg.D > dg.A + dg.C + dg.E + dg.F);
  inAnswers('4.6 Q8 (iv)', `(iv) **${sum(Object.values(dg))}**`);
  inAnswers('4.6 Q8 drawing', `${Object.values(dg).map(v => v / 6).slice(0, -1).join(', ')} and ${dg.F / 6} symbols`);
  const fr = Object.entries(A.free);
  inAnswers('4.6 Q9 bars', `bars of ${fr.map(([, v]) => v / 5).slice(0, -1).join(', ')} and ${fr[fr.length - 1][1] / 5} units`);
  const frNoPlay = fr.filter(([k]) => k !== 'Playing').sort((a, b) => b[1] - a[1]);
  inAnswers('4.6 Q9 (i)', `(i) **${frNoPlay[0][0]}**`);
  inAnswers('4.6 Q9 (ii)', `(ii) **${frNoPlay[frNoPlay.length - 1][0]}**`);
  inAnswers('4.6 Q9 (iii)', `**${A.free.Playing - A.free.Painting}** more`);
  const sa = A.saplings;
  inAnswers('4.6 Q10 read', `From Fig. 4.17: ${Object.values(sa).join(', ')}.`);
  inAnswers('4.6 Q10 (i)', `(i) **${sa.Wednesday + sa.Thursday}**`);
  inAnswers('4.6 Q10 (ii)', `(ii) **${sum(Object.values(sa))}**`);
  const sas = Object.entries(sa).sort((a, b) => b[1] - a[1]);
  is('4.6 Q10 (iii): one most and one fewest day', sas[0][1] > sas[1][1] && sas[sas.length - 1][1] < sas[sas.length - 2][1]);
  inAnswers('4.6 Q10 (iii)', `The most on **${sas[0][0]}**, the fewest on **${sas[sas.length - 1][0]}**`);
  const tg = A.tigers, td = A.tigerDrawn;
  const r100 = (v) => Math.round(v / 100) * 100;
  inAnswers('4.6 Q11 (i)', `(2018 is drawn at ${r100(td[2018])} and 2014 at ${r100(td[2014])}), the bar for\n    **2010** is drawn at ${r100(td[2010])} instead of ${tg[2010]}, and the bar for **2006** at\n    ${r100(td[2006])} instead of ${tg[2006]}`);
  is('4.6 Q11 (i): 2018 and 2014 are swapped', r100(td[2018]) === tg[2014] && r100(td[2014]) === tg[2018]);
  inAnswers('4.6 Q11 (iii)', `(iii) **${tg[2022] - tg[2006]}**`);
  const pk = A.peaks;
  inAnswers('mountains', `**${pk.Everest - pk.Kosciuszko} m** taller`);
  inAnswers('mountains', `$${pk.Denali} - ${pk.Kilimanjaro} = ${pk.Denali - pk.Kilimanjaro}$`);
  inAnswers('T&R Everest', `$${pk.Elbrus} \\times 2 = ${pk.Elbrus * 2}$`);
  is('T&R Everest: "about one and a half times"', pk.Everest / pk.Elbrus > 1.4 && pk.Everest / pk.Elbrus < 1.7);
  inAnswers('33 and 27', '33 is 6 symbols and three-fifths');
  is('33 = 6 × 5 + 3 and 27 = 2 × 10 + 7', 33 === 6 * 5 + 3 && 27 === 2 * 10 + 7);
  // Beyond
  inAnswers('Beyond key', `1 (${KEY[1]}) · 2 (${KEY[2]}) · 3 (${KEY[3]}) · 4 (${KEY[4]}) · 5 (${KEY[5]}) · 6 (${KEY[6]}) · 7 (${KEY[7]}) · 8 (${KEY[8]}) ·\n9 (${KEY[9]}) · 10 (${KEY[10]}) · 11 (${KEY[11]}) · 12 (${KEY[12]}) · 13 (${KEY[13]}) · 14 (${KEY[14]}) · 15 (${KEY[15]}) · 16 (${KEY[16]})`);
  const P = A.practice;
  inAnswers('Beyond Q17', '17. **175** trees');
  inAnswers('Beyond Q22', `**${P.homes.filter(h => h > 4).length}** homes have more than\n    4 people`);
  inAnswers('Beyond Q23', '**260** in\n    all; Class 8 has **50** more');
  inAnswers('Beyond Q24', '**860** altogether');
  inAnswers('Beyond Q27 (d)', `(d) **${sum(Object.values(P.t27))}**`);
  const half = (x) => x % 1 ? `${Math.floor(x)} and a half` : `${x}`;
  const t27by10 = Object.values(P.t27).map(v => half(v / 10));
  inAnswers('Beyond Q27 (a) with 10', `${t27by10.slice(0, -1).join(', ')} and ${t27by10[t27by10.length - 1]} units`);
  ok('Beyond Q27 (a) with 1 unit for 10', Object.values(P.t27).map(v => v / 10), [3.5, 5, 2, 4.5, 6, 3]);
  inAnswers('Beyond Q28 (c)', `**${sum(P.c28)}**`);
  inAnswers('Beyond Q29', `(b) **${Object.values(P.w).map(v => v / 2).slice(0, -1).join(', ')} and ${P.w.Rainy / 2}**`);
  inAnswers('Beyond Q30 (a)', `(a) **${Object.values(P.s30).map(v => v / 30).slice(0, -1).join(', ')} and ${P.s30.Sat / 30}** units`);
  inAnswers('Beyond Q30 (b)', `(b) **${sum(Object.values(P.s30))}**`);
  inAnswers('Beyond names its examples', 'Beyond Examples 1 to 12');
  is('ANSWERS.md never calls a Beyond example by a body number', !/Examples? (1[3-5]|[4-9])\b/.test(ANSWERS.replace(/Beyond Examples? \d+( to \d+)?/g, '')));
}

/* ---- report ----------------------------------------------------- */

console.log('\nClass 6 · Chapter 4 · Data Handling and Presentation');
console.log(`  ${identities} arithmetic identities read off the pages and ${answerIdentities} off ANSWERS.md, evaluated`);
if (skippedSpans.length) {
  console.log(`  ${skippedSpans.length} maths span(s) with an = that is not plain arithmetic, so not evaluated:`);
  for (const s of skippedSpans) console.log(`      ${s}`);
}
console.log(`  ${pass} check(s) passed`);
if (fails.length) {
  console.log(`\n  ${fails.length} FAILED:`);
  for (const f of fails) console.log(`    ! ${f}`);
  process.exit(1);
}
console.log('  all clear\n');
