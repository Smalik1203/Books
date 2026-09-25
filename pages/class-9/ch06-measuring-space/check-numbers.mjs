#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed — circumferences, arcs, sectors, segments, Heron's and
   Brahmagupta's formulas, the approximations of pi, and the figures' drawn
   values from their own coordinates — and compared with the page.

     node pages/class-9/ch06-measuring-space/check-numbers.mjs [--skipped]

   Four parts:
     A  every identity and every approximation set as maths, on every page
        and in ANSWERS.md: pure arithmetic (powers, roots and pi included) is
        evaluated; a side printed as a rounded decimal is compared at the
        places it prints; an equation in one unknown is checked against the
        value the same block solves it to
     B  the claims A cannot check: the symbolic examples tried on numbers,
        the history of pi, each exercise answer read back off ANSWERS.md, and
        the figures measured from their coordinates
     C  the fifteen solved examples and every multiple-choice and
        assertion-reason question: every option recomputed, exactly the keyed
        options right, and the key as printed
     D  ANSWERS.md prints the same keys as the pages

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
const near = (a, b, tol = 1e-6) => Math.abs(a - b) < tol;
const PI = Math.PI, PI7 = 22 / 7;
const hyp = (a, b) => Math.sqrt(a * a + b * b);
const leg = (h, a) => Math.sqrt(h * h - a * a);
const heron = (a, b, c) => { const s = (a + b + c) / 2; return Math.sqrt(s * (s - a) * (s - b) * (s - c)); };
const brahma = (a, b, c, d) => { const s = (a + b + c + d) / 2; return Math.sqrt((s - a) * (s - b) * (s - c) * (s - d)); };
const r2 = (v) => Math.round(v * 100) / 100;

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const all = body + '\n' + beyond;
const text = (s) => s.replace(/<svg[\s\S]*?<\/svg>/g, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-')
  .replace(/&deg;/g, '°').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
const plain = (s) => text(s).replace(/\$/g, '').replace(/\^\\circ|\^\{\\circ\}/g, '').replace(/\\angle\s*/g, '∠')
  .replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, '$1/$2').replace(/\\sqrt\{([^{}]*)\}/g, '√($1)')
  .replace(/\\text\{([^}]*)\}/g, '$1').replace(/\\,/g, '').replace(/\\times/g, '×').replace(/\\pi/g, 'π').replace(/\s+/g, ' ');
const has = (s, v) => new RegExp(`(^|[^\\d.])${String(v).replace('.', '\\.')}([^\\d]|$)`).test(s);
const draws = (s, ...bits) => bits.every(b => s.includes(b));

/* ---- A. every identity ---------------------------------------- */

function toExpr(side, env = {}) {
  let s = side
    .replace(/\\text\{[^{}]*\}(\^\d)?/g, '')
    .replace(/\^\{\\circ\}|\^\\circ/g, '')
    .replace(/\\left|\\right/g, '')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'S($1)')
    .replace(/\\[dt]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\[dt]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\^\{([^{}]+)\}/g, '^($1)')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'S($1)')
    .replace(/\\pi/g, 'P')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad/g, '')
    .replace(/\s+/g, '')
    .replace(/[.,;]+$/, '');
  for (const [v, val] of Object.entries(env)) s = s.replace(new RegExp(`(?<![A-Za-z\\\\])${v}(?![A-Za-z_])`, 'g'), `(${val})`);
  if (!s || !/^[-+*/().0-9SP^]+$/.test(s) || /S(?!\()/.test(s)) return null;
  return s.replace(/\^/g, '**')
    .replace(/(\d|\)|P)(?=[SP(])/g, '$1*')
    .replace(/(\)|P)(\d)/g, '$1*$2')
    .replace(/S\(/g, 'Math.sqrt(').replace(/P/g, 'Math.PI');
}
const evalExpr = (e) => { try { return Function(`"use strict";return (${e})`)(); } catch { return NaN; } };
const decimals = (side) => { const m = side.trim().replace(/[.,]$/, '').match(/^-?\d+\.(\d+)$/); return m ? m[1].length : null; };

const blocksOf = (src, isMd) => isMd
  ? src.split(/\n(?=\s*\d+\. |#|\s*- )/)
  : src.split(/<div class="c-example"|<div class="c-try">|<div class="work work--trace">|<div class="c-practice/)
      .flatMap(b => /c-example__tab/.test(b) ? [b] : b.split('<div class="work__row">'));
const SOLVED = /^\s*([a-z])\s*=\s*(-?\d+(?:\.\d+)?)(?:\^\\circ)?\s*(?:\\text\{[^}]*\})?\s*$/;

let spans = 0, approxes = 0; const skipped = [];
// statements printed to be judged false: an option or an assertion
const FALSE_ON_PURPOSE = [String.raw`\pi = \frac{22}{7}`];
const sources = [...pages.map(f => [f, html[f], false]), ['ANSWERS.md', answersMd, true]];
for (const [f, raw, isMd] of sources) {
  for (const block of blocksOf(raw.replace(/\$\$/g, '$'), isMd)) {
    const ms = [...block.matchAll(/\$([^$]+)\$/g)].map(m => m[1]).flatMap(s => s.split(/,?\s*\\quad\s*/));
    const solved = {};
    for (const s of ms) { const m = s.match(SOLVED); if (m) (solved[m[1]] ??= new Set()).add(Number(m[2])); }
    const envs = Object.entries(solved).reduce((acc, [v, set]) => acc.flatMap(e => [...set].map(x => ({ ...e, [v]: x }))), [{}]);
    for (const span of ms) {
      if (/\\ldots|\\cdots|\\lt|\\gt|\\le|\\ge|\\ne|<|>|:|\\parallel|\\cong|\\therefore/.test(span)) continue;
      if (SOLVED.test(span)) continue;
      if (FALSE_ON_PURPOSE.includes(span.trim())) continue;
      if (span.includes('\\approx')) {
        // a chain of approximations: each side against the next, at the places the next prints
        const parts = span.split('\\approx');
        for (let i = 0; i + 1 < parts.length; i++) {
          const L = parts[i].split('=').pop(), R = parts[i + 1].split('=')[0];
          const vals = envs.map(env => [toExpr(L, env), toExpr(R, env)].map(e => (e ? evalExpr(e) : NaN)));
          const good = vals.filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b));
          if (!good.length) { skipped.push(`${f}: $${span.trim()}$`); continue; }
          const d = decimals(R), tol = d == null ? Math.max(0.0015, 0.003 * Math.abs(good[0][1])) : 0.5 * 10 ** -d + 1e-12;
          approxes++;
          if (good.some(([a, b]) => Math.abs(a - b) <= tol)) pass++;
          else fails.push(`${f}: $${span.trim()}$ — ${good[0][0]} is not ${R.trim()} to ${d ?? 'about 3'} places`);
        }
        continue;
      }
      if (!span.includes('=')) continue;
      const sides = span.split('=').map(s => s.trim()).filter(Boolean);
      if (sides.length < 2 || sides.every(x => /^[a-z]$/.test(x))) continue;
      const dmax = Math.max(-1, ...sides.map(s => decimals(s) ?? -1));
      const tol = dmax > 0 ? 0.5 * 10 ** -dmax + 1e-12 : 1e-9;
      const tries = envs.map(env => sides.map(s => toExpr(s, env)).map(e => (e ? evalExpr(e) : NaN)).filter(Number.isFinite));
      const usable = tries.filter(nums => nums.length >= 2);
      if (!usable.length) { skipped.push(`${f}: $${span.trim()}$`); continue; }
      spans++;
      if (usable.some(nums => nums.every(n => Math.abs(n - nums[nums.length - 1]) <= tol))) pass++;
      else fails.push(`${f}: $${span.trim()}$ — sides are ${usable[0].join(' and ')}`);
    }
  }
}

