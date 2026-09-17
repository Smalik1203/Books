#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed from the data a question or figure gives, and compared with what
   is on the page.

     node pages/class-10/ch08-trigonometry/check-numbers.mjs [--skipped] [--verbose]

   Four parts:
     A  every equation set as maths, on every page and in ANSWERS.md. The
        LaTeX is parsed (sin, cos, tan, cosec, sec, cot, sqrt, frac, powers,
        degrees, implicit products). A span with no letters must hold as
        arithmetic, with the trigonometric ratios of the standard angles
        computed, not looked up. A span with letters must hold at five random
        angles (an identity), or else under the data of the block it sits in
        (an example, a question, an answer row), worked out here from that
        block's givens. A statement the book prints as false is checked to be
        false.
     B  what A cannot see: Table 8.1 cell by cell, the triangles in the
        figures (their printed labels and their drawn angles), answers that
        sit beside other numbers, read a lettered part at a time
     C  every multiple-choice question, in the chapter and in Beyond the Book:
        exactly one option is right, and it is the one the key prints; every
        assertion-reason letter is derived
     D  ANSWERS.md prints the same key as the page

   Exits non-zero if anything does not hold up. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const VERBOSE = process.argv.includes('--verbose');
let pass = 0;
const fails = [];
const is = (what, cond) => { if (cond) pass++; else fails.push(what); };
const close = (x, y) => Number.isFinite(x) && Number.isFinite(y) && Math.abs(x - y) <= 1e-7 * Math.max(1, Math.abs(x), Math.abs(y));
const near = (what, got, want) => is(`${what}: computed ${want}, printed ${got}`, close(got, want));

/* ---- the mathematics ----------------------------------------- */

const R = Math.PI / 180;
const deg = (x) => x / R;
const asind = (x) => deg(Math.asin(x)), acosd = (x) => deg(Math.acos(x)), atand = (x) => deg(Math.atan(x));
const trig = (f, d) => {
  const s = Math.sin(d * R), c = Math.cos(d * R);
  const S = Math.abs(s) < 1e-12 ? 0 : s, C = Math.abs(c) < 1e-12 ? 0 : c;
  switch (f) {
    case 'sin': return S;
    case 'cos': return C;
    case 'tan': return C === 0 ? NaN : S / C;
    case 'cot': return S === 0 ? NaN : C / S;
    case 'sec': return C === 0 ? NaN : 1 / C;
    case 'cosec': return S === 0 ? NaN : 1 / S;
  }
  return NaN;
};

let seed = 20260917;
const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
const between = (a, b) => a + (b - a) * rnd();

/* ---- a small LaTeX parser --------------------------------------- */

const FAIL = Symbol('fail');
function tokenize(src) {
  const t = []; let s = src; let angleNext = false;
  const fail = () => { t.push({ k: FAIL }); s = ''; };
  while (s.length) {
    let m;
    if ((m = s.match(/^\s+/))) { s = s.slice(m[0].length); continue; }
    if ((m = s.match(/^\\[,;:! ]/))) { s = s.slice(2); continue; }
    if (s.startsWith('\\{')) { t.push({ k: '(' }); s = s.slice(2); continue; }
    if (s.startsWith('\\}')) { t.push({ k: ')' }); s = s.slice(2); continue; }
    if ((m = s.match(/^\d+(\.\d+)?/))) { t.push({ k: 'num', v: Number(m[0]) }); s = s.slice(m[0].length); continue; }
    if ((m = s.match(/^\\([a-zA-Z]+)/))) {
      const c = m[1]; s = s.slice(m[0].length);
      if (['frac', 'dfrac', 'tfrac'].includes(c)) t.push({ k: 'frac' });
      else if (c === 'sqrt') t.push({ k: 'sqrt' });
      else if (c === 'times' || c === 'cdot') t.push({ k: '*' });
      else if (c === 'div') t.push({ k: '/' });
      else if (c === 'theta') t.push({ k: 'var', v: 'θ' });
      else if (c === 'circ') t.push({ k: 'circ' });
      else if (['sin', 'cos', 'tan', 'sec', 'cot'].includes(c)) t.push({ k: 'fn', v: c });
      else if (c === 'operatorname') {
        const n = s.match(/^\{(\w+)\}/);
        if (n && n[1] === 'cosec') { t.push({ k: 'fn', v: 'cosec' }); s = s.slice(n[0].length); } else fail();
      } else if (c === 'angle') angleNext = true;
      else if (['left', 'right', 'quad', 'qquad', 'displaystyle'].includes(c)) continue;
      else fail();
      continue;
    }
    if ((m = s.match(/^[A-Z]+/))) { t.push({ k: 'var', v: m[0], angle: angleNext || m[0].length === 1 }); angleNext = false; s = s.slice(m[0].length); continue; }
    if ((m = s.match(/^[a-z]/))) { t.push({ k: 'var', v: m[0] }); s = s.slice(1); continue; }
    if ('+-*/^(){}'.includes(s[0])) { t.push({ k: s[0] }); s = s.slice(1); continue; }
    fail();
  }
  return t;
}

function parse(src) {
  const toks = tokenize(src);
  if (toks.some(x => x.k === FAIL) || !toks.length) return null;
  let i = 0;
  const vars = new Set(), angles = new Set();
  const peek = () => toks[i], eat = (k) => { if (toks[i] && toks[i].k === k) return toks[i++]; throw FAIL; };
  const starts = (x) => x && ['num', 'var', '(', '{', 'sqrt', 'frac', 'fn'].includes(x.k);
  function group() { eat('{'); const e = expr(); eat('}'); return e; }
  function expr() {
    let a = unary();
    while (peek() && (peek().k === '+' || peek().k === '-')) {
      const op = toks[i++].k; const b = unary(); const l = a;
      a = op === '+' ? (e) => l(e) + b(e) : (e) => l(e) - b(e);
    }
    return a;
  }
  function unary() {
    if (peek() && peek().k === '-') { i++; const u = term(); return (e) => -u(e); }
    if (peek() && peek().k === '+') { i++; }
    return term();
  }
  function term() {
    let a = power();
    for (;;) {
      const p = peek();
      if (p && (p.k === '*' || p.k === '/')) { i++; const b = power(); const l = a; a = p.k === '*' ? (e) => l(e) * b(e) : (e) => l(e) / b(e); }
      else if (starts(p)) { const b = power(); const l = a; a = (e) => l(e) * b(e); }
      else return a;
    }
  }
  function exponent() {
    const p = peek();
    if (p.k === 'circ') { i++; return null; }
    if (p.k === '{') return group();
    if (p.k === 'num') { i++; const v = p.v; return () => v; }
    if (p.k === 'var') { i++; vars.add(p.v); const n = p.v; return (e) => e[n]; }
    throw FAIL;
  }
  function power() {
    let b = primary();
    while (peek() && peek().k === '^') {
      i++; const x = exponent();
      if (x) { const l = b; b = (e) => l(e) ** x(e); }
    }
    return b;
  }
  function arg() {
    const p = peek();
    if (!p) throw FAIL;
    if (p.k === '(') { i++; const e = expr(); eat(')'); return e; }
    if (p.k === '{') return group();
    let coef = null;
    if (p.k === 'num') {
      i++; coef = p.v;
      if (peek() && peek().k === '^' && toks[i + 1] && toks[i + 1].k === 'circ') { i += 2; const c = coef; return () => c; }
    }
    if (peek() && peek().k === 'var') {
      const v = toks[i++].v; vars.add(v); angles.add(v);
      const c = coef ?? 1; return (e) => c * e[v];
    }
    throw FAIL;
  }
  function primary() {
    const p = peek();
    if (!p) throw FAIL;
    if (p.k === 'num') { i++; return () => p.v; }
    if (p.k === 'var') { i++; vars.add(p.v); if (p.angle) angles.add(p.v); return (e) => e[p.v]; }
    if (p.k === '(') { i++; const e = expr(); eat(')'); return e; }
    if (p.k === '{') return group();
    if (p.k === 'sqrt') { i++; const g = group(); return (e) => Math.sqrt(g(e)); }
    if (p.k === 'frac') { i++; const a = group(), b = group(); return (e) => a(e) / b(e); }
    if (p.k === 'fn') {
      i++; let pw = null;
      if (peek() && peek().k === '^') { i++; pw = exponent(); }
      const a = arg(); const f = p.v;
      return (e) => { const v = trig(f, a(e)); return pw ? v ** pw(e) : v; };
    }
    throw FAIL;
  }
  try {
    const f = expr();
    if (i !== toks.length) return null;
    return { f, vars, angles };
  } catch { return null; }
}

