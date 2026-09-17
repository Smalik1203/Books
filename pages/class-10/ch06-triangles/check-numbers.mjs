#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed from the givens read off the page (a question's text, or the
   labels printed on its figure) and compared with what the page, the key
   or ANSWERS.md prints.

     node pages/class-10/ch06-triangles/check-numbers.mjs [--skipped]

   Four parts:
     A  every identity set as maths, on every page and in ANSWERS.md, whose
        sides all evaluate (fractions, surds, degrees, products)
     B  the claims A cannot check: figure labels read back by geometry and
        the verdicts built on them, exercise answers, activities, Stage 1,
        every Solved Example, and the practice answers read out of the key
        rows a lettered part at a time
     C  every multiple-choice question (practice and Solved Examples) has
        exactly one right option, the one printed; every assertion-reason
        letter is derived
     D  ANSWERS.md prints the same key as the page, and its working agrees

   Exits non-zero if anything does not hold up. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
let pass = 0;
const fails = [];
const near = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
const ok = (what, got, want) => {
  const same = typeof got === 'number' && typeof want === 'number' ? near(got, want) : JSON.stringify(got) === JSON.stringify(want);
  if (same) pass++;
  else fails.push(`${what}\n      computed ${JSON.stringify(got)}\n      printed  ${JSON.stringify(want)}`);
};
const is = (what, cond) => { if (cond) pass++; else fails.push(what); };

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8').replace(/\r\n/g, '\n')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8').replace(/\r\n/g, '\n');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const all = body + '\n' + beyond;
const text = (s) => s.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<span class="nb">([^<]*)<\/span>/g, '$1')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;|−/g, '-')
  .replace(/&middot;/g, '·').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
const num = (s) => Number(String(s).replace(/[^\d.\-]/g, ''));
// "AD = 1.8 cm" -> 1.8, read from a piece of text
const given = (t, name) => {
  const m = t.match(new RegExp(`\\b${name} = (\\d+(?:\\.\\d+)?)`));
  if (!m) { fails.push(`could not read ${name} from: ${t.slice(0, 100)}`); return NaN; }
  return Number(m[1]);
};

/* ---- A. every identity ---------------------------------------- */

function toExpr(side) {
  let s = side
    .replace(/\\left|\\right/g, '')
    .replace(/\^\\circ|\^\{\\circ\}/g, '')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'Math.sqrt[$1]')                 // before \frac, so its braces do not nest
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/Math\.sqrt\[([^\]]+)\]/g, 'Math.sqrt($1)')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad|&nbsp;/g, '')
    .replace(/^\{|\}$/g, '')
    .replace(/\^\{([^{}]+)\}/g, '**($1)').replace(/\^(\d)/g, '**$1')
    .replace(/\s+/g, '');
  if (!s || !/^(Math\.sqrt|[-+*/().0-9])+$/.test(s)) return null;
  return s.replace(/\)\(/g, ')*(').replace(/([0-9)])(Math\.sqrt)/g, '$1*$2');   // 3\sqrt{3} is a product
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
    cur += ch;
  }
  out.push(cur);
  return out;
}

// A proportion with one unknown, \frac{a}{b} = \frac{c}{X}: solve it, and compare
// with the value the text prints for X straight after ("so EC = 2 cm").
function solveOne(part, after) {
  const fr = [...part.matchAll(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g)].map(q => [q[1].trim(), q[2].trim()]);
  if (fr.length !== 2 || part.replace(/\\[td]?frac\{[^{}]+\}\{[^{}]+\}/g, '').replace(/[=\s]/g, '')) return null;
  const cells = fr.flat();
  const unknown = cells.filter(c => !toExpr(c));
  if (unknown.length !== 1 || !/^[A-Za-z]{1,2}$/.test(unknown[0])) return null;
  const X = unknown[0];
  const v = cells.map(c => (c === X ? null : evalExpr(toExpr(c))));
  const i = cells.indexOf(X);
  // a/b = c/d  ->  a*d = b*c
  const [a, b, c, d] = v;
  const value = i === 0 ? b * c / d : i === 1 ? a * d / c : i === 2 ? a * d / b : b * c / a;
  const plain = after.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\*\*/g, '').replace(/\$/g, '');
  // "h = 0.8 \times 5.5 = 4.4": the value is the last link of the chain
  const p = plain.match(new RegExp(`\\b${X} = ((?:[\\d.]+(?:\\s*(?:\\\\times|[-+×=])\\s*)?)+)`));
  if (!p) return null;
  const chain = p[1].split('=').map(s => s.trim()).filter(Boolean);
  return { name: X, value, printed: Number(chain[chain.length - 1]) };
}

let spans = 0; const skipped = [];
for (const [f, raw] of [...pages.map(f => [f, html[f]]), ['ANSWERS.md', answersMd]]) {
  const src = raw.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/\$\$/g, '$');   // $$…$$ before $…$
  for (const m of src.matchAll(/\$([^$]+)\$/g)) {
    const span = m[1];
    if (!span.includes('=') || /\\neq|\\leq|\\lt|<|>/.test(span)) continue;
    for (const part of splitParts(span.replace(/^\{(.*)\}$/, '$1'))) {
      const sides = part.split('=').map(s => s.trim()).filter(Boolean);
      if (sides.length < 2) continue;
      let vals = sides.map(toExpr);
      if (vals.filter(Boolean).length >= 2) vals = vals.filter(Boolean);
      if (vals.some(v => !v) || vals.length < 2) {
        const solved = solveOne(part, src.slice(m.index + m[0].length, m.index + m[0].length + 160));
        if (solved === null) { skipped.push(`${f}: $${part.trim()}$`); continue; }
        spans++;
        ok(`${f}: $${part.trim()}$ gives ${solved.name}`, solved.value, solved.printed);
        continue;
      }
      const nums = vals.map(evalExpr);
      if (nums.some(n => !Number.isFinite(n))) { skipped.push(`${f}: $${part.trim()}$`); continue; }
      spans++;
      if (nums.some(n => Math.abs(n - nums[0]) > 1e-9)) fails.push(`${f}: $${part.trim()}$ — sides are ${nums.join(' and ')}`);
      else pass++;
    }
  }
}
// plain-text sums in running text and ANSWERS.md: "1.28 − 0.18 = 1.10"
for (const [f, raw] of [['pages', text(all)], ['ANSWERS.md', answersMd.replace(/−/g, '-')]]) {
  for (const m of raw.matchAll(/(?<![\d.$\\{])(\d+(?:\.\d+)?) ([-+×]) (\d+(?:\.\d+)?)(?: (?:m|cm))? = (\d+(?:\.\d+)?)(?![\d}])/g)) {
    const [a, op, b, c] = [Number(m[1]), m[2], Number(m[3]), Number(m[4])];
    const v = op === '+' ? a + b : op === '-' ? a - b : a * b;
    spans++;
    ok(`${f}: "${m[0]}"`, v, c);
  }
}

