#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each equation is
   parsed from the page and solved, each word problem is solved again from
   its statement by search, and the result is compared with what is printed.

     node pages/class-10/ch04-quadratic-equations/check-numbers.mjs [--skipped]

   Four parts:
     A  every maths span, on every page and in ANSWERS.md, is parsed:
          - a chain of equal sides must hold (sides after the first equal as
            functions, and the first equal to them unless the chain is an
            equation); a two-sided equation whose sides differ by a nonzero
            constant is impossible, so it fails
          - two equations joined by "so", "that is", "gives", "becomes" or
            "when" in one row must have the same solutions (the same
            polynomial, up to a factor, where both are single equations)
          - every "v = number" in a row that also holds an equation in v
            must satisfy one of them
     B  what A cannot see: every quadratic the chapter sets is solved, and
        its roots and discriminant are read back off the page; every word
        problem is solved again from its words
     C  every multiple-choice and assertion-reason question: exactly one
        option is right, and it is the one the key prints
     D  ANSWERS.md prints the same key as the page

   Exits non-zero if anything does not hold up. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const BS = String.fromCharCode(92);
let pass = 0;
const fails = [];
const skipped = [];
const is = (what, cond) => { if (cond) pass++; else fails.push(what); };
const near = (a, b) => Math.abs(a - b) <= 1e-7 * (1 + Math.abs(a) + Math.abs(b));
const sameSet = (xs, ys) => xs.length === ys.length && xs.every(x => ys.some(y => near(x, y))) && ys.every(y => xs.some(x => near(x, y)));
const uniq = (xs) => xs.filter((x, i) => !xs.slice(0, i).some(y => near(x, y))).sort((a, b) => a - b);
const fmt = (xs) => '[' + xs.map(x => +x.toFixed(6)).join(', ') + ']';

/* ---- a small LaTeX expression parser -------------------------------- */

function tokenize(src) {
  const s = src.replace(/−/g, '-');
  const out = [];
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (/\s/.test(ch)) { i++; continue; }
    if (/[0-9.]/.test(ch)) { let j = i; while (j < s.length && /[0-9.]/.test(s[j])) j++; out.push({ t: 'num', v: s.slice(i, j) }); i = j; continue; }
    if (/[A-Za-z]/.test(ch)) { out.push({ t: 'var', v: ch }); i++; continue; }
    if ('+-*/^(){}'.includes(ch)) { out.push({ t: ch }); i++; continue; }
    if (ch === BS) {
      const m = s.slice(i + 1).match(/^([A-Za-z]+|.)/);
      if (!m) { i++; continue; }   // a trailing "\ " that lost its space
      const name = m[1]; i += 1 + name.length;
      if (/^[dt]?frac$/.test(name)) out.push({ t: 'frac' });
      else if (name === 'sqrt') out.push({ t: 'sqrt' });
      else if (name === 'times' || name === 'cdot') out.push({ t: '*' });
      else if (name === 'div') out.push({ t: '/' });
      else if (name === 'pm') out.push({ t: 'pm' });
      else if (name === 'alpha') out.push({ t: 'var', v: 'alpha' });
      else if (['left', 'right', 'quad', 'qquad', ',', ';', '!', ' '].includes(name)) { /* spacing */ }
      else return null;
      continue;
    }
    return null;
  }
  return out;
}

function parse(src) {
  const tk = tokenize(src);
  if (!tk || !tk.length) return null;
  let p = 0;
  const peek = () => tk[p] && tk[p].t;
  const take = (t) => { if (peek() !== t) throw 0; return tk[p++]; };
  const startsFactor = () => ['num', 'var', '(', '{', 'frac', 'sqrt'].includes(peek());
  function expr() {
    let a = term();
    while (['+', '-', 'pm'].includes(peek())) { const op = tk[p++].t; const b = term(); a = { op, a, b }; }
    return a;
  }
  function term() {
    let a = unary();
    for (;;) {
      if (peek() === '*' || peek() === '/') { const op = tk[p++].t; a = { op, a, b: unary() }; }
      else if (startsFactor()) a = { op: '*', a, b: power() };
      else return a;
    }
  }
  function unary() {
    if (peek() === '-') { p++; return { op: 'neg', a: unary() }; }
    if (peek() === '+') { p++; return unary(); }
    return power();
  }
  function power() {
    const base = atom();
    if (peek() !== '^') return base;
    p++;
    if (peek() === '{') { p++; const e = expr(); take('}'); return { op: '^', a: base, b: e }; }
    if (peek() === 'num') {
      const v = tk[p].v;
      if (v.length > 1) { tk[p] = { t: 'num', v: v.slice(1) }; return { op: '^', a: base, b: { n: Number(v[0]) } }; }
      p++; return { op: '^', a: base, b: { n: Number(v) } };
    }
    if (peek() === 'var') return { op: '^', a: base, b: { x: tk[p++].v } };
    throw 0;
  }
  function group() { take('{'); const e = expr(); take('}'); return e; }
  function atom() {
    const t = peek();
    if (t === 'num') {
      const n = { n: Number(tk[p++].v) };
      if (peek() === 'frac' && Number.isInteger(n.n)) { p++; const a = group(); const b = group(); return { op: '+', a: n, b: { op: '/', a, b } }; }   // a mixed number
      return n;
    }
    if (t === 'var') return { x: tk[p++].v };
    if (t === '(') { p++; const e = expr(); take(')'); return e; }
    if (t === '{') return group();
    if (t === 'frac') { p++; const a = group(); const b = group(); return { op: '/', a, b }; }
    if (t === 'sqrt') { p++; return { op: 'sqrt', a: group() }; }
    throw 0;
  }
  try { const e = expr(); return p === tk.length ? e : null; } catch { return null; }
}

function evalAst(e, env, sign) {
  if ('n' in e) return e.n;
  if ('x' in e) return env[e.x];
  const a = evalAst(e.a, env, sign);
  switch (e.op) {
    case 'neg': return -a;
    case 'sqrt': return a < 0 ? NaN : Math.sqrt(a);
  }
  const b = evalAst(e.b, env, sign);
  switch (e.op) {
    case '+': return a + b;
    case '-': return a - b;
    case 'pm': return a + sign * b;
    case '*': return a * b;
    case '/': return a / b;
    case '^': return a ** b;
  }
  return NaN;
}
const varsOf = (e, s = new Set()) => { if (!e) return s; if ('x' in e) s.add(e.x); if (e.a) varsOf(e.a, s); if (e.b) varsOf(e.b, s); return s; };
const hasPm = (e) => !!e && (e.op === 'pm' || hasPm(e.a) || hasPm(e.b));
const SAMPLES = [0.37, 1.83, -2.41, 3.29, -0.73, 5.11];
const envAt = (vars, k) => Object.fromEntries([...vars].map((v, i) => [v, SAMPLES[(k + i * 2) % SAMPLES.length] + i * 0.13]));

// a numeric value, or both values when the expression carries a plus-or-minus
const numeric = (e) => (hasPm(e) ? [evalAst(e, {}, 1), evalAst(e, {}, -1)] : [evalAst(e, {}, 1)]);

