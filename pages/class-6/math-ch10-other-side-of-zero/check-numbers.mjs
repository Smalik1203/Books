#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value where the page can be read
   instead: each claim is computed, and then compared with what is on the
   page, on a figure, or in ANSWERS.md.

     node pages/class-6/math-ch10-other-side-of-zero/check-numbers.mjs

   Four parts:
     A  every relation set as maths anywhere in the chapter or in
        ANSWERS.md — each = is evaluated, each \lt and \gt compared.
        Minus signs arrive as -, as U+2212 and as \text{–}; brackets
        round negatives are parsed, not stripped. A span that cannot be
        evaluated is named, never dropped silently.
     B  what arithmetic on one line cannot check: the figures (every
        number-line label against its position, every token counted,
        every grid read), the answer row of every worked example, and
        every printed answer in the practice key, part by part
     C  every multiple-choice and assertion-reason question — options and
        key both read off the page — has exactly one right option, and it
        is the one the key prints
     D  ANSWERS.md — every expression an exercise sets is answered there,
        with the right value

   Exits non-zero if anything does not hold up. */

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
const HTML = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const ALL = pages.map(f => HTML[f]).join('\n');
const BODY = pages.filter(f => /^p0/.test(f)).map(f => HTML[f]).join('\n');
const BEYOND = pages.filter(f => /^p1/.test(f)).map(f => HTML[f]).join('\n');
const ANSWERS = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');

/* ---- reading maths ------------------------------------------- */

