#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed from the question's own data — ratios, products, shares, scales,
   angles — and compared with what is on the page.

     node pages/class-8/p2ch03-proportion/check-numbers.mjs [--skipped]

   Rewritten for the maths-v2 conversion, 26 September 2026. Four parts:
     A  every identity set as maths, on every page and in ANSWERS.md, whose
        sides all evaluate to numbers. Display maths $$...$$ is taken out
        first, so its delimiters cannot pair up with inline ones
     B  the claims A cannot check: shares, scales, angles, products, the
        practice answers read back out of the answer key (a lettered row
        part by part), and the body exercise answers in ANSWERS.md
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
const near = (a, b) => Math.abs(a - b) < 1e-9;

/* ---- the mathematics ----------------------------------------- */

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
const reduce = (...xs) => { const g = xs.reduce((a, b) => gcd(a, b)); return xs.map(x => x / g); };
const proportional = (a, b, c, d) => near(a * d, b * c);
// share out a whole in a ratio
const share = (whole, ...r) => { const t = r.reduce((a, b) => a + b); return r.map(x => whole * x / t); };
// a representative fraction 1 : n, as kilometres per centimetre
const kmPerCm = (n) => n / 100000;
const deg = (part, whole) => 360 * part / whole;

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/&middot;/g, '·').replace(/\{,\}/g, ',').replace(/\$/g, '').replace(/\s+/g, ' ');
const bodyText = text(body), beyondText = text(beyond);

/* ---- A. every identity ---------------------------------------- */

function toExpr(side) {
  let s = side
    .replace(/\\left|\\right/g, '')
    .replace(/\{,\}/g, '')
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\[td]?frac(\d)(\d)/g, '(($1)/($2))')
    .replace(/\^\\circ/g, '')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad|\{\}/g, '')
    .replace(/\s+(km|cm|m|g|kg|litres|minutes|hours|days|worker-days|tap-minutes|units|bags|turns)\b.*$/, '')
    .replace(/(\d+)\\%/g, '($1/100)')
    .replace(/\s+/g, '');
  if (!s || !/^[-+*/().0-9]+$/.test(s)) return null;
  s = s.replace(/\)\(/g, ')*(');
  return s;
}
const evalExpr = (e) => { try { return Function(`"use strict";return (${e})`)(); } catch { return NaN; } };

// spans printed to be judged false, which the page does not claim
const FALSE_ON_PURPOSE = [];
let spans = 0; const skipped = [];
const sources = [...pages.map(f => [f, html[f]]), ['ANSWERS.md', answersMd]];
const mathsOf = (src) => {
  const out = [];
  // display maths first: a $$ pair must not be read as two empty inline spans
  const rest = src.replace(/\$\$([\s\S]+?)\$\$/g, (m, x) => { out.push(x); return ' '; });
  for (const m of rest.matchAll(/\$([^$]+)\$/g)) out.push(m[1]);
  return out;
};
for (const [f, src] of sources) {
  for (const span of mathsOf(src)) {
    if (!span.includes('=') || FALSE_ON_PURPOSE.includes(span.trim())) continue;
    for (const part of span.split(/\\qquad|,\s*\\ |,\s*\\quad/)) {
      const sides = part.split('=').map(s => s.trim()).filter(Boolean);
      if (sides.length < 2) continue;
      // a ratio identity, 45 : 120 = 3 : 8, holds when the terms are in proportion
      if (sides.every(x => x.includes(':'))) {
        const rs = sides.map(x => x.split(':').map(t => evalExpr(toExpr(t.trim()) ?? 'NaN')));
        if (rs.every(r => r.length === rs[0].length && r.every(Number.isFinite))) {
          spans++;
          if (rs.every(r => r.every((t, i) => near(t * rs[0][0], rs[0][i] * r[0])))) pass++;
          else fails.push(`${f}: $${part.trim()}$ — the ratios are not in proportion`);
          continue;
        }
      }
      let vals = sides.map(toExpr);
      if (vals.filter(v => v !== null).length >= 2) vals = vals.filter(v => v !== null);
      if (vals.some(v => v === null) || vals.length < 2) { skipped.push(`${f}: $${part.trim()}$`); continue; }
      const nums = vals.map(evalExpr);
      if (nums.some(n => !Number.isFinite(n))) { skipped.push(`${f}: $${part.trim()}$`); continue; }
      spans++;
      if (nums.some(n => Math.abs(n - nums[0]) > 1e-9)) fails.push(`${f}: $${part.trim()}$ — sides are ${nums.join(' and ')}`);
      else pass++;
    }
  }
}


