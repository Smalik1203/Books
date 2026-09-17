#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each term, count
   and sum is recomputed from a, d and n (or found by search), and compared
   with what is on the page or in ANSWERS.md.

     node pages/class-10/ch05-arithmetic-progressions/check-numbers.mjs [--skipped]

   Four parts:
     A  every identity set as maths, on every page and in ANSWERS.md, whose
        sides all evaluate (square brackets, mixed numbers such as
        6\frac{1}{2}, and juxtaposed products such as 8(20 - 60) and
        2\sqrt{2} are read)
     B  the claims A cannot check: every example's Answer row, every
        exercise answer in ANSWERS.md, Stage 1, the Solved Examples and the
        practice answers, read back a lettered part at a time
     C  every multiple-choice and assertion-reason question: exactly one
        option is right, and it is the one the key prints
     D  ANSWERS.md prints the same key as the page, and its practice
        working agrees

   Exits non-zero if anything does not hold up. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
let pass = 0;
const fails = [];
const near = (x, y) => Math.abs(x - y) <= 1e-9 * Math.max(1, Math.abs(x), Math.abs(y));
const same = (a, b) => (typeof a === 'number' && typeof b === 'number') ? near(a, b)
  : Array.isArray(a) && Array.isArray(b) ? a.length === b.length && a.every((x, i) => same(x, b[i]))
  : JSON.stringify(a) === JSON.stringify(b);
const ok = (what, got, want) => {
  if (same(got, want)) pass++;
  else fails.push(`${what}\n      computed ${JSON.stringify(got)}\n      printed  ${JSON.stringify(want)}`);
};
const is = (what, cond) => { if (cond) pass++; else fails.push(what); };

/* ---- the mathematics ----------------------------------------- */

const term = (a, d, n) => a + (n - 1) * d;
const sum = (a, d, n) => n / 2 * (2 * a + (n - 1) * d);
const nOf = (a, d, l) => (l - a) / d + 1;                         // which term l is; not always whole
const isAP = (xs) => xs.every((x, i) => i < 2 || near(x - xs[i - 1], xs[1] - xs[0]));
const whole = (x) => Math.abs(x - Math.round(x)) < 1e-9;
const find = (f, from = 1, to = 1000) => { const o = []; for (let n = from; n <= to; n++) if (f(n)) o.push(n); return o; };
const count = (lo, hi, f) => { let c = 0; for (let x = lo; x <= hi; x++) if (f(x)) c++; return c; };
const total = (lo, hi, f) => { let s = 0; for (let x = lo; x <= hi; x++) if (f(x)) s += x; return s; };
// the AP with given a_p = u and a_q = v
const fromTwo = (p, u, q, v) => { const d = (v - u) / (q - p); return { a: u - (p - 1) * d, d }; };

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<span class="nb">([^<]*)<\/span>/g, '$1')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/&rsquo;|’/g, "'")
  .replace(/\s+/g, ' ').trim();

/* ---- A. every identity ---------------------------------------- */

function toExpr(side) {
  let s = side
    .replace(/\\left|\\right/g, '')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'Math.sqrt[$1]')                  // before \frac, so its braces do not nest
    .replace(/(\d+)\\[td]?frac\{(\d+)\}\{(\d+)\}/g, '($1+$2/$3)')      // a mixed number, 6\frac{1}{2}
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/Math\.sqrt\[([^\]]+)\]/g, 'Math.sqrt($1)')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad/g, '')
    .replace(/\[/g, '(').replace(/\]/g, ')')
    .replace(/\^\{([^{}]+)\}/g, '**($1)').replace(/\^(\d)/g, '**$1')
    .replace(/\s+/g, '');
  if (!s || !/^(Math\.sqrt|[-+*/().,0-9])+$/.test(s)) return null;
  if (/,/.test(s)) return null;                                      // a list, not a number
  return s.replace(/\)\(/g, ')*(').replace(/(\d)\(/g, '$1*(').replace(/\)(\d)/g, ')*$1')
    .replace(/([0-9)])(Math\.sqrt)/g, '$1*$2');                      // 2\sqrt{2} and 8(20 - 60) are products
}
const evalExpr = (e) => { try { return Function(`"use strict";return (${e})`)(); } catch { return NaN; } };

// a side in the letters a, b, c, d, k, l, n, p, x: 3n, 2ab and (n - 1)d are products
const VARS = 'abcdklnpx';
function toPoly(side) {
  if (/_|\\text|\\ldots|\\cdots|\\circ/.test(side)) return null;
  let s = side
    .replace(/\\left|\\right/g, '')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'Math.sqrt[$1]')
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/Math\.sqrt\[([^\]]+)\]/g, 'S($1)')
    .replace(/\\times/g, '*').replace(/\\,|\\ |\\;|\\quad|\\qquad/g, '')
    .replace(/\[/g, '(').replace(/\]/g, ')')
    .replace(/\^\{([^{}]+)\}/g, '**($1)').replace(/\^(\d)/g, '**$1')
    .replace(/\s+/g, '');
  if (!s || !new RegExp(`^[-+*/().0-9S${VARS}]+$`).test(s) || !new RegExp(`[${VARS}]`).test(s)) return null;
  const V = `[${VARS}]`;
  for (let k = 0; k < 3; k++) s = s
    .replace(new RegExp(`([0-9)]|${V})(${V}|\\(|S)`, 'g'), '$1*$2')
    .replace(new RegExp(`(${V}|\\))(\\d)`, 'g'), '$1*$2');
  return s.replace(/S\*\(/g, 'S(').replace(/\*\*\*/g, '**');
}
const evalPoly = (e, env) => { try { return Function('S', ...VARS, `"use strict";return (${e})`)(Math.sqrt, ...[...VARS].map(v => env[v])); } catch { return NaN; } };
const ENVS = [{ a: 1.7, b: 0.3, c: 2.9, d: -0.8, k: 1.3, l: 3.1, n: 2.6, p: 0.7, x: 1.9 }, { a: -2.2, b: 1.1, c: 0.4, d: 1.6, k: -0.9, l: 0.5, n: 7.3, p: 2.3, x: -1.4 }];
let polys = 0;

