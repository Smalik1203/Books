#!/usr/bin/env node
/* ============================================================
   Colourway contact sheet.

     node build/cover-swatch.mjs [direction]        (default: grid)

   Choosing a cover colour by building whole covers one at a time
   is slow and, worse, it compares a colour you are looking at now
   against one you saw ten minutes ago. This lays every candidate
   on one sheet at the same size, in the real stylesheet, with
   nothing but the colour changed — which is the only way the
   comparison means anything.

   Nothing here ships. A colourway that wins gets promoted into
   css/cover.css as a proper finish; the rest are deleted.
   ============================================================ */

import { readFile, writeFile, rm, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = (...a) => path.join(ROOT, ...a);

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
].find(c => existsSync(c));

/* A colourway is four values and a ground. Everything else on the
   cover derives from them, which is the whole point of the finish
   contract — if a candidate here needed a rule as well, the
   contract would be short a token. */
const WAYS = [
  ['cobalt',      '#1f47e0', '#ffffff', '#c2d0ff', '#ffd42e'],
  ['ultramarine', '#3520d6', '#ffffff', '#cfc8ff', '#ffe14d'],
  ['cyan',        '#0092d6', '#ffffff', '#c4ecff', '#ffe14d'],
  ['teal',        '#00857a', '#ffffff', '#b3e5df', '#ffd42e'],
  ['emerald',     '#0a7d3f', '#ffffff', '#bfe8cd', '#ffe14d'],
  ['forest',      '#16301f', '#f4ffe8', '#a7c398', '#c6f24d'],
  ['violet',      '#5b21b6', '#ffffff', '#ddd0ff', '#ffd84d'],
  ['magenta',     '#c2185b', '#ffffff', '#ffc9dd', '#ffd84d'],
  ['crimson',     '#c62828', '#ffffff', '#ffcdc7', '#ffd84d'],
  ['orange',      '#e8590c', '#ffffff', '#ffdcc4', '#fff3c4'],
  ['marigold',    '#ffb703', '#14213d', '#3c4a72', '#d62828'],
  ['ink',         '#101014', '#ffffff', '#9a9aa8', '#c8ff2e'],
];
// Chrome refuses to start its sandbox as root, which is how a CI
// container usually runs. Only then is the flag added.
const SANDBOX = process.getuid?.() === 0 ? ['--no-sandbox'] : [];

const direction = process.argv[2] ?? 'grid';
const front = await readFile(p('covers', 'class-9', '_shared', `front-${direction}.html`), 'utf8');

const SCALE = 0.44;
const COLS = 4;

const ways = WAYS.map(([name, bg, ink, soft, mark]) => `
.sw--${name} {
  --jk-front: ${bg}; --jk-front-ink: ${ink}; --jk-front-soft: ${soft};
  --jk-front-mark: ${mark}; --jk-front-accent: ${mark}; --jk-front-label: ${mark};
}`).join('');

const cells = WAYS.map(([name]) => `
<figure class="cell">
  <div class="frame"><div class="jacket jacket--a4 jacket--${direction} sw--${name}">${front}</div></div>
  <figcaption>${name}</figcaption>
</figure>`).join('');

const page = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>Colourways — ${direction}</title>
<link rel="stylesheet" href="../../css/book.css">
<link rel="stylesheet" href="../../css/cover-fonts.css">
<link rel="stylesheet" href="../../css/cover.css">
<style>
  body { margin: 0; background: #ffffff; font-family: system-ui, sans-serif; }
  .sheet { display: grid; grid-template-columns: repeat(${COLS}, max-content);
           gap: 10mm 8mm; padding: 10mm; justify-content: start; }
  .cell { margin: 0; }
  /* One panel, not a wrap: the grid the jacket normally lays out
     would put a spine and a back panel in every cell. */
  .frame { width: calc(var(--trim-w) * ${SCALE}); height: calc(var(--trim-h) * ${SCALE});
           overflow: hidden; box-shadow: 0 1mm 3mm rgba(0,0,0,.18); }
  .frame .jacket { display: block; width: var(--trim-w); height: var(--trim-h);
                   transform: scale(${SCALE}); transform-origin: top left; }
  /* In a real wrap the front is a grid item stretched to the row. On its
     own it has no height, and everything absolutely positioned inside it
     falls out. */
  .frame .jacket__front { width: var(--trim-w); height: var(--trim-h); }
  figcaption { font-size: 3.2mm; padding-top: 2mm; color: #333; letter-spacing: .04em; }
</style></head>
<body>${ways ? `<style>${ways}</style>` : ''}
<div class="sheet">${cells}</div>
</body></html>
`;

await mkdir(p('build', 'covers'), { recursive: true });
const html = p('build', 'covers', `_swatch-${direction}.html`);
await writeFile(html, page);

const MM = 96 / 25.4;
const w = Math.ceil((210 * SCALE + 8) * COLS * MM) + 80;
const h = Math.ceil((297 * SCALE + 18) * Math.ceil(WAYS.length / COLS) * MM) + 80;
const png = p('build', 'covers', `_swatch-${direction}.png`);

await run(CHROME, [
  '--headless=new', ...SANDBOX, '--disable-gpu', '--hide-scrollbars',
  '--force-device-scale-factor=2',
  `--window-size=${w},${h}`,
  '--virtual-time-budget=8000',
  `--screenshot=${png}`,
  'file:///' + html.replace(/\\/g, '/'),
], { maxBuffer: 1 << 26 });

await rm(html, { force: true });
console.log(`  ${WAYS.length} colourways on the ${direction} front`);
console.log(`  → ${path.relative(ROOT, png)}`);
