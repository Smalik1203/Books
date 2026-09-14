#!/usr/bin/env node
/* ============================================================
   The reference body face, candidates side by side.

     node build/type-swatch.mjs

   The reference chapters are set in Poppins because the supplied
   page was. That is a good reason for the display line and a weaker
   one for eleven hundred words of body, so this puts the candidates
   next to each other in the book's own copy, at the size and leading
   the chapter actually prints — 10.5pt on 15.8, on the chapter's
   166mm measure. A face judged in someone else's specimen, at
   someone else's size, is judged wrong.

   Each block also carries a legibility row, because that is where
   these faces separate: in a geometric sans the capital I, the
   lowercase l and the digit 1 are the same bare stem.

   Look at the row, then weigh it against the chapter. Seventeen of
   chapter 1's 1,597 words open with a capital I, and every one of
   them is It, In, If, Is, Idea or Important — words no reader is
   going to mistake for an l-word. The letterform problem is real
   and this text barely meets it, which is why the chapter is still
   in Poppins.

   It writes a proof and nothing else. Whichever face wins goes into
   FAMILY in build/fetch-reference-fonts.mjs, and the pages keep
   naming the family "Food Poppins" or stop — that rename is the
   only edit outside this file.

   The candidates load from Google Fonts at render time on purpose:
   nothing is vendored into fonts/ until a face has been chosen.
   ============================================================ */
import { writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = [
  process.env.CHROME, process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(c => c && existsSync(c));
const SANDBOX = process.getuid?.() === 0 ? ['--no-sandbox'] : [];

/* The chapter's own measurements. --size-body is 24 viewBox units on a
   1052-unit sheet 189mm wide, and .science-copy is 0.86 of it. */
const UNIT_PT = (189 / 1052) / 0.352778;           // one viewBox unit, in points
const BODY = (24 * 0.86 * UNIT_PT).toFixed(2);     // 10.51pt
const LEAD = (31 * UNIT_PT).toFixed(2);            // 15.79pt
const HEAD = (24 * 1.5 * UNIT_PT).toFixed(2);      // 18.33pt
const MEASURE = ((988 - 62) * 189 / 1052).toFixed(1); // 166.4mm

const CANDIDATES = [
  { id: 'poppins', name: 'Poppins', spec: 'Poppins:ital,wght@0,400;0,700;1,400',
    note: 'As it stands, and what the supplied page used. Geometric: near-circular bowls, '
        + 'a single-storey a, and a capital I that is the same bare stem as a lowercase l — '
        + 'which costs this chapter almost nothing, since its seventeen capital-I words are all '
        + 'It, In, If and Is. Wide, so it eats measure: 166mm here sets the same 75 characters '
        + 'the house book sets in 140mm of Spectral.' },
  { id: 'nunito', name: 'Nunito Sans', spec: 'Nunito+Sans:ital,wght@0,400;0,700;1,400',
    note: 'The nearest thing to Poppins that was drawn for reading rather than for display. '
        + 'Rounded and friendly, but humanist underneath: the bowls are not circles, so b/d/p/q '
        + 'differ by more than reflection. Narrower, so the same copy sets shorter.' },
  { id: 'source', name: 'Source Sans 3', spec: 'Source+Sans+3:ital,wght@0,400;0,700;1,400',
    note: 'A workhorse humanist with a large x-height and a true italic. Least characterful of '
        + 'the five; the safest at 10.5pt and the one that will hold up on cheap paper.' },
  { id: 'atkinson', name: 'Atkinson Hyperlegible', spec: 'Atkinson+Hyperlegible:ital,wght@0,400;0,700;1,400',
    note: 'Drawn by the Braille Institute to be told apart, not to be admired: I, l and 1 are '
        + 'each given their own shape, as are O/0 and c/e. The clearest row below by some way. '
        + 'Whether that is worth changing the identity of the design for is the question this '
        + 'sheet exists to answer, and for chapter 1 the answer so far is no.' },
  { id: 'lato', name: 'Lato', spec: 'Lato:ital,wght@0,400;0,700;1,400',
    note: 'Humanist with slightly condensed proportions and warm curves. Sets tighter than any '
        + 'of the others, so it buys back the most measure — but its l is a bare stem too.' },
];

/* Real copy from the chapter, so the faces are judged on the words
   they have to set — Indian loanwords, an em dash, an italic. */
const COPY = [
  'Leave a wet shirt on a line and by evening it is dry. Pour water into an earthen <i>matka</i> and the water inside stays cool even on a hot afternoon. Watch the sky before the monsoon and see clouds thickening where there was clear blue an hour ago.',
  'In all three, water is leaving a liquid surface and moving into the air as an invisible vapour. That is what dries the shirt. That is what cools the <i>matka</i> — water seeping through the clay escapes from its surface and carries warmth with it.',
  '<b>Why might this happen?</b> A flower has no eyes and no clock. What could it be responding to? You do not need the right answer yet — only a reasonable guess.',
];

const specimen = c => `
<section class="cand" style="--face:'${c.name}'">
  <h2>${c.name}</h2>
  <p class="note">${c.note}</p>
  <div class="sheet">
    <h3>One Idea in Many Places</h3>
    ${COPY.map(p => `<p>${p}</p>`).join('\n    ')}
    <p class="legible">Illinois lit 1,013 — <b>Il1</b> · rn m · O0 · ce · ao · <i>matka</i></p>
  </div>
</section>`;

const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${
  CANDIDATES.map(c => 'family=' + c.spec).join('&')}&display=block">
<style>
  body { margin: 0; padding: 12mm 0 16mm; background: #d8d6d0;
         font-family: 'Source Sans 3', system-ui, sans-serif; }
  h1 { font-size: 13pt; margin: 0 0 1.5mm; text-align: center; color: #23201c; }
  .sub { text-align: center; font-size: 9pt; color: #4a453e; margin: 0 0 10mm; }
  .cand { width: 189mm; margin: 0 auto 8mm; }
  h2 { font-size: 10pt; font-weight: 700; color: #33302a; margin: 0 0 1mm 2mm; }
  .note { font-size: 8.5pt; line-height: 1.45; color: #4a453e; margin: 0 0 2.5mm 2mm; }
  /* the chapter's own page: trim width, its text block, its type */
  .sheet { background: #fff; padding: 8mm 0; box-shadow: 0 0.4mm 1.6mm rgba(0,0,0,.22); }
  .sheet > * { width: ${MEASURE}mm; margin-left: ${(62 * 189 / 1052).toFixed(1)}mm;
               font-family: var(--face), sans-serif; }
  .sheet h3 { font-size: ${HEAD}pt; font-weight: 700; color: #00768b;
              margin: 0 0 3mm; line-height: 1.2; }
  .sheet p { font-size: ${BODY}pt; line-height: ${LEAD}pt; color: #11131b;
             margin: 0 0 ${LEAD * 0.55}pt; }
  .sheet b { font-weight: 700; }
  .sheet .legible { font-size: ${(BODY * 1.7).toFixed(1)}pt; letter-spacing: 0.02em;
                    margin: 4mm 0 0; color: #071c4f; }
</style></head><body>
<h1>The reference body face — five candidates</h1>
<p class="sub">Chapter 1's own copy, measure and type: ${BODY}pt on ${LEAD}pt, ${MEASURE}mm measure, 189mm trim, true size.</p>
${CANDIDATES.map(specimen).join('\n')}
</body></html>`;

const out = path.join(ROOT, 'build', '_type-swatch');
await mkdir(out, { recursive: true });
const page = path.join(out, 'swatch.html');
await writeFile(page, html);

if (!CHROME) { console.error('No Chrome found — set one in CHROME.'); process.exit(1); }
const png = path.join(out, 'reference-body.png');
await run(CHROME, [
  '--headless=new', ...SANDBOX, '--disable-gpu', '--hide-scrollbars',
  '--force-device-scale-factor=2', '--window-size=760,2250',
  '--virtual-time-budget=20000', '--screenshot=' + png,
  'file:///' + page.replace(/\\/g, '/'),
]);
console.log('  → ' + path.relative(ROOT, png));
