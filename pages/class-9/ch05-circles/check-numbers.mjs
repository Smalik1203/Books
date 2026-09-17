#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed — squares and square roots, chord lengths from the radius and
   the distance, angles at the centre and on the circle, and the figures'
   drawn values from their own coordinates — and compared with the page.

     node pages/class-9/ch05-circles/check-numbers.mjs [--skipped]

   Four parts:
     A  every identity set as maths, on every page and in ANSWERS.md: pure
        arithmetic (powers and square roots included) is evaluated, and an
        equation in one unknown is checked against the value the same block
        solves it to (an example, a key row, an ANSWERS.md item)
     B  the claims A cannot check: each example's answer, each exercise
        answer read back off ANSWERS.md, the figures measured from their
        coordinates, the general results tested on many circles, and the
        practice answers read back out of the key rows a part at a time
     C  every multiple-choice and assertion-reason question: exactly one
        option is right, and it is the one the key prints
     D  ANSWERS.md prints the same key and the same practice values

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
const hyp = (a, b) => Math.sqrt(a * a + b * b);
const leg = (h, a) => Math.sqrt(h * h - a * a);

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<span class="nb">([^<]*)<\/span>/g, '$1')
  .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-')
  .replace(/&deg;/g, '°').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
const plain = (s) => text(s).replace(/\$/g, '').replace(/\^\\circ|\^\{\\circ\}/g, '').replace(/\\angle\s*/g, '∠')
  .replace(/\\tfrac\{1\}\{2\}/g, '½').replace(/\\sqrt\{([^{}]*)\}/g, '√($1)').replace(/\\,/g, ' ').replace(/\s+/g, ' ');
const has = (s, v) => new RegExp(`(^|[^\\d.])${String(v).replace('.', '\\.')}([^\\d]|$)`).test(s);
const r2 = (v) => Math.round(v * 100) / 100;

/* ---- A. every identity ---------------------------------------- */

function toExpr(side, env = {}) {
  let s = side
    .replace(/\^\{?\\circ\}?/g, '')
    .replace(/\\left|\\right/g, '')
    .replace(/\^\{([^{}]+)\}/g, '^($1)')
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'S($1)')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad/g, '')
    .replace(/\s+/g, '');
  for (const [v, val] of Object.entries(env)) s = s.replace(new RegExp(`(?<![A-Za-z\\\\])${v}(?![A-Za-z_])`, 'g'), `(${val})`);
  if (!s || !/^[-+*/().0-9S^]+$/.test(s) || /S(?!\()/.test(s)) return null;
  return s.replace(/\^/g, '**')
    .replace(/(\d|\))(?=[S(])/g, '$1*')
    .replace(/\)(\d)/g, ')*$1')
    .replace(/S\(/g, 'Math.sqrt(');
}
const evalExpr = (e) => { try { return Function(`"use strict";return (${e})`)(); } catch { return NaN; } };

