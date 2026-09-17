#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed from the measurements in the question — areas, volumes, unit
   conversions, scale factors — and compared with what is on the page.

     node pages/class-8/ch07-mensuration/check-numbers.mjs [--skipped]

   Four parts:
     A  every identity set as maths, on every page and in ANSWERS.md, whose
        sides all evaluate to numbers
     B  the claims A cannot check: worked answers read back out of the
        Answer rows, unit conversions, the exercise answers in ANSWERS.md,
        and the practice answers read back out of the key, part by part
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
const near = (a, b) => Math.abs(a - b) <= 1e-7 * Math.max(1, Math.abs(a), Math.abs(b));
const ok = (what, got, want) => {
  const same = typeof got === 'number' && typeof want === 'number' ? near(got, want) : JSON.stringify(got) === JSON.stringify(want);
  if (same) pass++;
  else fails.push(`${what}\n      computed ${JSON.stringify(got)}\n      printed  ${JSON.stringify(want)}`);
};
const is = (what, cond) => { if (cond) pass++; else fails.push(what); };

/* ---- the mathematics ----------------------------------------- */

const PI = 22 / 7;
const trap = (a, b, h) => (a + b) * h / 2;
const quad = (d, h1, h2) => d * (h1 + h2) / 2;
const rhombus = (d1, d2) => d1 * d2 / 2;
const tsaCuboid = (l, b, h) => 2 * (l * b + b * h + h * l);
const walls = (l, b, h) => 2 * (l + b) * h;
const csa = (r, h, pi = PI) => 2 * pi * r * h;
const tsaCyl = (r, h, pi = PI) => 2 * pi * r * (h + r);
const volCyl = (r, h, pi = PI) => pi * r * r * h;
// units, written out once
const M3_TO_L = 1000, L_TO_CM3 = 1000, CM_PER_M = 100, CM2_PER_M2 = CM_PER_M ** 2, CM3_PER_M3 = CM_PER_M ** 3, M2_PER_HA = 10000;
const round = (x, d) => Math.round(x * 10 ** d) / 10 ** d;

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<sup>2<\/sup>/g, '²').replace(/<sup>3<\/sup>/g, '³').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/&middot;/g, '·').replace(/\\,/g, '').replace(/\s+/g, ' ');

/* ---- A. every identity ---------------------------------------- */

function toExpr(side) {
  let s = side
    .replace(/,\s*$/, '')
    .replace(/\\left|\\right|\\big|\\Big/g, '')
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\[td]?frac(\d)(\d)/g, '(($1)/($2))')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad/g, '')
    .replace(/\^\{([^{}]+)\}/g, '**($1)').replace(/\^(\d)/g, '**$1')
    .replace(/\s+/g, '');
  if (!s || !/^[-+*/().0-9]+$/.test(s)) return null;
  s = s.replace(/\)\(/g, ')*(').replace(/(\d)\(/g, '$1*(').replace(/\)(\d)/g, ')*$1');
  return s;
}
const evalExpr = (e) => { try { return Function(`"use strict";return (${e})`)(); } catch { return NaN; } };