// f(v) for a one-variable expression, as polynomial coefficients (low first), or null
function polyOf(fn) {
  const xs = [-2, -1, 0, 1, 2, 3, 4];
  const ys = xs.map(fn);
  if (ys.some(y => !Number.isFinite(y))) return null;
  const n = 5;   // degree at most 4
  const A = xs.slice(0, n).map(x => [...Array(n)].map((_, j) => x ** j));
  const Y = ys.slice(0, n);
  for (let c = 0; c < n; c++) {
    let r = c; for (let k = c + 1; k < n; k++) if (Math.abs(A[k][c]) > Math.abs(A[r][c])) r = k;
    [A[c], A[r]] = [A[r], A[c]]; [Y[c], Y[r]] = [Y[r], Y[c]];
    for (let k = 0; k < n; k++) if (k !== c) { const f = A[k][c] / A[c][c]; for (let j = c; j < n; j++) A[k][j] -= f * A[c][j]; Y[k] -= f * Y[c]; }
  }
  let co = Y.map((y, i) => y / A[i][i]);
  const scale = Math.max(1, ...co.map(Math.abs));
  co = co.map(c => (Math.abs(c) < 1e-9 * scale ? 0 : c));
  const at = (x) => co.reduce((s, c, j) => s + c * x ** j, 0);
  for (const x of [5, 0.5, -3.7, 7.3]) { const y = fn(x); if (!Number.isFinite(y) || !near(at(x), y)) return null; }
  while (co.length > 1 && co[co.length - 1] === 0) co.pop();
  return co;
}
function rootsOf(co) {
  const d = co.length - 1;
  if (d < 1) return [];
  if (d === 1) return [-co[0] / co[1]];
  if (d === 2) {
    const [c, b, a] = co; const D = b * b - 4 * a * c;
    if (D < -1e-9 * (b * b + Math.abs(4 * a * c))) return [];
    const s = Math.sqrt(Math.max(D, 0));
    return uniq([(-b + s) / (2 * a), (-b - s) / (2 * a)]);
  }
  const f = (x) => co.reduce((s, c, j) => s + c * x ** j, 0);
  const out = [];
  let px = -200, py = f(px);
  for (let x = -200 + 0.005; x <= 200; x += 0.005) {
    const y = f(x);
    if (py === 0) out.push(px);
    else if (py * y < 0) { let lo = px, hi = x; for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (f(lo) * f(m) <= 0) hi = m; else lo = m; } out.push((lo + hi) / 2); }
    px = x; py = y;
  }
  return uniq(out);
}
const proportional = (p, q) => {
  if (p.length !== q.length) return false;
  const r = q[q.length - 1] / p[p.length - 1];
  return p.every((c, i) => near(c * r, q[i]));
};

/* ---- statements: what one maths span says --------------------------- */

// split a span into parts and the words between them
function pieces(span) {
  const s = span.replace(new RegExp(BS + BS + 'text\\{([^}]*)\\}', 'g'), ' $1 ');
  const out = []; let depth = 0, cur = '';
  const flush = () => { if (cur.trim()) out.push({ math: cur }); cur = ''; };
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === ' ') { flush(); const j = s.indexOf(' ', i + 1); out.push({ text: s.slice(i + 1, j) }); i = j; continue; }
    if ('({'.includes(ch)) depth++;
    if (')}'.includes(ch)) depth--;
    if (depth === 0 && (ch === ',' || ch === ';')) { flush(); out.push({ text: ch }); continue; }
    cur += ch;
  }
  flush();
  return out;
}

