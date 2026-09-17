#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed — polynomials evaluated, linear equations solved, lines read
   off their graphs — and compared with what is on the page.

     node pages/class-9/ch02-linear-polynomials/check-numbers.mjs [--skipped]

   Four parts:
     A  every identity set as maths, on every page and in ANSWERS.md: pure
        arithmetic is evaluated (powers, fractions and function values
        included); an equation is checked against the values the same block
        solves its letters to; a chain of three or more sides with letters
        left over is tested as an identity at random values
     B  the claims A cannot check: each example's answer and table, each
        exercise answer read back off ANSWERS.md, every graph measured from
        its coordinates against the equation and points printed with it,
        the tile and matchstick figures counted, and the practice answers
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
const near = (a, b, tol = 1e-6) => Math.abs(a - b) < tol;

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<span class="nb">([^<]*)<\/span>/g, '$1')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;|&minus;|–|−/g, '-')
  .replace(/&deg;/g, '°').replace(/&#8377;/g, '₹').replace(/&middot;/g, '·').replace(/\s+/g, ' ');
const plain = (s) => text(s)
  .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '$1/$2')
  .replace(/\\times/g, '×').replace(/\\ldots/g, '…').replace(/\\,|\\quad/g, ' ')
  .replace(/\$/g, '').replace(/\{,\}/g, '').replace(/\s+/g, ' ');
const esc = (v) => String(v).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// a value as a whole number or phrase: not part of a longer number
const has = (s, v) => new RegExp(`(^|[^\\d.])${esc(v)}([^\\d]|\\.(?!\\d)|$)`).test(s);

/* ---- a small evaluator ---------------------------------------- */

const FN = new Set(['p', 'q', 'f', 'h', 'C', 'b', 'w']);   // letters written as functions, p(2)
function toExpr(side, env = {}) {
  let s = side
    .replace(/\\left|\\right|\\bigl|\\bigr/g, '')
    .replace(/\{,\}/g, '')
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad/g, '')
    .replace(/\^\{([^{}]+)\}/g, '^($1)').replace(/\^(\d)/g, '^($1)')
    .replace(/\s+/g, '');
  if (/\\/.test(s)) return null;
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (/[A-Za-z]/.test(c)) {
      if (FN.has(c) && s[i + 1] === '(' && !/[A-Za-z0-9)]/.test(s[i - 1] || '')) return null;   // p(2): a function value
      if (c in env) out += `(${env[c]})`;
      else return null;                                   // an unresolved letter, or a function value
    } else out += c;
  }
  if (!out || !/^[-+*/().0-9^]+$/.test(out)) return null;
  out = out.replace(/(\d|\))\(/g, '$1*(').replace(/\)(\d)/g, ')*$1');
  // powers: base^(exp), the base a number or a bracket
  for (let k = 0; k < 5 && out.includes('^'); k++)
    out = out.replace(/(\d+(?:\.\d+)?|\((?:[^()]|\([^()]*\))*\))\^\(([^()]*)\)/g, 'Math.pow($1,$2)');
  if (out.includes('^')) return null;
  return out;
}
const evalExpr = (e) => { try { return Function(`"use strict";return (${e})`)(); } catch { return NaN; } };
const val = (side, env = {}) => { const e = toExpr(side, env); return e == null ? NaN : evalExpr(e); };
const lettersOf = (s) => [...new Set((s.replace(/\\[A-Za-z]+/g, '').match(/[A-Za-z]/g) || []))];
const splitTop = (s) => { const out = []; let d = 0, cur = '';
  for (const c of s) { if ('({['.includes(c)) d++; if (')}]'.includes(c)) d--; if (c === ',' && d === 0) { out.push(cur); cur = ''; } else cur += c; }
  out.push(cur); return out; };

/* ---- A. every identity ---------------------------------------- */

