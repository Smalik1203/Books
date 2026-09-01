#!/usr/bin/env node
/* Close the white at the foot of a page by running the next page's
 * worked example over the break.
 *
 * repack moves whole blocks, so it cannot help a page whose neighbour
 * opens with a tall example: nothing fits and the page ships a third
 * empty. This walks the chapter front to back, and wherever a short
 * page is followed by one that opens with an example, it tries moving
 * 1, 2, 3 ... rows of that example back onto the short page, keeping
 * the largest move that does not overfill. Each trial is measured by
 * the real builder, so the answer is what the page actually does.
 *
 *   node build/close-gaps.mjs class-9/ch04-algebraic-identities [--min 90]
 *
 * A figure is never touched: half a diagram is unreadable, so a gap
 * held open by a figure is left alone and reported at the end.
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const args = process.argv.slice(2);
const chapter = args[0];
if (!chapter) { console.error('usage: node build/close-gaps.mjs <class/chapter> [--min N]'); process.exit(1); }
const MIN = Number((args[args.indexOf('--min') + 1]) || 90);
const dir = path.join('pages', chapter);
const pad = (n) => 'p' + String(n).padStart(3, '0') + '.html';

const build = () => {
  const out = execFileSync(process.execPath, ['build/build.mjs', chapter], { encoding: 'utf8' });
  const line = (out.match(/fill .*/) || [''])[0];
  const fills = {};
  for (const m of line.matchAll(/(\d+):(\d+)%/g)) fills[Number(m[1])] = Number(m[2]);
  return { fills, violations: /design violation/.test(out) };
};

const firstBlockOf = async (n) => {
  let s;
  try { s = await readFile(path.join(dir, pad(n)), 'utf8'); } catch { return null; }
  const m = s.match(/<div class="page__main">([\s\S]*)/);
  if (!m) return null;
  const t = m[1].replace(/<!--[\s\S]*?-->/g, '').match(/<(\w+)([^>]*)>/);
  if (!t) return null;
  const cls = (t[2].match(/class="([^"]+)"/) || [, ''])[1];
  return cls ? cls.split(' ')[0] : t[1];
};

const snapshot = async (n) => ({
  a: [path.join(dir, pad(n)), await readFile(path.join(dir, pad(n)), 'utf8')],
  b: [path.join(dir, pad(n + 1)), await readFile(path.join(dir, pad(n + 1)), 'utf8')],
});
const restore = async (s) => { await writeFile(...s.a); await writeFile(...s.b); };

const trySplit = (n, k) => {
  try {
    execFileSync(process.execPath, ['build/split-panel.mjs', dir, String(n), String(k)],
      { encoding: 'utf8', stdio: 'pipe' });
    return true;
  } catch { return false; }
};

let { fills } = build();
const nPages = Object.keys(fills).length;
const skipped = [];
let closed = 0;

for (let n = 1; n < nPages; n++) {                 // last page is exempt
  if (fills[n] >= MIN) continue;
  const next = await firstBlockOf(n + 1);
  if (!['c-example','c-reflect','c-keyidea'].includes(next)) { skipped.push([n, fills[n], next]); continue; }

  const before = fills[n];
  const snap = await snapshot(n);
  let best = null;

  for (let k = 1; k <= 12; k++) {
    await restore(snap);
    if (!trySplit(n, k)) break;                    // ran out of rows
    const r = build();
    if (r.violations || r.fills[n] > 100) break;   // one row too far
    if (r.fills[n] >= before) best = { k, fill: r.fills[n], fills: r.fills };
    if (r.fills[n] >= 99) break;
  }

  await restore(snap);
  if (best && best.fill > before) {
    trySplit(n, best.k);
    fills = build().fills;
    closed++;
    console.log(`  page ${n}: ${before}% -> ${best.fill}%  (${best.k} row${best.k > 1 ? 's' : ''} of the example moved up)`);
  } else {
    skipped.push([n, before, 'example will not divide here']);
  }
}

console.log(`\n  ${closed} gap(s) closed.`);
if (skipped.length) {
  console.log('  left open:');
  for (const [n, f, why] of skipped) {
    const reason = why === 'c-figure' ? 'held by a figure — a diagram must not be cut'
      : why === null ? 'last page'
      : `held by ${why}`;
    console.log(`    page ${n}  ${f}%  ${reason}`);
  }
}
