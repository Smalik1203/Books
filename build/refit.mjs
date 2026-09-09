#!/usr/bin/env node
/* ============================================================
   Refit half a chapter onto its pages.

     node build/refit.mjs class-9/ch05-circles bridge [--dry]
     node build/refit.mjs class-9/ch04-algebraic-identities body

   A chapter is two runs of pages that are fitted separately: the
   chapter proper, p001 up, and Beyond the Book, p101 to p110. An
   edit that adds three lines to one page pushes three lines off
   the last one — silently, because a fixed page box clips.

   repack has no page range: run it on the chapter and it repacks
   both runs as one flow, which merges the division into the
   chapter and moves every break in the half you were not editing.
   So each run is refitted on its own, in a scratch chapter beside
   it, and copied back.

   repack also writes plain pages, dropping the two attributes that
   carry meaning: data-bridge, which puts "Beyond the Book" in the
   running head, and data-close, which tells the fill check that
   the chapter proper is allowed to end part-way down its last
   page. Both are stamped back on.
   ============================================================ */
import { readFile, writeFile, readdir, mkdir, rm, copyFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = (...a) => path.join(ROOT, ...a);

const rel = process.argv[2];
const part = process.argv[3];
const DRY = process.argv.includes('--dry');
if (!rel || !['body', 'bridge'].includes(part)) {
  console.error('usage: node build/refit.mjs <class-9/chapter-dir> body|bridge [--dry]');
  process.exit(1);
}
const BRIDGE = part === 'bridge';

const cls = path.dirname(rel);
const name = path.basename(rel);
const src = p('pages', rel);
const scratchRel = path.join(cls, '_refit-' + name);
const scratch = p('pages', scratchRel);

const node = (...args) =>
  execFileSync(process.execPath, args.map(String), { cwd: ROOT, stdio: ['ignore', 'pipe', 'inherit'] }).toString();

/* ---- the scratch chapter ---------------------------------- */
// Beyond the Book is p101 up; the chapter proper is everything
// below it. The two never mix.
const isBridge = f => /^p1\d\d.*\.html$/.test(f);
const own = (await readdir(src))
  .filter(f => /^p\d+.*\.html$/.test(f) && isBridge(f) === BRIDGE).sort();
if (!own.length) { console.log(`  ${rel}: no ${part} pages`); process.exit(0); }

await rm(scratch, { recursive: true, force: true });
await mkdir(scratch, { recursive: true });
// The same edition and palette, so every measurement is the one
// that will hold when the pages go back.
await copyFile(path.join(src, 'chapter.json'), path.join(scratch, 'chapter.json'));
for (const [i, f] of own.entries()) {
  await copyFile(path.join(src, f), path.join(scratch, 'p' + String(i + 1).padStart(3, '0') + '.html'));
}

/* ---- fit it ------------------------------------------------ */
console.log(`  ${rel}: refitting ${own.length} ${part} page(s)`);
node('build/build.mjs', scratchRel);
// One block per question, or a set of ten is one atom and a page
// that cannot hold all ten holds none of them.
node('build/split-practice.mjs', scratch);
node('build/build.mjs', scratchRel);
console.log(node('build/repack.mjs', scratchRel).split('\n').filter(l => /pages in/.test(l)).join('\n'));
process.stdout.write(node('build/build.mjs', scratchRel));

if (DRY) { console.log('  --dry: the scratch chapter is left in place, nothing copied back'); process.exit(0); }

/* ---- back to the chapter ----------------------------------- */
const packed = (await readdir(scratch)).filter(f => /^p\d+.*\.html$/.test(f)).sort();
for (const f of own) await rm(path.join(src, f));
const named = i => BRIDGE ? 'p' + String(101 + i) : 'p' + String(i + 1).padStart(3, '0');
for (const [i, f] of packed.entries()) {
  let html = await readFile(path.join(scratch, f), 'utf8');
  // data-bridge on every page of the division; data-close on the one
  // page of the chapter proper that is allowed to end part-way down.
  const want = BRIDGE ? 'data-bridge' : (i === packed.length - 1 ? 'data-close' : null);
  if (want) html = html.replace(/<section class="page([^"]*)"([^>]*)>/, (m, c, a) =>
    `<section class="page${c}"${a.includes(want) ? a : a + ' ' + want}>`);
  await writeFile(path.join(src, named(i) + '.html'), html);
}
await rm(scratch, { recursive: true, force: true });
// The chapter's own build still shows the pages as they were, and a tool
// that measures the build and edits the source will act on the wrong
// page. Leave the two in step.
node('build/build.mjs', rel);
console.log(`  wrote ${named(0)}–${named(packed.length - 1)}`);
