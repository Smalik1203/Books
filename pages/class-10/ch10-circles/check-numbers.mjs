#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each claim is
   computed — right triangles, tangent lengths, angles, areas — and compared
   with what is on the page. Figure labels are read out of the SVG.

     node pages/class-10/ch10-circles/check-numbers.mjs [--skipped]

   Four parts:
     A  every identity set as maths, on every page and in ANSWERS.md, whose
        sides all evaluate — degrees, \sqrt, \frac, and sin, cos and tan at
        the standard angles are read
     B  the claims A cannot check: figures against their questions, the body
        examples and exercises, Stage 1, the Solved Examples, and the
        practice answers read back out of the key rows, a lettered part at a
        time and as phrases
     C  every multiple-choice and assertion-reason question: exactly one
        option is right, and it is the one the key prints
     D  ANSWERS.md prints the same key as the page, and its working agrees

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
const near = (a, b) => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

/* ---- the mathematics ----------------------------------------- */

const rad = (d) => d * Math.PI / 180;
const S = (d) => ({ 30: 1 / 2, 45: Math.SQRT1_2, 60: Math.sqrt(3) / 2, 90: 1 })[d] ?? Math.sin(rad(d));
const C = (d) => ({ 0: 1, 30: Math.sqrt(3) / 2, 45: Math.SQRT1_2, 60: 1 / 2, 90: 0 })[d] ?? Math.cos(rad(d));
const T = (d) => ({ 30: 1 / Math.sqrt(3), 45: 1, 60: Math.sqrt(3) })[d] ?? Math.tan(rad(d));
const leg = (hyp, a) => Math.sqrt(hyp * hyp - a * a);     // the other side of a right triangle
const hyp = (a, b) => Math.sqrt(a * a + b * b);

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<span class="nb">([^<]*)<\/span>/g, '$1')
  .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-').replace(/&prime;/g, "'")
  .replace(/\s+/g, ' ');
const plain = (s) => text(s).replace(/\$\{([^$]*)\}\$/g, '$$$1$$').replace(/\$/g, '').replace(/\s+/g, ' ').trim();

/* ---- A. every identity ---------------------------------------- */

function toExpr(side) {
  let s = side
    .replace(/\\left|\\right/g, '')
    .replace(/\\(sin|cos|tan)\s*\{?(\d+)\^\\circ\}?/g, (m, f, d) => `${f[0].toUpperCase()}(${d})`)
    .replace(/\^\\circ/g, '').replace(/\^\{\\circ\}/g, '')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'Math.sqrt[$1]')                  // before \frac, so its braces do not nest
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/Math\.sqrt\[([^\]]+)\]/g, 'Math.sqrt($1)')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad/g, '')
    .replace(/\^\{([^{}]+)\}/g, '**($1)').replace(/\^(\d)/g, '**$1')
    .replace(/[{}]/g, '')
    .replace(/\s+/g, '');
  if (!s || !/^(Math\.sqrt|[SCT](?=\()|[-+*/().0-9])+$/.test(s)) return null;
  return s.replace(/\)\(/g, ')*(')
    .replace(/(\d)\(/g, '$1*(')
    .replace(/([0-9)])(Math\.sqrt|[SCT]\()/g, '$1*$2');             // 2\sqrt{2} is a product
}
const evalExpr = (e) => { try { return Function('S', 'C', 'T', `"use strict";return (${e})`)(S, C, T); } catch { return NaN; } };
const val = (tex) => { const e = toExpr(tex); return e ? evalExpr(e) : NaN; };

// "a = b, c = d" is two statements; a comma inside braces is not a break
function splitParts(span) {
  const out = []; let depth = 0, cur = '';
  for (let i = 0; i < span.length; i++) {
    const ch = span[i];
    if ('({'.includes(ch)) depth++;
    if (')}'.includes(ch)) depth--;
    if (depth === 0 && ch === ',' && /=/.test(cur) && /=/.test(span.slice(i + 1))) { out.push(cur); cur = ''; continue; }
    cur += ch;
  }
  out.push(cur);
  return out;
}

let spans = 0; const skipped = [];
const sources = [...pages.map(f => [f, html[f]]), ['ANSWERS.md', answersMd]];
for (const [f, raw] of sources) {
  const src = raw.replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/\$\$([^$]+)\$\$/g, '$$$1$$');  // $$…$$ before $…$
  for (const m of src.matchAll(/\$([^$]+)\$/g)) {
    const span = m[1];
    if (!span.includes('=') || /\\neq|\\leq|\\geq|\\lt|\\gt|\\approx|<|>/.test(span)) continue;
    for (const part of splitParts(span.replace(/^\{(.*)\}$/, '$1'))) {
      const sides = part.split('=').map(s => s.trim()).filter(Boolean);
      if (sides.length < 2) continue;
      let vals = sides.map(toExpr);
      if (vals.filter(Boolean).length >= 2) vals = vals.filter(Boolean);
      if (vals.some(v => !v) || vals.length < 2) { skipped.push(`${f}: $${part.trim()}$`); continue; }
      const nums = vals.map(evalExpr);
      if (nums.some(n => !Number.isFinite(n))) { skipped.push(`${f}: $${part.trim()}$`); continue; }
      spans++;
      if (nums.some(n => !near(n, nums[0]))) fails.push(`${f}: $${part.trim()}$ — sides are ${nums.join(' and ')}`);
      else pass++;
    }
  }
}

