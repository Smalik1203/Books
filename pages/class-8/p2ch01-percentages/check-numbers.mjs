#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed from the question's own data and compared with what is on the
   page or in ANSWERS.md.

     node pages/class-8/p2ch01-percentages/check-numbers.mjs [--skipped]

   Four parts:
     A  every identity set as maths, on every page and in ANSWERS.md, whose
        sides all evaluate to numbers. A side written as n% may be read as n
        or as n/100, whichever the line means. A side printed with decimals
        is allowed to be that value rounded to its printed places, and no
        more; a side printed as a whole number must be exact.
     B  the claims A cannot check: values printed outside a single span
        (money after a rupee sign, table rows, figure labels, words), and the
        practice answers, read back out of the answer key part by part
     C  every multiple-choice and assertion-reason question: exactly one
        option is right, and it is the one the key prints
     D  ANSWERS.md prints the same key as the page, and its exercise answers
        say what computation says

   Exits non-zero if anything does not hold up. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
let pass = 0;
const fails = [];
const tidy = (x) => JSON.stringify(x, (k, v) => typeof v === 'number' ? +v.toFixed(9) : v);
const ok = (what, got, want) => {
  if (tidy(got) === tidy(want)) pass++;
  else fails.push(`${what}\n      computed ${JSON.stringify(got)}\n      printed  ${JSON.stringify(want)}`);
};
const lit = (v) => (typeof v === 'number' ? String(+v.toFixed(9)) : String(v));
const is = (what, cond) => { if (cond) pass++; else fails.push(what); };

/* ---- arithmetic helpers --------------------------------------- */

const r2 = (x) => Math.round(x * 100) / 100;                // to the paisa
const r1 = (x) => Math.round(x * 10) / 10;                  // one decimal place
const pct = (part, whole) => part / whole * 100;
const near = (a, b) => Math.abs(a - b) < 1e-9;
// money as the book prints it: 18,005 or 1,769.60
const money = (x, paise = !Number.isInteger(r2(x))) =>
  (paise ? r2(x).toFixed(2) : String(Math.round(x))).replace(/\B(?=(\d{3})+(?!\d))(?=\d*(\.|$))/g, ',');

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
// one line of plain text: tags gone, maths delimiters gone, {,} as a comma
// the no-break span round a rupee amount is not a word boundary
const text = (s) => s.replace(/<span class="nb">([^<]*)<\/span>/g, '$1').replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-')
  .replace(/\{,\}/g, ',').replace(/\$/g, '').replace(/\\,/g, '').replace(/\\%/g, '%').replace(/\s+/g, ' ');
const bodyText = text(body), beyondText = text(beyond);
const has = (where, src, re) => is(`${where}: expected to print ${re}`, re.test(src));

/* ---- A. every identity ---------------------------------------- */

// join what the book splits: "$25\%$ of $120 = ...$" and "... = $ ₹$130$"
function normalise(src) {
  return src
    .replace(/<span class="nb">([^<]*)<\/span>/g, '$1')   // the no-break rupee span
    .replace(/\$\$/g, '$')
    .replace(/\$([^$]*?)\\%\$ of \$/g, (m, a) => '$' + a + '\\% \\times ')
    .replace(/=\s*\$\s*₹\$/g, () => '= ');
}

