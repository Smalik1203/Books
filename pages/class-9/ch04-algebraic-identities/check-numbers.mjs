#!/usr/bin/env node
/* Re-derive every number and every identity this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed — an identity is evaluated at several points, an equation is
   checked against the value its own block solves it to, a condition is
   checked against numbers that satisfy it — and compared with the page.

     node pages/class-9/ch04-algebraic-identities/check-numbers.mjs [--skipped]

   Four parts:
     A  every statement set as maths with "=", on every page and in
        ANSWERS.md. Pure arithmetic is evaluated. A statement with letters
        must hold at random values (an identity), or at the value its block
        solves a letter to, or under every set of numbers that satisfies the
        block's given conditions (these are complex where the conditions
        describe no real numbers, as in Example 15 and End Q11). A few
        statements are printed in order to be false; they are listed and
        must be false.
     B  what A cannot see: each example's Answer row, each exercise answer
        read back off ANSWERS.md against the question on the page, the
        figures measured from their coordinates, Stage 1's values, and the
        practice answers read back out of the key rows
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

/* ---- complex numbers and a small LaTeX evaluator -------------- */

const C = (re, im = 0) => ({ re, im });
const add = (a, b) => C(a.re + b.re, a.im + b.im);
const sub = (a, b) => C(a.re - b.re, a.im - b.im);
const mul = (a, b) => C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
const div = (a, b) => { const d = b.re * b.re + b.im * b.im; return C((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); };
const neg = (a) => C(-a.re, -a.im);
const powi = (a, n) => { if (!Number.isInteger(n) || n < 0 || n > 20) return C(NaN); let r = C(1); for (let i = 0; i < n; i++) r = mul(r, a); return r; };
const csqrt = (a) => { const r = Math.hypot(a.re, a.im); const re = Math.sqrt((r + a.re) / 2); const im = Math.sign(a.im || 1) * Math.sqrt((r - a.re) / 2); return C(re, im); };
const close = (a, b) => { const s = Math.max(1, Math.hypot(a.re, a.im), Math.hypot(b.re, b.im)); return Math.hypot(a.re - b.re, a.im - b.im) < 1e-7 * s; };
const finite = (a) => a && Number.isFinite(a.re) && Number.isFinite(a.im);

// \frac{A}{B} and \sqrt{A}, with nested braces
function group(s, i) { // s[i] === '{'; returns [content, index after]
  let d = 0;
  for (let j = i; j < s.length; j++) {
    if (s[j] === '{') d++;
    else if (s[j] === '}') { d--; if (!d) return [s.slice(i + 1, j), j + 1]; }
  }
  throw new Error('brace');
}
function unfrac(s) {
  let out = '', i = 0;
  while (i < s.length) {
    const m = s.slice(i).match(/^\\[dt]?frac\s*/);
    const q = s.slice(i).match(/^\\sqrt\s*/);
    if (m) { i += m[0].length; const [a, j] = group(s, i); const [b, k] = group(s, j); out += `((${unfrac(a)})/(${unfrac(b)}))`; i = k; }
    else if (q) { i += q[0].length; const [a, j] = group(s, i); out += `√(${unfrac(a)})`; i = j; }
    else out += s[i++];
  }
  return out;
}
function tokens(src) {
  let s = src
    .replace(/\\left|\\right|\\big|\\Big/g, '')
    .replace(/\\,|\\;|\\!|\\ /g, ' ')
    .replace(/\\times|\\cdot/g, '*').replace(/\\div/g, '/');
  if (/\\[a-zA-Z]/.test(s.replace(/\\[dt]?frac|\\sqrt/g, ''))) return null;   // \cdots, \pm, \{ …
  s = unfrac(s).replace(/\^\{/g, '^(').replace(/[{]/g, '(').replace(/[}]/g, ')').replace(/\[/g, '(').replace(/\]/g, ')');
  const out = [];
  for (let i = 0; i < s.length;) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    const n = s.slice(i).match(/^\d+(\.\d+)?/);
    if (n) { out.push({ t: 'n', v: Number(n[0]) }); i += n[0].length; continue; }
    if (/[a-zA-Z]/.test(c)) { out.push({ t: 'v', v: c }); i++; continue; }
    if ('+-*/^()√'.includes(c)) { out.push({ t: c }); i++; continue; }
    return null;
  }
  return out;
}
function parse(src) { // returns env => complex, or null
  const tk = tokens(src);
  if (!tk || !tk.length) return null;
  let p = 0;
  const peek = () => tk[p];
  const starts = (t) => t && (t.t === 'n' || t.t === 'v' || t.t === '(' || t.t === '√');
  function expr() {
    let l = term();
    while (peek() && (peek().t === '+' || peek().t === '-')) { const o = tk[p++].t; const r = term(); const a = l; l = o === '+' ? (e) => add(a(e), r(e)) : (e) => sub(a(e), r(e)); }
    return l;
  }
  function term() {
    let l = unary();
    for (;;) {
      const t = peek();
      if (t && (t.t === '*' || t.t === '/')) { p++; const r = unary(); const a = l; l = t.t === '*' ? (e) => mul(a(e), r(e)) : (e) => div(a(e), r(e)); }
      else if (starts(t)) { const r = power(); const a = l; l = (e) => mul(a(e), r(e)); }
      else return l;
    }
  }
  function unary() {
    const t = peek();
    if (t && t.t === '-') { p++; const u = unary(); return (e) => neg(u(e)); }
    if (t && t.t === '+') { p++; return unary(); }
    return power();
  }
  function power() {
    const b = primary();
    if (peek() && peek().t === '^') {
      p++;
      const t = peek();
      let ex;
      if (t && t.t === 'n') { p++; ex = () => C(t.v); }
      else if (t && t.t === '(') { ex = primary(); }
      else if (t && t.t === '-') { p++; const q = tk[p++]; if (!q || q.t !== 'n') throw new Error('exp'); ex = () => C(-q.v); }
      else throw new Error('exp');
      return (e) => { const x = ex(e); if (x.im || !Number.isInteger(x.re)) return C(NaN); return x.re < 0 ? div(C(1), powi(b(e), -x.re)) : powi(b(e), x.re); };
    }
    return b;
  }
  function primary() {
    const t = tk[p++];
    if (!t) throw new Error('end');
    if (t.t === 'n') return () => C(t.v);
    if (t.t === 'v') return (e) => (t.v in e ? e[t.v] : C(NaN));
    if (t.t === '√') { const a = primary(); return (e) => { const v = a(e); return v.im || v.re < 0 ? C(NaN) : C(Math.sqrt(v.re)); }; }
    if (t.t === '(') { const x = expr(); if (!tk[p] || tk[p].t !== ')') throw new Error(')'); p++; return x; }
    throw new Error('token ' + t.t);
  }
  try { const f = expr(); if (p !== tk.length) return null; return f; } catch { return null; }
}
const lettersOf = (s) => new Set((s.replace(/\\[a-zA-Z]+/g, ' ').match(/[a-zA-Z]/g) || []));
const evalAt = (src, env) => { const f = parse(src); return f ? f(env) : null; };
const num = (src) => { const v = evalAt(src, {}); return finite(v) && !v.im ? v.re : NaN; };

const RND = [
  { a: 1.37, b: -0.83, c: 2.21, d: 0.57, k: 1.91, l: -1.13, m: 0.71, n: 2.63, p: -1.49, q: 0.93, r: 1.61, s: -0.67, t: 2.03, u: 0.39, v: -1.87, w: 1.23, x: 0.87, y: -1.41, z: 1.73, g: 0.61, h: -2.11, A: 1.3, B: -0.7 },
  { a: -2.3, b: 1.9, c: -0.45, d: 3.1, k: -0.6, l: 2.4, m: -1.7, n: 0.55, p: 2.8, q: -2.2, r: -0.95, s: 1.35, t: -1.55, u: 2.45, v: 0.85, w: -2.05, x: -1.65, y: 2.15, z: -0.35, g: -1.25, h: 1.05, A: -2.1, B: 0.4 },
  { a: 0.6, b: 3.7, c: 1.1, d: -1.4, k: 2.9, l: 0.2, m: 3.3, n: -2.6, p: 0.45, q: 1.75, r: 2.55, s: 0.25, t: 0.95, u: -1.05, v: 2.65, w: 0.15, x: 2.35, y: 0.65, z: -2.45, g: 3.05, h: 0.35, A: 0.9, B: 2.6 },
].map(o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, C(v)])));
const withRandom = (env, i = 0) => ({ ...RND[i], ...env });

