#!/usr/bin/env node
/* ============================================================
   Put a divided panel back together where it no longer needs to
   be in two.

     node build/join-panels.mjs <pages dir>

   split-panel divides an example across a page break so a short
   page can be filled. Repack afterwards may well bring the two
   halves back onto one page — and there they print as two panels,
   one of them tabbed and one of them not, where the reader should
   see a single example. Nothing complains: both halves are valid
   markup and the page fits.

   So wherever a head is immediately followed by its own tail, the
   two are made one panel again. The reverse operation of
   split-panel, and the pass that has to follow every repack of a
   chapter that has been through it.
   ============================================================ */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const dir = process.argv[2];
if (!dir) { console.error('usage: node build/join-panels.mjs <pages dir>'); process.exit(1); }

const KINDS = ['c-example', 'c-reflect', 'c-keyidea'];

/* The extent of the element that starts at `from`. */
function element(html, from) {
  let i = from, depth = 0;
  const VOID = /^(br|hr|img|input|meta|link|source|use|path|circle|line|rect|polygon|polyline|ellipse|stop)$/i;
  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt < 0) break;
    if (html.startsWith('<!--', lt)) { i = html.indexOf('-->', lt) + 3; continue; }
    const m = /^<(\/?)([a-zA-Z][\w-]*)([^>]*)>/.exec(html.slice(lt));
    if (!m) { i = lt + 1; continue; }
    const [full, slash, tag, attrs] = m;
    const self = attrs.trimEnd().endsWith('/') || VOID.test(tag);
    if (!slash && !self) depth++;
    else if (slash) { depth--; if (depth === 0) return lt + full.length; }
    i = lt + full.length;
  }
  return html.length;
}

/* The rows a panel holds: the children of its __body, or of the
   panel itself where the kind has no body wrapper. */
function rowsOf(panel, kind) {
  const b = panel.indexOf(`<div class="${kind}__body">`);
  if (b >= 0) {
    const open = panel.indexOf('>', b) + 1;
    return panel.slice(open, element(panel, b) - '</div>'.length).replace(/^\s*\n/, '').replace(/\s+$/, '');
  }
  // a key idea: everything after its title
  const t = panel.indexOf(`<div class="${kind}__title">`);
  const from = t < 0 ? panel.indexOf('>') + 1 : element(panel, t);
  return panel.slice(from, panel.lastIndexOf('</div>')).replace(/^\s*\n/, '').replace(/\s+$/, '');
}

const I = '      ';
let joined = 0;

for (const f of (await readdir(dir)).filter(x => /^p\d+.*\.html$/.test(x))) {
  const file = path.join(dir, f);
  let html = await readFile(file, 'utf8');
  let again = true;
  while (again) {
    again = false;
    for (const kind of KINDS) {
      const open = `<div class="${kind} ${kind}--head">`;
      const hs = html.indexOf(open);
      if (hs < 0) continue;
      const he = element(html, hs);
      const gap = html.slice(he).match(/^\s*/)[0];
      const ts = he + gap.length;
      if (!html.startsWith(`<div class="${kind} ${kind}--tail">`, ts)) continue;
      const te = element(html, ts);

      const head = html.slice(hs, he), tail = html.slice(ts, te);
      // Everything of the head but its rows, with the modifier dropped.
      const rows = rowsOf(head, kind) + '\n' + rowsOf(tail, kind);
      let merged = head.replace(`${kind} ${kind}--head`, kind);
      const hb = merged.indexOf(`<div class="${kind}__body">`);
      if (hb >= 0) {
        const open2 = merged.indexOf('>', hb) + 1;
        merged = merged.slice(0, open2) + '\n' + rows + `\n${I}  </div>\n${I}</div>`;
      } else {
        const t = merged.indexOf(`<div class="${kind}__title">`);
        const from = t < 0 ? merged.indexOf('>') + 1 : element(merged, t);
        merged = merged.slice(0, from) + '\n' + rows + `\n${I}</div>`;
      }
      html = html.slice(0, hs) + merged + html.slice(te);
      joined++;
      again = true;
      break;
    }
  }
  await writeFile(file, html);
}
console.log(joined ? `  joined ${joined} divided panel(s) that no longer need dividing`
                   : '  no divided panel sits whole on one page');
