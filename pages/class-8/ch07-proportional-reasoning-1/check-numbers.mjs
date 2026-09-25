#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed from first principles — ratios, HCFs, cross products, unit
   conversions, searches — and compared with what is on the page.

     node pages/class-8/ch07-proportional-reasoning-1/check-numbers.mjs

   Five parts:
     A  every identity set as maths, on every page and in ANSWERS.md, whose
        sides all evaluate to numbers
     B  the claims A cannot check: simplest forms, proportions, shares,
        conversions, the figures' own measurements, the Binairo solutions
     C  Stage 2's fifteen solved examples: the bank's conventions, every
        option recomputed, and the pages carrying the bank exactly
     D  every multiple-choice and assertion-reason practice question:
        exactly one option is right, and it is the one the key prints
     E  ANSWERS.md prints the same keys as the pages

   Exits non-zero if anything does not hold up. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { bank } from './stage2-bank.mjs';

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

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
// a ratio of whole numbers in its simplest form, as "a : b"
const simplest = (a, b) => { const g = gcd(a, b); return `${a / g} : ${b / g}`; };
const prop = (a, b, c, d) => near(a * d, b * c);           // a : b :: c : d
const share = (x, m, n) => [m * x / (m + n), n * x / (m + n)];
const F = (c) => 9 / 5 * c + 32, C = (f) => 5 / 9 * (f - 32);
const ACRE = 43560, HA_M2 = 10000, HA_ACRE = 2.471;

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;|&emsp;/g, ' ').replace(/&ndash;/g, '-').replace(/\s+/g, ' ');
const bodyText = text(body), beyondText = text(beyond);

/* ---- A. every identity ---------------------------------------- */

function toExpr(side) {
  let s = side.replace(/,\s*$/, '')
    .replace(/\\left|\\right/g, '')
    .replace(/(\d)\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1+($2)/($3))')     // mixed number
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/(\d)\{,\}(\d)/g, '$1$2').replace(/(\d)\\,(\d)/g, '$1$2')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad/g, '')
    .replace(/\s+/g, '');
  if (!s || !/^[-+*/().0-9]+$/.test(s)) return null;
  return s.replace(/\)\(/g, ')*(');
}
const evalExpr = (e) => { try { return Function(`"use strict";return (${e})`)(); } catch { return NaN; } };

let spans = 0; const skipped = [];
const sources = [...pages.map(f => [f, html[f]]), ['ANSWERS.md', answersMd]];
for (const [f, src] of sources) {
  for (const m of src.matchAll(/\$([^$]+)\$/g)) {
    const span = m[1];
    if (!span.includes('=') || span.includes(':')) continue;
    for (const part of span.split(/\\qquad|,\s*\\ |,\s*so\s|\s*so\s|,\s*and\s/)) {
      const sides = part.split('=').map(s => s.trim()).filter(Boolean);
      if (sides.length < 2) continue;
      let vals = sides.map(toExpr);
      if (vals.filter(v => v !== null).length >= 2 && vals.some(v => v === null)) vals = vals.filter(v => v !== null);
      if (vals.some(v => v === null) || vals.length < 2) { skipped.push(`${f}: $${part.trim()}$`); continue; }
      const nums = vals.map(evalExpr);
      if (nums.some(n => !Number.isFinite(n))) { skipped.push(`${f}: $${part.trim()}$`); continue; }
      spans++;
      if (nums.some(n => Math.abs(n - nums[0]) > 1e-6 * Math.max(1, Math.abs(nums[0])))) fails.push(`${f}: $${part.trim()}$ — sides are ${nums.join(' and ')}`);
      else pass++;
    }
  }
}

/* ---- B. the body ---------------------------------------------- */

// 7.1 – 7.3: the five images of Table 7.2
const img = { A: [60, 40], B: [40, 20], C: [30, 20], D: [90, 60], E: [60, 60] };
{ const rows = [...body.matchAll(/<tr><td>Image ([A-E])<\/td><td>(\d+)<\/td><td>(\d+)<\/td><\/tr>/g)].map(m => [m[1], +m[2], +m[3]]);
  ok('Table 7.2 as printed', rows, Object.entries(img).map(([k, [w, h]]) => [k, w, h])); }