// LaTeX to [expression, percent?, decimals] or null when not pure arithmetic
function toExpr(side) {
  side = side.trim().replace(/,\s*$/, '');
  // 90.90... is a value cut short, not rounded
  const cut = /\\ldots/.test(side);
  side = side.replace(/\\ldots/g, '');
  const percent = /\\%$/.test(side);
  side = side.replace(/\\%$/, '');
  const lit = side.replace(/\{,\}/g, '').match(/^\d+\.(\d+)$/);
  const decimals = lit ? lit[1].length : 0;
  let s = side
    .replace(/\{,\}/g, '')
    .replace(/\\%/g, '/100')
    .replace(/\\left|\\right/g, '')
    .replace(/\\mathbf\{([^{}]+)\}/g, '$1')
    .replace(/(\d)\\[td]?frac(\d)(\d)/g, '($1+$2/$3)')
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\[td]?frac(\d)(\d)/g, '(($1)/($2))')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\\[,;: ]|\\quad|\\qquad/g, '')
    .replace(/\^\{([^{}]+)\}/g, '**($1)').replace(/\^(\d)/g, '**$1')
    .replace(/\s+/g, '');
  if (!s || !/^[-+*/().0-9]+$/.test(s)) return null;
  s = s.replace(/\)\(/g, ')*(');
  return { s, percent, decimals, cut };
}
const evalExpr = (e) => { try { return Function(`"use strict";return (${e})`)(); } catch { return NaN; } };
// does a printed side agree with the value v?
const agrees = (side, v) => {
  const n = evalExpr(side.s);
  if (side.cut) {                                   // n must be v with its tail cut off
    const step = 10 ** -side.decimals;
    return (v - n >= -1e-9 && v - n < step) || (side.percent && v * 100 - n >= -1e-9 && v * 100 - n < step);
  }
  const tol = side.decimals > 0 ? 0.5 * 10 ** -side.decimals + 1e-9 : 1e-9;
  return Math.abs(n - v) <= tol || (side.percent && Math.abs(n - v * 100) <= tol);
};

let spans = 0; const skipped = [];
const sources = [...pages.map(f => [f, html[f]]), ['ANSWERS.md', answersMd]];
for (const [f, raw] of sources) {
  const src = normalise(raw);
  for (const m of src.matchAll(/\$([^$]+)\$/g)) {
    const span = m[1];
    if (!/=|\\approx/.test(span) || /</.test(span)) continue;
    const sides = span.split(/=|\\approx/).map(s => s.trim()).filter(Boolean);
    if (sides.length < 2) continue;
    let vals = sides.map(toExpr);
    if (vals.filter(Boolean).length >= 2) vals = vals.filter(Boolean);
    if (vals.some(v => !v) || vals.length < 2) { skipped.push(`${f}: $${span.trim()}$`); continue; }
    // the reference value: the first side that is not a rounded literal
    const ref = vals.find(v => !v.percent && v.decimals === 0) || vals.find(v => !v.percent);
    const v = ref ? evalExpr(ref.s) : NaN;
    if (!Number.isFinite(v)) { skipped.push(`${f}: $${span.trim()}$`); continue; }
    spans++;
    const bad = vals.filter(x => x !== ref && !agrees(x, v));
    if (bad.length) fails.push(`${f}: $${span.trim()}$ — ${bad.map(b => b.s).join(', ')} does not equal ${v}`);
    else pass++;
  }
}

/* ---- B. claims arithmetic alone does not check ---------------- */