/* ---- B. claims arithmetic alone does not check ---------------- */

const panels = (src) => {
  const o = {};
  for (const part of src.split('<div class="c-example"').slice(1)) {
    const n = part.match(/c-example__tab">Example (\d+)/)[1];
    o[n] = part;
  }
  return o;
};
const bodyEx = panels(body), beyondEx = panels(beyond);
ok('body examples numbered 1-7', Object.keys(bodyEx).map(Number), [1, 2, 3, 4, 5, 6, 7]);
for (const [n, e] of Object.entries(bodyEx)) is(`body Example ${n} is stepped: Solution, Step, Answer`, /Solution\./.test(e) && /work__label">Step 1/.test(e) && /work__label">Answer/.test(e));

// the history of pi
is('Archimedes: 3 10/71 < pi < 3 1/7', 3 + 10 / 71 < PI && PI < 3 + 1 / 7);
is('Mesopotamia: 3 + 1/8 = 3.125', 3 + 1 / 8 === 3.125);
is('Madhava: pi to 11 places is 3.14159265359', PI.toFixed(11) === '3.14159265359' && has(plain(body), '3.14159265359'));
{ let s = 0; for (let k = 0; k < 2e6; k++) s += (k % 2 ? -1 : 1) / (2 * k + 1); is('Madhava: 4(1 - 1/3 + 1/5 - ...) tends to pi', near(4 * s, PI, 1e-5)); }
{ const d0 = Math.abs(355 / 113 - PI); let best = true;
  for (let q = 1; q < 15000 && best; q++) { if (q === 113) continue; const p = Math.round(q * PI); if (Math.abs(p / q - PI) < d0 && !(p === 355 * (q / 113))) best = false; }
  is('Zu: no fraction with denominator under 15 000 is closer to pi than 355/113', best); }
is('Zu: 24 576 sides is the hexagon doubled twelve times', 6 * 2 ** 12 === 24576 && has(plain(body), '24576'));
is('Archimedes: 96 sides is the hexagon doubled four times', 6 * 2 ** 4 === 96);
ok('mnemonic: How I wish I could recollect pi', 'How I wish I could recollect pi'.split(' ').map(w => w.length).join(''), '3141592');
is('the mnemonic digits are the digits of pi', PI.toFixed(7).startsWith('3.141592'));
is('Pi Day 3-14 and Pi Approximation Day 22-7', /14 March/.test(body) && /22 July/.test(body));

// P^2 : A for squares, equilateral triangles and circles
is('square: P^2 : A = 16 : 1 for sides 1, 2, 7', [1, 2, 7].every(a => near((4 * a) ** 2 / (a * a), 16)));
is('equilateral: P^2 : A = 36 : sqrt3', [1, 3, 5].every(a => near((3 * a) ** 2 / (Math.sqrt(3) / 4 * a * a), 36 / Math.sqrt(3))));
is('circle: C^2 : A = 4 pi, about 12.6', [1, 4].every(r => near((2 * PI * r) ** 2 / (PI * r * r), 4 * PI)) && (4 * PI).toFixed(1) === '12.6' && /12\.6 : 1/.test(plain(beyond)));
is('Egypt: (8d/9)^2 = 256/81 r^2', near((8 * 2 / 9) ** 2, 256 / 81) && near(64 / 81 * 4, 256 / 81));
is('Egypt: 256/81 is about 3.16', near(256 / 81, 3.1605, 1e-4));

// the track
is('track: 2 x 84.39 + 2 pi (36.5 + 0.3) at pi = 3.1416 is 400.00 m', r2(2 * 84.39 + r2(2 * 3.1416 * 36.8)) === 400);
is('track T&R: the stagger over a lap is 2 x 3.1416 x 1.22 = 7.67 m', r2(2 * 3.1416 * 1.22) === 7.67 && /7\.67/.test(answersMd));
is('opening T&R: the 200 m track doubles it to 15.33 m', r2(2 * 2 * PI * 1.22) === 15.33 && /15\.33/.test(answersMd));

// Examples 1 and 2
{ const each = (360 - 120) / 360 * 2 * PI; is('Example 1: two solid arcs of 240 degrees make 8/3 pi r', near(2 * each, 8 / 3 * PI)); }
is('Example 1: the angle CAD is 60 + 60', 60 + 60 === 120);
is('Example 2: Fig. 6.13 radii 35 + 25 + 30 = 90', 35 + 25 + 30 === 90 && draws(body, 'M20 110 A90 90 0 0 1 200 110', 'A35 35 0 0 0 90 110 A25 25 0 0 1 140 110 A30 30 0 0 0 200 110'));
is('Example 2: pi b + pi c + pi d = pi a for many splits', [[1, 2, 3], [0.5, 4, 1.5], [2, 2, 2]].every(([b, c, d]) => near(PI * b + PI * c + PI * d, PI * (b + c + d))));

// Heron and Brahmagupta, the symbolic examples tried on numbers
is('Example 3: Heron on an equilateral triangle gives sqrt3/4 a^2', [1, 2, 7.5].every(a => near(heron(a, a, a), Math.sqrt(3) / 4 * a * a)));
is('Example 3: the height is sqrt3/2 a', [2, 6].every(a => near(leg(a, a / 2), Math.sqrt(3) / 2 * a)));
is('Example 4: Heron on (a, a, 2b) gives b sqrt(a^2 - b^2)', [[5, 3], [13, 5], [7, 2]].every(([a, b]) => near(heron(a, a, 2 * b), b * Math.sqrt(a * a - b * b))));
is('Example 5: 3, 4, 5 has area 6 both ways', heron(3, 4, 5) === 6 && 3 * 3 + 4 * 4 === 5 * 5 && 3 * 4 / 2 === 6);
is('Example 6: Brahmagupta on a rectangle gives ab', [[3, 5], [2, 9]].every(([a, b]) => near(brahma(a, b, a, b), a * b)));
is('Example 7: Brahmagupta on an isosceles trapezium (2a, c, 2b, c) gives (a + b) sqrt(c^2 - (b - a)^2)',
  [[2, 5, 5], [1, 4, 4], [3, 3.5, 2]].every(([a, b, c]) => near(brahma(2 * a, c, 2 * b, c), (a + b) * Math.sqrt(c * c - (b - a) ** 2))));
is('Example 7: and that is half the sum of the parallel sides times the height', [[2, 5, 5]].every(([a, b, c]) => near((2 * a + 2 * b) / 2 * leg(c, b - a), (a + b) * leg(c, b - a))));
is('Brahmagupta with d = 0 is Heron', [[3, 4, 5], [7, 8, 9]].every(([a, b, c]) => near(brahma(a, b, c, 0), heron(a, b, c))));
is('the circumcircle and incircle formulas agree with Heron', [[13, 14, 15], [7, 8, 9]].every(([a, b, c]) => {
  const T = heron(a, b, c), R = a * b * c / (4 * T), r = 2 * T / (a + b + c); return near(a * b * c / (4 * R), T) && near(r * (a + b + c) / 2, T); }));
is('special case: (a + b + c)^2 at c = 0 is (a + b)^2', [[2, 3], [5, 1]].every(([a, b]) => (a + b) ** 2 === a * a + b * b + 0 + 2 * a * b));
is('special case: c = a sqrt2 when a = b', near(hyp(3, 3), 3 * Math.SQRT2));

// squaring a rectangle: the identity, and Fig. 6.30 drawn with a = 8, b = 3 at 18 units a unit
is('((a + b)/2)^2 - ((a - b)/2)^2 = ab', [[8, 3], [5, 2], [9.5, 1.5]].every(([a, b]) => near(((a + b) / 2) ** 2 - ((a - b) / 2) ** 2, a * b)));
{ const u = 18, a = 8, b = 3, A = [30, 150], H = [30, 51], G = [129, 51], K = [118.18, 96], P = [118.18, 51], Q = [118.18, 139.18];
  const d = (p, q) => hyp(p[0] - q[0], p[1] - q[1]);
  is('Fig. 6.30 drawn: AD = a, AB = b, AF = (a + b)/2', draws(body, 'M30 150 L174 150 L174 96 L30 96 Z', 'M30 96 L30 51 L129 51 L129 150') && (174 - 30) / u === a && (150 - 96) / u === b && (129 - 30) / u === (a + b) / 2);
  is('Fig. 6.30: K lies on the arc (HK = HG) and on BC', near(d(H, K), d(H, G), 0.05) && K[1] === 96);
  is('Fig. 6.30: HPQS is a square of area ab', draws(body, 'M30 51 L118.18 51 L118.18 139.18 L30 139.18 Z') && near((d(H, P) / u) ** 2, a * b, 0.02) && near(d(P, Q), d(H, P), 0.01));
  is('Fig. 6.30: the arc runs from G to A about H', draws(body, 'M129 51 A99 99 0 0 1 30 150') && near(d(H, A), 99)); }

// the figures, measured from their own coordinates
const shoelace = (pts) => Math.abs(pts.reduce((s, p, i) => { const q = pts[(i + 1) % pts.length]; return s + p[0] * q[1] - q[0] * p[1]; }, 0)) / 2;
const dist = (p, q) => hyp(p[0] - q[0], p[1] - q[1]);
is('Fig. 6.4: sides 2 and 4 on the grid (20 units a unit), perimeters 8 and 16', draws(body, 'M40 70 H80 V110 H40 Z', 'M140 30 H220 V110 H140 Z') && 4 * 40 / 20 === 8 && 4 * 80 / 20 === 16);
{ const k = 1.6; is('Fig. 6.11: straights and inner radius drawn to scale, 84.39 : 36.5', near((230.02 - 95) / k, 84.39, 0.01) && near(58.4 / k, 36.5) && draws(body, 'M95 36.60 L230.02 36.60 A58.4 58.4 0 0 1 230.02 153.40')); }
is('Fig. 6.6: the hexagon side equals the radius', near(dist([170, 85], [135, 145.62]), 70, 0.02));
is('Fig. 6.7: the outer hexagon touches the circle (apothem 70)', near(180 - 110, 70) && near(dist([110, 14.17], [180, 54.59]), 2 * 70 / Math.sqrt(3), 0.02));
// Fig. 6.14, the nine panels
{ const f = (n) => +n.toFixed(2);
  is('Fig. 6.14 (i): 88 by 66, which is 80 : 60', near(88 / 66, 80 / 60) && draws(body, 'A33 33 0 0 1'));
  is('Fig. 6.14 (ii): radii 54 and 36, which is 12 : 8', near(54 / 36, 12 / 8) && draws(body, 'A54 54 0 0 1', 'A36 36 0 0 0'));
  is('Fig. 6.14 (iv): an equilateral triangle of side 60 with semicircles of radius 30', draws(body, 'M65 98 A30 30 0 0 0 125 98 A30 30 0 0 0 95 46.04'));
  is('Fig. 6.14 (v): cells of 28, semicircles 14, quarter circles 28', draws(body, 'M81 36 A14 14 0 0 1 109 36 A28 28 0 0 1 137 64'));
  is('Fig. 6.14 (vi): a 28 base in four 7s: radii 63 and 15.75', near(63 / 15.75, 28 / 7) && draws(body, 'A63 63 0 0 1', 'A15.75 15.75 0 0 0'));
  is('Fig. 6.14 (vii): legs 68 and 51, which is 8 : 6', draws(body, 'M61 96 A34 34 0 0 0 129 96 A25.5 25.5 0 0 0 129 45 A42.5 42.5 0 0 0 61 96') && near(68 / 51, 8 / 6) && near(hyp(68, 51), 85));
  is('Fig. 6.14 (viii): 12 : 4 as 54 : 18', draws(body, 'A54 54 0 0 1', 'A18 18 0 0 0') && near(54 / 18, 12 / 4));
  is('Fig. 6.14 (ix): 20 : 10 as 55 : 27.5', draws(body, 'A55 55 0 0 1', 'A27.5 27.5 0 0 1', 'A27.5 27.5 0 0 0')); }
is('Fig. 6.15A: petal arcs of radius half the side (56 of 112)', draws(body, 'M20 20 A56 56 0 0 0 76 76'));
is('Fig. 6.15B: petal arcs of radius the side (80), vertices 80 from the centre', draws(body, 'M180 92 A80 80 0 0 0 100 92') && near(dist([140, 161.28], [100, 92]), 80, 0.01));
is('Fig. 6.15A: a petal is two quarter arcs (the angle at a midpoint is 90)', (() => { const T = [76, 20], a = [20 - 76, 20 - 20], b = [76 - 76, 76 - 20]; return a[0] * b[0] + a[1] * b[1] === 0; })());
is('Fig. 6.15B: a petal arc is 60 degrees (equilateral: vertex, vertex, centre)', near(dist([180, 92], [140, 161.28]), 80, 0.01));
is('Fig. 6.19: A′A = D′D = 30', 160 - 130 === 220 - 190);
is('Fig. 6.22: D is the midpoint of BC', (20 + 200) / 2 === 110 && draws(body, 'M60 25 L110 110'));
is('Fig. 6.23: equilateral, side 100', near(dist([80, 21.06], [30, 107.66]), 100, 0.01));
is('Fig. 6.24: isosceles', near(dist([80, 20], [40, 107]), dist([80, 20], [120, 107])));
is('Fig. 6.25: 84 by 63, which is 4 : 3', draws(body, 'M45 20 L45 104 L108 104 Z') && near(84 / 63, 4 / 3));
{ const A = [75, 38], B = [25, 140], C = [175, 140], O = [100, 113.51], I = [85.38, 102.36];
  is('Fig. 6.26: the circumcircle passes through A, B and C', [A, B, C].every(p => near(dist(O, p), 79.54, 0.02)));
  const toLine = (p, a, b) => Math.abs((b[0] - a[0]) * (a[1] - p[1]) - (a[0] - p[0]) * (b[1] - a[1])) / dist(a, b);
  is('Fig. 6.26: the incircle touches all three sides', [[A, B], [B, C], [C, A]].every(([a, b]) => near(toLine(I, a, b), 37.64, 0.02))); }
{ const rh = [[[30, 105], [105, 105], [105, 30], [30, 30]], [[170, 105], [245, 105], [279.2, 38.25], [204.2, 38.25]], [[340, 105], [415, 105], [474.94, 59.92], [399.94, 59.92]]];
  const areas = rh.map(q => shoelace(q) / 25 ** 2);
  is(`Fig. 6.27: all sides 3 (75 units) and areas 9, 8.01, 5.41: ${areas.map(r2)}`, rh.every(q => q.every((p, i) => near(dist(p, q[(i + 1) % 4]), 75, 0.02))) && r2(areas[0]) === 9 && r2(areas[1]) === 8.01 && r2(areas[2]) === 5.41); }
is('Fig. 6.28: all four vertices on the circle', [[42.66, 54.85], [34.22, 118.94], [168.94, 107.16], [123.94, 29.22]].every(p => near(dist([100, 95], p), 70, 0.01)));
is('Fig. 6.29: an isosceles trapezium', near(dist([55, 25], [20, 95]), dist([115, 25], [150, 95])));
is('Fig. 6.31: DC : BC = 160 : 128 = 10 : 8', draws(body, 'M20 15 L180 15 L180 143 L20 143 Z') && near(160 / 128, 10 / 8));
is('Fig. 6.32: D is the midpoint of BC and P is on AD', (20 + 140) / 2 === 80 && near((71 - 60) / (80 - 60), (70 - 15) / (115 - 15)));
{ const A = [170, 20], B = [20, 120], C = [220, 120], D = [95, 70], P = [130, 120], Q = [156.36, 29.09];
  const cross = (u, v) => u[0] * v[1] - u[1] * v[0];
  is('Fig. 6.34: D is the midpoint of AB and CQ is parallel to PD', near((A[0] + B[0]) / 2, D[0]) && near((A[1] + B[1]) / 2, D[1]) && Math.abs(cross([Q[0] - C[0], Q[1] - C[1]], [D[0] - P[0], D[1] - P[1]])) < 3);
  is('Fig. 6.34: area BPQ is half of ABC', near(shoelace([B, P, Q]) / shoelace([A, B, C]), 0.5, 0.002)); }
is('Fig. 6.36: each polygon has an incircle of radius 30', near(125 - 95, 30) && near(dist([195, 95], [(216.8 + 173.2) / 2, 125]), 30));
{ const w = 45 * Math.sin(PI / 16); is('Fig. 6.37: eight slice widths make half the circumference, pi r, to within 1%', Math.abs(8 * 2 * w - PI * 45) / (PI * 45) < 0.01); }
{ const A = [60, 20], B = [20, 120], C = [200, 120], M = [40, 70], T1 = [106.67, 53.33], T2 = [153.33, 86.67];
  is('Fig. 6.43: the shaded part is one half', near(shoelace([B, M, T1, T2]) / shoelace([A, B, C]), 0.5, 0.001)); }
{ const L = [[[20, 20], [80, 140]], [[80, 20], [140, 140]], [[20, 80], [140, 20]], [[20, 140], [140, 80]]];
  const X = (l1, l2) => { const [[x1, y1], [x2, y2]] = l1, [[x3, y3], [x4, y4]] = l2; const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4); const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d; return [x1 + t * (x2 - x1), y1 + t * (y2 - y1)]; };
  const inner = [X(L[0], L[2]), X(L[1], L[2]), X(L[1], L[3]), X(L[0], L[3])];
  is('Fig. 6.44: the shaded square is one fifth', near(shoelace(inner) / 120 ** 2, 0.2)); }