// "a = b, c = d" is two statements; a comma inside braces is not a break
function splitParts(span) {
  const out = []; let depth = 0, cur = '';
  for (let i = 0; i < span.length; i++) {
    const ch = span[i];
    if ('({'.includes(ch)) depth++;
    if (')}'.includes(ch)) depth--;
    if (depth === 0 && ch === ',' && /=/.test(cur) && /=/.test(span.slice(i + 1))) { out.push(cur); cur = ''; continue; }
    if (span.startsWith('\\qquad', i)) { out.push(cur); cur = ''; i += 5; continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
}
const unbrace = (s) => { s = s.trim(); return /^\{[^{}]*(\{[^{}]*\}[^{}]*)*\}$/.test(s) || (s.startsWith('{') && s.endsWith('}') && balanced(s.slice(1, -1))) ? s.slice(1, -1) : s; };
function balanced(s) { let d = 0; for (const c of s) { if (c === '{') d++; if (c === '}') d--; if (d < 0) return false; } return d === 0; }
const val = (src, env = {}) => { const p = parse(unbrace(src)); return p ? p.f(env) : NaN; };

/* ---- the contexts: each block's givens, worked out here ---------- */

const rt = (A, h) => ({ A, C: 90 - A, AC: h, BC: h * trig('sin', A), AB: h * trig('cos', A) });   // right-angled at B
const k = () => between(1, 3);
const ctx = {
  // chapter body, running text
  text: [
    () => { const kk = k(); const A = asind(1 / 3); return { A, k: kk, BC: kk, AC: 3 * kk, AB: Math.sqrt(9 * kk * kk - kk * kk) }; },
    () => { const A = between(10, 80), h = between(1, 3), h2 = between(0.5, 1), h3 = between(3, 5);
      return { ...rt(A, h), AP: h2, MP: h2 * trig('sin', A), AM: h2 * trig('cos', A), AQ: h3, QN: h3 * trig('sin', A), AN: h3 * trig('cos', A) }; },
    () => { const a = k(); return { A: 45, C: 45, a, AB: a, BC: a, AC: Math.hypot(a, a) }; },
    () => { const a = k(); return { A: 60, B: 60, C: 60, BAD: 30, CAD: 30, ABD: 60, a, AB: 2 * a, BC: 2 * a, BD: a, DC: a, AD: Math.sqrt(4 * a * a - a * a) }; },
    () => ({ A: 0 }), () => ({ A: 90 }),
    () => rt(between(10, 80), between(1, 3)),
    () => ({ x: 6 / 2 }),
    () => ({ A: atand(1 / Math.sqrt(3)) }),
    () => ctx.ex6[0](),
  ],
  ex1: [() => { const kk = k(); return { A: atand(4 / 3), k: kk, BC: 4 * kk, AB: 3 * kk, AC: Math.hypot(3 * kk, 4 * kk) }; }],
  ex2: [() => { const B = between(10, 80), h1 = between(1, 2), h2 = between(2, 4);
    return { B, Q: B, AB: h1, AC: h1 * trig('sin', B), BC: h1 * trig('cos', B), PQ: h2, PR: h2 * trig('sin', B), QR: h2 * trig('cos', B), k: h1 / h2 }; }],
  ex3: [() => { const AB = 29, BC = 21, AC = Math.sqrt(AB * AB - BC * BC); const t = acosd(BC / AB); return { AB, BC, AC, 'θ': t, ABC: t }; }],
  ex4: [() => { const kk = k(); return { A: atand(1), k: kk, AB: kk, BC: kk, AC: Math.hypot(kk, kk) }; }],
  ex5: [() => { const OP = 7, PQ = (OP * OP - 1) / 2, OQ = PQ + 1; return { OP, PQ, OQ, Q: asind(OP / OQ) }; }],
  ex6: [() => { const AB = 5, C = 30; return { AB, C, ACB: C, BC: AB / trig('tan', C), AC: AB / trig('sin', C) }; }],
  ex7: [() => { const PQ = 3, PR = 6, Rr = asind(PQ / PR); return { PQ, PR, R: Rr, PRQ: Rr, QPR: 180 - 90 - Rr }; }],
  ex8: [() => { const D = asind(1 / 2), S = acosd(1 / 2); return { A: (S + D) / 2, B: (S - D) / 2 }; }],
  // exercise sets
  '8.1:q1': [() => { const AB = 24, BC = 7, A = atand(BC / AB); return { AB, BC, AC: Math.hypot(AB, BC), A, C: 90 - A }; }],
  '8.1:q2': [() => { const PQ = 12, PR = 13, QR = Math.sqrt(PR * PR - PQ * PQ), P = atand(QR / PQ); return { PQ, PR, QR, P, R: 90 - P }; }],
  '8.1:q3': [() => { const kk = k(); return { A: asind(3 / 4), k: kk, BC: 3 * kk, AC: 4 * kk, AB: Math.sqrt(7) * kk }; }],
  '8.1:q4': [() => { const kk = k(); return { A: atand(15 / 8), k: kk, AB: 8 * kk, BC: 15 * kk, AC: Math.hypot(8 * kk, 15 * kk) }; }],
  '8.1:q5': [() => ({ 'θ': acosd(12 / 13) })],
  '8.1:q6': [() => { const A = between(10, 80), h1 = between(1, 2), h2 = between(2, 4);
    return { A, B: A, AC: h1, AE: h1 * trig('cos', A), CE: h1 * trig('sin', A), BD: h2, BF: h2 * trig('cos', A), DF: h2 * trig('sin', A), k: h1 / h2 }; }],
  '8.1:q7': [() => ({ 'θ': atand(8 / 7) })],
  '8.1:q8': [() => ({ A: atand(3 / 4) })],
  '8.1:q9': [() => { const A = atand(1 / Math.sqrt(3)), kk = k(); return { A, C: 90 - A, k: kk, BC: kk, AB: Math.sqrt(3) * kk, AC: 2 * kk }; }],
  '8.1:q10': [() => { const PQ = 5, s = 25, d = PQ * PQ / s, PR = (s + d) / 2, QR = (s - d) / 2; return { PQ, PR, QR, P: atand(QR / PQ) }; }],
  '8.1:q11': [() => ({ A: acosd(5 / 12) }), () => ({ A: atand(12 / 5) })],
  '8.2:q2': [() => ({ A: 0 })],
  '8.2:q3': [() => { const S = atand(Math.sqrt(3)), D = atand(1 / Math.sqrt(3)); return { A: (S + D) / 2, B: (S - D) / 2 }; }],
  '8.2:q4': [() => ({ 'θ': 45 }), () => ({ A: 0 }), () => ({ A: 30, B: 30 })],
  // Beyond the Book: Stage 1
  s1: [
    () => ({ 'θ': asind(Math.sqrt(1 / 4)) }),
    () => ({ 'θ': atand(Math.sqrt(2) - 1) }),
    () => ({ 'θ': acosd(1 / 2) }), () => ({ 'θ': acosd(1) }),
    () => ({ A: 45 }),
    () => { const t = between(10, 80); return { 'θ': t, p: trig('sec', t) + trig('tan', t) }; },
    () => { const p = 7, sec = (p * p + 1) / (2 * p); return { p, 'θ': acosd(1 / sec) }; },
  ],
  // Beyond the Book: Solved Examples
  bex1: [() => { const AB = 2, AC = 3; return { AB, AC, BC: Math.sqrt(AC * AC - AB * AB), A: acosd(AB / AC) }; }],
  bex2: [() => { const kk = k(); return { A: acosd(9 / 41), k: kk, AB: 9 * kk, AC: 41 * kk, BC: Math.sqrt(41 * 41 - 81) * kk }; }],
  bex3: [() => { const BC = 35, d = 25, s = BC * BC / d, AC = (s + d) / 2, AB = (s - d) / 2; return { BC, AC, AB, A: asind(BC / AC) }; }],
  bex4: [() => ({ 'θ': atand(4 / 5) }), () => ({ 'θ': atand(4) })],
  bex6: [() => { const D = asind(Math.sqrt(3) / 2), S = acosd(0); return { A: (S + D) / 2, B: (S - D) / 2 }; },
    () => ({ A: 60, B: 30 }), () => ({ A: 45, B: 45 }), () => ({ A: 90, B: 0 })],
  bex7: [() => ({ 'θ': atand(3 / Math.sqrt(3)) / 2 })],
  bex10: [() => ({ 'θ': atand(2) })],
  bex14: [() => { const t = between(10, 80), a = between(1, 3), b = between(1, 3); return { 'θ': t, a, b, x: a * trig('sec', t), y: b * trig('tan', t) }; }],
  bex15: [() => ({ 'θ': asind((Math.sqrt(5) - 1) / 2) })],
  // Beyond the Book: Practice
  'pr:q2': [() => ({ A: asind(33 / 65) })],
  'pr:q5': [() => ({ A: atand(Math.sqrt(3)) })],
  'pr:q6': [() => { const Z = between(10, 80), h = between(1, 3); return { Z, XZ: h, XY: h * trig('sin', Z), YZ: h * trig('cos', Z) }; }],
  'pr:q9': [() => ({ A: atand(1 / 2) })],
  'pr:q10': [() => { const AC = 10, C = 30; return { AC, C, AB: AC * trig('sin', C), BC: AC * trig('cos', C) }; }],
  'pr:q12': [() => { const d = 2 / 5, s = 1 / d, cosec = (s + d) / 2; return { 'θ': asind(1 / cosec) }; }],
  'pr:q13': [() => ({ 'θ': asind(Math.sqrt(3 / 3)) })],
  'pr:q21': [() => ({ 'θ': acosd(Math.sqrt(3) / 2) })],
  'pr:q23': [() => { const DE = 1, EF = Math.sqrt(3); return { DE, EF, F: atand(DE / EF) }; }],
  'pr:q24': [() => ({ 'θ': acosd(11 / 61) })],
  'pr:q27': [() => { const D = acosd(Math.sqrt(3) / 2), S = asind(1); return { A: (S + D) / 2, B: (S - D) / 2 }; }],
  'pr:q29': [() => { const t = between(10, 80); return { 'θ': t, m: trig('tan', t) + trig('sin', t), n: trig('tan', t) - trig('sin', t) }; }],
  'pr:q31': [() => ({ A: asind(0.5 / 1), B: atand(0.5 / 0.5) })],
};
ctx.md = [...ctx.text, ...ctx.ex5, ...ctx.ex7, () => { const A = between(10, 80); return { ...rt(A, between(1, 3)) }; }];
ctx['pr:q11'] = [];

// statements the book prints in order to say they are false
const FALSE = [
  String.raw`\sin\theta = \frac{4}{3}`,           // Ex 8.1 Q11 (v)
  String.raw`\sin(A + B) = \sin A + \sin B`,      // Ex 8.2 Q4 (i)
  String.raw`\cos 60^\circ = 1 - 2\sin 30^\circ`, // practice 11, Lata
  String.raw`\tan 60^\circ = 2\tan 30^\circ`,     // practice 17, A
  String.raw`\cos A = \sec A`,                    // practice 19, R
  String.raw`\tan\theta = 4`,                     // Beyond Example 4, the slip option (b) makes
];
const norm = (s) => unbrace(s).replace(/\s+/g, '');

/* ---- the pages, cut into keyed blocks ---------------------------- */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const text = (s) => s.replace(/<span class="nb">([^<]*)<\/span>/g, '$1')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/&middot;/g, '·').replace(/&amp;/g, '&').replace(/\s+/g, ' ');

function takeBlock(s, start) {   // from a <div ...> at start to its matching </div>
  const re = /<div\b|<\/div>/g; re.lastIndex = start; let d = 0, m;
  while ((m = re.exec(s))) { d += m[0] === '</div>' ? -1 : 1; if (!d) return s.slice(start, m.index + 6); }
  return s.slice(start);
}
const segments = [];   // { key, src, where }
const examples = {};   // key -> block html
const questions = {};  // key -> block html
const traceRows = {};  // label -> row html
for (const part of ['body', 'beyond']) {
  let setName = null, qn = 0, exN = 0;
  for (const f of pages.filter(p => (part === 'body') === /^p0/.test(p))) {
    let s = html[f];
    let rest = '';
    let i = 0;
    const re = /<div class="(c-example|c-practice[^"]*|work work--trace)">/g; let m;
    while ((m = re.exec(s))) {
      if (m.index < i) continue;
      rest += s.slice(i, m.index);
      const block = takeBlock(s, m.index); i = m.index + block.length; re.lastIndex = i;
      if (m[1] === 'c-example') {
        exN++; const key = (part === 'body' ? 'ex' : 'bex') + exN;
        const tab = block.match(/c-example__tab">Example (\d+)</);
        is(`${f}: ${part} examples numbered in order (Example ${tab && tab[1]} is number ${exN})`, tab && Number(tab[1]) === exN);
        examples[key] = block; segments.push({ key, src: block, where: `${f} ${key}` });
      } else if (m[1].startsWith('c-practice')) {
        const head = block.match(/c-practice__head">(?:<span[^>]*>\d<\/span>)?([^<]*)</);
        if (head) { setName = /Exercise Set (8\.\d)/.test(head[1]) ? head[1].match(/8\.\d/)[0] : 'pr'; qn = 0; }
        const ds = block.match(/data-start="(\d+)"/);
        if (/<li class="cont">/.test(block)) { /* same question */ } else qn = ds ? Number(ds[1]) : 1;
        const key = `${setName}:q${qn}`;
        questions[key] = (questions[key] || '') + block;
        segments.push({ key, src: block, where: `${f} ${key}` });
      } else {
        for (const r of block.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) {
          (traceRows[r[1]] ||= []).push(r[2]);
          segments.push({ key: `pr:q${r[1]}`, src: r[2], where: `${f} key row ${r[1]}` });
        }
      }
    }
    rest += s.slice(i);
    segments.push({ key: part === 'body' ? 'text' : 's1', src: rest, where: `${f} running text` });
  }
}
// ANSWERS.md, keyed by section and item
{
  let sect = 'md', item = null, roman = null;
  for (const line of answersMd.split('\n')) {
    const rm = line.match(/^\s*- \((i|ii|iii|iv|v|vi|vii|viii|ix|x)\)\s*$/);
    if (rm) roman = rm[1];
    if (/^\d+\. |^#|^---/.test(line)) roman = null;
    if (sect === '8.3' && item === 4 && roman) { segments.push({ key: `8.3:q4:${roman}`, src: line, where: `ANSWERS.md 8.3:q4 (${roman})` }); continue; }
    const h = line.match(/^#{2,3} (.*)/);
    if (h) {
      const set = h[1].match(/Exercise Set (8\.\d)/);
      sect = set ? set[1] : /Stage 1/.test(h[1]) ? 's1' : /Stage 3/.test(h[1]) ? 'pr' : 'md';
      item = null; continue;
    }
    const it = line.match(/^(\d+)\. /);
    if (it && sect !== 'md' && sect !== 's1') item = Number(it[1]);
    const key = sect === 'md' ? 'md' : sect === 's1' ? 's1' : item ? `${sect}:q${item}` : 'md';
    segments.push({ key, src: line, where: `ANSWERS.md ${key}` });
  }
}

/* ---- A. every equation ------------------------------------------ */

// what a proof is proving: LHS, RHS and a row that opens with "=" stand for its two sides
const targets = {};
const sidesOf = (span) => {   // only an identity is a proof's target
  const s = unbrace(span).split('='); if (s.length < 2) return null;
  const a = parse(unbrace(s[0])), b = parse(unbrace(s[s.length - 1])); if (!a || !b) return null;
  const same = [20, 35, 50, 65].every(x => { const e = { A: x, 'θ': x }; return close(a.f(e), b.f(e)); });
  return same ? [s[0], s[s.length - 1]] : null;
};
for (const [k, block] of Object.entries(examples)) {
  const m = block.match(/rove that[\s\S]*?\$\$?([^$]+)\$/);
  if (m && sidesOf(m[1])) targets[k] = sidesOf(m[1]);
}
{
  const romans = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];
  const parts = [...(questions['8.3:q4'] || '').matchAll(/<li>\$([^$]+)\$/g)].map(x => x[1]);
  is(`Ex 8.3 Q4 has ten identities (${parts.length})`, parts.length === 10);
  parts.forEach((p, i) => { targets[`8.3:q4:${romans[i]}`] = sidesOf(p); });
}
let proofRows = 0;

let identities = 0, conditional = 0, arithmetic = 0, falseOk = 0;
const skipped = [];
for (const { key, src, where } of segments) {
  const body = src.replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/\$\$/g, '$');
  for (const m of body.matchAll(/\$([^$]+)\$/g)) {
    const span = m[1];
    if (!span.includes('=') || /\\neq|\\leq|\\geq|\\lt|\\gt|\\approx|\\pm|<|>/.test(span)) continue;
    for (const partRaw of splitParts(unbrace(span))) {
      let part = unbrace(partRaw);
      const tg = targets[key];
      if (tg && (/\\text\{[LR]HS\}/.test(part) || /^\s*=/.test(part))) {
        part = part.replace(/\\text\{LHS\}/g, `(${tg[0]})`).replace(/\\text\{RHS\}/g, `(${tg[1]})`);
        if (/^\s*=/.test(part)) part = `(${tg[0]}) ${part}`;
        proofRows++;
      }
      const sides = part.split('=').map(x => x.trim());
      if (sides.filter(Boolean).length < 2) continue;
      let ps = sides.filter(Boolean).map(x => parse(unbrace(x)));
      if (ps.filter(Boolean).length < 2) { skipped.push(`${where}: $${part.trim()}$`); continue; }
      ps = ps.filter(Boolean);
      const vars = new Set(ps.flatMap(p => [...p.vars]));
      const angles = new Set(ps.flatMap(p => [...p.angles]));
      const holds = (env) => { const v = ps.map(p => p.f(env)); return v.every(x => close(x, v[0])); };
      if (!vars.size) {
        const v = ps.map(p => p.f({}));
        if (v.some(x => !Number.isFinite(x))) { skipped.push(`${where}: $${part.trim()}$ (not defined)`); continue; }
        if (!holds({}) && FALSE.some(f => norm(f) === norm(part))) { falseOk++; pass++; continue; }
        arithmetic++;
        is(`${where}: $${part.trim()}$ — sides are ${v.map(x => +x.toFixed(6)).join(' and ')}`, holds({}));
        continue;
      }
      let ident = true;
      for (let t = 0; t < 5 && ident; t++) {
        const env = {};
        for (const v of vars) env[v] = angles.has(v) || v === 'θ' ? between(5, 85) : between(0.5, 3);
        ident = holds(env);
      }
      if (ident) { identities++; pass++; continue; }
      const cs = ctx[key] || [];
      const ok = cs.some(c => [0, 1].every(() => { const env = c(); return [...vars].every(v => v in env) && holds(env); }));
      if (ok) { conditional++; pass++; if (VERBOSE) console.log(`   ${where}: $${part.trim()}$ holds under its data`); continue; }
      if (FALSE.some(f => norm(f) === norm(part))) { falseOk++; pass++; continue; }
      fails.push(`${where}: $${part.trim()}$ holds neither as an identity nor under the block's data`);
    }
  }
}
// the printed-false statements really are false
for (const f of FALSE) {
  const [l, r] = f.split('=');
  const pl = parse(l), pr = parse(r);
  const env = { 'θ': 0, A: 0, B: 0 };
  const counter = [...Array(20)].some(() => { for (const v of ['θ', 'A', 'B']) env[v] = between(5, 85); return !close(pl.f(env), pr.f(env)); });
  is(`printed as false, and is false: ${f}`, counter && (!/θ=\\frac\{4\}\{3\}/.test(f) || ![...Array(90)].some((_, d) => close(trig('sin', d), 4 / 3))));
}

/* ---- B. what arithmetic alone does not check -------------------- */

// Table 8.1, cell by cell
{
  const all = Object.values(html).join('\n');
  const tb = all.slice(all.indexOf('<caption>Table 8.1'), all.indexOf('</table>', all.indexOf('<caption>Table 8.1')));
  const angs = [...tb.slice(0, tb.indexOf('</thead>')).matchAll(/<th>\$(\d+)\^\\circ\$<\/th>/g)].map(x => Number(x[1]));
  is(`Table 8.1 heads are 0, 30, 45, 60, 90: ${angs}`, angs.join() === '0,30,45,60,90');
  let cells = 0;
  for (const row of tb.matchAll(/<tr><td>\$\\(?:operatorname\{)?(\w+)\}? A\$<\/td>([\s\S]*?)<\/tr>/g)) {
    const fn = row[1];
    const vals = [...row[2].matchAll(/<td>([\s\S]*?)<\/td>/g)].map(x => x[1]);
    vals.forEach((c, j) => {
      const want = trig(fn, angs[j]);
      if (/not defined/.test(c)) is(`Table 8.1: ${fn} ${angs[j]}° is not defined`, Number.isNaN(want));
      else near(`Table 8.1: ${fn} ${angs[j]}°`, val(c.replace(/\$/g, '')), want);
      cells++;
    });
  }
  is(`Table 8.1 has 30 cells (${cells})`, cells === 30);
}

// the figures: printed labels, and the angle the drawing makes
const figs = {};
for (const s of Object.values(html)) for (const m of s.matchAll(/<svg[\s\S]*?<\/svg>\s*<figcaption><span class="fignum">Fig\. (8\.\d+)<\/span>/g)) figs[m[1]] = m[0];
const labels = (n) => [...(figs[n] || '').matchAll(/<text class="dg-dim-label"[^>]*>([^<]*)<\/text>/g)].map(x => x[1]);
const tri = (n) => { const m = (figs[n] || '').match(/class="dg-line" d="M([\d.]+) ([\d.]+) L([\d.]+) ([\d.]+) L([\d.]+) ([\d.]+) Z"/); return m ? m.slice(1).map(Number) : null; };
const vlabel = (n, name) => { const m = (figs[n] || '').match(new RegExp(`<text class="dg-label" x="([\\d.]+)" y="([\\d.]+)"[^>]*>${name}</text>`)); return m ? [Number(m[1]), Number(m[2])] : null; };
function drawnAngle(n, at) {   // the angle of the drawn triangle at the vertex nearest the label
  const t = tri(n); const L = vlabel(n, at); if (!t || !L) return NaN;
  const P = [[t[0], t[1]], [t[2], t[3]], [t[4], t[5]]];
  const d = P.map(p => Math.hypot(p[0] - L[0], p[1] - L[1]));
  const i = d.indexOf(Math.min(...d)); const [a, b] = P.filter((_, j) => j !== i);
  const u = [a[0] - P[i][0], a[1] - P[i][1]], v = [b[0] - P[i][0], b[1] - P[i][1]];
  return deg(Math.acos((u[0] * v[0] + u[1] * v[1]) / Math.hypot(...u) / Math.hypot(...v)));
}
const drawn = (n, at, want, tol = 2) => { const a = drawnAngle(n, at); is(`Fig. ${n}: the angle at ${at} is drawn ${a.toFixed(1)}°, the text makes it ${want.toFixed(1)}°`, Math.abs(a - want) <= tol); };
const num = (s) => Number(String(s).replace(/[^\d.]/g, ''));
{
  // Fig. 8.7: 3k and k
  const [h, o] = labels('8.7'); is('Fig. 8.7 labels 3k and k', h === '3k' && o === 'k');
  drawn('8.7', 'A', asind(1 / num(h)));
  const cosA = Math.sqrt(num(h) ** 2 - 1) / num(h);
  const printed = Object.values(html).join('').match(/\\cos A = \\dfrac\{AB\}\{AC\} = \\dfrac\{2\\sqrt\{2\}k\}\{3k\} = (\\dfrac\{[^$]*?\}\{\d+\})\$/);
  is('the sin A = 1/3 passage prints cos A', !!printed); if (printed) near('cos A from Fig. 8.7', val(printed[1]), cosA);
  // Fig. 8.8: 3k and 4k
  const [ab, bc] = labels('8.8').map(num); is('Fig. 8.8 labels 3k and 4k', ab === 3 && bc === 4);
  drawn('8.8', 'A', atand(bc / ab));
  const ans1 = examples.ex1.match(/Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/)[1];
  const got1 = [...ans1.matchAll(/\\(?:operatorname\{)?(\w+)\}? A = \\dfrac\{(\d+)\}\{(\d+)\}/g)].map(x => [x[1], x[2] / x[3]]);
  is('Example 1 answer gives five ratios', got1.length === 5);
  for (const [fn, v] of got1) near(`Example 1 answer, ${fn} A`, v, trig(fn, atand(bc / ab)));
  // Fig. 8.10: 29 and 21
  const [hyp, adj] = labels('8.10').map(num);
  drawn('8.10', 'B', acosd(adj / hyp));
  const t3 = acosd(adj / hyp);
  const a3 = examples.ex3.match(/Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/)[1];
  const i3 = a3.match(/\(i\)\s*([^(]*)\(ii\)/), ii3 = a3.match(/\(ii\)\s*\$([^$]+)\$/);
  near('Example 3 (i)', num(i3[1]), trig('cos', t3) ** 2 + trig('sin', t3) ** 2);
  near('Example 3 (ii)', val(ii3[1]), trig('cos', t3) ** 2 - trig('sin', t3) ** 2);
  // Fig. 8.12: 7 cm, with OQ - PQ = 1 from the question
  const op = num(labels('8.12')[0]); is('Fig. 8.12 label 7 cm', op === 7);
  const pq = (op * op - 1) / 2;
  drawn('8.12', 'Q', atand(op / pq), 2);
  const s5 = examples.ex5.match(/\{PQ = (\d+)\}/); near('Example 5: PQ', Number(s5 && s5[1]), pq);
  // Fig. 8.13: 12 cm and 13 cm, for Ex 8.1 Q2
  const [pq2, pr2] = labels('8.13').map(num); const qr2 = Math.sqrt(pr2 ** 2 - pq2 ** 2);
  drawn('8.13', 'P', atand(qr2 / pq2));
  const md2 = answersMd.match(/\\tan P - \\cot R = (\d+)\$/);
  near('Ex 8.1 Q2 from Fig. 8.13', Number(md2 && md2[1]), qr2 / pq2 - qr2 / pq2);
  // Fig. 8.15: 30° and 60°
  const l15 = labels('8.15'); is('Fig. 8.15 labels 30° and 60°', l15.join() === '30°,60°');
  drawn('8.15', 'B', 60);
  // Fig. 8.19: 5 cm and 30°
  const l19 = labels('8.19'); is('Fig. 8.19 labels 30° and 5 cm', l19.join() === '30°,5 cm');
  drawn('8.19', 'C', num(l19[0]));
  const a6 = examples.ex6.match(/Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/)[1];
  const bc6 = a6.match(/\{BC = ([^}]+\}?)\}/), ac6 = a6.match(/\{AC = (\d+)\}/);
  near('Example 6: BC from Fig. 8.19', val(bc6[1]), num(l19[1]) / trig('tan', num(l19[0])));
  near('Example 6: AC from Fig. 8.19', Number(ac6[1]), num(l19[1]) / trig('sin', num(l19[0])));
  // Fig. 8.20: 3 cm and 6 cm
  const [pq7, pr7] = labels('8.20').map(num);
  drawn('8.20', 'R', asind(pq7 / pr7));
  const a7 = examples.ex7.match(/Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/)[1];
  near('Example 7: angle PRQ', Number(a7.match(/PRQ = (\d+)/)[1]), asind(pq7 / pr7));
  near('Example 7: angle QPR', Number(a7.match(/QPR = (\d+)/)[1]), 90 - asind(pq7 / pr7));
  // Figs. 8.9, 8.11, 8.14, 8.21 carry no values; 8.14 and 8.11 are drawn at 45°
  drawn('8.14', 'A', 45); drawn('8.11', 'A', 45);
}

