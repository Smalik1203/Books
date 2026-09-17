#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed from the question's own data — ratios, products, shares, scales,
   angles — and compared with what is on the page.

     node pages/class-8/p2ch03-proportion/check-numbers.mjs [--skipped]

   Four parts:
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

// the body
is('batters 6:3 and 4:2 agree', proportional(6, 3, 4, 2) && reduce(6, 3).join() === '2,1');
is('12:10:8:6:4 reduces to 6:5:4:3:2', reduce(12, 10, 8, 6, 4).join() === '6,5,4,3,2');
is('8:4:2:1 is already simplest', reduce(8, 4, 2, 1).join() === '8,4,2,1');
is('Puneet halves the spice mix', [8, 4, 2, 1].map(x => x / 2).join() === '4,2,1,0.5');
is('Ex 1: 9:15 and 21:35 both reduce to 3:5', proportional(9, 15, 21, 35) && reduce(9, 15).join() === '3,5' && reduce(21, 35).join() === '3,5');
ok('Ex 2: workers', 5 * 18000 / 4500, 20);
ok('Ex 3: paint', [...share(10 / 5 * 10, 2, 3, 5), 10 / 5 * 10], [4, 6, 10, 20]);
ok('Ex 4: concrete from three bags', [1, 1.5, 3].map(x => x * 3), [3, 4.5, 9]);
is('Ex 4: 1:1.5:3 is 2:3:6', proportional(1, 1.5, 2, 3) && proportional(1.5, 3, 3, 6));
ok('Ex 5: 110 units', share(110, 1, 1.5, 3), [20, 30, 60]);
ok('Ex 6: angles 1:3:5', share(180, 1, 3, 5), [20, 60, 100]);
ok('Ex 7: first map', 5.5 * kmPerCm(6000000), 330);
ok('Ex 7: second map', [330 / 22, 330 / 22 * 100000], [15, 1500000]);
ok('sweets 12 in 2:1', share(12, 2, 1), [8, 4]);
ok('1:60,00,000 is 60 km a cm', kmPerCm(6000000), 60);
ok('pie: grades', [12, 10, 8, 6, 4].map(n => deg(n, 40)), [108, 90, 72, 54, 36]);
ok('pie: grades after reducing', [360 / 20, reduce(12, 10, 8, 6, 4).reduce((a, b) => a + b)], [18, 20]);
is('pie: A is under a third, A and B over half', deg(12, 40) < 120 && deg(12, 40) + deg(10, 40) > 180);
ok('pie: A is 30%', 100 * 12 / 40, 30);
ok('four ways of 90 km', [5, 15, 30, 60].map(v => 90 / v), [18, 6, 3, 1.5]);
ok('wrong proportion gives six hours', 3 * 60 / 30, 6);
ok('Ex 8', 20 * 4 / 10, 8);
ok('Ex 9', 2 * 18 / 4, 9);
ok('Ex 10', [80 + 20, 80 * 15 / 100], [100, 12]);
is('Ex 10: a quarter more, a fifth less', near(20 / 80, 1 / 4) && near((15 - 12) / 15, 1 / 5));
is('Ram and Shyam: 5/3 units, 36 minutes', near(1 + 1 / 1.5, 5 / 3) && near(60 / (1 + 1 / 1.5), 36));
is('Ram and Shyam: not the average', (1 + 1.5) / 2 === 1.25);