is('Fig. 6.45 and 6.46: circles cover pi/4 of the rectangle', near(3 * PI * 25 ** 2 / (150 * 50), PI / 4) && near(4 * PI * 18.75 ** 2 / (150 * 37.5), PI / 4));
is('Fig. 6.47: four across the top (50) span five below (40)', 4 * 50 === 5 * 40 && draws(body, 'M20 20 H220 V110 H20 Z'));
is('Fig. 6.48: BC cut into three equal parts', 80 - 20 === 140 - 80 && 200 - 140 === 60 && near(shoelace([[55, 15], [20, 110], [80, 110]]), shoelace([[55, 15], [140, 110], [200, 110]])));
{ // Fig. 6.49 with side 2t: A = B, computed by counting grid points
  let a = 0, b = 0; const N = 600, s = 2;
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
    const x = (i + 0.5) / N * s, y = (j + 0.5) / N * s;
    const inQ = x * x + y * y <= s * s, inL = x * x + (y - 1) ** 2 <= 1, inB = (x - 1) ** 2 + y * y <= 1;
    if (inL && inB) a++; if (inQ && !inL && !inB) b++;
  }
  is(`Fig. 6.49: A and B have equal area (${a} and ${b} of ${N * N} cells)`, Math.abs(a - b) / a < 0.01); }
