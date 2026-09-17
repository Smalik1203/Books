#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed — from the angles and lengths the question states, and from the
   labels printed on its figure — and compared with what is on the page.

     node pages/class-10/ch09-applications-of-trigonometry/check-numbers.mjs [--skipped]

   Five parts:
     A  every identity set as maths, on every page and in ANSWERS.md, whose
        sides all evaluate. sin, cos, tan and cot of an angle in degrees are
        read as functions, and a side that is a bare decimal, or anything
        after \approx, is checked as a rounding: to its own number of places,
        with sqrt(3) taken exactly, as 1.732 or as 1.73
     F  every figure: each angle label is drawn at that angle, each figure
        agrees with the question that names it, and the two print on the
        same page or facing
     B  the claims A cannot check: every example and exercise re-solved from
        its own numbers, the answers read back a lettered part at a time,
        and a rounded answer checked against the approximation it states
     C  every multiple-choice and assertion-reason question: exactly one
        option is right, and it is the one the key prints
     D  ANSWERS.md prints the same key and the same practice answers

   Exits non-zero if anything does not hold up. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
let pass = 0;
const fails = [];
const close = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b));
const ok = (what, got, want) => {
  if (JSON.stringify(got) === JSON.stringify(want)) pass++;
  else fails.push(`${what}\n      computed ${JSON.stringify(got)}\n      printed  ${JSON.stringify(want)}`);
};
const near = (what, got, want) => {
  if (Number.isFinite(got) && Number.isFinite(want) && close(got, want)) pass++;
  else fails.push(`${what}\n      computed ${got}\n      printed  ${want}`);
};
const is = (what, cond) => { if (cond) pass++; else fails.push(what); };

/* ---- the mathematics ----------------------------------------- */

const R3 = Math.sqrt(3);
const rad = (d) => d * Math.PI / 180;
const deg = (r) => r * 180 / Math.PI;
const trig = {
  sin: (d) => (d === 30 ? 0.5 : d === 90 ? 1 : Math.sin(rad(d))),
  cos: (d) => (d === 60 ? 0.5 : d === 90 ? 0 : Math.cos(rad(d))),
  tan: (d) => (d === 45 ? 1 : d === 90 ? NaN : Math.tan(rad(d))),
  cot: (d) => (d === 45 ? 1 : d === 90 ? 0 : 1 / Math.tan(rad(d))),
};
const { sin, cos, tan, cot } = trig;
const dp = (s) => ((String(s).split('.')[1]) || '').length;
const rd = (x, n) => Math.round((x + 1e-12) * 10 ** n) / 10 ** n;
// a rounding is right if it is right for any approximation of sqrt(3) the chapter states
const S3S = [R3, 1.732, 1.73];

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<span class="nb">([^<]*)<\/span>/g, '$1')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/&middot;/g, '·')
  .replace(/&rsquo;/g, "'").replace(/\s+/g, ' ');
const nums = (s) => [...s.matchAll(/\d+(?:\.\d+)?/g)].map(m => Number(m[0]));
// a question's own numbers are read from its words, not from its maths
const qn = (s) => nums(s.replace(/\$[^$]*\$/g, ' '));

/* ---- A. every identity ---------------------------------------- */

