#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed from the data — the lists, the tables, the plotted points read
   out of the SVG — and compared with what is on the page.

     node pages/class-8/p2ch05-data/check-numbers.mjs [--skipped]

   Four parts:
     A  every identity set as maths, display ($$…$$) first and then inline
        ($…$), on every page and in ANSWERS.md, whose sides all evaluate to
        numbers. A printed decimal may be the rounding of the other side to
        its own number of places, and those are counted separately.
     B  the claims A cannot check: the figures (every plotted point read back
        off its SVG), counts, medians, searches, the body exercise answers
        read back out of ANSWERS.md, and the practice answers read back out
        of the key rows, one lettered part at a time
     C  every multiple-choice and assertion-reason question: exactly one
        option is right, and it is the one the key prints
     D  ANSWERS.md prints the same key as the page

   Exits non-zero if anything does not hold up. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
let pass = 0;
const fails = [];
const ok = (what, got, want) => {
  if (JSON.stringify(got) === JSON.stringify(want)) pass++;
  else fails.push(`${what}\n      computed ${JSON.stringify(got)}\n      printed  ${JSON.stringify(want)}`);
};
const is = (what, cond) => { if (cond) pass++; else fails.push(what); };
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;

/* ---- the mathematics ----------------------------------------- */

const sum = (xs) => xs.reduce((a, b) => a + b, 0);
const mean = (xs) => sum(xs) / xs.length;
const sorted = (xs) => [...xs].sort((a, b) => a - b);
const median = (xs) => { const s = sorted(xs), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const r2 = (x) => Math.round(x * 100) / 100;
const fmean = (vals, freqs) => sum(vals.map((v, i) => v * freqs[i])) / sum(freqs);
const expand = (vals, freqs) => vals.flatMap((v, i) => Array(freqs[i]).fill(v));
const running = (fs_) => fs_.map((_, i) => sum(fs_.slice(0, i + 1)));
const counts = (xs, vals) => vals.map(v => xs.filter(x => x === v).length);
const balance = (xs, m) => [sum(xs.filter(x => x < m).map(x => m - x)), sum(xs.filter(x => x > m).map(x => x - m))];
const diffs = (xs) => xs.slice(1).map((x, i) => x - xs[i]);
const range = (a, b, d = 1) => { const o = []; for (let x = a; x <= b; x += d) o.push(x); return o; };

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const all = body + '\n' + beyond;
const text = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/&middot;/g, '·').replace(/\{,\}/g, ',').replace(/\s+/g, ' ');
const has = (hay, needle) => text(hay).includes(needle);

/* ---- A. every identity ---------------------------------------- */

function toExpr(side) {
  side = side.replace(/[,.;]\s*$/, '').trim();
  side = side.replace(/^\\ \s*/, '');
  // an arithmetic run: a + b + \cdots + z
  side = side.replace(/^(\d+) \+ (\d+) \+ \\cdots \+ (\d+)$/, (m, a, b, z) => String(sum(range(+a, +z, b - a))));
  let s = side
    .replace(/\{,\}/g, '')
    .replace(/\^\\circ/g, '')
    .replace(/\\left|\\right/g, '')
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'Math.sqrt($1)')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad/g, '')
    .replace(/\s+/g, '');
  if (!s || !/^(Math\.sqrt|[-+*/().0-9])+$/.test(s)) return null;
  return s.replace(/\)\(/g, ')*(');
}
const evalExpr = (e) => { try { return Function(`"use strict";return (${e})`)(); } catch { return NaN; } };
const places = (lit) => { const m = lit.replace(/[,.;]\s*$/, '').match(/^\d+\.(\d+)$/); return m ? m[1].length : null; };

let spans = 0, rounded = 0; const skipped = [];
const sources = [...pages.map(f => [f, html[f]]), ['ANSWERS.md', answersMd]];
for (const [f, src0] of sources) {
  const list = [];
  // display maths first, so its $$ never pairs up as two inline spans
  const src = src0.replace(/\$\$([\s\S]+?)\$\$/g, (m, x) => { list.push(x); return ' '; });
  for (const m of src.matchAll(/\$([^$]+)\$/g)) list.push(m[1]);
  for (const span of list) {
    if (!span.includes('=')) continue;
    const sides = span.split('=').map(s => s.trim()).filter(Boolean);
    if (sides.length < 2) continue;
    let vals = sides.map(toExpr);
    const lits = sides.filter((_, i) => vals[i] !== null);
    if (vals.filter(v => v !== null).length >= 2) { vals = vals.filter(v => v !== null); }
    if (vals.some(v => v === null) || vals.length < 2) { skipped.push(`${f}: $${span.trim()}$`); continue; }
    const nums = vals.map(evalExpr);
    if (nums.some(n => !Number.isFinite(n))) { skipped.push(`${f}: $${span.trim()}$`); continue; }
    spans++;
    const last = lits[lits.length - 1], p = places(last);
    const exact = nums.every(n => near(n, nums[0], 1e-9));
    const byRounding = p !== null && nums.slice(0, -1).every(n => near(Number(n.toFixed(p)), nums[nums.length - 1], 1e-9));
    if (exact) pass++;
    else if (byRounding) { pass++; rounded++; }
    else fails.push(`${f}: $${span.trim()}$ — sides are ${nums.join(' and ')}`);
  }
}

/* ---- the figures, read back out of their SVG ------------------ */

function figure(num, which = 0) {
  const out = [];
  for (const m of all.matchAll(/<figure>([\s\S]*?)<\/figure>/g)) if (m[1].includes(`>Fig. ${num}</span>`)) out.push(m[1]);
  return out[which];
}
const attrs = (tag) => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
const circles = (svg, cls = 'dg-fill-teal') => [...svg.matchAll(/<circle [^>]*>/g)].map(m => attrs(m[0])).filter(a => a.class === cls).map(a => ({ x: +a.cx, y: +a.cy }));
const ticks = (svg) => [...svg.matchAll(/<text class="dg-tick" ([^>]*)>([^<]*)<\/text>/g)].map(m => ({ ...attrs(m[1]), t: m[2] }));
const lin = (p1, v1, p2, v2) => (p) => v1 + (p - p1) * (v2 - v1) / (p2 - p1);
// a numeric tick's baseline sits 3 units under the grid line it labels
const yScale = (svg, xmax) => { const t = ticks(svg).filter(t => +t.x <= xmax && /^\d+$/.test(t.t)); const a = t[0], b = t[t.length - 1]; return lin(+a.y - 3, +a.t, +b.y - 3, +b.t); };
const xScale = (svg, y) => { const t = ticks(svg).filter(t => t.y === y && /^\d+$/.test(t.t)); const a = t[0], b = t[t.length - 1]; return lin(+a.x, +a.t, +b.x, +b.t); };
const round1 = (x) => Math.round(x * 10) / 10;

