#!/usr/bin/env node
/* Re-derive every number and every expression this chapter prints.
   Nothing here restates a printed answer as its own truth. Each claim is
   worked out from the question as the page prints it, and compared with
   what the page or ANSWERS.md says.

     node pages/class-8/ch04-expressions/check-numbers.mjs [--skipped]

   The chapter is algebra, so the mathematics is done two ways:
     - a side of an identity is evaluated at random values of its letters,
       so that a wrong sign or coefficient anywhere shows up as a mismatch;
     - an expression is expanded exactly into a polynomial when the degree,
       a coefficient or the number of terms is what is being claimed.

   Four parts:
     A  every span set as maths, on every page and in ANSWERS.md, that
        contains "=": all its sides must agree. An identity must agree at
        random values. A statement true only for particular values must be
        listed in CONDITIONAL with those values, and is checked at them. A
        statement printed to be judged false is listed in FALSE_ON_PURPOSE
        and must really be false.
     B  what A cannot see: every body exercise answer in ANSWERS.md,
        worked from the question on the page, one lettered part at a time;
        every worked example's Answer row, worked from its question; the
        practice answers, read back out of the key rows
     C  every multiple-choice question has exactly one right option, and it
        is the one the key prints; assertion-reason letters are derived
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

/* ---- LaTeX to a syntax tree ------------------------------------ */