// Stage 1
ok('S1 Q1: rice', [750 / 6, 750 / 6 * 8], [125, 1000]);
ok('S1 Q2: wall', [12 * 10, 120 / 15], [120, 8]);
is('S1 Q2: a quarter more workers, a fifth off the time', near((15 - 12) / 12, 1 / 4) && near((10 - 8) / 10, 1 / 5));
ok('S1 Q3: two maps', [6 * 50000 / 100000, 6 * 50000 / 200000], [3, 1.5]);
ok('S1 Q4: slice of 150', [150 / 360 * 720, Math.round(100 * 150 / 360)], [300, 42]);
is('S1 Q4: a right angle and a half is less than 150', 90 * 1.5 < 150);
ok('S1 Q4: 720 times 5/12 is 60 times 5', 720 / 12, 60);
ok('S1 Q5: fuel', [240 / 15, 240 / 15 * 105, 240 / 30 * 105 * 2], [16, 1680, 1680]);
is('S1 Q5: key says 1,680', /₹1,680/.test(beyondText));
ok('S1 Q6: taps', [6 * 40, 6 * 40 / (6 - 2)], [240, 60]);
ok('S1 Q6: two left would give', 6 * 40 / 2, 120);
is('S1 Q6: page says a hundred and twenty', /given a hundred and twenty minutes/.test(beyondText));
{ const x = [...Array(50)].map((_, i) => i + 1).find(x => (5 * x + 6) * 4 === (7 * x + 6) * 3);
  ok('S1 Q7: numbers', [x, 5 * x, 7 * x, 5 * x + 6, 7 * x + 6], [6, 30, 42, 36, 48]); }
ok('S1 Q8: wheels', 35 * 60 / 21, 100);

// Stage 2
ok('Ex 1', [6 * 35, 15 * 14, ...reduce(6, 15), ...reduce(14, 35)], [210, 210, 2, 5, 2, 5]);
ok('Ex 2', 7 * 36 / 21, 12);
ok('Ex 3', 315 / 9 * 14, 490);
is('Ex 3: answer ₹490', /Answer ₹490/.test(beyondText));
ok('Ex 4', 1350 / 25 * 40, 2160);
ok('Ex 5', [1.2 / 3 * 4, 1.2 / 3 * 1, 1.2 / 3 * 8].map(v => Math.round(v * 1e9) / 1e9), [1.6, 0.4, 3.2]);
{ // Ex 6: the two batches, by matching quotients, and their simplest form
  const q = [[6, 4], [9, 6], [15, 10]].map(([x, y]) => x / y);
  ok('Ex 6: quotients', q, [1.5, 1.5, 1.5]);
  const g = (x, y) => (y ? g(y, x % y) : x);
  const g3 = (a, b, c) => { const k = g(g(a, b), c); return [a / k, b / k, c / k]; };
  ok('Ex 6: simplest forms, dividing by 3 and by 2', [g3(6, 9, 15), g3(4, 6, 10), g(g(6, 9), 15), g(g(4, 6), 10)], [[2, 3, 5], [2, 3, 5], 3, 2]); }
ok('Ex 7', share(3000, 3, 5, 7), [600, 1000, 1400]);
is('Ex 7: answer', /₹600, ₹1,000 and ₹1,400/.test(beyondText));
{ const [l, b] = share(84 / 2, 4, 3); ok('Ex 8', [l, b, l * b], [24, 18, 432]); }
ok('Ex 9', [kmPerCm(3000000), 7.5 * kmPerCm(3000000), 540 / kmPerCm(3000000)], [30, 225, 18]);
ok('Ex 10', [20 * 100 / 250, 0.48 * 250, 0.48 * 250 / 100], [8, 120, 1.2]);
ok('Ex 11', [480, 300, 240, 180].map(n => deg(n, 1200)), [144, 90, 72, 54]);
is('Ex 11: the groups make 1200', 480 + 300 + 240 + 180 === 1200);
ok('Ex 12', [72 / 360 * 1250, 72 / 360 * 100], [250, 20]);
ok('Ex 13', 40 * 6 / 48, 5);
is('Ex 14: products all 60', [[3, 20], [5, 12], [12, 5]].every(([x, y]) => x * y === 60));
ok('Ex 14', 60 / 4, 15);
ok('Ex 15', Math.round(1e9 / (1 / 10 + 1 / 15)) / 1e9, 6);
ok('Ex 16', Math.round(1 / (1 / 4 - 1 / 6)), 12);

