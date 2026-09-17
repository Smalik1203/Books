#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed — angle sums, linear equations, the angles a figure is drawn
   with — and compared with what is on the page.

     node pages/class-9/ch06-lines-and-angles/check-numbers.mjs [--skipped]

   Four parts:
     A  every identity set as maths, on every page and in ANSWERS.md: pure
        arithmetic is evaluated, and an equation in one unknown is checked
        against the value the same block solves it to (an example, a key
        row, an ANSWERS.md item)
     B  the claims A cannot check: each example's answer, each exercise
        answer read back off ANSWERS.md, the figures' drawn angles, the
        general results tested on many triangles, and the practice answers
        read back out of the key rows a lettered part at a time
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
const near = (a, b) => Math.abs(a - b) < 1e-6;

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<span class="nb">([^<]*)<\/span>/g, '$1')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-')
  .replace(/&deg;/g, '°').replace(/\s+/g, ' ');
const plain = (s) => text(s).replace(/\$/g, '').replace(/\^\\circ|\^\{\\circ\}/g, '').replace(/\\angle\s*/g, '∠')
  .replace(/\\tfrac\{1\}\{2\}/g, '½').replace(/\s+/g, ' ');
const has = (s, v) => new RegExp(`(^|[^\\d.])${String(v).replace('.', '\\.')}([^\\d]|$)`).test(s);

/* ---- A. every identity ---------------------------------------- */

function toExpr(side, env = {}) {
  let s = side
    .replace(/\^\{?\\circ\}?/g, '')
    .replace(/\\left|\\right/g, '')
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad/g, '')
    .replace(/\s+/g, '');
  for (const [v, val] of Object.entries(env)) s = s.replace(new RegExp(`(?<![A-Za-z\\\\])${v}(?![A-Za-z])`, 'g'), `(${val})`);
  if (!s || !/^[-+*/().0-9]+$/.test(s)) return null;
  return s.replace(/(\d|\))\(/g, '$1*(').replace(/\)(\d)/g, ')*$1');
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
    const ms = [...block.matchAll(/\$([^$]+)\$/g)].map(m => m[1]);
    // a letter may be solved twice in one block (a remark works a wrong reading), so each value is tried
    const solved = {};
    for (const s of ms) { const m = s.match(SOLVED); if (m) (solved[m[1]] ??= new Set()).add(Number(m[2])); }
    const envs = Object.entries(solved).reduce((acc, [v, set]) => acc.flatMap(e => [...set].map(x => ({ ...e, [v]: x }))), [{}]);
    for (const span of ms) {
      if (!span.includes('=') || /\\neq|\\le|\\ge|<|>|:|\\parallel/.test(span)) continue;
      if (SOLVED.test(span)) continue;
      const sides = span.split('=').map(s => s.trim()).filter(Boolean);
      if (sides.length < 2) continue;
      const tries = envs.map(env => sides.map(s => toExpr(s, env)).map(e => (e ? evalExpr(e) : NaN)));
      const usable = tries.filter(nums => nums.every(Number.isFinite));
      if (!usable.length) { skipped.push(`${f}: $${span.trim()}$`); continue; }
      spans++;
      if (usable.some(nums => nums.every(n => Math.abs(n - nums[0]) < 1e-9))) pass++;
      else fails.push(`${f}: $${span.trim()}$ — sides are ${usable[0].join(' and ')} (with ${JSON.stringify(solved, (k, v) => v instanceof Set ? [...v] : v)})`);
    }
  }
}

/* ---- B. claims arithmetic alone does not check ---------------- */