function splitParts(span) {
  const out = []; let depth = 0, cur = '';
  for (let i = 0; i < span.length; i++) {
    const ch = span[i];
    if ('({['.includes(ch)) depth++;
    if (')}]'.includes(ch)) depth--;
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
  const src = raw.replace(/\$\$/g, '$');                               // display maths first
  for (const m of src.matchAll(/\$([^$]+)\$/g)) {
    const span = m[1];
    if (!span.includes('=') || /\\neq|\\leq|\\geq|\\lt|\\gt|<|>/.test(span)) continue;
    for (const part of splitParts(span.replace(/^\{(.*)\}$/s, '$1'))) {
      const sides = part.split('=').map(s => s.trim()).filter(Boolean);
      if (sides.length < 2) continue;
      // the sides written in letters must be the same expression
      // A chain of three or more sides is a rewriting; two sides may be an equation to solve,
      // so they are not compared. A lone letter first is the thing being named.
      const chain = sides.length >= 3 ? (/^[a-zA-Z]$/.test(sides[0]) ? sides.slice(1) : sides) : [];
      const lp = chain.map(toPoly).filter(Boolean);
      // the conditions a chain is written under: Q25 has a = -8d, Q26 has n from its first line
      const envs = ENVS.map(e => /28d|18d/.test(part) ? { ...e, a: -8 * e.d }
        : /2\(b - a\)/.test(part) ? { ...e, n: (e.b + e.c - 2 * e.a) / (e.b - e.a) } : e);
      if (lp.length >= 2) {
        const bad = envs.some(env => { const v = lp.map(e => evalPoly(e, env)); return v.some(x => !Number.isFinite(x)) || v.some(x => !near(x, v[0])); });
        const nan = envs.some(env => lp.some(e => !Number.isFinite(evalPoly(e, env))));
        if (!nan) { polys++; if (bad) fails.push(`${f}: $${part.trim()}$ — the sides in letters differ`); else pass++; }
      }
      let vals = sides.map(toExpr);
      if (vals.filter(Boolean).length >= 2) vals = vals.filter(Boolean);
      if (vals.some(v => !v) || vals.length < 2) { skipped.push(`${f}: $${part.trim()}$`); continue; }
      const nums = vals.map(evalExpr);
      if (nums.some(n => !Number.isFinite(n))) { skipped.push(`${f}: $${part.trim()}$`); continue; }
      spans++;
      if (nums.some(n => !near(n, nums[0]))) fails.push(`${f}: $${part.trim()}$ — sides are ${nums.join(' and ')}`);
      else pass++;
    }
  }
}

/* ---- B. claims arithmetic alone does not check ---------------- */

// "says": a printed phrase contains the value as a whole number (not part of a longer one)
const has = (s, v) => new RegExp(`(^|[^\\d.])${String(v).replace(/[.\\]/g, m => '\\' + m)}([^\\d]|\\.\\D|\\.?$)`).test(s);
const saysIn = (where, s, ...vals) => { for (const v of vals) is(`${where} should say ${v}: "${s}"`, has(s, v)); };

// the Answer row of Example k, in the body or in Beyond
const answerRow = (src, k) => {
  const i = src.indexOf(`c-example__tab">Example ${k}<`);
  if (i < 0) return '';
  const m = src.slice(i).match(/work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/);
  return m ? text(m[1]).replace(/\$/g, '') : '';
};
const exBody = (k, ...v) => saysIn(`body Example ${k} Answer`, answerRow(body, k), ...v);
const exBeyond = (k, ...v) => saysIn(`Beyond Example ${k} Answer`, answerRow(beyond, k), ...v);
const exLetter = (k, want) => ok(`Beyond Example ${k}: the right option`, want, answerRow(beyond, k).replace(/[()\s]/g, ''));
const exOpts = (k) => { const i = beyond.indexOf(`c-example__tab">Example ${k}<`); const m = beyond.slice(i).match(/c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/); return m ? [...m[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => text(x[1]).replace(/\$/g, '')) : []; };
const pick = (opts, f) => opts.map((o, i) => f(o) ? 'abcd'[i] : null).filter(Boolean).join('');

// section 5.1: the lists
ok('5.1 (ii) ladder: eight rungs from 45 by -2', term(45, -2, 8), 31);
ok('5.1 (iii) savings, x 5/4 every 3 years', [1, 2, 3, 4].map(k => 8000 * (5 / 4) ** k), [10000, 12500, 15625, 19531.25]);
is('5.1 (iii) is not an AP', !isAP([10000, 12500, 15625, 19531.25]));
is('5.1 (vi) 1, 1, 2, 3, 5, 8: each is the sum of the two before', [2, 3, 5, 8].every((x, i) => x === [1, 1, 2, 3, 5, 8][i] + [1, 1, 2, 3, 5, 8][i + 1]));
// section 5.2
ok('5.2 (a): 147 to 157 by 1 has 11 terms', nOf(147, 1, 157), 11);
ok('5.2 (b): -3.1 to -2.5 by 0.1 has 7 terms', Math.round(nOf(-3.1, 0.1, -2.5)), 7);
ok('5.2 (c): 950 to 50 by -50 has 19 terms', nOf(950, -50, 50), 19);
ok('5.2 (d): 200 to 750 by 50 is Classes I to XII', nOf(200, 50, 750), 12);
ok('5.2: a = 0, d = 1 1/2', [0, 1, 2, 3, 4].map(n => term(0, 1.5, n + 1)), [0, 1.5, 3, 4.5, 6]);
// 5.3 Reena
ok('Reena: 15th and 25th years', [term(8000, 500, 15), term(8000, 500, 25)], [15000, 20000]);

// body examples, from their Answer rows
ok('Ex 1', [3 / 2, 1 / 2 - 3 / 2], [1.5, -1]);
{ const next = (xs) => [xs[3] + xs[1] - xs[0], xs[3] + 2 * (xs[1] - xs[0])];
  is('Ex 2 (i), (ii) are APs; (iii), (iv) are not', isAP([4, 10, 16, 22]) && isAP([1, -1, -3, -5]) && !isAP([-2, 2, -2, 2, -2]) && !isAP([1, 1, 1, 2, 2, 2, 3, 3, 3]));
  const r = answerRow(body, 2), [p1, p2] = r.split('(ii)');
  saysIn('Ex 2 (i)', p1, 10 - 4, ...next([4, 10, 16, 22]));
  saysIn('Ex 2 (ii)', p2, ...next([1, -1, -3, -5])); }
exBody(3, 10, term(2, 5, 10));
ok('Ex 3: the first ten terms, as the Check row prints them', body.match(/first ten terms are ([\d, ]+)/)[1].split(', ').map(Number), [...Array(10)].map((_, i) => term(2, 5, i + 1)));
exBody(4, nOf(21, -3, -81), nOf(21, -3, 0));
{ const { a, d } = fromTwo(3, 5, 7, 9); exBody(5, ...[1, 2, 3, 4, 5].map(n => term(a, d, n))); ok('Ex 5: a and d', [a, d], [3, 1]); }
is('Ex 6: 301 is not a term', !whole(nOf(5, 6, 301)));
ok('Ex 6: n', nOf(5, 6, 301), 151 / 3);
exBody(7, count(10, 99, x => x % 3 === 0), 3);
ok('Ex 7: n by the formula', nOf(12, 3, 99), 30);
{ const n = nOf(10, -3, -62); ok('Ex 8: number of terms', n, 25);
  exBody(8, 11, term(10, -3, n - 11 + 1));
  ok('Ex 8: the reversed AP', term(-62, 3, 11), term(10, -3, n - 10)); }
exBody(9, 1000 * 8 * 1 / 100, 1000 * 8 * 2 / 100, 1000 * 8 * 3 / 100, 30, term(80, 80, 30));
exBody(10, nOf(23, -2, 5));
ok('Shakila: 21 birthdays', sum(100, 50, 21), 12600);
ok('Gauss', total(1, 100, () => true), 5050);
exBody(11, 22, sum(8, -5, 22));
{ const d = (1050 / 7 - 20) / 13; ok('Ex 12: d', d, 10); exBody(12, 20, term(10, d, 20)); }
{ const ns = find(n => near(sum(24, -3, n), 78), 1, 100); ok('Ex 13: every n with sum 78', ns, [4, 13]); exBody(13, ...ns);
  ok('Ex 13: terms 5 to 13 add to 0', sum(24, -3, 13) - sum(24, -3, 4), 0); }
exBody(14, 1000, total(1, 1000, () => true));
is('Ex 14 (ii): n(n + 1)/2 for n = 1 to 50', [...Array(50)].every((_, i) => total(1, i + 1, () => true) === (i + 1) * (i + 2) / 2));
{ const t = (n) => 3 + 2 * n; let s = 0; for (let n = 1; n <= 24; n++) s += t(n);
  is('Ex 15: 3 + 2n is an AP', isAP([1, 2, 3, 4, 5].map(t))); exBody(15, 24, s); }
{ const { a, d } = fromTwo(3, 600, 7, 700); ok('Ex 16: a and d', [a, d], [550, 25]);
  const r = answerRow(body, 16);
  saysIn('Ex 16 (i)', r.split('(ii)')[0], a);
  saysIn('Ex 16 (ii)', r.split('(ii)')[1].split('(iii)')[0], 10, term(a, d, 10));
  saysIn('Ex 16 (iii)', r.split('(iii)')[1], 7, sum(a, d, 7)); }
ok('the tip: b = (a + c)/2 for 3, 7, 11', (3 + 11) / 2, 7);

// ANSWERS.md, question by question: ### Exercise Set 5.x, then "N. " items, then "(i)" parts
const mdSet = (s) => { const i = answersMd.indexOf(`### Exercise Set ${s}`); const j = answersMd.indexOf('\n#', i + 5); return answersMd.slice(i, j < 0 ? undefined : j); };
const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii', 'xiii', 'xiv', 'xv'];
const mdQ = (s, q, part) => {
  const src = mdSet(s);
  const m = src.match(new RegExp(`\\n${q}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`));
  let r = m ? m[1].replace(/\s+/g, ' ') : '';
  if (part) { const p = r.match(new RegExp(`- \\(${part}\\) (.*?)(?= - \\((?:${ROMAN.join('|')})\\) |$)`)); r = p ? p[1] : ''; }
  return r.trim().replace(/\$/g, '').replace(/(\d)\\frac\{(\d+)\}\{(\d+)\}/g, '$1 $2/$3').replace(/\\frac\{(\d+)\}\{(\d+)\}/g, '$1/$2').replace(/\\sqrt\{(\d+)\}/g, 'r$1');
};
const md = (s, q, part, ...vals) => saysIn(`ANSWERS ${s} Q${q}${part ? ` (${part})` : ''}`, mdQ(s, q, part), ...vals);
const frac = (x) => { for (let den = 1; den <= 100; den++) if (whole(x * den)) return den === 1 ? String(Math.round(x)) : `${Math.round(x * den)}/${den}`; return String(x); };

// Set 5.1
md('5.1', 1, 'i', term(15, 8, 2), term(15, 8, 3), 8); is('5.1 Q1 (i) AP', /An AP/.test(mdQ('5.1', 1, 'i')));
is('5.1 Q1 (ii) not an AP', !isAP([1, 3 / 4, 9 / 16]) && /Not an AP/.test(mdQ('5.1', 1, 'ii')));
md('5.1', 1, 'iii', term(150, 50, 2), term(150, 50, 3), 50);
md('5.1', 1, 'iv', 10000 * 1.08, Math.round(10000 * 1.08 ** 2), 800, Math.round(10000 * 1.08 ** 2 - 10800));
is('5.1 Q1 (iv) not an AP', !isAP([10000, 10800, 11664]) && /Not an AP/.test(mdQ('5.1', 1, 'iv')));
md('5.1', 2, 'i', ...[1, 2, 3, 4].map(n => term(10, 10, n)));
md('5.1', 2, 'iii', ...[1, 2, 3, 4].map(n => term(4, -3, n)));
is('5.1 Q2 (iv)', mdQ('5.1', 2, 'iv').replace(/\s/g, '') === '-1,-1/2,0,1/2');
is('5.1 Q2 (v)', mdQ('5.1', 2, 'v').split(',').map(Number).every((x, i) => near(x, term(-1.25, -0.25, i + 1))));
md('5.1', 3, 'i', 3); md('5.1', 3, 'ii', 4); md('5.1', 3, 'iv', 1.1);
is('5.1 Q3 (iii) d = 4/3', mdQ('5.1', 3, 'iii').includes('= 4/3'));
{ // Q4: AP or not, and the next three terms
  const lists = { i: [2, 4, 8, 16], ii: [2, 2.5, 3, 3.5], iii: [-1.2, -3.2, -5.2, -7.2], iv: [-10, -6, -2, 2], v: [0, 1, 2, 3].map(k => 3 + k * Math.SQRT2),
    vi: [0.2, 0.22, 0.222, 0.2222], vii: [0, -4, -8, -12], viii: [-0.5, -0.5, -0.5, -0.5], ix: [1, 3, 9, 27], xii: [2, 8, 18, 32].map(Math.sqrt),
    xiii: [3, 6, 9, 12].map(Math.sqrt), xiv: [1, 9, 25, 49], xv: [1, 25, 49, 73] };
  for (const [p, xs] of Object.entries(lists)) {
    const r = mdQ('5.1', 4, p), ap = isAP(xs);
    is(`5.1 Q4 (${p}) is ${ap ? '' : 'not '}an AP: "${r}"`, ap ? /^An AP/.test(r) || /so it is an AP/.test(r) : /^Not an AP/.test(r));
  }
  md('5.1', 4, 'iii', -9.2, -11.2, -13.2); md('5.1', 4, 'iv', 6, 10, 14); md('5.1', 4, 'vii', -16, -20, -24); md('5.1', 4, 'xv', 24, 97, 121, 145);
  md('5.1', 4, 'ii', 4, 5); is('5.1 Q4 (ii) 9/2', mdQ('5.1', 4, 'ii').includes('9/2'));
  md('5.1', 4, 'xii', ...[5, 6, 7].map(k => `r${2 * k * k}`));
  md('5.1', 4, 'xiv', 8, 16, 24);
  is('5.1 Q4 (xi): a, a^2, a^3 is an AP only for a = 0 or 1', find(a => isAP([a, a * a, a ** 3, a ** 4]), -20, 20).join() === '0,1' && /a = 0 or a = 1/.test(mdQ('5.1', 4, 'xi')));
}

// Set 5.2
md('5.2', 1, 'i', term(7, 3, 8)); md('5.2', 1, 'ii', (0 + 18) / 9); md('5.2', 1, 'iii', -5 + 17 * 3);
md('5.2', 1, 'iv', nOf(-18.9, 2.5, 3.6)); md('5.2', 1, 'v', term(3.5, 0, 105));
{ const o1 = [97, 77, -77, -87], o2 = [28, 22, -38, -48.5];
  ok('5.2 Q2 (i) letter', 'abcd'[o1.indexOf(term(10, -3, 30))], mdQ('5.2', 2, 'i').match(/\*\*\((\w)\)/)[1]);
  ok('5.2 Q2 (ii) letter', 'abcd'[o2.indexOf(term(-3, 2.5, 11))], mdQ('5.2', 2, 'ii').match(/\*\*\((\w)\)/)[1]); }
const boxes = (u, v, gaps) => [...Array(gaps + 1)].map((_, k) => u + k * (v - u) / gaps);
md('5.2', 3, 'i', ...boxes(2, 26, 2));
md('5.2', 3, 'ii', ...boxes(13, 3, 2).concat([18]));
md('5.2', 3, 'iv', ...boxes(-4, 6, 5));
md('5.2', 3, 'v', ...boxes(38, -22, 4).concat([53]));
is('5.2 Q3 (iii): 5, 6 1/2, 8, 9 1/2', same(boxes(5, 9.5, 3), [5, 6.5, 8, 9.5]) && /^5, 6 1\/2, 8, 9 1\/2 /.test(mdQ('5.2', 3, 'iii')));
md('5.2', 4, null, `${nOf(3, 5, 78)}th`);
md('5.2', 5, 'i', nOf(7, 6, 205)); md('5.2', 5, 'ii', nOf(18, -2.5, -47));
is('5.2 Q6: -150 is not a term', !whole(nOf(11, -3, -150)) && /No/.test(mdQ('5.2', 6)));
{ const { a, d } = fromTwo(11, 38, 16, 73); md('5.2', 7, null, d, a, term(a, d, 31)); }
{ const { a, d } = fromTwo(3, 12, 50, 106); md('5.2', 8, null, d, a, term(a, d, 29)); }
{ const { a, d } = fromTwo(3, 4, 9, -8); md('5.2', 9, null, `${nOf(a, d, 0)}th`); }
md('5.2', 10, null, 7 / (17 - 10));
md('5.2', 11, null, term(3, 12, 54), `${nOf(3, 12, term(3, 12, 54) + 132)}th`);
{ const [a, b, d] = [150, 50, 7]; md('5.2', 12, null, term(a, d, 1000) - term(b, d, 1000)); is('5.2 Q12: 100th terms differ by 100', term(a, d, 100) - term(b, d, 100) === 100); }
md('5.2', 13, null, count(100, 999, x => x % 7 === 0));
md('5.2', 14, null, count(11, 249, x => x % 4 === 0));
md('5.2', 15, null, find(n => term(63, 2, n) === term(3, 7, n))[0]);
{ const d = 12 / 2, a = 16 - 2 * d; md('5.2', 16, null, ...[1, 2, 3, 4].map(n => term(a, d, n))); }
{ const n = nOf(3, 5, 253); md('5.2', 17, null, n, `${n - 20 + 1}nd`, term(3, 5, n - 19)); }
{ const d = (44 - 24) / 4, a = (24 - 10 * d) / 2; md('5.2', 18, null, ...[1, 2, 3].map(n => term(a, d, n))); }
{ const n = nOf(5000, 200, 7000); md('5.2', 19, null, n, 1995 + n - 1); }
md('5.2', 20, null, nOf(5, 1.75, 20.75));

// Set 5.3
md('5.3', 1, 'i', sum(2, 5, 10)); md('5.3', 1, 'ii', sum(-37, 4, 12)); md('5.3', 1, 'iii', Math.round(sum(0.6, 1.1, 100)));
is('5.3 Q1 (iv) 33/20', near(sum(1 / 15, 1 / 60, 11), 33 / 20) && mdQ('5.3', 1, 'iv').endsWith('33/20'));
{ const n = nOf(7, 3.5, 84); md('5.3', 2, 'i', n, 1046); is('5.3 Q2 (i) 2093/2', near(n / 2 * (7 + 84), 2093 / 2) && mdQ('5.3', 2, 'i').includes('2093/2')); }
md('5.3', 2, 'ii', nOf(34, -2, 10), sum(34, -2, nOf(34, -2, 10)));
md('5.3', 2, 'iii', nOf(-5, -3, -230), sum(-5, -3, nOf(-5, -3, -230)));
md('5.3', 3, 'i', nOf(5, 3, 50), sum(5, 3, nOf(5, 3, 50)));
{ const d = (35 - 7) / 12; is('5.3 Q3 (ii) d = 7/3', frac(d) === '7/3' && mdQ('5.3', 3, 'ii').includes('7/3')); md('5.3', 3, 'ii', sum(7, d, 13)); }
md('5.3', 3, 'iii', 37 - 33, sum(4, 3, 12));
{ const [d] = find(x => near(sum(15 - 2 * x, x, 10), 125), -20, 20); md('5.3', 3, 'iv', d, 15 - 2 * d, term(15 - 2 * d, d, 10)); }
{ const a = (75 * 2 / 9 - 40) / 2; is('5.3 Q3 (v) a = -35/3, a9 = 85/3', frac(a) === '-35/3' && frac(term(a, 5, 9)) === '85/3' && /-35\/3/.test(mdQ('5.3', 3, 'v')) && /85\/3/.test(mdQ('5.3', 3, 'v'))); }
{ const [n] = find(n => sum(2, 8, n) === 90); md('5.3', 3, 'vi', n, term(2, 8, n)); }
{ const [n] = find(n => n / 2 * (8 + 62) === 210); const d = (62 - 8) / (n - 1); md('5.3', 3, 'vii', n); is('5.3 Q3 (vii) d = 54/5', frac(d) === '54/5' && mdQ('5.3', 3, 'vii').includes('54/5')); }
{ const [n] = find(n => sum(4 - 2 * (n - 1), 2, n) === -14); md('5.3', 3, 'viii', n, 4 - 2 * (n - 1)); }
md('5.3', 3, 'ix', find(d => sum(3, d, 8) === 192, -50, 50)[0]);
md('5.3', 3, 'x', 144 * 2 / 9 - 28);
md('5.3', 4, null, find(n => sum(9, 8, n) === 636)[0]);
{ const n = 400 * 2 / 50; md('5.3', 5, null, n); is('5.3 Q5 d = 8/3', frac((45 - 5) / (n - 1)) === '8/3' && mdQ('5.3', 5).includes('8/3')); }
{ const n = nOf(17, 9, 350); md('5.3', 6, null, n, sum(17, 9, n)); }
md('5.3', 7, null, 149 - 21 * 7, sum(149 - 147, 7, 22));
md('5.3', 8, null, sum(10, 4, 51));
{ const [a, d] = [1, 2]; is('5.3 Q9: a = 1, d = 2 fit both sums', sum(a, d, 7) === 49 && sum(a, d, 17) === 289);
  is('5.3 Q9: S_n = n^2', [...Array(30)].every((_, i) => sum(a, d, i + 1) === (i + 1) ** 2) && /= n\^2/.test(mdQ('5.3', 9))); }
md('5.3', 10, 'i', 3 + 4, sum(7, 4, 15)); md('5.3', 10, 'ii', 9 - 5, sum(4, -5, 15));
{ const S = (n) => 4 * n - n * n; const t = (n) => S(n) - S(n - 1);
  is('5.3 Q11: a_n = 5 - 2n', [1, 2, 3, 10, 20].every(n => t(n) === 5 - 2 * n) && mdQ('5.3', 11).includes('5 - 2n'));
  md('5.3', 11, null, S(1), S(2), t(2), t(3), t(10)); }
md('5.3', 12, null, sum(6, 6, 40));
md('5.3', 13, null, sum(8, 8, 15));
md('5.3', 14, null, count(0, 50, x => x % 2 === 1), total(0, 50, x => x % 2 === 1));
md('5.3', 15, null, sum(200, 50, 30));
{ const a = (700 * 2 / 7 + 120) / 2; md('5.3', 16, null, ...[1, 2, 3, 4, 5, 6, 7].map(n => term(a, -20, n))); }
md('5.3', 17, null, 3 * total(1, 12, () => true));
md('5.3', 18, null, sum(0.5, 0.5, 13), Math.round(22 / 7 * sum(0.5, 0.5, 13) * 1e6) / 1e6);
{ const ns = find(n => sum(20, -1, n) === 200); ok('5.3 Q19 roots', ns, [16, 25]); is('5.3 Q19: 25 rows would end at -4', term(20, -1, 25) === -4);
  md('5.3', 19, null, 16, term(20, -1, 16)); }
md('5.3', 20, null, 2 * sum(5, 3, 10));

// Set 5.4
{ const [n] = find(n => term(121, -4, n) < 0); md('5.4', 1, null, `${n}nd`, term(121, -4, n)); }
{ const found = [];
  for (let k = -40; k <= 40; k++) { const d = k / 4, a = 3 - 4 * d; if (near(term(a, d, 3) + term(a, d, 7), 6) && near(term(a, d, 3) * term(a, d, 7), 8)) found.push(sum(a, d, 16)); }
  ok('5.4 Q2: every AP that fits', found.sort((x, y) => x - y), [20, 76]); md('5.4', 2, null, 76, 20); }
md('5.4', 3, null, 250 / 25 + 1, sum(45, -2, 11));
is('5.4 Q3: 11 rungs from 45 to 25', term(45, -2, 11) === 25);
{ const x = find(x => total(1, x - 1, () => true) === total(x + 1, 49, () => true), 1, 49); ok('5.4 Q4', x, [35]); md('5.4', 4, null, 35, total(1, 34, () => true)); }
md('5.4', 5, null, total(1, 15, () => true) * 0.25 * 0.5 * 50);

// Stage 1, as printed in its running text
{ const t = []; for (let d = -20; d <= 20; d++) if ((8 - d) + 8 + (8 + d) === 24 && (8 - d) * 8 * (8 + d) === 440) t.push([8 - d, 8, 8 + d].sort((x, y) => x - y).join());
  ok('Stage 1 Q1', [...new Set(t)], ['5,8,11']); }
{ const [k] = find(k => (2 * k - 1) - (k + 9) === (2 * k + 7) - (2 * k - 1), -100, 100); ok('Stage 1 Q2', [k, k + 9, 2 * k - 1, 2 * k + 7], [18, 27, 35, 43]); }
{ const S = n => 3 * n * n + 5 * n; is('Stage 1 Q3: a_n = 6n + 2', [1, 2, 3, 7, 30].every(n => S(n) - S(n - 1) === 6 * n + 2)); ok('Stage 1 Q3: S1, S2', [S(1), S(2), S(2) - S(1)], [8, 22, 14]); }
{ const E = n => total(1, 2 * n, x => x % 2 === 0); is('Stage 1 Q4: sum of first n evens is n(n+1)', [...Array(40)].every((_, i) => E(i + 1) === (i + 1) * (i + 2)));
  is('Stage 1 Q4: no n gives 200', find(n => E(n) === 200, 1, 50).length === 0); ok('Stage 1 Q4: the list', [1, 2, 3, 4].map(E), [2, 6, 12, 20]); }

// Stage 2, the Solved Examples
{ const t = n => 7 - 4 * n; exLetter(1, pick(exOpts(1).map(Number), v => v === t(2) - t(1)));
  ok('Beyond Ex 1: a1, a2', [t(1), t(2)], [3, -1]); }
{ const r = []; for (const [a, b] of [[1, 2], [3, 7], [-2, 5], [0.5, 4]]) r.push(near(a * a + b * b - (a - b) ** 2, (a + b) ** 2 - (a * a + b * b)) && near((a + b) ** 2 - (a * a + b * b), 2 * a * b));
  is('Beyond Ex 2: (a-b)^2, a^2+b^2, (a+b)^2 differ by 2ab', r.every(Boolean)); }
exLetter(3, 'abcd'[exOpts(3).map(Number).findIndex(v => near(v, term(-5, 2.5, 25)))]);
ok('Beyond Ex 3: the wrong options', [24 * 2.5, -5 + 25 * 2.5, 25 * 2.5], exOpts(3).slice(1).map(Number));
exBeyond(4, 181, `${nOf(5, 8, 181)}rd`, 250); is('Beyond Ex 4: 250 is not a term', !whole(nOf(5, 8, 250)) && near(nOf(5, 8, 250) - 1, 245 / 8));
{ const { a, d } = fromTwo(7, 37, 13, 67); exBeyond(5, ...[1, 2, 3, 4].map(n => term(a, d, n))); }
{ let got; for (let a = -50; a <= 50; a++) for (let d = -20; d <= 20; d++) if (term(a, d, 5) + term(a, d, 9) === 72 && term(a, d, 7) + term(a, d, 12) === 97) got = [a, d];
  exBeyond(6, ...[1, 2, 3, 4].map(n => term(got[0], got[1], n))); }
{ const n = nOf(3, 2, 201); ok('Beyond Ex 7: terms', n, 100); exBeyond(7, term(3, 2, n - 12 + 1));
  is(`Beyond Ex 7: the 12th from the end is the ${n - 12 + 1}th term`, beyond.includes(`12th term from the end is the ${n - 12 + 1}th term`)); }
exBeyond(8, count(101, 299, x => x % 6 === 0));
{ const a10 = 175 * 2 / 10 - 4; exLetter(9, 'abcd'[exOpts(9).map(Number).indexOf(a10)]); ok('Beyond Ex 9: d, and the wrong options', [(a10 - 4) / 9, 4 + a10, 4 + 10 * 3, 175 / 10], [3, ...exOpts(9).slice(0, 3).map(Number)]); }
{ const s = total(10, 99, x => x % 2); exLetter(10, 'abcd'[exOpts(10).map(Number).indexOf(s)]);
  ok('Beyond Ex 10: the wrong options', [total(1, 99, x => x % 2), total(10, 99, () => true), 44 / 2 * (11 + 99)], [2500, 4905, 2420]); }
{ const ns = find(n => sum(54, -3, n) === 513); ok('Beyond Ex 11 roots', ns, [18, 19]); exLetter(11, 'abcd'[exOpts(11).indexOf(ns.join(' or '))]); }
{ const S = n => 5 * n * n - 3 * n; const t = n => S(n) - S(n - 1);
  is('Beyond Ex 12: the terms form an AP', isAP([1, 2, 3, 4, 5].map(t))); exBeyond(12, t(1), t(2), t(3), 12, t(12)); ok('Beyond Ex 12 check row', [S(12), S(11)], [684, 572]); }
{ const [p] = find(p => 13 - (2 * p + 1) === (5 * p - 3) - 13, -50, 50); exBeyond(13, p); ok('Beyond Ex 13: the terms', [2 * p + 1, 13, 5 * p - 3], [9, 13, 17]); }
{ const [n] = find(n => sum(20, 15, n) === 3250); exBeyond(14, n); is('Beyond Ex 14: (n - 20)(3n + 65)', [0, 1, 7].every(x => (x - 20) * (3 * x + 65) === 3 * x * x + 5 * x - 1300)); }
exBeyond(15, `${nOf(15000, 900, 24900)}th`);

// the practice answers, read back out of the key rows
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= text(m[2]).replace(/\$/g, '');
const row = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const r = keyRows[n] || '';
  if (!part) return r;
  const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\)|$)`));
  return m ? m[1] : '';
};
const says = (q, ...vals) => saysIn(`key ${q}`, row(q), ...vals);
{ const d = 3 - 1; is('Q18: 15\\sqrt{2}', /= 15\\sqrt\{2\}\s*$/.test(row(18)) && 1 + 7 * d === 15); }
says(19, nOf(3, 3, 90), total(3, 90, x => x % 3 === 0));
{ const [k] = find(k => (2 * k - 1) - k === (2 * k + 1) - (2 * k - 1), -50, 50); says(20, k, k, 2 * k - 1, 2 * k + 1); }
says(21, sum(5, 3, 12));
{ const w = find(n => sum(10, 5, n) === 1150); ok('Q22: every n with sum 1150', w.length, 1);
  is(`key 22 should end "after ${w[0]} weeks": "${row(22)}"`, new RegExp(`after ${w[0]} weeks\\s*$`).test(row(22)));
  is(`ANSWERS.md 22 should say "${w[0]}** weeks"`, answersMd.includes(`**${w[0]}** weeks`)); }
{ const { a, d } = fromTwo(5, 26, 10, 51); says(23, d, a, term(a, d, 20)); }
says(24, count(10, 99, x => x % 4 === 1), total(10, 99, x => x % 4 === 1));
is('Q25: a_9 = 0 gives a_29 = 2 a_19', [-3, 1, 2.5, 7].every(d => { const a = -8 * d; return term(a, d, 9) === 0 && near(term(a, d, 29), 2 * term(a, d, 19)); }));
is('Q26: the sum formula', [[2, 5, 11], [7, 4, -8], [1, 1.5, 10]].every(([a, b, c]) => { const n = nOf(a, b - a, c); return near(n / 2 * (a + c), (a + c) * (b + c - 2 * a) / (2 * (b - a))); }));
{ let got; for (let a = -50; a <= 50; a++) for (let d = -20; d <= 20; d++) if (3 * term(a, d, 19) === 225 && term(a, d, 35) + term(a, d, 36) + term(a, d, 37) === 429) got = [a, d];
  ok('Q27: the middle and last terms', [term(got[0], got[1], 18) + term(got[0], got[1], 19) + term(got[0], got[1], 20), 3 * term(got[0], got[1], 36)], [225, 429]);
  says(27, 18, 19, 20, 35, 36, 37, got[1], got[0], ...[1, 2, 3].map(n => term(got[0], got[1], n))); }
{ const a = find(a => sum(a, 100, 10) === 33000, 1, 10000)[0]; const [m] = find(n => term(a, 100, n) > 3500);
  says(28, a, m, term(a, 100, m)); }
says('29a', term(30, 2, 25)); says('29b', nOf(30, 2, 60)); says('29c', sum(30, 2, 25));
says('30a', term(3, 0.5, 10)); says('30b', nOf(3, 0.5, 10)); says('30c', sum(3, 0.5, 10));

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] = m[2];
const optsOf = (n) => [...(qs[n] || '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => text(x[1]).replace(/\$/g, '').trim());
const num = (s) => Number(s.replace(/\s*(km|cm)$/, ''));
const key = {};
{
  const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2];
}
const P = 3;
const solve = {
  1: o => o.map(s => near(evalExpr(toExpr(s.replace(/p/g, String(P)))), (1 - P) / P - 1 / P)),
  2: o => o.map(s => isAP(s.split(',').map(Number))),
  3: o => o.map(num).map(v => v === term(5, 4, 10)),
  4: o => o.map(s => near(evalExpr(toExpr(s)), 4 * Math.sqrt(7)) && isAP([7, 28, 63, Number(s.match(/\d+/)[0])].map(Math.sqrt))),
  5: o => o.map(num).map(v => v === nOf(7, 3, 43)),
  6: o => o.map(num).map(v => isAP([2, v, 14])),
  7: o => o.map(num).map(v => total(1, v, () => true) === 210),
  8: o => o.map(num).map(v => { const { a } = fromTwo(4, 11, 8, 23); return v === a; }),
  9: o => o.map(num).map(v => v === (2 * 25 + 15) - (2 * 16 + 12)),
  10: o => o.map(num).map(v => v === sum(10, -4, 16)),
  11: o => o.map(s => { const n = nOf(3, 4, 83), t = term(3, 4, n - 11 + 1); return s === `only ${t === 43 && t !== 47 ? 'Kiran' : 'Lata'}`; }),
  12: o => o.map(num).map(v => whole(v) && near(v / 2 * (-4 + 146), 7171)),
  13: o => o.map(num).map(v => { let t; for (let a = -50; a <= 50; a++) for (let d = -10; d <= 10; d++) if (2 * a + 9 * d === 7 && 2 * a + 19 * d === -3) t = term(a, d, 10); return v === t; }),
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Q${q}: the right option`, right, [key[q]]);
}
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  14: [7 - 12 === -5, 12 - 7 === -5, false],
  15: [!isAP([2, 5, 9, 14]), true, true],
  16: [term(4, 5, 15) === 79, [[1, 2, 5], [4, 5, 15]].every(([a, d, n]) => { let x = a; for (let k = 1; k < n; k++) x += d; return x === a + (n - 1) * d; }), false],
  17: [total(1, 50, () => true) === 1275, true, false],
};
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-17', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(17)].map((_, i) => i + 1));
ok('practice numbered 1-30', [...beyond.matchAll(/data-start="(\d+)"/g)].map(m => Number(m[1])), [...Array(29)].map((_, i) => i + 2));
// the why-the-others rows name the values the options really are
ok('why 10: the wrong options', [-sum(10, -4, 16), 8 * (20 + 16 * -4), 8 * (10 + 15 * -4)], optsOf(10).slice(1).map(num));
ok('why 9: the wrong options', [65, 44, 2 * 5 + 3], optsOf(9).slice(0, 3).map(num));
ok('why 8: the wrong options', [11 - 2 * 3, 11 - 4 * 3], [optsOf(8)[3], optsOf(8)[2]].map(num));
is('why 16: a_15 is 74', has(row(16), term(4, 5, 15)));

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
{ const i = answersMd.indexOf('as the key prints it'); for (const m of answersMd.slice(i, i + 300).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2]; }
ok('ANSWERS.md key matches the page', mdKey, key);