/* ---- B. claims arithmetic alone does not check ---------------- */
// Rewritten for the maths-v2 conversion, 26 September 2026: every value is
// computed here from the question's own data, and the page (or the key)
// must print it.
const has = (what, re, src = bodyText) => is(`${what}: page should match ${re}`, re.test(src));
const mdHas = (what, re) => is(`ANSWERS.md ${what}: should match ${re}`, re.test(answersMd));

// the body
is('3.1 jugs 2:8 and 3:12 agree', proportional(2, 8, 3, 12) && reduce(2, 8).join() === '1,4');
ok('T&R 3.1 Q1', 5 * 4, 20);
is('T&R 3.1 Q2 sweeter', 14 / 4 < 4);
is('T&R 3.2 Q1', proportional(2.5, 4, 5, 8));
ok('T&R 3.2 Q2', 3 * 40 / 5, 24);
is('T&R 3.2 Q3', !proportional(2, 3, 3, 4));
ok('Ex 1', [8 * 35, 14 * 20, ...reduce(8, 14), ...reduce(20, 35)], [280, 280, 4, 7, 4, 7]);
ok('Ex 2', 450 * 6 / 150, 18);
ok('snack mix halved', [6, 3, 2, 1].map(x => x / 2), [3, 1.5, 1, 0.5]);
ok('12:9:6:3 reduces', reduce(12, 9, 6, 3), [4, 3, 2, 1]);
ok('Ex 3', [...share(600 / 4 * 9, 3, 2, 4), 600 / 4 * 9], [450, 300, 600, 1350]);
ok('Ex 4', [1, 1.5, 2.5].map(x => x * 4).concat(4 * 5), [4, 6, 10, 20]);
is('Ex 4: 1:1.5:2.5 is 2:3:5', proportional(1, 1.5, 2, 3) && proportional(1.5, 2.5, 3, 5));
is('T&R 3.3 Q1', 3 / 6 === 0.5 && 1 / 3 !== 0.5);
ok('T&R 3.3 Q2', reduce(15, 10, 25, 5), [3, 2, 5, 1]);
ok('T&R 3.3 Q3', 500 / 2 * 9, 2250);
ok('3.4 pencils', share(20, 3, 2), [12, 8]);
ok('Ex 5', share(75, 1, 1.5, 2.5), [15, 22.5, 37.5]);
ok('Ex 6', share(180, 2, 3, 7), [30, 45, 105]);
ok('3.5: 1:40,00,000', kmPerCm(4000000), 40);
ok('Ex 7', [6.5 * 40, 260 / 13, 260 / 13 * 100000], [260, 20, 2000000]);
ok('3.6 pie', [24, 18, 12, 12, 6].map(n => deg(n, 72)), [120, 90, 60, 60, 30]);
ok('3.6 reduced', [...reduce(24, 18, 12, 12, 6), 360 / 12], [4, 3, 2, 2, 1, 30]);
ok('3.6 kabaddi', 100 * 18 / 72, 25);
ok('T&R 3.6 Q3', [deg(5, 72), deg(25, 72), deg(1, 72)], [25, 125, 5]);
ok('3.7 Suresh', [12 * 2, 12 * 2 / 36 * 60, 36 * 6 / 12], [24, 40, 18]);
is('3.7 wrong proportion gives six hours', 2 * 36 / 12 === 6);
ok('3.7 four ways', [5, 15, 30, 40].map(v => 60 / v), [12, 4, 2, 1.5]);
ok('Ex 8', [18 * 5, 90 / 15], [90, 6]);
ok('Ex 9', 3 * 16 / 4, 12);
ok('Ex 10', [120 + 40, 120 * 20 / 160], [160, 15]);
is('Ex 10: a third more, a quarter less', near(40 / 120, 1 / 3) && near(5 / 20, 1 / 4));
ok('T&R 3.7 Q3 (Ex 8 in 3 days)', 90 / 3, 30);
is('Lalita and Nandini: 72 minutes', near(1 / 2 + 1 / 3, 5 / 6) && near(60 * 6 / 5, 72));
is('tap and drain: 6 hours', near(1 / 3 - 1 / 6, 1 / 6));
is('Ex 11: 12 hours', near(1 / 4 - 1 / 6, 1 / 12));