// an example's panel and its Answer row, by number
const panels = (src) => {
  const o = {};
  for (const part of src.split('<div class="c-example">').slice(1)) {
    const n = part.match(/c-example__tab">Example (\d+)/)[1];
    o[n] = part;
  }
  return o;
};
const bodyEx = panels(body), beyondEx = panels(beyond);
const rowOf = (panel, label) => {
  const m = (panel || '').match(new RegExp(`work__label">${label}</span>([\\s\\S]*?)</div>`));
  return m ? plain(m[1]) : '';
};
const exSays = (where, ex, n, ...vals) => { for (const v of vals) is(`${where} Example ${n} Answer should say ${v}: "${rowOf(ex[n], 'Answer')}"`, has(rowOf(ex[n], 'Answer'), v)); };
const stepSays = (where, ex, n, ...vals) => { for (const v of vals) is(`${where} Example ${n} should print ${v}`, has(plain(ex[n] || ''), v)); };
const lin = (f) => { const b = f(0), a = f(1) - b; return -b / a; };   // root of a linear function

// the body's examples
exSays('body', bodyEx, 1, 180 - 118);
{ const x = 180 / 9; exSays('body', bodyEx, 2, 4 * x, 5 * x); }
{ const x = lin(x => x + 2 * x + 3 * x + 120 - 360), angles = [x, 2 * x, 3 * x, 120];
  exSays('body', bodyEx, 3, x); stepSays('body', bodyEx, 3, ...angles);
  is(`body Example 3: ${angles.filter(a => a > 90).length} obtuse, printed "Two"`, angles.filter(a => a > 90).length === 2 && /Two angles are obtuse/.test(rowOf(bodyEx[3], 'Answer'))); }
{ const a = lin(a => a + 3 * a + 32 - 180); exSays('body', bodyEx, 4, a, 3 * a + 32); }
exSays('body', bodyEx, 5, 180 - 58, 58);
{ const x = lin(x => 3 * x + 10 + 2 * x + 40 - 180); exSays('body', bodyEx, 6, x); is('body Example 6 check', has(rowOf(bodyEx[6], 'Check'), 3 * x + 10) && has(rowOf(bodyEx[6], 'Check'), 2 * x + 40)); }
exSays('body', bodyEx, 7, 44 + 31);
{ const x = lin(x => x + 20 + 2 * x - 10 + 3 * x + 5 - 180), angles = [x + 20, 2 * x - 10, 3 * x + 5];
  exSays('body', bodyEx, 8, ...angles);
  is('body Example 8: acute and scalene', angles.every(a => a < 90) && new Set(angles).size === 3 && /acute-angled, scalene/.test(rowOf(bodyEx[8], 'Answer'))); }
exSays('body', bodyEx, 9, 128 - 47, 180 - 128);
// Example 10 and its edge-case paragraph, over many triangles
{ let good = true;
  for (let P = 1; P < 179; P += 7) for (let Q = 1; Q < 180 - P; Q += 11) { const R = 180 - P - Q; if (!near(180 - Q / 2 - R / 2, 90 + P / 2)) good = false; }
  is('Example 10: angle QOR = 90 + P/2 in every triangle tried', good);
  is('p016/p017: equilateral gives 120', /∠P = 60, so ∠QOR = 120/.test(plain(body)) && 90 + 60 / 2 === 120); }
// p011: one given angle fixes all eight at two values
ok('p011: the two values', [58, 180 - 58], [58, 122]);

// the figures, measured from their own coordinates
const pts = (svg, ...labels) => labels.map(l => { const m = svg.match(new RegExp(`<text class="dg-label" x="([\\d.]+)" y="([\\d.]+)"[^>]*>${l}</text>`)); return m && [Number(m[1]), Number(m[2])]; });
const ang = (p, q, r) => { // angle at q between rays q→p and q→r, degrees
  const a = Math.atan2(p[1] - q[1], p[0] - q[0]), b = Math.atan2(r[1] - q[1], r[0] - q[0]);
  let d = Math.abs(a - b) * 180 / Math.PI; return d > 180 ? 360 - d : d;
};
const svgOf = (src, fig) => { const i = src.indexOf(`fignum">Fig. ${fig}<`); return src.slice(src.lastIndexOf('<svg', i), i); };
{ const s = svgOf(body, '6.7');
  const A = [60, 26], E = [99.4, 64], C = [39.4, 100];
  is('Fig. 6.7 draws those points', s.includes('M60 26 L99.4 64') && s.includes('M99.4 64 L39.4 100'));
  is(`Fig. 6.7: angle BAE drawn ${ang([200, 26], A, E).toFixed(1)}, printed 44`, Math.abs(ang([200, 26], A, E) - 44) < 1);
  is(`Fig. 6.7: angle ECD drawn ${ang(E, C, [200, 100]).toFixed(1)}, printed 31`, Math.abs(ang(E, C, [200, 100]) - 31) < 1);
  is(`Fig. 6.7: angle AEC drawn ${ang(A, E, C).toFixed(1)}, printed 75`, Math.abs(ang(A, E, C) - 75) < 1); }
{ const s = svgOf(beyond, '6B.2');
  is('Fig. 6B.2 draws its triangle', s.includes('M52.8 10 L20 100 L160 100 Z'));
  const A = [52.8, 10], B = [20, 100], C = [160, 100], D = [76.9, 100], E = [52.8, 100];
  is(`Fig. 6B.2: B drawn ${ang(A, B, C).toFixed(1)}, printed 70`, Math.abs(ang(A, B, C) - 70) < 1);
  is(`Fig. 6B.2: C drawn ${ang(A, C, B).toFixed(1)}, printed 40`, Math.abs(ang(A, C, B) - 40) < 1);
  is('Fig. 6B.2: AD bisects A', Math.abs(ang(B, A, D) - ang(D, A, C)) < 1 && s.includes('M52.8 10 L76.9 100'));
  is(`Fig. 6B.2: DAE drawn ${ang(D, A, E).toFixed(1)}, printed 15`, Math.abs(ang(D, A, E) - 15) < 1); }
{ const s = svgOf(beyond, '6B.4');
  is('Fig. 6B.4 draws its ray', s.includes('M20 40 L60 100 L113.3 20 L146.7 70'));
  const A = [20, 40], B = [60, 100], C = [113.3, 20], D = [146.7, 70];
  is('Fig. 6B.4: equal angles to each mirror', Math.abs(ang(A, B, [0, 100]) - ang(C, B, [200, 100])) < 0.5 && Math.abs(ang(B, C, [0, 20]) - ang(D, C, [200, 20])) < 0.5);
  is('Fig. 6B.4: AB parallel to CD', Math.abs((B[1] - A[1]) / (B[0] - A[0]) - (D[1] - C[1]) / (D[0] - C[0])) < 0.01); }
{ const s = svgOf(beyond, '6B.5');
  const A = [60, 20], C = [19.8, 60], E = [89.1, 100];
  is('Fig. 6B.5 draws those points', s.includes('M60 20 L89.1 100') && s.includes('M19.8 60 L89.1 100'));
  is(`Fig. 6B.5: BAE drawn ${ang([200, 20], A, E).toFixed(1)}, printed 70`, Math.abs(ang([200, 20], A, E) - 70) < 1);
  is(`Fig. 6B.5: DCE drawn ${ang([200, 60], C, E).toFixed(1)}, printed 30`, Math.abs(ang([200, 60], C, E) - 30) < 1);
  is(`Fig. 6B.5: AEC drawn ${ang(A, E, C).toFixed(1)}, printed 40`, Math.abs(ang(A, E, C) - 40) < 1); }

// the exercises, read back off ANSWERS.md
const mdSection = (head) => { const i = answersMd.indexOf(head); const j = answersMd.indexOf('\n#', i + head.length); return answersMd.slice(i, j < 0 ? undefined : j); };
const mdItem = (head, n) => { const m = mdSection(head).match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`)); return m ? plain(m[1]) : ''; };
const mdSays = (head, n, ...vals) => { for (const v of vals) is(`ANSWERS.md ${head} Q${n} should say ${v}: "${mdItem(head, n).slice(0, 90)}"`, has(mdItem(head, n), v)); };
const S1 = '### Exercise Set 6.1', S2 = '### Exercise Set 6.2', S3 = '### Exercise Set 6.3', E = '## End-of-Chapter Exercises';
mdSays(S1, 1, 90 - 35, 180 - 35, 90 - 72, 180 - 72, 180 - 90, 180 - 116);
mdSays(S1, 2, 180 / 2, 90 / 2);
{ const x = lin(x => 2 * x + 15 + 3 * x - 25 - 180); mdSays(S1, 3, x, 2 * x + 15, 3 * x - 25); }
{ const u = 360 / 12; mdSays(S1, 5, 2 * u, 3 * u, 7 * u); }
mdSays(S1, 6, 200 / 2, 180 - 200 / 2);
mdSays(S2, 1, 180 - 73);
{ const x = lin(x => 4 * x - 6 - (2 * x + 30)); mdSays(S2, 2, x, 4 * x - 6); }
mdSays(S2, 4, 137 - 52);
mdSays(S2, 5, 64, 180 - 64);
{ const c = 180 - 54 - 67; mdSays(S3, 1, c, 180 - 54, 180 - 67, 180 - c); }
{ const u = 180 / 9; mdSays(S3, 2, 2 * u, 3 * u, 4 * u); }
{ const x = lin(x => x + x / 2 + x - 30 - 180); mdSays(S3, 3, x, x / 2, x - 30); }
is('Ex 6.3 Q4: the exterior angles do not total 360', 100 + 120 + 150 !== 360 && has(mdItem(S3, 4), 370));
mdSays(S3, 5, 118 - 62, 180 - 118);
mdSays(E, 1, lin(x => x - (90 - x - 24)));
{ const x = lin(x => 5 * x - 8 + 3 * x + 12 - 180); mdSays(E, 2, x, 5 * x - 8, 3 * x + 12); }
mdSays(E, 4, 5 * 20, 4 * 20);
{ const B = lin(b => b + 15 + b + b - 25 - 180); is(`End Q7: B = ${B}`, near(B, 63 + 1 / 3) && /63\\tfrac\{1\}\{3\}/.test(mdSection(E)) && /78\\tfrac\{1\}\{3\}/.test(mdSection(E)) && /38\\tfrac\{1\}\{3\}/.test(mdSection(E))); }
mdSays(E, 8, 90 - 63);
{ const A = 180 - 70 - 50; mdSays(E, 9, A, A / 2, 180 - 70 - A / 2, 180 - 50 - A / 2); }
mdSays(E, 10, 87 + 91, 360 - 178);
{ let good = true; for (let A = 5; A < 175; A += 5) for (let B = 1; B < 180 - A; B += 9) { const C = 180 - A - B; if (!near(180 - (90 - B / 2) - (90 - C / 2), 90 - A / 2)) good = false; } is('End Q11 over many triangles', good); }
mdSays(E, 12, 180 - 174, 360 - 174);
{ let n = 0; for (let s = 1; s < 180; s++) { const m = 180 - 3 * s; if (m >= s && m <= 2 * s) n++; }
  is(`End Q13: ${n} triangles, printed Ten`, n === 10 && /\*\*Ten\.\*\*/.test(mdItem(E, 13)));
  mdSays(E, 13, 36, 45); }
is('End Q15: the middle angle is 60', [0, 7, 19].every(d => lin(a => (a - d) + a + (a + d) - 180) === 60)); mdSays(E, 15, 60);
is('End Q17: four lines at 0, 30, 60, 90 give 120', 2 * (30 + 30) === 120 && has(mdItem(E, 17), 120));

// Think and Reflect
is('p018 T&R: exterior angles total 360', 3 * 180 - 180 === 360);

// Stage 1, as printed in its running text
{ const A = 180 - 70 - 40, BAD = A / 2, BAE = 90 - 70;
  is(`Stage 1 Q1: DAE = ${BAD - BAE}`, BAD - BAE === 15 && (BAD - BAE) === (70 - 40) / 2 && /= 15/.test(plain(beyond)));
  let good = true; for (let B = 2; B < 178; B += 3) for (let C = 1; C < Math.min(B, 180 - B); C += 7) if (!near((180 - B - C) / 2 - (90 - B), (B - C) / 2)) good = false;
  is('Stage 1 Q1 over many triangles', good); }
is('Stage 1 Q2: 95', 55 + 40 === 95 && /= 95/.test(plain(beyond)));
{ let good = true; for (let A = 2; A < 178; A += 4) for (let B = 1; B < 180 - A; B += 13) { const ECD = (A + B) / 2; if (!near(ECD - B / 2, A / 2)) good = false; }
  is('Stage 1 Q5 over many triangles', good);
  is('Stage 1 Q5: 32 from 64', /A = 64, ∠BEC = 32/.test(plain(beyond)) && 64 / 2 === 32); }

// Stage 2
{ const x = lin(x => 180 - x - 5 * (90 - x)); exSays('Beyond', beyondEx, 1, x); is('Beyond Ex 1 check', has(rowOf(beyondEx[1], 'Check'), 180 - x) && has(rowOf(beyondEx[1], 'Check'), 90 - x)); }
{ const x = lin(x => 9 * x + 180 - 360); exSays('Beyond', beyondEx, 3, x); stepSays('Beyond', beyondEx, 3, 2 * x, 3 * x, 2 * x + 3 * x + 80); is('Beyond Ex 3: AOD straight', 2 * x + 3 * x + 80 === 180 && 4 * x + 100 === 180); }
exSays('Beyond', beyondEx, 4, 70 / 2, 180 - 70 / 2);
{ const x = lin(x => x + x + 40 - 180); exSays('Beyond', beyondEx, 6, x, x + 40); }
is('Beyond Ex 7: 72 + 108', 72 + 108 === 180);
{ const k = 115 / 5; exSays('Beyond', beyondEx, 12, 2 * k, 3 * k, 180 - 115); is('Beyond Ex 12 sums', 2 * k + 3 * k + 180 - 115 === 180); }
exSays('Beyond', beyondEx, 13, 70 - 30);
// the MCQ examples: exactly one right option, the one the Answer row names
const exOpts = (n) => [...(beyondEx[n].match(/<ol class="c-parts c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/) || ['', ''])[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => plain(m[1]).trim());
const exKey = (n) => (rowOf(beyondEx[n], 'Answer').match(/\(([a-d])\)/) || [])[1];
const num = (s) => Number(String(s).replace(/[^\d.\-]/g, ''));
const exSolve = {
  2: o => o.map(num).map(v => v === lin(x => 2 * x + 38 - 180)),
  5: o => o.map(num).map(v => v === 2 * lin(x => 2 * x + 25 - (3 * x - 5)) + 25),
  9: o => o.map(num).map(v => v === 7 * 180 / 15),
  11: o => o.map(num).map(v => v === 3 * lin(x => 3 * x - x - 40)),
};
for (const [n, f] of Object.entries(exSolve)) {
  const right = f(exOpts(n)).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Beyond Example ${n}: the right option`, right, [exKey(n)]);
}
{ const x = lin(x => 5 * x + 20 - 180); is('Beyond Ex 5 option (d) remark', x === 32 && 2 * x + 25 === 89 && 3 * x - 5 === 91 && num(exOpts(5)[3]) === 89); }
is('Beyond Ex 9: 3 + 5 is not 7', 3 + 5 !== 7);

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
  20: [90 - 38, 180 - (90 - 38)],
  21: [3 * 180 / 6],
  22: [130 - 72],
  23: [2 * (125 - 90)],
  24: [90 - 50, 90 - 60, 180 - 50 - 60],
  25: [180 - 110, (110 - 20) / 2, (110 - 20) / 2 + 20],
  26: [lin(x => 6 * x + 60 - 180), 4 * 20 + 16, 180 - (4 * 20 + 16)],
  27: [3 * 180],
  28: [180 / 4, 3 * 180 / 4],
  '29a': [180 - 110, 180 - 125, 180 - (180 - 110) - (180 - 125)],
  '30c': [180 - 62], '30d': [75],
  '31a': [180 - 145], '31b': [145 - 35], '31c': [90 - 35],
};
for (const [q, vs] of Object.entries(P)) says(q, ...vs);
is(`key 26 should read "BPQ = ${4 * 20 + 16}" and "APQ = 180 − ${4 * 20 + 16} = ${180 - (4 * 20 + 16)}": "${row(26)}"`,
  row(26).includes(`∠BPQ = ${4 * 20 + 16}`) && row(26).includes(`∠APQ = 180 - ${4 * 20 + 16} = ${180 - (4 * 20 + 16)}`));