const mdPractice = answersMd.slice(answersMd.indexOf('The working for each'));
const mdRow = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const m = mdPractice.match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`));
  const r = m ? m[1].replace(/\$/g, '').replace(/\s+/g, ' ') : '';
  if (!part) return r;
  const p = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\)|$)`));
  return p ? p[1] : '';
};
const mdSays = (q, ...vals) => saysIn(`ANSWERS.md practice ${q}`, mdRow(q), ...vals);
mdSays(3, term(5, 4, 10)); mdSays(5, nOf(7, 3, 43)); mdSays(7, 20); mdSays(9, 21); mdSays(10, sum(10, -4, 16));
mdSays(12, 101); mdSays(16, term(4, 5, 15)); mdSays(17, 1275);
mdSays(19, 30, total(3, 90, x => x % 3 === 0)); mdSays(20, 3); mdSays(21, sum(5, 3, 12)); mdSays(22, 20);
mdSays(23, 101); mdSays(24, 22, 1210); mdSays(27, 3, 7, 11, term(3, 4, 37)); mdSays(28, 2850, 8, 3550);
mdSays('29a', term(30, 2, 25)); mdSays('29b', 16); mdSays('29c', sum(30, 2, 25));
mdSays('30a', 7.5); mdSays('30b', 15); mdSays('30c', 52.5);
is('ANSWERS.md 18: 15\\sqrt{2}', /15\\sqrt\{2\}\.?\s*$/.test(mdRow(18)));
is('ANSWERS.md Q26 check: AP 2, 5, 8, 11', 2 + 5 + 8 + 11 === (2 + 11) * (5 + 11 - 4) / (2 * 3));

/* ---- report ---------------------------------------------------- */

console.log(`A  ${spans} identities evaluated, ${polys} in letters checked as expressions; ${skipped.length} spans not pure arithmetic, skipped`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
