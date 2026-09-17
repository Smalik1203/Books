#!/usr/bin/env node
/* Re-derive every number this chapter prints.
   Nothing here restates a printed value as its own truth: each probability
   is computed by listing the sample space or from the counts the question
   gives, and compared with what is on the page.

     node pages/class-9/ch07-probability/check-numbers.mjs [--skipped]

   Four parts:
     A  every identity set as maths, on every page and in ANSWERS.md: the
        numeric sides of each chain are evaluated and must agree (an
        approximation to the rounding it prints), and an equation in one
        unknown is checked against the value the same block solves it to
     B  the claims A cannot check: each example's Answer row, the chapter's
        prose values, each exercise answer read back off ANSWERS.md, the
        figures' drawn proportions, Stage 1's values, and the practice
        answers read back out of the key rows a lettered part at a time
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
const near = (a, b, t = 1e-9) => Math.abs(a - b) < t;

/* ---- counting tools --------------------------------------------- */

const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
const fr = (n, d) => { const g = gcd(n, d); return `${n / g}/${d / g}`; };   // lowest terms, as plain() prints it
const range = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i);
const count = (xs, f) => xs.filter(f).length;
const seqs = (n, faces) => n === 0 ? [[]] : seqs(n - 1, faces).flatMap(s => faces.map(f => [...s, f]));
const dice = seqs(2, range(1, 6));
const isPrime = (n) => n > 1 && range(2, n - 1).every(d => n % d);
const coins = (n) => seqs(n, ['H', 'T']).map(s => s.join(''));

/* ---- the pages ------------------------------------------------ */

const pages = fs.readdirSync(DIR).filter(f => /^p\d+\.html$/.test(f)).sort();
const html = Object.fromEntries(pages.map(f => [f, fs.readFileSync(path.join(DIR, f), 'utf8')]));
const answersMd = fs.readFileSync(path.join(DIR, 'ANSWERS.md'), 'utf8');
const body = pages.filter(f => /^p0/.test(f)).map(f => html[f]).join('\n');
const beyond = pages.filter(f => /^p1/.test(f)).map(f => html[f]).join('\n');
const text = (s) => s.replace(/<span class="nb">([^<]*)<\/span>/g, '$1')
  .replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&thinsp;/g, ' ').replace(/&ndash;/g, '-')
  .replace(/&middot;/g, '·').replace(/&amp;/g, '&').replace(/\s+/g, ' ');
const plain = (s) => text(s)
  .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '$1/$2')
  .replace(/\\[td]?frac(\d)(\d)/g, '$1/$2')
  .replace(/\\text\{([^{}]*)\}/g, '$1')
  .replace(/\\%/g, '%').replace(/\\times/g, '×').replace(/\\approx/g, '≈')
  .replace(/\\[,;!]|\\ /g, ' ').replace(/\\\{|\\\}/g, '')
  .replace(/\$/g, '').replace(/\s+/g, ' ');
const esc = (v) => String(v).replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
const has = (s, v) => new RegExp(`(^|[^\\d./])${esc(v)}([^\\d/]|\\.(?!\\d)|$)`).test(s);

/* ---- A. every identity ---------------------------------------- */

function toExpr(side, env = {}) {
  let s = side
    .replace(/\\left|\\right/g, '')
    .replace(/\\[td]?frac\{([^{}]+)\}\{([^{}]+)\}/g, '(($1)/($2))')
    .replace(/\\[td]?frac(\d)(\d)/g, '(($1)/($2))')
    .replace(/(\d+(?:\.\d+)?)\\%/g, '($1/100)')
    .replace(/\\times/g, '*').replace(/\\div/g, '/').replace(/\\cdot/g, '*')
    .replace(/\\,|\\ |\\;|\\quad|\\qquad/g, '')
    .replace(/\s+/g, '');
  for (const [v, val] of Object.entries(env)) s = s.replace(new RegExp(`(?<![A-Za-z\\\\])${v}(?![A-Za-z])`, 'g'), `(${val})`);
  if (!s || !/^[-+*/().0-9]+$/.test(s)) return null;
  return s.replace(/(\d|\))\(/g, '$1*(').replace(/\)(\d)/g, ')*$1');
}
const evalExpr = (e) => { try { return Function(`"use strict";return (${e})`)(); } catch { return NaN; } };
const decimals = (s) => { const m = s.trim().match(/^-?\d+\.(\d+)$/); return m ? m[1].length : null; };