ok('simplest forms of A-E', Object.values(img).map(([w, h]) => simplest(w, h)), ['3 : 2', '2 : 1', '3 : 2', '3 : 2', '1 : 1']);
ok('C is A times 1/2; D is A times 3/2', [30 / 60, 20 / 40, 90 / 60, 60 / 40], [0.5, 0.5, 1.5, 1.5]);
ok('B is 20 less than A both ways, but not half', [60 - 40, 40 - 20, 40 / 60 === 0.5, 20 / 40], [20, 20, false, 0.5]);
ok('HCFs 60,40 and 90,60', [gcd(60, 40), gcd(90, 60)], [20, 30]);
is('60 : 40 :: 30 : 20 and 60 : 40 :: 90 : 60', prop(60, 40, 30, 20) && prop(60, 40, 90, 60));

// the Examples
ok('Ex 1', [gcd(72, 96), simplest(72, 96), simplest(3, 4)], [24, '3 : 4', '3 : 4']);
ok('Ex 2', [18 / 6, 10 * 18 / 6], [3, 30]);
is('Ex 2 prints 18 glasses in all, not 18 more', /make\s+\$18\$\s+glasses\s+instead/.test(body));
ok('Ex 3', [simplest(60, 3), simplest(40, 2)], ['20 : 1', '20 : 1']);
ok('Ex 4', simplest(5, 170), '1 : 34');
ok('Ex 5', [simplest(360, 120), gcd(360, 120), prop(3, 1, 9, 3)], ['3 : 1', 120, true]);
ok('Ex 6', [simplest(3, 30), simplest(3 + 9, 30 + 9), 30 + 9], ['1 : 10', '4 : 13', 39]);
ok('Ex 7', [14 * 42 / 21, 21 * 6 / 14, gcd(14, 21), 14 / 7, 21 / 7], [28, 9, 7, 2, 3]);
is('Ex 7: all three proportional', prop(14, 21, 28, 42) && prop(14, 21, 6, 9) && prop(14, 21, 2, 3));
ok('Ex 8', [80 / 120, 15 * 80 / 120], [2 / 3, 10]);
ok('Ex 9', [4 * 60, 90 * 240 / 150, 90 / 5, 8 * 18], [240, 144, 18, 144]);
ok('Ex 10', [simplest(200, 200), simplest(1000, 800), 200 * 5], ['1 : 1', '5 : 4', 1000]);
ok('Ex 11', [simplest(75000, 25000), ...share(4000, 3, 1)], ['3 : 1', 3000, 1000]);
{ const [sand, cement] = share(40, 3, 1); ok('Ex 12', [sand, cement, 2 / 5 * sand, 2 / 5 * sand - cement], [30, 10, 12, 2]); }
ok('25 °C', F(25), 77);

// filter coffee and Table 7.5
{ const reg = 15 / 35;
  const cls = ([d, m]) => near(d / m, reg) ? 'regular' : d / m > reg ? 'stronger' : 'lighter';
  ok('the three cups', [[15, 35], [20, 30], [10, 40]].map(cls), ['regular', 'stronger', 'lighter']);
  ok('Table 7.5 as printed', [...body.matchAll(/<tr><td>(\d+)<\/td><td>(\d+)<\/td><td><\/td><\/tr>/g)].map(m => [+m[1], +m[2]]), [[300, 600], [150, 500], [200, 400], [24, 56], [100, 300]]);
  ok('Table 7.5 answers', [[300, 600], [150, 500], [200, 400], [24, 56], [100, 300]].map(cls), ['stronger', 'lighter', 'stronger', 'regular', 'lighter']);
  ok('Table 7.5 simplest forms', [[300, 600], [150, 500], [200, 400], [24, 56], [100, 300]].map(([a, b]) => simplest(a, b)), ['1 : 2', '3 : 10', '1 : 2', '3 : 7', '1 : 3']);
  ok('each cup holds 50 mL', [15 + 35, 20 + 30, 10 + 40], [50, 50, 50]); }