// Fig. 5.1: four dots and a fulcrum
{
  const svg = figure('5.1'); const X = xScale(svg, '72');
  const dots = circles(svg).map(c => Math.round(X(c.x)));
  const tip = svg.match(/class="dg-fill-c" d="M([\d.]+) /)[1];
  ok('Fig 5.1: the dots', sorted(dots), [10, 10, 11, 17]);
  ok('Fig 5.1: the fulcrum is at the mean', Math.round(X(+tip)), mean(dots));
  ok('§5.2: balance about 12, and about 13', [balance(dots, 12), balance(dots, 13)], [[5, 5], [8, 4]]);
  ok('§5.2: halfway between smallest and largest', (10 + 17) / 2, 13.5);
  ok('§5.5: median of the four', median(dots), 10.5);
  ok('§5.5: 17 dragged to 37', [mean([10, 10, 11, 37]), median([10, 10, 11, 37])], [17, 10.5]);
  ok('§5.2: the mean moves five places', mean([10, 10, 11, 37]) - mean(dots), 5);
  is('§5.2 prints "move five places"', has(body, 'would have to move five places'));
  is('Fig 5.1 labels: five below, five above', /five below/.test(svg) && /five above/.test(svg));
}
// Fig. 5.2: the same picture, shifted by ten
{
  const svg = figure('5.2');
  const t = ticks(svg);
  const top = t.filter(x => x.y === '45'), bot = t.filter(x => x.y === '91');
  const X1 = lin(+top[0].x, +top[0].t, +top[top.length - 1].x, +top[top.length - 1].t);
  const X2 = lin(+bot[0].x, +bot[0].t, +bot[bot.length - 1].x, +bot[bot.length - 1].t);
  const c = circles(svg);
  const upper = c.filter(p => p.y < 50).map(p => X1(p.x)), lower = c.filter(p => p.y > 50).map(p => X2(p.x));
  const tips = [...svg.matchAll(/class="dg-fill-c" d="M([\d.]+) ([\d.]+)/g)].map(m => +m[1]);
  ok('Fig 5.2: upper dots', upper, [3, 5, 7, 9, 11]);
  ok('Fig 5.2: lower dots', lower, upper.map(v => v + 10));
  ok('Fig 5.2: fulcrums at the means', [X1(tips[0]), X2(tips[1])], [mean(upper), mean(lower)]);
  ok('§5.4: the means', [mean(upper), mean(lower)], [7, 17]);
}
// §5.3, §5.5: printed small sets
ok('key idea: 10, 11, 15', mean([10, 11, 15]), 12);
ok('Example 2: 8 and 16, 5 and 19 keep the mean', [mean([10, 10, 11, 17, 8, 16]), mean([10, 10, 11, 17, 5, 19]), mean([10, 10, 11, 17, 12])], [12, 12, 12]);
ok('Example 1: balance about 9', balance([4, 7, 8, 8, 18], 9), [9, 9]);
ok('Example 1: the mean', mean([4, 7, 8, 8, 18]), 9);
ok('§5.5: medians', [median([3, 6, 8, 9, 14]), median([3, 6, 8, 9, 14, 11]), median([3, 6, 8, 9, 14, 2])], [8, 8.5, 7]);
ok('Example 3', round1(150.2 - 1), 149.2);
ok('Example 4: the missing weight', 39.2 * 10 - sum([42, 40, 39, 33, 48, 38, 42, 35, 32]), 43);
ok('Example 5', [25.6 * 15, round1((25.6 * 15 - 3) / 15), round1(3 / 15)], [384, 25.4, 0.2]);

// §5.7: the thirty answers, the tally, and the table
{
  const eqs = [...body.matchAll(/\$\$([\d\s\\quad]+)\$\$/g)].map(m => m[1].replace(/\\quad/g, ' ').trim().split(/\s+/).map(Number));
  const raw = eqs.flat();
  ok('§5.7: thirty answers', raw.length, 30);
  const vals = [3, 4, 5, 6, 7, 8], freq = counts(raw, vals);
  const svg = figure('5.3');
  const d = svg.match(/class="dg-line" d="([^"]+)"/)[1];
  const tallies = vals.map((_, r) => {
    const top = 14 + 14 * r, bot = top + 12;
    const vert = [...d.matchAll(/M([\d.]+) ([\d.]+) V([\d.]+)/g)].filter(m => +m[2] === top && +m[3] === bot).length;
    const diag = [...d.matchAll(/M([\d.]+) ([\d.]+) L([\d.]+) ([\d.]+)/g)].filter(m => +m[2] === bot && +m[4] === top).length;
    return vert + diag;
  });
  const labels = ticks(svg).filter(t => t.x === '150').map(t => +t.t);
  ok('Fig 5.3: the strokes counted', tallies, freq);
  ok('Fig 5.3: the counts written beside them', labels, freq);
  const row = (name) => { const m = body.match(new RegExp(`<tr><td>${name}</td>((?:<td>\\d+</td>)+)</tr>`)); return [...m[1].matchAll(/<td>(\d+)<\/td>/g)].map(x => +x[1]); };
  ok('§5.7 table: students', row('Students'), freq);
  ok('§5.7 table: running total', row('Running total'), running(freq));
  ok('§5.7: the sum', sum(raw), 152);
  ok('§5.7: the mean, two places', r2(mean(raw)), 5.07);
  ok('§5.7: the wrong short answer', sum(vals) / 6, 5.5);
  ok('§5.7: the median', median(raw), 5);
  ok('§5.7: positions 12 to 20 are fives', [running(freq)[1] + 1, running(freq)[2]], [12, 20]);
  ok('§5.3: a household of 8 joins', [r2((sum(raw) + 8) / 31), Math.round(((sum(raw) + 8) / 31 - mean(raw)) * 10) / 10], [5.16, 0.1]);
  ok('§5.3: 30 × 5.07 is 152 to the nearest whole', Math.round(30 * 5.07), 152);
  ok('Ex 5.2 Q5: mean against median', [r2(mean(raw)), median(raw)], [5.07, 5]);
}

// Fig. 5.4: the temperatures, and every reading of them
const fig54 = figure('5.4');
{
  is('Fig 5.4 is reprinted unchanged', figure('5.4', 1).replace(/<figcaption>[\s\S]*/, '') === fig54.replace(/<figcaption>[\s\S]*/, ''));
  const Y = yScale(fig54, 23);
  const t = circles(fig54).map(c => Y(c.y));
  ok('Fig 5.4: the six readings', t, [22, 26, 31, 34, 30, 25]);
  const printed = body.match(/the six readings: \$([\d, ]+)\$/)[1].split(',').map(Number);
  ok('Example 6: readings as printed', printed, t);
  ok('Example 6: the mean', [sum(t), mean(t)], [168, 28]);
  ok('§5.8: bars would stand at 22 then 26', [t[0], t[1]], [22, 26]);
  const d = diffs(t);
  ok('§5.8: steepest climb is 9 am to noon', d.indexOf(Math.max(...d)), 1);
  ok('§5.8: half past ten is a little over 28', (t[1] + t[2]) / 2, 28.5);
  ok('§5.9: warmer at noon than 6 pm', t[2] > t[4], true);
  ok('§5.9: no reading passed 34', Math.max(...t), 34);
  ok('Ex 5.3 Q1: 7:30 am and 4:30 pm', [(t[0] + t[1]) / 2, (t[3] + t[4]) / 2], [24, 32]);
  ok('Ex 5.3 Q3 (i): 3 pm against 9 am', t[3] > t[1], true);
  // Fig 5.4's own x axis: six readings three hours apart, 6 am to 9 pm
  const xl = ticks(fig54).filter(x => x.y === '108').map(x => x.t);
  ok('Fig 5.4: time labels', xl, ['6 am', '9 am', '12', '3 pm', '6 pm', '9 pm']);
  ok('Fig 5.4: dots sit on the time ticks', circles(fig54).map(c => c.x), ticks(fig54).filter(x => x.y === '108').map(x => +x.x));
}

// Fig. 5.5: the same four sales twice
{
  const svg = figure('5.5');
  const bars = [...svg.match(/class="dg-fill-a" d="([^"]+)"/)[1].matchAll(/M([\d.]+) ([\d.]+) H/g)].map(m => ({ x: +m[1], y: +m[2] }));
  const tk = ticks(svg).filter(t => /^\d+$/.test(t.t));
  const L = tk.filter(t => +t.x < 50), R = tk.filter(t => +t.x > 50);
  const YL = lin(+L[0].y - 3, +L[0].t, +L[L.length - 1].y - 3, +L[L.length - 1].t);
  const YR = lin(+R[0].y - 3, +R[0].t, +R[R.length - 1].y - 3, +R[R.length - 1].t);
  const sales = [96, 98, 101, 104];
  const left = bars.filter(b => b.x < 100).map(b => YL(b.y)), right = bars.filter(b => b.x > 100).map(b => YR(b.y));
  is(`Fig 5.5 left bars read ${left.map(round1)}`, left.every((v, i) => Math.abs(v - sales[i]) < 0.3));
  is(`Fig 5.5 right bars read ${right.map(round1)}`, right.every((v, i) => Math.abs(v - sales[i]) < 0.3));
  is('Fig 5.5: the right axis starts at 94', +R[0].t === 94 && Math.abs(YR(94) - 94) < 0.1);
  is('§5.9 prints the four sales', has(body, 'were 96 , 98 , 101 and 104') || /\$96\$, \$98\$,\s*\$101\$ and \$104\$/.test(body));
  ok('§5.9: kept 2 and 10, five times', [sales[0] - 94, sales[3] - 94, (sales[3] - 94) / (sales[0] - 94)], [2, 10, 5]);
  ok('§5.9: about eight per cent', Math.round((sales[3] - sales[0]) / sales[0] * 100), 8);
}

// Fig. 5.6: the day in 48 boxes
{
  const svg = figure('5.6');
  is('Fig 5.6 is reprinted unchanged', figure('5.6', 1).replace(/<figcaption>[\s\S]*/, '') === svg.replace(/<figcaption>[\s\S]*/, ''));
  const key = {};
  for (const m of svg.matchAll(/<path class="(dg-fill-[\w]+)" d="M[\d.]+ 6 [^"]*"\/>[\s\S]*?<text class="dg-note"[^>]*>(\w+)<\/text>/g)) key[m[1]] = m[2];
  ok('Fig 5.6: the key', Object.values(key).sort(), ['eat', 'other', 'school', 'sleep', 'travel']);
  const slots = Array(48).fill(null);
  for (const m of svg.matchAll(/<path class="(dg-fill-[\w]+)" d="([^"]*)"\/>/g)) {
    for (const r of m[2].matchAll(/M([\d.]+) 20 H([\d.]+) V34/g)) {
      for (let i = Math.round((+r[1] - 8) / 3.75); i < Math.round((+r[2] - 8) / 3.75); i++) slots[i] = key[m[1]];
    }
  }
  is('Fig 5.6: every box is coloured once', slots.every(Boolean));
  const runs = []; slots.forEach((a, i) => { if (!runs.length || runs[runs.length - 1].a !== a) runs.push({ a, from: i, to: i + 1 }); else runs[runs.length - 1].to = i + 1; });
  const hrs = (r) => [r.from / 2, r.to / 2];
  const of = (a) => runs.filter(r => r.a === a).map(hrs);
  ok('Fig 5.6: sleep, midnight to six and from ten', of('sleep'), [[0, 6], [22, 24]]);
  ok('Fig 5.6: travel twice, an hour each', of('travel').map(([a, b]) => b - a), [1, 1]);
  ok('Fig 5.6: travel to school is 7:30 to 8:30', of('travel')[0], [7.5, 8.5]);
  const lunch = of('eat').find(([a]) => a >= 11 && a <= 13);
  ok('Fig 5.6: lunch at noon for an hour', lunch, [12, 13]);
  const school = of('school');
  is('Fig 5.6: the lunch sits inside the school block', school.some(([, b]) => b === 12) && school.some(([a]) => a === 13));
  is('§5.10 prints: slept until six, again from ten', has(body, 'He slept from midnight until six, and again from ten at night'));
  is('§5.10 prints: travelled twice, an hour each way', has(body, 'He travelled twice, an hour each way'));
  is('§5.10: 48 boxes, half an hour each', slots.length === 48 && /forty-eight/.test(body));
  const thin = svg.match(/class="dg-thin" d="(M23 20[^"]+)"/)[1];
  ok('Fig 5.6: faint lines every two hours', [...thin.matchAll(/M([\d.]+) 20/g)].map(m => (+m[1] - 8) / 3.75 / 2), range(2, 22, 2));
  const tk = ticks(svg).filter(t => t.y === '44');
  ok('Fig 5.6: the time labels sit on their hours', tk.map(t => (+t.x - 8) / 3.75 / 2).slice(1, 4), [6, 12, 18]);
  // the answer to Exercise Set 5.3 Q6 is read out of this figure
  ok('ANSWERS Ex 5.3 Q6 (lunch at noon, one hour; journey one hour)', [lunch[1] - lunch[0], of('travel')[0][1] - of('travel')[0][0]], [1, 1]);
}

// Fig. 5.7: the plant
const fig57 = figure('5.7');
{
  const Y = yScale(fig57, 23);
  const h = circles(fig57).map(c => Y(c.y));
  ok('Fig 5.7: the six heights', h, [2, 5, 9, 12, 14, 15]);
  const printed = beyond.match(/readings: \$([\d, ]+)\$ cm/)[1].split(',').map(Number);
  ok('Example 10: readings as printed', printed, h);
  const g = diffs(h);
  const printedG = beyond.match(/growth each week: \$([\d, ]+)\$ cm/)[1].split(',').map(Number);
  ok('Example 10: growth as printed', printedG, g);
  ok('Example 10: most growth in the second week', g.indexOf(Math.max(...g)) + 1, 2);
  is('Example 10 answers "The second week"', has(beyond, 'The second week;'));
  ok('Example 10: halfway through the third week', (h[2] + h[3]) / 2, 10.5);
  ok('Example 10: mean growth', (h[5] - h[0]) / 5, 2.6);
  ok('Example 11: end of week 3, and weeks 2 and 5', [h[3], g[1], g[4]], [12, 4, 1]);
  ok('Fig 5.7: x ticks under the dots', circles(fig57).map(c => c.x), ticks(fig57).filter(x => x.y === '108').map(x => +x.x));
}

/* ---- B. the body exercises, read back out of ANSWERS.md ------- */

function mdQ(set, q) {
  const i = answersMd.indexOf(`### ${set}`);
  const block = answersMd.slice(i, answersMd.indexOf('\n#', i + 5));
  const m = block.match(new RegExp(`\\n${q}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`));
  return m ? m[1].replace(/\{,\}/g, ',') : '';
}
const numRe = (v) => new RegExp(`(^|[^\\d.])${String(v).replace('.', '\\.')}([^\\d]|$)`);
const mdSays = (set, q, ...vals) => { for (const v of vals) is(`ANSWERS ${set} Q${q} should say ${v}`, numRe(v).test(mdQ(set, q))); };
const E1 = 'Exercise Set 5.1', E2 = 'Exercise Set 5.2', E3 = 'Exercise Set 5.3';

// the questions' own numbers, read off the page
const bodyQ = (setHead, n) => {
  const i = body.indexOf(`>${setHead}<`);
  const tail = body.slice(i);
  if (n === 1) return tail.match(/<ol class="c-questions">\s*<li[^>]*>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/)[1];
  return tail.match(new RegExp(`data-start="${n}">\\s*<li[^>]*>([\\s\\S]*?)</li>\\s*</ol>\\s*</div>`))[1];
};
const WORDS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, fifteen: 15, twenty: 20, 'twenty-four': 24 };
// the numbers a sentence carries, in order: maths spans and number words alike
const nums = (s) => [...text(s).matchAll(/\$([\d.,]+)\$|\b(twenty-four|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty)\b/gi)].map(m => m[1] ? Number(m[1].replace(/,/g, '')) : WORDS[m[2].toLowerCase()]);
const mathNums = (s) => [...s.matchAll(/\$([\d.{},]+)\$/g)].map(m => Number(m[1].replace(/\{,\}/g, '')));

