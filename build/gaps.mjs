#!/usr/bin/env node
/* ============================================================
   Say what is holding each short page open.

     node build/gaps.mjs class-9/ch04-algebraic-identities

   The builder reports that a page is 75% full. It does not say
   why, and the why is the whole question: a gap held by a figure
   is a gap you leave alone, a gap held by a paragraph is one you
   close by editing the prose at the join, and a gap held by a
   component a little too tall is one repack could close if the
   component could be divided.

   So for every page under the threshold this names the block that
   would not fit — what it is, how tall it is, and how much room
   was going spare — which is the difference between a fitting
   problem and a design decision.
   ============================================================ */
import { readFile, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
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
const PX_PER_MM = 96 / 25.4;

const PROBE = `<script>
window.addEventListener('load', function () {
  Promise.resolve(document.fonts && document.fonts.ready).then(function () {
    var out = [];
    document.querySelectorAll('.page').forEach(function (pg) {
      var body = pg.querySelector('.page__body'), main = pg.querySelector('.page__main');
      if (!body || !main) return;
      var top = body.getBoundingClientRect().top;
      var avail = body.getBoundingClientRect().height;
      var deep = top;
      pg.querySelectorAll('.page__main > *, .page__side > *').forEach(function (el) {
        deep = Math.max(deep, el.getBoundingClientRect().bottom);
      });
      var first = main.children[0];
      var name = function (el) {
        if (!el) return null;
        var c = (el.className || '').split(/\\s+/)[0];
        return c || el.tagName.toLowerCase();
      };
      var h = 0;
      if (first) {
        var r = first.getBoundingClientRect(), d = r.bottom;
        first.querySelectorAll('*').forEach(function (k) {
          var kr = k.getBoundingClientRect();
          if (kr.height && kr.bottom > d) d = kr.bottom;
        });
        h = Math.max(r.height, d - r.top);
      }
      out.push({ folio: pg.dataset.folio, close: pg.hasAttribute('data-close'),
                 fill: Math.round((deep - top) / avail * 100),
                 free: Math.round(avail - (deep - top)),
                 firstName: name(first), firstH: Math.round(h) });
    });
    document.title = 'GAPS' + JSON.stringify(out);
  });
});
<\/script>`;

const rel = process.argv[2];
const MIN = Number(process.argv[process.argv.indexOf('--min') + 1]) || 88;
if (!rel) { console.error('usage: node build/gaps.mjs <class-9/chapter-dir> [--min 88]'); process.exit(1); }
if (!CHROME) throw new Error('No Chrome found — set CHROME.');

const built = p('build', rel + '.html');
if (!existsSync(built)) throw new Error(`Build ${rel} first`);
const meta = JSON.parse(await readFile(p('pages', rel, 'chapter.json'), 'utf8'));
const W = meta.edition === 'b5' ? 665 : 794;

const tmp = built.replace(/\.html$/, '-gaps.html');
await writeFile(tmp, (await readFile(built, 'utf8')).replace('</head>', PROBE + '\n</head>'));
const { stdout } = await run(CHROME, [
  '--headless=new', ...SANDBOX, '--disable-gpu', '--hide-scrollbars',
  `--window-size=${W},1400`, '--virtual-time-budget=10000', '--dump-dom',
  'file:///' + tmp.replace(/\\/g, '/'),
], { maxBuffer: 1 << 26 });
await rm(tmp, { force: true });

const raw = stdout.match(/GAPS(\[[\s\S]*?\])<\/title>/)?.[1];
if (!raw) throw new Error('the gap check did not report');
const rows = JSON.parse(raw);

/* What a block is, and whether anything can be done about it. */
const VERDICT = {
  'c-figure': 'a figure — leave it; half a diagram is unreadable',
  'figure': 'a figure — leave it; half a diagram is unreadable',
  'h2': 'a heading — it may not be stranded at the foot',
  'h3': 'a heading — it may not be stranded at the foot',
  'p': 'a paragraph — closes only by editing the prose at the join',
  'c-example': 'an example — divisible; try close-gaps',
  'c-reflect': 'a reflect box — divisible; try close-gaps',
  'c-practice': 'an exercise band — divide it with split-practice',
  'c-questions': 'an exercise band — divide it with split-practice',
  'eq': 'a displayed equation — indivisible by design',
  'c-summary': 'a summary box — indivisible by design',
  'work': 'a block of working — divisible by hand',
};

let n = 0;
for (const [i, r] of rows.entries()) {
  if (i === rows.length - 1 || r.close || r.fill >= MIN) continue;
  const next = rows[i + 1];
  const mm = h => (h / PX_PER_MM).toFixed(0);
  const held = next?.firstName ?? '(nothing follows)';
  console.log(`    page ${String(r.folio).padStart(2)}  ${String(r.fill).padStart(3)}% `
    + `— ${mm(r.free)}mm free, and the next page opens with ${held} at ${mm(next?.firstH ?? 0)}mm`);
  console.log(`              ${VERDICT[held] ?? 'not a block this tool knows'}`);
  n++;
}
console.log(n ? `    ${n} page(s) under ${MIN}%` : `    every page is at least ${MIN}% full`);