// Exercise Set 7.1
ok('7.1 Q1', [[4, 7, 12, 21], [8, 3, 24, 6], [7, 12, 12, 7], [21, 6, 35, 10], [12, 18, 28, 12], [24, 8, 9, 3]].map(q => prop(...q)), [true, false, false, true, false, true]);
ok('7.1 Q2', [[8, 18], [12, 27], [16, 36]].map(([a, b]) => simplest(a, b)), ['4 : 9', '4 : 9', '4 : 9']);
ok('7.1 Q3', [3, 12, 20, 27].map(a => a * 24 / 18), [4, 16, 80 / 3, 36]);
{ // Q4: the rectangles as drawn, 4 viewBox units to the printed millimetre
  const svg = body.match(/<svg viewBox="0 0 264 150"[\s\S]*?<\/svg>/)[0];
  const sides = [...svg.matchAll(/<path d="M([\d. L]+) Z"\/>/g)].map(m => {
    const p = m[1].split(' L').map(s => s.split(' ').map(Number));
    const d = (i, j) => Math.hypot(p[i][0] - p[j][0], p[i][1] - p[j][1]) / 4;
    return [d(0, 1), d(1, 2)].map(x => Math.round(x * 10) / 10).sort((a, b) => a - b);
  });
  ok('7.1 Q4: the five rectangles, in mm', sides, [[8, 24], [12, 18], [10, 25], [10, 30], [6, 15]]);
  ok('7.1 Q4: shorter to longer', sides.map(([a, b]) => simplest(a, b)), ['1 : 3', '2 : 3', '2 : 5', '1 : 3', '2 : 5']);
  is('Fig 7.6 is printed at --lg, 66 mm for a viewBox of 264', /data-size="lg"/.test(svg)); }
{ const svg = body.match(/<svg viewBox="0 0 188 128"[\s\S]*?<\/svg>/)[0];
  ok('7.1 Q5: Fig 7.7 is 40 mm by 30 mm at --sm (47 mm for 188 units)', [160 / 4, 120 / 4, /data-size="sm"/.test(svg), /width="160" height="120"/.test(svg)], [40, 30, true, true]); }
{ // Q6: count the bricks in the figure itself
  const svg = body.match(/<svg viewBox="0 0 580 140"[\s\S]*?<\/svg>/)[0];
  const groups = [...svg.matchAll(/<g class="(dg-fill-[a-d])">([\s\S]*?)<\/g>/g)].map(m => [m[1], (m[2].match(/<rect/g) || []).length]);
  ok('7.1 Q6: bricks drawn, light and dark, walls (a) and (b)', groups, [['dg-fill-d', 27], ['dg-fill-c', 18], ['dg-fill-d', 64], ['dg-fill-b', 48]]);
  ok('7.1 Q6: ratios', [simplest(27, 18), simplest(64, 48), simplest(9, 6), simplest(16, 12)], ['3 : 2', '4 : 3', '3 : 2', '4 : 3']); }
ok('7.1 Q7 instance', [simplest(22, 60), simplest(60, 66), simplest(60, 90)], ['11 : 30', '10 : 11', '2 : 3']);

// Exercise Set 7.2
ok('7.2 Q1', [Math.round(940e6 / 52), Math.round(940e6 * 7 / 365)], [18076923, 18027397]);
{ const svg = body.match(/<svg viewBox="0 0 190 132"[\s\S]*?<\/svg>/)[0];
  const s = 5;   // 5 viewBox units to the foot
  const rects = [...svg.matchAll(/<rect x="(\d+)" y="(\d+)" width="(\d+)" height="(\d+)"\/>/g)].map(m => m.slice(1).map(Number).map(v => v / s));
  ok('7.2 Q2: the plan, in feet', rects.map(r => [r[2], r[3]]), [[24, 12], [6, 9]]);
  ok('7.2 Q2: labels', [...svg.matchAll(/>(\d+) ft</g)].map(m => +m[1]), [12, 15, 9, 9, 6]);
  const outer = 24 + 12 + (24 - 9 - 6) + 9 + 6 + 9 + 9 + 12;
  ok('7.2 Q2: walls', [outer, outer + 12 + 6, Math.round((outer + 18) / 10 * 1450)], [90, 108, 15660]); }