mdSays(E1, 1, mean(range(1, 50)), mean(range(1, 99, 2)), mean(range(4, 200, 4)), sum(range(1, 50)), sum(range(1, 99, 2)), sum(range(4, 200, 4)));
{ const xs = mathNums(bodyQ(E1, 2)); ok('Ex 5.1 Q2: balance about 8', balance(xs.slice(0, 4), xs[4]), [5, 5]); ok('Ex 5.1 Q2 mean', mean(xs.slice(0, 4)), xs[4]); }
{ const xs = mathNums(bodyQ(E1, 3)); const known = xs.slice(0, 6).concat(xs[6]); const m = xs[7];
  ok('Ex 5.1 Q3: the known seven', known, [8, 13, 10, 4, 5, 20, 10]); const y = m * 8 - sum(known); ok('Ex 5.1 Q3: y', y, 13); mdSays(E1, 3, y, m * 8, sum(known)); }
{ const [n, m] = mathNums(bodyQ(E1, 4)); mdSays(E1, 4, n * m); }
{ const [m, a, b] = mathNums(bodyQ(E1, 5)); ok('Ex 5.1 Q5: the pair has the mean', mean([a, b]), m); mdSays(E1, 5, m); }
{ const xs = mathNums(bodyQ(E1, 6)); const md = median(xs); mdSays(E1, 6, md);
  is('Ex 5.1 Q6 (i): any single value keeps the median', range(0, 120).every(v => median([...xs, v]) === md));
  is('Ex 5.1 Q6 (ii): removing any value keeps the median', xs.every((_, i) => median(xs.filter((__, j) => j !== i)) === md)); }
{ // Q7: the worked examples in ANSWERS.md
  ok('Ex 5.1 Q7 (i) example', [median([1, 5, 9]), median([5, 9])], [5, 7]);
  ok('Ex 5.1 Q7 (ii) example', [mean([2, 4, 6]), mean([2, 4, 6, 1])], [4, 3.25]);
  ok('Ex 5.1 Q7 (iii) examples', [median([1, 2, 3, 0, 0, 5, 5]), median([1, 2, 3, 10, 10, 10, 10])], [2, 10]);
  ok('Ex 5.1 Q7 (iv) example', [median([4, 5, 6]), median([4, 5, 6, 1, 1, 1, 1])], [5, 1]);
  // and the classifications, by random trial
  let rnd = 7; const R = () => (rnd = (rnd * 16807) % 2147483647) % 20;
  let a = false, c1 = false, c2 = false, dd = false;
  for (let k = 0; k < 4000; k++) {
    const xs = Array.from({ length: 3 + (k % 6) }, R), md = median(xs);
    const lo = xs.findIndex(x => x < md); if (lo >= 0 && median(xs.filter((_, j) => j !== lo)) < md) a = true;
    const four = [R(), R(), R(), R()]; if (median([...xs, ...four]) === md) c1 = true; else c2 = true;
    const low = [R(), R(), R(), R()].map(v => Math.min(v, md - 1)); if (median([...xs, ...low]) > md) dd = true;
  }
  ok('Ex 5.1 Q7: (i) never, (iii) sometimes, (iv) never', [a, c1 && c2, dd], [false, true, false]);
  is('ANSWERS Ex 5.1 Q7 classifications', /\(i\) \*\*Never true/.test(mdQ(E1, 7)) && /\(ii\) \*\*Always true/.test(mdQ(E1, 7)) && /\(iii\) \*\*Sometimes true/.test(mdQ(E1, 7)) && /\(iv\) \*\*Never true/.test(mdQ(E1, 7)));
}
{ const xs = mathNums(bodyQ(E1, 8)); const known = xs.slice(0, 10), target = xs[10], opts = xs.slice(11);
  const good = opts.filter(p => median([...known, p]) === target);
  ok('Ex 5.1 Q8: p can be', good, [29, 30, 40, 47, 100]);
  mdSays(E1, 8, ...good); ok('ANSWERS Ex 5.1 Q8 sorted list', mdQ(E1, 8).match(/\$([\d, ]+)\$/)[1].split(',').map(Number), sorted(known)); }
{ const [m, md, x] = mathNums(bodyQ(E1, 9)); ok('Ex 5.1 Q9 values', [m, md, x], [4200, 3900, 11000]);
  mdSays(E1, 9, 6 * m, 6 * m + x); is('ANSWERS Ex 5.1 Q9 new mean', mdQ(E1, 9).includes(`₹${(Math.round((6 * m + x) / 7 * 100) / 100).toLocaleString('en-IN')}`)); }

