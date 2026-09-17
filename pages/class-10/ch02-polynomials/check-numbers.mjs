#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed — values, zeroes, sums and products of zeroes, and the zeroes a
   graph shows, read off the SVG coordinates of the drawn curve — and
   compared with what is on the page.

     node pages/class-10/ch02-polynomials/check-numbers.mjs [--skipped]

   Five parts:
     A  every identity set as maths, on every page and in ANSWERS.md. Sides
        that are pure arithmetic are compared as numbers; sides in the same
        letters (x, s, t, alpha ...) are compared as polynomial identities at
        random values. Every "p(k) = ..." is checked against the polynomial
        p(x) last defined before it.
     F  the figures: every graph drawn on a grid lies on its equation, every
        labelled point is where its label says and on the curve, and the
        points where a curve meets the x-axis are the zeroes of its
        polynomial. The sketches are counted: the number of times each curve
        meets its axis is the number the caption, the answer row or
        ANSWERS.md prints.
     B  the claims A cannot check: zeroes, examples, Stage 1, and the
        practice answers read back out of the key rows a lettered part at a
        time, and ANSWERS.md's exercise answers
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
const EPS = 1e-7;
const near = (a, b) => Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= EPS * Math.max(1, Math.abs(a), Math.abs(b));
const is = (what, cond) => { if (cond) pass++; else fails.push(what); };
const sameSet = (a, b) => {
  const u = (xs) => [...xs].sort((p, q) => p - q).filter((v, i, s) => i === 0 || !near(v, s[i - 1]));
  const A = u(a), B = u(b);
  return A.length === B.length && A.every((v, i) => near(v, B[i]));
};
const okSet = (what, got, want) => { if (sameSet(got, want)) pass++; else fails.push(`${what}\n      computed ${JSON.stringify(got)}\n      printed  ${JSON.stringify(want)}`); };
const okNum = (what, got, want) => { if (near(got, want)) pass++; else fails.push(`${what}\n      computed ${got}\n      printed  ${want}`); };

/* ---- reading LaTeX as mathematics ---------------------------- */