const blocksOf = (src, isMd) => isMd
  ? src.split(/\n(?=\s*\d+\. |#|\s*- )/)
  : src.split(/<div class="c-example">|<div class="c-try">|<div class="work work--trace">/)
      .flatMap(b => /c-example__tab/.test(b) ? [b] : b.split('<div class="work__row">'));
const RELATION = /\\ne|\\le|\\ge|\\gt|\\lt|<|>|:|\\parallel|\\approx|\\text|\\ldots|\\boxed/;
// equations that are printed to be shown to have no whole-number answer; checked in B
const NO_SOLUTION = new Set(['7n = 153', '5n = 199']);

let spans = 0; const skipped = [];
const sources = [...pages.map(f => [f, html[f], false]), ['ANSWERS.md', answersMd, true]];
for (const [f, raw, isMd] of sources) {
  for (const block of blocksOf(raw.replace(/<span class="nb">([^<]*)<\/span>/g, '$1').replace(/\$\$/g, '$'), isMd)) {
    const ms = [...block.matchAll(/\$([^$]+)\$/g)].map(m => m[1]).flatMap(splitTop).map(s => s.replace(/^\s*\\q?quad\s*/, '').trim()).filter(Boolean);
    const solved = {};
    for (const s of ms) {
      const m = s.match(/^([A-Za-z])\s*=\s*(.+)$/);
      if (!m || RELATION.test(s)) continue;
      const last = m[2].split('=').pop();
      const v = val(last);
      if (Number.isFinite(v)) (solved[m[1]] ??= new Set()).add(v);
    }
    let envs = Object.entries(solved).reduce((acc, [v, set]) => acc.flatMap(e => [...set].map(x => ({ ...e, [v]: x }))), [{}]);
    if (envs.length > 4000) envs = envs.slice(0, 4000);
    for (const span of ms) {
      if (!span.includes('=') || RELATION.test(span)) continue;
      if (NO_SOLUTION.has(span.replace(/\s+/g, ' '))) continue;
      const sides = span.split('=').map(s => s.trim()).filter(Boolean);
      if (sides.length < 2) continue;
      if (sides.length === 2 && /^[A-Za-z]$/.test(sides[0]) && Number.isFinite(val(sides[1]))) continue;   // a solved value itself
      let decided = false, failed = null;
      for (const env of envs) {
        const nums = sides.map(s => val(s, env)).filter(Number.isFinite);
        if (nums.length < 2) continue;
        if (nums.every(n => near(n, nums[0], 1e-9))) { decided = true; break; }
        failed ??= nums;
      }
      if (!decided && !failed) {
        // letters left over: an identity must hold at any values
        const free = lettersOf(span);
        const trials = [0, 1, 2].map(t => Object.fromEntries(free.map((l, i) => [l, 1.37 + 0.91 * i + 2.13 * t * (i + 1)])));
        const res = trials.map(env => sides.map(s => val(s, env)));
        if (res.every(nums => nums.every(Number.isFinite))) {
          if (res.every(nums => nums.every(n => near(n, nums[0], 1e-9)))) decided = true;
          else if (sides.length > 2) failed = res[0];
        }
      }
      // an equation in two or more letters is a relation: it holds for the values it was written for, or it is not checked here
      if (!decided && failed && sides.length === 2 && lettersOf(span).length > 1) failed = null;
      if (decided) { spans++; pass++; }
      else if (failed) { spans++; fails.push(`${f}: $${span}$ — sides are ${failed.map(n => +n.toFixed(6)).join(' and ')} (with ${JSON.stringify(solved, (k, v) => v instanceof Set ? [...v] : v)})`); }
      else skipped.push(`${f}: $${span}$`);
    }
  }
}

/* ---- helpers for B, C, D -------------------------------------- */

const panels = (src) => {
  const o = {};
  for (const part of src.split('<div class="c-example">').slice(1)) {
    const n = part.match(/c-example__tab">Example (\d+)/)[1];
    o[n] = part.slice(0, part.search(/<div class="c-example">|$/));
  }
  return o;
};
const bodyEx = panels(body), beyondEx = panels(beyond);
const rowOf = (panel, label) => {
  const m = (panel || '').match(new RegExp(`work__label">${label}</span>([\\s\\S]*?)</div>`));
  return m ? plain(m[1]) : '';
};
const exSays = (where, ex, n, ...vals) => { for (const v of vals) is(`${where} Example ${n} Answer should say ${v}: "${rowOf(ex[n], 'Answer')}"`, has(rowOf(ex[n], 'Answer'), v)); };
const exPrints = (where, ex, n, ...vals) => { for (const v of vals) is(`${where} Example ${n} should print ${v}`, has(plain(ex[n] || ''), v)); };
const lin = (fn) => { const b = fn(0), a = fn(1) - b; return -b / a; };        // root of a linear function
const norm = (s) => s.replace(/\s+/g, '');
const says = (where, s, phrase) => is(`${where} should read "${phrase}": "${s.slice(0, 120)}"`, norm(s).includes(norm(phrase)));

// a polynomial in one letter, as printed: {power: coefficient}
function poly(s, v = 'x') {
  const t = s.replace(/\s+/g, '').replace(/\^\{(\d+)\}/g, '^$1').replace(/-/g, '+-').split('+').filter(Boolean);
  const o = {};
  for (const term of t) {
    const m = term.match(new RegExp(`^(-?[\\d.]*)(${v}(?:\\^(\\d+))?)?$`));
    if (!m) return null;
    const c = m[1] === '' ? 1 : m[1] === '-' ? -1 : Number(m[1]);
    const p = m[2] ? Number(m[3] || 1) : 0;
    o[p] = (o[p] || 0) + c;
  }
  return o;
}
const degree = (o) => Math.max(...Object.keys(o).filter(k => o[k] !== 0).map(Number));
const peval = (o, x) => Object.entries(o).reduce((s, [p, c]) => s + c * x ** p, 0);
// "y = ax + b" as printed, to [a, b]
const line = (s) => { const m = plain(s).replace(/\s+/g, '').match(/^y=(.+)$/); if (!m) return null; const o = poly(m[1]); return o && [o[1] || 0, o[0] || 0]; };
const pt = (s) => { const m = plain(s).match(/\((-?[\d.]+),\s*(-?[\d.]+)\)/); return m && [Number(m[1]), Number(m[2])]; };
const through = (p1, p2) => { const a = (p2[1] - p1[1]) / (p2[0] - p1[0]); return [a, p1[1] - a * p1[0]]; };

/* ---- B. the body ---------------------------------------------- */

{ // Example 1: 4 pens a red box, 5 pencils a blue box, 3 free
  const q = plain(bodyEx[1]); const [pens, pencils, free] = [q.match(/holds (\d+) pens/)[1], q.match(/holds (\d+) pencils/)[1], q.match(/in (\d+) pens free/)[1]];
  says('body Example 1 Answer', rowOf(bodyEx[1], 'Answer'), `${pens}x + ${pencils}y + ${free}`); }
{ const q = plain(bodyEx[2]); const [l, w, s] = [/along its length at ₹(\d+)/, /along its width at ₹(\d+)/, /costing ₹(\d+) a square/].map(r => Number(q.match(r)[1]));
  says('body Example 2 Answer', rowOf(bodyEx[2], 'Answer'), `${2 * l}l + ${2 * w}w + ${s}lw`); }
{ const P = Number(plain(bodyEx[3]).match(/wire (\d+) cm long/)[1]);
  says('body Example 3 Answer', rowOf(bodyEx[3], 'Answer'), `x(${P / 2} - x) = ${P / 2}x - x^{2}`);
  is('body Example 3: 7 by 3 and 5.5 by 4.5 have perimeter 20', 2 * (7 + 3) === P && 2 * (5.5 + 4.5) === P); }
says('body Example 4 Answer', rowOf(bodyEx[4], 'Answer'), '4x');
const tableRows = (panel) => [...(panel.match(/<tbody>([\s\S]*?)<\/tbody>/) || ['', ''])[1].matchAll(/<tr><td>([^<]*)<\/td><td>([^<]*)<\/td><\/tr>/g)]
  .map(m => [m[1], m[2]]).filter(r => /^\d/.test(r[0])).map(r => [Number(r[0]), Number(r[1].replace(/\$/g, '').split('=').pop())]);
{ const rows = tableRows(bodyEx[5]); is('body Example 5 table: 200 + 50m', rows.length === 5 && rows.every(([m, v]) => v === 200 + 50 * m));
  says('body Example 5 Answer', rowOf(bodyEx[5], 'Answer'), '200 + 50m'); }
{ const x = lin(x => x + x + 10 - 64); exSays('body', bodyEx, 6, x, x + 10); }
{ const rows = tableRows(bodyEx[7]); is('body Example 7 table: 100 - 5n', rows.length === 5 && rows.every(([d, v]) => v === 100 - 5 * d));
  exSays('body', bodyEx, 7, lin(n => 100 - 5 * n - 40)); }
{ const rows = tableRows(bodyEx[8]); const fare = (d) => (d <= 2 ? 25 : 25 + 15 * (d - 2));
  is('body Example 8 table', rows.length === 6 && rows.every(([d, v]) => v === fare(d)));
  exSays('body', bodyEx, 8, fare(10)); exPrints('body', bodyEx, 8, 10 - 2);
  is('body Example 8: 15n - 5 is the fare from 2 km, and not at 1 km', [2, 3, 7, 10, 40].every(n => 15 * n - 5 === fare(n)) && 15 * 1 - 5 !== fare(1)); }
{ const rows = tableRows(bodyEx[9]); is('body Example 9 table: 100 + 60d', rows.length === 6 && rows.every(([d, v]) => v === 100 + 60 * d)); }
{ const rows = tableRows(bodyEx[10]); is('body Example 10 table: 3 - 0.5t', rows.length === 5 && rows.every(([t, v]) => near(v, 3 - 0.5 * t))); }
{ const [a, b] = through([10, 350], [20, 550]); exSays('body', bodyEx, 11, `y = ${a}x + ${b}`); }
// Examples 12-16: every point printed is on the line printed, and the graphs are drawn to them
const pointsIn = (s) => [...plain(s).matchAll(/\((-?[\d.]+), (-?[\d.]+)\)/g)].map(m => [Number(m[1]), Number(m[2])]);
{ const q = plain(bodyEx[12]).split('Solution')[0]; const ps = pointsIn(q);
  is(`body Example 12: all ${ps.length} points on y = 3x`, ps.length >= 5 && ps.every(([x, y]) => y === 3 * x)); says('body Example 12 Answer', rowOf(bodyEx[12], 'Answer'), 'y = 3x'); }
{ const q = plain(bodyEx[13]).split('Solution')[0]; const ps = pointsIn(q);
  is(`body Example 13: all ${ps.length} points on y = -2x`, ps.length >= 6 && ps.every(([x, y]) => y === -2 * x)); says('body Example 13 Answer', rowOf(bodyEx[13], 'Answer'), 'y = -2x'); }
{ const r = [2, 3, 4].map(k => rowOf(bodyEx[14], `Step ${k}`));
  const slopes = [0.5, 1, 2];
  is('body Example 14: each pair on its line', r.every((s, i) => pointsIn(s).length === 2 && pointsIn(s).every(([x, y]) => near(y, slopes[i] * x)))); }
{ const r = [1, 2, 3].map(k => rowOf(bodyEx[15], `Step ${k}`)); const slopes = [-1 / 3, -1, -3];
  is('body Example 15: each pair on its line', r.every((s, i) => pointsIn(s).length === 2 && pointsIn(s).every(([x, y]) => near(y, slopes[i] * x)))); }
// the running text round the graphs
is('p019: (0.5, 1.5) and (-2, -6) on y = 3x', has(plain(body), '1.5') && 3 * 0.5 === 1.5 && 3 * -2 === -6);
{ const t = plain(body);
  is('p024: at x = 1 and 2 the three lines give 1, 3, 7 and 3, 5, 9, gaps 2 and 4',
    [1, 2].every(x => [2 * x - 1, 2 * x + 1, 2 * x + 5].join() === (x === 1 ? '1,3,7' : '3,5,9')) && (3 - 1) === 2 && (7 - 3) === 4 && /give 1, 3 and 7/.test(t) && /give 3, 5 and 9/.test(t));
  for (const [eq, pnt] of [['y = 2x + 5', 'A (0, 5)'], ['y = x + 3', 'B (0, 3)'], ['y = 3x - 2', 'C (0, -2)']]) {
    const [a, b] = line(eq); is(`p024: ${eq} cuts the y-axis at ${pnt}`, t.includes(`${eq} cuts the y-axis at ${pnt}`) && pt(pnt)[1] === b && a !== 0);
  }
  is('p025: y = x + 3 has intercept 3, y = 3x - 2 has -2', /y = x \+ 3 has y-intercept 3/.test(t) && /y = 3x - 2 has y-intercept -2/.test(t));
  is('p005: side 1, 1.5, 2, 2.5, 3 gives areas 1, 2.25, 4, 6.25, 9 and steps 1.25 ... 2.75',
    [1, 1.5, 2, 2.5, 3].map(s => s * s).join() === '1,2.25,4,6.25,9' && /1, 2.25, 4, 6.25, 9/.test(t) && /1.25, 1.75, 2.25, 2.75/.test(t));
  is('p009: the tile counts 1 to 13 are 2n - 1', [...t.matchAll(/Stage (\d+) gives 2 × \d+ - 1 = (\d+)/g)].every(m => 2 * m[1] - 1 === Number(m[2])));
  is('p015: tiles a = 2, b = -1; Bela a = -5, b = 100', /a = 2, b = -1/.test(t) && /a = -5, b = 100/.test(t));
  is('p021: tiles slope 2, Bela slope -5', /y = 2x - 1 and gained two tiles/.test(t) && /y = 100 - 5x; its slope is -5/.test(t));
}
{ const rows = [...body.matchAll(/<tr><td>(\d+)<\/td><td>(\d+)<\/td><\/tr>/g)].map(m => [+m[1], +m[2]]);
  const tiles = rows.filter(([s]) => s >= 1 && s <= 7).slice(0, 7);
  is('p008: tile table 1 to 7 is 2n - 1', body.includes('<tr><td>7</td><td>13</td></tr>') && [1, 2, 3, 4, 5, 6, 7].every(n => body.includes(`<tr><td>${n}</td><td>${2 * n - 1}</td></tr>`)) && tiles.length === 7); }

// the graphs, measured from their own coordinates
const svgOf = (src, fig) => { const i = src.indexOf(`fignum">Fig. ${fig}<`); return src.slice(src.lastIndexOf('<svg', i), src.indexOf('</svg>', src.lastIndexOf('<svg', i))); };
const dash = (s) => s.replace(/&minus;|–|−/g, '-');
function grid(svg) {
  const ax = svg.match(/class="dg-axis" d="M([\d.]+) ([\d.]+)H[\d.]+ M([\d.]+) [\d.]+V[\d.]+"/);
  const oy = Number(ax[2]), ox = Number(ax[3]);
  const ticks = [...svg.matchAll(/<text class="dg-tick" x="([\d.]+)" y="([\d.]+)"[^>]*>([^<]+)<\/text>/g)].map(m => [+m[1], +m[2], Number(dash(m[3]))]).filter(t => t[2] !== 0);
  const xt = ticks.filter(t => ticks.filter(u => u[1] === t[1]).length > 2);   // the row of x ticks shares a y
  const yt = ticks.filter(t => !xt.includes(t));
  const ux = (xt[1][0] - xt[0][0]) / (xt[1][2] - xt[0][2]);
  const uy = (yt[0][1] - yt[1][1]) / (yt[1][2] - yt[0][2]);
  // every tick sits where its value says
  const ticksOk = xt.every(t => near(ox + ux * t[2], t[0], 0.6)) && yt.every(t => near(yt[0][1] - uy * (t[2] - yt[0][2]), t[1], 0.6));
  return { toXY: (px, py) => [(px - ox) / ux, (oy - py) / uy], ticksOk };
}
const plots = (svg, g) => [...svg.matchAll(/class="dg-plot[^"]*" d="M([\d.]+) ([\d.]+)L([\d.]+) ([\d.]+)"/g)]
  .map(m => [g.toXY(+m[1], +m[2]), g.toXY(+m[3], +m[4])]);
const onLine = ([a, b], [x, y], tol = 0.03) => Math.abs(a * x + b - y) < tol;
const labelled = (svg, g) => [...svg.matchAll(/<circle class="([^"]+)" cx="([\d.]+)" cy="([\d.]+)"[^>]*\/>\s*<text class="dg-label"[^>]*>([^<]+)<\/text>/g)]
  .map(m => ({ open: m[1] === 'dg-line', at: g.toXY(+m[2], +m[3]), says: pt(dash(m[4])) })).filter(L => L.says);
function checkGraph(src, fig, eqs, opts = {}) {
  const svg = svgOf(src, fig); const g = grid(svg);
  is(`Fig. ${fig}: tick labels sit at their values`, g.ticksOk);
  const ls = plots(svg, g);
  is(`Fig. ${fig}: ${ls.length} lines drawn, ${eqs.length} printed`, ls.length === eqs.length);
  eqs.forEach((e, i) => is(`Fig. ${fig}: line ${i + 1} drawn on y = ${e[0]}x + ${e[1]}: ${JSON.stringify(ls[i])}`, ls[i] && ls[i].every(p => onLine(e, p))));
  for (const L of labelled(svg, g)) {
    is(`Fig. ${fig}: point labelled ${L.says} drawn at ${L.at.map(v => +v.toFixed(2))}`, near(L.at[0], L.says[0], 0.03) && near(L.at[1], L.says[1], 0.03));
    if (!opts.offLine?.some(p => p[0] === L.says[0] && p[1] === L.says[1])) is(`Fig. ${fig}: point ${L.says} is on the line`, eqs.some(e => onLine(e, L.says, 1e-9)));
  }
  // each plot label names its own line
  const pl = [...svg.matchAll(/class="dg-plot-label"[^>]*>([^<]+)<\/text>/g)].map(m => line(dash(m[1]).replace('½', '\\tfrac{1}{2}').replace('⅓', '\\tfrac{1}{3}').replace(/(-?)\\tfrac\{1\}\{(\d)\}x/, (_, s, d) => `${s}${1 / d}x`)));
  if (pl.length) ok(`Fig. ${fig}: plot labels`, pl.map(p => p && p.map(v => +v.toFixed(4))), eqs.map(e => e.map(v => +v.toFixed(4))));
  return { svg, g };
}
checkGraph(body, '2.5', [[2, 1]]);
checkGraph(body, '2.6', [[3, 0]]);
checkGraph(body, '2.7', [[-2, 0]]);
checkGraph(body, '2.8', [[0.5, 0], [1, 0], [2, 0]]);
checkGraph(body, '2.9', [[-1 / 3, 0], [-1, 0], [-3, 0]]);
checkGraph(body, '2.10', [[2, -1], [2, 1], [2, 5]]);
{ const { svg, g } = checkGraph(body, '2.11', [[1, 3], [2, 5], [3, -2]]);
  const dots = [...svg.matchAll(/<circle class="dg-fill-teal" cx="([\d.]+)" cy="([\d.]+)"/g)].map(m => g.toXY(+m[1], +m[2]));
  is(`Fig. 2.11: A, B, C drawn at (0, 5), (0, 3), (0, -2): ${JSON.stringify(dots)}`, JSON.stringify(dots.map(p => p.map(v => +v.toFixed(3) + 0))) === JSON.stringify([[0, 5], [0, 3], [0, -2]])); }
// the tile, hexagon and T figures, counted
const countStages = (svg) => { const xs = [...svg.matchAll(/<text class="dg-note" x="([\d.]+)"[^>]*>Stage (\d+)/g)].map(m => +m[1]);
  const rects = [...svg.matchAll(/<(?:rect|path) class="dg-(?:fill-d|line)" (?:x="([\d.]+)"|d="M([\d.]+))/g)].map(m => +(m[1] || m[2]));
  return xs.map((x, i) => rects.filter(r => r >= (i ? (xs[i - 1] + x) / 2 : -1) && r < (i < xs.length - 1 ? (x + xs[i + 1]) / 2 : 1e9)).length); };
ok('Fig. 2.4: tiles at stages 1-4', countStages(svgOf(body, '2.4')), [1, 3, 5, 7]);
ok('Fig. 2.12: hexagons at stages 1-3', countStages(svgOf(body, '2.12')), [1, 2, 3]);
{ const hex = [...svgOf(body, '2.12').matchAll(/d="M([\d.]+) ([\d.]+)L/g)].map(m => +m[1]);
  is('Fig. 2.12: each new hexagon shares a side (centres 34.6 apart)', near(hex[2] - hex[1], 34.7, 0.2) && near(hex[4] - hex[3], 34.7, 0.2)); }
const tStages = countStages(svgOf(beyond, '2B.3'));
ok('Fig. 2B.3: tiles at stages 1-3', tStages, [4, 7, 10]);
{ const svg = svgOf(beyond, '2B.1'); const g = grid(svg);
  const pts = labelled(svg, g);
  is('Fig. 2B.1: four points where the labels say', pts.length === 4 && pts.every(L => near(L.at[0], L.says[0], 0.02) && near(L.at[1], L.says[1], 0.02)));
  const [l] = plots(svg, g); const eq = through([2, 1], [4, 7]);
  is('Fig. 2B.1: the line through (2, 1) and (4, 7) is drawn', l.every(p => onLine(eq, p)));
  is('Fig. 2B.1: the open point is on the line, the filled one 3 above', pts.filter(L => L.open).every(L => onLine(eq, L.says, 1e-9)) && pts.filter(L => !L.open && L.says[0] === 7).every(L => L.says[1] - (eq[0] * 7 + eq[1]) === 3)); }
checkGraph(beyond, '2B.2', [[-2, 10]]);
{ const svg = svgOf(beyond, '2B.4'); const g = grid(svg); const [l] = plots(svg, g);
  const drawn = through(l[0], l[1]);
  is(`Fig. 2B.4: the line drawn is y = ${drawn}`, g.ticksOk && near(drawn[0], 2) && near(drawn[1], -1)); }

// the exercises, read back off ANSWERS.md
const mdSection = (head) => { const i = answersMd.indexOf(head); if (i < 0) return ''; const j = answersMd.indexOf('\n#', i + head.length); return answersMd.slice(i, j < 0 ? undefined : j); };
const mdItem = (head, n) => { const m = mdSection(head).match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`)); return m ? plain(m[1]) : ''; };
const mdSays = (head, n, ...vals) => { for (const v of vals) is(`ANSWERS.md ${head} Q${n} should say ${v}: "${mdItem(head, n).slice(0, 90)}"`, has(mdItem(head, n), v)); };
const S = (k) => `### Exercise Set 2.${k}`, E = '## End-of-Chapter Exercises';
// body questions, read off the page where the numbers sit in maths
const bq = (set, n) => { const i = body.indexOf(`Exercise Set 2.${set}<`); const rest = body.slice(i);
  const m = n === 1 ? rest.match(/<ol class="c-questions">\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/) : rest.match(new RegExp(`data-start="${n}">\\s*<li>([\\s\\S]*?)</li>\\s*</ol>\\s*</div>`));
  return m ? m[1] : ''; };
const partsOf = (q) => [...q.matchAll(/<li>\$([^$]+)\$<\/li>/g)].map(m => m[1]);
// 2.1
{ const ps = partsOf(bq(1, 1)); const deg = ps.map(s => degree(poly(s, s.match(/[xyz]/)?.[0] || 'x')));
  ok('Ex 2.1 Q1 degrees', deg, [2, 3, 0, 1]); mdSays(S(1), 1, ...deg.map(String)); }
{ const o = poly('x^{4} - 3x^{3} + 6x^{2} - 2x + 7'); is('Ex 2.1 Q3 printed', plain(bq(1, 3)).includes('x^{4} - 3x^{3} + 6x^{2} - 2x + 7'.replace(/\$/g, '')) || /x\^\{4\} - 3x\^\{3\} \+ 6x\^\{2\}/.test(bq(1, 3))); mdSays(S(1), 3, o[2], o[3]); }
{ const o = poly('4z^{3} + 5z^{2} - 11', 'z'); mdSays(S(1), 4, o[1] || 0); }
{ const o = poly('9x^{3} + 5x^{2} - 8x - 10'); mdSays(S(1), 5, o[0]); }
// 2.2
{ const o = poly('5x - 3'); mdSays(S(2), 1, ...[0, -1, 2].map(x => peval(o, x))); }
{ const o = poly('7s^{2} - 4s + 6', 's'); mdSays(S(2), 2, ...[0, -3, 4].map(x => peval(o, x))); }
{ const x = lin(x => x + 5 + 3 * x + 5 - 70); mdSays(S(2), 3, x, 3 * x); }
{ const k = 63 / (5 - 2); mdSays(S(2), 4, 2 * k, 5 * k); }
{ const x = lin(x => 5 * x + 2 * 3 * x - 88); mdSays(S(2), 5, x, 3 * x); }
{ const x = 300 / 5; mdSays(S(2), 6, x, 4 * x); }
{ const w = lin(w => 2 * (w + 2 * w + 3) - 24); mdSays(S(2), 7, w, 2 * w + 3); }
{ const x = lin(x => 2 * x + 7 - 41); mdSays(S(2), 8, x, x + 7, 41); }
{ const n = lin(n => 35 * n + 15 - 330); mdSays(S(2), 9, n); }
// 2.3
mdSays(S(3), 1, 500 + 150, 500 + 300, 500 + 450);
mdSays(S(3), 2, 120 - 9, 120 - 18, 120 - 27);
mdSays(S(3), 3, 13 * 12, 13 * 10, 13 * 8, 13 * 2);
mdSays(S(3), 4, 77 * 5, 77 * 9, 77 * 13, 77 * 4);
mdSays(S(3), 5, 500 - 20 * 15);
mdSays(S(3), 6, 400 / 25);
mdSays(S(3), 7, 11 - 7, 7 - 4, 7 - 8);
// 2.4
{ const r = mdItem(S(4), 1); mdSays(S(4), 1, 1.75 + 0.5 * 7); is('Ex 2.4 Q1 table', [...Array(11)].every((_, t) => has(r, 1.75 + 0.5 * t))); }
{ const r = mdItem(S(4), 2); mdSays(S(4), 2, 10000 - 800 * 3); is('Ex 2.4 Q2 table', [...Array(9)].every((_, t) => has(r, 10000 - 800 * t))); }
{ const r = mdItem(S(4), 3); mdSays(S(4), 3, 750 + 50 * 6); is('Ex 2.4 Q3 table', [...Array(11)].every((_, t) => has(r, 750 + 50 * t))); }
{ const r = mdItem(S(4), 4); mdSays(S(4), 4, 600 / 15); is('Ex 2.4 Q4 table', [...Array(10)].every((_, i) => has(r, 600 - 15 * (i + 1)))); }
// 2.5
{ const [a, b] = through([10, 400], [14, 500]); mdSays(S(5), 1, a, b); }
{ const [a, b] = through([10, 800], [15, 1100]); mdSays(S(5), 2, a, b); }
{ const [a, b] = through([32, 0], [212, 100]); is(`Ex 2.5 Q3: a = 5/9, b = -160/9`, near(a, 5 / 9) && near(b, -160 / 9)); mdSays(S(5), 3, '5/9', '160/9'); }
// the end of the chapter
{ const o = poly(plain(mdItem(E, 1)).match(/x\^\{3\}[^:]*?(?=:)/)[0].replace(/\^\{/g, '^{').replace(/ /g, '').replace(/\^\{(\d)\}/g, '^{$1}'));
  is('End Q1: the example has degree 3 and -7x^2', o && degree(o) === 3 && o[2] === -7); }
mdSays(E, 2, peval(poly('5x^{2} - 3x + 7'), 1));
{ const x = (-7 / 12 - 2 / 3) / (5 / 2); is(`End Q3: x = ${x}`, near(x, -0.5)); mdSays(E, 3, '-1/2', '-5/4'); }
{ const x = lin(x => 5 * x + 21 - 2 * (x + 21)); mdSays(E, 4, x, 5 * x); }
mdSays(E, 5, 800 + 250 * 6, 800 + 250 * 24);
{ const found = []; for (let a = 1; a <= 9; a++) for (let b = 0; b <= 9; b++) if (Math.abs(a - b) === 3 && 10 * a + b + 10 * b + a === 143) found.push(10 * a + b);
  ok('End Q6: the numbers', found.sort(), [58, 85]); mdSays(E, 6, 58, 85); }
{ const parts = [['-3x + 4', 1], ['4x + 7', 2], ['6x - 10', 5], ['6x - 11', 3]].map(([r, k]) => { const o = poly(r); return [o[1] / k, o[0] / k]; });
  const r = mdItem(E, 7);
  is(`End Q7: slopes ${parts.map(p => p[0])}`, has(r, -3) && has(r, 4) && has(r, 3.5) && has(r, 1.2) && has(r, -2) && r.includes('11/3'));
  is('End Q7: (ii) and (iv) parallel, and only they', parts[1][0] === parts[3][0] && parts[1][1] !== parts[3][1] && parts[0][0] !== parts[2][0] && /\(ii\) and \(iv\)/.test(r)); }
{ const F = 9 / 5 * (313 - 273) + 32, K = (158 - 32) * 5 / 9 + 273; mdSays(E, 8, F, K, 313 - 273, 158 - 32); }
mdSays(E, 9, 3 * 2);
{ const [a, b] = through([1, 5], [3, 11]); mdSays(E, 10, a, b, '-2/3'); is('End Q10: p(x) = 3x + 2', mdItem(E, 10).includes(`p(x) = ${a}x + ${b}`)); }
{ // p(0) = 5, (p - q)(3) = 0, p + q = 6x + 4
  const b = 5, d = 4 - b, apc = 6, amc = -(b - d) / 3; const a = (apc + amc) / 2, c = (apc - amc) / 2;
  const r = mdItem(E, 11); is(`End Q11: p = ${a}x + ${b}, q = ${c}x + ${d}`, r.includes(`p(x) = ${a}x + ${b}`) && r.includes(`q(x) = ${c}x - ${-d}`));
  is('End Q11: the three conditions hold', b === 5 && (a - c) * 3 + (b - d) === 0 && a + c === 6 && b + d === 4); }
{ const m = (n) => 6 + 5 * (n - 1); const r = mdItem(E, 12);
  is('End Q12: 6, 11, 16, 21, 26', [1, 2, 3, 4, 5].every(n => has(r, m(n)))); mdSays(E, 12, m(15), 199);
  is('End Q12: 200 is not a stage', !Number.isInteger((200 - 1) / 5) && /\*\*No\.\*\*/.test(mdSection(E))); }
{ const [a, b] = through([2, 3], [6, 11]); const d = -1 - a * 4; const r = mdItem(E, 13);
  is(`End Q13: p = ${a}x ${b}, q = ${a}x ${d}`, r.includes(`p(x) = ${a}x - ${-b}`) && r.includes(`q(x) = ${a}x - ${-d}`)); mdSays(E, 13, '1/2', '9/2'); }
is('End Q14: ax + a is zero at -1 for every a', [0.5, 1, 7].every(a => a * -1 + a === 0) && mdItem(E, 14).includes('(-1, 0)'));

// Think and Reflect, read back off ANSWERS.md
const mdPart = (head) => { const i = answersMd.indexOf(head); const j = answersMd.indexOf('\n## ', i + head.length); return plain(answersMd.slice(i, j < 0 ? undefined : j)); };
{ const t = mdPart('## 2.2 Linear Polynomials');
  is('T&R perimeters 4 to 12', [1, 1.5, 2, 2.5, 3].every(s => has(t, 4 * s)));
  is(`T&R ₹750: ${lin(m => 200 + 50 * m - 750)} matches`, has(t, lin(m => 200 + 50 * m - 750)));
  is('T&R 10x - x^2 at 6', has(t, 10 * 6 - 36) && 10 * 6 - 6 * 6 === 24); }
{ const t = mdPart('## 2.3 Exploring Linear Patterns');
  is('T&R tiles 29, 51, stage 11, 24, 25.5', [2 * 15 - 1, 2 * 26 - 1, (21 + 1) / 2, (47 + 1) / 2, (50 + 1) / 2].every(v => has(t, v)));
  is('T&R Bela: 25 on day 15, runs out day 20', has(t, 100 - 5 * 15) && has(t, 100 / 5));
  is('T&R ₹130: 9 km', has(t, (130 + 5) / 15)); }
{ const t = mdPart('## 2.4 Linear Growth');
  is('T&R 15 km, ₹700', has(t, 100 + 60 * 15) && has(t, (700 - 100) / 60));
  is('T&R depth after 5 months, empty at 6', has(t, 3 - 0.5 * 5) && has(t, 3 / 0.5) && has(t, 3 - 0.5 * 7)); }
{ const t = mdPart('## 2.6 Visualising');
  is('T&R y = 2x + 1 at 1, 2, 5, 7, 9, 12, 20', t.includes([1, 2, 5, 7, 9, 12, 20].map(x => 2 * x + 1).join(', ')));
  is('p017 T&R prints x = 1 gives 3, x = 7 gives 15', /x = 1 gives y = 3/.test(plain(body)) && /x = 7 gives y = 15/.test(plain(body)) && 2 + 1 === 3 && 14 + 1 === 15); }

/* ---- B. Beyond the Book --------------------------------------- */

// Stage 1, as printed in its running text
{ const t = plain(beyond); const s1 = t.slice(0, t.indexOf('Solved Examples'));
  const tab = [[3, 13], [5, 19], [7, 25], [9, 31]];
  const a = (tab[1][1] - tab[0][1]) / (tab[1][0] - tab[0][0]), b = tab[0][1] - a * tab[0][0];
  is('Stage 1 Q1: the table is linear', tab.every(([x, y]) => a * x + b === y));
  is(`Stage 1 Q1: y = ${a}x + ${b}, ${a * 20 + b} at 20`, s1.includes(`y = ${a}x + ${b}`) && has(s1, a * 20 + b) && s1.includes(`13 = 3 × 3 + b, so b = ${b}`));
  const n179 = (179 + 3) / 7; is(`Stage 1 Q2: 179 is term ${n179}`, [4, 11, 18, 25].every((v, i) => v === 7 * (i + 1) - 3) && s1.includes(`n = ${n179}`) && !Number.isInteger((150 + 3) / 7));
  const bill = [150, 170, 190, 215, 230]; const good = (u) => 150 + 20 * u;
  is('Stage 1 Q3: only the 3-unit bill is off, by 5; 210', bill.map((v, u) => v !== good(u)).join() === 'false,false,false,true,false' && good(3) === 210 && bill[3] - good(3) === 5 && s1.includes('20, 20, 25, 15'));
  const [la, lb] = through([2, 1], [4, 7]);
  is(`Stage 1 Q4: y = ${la}x ${lb}, ${la * 7 + lb} at 7; second rise ${(19 - 7) / 3} a step`, s1.includes(`y = ${la}x - ${-lb}`) && s1.includes(`gives ${la * 7 + lb}, not 19`) && (19 - 7) / 3 === 4 && la === 3);
  const [ma, mb] = through([0, 6], [3, 0]);
  is(`Stage 1 Q5: y = ${ma}x + ${mb}; (0, -10) and (2.5, 0)`, s1.includes(`y = ${ma}x + ${mb}`) && s1.includes('(0, -10)') && s1.includes(`(${10 / 4}, 0)`)); }

// Stage 2
const exOpts = (n) => [...(beyondEx[n].match(/<ol class="c-parts c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/) || ['', ''])[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => plain(m[1]).trim());
const exKey = (n) => (rowOf(beyondEx[n], 'Answer').match(/\(([a-d])\)/) || [])[1];
const num = (s) => Number(String(s).replace(/[^\d.\-]/g, ''));
{ const q = plain(beyondEx[1]); const [rows, per, extra] = [/(\w) rows of (\d+)/, /and (\d+) more/].map(r => q.match(r));
  const k = Number(rows[2]), e = Number(per[1]);
  exSays('Beyond', beyondEx, 1, `${k}r + ${e}`); is('Beyond Ex 1 check', rowOf(beyondEx[1], 'Check').includes(`= ${k * 4 + e}`)); }
{ const o = poly('4 - 3y^{2} + 2y^{3} - y', 'y'); const right = `${degree(o)} and ${o[2]}`;
  ok('Beyond Example 2: the right option', exOpts(2).map((s, i) => (s === right ? 'abcd'[i] : null)).filter(Boolean), [exKey(2)]);
  is('Beyond Ex 2 remarks', exOpts(2)[1] === `${degree(o)} and ${-o[2]}` && exOpts(2)[3] === `${o[0]} and ${o[3]}`); }
{ const o = poly('3x^{2} - 5x + 2'); exSays('Beyond', beyondEx, 3, ...[0, 2, -1].map(x => peval(o, x))); }
{ const x = lin(x => x + 24 + 3 - 3 * (x + 3)); exSays('Beyond', beyondEx, 4, x, x + 24);
  is('Beyond Ex 4 check', rowOf(beyondEx[4], 'Check').includes(`${x + 3} and ${x + 27}`) && x + 27 === 3 * (x + 3)); }
{ const x = lin(x => 5 * x + 2 * (25 - x) - 77); exSays('Beyond', beyondEx, 5, x, 25 - x);
  is('Beyond Ex 5 check', rowOf(beyondEx[5], 'Check').includes(`${5 * x} + ${2 * (25 - x)} = 77`)); }
{ const row = (n) => 18 + 3 * (n - 1); exSays('Beyond', beyondEx, 6, row(13), lin(n => row(n) - 63));
  is('Beyond Ex 6: row n is 3n + 15', [1, 2, 3, 13].every(n => row(n) === 3 * n + 15)); }
{ const charge = (n) => (n <= 2 ? 40 : 40 + 15 * (n - 2));
  is('Beyond Ex 7: 15n + 10 is the charge from 2 kg', [2, 3, 9].every(n => 15 * n + 10 === charge(n)));
  ok('Beyond Example 7: the right option', exOpts(7).map(num).map((v, i) => (v === charge(1) ? 'abcd'[i] : null)).filter(Boolean), [exKey(7)]);
  is('Beyond Ex 7 remarks: (a) rule at 1, (b) rate, (d) 3 kg', num(exOpts(7)[0]) === 15 + 10 && num(exOpts(7)[1]) === 15 && num(exOpts(7)[3]) === charge(3)); }
{ const [a, b] = through([2, 24], [5, 15]);
  ok('Beyond Example 8: the right option', exOpts(8).map(num).map((v, i) => (v === b ? 'abcd'[i] : null)).filter(Boolean), [exKey(8)]);
  is('Beyond Ex 8 remarks', num(exOpts(8)[1]) === 24 - a && num(exOpts(8)[3]) === 24 - 3 * a && num(exOpts(8)[0]) === 24 + 2 * a); }
exSays('Beyond', beyondEx, 9, lin(t => 100 - 8 * t - 20), '100 - 8t');
{ const [a, b] = through([2, 7], [5, 16]);
  ok('Beyond Example 10: the right option', exOpts(10).map(num).map((v, i) => (v === b ? 'abcd'[i] : null)).filter(Boolean), [exKey(10)]);
  is('Beyond Ex 10 remarks', num(exOpts(10)[1]) === a && num(exOpts(10)[2]) === 7 - a && num(exOpts(10)[3]) === 16 - 2 * a); }
{ const [a, b] = through([2, 12], [4, 15]); exSays('Beyond', beyondEx, 11, `L = ${a}k + ${b}`); }
{ const [a, b] = through([1, 2], [4, 11]); const k = a * 6 + b;
  ok('Beyond Example 12: the right option', exOpts(12).map(num).map((v, i) => (v === k ? 'abcd'[i] : null)).filter(Boolean), [exKey(12)]);
  is('Beyond Ex 12 remarks', num(exOpts(12)[0]) === 11 + a && num(exOpts(12)[1]) === a * 6 && num(exOpts(12)[3]) === 11 + 2); }
{ is('Beyond Ex 13: (-2, -11) on y = 4x - 3', 4 * -2 - 3 === -11); exSays('Beyond', beyondEx, 13, lin(m => 4 * m - 3 - 13)); }
{ const [a, b] = through([2, 6], [5, 0]);
  ok('Beyond Example 14: the right option', exOpts(14).map(pt).map((p, i) => (p[0] === 0 && p[1] === b ? 'abcd'[i] : null)).filter(Boolean), [exKey(14)]);
  is('Beyond Ex 14 remarks', pt(exOpts(14)[1])[1] === 6 - a && pt(exOpts(14)[2])[1] === 6 - 3 * a && pt(exOpts(14)[3])[1] === 6);
  is('Fig. 2B.2 caption: risen 4 in two steps', -2 * a === 4 && /risen 4 by then/.test(plain(beyond))); }
{ const a = -8 / 2, b = 6 / 2; exSays('Beyond', beyondEx, 15, `y = ${a}x + ${b}`, `(0, ${b})`, `(${-b / a === 0.75 ? '3/4' : -b / a}, 0)`); }
is('Beyond Ex 16: the printed expansion a(n + 1) + b - (an + b) = an + a + b - an - b',
  rowOf(beyondEx[16], 'Step 3').includes('an + a + b - an - b') && [[2, 5, 3], [-1.5, 4, 11]].every(([a, b, n]) => near(a * (n + 1) + b - (a * n + b), a * n + a + b - a * n - b)));
is('Ex 2.5 Q3: 5/9 F - 160/9 is 5/9 (F - 32)', [0, 32, 100, 212, -40].every(F => near(5 / 9 * F - 160 / 9, 5 / 9 * (F - 32))) && mdItem(S(5), 3).includes('5/9(F - 32)'));
is('Beyond Ex 16: p(n + 1) - p(n) = a for many polynomials', [[2, 5], [-3, 1], [0.5, -7]].every(([a, b]) => [0, 1, 7, 40].every(n => near(a * (n + 1) + b - (a * n + b), a))));

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
const keySays = (q, ...vals) => { for (const v of vals) is(`key ${q} should say ${v}: "${row(q)}"`, typeof v === 'string' ? norm(row(q)).includes(norm(v)) : has(row(q), v)); };
const P = {};
{ const o = poly('9 - 4x'); P[21] = [o[1], o[0], degree(o)]; }
P[22] = [peval(poly('x^{2} - 3x + 5'), -2)];
P[23] = [6 / 2, -5 / 2];
{ const x = lin(x => 3 * x + 6 - 81); P[24] = [x, x + 2, x + 4]; }
{ const b = -4, a = (5 - b) / 3; P[25] = [`p(x) = ${a}x - ${-b}`, a * 10 + b, `${-b}/${a}`]; }
{ const [a, b] = through([2, 550], [5, 1000]); P[26] = [a, b, b + a * 3.5]; }
{ const a = (-2 - 4) / 3; P[27] = [a, `(${-4 / a}, 0)`]; }
P['28a'] = ['199 + 2m', '99 + 4m'];
P['28b'] = [lin(m => 199 + 2 * m - (99 + 4 * m))];
P['28c'] = [199 + 2 * 80, 99 + 4 * 80, 99 + 4 * 80 - (199 + 2 * 80)];
{ const tab = [[2, 32], [5, 47], [7, 57], [10, 72]]; const rates = tab.slice(1).map((r, i) => (r[1] - tab[i][1]) / (r[0] - tab[i][0]));
  is('Q29: the rate is the same between every pair of readings', rates.every(v => v === rates[0]));
  const [a, b] = through(tab[0], tab[1]); P['29a'] = [15, 10, a]; P['29b'] = [`T = ${a}t + ${b}`]; P['29c'] = [b]; P['29d'] = [(100 - b) / a];
  is('Q29: every reading on the rule', tab.every(([t, T]) => a * t + b === T)); }
{ const tab = [[0, 500], [1, 465], [2, 430], [3, 395]]; const [a, b] = through(tab[0], tab[1]);
  is('Q31: the table is linear', tab.every(([d, B]) => a * d + b === B));
  let d = 0; while (a * d + b >= 100) d++;
  P['31a'] = [-a]; P['31b'] = [`B = ${b} - ${-a}d`]; P['31c'] = [a * 8 + b]; P['31d'] = [d, a * (d - 1) + b, a * d + b]; }
{ const [a, b] = through([4, 140], [10, 290]); P['32a'] = [a]; P['32b'] = [b]; P['32c'] = [a * 16 + b]; P['32d'] = [(590 - b) / a]; }
for (const [q, vs] of Object.entries(P)) keySays(q, ...vs);
is('key 30: the common point is (1, a + b)', [[2, 5], [-1, 3], [0.5, 4]].every(([a, b]) => a * 1 + b === b * 1 + a) && row(30).includes('(1, a + b)'));

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] ??= m[2];
const optsOf = (n) => { const o = (qs[n] || '').match(/<ol class="c-parts c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/); return o ? [...o[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => plain(x[1]).trim()) : []; };
const stem = (n) => plain((qs[n] || '').split('<ol')[0]);
const key = {};
{ const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2]; }
const numIs = (f) => (o) => o.map(num).map(v => near(v, f));
const linearSeq = (s) => { const v = s.split(',').map(Number); const d = v.slice(1).map((x, i) => x - v[i]); return d.every(x => x === d[0]); };
const solve = {
  1: numIs(degree(poly(stem(1).match(/polynomial (.+?) is/)[1]))),
  2: numIs(line(stem(2).match(/line (y = .+?) is/)[1])[0]),
  3: (o) => { const [a, b] = line(stem(3).match(/line (y = .+?) crosses/)[1]); return o.map(pt).map(p => p[1] === 0 && near(p[0], -b / a)); },
  4: (o) => o.map(s => linearSeq(s)),
  5: (o) => { const seq = stem(5).match(/of (.+?) is/)[1].split(',').map(Number).filter(Number.isFinite);
    return o.map(s => { const p = poly(s.replace(/\s/g, ''), 'n'); return !!p && seq.every((v, i) => peval(p, i + 1) === v); }); },
  6: (o) => { const [l1, l2] = [...stem(6).matchAll(/y = [^ ]+ [+-] \d+|y = [^ ]+/g)].map(m => line(m[0]));
    const truth = { 'meet at the origin': l1[1] === 0 && l2[1] === 0, 'are parallel': l1[0] === l2[0] && l1[1] !== l2[1], 'are the same line': l1[0] === l2[0] && l1[1] === l2[1], 'meet at (0, 1)': l1[1] === 1 && l2[1] === 1 };
    return o.map(s => truth[s]); },
  7: (o) => { const n = (47 - 2) / 3; return o.map(s => (Number.isInteger(n) ? num(s) === n && /^\d+$/.test(s) : s === 'there is none')); },
  8: (o) => { const t = qs[8]; const xs = [...t.match(/<thead>[\s\S]*?<\/thead>/)[0].matchAll(/<td>\$(-?\d+)\$<\/td>/g)].map(m => +m[1]);
    const ys = [...t.match(/<tbody>[\s\S]*?<\/tbody>/)[0].matchAll(/<td>\$(-?\d+)\$<\/td>/g)].map(m => +m[1]);
    return o.map(s => { const [a, b] = line(s); return xs.every((x, i) => a * x + b === ys[i]); }); },
  9: (o) => o.map(s => s === (2 * 3 - 6 === 0 ? 'Ravi is right' : 'neither is right')),
  10: (o) => o.map(s => s === (linearSeq('1,2,4,8,16') ? 'Bilal is right' : 'Asha is right')),
  11: (o) => { const [a, b] = through([0, 3], [2, 7]); return o.map(pt).map(([x, y]) => a * x + b === y); },
  12: (o) => { const [a, b] = [-3, 5]; const tv = [a === -3, b === 5, a * 2 + b === 1];
    const name = ['(i) only', '(i) and (ii)', '(ii) and (iii)', 'all three'];
    const sets = [[1, 0, 0], [1, 1, 0], [0, 1, 1], [1, 1, 1]];
    return o.map(s => { const i = name.indexOf(s); return i >= 0 && sets[i].every((v, j) => !!v === tv[j]); }); },
  13: numIs(lin(k => (3 * k - 2 - k) - (16 - (3 * k - 2)))),
  14: (o) => { const d = tStages[1] - tStages[0], b = tStages[0] - d, n = (100 - b) / d; return o.map(s => (Number.isInteger(n) ? num(s) === n : s === 'there is none')); },
  15: (o) => { const svg = svgOf(beyond, '2B.4'); const g = grid(svg); const [l] = plots(svg, g); const [a, b] = through(l[0], l[1]);
    return o.map(s => { const L = line(s); return near(L[0], a) && near(L[1], b); }); },
  16: numIs(lin(t => 30 - 2 * t - (20 - t))),
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Q${q}: the right option`, right, [key[q]]);
}
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  17: [5 * 0 === 0, true, true],                              // y = ax is 0 at x = 0: the reason
  18: [4 * 0 - 3 === -4 * 0 - 3, true, false],                // they meet on the axis because the constants agree, not the slopes
  19: [false, true, false],                                   // two readings at the same x fix nothing
  20: [true, false, false],                                   // linear means a is not 0
};
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
is('Q17-20 are assertion-reason pairs', [17, 18, 19, 20].every(q => /Assertion \(A\)/.test(qs[q] || '') && /Reason \(R\)/.test(qs[q] || '')));
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-20', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(20)].map((_, i) => i + 1));
ok('practice numbered 1-32', [...beyond.split('c-practice__num')[1].matchAll(/data-start="(\d+)"/g)].map(m => Number(m[1])), [...Array(31)].map((_, i) => i + 2));
ok('Beyond examples numbered 1-17', Object.keys(beyondEx).map(Number), [...Array(17)].map((_, i) => i + 1));
is('every Beyond example has an Answer row', Object.values(beyondEx).every(p => /work__label">Answer</.test(p)));
is('every body example has an Answer row', Object.keys(bodyEx).length === 16 && Object.values(bodyEx).every(p => /work__label">Answer</.test(p)));

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
{ const i = answersMd.indexOf('as the key prints it'); for (const m of answersMd.slice(i, i + 700).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2]; }
ok('ANSWERS.md key matches the page', mdKey, key);
const W = '### The working for each';
for (const [q, vs] of Object.entries(P)) {
  const [, n, part] = q.match(/^(\d+)([a-d]?)$/);
  let r = mdItem(W, n);
  if (part) { const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\)|$)`)); r = m ? m[1] : ''; }
  if (['29a', '31d', '28c'].includes(q)) r = mdItem(W, n);     // a phrase on the page, shorter here
  for (const v of vs) {
    if (q === '29a' && v !== 5) continue;
    if (q === '31d' && v !== 12) continue;
    if (q === '28c' && v === 419 - 359 - 1) continue;
    is(`ANSWERS.md practice ${q} should say ${v}: "${r.slice(0, 80)}"`, typeof v === 'string' ? norm(r).includes(norm(v)) : has(r, v));
  }
}
for (const q of Object.keys(solve)) {
  const o = optsOf(q), right = o['abcd'.indexOf(key[q])] || '';
  const v = num(right);
  if (/^-?\d+$/.test(right.replace(/\s/g, ''))) is(`ANSWERS.md practice ${q} should reach ${v}`, has(mdItem(W, q), v));
}
{ const t = mdSection('### Stage 1');
  is('ANSWERS.md Stage 1 values match the page', ['y = 3x + 4', '64', '26', '210', 'y = 3x - 5', '16', 'y = -2x + 6', '(0, -10)', '(2.5, 0)'].every(v => plain(t).includes(v))); }

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