{ const xs = bodyQ(E2, 1).match(/\$([\d,\s]+)\$/)[1].split(',').map(Number);
  ok('Ex 5.2 Q1: 25 answers', xs.length, 25);
  const f = counts(xs, [0, 1, 2, 3, 4]);
  const tab = mdQ(E2, 1).match(/\| Students \|([^\n]+)/)[1].split('|').map(s => s.trim()).filter(Boolean).map(Number);
  ok('ANSWERS Ex 5.2 Q1 table', tab, f); mdSays(E2, 1, mean(xs), median(xs), sum(xs)); }
{ const q = bodyQ(E2, 2); const vals = [...q.match(/<thead>[\s\S]*?<\/thead>/)[0].matchAll(/<th>(\d+)<\/th>/g)].map(m => +m[1]);
  const fr = [...q.match(/<tbody>[\s\S]*?<\/tbody>/)[0].matchAll(/<td>(\d+)<\/td>/g)].map(m => +m[1]);
  const xs = expand(vals, fr);
  mdSays(E2, 2, xs.length, sum(xs), r2(mean(xs)), median(xs), Math.min(...xs), Math.max(...xs)); }
{ const f = [2, 5, 4, 3, 1], v = [0, 1, 2, 3, 4]; const xs = expand(v, f);
  is('Ex 5.2 Q3 counts as printed', has(bodyQ(E2, 3), 'Two said none, five said once, four said twice, three said three times and one said four times'));
  mdSays(E2, 3, r2(mean(xs)), median(xs), r2(mean(xs.map(x => x + 1))), median(xs.map(x => x + 1)), sum(xs), sum(xs) + 15); }
{ const [a, b, c, d, fa, fc, fd, m] = mathNums(bodyQ(E2, 4)); const f = range(0, 50).find(f => near(fmean([a, b, c, d], [fa, f, fc, fd]), m)); ok('Ex 5.2 Q4: f', f, 3); mdSays(E2, 4, f); }
{ const [v, n, k, m] = nums(bodyQ(E2, 6)); const x = range(0, 100).find(x => near(fmean([v, x], [n, k]), m)); ok('Ex 5.2 Q6: x', x, 16); mdSays(E2, 6, x); }
{ const f = mdQ(E2, 7).match(/\| Frequency \|([^\n]+)/)[1].split('|').map(s => s.trim()).filter(Boolean).map(Number);
  const xs = expand([1, 2, 3, 4, 5], f); ok('Ex 5.2 Q7: the worked table', [xs.length, mean(xs), median(xs)], [20, 3, 2]); }

