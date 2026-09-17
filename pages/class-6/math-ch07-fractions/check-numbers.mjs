#!/usr/bin/env node
/* Re-derive every number this chapter prints.

     node pages/class-6/math-ch07-fractions/check-numbers.mjs

   Fractions are checked exactly. Every value is a rational number held as
   a numerator and a denominator in lowest terms, never as a decimal: 1/3
   in floating point is not 1/3, and a tolerance wide enough to forgive it
   is wide enough to forgive a wrong twelfth.

   Four parts:
     A  every relation set as maths anywhere in the chapter or in
        ANSWERS.md, evaluated: each = holds, each < and > holds
     B  the claims arithmetic alone cannot check: that an answer is in
        lowest terms, that a mixed number is proper, that a list is in
        order, that a figure shows what its question says
     C  every multiple-choice and assertion-reason question: exactly one
        option is right, and it is the one the printed key gives
     D  ANSWERS.md: each part's expression is read off the page, matched
        to its line in the file, and its answer recomputed

   Expected values are read out of the files, not typed here: the question
   is read from the page and the answer from the page or from ANSWERS.md,
   and only the arithmetic between them lives in this script.

   Exits non-zero if anything does not hold up. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
let pass = 0;
const fails = [];
const is = (what, cond) => { if (cond) pass++; else fails.push(what); };
const same = (what, got, want) => {
  const g = JSON.stringify(got), w = JSON.stringify(want);
  if (g === w) pass++; else fails.push(`${what}\n      computed ${w}\n      printed  ${g}`);
};

/* ---- exact fractions ------------------------------------------ */

const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a; };
class Q {
  constructor(n, d = 1) {
    if (!Number.isSafeInteger(n) || !Number.isSafeInteger(d) || d === 0) throw new Error(`bad fraction ${n}/${d}`);
    if (d < 0) { n = -n; d = -d; }
    const g = gcd(n, d) || 1;
    this.n = n / g; this.d = d / g;
  }
  add(o) { return new Q(this.n * o.d + o.n * this.d, this.d * o.d); }
  sub(o) { return new Q(this.n * o.d - o.n * this.d, this.d * o.d); }
  mul(o) { return new Q(this.n * o.n, this.d * o.d); }
  div(o) { return new Q(this.n * o.d, this.d * o.n); }
  cmp(o) { return Math.sign(this.n * o.d - o.n * this.d); }
  eq(o) { return this.cmp(o) === 0; }
  floor() { return Math.floor(this.n / this.d); }
  toString() { return this.d === 1 ? `${this.n}` : `${this.n}/${this.d}`; }
}
const q = (n, d = 1) => new Q(n, d);
const ONE = q(1);
const sumQ = (xs) => xs.reduce((a, b) => a.add(b), q(0));

/* ---- reading LaTeX -------------------------------------------- */

const decode = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')
  .replace(/&nbsp;/g, ' ').replace(/&minus;|−/g, '-');

function prep(src) {
  return decode(src)
    .replace(/\\text\{\s*times half\s*\}/g, '*\\frac{1}{2}')
    .replace(/\\text\{\s*times\s*\}/g, '*')
    .replace(/\\left|\\right/g, '')
    .replace(/\\(?:quad|qquad)/g, ' ')
    .replace(/\\[,;! ]/g, ' ')
    .replace(/\\times|\\cdot/g, '*')
    .replace(/\\div/g, '/')
    .replace(/\\[dt]frac/g, '\\frac')
    .replace(/\{,\}/g, '');
}

/* A small parser: numbers, \frac{}{}, a whole number written against a
   \frac as a mixed number, + - * / and brackets. Anything else throws,
   and the span is reported as not arithmetic rather than dropped. */
function parse(src) {
  const s = prep(src);
  let i = 0;
  const ws = () => { while (s[i] === ' ' || s[i] === '\n' || s[i] === '\r' || s[i] === '\t') i++; };
  const group = () => {
    ws();
    if (s[i] !== '{') throw new Error('expected {');
    let depth = 0, j = i;
    for (; j < s.length; j++) {
      if (s[j] === '{') depth++;
      else if (s[j] === '}' && --depth === 0) break;
    }
    const inner = s.slice(i + 1, j);
    i = j + 1;
    return parse(inner);
  };
  const frac = () => { i += 5; const a = group(); const b = group(); return a.div(b); };
  function factor() {
    ws();
    if (s[i] === '-') { i++; return q(0).sub(factor()); }
    if (s[i] === '(') { i++; const v = expr(); ws(); if (s[i++] !== ')') throw new Error('expected )'); return v; }
    if (s[i] === '{') return group();
    if (s.startsWith('\\frac', i)) return frac();
    const m = /^\d+/.exec(s.slice(i));
    if (m) {
      i += m[0].length;
      const whole = q(Number(m[0]));
      if (s.startsWith('\\frac', i)) return whole.add(frac()); // mixed number
      return whole;
    }
    throw new Error(`cannot read "${s.slice(i, i + 12)}"`);
  }
  function term() {
    let v = factor();
    for (;;) {
      ws();
      if (s[i] === '*') { i++; v = v.mul(factor()); }
      else if (s[i] === '/') { i++; v = v.div(factor()); }
      else return v;
    }
  }
  function expr() {
    let v = term();
    for (;;) {
      ws();
      if (s[i] === '+') { i++; v = v.add(term()); }
      else if (s[i] === '-') { i++; v = v.sub(term()); }
      else return v;
    }
  }
  const v = expr();
  ws();
  if (i !== s.length) throw new Error(`left over "${s.slice(i)}"`);
  return v;
}
/* An unreadable value is not null but a poison: every comparison with it
   is false and every sum with it is poison, so a check that meets one
   fails with its own message instead of crashing the script. */
const BAD = new Proxy({}, { get: (t, k) => (k === 'eq' ? () => false : k === 'cmp' ? () => NaN
  : k === 'toString' || k === Symbol.toPrimitive ? () => 'unreadable' : k === 'n' || k === 'd' ? NaN
  : k === 'then' ? undefined : () => BAD) });
const val = (src) => { try { return parse(src); } catch { return BAD; } };

/* Split a statement at = < > outside braces. */
function relations(src) {
  const s = decode(src);
  const sides = [], ops = [];
  let depth = 0, from = 0;
  for (let k = 0; k < s.length; k++) {
    const c = s[k];
    if (c === '{') depth++;
    else if (c === '}') depth--;
    else if (depth === 0 && (c === '=' || c === '<' || c === '>')) {
      sides.push(s.slice(from, k)); ops.push(c); from = k + 1;
    }
  }
  sides.push(s.slice(from));
  return { sides, ops };
}

/* The literal shape of a printed value: 7/4, 1 3/4, or 5. */
function shape(src) {
  const s = prep(src).replace(/\s+/g, '');
  let m = /^(\d+)\\frac\{(\d+)\}\{(\d+)\}$/.exec(s);
  if (m) return { kind: 'mixed', w: +m[1], a: +m[2], b: +m[3] };
  m = /^\\frac\{(\d+)\}\{(\d+)\}$/.exec(s);
  if (m) return { kind: 'frac', a: +m[1], b: +m[2] };
  m = /^(\d+)$/.exec(s);
  if (m) return { kind: 'whole', w: +m[1] };
  return null;
}
/* A final answer is in lowest terms, and a mixed number is proper. */
function finished(src) {
  const f = shape(src);
  if (!f) return false;
  if (f.kind === 'whole') return true;
  if (gcd(f.a, f.b) !== 1) return false;
  if (f.kind === 'mixed') return f.a < f.b && f.w > 0;
  return true;
}
const norm = (src) => prep(src).replace(/\s+/g, '');
const spans = (html) => [...decode(html).matchAll(/\$([^$]+)\$/g)].map(m => m[1]);
const lastVal = (html) => { const s = spans(html || ''); if (!s.length) return BAD; const r = relations(s[s.length - 1]).sides; return val(r[r.length - 1]); };
const strip = (html) => decode(html).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

/* ---- the files ------------------------------------------------ */

const pageFiles = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const PAGES = pageFiles.map(f => ({ f, html: fs.readFileSync(path.join(DIR, f), 'utf8') }));
const BODY = PAGES.filter(p => /^p0/.test(p.f));
const BEYOND = PAGES.filter(p => /^p1/.test(p.f));
const ALL = PAGES.map(p => p.html).join('\n');
const ANSWERS = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8').replace(/\r/g, '');

/* ---- A. every relation, evaluated ----------------------------- */

let checked = 0;
const skipped = [];

/* A sum the book prints as someone's mistake, to be shown wrong. It must
   stay false, and the prose round it must say so. */
const PRINTED_WRONG = [String.raw`\frac{1}{3}+\frac{1}{4}=\frac{2}{7}`];

function sweep(label, text) {
  for (const raw of spans(text)) {
    // "A, \quad B" and "A \quad \text{and} \quad B" are two statements
    for (const part of raw.split(/,\s*\\quad|\\quad\s*\\text\{and\}\s*\\quad/)) {
      const { sides, ops } = relations(part);
      if (!ops.length) continue;
      // a leading "= ..." continues the line above; drop the empty side
      while (sides.length && !sides[0].trim()) { sides.shift(); ops.shift(); }
      if (sides.length < 2 || sides.some(x => !x.trim())) continue;
      const vals = sides.map(val);
      if (vals.some(v => v === BAD)) { skipped.push(`${label}: $${part.trim()}$`); continue; }
      checked++;
      let ok = true;
      for (let k = 0; k < ops.length; k++) {
        const c = vals[k].cmp(vals[k + 1]);
        if ((ops[k] === '=' && c !== 0) || (ops[k] === '<' && c !== -1) || (ops[k] === '>' && c !== 1)) ok = false;
      }
      const claimedWrong = PRINTED_WRONG.includes(norm(part));
      if (claimedWrong) { if (ok) fails.push(`${label}: $${part.trim()}$ is printed as a mistake, but it is true`); else pass++; }
      else if (ok) pass++;
      else fails.push(`${label}: $${part.trim()}$ — the sides are ${vals.join(', ')}`);
    }
  }
}
for (const p of PAGES) sweep(p.f, p.html.replace(/<svg[\s\S]*?<\/svg>/g, ' '));
const pageChecked = checked;
sweep('ANSWERS.md', ANSWERS);
const answersChecked = checked - pageChecked;

/* ---- the chapter's blocks, read in order ---------------------- */

function balanced(html, openRe) {
  const out = [];
  let m;
  const re = new RegExp(openRe.source, 'g');
  while ((m = re.exec(html))) {
    let depth = 1;
    const tag = /<\/?div\b[^>]*>/g;
    tag.lastIndex = m.index + m[0].length;
    let t;
    while (depth > 0 && (t = tag.exec(html))) {
      depth += t[0].startsWith('</') ? -1 : 1;
      if (depth === 0) out.push(html.slice(m.index + m[0].length, t.index));
    }
  }
  return out;
}

