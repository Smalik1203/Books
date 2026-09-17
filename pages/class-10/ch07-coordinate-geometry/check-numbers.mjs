#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: distances,
   section-formula points, ratios and shapes are computed from the
   coordinates the page prints, and compared with what the page says.

     node pages/class-10/ch07-coordinate-geometry/check-numbers.mjs [--skipped]

   Five parts:
     A  every identity set as maths, on every page and in ANSWERS.md, whose
        sides evaluate. A distance name such as AB or PQ^2 is read as the
        distance between the points A and B printed nearest before it (in
        the same example, question or answer); a tuple (a, b) is compared
        coordinate by coordinate; a printed decimal is compared to its own
        number of places, and a surd with a tolerance
     B  what A cannot check: each example and exercise answer re-derived
        from the coordinates in its question, the practice answers read
        back out of the key rows a lettered part at a time, and the plotted
        points in the figures against their labels
     C  every multiple-choice question has exactly one right option, the
        one the key prints; every assertion-reason letter is derived
     D  ANSWERS.md prints the same key as the page, and its working agrees
   Exits non-zero if anything does not hold up. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
let pass = 0;
const fails = [];
const TOL = 1e-9;
const near = (a, b, t = TOL) => Array.isArray(a) || Array.isArray(b)
  ? Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((x, i) => near(x, b[i], t))
  : Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= t * Math.max(1, Math.abs(a), Math.abs(b));
const ok = (what, got, want) => {
  const same = typeof got === 'number' || (Array.isArray(got) && got.every(x => typeof x === 'number' || Array.isArray(x)))
    ? near(got, want) : JSON.stringify(got) === JSON.stringify(want);
  if (same) pass++; else fails.push(`${what}\n      computed ${JSON.stringify(got)}\n      printed  ${JSON.stringify(want)}`);
};
const is = (what, cond) => { if (cond) pass++; else fails.push(what); };

/* ---- the mathematics ----------------------------------------- */

const d2 = (p, q) => Math.round(((p[0] - q[0]) ** 2 + (p[1] - q[1]) ** 2) * 1e9) / 1e9;
const dist = (p, q) => Math.sqrt(d2(p, q));
const section = (a, b, m, n) => [(m * b[0] + n * a[0]) / (m + n), (m * b[1] + n * a[1]) / (m + n)];
const mid = (a, b) => section(a, b, 1, 1);
const collinear = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) === 0;
// a quadrilateral taken in order: what it is, from its sides and diagonals only
function shape(A, B, C, D) {
  if ([[A, B, C], [A, B, D], [A, C, D], [B, C, D]].some(t => collinear(...t))) return 'none';
  const s = [d2(A, B), d2(B, C), d2(C, D), d2(D, A)], dg = [d2(A, C), d2(B, D)];
  const para = s[0] === s[2] && s[1] === s[3];
  if (!para) return 'other';
  const rh = s[0] === s[1], rect = dg[0] === dg[1];
  return rh && rect ? 'square' : rh ? 'rhombus' : rect ? 'rectangle' : 'parallelogram';
}
// the ratio k : 1 in which P divides AB, from the x-coordinates (or y if x is level)
const ratioAt = (A, B, P) => (A[0] !== B[0] ? (P[0] - A[0]) / (B[0] - P[0]) : (P[1] - A[1]) / (B[1] - P[1]));
const ratioStr = (k) => { for (let n = 1; n <= 50; n++) { const m = k * n; if (Math.abs(m - Math.round(m)) < 1e-9) { const g = gcd(Math.round(m), n); return `${Math.round(m) / g} : ${n / g}`; } } return null; };
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
// a value as the page sets it: an integer, a decimal, or \frac{p}{q}
function fmt(v) {
  if (Number.isInteger(v)) return String(v);
  for (let q = 2; q <= 50; q++) {
    const p = v * q;
    if (Math.abs(p - Math.round(p)) < 1e-9) {
      if (q === 2 && false) break;
      return `${p < 0 ? '-' : ''}\\frac{${Math.abs(Math.round(p))}}{${q}}`;
    }
  }
  return String(+v.toFixed(3));
}
const pt = (p) => `(${fmt(p[0])}, ${fmt(p[1])})`;

/* ---- reading LaTeX --------------------------------------------- */