// the complex roots of t^3 - e1 t^2 + e2 t - e3, and of t^2 - s t + p
function cubicRoots(e1, e2, e3) {
  let r = [C(0.4, 0.9), C(-0.7, 0.3), C(1.1, -0.6)];
  const f = (z) => sub(add(sub(powi(z, 3), mul(C(e1), powi(z, 2))), mul(C(e2), z)), C(e3));
  for (let it = 0; it < 500; it++) r = r.map((z, i) => sub(z, div(f(z), r.reduce((acc, w, j) => (i === j ? acc : mul(acc, sub(z, w))), C(1)))));
  return r;
}
const pairRoots = (s, p) => { const d = csqrt(C(s * s - 4 * p)); return [div(add(C(s), d), C(2)), div(sub(C(s), d), C(2))]; };
const three = (l, [x, y, z]) => [{ [l[0]]: x, [l[1]]: y, [l[2]]: z }, { [l[0]]: y, [l[1]]: z, [l[2]]: x }];
const two = (l, [x, y]) => [{ [l[0]]: x, [l[1]]: y }, { [l[0]]: y, [l[1]]: x }];
const R = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, typeof v === 'number' ? C(v) : v]));

/* Given conditions, and numbers that satisfy them. A group applies to a
   block whose text matches; its conditions are checked under each of its
   sets of numbers before anything is checked against them. */
const GROUPS = [
  { m: /a \+ b \+ c = 0|a \+ b = -c/, conds: ['a + b + c = 0'], envs: [R({ a: 1, b: 2, c: -3 }), R({ a: 2.5, b: -4, c: 1.5 })] },
  { m: /x \+ y \+ z = 0|add to zero/, conds: ['x + y + z = 0'], envs: [R({ x: 1, y: 2, z: -3 }), R({ x: -2.5, y: 4, z: -1.5 })] },
  { m: /a \+ b = 5\$ and \$ab = 6|Q2 \$a\^2 \+ b\^2 = 13/, conds: ['a + b = 5', 'ab = 6'], envs: two('ab', [C(2), C(3)]) },
  { m: /ab = 5\$(?! and)/, conds: ['a + b = 5', 'ab = 5'], envs: two('ab', pairRoots(5, 5)) },
  { m: /x \+ y = 17|Q5 no such/, conds: ['x + y = 17', 'x^2 + y^2 = 144'], envs: two('xy', pairRoots(17, 72.5)) },
  { m: /x \+ y = 17/, conds: ['x + y = 17', 'x^2 + y^2 = 169'], envs: two('xy', [C(12), C(5)]) },
  { m: /a \+ b = 7\$ and \$ab = 12|49 - 24 = 25/, conds: ['a + b = 7', 'ab = 12'], envs: two('ab', [C(3), C(4)]) },
  { m: /Example 10</, conds: ['a + b = 7', 'ab = 12'], envs: two('ab', [C(3), C(4)]) },
  { m: /Example 11</, conds: ['a + b = 11', 'ab = 30'], envs: two('ab', [C(5), C(6)]) },
  { m: /Example 12</, conds: ['a + b = -5', 'ab = 6'], envs: two('ab', [C(-2), C(-3)]) },
  { m: /Three numbers add to 10/, conds: ['x + y + z = 10', 'xyz = 25', 'x^2 + y^2 + z^2 = 38'], envs: three('xyz', cubicRoots(10, 31, 25)) },
  { m: /a \+ b \+ c = 5|25 - 20 = 5/, conds: ['a + b + c = 5', 'ab + bc + ca = 10'], envs: [...three('abc', cubicRoots(5, 10, 1)), ...three('abc', cubicRoots(5, 10, -2))] },
  { m: /a \+ b \+ c = 9/, conds: ['a + b + c = 9', 'a^2 + b^2 + c^2 = 35'], envs: [...three('abc', cubicRoots(9, 23, 15)), ...three('abc', cubicRoots(9, 23, 10))] },
  { m: /x \+ y \+ z = 9/, conds: ['x + y + z = 9', 'xy + yz + zx = 26'], envs: [...three('xyz', cubicRoots(9, 26, 24)), ...three('xyz', cubicRoots(9, 26, 20))] },
  { m: /a - b = 4/, conds: ['a - b = 4', 'ab = 21'], envs: [R({ a: 7, b: 3 }), R({ a: -3, b: -7 })] },
  { m: /a \+ b = 7\$ and \$a\^3 \+ b\^3 = 133/, conds: ['a + b = 7', 'a^3 + b^3 = 133'], envs: two('ab', [C(5), C(2)]) },
  { m: /a\^3 \+ b\^3 = 70/, conds: ['a + b = 7', 'a^3 + b^3 = 70'], envs: two('ab', pairRoots(7, 13)) },
  { m: /p \+ q = 10|30pq/, conds: ['p + q = 10', 'p^3 + q^3 = 370'], envs: two('pq', [C(3), C(7)]) },
  { m: /x - y - z = 0|x \+ \(-y\) \+ \(-z\) = 0/, conds: ['x - y - z = 0'], envs: [R({ x: 5, y: 2, z: 3 }), R({ x: 3, y: -1, z: 4 })] },
  { m: /a\^2 \+ b\^2 = 29/, conds: ['a^2 + b^2 = 29', 'ab = 10'], envs: [R({ a: 5, b: 2 })] },
  { m: /x \+ y = 11|121 - 25|xy = 24/, conds: ['x + y = 11', 'x - y = 5'], envs: [R({ x: 8, y: 3 })] },
  { m: /x \+ y = -4/, conds: ['x + y = -4'], envs: [R({ x: -1, y: -3 }), R({ x: 1.5, y: -5.5 })] },
  { m: /x = 2y \+ 6/, conds: ['x = 2y + 6'], envs: [R({ x: 8, y: 1 }), R({ x: 2, y: -2 })] },
  { m: /r = p/, conds: ['r = p', 'p(x - 2)(x - 1/2) = px^2 + 5x + r'], envs: [R({ p: -2, r: -2 })] },
  { m: /10\}\{3\}/, conds: ['x + 1/x = 10/3'], envs: [R({ x: 3 }), R({ x: 1 / 3 })] },
  { m: /x \+ \\dfrac\{1\}\{x\} = 5|\\dfrac\{1\}\{x\^2\} = 25|= 25 - 2 = 23/, conds: ['x + 1/x = 5'], envs: [R({ x: (5 + Math.sqrt(21)) / 2 }), R({ x: (5 - Math.sqrt(21)) / 2 })] },
  { m: /x - \\dfrac\{1\}\{x\} = 3|27 \+ 3 \\times 3 = 36|27 \+ 9 = 36/, conds: ['x - 1/x = 3'], envs: [R({ x: (3 + Math.sqrt(13)) / 2 }), R({ x: (3 - Math.sqrt(13)) / 2 })] },
  { m: /x \+ \\dfrac\{1\}\{x\} = 4|3 \\times 4 = 64|64 - 12 = 52/, conds: ['x + 1/x = 4'], envs: [R({ x: 2 + Math.sqrt(3) }), R({ x: 2 - Math.sqrt(3) })] },
  { m: /x\^2 - y\^2 = 45/, conds: ['x^2 - y^2 = 45'], envs: [R({ x: 23, y: 22 }), R({ x: 9, y: 6 }), R({ x: 7, y: 2 })] },
  { m: /3xyz = 18/, conds: ['x + y + z = 6'], envs: [R({ x: 1, y: 2, z: 3 })] },
  { m: /84 \\times 12/, conds: ['a + b = 84', 'a - b = 12'], envs: [R({ a: 48, b: 36 })] },
  { m: /y = -v/, conds: ['y = -v'], envs: [R({ v: 0.7, y: -0.7 }), R({ v: -1.9, y: 1.9 })] },
];
for (const g of GROUPS) for (const [i, e] of g.envs.entries()) for (const c of g.conds) {
  const [l, r] = c.split('=');
  const a = evalAt(l, withRandom(e)), b = evalAt(r, withRandom(e));
  is(`condition ${c} fails under its own numbers (#${i})`, finite(a) && finite(b) && close(a, b));
}