ok('Think and Reflect: Puneeth', [50 * 2, 100 / 75 * 60, 2 * 75 / 50], [100, 80, 3]);
ok('Activity 2', [simplest(6, 180), simplest(2, 154), prop(6, 180, 2, 154)], ['1 : 30', '1 : 77', false]);
ok('Activity 2: price per mL', [2 / 6, 154 / 180, 276 / 340, 540 / 1000].map(x => Math.round(x * 100) / 100), [0.33, 0.86, 0.81, 0.54]);
ok('Activity 1 instance', [15 / 4, 200 * 3.75, 3.75, 10 * 3.75], [3.75, 750, 3.75, 37.5]);

// 7.5
ok('Activity 3', [12 - 5, simplest(5, 7), ...share(12, 3, 1), ...share(42, 4, 3), 42 / 7], [7, '5 : 7', 9, 3, 24, 18, 6]);
ok('Activity 3 rounds', [12 - 4, 12 - 8, 12 - 12, 3 * 3, 3 * 1], [8, 4, 0, 9, 3]);
ok('7.3 Q1', share(4500, 2, 3), [1800, 2700]);
ok('7.3 Q2', share(240, 1, 5), [40, 200]);
ok('7.3 Q3', [...share(40, 3, 5), simplest(15, 25 + 20)], [15, 25, '1 : 3']);
ok('7.3 Q4', share(6, 2, 1), [4, 2]);
ok('7.3 Q5', simplest(3, 5 + 8), '3 : 13');

// 7.6
ok('7.4 Q1', simplest(600, 900), '2 : 3');
ok('7.4 Q2', [162 / 3, Math.ceil(204 / 54), 4 * 54 - 204], [54, 4, 12]);
ok('7.4 Q3', [Math.round(30e6 / 1484), Math.round(20e6 / 550), 20e6 / 550 > 30e6 / 1484], [20216, 36364, true]);
ok('7.4 Q4', [4 / 10 * 155, 4 / 10 * 150], [62, 60]);
ok('7.4 Q5', 9 * 2.5 / (3 / 7), 52.5);
{ let x = 0; while ((1 + x) * 2 !== 5 + x) x++; ok('7.4 Q6', [x, 1 + x, 5 + x], [3, 4, 8]); }
ok('7.4 Q7', 37 / 2, 18.5);
ok('7.4 Q8', [200 * 500, Math.round(100000 / ACRE * 1000) / 1000, Math.round(10 * 100000 / ACRE * 100) / 100], [100000, 2.296, 22.96]);
ok('7.4 Q9', [10000 / 500, 20 * 15, 300 / 60], [20, 300, 5]);
ok('7.4 Q10', [Math.round(1500000 * 2400 / ACRE * 100) / 100, Math.round(1500000 * 2400 / ACRE)], [82644.63, 82645]);
ok('7.4 Q11', [20 * 6, 20 * 6 / 4, 6 / 4], [120, 30, 1.5]);
{ const cu = 3 / 4 * 7.74, ni = 7.74 / 4;
  ok('7.4 Q12', [Math.round(cu * 1000) / 1000, Math.round(ni * 1000) / 1000, Math.round(cu * 906 / 1000 * 100) / 100, Math.round(ni * 1341 / 1000 * 100) / 100, Math.round((cu * 906 + ni * 1341) / 1000 * 100) / 100], [5.805, 1.935, 5.26, 2.59, 7.85]); }