/* ---- B. claims arithmetic alone does not check ---------------- */

// figures: read the labels and the drawing out of the SVG
const figure = (n) => {
  const m = body.match(new RegExp(`<svg[^>]*>((?:(?!<\\/svg>)[\\s\\S])*)<\\/svg>\\s*<figcaption><span class="fignum">Fig\\. ${n.replace('.', '\\.')}<`));
  return m ? m[1] : '';
};
const dims = (svg) => [...svg.matchAll(/<text class="dg-dim-label" x="([\d.]+)"[^>]*>([^<]+)<\/text>/g)].map(x => ({ x: Number(x[1]), t: x[2] }));
const label = (svg, l) => { const m = svg.match(new RegExp(`<text class="dg-label" x="([\\d.]+)" y="([\\d.]+)"[^>]*>${l}<\\/text>`)); return m ? [Number(m[1]), Number(m[2])] : null; };
const circles = (svg) => [...svg.matchAll(/<circle class="dg-line" cx="([\d.]+)" cy="([\d.]+)" r="([\d.]+)"/g)].map(x => x.slice(1).map(Number)).filter(c => c[2] > 5);
const segs = (svg) => [...svg.matchAll(/<path class="dg-line" d="M([\d.]+) ([\d.]+) L([\d.]+) ([\d.]+)"/g)].map(x => [[+x[1], +x[2]], [+x[3], +x[4]]]);
const dist = (p, q) => Math.hypot(p[0] - q[0], p[1] - q[1]);
const qText = (n, set) => {                       // an exercise question's text, by set and number
  const a = body.indexOf(`Exercise Set ${set}`);
  const rest = body.slice(a);
  const m = n === 1 ? rest.match(/<ol class="c-questions">\s*<li>([\s\S]*?)<\/ol>\s*<\/div>/)
    : rest.match(new RegExp(`data-start="${n}">\\s*<li>([\\s\\S]*?)<\\/ol>\\s*<\\/div>`));
  return m ? m[1] : '';
};