// Returns { vars, f(env) } or null for anything that is not an expression in
// numbers and letters (\text, a function name, a symbol we do not read).
function compile(tex) {
  let s = tex
    .replace(/\\left|\\right/g, '')
    .replace(/\\[dt]?frac/g, '§').replace(/\\sqrt/g, '√')
    .replace(/\\times|\\cdot/g, '*').replace(/\\div/g, '/')
    .replace(/\\alpha/g, 'α').replace(/\\beta/g, 'β').replace(/\\gamma/g, 'γ')
    .replace(/\\[,;! ]/g, ' ')
    .replace(/[{[]/g, '(').replace(/[}\]]/g, ')')
    .replace(/−/g, '-');
  if (/\\|[&$:<>|]/.test(s)) return null;
  const T = [];
  for (let i = 0; i < s.length;) {
    const c = s[i];
    if (/\s/.test(c)) { i++; continue; }
    const m = s.slice(i).match(/^\d+(\.\d+)?/);
    if (m) { T.push({ t: 'n', v: m[0] }); i += m[0].length; continue; }
    if (/[a-zA-Zαβγ]/.test(c)) {
      if ((c === 'p' || c === 'h') && s[i + 1] === '(') return null;   // p(x), h(t): a function, not a product
      T.push({ t: 'v', v: c }); i++; continue;
    }
    if ('+-*/^()§√'.includes(c)) { T.push({ t: c }); i++; continue; }
    return null;
  }
  const vars = new Set();
  let i = 0;
  const peek = () => T[i];
  const starts = (p) => p && (p.t === 'n' || p.t === 'v' || p.t === '(' || p.t === '√' || p.t === '§');
  const fail = () => { throw new Error('parse'); };
  function atom() {
    const p = T[i++];
    if (!p) fail();
    if (p.t === 'n') { const v = Number(p.v); return () => v; }
    if (p.t === 'v') { vars.add(p.v); return (e) => e[p.v]; }
    if (p.t === '(') { const v = expr(); if (T[i++]?.t !== ')') fail(); return v; }
    if (p.t === '√') { const a = atom(); return (e) => Math.sqrt(a(e)); }
    if (p.t === '§') { const a = atom(), b = atom(); return (e) => a(e) / b(e); }
    fail();
  }
  function power() {
    const b = atom();
    if (peek()?.t !== '^') return b;
    i++;
    let x;
    if (peek()?.t === 'n' && peek().v.length > 1) {        // x^23 is x^2 times 3
      const n = peek().v; T[i] = { t: 'n', v: n.slice(1) }; const d = Number(n[0]); x = () => d;
    } else if (peek()?.t === '-') { i++; const a = atom(); x = (e) => -a(e); } else x = atom();
    return (e) => Math.pow(b(e), x(e));
  }
  function unary() {
    if (peek()?.t === '-') { i++; const r = unary(); return (e) => -r(e); }
    if (peek()?.t === '+') { i++; return unary(); }
    return power();
  }
  function term() {
    let v = unary();
    for (;;) {
      const p = peek();
      if (p && (p.t === '*' || p.t === '/')) {
        i++; const r = unary(), l = v;
        v = p.t === '*' ? (e) => l(e) * r(e) : (e) => l(e) / r(e);
      } else if (starts(p)) { const r = power(), l = v; v = (e) => l(e) * r(e); } else break;
    }
    return v;
  }
  function expr() {
    let v = term();
    while (peek() && (peek().t === '+' || peek().t === '-')) {
      const op = T[i++].t, r = term(), l = v;
      v = op === '+' ? (e) => l(e) + r(e) : (e) => l(e) - r(e);
    }
    return v;
  }
  try {
    if (!T.length) return null;
    const f = expr();
    if (i !== T.length) return null;
    return { vars, f };
  } catch { return null; }
}
const ENVS = [0, 1, 2].map((k) => Object.fromEntries([...'abcdefgijklmnoqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZαβγ'].map((c, j) => [c, 0.37 + 0.61 * k + 0.113 * ((j * 7 + k * 3) % 11)])));
const num = (tex) => { const c = compile(tex); return c && !c.vars.size ? c.f({}) : NaN; };
// a polynomial in one letter, as a function of that letter
function poly(tex) {
  const c = compile(tex);
  if (!c || c.vars.size !== 1) throw new Error(`not a polynomial in one letter: ${tex}`);
  const v = [...c.vars][0];
  return (x) => c.f({ [v]: x });
}
// coefficients [a, b, c, d] of a polynomial of degree at most 3 (checked)
function coeffs(f) {
  const d = f(0), f1 = f(1), fm = f(-1), f2 = f(2);
  const b = (f1 + fm) / 2 - d, s = (f1 - fm) / 2;
  const a = (f2 - 4 * b - d - 2 * s) / 6, c = s - a;
  for (const x of [3, -2.5, 7]) if (!near(a * x ** 3 + b * x * x + c * x + d, f(x))) return null;
  return [a, b, c, d];
}
const degree = (f) => {
  for (const x of [-2, -1, -0.5, 0, 0.5, 1, 2]) if (!Number.isFinite(f(x))) return NaN;
  const cs = coeffs(f);
  if (cs) { const k = cs.findIndex((v) => Math.abs(v) > 1e-12); return k < 0 ? 0 : 3 - k; }
  return Math.round(Math.log10(Math.abs(f(1000))) / 3);
};
// the distinct real zeroes
function zeroes(f) {
  const cs = coeffs(f);
  if (!cs) throw new Error('degree above 3');
  const [a, b, c] = cs;
  const quad = (A, B, C) => {
    if (Math.abs(A) < 1e-12) return Math.abs(B) < 1e-12 ? [] : [-C / B];
    const D = B * B - 4 * A * C;
    if (D < -1e-12) return [];
    if (Math.abs(D) <= 1e-12) return [-B / (2 * A)];
    return [(-B - Math.sqrt(D)) / (2 * A), (-B + Math.sqrt(D)) / (2 * A)];
  };
  if (Math.abs(a) < 1e-12) return quad(b, c, cs[3]);
  const out = [];
  const bisect = (lo, hi) => { for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (Math.sign(f(m)) === Math.sign(f(lo))) lo = m; else hi = m; } return (lo + hi) / 2; };
  let prev = f(-60);
  for (let x = -60; x < 60; x += 0.001) {
    const y = f(x + 0.001);
    if (prev === 0) out.push(x);
    else if (Math.sign(y) !== Math.sign(prev) && y !== 0) out.push(bisect(x, x + 0.001));
    prev = y;
  }
  for (const r of quad(3 * a, 2 * b, c)) if (Math.abs(f(r)) < 1e-9) out.push(r);
  return out.sort((p, q) => p - q).filter((v, i, s) => i === 0 || Math.abs(v - s[i - 1]) > 1e-6).map((v) => {
    const r = Math.round(v * 1e6) / 1e6; return Math.abs(f(r)) < 1e-9 ? r : v;
  });
}
const sumP = (f) => { const [a, b, c, d] = coeffs(f); return Math.abs(a) > 1e-12 ? [-b / a, c / a, -d / a] : [-c / b, d / b]; };

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter((f) => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map((f) => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const md = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter((f) => /^p0/.test(f)).map((f) => html[f]).join('\n');
const beyond = pages.filter((f) => /^p1/.test(f)).map((f) => html[f]).join('\n');
const noSvg = (s) => s.replace(/<svg[\s\S]*?<\/svg>/g, ' ');
const text = (s) => noSvg(s).replace(/<span class="nb">([^<]*)<\/span>/g, '$1')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/&middot;/g, '·').replace(/\s+/g, ' ');
const spansOf = (s) => [...s.replace(/\$\$/g, '$').matchAll(/\$([^$]+)\$/g)].map((m) => m[1]);
// every number a stretch of text states: maths spans by their last side, and bare numerals
function values(s) {
  const out = [];
  const t = s.replace(/\$\$/g, '$').replace(/\([a-d]\)|\((?:i|ii|iii|iv|v|vi)\)/g, ' ');
  for (const part of t.split(/(\$[^$]+\$)/)) {
    if (part.startsWith('$')) {
      for (const side of part.slice(1, -1).split('=')) for (const piece of side.replace(/^\s*\((.*)\)\s*$/, '$1').split(',')) { const v = num(piece); if (Number.isFinite(v)) out.push(v); }
    } else for (const m of part.matchAll(/(?<![\w.^])-?\d+(?:\.\d+)?(?!\w|\.\d)/g)) out.push(Number(m[0]));
  }
  return out;
}
const hasAll = (what, s, ...want) => { for (const w of want) is(`${what} should state ${w}: "${s.trim().slice(0, 160)}"`, values(s).some((v) => near(v, w))); };

/* ---- A. every identity ---------------------------------------- */

function splitParts(span) {
  const out = []; let depth = 0, cur = '';
  for (let i = 0; i < span.length; i++) {
    const ch = span[i];
    if ('({['.includes(ch)) depth++;
    if (')}]'.includes(ch)) depth--;
    if (depth === 0 && ch === ',' && /=/.test(cur) && /=/.test(span.slice(i + 1))) { out.push(cur); cur = ''; continue; }
    const q = span.slice(i).match(/^\\q?quad/);
    if (depth === 0 && q) { out.push(cur); cur = ''; i += q[0].length - 1; continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
}
let spans = 0, idents = 0; const skipped = [];
const sources = [...pages.map((f) => [f, noSvg(html[f])]), ['ANSWERS.md', md]];
for (const [f, raw] of sources) {
  for (const span of spansOf(raw)) {
    if (!span.includes('=') || /\\neq|\\leq|\\geq|\\lt|\\gt|<|>|\\pm/.test(span)) continue;
    for (const part of splitParts(span.replace(/^\{(.*)\}$/, '$1'))) {
      const sides = part.split('=').map((s) => s.trim()).filter(Boolean);
      if (sides.length < 2) continue;
      const cs = sides.map(compile).filter(Boolean);
      const numeric = cs.filter((c) => !c.vars.size);
      const groups = {};
      for (const c of cs.filter((c) => c.vars.size)) (groups[[...c.vars].sort().join('')] ||= []).push(c);
      let checked = false;
      if (numeric.length >= 2) {
        const v = numeric.map((c) => c.f({}));
        if (v.every(Number.isFinite)) {
          checked = true; spans++;
          if (v.some((x) => !near(x, v[0]))) fails.push(`${f}: $${part.trim()}$ — sides are ${v.join(' and ')}`); else pass++;
        }
      }
      for (const g of Object.values(groups)) {
        if (g.length < 2) continue;
        const rows = ENVS.map((e) => g.map((c) => c.f(e)));
        if (!rows.flat().every(Number.isFinite)) continue;
        checked = true; idents++;
        if (rows.some((r) => r.some((x) => !near(x, r[0])))) fails.push(`${f}: $${part.trim()}$ — not an identity`); else pass++;
      }
      if (!checked) skipped.push(`${f}: $${part.trim()}$`);
    }
  }
}
// p(k) against the p(x) last defined before it
let pvals = 0;
for (const [f, raw] of [['pages', pages.map((p) => noSvg(html[p])).join('\n')], ['ANSWERS.md', md]]) {
  let P = null;
  for (const span0 of spansOf(raw)) {
    const span = span0.replace(/\\left|\\right/g, '').trim();
    const def = span.match(/^p\(x\)\s*=\s*([^=]+)$/);
    if (def) {
      const c = compile(def[1]);
      if (c && c.vars.has('x')) P = c.vars.size === 1 ? (x) => c.f({ x }) : null;
      continue;
    }
    const call = span.match(/^p\(((?:[^()]|\([^()]*\))*)\)\s*=(.*)$/);
    if (!call || !P) continue;
    const k = num(call[1]);
    if (!Number.isFinite(k)) continue;
    for (const side of call[2].split('=')) {
      const v = num(side);
      if (!Number.isFinite(v)) continue;
      pvals++;
      okNum(`${f}: $${span}$ — p(${call[1]})`, P(k), v);
    }
  }
}

// an equation in one letter, and the "letter = value" that follows it
let solved = 0;
for (const [f, raw] of sources) {
  const list = spansOf(raw).map((s) => s.replace(/^\{(.*)\}$/, '$1'));
  list.forEach((span, i) => {
    const sides = span.split('=');
    if (sides.length !== 2 || /\\neq|\\pm/.test(span)) return;
    const [l, r] = sides.map(compile);
    if (!l || !r) return;
    const vs = new Set([...l.vars, ...r.vars]);
    if (vs.size !== 1 || (l.vars.size && r.vars.size)) return;
    const v = [...vs][0];
    if (/^\s*[a-zα-γ]\s*$/.test(sides[0]) || /^\s*[a-zα-γ]\s*$/.test(sides[1])) return;   // it is itself "x = 3"
    const g = (x) => l.f({ [v]: x }) - r.f({ [v]: x });
    if (!coeffs(g)) return;
    const sols = zeroes(g);
    const answers = list.slice(i + 1, i + 4).map((s) => s.match(new RegExp(`^\\s*${v}\\s*=\\s*([^=]+)$`))).filter(Boolean).map((m) => num(m[1])).filter(Number.isFinite);
    if (!answers.length) return;
    solved++;
    is(`${f}: $${span}$ is solved by what follows (${answers}), solutions ${sols}`, answers.some((a) => sols.some((s) => near(s, a))));
  });
}

/* ---- F. the figures ------------------------------------------- */

const uni = (s) => s.replace(/−/g, '-').replace(/²/g, '^2').replace(/³/g, '^3');
const figs = {};
for (const m of body.concat(beyond).matchAll(/(<svg[\s\S]*?<\/svg>)\s*<figcaption><span class="fignum">Fig\. ([\d.]+)<\/span>([\s\S]*?)<\/figcaption>/g)) figs[m[2]] = { svg: m[1], caption: m[3] };
is('Figs. 2.1 to 2.11 are all present', [...Array(11)].every((_, i) => figs[`2.${i + 1}`]));
function panels(svg) {
  const parts = svg.split(/(?=<path class="dg-axis")/).slice(1);
  return parts.map((p) => {
    const ax = p.match(/d="M([\d.]+) ([\d.]+)H([\d.]+) M([\d.]+) ([\d.]+)V([\d.]+)"/).slice(1).map(Number);
    const ticks = [...p.matchAll(/<text class="dg-tick" x="([\d.]+)" y="([\d.]+)" text-anchor="(\w+)">([^<]*)<\/text>/g)]
      .map((t) => ({ x: +t[1], y: +t[2], anchor: t[3], v: Number(uni(t[4])) })).filter((t) => Number.isFinite(t.v));
    const plot = [...p.matchAll(/class="dg-plot" d="([^"]+)"/g)].flatMap((d) => d[1].split(/(?=M)/).map((seg) => [...seg.matchAll(/([\d.]+) ([\d.]+)/g)].map((q) => [+q[1], +q[2]])));
    const circles = [...p.matchAll(/<circle[^>]*cx="([\d.]+)" cy="([\d.]+)"/g)].map((c) => [+c[1], +c[2]]);
    const labels = [...p.matchAll(/<text class="dg-label dg-label--sm"[^>]*>\(([^,<]+), ([^)<]+)\)<\/text>/g)].map((l) => [l[1], l[2]].map((v) => num(uni(v))));
    const note = (p.match(/<text class="dg-note"[^>]*>([^<]*)<\/text>/) || [])[1] || '';
    const xa = ax[3], ya = ax[1];
    const xt = ticks.filter((t) => t.anchor === 'middle' && Math.abs(t.y - ya - 9) < 0.6);
    const yt = ticks.filter((t) => !xt.includes(t));
    const sx = xt.length ? xt.reduce((s, t) => s + (t.x - xa) / t.v, 0) / xt.length : NaN;
    const sy = yt.length ? yt.reduce((s, t) => s + (ya - (t.y - 3)) / t.v, 0) / yt.length : NaN;
    for (const t of xt) is(`x tick ${t.v} is where the scale puts it`, Math.abs(xa + sx * t.v - t.x) < 0.3);
    for (const t of yt) is(`y tick ${t.v} is where the scale puts it`, Math.abs(ya - sy * t.v - (t.y - 3)) < 0.3);
    return { xa, ya, sx, sy, plot, circles, labels, note };
  });
}
// where a drawn curve meets its axis: a run of points on the axis counts once
function meetings(pn, eps = 0.5) {
  const out = [];
  for (const seg of pn.plot) {
    let run = null, prevSign = 0, prevPt = null;
    for (const [x, y] of seg) {
      const d = pn.ya - y;
      if (Math.abs(d) < eps) { (run ||= []).push(x); continue; }
      const sg = Math.sign(d);
      if (run) { out.push(run.reduce((a, b) => a + b, 0) / run.length); run = null; }
      else if (prevSign && sg !== prevSign) { const [px, py] = prevPt; const pd = pn.ya - py; out.push(px + (x - px) * pd / (pd - d)); }
      prevSign = sg; prevPt = [x, y];
    }
    if (run) out.push(run.reduce((a, b) => a + b, 0) / run.length);
  }
  return out;
}
function graphCheck(name, pn, f) {
  const X = (px) => (px - pn.xa) / pn.sx, Ypx = (v) => pn.ya - pn.sy * v;
  const off = pn.plot.flat().length ? Math.max(...pn.plot.flat().map(([px, py]) => Math.abs(py - Ypx(f(X(px)))))) : Infinity;
  is(`${name}: the drawn curve lies on its equation (worst ${off.toFixed(2)} px)`, off < 1.2);
  for (const [cx, cy] of pn.circles) is(`${name}: the marked point at (${cx}, ${cy}) is on the curve`, Math.abs(cy - Ypx(f(X(cx)))) < 1.2);
  for (const [a, b] of pn.labels) {
    is(`${name}: the label (${a}, ${b}) marks a point`, pn.circles.some(([cx, cy]) => Math.abs(cx - (pn.xa + pn.sx * a)) < 1 && Math.abs(cy - Ypx(b)) < 1));
    okNum(`${name}: the label (${a}, ${b}) is on y = p(x)`, f(a), b);
  }
  const met = meetings(pn).map(X).sort((a, b) => a - b);
  const z = zeroes(f);
  is(`${name}: where the graph meets the x-axis (${met}) is at the zeroes of its polynomial (${z.map((v) => +v.toFixed(3))})`, met.length === z.length && met.every((v, i) => Math.abs(v - z[i]) < 0.08));
  return z.map((v) => Math.round(v * 1e9) / 1e9);
}
const sketchCounts = (fig) => panels(figs[fig].svg).map((pn) => meetings(pn).length);

// grid figures, each against the equation its own caption or panel prints
for (const fig of ['2.1', '2.2', '2.6']) {
  const eq = spansOf(figs[fig].caption)[0].split('=')[1];
  graphCheck(`Fig. ${fig}`, panels(figs[fig].svg)[0], poly(eq));
}
for (const pn of panels(figs['2.7'].svg)) graphCheck(`Fig. 2.7 ${pn.note}`, pn, poly(uni(pn.note.split('=')[1])));
// the sketches: the caption says how many zeroes
for (const fig of ['2.3', '2.4', '2.5']) {
  const want = { Two: 2, One: 1, No: 0 }[text(figs[fig].caption).trim().split(' ')[0]];
  const got = sketchCounts(fig);
  is(`Fig. ${fig}: each sketch meets its axis ${want} times (drawn: ${got})`, got.length === 2 && got.every((n) => n === want));
}

/* ---- the examples, by number ---------------------------------- */

function examples(src) {
  const out = {};
  for (const m of src.matchAll(/<div class="c-example__tab">Example (\d+)<\/div>([\s\S]*?)(?=<div class="c-example__tab">|<div class="c-practice|<div class="c-stage|$)/g)) {
    const b = m[2];
    const row = (label) => { const r = b.match(new RegExp(`<span class="work__label">${label}</span>\\s*<span>([\\s\\S]*?)</span>`)); return r ? r[1] : ''; };
    out[m[1]] = { q: (b.match(/<p>([\s\S]*?)<\/p>/) || [])[1] || '', opts: [...((b.match(/<ol class="c-parts[^"]*">([\s\S]*?)<\/ol>/) || [])[1] || '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map((x) => x[1]), answer: row('Answer'), row, all: b };
  }
  return out;
}
const bx = examples(body);
const ex = examples(beyond);
const firstPoly = (s) => spansOf(s).map((t) => t.split('=').at(-1)).find((t) => { const c = compile(t); return c && c.vars.size === 1 && 'xstu'.includes([...c.vars][0]); });
const letter = (s) => (text(s).match(/\(([a-d])\)/) || [])[1];

/* ---- F, continued: the graphs the examples and questions read --- */

// Fig. 2.8 against Example 1's answer row; Fig. 2.9 against ANSWERS.md
const romanList = (s) => [...text(s).matchAll(/\((?:i|ii|iii|iv|v|vi)\)\s*(\d+)/g)].map((m) => Number(m[1]));
{
  const got = sketchCounts('2.8'), want = romanList(bx[1].answer);
  is(`Fig. 2.8: each sketch meets its axis as Example 1's answer says (drawn ${got}, printed ${want})`, want.length === 6 && got.join() === want.join());
  const mdEx1 = romanList(md.slice(md.indexOf('### Example 1'), md.indexOf('### Exercise Set 2.1')));
  is(`ANSWERS.md Example 1 matches Fig. 2.8 (${mdEx1})`, mdEx1.join() === got.join());
  const got9 = sketchCounts('2.9');
  const want9 = [...md.slice(md.indexOf('### Exercise Set 2.1'), md.indexOf('## 2.3')).matchAll(/- \((?:i|ii|iii|iv|v|vi)\) (\d+)/g)].map((m) => Number(m[1]));
  is(`Fig. 2.9: each sketch meets its axis as ANSWERS.md says (drawn ${got9}, printed ${want9})`, want9.length === 6 && got9.join() === want9.join());
}
// Fig. 2.10 against Beyond Example 3, which reads its zeroes off it
{
  const e = ex[3];
  const ans = e.answer.match(/\$p\(x\) = ([^$]+)\$/)[1];
  const met = graphCheck('Fig. 2.10', panels(figs['2.10'].svg)[0], poly(ans));
  okSet('Beyond Ex 3: the zeroes read off the graph', values(e.row('Step 1').split('zeroes are')[1]), met);
  okSet('Beyond Ex 3: the zeroes in the answer', values(e.answer.split(';')[0]), met);
  const b = num(e.answer.match(/\$b = ([^$]+)\$/)[1]), c = num(e.answer.match(/\$c = ([^$]+)\$/)[1]);
  const [A, B, C] = coeffs(poly(ans)).slice(1);
  is('Beyond Ex 3: b and c are the coefficients of p(x)', A === 1 && near(B, b) && near(C, c));
  okNum('Beyond Ex 3: b from the sum', -met.reduce((s, v) => s + v, 0), b);
  okNum('Beyond Ex 3: c from the product', met.reduce((s, v) => s * v, 1), c);
}

/* ---- B. the body ----------------------------------------------- */

// tables of values, against the equation in their caption
for (const m of body.concat(beyond).matchAll(/<caption>Table [\d.]+ Values of \$y = ([^$]+)\$<\/caption>\s*<thead><tr>([\s\S]*?)<\/tr><\/thead>\s*<tbody><tr>([\s\S]*?)<\/tr>/g)) {
  const f = poly(m[1]);
  const xs = [...m[2].matchAll(/<th>\$([^$]+)\$<\/th>/g)].map((x) => num(x[1])).filter(Number.isFinite);
  const ys = [...m[3].matchAll(/<td>\$([^$]+)\$<\/td>/g)].map((x) => num(x[1])).filter(Number.isFinite);
  is(`Table for y = ${m[1]} has a value under every x`, xs.length > 3 && ys.length === xs.length);
  xs.forEach((x, i) => okNum(`Table for y = ${m[1]} at x = ${x}`, f(x), ys[i]));
}
{
  const t = text(body);
  okNum('Fig. 2.1 points: y = 2x + 3 at -2 and 2', poly('2x + 3')(-2) + poly('2x + 3')(2), -1 + 7);
  // "the zeroes of POLY are A and B" wherever the prose says it
  let said = 0;
  for (const m of noSvg(body).matchAll(/zeroes of (?:the (?:quadratic |cubic )?polynomial )?\$([^$]+)\$ are ((?:\$[^$]+\$|[^.,$])+)/g)) {
    if (!compile(m[1]) || !values(m[2]).length) continue;
    said++;
    okSet(`body: the zeroes of ${m[1]}`, values(m[2]), zeroes(poly(m[1])));
  }
  is(`body states the zeroes of three polynomials in prose (found ${said})`, said >= 3);
  okSet('body: the zeroes of x^2 - 3x - 4 from p(-1) and p(4)', [-1, 4], zeroes(poly('x^2 - 3x - 4')));
  okSet('body: 4, -2, 1/2 are the zeroes of 2x^3 - 5x^2 - 14x + 8', values(t.match(/for \$x = 4\$[^.]*?(?=\. )/)[0]), zeroes(poly('2x^3 - 5x^2 - 14x + 8')));
  okSet('body: -2, 0, 2 are the zeroes of x^3 - 4x', values(t.match(/Table 2\.2, ([^.]*?) are zeroes/)[1]), zeroes(poly('x^3 - 4x')));
}
// the body examples
okSet('Example 2: the zeroes', values(bx[2].answer), zeroes(poly(firstPoly(bx[2].q))));
okSet('Example 3: the zeroes', values(bx[3].answer), zeroes(poly(firstPoly(bx[3].q))));
{
  const [S, P] = values(bx[4].q);
  const f = poly(firstPoly(bx[4].answer));
  okNum('Example 4: the sum of the zeroes of the answer', sumP(f)[0], S);
  okNum('Example 4: the product of the zeroes of the answer', sumP(f)[1], P);
}
{
  const f = poly(bx[5].q.match(/\$p\(x\) = ([^$]+)\$/)[1]);
  okSet('Example 5: the zeroes asked about are the zeroes', values(bx[5].q.split('are the zeroes')[0]), zeroes(f));
  okSet('Example 5: the zeroes in the answer', values(bx[5].answer), zeroes(f));
  const [s, pr, prod] = sumP(f);
  hasAll('Example 5 Step 6', bx[5].row('Step 6'), s);
  hasAll('Example 5 Step 7', bx[5].all.split('Step 7')[1].split('Step 8')[0], pr);
  hasAll('Example 5 Step 8', bx[5].row('Step 8'), prod);
}
// Exercise Set 2.2 in ANSWERS.md, against the questions as the page prints them
{
  const setQ = body.slice(body.indexOf('Exercise Set 2.2'));
  const q1 = [...setQ.match(/<ol class="c-parts[^"]*">([\s\S]*?)<\/ol>/)[1].matchAll(/<li>\$([^$]+)\$<\/li>/g)].map((m) => m[1]);
  const q2 = [...setQ.split('data-start="2"')[1].match(/<ol class="c-parts[^"]*">([\s\S]*?)<\/ol>/)[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => spansOf(m[1]).map(num));
  is('Exercise Set 2.2 has six parts to each question', q1.length === 6 && q2.length === 6);
  const romans = ['i', 'ii', 'iii', 'iv', 'v', 'vi'];
  const mdSet = md.slice(md.indexOf('### Exercise Set 2.2'), md.indexOf('## Beyond the Book'));
  const mdPart = (q, r) => {
    const sec = mdSet.slice(mdSet.indexOf(`\n${q}. `), q === 1 ? mdSet.indexOf('\n2. ') : undefined);
    const m = sec.match(new RegExp(`\\(${r}\\)([\\s\\S]*?)(?=- \\((?:i|ii|iii|iv|v|vi)\\)|\\n\\s*\\n|$)`));
    return m ? m[1] : '';
  };
  q1.forEach((p, i) => {
    const f = poly(p), part = mdPart(1, romans[i]);
    okSet(`Ex 2.2 Q1(${romans[i]}): the zeroes of ${p}`, values(part.match(/Zeroes: (.*?)\./)[1]), zeroes(f));
    const [S, P] = sumP(f);
    okNum(`Ex 2.2 Q1(${romans[i]}): the sum`, values(part.match(/Sum (\$[^$]+\$)/)[1])[0], S);
    okNum(`Ex 2.2 Q1(${romans[i]}): the product`, values(part.match(/product (\$[^$]+\$)/)[1])[0], P);
    const fac = spansOf(part)[0].split('=');
    for (const x of [-1.3, 0.7, 2.9]) okNum(`Ex 2.2 Q1(${romans[i]}): the factorisation is the polynomial on the page`, poly(fac[1])(x), f(x));
  });
  q2.forEach(([S, P], i) => {
    const part = mdPart(2, romans[i]);
    const f = poly(part.match(/Polynomial: \$([^$]+)\$/)[1]);
    const [s, p] = sumP(f);
    okNum(`Ex 2.2 Q2(${romans[i]}): the sum of the zeroes`, s, S);
    okNum(`Ex 2.2 Q2(${romans[i]}): the product of the zeroes`, p, P);
    is(`Ex 2.2 Q2(${romans[i]}): quadratic`, degree(f) === 2);
  });
}
// Example 4's k(x^2 + 3x + 2) note, as ANSWERS.md argues it
{
  const a = 2.7;
  okSet('ANSWERS.md: a(x^2 + 3x + 2) has the sum and product of Example 4', sumP((x) => a * (x * x + 3 * x + 2)).slice(0, 2), values(bx[4].q));
}

// "a = 3, b = -5 ..." against the coefficients of the polynomial they name
function coefRow(what, s, f) {
  const cs = coeffs(f), got = {};
  for (const m of s.matchAll(/\$([abcd]) = ([^$]+)\$/g)) got[m[1]] = num(m[2]);
  const k = Object.keys(got);
  is(`${what}: names coefficients`, k.length >= 3);
  const lead = cs[0] !== 0 ? 0 : 1;
  for (const [j, name] of ['a', 'b', 'c', 'd'].entries()) if (name in got) okNum(`${what}: ${name}`, got[name], cs[lead + j]);
}
coefRow('Example 5 Step 1', bx[5].row('Step 1'), poly(bx[5].q.match(/\$p\(x\) = ([^$]+)\$/)[1]));

/* ---- B. Beyond: Stage 1 and the Solved Examples ---------------- */

{
  const s1 = text(beyond.slice(0, beyond.indexOf('Solved Examples')));
  okSet('Stage 1 Q1: the zeroes of x^2 - 5x + 6', values(s1.match(/The zeroes are in fact ([^,]*),/)[1]), zeroes(poly('x^2 - 5x + 6')));
  okNum('Stage 1 Q1: alpha^2 + beta^2', zeroes(poly('x^2 - 5x + 6')).reduce((s, v) => s + v * v, 0), values(s1.match(/gives (\$[^$]+\$)/)[1])[0]);
  {
    const k = num(s1.match(/So \$k = ([^$]+)\$/)[1]);
    const f = (x) => x * x + k * x - 12;
    is(`Stage 1 Q2: 3 is a zero when k = ${k}`, near(f(3), 0));
    okSet('Stage 1 Q2: the zeroes are 3 and the other zero', zeroes(f), [3, values(s1.match(/the other zero is (\$[^$]+\$)/)[1])[0]]);
  }
  {
    const qz = values(s1.match(/Find a quadratic polynomial whose zeroes are (\$[^$]+\$ and \$[^$]+\$)/)[1]);
    const ans = s1.match(/So one such polynomial is \$\{?([^${}]+)\}?\$\. The zeroes of/)[1];
    okSet(`Stage 1 Q4: the zeroes of ${ans}`, zeroes(poly(ans)), qz);
  }
  {
    const ans = [...s1.matchAll(/So one such polynomial is \$\{?([^${}]+)\}?\$\./g)].at(-1)[1];
    okSet(`Stage 1 Q5: the zeroes of ${ans} are twice those of x^2 + 3x + 2`, zeroes(poly(ans)), zeroes(poly('x^2 + 3x + 2')).map((v) => 2 * v));
  }
}
{
  const e = ex[1];
  const f = poly(e.q.match(/\$p\(x\) = ([^$]+)\$/)[1]);
  is(`Beyond Ex 1: the degree is ${degree(f)}`, new RegExp(`Degree ${degree(f)};`).test(text(e.answer)));
  const [z, nz] = [2, -1];
  is('Beyond Ex 1: 2 is a zero and -1 is not', near(f(z), 0) && !near(f(nz), 0) && /so 2 is a zero and \$-1\$ is not/.test(e.answer));
  const lin = e.q.match(/find the zero of \$([^$]+)\$/)[1];
  okSet(`Beyond Ex 1: the zero of ${lin}`, zeroes(poly(lin)), [values(e.answer.split(`zero of $${lin}$ is`)[1])[0]]);
}
okSet('Beyond Ex 4: the zeroes', values(ex[4].answer), zeroes(poly(firstPoly(ex[4].q))));
{
  const qz = values(ex[6].q.split('whose zeroes are')[1]);
  const f = poly(firstPoly(ex[6].answer));
  okSet('Beyond Ex 6: the zeroes of the answer', zeroes(f), qz);
  is('Beyond Ex 6: integer coefficients', coeffs(f).every((c) => Number.isInteger(Math.round(c * 1e9) / 1e9)));
}
{
  const [a, b] = zeroes(poly(firstPoly(ex[8].q)));
  okNum('Beyond Ex 8: alpha/beta + beta/alpha', a / b + b / a, values(ex[8].answer).at(-1));
  okSet('Beyond Ex 8: alpha + beta and alpha beta', [a + b, a * b], values(ex[8].row('Step 1')));
}
{
  const k = values(ex[10].answer)[0];
  const target = values(text(ex[10].q))[0];
  okNum(`Beyond Ex 10: with k = ${k} the squares of the zeroes add to the given number`, zeroes((x) => x * x - 8 * x + k).reduce((s, v) => s + v * v, 0), target);
  okSet('Beyond Ex 10: the check factorises it', zeroes((x) => x * x - 8 * x + k), [2, 6]);
}
okSet('Beyond Ex 11: the zeroes named after it', zeroes(poly(firstPoly(ex[11].q))), values(text(ex[11].all).match(/The zeroes are ([^.]*)\./)[1]));
coefRow('Beyond Ex 11 Step 1', ex[11].row('Step 1'), poly(firstPoly(ex[11].q)));
coefRow('Beyond Ex 12 Step 4', `$a = 1$ ${ex[12].row('Step 4')}`, poly(firstPoly(ex[12].answer)));
okSet('Beyond Ex 12: the zeroes of the answer', zeroes(poly(firstPoly(ex[12].answer))), values(ex[12].q));
is('Beyond Ex 12: its coefficient of x^3 is 1', coeffs(poly(firstPoly(ex[12].answer)))[0] === 1);
is('Beyond examples numbered 1-13', Object.keys(ex).join() === [...Array(13)].map((_, i) => i + 1).join());

/* ---- C. multiple choice, examples and practice ----------------- */

const optVal = (s) => values(s.replace(/\$\s*(only|or)\s*\$?/g, ' $1 '));
const zs = (tex) => zeroes(poly(tex));
const exSolve = {
  2: (o) => { const f = poly(firstPoly(ex[2].q)); const n = zeroes(f).length; const [, A2, B2, C2] = coeffs(f); const touch = n === 1 && Math.abs(B2 ** 2 - 4 * A2 * C2) < 1e-9;
    return o.map((s) => (/two points/.test(s) ? n === 2 && !touch : /touches.*one point/.test(s) ? touch : /does not meet/.test(s) ? n === 0 : /three/.test(s) ? n === 3 : false)); },
  5: (o) => o.map((s) => sameSet(zs(spansOf(s)[0]), values(ex[5].q))),
  7: (o) => { const [a, b] = zs(firstPoly(ex[7].q)); return o.map((s) => near(values(s)[0], a * a * b + a * b * b)); },
  9: (o) => { const ks = []; for (let k = -30; k <= 30; k++) { const z = zeroes((x) => x * x - k * x + 6); if (z.length === 2 && (near(z[0] / z[1], 1.5) || near(z[1] / z[0], 1.5))) ks.push(k); }
    return o.map((s) => sameSet(values(s), ks)); },
  11: (o) => { const [a, b, c] = zs(firstPoly(ex[11].q)); return o.map((s) => near(values(s)[0], a * b + b * c + c * a)); },
};
for (const [n, f] of Object.entries(exSolve)) {
  const o = ex[n].opts;
  is(`Beyond Ex ${n} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  is(`Beyond Ex ${n}: exactly one right option (${right}), and the answer says (${letter(ex[n].answer)})`, right.length === 1 && right[0] === letter(ex[n].answer));
}

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] = m[2];
const qText = (n) => (qs[n] || '').replace(/<ol[\s\S]*$/, '');
const optsOf = (n) => [...((qs[n] || '').match(/<ol class="c-parts[^"]*">([\s\S]*?)<\/ol>/) || ['', ''])[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((x) => x[1]);
const qPoly = (n) => poly(firstPoly(qText(n)));
const key = {};
{
  const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2];
}
const single = (o) => values(o)[0];
const solve = {
  1: (o) => o.map((s) => single(s) === degree(qPoly(1))),
  2: (o) => o.map((s) => { const c = compile(spansOf(s)[0]); const f = (x) => c.f({ x }); return degree(f) === 2; }),
  3: (o) => o.map((s) => sameSet([single(s)], zeroes(qPoly(3)))),
  4: (o) => o.map((s) => near(single(s), sumP(qPoly(4))[0])),
  5: (o) => o.map((s) => near(single(s), sumP(qPoly(5))[1])),
  6: (o) => { const n = { two: 2, three: 3, one: 1 }[text(qText(6)).match(/at exactly (\w+) points?/)[1]]; return o.map((s) => single(s) === n); },
  7: (o) => { const [S, P] = values(qText(7)); return o.map((s) => { const [a, b] = sumP(poly(spansOf(s)[0])); return near(a, S) && near(b, P); }); },
  8: (o) => { const z = values(qText(8)).at(-1); const S = sumP((x) => x * x - 6 * x)[0]; const other = S - z; const k = z * other;
    return o.map((s) => { const v = values(s); return near(v[0], other) && near(v[1], k); }); },
  9: (o) => { const [a, b] = zeroes(qPoly(9)); return o.map((s) => near(single(s), a * a + b * b)); },
  10: (o) => { const [a, b] = zeroes(qPoly(10)); return o.map((s) => near(single(s), 1 / a + 1 / b)); },
  11: (o) => o.map((s) => {   // true for every quadratic whose zeroes multiply to 1
    const [l, r] = spansOf(s)[0].split('=').map(compile);
    return [[2, 0.5, 3], [-1.5, 4, 1.25], [5, -2, -0.5]].every(([A, z1]) => { const z2 = 1 / z1; const e = { a: A, b: -A * (z1 + z2), c: A }; return near(l.f(e), r.f(e)); });
  }),
  12: (o) => { const f = qPoly(12); const t = text(qText(12));
    const kiran = sameSet(zeroes(f), values(t.match(/zeroes of \$[^$]+\$ are ([^.]*)\./)[1]));
    const [S, P] = values(t.match(/sum of its zeroes is (.*)\. Who/)[1]);
    const lata = near(sumP(f)[0], S) && near(sumP(f)[1], P);
    const want = kiran && lata ? 'both' : kiran ? 'only Kiran' : lata ? 'only Lata' : 'neither';
    return o.map((s) => text(s).trim() === want); },
  13: (o) => o.map((s) => near(single(s), sumP(qPoly(13))[2])),
  14: (o) => o.map((s) => single(s) === zeroes((x) => (x - 1) ** 2 * (x + 2)).length && /\(x - 1\)\^2\(x \+ 2\)/.test(qText(14))),
  15: (o) => o.map((s) => { const k = single(s); const f = (x) => k * x * x + 2 * x + 3 * k; const [S, P] = sumP(f); return near(S, P); }),
  16: (o) => o.map((s) => { const n = /three/.test(s) ? 3 : /two/.test(s) ? 2 : /one/.test(s) ? 1 : 0; return n > 2; }),
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  is(`Q${q}: exactly one right option (${right}), and the key prints (${key[q]})`, right.length === 1 && right[0] === key[q]);
}
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const A = (n) => text(qs[n] || '').match(/Assertion \(A\): (.*?) Reason/)[1];
const AR = {
  17: [zeroes(poly(firstPoly(A(17)))).length === 0, Math.min(...[-3, -1, 0, 1, 3].map(poly(firstPoly(A(17))))) > 0, true],
  18: [near(sumP(poly(firstPoly(A(18))))[0], values(A(18)).at(-1)), true, false],
  19: [zeroes(poly(firstPoly(A(19)))).length === 3, zeroes((x) => x ** 3).length === 3, false],
  20: [near(sumP(poly(firstPoly(A(20))))[1], values(A(20)).at(-1)), true, false],
};
for (const [q, v] of Object.entries(AR)) is(`Q${q}: assertion-reason is (${arLetter(v)}), the key prints (${key[q]})`, arLetter(v) === key[q]);
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every((l) => letters.filter((x) => x === l).length >= 3));
is('key covers 1-20', Object.keys(key).map(Number).sort((a, b) => a - b).join() === [...Array(20)].map((_, i) => i + 1).join());
is('practice numbered 1-32, no repeats', [1, ...[...beyond.matchAll(/data-start="(\d+)"/g)].map((m) => Number(m[1]))].join() === [...Array(32)].map((_, i) => i + 1).join());

/* ---- B. the practice answers, out of the key rows -------------- */

const keyRows = {};
{
  const k = beyond.slice(beyond.indexOf('<ol class="c-answers">'));
  for (const m of k.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= m[2];
}
const part = (r, p) => { if (!p) return r; const m = r.match(new RegExp(`\\(${p}\\)([\\s\\S]*?)(?=\\([a-d]\\)|$)`)); return m ? m[1] : ''; };
const row = (q) => { const [, n, p] = String(q).match(/^(\d+)([a-d]?)$/); return part(keyRows[n] || '', p); };
const mdPractice = md.slice(md.indexOf('The working for each'));
const mdRow = (q) => {
  const [, n, p] = String(q).match(/^(\d+)([a-d]?)$/);
  const m = mdPractice.match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`));
  return part(m ? m[1] : '', p);
};
const both = (q, ...v) => { hasAll(`key ${q}`, row(q), ...v); hasAll(`ANSWERS.md ${q}`, mdRow(q), ...v); };
const polyIn = (s) => spansOf(s).map((t) => t.split('=').at(-1)).filter((t) => { const c = compile(t); return c && c.vars.size === 1 && [...c.vars][0] !== 'k'; });

both(21, poly(qText(21).match(/\$p\(x\) = ([^$]+)\$/)[1])(values(qText(21).split('at')[1])[0]));
{
  const [S, P] = values(qText(22));
  for (const [where, r] of [['key', row(22)], ['ANSWERS.md', mdRow(22).split('Check')[0]]]) {
    const ps = polyIn(r);
    is(`${where} 22 gives a polynomial`, ps.length >= 1);
    for (const p of ps) { const [s, pr] = sumP(poly(p)); is(`${where} 22: ${p} has sum ${S} and product ${P}`, near(s, S) && near(pr, P)); }
  }
}
{ const [a, b] = sumP(qPoly(23)); both(23, a + b); }
{
  // Fig. 2.11: read the zeroes off the drawing, and the polynomial from the key
  const kp = row(24).match(/\$p\(x\) = ([^$]+)\$/)[1];
  const met = graphCheck('Fig. 2.11', panels(figs['2.11'].svg)[0], poly(kp));
  okSet('key 24: the zeroes it reads off Fig. 2.11', values(text(row(24)).match(/The zeroes are (.*?)\./)[1]), met);
  okSet('ANSWERS.md 24: the zeroes it reads off Fig. 2.11', values(mdRow(24).match(/at (.*?)\. Sum/)[1]), met);
  const f = poly(kp);
  is('key 24: the coefficient of x^3 is 1, as the question says', coeffs(f)[0] === 1 && /coefficient of \$x\^3\$ is 1/.test(qText(24)));
  const [s, pr, prod] = [met.reduce((a, b) => a + b, 0), met[0] * met[1] + met[1] * met[2] + met[2] * met[0], met.reduce((a, b) => a * b, 1)];
  both(24, s, pr, prod);
  coefRow('ANSWERS.md 24', mdRow(24), f);
  is('ANSWERS.md 24 gives the same p(x)', mdRow(24).includes(`$p(x) = ${kp}$`));
}
{ const z = zeroes(qPoly(25)); both(25, ...z); const [s, p] = sumP(qPoly(25)); both(25, s, p); }
{ const [a, b] = zeroes(qPoly(26)); both(26, (a - b) ** 2); }
{
  const z = values(qText(27)).at(-1);
  const k = -(2 * z * z - 3 * z);
  const other = zeroes((x) => 2 * x * x - 3 * x + k).find((v) => !near(v, z));
  both(27, k, other);
}
{
  const [S, P2, P3] = values(qText(28));
  const f = (x) => x ** 3 - S * x * x + P2 * x - P3;
  const kp = polyIn(row(28))[0];
  for (const x of [-1.7, 0.4, 2.3]) okNum('key 28: the cubic has the given sum, pairs and product', poly(kp)(x), f(x));
  is('ANSWERS.md 28 gives the same cubic', mdRow(28).includes(`$${kp}$`));
  is('Q28: 1 is a zero', near(f(1), 0));
  both(28, ...zeroes(f));
}
{
  const f = qPoly(29); const z = zeroes(f);
  const a = z[1], b = z[2] - z[1];
  is('Q29: the zeroes are in step', z.length === 3 && near(z[1] - z[0], z[2] - z[1]));
  both(29, a, b, -b, ...z);
}
{
  const [a, b] = zeroes(qPoly(30));
  both('30a', a * a + b * b);
  for (const [where, r] of [['key', row('30b')], ['ANSWERS.md', mdRow('30b')]]) {
    const p = polyIn(r).at(-1);
    okSet(`${where} 30(b): the zeroes of ${p} are 1/alpha and 1/beta`, zeroes(poly(p)), [1 / a, 1 / b]);
  }
}
{
  const h = poly(qText(31).match(/\$h\(t\) = ([^$]+)\$/)[1]);
  const tab = qs[31].match(/<table>[\s\S]*?<\/table>/)[0];
  const ts = [...tab.match(/<thead>([\s\S]*?)<\/thead>/)[1].matchAll(/<th>(\d+)<\/th>/g)].map((m) => Number(m[1]));
  const hs = [...tab.match(/<tbody>([\s\S]*?)<\/tbody>/)[1].matchAll(/<td>(\d+)<\/td>/g)].map((m) => Number(m[1]));
  is('Q31: the table has a height for every time', ts.length === 4 && hs.length === 4);
  ts.forEach((t, i) => okNum(`Q31: the height at t = ${t}`, h(t), hs[i]));
  okNum('Q31: the building is as tall as h(0)', h(0), values(text(qText(31)))[0]);
  is(`Q31(a): degree ${degree(h)} is quadratic`, degree(h) === 2 && /quadratic, degree 2/.test(text(row('31a'))) && /quadratic, degree 2/.test(mdRow('31a')));
  both('31b', ...zeroes(h));
  const land = zeroes(h).filter((v) => v > 0);
  is('Q31(c): one positive zero', land.length === 1);
  both('31c', land[0]);
  const [s, p] = sumP(h);
  both('31d', s, p);
}
{
  const tab = qs[32].match(/<table>[\s\S]*?<\/table>/)[0];
  const xs = [...tab.match(/<thead>([\s\S]*?)<\/thead>/)[1].matchAll(/<th>\$([^$]+)\$<\/th>/g)].map((m) => num(m[1])).filter(Number.isFinite);
  const ps = [...tab.match(/<tbody>([\s\S]*?)<\/tbody>/)[1].matchAll(/<td>\$([^$]+)\$<\/td>/g)].map((m) => num(m[1])).filter(Number.isFinite);
  is('Q32: the table has a value for every x', xs.length === 5 && ps.length === 5);
  const b = num(row('32b').match(/\$b = ([^$]+)\$/)[1]), c = num(row('32b').match(/\$c = ([^$]+)\$/)[1]);
  const f = (x) => x * x + b * x + c;
  xs.forEach((x, i) => okNum(`Q32: p(${x}) with the key's b and c`, f(x), ps[i]));
  both('32a', ...zeroes(f));
  okSet('Q32(a): the table shows both zeroes', xs.filter((x, i) => ps[i] === 0), zeroes(f));
  hasAll('ANSWERS.md 32b', mdRow('32b'), b, c);
  both('32c', 0, f(0));
  both('32d', f(4));
}

/* ---- D. ANSWERS.md prints the same key ------------------------ */

{
  const s = md.indexOf('as the key prints it');
  const mdKey = {};
  for (const m of md.slice(s, md.indexOf('The working for each')).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2];
  is(`ANSWERS.md key matches the page (${JSON.stringify(mdKey)})`, JSON.stringify(mdKey) === JSON.stringify(key));
  for (const q of [17, 18, 19, 20]) is(`ANSWERS.md working ${q} gives the key's letter`, mdRow(q).trim().startsWith(`(${key[q]})`));
  // the MCQ working in ANSWERS.md states the right option's value
  both(4, sumP(qPoly(4))[0]); both(5, sumP(qPoly(5))[1]); both(9, zeroes(qPoly(9)).reduce((s, v) => s + v * v, 0));
  hasAll('ANSWERS.md 13', mdRow(13), sumP(qPoly(13))[2]);
  hasAll('ANSWERS.md 3', mdRow(3), zeroes(qPoly(3))[0]);
  hasAll('ANSWERS.md 8', mdRow(8), 4, 8);
  hasAll('ANSWERS.md 1', mdRow(1), degree(qPoly(1)));
  hasAll('ANSWERS.md 14', mdRow(14), ...zeroes((x) => (x - 1) ** 2 * (x + 2)));
  hasAll('ANSWERS.md Stage 1', md.slice(md.indexOf('### Stage 1'), md.indexOf('### Stage 2')), 13, -4, 1);
}

/* ---- report ---------------------------------------------------- */

console.log(`A  ${spans} arithmetic chains and ${idents} identities evaluated, ${pvals} values p(k) and ${solved} equations checked; ${skipped.length} spans not checkable, skipped`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
