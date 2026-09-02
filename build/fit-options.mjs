/* ---- fit-options ------------------------------------------
   A question's options are laid out in equal columns, and the
   count is declared by hand: c-parts--4, c-parts--3, or the
   default 2. Declare four columns for options that read "in
   Quadrant III" and the option wraps mid-phrase — two lines
   where the reader expects one, and the four options no longer
   scan as four.

   Nothing in CSS can pick the count from the content: auto-fit
   needs a fixed minimum, and the minimum here is whatever the
   longest option happens to be. So it is measured instead.

   Chrome lays the chapter out, each option is measured at its
   natural width, and the tool reports every list declaring more
   columns than its content fits in. With --fix the declaration
   is rewritten in the page source. It only ever narrows a list:
   a list set in one column on purpose stays there.

     node build/fit-options.mjs class-9/ch01-coordinates [--fix]
   ------------------------------------------------------------ */
import { readFile, writeFile, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = (...parts) => path.join(ROOT, ...parts);

const CHROME_CANDIDATES = [
  process.env.CHROME, process.env.CHROME_PATH,
  '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];
const chrome = CHROME_CANDIDATES.find(c => c && existsSync(c));
const SANDBOX = process.getuid?.() === 0 ? ['--no-sandbox'] : [];

/* The count declared by each modifier, and the modifier for a count.
   Two is the default and carries no modifier of its own. */
const COLS = { 'c-parts--1': 1, 'c-parts--3': 3, 'c-parts--4': 4 };
const MOD  = { 1: 'c-parts--1', 2: null, 3: 'c-parts--3', 4: 'c-parts--4' };

const PROBE = `<script>
window.addEventListener('load', function () {
  var out = [];
  document.querySelectorAll('.page').forEach(function (pg) {
    // The builder leaves the fragment's filename in a comment above
    // the page, which is the only thread back to the source file.
    var src = '', n = pg.previousSibling;
    while (n && !src) {
      if (n.nodeType === 8) src = (n.data || '').trim();
      n = n.previousSibling;
    }
    var lists = pg.querySelectorAll('.c-parts');
    for (var i = 0; i < lists.length; i++) {
      var ol = lists[i];
      var avail = ol.clientWidth;
      var gap = parseFloat(getComputedStyle(ol).columnGap) || 0;
      // Measure each option at its natural width. The marker sits in
      // the padding, so the padding is part of what has to fit.
      var pad = parseFloat(getComputedStyle(ol.children[0]).paddingLeft) || 0;
      var widest = 0, wrapped = 0, widths = [];
      for (var j = 0; j < ol.children.length; j++) {
        var li = ol.children[j];
        var h = li.getBoundingClientRect().height;
        var lh = parseFloat(getComputedStyle(li).lineHeight) || 0;
        if (lh && h > lh * 1.55) wrapped++;
        var probe = document.createElement('span');
        probe.style.cssText = 'display:inline-block;width:max-content;max-width:none';
        while (li.firstChild) probe.appendChild(li.firstChild);
        li.appendChild(probe);
        var w = probe.getBoundingClientRect().width + pad;
        widths.push(w);
        widest = Math.max(widest, w);
        while (probe.firstChild) li.insertBefore(probe.firstChild, probe);
        li.removeChild(probe);
      }
      out.push({ src: src, i: i, cls: ol.className, items: ol.children.length,
                 avail: Math.round(avail), gap: Math.round(gap),
                 widest: Math.round(widest), wrapped: wrapped, widths: widths });
    }
  });
  document.title = 'OPTS' + JSON.stringify(out);
});
<\/script>`;

/* Two kinds of list wear the same class, and they do not want the
   same thing.

   A set of multiple-choice OPTIONS is read as a set: four options in
   four columns are compared at a glance, and one of them running to a
   second line breaks that reading — "in Quadrant / III" is the fault
   that started this. So every option has to fit, and the count has to
   divide the options evenly: four options in three columns leave the
   fourth alone on a second row, and the set stops being a set.

   A list of exercise PARTS is read one part at a time. (i) is worked,
   then (ii); nothing is being compared, and a long part wrapping to a
   second line is ordinary setting — it is what every textbook does.
   Narrowing there buys nothing and costs a page: an eleven-part
   factorise question forced into one column ran a page over. So parts
   are narrowed only when the wrapping is the rule rather than the
   exception — more than a third of them — and any count will do.

   Both only ever narrow. A list set in one column on purpose stays
   there. */
const SHARE = 1 / 3;

function fits(avail, gap, widest, widths, cap, alpha) {
  const col = n => (avail - gap * (n - 1)) / n;
  const over = n => widths.filter(w => w > col(n) + 0.5).length;
  const ok = alpha
    ? n => over(n) === 0
    : n => over(n) <= Math.floor(widths.length * SHARE);
  if (ok(cap)) return cap;
  for (let n = cap - 1; n > 1; n--) {
    if (alpha && widths.length % n) continue;
    if (ok(n)) return n;
  }
  return 1;
}

function declared(cls) {
  for (const k of Object.keys(COLS)) if (cls.split(/\s+/).includes(k)) return COLS[k];
  return 2;
}

/* Rewrite the Nth c-parts declaration in a page fragment. */
function retag(src, nth, want) {
  let seen = -1;
  return src.replace(/class="([^"]*\bc-parts\b[^"]*)"/g, (m, cls) => {
    if (++seen !== nth) return m;
    const keep = cls.split(/\s+/).filter(c => !COLS[c]);
    if (MOD[want]) keep.push(MOD[want]);
    return `class="${keep.join(' ')}"`;
  });
}

const args = process.argv.slice(2);
const fix = args.includes('--fix');
const rel = args.find(a => !a.startsWith('--'));
if (!chrome) throw new Error('No Chrome found — set CHROME.');
if (!rel) throw new Error('Usage: node build/fit-options.mjs class-9/ch01-coordinates [--fix]');

const built = p('build', rel + '.html');
if (!existsSync(built)) throw new Error(`Build ${rel} first — ${path.relative(ROOT, built)} is missing`);

const meta = JSON.parse(await readFile(p('pages', rel, 'chapter.json'), 'utf8'));
const W = meta.edition === 'b5' ? 665 : 794;
const H = meta.edition === 'b5' ? 945 : 1123;

const tmp = built.replace(/\.html$/, '-opts.html');
await writeFile(tmp, (await readFile(built, 'utf8')).replace('</head>', PROBE + '\n</head>'));
const { stdout } = await run(chrome, [
  '--headless=new', ...SANDBOX, '--disable-gpu', '--hide-scrollbars',
  `--window-size=${W},${H}`, '--virtual-time-budget=8000', '--dump-dom',
  'file:///' + tmp.replace(/\\/g, '/'),
], { maxBuffer: 1 << 26 });
await rm(tmp, { force: true });

const raw = stdout.match(/OPTS(\[.*?\])<\/title>/s)?.[1];
if (!raw) throw new Error('option check did not report');

const rows = JSON.parse(raw);
const edits = new Map();
for (const r of rows) {
  const have = declared(r.cls);
  const alpha = r.cls.split(/\s+/).includes('c-parts--alpha');
  const target = Math.min(have, fits(r.avail, r.gap, r.widest, r.widths, have, alpha));
  if (target === have) continue;
  const file = r.src;
  if (!/^p\d+.*\.html$/.test(file)) { console.warn(`    ! list ${r.i} of an unnamed page`); continue; }
  console.log(`    ${file}  list ${r.i}: ${have} columns declared, ${target} fit` +
              `  (${alpha ? 'options' : 'parts'}, ${r.wrapped} of ${r.items} wrapping)`);
  if (!edits.has(file)) edits.set(file, []);
  edits.get(file).push([r.i, target]);
}

if (!edits.size) { console.log('    every option row fits its columns'); process.exit(0); }
if (!fix) { console.log(`    ${[...edits.values()].flat().length} to narrow — re-run with --fix`); process.exit(0); }

for (const [file, list] of edits) {
  const fp = p('pages', rel, file);
  let src = await readFile(fp, 'utf8');
  for (const [nth, want] of list) src = retag(src, nth, want);
  await writeFile(fp, src);
}
console.log(`    narrowed ${[...edits.values()].flat().length} list(s) across ${edits.size} page(s)`);
