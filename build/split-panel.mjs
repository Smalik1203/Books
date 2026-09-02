#!/usr/bin/env node
/* Run a text panel over a page break.
 *
 * The same job as split-example, for every panel that is text rather
 * than picture: a worked example, a key idea, a reflect prompt. The
 * first k rows move back onto the short page as --head; the rest stay
 * overleaf as --tail, without the tab or title, because it is the
 * same panel resumed and not a new one.
 *
 *   node build/split-panel.mjs <pages dir> <short page> <k>
 *
 * A figure is never split: half a diagram is unreadable.
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const [dir, pageArg, kArg] = process.argv.slice(2);
if (!dir || !pageArg || !kArg) {
  console.error('usage: node build/split-panel.mjs <pages dir> <short page> <k>');
  process.exit(1);
}

function topLevelChildren(html) {
  const out = [];
  let i = 0, depth = 0, start = -1;
  const VOID = /^(br|hr|img|input|meta|link|source|use|path|circle|line|rect|polygon|polyline|ellipse|stop)$/i;
  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt < 0) break;
    if (html.startsWith('<!--', lt)) { i = html.indexOf('-->', lt) + 3; continue; }
    const m = /^<(\/?)([a-zA-Z][\w-]*)([^>]*)>/.exec(html.slice(lt));
    if (!m) { i = lt + 1; continue; }
    const [full, slash, tag, attrs] = m;
    const selfClosing = attrs.trimEnd().endsWith('/') || VOID.test(tag);
    if (!slash && !selfClosing) { if (depth === 0) start = lt; depth++; }
    else if (slash) { depth--; if (depth === 0 && start >= 0) { out.push([start, lt + full.length]); start = -1; } }
    else if (depth === 0) out.push([lt, lt + full.length]);
    i = lt + full.length;
  }
  return out;
}

const pad = (n) => 'p' + String(n).padStart(3, '0') + '.html';
const rd = async (f) => { const r = await readFile(f, 'utf8'); return [r.replace(/\r\n/g, '\n'), /\r\n/.test(r)]; };
const wr = (f, s, c) => writeFile(f, c ? s.replace(/\n/g, '\r\n') : s);

const short = Number(pageArg), k = Number(kArg);
const headFile = path.join(dir, pad(short));
const tailFile = path.join(dir, pad(short + 1));
let [headHtml, headCRLF] = await rd(headFile);
let [tailHtml, tailCRLF] = await rd(tailFile);

/* Which panel opens the next page? */
const mainOpen = tailHtml.indexOf('<div class="page__main">');
const afterMain = tailHtml.indexOf('>', mainOpen) + 1;
const KINDS = [
  { cls: 'c-example', body: 'c-example__body', keep: ['c-example__tab'] },
  { cls: 'c-reflect', body: 'c-reflect__body', keep: ['c-reflect__icon', 'c-reflect__mark', 'c-reflect__title'], box: 'c-reflect__box' },
  { cls: 'c-keyidea', body: null, keep: ['c-keyidea__title'] },
];
const lead = tailHtml.slice(afterMain).trimStart();
const kind = KINDS.find(k2 => lead.startsWith('<div class="' + k2.cls + '"'));
if (!kind) { console.error('page ' + (short + 1) + ' does not open with a splittable text panel'); process.exit(1); }

const panelStart = afterMain + tailHtml.slice(afterMain).indexOf('<div class="' + kind.cls + '"');
const panelEnd = panelStart + (() => {
  const kids = topLevelChildren(tailHtml.slice(panelStart));
  return kids.length ? kids[0][1] : 0;
})();
const panel = tailHtml.slice(panelStart, panelEnd);

/* Rows are the children of the body (or of the panel itself, for a
   key idea, whose title is simply the first child). */
let rowsHost, rowsOffset;
if (kind.body) {
  const b = panel.indexOf('<div class="' + kind.body + '">');
  rowsOffset = panel.indexOf('>', b) + 1;
  const kids = topLevelChildren(panel.slice(rowsOffset));
  rowsHost = kids;
} else {
  const inner = panel.indexOf('>') + 1;
  rowsOffset = inner;
  rowsHost = topLevelChildren(panel.slice(inner)).filter(([s]) =>
    !panel.slice(rowsOffset + s, rowsOffset + s + 60).includes(kind.keep[0]));
}
if (k >= rowsHost.length) { console.error('panel has only ' + rowsHost.length + ' row(s)'); process.exit(1); }

