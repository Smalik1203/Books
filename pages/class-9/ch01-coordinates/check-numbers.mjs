#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed — distances from coordinates, midpoints from shifts, the points a
   figure is drawn at — and compared with what is on the page.

     node pages/class-9/ch01-coordinates/check-numbers.mjs [--skipped]

   Four parts:
     A  every identity set as maths, on every page and in ANSWERS.md: square
        roots, powers and |bars| are evaluated; a chain whose named sides
        (AD, CD^2) cannot be evaluated is checked on the sides that can; an
        equation in an unknown is checked against the value the same block
        solves it to
     B  the claims A cannot check: each example's answer, each exercise
        answer read back off ANSWERS.md, every labelled point of every figure
        measured from its own coordinates, Stage 1 by search, and the
        practice answers read back out of the key rows a lettered part at a
        time
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
const near = (a, b, t = 1e-9) => Math.abs(a - b) < t;

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const unwrap = (s) => s.replace(/<span class="nb">([^<]*)<\/span>/g, '$1');
const html = Object.fromEntries(pages.map(f => [f, unwrap(fs.readFileSync(path.join(DIR, f), 'utf8'))]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<(?=[\s\d])/g, '&lt;').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/&minus;/g, '-')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
// maths flattened for reading: (−3, 4) → (-3,4), \sqrt{41} → √41
const plain = (s) => text(s).replace(/\$/g, '')
  .replace(/\\sqrt\{([^{}]+)\}/g, '√$1').replace(/\\tfrac\{1\}\{2\}/g, '½')
  .replace(/\\pm\s*/g, '±').replace(/\\times/g, '×').replace(/\\(?:left|right)/g, '')
  .replace(/\(\s*(-?[\d.]+)\s*,\s*(-?[\d.]+)\s*\)/g, '($1,$2)').replace(/\s+/g, ' ');
const esc = (v) => String(v).replace(/[.*+?^${}()|[\]\\√]/g, '\\$&');
// a number must stand alone; a point or a surd may follow a letter, as in D_1(8,0)
const has = (s, v) => new RegExp(`${/^[-\d]/.test(String(v)) ? '(^|[^\\d.])' : ''}${esc(v)}([^\\d.]|\\.(?!\\d)|$)`).test(s);
const pt = (x, y) => `(${x},${y})`;
const dist = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
const d2 = (p, q) => (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2;

/* ---- A. every identity ---------------------------------------- */

function toExpr(side, env = {}) {
  let s = side
    .replace(/\\text\{[^{}]*\}/g, '')
    .replace(/\\left\|/g, '⟦').replace(/\\right\|/g, '⟧')
    .replace(/\\left|\\right/g, '')
    .replace(/\\(?:,|;|!|quad|qquad|ldots)/g, '').replace(/\\ /g, '')
    .replace(/\^\{([^{}]+)\}/g, '^($1)');
  for (let i = 0; i < 4; i++) s = s.replace(/\\[tdc]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))').replace(/\\sqrt\{([^{}]+)\}/g, '√($1)');
  s = s.replace(/\\times|\\cdot/g, '*').replace(/\\div/g, '/').replace(/\^/g, '**').replace(/\s+/g, '');
  let prev; do { prev = s; s = s.replace(/\|([^|]*)\|/g, '⟦$1⟧'); } while (s !== prev);
  for (const [v, val] of Object.entries(env)) s = s.replace(new RegExp(`(?<![A-Za-z\\\\])${v}(?![A-Za-z'])`, 'g'), `(${val})`);
  if (!s || !/^[-+*/().0-9√⟦⟧]+$/.test(s)) return null;
  s = s.replace(/(\d|\)|⟧)(?=[(√⟦])/g, '$1*').replace(/(\)|⟧)(?=\d)/g, '$1*');
  // a leading minus before a power is (−a)^n in JS's eyes only with brackets
  s = s.replace(/(^|[(*/+])-(\d+(?:\.\d+)?)\*\*/g, '$1-1*$2**');
  return s.replace(/√/g, 'Math.sqrt').replace(/⟦/g, 'Math.abs(').replace(/⟧/g, ')');
}
const evalExpr = (e) => { try { const v = Function(`"use strict";return (${e})`)(); return typeof v === 'number' ? v : NaN; } catch { return NaN; } };