// statements printed in order to be false: they must be false
const FALSE = new Set([
  '(a+b)^3=a^3+b^3',            // Stage 1 Q4, practice Q12
  'x^2+7x+10=0',                // practice Q8 (ii), an equation
  'a^3+b^3=97',                 // practice Q9 (iii)
  'x^3-1=(x-1)(x^2-x+1)',       // practice Q21 R
  '(x-12)(x+8)=5',              // p028: the equation that says nothing
  '(x-12)(x+8)=5,',
  '(a+b-c)^2+(a-b+c)^2+(a-b-c)^2=2a^2+2b^2+2c^2', // Ex 4.3 Q4: not an identity
]);
const EITHER = new Set(['x^3+y^3+z^3=3xyz']);   // true where x + y + z = 0 is given (p023), false as practice Q19's A
const SKIP = new Set(['AB=0', 'A=0', 'B=0',     // p028: the zero-product rule, stated with letters
  'a-b=3']);                                     // Beyond Ex 7: the wrong reading "a - b = 3 and stop"
// a letter named for an expression ("take a = 5x") is a naming, not a claim
const NAMING = /^\s*[a-zA-Z]\s*=\s*[^=]*[a-zA-Z][^=]*$/;

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<span class="nb">([^<]*)<\/span>/g, '$1')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;|&minus;/g, '-')
  .replace(/\s+/g, ' ');
const plain = (s) => text(s).replace(/\$/g, '').replace(/\\times/g, '×').replace(/\s+/g, ' ');
const has = (s, v) => new RegExp(`(^|[^\\d.])${String(v).replace('.', '\\.').replace('-', '-\\s?')}([^\\d]|$)`).test(s);

/* ---- A. every statement --------------------------------------- */

// "x = 7", "a = -rac{2}{3}", "x = y = 1": letters given values
const solvedIn = (span) => {
  const sides = span.split('=').map(x => x.trim());
  if (sides.length < 2) return null;
  const v = num(sides[sides.length - 1]);
  if (!Number.isFinite(v) || !sides.slice(0, -1).every(x => /^[a-zA-Z]$/.test(x))) return null;
  return sides.slice(0, -1).map(x => [x, v]);
};
const blocksOf = (src, f) => {
  if (f === 'ANSWERS.md') return src.split(/\n(?=\s*\d+\. |#|\s*- \()/);
  const s = src.replace(/=\$\s*<span class="chip">([^<]+)<\/span>/g, '= $1$');
  const parts = s.split(/(?=<div class="c-example">|<div class="c-try">|<div class="work__row"><span class="work__label">\d+<\/span>|<div class="c-practice|<div class="c-reflect">|<div class="c-keyidea">|<h[23]>)/);
  return /^p0/.test(f) ? parts.flatMap(b => (/c-example__tab/.test(b) ? [b] : b.split(/\n\s*<p>\s*\n/))) : parts;
};
const norm = (s) => s.replace(/\\left|\\right/g, '').replace(/\s+/g, '').replace(/[.,;:]$/, '');

let spans = 0; const skipped = [];
function checkSpan(where, span, block) {
  const sides = span.split('=').map(x => x.trim());
  if (sides.length < 2 || sides.some(x => !x)) { skipped.push(`${where}: $${span}$`); return; }
  if (SKIP.has(norm(span))) return;
  if (NAMING.test(span) || solvedIn(span)) return;
  const fs_ = sides.map(parse);
  if (fs_.some(f => !f)) { skipped.push(`${where}: $${span}$`); return; }
  spans++;
  const letters = new Set(sides.flatMap(x => [...lettersOf(x)]));
  const holds = (env) => { const v = fs_.map(f => f(env)); return v.every(finite) && v.every(x => close(x, v[0])); };
  let good = false, how = '';
  if (!letters.size) { good = holds({}); how = 'arithmetic'; }
  else {
    if (RND.every((_, i) => holds(withRandom({}, i)))) { good = true; how = 'identity'; }
    if (!good) {
      const solved = {};
      for (const m of block.matchAll(/\$([^$]+)\$/g)) for (const [v, x] of solvedIn(m[1]) || []) (solved[v] ??= new Set()).add(x);
      const envs = Object.entries(solved).reduce((acc, [v, set]) => acc.flatMap(e => [...set].map(x => ({ ...e, [v]: C(x) }))), [{}]);
      if (Object.keys(solved).length && envs.some(e => [...letters].every(l => l in e) && holds(e))) { good = true; how = 'solved'; }
    }
    if (!good) for (const g of GROUPS) if (g.m.test(block) && g.envs.every(e => holds(withRandom(e)))) { good = true; how = 'given'; break; }
  }
  if (EITHER.has(norm(span))) { if (good || /Assertion/.test(block)) pass++; else fails.push(`${where}: $${span}$ holds nowhere here`); return; }
  if (FALSE.has(norm(span))) { if (how !== 'identity') pass++; else fails.push(`${where}: $${span}$ is printed to be false, and holds`); return; }
  if (good) pass++;
  else fails.push(`${where}: $${span}$ does not hold (${letters.size ? 'letters ' + [...letters].join('') : 'arithmetic'})`);
}
const sources = [...pages.map(f => [f, html[f]]), ['ANSWERS.md', answersMd]];
for (const [f, raw] of sources) {
  for (const block of blocksOf(raw.replace(/\$\$/g, '$'), f)) {
    const whys = [...block.matchAll(/<span class="work__why">([\s\S]*?)<\/span>/g)].map(m => m[1]);
    const stream = [block.replace(/<span class="work__why">[\s\S]*?<\/span>/g, ' '), ...whys];
    for (const chunk of stream) {
    let prev = null;
    for (const m of chunk.matchAll(/\$([^$]+)\$/g)) {
      const pieces = m[1].split(/\\quad\\text\{[^}]*\}\\quad|\\text\{[^}]*\}|\\qquad|\\quad|,(?![^()[\]{}]*[)\]}])/).map(x => x.trim()).filter(Boolean);
      for (let piece of pieces) {
        if (/\\neq|\\leq?(?![a-z])|\\geq?(?![a-z])|<|>|\\Rightarrow|\\pm/.test(piece)) { prev = null; continue; }
        if (piece.startsWith('=') && prev) piece = prev + ' ' + piece;
        if (piece.includes('=')) checkSpan(f, piece.replace(/=\s*$/, '').trim(), block);
        const sides = piece.split('=').map(x => x.trim()).filter(Boolean);
        prev = sides.length ? sides[sides.length - 1] : prev;
      }
    }
    }
  }
}

/* ---- B. claims A cannot check --------------------------------- */

