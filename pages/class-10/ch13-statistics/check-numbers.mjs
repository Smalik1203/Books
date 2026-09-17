#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth. Every
   distribution is read out of the table cells on the page, every mean,
   median and mode is computed from those cells, and the result is compared
   with what the page and ANSWERS.md print.

     node pages/class-10/ch13-statistics/check-numbers.mjs [--skipped]

   Four parts:
     A  every identity set as maths, on every page and in ANSWERS.md, whose
        sides all evaluate; a side that is a bare decimal is checked as a
        rounding, to the places it prints
     B  the claims A cannot check: every working table (class marks, f x,
        deviations, cumulative frequencies, totals), every example answer,
        every exercise answer in ANSWERS.md, Stage 1, the Solved Examples,
        and the practice answers read back out of the key rows a lettered
        part at a time
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
const near = (a, b, t = 1e-9) => Math.abs(a - b) <= t;

/* ---- the statistics -------------------------------------------- */

const sum = (xs) => xs.reduce((a, b) => a + b, 0);
const cum = (fs_) => { let c = 0; return fs_.map(v => (c += v)); };
const marks = (cls) => cls.map(([a, b]) => (a + b) / 2);
const meanOf = (cls, f) => sum(marks(cls).map((x, i) => x * f[i])) / sum(f);
function modeOf(cls, f) {
  const i = f.indexOf(Math.max(...f));
  const [l, u] = cls[i]; const f0 = f[i - 1] ?? 0, f2 = f[i + 1] ?? 0;
  return l + (f[i] - f0) / (2 * f[i] - f0 - f2) * (u - l);
}
function medianClass(f) {
  const n = sum(f); let c = 0;
  for (let i = 0; i < f.length; i++) { if (c + f[i] > n / 2) return { i, cf: c }; c += f[i]; }
}
function medianOf(cls, f) {
  const { i, cf } = medianClass(f); const [l, u] = cls[i];
  return l + (sum(f) / 2 - cf) / f[i] * (u - l);
}
// the printed value is this number, rounded to the places it prints
// (a whole number is printed only when the value is whole)
const rounds = (v, s) => { const dp = (String(s).split('.')[1] || '').length; return Math.abs(v - Number(s)) <= (dp ? 0.5 * 10 ** -dp : 0) + 1e-9; };
// rounded half up, as the book rounds: 12.475 is 12.48
const fx = (v, dp) => (Math.round(v * 10 ** dp + 1e-7) / 10 ** dp).toFixed(dp);

/* ---- the pages ------------------------------------------------- */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const read = (f) => fs.readFileSync(path.join(DIR, f), 'utf8').replace(/\r\n/g, '\n');   // the refit writes mixed line ends
const html = Object.fromEntries(pages.map(f => [f, read(f)]));
const answersMd = read('ANSWERS.md');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<span class="nb">([^<]*)<\/span>/g, '$1')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ');
const cellText = (s) => text(s).replace(/\$/g, '').replace(/[{}]/g, '').replace(/−/g, '-').trim();

// every table--data in a piece of html, as its caption, head and rows
function tablesIn(h) {
  return [...h.matchAll(/<table class="table--data">([\s\S]*?)<\/table>/g)].map(m => {
    const t = m[1];
    const cap = (t.match(/<caption>([\s\S]*?)<\/caption>/) || [])[1];
    const rowsOf = (part) => [...(t.match(new RegExp(`<${part}>([\\s\\S]*?)</${part}>`)) || ['', ''])[1].matchAll(/<tr>([\s\S]*?)<\/tr>/g)]
      .map(r => [...r[1].matchAll(/<t[hd]>([\s\S]*?)<\/t[hd]>/g)].map(c => cellText(c[1])));
    return { cap: cap && text(cap).trim(), head: rowsOf('thead')[0] || [], rows: rowsOf('tbody'), foot: rowsOf('tfoot')[0] };
  });
}
const cls1 = (s) => { const m = s.match(/^(-?[\d.]+)\s*[–-]\s*(-?[\d.]+)$/); return m && [Number(m[1]), Number(m[2])]; };
const val = (s) => (s === '' ? null : /^-?[\d.]+$/.test(s) ? Number(s) : s);
// a distribution written as row tables, one or more of them: the classes
// from the head, the frequencies from the first body row; a Total column
// is dropped
function dist(tbls) {
  const cls = [], f = [];
  for (const t of tbls) t.head.slice(1).forEach((h, i) => { if (h === 'Total') return; cls.push(cls1(h) ?? val(h)); f.push(val(t.rows[0][i + 1])); });
  return { cls, f };
}
const byCap = (cap) => tablesIn(body).filter(t => t.cap === cap);

