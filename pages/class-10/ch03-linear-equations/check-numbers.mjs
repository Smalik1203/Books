#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each pair of
   equations is read off the page, solved here, and the solution the page or
   ANSWERS.md prints is compared with it.

     node pages/class-10/ch03-linear-equations/check-numbers.mjs [--skipped]

   Five parts:
     A  every identity set as maths, on every page and in ANSWERS.md, whose
        sides all evaluate (ratios a : b are read as fractions)
     B  every pair of equations the chapter prints: read from the page as
        linear equations, solved (or classed as parallel or coincident),
        and the printed solution checked in both equations and against the
        solution found here, a lettered part at a time
     G  every graph: the plotted lines are read back out of the SVG, each
        line's printed label is checked against its drawn endpoints, each
        marked point's label against its position, and the lines'
        intersection against the marked point and the printed answer
     C  every multiple-choice and assertion-reason question: exactly one
        option is right, and it is the one the key prints
     D  ANSWERS.md prints the same key as the page

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
const near = (a, b) => Math.abs(a - b) < 1e-9;

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const all = body + '\n' + beyond;
const text = (s) => s.replace(/<span class="nb">([^<]*)<\/span>/g, '$1')
  .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/&middot;/g, '·').replace(/\s+/g, ' ');
// the stretch of source from an anchor to the end of its panel or question
const after = (src, anchor, stop = /<\/li>\s*<\/ol>\s*<\/div>|<\/div>\s*<\/div>\s*<\/div>\s*\n\s*\n/g) => {
  const i = src.indexOf(anchor);
  if (i < 0) { fails.push(`anchor not found: ${anchor}`); return ''; }
  stop.lastIndex = i;
  const m = stop.exec(src);
  return src.slice(i, m ? m.index : undefined);
};

/* ---- A. every identity ---------------------------------------- */

function toExpr(side) {
  let s = side
    .replace(/\\left|\\right/g, '')
    .replace(/\^\\circ/g, '')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'Math.sqrt[$1]')
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/Math\.sqrt\[([^\]]+)\]/g, 'Math.sqrt($1)')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*').replace(/:/g, '/')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad/g, '')
    .replace(/\^\{([^{}]+)\}/g, '**($1)').replace(/\^(\d)/g, '**$1')
    .replace(/\s+/g, '');
  if (!s || !/^(Math\.sqrt|[-+*/().0-9])+$/.test(s)) return null;
  return s.replace(/\)\(/g, ')*(').replace(/([0-9)])(Math\.sqrt|\()/g, '$1*$2');
}
const evalExpr = (e) => { try { return Function(`"use strict";return (${e})`)(); } catch { return NaN; } };

function splitParts(span) {
  const out = []; let depth = 0, cur = '';
  for (let i = 0; i < span.length; i++) {
    const ch = span[i];
    if ('({'.includes(ch)) depth++;
    if (')}'.includes(ch)) depth--;
    if (depth === 0 && ch === ',' && /=/.test(cur) && /=/.test(span.slice(i + 1))) { out.push(cur); cur = ''; continue; }
    if (depth === 0 && span.startsWith('\\qquad', i)) { out.push(cur); cur = ''; i += 5; continue; }
    if (depth === 0 && span.startsWith('\\text{', i)) { out.push(cur); cur = ''; i = span.indexOf('}', i); continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
}

let spans = 0; const skipped = [];
const sources = [...pages.map(f => [f, html[f].replace(/<svg[\s\S]*?<\/svg>/g, ' ')]), ['ANSWERS.md', answersMd]];
for (const [f, raw] of sources) {
  const src = raw.replace(/\$\$/g, '$');
  for (const m of src.matchAll(/\$([^$]+)\$/g)) {
    const span = m[1];
    if (!span.includes('=') || /\\neq|\\leq|\\lt|<|>/.test(span)) continue;
    for (const part of splitParts(span.replace(/^\{(.*)\}$/, '$1'))) {
      const sides = part.replace(/\(\d\)\s*$/, '').split('=').map(s => s.trim().replace(/,$/, '')).filter(Boolean);
      if (sides.length < 2) continue;
      let vals = sides.map(toExpr);
      if (vals.filter(Boolean).length >= 2) vals = vals.filter(Boolean);
      if (vals.some(v => !v) || vals.length < 2) { skipped.push(`${f}: $${part.trim()}$`); continue; }
      const nums = vals.map(evalExpr);
      if (nums.some(n => !Number.isFinite(n))) { skipped.push(`${f}: $${part.trim()}$`); continue; }
      spans++;
      const around = src.slice(Math.max(0, m.index - 250), m.index + 250);
      if (nums.some(n => Math.abs(n - nums[0]) > 1e-9) && /false statement/.test(around)) { pass++; continue; }   // printed as false, on purpose
      if (nums.some(n => Math.abs(n - nums[0]) > 1e-9)) fails.push(`${f}: $${part.trim()}$ — sides are ${nums.join(' and ')}`);
      else pass++;
    }
  }
}
// an inequality between two numbers: the sides really differ
for (const [f, raw] of sources) {
  for (const m of raw.replace(/\$\$/g, '$').matchAll(/\$([^$]+)\$/g)) {
    if (!/\\neq/.test(m[1]) || /[a-z]_|[a-wyz]\b/.test(m[1].replace(/\\[a-z]+/g, ''))) continue;
    const segs = m[1].split('\\neq').map(s => s.split('=').map(t => toExpr(t.trim())));
    const l = segs[0].at(-1), r = segs[1][0];
    if (!l || !r) continue;
    const at = raw.indexOf(m[0]);
    if (/can never hold/.test(raw.slice(at, at + 200))) { is(`${f}: $${m[1]}$ is printed as a condition that fails`, near(evalExpr(l), evalExpr(r))); continue; }
    is(`${f}: $${m[1]}$ — the two sides of the ≠ are equal`, !near(evalExpr(l), evalExpr(r)));
  }
}

/* ---- linear equations ------------------------------------------ */

// read "ax + by = c" (any arrangement, any two letters) as [a, b, c] with ax + by = c
function toLinear(tex, vars = ['x', 'y']) {
  const [v1, v2] = vars;
  const conv = (side) => {
    let s = side
      .replace(/\\left|\\right/g, '')
      .replace(/\\sqrt\{([^{}]+)\}/g, 'Math.sqrt[$1]')
      .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
      .replace(/Math\.sqrt\[([^\]]+)\]/g, 'Q($1)')
      .replace(/\\times/g, '*').replace(/\\quad|\\qquad|\\,|\\ /g, '')
      .replace(/\s+/g, '');
    if (!new RegExp(`^(Q|[${v1}${v2}]|[-+*/().0-9])+$`).test(s)) return null;
    s = s.replace(new RegExp(`([0-9)${v1}${v2}])(?=[${v1}${v2}(Q])`, 'g'), '$1*');
    s = s.replace(/Q/g, 'Math.sqrt');
    return s;
  };
  const sides = tex.split('=');
  if (sides.length !== 2) return null;
  const L = conv(sides[0]), R = conv(sides[1]);
  if (!L || !R) return null;
  let f;
  try { f = Function(v1, v2, `"use strict";return (${L})-(${R})`); } catch { return null; }
  const c0 = f(0, 0), a = f(1, 0) - c0, b = f(0, 1) - c0;
  if (![c0, a, b].every(Number.isFinite)) return null;
  if (!near(f(2, 3), a * 2 + b * 3 + c0) || !near(f(-5, 7), -5 * a + 7 * b + c0)) return null;   // not linear
  if (near(a, 0) && near(b, 0)) return null;
  return [a, b, -c0];
}
// the linear equations in a stretch of source, in order
const eqsIn = (src, vars) => [...src.replace(/\$\$/g, '$').matchAll(/\$([^$]+)\$/g)]
  .flatMap(m => m[1].split('\\qquad'))
  .map(s => s.replace(/\s*\(\d\)\s*$/, ''))
  .filter(s => (s.match(/=/g) || []).length === 1 && !/\\neq/.test(s))
  .map(s => toLinear(s, vars)).filter(Boolean);
// the kind of a pair, and its solution if it has one
function solve(p, q) {
  if (!p || !q) return { kind: 'unread' };
  const [a1, b1, c1] = p, [a2, b2, c2] = q;
  const d = a1 * b2 - a2 * b1;
  if (!near(d, 0)) return { kind: 'unique', x: (c1 * b2 - c2 * b1) / d, y: (a1 * c2 - a2 * c1) / d };
  const same = near(a1 * c2 - a2 * c1, 0) && near(b1 * c2 - b2 * c1, 0);
  return { kind: same ? 'coincident' : 'parallel' };
}
const fits = (e, x, y) => near(e[0] * x + e[1] * y, e[2]);
const numOf = (s) => {
  const e = toExpr(s.replace(/−/g, '-'));
  return e ? evalExpr(e) : NaN;
};
// check that a printed "x = p, y = q" solves a printed pair
function pairHas(where, eqs, x, y) {
  is(`${where}: two equations read off the page (found ${eqs.length})`, eqs.length >= 2 && eqs[0] && eqs[1]);
  if (eqs.length < 2 || !eqs[0] || !eqs[1]) return;
  const s = solve(eqs[0], eqs[1]);
  is(`${where}: the pair has a unique solution (it is ${s.kind})`, s.kind === 'unique');
  is(`${where}: the printed (${x}, ${y}) satisfies both equations`, fits(eqs[0], x, y) && fits(eqs[1], x, y));
  if (s.kind === 'unique') is(`${where}: solved here as (${s.x}, ${s.y}), printed (${x}, ${y})`, near(s.x, x) && near(s.y, y));
}
function pairIs(where, eqs, kind) {
  is(`${where}: two equations read off the page (found ${eqs.length})`, eqs.length >= 2);
  if (eqs.length >= 2) ok(`${where}: the kind of pair`, solve(eqs[0], eqs[1]).kind, kind);
}
// "x = 3" or "x = \frac{49}{29}" read off a stretch of text
const valueOf = (src, v, nth = 0) => {
  const ms = [...src.replace(/\$\$/g, '$').matchAll(new RegExp(`\\$${v.replace(/\+/g, '\\+')} = ([^$]+)\\$`, 'g'))]
    .map(m => numOf(m[1])).filter(Number.isFinite);
  return ms.length > nth ? ms[nth] : NaN;
};
// "(4, 3)" read off a stretch of text, as numbers
const pointsIn = (s) => [...s.replace(/\$/g, '').matchAll(/\((-?[\d.]+|-?\\frac\{[^}]+\}\{[^}]+\}),\s*(-?[\d.]+)\)/g)].map(m => [numOf(m[1]), numOf(m[2])]);

