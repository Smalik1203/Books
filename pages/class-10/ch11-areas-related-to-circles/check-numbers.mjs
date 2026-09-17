#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed — sector and segment areas, arcs, perimeters, costs — and
   compared with what is on the page.

     node pages/class-10/ch11-areas-related-to-circles/check-numbers.mjs [--skipped]

   Four parts:
     A  every identity set as maths, on every page and in ANSWERS.md, whose
        sides all evaluate. The chapter takes pi as 22/7 or 3.14 and root 3
        as 1.73 or 1.7, whichever its question names, so an identity passes
        if it holds for one of those values (or the exact one). A side that
        is a bare decimal is allowed its own rounding and no more: 4.19
        stands for anything in [4.185, 4.195].
     B  the claims A cannot check: each example's answer and each exercise
        answer, computed and then looked for in the printed row, a lettered
        part at a time, and a phrase where a number sits beside others
     C  every multiple-choice and assertion-reason question: exactly one
        option is right, and it is the one the key (or the example) prints
     D  ANSWERS.md prints the same key as the page, and its working rows say
        what the page's say

   Exits non-zero if anything does not hold up. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
let pass = 0;
const fails = [];
const is = (what, cond) => { if (cond) pass++; else fails.push(what); };
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol;

/* ---- the mathematics ----------------------------------------- */

const PIS = [22 / 7, 3.14, Math.PI];
const R3S = [1.73, 1.7, Math.sqrt(3)];
const sector = (r, deg, pi) => deg / 360 * pi * r * r;
const arc = (r, deg, pi) => deg / 360 * 2 * pi * r;
const tri = (r, deg) => {                       // the triangle a chord cuts off, as the chapter finds it
  if (deg === 90) return r * r / 2;
  if (deg === 60) return null;                  // equilateral: needs root 3
  return null;
};
const eqTri = (a, r3) => r3 / 4 * a * a;        // equilateral triangle of side a
const tri120 = (r, r3) => 0.5 * (r * r3) * (r / 2);   // chord r*root3, height r/2
const r2 = (v) => Math.round(v * 100) / 100;
// Practice Q12: a 10 cm chord in a radius-10 circle; its angle comes from the chord, not from the page
const Q12deg = Math.round(2 * Math.asin(10 / 2 / 10) * 180 / Math.PI);
const Q12seg = 10 * 10 * (Q12deg / 360 * 3.14) - 1.73 / 4 * 100;

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8').replace(/\r/g, '');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<span class="nb">([\s\S]*?)<\/span>/g, '$1')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/&middot;/g, '·')
  .replace(/\$/g, '').replace(/\s+/g, ' ');

/* ---- A. every identity ---------------------------------------- */

function toExpr(side) {
  let s = side
    .replace(/\\left|\\right/g, '')
    .replace(/\^\\circ/g, '')
    .replace(/\\sqrt\{3\}/g, 'S')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'Math.sqrt[$1]')                  // before \frac, so its braces do not nest
    .replace(/\\pi/g, 'P')
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/Math\.sqrt\[([^\]]+)\]/g, 'Math.sqrt($1)')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad/g, '')
    .replace(/\^\{([^{}]+)\}/g, '**($1)').replace(/\^(\d)/g, '**$1')
    .replace(/^\{|\}$/g, '')
    .replace(/\s+/g, '');
  if (!s || !/^(Math\.sqrt|[PS]|[-+*/().0-9])+$/.test(s)) return null;
  return s
    .replace(/\)\(/g, ')*(')
    .replace(/([0-9)PS])(?=Math\.sqrt|[PS(])/g, '$1*')                // 2\pi, 21\sqrt{3}, 4(88 - ...) are products
    .replace(/([PS)])(?=[0-9])/g, '$1*');
}
const evalExpr = (e, P, S) => { try { return Function('P', 'S', `"use strict";return (${e})`)(P, S); } catch { return NaN; } };
// a side that is a bare decimal stands for its rounding interval
const slack = (raw) => { const m = raw.replace(/^\{|\}$/g, '').trim().match(/^-?\d+\.(\d+)$/); return m ? 0.5 * 10 ** -m[1].length + 1e-9 : 1e-9; };