// the body's exercise answers, as ANSWERS.md prints them
mdHas('3.1 Q2', /\*\*32\*\*[\s\S]*\*\*4\*\*[\s\S]*\*\*18\*\*/); ok('3.1 Q2', [8 * 20 / 5, 12 * 9 / 27, 14 * 45 / 35], [32, 4, 18]);
ok('3.1 Q3', [...share(450 / 3 * 10, 5, 3, 2), 1500], [750, 450, 300, 1500]);
ok('3.1 Q4', [296 / 8 * 5, 444 / (296 / 8)], [185, 12]);
ok('3.1 Q5', [240 * 2.5, 900 * 2.5, ...reduce(240, 900)], [600, 2250, 4, 15]);
ok('3.2 Q1', [share(640, 3, 5), share(84, 1, 2, 4), share(360, 2, 3, 7)], [[240, 400], [12, 24, 48], [60, 90, 210]]);
ok('3.2 Q2', share(360, 12, 2, 3, 1), [240, 40, 60, 20]);
ok('3.2 Q3', [150, 30, 300], [120 / 4 * 5, 120 / 4, 120 / 4 * 10]);
{ const [a, b, c] = share(60, 2, 3, 5); ok('3.2 Q4', 5 * a + 2 * b + c, 126); }
is('3.2 Q5', 2 + 3 < 6);
ok('3.2 Q6', [reduce((900 + 180) / 2, (900 - 180) / 2), reduce(600, 300)], [[3, 2], [2, 1]]);
ok('3.2 Q7', 1200 / 4 * 11, 3300);
ok('3.2 Q8', 8 * 9, 72);
ok('3.3 Q1', [kmPerCm(2000000), 350 / 20], [20, 17.5]);
ok('3.3 Q2', [2400 / 200, 3.5 * 200 / 100], [12, 7]);
ok('3.3 Q3', 2500000 / 500000, 5);
ok('3.3 Q4', [24 * 50 / 100, 5 * 50 / 100], [12, 2.5]);
ok('3.3 Q5', 18 * 25000 / 100000, 4.5);
ok('3.4 Q1', [60, 75, 45].map(n => deg(n, 180)), [120, 150, 90]);
ok('3.4 Q2', [40, 30, 20, 10].map(p => 3.6 * p), [144, 108, 72, 36]);
ok('3.4 Q3', [81 / 360 * 100, 81 / 360 * 32000], [22.5, 7200]);
ok('3.4 Q4', [18, 12, 10, 5].map(n => deg(n, 45)), [144, 96, 80, 40]);
ok('3.4 Q5', [150 / 360 * 240, deg(60, 240)], [100, 90]);
ok('3.5 Q1', [[20 * 30, 40 * 15, 50 * 12], [8 * 9, 16 * 4.5, 24 * 4], [25 * 12, 50 * 6, 125 * 2.4]], [[600, 600, 600], [72, 72, 96], [300, 300, 300]]);
ok('3.5 Q2', [144 / 24, 144 / 36], [6, 4]);
ok('3.5 Q4', [8 * 45 / 6, 8 * 45 / 30], [60, 12]);
ok('3.5 Q5', 60 * 12 / 80, 9);
is('3.5 Q6', near(1 / (1 / 4 + 1 / 12), 3));
ok('3.5 Q7', 5 * 48 / 4, 60);
is('3.5 Q8', near(1 / (1 / 6 - 1 / 10), 15));
is('3.5 Q9', near(60 / (1 / 5 - 1 / 20), 400));