// the practice answers, read back out of the key rather than typed here
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= text(m[2]);
const row = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const r = keyRows[n] || '';
  if (!part) return r;
  const m = r.match(new RegExp(`\\(${part}\\)([^(]*)`));
  return m ? m[1] : '';
};
const esc = (v) => String(v).replace(/[.$]/g, '\\$&');
const says = (q, ...vals) => { for (const v of vals) is(`key ${q} should say ${v}: "${row(q)}"`, new RegExp(`(^|[^\\d.,])${esc(v)}([^\\d]|$)`).test(row(q))); };
const money = (n) => '₹' + n.toLocaleString('en-IN');
{ const g = gcd(45, 120); says(20, 120, `${45 / g} : ${120 / g}`); }
says(21, 28 / 4, 28 / 4 * 11);
{ let n = 500000 * 1; says(22, '5,00,000'); is('Q22: 5 km in cm', n === 5 * 100000); }
{ const r = [1 / 2, 1 / 3, 1 / 4].map(x => x * 12); const s = share(6500, ...r);
  says(23, r.join(' : '), r.reduce((a, b) => a + b), money(6500 / 13), ...s.map(money)); }
says(24, 75 * 4, 75 * 4 / 5);
{ const x = [...Array(50)].map((_, i) => i + 1).find(x => (5 * x + 6) * 5 === (3 * x + 6) * 7);
  says(25, x, 5 * x, 3 * x, `${5 * x + 6} : ${3 * x + 6}`); is('Q25: 21:15 is 7:5', proportional(21, 15, 7, 5)); }
{ const save = 36000 - 9000 - 12000 - 6000; const d = [9000, 12000, 6000, save].map(n => deg(n, 36000));
  says(26, money(save), ...d.map(x => x + '°')); is('Q26: angles add to 360', d.reduce((a, b) => a + b) === 360); }
{ const job = 25 * 18, done = 25 * 6; says(27, job, done, job - done, 25 + 5, (job - done) / 30); }
{ const rate = 1 / 20 + 1 / 30 - 1 / 15; says(28, Math.round(1 / rate)); is('Q28: the tank fills', rate > 0); }
{ const k = kmPerCm(250000); says(29, k, 2 * k, 1.6 * k, 2 * k * 1.6 * k); }
{ const f = 64 / 40; says('30a', f, 5 * f, 30 * f, 800 * f); says('30b', 12 / 5 * 40);
  const g = gcd(5000, 800); says('30c', `${5000 / g} : ${800 / g}`); }
{ const t = [[40, 9], [60, 6], [90, 4]]; is('Q31: table products are 360', t.every(([s, h]) => s * h === 360));
  says('31a', 360); is('Q31a says inverse', /inverse/.test(row('31a')));
  says('31b', 360 / 72); says('31c', 4 + 48 / 60, 360 / (4 + 48 / 60)); }

