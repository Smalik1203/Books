#!/usr/bin/env node
/* Move the last block of the named pages onto a NEW page of its own,
   inserted directly after.

   settle.mjs pushes a block onto the following page, which is right
   when that page has room. When it does not — a tall example panel
   with nowhere to land — settle only relays the overflow, and each
   round makes some later page worse. This is the other move: give the
   block a page rather than a neighbour.

     node build/spill.mjs <pages dir> 5 13

   Page numbers are read before any move, so several may be given at
   once. Run the builder afterwards; repack will tidy the result.
*/
import { readFile, writeFile, readdir, unlink } from 'node:fs/promises';
import path from 'node:path';

const [dir, ...nums] = process.argv.slice(2);
if (!dir || !nums.length) {
  console.error('usage: node build/spill.mjs <dir> <page> ...');
  process.exit(1);
}

/* Split a page file into its head, its top-level blocks and its tail —
   the same shape settle.mjs uses. */
function split(html) {
  const i = html.indexOf('<div class="page__main">');
  const from = html.indexOf('>', i) + 1;
  const blocks = [];
  let depth = 0, j = from, start = -1;
  while (j < html.length) {
    const lt = html.indexOf('<', j);
    if (lt < 0) break;
    if (!/[a-zA-Z/!]/.test(html[lt + 1] || '')) { j = lt + 1; continue; }
    if (html.startsWith('<!--', lt)) { j = html.indexOf('-->', lt) + 3; continue; }
    const close = html.startsWith('</', lt);
    const gt = html.indexOf('>', lt);
    const self = html[gt - 1] === '/';
    if (close) {
      depth--;
      if (depth === 0 && start >= 0) { blocks.push(html.slice(start, gt + 1)); start = -1; }
      if (depth < 0) return { head: html.slice(0, from), blocks, tail: html.slice(lt) };
    } else if (!self) { if (depth === 0) start = lt; depth++; }
    j = gt + 1;
  }
  return { head: html.slice(0, from), blocks, tail: '' };
}

const render = (head, blocks, tail) =>
  head + '\n\n'
  + blocks.map((b) => '      ' + b.trim().split('\n').join('\n      ')).join('\n\n')
  + '\n\n    ' + tail.trimStart();

const files = (await readdir(dir)).filter((f) => /^p\d+\.html$/.test(f)).sort();
const pages = [];
for (const f of files) pages.push(split(await readFile(path.join(dir, f), 'utf8')));

/* A plain interior page, for the block to land on. */
const PLAIN_HEAD = '<section class="page">\n  <div class="page__body">\n    <div class="page__main">';
const PLAIN_TAIL = '</div>\n  </div>\n</section>\n';

for (const n of nums.map(Number).sort((a, b) => b - a)) {
  const p = pages[n - 1];
  if (!p) { console.log(`  page ${n} does not exist`); continue; }
  if (p.blocks.length < 2) { console.log(`  page ${n} holds one block — cannot spill`); continue; }
  const moved = p.blocks.pop();
  pages.splice(n, 0, { head: PLAIN_HEAD, blocks: [moved], tail: PLAIN_TAIL });
  console.log(`  page ${n}: last block moved onto a new page ${n + 1}`);
}

for (const f of files) await unlink(path.join(dir, f));
for (let i = 0; i < pages.length; i++) {
  const name = 'p' + String(i + 1).padStart(3, '0') + '.html';
  await writeFile(path.join(dir, name), render(pages[i].head, pages[i].blocks, pages[i].tail));
}
console.log(`  ${files.length} pages in, ${pages.length} out`);