// Beyond: the answers A cannot reach
const answerOf = (key) => { const m = (examples[key] || '').match(/Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/); return m ? m[1] : ''; };
{
  const A1 = acosd(2 / 3);
  const got = [...answerOf('bex1').matchAll(/\$([^$]+)\$/g)].map(x => val(x[1]));
  const want = ['sin', 'cos', 'tan', 'cosec', 'sec', 'cot'].map(f => trig(f, A1));
  is(`Beyond Example 1 answer has six values (${got.length})`, got.length === 6);
  got.forEach((g, i) => near(`Beyond Example 1 answer ${i + 1}`, g, want[i]));
  const q1 = examples.bex1.match(/\{AB = (\d+)\}[\s\S]*?\{AC = (\d+)\}/);
  is('Beyond Example 1 gives AB 2 and AC 3', q1 && q1[1] === '2' && q1[2] === '3');
  const q5 = examples.bex5.match(/Evaluate \$([^$]+)\$/);
  near('Beyond Example 5 answer', val(answerOf('bex5').replace(/\$/g, '')), val(q5[1]));
  const a3 = [...answerOf('bex3').matchAll(/\\(\w+) A = \\dfrac\{(\d+)\}\{(\d+)\}/g)];
  const c3 = ctx.bex3[0]();
  is('Beyond Example 3 answer has three ratios', a3.length === 3);
  for (const x of a3) near(`Beyond Example 3 ${x[1]} A`, x[2] / x[3], trig(x[1], c3.A));
  const a11 = answerOf('bex11'); is('Beyond Example 11 ends in the identity', /\\text\{LHS\} = \\text\{RHS\}/.test(a11));
}

