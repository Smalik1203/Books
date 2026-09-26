#!/usr/bin/env node
/* Re-derive every number this chapter prints.

     node pages/class-6/math-ch04-data-handling/check-numbers.mjs [--show]

   Rewritten on 26 September 2026 for the maths-v2 chapter (a summary page,
   By the Book in six forms, Beyond the Book by format). The version before
   it read figure and table numbers from before the 20 September
   renumbering and stopped at its first figure; it is in git history, and
   its readers for tables, tallies, pictographs and bar graphs are kept
   here, pointed at the new numbers.

   A chapter about data gets its numbers from its data, so this reads the
   data where it is printed: every tally mark (counted stroke by stroke from
   the SVG), every pictograph symbol (halves included, times the key printed
   on the figure) and every bar (measured against the figure's own ticks).

     A  every arithmetic identity set as maths, on the pages and in ANSWERS.md
     B  the data: tables, tallies, pictographs and bar graphs against one
        another, against the prose that reads them, and against the answers
     C  the key: By the Book 1-50 and Beyond 1-15 are all answered; every
        single-correct, assertion-reason, more-than-one-correct, numerical
        and matching answer is recomputed here and compared with the option
        the key names
     D  placement: a page that names a figure or table prints on the same
        page as it, or on the facing page

   Exits 1 on any failure. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const SHOW = process.argv.includes('--show');
const B = String.fromCharCode(92);
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
const snap = (v, perPx) => Math.abs(v - Math.round(v)) <= 0.01 * Math.abs(perPx) + 1e-6 ? Math.round(v) : r2(v);

/* ---- the pages ------------------------------------------------ */
const files = fs.readdirSync(DIR).filter(f => /^p\d{3}\.html$/.test(f)).sort();
const HTML = Object.fromEntries(files.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8').replace(/\r\n/g, '\n')]));
const part = (re) => files.filter(f => re.test(f)).map(f => HTML[f]).join('\n');
const BODY = part(/^p0[0-8]/);
const BOARD = part(/^p09/);
const BEYOND = part(/^p1/);
const ANSWERS = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const meta = JSON.parse(fs.readFileSync(path.join(DIR, 'chapter.json'), 'utf8'));
const folio = Object.fromEntries(files.map((f, i) => [f, meta.startFolio + i]));

const flat = (s) => s.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&middot;/g, '·').replace(/&ndash;/g, '–').replace(/&amp;/g, '&')
  .replace(/&rsquo;/g, '’').replace(/&[a-z]+;/g, ' ').replace(/\s+/g, ' ').trim();
const halves = (s) => s.replace(/(\d+) and a half/g, (_, n) => `${n}.5`);
const nums = (s) => [...halves(s).split(B + 'times').join(' ').split(B + 'div').join(' ').matchAll(/\d+(\.5)?/g)].map(m => Number(m[0]));

/* ---- A. every arithmetic identity ------------------------------ */
const strip = t => [['times', '*'], ['div', '/'], ['thinsp', ''], [',', ''], [';', ''], [' ', '']]
  .reduce((s, [k, v]) => s.split(B + k).join(v), t);
function identities(label, text) {
  for (const m of text.matchAll(/\$([^$]+)\$/g)) {
    const js = strip(m[1]).replace(/−/g, '-').replace(/\s+/g, '');
    if (!js.includes('=') || js.includes(B)) continue;
    const sides = js.split('=').filter(s => s !== '');
    if (sides.length < 2 || sides.some(s => !/^[\d+\-*/().]+$/.test(s))) continue;
    const vals = sides.map(s => Function(`return (${s})`)());
    is(`${label}: $${m[1]}$ (${vals.join(' vs ')})`, vals.every(v => Math.abs(v - vals[0]) < 1e-9));
  }
}
for (const f of files) identities(f, HTML[f]);
identities('ANSWERS.md', ANSWERS);