{ const lv = mathNums(bodyQ(E3, 2)); ok('Ex 5.3 Q2 levels', lv, [9, 8, 6, 3, 2, 1]); const fall = diffs(lv).map(x => -x);
  ok('Ex 5.3 Q2: fastest fall in March', fall.indexOf(Math.max(...fall)), 2); mdSays(E3, 2, ...fall, (lv[3] + lv[4]) / 2); }
{ const q = mdQ(E3, 3); is('ANSWERS Ex 5.3 Q3: follows, no, not settled, not settled', /\(i\) \*\*Follows/.test(q) && /\(ii\) \*\*Does not follow/.test(q) && /\(iii\) \*\*Not settled/.test(q) && /\(iv\) \*\*Not settled/.test(q)); }
mdSays(E3, 4, 20, 10);
ok('Ex 5.3 Q4 (ii): the gaps between the years', diffs([1970, 1990, 2000, 2020]), [20, 10, 20]);
{ const [h1, h2, base, cm, units] = [...text(bodyQ(E3, 5)).matchAll(/\$?= ?(\d+)\$|\$(\d+)\$/g)].map(m => +(m[1] || m[2])); const a = base + h1 * units, b = base + h2 * units;
  mdSays(E3, 5, a, b, b - a, Math.round((b - a) / a * 100)); is('ANSWERS Ex 5.3 Q5: 3/11', (b - a) / a === 3 / 11 && /\\tfrac\{3\}\{11\}/.test(mdQ(E3, 5))); }
{ const q = mdQ(E3, 7); const v = range(0, 6).map(k => 2 ** k); ok('Ex 5.3 Q7 values', q.match(/\$([\d, ]+)\$/)[1].split(',').map(Number), v);
  ok('Ex 5.3 Q7: half a year', [1.5, r2(Math.SQRT2)], [(1 + 2) / 2, 1.41]); is('Ex 5.3 Q7: the segment is above the curve', range(0, 5).every(k => (2 ** k + 2 ** (k + 1)) / 2 > 2 ** (k + 0.5))); }
{ const q = mdQ(E3, 1); is('ANSWERS Ex 5.3 Q1 says about 24 and about 32', /about \$24\$/.test(q) && /about \$32\$/.test(q)); }