const examples = (pages) => pages.flatMap(p => balanced(p.html, /<div class="c-example">/).map(e => {
  const tab = (/c-example__tab">([^<]*)</.exec(e) || [])[1];
  const qp = (/<div class="c-example__body">\s*<p>([\s\S]*?)<\/p>/.exec(e) || [])[1] || '';
  const rows = [...e.matchAll(/<span class="work__label">([^<]*)<\/span>\s*<span>([\s\S]*?)<\/span>/g)]
    .map(r => ({ label: r[1], html: r[2] }));
  const ans = rows.find(r => r.label === 'Answer');
  return { f: p.f, tab, q: qp, qs: spans(qp), rows, ans: ans ? ans.html : null, as: ans ? spans(ans.html) : [], all: e };
}));

const BODY_EX = examples(BODY);
const BEYOND_EX = examples(BEYOND);

/* Exercise questions: set name → question number → { html, parts } */
function exercises(pages) {
  const out = {};
  let set = null;
  for (const p of pages) {
    for (const blk of balanced(p.html, /<div class="c-practice(?: c-practice--cont)?">/)) {
      const head = /c-practice__head">(?:<span class="c-practice__num">\d+<\/span>)?([^<]*)</.exec(blk);
      if (head) set = head[1].trim();
      const ol = /<ol class="c-questions"(?: data-start="(\d+)")?>([\s\S]*)<\/ol>/.exec(blk);
      if (!ol) continue;
      const n = ol[1] ? Number(ol[1]) : 1;
      const li = ol[2].replace(/^\s*<li>/, '').replace(/<\/li>\s*$/, '');
      const partLists = [...li.matchAll(/<ol class="(c-parts[^"]*)">([\s\S]*?)<\/ol>/g)]
        .map(m => ({ cls: m[1], items: m[2].split(/<li>/).slice(1).map(x => x.replace(/<\/li>\s*$/, '')) }));
      const stem = li.split(/<ol class="c-parts/)[0];
      (out[set] ||= {})[n] = { html: li, stem, parts: partLists };
    }
  }
  return out;
}
const EX = exercises(BODY);
const PR = exercises(BEYOND)['Practice'] || {};

const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x', 'xi', 'xii', 'xiii'];

/* ANSWERS.md, read by section, question and part. */
function section(title) {
  const lines = ANSWERS.split('\n');
  const at = lines.findIndex(l => l.trim() === `### ${title}`);
  if (at < 0) { fails.push(`ANSWERS.md has no section "${title}"`); return ''; }
  const end = lines.findIndex((l, k) => k > at && /^#{2,3} /.test(l));
  return lines.slice(at + 1, end < 0 ? undefined : end).join('\n');
}
function item(sec, n) {
  const m = new RegExp(`(?:^|\\n)${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`).exec(sec);
  if (!m) { fails.push(`ANSWERS.md: no item ${n} in a section`); return ''; }
  return m[1];
}
function part(text, label) {
  const m = new RegExp(`- \\(${label}\\) (.*)`).exec(text);
  if (!m) { fails.push(`ANSWERS.md: no part (${label}) in "${text.slice(0, 50)}…"`); return ''; }
  return m[1];
}

/* ---- B. the body ---------------------------------------------- */

// 7.1: a larger denominator gives a smaller unit, as the prose says
is('7.1 1/100 is bigger than 1/200', /\$\\frac\{1\}\{100\}\$ is bigger than \$\\frac\{1\}\{200\}\$/.test(ALL) && q(1, 100).cmp(q(1, 200)) === 1);
is('7.1 1/9 < 1/5, which Arvin got the wrong way round', q(1, 9).cmp(q(1, 5)) === -1);

// Fig. 7.2: the two pieces, measured off the drawing
function figure(html, labelStart) {
  const i = html.indexOf(labelStart);
  if (i < 0) return null;
  return html.slice(html.lastIndexOf('<svg', i), html.indexOf('</svg>', i));
}
const shoelace = (pts) => Math.abs(pts.reduce((a, [x, y], k) => {
  const [x2, y2] = pts[(k + 1) % pts.length];
  return a + x * y2 - x2 * y;
}, 0)) / 2;
const pointsOf = (s) => s.trim().split(/\s+/).map(p => p.split(',').map(Number));
{
  const svg = figure(ALL, 'aria-label="A whole chikki of 24 small squares, and the same');
  const whole = /<rect class="dg-line" x="[\d.]+" y="[\d.]+" width="([\d.]+)" height="([\d.]+)"/.exec(svg);
  const cell = Number(whole[1]) / 6;
  is('Fig 7.2 the whole chikki is 6 squares by 4', Number(whole[2]) / cell === 4);
  const big = /<polygon class="dg-line" points="([^"]+)"/.exec(svg)[1];
  const small = [...svg.matchAll(/<rect class="dg-line" x="[\d.]+" y="[\d.]+" width="([\d.]+)" height="([\d.]+)"/g)][1];
  const bigN = Math.round(shoelace(pointsOf(big)) / (cell * cell));
  const smallN = Math.round(Number(small[1]) * Number(small[2]) / (cell * cell));
  same('Fig 7.2 squares in the bigger and smaller piece', [bigN, smallN], [18, 6]);
  is('7.2 "The bigger piece has 18 of the 24 squares"', ALL.includes(`bigger piece has ${bigN} of the 24 squares`));
  is('7.2 "The smaller piece has 6 small squares"', ALL.includes(`smaller piece has ${smallN} small squares`));
  is('7.2 the smaller piece is a quarter', q(smallN, 24).eq(q(1, 4)) && q(bigN, 24).eq(q(3, 4)));
}

// Fig. 7.3: a square piece and a triangle are each 4 of the 24 squares
{
  const svg = figure(ALL, 'aria-label="Two copies of the chikki, each cut into 6 equal pieces');
  const outline = /<rect class="dg-line" x="[\d.]+" y="[\d.]+" width="([\d.]+)" height="([\d.]+)"/.exec(svg);
  const cell = Number(outline[1]) / 6;
  const sq = /<rect class="dg-fill-a" x="[\d.]+" y="[\d.]+" width="([\d.]+)" height="([\d.]+)"/.exec(svg);
  const tri = /<polygon class="dg-fill-a" points="([^"]+)"/.exec(svg)[1];
  same('Fig 7.3 squares in a square piece and in a triangle',
    [Number(sq[1]) * Number(sq[2]) / cell / cell, shoelace(pointsOf(tri)) / cell / cell], [4, 4]);
  const tr = section('Think and Reflect (after Fig. 7.3)');
  is('A Fig 7.3 answer gives 4 small squares and 1/6', /which is 4 small squares/.test(tr) && tr.includes(String.raw`$\frac{1}{6}$`));
  is('A Fig 7.3 third way: 6 strips of 1 by 4 make 24', 6 * 1 * 4 === 24);
}