const blocksOf = (src, isMd) => isMd
  ? src.split(/\n(?=\s*\d+\. |#)/)
  : src.split(/<div class="c-example">|<div class="c-try">|<div class="work work--trace">/)
      .flatMap(b => /c-example__tab/.test(b) ? [b] : b.split('<div class="work__row">'));
const SOLVED = /^\s*([a-z])\s*=\s*(-?\d+(?:\.\d+)?)\s*$/;

let spans = 0; const skipped = [];
const sources = [...pages.map(f => [f, html[f], false]), ['ANSWERS.md', answersMd, true]];
for (const [f, raw, isMd] of sources) {
  for (const block of blocksOf(raw.replace(/\$\$/g, '$'), isMd)) {
    const ms = [...block.matchAll(/\$([^$]+)\$/g)].map(m => m[1]);
    const solved = {};
    for (const s of ms) { const m = s.match(SOLVED); if (m) (solved[m[1]] ??= new Set()).add(Number(m[2])); }
    const envs = Object.entries(solved).reduce((acc, [v, set]) => acc.flatMap(e => [...set].map(x => ({ ...e, [v]: x }))), [{}]);
    for (const span of ms) {
      if (!/=|\\approx/.test(span) || /\\neq|\\le|\\ge|<|>/.test(span)) continue;
      if (SOLVED.test(span)) continue;
      // split on = and ≈, remembering which joins are approximate
      const parts = span.split(/(=|\\approx)/);
      const sides = [], approx = [];
      for (let i = 0; i < parts.length; i += 2) { sides.push(parts[i]); if (i + 1 < parts.length) approx.push(parts[i + 1] !== '='); }
      let checked = false;
      for (const env of envs) {
        const vals = sides.map(s => { const e = toExpr(s, env); return e ? evalExpr(e) : NaN; });
        const idx = vals.map((v, i) => (Number.isFinite(v) ? i : -1)).filter(i => i >= 0);
        if (idx.length < 2) continue;
        checked = true;
        let good = true;
        for (let k = 1; k < idx.length; k++) {
          const i = idx[k - 1], j = idx[k];
          const rough = approx.slice(i, j).some(Boolean);
          const d = rough ? Math.max(decimals(sides[i]) ?? 0, decimals(sides[j]) ?? 0) : null;
          const tol = rough ? 0.5 * 10 ** -(d || 0) + 1e-12 : 1e-9;
          if (!near(vals[i], vals[j], tol)) good = false;
        }
        if (good) { pass++; break; }
        if (env === envs[envs.length - 1]) fails.push(`${f}: $${span.trim()}$ — sides are ${vals.join(' and ')}`);
      }
      if (checked) spans++; else skipped.push(`${f}: $${span.trim()}$`);
    }
  }
}

/* ---- B. claims arithmetic alone does not check ---------------- */

const panels = (src) => {
  const o = {};
  for (const part of src.split('<div class="c-example">').slice(1)) o[part.match(/c-example__tab">Example (\d+)/)[1]] = part;
  return o;
};
const bodyEx = panels(body), beyondEx = panels(beyond);
const rowOf = (panel, label) => {
  const m = (panel || '').match(new RegExp(`work__label">${label}</span>([\\s\\S]*?)</div>`));
  return m ? plain(m[1]) : '';
};
const exSays = (where, ex, n, ...vals) => { for (const v of vals) is(`${where} Example ${n} Answer should say ${v}: "${rowOf(ex[n], 'Answer')}"`, has(rowOf(ex[n], 'Answer'), v)); };
const stepSays = (where, ex, n, ...vals) => { for (const v of vals) is(`${where} Example ${n} should print ${v}`, has(plain(ex[n] || ''), v)); };

// the body's examples
exSays('body', bodyEx, 1, fr(8, 50), 8 / 50, 100 * 8 / 50 + '%');
stepSays('body', bodyEx, 1, 8 / 50);
exSays('body', bodyEx, 2, fr(1, 6), (1 / 6).toFixed(3), (100 / 6).toFixed(1) + '%');
{ const word = 'PROBABILITY'.split('');
  const v = count(word, c => 'AEIOU'.includes(c)), b = count(word, c => c === 'B');
  is('body Example 3 prints the word it counts', /P R O B A B I L I T Y/.test(plain(bodyEx[3])));
  stepSays('body', bodyEx, 3, word.length, (v / word.length).toFixed(2), (b / word.length).toFixed(2));
  exSays('body', bodyEx, 3, fr(v, word.length), fr(b, word.length));
  is('body Example 3 remark: counting B once gives 1/11', has(plain(bodyEx[3]), fr(1, word.length))); }
exSays('body', bodyEx, 4, 20 / 50, 100 * 20 / 50 + '%');
exSays('body', bodyEx, 5, 20 / 50 * 1500);
stepSays('body', bodyEx, 5, 20 / 50 * 1500);
exSays('body', bodyEx, 6, fr(1, 6));
{ const S = coins(2); exSays('body', bodyEx, 7, fr(count(S, s => s === 'HH'), S.length)); stepSays('body', bodyEx, 7, S.length);
  is(`body Example 7 lists ${S.join(', ')}`, S.every(s => plain(bodyEx[7]).includes(s))); }

// every step row that gives a value beside its maths: "$8/50$, which is 0.16", "$1/6$, about 0.167"
for (const [where, ex] of [['body', bodyEx], ['Beyond', beyondEx]]) {
  for (const [n, panel] of Object.entries(ex)) {
    for (const m of panel.matchAll(/\$([^$]+)\$,? (?:which is|about) (\d+(?:\.\d+)?)(?![\d/])/g)) {
      const e = toExpr(m[1]); if (!e) continue;
      const d = decimals(m[2]) ?? 0;
      is(`${where} Example ${n}: $${m[1]}$ printed as ${m[2]}`, near(evalExpr(e), Number(m[2]), 0.5 * 10 ** -d + 1e-12));
    }
  }
}

// the body's prose
{ const p = plain(body);
  is('p004: 36 of the 52 cards are numbered 2 to 10', 9 * 4 === 36 && /36 of the 52/.test(p));
  is('p004: 36/52 is close to 7/10', Math.abs(36 / 52 - 0.7) < 0.01);
  is('p004: 0.1 happens a hundred times as often as 0.001', near(0.1 / 0.001, 100));
  is('p003: 0.75 is three times in four', near(3 / 4, 0.75));
  is('p011: three 4s in ten rolls suggests 0.3', near(3 / 10, 0.3) && /three 4s, suggesting 0\.3/.test(p));
  const S = coins(2);
  is('p016: one head and one tail is 2/4 = 1/2', count(S, s => s === 'HT' || s === 'TH') === 2 && p.includes('2/4 = 1/2'));
  is('p016: at least one head is 3/4', count(S, s => s.includes('H')) === 3 && p.includes('3/4 is the probability'));
  is('p016/017: third and fourth tosses give 8 and 16', coins(3).length === 8 && coins(4).length === 16 && /giving eight outcomes; a fourth toss gives sixteen/.test(p));
  // the event table on p015
  const rows = [['an even number', n => n % 2 === 0], ['more than 4', n => n > 4], ['less than 7', n => n < 7], ['more than 6', n => n > 6]];
  for (const [name, f] of rows) {
    const m = body.match(new RegExp(`${name}</span>\\s*<span>([^<]*)</span>\\s*<span class="chip">([^<]*)</span>`));
    const set = range(1, 6).filter(f);
    const printed = m ? plain(m[1]).replace(/[{}]/g, '').split(',').map(s => s.trim()).filter(Boolean).map(Number) : null;
    ok(`p015 event "${name}"`, printed, set);
    is(`p015 "${name}" probability ${set.length}/6`, !!m && plain(m[2]).startsWith(`${set.length}/6 = `) && has(plain(m[2]), set.length ? fr(set.length, 6).replace(/^(\d+)\/1$/, '$1') : 0));
  }
  // p014: each listed sample space against the n(S) printed beside it
  const listed = [...body.matchAll(/\$S = \\\{([^$]*?)\\\}\$,\s*(?:&nbsp;\s*)?\$n\(S\) = (\d+)\$/g)];
  is(`p014: three sample spaces with their sizes, found ${listed.length}`, listed.length === 3);
  for (const [, items, n] of listed) ok(`p014: n(S) for {${plain(items).trim()}}`, items.replace(/\\,/g, '').split(',').length, Number(n));
  is('summary: an event and its opposite',/P\(not E\) = 1 - P\(E\)/.test(p));
}

// the figures, measured from their own coordinates
const svgOf = (src, fig) => { const i = src.indexOf(`fignum">Fig. ${fig}<`); return src.slice(src.lastIndexOf('<svg', i), i); };
{ // Fig. 7.3: each deck's share of red, and where its leader meets the bar
  const s = svgOf(body, '7.3');
  const bar = s.match(/<rect class="dg-line"\s+x="([\d.]+)" y="44" width="([\d.]+)"/);
  const x0 = Number(bar[1]), w = Number(bar[2]);
  const cards = [...s.matchAll(/<g class="(dg-fill-[a-z-]+)">([\s\S]*?)<\/g>/g)]
    .flatMap(g => [...g[2].matchAll(/\sx="([\d.]+)"/g)].map(m => ({ x: Number(m[1]), red: g[1] === 'dg-fill-c' })));
  const decks = [];
  for (const c of cards.sort((a, b) => a.x - b.x)) { const d = decks.at(-1); if (d && c.x - d.at(-1).x < 20) d.push(c); else decks.push([c]); }
  const leaders = [...s.match(/<g class="dg-thin"><path d="([^"]+)"/)[1].matchAll(/M([\d.]+) [\d.]+ (?:L([\d.]+) [\d.]+|V[\d.]+)/g)]
    .map(m => ({ from: Number(m[1]), to: m[2] ? Number(m[2]) : Number(m[1]) }));
  is(`Fig. 7.3: three decks of four, found ${decks.map(d => d.length).join(',')}`, decks.length === 3 && decks.every(d => d.length === 4));
  decks.forEach((d, i) => {
    const p = count(d, c => c.red) / d.length;
    const mid = (d[0].x - 1 + d.at(-1).x - 1 + 10) / 2;
    const L = leaders[i];
    is(`Fig. 7.3 deck ${i + 1}: P(red) = ${p}, leader meets the bar at ${L && ((L.to - x0) / w).toFixed(3)}`, !!L && near((L.to - x0) / w, p, 0.01) && near(L.from, mid, 0.5));
  });
  is('Fig. 7.3: the middle deck sits at even chance, as labelled', /even chance/.test(s) && count(decks[1], c => c.red) * 2 === decks[1].length);
}
{ // Fig. 7.4: the bar's widths are the four shares of 50
  const s = svgOf(body, '7.4');
  const widths = [...s.matchAll(/<rect class="dg-fill-[a-z-]+"\s+x="[\d.]+"\s+y="18" width="([\d.]+)"/g)].map(m => Number(m[1]));
  ok('Fig. 7.4 widths', widths.map(x => +x.toFixed(1)), [20, 15, 10, 5].map(n => +(212 * n / 50).toFixed(1)));
  ok('Fig. 7.4 labels', [...s.matchAll(/dg-label--sm"[^>]*>(\d+)</g)].map(m => Number(m[1])), [20, 15, 10, 5]);
}
{ // Fig. 7B.1: six tips, each note a correct sum of its path
  const s = svgOf(beyond, '7B.1');
  const notes = [...s.matchAll(/dg-note"[^>]*>(\d) \+ (\d) = (\d)</g)].map(m => m.slice(1).map(Number));
  ok('Fig. 7B.1 paths', notes.map(([a, b]) => [a, b]), seqs(2, [1, 2]).flatMap(() => []).concat(...[1, 2].map(a => [1, 2, 3].map(b => [a, b]))));
  is('Fig. 7B.1 sums', notes.length === 6 && notes.every(([a, b, c]) => a + b === c));
  is('Fig. 7B.1 draws two branches, then three from each', (s.match(/M64 30 L118/g) || []).length === 3 && (s.match(/M64 94 L118/g) || []).length === 3);
}

// the exercises, read back off ANSWERS.md
const mdSection = (head) => { const i = answersMd.indexOf(head); const j = answersMd.indexOf('\n#', i + head.length); return answersMd.slice(i, j < 0 ? undefined : j); };
const mdItem = (head, n) => { const m = mdSection(head).match(new RegExp(`\\n${n}\\. ([\\s\\S]*?)(?=\\n\\d+\\. |$)`)); return m ? plain(m[1]) : ''; };
const mdSays = (head, n, ...vals) => { for (const v of vals) is(`ANSWERS.md ${head} Q${n} should say ${v}: "${mdItem(head, n).slice(0, 90)}"`, has(mdItem(head, n), v)); };
const S1 = '### Exercise Set 7.1', S2 = '### Exercise Set 7.2', S3 = '### Exercise Set 7.3', S4 = '### Exercise Set 7.4';
mdSays(S1, 1, fr(1, 2), fr(6, 6).replace('/1', ''));
mdSays(S1, 2, '1/2', 0.5, '50%', 0.2, fr(2, 10), '20%', '60%', fr(60, 100), 0.6, '3/8', 3 / 8, 100 * 3 / 8 + '%');
mdSays(S1, 3, fr(5, 10), fr(10, 15), '5/10', '10/15');
is('Ex 7.1 Q5: 1.4 is more than 1', 1.4 > 1 && has(mdItem(S1, 5), 1.4));
mdSays(S2, 1, fr(12, 30), 9 / 30 * 600);
mdSays(S2, 2, fr(12, 40), 16 / 40 * 800);
mdSays(S2, 3, 11 / 20, Math.abs(11 / 20 - 0.5).toFixed(2));
is('Ex 7.2 Q4 instance adds to 100', 21 + 9 + 70 === 100 && has(mdItem(S2, 4), 0.21) && has(mdItem(S2, 4), 0.09) && has(mdItem(S2, 4), 0.7));
mdSays(S2, 5, fr(count(range(1, 6), n => n % 2 === 0), 6));
mdSays(S2, 6, 22 / 50, 31 / 50);
mdSays(S3, 1, 6);
mdSays(S3, 2, 2 * 6);
{ const d = range(1, 6);
  const parts = [n => n % 2 === 1, n => n > 4, n => n % 2 === 1 && n > 4];
  for (const f of parts) mdSays(S3, 3, fr(count(d, f), 6));
  is('Ex 7.3 Q3 sets', /\(i\) 1, 3, 5,/.test(mdItem(S3, 3)) && /\(ii\) 5, 6,/.test(mdItem(S3, 3)) && /\(iii\) 5,/.test(mdItem(S3, 3)) && count(d, n => n > 10) === 0); }
mdSays(S3, 4, 3 * 2);
{ const pairs = seqs(1, ['apple', 'orange 1', 'orange 2']).flatMap(([a]) => ['banana', 'mango'].map(b => a + '–' + b));
  mdSays(S4, 1, pairs.length, fr(count(pairs, p => p === 'apple–banana'), pairs.length)); }
{ const S = seqs(2, ['red', 'blue', 'black']); mdSays(S4, 2, S.length, fr(count(S, ([a, b]) => a === b), S.length)); }
{ const S = coins(3);
  is('Ex 7.4 Q3 lists all eight', S.every(s => mdItem(S4, 3).includes(s)));
  mdSays(S4, 3, fr(count(S, s => count([...s], c => c === 'H') === 2), 8), fr(count(S, s => s.includes('T')), 8)); }
// Think and Reflect
{ const w = 'PROBABILITY'.split(''); const nv = count(w, c => !'AEIOU'.includes(c));
  is(`T&R p008: ${nv} of 11 are not vowels`, plain(answersMd).includes(`P(not a vowel) = ${fr(nv, 11)}`) && nv + 4 === 11); }
is('T&R p015: four outcomes for two coins', coins(2).length === 4);

// Stage 1, as printed in its running text
{ const p = plain(beyond);
  const red = 12 / 3;
  is(`Stage 1 Q1: ${12 - red} blue`, 12 - red === 8 && /Eight blue/.test(p));
  is('Stage 1 Q2: eight heads is 1 in 256', 2 ** 8 === 256 && /once in every 256/.test(p));
  is('Stage 1 Q3: one way to 2, six ways to 7, 36 pairs', count(dice, ([a, b]) => a + b === 2) === 1 && count(dice, ([a, b]) => a + b === 7) === 6 && dice.length === 36);
  is('Stage 1 Q3: eleven sums', new Set(dice.map(([a, b]) => a + b)).size === 11);
  const d8 = range(1, 8), even = d8.filter(n => n % 2 === 0), big = d8.filter(n => n > 5);
  const both = even.filter(n => big.includes(n)), either = d8.filter(n => even.includes(n) || big.includes(n));
  is(`Stage 1 Q4: both ${both}`, both.join() === '6,8' && p.includes(`${both.length}/8 = ${fr(both.length, 8)}`));
  is(`Stage 1 Q4: adding counts gives ${even.length + big.length}/8`, p.includes(`${even.length + big.length}/8`) && even.length === 4 && big.length === 3);
  is(`Stage 1 Q4: or gives ${either.length}, the union ${either}`, either.length === 5 && /would have given five — the union 2, 4, 6, 7, 8/.test(p));
  is('Stage 1 Q5: 0.75 and 0.95', near(150 / 200, 0.75) && near(19 / 20, 0.95));
  const S4c = coins(4), three = S4c.filter(s => count([...s], c => c === 'H') === 3), four = S4c.filter(s => s === 'HHHH');
  is('Stage 1 Q6: the sixteen outcomes are all listed', S4c.every(s => p.includes(s)) && S4c.length === 16);
  is(`Stage 1 Q6: exactly three heads ${three}`, three.every(s => p.includes(s)) && three.length === 4 && p.includes(`${three.length}/16 = ${fr(three.length, 16)}`));
  is('Stage 1 Q6: four times as likely', three.length / four.length === 4 && /Exactly three heads is four times as likely/.test(p));
  const pens = ['B1', 'B2', 'B3', 'K1', 'K2'];
  const pairs = pens.flatMap(a => pens.filter(b => b !== a).map(b => [a, b]));
  const firstB = count(pairs, ([a]) => a[0] === 'B'), secondB = count(pairs, ([, b]) => b[0] === 'B');
  is(`Stage 1 Q7: ${pairs.length} pairs, ${firstB} and ${secondB} blue`, pairs.length === 20 && firstB === 12 && secondB === 12
    && (p.match(/12\/20 = 3\/5/g) || []).length === 2 && firstB / 20 === 3 / 5 && /Just as likely/.test(p));
  is('Stage 1 Q8: 26 do not wear glasses, both ways', near(0.65 * 40, 26) && 40 - 0.35 * 40 === 26);
  const m7 = count(range(1, 50), n => n % 7 === 0);
  is(`Stage 1 Q8: ${m7} multiples of 7 up to 50`, m7 === 7 && 50 - m7 === 43 && /only seven of them/.test(p) && /list forty-three numbers/.test(p));
  const faces = [1, 1, 1, 2, 2, 3];
  for (const k of [1, 2, 3]) is(`Stage 1 Q9: P(${k}) = ${fr(count(faces, f => f === k), 6)}`, p.includes(`P(${k}) = ${count(faces, f => f === k) === 1 ? '' : count(faces, f => f === k) + '/6 = '}${fr(count(faces, f => f === k), 6)}`));
  is('Stage 1 Q9: half the faces are 1', count(faces, f => f === 1) * 2 === faces.length);
}

// Stage 2
exSays('Beyond', beyondEx, 1, fr(45, 100), 0.45 * 100 + '%');
is('Beyond Ex 1: less likely than not', 0.45 < 0.5 && /less likely/.test(rowOf(beyondEx[1], 'Answer')));
exSays('Beyond', beyondEx, 3, 52 / 80, 52 / 80 * 20);
{ const t = [16, 22, 19, 21, 17, 25];
  is('Beyond Ex 4 question prints these counts', plain(beyondEx[4]).includes(t.join(', ').replace(/, (\d+)$/, ' and $1')));
  exSays('Beyond', beyondEx, 4, fr(t[0] + t[1], 120), ((t[0] + t[1]) / 120).toFixed(3), fr(2, 6), (1 / 3).toFixed(3), (1 / 3 - (t[0] + t[1]) / 120).toFixed(2)); }
{ const w = 'ASSESSMENT'.split('');
  exSays('Beyond', beyondEx, 5, fr(count(w, c => c === 'S'), w.length), fr(count(w, c => 'AEIOU'.includes(c)), w.length));
  stepSays('Beyond', beyondEx, 5, w.length, count(w, c => c === 'S'), count(w, c => 'AEIOU'.includes(c)));
  is('Beyond Ex 5 remark: six different letters', new Set(w).size === 6 && has(plain(beyondEx[5]), fr(1, new Set(w).size))); }
{ const primes = range(1, 25).filter(isPrime);
  is(`Beyond Ex 6 lists ${primes}`, plain(beyondEx[6]).includes(primes.slice(0, -1).join(', ') + ' and ' + primes.at(-1)));
  is('Beyond Ex 6 remarks', fr(primes.length + 1, 25) === '2/5' && primes.includes(2)); }
{ const red = 5 / 8 * 24, green = 24 - red, add = red - green;
  exSays('Beyond', beyondEx, 7, add); stepSays('Beyond', beyondEx, 7, red, green, 24 + add); is('Beyond Ex 7 check', red / (24 + add) === 1 / 2); }
exSays('Beyond', beyondEx, 8, Math.round(14 / 400 * 12000), 1 - 14 / 400);
exSays('Beyond', beyondEx, 10, 9 / 30, (104 / 600).toFixed(3), fr(1, 6));
{ const s = plain(beyondEx[10]);
  is('Beyond Ex 10 distances', has(s, (9 / 30 - 1 / 6).toFixed(2)) && has(s, (104 / 600 - 1 / 6).toFixed(3)) && has(s, (1 / 6).toFixed(3)));
  is('Beyond Ex 10: twenty times as many rolls, Ravi nearer', 600 / 30 === 20 && Math.abs(104 / 600 - 1 / 6) < Math.abs(9 / 30 - 1 / 6)); }
{ const sp = range(1, 10), A = sp.filter(n => n % 3 === 0), B = sp.filter(n => n > 6);
  const AB = A.filter(n => B.includes(n)), AoB = sp.filter(n => A.includes(n) || B.includes(n));
  const s = plain(beyondEx[11]);
  for (const set of [A, B, AB, AoB]) is(`Beyond Ex 11 prints the set ${set}`, s.includes(set.join(', ')));
  exSays('Beyond', beyondEx, 11, fr(A.length, 10), fr(B.length, 10), fr(AB.length, 10), fr(AoB.length, 10));
  is('Beyond Ex 11 remark: 3 + 4 counts 9 twice', A.length + B.length === 7 && AoB.length === 6 && AB.join() === '9'); }
{ const S = seqs(1, ['H', 'T']).flatMap(([c]) => ['red', 'blue', 'green'].map(k => `${c}-${k}`));
  const s = plain(beyondEx[12]);
  is('Beyond Ex 12 lists the six', S.every(o => s.includes(o)));
  exSays('Beyond', beyondEx, 12, fr(count(S, o => o.startsWith('H') && !o.endsWith('red')), S.length)); }
{ const S = [1, 2].flatMap(a => [1, 2, 3].map(b => a + b));
  const s = plain(beyondEx[13]);
  is(`Beyond Ex 13 sums ${S}`, s.includes(`the sums along the paths are ${S.slice(0, -1).join(', ')} and ${S.at(-1)}`));
  exSays('Beyond', beyondEx, 13, fr(count(S, x => x === 3), 6), fr(count(S, x => x % 2 === 0), 6));
  is('Beyond Ex 13 remark: four sums, 3 and 4 twice', new Set(S).size === 4 && count(S, x => x === 3) === 2 && count(S, x => x === 4) === 2); }
{ const same = count(dice, ([a, b]) => a === b);
  exSays('Beyond', beyondEx, 14, fr(36 - same, 36)); stepSays('Beyond', beyondEx, 14, same, fr(same, 36)); }
{ const s = plain(beyondEx[15]); is('Beyond Ex 15 remarks', near(0.15 * 60, 9) && 60 - 15 === 45 && near(0.85 * 100, 85) && /0\.15 × 60 = 9/.test(s)); }

// the MCQ examples: exactly one right option, the one the Answer row names
const numOf = (s) => { const m = String(s).match(/-?\d+(?:\.\d+)?(?:\/\d+)?%?/); if (!m) return NaN; let t = m[0]; let k = 1; if (t.endsWith('%')) { k = 0.01; t = t.slice(0, -1); } const [a, b] = t.split('/'); return (b ? a / b : Number(a)) * k; };
const optList = (src) => { const o = (src || '').match(/<ol class="c-parts c-parts--alpha[^>]*>([\s\S]*?)<\/ol>/); return o ? [...o[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map(x => plain(x[1]).trim()) : []; };
const val = (f, t = 1e-9) => (o) => o.map(numOf).map(v => near(v, f, t));
const exKey = (n) => (rowOf(beyondEx[n], 'Answer').match(/\(([a-d])\)/) || [])[1];
const exSolve = {
  2: o => { const v = o.map(numOf); return v.map(x => x === Math.max(...v)); },
  6: val(count(range(1, 25), isPrime) / 25),
  9: o => o.map(s => /drawing names/.test(s)),                                  // the only sample where every student has the same chance
  15: val((1 - 0.15) * 60, 1e-6),
};
for (const [n, f] of Object.entries(exSolve)) {
  const o = optList(beyondEx[n]);
  is(`Beyond Example ${n} has four options`, o.length === 4);
  ok(`Beyond Example ${n}: the right option`, f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean), [exKey(n)]);
}
{ const o = optList(beyondEx[2]).map(numOf); is('Beyond Ex 2 remarks: 48% is 0.48, 3/7 about 0.43', near(o[2], 0.48) && Math.abs(o[3] - 0.43) < 0.005); }

// the practice answers, read back out of the key rows
const keyRows = {};
for (const m of beyond.matchAll(/<span class="work__label">(\d+)<\/span>\s*<span>([\s\S]*?)<\/span><\/div>/g)) keyRows[m[1]] ??= plain(m[2]);
const partOf = (r, part) => { const m = r.match(new RegExp(`\\(${part}\\)(.*?)(?=\\([a-d]\\) |$)`)); return m ? m[1] : ''; };
const row = (q) => { const [, n, part] = String(q).match(/^(\d+)([a-d]?)$/); const r = keyRows[n] || ''; return part ? partOf(r, part) : r; };
const says = (q, ...vals) => { for (const v of vals) is(`key ${q} should say ${v}: "${row(q)}"`, has(row(q), v)); };
const sums = dice.map(([a, b]) => a + b);
const faces31 = [45, 54, 48, 51, 57, 45];
const P = {
  23: [fr(9, 40), 9 / 40, 100 * 9 / 40 + '%'],
  24: [fr(count(range(1, 20), n => n % 4 === 0), 20)],
  25: [fr(count('MISSISSIPPI'.split(''), c => c === 'S'), 11)],
  26: (() => { const blue = 1 - 1 / 4 - 1 / 3, total = 10 / blue; return [fr(5, 12), Math.round(total), total / 4, total / 3, 10]; })(),
  27: (() => { const S = seqs(2, [1, 2, 3]); return [S.length, fr(count(S, ([a, b]) => (a * b) % 2 === 0), S.length)]; })(),
  28: [90 / 250, 90 / 250 * 8000, 8000 - 90 / 250 * 8000],
  '29a': [fr(count(range(1, 40), n => Number.isInteger(Math.sqrt(n))), 40)],
  '29b': [fr(count(range(1, 40), n => n % 10 === 0), 40)],
  '29c': [fr(count(range(1, 40), n => Number.isInteger(Math.sqrt(n)) || n % 10 === 0), 40)],
  '30a': [dice.length],
  '30b': [fr(count(sums, s => s === 6), 36)],
  '30c': [`${count(sums, isPrime)}/36`, fr(count(sums, isPrime), 36)],
  '30d': [`${count(sums, s => s % 4 === 0)}/36`, fr(count(sums, s => s % 4 === 0), 36)],
  '31a': faces31.map(n => n / 300),
  '31b': [(1 / 6).toFixed(3), (Math.max(...faces31.map(n => Math.abs(n / 300 - 1 / 6)))).toFixed(2)],
  '31d': [1200 / 6],
  '32a': [fr(30, 120)], '32b': [fr(120 - 42, 120)], '32c': [36 / 120 * 900],
  '33a': [fr(4, 20)], '33b': [fr(16, 20)], '33c': [4 / 20 * 200],
  '33d': [(() => { let g = 0; while ((4 + g) / (20 + g) !== 1 / 2) g++; return g; })()],
};
for (const [q, vs] of Object.entries(P)) says(q, ...vs);
is('key 29 (c): no number is both', range(1, 40).every(n => !(Number.isInteger(Math.sqrt(n)) && n % 10 === 0)));
is('key 30 (c) and (d) count each sum', [2, 3, 5, 7, 11].map(s => count(sums, x => x === s)).join(' + ') === '1 + 2 + 4 + 6 + 2' && row('30c').includes('1 + 2 + 4 + 6 + 2')
  && [4, 8, 12].map(s => count(sums, x => x === s)).join(' + ') === '3 + 5 + 1' && row('30d').includes('3 + 5 + 1'));
is('key 31 (b): face 5 is furthest', faces31.indexOf(Math.max(...faces31)) + 1 === 5 && /face 5/.test(row('31b')));
is('practice 31 counts add to 300', faces31.reduce((a, b) => a + b) === 300 && plain(beyond).includes(faces31.slice(0, -1).join(', ') + ' and ' + faces31.at(-1)));
is('case 32 table adds to 120', 42 + 30 + 36 + 12 === 120);
is('key 27 lists the odd products', ['(1, 1)', '(1, 3)', '(3, 1)', '(3, 3)'].every(s => row(27).includes(s)) && count(seqs(2, [1, 2, 3]), ([a, b]) => (a * b) % 2) === 4);
// the why-wrong rows
{ const why = (n) => { const i = beyond.indexOf('Why the other options are wrong'); const m = beyond.slice(i).match(new RegExp(`work__label">${n}</span>\\s*<span>([\\s\\S]*?)</span></div>`)); return m ? plain(m[1]) : ''; };
  is('why 6: five pairs make 8, and 4/36 leaves one out', count(sums, s => s === 8) === 5 && /five of 36/.test(why(6)) && why(6).includes('4/36'));
  is('why 7: 3 of 9 left', why(7).includes('3/9 = 1/3') && why(7).includes('4/10'));
  is('why 8: 12 in both lists', why(8).includes('3, 4, 6, 8, 9, 12') && /six numbers/.test(why(8)));
  is('why 10: 25 pairs without a 6', count(dice, ([a, b]) => a !== 6 && b !== 6) === 25 && why(10).includes('1 - 25/36 = 11/36'));
  is('why 13: 10 + 6 - 2 = 14', count(range(1, 30), n => n % 3 === 0) === 10 && count(range(1, 30), n => n % 5 === 0) === 6 && /15 and 30/.test(why(13)) && has(why(13), 14));
  is('why 16: 310/500 = 0.62', why(16).includes('310/500 = 0.62'));
  is('why 2: 5/4 = 1.25', why(2).includes('5/4 = 1.25')); }

/* ---- C. multiple choice and assertion-reason ------------------ */

const qs = {};
for (const m of beyond.matchAll(/<ol class="c-questions"(?: data-start="(\d+)")?>\s*<li>([\s\S]*?)<\/li>\s*<\/ol>\s*<\/div>/g)) qs[Number(m[1] || 1)] ??= m[2];
const key = {};
{ const a = beyond.indexOf('<ol class="c-answers">');
  for (const m of text(beyond.slice(a, beyond.indexOf('</ol>', a))).matchAll(/\b(\d+) \(([a-d])\)/g)) key[m[1]] ??= m[2]; }
const nPrime = count(range(1, 6), isPrime);
const solve = {
  1: val(27 / 60),
  2: o => o.map(numOf).map(v => v < 0 || v > 1),
  3: val(1 - 0.7, 1e-9),
  4: val(count('CHANCE'.split(''), c => c === 'C') / 6),
  5: val((3 + 4) / (3 + 5 + 4)),
  6: val(count(sums, s => s === 8) / 36),
  7: val((4 - 1) / (10 - 1)),
  8: val(count(range(1, 12), n => n % 3 === 0 || n % 4 === 0) / 12),
  9: val((200 - 92) / 200),
  10: val(count(dice, ([a, b]) => a === 6 || b === 6) / 36),
  11: val(count(coins(3), s => count([...s], c => c === 'H') <= 1) / 8),
  12: o => o.map(numOf).map(x => near(x / (5 + x), 2 / 7)),
  13: val(count(range(1, 30), n => n % 3 === 0 || n % 5 === 0) / 30),
  14: val(5 / 26),
  15: val(2 * 2 * 6),
  16: val(310 / 500),
  17: val(count(sums, s => s > 9) / 36),
  18: o => o.map(s => s === '(ii) and (iii)'),                       // 530 of 1000 proves nothing about bias
};
for (const [q, f] of Object.entries(solve)) {
  const o = optList(qs[q]);
  is(`Q${q} has four options`, o.length === 4);
  ok(`Q${q}: the right option`, f(o).map((t, i) => (t ? 'abcd'[i] : null)).filter(Boolean), [key[q]]);
}
is('Q18 statement (ii) is 530/1000', near(530 / 1000, 0.53) && plain(qs[18]).includes('0.53'));
const arLetter = ([a, r, x]) => (a && r ? (x ? 'a' : 'b') : a ? 'c' : r ? 'd' : 'e');
const AR = {
  19: [nPrime / 6 === 1 / 2, range(1, 6).filter(isPrime).join() === '2,3,5', true],   // R is the count that gives A
  20: [true, false, false],                                           // theoretical probability does not depend on trials
  21: [count('MATHS'.split(''), c => 'AEIOU'.includes(c)) / 5 === 1 / 5, true, false],
  22: [false, true, false],                                           // an even chance promises nothing about two trials
};
for (const [q, v] of Object.entries(AR)) ok(`Q${q}: assertion-reason`, arLetter(v), key[q]);
is('AR questions print Assertion and Reason', [19, 20, 21, 22].every(q => /Assertion \(A\)/.test(qs[q] || '') && /Reason \(R\)/.test(qs[q] || '')));
const letters = Object.values(key);
is(`key letters spread across a-d: ${letters.join('')}`, ['a', 'b', 'c', 'd'].every(l => letters.filter(x => x === l).length >= 3));
ok('key covers 1-22', Object.keys(key).map(Number).sort((a, b) => a - b), range(1, 22));
ok('practice numbered 1-33', [...beyond.matchAll(/data-start="(\d+)"/g)].map(m => Number(m[1])), range(2, 33));

/* ---- D. ANSWERS.md prints the same key ------------------------ */

const mdKey = {};
{ const i = answersMd.indexOf('as the key prints it'); for (const m of answersMd.slice(i, i + 800).matchAll(/\b(\d+) \(([a-d])\)/g)) mdKey[m[1]] = m[2]; }
ok('ANSWERS.md key matches the page', mdKey, key);
const W = '### The working for each';
for (const [q, vs] of Object.entries(P)) {
  const [, n, part] = q.match(/^(\d+)([a-d]?)$/);
  let r = mdItem(W, n);
  if (part) r = partOf(r, part);
  for (const v of vs) is(`ANSWERS.md practice ${q} should say ${v}: "${r.slice(0, 80)}"`, has(r, v));
}
for (const q of Object.keys(solve)) {
  const o = optList(qs[q]), right = o['abcd'.indexOf(key[q])] || '';
  const m = right.match(/-?\d+(?:\.\d+)?(?:\/\d+)?/);
  if (m && q !== '18') is(`ANSWERS.md practice ${q} should reach ${m[0]}`, has(mdItem(W, q), m[0]));
}
for (const q of Object.keys(AR)) is(`ANSWERS.md practice ${q} names (${key[q]})`, mdItem(W, q).startsWith(`(${key[q]})`));
// Stage 1's summary line agrees with the page
{ const s = plain(mdSection('### Stage 1'));
  for (const v of ['Q1 8 blue', '256', '1/36', '1/4', '0.75', '1/16', '12/20 = 3/5', 'Q8 26', 'P(1) = 1/2', 'P(2) = 1/3', 'P(3) = 1/6']) is(`ANSWERS.md Stage 1 should say ${v}`, s.includes(v)); }

/* ---- report ---------------------------------------------------- */

console.log(`A  ${spans} identities evaluated; ${skipped.length} spans not arithmetic, skipped`);
if (process.argv.includes('--skipped')) for (const s of skipped) console.log('     ' + s);
console.log(`   ${pass} claims hold`);
if (fails.length) {
  console.log(`\n${fails.length} FAIL`);
  for (const f of fails) console.log('  ' + f);
  process.exit(1);
}
console.log('   nothing failed');