function splitParts(span) {
  const out = []; let depth = 0, cur = '';
  for (let i = 0; i < span.length; i++) {
    const ch = span[i];
    if ('({'.includes(ch)) depth++;
    if (')}'.includes(ch)) depth--;
    if (depth === 0 && ch === ',' && /=/.test(cur) && /=/.test(span.slice(i + 1))) { out.push(cur); cur = ''; continue; }
    if (depth === 0 && span.startsWith('\\qquad', i)) { out.push(cur); cur = ''; i += 5; continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
}

// an identity in r (or R) and theta (or p), every side carrying a letter, is checked at two sample points
function toAlg(side) {
  const s = side.replace(/\\theta/g, 'T').replace(/(?<![a-zA-Z\\])[rR](?![a-zA-Z])/g, 'Q').replace(/(?<![a-zA-Z\\])p(?![a-zA-Z])/g, 'T');
  if (!/[QT]/.test(s)) return null;
  let e = s
    .replace(/\\left|\\right/g, '').replace(/\\sqrt\{3\}/g, 'S').replace(/\\pi/g, 'P')
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\times/g, '*').replace(/\^(\d)/g, '**$1').replace(/\s+/g, '');
  if (!/^[PSQT\-+*/().0-9]+$/.test(e)) return null;
  return e.replace(/\)\(/g, ')*(').replace(/([0-9)PSQT])(?=[PSQT(])/g, '$1*').replace(/(\*\*\d)(?=[PSQT(])/g, '$1*');
}
let algebra = 0;
for (const [f, raw] of [...pages.map(f => [f, html[f]]), ['ANSWERS.md', answersMd]]) {
  for (const m of raw.replace(/\$\$/g, '$').matchAll(/\$([^$]+)\$/g)) {
    const sides = m[1].replace(/^\{(.*)\}$/, '$1').split('=').map(s => s.trim()).filter(Boolean);
    if (sides.length < 2) continue;
    const ex = sides.map(toAlg);
    if (ex.some(x => !x)) continue;
    const ok = [[5.3, 47], [2, 150]].every(([Q, T]) => {
      const v = ex.map(x => Function('P', 'S', 'Q', 'T', `"use strict";return (${x})`)(Math.PI, Math.sqrt(3), Q, T));
      return v.every(n => Number.isFinite(n) && near(n, v[0], 1e-9 * Math.max(1, Math.abs(v[0]))));
    });
    algebra++;
    is(`${f}: algebra $${m[1]}$`, ok);
  }
}

// a row of working often continues one equation across spans: "$= a$ cm² $= b$". Join such runs into one chain.
const chains = [];
for (const f of pages) {
  for (const r of html[f].matchAll(/<div class="work__row">([\s\S]*?)<\/div>|<p>([\s\S]*?)<\/p>/g)) {
    const ss = [...(r[1] || r[2]).replace(/<span class="work__why">[\s\S]*?<\/span>/g, '').matchAll(/\$([^$]+)\$/g)].map(x => x[1].trim());
    let cur = [];
    const flush = () => { if (cur.length > 1) chains.push(cur.join(' ')); cur = []; };
    for (const s of ss) { if (/^=/.test(s) && cur.length) cur.push(s); else { flush(); cur = [s]; } }
    flush();
  }
}

let spans = 0; const skipped = [];
const sources = [...pages.map(f => [f, html[f]]), ['ANSWERS.md', answersMd], ['chained rows', chains.map(c => `$${c}$`).join(' ')]];
for (const [f, raw] of sources) {
  const src = raw.replace(/\$\$/g, '$');
  for (const m of src.matchAll(/\$([^$]+)\$/g)) {
    const span = m[1];
    if (!span.includes('=') || /\\neq|\\leq|\\lt|<|>|\\approx|\\phantom/.test(span)) continue;
    if (/^\s*\{?\s*(\\pi|\\sqrt\{3\})\s*=/.test(span)) continue;            // "use pi = 22/7" is a declaration
    for (const part of splitParts(span.replace(/^\{(.*)\}$/, '$1'))) {
      const rawSides = part.split('=').map(s => s.trim()).filter(Boolean);
      if (rawSides.length < 2) continue;
      let pairs = rawSides.map(s => [s, toExpr(s)]);
      if (pairs.filter(p => p[1]).length >= 2) pairs = pairs.filter(p => p[1]);
      if (pairs.some(p => !p[1]) || pairs.length < 2) { skipped.push(`${f}: $${part.trim()}$`); continue; }
      let finite = false, holds = false, shown = '';
      for (const P of PIS) for (const S of R3S) {
        const nums = pairs.map(p => evalExpr(p[1], P, S));
        if (nums.some(n => !Number.isFinite(n))) continue;
        finite = true;
        shown = nums.join(' and ');
        if (nums.every((n, i) => near(n, nums[0], slack(pairs[0][0]) + slack(pairs[i][0])))) holds = true;
      }
      if (!finite) { skipped.push(`${f}: $${part.trim()}$`); continue; }
      spans++;
      if (holds) pass++; else fails.push(`${f}: $${part.trim()}$ — sides are ${shown}`);
    }
  }
}

/* ---- B. the answers, computed and looked for ------------------ */

// a printed row "says" a value when the number stands on its own there
const show = (v) => (typeof v === 'number' ? String(parseFloat(v.toFixed(6))) : String(v));
const has = (row, v) => new RegExp(`(^|[^\\d.])${show(v).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}([^\\d]|$)`).test(row);
const part = (row, p) => { const m = row.match(new RegExp(`\\(${p}\\)(.*?)(?=\\([a-d]\\) |$)`)); return m ? m[1] : ''; };

// examples, by tab: the Answer row, and the whole panel
function example(src, n) {
  const i = src.indexOf(`<div class="c-example__tab">Example ${n}</div>`);
  if (i < 0) return { panel: '', answer: '', opts: [] };
  const j = src.indexOf('<div class="c-example__tab">', i + 10);
  const panel = src.slice(i, j < 0 ? undefined : j);
  const a = panel.match(/<span class="work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/);
  const ol = panel.match(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*?)<\/ol>/);
  const opts = ol ? [...ol[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => text(x[1]).trim()) : [];
  return { panel: text(panel), answer: a ? text(a[1]).trim() : '', opts };
}
const saysEx = (src, n, ...vals) => { const e = example(src, n); for (const v of vals) is(`${src === body ? 'body' : 'Beyond'} Example ${n} answer should say ${v}: "${e.answer}"`, has(e.answer, v)); };
const letter = (bools) => bools.map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
const optNum = (s) => Number(s.replace(/\s*(cm|m)(\s*2)?\s*$/, '').replace(/\^\\circ/g, '').trim());

// the body's two examples
{
  const pi = 3.14, s = sector(4, 30, pi);
  is('body Ex 1: 12.56/3 is the sector', near(12.56 / 3, s));
  saysEx(body, 1, r2(s).toFixed(2), r2(pi * 16 - r2(s)).toFixed(2), (Math.round((pi * 16 - s) * 10) / 10).toFixed(1));
  is('body Ex 1: both ways to the major sector agree to 2 places', r2(pi * 16 - r2(s)) === r2(sector(4, 330, pi)));
  const e2 = sector(21, 120, 22 / 7);
  is('body Ex 2: sector 462', near(e2, 462) && has(example(body, 2).panel, 462));
  is('body Ex 2: OM = 21/2 and AB = 21 root 3 (cos and sin 60)', near(21 * Math.cos(Math.PI / 3), 21 / 2) && near(2 * 21 * Math.sin(Math.PI / 3), 21 * Math.sqrt(3)));
  is('body Ex 2: 462 - 441 root3/4 = 21/4 (88 - 21 root3)', near(462 - 441 * Math.sqrt(3) / 4, 21 / 4 * (88 - 21 * Math.sqrt(3))));
  is('body Ex 2: the answer row is 21/4(88 - 21 root3)', /\\dfrac\{21\}\{4\}\(88 - 21\\sqrt\{3\}\)/.test(body.match(/Example 2[\s\S]*?label">Answer<\/span>\s*<span>([\s\S]*?)<\/span>/)[1]));
}

// Exercise Set 11.1, read back off ANSWERS.md, item by item
const exSet = answersMd.slice(answersMd.indexOf('### Exercise Set 11.1'), answersMd.indexOf('## Beyond the Book'));
const exItem = (n) => { const m = exSet.match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |\\n---|$)`)); return m ? m[1].replace(/\$/g, '').replace(/\s+/g, ' ') : ''; };
const exPart = (n, p) => { const m = exItem(n).match(new RegExp(`\\(${p}\\)(.*?)(?=- \\([iv]+\\)|$)`)); return m ? m[1] : ''; };
const exSays = (n, p, ...vals) => { const row = p ? exPart(n, p) : exItem(n); for (const v of vals) is(`Ex 11.1 Q${n}${p ? ` (${p})` : ''} should say ${v}: "${row}"`, has(row, v)); };
{
  const P = 22 / 7;
  is('Ex Q1: 132/7', near(sector(6, 60, P), 132 / 7)); exSays(1, '', '18\\frac{6}{7}');
  const r = 22 / (2 * P); is('Ex Q2: r = 3.5', near(r, 3.5));
  exSays(2, '', 3.5, sector(r, 90, P), '\\frac{77}{8}'); is('Ex Q2: 77/8', near(sector(r, 90, P), 77 / 8));
  is('Ex Q3: 5 minutes is 30 degrees, 154/3', near(sector(14, 5 / 60 * 360, P), 154 / 3)); exSays(3, '', '51\\frac{1}{3}');
  exSays(4, 'i', sector(10, 90, 3.14) - tri(10, 90)); exSays(4, 'ii', sector(10, 270, 3.14));
  exSays(5, 'i', arc(21, 60, P)); exSays(5, 'ii', sector(21, 60, P));
  exSays(5, 'iii', r2(sector(21, 60, P) - eqTri(21, 1.7320508)).toFixed(2));
  { const m = sector(15, 60, 3.14) - eqTri(15, 1.73); exSays(6, '', m, 3.14 * 225 - m); }
  { const m = sector(12, 120, 3.14) - tri120(12, 1.73); is('Ex Q7: triangle 36 root3 = 62.28', near(tri120(12, 1.73), 62.28)); exSays(7, '', r2(m)); }
  exSays(8, 'i', sector(5, 90, 3.14)); exSays(8, 'ii', sector(10, 90, 3.14) - sector(5, 90, 3.14));
  exSays(9, 'i', P * 35 + 5 * 35); exSays(9, 'ii', sector(17.5, 36, P));
  is('Ex Q10: 22275/28', near(sector(45, 45, P), 22275 / 28)); exSays(10, '', r2(sector(45, 45, P)).toFixed(2));
  is('Ex Q11: 158125/126', near(2 * sector(25, 115, P), 158125 / 126)); exSays(11, '', r2(2 * sector(25, 115, P)).toFixed(2));
  exSays(12, '', r2(sector(16.5, 80, 3.14)).toFixed(2));
  { const d = P * 784 - 6 * eqTri(28, 1.7); exSays(13, '', r2(d), r2(d * 0.35).toFixed(2)); is('Ex Q13: cost has its sign', /₹162\.68/.test(exItem(13)) && r2(d * 0.35) === 162.68); }
  { // Q14: only (d) is the area formula, checked at two angles and radii
    const o = [(p, R) => p / 180 * 2 * Math.PI * R, (p, R) => p / 180 * Math.PI * R * R, (p, R) => p / 360 * 2 * Math.PI * R, (p, R) => p / 720 * 2 * Math.PI * R * R];
    const right = letter(o.map(fn => [[40, 3], [150, 7]].every(([p, R]) => near(fn(p, R), sector(R, p, Math.PI)))));
    is(`Ex Q14: the right option is ${right}`, right.join() === 'd' && /\*\*\(d\)\*\*/.test(exItem(14)));
  }
}

// Stage 1, as printed in its running text
{
  const P = 22 / 7, t = text(beyond);
  is('Stage 1 Q1: 77 is an eighth of 616, so 45 degrees and arc 11', near(77 * 8, P * 196) && near(360 / 8, 45) && near(arc(14, 45, P), 11) && near(0.5 * 11 * 14, 77));
  is('Stage 1 Q2: area x2, arc x1', near(sector(2 * 5, 20, P) / sector(5, 40, P), 2) && near(arc(10, 20, P) / arc(5, 40, P), 1));
  is('Stage 1 Q3: 1/11', near((sector(7, 90, P) - 24.5) / (P * 49), 1 / 11) && /= \\frac\{1\}\{11\}\}/.test(beyond));
  is('Stage 1 Q4: ring sector 77', near(sector(14, 60, P) - sector(7, 60, P), 77));
  { // Q5: the 60 and 120 degree triangles are equal, so the larger segment is more than twice the smaller, at any radius
    const ok = [3, 7, 14].every(r => near(eqTri(r, Math.sqrt(3)), tri120(r, Math.sqrt(3)))
      && sector(r, 120, Math.PI) - tri120(r, Math.sqrt(3)) > 2 * (sector(r, 60, Math.PI) - eqTri(r, Math.sqrt(3))));
    is('Stage 1 Q5: equal triangles, more than twice', ok && /The answer is no: the segment for CD is more than twice as large/.test(t));
    // and ANSWERS.md's Stage 1 summary says the same five things
    const s1 = answersMd.slice(answersMd.indexOf('### Stage 1'), answersMd.indexOf('### Stage 3')).replace(/\s+/g, ' ');
    is(`ANSWERS.md Stage 1 summary: "${s1}"`, /\(1\) \$45\^\\circ\$ and 11 cm/.test(s1) && /\(2\) the area doubles and the arc is unchanged/.test(s1)
      && /\(3\) \$\\frac\{1\}\{11\}\$/.test(s1) && /\(4\) 77 cm²/.test(s1) && /\(5\) no .* more than twice the/.test(s1)); }
}

// Beyond's Solved Examples
{
  const P = 22 / 7;
  saysEx(beyond, 1, arc(20, 72, 3.14), sector(20, 72, 3.14));
  saysEx(beyond, 5, 9, 99); is('Beyond Ex 5: r = 9 gives the arc 22', near(arc(9, 140, P), 22));
  saysEx(beyond, 7, sector(21, 90, P) - 220.5, P * 441 - (sector(21, 90, P) - 220.5));
  is('Beyond Ex 7: phrases', /minor segment 126 cm/.test(example(beyond, 7).answer) && /major segment 1260 cm/.test(example(beyond, 7).answer));
  is('Beyond Ex 8: the formula holds at r = 5', near(sector(5, 60, Math.PI) - eqTri(5, Math.sqrt(3)), 25 * (Math.PI / 6 - Math.sqrt(3) / 4)));
  { const b = r2(arc(10.5, 120, P) + 21), a = r2(sector(10.5, 120, P)); const e = example(beyond, 10);
    is(`Beyond Ex 10: fencing ₹${b * 25}, grass ₹${a * 12}: "${e.answer}"`, e.answer.includes(`fencing ₹${b * 25}`) && e.answer.includes(`grass ₹${a * 12}`) && near(b, 43)); }
  { const minor = sector(35, 90, P) - 35 * 35 / 2; const e = example(beyond, 11);
    is(`Beyond Ex 11: trimmed away ${minor}, left ${P * 1225 - minor}: "${e.answer}"`,
      new RegExp(`trimmed away ${minor} cm 2 ?, left ${r2(P * 1225 - minor)} cm`).test(e.answer)); }
  saysEx(beyond, 12, sector(7, 180, P) - 49);
  // the multiple-choice examples: one right option, and it is the one printed
  const mcx = {
    2: o => o.map(optNum).map(v => near(v, arc(7, 90, P) + 14)),
    3: o => o.map(s => s.replace(/\s*cm\s*2$/, '').trim() === `${r2(sector(6, 4 * 30, 1))}\\pi`),   // 4 hours at 30 degrees an hour
    4: o => o.map(optNum).map(v => near(v, 0.5 * 22 * 35) && near(v, 22 / arc(35, 360, P) * P * 1225)),
    6: o => o.map(optNum).map(v => near(v, r2(sector(14, 60, P) - eqTri(14, 1.73)), 0.05)),
    9: o => o.map(optNum).map(v => near(v, 300 - sector(7, 90, P))),
  };
  for (const [n, f] of Object.entries(mcx)) {
    const e = example(beyond, n);
    is(`Beyond Ex ${n} has four options`, e.opts.length === 4);
    const right = letter(f(e.opts));
    is(`Beyond Ex ${n}: right option ${right} against printed "${e.answer}"`, right.length === 1 && e.answer === `(${right[0]})`);
  }
  is('Beyond Ex 6: 17.90 in the working', /= 17\.90/.test(example(beyond, 6).panel) && near(r2(r2(sector(14, 60, P)) - r2(eqTri(14, 1.73))), 17.9));
}

// the practice answers, read back out of the key rows
const keyRows = {};
{
  const a = beyond.indexOf('<div class="c-stage__title">Answers</div>');
  for (const m of beyond.slice(a).matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= text(m[2]);
}
const row = (q) => { const [, n, p] = String(q).match(/^(\d+)([a-d]?)$/); const r = keyRows[n] || ''; return p ? part(r, p) : r; };
const says = (q, ...vals) => { for (const v of vals) is(`key ${q} should say ${v}: "${row(q)}"`, has(row(q), v)); };
const phrase = (q, re) => is(`key ${q} should read ${re}: "${row(q)}"`, re.test(row(q)));
{
  const P = 22 / 7;
  says(20, 360 / 9);
  says(21, '\\frac{5\\pi}{2}'); is('Q21: 36/360 x 25 = 5/2', near(36 / 360 * 25, 5 / 2));
  says(22, '2\\pi'); is('Q22: 40/360 x 18 = 2', near(40 / 360 * 18, 2));
  { const r = Math.sqrt(30.8 / (72 / 360 * P)); is('Q23: r = 7', near(r, 7)); phrase(23, new RegExp(`radius is ${r} cm`)); says(23, arc(r, 72, P)); }
  { const s = r2(sector(14, 120, P)), t = r2(tri120(14, 1.73)); says(24, s, t, r2(s - t).toFixed(2)); is('Q24: 49 root3 is the triangle', near(tri120(14, 1.73), 49 * 1.73)); }
  says(25, arc(42, 60, P), 0.5 * arc(42, 60, P) * 42);
  says(26, 25 / 60 * 360, r2(sector(12, 150, 3.14)));
  says(27, sector(14, 90, P) - 98); is('Q27: formula at r = 14', near(196 / 4 * (P - 2), 56));
  { const a = r2(arc(35, 60, P)), s = sector(35, 60, P), t = eqTri(35, 1.73);
    says(28, a, r2(a + 35), (s - t).toFixed(3), r2(P * 1225 - (s - t)).toFixed(2)); is('Q28: 641.667 and 529.8125', near(s, 641.6667, 0.001) && near(t, 529.8125)); }
  says(29, sector(21, 90, P) - sector(14, 90, P), arc(21, 90, P) + arc(14, 90, P) + 14);
  says('30a', sector(10, 72, 3.14)); says('30b', sector(20, 18, 3.14)); says('30c', arc(6, 150, 3.14));
  says('30d', r2(sector(10, 72, 3.14) + sector(20, 18, 3.14) + sector(6, 150, 3.14)));
  says('31a', '60'); says('31b', sector(10.5, 60, P)); says('31c', arc(10.5, 60, P) + 21); says('31d', 5 * sector(10.5, 60, P));
  // the "why" rows
  says(1, arc(28, 45, P)); says(2, sector(14, 90, P)); says(5, sector(7, 90, P)); says(6, arc(7, 180, P));
  says(9, P * 49 - (sector(7, 90, P) - 24.5)); says(10, sector(28, 90, P)); says(12, Q12deg, r2(sector(10, Q12deg, 3.14)), eqTri(10, 1.73), r2(Q12seg));
  says(18, sector(28, 90, P) - 392); says(19, arc(3.5, 180, P) + 7);
}

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] = m[2];
const optsOf = (n) => { const ol = (qs[n] || '').match(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*?)<\/ol>/); return ol ? [...ol[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => text(x[1]).trim()) : []; };
const key = {};
{
  const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2];
}
const P7 = 22 / 7;
const solve = {
  1: o => o.map(optNum).map(v => near(v, arc(28, 45, P7))),
  2: o => o.map(optNum).map(v => near(v, sector(14, 90, P7))),
  3: o => o.map(optNum).map(v => near(v, 360 - 100)),
  4: o => o.map(s => s === 'a segment'),
  5: o => o.map(optNum).map(v => near(v, sector(7, 15 / 60 * 360, P7))),
  6: o => o.map(optNum).map(v => near(v, arc(7, 180, P7) + 14)),
  7: o => o.map(optNum).map(v => near(v, 360 / 6)),
  8: o => o.map(optNum).map(v => near(v, arc(42, 360 / 8, P7))),
  9: o => o.map(optNum).map(v => near(v, P7 * 49 - (sector(7, 90, P7) - 24.5))),
  10: o => o.map(optNum).map(v => { const deg = (100 - 56) / arc(28, 1, P7); return near(v, sector(28, deg, P7)); }),
  11: o => o.map(s => s === 'both'),                              // Asha's rule is the chapter's; a diameter halves the circle
  12: o => o.map(optNum).map(v => near(v, r2(Q12seg))),
  13: o => o.map(optNum).map(v => near(arc(21, v, P7), 44)),
  14: o => o.map(s => s === `${2 * 2 * 6}\\pi cm`),                  // two turns a day
  15: o => o.map(s => /plus the area of its triangle/.test(s)),   // the only false one: a segment is sector less triangle
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  const right = letter(f(o));
  is(`Q${q}: right option ${right} against key ${key[q]}`, right.length === 1 && right[0] === key[q]);
}
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  16: [near(sector(9, 60, Math.PI), Math.PI * 81 / 6), true, true],
  17: [near(arc(10, 50, 3.14), 2 * arc(5, 50, 3.14)), near(sector(10, 50, 3.14), 4 * sector(5, 50, 3.14)), false],
  18: [near(sector(28, 90, P7) - 28 * 28 / 2, 224) && /area 224/.test(text(qs[18] || '')), false, false],
  19: [near(arc(3.5, 180, P7) + 7, 11) && /is 11 cm/.test(text(qs[19] || '')), near(arc(4, 180, Math.PI), Math.PI * 4), false],
};
for (const [q, v] of Object.entries(AR)) is(`Q${q}: assertion-reason ${arLetter(v)} against key ${key[q]}`, arLetter(v) === key[q]);
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
is('key covers 1-19', Object.keys(key).map(Number).sort((a, b) => a - b).join() === [...Array(19)].map((_, i) => i + 1).join());
is('practice numbered 1-31', [...beyond.matchAll(/data-start="(\d+)"/g)].map(m => Number(m[1])).join() === [...Array(30)].map((_, i) => i + 2).join());
is('every key row 20-31 is there', [...Array(12)].every((_, i) => keyRows[20 + i]));

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
{
  const i = answersMd.indexOf('as the key prints it');
  for (const m of answersMd.slice(i, i + 400).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2];
}
is(`ANSWERS.md key matches the page: ${JSON.stringify(mdKey)}`, JSON.stringify(mdKey) === JSON.stringify(key));

const mdPractice = answersMd.slice(answersMd.indexOf('The working for each'));
const mdRow = (q) => {
  const [, n, p] = String(q).match(/^(\d+)([a-d]?)$/);
  const m = mdPractice.match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`));
  const r = m ? m[1].replace(/\$/g, '').replace(/\s+/g, ' ') : '';
  return p ? part(r, p) : r;
};
// every number a page key row stands on must be in ANSWERS.md's row too
const mdSays = (q, ...vals) => { for (const v of vals) is(`ANSWERS.md ${q} should say ${v}: "${mdRow(q)}"`, has(mdRow(q), v)); };
{
  const P = 22 / 7;
  mdSays(1, arc(28, 45, P)); mdSays(2, sector(14, 90, P)); mdSays(3, 260); mdSays(5, sector(7, 90, P)); mdSays(6, arc(7, 180, P) + 14);
  mdSays(8, arc(42, 45, P)); mdSays(9, 140); mdSays(10, 616); mdSays(12, Q12deg, r2(Q12seg));
  mdSays(13, 120); mdSays(18, sector(28, 90, P) - 392); mdSays(19, arc(3.5, 180, P) + 7);
  mdSays(20, 40); mdSays(23, 7, arc(7, 72, P)); mdSays(24, r2(sector(14, 120, P) - tri120(14, 1.73)).toFixed(2));
  mdSays(25, 44, 924); mdSays(26, r2(sector(12, 150, 3.14))); mdSays(27, 56);
  mdSays(28, r2(arc(35, 60, P)), r2(r2(arc(35, 60, P)) + 35), r2(P * 1225 - sector(35, 60, P) + eqTri(35, 1.73)).toFixed(2));
  mdSays(29, 192.5, 69);
  mdSays('30a', 62.8); mdSays('30b', sector(20, 18, 3.14)); mdSays('30c', arc(6, 150, 3.14)); mdSays('30d', r2(2 * 62.8 + sector(6, 150, 3.14)));
  mdSays('31b', sector(10.5, 60, P)); mdSays('31c', 32); mdSays('31d', 5 * sector(10.5, 60, P));
  // and the key rows and the md rows agree number for number on the lettered case parts
  for (const q of ['30a', '30b', '30c', '30d', '31b', '31c', '31d']) {
    const last = (s) => (s.replace(/\s(cm|m)\s?(2|²)?/g, ' ').match(/\d+(\.\d+)?/g) || []).pop();
    is(`${q}: page and ANSWERS.md end on the same number (${last(row(q))}, ${last(mdRow(q))})`, last(row(q)) === last(mdRow(q)));
  }
}

/* ---- report ---------------------------------------------------- */

console.log(`A  ${spans} identities evaluated, ${algebra} in r and theta; ${skipped.length} spans not pure arithmetic, skipped`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