// Fig. 7.4 and Exercise 7.2 Q1: every piece measured off the drawing
{
  const svg = figure(ALL, 'aria-label="A whole chikki of 24 small squares and eight pieces');
  const whole = /<rect class="dg-line" x="[\d.]+" y="[\d.]+" width="([\d.]+)" height="([\d.]+)"/.exec(svg);
  const cell = Number(whole[1]) / 6;
  is('Fig 7.4 the whole is 24 squares', Number(whole[1]) * Number(whole[2]) / cell / cell === 24);
  const polys = [...svg.matchAll(/<polygon class="dg-line" points="([^"]+)"\/>\s*<text[^>]*>([a-h])<\/text>/g)];
  same('Fig 7.4 has pieces a to h', polys.map(m => m[2]), ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
  const ans = item(section('Exercise 7.2'), 1);
  for (const [, pts, letter] of polys) {
    // the drawing's coordinates are rounded to 0.01, so round the area
    // and insist it was a whole number of squares to begin with
    const raw = shoelace(pointsOf(pts)) / cell / cell;
    const n = Math.round(raw);
    is(`Fig 7.4 piece ${letter} is a whole number of squares (${raw})`, Math.abs(raw - n) < 0.01);
    const line = part(ans.replace(/- ([a-h]):/g, '- ($1)'), letter);
    const sp = spans(line);
    const last = relations(sp[sp.length - 1]).sides.pop();
    is(`7.2 Q1 piece ${letter} is ${n} squares, and the answer says so`, new RegExp(`\\b${n} squares?`).test(line));
    is(`7.2 Q1 piece ${letter}: printed ${last} is ${q(n, 24)}`, val(last) && val(last).eq(q(n, 24)) && finished(last));
  }
  is('7.2 Q2 a 2 by 2 half-block is 2 squares, which is 1/12', q(2 * 2, 2).div(q(24)).eq(q(1, 12)));
}

// Fig. 7.6 and Exercise 7.3 Q5: count the cuts in each roti
{
  const svg = figure(ALL, 'aria-label="Four rotis.');
  const blocks = svg.split(/<text class="dg-note"[^>]*>/).slice(1);
  const got = {};
  for (const b of blocks) {
    const letter = b[0];
    const cuts = (b.match(/<line class="dg-thin"/g) || []).length;
    got[letter] = cuts;
  }
  const five = item(section('Exercise 7.3'), 5);
  for (const [letter, parts] of Object.entries(got)) {
    const m = new RegExp(`${letter} is\\s+\\$\\\\frac\\{1\\}\\{(\\d+)\\}\\$`).exec(five);
    is(`7.3 Q5 roti ${letter} has ${parts} parts, and the answer says 1/${m && m[1]}`, m && Number(m[1]) === parts);
  }
  const set = strip(EX['Exercise Set 7.3'][5].html);
  is('7.3 Q5 the four units offered are the four rotis',
    JSON.stringify(spans(EX['Exercise Set 7.3'][5].html).map(s => val(s).d).sort((a, b) => a - b))
    === JSON.stringify(Object.values(got).sort((a, b) => a - b)) && set.length > 0);
}

// Figs. 7.7 to 7.10: every bar measured against the unit
function bars(svg) {
  const lines = [];
  // one number line per "0" tick
  const zeros = [...svg.matchAll(/<text class="dg-tick" x="([\d.]+)" y="([\d.]+)"[^>]*>0<\/text>/g)];
  const ones = [...svg.matchAll(/<text class="dg-tick" x="([\d.]+)" y="([\d.]+)"[^>]*>1<\/text>/g)]
    .filter(m => zeros.some(z => z[2] === m[2]));
  const rects = [...svg.matchAll(/<rect class="dg-fill-b" x="([\d.]+)" y="([\d.]+)" width="([\d.]+)"[^>]*\/>(\s*<text class="dg-note"[^>]*>([A-D])<\/text>)?/g)];
  zeros.forEach((z, k) => {
    const x0 = Number(z[1]), unit = Number(ones[k][1]) - x0, y = Number(z[2]);
    const prevY = k ? Number(zeros[k - 1][2]) : -1;
    const mine = rects.filter(r => Number(r[2]) < y && Number(r[2]) > prevY);
    lines.push(mine.map(r => ({ label: r[5] || null, len: (Number(r[3]) / unit) })));
  });
  return lines;
}
const asQ = (x, parts) => { const n = Math.round(x * parts); is(`a bar is a whole number of ${parts}ths (${x})`, Math.abs(n - x * parts) < 1e-9); return q(n, parts); };
{
  const l7 = bars(figure(ALL, 'aria-label="A number line from 0 to 2 with each unit cut into 2 equal parts'));
  same('Fig 7.7 the bar', l7[0].map(b => asQ(b.len, 2).toString()), ['1/2']);
  is('A Fig 7.7', ANSWERS.includes(String.raw`The bar is $\frac{1}{2}$ unit long`));

  const l8 = bars(figure(ALL, 'aria-label="Three number lines from 0 to 2.'));
  const t8 = section('Think and Reflect (Fig. 7.8)');
  const b1 = l8[0].map(b => asQ(b.len, 3));
  const b2 = l8[1].map(b => asQ(b.len, 5)).sort((a, b) => a.cmp(b));
  same('Fig 7.8 (i) bar', b1.map(String), [String(val(spans(item(t8, 1))[0]))]);
  same('Fig 7.8 (ii) bars', b2.map(String), spans(item(t8, 2)).map(s => String(val(s))));
  same('Fig 7.8 (iii) boxes', spans(item(t8, 3)).map(s => String(val(s))),
    [1, 2, 3, 4, 5, 6, 7].map(k => String(q(k, 8))));
  is('Fig 7.8 (iii) has no bar', l8[2].length === 0);

  const l9 = bars(figure(ALL, 'aria-label="A number line from 0 to 2 in halves.'));
  const bB = l9[0].find(b => b.label === 'B');
  const bA = l9[0].find(b => b.label === 'A');
  is('Fig 7.9 bar A is the half the question says', asQ(bA.len, 2).eq(q(1, 2)) && EX['Exercise Set 7.4'][4].html.includes(String.raw`bar A is $\frac{1}{2}$ unit long`));
  const a4 = item(section('Exercise 7.4'), 4);
  is(`7.4 Q4 bar B is ${asQ(bB.len, 2)}`, val(spans(a4)[0]).eq(asQ(bB.len, 2)));

  const l10 = bars(figure(ALL, 'aria-label="A number line from 0 to 2 in fifths'));
  const a5 = item(section('Exercise 7.4'), 5);
  for (const b of l10[0]) {
    const m = new RegExp(`${b.label} is\\s+\\$([^$]+)\\$`).exec(a5);
    is(`7.4 Q5 bar ${b.label} is ${asQ(b.len, 5)}`, m && val(m[1]).eq(asQ(b.len, 5)));
  }
  const bl = [...a5.matchAll(/\$([^$]+)\$/g)];
  is('7.4 Q5 all four bars answered', bl.length === 4);
}

// Exercise 7.1
{
  const a = section('Exercise 7.1');
  is('7.1 Q1 three guavas in 1 kg', val(spans(item(a, 1))[0]).eq(ONE.div(q(3))) && /Three guavas together weigh 1 kg/.test(ALL));
  is('7.1 Q2 1 kg in 4 packets', val(spans(item(a, 2))[0]).eq(ONE.div(q(4))) && /1 kg of rice into 4 packets/.test(ALL));
  is('7.1 Q3 3 glasses for 4 friends', val(spans(item(a, 3))[0]).eq(q(3, 4)) && /Four friends order 3 glasses/.test(ALL));
  const fish = spans(EX['Exercise Set 7.1'][4].html).map(val);
  is('7.1 Q4 the two fish together', val(spans(item(a, 4))[0]).eq(fish[0].add(fish[1])));
  const six = spans(item(a, 6)).map(val);
  is('7.1 Q6 in order, smallest first', six.every((v, k) => !k || six[k - 1].cmp(v) === -1));
  same('7.1 Q6 the six amounts', six.map(String), ['1/4', '1/2', '3/4', '5/4', '3/2', '5/2']);
}

// Think and Reflect: the strip of eighths, and Exercise 7.3
{
  const t = section('Think and Reflect (the strip of eighths)');
  for (const k of [1, 2, 3, 4]) {
    const s = spans(item(t, k))[0];
    const { sides } = relations(s);
    const n = Number(/^(\d+)/.exec(norm(sides[0]))[1]);
    is(`T&R eighths ${k}: ${n} times 1/8`, val(sides[1]).eq(q(n, 8)) && norm(sides[1]) === `\\frac{${n}}{8}`);
  }
  const a = section('Exercise 7.3');
  const sp1 = spans(item(a, 1));
  is('7.3 Q1 five and six halves', sp1.length === 2
    && relations(sp1[0]).sides[0].split('+').length === 5 && relations(sp1[1]).sides[0].split('+').length === 6);
  is('7.3 Q1 six halves are 3 wholes', q(6, 2).eq(q(3)) && item(a, 1).includes('Six halves make 3 wholes'));
  const four = item(a, 4);
  const qs = EX['Exercise Set 7.3'][4].parts[0].items.map(x => Number(/(\d+) \\text/.exec(x)[1]));
  qs.forEach((n, k) => {
    const s = spans(part(four, ROMAN[k]))[0];
    const { sides } = relations(s);
    is(`7.3 Q4 (${ROMAN[k]}) ${n} quarters added`, sides[0].split('+').length === n && val(sides[1]).eq(q(n, 4)));
  });
  is('7.3 Q4 (i) 5/4 is one whole and one quarter', q(5, 4).eq(ONE.add(q(1, 4))) && /one whole roti cut into 4 quarters, and one quarter/.test(four));
  is('7.3 Q4 (ii) 9/4 is two wholes and one quarter', q(9, 4).eq(q(2).add(q(1, 4))) && /two whole rotis cut into quarters, and one quarter/.test(four));
  is('7.3 Q3 half of a third is a sixth', q(1, 3).div(q(2)).eq(q(1, 6)));
}

// Exercise 7.4
{
  const a = section('Exercise 7.4');
  const drawn = spans(EX['Exercise Set 7.4'][1].html).map(val);
  const one = item(a, 1);
  is('7.4 Q1 the three bars', drawn.every(v => spans(one).some(s => val(s) && val(s).eq(v)))
    || spans(one).filter(s => val(s)).length >= 3);
  is('7.4 Q1 4/5 is the eighth mark in tenths', q(4, 5).eq(q(8, 10)) && one.includes('eighth mark'));
  is('7.4 Q2 the five fractions are each between 0 and 1',
    spans(item(a, 2)).map(val).every(v => v.cmp(q(0)) === 1 && v.cmp(ONE) === -1) && spans(item(a, 2)).length === 5);
}

// Table 7.1 and the claims round it
{
  const tb = /<caption>Table 7.1[\s\S]*?<tbody>([\s\S]*?)<\/tbody>/.exec(ALL)[1];
  const cells = [...tb.matchAll(/<td>([\s\S]*?)<\/td>/g)].map(c => spans(c[1])[0].split(/,\s*\\\s*/).map(val));
  is('Table 7.1 first column is all less than 1', cells[0].every(v => v.cmp(ONE) === -1));
  is('Table 7.1 second column is all more than 1', cells[1].every(v => v.cmp(ONE) === 1));
  const fig710 = bars(figure(ALL, 'aria-label="A number line from 0 to 2 in fifths'))[0].map(b => asQ(b.len, 5).toString());
  is('Table 7.1 holds the four bars of Fig. 7.10', fig710.every(x => cells[1].some(v => String(v) === x)));
  is('7.5 4/3 is greater than 1', q(4, 3).cmp(ONE) === 1);
  is('7.5 "such as 2/3 and 4/5" are less than 1', q(2, 3).cmp(ONE) < 0 && q(4, 5).cmp(ONE) < 0);
}

// Exercises 7.5, 7.6 and 7.7
{
  const a = section('Exercise 7.5');
  const f1 = val(spans(EX['Exercise Set 7.5'][1].html)[0]);
  is(`7.5 Q1 whole units in ${f1}`, item(a, 1).startsWith(`**${f1.floor()}** whole units`));
  const [x, y] = spans(EX['Exercise Set 7.5'][2].html).map(val);
  const two = item(a, 2);
  is(`7.5 Q2 whole units in ${x} and ${y}`, two.includes(`has **${x.floor()}** whole unit`) && two.includes(`has **${y.floor()}**:`));

  const b = section('Exercise 7.6');
  EX['Exercise Set 7.6'][1].parts[0].items.forEach((it, k) => {
    const f = val(spans(it)[0]);
    const line = part(item(b, 1), ROMAN[k]);
    const s = relations(spans(line)[0]).sides;
    is(`7.6 Q1 (${ROMAN[k]}) ${f} has ${f.floor()} wholes`,
      norm(s[0]) === norm(spans(it)[0]) && line.endsWith(`**${f.floor()}**`) && finished(s[1]) && shape(s[1]).w === f.floor());
  });
  EX['Exercise Set 7.6'][3].parts[0].items.forEach((it, k) => {
    const line = part(item(b, 3), ROMAN[k]);
    const s = relations(spans(line)[0]).sides;
    is(`7.6 Q3 (${ROMAN[k]}) ${spans(it)[0]} as a proper mixed number`,
      norm(s[0]) === norm(spans(it)[0]) && shape(s[1]) && shape(s[1]).kind === 'mixed' && finished(s[1]));
  });
  is('7.6 Q3 the example printed in the question', val(String.raw`\frac{5}{2}`).eq(val(String.raw`2\frac{1}{2}`)));
  is('7.6 Q2 6/3 is a whole number', q(6, 3).d === 1);

  const c = section('Exercise 7.7');
  EX['Exercise Set 7.7'][1].parts[0].items.forEach((it, k) => {
    const line = part(item(c, 1), ROMAN[k]);
    const s = relations(spans(line)[0]).sides;
    is(`7.7 (${ROMAN[k]}) ${spans(it)[0]} as a fraction`,
      norm(s[0]) === norm(spans(it)[0]) && shape(s[1]) && shape(s[1]).kind === 'frac');
  });
}

// 7.6: the fraction wall, and Exercises 7.8 to 7.13
{
  is('7.6 1/3 and 2/6 are equivalent', q(1, 3).eq(q(2, 6)) && ANSWERS.includes('$\\frac{1}{3}$ and $\\frac{2}{6}$ are\nequivalent'));
  const a = section('Exercise 7.8');
  const E8 = EX['Exercise Set 7.8'];
  const [a1, b1] = spans(E8[1].html).map(val);
  is('7.8 Q1 equal', a1.eq(b1) && item(a, 1).startsWith('**Yes.**'));
  const [a2, b2] = spans(E8[2].html).map(val);
  is('7.8 Q2 equivalent', a2.eq(b2) && item(a, 2).startsWith('**Yes.**'));
  for (const n of [3, 4]) {
    const [unit, len] = spans(E8[n].html).map(val);
    is(`7.8 Q${n} ${len.div(unit)} pieces`, item(a, n).startsWith(`**${len.div(unit)}** pieces`));
  }
  const five = spans(E8[5].html).map(val);
  is('7.8 Q5 all three are one half', five.every(v => v.eq(q(1, 2))) && item(a, 5).startsWith('**Yes.**'));
  const six = val(spans(E8[6].html)[0]);
  is('7.8 Q6 both answers are equivalent to the question',
    spans(item(a, 6)).length === 2 && spans(item(a, 6)).every(s => val(s).eq(six)));
  const seven = val(spans(E8[7].html)[0]);
  is('7.8 Q7 every fraction listed is equivalent to the question',
    spans(item(a, 7)).length >= 6 && spans(item(a, 7)).every(s => val(s).eq(seven)));
  is('7.8 Q7 the wall stops at tenths, and 2/3, 6/9 are its only ones',
    [2, 3, 4, 5, 6, 7, 8, 9, 10].filter(d => (seven.n * d) % seven.d === 0).map(d => `${seven.n * d / seven.d}/${d}`).join() === '2/3,4/6,6/9');
  // note: 4/6 is the fraction itself, so the wall adds 2/3 and 6/9

  const b = section('Exercise 7.9');
  const words = { One: 1, Two: 2, Three: 3, Four: 4, Five: 5 };
  for (const n of [1, 2]) {
    const m = /(\w+) rotis? (?:are|is) shared equally by (\d+) children/.exec(strip(EX['Exercise Set 7.9'][n].html));
    const rotis = words[m[1]], kids = Number(m[2]);
    const share = q(rotis, kids);
    const it = item(b, n);
    const sp = spans(it);
    is(`7.9 Q${n} each child gets ${share}`, val(sp[0]).eq(share));
    is(`7.9 Q${n} division, addition and multiplication`,
      norm(sp[1]).startsWith(`${rotis}/${kids}=`) && relations(sp[2]).sides[1].split('+').length === kids
      && norm(sp[3]).startsWith(`${rotis}=${kids}*`));
  }
  const m3 = /(\d+) cakes are shared equally by (\d+) children/.exec(strip(EX['Exercise Set 7.9'][3].html));
  is('7.9 Q3 Anil\'s share', val(spans(item(b, 3))[0]).eq(q(+m3[1], +m3[2])));
  const m4 = /grows to (\d+) children/.exec(strip(EX['Exercise Set 7.9'][4].html));
  const cakes = q(+m3[1], +m3[2]).mul(q(+m4[1]));
  is(`7.9 Q4 ${cakes} cakes`, cakes.d === 1 && item(b, 4).startsWith(`**${cakes} cakes.**`));

  const tr = section('Think and Reflect (after Fig. 7.13)');
  is('T&R three more halves', spans(item(tr, 1)).length === 3 && spans(item(tr, 1)).every(s => val(s).eq(q(1, 2)))
    && !spans(item(tr, 1)).some(s => ['\\frac{2}{4}', '\\frac{3}{6}'].includes(norm(s))));
  is('T&R 2 among 3, 4 among 6, 6 among 9', q(2, 3).eq(q(4, 6)) && q(4, 6).eq(q(6, 9)) && item(tr, 2).includes('$\\frac{2}{3}$'));
  is('7.6 3 cakes for 5 is 6 cakes for 10', q(3, 5).eq(q(6, 10)));

  const c = section('Exercise 7.10');
  const E10 = EX['Exercise Set 7.10'];
  const n1 = strip(E10[1].html).match(/\d+/g).map(Number);
  is(`7.10 Q1 ${n1[0]} for ${n1[1]} is ? for ${n1[2]}`, item(c, 1).startsWith(`**${n1[0] * n1[2] / n1[1]}** glasses`));
  const n2 = strip(E10[2].html).match(/\d+/g).map(Number);
  is(`7.10 Q2 ${n2[0]} into ${n2[1]} is ${n2[2]} into ?`, item(c, 2).startsWith(`**${n2[2] * n2[1] / n2[0]}** bags`));
  const s3 = spans(item(c, 3))[0];
  is('7.10 Q3 the instance is equivalent to 7/5', relations(s3).sides.every(x => val(x).eq(q(7, 5))) && /14 rotis shared equally by 10/.test(item(c, 3)));

  const t2 = section('Think and Reflect (sharing more things)');
  is('T&R the three pairs in the question', [[1, 5, 2, 5], [3, 7, 4, 7], [1, 2, 5, 8]].every(([a, b, c2, d]) => q(a, b).cmp(q(c2, d)) === -1)
    && ALL.includes(String.raw`$\frac{1}{5} < \frac{2}{5}$, $\frac{3}{7} < \frac{4}{7}$ and $\frac{1}{2} < \frac{5}{8}$`));
  is('T&R answer 2 answers the same three', item(t2, 2).includes('$\\frac{1}{5} < \\frac{2}{5}$'));

  const d = section('Exercise 7.11');
  const groups = EX['Exercise Set 7.11'][1].parts[0].items.map(it =>
    [...strip(it).matchAll(/(\d+) glasses for (\d+) children/g)].map(m => q(+m[1], +m[2])));
  groups.forEach(([g1, g2], k) => {
    const want = g1.cmp(g2) === 1 ? 'Group 1' : 'Group 2';
    is(`7.11 Q1 (${ROMAN[k]}) ${want} gets more (${g1} against ${g2})`, part(item(d, 1), ROMAN[k]).startsWith(`**${want}.**`));
  });
  is('7.11 Q2 pair (ii) has the same children', groups[1][0].d === groups[1][1].d && item(d, 2).startsWith('**Pair (ii)**'));

  const e = section('Exercise 7.12');
  EX['Exercise Set 7.12'][1].parts[0].items.forEach((it, k) => {
    const [x2, y2] = spans(it);
    const [sx, sy] = spans(part(item(e, 1), ROMAN[k]));
    const lx = relations(sx).sides, ly = relations(sy).sides;
    is(`7.12 (${ROMAN[k]}) same denominator for ${x2} and ${y2}`,
      norm(lx[0]) === norm(x2) && norm(ly[0]) === norm(y2)
      && shape(lx[1]).b === shape(ly[1]).b);
  });

  const f = section('Exercise 7.13');
  EX['Exercise Set 7.13'][1].parts[0].items.forEach((it, k) => {
    const line = part(item(f, 1), ROMAN[k]);
    const s = relations(spans(line)[0]).sides;
    const sh = shape(spans(it)[0]);
    const g = gcd(sh.a, sh.b);
    is(`7.13 (${ROMAN[k]}) ${sh.a}/${sh.b} in lowest terms, dividing by ${g}`,
      norm(s[0]) === norm(spans(it)[0]) && finished(s[1]) && shape(s[1]).kind === 'frac' && line.endsWith(`dividing both by ${g}`));
  });
  is('7.6 36/60 steps divide by 2, 2, 3', q(36, 60).eq(q(3, 5)) && 36 / 2 === 18 && 18 / 2 === 9 && 9 / 3 === 3 && gcd(36, 60) === 12);
}

// 7.7 and Exercise 7.14
{
  is('7.7 45 is a multiple of 5 and of 9', 45 % 5 === 0 && 45 % 9 === 0);
  is('7.7 63 is a common multiple of 9 and 21', 63 % 9 === 0 && 63 % 21 === 0);
  const a = section('Exercise 7.14');
  const E14 = EX['Exercise Set 7.14'];
  E14[1].parts[0].items.forEach((it, k) => {
    const [x, y] = spans(it);
    const line = part(item(a, 1), ROMAN[k]);
    const first = spans(line)[0];
    const c = val(x).cmp(val(y));
    const want = `${norm(x)}${c > 0 ? '>' : c < 0 ? '<' : '='}${norm(y)}`;
    is(`7.14 Q1 (${ROMAN[k]}) ${want}`, norm(first) === want);
  });
  for (const [n, dir] of [[2, 1], [3, -1]]) {
    E14[n].parts[0].items.forEach((it, k) => {
      const given = spans(it);
      const sorted = [...given].sort((x, y) => dir * val(x).cmp(val(y))).map(norm);
      const line = part(item(a, n), ROMAN[k]);
      const printed = spans(line).slice(0, given.length).map(norm);
      same(`7.14 Q${n} (${ROMAN[k]}) in order`, printed, sorted);
      const rest = spans(line).slice(given.length).map(val);
      const dens = rest.map(v => shape(spans(line)[given.length + rest.indexOf(v)]).b);
      is(`7.14 Q${n} (${ROMAN[k]}) the common-denominator list is the same order`,
        rest.length === given.length && rest.every((v, j) => v.eq(val(printed[j]))) && new Set(dens).size === 1);
    });
  }
}

// 7.8 and Exercises 7.15 to 7.17
function sumAnswers(set, n, title, from) {
  const a = section(title);
  EX[set][n].parts[0].items.forEach((it, k) => {
    let expr;
    const sp = spans(it);
    if (from) expr = `${norm(sp[1])}-${norm(sp[0])}`; // "A from B" is B - A
    else expr = norm(sp[0]);
    const line = part(item(a, n), ROMAN[k]);
    const s = relations(spans(line)[0]).sides;
    const last = s[s.length - 1];
    is(`${set} Q${n} (${ROMAN[k]}) answer line is for ${expr}`, norm(s[0]) === expr);
    is(`${set} Q${n} (${ROMAN[k]}) ends in lowest terms: ${last.trim()}`, finished(last) && val(last).eq(parse(expr)));
  });
}
{
  is('7.8 Meena and her brother', q(1, 2).add(q(1, 4)).eq(q(3, 4)));
  is('A T&R chikki left', lastVal(item(section('Think and Reflect (Meena\'s chikki)'), 1)).eq(ONE.sub(q(3, 4))));
  is('A T&R ten sevenths', q(4 + 6, 7).eq(q(10, 7)) && section('Think and Reflect (jumps in sevenths)').includes('tenth'));
  is('7.8 4 x 3 = 12 is a common denominator', 12 % 4 === 0 && 12 % 3 === 0);
  sumAnswers('Exercise Set 7.15', 1, 'Exercise 7.15');
  const a = section('Exercise 7.15');
  const E15 = EX['Exercise Set 7.15'];
  const paint = spans(E15[2].html).map(val);
  const s2 = relations(spans(item(a, 2))[0]).sides;
  is('7.15 Q2 green paint', val(s2[s2.length - 1]).eq(paint[0].add(paint[1])) && norm(s2[0]) === spans(E15[2].html).map(norm).join('+'));
  const lace = spans(E15[3].html).map(val);
  const s3 = relations(spans(item(a, 3))[0]).sides;
  const total = lace[0].add(lace[1]);
  is('7.15 Q3 lace', val(s3[s3.length - 1]).eq(total));
  is('7.15 Q3 enough, with the spare printed', total.cmp(ONE) >= 0 && item(a, 3).includes('**Yes, it is enough**')
    && val(spans(item(a, 3))[1]).eq(total.sub(ONE)));
  is('7.15 (vi) and (vii) are the same sum', val(spans(E15[1].parts[0].items[5])[0]).eq(val(spans(E15[1].parts[0].items[6])[0])));

  is('A T&R jumping back', lastVal(item(section('Think and Reflect (jumping back)'), 1)).eq(q(2, 7)));

  sumAnswers('Exercise Set 7.16', 1, 'Exercise 7.16');
  const b = section('Exercise 7.16');
  const bar = spans(EX['Exercise Set 7.16'][2].html).map(val);
  const sb = relations(spans(item(b, 2))[0]).sides;
  is('7.16 Q2 what Asha has left', val(sb[sb.length - 1]).eq(bar[0].sub(bar[1])) && finished(sb[sb.length - 1]));

  is('A T&R why 3 and 4', section('Think and Reflect (after Example 7)').includes('both denominators 12'));

  sumAnswers('Exercise Set 7.17', 1, 'Exercise 7.17');
  sumAnswers('Exercise Set 7.17', 2, 'Exercise 7.17', true);
  const c = section('Exercise 7.17');
  const E17 = EX['Exercise Set 7.17'];
  const [school, auto] = spans(E17[3].html).map(val);
  const sc = relations(spans(item(c, 3))[0]).sides;
  is('7.17 Q3 Jaya walks', val(sc[sc.length - 1]).eq(school.sub(auto)) && finished(sc[sc.length - 1]));
  const [jee, nam] = spans(E17[4].html).map(val);
  const quicker = jee.cmp(nam) < 0 ? 'Jeevika' : 'Namit';
  is(`7.17 Q4 ${quicker} is quicker`, item(c, 4).startsWith(`**${quicker} is quicker**`));
  is('7.17 Q4 by how much', val(spans(item(c, 4))[0]).eq(jee.sub(nam).cmp(q(0)) < 0 ? nam.sub(jee) : jee.sub(nam)));
}

// 7.9: the units puzzles
{
  // three different units: the chapter says there is only one answer
  const three = [];
  for (let a = 2; a < 50; a++) for (let b = a + 1; b < 200; b++) {
    const rest = ONE.sub(q(1, a)).sub(q(1, b));
    if (rest.n === 1 && rest.d > b) three.push([a, b, rest.d]);
  }
  same('7.9 three different units making 1', three, [[2, 3, 6]]);
  is('7.9 Fig 7.17 shows that one', ALL.includes(String.raw`$\frac{1}{2} + \frac{1}{3} + \frac{1}{6} = 1$`));

  // four different units: the chapter says there are six ways
  const four = [];
  for (let a = 2; a <= 4; a++) for (let b = a + 1; b <= 12; b++) {
    const r2 = ONE.sub(q(1, a)).sub(q(1, b));
    if (r2.cmp(q(0)) <= 0) continue;
    for (let c = b + 1; c <= 100; c++) {
      const r3 = r2.sub(q(1, c));
      if (r3.cmp(q(0)) <= 0) continue;
      if (r3.n === 1 && r3.d > c) four.push([a, b, c, r3.d]);
    }
  }
  const printedWays = { six: 6, five: 5, seven: 7 }[(/There are (\w+) ways/.exec(ALL) || [])[1]];
  same('7.9 the number of ways with four units', four.length, printedWays);
  const listed = spans(item(section('Think and Reflect (four fractional units)'), 1))
    .map(s => relations(s).sides[0].split('+').map(x => val(x).d));
  same('7.9 ANSWERS.md lists exactly those ways', listed, four);

  const hist = /\$\\frac\{19\}\{24\} = ([^$]+)\$/.exec(ALL)[1];
  is('7.9 the Egyptian fraction is made of different units',
    new Set(hist.split('+').map(x => val(x).d)).size === 3 && hist.split('+').every(x => val(x).n === 1));
}

// the body's worked examples: each Answer row recomputed from its question
{
  same('the body has eight worked examples', BODY_EX.length, 8);
  same('the body examples are numbered 1 to 8', BODY_EX.map(e => e.tab), Array.from({ length: 8 }, (_, k) => `Example ${k + 1}`));
  const [e1, e2, e3, e4, e5, e6, e7, e8] = BODY_EX;
  // Example 1 (7.6): lowest terms
  {
    const f = shape(e1.qs[0]);
    const g = gcd(f.a, f.b);
    const low = e1.as[e1.as.length - 1];
    is('body Ex 1 (7.6) is not in lowest terms, and the answer says No', g > 1 && /^No\b/.test(strip(e1.ans)));
    is('body Ex 1 (7.6) lowest terms', val(low).eq(val(e1.qs[0])) && finished(low) && norm(e1.as[0]) === norm(e1.qs[0]));
    is(`body Ex 1 (7.6) the common factor is ${g}`, strip(e1.all).includes(`divisible by ${g}`) && strip(e1.all).includes(`divide both by ${g}`));
  }
  // Examples 2 and 3 (7.7): comparison
  for (const [e, name] of [[e2, 'body Ex 2 (7.7)'], [e3, 'body Ex 3 (7.7)']]) {
    const [x, y] = e.qs;
    const c = val(x).cmp(val(y));
    is(`${name} answer is ${c > 0 ? '>' : '<'}`, norm(e.as[0]) === `${norm(x)}${c > 0 ? '>' : '<'}${norm(y)}`);
    const dens = e.rows.filter(r => /Step/.test(r.label)).flatMap(r => spans(r.html))
      .map(s => relations(s).sides.pop()).filter(s => shape(s) && shape(s).kind === 'frac').map(s => shape(s).b);
    is(`${name} both fractions rewritten over one denominator`, dens.length >= 2 && new Set(dens).size === 1
      && dens.every(d => d % val(x).d === 0 && d % val(y).d === 0));
  }
  is('body Ex 3 (7.7) 63 is a common multiple', strip(e3.all).includes('63 is a common multiple of 9 and 21') && 63 % 9 === 0 && 63 % 21 === 0);
  // Examples 4 to 8 (7.8): "Find E."
  for (const [e, name] of [[e4, 'body Ex 4 (7.8)'], [e5, 'body Ex 5 (7.8)'], [e6, 'body Ex 6 (7.8)'], [e7, 'body Ex 7 (7.8)'], [e8, 'body Ex 8 (7.8)']]) {
    const a = e.as[e.as.length - 1];
    is(`${name} answer ${a} is ${val(e.qs[0])} in lowest terms`, val(a).eq(val(e.qs[0])) && finished(a));
  }
  is('body Ex 5 (7.8) 15 is the smallest common multiple of 3 and 5', [...Array(15).keys()].slice(1).every(k => k % 3 || k % 5) && 15 % 3 === 0 && 15 % 5 === 0);
  is('body Ex 6 (7.8) 6 is the smallest common multiple of 6 and 3; 3 is the largest common factor of 3 and 6', gcd(3, 6) === 3);
  is('body Ex 8 (7.8) 2 1/3 is 7/3', q(7, 3).eq(val(String.raw`2\frac{1}{3}`)));
  is('body Ex 4 (7.8) Fig 7.15 bottom row: 4 and 6 shaded of 7',
    /a strip of 7 parts with 4 shaded, plus a strip with 6 shaded, makes one whole strip and a second strip with 3 shaded/.test(ALL) && 4 + 6 === 7 + 3);
  is('7.8 Fig 7.15 top row: 2 and 1 shaded of 5 make 3', /a strip of 5 parts with 2 shaded, plus a strip with 1 shaded, makes a strip with 3 shaded/.test(ALL));
  is('7.8 Fig 7.16: 6 shaded, 4 crossed, 2 left', /7 equal parts with 6 parts shaded. Four of the shaded parts are crossed out, leaving 2/.test(ALL) && 6 - 4 === 2);
}

/* ---- B. Beyond the Book -------------------------------------- */

// stage 1, kept word for word, so its claims are checked too
is('S1 5/6 is 1/6 short and 6/7 is 1/7 short', ONE.sub(q(5, 6)).eq(q(1, 6)) && ONE.sub(q(6, 7)).eq(q(1, 7)));
is('S1 6/7 > 5/6', q(6, 7).cmp(q(5, 6)) === 1);
is('S1 2/7 < 1/3, so Rohan is wrong', q(2, 7).cmp(q(1, 3)) === -1 && !q(1, 3).add(q(1, 4)).eq(q(2, 7)));
is('S1 3 1/2 is 14 quarters and 28 eighths', q(7, 2).eq(q(14, 4)) && q(7, 2).eq(q(28, 8)) && 14 * 2 === 28 && 3 * 4 + 2 === 14);
is('S1 3 1/2 prints 14/4 and 28/8', /so \$3\\frac\{1\}\{2\} = \\frac\{14\}\{4\}\$/.test(ALL) && /and \$3\\frac\{1\}\{2\} = \\frac\{28\}\{8\}\$/.test(ALL));
is('S1 no longer divides by a fraction (the ribbon is gone)', !/cut into pieces that are each/.test(ALL));
is('S1 halfway between 1/3 and 1/2', q(1, 3).add(q(1, 2)).div(q(2)).eq(q(5, 12)));
is('S1 in sixths 1/3 and 1/2 are next to each other', q(1, 3).mul(q(6)).eq(q(2)) && q(1, 2).mul(q(6)).eq(q(3)));
{
  // Priya 2/5 and Sunil 1/4 of the whole cake: is more than half left?
  const t = decode(ALL);
  const m = /Priya eats \$\\frac\{(\d+)\}\{(\d+)\}\$ of a cake, and Sunil eats \$\\frac\{(\d+)\}\{(\d+)\}\$ of the same cake/.exec(t);
  is('S1 Priya and Sunil are read off the page', !!m);
  if (m) {
    const priya = q(+m[1], +m[2]), sunil = q(+m[3], +m[4]);
    const left = ONE.sub(priya).sub(sunil);
    is('S1 twentieths are a common unit', (20 % priya.d === 0) && (20 % sunil.d === 0));
    is('S1 Priya 8/20, Sunil 5/20, eaten 13/20', priya.eq(q(8, 20)) && sunil.eq(q(5, 20)) && priya.add(sunil).eq(q(13, 20)));
    is('S1 7/20 left, less than half', left.eq(q(7, 20)) && left.cmp(q(1, 2)) < 0 && q(10, 20).eq(q(1, 2)));
    const said = /Priya eats \$([^$]+)\$ and Sunil eats \$([^$]+)\$, so together they eat \$([^$]+)\$\. What is left is \$([^$]+)\$\. Half the cake is \$([^$]+)\$/.exec(t);
    is('S1 the printed working: each share, the sum, what is left, and the half', !!said
      && val(said[1]).eq(priya) && shape(said[1]).b === 20 && val(said[2]).eq(sunil) && shape(said[2]).b === 20
      && val(said[3]).eq(priya.add(sunil)) && relations(said[4]).sides.every(s => val(s).eq(left) || val(s).eq(ONE) || val(s).eq(priya.add(sunil)))
      && val(relations(said[4]).sides.pop()).eq(left) && val(said[5]).eq(q(1, 2)));
    is('S1 the text says less than half is left', /so less than half is left/.test(t) === (left.cmp(q(1, 2)) < 0));
    is('S1 no fraction of a fraction (one third of what is left is gone)', !/one third of what is left/.test(t));
  }
}
{
  const s1 = section('Stage 1 · Using What You Know');
  is('A S1 1', item(s1, 1).startsWith('$\\frac{6}{7}$ is greater'));
  is('A S1 3', item(s1, 3).startsWith('**14 quarters**') && val(spans(item(s1, 3))[0].split('=')[1]).eq(q(14, 4))
    && val(spans(item(s1, 3))[1].split('=')[1]).eq(q(28, 8)) && item(s1, 3).includes('28 eighths'));
  is('A S1 4', val(spans(item(s1, 4))[0]).eq(q(5, 12)));
  is('A S1 5', item(s1, 5).startsWith('**No.**') && lastVal(`$${spans(item(s1, 5))[0]}$`).eq(q(13, 20))
    && val(spans(item(s1, 5))[1]).eq(q(7, 20)) && val(spans(item(s1, 5))[2]).eq(q(1, 2)));
}

// stage 2: Beyond Examples 1 to 19 (Beyond numbers its own, as Class 7 does), each Answer row recomputed from its question
{
  const tabs = BEYOND_EX.map(e => e.tab);
  same('Beyond examples are numbered 1 to 19, on their own', tabs,
    Array.from({ length: BEYOND_EX.length }, (_, k) => `Example ${1 + k}`));
  // keyed by place; the tab check above requires place N to print "Example N",
  // so a wrong tab fails that check instead of crashing the ones below
  const ex = Object.fromEntries(BEYOND_EX.map((e, i) => [i + 1, e]));
  const A = (n) => ex[n].as;
  const Qv = (n) => ex[n].qs.map(val);

  // Beyond Ex 1: order the units
  {
    const want = [...ex[1].qs].sort((x, y) => val(x).cmp(val(y))).map(norm).join('<');
    same('Beyond Ex 1 order', norm(A(1)[0]), want);
    same('Beyond Ex 1 denominators largest first', (strip(ex[1].rows[2].html).match(/\d+/g) || []).map(Number),
      ex[1].qs.map(s => val(s).d).sort((a, b) => b - a));
  }
  // Beyond Ex 2: a piece named as a part of the whole bar
  {
    const t = strip(ex[2].q);
    const [total, rows, perRow] = /marked into (\d+) small squares, in (\d+) rows of (\d+) squares/.exec(t).slice(1).map(Number);
    const [nRows, nSq] = /Of (\w+) rows\? Of (\d+) squares\?/.exec(t).slice(1);
    const k = { two: 2, three: 3, four: 4 }[nRows];
    is('Beyond Ex 2 the bar is rows x columns', rows * perRow === total);
    const want = [q(1, rows), q(k, rows), q(Number(nSq), total)];
    same('Beyond Ex 2 answers', A(2).map(s => String(val(s))), want.map(String));
    is('Beyond Ex 2 answers printed in lowest terms', A(2).every(finished));
    is('Beyond Ex 2 step 1 names 1/rows', strip(ex[2].rows[0].html).startsWith(`${rows} rows make the whole bar`) && val(spans(ex[2].rows[0].html)[0]).eq(q(1, rows)));
    is('Beyond Ex 2 step 2 counts the units', val(spans(ex[2].rows[1].html)[1]).eq(q(k, rows)));
    is('Beyond Ex 2 step 3: two pieces make the bar', 2 * Number(nSq) === total && relations(spans(ex[2].rows[2].html)[0]).sides.map(val).every(v => v.eq(q(total))));
    const note = /three rows are \$([^$]+)\$ squares, and each fifth of the bar is \$([^$]+)\$ squares/.exec(decode(ex[2].all));
    is('Beyond Ex 2 the square count agrees', !!note && relations(note[1]).sides.map(val).every(v => v.eq(q(k * perRow)))
      && relations(note[2]).sides.map(val).every(v => v.eq(q(total / rows))) && q(k * perRow, total).eq(q(k, rows)));
  }
  // Beyond Ex 7: equal shares, 4 rotis among 5 and 8 among 10
  {
    const t = strip(ex[7].q);
    const g = [...t.matchAll(/(\d+) rotis are shared equally by (\d+) children/g)].map(m => [Number(m[1]), Number(m[2])]);
    is('Beyond Ex 7 two groups read', g.length === 2);
    const [s1, s2] = g.map(([r, c]) => q(r, c));
    is('Beyond Ex 7 the second group is the first doubled', g[1][0] === 2 * g[0][0] && g[1][1] === 2 * g[0][1]);
    const ans = A(7).map(val);
    is('Beyond Ex 7 answer: the two shares', ans[0].eq(s1) && ans[1].eq(s2) && shape(A(7)[0]).b === g[0][1] && shape(A(7)[1]).b === g[1][1]);
    is('Beyond Ex 7 the shares are equal, and the page says so', s1.eq(s2) && /The shares are equal/.test(strip(ex[7].ans)));
    const r2 = spans(ex[7].rows[1].html);
    is('Beyond Ex 7 step 2 is rotis x one part, and a division', r2.length === 2 && relations(r2[0]).sides.map(val).every(v => v.eq(s1))
      && relations(r2[1]).sides.map(val).every(v => v.eq(s1)) && /\\div/.test(r2[1]));
    const r3 = spans(ex[7].rows[2].html);
    is('Beyond Ex 7 step 3 in tenths', relations(r3[0]).sides.map(val).every(v => v.eq(s2)) && strip(ex[7].rows[2].html).includes(`cut into ${g[1][1]} parts`));
    is('Beyond Ex 7 step 1 cuts into as many parts as children', strip(ex[7].rows[0].html).includes(`each of the ${g[0][0]} rotis into ${g[0][1]} equal parts`));
  }
  // Beyond Ex 3: 4 parts a unit, seventh mark
  {
    const parts = Number(/cut into (\d+) equal parts/.exec(strip(ex[3].q))[1]);
    const mark = { fifth: 5, sixth: 6, seventh: 7, eighth: 8 }[/ends at the (\w+) mark/.exec(strip(ex[3].q))[1]];
    const len = q(mark, parts);
    is(`Beyond Ex 3 the bar is ${len}`, val(A(3)[0]).eq(len) && /longer than 1 unit/.test(strip(ex[3].ans)) === (len.cmp(ONE) > 0));
  }
  // Beyond Ex 4: improper to mixed
  {
    const r = relations(A(4)[0]).sides;
    is('Beyond Ex 4 proper mixed number', norm(r[0]) === norm(ex[4].qs[0]) && shape(r[1]).kind === 'mixed' && finished(r[1]) && val(r[1]).eq(Qv(4)[0]));
  }
  // Beyond Ex 5: mixed to improper
  {
    const r = relations(A(5)[0]).sides;
    is('Beyond Ex 5 improper fraction', norm(r[0]) === norm(ex[5].qs[0]) && shape(r[1]).kind === 'frac' && val(r[1]).eq(Qv(5)[0]));
  }
  // Beyond Ex 6: the boxes
  {
    const [lhs, box1, box2] = relations(ex[6].qs[0]).sides;
    const f = val(lhs);
    const den1 = Number(/\{(\d+)\}\s*$/.exec(box1)[1]);
    const num2 = Number(/\\frac\{(\d+)\}/.exec(box2)[1]);
    const got = strip(ex[6].ans).match(/\d+/g).map(Number);
    same('Beyond Ex 6 the two boxes', got, [f.n * den1 / f.d, f.d * num2 / f.n]);
    is('Beyond Ex 6 both are whole numbers', Number.isInteger(f.n * den1 / f.d) && Number.isInteger(f.d * num2 / f.n));
  }
  // Beyond Ex 8: lowest terms, and the one-step divisor
  {
    const sh = shape(ex[8].qs[0]);
    const r = relations(A(8)[0]).sides;
    is('Beyond Ex 8 lowest terms', finished(r[1]) && val(r[1]).eq(Qv(8)[0]));
    is(`Beyond Ex 8 the largest common factor is ${gcd(sh.a, sh.b)}`, strip(ex[8].all).includes(`${gcd(sh.a, sh.b)} is the largest common factor of ${sh.a} and ${sh.b}`));
    is('Beyond Ex 8 108 and 144 end in 08 and 44, both multiples of 4', 8 % 4 === 0 && 44 % 4 === 0);
  }
  // Beyond Ex 9: exactly one of the four is in lowest terms
  {
    const low = ex[9].qs.filter(s => finished(s));
    is('Beyond Ex 9 exactly one option is in lowest terms', low.length === 1 && norm(A(9)[0]) === norm(low[0]));
    const shared = ex[9].qs.map(s => gcd(shape(s).a, shape(s).b));
    same('Beyond Ex 9 the common factors named', shared.filter(g => g > 1), [7, 13, 17]);
  }
  // Beyond Ex 10 and 11: comparing
  {
    const [x, y] = ex[10].qs;
    const c = val(x).cmp(val(y));
    same('Beyond Ex 10 comparison', norm(A(10)[0]), `${norm(x)}${c > 0 ? '>' : '<'}${norm(y)}`);
    is('Beyond Ex 10 36 is a common multiple smaller than 12 x 9', 36 % 12 === 0 && 36 % 9 === 0 && 36 < 12 * 9);
    const [f, h] = Qv(11);
    const c14 = f.cmp(h);
    is('Beyond Ex 11 less or more', strip(ex[11].ans).includes(c14 < 0 ? 'is less than' : 'is more than'));
    is('Beyond Ex 11 by how much', val(A(11)[2]).eq(c14 < 0 ? h.sub(f) : f.sub(h)));
    is('Beyond Ex 11 7 is less than half of 15', 7 + 7 === 14 && 14 < 15);
  }
  // Beyond Ex 12: ascending order, and the second way
  {
    const want = [...ex[12].qs].sort((x, y) => val(x).cmp(val(y))).map(norm).join('<');
    same('Beyond Ex 12 ascending order', norm(A(12)[0]), want);
    const extra = spans(ex[12].all.split('</div>\n          <p>').pop() || '');
    const t = /Each fraction is a little more than \$\\frac\{1\}\{2\}\$: ([\s\S]*?)\. Since/.exec(decode(ex[12].all));
    const pairs = [...t[1].matchAll(/\$([^$]+)\$ by \$([^$]+)\$/g)];
    is('Beyond Ex 12 each is more than a half by the amount printed',
      pairs.length === 3 && pairs.every(([, f, d]) => val(f).sub(q(1, 2)).eq(val(d))) && extra.length > 0);
    is('Beyond Ex 12 120 = 5 x 8 x 3', 5 * 8 * 3 === 120);
  }
  // Beyond Ex 13: Find E
  is('Beyond Ex 13 answer', val(A(13)[0]).eq(Qv(13)[0]) && finished(A(13)[0]));
  // Beyond Ex 14: two walks added
  {
    const [a, b] = Qv(14);
    is('Beyond Ex 14 total walk', val(A(14)[0]).eq(a.add(b)) && finished(A(14)[0]));
  }
  // Beyond Ex 15: the jug
  {
    const [c, p1, p2] = Qv(15);
    is('Beyond Ex 15 milk left', val(A(15)[0]).eq(c.sub(p1).sub(p2)) && finished(A(15)[0]));
  }
  // Beyond Ex 16: what must be added
  {
    const [x, target] = Qv(16);
    is('Beyond Ex 16 the missing part', val(A(16)[0]).eq(target.sub(x)) && finished(A(16)[0]));
  }
  // Beyond Ex 17: Find E, and the claim about the fractional parts
  is('Beyond Ex 17 answer', val(A(17)[0]).eq(Qv(17)[0]) && finished(A(17)[0]));
  is('Beyond Ex 17 1/6 is less than 3/4', q(1, 6).cmp(q(3, 4)) < 0);
  // Beyond Ex 18: two different units
  {
    const r = relations(A(18)[0]).sides;
    const units = r[1].split('+').map(val);
    is('Beyond Ex 18 two different units', units.length === 2 && units.every(u => u.n === 1) && units[0].d !== units[1].d
      && norm(r[0]) === norm(ex[18].qs[0]));
    const ways = [];
    const x = Qv(18)[0];
    for (let a = 2; a < 100; a++) {
      const rest = x.sub(q(1, a));
      if (rest.cmp(q(0)) > 0 && rest.n === 1 && rest.d > a) ways.push([a, rest.d]);
    }
    same('Beyond Ex 18 there is only one such pair', ways, [units.map(u => u.d)]);
  }
  // Beyond Ex 19: third side of the triangle
  {
    const [p, s1, s2] = Qv(19);
    const side = p.sub(s1).sub(s2);
    is('Beyond Ex 19 third side', val(A(19)[0]).eq(side) && finished(A(19)[0]));
    is('Beyond Ex 19 the three sides make a triangle', s1.add(s2).cmp(side) > 0 && s1.add(side).cmp(s2) > 0 && s2.add(side).cmp(s1) > 0);
  }
}

// the printed letter key, read off the Answers stage
function KEY_EARLY() {
  const k = {};
  for (const p of BEYOND)
    for (const m of p.html.matchAll(/<span class="n">(\d+)<\/span> \(([a-d])\)/g)) k[m[1]] = m[2];
  return k;
}

// stage 1 prints Rohan's sum as a mistake, and must say it is one
is('S1 Rohan\'s sum is called wrong', /So Rohan’s answer cannot be right/.test(ALL));

// stage 3: the answers to every question that is not an option
const ROWS = (() => {
  const rows = {};
  for (const p of BEYOND)
    for (const m of p.html.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span>/g))
      (rows[m[1]] ||= []).push(m[2]);
  return rows;
})();
/* The answer to question n, from the first work--trace row with that label
   (a "why the options are wrong" note may reuse the number). */
