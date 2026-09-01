#!/usr/bin/env node
/* Split every exercise set into one block per question, so the
   packer can flow questions across pages instead of treating a
   whole set as one indivisible atom. The band header stays on the
   first; the rest carry data-start so the numbering continues. */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const dir = process.argv[2];
if (!dir) { console.error('usage: node build/split-practice.mjs <pages dir>'); process.exit(1); }

function topLevel(html, from, tagName) {
  const out = [];
  let i = from, depth = 0, start = -1;
  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt < 0) break;
    if (!/[a-zA-Z/!]/.test(html[lt + 1] || '')) { i = lt + 1; continue; }
    if (html.startsWith('<!--', lt)) { i = html.indexOf('-->', lt) + 3; continue; }
    const close = html.startsWith('</', lt);
    const gt = html.indexOf('>', lt);
    if (gt < 0) break;
    const tag = html.slice(lt + (close ? 2 : 1), gt).match(/^[\w-]+/)?.[0]?.toLowerCase();
    const self = html[gt - 1] === '/';
    if (close) {
      depth--;
      if (depth === 0 && start >= 0) { out.push([start, gt + 1]); start = -1; }
      if (depth < 0) return { items: out, end: lt };
    } else if (!self) {
      if (depth === 0 && tag === tagName) start = lt;
      depth++;
    }
    i = gt + 1;
  }
  return { items: out, end: html.length };
}

let total = 0;
for (const f of (await readdir(dir)).filter((x) => /^p\d+.*\.html$/.test(x))) {
  const p = path.join(dir, f);
  let html = await readFile(p, 'utf8');
  let changed = false;

  for (;;) {
    // A set that already carries on from the previous page is just as
    // splittable as one that opens with a band header — and it is
    // usually the one holding the long questions. Taking only the
    // opening block left those sets as single indivisible atoms.
    const pi = html.indexOf('<div class="c-practice">');
    const ai = html.indexOf('<div class="c-practice c-practice--cont">');
    const at = pi < 0 ? ai : (ai < 0 ? pi : Math.min(pi, ai));
    if (at < 0) break;
    const cont = at === ai && (pi < 0 || ai < pi);
    const done = cont ? 'c-practice-done c-practice--cont' : 'c-practice-done';
    const openTag = cont
      ? '<div class="c-practice c-practice--cont">'
      : '<div class="c-practice">';

    // find this practice block's extent
    const blockEnd = (() => {
      let depth = 0, i = at;
      while (i < html.length) {
        const lt = html.indexOf('<', i);
        const close = html.startsWith('</', lt);
        const gt = html.indexOf('>', lt);
        const self = html[gt - 1] === '/';
        if (close) { depth--; if (depth === 0) return gt + 1; }
        else if (!self) depth++;
        i = gt + 1;
      }
      return html.length;
    })();
    const block = html.slice(at, blockEnd);

    const olStart = block.indexOf('<ol class="c-questions');
    if (olStart < 0) { html = html.slice(0, at) + block.replace(openTag, `<div class="${done}">`) + html.slice(blockEnd); continue; }
    const olTagEnd = block.indexOf('>', olStart) + 1;
    const olTag = block.slice(olStart, olTagEnd);
    const { items } = topLevel(block, olTagEnd, 'li');
    if (items.length < 2) { html = html.slice(0, at) + block.replace(openTag, `<div class="${done}">`) + html.slice(blockEnd); continue; }

    const head = block.slice(block.indexOf('>', at - at) + 1, olStart).trim();
    const startNo = Number(olTag.match(/data-start="(\d+)"/)?.[1] || 1);
    const cls = olTag.match(/class="([^"]*)"/)[1];

    const parts = items.map(([s, e], n) => {
      const li = block.slice(s, e);
      const wrapper = n === 0 ? done : 'c-practice-done c-practice--cont';
      const ol = n === 0 && startNo === 1
        ? `<ol class="${cls}">`
        : `<ol class="${cls}" data-start="${startNo + n}">`;
      const inner = (n === 0 ? head + '\n        ' : '') + ol + '\n          '
        + li.trim().split('\n').join('\n  ') + '\n        </ol>';
      return `<div class="${wrapper}">\n        ${inner}\n      </div>`;
    });
    html = html.slice(0, at) + parts.join('\n\n      ') + html.slice(blockEnd);
    changed = true;
    total += items.length - 1;
  }

  html = html.replace(/c-practice-done/g, 'c-practice');
  if (changed) await writeFile(p, html);
}
console.log(`  split into ${total} extra question blocks`);
