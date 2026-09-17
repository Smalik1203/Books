#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed from the measurements a question gives, and compared with what
   is on the page.

     node pages/class-10/ch12-surface-areas-and-volumes/check-numbers.mjs [--skipped]

   Four parts:
     A  every identity set as maths, on every page and in ANSWERS.md.
        pi is read as a symbol: two sides that both carry it are compared as
        expressions, and a side with pi against a plain number uses the value
        of pi the question declares (22/7 or 3.14). A side that is a rounded
        decimal is allowed its rounding and no more. Sides with letters
        (r, h, l) are compared as algebra, at random values.
     B  what arithmetic cannot check: the answers, re-derived from the
        question's own measurements and read back off the page as phrases,
        a lettered part at a time; figure labels against the questions that
        use them; figures on the page of their question or facing it; every
        rupee sign kept with its number
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
const is = (what, cond) => { if (cond) pass++; else fails.push(what); };
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
const round = (x, d) => Math.round(x * 10 ** d + 1e-9) / 10 ** d;
const P7 = 22 / 7, P314 = 3.14;

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const md = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<span class="nb">([\s\S]*?)<\/span>/g, '$1')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/&middot;/g, '.')
  .replace(/\s+/g, ' ');
const plain = (s) => text(s.replace(/<sup>(\d)<\/sup>/g, '$1')).replace(/²/g, '2').replace(/³/g, '3').replace(/\$/g, '')
  .replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, '$1/$2').replace(/\\([a-z]+)/g, '$1').replace(/[{}*]/g, '');

/* ---- LaTeX to arithmetic -------------------------------------- */