// --- the body
{ // the table of fractions worth knowing by sight: fraction = decimal, and the percentage
  const rows = [...body.matchAll(/work__label--wide">\$\\dfrac(\d|\{\d+\})(\d|\{\d+\}) = ([\d.]+)(?:\\ldots)?\$<\/span>\s*<span>\$([\d.]+)/g)];
  ok('the fractions table has six rows', rows.length, 6);
  for (const [, a, b, dec, p] of rows) {
    const v = Number(a.replace(/[{}]/g, '')) / Number(b.replace(/[{}]/g, ''));
    is(`table: ${a}/${b} = ${dec}`, Math.abs(v - Number(dec)) < 0.5 * 10 ** -(dec.split('.')[1] || '').length + 1e-12);
    is(`table: ${a}/${b} is ${p}%`, Math.abs(v * 100 - Number(p)) < 0.5 * 10 ** -((p.split('.')[1] || '').length) + 1e-9);
  }
}
{ // the badam mixes: grams to percentages, and each column adds up
  const rows = [...body.matchAll(/Mix A \$\\ (\d+)\$ g \$\\to (\d+)\\%\$ &nbsp;&nbsp; Mix B \$\\ (\d+)\$ g \$\\to (\d+)\\%\$/g)];
  ok('badam rows', rows.length, 4);
  for (const [, ga, pa, gb, pb] of rows) { ok(`badam A ${ga} g`, pct(+ga, 150), +pa); ok(`badam B ${gb} g`, pct(+gb, 200), +pb); }
  ok('badam grams add to the packets', [rows.reduce((s, r) => s + +r[1], 0), rows.reduce((s, r) => s + +r[3], 0)], [150, 200]);
  ok('badam percentages add to 100', [rows.reduce((s, r) => s + +r[2], 0), rows.reduce((s, r) => s + +r[4], 0)], [100, 100]);
}
is('Madhav ate more: 35% of 95 > 25% of 120', 0.35 * 95 > 0.25 * 120);
is('with 150 g Madhu ate more, so the answer changes', 0.25 * 150 > 0.35 * 95);
ok('Science better by three and a half', pct(70, 80) - pct(42, 50), 3.5);
ok('Eesha lost 8 and 10 marks', [50 - 42, 80 - 70], [8, 10]);
ok('millet and water', [r1(pct(2, 9)), r1(100 - pct(2, 9))], [22.2, 77.8]);
is('millet lies between a fifth and a quarter', pct(2, 9) > 20 && pct(2, 9) < 25);
ok('tomatoes rise by 12', 42 - 30, 12);
ok('the cinema fall is 60% of 100 and 37.5% of 160', [pct(60, 100), pct(60, 160)], [60, 37.5]);
ok('multipliers in the key idea', [1 + 8 / 100, 1 - 20 / 100, 1 - 37.5 / 100], [1.08, 0.8, 0.625]);
ok('Example 4 is 160 short', 25000 - 25000 * 1.08 * 0.92, 160);
has('Example 4', bodyText, /₹27,000 after the rise, ₹24,840 after the cut/);
ok('Example 5: 25% off the selling price, and the profit on it', [50 * 0.75, 50 - 37.5, (50 - 37.5) / 37.5], [37.5, 12.5, 1 / 3]);
ok('Sweater: profit and discount', [430 - 300, 480 - 430, r1(pct(130, 300)), r1(pct(50, 480))], [130, 50, 43.3, 10.4]);
has('Fig. 1.4 labels', body, /profit ₹130<\/text>[\s\S]*discount ₹50<\/text>/);
ok('Example 6', [10 * 35, 350 - 300, r1(pct(50, 350))], [350, 50, 14.3]);
ok('the GST bill', [2 * 600, 1200 * 0.05, 1200 * 1.05], [1200, 60, 1260]);
has('the GST bill prints 1,200.00, 60.00, 1,260.00', bodyText, /₹1,200\.00[\s\S]*₹60\.00[\s\S]*₹1,260\.00/);
{ const paid = 6000 + 3 * 6000 * 0.1, left = 6000 * 1.1 ** 3;
  ok('interest over three years', [money(paid), money(left), Math.round(left - paid)], ['7,800', '7,986', 186]);
  has('Fig. 1.5 labels', body, new RegExp(`₹${money(paid)}</text>[\\s\\S]*₹${money(left)}</text>`)); }
ok('ten per cent twice', r2(1.1 * 1.1), 1.21);
{ const tv = 21000 * 0.95 ** 3;
  ok('Example 7: after one year, and after three', [money(21000 * 0.95), tv, money(tv, false)], ['19,950', 18004.875, '18,005']);
  has('Example 7 answer, rounding stated', bodyText, new RegExp(`₹${money(21000 * 0.95)} after one year; ₹${money(tv, false)} after three, to the nearest rupee`)); }
is('three years of 5% is not 15%', !near(1 - 0.95 ** 3, 0.15));
ok('Surbhi', [1.5 * 0.5, 12000 / 0.75, 12000 / 0.75 - 12000, r1(100 * 0.5 / 1.5)], [0.75, 16000, 4000, 33.3]);
has('Surbhi prints 16,000 and 4,000', bodyText, /₹16,000 and she is ₹4,000 down/);
ok('Ariba and Arun', [r1(pct(100, 120)), r1(100 - pct(100, 120))], [83.3, 16.7]);
ok('summary: 84 and 87.5', [pct(42, 50), pct(70, 80)], [84, 87.5]);

// --- Stage 1
ok('Stage 1 Q1', r2(1.6 * 0.75), 1.2);
ok('Stage 1 Q2: a decrease of 9%', Math.round((1 - 1.3 * 0.7) * 100), 9);
ok('Stage 1 Q3', 0.2 * 60 + 0.3 * 40, 24);
ok('Stage 1 Q4', [560 / 1.12, money(560 * 0.88), money(560 / 1.12 - 560 * 0.88)], [500, '492.80', '7.20']);
has('Stage 1 Q4 prints 492.80 and 7.20', beyondText, /₹492\.80[\s\S]{0,200}₹7\.20/);
ok('Stage 1 Q5', [200 * 0.15, 30 / 0.2, 200 - 30 / 0.2], [30, 150, 50]);
{ const c1 = 990 / 1.1, c2 = 990 / 0.9;
  ok('Stage 1 Q6', [Math.round(c1), Math.round(c2), Math.round(c1 + c2), 1980, Math.round(c1 + c2 - 1980), Math.round(pct(c1 + c2 - 1980, c1 + c2))], [900, 1100, 2000, 1980, 20, 1]);
  has('Stage 1 Q6 prints the costs', beyondText, /c = ₹900[\s\S]*c = ₹1,100[\s\S]*cost ₹2,000, sold ₹1,980/); }
ok('Stage 1 Q7', [1 / 1.6, (1 - 1 / 1.6) * 100], [0.625, 37.5]);
{ const yr = (t) => 10000 * 1.1 ** t;
  ok('Stage 1 Q8: first year past 15,000', [1, 2, 3, 4, 5, 6].find(t => yr(t) > 15000), 5);
  ok('Stage 1 Q8: the table', [1.1 ** 3, money(yr(3)), money(yr(4)), money(yr(5), false)], [1.331, '13,310', '14,641', '16,105']);
  ok('Stage 1 Q8: paid out reaches 15,000 in exactly five', 10000 + 5 * 1000, 15000);
  ok('Stage 1 Q8: a year later', [money(10000 + 6 * 1000), money(yr(6), false)], ['16,000', '17,716']);
  has('Stage 1 Q8 prints 14,641, 16,105 and the year-six pair', beyondText, /₹14,641 — still short[\s\S]*₹16,105, to the nearest rupee[\s\S]*₹16,000 and ₹17,716, to the nearest rupee/); }

// --- Stage 2
const example = (n) => { const i = beyond.indexOf(`>Example ${n}<`); return text(beyond.slice(i, beyond.indexOf('c-example__tab', i + 20) >>> 0 || undefined)); };
has('Ex 1', example(1), /87\.5%, 4\.5% and 225%/);
has('Ex 2', example(2), /16 over|\\dfrac\{16\}\{25\} and \\dfrac\{1\}\{250\}/);
ok('Ex 2: 0.4% in lowest terms', [4 / 1000 === 1 / 250, 64 / 100 === 16 / 25], [true, true]);
ok('Ex 3', 0.36 * 1250, 450);
ok('Ex 4', [369 / 0.45, 369 / 0.45 - 369], [820, 451]);
has('Ex 4 answer', example(4), /820 seats, of which 451 are empty/);
ok('Ex 5', [pct(7, 20), 100 - pct(7, 20), r2(0.65 * 3)], [35, 65, 1.95]);
{ const water = 400 * 0.88, s = water / 0.8;
  ok('Ex 6', [water, s, s - 400, 400 * 0.12 + (s - 400), pct(400 * 0.12 + (s - 400), s)], [352, 440, 40, 88, 20]); }
ok('Ex 7', [pct(312, 480), pct(406, 580), 480 - 312, 580 - 406], [65, 70, 168, 174]);
has('Ex 7 prints the homes without a tap', example(7), /174 against 168/);
ok('Ex 8', [640 - 544, pct(96, 640), 640 * 0.85], [96, 15, 544]);
ok('Ex 9', r2(595 / 0.85), 700);
ok('Ex 10', [r2(1.2 * 1.05), Math.round((1.2 * 1.05 - 1) * 100)], [1.26, 26]);
has('Ex 10 answer', example(10), /single rise of 26%, not 25%/);
ok('Ex 11', [2400 * 1.25, 3000 * 0.92, 2760 - 2400, pct(360, 2400)], [3000, 2760, 360, 15]);
has('Ex 11 answer', example(11), /₹2,760, a profit of 15%/);
ok('Ex 12', [15000 * 0.9, r2(13500 * 0.18), r2(13500 * 1.18)], [13500, 2430, 15930]);
has('Ex 12 answer', example(12), /Answer ₹15,930/);
ok('Ex 13', [r2(1088 / 0.85), r2(1280 * 1.1)], [1280, 1408]);
has('Ex 13 answer', example(13), /cost ₹1,280; it should be sold for ₹1,408/);
{ const paid = 12000 + 3 * 600, left = 12000 * 1.05 ** 3;
  ok('Ex 14', [12000 * 0.05, paid, money(left), money(left - paid)], [600, 13800, '13,891.50', '91.50']);
  has('Ex 14 answer', example(14), /₹13,800 and ₹13,891\.50, which are ₹91\.50 apart/); }
ok('Ex 15', [80000 * 0.8, r2(80000 * 0.64), 80000 - 51200, pct(28800, 80000)], [64000, 51200, 28800, 36]);
has('Ex 15 answer', example(15), /₹51,200; it has lost 36%, not 40%/);
ok('Ex 16', [r2(25000 * 1.04), r2(25000 * 1.04 * 1.04)], [26000, 27040]);
has('Ex 16 answer', example(16), /27,040 people/);
ok('Ex 17', [100 + 150, pct(250 - 100, 250)], [250, 60]);
ok('Ex 18', [r2(1.17 / 0.9), r2(130 * 0.9)], [1.3, 117]);
is('Ex 18: adding 10 and 17 falls short', 1.27 * 0.9 < 1.17);

// --- the practice answers, read back out of the key rather than typed here
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">([\d, ]+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= text(m[2]);
const row = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const r = keyRows[n] || '';
  if (!part) return r;
  const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\)|$)`));
  return m ? m[1] : '';
};
const says = (q, ...vals) => { for (const v of vals) is(`key ${q} should say ${v}: "${row(q)}"`, new RegExp(`(^|[^\\d.,])${lit(v).replace(/[.]/g, '\\.')}(?!\\d|\\.\\d)`).test(row(q))); };
says(19, 7, 37.5);
says(20, 1 - 12 / 100);
says(21, pct(36, 45));
says(22, 4410 / 1.05, '4,200', r2(4200 * 1.2), '5,040');
says(23, 102 - 96, pct(102 - 96, 96));
says(24, 100 - 72, 196 / 0.28);
{ const left = 15000 * 1.08 ** 2, paid = 15000 + 2 * 1200;
  says(25, money(left), r2(left - paid)); }
{ const cost = 80 * 12, a = 50 * 12 * 1.25, b = 30 * 12 * 0.9, got = a + b;
  says(26, cost, a, b, money(got), got - cost, pct(got - cost, cost), r1(pct(got - cost, cost))); }
{ const water = 60 * 0.2, total = water / 0.12;
  says(27, water, total, total - 60); }
{ const p = 64000 * 1.05 * 1.08;
  says(28, money(p), r1((1.05 * 1.08 - 1) * 100)); }
{ const items = [[1200, 15], [400, 10], [250, 20]].map(([m, d]) => r2(m * (1 - d / 100)));
  const paid = items.reduce((s, x) => s + x, 0), marked = 1850;
  says('29a', ...items.map(x => money(x)));
  says('29b', paid, money(paid * 1.12));
  says('29c', money(marked), money(paid), marked - paid, r1(pct(marked - paid, marked)));
  ok('Q29: the marked prices in the table add to 1,850', 1200 + 400 + 250, marked); }
{ const y2 = 27000 * 0.08, end2 = 27000 + y2;
  ok('Q30: the table row for year 1', [25000 * 0.08, 25000 * 1.08], [2000, 27000]);
  says('30a', '27,000', y2, money(end2));
  says('30b', money(25000 + 2 * 2000), end2 - 29000);
  says('30c', money(end2 * 1.08)); }

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) {
  if (!/c-practice__num/.test(beyond)) continue;
  qs[Number(m[1] || 1)] ??= m[2];
}
const optsOf = (n) => [...(qs[n] || '').replace(/^[\s\S]*?<ol class="c-parts c-parts--alpha[^"]*">/, '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => text(x[1]).trim());
const num = (s) => { const t = s.replace(/[₹%]/g, '').replace(/,/g, '').trim(); const f = t.match(/^\\dfrac\{(\d+)\}\{(\d+)\}$/); return f ? f[1] / f[2] : Number(t); };
const key = {};
{ const i = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(i, beyond.indexOf('</ol>', i))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2]; }

const eq1 = (a, b) => Math.abs(a - b) < 0.05 + 1e-9;           // options are printed to one decimal place at most
const solve = {
  1: o => o.map(num).map(v => near(v, pct(7, 20))),
  2: o => o.map(num).map(v => near(v, 36 / 100)),
  3: o => o.map(num).map(v => near(v, 0.18 * 450)),
  4: o => o.map(num).map(v => near(v * 0.3, 42)),
  5: o => o.map(num).map(v => eq1(v, pct(80 - 60, 60))),
  6: o => o.map(num).map(v => eq1(v, pct(80 - 60, 80))),
  7: o => o.map(num).map(v => near(v, 1 + 35 / 100)),
  8: o => o.map(num).map(v => near(v, pct(3, 3 + 5))),
  9: o => o.map(num).map(v => eq1(v, pct(300 - 250, 250))),
  10: o => o.map(num).map(v => near(v, 800 * 0.85)),
  11: o => o.map(num).map(v => near(v, (1.2 * 1.2 - 1) * 100)),
  12: o => o.map(num).map(v => near(v * 1.12, 22400)),
  13: o => o.map(num).map(v => near(v, (1 - 0.8 * 0.9) * 100)),
  14: o => o.map(num).map(v => near(v, 4000 * 1.05 ** 2)),
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options: ${JSON.stringify(o)}`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Q${q}: the right option`, right, [key[q]]);
}
// assertion-reason: [A true, R true, R explains A]
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  15: [1.5 * 7 > 7, true, true],
  16: [near(0.2 * 500, 100), false, false],
  17: [near(0.9 * 0.9, 0.8), near(0.9 * 0.9, 0.81), false],
  18: [near(1000 * 1.1 * 1.1, 1210), near(0.1 * 1000, 100), false],
};
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
has('Q16 prints its numbers', text(qs[16] || ''), /20% on a cost of ₹500 is ₹100/);
has('Q18 prints its numbers', text(qs[18] || ''), /₹1,000 left at 10%[\s\S]*₹1,210[\s\S]*10% of ₹1,000 is ₹100/);
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-18', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(18)].map((_, i) => i + 1));
ok('practice runs 1 to 30 with no gap or repeat', Object.keys(qs).map(Number).sort((a, b) => a - b), [...Array(30)].map((_, i) => i + 1));

// exercise numbering in the body: each set runs 1, 2, 3 ... with no repeat
{ const sets = body.split(/c-practice__head">/).slice(1);
  sets.forEach((s, i) => {
    const starts = [1, ...[...s.split(/c-practice__head">/)[0].matchAll(/data-start="(\d+)"/g)].map(m => +m[1])];
    ok(`Exercise Set 1.${i + 1} numbering`, starts, starts.map((_, k) => k + 1));
  });
  ok('seven exercise sets', sets.length, 7); }

/* ---- D. ANSWERS.md ------------------------------------------- */

const mdKey = {};
{ const i = answersMd.indexOf('as the key prints it');
  for (const m of answersMd.slice(i, i + 400).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2]; }
ok('ANSWERS.md key matches the page', mdKey, key);

// ANSWERS.md, one exercise set at a time: item n of a section must say v
const mdSection = (head) => { const i = answersMd.indexOf(`### ${head}`); const j = answersMd.indexOf('\n#', i + 4); return answersMd.slice(i, j < 0 ? undefined : j); };
const mdItem = (head, n) => { const s = mdSection(head); const m = s.match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`)); return m ? m[1].replace(/\{,\}/g, ',').replace(/\s+/g, ' ') : ''; };
const mdSays = (head, n, ...vals) => { const t = mdItem(head, n); for (const v of vals) is(`ANSWERS.md ${head} Q${n} should say ${v}`, new RegExp(`(^|[^\\d.,])${lit(v).replace(/[.]/g, '\\.')}(?!\\d|\\.\\d)`).test(t)); };
const bold = (head, n) => [...mdItem(head, n).matchAll(/\*\*([^*]+)\*\*/g)].map(m => m[1]);

mdSays('Exercise Set 1.1', 1, pct(3, 5), pct(9, 20), pct(7, 14), pct(72, 150));
mdSays('Exercise Set 1.1', 3, pct(15, 25));
mdSays('Exercise Set 1.1', 4, pct(15, 80), 100 - pct(15, 80));
mdSays('Exercise Set 1.2', 1, 0.25 * 160, 0.16 * 250, r2(0.62 * 360), r2(0.07 * 10));
mdSays('Exercise Set 1.2', 2, 12 / 0.2, 75 / 0.6, r2(91 / 1.4));
mdSays('Exercise Set 1.2', 3, pct(2, 8), pct(7, 8));
mdSays('Exercise Set 1.2', 4, Math.round(500 * 2 / 9));
mdSays('Exercise Set 1.2', 5, 3600 / 100, 1000 / 100);
mdSays('Exercise Set 1.2', 6, 40 - 0.45 * 40 - 40 / 4);
mdSays('Exercise Set 1.3', 1, pct(27, 30) - pct(44, 50), pct(18, 25) - pct(27, 40));
is('Ex 1.3 Q1: the first of each pair is better', pct(27, 30) > pct(44, 50) && pct(18, 25) > pct(27, 40));
is('Ex 1.3 Q2: the first snack', pct(40, 250) > pct(60, 400));
mdSays('Exercise Set 1.3', 3, 100 - 48 - 27 - 16);
mdSays('Exercise Set 1.3', 4, r1(pct(33, 41)));
is('Ex 1.3 Q4: the first class, either way', pct(21, 25) > pct(33, 40) && pct(21, 25) > pct(33, 41));
mdSays('Exercise Set 1.4', 1, pct(92 - 80, 80), pct(2500 - 2000, 2500), pct(54 - 45, 45));
mdSays('Exercise Set 1.4', 2, 1.15, 0.85, 1 + 250 / 100, 0.98);
mdSays('Exercise Set 1.4', 3, 50 * 2.5, 250 - 100);
mdSays('Exercise Set 1.4', 4, money(500 * 1.2 * 0.8));
mdSays('Exercise Set 1.4', 5, 15 / 1.25);
mdSays('Exercise Set 1.5', 1, pct(60, 400), pct(25, 250), pct(450, 1800));
mdSays('Exercise Set 1.5', 2, money(4000 * 0.85), r1(pct(4000 * 0.85 - 3000, 3000)));
mdSays('Exercise Set 1.5', 3, 1080 / 1.2);
mdSays('Exercise Set 1.5', 4, money(r2(2400 * 1.18)), pct(2640 - 2400, 2400));
mdSays('Exercise Set 1.5', 5, 5000 * 0.8 - 4400 * 0.9);
is('Ex 1.5 Q5: the second shop is cheaper', 4400 * 0.9 < 5000 * 0.8);
mdSays('Exercise Set 1.6', 1, money(8000 + 2 * 800), money(r2(8000 * 1.1 ** 2)));
mdSays('Exercise Set 1.6', 2, money(5000 * 1.08 ** 3), money(r2(60000 * 0.9 ** 3)));
mdSays('Exercise Set 1.6', 3, r2(1250 * 0.9 ** 3), Math.floor(1250 * 0.9 ** 3));
{ const t = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].find(n => 1000 * 1.1 ** n >= 2000);
  mdSays('Exercise Set 1.6', 4, t, ...[1, 2, 3, 4, 5, 6, 7, 8].map(n => money(1000 * 1.1 ** n))); }
{ const g2 = 10000 * 1.12 ** 2 - (10000 + 2 * 1200), g3 = 10000 * 1.12 ** 3 - (10000 + 3 * 1200);
  mdSays('Exercise Set 1.6', 5, r2(g2), money(g3));
  is('Ex 1.6 Q5: the gap grows', g3 > g2); }
mdSays('Exercise Set 1.7', 1, money(800 * 1.25 * 0.75), (1 - 1.25 * 0.75) * 100);
mdSays('Exercise Set 1.7', 2, Math.round((1 - 1.4 * 0.6) * 100));
mdSays('Exercise Set 1.7', 3, r1(pct(100, 110)));
mdSays('Exercise Set 1.7', 4, (1 - 1 / 1.25) * 100, (1 - 1 / 2) * 100);
is('Ex 1.7 Q4: the rule 100M/(100+M) gives both', near(100 * 25 / 125, 20) && near(100 * 100 / 200, 50));
is('Think and Reflect: the order does not matter', near(1.2 * 0.8, 0.8 * 1.2));
{ const t = answersMd.slice(answersMd.indexOf('### Example 7'));
  is('ANSWERS.md carries the Example 7 correction', /\*\*₹18,005\*\*/.test(t)); }
// Stage 1 summary in ANSWERS.md
{ const s = mdSection('Stage 1'), items = (n) => (s.match(new RegExp(`\\n${n}\\. (.*)`)) || [])[1] || '';
  const say1 = (n, v) => is(`ANSWERS.md Stage 1 Q${n} should say ${v}`, items(n).includes(lit(v)));
  say1(1, `${Math.round((1.6 * 0.75 - 1) * 100)}\\%`); say1(2, `${Math.round((1 - 1.3 * 0.7) * 100)}\\%`);
  say1(3, `${0.2 * 60 + 0.3 * 40}\\%`); say1(4, `₹${lit(560 / 1.12)}`); say1(5, `${200 - 30 / 0.2} g`);
  say1(6, `₹${Math.round(990 / 0.9 + 990 / 1.1 - 1980)}`); say1(7, `${(1 - 1 / 1.6) * 100}\\%`); say1(8, 'Five years'); }
// ANSWERS.md practice rows agree with the key rows on the page
for (const q of [22, 24, 25, 26, 27, 28]) {
  const nums = (s) => [...s.replace(/,(?=\d{3})/g, '').matchAll(/\d+(?:\.\d+)?/g)].map(m => Number(m[0]));
  const page = new Set(nums(row(q)));
  const mdRow = (answersMd.slice(answersMd.indexOf('### Stage 3')).match(new RegExp(`\\n${q}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`)) || [])[1] || '';
  const boldNums = [...mdRow.matchAll(/\*\*([^*]+)\*\*/g)].flatMap(m => nums(m[1]));
  for (const v of boldNums) is(`ANSWERS.md practice Q${q}: ${v} is not in the page's key row`, page.has(v));
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
