#!/usr/bin/env node
/* ============================================================
   Find figure labels that print on top of one another.

     node build/check-labels.mjs class-9/ch01-coordinates

   A diagram is drawn in its own coordinate space and its labels
   are placed by hand, so two of them can land in the same place
   and nothing complains: the SVG is valid, the page fits, and the
   proof shows "O (0, 0)" printed through the tick marked -1 as a
   single unreadable mark. Fig. 1.2 shipped that way.

   Chrome lays every figure out and reports the box each label
   actually occupies; anything that overlaps another label by more
   than a hair is reported, in the figure's own units so it can be
   found in the source.

   Only text against text. A label sitting on a grid line or over
   a tint is ordinary drawing.
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

/* How much two labels may share before it is a collision. Letters
   have side bearings and descenders, so touching boxes are normal;
   a real collision buries one label in the other. */
const TOLERANCE = 0.22;

const PROBE = `<script>
window.addEventListener('load', function () {
  Promise.resolve(document.fonts && document.fonts.ready).then(function () {
    var out = [];
    document.querySelectorAll('.page').forEach(function (pg) {
      var src = '', n = pg.previousSibling;
      while (n && !src) { if (n.nodeType === 8) src = (n.data || '').trim(); n = n.previousSibling; }
      // Most figures carry no data-fig, so the drawing is found by
      // where it sits and named by the caption beside it. Selecting on
      // data-fig checked ten figures out of eighty and reported the
      // rest clean.
      pg.querySelectorAll('.c-figure svg, figure svg').forEach(function (svg) {
        if (svg.closest('.dg-defs')) return;
        var texts = [], all = svg.querySelectorAll('text');
        for (var i = 0; i < all.length; i++) {
          var t = all[i];
          if (!t.textContent.trim()) continue;
          var b;
          try { b = t.getBBox(); } catch (e) { continue; }
          if (!b.width || !b.height) continue;
          texts.push({ s: t.textContent.trim(), x: b.x, y: b.y, w: b.width, h: b.height });
        }
        for (var a = 0; a < texts.length; a++) {
          for (var c = a + 1; c < texts.length; c++) {
            var A = texts[a], B = texts[c];
            // getBBox returns the em box, which reaches well above the
            // capitals and below the baseline. Two labels on consecutive
            // lines share that empty band without a mark touching, so the
            // band is taken off before the boxes are compared.
            var ai = A.h * 0.18, bi = B.h * 0.18;
            var ay = A.y + ai, ah = A.h - 2 * ai, by = B.y + bi, bh = B.h - 2 * bi;
            var ox = Math.min(A.x + A.w, B.x + B.w) - Math.max(A.x, B.x);
            var oy = Math.min(ay + ah, by + bh) - Math.max(ay, by);
            if (ox <= 0 || oy <= 0) continue;
            var share = (ox * oy) / Math.min(A.w * ah, B.w * bh);
            var cap = svg.closest('figure');
            cap = cap && cap.querySelector('.fignum');
            out.push({ src: src, fig: (cap ? cap.textContent : svg.dataset.fig || '?')
                         .replace(/^Fig\.\s*/, ''), folio: pg.dataset.folio,
                       a: A.s, b: B.s, share: Math.round(share * 100) / 100,
                       at: [Math.round(Math.max(A.x, B.x)), Math.round(Math.max(ay, by))] });
          }
        }
      });
    });
    document.title = 'LBL' + JSON.stringify(out);
  });
});
<\/script>`;

const rel = process.argv[2];
if (!rel) { console.error('usage: node build/check-labels.mjs <class-9/chapter-dir>'); process.exit(1); }
if (!CHROME) throw new Error('No Chrome found — set CHROME.');

const built = p('build', rel + '.html');
if (!existsSync(built)) throw new Error(`Build ${rel} first`);
const meta = JSON.parse(await readFile(p('pages', rel, 'chapter.json'), 'utf8'));
const W = meta.edition === 'b5' ? 665 : 794;

const tmp = built.replace(/\.html$/, '-labels.html');
await writeFile(tmp, (await readFile(built, 'utf8')).replace('</head>', PROBE + '\n</head>'));
const { stdout } = await run(CHROME, [
  '--headless=new', ...SANDBOX, '--disable-gpu', '--hide-scrollbars',
  `--window-size=${W},1400`, '--virtual-time-budget=10000', '--dump-dom',
  'file:///' + tmp.replace(/\\/g, '/'),
], { maxBuffer: 1 << 26 });
await rm(tmp, { force: true });

const raw = stdout.match(/LBL(\[[\s\S]*?\])<\/title>/)?.[1];
if (!raw) throw new Error('the label check did not report');
const hits = JSON.parse(raw).filter(h => h.share > TOLERANCE);
for (const h of hits) {
  console.log(`    ${h.src}  Fig. ${h.fig} (page ${h.folio}): "${h.a}" and "${h.b}" `
            + `overlap ${Math.round(h.share * 100)}% at ${h.at[0]},${h.at[1]}`);
}
console.log(hits.length ? `    ${hits.length} label collision(s)` : '    no labels collide');
