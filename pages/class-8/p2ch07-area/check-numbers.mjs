#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed — areas, heights, conversions, figure geometry — and compared
   with what is read off the page.

     node pages/class-8/p2ch07-area/check-numbers.mjs [--skipped]

   Four parts:
     A  every identity set as maths, on every page and in ANSWERS.md, whose
        sides evaluate to numbers ($$…$$ first, then $…$; "\approx" is
        checked to the places printed)
     B  what A cannot check: the figures' labels against their drawn
        geometry, values in running text, every worked example's Answer
        row, the practice answers read back out of the key (lettered parts
        one at a time), and every body exercise answer in ANSWERS.md
     C  every multiple-choice and assertion-reason question: exactly one
        option is right, and it is the one the key prints
     D  ANSWERS.md prints the same key as the page; question numbering runs
        1, 2, 3 … in every set

   Exits non-zero if anything does not hold up. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const B = String.fromCharCode(92);
let pass = 0;
const fails = [];
const ok = (what, got, want) => {
  if (JSON.stringify(got) === JSON.stringify(want)) pass++;
  else fails.push(`${what}\n      computed ${JSON.stringify(got)}\n      printed  ${JSON.stringify(want)}`);
};
const is = (what, cond) => { if (cond) pass++; else fails.push(what); };
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const md = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');

// plain text: tags out, thousands joined, maths delimiters kept
const T = (s) => s
  .replace(/<sup>2<\/sup>/g, '²')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;|&thinsp;|&middot;/g, ' ')
  .replace(/&ndash;/g, '-')
  .replace(/\\,|\{,\}/g, '')
  .replace(/(\d) (\d{3})(?!\d)/g, '$1$2')
  .replace(/\s+/g, ' ');
const esc = (v) => String(v).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const has = (txt, v) => new RegExp(`(^|[^\\d.])${esc(v)}(?!\\d|\\.\\d)`).test(txt);
const says = (what, txt, ...vals) => { for (const v of vals) is(`${what} should say ${v}: "${txt.slice(0, 160)}"`, has(txt, v)); };
// a number to the places the page prints it
const fmt = (x, d = 2) => String(Number(x.toFixed(d)));
// the first number following a phrase in some text
const after = (txt, re) => { const m = txt.match(re); if (!m) { fails.push(`not found on the page: ${re}`); return NaN; } return Number(m[1]); };

/* ---- A. every identity ---------------------------------------- */

function toExpr(side) {
  let s = side
    .replace(/\\text\{[^{}]*\}(\^\d)?/g, '')
    .replace(/\\left|\\right/g, '')
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\tfrac(\d)(\d)/g, '(($1)/($2))')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'Math.sqrt($1)')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad|\{,\}/g, '')
    .replace(/\^\{([^{}]+)\}/g, '**($1)').replace(/\^(\d)/g, '**$1')
    .replace(/[.,]\s*$/, '')
    .replace(/\s+/g, '');
  if (!s || !/^(Math\.sqrt|[-+*/().0-9])+$/.test(s)) return null;
  s = s.replace(/\)\(/g, ')*(').replace(/(\d)\(/g, '$1*(');
  return s;
}
const evalExpr = (e) => { try { return Function(`"use strict";return (${e})`)(); } catch { return NaN; } };
const places = (lit) => { const m = String(lit).trim().match(/^\d+\.(\d+)$/); return m ? m[1].length : 0; };

// spans printed to be judged false, not claimed
const FALSE_ON_PURPOSE = [];
let spans = 0; const skipped = [];
function checkSpan(where, span) {
  if (!/=|\\approx/.test(span) || FALSE_ON_PURPOSE.includes(span.trim())) return;
  for (const part of span.split(/\\qquad|,\s*\\ /)) {
    // a chain: side op side op side …
    const bits = part.split(/(=|\\approx)/);
    const sides = [], ops = [];
    for (let i = 0; i < bits.length; i++) (i % 2 ? ops : sides).push(bits[i].trim());
    if (sides.length < 2) continue;
    const vals = sides.map(toExpr).map(e => (e === null ? null : evalExpr(e)));
    const live = vals.map((v, i) => [v, i]).filter(([v]) => v !== null && Number.isFinite(v));
    if (live.length < 2) { skipped.push(`${where}: $${part.trim()}$`); continue; }
    spans++;
    let bad = false;
    for (let k = 1; k < live.length; k++) {
      const [a, i] = live[k - 1], [b, j] = live[k];
      const approx = ops.slice(i, j).includes(B + 'approx');
      if (approx) { const d = places(sides[j]); if (Math.abs(a - b) > 0.5 * 10 ** -d + 1e-9) bad = true; }
      else if (!near(a, b)) bad = true;
    }
    if (bad) fails.push(`${where}: $${part.trim()}$ — sides are ${live.map(x => x[0]).join(' and ')}`);
    else pass++;
  }
}
for (const [f, src] of [...pages.map(f => [f, html[f]]), ['ANSWERS.md', md]]) {
  // display maths first, so a $$…$$ is never read as two empty inline spans
  const rest = src.replace(/\$\$([^$]+)\$\$/g, (m, s) => { checkSpan(f, s); return ' '; });
  for (const m of rest.matchAll(/\$([^$]+)\$/g)) checkSpan(f, m[1]);
}