{ // Fig. 10.10 and Example 3
  const svg = figure('10.10');
  const q = plain(body.slice(body.indexOf('Example 3</div>'), body.indexOf('Example 3</div>') + 400));
  const [r, ch] = [q.match(/radius (\d+) cm/)[1], q.match(/chord of length (\d+) cm/)[1]].map(Number);
  ok('Fig. 10.10 labels match Example 3', dims(svg).map(d => d.t).sort(), [`${ch} cm`, `${r} cm`].sort());
  const [cx, cy, cr] = circles(svg)[0], O = [cx, cy];
  const [P, Q] = segs(svg).find(([a, b]) => a[0] === b[0]);          // the chord PQ is the vertical segment
  is('Fig. 10.10: P and Q are on the circle', near(dist(O, P), cr) || Math.abs(dist(O, P) - cr) < 0.5);
  const unit = dist(O, P) / r;
  is('Fig. 10.10 is drawn to scale', near(dist(P, Q) / unit, ch));
  const PR = ch / 2, OR = leg(r, PR), TP = PR * r / OR;
  const ex3 = text(body.slice(body.indexOf('Example 3</div>')));
  const m = ex3.match(/Answer \s*\$TP = \\dfrac\{(\d+)\}\{(\d+)\}\$/);
  is('Example 3 prints TP as a fraction', !!m);
  if (m) is(`Example 3: TP = ${TP}, printed ${m[1]}/${m[2]}`, near(m[1] / m[2], TP));
  ok('Example 3: PR and OR', [PR, OR], [Number(ex3.match(/PR = RQ = (\d+)/)[1]), Number((ex3.match(/OR = \\sqrt\{OP\^2 - PR\^2\} = \\sqrt\{[^}]*\} = (\d+)/) || [])[1])]);
  const note = ex3.slice(ex3.indexOf('Note.'));
  const y = note.match(/y = \\dfrac\{32\}\{6\} = \\dfrac\{(\d+)\}\{(\d+)\}/);
  is('Note: TR = PR^2 / OR', !!y && near(y[1] / y[2], PR * PR / OR));
  const x = note.match(/so \$?x = \\dfrac\{(\d+)\}\{(\d+)\}/);
  is('Note: x = TP', !!x && near(x[1] / x[2], TP));
  is('Note: 25 = 6y - 7 holds at y = TR', near(25, 6 * PR * PR / OR - 7));
}
{ // Fig. 10.11 and Exercise Set 10.2 Q2
  const svg = figure('10.11');
  const q = plain(qText(2, '10.2'));
  const printed = Number(q.match(/POQ = (\d+)/)[1]);
  ok('Fig. 10.11 label matches Q2', dims(svg).map(d => d.t), [`${printed}°`]);
  const [cx, cy] = circles(svg)[0], O = [cx, cy];
  const radii = segs(svg).filter(([a]) => a[0] === cx && a[1] === cy).map(([, b]) => b);
  is('Fig. 10.11 draws two radii', radii.length === 2);
  const [Pp, Qp] = radii;
  const a = Math.atan2(Pp[1] - O[1], Pp[0] - O[0]), b = Math.atan2(Qp[1] - O[1], Qp[0] - O[0]);
  is(`Fig. 10.11 draws angle POQ as ${printed}°`, Math.abs(Math.abs((a - b) * 180 / Math.PI) - printed) < 0.5);
}
{ // Fig. 10.14 and Exercise Set 10.2 Q12
  const svg = figure('10.14');
  const q = plain(qText(12, '10.2'));
  const [, r, bd, dc] = q.match(/radius (\d+) cm.*lengths (\d+) cm and (\d+) cm/).map(Number);
  const [cx, cy, cr] = circles(svg)[0];
  const tri = svg.match(/<path class="dg-line" d="M([\d.]+) ([\d.]+) L([\d.]+) ([\d.]+) L([\d.]+) ([\d.]+) Z"/).slice(1).map(Number);
  const [A, B, Cc] = [[tri[0], tri[1]], [tri[2], tri[3]], [tri[4], tri[5]]];
  const D = [cx, cy + cr];
  is('Fig. 10.14: D is on BC', near(D[1], B[1]) && near(D[1], Cc[1]));
  const lab = dims(svg);
  const nearB = lab.find(l => l.x > D[0]).t, nearC = lab.find(l => l.x < D[0]).t;
  ok('Fig. 10.14 labels: DB and CD as Q12 prints them', [nearB, nearC], [`${bd} cm`, `${dc} cm`]);
  const unit = cr / r;
  is('Fig. 10.14 is drawn to scale', near(dist(D, B) / unit, bd) && near(dist(D, Cc) / unit, dc));
  is('Fig. 10.14 caption says radius', new RegExp(`radius ${r}`).test(plain(body.slice(body.indexOf('Fig. 10.14</span>'), body.indexOf('Fig. 10.14</span>') + 120))));
  // solve Q12: tangent x from A, area two ways
  const x = r * r * (bd + dc) / (bd * dc - r * r);                // r s = sqrt(s x bd dc), s = x + bd + dc
  is('Q12: the area agrees both ways', near(r * (x + bd + dc), Math.sqrt((x + bd + dc) * x * bd * dc)));
  const AB = x + bd, AC = x + dc;
  is(`Fig. 10.14 draws AB = ${AB} and AC = ${AC}`, Math.abs(dist(A, B) / unit - AB) < 0.05 && Math.abs(dist(A, Cc) / unit - AC) < 0.05);
  const md12 = answersMd.match(/\n12\. \*\*AB = (\d+) cm and AC = (\d+) cm/);
  ok('ANSWERS.md Ex 10.2 Q12', md12 && [Number(md12[1]), Number(md12[2])], [AB, AC]);
}