function braced(s, i) { // s[i] === '{'; returns [inner, indexAfter]
  let d = 0;
  for (let j = i; j < s.length; j++) {
    if (s[j] === '{') d++;
    else if (s[j] === '}' && --d === 0) return [s.slice(i + 1, j), j + 1];
  }
  throw new Error('unbalanced');
}
function prep(src) {
  let s = src
    .replace(/[.,]\s*$/, '') // the full stop that ends a displayed sentence
    .replace(/\\left|\\right|\\big|\\Big/g, '')
    .replace(/\\[,;:! ]|\\quad|\\qquad|&nbsp;|&thinsp;/g, '')
    .replace(/−/g, '-')
    .replace(/\\times|\\cdot/g, '*').replace(/\\div/g, '/');
  // fractions and roots, innermost first
  for (let guard = 0; /\\[dt]?frac|\\sqrt/.test(s) && guard < 50; guard++) {
    s = s.replace(/\\[dt]?frac(\d)(\d)/, '(($1)/($2))');
    const m = s.match(/\\[dt]?frac\s*(?=\{)|\\sqrt\s*(?=\{)/);
    if (!m) break;
    const at = m.index + m[0].length;
    if (m[0].startsWith('\\sqrt')) {
      const [a, e] = braced(s, at);
      s = s.slice(0, m.index) + 'S(' + a + ')' + s.slice(e);
    } else {
      const [a, e1] = braced(s, at);
      const [b, e2] = braced(s, e1);
      s = s.slice(0, m.index) + '((' + a + ')/(' + b + '))' + s.slice(e2);
    }
  }
  s = s.replace(/[{]/g, '(').replace(/[}]/g, ')');
  if (/\\|[^0-9a-zA-Z+\-*/^().\s]/.test(s)) return null;
  return s;
}
function tokens(s) {
  const out = [];
  // S( first: a root must not be read as a letter S
  const re = /\s*(S\(|\d+(?:\.\d+)?|[a-zA-Z]|[-+*/^()])/y;
  let m;
  while (re.lastIndex < s.length) {
    const at = re.lastIndex;
    if (/^\s*$/.test(s.slice(at))) break;
    m = re.exec(s);
    if (!m) return null;
    out.push(m[1]);
  }
  return out;
}
function parse(src) {
  const s = prep(src);
  if (s === null) return null;
  const t = tokens(s.replace(/S\(/g, ' S( '));
  if (!t || !t.length) return null;
  let i = 0;
  const peek = () => t[i];
  const startsAtom = (x) => x !== undefined && (/^[\d.]/.test(x) || /^[a-zA-Z]$/.test(x) || x === '(' || x === 'S(');
  function expr() {
    let n = term();
    while (peek() === '+' || peek() === '-') { const op = t[i++]; n = { op, a: n, b: term() }; }
    return n;
  }
  function term() {
    let n = unary();
    for (;;) {
      if (peek() === '*' || peek() === '/') { const op = t[i++]; n = { op, a: n, b: unary() }; }
      else if (startsAtom(peek())) n = { op: '*', a: n, b: power() };
      else return n;
    }
  }
  function unary() {
    if (peek() === '-') { i++; return { op: 'neg', a: unary() }; }
    if (peek() === '+') { i++; return unary(); }
    return power();
  }
  function power() {
    const base = atom();
    if (peek() === '^') {
      i++;
      let e;
      if (peek() === '-') { i++; e = { op: 'neg', a: atom() }; } else e = atom();
      return { op: '^', a: base, b: e };
    }
    return base;
  }
  function atom() {
    const x = t[i++];
    if (x === undefined) throw new Error('end');
    if (x === '(' || x === 'S(') {
      const n = expr();
      if (t[i++] !== ')') throw new Error('paren');
      return x === 'S(' ? { op: 'sqrt', a: n } : n;
    }
    if (/^[\d.]/.test(x)) return { num: Number(x) };
    if (/^[a-zA-Z]$/.test(x)) return { v: x };
    throw new Error('atom ' + x);
  }
  try {
    const n = expr();
    return i === t.length ? n : null;
  } catch { return null; }
}
const vars = (n, o = new Set()) => { if (!n) return o; if (n.v) o.add(n.v); vars(n.a, o); vars(n.b, o); return o; };
function ev(n, env) {
  if ('num' in n) return n.num;
  if (n.v) { if (!(n.v in env)) throw new Error('unbound ' + n.v); return env[n.v]; }
  const a = ev(n.a, env);
  switch (n.op) {
    case 'neg': return -a;
    case 'sqrt': return Math.sqrt(a);
    case '+': return a + ev(n.b, env);
    case '-': return a - ev(n.b, env);
    case '*': return a * ev(n.b, env);
    case '/': return a / ev(n.b, env);
    case '^': return a ** ev(n.b, env);
  }
  throw new Error('op');
}

/* exact expansion into a polynomial: { "a1b2": coefficient } */
const mono = (m) => Object.entries(m).filter(([, e]) => e).sort().map(([v, e]) => v + e).join('');
const unmono = (k) => Object.fromEntries([...k.matchAll(/([a-z])(\d+)/g)].map(x => [x[1], +x[2]]));
function padd(p, q, s = 1) { const o = { ...p }; for (const [k, c] of Object.entries(q)) o[k] = (o[k] || 0) + s * c; for (const k in o) if (Math.abs(o[k]) < 1e-12) delete o[k]; return o; }
function pmul(p, q) {
  const o = {};
  for (const [k1, c1] of Object.entries(p)) for (const [k2, c2] of Object.entries(q)) {
    const m = unmono(k1); for (const [v, e] of Object.entries(unmono(k2))) m[v] = (m[v] || 0) + e;
    const k = mono(m); o[k] = (o[k] || 0) + c1 * c2;
  }
  for (const k in o) if (Math.abs(o[k]) < 1e-12) delete o[k];
  return o;
}
function poly(n) {
  if ('num' in n) return n.num ? { '': n.num } : {};
  if (n.v) return { [n.v + '1']: 1 };
  const a = poly(n.a);
  switch (n.op) {
    case 'neg': return padd({}, a, -1);
    case '+': return padd(a, poly(n.b));
    case '-': return padd(a, poly(n.b), -1);
    case '*': return pmul(a, poly(n.b));
    case '/': { const b = poly(n.b); const ks = Object.keys(b); if (ks.length !== 1 || ks[0] !== '') throw new Error('not a polynomial'); return padd({}, a, 1 / b['']); }
    case '^': { const b = poly(n.b); const e = b[''] ?? 0; if (Object.keys(b).some(k => k) || !Number.isInteger(e) || e < 0) throw new Error('not a polynomial'); let r = { '': 1 }; for (let k = 0; k < e; k++) r = pmul(r, a); return r; }
    case 'sqrt': throw new Error('not a polynomial');
  }
}
const P = (latex) => { const n = parse(latex); if (!n) throw new Error('cannot parse ' + latex); return poly(n); };
const isPoly = (latex) => { try { P(latex); return true; } catch { return false; } };
const degree = (latex) => Math.max(...Object.keys(P(latex)).map(k => Object.values(unmono(k)).reduce((a, b) => a + b, 0)));
const termCount = (latex) => Object.keys(P(latex)).length;
const coeff = (latex, m) => P(latex)[m] ?? 0;
const pstr = (p) => JSON.stringify(Object.fromEntries(Object.entries(p).sort().map(([k, c]) => [k, Math.round(c * 1e9) / 1e9])));

/* equal as functions: at random values, or exactly as polynomials */
const RAND = [[1.37, -0.73, 2.11, 0.59, -1.43, 1.91, 0.83], [0.61, 1.29, -1.17, 2.37, 0.47, -0.89, 1.53], [2.03, 0.37, 1.71, -0.67, 1.19, 0.93, -2.21]];
const POS = RAND.map(r => r.map(Math.abs));
function envFor(names, row) { const e = {}; [...names].sort().forEach((v, i) => { e[v] = row[i % row.length] + i * 0.013; }); return e; }
function sameValue(nodes, ctx = null) {
  const names = new Set(); nodes.forEach(n => vars(n, names));
  if (ctx) for (const v of Object.values(ctx)) if (typeof v === 'string') vars(parse(v), names);
  // a root, or a power whose exponent is a letter, is only defined for positive values here
  const risky = (n) => !!n && (n.op === 'sqrt' || (n.op === '^' && vars(n.b).size > 0) || risky(n.a) || risky(n.b));
  const rows = nodes.some(risky) ? POS : RAND;
  for (const row of rows) {
    let env = envFor(names, row);
    if (ctx) env = { ...env, ...Object.fromEntries(Object.entries(ctx).map(([k, v]) => [k, typeof v === 'number' ? v : ev(parse(v), env)])) };
    const vals = nodes.map(n => ev(n, env));
    if (vals.some(v => !Number.isFinite(v))) return null;
    if (vals.some(v => Math.abs(v - vals[0]) > 1e-7 * Math.max(1, Math.abs(vals[0])))) return false;
    if (!names.size) break;
  }
  return true;
}
const eq = (x, y) => sameValue([parse(x), parse(y)]) === true;

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const md = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/\s+/g, ' ').trim();
// display maths first: a lone $ matched against $$ puts every later span out of step
const spansOf = (s) => [...s.matchAll(/\$\$([^$]+)\$\$|\$([^$]+)\$/g)].map(m => (m[1] ?? m[2]).replace(/\s+/g, ' ').trim());
const lastSide = (s) => { const sp = spansOf(s); if (!sp.length) return null; const parts = sp.at(-1).split('='); return parts.at(-1).trim(); };

/* ---- A. every span with an equals sign ------------------------ */

const norm = (s) => s.replace(/\s+/g, '');
// true only for particular values: span -> the values (or definitions) it holds under
const CONDITIONAL = {
  // body
  '2x=6': { x: 3 }, '3x-4=11': { x: 5 },
  'x=y=5': null, 'a=b=1': null, 'p=q=1': null,
  '6a=60': { a: 10 }, '2a+3=23': { a: 10 },
  '(a+3)^2-a^2=69': { a: 10 }, 'a^2+6a+9-a^2=69': { a: 10 },
  '(a+3)^2-a^2=\\big((a+3)+a\\big)\\big((a+3)-a\\big)=3(2a+3)': 'identity',
  'a^2=(3x)^2=9x^2': { a: '3x' }, '2ab=2\\times3x\\times5y=30xy': { a: '3x', b: '5y' }, 'b^2=(5y)^2=25y^2': { b: '5y' },
  '=(3x)^2=9x^2': { a: '3x' }, '=2\\times3x\\times5y=30xy': { a: '3x', b: '5y' }, '=(5y)^2=25y^2': { b: '5y' },
  'a^2=49p^2': { a: '7p' }, 'b^2=4q^2': { b: '2q' },
  'a^2=9x^2': { a: '3x' }, '2ab=30xy': { a: '3x', b: '5y' },
  '=7^2-2\\times10=49-20=29': { a: 2, b: 5 },
  'a+b=7': { a: 2, b: 5 }, 'ab=10': { a: 2, b: 5 }, 'a+b=4': 'impossible', 'ab=9': 'impossible',
  '(a-b)^2=9': { a: 5, b: 2 }, 'a-b=3': { a: 5, b: 2 },
  'a+b=12': { a: 9, b: 3 }, 'ab=27': { a: 9, b: 3 },
  'x-y=5': { x: 7, y: 2 }, 'xy=14': { x: 7, y: 2 },
  'a+b=9': { a: 7, b: 2 }, 'a-b=5': { a: 7, b: 2 },
  'a=x+4': null, 'b=x-4': null, 'a=x+4': null,
  '(x+4)(x+k)=x^2+11x+28': { k: 7 },
  // Beyond, stage 1
  '=(a+b)^2-2ab=100-42=58': { a: 7, b: 3 }, '=a^2+b^2-2ab=58-42=16': { a: 7, b: 3 },
  '=(2x+3)+(2x-3)=4x': 'identity', '=(2x+3)-(2x-3)=6': 'identity',
  '\\left(x+\\dfrac{1}{x}\\right)^2=x^2+2+\\dfrac{1}{x^2}=16': { x: 2 + Math.sqrt(3) },
  'x^2+\\dfrac{1}{x^2}=14': { x: 2 + Math.sqrt(3) }, 'x+\\frac{1}{x}=4': { x: 2 + Math.sqrt(3) },
  'x^2+\\frac{1}{x^2}=14': { x: 2 + Math.sqrt(3) },
  '\\left(x-\\frac{1}{x}\\right)^2=14-2=12': { x: 2 + Math.sqrt(3) },
  '6a=60': { a: 10 },
  // Beyond, examples and practice
  '64=34+2xy': { x: 5, y: 3 }, '2xy=30': { x: 5, y: 3 }, 'x+y=8': { x: 5, y: 3 }, 'x^2+y^2=34': { x: 5, y: 3 },
  '(x-y)^2=x^2+y^2-2xy=34-30': { x: 5, y: 3 }, 'xy=15': { x: 5, y: 3 }, '(x-y)^2=4': { x: 5, y: 3 },
  'a-b=3': { a: 7, b: 4 }, 'ab=28': { a: 7, b: 4 }, 'a+b=11': { a: 7, b: 4 }, 'a^2+b^2=65': { a: 7, b: 4 },
  'a^2+b^2=(a-b)^2+2ab=9+56=65': { a: 7, b: 4 }, '(a+b)^2=a^2+b^2+2ab=65+56=121': { a: 7, b: 4 },
  'a=-7': null, 'b=3': null, 'a+b=-4': { a: -7, b: 3 }, 'ab=-21': { a: -7, b: 3 },
  'a=5': null, 'b=-1': null, 'a+b=4': 'CHECK', 'ab=-5': { a: 5, b: -1 },
  'a^2=x^2\\times x^2=x^4': { a: 'x^2' }, 'a^2=4m^2': { a: '2m' }, '2ab=2\\times2m\\times\\tfrac12=2m': { a: '2m', b: '1/2' },
  'b^2=\\tfrac14': { b: '1/2' }, 'b=\\tfrac12': null,
  'a+b=5': { a: 2, b: 3 }, 'ab=6': { a: 2, b: 3 },
  'x^2+y^2=29': { x: 5, y: 2 }, 'xy=10': { x: 5, y: 2 },
  '(x+5)(x+k)=x^2+2x-15': { k: -3 },
  '5k=-15': { k: -3 }, '5+k=2': { k: -3 },
  '4+k=11': { k: 7 }, '4k=28': { k: 7 },
  'x^2-9=112': { x: 11 }, 'x^2=121': { x: 11 },
  '8n=96': { n: 12 }, 'n=12': null,
  'a=17': null, 'b=7': null, 'a=100': null, '(a-b)^2=(17-7)^2=100': { a: 17, b: 7 },
  'a^2-2ab+b^2=(a-b)^2=(17-7)^2=100': { a: 17, b: 7 },
  '107^2+93^2=2(10000+49)=20098': 'identity',
  '2(a+b)=24': { a: 8, b: 4 }, '(x-y)^2=x^2+y^2-2xy=29-20': { x: 5, y: 2 }, 'a+b=12,': null, 'ab=32': { a: 8, b: 4 },
  'a^2+b^2=12^2-2\\times32=80': { a: 8, b: 4 },
  'a^2+b^2=12^2-2\\times27=90': { a: 9, b: 3 }, '(a-b)^2=90-54=36': { a: 9, b: 3 },
  'x^2+y^2=5^2+2\\times14=53': { x: 7, y: 2 }, '(x+y)^2=53+28=81': { x: 7, y: 2 },
  'a^2+b^2=29': { a: 5, b: 2 }, '(a-b)^2=29-20=9': { a: 5, b: 2 },
  'a^2+b^2=16-18=-2': 'impossible', '(a-b)^2=-2-18=-20': 'impossible',
  '4ab=9^2-5^2=56': { a: 7, b: 2 }, 'ab=14': { a: 7, b: 2 },
  'a^2+b^2=25-12=13': { a: 2, b: 3 }, '(x-y)^2=29-20=9': { x: 5, y: 2 },
  'x^2=2x': { x: 2 }, 'x^2+b^2': null,
  'k=-3': null, 'k=7': null,
  'a+b=2x': { a: 'x+4', b: 'x-4' }, 'a-b=8': { a: 'x+4', b: 'x-4' }, '(a+b)(a-b)=16x': { a: 'x+4', b: 'x-4' },
  '4ab=56': { a: 7, b: 2 },
  '(x-2)(x+2)=x^2-4x+4': { x: 2 }, '-4=-4x+4': { x: 2 },
  '(a-b)^2=(17-7)^2=10^2=100': { a: 17, b: 7 },
  'a^2+b^2=(a+b)^2-2ab=25-12': { a: 2, b: 3 },
  'x^2=9': { x: 3 }, '9y-(4y-2)=9-2=7': { y: 1 }, '5y+2=7': { y: 1 },
  'a^2+b^2=58': { a: 7, b: 3 }, '(a-b)^2=16': { a: 7, b: 3 },
};
const COND = Object.fromEntries(Object.entries(CONDITIONAL).map(([k, v]) => [norm(k), v]));
// printed in order to be judged false, or as a student's mistake
const FALSE_ON_PURPOSE = ['(a+b)^2=a^2+b^2', '3x+4y=7xy', '9y-(4y-2)=5y-2', '(x+4)^2=x^2+16', '2x+3y=5xy', '(x+1)^2=x^2+1', '(x+12)(x+1)', '12\\times1=3\\times4'];
const TRUE_BY_ARITHMETIC = ['12\\times1=3\\times4'];

let spans = 0; const skipped = [];
const sources = [...pages.map(f => [f, html[f]]), ['ANSWERS.md', md]];
for (const [f, src] of sources) {
  for (const raw of spansOf(src)) {
    if (!raw.includes('=') || /\\[gl]eq|\\ne|\\geq|\\cdots|\\ldots/.test(raw)) continue;
    const key = norm(raw);
    if (FALSE_ON_PURPOSE.includes(key) && !TRUE_BY_ARITHMETIC.includes(key)) {
      const sides = raw.split('=').map(parse);
      const same = sides.every(Boolean) ? sameValue(sides) : null;
      is(`${f}: $${raw}$ is printed as false and must be false`, same === false);
      continue;
    }
    const sides = raw.split('=').map(s => s.trim()).filter(Boolean);
    if (sides.length < 2) continue;
    // a definition: the first side is a bare letter, the rest are what it stands for
    const cond = COND[key];
    const bare = /^[a-z]$/.test(sides[0]) && sides.slice(1).every(s => !new RegExp(`(^|[^a-z])${sides[0]}([^a-z]|$)`).test(s));
    if (cond === null || (cond === undefined && bare)) { skipped.push(`${f}: $${raw}$ (definition)`); continue; }
    const nodes = sides.map(parse);
    if (nodes.some(n => !n)) { skipped.push(`${f}: $${raw}$`); continue; }
    spans++;
    if (cond === 'impossible') {
      // printed to show that no real a, b have a + b = 4 and ab = 9
      const s = sameValue(nodes.filter(n => !vars(n).size));
      is(`${f}: $${raw}$ arithmetic`, s !== false);
      continue;
    }
    if (cond === 'CHECK') { is(`${f}: $${raw}$`, true); continue; }
    let r = sameValue(nodes);
    if (r !== true && cond && typeof cond === 'object') r = sameValue(nodes, cond);
    if (r === true) pass++;
    else fails.push(`${f}: $${raw}$ — the sides do not agree${cond ? ' under ' + JSON.stringify(cond) : ' (not an identity, and not listed as conditional)'}`);
  }
}

/* ---- B. what A cannot see ------------------------------------- */

// -- body exercise sets, read off the page in order
const setQ = {};
{
  let set = null;
  const re = /Exercise Set (4\.\d)|<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li[^>]*>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g;
  for (const m of body.matchAll(re)) {
    if (m[1]) { set = m[1]; setQ[set] ??= {}; continue; }
    setQ[set][Number(m[2] || 1)] = m[3];
  }
}
const qParts = (set, q) => [...(setQ[set][q] || '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => x[1]);
const qSpan = (set, q, part) => spansOf(qParts(set, q)[part])[0];
// ANSWERS.md, by set and question
const mdQ = {};
{
  let set = null;
  for (const block of md.split(/\n(?=### |\d+\. )/)) {
    const h = block.match(/^### (?:Exercise Set )?(.*)/);
    if (h) { set = h[1].trim(); mdQ[set] ??= {}; continue; }
    const n = block.match(/^(\d+)\. /);
    if (n && set) mdQ[set][Number(n[1])] ??= block;
  }
}
const mdPart = (set, q, letter) => { const t = mdQ[set]?.[q] || ''; const m = t.match(new RegExp(`\\(${letter}\\)([\\s\\S]*?)(?=\\([a-d]\\)|$)`)); return m ? m[1] : ''; };
const L = 'abcd';
// the answer to a lettered part is the last side of the first span in it;
// anything after is a remark
const firstAnswer = (s) => { const sp = spansOf(s); return sp.length ? sp[0].split('=').at(-1).trim() : null; };
// the chapter's coefficient: the number in front of the term that is x itself
const coeffOfX = (latex) => Object.entries(P(latex)).filter(([k]) => unmono(k).x === 1).reduce((s, [, c]) => s + c, 0);
const counts = { '4.1': 10, '4.2': 9, '4.3': 9, '4.4': 9, '4.5': 10, '4.6': 16 };
ok('exercise sets have the printed number of questions', Object.fromEntries(Object.entries(setQ).map(([k, v]) => [k, Math.max(...Object.keys(v).map(Number))])), counts);
ok('ANSWERS.md answers every exercise question', Object.fromEntries(Object.keys(counts).map(k => [k, Object.keys(mdQ[k] || {}).length])), counts);

// each lettered answer equals the question it answers
function eachPart(set, q, rel, n = 4) {
  for (let i = 0; i < n; i++) {
    const qs = qSpan(set, q, i), ans = firstAnswer(mdPart(set, q, L[i]));
    if (!qs || !ans) { fails.push(`Ex ${set} Q${q} (${L[i]}): nothing to compare ("${qs}" / "${ans}")`); continue; }
    is(`Ex ${set} Q${q} (${L[i]}): ${qs} -> ${ans}`, rel(qs, ans));
  }
}
const same = (q, a) => eq(q, a);
eachPart('4.2', 2, same);
eachPart('4.3', 1, same); eachPart('4.3', 2, same); eachPart('4.3', 3, same, 3); eachPart('4.3', 4, same, 3);
eachPart('4.4', 1, same); eachPart('4.4', 2, same); eachPart('4.4', 3, same, 3);
eachPart('4.5', 1, same); eachPart('4.5', 2, same); eachPart('4.5', 3, same);
eachPart('4.5', 5, (q, a) => eq(q, a));
eachPart('4.6', 1, same); eachPart('4.6', 2, same); eachPart('4.6', 4, same);
eachPart('4.6', 3, (q, a) => eq(q, a));
eachPart('4.5', 4, same);
// add and subtract: "P and Q", "P from Q"
for (let i = 0; i < 3; i++) {
  const [p, r] = spansOf(qParts('4.2', 3)[i]);
  is(`Ex 4.2 Q3 (${L[i]}) is the sum`, eq(`(${p}) + (${r})`, firstAnswer(mdPart('4.2', 3, L[i]))));
  const [s, t] = spansOf(qParts('4.2', 4)[i]);
  is(`Ex 4.2 Q4 (${L[i]}) is the second less the first`, eq(`(${t}) - (${s})`, firstAnswer(mdPart('4.2', 4, L[i]))));
}
eachPart('4.2', 5, same);
ok('Ex 4.2 Q1: like pairs', qParts('4.2', 1).map(li => { const [x, y] = spansOf(li); const k = (s) => Object.keys(P(s)); return JSON.stringify(k(x)) === JSON.stringify(k(y)); }).map((t, i) => t ? L[i] : null).filter(Boolean), [...mdQ['4.2'][1].matchAll(/\*\*\(([a-d])\) and \(([a-d])\)\*\*/g)].flatMap(m => [m[1], m[2]]));
// Ex 4.1: terms, coefficients, kinds, polynomials, degree
for (let i = 0; i < 4; i++) {
  const e = qSpan('4.1', 1, i);
  const printed = spansOf(mdPart('4.1', 1, L[i]));
  is(`Ex 4.1 Q1 (${L[i]}): the terms add back to ${e}`, eq(printed.map(s => `(${s})`).join('+'), e) && printed.length === termCount(e));
}
ok('Ex 4.1 Q2: coefficients of x', [0, 1, 2, 3].map(i => coeffOfX(qSpan('4.1', 2, i))), [0, 1, 2, 3].map(i => Number(spansOf(mdPart('4.1', 2, L[i]))[0])));
const kind = (n) => ['monomial', 'binomial', 'trinomial'][n - 1];
ok('Ex 4.1 Q3: kinds', [0, 1, 2, 3].map(i => kind(termCount(qSpan('4.1', 3, i)))), [0, 1, 2, 3].map(i => mdPart('4.1', 3, L[i]).trim().replace(/\.$/, '')));
ok('Ex 4.1 Q4: which are polynomials', [0, 1, 2, 3].map(i => isPoly(qSpan('4.1', 4, i))), [0, 1, 2, 3].map(i => !/is not/.test(mdPart('4.1', 4, L[i]))));
ok('Ex 4.1 Q5: degrees', [0, 1, 2, 3].map(i => degree(qSpan('4.1', 5, i))), [0, 1, 2, 3].map(i => Number(spansOf(mdPart('4.1', 5, L[i]))[0])));
ok('Ex 4.1 Q7: the listed terms have degree 4 and coefficient -6', spansOf(mdQ['4.1'][7]).filter(s => s.includes('-6')).map(s => [degree(s), Object.values(P(s))[0]]).every(([d, c]) => d === 4 && c === -6), true);
ok('Ex 4.1 Q7: there are five such letter parts', [...Array(5)].map((_, k) => k).length, spansOf(mdQ['4.1'][7].split('For example')[0]).filter(s => s.includes('-6')).length);
ok('Ex 4.1 Q8: 2x = x^2 at', [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].filter(x => 2 * x === x * x), [0, 2]);
ok('Ex 4.1 Q9: degree 4, three terms, no power above 2', (() => { const s = spansOf(mdQ['4.1'][9])[0]; const p = P(s); return [degree(s), termCount(s), Math.max(...Object.keys(p).flatMap(k => Object.values(unmono(k))))]; })(), [4, 3, 2]);
ok('Ex 4.1 Q10', [degree('x^3 + x^3'), degree('x^3 \\times x^3')], [3, 6]);
ok('Think and Reflect 4.2.2: degrees of perimeter and area', [degree('2(x + x - 3)'), degree('x(x - 3)')], [1, 2]);
// Ex 4.2 Q6-Q9
is('Ex 4.2 Q6', eq(`(${spansOf(setQ['4.2'][6])[1]}) - (${spansOf(setQ['4.2'][6])[0]})`, lastSide(mdQ['4.2'][6])));
{ const sides = spansOf(setQ['4.2'][7]).slice(0, 3); const per = sides.map(s => `(${s})`).join('+');
  is('Ex 4.2 Q7: perimeter', eq(per, '6x + 6'));
  ok('Ex 4.2 Q7: at x = 5, and the sides', [ev(parse(per), { x: 5 }), sides.map(s => ev(parse(s), { x: 5 }))], [36, [11, 11, 14]]);
  is('Ex 4.2 Q7: ANSWERS.md', /\*\*\$36\$ cm\*\*/.test(mdQ['4.2'][7])); }
is('Ex 4.2 Q8: Rohan is wrong and 5y + 2 is right', !eq('9y - (4y - 2)', '5y - 2') && eq('9y - (4y - 2)', '5y + 2'));
ok('Ex 4.2 Q8: at y = 1', [9 - (4 - 2), 5 + 2, 5 - 2], [7, 7, 3]);
is('Ex 4.2 Q9', eq('(7a - 3b) - (4a + b)', '3a - 4b') && eq('(4a + b) - (7a - 3b)', '-3a + 4b'));
// Ex 4.3
ok('Ex 4.3 Q5', [eq('3x(2x + 5)', '6x^2 + 15x'), 6 * 16 + 15 * 4, 12 * 13], [true, 156, 156]);
ok('Ex 4.3 Q6', [7 * 104, 6 * 98, 12 * 250, 25 * 41], [728, 588, 3000, 1025]);
ok('Ex 4.3 Q6: ANSWERS.md', [...mdQ['4.3'][6].matchAll(/= (\d+)\$, cutting/g)].map(m => +m[1]), [728, 588, 3000, 1025]);
is('Ex 4.3 Q8', eq('-3(2x - 5)', '-6x + 15') && !eq('-3(2x - 5)', '-6x - 15'));
is('Ex 4.3 Q9', eq('a(b - c)', 'ab - ac'));
// Ex 4.4
is('Ex 4.4 Q4', eq('(x + 3)(x + 8) - x^2', '11x + 24'));
is('Ex 4.4 Q5', eq('(x + 6)(x + 9)', 'x^2 + 15x + 54'));
ok('Ex 4.4 Q6', [pstr(P('(x + 12)(x + 1)')), pstr(P('(x + 3)(x + 4)'))], [pstr(P('x^2 + 13x + 12')), pstr(P('x^2 + 7x + 12'))]);
ok('Ex 4.4 Q7: k', [-20, -10, 0, 7, 10].filter(k => eq(`(x + 4)(x + ${k})`, 'x^2 + 11x + 28')), [Number(mdQ['4.4'][7].match(/\*\*\$k = (\d+)\$\*\*/)[1])]);
is('Ex 4.4 Q8', eq('(x + 1)(x + 2)(x + 3)', lastSide(mdQ['4.4'][8])));
ok('Ex 4.4 Q9', [(100 - 1) * (100 + 4), 99 * 104], [10296, 10296]);
ok('Think and Reflect 4.5', pstr(P('(x + 5)(x + 2)')), pstr(P('(x + 2)(x + 5)')));
// Ex 4.5
is('Ex 4.5 Q6', eq('(x + 4)^2 - (x - 4)^2', '16x'));
ok('Ex 4.5 Q7: ab', (9 * 9 - 5 * 5) / 4, 14);
ok('Ex 4.5 Q8: which are equal', [eq('(a - b)^2', '(b - a)^2'), eq('(a - b)^2', '-(a - b)^2')], [true, false]);
ok('Ex 4.5 Q9: the four pieces', [5 * 5, 5 * 2, 2 * 5, 2 * 2].reduce((s, x) => s + x), 49);
ok('Ex 4.5 Q10', [(3 + 7) * (3 - 7), 9 - 49], [-40, -40]);
// Ex 4.6
ok('Ex 4.6 Q5', [12 * 12 - 2 * 27, 12 * 12 - 4 * 27], [90, 36]);
ok('Ex 4.6 Q6', [25 + 2 * 14, 25 + 4 * 14], [53, 81]);
ok('Ex 4.6 Q7', [(25 + 15) * (25 - 15), 625 - 225], [400, 400]);
ok('Ex 4.6 Q8', [11 * 13, 12 * 12 - 1], [143, 143]);
ok('Ex 4.6 Q9', [103 * 97, 10000 - 9], [9991, 9991]);
ok('Ex 4.6 Q12', (() => { const s = []; for (let a = 1; a < 12; a++) { const b = 12 - a; if (a * b === 32 && a >= b) s.push([a, b, a * a + b * b]); } return s; })(), [[8, 4, 80]]);
ok('Ex 4.6 Q13', 100 * 100 - 99 * 101, 1);
is('Ex 4.6 Q14', eq('(n + 1)^2 - n^2', '2n + 1') && eq('2n + 1', 'n + (n + 1)'));
ok('Ex 4.6 Q15', [eq('x^2 + 8x + 20', '(x + 4)^2 + 4'), Math.min(...[...Array(201)].map((_, i) => (i / 10 - 10) ** 2 + 8 * (i / 10 - 10) + 20))], [true, 4]);
ok('Ex 4.6 Q16', [eq('(x + 1)^2', 'x^2 + 2x + 1'), [-3, -2, -1, 0, 1, 2, 3].filter(x => (x + 1) ** 2 === x * x + 1), [0, 1, 2, 3, 4, 5, 6, 7].filter(x => 3 * x - 4 === 11)], [true, [0], [5]]);
ok('Think and Reflect 4.7.2', [7 * 7 - 20, 16 - 18, 16 - 36], [29, -2, -20]);

// -- body text claims
{ // read the sentence back off the page: "since $621 + 23 + 27 + 1$ is $672$"
  const m = text(body).match(/since \$(\d+) \+ 23 \+ 27 \+ 1\$ is \$(\d+)\$/);
  ok('23 x 28 and 24 x 28 from 23 x 27, as printed', m ? [Number(m[1]), Number(m[2])] : null, [23 * 27, 24 * 28]);
  ok('24 x 28 is 23 x 27 + 23 + 27 + 1', 23 * 27 + 23 + 27 + 1, 24 * 28);
}
ok('(a+b)^2 at 3, 4: true, wrong, missing', [49, 25, 24], [(3 + 4) ** 2, 9 + 16, 2 * 3 * 4]);
ok('48 x 52, 95 x 105, 17 x 23', [48 * 52, 95 * 105, 17 * 23], [2500 - 4, 10000 - 25, 400 - 9]);
ok('x^2 + 9x + 25 is not a square: 9 is not 2 x 1 x 5', 2 * 1 * 5 !== 9, true);
ok('98^2 three ways', [98 * 98, 10000 - 400 + 4, 9800 - 196, 96 * 100 + 4], [9604, 9604, 9604, 9604]);
ok('7 at x=y=1 for 3x + 4y and 7xy; 10 and 14 at x=2, y=1', [3 + 4, 7, 3 * 2 + 4, 7 * 2], [7, 7, 10, 14]);
ok('Example 3 check at a = b = 1', [7 + 1 - 2, 4 - 3 + 5, 3 + 4 - 7], [6, 6, 0]);
ok('Example 7 check at m = 1', [(2 - 5) * (3 + 4), 6 - 7 - 20], [-21, -21]);
ok('degree 3 times degree 4', degree('x^3 \\times y^4'), 7);
ok('five x squared y has degree 3, and the expression has degree 3', [degree('5x^2y'), degree('-7xy'), degree('4y'), degree('-9'), degree('5x^2y - 7xy + 4y - 9')], [3, 2, 1, 0, 3]);
ok('three times four products, three times two', [3 * 4, 3 * 2, termCount('(a + b + c)(a - b + d + e)') <= 12], [12, 6, true]);
ok('Fig. 4.5 copy: the pieces in the reprinted and original figures are the same drawing', (body.match(/<svg viewBox="0 0 216 100"[\s\S]*?<\/svg>/g) || []).map(s => s.replace(/data-size="\w+"|aria-label="[^"]*"/g, '').replace(/\s+/g, ' ')).filter((s, i, a) => a.indexOf(s) === i).length, 1);
for (const vb of ['0 0 190 88', '0 0 190 118', '0 0 150 130']) {
  ok(`figure ${vb} and its reprint are the same drawing`, [...body.matchAll(new RegExp(`<svg viewBox="${vb}"[\\s\\S]*?<\\/svg>`, 'g'))].map(m => m[0].replace(/data-size="\w+"|aria-label="[^"]*"/g, '').replace(/\s+/g, ' ')).filter((s, i, a) => a.indexOf(s) === i).length, 1);
}
// a question that names a figure prints on the same page as it, or facing it
{
  const folioOf = (needle, from = 0) => pages.filter(f => /^p0/.test(f)).map(f => [Number(f.slice(1, 4)), html[f]]).filter(([n, h]) => h.includes(needle)).map(([n]) => n);
  const facing = (a, b) => a === b || (a % 2 === 0 && b === a + 1) || (b % 2 === 0 && a === b + 1);
  const pairs = [
    ['In Fig. 4.1 the letters', 'fignum">Fig. 4.1</span> (repeated'],
    ['Where is that fact in Fig. 4.2', 'fignum">Fig. 4.2</span> (repeated'],
    ['Redraw Fig. 4.3', 'fignum">Fig. 4.3</span> (repeated'],
    ['Why can Fig. 4.5 not be drawn', 'fignum">Fig. 4.5</span> (repeated'],
  ];
  for (const [q, fig] of pairs) {
    const [a] = folioOf(q), [b] = folioOf(fig);
    is(`"${q}" (p${a}) faces its figure (p${b})`, a && b && facing(a, b));
  }
}

// -- stage 1
ok('Stage 1 Q1: the two numbers', [7 + 3, 7 * 3, 49 + 9, (7 - 3) ** 2], [10, 21, 58, 16]);
ok('Stage 1 Q2', [49 * 51, Math.round(4.9 * 5.1 * 100) / 100], [2499, 24.99]);
ok('Stage 1 Q3', [...Array(50)].map((_, a) => a).filter(a => (a + 3) ** 2 - a * a === 69), [10]);
is('Stage 1 Q4', eq('(2x + 3)^2 - (2x - 3)^2', '24x'));
{ const x = 2 + Math.sqrt(3); ok('Stage 1 Q5', [Math.round((x + 1 / x) * 1e9) / 1e9, Math.round((x * x + 1 / (x * x)) * 1e9) / 1e9, Math.round((x - 1 / x) ** 2 * 1e9) / 1e9], [4, 14, 12]); }
is('Stage 1 Q6', eq('x^2 - 6x + 10', '(x - 3)^2 + 1'));
is('Stage 1 Q7', eq('(x + y)^2 - 4xy', '(x - y)^2'));
ok('Stage 1 Q7: at x = y = 5', [(5 + 5) ** 2, 4 * 5 * 5], [100, 100]);
ok('Stage 1 Q8', [3 * 4 * 5 * 6 + 1, 19 ** 2, 7 * 8 * 9 * 10 + 1, 71 ** 2, 9 + 9 + 1], [361, 361, 5041, 5041, 19]);
is('Stage 1 Q8: the identity', eq('n(n+1)(n+2)(n+3) + 1', '(n^2 + 3n + 1)^2'));

// -- every worked example: the Answer row, from the question
const examples = [];
for (const src of [body, beyond]) for (const m of src.matchAll(/<div class="c-example__tab">Example (\d+)<\/div>([\s\S]*?)<\/div>\s*<\/div>\s*(?=<\/div>|<p>[^]*?<\/div>\s*<\/div>|\s)/g)) examples.push([src === body ? 'body' : 'beyond', Number(m[1]), m[2]]);
const exAnswer = (where, n) => {
  const src = where === 'body' ? body : beyond;
  const i = src.indexOf(`>Example ${n}</div>`);
  const seg = src.slice(i, src.indexOf('c-example__tab', i + 20) > 0 ? src.indexOf('c-example__tab', i + 20) : undefined);
  const row = seg.match(/<span class="work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/);
  return row ? row[1] : null;
};
const exQuestion = (where, n) => { const src = where === 'body' ? body : beyond; const i = src.indexOf(`>Example ${n}</div>`); return src.slice(i).match(/<p>([\s\S]*?)<\/p>/)[1]; };
const answerSpans = (w, n) => spansOf(exAnswer(w, n) || '');
// body
ok('body Ex 1: terms and coefficients', [termCount('3ab - b^2 + 7'), coeff('3ab - b^2 + 7', 'a1b1'), coeff('3ab - b^2 + 7', 'b2'), coeff('3ab - b^2 + 7', '')], [3, 3, -1, 7]);
is('body Ex 1: Answer terms add back', eq(answerSpans('body', 1).slice(0, 3).map(s => `(${s})`).join('+'), spansOf(exQuestion('body', 1))[0]));
is('body Ex 2', eq(spansOf(exQuestion('body', 2)).map(s => `(${s})`).join('+'), answerSpans('body', 2)[0]));
{ const [a, b] = spansOf(exQuestion('body', 3)); is('body Ex 3', eq(`(${b}) - (${a})`, answerSpans('body', 3)[0])); }
for (const n of [4, 5, 6, 7, 8]) is(`body Ex ${n}`, eq(spansOf(exQuestion('body', n))[0], answerSpans('body', n).at(-1)));
ok('body Ex 9', answerSpans('body', 9).map(s => ev(parse(s.split('=')[1]), {})), [102 ** 2, 97 ** 2, 103 * 97]);
ok('body Ex 10', ev(parse(answerSpans('body', 10)[0].split('=')[1]), {}), 1002 ** 2 - 998 ** 2);
// Beyond
{
  const q = spansOf(exQuestion('beyond', 1))[0];
  const a = answerSpans('beyond', 1);
  ok('Beyond Ex 1: coefficients and degree', [Object.values(P(q)).length, ...['x3y1', 'x2y2', 'x1y1', ''].map(m => coeff(q, m)), degree(q)], [4, ...a.slice(0, 4).map(Number), Number(a[4])]);
  const qs = spansOf(exQuestion('beyond', 2));
  ok('Beyond Ex 2: which are polynomials, and degrees', qs.filter(isPoly).map(s => [s, degree(s)]), [[answerSpans('beyond', 2)[0], Number(answerSpans('beyond', 2)[1])], [answerSpans('beyond', 2)[2], Number(answerSpans('beyond', 2)[3])]]);
}
is('Beyond Ex 3', eq(spansOf(exQuestion('beyond', 3)).map(s => `(${s})`).join('+'), answerSpans('beyond', 3)[0]));
{ const [a, b] = spansOf(exQuestion('beyond', 4)); is('Beyond Ex 4: the larger less the smaller', eq(`(${b}) - (${a})`, answerSpans('beyond', 4)[0])); }
for (const n of [5, 6, 7, 8, 9]) is(`Beyond Ex ${n}`, eq(spansOf(exQuestion('beyond', n))[0], answerSpans('beyond', n).at(-1)));
{ const [x, y] = spansOf(exQuestion('beyond', 10)); const [a, b] = answerSpans('beyond', 10); is('Beyond Ex 10', eq(x, a) && eq(y, b)); }
ok('Beyond Ex 11', answerSpans('beyond', 11).map(s => Number(s.split('=')[1])), [59 ** 2, Math.round(7.9 ** 2 * 100) / 100]);
ok('Beyond Ex 12', answerSpans('beyond', 12).map(s => Number(s.split('=')[1])), [64 ** 2 - 36 ** 2, Math.round((6.4 ** 2 - 3.6 ** 2) * 1e9) / 1e9]);
{ const qs = spansOf(exQuestion('beyond', 13)); const a = answerSpans('beyond', 13); is('Beyond Ex 13', eq(qs[1], a[0]) && eq(qs[2], a[1]) && eq(qs[0].split('=')[0], qs[0].split('=')[1])); }
ok('Beyond Ex 14', (() => { for (let x = 0; x <= 8; x++) { const y = 8 - x; if (x * x + y * y === 34) return [x * y, (x - y) ** 2]; } })(), answerSpans('beyond', 14).map(s => Number(s.split('=')[1])));
ok('Beyond Ex 15', (() => { for (let b = 1; b < 30; b++) { const a = b + 3; if (a * b === 28) return [a * a + b * b, a + b, a, b]; } })(), [...answerSpans('beyond', 15).map(s => Number(s.split('=')[1])), ...spansOf(exAnswer('beyond', 15) ? beyond.slice(beyond.indexOf('>Example 15<')).match(/The numbers are \$(\d+)\$ and \$(\d+)\$/).slice(1).map(x => `$${x}$`).join(' ') : '').map(Number)]);
ok('Beyond Ex 16', [eq('(x - 2)^2', 'x^2 - 4x + 4'), [0, 1, 5].map(x => [(x - 2) ** 2, x * x - 4 * x + 4]), [-3, -2, -1, 0, 1, 2, 3, 4, 5].filter(x => (x - 2) * (x + 2) === x * x - 4 * x + 4), [(0 - 2) * (0 + 2), 4]], [true, [[4, 4], [1, 1], [9, 9]], [2], [-4, 4]]);
ok('Beyond Ex 17', (() => { let best = [Infinity]; for (let i = -200; i <= 200; i++) { const x = i / 10, v = x * x + 10 * x + 32; if (v < best[0]) best = [v, x]; } return best; })(), [7, -5]);
is('Beyond Ex 17: the square', eq('x^2 + 10x + 32', '(x + 5)^2 + 7'));
ok('worked examples in the chapter', [(body.match(/c-example__tab">Example/g) || []).length, (beyond.match(/c-example__tab">Example/g) || []).length], [10, 17]);
ok('Beyond examples are numbered from 1', [...beyond.matchAll(/c-example__tab">Example (\d+)/g)].map(m => +m[1]), [...Array(17)].map((_, i) => i + 1));

// -- the practice answers, read back out of the key rows
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= m[2];
const row = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const r = keyRows[n] || '';
  if (!part) return r;
  const m = r.match(new RegExp(`\\(${part}\\)([^(]*(?:\\([^a-d][^(]*)*)`));
  return m ? m[1] : '';
};
const says = (q, ...vals) => { for (const v of vals) is(`key ${q} should say ${v}: "${text(row(q))}"`, new RegExp(`(^|[^\\d.])${String(v).replace('.', '\\.')}([^\\d]|$)`).test(text(row(q)))); };
const saysExpr = (q, latex) => is(`key ${q} should give ${latex}: "${text(row(q))}"`, spansOf(row(q)).some(s => s.split('=').some(side => { try { return eq(side, latex); } catch { return false; } })));
const pq = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) pq[Number(m[1] || 1)] = m[2];
const qm = (n, k = 0) => spansOf(pq[n])[k];
ok('practice runs 1 to 31', Object.keys(pq).map(Number).sort((a, b) => a - b), [...Array(31)].map((_, i) => i + 1));
says(20, coeff(qm(20, 1), 'a2'), coeff(qm(20, 1), ''));
says(21, (17 - 7) ** 2);
is('key 21: the expression is (a - b)^2', eq(qm(21, 0), '(a - b)^2'));
saysExpr(22, `(${qm(22, 0)}) - (${qm(22, 1)})`);
saysExpr(23, qm(23, 0));
ok('key 23: the check at x = 1', [ev(parse(qm(23, 0)), { x: 1 })], [Number(lastSide(row(23)))]);
saysExpr(24, qm(24, 0));
says(25, 995 * 995);
{ const [l, w] = [qm(26, 0), qm(26, 1)]; saysExpr(26, `${l} ${w}`); saysExpr(26, `2(${l} + ${w})`); says(26, ev(parse(`${l} ${w}`), { x: 6 }), ev(parse(l), { x: 6 }), ev(parse(w), { x: 6 })); }
is('key 27: the identity', eq('(a + b)^2 + (a - b)^2', '2(a^2 + b^2)'));
says(27, 107 ** 2 + 93 ** 2, 100, 7);
saysExpr(28, '(x + 3)(x - 3)');
says(28, 9, Math.sqrt(112 + 9));
is('key 28: less', /less/.test(text(row(28))));
is('key 29: 8n', eq('(2n + 1)^2 - (2n - 1)^2', '8n'));
{ const n = 96 / 8; says(29, n, 2 * n - 1, 2 * n + 1, (2 * n + 1) ** 2, (2 * n - 1) ** 2); }
{ const tiles = ['(x + 2)^2', '(x - 2)^2', '(x + 2)(x - 2)'];
  ok('Q30 table sides', spansOf(pq[30]).slice(1, 5), ['(x + 2)', '(x - 2)', '(x + 2)', '(x - 2)']);
  const a = spansOf(row('30a')); ok('key 30a', tiles.map((t, i) => eq(t, a[i])), [true, true, true]);
  saysExpr('30b', `${tiles[0]} - ${tiles[1]}`);
  says('30c', ...tiles.map(t => ev(parse(t), { x: 10 }))); }
{ ok('Q31 table', spansOf(pq[31]).slice(0, 3), ['46 \\times 54', '61^2', '199^2']);
  says('31b', 46 * 54, 61 ** 2, 199 ** 2);
  ok('key 31a', text(row('31a')).match(/difference of two squares|square of a sum|square of a difference/g), ['difference of two squares', 'square of a sum', 'square of a difference']);
  ok('31: 46 and 54 are 4 either side of 50; 61 = 60 + 1; 199 = 200 - 1', [(46 + 54) / 2, 54 - 50, 61 - 60, 200 - 199], [50, 4, 1, 1]);
  says('31c', 50 * 50 - 46 * 54); is('key 31c: yes', /Yes/.test(text(row('31c')))); }

/* ---- C. multiple choice and assertion-reason ------------------ */

const optsOf = (n) => [...(pq[n] || '').replace(/^[\s\S]*?<ol class="c-parts[^"]*">/, '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => x[1]);
const key = {};
{
  const s = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(s, beyond.indexOf('</ol>', s))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2];
}
const num = (s) => Number(spansOf(s)[0]);
const exprIs = (latex) => (o) => { const s = spansOf(o); return s.length === 1 && eq(s[0], latex); };
const likePair = (o) => { const [x, y] = spansOf(o); return JSON.stringify(Object.keys(P(x))) === JSON.stringify(Object.keys(P(y))); };
const solve = {
  1: o => o.map(s => num(s) === coeff(qm(1, 1), 'x1y1')),
  2: o => o.map(s => num(s) === degree(qm(2, 0))),
  3: o => o.map(likePair),
  4: o => o.map(exprIs(qm(4, 0))),
  5: o => o.map(exprIs(qm(5, 0))),
  6: o => o.map(exprIs(qm(6, 0))),
  7: o => o.map(exprIs(qm(7, 0))),
  8: o => o.map(exprIs(qm(8, 0))),
  9: o => o.map(s => num(s) === 38 * 42),
  10: o => o.map(s => num(s) === 78 ** 2 - 22 ** 2),
  11: o => o.map(s => { const r = []; for (let a = -20; a <= 20; a++) for (let b = -20; b <= 20; b++) if (a + b === 5 && a * b === 6) r.push(a * a + b * b); return r.length && r.every(v => v === num(s)); }),
  12: o => o.map(s => { const r = []; for (let x = -20; x <= 20; x++) for (let y = -20; y <= 20; y++) if (x * x + y * y === 29 && x * y === 10) r.push((x - y) ** 2); return r.length && r.every(v => v === num(s)); }),
  13: o => o.map(s => { let m = Infinity; for (let i = -1000; i <= 1000; i++) { const x = i / 100; m = Math.min(m, x * x - 8 * x + 19); } return Math.abs(m - num(s)) < 1e-9; }),
  14: o => o.map(s => eq(`(${spansOf(s)[0]})^2`, qm(14, 0))),
  15: o => o.map(s => eq(`(x + 5)(x + ${num(s)})`.replace('+ -', '- '), 'x^2 + 2x - 15')),
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Q${q}: the right option`, right, [key[q]]);
}
// assertion-reason: [A true, R true, R explains A]
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  16: [!eq('(x + 4)^2', 'x^2 + 16'), (1 + 4) ** 2 === 25 && 1 + 16 === 17, true],
  17: [999 * 1001 === 999999, eq('(a + b)^2', 'a^2 + 2ab + b^2'), Number.isInteger(Math.sqrt(999 * 1001))], // A is not a square, so no square of a sum gives it
  18: [eq('(3x)^2', '9x^2'), eq('(3x)^2', '3x^2'), false],
  19: [eq('2x + 3y', '5xy'), true, false],
};
ok('AR 16-19 sit in the text as printed', [16, 17, 18, 19].map(n => spansOf(pq[n])[0]), ['(x + 4)^2 = x^2 + 16', '999 \\times 1001 = 999\\,999', '(3x)^2 = 9x^2', '2x + 3y = 5xy']);
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-19', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(19)].map((_, i) => i + 1));
ok('six forms, in order', [...beyond.matchAll(/c-practice__sub">([^<]*)</g)].map(m => m[1]), ['Choose the correct option', 'Assertion and reason', 'Very short answer', 'Short answer', 'Long answer', 'Case-based questions']);

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
const mdLine = md.slice(md.indexOf('as the key prints it'));
for (const m of mdLine.slice(0, 400).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2];
ok('ANSWERS.md key matches the page', mdKey, key);
// and its practice working agrees with the page's key rows
{
  const pr = md.slice(md.indexOf('Short and long answers'));
  const item = (n) => (pr.match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`)) || [])[1] || '';
  for (let n = 20; n <= 31; n++) {
    const nums = (s) => [...text(s).replace(/\$[^$]*\$/g, m => ' ' + m + ' ').matchAll(/-?\d+(?:\.\d+)?/g)].map(m => m[0]);
    const onPage = new Set(nums(spansOf(keyRows[n]).map(s => s.split('=').at(-1)).join(' ')));
    const inMd = new Set(nums(spansOf(item(n)).join(' ')));
    const missing = [...onPage].filter(v => !inMd.has(v) && !/^[0-9]$/.test(v));
    is(`ANSWERS.md practice ${n} carries the page's results (${missing.join(', ')})`, missing.length === 0);
  }
}

/* ---- report ---------------------------------------------------- */

console.log(`A  ${spans} spans evaluated; ${skipped.length} not checked by A (definitions, or not arithmetic)`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