// the key rows, a lettered part at a time, and answers beside other numbers
const rowText = (src) => src || '';
function partOf(row, part) {
  if (!part) return row;
  const m = row.match(new RegExp(`\\(${part}\\)([\\s\\S]*?)(?=\\([a-d]\\)|$)`));
  return m ? m[1] : '';
}
function valuesIn(s) {   // every value a row prints: the last side of each span, and bare numbers in the prose
  const out = [];
  for (const m of s.matchAll(/\$([^$]+)\$/g)) { const sides = unbrace(m[1]).split('='); const v = val(sides[sides.length - 1]); if (Number.isFinite(v)) out.push(v); }
  for (const m of s.replace(/\$[^$]*\$/g, ' ').replace(/<[^>]+>/g, ' ').matchAll(/(^|[^\w.])(\d+(?:\.\d+)?)(?![\w.])/g)) out.push(Number(m[2]));
  return out;
}
const pageRow = (q) => { const [, n, p] = String(q).match(/^(\d+)([a-d]?)$/); return partOf(rowText((traceRows[n] || [])[0]), p); };
const mdPractice = answersMd.slice(answersMd.indexOf('The working for each'));
const mdRow = (q) => {
  const [, n, p] = String(q).match(/^(\d+)([a-d]?)$/);
  const m = mdPractice.match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`));
  return partOf(m ? m[1] : '', p);
};
const says = (q, ...want) => {
  for (const [src, row] of [['key', pageRow(q)], ['ANSWERS.md', mdRow(q)]]) {
    const got = valuesIn(row);
    for (const w of want) is(`${src} ${q} should give ${+w.toFixed(6)}: "${row.trim().slice(0, 90)}"`, got.some(g => close(g, w)));
  }
};
const phrase = (q, re) => { for (const [src, row] of [['key', pageRow(q)], ['ANSWERS.md', mdRow(q)]]) is(`${src} ${q} should read ${re}: "${row.trim().slice(0, 90)}"`, re.test(row)); };
{
  const qv = (n) => { const m = (questions[`pr:q${n}`] || '').match(/\$([^$]+)\$/); return m ? m[1] : ''; };
  says(20, val(qv(20)));
  const t21 = acosd(Math.sqrt(3) / 2); says(21, t21, trig('tan', t21));
  says(22, val('(1 + \\cot^2\\theta)(1 - \\cos\\theta)(1 + \\cos\\theta)', { 'θ': 37 }));
  says(23, ctx['pr:q23'][0]().F);
  const t24 = acosd(11 / 61); says(24, trig('sin', t24), trig('cot', t24), Math.sqrt(61 * 61 - 121));
  const c27 = ctx['pr:q27'][0](); says(27, c27.A, c27.B);
  says('30a', 12 / trig('cos', 45));
  says('30b', 20 * trig('sin', 30), 20 * trig('cos', 30));
  says('30c', trig('tan', 30) * trig('tan', 60));
  says('30d', 12 * 12 / 2);
  says('31a', asind(0.5 / 1));
  says('31b', Math.sqrt(1 - 0.5 ** 2));
  says('31c', atand(0.5 / 0.5));
  says('31d', Math.hypot(0.5, 0.5));
  const a30 = (questions['pr:q30'] || '').match(/each shorter side is (\d+)[\s\S]*?longest side is (\d+)/);
  is('Q30 gives 12 cm and 20 cm', a30 && a30[1] === '12' && a30[2] === '20');
  const a31 = (questions['pr:q31'] || '').match(/sloping surface is (\d+)[\s\S]*?starts ([\d.]+)/);
  is('Q31 gives 1 m and 0.5 m', a31 && a31[1] === '1' && a31[2] === '0.5');
  phrase(11, /Lata|Kiran/);
}

// ANSWERS.md: the exercise answers that are words or lists
{
  const sec = (h) => answersMd.slice(answersMd.indexOf(`### Exercise Set ${h}`), answersMd.indexOf('\n## ', answersMd.indexOf(`### Exercise Set ${h}`)) >>> 0 || undefined);
  const s81 = sec('8.1'), s82 = sec('8.2');
  is('Ex 8.1 Q8 is answered yes', /8\. \*\*Yes\.\*\*/.test(s81));
  const q8 = ctx['8.1:q8'][0](); const lhs = (1 - trig('tan', q8.A) ** 2) / (1 + trig('tan', q8.A) ** 2);
  is(`Ex 8.1 Q8: both sides are ${lhs}`, close(lhs, trig('cos', q8.A) ** 2 - trig('sin', q8.A) ** 2) && s81.includes('\\frac{7}{25}') && close(7 / 25, lhs));
  const tf = [...s81.slice(s81.indexOf('11. ')).matchAll(/\((i|ii|iii|iv|v)\) \*\*(True|False)/g)].map(x => x[2]);
  is(`Ex 8.1 Q11 true/false: ${tf}`, tf.join() === ['False', 'True', 'False', 'False', 'False'].join() && (12 / 5 > 1) && acosd(5 / 12) > 0);
  const tf2 = [...s82.slice(s82.indexOf('4. ')).matchAll(/\((i|ii|iii|iv|v)\) \*\*(True|False)/g)].map(x => x[2]);
  const inc = (f) => [0, 30, 45, 60, 90].map(d => trig(f, d)).every((v, i, a) => !i || v > a[i - 1]);
  const want82 = [!close(trig('sin', 60), 2 * trig('sin', 30)) ? 'False' : 'True', inc('sin') ? 'True' : 'False', inc('cos') ? 'True' : 'False', 'False', Number.isNaN(trig('cot', 0)) ? 'True' : 'False'];
  is(`Ex 8.2 Q4 true/false: ${tf2}`, tf2.join() === want82.join());
  const one = trig('sin', 60) * trig('cos', 30) + trig('sin', 30) * trig('cos', 60);
  near('Ex 8.2 Q1 (i)', 1, one);
}