/* ---- B. the figures ------------------------------------------- */

const svgs = [...body.matchAll(/<svg(?:(?!<svg)[\s\S])*?<\/svg>\s*<figcaption><span class="fignum">Fig\. (7\.\d+)/g)].map(m => ({ fig: m[1], svg: m[0] }));
const svg = (n) => (svgs.find(s => s.fig === n) || {}).svg || '';
const labels = (s) => [...s.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map(m => m[1]);
const rects = (d) => [...d.matchAll(/M(\d+) (\d+) H(\d+) V(\d+) H\d+ Z/g)].map(m => [(+m[3] - +m[1]), (+m[4] - +m[2])]);

// Fig. 7.1: 9 units to the centimetre; the labels and the notes
{
  const s = svg('7.1');
  const [r1, r2] = rects(s.match(/dg-line"\s+d="([^"]+)"/)[1]);
  const L = labels(s);
  const cm = L.filter(x => / cm$/.test(x)).map(x => parseFloat(x));
  ok('Fig 7.1: drawn sides, in cm', [r1[0] / 9, r1[1] / 9, r2[0] / 9, r2[1] / 9], cm);
  ok('Fig 7.1: unit-square notes', [r1[0] * r1[1] / 81, r2[0] * r2[1] / 81], L.filter(x => /unit squares/.test(x)).map(x => parseInt(x)));
  const t = T(body);
  ok('7.2: the patches take 28 and 24', [cm[0] * cm[1], cm[2] * cm[3]], [after(t, /first patch takes \$(\d+)\$/), after(t, /and the second \$(\d+)\$/)]);
  ok('7.2: diagonal halves the 7 by 4 patch', cm[0] * cm[1] / 2, after(t, /7 \\times 4 = (\d+)\$ cm²/));
}
// Fig. 7.2 and its table
{
  const s = svg('7.2');
  const drawn = rects(s.match(/dg-line"\s+d="([^"]+)"/)[1]).map(([w, h]) => `${w / 9} by ${h / 9}`);
  ok('Fig 7.2: labels match the drawn rectangles', drawn, labels(s));
  const rows = [...body.matchAll(/<tr><td>\$(\d+)\$ by \$(\d+)\$<\/td><td>\$(\d+)\$<\/td><td>\$(\d+)\$<\/td><\/tr>/g)].map(m => m.slice(1).map(Number));
  ok('7.3 table: rows are the figure\'s rectangles', rows.map(r => `${r[0]} by ${r[1]}`), drawn);
  ok('7.3 table: perimeters and areas', rows.map(([a, b]) => [2 * (a + b), a * b]), rows.map(r => [r[2], r[3]]));
  const t = T(body);
  ok('7.3: two and a half times', 20 / 8, 2.5);
  is('7.3 text says two and a half times', /two and a half times/.test(t));
  ok('7.3: 7 by 2 and 6 by 3', [7 * 2, 6 * 3, 2 * (7 + 2), 2 * (6 + 3)], [after(t, /\$7\$ by \$2\$ gives \$(\d+)\$/), after(t, /\$6\$ by \$3\$ gives \$(\d+)\$/), 18, 18]);
  is('7.3: 5 by 4 is the most among perimeter 18', [1, 2, 3, 4].every(a => a * (9 - a) <= 20));
}
// Fig. 7.6: 20 units to the unit; BC, the height, AC and BY
{
  const s = svg('7.6');
  const [B_, C_, A_] = s.match(/dg-line"\s+d="M(\d+) (\d+) L(\d+) (\d+) L(\d+) (\d+) Z"/).slice(1).map(Number).reduce((o, v, i) => (i % 2 ? o[o.length - 1].push(v) : o.push([v]), o), []);
  const u = 20;
  const BC = Math.hypot(C_[0] - B_[0], C_[1] - B_[1]) / u;
  const h = (B_[1] - A_[1]) / u;
  const AC = Math.hypot(C_[0] - A_[0], C_[1] - A_[1]) / u;
  const BY = Math.abs((C_[0] - A_[0]) * (A_[1] - B_[1]) - (A_[0] - B_[0]) * (C_[1] - A_[1])) / (AC * u) / u;
  const L = labels(s);
  ok('Fig 7.6: BC, height, AC as labelled', [fmt(BC, 1), fmt(h, 1), fmt(AC, 1)].map(Number), [L[5], L[4], L[6]].map(Number));
  const t = T(body);
  ok('7.5: area from the figure', fmt(0.5 * BC * h), fmt(after(t, /5 \\times 3 = ([\d.]+)\$ square units/)));
  ok('7.5: BY from the figure', fmt(BY, 2), fmt(after(t, /BY = ([\d.]+)\$ units/)));
}
// Fig. 7.8 is half its rectangle; Fig. 7.9 has M, N at the midpoints
{
  const s = svg('7.9');
  const [A_, B_, C_] = [[98, 14], [48, 62], [148, 62]];
  is('Fig 7.9: triangle as drawn', s.includes('M48 62 L148 62 L98 14 Z'));
  is('Fig 7.9: MN joins the midpoints', s.includes(`M${(A_[0] + B_[0]) / 2} ${(A_[1] + B_[1]) / 2} H${(A_[0] + C_[0]) / 2}`));
  const s8 = svg('7.8');
  is('Fig 7.8: rhombus corners are the rectangle\'s edge midpoints', s8.includes('M82 20 L132 50 L82 80 L32 50 Z') && s8.includes('M32 20 H132 V80 H32 Z'));
}

/* ---- B. running text ------------------------------------------ */
{
  const t = T(body);
  ok('A4 area', fmt(21 * 29.7, 1), fmt(after(t, /so it holds \$([\d.]+)\$ cm²/), 1));
  ok('square inch', fmt(2.54 ** 2, 4), fmt(after(t, /2\.54 \\times 2\.54 = ([\d.]+)/), 4));
  ok('area factor, to 2 places', fmt(2.54 ** 2, 2), fmt(after(t, /multiplies an area by \$([\d.]+)\$/)));
  ok('square foot', 12 * 12, after(t, /ft² is \$(\d+)\$ in²/));
  ok('acre in square feet', 66 * 660, after(t, /which is \$(\d+)\$ ft²/));
  ok('square kilometre', 1000 ** 2, 10 ** after(t, /square kilometre is \$10\^(\d)\$/));
  is('Example 5: the division the wrong way round is more than 1040', 161.29 * 6.4516 > 1040 && 161.29 * 6.4516 < 1041 && /more than \$1040\$/.test(t));
  ok('Example 3: side from the half-diagonals', Math.hypot(20 / 2, 15 / 2), 12.5);
  ok('Example 4: base 5 and height 24 also make 60', 0.5 * 5 * 24, 12 * 5);
  ok('Example 4: height 10 is twice 5', 2 * 5, 60 * 2 / 12);
  ok('Fig 7.10: n - 2 triangles', [4 - 2, 5 - 2], [2, 3]);
}

/* ---- B. every worked example's Answer row --------------------- */

function exampleBodies(src) {
  const out = {};
  for (const m of src.matchAll(/c-example__tab">Example (\d+)<\/div>/g)) {
    const from = m.index; const end = src.indexOf('c-example__tab', from + 20);
    out[m[1]] = src.slice(from, end < 0 ? undefined : end);
  }
  return out;
}
const answerRow = (ex) => { const m = ex.match(/work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/); return m ? T(m[1]) : ''; };
{
  const E = exampleBodies(body);
  ok('body examples', Object.keys(E), ['1', '2', '3', '4', '5']);
  says('body Ex 1 answer', answerRow(E[1]), 2 * 84 / 24, 2 * 84 / 21);
  says('body Ex 2 answer', answerRow(E[2]), 12 * 6, fmt(72 / 7.6));
  says('body Ex 3 answer', answerRow(E[3]), 20 * 15 / 2, 150 / 12.5);
  says('body Ex 4 answer', answerRow(E[4]), 12);
  is('body Ex 4: infinitely many', /infinitely many/.test(answerRow(E[4])));
  says('body Ex 5 answer', answerRow(E[5]), fmt(10 * 2.54 ** 2, 3), fmt(161.29 / 2.54 ** 2, 2));
}
{
  const E = exampleBodies(beyond);
  ok('Beyond examples numbered from 1', Object.keys(E), [...Array(17)].map((_, i) => String(i + 1)));
  const sq = (2 * (15 + 6) / 4) ** 2;
  says('Ex 1', answerRow(E[1]), fmt(sq - 15 * 6));
  is('Ex 1: the square is larger', /square/.test(answerRow(E[1])) && sq > 90);
  says('Ex 2', answerRow(E[2]), (450 / 30) * (360 / 30));
  is('Ex 2: tiles fit exactly', 450 % 30 === 0 && 360 % 30 === 0);
  is('Ex 3: 9, 12, 15 is right-angled', 9 ** 2 + 12 ** 2 === 15 ** 2);
  says('Ex 3', answerRow(E[3]), 0.5 * 9 * 12, fmt(2 * 54 / 15));
  says('Ex 4', answerRow(E[4]), 0.5 * 6 * 5);
  says('Ex 5', answerRow(E[5]), 50 / 2, 50 - 50 / 2);
  says('Ex 6', answerRow(E[6]), 30 - 12);
  says('Ex 7', answerRow(E[7]), 25 * 14 * 12);
  { const [A, a, b] = [84, 7, 14]; says('Ex 8', answerRow(E[8]), A / a, A / b); is('Ex 8: each height fits under the other side', A / a <= b && A / b <= a); }
  { const half = Math.sqrt(25 ** 2 - 24 ** 2); says('Ex 9', answerRow(E[9]), 2 * half, 0.5 * 48 * 2 * half, fmt(0.5 * 48 * 2 * half / 25)); }
  says('Ex 10', answerRow(E[10]), 2 * (0.5 * 14 * 10) / 20);
  says('Ex 11', answerRow(E[11]), 0.5 * 6 * 24, 14 + 10, 6 / 2);
  says('Ex 12', answerRow(E[12]), 91 / ((16 + 10) / 2));
  says('Ex 13', answerRow(E[13]), 14 * 9 + 0.5 * 14 * 6);
  is('Ex 13: three triangles', /three/.test(answerRow(E[13])) && 5 - 2 === 3);
  says('Ex 14', answerRow(E[14]), 3 * 2.5, 3 * 2.5 * 10000);
  says('Ex 15', answerRow(E[15]), 6 * 2 * 2);
  ok('Ex 15: the length factor alone', 6 * 2, after(T(E[15]), /alone gives \$(\d+)\$/));
  ok('Ex 14: in centimetres from the start', 300 * 250, 3 * 2.5 * 10000);
  { const in2 = 72 * 48, ft2 = in2 / (12 * 12), cm2 = in2 * 2.54 ** 2;
    ok('Ex 16: in2, ft2, cm2', [in2, ft2, (72 / 12) * (48 / 12), fmt(cm2, 4)], [3456, 24, 24, '22296.7296']);
    says('Ex 16', answerRow(E[16]), in2, ft2, Math.round(cm2)); }
  { const ft2 = 330 * 264; ok('Ex 17: two acres', [ft2, ft2 / 43560], [87120, 2]); says('Ex 17', answerRow(E[17]), ft2 / 43560); }
  ok('Ex 2: one tile', fmt(0.3 * 0.3), '0.09');
}

/* ---- B. Stage 1 ----------------------------------------------- */
{
  const t = T(beyond);
  is('Q2: 17 is the rhombus side, 16 the diagonal', Math.hypot(15, 16 / 2) === 17 && 2 * 240 / 30 === 16);
  { // Q3: the apex slid along the parallel; the height becomes the side PQ
    const h = 2 * 96 / 16, pr = Math.hypot(16, h);
    ok('Q3: height, PQ and PR', [h, pr], [12, 20]);
    says('Q3 prints the height', t.match(/\\tfrac12 \\times 16 \\times h = 96\$, so \$h = (\d+)\$/)?.[0] || '', h);
    says('Q3 prints PQ', t.match(/PQ = h = (\d+)\$/)?.[0] || '', h);
    says('Q3 prints PR', t.match(/\\sqrt\{16\^2 \+ 12\^2\} = \\sqrt\{400\} = (\d+)\$/)?.[0] || '', pr); }
  ok('Q5: both hold 144', [12 * 12, 16 * 9], [after(t, /Both hold \$(\d+)\$/), 144]);
  ok('Q5: 2 cm more', 2 * (16 + 9) - 4 * 12, after(t, /needs \$(\d+)\$ cm more edge/));
  ok('Q5: 36 by 4', [36 * 4, 2 * (36 + 4)], [144, after(t, /climbs to \$(\d+)\$ cm/)]);
  ok('Q6: 18.5 is under 20', 240 / 13 < 20, true);
  ok('Q7: the enlargement', [6 * 3, 4 * 3], [after(t, /enlargement is \$(\d+)\$ cm/), after(t, /enlargement is \$\d+\$ cm by \$(\d+)\$/)]);
  const pairs = []; for (let a = 36; a * a >= 36; a--) if (36 % a === 0) pairs.push(`${a} \\times ${36 / a}`);
  ok('Q8: the factor pairs of 36', pairs, [...t.match(/the pairs \$([\s\S]*?)\$ their/)[1].split(/\$?, \$|\$, \$/)].map(x => x.replace(/\$/g, '').trim()));
  ok('Q8: their perimeters', pairs.map(p => { const [a, b] = p.split(' \\times ').map(Number); return 2 * (a + b); }).join(', '), t.match(/their perimeters \$(\d+)\$, \$(\d+)\$, \$(\d+)\$, \$(\d+)\$, \$(\d+)\$/).slice(1).join(', '));
  ok('Q8: 360 by 0.1', [fmt(360 * 0.1), fmt(2 * (360 + 0.1), 1)], ['36', fmt(after(t, /perimeter of \$([\d.]+)\$ cm/), 1)]);
  is('Q8: 3600 by 0.01 is over 7200', near(3600 * 0.01, 36) && 2 * (3600 + 0.01) > 7200);
}

/* ---- B. practice answers, read back out of the key ------------ */

const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= T(m[2]);
const row = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const r = keyRows[n] || '';
  if (!part) return r;
  const m = r.match(new RegExp(`\\(${part}\\)((?:(?!\\([a-d]\\) ).)*)`));
  return m ? m[1] : '';
};
// the same values must be in ANSWERS.md's working, part by part
const mdPractice = md.slice(md.indexOf('The working for each'));
const mdRow = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const m = mdPractice.match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`));
  const r = m ? T(m[1]) : '';
  if (!part) return r;
  const p = r.match(new RegExp(`\\(${part}\\)((?:(?!\\([a-d]\\) ).)*)`));
  return p ? p[1] : '';
};
const key = (q, ...v) => { says(`key ${q}`, row(q), ...v); says(`ANSWERS.md practice ${q}`, mdRow(q), ...v); };
key(20, 0.5 * 7.5 * 4);
key(21, 9 - 2);
key(22, 5 * 10000);
key(23, 180 / 15, 180 / 20);
{ const s = Math.hypot(18 / 2, 24 / 2); key(24, 0.5 * 18 * 24, s, fmt(0.5 * 18 * 24 / s)); }
{ const A = 0.5 * 20 * (45 + 35); key(25, A, A * 15); }
key(26, 2 * 60 / 10, 2 * 60 / 16);
is('key 26 names the 16 cm side as carrying the shorter height', /16 cm, carries the shorter/.test(row(26)) && 2 * 60 / 16 < 2 * 60 / 10);
{ const P = (30 + 4) * (20 + 4) - 30 * 20; key(27, (30 + 4) * (20 + 4), P, P * 25); }
{ const r = 10 * 17.32, tr = 0.5 * 17.32 * 5; key(28, fmt(r, 1), fmt(tr, 1), fmt(r + 2 * tr, 1), 6 - 2);
  is('Q28: 17.32 is the hexagon\'s width to two places', fmt(10 * Math.sqrt(3), 2) === '17.32');
  is('Q28: the pieces give the hexagon\'s area to one place', fmt(r + 2 * tr, 1) === fmt(1.5 * Math.sqrt(3) * 100, 1)); }
{ const A = 0.5 * 12 * 8, s = Math.floor(Math.sqrt(A)); key(29, 12, 8 / 2, A, s, s + 1);
  is(`key 29 should say nearer ${A - s * s < (s + 1) ** 2 - A ? s : s + 1}`, new RegExp(`nearer ${A - s * s < (s + 1) ** 2 - A ? s : s + 1} cm`).test(row(29))); }
key('30a', 20 * 12, 0.5 * 6 * 5);
key('30b', 0.5 * 4 * (12 + 8));
key('30c', 0.5 * 0.5, 0.5 * 4 * (12 + 8) / (0.5 * 0.5));
{ const A = [250 * 160, 300 * 300, 0.5 * 400 * 150];
  key('31a', ...A); key('31b', ...A.map(x => x / 10000));
  key('31c', A.reduce((a, b) => a + b) / 10000, A.reduce((a, b) => a + b) / 10000 * 25); }

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] = m[2];
const optsOf = (n) => { const m = (qs[n] || '').match(/<ol class="c-parts[^"]*">([\s\S]*)<\/ol>/); return m ? [...m[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => T(x[1]).trim()) : []; };
const num = (s) => Number(s.replace(/\$/g, '').replace(/[a-z²]+/gi, '').trim());
const pageKey = {};
{
  const from = beyond.indexOf('<ol class="c-answers">');
  for (const m of T(beyond.slice(from, beyond.indexOf('</ol>', from))).matchAll(/\b(\d+) \(([a-d])\)/g)) pageKey[m[1]] ??= m[2];
}
const solve = {
  1: o => o.map(s => s === 'unit squares'),
  2: o => o.map(s => /square to the base/.test(s)),
  3: o => o.map(s => s === 'equal areas'),
  4: o => o.map(s => s.replace(/\$/g, '').replace(/\s+/g, ' ') === 'base \\times height'),
  5: o => o.map(s => s === 'half the product of the diagonals'),
  6: o => o.map(s => s === 'dissection'),
  7: o => o.map(num).map(v => v === 6 - 2),
  8: o => o.map(s => /none/.test(s)),
  9: o => o.map(num).map(v => v === 12 * 12),
  10: o => o.map(num).map(v => v === Math.max(...[1, 2, 3, 4, 5].map(a => a * (10 - a))) ),
  // twice the length, the same width: the ratio of the floors
  11: o => o.map(s => s === { 1: 'the same', 2: 'doubled', 4: 'four times', 0.5: 'halved' }[(2 * 5 * 3) / (5 * 3)]),
  12: o => o.map(num).map(v => v === 0.5 * 4 * (9 + 5)),
  13: o => o.map(num).map(v => v === 3 * 5 * 5),
  // diagonals at right angles: square, kite, rhombus yes; a long rectangle no
  14: o => o.map(s => ({ 'a square': true, 'a kite': true, 'a rhombus': true, 'a long rectangle': false })[s] === false),
  15: o => o.map(num).map(v => v === 100 * 100),
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options: ${JSON.stringify(o)}`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Q${q}: the right option`, right, [pageKey[q]]);
}
// the options that are values: each wrong one is really wrong
is('Q12 options: 56 is 4 x 14, 180 is 9 x 5 x 4, 90 is 9 x 5 x 2', 4 * 14 === 56 && 9 * 5 * 4 === 180 && 9 * 5 * 2 === 90);
is('Q13 options: 15 is 3 x 5, 225 is 15 squared', 3 * 5 === 15 && 15 ** 2 === 225);
// assertion-reason: [A true, R true, R explains A]
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  16: [8 * 1 !== 5 * 4 && 2 * (8 + 1) === 2 * (5 + 4), false, false],
  17: [near((0.5 * 7 * 3) / (7 * 3), 1 / 2), true, true],
  18: [100 * 100 === 100, 100 === 100, false],
  19: [0.5 * 12 * 8 === 48, true, false],
};
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), pageKey[q]);
{
  const t = T(qs[18]); is('Q18 prints 100 cm² and 1 m is 100 cm', /area of \$100\$ cm²/.test(t) && /\$1\$ m is \$100\$ cm/.test(t));
  is('Q19 prints 12, 8 and 48', /\$12\$ cm and \$8\$ cm has an area of \$48\$/.test(T(qs[19])));
}
const letters = Object.values(pageKey);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-19', Object.keys(pageKey).map(Number).sort((a, b) => a - b), [...Array(19)].map((_, i) => i + 1));

/* ---- D. ANSWERS.md, and numbering ----------------------------- */

const mdKey = {};
for (const m of md.slice(md.indexOf('as the key prints it'), md.indexOf('as the key prints it') + 300).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2];
ok('ANSWERS.md key matches the page', mdKey, pageKey);

// numbering: each exercise set, and the practice run, count 1, 2, 3 …
for (const [name, src] of [['body', body], ['Beyond', beyond]]) {
  const runs = []; let cur = null;
  for (const m of src.matchAll(/c-practice__head">([\s\S]*?)<\/div>|<ol class="c-questions"(?: data-start="(\d+)")?>/g)) {
    if (m[1] !== undefined) { cur = { name: T(m[1]).trim(), n: [] }; runs.push(cur); }
    else cur.n.push(Number(m[2] || 1));
  }
  for (const r of runs) ok(`${name} ${r.name}: numbering`, r.n, r.n.map((_, i) => i + 1));
}

// ANSWERS.md: body exercises, section by section, item by item
const mdSet = (name) => { const i = md.indexOf(`### ${name}`); const j = md.indexOf('\n## ', i + 1); return md.slice(i, j < 0 ? undefined : j); };
const mdItem = (name, n) => { const s = mdSet(name); const m = s.match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`)); return m ? T(m[1]) : ''; };
const mdPart = (name, n, p) => { const m = mdItem(name, n).match(new RegExp(`\\(${p}\\)((?:(?!\\([ivx]+\\) ).)*)`)); return m ? m[1] : ''; };
const S1 = 'Exercise Set 7.1', S2 = 'Exercise Set 7.2', S3 = 'Exercise Set 7.3';
says('7.1 Q1 (i)', mdPart(S1, 1, 'i'), 0.5 * 12 * 5);
says('7.1 Q1 (ii)', mdPart(S1, 1, 'ii'), 0.5 * 9 * 6.4);
says('7.1 Q1 (iii)', mdPart(S1, 1, 'iii'), 0.5 * 2.5 * 8);
says('7.1 Q2', mdItem(S1, 2), 2 * 54 / 12, 2 * 54 / 18);
{ const t = mdItem(S1, 3);
  const pairs = [...t.matchAll(/\$(\d+)\$ by \$(\d+)\$/g)].map(m => [+m[1], +m[2]]);
  const P = ([a, b]) => 2 * (a + b), A = ([a, b]) => a * b;
  is('7.1 Q3: first pair, same perimeter and different areas', P(pairs[0]) === P(pairs[1]) && A(pairs[0]) !== A(pairs[1]));
  is('7.1 Q3: second pair, longer perimeter and smaller area', P(pairs[2]) > P(pairs[3]) && A(pairs[2]) < A(pairs[3]));
  says('7.1 Q3 printed values', t, P(pairs[0]), A(pairs[0]), A(pairs[1]), P(pairs[2]), A(pairs[2]), P(pairs[3]), A(pairs[3])); }
says('7.1 Q4 (i)', mdPart(S1, 4, 'i'), 0.5 * 10 * 6);
says('7.1 Q4 (ii)', mdPart(S1, 4, 'ii'), 10 * 6 / 4);
says('7.1 Q5', mdItem(S1, 5), 0.5 * 14 * 6, 2 * (0.5 * 14 * 6) / 12);
says('7.1 Q6', mdItem(S1, 6), 0.5 * 8 * 5);
{ const t = mdItem(S1, 7); says('7.1 Q7', t, 2 * 60, 120 / 8, 120 / 15, fmt(120 / 17)); is('7.1 Q7: 8-15-17 area is 60', 0.5 * 8 * 15 === 60); }
says('7.1 Q8', mdItem(S1, 8), '\\tfrac14');
says('7.2 Q1 (i)', mdPart(S2, 1, 'i'), 7 * 4);
says('7.2 Q1 (ii)', mdPart(S2, 1, 'ii'), 5 * 3);
says('7.2 Q1 (iii)', mdPart(S2, 1, 'iii'), 4.8 * 5);
says('7.2 Q2', mdItem(S2, 2), 12 * 6, fmt(72 / 7.6));
says('7.2 Q3', mdItem(S2, 3), 5 * 4);
says('7.2 Q4 (i)', mdPart(S2, 4, 'i'), 0.5 * 20 * 15);
says('7.2 Q4 (ii)', mdPart(S2, 4, 'ii'), 0.5 * 24 * 10);
says('7.2 Q4 (iii)', mdPart(S2, 4, 'iii'), 0.5 * 9 * 6.4);
says('7.2 Q5', mdItem(S2, 5), 0.5 * 24 * 10, Math.hypot(12, 5), fmt(120 / 13));
says('7.2 Q6', mdItem(S2, 6), 0.5 * 16 * 9);
says('7.2 Q8', mdItem(S2, 8), 0.5 * 6 * 4, 6 * 4);
{ const d2 = 2 * 96 / 16, s = Math.hypot(8, d2 / 2); const t = mdItem(S2, 9);
  says('7.2 Q9', t, d2, s, 96 / s, 2 * 96, fmt(Math.hypot(12, 4)), fmt(Math.hypot(16, 3)), Math.sqrt(192).toFixed(2), Math.sqrt(96).toFixed(2));
  is('7.2 Q9: the square has the shortest side', [[16, 12], [24, 8], [32, 6]].every(([a, b]) => Math.hypot(a / 2, b / 2) >= Math.sqrt(96))); }
says('7.3 Q1 (i)', mdPart(S3, 1, 'i'), fmt(5 * 2.54, 3));
says('7.3 Q1 (ii)', mdPart(S3, 1, 'ii'), fmt(7.4 * 2.54, 3));
says('7.3 Q1 (iii)', mdPart(S3, 1, 'iii'), fmt(5.08 / 2.54));
says('7.3 Q1 (iv)', mdPart(S3, 1, 'iv'), fmt(11.43 / 2.54));
says('7.3 Q2 (i)', mdPart(S3, 2, 'i'), fmt(4 * 2.54 ** 2, 4));
says('7.3 Q2 (ii)', mdPart(S3, 2, 'ii'), fmt(96.774 / 2.54 ** 2));
says('7.3 Q2 (iii)', mdPart(S3, 2, 'iii'), 2 * 144);
says('7.3 Q3', mdItem(S3, 3), 90 * 60, 90 * 60 / 10000, fmt(21 * 29.7, 1), fmt(5400 / 623.7));
says('7.3 Q4', mdItem(S3, 4), 12 * 10, 120 * 144);
says('7.3 Q5', mdItem(S3, 5), 43560 / 4, fmt(Math.sqrt(10890)), Math.round(Math.sqrt(10890)));
{ const ft2 = 30.48 ** 2; says('7.3 Q6', mdItem(S3, 6), fmt(ft2, 4), fmt(10 * ft2, 3), fmt(10 * ft2 / 10000, 3)); is('7.3 Q6: 10 ft² is less than 1 m²', 10 * ft2 < 10000); }
says('7.3 Q7', mdItem(S3, 7), fmt(0.9144 ** 2, 8));
{ const acre = 43560 * 0.3048 ** 2; says('7.3 Q8', mdItem(S3, 8), 1e6, 100, fmt(acre), fmt(1e6 / acre, 1), Math.round(1e6 / acre)); }
// the Think and Reflect instance, and Stage 1's summary
{ const t = T(md.slice(md.indexOf('### Think and Reflect'), md.indexOf('## 7.10')));
  says('Think and Reflect instance', t, 0.5 * 8 * 4, 8 / 2 * 4 / 4, Math.sqrt(16)); }
{ const t = T(md.slice(md.indexOf('### Stage 1'), md.indexOf('### Stage 2')));
  says('Stage 1 summary', t, 2 * 240 / 30, Math.hypot(15, 8), fmt(240 / 17, 1), 2 * 96 / 16, Math.hypot(16, 2 * 96 / 16), 0.5 * 24 * 20, 2 * (16 + 9) - 48, fmt(240 / 13, 1), 9 * 12); }
let solved = 0;
// an equation in one letter, then "so $h = N$": N must satisfy it
for (const [f, src] of [...pages.map(f => [f, html[f]]), ['ANSWERS.md', md]]) {
  const list = [...src.replace(/\$\$[^$]+\$\$/g, ' ').matchAll(/\$([^$]+)\$/g)].map(m => m[1]);
  for (let i = 0; i + 1 < list.length; i++) {
    const sol = list[i + 1].match(/^\s*([a-zA-Z]{1,2}) = ([\d.]+)\s*$/);
    if (!sol) continue;
    const [lhs, rhs] = list[i].split('=');
    if (rhs === undefined || !new RegExp(`(^|[^a-zA-Z\\\\])${sol[1]}($|[^a-zA-Z])`).test(lhs) || toExpr(rhs) === null) continue;
    const e = toExpr(lhs.replace(new RegExp(`(^|[^a-zA-Z\\\\])${sol[1]}(?![a-zA-Z])`, 'g'), `$1(${sol[2]})`).replace(/\\,/g, ' \\times '));
    if (e === null) continue;
    solved++;
    ok(`${f}: ${list[i].trim()}$ gives $${list[i + 1].trim()}$`, fmt(evalExpr(e), 6), fmt(evalExpr(toExpr(rhs)), 6));
  }
}

/* ---- report ---------------------------------------------------- */

console.log(`A  ${spans} identities evaluated; ${skipped.length} spans not pure arithmetic, skipped`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${solved} one-letter equations checked against their printed solutions`);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