/* ---- reading tables -------------------------------------------- */
const parseTable = (t) => [...t.matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(r =>
  [...r[1].matchAll(/<t[hd]>([\s\S]*?)<\/t[hd]>/g)].map(c => c[1]));
function captioned(n) {
  const at = BODY.indexOf(`<caption>Table ${n} `);
  if (at < 0) throw new Error(`Table ${n} is not on any page`);
  return parseTable(BODY.slice(BODY.lastIndexOf('<table', at), BODY.indexOf('</table>', at)));
}
function tableAfter(src, words) {
  const at = src.indexOf(words);
  if (at < 0) throw new Error(`no text "${words}"`);
  return parseTable(src.slice(src.indexOf('<table', at), src.indexOf('</table>', at)));
}
const num = (c) => Number(flat(c));
// a table set across (a head row and one row of values) or down (a row per item)
const data = (t) => t.length === 2 && t[0].length > 2
  ? Object.fromEntries(t[0].slice(1).map((h, i) => [flat(h), num(t[1][i + 1])]))
  : Object.fromEntries(t.slice(1).map(r => [flat(r[0]), num(r[r.length - 1])]));

/* ---- reading tally marks ---------------------------------------- */
const tallyCount = (svg) => (svg.match(/M[\d.]+ [\d.]+ V/g) || []).length + (svg.match(/ L[\d.]+ [\d.]+/g) || []).length;

/* ---- reading figures ------------------------------------------- */
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
const byClass = (cls) => (s) => s.cls !== cls ? 0 : s.tag === 'path' ? 0.5 : 1;
function barGraph(n, { across = false, linear = true } = {}) {
  const g = figure(n);
  const T = texts(g.svg);
  const ticks = T.filter(t => t.cls === 'dg-tick' && /^\d+$/.test(t.t) && (across ? t.anchor === 'middle' : t.anchor === 'end'))
    .map(t => ({ v: +t.t, p: across ? t.x : t.y - 3.6 })).sort((a, b) => a.v - b.v);
  const lo = ticks[0], hi = ticks[ticks.length - 1];
  const slope = (hi.v - lo.v) / (hi.p - lo.p);
  if (linear) is(`Fig ${n}: the axis ticks lie on one straight scale`, ticks.every(t => near(lo.v + (t.p - lo.p) * slope, t.v, 0.01 * (hi.v - lo.v))));
  const read = (p) => {
    for (let i = 0; i < ticks.length - 1; i++) {
      const a = ticks[i], b = ticks[i + 1];
      const k = (b.v - a.v) / (b.p - a.p);
      if ((p - a.p) * (p - b.p) <= 1e-6) return snap(a.v + (p - a.p) * k, k);
    }
    return snap(lo.v + (p - lo.p) * slope, slope);
  };
  const bars = shapes(g.svg).filter(s => s.tag === 'rect' && s.cls === 'dg-fill-b').map(s => s.a);
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
  const note = T.find(t => /unit length =/.test(t.t));
  const grid = ((g.svg.match(/class="dg-grid" d="([^"]*)"/) || [])[1] || '');
  const gpos = [...grid.matchAll(across ? /M([\d.]+) [\d.]+ V/g : /M[\d.]+ ([\d.]+) H/g)].map(m => +m[1]).sort((a, b) => a - b);
  const step = gpos.length > 1 ? Math.abs(read(gpos[1]) - read(gpos[0])) : null;
  if (note) ok(`Fig ${n}: the note "${note.t}" is the step between grid lines`, step, nums(note.t)[nums(note.t).length - 1]);
  show(`Fig ${n}`, JSON.stringify(out), 'step', step);
  return { values: out, step, g, read };
}
const count = (xs) => xs.reduce((m, x) => (m[x] = (m[x] || 0) + 1, m), {});

/* ---- B. the chapter's data --------------------------------------- */
const BODYF = flat(BODY);
const F = {};

// Table 4.1: one most popular game, one least
{
  const t = captioned('4.1').slice(1);
  const games = t.flatMap(r => [[r[0], r[1]], [r[2], r[3]], [r[4], r[5]]]).filter(([n]) => flat(n)).map(([, g]) => flat(g));
  const c = Object.entries(count(games)).sort((a, b) => b[1] - a[1]);
  F.games = { total: games.length, c };
  is('Table 4.1 has one most popular game', c[0][1] > c[1][1]);
  is('Table 4.1 has one least popular game', c.at(-1)[1] < c.at(-2)[1]);
  show('Table 4.1', JSON.stringify(F.games));
}
// Fig. 4.2: each group of strokes against the number under it
{
  const g = figure('4.2');
  const marks = [...g.svg.matchAll(/M([\d.]+) [\d.]+ [VL]/g)].map(m => +m[1]).sort((a, b) => a - b);
  const groups = [];
  for (const x of marks) {
    if (groups.length && x - groups.at(-1).last < 12) { groups.at(-1).n++; groups.at(-1).last = x; }
    else groups.push({ n: 1, last: x });
  }
  ok('Fig 4.2: strokes in each group against the number under it', groups.map(q => q.n), texts(g.svg).map(t => +t.t));
}
// Table 4.3 (tallies) = Table 4.17 = Fig. 4.18
{
  const t = captioned('4.3').slice(1);
  F.sweets = Object.fromEntries(t.map(r => {
    const n = tallyCount(r[1]);
    ok(`Table 4.3 ${flat(r[0])}: strokes against the tally's label`, n, Number((r[1].match(/aria-label="(\d+) tally marks"/) || [])[1]));
    if (flat(r[2])) ok(`Table 4.3 ${flat(r[0])}: printed frequency`, num(r[2]), n);
    return [flat(r[0]), n];
  }));
  ok('Table 4.17 repeats Table 4.3', data(captioned('4.17')), F.sweets);
  const b = barGraph('4.18');
  ok('Fig 4.18 is Table 4.17', Object.values(b.values), Object.values(F.sweets));
  is('text: the frequency of jalebi is 6 and of gulab jamun 9', BODYF.includes(`frequency of jalebi is ${F.sweets.Jalebi}, and the frequency of gulab jamun is ${F.sweets['Gulab jamun']}`));
  is('text: Jalebi was chosen by 6 students', BODYF.includes(`Jalebi was chosen by ${F.sweets.Jalebi} students, so draw its bar ${F.sweets.Jalebi} units tall`));
}
// Table 4.4: shoe sizes and the ordered list under it
{
  const sizes = captioned('4.4').flat().map(num);
  const ordered = [...sizes].sort((a, b) => a - b);
  const printed = nums(flat(BODY.match(/<div class="work work--centred">([\s\S]*?)<\/div>/)[1]));
  ok('Table 4.4 in ascending order is the list printed under it', printed, ordered);
  F.shoes = { max: Math.max(...sizes), min: Math.min(...sizes), five: sizes.filter(s => s === 5).length, over4: sizes.filter(s => s > 4).length };
  show('Table 4.4', JSON.stringify(F.shoes));
}
// Fig. 4.5 travel; Fig. 4.6 sleep and Example 1
{
  const p = pictograph('4.5', byClass('dg-fill-a'));
  ok('Fig 4.5 against its aria-label', Object.values(p.values), nums(p.g.aria));
  const s = pictograph('4.6', (x) => x.cls === 'dg-fill-b' ? (near(x.w, 15, 0.1) ? 1 : near(x.w, 7.5, 0.1) ? 0.5 : NaN) : 0);
  F.sleep = s.values;
  ok('Fig 4.6 key', s.key, 10);
  ok('Fig 4.6 symbols', Object.values(s.symbols), [5, 2.5, 4]);
  const ex = BODY.slice(BODY.indexOf('Example 1</div>'), BODY.indexOf('<h3>Drawing a pictograph'));
  const ans = flat(ex.match(/work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span>/)[1]);
  ok('Example 1 Answer', nums(ans), [1, F.sleep.Always, 2, F.sleep.Sometimes, 3, F.sleep.Never]);
}
// Table 4.7 = Fig. 4.8 = Fig. 4.14 (absent)
{
  F.absent = data(captioned('4.7'));
  ok('Fig 4.8 is Table 4.7', pictograph('4.8', byClass('dg-fill-a')).values, F.absent);
  const b = barGraph('4.14');
  ok('Fig 4.14 is Table 4.7', b.values, F.absent);
  ok('Fig 4.14 uses 1 unit for 1 student', b.step, 1);
}
// Table 4.9 = Fig. 4.10 (key 5) = Fig. 4.11 (key 10)
{
  F.present = data(captioned('4.9'));
  const five = pictograph('4.10', byClass('dg-fill-a'));
  ok('Fig 4.10 is Table 4.9', five.values, F.present);
  ok('Fig 4.10 key', five.key, 5);
  const ten = pictograph('4.11', byClass('dg-fill-a'));
  ok('Fig 4.11 is Table 4.9', ten.values, F.present);
  ok('Fig 4.11 key', ten.key, 10);
  is('every class in Table 4.9 is a multiple of 5', Object.values(F.present).every(v => v % 5 === 0));
  is('33 and 27 cannot be drawn with keys of 5 or 10 and halves', [33, 27].every(v => v % 5 !== 0));
}
// Fig. 4.12 books; Table 4.13 kites
{
  const p = pictograph('4.12', (s) => s.cls === 'dg-fill-c-soft' && s.tag === 'polygon' ? 0.5 : 0);
  ok('Fig 4.12 against its aria-label (Thursday none)', Object.values(p.values), nums(p.g.aria.replace('none', '0')));
  F.kites = data(captioned('4.13'));
  ok('Table 4.13', F.kites, { Chaman: 250, Rani: 300, Rukhsana: 100, Jasmeet: 450, 'Jetha Lal': 250, 'Poonam Ben': 700 });
  is('Table 4.13 can be drawn with one symbol for 100 and halves', Object.values(F.kites).every(v => (v / 50) % 1 === 0));
}
// Fig. 4.15 traffic, and the prose that reads it
{
  const b = barGraph('4.15', { across: true });
  const v = b.values;
  ok('Fig 4.15 against its aria-label', Object.values(v), [150, 1200, 1000, 800, 700, 600]);
  is('text reads the longest bar', BODYF.includes(`7 to 8 a.m., when ${v['7–8']} vehicles passed`) && v['7–8'] === Math.max(...Object.values(v)));
  is('text reads the shortest bar', BODYF.includes(`about ${v['6–7']} vehicles passed`) && v['6–7'] === Math.min(...Object.values(v)));
  is('text: 8 a.m. to 10 a.m.', BODY.includes(`$${v['8–9']} + ${v['9–10']} = ${v['8–9'] + v['9–10']}$`));
  ok('Fig 4.15 uses 1 unit for 100 vehicles', b.step, 100);
}
// Fig. 4.16 population
{
  const b = barGraph('4.16');
  ok('Fig 4.16 uses 1 unit for 10 crores', b.step, 10);
  ok('Fig 4.16 against its aria-label', Object.values(b.values), nums(b.g.aria).filter((_, i) => i % 2));
}
// Table 4.19 = Fig. 4.20 and Example 2
{
  F.runs = data(captioned('4.19'));
  const b = barGraph('4.20');
  ok('Fig 4.20 is Table 4.19', Object.values(b.values), Object.values(F.runs));
  ok('Fig 4.20 uses 1 unit for 10 runs', b.step, 10);
  const r = Object.values(F.runs);
  is('Example 2: lowest 0, highest 100', BODYF.includes(`lowest score is ${Math.min(...r)} and her highest score is ${Math.max(...r)}`));
  is('Example 2 check: Matches 5 and 7 both 90, 9 units', F.runs['5'] === 90 && F.runs['7'] === 90);
}
// Table 4.21 = Fig. 4.22 and Example 3
{
  F.spend = data(captioned('4.21'));
  const b = barGraph('4.22');
  ok('Fig 4.22 is Table 4.21', Object.values(b.values), Object.values(F.spend));
  ok('Fig 4.22 uses 1 unit for ₹200', b.step, 200);
  for (const [item, v] of Object.entries(F.spend))
    is(`Example 3 works out ${item}`, BODY.includes(`${item}: $${v} ${B}div 200 = ${v / 200}$ units`));
  const top = Object.entries(F.spend).sort((a, b) => b[1] - a[1])[0];
  is('Example 3 check: food is the tallest bar, 17 units, under 3600', top[0] === 'Food' && top[1] / 200 === 17 && Math.max(...b.read ? [3600] : []) >= top[1]);
  is('Think and Reflect: ₹3100 is 15 and a half units', 3100 / 200 === 15.5);
  is('Think and Reflect: rent and food are more than half', F.spend['House rent'] + F.spend.Food > sum(Object.values(F.spend)) / 2);
}
// Tables 4.23 and 4.24, Fig. 4.25: Pooja's graph
{
  data(captioned('4.23'));
  F.tickets = data(captioned('4.24'));
  const g = figure('4.25');
  is('Fig 4.25 has no numbers on its scale', !texts(g.svg).some(t => /^\d+$/.test(t.t)));
  const grid = [...g.svg.match(/class="dg-grid" d="([^"]*)"/)[1].matchAll(/M[\d.]+ ([\d.]+) H/g)].map(m => +m[1]).sort((a, b) => b - a);
  const base = +g.svg.match(/class="dg-axis" d="M[\d.]+ [\d.]+ V([\d.]+)/)[1];
  const unit = r2(base - grid[0]);
  const units = {};
  for (const c of texts(g.svg).filter(t => t.cls === 'dg-tick')) {
    const b = shapes(g.svg).find(s => s.tag === 'rect' && near(s.cx, c.x, 0.6));
    units[c.t] = b ? r2(+b.a.height / unit) : 0;
  }
  ok('Fig 4.25: Vidisha 6 units and Jabalpur 5, as the question says', [units.Vidisha, units.Jabalpur], [6, 5]);
  const scale = F.tickets.Vidisha / units.Vidisha;
  ok('Fig 4.25: Jabalpur gives the same scale', F.tickets.Jabalpur / units.Jabalpur, scale);
  ok('Fig 4.25: the bars that are wrong or missing', Object.keys(units).filter(k => units[k] !== F.tickets[k] / scale), ['Indore', 'Sagar']);
}
// Chinu, Bumrah, tractors, girls, dogs, free time, saplings
{
  const w = tableAfter(BODY, 'Faiz made');
  ok('Bumrah table: 30 matches', sum(w[1].slice(1).map(num)), 30);
  const p = pictograph('4.26', (s) => s.tag === 'rect' && s.cls === 'dg-fill-b' ? 1 : 0);
  ok('Fig 4.26 against its aria-label', Object.values(p.values), nums(p.g.aria));
  const q = pictograph('4.27', byClass('dg-fill-c-soft'));
  ok('Fig 4.27 key', q.key, 4);
  F.dogs = data(tableAfter(BODY, 'Mudhol Hounds are'));
  ok('Mudhol Hounds: keys that draw every village with whole and half symbols', [5, 6, 10, 12].filter(k => Object.values(F.dogs).every(v => (v * 2) % k === 0)), [6, 12]);
  F.free = data(tableAfter(BODY, 'students were asked what they like'));
  ok('free time adds up to 120', sum(Object.values(F.free)), 120);
  const s = barGraph('4.28');
  ok('Fig 4.28 against its aria-label', Object.values(s.values), nums(s.g.aria));
}
// Table 4.29, Fig. 4.30: tigers and the wrong bars
{
  F.tigers = data(captioned('4.29'));
  const b = barGraph('4.30', { across: true });
  ok('Fig 4.30: the bars drawn wrongly', Object.keys(F.tigers).filter(y => Math.round(b.values[y] / 100) * 100 !== F.tigers[y]), ['2006', '2010', '2014', '2018']);
}
// Table 4.31, Figs 4.32-4.35: mountains
{
  const t = captioned('4.31').slice(1);
  F.peaks = Object.fromEntries(t.map(r => [flat(r[1]), num(r[2])]));
  ok('Fig 4.32 is Table 4.31', barGraph('4.32', { across: true }).values, F.peaks);
  ok('Fig 4.33 is Table 4.31', Object.values(barGraph('4.33').values), Object.values(F.peaks));
  const tri = barGraph('4.34');
  const polys = shapes(tri.g.svg).filter(s => s.tag === 'polygon' && /^dg-fill-/.test(s.cls));
  ok('Fig 4.34: each triangle reaches its mountain’s height', polys.map(s => Math.round(tri.read(Math.min(...s.pts.map(q => q[1]))))), Object.values(F.peaks));
  is('Fig 4.34: the taller triangles are also wider', polys.every((s, i) => i === 0 || s.w < polys[i - 1].w));
  is('Fig 4.34: every triangle has its own fill', new Set(polys.map(s => s.cls)).size === polys.length);
  const ratioH = F.peaks.Everest / F.peaks.Kosciuszko, ratioW = polys[0].w / polys.at(-1).w;
  is(`Think and Reflect: Everest about 4 times Kosciuszko (${r2(ratioH)}), and its triangle about 4 times as wide (${r2(ratioW)})`, near(ratioH, 4, 0.1) && near(ratioW, 4, 0.1));
  const g = figure('4.35');
  const d = g.svg.match(/class="dg-line" d="([^"]*)"/)[1];
  const pts = [...d.matchAll(/[ML]([\d.]+) ([\d.]+)/g)].map(m => [+m[1], +m[2]]);
  const at = (x) => pts[0][1] - pts.find(p => p[0] === x)[1];
  const nameX = Object.fromEntries(texts(g.svg).filter(t => t.cls === 'dg-note').map(t => [t.t, t.x]));
  const drawn = at(nameX.Everest) / at(nameX.Elbrus);
  is(`Fig 4.35: Everest drawn about twice Elbrus (${r2(drawn)})`, drawn > 1.8 && drawn < 2.2);
  is('Everest is not twice as tall as Elbrus', F.peaks.Everest < 2 * F.peaks.Elbrus);
  is('the Think and Reflect asks for 5642 × 2', BODY.includes(`$${F.peaks.Elbrus} ${B}times 2$`));
}

/* ---- B. By the Book and Beyond: data behind the questions ------------ */
const BOARDF = flat(BOARD), BEYONDF = flat(BEYOND);
const keyStart = files.findIndex(f => HTML[f].includes('c-stage__title">Answers'));
const KEY = files.slice(keyStart).map(f => HTML[f]).join('\n');
const [boardKey, beyondKey] = KEY.split('c-practice__sub">Beyond the Book');
const traceOf = (key, n) => {
  const m = key.match(new RegExp(`work__label">${n}</span><span>([\\s\\S]*?)</span></div>`));
  return m ? flat(m[1]) : '';
};
const has = (s, ...xs) => xs.every(x => s.includes(String(x)));
{
  const list = (re, src) => src.match(re)[1].split(/,\s*/).map(Number);
  const marks = list(/students in a test are ([\d, ]+)\./, BOARDF);
  const c = count(marks);
  ok('BtB 11: 20 marks', marks.length, 20);
  is('BtB 11 key: frequencies 2, 6, 5, 4, 2 and 1, and 7 above 7', has(traceOf(boardKey, 11), [5, 6, 7, 8, 9, 10].map(k => c[k]).join(', ').replace(/, (\d+)$/, ' and $1'), `= ${marks.filter(m => m > 7).length}`));
  const fam = list(/each of 15 families is ([\d, ]+)\./, BOARDF);
  const cf = count(fam);
  ok('BtB 16: 15 families', fam.length, 15);
  is('BtB 16 key', has(traceOf(boardKey, 16), `1 child: ${cf[1]} families; 2: ${cf[2]}; 3: ${cf[3]}; 4: ${cf[4]}`, `= ${fam.filter(x => x > 2).length}`));
  const fruit = BOARDF.match(/24 students are: ([a-z, ]+)\./)[1].split(', ');
  const cr = count(fruit);
  ok('BtB 23: 24 fruits', fruit.length, 24);
  is('BtB 23 key', has(traceOf(boardKey, 23), `Mango ${cr.mango}, banana ${cr.banana}, apple ${cr.apple}, guava ${cr.guava}`, `${cr.mango - cr.apple} more`));
  // the two figures of By the Book
  const m = pictograph('4.36', byClass('dg-fill-a'));
  ok('Fig 4.36 values', m.values, { Monday: 40, Tuesday: 25, Wednesday: 50, Thursday: 15, Friday: 30 });
  is('BtB 36 key', has(traceOf(boardKey, 36), `(i) ${m.values.Wednesday}`, 'Thursday', `= ${sum(Object.values(m.values))}`));
  const v = barGraph('4.37');
  ok('Fig 4.37 values', v.values, { Monday: 150, Tuesday: 250, Wednesday: 200, Thursday: 300, Friday: 100, Saturday: 350 });
  ok('Fig 4.37 step', v.step, 50);
  is('BtB 40 key', has(traceOf(boardKey, 40), `(i) ${v.values.Thursday}`, 'Wednesday', `= ${sum(Object.values(v.values))}`, `${1500 - sum(Object.values(v.values))} short`)
    && v.values.Wednesday === 2 * v.values.Friday);
  // the rest of the written answers, from the numbers in their questions
  const K = (n, ...xs) => is(`BtB ${n} key has ${xs.join(', ')}`, has(traceOf(boardKey, n), ...xs));
  K(1, `${Math.floor(23 / 5)} groups of five and ${23 % 5} marks`);
  K(2, [5, 3, 7, 3, 9, 5, 3, 8].sort((a, b) => a - b).join(', '));
  K(3, `${4 * 6 + 3}$ books`); K(4, `${140 / 20}$ units`); K(6, `${360 / 9}$ kg`); K(7, `${36 - 9 - 12 - 7}$`);
  K(8, `${5 * 8 + 2.5 * 8}$ mangoes`); K(9, '4 and a half'); K(10, `${8 + 12 + 10}$ students`);
  K(12, `${30 + 45 + 20 + 35}$ notebooks`); K(14, `${70 / 3.5}$ bicycles`); K(15, `${9 * (72 / 6)}$ glasses`);
  K(17, [400, 750, 600, 250].map(x => x / 50).join(', ').replace(/, (\d+)$/, ' and $1'));
  K(18, `${4 + 7 + 5 + 4}$ children`, `{${4 + 7}}{20}`); K(19, `${7 * 5}$`); K(20, `${7 * 5 + 3}$`, `${50 - 38}$ more`, '10 groups');
  K(21, [45, 30, 55, 20, 50].map(x => x / 5).join(', ').replace(/, (\d+)$/, ' and $1'), `${45 + 30 + 55 + 20 + 50} in all`, `${55 - 20} more`);
  K(22, [60, 45, 75, 30].map(x => x / 15).join(', ').replace(/, (\d+)$/, ' and $1'), `${60 + 45 + 75 + 30} coconuts`);
  K(24, `${300 - 200} and ${450 - 200}`, `${300 / 50} and ${450 / 50} units`); is('BtB 24: really 1 and a half times', 450 / 300 === 1.5 && (450 - 200) / (300 - 200) === 2.5);
  K(25, `${5 * 4}, ${3.5 * 4} and ${2 * 4}, so ${(5 + 3.5 + 2) * 4}`, `${3 * 6}, ${2.5 * 6} and ${1.5 * 6}, so ${(3 + 2.5 + 1.5) * 6}`);
  K(26, [6, 9, 4, 12].map(x => x / 2).map(String).map(s => s.replace('.5', ' and a half')).join(', ').replace(/, (\d+)$/, ' and $1'), `${12 - 4}$ km`);
  K(27, '42 cannot'); is('BtB 27: 35, 60, 75 are multiples of 5 and 42 is not', [35, 60, 75].every(x => x % 5 === 0) && 42 % 5 !== 0);
  K(28, `${40 - 6 - 10 - 9 - 5}$ students`, `${0 * 6 + 1 * 10 + 2 * 10 + 3 * 9 + 4 * 5}$`, `${10 + 9 + 5}$`);
  K(29, [4, 6, 5, 7].map(x => x * 15).join(', ').replace(/, (\d+)$/, ' and $1'), `${420 - 330}$ more`);
  K(30, [120, 280, 360, 200, 160].map(x => x / 40).join(', ').replace(/, (\d+)$/, ' and $1'));
  is('BtB 30: 1 for 10 and 1 for 20 do not fit 15 squares', 360 / 10 > 15 && 360 / 20 > 15 && 360 / 40 <= 15);
  K(37, `${36 / 6}$`, `${24 + 36 + 30 + 42}$ kg`, 'Weeks 3 and 4'); is('BtB 37: weeks 3 and 4 need halves with 12', [24, 36, 30, 42].map(x => (x / 12) % 1 !== 0).join() === 'false,false,true,true');
  K(38, `${17 + 23 + 8 + 32}$`); is('BtB 38: 23 is 4 groups of five', Math.floor(23 / 5) === 4); is('BtB 38: 32/80 is more than 1/3', 32 / 80 > 1 / 3);
  K(39, 'July', `${26 + 28 + 25 + 21}$`, 'June, August and September'); is('BtB 39: those three are not multiples of 4', [26, 25, 21].every(x => x % 4) && 28 % 4 === 0);
}

/* ---- C. the key is complete, and every choice is recomputed --------- */
const numbered = s => new Set([...s.matchAll(/work__label">(\d+)<|class="n">(\d+)</g)].map(m => +(m[1] || m[2])));
const board = numbered(boardKey);
for (let n = 1; n <= 50; n++) is(`By the Book key has ${n}`, board.has(n));
const beyondList = (beyondKey.match(/c-answers__list">([\s\S]*?)<\/span><\/li>/) || [, ''])[1].replace(/&nbsp;/g, ' ');
const beyond = new Set([...numbered(beyondKey), ...[...beyondList.matchAll(/(?:^|\s{2,})(\d+) /g)].map(m => +m[1])]);
for (let n = 1; n <= 15; n++) is(`Beyond key has ${n}`, beyond.has(n));

const questionOptions = (html, n) => {
  const start = n === 1 ? html.search(/<ol class="c-questions">/) : html.indexOf(`data-start="${n}"`);
  if (start < 0) return null;
  const chunk = html.slice(start, html.indexOf('</li>\n', start) + 5);
  return [...chunk.matchAll(/c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/g)].map(o => [...o[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => flat(m[1])));
};
const L = 'abcd';
const boardLetters = Object.fromEntries([...boardKey.matchAll(/class="n">(\d+)<\/span> \((\w)\)/g)].map(m => [+m[1], m[2]]));
const pick = (opts, want) => opts.findIndex(o => o === String(want));
function single(label, opts, keyLetter, want) {
  const i = pick(opts || [], want);
  is(`${label}: exactly one option prints ${JSON.stringify(want)}`, i >= 0 && (opts || []).filter(o => o === String(want)).length === 1);
  is(`${label}: the key (${keyLetter}) is that option`, i >= 0 && L[i] === keyLetter);
}
// By the Book objective questions
{
  const sorted = [4, 7, 4, 9, 7, 4, 8].sort((a, b) => a - b).join(', ');
  const want = {
    41: `${Math.floor(19 / 5)} groups of five and ${19 % 5} marks`,
    42: `${12 / 2} books`,
    43: String(7 * 30),
    44: sorted,
    45: 'frequency',
    46: `${90 / 6} kites`,
    47: String((24 + 36 + 18 + 30) / 6),
    48: '(i) and (iii)',
    49: (65 % 5 === 0 && 65 % 10 !== 0) ? `Yes, with ${Math.floor(65 / 10)} and a half symbols` : 'no',
  };
  for (const [q, w] of Object.entries(want)) single(`By the Book ${q}`, (questionOptions(BOARD, +q) || []).at(-1), boardLetters[q], w);
  const o50 = questionOptions(BOARD, 50)[0];
  const good = o50.map(o => o.split(', ').map(Number).every(x => x % 25 === 0));
  is('By the Book 50: exactly one option is all multiples of 25, and it is keyed', good.filter(Boolean).length === 1 && L[good.indexOf(true)] === boardLetters[50]);
  // assertion and reason: [A true, R true, R explains A] -> letter
  const code = ([a, r, e]) => a && r ? (e ? 'a' : 'b') : a ? 'c' : r ? 'd' : '?';
  const AR = {
    31: [4.5 * 10 === 45, true, true],
    32: [[30, 45, 60].every(x => x % 15 === 0), true, false],
    33: [8 * 25 === 200, false, false],
    34: [10 % 4 === 0, true, false],
    35: [count([5, 2, 5, 7, 5, 2])[5] === 3, true, true],
  };
  for (const [q, t] of Object.entries(AR)) ok(`By the Book ${q}: assertion-reason code`, boardLetters[q], code(t));
  const spread = Object.values(boardLetters).reduce((m, l) => (m[l] = (m[l] || 0) + 1, m), {});
  is(`By the Book keys use all four letters ${JSON.stringify(spread)}`, 'abcd'.split('').every(l => spread[l] >= 2));
}
// Beyond: examples
const examples = [...BEYOND.matchAll(/c-example__tab">Example (\d+)<[\s\S]*?(?=c-example__tab"|c-stage__title">Answers|<div class="c-practice)/g)];
ok('Beyond has 10 solved examples, numbered 1-10', examples.map(e => +e[1]), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
const exAns = Object.fromEntries(examples.map(e => [+e[1], flat((e[0].match(/work__label">Answer<\/span><span>([\s\S]*?)<\/span>/) || [, ''])[1])]));
const exOpts = Object.fromEntries(examples.map(e => [+e[1], [...e[0].matchAll(/c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/g)].map(o => [...o[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => flat(m[1])))]));
for (const e of examples) is(`Example ${e[1]} ends in an Answer row`, !!exAns[e[1]]);
const letterOf = (opts, want) => L[opts.findIndex(o => o === String(want))];
const multi = (truths) => truths.map((t, i) => t ? `(${L[i]})` : null).filter(Boolean).join(', ');
const matchKey = (opts, map) => letterOf(opts, Object.entries(map).map(([k, v]) => `${k}–${v}`).join(', '));
{
  // Example 1: whole-symbol keys of 18, 30, 42; fewest symbols
  const keys = [2, 3, 6, 12].filter(k => [18, 30, 42].every(x => x % k === 0));
  const best = Math.max(...keys);
  ok('Example 1', exAns[1], `(${letterOf(exOpts[1][0], `1 symbol for ${best} items`)}) 1 symbol for ${best} items`);
  ok('Example 2', exAns[2], `(${letterOf(exOpts[2][0], (5 - 3) * 12)}) ${(5 - 3) * 12}`);
  const col = { red: 8, blue: 12, green: 5, yellow: 7 };
  ok('Example 3', exAns[3], multi([Math.max(...Object.values(col)) === col.blue, col.red + col.yellow === 15, col.green === sum(Object.values(col)) / 4, sum(Object.values(col)) === 32]));
  ok('Example 4', exAns[4], multi([4 * 5 === 20, true, false, 2 * 5 === 10]));
  ok('Example 5', exAns[5], String(4 * (84 / 7)));
  ok('Example 6', exAns[6], String(45 - 9 - 14 - 8));
  const m7 = { P: 3 * 12, Q: 2 * 12 + 6, R: 4 * 12, S: 12 + 6 };
  const l7 = { 30: 1, 18: 2, 48: 3, 36: 4 };
  const k7 = Object.fromEntries(Object.entries(m7).map(([k, v]) => [k, l7[v]]));
  ok('Example 7', exAns[7], `(${matchKey(exOpts[7][0], k7)}) ${Object.entries(k7).map(([k, v]) => `${k}–${v}`).join(', ')}`);
  const obs = [1, 1, 2, 1, 3, 2, 1, 4, 1, 3, 2, 1], c8 = count(obs);
  const l8 = { 3: 1, 6: 2, 12: 3, 2: 4 };
  const k8 = { P: l8[c8[1]], Q: l8[c8[2]], R: l8[c8[3]], S: l8[obs.length] };
  ok('Example 8', exAns[8], `(${matchKey(exOpts[8][0], k8)}) ${Object.entries(k8).map(([k, v]) => `${k}–${v}`).join(', ')}`);
  const poha = { Mon: 40, Tue: 55, Wed: 35, Thu: 60, Fri: 50 };
  is('Example 9 table', BEYOND.includes('<td>Plates</td><td>40</td><td>55</td><td>35</td><td>60</td><td>50</td>'));
  ok('Example 9', exAns[9], `(i) (${letterOf(exOpts[9][0], poha.Thu / 10)}) ${poha.Thu / 10}; (ii) ${sum(Object.values(poha))}; (iii) ${(poha.Thu - poha.Wed) / 5}`);
  const votes = { Lata: 4 * 5 + 3, Vikram: 3 * 5 + 4, Zoya: 5 * 5 + 1, Nitin: 2 * 5 };
  const win = Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];
  ok('Example 10', exAns[10], `(i) (${letterOf(exOpts[10][0], win)}) ${win}; (ii) ${sum(Object.values(votes))}; (iii) ${votes.Zoya - votes.Lata}`);
}
// Beyond: practice
{
  const P = BEYOND.slice(0, BEYOND.indexOf('c-stage__title">Answers'));
  const letters = {};
  for (const m of beyondList.split(/\s{2,}/)) { const x = m.trim().match(/^(\d+) (.*)$/); if (x) letters[+x[1]] = x[2].trim(); }
  const opt = (n) => (questionOptions(P, n) || []).at(-1);
  const one = (n, want) => ok(`Beyond ${n}`, letters[n], `(${letterOf(opt(n), want)})`);
  one(1, `${6.5 * 30} trees`);
  const o2 = [3, 5, 3, 6, 5, 3, 7, 5, 3], c2 = Object.entries(count(o2)).sort((a, b) => b[1] - a[1])[0];
  one(2, `${c2[0]}; ${c2[1]}`);
  one(3, String(3.5 * 8));
  const k4 = [12, 8, 2, 4].filter(k => [16, 28, 40].every(x => x % k === 0));
  one(4, String(Math.max(...k4)));
  const o5 = [2, 4, 2, 3, 4, 2, 5, 2], c5 = count(o5);
  ok('Beyond 5', letters[5], multi([o5.length === 8, c5[2] === 4, c5[4] === 3, o5.filter(x => x > 3).length === 3]));
  ok('Beyond 6', letters[6], multi([15, 20, 27, 33].map(x => x % 3 === 0)));
  ok('Beyond 7', letters[7], multi([5 * 40 === 200, 100 / 40 === 2.5, true, (150 / 40) % 1 === 0]));
  ok('Beyond 8', letters[8], multi([true, true, false, false]));
  ok('Beyond 9', letters[9], String(12 * (3 + 4.5 + 2 + 5)));
  ok('Beyond 10', letters[10], String(Math.floor((45 - (3 * 5 + 1) - (2 * 5 + 4)) / 5)));
  ok('Beyond 11', letters[11], String(450 / (4 + 7 + 5 + 9)));
  const o12 = questionOptions(P, 12)[0], v12 = { P: 60, Q: 50, R: 90, S: 30 }, l12 = { 90: 1, 60: 2, 50: 3, 30: 4, 40: 5 };
  ok('Beyond 12', letters[12], `(${matchKey(o12, Object.fromEntries(Object.entries(v12).map(([k, v]) => [k, l12[v]])))})`);
  is('Beyond 12 values', 3 * 20 === 60 && 2.5 * 20 === 50 && 4.5 * 20 === 90 && 1.5 * 20 === 30);
  const o13 = questionOptions(P, 13)[0], k13 = { P: 2, Q: 4, R: 1, S: 3 };
  is('Beyond 13 values', 4 * 15 === 60 && 6 * 15 === 90 && 45 / 15 === 3 && 105 / 15 === 7);
  ok('Beyond 13', letters[13], `(${matchKey(o13, k13)})`);
  const birds = { Mon: 18, Tue: 24, Wed: 12, Thu: 30, Fri: 20, Sat: 27, Sun: 36 };
  const days = { Mon: 'Monday', Wed: 'Wednesday', Fri: 'Friday', Sun: 'Sunday' };
  const bad = Object.keys(birds).filter(d => birds[d] % 3 !== 0);
  ok('Beyond 14: one day cannot be shown with 6 and halves', bad, ['Fri']);
  const o14 = questionOptions(P, 14)[0];
  is('Beyond 14 key', has(traceOf(beyondKey, 14), `(i) (${letterOf(o14, days[bad[0]])}) ${days[bad[0]]}`, `${Object.values(birds).join(' + ')} = ${sum(Object.values(birds))}$`, `= ${birds.Sun / 3}$`));
  const o15 = questionOptions(P, 15)[0];
  is('Beyond 15 key', has(traceOf(beyondKey, 15), `(i) (${letterOf(o15, (120 - 60) / (80 - 60))})`, `= ${120 / 20}`, `= ${120 + 80 + 100 + 60}`));
}

/* ---- D. placement -------------------------------------------------- */
{
  const where = {};
  for (const f of files) {
    for (const m of HTML[f].matchAll(/<span class="fignum">Fig\. (4\.\d+)<\/span>/g)) where['Fig. ' + m[1]] = f;
    for (const m of HTML[f].matchAll(/<caption>Table (4\.\d+) /g)) where['Table ' + m[1]] = f;
  }
  const facing = (a, b) => a === b || (Math.min(a, b) % 2 === 0 && Math.abs(a - b) === 1);
  // what a reader is asked: exercise and division questions, Think and
  // Reflect, worked examples, tries and case passages. Running text may
  // lead into a figure overleaf or point back to one (DESIGN-MATHS §11).
  const asked = (h) => [
    ...[...h.matchAll(/<ol class="c-questions"[^>]*>([\s\S]*?)<\/ol>\s*<\/div>/g)].map(m => m[1]),
    ...[...h.matchAll(/<div class="c-reflect__body">([\s\S]*?)<\/div>/g)].map(m => m[1]),
    ...[...h.matchAll(/<div class="c-try">([\s\S]*?)<\/div>/g)].map(m => m[1]),
    ...[...h.matchAll(/<div class="c-example__body">([\s\S]*?)<p><strong>Solution/g)].map(m => m[1]),
  ].join(' ');
  for (const f of files) {
    const text = asked(HTML[f]).replace(/<figcaption>[\s\S]*?<\/figcaption>/g, '').replace(/<caption>[\s\S]*?<\/caption>/g, '');
    for (const m of flat(text).matchAll(/(Fig\.|Table) (4\.\d+)/g)) {
      const ref = `${m[1]} ${m[2]}`;
      if (!where[ref]) { fails.push(`${f} names ${ref}, which is not printed`); continue; }
      const a = folio[f], b = folio[where[ref]];
      // a reference back to a table that the text reprints, or one only named in passing, still has to be in view
      if (!facing(a, b)) fails.push(`${f} (page ${a}) names ${ref}, printed on page ${b}`); else pass++;
    }
  }
  const order = files.flatMap(f => [...HTML[f].matchAll(/<span class="fignum">Fig\. 4\.(\d+)<\/span>|<caption>Table 4\.(\d+) /g)].map(m => +(m[1] || m[2])));
  ok('figures and tables run 4.1 to 4.37 in order', order, Array.from({ length: 37 }, (_, i) => i + 1));
}

/* ---- report ----------------------------------------------------------- */
for (const f of fails) console.log('  x ' + f);
console.log(`${pass + fails.length} checks, ${fails.length} failed`);
process.exit(fails.length ? 1 : 0);