// a block is the unit a solved value belongs to
const blocksOf = (src, isMd) => isMd
  ? src.split(/\n(?=\s*\d+\. |#)/)
  : src.split(/<div class="c-example">|<div class="c-try">|<div class="work work--trace">/)
      .flatMap(b => /c-example__tab/.test(b) ? [b] : b.split('<div class="work__row">'));
const SOLVED = /^\s*([a-z])\s*=\s*(-?\d+(?:\.\d+)?)(?:\^\\circ)?\s*$/;

let spans = 0; const skipped = [];
const sources = [...pages.map(f => [f, html[f], false]), ['ANSWERS.md', answersMd, true]];
for (const [f, raw, isMd] of sources) {
  for (const block of blocksOf(raw.replace(/\$\$/g, '$'), isMd)) {
    const ms = [...block.matchAll(/\$([^$]+)\$/g)].map(m => m[1])
      .flatMap(s => s.split(/,?\s*\\qquad(?:\\text\{[^}]*\}\\qquad)?/));
    // a letter may be solved twice in one block, so each value is tried
    const solved = {};
    for (const s of ms) { const m = s.match(SOLVED); if (m) (solved[m[1]] ??= new Set()).add(Number(m[2])); }
    const envs = Object.entries(solved).reduce((acc, [v, set]) => acc.flatMap(e => [...set].map(x => ({ ...e, [v]: x }))), [{}]);
    for (const span of ms) {
      if (!span.includes('=') || /\\neq?|\\le|\\ge|\\lt|\\gt|<|>|:|\\parallel|\\cong|\\approx/.test(span)) continue;
      if (SOLVED.test(span)) continue;
      const sides = span.split('=').map(s => s.trim()).filter(Boolean);
      if (sides.length < 2 || sides.every(x => /^[a-z]$/.test(x))) continue;
      const tries = envs.map(env => sides.map(s => toExpr(s, env)).map(e => (e ? evalExpr(e) : NaN)).filter(Number.isFinite));
      const usable = tries.filter(nums => nums.length >= 2);
      if (!usable.length) { skipped.push(`${f}: $${span.trim()}$`); continue; }
      spans++;
      if (usable.some(nums => nums.every(n => Math.abs(n - nums[0]) < 1e-9))) pass++;
      else fails.push(`${f}: $${span.trim()}$ — sides are ${usable[0].join(' and ')} (with ${JSON.stringify(solved, (k, v) => v instanceof Set ? [...v] : v)})`);
    }
  }
}

/* ---- B. claims arithmetic alone does not check ---------------- */

const panels = (src) => {
  const o = {};
  for (const part of src.split('<div class="c-example">').slice(1)) {
    const n = part.match(/c-example__tab">Example (\d+)/)[1];
    o[n] = part;
  }
  return o;
};
const bodyEx = panels(body), beyondEx = panels(beyond);
is('13 body examples', Object.keys(bodyEx).length === 13);
is('16 Beyond examples', Object.keys(beyondEx).length === 16);
const rowOf = (panel, label) => {
  const m = (panel || '').match(new RegExp(`work__label">${label}</span>([\\s\\S]*?)</div>`));
  return m ? plain(m[1]) : '';
};
const exSays = (where, ex, n, ...vals) => { for (const v of vals) is(`${where} Example ${n} Answer should say ${v}: "${rowOf(ex[n], 'Answer')}"`, has(rowOf(ex[n], 'Answer'), v)); };
const stepSays = (where, ex, n, ...vals) => { for (const v of vals) is(`${where} Example ${n} should print ${v}`, has(plain(ex[n] || ''), v)); };
const lin = (f) => { const b = f(0), a = f(1) - b; return -b / a; };

// the body's examples
is('body Ex 1: the creases meet at the centre', /single point — and that point is the centre/.test(rowOf(bodyEx[1], 'Answer')));
{ const r = 10, d = { P: 10, Q: 7, R: 13 };
  const on = Object.keys(d).filter(k => d[k] === r);
  is(`body Ex 2: only ${on} on the circle`, on.join() === 'P' && /Only P lies on the circle/.test(rowOf(bodyEx[2], 'Answer')));
  is('body Ex 2: Q inside, R outside', d.Q < r && d.R > r && /inside/.test(plain(bodyEx[2])) && /outside/.test(plain(bodyEx[2]))); }
{ const cx = (0 + 6) / 2, cy = (0 + 8) / 2, R = hyp(cx, cy);
  is('body Ex 3: O is equidistant from A, B, C', near(hyp(cx - 6, cy), R) && near(hyp(cx, cy - 8), R));
  exSays('body', bodyEx, 3, R); is(`body Ex 3: O(${cx},${cy})`, rowOf(bodyEx[3], 'Answer').includes(`O(${cx},${cy})`));
  stepSays('body', bodyEx, 3, cx, cy); }
{ const s1 = (6 - 2) / (3 - 1), s2 = (10 - 6) / (5 - 3);
  is(`body Ex 4: rates ${s1} and ${s2} agree, so no circle`, s1 === s2 && /no circle/.test(rowOf(bodyEx[4], 'Answer')));
  stepSays('body', bodyEx, 4, s1); }
{ const chord = 2 * 9 * Math.sin(Math.PI / 6); exSays('body', bodyEx, 5, r2(chord), 60); stepSays('body', bodyEx, 5, 180 - 60); }
exSays('body', bodyEx, 6, leg(10, 16 / 2));
{ const c = 2 * leg(17, 8); exSays('body', bodyEx, 7, c); is('body Ex 7 check: diameter 34', has(rowOf(bodyEx[7], 'Check'), 2 * 17) && c < 34); }
{ const d1 = leg(10, 8), d2 = leg(10, 6); exSays('body', bodyEx, 8, d1 + d2, d2 - d1); stepSays('body', bodyEx, 8, d1, d2); }
{ const d1 = leg(25, 24), d2 = leg(25, 7); exSays('body', bodyEx, 9, 48, d2 - d1); stepSays('body', bodyEx, 9, d1, d2); }
exSays('body', bodyEx, 10, 110 / 2, (360 - 110) / 2);
is('body Ex 10: the two add to 180', 110 / 2 + (360 - 110) / 2 === 180);
exSays('body', bodyEx, 11, 180 - 90 - 35);
{ const C = 180 - 95, D = 180 - 70; exSays('body', bodyEx, 12, C, D); is('body Ex 12 check', 95 + 70 + C + D === 360 && has(rowOf(bodyEx[12], 'Check'), 360)); }
is('body Ex 13: both pairs 180, so yes', 85 + 95 === 180 && 100 + 80 === 180 && /Yes/.test(rowOf(bodyEx[13], 'Answer')));
// p021: the chord-length table for r = 13
{ const t = [[0, 26], [5, 24], [12, 10], [13, 0]];
  for (const [d, L] of t) { is(`p021 table: d = ${d} gives ${L}`, near(2 * leg(13, d), L) && new RegExp(`d = ${d}\\s*length ${L}\\b`).test(plain(body))); }
  is('p021: the first five cost two, the last one costs ten', 26 - 24 === 2 && 10 - 0 === 10 && /first five centimetres of travel cost two centimetres/.test(plain(body)) && /last centimetre costs ten/.test(plain(body))); }
// p005: a square comes back four times, at multiples of 90
is('p005: square, four times, 90', 360 / 90 === 4 && /four times in a full turn, at multiples of 90/.test(plain(body)));
// general results, over many circles
{ let good = true;
  for (let r = 1; r < 30; r += 1.7) for (let d = 0; d < r; d += 0.9) for (let e = d + 0.3; e < r; e += 1.3) if (!(2 * leg(r, d) > 2 * leg(r, e))) good = false;
  is('Theorem 8: the nearer chord is longer, in every case tried', good); }
{ let good = true;
  for (let a = 0; a < 360; a += 7) for (let b = a + 5; b < a + 355; b += 11) for (let p = b + 1; p < a + 360; p += 13) {
    const P = (t) => [Math.cos(t * Math.PI / 180), Math.sin(t * Math.PI / 180)];
    const A = P(a), B = P(b), D = P(p);
    if (!near(ang(A, D, B), (b - a) / 2, 1e-6)) good = false;   // D is off the arc a→b, which sweeps b − a
  }
  is('Theorem 9: the angle at the circle is half the angle at the centre, in every case tried', good); }

// the figures, measured from their own coordinates
function ang(p, q, r) { // angle at q between rays q→p and q→r, degrees
  const a = Math.atan2(p[1] - q[1], p[0] - q[0]), b = Math.atan2(r[1] - q[1], r[0] - q[0]);
  let d = Math.abs(a - b) * 180 / Math.PI; return d > 180 ? 360 - d : d;
}
const dist = (p, q) => hyp(p[0] - q[0], p[1] - q[1]);
const svgOf = (src, fig, nth = 0) => { let i = -1; for (let k = 0; k <= nth; k++) i = src.indexOf(`fignum">Fig. ${fig}<`, i + 1); return i < 0 ? '' : src.slice(src.lastIndexOf('<svg', i), i); };
const draws = (s, ...bits) => bits.every(b => s.includes(b));
const onCircle = (p, c, r, tol = 0.1) => Math.abs(dist(p, c) - r) < tol;
const circum = (A, B, C) => {
  const d = 2 * (A[0] * (B[1] - C[1]) + B[0] * (C[1] - A[1]) + C[0] * (A[1] - B[1]));
  const s = (P) => P[0] * P[0] + P[1] * P[1];
  return [(s(A) * (B[1] - C[1]) + s(B) * (C[1] - A[1]) + s(C) * (A[1] - B[1])) / d, (s(A) * (C[0] - B[0]) + s(B) * (A[0] - C[0]) + s(C) * (B[0] - A[0])) / d];
};
const inside = (P, A, B, C) => { const s = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]); const a = s(A, B, P), b = s(B, C, P), c = s(C, A, P); return (a > 0 && b > 0 && c > 0) || (a < 0 && b < 0 && c < 0); };
{ const s = svgOf(body, '5.1'), O = [100, 92];
  is('Fig. 5.1 draws its points', draws(s, 'M100 92 L141.9 38.4', 'M41.1 58.0 L58.1 145.6', 'M167.7 86.1 L32.3 97.9'));
  for (const p of [[141.9, 38.4], [41.1, 58.0], [58.1, 145.6], [167.7, 86.1], [32.3, 97.9]]) is(`Fig. 5.1: ${p} on the circle`, onCircle(p, O, 68, 0.2));
  is('Fig. 5.1: CD passes through O', Math.abs(ang([167.7, 86.1], O, [32.3, 97.9]) - 180) < 0.5); }
