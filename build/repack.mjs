#!/usr/bin/env node
/* ============================================================
   Repack a chapter onto its pages.

     node build/repack.mjs class-9/ch04-algebraic-identities-a4

   Fixed pages mean the page break IS the source file, so changing
   the trim changes where every break falls. Doing that by hand is
   thirty files of guesswork; this measures instead.

   It renders the chapter once, asks the browser how tall every
   block actually is, fills each page until the next block will
   not fit, and rewrites the files. Blocks are never split — a
   component that says break-inside: avoid means it — and a
   heading is never left as the last thing on a page.

   Run the builder afterwards: this proposes the packing, the
   overflow check is still what proves it.
   ============================================================ */

import { readFile, writeFile, readdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

const target = process.argv[2];
const DRY = process.argv.includes('--dry');
if (!target) {
  console.error('usage: node build/repack.mjs <class-9/chapter-dir> [--dry]');
  process.exit(1);
}

/* ---- Source: split each page into its top-level blocks ----- */
const OPEN = /<(\w[\w-]*)\b[^>]*?(\/?)>/g;

function topLevelBlocks(html) {
  // everything between page__main and its close, split at depth 0
  const start = html.indexOf('<div class="page__main">');
  if (start < 0) return null;
  const from = html.indexOf('>', start) + 1;
  let depth = 0, i = from, out = [], blockStart = -1;
  // real HTML void elements only. SVG shapes are self-closed in our
  // markup, and <text>, <marker>, <g> all carry a closing tag.
  const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img',
    'input', 'link', 'meta', 'source', 'track', 'wbr']);
  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt < 0) break;
    if (html.startsWith('<!--', lt)) { i = html.indexOf('-->', lt) + 3; continue; }
    // maths writes bare '<' — a tag needs a letter or a slash next
    if (!/[a-zA-Z/!]/.test(html[lt + 1] || '')) { i = lt + 1; continue; }
    const close = html.startsWith('</', lt);
    const gt = html.indexOf('>', lt);
    if (gt < 0) break;
    const tag = html.slice(lt + (close ? 2 : 1), gt).match(/^[\w-]+/)?.[0]?.toLowerCase();
    const selfClosing = html[gt - 1] === '/';
    if (close) {
      depth--;
      if (depth === 0 && blockStart >= 0) { out.push(html.slice(blockStart, gt + 1)); blockStart = -1; }
      if (depth < 0) return { blocks: out, tail: html.slice(lt) };   // hit </div> of page__main
    } else if (!selfClosing && !VOID.has(tag)) {
      if (depth === 0) blockStart = lt;
      depth++;
    } else if (depth === 0) {
      out.push(html.slice(lt, gt + 1));
    }
    i = gt + 1;
  }
  return { blocks: out, tail: '' };
}

/* ---- Measure: how tall is every block, on the real page ---- */
const PROBE = `
<script>
window.addEventListener('load', function () {
  Promise.resolve(document.fonts && document.fonts.ready).then(function () {
    var out = [];
    document.querySelectorAll('.page').forEach(function (pg) {
      var body = pg.querySelector('.page__body');
      var main = pg.querySelector('.page__main');
      if (!body || !main) return;
      var blocks = [];
      var kids = main.children;
      for (var n = 0; n < kids.length; n++) {
        var el = kids[n];
        var cs = getComputedStyle(el);
        // KaTeX overhangs its line box, so a block can print taller than
        // its own rectangle. Measure the ink, not the box.
        var r = el.getBoundingClientRect(), deep = r.bottom;
        var inner = el.querySelectorAll("*");
        for (var k = 0; k < inner.length; k++) {
          var kr = inner[k].getBoundingClientRect();
          if (kr.height && kr.bottom > deep) deep = kr.bottom;
        }
        blocks.push({
          h: Math.max(r.height, deep - r.top),
          mt: parseFloat(cs.marginTop) || 0,
          mb: parseFloat(cs.marginBottom) || 0,
          tag: el.tagName.toLowerCase(),
          cls: el.className || '',
        });
      }
      out.push({
        folio: pg.dataset.folio,
        avail: body.getBoundingClientRect().height,
        opener: pg.className.indexOf('page--opener') >= 0,
        blocks: blocks,
      });
    });
    document.title = 'PACK' + JSON.stringify(out);
  });
});
<\/script>`;

async function measure(htmlPath) {
  const chrome = CHROME.find(existsSync);
  if (!chrome) throw new Error('No Chrome or Edge found — set one in CHROME.');
  const tmp = htmlPath.replace(/\.html$/, '-pack.html');
  const src = await readFile(htmlPath, 'utf8');
  await writeFile(tmp, src.replace('</head>', PROBE + '\n</head>'));
  const { stdout } = await run(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    '--virtual-time-budget=12000', '--dump-dom',
    'file:///' + tmp.replace(/\\/g, '/'),
  ], { maxBuffer: 1 << 26 });
  await rm(tmp, { force: true });
  const raw = stdout.match(/PACK(\[[\s\S]*?\])<\/title>/)?.[1];
  if (!raw) throw new Error('the page did not report its blocks');
  return JSON.parse(raw);
}