/* ---- C. multiple choice and assertion-reason -------------------- */

const letters = 'abcd';
const optionsIn = (block) => { const m = block.match(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*?)<\/ol>/); return m ? [...m[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => x[1]) : []; };
const mathOf = (s) => (s.match(/\$([^$]+)\$/) || [])[1];
const numOpt = (s) => { const m = mathOf(s); return m != null ? val(m) : Number(text(s).replace(/cm/, '').trim()); };
function agreeAt(exprA, exprB, draws = 4) {   // two expressions in one angle
  const a = parse(unbrace(exprA)), b = parse(unbrace(exprB)); if (!a || !b) return false;
  for (let t = 0; t < draws; t++) { const x = between(10, 80); const env = { A: x, 'θ': x }; if (!close(a.f(env), b.f(env))) return false; }
  return true;
}
const right = (flags) => flags.map((t, i) => (t ? letters[i] : null)).filter(Boolean);

// the page key
const beyondHtml = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const key = {};
{
  const a = beyondHtml.indexOf('<ol class="c-answers">');
  for (const m of text(beyondHtml.slice(a, beyondHtml.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2];
}
const pq = (n) => questions[`pr:q${n}`] || '';
const stem = (n) => mathOf(text(pq(n)).length ? pq(n) : '');
const solve = {
  1: o => o.map(s => close(numOpt(s), val(stem(1)))),
  2: o => o.map(s => close(numOpt(s), trig('cos', asind(33 / 65)))),
  3: o => o.map(s => [20, 50, 70].every(t => close(numOpt(s), trig('cosec', t) ** 2 - trig('cot', t) ** 2))),
  4: o => o.map(s => /not defined/.test(s) ? Number.isNaN(val(stem(4))) : close(numOpt(s), val(stem(4)))),
  5: o => o.map(s => close(numOpt(s), atand(Math.sqrt(3)))),
  6: o => o.map(s => { const Z = 35, h = 2; const env = { XZ: h, XY: h * trig('sin', Z), YZ: h * trig('cos', Z) }; return close(val(mathOf(s), env), trig('cos', Z)); }),
  7: o => o.map(s => close(numOpt(s), val(stem(7)))),
  8: o => o.map(s => { const v = numOpt(s); return v > 0 && v < 1; }),
  9: o => o.map(s => close(numOpt(s), trig('sin', atand(1 / 2)) * trig('cos', atand(1 / 2)))),
  10: o => o.map(s => { const c = ctx['pr:q10'][0](); return close(numOpt(s), c.AB + c.BC); }),
  11: o => { const sp = [...pq(11).matchAll(/\$([^$]+)\$/g)].map(x => unbrace(x[1]).split('=')).map(([l, r]) => close(val(l), val(r)));
    const want = sp[0] && !sp[1] ? 'only Kiran' : !sp[0] && sp[1] ? 'only Lata' : sp[0] ? 'both' : 'neither';
    return o.map(s => text(s).trim() === want); },
  12: o => o.map(s => close(numOpt(s), trig('cos', ctx['pr:q12'][0]()['θ']))),
  13: o => o.map(s => { const t = numOpt(s); return close(2 * trig('sin', t) ** 2 - trig('cos', t) ** 2, 2); }),
  14: o => o.map(s => close(numOpt(s), val(mathOf(pq(14).replace(/^[\s\S]*?Table 8\.1, the value of /, ''))))),
  15: o => o.map(s => [15, 40, 75].every(t => close(numOpt(s), trig('sin', t) ** 6 + trig('cos', t) ** 6 + 3 * trig('sin', t) ** 2 * trig('cos', t) ** 2))),
};
for (const [q, f] of Object.entries(solve)) {
  const o = optionsIn(pq(q));
  is(`practice Q${q} has four options`, o.length === 4);
  is(`practice Q${q}: the right option is ${right(f(o))}, the key prints ${key[q]}`, JSON.stringify(right(f(o))) === JSON.stringify([key[q]]));
}
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const arParts = (n) => [...pq(n).matchAll(/<p>(Assertion|Reason)[^:]*:([\s\S]*?)<\/p>/g)].map(x => x[2]);
const trueSpan = (s) => { const m = mathOf(s); const parts = unbrace(m).split('='); const env = { A: 37 }; return parts.slice(1).every(p => close(val(p, env), val(parts[0], env))); };
{
  const [a16, r16] = arParts(16), [a17, r17] = arParts(17), [a18, r18] = arParts(18), [a19, r19] = arParts(19);
  const AR = {
    16: [trueSpan(a16), trueSpan(r16), true],   // R's two values are what A adds
    17: [trueSpan(a17), [...r17.matchAll(/\$([^$]+)\$/g)].every(m => trueSpan(`$${m[1]}$`)), false],
    18: [[20, 45, 70].every(A => close(val(unbrace(mathOf(a18)).split('=')[0], { A }), val(unbrace(mathOf(a18)).split('=')[1], { A }))), [5, 45, 85].every(A => trig('sin', A) <= 1 && trig('cos', A) <= 1), false],
    19: [trueSpan(a19), [30, 60].every(A => close(trig('cos', A), trig('sec', A))), false],
  };
  for (const [q, v] of Object.entries(AR)) is(`practice Q${q}: assertion-reason is ${arLetter(v)}, the key prints ${key[q]}`, arLetter(v) === key[q]);
}
{
  const ls = Object.values(key).slice(0, 15);
  is(`MCQ letters spread, at least 3 of each: ${ls.join('')}`, [...letters].every(l => ls.filter(x => x === l).length >= 3));
  const ar = Object.values(key).slice(15);
  is(`AR letters use all four: ${ar.join('')}`, new Set(ar).size === 4);
  is('key covers 1-19', JSON.stringify(Object.keys(key).map(Number).sort((a, b) => a - b)) === JSON.stringify([...Array(19)].map((_, i) => i + 1)));
  const starts = [...beyondHtml.matchAll(/data-start="(\d+)"/g)].map(m => Number(m[1]));
  is(`practice numbered 2-31 once each: ${starts}`, JSON.stringify(starts) === JSON.stringify([...Array(30)].map((_, i) => i + 2)));
  is('every practice question 1-31 is in the pages', [...Array(31)].every((_, i) => questions[`pr:q${i + 1}`]));
  is('every numbered answer row 20-31 is there', [...Array(12)].every((_, i) => traceRows[i + 20]));
}

// the Solved Examples that are multiple choice
const exLetter = (k) => (answerOf(k).match(/\(([a-d])\)/) || [])[1];
{
  const o2 = optionsIn(examples.bex2), A2 = acosd(9 / 41);
  is(`Beyond Example 2: right ${right(o2.map(s => close(numOpt(s), trig('tan', A2))))}, printed ${exLetter('bex2')}`, JSON.stringify(right(o2.map(s => close(numOpt(s), trig('tan', A2))))) === JSON.stringify([exLetter('bex2')]));
  const o4 = optionsIn(examples.bex4), st4 = examples.bex4.match(/then \$([^$]+)\$ is/)[1];
  const r4 = right(o4.map(s => close(numOpt(s), val(st4, { 'θ': atand(4 / 5) }))));
  is(`Beyond Example 4: right ${r4}, printed ${exLetter('bex4')}`, JSON.stringify(r4) === JSON.stringify([exLetter('bex4')]));
  const o6 = optionsIn(examples.bex6);
  const r6 = right(o6.map(s => { const [a, b] = [...s.matchAll(/= (\d+)\^/g)].map(x => Number(x[1])); return a > b && a + b > 0 && a + b <= 90 && close(trig('sin', a - b), Math.sqrt(3) / 2) && close(trig('cos', a + b), 0); }));
  is(`Beyond Example 6: right ${r6}, printed ${exLetter('bex6')}`, JSON.stringify(r6) === JSON.stringify([exLetter('bex6')]));
  const o8 = optionsIn(examples.bex8), st8 = examples.bex8.match(/value of \$([^$]+)\$ is/)[1];
  const r8 = right(o8.map(s => agreeAt(st8, mathOf(s))));
  is(`Beyond Example 8: right ${r8}, printed ${exLetter('bex8')}`, JSON.stringify(r8) === JSON.stringify([exLetter('bex8')]));
}

// the chapter's own multiple choice: Ex 8.2 Q2 and Ex 8.3 Q3, against ANSWERS.md
{
  const bodyHtml = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
  const stems = [...bodyHtml.matchAll(/<li>((?:(?!<li>)[\s\S])*?)<ol class="c-parts c-parts--alpha c-parts--4">([\s\S]*?)<\/ol><\/li>/g)]
    .map(m => ({ stem: m[1], opts: [...m[2].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => x[1]) }));
  is(`eight option questions in the body (${stems.length})`, stems.length === 8);
  const mdLetters = (h, n) => { const s = answersMd.slice(answersMd.indexOf(`### Exercise Set ${h}`)); const it = s.slice(s.indexOf(`\n${n}. `)); return [...it.slice(0, it.indexOf(`\n${n + 1}. `)).matchAll(/\((?:i|ii|iii|iv)\) \*\*\(([a-d])\)\*\*/g)].map(x => x[1]); };
  const want = [...mdLetters('8.2', 2), ...mdLetters('8.3', 3)];
  stems.forEach(({ stem: s, opts }, i) => {
    const m = unbrace(mathOf(s));
    let r;
    if (/is true when/.test(s)) { const [l, rr] = m.split('='); r = right(opts.map(o => { const A = numOpt(o); return close(val(l, { A }), val(rr, { A })); })); }
    else { const e = m.replace(/=\s*$/, ''); r = right(opts.map(o => agreeAt(e, mathOf(o)))); }
    is(`body option question ${i + 1}: right ${r}, ANSWERS.md prints ${want[i]}`, JSON.stringify(r) === JSON.stringify([want[i]]));
  });
}

/* ---- D. ANSWERS.md prints the same key -------------------------- */

{
  const mdKey = {};
  const at = answersMd.indexOf('as the key prints it');
  for (const m of answersMd.slice(at, at + 400).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2];
  is(`ANSWERS.md key matches the page: ${JSON.stringify(mdKey)} against ${JSON.stringify(key)}`, JSON.stringify(mdKey) === JSON.stringify(key));
  for (const q of [16, 17, 18, 19]) is(`ANSWERS.md working ${q} gives (${key[q]})`, mdRow(q).trim().startsWith(`(${key[q]})`));
}

/* ---- report ------------------------------------------------------ */

console.log(`A  ${identities} identities held at five random angles (${proofRows} of them proof rows read against what they prove); ${conditional} statements held under their block's data;`);
console.log(`   ${arithmetic} arithmetic statements held; ${falseOk} printed-false statements are false; ${skipped.length} spans not parsed, skipped`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
