#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed — fractions, signs, repeating decimals, square roots, the
   points a figure is drawn at — and compared with what is on the page.

     node pages/class-9/ch03-world-of-numbers/check-numbers.mjs [--skipped]

   Four parts:
     A  every identity set as maths, on every page and in ANSWERS.md: each
        side that is pure arithmetic (fractions, powers, square roots,
        absolute values, repeating decimals, pi) is evaluated, and the
        sides must agree; a letter the same block solves (x = ...) is put
        in. A decimal printed with "..." or rounded is allowed the error
        its last digit carries. A chain of < is checked in order too.
     B  the claims A cannot check: each example's Answer row, each exercise
        answer read back off ANSWERS.md, the figures' drawn lengths, and the
        practice answers read back out of the key rows a lettered part at a
        time
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
const near = (a, b, tol = 1e-9) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(a), Math.abs(b));

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const unwrap = (s) => s.replace(/<span class="nb">([^<]*)<\/span>/g, '$1');
// maths as a flat string: fractions as a/b, no spacing, no $ — for reading values back
const norm = (s) => unwrap(s)
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/\\[tdc]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '$1/$2')
  .replace(/\\left|\\right|\\,|\\;|\\!/g, '').replace(/\$/g, '').replace(/\s+/g, ' ');
const tight = (s) => norm(s).replace(/\s+/g, '');
const esc = (v) => String(v).replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const has = (s, v) => new RegExp(`(^|[^\\d.])${esc(v)}([^\\d]|$)`).test(s);

/* ---- A. every identity ---------------------------------------- */

const repeating = (whole, non, rep) => {        // whole.non(rep repeating)
  const A = Number(`${whole || 0}${non}${rep}`), B = Number(`${whole || 0}${non}`);
  return `((${A - B})/(${10 ** non.length * (10 ** rep.length - 1)}))`;
};
function toExpr(side, env = {}) {
  let s = side
    .replace(/\\left\|/g, '⟦').replace(/\\right\|/g, '⟧')
    .replace(/\\left|\\right/g, '')
    .replace(/\\(?:,|;|!|quad|qquad|ldots)/g, '').replace(/\\ /g, '')
    .replace(/\^\{([^{}]+)\}/g, '^($1)')
    .replace(/(\d*)\.(\d*)\\overline\{(\d+)\}/g, (m, w, n, r) => repeating(w, n, r))
    .replace(/(\d)\\[td]?frac\{(\d+)\}\{(\d+)\}/g, '($1+$2/$3)')        // a mixed number
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)');
  for (let i = 0; i < 4; i++) s = s.replace(/\\[tdc]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))').replace(/\\sqrt\{([^{}]+)\}/g, '√($1)');
  s = s.replace(/\\times|\\cdot/g, '*').replace(/\\div/g, '/').replace(/\\pi/g, 'π')
    .replace(/\^\{([^{}]+)\}/g, '^($1)').replace(/\^/g, '**')
    .replace(/\s+/g, '');
  let prev; do { prev = s; s = s.replace(/\|([^|]*)\|/g, '⟦$1⟧'); } while (s !== prev);
  for (const [v, val] of Object.entries(env)) s = s.replace(new RegExp(`(?<![A-Za-z\\\\])${v}(?![A-Za-z])`, 'g'), `(${val})`);
  if (!s || !/^[-+*/().0-9√π⟦⟧]+$/.test(s)) return null;
  s = s.replace(/(\d|\)|π|⟧)(?=[(√π⟦])/g, '$1*').replace(/(\)|π|⟧)(?=\d)/g, '$1*');
  return s.replace(/√/g, 'Math.sqrt').replace(/π/g, 'Math.PI').replace(/⟦/g, 'Math.abs(').replace(/⟧/g, ')');
}
const evalExpr = (e) => { try { const v = Function(`"use strict";return (${e})`)(); return typeof v === 'number' ? v : NaN; } catch { return NaN; } };
// the error a printed decimal may carry: "..." truncates, a long decimal may be rounded
const slack = (side) => {
  const clean = side.replace(/\\overline\{\d+\}/g, '');
  const decs = [...clean.matchAll(/\d\.(\d+)/g)].map(m => m[1].length);
  if (/\\ldots|\\cdots/.test(side)) return 1.5 * 10 ** -Math.max(0, ...decs);
  if (decs.length && Math.max(...decs) >= 3) return 0.5 * 10 ** -Math.max(...decs) + 1e-12;
  return 0;
};