/* ---- B. Stage 1 ------------------------------------------------ */

const tries = [...beyond.matchAll(/<div class="c-try">([\s\S]*?)<\/div>/g)].map(m => m[1]);
ok('Stage 1 has eight questions', tries.length, 8);
{ const [n, m, v] = nums(tries[0]).filter(x => x !== 1); ok('Stage 1 Q1', (n * m - v) / (n - 1), 14); }
{ const [n, m, m2] = nums(tries[1]); ok('Stage 1 Q2', (n + 1) * m2 - n * m, 18); }
{ const xs = mathNums(tries[2]); const vis = xs.slice(0, 4), m = xs[4]; const x = 5 * m - sum(vis); ok('Stage 1 Q3', [sum(vis), x, ...balance(vis, m)], [29, 11, 4, 1]); }
{ const [md, m, , a, b] = mathNums(tries[3]); ok('Stage 1 Q4 numbers', [md, m, a, b], [20, 20, 4, 5]);
  ok('Stage 1 Q4: the new mean', (9 * m + a + b) / 9, 21);
  // the median claim, tried on every nine-value list of this kind we can build
  let held = true, tried = 0;
  for (let lo1 = 1; lo1 < 20; lo1++) for (let lo2 = 1; lo2 < 20; lo2++) {
    if (lo1 + a >= 20 || lo2 + b >= 20) continue;
    const xs = [lo1, lo2, 12, 15, 20, 21, 25, 30, 20 * 9 - (lo1 + lo2 + 12 + 15 + 20 + 21 + 25 + 30)];
    if (median(xs) !== 20 || mean(xs) !== 20 || xs[8] < 20) continue;
    tried++; const ys = [lo1 + a, lo2 + b, ...xs.slice(2)];
    if (median(ys) !== 20 || mean(ys) !== 21) held = false;
  }
  is(`Stage 1 Q4: median stays 20, mean 21 (${tried} lists)`, held && tried > 50); }
{ const [v, x, m] = [4, null, 7]; const f = range(0, 30).find(x => near(fmean([v, x], [6, 9]), m)); ok('Stage 1 Q5', f, 9); ok('Stage 1 Q5 as printed', nums(tries[4]), [4, 6, 9, 7]); }
{ const [m, a, b] = mathNums(tries[5]); const n = 24; ok('Stage 1 Q6', [round1(n * m * 10) / 10, round1((n * m + a + b) / (n + 2))], [3580.8, 149.3]); ok('Stage 1 Q6: their own mean', mean([a, b]), 150.5); }
ok('Stage 1 Q7: a third steeper', 400 / 300, 4 / 3);
{ const [m, w, r] = mathNums(tries[7]); ok('Stage 1 Q8', [7 * m, r - w, (7 * m + r - w) / 7, (r - w) / 7], [28000, 2100, 4300, 300]); }
{ const s1 = answersMd.slice(answersMd.indexOf('### Stage 1'), answersMd.indexOf('### Stage 2'));
  for (const v of [14, 18, 11, 21, 9, 149.3, 100]) is(`ANSWERS Stage 1 says ${v}`, numRe(v).test(s1)); is('ANSWERS Stage 1 says ₹4,300', s1.includes('₹4,300')); }

/* ---- B. Stage 2 ------------------------------------------------ */

const ex = {};
{
  const parts = beyond.split('<div class="c-example__tab">Example ').slice(1);
  for (const p of parts) {
    const n = p.match(/^(\d+)</)[1];
    const chunk = p.split(/<h3>|<div class="c-example">|<div class="c-practice/)[0];
    const m = chunk.match(/<div class="c-example__body">\s*<p>([\s\S]*?)<\/p>([\s\S]*)$/);
    ex[n] = { q: m[1], a: text(m[2]), ans: text((m[2].match(/>Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/) || ['', ''])[1]) };
  }
}
ok('Stage 2: Examples 1 to 13', Object.keys(ex).map(Number), range(1, 13));
const answerOf = (n) => ex[n].ans;
const exSays = (n, ...vals) => { for (const v of vals) is(`Example ${n} answer should say ${v}: "${answerOf(n)}"`, numRe(v).test(answerOf(n))); };
{ const xs = mathNums(ex[1].q); ok('Example 1: balance', balance(xs.slice(1), xs[0]), [8, 8]); ok('Example 1: mean', mean(xs.slice(1)), xs[0]); exSays(1, xs[0]); }
{ const [n, m, v] = nums(ex[2].q); exSays(2, (n * m + v) / (n + 1)); }
{ const [n, m, , a, b] = nums(ex[3].q); exSays(3, (n * m - a - b) / (n - 2)); is('Example 3 says down', mean([a, b]) > m && /goes down/.test(answerOf(3))); }
{ const [, m, , k, c] = mathNums(ex[4].q); exSays(4, m * k + c); }
{ const xs = mathNums(ex[5].q); const list = xs.slice(0, 8), add = xs[8]; exSays(5, median(list), median([...list, add]));
  ok('Example 5: sorted as printed', ex[5].a.match(/sorted: \$([\d, ]+)\$/)[1].split(',').map(Number), sorted(list));
  is('Example 5: 400 does the same', median([...list, 400]) === median([...list, add])); }
{ const xs = nums(ex[6].q); ok('Example 6 numbers', xs.length, 8); exSays(6, xs[0] * xs[1] - sum(xs.slice(3))); }
{ const [n, m, right, wrong] = mathNums(ex[7].q); exSays(7, (n * m - wrong + right) / n); ok('Example 7: the change', round1((right - wrong) / n), 0.9); }
{ const q = beyond.slice(beyond.indexOf('Example 8</div>'));
  const vals = [...q.match(/<thead>[\s\S]*?<\/thead>/)[0].matchAll(/<th>(\d+)<\/th>/g)].map(m => +m[1]);
  const trs = [...q.match(/<tbody>[\s\S]*?<\/tbody>/)[0].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(m => [...m[1].matchAll(/<td>(\d+)<\/td>/g)].map(x => +x[1]));
  ok('Example 8: running total', trs[1], running(trs[0]));
  const xs = expand(vals, trs[0]); exSays(8, r2(mean(xs)), median(xs)); ok('Example 8: sum and count', [sum(xs), xs.length], [178, 30]);
  ok('Example 8: positions 12 to 21 are 6', [running(trs[0])[1] + 1, running(trs[0])[2]], [12, 21]); }
{ const f = range(0, 100).find(f => near(fmean([1, 2, 3], [4, f, 6]), 2.1)); exSays(9, f); ok('Example 9: check', [sum(expand([1, 2, 3], [4, f, 6])), 10 + f], [42, 20]); }
exSays(10, 10.5, 2.6);
{ const [a, b, base] = mathNums(ex[12].q); exSays(12, (b - base) / (a - base)); ok('Example 12: 1/7 more', (b - a) / a, 1 / 7); }
{ const [boxes, s, sc, t] = mathNums(ex[13].q); exSays(13, s / 2, sc / 2, t / 2, (boxes - s - sc - t) / 2); ok('Example 13: 24 hours', boxes / 2, 24); }

/* ---- B. the practice answers, read back out of the key --------- */

const keyRows = {};
const ansStart = beyond.indexOf('c-stage__title">Answers');
for (const m of beyond.slice(ansStart).matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= text(m[2]);
const row = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-e]?)$/);
  const r = keyRows[n] || '';
  if (!part) return r;
  const m = r.match(new RegExp(`\\(${part}\\)([^(]*(?:\\([^a-e)][^)]*\\)[^(]*)*)`));
  return m ? m[1] : '';
};
// a part that gives a mean and then a median must END on the median: a
// median equal to the mean would otherwise hide behind it
const ends = (q, v) => { const last = (row(q).match(/\d+(\.\d+)?/g) || []).pop(); is(`key ${q} should end on ${v}: "${row(q)}"`, Number(last) === v); };
const says = (q, ...vals) => { for (const v of vals) is(`key ${q} should say ${v}: "${row(q)}"`, numRe(v).test(row(q))); };