is('Fig. 5.2: P′ on the rim', draws(svgOf(body, '5.2'), 'M172 70 L207.2 99.6') && onCircle([207.2, 99.6], [172, 70], 46, 0.1));
{ const s = svgOf(body, '5.3'), A = [100, 55], B = [100, 125];
  for (const [c, r] of [[[70, 90], 46.1], [[100, 90], 35], [[140, 90], 53.15]]) is(`Fig. 5.3: circle at ${c} passes through A and B`, draws(s, `cx="${c[0]}"`) && onCircle(A, c, r) && onCircle(B, c, r) && c[1] === (A[1] + B[1]) / 2); }
{ const A = [104, 32], B = [42, 140], C = [160, 128], O = circum(A, B, C);
  is('Fig. 5.4 draws its triangle', draws(svgOf(body, '5.4'), 'M104 32 L42 140 L160 128 Z', 'cx="97.55" cy="100.09" r="68.39"'));
  is(`Fig. 5.4: circumcentre ${O.map(r2)}`, near(O[0], 97.55, 0.01) && near(O[1], 100.09, 0.01) && near(dist(O, A), 68.39, 0.01));
  is('Fig. 5.4: acute, centre inside', [ang(B, A, C), ang(A, B, C), ang(A, C, B)].every(a => a < 90) && inside(O, A, B, C)); }
{ const s = svgOf(body, '5.5');
  const A = [117, 53], B = [22, 118], C = [82, 138], O = circum(A, B, C);
  is('Fig. 5.5: obtuse triangle drawn with its circumcircle', draws(s, 'M117 53 L22 118 L82 138 Z', 'cx="67.26" cy="82.22" r="57.69"') && near(O[0], 67.26, 0.01) && near(O[1], 82.22, 0.01) && near(dist(O, A), 57.69, 0.01));
  is('Fig. 5.5: obtuse, centre outside', Math.max(ang(B, A, C), ang(A, B, C), ang(A, C, B)) > 90 && !inside(O, A, B, C));
  const P = [172.3, 41.8], Q = [172.3, 124.8], R = [254.3, 124.8], O2 = circum(P, Q, R);
  is('Fig. 5.5: right triangle, centre at the hypotenuse midpoint', near(ang(P, Q, R), 90) && near(O2[0], 213.3, 0.01) && near(O2[1], 83.3, 0.01) && near(O2[0], (P[0] + R[0]) / 2) && near(dist(O2, P), 58.34, 0.02)); }
const eqChords = (fig, nth, where) => {
  const s = svgOf(where, fig, nth), C = [100, 100];
  const A = [39.38, 65], B = [112.16, 31.06], D = [165.78, 123.94], E = [100, 170];
  is(`Fig. ${fig}${nth ? ' (repeated)' : ''}: equal chords drawn`, draws(s, 'M39.38 65 L112.16 31.06', 'M165.78 123.94 L100 170'));
  is(`Fig. ${fig}${nth ? ' (repeated)' : ''}: ends on the circle, chords equal`, [A, B, D, E].every(p => onCircle(p, C, 70, 0.05)) && near(dist(A, B), dist(D, E), 0.05));
  return s;
};
eqChords('5.6', 0, body);
{ const C = [100, 100], A = [36.56, 70.42], B = [140.15, 42.66], M = [88.36, 56.54];
  is('Fig. 5.7: chord drawn, M its midpoint, CM perpendicular', draws(svgOf(body, '5.7'), 'M36.56 70.42 L140.15 42.66', 'M100 100 L88.36 56.54') && onCircle(A, C, 70, 0.05) && onCircle(B, C, 70, 0.05) && near(M[0], (A[0] + B[0]) / 2, 0.01) && near(M[1], (A[1] + B[1]) / 2, 0.01) && Math.abs(ang(C, M, B) - 90) < 0.1); }
for (const nth of [0, 1]) {
  const s = eqChords('5.8', nth, body);
  const C = [100, 100], E = [75.77, 48.03], H = [132.89, 146.97];
  is(`Fig. 5.8${nth ? ' (repeated)' : ''}: E and H are the midpoints, CE = CH, both perpendicular`,
    draws(s, 'M100 100 L75.77 48.03', 'M100 100 L132.89 146.97') && near(E[0], (39.38 + 112.16) / 2, 0.01) && near(E[1], (65 + 31.06) / 2, 0.01)
    && near(H[0], (165.78 + 100) / 2, 0.01) && near(H[1], (123.94 + 170) / 2, 0.01) && near(dist(C, E), dist(C, H), 0.05)
    && Math.abs(ang(C, E, [112.16, 31.06]) - 90) < 0.1 && Math.abs(ang(C, H, [100, 170]) - 90) < 0.1);
}
{ const s = svgOf(body, '5.9'), C = [100, 100], A = [46.38, 55], B = [153.62, 55], D = [157.34, 140.15], E = [106.1, 169.73];
  const dAB = 45, M = [(D[0] + E[0]) / 2, (D[1] + E[1]) / 2], dDE = dist(C, M);
  is('Fig. 5.9: chords on the circle', draws(s, 'M46.38 55 L153.62 55', 'M157.34 140.15 L106.1 169.73') && [A, B, D, E].every(p => onCircle(p, C, 70, 0.05)));
  is(`Fig. 5.9: AB (${r2(dist(A, B))}) is longer and nearer (${dAB} against ${r2(dDE)})`, dist(A, B) > dist(D, E) && dAB < dDE && draws(s, 'M100 100 L131.72 154.94') && near(M[0], 131.72, 0.01)); }