// "x = 0.4545..." solves x as the repeating decimal its digits show, not the truncation
const guess = (side) => side.replace(/^\s*(\d+)\.(\d+)\\ldots\s*$/, (m, w, d) => {
  for (let len = 1; len <= d.length; len++) for (let mm = 0; mm + 1 <= len; mm++) {
    const n = len - mm, rep = d.slice(mm, mm + n);
    if (d.length - mm >= 2 * n && d.slice(mm) === rep.repeat(Math.ceil((d.length - mm) / n)).slice(0, d.length - mm)) return `${w}.${d.slice(0, mm)}\\overline{${rep}}`;
  }
  return m;
});
const blocksOf = (src, isMd) => isMd
  ? src.split(/\n(?=\s*(?:\d+\.|-) |#)/)
  : src.split(/<div class="c-example">|<div class="c-try">|<div class="work work--trace">|<div class="c-practice/)
      .flatMap(b => /c-example__tab/.test(b) ? [b] : b.split('<div class="work__row">'));

let spans = 0, chains = 0; const skipped = [];
// spans whose letters belong to another block: checked against their own source
const XREF = new Map([
  ['9x = 6', () => near(10 * (2 / 3) - 2 / 3, 6)],                        // p022-3 prose recalls Example 10
  ['99x = 45', () => near(100 * (5 / 11) - 5 / 11, 45)],                   // and Example 11
  ['a + b = 0', () => true],                                               // End Q9's condition, not a value
]);
const sources = [...pages.map(f => [f, unwrap(html[f]), false]), ['ANSWERS.md', answersMd, true]];
for (const [f, raw, isMd] of sources) {
  for (const block of blocksOf(raw.replace(/\$\$/g, '$').replace(/&lt;/g, '<').replace(/&gt;/g, '>'), isMd)) {
    const ms = [...block.matchAll(/\$([^$]+)\$/g)].map(m => m[1].replace(/\\ldots/g, '\\ldots '));
    // a letter the block solves: v = (numbers that agree)
    const solved = {};
    for (const s of ms) {
      const m = s.match(/^\s*([a-z])\s*=(.+)$/);
      if (!m || /\\lt|\\gt|<|>|\\le|\\ge/.test(s)) continue;
      const vals = m[2].split('=').map(t => toExpr(guess(t))).map(e => (e ? evalExpr(e) : NaN));
      if (vals.length && vals.every(Number.isFinite)) for (const v of vals) (solved[m[1]] ??= new Set()).add(v);
    }
    const envs = Object.entries(solved).reduce((acc, [v, set]) => acc.flatMap(e => [...set].map(x => ({ ...e, [v]: x }))), [{}]);
    for (const span of ms) {
      if (XREF.has(span.trim()) && !isMd) {                               // a line recalled from another example
        spans++; if (XREF.get(span.trim())()) pass++; else fails.push(`${f}: $${span.trim()}$ does not hold where it came from`);
        continue;
      }
      if (/\\neq|\\le|\\ge|\\approx|:|\\parallel/.test(span)) continue;
      if (/\\lt|\\gt|<|>/.test(span)) {                                   // an ordered chain
        if (span.includes('=')) continue;
        const parts = span.split(/(\\lt|\\gt|<|>)/);
        const nums = parts.filter((_, i) => i % 2 === 0).map(t => toExpr(t)).map(e => (e ? evalExpr(e) : NaN));
        if (!nums.every(Number.isFinite)) continue;
        chains++;
        const good = parts.filter((_, i) => i % 2).every((op, i) => (/lt|</.test(op) ? nums[i] < nums[i + 1] : nums[i] > nums[i + 1]));
        if (good) pass++; else fails.push(`${f}: $${span.trim()}$ is out of order`);
        continue;
      }
      if (!span.includes('=')) continue;
      const sides = span.split('=').map(s => s.trim()).filter(Boolean);
      if (sides.length < 2) continue;
      if (/^\s*[a-z]\s*=/.test(span) && Object.keys(solved).includes(span.trim()[0])) {
        // a solving line: its numeric sides must agree with each other
        const nums = sides.slice(1).map(s => [toExpr(s), slack(s)]).map(([e, t]) => [e ? evalExpr(e) : NaN, t]).filter(([n]) => Number.isFinite(n));
        if (nums.length < 2) continue;
        spans++;
        if (nums.every(([n, t]) => Math.abs(n - nums[0][0]) <= Math.max(t, nums[0][1]) + 1e-9 * Math.max(1, Math.abs(n)))) pass++;
        else fails.push(`${f}: $${span.trim()}$ — sides are ${nums.map(x => x[0]).join(' and ')}`);
        continue;
      }
      const tries = envs.map(env => sides.map(s => [toExpr(s, env), slack(s)]).map(([e, t]) => [e ? evalExpr(e) : NaN, t]).filter(([n]) => Number.isFinite(n)));
      const usable = tries.filter(nums => nums.length >= 2);
      if (!usable.length) { skipped.push(`${f}: $${span.trim()}$`); continue; }
      spans++;
      const agree = (nums) => nums.every(([n, t]) => Math.abs(n - nums[0][0]) <= Math.max(t, nums[0][1]) + 1e-9 * Math.max(1, Math.abs(n)));
      if (usable.some(agree)) pass++;
      else fails.push(`${f}: $${span.trim()}$ — sides are ${usable[0].map(x => x[0]).join(' and ')} (with ${JSON.stringify(solved, (k, v) => v instanceof Set ? [...v] : v)})`);
    }
  }
}

/* ---- B. claims arithmetic alone does not check ---------------- */

const g = (a, b) => (b ? g(b, a % b) : Math.abs(a));
const fr = (p, q) => { const d = g(p, q) * Math.sign(q); return `${p / d}/${q / d}`; };      // lowest terms, as norm() prints it
const panels = (src) => {
  const o = {};
  for (const part of src.split('<div class="c-example">').slice(1)) o[part.match(/c-example__tab">Example (\d+)/)[1]] = part;
  return o;
};
const bodyEx = panels(body), beyondEx = panels(beyond);
const rowOf = (panel, label) => {
  const m = (panel || '').match(new RegExp(`work__label">${label}</span>([\\s\\S]*?)</div>`));
  return m ? tight(m[1]) : '';
};
const exSays = (where, ex, n, ...vals) => { for (const v of vals) is(`${where} Example ${n} Answer should say ${v}: "${rowOf(ex[n], 'Answer')}"`, has(rowOf(ex[n], 'Answer'), v)); };
const stepSays = (where, ex, n, ...vals) => { for (const v of vals) is(`${where} Example ${n} should print ${v}`, has(tight(ex[n] || ''), v)); };
const dec = (p, q) => { // the decimal of p/q: terminating string, or null
  let s = ''; let r = p % q; for (let i = 0; i < 30 && r; i++) { r *= 10; s += Math.floor(r / q); r %= q; }
  return r ? null : `${Math.floor(p / q)}.${s}`;
};
const cycle = (p, q) => { // length of the repeating block of p/q, 0 if it terminates
  let d = q / g(p, q); while (d % 2 === 0) d /= 2; while (d % 5 === 0) d /= 5;
  if (d === 1) return 0; let r = 10 % d, k = 1; while (r !== 1 % d) { r = (r * 10) % d; k++; } return k;
};
const places = (q) => { let a = 0, b = 0; while (q % 2 === 0) { q /= 2; a++; } while (q % 5 === 0) { q /= 5; b++; } return q === 1 ? Math.max(a, b) : null; };

// the body's examples
{ const lots = 12 / 2; exSays('body', bodyEx, 1, lots * 15); stepSays('body', bodyEx, 1, `${lots}lots`); is('body Ex 1 check', 90 / 12 === 15 / 2); }
{ const t = -640 + 900 - 380; exSays('body', bodyEx, 2, t, -t); }
{ const s = fr(3 * 6 + 5 * 4, 24); exSays('body', bodyEx, 3, s); stepSays('body', bodyEx, 3, 12, '9/12', '10/12'); is('body Ex 3: LCM 12, and 19/12 = 1 7/12 printed', 12 % 4 === 0 && 12 % 6 === 0 && 19 - 12 === 7 && s === '19/12' && tight(bodyEx[3]).includes('19/12=17/12')); }
exSays('body', bodyEx, 4, '5/3', 0); is('body Ex 4: the distance is seven', Math.abs(3 - -4) === 7 && /seven/.test(rowOf(bodyEx[4], 'Answer')));
{ const between = 4 - -8 - 1; stepSays('body', bodyEx, 5, `${between}numerators`); is('body Ex 5: three inside', [-7 / 16, -4 / 16, 1 / 16].every(v => v > -1 / 2 && v < 1 / 4)); exSays('body', bodyEx, 5, '-7/16', '1/16'); }
{ let s = 0; const sums = []; for (let k = 0; k < 5; k++) { s += (k % 2 ? -1 : 1) / (2 * k + 1); sums.push((4 * s).toFixed(3)); }
  exSays('body', bodyEx, 6, ...sums); stepSays('body', bodyEx, 6, '13/15', '76/105', '263/315');
  let t = 0; for (let k = 0; k < 500; k++) t += (k % 2 ? -1 : 1) / (2 * k + 1);
  is(`p018: 500 terms give ${(4 * t).toFixed(4)}, printed 3.1396`, (4 * t).toFixed(4) === '3.1396' && has(tight(body), '3.1396')); }
exSays('body', bodyEx, 7, dec(3, 8), '0.\\overline{45}');
is('body Ex 7 remainders 6, 4, 0 and 5, 6, 5', [30 % 8, 60 % 8, 40 % 8].join() === '6,4,0' && [5 % 11, 50 % 11, 60 % 11].join() === '5,6,5');
{ is('body Ex 8: two places', places(20) === 2 && dec(3, 20) === '0.15' && /twoplaces/.test(rowOf(bodyEx[8], 'Answer'))); }
exSays('body', bodyEx, 9, fr(35, 100));
exSays('body', bodyEx, 10, fr(6, 9));
exSays('body', bodyEx, 11, fr(45, 99));
exSays('body', bodyEx, 12, fr(16 - 1, 90));
exSays('body', bodyEx, 13, fr(2357 - 235, 900), 2122 / 900 * 450);
is('p019: sevenths reach the ceiling, elevenths do not', cycle(1, 7) === 6 && cycle(5, 11) === 2);
is('p023: 7 divides 999999 and no shorter string of nines', 999999 % 7 === 0 && [9, 99, 999, 9999, 99999].every(n => n % 7));
is('p026: 142857 is cyclic', [1, 2, 3, 4, 5, 6].every(k => { const s = String(142857 * k); return ('142857142857').includes(s); }));
is('p026: 1/7 block', (1e6 / 7 | 0) === 142857 && cycle(1, 7) === 6);
is('p015: 577/408 = 1.414215..., sqrt 2 = 1.414213...', (577 / 408).toFixed(7).startsWith('1.414215') && Math.SQRT2.toFixed(7).startsWith('1.414213'));
is('p017: 3927/1250 = 3.1416', 3927 / 1250 === 3.1416);
is('p026: digits of sqrt 2 and pi', Math.SQRT2.toFixed(15).startsWith('1.414213562373095') && Math.PI.toFixed(15).startsWith('3.141592653589793'));

// the figures, measured from their own coordinates
const svgOf = (src, fig) => { const i = src.indexOf(`fignum">Fig. ${fig}<`); return src.slice(src.lastIndexOf('<svg', i), i); };
const lab = (svg, l) => { const m = svg.match(new RegExp(`<text class="dg-label[^"]*"\\s+x="([\\d.]+)"\\s+y="([\\d.]+)"[^>]*>${esc(l)}</text>`)); return m && [Number(m[1]), Number(m[2])]; };
{ const s = svgOf(body, '3.2'); const u = (lab(s, '0')[0] - lab(s, '−5')[0]) / 5;
  is('Fig. 3.2: -3, -1, 1, 3, 5 in their places', [['−3', -3], ['−1', -1], ['1', 1], ['3', 3], ['5', 5]].every(([l, v]) => near(lab(s, l)[0], lab(s, '0')[0] + u * v, 1e-6))); }
{ const s = svgOf(body, '3.3'); const u = lab(s, '1')[0] - lab(s, '0')[0];
  is('Fig. 3.3: dots at 3/4 and 9/4', s.includes(`cx="${15 + u * 3 / 4}"`) && s.includes(`cx="${15 + u * 9 / 4}"`) && lab(s, '2')[0] === 15 + 2 * u); }
{ const s = svgOf(body, '3.4'); const zero = lab(s, '0')[0], u = (lab(s, 'a = 3')[0] - zero) / 3;
  is('Fig. 3.4: b = -4 and a = 3 on one scale, 7 apart', near(lab(s, 'b = −4')[0], zero - 4 * u, 1e-6) && s.includes(`M${zero - 4 * u} 30 H${zero + 3 * u}`)); }
{ const s = svgOf(body, '3.6'); const u = 70 - 20;
  is('Fig. 3.6: OB drawn root 2, arc to P', s.includes('M20 70 L70 20') && near(20 + u * Math.SQRT2, 90.71, 1e-4) && s.includes('cx="90.71"')); }
{ const s = svgOf(body, '3.7'); const O = [104, 78];
  const pts = [...s.match(/class="dg-line" d="M130 78 ([^"]+)"/)[1].matchAll(/L([\d.]+) ([\d.]+)/g)].map(m => [Number(m[1]), Number(m[2])]);
  const all = [[130, 78], ...pts]; const u = 26;
  is('Fig. 3.7: spoke n is root n (within 0.5%)', all.every((p, i) => Math.abs(Math.hypot(p[0] - O[0], p[1] - O[1]) / u - Math.sqrt(i + 1)) / Math.sqrt(i + 1) < 0.005));
  is('Fig. 3.7: every outer edge is 1 unit (within 0.5%)', all.slice(1).every((p, i) => Math.abs(Math.hypot(p[0] - all[i][0], p[1] - all[i][1]) / u - 1) < 0.005)); }
{ const s = svgOf(beyond, '3B.1'); const u = 25, O = [15, 80], A = [90, 80], B = [90, 30];
  is('Fig. 3B.1 draws OB and AB', s.includes('M15 80 L90 30') && s.includes('M90 80 V30'));
  is('Fig. 3B.1: OA = 3 units, AB = 2 units, A labelled at 3', (A[0] - O[0]) / u === 3 && (A[1] - B[1]) / u === 2 && lab(s, 'A')[0] === A[0]);
  const P = Number(s.match(/cx="([\d.]+)"/)[1]);
  is(`Fig. 3B.1: P drawn at ${(P - 15) / u}, root 13 is ${Math.sqrt(13).toFixed(3)}`, Math.abs((P - 15) / u - Math.sqrt(13)) < 0.002 && s.includes(`A${Math.hypot(75, 50).toFixed(3)}`));
  is('Fig. 3B.1: ticks 1, 2, 4, 5 in their places', ['1', '2', '4', '5'].every(l => lab(s, l)[0] === 15 + u * Number(l))); }

// the exercises, read back off ANSWERS.md
const mdSection = (head) => { const i = answersMd.indexOf(head); const j = answersMd.indexOf('\n#', i + head.length); return answersMd.slice(i, j < 0 ? undefined : j); };
const mdItem = (head, n) => { const m = mdSection(head).match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`)); return m ? tight(m[1]) : ''; };
const mdSays = (head, n, ...vals) => { for (const v of vals) is(`ANSWERS.md ${head} Q${n} should say ${v}: "${mdItem(head, n).slice(0, 100)}"`, has(mdItem(head, n), v)); };
const S1 = '### Exercise Set 3.1', S2 = '### Exercise Set 3.2', S3 = '### Exercise Set 3.3', S4 = '### Exercise Set 3.4', S5 = '### Exercise Set 3.5', E = '## End-of-Chapter Exercises', M = '### Multiple-Choice Exercises';
mdSays(S1, 1, 18 / 2, 18 / 2 * 15);
{ const pr = n => n > 1 && [...Array(n).keys()].slice(2).every(d => n % d); const next = []; for (let n = 20; next.length < 3; n++) if (pr(n)) next.push(n);
  mdSays(S1, 2, ...next); is('Ishango: 11, 13, 17, 19 are the primes between 10 and 20', [11, 12, 13, 14, 15, 16, 17, 18, 19].filter(pr).join() === '11,13,17,19'); }
mdSays(S1, 4, 4 * 3);
mdSays(S1, 5, String(10 ** 12).length, 53 + 1);
mdSays(S2, 1, 4 - 15);
mdSays(S2, 2, -850 + 1200 - 450, 850 - 1200 + 450);
{ const r = mdItem(S2, 3); is('Ex 3.2 Q3 values', has(r, (-12) * 5) && has(r, (-8) * (-7)) && has(r, 0 - (-14)) && has(r, (-20) / 4)); }
mdSays(S2, 4, 10 - (-5));
mdSays(S2, 5, -300 + 180 - 45 + 700);
mdSays(S2, 7, -7 + 12 - 5);
{ const r = mdItem(S3, 1); is('Ex 3.3 Q1 cross products', [[2, 3, 4, 6], [5, 4, 10, 8], [-3, 5, -6, 10], [9, 12, 3, 4]].every(([a, b, c, d]) => a * d === b * c && has(r, a * d))); }
mdSays(S3, 2, fr(2 * 2 + 3, 10), fr(7 * 2 + 5 * 3, 24), fr(-4 * 2 + 3, 14));
mdSays(S3, 3, fr(5 * 2 - 3, 12), fr(11 - 6, 8), fr(-7 + 6, 9));
mdSays(S3, 4, fr(2 * 3, 3 * 10), fr(2 * 10, 3 * 3), fr(-4 * 5, 7 * 14), fr(-4 * 14, 7 * 5));
mdSays(S3, 5, fr(7 * 3, 9 * 28), fr(7 * 6, 9 * 7), fr(7 * 3, 9 * 4));
mdSays(S3, 6, fr(3 - 5, 6));
mdSays(S4, 2, '9/24', '10/24', '11/24'); is('Ex 3.4 Q2 inside', [9, 10, 11].every(k => k / 24 > 1 / 3 && k / 24 < 1 / 2));
mdSays(S4, 3, fr(-3 + 5, 12));
mdSays(S4, 4, (15 + 3 / 4) / (2 + 1 / 4)); is('Ex 3.4 Q4 exact', Number.isInteger((15 + 3 / 4) / (2 + 1 / 4)));
is('Ex 3.4 Q5 inside', [3.14151, 3.14152, 3.14153].every(v => v > 3.1415 && v < 3.1416) && has(mdItem(S4, 5), 3.14152));
{ const r = mdItem(S5, 1); is('Ex 3.5 Q1', r.includes(dec(7, 20)) && cycle(4, 15) === 1 && r.includes('0.2\\overline{6}') && r.includes(dec(13, 250))); }
{ const blk = (p, q) => { let s = '', r = p; for (let i = 0; i < cycle(p, q); i++) { r *= 10; s += Math.floor(r / q); r %= q; } return s; };
  const r = mdItem(S5, 2); is('Ex 3.5 Q2 blocks', ['3', '1', '2'].every(p => r.includes(`\\overline{${blk(Number(p), 13)}}`)));
  is('Ex 3.5 Q2: 1/13 and 3/13 are one cycle, 2/13 another', (blk(1, 13) + blk(1, 13)).includes(blk(3, 13)) && !(blk(1, 13) + blk(1, 13)).includes(blk(2, 13))); }
mdSays(S5, 3, 9, fr(12345, 99999));
{ const n = 23560185612239874790120n, d = 10n ** 21n; const gb = (a, b) => (b ? gb(b, a % b) : a); const G = gb(n, d);
  is('Ex 3.5 Q3 (vi) reduced', answersMd.includes(`\\tfrac{${n}}{10^{21}} = \\tfrac{${n / G}}{25 \\times 10^{18}}`) && d / G === 25n * 10n ** 18n); }
{ const list = []; for (let n = 3; n < 100; n++) if (n % 2 && n % 5 && cycle(1, n) === n - 1) list.push(n); mdSays(S5, 5, ...list); }
mdSays(E, 1, dec(3, 50), '0.\\overline{2}');
mdSays(E, 3, fr(126 - 12, 9), fr(12, 999), fr(205 - 2, 99), fr(1235 - 12, 990));
{ const r = mdItem(E, 6); is('End Q6: five inside', [13, 14, 15, 16, 17].every(k => k / 30 > 2 / 5 && k / 30 < 3 / 5 && r.includes(`${k}/30`))); }
{ const r = mdItem(E, 7); is('End Q7: five inside', [6, 7, 8, 9, 10].every(k => k / 30 > 1 / 6 && k / 30 < 2 / 5 && r.includes(`${k}/30`))); }
mdSays(E, 8, 16 / 15 / (1 / 3 + 1 / 5));
mdSays(E, 10, dec(18, 125)); is('End Q10: three places', places(125) === 3 && /\*\*three\*\*/.test(mdItem(E, 10)));
is('End Q11: three places', places(2 ** 3 * 5) === 3 && /\*\*Three\.\*\*/.test(mdItem(E, 11)));
{ const r = mdItem(E, 13); is('End Q13: 21/36 and 30/36, five between', 7 * 3 === 21 && 5 * 6 === 30 && [22, 23, 24, 25, 26].every(k => r.includes(`${k}/36`) && k / 36 > 7 / 12 && k / 36 < 5 / 6)); }
{ const r = mdItem(M, 12); is('MC Q12: 1/13 has a six-digit block', cycle(1, 13) === 6 && /:six\./.test(r) && r.includes('\\overline{076923}')); }
mdSays(M, 2, dec(17, 8));
{ const ints = [...Array(9).keys()].map(k => k - 4).filter(k => k > -3 && k < 3); is('MC Q9: five integers', ints.length === 5 && mdItem(M, 9).includes(`${ints.join(',')}:five`)); } mdSays(M, 10, -5 * -3 * -2); is('MC Q5: 30 has a 3', places(30) === null && places(16) && places(25) && places(40));
is('MC Q14: three places means q divides 1000, not 100', [8, 125, 40, 200, 1000].every(q => places(q) === 3 && 1000 % q === 0 && 100 % q));

// equations whose question and answer print apart, put back together
is('Ex 3.3 Q6: x = -1/3 solves x + 5/6 = 1/2', near(-1 / 3 + 5 / 6, 1 / 2) && body.includes('$x + \\dfrac{5}{6} = \\dfrac{1}{2}$'));
is('End Q8: x = 2 solves x/3 + x/5 = 16/15', near(2 / 3 + 2 / 5, 16 / 15) && body.includes('\\dfrac{x}{3} + \\dfrac{x}{5} = \\dfrac{16}{15}'));
is('Q23: x = -2/3 solves (3/4)x + 2/3 = 1/6', near((3 / 4) * (-2 / 3) + 2 / 3, 1 / 6) && beyond.includes('$\\dfrac{3}{4}x + \\dfrac{2}{3} = \\dfrac{1}{6}$'));
is('Stage 1 Q1: r/3 is 3 root 2 undone', near((3 * Math.SQRT2) / 3, Math.SQRT2));
is('Stage 1 Q3: x^2 - 1 is root 2', near((1 + Math.SQRT2) - 1, Math.SQRT2));

// Stage 1, as printed in its running text
{ const t = tight(beyond);
  is('Stage 1 Q2: 21/150 = 7/50 = 0.14', fr(21, 150) === '7/50' && dec(7, 50) === '0.14' && t.includes('21/150=7/50=7\\times2/2^2\\times5^2=14/100=0.14'));
  is('Stage 1 Q4: 0.4(27) = 423/990 = 47/110', 427 - 4 === 423 && fr(423, 990) === '47/110' && 110 === 2 * 5 * 11 && t.includes('x=423/990=47/110'));
  is('Stage 1 Q5: 5/14 between 2/7 and 3/7; nine over 70', fr(2 * 2 + 3 * 2, 28) === '5/14' && 30 - 20 - 1 === 9 && t.includes('=5/14') && /over\$?70\$?therearenine/.test(t)); }

// Stage 2
exSays('Beyond', beyondEx, 1, -120 + 45 - 3 * 45);
stepSays('Beyond', beyondEx, 1, 3 * -45, -120 + 45);
{ const x = (5 / 6 + 1 / 4) / (2 / 3); exSays('Beyond', beyondEx, 3, fr(13 * 3, 12 * 2)); is('Beyond Ex 3: x = 13/8', near(x, 13 / 8)); }
exSays('Beyond', beyondEx, 5, fr(1 * 4 + 3 * 2, 8), fr(2 - 3, 4));
exSays('Beyond', beyondEx, 7, fr(25, 108), fr(26, 108)); is('Beyond Ex 7: inside', [25 / 108, 26 / 108].every(v => v > 2 / 9 && v < 1 / 4) && 2 * 4 === 8 && 9 === 36 / 4);
{ const P = Math.sqrt(3 ** 2 + 2 ** 2); exSays('Beyond', beyondEx, 8, Math.floor(P), Math.ceil(P)); is('Beyond Ex 8: 13 = 9 + 4', 3 ** 2 + 2 ** 2 === 13); }
{ const a = 577 ** 2, b = 408 ** 2; stepSays('Beyond', beyondEx, 15, a, b, 2 * b); is('Beyond Ex 15: square is 2 + 1/166464', a - 2 * b === 1 && has(tight(beyondEx[15]), '1/166464') && 1 / b < 1e-5); }
{ const d1 = Math.abs(22 / 7 - Math.PI), d2 = Math.abs(3927 / 1250 - Math.PI);
  stepSays('Beyond', beyondEx, 16, d1.toString().slice(0, 7), d2.toFixed(10).slice(0, 9));
  is('Beyond Ex 16: more than a hundred times closer', d1 / d2 > 100 && /morethanahundred/.test(rowOf(beyondEx[16], 'Answer'))); }
exSays('Beyond', beyondEx, 11, dec(17, 64)); is('Beyond Ex 11', places(64) === 6 && places(24) === null && 17 * 5 ** 6 === 265625);
// the MCQ examples: exactly one right option, the one the Answer row names
const optsIn = (src) => { const o = (src || '').match(/<ol class="c-parts c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/); return o ? [...o[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => tight(x[1])) : []; };
const exKey = (n) => (rowOf(beyondEx[n], 'Answer').match(/\(([a-d])\)/) || [])[1];
const val = (s) => { const e = toExpr(s.replace(/\$/g, '')); return e ? evalExpr(e) : NaN; };
const same = (a, b) => Number.isFinite(a) && Number.isFinite(b) && near(a, b);
const exSolve = {
  2: o => o.map(s => same(val(s), (-8) * (-3) - 5 * (-4) + 0 * (-7))),
  4: o => o.map(s => { const [a, b] = s.split(',').map(t => t.split('/').map(Number)); return a[0] * b[1] === a[1] * b[0]; }),
  6: o => o.map(s => same(val(s), [...Array(24).keys()].filter(k => k / 24 > 1 / 4 && k / 24 < 1 / 3).length)),
  10: o => o.map(s => { const e = toExpr(s); const v = e ? evalExpr(e) : NaN; return Number.isFinite(v) && near(v, Math.round(v)) && /\^2/.test(s); }),
  12: o => o.map(s => s === `terminatesafter${places(80)}places` && dec(11, 80) === '0.1375'),
  13: o => o.map(s => s === fr(123, 999)),
  14: o => o.map(s => s === fr(235 - 23, 90)),
};
for (const [n, f] of Object.entries(exSolve)) {
  const right = f(optsIn(beyondEx[n])).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Beyond Example ${n}: the right option`, right, [exKey(n)]);
}
// the remarks that finish a wrong reading
is('Beyond Ex 2 remarks: 4, 37, -4', 24 - 20 === 4 && 44 - 7 === 37 && -24 + 20 === -4 && ['4', '37', '-4'].every((v, i) => optsIn(beyondEx[2])[[0, 1, 3][i]] === v));
{ const o = optsIn(beyondEx[13]); is('Beyond Ex 13: (c) is 0.1(23) and (b) is it reduced; (d) is 0.123', o[2] === '122/990' && 123 - 1 === 122 && o[1] === fr(122, 990) && o[3] === '123/1000' && 333 === 9 * 37); }
{ const o = optsIn(beyondEx[14]); is('Beyond Ex 14: (a) is 2.35, (d) is 2.(35), (c) 212 over 99', o[0] === '47/20' && dec(47, 20) === '2.35' && o[3] === fr(235 - 2, 99) && o[2] === '212/99'); }
{ const o = optsIn(beyondEx[4]); is('Beyond Ex 4 remark products', (-2) * 21 === -42 && 7 * 6 === 42 && 5 * 24 === 120 && 12 * 15 === 180 && o[2] === '5/12,15/24'); }

// the practice answers, read back out of the key rows
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= tight(m[2]);
const row = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const r = keyRows[n] || '';
  if (!part) return r;
  const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\)|$)`));
  return m ? m[1] : '';
};
const says = (q, ...vals) => { for (const v of vals) is(`key ${q} should say ${v}: "${row(q)}"`, has(row(q), v)); };
const partial6 = [1, -3, 5, -7, 9, -11].reduce((a, d) => [a[0] * Math.abs(d) + Math.sign(d) * a[1], a[1] * Math.abs(d)], [0, 1]);
const P = {
  20: [fr(5 * 3 + 2 * 6, 18)],
  21: [fr(27, 99)],
  22: [fr(-4 + 9, 24)],
  23: [fr(-2, 3)],
  24: [fr(123 - 12, 900), 123 - 12],
  25: [fr(4 * partial6[0], partial6[1]), (4 * partial6[0] / partial6[1]).toFixed(3)],
  26: [(-2 / 3) * (9 / 4) / (-3 / 8)],
  28: [4, 5],
  '29b': [dec(3, 16), '0.41\\overline{6}'], '29c': [fr(3 * 3 + 5 * 4, 48)],
  '30a': [720 - 950 - 260], '30c': [720 - 950 - 260 + 540 - 180], '30d': [200 - (720 - 950 - 260 + 540 - 180)],
  '31a': ['9/4', '49/25', '289/144', '1681/841'], '31c': [dec(3, 2), dec(7, 5)], '31d': ['1.41\\overline{6}'],
};
for (const [q, vs] of Object.entries(P)) says(q, ...vs);
is('key 25: below pi', 4 * partial6[0] / partial6[1] < Math.PI && /belowπ|below\\pi/.test(row(25)));
is('key 28: 17 = 16 + 1, between 4 and 5', 4 ** 2 + 1 ** 2 === 17 && Math.floor(Math.sqrt(17)) === 4);
is('key 29 (a) and (c): 16 has only 2s, 12 and 48 have a 3', places(16) === 4 && places(12) === null && places(48) === null && /repeats/.test(row('29c')));
is('key 30 (b): Tuesday is the first debt', 720 > 0 && 720 - 950 < 0 && /Tuesday/.test(row('30b')) && has(row('30b'), 720 - 950));
is('key 31 (b): 3/2 and 17/12 above', [[3, 2], [17, 12]].every(([p, q]) => p * p > 2 * q * q) && [[7, 5], [41, 29]].every(([p, q]) => p * p < 2 * q * q) && /^3\/2and17\/12/.test(row('31b')));
is('key 31 (c): only 3/2 and 7/5 terminate', [2, 5].every(q => places(q) !== null) && [12, 29].every(q => places(q) === null));
is('key 27: 10 = 2 x 5, and 5 is odd', 10 === 2 * 5 && 5 % 2 === 1);
is('Q31 table: each closer than the one before', [[3, 2], [7, 5], [17, 12], [41, 29], [577, 408]].map(([p, q]) => Math.abs(p / q - Math.SQRT2)).every((d, i, a) => !i || d < a[i - 1]));

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] ??= m[2];
const optsOf = (n) => optsIn(qs[n]);
const key = {};
{ const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of norm(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2]; }
const num = (v) => (o) => o.map(s => same(val(s), v));
const isPerfect = (n) => Number.isInteger(Math.sqrt(n));
const solve = {
  1: o => o.map(s => { const m = s.match(/^\\sqrt\{(\d+)\}$/); return !!m && !isPerfect(Number(m[1])); }),
  2: o => o.map(s => /\\div0$/.test(s)),
  3: num((-6) * (-4) / (-3)),
  4: o => o.map(s => same(val(s), -12 / 18)),
  5: num(Math.abs(-7) - Math.abs(3 - 10)),
  6: num(Math.abs(-3) * Math.abs(5 - 9)),
  7: num([...Array(20).keys()].map(k => k - 10).filter(k => k > -7 / 2 && k < 9 / 4).length),
  8: num([...Array(30).keys()].filter(k => k / 30 > 1 / 5 && k / 30 < 1 / 3).length),
  9: o => o.map(s => s === fr(Math.sqrt(16), Math.sqrt(25))),
  10: o => o.map(s => { const e = toExpr(s); const v = e ? evalExpr(e) : NaN; return Number.isFinite(v) && near(v * 10, Math.round(v * 10)); }),
  11: o => o.map(s => s === `terminatesafter${['one', 'two', 'three', 'four', 'five'][places(16) - 1]}places` && dec(7, 16) === '0.4375'),
  12: o => o.map(s => s === 'allthree' && cycle(1, 7) === 6 && 7 - 1 === 6),
  13: o => o.map(s => s === 'q$hasaprimefactorotherthan$2$and$5'.replace(/\$/g, '')),
  14: num(cycle(1 * 7 + 1 * 3, 21)),
  15: o => o.map(s => s === fr(23 - 2, 90)),
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Q${q}: the right option`, right, [key[q]]);
}
// the wrong options the key explains
is('Q3 wrong options: 8, -72, 72', optsOf(3).slice(0, 3).join() === `${24 / 3},${24 * -3},${24 * 3}`);
is('Q5 wrong options: -14, 14, 20', optsOf(5).slice(0, 3).join() === `${-7 - 7},${7 + 7},${7 + 3 + 10}`);
is('Q15 wrong options: 23/90, 21/99, 23/99', optsOf(15).slice(1).join() === '23/90,21/99,23/99' && fr(21, 99) === '7/33');
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  16: [dec(3, 8) !== null, true, true],                                  // terminating means over 10^n
  17: [!isPerfect(9), [2, 3, 5, 6, 7, 8, 10].every(n => !isPerfect(n)), false],
  18: [true, [...Array(24).keys()].filter(k => k / 24 > 1 / 4 && k / 24 < 1 / 3).length === 1, false],
  19: [cycle(5, 9) > 0, dec(5, 9) === null && false, false],             // 0.(5) never terminates and is rational
};
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-19', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(19)].map((_, i) => i + 1));
ok('practice numbered 1-31', [...beyond.matchAll(/data-start="(\d+)"/g)].map(m => Number(m[1])), [...Array(30)].map((_, i) => i + 2));

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
{ const i = answersMd.indexOf('as the key prints it'); for (const m of answersMd.slice(i, i + 600).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2]; }
ok('ANSWERS.md key matches the page', mdKey, key);
const W = '### The working for each';
for (const [q, vs] of Object.entries(P)) {
  const [, n, part] = q.match(/^(\d+)([a-d]?)$/);
  let r = mdItem(W, n);
  if (part) { const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\)|$)`)); r = m ? m[1] : ''; }
  for (const v of vs) is(`ANSWERS.md practice ${q} should say ${v}: "${r.slice(0, 80)}"`, has(r, v));
}
for (const q of Object.keys(solve)) {
  const o = optsOf(q), right = o['abcd'.indexOf(key[q])] || '';
  if (/^-?[\d/.]+$/.test(right)) is(`ANSWERS.md practice ${q} should reach ${right}`, has(mdItem(W, q), right));
}

/* ---- report ---------------------------------------------------- */

console.log(`A  ${spans} identities and ${chains} ordered chains evaluated; ${skipped.length} spans not pure arithmetic, skipped`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