// every worked example's rows, read off the page: the numbers each row
// prints (outside and inside maths) must be exactly the ones computed here
const exRows = (src) => {
  const out = {};
  for (const m of src.matchAll(/c-example__tab">Example (\d+)<\/div>([\s\S]*?)(?=c-example__tab"|$)/g)) {
    out[m[1]] = {};
    for (const r of m[2].matchAll(/<span class="work__label">(Step \d+|Answer)<\/span>\s*<span>([\s\S]*?)<\/span>/g))
      out[m[1]][r[1]] = [...text(r[2]).replace(/(\d),(?=\d)/g, '$1').matchAll(/\d+(?:\.\d+)?/g)].map(Number);
  }
  return out;
};
const bodyEx = exRows(body), beyondEx = exRows(beyond);
const rowIs = (where, set, n, label, want) => ok(`${where} Example ${n} ${label}`, want, (set[n] || {})[label]);
// body
rowIs('body', bodyEx, 1, 'Answer', reduce(9, 15));
rowIs('body', bodyEx, 2, 'Answer', [5 * 18000 / 4500]);
rowIs('body', bodyEx, 3, 'Step 2', [10 / 5]);
rowIs('body', bodyEx, 3, 'Step 3', [2, 2 * 10 / 5]);
rowIs('body', bodyEx, 3, 'Step 4', [3, 3 * 10 / 5]);
rowIs('body', bodyEx, 3, 'Answer', [4, 6, 20]);
rowIs('body', bodyEx, 4, 'Step 1', [3, 1]);
rowIs('body', bodyEx, 4, 'Answer', [3 * 5.5]);
rowIs('body', bodyEx, 5, 'Step 3', share(110, 1, 1.5, 3));
rowIs('body', bodyEx, 5, 'Answer', share(110, 1, 1.5, 3));
rowIs('body', bodyEx, 6, 'Step 2', [180 / 9]);
rowIs('body', bodyEx, 6, 'Step 3', share(180, 1, 3, 5));
rowIs('body', bodyEx, 6, 'Answer', share(180, 1, 3, 5));
rowIs('body', bodyEx, 7, 'Step 2', [22, 330, 1, 330 / 22]);
rowIs('body', bodyEx, 7, 'Answer', [330, 1, 330 / 22 * 100000]);
rowIs('body', bodyEx, 8, 'Answer', [20 * 4 / 10]);
rowIs('body', bodyEx, 9, 'Answer', [2 * 18 / 4]);
rowIs('body', bodyEx, 10, 'Step 1', [100]);
rowIs('body', bodyEx, 10, 'Answer', [80 * 15 / 100]);
// Beyond
rowIs('Beyond', beyondEx, 1, 'Answer', reduce(6, 15));
rowIs('Beyond', beyondEx, 2, 'Answer', [7 * 36 / 21]);
rowIs('Beyond', beyondEx, 3, 'Answer', [315 / 9 * 14]);
rowIs('Beyond', beyondEx, 4, 'Answer', [1350 / 25 * 40]);
rowIs('Beyond', beyondEx, 5, 'Step 1', [3, 1.2, 0.4]);
rowIs('Beyond', beyondEx, 5, 'Answer', [1.6, 0.4, 3.2]);
rowIs('Beyond', beyondEx, 6, 'Step 1', [6, 4, 1.5, 9, 6, 1.5, 15, 10, 1.5]);
rowIs('Beyond', beyondEx, 6, 'Step 3', [6, 9, 15, 2, 3, 5, 4, 6, 10, 2, 3, 5]);
rowIs('Beyond', beyondEx, 6, 'Answer', [2, 3, 5]);
rowIs('Beyond', beyondEx, 7, 'Answer', share(3000, 3, 5, 7));
rowIs('Beyond', beyondEx, 8, 'Step 3', [4, 6, 24, 3, 6, 18]);
rowIs('Beyond', beyondEx, 8, 'Answer', [24 * 18]);
rowIs('Beyond', beyondEx, 9, 'Step 1', [3000000, 30, 1, 30]);
rowIs('Beyond', beyondEx, 9, 'Answer', [225, 18]);
rowIs('Beyond', beyondEx, 10, 'Step 1', [20, 2000]);
rowIs('Beyond', beyondEx, 10, 'Answer', [8, 120, 1.2]);
rowIs('Beyond', beyondEx, 11, 'Step 1', [360, 1200, 0.3]);
rowIs('Beyond', beyondEx, 11, 'Answer', [480, 300, 240, 180].map(n => deg(n, 1200)));
rowIs('Beyond', beyondEx, 12, 'Answer', [250, 20]);
rowIs('Beyond', beyondEx, 13, 'Answer', [40 * 6 / 48]);
rowIs('Beyond', beyondEx, 14, 'Step 2', [60]);
rowIs('Beyond', beyondEx, 14, 'Step 3', [4, 60, 15]);
rowIs('Beyond', beyondEx, 14, 'Answer', [60, 15, 4]);
rowIs('Beyond', beyondEx, 15, 'Step 3', [6]);
rowIs('Beyond', beyondEx, 15, 'Answer', [6]);
rowIs('Beyond', beyondEx, 16, 'Answer', [12]);
is('the key to 31(c) ends on the speed', new RegExp(`so ${360 / 4.8} km/h`).test(row('31c')));
is('the key to 24 ends on the speed', new RegExp(`so ${75 * 4 / 5} km/h`).test(row(24)));
is('the key to 28 ends on the time', new RegExp(`fills in ${Math.round(1 / (1 / 20 + 1 / 30 - 1 / 15))} minutes`).test(row(28)));

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) {
  if (!/c-practice/.test(beyond)) continue;
  const n = Number(m[1] || 1);
  // the first practice block is the one carrying the numeral
  if (!m[1] && !/c-practice__num/.test(beyond.slice(Math.max(0, m.index - 400), m.index))) continue;
  qs[n] = m[2];
}
const optsOf = (n) => [...(qs[n] || '').replace(/^[\s\S]*?<ol class="c-parts[^"]*">/, '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => text(x[1]).trim());
const num = (s) => Number(s.replace(/\$|\^\\circ|°|₹|,|\{,\}/g, '').replace(/\s*(days|hours|km|m)$/, '').trim());
const pair = (s) => s.replace(/\$|₹/g, '').split(/\s*(?:and|:)\s*/).map(Number);
const key = {};
{ const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2]; }