const panels = (src) => {
  const o = {};
  for (const part of src.split('<div class="c-example">').slice(1)) o[part.match(/c-example__tab">Example (\d+)/)[1]] = part;
  return o;
};
const bodyEx = panels(body), beyondEx = panels(beyond);
const rowOf = (panel, label) => { const m = (panel || '').match(new RegExp(`work__label">${label}</span>([\\s\\S]*?)</div>`)); return m ? plain(m[1]) : ''; };
const exSays = (where, ex, n, ...vals) => { for (const v of vals) is(`${where} Example ${n} Answer should say ${v}: "${rowOf(ex[n], 'Answer')}"`, has(rowOf(ex[n], 'Answer'), v)); };
const stepSays = (where, ex, n, ...vals) => { for (const v of vals) is(`${where} Example ${n} should print ${v}`, has(plain(ex[n] || ''), v)); };
const pairWith = (s, p) => { const out = []; for (let a = -200; a <= 200; a++) for (let b = a; b <= 200; b++) if (a + b === s && a * b === p) out.push([a, b]); return out; };
const rowSays = (ex, n, label, phrase) => is(`Example ${n} ${label} should read "${phrase}": "${rowOf(ex[n], label)}"`, rowOf(ex[n], label).includes(phrase));
const lin2 = (A, B, Cc) => { const d = Math.sqrt(B * B - 4 * A * Cc); return [(-B + d) / (2 * A), (-B - d) / (2 * A)]; };

// the body's examples
{ const sq = [1, 4, 9, 16, 25, 36, 49];
  for (const [i, [x, y, z]] of [[0, 1, 2], [2, 3, 4], [4, 5, 6]].entries()) is(`body Ex 1 row ${i + 1}: ${sq[x]} + ${sq[z]} - 2×${sq[y]} = 2`, sq[x] + sq[z] - 2 * sq[y] === 2 && plain(bodyEx[1]).includes(`(${sq[x]} + ${sq[z]}) - (2 × ${sq[y]})`));
  exSays('body', bodyEx, 1, 2); }
exSays('body', bodyEx, 2, (-2 + -3) ** 2);
exSays('body', bodyEx, 4, 43 ** 2);
exSays('body', bodyEx, 9, 119 ** 2);
{ const [[a, b]] = pairWith(7, 12); rowSays(bodyEx, 10, 'Step 3', `only ${a} and ${b} satisfy both`); is('body Ex 10: one pair', pairWith(7, 12).filter(([x, y]) => x > 0 && y > 0).length === 1); }
{ const [[a, b]] = pairWith(11, 30).filter(([x, y]) => x > 0); rowSays(bodyEx, 11, 'Step 3', `leave ${a} and ${b}`);
  is('body Ex 11: 2 and 15 add to 17, 3 and 10 to 13', 2 * 15 === 30 && 2 + 15 === 17 && 3 * 10 === 30 && 3 + 10 === 13 && /2 and 15 multiply to 30 but add to 17; 3 and 10 add to 13/.test(plain(bodyEx[11]))); }
{ const [[a, b]] = pairWith(-5, 6); exSays('body', bodyEx, 12, a, b); is('body Ex 12 signs', a < 0 && b < 0); }
{ const e1 = 10, e3 = 25, s2 = 38, e2 = (e1 * e1 - s2) / 2, p3 = e1 ** 3 - 3 * e1 * e2 + 3 * e3;
  exSays('body', bodyEx, 15, p3); stepSays('body', bodyEx, 15, e2, 10 * (s2 - 0) + 3 * e3);
  is('body Ex 15: 455 is 10 × 38 + 75', 10 * 38 + 75 === 455); }
{ const [[a, b]] = pairWith(-7, 12); rowSays(bodyEx, 16, 'Step 1', `pair is ${b} and ${a}`); const [[c, d]] = pairWith(1, -20); rowSays(bodyEx, 16, 'Step 3', `give ${d} and ${c}`);
  is('p025: simplified form at x = 4 is 1/45', (4 - 3) / (5 * (4 + 5)) === 1 / 45 && /\\frac\{1\}\{45\}/.test(body)); }
{ const [[a, b]] = pairWith(8, 15); rowSays(bodyEx, 17, 'Step 5', `the pair is ${a} and ${b}`); is('body Ex 17: 1 + 8 + 15 = 24 tiles, "twenty-four"', 1 + 8 + 15 === 24 && /twenty-four are used/.test(plain(bodyEx[17])));
  is('p026/p027: 15 has one factor pair summing to 8', pairWith(8, 15).filter(([x, y]) => x > 0 && y > 0).length === 1); }
{ const [x] = lin2(1, -4, -96); rowSays(bodyEx, 18, 'Answer', `length is ${x} metres and the breadth is 12 - 4 = ${x - 4} metres`); is('body Ex 18 roots 12 and -8', lin2(1, -4, -96).join() === '12,-8'); }
is('body: 17 examples, numbered 1-7 and 9-18 (Example 8 is missing in the source)', Object.keys(bodyEx).map(Number).sort((a, b) => a - b).join() === '1,2,3,4,5,6,7,9,10,11,12,13,14,15,16,17,18');
is('p019: pairs of -12 with opposite signs sum to -11, -4, -1', [[1, -12], [2, -6], [3, -4]].map(([a, b]) => a + b).join() === '-11,-4,-1' && /sums \$-11\$, \$-4\$ and \$-1\$/.test(body));
is('p018: eight candidates for 6 without the sign rule', [1, 2].length * 2 * 2 === 8);
is('p028 T&R: no whole-number length for 96.25', ![...Array(200)].some((_, x) => x * (x - 4) === 96.25) && 12 * 8 === 96 && 13 * 9 === 117);

// the figures, measured from their own coordinates
const svgOf = (src, fig) => { const i = src.indexOf(`fignum">Fig. ${fig}<`); return src.slice(src.lastIndexOf('<svg', i), i); };
const rects = (svg) => [...svg.matchAll(/<rect[^>]*?x="([\d.]+)"[^>]*?y="([\d.]+)"[^>]*?width="([\d.]+)"[^>]*?height="([\d.]+)"/g)].map(m => m.slice(1).map(Number));
{ const s = svgOf(body, '4.6'), rs = rects(s).map(r => r[2]); const [a, b, c] = [6, 3, 2], u = 12;
  ok('Fig. 4.6 top row sides', rs.slice(0, 4), [a + b + c, a + b - c, a - b + c, a - b - c].map(x => x * u));
  ok('Fig. 4.6 bottom row sides', rs.slice(4, 7), [2 * a, 2 * b, 2 * c].map(x => x * u));
  is('Fig. 4.6 rows have equal area', rs.slice(0, 4).reduce((t, x) => t + x * x, 0) === rs.slice(4, 7).reduce((t, x) => t + x * x, 0)); }
{ const s = svgOf(body, '4.7'), rs = rects(s), u = 26, X = 4 * u;
  ok('Fig. 4.7 tiles', [rs.filter(r => r[2] === X && r[3] === X).length, rs.filter(r => (r[2] === X) !== (r[3] === X)).length, rs.filter(r => r[2] === u && r[3] === u).length], [1, 3 + 4, 3 * 4]);
  is('Fig. 4.7 outline is x + 3 by x + 4', /x1="60" y1="26" x2="242"/.test(s) && 242 - 60 === X + 3 * u && /y1="40" x2="44" y2="248"/.test(s) && 248 - 40 === X + 4 * u); }
{ const s = svgOf(body, '4.8'), rs = rects(s), u = 22, X = 3 * u;
  ok('Fig. 4.8 tiles', [rs.filter(r => r[2] === X && r[3] === X).length, rs.filter(r => (r[2] === X) !== (r[3] === X)).length, rs.filter(r => r[2] === u && r[3] === u).length], [6, 11, 3]);
  is('Fig. 4.8 outline is 3x + 1 by 2x + 3', 276 - 56 === 3 * X + u && 238 - 40 === 2 * X + 3 * u && s.includes('x2="276" y2="26"') && s.includes('x2="40" y2="238"')); }
{ const s = svgOf(body, '4.11'), rs = rects(s), u = 22, X = 3 * u;
  ok('Fig. 4.11 tiles', [rs.filter(r => r[2] === X && r[3] === X).length, rs.filter(r => (r[2] === X) !== (r[3] === X)).length, rs.filter(r => r[2] === u && r[3] === u).length], [1, 8, 15]);
  is('Fig. 4.11 outline is x + 5 by x + 3', 232 - 56 === X + 5 * u && 172 - 40 === X + 3 * u && s.includes('x2="232" y2="26"') && s.includes('x2="40" y2="172"')); }
{ const s = svgOf(body, '4.2'); is('Fig. 4.2: a = 200, b = 80 both ways', s.includes('x="108" y="72"  width="200" height="200"') && s.includes('x="308" y="272" width="80"  height="80"') && s.includes('width="280" height="280"')); }
{ const s = svgOf(body, '4.9'); const A = 100, B = 60, d = 56 / 160;
  is('Fig. 4.9: front cuts at a from the left and from the bottom', s.includes('x1="160" y1="120" x2="160" y2="280"') && 160 - 60 === A && s.includes('x1="60"  y1="180" x2="220" y2="180"') && 280 - 180 === A);
  is('Fig. 4.9: depth cuts at a from the front', s.includes('x1="95"  y1="85"') && Math.abs((95 - 60) / 56 - A / (A + B)) < 0.01 && s.includes('x1="255" y1="85"') && Math.abs((255 - 220) / 56 - A / (A + B)) < 0.01 && d > 0);
  is('Fig. 4.9: the depth tick sits at a along the bottom edge', s.includes('x1="250" y1="240" x2="260" y2="250"') && Math.abs((255 - 220) / 56 - A / (A + B)) < 0.01); }
{ const s = svgOf(beyond, '4B.2'); const [[, , w, h]] = rects(s);
  is(`Fig. 4B.2: rectangle ${w} by ${h} is 12 : 5, diagonal 13`, Math.abs(w / h - 12 / 5) < 1e-9 && 12 * 12 + 5 * 5 === 13 * 13); }
{ const s = svgOf(beyond, '4B.3'); const a = 150 - 30, b = 150 - 60;
  is(`Fig. 4B.3: pond ${b} of field ${a} is 36 of 48`, s.includes('M30 18 H60 V108 H150 V138 H30 Z') && s.includes('x="60" y="18" width="90" height="90"') && b / a === ((84 - 12) / 2) / ((84 + 12) / 2)); }

// the exercises, read back off ANSWERS.md, each against the question on the page
const mdSection = (head) => { const i = answersMd.indexOf(head); if (i < 0) return ''; const j = answersMd.indexOf('\n#', i + head.length); return answersMd.slice(i, j < 0 ? undefined : j); };
const mdItem = (head, n) => { const m = mdSection(head).match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`)); return m ? m[1] : ''; };
const mdSays = (head, n, ...vals) => { for (const v of vals) is(`ANSWERS.md ${head} Q${n} should say ${v}`, has(plain(mdItem(head, n)), v)); };
const fracNorm = (s) => s.replace(/\\[dt]?frac/g, '\\frac').replace(/\\left|\\right/g, '').replace(/\s+/g, '').replace(/,&nbsp;.*$/, '').replace(/,$/, '');
const setBlock = (headText, n) => { const i = body.indexOf(headText); const j = n === 1 ? i : body.indexOf(`data-start="${n}"`, i); return body.slice(j, body.indexOf('</ol>\n        </ol>', j) > 0 ? body.indexOf('</li>\n        </ol>', j) : j + 3000); };
function partsOnPage(headText, n) {
  const blk = setBlock(headText, n);
  const inner = blk.match(/<ol class="c-parts[^"]*">([\s\S]*?)<\/ol>/);
  return inner ? [...inner[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)].map(m => (m[1].match(/\$([^$]+)\$/) || [])[1]).filter(Boolean) : [];
}
function questionsMatch(headText, mdHead, n) {
  const parts = partsOnPage(headText, n), item = fracNorm(mdItem(mdHead, n));
  is(`${mdHead} Q${n}: found ${parts.length} parts on the page`, parts.length > 0);
  for (const q of parts) {
    const e = fracNorm(q);
    is(`${mdHead} Q${n}: ANSWERS.md answers ${q}`, item.includes(e) || item.includes(e.replace(/\^(\d)/g, '^{$1}')));
  }
}
const S1 = '### Exercise Set 4.1', S2 = '### Exercise Set 4.2', S3 = '### Exercise Set 4.3', S5 = '### Exercise Set 4.5', E = '## End-of-Chapter Exercises', S4 = '### Exercise Set 4.4';
questionsMatch('Exercise Set 4.1', S1, 1);
mdSays(S1, 2, 64 ** 2, 105 ** 2, 205 ** 2);
questionsMatch('Exercise Set 4.2', S2, 1);
mdSays(S2, 2, 79 ** 2, 193 ** 2, 299 ** 2);
mdSays(S3, 1, 117 ** 2, 78 ** 2, 198 ** 2, 214 ** 2, 1104 ** 2, 1120 ** 2);
questionsMatch('Exercise Set 4.3', S3, 2);
questionsMatch('Exercise Set 4.3', S3, 3);
{ const q4 = '(a+b-c)^2+(a-b+c)^2+(a-b-c)^2', f = parse(q4), g = parse('2a^2+2b^2+2c^2');
  is('Ex 4.3 Q4 is not an identity: 3 against 2 at a = 1', close(f(R({ a: 1, b: 0, c: 0 })), C(3)) && close(g(R({ a: 1, b: 0, c: 0 })), C(2)) && /\*\*No\.\*\*/.test(mdItem(S3, 4)));
  is('Ex 4.3 Q4: the left side in full', RND.every(e => close(f(e), parse('3a^2+3b^2+3c^2-2ab-2bc-2ca')(e))) && mdItem(S3, 4).includes('3a^2 + 3b^2 + 3c^2 - 2ab - 2bc - 2ca')); }
is('T&R: squares ending in 5', [35, 65, 85, 105].every(n => n * n % 100 === 25) && [1225, 4225, 7225, 11025].every(v => has(plain(mdSection('### Think and Reflect (squares ending in 5)')), v)) && [35, 65, 85, 105].every((n, i) => (n - 5) * (n + 5) + 25 === [1225, 4225, 7225, 11025][i]));
is('T&R Fig. 4.6: 196 both rows', 121 + 49 + 25 + 1 === 196 && 144 + 36 + 16 === 196 && /196 = 144/.test(answersMd));
is('T&R four squares: always 4', [1, 2, 3, 10, 57].every(n => n * n + (n + 3) ** 2 - (n + 1) ** 2 - (n + 2) ** 2 === 4) && /1 \+ 16 - 4 - 9 = 4/.test(answersMd));
is('T&R tiles: only 3 × 4 = 12 closes', [[1, 6], [2, 5], [3, 4]].filter(([a, b]) => a * b === 12).length === 1);
// Exercise Set 4.4 — the blanks, and the numbers
{ const it = mdItem(S4, 1);
  for (const [lhs, rhs] of [['s^2-11s+24', '(s-3)(s-8)'], ['(3x-7)(x+1)', '3x^2-4x-7'], ['10x^2-11x-6', '(2x-3)(5x+2)'], ['6x^2+7x+2', '(2x+1)(3x+2)']])
    is(`Ex 4.4 Q1: ${lhs} = ${rhs}, and ANSWERS.md says so`, RND.every(e => close(parse(lhs)(e), parse(rhs)(e))) && fracNorm(it).includes(lhs) && fracNorm(it).includes(rhs));
  is('Ex 4.4 Q1: the page blanks fit those answers', /\(2x - \$<span class="blank blank--sm"><\/span>\$\)\(\$<span class="blank blank--sm"><\/span>\$\+ 2\)/.test(body)); }
mdSays(S4, 2, 41 ** 2, 27 ** 2, 23 * 17, 135 ** 2, 97 ** 2, 18 * 29, 34 * 43, 205 ** 2);
questionsMatch('Exercise Set 4.4', S4, 3);
questionsMatch('Exercise Set 4.5', S5, 1);
{ const it = plain(mdItem(S5, 2)); is('Ex 4.5 Q2: 14/9 at x = 2, and her answer 2', (4 + 10) / (4 + 5) === 14 / 9 && /frac\{14\}\{9\}/.test(mdItem(S5, 2)) && /her answer is 2/.test(it)); }
questionsMatch('Exercise Set 4.5', S5, 3);
{ const it = mdItem(S5, 3); is('Ex 4.5 Q3: the ruled-out values', /\$x = 3\$ and \$x = -2\$/.test(it) && /\$a = -2\$ is ruled out/.test(it) && /\$t = 1\$ and \$t = -1\$/.test(it)); }
questionsMatch('End-of-Chapter Exercises', E, 1);
mdSays(E, 2, 17 * 21, 104 * 96, 24 * 16, 147 ** 3, 199 ** 3, 127 ** 3, (-107) ** 3, (-299) ** 3);
questionsMatch('End-of-Chapter Exercises', E, 3);
questionsMatch('End-of-Chapter Exercises', E, 4);
questionsMatch('End-of-Chapter Exercises', E, 5);
questionsMatch('End-of-Chapter Exercises', E, 6);
is('End Q7: path area', [0.5, 1, 2.5].every(s => (40 + 2 * s) ** 2 - 1600 === 4 * s * (s + 40)) && mdItem(E, 7).includes('4s(s + 40)'));
is('End Q8: 3 and 1/3', [3, 1 / 3].every(x => Math.abs(x + 1 / x - 10 / 3) < 1e-12) && /The number is \$3\$ or \$\\tfrac\{1\}\{3\}\$/.test(mdItem(E, 8)));
is('End Q9: length x + 3', RND.every(e => close(parse('(2x+1)(x+3)')(e), parse('2x^2+7x+3')(e))) && mdItem(E, 9).includes('length is $x + 3$'));
is('End Q11: -25, and no real a, b, c', 5 * ((25 - 20) - 10) === -25 && 25 - 20 < 25 / 3 && /no real/.test(mdItem(E, 11)));
is('End Q12: n^3 - n divisible by 6 for n up to 1000', [...Array(1000)].every((_, n) => (n ** 3 - n) % 6 === 0));
is('End Q13: both values 0', RND.every(e => { const y = e.y.re, x = -4 - y, x2 = 2 * y + 6; return Math.abs(x ** 3 + y ** 3 - 12 * x * y + 64) < 1e-9 && Math.abs(x2 ** 3 - 8 * y ** 3 - 36 * x2 * y - 216) < 1e-9; }) && /- 12xy \+ 64 = 0/.test(mdItem(E, 13)) && /36xy - 216 = 0/.test(mdItem(E, 13)));

// Stage 1, as printed in its running text
{ const s1 = beyond.slice(0, beyond.indexOf('Solved Examples'));
  is('Stage 1 Q1: 1, 2, -3 gives 7 both sides', 1 - 2 * -3 === 7 && 4 - (-3) * 1 === 7 && /1 \+ 6 = 7\$ on the left and \$4 \+ 3 = 7/.test(s1));
  is('Stage 1 Q2: 13 and 35 from 5 and 6', 25 - 12 === 13 && 125 - 90 === 35 && 4 + 9 === 13 && 8 + 27 === 35 && /25 - 12 = 13/.test(s1) && /125 - 90 = 35/.test(s1));
  is('Stage 1 Q2: a + b = 5, ab = 5 has no whole numbers but real ones', pairWith(5, 5).length === 0 && 25 - 20 > 0 && /a\^2 \+ b\^2 = 15/.test(s1) && 25 - 10 === 15);
  is('Stage 1 Q3: 5 = 1 × 5 at x = y = 1', 1 + 4 === 5 && (1 + 2 - 2) * (1 + 2 + 2) === 5);
  is('Stage 1 Q4: 8 against 2, and 18 both sides', 2 ** 3 === 8 && 1 + 1 === 2 && 1 + 7 + 10 === 18 && 3 * 6 === 18 && /Both sides\s+are \$18\$/.test(s1));
  is('Stage 1 Q5: (x - y)^2 = -1', 144 - (289 - 144) === -1 && /144 - 145 = -1/.test(s1)); }

// Stage 2
exSays('Beyond', beyondEx, 1, 996 ** 2);
exSays('Beyond', beyondEx, 10, 998 ** 3);
stepSays('Beyond', beyondEx, 10, 1000 ** 3, 3 * 1000 ** 2 * 2, 3 * 1000 * 4);
{ const e2 = (81 - 35) / 2; stepSays('Beyond', beyondEx, 3, e2, 2 * e2); is('Beyond Ex 3: 1, 3, 5 fit', 1 + 3 + 5 === 9 && 1 + 9 + 25 === 35 && 3 + 15 + 5 === e2); }
{ const s2 = 16 + 2 * 21; exSays('Beyond', beyondEx, 5, s2, 10, -10); is('Beyond Ex 5: 7, 3 and -3, -7', 7 - 3 === 4 && 7 * 3 === 21 && -3 - -7 === 4 && -3 * -7 === 21 && (s2 + 42) === 100); }
{ const xy = ((17 * 17) - 169) / 2; stepSays('Beyond', beyondEx, 6, xy, 2 * xy); is('Beyond Ex 6: sides 12 and 5', pairWith(17, xy).some(([a, b]) => a === 5 && b === 12)); }
{ const ab = (343 - 133) / 21, pairs = pairWith(7, ab); stepSays('Beyond', beyondEx, 7, ab); is('Beyond Ex 7: pairs (5, 2) and (2, 5)', pairs.length === 1 && pairs[0].join() === '2,5' && /\(5, 2\) and \(2, 5\)/.test(rowOf(beyondEx[7], 'Answer')));
  is('Beyond Ex 7 remark: 70 gives ab = 13 and -3', (343 - 70) / 21 === 13 && 49 - 52 === -3); }
{ const [[a, b]] = pairWith(-2, -35); is('Beyond Ex 8: -7 and 5', a === -7 && b === 5); }
{ const [[a, b]] = pairWith(5, -36).filter(([x, y]) => x === -4); is('Beyond Ex 9: 9 and -4', a === -4 && b === 9); }
is('Beyond Ex 11: 3(3x)^2(2y) = 54 and 3(3x)(2y)^2 = 36', 3 * 9 * 2 === 54 && 3 * 3 * 4 === 36);
is('Beyond Ex 12 check: 63', 2 ** 6 - 1 === 63 && 1 * 3 * 7 * 3 === 63);
{ const s2 = 81 - 52; exSays('Beyond', beyondEx, 13, 'b'); stepSays('Beyond', beyondEx, 13, s2, 9 * (s2 - 26)); is('Beyond Ex 13 check: 2, 3, 4', 2 + 3 + 4 === 9 && 6 + 12 + 8 === 26 && 8 + 27 + 64 === 99 && 99 - 72 === 27); }
{ const v = 3 * 28 * -15 * -13; exSays('Beyond', beyondEx, 14, v); is('Beyond Ex 14: the cubes', 28 ** 3 + (-15) ** 3 + (-13) ** 3 === v && 28 ** 3 === 21952 && 15 ** 3 === 3375 && 13 ** 3 === 2197); }
is('Beyond Ex 15: -1/2 both ways at a = 1', (3 - 5 - 2) / (9 - 1) === -0.5 && (1 - 2) / (3 - 1) === -0.5);
{ const [r] = lin2(1, 2, -143); exSays('Beyond', beyondEx, 16, r, r + 2); is('Beyond Ex 16: roots 11 and -13', lin2(1, 2, -143).join() === '11,-13' && r % 2 === 1); }
is('Beyond Ex 17: n(n+1)(n+2)(n+3) + 1 is (n^2 + 3n + 1)^2 for n up to 200', [...Array(200)].every((_, n) => n * (n + 1) * (n + 2) * (n + 3) + 1 === (n * n + 3 * n + 1) ** 2) && 1 * 2 * 3 * 4 + 1 === 25);
{ const isPrime = (v) => { if (v < 2) return false; for (let d = 2; d * d <= v; d++) if (v % d === 0) return false; return true; };
  const count = [...Array(300)].filter((_, n) => isPrime(n ** 4 + 4)).length;
  is(`Beyond Ex 18: ${count} n below 300 make n^4 + 4 prime`, count === 1 && isPrime(5) && !isPrime(4));
  is('Beyond Ex 18: the factors', [...Array(50)].every((_, n) => n ** 4 + 4 === (n * n - 2 * n + 2) * (n * n + 2 * n + 2))); }
ok('Beyond examples numbered 1-18', Object.keys(beyondEx).map(Number).sort((a, b) => a - b), [...Array(18)].map((_, i) => i + 1));

// the MCQ examples: exactly one right option, the one the Answer row names
const optsIn = (src) => [...((src || '').match(/<ol class="c-parts c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/) || ['', ''])[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => m[1].trim());
const mathOf = (o) => (o.match(/^\$([^$]+)\$$/) || [])[1];
const numOpt = (o) => { const m = mathOf(o); return m ? num(m) : NaN; };
const exKey = (n) => (rowOf(beyondEx[n], 'Answer').match(/\(([a-d])\)/) || [])[1];
const sameAs = (target) => (o) => { const m = mathOf(o); const f = m && parse(m), g = parse(target); return !!f && RND.every(e => close(f(e), g(e))); };
const byValue = (v) => (o) => Math.abs(numOpt(o) - v) < 1e-9;
const exSolve = {
  3: byValue((81 - 35) / 2),
  6: byValue((289 - 169) / 2),
  7: (o) => o === '$' + (() => { const ab = (343 - 133) / 21, d = 49 - 4 * ab; return d > 0 ? 2 : d === 0 ? 1 : 0; })() + '$',
  8: sameAs('x^2 - 2x - 35'),
  13: byValue(9 * ((81 - 2 * 26) - 26)),
  18: (o) => o === '$1$',
};
for (const [n, f] of Object.entries(exSolve)) {
  const o = optsIn(beyondEx[n]);
  is(`Beyond Example ${n} has four options`, o.length === 4);
  ok(`Beyond Example ${n}: the right option`, o.map((x, i) => (f(x) ? 'abcd'[i] : null)).filter(Boolean), [exKey(n)]);
}
is('Beyond Ex 3 remark: 58 and 13', (81 + 35) / 2 === 58 && (35 - 9) / 2 === 13);
is('Beyond Ex 6 remark: 120 and 30', 2 * 60 === 120 && 120 / 4 === 30);

// the practice answers, read back out of the key rows
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= plain(m[2]);
const row = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const r = keyRows[n] || '';
  if (!part) return r;
  const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\) |$)`));
  return m ? m[1] : '';
};
const says = (q, ...vals) => { for (const v of vals) is(`key ${q} should say ${v}: "${row(q).slice(0, 90)}"`, has(row(q), v)); };
const P = {
  22: [(1002 + 998) * (1002 - 998)],
  23: [7 * 7],
  24: [+(9.9 ** 2).toFixed(2)],
  26: [Math.sqrt(29 + 20), Math.sqrt(29 - 20), 5, 2],
  27: [4, -4],
  30: [...lin2(1, 2, -168).filter(x => x > 0), lin2(1, 2, -168).filter(x => x > 0)[0] + 2],
  '31b': [(121 - 25) / 4],
  '32c': [2 * 10 + 3, 10 + 2],
  '33a': [12 ** 3], '33b': [3 * 10 * 10 * 2], '33c': [3 * 10 * 2 * 2], '33d': [1000 + 600 + 120 + 8],
};
for (const [q, vs] of Object.entries(P)) says(q, ...vs);
is('key 26: 5 and 2 fit', 25 + 4 === 29 && 5 * 2 === 10);
is('key 27: the fraction agrees away from 4 and -4', [0, 1, 7, -9].every(x => Math.abs((x * x + x - 12) / (x * x - 16) - (x - 3) / (x - 4)) < 1e-12));
is('key 30: 12 and 14', 144 + 196 === 340);
is('key 31 (b): 8 and 3', 8 * 3 === 24);
is('key 32 (c): 23 by 12 is the area at x = 10', 23 * 12 === 2 * 100 + 70 + 6);
is('key 32 (d): no pair for 14 and 7', pairWith(7, 14).length === 0 && /add to \$15\$ and \$9\$/.test(beyond) && 1 + 14 === 15 && 2 + 7 === 9);
is('key 33 (d) names the cube identity', /\(a \+ b\)\^3 = a\^3 \+ 3a\^2b \+ 3ab\^2 \+ b\^3/.test(beyond));
is('key 29: the bracket is 3(a + b)(a + c)', RND.every(e => close(parse('(a+b+c)^2+a(a+b+c)+a^2-(b^2-bc+c^2)')(e), parse('3(a+b)(a+c)')(e))));

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] ??= m[2];
const optsOf = (n) => optsIn((qs[n] || '').replace(/<ol class="c-parts c-parts--1">[\s\S]*?<\/ol>|<ol class="c-parts c-parts--3">[\s\S]*?<\/ol>/, ''));
const stmts = (n) => { const m = (qs[n] || '').match(/<ol class="c-parts c-parts--[13]">([\s\S]*?)<\/ol>/); return m ? [...m[1].matchAll(/<li>\$([^$]+)\$<\/li>/g)].map(x => x[1]) : []; };
const key = {};
{ const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2]; }
const holdsUnder = (st, envs) => { const [l, r] = st.split('='); return envs.every(e => close(parse(l)(withRandom(e)), parse(r)(withRandom(e)))); };
const isIdentity = (st) => holdsUnder(st, [{}, ...[1, 2].map(i => RND[i])]) && RND.every((_, i) => { const [l, r] = st.split('='); return close(parse(l)(RND[i]), parse(r)(RND[i])); });
const romanSet = (bools) => { const r = ['i', 'ii', 'iii'].filter((_, i) => bools[i]); return r.length === 3 ? 'all three' : r.length === 1 ? `(${r[0]}) only` : `(${r[0]}) and (${r[1]})`; };
const xOf = (s, sign) => (s + sign * Math.sqrt(s * s + (sign < 0 ? 4 : -4) * 1)) / 2;
{ const x = (5 + Math.sqrt(21)) / 2; is('Q2 x exists and gives 23', Math.abs(x * x + 1 / (x * x) - 23) < 1e-9); }
{ const x = (3 + Math.sqrt(13)) / 2; is('Q5 x exists and gives 36', Math.abs(x ** 3 - 1 / x ** 3 - 36) < 1e-9 && Math.abs(x - 1 / x - 3) < 1e-9); }
{ const x = 2 + Math.sqrt(3); is('Q13 x exists and gives 52', Math.abs(x ** 3 + 1 / x ** 3 - 52) < 1e-9 && Math.abs(x + 1 / x - 4) < 1e-9); }
const table = (() => { const t = (qs[11] || '').match(/<tbody>([\s\S]*?)<\/tbody>/); return t ? [...t[1].matchAll(/<td>\$(-?\d+)\$<\/td>/g)].map(m => Number(m[1])) : []; })();
const pairs45 = (() => { let n = 0; for (let y = 1; y < 50; y++) for (let x = y + 1; x < 50; x++) if (x * x - y * y === 45) n++; return n; })();
const solve = {
  1: byValue(103 * 97),
  2: byValue(25 - 2),
  3: sameAs('27a^3 + 8b^3'),
  4: (o) => { const ks = [...o.matchAll(/k = (-?\d+)/g)].map(m => Number(m[1])).sort((a, b) => a - b); return /only/.test(o) === (ks.length === 1) && ks.join() === [-12, 12].filter(k => k * k === 4 * 36).join(); },
  5: byValue(27 + 9),
  6: byValue((587 ** 2 - 413 ** 2) / (587 - 413)),
  7: byValue((1000 - 370) / 30),
  8: (o) => o === romanSet(stmts(8).map(isIdentity)),
  9: (o) => o === romanSet(stmts(9).map(st => holdsUnder(st, two('ab', [C(3), C(4)])))),
  10: (o) => { const ok2 = [0, 1, -2, 3.5, 10].every(x => Math.abs((x * x - 4) / (x - 2) - (x + 2)) < 1e-12) && !Number.isFinite((4 - 4) / (2 - 2)); return ok2 && o === 'for every $x$ except $2$'; },
  11: (o) => { const m = mathOf(o), f = m && parse(m); return !!f && table.length === 4 && [0, 1, 2, 3].every((x, i) => close(f({ x: C(x) }), C(table[i]))); },
  12: (o) => { const preds = { 'never': () => false, 'only when $a = b = 0$': (a, b) => a === 0 && b === 0, 'only when $ab = 0$': (a, b) => a * b === 0, 'exactly when $a = 0$, $b = 0$ or $a = -b$': (a, b) => a === 0 || b === 0 || a === -b };
    const f = preds[o]; if (!f) return false; for (let a = -6; a <= 6; a++) for (let b = -6; b <= 6; b++) if (f(a, b) !== ((a + b) ** 3 === a ** 3 + b ** 3)) return false; return true; },
  13: byValue(64 - 12),
  14: (o) => { const m = mathOf(o), f = m && parse(m), g = parse('x^3 - y^3 - z^3'); return !!f && GROUPS.find(G => G.conds[0] === 'x - y - z = 0').envs.every(e => close(f(e), g(e))); },
  15: (o) => { const m = mathOf(o), f = m && parse(m), g = parse('(a + b)(b + c)(c + a)'); return !!f && GROUPS[0].envs.every(e => close(f(e), g(e))); },
  16: byValue(pairs45),
  17: byValue((84) * (12)),
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  ok(`Q${q}: the right option`, o.map((x, i) => (f(x) ? 'abcd'[i] : null)).filter(Boolean), [key[q]]);
}
ok('Q11 table', table, [0, 1, 2, 3].map(x => (x - 3) * (x - 4)));
is('Q16: three pairs, 23-22, 9-6, 7-2', pairs45 === 3 && 23 * 23 - 22 * 22 === 45 && 81 - 36 === 45 && 49 - 4 === 45);
is('Q17: a = 48, b = 36', 48 + 36 === 84 && 48 - 36 === 12 && 48 * 48 - 36 * 36 === 1008);
is('Q7: p and q are real', 100 - 4 * 21 >= 0);
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  18: [RND.every(e => close(parse('(a-b)^2')(e), parse('(b-a)^2')(e))), [2, -3.5].every(v => (-v) ** 2 === v * v), true],
  19: [RND.every(e => close(parse('x^3+y^3+z^3')(e), parse('3xyz')(e))), isIdentity('x^3+y^3+z^3-3xyz=(x+y+z)(x^2+y^2+z^2-xy-yz-zx)'), false],
  20: [101 * 99 === 9999, isIdentity('(a+b)^2=a^2+2ab+b^2'), false],     // A is the difference of squares, not R
  21: [RND.every(e => close(parse('x^3-1')(e), parse('(x-1)(x^2+x+1)')(e))), isIdentity('x^3-1=(x-1)(x^2-x+1)'), false],
};
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-21', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(21)].map((_, i) => i + 1));
ok('practice numbered 1-33', [...beyond.matchAll(/data-start="(\d+)"/g)].map(m => Number(m[1])), [...Array(32)].map((_, i) => i + 2));
ok('trace rows 22-33', Object.keys(keyRows).map(Number).filter(n => n >= 22).sort((a, b) => a - b), [...Array(12)].map((_, i) => i + 22));
// why the other options are wrong: the wrong readings land on the options
is('why 2: 25, 27, 21', 25 === 25 && 25 + 2 === 27 && 25 - 4 === 21);
is('why 5: 27, 30, 45', 27 + 3 === 30 && 27 + 18 === 45);
is('why 7: 37, 63, 630', 370 / 10 === 37 && (1000 - 370) / 10 === 63 && 1000 - 370 === 630);
is('why 9: 91', 343 - 252 === 91 && 3 * 12 * 7 === 252);
is('why 12: 2, -2 and 0, 5', (2 - 2) ** 3 === 8 - 8 && (0 + 5) ** 3 === 0 + 125);
is('why 13: 64, 76, 60', 4 ** 3 === 64 && 64 + 12 === 76 && 64 - 4 === 60);
is('why 19: 36 against 18', 1 + 8 + 27 === 36 && 3 * 1 * 2 * 3 === 18);
is('why 21: R multiplies out wrongly', RND.every(e => close(parse('(x-1)(x^2-x+1)')(e), parse('x^3-2x^2+2x-1')(e))));

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
{ const i = answersMd.indexOf('as the key prints it'); for (const m of answersMd.slice(i, i + 700).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2]; }
ok('ANSWERS.md key matches the page', mdKey, key);
const W = '### The working for each';
for (const [q, vs] of Object.entries(P)) {
  const [, n] = q.match(/^(\d+)/);
  for (const v of vs) is(`ANSWERS.md practice ${q} should say ${v}`, has(plain(mdItem(W, n)), v));
}
for (const q of Object.keys(solve)) {
  const o = optsOf(q), right = o['abcd'.indexOf(key[q])] || '';
  const v = numOpt(right);
  if (Number.isFinite(v)) is(`ANSWERS.md practice ${q} should reach ${v}`, has(plain(mdItem(W, q)), v));
}
for (const q of Object.keys(AR)) is(`ANSWERS.md practice ${q} gives (${key[q]})`, mdItem(W, q).startsWith(`(${key[q]})`));
is('ANSWERS.md practice 8 and 9 name the right statements', /^\(i\) and \(iii\)/.test(mdItem(W, 8)) && /^\(i\) and \(ii\)/.test(mdItem(W, 9)));
is('ANSWERS.md practice 30 and 31 values', has(plain(mdItem(W, 31)), 24) && has(plain(mdItem(W, 30)), 12) && has(plain(mdItem(W, 30)), 14));
is('ANSWERS.md Stage 1 values', /Q2 \$a\^2 \+ b\^2 = 13\$ and \$a\^3 \+ b\^3 = 35\$/.test(answersMd) && /\(x - y\)\^2 = -1/.test(mdSection('### Stage 1')));

/* ---- report ---------------------------------------------------- */

console.log(`A  ${spans} statements evaluated; ${skipped.length} spans not evaluable, skipped`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