// LaTeX -> a small expression language: numbers, + - * / ^, Q(...) for a
// square root, parentheses, commas for tuples, and : for a ratio
function latexToExpr(s) {
  let t = s
    .replace(/\\left|\\right/g, '')
    .replace(/\\qquad\s*\(\d\)/g, '')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad|&nbsp;/g, ' ')
    .replace(/\\times|\\cdot/g, '*').replace(/\\div/g, '/');
  for (let i = 0; i < 20; i++) {
    const before = t;
    t = t.replace(/\\sqrt\{([^{}]*)\}/g, 'Q($1)')
      .replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, '(($1)/($2))')
      .replace(/\^\{([^{}]*)\}/g, '^($1)');
    if (t === before) break;
  }
  return t.replace(/\s+/g, '');
}
function tokenize(s) {
  const out = [];
  for (let i = 0; i < s.length;) {
    const c = s[i];
    const m = s.slice(i).match(/^\d+(\.\d+)?/);
    if (m) { out.push({ t: 'n', v: Number(m[0]), raw: m[0] }); i += m[0].length; continue; }
    if ('+-*/^(),:'.includes(c)) { out.push({ t: c }); i++; continue; }
    if (c === 'Q' && s[i + 1] === '(') { out.push({ t: 'Q' }); i++; continue; }
    return null;
  }
  return out;
}
function parse(tokens) {
  let i = 0;
  const peek = () => tokens[i] && tokens[i].t;
  const num = (x) => { if (typeof x !== 'number') throw 0; return x; };
  function primary() {
    const k = peek();
    if (k === 'n') return tokens[i++].v;
    if (k === 'Q') { i++; if (peek() !== '(') throw 0; i++; const v = num(expr()); if (peek() !== ')') throw 0; i++; return Math.sqrt(v); }
    if (k === '(') {
      i++; const items = [expr()];
      while (peek() === ',') { i++; items.push(expr()); }
      if (peek() !== ')') throw 0; i++;
      return items.length > 1 ? items : items[0];
    }
    throw 0;
  }
  function power() { const b = primary(); if (peek() === '^') { i++; return num(b) ** num(unary()); } return b; }
  function unary() { if (peek() === '-') { i++; return -num(unary()); } if (peek() === '+') { i++; return unary(); } return power(); }
  function term() {
    let v = unary();
    for (;;) {
      const k = peek();
      if (k === '*') { i++; v = num(v) * num(unary()); }
      else if (k === '/') { i++; v = num(v) / num(unary()); }
      else if (k === 'n' || k === '(' || k === 'Q') v = num(v) * num(power());   // 2\sqrt{3}, 3(8)
      else return v;
    }
  }
  function expr() {
    let v = term();
    for (;;) {
      const k = peek();
      if (k === '+') { i++; v = num(v) + num(term()); }
      else if (k === '-') { i++; v = num(v) - num(term()); }
      else return v;
    }
  }
  function ratio() { const a = expr(); if (peek() === ':') { i++; const b = expr(); return num(a) / num(b); } return a; }
  const v = ratio();
  if (i !== tokens.length) throw 0;
  return v;
}
// evaluate one side, with distance names read from the points in view
function evalSide(side, points, env) {
  let s = side.trim();
  if (!s) return undefined;
  if (env) {
    const v = (k) => `(${env[k]})`;
    s = s.replace(/m_?\{?([12])\}?/g, (m, i) => ('m' + i in env ? v('m' + i) : m))
      .replace(/(?<![\\A-Za-z])([xykpab])(?![A-Za-z])/g, (m, c) => (c in env ? v(c) : m));
  }
  s = s.replace(/(?<![\\A-Za-z])([A-Z])([A-Z])(?![A-Za-z(])/g, (m, p, q) => {
    const P = points[p] || (p === 'O' ? [0, 0] : null), R = points[q] || (q === 'O' ? [0, 0] : null);
    return P && R ? `(${dist(P, R)})` : m;
  });
  const toks = tokenize(latexToExpr(s));
  if (!toks) return undefined;
  try { return parse(toks); } catch { return undefined; }
}
// the tolerance a printed side is set to: 7.07 is good to 0.005
const tolOf = (side) => { const m = side.trim().match(/^-?\d+\.(\d+)$/); return m ? 0.5 * 10 ** -m[1].length : null; };

// "a = b, c = d" is two statements; the comma inside a tuple is not a break
function splitParts(span) {
  const out = []; let depth = 0, cur = '';
  for (let i = 0; i < span.length; i++) {
    const ch = span[i];
    if ('({'.includes(ch)) depth++;
    if (')}'.includes(ch)) depth--;
    if (depth === 0 && ch === ',' && /=/.test(cur) && /=/.test(span.slice(i + 1))) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
}

// points printed as A(1, 7) or D = (4, 3); a letter printed with letters is forgotten
function takePoints(latex, points) {
  for (const m of latex.matchAll(/(?<![A-Za-z\\])([A-Z])\s*(=\s*)?\\?(?:left)?\(([^()]*)\)/g)) {
    const parts = m[3].split(',');
    if (parts.length !== 2) continue;
    const v = parts.map(x => evalSide(x, {}));
    if (v.every(Number.isFinite)) points[m[1]] = v;
    else if (!m[2]) delete points[m[1]];
  }
}

let spans = 0; const skipped = [];
// the solution a block works towards: every equation in the block holds
// there (all of them, or, where the block finds two answers, at one of them)
const ENVS = [
  [/^body Example 4/, 'all', [{ x: 2, y: 0 }, { x: 5, y: 3 }, { x: 0, y: -2 }]],
  [/^body Example 5/, 'all', [{ x: 0, y: 9 }]],
  [/^body Example 7/, 'all', [{ m1: 2, m2: 7, k: 2 / 7 }]],
  [/^body (Another way|so \$-4)/, 'all', [{ k: 2 / 7 }]],
  [/^body Example 9/, 'all', [{ k: 5 }]],
  [/^body Example 10/, 'all', [{ p: 7 }]],
  [/^body (\$\\dfrac\{OD|The first equation)/, 'all', [{ x: 12, y: 5 }]],
  [/^beyond Let the point be/, 'all', [{ x: 3, y: 4 }]],
  [/^beyond Let the ratio be/, 'all', [{ k: 3 / 4 }]],
  [/^beyond The diagonals AC and BD/, 'all', [{ x: 4, y: 3 }]],
  [/^beyond Example 3 /, 'any', [{ p: 4 }, { p: -4 }]],
  [/^beyond Example 4 /, 'any', [{ x: 7 }, { x: -1 }]],
  [/^beyond Example 7 /, 'all', [{ x: -2 }]],
  [/^beyond Example 8 /, 'all', [{ x: 2, y: 3 }, { x: 0, y: 0 }, { x: -4, y: -6 }]],
  [/^beyond Example 11 /, 'all', [{ k: 1 / 2 }]],
  [/^beyond Example 12 /, 'all', [{ k: 3 / 5, y: 7 / 2 }]],
  [/^beyond Example 13 /, 'all', [{ a: -12 }]],
  [/^beyond key 22$/, 'all', [{ k: 4 }]],
  [/^beyond key 23$/, 'all', [{ y: -1 }]],
  [/^beyond key 24$/, 'all', [{ k: 2 / 5 }]],
  [/^beyond key 26$/, 'all', [{ a: 1, b: 3 }]],
  [/^beyond key 29$/, 'any', [{ k: 7 }, { k: -3 }]],
  [/^beyond key 10$/, 'all', [{ k: 6 / 7 }]],
  [/^ANSWERS 7\.1 Q7$/, 'all', [{ x: -7 }]],
  [/^ANSWERS 7\.1 Q8$/, 'any', [{ y: 3 }, { y: -9 }]],
  [/^ANSWERS 7\.1 Q9$/, 'any', [{ x: 4 }, { x: -4 }]],
  [/^ANSWERS 7\.1 Q10$/, 'all', [{ x: 0, y: 5 }, { x: 1, y: 2 }]],
  [/^ANSWERS 7\.2 Q4$/, 'all', [{ k: 2 / 7 }]],
  [/^ANSWERS 7\.2 Q5$/, 'all', [{ k: 1 }]],
  [/^ANSWERS 7\.2 Q6$/, 'all', [{ x: 6, y: 3 }]],
  [/^ANSWERS practice 5$/, 'all', [{ y: -2 }]],
  [/^ANSWERS practice 9$/, 'all', [{ k: 2 / 3 }]],
  [/^ANSWERS practice 10$/, 'all', [{ k: 6 / 7 }]],
  [/^ANSWERS practice 18$/, 'all', [{ k: 1 / 2 }]],
  [/^ANSWERS practice 22$/, 'all', [{ k: 4 }]],
  [/^ANSWERS practice 29$/, 'any', [{ k: 7 }, { k: -3 }]],
];
let equations = 0;
function checkSpan(where, raw, points) {
  const envRule = ENVS.find(([re]) => re.test(where));
  takePoints(raw, points);
  const span = raw.replace(/^\{(.*)\}$/s, '$1').replace(/,\s*\\text\{\s*that is,\s*\}/g, ' = ');
  if (!/=|\\neq/.test(span) || /<|>|\\leq|\\geq|\\approx|\\pm/.test(span)) return;
  for (const part of splitParts(span)) {
    if (/^\s*[A-Z]\s*=\s*\([^()]*\)\s*$/.test(part)) continue;      // a definition, not a claim
    if (/\\neq/.test(part)) {
      const [a, b] = part.split('\\neq').map(x => evalSide(x, points));
      if (a === undefined || b === undefined) { skipped.push(`${where}: $${part.trim()}$`); continue; }
      spans++;
      if (near(a, b)) fails.push(`${where}: $${part.trim()}$ — both sides are ${a}`); else pass++;
      continue;
    }
    const sides = part.split('=').filter(x => x.trim());
    if (sides.length < 2) continue;
    const vals = sides.map(x => ({ v: evalSide(x, points), tol: tolOf(x) })).filter(x => x.v !== undefined);
    if (vals.length < 2 && envRule) {
      const [, mode, envs] = envRule;
      const res = envs.map(env => {
        const e = { ...env }; if ('m1' in e) { e.m1 = env.m1; }
        const vs = sides.map(x => evalSide(x.replace(/m_\{?([12])\}?/g, 'm$1'), points, Object.fromEntries(Object.entries(e))));
        return vs.some(v => v === undefined) ? undefined : vs.every(v => near(v, vs[0], 1e-9));
      });
      if (res.every(r => r === undefined)) { skipped.push(`${where}: $${part.trim()}$`); continue; }
      equations++;
      if (mode === 'all' ? res.every(r => r === true) : res.some(r => r === true)) pass++;
      else fails.push(`${where}: $${part.trim()}$ does not hold at ${JSON.stringify(envs)}`);
      continue;
    }
    if (vals.length < 2) { skipped.push(`${where}: $${part.trim()}$`); continue; }
    spans++;
    const exact = vals.find(x => x.tol === null) || vals[0];
    const bad = vals.some(x => !near(x.v, exact.v, x.tol ?? exact.tol ?? TOL) && !(x.tol && typeof x.v === 'number' && Math.abs(x.v - exact.v) <= x.tol));
    if (bad) fails.push(`${where}: $${part.trim()}$ — sides are ${vals.map(x => JSON.stringify(x.v)).join(' and ')}`);
    else pass++;
  }
}
const spansOf = (s) => [...s.replace(/\$\$/g, '$').matchAll(/\$([^$]+)\$/g)].map(m => m[1]);

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const bodyAll = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const noSvg = (s) => s.replace(/<svg[\s\S]*?<\/svg>/g, ' ');
const text = (s) => noSvg(s).replace(/<span class="nb">([^<]*)<\/span>/g, '$1')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/&middot;/g, '·').replace(/\s+/g, ' ');

// top-level blocks of a run of pages, in order
function blocks(run) {
  const out = [];
  for (const page of run) {
    const main = page.slice(page.indexOf('<div class="page__main">') + 24);
    let depth = 0, s = -1;
    for (const m of main.matchAll(/<(\/?)(div|p|h2|h3|ol)\b[^>]*>/g)) {
      if (!m[1]) { if (depth === 0) s = m.index; depth++; }
      else { depth--; if (depth === 0 && s >= 0) { out.push(main.slice(s, m.index + m[0].length)); s = -1; } if (depth < 0) break; }
    }
  }
  return out;
}
const bodyBlocks = blocks(pages.filter(f => /^p0/.test(f)).map(f => html[f]));
const beyondBlocks = blocks(pages.filter(f => /^p1/.test(f)).map(f => html[f]));

/* ---- A. every identity ---------------------------------------- */

// the chapter body and Beyond: points carry on through running text and
// start again at each example, question and try band
const qNum = (b) => { const m = b.match(/<ol class="c-questions"(?: data-start="(\d+)")?>/); return m ? Number(m[1] || 1) : null; };
const practiceQ = {};    // Beyond question number -> its html
for (const [label, list] of [['body', bodyBlocks], ['beyond', beyondBlocks]]) {
  let points = {};
  let set = 0;
  for (const b of list) {
    if (/^<(h2|div class="c-(example|try|practice|keyidea|summary))/.test(b)) points = {};
    if (label === 'beyond' && /c-practice/.test(b) && qNum(b) !== null) practiceQ[qNum(b)] = b;
    if (/work--trace/.test(b)) {
      // each key row sits in the context of its own question
      for (const r of b.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span>\s*<\/div>/g)) {
        const ctx = {};
        takePoints(spansOf(practiceQ[r[1]] || '').join(' '), ctx);
        for (const sp of spansOf(r[2])) checkSpan(`${label} key ${r[1]}`, sp, ctx);
      }
      continue;
    }
    for (const sp of spansOf(noSvg(b).replace(/([A-Z]) is the point \$(\([^$]*\))\$/g, '$$$1$2$$'))) checkSpan(`${label} ${text(b).slice(0, 30).trim()}`, sp, points);
    if (/c-example/.test(b)) points = {};
  }
}

// ANSWERS.md: one context an item, seeded with its question's points
const bodyQ = { '7.1': {}, '7.2': {} };
{
  let set = null;
  for (const b of bodyBlocks) {
    const h = b.match(/Exercise Set (7\.\d)/); if (h) set = h[1];
    if (set && /c-practice/.test(b) && qNum(b) !== null) bodyQ[set][qNum(b)] = b;
  }
}
const mdSection = (from, to) => { const a = answersMd.indexOf(from); const b = to ? answersMd.indexOf(to, a + 1) : answersMd.length; return answersMd.slice(a, b < 0 ? answersMd.length : b); };
const mdItems = (sec) => { const o = {}; for (const m of ('\n' + sec).matchAll(/\n(\d+)\. ([\s\S]*?)(?=\n\d+\. |\n#|\n---|$)/g)) o[m[1]] = m[2]; return o; };
const md71 = mdItems(mdSection('### Exercise Set 7.1', '## 7.3'));
const md72 = mdItems(mdSection('### Exercise Set 7.2', '## Beyond'));
const mdPr = mdItems(mdSection('The working for each'));
const checkMdItem = (where, item, seed) => {
  const ctx = {}; takePoints(spansOf(seed || '').join(' '), ctx);
  // an item's lettered parts and bullets each read on from what came before
  for (const sp of spansOf(item)) checkSpan(where, sp, ctx);
};
for (const [n, it] of Object.entries(md71)) checkMdItem(`ANSWERS 7.1 Q${n}`, it, bodyQ['7.1'][n]);
for (const [n, it] of Object.entries(md72)) checkMdItem(`ANSWERS 7.2 Q${n}`, it, bodyQ['7.2'][n]);
for (const [n, it] of Object.entries(mdPr)) checkMdItem(`ANSWERS practice ${n}`, it, practiceQ[n]);
{
  const run = mdSection('### The questions in the running text', '### Exercise Set 7.1');
  checkMdItem('ANSWERS 7.2 running text', run, '$B(6, 0)$ $D(0, 8)$');
  const run3 = mdSection('## 7.3 Section Formula', '### Exercise Set 7.2');
  checkMdItem('ANSWERS 7.3 running text', run3, '$B(36, 15)$');
  checkMdItem('ANSWERS Activity', mdSection('### Activity 1', '## 7.2'), '');
  checkMdItem('ANSWERS Stage 1', mdSection('### Stage 1', '### Stage 3'), '');
}

/* ---- B. what arithmetic alone does not check -------------------- */

// every numeric pair printed in a piece of LaTeX, in order
function pairs(s) {
  const t = s.replace(/\\left|\\right/g, '');
  const out = [];
  for (let i = 0; i < t.length; i++) {
    if (t[i] !== '(') continue;
    let depth = 0, j = i;
    for (; j < t.length; j++) { if (t[j] === '(') depth++; if (t[j] === ')') { depth--; if (!depth) break; } }
    const inner = t.slice(i + 1, j);
    let dd = 0; const cut = [];
    for (let k = 0; k < inner.length; k++) { if ('({'.includes(inner[k])) dd++; if (')}'.includes(inner[k])) dd--; if (!dd && inner[k] === ',') cut.push(k); }
    if (cut.length !== 1) continue;
    const v = [inner.slice(0, cut[0]), inner.slice(cut[0] + 1)].map(x => evalSide(x, {}));
    if (v.every(Number.isFinite)) out.push(v);
  }
  return out;
}
const mathOf = (s) => spansOf(s).join(' ');
const hasPair = (s, p) => pairs(mathOf(s)).some(q => near(q, p));
const says = (what, s, p) => is(`${what} should print ${pt(p)}: "${text(s).slice(0, 120)}"`, hasPair(s, p));
const saysRatio = (what, s, k) => is(`${what} should print the ratio ${ratioStr(k)}: "${text(s).slice(0, 120)}"`,
  spansOf(s).some(x => x.replace(/[{}\s]/g, '').includes(ratioStr(k).replace(/\s/g, ''))));
const saysVal = (what, s, v) => is(`${what} should print ${fmt(v)}: "${text(s).slice(0, 120)}"`,
  spansOf(s).some(x => { const ps = x.replace(/^\{|\}$/g, '').split(/=|,/); return ps.some(y => near(evalSide(y, {}), v)); })
  || new RegExp(`(^|[^\\d.])${String(v).replace('.', '\\.')}([^\\d]|$)`).test(text(s).replace(/\$[^$]*\$/g, ' ')));
// the point a text names L: "L(a, b)", or the last value of a chain "L = ... = (a, b)"
function namedPoint(s, L) {
  for (const sp of spansOf(s)) {
    const t = sp.replace(/^\{|\}$/g, '');
    const m = t.match(new RegExp(`(?:^|[^A-Za-z])${L}\\((-?[\\d.]+), (-?[\\d.]+)\\)`));
    if (m) return [Number(m[1]), Number(m[2])];
    for (const part of splitParts(t)) {
      const sides = part.split('=');
      if (sides[0].trim() === L) { const v = evalSide(sides[sides.length - 1], {}); if (Array.isArray(v)) return v; }
    }
  }
  return null;
}
const names = (what, s, L, p) => is(`${what} should print ${L}${pt(p)}: "${text(s).slice(0, 120)}"`, near(namedPoint(s, L), p));
const saysWord = (what, s, re) => is(`${what} should say ${re}: "${text(s).slice(0, 120)}"`, re.test(text(s)));

// the body's examples, from their questions
const examples = (list) => list.filter(b => /^<div class="c-example">/.test(b)).map(b => ({
  n: Number(b.match(/Example (\d+)/)[1]),
  q: (b.match(/<div class="c-example__body">\s*<p>([\s\S]*?)<\/p>/) || [])[1] || '',
  opts: [...((b.match(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*?)<\/ol>/) || [])[1] || '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => x[1]),
  ans: (b.match(/work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span>/) || [])[1] || '',
  all: b,
}));
const bx = Object.fromEntries(examples(bodyBlocks).map(e => [e.n, e]));
const QP = (e) => pairs(mathOf(e.q));
is('body has Examples 1-10', Object.keys(bx).join() === '1,2,3,4,5,6,7,8,9,10');
{
  const [P, Q, R] = QP(bx[1]);
  const s = [d2(P, Q), d2(Q, R), d2(P, R)].sort((a, b) => a - b);
  is('Ex 1: a triangle', !collinear(P, Q, R));
  is('Ex 1: right-angled', s[0] + s[1] === s[2]);
  saysWord('Ex 1 answer', bx[1].ans, /right triangle/);
  ok('Ex 1: the right angle is at P', d2(P, Q) + d2(P, R), d2(Q, R));
}
ok('Ex 2: a square', shape(...QP(bx[2])), 'square');
saysWord('Ex 2 answer', bx[2].ans, /is a square/);
is('Ex 3: collinear', collinear(...QP(bx[3])));
saysWord('Ex 3 answer', bx[3].ans, /^Yes/);
// the locus of points equidistant from A and B: 2(b-a).X = |b|^2 - |a|^2
const bisector = (A, B) => [2 * (B[0] - A[0]), 2 * (B[1] - A[1]), B[0] ** 2 + B[1] ** 2 - A[0] ** 2 - A[1] ** 2];
const lineSays = (s) => {   // "ax + by = c" as printed, one coefficient each
  const m = mathOf(s).replace(/[{}\s]/g, '').match(/(-?\d*)x([+-]\d*)y=(-?\d+)/);
  if (!m) return null;
  const c = (t) => (t === '' || t === '+' ? 1 : t === '-' ? -1 : Number(t));
  return [c(m[1]), c(m[2]), Number(m[3])];
};
const sameLine = (a, b) => a && b && near(a[0] * b[1], a[1] * b[0]) && near(a[0] * b[2], a[2] * b[0]) && near(a[1] * b[2], a[2] * b[1]);
is(`Ex 4: the printed relation is the perpendicular bisector: ${text(bx[4].ans)}`, sameLine(bisector(...QP(bx[4])), lineSays(bx[4].ans)));
{
  const [A, B] = QP(bx[5]);
  const y = (B[0] ** 2 + B[1] ** 2 - A[0] ** 2 - A[1] ** 2) / (2 * (B[1] - A[1]));   // x = 0
  says('Ex 5 answer', bx[5].ans, [0, y]);
}
{
  const [A, B] = QP(bx[6]); const r = mathOf(bx[6].q).match(/(\d+)\s*:\s*(\d+)/);
  says('Ex 6 answer', bx[6].ans, section(A, B, Number(r[1]), Number(r[2])));
}
{
  const [P, A, B] = QP(bx[7]);
  is('Ex 7: the point is on AB', collinear(A, B, P));
  saysRatio('Ex 7 answer', bx[7].ans, ratioAt(A, B, P));
}
{
  const [A, B] = QP(bx[8]);
  says('Ex 8 answer', bx[8].ans, section(A, B, 1, 2)); says('Ex 8 answer', bx[8].ans, section(A, B, 2, 1));
  // Fig. 7.11 marks P and Q at the thirds
  const xs = [...bx[8].all.matchAll(/<text class="dg-label" x="([\d.]+)" y="14"[^>]*>([APQB])</g)].map(m => [m[2], Number(m[1])]);
  const X = Object.fromEntries(xs);
  is('Fig. 7.11: P and Q at the thirds of AB', near(X.P - X.A, (X.B - X.A) / 3) && near(X.Q - X.A, 2 * (X.B - X.A) / 3));
}
{
  const [A, B] = QP(bx[9]);
  const k = -A[0] / B[0];
  saysRatio('Ex 9 answer', bx[9].ans, k);
  says('Ex 9 answer', bx[9].ans, section(A, B, k, 1));
}
{
  const [A, B, C] = QP(bx[10]); const D1 = mathOf(bx[10].q).match(/D\(p, (-?\d+)\)/);
  const D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];
  ok('Ex 10: D has the printed y-coordinate', D[1], Number(D1[1]));
  is(`Ex 10 answer should be p = ${D[0]}: "${text(bx[10].ans)}"`, new RegExp(`p\\s*=\\s*${D[0]}\\b`).test(bx[10].ans));
}
// the running text of 7.2 and 7.3
ok('7.2: BD in Fig. 7.2', dist([6, 0], [0, 8]), 10);
ok('7.2: PT and QT for P(6, 4), Q(-5, -3)', [6 - -5, 4 - -3], [11, 7]);
is('7.2: 13^2 < 170 < 14^2', 169 < 170 && 170 < 196);
{
  const P = section([0, 0], [36, 15], 1, 2);
  ok('7.3: the relay tower P', P, [12, 5]);
  ok('7.3: OP : PB', dist([0, 0], P) / dist(P, [36, 15]), 1 / 2);
  is('7.3: Fig. 7.1 draws B 36 across and 15 up', /M40 96 L184 36/.test(bodyAll) && near((184 - 40) / (96 - 36), 36 / 15));
  const t = bodyAll.match(/M40 110 L198\.4 44[\s\S]*?cx="92\.8" cy="88"/);
  is('7.3: Fig. 7.9 puts P a third of the way from A to B', !!t && near(section([40, 110], [198.4, 44], 1, 2), [92.8, 88]));
}

// Exercise Sets 7.1 and 7.2, re-derived from the body's questions and read back from ANSWERS.md
const qp = (set, n) => pairs(mathOf(bodyQ[set][n] || ''));
const partsOf = (item) => { const o = {}; for (const m of item.matchAll(/\((i{1,3}|iv|v)\)([\s\S]*?)(?=\((?:i{1,3}|iv|v)\)|$)/g)) o[m[1]] = m[2]; return o; };
{
  const p = qp('7.1', 1), parts = partsOf(md71[1]);
  ['i', 'ii'].forEach((r, i) => saysVal(`7.1 Q1 (${r})`, parts[r], dist(p[2 * i], p[2 * i + 1])));
  is('7.1 Q1 (iii): 2 sqrt(a^2 + b^2)', /2\\sqrt\{a\^2 \+ b\^2\}/.test(parts.iii));
  const q2 = qp('7.1', 2);
  saysVal('7.1 Q2', md71[2], dist(...q2));
  is('7.1 Q2: 39 km in bold', new RegExp(`\\*\\*${dist(...q2)} km\\*\\*`).test(md71[2]));
  const q3 = qp('7.1', 3);
  is(`7.1 Q3: collinear is ${collinear(...q3)}`, /Not collinear/.test(md71[3]) === !collinear(...q3));
  const q4 = qp('7.1', 4); const s4 = [d2(q4[0], q4[1]), d2(q4[1], q4[2]), d2(q4[0], q4[2])];
  is(`7.1 Q4: isosceles is ${new Set(s4).size < 3}`, /^\*\*Yes/.test(md71[4]) === (new Set(s4).size < 3));
  // Q5: the seats read off Fig. 7.8 must be the seats ANSWERS.md uses
  const seats = pairs(mathOf(md71[5].split('\n')[0]));
  ok('7.1 Q5: a square', shape(...seats), 'square');
  is('7.1 Q5: Champa is right', /Champa is\s+right/.test(md71[5]));
  const q6 = qp('7.1', 6), p6 = partsOf(md71[6]);
  const words = { square: /A square/, none: /No quadrilateral/, parallelogram: /A parallelogram/ };
  ['i', 'ii', 'iii'].forEach((r, i) => { const s = shape(...q6.slice(4 * i, 4 * i + 4)); is(`7.1 Q6 (${r}) is ${s}: "${p6[r].slice(0, 40)}"`, words[s] && words[s].test(p6[r])); });
  const [a7, b7] = qp('7.1', 7);
  const x7 = (b7[0] ** 2 + b7[1] ** 2 - a7[0] ** 2 - a7[1] ** 2) / (2 * (b7[0] - a7[0]));
  says('7.1 Q7', md71[7], [x7, 0]);
  const [P8] = qp('7.1', 8); const x8 = pairs(mathOf(bodyQ['7.1'][8]).replace('Q(10, y)', 'Q(10, 0)'));
  const r8 = Number(text(bodyQ['7.1'][8]).match(/is (\d+) units/)[1]);
  const dx8 = 10 - P8[0], h8 = Math.sqrt(r8 ** 2 - dx8 ** 2);
  for (const y of [P8[1] + h8, P8[1] - h8]) is(`7.1 Q8: y = ${y}`, new RegExp(`y = ${y}\\b`).test(md71[8]));
  const [Q9, P9] = qp('7.1', 9); const x9 = Math.sqrt(d2(Q9, P9) - (6 - Q9[1]) ** 2);
  is(`7.1 Q9: x = ±${x9}`, new RegExp(`x = ${x9}\\*?\\*? or \\*?\\*?\\$?x = -${x9}`).test(md71[9].replace(/\$\s*or\s*\$/, ' or ')));
  const p9 = md71[9];
  is('7.1 Q9: QR printed', near(evalSide(p9.match(/QR = ([^$]*)\$/)[1], {}), Math.sqrt(d2(Q9, [x9, 6]))));
  for (const x of [x9, -x9]) {
    const m = p9.match(new RegExp(`R\\(${x}, 6\\)\\$: \\$PR = ([^$]*)\\$`));
    is(`7.1 Q9: PR for R(${x}, 6) printed`, !!m && near(evalSide(m[1].split('=').pop(), {}), dist(P9, [x, 6])));
  }
  is('7.1 Q10: the relation', sameLine(bisector(...qp('7.1', 10)), lineSays(md71[10])));
}
{
  const [a1, b1] = qp('7.2', 1); const r1 = mathOf(bodyQ['7.2'][1]).match(/(\d+) : (\d+)/);
  says('7.2 Q1', md72[1], section(a1, b1, Number(r1[1]), Number(r1[2])));
  const [a2, b2] = qp('7.2', 2);
  says('7.2 Q2', md72[2], section(a2, b2, 1, 2)); says('7.2 Q2', md72[2], section(a2, b2, 2, 1));
  // Q3: the flags, from the fractions and line numbers the question prints
  const q3 = text(bodyQ['7.2'][3]);
  const pots = Number(q3.match(/(\d+) flower pots/)[1]);
  const fr = [...mathOf(bodyQ['7.2'][3]).matchAll(/\\frac\{1\}\{(\d)\}/g)].map(m => 1 / Number(m[1]));
  const lines = [...q3.matchAll(/the (\d+)(?:st|nd|rd|th) line/g)].map(m => Number(m[1]));
  const G = [lines[0], fr[0] * pots], R = [lines[1], fr[1] * pots];
  says('7.2 Q3 green flag', md72[3], G); says('7.2 Q3 red flag', md72[3], R);
  is(`7.2 Q3: the flags are sqrt(${d2(G, R)}) m apart`, md72[3].includes(`\\sqrt{${d2(G, R)}}`));
  is('7.2 Q3: about 7.81 m', md72[3].includes(`about ${dist(G, R).toFixed(2)} m`));
  says('7.2 Q3 blue flag', md72[3], mid(G, R));
  is(`7.2 Q3: on the ${mid(G, R)[0]}th line, ${mid(G, R)[1]} m from AB`, md72[3].includes(`on the ${mid(G, R)[0]}th line, ${mid(G, R)[1]} m from AB`));
  const [a4, b4, p4] = qp('7.2', 4);
  saysRatio('7.2 Q4', md72[4], ratioAt(a4, b4, p4));
  is('7.2 Q4: the point is on the segment', collinear(a4, b4, p4));
  const [a5, b5] = qp('7.2', 5); const k5 = -a5[1] / b5[1];
  saysRatio('7.2 Q5', md72[5], k5); says('7.2 Q5', md72[5], section(a5, b5, k5, 1));
  const q6 = mathOf(bodyQ['7.2'][6]);
  const A6 = [1, 2], C6y = 6, B6x = 4, D6 = [3, 5];
  is('7.2 Q6: the question prints (1, 2), (4, y), (x, 6), (3, 5)', /\(1, 2\).*\(4, y\).*\(x, 6\).*\(3, 5\)/.test(q6));
  const x6 = B6x + D6[0] - A6[0], y6 = A6[1] + C6y - D6[1];
  is(`7.2 Q6: x = ${x6}, y = ${y6}`, md72[6].includes(`$x = ${x6}$, $y = ${y6}$`));
  const [c7, B7] = qp('7.2', 7);
  says('7.2 Q7', md72[7], [2 * c7[0] - B7[0], 2 * c7[1] - B7[1]]);
  const [a8, b8] = qp('7.2', 8); const f8 = mathOf(bodyQ['7.2'][8]).match(/\\frac\{(\d)\}\{(\d)\}/);
  says('7.2 Q8', md72[8], section(a8, b8, Number(f8[1]), Number(f8[2]) - Number(f8[1])));
  const [a9, b9] = qp('7.2', 9);
  for (const [m, n] of [[1, 3], [1, 1], [3, 1]]) says('7.2 Q9', md72[9], section(a9, b9, m, n));
  const v10 = qp('7.2', 10);
  is('7.2 Q10: a rhombus', ['rhombus', 'square'].includes(shape(...v10)));
  saysVal('7.2 Q10 area', md72[10].split('Area')[1], dist(v10[0], v10[2]) * dist(v10[1], v10[3]) / 2);
}

// the figures: every plotted point against its label, on the grid its ticks set
function figures(src) {
  const out = [];
  for (const m of src.matchAll(/<figure>([\s\S]*?)<\/figure>/g)) {
    const f = m[1];
    const num = (f.match(/Fig\. (7\.\d+)/) || [])[1];
    const ticks = [...f.matchAll(/<text class="dg-tick" x="([\d.]+)" y="([\d.]+)" text-anchor="(\w+)">(−?\d+)<\/text>/g)]
      .map(t => ({ x: +t[1], y: +t[2], a: t[3], v: Number(t[4].replace('−', '-')) }));
    const circles = [...f.matchAll(/<circle class="dg-fill-teal" cx="([\d.]+)" cy="([\d.]+)"/g)].map(c => [+c[1], +c[2]]);
    const labels = [...f.matchAll(/<text class="dg-label" x="([\d.]+)" y="([\d.]+)"[^>]*>([^<]*)<\/text>/g)].map(l => ({ x: +l[1], y: +l[2], s: l[3].replace(/−/g, '-') }));
    out.push({ num, f, ticks, circles, labels });
  }
  return out;
}
// a linear map from two ticks on the same axis
// The axes are drawn as "M.. y0 H.. M x0 ..V..": the origin is (x0, y0).
// The scale comes from the tick numerals, which must all agree with it: an
// x numeral is centred on its grid line, a y numeral sits a fixed step off
// its line (the baseline), so what is checked there is that the step is the
// same for every numeral.
function axisMaps(g) {
  const ax = g.f.match(/dg-axis" d="M[\d.]+ ([\d.]+)H[\d.]+ M([\d.]+) [\d.]+V/);
  if (!ax) return { X: null, Y: null };
  const y0 = +ax[1], x0 = +ax[2];
  const xt = g.ticks.filter(t => t.a === 'middle'), yt = g.ticks.filter(t => t.a === 'end' && t.v !== 0);
  const fit = (list, key, origin) => {
    if (list.length < 2) return false;
    const scale = (list[1][key] - list[0][key]) / (list[1].v - list[0].v);
    const off = list.map(t => t[key] - (origin + t.v * scale));
    return off.every(o => near(o, off[0], 1e-6)) && (key === 'y' || near(off[0], 0, 1e-6)) ? { scale, origin } : false;
  };
  return { X: fit(xt, 'x', x0), Y: fit(yt, 'y', y0) };
}
const toPx = (maps, p) => [maps.X.origin + p[0] * maps.X.scale, maps.Y.origin + p[1] * maps.Y.scale];
const nearest = (circles, px) => circles.reduce((b, c) => (Math.hypot(c[0] - px[0], c[1] - px[1]) < Math.hypot(b[0] - px[0], b[1] - px[1]) ? c : b), [1e9, 1e9]);
const figs = figures(bodyAll);
let plotted = 0;
for (const g of figs.filter(g => g.ticks.length > 4)) {
  const maps = axisMaps(g);
  if (maps.X === null) continue;   // no axes drawn: not a coordinate grid
  is(`Fig. ${g.num}: its tick numerals are evenly spaced`, maps.X && maps.Y);
  if (!maps.X || !maps.Y) continue;
  for (const l of g.labels) {
    const p = pairs(l.s)[0];
    if (!p) continue;
    const px = toPx(maps, p);
    const c = nearest(g.circles, px);
    plotted++;
    is(`Fig. ${g.num}: ${l.s} is plotted at ${px} (nearest dot ${c}), with its label beside it`,
      Math.hypot(c[0] - px[0], c[1] - px[1]) < 0.01 && Math.hypot(l.x - c[0], l.y - c[1]) < 25);
  }
  // a letter-only label names a point the text defines
  const named = { '7.2': { A: [4, 0], B: [6, 0] }, '7.3': { R: [4, 0], S: [6, 0] }, '7.4': { S: [-5, 0] },
    '7.6': Object.fromEntries(QP(bx[3]).map((p, i) => ['ABC'[i], p])),
    '7.8': Object.fromEntries(pairs(mathOf(md71[5].split('\n')[0])).map((p, i) => ['ABCD'[i], p])) }[g.num] || {};
  for (const [L, p] of Object.entries(named)) {
    const lab = g.labels.find(l => l.s === L);
    const px = toPx(maps, p);
    const c = nearest(g.circles, px);
    plotted++;
    is(`Fig. ${g.num}: ${L}${pt(p)} is plotted, and labelled beside the dot`, Math.hypot(c[0] - px[0], c[1] - px[1]) < 0.01 && lab && Math.hypot(lab.x - c[0], lab.y - c[1]) < 12);
  }
  // Fig. 7.7: the drawn line is x - y = 2, and it bisects AB at right angles
  if (g.num === '7.7') {
    const m = g.f.match(/dg-plot--b" d="M([\d.]+) ([\d.]+) L([\d.]+) ([\d.]+)"/);
    const inv = (x, y) => [(x - maps.X.origin) / maps.X.scale, (y - maps.Y.origin) / maps.Y.scale];
    const e = [inv(+m[1], +m[2]), inv(+m[3], +m[4])];
    is('Fig. 7.7: the line drawn is x - y = 2', e.every(([x, y]) => near(x - y, 2)));
    is('Fig. 7.7: which is the perpendicular bisector of AB', sameLine(bisector([7, 1], [3, 5]), [1, -1, 2]));
  }
  // Fig. 7.3 and 7.4: T is where the perpendiculars meet
  if (g.num === '7.3') { const T = g.labels.find(l => l.s === 'T'); is('Fig. 7.3: T at (6, 6)', Math.hypot(T.x - toPx(maps, [6, 6])[0], T.y - toPx(maps, [6, 6])[1]) < 12); }
}
is(`at least 20 plotted points checked (${plotted})`, plotted >= 20);
// Fig. 7.8 and ANSWERS.md print the same seats as the aria-label
{
  const g = figs.find(f => f.num === '7.8');
  const aria = [...g.f.matchAll(/column (\d+), row (\d+)/g)].map(m => [+m[1], +m[2]]);
  ok('Fig. 7.8: the aria-label seats are the seats in ANSWERS.md', aria, pairs(mathOf(md71[5].split('\n')[0])));
  const g6 = figs.find(f => f.num === '7.6');
  ok('Fig. 7.6: the aria-label seats are the seats in Example 3', [...g6.f.matchAll(/column (\d+), row (\d+)/g)].map(m => [+m[1], +m[2]]), QP(bx[3]));
}

// Beyond: Stage 1, as printed in its running text
{
  const tries = beyondBlocks.map((b, i) => [b, i]).filter(([b]) => /^<div class="c-try"/.test(b)).map(([b, i]) => ({ q: b, a: beyondBlocks[i + 1] }));
  is('Stage 1 has five questions', tries.length === 5);
  { const [A, B, C] = pairs(mathOf(tries[0].q));
    is('Stage 1 Q1: isosceles right-angled at A', d2(A, B) === d2(A, C) && d2(A, B) + d2(A, C) === d2(B, C)); }
  { const [O, A, B] = pairs(mathOf(tries[1].q));
    const P = [(A[0] + O[0]) / 2, (B[1] + O[1]) / 2];
    is('Stage 1 Q2: P is equidistant', near(dist(P, O), dist(P, A)) && near(dist(P, O), dist(P, B)));
    says('Stage 1 Q2', tries[1].a, P); saysVal('Stage 1 Q2 distance', tries[1].a, dist(P, O)); says('Stage 1 Q2 mid-point of AB', tries[1].a, mid(A, B)); }
  { const [A, B] = pairs(mathOf(tries[2].q));
    const L = mathOf(tries[2].q).match(/(\d+)x \+ y = (\d+)/);
    const a = +L[1], c = +L[2];
    const k = -(a * A[0] + A[1] - c) / (a * B[0] + B[1] - c);
    saysRatio('Stage 1 Q3', tries[2].a, k); }
  { const [A, B, C] = pairs(mathOf(tries[3].q));
    says('Stage 1 Q4', tries[3].a, [A[0] + C[0] - B[0], A[1] + C[1] - B[1]]); says('Stage 1 Q4 mid-point of AC', tries[3].a, mid(A, C)); }
  { const [P] = pairs(mathOf(tries[4].q)); const r = Number(text(tries[4].q).match(/is (\d+) units/)[1]);
    is('Stage 1 Q5: no point, since the axis is further away', Math.abs(P[1]) > r);
    is('Stage 1 Q5: (x - 1)^2 = -5', r ** 2 - P[1] ** 2 === -5); }
}

// Beyond: the Solved Examples
const ex = Object.fromEntries(examples(beyondBlocks).map(e => [e.n, e]));
is('Beyond has Examples 1-14', Object.keys(ex).join() === [...Array(14)].map((_, i) => i + 1).join());
const ans = (n) => ex[n].ans;
saysVal('Beyond Ex 1', ans(1), dist(...QP(ex[1])));
{ const [O, A, B] = QP(ex[2]); saysVal('Beyond Ex 2', ex[2].all, dist(O, A) + dist(O, B) + dist(A, B)); }
{ const [P, Q] = [[4, 0], QP(ex[3])[0]]; const r = 5; const p = Math.sqrt(r ** 2 - (P[0] - Q[0]) ** 2);
  is('Beyond Ex 3: p = ±4', p === 4 && /p = 4\}\$ or \$\{p = -4/.test(ex[3].all)); }
{ const Q = QP(ex[4])[0]; const h = Math.sqrt(25 - (-1 - Q[1]) ** 2);
  is(`Beyond Ex 4: x = ${Q[0] + h} or ${Q[0] - h}`, ans(4).includes(`x = ${Q[0] + h}`) && ans(4).includes(`x = ${Q[0] - h}`)); }
is('Beyond Ex 5: collinear', collinear(...QP(ex[5])));
ok('Beyond Ex 6: a rectangle, not a square', shape(...QP(ex[6])), 'rectangle');
saysWord('Beyond Ex 6 answer', ans(6), /is a rectangle/);
{ const [A, B] = QP(ex[7]); says('Beyond Ex 7', ans(7), [(B[0] ** 2 + B[1] ** 2 - A[0] ** 2 - A[1] ** 2) / (2 * (B[0] - A[0])), 0]); }
{ const [A, B] = QP(ex[8]); const L = bisector(A, B); is(`Beyond Ex 8: the relation ${L}`, sameLine([L[0], L[1], L[2]], [3, -2, 0]) && ans(8).includes('3x = 2y')); }
{ const [A, B] = QP(ex[9]); const r = mathOf(ex[9].q).match(/(\d) : (\d)/); ok('Beyond Ex 9: the point', section(A, B, +r[1], +r[2]), [0, 2]); }
{ const [S, L] = QP(ex[10]); const B = section(S, L, 3, 1);
  names('Beyond Ex 10', ans(10), 'B', B);
  is(`Beyond Ex 10: BL = sqrt(${d2(B, L)})`, ex[10].all.includes(`\\sqrt{${d2(B, L)}}`));
  is(`Beyond Ex 10: about ${Math.round(100 * dist(B, L))} m`, ans(10).includes(`about ${Math.round(100 * dist(B, L))}&nbsp;m`)); }
{ const [A, B] = QP(ex[11]); const k = -A[1] / B[1]; saysRatio('Beyond Ex 11', ex[11].all, k); says('Beyond Ex 11', ex[11].all, section(A, B, k, 1)); }
{ const [A, B] = QP(ex[12]); const P = [-2, 0]; const k = ratioAt(A, B, P);
  saysRatio('Beyond Ex 12', ans(12), k); saysVal('Beyond Ex 12 y', ans(12), section(A, B, k, 1)[1]); }
{ const [A, B] = QP(ex[13]); const M = mid(A, B); is('Beyond Ex 13: a = -12', 3 * M[0] === -12 && M[1] === 4 && ex[13].all.includes('a = -12')); }
{ const [A, B, C] = QP(ex[14]); const D = mid(A, B), E = mid(A, C);
  names('Beyond Ex 14', ex[14].all, 'D', D); names('Beyond Ex 14', ex[14].all, 'E', E);
  ok('Beyond Ex 14: DE = BC/2', dist(D, E), dist(B, C) / 2);
  is(`Beyond Ex 14: DE = sqrt(${d2(D, E)})`, ans(14).includes(`\\sqrt{${d2(D, E)}}`)); }

// the practice answers, read back out of the key rows
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= m[2];
const row = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const r = keyRows[n] || '';
  if (!part) return r;
  const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\) |$)`, 's'));
  return m ? m[1] : '';
};
const P = (n) => pairs(mathOf(practiceQ[n] || ''));
saysVal('key 20', row(20), dist([0, 0], P(20)[0]));
says('key 21', row(21), mid(...P(21)));
{ const [A, B] = P(22); const M = mid(A, B); is(`key 22: k = ${M[0]}, y = 3`, M[1] === 3 && row(22).includes(`k = \\frac{2 + 6}{2} = ${M[0]}`)); }
{ const [A, B] = P(23); const y = (B[0] ** 2 + B[1] ** 2 - A[0] ** 2 - A[1] ** 2) / (2 * (B[1] - A[1])); says('key 23', row(23), [0, y]);
  ok('key 23: equidistant', dist([0, y], A), dist([0, y], B)); }
{ const [A, B] = P(24); const k = -A[0] / B[0]; saysRatio('key 24', row(24), k); says('key 24', row(24), section(A, B, k, 1)); }
{ const [A, B, C] = P(25); is('key 25: isosceles right at B', d2(A, B) === d2(B, C) && d2(A, B) + d2(B, C) === d2(A, C)); saysWord('key 25', row(25), /right angle at B/); }
{ const q = mathOf(practiceQ[26]); const A = [-2, -1], C = [4], D = [1, 2];
  is('Q26 prints A(-2, -1), B(a, 0), C(4, b), D(1, 2)', /A\(-2, -1\).*B\(a, 0\).*C\(4, b\).*D\(1, 2\)/.test(q));
  const a = A[0] + C[0] - D[0], b = 0 + D[1] - A[1];   // A + C = B + D, with B = (a, 0)
  is(`key 26: a = ${a}, b = ${b}`, row(26).includes(`a = ${a}`) && row(26).includes(`b = ${b}`)); }
{ const [A, B] = P(27); const Pp = section(A, B, 1, 2), Q = section(A, B, 2, 1);
  names('key 27', row(27), 'P', Pp); names('key 27', row(27), 'Q', Q); ok('key 27: Q is the mid-point of PB', mid(Pp, B), Q); }
{ const v = P(28); ok('Q28: a rectangle, not a square', shape(...v), 'rectangle'); saysWord('key 28', row(28), /it is a rectangle\. It is not a square/); }
{ const Q = P(29)[0]; const r = 13; const h = Math.sqrt(r ** 2 - (-5 - Q[1]) ** 2);
  for (const k of [Q[0] + h, Q[0] - h]) { is(`key 29: k = ${k}`, row(29).includes(`k = ${k}`)); says(`key 29 mid-point for k = ${k}`, row(29), mid([k, -5], Q)); } }
{ const T = pairs(mathOf(practiceQ[30])); const [S, H, K] = T;
  saysVal('key 30a', row('30a'), dist(S, H)); says('key 30b', row('30b'), section(S, H, 1, 3));
  is('key 30c: the park is as far as the hospital', near(dist(S, K), dist(S, H)) && /^\s*yes/.test(text(row('30c'))));
  saysVal('key 30c', row('30c'), dist(S, K)); says('key 30d', row('30d'), mid(H, K)); }
{ const [A, B, C] = pairs(mathOf(practiceQ[31])); const M = mid(A, C);
  is('key 31a: AB and BC', row('31a').includes(`AB = ${dist(A, B)}`) && row('31a').includes(`BC = ${dist(B, C)}`));
  saysVal('key 31b', row('31b'), dist(A, C)); names('key 31c', row('31c'), 'M', M);
  is('key 31d: the tap is equally far from all three', near(dist(M, A), dist(M, B)) && near(dist(M, B), dist(M, C)) && near(evalSide(row('31d').match(/= ([^$=]*)\}?\$/)[1].replace(/\}$/, ''), {}), dist(M, A))); }

/* ---- C. multiple choice and assertion-reason ------------------ */

const optsOf = (n) => [...((practiceQ[n] || '').match(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*?)<\/ol>/) || ['', ''])[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => x[1]);
const key = {};
{
  const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2];
}
const val = (o) => { const s = spansOf(o); return s.length ? evalSide(s[0].replace(/^\{|\}$/g, ''), {}) : Number(text(o)); };
const pairOpt = (o) => pairs(mathOf(o))[0];
const q = (n) => P(n);
const solve = {
  1: o => o.map(x => near(val(x), dist([0, 0], q(1)[0]))),
  2: o => o.map(x => near(val(x), dist(...q(2)))),
  3: o => { const [A, B, C] = q(3); const s = new Set([d2(A, B), d2(B, C), d2(A, C)]); const kind = s.size === 1 ? 'equilateral' : 'other';
    return o.map(x => text(x).replace(/\$/g, '').trim() === kind); },
  4: o => { const s = shape(...q(4)); return o.map(x => text(x).trim() === (s === 'rhombus' ? 'only Kiran' : s === 'parallelogram' ? 'only Lata' : '?')); },
  5: o => { const [A, B] = q(5); const y = (B[0] ** 2 + B[1] ** 2 - A[0] ** 2 - A[1] ** 2) / (2 * (B[1] - A[1])); return o.map(x => near(pairOpt(x), [0, y])); },
  6: o => o.map(x => near(pairOpt(x), mid(...q(6)))),
  7: o => { const [M, A] = q(7); return o.map(x => near(pairOpt(x), [2 * M[0] - A[0], 2 * M[1] - A[1]])); },
  8: o => o.map(x => { const [A, B] = q(8); return near(pairOpt(x), section(A, B, 1, 2)); }),
  9: o => { const [Pp, A, B] = q(9); return o.map(x => near(val(x), ratioAt(A, B, Pp))); },
  10: o => { const [A, B] = q(10); return o.map(x => near(val(x), -A[1] / B[1])); },
  11: o => { const [Pp, Q] = q(11); return o.map(x => near(pairOpt(x), section(Pp, Q, 2, 1))); },
  12: o => { const [A, B, C] = q(12); return o.map(x => near(pairOpt(x), [A[0] + C[0] - B[0], A[1] + C[1] - B[1]])); },
  13: o => { const [O, V, W] = q(13); return o.map(x => near(val(x), dist(V, mid(O, W)))); },
  14: o => { const [C, A] = q(14); const r = dist(C, A), B = [2 * C[0] - A[0], 2 * C[1] - A[1]];
    return o.map(x => { const m = text(x).match(/^(\S+) and/); return m && near(Number(m[1]), r) && near(pairOpt(x), B); }); },
  15: o => { const s = shape(...q(15)); const w = { rhombus: 'a rhombus but not a square', square: 'a square', rectangle: 'a rectangle but not a square', parallelogram: 'a parallelogram but not a rhombus' }[s];
    return o.map(x => text(x).trim() === w); },
};
for (const [n, f] of Object.entries(solve)) {
  const o = optsOf(n);
  is(`Q${n} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Q${n}: the right option`, right, [key[n]]);
}
// the Solved Examples with options: one right option, the one the Answer row gives
const exSolve = {
  2: (o) => { const [O, A, B] = QP(ex[2]); return o.map(x => near(Number(text(x)), dist(O, A) + dist(O, B) + dist(A, B))); },
  3: (o) => o.map(x => text(x).replace(/\$/g, '').trim() === '4 or -4'),
  9: (o) => { const [A, B] = QP(ex[9]); return o.map(x => near(pairOpt(x), section(A, B, 1, 2))); },
  11: (o) => { const [A, B] = QP(ex[11]); return o.map(x => near(val(x), -A[1] / B[1])); },
  13: (o) => { const [A, B] = QP(ex[13]); return o.map(x => near(val(x), 3 * mid(A, B)[0])); },
};
for (const [n, f] of Object.entries(exSolve)) {
  const o = ex[n].opts;
  is(`Beyond Ex ${n} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Beyond Ex ${n}: the right option`, right, [text(ans(n)).trim().replace(/[()]/g, '')]);
}
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  16: [pairs(mathOf(practiceQ[16]))[0][1] === 0, true, true],
  17: [near(dist([0, 0], pairs(mathOf(practiceQ[17]))[0]), Number(text(practiceQ[17]).match(/is (\d+) units/)[1])), near(mid([1, 3], [5, 9]), [3, 6]), false],
  18: (() => { const [Pp, A, B] = pairs(mathOf(practiceQ[18])); const k = ratioAt(A, B, Pp); return [collinear(A, B, Pp) && near(k, 1 / 2), near(ratioAt([0, 0], [2, 2], [1, 1]), 2), false]; })(),
  19: (() => { const [A, B] = pairs(mathOf(practiceQ[19])); return [near(dist(A, B), Number(text(practiceQ[19]).match(/is (\d+) units/)[1])), true, false]; })(),
};
for (const [n, v] of Object.entries(AR)) ok(`Q${n}: assertion-reason`, arLetter(v), key[n]);
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-19', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(19)].map((_, i) => i + 1));
ok('practice numbered 1-31', [...beyond.matchAll(/data-start="(\d+)"/g)].map(m => Number(m[1])), [...Array(30)].map((_, i) => i + 2));
// the why-rows agree with the key
for (const m of beyond.slice(beyond.indexOf('Why the other options')).matchAll(/work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) {
  const says = [...text(m[2]).matchAll(/: \(([a-d])\)\.?$/g)].map(x => x[1]);
  if (says.length) ok(`why-row ${m[1]} ends on the key letter`, says[0], key[m[1]]);
}

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
{ const at = answersMd.indexOf('as the key prints it');
  for (const m of answersMd.slice(at, at + 400).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2]; }
ok('ANSWERS.md key matches the page', mdKey, key);
for (const n of [16, 17, 18, 19]) ok(`ANSWERS.md ${n} gives the key letter`, (mdPr[n].match(/^\(([a-d])\)/) || [])[1], key[n]);
// ANSWERS.md's practice working, read back a part at a time
const mdRow = (qq) => {
  const [, n, part] = String(qq).match(/^(\d+)([a-d]?)$/);
  const r = mdPr[n] || '';
  if (!part) return r;
  const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\) |$)`, 's'));
  return m ? m[1] : '';
};
saysVal('ANSWERS.md 1', mdRow(1), dist([0, 0], q(1)[0]));
says('ANSWERS.md 5', mdRow(5), [0, -2]);
says('ANSWERS.md 6', mdRow(6), mid(...q(6)));
says('ANSWERS.md 8', mdRow(8), section(...q(8).slice(0, 2), 1, 2));
saysRatio('ANSWERS.md 9', mdRow(9), ratioAt(q(9)[1], q(9)[2], q(9)[0]));
saysRatio('ANSWERS.md 10', mdRow(10), -q(10)[0][1] / q(10)[1][1]);
says('ANSWERS.md 11', mdRow(11), section(...q(11).slice(0, 2), 2, 1));
says('ANSWERS.md 12', mdRow(12), [-2, 1]);
saysVal('ANSWERS.md 13', mdRow(13), dist(q(13)[1], mid(q(13)[0], q(13)[2])));
says('ANSWERS.md 14', mdRow(14), [2 * q(14)[0][0] - q(14)[1][0], 2 * q(14)[0][1] - q(14)[1][1]]);
saysVal('ANSWERS.md 20', mdRow(20), dist([0, 0], P(20)[0]));
says('ANSWERS.md 21', mdRow(21), mid(...P(21)));
is('ANSWERS.md 22', /k = 4/.test(mdRow(22)) && mid(...P(22))[0] === 4);
says('ANSWERS.md 23', mdRow(23), [0, -1]); ok('Q23 answer is right', dist([0, -1], P(23)[0]), dist([0, -1], P(23)[1]));
saysRatio('ANSWERS.md 24', mdRow(24), -P(24)[0][0] / P(24)[1][0]); says('ANSWERS.md 24', mdRow(24), section(...P(24), 2, 5));
names('ANSWERS.md 27', mdRow(27), 'P', section(...P(27), 1, 2)); names('ANSWERS.md 27', mdRow(27), 'Q', section(...P(27), 2, 1));
is('ANSWERS.md 29', /k = 7\$ or \$k = -3/.test(mdRow(29))); says('ANSWERS.md 29', mdRow(29), mid([7, -5], P(29)[0])); says('ANSWERS.md 29', mdRow(29), mid([-3, -5], P(29)[0]));
saysVal('ANSWERS.md 30a', mdRow('30a'), dist(pairs(mathOf(practiceQ[30]))[0], pairs(mathOf(practiceQ[30]))[1]));
says('ANSWERS.md 30b', mdRow('30b'), section(pairs(mathOf(practiceQ[30]))[0], pairs(mathOf(practiceQ[30]))[1], 1, 3));
says('ANSWERS.md 30d', mdRow('30d'), mid(pairs(mathOf(practiceQ[30]))[1], pairs(mathOf(practiceQ[30]))[2]));
says('ANSWERS.md 31c', mdRow('31c'), mid(pairs(mathOf(practiceQ[31]))[0], pairs(mathOf(practiceQ[31]))[2]));
is('ANSWERS.md 31b', mdRow('31b').includes('2\\sqrt{13}') && near(2 * Math.sqrt(13), 2 * Math.sqrt(52) / 2));
// ANSWERS.md Stage 1 summary agrees with the page
is('ANSWERS.md Stage 1', /\(2\) \$\(3, 4\)\$; \(3\) \$3 : 4\$; \(4\) \$D\(4, 3\)\$/.test(answersMd.replace(/\s+/g, ' ')));

/* ---- report ---------------------------------------------------- */

console.log(`A  ${spans} identities evaluated, ${equations} equations solved at their answer; ${skipped.length} spans not pure arithmetic, skipped`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