const solve = {
  1: o => o.map(num).map(v => proportional(4, 9, v, 27)),
  2: o => o.map(s => s.replace(/\$/g, '').split(' and ').map(r => r.split(':').map(Number))).map(([[a, b], [c, d]]) => proportional(a, b, c, d)),
  3: o => o.map(pair).map(([x, y]) => JSON.stringify([x, y]) === JSON.stringify(share(60, 2, 3))),
  4: o => o.map(num).map(v => near(v, 18 / 6 * 11)),
  5: o => o.map(num).map(v => near(v, 6 * 10 / 12)),
  6: o => o.map(s => { const v = num(s); return /km/.test(s) ? v : v / 1000; }).map(v => near(v, kmPerCm(100000))),
  7: o => o.map(s => ({ 'a sixth': 1 / 6, 'a third': 1 / 3, 'a quarter': 1 / 4, 'a twelfth': 1 / 12 })[s]).map(v => near(v, 60 / 360)),
  8: o => o.map(num).map(v => near(v, 0.4 * 360)),
  9: o => o.map(num).map(v => near(v, 4 * 6 / 8)),
  10: o => o.map(num).map(v => near(v, Math.max(...share(180, 1, 2, 3)))),
  11: o => o.map(s => /speed of a train/.test(s)),
  12: o => o.map(num).map(v => near(v, 1 / (1 / 12 + 1 / 6))),
  13: o => o.map(pair).map(([x, y]) => y - x === 25 && proportional(x, y, 2, 7)),
  14: o => o.map(num).map(v => { const part = 12 / 3; return near(v, 2 * part + 5 * part); }),
  15: o => o.map(s => s === 'halved'),
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options: ${JSON.stringify(o)}`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Q${q}: the right option`, right, [key[q]]);
}
// assertion-reason: [A true, R true, R explains A]
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const squareSide = [1, 2, 3], squareArea = squareSide.map(s => s * s);
const AR = {
  16: [8 * 9 === 4 * 18, true, true],
  17: [proportional(2, 3, 4, 9), true, false],
  18: [deg(3, 10) + deg(7, 10) === 360, true, false],
  // R claims growing together means direct; the square grows together and is not direct
  19: [!proportional(squareSide[0], squareArea[0], squareSide[1], squareArea[1]), false, false],
};
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
is('Q19: side and area do grow together', squareArea[1] > squareArea[0]);
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-19', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(19)].map((_, i) => i + 1));

// numbering: one run 1..31, no repeats
{ const starts = [...beyond.matchAll(/data-start="(\d+)"/g)].map(m => Number(m[1]));
  ok('practice numbering runs 2..31', starts, [...Array(30)].map((_, i) => i + 2)); }
{ const runs = body.split('c-practice__head').slice(1).map(s => [...s.split('c-practice__head')[0].matchAll(/data-start="(\d+)"/g)].map(m => Number(m[1])));
  runs.forEach((r, i) => ok(`Exercise Set 3.${i + 1} numbering`, r, [...Array(r.length)].map((_, k) => k + 2))); }

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
const mdLine = answersMd.slice(answersMd.indexOf('as the key prints it'));
for (const m of mdLine.slice(0, 400).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2];
ok('ANSWERS.md key matches the page', mdKey, key);