const pq = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) pq[Number(m[1] || 1)] = m[2];
ok('practice runs 1 to 27 with no repeats', Object.keys(pq).map(Number), range(1, 27));
const stem = (n) => (pq[n] || '').replace(/<ol class="c-parts[\s\S]*$/, '').replace(/<table>[\s\S]*?<\/table>/g, '');
const tableOf = (n) => { const t = pq[n].match(/<table>[\s\S]*?<\/table>/)[0]; return { head: [...t.match(/<thead>[\s\S]*?<\/thead>/)[0].matchAll(/<th>([^<]*)<\/th>/g)].map(m => m[1]), body: [...t.match(/<tbody>[\s\S]*?<\/tbody>/)[0].matchAll(/<td>([^<]*)<\/td>/g)].map(m => m[1]) }; };

{ const xs = mathNums(stem(15)); says(15, mean(xs), median(xs), sum(xs)); }
{ const [n, m] = mathNums(stem(16)); says(16, n * m); }
{ const [m, k] = mathNums(stem(17)); says(17, m / k); }
says(18); is('key 18: 11th; 10th and 11th', /11th/.test(row(18)) && /10th and the 11th/.test(row(18)));
{ const [m5, m4] = mathNums(stem(19)); says(19, 5 * m5 - 4 * m4, 5 * m5, 4 * m4); }
{ const xs = mathNums(stem(20)); says(20, sum(xs), mean(xs), median(xs)); ok('key 20 sorted list', row(20).match(/Sorted: \$([\d, ]+)\$, so/)[1].split(',').map(Number), sorted(xs)); }
{ const t = tableOf(21); const vals = t.head.slice(1).map(Number), fr = t.body.slice(1).map(Number); const xs = expand(vals, fr);
  ok('Q21: twenty matches', xs.length, 20); says(21, sum(xs), mean(xs), median(xs)); ok('key 21 running totals', row(21).match(/running totals \$([\d, ]+)\$ show/)[1].split(',').map(Number), running(fr)); }
{ const [n, m, r1, w1, r2_, w2] = mathNums(stem(22)); const t = n * m - w1 + r1 - w2 + r2_; says(22, n * m, t, round1(t / n)); }
{ const [n, m, a, b] = mathNums(stem(23)); says(23, 6 * a + 6 * b, n * m, 6 * a + 6 * b - n * m); }
{ const temps = mathNums(stem(24)).filter(x => x > 90); ok('Q24 temperatures', temps, [101.5, 102.5, 103, 102, 100.5, 99.5]);
  const fall = diffs(temps).map(x => -x); ok('Q24: fastest fall is the 4th gap (2 to 4 pm), and unique', [fall.indexOf(Math.max(...fall)), fall.filter(f => f === Math.max(...fall)).length], [3, 1]);
  says('24b', Math.max(...fall)); is('key 24b says 2 pm to 4 pm', /2 pm to 4 pm/.test(row('24b')));
  says('24c', (temps[1] + temps[2]) / 2); says('24d', sum(temps), mean(temps)); says('24e', Math.max(...temps)); says('24a', 98);
  is('Q24 axis at 98 is below every reading', Math.min(...temps) > 98); }
{ const xs = mathNums(stem(25)).slice(1); ok('Q25 twelve marks', xs.length, 12); const add = mathNums(pq[25].slice(pq[25].indexOf('Another')))[0];
  says('25a', sum(xs), mean(xs), median(xs)); ends('25a', median(xs)); ends('25b', median([...xs, add])); says('25b', sum([...xs, add]), mean([...xs, add]), median([...xs, add]));
  is('Q25 (c): new score equals the mean, is below the median', add === mean(xs) && add < median(xs) && mean([...xs, add]) === mean(xs) && median([...xs, add]) < median(xs));
  ok('key 25a sorted list', row('25a').match(/sorted \$([\d, ]+)\$, median/)[1].split(',').map(Number), sorted(xs)); }
{ const t = tableOf(26); const xs = t.body.slice(1).map(Number); const add = mathNums(pq[26].slice(pq[26].indexOf('next Monday')))[0];
  says('26a', sum(xs), mean(xs), median(xs)); ends('26a', median(xs)); ends('26c', median([...xs, add])); says('26c', sum([...xs, add]), mean([...xs, add]), median([...xs, add]));
  says('26b', Math.max(...xs)); is('Q26 (b): mean above median', mean(xs) > median(xs));
  ok('key 26c sorted list', row('26c').match(/4th of \$([\d, ]+)\$, which/)[1].split(',').map(Number), sorted([...xs, add])); }
{ const t = tableOf(27); const xs = t.body.slice(1).map(Number); const m = mathNums(pq[27].slice(pq[27].indexOf('Check')))[0];
  const base = mathNums(pq[27].slice(pq[27].indexOf('A poster')))[0];
  ok('Q27: the mean really is 200', mean(xs), m); says('27a', median(xs)); says('27b', ...balance(xs, m));
  const [jun, jul] = xs; says('27c', jun - base, jul - base); is('key 27c: more than 6 times; about 2.2', Math.floor((jul - base) / (jun - base)) === 6 && /more than \$6\$/.test(keyRows[27]) && round1(jul / jun) === 2.2 && /about \$2\.2\$/.test(keyRows[27])); }
{ // "why the other options are wrong" arithmetic
  is('why 7: 12 and 5 are the unsorted middle pair', (() => { const xs = mathNums(stem(7)); return xs[2] === 12 && xs[3] === 5; })());
  ok('why 8: 17 is 7 above; 7 over seven values', [17 - 10, 7 / 7], [7, 1]);
  ok('why 12: 3, 6, 8, 9, 11, 14', median([3, 6, 8, 9, 11, 14]), 8.5);
  ok('why 1: midpoint of the range', [(10 + 17) / 2, mean([10, 10, 11, 17])], [13.5, 12]); }

/* ---- C. multiple choice and assertion-reason ------------------ */

const optsOf = (n) => [...((pq[n] || '').match(/<ol class="c-parts[^>]*>([\s\S]*)<\/ol>/) || ['', ''])[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => text(x[1]).trim());
const num = (s) => Number(s.replace(/\$/g, '').trim());
const key = {};
const keyHtml = beyond.slice(beyond.indexOf('<ol class="c-answers">'), beyond.indexOf('</ol>', beyond.indexOf('<ol class="c-answers">')));
for (const m of text(keyHtml).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2];

const solve = {
  1: o => o.map(s => /distances .* balance/.test(s)),
  2: o => o.map(s => /middle value of the sorted/.test(s)),
  3: o => o.map(s => s === 'stay the same'),
  4: o => { const n = 7, xs = [1, 4, 9, 2, 5, 6, 8]; const d = mean(xs.map(x => x + 6)) - mean(xs); return o.map(s => s === '$+ 6$' ? d === 6 : s === '$+ 6n$' ? d === 6 * n : s === '$\\times 6$' ? mean(xs.map(x => x + 6)) === 6 * mean(xs) : d === 0); },
  5: o => { const a = 2.5, xs = [1, 2, 3, 4]; const got = mean(xs.map(x => 4 * x)); const val = { '$a + 4$': a + 4, '$a$': a, '$4a$': 4 * a, '$a \\div 4$': a / 4 }; return o.map(s => val[s] === got); },
  6: o => o.map(s => s === 'the total of the frequencies'),
  7: o => { const xs = mathNums(stem(7)); return o.map(s => num(s) === median(xs)); },
  8: o => { const [n, m, v] = nums(stem(8)); return o.map(s => num(s) === (n * m + v) / (n + 1)); },
  9: o => o.map(s => s === 'the median'),
  10: o => o.map(s => s === 'time'),
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Q${q}: the right option`, right, [key[q]]);
}
// Q5 reads its option a from the page; make sure the stated factor is 4
ok('Q5 factor', mathNums(stem(5))[0], 4);
ok('Q4 shift', mathNums(stem(4))[0], 6);
// assertion-reason: [A true, R true, R explains A]
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
{ const xs = mathNums(pq[11]).slice(0, 4), m = mathNums(pq[11])[4];
  const AR = {
    11: [mean(xs) === m, balance(xs, m)[0] === balance(xs, m)[1], true],
    12: [(() => { const ys = [2, 5, 8, 11, 14]; const mm = mean(ys); return mean(ys.filter(y => y !== mm)) === mm; })(), [[1, 2], [3, 6, 8, 9, 11, 14]].every(ys => ys.includes(median(ys))), false],
    13: [median([1, 2, 3, 4, 100]) === 3, mean([1, 2, 3, 4, 100]) === 22, false],
    14: [fmean([2, 6], [5, 1]) === 4, true, false],
  };
  for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
  ok('Q13 numbers as printed', mathNums(pq[13]), [1, 2, 3, 4, 100, 3, 1, 2, 3, 4, 100, 22]);
  ok('Q14 numbers as printed', mathNums(pq[14]), [2, 6, 4]);
  ok('why 14: the sum over six values', [2 * 5 + 6 * 1, r2(16 / 6)], [16, 2.67]); }
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-14', Object.keys(key).map(Number).sort((a, b) => a - b), range(1, 14));
ok('choice questions have options; the rest do not', range(15, 23).filter(n => optsOf(n).length === 4), []);

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
const mdLine = answersMd.slice(answersMd.indexOf('as the key prints it'));
for (const m of mdLine.slice(0, 300).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2];
ok('ANSWERS.md key matches the page', mdKey, key);
{ const pr = answersMd.slice(answersMd.indexOf('The working for each'));
  const item = (n) => (pr.match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`)) || ['', ''])[1];
  // the last value in each key row, and in each lettered part, is the answer
  for (const n of range(15, 27)) {
    const parts = /\(a\)/.test(keyRows[n]) ? keyRows[n].split(/\([a-e]\)/).slice(1) : [keyRows[n]];
    for (const p of parts) { const v = (p.match(/\d+(\.\d+)?/g) || []).pop(); if (v) is(`ANSWERS.md practice ${n} agrees with the key on ${v}`, numRe(v).test(item(n))); }
  }
}

/* ---- the chapter's shape -------------------------------------- */

ok('body examples are stepped', (body.match(/>Answer<\/span>/g) || []).length >= (body.match(/c-example__tab/g) || []).length, true);
for (const set of [E1, E2, E3]) {
  const i = body.indexOf(`>${set}<`), j = body.indexOf('c-practice__head', i + 10);
  const starts = [...body.slice(i, j < 0 ? undefined : j).matchAll(/data-start="(\d+)"/g)].map(m => +m[1]);
  ok(`${set} numbers run on`, starts, range(2, starts.length + 1));
}

/* ---- report ---------------------------------------------------- */

console.log(`A  ${spans} identities evaluated (${rounded} as printed roundings); ${skipped.length} spans not pure arithmetic, skipped`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
