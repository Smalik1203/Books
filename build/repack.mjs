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
   component that says break-inside: avoid means it — and nothing
   that opens new matter is left at the foot of a page over fewer
   than five lines of it. build/orphans.mjs reports on that rule.

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
  process.env.CHROME,
  process.env.CHROME_PATH,
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];
// Chrome refuses to start its sandbox as root, which is how a CI
// container usually runs. Only then is the flag added.
const SANDBOX = process.getuid?.() === 0 ? ['--no-sandbox'] : [];

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
      /* A block's top margin has to be the one it will have wherever
         this repack puts it, and page.css zeroes the margin of
         whatever lands first on a page. Read it where it stands and
         every block that happens to be first on its page reports 0 —
         which is why a page could come back one to seven millimetres
         into the bottom margin after a pack that thought it fitted.
         A spacer at the head of the flow makes nothing :first-child,
         so every margin below is the natural one. It has no height
         and no margins of its own, so no measurement moves but the
         one being corrected. */
      var shim = document.createElement('div');
      shim.style.cssText = 'height:0;margin:0;padding:0;border:0';
      main.insertBefore(shim, main.firstChild);
      var kids = Array.prototype.slice.call(main.children, 1);
      // What an opener is, and where its own head stops. A section
      // head is all head and its matter is the blocks after it; an
      // example carries its tab and its matter in one box, so the
      // box's own height is partly promise and partly payment.
      // A --head panel is neither: it is the near half of a panel
      // close-gaps ran over the break on purpose, and its matter
      // continues overleaf as the same tinted field.
      var opensWith = function (el) {
        var t = el.tagName.toLowerCase();
        var cn = ' ' + (el.className || '') + ' ';
        if (cn.indexOf('--head') >= 0) return null;
        if (t === 'h2' || t === 'h3') return { kind: t, head: el };
        if (el.querySelector('.c-stage__title')) return { kind: 'stage', head: el };
        var band = el.querySelector('.c-practice__head');
        if (band) return { kind: 'exercise', head: band };
        if (cn.indexOf('c-example') >= 0)
          return { kind: 'example', head: el.querySelector('.c-example__tab') || el };
        // a Beyond the Book problem. Its answer, .c-solution, is the
        // other half of the same item and opens nothing.
        if (cn.indexOf('c-problem') >= 0)
          return { kind: 'problem', head: el.querySelector('.c-problem__tag') || el };
        return null;
      };
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
        var o = opensWith(el);
        blocks.push({
          h: Math.max(r.height, deep - r.top),
          mt: parseFloat(cs.marginTop) || 0,
          mb: parseFloat(cs.marginBottom) || 0,
          tag: el.tagName.toLowerCase(),
          cls: el.className || '',
          // a block that only announces: a stage head, or an exercise
          // band with no questions of its own under it
          leads: !!el.querySelector('.c-stage__title')
            || (!!el.querySelector('.c-practice__head') && !el.querySelector('.c-questions')),
          // what this block starts, and how much of its own height is
          // the title rather than the matter under it
          opens: o ? o.kind : null,
          headH: o ? Math.max(0, o.head.getBoundingClientRect().bottom - r.top) : 0,
        });
      }
      main.removeChild(shim);
      out.push({
        folio: pg.dataset.folio,
        avail: body.getBoundingClientRect().height,
        opener: pg.className.indexOf('page--opener') >= 0,
        // one line of body text, measured rather than assumed: the
        // two editions set different scales
        lh: (function () {
          var q = main.querySelector('p');
          return q ? parseFloat(getComputedStyle(q).lineHeight) || 0 : 0;
        })(),
        blocks: blocks,
      });
    });
    document.title = 'PACK' + JSON.stringify(out);
  });
});
<\/script>`;

async function measure(htmlPath) {
  const chrome = CHROME.find(c => c && existsSync(c));
  if (!chrome) throw new Error('No Chrome or Edge found — set one in CHROME.');
  const tmp = htmlPath.replace(/\.html$/, '-pack.html');
  const src = await readFile(htmlPath, 'utf8');
  await writeFile(tmp, src.replace('</head>', PROBE + '\n</head>'));
  const { stdout } = await run(chrome, [
    '--headless=new', ...SANDBOX, '--disable-gpu', '--hide-scrollbars',
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
/* A heading is anything that announces what comes after it, whatever
   tag it wears. h2 and h3 are the obvious ones. A Beyond the Book
   stage head is a div, and so is the band that opens an exercise set
   — and both were invisible here, so the packer happily set one as
   the last block on a page and left the reader a promise whose
   content is overleaf. The css says break-after: avoid on all of
   them, but css never breaks these pages: one source file is one
   page, so the rule has to live in the packer. */
const isHeading = (b) =>
  b.tag === 'h2' || b.tag === 'h3' || b.leads === true;

/* An opener is anything that starts new matter, which is more than the
   headings: a worked example is a promise too, and an example set four
   lines from the foot sends the reader over the page for the figure it
   was drawn to explain. Headings, stage heads, exercise bands and
   examples all answer to the same rule. */
const isOpener = (b) => !!b.opens || isHeading(b);

/* An opener that clears the page edge by a hair is still stranded: the
   reader gets a title and three lines, then a page turn. So an opener
   has to bring a real opening with it — five lines of set matter — or
   it waits for the next page.

   Five lines, not a fraction of the text block: the number is what the
   eye counts, and it has to mean the same thing in both editions.
   build/orphans.mjs reports against the same figure. */
const MIN_OPENER_LINES = 5;

/* Would this opener seat a real opening in the `room` left under it?
   Blocks are atomic, so counting raw heights lies: the paragraph after
   a heading may be three lines and the block after that a figure that
   was never going to fit. Only what actually lands here counts. A
   section shorter than the quota is judged against its own length.

   Matter arrives from two places. A heading is all title and its matter
   is entirely in the blocks that follow. An example carries its tab and
   its body in one box, so part of its own height already pays — which
   is `inner`, the block less its own head.

   This has to charge each block exactly what the packing loop below
   charges it — collapsed margin and all. Costing a block at h + mt
   when the loop pays max(prevMb, mt) reads as a few millimetres of
   optimism per block, which is the difference between predicting five
   lines under a heading and printing three. */
function opensWell(flat, i, room, lh, headMb, depth = 0) {
  const quota = MIN_OPENER_LINES * lh;
  const inner = Math.max(0, flat[i].h - (flat[i].headH || 0));

  /* Two accumulators, and they measure different things.

     `after` is simply what lands on this page under the opener. It
     counts every block that fits, heading or not: what makes a stranded
     opener bad is a page left nearly empty behind it, and a subsection
     heading two blocks down does not leave the page empty — its own
     matter sets on the same page. Stopping this count at a heading
     refused a stage head with 160mm of room going spare.

     `whole` is the section's own length, and that one does stop at the
     next heading, because it exists only for the escape below: the last
     few lines of a chapter are judged against their own length rather
     than a quota they can never meet. Nothing past the quota need be
     counted — beyond it the quota is what is judged against either
     way. */
  let whole = inner, after = 0, seatMb = headMb, wholeMb = headMb;
  let seating = true, counting = true, spent = true;
  for (let k = i + 1; k < flat.length; k++) {
    if (counting && whole < quota) {
      if (isHeading(flat[k]) && whole > 0) { spent = false; counting = false; } // h2 into h3
      else { whole += Math.max(wholeMb, flat[k].mt) + flat[k].h; wholeMb = flat[k].mb; }
    }
    if (seating) {
      const cost = Math.max(seatMb, flat[k].mt) + flat[k].h;
      if (after + cost > room) seating = false;
      else { after += cost; seatMb = flat[k].mb; }
    }
    if (!seating && (!counting || whole >= quota)) break;
  }
  return inner + after >= (spent ? Math.min(quota, whole) : quota);
}

function pack(pages) {
  const flat = [];
  for (const [p, page] of pages.entries()) {
    for (const [i, b] of page.blocks.entries()) flat.push({ ...b, from: p, at: i });
  }

  const out = [];
  let page = { blocks: [], used: 0, avail: pages[0].avail, opener: true };
  let prevMb = 0;
  // the measured body line, which is the unit the opener rule counts in
  const lh = pages.find(p => p.lh)?.lh || pages[0].avail * 0.024;

  const push = () => { out.push(page); };

  for (const [idx, b] of flat.entries()) {
    const join = Math.max(prevMb, b.mt);
    const cost = (page.blocks.length ? join : 0) + b.h;
    const stranded = isOpener(b)
      && !opensWell(flat, idx, page.avail - page.used - cost, lh, b.mb);
    // margins collapse in ways this arithmetic only approximates, so
    // leave a little air rather than shipping a page that overflows
    if (page.blocks.length && (page.used + cost > page.avail || stranded)) {
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