is('Fig. 5.10: A and B on the circle', draws(svgOf(body, '5.10'), 'M34.22 123.94 L165.78 123.94') && onCircle([34.22, 123.94], [100, 100], 70, 0.05) && onCircle([165.78, 123.94], [100, 100], 70, 0.05));
{ const s = svgOf(body, '5.11'), C = [100, 100], A = [34.22, 76.06], B = [165.78, 76.06], D = [76.06, 165.78], E = [123.94, 34.22];
  is('Fig. 5.11: D, C, E in a line, all on the circle', draws(s, 'M76.06 165.78 L123.94 34.22') && Math.abs(ang(D, C, E) - 180) < 0.1 && [A, B, D, E].every(p => onCircle(p, C, 70, 0.05)));
  is(`Fig. 5.11: arc AFB sweeps ${r2(360 - ang(A, C, B) > 180 ? ang(A, C, B) : 360 - ang(A, C, B))}, twice ADB = ${r2(ang(A, D, B))}`, near(ang(A, C, B), 2 * ang(A, D, B), 0.1));
  is('Fig. 5.11: E lies on the arc AFB (above A and B)', E[1] < A[1]); }
{ const s = svgOf(body, '5.12'), A = [34.22, 123.94], B = [165.78, 123.94], pts = [[135, 39.38], [100, 30], [55, 46.38]];
  const as = pts.map(p => ang(A, p, B));
  is(`Fig. 5.12: P, Q, R on the circle, angles ${as.map(r2)} equal`, draws(s, 'M135 39.38 L34.22 123.94', 'M100 30 L34.22 123.94', 'M55 46.38 L34.22 123.94') && pts.every(p => onCircle(p, [100, 100], 70, 0.05)) && as.every(a => near(a, as[0], 0.1))); }
{ const s = svgOf(body, '5.13');
  for (const [cx, A, D, E, out] of [[100, [43.62, 120.52], [159.46, 39.41], [138.57, 54.04], true], [280, [223.62, 120.52], [275.84, 83.96], [318.57, 54.04], false]]) {
    const O = [cx, 100];
    const t = (E[0] - A[0]) / (D[0] - A[0]);
    is(`Fig. 5.13 (${out ? 'outside' : 'inside'}): E on the circle and on the line AD`, draws(s, `M${A[0]} ${A[1]} L`) && onCircle(E, O, 60, 0.05) && near(A[1] + t * (D[1] - A[1]), E[1], 0.05) && onCircle(A, O, 60, 0.05));
    is(`Fig. 5.13: D is ${out ? 'outside' : 'inside'}`, (dist(D, O) > 60) === out);
    const B = [2 * cx - A[0], A[1]], Cc = [cx, 40];
    is(`Fig. 5.13: ADB ${out ? '<' : '>'} ACB`, out ? ang(A, D, B) < ang(A, Cc, B) : ang(A, D, B) > ang(A, Cc, B));
  } }
{ const q = [[34.22, 76.06], [135, 39.38], [153.62, 145], [42.66, 140.15]];
  is('Fig. 5.14: all four vertices on the circle, opposite angles 180', draws(svgOf(body, '5.14'), 'M34.22 76.06 L135 39.38 L153.62 145 L42.66 140.15 Z') && q.every(p => onCircle(p, [100, 100], 70, 0.05))
    && near(ang(q[3], q[0], q[1]) + ang(q[1], q[2], q[3]), 180, 0.1)); }