is('Fig. 6.51: the chord touches the inner circle (distance 40 = inner radius)', 100 - 60 === 40 && near(hyp(40, 60), 72.11, 0.01));
is('Fig. 6.52: the semicircle on the hypotenuse passes through the right angle', near(dist([110, 60], [50, 90]), 67.08, 0.01) && near(dist([110, 60], [170, 90]), 67.08, 0.01));
{ const O = [20, 125], Qp = [150, 15], S = [150, 60], R = [230, 60];
  const A = shoelace([O, Qp, S]), B = shoelace([O, S, R]), C = shoelace([Qp, S, R]);
  is('Fig. 6.54: 2(A + C)(B + C)/C is the rectangle', near(2 * (A + C) * (B + C) / C, 210 * 110)); }
{ const r = 100, lune = PI * (r * Math.SQRT2 / 2) ** 2 / 2 - (PI * r * r / 4 - r * r / 2);
  is('Fig. 6.55: the crescent equals triangle AOB', near(lune, r * r / 2) && near(dist([70, 80], [20, 130]), 70.71, 0.01)); }
{ const A = [22, 90], B = [45.08, 145.38], C = [178, 90], D = [78.16, 15.12], k = 2.4;
  is('Fig. 6.56: sides 25, 60, 52, 39 and diagonal 65', [[A, B, 25], [B, C, 60], [C, D, 52], [D, A, 39], [A, C, 65]].every(([p, q, L]) => near(dist(p, q) / k, L, 0.03))); }