// Binairo: the figure's givens, the solutions, and uniqueness
const BIN = { ex: ['.V....', '....V.', 'V.V..V', '.V...V', '....H.', '..H..H'],
  a: ['......', '..V.HH', '.H....', '..V.V.', 'H...H.', '..V...'],
  b: ['H.....', 'H....H', '...V..', '.VV...', '.....H', '.V..V.'],
  c: ['....H.', '.....H', 'H.H..H', '......', '..VV..', 'V.....'] };
const legal = (g) => {
  const lines = [...g, ...[0, 1, 2, 3, 4, 5].map(c => g.map(r => r[c]).join(''))];
  for (const L of lines) if (/HHH|VVV/.test(L) || (L.match(/H/g) || []).length > 3 || (L.match(/V/g) || []).length > 3) return false;
  const full = (x) => !x.includes('.');
  const rows = g.filter(full), cols = lines.slice(6).filter(full);
  return new Set(rows).size === rows.length && new Set(cols).size === cols.length;
};
const solveAll = (g) => { const out = []; const rec = (g) => { const i = g.join('').indexOf('.'); if (i < 0) { out.push(g); return; }
  const r = Math.floor(i / 6), c = i % 6; for (const s of 'HV') { const h = g.slice(); h[r] = h[r].slice(0, c) + s + h[r].slice(c + 1); if (legal(h)) rec(h); } }; rec(g); return out; };
{ // read the givens back out of Fig. 7.15
  const svg = body.match(/<svg viewBox="0 0 564 186"[\s\S]*?<\/svg>/)[0];
  const grids = [0, 1, 2].map(() => [...Array(6)].map(() => [...'......']));
  for (const m of svg.matchAll(/M([\d.]+) ([\d.]+) ([HV])([\d.]+)/g)) {
    let [x, y, t, e] = [+m[1], +m[2], m[3], +m[4]];
    const cx = t === 'H' ? (x + e) / 2 : x, cy = t === 'V' ? (y + e) / 2 : y;
    const k = Math.floor((cx - 12) / 188), col = Math.floor((cx - 12 - k * 188) / 26), row = Math.floor((cy - 6) / 26);
    if (Number.isInteger((cx - 12 - k * 188 - 13) / 26) && Number.isInteger((cy - 6 - 13) / 26)) grids[k][row][col] = t;
  }
  ok('Fig 7.15 givens', grids.map(g => g.map(r => r.join(''))), [BIN.a, BIN.b, BIN.c]); }
ok('Binairo: number of solutions', ['ex', 'a', 'b', 'c'].map(k => solveAll(BIN[k]).length), [2, 1, 1, 1]);
{ const sol = ['a', 'b', 'c'].map(k => solveAll(BIN[k])[0]);
  const tbl = [...answersMd.matchAll(/^\| ([HV ]{11}) \| ([HV ]{11}) \| ([HV ]{11}) \|$/gm)].map(m => [m[1], m[2], m[3]].map(s => s.replace(/ /g, '')));
  ok('ANSWERS.md Binairo solutions', [0, 1, 2].map(k => tbl.map(r => r[k])), sol);
  const exSol = ['HVVHHV', 'HVHVVH', 'VHVHHV', 'HVHHVV', 'VHVVHH', 'VHHVVH'];
  is('Fig 7.14 prints a solution of its puzzle', solveAll(BIN.ex).some(s => s.join() === exSol.join()));
  const other = solveAll(BIN.ex).find(s => s.join() !== exSol.join());
  ok('Fig 7.14 other solution: rows 2 and 6 exchanged', other, [exSol[0], exSol[5], exSol[2], exSol[3], exSol[4], exSol[1]]); }

// no Beyond value answers a body question
for (const [w, why] of [['15660', 'Ex 7.2 Q2'], ['18076923', 'Ex 7.2 Q1'], ['52.5', 'Ex 7.4 Q5'], ['18.5', 'Ex 7.4 Q7'], ['3 : 13', 'Ex 7.3 Q5'], ['82645', 'Ex 7.4 Q10'], ['36364', 'Ex 7.4 Q3'], ['7.85', 'Ex 7.4 Q12']])
  is(`Beyond does not print ${w} (${why})`, !beyondText.replace(/,|\\,|\{,\}/g, '').includes(w));