const cutAt = rowsOffset + rowsHost[k - 1][1];
// Both halves are bounded by rows, never by the end of the panel.
// Slicing the tail to the end of the panel carried the panel's own
// closing tags into it — one for a key idea, two for an example,
// three for a reflect box — and every split shipped a page with a
// stray </div> that the browser repaired and the reader never saw.
const lastEnd = rowsOffset + rowsHost[rowsHost.length - 1][1];
const headRows = panel.slice(rowsOffset + rowsHost[0][0], cutAt).replace(/\s+$/, '');
const tailRows = panel.slice(cutAt, lastEnd).replace(/^\s*\n/, '').replace(/\s+$/, '');

const keptMarkup = kind.keep
  .map(c => (panel.match(new RegExp('<div class="' + c + '">[\\s\\S]*?<\\/div>\\s*(?=<div|$)')) || [''])[0].trimEnd())
  .filter(Boolean);

const I = '      ';
let headBlock, tailBlock;
if (kind.cls === 'c-reflect') {
  const icon = (panel.match(/<div class="c-reflect__icon">[\s\S]*?<\/svg>\s*<\/div>/) || [''])[0];
  const title = (panel.match(/<div class="c-reflect__title">[\s\S]*?<\/div>/) || [''])[0];
  const mark = (panel.match(/<div class="c-reflect__mark">[\s\S]*?<\/div>/) || [''])[0];
  headBlock = `\n${I}<div class="c-reflect c-reflect--head">\n${I}  ${icon}\n${I}  <div class="c-reflect__box">\n${I}    ${mark}\n${I}    ${title}\n${I}    <div class="c-reflect__body">\n${headRows}\n${I}    </div>\n${I}  </div>\n${I}</div>\n`;
  tailBlock = `${I}<div class="c-reflect c-reflect--tail">\n${I}  <div class="c-reflect__box">\n${I}    <div class="c-reflect__body">\n${tailRows}\n${I}    </div>\n${I}  </div>\n${I}</div>`;
} else if (kind.cls === 'c-example') {
  const tab = (panel.match(/<div class="c-example__tab">[\s\S]*?<\/div>/) || [''])[0];
  headBlock = `\n${I}<div class="c-example c-example--head">\n${I}  ${tab}\n${I}  <div class="c-example__body">\n${headRows}\n${I}  </div>\n${I}</div>\n`;
  tailBlock = `${I}<div class="c-example c-example--tail">\n${I}  <div class="c-example__body">\n${tailRows}\n${I}  </div>\n${I}</div>`;
} else {
  const title = (panel.match(/<div class="c-keyidea__title">[\s\S]*?<\/div>/) || [''])[0];
  headBlock = `\n${I}<div class="c-keyidea c-keyidea--head">\n${I}  ${title}\n${headRows}\n${I}</div>\n`;
  tailBlock = `${I}<div class="c-keyidea c-keyidea--tail">\n${tailRows}\n${I}</div>`;
}

const closeAt = headHtml.lastIndexOf('    </div>\n  </div>\n</section>');
if (closeAt < 0) { console.error('page ' + short + ': unexpected shape'); process.exit(1); }
headHtml = headHtml.slice(0, closeAt).replace(/\s+$/, '\n') + headBlock + '\n    </div>\n  </div>\n</section>\n';
// The panel's own indentation is already in the text before it, and
// the new block brings its own, so one of the two has to go.
tailHtml = tailHtml.slice(0, panelStart).replace(/[ \t]+$/, '') + tailBlock + tailHtml.slice(panelEnd);

await wr(headFile, headHtml, headCRLF);
await wr(tailFile, tailHtml, tailCRLF);
console.log('  moved ' + k + ' row(s) of the ' + kind.cls.replace('c-', '') + ' onto page ' + short);