const INEQ = new RegExp(`${BS}${BS}(neq|leq|geq|lt|gt|circ|angle)|[<>]`);
// one part -> a statement, or null (not checkable), and records failures
function statement(part, where) {
  if (!part.includes('=')) return null;
  if (INEQ.test(part)) return null;
  const raw = part.replace(/^\{(.*)\}$/s, '$1').split('=').map(s => s.trim()).filter(Boolean);
  if (raw.length < 2) return null;
  const sides = raw.map(parse);
  if (sides.some(s => !s)) { skipped.push(`${where}: $${part.trim()}$`); return null; }
  const vars = new Set(); sides.forEach(s => varsOf(s, vars));
  const pm = sides.some(hasPm);
  const same = (x, y) => {
    for (const sg of pm ? [1, -1] : [1]) {
      let tested = 0;
      for (let k = 0; k < SAMPLES.length; k++) {
        const env = envAt(vars, k); const a = evalAst(x, env, sg), b = evalAst(y, env, sg);
        if (!Number.isFinite(a) || !Number.isFinite(b)) continue;
        tested++; if (!near(a, b)) return false;
      }
      if (!tested) return null;
    }
    return true;
  };
  const pairs = sides.slice(1).map((s, i) => same(sides[i], s));
  if (pairs.some(x => x === null)) { skipped.push(`${where}: $${part.trim()}$ (not evaluable)`); return null; }
  const bad = pairs.map((ok, i) => (ok ? -1 : i)).filter(i => i >= 0);
  let L, R;
  if (!bad.length) { pass++; return { kind: 'identity' }; }
  // a row that opens with "=" continues the working above it, so it can only be an identity
  const continued = /^\{?\s*=/.test(part.trim());
  if (continued || bad.length > 1 || !(bad[0] === 0 || bad[0] === pairs.length - 1)) {
    fails.push(`${where}: $${part.trim()}$ — its sides do not agree`); return null;
  }
  if (sides.length > 2) pass++;   // the rest of the chain holds
  L = sides[bad[0]]; R = sides[bad[0] + 1];
  if (vars.size === 0) { fails.push(`${where}: $${part.trim()}$ — ${numeric(L).join('/')} is not ${numeric(R).join('/')}`); return null; }
  if (vars.size > 1) return { kind: 'multi' };
  const v = [...vars][0];
  const lv = varsOf(L), rv = varsOf(R);
  // v = number (or v = a +- b): an assignment
  if ('x' in L && lv.size === 1 && rv.size === 0) return { kind: 'assign', v, vals: uniq(numeric(R)) };
  const fn = (x) => evalAst(L, { [v]: x }, 1) - evalAst(R, { [v]: x }, 1);
  const co = polyOf(fn);
  if (co && co.length === 1) { fails.push(`${where}: $${part.trim()}$ — the sides always differ by ${co[0]}`); return null; }
  return { kind: 'eq', v, fn, co, roots: co ? rootsOf(co) : null, src: part.trim() };
}

/* ---- blocks: rows, list items, paragraphs --------------------------- */

const unwrap = (s) => s.replace(/<span class="nb">([^<]*)<\/span>/g, '$1').replace(/<svg[\s\S]*?<\/svg>/g, ' ');
function htmlBlocks(html) {
  const s = unwrap(html);
  const out = [];
  for (const m of s.matchAll(/<div class="work__row">([\s\S]*?)<\/div>/g)) out.push(m[1]);
  const rest = s.replace(/<div class="work__row">[\s\S]*?<\/div>/g, ' ');
  for (const m of rest.matchAll(/<(p|li|figcaption)\b[^>]*>((?:(?!<\/?(?:p|li|ol)\b)[\s\S])*)<\/\1>/g)) out.push(m[2]);
  for (const m of rest.matchAll(/<div class="eq">([\s\S]*?)<\/div>/g)) out.push(m[1]);
  return out.map(b => b.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&[a-z]+;/g, ' '));
}
function mdBlocks(md) {
  const out = []; let cur = '';
  for (const line of md.split(/\r?\n/)) {
    if (/^\s*$/.test(line) || /^\s*(- |\d+\. |#)/.test(line)) { if (cur.trim()) out.push(cur); cur = ''; }
    cur += ' ' + line.replace(/^\s*(- |\d+\. )/, '');
  }
  if (cur.trim()) out.push(cur);
  return out.map(b => b.replace(/\*+/g, ' ').replace(/\$\$/g, '$'));
}

const EQUIV = /^[\s,:;.]*(that is|so|gives|which gives|this gives|becomes|when|or)[\s,:;]*$/i;
const OR = /^[\s,]*or[\s,]*$/i;
let spans = 0, stmts = 0;
function checkBlock(block, where) {
  // the sequence of statements and the words between them
  const seq = [];
  const parts = block.replace(/\$\$/g, '$').split('$');
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 0) { seq.push({ text: parts[i] }); continue; }
    spans++;
    for (const pc of pieces(parts[i])) {
      if (pc.text !== undefined) { seq.push({ text: pc.text }); continue; }
      const st = statement(pc.math, where);
      if (st) stmts++;
      seq.push(st && (st.kind === 'eq' || st.kind === 'assign') ? { st } : { text: '' });
    }
  }
  // merge text runs
  const toks = [];
  for (const t of seq) { if (t.text !== undefined && toks.length && toks[toks.length - 1].text !== undefined) toks[toks.length - 1].text += t.text; else toks.push(t); }
  // groups joined by "or"
  const groups = [];
  for (let i = 0; i < toks.length; i++) {
    const t = toks[i];
    if (!t.st) continue;
    const prev = groups[groups.length - 1];
    const between = i > 0 ? toks[i - 1].text : '';
    if (prev && prev.end === i - 2 && OR.test(between) && prev.v === t.st.v) { prev.items.push(t.st); prev.end = i; }
    else groups.push({ v: t.st.v, items: [t.st], start: i, end: i, before: between ?? '' });
  }
  const rootsOfGroup = (g) => { const r = []; for (const s of g.items) { if (s.kind === 'assign') r.push(...s.vals); else if (s.roots) r.push(...s.roots); else return null; } return uniq(r); };
  for (let k = 1; k < groups.length; k++) {
    const a = groups[k - 1], b = groups[k];
    if (a.v !== b.v || b.start !== a.end + 2) continue;
    if (!EQUIV.test(b.before) || b.before.includes('')) continue;
    const eqB = b.items.some(s => s.kind === 'eq');
    if (a.items.length === 1 && b.items.length === 1 && a.items[0].co && b.items[0].co) {
      is(`${where}: $${a.items[0].src}$ and $${b.items[0].src}$ should be the same equation`, proportional(a.items[0].co, b.items[0].co));
      continue;
    }
    const ra = rootsOfGroup(a), rb = rootsOfGroup(b);
    if (!ra || !rb) continue;
    if (a.items.every(s => s.kind === 'assign')) continue;
    if (eqB || b.items.length > 1 || ra.length === rb.length) is(`${where}: solutions ${fmt(rb)} should be ${fmt(ra)}`, sameSet(ra, rb));
    else is(`${where}: ${fmt(rb)} should be among the solutions ${fmt(ra)}`, rb.every(x => ra.some(y => near(x, y))));
  }
  // every assignment satisfies an equation of the block in its variable
  const eqs = toks.filter(t => t.st && t.st.kind === 'eq').map(t => t.st);
  for (const t of toks) {
    if (!t.st || t.st.kind !== 'assign') continue;
    const mine = eqs.filter(e => e.v === t.st.v);
    if (!mine.length) continue;
    for (const val of t.st.vals) is(`${where}: ${t.st.v} = ${val} satisfies no equation in its row`, mine.some(e => Math.abs(e.fn(val)) < 1e-7 * (1 + Math.abs(val) ** 3)));
  }
}

/* ---- the pages ------------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');

/* ---- A. every span -------------------------------------------------- */

for (const f of pages) htmlBlocks(html[f]).forEach((b, i) => checkBlock(b, `${f} block ${i + 1}`));
mdBlocks(answersMd).forEach((b, i) => checkBlock(b, `ANSWERS.md block ${i + 1}`));

/* ---- helpers for B -------------------------------------------------- */