const row = (n) => { const r = ROWS[String(n)]; if (!r) fails.push(`no printed answer row for question ${n}`); return r ? r[0] : ''; };
/* A lettered answer is read one part at a time: a whole-row check lets a
   wrong value hide behind a right one elsewhere in the row. */
function rowPart(n, letter) {
  const flat = decode(row(n));
  const m = new RegExp(`\\(${letter}\\)([\\s\\S]*?)(?=\\([a-e]\\)|$)`).exec(flat);
  if (!m) { fails.push(`question ${n} has no part (${letter})`); return ''; }
  return m[1];
}
const pq = (n) => spans(PR[n] ? PR[n].html : '').map(val);

{
  // 18: between which whole numbers
  const x = pq(18)[0];
  is(`Q18 ${x} lies between ${x.floor()} and ${x.floor() + 1}`, strip(row(18)).startsWith(`${x.floor()} and ${x.floor() + 1}`));
  // 19: sixths in 2 1/2
  const y = pq(19)[0];
  is(`Q19 ${y.div(q(1, 6))} sixths`, strip(row(19)).startsWith(`${y.div(q(1, 6))},`) && val(relations(spans(row(19))[0]).sides.pop()).eq(y));
  // 20: which is in lowest terms
  const low20 = spans(PR[20].html).filter(finished);
  is('Q20 exactly one is in lowest terms, and it is the one printed', low20.length === 1 && norm(spans(row(20))[0]) === norm(low20[0]));
  is('Q20 15 and 27 share 3', gcd(15, 27) === 3 && gcd(15, 28) === 1);
  // 21: what must be taken away
  const [from21, leave21] = pq(21);
  is('Q21', val(spans(row(21))[0]).eq(from21.sub(leave21)) && finished(spans(row(21))[0]));
  // 22: closer to a half or to 1
  const f22 = pq(22)[0];
  const toHalf = f22.sub(q(1, 2)), toOne = ONE.sub(f22);
  is('Q22 closer to', strip(row(22)).startsWith(toHalf.cmp(toOne) < 0 ? 'Closer to' : 'Closer to 1'));
  is('Q22 the two gaps printed', spans(row(22)).length === 3 && val(relations(spans(row(22))[1]).sides.pop()).eq(toHalf)
    && val(relations(spans(row(22))[2]).sides.pop()).eq(toOne) && toHalf.cmp(toOne) < 0);
  // 23: ascending order and the difference
  const g23 = spans(PR[23].html);
  const asc = [...g23].sort((a, b) => val(a).cmp(val(b))).map(norm);
  same('Q23 ascending order', spans(row(23)).slice(0, 4).map(norm), asc);
  is('Q23 difference of largest and smallest', lastVal(row(23)).eq(val(asc[3]).sub(val(asc[0]))) && finished(relations(spans(row(23)).pop()).sides.pop()));
  is('Q23 the twelfths are in the order of the question', spans(row(23)).slice(4, 8).every((s, k) => val(s).eq(val(g23[k]))));
  // 24: Sita
  const [mon, tue] = pq(24);
  const read = mon.add(tue);
  const s24 = spans(row(24));
  is('Q24 read', val(s24[0]).eq(read) && finished(s24[0]));
  is('Q24 still to be read', val(s24[2]).eq(ONE.sub(read)) && finished(s24[2]));
  // 25: equivalent to 3/5 with terms adding to 64
  const base = pq(25)[0];
  const total = Number(/add up to (\d+)/.exec(strip(PR[25].html))[1]);
  const k25 = total / (base.n + base.d);
  const f25 = shape(spans(row(25))[0]);
  is('Q25 the fraction', Number.isInteger(k25) && f25.a === base.n * k25 && f25.b === base.d * k25);
  is('Q25 the check printed adds up', val(spans(row(25)).pop().split('=')[0]).eq(q(total)) && val(spans(row(25)).pop().split('=')[1]).eq(q(total)));
  {
    // the list worked in the answer: 3/5, 6/10, 9/15 are equivalent, and the sums go up by 8
    const listed = spans(row(25)).slice(1, 4).map(s => shape(s));
    is('Q25 the listed fractions are the first three equivalents', listed.every((s, i) => s.a === base.n * (i + 1) && s.b === base.d * (i + 1)));
    same('Q25 the sums printed', (/the sums are ([\d, ]+),/.exec(strip(row(25))) || ['', ''])[1].split(',').map(x => Number(x.trim())).filter(Boolean),
      [1, 2, 3].map(i => (base.n + base.d) * i));
    is('Q25 64 = 8 x 8, the eighth fraction', val(spans(row(25))[4].split('=')[0]).eq(q(total)) && val(spans(row(25))[4].split('=')[1]).eq(q(total))
      && k25 === 8 && /eighth fraction/.test(strip(row(25))));
    is('Q25 asks for the listing method', /List fractions equivalent to/.test(strip(PR[25].html)));
  }
  // 26: more or less than 1
  const s26 = pq(26)[0];
  is('Q26 less or more', strip(row(26)).startsWith(s26.cmp(ONE) < 0 ? 'Less' : 'More'));
  is('Q26 by how much', val(spans(row(26))[0]).eq(s26.cmp(ONE) < 0 ? ONE.sub(s26) : s26.sub(ONE)));
  is('Q26 the sum printed', lastVal(row(26)).eq(s26));
  // 27: the tank
  const [full, used, poured] = pq(27);
  const a27 = full.sub(used), b27 = a27.add(poured), c27 = ONE.sub(b27);
  is('Q27(a)', val(spans(rowPart(27, 'a'))[0]).eq(a27) && finished(spans(rowPart(27, 'a'))[0]));
  is('Q27(b)', val(spans(rowPart(27, 'b'))[0]).eq(b27) && finished(spans(rowPart(27, 'b'))[0]));
  is('Q27(c)', val(spans(rowPart(27, 'c'))[0]).eq(c27) && finished(spans(rowPart(27, 'c'))[0]));
  is('Q27(b) the working', lastVal(rowPart(27, 'b')).eq(a27.add(poured)));
  // 28: Meena's rule
  const [m1, m2, m3, m4] = pq(28);
  const rule = (x, y) => (x.d > y.d ? x.cmp(y) < 0 : y.cmp(x) < 0);
  is('Q28(a) she is right for 1/3 and 1/4', rule(m1, m2) && /right for this pair/.test(strip(rowPart(28, 'a'))));
  is('Q28(b) she is wrong for 3/4 and 1/2', !rule(m3, m4) && /wrong/.test(strip(rowPart(28, 'b'))));
  {
    const b = rowPart(28, 'b');
    const r = relations(spans(b)[0]).sides;
    is('Q28(b) the half rewritten in quarters', val(r[0]).eq(m4) && val(r[1]).eq(m4) && shape(r[1]).b === m3.d);
    is('Q28(b) the bigger denominator is the bigger fraction', m3.cmp(m4) > 0 && m3.d > m4.d
      && decode(b).includes(`$${spans(PR[28].html)[2]}$ is bigger`));
  }
  is('Q28(c) same numerator', /same numerator/.test(strip(rowPart(28, 'c'))));
  // 29: two mixed numbers
  const [x29, y29] = pq(29);
  const r29 = relations(spans(rowPart(29, 'a'))[0]).sides, r29b = relations(spans(rowPart(29, 'a'))[1]).sides;
  is('Q29(a)', val(r29[1]).eq(x29) && val(r29b[1]).eq(y29) && shape(r29[1]).kind === 'frac' && shape(r29b[1]).kind === 'frac');
  is('Q29(b) sum as a mixed number', lastVal(rowPart(29, 'b')).eq(x29.add(y29))
    && shape(relations(spans(rowPart(29, 'b'))[0]).sides.pop()).kind === 'mixed' && finished(relations(spans(rowPart(29, 'b'))[0]).sides.pop()));
  is('Q29(c) difference', lastVal(rowPart(29, 'c')).eq(x29.sub(y29)) && finished(relations(spans(rowPart(29, 'c'))[0]).sides.pop()));
  // 30: the garden
  const garden = [...decode(PR[30].html).matchAll(/<td>(\w+)<\/td><td>\$([^$]+)\$<\/td>/g)].map(m => ({ name: m[1], v: val(m[2]) }));
  const den30 = garden.map(g => g.v.d).reduce((a, b) => a * b / gcd(a, b));
  const a30 = spans(rowPart(30, 'a')).map(s => shape(s));
  same('Q30(a) the three fractions over the smallest common denominator',
    a30.map(s => `${s.a}/${s.b}`), garden.map(g => `${g.v.n * den30 / g.v.d}/${den30}`));
  const largest = garden.reduce((a, b) => (a.v.cmp(b.v) >= 0 ? a : b));
  is(`Q30(b) the ${largest.name.toLowerCase()}`, strip(rowPart(30, 'b')).includes(largest.name.toLowerCase()));
  const path30 = ONE.sub(sumQ(garden.map(g => g.v)));
  is('Q30(c) the path', val(spans(rowPart(30, 'c'))[0]).eq(path30) && finished(spans(rowPart(30, 'c'))[0]));
  const herbs = garden.find(g => g.name === 'Herbs').v;
  is('Q30(d) path or herbs', strip(rowPart(30, 'd')).startsWith(path30.cmp(herbs) > 0 ? 'the path' : 'the herbs'));
  is('Q30(d) by how much', val(spans(rowPart(30, 'd'))[0]).eq(path30.sub(herbs).cmp(q(0)) > 0 ? path30.sub(herbs) : herbs.sub(path30)));
  // 31: the runners
  const runners = [...decode(PR[31].html).matchAll(/<td>(\w+)<\/td><td>\$([^$]+)\$ km<\/td>/g)].map(m => ({ name: m[1], v: val(m[2]) }));
  same('Q31(a) each distance as a fraction', spans(rowPart(31, 'a')).map(s => String(val(s))), runners.map(r => String(r.v)));
  is('Q31(a) printed as fractions', spans(rowPart(31, 'a')).every(s => shape(s).kind === 'frac'));
  const order = [...runners].sort((a, b) => a.v.cmp(b.v)).map(r => r.name);
  is(`Q31(b) ${order.join(', ')}`, strip(rowPart(31, 'b')).startsWith(order.join(', ')));
  is('Q31(b) the twelfths printed', JSON.stringify((strip(rowPart(31, 'b')).match(/\d+/g) || []).map(Number))
    === JSON.stringify([...runners].sort((a, b) => a.v.cmp(b.v)).map(r => r.v.mul(q(12)).n)));
  const chitra = runners.find(r => r.name === 'Chitra').v, bala = runners.find(r => r.name === 'Bala').v;
  is('Q31(c) Chitra minus Bala', lastVal(rowPart(31, 'c')).eq(chitra.sub(bala)) && finished(relations(spans(rowPart(31, 'c'))[0]).sides.pop()));
  is('Q31(d) all three', lastVal(rowPart(31, 'd')).eq(sumQ(runners.map(r => r.v))) && finished(relations(spans(rowPart(31, 'd'))[0]).sides.pop()));
}

