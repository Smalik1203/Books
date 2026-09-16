#!/usr/bin/env node
/* Prove that setting a chapter's worked examples as steps changed the
   layout and nothing else.

   Pulls every number and every maths span out of every .c-example, at the
   given git ref and in the working tree, and compares them.

     node build/check-example-stepping.mjs pages/class-6/math-chNN-... [ref]

   Three things this gets wrong if done naively, all found by doing it:

   * A page-by-page comparison breaks the moment the chapter is refitted,
     because repacking moves examples between pages. So the chapter's
     examples are collected in order and compared as one sequence.
   * A non-greedy match for the end of a .c-example stops at the first
     nested </div>, which is inside the new .work — silently dropping
     everything after the working. So the close is found by balancing.
   * Setting an example as steps ADDS an Answer row, and that row names
     what was asked about, so a number may gain an occurrence. It may
     never lose one, and no expression may appear or vanish: those are the
     directions in which a recast paragraph loses mathematics.

   Body pages only by default: Beyond the Book is rebuilt rather than
   restyled, so its examples are new and there is nothing to compare.
   Pass --all to include it.
*/
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const dir = process.argv[2];
const ref = process.argv.find((a, i) => i > 2 && !a.startsWith('--')) || 'HEAD';
const bodyOnly = !process.argv.includes('--all');
if (!dir) {
  console.error('usage: node build/check-example-stepping.mjs <pages dir> [ref] [--all]');
  process.exit(1);
}

function examples(html) {
  const out = [];
  const open = /<div class="c-example">/g;
  let m;
  while ((m = open.exec(html))) {
    let depth = 1;
    const from = m.index + m[0].length;
    const tag = /<\/?div\b[^>]*>/g;
    tag.lastIndex = from;
    let t;
    while (depth > 0 && (t = tag.exec(html))) {
      depth += t[0].startsWith('</') ? -1 : 1;
      if (depth === 0) out.push(html.slice(from, t.index));
    }
  }
  return out;
}

/* A chained equality is the one thing stepping legitimately breaks up:
   $a = b = c$ on one line becomes $a = b$ on a step and $a = c$ on the
   Answer. So a span is compared as the set of expressions it relates. */
const sides = (span) => span.split('=').map(s => s.trim()).filter(Boolean);

const LABEL = /^(Step \d+|Answer|Solution\.?)$/;

function tokens(block) {
  // The tab is the example's label, not its mathematics: renumbering the
  // examples of a chapter that restarted them per section changes it.
  block = block.replace(/<div class="c-example__tab">[^<]*<\/div>/g, '');
  const maths = [...block.matchAll(/\$([^$]+)\$/g)].map(x => x[1].replace(/\s+/g, ''));
  const text = block.replace(/\$[^$]*\$/g, ' ').replace(/<[^>]+>/g, ' ');
  const nums = [...text.matchAll(/\d+/g)].map(x => x[0]);
  const labels = [...block.matchAll(/<span class="work__label">([^<]*)<\/span>/g)].map(x => x[1]);
  for (const n of labels.filter(l => LABEL.test(l)).flatMap(l => [...l.matchAll(/\d+/g)].map(x => x[0]))) {
    const i = nums.indexOf(n);
    if (i >= 0) nums.splice(i, 1);
  }
  return { maths, nums };
}

const files = fs.readdirSync(dir)
  .filter(f => /^p\d+\.html$/.test(f))
  .filter(f => !bodyOnly || /^p0/.test(f))
  .sort();

/* The old files are read at the ref, the new ones off disk; both are
   flattened to one ordered list, because pagination may have moved. */
function collect(readFile) {
  const out = [];
  for (const f of files) {
    const html = readFile(f);
    if (html === null) continue;
    for (const e of examples(html)) out.push({ f, e });
  }
  return out;
}

const before = collect((f) => {
  const rel = path.posix.join(dir.replace(/\\/g, '/'), f);
  try { return execSync(`git show ${ref}:${rel}`, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch { return null; }
});
const after = collect((f) => fs.readFileSync(path.join(dir, f), 'utf8'));

if (before.length !== after.length) {
  console.log(`FAIL ${before.length} example(s) at ${ref}, ${after.length} now — `
    + `one has been added or removed, which this pass may not do.`);
  process.exit(1);
}

let bad = 0;
for (let i = 0; i < before.length; i++) {
  const b = tokens(before[i].e), a = tokens(after[i].e);
  const cnt = (xs) => xs.reduce((o, n) => (o[n] = (o[n] || 0) + 1, o), {});
  const cb = cnt(b.nums), ca = cnt(a.nums);
  const lost = [], gained = [];
  for (const k of new Set([...Object.keys(cb), ...Object.keys(ca)])) {
    const d = (ca[k] || 0) - (cb[k] || 0);
    if (d < 0) lost.push(`${k} (${cb[k]}→${ca[k] || 0})`);
    else if (d > 0) gained.push(`${k} (${cb[k] || 0}→${ca[k]})`);
  }
  const eb = new Set(b.maths.flatMap(sides)), ea = new Set(a.maths.flatMap(sides));
  const mLost = [...eb].filter(x => !ea.has(x));
  const mNew = [...ea].filter(x => !eb.has(x));

  const where = `example ${i + 1} (${before[i].f} → ${after[i].f})`;
  if (lost.length || mLost.length || mNew.length) {
    bad++;
    console.log(`FAIL ${where}`);
    if (lost.length) console.log(`  numbers lost: ${lost.join('  ')}`);
    if (mLost.length) console.log(`  expressions lost: ${mLost.join('  ')}`);
    if (mNew.length) console.log(`  expressions new: ${mNew.join('  ')}`);
  } else if (gained.length) {
    console.log(`ok   ${where} — the Answer row restates: ${gained.join('  ')}`);
  }
}

console.log(`\n${before.length} example(s) compared against ${ref}`
  + `${bodyOnly ? ' in the chapter body' : ''}: ${bad} lost mathematics.`);
process.exit(bad ? 1 : 0);