const plain = (s) => unwrap(s).replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/&[a-z]+;/g, ' ').replace(/\*+/g, ' ').replace(/\s+/g, ' ');
// every number a piece of text prints: bare numbers, and every side of its maths that has a value
function valuesIn(s) {
  const t = plain(s).replace(/\$\$/g, '$');
  const out = [];
  const bits = t.split('$');
  bits.forEach((b, i) => {
    if (i % 2 === 0) { for (const m of b.matchAll(/(?<![A-Za-z])\d+(?:\.\d+)?/g)) out.push(Number(m[0])); return; }
    for (const pc of pieces(b)) {
      if (!pc.math || INEQ.test(pc.math)) continue;
      for (const side of pc.math.replace(/^\{(.*)\}$/s, '$1').split('=')) {
        const e = parse(side);
        if (e && varsOf(e).size === 0) out.push(...numeric(e));
      }
    }
  });
  return out.filter(Number.isFinite);
}
const prints = (what, s, ...vals) => { const have = valuesIn(s); for (const v of vals) is(`${what} should print ${+v.toFixed(6)}: "${plain(s).trim().slice(0, 160)}"`, have.some(h => near(h, v))); };
const squash = (s) => s.replace(/\s+/g, '');
const shows = (what, s, latex) => is(`${what} should print $${latex}$`, squash(plain(s)).includes(squash(latex)));
const eqOf = (latex) => {
  const [l, r] = latex.split('='); const L = parse(l), R = parse(r);
  const v = [...varsOf(L), ...varsOf(R)][0];
  const fn = (x) => evalAst(L, { [v]: x }, 1) - evalAst(R, { [v]: x }, 1);
  const co = polyOf(fn);
  return { fn, co, roots: rootsOf(co), disc: co.length === 3 ? co[1] ** 2 - 4 * co[2] * co[0] : null };
};
function example(src, n) {
  const i = src.indexOf(`<div class="c-example__tab">Example ${n}</div>`);
  if (i < 0) { fails.push(`Example ${n} not found`); return ''; }
  const j = src.indexOf('<div class="c-example__tab">', i + 10);
  return src.slice(i, j < 0 ? src.length : j);
}
const answerRow = (blk) => (blk.match(/work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/) || [, ''])[1];
const search = (lo, hi, step, ok) => { const r = []; for (let x = lo; x <= hi + 1e-9; x += step) if (ok(Math.round(x / step) * step)) r.push(Math.round(x / step) * step); return r; };
// real solutions of g(x) = 0 on (lo, hi), by sign change
function solveOn(g, lo, hi) {
  const out = []; const n = 200000; const h = (hi - lo) / n;
  let px = lo + h / 2, py = g(px);
  for (let k = 1; k < n; k++) {
    const x = lo + h / 2 + k * h, y = g(x);
    if (y === 0) out.push(x);
    if (Number.isFinite(py) && Number.isFinite(y) && py * y < 0 && Math.abs(py - y) < 1e3) {
      let a = px, b = x; for (let t = 0; t < 80; t++) { const m = (a + b) / 2; if (g(a) * g(m) <= 0) b = m; else a = m; } out.push((a + b) / 2);
    }
    px = x; py = y;
  }
  return uniq(out.map(x => Math.abs(x - Math.round(x * 1e6) / 1e6) < 1e-7 ? Math.round(x * 1e6) / 1e6 : x));
}
function mdSection(head) {
  const i = answersMd.indexOf(head);
  if (i < 0) { fails.push(`ANSWERS.md: no section "${head}"`); return ''; }
  const j = answersMd.slice(i + head.length).search(/\n#{2,3} /);
  return answersMd.slice(i, j < 0 ? undefined : i + head.length + j);
}
function mdItem(sec, n, part) {
  const m = sec.match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`));
  let r = m ? m[1] : '';
  if (part) { const p = r.match(new RegExp(`\\(${part}\\)([\\s\\S]*?)(?=\\n\\s*- \\(|$)`)); r = p ? p[1] : ''; }
  if (!r) fails.push(`ANSWERS.md: no item ${n}${part ? ` (${part})` : ''}`);
  return r.replace(/\s+/g, ' ');
}
const bold = (s) => (s.match(/\*\*([\s\S]*?)\*\*/g) || []).join(' ');
// the parts of a body question, as printed
function questionParts(src, start, stem) {
  const re = start ? `data-start="${start}">\\s*<li>` : `<li>${stem}`;
  const i = src.search(new RegExp(re));
  if (i < 0) { fails.push(`question ${start || stem} not found`); return []; }
  const seg = src.slice(i, src.indexOf('</ol>', src.indexOf('<ol class="c-parts', i)));
  return [...seg.matchAll(/<li>([^<]*?)<\/li>/g)].map(m => m[1].replace(/\$/g, '').trim());
}
const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii'];

/* ---- B. the body ---------------------------------------------------- */

{ // the prayer hall, Example 6
  const e = eqOf('2x^2 + x - 300 = 0');
  shows('4.1', body, '2x^2 + x - 300 = 0');
  const b = solveOn(x => x * (2 * x + 1) - 300, 0, 100);
  is(`hall: breadth ${fmt(b)} is a root`, b.length === 1 && e.roots.some(r => near(r, b[0])));
  const blk = example(body, 6);
  prints('Example 6', blk, ...e.roots, b[0], 2 * b[0] + 1);
}
{ // Example 1, from its words
  const blk = example(body, 1);
  const john = search(0, 45, 1, j => (j - 5) * (45 - j - 5) === 124);
  const e1 = eqOf('x^2 - 45x + 324 = 0');
  is(`Ex 1 (i): the marbles ${fmt(john)} are the roots ${fmt(e1.roots)}`, sameSet(john, e1.roots));
  const toys = search(0, 55, 1, x => x * (55 - x) === 750);
  const e2 = eqOf('x^2 - 55x + 750 = 0');
  is(`Ex 1 (ii): the toys ${fmt(toys)} are the roots ${fmt(e2.roots)}`, sameSet(toys, e2.roots));
  shows('Example 1 answer', answerRow(blk), 'x^2 - 45x + 324 = 0');
  shows('Example 1 answer', answerRow(blk), 'x^2 - 55x + 750 = 0');
}
{ // Example 2: which are quadratic
  const blk = example(body, 2);
  const ex2 = [...blk.slice(0, blk.indexOf('Solution.')).matchAll(/<li>([^<]*?)<\/li>/g)].map(m => m[1].replace(/\$/g, ''));
  is(`Example 2 has four parts (${ex2.length})`, ex2.length === 4);
  const quad = ex2.map(p => eqOf(p).co.length === 3);
  const row = plain(answerRow(blk));
  const yes = ROMAN.slice(0, 4).filter((_, i) => quad[i]).map(r => `(${r})`);
  const no = ROMAN.slice(0, 4).filter((_, i) => !quad[i]).map(r => `(${r})`);
  is(`Example 2: answer should name ${yes.join(', ')} as quadratic and ${no.join(', ')} as not: "${row}"`,
    row.includes(`${yes.slice(0, -1).join(', ')} and ${yes[yes.length - 1]} are quadratic`) && row.includes(`${no.join(' ')} is not`));
}
for (const [n, eq, extra] of [
  [3, '2x^2 - 5x + 3 = 0'],
  [4, '6x^2 - x - 2 = 0'],
  [5, '3x^2 - 2\\sqrt{6}x + 2 = 0'],
  [7, '2x^2 - 4x + 3 = 0', 'disc'],
  [9, '3x^2 - 2x + \\frac{1}{3} = 0', 'disc'],
]) {
  const latex = eq.replace(/\\\\/g, BS);
  const e = eqOf(latex);
  const blk = example(body, n);
  shows(`Example ${n}`, blk, latex);
  if (e.roots.length) prints(`Example ${n} answer`, answerRow(blk), ...e.roots);
  else is(`Example ${n}: no real roots, and the answer says so`, /no real roots/.test(answerRow(blk)));
  if (extra) prints(`Example ${n} discriminant`, blk, e.disc);
  if (e.disc !== null && near(e.disc, 0)) is(`Example ${n}: equal roots`, /equal|repeated/.test(plain(blk)) || /same factor/.test(body));
}
{ // Example 8, the pole: solved again from the geometry
  const blk = example(body, 8);
  const x = solveOn(t => (t + 7) ** 2 + t ** 2 - 13 ** 2, 0, 13);
  const e = eqOf('x^2 + 7x - 60 = 0');
  is(`Ex 8: the pole's distance ${fmt(x)} is a root of the printed equation`, x.length === 1 && e.roots.some(r => near(r, x[0])));
  prints('Example 8', blk, e.disc, ...e.roots);
  prints('Example 8 answer', answerRow(blk), x[0], x[0] + 7);
}

// Exercise Set 4.1
{
  const sec = mdSection('### Exercise Set 4.1');
  const parts = questionParts(body, null, 'Check whether each of these is a quadratic equation.<ol');
  is('Set 4.1 Q1 has eight parts', parts.length === 8);
  parts.forEach((p, i) => {
    const e = eqOf(p);
    const line = mdItem(sec, 1, ROMAN[i]);
    const isQuad = e.co.length === 3;
    is(`Set 4.1 Q1 (${ROMAN[i]}): ${isQuad ? 'Yes' : 'No'} expected: "${line}"`, new RegExp(`\\*\\*${isQuad ? 'Yes' : 'No'}`).test(line));
    const reduced = [...line.matchAll(/\$([^$]*= 0)\$/g)].pop();
    is(`Set 4.1 Q1 (${ROMAN[i]}): a reduced equation is printed`, !!reduced);
    if (reduced) is(`Set 4.1 Q1 (${ROMAN[i]}): $${reduced[1]}$ is the page's equation rearranged`, proportional(eqOf(reduced[1]).co, e.co));
  });
  const words = [
    ['i', x => x * (2 * x + 1) - 528],
    ['ii', x => x * (x + 1) - 306],
    ['iii', x => (x + 3) * (x + 26 + 3) - 360],
    ['iv', u => 480 * u - 480 * (u - 8) - 3 * u * (u - 8)],   // 480/(u - 8) - 480/u = 3, times u(u - 8)
  ];
  for (const [r, g] of words) {
    const line = mdItem(sec, 2, r);
    const last = [...line.matchAll(/\$([^$]*= 0)\$/g)].pop();
    is(`Set 4.1 Q2 (${r}): an equation is printed`, !!last);
    if (last) is(`Set 4.1 Q2 (${r}): $${last[1]}$ matches the words`, proportional(polyOf(g), eqOf(last[1]).co));
  }
}
// Exercise Set 4.2
{
  const sec = mdSection('### Exercise Set 4.2');
  const parts = questionParts(body, null, 'Find the roots of each quadratic equation by factorisation.<ol');
  is('Set 4.2 Q1 has five parts', parts.length === 5);
  parts.forEach((p, i) => {
    const e = eqOf(p);
    const line = mdItem(sec, 1, ROMAN[i]);
    const b = uniq(valuesIn((line.match(/\*\*([\s\S]*?)\*\*/g) || []).join(' ')));
    is(`Set 4.2 Q1 (${ROMAN[i]}): roots ${fmt(e.roots)}, printed ${fmt(b)}`, sameSet(e.roots, b));
  });
  const q2 = mdItem(sec, 2);
  const john = search(0, 45, 1, j => (j - 5) * (40 - j) === 124);
  prints('Set 4.2 Q2 (i)', q2, ...john);
  const toys = search(0, 55, 1, x => x * (55 - x) === 750);
  prints('Set 4.2 Q2 (ii)', q2, ...toys);
  const q3 = search(0, 27, 1, x => x * (27 - x) === 182);
  is(`Set 4.2 Q3: ${fmt(q3)}`, sameSet(q3, uniq(valuesIn(bold(mdItem(sec, 3)).replace(/\*\*/g, '')))));
  const q4 = search(1, 100, 1, n => n * n + (n + 1) ** 2 === 365);
  is(`Set 4.2 Q4: ${fmt(q4)}`, sameSet([q4[0], q4[0] + 1], uniq(valuesIn(bold(mdItem(sec, 4)).replace(/\*\*/g, '')))));
  const q5 = solveOn(b => b * b + (b - 7) ** 2 - 169, 7, 13);
  is(`Set 4.2 Q5: base ${fmt(q5)}`, sameSet([q5[0], q5[0] - 7], uniq(valuesIn(bold(mdItem(sec, 5)).replace(/\*\*/g, '')))));
  const q6 = solveOn(x => x * (2 * x + 3) - 90, 0, 90);
  is(`Set 4.2 Q6: ${fmt(q6)} articles at ${2 * q6[0] + 3}`, sameSet([q6[0], 2 * q6[0] + 3], uniq(valuesIn(bold(mdItem(sec, 6)).replace(/\*\*/g, '')))));
}
// Exercise Set 4.3
{
  const sec = mdSection('### Exercise Set 4.3');
  const parts = questionParts(body, null, 'Find the nature of the roots of each quadratic equation. If it has real roots, find them.<ol');
  is('Set 4.3 Q1 has three parts', parts.length === 3);
  parts.forEach((p, i) => {
    const e = eqOf(p);
    const line = mdItem(sec, 1, ROMAN[i]);
    prints(`Set 4.3 Q1 (${ROMAN[i]}) discriminant`, line, e.disc);
    const nature = e.disc < -1e-9 ? 'no real roots' : near(e.disc, 0) ? 'two equal real roots' : 'two distinct real roots';
    is(`Set 4.3 Q1 (${ROMAN[i]}): "${nature}" expected: "${line}"`, bold(line).includes(nature));
    if (e.roots.length) prints(`Set 4.3 Q1 (${ROMAN[i]}) roots`, line, ...e.roots);
  });
  const k1 = solveOn(k => k * k - 4 * 2 * 3, -20, 20);
  prints('Set 4.3 Q2 (i)', mdItem(sec, 2, 'i'), ...k1);
  const k2all = search(-20, 20, 1, k => (-2 * k) ** 2 - 4 * k * 6 === 0);
  is(`Set 4.3 Q2 (ii): k = ${fmt(k2all)}, less k = 0`, k2all.includes(0) && sameSet(uniq(k2all.filter(k => k !== 0)), uniq(valuesIn(bold(mdItem(sec, 2, 'ii')).replace(/\*\*/g, '')))));
  const g3 = solveOn(x => 2 * x * x - 800, 0, 100);
  prints('Set 4.3 Q3', mdItem(sec, 3), g3[0], 2 * g3[0]);
  { const best = Math.max(...search(4, 16, 0.01, () => true).map(x => (x - 4) * (16 - x)));
    is(`Set 4.3 Q4: the largest product is ${best}, below 48, so not possible`, best < 48 && /not possible/.test(mdItem(sec, 4)));
    prints('Set 4.3 Q4', mdItem(sec, 4), eqOf('x^2 - 20x + 112 = 0').disc); }
  const g5 = search(0, 40, 0.5, x => x * (40 - x) === 400);
  is('Set 4.3 Q5: 400 is the largest area', Math.max(...search(0, 40, 0.01, () => true).map(x => x * (40 - x))) <= 400 + 1e-9);
  is(`Set 4.3 Q5: one side, ${fmt(uniq(g5))}`, uniq(g5).length === 1);
  prints('Set 4.3 Q5', mdItem(sec, 5), uniq(g5)[0], eqOf('x^2 - 40x + 400 = 0').disc);
}
// the checks in the running text
{
  const sec = mdSection('### The question in the running text\n\n- **Example 3');
  prints('Example 3 check', sec, 0);
  is('Example 3: both roots satisfy', [1, 1.5].every(x => near(2 * x * x - 5 * x + 3, 0)));
}

/* ---- B. Beyond the Book -------------------------------------------- */

// Stage 1: each question, and the paragraph that answers it
const tries = [];
{
  const src = unwrap(beyond.slice(0, beyond.indexOf('c-stage__num">2')));
  for (const m of src.matchAll(/<div class="c-try">\s*<p>([\s\S]*?)<\/p>\s*<\/div>\s*<p>([\s\S]*?)<\/p>/g)) tries.push({ q: m[1], a: m[2] });
  is(`Stage 1 has five questions (${tries.length})`, tries.length === 5);
}
if (tries.length === 5) {
  const ks = solveOn(k => k * k - 36, -20, 20);
  prints('Stage 1 Q1', tries[0].a, ...ks, ...ks.map(k => -k / 2));
  const k2 = -(2 ** 2 - 5 * 2);
  prints('Stage 1 Q2', tries[1].a, k2, 5 - 2);
  is('Stage 1 Q2: the other root satisfies', near(3 ** 2 - 5 * 3 + k2, 0));
  prints('Stage 1 Q3', tries[2].a, eqOf('2x^2 - 3x + 2 = 0').disc);
  is('Stage 1 Q3: no number has x + 1/x = 3/2', !solveOn(x => x + 1 / x - 1.5, 0.01, 100).length && !solveOn(x => x + 1 / x - 1.5, -100, -0.01).length);
  const odd = search(-100, 100, 1, x => Math.abs(x % 2) === 1 && x * (x + 2) === 143);
  prints('Stage 1 Q4', tries[3].a, ...odd, ...odd.map(x => x + 2));
  is('Stage 1 Q5: p^2 + 4 is never below 4', Math.min(...search(-50, 50, 0.25, () => true).map(p => p * p + 4)) === 4);
  shows('Stage 1 Q5', tries[4].a, `p^2 + 4 ${BS}geq 4`);
}

// Solved Examples
const B2 = beyond.slice(beyond.indexOf('c-stage__num">2'), beyond.indexOf('c-practice__num'));
const optsIn = (blk) => { const m = blk.match(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*?)<\/ol>/); return m ? [...m[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => plain(x[1]).trim()) : []; };
const letterOf = (blk) => (plain(answerRow(blk)).match(/\(([a-d])\)/) || [])[1];
const oneRight = (what, blk, truth) => {
  const o = optsIn(blk);
  is(`${what} has four options`, o.length === 4);
  const right = o.map(truth).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  is(`${what}: right option(s) ${right.join(',') || 'none'}, answer (${letterOf(blk)})`, right.length === 1 && right[0] === letterOf(blk));
};
const setOf = (s) => uniq(valuesIn(s.replace(/ and |, | or /g, '$ $').replace(/^|$/g, '$').replace(/\$\$/g, '$').replace(/\$(\s*)\$/g, '$1')));
const optVals = (s) => { const t = s.replace(/ only$/, ''); return t.split(/ and |, | or /).map(x => parse(x.replace(/\$/g, ''))).map(e => (e ? evalAst(e, {}, 1) : NaN)); };
{
  let b = example(B2, 1);
  { const q = plain(b).match(/\$\(x \+ 1\)\^3 = x\^3 \+ 2x - 5\$/); is('B Ex 1 question', !!q);
    const e = eqOf('(x + 1)^3 = x^3 + 2x - 5');
    is('B Ex 1: degree 2', e.co.length === 3);
    const row = plain(answerRow(b));
    const a = +row.match(/a = (-?\d+)/)[1], bb = +row.match(/b = (-?\d+)/)[1], c = +row.match(/c = (-?\d+)/)[1];
    is(`B Ex 1: a, b, c = ${[a, bb, c]} against ${fmt([...e.co].reverse())}`, proportional([c, bb, a], e.co) && /Yes/.test(row)); }
  b = example(B2, 2);
  { const w = solveOn(x => x * (x + 3) - 180, 0, 100); const e = eqOf('x^2 + 3x - 180 = 0');
    is(`B Ex 2: breadth ${fmt(w)} is a root`, e.roots.some(r => near(r, w[0])));
    shows('B Ex 2 answer', answerRow(b), 'x^2 + 3x - 180 = 0');
    prints('B Ex 2 remark', b, ...e.roots, w[0], w[0] + 3); }
  b = example(B2, 3);
  { const e = eqOf('2x^2 - 7x + 3 = 0'); oneRight('B Ex 3', b, o => sameSet(uniq(optVals(o)), e.roots));
    prints('B Ex 3 steps', b, ...e.roots);
    is('B Ex 3: (c) are the roots of 2x^2 - 5x + 3', sameSet(uniq(optVals(optsIn(b)[2])), eqOf('2x^2 - 5x + 3 = 0').roots));
    is('B Ex 3: (d) are the roots of x^2 - 7x + 6', sameSet(uniq(optVals(optsIn(b)[3])), eqOf('x^2 - 7x + 6 = 0').roots));
    is('B Ex 3: (b) are the roots of (2x + 1)(x + 3)', sameSet(uniq(optVals(optsIn(b)[1])), eqOf('(2x + 1)(x + 3) = 0').roots)); }
  b = example(B2, 4);
  { const e = eqOf(`x^2 - (${BS}sqrt{2} + 1)x + ${BS}sqrt{2} = 0`); prints('B Ex 4 answer', answerRow(b), ...e.roots); }
  b = example(B2, 5);
  { const r = uniq([...solveOn(x => x - 1 / x - 1.5, -50, -0.001), ...solveOn(x => x - 1 / x - 1.5, 0.001, 50)]);
    is(`B Ex 5: two solutions ${fmt(r)}`, r.length === 2); prints('B Ex 5 answer', answerRow(b), ...r); }
  b = example(B2, 6);
  { const n = search(2, 100, 2, x => x * x + (x + 2) ** 2 === 340);
    oneRight('B Ex 6', b, o => { const v = optVals(o); return v[0] === n[0] && v[1] === n[0] + 2; });
    const o = optsIn(b); prints('B Ex 6 remark', b, ...[o[1], o[2]].map(s => optVals(s).reduce((t, x) => t + x * x, 0))); }
  b = example(B2, 7);
  { const u = solveOn(x => 360 / x - 360 / (x + 5) - 1, 0.5, 500);
    oneRight('B Ex 7', b, o => near(optVals(o)[0], u[0]));
    is('B Ex 7: 36 km/h does not fit', !near(360 / 36 - 360 / 41, 1)); prints('B Ex 7 remark', b, 360 / 36, 360 / 41);
    prints('B Ex 7 steps', b, ...eqOf('u^2 + 5u - 1800 = 0').roots); }
  b = example(B2, 8);
  { const w = solveOn(x => (20 - 2 * x) * (14 - 2 * x) - (280 - 120), 0, 7);
    prints('B Ex 8 answer', answerRow(b), ...w); prints('B Ex 8 steps', b, ...eqOf('w^2 - 17w + 30 = 0').roots, 20 * 14 - 120);
    shows('B Ex 8 steps', b, `${20 * 14} - 120`);
    is('B Ex 8: w = 15 is too wide', 14 - 2 * 15 < 0); }
  b = example(B2, 9);
  { const e = eqOf('4x^2 - 12x + 9 = 0'); const nat = e.disc < 0 ? 'no real roots' : near(e.disc, 0) ? 'two equal real roots' : 'two distinct real roots';
    oneRight('B Ex 9', b, o => o === nat); prints('B Ex 9', b, e.disc); }
  b = example(B2, 10);
  { const e = eqOf(`2x^2 - 2${BS}sqrt{2}x + 1 = 0`); prints('B Ex 10', b, e.disc); prints('B Ex 10 answer', answerRow(b), ...e.roots);
    is('B Ex 10: equal roots', near(e.disc, 0) && /equal/.test(answerRow(b))); }
  b = example(B2, 11);
  { const real = (k) => k !== 0 && 16 - 4 * k >= 0;
    const preds = { 'k ≤ 4': k => k <= 4, 'k < 4': k => k < 4, 'k ≥ 4': k => k >= 4, 'k ≤ 4, k ≠ 0': k => k <= 4 && k !== 0 };
    const ks = [-7, -1, 0, 1, 3.5, 4, 4.5, 9];
    oneRight('B Ex 11', b, o => { const key = o.replace(/\$/g, '').replace(/\\leq/g, '≤').replace(/\\geq/g, '≥').replace(/\\lt/g, '<').replace(/\\neq/g, '≠').replace(/\s+/g, ' ').trim(); const f = preds[key]; if (!f) { fails.push(`B Ex 11: option "${key}" not understood`); return false; } return ks.every(k => f(k) === real(k)); }); }
  b = example(B2, 12);
  { const disc = (k) => (2 * (k - 1)) ** 2 - 4 * (k + 1);
    const ks = uniq([...search(-20, 20, 1, k => disc(k) === 0)]);
    is(`B Ex 12: k = ${fmt(ks)}, none making the x^2 term vanish`, ks.length === 2 && ks.every(k => k + 1 !== 0));
    prints('B Ex 12 answer', answerRow(b), ...ks, ...ks.map(k => 2 * (k - 1) / (2 * (k + 1))));
    prints('B Ex 12 steps', b, ...ks); }
  b = example(B2, 13);
  { const k = -(4 + 12) / 2; const q = k * k / 4;
    prints('B Ex 13 answer', answerRow(b), k, q); prints('B Ex 13 check', b, -k / 2); }
  b = example(B2, 14);
  { const e = eqOf('x^2 - 4x - 1 = 0'); prints('B Ex 14', b, e.disc); prints('B Ex 14 answer', answerRow(b), ...e.roots); }
  b = example(B2, 15);
  { const g = (x) => 1 / x - 1 / (x - 2) - 3;
    const r = uniq([...solveOn(g, -20, -0.0001), ...solveOn(g, 0.0001, 1.9999), ...solveOn(g, 2.0001, 20)]);
    is(`B Ex 15: two solutions ${fmt(r)}`, r.length === 2); prints('B Ex 15 answer', answerRow(b), ...r);
    prints('B Ex 15', b, eqOf('3x^2 - 6x + 2 = 0').disc); }
  b = example(B2, 16);
  { const best = Math.max(...search(0, 14, 0.01, () => true).map(x => x * (14 - x)));
    is(`B Ex 16: the largest area is ${best}, below 50, and the answer is No`, best < 50 && /^\s*No/.test(plain(answerRow(b))));
    prints('B Ex 16', b, eqOf('x^2 - 14x + 50 = 0').disc, 28 / 2); }
  const count = (B2.match(/c-example__tab/g) || []).length;
  is(`Beyond has 16 examples (${count}), numbered from 1`, count === 16 && /Example 1<\/div>/.test(B2));
}

// Practice answers, read back out of the key rows
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= m[2];
const partOf = (r, part) => { if (!part) return r; const m = plain(r).match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\)|$)`)); return m ? m[1] : ''; };
const row = (q) => { const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/); return partOf(keyRows[n] || '', part); };
const mdPractice = answersMd.slice(answersMd.indexOf('The working for each'));
const mdRow = (q) => { const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/); const m = mdPractice.match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`)); return partOf(m ? m[1] : '', part); };
function practice(q, ...vals) { prints(`key ${q}`, row(q), ...vals); prints(`ANSWERS.md ${q}`, mdRow(q), ...vals); }
const says = (q, re) => { is(`key ${q} should say ${re}: "${plain(row(q))}"`, re.test(plain(row(q)))); is(`ANSWERS.md ${q} should say ${re}: "${plain(mdRow(q))}"`, re.test(plain(mdRow(q)))); };
{
  const qtext = (n) => { const m = beyond.match(new RegExp(`data-start="${n}">\\s*<li>([\\s\\S]*?)</li>\\s*</ol>\\s*</div>`)); return m ? m[1] : ''; };
  const eqIn = (n) => plain(qtext(n)).match(/\$([^$]*= 0)\$/)[1];
  practice(20, eqOf(eqIn(20)).disc);
  practice(21, ...eqOf(eqIn(21)).roots);
  { const k = solveOn(k => k * 9 - 5 * 3 - 3, -50, 50); is('Q22 asks about 3', /3 a root/.test(plain(qtext(22)))); practice(22, ...k); }
  practice(23, ...eqOf(eqIn(23)).roots);
  { let ok = true; for (const [a, b] of [[1.3, 0.4], [-2, 5], [3, 0]]) for (const r of [a + b, a - b]) ok = ok && near(r * r - 2 * a * r + a * a - b * b, 0);
    is('Q24: a + b and a - b are the roots', ok); says(24, /a \+ b\$? and \$?a - b/); says(24, /4b\^2/); }
  { const e = eqOf(eqIn(25)); practice(25, e.disc, ...e.roots); }
  { const x = search(0.5, 14.5, 0.5, t => near(1 / t + 1 / (15 - t), 3 / 10)); practice(26, ...x); }
  { const q = plain(qtext(27)); const [d, slower, later] = [Number(q.match(/rides (\d+) km/)[1]), Number(q.match(/(\d+) km\/h slower/)[1]), Number(q.match(/takes (\d+) hour longer/)[1])];
    const s = solveOn(t => d / (t - slower) - d / t - later, slower + 0.001, 500);
    is('Q27: one positive speed', s.length === 1);
    const back = s[0] - slower, total = d / s[0] + d / back;
    practice(27, s[0], back, total); says(27, new RegExp(`at ${s[0]} km/h`));
    shows('key 27', row(27), `${d / s[0]} + ${d / back} = ${total}`);
    is('Q27: 300 = x^2 - 5x is the equation cleared', [s[0], -15].every(r => near(r * r - slower * r - d * slower / later, 0)) && /300 = x\^2 - 5x/.test(plain(row(27)))); }
  { const q = plain(qtext(28)); const target = Number(q.match(/is (\d+)\.?$/)[1]);
    const x = search(1, 100, 1, t => t * t + (t + 1) * (t + 2) === target);
    is('Q28: one set of integers', x.length === 1);
    practice(28, x[0], x[0] + 1, x[0] + 2);
    says(28, new RegExp(`${x[0]}, ${x[0] + 1} and ${x[0] + 2}`));
    const e = eqOf('2x^2 + 3x - 44 = 0'); is('Q28: 2x^2 + 3x - 44 = 0 has roots 4 and -11/2', sameSet(e.roots, [x[0], -11 / 2]));
    is('Q28: the expanded equation', [0, 1, 2, 3, 4, 5].every(t => near(t * t + (t + 1) * (t + 2) - target, 2 * t * t + 3 * t - 44)));
    prints('ANSWERS.md 28 discriminant', mdRow(28), e.disc); }
  { const x = search(1, 200, 1, t => near(80 / t - 80 / (t + 4), 1)); practice(29, ...x); says(29, new RegExp(`bought ${x[0]} books`)); }
  const h = (t) => 20 * t - 5 * t * t;
  const t15 = solveOn(t => h(t) - 15, 0, 10);
  practice('30a', ...t15);
  says('30a', new RegExp(`at ${t15[0]} s and ${t15[1]} s`));
  says('30c', new RegExp(`after ${solveOn(t => h(t), 0.001, 10)[0]} s`));
  says('30d', new RegExp(`one time, ${search(0, 4, 0.001, t => near(h(t), 20))[0].toFixed(0)} s`));
  { const top = Math.max(...search(0, 4, 0.001, () => true).map(h)); is(`Q30 (b): the ball rises only to ${top}`, top < 25); says('30b', /no/); practice('30b', eqOf('t^2 - 4t + 5 = 0').disc); }
  practice('30c', ...solveOn(t => h(t), 0.001, 10));
  { const at20 = search(0, 4, 0.001, t => near(h(t), 20)); is(`Q30 (d): 20 m at ${fmt(at20)} only`, at20.length === 1); practice('30d', at20[0], eqOf('t^2 - 4t + 4 = 0').disc); }
  { const r = search(1, 100, 1, n => n * (n + 4) === 396); is('Q31 table prints 396', /396/.test(plain(qtext(31)))); practice('31b', r[0], r[0] + 4); shows('key 31 (a)', row('31a'), 'r^2 + 4r - 396 = 0');
    const d = eqOf('r^2 + 4r - 400 = 0').disc; practice('31c', d); is('Q31 (c): 1616 is not a square', !Number.isInteger(Math.sqrt(d))); says('31c', /no/);
    is('Q31 (c): no whole number of rows gives 400', !search(1, 100, 1, n => n * (n + 4) === 400).length); }
}

