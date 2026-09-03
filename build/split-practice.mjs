#!/usr/bin/env node
/* Split every exercise set into one block per question, so the
   packer can flow questions across pages instead of treating a
   whole set as one indivisible atom. The band header stays on the
   first; the rest carry data-start so the numbering continues. */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const dir = process.argv[2];
if (!dir) { console.error('usage: node build/split-practice.mjs <pages dir>'); process.exit(1); }

// Elements that close nothing. A <br> counted as an opening tag puts
// the depth permanently out by one, and every list after it is missed.
const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img',
  'input', 'link', 'meta', 'source', 'track', 'wbr']);

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
    } else if (!self && !VOID_TAGS.has(tag)) {
      if (depth === 0 && tag === tagName) start = lt;
      depth++;
    }
    i = gt + 1;
  }
  return { items: out, end: html.length };
}

/* components.css spells out one counter-reset rule per data-start,
   because there is no arithmetic in CSS. Split past the last one and
   the questions silently renumber from 1. */
const COUNTER_MAX = 18;

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
    // Maths writes a bare '<', and a comment writes a '<' that opens
    // nothing. Both were counted as tags here: the depth went wrong,
    // and once the scan ran out of tags altogether it restarted from
    // the first '>' in the file and never stopped. Same guards as the
    // parser above.
    const blockEnd = (() => {
      let depth = 0, i = at;
      while (i < html.length) {
        const lt = html.indexOf('<', i);
        if (lt < 0) break;
        if (html.startsWith('<!--', lt)) {
          const end = html.indexOf('-->', lt);
          if (end < 0) break;
          i = end + 3;
          continue;
        }
        if (!/[a-zA-Z/!]/.test(html[lt + 1] || '')) { i = lt + 1; continue; }
        const gt = html.indexOf('>', lt);
        if (gt < 0) break;
        const close = html.startsWith('</', lt);
        const tag = html.slice(lt + (close ? 2 : 1), gt).match(/^[\w-]+/)?.[0]?.toLowerCase();
        const self = html[gt - 1] === '/';
        if (close) { depth--; if (depth === 0) return gt + 1; }
        else if (!self && !VOID_TAGS.has(tag)) depth++;
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

  /* A set does not have to arrive in a .c-practice wrapper. Some pages
     carry a bare <ol class="c-questions"> as a direct child of
     page__main — no band, because the band was two pages back — and the
     loop above never saw those: it looks for the wrapper. One of them
     was 35 items long and stood as a single 230mm atom, which fitted
     an A4 text block with 20mm to spare and clipped the moment the
     standard trim came down. Same split, same shape out: one <ol> per
     question, numbering carried on data-start, no wrapper introduced
     so nothing about the page changes but where it may break. */
  const mainAt = html.indexOf('<div class="page__main">');
  if (mainAt >= 0) {
    const from = html.indexOf('>', mainAt) + 1;
    const bare = topLevel(html, from, 'ol').items
      .filter(([s]) => /^<ol class="[^"]*c-questions/.test(html.slice(s, s + 60)));
    for (const [s, e] of bare.reverse()) {
      const ol = html.slice(s, e);
      const tagEnd = ol.indexOf('>') + 1;
      const cls = ol.slice(0, tagEnd).match(/class="([^"]*)"/)[1];
      const startNo = Number(ol.slice(0, tagEnd).match(/data-start="(\d+)"/)?.[1] || 1);
      const { items } = topLevel(ol, tagEnd, 'li');
      if (items.length < 2) continue;
      const indent = (html.slice(0, s).match(/\n([ \t]*)$/) || [, '      '])[1];
      const parts = items.map(([a, b], n) => {
        const open = startNo + n === 1
          ? `<ol class="${cls}">`
          : `<ol class="${cls}" data-start="${startNo + n}">`;
        return open + '\n' + indent + '  ' + ol.slice(a, b).trim() + '\n' + indent + '</ol>';
      });
      html = html.slice(0, s) + parts.join('\n\n' + indent) + html.slice(e);
      changed = true;
      total += items.length - 1;
      if (startNo + items.length - 1 > COUNTER_MAX) {
        console.warn(`  ! ${f}: numbering reaches ${startNo + items.length - 1};`
          + ` components.css defines data-start only to ${COUNTER_MAX}`);
      }
    }
  }

  if (changed) await writeFile(p, html);
}
console.log(`  split into ${total} extra question blocks`);