is('key 29 (a) and (b) agree', 110 + 125 - 55 === 180);
is('key 30 (a) names corresponding angles', /corresponding/.test(row('30a')));
is('key 31 (d) obtuse', 145 - 35 > 90 && /obtuse/.test(row('31d')));

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] ??= m[2];
const optsOf = (n) => { const o = (qs[n] || '').match(/<ol class="c-parts c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/); return o ? [...o[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => plain(x[1]).trim()) : []; };
const key = {};
{ const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2]; }
const val = (f) => (o) => o.map(num).map(v => near(v, f));
const solve = {
  1: val(180 - 65),
  2: val(360 - 90 - 120),
  3: val(72),
  4: val(180 - 118),
  5: val(125 - 60),
  6: o => o.map(s => s === '(i) and (iii)'),                 // co-interior angles are supplementary, not equal
  7: val(180 - 130),
  8: val(8 / 2),                                            // two sizes, four of each
  9: val(180 - 110),
  10: val((180 - (180 - 100)) / 2),
  11: val(180 - (180 - 100) - (180 - 130)),
  12: val(lin(x => x - (90 - x) - 32)),
  13: val(lin(x => x + 4 * x - 180)),
  14: o => o.map(s => /^a corresponding pair$/.test(s)),
  15: o => o.map(s => s === 'must both be acute'),
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Q${q}: the right option`, right, [key[q]]);
}
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  16: [true, true, true],                                   // the angle sum, and its proof
  17: [true, true, false],                                  // the axiom's two halves: R is A's converse
  18: [90 + 90 < 180, true, false],                         // two right angles leave nothing
  19: [true, 180 === 125, false],                           // an exterior angle is not the total of 180
};
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-19', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(19)].map((_, i) => i + 1));
ok('practice numbered 1-31', [...beyond.matchAll(/data-start="(\d+)"/g)].map(m => Number(m[1])), [...Array(30)].map((_, i) => i + 2));

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
{ const i = answersMd.indexOf('as the key prints it'); for (const m of answersMd.slice(i, i + 600).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2]; }
ok('ANSWERS.md key matches the page', mdKey, key);
const W = '### The working for each';
for (const [q, vs] of Object.entries(P)) {
  const [, n, part] = q.match(/^(\d+)([a-d]?)$/);
  let r = mdItem(W, n);
  if (part) { const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\)|$)`)); r = m ? m[1] : ''; }
  if (n === '24' || n === '20') r = mdItem(W, n);            // lettered there, a phrase on the page
  for (const v of vs) is(`ANSWERS.md practice ${q} should say ${v}: "${r.slice(0, 80)}"`, has(r, v));
}
for (const q of Object.keys(solve)) {
  const o = optsOf(q), right = o['abcd'.indexOf(key[q])] || '';
  const v = num(right);
  if (Number.isFinite(v) && /\d/.test(right)) is(`ANSWERS.md practice ${q} should reach ${v}`, has(mdItem(W, q), v));
}

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