// an equation in one unknown is solved, and its root must be printed in the
// working that follows it (within the next few lines of the same source)
const lettersIn = (s) => new Set((s.replace(/\\[a-zA-Z]+/g, ' ').replace(/\\./g, ' ').match(/[a-zA-Z]/g) || []));
let solved = 0;
let lastRoot = null;
function solveOne(f, src, at, sides) {
  const all = sides.join(' ').replace(/\\pi/g, '\\tfrac{22}{7}');
  const vs = [...lettersIn(all)];
  if (vs.length !== 1) return false;
  const v = vs[0];
  const sub = (s, x) => toExpr(s.replace(/\\pi/g, '\\tfrac{22}{7}').replace(new RegExp(`(?<!\\\\[a-zA-Z]*)${v}(?![a-zA-Z])`, 'g'), `(${x})`));
  const exprs = [0, 1, 2].map(x => sides.map(s => sub(s, x)));
  if (exprs.flat().some(e => e === null)) return false;
  const g = (i) => exprs[i].map(evalExpr);
  if (sides.length !== 2) return false;
  const fx = [0, 1, 2].map(i => { const [a, b] = g(i); return a - b; });
  if (!near(fx[2] - fx[1], fx[1] - fx[0]) || near(fx[1], fx[0])) return false; // not linear in the unknown
  const exact = -fx[0] / (fx[1] - fx[0]);
  const root = round(exact, 6);
  solved++;
  // `k = \tfrac12`: the span is itself the root
  // and must agree with the equation just before it in the same unknown
  const lone = sides.findIndex(s => s.trim() === v);
  if (lone >= 0 && near(evalExpr(toExpr(sides[1 - lone])), exact)) {
    const prev = lastRoot && lastRoot.f === f && lastRoot.v === v && at - lastRoot.at < 400 ? lastRoot : null;
    if (!prev || near(prev.exact, exact)) pass++;
    else fails.push(`${f}: $${sides.join(' = ')}$ — the equation before it gives ${v} = ${round(prev.exact, 6)}`);
    lastRoot = null;
    return true;
  }
  lastRoot = { f, v, at, exact };
  const near700 = text(src.slice(Math.max(0, at - 700), at + 700)).replace(/(\d) (\d{3})/g, '$1$2');
  const forms = [...new Set([root, round(exact, 2), round(exact, 1)])].map(x => String(x).replace('.', '\\.'));
  const fracs = [...src.slice(at, at + 700).matchAll(new RegExp(`${v} = \\\\tfrac\\{(\\d+)\\}\\{(\\d+)\\}`, 'g'))].map(x => x[1] / x[2]);
  if (forms.some(s => new RegExp(`(^|[^\\d.])${s}([^\\d]|$)`).test(near700)) || fracs.some(x => near(x, exact))) pass++;
  else fails.push(`${f}: $${sides.join(' = ')}$ — the root is ${root}, and the working after it does not print it`);
  return true;
}

let spans = 0; const skipped = [];
const sources = [...pages.map(f => [f, html[f]]), ['ANSWERS.md', answersMd]];
for (const [f, src] of sources) {
  for (const m of src.matchAll(/\$\$?([^$]+)\$\$?/g)) {
    let span = m[1];
    if (!span.includes('=')) continue;
    // `x = exact \approx 12.73`: the exact side must round to the printed one
    if (span.includes('\\approx')) {
      const [lhs, approx] = span.split('\\approx').map(s => s.trim());
      const ex = evalExpr(toExpr(lhs.split('=').pop().trim()) || 'NaN');
      const dp = (approx.split('.')[1] || '').length;
      spans++;
      if (Number.isFinite(ex) && near(round(ex, dp), Number(approx))) pass++;
      else fails.push(`${f}: $${span.trim()}$ — ${ex} does not round to ${approx}`);
      span = lhs;
    }
    const sides = span.split('=').map(s => s.trim()).filter(Boolean);
    if (sides.length < 2) { skipped.push(`${f}: $${span.trim()}$`); continue; }
    const vals = sides.map(toExpr);
    if (vals.some(v => v === null)) { if (!solveOne(f, src, m.index, sides)) skipped.push(`${f}: $${span.trim()}$`); continue; }
    const nums = vals.map(evalExpr);
    if (nums.some(n => !Number.isFinite(n))) { skipped.push(`${f}: $${span.trim()}$`); continue; }
    spans++;
    if (nums.some(n => !near(n, nums[0]))) fails.push(`${f}: $${span.trim()}$ — sides are ${nums.join(' and ')}`);
    else pass++;
  }
}

/* ---- B. claims arithmetic alone does not check ---------------- */

// a printed value must appear in the given text as a whole number
const has = (what, t = '', ...vals) => { for (const v of vals) { const s = String(typeof v === 'number' ? round(v, 6) : v).replace('.', '\\.'); is(`${what} should say ${v}: "${t.slice(0, 160)}"`, new RegExp(`(^|[^\\d.])${s}([^\\d]|\\.(?!\\d)|$)`).test(t)); } };