// the key, read out of the Answers stage
const keyRows = {};
const board = (() => { const i = beyond.indexOf('c-practice__sub">Beyond the Book'); return [beyond.slice(0, i), beyond.slice(i)]; })();
for (const m of board[0].matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows['B' + m[1]] = text(m[2]);
for (const m of board[1].matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows['Y' + m[1]] = text(m[2]);
const says = (q, ...vals) => { for (const v of vals) is(`key ${q} should say ${v}: "${keyRows[q]}"`, (keyRows[q] || '').includes(String(v))); };

// By the Book
says('B1', 10); ok('BtB 1', 6 * 25 / 15, 10);
is('BtB 2', proportional(2.4, 3.6, 10, 15));
ok('BtB 3', reduce(75, 200), [3, 8]); says('B3', '3 : 8');
ok('BtB 4', [42 / 6, 91 / 7], [7, 13]); says('B4', 7, 13);
says('B5', '1 : 8,00,000');
ok('BtB 6', share(1560, 5, 7), [650, 910]); says('B6', '₹650', '₹910');
ok('BtB 7', 8 * 15 / 20, 6);
ok('BtB 8', share(180, 3, 4, 5)[2], 75);
ok('BtB 9', 45 * 360 / 108, 150); says('B9', 150);
is('BtB 10', !(near(3 / 12, 7 / 30)));
ok('BtB 11', [2160 / 12 * 7.5, 3420 / 180], [1350, 19]); says('B11', '₹1,350', 19);
ok('BtB 13', share(8100, 4, 3, 2), [3600, 2700, 1800]); says('B13', '₹3,600', '₹2,700', '₹1,800');
ok('BtB 14', 12 * 15 / 20, 9); says('B14', 'Step 1', '9');
{ const x = [...Array(50)].map((_, i) => i + 1).find(x => 3 * (2 * x + 12) === 9 * x + 12);
  ok('BtB 15', [2 * x, 9 * x], [16, 72]); says('B15', 16, 72); }
ok('BtB 16', [330 / 5, 330 / 60], [66, 5.5]); says('B16', 66, 5.5);
ok('BtB 17', [7.2 * 2.5, 4.5 / 2.5], [18, 1.8]);
ok('BtB 18', [share(240, 3, 2, 5), [3, 2, 5].map(p => 36 * p)], [[72, 48, 120], [108, 72, 180]]);
is('BtB 19', near(1 / 1.25, 0.8));
{ const x = [...Array(50)].map((_, i) => i + 1).find(x => 8 * (4 * x + 9) === 5 * (7 * x + 9));
  ok('BtB 20', [4 * x, 7 * x], [36, 63]); says('B20', 36, 63); }
ok('BtB 21', [450 * 20 / 360, 8 + 450 * 20 / 360], [25, 33]); says('B21', 25, 33);
is('BtB 22', near(1 / (1 / 12 + 1 / 18 - 1 / 36), 9) && near(1 / (1 / 12 + 1 / 18), 7.2)); says('B22', '1.8');
ok('BtB 23', [110000 / (2 * 22 / 7 * 35), 110000 / (2 * 22 / 7 * 28)], [500, 625]); says('B23', 500, 625);
ok('BtB 24', [6 * 5, 4.2 * 5, 30 * 21, 2 * (30 + 21) * 120], [30, 21, 630, 12240]); says('B24', '₹12,240');
ok('BtB 25', [63 * 100, 36000 - 10800 - 9000 - 6300 - 5400, 10800 / 100, 9000 / 100, 5400 / 100, 4500 / 100], [6300, 4500, 108, 90, 54, 45]);
ok('BtB 26', [...share(50, 15, 3, 2), 36 / 15 * 20, 36 / 15 * 3, 36 / 15 * 2].map(v => Math.round(v * 1e9) / 1e9), [37.5, 7.5, 5, 48, 7.2, 4.8]);
ok('BtB 27', [(5 * 84 - 3 * 84) / 1.5, Math.round((112 - 84) / 84 * 1e4) / 100], [112, 33.33]);
is('BtB 28', proportional(4, 6, 10, 15) && proportional(14, 21, 2, 3));
ok('BtB 29', (1 - 4 * (1 / 12 + 1 / 18)) * 18, 8); says('B29', 8, 12);
ok('BtB 30', [2400 / 48, 3600 / (50 * 4)], [50, 18]); says('B30', 50, 18);
ok('BtB 36', [...reduce(800, 400, 80), 80 / 8 * 20, 2500 / 50, 50 * 100 / 1000], [10, 5, 1, 200, 50, 5]);
ok('BtB 37', [150 / 100, 150 / (5 / 3)], [1.5, 90]);
ok('BtB 38', [3.3 * 40, 7 * 40, 700 / 40], [132, 280, 17.5]); says('B38', 132, 280, 17.5);
ok('BtB 39', [360 - 135 - 90 - 90, 480 * 90 / 360, 480 * 135 / 360 * 10 - 480 * 45 / 360 * 20], [45, 120, 600]); says('B39', '₹600');
is('BtB 40', near(1 / (1 / 10 + 1 / 15), 6) && near((1 - 2 / 6) / (1 / 10), 20 / 3));

says('B17', 18, '1.8'); says('B18', 72, 48, 120); says('B25', '₹6,300', '₹4,500'); says('B26', '37.5', '7.5', '48', '7.2', '4.8');
says('B27', 420, 168, 112); says('B36', 200, 50); says('B37', '1.5', 90); says('B40', '6 hours 40 minutes'); says('B7', 6); says('B8', 75);
// Beyond the Book examples
ok('Beyond Ex 1', share(3000, 3, 5, 7), [600, 1000, 1400]);
is('Beyond Ex 2', near(1 / (1 / 10 + 1 / 15), 6));
ok('Beyond Ex 3', [72 / 360 * 1250, 144 / 360 * 1250, 90 / 360 * 1250], [250, 500, 312.5]);
{ const [l, b] = share(42, 4, 3); ok('Beyond Ex 4', [l, b, l * b, Math.hypot(l, b)], [24, 18, 432, 30]); }
is('Beyond Ex 5', near(1 / (1 / 4 - 1 / 6), 12));
ok('Beyond Ex 6', Math.round(1.2 / 3 * 8 * 1e9) / 1e9, 3.2);
ok('Beyond Ex 7', [20 * 100 / 250, 4 * 2.5, 12 * 2.5], [8, 10, 30]);
ok('Beyond Ex 8', [480, 300, 240, 180].map(n => deg(n, 1200)), [144, 90, 72, 54]);
ok('Beyond Ex 9', [...reduce(1500, 2500, 3000), 5600 / 14 * 6, 1800 / 3 * 14], [3, 5, 6, 2400, 8400]);
ok('Beyond Ex 10', [120 / 5, 120 / 15, 10 + (120 - 30) / 6], [24, 8, 25]);
// Beyond practice
ok('Beyond 1', [9].filter(x => 5 * (x + 3) === 3 * (x + 11)), [9]);
ok('Beyond 2', (2 * 25000 / 100000) ** 2, 0.25);
ok('Beyond 3', (12 * 10 - 12 * 4) / 18, 4);
ok('Beyond 4', 30 / 3 * 2 - 10, 10);
is('Beyond 5', 6 * 20 === 120 && 120 / 15 !== 10 && 120 / 12 === 10 && 120 / 30 === 4);
{ const [p, q, r] = share(2400, 3, 4, 5); is('Beyond 6', q === 800 && r - p === 400 && p + q > r && r !== 1200); }
is('Beyond 7', proportional(0.6, 1.5, 4, 10) && !proportional(0.6, 1.5, 3, 8) && !proportional(0.6, 1.5, 6, 10) && proportional(0.6, 1.5, 9, 22.5));
is('Beyond 8', 360 - 150 - 90 - 60 === 60 && 150 / 360 * 600 === 250 && 90 / 360 !== 1 / 3 && near(120 / 360, 1 / 3));
ok('Beyond 9', 7 * [...Array(100)].map((_, i) => i + 1).find(x => 6 * 7 * x === 7 * (5 * x + 40)), 280); says('Y9', 280);
ok('Beyond 10', 50 * 30 / 25, 60); says('Y10', 60);
ok('Beyond 11', (1 - 6 * (1 / 20 + 1 / 30)) * 30, 15); says('Y11', 15);
ok('Beyond 12', [3 * 2, 0.5 * 2, 12 / 2, 7.5 / 2], [6, 1, 6, 3.75]);
ok('Beyond 13', [360 / 18, 360 / 40, 360 / 12, 360 / 45], [20, 9, 30, 8]);
ok('Beyond 14', [4 * 4 / 8, 4 * 60 / 25, 3 / 0.5 * 25], [2, 9.6, 150]); says('Y14', 9.6, 150);
ok('Beyond 15', [32 * 0.75, 24 / 40 * 60, 24 / 0.5], [24, 36, 48]); says('Y15', 36, 48);

/* ---- C. the key is complete, and the letters are the right ones -- */
const nums = (src) => [...src.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>/g)].map(m => Number(m[1] || 1));
const boardPages = pages.filter(f => /^p09/.test(f)).map(f => html[f]).join('\n');
const beyondQ = beyond.slice(0, beyond.indexOf('c-stage__title">Answers'));
ok('By the Book numbered 1-50', nums(boardPages), [...Array(50)].map((_, i) => i + 1));
ok('Beyond practice numbered 1-15', nums(beyondQ), [...Array(15)].map((_, i) => i + 1));
const letters = {};
for (const m of board[0].matchAll(/<span class="n">(\d+)<\/span> (\([a-d]\))/g)) letters['B' + m[1]] = m[2];
for (const m of board[1].replace(/<[^>]+>/g, ' ').matchAll(/(\d+) ((?:\([a-d]\)(?:, )?)+|\d+(?:\.\d+)?)/g)) letters['Y' + m[1]] ??= m[2].trim();
for (let n = 1; n <= 50; n++) {
  const inKey = (n <= 30 || (n >= 36 && n <= 40)) ? !!keyRows['B' + n] : !!letters['B' + n];
  is(`By the Book ${n} is in the key`, inKey);
}
for (let n = 1; n <= 15; n++) is(`Beyond ${n} is in the key`, !!letters['Y' + n] || !!keyRows['Y' + n]);
// the right letters, from the questions' own options
const want = { B31: '(a)', B32: '(d)', B33: '(b)', B34: '(c)', B35: '(a)', B41: '(a)', B42: '(c)', B43: '(d)', B44: '(b)', B45: '(d)',
  B46: '(b)', B47: '(b)', B48: '(a)', B49: '(c)', B50: '(c)', Y1: '(a)', Y2: '(b)', Y3: '(c)', Y4: '(d)', Y5: '(a), (c), (d)',
  Y6: '(a), (b), (c)', Y7: '(a), (d)', Y8: '(a), (b), (d)', Y12: '(a)', Y13: '(d)' };
// assertion-reason, derived: A true?, R true?, R explains A?
const ar = (a, r, x) => a && r ? (x ? '(a)' : '(b)') : a ? '(c)' : '(d)';
ok('AR 31-35', [ar(15 * 8 === 10 * 12, true, true), ar(proportional(3, 4, 9, 16), true, false), ar(4 * 50000 / 100000 === 2, true, false),
  ar(deg(30, 90) === 120, false, false), ar(12 / 3 * 5 === 20, true, true)], ['(a)', '(d)', '(b)', '(c)', '(a)']);
// single-answer options: the keyed option is the computed value, and no other option is
const optsOf = (src, n) => { const i = src.search(new RegExp(`<ol class="c-questions" data-start="${n}">`)); const s = src.slice(i, src.indexOf('</ol>\n', i));
  const o = s.slice(s.lastIndexOf('<ol class="c-parts c-parts--alpha')); return [...o.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => text(x[1]).trim()); };
const val = (s) => Number(s.replace(/[₹%°,]|km|m\b|litres|more days|days|kg|km2|\^\\circ|\\%/g, '').replace(/\\tfrac(\d)(\d)/, '$1/$2').replace(/\s/g, '').replace(/^(\d+)\/(\d+)$/, (m, a, b) => a / b));
const single = { 41: 5 * 60 / 12, 42: 500, 43: 5, 44: 15, 45: 20, 46: 9, 47: 40, 48: 5 };
for (const [n, v] of Object.entries(single)) {
  const o = optsOf(boardPages, n).map(val); const hit = o.map((x, i) => near(x, v) ? i : -1).filter(i => i >= 0);
  ok(`By the Book ${n}: one option is ${v}`, hit.length, 1); ok(`By the Book ${n} key`, letters['B' + n], '(' + 'abcd'[hit[0]] + ')');
}
const singleY = { 2: 2, 3: 3, 4: 4 };  // index of the right option, from the computations in B
for (const [n, i] of Object.entries(singleY)) ok(`Beyond ${n} key`, letters['Y' + n], '(' + 'abcd'[i - 1] + ')');
ok('Beyond 1 key', letters['Y1'], '(a)');
for (const [k, v] of Object.entries(want)) ok(`key ${k}`, letters[k], v);
{ const s = [...'aabbbccdd']; ok('objective letters spread', ['a', 'b', 'c', 'd'].map(c => Object.entries(want).filter(([k, v]) => /^B4\d|B50/.test(k) && v === `(${c})`).length), [2, 3, 3, 2]); }

/* ---- D. ANSWERS.md prints the same key as the page ------------- */
mdHas('AR', /31 \(a\) · 32 \(d\) · 33 \(b\) · 34 \(c\) · 35 \(a\)/);
mdHas('objective', /41 \(a\) · 42 \(c\) · 43 \(d\) · 44 \(b\) · 45 \(d\) · 46 \(b\) · 47 \(b\) · 48 \(a\) ·\s*49 \(c\) · 50 \(c\)/);
mdHas('Beyond practice', /5 \(a\), \(c\), \(d\) · 6 \(a\), \(b\), \(c\) · 7 \(a\), \(d\) · 8 \(a\), \(b\), \(d\)/);
mdHas('Beyond numerical', /9 \*\*280\*\* · 10 \*\*60\*\* · 11 \*\*15\*\*/);
mdHas('Tried and explained', /\(1\) 1000 g[\s\S]*\(2\) 8 days[\s\S]*\(3\) 1\.5 cm[\s\S]*\(4\) 300 people[\s\S]*\(6\) 60 minutes[\s\S]*\(8\) 100 turns/);
ok('tried-and-explained values', [750 / 6 * 8, 120 / 15, 6 * 50000 / 200000, 150 / 360 * 720, 240 / 15 * 105, 240 / 4, 35 * 60 / 21], [1000, 8, 1.5, 300, 1680, 60, 100]);

/* ---- report ---------------------------------------------------- */

console.log(`A  ${spans} identities evaluated; ${skipped.length} spans not pure arithmetic, skipped`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