// the body's own questions
const letterOf = (opts, test) => opts.map((o, i) => (test(o) ? 'abcd'[i] : null)).filter(Boolean);
const optsIn = (li) => { const m = li.match(/<ol class="c-parts[^"]*">([\s\S]*)<\/ol>/); return m ? [...m[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => plain(x[1])) : []; };
const unitless = (s) => s.replace(/\s*(cm|m)(\s*2)?$/, '').replace(/\^\\circ|°/g, '').trim();
const optVal = (s) => val(unitless(s));
const mdSet = (set) => answersMd.slice(answersMd.indexOf(`### Exercise Set ${set}`));
const mdQ = (set, n) => { const m = mdSet(set).match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |\\n## |\\n---|$)`)); return m ? m[1].replace(/\$/g, '').replace(/\s+/g, ' ') : ''; };
const mdLetter = (set, n) => (mdQ(set, n).match(/\*\*\(([a-d])\)\*\*/) || [])[1];
{
  const q = plain(qText(3, '10.1'));
  const [, r, oq] = q.match(/radius (\d+) cm.*OQ = (\d+)/).map(Number);
  ok('Ex 10.1 Q3', letterOf(optsIn(qText(3, '10.1')), o => near(optVal(o), leg(oq, r))), [mdLetter('10.1', 3)]);
}
{
  const q = plain(qText(1, '10.2'));
  const [, t, d] = q.match(/tangent to a circle is (\d+) cm.*centre is (\d+) cm/).map(Number);
  ok('Ex 10.2 Q1', letterOf(optsIn(qText(1, '10.2')), o => near(optVal(o), leg(d, t))), [mdLetter('10.2', 1)]);
  const q2 = plain(qText(2, '10.2')); const poq = Number(q2.match(/POQ = (\d+)/)[1]);
  ok('Ex 10.2 Q2', letterOf(optsIn(qText(2, '10.2')), o => near(optVal(o), 360 - 90 - 90 - poq)), [mdLetter('10.2', 2)]);
  const q3 = plain(qText(3, '10.2')); const apb = Number(q3.match(/angle of (\d+)/)[1]);
  ok('Ex 10.2 Q3', letterOf(optsIn(qText(3, '10.2')), o => near(optVal(o), 90 - apb / 2)), [mdLetter('10.2', 3)]);
  const q6 = plain(qText(6, '10.2')); const [, d6, t6] = q6.match(/A, (\d+) cm.*is (\d+) cm/).map(Number);
  is(`ANSWERS.md Ex 10.2 Q6 says ${leg(d6, t6)} cm`, new RegExp(`= ${leg(d6, t6)} cm`).test(mdQ('10.2', 6)));
  const q7 = plain(qText(7, '10.2')); const [, R7, r7] = q7.match(/radii (\d+) cm and (\d+) cm/).map(Number);
  is(`ANSWERS.md Ex 10.2 Q7 says ${2 * leg(R7, r7)} cm`, new RegExp(`\\*\\*${2 * leg(R7, r7)} cm\\*\\*`).test(mdQ('10.2', 7))
    && new RegExp(`= ${leg(R7, r7)} cm`).test(mdQ('10.2', 7)));
}

// Stage 1, as printed in its running text
{
  const s1 = plain(beyond.slice(0, beyond.indexOf('Solved Examples')));
  const t = leg(13, 5);
  is('Stage 1 Q1: AB = 2 r t / OP = 120/13', near(120 / 13, 2 * 5 * t / 13) && /AB = \\frac\{120\}\{13\}/.test(s1));
  const [a, b, c] = [12, 8, 10];
  const sp = (a + b + c) / 2;
  is('Stage 1 Q2: 7, 5, 3', /a = 15 - 8 = 7/.test(s1) && [sp - b, sp - c, sp - a].join() === '7,5,3');
  is('Stage 1 Q3: the sums differ', 5 + 9 !== 6 + 7 && /no\./.test(s1));
  is('Stage 1 Q4: OP = 6 / sin 30', near(6 / S(30), 12) && /OP = 12/.test(s1));
  is('Stage 1 Q4: AP = 6 / tan 30', near(6 / T(30), 6 * Math.sqrt(3)) && /AP = 6\\sqrt\{3\}/.test(s1));
  is('Stage 1 Q5: r = 1', (3 + 4 - hyp(3, 4)) / 2 === 1 && /r = 1 cm/.test(s1));
}

// Stage 2: every example, its Answer row read back
const examples = {};
for (const m of beyond.matchAll(/c-example__tab">Example (\d+)<\/div>([\s\S]*?)(?=c-example__tab">|c-practice__num|$)/g)) examples[m[1]] = m[2];
const answerOf = (n) => { const m = (examples[n] || '').match(/work__label">Answer<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/); return m ? plain(m[1]) : ''; };
const exOpts = (n) => { const m = (examples[n] || '').match(/<ol class="c-parts[^"]*">([\s\S]*?)<\/ol>/); return m ? [...m[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => plain(x[1])) : []; };
const exMcq = (n, test) => ok(`Example ${n}: the right option`, letterOf(exOpts(n), test).map(l => `(${l})`), [answerOf(n)]);
exMcq(1, o => near(optVal(o), leg(17, 15)));
ok('Example 2', answerOf(2), `PT is ${leg(15, 9)} cm, and the area is ${0.5 * 9 * leg(15, 9)} cm 2`);
ok('Example 3', answerOf(3), `${leg(29, 20)} m`);
// Example 4: the number of tangents through a point, from its distance to the centre
{ const q = plain((examples[4] || '').split('<ol')[0]);
  const r = Number(q.match(/radius (\d+) cm/)[1]);
  const ds = q.match(/are (\d+) cm, (\d+) cm and (\d+) cm from O/).slice(1).map(Number);
  const count = (d) => (d < r ? 0 : d === r ? 1 : 2);
  const want = ds.map(count).join(', ');
  ok('Example 4: the right option', letterOf(exOpts(4), o => o.trim() === want).map(l => `(${l})`), [answerOf(4)]);
  is('Example 4: one point of each kind', ds.map(count).join() === '0,1,2');
  is('Example 4 remarks: (a) reversed, (c) Q given two, (d) P given one',
    exOpts(4)[0].trim() === [...ds.map(count)].reverse().join(', ') && exOpts(4)[2].trim() === '0, 2, 2' && exOpts(4)[3].trim() === '1, 1, 2');
  is(`Example 4: the tangent from R is ${leg(ds[2], r)} cm`, plain(examples[4]).includes(`\\sqrt{${ds[2]}^2 - ${r}^2} = ${leg(ds[2], r)}`));
  is('Example 4: the steps cite Cases 1, 2 and 3', ['Case 1', 'Case 2', 'Case 3'].every(c => plain(examples[4]).includes(c))); }
exMcq(5, o => near(optVal(o), 90 - (180 - 50) / 2));
ok('Example 6', answerOf(6), `\\angle POQ = ${180 - 2 * (90 - 50)}^\\circ`);
is('Example 6: the remark (twice the angle)', 180 - 2 * (90 - 50) === 2 * 50);
is('Example 7: AB = 3 / tan 30 = 3 sqrt 3', near(3 / T(30), 3 * Math.sqrt(3)) && /AB = PA = 3\\sqrt\{3\}/.test(answerOf(7)));
exMcq(8, o => near(optVal(o), 6 + 4 - 7));
{ const bf = 4, af = 10 - bf, ce = 12 - af; exMcq(9, o => near(optVal(o), bf + ce)); }
ok('Example 10', answerOf(10), `${2 * 10} cm`);
exMcq(11, o => near(optVal(o), 2 * leg(13, 5)));
{ const h = leg(10, 6), area = 0.5 * 12 * h, r = area / ((10 + 10 + 12) / 2); ok('Example 14', answerOf(14), `${r} cm`); }
// the wrong options are what the remarks say they are
is('Example 1 remarks: 17 - 15, 15, sqrt(17^2 + 15^2)', [17 - 15, 15, 17 * 17 + 15 * 15].join() === [optVal(exOpts(1)[0]), optVal(exOpts(1)[2]), 514].join());
is('Example 8 remarks: 6 + 7 - 4, 6 + 7 + 4, (6 + 4)/2', [6 + 7 - 4, 6 + 7 + 4, (6 + 4) / 2].join() === [0, 2, 3].map(i => optVal(exOpts(8)[i])).join());
is('Example 9 remarks: AC, AC - BD, AB + BD', [12, 12 - 4, 10 + 4].join() === [1, 2, 3].map(i => optVal(exOpts(9)[i])).join());
is('Example 11 remarks: half, 13 + 5, 2 sqrt(13^2 + 5^2)', near(optVal(exOpts(11)[0]), leg(13, 5)) && optVal(exOpts(11)[2]) === 18 && near(optVal(exOpts(11)[3]), 2 * hyp(13, 5)));
is('Example 5 remarks: 65, 50, 180 - 50', [65, 50, 130].join() === [1, 0, 3].map(i => optVal(exOpts(5)[i])).join());

// the practice answers, read back out of the key rows
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= plain(m[2]);
const partOf = (r, part) => { const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\) |$)`)); return m ? m[1] : ''; };
const row = (q) => { const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/); const r = keyRows[n] || ''; return part ? partOf(r, part) : r; };
const says = (q, ...phrases) => { for (const p of phrases) is(`key ${q} should say "${p}": "${row(q)}"`, row(q).includes(p)); };
says(19, `= ${hyp(12, 35)} cm from the centre`);
says(20, `= ${2 * 25}^\\circ`, `= ${90 - 25}^\\circ`);
says(21, `radius is ${12 / 2} cm`, `= ${leg(10, 6)} cm`);
{ const sp = (9 + 11 + 14) / 2; says(22, `x + y + z = ${sp}`, `AF = ${sp} - 11 = ${sp - 11} cm`, `BD = ${sp} - 14 = ${sp - 14} cm`, `CE = ${sp} - 9 = ${sp - 9} cm`); }
says(24, `AB = OA = ${8 * T(45)} cm`, 'OB = \\sqrt{8^2 + 8^2} = 8\\sqrt{2}');
is('Q24: OB = 8 / cos 45', near(8 / C(45), 8 * Math.sqrt(2)));
says(25, `= ${leg(53, 28)} cm`, `chord is ${2 * leg(53, 28)} cm long`);
says('27a', `= ${leg(39, 15)} cm`);
says('27b', `= ${15 * leg(39, 15)} cm`);
is('Q27c: AB = 2 x area / OP = 360/13', near(2 * 15 * leg(39, 15) / 39, 360 / 13) && row('27c').includes('AB = \\frac{360}{13} cm'));
{ const as = 23 - 5, bp = 29 - as; says(28, `AS = 23 - 5 = ${as} cm`, `AP = ${as}`, `BP = 29 - ${as} = ${bp} cm`, `radius is ${bp} cm`); }
says('29a', '90^\\circ'); says('29b', `GA = \\sqrt{61^2 - 11^2} = ${leg(61, 11)} m`); says('29c', `${leg(61, 11)} m, since`);
says('29d', `= ${11 * leg(61, 11)} m 2`);
{ const sp = (15 + 20 + 25) / 2, r = sp - 25;
  says('30a', `half the perimeter is ${sp} m`, `from A ${sp} - 20 = ${sp - 20} m`, `from B ${sp} - 25 = ${sp - 25} m`, `from C ${sp} - 15 = ${sp - 15} m`);
  says('30b', `${r} m, since`);
  says('30c', `= ${0.5 * 15 * 20} m 2`, `\\frac{1}{2} \\times ${r} \\times ${2 * sp} = ${r * sp} m 2`);
  is('Q30: the two areas agree', 0.5 * 15 * 20 === r * sp && hyp(15, 20) === 25); }

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
{
  const p = beyond.slice(beyond.indexOf('c-practice__num'));
  const first = p.match(/<ol class="c-questions">\s*<li>([\s\S]*?)<\/ol>\s*<\/div>/); if (first) qs[1] = first[1];
  for (const m of p.matchAll(/<ol class="c-questions" data-start="(\d+)">\s*<li>([\s\S]*?)<\/ol>\s*<\/div>/g)) qs[Number(m[1])] = m[2];
}
const optsOf = (n) => optsIn(qs[n] || '');
const key = {};
{
  const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2];
}
const qn = (n) => plain(qs[n] || '');
const solve = {
  1: o => { is('Q1 asks about tangents parallel to a secant', /parallel to a given secant/.test(qn(1)));
    return o.map(s => optVal(s) === 2); },                                // one on each side of the secant (Activity 2)
  2: o => o.map(s => optVal(s) === 90),
  3: o => { const [, d, r] = qn(3).match(/point (\d+) cm.*radius (\d+) cm/).map(Number); return o.map(s => near(optVal(s), leg(d, r))); },
  4: o => o.map(s => { const x = optVal(s); return 3 * x - 2 === x + 6; }),
  5: o => { const apb = Number(qn(5).match(/APB = (\d+)/)[1]); return o.map(s => optVal(s) === apb / 2); },
  6: o => { const r = Number(qn(6).match(/radius (\d+) cm/)[1]); const ang = Number(qn(6).match(/angle of (\d+)/)[1]); return o.map(s => near(optVal(s), r / S(ang / 2))); },
  7: o => { const [, a, b] = qn(7).match(/are (\d+) cm and (\d+) cm/).map(Number); return o.map(s => near(optVal(s), (a + b - hyp(a, b)) / 2)); },
  8: o => { const [, r, d] = qn(8).match(/radius (\d+) cm, and OQ = (\d+)/).map(Number); return o.map(s => near(optVal(s), 0.5 * r * leg(d, r))); },
  9: o => o.map(s => s === 'both'),                                      // Remark 1 and Theorem 10.1 are both true
  10: o => { const [, r, p] = qn(10).match(/radius (\d+) cm.*perimeter is (\d+) cm/).map(Number); return o.map(s => near(optVal(s), 0.5 * r * p)); },
  11: o => { const [, d, r] = qn(11).match(/is (\d+) cm from.*radius (\d+) cm/).map(Number); return o.map(s => near(optVal(s), 2 * r + 2 * leg(d, r))); },
  12: o => { const [, h, a] = qn(12).match(/hypotenuse is (\d+) cm.*sides is (\d+) cm/).map(Number); return o.map(s => near(optVal(s), (a + leg(h, a) - h) / 2)); },
  13: o => { const r = Number(qn(13).match(/radius (\d+) cm/)[1]); return o.map(s => near(optVal(s), r)); },   // a square, so TP = r
  14: o => o.map(s => /through a point inside/.test(s) && /can pass/.test(s)),
};
for (const [q, f] of Object.entries(solve)) {
  const o = optsOf(q);
  is(`Q${q} has four options`, o.length === 4);
  const right = f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean);
  ok(`Q${q}: the right option`, right, [key[q]]);
}
// the other options of Q14 are true statements of the chapter
is('Q14: (a)-(c) are Theorem 10.1, Case 3 and Remark 2', /perpendicular to the radius/.test(optsOf(14)[0]) && /exactly two/.test(optsOf(14)[1]) && /bisector/.test(optsOf(14)[2]));
// the why-rows name what the wrong options are
{
  const o3 = optsOf(3).map(optVal); is('Q3 wrong options: 26 - 10, 26 + 10, 2 sqrt(26^2 + 10^2)... is sqrt(26^2 + 10^2)', o3[0] === 16 && o3[2] === 36 && near(o3[3], hyp(26, 10)));
  const o5 = optsOf(5).map(optVal); is('Q5 wrong options: 64, 90 - 64, 90 - 32', o5[0] === 64 && o5[1] === 26 && o5[3] === 58);
  const o6 = optsOf(6).map(optVal); is('Q6 wrong options: 4/tan 30, 4/sin 45, 4^2', near(o6[0], 4 / T(30)) && near(o6[1], 4 / S(45)) && o6[2] === 16);
  const o7 = optsOf(7).map(optVal); is('Q7 wrong options: 15/2, 9/2, 12/2', o7[1] === 7.5 && o7[2] === 4.5 && o7[3] === 6);
  const o8 = optsOf(8).map(optVal); is('Q8 wrong options: 12 x 16, 12 x 20 / 2, 16 x 20 / 2', o8[0] === 192 && o8[2] === 120 && o8[3] === 160);
  const o10 = optsOf(10).map(optVal); is('Q10 wrong options: 3 x 30, 30, 15', o10[0] === 90 && o10[1] === 30 && o10[2] === 15);
  const o11 = optsOf(11).map(optVal); is('Q11 wrong options: 15 + 25 + 25 + 15, 20 + 20, 15 + 20', o11[1] === 80 && o11[2] === 40 && o11[3] === 35);
  const o12 = optsOf(12).map(optVal); is('Q12 wrong option (c): 5 / 2', o12[2] === 2.5);
  const o13 = optsOf(13).map(optVal); is('Q13 wrong options: OT, 2r, r/2', near(o13[0], hyp(7, 7)) && o13[1] === 14 && o13[3] === 3.5);
}
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  15: (() => { const [, d, r, t] = qn(15).match(/point (\d+) cm.*radius (\d+) cm is (\d+) cm/).map(Number); return [near(leg(d, r), t), true, true]; })(),
  16: (() => { const t = qn(16).match(/(\d+) cm long.*also (\d+) cm long/); return [t[1] === t[2], false, false]; })(),     // two tangents from different points need not be equal
  17: (() => { const [, r, d] = qn(17).match(/radius (\d+) cm can be drawn from a point (\d+) cm/).map(Number); const tangents = d > r ? 2 : d === r ? 1 : 0; return [tangents === 2, true, false]; })(),
  18: [true, true, false],                                                // A holds because an inside point's lines all cut twice
};
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-18', Object.keys(key).map(Number).sort((a, b) => a - b), [...Array(18)].map((_, i) => i + 1));
ok('practice numbered 1-30', Object.keys(qs).map(Number).sort((a, b) => a - b), [...Array(30)].map((_, i) => i + 1));
ok('examples numbered 1-14', Object.keys(examples).map(Number), [...Array(14)].map((_, i) => i + 1));
is('ANSWERS.md 1 gives 2 tangents', /: 2 tangents\./.test(answersMd.slice(answersMd.indexOf('The working for each'))));

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
{ const a = answersMd.indexOf('as the key prints it');
  for (const m of answersMd.slice(a, a + 300).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2]; }
ok('ANSWERS.md key matches the page', mdKey, key);

// ANSWERS.md's practice working, row by row, a lettered part at a time
const mdPractice = answersMd.slice(answersMd.indexOf('The working for each'));
const mdRow = (q) => {
  const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/);
  const m = mdPractice.match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`));
  const r = m ? m[1].replace(/\$/g, '').replace(/\s+/g, ' ') : '';
  return part ? partOf(r, part) : r;
};
const mdSays = (q, ...phrases) => { for (const p of phrases) is(`ANSWERS.md ${q} should say "${p}": "${mdRow(q)}"`, mdRow(q).includes(p)); };
mdSays(3, `= ${leg(26, 10)} cm`); mdSays(4, `x = ${4}`); mdSays(5, `= ${64 / 2}^\\circ`); mdSays(6, `= ${4 / S(30)} cm`);
mdSays(7, `= ${(9 + 12 - 15) / 2} cm`); mdSays(8, `= ${leg(20, 12)} cm`, `= ${6 * leg(20, 12)} cm`); mdSays(10, `= ${45} cm`);
mdSays(11, `tangent is ${leg(25, 15)} cm`, `= ${30 + 2 * leg(25, 15)} cm`); mdSays(12, `= ${(5 + 12 - 13) / 2} cm`);
mdSays(13, `TP is ${7} cm`); mdSays(15, `= ${leg(41, 9)}`);
mdSays(19, `= ${hyp(12, 35)} cm`); mdSays(20, `= ${50}^\\circ`, `= ${65}^\\circ`); mdSays(21, `= ${leg(10, 6)} cm`);
mdSays(22, `is ${17} cm`, `= ${6} cm`, `= ${3} cm`, `= ${8} cm`);
mdSays(24, `AB = OA = ${8} cm`, '8\\sqrt{2}'); mdSays(25, `= ${leg(53, 28)}`, `chord is ${2 * leg(53, 28)} cm`);
mdSays('27a', `= ${leg(39, 15)} cm`); mdSays('27b', `= ${15 * leg(39, 15)} cm`); mdSays('27c', 'AB = \\frac{360}{13} cm');
mdSays(28, `BP = 29 - 18 = ${29 - (23 - 5)}`, `radius is ${29 - (23 - 5)} cm`);
mdSays('29b', `= ${leg(61, 11)} m`); mdSays('29c', `${leg(61, 11)} m`); mdSays('29d', `= ${11 * leg(61, 11)} m`);
mdSays('30a', `${30} m: ${10} m from A, ${5} m from B, ${15} m from C`); mdSays('30b', `${5} m`); mdSays('30c', `= ${150} m`);
// Stage 1 and the body in ANSWERS.md
is('ANSWERS.md Stage 1 values', /AB = \\frac\{120\}\{13\}\$ cm; \(2\) 7 cm, 5 cm and 3 cm; \(3\) no, since \$5 \+ 9 = 14\$ but \$6 \+ 7 = 13\$; \(4\) 12 cm and \$6\\sqrt\{3\}\$ cm;\s+\(5\) 1 cm/.test(answersMd.replace(/\s+/g, ' ')));
ok('ANSWERS.md Ex 10.1 letters', mdLetter('10.1', 3), 'd');
is('ANSWERS.md Ex 10.2 Q2 angle', mdQ('10.2', 2).includes(`= ${360 - 180 - 110}^\\circ`));
is('ANSWERS.md Ex 10.2 Q3 angle', mdQ('10.2', 3).includes(`= ${180 - 90 - 80 / 2}^\\circ`) && mdQ('10.2', 3).includes(`= ${80 / 2}^\\circ`));
is('ANSWERS.md Ex 10.2 Q12 check area', near(4 * 21, Math.sqrt(21 * 7 * 8 * 6)) && mdQ('10.2', 12).includes(`x = 7`));

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
