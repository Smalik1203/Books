#!/usr/bin/env node
/* ============================================================
   Find openers stranded at the foot of a page.

     node build/orphans.mjs class-9/ch02-linear-polynomials
     node build/orphans.mjs class-9            # every chapter

   An opener is a block that announces new material: a section
   head, a subtopic head, a Beyond the Book stage head, the band
   that opens an exercise set, or a worked example. A reader who
   meets one at the foot of a page and gets four lines before the
   page turns has been promised something and handed a page break
   instead — and the figure the example needs is invariably
   overleaf.

   So: under the last opener on a page — measured from the foot of
   its own head, since the title is not what the reader is counting
   — there must be at least five lines of set matter. Anything less
   and the opener belongs on the next page.

   `--all` lists every page that ends on an opener with its count,
   which is how the threshold was calibrated.

   This only reports. The rule that acts on it lives in repack.mjs,
   which is what decides where a break falls; run refit afterwards
   to apply it.
   ============================================================ */
import { readFile, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { readdirSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = (...a) => path.join(ROOT, ...a);
const CHROME = [
  process.env.CHROME, process.env.CHROME_PATH,
  '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(c => c && existsSync(c));
const SANDBOX = process.getuid?.() === 0 ? ['--no-sandbox'] : [];

/* Five lines of body text — the same figure repack.mjs packs to,
   and it has to stay the same figure or this reports gaps the
   packer will not close. Lines, not a fraction of the text block,
   because the number is what the eye counts and it must mean the
   same thing in both editions. */
export const MIN_OPENER_LINES = 5;

const PROBE = `<script>
window.addEventListener('load', function () {
  Promise.resolve(document.fonts && document.fonts.ready).then(function () {
    var out = [];
    // one line of body text, in px — measured, not assumed, because
    // the two editions set different scales
    var probe = document.querySelector('.page__main p');
    var lh = probe ? parseFloat(getComputedStyle(probe).lineHeight) : 0;
    // An opener and the head it wears. What matters is not the block
    // but where its own title stops and its matter starts: a section
    // head is a block of its own and its matter is the blocks after
    // it, while an example carries its tab and its body in one box.
    // A --head panel is not an opener: it is the near half of a panel
    // close-gaps ran over the break on purpose, and its matter carries
    // on overleaf as the same tinted field.
    var isOpener = function (el) {
      var t = el.tagName.toLowerCase();
      var cn = ' ' + (el.className || '') + ' ';
      if (cn.indexOf('--head') >= 0) return null;
      if (t === 'h2' || t === 'h3') return { kind: t, head: el };
      var stage = el.querySelector('.c-stage__title');
      if (stage) return { kind: 'stage', head: el };
      var band = el.querySelector('.c-practice__head');
      if (band) return { kind: 'exercise', head: band };
      if (cn.indexOf('c-example') >= 0)
        return { kind: 'example', head: el.querySelector('.c-example__tab') || el };
      return null;
    };
    var ink = function (el) {
      var r = el.getBoundingClientRect(), deep = r.bottom;
      el.querySelectorAll('*').forEach(function (k) {
        var kr = k.getBoundingClientRect();
        if (kr.height && kr.bottom > deep) deep = kr.bottom;
      });
      return { top: r.top, bottom: deep };
    };
    document.querySelectorAll('.page').forEach(function (pg) {
      var main = pg.querySelector('.page__main');
      if (!main) return;
      var kids = main.children, last = null, foot = null;
      for (var n = 0; n < kids.length; n++) {
        var o = isOpener(kids[n]);
        // measure from the foot of the opener's own head: what the
        // reader is counting is the matter under the title, not the
        // title itself
        if (o) last = { i: n, kind: o.kind, from: ink(o.head).bottom };
        foot = ink(kids[n]).bottom;
      }
      out.push({
        folio: pg.dataset.folio || '',
        n: kids.length,
        opener: last,
        span: last ? (foot - last.from) / (lh || 1) : null,
      });
    });
    document.title = 'ORPH' + JSON.stringify(out);
  });
});
<\/script>`;

async function scan(rel) {
  const built = p('build', rel + '.html');
  if (!existsSync(built)) { console.log(`  ${rel}: not built — run the builder first`); return 0; }
  const tmp = built.replace(/\.html$/, '-orph.html');
  await writeFile(tmp, (await readFile(built, 'utf8')).replace('</head>', PROBE + '\n</head>'));
  const { stdout } = await run(CHROME, [
    '--headless=new', ...SANDBOX, '--disable-gpu', '--hide-scrollbars',
    '--virtual-time-budget=12000', '--dump-dom', 'file:///' + tmp.replace(/\\/g, '/'),
  ], { maxBuffer: 1 << 26 });
  await rm(tmp, { force: true });
  const raw = stdout.match(/ORPH(\[[\s\S]*?\])<\/title>/)?.[1];
  if (!raw) throw new Error(rel + ': the page did not report its blocks');

  const pages = JSON.parse(raw);
  let hits = 0;
  for (const [i, pg] of pages.entries()) {
    if (!pg.opener) continue;
    // the last page of a run may legitimately end on anything
    if (i === pages.length - 1) continue;
    if (pg.span >= MIN_OPENER_LINES) { if (!ALL) continue; }
    else hits++;
    console.log(`    page ${String(i + 1).padStart(3)}  folio ${String(pg.folio).padStart(3)}`
      + `  ${pg.opener.kind.padEnd(8)} opens ${pg.span.toFixed(1)} lines from the foot`);
  }
  console.log(`  ${rel}: ${hits} stranded opener(s) in ${pages.length} page(s)`);
  return hits;
}

const ALL = process.argv.includes('--all');
const target = process.argv[2];
if (!target) { console.error('usage: node build/orphans.mjs <class-9[/chapter-dir]>'); process.exit(1); }
if (!CHROME) { console.error('No Chrome found — set one in CHROME.'); process.exit(1); }

const targets = existsSync(p('pages', target, 'chapter.json'))
  ? [target]
  : readdirSync(p('pages', target)).filter(f => existsSync(p('pages', target, f, 'chapter.json')))
      .sort().map(f => path.join(target, f));

let total = 0;
for (const t of targets) total += await scan(t);
if (targets.length > 1) console.log(`  ${total} stranded opener(s) in all`);