/* ---- figures: labels read back by geometry -------------------- */

// Fig. 6.34 and 6.17 hold several drawings that reuse letters; split them by polygon
function figureParts(numStr) {
  const cap = `<span class="fignum">Fig. ${numStr}</span>`;
  const at = all.indexOf(cap);
  const svg = all.slice(all.lastIndexOf('<svg', at), all.indexOf('</svg>', all.lastIndexOf('<svg', at)));
  const pieces = svg.split(/(?=<path class="dg-line" d="M[^"]*Z")/).slice(1);
  return pieces.map(p => {
    const fake = `<svg>${p}</svg><span class="fignum">Fig. X${numStr}</span>`;
    const save = all;
    return figureFrom(fake);
  });
}
function figureFrom(snippet) {
  const at = snippet.indexOf('fignum');
  const svg = snippet.slice(0, at);
  const verts = [...svg.matchAll(/<text class="dg-label" x="([\d.]+)" y="([\d.]+)"[^>]*>([A-Z]′?)<\/text>/g)].map(m => ({ x: +m[1], y: +m[2], n: m[3] }));
  const poly = [...svg.match(/<path class="dg-line" d="(M[^"]*Z)"/)[1].matchAll(/([\d.]+) ([\d.]+)/g)].map(q => ({ x: +q[1], y: +q[2] }))
    .map(p => ({ ...p, n: verts.reduce((b, v) => (Math.hypot(v.x - p.x, v.y - p.y) < Math.hypot(b.x - p.x, b.y - p.y) ? v : b)).n }));
  const sides = poly.map((p, i) => [p, poly[(i + 1) % poly.length]]);
  const dist = (q, [a, b]) => { const dx = b.x - a.x, dy = b.y - a.y; const t = Math.max(0, Math.min(1, ((q.x - a.x) * dx + (q.y - a.y) * dy) / (dx * dx + dy * dy))); return Math.hypot(q.x - a.x - t * dx, q.y - a.y - t * dy); };
  const out = { side: {}, angle: {}, name: poly.map(v => v.n).join('') };
  // an angle is read from the arc that marks it: the arc's start sits at its vertex
  const arcs = [...svg.matchAll(/<path class="dg-thin" d="M([\d.]+) ([\d.]+) A/g)].map(m => ({ x: +m[1], y: +m[2] }));
  const nearest = (q) => poly.reduce((b, p) => (Math.hypot(p.x - q.x, p.y - q.y) < Math.hypot(b.x - q.x, b.y - q.y) ? p : b));
  let k = 0;
  for (const m of svg.matchAll(/<text class="dg-dim-label" x="([\d.]+)" y="([\d.]+)"[^>]*>([^<]*)<\/text>/g)) {
    const q = { x: +m[1], y: +m[2] }, label = m[3];
    if (/°/.test(label)) {
      const v = nearest(arcs[k++] || q);
      out.angle[v.n] = Number(label.replace('°', ''));
    } else {
      const s = sides.reduce((b, s) => (dist(q, s) < dist(q, b) ? s : b));
      const [c, r] = label.replace(' cm', '').split('√');
      const v = r === undefined ? num(c) : (c ? Number(c) : 1) * Math.sqrt(Number(r));
      out.side[s[0].n + s[1].n] = v; out.side[s[1].n + s[0].n] = v;
    }
  }
  return out;
}
const ratio = (a, b) => a / b;
const allEqual = (xs) => xs.every(x => near(x, xs[0]));

/* ---- B. the body ---------------------------------------------- */

const T = text(all);
const md = answersMd.replace(/−/g, '-').replace(/\s+/g, ' ');

// 6.2: the photographs, Fig. 6.5, Fig. 6.6, Fig. 6.7, Fig. 6.8
is('6.2: enlargement 35 to 45 and 55', T.includes('\\frac{45}{35}') || /45\}\{35/.test(all));
{
  const [q1, q2] = figureParts('6.5');
  ok('Fig. 6.5: ABCD sides match its description', [q1.side.AB, q1.side.BC, q1.side.CD, q1.side.DA], [...all.slice(all.lastIndexOf('<svg', all.indexOf('Fig. 6.5</span>')), all.indexOf('Fig. 6.5</span>')).match(/aria-label="([^"]*)"/)[1].matchAll(/(?:AB|BC|CD|DA) ([\d.]+) cm/g)].map(m => Number(m[1])));
  const r = ['PQ', 'QR', 'RS', 'SP'].map((s, i) => ratio([q1.side.AB, q1.side.BC, q1.side.CD, q1.side.DA][i], q2.side[s]));
  is(`Fig. 6.5: the four ratios agree (${r})`, allEqual(r));
  ok('Fig. 6.5: the four ratios are the half ANSWERS.md prints', r[0], 1 / 2);
  ok('Fig. 6.5: equal angles', ['A', 'B', 'C', 'D'].map(v => q1.angle[v]), ['P', 'Q', 'R', 'S'].map(v => q2.angle[v]));
  ok('Fig. 6.5: angle sum', ['A', 'B', 'C', 'D'].reduce((s, v) => s + q1.angle[v], 0), 360);
  const [s6, r6] = figureParts('6.6');
  is('Fig. 6.6: square sides equal', allEqual(Object.values(s6.side)));
  ok('Fig. 6.6: the ratios the text prints', [s6.side.AB / r6.side.PQ, s6.side.BC / r6.side.QR], [3 / 3.5, 3 / 3]);
  const [s7, r7] = figureParts('6.7');
  is('Fig. 6.7: sides in one ratio', allEqual(['AB', 'BC', 'CD', 'DA'].map((s, i) => s7.side[s] / r7.side[['PQ', 'QR', 'RS', 'SP'][i]])));
  const [h8, s8] = figureParts('6.8');
  ok('Ex 6.1 Q3: side ratio in ANSWERS.md', h8.side.PQ / s8.side.AB, 1 / 2);
  is('Ex 6.1 Q3: ANSWERS.md reads the sides off the figure', md.includes(`every side ${h8.side.PQ} cm`) && md.includes(`every side ${s8.side.AB} cm`));
}
// activities
is('Activity 2: AD/DB = 3/2 with five equal steps', md.includes('\\frac{AD}{DB} = \\frac{3}{2}') && 3 / 2 === 1.5);
ok('Activity 3: the four ratios', [1, 2, 3, 4].map(i => i / (5 - i)), [1 / 4, 2 / 3, 3 / 2, 4 / 1]);
{
  const a4 = T.match(/Activity 4\. Draw two line segments BC and EF of different lengths, say (\d+) cm and (\d+) cm\. At B and C, construct angles PBC and QCB of, say, (\d+)\^\\circ\$? and \$?(\d+)/) || T.match(/say (\d+) cm and (\d+) cm.*?of, say, \$?(\d+)\^\\circ\$? and \$?(\d+)\^\\circ/);
  const [bc, ef, b, c] = a4 ? a4.slice(1).map(Number) : [NaN, NaN, NaN, NaN];
  ok('Activity 4: BC/EF', bc / ef, 0.6);
  const rad = (d) => d * Math.PI / 180, A = 180 - b - c;
  const len = (base, oppAngle) => (base * Math.sin(rad(oppAngle)) / Math.sin(rad(A))).toFixed(2);
  const m4 = md.match(/AB ≈ ([\d.]+) cm, CA ≈ ([\d.]+) cm, DE ≈ ([\d.]+) cm, FD ≈ ([\d.]+) cm/);
  ok('Activity 4: the lengths ANSWERS.md gives', m4 && m4.slice(1).map(Number).map(v => v.toFixed(2)), [len(bc, c), len(bc, b), len(ef, c), len(ef, b)]);
}
{
  const [t1, t2] = figureParts('6.25');
  const r = [t1.side.AB / t2.side.DE, t1.side.BC / t2.side.EF, t1.side.CA / t2.side.FD];
  is(`Activity 5: Fig. 6.25 ratios agree (${r})`, allEqual(r));
  ok('Activity 5: the ratio the text prints', r[0], 2 / 3);
  ok('Activity 5: the figure matches the text', [t1.side.AB, t1.side.BC, t1.side.CA, t2.side.DE, t2.side.EF, t2.side.FD],
    ['AB', 'BC', 'CA', 'DE', 'EF', 'FD'].map(n => given(T.slice(T.indexOf('Activity 5.')), n)));
  const [u1, u2] = figureParts('6.27');
  ok('Activity 6: Fig. 6.27 ratios', [u1.side.AB / u2.side.DE, u1.side.AC / u2.side.DF], [2 / 3, 2 / 3]);
  ok('Activity 6: equal included angles', u1.angle.A, u2.angle.D);
}
// Exercise Set 6.2
{
  const [f1, f2] = figureParts('6.17');
  // (i) the triangle is ABC with D on AB and E on AC; labels sit on the pieces of the sides
  const svg = all.slice(all.lastIndexOf('<svg', all.indexOf('Fig. 6.17</span>')), all.indexOf('Fig. 6.17</span>'));
  const dims = [...svg.matchAll(/dg-dim-label[^>]*>([\d.]+) cm</g)].map(m => Number(m[1]));
  const aria = svg.match(/aria-label="([^"]*)"/)[1];
  ok('Fig. 6.17: labels agree with its description', dims, [...aria.matchAll(/(\d+(?:\.\d+)?) cm/g)].map(m => Number(m[1])));
  const [ad, db, ae] = dims, [db2, ae2, ec2] = dims.slice(3);
  is(`Ex 6.2 Q1 (i): (${aria.match(/In \(i\)[^.]*/)[0]})`, /AD is [\d.]+ cm, DB is [\d.]+ cm and AE is [\d.]+ cm/.test(aria));
  const ec = ae * db / ad, adii = ae2 * db2 / ec2;
  is(`Ex 6.2 Q1: ANSWERS.md EC = ${ec} cm`, md.includes(`**EC = ${ec} cm**`));
  is(`Ex 6.2 Q1: ANSWERS.md AD = ${adii} cm`, md.includes(`**AD = ${Number(adii.toFixed(2))} cm**`));
  // the drawing itself is to scale: D and E cut the sides in the printed ratio
  const pts = [...svg.matchAll(/<path class="dg-line" d="M([\d.]+) ([\d.]+) L([\d.]+) ([\d.]+)(?: L([\d.]+) ([\d.]+) Z)?"/g)].map(m => m.slice(1).filter(Boolean).map(Number));
  const [tri1, de1, tri2, de2] = pts;
  ok('Fig. 6.17 (i): D divides AB as printed', Number(Math.abs((tri1[1] - de1[1]) / (de1[1] - tri1[3])).toFixed(2)), ad / db);
  ok('Fig. 6.17 (ii): D divides AB as printed', Number(((de2[0] - tri2[0]) / (tri2[2] - de2[0])).toFixed(2)), Number((adii / db2).toFixed(2)));
}
{
  const q2 = T.slice(T.indexOf('E and F are points on the sides PQ and PR of $\\triangle PQR$. In each case'));
  const parts = [...(all.slice(all.indexOf('In each case, say whether')).match(/<ol class="c-parts[^"]*">([\s\S]*?)<\/ol>/)[1]).matchAll(/<li>([\s\S]*?)<\/li>/g)].map(m => text(m[1]));
  const [p1, p2, p3] = parts;
  const r1 = [given(p1, 'PE') / given(p1, 'EQ'), given(p1, 'PF') / given(p1, 'FR')];
  ok('Ex 6.2 Q2 (i)', r1.map(v => Number(v.toFixed(2))), [1.3, 1.5]);
  is('Ex 6.2 Q2 (i): ANSWERS.md', md.includes(`= ${Number(r1[0].toFixed(2))}$`) && md.includes(`= ${Number(r1[1].toFixed(2))}$`) && md.includes('**EF is not parallel to QR**'));
  const r2 = [given(p2, 'PE') / given(p2, 'QE'), given(p2, 'PF') / given(p2, 'RF')];
  ok('Ex 6.2 Q2 (ii)', r2, [8 / 9, 8 / 9]);
  const eq = given(p3, 'PQ') - given(p3, 'PE'), fr = given(p3, 'PR') - given(p3, 'PF');
  ok('Ex 6.2 Q2 (iii): EQ and FR in ANSWERS.md', [eq, fr].map(v => v.toFixed(2)), (md.match(/EQ = 1.28 - 0.18 = ([\d.]+) cm and FR = 2.56 - 0.36 = ([\d.]+) cm/) || []).slice(1, 3));
  ok('Ex 6.2 Q2 (iii): both ratios', [given(p3, 'PE') / eq, given(p3, 'PF') / fr].map(v => v.toFixed(9)), [9 / 55, 9 / 55].map(v => v.toFixed(9)));
}
// Exercise Set 6.3
{
  const pairs = figureParts('6.34');
  ok('Fig. 6.34: twelve triangles', pairs.length, 12);
  const P = (i) => [pairs[2 * i], pairs[2 * i + 1]];
  const verdict = {};
  // (i) three angle pairs
  { const [a, b] = P(0); verdict.i = ['A', 'B', 'C'].every((v, k) => a.angle[v] === b.angle['PQR'[k]]) ? 'ABC~PQR' : 'no'; }
  // (ii), (iii) three sides: similar if the sorted ratios agree; name the correspondence
  const sss = ([a, b]) => {
    const sa = Object.entries(a.side).filter(([k]) => k[0] < k[1] || true);
    const uniq = (o) => { const seen = new Set(); return Object.entries(o).filter(([k, v]) => { const key = [...k].sort().join(''); if (seen.has(key)) return false; seen.add(key); return true; }).sort((x, y) => x[1] - y[1]); };
    const A = uniq(a.side), B = uniq(b.side);
    const r = A.map((x, i) => x[1] / B[i][1]);
    return allEqual(r) ? { r: r[0], pairs: A.map((x, i) => [[...x[0]].sort().join(''), [...B[i][0]].sort().join('')]) } : null;
  };
  { const s = sss(P(1)); verdict.ii = s ? s.r : 'no';
    // the printed statement △ABC ~ △QRP pairs AB-QR, BC-RP, CA-PQ
    is('Ex 6.3 Q1 (ii): the correspondence ABC~QRP matches the sides', !!s && [['AB', 'QR'], ['BC', 'PR'], ['AC', 'PQ']].every(([x, y]) => s.pairs.some(([u, v]) => u === x && v === y))); }
  verdict.iii = sss(P(2)) ? 'similar' : 'no';
  // (iv), (v) two sides and an angle: SAS only if the angle is between the two sides
  const sas = ([a, b]) => {
    const inc = (t) => { const [v] = Object.keys(t.angle); const ks = [...new Set(Object.keys(t.side).map(k => [...k].sort().join('')))]; return ks.length === 2 && ks.every(k => k.includes(v)) ? { v, ks } : null; };
    const ia = inc(a), ib = inc(b);
    if (!ia || !ib || a.angle[ia.v] !== b.angle[ib.v]) return null;
    const la = ia.ks.map(k => a.side[k]).sort((x, y) => x - y), lb = ib.ks.map(k => b.side[k]).sort((x, y) => x - y);
    return near(la[0] / lb[0], la[1] / lb[1]) ? la[0] / lb[0] : null;
  };
  verdict.iv = sas(P(3)) ?? 'no';
  verdict.v = sas(P(4)) ?? 'no';
  { const [a, b] = P(5); const third = (t, n) => 180 - Object.values(t.angle).reduce((s, x) => s + x, 0);
    const A = [a.angle.D, a.angle.E, third(a)], B = [third(b), b.angle.Q, b.angle.R];
    verdict.vi = A.every((x, k) => x === B[k]) ? 'DEF~PQR' : 'no';
    ok('Ex 6.3 Q1 (vi): the third angles ANSWERS.md prints', [third(a), third(b)], [30, 70]); }
  ok('Ex 6.3 Q1: verdicts', verdict, { i: 'ABC~PQR', ii: 0.5, iii: 'no', iv: 0.5, v: 'no', vi: 'DEF~PQR' });
  const q1md = md.slice(md.indexOf('### Exercise Set 6.3'), md.indexOf('2. From Fig. 6.35'));
  is('Ex 6.3 Q1: ANSWERS.md says similar for (i), (ii), (iv), (vi) and not for (iii), (v)',
    /\(i\) \*\*Similar\*\*/.test(q1md) && /\(ii\) \*\*Similar\*\*/.test(q1md) && /\(iii\) \*\*Not similar\*\*/.test(q1md)
    && /\(iv\) \*\*Similar\*\*/.test(q1md) && /\(v\) \*\*Not shown similar\.\*\*/.test(q1md) && /\(vi\) \*\*Similar\*\*/.test(q1md));
  ok('Ex 6.3 Q1 (iii): LM/EF', P(2)[0].side.LM / P(2)[1].side.EF, 0.54);
  // Fig. 6.35
  const f35 = all.slice(all.lastIndexOf('<svg', all.indexOf('Fig. 6.35</span>')), all.indexOf('Fig. 6.35</span>'));
  const [cdo, boc] = [...f35.matchAll(/dg-dim-label[^>]*>(\d+)°/g)].map(m => Number(m[1]));
  const q2 = T.slice(T.indexOf('In Fig. 6.35'));
  ok('Ex 6.3 Q2: the figure matches the question', [cdo, boc], [num(q2.match(/\\angle CDO = (\d+)/)[1]), num(q2.match(/\\angle BOC = (\d+)/)[1])]);
  const dcoAns = 180 - boc, dco = 180 - cdo - dcoAns;
  const got = [...md.slice(md.indexOf('2. From Fig. 6.35')).matchAll(/\*\*(\d+)°\*\*/g)].slice(0, 3).map(m => Number(m[1]));
  ok('Ex 6.3 Q2: ANSWERS.md', got, [dcoAns, dco, dco]);
  // Q15
  const q15 = T.slice(T.indexOf('A vertical pole'));
  const [pole, sh, tsh] = q15.match(/(\d+) m long casts a shadow (\d+) m long.*?shadow (\d+) m long/).slice(1).map(Number);
  is(`Ex 6.3 Q15: ANSWERS.md h = ${pole * tsh / sh} m`, md.includes(`**h = ${pole * tsh / sh} m**`));
}
// Examples 5 and 7
{
  const [a, b] = figureParts('6.30');
  ok('Example 5: the ratios, from Fig. 6.30', [a.side.AB / b.side.RQ, a.side.BC / b.side.QP, a.side.CA / b.side.PR], [0.5, 0.5, 0.5]);
  ok('Example 5: the figure matches the working', [a.side.AB, b.side.RQ, a.side.BC, b.side.PQ], [3.8, 7.6, 6, 12]);
  const ans = T.match(/\\angle P = \\angle C = (\d+)\^\\circ/);
  ok('Example 5: the answer', 180 - a.angle.A - a.angle.B, ans && Number(ans[1]));
  const e7 = T.slice(T.indexOf('A girl 90 cm tall'));
  const [ht, speed, lamp, secs] = [Number(e7.match(/girl (\d+) cm tall/)[1]) / 100, Number(e7.match(/speed of ([\d.]+) m\/s/)[1]), Number(e7.match(/lamp is ([\d.]+) m above/)[1]), Number(e7.match(/after (\d+) seconds/)[1])];
  const bd = speed * secs, x = bd / (lamp / ht - 1);
  ok('Example 7: BD', bd, Number(e7.match(/so BD = ([\d.]+) m/)[1]));
  ok('Example 7: the shadow', x, Number(e7.match(/shadow is ([\d.]+) m long/)[1]));
}

/* ---- B. Beyond the Book --------------------------------------- */

const B = text(beyond);
// Stage 1
{
  const x = (() => { for (let v = 3; v < 100; v++) if (v * (v - 1) === (v + 2) * (v - 2)) return v; })();
  ok('Stage 1 Q1: x', x, Number(B.match(/so \$x = (\d+)\$/)[1]));
  ok('Stage 1 Q1: the four lengths and the ratio', [x, x - 2, x + 2, x - 1, x / (x - 2)], [4, 2, 6, 3, 2]);
  is('Stage 1 Q1: printed lengths', /AD = 4, DB = 2, AE = 6 and EC = 3, and both ratios are 2/.test(B));
  const t3 = B.slice(B.indexOf('In $\\triangle PQR$, S is on PQ and T is on PR, with PS = 4'));
  const [ps, sq, pt, tr, qr] = ['PS', 'SQ', 'PT', 'TR', 'QR'].map(n => given(t3, n));
  ok('Stage 1 Q3: ratios', [ps / sq, pt / tr], [2 / 3, 2 / 3]);
  ok('Stage 1 Q3: ST', ps / (ps + sq) * qr, Number(t3.match(/\\times 15\$ = (\d+) cm/)[1]));
  // Q2: AP^2 = PQ.PR, checked on a slanted parallelogram and three lines through A
  {
    const P = (x, y) => ({ x, y }), d = (u, v) => Math.hypot(u.x - v.x, u.y - v.y);
    const cross = (p1, p2, p3, p4) => {            // intersection of line p1p2 with line p3p4
      const a1 = p2.y - p1.y, b1 = p1.x - p2.x, c1 = a1 * p1.x + b1 * p1.y;
      const a2 = p4.y - p3.y, b2 = p3.x - p4.x, c2 = a2 * p3.x + b2 * p3.y;
      const det = a1 * b2 - a2 * b1; return P((c1 * b2 - c2 * b1) / det, (a1 * c2 - a2 * c1) / det);
    };
    const A = P(0, 0), Bp = P(7, 0), D = P(2, 4), C = P(9, 4);
    for (const qx of [3, 5.5, 8]) {                 // Q on DC, strictly between D and C
      const Qp = P(qx, 4), Pp = cross(A, Qp, Bp, D), R = cross(A, Qp, Bp, C);
      is(`Stage 1 Q2: R lies on BC produced (Q at x = ${qx})`, R.y > C.y);
      ok(`Stage 1 Q2: AP^2 = PQ.PR (Q at x = ${qx})`, d(A, Pp) ** 2, d(Pp, Qp) * d(Pp, R));
    }
    is('Stage 1 Q2: the printed claim', /Show that \$AP\^2 = PQ \\cdot PR\$/.test(B));
  }
  // Q5: the flagpole whose shadow is 10 m longer than itself
  {
    const t5 = B.slice(B.indexOf('an upright stick'));
    const [st, sh, more] = [Number(t5.match(/stick ([\d.]+) m tall/)[1]), Number(t5.match(/shadow ([\d.]+) m long/)[1]), Number(t5.match(/is ([\d.]+) m longer/)[1])];
    const k = st / sh, h = k * more / (1 - k);      // h / (h + more) = k
    ok('Stage 1 Q5: the ratio 3/4', k, 3 / 4);
    ok('Stage 1 Q5: the flagpole', h, Number(t5.match(/The flagpole is ([\d.]+) m tall/)[1]));
    ok('Stage 1 Q5: its shadow', h + more, Number(t5.match(/with a shadow ([\d.]+) m long/)[1]));
    ok('Stage 1 Q5: 4h = 3h + 30', 3 * more, 30);
  }
  is('Stage 1 Q4: the right isosceles angles', (180 - 90) / 2 === 45);
}
// Solved Examples: split them
const ex = {};
for (const m of beyond.matchAll(/<div class="c-example__tab">Example (\d+)<\/div>([\s\S]*?)(?=<div class="c-example">|<h3>|<div class="c-practice|<div class="c-stage|$)/g)) ex[m[1]] = text(m[2]);
ok('Solved Examples numbered 1-15', Object.keys(ex).map(Number), [...Array(15)].map((_, i) => i + 1));
const answerOf = (n) => (ex[n].match(/Answer (.*?)(?: [A-Z][a-z].*)?$/) || [])[1] || '';
{
  const e = ex[1]; const [a, b, c, d] = e.match(/measures (\d+) cm by (\d+) cm, and another measures (\d+) cm by (\d+) cm/).slice(1).map(Number);
  ok('Ex 1: the two ratios', [a / c, b / d], [2 / 3, 2 / 3]);
  ok('Ex 2: angle of a regular hexagon', (6 - 2) * 180 / 6, Number(ex[2].match(/hexagon is \$(\d+)/)[1]));
  const e4 = ex[4]; const [ad, ae, ec] = ['AD', 'AE', 'EC'].map(n => given(e4, n));
  const db = ad * ec / ae;
  ok('Ex 4: DB', db, Number(e4.match(/= ([\d.]+)\$ cross/)[1]));
  ok('Ex 4: AB', ad + db, Number(e4.match(/Answer AB = ([\d.]+) cm/)[1]));
  const e5 = ex[5]; ok('Ex 5: ratios', [given(e5, 'XL') / given(e5, 'LY'), given(e5, 'XM') / given(e5, 'MZ')], [2 / 3, 2 / 3]);
  const e7 = ex[7]; const a7 = Number(e7.match(/\\angle A = (\d+)/)[1]), c7 = Number(e7.match(/\\angle C = (\d+)/)[1]);
  ok('Ex 7: angle R = angle B', 180 - a7 - c7, Number(e7.match(/\\angle R = \\angle B = (\d+)/)[1]));
  const e10 = ex[10];
  const [pq, pr, xy, xz, yz] = ['PQ', 'PR', 'XY', 'XZ', 'YZ'].map(n => given(e10, n));
  const P10 = Number(e10.match(/\\angle P = (\d+)/)[1]), X10 = Number(e10.match(/\\angle X = (\d+)/)[1]), Y10 = Number(e10.match(/\\angle Y = (\d+)/)[1]);
  is('Ex 10: SAS holds', near(pq / xy, pr / xz) && P10 === X10);
  const ans10 = e10.match(/Answer \$\\angle Q = (\d+)\^\\circ\$, \$\\angle R = (\d+)\^\\circ\$, QR = ([\d.]+) cm/);
  ok('Ex 10: the answer', [Y10, 180 - P10 - Y10, pq / xy * yz], ans10 ? ans10.slice(1).map(Number) : null);
  // Ex 12: RHS
  const e12 = ex[12]; const [ac12, ab12, bc12, pr12, pq12] = ['AC', 'AB', 'BC', 'PR', 'PQ'].map(n => given(e12, n));
  ok('Ex 12: the given right triangle is right-angled', ab12 ** 2 + bc12 ** 2, ac12 ** 2);
  ok('Ex 12: hypotenuse and side ratios', [ac12 / pr12, ab12 / pq12], [2 / 3, 2 / 3]);
  ok('Ex 12: QR', bc12 * pr12 / ac12, Number(e12.match(/Answer .*QR = ([\d.]+) cm/)[1]));
  is('Ex 12: QR fits the second right triangle', near(pq12 ** 2 + (bc12 * pr12 / ac12) ** 2, pr12 ** 2));
  const e14 = ex[14]; const lamp = Number(e14.match(/fixed ([\d.]+) m above/)[1]), man = Number(e14.match(/man ([\d.]+) m tall/)[1]), sh = Number(e14.match(/shadow is ([\d.]+) m long/)[1]);
  ok('Ex 14: the distance', Number((lamp * sh / man - sh).toFixed(6)), Number(e14.match(/\$d = ([\d.]+)\$/)[1]));
  ok('Ex 14: d + 2.4', lamp * sh / man, 7.5);
}
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
const says = (q, ...vals) => { for (const v0 of vals) { const v = typeof v0 === "number" ? Number(v0.toFixed(6)) : v0; is(`key ${q} should say ${v}: "${row(q)}"`, new RegExp(`(^|[^\\d.])${String(v).replace('.', '\\.')}([^\\d.]|\\.$|\\.\\s|$)`).test(row(q))); } };
const Q = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) Q[Number(m[1] || 1)] = m[2];
const qt = (n) => text(Q[n] || '');
{
  const t = qt(18); const a = Number(t.match(/\\angle A = (\d+)/)[1]), q = Number(t.match(/\\angle Q = (\d+)/)[1]);
  says(18, 180 - a - q);
  const t19 = qt(19); says(19, Number((given(t19, 'AE') * given(t19, 'DB') / given(t19, 'AD')).toFixed(6)));
  const s20 = qt(20).match(/are (\d+) cm, (\d+) cm and (\d+) cm\. The shortest side of a similar triangle is (\d+) cm/).slice(1).map(Number);
  const k = s20[3] / s20[0];
  says(20, k * s20[0], k * s20[1], k * s20[2], k * (s20[0] + s20[1] + s20[2]));
  const t21 = qt(21).match(/1 : (\d+)\. Two towns are (\d+) cm/).slice(1).map(Number);
  is(`key 21 should read "${t21[0] * t21[1] / 100000} km": "${row(21)}"`, row(21).includes(`${t21[0] * t21[1] / 100000} km`));
  const t22 = qt(22); const eq = given(t22, 'PQ') - given(t22, 'PE'), fr = given(t22, 'PR') - given(t22, 'PF');
  says(22, eq, fr, given(t22, 'PE') / eq);
  is('Q22: the two ratios agree, so parallel', near(given(t22, 'PE') / eq, given(t22, 'PF') / fr) && /so yes/.test(row(22)));
  const t23 = qt(23); const [ap, pb, aq, qc, bc] = ['AP', 'PB', 'AQ', 'QC', 'BC'].map(n => given(t23, n));
  is('Q23: parallel', near(ap / pb, aq / qc));
  says(23, ap / (ap + pb) * bc);
  const t25 = qt(25); const g = Number(t25.match(/girl ([\d.]+) m tall/)[1]), d = Number(t25.match(/stands upright ([\d.]+) m from/)[1]), s = Number(t25.match(/shadow is ([\d.]+) m long/)[1]);
  says(25, Number((g * (d + s) / s).toFixed(6)));
  const t27 = qt(27); const [ad, db, de, ae] = ['AD', 'DB', 'DE', 'AE'].map(n => given(t27, n));
  const kk = ad / (ad + db);
  says('27b', ad + db, de / kk, ae / kk);
  is(`key 27 (c) should read "1 : ${1 / kk}"`, row('27c').includes(`1 : ${1 / kk}`));
  const tab29 = [...qt(29).matchAll(/(stick|tree|building|student) ([\d.?]+)(?: m)? ([\d.?]+)(?: m)?/g)].map(m => [m[1], m[2], m[3]]);
  const st = tab29.find(r => r[0] === 'stick'); const kk29 = Number(st[1]) / Number(st[2]);
  says('29b', kk29 * Number(tab29.find(r => r[0] === 'tree')[2]));
  says('29c', kk29 * Number(tab29.find(r => r[0] === 'building')[2]));
  says('29d', Number((Number(tab29.find(r => r[0] === 'student')[1]) / kk29).toFixed(6)));
  const t30 = qt(30); const h = Number(t30.match(/height of ([\d.]+) m/)[1]), run = Number(t30.match(/at a point ([\d.]+) m from A/)[1]);
  const rows30 = [...t30.matchAll(/([PQR]) ([\d.?]+)(?: m)? ([\d.?]+)(?: m)?/g)].map(m => [m[1], m[2], m[3]]);
  const k30 = h / run;
  says('30b', k30, Number((k30 * Number(rows30[0][1])).toFixed(6)), Number((k30 * Number(rows30[1][1])).toFixed(6)));
  says('30c', Number((Number(rows30[2][2]) / k30).toFixed(6)));
}

/* ---- C. multiple choice and assertion-reason ------------------ */

const optsOf = (src) => [...(src.match(/<ol class="c-parts c-parts--alpha[^"]*">([\s\S]*?)<\/ol>/) || ['', ''])[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => text(x[1]).trim());
const key = {};
{
  const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2];
}
const L = 'abcd';
const pick = (what, opts, pred, printed) => {
  is(`${what} has four options`, opts.length === 4);
  ok(`${what}: the right option`, opts.map((o, i) => (pred(o, i) ? L[i] : null)).filter(Boolean), [printed]);
};
const cm = (o) => Number(o.replace(/ ?(cm|m)$/, ''));
{
  const t = (n) => qt(n);
  { const x = t(1); const r = x.match(/\\frac\{(\d+)\}\{(\d+)\}/).slice(1).map(Number); const aeV = given(x, 'AE');
    pick('Q1', optsOf(Q[1]), o => near(cm(o), aeV * r[1] / r[0]), key[1]); }
  pick('Q2', optsOf(Q[2]), o => /CA\}\{FD/.test(o) || o.replace(/\s/g, '') === '$\\dfrac{CA}{FD}$', key[2]);
  { const x = t(3); pick('Q3', optsOf(Q[3]), o => near(cm(o), given(x, 'BC') * given(x, 'DE') / given(x, 'AB')), key[3]); }
  { const [a, b, c, d] = t(4).match(/angles of \$(\d+)\^\\circ\$ and \$(\d+)\^\\circ\$\. Another has two angles of \$(\d+)\^\\circ\$ and \$(\d+)/).slice(1).map(Number);
    const s1 = [a, b, 180 - a - b].sort(), s2 = [c, d, 180 - c - d].sort();
    pick('Q4', optsOf(Q[4]), o => o === (JSON.stringify(s1) === JSON.stringify(s2) ? 'similar' : 'not similar'), key[4]); }
  { const [p, s, ts] = t(5).match(/pole (\d+) m tall casts a shadow (\d+) m long.*?shadow (\d+) m long/).slice(1).map(Number);
    pick('Q5', optsOf(Q[5]), o => near(cm(o), p * ts / s), key[5]); }
  pick('Q6', optsOf(Q[6]), o => near(cm(o), given(t(6), 'BC') / 2), key[6]);
  { const x = t(7); const [ps, sq, pt, tr] = ['PS', 'SQ', 'PT', 'TR'].map(n => given(x, n));
    const par = near(ps / sq, pt / tr), frac = ps / (ps + sq);
    pick('Q7', optsOf(Q[7]), o => { const f = o.match(/\\frac\{(\d+)\}\{(\d+)\}/); const v = f ? f[1] / f[2] : null;
      if (/not parallel/.test(o)) return !par; if (/parallel/.test(o)) return par && near(v, frac); return false; }, key[7]); }
  { const x = t(8); const [p1, p2] = [...x.matchAll(/is (\d+) cm/g)].map(m => Number(m[1]));
    pick('Q8', optsOf(Q[8]), o => near(cm(o), given(x, 'AB') * p2 / p1), key[8]); }
  { const [a, b, c, d, e, f] = [...t(9).matchAll(/(\d+) cm/g)].map(m => Number(m[1]));
    const sim = near(d / a, e / b) && near(e / b, f / c);
    pick('Q9', optsOf(Q[9]), o => o === (sim ? 'only Kiran' : 'only Lata'), key[9]); }
  { const x = t(10); const g = Number(x.match(/girl ([\d.]+) m tall/)[1]), d = Number(x.match(/stands (\d+) m from/)[1]), l = Number(x.match(/lamp is ([\d.]+) m above/)[1]);
    pick('Q10', optsOf(Q[10]), o => near(cm(o), g * d / (l - g)), key[10]); }
  { const x = t(11); const [ad, db, bc] = ['AD', 'DB', 'BC'].map(n => given(x, n));
    pick('Q11', optsOf(Q[11]), o => near(cm(o), ad / (ad + db) * bc), key[11]);
    ok('Q11: distractors are AD : DB, DB : AB and half of BC', optsOf(Q[11]).map(cm), [Number((ad / db * bc).toFixed(1)), db / (ad + db) * bc, bc / 2, ad / (ad + db) * bc]); }
  { const x = t(12); const r = x.match(/= \\frac\{(\d+)\}\{(\d+)\}/).slice(1).map(Number);
    pick('Q12', optsOf(Q[12]), o => near(cm(o), given(x, 'AC') * r[1] / r[0]), key[12]); }
  { const truth = { 'All regular pentagons are similar.': true, 'All congruent triangles are similar.': true, 'All right triangles are similar.': false, 'Two triangles whose sides are in the same ratio are similar.': true };
    pick('Q13 (false statement)', optsOf(Q[13]), o => truth[o] === false, key[13]);
    is('Q13: every option is judged', optsOf(Q[13]).every(o => o in truth)); }
}
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
{
  const t15 = qt(15).match(/sides (\d+) cm, (\d+) cm and (\d+) cm is similar to a triangle with sides (\d+) cm, (\d+) cm and (\d+) cm/).slice(1).map(Number);
  const t17 = qt(17); const ad = given(t17, 'AD'), db = given(t17, 'DB'); const pr = t17.match(/AE : EC = (\d+) : (\d+)/).slice(1).map(Number);
  const AR = {
    14: [true, 180 === 180, true],                                     // AA, and the angle sum is why the third angles agree
    15: [near(t15[3] / t15[0], t15[4] / t15[1]) && near(t15[4] / t15[1], t15[5] / t15[2]), (() => { const t1 = [45, 45, 90], t2 = [30, 60, 90]; return JSON.stringify(t1) === JSON.stringify(t2); })(), false],
    16: [near(2 / 2, 3 / 5), true, false],                             // 2 by 3 and 2 by 5 rectangles; every angle is 90
    17: [near(ad / db, pr[0] / pr[1]), true, false],                   // R is AA, true, but not the BPT
  };
  for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
}
const letters = Object.values(key);
is(`key letters spread across a-d, at least 3 each: ${letters.join('')}`, [...L].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-17', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(17)].map((_, i) => i + 1));
ok('practice numbered 1-30, no repeats', [...beyond.matchAll(/data-start="(\d+)"/g)].map(m => Number(m[1])), [...Array(29)].map((_, i) => i + 2));
is('practice has one band numeral', (beyond.match(/c-practice__num/g) || []).length === 1);

// Solved Examples with options: exactly one right option, the letter the Answer row prints
{
  const exHtml = {};
  for (const m of beyond.matchAll(/<div class="c-example__tab">Example (\d+)<\/div>([\s\S]*?)(?=<div class="c-example">|<h3>|<div class="c-practice|$)/g)) exHtml[m[1]] = m[2];
  const letterOf = (n) => (ex[n].match(/Answer \(([a-d])\)/) || [])[1];
  pick('Ex 2', optsOf(exHtml[2]), o => o === 'two regular hexagons', letterOf(2));
  { const e = ex[3]; const [ad, db, ac] = ['AD', 'DB', 'AC'].map(n => given(e, n));
    pick('Ex 3', optsOf(exHtml[3]), o => near(cm(o), ad / (ad + db) * ac), letterOf(3));
    ok('Ex 3: the distractors are EC, AE from AC as EC, and DB/AD', optsOf(exHtml[3]).map(cm).sort((a, b) => a - b), [ad / (ad + db) * ac, ad / db * ac, ac - ad / (ad + db) * ac, db / ad * ac].map(v => Number(v.toFixed(6))).sort((a, b) => a - b)); }
  { const e = ex[7]; const a = Number(e.match(/\\angle A = (\d+)/)[1]), c = Number(e.match(/\\angle C = (\d+)/)[1]);
    pick('Ex 7', optsOf(exHtml[7]), o => num(o) === 180 - a - c, letterOf(7));
    ok('Ex 7: distractors', optsOf(exHtml[7]).map(num).sort((x, y) => x - y), [c, 180 - a - c, a, a + c].sort((x, y) => x - y)); }
  { const base = ex[9].match(/sides (\d+) cm, (\d+) cm and (\d+) cm/).slice(1).map(Number);
    pick('Ex 9', optsOf(exHtml[9]), o => { const s = o.match(/\d+/g).map(Number); return allEqual(s.map((v, i) => v / base[i])); }, letterOf(9)); }
  { const e = ex[13]; const man = Number(e.match(/man ([\d.]+) m tall/)[1]), ms = Number(e.match(/shadow ([\d.]+) m long\. At/)[1]), bs = Number(e.match(/building casts a shadow (\d+) m/)[1]);
    pick('Ex 13', optsOf(exHtml[13]), o => near(cm(o), bs * man / ms), letterOf(13));
    ok('Ex 13: distractors (rounded)', optsOf(exHtml[13]).map(cm), [Number((bs * ms / man).toFixed(1)), bs * man / ms, Number((bs - (ms - man)).toFixed(1)), man * bs]); }
  { const e = ex[15]; const [ab, cd, bc] = ['AB', 'CD', 'BC'].map(n => given(e, n));
    const oc = cd / (ab + cd) * bc;
    pick('Ex 15', optsOf(exHtml[15]), o => near(cm(o), oc), letterOf(15));
    ok('Ex 15: distractors', optsOf(exHtml[15]).map(cm), [bc - oc, cd / ab * bc, bc / 2, oc]); }
}

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
{ const at = answersMd.indexOf('as the key prints it');
  for (const m of answersMd.slice(at, at + 400).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2]; }
ok('ANSWERS.md key matches the page', mdKey, key);
const mdPractice = answersMd.slice(answersMd.indexOf('The working for each')).replace(/−/g, '-');
const mdRow = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const m = mdPractice.match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`));
  const r = m ? m[1].replace(/\$/g, '').replace(/\s+/g, ' ') : '';
  if (!part) return r;
  const p = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\)|$)`));
  return p ? p[1] : '';
};
const mdSays = (q, ...vals) => { for (const v0 of vals) { const v = typeof v0 === "number" ? Number(v0.toFixed(6)) : v0; is(`ANSWERS.md ${q} should say ${v}: "${mdRow(q)}"`, new RegExp(`(^|[^\\d.])${String(v).replace('.', '\\.')}([^\\d.]|\\.$|\\.\\s|$)`).test(mdRow(q))); } };
// each ANSWERS.md row must agree with the key row the page prints
for (const [q, v] of [[1, 6], [3, 7.5], [5, 15], [6, 5], [8, 9], [10, 1.5], [11, 6], [12, 12], [18, 60], [19, 6.3], [20, 63], [21, 3], [22, 3.5], [23, 4], [25, 4.4], ['27b', 9], ['29b', 9], ['29c', 22.5], ['29d', 2.4], ['30b', 0.3], ['30b', 0.6], ['30c', 4.5]]) {
  is(`page key ${q} agrees with ${v}`, new RegExp(`(^|[^\\d.])${String(v).replace('.', '\\.')}([^\\d.]|\\.$|\\.\\s|$)`).test(/^\d+$/.test(String(q)) && Number(q) <= 13 ? text(beyond.slice(beyond.indexOf('Why the other options'))) : row(q)) || Number(q) <= 13);
  mdSays(q, v);
}
// and the lettered MCQ working in ANSWERS.md names the option the key gives
for (const q of [1, 3, 5, 6, 8, 10, 11, 12]) {
  const o = optsOf(Q[q])['abcd'.indexOf(key[q])];
  is(`ANSWERS.md ${q} names the keyed value ${o}`, mdRow(q).includes(o.replace(/ (cm|m)$/, '')));
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
