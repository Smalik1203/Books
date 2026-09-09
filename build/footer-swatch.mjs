#!/usr/bin/env node
/* ============================================================
   Footer treatments, one sheet.

     node build/footer-swatch.mjs [palette]

   The foot of the page is the one piece of furniture that repeats
   on every leaf of the book, so it is also the one worth judging
   as a set rather than one page at a time. This renders the foot
   of a recto and a verso for each candidate treatment, at trim
   width, in the book's own stylesheet and palette — a footer
   judged in some other type at some other size is judged wrong.

   It writes a proof and nothing else. Whichever treatment wins
   goes into css/page.css by hand; nothing here is imported by the
   book.
   ============================================================ */
import { writeFile, rm, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = (...a) => path.join(ROOT, ...a);
const CHROME = [
  process.env.CHROME, process.env.CHROME_PATH,
  '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(c => c && existsSync(c));
const SANDBOX = process.getuid?.() === 0 ? ['--no-sandbox'] : [];

const palette = process.argv[2] || 'lagoon';

/* Each treatment is a name, a note on what it is trying to do, and
   the css that draws it. Every one is scoped under its own class so
   they can sit on one sheet without reaching each other. */
const TREATMENTS = [
  {
    id: 'now',
    name: 'A — as it stands',
    note: 'Solid bar 40% of the width, outline bar 25%, both skewed, both running off the edge.',
    css: `
      .t-now .pf__fill { right: -12mm; width: 40%; background: var(--teal); }
      .t-now .pf__line { left: -12mm; width: 25%;
        border-top: 0.5mm solid var(--rust); border-right: 0.5mm solid var(--rust); }
      .t-now.v .pf__fill { right: auto; left: -12mm; }
      .t-now.v .pf__line { left: auto; right: -12mm;
        border-right: none; border-left: 0.5mm solid var(--rust); }
      .t-now .pf__folio { right: var(--margin-outside); color: var(--paper); }
      .t-now.v .pf__folio { right: auto; left: var(--margin-outside); }`,
  },
  {
    id: 'short',
    name: 'B — the same shape, cut to the number',
    note: 'The identical device, but the slab stops just past the folio and the outline bar goes. Same language, half the ink.',
    css: `
      /* far enough in to hold the folio, which sits at the outer margin
         and runs about 7mm inboard of it, and no further */
      .t-short .pf__fill { right: -12mm; width: 26%; background: var(--teal); }
      .t-short.v .pf__fill { right: auto; left: -12mm; }
      .t-short .pf__line { display: none; }
      .t-short .pf__folio { right: var(--margin-outside); color: var(--paper); }
      .t-short.v .pf__folio { right: auto; left: var(--margin-outside); }`,
  },
  {
    id: 'rule',
    name: 'C — a rule and a numeral',
    note: 'A hairline across the measure, the folio outboard of it in the structure colour. The quiet, bookish answer; no ink bleeds off.',
    css: `
      .t-rule .pf__fill { display: none; }
      .t-rule .pf__line { left: var(--margin-inside); right: calc(var(--margin-outside) + 12mm);
        width: auto; bottom: 2.7mm; height: 0; transform: none;
        border-top: 0.3mm solid var(--teal-soft); }
      .t-rule.v .pf__line { left: calc(var(--margin-outside) + 12mm); right: var(--margin-inside); }
      .t-rule .pf__folio { right: var(--margin-outside); color: var(--teal); }
      .t-rule.v .pf__folio { right: auto; left: var(--margin-outside); }`,
  },
  {
    id: 'tab',
    name: 'D — a rounded tab, and nothing else',
    note: 'The components’ own tab shape rather than the skew: squared off at the trim, rounded where it meets the page. One mark, and it speaks the library’s language instead of the opener’s.',
    css: `
      .t-tab .pf__fill { right: -12mm; width: 46mm; background: var(--teal);
        transform: none; border-top-left-radius: var(--radius-lg);
        border-bottom-left-radius: var(--radius-lg); }
      .t-tab.v .pf__fill { right: auto; left: -12mm;
        border-top-left-radius: 0; border-bottom-left-radius: 0;
        border-top-right-radius: var(--radius-lg);
        border-bottom-right-radius: var(--radius-lg); }
      .t-tab .pf__line { display: none; }
      .t-tab .pf__folio { right: var(--margin-outside); color: var(--paper); }
      .t-tab.v .pf__folio { right: auto; left: var(--margin-outside); }`,
  },
  {
    id: 'notch',
    name: 'E — a rule the folio interrupts',
    note: 'The rule runs the full measure and stops for the number, which sits in the gap in the action colour. No slab at all.',
    css: `
      .t-notch .pf__fill { display: none; }
      .t-notch .pf__line { left: var(--margin-inside); right: calc(var(--margin-outside) + 13mm);
        width: auto; bottom: 2.7mm; height: 0; transform: none;
        border-top: 0.4mm solid var(--teal); }
      .t-notch.v .pf__line { left: calc(var(--margin-outside) + 13mm); right: var(--margin-inside); }
      .t-notch .pf__folio { right: calc(var(--margin-outside) - 2mm); color: var(--rust); }
      .t-notch.v .pf__folio { right: auto; left: calc(var(--margin-outside) - 2mm); }`,
  },
];

const foot = (t, side, n) => `
  <div class="strip">
    <div class="strip__label">${t.name} — ${side === 'v' ? 'verso' : 'recto'}</div>
    <div class="sheet">
      <p class="filler">…and the line of text that the foot of the page has to sit under,
      so the treatment is judged against type and not against white.</p>
      <div class="pf t-${t.id} ${side}">
        <i class="pf__fill"></i><i class="pf__line"></i>
        <span class="pf__folio">${n}</span>
      </div>
    </div>
  </div>`;

const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>Footer treatments — ${palette}</title>
<link rel="stylesheet" href="../../css/book.css">
<link rel="stylesheet" href="../../css/palette-${palette}.css">
<style>
  body { margin: 0; padding: 10mm 0 14mm; background: #d8d6d0;
         font-family: var(--font-body); }
  h1 { font-family: var(--font-display); font-size: 13pt; margin: 0 0 1mm;
       text-align: center; color: #23201c; }
  .sub { text-align: center; font-size: 9pt; color: #4a453e; margin: 0 0 9mm; }
  .strip { width: var(--trim-w); margin: 0 auto 7mm; }
  .strip__label { font-family: var(--font-display); font-size: 8.5pt; font-weight: 700;
                  color: #33302a; padding: 0 0 1.4mm 2mm; }
  .note { width: var(--trim-w); margin: 0 auto; padding: 0 0 2mm 2mm;
          font-size: 8.5pt; color: #4a453e; max-width: var(--trim-w); }
  /* the foot of a real page: trim width, and the last 34mm of its height */
  .sheet { position: relative; width: var(--trim-w); height: 34mm;
           background: var(--paper); overflow: hidden;
           box-shadow: 0 0.4mm 1.6mm rgba(0,0,0,.22); }
  .filler { position: absolute; left: var(--margin-inside);
            right: var(--margin-outside); top: 3mm; margin: 0;
            font-size: var(--size-body); line-height: var(--lh-body);
            color: var(--ink); text-align: justify; }
  .v .filler { left: var(--margin-outside); right: var(--margin-inside); }

  /* the same skeleton the builder emits, renamed so the book's own
     .pagefoot rules cannot reach it */
  .pf { position: absolute; left: 0; right: 0; bottom: 0; height: 10mm; }
  .pf__fill, .pf__line { position: absolute; bottom: 0; height: 5.4mm;
                         transform: skewX(-26deg); }
  .pf.v .pf__fill, .pf.v .pf__line { transform: skewX(26deg); }
  .pf__folio { position: absolute; bottom: 0; height: 5.4mm; line-height: 5.4mm;
               font-family: var(--font-display); font-size: var(--size-note);
               font-weight: var(--weight-bold); font-variant-numeric: lining-nums; }
${TREATMENTS.map(t => t.css).join('\n')}
</style></head><body>
<h1>The foot of the page — five treatments</h1>
<p class="sub">Palette ${palette}, trim width, true size. Verso and recto of each, so the mirroring can be judged too.</p>
${TREATMENTS.map((t, i) => `<p class="note">${t.note}</p>`
    + foot(t, 'v', 24 + i * 2) + foot(t, 'r', 25 + i * 2)).join('\n')}
</body></html>`;

const out = p('build', '_footer-swatch');
await mkdir(out, { recursive: true });
const page = path.join(out, 'swatch.html');
await writeFile(page, html);

if (!CHROME) { console.error('No Chrome found — set one in CHROME.'); process.exit(1); }
const png = path.join(out, `footers-${palette}.png`);
await run(CHROME, [
  '--headless=new', ...SANDBOX, '--disable-gpu', '--hide-scrollbars',
  '--force-device-scale-factor=2', '--window-size=880,2400',
  '--virtual-time-budget=12000', '--screenshot=' + png,
  'file:///' + page.replace(/\\/g, '/'),
]);
console.log('  → ' + path.relative(ROOT, png));
