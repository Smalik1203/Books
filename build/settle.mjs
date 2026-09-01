#!/usr/bin/env node
/* Move the last block of the named pages onto the next page.
   The packer's margin arithmetic runs a shade optimistic; this
   settles the two or three pages it overshoots without touching
   a word of the prose.

     node build/settle.mjs <pages dir> 4 7 12 19
*/
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const [dir, ...nums] = process.argv.slice(2);
if (!dir || !nums.length) { console.error('usage: node build/settle.mjs <dir> <page> ...'); process.exit(1); }

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

const write = async (p, parsed) =>
  writeFile(p, parsed.head + '\n\n'
    + parsed.blocks.map((b) => '      ' + b.trim().split('\n').join('\n      ')).join('\n\n')
    + '\n\n    ' + parsed.tail.trimStart());

const files = (await readdir(dir)).filter((f) => /^p\d+\.html$/.test(f)).sort();
for (const n of nums.map(Number).sort((a, b) => b - a)) {
  const a = path.join(dir, files[n - 1]);
  const b = path.join(dir, files[n]);
  if (!files[n]) { console.log(`  page ${n} is the last — nothing to move it to`); continue; }
  const pa = split(await readFile(a, 'utf8'));
  const pb = split(await readFile(b, 'utf8'));
  const moved = pa.blocks.pop();
  pb.blocks.unshift(moved);
  await write(a, pa);
  await write(b, pb);
  console.log(`  moved one block from page ${n} to ${n + 1}`);
}
