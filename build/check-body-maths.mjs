#!/usr/bin/env node
/* Prove that recasting a chapter body changed its layout and nothing else,
   when working MOVES — out of running text and into an example's steps.

     node build/check-body-maths.mjs pages/class-10/ch01-real-numbers [ref]

   check-example-stepping.mjs compares what is inside each .c-example, which
   is right when the working was already there. Class 10's examples were
   question-only panels with the working in the prose after them, so setting
   them as steps carries maths across the panel's edge, and a per-panel
   comparison reports every moved line as new. This compares the whole body
   instead: every maths span and every number, as a multiset, at the ref and
   in the working tree.

   The same directions as the stepping check: a number may gain occurrences
   (an Answer row restates what was asked about) but never lose one, and no
   expression may vanish or appear. A chained equality is compared as the
   set of expressions it relates, so $a = b = c$ may be split across rows.
   Body pages only (p0xx). Pages the refit deleted are read at the ref, so a
   chapter that loses pages is still compared whole. */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const dir = process.argv[2];
const ref = process.argv.find((a, i) => i > 2 && !a.startsWith('--')) || 'HEAD';
if (!dir) {
  console.error('usage: node build/check-body-maths.mjs <pages dir> [ref]');
  process.exit(1);
}
const rel = dir.replace(/\\/g, '/').replace(/\/$/, '');

const atRef = execSync(`git ls-tree --name-only ${ref} ${rel}/`, { encoding: 'utf8' })
  .split('\n').map(s => path.posix.basename(s)).filter(f => /^p0\d\d\.html$/.test(f));
const now = fs.readdirSync(dir).filter(f => /^p0\d\d\.html$/.test(f));

const LABEL = /^(Step \d+|Answer|Solution\.?|Check)$/;
function collect(html) {
  html = html
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ')                         // figures are compared by eye, not here
    .replace(/<div class="c-example__tab">[^<]*<\/div>/g, ' ')
    .replace(/<span class="work__label">(Step \d+|Answer|Solution\.?|Check)<\/span>/g, ' ')
    .replace(/<span class="work__label">\d+<\/span>/g, ' ')           // a bare row number is a label too (Class 9 proofs)
    .replace(/<span class="nb">([^<]*)<\/span>/g, '$1')
    .replace(/\$\$/g, '$');
  const maths = [...html.matchAll(/\$([^$]+)\$/g)].map(x => x[1].replace(/\s+/g, ''));
  const text = html.replace(/\$[^$]*\$/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&[a-z]+;/g, ' ');
  const nums = [...text.matchAll(/\d+(?:\.\d+)?/g)].map(x => x[0]);
  return { maths, nums, examples: (html.match(/<div class="c-example">/g) || []).length };
}
const merge = (list) => list.reduce((a, b) => ({
  maths: a.maths.concat(b.maths), nums: a.nums.concat(b.nums), examples: a.examples + b.examples,
}), { maths: [], nums: [], examples: 0 });

const before = merge(atRef.map(f => collect(execSync(`git show ${ref}:${rel}/${f}`, { encoding: 'utf8' }))));
const after = merge(now.map(f => collect(fs.readFileSync(path.join(dir, f), 'utf8'))));

const count = (xs) => xs.reduce((o, n) => (o[n] = (o[n] || 0) + 1, o), {});
const sides = (s) => s.split(/=|\\approx|\\neq|\\leq|\\geq|<|>/).map(x => x.trim()).filter(Boolean);

let bad = 0;
if (before.examples !== after.examples) {
  console.log(`FAIL ${before.examples} example(s) at ${ref}, ${after.examples} now`);
  bad++;
}
const cb = count(before.nums), ca = count(after.nums);
const lost = Object.keys(cb).filter(k => (ca[k] || 0) < cb[k]).map(k => `${k} (${cb[k]}→${ca[k] || 0})`);
const gained = Object.keys(ca).filter(k => ca[k] > (cb[k] || 0)).map(k => `${k} (${cb[k] || 0}→${ca[k]})`);
const eb = new Set(before.maths.flatMap(sides)), ea = new Set(after.maths.flatMap(sides));
const mLost = [...eb].filter(x => !ea.has(x));
const mNew = [...ea].filter(x => !eb.has(x));
if (lost.length) { bad++; console.log(`FAIL numbers lost from the prose: ${lost.join('  ')}`); }
if (mLost.length) { bad++; console.log(`FAIL expressions lost: ${mLost.join('  ')}`); }
if (mNew.length) { bad++; console.log(`FAIL expressions new: ${mNew.join('  ')}`); }
if (gained.length) console.log(`note numbers gained (Answer rows restate): ${gained.join('  ')}`);

console.log(`\n${atRef.length} body page(s) at ${ref}, ${now.length} now; ${before.examples} example(s); `
  + `${eb.size} expressions and ${before.nums.length} numbers compared: ${bad ? 'CHANGED' : 'no mathematics lost or added'}.`);
process.exit(bad ? 1 : 0);