const blocksOf = (src, isMd) => isMd
  ? src.split(/\n(?=\s*(?:\d+\.|-) |#)/)
  : src.split(/<div class="c-example">|<div class="c-try">|<div class="work work--trace">|<div class="c-practice/)
      .flatMap(b => /c-example__tab/.test(b) ? [b] : b.split('<div class="work__row">'));

let spans = 0; const skipped = [];
const sources = [...pages.map(f => [f, html[f], false]), ['ANSWERS.md', answersMd, true]];
for (const [f, raw, isMd] of sources) {
  const src = raw.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/\$\$/g, '$').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  for (const block of blocksOf(src, isMd)) {
    const ms = [...block.matchAll(/\$([^$]+)\$/g)].map(m => m[1]);
    // a letter the block solves: v = number (a remark may solve it a second way, so each value is tried)
    const solved = {};
    for (const s of ms) {
      const m = s.match(/^\s*([a-z])\s*=(.+)$/);
      if (!m || /<|>|\\ne|\\le|\\ge|\\pm/.test(s)) continue;
      const vals = m[2].split('=').map(t => toExpr(t)).map(e => (e ? evalExpr(e) : NaN));
      if (vals.length && vals.every(Number.isFinite)) for (const v of vals) (solved[m[1]] ??= new Set()).add(v);
    }
    const envs = Object.entries(solved).reduce((acc, [v, set]) => acc.flatMap(e => [...set].map(x => ({ ...e, [v]: x }))), [{}]);
    for (const span of ms) {
      if (!span.includes('=') || /\\ne|\\le|\\ge|<|>|\\pm|\\approx/.test(span)) continue;
      if (/^\s*[a-z]\s*=\s*-?[\d.]+\s*$/.test(span)) continue;
      const sides = span.split('=').map(s => s.trim()).filter(Boolean);
      if (sides.length < 2) continue;
      // a point set equal to a point: compare coordinate by coordinate
      const pairs = sides.map(s => s.match(/^\(([^(),]*(?:\([^()]*\)[^(),]*)*),([^(),]*(?:\([^()]*\)[^(),]*)*)\)$/));
      if (pairs.every(Boolean)) {
        const vals = pairs.map(p => [p[1], p[2]].map(t => { const e = toExpr(t); return e ? evalExpr(e) : NaN; }));
        if (vals.every(v => v.every(Number.isFinite))) {
          spans++;
          if (vals.every(v => near(v[0], vals[0][0]) && near(v[1], vals[0][1]))) pass++;
          else fails.push(`${f}: $${span.trim()}$ — the points are ${JSON.stringify(vals)}`);
          continue;
        }
      }
      const tries = envs.map(env => sides.map(s => toExpr(s, env)).map(e => (e ? evalExpr(e) : NaN)).filter(Number.isFinite));
      const usable = tries.filter(nums => nums.length >= 2);
      if (!usable.length) { skipped.push(`${f}: $${span.trim()}$`); continue; }
      spans++;
      if (usable.some(nums => nums.every(n => near(n, nums[0], 1e-9)))) pass++;
      else fails.push(`${f}: $${span.trim()}$ — sides are ${usable[0].join(' and ')} (with ${JSON.stringify(solved, (k, v) => v instanceof Set ? [...v] : v)})`);
    }
  }
}

/* ---- B. claims arithmetic alone does not check ---------------- */

const panels = (src) => {
  const o = {};
  for (const part of src.split('<div class="c-example">').slice(1)) o[part.match(/c-example__tab">Example (\d+)/)[1]] = part;
  return o;
};
const ex = panels(beyond);
const rowOf = (panel, label) => {
  const m = (panel || '').match(new RegExp(`work__label">${label}</span>([\\s\\S]*?)</div>`));
  return m ? plain(m[1]) : '';
};
const exSays = (n, ...vals) => { for (const v of vals) is(`Example ${n} Answer should say ${v}: "${rowOf(ex[n], 'Answer')}"`, has(rowOf(ex[n], 'Answer'), v)); };
const exPrints = (n, ...vals) => { for (const v of vals) is(`Example ${n} should print ${v}`, has(plain(ex[n] || ''), v)); };
is('Beyond has 16 examples, numbered from 1', Object.keys(ex).join() === [...Array(16)].map((_, i) => i + 1).join());

// Example 1: (k − 3, 5)
{ const k0 = [...Array(21)].map((_, i) => i - 10).filter(k => k - 3 === 0);
  const q2 = [...Array(21)].map((_, i) => i - 10).filter(k => k - 3 < 0 && 5 > 0);
  is('Example 1: Quadrant II exactly when k < 3', q2.every(k => k < 3) && q2.length === 13);
  exSays(1, k0[0]); is('Example 1 Answer names k < 3', /k < 3/.test(rowOf(ex[1], 'Answer'))); }
// Example 3: the rectangle
{ const A = [-3, -2], B = [5, -2], C = [5, 4], D = [A[0], C[1]];
  const L = Math.abs(B[0] - A[0]), W = Math.abs(C[1] - B[1]);
  exSays(3, pt(...D), L, W, L * W, 2 * (L + W), dist(A, C)); }
// Example 4
{ const P = [-3, 7], Q = [5, -8]; exSays(4, dist(P, Q)); exPrints(4, d2(P, Q), (Q[0] - P[0]) ** 2, (Q[1] - P[1]) ** 2); }
// Example 8: the point equidistant from three villages, by search
{ const V = [[0, 0], [8, 0], [0, 6]];
  const hits = []; for (let x = -20; x <= 20; x += 0.5) for (let y = -20; y <= 20; y += 0.5) if (near(d2([x, y], V[0]), d2([x, y], V[1])) && near(d2([x, y], V[0]), d2([x, y], V[2]))) hits.push([x, y]);
  is(`Example 8: one such point, found ${JSON.stringify(hits)}`, hits.length === 1);
  exSays(8, pt(...hits[0]), dist(hits[0], V[0])); }
// Example 9: B = M + (M − A)
{ const A = [-2, 5], M = [3, 1], B = [2 * M[0] - A[0], 2 * M[1] - A[1]];
  exSays(9, pt(...B)); is('Example 9: M is half way', near(dist(A, M), dist(M, B)) && near(dist(A, B), 2 * dist(A, M)));
  is('Example 9 check: √41', d2(A, M) === 41 && has(rowOf(ex[9], 'Check'), '√41')); }
// Example 10: trisection
{ const A = [-1, 4], B = [8, -2], s = [(B[0] - A[0]) / 3, (B[1] - A[1]) / 3];
  const P = [A[0] + s[0], A[1] + s[1]], Q = [A[0] + 2 * s[0], A[1] + 2 * s[1]];
  exSays(10, pt(...P), pt(...Q)); is('Example 10: three equal parts', near(dist(A, P), dist(P, Q)) && near(dist(P, Q), dist(Q, B))); }
// Example 13: the right angle and the area
{ const A = [1, 0], B = [5, 3], C = [-1, 11];
  const dot = (A[0] - B[0]) * (C[0] - B[0]) + (A[1] - B[1]) * (C[1] - B[1]);
  is('Example 13: right angle at B', dot === 0 && /at B/.test(rowOf(ex[13], 'Answer')));
  exSays(13, dist(A, B) * dist(B, C) / 2); exPrints(13, d2(A, B), d2(B, C), d2(A, C), dist(A, B), dist(B, C)); }
// Example 14: reflection in the y-axis
{ const P = [-4, 3], R = [-P[0], P[1]];
  exSays(14, pt(...R), dist(P, R), dist(P, [0, 0])); is('Example 14: OP = OP\'', dist(P, [0, 0]) === dist(R, [0, 0]));
  is('Example 14 remark: the mirror is 4 from each end', Math.abs(P[0]) === 4 && /\(0,3\), 4 units/.test(plain(ex[14]))); }
// Example 15: the lattice points at distance 5
const lattice = (r) => { const o = []; for (let x = -r; x <= r; x++) for (let y = -r; y <= r; y++) if (x * x + y * y === r * r) o.push([x, y]); return o; };
{ is('Example 15 remark: (5, 5) is √50 away', d2([0, 0], [5, 5]) === 50 && /√50/.test(plain(ex[15])));
  const sums = []; for (const a of [0, 1, 4, 9, 16, 25]) for (const b of [0, 1, 4, 9, 16, 25]) if (a <= b && a + b === 25) sums.push([a, b]);
  ok('Example 15: the ways 25 is two squares', sums, [[0, 25], [9, 16]]); }
// Example 16
{ const S = [2, 3], L = [8, 11]; exSays(16, dist(S, L), Math.abs(L[0] - S[0]) + Math.abs(L[1] - S[1])); }
// Example 6 remark: shift 4 across gives 3 or 11
is('Example 6 remark: 7 ∓ 4', [7 - 4, 7 + 4].every(v => has(plain(ex[6]), v)));
// Example 7 remarks: (0, 1) is √26 and √18
is('Example 7 remark on (b)', d2([0, 1], [-5, 2]) === 26 && d2([0, 1], [3, 4]) === 18 && /√26/.test(plain(ex[7])) && /√18/.test(plain(ex[7])));
is('Example 7 check: √34 each way', d2([0, -1], [-5, 2]) === 34 && d2([0, -1], [3, 4]) === 34);
// Example 2 remark
is('Example 2 remark: (−4, −4) is √32 away', d2([0, 0], [-4, -4]) === 32 && /√32/.test(plain(ex[2])));

// the figures, measured from their own coordinates
const figs = {};
for (const src of [body, beyond]) for (const m of src.matchAll(/fignum">Fig\. ([\d.B]+)</g)) {
  // the last <svg before the caption belongs to it
  const a = src.lastIndexOf('<svg', m.index);
  figs[m[1]] = src.slice(a, src.indexOf('</svg>', a));
}
const num = (s) => Number(String(s).replace(/[–−]|&minus;/g, '-'));
function frame(svg) {
  const lines = [...svg.matchAll(/<line class="dg-(?:line|axis)" x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)"/g)].map(m => m.slice(1).map(Number));
  const xAxis = lines.find(l => l[1] === l[3]), yAxis = lines.find(l => l[0] === l[2]);
  const tick = (anchor) => { const m = svg.match(new RegExp(`<text class="dg-(?:label--sm|tick)" x="([\\d.]+)" y="([\\d.]+)" text-anchor="${anchor}">1</text>`)); return m && [Number(m[1]), Number(m[2])]; };
  const tx = tick('middle'), ty = tick('end');
  return { ox: yAxis[0], oy: xAxis[1], ux: tx[0] - yAxis[0], uy: xAxis[1] - (ty[1] - 4) };
}
const circles = (svg) => [...svg.matchAll(/<circle class="dg-fill-teal" cx="([\d.]+)" cy="([\d.]+)"/g)].map(m => [Number(m[1]), Number(m[2])]);
const drawnAt = (svg) => { const f = frame(svg); return circles(svg).map(([cx, cy]) => [(cx - f.ox) / f.ux, (f.oy - cy) / f.uy]); };
const drawn = (svg, p) => drawnAt(svg).some(q => near(q[0], p[0], 0.02) && near(q[1], p[1], 0.02));
let labelled = 0;
for (const [n, svg] of Object.entries(figs)) {
  if (!/dg-(?:label--sm|tick)/.test(svg)) continue;                       // not a coordinate grid
  for (const m of svg.matchAll(/<text class="dg-label"[^>]*>([\s\S]*?)<\/text>/g)) {
    const t = m[1].replace(/<[^>]+>/g, '').replace(/&minus;/g, '-');
    const c = t.match(/\(\s*([-–−]?[\d.]+),\s*([-–−]?[\d.]+)\)/);
    if (!c) continue;
    labelled++;
    const p = [num(c[1]), num(c[2])];
    is(`Fig. ${n}: "${t}" is drawn at ${pt(...p)}`, drawn(svg, p));
  }
}
is(`the figures carry labelled points (${labelled})`, labelled >= 30);
// the unlabelled points of the room, against the list ANSWERS.md reads off them
{ const list = [...answersMd.slice(0, answersMd.indexOf('---')).matchAll(/\$([A-Z])(?:_(\d))?\((-?[\d.]+), (-?[\d.]+)\)\$/g)].map(m => [m[1] + (m[2] || ''), [Number(m[3]), Number(m[4])]]);
  is(`ANSWERS.md lists the plan's points (${list.length})`, list.length === 18);
  for (const [name, p] of list) is(`Fig. 1.5 draws ${name} at ${pt(...p)}`, drawn(figs['1.5'], p));
  for (const [name, p] of list.filter(([, p]) => p[0] >= 0)) is(`Fig. 1.3 draws ${name} at ${pt(...p)}`, drawn(figs['1.3'], p));
  const P = Object.fromEntries(list);
  is('Fig. 1.5: the shower SHWR is a 4 ft square', dist(P.S, P.H) === 4 && dist(P.H, P.W) === 4 && dist(P.W, P.R) === 4 && dist(P.R, P.S) === 4);
  is('Fig. 1.1: the bedroom 12 by 10 and the bathroom 6 by 9 agree with Fig. 1.5', P.P[0] === -6 && P.F[1] === 9 && drawn(figs['1.5'], [12, 10]));
  is('Fig. 1.1 is drawn to one scale (34 per foot)', /width="408" height="340"/.test(figs['1.1']) && /width="204" height="306"/.test(figs['1.1']) && 408 / 12 === 340 / 10 && 204 / 6 === 306 / 9); }
// Fig. 1B.4: every lattice point at 5, and nothing else
{ const got = drawnAt(figs['1B.4']);
  is(`Fig. 1B.4 draws the ${lattice(5).length} points`, got.length === 12 && lattice(5).every(p => drawn(figs['1B.4'], p))); }
// Fig. 1B.2 and Fig. 1B.3 mark a right angle at B
is('Fig. 1B.2: the right angle is at B', (1 - 4) * (8 - 4) + (1 - 5) * (2 - 5) === 0);
is('Fig. 1B.3: the right angle is at B, and the four sides are 5', (2 - 5) * (9 - 5) + (4 - 8) * (5 - 8) === 0 && [[2, 4], [5, 8], [9, 5], [6, 1]].every((p, i, a) => dist(p, a[(i + 1) % 4]) === 5));

// the body's own worked values
{ const A = [3, 4], D = [7, 1], M = [9, 6];
  is('p011-p012: AD, DM, MA', dist(A, D) === 5 && d2(D, M) === 29 && d2(M, A) === 40);
  const r = (p) => [-p[0], p[1]];
  is('p012: the images and their sides', dist(r(A), r(D)) === 5 && d2(r(D), r(M)) === 29 && d2(r(M), r(A)) === 40 && /A' \(-3,4\), D' \(-7,1\) and M' \(-9,6\)/.test(plain(body).replace(/′/g, "'"))); }
is('p005: B, G, H, E read off Fig. 1.2', ['(4.5,0)', '(0,-4.5)', '(0,4)', '(-2.9,0)'].every(v => plain(body).includes(v)));

// the exercises, read back off ANSWERS.md
const mdSection = (head) => { const i = answersMd.indexOf(head); if (i < 0) return ''; const j = answersMd.indexOf('\n#', i + head.length); return answersMd.slice(i, j < 0 ? undefined : j); };
const mdItem = (head, n) => { const m = mdSection(head).match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`)); return m ? plain(m[1]).replace(/\*/g, '') : ''; };
const mdSays = (head, n, ...vals) => { for (const v of vals) is(`ANSWERS.md ${head} Q${n} should say ${v}: "${mdItem(head, n).slice(0, 100)}"`, has(mdItem(head, n), v)); };
const S1 = '### Exercise Set 1.1', S2 = '### Exercise Set 1.2', E = '## End-of-Chapter Exercises';
{ const D1 = [8, 0], R1 = [11.5, 0], B1 = [0, 1.5], B2 = [0, 4];
  mdSays(S1, 1, D1[0], pt(...D1), R1[0] - D1[0]);
  mdSays(S1, 2, B2[1] - B1[1], (R1[0] - D1[0]) - (B2[1] - B1[1]));
  is('Ex 1.1 Q2: narrower', B2[1] - B1[1] < R1[0] - D1[0] && /narrower/.test(mdItem(S1, 2))); }
{ const f = [[8, 9], [11, 9], [11, 7]], fourth = [f[0][0], f[2][1]];
  mdSays(S2, 1, pt(...fourth), f[1][0] - f[0][0], f[1][1] - f[2][1], 12 - 11, 10 - 9);
  // Q2: the door's reach against the wardrobe's nearest point
  const reach = 4 - 1.5, W = { x0: 3, x1: 7, y0: 0, y1: 2 }, B1 = [0, 1.5];
  const nearest = [Math.min(Math.max(B1[0], W.x0), W.x1), Math.min(Math.max(B1[1], W.y0), W.y1)];
  is('Ex 1.2 Q2: the door does not reach the wardrobe', dist(B1, nearest) > reach && /does not strike/.test(mdItem(S2, 2)));
  mdSays(S2, 2, reach, pt(...nearest), dist(B1, nearest));
  mdSays(S2, 3, '(0,9)', '(-6,9)', '(-6,0)', '(-6,5)', '(-2,5)', '(-2,9)', 4);
  // Q3 (iii): the fixtures are the right sizes, inside the bathroom, clear of the shower and of each other
  const rect = (a, b) => ({ x0: a[0], y0: a[1], x1: b[0], y1: b[1] });
  const basin = rect([-6, 0], [-3, 2]), wc = rect([-2, 5], [0, 8]), shower = rect([-6, 5], [-2, 9]);
  const inside = (r) => r.x0 >= -6 && r.x1 <= 0 && r.y0 >= 0 && r.y1 <= 9;
  const apart = (p, q) => p.x1 <= q.x0 || q.x1 <= p.x0 || p.y1 <= q.y0 || q.y1 <= p.y0;
  is('Ex 1.2 Q3 (iii): the instance fits', inside(basin) && inside(wc) && apart(basin, shower) && apart(wc, shower) && apart(basin, wc)
    && basin.x1 - basin.x0 === 3 && basin.y1 - basin.y0 === 2 && wc.x1 - wc.x0 === 2 && wc.y1 - wc.y0 === 3);
  // Q4: the dining room and its table
  const P = [-6, 0], A = [12, 0];
  is('Ex 1.2 Q4: PA is the 18 ft length', dist(P, A) === 18);
  const c = [(P[0] + A[0]) / 2, -15 / 2];
  mdSays(S2, 4, '(12,-15)', '(-6,-15)', pt(...c), pt(c[0] - 2.5, c[1] + 1.5), pt(c[0] + 2.5, c[1] + 1.5), pt(c[0] + 2.5, c[1] - 1.5), pt(c[0] - 2.5, c[1] - 1.5)); }
mdSays('### Think and Reflect (Fig. 1.6)', 1, 7 - 3, 4 - 1);
mdSays('### Think and Reflect (Fig. 1.6)', 2, Math.hypot(4, 3));
mdSays('### Think and Reflect (after Fig. 1.9)', 2, '(3,-4)', '(7,-1)', '(9,-6)');
mdSays(E, 1, '(0,0)');
{ const Z = [5, -6], I = [5, -2], N = [8, -2]; is('End Q4 instance: right angle at I', (Z[0] - I[0]) * (N[0] - I[0]) + (Z[1] - I[1]) * (N[1] - I[1]) === 0); mdSays(E, 4, dist(Z, I), dist(I, N), dist(Z, N)); }
{ const M = [-3, -4], A = [0, 0], G = [6, 8]; mdSays(E, 6, dist(M, A), dist(A, G), dist(M, G)); is('End Q6: collinear', dist(M, A) + dist(A, G) === dist(M, G)); }
{ const R = [-5, -1], B = [-2, -5], C = [4, -12];
  is('End Q7: RB, BC, RC', dist(R, B) === 5 && d2(B, C) === 85 && d2(R, C) === 202);
  is('End Q7: not collinear, and only just', 5 + Math.sqrt(85) > Math.sqrt(202) && 5 + Math.sqrt(85) - Math.sqrt(202) < 0.01 && 8500 > 92 ** 2 && 92 ** 2 === 8464);
  mdSays(E, 7, 110, 8500, 8464, 92, (5 + Math.sqrt(85)).toFixed(4), Math.sqrt(202).toFixed(4)); }
mdSays(E, 8, 32, 5);
{ const rows = [[[-3, 0], [0, 0], [3, 0]], [[2, 3], [3, 4], [4, 5]], [[0, 0], [0, 5], [0, -10]], [[-8, 7], [0, -2], [6, -3]]];
  const verdict = rows.map(([S, M, T]) => (S[0] + T[0]) / 2 === M[0] && (S[1] + T[1]) / 2 === M[1]);
  ok('End Q9 verdicts', verdict, [true, true, false, false]);
  const item = mdItem(E, 9);
  is('End Q9: the rows read yes, yes, no, no', /Row 1: yes.*Row 2: yes.*Row 3: no.*Row 4: no/.test(item));
  mdSays(E, 9, pt(0, -5), pt(-1, 2), dist([0, 0], [0, 5]), dist([0, 5], [0, -10])); }
{ const A = [3, -4], M = [-7, 1]; mdSays(E, 10, pt(2 * M[0] - A[0], 2 * M[1] - A[1])); }
{ const A = [4, 7], B = [16, -2], s = [(B[0] - A[0]) / 3, (B[1] - A[1]) / 3];
  mdSays(E, 11, pt(A[0] + s[0], A[1] + s[1]), pt(A[0] + 2 * s[0], A[1] + 2 * s[1])); }
{ const O = [0, 0], r2 = [[1, -8], [-4, 7], [-7, -4]].map(p => d2(O, p));
  is('End Q12: A, B, C are all 65', r2.every(v => v === 65)); mdSays(E, 12, '√65', d2(O, [-5, 6]), d2(O, [0, 9]));
  is('End Q12: D inside, E outside', d2(O, [-5, 6]) < 65 && d2(O, [0, 9]) > 65 && /D\$? is inside|D is inside/.test(mdItem(E, 12).replace(/\*/g, ''))); }
{ const D = [5, 1], Ee = [6, 5], F = [0, 3], add = (p, q, r) => [p[0] + q[0] - r[0], p[1] + q[1] - r[1]];
  const A = add(Ee, F, D), B = add(D, F, Ee), C = add(D, Ee, F), mid = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
  is('End Q13: the midpoints come back', JSON.stringify([mid(B, C), mid(C, A), mid(A, B)]) === JSON.stringify([D, Ee, F]));
  mdSays(E, 13, pt(...A), pt(...B), pt(...C)); }
{ const A = [100, 150], B = [250, 230];
  const inside = (c, r) => c[0] - r >= 0 && c[0] + r <= 800 && c[1] - r >= 0 && c[1] + r <= 600;
  is('End Q15: both circles on screen', inside(A, 80) && inside(B, 100));
  is('End Q15: they overlap', dist(A, B) < 180); mdSays(E, 15, dist(A, B), 180, 28900, 20, 70, 230, 150, 350, 130, 330); }
{ const P = [[2, 1], [-1, 2], [-2, -1], [1, -2]], s = P.map((p, i) => d2(p, P[(i + 1) % 4]));
  is('End Q16: a square', s.every(v => v === 10) && d2(P[0], P[2]) === 20 && d2(P[1], P[3]) === 20 && /\*\*Yes/.test(mdSection(E)));
  mdSays(E, 16, 10, 20); }
{ const c = [[2, 1], [8, 1], [8, 5], [2, 5]], o = [5, 3];
  mdSays(E, 17, ...c.map(p => pt(p[0] - 2, p[1] - 1)), 6 * 4, ...c.map(p => pt(p[0] - o[0], p[1] - o[1])));
  is('End Q17 (iii): one corner in each quadrant', new Set(c.map(p => `${Math.sign(p[0] - o[0])}${Math.sign(p[1] - o[1])}`)).size === 4); }

// Stage 1, by search
{ const on = []; for (let x = -20; x <= 20; x += 0.5) if (near(d2([x, 0], [3, 4]), 25)) on.push(x);
  ok('Stage 1 Q1: the points of the x-axis', on, [0, 6]); is('Stage 1 Q1 prints them', /\(6,0\) and the origin/.test(plain(beyond))); }
{ const a = -2, b = 3, quad = ([x, y]) => (x > 0 ? (y > 0 ? 'I' : 'IV') : (y > 0 ? 'II' : 'III'));
  ok('Stage 1 Q2', [[b, a], [-a, b], [a, -b]].map(quad), ['IV', 'I', 'III']); }
{ const A = [1, 1], B = [4, 5], C = [8, 2]; is('Stage 1 Q3', d2(A, B) === 25 && d2(B, C) === 25 && d2(C, A) === 50 && (A[0] - B[0]) * (C[0] - B[0]) + (A[1] - B[1]) * (C[1] - B[1]) === 0); }
{ let least = Infinity; for (let t = 0; t < 360; t += 0.25) { const p = [3 * Math.cos(t * Math.PI / 180), 3 * Math.sin(t * Math.PI / 180)]; least = Math.min(least, dist(p, [10, 0])); }
  is(`Stage 1 Q4: the nearest a point 3 from O gets to (10, 0) is ${least.toFixed(3)}, printed at least 7`, near(least, 7, 1e-6) && /at least \$?7/.test(text(beyond))); }
{ const hits = []; for (let x = -10; x <= 10; x++) for (let y = -10; y <= 10; y++) if (x * x + y * y === 25 && (x - 6) ** 2 + y * y === 25) hits.push(pt(x, y));
  ok('Stage 1 Q5', hits, ['(3,-4)', '(3,4)']); }

// the practice answers, read back out of the key rows
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= plain(m[2]);
const row = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const r = keyRows[n] || '';
  if (!part) return r;
  const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\) |$)`));
  return m ? m[1] : '';
};
const says = (q, ...vals) => { for (const v of vals) is(`key ${q} should say ${v}: "${row(q)}"`, has(row(q), v)); };
const eqd = (p, q) => d2(p, q);
const P = {
  19: [pt(0, -7), dist([0, -7], [24, 0])],
  20: [Math.abs(4 - -2), Math.abs(5 - -3), dist([-2, -3], [4, 5])],
  21: [6 + 8 + dist([0, 0], [6, 8])],
  22: [(() => { for (let k = -20; k <= 20; k += 0.5) if (eqd([k, 2], [1, -2]) === eqd([k, 2], [7, 4])) return k; })()],
  23: [pt(2 * 1 - -3, 2 * -2 - 4)],
  24: [pt(-6 + 3, 10 - 4), pt(-6 + 6, 10 - 8)],
  25: [dist([-2, 1], [1, 5]), dist([4, 1], [1, 5]), dist([-2, 1], [4, 1]), 5 - 1, dist([-2, 1], [4, 1]) * (5 - 1) / 2],
  26: [(() => { for (let x = -20; x <= 20; x++) for (let y = -20; y <= 20; y++) { const q = [x, y]; if (eqd(q, [4, 3]) === eqd(q, [-4, -1]) && eqd(q, [4, 3]) === eqd(q, [5, -4])) return pt(x, y); } })(), 5],
  27: [(8 + 2) / 2, (8 - 2) ** 2 - 3 ** 2, 'C is (5,3 + √27) or (5,3 - √27)'.match(/√27/)[0]],
  '28a': [pt(-4 + 4, -2 + 3), pt(-4 + 8, -2 + 6)],
  '28b': [pt((-4 + 8) / 2, (-2 + 7) / 2)],
  '28c': [dist([0, 1], [4, 4]), dist([-4, -2], [8, 7])],
  '29b': [dist([0, 0], [3, 4])], '29c': [3 - -5], '29d': [(4 - -2) + (3 - -5), dist([3, 4], [-5, -2])],
  '30a': [9 * 12], '30b': [dist([4.5, 11], [1.5, 7])], '30c': [dist([0, 0], [9, 12])], '30d': [pt(9 / 2, 12)],
};
for (const [q, vs] of Object.entries(P)) says(q, ...vs);
is('key 26 is 5 from each house', [[4, 3], [-4, -1], [5, -4]].every(h => dist([1, -1], h) === 5));
is('key 27: both points make an equilateral triangle', [1, -1].every(sg => { const C = [5, 3 + sg * Math.sqrt(27)]; return near(dist([2, 3], C), 6) && near(dist([8, 3], C), 6); }) && /\(5, ?3 \+ √27\) or \(5, ?3 - √27\)/.test(row(27)));
is('key 28 (b): (0 + 2, 1 + 1.5) is (2, 2.5)', row('28b').includes('(0 + 2,1 + 1.5) = (2,2.5)') || row('28b').includes('(0 + 2, 1 + 1.5) = (2,2.5)'));
is('key 29 (d) reads as a phrase', row('29d').trim() === `${(4 - -2) + (3 - -5)} = ${(4 - -2) + (3 - -5)} km along the streets; √8^2 + 6^2 = ${dist([3, 4], [-5, -2])} km in a straight line`.replace(/^\d+/, '6 + 8'));
is('key 29 (a): the customer is in Quadrant III', -5 < 0 && -2 < 0 && /Quadrant III/.test(row('29a')));

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] ??= m[2];
const optsOf = (src) => { const o = (src || '').match(/<ol class="c-parts c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/); return o ? [...o[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => plain(x[1]).trim()) : []; };
const key = {};
{ const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2]; }
// the points a question prints before its options, read off the page
const qPts = (n) => [...plain((qs[n] || '').split('<ol')[0]).matchAll(/\((-?[\d.]+),(-?[\d.]+)\)/g)].map(m => [Number(m[1]), Number(m[2])]);
const val = (v) => (o) => o.map(s => s === String(v));
const sval = (x) => (o) => o.map(s => { const m = s.match(/^(\d*)√(\d+)$/); const n = m ? (m[1] ? Number(m[1]) : 1) * Math.sqrt(Number(m[2])) : Number(s); return near(n, x, 1e-9); });
const where = ([x, y]) => (x === 0 && y === 0 ? 'origin' : x === 0 ? 'on the y-axis' : y === 0 ? 'on the x-axis' : `in Quadrant ${x > 0 ? (y > 0 ? 'I' : 'IV') : (y > 0 ? 'II' : 'III')}`);
const tri = (A, B, C) => { const s = [d2(A, B), d2(B, C), d2(C, A)].sort((a, b) => a - b); const iso = new Set(s).size < 3, right = s[0] + s[1] === s[2];
  return iso && right ? 'both isosceles and right-angled' : iso ? 'isosceles but not right-angled' : right ? 'right-angled but not isosceles' : 'neither isosceles nor right-angled'; };
const solve = {
  1: o => o.map(s => s === where([0, -6])),
  2: o => sval(dist(...qPts(2)))(o),
  3: o => sval(dist([0, 0], qPts(3)[0]))(o),
  4: o => o.map(s => s === 'x < 0, y < 0'),                                     // Quadrant III, both signs negative
  5: o => sval(dist(...qPts(5)))(o),
  6: sval(dist([0, 0], [6, 4])),
  7: o => o.map(s => /,0\)$/.test(s) && !/^\(0,/.test(s)),
  8: o => sval(dist(...qPts(8)))(o),
  9: o => { const ds = [-9, 0, 2.5, 40].map(x => dist([x, 3], [x, -2])); return o.map(s => ds.every(d => s === String(d))); },
  10: o => { const P0 = [-4, 0], t = [where(P0) === 'in Quadrant II', where(P0) === 'on the x-axis', dist(P0, [0, 0]) === 4];
    const pick = t.map((b, i) => (b ? ['(i)', '(ii)', '(iii)'][i] : null)).filter(Boolean);
    const want = pick.length === 3 ? 'all three' : pick.length === 1 ? `${pick[0]} only` : pick.join(' and ');
    return o.map(s => s === want); },
  11: o => o.map(s => s === pt((-4 + 6) / 2, (7 - 1) / 2)),
  12: o => { const ys = [], c = qPts(12)[0], r = Number(plain(qs[12]).match(/is (\d+) units/)[1]); for (let y = -40; y <= 40; y++) if (d2([0, y], c) === r * r) ys.push(y);
    const want = ys.length === 2 ? `(0,${ys[1]}) or (0,${ys[0]})` : ys.length ? `(0,${ys[0]}) only` : 'there is no such point'; return o.map(s => s === want); },
  13: o => o.map(s => s === tri([3, 0], [6, 4], [-1, 3])),
  14: o => o.map(s => s === String(lattice(25).length)),
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(qs[q]);
  is(`Q${q} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Q${q}: the right option`, right, [key[q]]);
}
// the MCQ examples: exactly one right option, the one the Answer row names
const exKey = (n) => (rowOf(ex[n], 'Answer').match(/\(([a-d])\)/) || [])[1];
const exSolve = {
  2: o => o.map(s => s === pt(-4, 0)),
  5: o => { const pts = o.map(s => s.match(/-?\d+/g).map(Number)); const best = Math.max(...pts.map(p => d2([0, 0], p))); return pts.map(p => d2([0, 0], p) === best); },
  6: o => { const as = []; for (let a = -20; a <= 30; a++) if (d2([a, 2], [7, 6]) === 25) as.push(a); return o.map(s => s === `${as[0]} or ${as[1]}`); },
  7: o => o.map(s => { const p = s.match(/-?\d+/g).map(Number); return p[0] === 0 && d2(p, [-5, 2]) === d2(p, [3, 4]); }),
  11: o => o.map(s => { const [a, b] = s.match(/-?\d+/g).map(Number); return (a + 5) / 2 === 2 && (3 + b) / 2 === -1; }),
  12: o => { const V = [[2, 4], [5, 8], [9, 5], [6, 1]], s = V.map((p, i) => d2(p, V[(i + 1) % 4]));
    const rhombus = s.every(v => v === s[0]), right = d2(V[0], V[1]) + d2(V[1], V[2]) === d2(V[0], V[2]);
    const want = rhombus && right ? 'a square' : rhombus ? 'a rhombus that is not a square' : right ? 'a rectangle that is not a square' : 'a parallelogram with no right angle';
    return o.map(x => x === want); },
  15: o => o.map(s => Number(s) === lattice(5).length),
};
for (const [n, f] of Object.entries(exSolve)) {
  const o = optsOf(ex[n]);
  is(`Example ${n} has four options`, o.length === 4);
  ok(`Example ${n}: the right option`, f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean), [exKey(n)]);
}
// the wrong readings the remarks finish
is('Example 11 (a): adding without halving gives (−3, −4)', 2 - 5 === -3 && -1 - 3 === -4 && optsOf(ex[11])[0] === pt(-3, -4));
is('Example 11 (d): a − 2 = 5 − 2 gives 5', 5 - 2 + 2 === 5 && optsOf(ex[11])[3] === pt(5, -5));
is('Example 6 (d): 7 − a = ±4', optsOf(ex[6])[3] === `${7 - 4} or ${7 + 4}`);
is('Example 7 (c): half way up is 3', (2 + 4) / 2 === 3 && optsOf(ex[7])[2] === pt(0, 3));
// the practice remarks on wrong options
is('why 3: 24 − 7 and 24 + 7', optsOf(qs[3])[0] === String(24 - 7) && optsOf(qs[3])[1] === String(24 + 7) && optsOf(qs[3])[3] === String(7 * 7 + 24 * 24));
is('why 6: 6 + 4, the area, and 52', optsOf(qs[6])[0] === String(6 + 4) && optsOf(qs[6])[2] === String(6 * 4) && optsOf(qs[6])[3] === String(6 * 6 + 4 * 4));
is('why 8: √(2 + 2²) = √6', 2 + 2 ** 2 === 6 && optsOf(qs[8])[1] === String(2 + 2));
is('why 11: the half-shift, the sum, the wrong way round', optsOf(qs[11])[1] === pt(5, -4) && optsOf(qs[11])[2] === pt(-4 + 6, 7 - 1) && optsOf(qs[11])[3] === pt((-4 - 6) / 2, (7 - -1) / 2));
is('why 14: 4 and 12 and 16', optsOf(qs[14])[0] === '4' && optsOf(qs[14])[1] === String(4 + 8) && optsOf(qs[14])[2] === String(8 + 8));
is('why 13: right angle at A', (6 - 3) * (-1 - 3) + (4 - 0) * (3 - 0) === 0 && /right angle at \$?A/.test(text(beyond)));

const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
{ const swaps = [[3, 1], [-2, 4], [0, 5]].every(([x1, x2]) => (x2 - x1) ** 2 === (x1 - x2) ** 2);
  const q18r = (() => { for (const p of lattice(5)) for (const q of lattice(5)) if (where(p) !== where(q)) return false; return true; })();
  const AR = {
    15: [swaps, true, true],                                           // the squares are why the order does not matter
    16: [where([-3, -3]) === 'in Quadrant IV', -3 < 0, false],
    17: [dist([2, 0], [0, 0]) === dist([-2, 0], [0, 0]), true, false], // true, but not the reason
    18: [dist([3, 4], [0, 0]) === dist([4, 3], [0, 0]), q18r, false],
  };
  for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]); }
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-18', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(18)].map((_, i) => i + 1));
ok('practice numbered 1-30', [...beyond.matchAll(/data-start="(\d+)"/g)].map(m => Number(m[1])), [...Array(29)].map((_, i) => i + 2));
is('the note names 15 to 18', /Questions 15 to 18/.test(beyond));

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
{ const i = answersMd.indexOf('as the key prints it'); for (const m of answersMd.slice(i, i + 700).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2]; }
ok('ANSWERS.md key matches the page', mdKey, key);
const W = '### The working for each';
for (const [q, vs] of Object.entries(P)) {
  const [, n, part] = q.match(/^(\d+)([a-d]?)$/);
  let r = mdItem(W, n);
  if (part) { const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\) |$)`)); r = m ? m[1] : ''; }
  // the page works the shifts; ANSWERS.md prints only the results
  const skip = { 20: [6, 8], 25: [6, 4], 27: [27] }[n] || [];
  for (const v of vs) if (!skip.includes(v)) is(`ANSWERS.md practice ${q} should say ${v}: "${r.slice(0, 80)}"`, has(r, v));
}
for (const q of Object.keys(solve)) {
  const right = optsOf(qs[q])['abcd'.indexOf(key[q])] || '';
  if (/^-?[\d√()., ]+$/.test(right) && /\d/.test(right)) is(`ANSWERS.md practice ${q} should reach ${right}`, plain(mdItem(W, q)).includes(right));
}
for (const q of ['15', '16', '17', '18']) is(`ANSWERS.md practice ${q} gives letter (${key[q]})`, mdItem(W, q).startsWith(`(${key[q]})`));

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