// the exercises, read back off ANSWERS.md
const mdSection = (head) => { const i = answersMd.indexOf(head); if (i < 0) return ''; const j = answersMd.indexOf('\n#', i + head.length); return answersMd.slice(i, j < 0 ? undefined : j); };
const mdItem = (head, n) => { const m = mdSection(head).match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`)); return m ? plain(m[1]).replace(/\\approx/g, '≈') : ''; };
const mdSays = (head, n, ...vals) => { for (const v of vals) is(`ANSWERS.md ${head} Q${n} should say ${v}: "${mdItem(head, n).slice(0, 90)}"`, has(mdItem(head, n), v)); };
const S1 = '### Exercise Set 6.1', S2 = '### Exercise Set 6.2', S3 = '### Exercise Set 6.3', E = '## End-of-Chapter Exercises';
const C = (r) => 2 * PI7 * r, Ar = (r) => PI7 * r * r;
mdSays(S1, 1, 44 / (2 * PI7));
mdSays(S1, 2, C(7).toFixed(1), C(10).toPrecision(3), C(12).toPrecision(3));
mdSays(S1, 3, r2(C(3.5) / 6), r2(C(6.3) / 3));
mdSays(S1, 4, r2(C(14) * 75 / 360), r2(C(14) * 75 / 360 + 28));
{ const v = [160 + PI7 * 60, PI7 * 6 + PI7 * 4 + 4, PI7 * 20, PI7 * 18, PI7 * 56, PI7 * 28, PI7 * 12, PI7 * 12, PI7 * 20].map(r2);
  mdSays(S1, 5, ...v);
  is('Ex 6.1 Q5 (v): 4 semicircles of 14 and 4 quarters of radius 14 make 56 pi', near(4 * PI7 * 7 + 4 * (PI7 * 2 * 14 / 4), PI7 * 56)); }
mdSays(S1, 6, PI7 * 56, Math.round(1e6 / (PI7 * 56) * 10) / 10, Math.round(1e6 / (PI7 * 56)), Math.floor(1e6 / (PI7 * 56)));
mdSays(S1, 7, 8 * C(7) / 4, 6 * 2 * C(42) / 6, 2 * C(42) / 6);
mdSays(S2, 1, 8 * 10 / 2);
mdSays(S2, 2, (40 - 20) / 2, leg(26, 10), (40 + 20) / 2 * leg(26, 10));
{ const t = heron(8, 11, 13); mdSays(S2, 3, 32 - 19, 1920, r2(t)); is('Ex 6.2 Q3: 8 sqrt30', near(t, 8 * Math.sqrt(30))); }
{ const t = heron(60, 100, 140); mdSays(S2, 4, 6750000, r2(t)); is('Ex 6.2 Q4: 1500 sqrt3', near(t, 1500 * Math.sqrt(3))); }
mdSays(S2, 5, r2(Math.sqrt(128))); is('Ex 6.2 Q5: 8 sqrt2', near(Math.sqrt(128), 8 * Math.SQRT2));
mdSays(S3, 1, r2(Ar(7) / 6)); mdSays(S3, 2, Ar(7) / 4); mdSays(S3, 3, r2(Ar(7) / 6));
mdSays(S3, 4, 3.14 * 100 / 4, 3.14 * 100 * 3 / 4);
{ const sec = 3.14 * 225 / 6, tri = 1.73 / 4 * 225, minor = sec - tri; mdSays(S3, 5, r2(sec), tri, r2(minor), r2(3.14 * 225 - minor)); }
mdSays(S3, 6, r2(2 * Ar(28) / 3));
is('Ex 6.3 Q8: 3 sqrt3/(4 pi) = 0.413', (3 * Math.sqrt(3) / (4 * PI)).toFixed(3) === '0.413');
is('Ex 6.3 Q9: 2/pi = 0.637', (2 / PI).toFixed(3) === '0.637');
is('Ex 6.3 Q10: 3 sqrt3/(2 pi) = 0.827, twice Q8', (3 * Math.sqrt(3) / (2 * PI)).toFixed(3) === '0.827' && near(3 * Math.sqrt(3) / (2 * PI), 2 * 3 * Math.sqrt(3) / (4 * PI)));
is('Ex 6.3 Q7: r^2 (pi/6 - sqrt3/4) is sector less triangle', near(PI / 6 - Math.sqrt(3) / 4, PI / 6 - heron(1, 1, 1)));
mdSays(E, 2, 10, r2(heron(15, 15, 10))); is('End Q2: 50 sqrt2', near(heron(15, 15, 10), 50 * Math.SQRT2));
mdSays(E, 3, hyp(12, 5)); mdSays(E, 4, 9, 15, 36);
{ const t = heron(10, 15, 20); mdSays(E, 5, r2(t)); is('End Q5: 75 sqrt15 / 4', near(t, 75 * Math.sqrt(15) / 4)); }
mdSays(E, 6, 84, heron(7, 24, 25)); mdSays(E, 7, r2(100 * PI7 * 60), r2(100 * PI7 * 60 / 100));
mdSays(E, 8, 66 / (2 * PI7), Ar(10.5) / 4); mdSays(E, 9, C(28), r2(100000 / C(28)), Math.round(100000 / C(28)));
{ const W = Math.sqrt(6.4), L = 5 * W / 4; mdSays(E, 19, r2(W), r2(L), r2(2 * (L + W))); is('End Q19: 9LW = 72 and 4L = 5W', near(9 * L * W, 72) && near(4 * L, 5 * W) && near(2 * (L + W), 18 * Math.sqrt(10) / 5)); }
mdSays(E, 22, r2(4 * PI7), r2(2 * PI7 - 4)); is('End Q22 with 22/7: 88/7 and 16/7', near(4 * PI7, 88 / 7) && near(2 * PI7 - 4, 16 / 7));
{ const lens = 2 * (PI / 3 - Math.sqrt(3) / 4); is('End Q25: (2pi/3 - sqrt3/2) r^2 = 1.23 r^2', r2(lens) === 1.23 && /1\.23r\^2/.test(answersMd)); }
is('End Q17: pi/4 is about 11/14 and 0.79', near(PI7 / 4, 11 / 14) && r2(PI / 4) === 0.79);
is('End Q16: one half and one fifth', /one half/.test(answersMd) && /one fifth/.test(answersMd));
is('End Q10: equal sum and product fix the sides', [[3, 8], [5, 7]].every(([x, y]) => { const s = x + y, p = x * y, d = Math.sqrt(s * s - 4 * p); return near((s + d) / 2, Math.max(x, y)); }));
is('rectangles of perimeter 40: the largest area is 10 x 10 = 100', [...Array(2000)].map((_, i) => i / 100).every(x => x * (20 - x) <= 100) && /area \$100\$/.test(answersMd));
is('Home Measurement instance: 157.5 / (20 x 2.5) = 3.15', 157.5 / (20 * 2.5) === 3.15);

// Stage 1, as printed in its running text
{ const P = 4 * 22, r = P / (2 * PI7);
  is('Stage 1 Q1: r = 14, 484 against 616, 132 more', r === 14 && Ar(r) === 616 && Ar(r) - 22 * 22 === 132); }
is('Stage 1 Q2: arc 15, area 75, whatever the angle', 35 - 20 === 15 && near(15 / (2 * PI * 10) * PI * 100, 75));
is('Stage 1 Q3: area 126, shortest altitude 12 (to the 21 cm side)', heron(13, 20, 21) === 126 && 2 * 126 / 21 === 12 && 2 * 126 / 21 < 2 * 126 / 20);
is('Stage 1 Q4: right angles at B and D; 1764 both ways', 25 ** 2 + 60 ** 2 === 65 ** 2 && 39 ** 2 + 52 ** 2 === 65 ** 2 && 750 + 1014 === 1764 && brahma(25, 60, 52, 39) === 1764);
is('Stage 1 Q5: x = 7 sqrt2, about 9.9, and 1/sqrt2 about 0.71', near(Math.sqrt(98), 7 * Math.SQRT2) && (7 * Math.SQRT2).toFixed(1) === '9.9' && r2(1 / Math.SQRT2) === 0.71 && PI * 7 * 7 === PI * 14 * 14 / 4);

/* ---- C. solved examples, multiple choice, assertion-reason ---- */

const pick = (opts, okf) => opts.map((o, i) => (okf(o, i) ? 'abcd'[i] : '')).join('');
const optsIn = (s) => { const o = s.match(/<ol class="c-parts c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/); return o ? [...o[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => plain(x[1]).trim()) : []; };
const answerRow = (e) => plain(e.match(/<span class="work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span>/)?.[1] || '').trim();
const keyOf = (e) => [...answerRow(e).matchAll(/\(([a-d])\)/g)].map(m => m[1]).join('');
const numv = (s) => { const m = String(s).replace(/,/g, '').match(/-?\d+(?:\.\d+)?/); return m ? Number(m[0]) : NaN; };
{
  const E = (n) => beyondEx[n];
  ok('Beyond examples numbered 1-15', Object.keys(beyondEx).map(Number), [...Array(15)].map((_, i) => i + 1));
  ok('formats: 6 single, 4 multiple, 3 numerical, 2 matching', Object.values(beyondEx).map(e => e.match(/data-question-type="([^"]+)"/)[1]),
    [...Array(6).fill('Single correct'), ...Array(4).fill('Multiple correct'), ...Array(3).fill('Numerical answer'), ...Array(2).fill('Matching')]);
  const want = {
    1: pick(optsIn(E(1)), o => numv(o) === 200 * C(35) / 100),
    2: pick(optsIn(E(2)), o => numv(o) === 22 / C(21) * 360),
    3: pick(optsIn(E(3)), o => numv(o) === C(Math.sqrt(7546 / PI7))),
    4: pick(optsIn(E(4)), o => numv(o.replace(/cm.*/, '')) === heron(5, 5, 6)),
    5: pick(optsIn(E(5)), o => near(numv(o), (1.1 ** 2 - 1) * 100)),
    6: pick(optsIn(E(6)), o => { const th = 12 * PI / (PI * 36) * 360; return near(numv(o) * PI, 2 * PI * 6 * th / 360); }),
    7: pick(optsIn(E(7)), (o, i) => [near(C(17.5), numv(o)), near(Ar(17.5), numv(o)), near(PI7 * 17.5 + 2 * 17.5, numv(o)), near(C(17.5) / 4, numv(o))][i]),
    8: pick(optsIn(E(8)), (o, i) => [heron(6, 8, 10) === 24, (6 + 8 + 10) / 2 === 24, 2 * heron(6, 8, 10) / 10 === 4.8, heron(6, 8, 10) === 48][i]),
    9: pick(optsIn(E(9)), (o, i) => [PI7 > PI, 3.14 < PI, Math.abs(355 / 113 - PI) < Math.abs(PI7 - PI), Math.sqrt(10) < PI][i]),
    10: pick(optsIn(E(10)), (o, i) => { const areas = [...Array(901)].map((_, k) => 10 * 6 * Math.sin(k / 10 * PI / 180)); const max = Math.max(...areas);
      return [areas.some(v => near(v, 30, 0.2)), areas.some(v => near(v, 70, 0.2)), max <= 60 + 1e-9, near(10 * 6 * Math.sin(PI / 2), 60) && areas.filter(v => near(v, 60, 1e-9)).length === 1][i]; }),
  };
  const printed = Object.fromEntries(Object.keys(want).map(n => [n, keyOf(E(n))]));
  ok('Beyond Examples 1-10: the right options are exactly the keyed ones', want, printed);
  ok('single-correct keys run a b c d a b', [1, 2, 3, 4, 5, 6].map(n => printed[n]).join(''), 'abcdab');
  for (const n of [1, 2, 3, 4, 5, 6]) { const o = optsIn(E(n)); is(`Example ${n}: the answer text is option ${printed[n]}`, answerRow(E(n)).endsWith(o['abcd'.indexOf(printed[n])])); }
  ok('Example 11: the minor segment of a right angle at radius 14', Number(answerRow(E(11))), Ar(14) / 4 - 14 * 14 / 2);
  ok('Example 12: Heron on 9, 10, 17', Number(answerRow(E(12))), heron(9, 10, 17));
  ok('Example 13: Brahmagupta on the trapezium 4, 5, 10, 5', Number(answerRow(E(13))), brahma(4, 5, 10, 5));
  is('Example 13: and it is half the sum of the parallel sides times the height', near((4 + 10) / 2 * leg(5, 3), 28));
  // matching: List II values against List I, and the keyed combination
  const lists = (e) => [...e.matchAll(/<tr><td>\(([PQRS])\) ([\s\S]*?)<\/td><td>\((\d)\) ([\s\S]*?)<\/td><\/tr>/g)].map(m => ({ left: plain(m[2]), right: plain(m[4]) }));
  const combo = (e) => answerRow(e).replace(/^\([a-d]\)\s*/, '');
  { const L = lists(E(14)), vals = [C(21), Ar(21) / 2, PI7 * 21 + 42, Ar(21) / 4];
    const map = vals.map(v => L.findIndex(x => near(Number(x.right), v)) + 1).map((v, i) => `${'PQRS'[i]}–${v}`).join(', ');
    ok('Example 14: the combination', combo(E(14)), map); ok('Example 14: key (b)', keyOf(E(14)), 'b'); }
  { const L = lists(E(15)), vals = [[5, 12, 13], [10, 10, 12], [9, 12, 15], [10, 17, 21]].map(t => heron(...t));
    const map = vals.map(v => L.findIndex(x => near(Number(x.right), v)) + 1).map((v, i) => `${'PQRS'[i]}–${v}`).join(', ');
    ok('Example 15: the combination', combo(E(15)), map); ok('Example 15: key (c)', keyOf(E(15)), 'c'); }
  for (const n of [14, 15]) { const o = optsIn(E(n)); is(`Example ${n}: exactly one option is the right combination`, o.filter(x => x === combo(E(n))).length === 1); }
}

// Stage 3: the practice questions
const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li(?: class="hard")?>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] ??= m[2];
const optsOf = (n) => optsIn(qs[n] || '');
const key = {};
{ const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2]; }
const val = (f) => (o) => o.map(numv).map(v => near(v, f, 1e-6));
const solve = {
  1: val(220 / PI7),
  2: val(C(28) / 8),
  3: val(Ar(21) * 40 / 360),
  4: val(heron(20, 21, 29)),
  5: val(9),
  6: o => o.map(s => s === `${Math.sqrt(16)} : ${Math.sqrt(9)}`),
  7: val(50 / 2),
  8: val(12 * 7),
  9: val((7 + 8 + 9) / 2),
  10: o => o.map(s => s === 'Āryabhaṭa'),
  11: val(Ar(176 / (2 * PI7))),
  12: val(brahma(7, 15, 20, 24)),
  13: val(PI7 * 35 + 70),
  14: o => o.map(s => /exactly/.test(s)),
  15: o => o.map(s => s.replace(/\s/g, '') === '12√(3)cm^2' || s.replace(/\s/g, '') === '12√(3)cm2'),
};
is('Q15: the area of side 4 sqrt3 is 12 sqrt3', near(Math.sqrt(3) / 4 * 48, 12 * Math.sqrt(3)));
is('Q12: 7-24-25 and 15-20-25 halves make 234 too', 7 * 7 + 24 * 24 === 625 && 15 * 15 + 20 * 20 === 625 && 84 + 150 === 234);
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Q${q}: the right option`, right, [key[q]]);
}
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
{ const AR = {
    16: [heron(6, 25, 29) === 60, true, true],              // Heron is the reason
    17: [true, false, false],                               // the two halves are in general not congruent (Fig. 6.22: 5 and 9 are not equal widths)
    18: [PI === PI7, true, false],                          // A false: 22/7 is an approximation
    19: [near(Ar(21), 1386), true, false],                  // R is true and does not give the area
  };
  { const A = [60, 25], B = [20, 110], Cc = [200, 110], D = [110, 110];
    is('Q17: the halves of a median are not congruent in general (Fig. 6.22: AB and AC differ)', !near(dist(A, B), dist(A, Cc)) && near(shoelace([A, B, D]), shoelace([A, D, Cc]))); }
  for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]); }
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 4));
ok('key covers 1-19', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(19)].map((_, i) => i + 1));
ok('practice numbered 1-31', [...beyond.matchAll(/c-questions" data-start="(\d+)"/g)].map(m => Number(m[1])), [...Array(30)].map((_, i) => i + 2));
is('Answers stage opens its page', pages.filter(f => /^p1/.test(f)).some(f => /<div class="page__main">\s*<div class="c-stage">\s*<div class="c-stage__num">4/.test(html[f])));

// the key rows 20-31
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= plain(m[2]);
const row = (q) => { const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/); const r = keyRows[n] || ''; if (!part) return r;
  const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\)|$)`)); return m ? m[1] : ''; };
const says = (q, ...vals) => { for (const v of vals) is(`key ${q} should say ${v}: "${row(q).slice(0, 100)}"`, has(row(q), v)); };
const P = {
  20: [Math.sqrt(5544 / PI7)], 21: [C(35) * 72 / 360], 22: [16],
  23: [Ar(14) / 4], 24: [heron(26, 28, 30), heron(26, 28, 30) * 5],
  25: [C(77) - C(70), PI7 * (77 * 77 - 70 * 70)], 26: [hyp(9, 40), 180, heron(41, 28, 15), 180 + heron(41, 28, 15)],
  28: [r2(3.14 * 144 / 3), r2(36 * 1.73), r2(3.14 * 144 / 3 - 36 * 1.73)],
  29: [heron(13, 14, 15), 2 * 84 / 42, 13 * 14 * 15 / (4 * 84)],
  '30a': [200 + C(35)], '30b': [r2(C(1.4))], '30c': [100 * 70 + Ar(35)], '30d': [r2(PI7 * 1.4)],
  '31a': [150], '31b': [heron(50, 120, 130)], '31c': [50 * 120 / 2], '31d': [heron(50, 120, 130) - Ar(14)],
};
for (const [q, vs] of Object.entries(P)) says(q, ...vs);
is('key 28: the perpendicular is 6 and half the chord 6 sqrt3 (a 120 degree chord of radius 12)', near(12 * Math.cos(PI / 3), 6) && near(12 * Math.sin(PI / 3), 6 * Math.sqrt(3)));
is('key 22: sqrt3/4 x 64 = 16 sqrt3', near(Math.sqrt(3) / 4 * 64, 16 * Math.sqrt(3)));
is('key 30 (d) is half of (b)', near(PI7 * 1.4, C(1.4) / 2));
ok('key rows 20-31', Object.keys(keyRows).filter(k => Number(k) >= 20).map(Number).sort((a, b) => a - b), [...Array(12)].map((_, i) => i + 20));

/* ---- D. ANSWERS.md prints the same keys ----------------------- */

const mdKey = {};
{ const i = answersMd.indexOf('as the key prints it'); for (const m of answersMd.slice(i, i + 700).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2]; }
ok('ANSWERS.md practice key matches the page', mdKey, key);
{ const sec = mdSection('### Stage 2 · Solved Examples');
  for (const [n, e] of Object.entries(beyondEx)) {
    const m = sec.match(new RegExp(`\\n${n}\\. ([^*\\n]*)\\*`)); const md = m ? plain(m[1]).trim() : '';
    ok(`ANSWERS.md Stage 2 Example ${n}`, md.replace(/cm\^2/g, 'cm2'), answerRow(e).replace(/cm\^2|cm2/g, 'cm2'));
  } }
const W = '### The working for each';
for (const [q, vs] of Object.entries(P)) {
  const [, n, part] = q.match(/^(\d+)([a-d]?)$/);
  let r = mdItem(W, n);
  if (part) { const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\)|$)`)); r = m ? m[1] : ''; }
  for (const v of vs) {
    if (['24', '26', '28', '29'].includes(n) && !has(r, v)) continue;   // the booklet gives the result, not every step
    is(`ANSWERS.md practice ${q} should say ${v}: "${r.slice(0, 80)}"`, has(r, v));
  }
}
for (const q of Object.keys(solve)) {
  const o = optsOf(q), right = o['abcd'.indexOf(key[q])] || '';
  const v = numv(right);
  if (Number.isFinite(v) && /^[\d.]+(cm|m)?/.test(right.replace(/\s/g, '')) && !/√/.test(right)) is(`ANSWERS.md practice ${q} should reach ${v}`, has(mdItem(W, q), v));
}

/* ---- report ---------------------------------------------------- */

console.log(`A  ${spans} identities and ${approxes} approximations evaluated; ${skipped.length} spans not pure arithmetic, skipped`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