const B = String.fromCharCode(92);
// One spelling of every sign. The order matters: \text{–} before the
// bare dash it contains.
function norm(s) {
  return s
    .replace(/\\text\{\s*[–−-]\s*\}/g, '-')
    .replace(/\\text\{\s*\+\s*\}/g, '+')
    .replace(/[−–]/g, '-')
    .replace(/\\left|\\right/g, '')
    .replace(/\\times|\\cdot/g, '*')
    .replace(/\\div/g, '/')
    .replace(/\\[,;: ]|\\quad|\\qquad|~|&nbsp;/g, ' ')
    .replace(/\{,\}/g, '')
    .replace(/\{([+\-])\}/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

// A small recursive-descent parser, so that 3 - -2, (+4) and a unary
// minus in front of a bracket all mean what a reader means.
function evaluate(src) {
  const s = norm(src).replace(/[{}]/g, '').replace(/\s+/g, '');
  if (!/^[-+*/().0-9]+$/.test(s)) return null;
  let i = 0;
  const peek = () => s[i];
  function expr() {
    let v = term();
    while (peek() === '+' || peek() === '-') { const op = s[i++]; const r = term(); v = op === '+' ? v + r : v - r; }
    return v;
  }
  function term() {
    let v = factor();
    while (peek() === '*' || peek() === '/') { const op = s[i++]; const r = factor(); v = op === '*' ? v * r : v / r; }
    return v;
  }
  function factor() {
    if (peek() === '+') { i++; return factor(); }
    if (peek() === '-') { i++; return -factor(); }
    if (peek() === '(') { i++; const v = expr(); if (s[i++] !== ')') throw new Error('bracket'); return v; }
    const m = s.slice(i).match(/^\d+(\.\d+)?/);
    if (!m) throw new Error('number expected');
    i += m[0].length;
    return Number(m[0]);
  }
  try {
    const v = expr();
    return i === s.length && Number.isFinite(v) ? v : null;
  } catch { return null; }
}
const val = (s) => evaluate(s);

// Numbers in a stretch of page, with their signs: $-12$, −12, \text{–}12.
function numbersIn(html) {
  const flat = norm(html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\$([^$]*)\$/g, (_, m) => ' ' + m.replace(/[()]/g, ' ') + ' '))
    .replace(/°C/g, ' ')
    .replace(/(\d)(st|nd|rd|th)\b/g, '$1');
  return [...flat.matchAll(/(?<![\w.])([-+]?)\s?(\d+)(?![\w])/g)]
    .map(m => Number((m[1] === '-' ? '-' : '') + m[2]));
}

/* ---- A. every relation, everywhere --------------------------- */

const REL = /(=|\\lt|\\gt|\\le|\\ge|<|>)/;
let checked = 0;
const skipped = [];
const operators = [];
const meantFalse = [];
/* Two spans are printed false on purpose, and must stay false: a
   student's mistake the reader is asked to catch, and an assertion the
   reader is asked to reject. */
const MEANT_FALSE = {
  '(-8) - (+5) = -3': "Riya's mistake, stage 1",
  ['-5 ' + B + 'gt -2']: 'assertion A of practice question 16',
};

function sweep(where, text) {
  for (const m of text.matchAll(/\$([^$]+)\$/g)) {
    const span = m[1];
    if (!REL.test(span)) continue;
    const parts = span.split(REL).map(x => x.trim());
    // parts = [side, rel, side, rel, side …]
    const sides = parts.filter((_, k) => k % 2 === 0);
    const rels = parts.filter((_, k) => k % 2 === 1);
    // a bare sign used as a word in the prose — "Target $-$ Starting $=$ …"
    if (sides.every(x => x === '')) { operators.push({ where, span }); continue; }
    // an ellipsis at either end of a chain carries no claim
    while (sides.length && sides[0] === B + 'ldots') { sides.shift(); rels.shift(); }
    while (sides.length && sides[sides.length - 1] === B + 'ldots') { sides.pop(); rels.pop(); }
    const vals = sides.map(val);
    if (sides.length < 2 || vals.some(v => v === null)) {
      skipped.push(where + ': $' + span + '$');
      continue;
    }
    checked++;
    let good = true;
    for (let k = 0; k < rels.length; k++) {
      const a = vals[k], b = vals[k + 1], r = rels[k];
      const holds = r === '=' ? Math.abs(a - b) < 1e-9
        : (r === '\\lt' || r === '<') ? a < b
        : (r === '\\gt' || r === '>') ? a > b
        : r === '\\le' ? a <= b : a >= b;
      if (!holds) good = false;
    }
    const k = span.trim();
    if (k in MEANT_FALSE) {
      if (good) fails.push(where + ': $' + span + '$ is meant to be false (' + MEANT_FALSE[k] + ') and is not');
      else { pass++; meantFalse.push(where + ': $' + span + '$ — ' + MEANT_FALSE[k]); }
      continue;
    }
    if (good) pass++;
    else fails.push(where + ': $' + span + '$ — the sides are ' + vals.join(', '));
  }
}
for (const f of pages) sweep(f, HTML[f]);
sweep('ANSWERS.md', ANSWERS);

/* ---- B1. the figures ----------------------------------------- */

function figure(num) {
  const at = ALL.indexOf(`<span class="fignum">Fig. ${num}</span>`);
  if (at < 0) { fails.push(`Fig. ${num} not found`); return ''; }
  const start = ALL.lastIndexOf('<svg', at);
  return ALL.slice(start, at);
}
const texts = (svg, cls) => [...svg.matchAll(
  new RegExp(`<text class="${cls}"[^>]*?x="([-\\d.]+)" y="([-\\d.]+)"[^>]*>([^<]*)</text>`, 'g'))]
  .map(m => ({ x: +m[1], y: +m[2], t: m[3] }));
const num = (t) => { const v = val(t.replace(/\s*(m|°C)$/, '')); return v; };
const circles = (svg, cls) => [...svg.matchAll(
  new RegExp(`<circle class="${cls}" cx="([-\\d.]+)" cy="([-\\d.]+)" r="11(?:\\.5)?"`, 'g'))]
  .map(m => ({ x: +m[1], y: +m[2] }));

// Fig. 10.1 — the ray, 50 units a step from 0 at x = 30
{
  const svg = figure('10.1');
  const ticks = texts(svg, 'dg-tick');
  is('Fig. 10.1 has 0 to 10', ticks.map(t => num(t.t)).join() === '0,1,2,3,4,5,6,7,8,9,10');
  is('Fig. 10.1 every label sits on its own tick', ticks.every(t => t.x === 30 + 50 * num(t.t)));
}

// Fig. 10.2 — the floors, read from the drawing, top to bottom
const FLOORS = (() => {
  const svg = figure('10.2');
  const rooms = texts(svg, 'dg-note').filter(t => t.x === 160).sort((a, b) => a.y - b.y);
  const ground = rooms.findIndex(r => r.t === 'Welcome Hall');
  const out = {};
  rooms.forEach((r, k) => { out[r.t] = ground - k; });
  const floor0 = texts(svg, 'dg-note').find(t => t.t === 'Floor 0');
  is('Fig. 10.2 "Floor 0" is beside the Welcome Hall',
    floor0 && Math.abs(floor0.y - rooms[ground].y) < 1);
  ok('Fig. 10.2 floors above and below the ground',
    [rooms.length, ground, rooms.length - 1 - ground], [12, 6, 5]);
  return out;
})();
for (const [shop, f] of Object.entries(FLOORS)) {
  const sign = f > 0 ? `$+${f}$` : f < 0 ? `$${f}$` : '$0$';
  is(`ANSWERS floor table: ${shop} is ${sign}`, ANSWERS.includes(`| ${sign} | ${shop} |`));
}
// the body's own statements about the floors
const says = (what, needle) => is(`${what} — the page does not say "${needle}"`, BODY.includes(needle));
says('Food Court', `Food Court is on Floor $+${FLOORS['Food Court']}$`);
says('Art Centre', `Art Centre is on Floor $+${FLOORS['Art Centre']}$`);
says('Toy Store', `Toy Store is on Floor $${FLOORS['Toy Store']}$`);
says('Video Games', `Video Games is on Floor $${FLOORS['Video Games']}$`);
says('Book Store is +3', `floor number of the Book Store`);
is('Book Store is Floor +3', FLOORS['Book Store'] === 3);
says('Jay', `Jay is in the Art Centre, so he is on Floor $+${FLOORS['Art Centre']}$`);
says('Food Court to Book Store', `reach the Book Store on Floor $+${FLOORS['Book Store']}$`);
is('Art Centre to Sports Centre is three floors up', FLOORS['Sports Centre'] - FLOORS['Art Centre'] === 3);
says('the lift building range', `floors from $${Math.min(...Object.values(FLOORS))}$ to $+${Math.max(...Object.values(FLOORS))}$`);
// Exercise 10.1 and the Think and Reflects that name shops
const shopAt = (f) => Object.keys(FLOORS).find(k => FLOORS[k] === f);
is('10.1 Q1: +2 then -3 is the Toy Store', shopAt(2 - 3) === 'Toy Store' && ANSWERS.includes('Floor $-1$, the Toy Store'));
is('10.1 Q4: -3 then +5 is the Art Centre', shopAt(-3 + 5) === 'Art Centre' && ANSWERS.includes('Rehana reaches the Art Centre'));
ok('10.1 Q5: Book Store to Toy Store', FLOORS['Toy Store'] - FLOORS['Book Store'], -4);
ok('T&R floors of Jay, Asin, Binnu, Aman',
  ['Art Centre', 'Sports Centre', 'Cinema Centre', 'Toy Store'].map(k => FLOORS[k]), [2, 5, -3, -1]);
is('ANSWERS: Jay, Asin, Binnu and Aman',
  ANSWERS.includes('Jay is on Floor $+2$, Asin on Floor $+5$, Binnu on Floor $-3$ and Aman on\nFloor $-1$. **Binnu**'));
ok('10.1 Q2(h) stays inside the building', FLOORS[shopAt(6 - 9)] === -3, true);

// Fig. 10.3 — a building on its side: 21 units a floor, and the marks
// labelled on it
const FIG103 = (() => {
  const svg = figure('10.3');
  const ticks = [...svg.matchAll(/<line class="dg-thin" x1="([\d.]+)" y1="2\d"/g)].map(m => +m[1]);
  const step = ticks[1] - ticks[0];
  is('Fig. 10.3 marks are equally spaced', ticks.every((x, k) => k === 0 || x - ticks[k - 1] === step));
  const nums = texts(svg, 'dg-tick');
  const zero = nums.find(t => num(t.t) === 0).x;
  is('Fig. 10.3 every number sits on its own mark', nums.every(t => t.x === zero + step * num(t.t)));
  ok('Fig. 10.3 has as many marks as the label says', ticks.length, 25);
  const floorOf = Object.fromEntries(texts(svg, 'dg-label').map(t => [t.t, (t.x - zero) / step]));
  ok('Fig. 10.3 A, D and E as the question gives them', [floorOf.A, floorOf.D, floorOf.E], [-12, -1, 1]);
  return floorOf;
})();
{
  const m = ANSWERS.match(/B is \$([^$]+)\$, C is \$([^$]+)\$, F is\s+\$([^$]+)\$, G is \$([^$]+)\$ and H is \$([^$]+)\$/);
  ok('10.3 Q3 floors B, C, F, G, H', m ? m.slice(1).map(val) : null,
    ['B', 'C', 'F', 'G', 'H'].map(k => FIG103[k]));
  const marks = ANSWERS.match(/B is 3 marks to the right of A,\s+C is 6, F is 14, G is 18 and H is 23/);
  is('10.3 Q3 mark counts', marks && ['B', 'C', 'F', 'G', 'H'].map(k => FIG103[k] - FIG103.A).join() === '3,6,14,18,23');
  ok('10.3 Q4 marks from A', [-7, -4, -10].map(f => f - FIG103.A), [5, 8, 2]);
  is('10.3 Q4 +3 is one mark right of F', 3 - FIG103.F === 1);
}

// Fig. 10.4 — the mine: 0.55 units a metre from the ground at y = 119
{
  const svg = figure('10.4');
  const labels = texts(svg, 'dg-tick').filter(t => /^[−+-]/.test(t.t));
  const lines = [...svg.matchAll(/<line class="dg-thin" x1="\d+" y1="([\d.]+)" x2="\d+" y2="([\d.]+)"/g)]
    .filter(m => m[1] === m[2]).map(m => +m[1]);
  ok('Fig. 10.4 levels labelled', labels.map(t => num(t.t)), [180, 100, 40, -50, -90, -145, -200]);
  is('Fig. 10.4 every label sits on its tunnel', labels.every(t => lines.includes(t.y - 3.5)));
  is('Fig. 10.4 every tunnel is at its height', labels.every(t => Math.abs((119 - (t.y - 3.5)) / 0.55 - num(t.t)) < 1e-6));
  is('Fig. 10.4 the aria label lists the same levels',
    /\+180 m, \+100 m and \+40 m.*-50 m, -90 m, -145 m and -200 m/.test(svg));
  // the lift sums on the page use only marked levels
  for (const lv of [40, 100, -90, -145, -50]) is(`mine level ${lv} is marked`, labels.some(t => num(t.t) === lv));
  says('the mine range', 'levels from $-200$ to $+180$');
}

// Fig. 10.5 — the number line: 25 units a step from 0 at x = 285,
// and three jumps whose labels are their lengths
{
  const svg = figure('10.5');
  const ticks = texts(svg, 'dg-tick');
  is('Fig. 10.5 runs from -10 to 10', ticks.map(t => num(t.t)).join() === Array.from({ length: 21 }, (_, k) => k - 10).join());
  is('Fig. 10.5 every label on its tick', ticks.every(t => t.x === 285 + 25 * num(t.t)));
  const jumps = [...svg.matchAll(/<path class="dg-move" d="M([\d.]+) [\d.]+ Q[\d.]+ [-\d.]+ ([\d.]+) [\d.]+"/g)]
    .map(m => [(+m[1] - 285) / 25, (+m[2] - 285) / 25]);
  const jl = texts(svg, 'dg-dim-label').map(t => num(t.t));
  ok('Fig. 10.5 jumps, start and end', jumps, [[5, 9], [9, 3], [3, -2]]);
  ok('Fig. 10.5 jump labels are the movements', jl, jumps.map(([a, b]) => b - a));
  says('Fig. 10.5 text, first walk', 'To go from 5 to 9, you walk 4 steps forward');
  says('Fig. 10.5 text, second walk', 'To go from 9 to 3, you walk 6 steps backward');
  says('Fig. 10.5 text, third walk', 'To go from 3 to $-2$, you walk 5 steps backward');
  is('Fig. 10.5 aria label', svg.includes('from 5 forward 4 to 9, from 9 back 6 to 3') && svg.includes('from 3 back 5 to -2'));
}

// Fig. 10.6 — two unmarked lines, each drawn to its own scale
{
  const svg = figure('10.6');
  const ticks = texts(svg, 'dg-tick');
  const top = ticks.filter(t => t.y < 100), bot = ticks.filter(t => t.y > 100);
  const scale = (row) => { const z = row.find(t => num(t.t) === 0).x;
    const r = row.filter(t => num(t.t) !== 0).map(t => (t.x - z) / num(t.t));
    return r.every(q => Math.abs(q - r[0]) < 1e-9); };
  is('Fig. 10.6 first line is to scale', scale(top));
  is('Fig. 10.6 second line is to scale', scale(bot));
  const moves = [...svg.matchAll(/<path class="dg-move" d="M([\d.]+) [\d.]+ Q[\d.]+ [\d.]+ ([\d.]+) [\d.]+"/g)];
  const at = (row, x) => num(row.find(t => t.x === x).t);
  const m1 = [at(top, +moves[0][1]), at(top, +moves[0][2])];
  const m2 = [at(bot, +moves[1][1]), at(bot, +moves[1][2])];
  ok('Fig. 10.6 first jump', m1, [85, 25]);
  ok('Fig. 10.6 first jump label', num(texts(svg, 'dg-dim-label')[0].t), m1[1] - m1[0]);
  ok('Fig. 10.6 second jump', m2, [250, -100]);
  is('Fig. 10.6 second jump is the question mark', texts(svg, 'dg-dim-label')[1].t === '?');
  says('Fig. 10.6 answer', 'So $? = -350$');
  ok('Fig. 10.6 the second movement', m2[1] - m2[0], -350);
}

// tokens: every drawing counted
function tokensIn(svg, xFrom = -1, xTo = 1e9) {
  const inside = (c) => c.x > xFrom && c.x < xTo;
  return {
    pos: circles(svg, 'dg-fill-b').filter(inside).length,
    neg: circles(svg, 'dg-fill-c').filter(inside).length,
    gone: circles(svg, 'dg-ghost').filter(inside).length,
    rings: [...svg.matchAll(/<rect class="dg-ghost" x="([\d.]+)"[^>]*height="6\d"/g)].filter(m => inside({ x: +m[1] + 1 })).length,
  };
}
{
  const t7 = tokensIn(figure('10.7'), 0, 180);
  ok('Fig. 10.7 tokens', [t7.pos, t7.neg, t7.rings], [5, 3, 3]);
  ok('Fig. 10.7 what is left', t7.pos - t7.neg, 2);
  const t8 = tokensIn(figure('10.8'));
  ok('Fig. 10.8 tokens', [t8.pos, t8.neg, t8.rings], [5, 8, 5]);
  ok('Fig. 10.8 what is left', t8.pos - t8.neg, -3);
  const svg9 = figure('10.9');
  const a = tokensIn(svg9, 0, 290), b = tokensIn(svg9, 290);
  ok('Fig. 10.9 (a) and (b)', [[a.pos, a.neg], [b.pos, b.neg]], [[3, 5], [6, 3]]);
  is('ANSWERS 10.9 Q2 matches Fig. 10.9',
    ANSWERS.includes(`$(+${a.pos}) + (-${a.neg}) = ${a.pos - a.neg}$`) && ANSWERS.includes(`$(+${b.pos}) + (-${b.neg}) = +${b.pos - b.neg}$`));
  is('ANSWERS 10.9 Q2 zero pairs', ANSWERS.includes(`(a) ${Math.min(a.pos, a.neg)} zero pairs cancel and ${a.neg - a.pos} negative`)
    && ANSWERS.includes(`(b) ${Math.min(b.pos, b.neg)} zero pairs cancel and ${b.pos - b.neg} positive`));
  const svg10 = figure('10.10');
  const top = tokensIn(svg10.replace(/cy="62"/g, 'cy="x"'));
  const bot = tokensIn(svg10.replace(/cy="18"/g, 'cy="x"'));
  ok('Fig. 10.10 (+5) - (+4): kept and removed', [top.pos, top.gone], [1, 4]);
  ok('Fig. 10.10 (-7) - (-5): kept and removed', [bot.neg, bot.gone], [2, 5]);
  const svg11 = figure('10.11');
  const s1 = tokensIn(svg11, 0, 150), s2 = tokensIn(svg11, 150, 370), s3 = tokensIn(svg11, 370);
  ok('Fig. 10.11 the three steps', [[s1.pos, s1.neg], [s2.pos, s2.neg], [s3.gone, s3.neg]], [[5, 0], [6, 1], [6, 1]]);
  const svg12 = figure('10.12');
  const l = tokensIn(svg12, 0, 280), r = tokensIn(svg12, 280);
  ok('Fig. 10.12 left: 4 positives and 6 zero pairs', [l.pos, l.neg], [4 + 6, 6]);
  ok('Fig. 10.12 right: 6 negatives taken away', [r.pos, r.gone], [10, 6]);
  // Fig. 10.19 — the pattern the question describes
  const svg19 = figure('10.19');
  const all = [...svg19.matchAll(/<circle class="dg-fill-(b|c)" cx="([\d.]+)"/g)].sort((p, q) => p[2] - q[2]).map(m => m[1] === 'b' ? '+' : '-').join('');
  is('Fig. 10.19 shows +++-- repeating', /^(\+\+\+--)+$/.test(all));
  const pattern = [1, 1, 1, -1, -1];
  const total = Array.from({ length: 100 }, (_, k) => pattern[k % 5]).reduce((p, q) => p + q, 0);
  is('10.18 Q5 the string of 100 is worth +20', total === 20 && ANSWERS.includes('the string is worth **$+20$**'));
}

// Fig. 10.13 — the cross section: 30 units for 500 m, sea level at y = 112
const HEIGHTS = (() => {
  const svg = figure('10.13');
  const h = (y) => Math.round((112 - y) * 500 / 30);
  const ticks = texts(svg, 'dg-tick');
  is('Fig. 10.13 axis labels sit on their lines', ticks.every(t => h(t.y - 3.5) === num(t.t)));
  const pts = [...svg.matchAll(/<circle class="dg-fill-teal" cx="([\d.]+)" cy="([\d.]+)" r="3"\/>\s*<text class="dg-label" x="([\d.]+)" y="[\d.]+" text-anchor="middle">([A-G])<\/text>/g)];
  ok('Fig. 10.13 points A to G, each labelled over its own dot', pts.map(m => [m[4], m[1] === m[3]]),
    'ABCDEFG'.split('').map(c => [c, true]));
  const out = Object.fromEntries(pts.map(m => [m[4], h(+m[2])]));
  // the outline passes through each dot
  is('Fig. 10.13 each dot is on the outline', pts.every(m => svg.includes(`${m[1]} ${m[2]}`)));
  return out;
})();
{
  const printed = [...ANSWERS.matchAll(/\(([a-g])\) ([A-G]): \$([^$]+)\$ m/g)].map(m => [m[2], val(m[3])]);
  ok('10.13 Q1 heights', printed, Object.entries(HEIGHTS));
  const byHeight = Object.keys(HEIGHTS).sort((p, q) => HEIGHTS[q] - HEIGHTS[p]);
  is('10.13 Q2 highest and lowest', ANSWERS.includes(`The highest point is **${byHeight[0]}**, at $+${HEIGHTS[byHeight[0]]}$ m. The lowest is **${byHeight[6]}**, at\n   $${HEIGHTS[byHeight[6]]}$ m.`));
  is('10.13 Q3 order', ANSWERS.includes(`Highest to lowest: **${byHeight.join(', ')}.** Lowest to highest:\n   **${[...byHeight].reverse().join(', ')}.**`));
}

// Fig. 10.14 — thermometers: 13.5 units for 10 °C, 0 at y = 169
{
  const svg = figure('10.14');
  const t = (y) => (169 - y) / 1.35;
  const ticks = texts(svg, 'dg-tick');
  is('Fig. 10.14 scale labels on their marks', ticks.every(k => Math.abs(t(k.y - 3.5) - num(k.t)) < 1e-9));
  const fills = [...svg.matchAll(/<rect class="dg-fill-c" x="[\d.]+" y="([\d.]+)"/g)].map(m => Math.round(t(+m[1]) * 1e6) / 1e6);
  ok('Fig. 10.14 readings', fills, [40, 15]);
  says('Fig. 10.14 text', 'The thermometers in Fig. 10.14 show 40 °C and 15 °C');
}

// Table 10.1 — the passbook, run
{
  const rows = [...BODY.matchAll(/<tr><td>(\d)<\/td><td>[^<]*<\/td><td>(\d*)<\/td><td>(\d*)<\/td>/g)]
    .map(m => (+m[2] || 0) - (+m[3] || 0));
  const bal = []; rows.reduce((b, x) => (bal.push(b + x), b + x), 0);
  ok('Table 10.1 balances', bal, [100, 160, 130, -20, 180]);
  is('ANSWERS Table 10.1', ANSWERS.includes(`**${bal.map(b => b < 0 ? '$' + b + '$' : b).join(', ')}**`));
  const below = bal.findIndex(b => b < 0) + 1;
  is('ANSWERS Table 10.1 first day below zero and last balance',
    ANSWERS.includes(`below zero on **Day ${below}**`) && ANSWERS.includes(`it is **₹${bal[4]}**`));
}
// Exercise 10.12
{
  const cr = [30, 40, 50], db = [40, 50, 60];
  const q1 = cr.reduce((p, q) => p + q) - db.reduce((p, q) => p + q);
  is('10.12 Q1 the page gives these amounts', BODY.includes('credits of ₹30, ₹40 and ₹50, and debits of ₹40, ₹50 and ₹60'));
  is('10.12 Q1 balance', q1 === -30 && ANSWERS.includes('**$-30$ rupees**'));
  const d2 = [1, 2, 4, 8, 16, 32, 64, 128];
  is('10.12 Q2 the page gives these debits', BODY.includes(d2.map(d => '₹' + d).slice(0, -1).join(', ') + ' and ₹128') && BODY.includes('credit of ₹256'));
  is('10.12 Q2 balance', 256 - d2.reduce((p, q) => p + q) === 1 && ANSWERS.includes('that is, **₹1**'));
}

// grids: read a hollow or full grid out of a figure, cell by cell
function grid(svg, x0, y0, size, n, cls = 'dg-tick') {
  const g = Array.from({ length: n }, () => Array(n).fill(null));
  for (const t of texts(svg, cls)) {
    const c = Math.floor((t.x - x0) / size), r = Math.floor((t.y - y0) / size);
    if (c >= 0 && c < n && r >= 0 && r < n && t.x > x0 && t.y > y0) g[r][c] = num(t.t);
  }
  return g;
}
const border = (g) => [g[0].reduce((p, q) => p + q), g[2].reduce((p, q) => p + q),
  g[0][0] + g[1][0] + g[2][0], g[0][2] + g[1][2] + g[2][2]];
function perms(n) {
  if (n === 1) return [[0]];
  return perms(n - 1).flatMap(p => Array.from({ length: n }, (_, k) => [...p.slice(0, k), n - 1, ...p.slice(k)]));
}
const gameSums = (g) => [...new Set(perms(g.length).map(p => p.reduce((s, c, r) => s + g[r][c], 0)))];

// Fig. 10.15
{
  const svg = figure('10.15');
  const g1 = grid(svg, 25, 5, 34, 3), g2 = grid(svg.replace(/x="(1[5-9]\d|2\d\d)"/g, (m, x) => `x="${x - 113}"`), 25, 5, 34, 3);
  ok('Fig. 10.15 first grid', g1, [[4, -1, -3], [-3, null, 1], [-1, -1, 2]]);
  ok('Fig. 10.15 first grid border sums', border(g1), [0, 0, 0, 0]);
  says('the first grid border sum', 'The border sum of the first grid is 0');
  ok('Fig. 10.15 second grid border sums', border(g2), [-3, -3, -3, -3]);
  is('10.15 Q1 answer', ANSWERS.includes('The\n   border sum is **$-3$**'));
  is('Fig. 10.15 aria label matches the drawing',
    svg.includes('top row 4, -1, -3; middle row -3 and 1; bottom row -1, -1, 2') && svg.includes('top row 5, -3, -5; middle row 0 and -5; bottom row -8, -2, 7'));
}

// Fig. 10.16 — the puzzles, and the fillings ANSWERS.md gives for them
{
  const svg = figure('10.16');
  const at = (dx) => grid(svg.replace(/x="(\d+)"/g, (m, x) => `x="${x - dx}"`), 30, 5, 34, 3);
  const clues = [at(0), at(190), at(380)];
  const sums = texts(svg, 'dg-note').map(t => num(t.t.replace('border sum ', '')));
  ok('Fig. 10.16 border sums', sums, [4, -2, -4]);
  const fillings = [
    [0, [[-10, 10, 4], [5, null, -5], [9, -10, 5]]],
    [1, [[6, 8, -16], [11, null, -5], [-19, -2, 19]]],
    [2, [[7, -11, 0], [-6, null, -5], [-5, 0, 1]]],
    [2, [[7, -10, -1], [-5, null, -5], [-6, 0, 2]]],
  ];
  for (const [k, g] of fillings) {
    const keeps = clues[k].every((row, r) => row.every((c, cc) => c === null || c === g[r][cc]));
    is(`10.15 Q2/Q3 grid ${k + 1} filling keeps the given numbers`, keeps);
    ok(`10.15 Q2/Q3 grid ${k + 1} filling border sums`, border(g), Array(4).fill(sums[k]));
  }
  // the second puzzle has one filling only: each line has one gap in turn
  const unique2 = (() => { const g = clues[1], s = sums[1];
    const tr = s - g[0][0] - g[0][1]; const br = s - tr - g[1][2];
    const bl = s - g[2][1] - br; const ml = s - g[0][0] - bl;
    return [tr, br, bl, ml]; })();
  ok('10.15 Q2 second grid is forced', unique2, [-16, 19, -19, 11]);
  is('Fig. 10.16 first grid leaves a free choice (three lines, four unknowns)',
    clues[0].flat().filter(v => v !== null).length === 3 && clues[0][0][0] !== null && clues[0][2][0] !== null);
  ok('10.15 Q2 first grid left middle', sums[0] - clues[0][0][0] - clues[0][2][0], 5);
}

// Fig. 10.17 — the game played, and the claim that every game agrees
{
  const svg = figure('10.17');
  const g = grid(svg, 20, 10, 30, 4);
  ok('Fig. 10.17 grid', g, [[3, 4, 0, 9], [-2, -1, -5, 4], [1, 2, -2, 7], [-7, -6, -10, -1]]);
  for (const dx of [140, 280, 420]) {
    const again = grid(svg.replace(/x="(\d+)"/g, (m, x) => `x="${x - dx}"`), 20, 10, 30, 4);
    ok(`Fig. 10.17 panel at +${dx} is the same grid`, again, g);
  }
  const last = [...svg.matchAll(/<circle class="dg-line" cx="(\d+)" cy="(\d+)"/g)].slice(-4)
    .map(m => g[Math.floor((+m[2] - 10) / 30)][Math.floor((+m[1] - 440) / 30)]);
  ok('Fig. 10.17 circled numbers', last, [-1, 9, -7, -2]);
  says('Fig. 10.17 text', 'the circled numbers are $-1$, $9$, $-7$ and $-2$');
  const perRow = [...svg.matchAll(/<circle class="dg-line" cx="(\d+)" cy="(\d+)"/g)].slice(-4);
  is('Fig. 10.17 one circle in each row and each column',
    new Set(perRow.map(m => m[1])).size === 4 && new Set(perRow.map(m => m[2])).size === 4);
  ok('10.16 Q1 every game on Fig. 10.17', gameSums(g), [-1]);
  const notes = texts(svg, 'dg-note').map(t => num(t.t.replace('circle ', '')));
  ok('Fig. 10.17 step notes', notes, [-1, 9, -7, -2]);
}
// Fig. 10.18
{
  const svg = figure('10.18');
  const g1 = grid(svg, 6, 6, 28, 4), g2 = grid(svg, 198, 6, 28, 4);
  ok('Fig. 10.18 first grid', g1, [[7, 10, 13, 16], [-2, 1, 4, 7], [-11, -8, -5, -2], [-20, -17, -14, -11]]);
  ok('10.16 Q2 sums', [gameSums(g1), gameSums(g2)], [[-8], [-14]]);
  is('10.16 Q2 answer', ANSWERS.includes('The first grid gives **$-8$** every time, and the second gives\n   **$-14$**'));
  ok('10.16 Q3 row and column numbers of the first grid',
    [g1.map(r => r[0] - g1[0][0]), g1[0]], [[0, -9, -18, -27], [7, 10, 13, 16]]);
  is('Fig. 10.18 aria label matches',
    svg.includes('First: 7, 10, 13, 16; -2, 1, 4, 7; -11, -8, -5, -2; -20, -17, -14, -11'));
}

/* ---- B2. examples: the Answer row, read back ------------------- */

/* The body numbers its examples 1–5 and Beyond the Book starts again at 1,
   as Class 7 does. So an example is always looked up in its own half —
   "body Ex 2" and "Beyond Ex 2" are different examples — and a tab that is
   missing or misnumbered is a named failure, never a crash. */
function examplesIn(html) {
  const out = [];
  const re = /<div class="c-example__tab">Example (\d+)<\/div>/g;
  const marks = [...html.matchAll(re)];
  marks.forEach((m, k) => {
    const end = k + 1 < marks.length ? html.lastIndexOf('<div class="c-example">', marks[k + 1].index) : html.length;
    const body = html.slice(m.index, end);
    out.push({
      tab: Number(m[1]),
      body,
      q: (body.match(/<div class="c-example__body">\s*<p>([\s\S]*?)<\/p>/) || [])[1] || '',
      ans: (body.match(/<span class="work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span>/) || [])[1] || '',
    });
  });
  return out;
}
const EXAMPLES = { body: examplesIn(BODY), Beyond: examplesIn(BEYOND) };
ok('body example tabs read 1 to 5', EXAMPLES.body.map(e => e.tab), [1, 2, 3, 4, 5]);
ok('Beyond example tabs read 1 to 18', EXAMPLES.Beyond.map(e => e.tab), Array.from({ length: 18 }, (_, k) => k + 1));

const firstMath = (s) => (s.match(/\$([^$]+)\$/) || [])[1] || '';
const grab = (s, re) => { const m = s.match(re); if (!m) throw new Error(`nothing matches ${re}`); return m; };
// Every example's checks run inside one of these, so that an example that
// cannot be found, or cannot be read, fails by name and the rest still run.
function example(half, n, checks) {
  const label = `${half} Ex ${n}`;
  const hits = EXAMPLES[half].filter(e => e.tab === n);
  if (hits.length !== 1) { fails.push(`${label}: ${hits.length} examples carry this tab`); return; }
  const e = hits[0];
  const ans = (want) => ok(`${label} answer row`, numbersIn(e.ans), want);
  const say = (what, got, want) => ok(`${label} ${what}`, got, want);
  try { checks(e, ans, say); }
  catch (err) { fails.push(`${label}: could not be read (${err.message})`); }
}

// body
example('body', 1, (e, ans, say) => {
  const parts = [...e.body.matchAll(/<li>Target Floor \$([^$]+)\$, Starting Floor \$([^$]+)\$<\/li>/g)].map(m => val(m[1]) - val(m[2]));
  say('answers from its own parts', parts, [1, -4, 4]);
  ans(parts);
});
example('body', 2, (e, ans, say) => { say('movement', -3 - 2, -5); ans([-5]); });
example('body', 3, (e, ans) => ans([5, -8, 5 - 8]));
example('body', 4, (e, ans) => ans([4, -6, 4 - (-6)]));
example('body', 5, (e, ans, say) => {
  say('Brahmagupta rules 2 and 3', [27 - 15, -(8 + 14), 12 + 8], [12, -22, 20]);
  ans([(-27) + 15, (-8) + (-14), 12 - (-8)]);
});

// Beyond the Book, stage 2
example('Beyond', 1, (e, ans) => ans([...numbersIn(e.q)].sort((p, q) => p - q)));
example('Beyond', 2, (e, ans, say) => {
  const [d, s] = numbersIn(e.q);
  say('question numbers', [d, s], [5, -3]);
  ans([s + d, s - d, [s + d, s - d].sort((p, q) => Math.abs(q) - Math.abs(p))[0], 0]);
});
example('Beyond', 3, (e, ans, say) => {
  const [down, up, down2] = numbersIn(e.q);
  say('question numbers', [down, up, down2], [18, 7, 12]);
  ans([-down + up - down2, down + down2 - up]);
});
example('Beyond', 4, (e, ans) => ans([-36, 19, -14, 25, val(firstMath(e.q))]));
example('Beyond', 5, (e, ans, say) => {
  const [a, b] = numbersIn(e.q);
  say('question numbers', [a, b], [350, 120]);
  ans([-b - (-a), a - b]);
});
example('Beyond', 6, (e, ans, say) => {
  const opts = [...e.body.matchAll(/<li>\$([^$]+)\$<\/li>/g)].map(m => val(m[1]));
  const odd = opts.findIndex(v => opts.filter(w => w === v).length === 1);
  say('exactly one odd option', opts.length === 4 && odd >= 0 && opts.filter(v => v !== opts[odd]).length === 3, true);
  say('answer', [grab(e.ans, /\(([a-d])\)/)[1], numbersIn(e.ans)], ['abcd'[odd], [opts[odd]]]);
});
example('Beyond', 7, (e, ans) => ans([val(firstMath(e.q))]));
example('Beyond', 8, (e, ans) => ans([Math.abs(2 - 5), 2, 5, 2 - 5]));
example('Beyond', 9, (e, ans, say) => {
  // 12 tokens worth -4: p + n = 12, p - n = -4
  const sol = []; for (let p = 0; p <= 12; p++) if (p - (12 - p) === -4) sol.push([p, 12 - p]);
  say('the only split', sol, [[4, 8]]);
  ans(sol[0]);
});
example('Beyond', 10, (e, ans, say) => {
  const steps = [-600, -275, 500];
  const bal = []; steps.reduce((b, x) => (bal.push(b + x), b + x), 450);
  say('running balance', bal, [-150, -425, 75]);
  say('below zero exactly after the two debits', bal[0] < 0 && bal[1] < 0 && bal[2] >= 0, true);
  ans([bal[2]]);
});
example('Beyond', 11, (e, ans, say) => {
  const walk = Array.from({ length: 9 - 4 + 1 }, (_, k) => -6 + 3 * k);
  say('hour by hour', walk, [-6, -3, 0, 3, 6, 9]);
  say('printed walk', numbersIn(grab(e.body, /<span>(\$-6\$[\s\S]*?)<\/span>/)[1]), walk);
  ans([walk[walk.length - 1]]);
});
example('Beyond', 12, (e, ans) => ans([650 - (-80)]));
example('Beyond', 13, (e, ans, say) => {
  // years across BCE and CE: y BCE is -y and y CE is +y on the number
  // line, but there is no year 0, so one is taken off the difference.
  // Counted directly with astronomical numbering (1 BCE = 0, 45 BCE = -44).
  const [b, c] = grab(e.q, /from (\d+) BCE to (\d+) CE/).slice(1).map(Number);
  say('question years', [b, c], [45, 30]);
  const astro = (y, era) => (era === 'CE' ? y : 1 - y);
  const years = astro(c, 'CE') - astro(b, 'BCE');
  const list = []; for (let y = -b; y <= c; y++) if (y !== 0) list.push(y); // every real year, in order
  const counted = list.length - 1;            // the steps from one year to the next
  say('counted year by year', counted, years);
  say('step 1 writes the years as integers', numbersIn(grab(e.body, /<span>(write \d+ BCE[\s\S]*?)<\/span>/)[1]), [b, -b, c, c]);
  say('step 2: the integer difference', numbersIn(grab(e.body, /<span>(\$30 - \(-45\)[^<]*)<\/span>/)[1]), [c, -b, c, b, c + b]);
  say('step 3: less one for the missing year 0', numbersIn(grab(e.body, /<span>(the number line counts 0[^<]*)<\/span>/)[1]), [0, 0, c + b, -1, c + b - 1]);
  say('the check in parts', numbersIn(grab(e.body, /<p>(Check by counting in parts[\s\S]*?)<\/p>/)[1]), [b, 1, b - 1, 1, c - 1, c, b - 1, 1, c - 1, years]);
  say('no year 0 is named in the question', /there was no year 0/.test(e.q), true);
  ans([years]);
});
example('Beyond', 14, (e, ans) => ans([1 - (5 + (-2)), 1 - (5 + (-6))]));
example('Beyond', 15, (e, ans, say) => {
  const rows = grab(e.q, /rows are \$([^$]+)\$ and \$([^$]+)\$ and \$([^$]+)\$/).slice(1).map(r => r.split(',').map(val));
  say('every game gives one sum', gameSums(rows), [3]);
  ans(gameSums(rows));
  const circled = [[0, 0], [1, 1], [2, 2]].map(([r, c]) => rows[r][c]);
  const other = [[0, 2], [1, 0], [2, 1]].map(([r, c]) => rows[r][c]);
  say('the two games printed', [circled, other], [[2, -6, 7], [4, -3, 2]]);
  say('the row shifts', [rows[1].map((v, k) => v - rows[0][k]), rows[2].map((v, k) => v - rows[0][k])], [[-5, -5, -5], [3, 3, 3]]);
});
example('Beyond', 16, (e, ans, say) => {
  const seq = numbersIn(firstMath(e.q).replace(/\\ldots/, ''));
  const step = seq[1] - seq[0];
  say('constant step of 6', seq.every((v, k) => k === 0 || v - seq[k - 1] === step) && step === 6, true);
  const nth = (k) => seq[0] + (k - 1) * step;
  ans([10, nth(10)]);
  say('step 2', numbersIn(grab(e.body, /<span>(\$\(-2\)[^<]*)<\/span>/)[1]),
    [-2, 6, nth(5), nth(5), 6, nth(6), nth(6), 6, nth(7)]);
  say('step 3', numbersIn(grab(e.body, /The 7th number[^<]*/)[0]), [7, nth(7), 8, 9, 10, nth(8), nth(9), nth(10)]);
});
example('Beyond', 17, (e, ans) => {
  let s = 0; for (let k = 1; k <= 20; k++) s += k % 2 ? k : -k;
  ans([s]);
});
example('Beyond', 18, (e, ans, say) => {
  const seq = [50]; while (seq[seq.length - 1] >= 0) seq.push(seq[seq.length - 1] - 7);
  say('the sequence to its first negative', seq, [50, 43, 36, 29, 22, 15, 8, 1, -6]);
  ans([seq[seq.length - 1], seq.length]);
});

// Stage 1 — kept word for word, so its numbers are checked too
{
  const has = (what, n) => is(`stage 1: ${what}`, BEYOND.includes(n));
  ok('stage 1 lift', 3 + (-7 + 2), -2);
  has('the lift stops on Floor -2', 'The lift stops on Floor $-2$');
  ok('stage 1 Shimla', 6 - 9, -3);
  has('3 degrees below freezing', 'which is 3 degrees below freezing');
  ok('stage 1 the two expressions', [(-47) - (-19), (-47) + 19], [-28, -28]);
  has('both come to -28', 'Both come to $-28$');
  let s = 0; for (let k = -20; k <= 21; k++) s += k;
  ok('stage 1 sum from -20 to 21', s, 21);
  has('the sum is 21', 'So the sum is 21');
  ok('stage 1 how many numbers from -20 to 21', 21 - (-20) + 1, 42);
  has('42 numbers', 'Adding 42 numbers');
  ok('stage 1 Riya', (-8) - 5, -13);
  is('stage 1 Riya is wrong and the right answer is left of -8', -3 > -8 && -13 < -8);
  has('13 negative tokens', '8 negative tokens and 5 more negative tokens make 13 negative tokens');
}

/* ---- B3. the practice answers, part by part ------------------ */

const ROWS = (() => {
  const out = {};
  for (const m of BEYOND.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) {
    if (!(m[1] in out)) out[m[1]] = m[2];   // the key comes before the notes
  }
  return out;
})();
function row(q) {
  if (!(q in ROWS)) { fails.push(`no printed answer row for question ${q}`); return ''; }
  return ROWS[q];
}
function part(q, letter) {
  const r = row(q);
  const m = r.match(new RegExp(`\\(${letter}\\)([\\s\\S]*?)(?=\\([a-e]\\)|$)`));
  if (!m) { fails.push(`question ${q} has no part (${letter})`); return null; }
  return m[1];
}
const okRow = (what, q, want) => ok(what, numbersIn(row(q)), want);
const okPart = (what, q, l, want) => { const p = part(q, l); if (p !== null) ok(`${what} (${q}${l})`, numbersIn(p), want); };
const Q = (n) => {
  const all = [...BEYOND.matchAll(/<ol class="c-questions"( data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)];
  const hit = all.find(x => Number(x[2] || 1) === n);
  if (!hit) { fails.push(`practice question ${n} not found`); return ''; }
  return hit[3];
};

okRow('17 inverse of the inverse', 17, [-12, -12, 12, 12, -12].map((v, k) => k === 0 ? -(-(-12)) : v));
{
  const [a, b] = numbersIn(Q(18));
  okRow('18 the smaller', 18, [Math.min(a, b), b]);
}
okRow('19 value', 19, [-9, 4, 5, val(firstMath(Q(19)))]);
{
  const [k, f] = numbersIn(Q(20));
  okRow('20 kite and fish', 20, [k - f, k, f, k - f]);
}
{
  const [s] = numbersIn(Q(21));
  const [p, n] = numbersIn(row(21));
  is('21 the printed instance works', p > 0 && n < 0 && p + n === s);
}
{
  // 22, once Exercise 10.18 Q7
  const seq = numbersIn(firstMath(Q(22)).replace(/\\ldots/, ''));
  const step = seq[1] - seq[0];
  is('22 the sequence has one step', seq.every((v, k) => k === 0 || v - seq[k - 1] === step) && step === -3);
  const next = [1, 2, 3].map(k => seq[seq.length - 1] + k * step);
  okRow('22 next three, and the rule', 22, [...next, -step]);
}
{
  const [bal, target] = numbersIn(Q(23));
  okRow('23 the credit', 23, [target - bal, target, bal, target - bal]);
}
{
  const hs = numbersIn(Q(24)).sort((p, q) => p - q);
  const gap = hs[2] - hs[0];
  okRow('24 order and distance', 24, [...hs, gap, hs[2], hs[0], gap]);
}
{
  const [p, n, taken] = numbersIn(Q(25));
  const left = [p, n - taken];
  okRow('25 value, and the subtraction it shows', 25, [left[0] - left[1], 0, left[0], left[1], 0, -taken, left[0] - left[1]]);
}
{
  const [sum, tl, tr, br] = numbersIn(Q(26));
  const topMid = sum - (tl + tr), rightMid = sum - (tr + br);
  okRow('26 middles', 26, [tl, tr, tl + tr, sum, tl + tr, topMid, tr, br, tr + br, sum, tr + br, rightMid]);
}
{
  // 27, once Exercise 10.18 Q6
  const [night, day] = numbersIn(Q(27));
  ok('27 the temperatures as printed', [night, day], [-16, 7]);
  okRow('27 the rise', 27, [day - night, day, night, day - night]);
}
{
  // 28, once Exercise 10.17 Q5: read the six expressions, and check that the
  // two printed pairs are new pairs of these whose values are inverses
  const exprs = [...Q(28).split('The values')[0].matchAll(/\$([^$]+)\$/g)].map(m => m[1].trim());
  ok('28 six expressions', exprs.length, 6);
  const given = [...Q(28).split('The values')[1].matchAll(/\$([^$]+)\$/g)].map(m => m[1].trim());
  is('28 the given pair are inverses', given.length === 2 && val(given[0]) === -val(given[1]) && given.every(g => exprs.includes(g)));
  const printed = [...row(28).matchAll(/\$([^$=]+)=\s*([^$]+)\$/g)].map(m => [m[1].trim(), val(m[2])]);
  ok('28 two printed pairs', printed.length, 4);
  const pairs = [[printed[0], printed[1]], [printed[2], printed[3]]];
  is('28 each printed pair is two of the six, with inverse values, and not the given pair',
    pairs.every(([p, q]) => exprs.includes(p[0]) && exprs.includes(q[0]) && p[1] === val(p[0]) && q[1] === val(q[0])
      && p[1] === -q[1] && p[1] !== 0 && !(given.includes(p[0]) && given.includes(q[0]))));
  is('28 the two printed pairs are different', new Set(printed.map(x => x[0])).size === 4);
  // the fuller answer in ANSWERS.md names the same pairs
  is('28 ANSWERS names the printed pairs',
    ANSWERS.includes(`Two more pairs: $${printed[0][0]}$ with $${printed[1][0]}$, and\n    $${printed[2][0]}$ with $${printed[3][0]}$.`));
  ok('28 ANSWERS lists the six values', exprs.map(e => ANSWERS.includes(`$${e} = ${val(e)}$`)), exprs.map(() => true));
}
{
  const seq = numbersIn(firstMath(Q(29)).replace(/\\ldots/, ''));
  const step = seq[1] - seq[0];
  const more = []; let x = seq[seq.length - 1];
  while (more.length < 20) { x += step; more.push(x); }
  okPart('29 next four', 29, 'a', more.slice(0, 4));
  okPart('29 first negative', 29, 'b', [more.find(v => v < 0)]);
  const idx = [...seq, ...more].indexOf(-37);
  is('29(c) -37 is in the sequence', idx >= 0);
  okPart('29 counting on', 29, 'c', [...more.slice(more.indexOf(-37) - 2, more.indexOf(-37) + 1), -37, idx + 1]);
}
{
  const moves = numbersIn(Q(30)).slice(1, 6);
  ok('30 the moves as printed', moves, [5, -8, 2, -6, 4]);
  const floors = []; moves.reduce((f, m) => (floors.push(f + m), f + m), 0);
  okPart('30 floors', 30, 'a', floors);
  okPart('30 lowest', 30, 'b', [Math.min(...floors)]);
  okPart('30 total', 30, 'c', [...moves, moves.reduce((p, q) => p + q)]);
  is('30(c) the total is the last floor', moves.reduce((p, q) => p + q) === floors[floors.length - 1]);
  okPart('30 button', 30, 'd', [5, floors[4], 5 - floors[4]]);
}
{
  const n = numbersIn(Q(31));
  const rowsN = n.slice(2, 5), colsN = n.slice(5, 8);
  ok('31 row and column numbers as printed', [rowsN, colsN], [[3, -4, -1], [-2, 0, 5]]);
  const g = rowsN.map(r => colsN.map(c => r + c));
  okPart('31 the grid', 31, 'a', g.flat());
  const sums = gameSums(g);
  ok('31 every game agrees', sums.length, 1);
  const bp = numbersIn(part(31, 'b') || '');
  is('31(b) both printed games are games on this grid, and give the sum',
    bp.length === 8 && [[bp[0], bp[1], bp[2]], [bp[4], bp[5], bp[6]]].every(trio =>
      perms(3).some(p => p.every((c, r) => g[r][c] === trio[r]))) && bp[3] === sums[0] && bp[7] === sums[0]);
  okPart('31 why', 31, 'c', [...rowsN, ...colsN, sums[0]]);
}
{
  const cells = numbersIn(Q(32).match(/<tbody>[\s\S]*<\/tbody>/)[0]);
  const towns = ['P', 'Q', 'R', 'S'];
  const t = Object.fromEntries(towns.map((k, i) => [k, cells[i]]));
  const order = [...towns].sort((p, q) => t[p] - t[q]);
  is('32(a) coldest', part(32, 'a').trim() === order[0]);
  is('32(b) order', part(32, 'b').trim() === order.join(', '));
  okPart('32 Q warmer than S', 32, 'c', [t.Q, t.S, t.Q - t.S]);
  const rise = numbersIn(Q(32).split('By noon')[1])[0];
  okPart('32 P at noon', 32, 'd', [t.P, rise, t.P + rise]);
}
{
  const cells = numbersIn(Q(33).match(/<tbody>[\s\S]*<\/tbody>/)[0]);
  const names = [...Q(33).matchAll(/<tr><td>([A-Za-z ]+)<\/td>/g)].map(m => m[1]);
  const h = Object.fromEntries(names.map((k, i) => [k, cells[i]]));
  ok('33 table as read', h, { 'Hill top': 420, Village: 35, Beach: 0, Reef: -18, 'Sea bed': -65 });
  okPart('33 hill over sea bed', 33, 'a', [h['Hill top'], h['Sea bed'], h['Hill top'] - h['Sea bed']]);
  okPart('33 reef to sea bed', 33, 'b', [h['Sea bed'], h.Reef, h['Sea bed'] - h.Reef]);
  const apart = [];
  for (const a of names) for (const b of names) if (h[a] - h[b] === 53) apart.push([a, b]);
  ok('33(c) exactly one pair is 53 m apart', apart, [['Village', 'Reef']]);
  okPart('33 the pair', 33, 'c', [h.Village, h.Reef, 53]);
  const up = numbersIn(Q(33).split('A bird flies')[1])[0];
  const bird = h.Village + up;
  okPart('33 bird', 33, 'd', [h.Village, up, bird, bird, bird, h['Sea bed'], bird - h['Sea bed']]);
}

// the "why the other options are wrong" notes name real options
{
  const notes = BEYOND.slice(BEYOND.indexOf('Why the other options are wrong'));
  // three in note 6; note 11's sum is worded differently and is one of
  // the relations part A evaluates
  ok('worked distractors found in the notes',
    [...notes.matchAll(/Option \(([a-d])\)[^$.]*?\$([^$=]+)= ([^$]+)\$/g)].length, 3);
  {
    const n15 = notes.match(/A is true: \$(-?\d+)\$ lies to the right of \$(-?\d+)\$\. R is false: \$(-?\d+)\$ is (\d+) steps from 0 and \$(-?\d+)\$ is (\d+) steps, so \$(-?\d+)\$ is the one further away/);
    ok('note 15 order and distances',
      n15 && n15.slice(1).map(Number),
      [-3, -8, -3, Math.abs(-3), -8, Math.abs(-8), Math.abs(-3) > Math.abs(-8) ? -3 : -8]);
  }
  is('note 11 distractor', val('(-25) + (+40) + (-15) + (-30)') === -30 && notes.includes('$(-25) + (+40) + (-15) + (-30) = -30$'));
  for (const m of notes.matchAll(/Option \(([a-d])\)[^$.]*?\$([^$=]+)= ([^$]+)\$/g)) {
    is(`a note's worked distractor is arithmetic: ${m[2]} = ${m[3]}`, val(m[2]) === val(m[3]));
  }
}

/* ---- C. one right option, and the key says so ---------------- */

const KEY = {};
for (const m of BEYOND.matchAll(/<span class="n">(\d+)<\/span> \(([a-d])\)/g)) KEY[m[1]] = m[2];
const optionsOf = (n) => [...(Q(n).match(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*?)<\/ol>/) || ['', ''])[1]
  .matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1]);
const optVal = (o) => { const m = o.match(/^\$([^$]+)\$/); return m ? val(m[1]) : numbersIn(o)[0]; };
const stemVal = (n) => val(firstMath(Q(n)));

const MCQ = {
  1: (o) => optVal(o) + (-15) === 0 && numbersIn(Q(1))[0] === -15,
  2: (o, all) => optVal(o) === Math.max(...all.map(optVal)),
  3: (o) => optVal(o) === stemVal(3),
  4: (o) => optVal(o) === stemVal(4),
  5: (o) => optVal(o) === stemVal(5),
  6: (o) => { const [s, m1, m2] = numbersIn(Q(6)); return optVal(o) === s + m1 + m2; },
  7: (o) => { const [p, n] = numbersIn(Q(7)); return optVal(o) === p - n; },
  8: (o) => { const [a, b] = numbersIn(Q(8)); const want = []; for (let k = a + 1; k < b; k++) want.push(k);
    return JSON.stringify(numbersIn(o)) === JSON.stringify(want); },
  9: (o) => { const [, t, r] = numbersIn(Q(9)); return optVal(o) === t + r; },
  10: (o) => { const [bal, deb] = numbersIn(Q(10)); return optVal(o) === bal - deb; },
  11: (o) => optVal(o) === stemVal(11),
  // statements: the one that is false. A smallest negative integer would
  // have -1 added to it and still be an integer, so (c) is false; the
  // other three are checked over a range.
  12: (o) => {
    const R = Array.from({ length: 401 }, (_, k) => k - 200);
    const truth = {
      '0 is neither positive nor negative.': !(0 > 0) && !(0 < 0),
      '$-1$ is the greatest negative integer.': Math.max(...R.filter(v => v < 0)) === -1,
      'There is a smallest negative integer.': false,
      'Every positive integer is greater than every negative integer.': R.filter(v => v > 0).every(p => R.filter(v => v < 0).every(q => p > q)),
    };
    if (!(o in truth)) { fails.push(`Q12 option not recognised: ${o}`); return false; }
    return truth[o] === false;
  },
};
const LETTERS = ['a', 'b', 'c', 'd'];
for (const [n, right] of Object.entries(MCQ)) {
  const opts = optionsOf(Number(n));
  if (opts.length !== 4) { fails.push(`Q${n}: ${opts.length} options`); continue; }
  const good = opts.map((o, i) => right(o, opts) ? LETTERS[i] : null).filter(Boolean);
  if (good.length !== 1) fails.push(`Q${n}: ${good.length} right options (${good.join(', ') || 'none'})`);
  else if (good[0] !== KEY[n]) fails.push(`Q${n}: the right option is (${good[0]}), the key prints (${KEY[n]})`);
  else pass++;
}

/* An assertion-reason question is graded on three facts: is A true, is R
   true, and does R explain A. The first two are computed from what the
   page prints; the third is the judgement the question tests, and is
   stated. In Class 7's form the four choices are printed once, in the
   note, and no question carries an option list of its own. */
const R = Array.from({ length: 81 }, (_, k) => k - 40);
const partsAR = (n) => {
  const m = Q(n).match(/^<p>Assertion \(A\): ([\s\S]*?)<\/p><p>Reason \(R\): ([\s\S]*?)<\/p>$/);
  if (!m) { fails.push(`Q${n} is not set as Assertion (A) / Reason (R)`); return ['', '']; }
  return [m[1], m[2]];
};
const rel = (s, sym) => {
  const m = s.match(/\$([^$]+) \\(lt|gt) ([^$]+)\$/);
  return m && m[2] === sym ? [val(m[1]), val(m[3])] : null;
};
const AR = {
  13: { A: () => { const [x, y] = firstMath(partsAR(13)[0]).split('='); return val(x) === val(y); },
        R: () => /Subtracting a negative number is the same as adding the matching positive number/.test(partsAR(13)[1])
          && R.every(a => R.every(b => a - (-Math.abs(b)) === a + Math.abs(b))), explains: true },
  14: { A: () => { const p = rel(partsAR(14)[0], 'lt'); return !!p && p[0] < p[1]; },
        R: () => { const p = rel(partsAR(14)[1], 'gt'); return !!p && p[0] > p[1]; }, explains: false },
  // R: "the first is further from 0 than the second"
  15: { A: () => { const p = rel(partsAR(15)[0], 'gt'); return !!p && p[0] > p[1]; },
        R: () => { const [a, b] = numbersIn(partsAR(15)[1]).filter(v => v !== 0); return /further from 0/.test(partsAR(15)[1]) && Math.abs(a) > Math.abs(b); },
        explains: false },
  // R: "the first lies to the left of the second"
  16: { A: () => { const p = rel(partsAR(16)[0], 'gt'); return !!p && p[0] > p[1]; },
        R: () => { const [a, b] = numbersIn(partsAR(16)[1]); return /lies to the left of/.test(partsAR(16)[1]) && a < b; },
        explains: false },
};
{
  const note = BEYOND.match(/<p class="c-practice__note">([^<]*)<\/p>/);
  is('the A–R note names Questions 13 to 16 and the four choices', !!note && note[1] ===
    'In Questions 13 to 16, choose (a) if both A and R are true and R explains A; (b) if both are true but R does not explain A; (c) if A is true but R is false; (d) if A is false but R is true.');
}
for (const [n, q] of Object.entries(AR)) {
  const a = q.A(), r = q.R();
  const want = a && r ? (q.explains ? 'a' : 'b') : a && !r ? 'c' : !a && r ? 'd' : '?';
  if (/c-parts/.test(Q(Number(n)))) fails.push(`Q${n}: an assertion-reason question carries its own option list`);
  if (want === '?') fails.push(`Q${n}: both A and R are false, which is not an option`);
  else if (want !== KEY[n]) fails.push(`Q${n}: A is ${a}, R is ${r} → (${want}), the key prints (${KEY[n]})`);
  else pass++;
}
ok('every choice question has a key entry', Object.keys(KEY).map(Number).sort((p, q) => p - q),
  Array.from({ length: 16 }, (_, k) => k + 1));
{
  const spread = LETTERS.map(l => Object.values(KEY).filter(x => x === l).length);
  is(`the key uses all four letters (${spread.join(' ')})`, spread.every(c => c >= 3));
}
// the practice run: numbered 1 to N with no gap or repeat, six forms in order
{
  const starts = [...BEYOND.matchAll(/<ol class="c-questions"( data-start="(\d+)")?>/g)]
    .filter(m => BEYOND.lastIndexOf('c-practice', m.index) > BEYOND.indexOf('c-practice__num'))
    .map(m => Number(m[2] || 1));
  ok('practice numbered without a gap', starts, Array.from({ length: starts.length }, (_, k) => k + 1));
  is(`practice runs to at least 26 (${starts.length})`, starts.length >= 26);
  const subs = [...BEYOND.matchAll(/<div class="c-practice__sub">([^<]+)<\/div>/g)].map(m => m[1]);
  ok('the six forms, in order', subs,
    ['Choose the correct option', 'Assertion and reason', 'Very short answer', 'Short answer', 'Long answer', 'Case-based questions']);
}

/* ---- D. ANSWERS.md -------------------------------------------- */

// Every relation ANSWERS.md prints, keyed by its left side.
const ANS = [];
for (const m of ANSWERS.matchAll(/\$([^$]+)\$/g)) {
  const p = m[1].split(REL).map(x => x.trim());
  if (p.length >= 3) ANS.push({ lhs: norm(p[0]).replace(/\s+/g, ''), rel: p[1], rhs: p.slice(2) });
}
const key = (s) => norm(s).replace(/\s+/g, '');
function answered(what, expr, want) {
  const k = key(expr);
  const hit = ANS.find(a => a.lhs === k && a.rel === '=' && val(a.rhs[a.rhs.length - 1]) === want);
  if (hit) pass++;
  else fails.push(`${what}: ANSWERS.md has no "$${expr} = ${want}$"`);
}

// every expression an exercise sets as a part, answered with its value
{
  let n = 0;
  for (const m of BODY.matchAll(/<ol class="c-parts[^"]*">([\s\S]*?)<\/ol>/g)) {
    for (const li of m[1].matchAll(/<li>\$([^$]+)\$<\/li>/g)) {
      const e = li[1];
      if (REL.test(e)) continue;
      if (/^[-+]?\d+$/.test(e.trim())) continue;   // a floor to mark, not a sum
      const v = val(e);
      if (v === null) { skipped.push(`exercise part: $${e}$`); continue; }
      answered('exercise part', e, v); n++;
    }
  }
  is(`exercise parts found (${n})`, n === 8 + 4 + 10 + 8 + 6 + 4 + 4 + 6 + 6 + 6 + 8);
}
// the parts with a gap to fill: missing addends, and comparisons
{
  const count = (re) => [...BODY.matchAll(re)].length;
  ok('gap parts found: addends, subtractions, comparisons', [
    count(/<li>\$([^$]+)\+\$ <span class="blank"><\/span> \$= ([^$]+)\$<\/li>/g),
    count(/<li>\$([^$]+)\$ <span class="blank"><\/span>\s*\$?<\/li>/g),
    count(/<li>\$([^$]+)\$ <span class="blank blank--sm"><\/span> \$([^$]+)\$<\/li>/g)], [4, 3, 12]);
  for (const m of BODY.matchAll(/<li>\$([^$]+)\+\$ <span class="blank"><\/span> \$= ([^$]+)\$<\/li>/g)) {
    const start = val(m[1]), target = val(m[2]);
    const hit = ANS.find(a => a.lhs.startsWith(key(m[1]) + '+') && val(a.lhs) === target && val(a.rhs[0]) === target);
    const move = hit && val(hit.lhs.slice(key(m[1]).length + 1));
    is(`10.5 ${m[1]} + ? = ${m[2]} is answered with ${target - start}`, move === target - start);
  }
  for (const m of BODY.matchAll(/<li>\$([^$]+)\$ <span class="blank"><\/span>\s*\$?<\/li>/g)) {
    const e = m[1].replace(/\s*[-]\s*$/, '');
    answered('10.5 blank subtraction', e.replace(/=$/, '').trim(), val(e.replace(/=$/, '')));
  }
  for (const m of BODY.matchAll(/<li>\$([^$]+)\$ <span class="blank blank--sm"><\/span> \$([^$]+)\$<\/li>/g)) {
    const a = val(m[1]), b = val(m[2]);
    const rel = a < b ? '\\lt' : '\\gt';
    is(`10.3 ${m[1]} ? ${m[2]} answered with ${rel}`, ANSWERS.includes(`$${m[1]} ${rel} ${m[2]}$`));
  }
}
// Exercise 10.1, 10.2 and 10.11 stems
answered('10.1 Q1', '(+2) + (-3)', 2 - 3);
answered('10.2 Q2', '(-2) + (+5) + (-4)', -2 + 5 - 4);
is('10.2 Q2 below', ANSWERS.includes('**below** where she started'));
answered('10.1 Q4', '(-3) + (+5)', 2);
answered('10.1 Q5', '(+3) + (-4)', -1);
answered('10.11 Q1', '(-3) - (+5)', -8);
is('10.11 Q1 zero pairs', ANSWERS.includes('1. **5 zero pairs.**'));
answered('10.9 Q3', '(-4) + (+4)', 0);
answered('10.9 Q4', '(+9) + (-7)', 2);
answered('10.8 Q2', '(-40) + (+90)', 50);
answered('T&R Basant', '(+4) + (-4)', 0);
answered('T&R (-7) + (+5)', '(-7) + (+5)', -2);
answered('practice Q27, once Ex. 10.18 Q6', '7 - (-16)', 23);
answered('10.18 Q3', '(-5) - (+18) - (+7)', -30);
answered('10.18 Q3 smallest', '(-5) + (-2) + (-9) - (+1) - (+7) - (+18)', -42);
answered('T&R number line', '(-8) + (-3)', -11);
is('T&R inverses', ANSWERS.includes('The inverses are $-4$, $+4$, $+3$, $0$, $-2$ and $+1$.')
  && [4, -4, -3, 0, 2, -1].map(v => -v).join() === '-4,4,3,0,-2,1');
is('T&R matching inverses', ANSWERS.includes('$+5$ with $-5$; $-7$ with $+7$; $-8$ with $+8$; $+9$ with $-9$.'));
is('T&R which is further from 0', Math.abs(-7) > Math.abs(5) && ANSWERS.includes('so **$-7$** is further'));
{
  // Exercise 10.17
  const between = (a, b) => { const lo = Math.min(a, b), hi = Math.max(a, b); const o = []; for (let k = lo + 1; k < hi; k++) o.push(k); return o; };
  const pairs = [[0, -7], [-4, 4], [-8, -15], [-30, -23]];
  pairs.forEach(([a, b], i) => is(`10.17 Q1(${'abcd'[i]})`, ANSWERS.includes(`(${'abcd'[i]}) $${between(a, b).join(', ')}$`)));
  const faces = [-1, 2, -3, 4, -5, 6];
  const got = new Set(); faces.forEach(p => faces.forEach(q => got.add(p + q)));
  const missing = []; for (let k = -10; k <= 12; k++) if (!got.has(k)) missing.push(k);
  ok('10.17 Q3 sums that cannot be rolled', missing, [-9, -7, -5, 0, 2, 7, 9, 11]);
  is('10.17 Q3 printed', ANSWERS.includes('**$-9$, $-7$, $-5$, 0, 2, 7, 9 and 11.**'));
  is('10.17 Q3 the smallest and largest the page states', Math.min(...got) === -10 && Math.max(...got) === 12);
  is('10.17 Q3 the examples can be rolled', [[-1, 2], [-5, 4], [4, 4], [4, 6]].every(([p, q]) => faces.includes(p) && faces.includes(q)));
}
{
  // Exercise 10.18 Q1, for 2026: there is no year 0
  const toAstro = (y) => y;                 // CE years
  const fromAstro = (a) => (a >= 1 ? `${a}` : `${1 - a} BCE`);
  const bce = (y) => 1 - y;                 // y BCE in astronomical numbering
  ok('10.18 Q1', [fromAstro(toAstro(2026) - 150), fromAstro(2026 - 2200), fromAstro(bce(680) + 320)],
    ['1876', '175 BCE', '360 BCE']);
  is('10.18 Q1 printed', ANSWERS.includes('(a) **1876**') && ANSWERS.includes('(b) **175 BCE**') && ANSWERS.includes('(c) **360 BCE**'));
  ok('10.18 Q1(b) the count', 2025 + 1 + 174, 2200);
  // Q2 sequences
  const a = [-40, -34, -28, -22]; const na = [1, 2, 3].map(k => a[3] + 6 * k);
  is('10.18 Q2(a)', ANSWERS.includes(`(a) $${na.join(', ')}$`));
  const b = [3, 4, 2, 5, 1, 6, 0, 7]; const nb = [b[6] - 1, b[7] + 1, b[6] - 2];
  is('10.18 Q2(b)', ANSWERS.includes(`(b) $${nb.join(', ')}$`));
  const steps = [-8, -7, -6, -5, -4, -3, -2, -1, 0];
  const c = [27]; steps.forEach(s => c.push(c[c.length - 1] + s));
  ok('10.18 Q2(c) the printed middle agrees', c.slice(2, 7), [12, 6, 1, -3, -6]);
  is('10.18 Q2(c)', ANSWERS.includes(`**${c[0]}, ${c[1]}** before, and **$${c.slice(7).join(', ')}$** after`));
  // Q4, by trying every pair in a range
  const Rg = Array.from({ length: 41 }, (_, k) => k - 20).filter(v => v !== 0);
  const P = Rg.filter(v => v > 0), N = Rg.filter(v => v < 0);
  const kind = (f, X, Y) => { const s = new Set(); X.forEach(x => Y.forEach(y => s.add(Math.sign(f(x, y))))); return [...s].sort().join(); };
  ok('10.18 Q4 signs', [kind((x, y) => x - y, P, N), kind((x, y) => x + y, P, N), kind((x, y) => x + y, N, N),
    kind((x, y) => x - y, N, N), kind((x, y) => x - y, N, P), kind((x, y) => x + y, N, P)],
    ['1', '-1,0,1', '-1', '-1,0,1', '-1', '-1,0,1']);
  is('practice Q22, once Ex. 10.18 Q7', ANSWERS.includes('22. $-7$, $-10$, $-13$.') && [5, 2, -1, -4].every((v, k, s) => k === 0 || v - s[k - 1] === -3));
}
{
  // 10.13 Q4 and Q5 are facts, not arithmetic: recorded with their source in EDIT-LOG.md
  is('10.13 Q4 Everest', ANSWERS.includes('**Mount Everest**, about $+8849$ m') && Math.round(8848.86) === 8849);
  // 10.14 Q2: the warmest reading in the afternoon, the coldest before dawn
  const temps = { '2:00 p.m.': 14, '11:00 a.m.': 8, '11:00 p.m.': -2, '2:00 a.m.': -4 };
  const printed = BODY.match(/<th>Temperature<\/th><th>([^<]+)<\/th><th>([^<]+)<\/th><th>([^<]+)<\/th><th>([^<]+)<\/th>/).slice(1).map(t => numbersIn(t)[0]).sort((p, q) => p - q);
  ok('Table 10.2 temperatures', printed, Object.values(temps).sort((p, q) => p - q));
  is('10.14 Q2 printed', ANSWERS.includes('**14 °C at 2:00 p.m., 8 °C at 11:00 a.m., $-2$ °C at 11:00 p.m. and\n   $-4$ °C at 2:00 a.m.**'));
}
{
  // Beyond: the key in ANSWERS.md is the key on the page
  const key2 = {};
  for (const m of ANSWERS.matchAll(/\| (\d+) \(([a-d])\)/g)) key2[m[1]] = m[2];
  ok('ANSWERS key matches the page key', key2, KEY);
  // and each practice answer's numbers agree with the page row
  const ansRows = {};
  const beyond = ANSWERS.slice(ANSWERS.indexOf('### Stage 3'));
  for (const m of beyond.matchAll(/^(\d+)\. ([\s\S]*?)(?=^\d+\. |(?![\s\S]))/gm)) ansRows[m[1]] = m[2];
  // ANSWERS.md may close a row with its answer in bold; that summary is
  // named here and checked against the page's own values.
  const SUMMARY = { 26: numbersIn(row(26)).filter((_, k) => k === 5 || k === 11), 30: [5 - (-3)] };
  for (let n = 17; n <= 33; n++) {
    // answers will vary: 21 is checked for the same instance below, and 28's
    // fuller answer by the pair check on the page and part A's arithmetic
    if (n === 21 || n === 28) continue;
    ok(`ANSWERS Q${n} agrees with the page`, numbersIn(ansRows[n] || ''), [...numbersIn(row(n)), ...(SUMMARY[n] || [])]);
  }
  is('ANSWERS Q21 same instance', numbersIn(ansRows[21]).join() === numbersIn(row(21)).join());
  // stage 1
  is('ANSWERS stage 1', ANSWERS.includes('**Floor $-2$**') && ANSWERS.includes('**$-3$ °C**')
    && ANSWERS.includes('Both are $-28$') && ANSWERS.includes('4. **21.**') && ANSWERS.includes('correct value is $-13$'));
  // stage 2: Beyond's own numbers, each answer the page's Answer row
  const s2 = ANSWERS.slice(ANSWERS.indexOf('### Stage 2 · Solved Examples'), ANSWERS.indexOf('### Stage 3'));
  const s2rows = [...s2.matchAll(/^(\d+)\. ([\s\S]*?)(?=^\d+\. |(?![\s\S]))/gm)];
  ok('ANSWERS stage 2 is numbered 1 to 17', s2rows.map(m => Number(m[1])), EXAMPLES.Beyond.map(e => e.tab));
  for (const m of s2rows) {
    const e = EXAMPLES.Beyond.find(x => x.tab === Number(m[1]));
    ok(`ANSWERS stage 2, Beyond Ex ${m[1]}, agrees with the page`, numbersIn(m[2]), e ? numbersIn(e.ans) : null);
  }
  is('ANSWERS does not carry the old continued numbering', !/Examples 6 to 22/.test(ANSWERS));
}

/* ---- report -------------------------------------------------- */

console.log(`\nClass 6 · Chapter 10 · The Other Side of Zero`);
console.log(`  ${checked} relations read off the pages and ANSWERS.md and evaluated`);
if (operators.length) {
  console.log(`  ${operators.length} span(s) are a bare sign used as a word in the prose, so carry no claim:`);
  const byPage = {};
  for (const o of operators) (byPage[o.where] ||= []).push('$' + o.span + '$');
  for (const [w, list] of Object.entries(byPage)) console.log(`      ${w}: ${list.join(' ')}`);
}
if (meantFalse.length) {
  console.log(`  ${meantFalse.length} span(s) printed false on purpose, and checked to be false:`);
  for (const s of meantFalse) console.log(`      ${s}`);
}
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
console.log(`  all clear\n`);