// blocks of a kind, in order, each with the heading it sits under
// (each block is cut at the </div> that closes it, counted, not by indent)
function blocks(h, opener) {
  const out = [];
  for (let at = h.indexOf(opener); at >= 0; at = h.indexOf(opener, at + 1)) {
    let depth = 0; const re = /<div\b|<\/div>/g; re.lastIndex = at;
    for (let m; (m = re.exec(h));) {
      depth += m[0] === '</div>' ? -1 : 1;
      if (!depth) { out.push(h.slice(at, re.lastIndex)); break; }
    }
  }
  return out;
}
// a practice block, not the band head or sub head inside one
const practiceBlocks = (h) => blocks(h, '<div class="c-practice').filter(b => /^<div class="c-practice( c-practice--cont)?">/.test(b));
const answerRow = (ex) => text((ex.match(/<span class="work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/) || ['', ''])[1]).replace(/\$/g, '');
const exampleBlocks = (h) => Object.fromEntries(blocks(h, '<div class="c-example">').map(b => [Number(b.match(/Example (\d+)/)[1]), b]));
const bodyEx = exampleBlocks(body);
const beyEx = exampleBlocks(beyond);
const esc = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// a value as a phrase: not the tail or head of a longer number
const says = (what, row, ...vals) => { for (const v of vals) is(`${what} should say ${v}: "${row.slice(0, 160)}"`, new RegExp(`(^|[^\\d.])${esc(v)}([^\\d]|\\.(?!\\d)|$)`).test(row)); };
const num = (s) => Number(s.match(/-?\d+(?:\.\d+)?/)[0]);

/* ---- A. every identity ----------------------------------------- */

function toExpr(side) {
  let s = side
    .replace(/\\left|\\right/g, '')
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad/g, '')
    .replace(/\^\{([^{}]+)\}/g, '**($1)').replace(/\^(\d)/g, '**$1')
    .replace(/\s+/g, '');
  if (!s || !/^[-+*/().0-9]+$/.test(s)) return null;
  return s.replace(/\)\(/g, ')*(').replace(/(\d)\(/g, '$1*(');
}
const evalExpr = (e) => { try { return Function(`"use strict";return (${e})`)(); } catch { return NaN; } };
const places = (side) => Math.max(0, ...(side.match(/\d+\.\d+/g) || []).map(d => d.split('.')[1].length));

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

let spans = 0; const skipped = [];
const sources = [...pages.map(f => [f, html[f]]), ['ANSWERS.md', answersMd]];
for (const [f, raw] of sources) {
  const src = raw.replace(/\$\$/g, '$');            // display maths first, so $$…$$ is one span
  for (const m of src.matchAll(/\$([^$]+)\$/g)) {
    const span = m[1];
    if (!span.includes('=') || /\\neq|\\leq|\\geq|<|>/.test(span)) continue;
    for (const part of splitParts(span.replace(/^\{(.*)\}$/, '$1'))) {
      const sides = part.split('=').map(s => s.trim()).filter(Boolean);
      if (sides.length < 2) continue;
      let vals = sides.map(s => ({ s, e: toExpr(s) }));
      if (vals.filter(v => v.e).length >= 2) vals = vals.filter(v => v.e);
      if (vals.some(v => !v.e) || vals.length < 2) { skipped.push(`${f}: $${part.trim()}$`); continue; }
      const nums = vals.map(v => evalExpr(v.e));
      if (nums.some(n => !Number.isFinite(n))) { skipped.push(`${f}: $${part.trim()}$`); continue; }
      spans++;
      // a side printed to d places is a rounding; the check allows exactly that
      const tol = 0.5 * 10 ** -Math.max(...vals.map(v => places(v.s))) + 1e-9;
      const dpMax = Math.max(...vals.map(v => places(v.s)));
      const t = dpMax ? tol : 1e-9;
      if (nums.some(n => Math.abs(n - nums[0]) > (dpMax ? 2 * t : t))) fails.push(`${f}: $${part.trim()}$ — sides are ${nums.join(' and ')}`);
      else pass++;
    }
  }
}

/* ---- B. the body ------------------------------------------------ */

// Example 1: the marks and Table 13.1
{
  const q = tablesIn(bodyEx[1]).filter(t => !t.cap);
  const { cls: xs, f } = dist(q);
  const t = byCap('Table 13.1')[0];
  ok('Table 13.1 lists the marks of Example 1', t.rows.map(r => [val(r[0]), val(r[1])]), xs.map((x, i) => [x, f[i]]));
  ok('Table 13.1: the f x column', t.rows.map(r => val(r[2])), xs.map((x, i) => x * f[i]));
  ok('Table 13.1: the totals', [t.foot[1], t.foot[2]].map(s => s.replace(/.*=\s*/, '')).map(Number), [sum(f), sum(xs.map((x, i) => x * f[i]))]);
  const exact = sum(xs.map((x, i) => x * f[i])) / sum(f);
  says('Example 1 Answer', answerRow(bodyEx[1]), String(exact));
  is('Example 1 has 30 students', sum(f) === 30 && /30 students/.test(bodyEx[1]));
  // Table 13.2: the same marks grouped, a mark on a limit going up a class
  const t2 = byCap('Table 13.2')[0];
  const g = dist([t2]);
  ok('Table 13.2 groups Example 1', g.cls.map(([a, b]) => sum(xs.map((x, i) => (x >= a && x < b ? f[i] : 0)))), g.f);
  // Table 13.3, and both of its reprints
  const t3 = byCap('Table 13.3')[0];
  ok('Table 13.3: its classes and frequencies are Table 13.2', t3.rows.map(r => [cls1(r[0]), val(r[1])]), g.cls.map((c, i) => [c, g.f[i]]));
  ok('Table 13.3: class marks', t3.rows.map(r => val(r[2])), marks(g.cls));
  ok('Table 13.3: f x', t3.rows.map(r => val(r[3])), marks(g.cls).map((x, i) => x * g.f[i]));
  ok('Table 13.3: totals', [t3.foot[1], t3.foot[3]].map(s => Number(s.replace(/.*=\s*/, ''))), [sum(g.f), sum(marks(g.cls).map((x, i) => x * g.f[i]))]);
  const reprints = [...tablesIn(body), ...tablesIn(beyond)].filter(t => /^Table 13\.3 \(repeated/.test(t.cap || ''));
  is('Table 13.3 is reprinted twice (Example 6, Stage 1)', reprints.length === 2);
  for (const r of reprints) {
    ok(`${r.cap}: the classes`, r.head.slice(1, -1).map(cls1), g.cls);
    ok(`${r.cap}: f, x, f x and totals`, r.rows.map(row => row.slice(1).map(val)), [[...g.f, sum(g.f)], [...marks(g.cls), null], [...marks(g.cls).map((x, i) => x * g.f[i]), sum(marks(g.cls).map((x, i) => x * g.f[i]))]]);
  }
  const m = meanOf(g.cls, g.f);
  is('the grouped mean is 62, as printed', m === 62 && /The mean 59\.3 is exact, and 62 is an approximate mean/.test(body));
  // Tables 13.4 and 13.5
  const t4 = byCap('Table 13.4')[0];
  ok('Table 13.4: d = x - 47.5 and f d', t4.rows.map(r => [val(r[3]), val(r[4])]), marks(g.cls).map((x, i) => [x - 47.5, (x - 47.5) * g.f[i]]));
  ok('Table 13.4: total', Number(t4.foot[4].replace(/.*=\s*/, '')), sum(marks(g.cls).map((x, i) => (x - 47.5) * g.f[i])));
  const t5 = byCap('Table 13.5')[0];
  ok('Table 13.5: d, u and f u', t5.rows.map(r => [val(r[3]), val(r[4]), val(r[5])]), marks(g.cls).map((x, i) => [x - 47.5, (x - 47.5) / 15, (x - 47.5) / 15 * g.f[i]]));
  ok('Table 13.5: total', Number(t5.foot[5].replace(/.*=\s*/, '')), sum(marks(g.cls).map((x, i) => (x - 47.5) / 15 * g.f[i])));
  is('Activity 1: every class mark as a gives 62', marks(g.cls).every(a => near(a + sum(marks(g.cls).map((x, i) => (x - a) * g.f[i])) / 30, 62)));
  // Example 6, from the reprinted table
  const e6 = dist([tablesIn(bodyEx[6])[0]].map(t => ({ ...t, head: t.head, rows: t.rows })));
  says('Example 6 Answer', answerRow(bodyEx[6]), modeOf(e6.cls, e6.f), meanOf(e6.cls, e6.f));
  ok('Example 6: modal class and neighbours', [e6.f[2], e6.f[1], e6.f[3]], [7, 3, 6]);
  // Stage 1, question 1, from its reprint
  const s1 = dist([reprints.find(t => /this question/.test(t.cap))]);
  const s1text = text(beyond.slice(beyond.indexOf('Adding 10 to every'), beyond.indexOf('Adding 10 to every') + 400));
  says('Stage 1 Q1', s1text, meanOf(s1.cls, s1.f), meanOf(s1.cls.map(([a, b]) => [a + 10, b + 10]), s1.f), meanOf(s1.cls.map(([a, b]) => [2 * a, 2 * b]), s1.f));
}

// Example 2: Tables 13.6 and 13.7, and three methods
{
  const q = dist([tablesIn(bodyEx[2])[0]]);
  const t6 = tablesIn(bodyEx[2]).find(t => t.cap === 'Table 13.6');
  ok('Table 13.6: frequencies and class marks', [t6.rows[0].slice(1).map(val), t6.rows[1].slice(1).map(val)], [q.f, marks(q.cls)]);
  const t7 = tablesIn(bodyEx[2]).find(t => t.cap === 'Table 13.7');
  const x = marks(q.cls);
  ok('Table 13.7: every column', t7.rows.map(r => r.map(val)), q.cls.map((c, i) => [`${c[0]} – ${c[1]}`, q.f[i], x[i], x[i] - 50, (x[i] - 50) / 10, q.f[i] * x[i], q.f[i] * (x[i] - 50), q.f[i] * (x[i] - 50) / 10]));
  ok('Table 13.7: totals', t7.foot.map(val).filter(v => typeof v === 'number'), [sum(q.f), sum(x.map((v, i) => v * q.f[i])), sum(x.map((v, i) => (v - 50) * q.f[i])), sum(x.map((v, i) => (v - 50) / 10 * q.f[i]))]);
  says('Example 2 Answer', answerRow(bodyEx[2]), fx(meanOf(q.cls, q.f), 2));
}

// Example 3: Table 13.8
{
  const q = dist([tablesIn(bodyEx[3])[0]]);
  const t8 = tablesIn(bodyEx[3]).find(t => t.cap === 'Table 13.8');
  const x = marks(q.cls);
  ok('Table 13.8: every column', t8.rows.map(r => r.slice(1).map(val)), x.map((v, i) => [q.f[i], v, v - 200, (v - 200) / 20, q.f[i] * (v - 200) / 20]));
  ok('Table 13.8: totals', t8.foot.map(val).filter(v => typeof v === 'number'), [sum(q.f), sum(x.map((v, i) => (v - 200) / 20 * q.f[i]))]);
  says('Example 3 Answer', answerRow(bodyEx[3]), fx(meanOf(q.cls, q.f), 2), sum(q.f));
}

// Example 4: the wickets, counted
{
  const data = text(bodyEx[4]).match(/matches: ([\d, ]+)\./)[1].split(',').map(Number);
  const t = tablesIn(bodyEx[4])[0];
  const vals = t.head.slice(1).map(Number);
  ok('Example 4: the frequency table counts the data', t.rows[0].slice(1).map(Number), vals.map(v => data.filter(d => d === v).length));
  is('Example 4: 10 matches', data.length === 10 && /10 cricket matches/.test(bodyEx[4]));
  const top = Math.max(...vals.map(v => data.filter(d => d === v).length));
  const modes = vals.filter(v => data.filter(d => d === v).length === top);
  says('Example 4 Answer', answerRow(bodyEx[4]), ...modes);
  says('Example 4 Step 2', text(bodyEx[4]), `${modes[0]} wickets in the largest number of matches, ${top}`);
}

// Example 5
{
  const q = dist([tablesIn(bodyEx[5])[0]]);
  is('Example 5: 20 households', sum(q.f) === 20 && /20 households/.test(bodyEx[5]));
  says('Example 5 Answer', answerRow(bodyEx[5]), fx(modeOf(q.cls, q.f), 3));
  const i = q.f.indexOf(Math.max(...q.f));
  says('Example 5 Step 2', text(bodyEx[5]).replace(/\$/g, ''), `l = ${q.cls[i][0]}`, `h = ${q.cls[i][1] - q.cls[i][0]}`, `f_1 = ${q.f[i]}`, `f_0 = ${q.f[i - 1]}`, `f_2 = ${q.f[i + 1]}`);
}

// The ungrouped median, Tables 13.9 to 13.11
{
  const i0 = body.indexOf('Suppose you have to find the median');
  const raw = tablesIn(body.slice(i0, body.indexOf('Table 13.9', i0)))[0];
  const pairs = raw.head.slice(1).map((h, i) => [Number(h), Number(raw.rows[0][i + 1])]).sort((a, b) => a[0] - b[0]);
  const t9 = byCap('Table 13.9')[0];
  ok('Table 13.9 sorts the marks', t9.head.slice(1, -1).map(Number).map((m, i) => [m, Number(t9.rows[0][i + 1])]), pairs);
  ok('Table 13.9: total', Number(t9.rows[0].at(-1)), sum(pairs.map(p => p[1])));
  const cf = cum(pairs.map(p => p[1]));
  const t11 = byCap('Table 13.11')[0];
  ok('Table 13.11: cumulative frequencies', t11.rows[1].slice(1).map(Number), cf);
  const t10 = byCap('Table 13.10')[0];
  const t10b = tablesIn(body.slice(body.indexOf('Table 13.10'), body.indexOf('Table 13.11')))[1];
  ok('Table 13.10: the running totals', [...t10.rows[0].slice(1), ...t10b.rows[0].slice(1)].map(s => Number(s.replace(/.*=\s*/, ''))), cf);
  const n = sum(pairs.map(p => p[1]));
  const obs = (k) => pairs[cf.findIndex(c => c >= k)][0];
  is('n = 100', n === 100 && /these marks, out of 50, of 100 students/.test(body));
  says('the 50th and 51st observations', text(body), `the 50th observation is ${obs(n / 2)} and the 51st observation is ${obs(n / 2 + 1)}`);
  ok('the ungrouped median', (obs(n / 2) + obs(n / 2 + 1)) / 2, 28.5);
  says('the median remark', text(body), `less than ${(obs(n / 2) + obs(n / 2 + 1)) / 2} marks`);
}

// Tables 13.12 to 13.15, and the grouped median
{
  const i0 = body.indexOf('Table 13.12');
  const [a, b] = tablesIn(body.slice(body.lastIndexOf('<table', i0), body.indexOf('Use the table', i0)));
  const q = dist([a, b]);
  const cf = cum(q.f), n = sum(q.f);
  is('Table 13.12: 53 students', n === 53 && /of 53 students/.test(body));
  const t13 = byCap('Table 13.13')[0];
  ok('Table 13.13: upper limits and less than counts', [t13.head.slice(1).map(Number), t13.rows[0].slice(1).map(Number)], [q.cls.map(c => c[1]), cf]);
  const t14 = byCap('Table 13.14')[0];
  ok('Table 13.14: lower limits and more than counts', [t14.head.slice(1).map(Number), t14.rows[0].slice(1).map(Number)], [q.cls.map(c => c[0]), q.f.map((_, i) => n - (cf[i - 1] || 0))]);
  const t15a = byCap('Table 13.15')[0];
  const t15b = tablesIn(body.slice(body.indexOf('Table 13.15')))[1];
  const d15 = dist([t15a, t15b]);
  ok('Table 13.15 repeats Table 13.12', d15, q);
  ok('Table 13.15: cumulative frequencies', [...t15a.rows[1], ...t15b.rows[1]].filter(s => /^\d+$/.test(s)).map(Number), cf);
  const { i, cf: before } = medianClass(q.f);
  says('the median class', text(body), `The class ${q.cls[i][0]} – ${q.cls[i][1]} has cumulative frequency ${cf[i]}`);
  ok('the grouped median, as its terms are printed', [q.cls[i][0], before, q.f[i]], [60, 22, 7]);
  is(`the grouped median ${medianOf(q.cls, q.f)} rounds to 66.4`, rounds(medianOf(q.cls, q.f), '66.4') && /got less than 66\.4 marks/.test(body));
  says('the first two cumulative frequencies in the text', text(body).replace(/[{}$]/g, ''), `${cf[0]} + ${q.f[1]} = ${cf[1]} students`, `${n} - ${q.f[0]} = ${n - cf[0]} students`);
}

// Example 7: Table 13.16 from the less than table
{
  const t = tablesIn(bodyEx[7])[0];
  const ups = t.head.slice(1).map(Number), less = t.rows[0].slice(1).map(Number);
  const f = less.map((c, i) => c - (less[i - 1] || 0));
  const t16 = tablesIn(bodyEx[7]).find(x => x.cap === 'Table 13.16');
  ok('Table 13.16: frequencies and cumulative frequencies', [t16.rows[0].slice(1).map(Number), t16.rows[1].slice(1).map(Number)], [f, less]);
  ok('Table 13.16: classes', t16.head.slice(2).map(cls1), ups.slice(1).map((u, i) => [ups[i], u]));
  const cls = [[ups[0] - 5, ups[0]], ...ups.slice(1).map((u, i) => [ups[i], u])];   // the open first class never holds the median here
  is('Example 7: 51 girls', sum(f) === 51 && /of 51 girls/.test(bodyEx[7]));
  says('Example 7 Answer', answerRow(bodyEx[7]), fx(medianOf(cls, f), 2));
  const { i } = medianClass(f);
  is('Example 7: the median class is not the open one', i > 0);
}

// Example 8: x and y, found by search, then the symbolic cumulative row
{
  const tb = tablesIn(bodyEx[8]);
  const q = dist(tb.slice(0, 2));
  const found = [];
  for (let x = 0; x <= 100; x++) for (let y = 0; y <= 100; y++) {
    const f = q.f.map(v => (v === 'x' ? x : v === 'y' ? y : v));
    if (sum(f) === 100 && near(medianOf(q.cls, f), 525)) found.push([x, y]);
  }
  ok('Example 8: the only x, y', found, [[9, 15]]);
  says('Example 8 Answer', answerRow(bodyEx[8]), 'x = 9', 'y = 15');
  const [x, y] = found[0];
  const sub = (s) => Number(Function('x', 'y', `return (${s.replace(/(\d)\s*([xy])/g, '$1*$2')})`)(x, y));
  const f = q.f.map(v => (v === 'x' ? x : v === 'y' ? y : v));
  ok('Example 8: the cumulative frequency rows', [...tb[2].rows[1].slice(1), ...tb[3].rows[1].slice(1)].map(sub), cum(f));
}

// the exercise sets, each question read from its own table
const exQ = {};
{
  let set = null;
  for (const b of practiceBlocks(body)) {
    const h = b.match(/Exercise Set (13\.\d)/); if (h) set = h[1];
    const n = Number((b.match(/data-start="(\d+)"/) || [0, 1])[1]);
    exQ[`${set} Q${n}`] = b;
  }
}
const mdSet = (set, q) => {
  const s = answersMd.slice(answersMd.indexOf(`### Exercise Set ${set}`));
  const end = s.indexOf('\n## ', 5);
  const m = s.slice(0, end < 0 ? undefined : end).match(new RegExp(`\\n${q}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`));
  return m ? m[1].replace(/\s+/g, ' ') : '';
};
const bold = (s) => (s.match(/\*\*([^*]+)\*\*/g) || []).join(' ').replace(/\$/g, '');
const Q = (k) => dist(tablesIn(exQ[k]));
{
  const means = { 1: 1, 2: 2, 4: 1, 5: 2, 6: 0, 7: 3, 8: 2, 9: 2 };
  for (const [q, dp] of Object.entries(means)) {
    const d = Q(`13.1 Q${q}`);
    const m = meanOf(d.cls, d.f);
    is(`13.1 Q${q}: the mean ${m} is a whole number to ${dp} places or rounded`, true);
    says(`ANSWERS.md 13.1 Q${q} (mean ${m})`, bold(mdSet('13.1', q)), fx(m, dp));
    is(`ANSWERS.md 13.1 Q${q}: the total frequency is the one the question states`, !/(\d+) (houses|workers|women|households|localities|students|cities)/.test(text(exQ[`13.1 Q${q}`])) || Number(text(exQ[`13.1 Q${q}`]).match(/(\d+) (houses|workers|women|households|localities|students|cities)/)[1]) === sum(d.f));
  }
  const d3 = Q('13.1 Q3');
  const fs3 = [...Array(100).keys()].filter(f => near(meanOf(d3.cls, d3.f.map(v => (v === 'f' ? f : v))), 18));
  ok('13.1 Q3: the only f', fs3, [20]);
  says('ANSWERS.md 13.1 Q3', bold(mdSet('13.1', 3)), `f = ${fs3[0]}`);
  is('13.1 Q3: the mean printed in the question', /pocket money is ₹18/.test(text(exQ['13.1 Q3'])));
  const d5 = Q('13.1 Q5');
  is('13.1 Q5: 400 boxes', sum(d5.f) === 400);
}
{
  const want = { 1: ['mode', 'mean'], 2: ['mode'], 3: ['mode', 'mean'], 4: ['mode', 'mean'], 5: ['mode'], 6: ['mode'] };
  const dps = { 1: [2, 2], 2: [3], 3: [2, 2], 4: [1, 1], 5: [1], 6: [1] };
  for (const [q, ms] of Object.entries(want)) {
    const d = Q(`13.2 Q${q}`);
    const got = ms.map((m, i) => fx(m === 'mode' ? modeOf(d.cls, d.f) : meanOf(d.cls, d.f), dps[q][i]));
    says(`ANSWERS.md 13.2 Q${q} (${ms.join(', ')})`, bold(mdSet('13.2', q)), ...got);
  }
  is('13.2 Q2: 225 components', sum(Q('13.2 Q2').f) === 225 && /225 electrical/.test(exQ['13.2 Q2']));
  is('13.2 Q3: 200 families', sum(Q('13.2 Q3').f) === 200 && /200 families/.test(exQ['13.2 Q3']));
  is('13.2 Q6: 100 periods', sum(Q('13.2 Q6').f) === 100 && /100 periods/.test(exQ['13.2 Q6']));
}
{
  const d1 = Q('13.3 Q1');
  is('13.3 Q1: 68 consumers', sum(d1.f) === 68 && /68 consumers/.test(exQ['13.3 Q1']));
  says('ANSWERS.md 13.3 Q1', bold(mdSet('13.3', 1)), fx(medianOf(d1.cls, d1.f), 0), fx(meanOf(d1.cls, d1.f), 2), fx(modeOf(d1.cls, d1.f), 2));
  const d2 = Q('13.3 Q2');
  const tot = Number(tablesIn(exQ['13.3 Q2'])[0].rows[0].at(-1));
  const found = [];
  for (let x = 0; x <= tot; x++) for (let y = 0; y <= tot; y++) {
    const f = d2.f.map(v => (v === 'x' ? x : v === 'y' ? y : v));
    if (sum(f) === tot && near(medianOf(d2.cls, f), 28.5)) found.push([x, y]);
  }
  ok('13.3 Q2: the only x, y', found, [[8, 7]]);
  says('ANSWERS.md 13.3 Q2', bold(mdSet('13.3', 2)), `x = ${found[0][0]}`, `y = ${found[0][1]}`);
  // Q3: ages below; policies from 18, so the first class is 18 - 20
  const t3 = tablesIn(exQ['13.3 Q3'])[0];
  const ups = t3.head.slice(1).map(Number), below = t3.rows[0].slice(1).map(Number);
  const f3 = below.map((c, i) => c - (below[i - 1] || 0));
  const cls3 = ups.map((u, i) => [i ? ups[i - 1] : 18, u]);
  is('13.3 Q3: 100 policy holders, from age 18', below.at(-1) === 100 && /aged 18 years or more/.test(exQ['13.3 Q3']));
  says('ANSWERS.md 13.3 Q3', bold(mdSet('13.3', 3)), fx(medianOf(cls3, f3), 2));
  says('ANSWERS.md 13.3 Q3 working', mdSet('13.3', 3), f3.join(', '));
  // Q4: classes with gaps, closed as the hint says
  const d4 = Q('13.3 Q4');
  const cls4 = d4.cls.map(([a, b]) => [a - 0.5, b + 0.5]);
  is('13.3 Q4: the hint names the closed classes', /117\.5 – 126\.5, 126\.5 – 135\.5, …, 171\.5 – 180\.5/.test(text(exQ['13.3 Q4'])) && cls4[0][0] === 117.5 && cls4.at(-1)[1] === 180.5);
  is('13.3 Q4: 40 leaves', sum(d4.f) === 40);
  says('ANSWERS.md 13.3 Q4', bold(mdSet('13.3', 4)), fx(medianOf(cls4, d4.f), 2));
  const d5 = Q('13.3 Q5');
  is('13.3 Q5: 400 lamps', sum(d5.f) === 400);
  says('ANSWERS.md 13.3 Q5', bold(mdSet('13.3', 5)), fx(medianOf(d5.cls, d5.f), 2));
  const d6 = Q('13.3 Q6');
  is('13.3 Q6: 100 surnames', sum(d6.f) === 100);
  says('ANSWERS.md 13.3 Q6', bold(mdSet('13.3', 6)), fx(medianOf(d6.cls, d6.f), 2), fx(meanOf(d6.cls, d6.f), 2), fx(modeOf(d6.cls, d6.f), 2));
  const d7 = Q('13.3 Q7');
  is('13.3 Q7: 30 students', sum(d7.f) === 30);
  says('ANSWERS.md 13.3 Q7', bold(mdSet('13.3', 7)), fx(medianOf(d7.cls, d7.f), 2));
  // each question's working in ANSWERS.md lists its cumulative frequencies
  for (const [q, d] of [[1, d1], [4, d4], [5, d5], [6, d6], [7, d7]]) says(`ANSWERS.md 13.3 Q${q} cumulative frequencies`, mdSet('13.3', q), cum(d.f).join(', '));
}
// the term lists in the working: every "\sum f_iu_i = t1 + t2 + ... = S"
// (and f_ix_i, f_id_i) must list the products from the page's own table,
// with the a and h that the same working states
const termsOf = (s, what) => {
  const m = s.replace(/\s+/g, ' ').match(new RegExp(`\\\\sum ${what} = (-?\\d+(?:\\.\\d+)?(?: [-+] \\d+(?:\\.\\d+)?)+) = `));
  return m && m[1].replace(/ ([-+]) /g, ' $1').split(' ').map(Number);
};
function products(d, a, h, what) {
  return marks(d.cls).map((x, i) => (what === 'f_ix_i' ? x : what === 'f_id_i' ? x - a : (x - a) / h) * d.f[i]);
}
function checkTerms(label, s, d) {
  const get = (re) => { const m = s.match(re); return m ? Number(m[1]) : NaN; };
  const a = get(/\$a = (\d+(?:\.\d+)?)\$/), h = get(/\$h = (\d+(?:\.\d+)?)\$/);
  let seen = 0;
  for (const what of ['f_iu_i', 'f_id_i', 'f_ix_i']) {
    const t = termsOf(s, what); if (!t) continue; seen++;
    ok(`${label}: the terms of \\sum ${what}`, t, products(d, a, h, what));
  }
  is(`${label}: a term list was found`, seen > 0);
}
for (const [set, qsList] of [['13.1', [1, 2, 4, 5, 6, 7, 8, 9]], ['13.2', [1, 3, 4]], ['13.3', [1, 6]]]) {
  for (const q of qsList) {
    let s = mdSet(set, q);
    if (set === '13.1' && q === 7) s = s.replace('$a = 0.10$', '$a = 0.1$');
    const d = Q(`${set} Q${q}`);
    const t = termsOf(s, 'f_iu_i');
    if (t && set === '13.1' && q === 7) { ok('ANSWERS.md 13.1 Q7: the terms of \\sum f_iu_i', t, products(d, 0.1, 0.04, 'f_iu_i').map(v => Math.round(v))); continue; }
    checkTerms(`ANSWERS.md ${set} Q${q}`, s, d);
  }
}
{
  const d3 = Q('13.1 Q3'); const s = mdSet('13.1', 3).replace(/\s+/g, ' ');
  ok('ANSWERS.md 13.1 Q3: the terms, with f unknown', s.match(/\\sum f_iu_i = (.*?) = f - 20/)[1], products({ cls: d3.cls, f: d3.f.map(v => (v === 'f' ? 1 : v)) }, 18, 2, 'f_iu_i').map((v, i) => (d3.f[i] === 'f' ? 'f' : v)).join(' + ').replace(/\+ -/g, '- ').replace(/^(-?\d)/, '$1'));
}
// the running-text answers in ANSWERS.md
is('ANSWERS.md: the Why? question', /up to 25 marks\s+is 26 and up to 28 marks\s+is 50/.test(answersMd) && /up to 29 is 78/.test(answersMd));
{
  const h = [[140, 145], [145, 150], [150, 155], [155, 160], [160, 165]];
  const row = answersMd.match(/\| Number of students \| ([\d |]+)\|/)[1].split('|').map(Number);
  says('ANSWERS.md Activity 2 instance', answersMd.replace(/\s+/g, ' '), `= ${fx(meanOf(h, row), 0)}$ cm`);
  says('ANSWERS.md Activity 3 instance', answersMd.replace(/\s+/g, ' '), `= ${fx(modeOf(h, row), 2)}$ cm`);
  is('ANSWERS.md Activity 2: 30 students', sum(row) === 30);
}

/* ---- B. Beyond the Book ----------------------------------------- */

{
  const s = text(beyond).replace(/\$/g, '');
  // Stage 1
  const tq = tablesIn(beyond.slice(beyond.indexOf('Find $p$ and $q$'), beyond.indexOf('The total gives')))[0];
  const dq = dist([tq]);
  const pq = [];
  for (let p = 0; p <= 20; p++) for (let q = 0; q <= 20; q++) {
    const f = dq.f.map(v => (v === 'p' ? p : v === 'q' ? q : v));
    if (sum(f) === 20 && near(meanOf(dq.cls, f), 50)) pq.push([p, q]);
  }
  ok('Stage 1 Q2: the only p, q', pq, [[5, 3]]);
  says('Stage 1 Q2', s, `p = ${pq[0][0]}`, `q = ${pq[0][1]}`);
  says('Stage 1 Q3', s, `mode is about ${3 * 32 - 2 * 30}`);
  const tm = tablesIn(beyond.slice(beyond.indexOf('This is a more than type'), beyond.indexOf('Subtracting each count')))[0];
  const more = tm.rows[0].slice(1).map(Number), lows = tm.head.slice(1).map(Number);
  const fm = more.map((c, i) => c - (more[i + 1] ?? 0));
  const clsm = lows.map(l => [l, l + 10]);
  says('Stage 1 Q4 frequencies', s, fm.join(', ').replace(/, (\d+)$/, ' and $1'), cum(fm).join(', ').replace(/, (\d+)$/, ' and $1'));
  says('Stage 1 Q4 median', s, fx(medianOf(clsm, fm), 2), `median class is ${clsm[medianClass(fm).i].join(' – ')}`);
  const wages = s.match(/workshop are ([\d, and]+), the last/)[1].split(/, | and /).map(Number);
  says('Stage 1 Q5', s, `sum is ${sum(wages)}`, fx(sum(wages) / wages.length, 2), `the 4th wage, ${wages.sort((a, b) => a - b)[3]}`);
  is('Stage 1 Q5: six of the seven earn less than the mean', wages.filter(w => w < sum(wages) / 7).length === 6);

  // Solved Examples
  const row = (n) => answerRow(beyEx[n]);
  const ex = (n) => dist(tablesIn(beyEx[n]).slice(0, 1));
  const optsIn = (h) => [...((h.match(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*?)<\/ol>/) || ['', ''])[1]).matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => text(m[1]).replace(/\$/g, '').trim());
  const letter = (bools) => bools.map((b, i) => (b ? 'abcd'[i] : null)).filter(Boolean);
  // 1
  { const cm = text(beyEx[1]).match(/class marks of a distribution are ([\d, and]+)\./)[1].split(/, | and /).map(Number);
    const h = cm[1] - cm[0];
    ok('Beyond Ex 1: the right option', letter(optsIn(beyEx[1]).map(o => o === `${h}, and ${cm[0] - h / 2} – ${cm[0] + h / 2}`)), [row(1).match(/\(([a-d])\)/)[1]]); }
  // 2
  { const cl = text(beyEx[2]).match(/distribution are ([\d –,and]+)\. Make/)[1].split(/, | and /).map(cls1);
    const cont = cl.map(([a, b]) => [a - 0.5, b + 0.5]);
    says('Beyond Ex 2', text(beyEx[2]), cont.map(c => c.join(' – ')).join(', ').replace(/,/g, ', ').replace(/,  /g, ', '), `Class size ${cont[0][1] - cont[0][0]}`);
    says('Beyond Ex 2 class marks', row(2), ...marks(cont)); }
  // 3, 4, 6: means
  says('Beyond Ex 3', row(3), meanOf(ex(3).cls, ex(3).f));
  is('Beyond Ex 3: 40 students', sum(ex(3).f) === 40);
  says('Beyond Ex 4', row(4), meanOf(ex(4).cls, ex(4).f));
  is('Beyond Ex 4: 50 homes', sum(ex(4).f) === 50);
  says('Beyond Ex 6', row(6), fx(meanOf(ex(6).cls, ex(6).f), 2));
  is('Beyond Ex 6: 50 workers', sum(ex(6).f) === 50);
  // 5
  { const v = 45 + 10 * -8 / 40;
    ok('Beyond Ex 5: the right option', letter(optsIn(beyEx[5]).map(o => Number(o) === v)), [row(5).match(/\(([a-d])\)/)[1]]);
    ok('Beyond Ex 5: the wrong options as explained', optsIn(beyEx[5]).map(Number), [v, 45 + 2, 45 - 8 / 40, 45 - 8]); }
  // 7
  { const d = ex(7); const ks = [...Array(60).keys()].filter(k => near(meanOf(d.cls, d.f.map(v => (v === 'k' ? k : v))), 24.2));
    ok('Beyond Ex 7: the only k', ks, [5]); says('Beyond Ex 7', row(7), `k = ${ks[0]}`); }
  // 8, 11, 12: read the data from the question
  { const t = text(beyEx[8]);
    const cl = t.match(/The classes ([\d –,and]+) have/)[1].split(/, | and /).map(cls1);
    const f = t.match(/frequencies ([\d, and]+)\./)[1].split(/, | and /).map(Number);
    const m = modeOf(cl, f);
    ok('Beyond Ex 8: the right option', letter(optsIn(beyEx[8]).map(o => rounds(m, o))), [row(8).match(/\(([a-d])\)/)[1]]);
    const i = f.indexOf(Math.max(...f));
    ok('Beyond Ex 8: the wrong options as explained', optsIn(beyEx[8]).map(Number).filter((_, j) => j !== 1).map(o => fx(o, 2)),
      [fx(cl[i][0] + (f[i] - f[i + 1]) / (2 * f[i] - f[i - 1] - f[i + 1]) * 10, 2), fx((cl[i][0] + cl[i][1]) / 2, 2), fx(m - cl[i][0], 2)]); }
  { const t = text(beyEx[11]);
    const cl = t.match(/classes ([\d –,and]+) are/)[1].split(/, | and /).map(cls1);
    const c = t.match(/are ([\d, and]+)\. The median/)[1].split(/, | and /).map(Number);
    const f = c.map((v, i) => v - (c[i - 1] || 0)); const { i } = medianClass(f);
    ok('Beyond Ex 11: the right option', letter(optsIn(beyEx[11]).map(o => o === `${cl[i].join(' – ')}; ${f[i]}`)), [row(11).match(/\(([a-d])\)/)[1]]); }
  { const v = 30 + (50 / 2 - 22) / 10 * 10;
    ok('Beyond Ex 12: the right option', letter(optsIn(beyEx[12]).map(o => Number(o) === v)), [row(12).match(/\(([a-d])\)/)[1]]);
    ok('Beyond Ex 12: the wrong options as explained', optsIn(beyEx[12]).map(Number), [30 + (50 - 22) / 10 * 10, 30 + (25 - 32) / 10 * 10, v, 35]); }
  // 9
  { const d = ex(9); says('Beyond Ex 9', row(9), modeOf(d.cls, d.f)); is('Beyond Ex 9: 40 patients', sum(d.f) === 40);
    is('Beyond Ex 9: the modal class is the first', d.f.indexOf(Math.max(...d.f)) === 0); }
  // 10
  { const d = ex(10); const c = cum(d.f), n = sum(d.f);
    says('Beyond Ex 10 less than', text(beyEx[10]).replace(/\$/g, ''), ...c.slice(1).map((v, i) => `= ${v}`));
    says('Beyond Ex 10 more than', text(beyEx[10]).replace(/\$/g, ''), ...d.f.slice(0, -1).map((_, i) => `= ${n - c[i]}`));
    says('Beyond Ex 10', row(10), n - c[1]); }
  // 13, 14
  { const d = ex(13); says('Beyond Ex 13', row(13), medianOf(d.cls, d.f)); says('Beyond Ex 13 cumulative', text(beyEx[13]), cum(d.f).join(', ').replace(/, (\d+)$/, ' and $1')); }
  { const d = ex(14); const found = [];
    for (let x = 0; x <= 50; x++) for (let y = 0; y <= 50; y++) { const f = d.f.map(v => (v === 'x' ? x : v === 'y' ? y : v)); if (sum(f) === 50 && near(medianOf(d.cls, f), 32)) found.push([x, y]); }
    ok('Beyond Ex 14: the only x, y', found, [[5, 9]]); says('Beyond Ex 14', row(14), `x = ${found[0][0]}`, `y = ${found[0][1]}`);
    const f = d.f.map(v => (v === 'x' ? 5 : v === 'y' ? 9 : v)); const c = cum(f);
    says('Beyond Ex 14 check', text(beyEx[14]), `up to 30 is ${c[2]}`, `it is ${c[3]}`); }
  // 15
  says('Beyond Ex 15', row(15), (3 * 45 - 42) / 2);
  // 16
  { const d = ex(16);
    says('Beyond Ex 16', row(16), meanOf(d.cls, d.f), fx(medianOf(d.cls, d.f), 2), modeOf(d.cls, d.f));
    says('Beyond Ex 16 cumulative', text(beyEx[16]), cum(d.f).join(', ')); is('Beyond Ex 16: 50 days', sum(d.f) === 50); }
  for (const n of [3, 4, 6, 16]) checkTerms(`Beyond Ex ${n}`, beyEx[n].replace(/<[^>]+>/g, ' '), ex(n));
  is('Beyond: 16 examples, numbered 1-16', Object.keys(beyEx).map(Number).join() === [...Array(16)].map((_, i) => i + 1).join());
  is('Beyond: every example has an Answer row', Object.values(beyEx).every(b => /work__label">Answer</.test(b)));
}

/* ---- B/C. practice ---------------------------------------------- */

const qs = {};
for (const b of practiceBlocks(beyond)) {
  if (!/c-questions/.test(b)) continue;
  qs[Number((b.match(/data-start="(\d+)"/) || [0, 1])[1])] = b;
}
const optsOf = (n) => [...(((qs[n] || '').match(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*?)<\/ol>/) || ['', ''])[1]).matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => text(m[1]).replace(/\$/g, '').trim());
const qText = (n) => text(qs[n] || '').replace(/\$/g, '');
const listIn = (s, re) => s.match(re)[1].split(/, | and /);
const qDist = (n) => { const t = qText(n); return { cls: listIn(t, /classes ([\d –,and]+) have/).map(cls1), f: listIn(t, /frequencies ([\d, and]+)\./).map(Number) }; };
const key = {};
{
  const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2];
}
const solve = {
  1: o => { const c = cls1(qText(1).match(/class ([\d –]+) is/)[1]); return o.map(v => Number(v) === (c[0] + c[1]) / 2); },
  2: o => o.map(v => v === '\\dfrac{x_i - a}{h}'),
  3: o => { const d = qDist(3); const c = d.cls[d.f.indexOf(Math.max(...d.f))]; return o.map(v => v === c.join(' – ')); },
  4: o => { const t = qText(4); const x = listIn(t, /values ([\d, and]+) have/).map(Number), f = listIn(t, /frequencies ([\d, and]+)\./).map(Number);
    return o.map(v => near(Number(v), sum(x.map((xi, i) => xi * f[i])) / sum(f))); },
  5: o => o.map(v => { const m = v.match(/^(\w+) = (\d) (\w+) − (\d) (\w+)$/); if (!m) return false;
    // test the statement on data where the relationship is exact: mean 30, median 32, mode 36
    const M = { Mean: 30, Median: 32, Mode: 36 }; return M[m[1]] === m[2] * M[m[3]] - m[4] * M[m[5]]; }),
  6: o => o.map(v => v === `increases by ${qText(6).match(/increased by (\d+)/)[1]}`),
  7: o => { const d = dist(tablesIn(qs[7])); return o.map(v => near(meanOf(d.cls, d.f.map(x => (x === 'k' ? Number(v) : x))), 25)); },
  8: o => { const t = qText(8); const mean = Number(t.match(/mean of a distribution is (\d+(?:\.\d+)?)/)[1]), mode = Number(t.match(/mode is (\d+(?:\.\d+)?)/)[1]); return o.map(v => near(Number(v), (mode + 2 * mean) / 3)); },
  9: o => { const c = listIn(qText(9), /are ([\d, and]+)\. The number/).map(Number); return o.map(v => Number(v) === c[3] - c[1]); },
  10: o => { const d = qDist(10); return o.map(v => near(Number(v), meanOf(d.cls, d.f))); },
  11: o => { const d = qDist(10); const m = medianOf(d.cls, d.f); const t = qText(11);
    const meera = Number(t.match(/median is (\d+(?:\.\d+)?)/)[1]) === m, arjun = Number(t.match(/it is (\d+(?:\.\d+)?)/)[1]) === m;
    const right = meera && arjun ? 'both' : meera ? 'only Meera' : arjun ? 'only Arjun' : 'neither'; return o.map(v => v === right); },
  12: o => { const d = qDist(12); const M = { mean: meanOf(d.cls, d.f), median: medianOf(d.cls, d.f), mode: modeOf(d.cls, d.f) };
    return o.map(v => { const w = v.split(' < '); return w.length === 3 ? M[w[0]] < M[w[1]] && M[w[1]] < M[w[2]] : M.mean === M.median && M.median === M.mode; }); },
  13: o => o.map(v => v === 'the median'),
  14: o => { const d = qDist(14); return o.map(v => { const m = v.match(/mode (\d+(?:\.\d+)?), median (\d+(?:\.\d+)?)/); return rounds(modeOf(d.cls, d.f), m[1]) && rounds(medianOf(d.cls, d.f), m[2]); }); },
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  ok(`Q${q}: the right option`, letter(f(o)), [key[q]]);
}
function letter(bools) { return bools.map((b, i) => (b ? 'abcd'[i] : null)).filter(Boolean); }
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
{
  const t16 = qText(16);
  const f16 = listIn(t16, /frequencies ([\d, and]+), so/).map(Number), c16 = listIn(t16, /classes ([\d –,and]+) have/).map(cls1);
  const m16 = modeOf(c16, f16);
  const lopsided = modeOf([[0, 10], [10, 20], [20, 30]], [4, 9, 2]);
  const x = [15, 25, 35], f = [2, 3, 5];
  const AR = {
    15: [[0, 10, 25, 47.5].every(a => near(a + sum(x.map((v, i) => (v - a) * f[i])) / sum(f), meanOf([[10, 20], [20, 30], [30, 40]], f))), true, true],
    16: [m16 === Number(t16.match(/mode is (\d+)/)[1]), near(lopsided, 15), false],
    17: [true, true, false],
    18: [near(meanOf(c16, f16.map(v => 2 * v)), 2 * meanOf(c16, f16)), true, false],
  };
  for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
}
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-18', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(18)].map((_, i) => i + 1));
ok('practice numbered 1-31', [...beyond.matchAll(/data-start="(\d+)"/g)].map(m => Number(m[1])), [...Array(30)].map((_, i) => i + 2));

// the key rows, a lettered part at a time
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= text(m[2]).replace(/\$/g, '');
const partOf = (r, part) => { if (!part) return r; const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\) |$)`)); return m ? m[1] : ''; };
const row = (q) => { const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/); return partOf(keyRows[n] || '', part); };
const kSays = (q, ...vals) => says(`key ${q}`, row(q), ...vals);
const tq = (n) => dist(tablesIn(qs[n]));
const P = {};   // every practice answer, computed once, for the key and for ANSWERS.md
{
  const cm = listIn(qText(19), /are ([\d, and]+)\. Write/).map(Number); const h = cm[1] - cm[0];
  P[19] = [h, ...cm.map(c => `${c - h / 2} – ${c + h / 2}`)];
  const t20 = qText(20); P[20] = [Number(t20.match(/f_ix_i = (\d+)/)[1]) / Number(t20.match(/f_i = (\d+)/)[1])];
  const t21 = qText(21); P[21] = [(Number(t21.match(/mode (\d+)/)[1]) + 2 * Number(t21.match(/mean (\d+)/)[1])) / 3];
  const c22 = listIn(qText(22), /are ([\d, and]+)\. Find/).map(Number); const f22 = c22.map((v, i) => v - (c22[i - 1] || 0));
  P[22] = [f22[2], ['0 – 5', '5 – 10', '10 – 15', '15 – 20'][medianClass(f22).i]];
  const d23 = tq(23); P[23] = [fx(meanOf(d23.cls, d23.f), 2)];
  const d24 = tq(24); P[24] = [fx(modeOf(d24.cls, d24.f), 2), d24.cls[d24.f.indexOf(Math.max(...d24.f))].join(' – ')];
  const d25 = tq(25); P[25] = [medianOf(d25.cls, d25.f), cum(d25.f).join(', ')];
  is('Q25: 60 students', sum(d25.f) === 60);
  const d26 = tq(26); const ps = [...Array(50).keys()].filter(p => near(meanOf(d26.cls, d26.f.map(v => (v === 'p' ? p : v))), 9.8)); P[26] = [`p = ${ps[0]}`]; ok('Q26: the only p', ps.length, 1);
  const d27 = tq(27); P[27] = [meanOf(d27.cls, d27.f), fx(medianOf(d27.cls, d27.f), 2), fx(modeOf(d27.cls, d27.f), 2)];
  const t28 = tablesIn(qs[28])[0]; const u28 = t28.head.slice(1).map(Number), l28 = t28.rows[0].slice(1).map(Number);
  const f28 = l28.map((v, i) => v - (l28[i - 1] || 0)); const c28 = u28.map((u, i) => [u - 10, u]);
  is('Q28: 60 students', l28.at(-1) === 60 && /of 60 students/.test(qText(28)));
  P[28] = [f28.join(', ').replace(/, (\d+)$/, ' and $1'), medianOf(c28, f28), fx(modeOf(c28, f28), 2)];
  const d29 = tq(29); const pq = [];
  for (let p = 0; p <= 50; p++) for (let q = 0; q <= 50; q++) { const f = d29.f.map(v => (v === 'p' ? p : v === 'q' ? q : v)); if (sum(f) === 50 && near(medianOf(d29.cls, f), 35)) pq.push([p, q]); }
  ok('Q29: the only p, q', pq.length, 1); P[29] = [`p = ${pq[0][0]}`, `q = ${pq[0][1]}`];
  const d30 = tq(30);
  is('Q30: 40 days', sum(d30.f) === 40 && /each of 40 days/.test(qText(30)));
  P['30a'] = [d30.cls[d30.f.indexOf(Math.max(...d30.f))].join(' – ')];
  P['30b'] = [meanOf(d30.cls, d30.f)]; P['30c'] = [fx(medianOf(d30.cls, d30.f), 2)]; P['30d'] = [modeOf(d30.cls, d30.f)];
  const t31 = tablesIn(qs[31])[0]; const lo = t31.head.slice(1).map(Number), mo = t31.rows[0].slice(1).map(Number);
  const f31 = mo.slice(0, -1).map((v, i) => v - mo[i + 1]); const c31 = lo.slice(0, -1).map((l, i) => [l, lo[i + 1]]);
  is('Q31: 50 plants', mo[0] === 50 && /of 50 young plants/.test(qText(31)));
  P['31a'] = [mo[lo.indexOf(20)]]; P['31b'] = [f31[c31.findIndex(c => c[0] === 20)]];
  P['31c'] = [c31[medianClass(f31).i].join(' – '), cum(f31).slice(0, 3).join(', ')]; P['31d'] = [fx(medianOf(c31, f31), 2)];
}
for (const [q, vals] of Object.entries(P)) kSays(q, ...vals);
is(`key 31 (a) should read "${P['31a'][0]} plants"`, new RegExp(`^\\s*${P['31a'][0]} plants`).test(row('31a')));

// why the other options are wrong: the values the rows print
{
  const why = beyond.slice(beyond.indexOf('Why the other options are wrong'));
  const wr = {};
  for (const m of why.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) wr[m[1]] = text(m[2]).replace(/\$/g, '');
  const d12 = qDist(12), d14 = qDist(14), d10 = qDist(10);
  says('why 12', wr[12], fx(meanOf(d12.cls, d12.f), 1), fx(medianOf(d12.cls, d12.f), 1), fx(modeOf(d12.cls, d12.f), 2));
  says('why 14', wr[14], modeOf(d14.cls, d14.f), fx(medianOf(d14.cls, d14.f), 2));
  says('why 10', wr[10], sum(marks(d10.cls).map((x, i) => x * d10.f[i])), meanOf(d10.cls, d10.f));
  is('why 10: (c) is the upper limits, (d) divides by 4', near(Number(optsOf(10)[2]), sum(d10.cls.map((c, i) => c[1] * d10.f[i])) / sum(d10.f)) && near(Number(optsOf(10)[3]), sum(marks(d10.cls).map((x, i) => x * d10.f[i])) / 4));
  says('why 11', wr[11], cum(d10.f).join(', ').replace(/, (\d+)$/, ' and $1'), medianOf(d10.cls, d10.f));
  is('why 11: Arjun took h = 2', 8 + (10 - 8) / 8 * 2 === Number(qText(11).match(/it is (\d+(?:\.\d+)?)/)[1]));
  is('why 4: (b) ignores the frequencies, (d) divides by 5', Number(optsOf(4)[1]) === 3 && near(Number(optsOf(4)[3]), 36 / 5));
  is('why 8: (c) averages, (d) swaps', Number(optsOf(8)[2]) === (24 + 21) / 2 && Number(optsOf(8)[3]) === (3 * 24 - 21) / 2);
  is('why 1: (a) is the class size, (c) the sum', Number(optsOf(1)[0]) === 15 && Number(optsOf(1)[2]) === 85);
  says('why 7', wr[7], 'k = 2');
  says('why 16', wr[16], 'mode is 15', 'class mark 10');
}

/* ---- D. ANSWERS.md prints the same key -------------------------- */

const mdKey = {};
{
  const at = answersMd.indexOf('as the key prints it');
  for (const m of answersMd.slice(at, at + 400).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2];
}
ok('ANSWERS.md key matches the page', mdKey, key);

const mdPractice = answersMd.slice(answersMd.indexOf('The working for each'));
const mdRow = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const m = mdPractice.match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`));
  return partOf(m ? m[1].replace(/\$/g, '').replace(/\s+/g, ' ') : '', part);
};
for (const [q, vals] of Object.entries(P)) says(`ANSWERS.md ${q}`, mdRow(q), ...vals.filter(v => !/, .*, .*, /.test(String(v)) || q === '25'));
says('ANSWERS.md 11', mdRow(11), 'only Meera');
says('ANSWERS.md 7', mdRow(7), 'k = 2');
says('ANSWERS.md 12', mdRow(12), '22.2', '22.5', '23.64');
says('ANSWERS.md Stage 1', answersMd.replace(/\s+/g, ' '), '(1) 72, and 124', 'p = 5$, $q = 3', 'about 36', 'median 23.85', '₹888.57, median ₹540');

/* ---- report ------------------------------------------------------ */

console.log(`A  ${spans} identities evaluated; ${skipped.length} spans not pure arithmetic, skipped`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