// the body's worked examples, read out of their own Answer rows
const exAnswers = (src) => {
  const o = {};
  for (const m of src.matchAll(/c-example__tab">Example (\d+)<\/div>([\s\S]*?)(?=c-example__tab|$)/g)) {
    const a = m[2].match(/work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/);
    o[m[1]] = a ? text(a[1]) : '';
  }
  return o;
};
const bodyEx = exAnswers(body);
ok('body has 7 examples, each with an Answer row', Object.values(bodyEx).filter(Boolean).length, 7);
has('Body Ex 1', bodyEx[1], trap(12, 8, 5));
has('Body Ex 2', bodyEx[2], 84 / ((15 + 13) / 2));
is('Body Ex 2: "half of twelve plus eight is fourteen"', 12 / 2 + 8 === 14 && 14 * 5 !== trap(12, 8, 5));
has('Body Ex 3', bodyEx[3], quad(18, 6, 9));
has('Body Ex 4', bodyEx[4], tsaCuboid(8, 5, 3));
has('Body Ex 5', bodyEx[5], tsaCyl(7, 10));
has('Body Ex 6', bodyEx[6], 2 * 1.5 * 1 * M3_TO_L);
ok('Body Ex 6: the same tank in cm3', 200 * 150 * 100, 2 * 1.5 * 1 * CM3_PER_M3);
ok('Body Ex 6: cm3 to litres agrees', 2 * 1.5 * 1 * CM3_PER_M3 / L_TO_CM3, 2 * 1.5 * 1 * M3_TO_L);
has('Body Ex 7', bodyEx[7], 3080 / volCyl(7, 1));
// the conversion table on p010/p011 and its check sentence
ok('1 m3 in cm3', 100 * 100 * 100, CM3_PER_M3);
ok('a million mL is a thousand litres', 1e6 / L_TO_CM3, M3_TO_L);
{ const t = text(body); is('body states 1 m³ = 1000 litres', /1 m³ = 1000 litres/.test(t)); is('body states 1000 cm³ = 1 litre', /1000 cm³ = 1 litre/.test(t)); }
// 7.8 tip: scale 1 : 50
ok('1:50 areas', 50 ** 2, 2500);
ok('1:50 volumes', 50 ** 3, 125000);
is('1:50 model weighs less than a hundred-thousandth', 1 / 50 ** 3 < 1 / 100000 && /less than a hundred-thousandth/.test(text(body)));
// Think and Reflect, in ANSWERS.md
has('T&R label', answersMd.slice(answersMd.indexOf('### Think and Reflect')), csa(7, 10), csa(7, 10) + PI * 49);

// ANSWERS.md, the exercise sets, one numbered item at a time
const mdItems = (heading) => {
  const from = answersMd.indexOf(heading);
  const rest = answersMd.slice(from + heading.length);
  const to = rest.search(/\n##/);
  const block = rest.slice(0, to < 0 ? undefined : to);
  const o = {};
  for (const m of block.matchAll(/(?:^|\n)(\d+)\. ([\s\S]*?)(?=\n\d+\. |$)/g)) o[m[1]] = text(m[2]);
  return o;
};
const md = (set) => mdItems(`### Exercise Set 7.${set}`);
const s1 = md(1), s2 = md(2), s3 = md(3), s4 = md(4), s5 = md(5);
// the lettered parts are checked one part at a time
const part = (t, p) => { const m = t.match(new RegExp(`- \\(${p}\\)(.*?)(?= - \\([ivx]+\\)|$)`)); return m ? m[1] : ''; };

has('7.1 Q1 (i)', part(s1[1], 'i'), trap(10, 6, 4));
has('7.1 Q1 (ii)', part(s1[1], 'ii'), trap(9, 15, 8));
has('7.1 Q1 (iii)', part(s1[1], 'iii'), trap(22, 18, 5));
has('7.1 Q2', s1[2], 60 / ((11 + 9) / 2));
has('7.1 Q3', s1[3], 2 * 132 / 8 - 20);
has('7.1 Q4', s1[4], 6 * 5 - 2 * 3, 6 * (5 - 3), (6 - 2) * 3);
has('7.1 Q5', s1[5], 2 * 56 / 14);
has('7.1 Q6', s1[6], 10 * 6 / 2);
has('7.1 Q7', s1[7].replace(/(\d) (\d{3})/g, '$1$2'), trap(40, 60, 30), trap(40, 60, 30) * 45);
has('7.1 Q9', s1[9], 12 / 2 + 8 * 5, trap(12, 8, 5));

has('7.2 Q1', s2[1], quad(20, 7, 5));
[[8, 6], [10, 24], [16, 9], [7, 4]].forEach(([a, b], i) => has(`7.2 Q2 (${['i', 'ii', 'iii', 'iv'][i]})`, part(s2[2], ['i', 'ii', 'iii', 'iv'][i]), rhombus(a, b)));
has('7.2 Q3', s2[3], 2 * 96 / 16);
has('7.2 Q4', s2[4], 10 ** 2 / 2);
has('7.2 Q5', s2[5], quad(50, 22, 18), quad(50, 22, 18) / M2_PER_HA);
has('7.2 Q6', s2[6], 12 * 8 + 12 * 5 / 2);
has('7.2 Q7', s2[7], rhombus(6, 8), Math.hypot(3, 4));

[[10, 6, 4], [12, 5, 5], [9, 7, 2]].forEach((d, i) => has(`7.3 Q1 (${['i', 'ii', 'iii'][i]})`, part(s3[1], ['i', 'ii', 'iii'][i]), tsaCuboid(...d)));
[3, 7, 10, 1.5].forEach((a, i) => has(`7.3 Q2 (${['i', 'ii', 'iii', 'iv'][i]})`, part(s3[2], ['i', 'ii', 'iii', 'iv'][i]), 6 * a * a));
has('7.3 Q3', s3[3], Math.sqrt(150 / 6));
has('7.3 Q4', s3[4], walls(6, 5, 4), walls(6, 5, 4) + 30);
has('7.3 Q5', s3[5], csa(7, 20), tsaCyl(7, 20));
has('7.3 Q6', s3[6], csa(14 / 2, 50));
has('7.3 Q7', s3[7], 3 * 2 + walls(3, 2, 1.5));
has('7.3 Q8', s3[8], tsaCuboid(8, 4, 4), 2 * 6 * 16, 2 * 6 * 16 - tsaCuboid(8, 4, 4));
ok('7.3 Q9: doubling multiplies the surface by', tsaCuboid(2, 4, 6) / tsaCuboid(1, 2, 3), 4);

[[8, 5, 3], [12, 10, 4], [7, 7, 2]].forEach((d, i) => has(`7.4 Q1 (${['i', 'ii', 'iii'][i]})`, part(s4[1], ['i', 'ii', 'iii'][i]), d[0] * d[1] * d[2]));
[4, 6, 10, 0.5].forEach((a, i) => has(`7.4 Q2 (${['i', 'ii', 'iii', 'iv'][i]})`, part(s4[2], ['i', 'ii', 'iii', 'iv'][i]), round(a ** 3, 3)));
has('7.4 Q3', s4[3], Math.round(Math.cbrt(343)), 6 * 49);
has('7.4 Q4', s4[4], volCyl(7, 15));
has('7.4 Q5 (i)', part(s4[5], 'i'), 5 * M3_TO_L);
has('7.4 Q5 (ii)', part(s4[5], 'ii'), 2500 / L_TO_CM3);
has('7.4 Q5 (iii)', part(s4[5], 'iii'), 4.5 * L_TO_CM3);
has('7.4 Q6', s4[6].replace(/(\d) (\d{3})/g, '$1$2'), 3 * 2 * 2, 3 * 2 * 2 * M3_TO_L, 3 * 2 * 2 * M3_TO_L / 50, 3 * 2 * 2 * M3_TO_L / 50 / 60);
has('7.4 Q7', s4[7], 360 / 60);
has('7.4 Q8', s4[8], round(volCyl(3, 10, 3.14), 2), round(volCyl(6, 10, 3.14), 2));
ok('7.4 Q8: four times', volCyl(6, 10) / volCyl(3, 10), 4);
{ const r = 22 / (2 * PI); has('7.4 Q9', s4[9], r, volCyl(r, 10)); }
{ const r = 10 / (2 * PI); ok('7.4 Q10: r = 35/22', r, 35 / 22); has('7.4 Q10', s4[10], Math.round(volCyl(r, 22))); is('7.4 Q10: less than Q9', volCyl(r, 22) < volCyl(22 / (2 * PI), 10)); }
{ const a = Math.cbrt(480); has('7.4 Q11', s4[11], tsaCuboid(12, 8, 5), 480, round(a, 2), Math.round(6 * a * a), 6 * 64);
  is('7.4 Q11: side between 7 and 8, cube uses less', a > 7 && a < 8 && 6 * a * a < tsaCuboid(12, 8, 5)); }

has('7.5 Q1', s5[1], 3, 9, 27);
has('7.5 Q2', s5[2], (6 / 2) ** 3, 6 ** 3 / 2 ** 3);
has('7.5 Q3', s5[3].replace(/(\d) (\d{3})/g, '$1$2'), 40 * 100 ** 2, 40 * 100 ** 2 / CM2_PER_M2);
has('7.5 Q5', s5[5], 6, 1000 * 6 * 0.1 ** 2);
ok('7.5 Q5: 1000 cubes of 1 mm make 1 cm3', 1000 * 0.1 ** 3, 1);
ok('7.5 Q5: 10 mm to a cm', 10 ** 3, 1000);
has('7.5 Q7', s5[7], 9, 27);
has('7.5 Q8', s5[8], 10 ** 3, 10 ** 2, 10 ** 3 / 10 ** 2);
{ let a = 1; while (6 * a * a !== a ** 3) a++; has('7.5 Q9', s5[9].replace(/(\d) (\d{3})/g, '$1$2'), a, 6 * a * a, 6 * (a * 10) ** 2, (a * 10) ** 3); }
{ const h1 = L_TO_CM3 / volCyl(5, 1), h2 = L_TO_CM3 / volCyl(10, 1);
  ok('7.5 Q10: h = 140/11', h1, 140 / 11); ok('7.5 Q10: doubled h = 35/11', h2, 35 / 11);
  ok('7.5 Q10: S = 42900/77', tsaCyl(5, h1), 42900 / 77); ok('7.5 Q10: S = 63800/77', tsaCyl(10, h2), 63800 / 77);
  has('7.5 Q10', s5[10].replace(/(\d) (\d{3})/g, '$1$2'), round(h1, 2), round(tsaCyl(5, h1), 1), round(h2, 2), round(tsaCyl(10, h2), 1), round(tsaCyl(10, h2) - tsaCyl(5, h1), 1)); }

// Stage 1
const s1t = text(beyond.slice(0, beyond.indexOf('Solved Examples')));
ok('S1 Q1: volume = curved surface at r = 2', [volCyl(2, 7), csa(2, 7)], [88, 88]);
is('S1 Q1: pi r^2 h = 2 pi r h only at r = 2', [1, 2, 3, 4, 5].filter(r => near(volCyl(r, 7), csa(r, 7))).join() === '2');
ok('S1 Q2: wax cubes', 12 * 6 * 4 / 2 ** 3, 36);
ok('S1 Q2: skins', [tsaCuboid(12, 6, 4), 36 * 6 * 4], [288, 864]);
ok('S1 Q3: well depth', volCyl(7 / 2, 10) / (22 * 14), 1.25);
ok('S1 Q3: radius 7 by mistake', [volCyl(7, 10) / volCyl(3.5, 10), volCyl(7, 10) / (22 * 14)], [4, 5]);
ok('S1 Q4: stone', 50 * 40 * 2, 4000);
{ const r = 4 * 22 / (2 * PI); ok('S1 Q5', [r, PI * r * r, PI * r * r - 22 ** 2], [14, 616, 132]); is('S1 Q5: over a quarter', 132 / 484 > 0.25); }
ok('S1 Q6: tank', [tsaCyl(1.4, 3), round(tsaCyl(1.4, 3) * 120, 2)], [38.72, 4646.4]);
is('S1 Q6: cost printed 4646.40', /₹\$4646\.40\$/.test(beyond));
ok('S1 Q7', [Math.sqrt(25), Math.sqrt(25) ** 3], [5, 125]);
has('S1 Q7 wording', s1t, 'twenty-five', 'a hundred and twenty-five');
{ const tins = [[3.5, 16], [7, 4], [14, 1]];
  tins.forEach(([r, h]) => ok(`S1 Q8: tin r=${r} holds 616`, volCyl(r, h), 616));
  ok('S1 Q8: surfaces', tins.map(([r, h]) => tsaCyl(r, h)), [429, 484, 1320]);
  is('S1 Q8: flattest more than three times the least', 1320 / 429 > 3 && 1320 / 429 < 4);
  const h2 = 616 / volCyl(2, 1); ok('S1 Q8: radius 2 height', h2, 49); has('S1 Q8: about 641', s1t, Math.round(tsaCyl(2, h2)));
  is('S1 Q8: radius 2 uses more than radius 3.5', tsaCyl(2, h2) > 429); }

// Solved Examples, read out of their Answer rows
const bEx = exAnswers(beyond);
ok('Beyond has Examples 1-18, each answered', Object.keys(bEx).map(Number).sort((a, b) => a - b), [...Array(18)].map((_, i) => i + 1));
is('every Beyond example has an Answer row', Object.values(bEx).every(Boolean));
has('Ex 1', bEx[1], 20 * 15 - (20 - 4) * (15 - 4));
has('Ex 2', bEx[2], 5 * 3 - 1 * 2 - 1.5 * 1);
{ let x = 0; while (trap(x, x + 6, 12) !== 180) x++; has('Ex 3', bEx[3], x, x + 6); }
has('Ex 4', bEx[4], 10 * 4 + 2 * (3 * 4 / 2)); ok('Ex 4: formula agrees', trap(16, 10, 4), 52);
{ const x = 2 * 210 / 28 - 8; has('Ex 5', bEx[5], x); }
{ const x = Math.sqrt(384 / 6); has('Ex 6', bEx[6], 3 * x, 4 * x); ok('Ex 6: area', rhombus(3 * x, 4 * x), 384); }
has('Ex 7', bEx[7], 30 ** 2 / 2, 30 ** 2 / 2 * 12);
{ const s = tsaCuboid(50, 40, 30); ok('Ex 8: surface', s, 9400); has('Ex 8', bEx[8], (s / CM2_PER_M2 * 40).toFixed(2)); }
has('Ex 9', bEx[9], walls(8, 6, 4) - (1 * 2 + 2 * 1.5 * 1));
{ const b = 30 - 2 * 5; has('Ex 10', bEx[10], b, 5, b * b * 5, 30 * 30 - 4 * 25); ok('Ex 10: net check', b * b + 4 * b * 5, 800); }
has('Ex 11', bEx[11], csa(1.4 / 2, 2) * 25);
has('Ex 12', bEx[12], 660 / csa(1, 15));
has('Ex 13', bEx[13], 30 * 25 * 20 / 250);
has('Ex 14', bEx[14].replace(/ /g, ''), 40 * 25 * (5 / CM_PER_M) * M3_TO_L);
has('Ex 15', bEx[15].replace(/ /g, ''), Math.round(volCyl(2.8 / 2, 2) * M3_TO_L));
has('Ex 16', bEx[16], PI * (4 ** 2 - 3 ** 2) * 70);
ok('Ex 17: quarter and eighth', [6 * 9 ** 2 / (6 * 18 ** 2), 9 ** 3 / 18 ** 3], [1 / 4, 1 / 8]);
is('Ex 17 answer says quarter and eighth', /quarter/.test(bEx[17]) && /eighth/.test(bEx[17]));
has('Ex 18', bEx[18].replace(/(\d) (\d{3})/g, '$1$2'), 2 * 20 ** 3, 150 * 20 ** 2 / CM2_PER_M2);

// the practice answers, read back out of the key rows rather than typed here
const keyRows = {};
const ansFrom = beyond.indexOf('c-stage__title">Answers');
for (const m of beyond.slice(ansFrom).matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= text(m[2]).replace(/(\d) (\d{3})/g, '$1$2').replace(/(\d) (\d{3})/g, '$1$2');
const row = (q) => {
  const [, n, p] = String(q).match(/^(\d+)([a-d]?)$/);
  const r = keyRows[n] || '';
  if (!p) return r;
  const m = r.match(new RegExp(`\\(${p}\\)([^(]*(?:\\([^a-d][^)]*\\)[^(]*)*)`));
  return m ? m[1] : '';
};
const says = (q, ...vals) => has(`key ${q}`, row(q), ...vals);
says(20, rhombus(18, 11));
says(21, 0.35 * M3_TO_L);
says(22, 432 / 36);
says(23, 450 / ((30 + 20) / 2));
says(24, 14 / 2, tsaCyl(7, 6));
{ const wall = 6 * CM_PER_M * 3 * CM_PER_M * 24, brick = 24 * 12 * 8; says(25, wall, brick, wall / brick); }
{ const r = 88 / csa(1, 14); says(26, r, volCyl(r, 14)); }
{ const n = 30 * 25 * 10 / (1.5 * 1.25 * 0.5); says(27, 30 * 25 * 10, 1.5 * 1.25 * 0.5, n, 30 / 1.5, 25 / 1.25, 10 / 0.5); ok('Q27: fit exactly', (30 / 1.5) * (25 / 1.25) * (10 / 0.5), n); }
says(28, tsaCyl(3.5, 4), volCyl(3.5, 4), volCyl(3.5, 4) * M3_TO_L);
says(29, trap(48, 32, 30), 100, trap(48, 32, 30) - 100, (trap(48, 32, 30) - 100) * 15);
says('30a', round(volCyl(0.7, 4), 2), Math.round(volCyl(0.7, 4) * M3_TO_L));
says('30b', 3 * 2 * 1.5, 3 * 2 * 1.5 * M3_TO_L);
says('30c', round(1.2 ** 3, 3), Math.round(1.2 ** 3 * M3_TO_L), 3 * 2 * 1.5 * M3_TO_L - Math.round(1.2 ** 3 * M3_TO_L));
is('Q30: the roof tank fits in the sump', 1.2 ** 3 < 9);
says('31a', walls(15, 10, 5));
{ const paint = walls(15, 10, 5) - 3 * 2 * 1 - 4 * 2 * 1.75 + 15 * 10; says('31b', 3 * 2 * 1, 4 * 2 * 1.75, 15 * 10, paint); says('31c', paint / 10, paint / 10 * 180); }
// the case tables print the values the key uses
is('Q30 table', /radius 0\.7 m, length 4 m/.test(text(beyond)) && /3 m by 2 m by 1\.5 m/.test(text(beyond)) && /edge 1\.2 m/.test(text(beyond)));
is('Q31 table', /15 m long, 10 m broad, 5 m high/.test(text(beyond)) && /3, each 2 m by 1 m/.test(text(beyond)) && /4, each 2 m by 1\.75 m/.test(text(beyond)) && /covers 10 m²; ₹180/.test(text(beyond)));

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] = m[2];
const optsOf = (n) => { const q = qs[n] || ''; const i = q.indexOf('c-parts--alpha'); return i < 0 ? [] : [...q.slice(i).matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => text(x[1]).trim()); };
const num = (s) => Number(s.replace(/\$/g, '').replace(/ (cm|m|litres).*$/, '').replace(/\s/g, ''));
const key = {};
{ const a = beyond.indexOf('<ol class="c-answers">'); for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2]; }

const eq = (v) => (o) => o.map(num).map(x => near(x, v));
const solve = {
  1: eq(trap(14, 6, 7)),
  2: eq(rhombus(14, 9)),
  3: eq(6 * 11 ** 2),
  4: eq(volCyl(7, 5)),
  5: eq(0.75 * M3_TO_L),
  6: (o) => { // evaluate each formula at a room 5 by 4 by 3 against the walls counted one by one
    const [l, b, h] = [5, 4, 3], w = l * h + l * h + b * h + b * h;
    return o.map(s => { const e = s.replace(/\$/g, '').replace(/(\d|\))\(/g, '$1*(').replace(/([lbh\)])(?=[lbh(])/g, '$1*').replace(/([lbh])(?=[lbh])/g, '$1*'); return near(Function('l', 'b', 'h', `return ${e}`)(l, b, h), w); });
  },
  7: (o) => { const f = volCyl(0.5, 2) / volCyl(1, 1); return o.map(s => ({ 'stays the same': 1, 'is doubled': 2, 'is quartered': 0.25, 'is halved': 0.5 })[s] === f); },
  8: eq(csa(3.5, 10)),
  9: eq((12 / 3) ** 3),
  10: (o) => o.map(s => near(num(s), 2.5 * 2 * 1.2 * M3_TO_L)),
  11: eq(12 ** 2 / 2),
  12: eq(2 * 91 / 7),
  13: eq(6 * Math.round(Math.cbrt(2744)) ** 2),
  14: (o) => o.map(s => { const [a, b] = s.replace(/\$/g, '').split(':').map(Number); return near(a / b, 2 ** 3 / 5 ** 3); }),
  15: eq(volCyl(44 / (2 * PI), 12)),
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Q${q}: the right option`, right, [key[q]]);
}
// the distractors the answers page explains are what it says they are
ok('Q1 distractors', [(14 + 6) * 7, 14 * 7 / 2, 14 * 7], [140, 49, 98]);
ok('Q3 distractors', [11 ** 2, 11 ** 3, 4 * 11 ** 2], [121, 1331, 484]);
ok('Q4 distractors', [csa(7, 5), volCyl(7, 5) / 2, 2 * volCyl(7, 5)], [220, 385, 1540]);
ok('Q8 distractors', [PI * 3.5 * 10, volCyl(3.5, 10), tsaCyl(3.5, 10)], [110, 385, 297]);
ok('Q13 distractors', [14 ** 2, 4 * 14 ** 2], [196, 784]);
{ const r = 12 / (2 * PI); ok('Q15 distractors', [44 * 12, volCyl(r, 44), volCyl(7, 12) / 2], [528, 504, 924]); }
// assertion-reason: [A true, R true, R explains A]
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  16: [6 * 4 ** 2 > 4 ** 3, [1, 2, 3, 4, 5, 5.9].every(a => 6 * a * a > a ** 3) && 6 * 36 === 6 ** 3, true],
  17: [near(walls(5, 4, 3), 2 * (5 * 3) + 2 * (4 * 3)), true, false],
  18: [near(volCyl(7, 2), 308), near(csa(7, 2), volCyl(7, 2)), false],
  19: [tsaCuboid(2, 2, 2) === 2 * tsaCuboid(1, 1, 1), true, false],
};
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
const letters = Object.entries(key).filter(([n]) => n <= 15).map(([, l]) => l);
is(`MCQ key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-19', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(19)].map((_, i) => i + 1));
ok('practice runs to 31', Math.max(...Object.keys(qs).map(Number)), 31);

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
const mdLine = answersMd.slice(answersMd.indexOf('as the key prints it'));
for (const m of mdLine.slice(0, 300).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2];
ok('ANSWERS.md key matches the page', mdKey, key);
// and its practice working carries the same values as the page's rows
const pr = mdItems('### Stage 3 · Practice');
for (const q of [20, 21, 22, 23, 24, 25, 26, 27, 28, 29]) {
  const nums = (keyRows[q].match(/\d+(\.\d+)?/g) || []).filter(n => Number(n) > 1);
  const t = (pr[q] || '').replace(/(\d) (\d{3})/g, '$1$2').replace(/(\d) (\d{3})/g, '$1$2');
  const last = nums[nums.length - 1];
  is(`ANSWERS.md Q${q} ends at the page's ${last}: "${t.slice(0, 100)}"`, new RegExp(`(^|[^\\d.])${last.replace('.', '\\.')}([^\\d]|$)`).test(t));
}

/* ---- report ---------------------------------------------------- */

console.log(`A  ${spans} identities evaluated; ${solved} one-unknown equations solved; ${skipped.length} spans not pure arithmetic, skipped`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