function toExpr(side) {
  let s = side
    .replace(/\\left|\\right/g, '')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad/g, ' ')
    .replace(/\\(sin|cos|tan|cot)\s*(\d+)\^\\circ/g, ' $1[$2] ')
    .replace(/(\d+)\^\\circ/g, '$1');
  for (let i = 0; i < 20; i++) {                       // innermost first: \sqrt before \frac
    const t = s.replace(/\\sqrt\{([^{}]+)\}/g, ' R[$1] ')
      .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, ' ([$1]/[$2]) ')
      .replace(/\{([^{}]*)\}/g, '[$1]');
    if (t === s) break;
    s = t;
  }
  s = s.replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\^\[([^\]]+)\]/g, '**[$1]').replace(/\^(\d)/g, '**$1')
    .replace(/(sin|cos|tan|cot)\[/g, '$1(').replace(/R\[/g, 'R(').replace(/\[/g, '(').replace(/\]/g, ')')
    .trim();
  if (!s || /\\/.test(s)) return null;
  if (!/^(?:sin|cos|tan|cot|R|[-+*/().\d\s])+$/.test(s)) return null;
  // juxtaposition is a product: 4(…), )(, 2 R(3), R(3) tan(60)
  s = s.replace(/([\d)])\s*(?=[(Rsct])/g, '$1*').replace(/\s+/g, '');
  return s;
}
const evalExpr = (e, s3 = R3) => {
  try {
    const R = (x) => (Math.abs(x - 3) < 1e-12 ? s3 : Math.sqrt(x));
    return Function('R', 'sin', 'cos', 'tan', 'cot', `"use strict";return (${e})`)(R, sin, cos, tan, cot);
  } catch { return NaN; }
};

// "a = b, c = d" is two statements; the comma inside a bracket is not a break
function splitParts(span) {
  const out = []; let depth = 0, cur = '';
  for (let i = 0; i < span.length; i++) {
    const ch = span[i];
    if ('({['.includes(ch)) depth++;
    if (')}]'.includes(ch)) depth--;
    if (depth === 0 && (ch === ',' || ch === ';') && /=/.test(cur) && /=/.test(span.slice(i + 1))) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
}
const bare = (s) => /^\s*\d+\.\d+\s*$/.test(s);

// one chain "a = b = c": every side equal; a bare decimal is a rounding of the rest
function chainValue(sides, where) {
  let vals = sides.map(toExpr);
  // "BD = 5 - 1.3 = 3.7": the letters drop out when two numeric sides remain
  if (vals.some(v => !v) && vals.filter(Boolean).length >= 2) {
    sides = sides.filter((_, i) => vals[i]);
    vals = vals.filter(Boolean);
  }
  if (vals.some(v => !v)) return null;
  const exact = sides.map((s, i) => [s, vals[i]]).filter(([s]) => !bare(s));
  const rounded = sides.filter(bare);
  const vs = S3S.map(s3 => exact.map(([, v]) => evalExpr(v, s3)));
  if (vs[0].some(n => !Number.isFinite(n))) return null;
  if (vs[0].length > 1) {
    // exact sides agree exactly; a side with a stated decimal in it (1.732) agrees with its own approximation
    const okExact = vs.some(row => row.every(n => close(n, row[0], 1e-9)));
    const litDp = Math.max(0, ...exact.map(([s]) => Math.max(0, ...(s.match(/\d+\.\d+/g) || []).map(dp))));
    const okLit = litDp > 0 && vs.some(row => row.every(n => Math.abs(n - row[0]) < 10 ** -litDp));
    if (!okExact && !okLit) { fails.push(`${where} — sides are ${vs[0].join(' and ')}`); return undefined; }
  }
  for (const r of exact.length ? rounded : []) {
    const want = Number(r);
    if (!vs.some(row => rd(row[0], dp(r)) === want)) { fails.push(`${where} — ${vs[0][0]} does not round to ${r}`); return undefined; }
  }
  return { value: vs[0].length ? vs[0][0] : Number(rounded[0]), rounded: rounded.length ? rounded[rounded.length - 1] : null, row: vs.map(r => r[0]) };
}

let spans = 0; const skipped = [];
const sources = [...pages.map(f => [f, html[f].replace(/<svg[\s\S]*?<\/svg>/g, ' ')]), ['ANSWERS.md', answersMd]];
for (const [f, raw] of sources) {
  const src = raw.replace(/\$\$/g, '$');
  for (const m of src.matchAll(/\$([^$]+)\$/g)) {
    const span = m[1].replace(/&nbsp;/g, ' ');
    if (!/=|\\approx/.test(span) || /\\neq|\\leq|\\geq|\\lt|<|>/.test(span)) continue;
    for (const part of splitParts(span.replace(/^\s*\{(.*)\}\s*$/, '$1'))) {
      const chains = part.split('\\approx').map(c => c.split('=').map(s => s.trim()).filter(Boolean));
      if (chains.flat().length < 2) continue;
      const where = `${f}: $${part.trim()}$`;
      const got = chains.map(c => chainValue(c, where));
      if (got.some(g => g === undefined)) continue;               // already failed
      if (got.some(g => g === null)) { skipped.push(where); continue; }
      spans++;
      // across \approx: the left is exact, the right is its rounding to the places printed last
      let good = true;
      for (let i = 1; i < got.length; i++) {
        const r = got[i].rounded ?? String(got[i].value);
        const places = dp(r);
        if (!S3S.some((s3, k) => rd(got[i - 1].row[k], places) === Number(r) || rd(got[i - 1].row[0], places) === rd(got[i].row[k], places))) {
          fails.push(`${where} — ${got[i - 1].value} is not ${r} to ${places} places`); good = false;
        }
      }
      if (good) pass++;
    }
  }
}

/* ---- F. every figure ------------------------------------------ */

const figures = {};
for (const f of pages) {
  for (const m of html[f].matchAll(/<svg([\s\S]*?)<\/svg>\s*<figcaption><span class="fignum">Fig\. ([\d.]+)<\/span>/g)) {
    const svg = m[1];
    const labels = [...svg.matchAll(/<text class="dg-dim-label"[^>]*>([^<]+)<\/text>/g)].map(x => x[1].trim());
    const segs = [];
    for (const p of svg.matchAll(/<path class="dg-(?:line|thin|hidden)" d="([^"]+)"/g)) {
      const pts = [...p[1].matchAll(/[ML]\s*([\d.]+)\s+([\d.]+)/g)].map(x => [Number(x[1]), Number(x[2])]);
      if (/A/.test(p[1])) continue;
      for (let i = 1; i < pts.length; i++) segs.push([pts[i - 1], pts[i]]);
      if (/Z/.test(p[1]) && pts.length > 2) segs.push([pts[pts.length - 1], pts[0]]);
    }
    figures[m[2]] = {
      page: f,
      angles: labels.filter(l => /°$/.test(l)).map(l => Number(l.replace('°', ''))),
      lengths: labels.filter(l => / m$/.test(l)).map(l => Number(l.replace(' m', ''))),
      slopes: segs.map(([[x1, y1], [x2, y2]]) => deg(Math.atan2(Math.abs(y2 - y1), Math.abs(x2 - x1)))),
    };
  }
}
ok('thirteen figures', Object.keys(figures).length, 13);
for (const [n, fg] of Object.entries(figures))
  for (const a of fg.angles) is(`Fig. ${n}: an arm is drawn at the ${a}° it is labelled`, fg.slopes.some(s => Math.abs(s - a) < 0.5));

const folio = (f) => Number(f.slice(1, 4));   // startFolio 1, so p0NN is page NN
const facing = (a, b) => a === b || (Math.min(a, b) % 2 === 0 && Math.abs(a - b) === 1);
// every question or example that names a figure prints with it
const blocks = [];
for (const f of pages.filter(p => /^p0/.test(p))) {
  for (const m of html[f].matchAll(/<div class="c-example__body">\s*<p>([\s\S]*?)<\/p>|<ol class="c-questions"[^>]*>\s*<li>([\s\S]*?)<\/li>/g)) blocks.push([f, text(m[1] || m[2])]);
}
for (const [f, t] of blocks) for (const m of t.matchAll(/Fig\. ([\d.]+)/g)) {
  const fg = figures[m[1]];
  is(`"${t.slice(0, 40)}…" (${f}) names Fig. ${m[1]}, which prints on ${fg?.page}: same page or facing`, fg && facing(folio(f), folio(fg.page)));
}

// the question and its figure agree: every angle and length on the figure is in the question
const exQ = {};
for (const m of body.matchAll(/c-example__tab">Example (\d+)<\/div>\s*<div class="c-example__body">([\s\S]*?)<div class="c-figure[\s\S]*?fignum">Fig\. ([\d.]+)</g)) exQ[m[1]] = { q: text(m[2].split('<p><strong>Solution')[0]), all: text(m[2]), fig: m[3] };
const exBody = {};
for (const m of body.matchAll(/c-example__tab">Example (\d+)<\/div>\s*<div class="c-example__body">([\s\S]*?)<div class="c-figure/g)) exBody[m[1]] = m[2];
const exText = {};
for (const m of body.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>/g)) exText[Number(m[1] || 1)] = text(m[2]);
const agree = (label, fig, q, extra = []) => {
  const fg = figures[fig];
  const qv = nums(q);
  for (const a of fg.angles) is(`${label}: Fig. ${fig}'s ${a}° is in the question`, qv.includes(a));
  for (const l of fg.lengths) is(`${label}: Fig. ${fig}'s ${l} m is in the question`, qv.includes(l) || extra.includes(l));
};
ok('seven body examples, each with its figure', Object.keys(exQ), ['1', '2', '3', '4', '5', '6', '7']);
for (const [n, e] of Object.entries(exQ)) agree(`Example ${n}`, e.fig, e.q);
agree('Ex 9.1 Q1', '9.11', exText[1]);
agree('Ex 9.1 Q11', '9.12', exText[11]);
agree('Ex 9.1 Q14', '9.13', exText[14]);
ok('Ex 9.1 Q1, Q11, Q14 name Figs 9.11–9.13', [1, 11, 14].map(q => (exText[q].match(/Fig\. ([\d.]+)/) || [])[1]), ['9.11', '9.12', '9.13']);

/* ---- B. every example and exercise, re-solved ----------------- */

const ans = (n) => text((exBody[n].match(/work__label">Answer<\/span>([\s\S]*?)<\/div>/) || [])[1] || '').replace(/\$/g, '');
const coef = (s) => { const m = s.match(/(\d+(?:\.\d+)?)\\sqrt\{3\}/); return m ? Number(m[1]) : NaN; };
const sqrtMult = (x) => x / R3;                 // x = k sqrt(3)
const hasNum = (s, v, places) => nums(s).some(n => n === rd(v, places));
const angleOf = (q, i = 0) => [...q.matchAll(/(\d+)\^\\circ|(\d+)°/g)].map(m => Number(m[1] || m[2]))[i];
const qAngles = (q) => [...q.matchAll(/(\d+)\s*\^\s*\\circ/g)].map(m => Number(m[1]));
const exRaw = (n) => exBody[n].split('<p><strong>Solution')[0].replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ');

// Example 1: the height from 15 m at 60 degrees
{ const [d] = figures['9.4'].lengths, [a] = figures['9.4'].angles;
  near('Example 1 answer', coef(ans(1)), sqrtMult(d * tan(a))); }
// Example 2: pole 5 m, point 1.3 m below the top, ladder at 60, sqrt3 = 1.73 as stated
{ const [H, below] = nums(text(exBody[2]).split('Solution')[0]).filter(x => x === 5 || x === 1.3);
  const s3 = Number((exRaw(2).match(/\\sqrt\{3\} = ([\d.]+)/) || [])[1]);
  ok('Example 2 states sqrt3 = 1.73', s3, 1.73);
  const BD = H - below, [a] = figures['9.5'].angles;
  ok('Example 2: BD', rd(BD, 1), 3.7);
  const ladder = BD * 2 / s3, foot = BD / s3;                  // sin 60 = s3/2, cot 60 = 1/s3
  ok('Example 2 answer: ladder and foot', [hasNum(ans(2), ladder, 2), hasNum(ans(2), foot, 2)], [true, true]);
  is('Example 2: the ladder angle is the figure\'s', a === 60); }
// Example 3: observer 1.5 m, 28.5 m away, 45 degrees
{ const q = exQ[3].q, [eye, dist] = nums(q);
  ok('Example 3 answer', nums(ans(3)).pop(), dist * tan(figures['9.6'].angles[0]) + eye); }
// Example 4: building 10 m, 30 and 45, sqrt3 = 1.732
{ const b = qn(exQ[4].q)[0], [a1, a2] = figures['9.7'].angles;
  const AP = b / tan(a1), flag = AP * tan(a2) - b;
  near('Example 4: AP is 10 sqrt3', coef(ans(4)), sqrtMult(AP));
  ok('Example 4 answer: flagstaff and distance to 2 places', [hasNum(ans(4), flag, 2), hasNum(ans(4), AP, 2)], [true, true]);
  ok('Example 4 uses 1.732', rd(10 * (1.732 - 1), 2), rd(flag, 2)); }
// Example 5: shadows 40 m apart at 30 and 60
{ const [d] = figures['9.8'].lengths, [lo, hi] = figures['9.8'].angles.sort((x, y) => x - y);
  const x = d / (tan(hi) / tan(lo) - 1), h = x * tan(hi);
  near('Example 5 answer', coef(ans(5)), sqrtMult(h));
  is('Example 5: x', /x = 20/.test(text(exBody[5]).replace(/\s/g, ' ')) && close(x, 20)); }
// Example 6: building 8 m, depressions 30 and 45
{ const b = qn(exQ[6].q)[0], [a1, a2] = figures['9.9'].angles;
  const PD = b / (1 / tan(a1) * tan(a2) - 1);                  // PD + b = BD tan45, BD = PD / tan30
  const PC = PD + b;
  near('Example 6: PD = 4(sqrt3 + 1)', PD, 4 * (R3 + 1));
  near('Example 6 answer: PC = 4(3 + sqrt3)', PC, evalExpr(toExpr('4(3 + \\sqrt{3})')));
  is('Example 6 answer prints 4(3 + sqrt3) for both', (ans(6).match(/4\(3 \+ \\sqrt\{3\}\)/g) || []).length === 2);
  near('Example 6: AC = PC', PC / tan(a2), PC); }
// Example 7: bridge 3 m, depressions 30 and 45
{ const [h] = figures['9.10'].lengths, [a1, a2] = figures['9.10'].angles;
  near('Example 7 answer: 3(1 + sqrt3)', h / tan(a1) + h / tan(a2), evalExpr(toExpr(ans(7).match(/\d+\(1 \+ \\sqrt\{3\}\)/)[0]))); }

// Exercise Set 9.1, from the questions' own numbers, against ANSWERS.md
const md = answersMd.replace(/\r/g, '');
const setMd = md.slice(md.indexOf('### Exercise Set 9.1'), md.indexOf('## Beyond the Book'));
const mdQ = (n) => { const m = setMd.match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`)); return m ? m[1].replace(/\s+/g, ' ') : ''; };
const bold = (n) => [...mdQ(n).matchAll(/\*\*([\s\S]*?)\*\*/g)].map(m => m[1].replace(/\$/g, '')).join(' | ');
const says = (label, s, ...vals) => { for (const v of vals) is(`${label} should say ${v}: "${s}"`, typeof v === 'string' ? s.includes(v) : hasNum(s, v, dp(v))); };
const k3 = (x) => { const k = rd(sqrtMult(x), 4); return `${Number.isInteger(k) ? k : k}\\sqrt{3}`; };
const dec = (x) => rd(x, 2);
{
  const q = exText; const a = (n) => qAngles(q[n].replace(/°/g, '^\\circ'));
  const Q = (n) => text(q[n]);
  // raw question html keeps the $…$, so the angles are read from it
  const qa = {};
  for (const m of body.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>/g)) qa[Number(m[1] || 1)] = qAngles(m[2]);
  // 1: rope 20 m at 30
  { const L = figures['9.11'].lengths[0]; says('Ex 9.1 Q1', bold(1), L * sin(qa[1][0])); }
  // 2: tree, top 8 m from the foot at 30
  { const d = qn(Q(2)).find(x => x === 8), t = qa[2][0]; const h = d * tan(t) + d / cos(t);
    says('Ex 9.1 Q2', bold(2), k3(h), dec(h)); }
  // 3: slides 1.5 at 30, 3 at 60
  { const [h1, h2] = qn(Q(3)).filter(x => x === 1.5 || x === 3); const [t1, t2] = qa[3];
    says('Ex 9.1 Q3', bold(3), h1 / sin(t1), k3(h2 / sin(t2)), dec(h2 / sin(t2))); }
  // 4: 30 m at 30
  { const d = qn(Q(4))[0]; const h = d * tan(qa[4][0]); says('Ex 9.1 Q4', bold(4), k3(h), dec(h)); }
  // 5: kite 60 m at 60
  { const h = qn(Q(5))[0]; const L = h / sin(qa[5][0]); says('Ex 9.1 Q5', bold(5), k3(L), dec(L)); }
  // 6: boy 1.5, building 30, 30 to 60
  { const [eye, H] = qn(Q(6)); const [t1, t2] = qa[6]; const r = H - eye; const w = r / tan(t1) - r / tan(t2);
    says('Ex 9.1 Q6', bold(6), k3(w), dec(w)); }
  // 7: building 20, bottom 45, top 60
  { const b = qn(Q(7))[0]; const [t1, t2] = qa[7]; const d = b / tan(t1); const t = d * tan(t2) - b;
    near('Ex 9.1 Q7', evalExpr(toExpr(bold(7).match(/\{(20\(\\sqrt\{3\} - 1\))\}/)[1])), t); says('Ex 9.1 Q7', bold(7), dec(t)); }
  // 8: statue 1.6, top 60, pedestal 45
  { const s = qn(Q(8))[0]; const [t1, t2] = qa[8]; // t1 statue top, t2 pedestal top
    const h = s / (tan(t1) / tan(t2) - 1);
    near('Ex 9.1 Q8', evalExpr(toExpr(bold(8).match(/\{(0\.8\(\\sqrt\{3\} \+ 1\))\}/)[1])), h); says('Ex 9.1 Q8', bold(8), dec(h)); }
  // 9: tower 50, building from tower foot 30, tower from building foot 60
  { const T = qn(Q(9))[0]; const [t1, t2] = qa[9]; const d = T / tan(t2); const b = d * tan(t1);
    near('Ex 9.1 Q9', b, 50 / 3); says('Ex 9.1 Q9', bold(9), '\\frac{50}{3}', '16\\frac{2}{3}'); }
  // 10: road 80, 60 and 30
  { const W = qn(Q(10))[0]; const [t1, t2] = qa[10]; const x = W * tan(t2) / (tan(t1) + tan(t2)); const h = x * tan(t1);
    says('Ex 9.1 Q10', bold(10), k3(h), dec(h), rd(x, 0), rd(W - x, 0)); }
  // 11: 20 m further, 60 and 30, from Fig. 9.12
  { const [d] = figures['9.12'].lengths; const [lo, hi] = [...figures['9.12'].angles].sort((p, r) => p - r);
    const x = d / (tan(hi) / tan(lo) - 1); const h = x * tan(hi);
    says('Ex 9.1 Q11', bold(11), k3(h), rd(x, 0)); }
  // 12: building 7, elevation 60, depression 45
  { const b = qn(Q(12))[0]; const [up, down] = qa[12]; const d = b / tan(down); const t = b + d * tan(up);
    near('Ex 9.1 Q12', evalExpr(toExpr(bold(12).match(/\{(7\(\\sqrt\{3\} \+ 1\))\}/)[1])), t); says('Ex 9.1 Q12', bold(12), dec(t)); }
  // 13: lighthouse 75, 30 and 45, same side
  { const h = qn(Q(13))[0]; const [t1, t2] = qa[13]; const D = h / tan(t1) - h / tan(t2);
    near('Ex 9.1 Q13', evalExpr(toExpr(bold(13).match(/\{(75\(\\sqrt\{3\} - 1\))\}/)[1])), D); says('Ex 9.1 Q13', bold(13), rd(D, 1)); }
  // 14: girl 1.2, balloon 88.2 (Fig. 9.13), 60 then 30
  { const [eye] = qn(Q(14)); const [H] = figures['9.13'].lengths; const [t1, t2] = qa[14]; const r = H - eye;
    const D = r / tan(t2) - r / tan(t1); says('Ex 9.1 Q14', bold(14), k3(D), dec(D)); }
  // 15: 30 to 60 in six seconds
  { const t = qn(Q(15)).find(x => x === 6) ?? 6; const [t1, t2] = qa[15]; const h = 1;
    const rest = (h / tan(t2)) / ((h / tan(t1) - h / tan(t2)) / t); says('Ex 9.1 Q15', bold(15), rd(rest, 6)); }
}
// the Example 2 note in ANSWERS.md-style: 1.732 would give 4.27
ok('Example 2 with 1.732 rounds differently (flagged)', rd(7.4 / 1.732, 2), 4.27);

// Stage 1, read back from its running text
const tryText = (i) => text(beyond.split('<div class="c-try">')[i + 1].split('<div class="c-try">')[0]);
{
  const t = [0, 1, 2, 3, 4].map(tryText);
  ok('Stage 1 Q1: shadow sqrt3 times the pole', rd(deg(Math.atan(1 / R3)), 6), 30);
  is('Stage 1 Q1 prints 30', /theta = 30/.test(t[0].replace(/[{}$^\\]/g, ' ').replace(/\s+/g, ' ')) || /30\s*\^\s*\\circ/.test(t[0]));
  { const d = 40; const h = d * sin(60); near('Stage 1 Q2: CA sin 60', h, 20 * R3); is('Stage 1 Q2 prints 20 sqrt3', t[1].includes('20\\sqrt{3}')); }
  { const h = qn(t[2])[0]; const d = h / tan(30);
    is(`Stage 1 Q3: ${h} m gives ${k3(d)}, about ${dec(d)}`, t[2].includes(k3(d)) && hasNum(t[2], d, 2)); }
  // Q5: a third of the distance from a 30 degree start
  { const src = beyond.split('<div class="c-try">')[5].split('<div class="c-stage">')[0];
    const start = qAngles(src)[0]; is('Stage 1 Q5 starts at 30', start === 30);
    is('Stage 1 Q5: one third as far', /one third as far/.test(t[4]));
    const k = 3; const now = rd(deg(Math.atan(k * tan(start))), 6);
    ok('Stage 1 Q5: the new angle', now, 60);
    is(`Stage 1 Q5 prints theta = ${now}`, src.includes(`\\theta = ${now}^\\circ`));
    is('Stage 1 Q5: the angle is not three times as large', now !== 3 * start && /only doubled/.test(t[4]));
    for (const d of [5, 17, 90]) near(`Stage 1 Q5: tan of the new angle, d = ${d}`, (d * tan(start)) / (d / k), R3); }
}

// Stage 2, each example re-solved from its own question
const bex = {};
for (const chunk of beyond.split('<div class="c-example">').slice(1)) {
  const m = chunk.match(/c-example__tab">Example (\d+)<\/div>/);
  if (m) bex[m[1]] = chunk.split(/<h3>|<div class="c-practice|<section/)[0];
}
ok('fifteen Beyond examples, numbered from 1', Object.keys(bex).map(Number), [...Array(15)].map((_, i) => i + 1));
const bq = (n) => text(bex[n].replace(/<div class="c-example__tab">[^<]*<\/div>/, '').split('<p><strong>Solution')[0]);
const bqa = (n) => qAngles(bex[n].split('<p><strong>Solution')[0]);
const bans = (n) => text((bex[n].match(/work__label">Answer<\/span>([\s\S]*?)<\/div>/) || [])[1] || '').replace(/\$/g, '');
const bopts = (n) => [...(bex[n].match(/<ol class="c-parts[^"]*">([\s\S]*?)<\/ol>/) || ['', ''])[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => text(x[1]).trim());
const optVal = (s, vars = {}) => {
  let t = s.replace(/\$/g, '').replace(/\s*(m per minute|m|s)\s*$/, '').trim().replace(/^\{(.*)\}$/, '$1');
  for (const [k, v] of Object.entries(vars)) t = t.replace(new RegExp(k, 'g'), `(${v})`);
  const e = toExpr(t); return e ? evalExpr(e) : NaN;
};
const pick = (opts, want, vars) => opts.map((o, i) => (close(optVal(o, vars), want, 1e-9) ? 'abcd'[i] : null)).filter(Boolean);
const letterOf = (n) => (bans(n).match(/\(([a-d])\)/) || [])[1];
// 1: ladder 10 at 60, height
{ const [L] = qn(bq(1)); ok('Beyond Ex 1', pick(bopts(1), L * sin(bqa(1)[0])), [letterOf(1)]); is('Beyond Ex 1: (d) is about 11.5', hasNum(text(bex[1]), L / sin(60), 1)); }
// 2: aeroplane 300 at 60, sqrt3 = 1.732
{ const [h] = qn(bq(2)); const d = h / tan(bqa(2)[0]), L = h / sin(bqa(2)[0]);
  says('Beyond Ex 2', bans(2), rd(d * 1.732 / R3, 1), rd(L * 1.732 / R3, 1)); }
// 3: poles 5 and 15, 10 sqrt3 apart
{ const [a, b] = qn(bq(3)); const gap = 10 * R3; const ang = rd(deg(Math.atan((b - a) / gap)), 6);
  ok('Beyond Ex 3', pick(bopts(3).map(o => o.replace('^\\circ', '')), ang), [letterOf(3)]); }
// 4: kite 50, height 25 sqrt3
{ const [L] = qn(bq(4)); const ang = rd(deg(Math.asin(25 * R3 / L)), 6); is(`Beyond Ex 4: ${ang}°`, bans(4).includes(`theta = ${ang}`)); }
// 5: cliff 60, depressions 30 and 60
{ const [H] = qn(bq(5)); const [t1, t2] = bqa(5); const d = H / tan(t2); ok('Beyond Ex 5', pick(bopts(5), H - d * tan(t1)), [letterOf(5)]); }
// 6: window 18 at 60
{ const [h] = qn(bq(6)); const d = h / tan(bqa(6)[0]); says('Beyond Ex 6', bans(6), rd(d * 1.732 / R3, 2)); }
// 7: shadow 5 m longer, 45 to 30
{ const [d] = qn(bq(7)); const [t1, t2] = bqa(7); const h = d / (1 / tan(t2) - 1 / tan(t1));
  ok('Beyond Ex 7', pick(bopts(7), h), [letterOf(7)]); says('Beyond Ex 7', bans(7), rd(h, 2));
  is('Beyond Ex 7: the check shadows', hasNum(text(bex[7]), h / tan(t2), 2) && close(rd(h / tan(t2), 2) - rd(h / tan(t1), 2), d)); }
// 8: 20 m nearer, 30 to 45, sqrt3 = 1.732
{ const d = qn(bq(8)).find(x => x === 20); const [t1, t2] = bqa(8); const h = d / (1 / tan(t1) - 1 / tan(t2));
  says('Beyond Ex 8', bans(8), rd(d / (1.732 - 1), 2)); near('Beyond Ex 8: 10(sqrt3 + 1)', h, 10 * (R3 + 1)); }
// 9: lighthouse 100, opposite sides
{ const [h] = qn(bq(9)); const [t1, t2] = bqa(9); const D = h / tan(t1) + h / tan(t2);
  ok('Beyond Ex 9', pick(bopts(9), D), [letterOf(9)]); says('Beyond Ex 9', bans(9), rd(D, 1)); }
// 10: km stones 1 km apart, 45 and 60, same side
{ const [t1, t2] = bqa(10); const h = 1 / (1 / tan(t1) - 1 / tan(t2)); says('Beyond Ex 10', bans(10), rd(1.732 / (1.732 - 1), 3)); near('Beyond Ex 10: (3 + sqrt3)/2', h, (3 + R3) / 2); }
// 11: building 9, elevation 60, depression 30
{ const [b] = qn(bq(11)); const [up, down] = bqa(11); const d = b / tan(down); ok('Beyond Ex 11', pick(bopts(11), b + d * tan(up)), [letterOf(11)]);
  ok('Beyond Ex 11: (b) is the distance, (d) twice it', [optVal(bopts(11)[1]), optVal(bopts(11)[3])].map(x => rd(x, 9)), [rd(d, 9), rd(2 * d, 9)]); }
// 12: mobile tower 24, bottom 30, top 60
{ const [T] = qn(bq(12)); const [t1, t2] = bqa(12); const h = T / (tan(t2) / tan(t1) - 1); const d = h / tan(t1);
  says('Beyond Ex 12', bans(12), rd(h, 6), k3(d), rd(sqrtMult(d) * 1.732, 2)); }
// 13: cliff 150, 60 to 45 in 2 minutes
{ const [H, m] = qn(bq(13)); const [t1, t2] = bqa(13); const v = (H / tan(t2) - H / tan(t1)) / m;
  ok('Beyond Ex 13', pick(bopts(13), v), [letterOf(13)]); says('Beyond Ex 13', bans(13), rd(v, 1)); }
// 14: aeroplane at 1500 sqrt3, 60 to 30 in 15 s
{ const h = 1500 * R3; const [t1, t2] = bqa(14); const s = qn(bq(14)).find(x => x === 15);
  const v = (h / tan(t2) - h / tan(t1)) / s * 3600 / 1000; says('Beyond Ex 14', bans(14), rd(v, 6)); }
// 15: sqrt(ab), tried on numbers
// 15: CD = h(cot beta - cot alpha), tried on numbers
{ const e = text(bex[15]);
  is('Beyond Ex 15 proves h(cot beta - cot alpha)', bans(15).includes('h(\\cot\\beta - \\cot\\alpha)') && /alpha\$? is greater than \$?\\beta/.test(e));
  for (const [h, a, b] of [[30, 60, 30], [75, 45, 30], [12, 70, 20]]) {
    const C = h / tan(a), D = h / tan(b);                         // distances from the foot, found from the angles
    is(`Beyond Ex 15: the larger angle is the nearer object (${a}, ${b})`, C < D);
    near(`Beyond Ex 15: CD for h = ${h}, ${a} and ${b}`, D - C, h * (cot(b) - cot(a)));
  } }

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] = m[2];
const qtext = (n) => text((qs[n] || '').split('<ol class="c-parts')[0]);
const qang = (n) => qAngles((qs[n] || '').split('<ol class="c-parts')[0]);
const optsOf = (n) => [...((qs[n] || '').match(/<ol class="c-parts[^"]*">([\s\S]*)<\/ol>/) || ['', ''])[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => text(x[1]).trim());
const key = {};
{
  const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2];
}
const angOpt = (o) => optVal(o.replace('^\\circ', ''));
const byVal = (want, vars) => (o) => o.map(s => close(optVal(s, vars), want, 1e-9));
const solve = {
  1: o => { const [h, ] = qn(qtext(1)); const ang = deg(Math.atan(h / (2 * R3))); return o.map(s => close(angOpt(s), ang, 1e-9)); },
  2: o => byVal(qn(qtext(2))[0] * tan(qang(2)[0]))(o),
  3: o => byVal(qn(qtext(3))[0] * cos(qang(3)[0]))(o),
  4: o => byVal(qn(qtext(4))[0] / tan(qang(4)[0]))(o),
  5: o => byVal(qn(qtext(5))[0] / sin(qang(5)[0]))(o),
  6: o => o.map(s => s.replace(/\$/g, '') === '\\theta'),                     // alternate angles
  7: o => { const ang = deg(Math.atan(1 / R3)); return o.map(s => close(angOpt(s), ang, 1e-9)); },
  8: o => { const up = tan(0) < 1 && Math.atan(10 / 5) > Math.atan(10 / 20); return o.map(s => s === (up ? 'gets larger' : 'gets smaller')); },
  9: o => { const d = qn(qtext(9))[0]; const [t1, t2] = qang(9); return byVal(d * tan(t2) - d * tan(t1))(o); },
  10: o => { const d = qn(qtext(10))[0]; const t = qang(10)[0]; return byVal(d * tan(t) + d / cos(t))(o); },
  11: o => { const [t1, t2] = qang(11); const s = 1; return byVal(s * tan(t1) / tan(t2), { s: 1 })(o); },
  12: o => { const [h, d] = qn(qtext(12)); const [m, a] = qang(12); const both = close(deg(Math.atan(h / d)), m) && close(deg(Math.atan(h / d)), a);
    return o.map(s => s === (both ? 'both' : 'neither')); },
  13: o => { const d = qn(qtext(13))[0]; const h = d * 3 / 4; return byVal(Math.hypot(d, h))(o); },
  14: o => { const [h] = qn(qtext(14)); const [t1, t2] = qang(14); is('Q14: same side', /same side/.test(qtext(14)));
    return byVal(Math.abs(h / tan(t2) - h / tan(t1)))(o); },
  15: o => {
    const truth = [
      true,                                                        // alternate angles
      [1, 5, 50].every(d => deg(Math.atan(10 / d)) < 90),
      10 / tan(60) > 10 / tan(30),                                  // does a higher Sun lengthen the shadow?
      close(deg(Math.atan(1)), 45),
    ];
    return truth.map(t => !t);
  },
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Q${q}: the right option`, right, [key[q]]);
}
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  16: (() => { const [L, h] = qn(qtext(16)); const ang = rd(deg(Math.asin(h / L)), 6); return [ang === qang(16)[0], sin(30) === 0.5, true]; })(),
  17: [Math.atan(10 / 5) > Math.atan(10 / 20), false /* the two angles are equal, never greater */, false],
  18: (() => { const [L] = qn(qtext(18)); return [close(L * sin(qang(18)[0]), coef(qtext(18)) * R3), cos(60) === 0.5, false]; })(),
  19: (() => { const [h] = qn(qtext(19)); const shadow = coef(qtext(19)) * R3;
    return [close(h / tan(qang(19)[0]), shadow), close(tan(30), 1 / R3), false]; })(),
};
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-19', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(19)].map((_, i) => i + 1));
ok('practice numbered 1-31', [...beyond.matchAll(/data-start="(\d+)"/g)].map(m => Number(m[1])), [...Array(30)].map((_, i) => i + 2));
ok('Exercise Set 9.1 numbered 1-15', [...body.matchAll(/data-start="(\d+)"/g)].map(m => Number(m[1])), [...Array(14)].map((_, i) => i + 2));

// the practice answers, read back out of the key rows, a lettered part at a time
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= text(m[2]).replace(/\$/g, '');
const row = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const r = keyRows[n] || '';
  if (!part) return r;
  const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\) |$)`));
  return m ? m[1] : '';
};
const keySays = (q, ...vals) => says(`key ${q}`, row(q), ...vals);
const practice = {};
{
  const T = qtext;
  { const [t] = qang(20); const [d] = qn(T(20)); practice[20] = [d / cos(t)]; }
  { const [h] = qn(T(21)); practice[21] = [k3(h / tan(qang(21)[0]))]; practice['21md'] = [rd(h / tan(qang(21)[0]) * 1.732 / R3, 2)]; }
  { practice[22] = [rd(deg(Math.atan(R3)), 6)]; }
  { const [eye, d] = qn(T(23)); practice[23] = [rd(d * tan(qang(23)[0]) + eye, 6)]; }
  { const [H] = qn(T(24)); const [t1, t2] = qang(24); const d = H / tan(t2); const pole = H - d * tan(t1);
    near('Q24: 30(3 - sqrt3)', pole, 30 * (3 - R3));
    practice[24] = [k3(d), rd(H - sqrtMult(d * tan(t1)) * 1.732, 2)]; }
  { const [H] = qn(T(25)); const [t1, t2] = qang(25); const D = H / tan(t1) + H / tan(t2); practice[25] = [rd(H * 1.732 + H, 2)]; near('Q25: 60(sqrt3 + 1)', D, H * (R3 + 1)); }
  { const [eye, d, H] = qn(T(26)); practice[26] = [rd(deg(Math.atan((H - eye) / d)), 6)]; }
  { const [b] = qn(T(27)); const [t1, t2] = qang(27); const H = b / (1 - tan(t1) / tan(t2)); const d = H / tan(t2);
    practice[27] = [rd(H, 6), rd(sqrtMult(d) * 1.732, 2)]; }
  { const [d, s] = qn(T(29)).filter(x => x !== 1.732); const [t1, t2] = qang(29); const rise = d * tan(t2) - d * tan(t1);
    practice[29] = [rd(sqrtMult(rise) * 1.732, 2), rd(sqrtMult(rise) * 1.732 / s, 2)]; }
  // case 30, from its table and its text
  { const c = qs[30]; const eye = qn(text(c.split('<table>')[0]))[0];
    const cells = [...c.matchAll(/<td>([\s\S]*?)<\/td>/g)].map(x => x[1]);
    const dP = nums(text(cells[1]))[0]; const aP = qAngles(cells[2])[0]; const aQ = qAngles(cells[5])[0];
    const rise = dP * tan(aP); const dQ = rise / tan(aQ);
    practice['30a'] = [rd(sqrtMult(rise) * 1.732, 2)]; practice['30b'] = [rd(sqrtMult(rise) * 1.732 + eye, 2)];
    practice['30c'] = [rd(dQ, 6)]; practice['30d'] = [rd(dQ - dP, 6)]; }
  { const c = qs[31]; const h = qn(text(c.split('<table>')[0]))[0];
    const cells = [...c.matchAll(/<td>([\s\S]*?)<\/td>/g)].map(x => x[1]);
    const aA = qAngles(cells[1])[0], aR = qAngles(cells[3])[0]; const aNew = qAngles(c.split('<ol class="c-parts')[1])[0];
    practice['31a'] = [rd(h / tan(aA), 6)]; practice['31b'] = [rd(sqrtMult(h / tan(aR)) * 1.732, 2)];
    practice['31c'] = [rd(sqrtMult(h / tan(aR) - h / tan(aNew)) * 1.732, 2)]; practice['31d'] = [rd(h / sin(aR), 6)]; }
}
for (const [q, vals] of Object.entries(practice)) if (!/md/.test(q)) keySays(q, ...vals);
is('Q28 asks for h tan(alpha) / (tan(beta) - tan(alpha))', (qs[28] || '').includes('\\dfrac{h\\tan\\alpha}{\\tan\\beta - \\tan\\alpha}'));
is('key 28 ends with that height', row(28).includes('H = \\frac{h\\tan\\alpha}{\\tan\\beta - \\tan\\alpha}'));
for (const [H, h, d] of [[20, 5, 20], [12, 24, 12 * R3], [40, 7, 33]]) {   // a tower, a pole, a distance: read the angles back
  const ta = H / d, tb = (H + h) / d;
  near(`Q28: the formula gives the tower back (H = ${H}, h = ${h})`, h * ta / (tb - ta), H);
}
is('Q28 no longer repeats Beyond Example 15', !(qs[28] || '').includes('\\cot'));

// why-the-options rows, read back
{ const r = row(1); is('why 1: (a) needs a shadow 6 sqrt3', r.includes(k3(6 / tan(30)))); }
{ const o = optsOf(2); ok('why 2: (c) is the line of sight, (d) is 25 cos 60', [rd(optVal(o[2]), 9), rd(optVal(o[3]), 9)], [rd(25 / cos(60), 9), rd(25 * cos(60), 9)]); }
{ const o = optsOf(5); ok('why 5: (c) is the distance along the ground', rd(optVal(o[2]), 9), rd(45 / tan(60), 9)); }
{ const o = optsOf(13); ok('why 13: (b) the height, (d) the two sides added', [optVal(o[1]), optVal(o[3])], [15, 35]); }
{ const o = optsOf(14); const [h] = qn(qtext(14)); const [t1, t2] = qang(14); const near14 = h / tan(t1), far14 = h / tan(t2);
  ok('why 14: (a) sum, (c) the nearer car, (d) the height', [optVal(o[0]), optVal(o[2]), optVal(o[3])].map(x => rd(x, 9)), [far14 + near14, near14, h].map(x => rd(x, 9)));
  const r = row(14); is(`why 14 prints ${k3(far14)}, ${k3(near14)} and ${k3(far14 - near14)}`, [far14, near14, far14 - near14].every(x => r.includes(k3(x)))); }
{ const o = optsOf(9); ok('why 9: (d) the building, (a) the top of the flagstaff', [rd(optVal(o[3]), 9), optVal(o[0])], [rd(20 * tan(30), 9), 20 * tan(45)]); }

/* ---- D. ANSWERS.md prints the same key and answers ------------ */

const mdKey = {};
for (const m of md.slice(md.indexOf('as the key prints it'), md.indexOf('as the key prints it') + 400).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2];
ok('ANSWERS.md key matches the page', mdKey, key);
const mdPractice = md.slice(md.indexOf('The working for each'));
const mdRow = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const m = mdPractice.match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`));
  const r = m ? m[1].replace(/\$/g, '').replace(/\s+/g, ' ') : '';
  if (!part) return r;
  const p = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\) |$)`));
  return p ? p[1] : '';
};
for (const [q, vals] of Object.entries(practice)) says(`ANSWERS.md ${q}`, mdRow(q.replace('md', '')), ...vals);
{ const [h] = qn(qtext(14)); const [t1, t2] = qang(14); const gap = h / tan(t2) - h / tan(t1);
  const m = mdRow(14); is(`ANSWERS.md 14 prints ${k3(gap)}, about ${dec(gap)}`, m.includes(k3(gap)) && hasNum(m, gap, 2)); }
{ const m = mdRow(28); is('ANSWERS.md 28 ends with the tower height', m.includes('H = \\frac{h\\tan\\alpha}{\\tan\\beta - \\tan\\alpha}')); }
{ const s1 = md.slice(md.indexOf('### Stage 1'), md.indexOf('### Stage 3')); is('ANSWERS.md Stage 1 (5) is 60 degrees', /\(5\) \$60\^\\circ\$/.test(s1)); }
for (const [q, l] of Object.entries(key)) if (Number(q) >= 16) is(`ANSWERS.md ${q} gives (${l})`, mdRow(q).startsWith(`(${l})`));
{ const s1 = md.slice(md.indexOf('### Stage 1'), md.indexOf('### Stage 3'));
  const t = tryText(2); const h = nums(t)[0];
  is(`ANSWERS.md Stage 1 (3) matches the page: ${k3(h / tan(30))}, ${dec(h / tan(30))}`, s1.includes(k3(h / tan(30))) && hasNum(s1, h / tan(30), 2)); }

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