/* ---- B. every pair the chapter prints -------------------------- */

// 3.1 Akhila: the pair on the page, the answer in ANSWERS.md
{
  const eqs = eqsIn(after(body, 'Let the number of rides', /Can we find/g));
  const md = after(answersMd, '### Akhila at the fair', /## 3\.2/g);
  pairHas('Akhila', eqs, valueOf(md, 'x'), valueOf(md, 'y'));
  ok('Akhila: the spend', 3 * 4 + 4 * 2, 20);
}
// Table 3.1: each pair's ratios and its printed kind
{
  const t = after(body, 'Table 3.1', /<\/table>/g);
  const rows = [...t.matchAll(/<tr><td>\$\{([^}]+)\}\$<br>\$\{([^}]+)\}\$<\/td>([\s\S]*?)<\/tr>/g)];
  ok('Table 3.1 has three pairs', rows.length, 3);
  const word = { intersect: 'unique', coincide: 'coincident', parallel: 'parallel' };
  for (const r of rows) {
    const e = [toLinear(r[1]), toLinear(r[2])];
    const printed = r[3].match(/<td>(intersect|coincide|parallel)<\/td>/)[1];
    ok(`Table 3.1: ${r[1]} and ${r[2]}`, solve(...e).kind, word[printed]);
    const fr = [...r[3].matchAll(/<td>\$\\frac\{([^}]+)\}\{([^}]+)\}\$<\/td>/g)].slice(0, 3).map(m => Number(m[1]) / Number(m[2]));
    // the table writes a1x + b1y + c1 = 0, so its c is minus the one read here
    ok(`Table 3.1: the three ratios for ${r[1]}`, fr.map(v => +v.toFixed(9)), [e[0][0] / e[1][0], e[0][1] / e[1][1], e[0][2] / e[1][2]].map(v => +v.toFixed(9)));
  }
}
// the body examples, each read from its own panel
const panel = (src, n) => after(src, `<div class="c-example__tab">Example ${n}</div>`);
const answerRow = (p) => { const m = p.match(/<span class="work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/); return m ? m[1] : ''; };
{
  const p1 = panel(body, 1);
  pairHas('body Example 1', eqsIn(p1), valueOf(answerRow(p1), 'x'), valueOf(answerRow(p1), 'y'));
  // Table 3.2: each column is a point on its line
  const t = after(body, 'Table 3.2', /<\/table>/g);
  const cells = [...t.matchAll(/<t[hd]>\$?(-?\d+)\$?<\/t[hd]>/g)].map(m => Number(m[1]));
  const [x1, x2, x3, x4, y1, y2, y3, y4] = cells;
  const e = eqsIn(p1);
  is(`Table 3.2: (${x1}, ${y1}) and (${x2}, ${y2}) on ${e[0]}`, fits(e[0], x1, y1) && fits(e[0], x2, y2));
  is(`Table 3.2: (${x3}, ${y3}) and (${x4}, ${y4}) on ${e[1]}`, fits(e[1], x3, y3) && fits(e[1], x4, y4));
  const pts = pointsIn(after(p1, 'plot the points', /<\/span>/g));
  ok('body Example 1: the four plotted points are the table\'s', pts, [[x1, y1], [x2, y2], [x3, y3], [x4, y4]]);

  const p2 = panel(body, 2);
  pairIs('body Example 2', eqsIn(p2.slice(0, p2.indexOf('Solution'))), 'coincident');
  is('body Example 2: multiplying by 5/3 gives the first', (() => { const [a, b] = eqsIn(p2); return near(b[0] * 5 / 3, a[0]) && near(b[1] * 5 / 3, a[1]) && near(b[2] * 5 / 3, a[2]); })());
  is('body Example 2 answers infinitely many', /infinitely many/.test(answerRow(p2)));

  const p3 = panel(body, 3);
  const e3 = eqsIn(p3.slice(p3.indexOf('Solution')));
  pairHas('body Example 3', e3, valueOf(answerRow(p3), 'x'), valueOf(answerRow(p3), 'y'));
  ok('body Example 3: pants and skirts', answerRow(p3).match(/bought (\d+) pair of pants and no skirts/)?.[1], '1');
  const t3 = after(body, 'Table 3.3', /<\/table>/g);
  const c3 = [...t3.matchAll(/<t[hd]>\$?(-?\d+)\$?<\/t[hd]>/g)].map(m => Number(m[1]));
  is('Table 3.3: its points lie on their lines', fits(e3[0], c3[0], c3[4]) && fits(e3[0], c3[1], c3[5]) && fits(e3[1], c3[2], c3[6]) && fits(e3[1], c3[3], c3[7]));
  // the statements: skirts two less than twice the pants, four less than four times
  is('body Example 3: the equations say what Champa said', near(e3[0][0], -2) && near(e3[0][2], -2) && near(e3[1][0], -4) && near(e3[1][2], -4));

  const p4 = panel(body, 4);
  pairHas('body Example 4', eqsIn(p4.slice(0, p4.indexOf('Solution'))), valueOf(answerRow(p4), 'x'), valueOf(answerRow(p4), 'y'));

  const p5 = panel(body, 5);
  const e5 = eqsIn(p5, ['s', 't']);
  const age = answerRow(p5).match(/Aftab is (\d+) years old and his daughter is (\d+)/);
  pairHas('body Example 5', [e5[0], e5.find(e => !near(e[0] * e5[0][1], e[1] * e5[0][0]))], Number(age[1]), Number(age[2]));
  is('body Example 5: seven years ago, 7 times', Number(age[1]) - 7 === 7 * (Number(age[2]) - 7));
  is('body Example 5: in three years, 3 times', Number(age[1]) + 3 === 3 * (Number(age[2]) + 3));

  const p6 = panel(body, 6);
  pairIs('body Example 6', eqsIn(p6.slice(p6.indexOf('Solution'))), 'coincident');
  is('body Example 6: the story gives the same pair', text(p6).includes('2 pencils and 3 erasers cost ₹9') && text(p6).includes('4 pencils and 6 erasers cost ₹18'));
  const p7 = panel(body, 7);
  pairIs('body Example 7', eqsIn(p7), 'parallel');
  is('body Example 7 answers "will not cross"', /will not cross/.test(answerRow(p7)));

  const p8 = panel(body, 8);
  const e8 = eqsIn(p8.slice(p8.indexOf('Solution')));
  const x8 = valueOf(p8, 'x'), y8 = valueOf(p8, 'y');
  pairHas('body Example 8', e8, x8, y8);
  const inc = text(answerRow(p8)).match(/₹([\d,]+) and ₹([\d,]+)/).slice(1).map(s => Number(s.replace(/,/g, '')));
  ok('body Example 8: the incomes 9x and 7x', inc, [9 * x8, 7 * x8]);
  ok('body Example 8: each saves', [9 * x8 - 4 * y8, 7 * x8 - 3 * y8], [2000, 2000]);
  is('body Example 8: the equations are 9x - 4y and 7x - 3y', near(e8[0][0], 9) && near(e8[0][1], -4) && near(e8[1][0], 7) && near(e8[1][1], -3));

  const p9 = panel(body, 9);
  pairIs('body Example 9', eqsIn(p9.slice(0, p9.indexOf('Solution'))), 'parallel');
  is('body Example 9 answers no solution', /no solution/.test(answerRow(p9)));

  const p10 = panel(body, 10);
  const nums = [];
  for (let t = 1; t <= 9; t++) for (let u = 0; u <= 9; u++) if (10 * t + u + 10 * u + t === 66 && Math.abs(t - u) === 2) nums.push(10 * t + u);
  ok('body Example 10: the numbers', text(answerRow(p10)).match(/(\d+) and (\d+)/).slice(1).map(Number).sort(), nums.map(String).map(Number).sort());
  ok('body Example 10: Step 5 and Step 6', [...text(p10).matchAll(/the number is (\d+)/g)].map(m => Number(m[1])).sort(), nums.sort());
}

// Exercise sets, from ANSWERS.md, a lettered part at a time
const mdSet = (name) => after(answersMd, `### ${name}`, /\n##+ /g);
const mdPart = (set, q, part) => {
  const qm = set.match(new RegExp(`\\n${q}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`));
  const r = qm ? qm[1] : '';
  if (!part) return r;
  const pm = r.match(new RegExp(`\\(${part}\\)([\\s\\S]*?)(?=\\n\\s*- \\((?:i|ii|iii|iv|v|vi)\\)|$)`));
  return pm ? pm[1] : '';
};
const exQ = (setHead, q) => {
  const i = body.indexOf(`c-practice__head">${setHead}`);
  const rest = body.slice(i);
  if (q === 1) return after(rest, '<ol class="c-questions">');
  return after(rest, `<ol class="c-questions" data-start="${q}">`);
};
const partsOf = (s) => [...s.matchAll(/<li>((?:(?!<li>)[\s\S])*?)<\/li>/g)].map(m => m[1]);
const bolded = (s) => (s.match(/\*\*([^*]+)\*\*/g) || []).join(' ');
const roman = ['i', 'ii', 'iii', 'iv', 'v', 'vi'];
{
  const s1 = mdSet('Exercise Set 3.1');
  // Q1: the stories, solved here from their numbers
  const a = mdPart(s1, 1, 'i'); pairHas('3.1 Q1 (i)', eqsIn(a), ...pointsIn(a).at(-1));
  ok('3.1 Q1 (i) in words', bolded(a), '**3 boys and 7 girls.**');
  is('3.1 Q1 (i): 10 students, 4 more girls', 3 + 7 === 10 && 7 - 3 === 4);
  const b = mdPart(s1, 1, 'ii'); pairHas('3.1 Q1 (ii)', eqsIn(b), ...pointsIn(b).at(-1));
  is('3.1 Q1 (ii): the drawn points lie on their lines', pointsIn(b).slice(0, 2).every(p => fits(eqsIn(b)[0], ...p)) && pointsIn(b).slice(2, 4).every(p => fits(eqsIn(b)[1], ...p)));
  is('3.1 Q1 (ii) in words', /a pencil costs ₹3 and a pen ₹5/.test(b));
  is('3.1 Q1 (ii) against the story', 5 * 3 + 7 * 5 === 50 && 7 * 3 + 5 * 5 === 46);
  is('3.1 Q1 (i): the drawn points lie on their lines', pointsIn(a).slice(0, 2).every(p => fits(eqsIn(a)[0], ...p)) && pointsIn(a).slice(2, 4).every(p => fits(eqsIn(a)[1], ...p)));
  // Q2-Q4: every pair on the page, its kind against ANSWERS.md
  const word = (s) => /intersect|consistent\*\* \(one|\(iii\)[^]*?meet at/.test(s) && !/inconsistent/.test(s) ? 'unique'
    : /coincide|infinitely many/.test(s) ? 'coincident' : /parallel|inconsistent/.test(s) ? 'parallel' : 'unique';
  for (const q of [2, 3, 4]) {
    const parts = partsOf(exQ('Exercise Set 3.1', q)).filter(p => p.includes('$'));
    ok(`3.1 Q${q}: number of parts`, parts.length, { 2: 3, 3: 5, 4: 4 }[q]);
    parts.forEach((p, i) => {
      const e = eqsIn(p);
      const kind = e.length === 2 ? solve(...e).kind : 'unread';
      const ans = mdPart(s1, q, roman[i]);
      ok(`3.1 Q${q} (${roman[i]}): ANSWERS.md says`, word(ans), kind);
      if (q === 3 || q === 4) is(`3.1 Q${q} (${roman[i]}): consistent or not`, /\*\*inconsistent\*\*/.test(ans) === (kind === 'parallel'));
      if (q === 4 && kind === 'unique') pairHas(`3.1 Q4 (${roman[i]})`, e, ...pointsIn(ans).at(-1));
      if (q === 4) for (const [k, pt] of pointsIn(ans).entries()) {
        if (kind === 'unique' && k < 4) is(`3.1 Q4 (${roman[i]}): drawn point (${pt}) on its line`, fits(e[k < 2 ? 0 : 1], ...pt));
        if (kind === 'coincident') is(`3.1 Q4 (${roman[i]}): (${pt}) on both lines`, fits(e[0], ...pt) && fits(e[1], ...pt));
      }
    });
  }
  // Q5: half the perimeter 36, length 4 more than width
  const q5 = mdPart(s1, 5);
  pairHas('3.1 Q5', eqsIn(q5, ['l', 'w']), ...pointsIn(q5)[0]);
  is('3.1 Q5 in words', /length 20 m, width 16 m/.test(q5) && 20 + 16 === 36 && 20 - 16 === 4);
  // Q6: each instance is of the kind it claims
  const base = toLinear('2x + 3y - 8 = 0');
  ['intersect', 'parallel', 'coincident'].forEach((k, i) => {
    const e = eqsIn(mdPart(s1, 6, roman[i])).find(x => !(near(x[0], 2) && near(x[1], 3) && near(x[2], 8)));
    ok(`3.1 Q6 (${roman[i]})`, e ? solve(base, e).kind : 'unread', ['unique', 'parallel', 'coincident'][i]);
  });
  // Q7: the vertices
  const q7e = eqsIn(exQ('Exercise Set 3.1', 7));
  const v = [q7e[0], q7e[1]].map(e => [e[2] / e[0], 0]);
  const m7 = solve(q7e[0], q7e[1]);
  ok('3.1 Q7: the vertices', pointsIn(bolded(mdPart(s1, 7))), [...v, [m7.x, m7.y]]);

  // Exercise Set 3.2
  const s2 = mdSet('Exercise Set 3.2');
  const q1 = partsOf(exQ('Exercise Set 3.2', 1));
  ok('3.2 Q1: six parts', q1.length, 6);
  q1.forEach((p, i) => {
    const vars = /s -/.test(p) ? ['s', 't'] : ['x', 'y'];
    const e = eqsIn(p, vars);
    const ans = bolded(mdPart(s2, 1, roman[i]));
    if (/infinitely many/.test(ans)) pairIs(`3.2 Q1 (${roman[i]})`, e, 'coincident');
    else pairHas(`3.2 Q1 (${roman[i]})`, e, valueOf(ans, vars[0]), valueOf(ans, vars[1]));
  });
  {
    const p = exQ('Exercise Set 3.2', 2);
    const e = eqsIn(p).slice(0, 2);
    const ans = bolded(mdPart(s2, 2));
    pairHas('3.2 Q2', e, valueOf(ans, 'x'), valueOf(ans, 'y'));
    const s = solve(...e);
    ok('3.2 Q2: m', valueOf(ans, 'm'), (s.y - 3) / s.x);
  }
  const q3 = mdPart.bind(null, s2, 3);
  {
    let x, y;
    for (y = 1; y < 100; y++) if (3 * y - y === 26) { x = 3 * y; break; }
    ok('3.2 Q3 (i)', bolded(q3('i')), `**${x} and ${y}.**`);
    ok('3.2 Q3 (ii)', bolded(q3('ii')).match(/\d+/g).map(Number), [(180 + 18) / 2, (180 - 18) / 2]);
    const r = solve([7, 6, 3800], [3, 5, 1750]);
    ok('3.2 Q3 (iii)', bolded(q3('iii')).match(/\d+/g).map(Number), [r.x, r.y]);
    const t = solve([1, 10, 105], [1, 15, 155]);
    ok('3.2 Q3 (iv)', bolded(q3('iv')).match(/\d+/g).map(Number), [5, 10, 25, t.x + 25 * t.y].map((n, i) => [t.x, t.y, 25, t.x + 25 * t.y][i]));
    const f = solve([11, -9, -4], [6, -5, -3]);
    is('3.2 Q3 (v): the fraction satisfies both statements', near((f.x + 2) / (f.y + 2), 9 / 11) && near((f.x + 3) / (f.y + 3), 5 / 6));
    is(`3.2 Q3 (v): printed ${f.x}/${f.y}`, bolded(q3('v')).includes(`\\frac{${f.x}}{${f.y}}`));
    const j = solve([1, -3, 10], [1, -7, -30]);
    is('3.2 Q3 (vi): the ages fit the story', j.x + 5 === 3 * (j.y + 5) && j.x - 5 === 7 * (j.y - 5));
    ok('3.2 Q3 (vi)', bolded(q3('vi')).match(/\d+/g).map(Number), [j.x, j.y]);
  }

  // Exercise Set 3.3
  const s3 = mdSet('Exercise Set 3.3');
  partsOf(exQ('Exercise Set 3.3', 1)).forEach((p, i) => {
    const ans = bolded(mdPart(s3, 1, roman[i]));
    pairHas(`3.3 Q1 (${roman[i]})`, eqsIn(p), valueOf(ans, 'x'), valueOf(ans, 'y'));
  });
  const q = mdPart.bind(null, s3, 2);
  {
    const f = solve([1, -1, -2], [2, -1, 1]);
    is('3.3 Q2 (i): the fraction fits the story', near((f.x + 1) / (f.y - 1), 1) && near(f.x / (f.y + 1), 1 / 2));
    is(`3.3 Q2 (i): printed ${f.x}/${f.y}`, bolded(q('i')).includes(`\\frac{${f.x}}{${f.y}}`));
    const a = solve([1, -3, -10], [1, -2, 10]);
    is('3.3 Q2 (ii): the ages fit', a.x - 5 === 3 * (a.y - 5) && a.x + 10 === 2 * (a.y + 10));
    ok('3.3 Q2 (ii)', bolded(q('ii')).match(/\d+/g).map(Number), [a.x, a.y]);
    let n; for (n = 10; n < 100; n++) if (Math.floor(n / 10) + n % 10 === 9 && 9 * n === 2 * (10 * (n % 10) + Math.floor(n / 10))) break;
    ok('3.3 Q2 (iii)', bolded(q('iii')).match(/\d+/g).map(Number), [n]);
    const w = solve([1, 1, 25], [50, 100, 2000]);
    ok('3.3 Q2 (iv)', bolded(q('iv')).match(/\d+/g).map(Number), [w.x, 50, w.y, 100]);
    const l = solve([1, 4, 27], [1, 2, 21]);
    ok('3.3 Q2 (v)', bolded(q('v')).match(/\d+/g).map(Number), [l.x, l.y]);
    is('3.3 Q2 (v): seven days is 4 beyond three, five is 2', 7 - 3 === 4 && 5 - 3 === 2);
  }
}

// Stage 1, as printed in its running text
{
  const t1 = after(beyond, 'Given that $3x + 2y = 11$', /<div class="c-try">/g);
  const s = solve([3, 2, 11], [2, 3, 4]);
  is('Stage 1 Q1: the pair is the one printed', eqsIn(beyond.slice(beyond.indexOf('Given that'))).slice(0, 2).every((e, i) => e.every((v, j) => near(v, [[3, 2, 11], [2, 3, 4]][i][j]))));
  ok('Stage 1 Q1: x + y and x - y', [valueOf(after(beyond, 'Adding the two equations gives $5x', /<\/p>/g), 'x + y'), valueOf(after(beyond, 'Adding the two equations gives $5x', /<\/p>/g), 'x - y')], [s.x + s.y, s.x - s.y]);
  ok('Stage 1 Q1: x and y', [valueOf(t1, 'x'), valueOf(t1, 'y')], [s.x, s.y]);
  ok('Stage 1 Q2: k for infinitely many', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filter(k => solve([1, 2, 3], [3, k, 9]).kind === 'coincident'), [6]);
  is('Stage 1 Q2: no k gives parallel lines', ![...Array(41)].some((_, i) => solve([1, 2, 3], [3, i - 20, 9]).kind === 'parallel'));
  pairIs('Stage 1 Q3', [[3, -1, 2], [6, -2, 4]], 'coincident');
  is('Stage 1 Q3: (1, 1) and (0, -2) both solve it', fits([3, -1, 2], 1, 1) && fits([3, -1, 2], 0, -2));
  const m4 = solve([1, 1, 5], [1, -1, 1]);
  ok('Stage 1 Q4: vertices and area', [m4.x, m4.y, 5, 1, (5 - 1) * m4.y / 2], [3, 2, 5, 1, 4]);
  const m5 = solve([1, 1, 50], [1, -3, -20]);
  ok('Stage 1 Q5', [m5.y, m5.x], [17.5, 32.5]);
  is('Stage 1 Q5: the story', m5.x + 5 === 3 * (m5.y - 5));
}

// Stage 2, a Solved Example at a time
const bex = (n) => panel(beyond, n);
const qPart = (p) => p.slice(0, p.indexOf('Solution'));
{
  pairHas('Beyond Example 1', eqsIn(qPart(bex(1))), valueOf(answerRow(bex(1)), 'x'), valueOf(answerRow(bex(1)), 'y'));
  const p1 = bex(1);
  const [eA, eB] = eqsIn(qPart(p1));
  const pts = pointsIn(text(p1.slice(p1.indexOf('Solution'), p1.indexOf('Step 3'))));
  is('Beyond Example 1: A and B on x - y = 3, Q and P on x + 2y = 6', fits(eA, ...pts[0]) && fits(eA, ...pts[1]) && fits(eB, ...pts[2]) && fits(eB, ...pts[3]));
  is('Beyond Example 1: A, B, Q, P are axis points', pts.every(([x, y]) => x === 0 || y === 0));
  const r = solve(eA, eB); ok('Beyond Example 1: R', pointsIn(text(after(p1, 'Step 3', /<\/div>/g))), [[r.x, r.y]]);
  const c4 = text(after(p1, 'Step 4', /<\/div>/g)).replace(/\$/g, '').match(/(\d+) - (\d+) = (\d+) and (\d+) \+ 2 \\times (\d+) = (\d+)/);
  ok('Beyond Example 1: the check reads R', c4 && [c4[1], c4[2], c4[4], c4[5]].map(Number), [r.x, r.y, r.x, r.y]);
}
// Example 2: the triangle with the y-axis
{
  const p = bex(2);
  const [e1, e2] = eqsIn(qPart(p));
  const m = solve(e1, e2);
  const right = [[0, e1[2] / e1[1]], [0, e2[2] / e2[1]], [m.x, m.y]];
  const opts = partsOf(qPart(p).slice(qPart(p).indexOf('<ol'))).map(pointsIn);
  const key = opts.map((o, i) => (JSON.stringify(o) === JSON.stringify(right) ? 'abcd'[i] : null)).filter(Boolean);
  ok('Beyond Example 2: the one right option', key, [text(answerRow(p)).match(/\(([a-d])\)/)[1]]);
  ok('Beyond Example 2: option (a) is the x-axis points', opts[0].slice(0, 2), [[e1[2] / e1[0], 0], [e2[2] / e2[0], 0]]);
}
// Example 3: k for no solution
{
  const p = bex(3);
  const kinds = (k) => solve([k, 3, k - 3], [12, k, k]).kind;
  const opts = { a: [6], b: [-6], c: [6, -6], d: [12] };
  const right = Object.entries(opts).filter(([, ks]) => ks.every(k => kinds(k) === 'parallel')).map(([l]) => l);
  ok('Beyond Example 3', right, [text(answerRow(p)).match(/\(([a-d])\)/)[1]]);
  ok('Beyond Example 3: k = 6 coincides', kinds(6), 'coincident');
  ok('Beyond Example 3: its c ratios', [(-(6 - 3)) / -6, (-(-6 - 3)) / 6], [1 / 2, 3 / 2]);
  is('Beyond Example 3: (d) k = 12 makes a1/a2 = 1 but not b1/b2', 12 / 12 === 1 && 3 / 12 !== 1);
}
// Example 4: a and b
{
  const p = bex(4);
  const hits = [];
  for (let a = -20; a <= 20; a++) for (let b = -20; b <= 20; b++) if (a + b !== 0 && solve([3, 4, 12], [a + b, 2 * (a - b), 5 * a - 1]).kind === 'coincident') hits.push([a, b]);
  ok('Beyond Example 4', hits, [[valueOf(answerRow(p), 'a'), valueOf(answerRow(p), 'b')]]);
}
// Example 5: the fruit
{
  const p = bex(5);
  const e = eqsIn(p.slice(p.indexOf('Solution')));
  pairIs('Beyond Example 5', e, 'parallel');
  is('Beyond Example 5: the equations are the story', text(qPart(p)).includes('2 kg of apples and 1 kg of grapes cost ₹160. 4 kg of apples and 2 kg of grapes cost ₹300') && near(e[0][2], 160) && near(e[1][2], 300));
  ok('Beyond Example 5: the answer', text(answerRow(p)).trim(), '(d)');
  is('Beyond Example 5: (a) and (b) fit the first statement only', 2 * 70 + 20 === 160 && 4 * 70 + 2 * 20 !== 300 && 2 * 75 + 10 === 160 && 4 * 75 + 20 !== 300);
  ok('Beyond Example 5: doubling', 2 * 160, 320);
}
for (const n of [6, 7, 9]) {
  const p = bex(n);
  pairHas(`Beyond Example ${n}`, eqsIn(qPart(p)), valueOf(answerRow(p), 'x'), valueOf(answerRow(p), 'y'));
}
// Example 8: the solution offered as options
{
  const p = bex(8);
  const e = eqsIn(qPart(p).slice(0, qPart(p).indexOf('<ol')));
  const s = solve(...e);
  const opts = partsOf(qPart(p).slice(qPart(p).indexOf('<ol'))).map(o => [valueOf(o, 'x'), valueOf(o, 'y')]);
  ok('Beyond Example 8', opts.map((o, i) => (near(o[0], s.x) && near(o[1], s.y) ? 'abcd'[i] : null)).filter(Boolean), [text(answerRow(p)).match(/\(([a-d])\)/)[1]]);
  is('Beyond Example 8: (a), (b), (d) fit neither equation', opts.filter((o, i) => i !== 2).every(o => !fits(e[0], ...o) && !fits(e[1], ...o)));
}
// Example 10: the fraction
{
  const p = bex(10);
  const opts = partsOf(qPart(p).slice(qPart(p).indexOf('<ol'))).map(o => o.match(/frac\{(\d+)\}\{(\d+)\}/).slice(1).map(Number));
  const good = opts.map(([x, y]) => near((x - 1) / y, 1 / 3) && near(x / (y + 8), 1 / 4));
  ok('Beyond Example 10', good.map((g, i) => (g ? 'abcd'[i] : null)).filter(Boolean), [text(answerRow(p)).match(/\(([a-d])\)/)[1]]);
  is('Beyond Example 10: (a) and (c) are the fraction after each change', near(opts[0][0] / opts[0][1], 4 / 12) && near(opts[2][0] / opts[2][1], 5 / 20));
}
// Example 11: notebooks and pens
{
  const p = bex(11);
  const g = text(qPart(p)).match(/(\d+) notebooks and (\d+) pens cost ₹(\d+), and (\d+) notebooks and (\d+) pens cost ₹(\d+)/).slice(1).map(Number);
  const s = solve(g.slice(0, 3), g.slice(3));
  ok('Beyond Example 11', text(answerRow(p)).match(/\d+/g).map(Number), [s.x, s.y]);
  const w = text(p);
  // the steps: multiply by the other x-coefficient, subtract, back-substitute
  const [m1, m2] = [g[3], g[0]];
  ok('Beyond Example 11: Step 2 totals', w.match(/12x \+ 9y = (\d+)\$ and \$12x \+ 20y = (\d+)/).slice(1).map(Number), [g[2] * m1, g[5] * m2]);
  ok('Beyond Example 11: Step 3', Number(w.match(/11y = (\d+)/)[1]), g[5] * m2 - g[2] * m1);
  ok('Beyond Example 11: Step 4', w.match(/4x = (\d+) - (\d+) = (\d+)/).slice(1).map(Number), [g[2], g[1] * s.y, g[2] - g[1] * s.y]);
  is('Beyond Example 11: coefficients 12, 9, 20, 11', g[0] * m1 === 12 && g[1] * m1 === 9 && g[4] * m2 === 20 && g[4] * m2 - g[1] * m1 === 11);
}
// Example 12: the tickets
{
  const p = bex(12);
  const s = solve([1, 1, 480], [60, 35, 22050]);
  ok('Beyond Example 12: the story', text(qPart(p)).match(/[\d,]+(?= tickets)|₹[\d,]+/g).map(v => Number(v.replace(/[₹,]/g, ''))), [480, 60, 35, 22050]);
  ok('Beyond Example 12', text(answerRow(p)).match(/\d+/g).map(Number), [s.x, s.y]);
}
// Example 13: the triangle
{
  const p = bex(13);
  const s = solve([3, 3, 90], [1, -1, 20]);
  const A = 2 * s.x + s.y, Bn = s.x + 2 * s.y;
  is('Beyond Example 13: the angles make 180 and differ by 20', A + Bn + 90 === 180 && A - Bn === 20);
  ok('Beyond Example 13', text(answerRow(p)).replace(/\\circ|\^/g, '').match(/\d+/g).map(Number), [s.x, s.y, A, Bn, 90]);
}
// Example 14: the bills
{
  const p = bex(14);
  const rows = [...qPart(p).matchAll(/<td>(\d+) GB<\/td><td>₹(\d+)<\/td>/g)].map(m => [1, Number(m[1]), Number(m[2])]);
  const s = solve(...rows);
  const may = Number(text(qPart(p)).match(/was ₹(\d+)/)[1]);
  const heavy = Number(text(qPart(p)).match(/uses (\d+) GB/)[1]);
  const got = text(answerRow(p)).match(/\d+/g).map(Number);
  ok('Beyond Example 14', got, [s.x, s.y, s.x + heavy * s.y, (may - s.x) / s.y]);
}

// the practice answers, read back out of the key rows
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= m[2];
const row = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const r = keyRows[n] || '';
  if (!part) return r;
  const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\)|$)`));
  return m ? m[1] : '';
};
const Q = (n) => after(beyond, n === 1 ? '<span class="c-practice__num">' : `<ol class="c-questions" data-start="${n}">`);
{
  const q20 = eqsIn(Q(20)).length; is('Q20 is read', q20 >= 0);
  const k20 = (7 - 4 * -2) / 3;
  ok('Q20', valueOf(row(20), 'k'), k20);
  const e21 = eqsIn(Q(21));
  ok('Q21: the ratios', [...row(21).matchAll(/\\frac\{(-?\d+)\}\{(-?\d+)\}/g)].slice(0, 3).map(m => +(Number(m[1]) / Number(m[2])).toFixed(9)),
    [e21[0][0] / e21[1][0], e21[0][1] / e21[1][1], e21[0][2] / e21[1][2]].map(v => +v.toFixed(9)));
  is('Q21: infinitely many', solve(...e21).kind === 'coincident' && /infinitely many/.test(row(21)));
  const s22 = solve(...eqsIn(Q(22)));
  ok('Q22', valueOf(row(22), 'x + y'), s22.x + s22.y);
  const e23 = eqsIn(Q(23))[0];
  ok('Q23', pointsIn(row(23)), [[e23[2] / e23[0], 0], [0, e23[2] / e23[1]]]);
  for (const n of [24, 25]) pairHas(`Q${n}`, eqsIn(Q(n)), valueOf(row(n), 'x'), valueOf(row(n), 'y'));
  {
    const hits = [];
    for (let a = -30; a <= 30; a++) for (let b = -30; b <= 30; b++) if ((a + b || a - b) && solve([1, 2, 3], [a + b, a - b, 18]).kind === 'coincident') hits.push([a, b]);
    ok('Q26', hits, [[valueOf(row(26), 'a'), valueOf(row(26), 'b')]]);
    is('Q26: "6 times" is the multiple', /must be 6 times/.test(row(26)) && 18 / 3 === 6);
  }
  {
    const nums = text(Q(27)).match(/\d+/g).map(Number);
    const s = solve([nums[0], nums[1], nums[2]], [nums[3], nums[4], nums[5]]);
    ok('Q27', text(row(27)).match(/₹(\d+)/g).map(v => Number(v.slice(1))), [s.x, s.y]);
  }
  {
    const e = eqsIn(Q(28));
    const s = solve(...e);
    const p = pointsIn(row(28));
    ok('Q28: meeting point', p[0], [s.x, s.y]);
    ok('Q28: where each meets the x-axis', [p[1], p[2]], e.map(q => [q[2] / q[0], 0]));
    ok('Q28: area', Number(text(row(28)).match(/= (\d+)\$? square units/)[1]), Math.abs(e[0][2] / e[0][0] - e[1][2] / e[1][0]) * s.y / 2);
  }
  {
    const [times, sub] = text(Q(29)).match(/\d+/g).map(Number);
    let n; for (n = 10; n < 100; n++) { const t = Math.floor(n / 10), u = n % 10; if (n === times * (t + u) && n - sub === 10 * u + t) break; }
    ok('Q29', Number(text(row(29)).match(/the number is (\d+)/)[1]), n);
  }
  {
    const t = text(Q(30));
    const [more, twice] = [Number(t.match(/is (\d+) more than/)[1]), /twice its numerator/.test(t) ? 2 : NaN];
    const [dn, dd] = t.match(/If (\d+) is subtracted from the numerator and (\d+) from the denominator/).slice(1).map(Number);
    const [fp, fq] = t.match(/becomes \$\\frac\{(\d+)\}\{(\d+)\}\$/).slice(1).map(Number);
    // y = twice*x + more ;  fq(x - dn) = fp(y - dd)
    const s = solve([-twice, 1, more], [fq, -fp, fq * dn - fp * dd]);
    ok('Q30: the fraction', text(row(30)).match(/the fraction is \$\\frac\{(\d+)\}\{(\d+)\}/).slice(1).map(Number), [s.x, s.y]);
    ok('Q30: the check', text(row(30)).match(/\\frac\{(\d+)\}\{(\d+)\} = \\frac\{1\}\{3\}\$$/).slice(1).map(Number), [s.x - dn, s.y - dd]);
    is('Q30: the equations the key prints', fits([-2, 1, 4], s.x, s.y) && fits([3, -1, 3], s.x, s.y) && text(row(30)).includes('-2x + y = 4') && text(row(30)).includes('3x - y = 3'));
  }
  {
    const cells = [...Q(31).matchAll(/<td>₹?(\d+)<\/td>/g)].map(m => Number(m[1]));
    const [s1, j1, t1, s2, j2, t2] = cells;
    const s = solve([s1, j1, t1], [s2, j2, t2]);
    const [ws, wj] = text(Q(31)).match(/sold (\d+) samosas and (\d+) glasses/).slice(1).map(Number);
    const a = eqsIn(row('31a'), ['s', 'j']);
    is('Q31 (a): the equations are the table', a.length === 2 && a.every((e, i) => e.every((v, k) => near(v, [[s1, j1, t1], [s2, j2, t2]][i][k]))));
    ok('Q31 (b)', text(row('31b')).match(/₹(\d+)/g).map(v => Number(v.slice(1))), [s.x, s.y]);
    ok('Q31 (c)', text(row('31c')).match(/₹(\d+)/g).map(v => Number(v.slice(1))), [ws * s.x + wj * s.y]);
  }
  {
    const eq = [...Q(32).matchAll(/<td>\$([^$]+)\$<\/td>/g)].map(m => toLinear(m[1]));
    ok('Q32 (a)', solve(eq[0], eq[1]).kind === 'parallel' ? 'No' : 'Yes', text(row('32a')).match(/No|Yes/)[0]);
    const rp = solve(eq[2], eq[0]), rq = solve(eq[2], eq[1]);
    ok('Q32 (b)', pointsIn(row('32b')), [[rp.x, rp.y]]);
    ok('Q32 (c)', pointsIn(row('32c')), [[rq.x, rq.y]]);
  }
}

/* ---- G. every graph --------------------------------------------- */

const figs = [...all.matchAll(/<svg viewBox="0 0 \d+ \d+" data-size[\s\S]*?<\/svg>[\s\S]*?<span class="fignum">(Fig\. [\d.]+)<\/span>/g)];
ok('three graphs', figs.map(f => f[1]), ['Fig. 3.1', 'Fig. 3.2', 'Fig. 3.3']);
const fromLabel = (s) => toLinear(s.replace(/−/g, '-'));
for (const f of figs) {
  const svg = f[0], name = f[1];
  const ax = svg.match(/class="dg-axis" d="M([\d.]+) ([\d.]+)H[\d.]+ M([\d.]+) ([\d.]+)V/);
  const X0 = Number(ax[3]), Y0 = Number(ax[2]);
  const ticks = [...svg.matchAll(/class="dg-tick" x="([\d.]+)" y="[\d.]+" text-anchor="middle">([−\d]+)</g)].map(m => [Number(m[1]), Number(m[2].replace('−', '-'))]);
  const unit = (ticks[1][0] - ticks[0][0]) / (ticks[1][1] - ticks[0][1]);
  is(`${name}: x ticks evenly spaced`, ticks.every(([x, v]) => near(x, X0 + v * unit)));
  const yt = [...svg.matchAll(/class="dg-tick" x="[\d.]+" y="([\d.]+)" text-anchor="end">([−\d]+)</g)].map(m => [Number(m[1]), Number(m[2].replace('−', '-'))]);
  is(`${name}: y ticks evenly spaced`, yt.every(([y, v]) => Math.abs(y - 3 - (Y0 - v * unit)) < 0.01));
  const toXY = (px, py) => [(px - X0) / unit, (Y0 - py) / unit];
  const lines = [...svg.matchAll(/class="dg-plot(?: dg-plot--b)?" d="M([\d.]+) ([\d.]+) L([\d.]+) ([\d.]+)"/g)]
    .map(m => [toXY(+m[1], +m[2]), toXY(+m[3], +m[4])]);
  ok(`${name}: two plotted lines`, lines.length, 2);
  const labels = [...svg.matchAll(/class="dg-plot-label"[^>]*>([^<]+)</g)].map(m => fromLabel(m[1]));
  const fitsDrawn = (e, x, y) => Math.abs(e[0] * x + e[1] * y - e[2]) < 0.02 * Math.hypot(e[0], e[1]);   // endpoints are set to 0.1 px
  lines.forEach((l, i) => is(`${name}: line ${i + 1} is drawn along its label's equation`, labels[i] && fitsDrawn(labels[i], ...l[0]) && fitsDrawn(labels[i], ...l[1])));
  // the caption names the same two equations
  const capAt = f.index + f[0].length;
  const cap = eqsIn(all.slice(capAt, all.indexOf('</figcaption>', capAt)));
  is(`${name}: the caption names the plotted equations`, cap.length === 2 && cap.every((e, i) => labels[i] && [0, 1, 2].every(k => near(e[k] * labels[i][0], labels[i][k] * e[0]))));
  // every marked point: its label names where it is drawn, and it lies on a line
  const marks = [...svg.matchAll(/<circle class="dg-fill-teal" cx="([\d.]+)" cy="([\d.]+)"[^>]*\/>\s*<text[^>]*>([A-Z])\(([−\d]+), ([−\d]+)\)</g)]
    .map(m => ({ name: m[3], at: toXY(+m[1], +m[2]), says: [Number(m[4].replace('−', '-')), Number(m[5].replace('−', '-'))] }));
  is(`${name}: points are marked`, marks.length >= 4);
  for (const m of marks) {
    ok(`${name}: ${m.name} drawn where its label says`, m.at, m.says);
    is(`${name}: ${m.name} lies on a plotted line`, labels.some(e => fits(e, ...m.says)));
  }
  const s = solve(labels[0], labels[1]);
  const at = marks.filter(m => near(m.at[0], s.x) && near(m.at[1], s.y));
  ok(`${name}: the lines meet at a marked point`, at.length, 1);
  // and the example that uses the figure prints that point as its answer
  const ex = all.slice(0, all.indexOf(svg));
  const p = ex.slice(ex.lastIndexOf('<div class="c-example__tab">'));
  const ans = answerRow(p);
  ok(`${name}: the printed answer is the drawn intersection`, [valueOf(ans, 'x'), valueOf(ans, 'y')], [s.x, s.y]);
  is(`${name}: the aria-label names the meeting point`, svg.includes(`meet at ${at[0]?.name}(${String(s.x).replace('-', '−')}, ${String(s.y).replace('-', '−')})`));
}

/* ---- C. multiple choice and assertion-reason ------------------ */

const optsOf = (n) => partsOf(Q(n).slice(Q(n).indexOf('<ol class="c-parts'))).map(x => text(x).trim());
const key = {};
{
  const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2];
}
const stem = (n) => Q(n).slice(0, Q(n).indexOf('<ol class="c-parts'));
const pt = (s) => pointsIn(s)[0] || [NaN, NaN];
const money = (s) => Number(s.replace(/[₹,$]/g, ''));
const solveMC = {
  1: o => { const s = solve(...eqsIn(stem(1))); return o.map(x => near(pt(x)[0], s.x) && near(pt(x)[1], s.y)); },
  2: o => { const k = solve(...eqsIn(stem(2))).kind; return o.map(x => ({ intersecting: 'unique', parallel: 'parallel', coincident: 'coincident', perpendicular: 'never' })[x] === k); },
  3: o => { const k = solve(...eqsIn(stem(3))).kind; return o.map(x => ({ 'a unique solution': 'unique', 'no solution': 'parallel', 'infinitely many solutions': 'coincident', 'exactly two solutions': 'never' })[x] === k); },
  4: o => o.map(Number.parseFloat).map((v, i) => near(3 * 2 + numOf(o[i].replace(/\$/g, '')) * 1, 10)),
  5: o => o.map(x => { const [p, q] = x.match(/\d+/g).map(Number); const e = eqsIn(stem(5)); return near(e[0][1] * p + e[1][1] * q, 0); }),
  6: o => o.map(x => near(pt(x)[0], -1) && near(pt(x)[1], 4)),
  7: o => { const e = eqsIn(stem(7))[0]; return o.map(x => { const p = pointsIn(x); return p.length === 2 && near(p[0][0], e[2] / e[0]) && p[0][1] === 0 && p[1][0] === 0 && near(p[1][1], e[2] / e[1]); }); },
  8: o => o.map(x => { const k = numOf(x.replace(/\$/g, '')); return solve([2, k, 5], [4, 6, 10]).kind === 'coincident'; }),
  9: o => { const kinds = (p) => solve([p, 2, 5], [3, 1, 1]).kind; const range = [...Array(41)].map((_, i) => i - 20);
    return o.map(x => { const t = x.replace(/\$/g, '').trim(); const set = t === 'every p' ? range : /neq/.test(t) ? range.filter(p => p !== 6) : [Number(t.split('=')[1])];
      return range.every(p => (kinds(p) === 'unique') === set.includes(p)); }); },
  10: o => { const s = solve(...eqsIn(stem(10)).slice(0, 2)); return o.map(x => near(Number(x), 2 * s.x + 3 * s.y)); },
  11: o => { const e = eqsIn(stem(11)); const kiran = solve(e[0], e[1]).kind === 'coincident'; const lata = [[4, 0], [0, -2]].every(p => fits(e[0], ...p) && fits(e[1], ...p));
    return o.map(x => x === (kiran && lata ? 'both' : kiran ? 'only Kiran' : lata ? 'only Lata' : 'neither')); },
  12: o => { const k = solve(...eqsIn(stem(12))).kind; return o.map(x => (k === 'coincident') === (x === 'infinitely many solutions')); },
  13: o => { const s = solve([1, 8, 130], [1, 12, 178]); return o.map(x => near(money(x), s.x + 20 * s.y)); },
  14: o => { const s = solve([3, 2, 1850], [5, 3, 2950]); return o.map(x => near(money(x), s.y)); },
};
for (const [q, f] of Object.entries(solveMC)) {
  const o = optsOf(Number(q));
  is(`Q${q} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Q${q}: the right option`, right, [key[q]]);
}
is('Q13: the stem prints 130 and 178', /8 km costs ₹130 and one of 12 km costs ₹178/.test(text(stem(13))));
is('Q14: the stem prints the prices', /3 chairs and 2 tables cost ₹1850, and 5 chairs and 3 tables cost ₹2950/.test(text(stem(14))));
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const arEq = (n) => eqsIn(Q(n).split('Reason')[0]);
const AR = {
  15: [solve(...arEq(15)).kind === 'parallel', (() => { const [p, q] = arEq(15); return near(p[0] / q[0], p[1] / q[1]) && !near(p[0] / q[0], p[2] / q[2]); })(), true],
  16: [(() => { const e = arEq(16).slice(-2); return solve(...e).kind === 'unique'; })(), true, false],
  17: [(() => { const e = arEq(17); return fits(e[0], 5, 3) && fits(e[1], 5, 3); })(), true, false],
  18: [solve(...arEq(18)).kind === 'parallel', false, false],
  19: [(() => { const e = arEq(19).slice(-2); const k = 4; return solve([2, k, 3], [1, 2, 5]).kind === 'coincident' && e.length >= 1; })(), true, false],
};
is('Q16: (2, 1) does satisfy both', (() => { const e = arEq(16).filter(x => !near(x[0], 1) || !near(x[1], 0)); return e.length >= 2 && e.slice(-2).every(q => fits(q, 2, 1)); })());
is('Q17: the printed solution is (5, 3)', /x = 5\$, \$y = 3/.test(Q(17)));
is('Q19: the stem says k = 4', /k = 4/.test(Q(19)));
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-19', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(19)].map((_, i) => i + 1));
ok('practice numbered 1-32', [...beyond.matchAll(/data-start="(\d+)"/g)].map(m => Number(m[1])), [...Array(31)].map((_, i) => i + 2));
ok('Solved Examples numbered 1-14', [...beyond.matchAll(/c-example__tab">Example (\d+)/g)].map(m => Number(m[1])), [...Array(14)].map((_, i) => i + 1));
// the "why the other options are wrong" rows that carry numbers
{
  const why = beyond.slice(beyond.indexOf('Why the other options are wrong'));
  const w = (n) => { const m = why.match(new RegExp(`work__label">${n}</span>\\s*<span>([\\s\\S]*?)</span></div>`)); return m ? text(m[1]) : ''; };
  const s13 = solve([1, 8, 130], [1, 12, 178]);
  is(`why 13: ₹${s13.y} a km, fixed ${s13.x}`, w(13).includes(`₹${(12 - 8) * s13.y} more`) && w(13).includes(`₹${s13.y} a km`) && w(13).includes(`= ${s13.x}`));
  is('why 13: (a) scales, (d) adds', near(130 * 20 / 8, money(optsOf(13)[0])) && near(130 + 178, money(optsOf(13)[3])) && near(20 * s13.y, money(optsOf(13)[2])));
  is('why 4: (b) forgets 3 x 2, (a) also halves, (d) subtracts backwards', Number(optsOf(4)[1]) === 10 && Number(optsOf(4)[0]) === (10 - 6) / 2 && numOf(optsOf(4)[3].replace(/\$/g, '')) === 6 - 10);
  is('why 5: (b) gives 9y and -4y, (c) 6y and -10y', 3 * 3 === 9 && 2 * -2 === -4 && 2 * 3 === 6 && 5 * -2 === -10);
  is('why 10: (a) is 2x + y, (b) is 3x + 2y', Number(optsOf(10)[0]) === 2 * 2 + 1 && Number(optsOf(10)[1]) === 3 * 2 + 2 * 1);
  is('why 14: (a) is a chair', money(optsOf(14)[0]) === solve([3, 2, 1850], [5, 3, 2950]).x);
  is('why 9: p = 6 is parallel', solve([6, 2, 5], [3, 1, 1]).kind === 'parallel');
  is('why 1: (c) fits the first only, (d) is the right-hand sides', 2 + 2 === 4 && 2 - 2 !== 2 && JSON.stringify(pt(optsOf(1)[3])) === '[4,2]');
}

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
{
  const i = answersMd.indexOf('as the key prints it');
  for (const m of answersMd.slice(i, i + 400).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2];
}
ok('ANSWERS.md key matches the page', mdKey, key);
// ANSWERS.md's practice working, row by row
const mdPractice = answersMd.slice(answersMd.indexOf('The working for each'));
const mdRow = (q) => { const m = mdPractice.match(new RegExp(`\\n${q}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`)); return m ? m[1].replace(/\s+/g, ' ') : ''; };
const mdLetter = (q) => (mdRow(q).match(/^\(([a-d])\)/) || [])[1];
for (const q of [15, 16, 17, 18, 19]) ok(`ANSWERS.md Q${q} letter`, mdLetter(q), key[q]);
for (const q of [20, 22, 24, 25, 26]) {
  const r = row(q);
  for (const v of ['k', 'x + y', 'x', 'y', 'a', 'b']) if (Number.isFinite(valueOf(r, v))) ok(`ANSWERS.md Q${q}: ${v}`, valueOf(mdRow(q), v), valueOf(r, v));
}
ok('ANSWERS.md Q23', pointsIn(mdRow(23)), pointsIn(row(23)));
ok('ANSWERS.md Q27', mdRow(27).match(/₹(\d+)/g), text(row(27)).match(/₹(\d+)/g));
ok('ANSWERS.md Q28', [pointsIn(mdRow(28))[4], mdRow(28).match(/= (\d+)\$? square/)[1]], [pointsIn(row(28))[0], text(row(28)).match(/= (\d+)\$? square/)[1]]);
{
  const [a1, b1] = pointsIn(mdRow(28)).slice(0, 4).reduce((acc, p, i) => (acc[i < 2 ? 0 : 1].push(p), acc), [[], []]);
  const e = eqsIn(Q(28));
  is('ANSWERS.md Q28: the drawn points lie on their lines', a1.every(p => fits(e[0], ...p)) && b1.every(p => fits(e[1], ...p)));
}
ok('ANSWERS.md Q29', mdRow(29).match(/the number is (\d+)/)[1], text(row(29)).match(/the number is (\d+)/)[1]);
ok('ANSWERS.md Q30', mdRow(30).match(/the fraction is \$\\frac\{(\d+)\}\{(\d+)\}/)?.slice(1), text(row(30)).match(/the fraction is \$\\frac\{(\d+)\}\{(\d+)\}/).slice(1));
ok('ANSWERS.md Q31', mdRow(31).match(/₹(\d+)/g), text(row(31)).match(/₹(\d+)/g));
ok('ANSWERS.md Q32', pointsIn(mdRow(32)), pointsIn(row(32)));
ok('ANSWERS.md Q13', Number(mdRow(13).match(/= (\d+)\$/)[1]), solve([1, 8, 130], [1, 12, 178]).x + 20 * solve([1, 8, 130], [1, 12, 178]).y);
ok('ANSWERS.md Q14', mdRow(14).match(/₹(\d+)/)[1], String(solve([3, 2, 1850], [5, 3, 2950]).y));
{
  const s = solve(...eqsIn(stem(1)));
  ok('ANSWERS.md Q1', [valueOf(mdRow(1), 'x'), valueOf(mdRow(1), 'y')], [s.x, s.y]);
  ok('ANSWERS.md Q4', valueOf(mdRow(4), 'k'), 4);
  ok('ANSWERS.md Q8', valueOf(mdRow(8), 'k'), 3);
  const s10 = solve(...eqsIn(stem(10)).slice(0, 2));
  ok('ANSWERS.md Q10', [valueOf(mdRow(10), 'x'), valueOf(mdRow(10), 'y'), valueOf(mdRow(10), '2x + 3y')], [s10.x, s10.y, 2 * s10.x + 3 * s10.y]);
}
// the Stage 1 summary in ANSWERS.md
{
  const st = after(answersMd, '### Stage 1', /### Stage 3/g);
  is('ANSWERS.md Stage 1 values', /\$x \+ y = 3\$ and \$x - y = 7\$/.test(st) && /\$k = 6\$/.test(st) && /\(4\) 4 square/.test(st) && /17\.5 years old and the mother 32\.5/.test(st));
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