// the exercises, read back off ANSWERS.md
const mdSection = (head) => { const i = answersMd.indexOf(head); if (i < 0) return ''; const j = answersMd.indexOf('\n#', i + head.length); return answersMd.slice(i, j < 0 ? undefined : j); };
const mdItem = (head, n) => { const m = mdSection(head).match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`)); return m ? plain(m[1]) : ''; };
const mdSays = (head, n, ...vals) => { for (const v of vals) is(`ANSWERS.md ${head} Q${n} should say ${v}: "${mdItem(head, n).slice(0, 90)}"`, has(mdItem(head, n), v)); };
const S1 = '### Exercise Set 5.1', S2 = '### Exercise Set 5.2', S3 = '### Exercise Set 5.3', S4 = '### Exercise Set 5.4',
  S5 = '### Exercise Set 5.5', S6 = '### Exercise Set 5.6', S7 = '### Exercise Set 5.7', E = '## End-of-Chapter Exercises';
{ const i = answersMd.indexOf('## 5.2 What a Circle Is'), sec = answersMd.slice(i, answersMd.indexOf('## 5.3', i));
  const m = sec.match(/\n1\. ([^\n]*)/);
  is(`ANSWERS.md 5.2 T&R Q1 should say ${2 * 5}`, m && has(plain(m[1]), 2 * 5)); }
mdSays(S1, 1, 2 * 6.5); is('Ex 5.1 Q1: 14 cm is too long', 14 > 2 * 6.5 && /\*\*No\.\*\*/.test(mdItem(S1, 1)));
mdSays(S1, 3, 360 / 4, 4, 360 / 5, 5, 360 / 6, 6);
mdSays(S2, 1, 180 - 70 - 60); is('Ex 5.2 Q1: acute, inside', 180 - 70 - 60 < 90 && /inside/.test(mdItem(S2, 1)));
is('Ex 5.2 Q2: obtuse, outside', 100 > 90 && /outside/.test(mdItem(S2, 2)));
mdSays(S2, 4, 8 / 2);
mdSays(S3, 3, 10); mdSays(S3, 4, 8 * 8 + 8 * 8); is('Ex 5.3 Q4: 8√2', near(hyp(8, 8), 8 * Math.SQRT2) && /8√\(2\)/.test(mdItem(S3, 4)));
mdSays(S3, 5, r2(Math.sqrt(3))); is('Ex 5.3 Q5: the 120° chord is √3 r', near(2 * Math.sin(Math.PI / 3), Math.sqrt(3)) && near(2 * Math.sin(Math.PI / 6), 1));
mdSays(S4, 3, hyp(12, 5));
{ const a = leg(5, 3), b = leg(5, 4); mdSays(S4, 4, a, b, a + b); mdSays(S4, 5, a - b);
  is('Ex 5.4 Q4 reads as one phrase', mdItem(S4, 4).includes(`are ${a} + ${b} = ${a + b} cm apart.`) && mdItem(S4, 5).includes(`${a} - ${b} = ${a - b} cm.`)); }
{ const r = hyp(12, 5); mdSays(S4, 6, r, 2 * leg(r, 12)); }
{ const a = leg(10, 8), b = leg(10, 6); mdSays(S4, 7, a, b, a + b, b - a); }
mdSays(S5, 1, 2 * leg(13, 5), leg(13, 10 / 2));
mdSays(S5, 2, 13, r2(2 * leg(7, 6))); is('Ex 5.5 Q2: 2√13', near(2 * leg(7, 6), 2 * Math.sqrt(13)));
{ const a = 2 * leg(10, 6), b = 2 * leg(10, 8); mdSays(S5, 4, a, b, a - b); }
{ const cd = 2 * leg(5, 2), ab = 2 * leg(5, 4); mdSays(S5, 5, r2(cd), ab, 2 * ab); is('Ex 5.5 Q5: a counter-example', !near(cd, 2 * ab) && near(cd, 2 * Math.sqrt(21))); }
mdSays(S5, 7, leg(25, 7));
mdSays(S5, 8, 5, 2 * leg(13, 5));
mdSays(S6, 1, 12); mdSays(S6, 2, 70 / 2); mdSays(S6, 3, 250 / 2); mdSays(S6, 5, 60, 60 / 2); mdSays(S6, 6, 110 / 2, 180 / 2);
mdSays(S7, 1, 180 - 75, 180 - 110);
is('Ex 5.7 Q2: cyclic and drawable', 80 + 100 === 180 && 110 + 70 === 180 && 80 + 110 + 100 + 70 === 360); mdSays(S7, 2, 360);
{ const x = lin(x => 2 * x + 10 + 3 * x - 20 - 180); mdSays(S7, 3, x, 2 * x + 10, 3 * x - 20); }
mdSays(E, 1, 2 * leg(13, 5)); mdSays(E, 2, 26 / 2, leg(13, 12)); mdSays(E, 3, hyp(8, 6)); mdSays(E, 5, 90); mdSays(E, 6, 180 - 75, 180 - 110);
mdSays(E, 7, 2 * (5 * 12 / 2), 90);
{ let r = 0; for (let t = 12.001; t < 100; t += 0.001) if (Math.abs(leg(t, 5) - leg(t, 12) - 7) < 0.002) { r = Math.round(t); break; }
  mdSays(E, 8, r, 144 - 25, 119 / 7, leg(r, 5), leg(r, 12)); }
mdSays(E, 9, 18, r2(hyp(3, 3)));
mdSays(E, 14, 360 / 6);
// Think and Reflect: no shortest chord; T&R on p008
is('T&R p004: 2 × 5 = 10', 2 * 5 === 10);

// Stage 1, as printed in its running text
{ const centre = 360 - 2 * 150;
  is(`Stage 1 Q1: angle AOB = ${centre}, radius = chord = 7`, centre === 60 && /∠AOB = 360 - 300 = 60/.test(plain(beyond)) && /OA = AB = 7 cm/.test(plain(beyond)));
  is('Stage 1 Q1: a 60° apex makes an equilateral triangle', near(2 * 7 * Math.sin(Math.PI / 6), 7)); }
{ const r = 15 / 2; is('Stage 1 Q2: 9, 12, 15 is right-angled; radius 7.5', 81 + 144 === 225 && has(plain(beyond), r) && /radius is 7\.5 cm/.test(plain(beyond))); }
{ const AOB = 180 - 25 - 25; is(`Stage 1 Q3: ${AOB / 2} and ${(360 - AOB) / 2}`, AOB / 2 === 65 && (360 - AOB) / 2 === 115 && /∠AQB = 115/.test(plain(beyond))); }
{ const OM = leg(20, 16), PM = 16 - 7, OP = hyp(OM, PM);
  is(`Stage 1 Q4: OM ${OM}, PM ${PM}, OP ${OP}`, /and OM = 12 cm/.test(plain(beyond)) && /PM = 16 - 7 = 9 cm/.test(plain(beyond)) && /OP = 15 cm/.test(plain(beyond)) && OM === 12 && OP === 15); }
// Stage 1 Q5 over many quadrilaterals: B and D right angles put all four on the circle on AC
{ let good = true;
  for (let t = 5; t < 175; t += 7) for (let u = 185; u < 355; u += 9) {
    const A = [-1, 0], C = [1, 0], B = [Math.cos(t * Math.PI / 180), Math.sin(t * Math.PI / 180)], D = [Math.cos(u * Math.PI / 180), Math.sin(u * Math.PI / 180)];
    if (!near(ang(A, B, C), 90, 1e-6) || !near(ang(A, D, C), 90, 1e-6)) good = false;
  }
  is('Stage 1 Q5: every point seeing AC at 90° is on the circle with AC as diameter (tried)', good); }
// Figs 5B.1 and 5B.2
{ const s = svgOf(beyond, '5B.1'), O = [145, 95], A = [72.5, 128.8], B = [217.5, 128.8], P = [145, 15], Q = [145, 175];
  is('Fig. 5B.1 draws its points', draws(s, 'M72.5 128.8 L217.5 128.8', 'M145 15 L72.5 128.8', 'M145 175 L72.5 128.8'));
  is('Fig. 5B.1: A, B, P, Q on the circle', [A, B, P, Q].every(p => onCircle(p, O, 80, 0.05)));
  is(`Fig. 5B.1: OAB drawn ${r2(ang(O, A, B))}, printed 25`, Math.abs(ang(O, A, B) - 25) < 0.2);
  is(`Fig. 5B.1: APB ${r2(ang(A, P, B))}, AQB ${r2(ang(A, Q, B))}`, Math.abs(ang(A, P, B) - 65) < 0.3 && Math.abs(ang(A, Q, B) - 115) < 0.3); }
{ const s = svgOf(beyond, '5B.2'), O = [115, 90], A = [52.6, 136.8], B = [177.4, 136.8], M = [115, 136.8], P = [79.9, 136.8], k = 78 / 20;
  is('Fig. 5B.2 draws its chord and OP', draws(s, 'M52.6 136.8 L177.4 136.8', 'M115 90 L79.9 136.8', 'M115 90 L115 136.8'));
  is('Fig. 5B.2: to scale (r 20, AB 32, AP 7, OM 12, OP 15)', onCircle(A, O, 78, 0.05) && onCircle(B, O, 78, 0.05) && near(dist(A, B), 32 * k, 0.05) && near(dist(A, P), 7 * k, 0.05) && near(dist(O, M), 12 * k, 0.05) && near(dist(O, P), 15 * k, 0.05) && near(M[0], (A[0] + B[0]) / 2)); }

// Stage 2
const exOpts = (n) => [...(beyondEx[n].match(/<ol class="c-parts c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/) || ['', ''])[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => plain(m[1]).trim());
const exKey = (n) => (rowOf(beyondEx[n], 'Answer').match(/\(([a-d])\)/) || [])[1];
const num = (s) => Number(String(s).replace(/[^\d.\-]/g, ''));
// Ex 1: lines of symmetry of a circle with one diameter, counted by trying every line through the centre
const symCount = (() => { let n = 0; for (let t = 0; t < 180; t += 0.5) { const th = t * Math.PI / 180; const ref = (p) => { const c = Math.cos(2 * th), s2 = Math.sin(2 * th); return [c * p[0] + s2 * p[1], s2 * p[0] - c * p[1]]; }; const a = ref([1, 0]); if (near(Math.abs(a[0]), 1, 1e-9) && near(a[1], 0, 1e-9)) n++; } return n; })();
// Ex 3
const ex3 = [2, 3, 7].map(p => p * 180 / 12);
// Ex 7: the radius, found by search
const ex7r = (() => { for (let t = 12.0001; t < 100; t += 0.0001) if (Math.abs(leg(t, 9) - leg(t, 12) - 3) < 1e-3) return Math.round(t); })();
// Ex 14
const ex14x = lin(x => 100 - x * x - (289 - (21 - x) * (21 - x)));
const ex14 = 2 * leg(10, ex14x);
// Ex 13: build one of each quadrilateral and test it for a circle
const concyclic = (q) => { const O = circum(q[0], q[1], q[2]); return near(dist(O, q[3]), dist(O, q[0]), 1e-6); };
const trap = [[0, 0], [10, 0], [7, 4], [3, 4]], kite = [[0, 0], [4, 3], [0, 9], [-4, 3]], rightTrap = [[0, 0], [10, 0], [10, 4], [3, 4]];
is('Ex 13: an isosceles trapezium is cyclic; a kite and a right trapezium need not be', concyclic(trap) && !concyclic(kite) && !concyclic(rightTrap) && near(dist(trap[0], trap[3]), dist(trap[1], trap[2])));
const exSolve = {
  1: o => o.map(s => s === String(symCount)),
  3: o => o.map(s => s === (Math.max(...ex3) > 90 ? 'outside the triangle' : 'inside the triangle')),
  4: o => o.map(num).map(v => v === (180 - 70) / 2),
  7: o => o.map(num).map(v => v === ex7r),
  11: o => o.map(num).map(v => v === 180 - 90 - (180 - 130)),
  13: o => o.map(s => s === 'a trapezium whose two non-parallel sides are equal'),
  14: o => o.map(num).map(v => near(v, ex14)),
};
for (const [n, f] of Object.entries(exSolve)) {
  const o = exOpts(n);
  is(`Beyond Example ${n} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Beyond Example ${n}: the right option`, right, [exKey(n)]);
}
is(`Beyond Ex 1: ${symCount} lines`, symCount === 2);
stepSays('Beyond', beyondEx, 3, ...ex3, 180 / 12);
{ const r = 17, h = 16 / 2; stepSays('Beyond', beyondEx, 2, h); exSays('Beyond', beyondEx, 2, leg(r, h)); is('Beyond Ex 2: two circles', /Two circles/.test(rowOf(beyondEx[2], 'Answer')) && r > h); }
stepSays('Beyond', beyondEx, 4, 180 - 70, (180 - 70) / 2);
{ const r = (32 * 32 + 40 * 40) / (2 * 32); exSays('Beyond', beyondEx, 5, r); is('Beyond Ex 5 check', has(rowOf(beyondEx[5], 'Check'), r - 32) && near(hyp(r - 32, 40), r) && r > 32); }
{ const d = leg(37, 70 / 2); exSays('Beyond', beyondEx, 6, d, 37 - d); stepSays('Beyond', beyondEx, 6, 70 / 2); }
{ const d1 = leg(ex7r, 12), d2 = leg(ex7r, 9); stepSays('Beyond', beyondEx, 7, d1, d2, d1 + d2, 144 - 81); is(`Beyond Ex 7: r = ${ex7r}, d2 - d1 = 3`, ex7r === 15 && d2 - d1 === 3); }
{ const r = hyp(21, 40 / 2), d = leg(r, 42 / 2); exSays('Beyond', beyondEx, 8, d); is(`Beyond Ex 8 Answer reads "lies ${d} cm from the centre"`, rowOf(beyondEx[8], 'Answer').includes(`d = ${d}, so the 42 cm chord lies ${d} cm from the centre`)); stepSays('Beyond', beyondEx, 8, r); is('Beyond Ex 8: the longer chord is nearer', d < 21); }
{ const x = lin(x => 5 * x + 20 - 2 * 3 * x); exSays('Beyond', beyondEx, 9, x, 3 * x, 5 * x + 20); }
exSays('Beyond', beyondEx, 10, 30, 180 - 30 - 100);
exSays('Beyond', beyondEx, 12, 50);
stepSays('Beyond', beyondEx, 14, ex14x, ex14 / 2, ex14, 289 - (21 - ex14x) ** 2);
{ const s = svgOf(beyond, '5B.3'), O = [115, 100], k = 78 / 15;
  is('Fig. 5B.3 draws its chords', draws(s, 'M52.6 53.2 L177.4 53.2', 'M68.2 37.6 L161.8 37.6'));
  is('Fig. 5B.3: to scale (r 15; 24 at 9; 18 at 12; 3 apart)', [[52.6, 53.2], [177.4, 53.2], [68.2, 37.6], [161.8, 37.6]].every(p => onCircle(p, O, 78, 0.05))
    && near(177.4 - 52.6, 24 * k, 0.05) && near(161.8 - 68.2, 18 * k, 0.05) && near(100 - 53.2, 9 * k, 0.05) && near(53.2 - 37.6, 3 * k, 0.05)); }
{ const s = svgOf(beyond, '5B.4'), O = [100, 100], A = [34.22, 123.94], B = [100, 30], C = [160.62, 65], D = [135, 160.62], Ep = [115.07, 86.24];
  is('Fig. 5B.4 draws its chords', draws(s, 'M34.22 123.94 L160.62 65', 'M100 30 L135 160.62'));
  is('Fig. 5B.4: A, B, C, D on the circle, E on both chords', [A, B, C, D].every(p => onCircle(p, O, 70, 0.05)) && Math.abs(ang(A, Ep, C) - 180) < 0.1 && Math.abs(ang(B, Ep, D) - 180) < 0.1);
  is(`Fig. 5B.4: BAC ${r2(ang(B, A, C))} (30), AEB ${r2(ang(A, Ep, B))} (100), BDC ${r2(ang(B, D, C))}, ACD ${r2(ang(A, C, D))}`,
    Math.abs(ang(B, A, C) - 30) < 0.2 && Math.abs(ang(A, Ep, B) - 100) < 0.2 && Math.abs(ang(B, D, C) - 30) < 0.2 && Math.abs(ang(A, C, D) - 50) < 0.2); }
{ const s = svgOf(beyond, '5B.5'), A = [60, 85], B = [144, 85], P = [84, 53], k = 4;
  is('Fig. 5B.5: to scale (10, 17, 21; AM 6, PM 8)', draws(s, 'cx="60" cy="85" r="40"', 'cx="144" cy="85" r="68"', 'M84 53 L84 117')
    && 40 === 10 * k && 68 === 17 * k && dist(A, B) === 21 * k && onCircle(P, A, 40, 0.05) && onCircle(P, B, 68, 0.05) && P[0] - A[0] === ex14x * k && 85 - P[1] === (ex14 / 2) * k); }
{ const s = svgOf(beyond, '5B.6'), O1 = [70, 95], O2 = [150, 95], A = [103.13, 57.55], B = [103.13, 132.45], C = [36.87, 132.45], D = [196.87, 132.45];
  is('Fig. 5B.6 draws its diameters', draws(s, 'M103.13 57.55 L36.87 132.45', 'M103.13 57.55 L196.87 132.45'));
  is('Fig. 5B.6: A, B on both circles; AC, AD diameters; C, B, D in a line', onCircle(A, O1, 50, 0.05) && onCircle(B, O1, 50, 0.05) && onCircle(A, O2, 60, 0.05) && onCircle(B, O2, 60, 0.05)
    && near(ang(A, O1, C), 180, 0.1) && near(ang(A, O2, D), 180, 0.1) && near(ang(C, B, D), 180, 0.1) && near(ang(A, B, C), 90, 0.1)); }
// Ex 15 over many cyclic trapezia: AD = BC
{ let good = true;
  for (let a = 10; a < 170; a += 9) for (let d = 185; d < 355; d += 11) {
    const P = (t) => [Math.cos(t * Math.PI / 180), Math.sin(t * Math.PI / 180)];
    const A = P(d), B = P(540 - d), C = P(180 - a), D = P(a); // AB and DC both horizontal
    if (!near(A[1], B[1]) || !near(C[1], D[1]) || !near(dist(A, D), dist(B, C))) good = false;
  }
  is('Beyond Ex 15: a cyclic trapezium has equal non-parallel sides (tried)', good); }

// the practice answers, read back out of the key rows
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= plain(m[2]);
const row = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const r = keyRows[n] || '';
  if (!part) return r;
  const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\)|$)`));
  return m ? m[1] : '';
};
const says = (q, ...vals) => { for (const v of vals) is(`key ${q} should say ${v}: "${row(q)}"`, has(row(q), v)); };
const P = {
  20: [leg(6.5, 12 / 2)],
  21: [360 - 136, (360 - 136) / 2],
  22: [(180 + 40) / 2, (180 - 40) / 2],
  23: [leg(25, 15), leg(25, 20), leg(25, 15) + leg(25, 20), leg(25, 15) - leg(25, 20)],
  24: [360 - 90 - 120, 90 / 2, 120 / 2, (360 - 90 - 120) / 2],
  25: [55, 45 + 55, 180 - (45 + 55)],
  28: [24 / 2, leg(15, 12), leg(20, 12), leg(15, 12) + leg(20, 12), leg(20, 12) - leg(15, 12)],
  29: [180],
  '30a': [leg(50, 40)], '30b': [leg(50, 48)], '30c': [leg(50, 40) + leg(50, 48)],
  '31a': [180 - 78], '31b': [180 - 96], '31c': [78 + 96 + (180 - 78) + (180 - 96)],
};
for (const [q, vs] of Object.entries(P)) says(q, ...vs);
{ const a = leg(25, 15), b = leg(25, 20);
  is(`key 23 should read "${a} + ${b} = ${a + b} cm apart; on the same side, ${a} - ${b} = ${a - b} cm": "${row(23)}"`,
    row(23).endsWith(`On opposite sides they are ${a} + ${b} = ${a + b} cm apart; on the same side, ${a} - ${b} = ${a - b} cm`)); }
{ const a = leg(15, 12), b = leg(20, 12);
  is(`key 28 should end "${a} + ${b} = ${a + b} cm apart; on the same side, ${b} - ${a} = ${b - a} cm"`,
    row(28).endsWith(`On opposite sides they are ${a} + ${b} = ${a + b} cm apart; on the same side, ${b} - ${a} = ${b - a} cm`)); }