/* ---- C. multiple choice and assertion-reason ------------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) {
  const pos = m.index; const n = Number(m[1] || 1);
  if (pos > beyond.indexOf('c-practice__num')) qs[n] = m[2];
}
const optsOf = (n) => { const m = (qs[n] || '').match(/<ol class="c-parts[^"]*">([\s\S]*)<\/ol>/); return m ? [...m[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => plain(x[1]).trim()) : []; };
const stemOf = (n) => plain((qs[n] || '').replace(/<ol[\s\S]*/, ''));
const key = {};
{
  const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of plain(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2];
}
const stemEq = (n) => stemOf(n).match(/\$([^$]*=[^$]*)\$/)[1];
const natureOf = (d) => (d < -1e-9 ? 'no real roots' : near(d, 0) ? 'two equal real roots' : 'two distinct real roots');
const solve = {
  1: o => o.map(s => eqOf(s.replace(/\$/g, '')).co.length === 3),
  2: o => o.map(s => sameSet(uniq(optVals(s)), eqOf(stemEq(2)).roots)),
  3: o => o.map(s => near(optVals(s)[0], eqOf(stemEq(3)).disc)),
  4: o => o.map(s => { const k = optVals(s)[0]; return near(2 * 2 + k * 2 - 6, 0); }),
  5: o => o.map(s => /\d only$/.test(s) ? false : sameSet(uniq(optVals(s)), eqOf(stemEq(5)).roots) && /and/.test(s)),
  6: o => o.map(s => !/only/.test(s) && sameSet(uniq(optVals(s)), eqOf(stemEq(6)).roots)),
  7: o => o.map(s => { const ks = uniq(optVals(s)); const good = search(-50, 50, 1, k => (2 * k) ** 2 - 64 === 0); return sameSet(ks, good); }),
  8: o => o.map(s => near(optVals(s)[0], Math.max(...search(1, 100, 1, n => n * (n + 1) === 132).map(n => n + 1)))),
  9: o => o.map(s => { const e = parse(s.replace(/\$/g, '')); if (!e) return false;
    return [[1, 2], [3, -4], [-2, 5]].every(([a, b]) => near(evalAst(e, { a, b }, 1), b * b / (4 * a))); }),
  10: o => { const e = eqOf(stemEq(10)); const kiran = e.roots.length === 1 && near(e.roots[0], 1); const lata = near(e.disc, 0);
    const want = kiran && lata ? 'both' : kiran ? 'only Kiran' : lata ? 'only Lata' : 'neither'; return o.map(s => s === want); },
  11: o => o.map(s => !/only/.test(s) && sameSet(uniq(optVals(s)), solveOn(x => x + x * x - 42, -50, 50))),
  12: o => o.map(s => sameSet([optVals(s)[0]], search(1, 100, 1, x => x * (x + 30) === 400))),
  13: o => { const e = eqOf(stemEq(13)); return o.map(s => (/roots? .*and/.test(s) ? sameSet(uniq(optVals(s.replace(/^the roots /, ''))), e.roots) : s === natureOf(e.disc).replace(' real', '') || s === natureOf(e.disc))); },
  14: o => o.map(s => { const p = optVals(s)[0]; return p * p - 64 < 0; }),
  15: o => o.map(s => { const x = solveOn(t => t * t + (t + 5) ** 2 - 625, 0, 25); return near(parseFloat(s), x[0]); }),
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  is(`Q${q}: right option(s) ${right.join(',') || 'none'}, key ${key[q]}`, right.length === 1 && right[0] === key[q]);
}
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const arA = (n) => plain(qs[n] || '').match(/Assertion \(A\): (.*?) Reason/)[1];
{
  const e16 = eqOf(arA(16).match(/\$([^$]*)\$/)[1]);
  const e17 = eqOf(arA(17).match(/\$([^$]*)\$/)[1]);
  const e18 = eqOf(arA(18).match(/\$([^$]*)\$/)[1]);
  const e19 = eqOf(arA(19).match(/\$([^$]*)\$/)[1]);
  const three = Number(arA(18).match(/^(\d+) is a root/)[1]);
  const AR = {
    16: [e16.roots.length === 0, true, e16.disc < 0],
    17: [e17.co.length === 3, true, false],
    18: [near(e18.fn(three), 0), true, false],
    19: [e19.roots.length === 1 && near(e19.disc, 0), false, false],
  };
  for (const [q, v] of Object.entries(AR)) is(`Q${q}: assertion-reason ${arLetter(v)}, key ${key[q]}`, arLetter(v) === key[q]);
}
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
is('key covers 1-19', JSON.stringify(Object.keys(key).map(Number).sort((a, b) => a - b)) === JSON.stringify([...Array(19)].map((_, i) => i + 1)));
{
  const starts = [...beyond.slice(beyond.indexOf('c-practice__num')).matchAll(/data-start="(\d+)"/g)].map(m => Number(m[1]));
  is(`practice numbered 2-31 in order: ${starts.join(' ')}`, JSON.stringify(starts) === JSON.stringify([...Array(30)].map((_, i) => i + 2)));
}

/* ---- D. ANSWERS.md prints the same key ------------------------------ */

{
  const at = answersMd.indexOf('as the key prints it');
  const mdKey = {};
  for (const m of answersMd.slice(at, at + 400).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2];
  is(`ANSWERS.md key ${JSON.stringify(mdKey)} matches the page ${JSON.stringify(key)}`, JSON.stringify(mdKey) === JSON.stringify(key));
  // and the letter each working line starts with
  for (let q = 1; q <= 19; q++) { const m = mdRow(q).match(/^\s*\(([a-d])\)/); is(`ANSWERS.md working ${q} starts with the key letter`, m && m[1] === key[q]); }
}

/* ---- report --------------------------------------------------------- */

console.log(`A  ${spans} maths spans read, ${stmts} statements checked; ${skipped.length} parts not checkable, skipped`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
