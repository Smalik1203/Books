#!/usr/bin/env node
/* Move the FIRST block of the named pages back onto the page before.
   The mirror of settle.mjs, for when a settle overshot — or when the
   real build shows the previous page had room after all.

     node build/unsettle.mjs <pages dir> 13 17
*/
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const [dir, ...nums] = process.argv.slice(2);
if (!dir || !nums.length) { console.error('usage: node build/unsettle.mjs <dir> <page> ...'); process.exit(1); }

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

const pad = (n) => path.join(dir, 'p' + String(n).padStart(3, '0') + '.html');

for (const n of nums.map(Number)) {
  const prev = split(await readFile(pad(n - 1), 'utf8'));
  const cur = split(await readFile(pad(n), 'utf8'));
  if (!cur.blocks.length) { console.log(`  page ${n} is empty`); continue; }
  const moved = cur.blocks.shift();
  prev.blocks.push(moved);
  await writeFile(pad(n - 1), render(prev.head, prev.blocks, prev.tail));
  await writeFile(pad(n), render(cur.head, cur.blocks, cur.tail));
  console.log(`  moved one block from page ${n} to ${n - 1}`);
}