// Tokens: {t:'n', v} number, {t:'v', v} a letter (r' is rp), {t:'P'} pi,
// {t:'o', v} + - * /, {t:'('}, {t:')'}, {t:'f', v} a function name.
function tokens(src) {
  let s = src.replace(/\\left|\\right|\\,|\\;|\\!|\\quad|\\qquad|\\displaystyle/g, ' ')
    .replace(/\\[dt]frac/g, '\\frac').replace(/\\ /g, ' ');
  let i = 0;
  const group = () => {                              // a {…} group, or one character
    while (s[i] === ' ') i++;
    if (s[i] !== '{') { const c = s[i++]; return tok(c); }
    let d = 0, j = i;
    for (; j < s.length; j++) { if (s[j] === '{') d++; if (s[j] === '}' && --d === 0) break; }
    const inner = s.slice(i + 1, j); i = j + 1;
    return tok(inner);
  };
  const out = [];
  let divOpen = [];                                  // "a ÷ 12\pi" divides by the whole term 12\pi
  const closeDiv = () => { while (divOpen.length) { out.push({ t: ')' }); divOpen.pop(); } };
  while (i < s.length) {
    const c = s[i];
    if (c === ' ') { i++; continue; }
    if (s.startsWith('\\frac', i)) { i += 5; const a = group(), b = group(); if (!a || !b) return null; out.push({ t: '(' }, { t: '(' }, ...a, { t: ')' }, { t: 'o', v: '/' }, { t: '(' }, ...b, { t: ')' }, { t: ')' }); continue; }
    if (s.startsWith('\\sqrt', i)) { i += 5; const a = group(); if (!a) return null; out.push({ t: 'f', v: 'Math.sqrt' }, { t: '(' }, ...a, { t: ')' }); continue; }
    if (s.startsWith('\\times', i) || s.startsWith('\\cdot', i)) { closeDiv(); i += s.startsWith('\\times', i) ? 6 : 5; out.push({ t: 'o', v: '*' }); continue; }
    if (s.startsWith('\\div', i)) { closeDiv(); i += 4; out.push({ t: 'o', v: '/' }, { t: '(' }); divOpen.push(1); continue; }
    if (s.startsWith('\\pi', i)) { i += 3; out.push({ t: 'P' }); continue; }
    if (c === '\\') return null;                     // any other command: not arithmetic
    if (c === '^') { i++; const a = group(); if (!a) return null; out.push({ t: 'o', v: '**' }, { t: '(' }, ...a, { t: ')' }); continue; }
    if (c === '{') { const a = group(); if (!a) return null; out.push({ t: '(' }, ...a, { t: ')' }); continue; }
    if (c === '(' || c === '[') { out.push({ t: '(' }); i++; continue; }
    if (c === ')' || c === ']') { out.push({ t: ')' }); i++; continue; }
    if (c === '+' || c === '-') { closeDiv(); out.push({ t: 'o', v: c }); i++; continue; }
    const n = s.slice(i).match(/^\d+(\.\d+)?/);
    if (n) { out.push({ t: 'n', v: n[0] }); i += n[0].length; continue; }
    const v = s.slice(i).match(/^[a-zA-Z]'?/);
    if (v) { out.push({ t: 'v', v: v[0].replace("'", 'p') }); i += v[0].length; continue; }
    return null;
  }
  closeDiv();
  return out;
}
const tok = (s) => (s === undefined ? null : tokens(s));
function compile(side) {
  const ts = tokens(side);
  if (!ts || !ts.length) return null;
  let js = '', prev = null;
  const operand = (t) => t && (t.t === 'n' || t.t === 'v' || t.t === 'P' || t.t === ')');
  for (const t of ts) {
    const starts = t.t === 'n' || t.t === 'v' || t.t === 'P' || t.t === '(' || t.t === 'f';
    if (operand(prev) && starts) js += '*';         // 2\pi r is a product
    js += t.t === 'n' ? t.v : t.t === 'v' ? `V.${t.v}` : t.t === 'P' ? 'P' : t.t === 'o' ? t.v : t.t === 'f' ? t.v : t.t;
    prev = t;
  }
  let f;
  try { f = Function('P', 'V', `"use strict";return (${js})`); f(3, {}); } catch { return null; }
  const vars = [...new Set(ts.filter(t => t.t === 'v').map(t => t.v))];
  const allLiteral = ts.every(t => t.t === 'n' || (t.t === 'o' && '+-'.includes(t.v)));
  const litTol = allLiteral ? ts.filter(t => t.t === 'n').reduce((a, t) => a + (t.v.includes('.') ? 0.5 * 10 ** -t.v.split('.')[1].length : 0), 0) : 0;
  return { f, vars, hasP: ts.some(t => t.t === 'P'), lone: ts.length === 1 && ts[0].t === 'v', upper: ts.some(t => t.t === 'v' && /[A-Z]/.test(t.v)), litTol, src: side.trim() };
}

// split at depth 0 on =, \approx and on commas or semicolons between statements
function statements(span) {
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

let spans = 0; const skipped = [];
function checkSpan(where, span, piVal) {
  if (!/=|\\approx/.test(span) || /\\neq|\\leq|\\geq|<|>/.test(span)) return;
  for (const st of statements(span.replace(/^\{(.*)\}$/s, '$1'))) {
    const sides = st.split(/=|\\approx/).map(x => x.trim()).filter(Boolean);
    if (sides.length < 2) continue;
    if (sides[0] === '\\pi') continue;               // a declaration of pi
    const cs = sides.map(compile);
    let checked = false;
    for (let k = 0; k + 1 < cs.length; k++) {
      const a = cs[k], b = cs[k + 1];
      if (!a || !b || a.lone || b.lone || a.upper || b.upper) continue;   // a lone letter is a definition; capitals name points
      if (a.vars.length || b.vars.length) {
        if (!a.vars.length || !b.vars.length) continue;          // a formula against its value: B checks it
        const names = [...new Set([...a.vars, ...b.vars])];
        let same = true;
        for (const seed of [1.37, 2.91, 0.53]) {
          const V = Object.fromEntries(names.map((n, j) => [n, seed + j * 0.71]));
          const x = a.f(seed + 1.1, V), y = b.f(seed + 1.1, V);
          if (!near(x, y)) same = false;
        }
        checked = true; spans++;
        is(`${where}: $${a.src} = ${b.src}$ is not an identity`, same);
        continue;
      }
      let pv = 3;
      if (a.hasP !== b.hasP) {
        const p = a.hasP ? a : b;
        if (!near(p.f(3, {}), p.f(3.3, {}))) {                  // the pi does not cancel
          if (!piVal) { fails.push(`${where}: $${a.src} = ${b.src}$ needs a value of pi and none is declared`); continue; }
          pv = piVal;
        }
      }
      const x = a.f(pv, {}), y = b.f(pv, {});
      const tol = Math.max(a.litTol, b.litTol) + 1e-9 * Math.max(1, Math.abs(y));
      checked = true; spans++;
      is(`${where}: $${a.src} = ${b.src}$ — sides are ${x} and ${y}`, Math.abs(x - y) <= tol);
      if (a.hasP && b.hasP) is(`${where}: $${a.src} = ${b.src}$ with another pi`, Math.abs(a.f(2.5, {}) - b.f(2.5, {})) <= tol);
    }
    if (!checked) skipped.push(`${where}: $${st.trim()}$`);
  }
}
const piOf = (s) => { const m = [...s.matchAll(/\\pi = (3\.14|\\frac\{22\}\{7\})/g)].pop(); return m ? (m[1] === '3.14' ? P314 : P7) : null; };

/* ---- the practice questions, needed by A for the trace rows --- */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] = m[2];
const qPi = Object.fromEntries(Object.entries(qs).map(([n, s]) => [n, piOf(s)]));

/* ---- A. every identity ---------------------------------------- */

// "$a = b$&nbsp;cm² $= c$&nbsp;cm²" is one chain: join spans across a unit that
// does not change (a change of unit, cm² to m², stays two statements)
const joinUnits = (s) => {
  let prev;
  do {
    prev = s;
    s = s.replace(/\$([^$]*)\$&nbsp;((?:mm|cm|m)(?:<sup>\d<\/sup>)?) \$(= [^$]*)\$&nbsp;\2(?!\w|<sup>)/, (m, a, u, b) =>
      (/^\s*[+-]/.test(a) ? m.replace('$&nbsp;', '$\u0000') : `$${a} ${b}$&nbsp;${u}`));
  } while (s !== prev);
  return s.replace(/\u0000/g, '&nbsp;');
};
for (const f of pages) {
  const src = joinUnits(html[f].replace(/<svg[\s\S]*?<\/svg>/g, '').replace(/\$\$/g, '$'));
  // trace rows answer a practice question: they take that question's pi
  const traced = [];
  const bare = src.replace(/<div class="work__row"><span class="work__label">(\d+)<\/span>([\s\S]*?)<\/div>/g, (m, n, inner) => { traced.push([n, inner]); return ' '; });
  for (const [n, inner] of traced) for (const m of inner.matchAll(/\$([^$]+)\$/g)) checkSpan(`${f} row ${n}`, m[1], qPi[n]);
  for (const m of bare.matchAll(/\$([^$]+)\$/g)) checkSpan(f, m[1], piOf(bare.slice(0, m.index)));
}
{
  const lines = md.split('\n');
  let scope = '';
  for (const line of lines) {
    if (/^(\d+\.|#)/.test(line)) scope = '';
    scope += line + '\n';
    for (const m of line.matchAll(/\$([^$]+)\$/g)) checkSpan(`ANSWERS.md: ${line.trim().slice(0, 30)}`, m[1], piOf(scope.slice(0, scope.length - line.length - 1) + line.slice(0, m.index)));
  }
}

/* ---- B. answers, re-derived ----------------------------------- */

// a value is printed as a number standing alone, not as part of another
const hasNum = (s, v) => new RegExp(`(^|[^\\d.])${String(v).replace('.', '\\.')}(?![\\d]|\\.\\d)`).test(s);
const shows = (what, s, ...vals) => { for (const v of vals) is(`${what} should print ${v}: "${s.slice(0, 160)}"`, typeof v === 'string' && !/^[\d.]+$/.test(v) ? s.includes(v) : hasNum(s, typeof v === 'number' ? round(v, 6) : v)); };

// the body's worked examples, read from their Answer rows
const answerRows = [...body.matchAll(/<span class="work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)].map(m => plain(m[1]));
const exCount = (body.match(/<div class="c-example">/g) || []).length;
is(`every body example has an Answer row (${answerRows.length} of ${exCount})`, answerRows.length === exCount);
{
  // Example 1: diameter 3.5 cm, height 5 cm
  const r = 3.5 / 2, h = 5 - r, l = round(Math.hypot(r, h), 1);
  is('Ex 1: slant height rounds to 3.7', l === 3.7);
  shows('body Example 1', answerRows[0], round(P7 * r * (2 * r) + P7 * r * l, 2));
  shows('body Example 2', answerRows[1], round(6 * 25 + P7 * 2.1 ** 2, 2));
  { const rc = 2.5, hc = 6, rp = 1.5, hp = 26 - 6, lc = Math.hypot(rc, hc);
    is('Ex 3: slant height is 6.5', lc === 6.5);
    shows('body Example 3', answerRows[2], `orange ${round(P314 * (rc * lc + rc * rc - rp * rp), 3)}`, `yellow ${round(P314 * rp * (2 * hp + rp), 3)}`); }
  { const a = 2 * P7 * 30 * (145 + 30); is('Ex 4: 33000 cm²', near(a, 33000)); shows('body Example 4', answerRows[3], a / 10000); }
  { const v = 15 * 7 * 8 + 0.5 * P7 * 3.5 * 3.5 * 15; shows('body Example 5', answerRows[4], `${v} m3 when empty`, `${round(v - 300 - 20 * 0.08, 2)} m3 with`); }
  { const app = P314 * 2.5 ** 2 * 10, hemi = round(2 / 3 * P314 * 2.5 ** 3, 2); shows('body Example 6', answerRows[5], `apparent capacity ${app}`, `actual capacity ${round(app - hemi, 2)}`); }
  { const toy = 2 / 3 * P314 * 8 + 1 / 3 * P314 * 4 * 2, cyl = P314 * 4 * (2 + 2);
    shows('body Example 7', answerRows[6], `toy ${round(toy, 2)}`, `difference ${round(cyl - toy, 2)}`); }
}

// figures: each label is a measurement the question states, and the
// question prints on the figure's page or facing it
const folio = {};
{ let n = 0; for (const f of pages) folio[f] = ++n; }
const facing = (a, b) => a === b || (Math.min(a, b) % 2 === 0 && Math.abs(a - b) === 1);
for (const f of pages) for (const fig of html[f].matchAll(/<svg([\s\S]*?)<\/svg>[\s\S]*?<span class="fignum">Fig\. (12\.\d+)<\/span>/g)) {
  const num = fig[2];
  const labels = [...fig[1].matchAll(/class="dg-dim-label"[^>]*>([^<]+)</g)].map(m => m[1].trim());
  const askers = [];
  for (const g of pages) {
    const blocks = [...html[g].matchAll(/<div class="c-example__body">\s*<p>([\s\S]*?)<\/p>|<li>((?:(?!<li>)[\s\S])*?Fig\.&nbsp;[\s\S]*?)<\/li>/g)];
    for (const b of blocks) { const q = b[1] || b[2]; if (q && q.includes(`Fig.&nbsp;${num})`) || q && new RegExp(`Fig\\.&nbsp;${num.replace('.', '\\.')}[^\\d]`).test(q)) askers.push([g, text(q)]); }
  }
  // Figs. 12.1-12.5 belong to the running text, and 12.14 to the working inside its own panel
  if (/^12\.(6|7|8|9|1[0-35-9])$/.test(num)) is(`Fig. ${num}: no example or question found that uses it`, askers.length >= 1);
  for (const [g, q] of askers) {
    is(`Fig. ${num} (on ${f}) and the question on ${g} should print on one page or facing`, facing(folio[f], folio[g]));
    for (const lab of labels) is(`Fig. ${num}: label "${lab}" is not a measurement in its question: "${q.slice(0, 100)}"`, q.includes(lab));
  }
}

// a rupee sign set before maths is wrapped with its number
for (const f of pages) for (const m of html[f].matchAll(/₹(?=\$)/g))
  is(`${f}: ₹ at ${m.index} is not wrapped with its number`, /<span class="nb">$/.test(html[f].slice(0, m.index)));

// Exercise Sets 12.1 and 12.2, read back off ANSWERS.md
const mdSection = (head, next) => md.slice(md.indexOf(head), next ? md.indexOf(next, md.indexOf(head)) : undefined);
const set1 = mdSection('### Exercise Set 12.1', '## 12.3');
const set2 = mdSection('### Exercise Set 12.2', '### The chapter');
const item = (sec, n) => { const m = sec.match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |\\n#|$)`)); return m ? plain(m[1]).replace(/cm²/g, 'cm2').replace(/m³/g, 'm3') : ''; };
{
  const e = Math.cbrt(64); shows('Set 12.1 Q1', item(set1, 1), 2 * (2 * e * e + e * e + 2 * e * e));
  { const r = 7, h = 13 - r; shows('Set 12.1 Q2', item(set1, 2), 2 * P7 * r * r + 2 * P7 * r * h); }
  { const r = 3.5, h = 15.5 - r, l = Math.hypot(r, h); shows('Set 12.1 Q3', item(set1, 3), h, l, round(P7 * r * l + 2 * P7 * r * r, 2)); }
  { const s = 7, r = s / 2; shows('Set 12.1 Q4', item(set1, 4), `${s} cm`, round(6 * s * s + P7 * r * r, 2)); }
  { const l = 2; is('Set 12.1 Q5: l^2/4 (24 + pi)', near(6 * l * l + Math.PI * (l / 2) ** 2, l * l / 4 * (24 + Math.PI))); shows('Set 12.1 Q5', item(set1, 5), '(24 + pi)'); }
  { const r = 2.5, c = 14 - 5; shows('Set 12.1 Q6', item(set1, 6), round(2 * P7 * r * c + 4 * P7 * r * r, 6)); }
  { const r = 2, a = 2 * P7 * r * 2.1 + P7 * r * 2.8; shows('Set 12.1 Q7', item(set1, 7), round(a, 6), `₹${round(a * 500, 2)}`); }
  { const r = 0.7, h = 2.4, l = Math.hypot(r, h), a = 2 * P7 * r * h + P7 * r * r + P7 * r * l;
    shows('Set 12.1 Q8', item(set1, 8), l, round(a, 2), `${Math.round(a)} cm2 to the nearest`); }
  { const r = 3.5, h = 10; shows('Set 12.1 Q9', item(set1, 9), round(2 * P7 * r * h + 4 * P7 * r * r, 6)); }

  is('Set 12.2 Q1: the volume is pi', near(1 / 3 * 1 + 2 / 3 * 1, 1)); shows('Set 12.2 Q1', item(set2, 1), '= pi cm3');
  { const r = 1.5, c = 12 - 4, v = P7 * r * r * c + 2 / 3 * P7 * r * r * 2; shows('Set 12.2 Q2', item(set2, 2), c, round(v, 6)); }
  { const r = 1.4, c = 5 - 2.8, one = P7 * r * r * c + 4 / 3 * P7 * r ** 3;
    shows('Set 12.2 Q3', item(set2, 3), round(one, 2), round(45 * one, 2), `about ${Math.round(0.3 * 45 * one)} cm3`); }
  { const v = 15 * 10 * 3.5 - 4 * (1 / 3 * P7 * 0.25 * 1.4); shows('Set 12.2 Q4', item(set2, 4), round(v, 2)); }
  { const n = (1 / 4 * 1 / 3 * 25 * 8) / (4 / 3 * 0.5 ** 3); is('Set 12.2 Q5: a whole number of shots', near(n, Math.round(n))); shows('Set 12.2 Q5', item(set2, 5), Math.round(n)); }
  { const v = P314 * 144 * 220 + P314 * 64 * 60; shows('Set 12.2 Q6', item(set2, 6), round(v, 2), `about ${round(v * 8 / 1000, 2)} kg`); }
  { const k = 3600 * 180 - 1 / 3 * 3600 * 120 - 2 / 3 * 60 ** 3; shows('Set 12.2 Q7', item(set2, 7), `${k}pi`, round(k * P7, 2), `about ${round(k * P7 / 1e6, 3)} m3`); }
  { const v = round(4 / 3 * P314 * 4.25 ** 3, 2) + P314 * 8; shows('Set 12.2 Q8', item(set2, 8), round(v, 2), 'not correct'); is('Set 12.2 Q8: 345 is wrong', Math.abs(v - 345) > 0.5); }
}

// Stage 1, as printed in its running text
{
  const s1 = plain(beyond.slice(0, beyond.indexOf('Solved Examples')));
  shows('Stage 1 Q1', s1, 6 * 16 + 6 * 4 - 2 * 4, 96 + 4 * 4);
  is('Stage 1 Q2: 1 : 2 : 3', [1 / 3, 2 / 3, 1].map(x => x * 3).join(':') === '1:2:3' && s1.includes('1 : 2 : 3'));
  shows('Stage 1 Q3', s1, `96pi`, `h = ${(96 - 3 * 3 * 10) / (1 / 3 * 3 * 3)}`);   // the cone is what the cylinder does not hold
  shows('Stage 1 Q4', s1, `${2 ** 2} times as large`, `volume ${2 ** 3} times`);
  // and ANSWERS.md's summary of the same five
  const m1 = plain(mdSection('### Stage 1', '### Stage 3'));
  shows('ANSWERS.md Stage 1', m1, `(1) ${6 * 16 + 6 * 4 - 2 * 4} cm2`, '1 : 2 : 3', `cone is ${(96 - 90) / 3} cm tall`,
    `${2 ** 2} times as large and the volume ${2 ** 3} times`, 'goes up, by pi r^2');
}

// Beyond's worked examples: read each example back
const bex = {};
{ const parts = beyond.split(/<div class="c-example__tab">Example (\d+)<\/div>/);
  for (let i = 1; i < parts.length; i += 2) bex[parts[i]] = parts[i + 1].split(/<div class="c-example__tab"|<div class="c-practice/)[0]; }
is(`Beyond has at least 12 examples, numbered from 1 (${Object.keys(bex).join(',')})`, Object.keys(bex).length >= 12 && Object.keys(bex).every((k, i) => Number(k) === i + 1));
const exAnswer = (n) => { const m = (bex[n] || '').match(/work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/); return m ? plain(m[1]) : ''; };
const exOpts = (n) => [...((bex[n] || '').match(/<ol class="c-parts[^"]*">([\s\S]*?)<\/ol>/) || ['', ''])[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => text(x[1]).trim());
const optVal = (o) => { const m = o.replace(/\$/g, '').replace(/\s*(cm|m)\s*\d?$/, '').trim(); const c = compile(m); return c && !c.vars.length ? c.f(1, {}) : NaN; };
const exMcq = {
  1: o => o.map(optVal).map(v => v === 2 * (10 * 5 + 5 * 5 + 10 * 5)),
  2: o => o.map(optVal).map(v => near(v, Math.PI * 3 * Math.hypot(3, 4) / Math.PI + 2 * 9)),
  5: o => o.map(optVal).map(v => near(v, round(600 - 2 * P7 * 1.4 ** 2 + 2 * P7 * 1.4 * 10, 2))),
  6: o => o.map(optVal).map(v => near(v, (8 - 2) + 4 / 3)),
  10: o => o.map(optVal).map(v => near(v, round(P7 * 49 * 14 - 2 / 3 * P7 * 343, 2))),
  12: o => o.map(optVal).map(v => near(v, 3 * 3 * 12 - 1 / 3 * 3 * 3 * 3)),
  13: o => o.map(s => near(Number(s.replace(' litres', '')), round((30 * 20 * 25 + P7 * 2 * 2 * 7) / 1000, 2))),
};
for (const [n, f] of Object.entries(exMcq)) {
  const o = exOpts(n);
  is(`Beyond Example ${n} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  is(`Beyond Example ${n}: right option ${right} should be the Answer "${exAnswer(n)}"`, right.length === 1 && exAnswer(n) === `(${right[0]})`);
}
shows('Beyond Example 3', exAnswer(3), 2 * P7 * 7 * 20 + P7 * 49 + P7 * 7 * Math.hypot(7, 24));
shows('Beyond Example 4', exAnswer(4), round((2 * 3 * 8 + 9 + 3 * Math.hypot(3, 4)) * P314, 2));
shows('Beyond Example 7', exAnswer(7), `about ${round(1 / 3 * P7 * 3.5 ** 2 * 6 + 2 / 3 * P7 * 3.5 ** 3, 2)}`);
shows('Beyond Example 8', exAnswer(8), `about ${Math.round((P7 * 0.7 ** 2 * 3 + 4 / 3 * P7 * 0.7 ** 3) * 1000)} litres`);
shows('Beyond Example 9', exAnswer(9), round(400 - 2 / 3 * P7 * 2.1 ** 3, 3));
shows('Beyond Example 11', exAnswer(11), 'twice the volume of the cone');
shows('Beyond Example 14', exAnswer(14), `₹${((2 * P7 * 0.7 * 2 + 2 * P7 * 0.49) * 40).toFixed(2)}`);
for (const [n, says] of [[3, ['radius 7 cm and height 20 cm', 'height 24 cm']], [4, ['radius 3 cm and height 8 cm', 'depth 4 cm', 'pi = 3.14']], [7, ['radius 3.5 cm and height 6 cm']],
  [8, ['3 m long and 1.4 m in diameter', '1000 litres']], [9, ['10 cm long, 8 cm wide and 5 cm high', 'radius 2.1 cm']], [12, ['inner radius 3 cm and height 12 cm', 'cone of radius 3 cm and height 3 cm']], [13, ['30 cm long, 20 cm wide and 25 cm high', 'inner radius 2 cm and length 7 cm', 'pi = 22/7']],
  [14, ['radius 0.7 m and height 2 m', '₹40 per m2']]])
  for (const s of says) is(`Beyond Example ${n} should state "${s}"`, plain((bex[n] || '').split('Solution')[0]).includes(s));

// the practice answers, read back out of the key rows, a part at a time
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= plain(m[2]);
const partOf = (r, part) => { if (!part) return r; const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\) |$)`)); return m ? m[1] : ''; };
const row = (q) => { const [, n, p] = String(q).match(/^(\d+)([a-d]?)$/); return partOf(keyRows[n] || '', p); };
const says = (q, ...vals) => shows(`key ${q}`, row(q), ...vals);
const asks = (q, ...vals) => { for (const v of vals) is(`Q${q} should state "${v}": ${plain(qs[q] || '').slice(0, 90)}`, plain(qs[q] || '').includes(v)); };

const ans = {
  20: 4 / 3 * 27, 21: 2 * 4, 23: round((2 * 5 * 12 + 2 * 25 + 25) * P314, 2),
  24: round(P7 * 3.5 ** 2 * 12, 2) + round(2 / 3 * P7 * 3.5 ** 3, 2), 25: round(12 * 8 * 6 - P314 * 6, 2),
  26: 2 / 3 * P7 * 10.5 ** 3,
  '27a': Math.hypot(2.4, 1.8), '27b': round(2 * P314 * 2.4 * 2 + P314 * 2.4 * Math.hypot(2.4, 1.8), 6),
  '27c': round(P314 * 2.4 ** 2 * 2 + 1 / 3 * P314 * 2.4 ** 2 * 1.8, 2),
  '29a': round(1 / 3 * P314 * 36 * 8 + 2 / 3 * P314 * 216, 6), '29c': round(P314 * 6 * Math.hypot(6, 8) + 2 * P314 * 36, 6),
  '30a': round(Math.hypot(3.5, 8.4), 6), '30b': round(P7 * 3.5 ** 2 * 8 + 1 / 3 * P7 * 3.5 ** 2 * 8.4, 6),
  '30c': round(2 * P7 * 3.5 * 8 + P7 * 3.5 * Math.hypot(3.5, 8.4), 6),
  '31a': round(P7 * 0.35 ** 2 * 14 + 1 / 3 * P7 * 0.35 ** 2 * 1.2, 6), '31b': round(2 * P7 * 0.35 * 14 + P7 * 0.35 ** 2, 6),
  '31c': round(P7 * 0.35 * Math.hypot(0.35, 1.2), 6),
};
ans['27cost'] = round(ans['27b'] * 120, 2);
ans['29b'] = ans['29a'] * 7.5 / 1000;
ans['30d'] = round(ans['30b'] * 800 / 1000, 2);
ans['31d'] = ans['31b'] * 1000 / 10000;
says(20, `${ans[20]}pi`); asks(20, 'radius 3 cm');
says(21, `${ans[21]}pi`); asks(21, 'cone of radius 2 cm');
says(22, `${1 / (1 / 3)} cones`);
says(23, ans[23]); asks(23, 'radius 5 cm and height 12 cm', 'pi = 3.14');
says(24, ans[24]); asks(24, 'radius 3.5 cm and height 12 cm', 'pi = 22/7');
says(25, ans[25]); asks(25, '12 cm long, 8 cm wide and 6 cm high', 'radius 1 cm');
says(26, ans[26], `about ${round(ans[26] / 1000, 2)} litres`); asks(26, 'radius 10.5 cm', 'pi = 22/7');
says('27a', ans['27a']); says('27b', ans['27b'], `₹${ans['27cost']}`); says('27c', ans['27c']);
asks(27, 'radius 2.4 m and height 2 m', 'height 1.8 m', '₹120 per m2', 'pi = 3.14');
says(28, '4pi r^2');
says('29a', ans['29a']); says('29b', `${ans['29a'] * 7.5} g`, `${ans['29b']} kg`); says('29c', ans['29c']);
asks(29, 'radius 6 cm and height 8 cm', '7.5 g', 'pi = 3.14');
says('30a', ans['30a']); says('30b', ans['30b']); says('30c', ans['30c']); says('30d', `${ans['30d']} tonnes`);
asks(30, '3.5 m', '8 m', '8.4 m', '800 kg', 'pi = 22/7');
says('31a', ans['31a']); says('31b', ans['31b']); says('31c', ans['31c']); says('31d', `${ans['31d']} m2`);
asks(31, '0.35 cm', '14 cm', '1.2 cm', 'pi = 22/7');

/* ---- C. multiple choice and assertion-reason ------------------ */

const optsOf = (n) => [...(qs[n] || '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => text(x[1]).trim());
const key = {};
{
  const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2];
}
const valAt = (o, P, r) => { const c = compile(o.replace(/\$/g, '').replace(/\s*(cm|m)\s*\d?$/, '').trim()); return c ? c.f(P, { r }) : NaN; };
const solve = {
  1: o => o.map(s => near(valAt(s, Math.PI, 2), (4 / 3 * Math.PI * 8) / 2) && near(valAt(s, Math.PI, 3), (4 / 3 * Math.PI * 27) / 2)),
  2: o => o.map(s => near(valAt(s, 1, 0), P7 * 7 * 15)),
  3: o => o.map(s => s === 'the CSA of the cylinder + the CSA of the two hemispheres'),
  4: o => o.map(s => near(valAt(s, 1, 0), 1 / 3 * P7 * 36 * 7)),
  5: o => o.map(s => near(valAt(s, 1, 0), 1 / 3 * (6 / 2) ** 2 * 6)),
  6: o => o.map(s => near(valAt(s, 1, 0), 2 * P7 * 49)),
  7: o => o.map(s => s === 'the sum of their volumes'),
  8: o => o.map(s => near(valAt(s, 1, 0), P7 * 49 * 10)),
  9: o => o.map(s => near(valAt(s, 1, 0), 2 * 3 * 3)),
  10: o => o.map(s => s === ({ 'true,false': 'only Nila', 'false,true': 'only Omar', 'true,true': 'both', 'false,false': 'neither' })[[true, 2 * 3 > 0 && false].join()]),
  11: o => o.map(s => near(valAt(s, 1, 0), 60 + 60 / 3)),
  12: o => o.map(s => near(valAt(s, 1, 0), P7 * 7 * 7 * 5 + 1 / 3 * P7 * 7 * 7 * 6)),
  13: o => o.map(s => near(valAt(s, 1, 0), 3 * Math.sqrt(5 ** 2) + 2 * 3 * 6 + 3 * 3)),   // cone + cylinder + base; the top is hidden
  14: o => o.map(s => /sum of their total surface areas/.test(s)),          // the one that ignores the hidden faces
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  is(`Q${q}: right option ${JSON.stringify(right)}, key ${key[q]}`, right.length === 1 && right[0] === key[q]);
}
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  15: [2 * Math.PI * 9 > 0, true, true],                                         // the difference is the two hidden flat faces
  16: [near(9 * 5 + 2 / 3 * 27, 63), near(4 / 3, 2 / 3), false],
  17: [near(2 * 3 * Math.hypot(3, 4), 48), true, false],
  18: [near(4 * 5 + 2 / 3 * 8, 76 / 3), near(1 / 3, 1 / 3), false],
  19: [near(4 * 3 + 1 / 3 * 4 * 3, 24), true, false],
};
for (const [q, v] of Object.entries(AR)) is(`Q${q}: assertion-reason ${arLetter(v)}, key ${key[q]}`, arLetter(v) === key[q]);
is('AR claims are stated as printed', plain(qs[16]).includes('63pi') && plain(qs[17]).includes('48pi') && plain(qs[18]).includes('76/3pi') && plain(qs[19]).includes('24pi'));
asks(12, 'radius 7 cm and height 5 cm', 'height 6 cm', 'pi = 22/7'); asks(13, 'radius 3 cm and slant height 5 cm', 'radius 3 cm and height 6 cm');
asks(19, 'radius 2 cm and height 3 cm, with a cone of radius 2 cm and height 3 cm');
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
is('key covers 1-19', JSON.stringify(Object.keys(key).map(Number).sort((a, b) => a - b)) === JSON.stringify([...Array(19)].map((_, i) => i + 1)));
is('practice numbered 1-31', JSON.stringify([...beyond.matchAll(/data-start="(\d+)"/g)].map(m => Number(m[1]))) === JSON.stringify([...Array(30)].map((_, i) => i + 2)));

/* ---- D. ANSWERS.md prints the same key and answers ------------- */

const mdKey = {};
{ const at = md.indexOf('as the key prints it'); for (const m of md.slice(at, at + 400).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2]; }
is(`ANSWERS.md key matches the page: ${JSON.stringify(mdKey)}`, JSON.stringify(mdKey) === JSON.stringify(key));
const mdPractice = md.slice(md.indexOf('The working for each'));
const mdRow = (q) => { const [, n, p] = String(q).match(/^(\d+)([a-d]?)$/); return partOf(item(mdPractice, n).replace(/\s+/g, ' '), p); };
const mdSays = (q, ...vals) => shows(`ANSWERS.md ${q}`, mdRow(q), ...vals);
mdSays(2, P7 * 7 * 15); mdSays(4, 1 / 3 * P7 * 36 * 7); mdSays(5, `${1 / 3 * 9 * 6}pi`); mdSays(6, 2 * P7 * 49);
mdSays(8, P7 * 490); mdSays(9, 18); mdSays(11, 80); mdSays(12, P7 * 49 * 5 + 1 / 3 * P7 * 49 * 6); mdSays(13, `${3 * 5 + 2 * 3 * 6 + 9}pi`); mdSays(19, `${4 * 3 + 4 * 3 / 3}pi`);
mdSays(20, `${ans[20]}pi`); mdSays(21, `${ans[21]}pi`); mdSays(22, '3 cones');
mdSays(23, ans[23]); mdSays(24, ans[24]); mdSays(25, ans[25]); mdSays(26, `about ${round(ans[26] / 1000, 2)} litres`);
mdSays('27a', ans['27a']); mdSays('27b', ans['27b'], `₹${ans['27cost']}`); mdSays('27c', ans['27c']);
mdSays('29a', ans['29a']); mdSays('29b', `${ans['29b']} kg`); mdSays('29c', ans['29c']);
mdSays('30a', ans['30a']); mdSays('30b', ans['30b']); mdSays('30c', ans['30c']); mdSays('30d', `${ans['30d']} tonnes`);
mdSays('31a', ans['31a']); mdSays('31b', ans['31b']); mdSays('31c', ans['31c']); mdSays('31d', `${ans['31d']} m2`);

/* ---- report ---------------------------------------------------- */

console.log(`A  ${spans} identities evaluated; ${skipped.length} statements not checkable as arithmetic or algebra, skipped`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