// the "why the other options are wrong" notes
{
  const why = BEYOND.map(p => p.html).join('').split('Why the other options are wrong')[1] || '';
  const note = (n) => (new RegExp(`<span class="work__label">${n}<\\/span>\\s*<span>([\\s\\S]*?)<\\/span>`).exec(why) || [])[1] || '';
  same('the notes are for questions 5, 11, 12, 16, 17',
    [...why.matchAll(/work__label">(\d+)</g)].map(m => Number(m[1])), [5, 11, 12, 16, 17]);
  is('note 11 says (b), the key', note(11).includes('the answer is (b)') && KEY_EARLY()[11] === 'b');
  is('note 12 says (c), the key', note(12).includes('the answer is (c)') && KEY_EARLY()[12] === 'c');
  is('note 16 says (b), the key', note(16).includes('the answer is (b)') && KEY_EARLY()[16] === 'b');
  is('note 17 says (c), the key', note(17).includes('the answer is (c)') && KEY_EARLY()[17] === 'c');
  is('note 17: A is true and R is false', q(2, 3).add(q(1, 6)).eq(q(5, 6)) && !q(1 + 1, 2 + 2).eq(q(1, 2).add(q(1, 2))));
  is('note 5: 21/28 and 6/8 still have 7 and 2', gcd(21, 28) === 7 && gcd(6, 8) === 2 && !q(7, 8).eq(q(42, 56)) && note(5).includes('7 in the first and 2 in the second'));
  is('note 11: (a) keeps the quarters: 3 2/4', val(String.raw`3\frac{2}{4}`).eq(val(String.raw`3\frac{1}{2}`))
    && q(3 - 1, 4).eq(q(2, 4)));
  is('note 11: (c) is the sum and (d) is (3-1)/(4+3)',
    val(String.raw`5\frac{3}{4}`).add(val(String.raw`2\frac{1}{3}`)).eq(val(String.raw`8\frac{1}{12}`)) && q(3 - 1, 4 + 3).eq(q(2, 7)));
  is('note 12: (b) is (5-3)/(7-4)', q(5 - 3, 7 - 4).eq(q(2, 3)));
  is('note 12: Nazia\'s share is the bigger one', q(3, 4).cmp(q(5, 7)) > 0 && q(3, 4).sub(q(5, 7)).eq(q(1, 28)));
  is('note 16: 2/3 has a smaller numerator and is more than a half', q(2, 3).cmp(q(1, 2)) > 0 && note(16).includes('more than a half'));
  is('note 17: adding tops and bottoms makes 1/2 + 1/2 into 2/4', q(1 + 1, 2 + 2).eq(q(1, 2)) && note(17).includes('only a half'));
}

/* ---- C. one right option, and the key says so ----------------- */

const KEY = KEY_EARLY();
const LETTERS = ['a', 'b', 'c', 'd'];
const options = (n) => {
  const list = PR[n] && PR[n].parts.find(p => /c-parts--alpha/.test(p.cls));
  if (!list) { fails.push(`question ${n} has no lettered options`); return []; }
  return list.items.map(it => ({ html: it, text: strip(it), v: spans(it).length === 1 ? val(spans(it)[0]) : null, s: spans(it) }));
};
const stemVals = (n) => spans(PR[n].stem).map(val);

const MCQ = {
  1: (o) => o.v && options(1).every(x => o.v.cmp(x.v) >= 0),
  2: (o) => o.v && o.v.eq(stemVals(2)[0]) && finished(o.s[0]) && shape(o.s[0]).kind === 'mixed',
  3: (o) => o.v && o.v.eq(stemVals(3)[0]) && shape(o.s[0]).kind === 'frac',
  4: (o) => o.v && o.v.eq(stemVals(4)[0]),
  5: (o) => o.v && o.v.eq(stemVals(5)[0]) && finished(o.s[0]),
  6: (o) => {
    const t = strip(PR[6].stem);
    const parts = Number(/cut into (\d+) equal parts/.exec(t)[1]);
    const mark = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5 }[/The (\w+) mark after 0/.exec(t)[1]];
    return o.v && o.v.eq(q(mark, parts));
  },
  7: (o) => { const s = o.s[0]; const r = val(s); return r !== null && !r.eq(ONE); },
  8: (o) => o.v && o.v.eq(stemVals(8)[0]),
  9: (o) => { const [lo, hi] = stemVals(9); return o.v && o.v.cmp(lo) > 0 && o.v.cmp(hi) < 0; },
  10: (o) => o.v && options(10).every(x => o.v.cmp(x.v) >= 0),
  11: (o) => { const [whole, cut] = stemVals(11); const v = val(o.s[0]); return v && v.eq(whole.sub(cut)); },
  12: (o) => {
    const t = strip(PR[12].stem);
    const [n1, k1] = /shares (\d+) cakes equally among (\d+) friends/.exec(t).slice(1).map(Number);
    const [n2, k2] = [...t.matchAll(/shares (\d+) cakes equally among (\d+) friends/g)][1].slice(1).map(Number);
    const nazia = q(n1, k1), tom = q(n2, k2);
    const who = nazia.cmp(tom) > 0 ? 'Nazia' : 'Tom';
    const by = nazia.cmp(tom) > 0 ? nazia.sub(tom) : tom.sub(nazia);
    return o.text.startsWith(who) && o.s.length === 1 && val(o.s[0]).eq(by);
  },
};

for (const [n, right] of Object.entries(MCQ)) {
  const opts = options(n);
  const good = opts.map((o, i) => (right(o) ? LETTERS[i] : null)).filter(Boolean);
  if (opts.length !== 4) fails.push(`Q${n}: ${opts.length} options`);
  else if (good.length !== 1) fails.push(`Q${n}: ${good.length} right options (${good.join(', ') || 'none'})`);
  else if (good[0] !== KEY[n]) fails.push(`Q${n}: the right option is (${good[0]}), the key prints (${KEY[n]})`);
  else pass++;
}

/* An assertion-reason question is graded on three facts: is A true, is R
   true, and does R explain A. The first two are computed from the printed
   statements; the third is the judgement the question tests, and is stated. */
const arParts = (n) => {
  const m = /<p>Assertion \(A\): ([\s\S]*?)<\/p>\s*<p>Reason \(R\): ([\s\S]*?)<\/p>\s*$/.exec(PR[n].stem);
  if (!m) { fails.push(`Q${n} is not set as Assertion (A) / Reason (R) paragraphs`); return { A: '', R: '' }; }
  return { A: m[1], R: m[2] };
};
const AR = {
  13: { A: (s) => { const { sides, ops } = relations(spans(s)[0]); return ops[0] === '>' && val(sides[0]).cmp(val(sides[1])) > 0; },
        R: () => q(4, 7).cmp(q(4, 9)) > 0 && q(1, 3).cmp(q(1, 5)) > 0, explains: true },
  14: { A: (s) => finished(spans(s)[0]), R: () => 12 % 2 === 0 && 18 % 2 === 0, explains: false },
  15: { A: (s) => { const { sides } = relations(spans(s)[0]); return val(sides[0]).eq(val(sides[1])); },
        R: () => q(3).eq(q(6, 2)), explains: true },
  16: { A: (s) => { const { sides, ops } = relations(spans(s)[0]); return ops[0] === '<' && val(sides[0]).cmp(val(sides[1])) < 0; },
        R: () => q(5, 12).n < q(5, 12).d, explains: false },
  17: { A: (s) => { const { sides } = relations(spans(s)[0]); return val(sides[0]).eq(val(sides[1])); },
        R: () => q(2 + 1, 3 + 6).eq(q(2, 3).add(q(1, 6))), explains: false },
};
for (const [n, t] of Object.entries(AR)) {
  const { A } = arParts(n);
  const a = t.A(A), r = t.R();
  const want = a && r ? (t.explains ? 'a' : 'b') : a && !r ? 'c' : !a && r ? 'd' : '?';
  if (want === '?') fails.push(`Q${n}: both A and R are false, which is not an option`);
  else if (want !== KEY[n]) fails.push(`Q${n}: A is ${a}, R is ${r} → (${want}), the key prints (${KEY[n]})`);
  else pass++;
}
same('the key covers questions 1 to 17', Object.keys(KEY).map(Number).sort((a, b) => a - b), Array.from({ length: 17 }, (_, k) => k + 1));
/* Class 7's form: the four choices are stated once, in the note, and no
   assertion-reason question carries an option list of its own. */
for (const n of Object.keys(AR)) is(`Q${n} has no option list of its own`, PR[n].parts.length === 0);
{
  const beyond = BEYOND.map(p => p.html).join('');
  const note = (/<p class="c-practice__note">([^<]*)<\/p>/.exec(beyond) || [])[1] || '';
  const ars = Object.keys(AR).map(Number);
  same('the note states the four choices once, for the right questions', note,
    `In Questions ${Math.min(...ars)} to ${Math.max(...ars)}, choose (a) if both A and R are true and R explains A; (b) if both are true but R does not explain A; (c) if A is true but R is false; (d) if A is false but R is true.`);
  same('there is one note', (beyond.match(/c-practice__note/g) || []).length, 1);
  // the reasons graded above are the reasons printed
  const printedR = Object.fromEntries(ars.map(n => [n, strip(arParts(n).R)]));
  is('Q13 R is about sharing among more people', /same amount is shared among more people, each share is smaller/.test(printedR[13]));
  is('Q14 R is about 12 and 18 being even', /12 and 18 are both even/.test(printedR[14]));
  is('Q15 R is 3 wholes = 6 halves', /3 wholes are the same as 6 halves/.test(printedR[15]));
  is('Q16 R is about the numerator of 5/12', /numerator of .* is smaller than its denominator/.test(printedR[16])
    && spans(arParts(16).R).map(norm).join() === String.raw`\frac{5}{12}`);
  is('Q17 R is add tops and add bottoms', /add the numerators and add the denominators/.test(printedR[17]));
}
same('no question after 17 has a key letter', Object.keys(KEY).map(Number).filter(n => n > 17), []);

// the key must use all four letters, so no reader can guess a pattern
const spread = LETTERS.map(l => [l, Object.values(KEY).filter(x => x === l).length]);
is(`the key uses all four letters (${spread.map(([l, c]) => l + ':' + c).join(' ')})`, spread.every(([, c]) => c >= 3));

// the practice run: one numbered list, six forms, at least 26
{
  const nums = Object.keys(PR).map(Number).sort((a, b) => a - b);
  same('practice is numbered 1 to N with no gaps', nums, Array.from({ length: nums.length }, (_, k) => k + 1));
  is(`practice has at least 26 questions (${nums.length})`, nums.length >= 26);
  const subs = [...BEYOND.map(p => p.html).join('').matchAll(/c-practice__sub">([^<]*)</g)].map(m => m[1]);
  same('the six forms, in order', subs, ['Choose the correct option', 'Assertion and reason', 'Very short answer',
    'Short answer', 'Long answer', 'Case-based questions']);
  same('every question from 18 has a printed answer row',
    nums.filter(n => n >= 18).filter(n => !ROWS[String(n)]), []);
}

/* ---- D. ANSWERS.md agrees with the book ---------------------- */

{
  const s3 = section('Stage 3 · Practice');
  const table = {};
  for (const m of s3.matchAll(/(\d+) \(([a-d])\)/g)) table[m[1]] = m[2];
  same('ANSWERS.md key matches the printed key', table, KEY);
  const pairs = [
    [18, (t) => t.startsWith(strip(row(18)).split(',')[0].replace(/^(\S+ and \S+).*/, '**$1**'))],
    [19, (t) => lastVal(t).eq(pq(19)[0]) && t.startsWith(`**${pq(19)[0].div(q(1, 6))}**`)],
    [20, (t) => norm(spans(t)[0]) === norm(spans(row(20))[0])],
    [21, (t) => val(spans(t)[0]).eq(val(spans(row(21))[0]))],
    [22, (t) => t.startsWith('**Closer to $\\frac{1}{2}$.**') === strip(row(22)).startsWith('Closer to')],
    [23, (t) => spans(t).slice(0, 4).map(norm).join() === spans(row(23)).slice(0, 4).map(norm).join() && lastVal(t).eq(lastVal(row(23)))],
    [24, (t) => lastVal(t.split('Still')[0]).eq(val(spans(row(24))[0])) && lastVal(t.split('Still')[1]).eq(val(spans(row(24))[2]))],
    [25, (t) => norm(spans(t)[0]) === norm(spans(row(25))[0])],
    [26, (t) => val(spans(t)[0]).eq(val(spans(row(26))[0])) && lastVal(t).eq(pq(26)[0])],
  ];
  for (const [n, test] of pairs) is(`ANSWERS.md Practice ${n} agrees with the page`, test(item(s3, n)));
  for (const [n, letters] of [[27, 'abc'], [29, 'abc'], [30, 'acd'], [31, 'cd']]) {
    const t = item(s3, n);
    for (const l of letters) {
      const mine = new RegExp(`\\(${l}\\)([\\s\\S]*?)(?=\\([a-e]\\)|$)`).exec(t);
      const printed = lastVal(rowPart(n, l));
      const got = mine && lastVal(mine[1]);
      is(`ANSWERS.md Practice ${n}(${l}) agrees with the page (${printed})`, got && printed && got.eq(printed));
    }
  }
  is('ANSWERS.md Practice 31(b)', item(s3, 31).includes(`(b) ${strip(rowPart(31, 'b')).split(';')[0]}`));
  is('ANSWERS.md Practice 30(b)', item(s3, 30).includes(`(b) ${strip(rowPart(30, 'b'))}`));
  is('ANSWERS.md Practice 28', /same numerator/.test(item(s3, 28)) && /right for this pair/.test(item(s3, 28)));
  is('ANSWERS.md Practice 25 multiplier', item(s3, 25).includes('that number is 8') && 64 / (3 + 5) === 8);
  is('ANSWERS.md says Examples 1 to 17', ANSWERS.includes(`Examples 1 to ${BEYOND_EX.length}`));
  {
    // ANSWERS.md lists Beyond's examples by Beyond's own numbers, each with the printed answer
    const s2 = section('Stage 2 · Solved Examples');
    same('ANSWERS.md Stage 2 lists every Beyond example', (s2.match(/^\d+\. /gm) || []).length, BEYOND_EX.length);
    BEYOND_EX.forEach((e, i) => {
      const n = i + 1;
      const t = item(s2, n);
      const pageAns = spans(e.ans);
      const mine = spans(t);
      const ok = pageAns.length
        ? mine.length && lastVal(t).eq(lastVal(e.ans))
        : (strip(e.ans).match(/\d+/g) || []).every(x => t.includes(x));
      is(`ANSWERS.md Stage 2 Beyond Ex ${n} matches the printed answer`, ok);
    });
  }
}

/* ---- report -------------------------------------------------- */

console.log(`\nClass 6 · Chapter 7 · Fractions`);
console.log(`  ${pageChecked} relations read off the pages and evaluated exactly`);
console.log(`  ${answersChecked} relations read out of ANSWERS.md and evaluated exactly`);
if (skipped.length) {
  console.log(`  ${skipped.length} maths span(s) with a relation that is not arithmetic, so not evaluated:`);
  for (const s of skipped) console.log(`      ${s}`);
}
console.log(`  ${pass} check(s) passed`);
if (fails.length) {
  console.log(`\n  ${fails.length} FAILED:`);
  for (const f of fails) console.log(`    ! ${f}`);
  process.exit(1);
}
console.log(`  all clear\n`);