/* ---- Stage 1 ---------------------------------------------------- */

ok('S1 Q1', [simplest(15, 10), 24 * 2 / 3, simplest(24, 18), 18 - 16], ['3 : 2', 16, '4 : 3', 2]);
ok('S1 Q2', [6 * 5, 6 * 4, 30 + 24, simplest(30, 24 + 6)], [30, 24, 54, '1 : 1']);
ok('S1 Q3', [...share(50, 3, 2), 50 % 7, 7 * 7, 7 * 8], [30, 20, 1, 49, 56]);
ok('S1 Q4', [F(15), F(30), 2 * F(15), F(-40)], [59, 86, 118, -40]);
ok('S1 Q5', [Math.sqrt(4 * 25), simplest(4, 10), simplest(10, 25)], [10, '2 : 5', '2 : 5']);
{ const P = share(250, 1, 4), Q = share(500, 1, 4), R = share(250, 2, 3);
  ok('S1 Q6 amounts', [P, Q, R], [[50, 200], [100, 400], [100, 150]]);
  ok('S1 Q6 mixtures', [simplest(P[0] + Q[0], P[1] + Q[1]), simplest(P[0] + R[0], P[1] + R[1])], ['1 : 4', '3 : 7']);
  ok('S1 Q6 sugar per 10 mL water', [Math.round(10 * 3 / 7 * 10) / 10, 10 / 4, Math.round(10 * 2 / 3 * 10) / 10], [4.3, 2.5, 6.7]); }
ok('S1 Q7', [4 * 30 / 3, 12 * 60 - 40], [40, 680]);   // 680 minutes after midnight is 11:20
ok('S1 Q8', [20000 * 12, 30000 * 6, simplest(240000, 180000), ...share(14000, 4, 3)], [240000, 180000, '4 : 3', 8000, 6000]);

/* ---- C. Stage 2 ------------------------------------------------- */

const strip = (s) => s.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
ok('Stage 2: 15 examples, 6/4/3/2', bank.map(b => b.match(/data-question-type="([^"]+)"/)[1]),
  [...Array(6).fill('Single correct'), ...Array(4).fill('Multiple correct'), ...Array(3).fill('Numerical answer'), ...Array(2).fill('Matching')]);