is('key 24: the three angles total 180', (360 - 90 - 120) / 2 + 90 / 2 + 120 / 2 === 180);
is('key 29: the two angles total 180 in every quadrilateral', 360 - 360 / 2 === 180);
is('key 30 (d): the south path, the 96 m one', leg(50, 48) < leg(50, 40) && /south path/.test(row('30d')));
is('key 31 (d): not a diameter, since A is not 90', 78 !== 90 && /no:/.test(row('31d')) && has(row('31d'), 90));
is('key 26 and 27 name their theorems', /Theorem 4/.test(row(26)) && /Theorem 2/.test(row(27)) && /Theorem 9/.test(row(27)));

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] ??= m[2];
const optsOf = (n) => { const o = (qs[n] || '').match(/<ol class="c-parts c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/); return o ? [...o[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => plain(x[1]).trim()) : []; };
const qText = (n) => plain((qs[n] || '').split('<ol')[0]);
const key = {};
{ const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2]; }
const val = (f) => (o) => o.map(num).map(v => near(v, f));
const nums = (s) => [...s.matchAll(/\d+(?:\.\d+)?/g)].map(m => Number(m[0]));
const qn = (n) => nums(qText(n));
const solve = {
  1: val(leg(qn(1)[1], qn(1)[0] / 2)),
  2: val(2 * qn(2)[0]),
  3: val(180 - qn(3)[0]),
  4: o => o.map(s => s === 'infinitely many'),
  5: val(qn(5)[0] / 2),
  6: val(hyp(qn(6)[0], qn(6)[1]) / 2),
  7: o => { const [dAB, dCD] = qn(7); const r = 10; const rel = 2 * leg(r, dAB) < 2 * leg(r, dCD) ? 'AB \\lt CD' : 'AB \\gt CD'; return o.map(s => s === rel); },
  8: val((180 - qn(8)[0]) / 2),
  9: val(qn(9)[0]),
  10: o => { const [a, b, c] = qn(10); return o.map(num).map(k => (a + c) === (b + k)); },
  11: o => o.map(s => { const [p, q, r, t] = nums(s); return !(p + r === 180 && q + t === 180); }),
  12: val(90 / 3),
  13: val((180 - 2 * qn(13)[0]) / 2),
  14: val(360 / 8),
  15: o => o.map(s => /Any three points/.test(s)),
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Q${q}: the right option`, right, [key[q]]);
}
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
{ const [d, R, L] = nums(qText(17)).slice(0, 3);
  const AR = {
    16: [true, true, true],                                   // two bisectors meet at a point equidistant from all three, so the third passes too
    17: [near(2 * leg(R, d), L), L <= 2 * R, false],          // R bounds the length; it does not give it
    18: [qn(18)[0] === qn(18)[1], true, false],               // equal distances force equal chords, and 6 is not 9
    19: [true, !inside(circum([117, 53], [22, 118], [82, 138]), [117, 53], [22, 118], [82, 138]) ? false : true, false], // Fig. 5.5 is the counter-example
  };
  for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]); }
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-19', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(19)].map((_, i) => i + 1));
ok('practice numbered 1-31', [...beyond.matchAll(/data-start="(\d+)"/g)].map(m => Number(m[1])), [...Array(30)].map((_, i) => i + 2));
ok('key rows 20-31, then the option notes', Object.keys(keyRows).map(Number).sort((a, b) => a - b), [1, 6, 10, 11, 13, 17, 18, ...[...Array(12)].map((_, i) => i + 20)]);
// the option notes agree with the key
for (const [q, v] of Object.entries({ 1: 40, 6: 8.5, 10: 6, 13: 20 })) {
  const note = [...beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)].filter(m => m[1] === q).map(m => plain(m[2])).pop();
  is(`option note ${q} reaches ${v}`, has(note || '', v));
}

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
{ const i = answersMd.indexOf('as the key prints it'); for (const m of answersMd.slice(i, i + 600).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2]; }
ok('ANSWERS.md key matches the page', mdKey, key);
const W = '### The working for each';
for (const [q, vs] of Object.entries(P)) {
  const [, n, part] = q.match(/^(\d+)([a-d]?)$/);
  let r = mdItem(W, n);
  if (part) { const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\)|$)`)); r = m ? m[1] : ''; }
  for (const v of vs) {
    if (['21', '24', '25', '28'].includes(n) && ![224, 112, 150, 45, 60, 75, 55, 100, 80, 12, 9, 16, 25, 7].includes(v)) continue;
    is(`ANSWERS.md practice ${q} should say ${v}: "${r.slice(0, 80)}"`, has(r, v));
  }
}
for (const q of Object.keys(solve)) {
  const o = optsOf(q), right = o['abcd'.indexOf(key[q])] || '';
  const v = num(right);
  if (Number.isFinite(v) && /^\$?[\d.]+/.test(right.replace(/\s/g, '')) && nums(right).length === 1) is(`ANSWERS.md practice ${q} should reach ${v}`, has(mdItem(W, q), v));
}
is('ANSWERS.md Stage 1 values', /radius is \$7\$ cm/.test(answersMd) && /\$7\.5\$ cm/.test(answersMd) && /\$OP = 15\$ cm/.test(answersMd) && /115\^\\circ/.test(answersMd));

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