/* ---- Pack --------------------------------------------------
   Margins collapse between siblings, so a block's cost on a page
   is its height plus whichever margin is larger at the join. */
const isHeading = (b) => b.tag === 'h2' || b.tag === 'h3';

function pack(pages) {
  const flat = [];
  for (const [p, page] of pages.entries()) {
    for (const [i, b] of page.blocks.entries()) flat.push({ ...b, from: p, at: i });
  }

  const out = [];
  let page = { blocks: [], used: 0, avail: pages[0].avail, opener: true };
  let prevMb = 0;

  const push = () => { out.push(page); };

  for (const b of flat) {
    const join = Math.max(prevMb, b.mt);
    const cost = (page.blocks.length ? join : 0) + b.h;
    // margins collapse in ways this arithmetic only approximates, so
    // leave a little air rather than shipping a page that overflows
    if (page.blocks.length && page.used + cost > page.avail) {
      // never strand a heading at the foot of a page
      while (page.blocks.length && isHeading(page.blocks[page.blocks.length - 1])) {
        const moved = page.blocks.pop();
        page.used -= moved.h + moved.mt;
        flatUnshift.push(moved);
      }
      push();
      page = { blocks: [], used: 0, avail: pages[1] ? pages[1].avail : pages[0].avail, opener: false };
      prevMb = 0;
      while (flatUnshift.length) {
        const m = flatUnshift.pop();
        page.blocks.push(m);
        page.used += m.h + (page.blocks.length > 1 ? m.mt : 0);
        prevMb = m.mb;
      }
      page.used += b.h;
      page.blocks.push(b);
      prevMb = b.mb;
      continue;
    }
    page.used += cost;
    page.blocks.push(b);
    prevMb = b.mb;
  }
  if (page.blocks.length) push();
  return out;
}
const flatUnshift = [];

/* ---- Rewrite the page files -------------------------------- */
async function rewrite(dir, packed, sourceBlocks, opener) {
  const files = (await readdir(dir)).filter((f) => /^p\d+.*\.html$/.test(f));
  for (const f of files) await rm(path.join(dir, f));

  for (const [i, page] of packed.entries()) {
    // strip whatever indentation a block arrived with before adding ours,
    // or every pass buries the source another level deep
    const NL = String.fromCharCode(10);
    const dedent = (s) => {
      const ls = s.trim().split(NL);
      const rest = ls.slice(1).filter((l) => l.trim());
      const min = rest.length ? Math.min(...rest.map((l) => l.match(/^ */)[0].length)) : 0;
      return [ls[0], ...ls.slice(1).map((l) => l.slice(min))].join(NL);
    };
    const body = page.blocks
      .map((b) => "      " + dedent(sourceBlocks[b.from][b.at]).split(NL).join(NL + "      "))
      .join(NL + NL);
    const head = i === 0 && opener ? opener.head : '';
    const cls = i === 0 && opener ? ' page--opener page--haschead' : '';
    const html = `<section class="page${cls}">\n${head}`
      + '  <div class="page__body">\n    <div class="page__main">\n\n'
      + body + '\n\n    </div>\n  </div>\n</section>\n';
    await writeFile(path.join(dir, 'p' + String(i + 1).padStart(3, '0') + '.html'), html);
  }
  return packed.length;
}

/* ---- Go ---------------------------------------------------- */
const dir = path.join(ROOT, 'pages', target);
const built = path.join(ROOT, 'build', target + '.html');

const files = (await readdir(dir)).filter((f) => /^p\d+.*\.html$/.test(f)).sort();
const sourceBlocks = [];
let opener = null;
for (const [i, f] of files.entries()) {
  const html = await readFile(path.join(dir, f), 'utf8');
  const parsed = topLevelBlocks(html);
  if (!parsed) throw new Error(f + ' has no page__main');
  sourceBlocks.push(parsed.blocks);
  if (i === 0 && html.includes('page--opener')) {
    const a = html.indexOf('<div class="chapterhead">');
    const b = html.indexOf('<div class="page__body">');
    opener = { head: a >= 0 ? '\n' + html.slice(a, b).trimEnd() + '\n\n' : '' };
  }
}

const measured = await measure(built);
if (measured.length !== sourceBlocks.length) {
  throw new Error(`measured ${measured.length} pages but read ${sourceBlocks.length} files`);
}
for (const [i, m] of measured.entries()) {
  if (m.blocks.length !== sourceBlocks[i].length) {
    throw new Error(`page ${m.folio}: measured ${m.blocks.length} blocks, parsed ${sourceBlocks[i].length}`);
  }
}

const packed = pack(measured);
const before = measured.length, after = packed.length;
console.log(`  ${before} pages in, ${after} out`);
for (const [i, p] of packed.entries()) {
  console.log(`    page ${String(i + 1).padStart(2)}  ${String(Math.round(p.used / p.avail * 100)).padStart(3)}%  ${p.blocks.length} blocks`);
}
if (DRY) { console.log('  --dry: nothing written'); process.exit(0); }
await rewrite(dir, packed, sourceBlocks, opener);
console.log(`  wrote ${after} page files — now run the builder to check them`);