bank.forEach((b, i) => is(`Stage 2 example ${i + 1} numbered`, b.includes(`Example ${i + 1} · `)));
const opts = (b) => [...(b.match(/<ol class="c-parts[^>]*>([\s\S]*?)<\/ol>/)?.[1] || '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => strip(m[1]));
const answerOf = (b) => strip(b.match(/<span class="work__label">Answer<\/span><span>([\s\S]*?)<\/span>/)[1]);
const keyOf = (b) => [...answerOf(b).matchAll(/\(([a-d])\)/g)].map(m => m[1]).join('');
const pick = (o, f) => o.map((x, i) => (f(x, i) ? 'abcd'[i] : '')).join('');
const n = (s) => Number(s.replace(/[₹$,°CFa-zA-Z ]/g, '').replace(/\\/g, ''));
const want = [
  pick(opts(bank[0]), s => s.replace(/\$/g, '') === simplest(120, 45)),
  pick(opts(bank[1]), s => { const [a, b] = s.replace(/\$/g, '').split(':').map(Number); return prop(18, 27, a, b); }),
  pick(opts(bank[2]), s => prop(2.5, n(s), 10, 36)),
  pick(opts(bank[3]), s => n(s) === 360 / 15 * 75),
  pick(opts(bank[4]), s => n(s) === Math.abs(share(5600, 3, 4)[1] - share(5600, 3, 4)[0])),
  pick(opts(bank[5]), s => near(n(s), C(104))),
  pick([[9, 6], [8, 6], [3, 2], [15, 10]], ([w, h]) => prop(6, 4, w, h)),
  pick([prop(3, 5, 5, 7), prop(3, 5, 12, 20), prop(3, 5, 4.5, 7.5), prop(3, 5, 5, 3)], x => x),
  pick([near(HA_ACRE, 2.471), 1000 === 1000, near(3.281, 10.764), 5 * HA_M2 === 50000], x => x),
  pick([simplest(8, 32) === '1 : 4', simplest(16, 40) === '1 : 4', simplest(16, 40) === '2 : 5', simplest(4, 28) === '1 : 7'], x => x),
];
ok('Stage 2 options, recomputed', want, ['a', 'b', 'c', 'd', 'a', 'b', 'acd', 'bc', 'abd', 'acd']);
ok('Stage 2 keys as printed', bank.slice(0, 10).map(keyOf), want);
bank.slice(0, 6).forEach((b, i) => is(`Stage 2 example ${i + 1}: answer text is its option`, answerOf(b).endsWith(opts(b)['abcd'.indexOf(keyOf(b))])));
bank.filter((_, i) => i < 10 || i > 12).forEach(b => ok('four distinct options', new Set(opts(b)).size, 4));
is('Stage 2 Ex 8 option (d) is only the reverse', simplest(5, 3) !== simplest(3, 5));
is('Stage 2 Ex 9 (c): a square metre is 3.281 squared square feet', near(3.281 ** 2, 10.764, 0.001));
{ const milk = 4 / 5 * 45, water = 45 - milk, w = milk * 2 / 3;
  ok('Stage 2 numerical answers', [answerOf(bank[10]), answerOf(bank[11]), answerOf(bank[12])].map(Number),
    [w - water, Math.round(HA_ACRE * 400000), 510 / 0.75 * 2.5]);
  ok('Stage 2 Ex 11 working', [milk, water, w], [36, 9, 24]); }
{ const m14 = [simplest(45, 60), simplest(200, 80), simplest(750, 2000), simplest(36, 90)];
  const r14 = ['2 : 5', '3 : 8', '3 : 4', '5 : 2'];
  const m15 = [[1, 2], [1, 3], [4, 5], [5, 7]].map(([a, b]) => Math.min(...share(360, a, b)));
  const r15 = [150, 120, 160, 90];
  const mapOf = (L, R) => L.map(l => R.indexOf(l) + 1);
  const keyed = (b) => answerOf(b).slice(4).match(/[PQRS]–(\d)/g).map(x => +x.slice(2));
  ok('Stage 2 Ex 14 matching', keyed(bank[13]), mapOf(m14, r14));
  ok('Stage 2 Ex 15 matching', keyed(bank[14]), mapOf(m15, r15));
  ok('matching letters', [keyOf(bank[13]), keyOf(bank[14])], ['b', 'c']);
  bank.slice(13).forEach(b => is('matching key is one of its options', opts(b).includes(answerOf(b).slice(4)))); }
{ const onPage = [...beyond.matchAll(/<div class="c-example" data-question-type="[^"]+">[\s\S]*?(?=\n)/g)].map(m => m[0].trim());
  ok('the pages carry the bank exactly', onPage, bank); }

/* ---- D. practice: multiple choice and assertion-reason ---------- */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] = m[2];
const optsQ = (q) => [...(qs[q] || '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => text(x[1]).trim());
const key = {};
{ const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2]; }
const val = (s) => Number(s.replace(/\$|₹|,|\\,|°F|m²|cm|g|minutes/g, '').replace(/\s/g, ''));
const rat = (s) => s.replace(/\$/g, '').trim();
const solve = {
  1: o => o.map(s => rat(s) === simplest(84, 126)),
  2: o => o.map(s => rat(s) === simplest(25, 200)),
  3: o => o.map(s => { const [a, b] = rat(s).split(':').map(Number); return !prop(3, 7, a, b); }),
  4: o => o.map(s => val(s) === 15 * 10 / 6),
  5: o => o.map(s => val(s) === 78 / 12 * 20),
  6: o => o.map(s => val(s) === Math.max(...share(91, 4, 3))),
  7: o => o.map(s => val(s) === 3 * HA_M2),
  8: o => o.map(s => val(s) === F(20)),
  9: o => o.map(s => val(s) === 20 * 3 / 4),
  10: o => o.map(s => { const [a, b] = rat(s).split(':').map(Number); return gcd(a, b) === 1; }),
  11: o => o.map(s => { const m = s.match(/frac\{1\}\{(\d)\}/); return m && near(1 / +m[1], 10890 / ACRE); }),
  12: o => o.map(s => val(s) === 360 / (96 / 4)),
  13: o => o.map(s => val(s) === 500 / 10),
  14: o => o.map(s => /eggs/.test(s)),
  15: o => o.map(s => val(s) === Math.max(...share(64, 3, 5))),
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsQ(q);
  is(`Q${q} has four options`, o.length === 4);
  ok(`Q${q}: the right option`, f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean), [key[q]]);
}
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  16: [prop(2, 3, 20, 30), true, true],
  17: [prop(5, 9, 9, 13), !prop(5, 9, 9, 13), false],
  18: [F(50) === 122, F(0) === 32, false],
  19: [simplest(20, 30) === '2 : 3', prop(20, 30, 20 - 10, 30 - 10), false],
};
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-19', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(19)].map((_, i) => i + 1));

// the written answers, read back out of the key
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= text(m[2]);
const says = (q, ...vals) => { for (const v of vals) is(`key ${q} should say ${v}: "${keyRows[q]}"`, (keyRows[q] || '').replace(/\{,\}/g, '').replace(/\$/g, '').replace(/(\d),(\d)/g, '$1$2').includes(String(v))); };
says(20, simplest(35, 140));
says(21, 14 * 10 / 4);
says(22, Math.round(3 * HA_ACRE * 1000) / 1000);
says(23, 48 * 1.5 / 2);
{ const [a, b] = share(2800, 3, 4); says(24, a, b, a - 200, b + 200, simplest(a - 200, b + 200)); }
says(25, 21 / 7 * 5, 21 / 7 * 12);
says(26, 7.5 * 2 / 3, 7.5 + 5);
says(27, 132 * 55, 132 * 55 / HA_M2, Math.round(132 * 55 / HA_M2 * HA_ACRE * 1e6) / 1e6, Math.round(132 * 55 / HA_M2 * HA_ACRE * 100) / 100, 132 * 55 / HA_M2 * 2500000);
{ const [p1, p2] = share(20, 3, 5), [q1, q2] = share(p2, 1, 4); says(28, p1, p2, q1, q2, simplest(q1 * 2, q2 * 2)); }
{ const h = 80 * 9 / 16, w = h * 4 / 3; says(29, h, w, (80 - w) * h, (w * h) + ' of ' + (80 * h)); ok('Q29 fraction used', w * h / (80 * h), 3 / 4); }
says(30, simplest(150, 350), simplest(200, 600), simplest(120, 280), 450 * 7 / 3);
says(31, 1.5 * HA_ACRE, 21780 / ACRE, 25 * (2 + 21780 / ACRE), Math.round(25 * 1.5 * HA_ACRE * 1e4) / 1e4, Math.round(25 * 1.5 * HA_ACRE * 10) / 10);

/* ---- E. ANSWERS.md prints the same keys ------------------------- */

const mdKey = {};
for (const m of answersMd.slice(answersMd.indexOf('as the key prints it')).slice(0, 400).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2];
ok('ANSWERS.md practice key matches the page', mdKey, key);
{ const s2 = answersMd.slice(answersMd.indexOf('### Stage 2'), answersMd.indexOf('### Stage 3'));
  const rows = [...s2.matchAll(/^(\d+)\. (.*?) \*\(/gm)].map(m => m[2]);
  ok('ANSWERS.md Stage 2 keys match the bank', rows.map(r => r.replace(/\$/g, '')), bank.map(b => answerOf(b).replace(/\$/g, '').replace(/\\/g, ''))); }

/* ---- report ------------------------------------------------------ */

console.log(`A  ${spans} identities evaluated; ${skipped.length} spans not pure arithmetic, skipped`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