// ANSWERS.md, body exercise answers
const md = answersMd;
const mdHas = (what, re) => is(`ANSWERS.md ${what}: ${re}`, re.test(md));
ok('Ex 3.1 Q1', [[3, 8, 9, 24], [5, 6, 20, 25], [14, 21, 6, 9], [2.5, 4, 10, 16]].map(x => proportional(...x)), [true, false, true, true]);
mdHas('3.1 Q1 verdicts', /\(i\) \*\*Yes\*\*[\s\S]*\(ii\) \*\*No\*\*[\s\S]*\(iii\) \*\*Yes\*\*[\s\S]*\(iv\) \*\*Yes\*\*/);
ok('Ex 3.1 Q2', [7 * 12 / 4, 9 * 8 / 12, 15 * 40 / 25], [21, 6, 24]);
mdHas('3.1 Q2', /\*\*21\*\*[\s\S]*\*\*6\*\*[\s\S]*\*\*24\*\*/);
ok('Ex 3.1 Q3', [6 * 9 / 3, 2 * 9 / 3, (6 + 3 + 2) * 9 / 3], [18, 6, 33]);
ok('Ex 3.1 Q4', [1015 / 7 * 12, 580 / (1015 / 7)], [1740, 4]);
mdHas('3.1 Q4', /12 m cost ₹1,740\*\*[\s\S]*₹580 buys 4 m/);
ok('Ex 3.1 Q5', [300 * 10 / 4, 2 * 10 / 4, ...reduce(300, 2000)], [750, 5, 3, 20]);
mdHas('3.1 Q5', /\*\*750 g of rice\*\*[\s\S]*\*\*5 litres of water\*\*/);
ok('Ex 3.2 Q1', [share(450, 4, 5), share(96, 1, 2, 5), share(180, 2, 3, 4)], [[200, 250], [12, 24, 60], [40, 60, 80]]);
mdHas('3.2 Q1', /\*\*₹200 and ₹250\*\*[\s\S]*\*\*12 kg, 24 kg, 60 kg\*\*[\s\S]*\*\*40°, 60°, 80°\*\*/);
ok('Ex 3.2 Q2', share(150, 3, 4, 3, 5), [30, 40, 30, 50]);
mdHas('3.2 Q2', /warm-up \*\*30\*\*, batting \*\*40\*\*, bowling \*\*30\*\*, fielding \*\*50\*\*/);
ok('Ex 3.2 Q3', [288 / 3 * 2, 288 / 3, 288 / 3 * 6], [192, 96, 576]);
mdHas('3.2 Q3', /\*\*192 Hindi\*\*[\s\S]*\*\*96 English\*\*[\s\S]*\*\*576 books\*\*/);
{ const c = share(100, 4, 3, 2, 1); ok('Ex 3.2 Q4', [...c, c[0] * 10 + c[1] * 5 + c[2] * 2 + c[3]], [40, 30, 20, 10, 600]); mdHas('3.2 Q4', /\*\*₹600\*\*/); }
is('Ex 3.2 Q5: 1:3:5 fails the triangle rule', 1 + 3 < 5);
{ const e = (720 + 80) / 2, y = 720 - e; ok('Ex 3.2 Q6', [e, y, ...reduce(e, y), ...reduce((720 + 240) / 2, (720 - 240) / 2)], [400, 320, 5, 4, 2, 1]); }
ok('Ex 3.2 Q7', 1250 / 5 * 8, 2000);
mdHas('3.2 Q7', /\*\*₹2,000\*\*/);
ok('Ex 3.3 Q1', [kmPerCm(2500000), 400 / kmPerCm(2500000)], [25, 16]);
ok('Ex 3.3 Q2', [800 / 50, 2 * 50], [16, 100]);
ok('Ex 3.3 Q3', [4000000 / 1000000, (4000000 / 1000000) ** 2], [4, 16]);
ok('Ex 3.3 Q4', [85 * 200 / 100, 2 * 200 / 100], [170, 4]);
mdHas('3.3 Q4', /\*\*170 m\*\*[\s\S]*\*\*4 m\*\*/);
ok('Ex 3.3 Q5', 12 * kmPerCm(50000), 6);
mdHas('3.3 Q5', /\*\*6 km\*\*/);
ok('Ex 3.4 Q1', [360 - 90 - 120, deg(90, 360), deg(120, 360), deg(150, 360)], [150, 90, 120, 150]);
mdHas('3.4 Q1', /\*\*summer 90°, rains 120°, winter 150°\*\*/);
ok('Ex 3.4 Q2', [50, 25, 15, 10].map(p => 3.6 * p).map(Math.round), [180, 90, 54, 36]);
mdHas('3.4 Q2', /\*\*Entertainment 180°, sport 90°, news 54°, information 36°\*\*/);
ok('Ex 3.4 Q3', [100 * 126 / 360, 126 / 360 * 28000], [35, 9800]);
mdHas('3.4 Q3', /\*\*₹9,800\*\*/);
{ const rest = 60 - 25 - 20 - 9; ok('Ex 3.4 Q4', [rest, ...[25, 20, 9, rest].map(n => deg(n, 60))], [6, 150, 120, 54, 36]); }
mdHas('3.4 Q4', /\*\*walk 150°, bus 120°, cycle 54°, driven 36°\*\*/);
ok('Ex 3.4 Q5 instance', [72 / 360 * 30, 72 / 360 * 50], [6, 10]);
ok('Lucknow to Kanpur', 30 * 3 / 60, 1.5);
ok('Ex 3.5 Q1', [[40, 80, 25], [40, 80, 25], [30, 90, 150]].map((xs, i) => xs.map((x, k) => x * [[20, 10, 32], [20, 10, 12.5], [15, 5, 3]][i][k])), [[800, 800, 800], [800, 800, 312.5], [450, 450, 450]]);
mdHas('3.5 Q1', /\(i\) \*\*Inverse\*\*[\s\S]*\(ii\) \*\*Not inverse\*\*[\s\S]*\(iii\) \*\*Inverse\*\*/);
ok('Ex 3.5 Q2', [16 * 9 / 12, 16 * 9 / 48], [12, 3]);
mdHas('3.5 Q2', /\*\*\$y = 12\$\*\*[\s\S]*\*\*\$x = 3\$\*\*/);
ok('Ex 3.5 Q4', [6 * 80 / 8, 6 * 80 / 60], [60, 8]);
mdHas('3.5 Q4', /\*\*1 hour\*\*[\s\S]*\*\*8 taps\*\*/);
ok('Ex 3.5 Q5', [150 - 50, 150 * (45 - 15) / (150 - 50)], [100, 45]);
mdHas('3.5 Q5', /\*\*100\*\* soldiers[\s\S]*= 45\$ \*\*more days\*\*/);
ok('Ex 3.5 Q6', 1 / (1 / 6 + 1 / 3), 2);
mdHas('3.5 Q6', /\*\*2 hours\*\*/);
ok('Ex 3.5 Q7', 4 * 60 / 3, 80);
mdHas('3.5 Q7', /\*\*80 km\/h\*\*/);
mdHas('Stage 1 results', new RegExp(`\\(1\\) ${750 / 6 * 8} g[\\s\\S]*\\(2\\) ${120 / 15} days[\\s\\S]*\\(3\\) ${6 * 50000 / 200000} cm[\\s\\S]*\\(4\\) ${150 / 360 * 720} people[\\s\\S]*\\(5\\) ₹1,680[\\s\\S]*\\(6\\) ${240 / 4} minutes[\\s\\S]*\\(7\\) 30 and 42[\\s\\S]*\\(8\\) ${35 * 60 / 21} turns`));
// ANSWERS.md practice lines carry the same answers as the key
mdHas('Q23', /₹3,000, ₹2,000, ₹1,500/); mdHas('Q25', /\*\*15 and 9\*\*/);
mdHas('Q26', /Rent 90°, food 120°, education 60°, savings 90°/); mdHas('Q27', /\*\*10 more days\*\*/);
mdHas('Q28', /in 60 minutes/); mdHas('Q29', /\*\*5 km by 4 km\*\*, area \*\*20 km²\*\*/);
mdHas('Q30', /8 kg rice, 48 lemons, 1280 g oil[\s\S]*96\$ \*\*students/); mdHas('Q31', /\*\*75 km\/h\*\*/);

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
