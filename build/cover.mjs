#!/usr/bin/env node
/* ============================================================
   LearnLab B5 Maths — cover builder

     node build/cover.mjs class-9/maths-part1
     node build/cover.mjs class-9/maths-part1 --pdf --png
     node build/cover.mjs class-9/maths-part1 --bleed
     node build/cover.mjs class-9              (every cover under it)

   A cover is not a chapter, so it does not go through build.mjs:
   there is no folio to stamp, no running head to add, no text
   block to overset, and the sheet is back + spine + front rather
   than one trim. What it does share is the tokens, the two faces
   and the type scale — it links the same book.css.

   Three things this build works out rather than trusting the
   source to have got right:

     spine width   from the page count and the paper's caliper.
                   A spine typed by hand is a spine that is wrong
                   the next time the extent changes.
     EAN-13        the check digit is computed from the first
                   twelve, and the bars are drawn from all
                   thirteen. A hand-drawn barcode does not scan.
     QR            drawn as a placeholder unless cover.json points
                   at a real one, and said so loudly either way.
   ============================================================ */

import { readFile, writeFile, readdir, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = (...parts) => path.join(ROOT, ...parts);

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];
const findChrome = () => CHROME_CANDIDATES.find(c => existsSync(c));

const escapeHtml = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/* ---- Sheet metrics -----------------------------------------
   Read out of the tokens, exactly as build.mjs does, so the box
   Chrome is told to print can never drift from the box the
   stylesheet lays the wrap out in. */
async function tokenReader(edition) {
  const src = await readFile(p('css', 'tokens.css'), 'utf8');
  const over = edition
    ? await readFile(p('css', 'edition-' + edition + '.css'), 'utf8').catch(() => '')
    : '';
  return (name) => {
    const from = over.includes('--' + name + ':') ? over : src;
    const at = from.indexOf('--' + name + ':');
    return from.slice(at + name.length + 3, at + name.length + 30);
  };
}

/* ---- Spine ------------------------------------------------
   Bulk, not taste. Leaves are half the page count; each leaf is
   one caliper thick; the covers and the glue add a fixed
   allowance. A cover may state a width outright — a printer who
   has measured the stock always wins — and then this is skipped. */
function spineWidth(meta) {
  if (meta.spineWidth != null) {
    return { mm: Number(meta.spineWidth), how: 'declared in cover.json' };
  }
  const pages = Number(meta.pages);
  const caliper = Number(meta.paperCaliper);
  if (!pages || !caliper) {
    return { mm: 16, how: 'FALLBACK — no pages/paperCaliper in cover.json' };
  }
  const allowance = Number(meta.caseAllowance ?? 0);
  const mm = (pages / 2) * caliper + allowance;
  return {
    mm: Math.round(mm * 10) / 10,
    how: `${pages}pp / 2 x ${caliper}mm + ${allowance}mm case`,
  };
}

/* ---- EAN-13 ------------------------------------------------
   95 modules: a 3-module guard, six digits, a 5-module centre
   guard, six digits, a 3-module guard. The left six are encoded
   in L or G according to a parity pattern chosen by the first
   digit — which is how thirteen digits fit into twelve
   positions. */
const EAN_L = ['0001101', '0011001', '0010011', '0111101', '0100011',
               '0110001', '0101111', '0111011', '0110111', '0001011'];
const EAN_G = ['0100111', '0110011', '0011011', '0100001', '0011101',
               '0111001', '0000101', '0010001', '0001001', '0010111'];
const EAN_R = EAN_L.map(c => c.replace(/[01]/g, b => (b === '0' ? '1' : '0')));
const EAN_PARITY = ['LLLLLL', 'LLGLGG', 'LLGGLG', 'LLGGGL', 'LGLLGG',
                    'LGGLLG', 'LGGGLL', 'LGLGLG', 'LGLGGL', 'LGGLGL'];

const eanCheckDigit = (first12) => {
  let sum = 0;
  for (let i = 0; i < 12; i++) sum += Number(first12[i]) * (i % 2 ? 3 : 1);
  return (10 - (sum % 10)) % 10;
};

function eanModules(digits) {
  const parity = EAN_PARITY[Number(digits[0])];
  let bits = '101';
  for (let i = 1; i <= 6; i++) {
    bits += (parity[i - 1] === 'L' ? EAN_L : EAN_G)[Number(digits[i])];
  }
  bits += '01010';
  for (let i = 7; i <= 12; i++) bits += EAN_R[Number(digits[i])];
  return bits + '101';
}

/* Quiet zones are part of the symbol, not padding around it: 11
   modules to the left and 7 to the right, and a scanner that does
   not get them does not read the code. */
const QUIET_L = 11, QUIET_R = 7;
const BAR_H = 62, GUARD_H = 67, ART_H = 80;

function eanSvg(digits) {
  const bits = eanModules(digits);
  // The guard bars run longer than the rest, which is what lets the
  // digits sit in the gaps they leave.
  const isGuard = (i) => i < 3 || (i >= 45 && i < 50) || i >= 92;
  const bars = [];
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] !== '1') continue;
    const h = isGuard(i) ? GUARD_H : BAR_H;
    bars.push(`<rect class="ean__bar" x="${QUIET_L + i}" y="0" width="1" height="${h}"/>`);
  }
  const digit = (ch, x, anchor = 'middle') =>
    `<text class="ean__digit" x="${x}" y="${ART_H - 3}" text-anchor="${anchor}">${ch}</text>`;

  const glyphs = [digit(digits[0], QUIET_L - 2, 'end')];
  for (let i = 1; i <= 6; i++) glyphs.push(digit(digits[i], QUIET_L + 3 + (i - 1) * 7 + 3.5));
  for (let i = 7; i <= 12; i++) glyphs.push(digit(digits[i], QUIET_L + 50 + (i - 7) * 7 + 3.5));

  return `<svg class="ean" viewBox="0 0 ${QUIET_L + 95 + QUIET_R} ${ART_H}"`
    + ` xmlns="http://www.w3.org/2000/svg" role="img"`
    + ` aria-label="EAN-13 barcode, ${digits}">`
    + `<rect class="qr__quiet" x="0" y="0" width="${QUIET_L + 95 + QUIET_R}" height="${ART_H}"/>`
    + bars.join('') + glyphs.join('') + `</svg>`;
}

/* ---- QR ----------------------------------------------------
   A real QR must be generated from the URL by an encoder, and
   there is none in this repo's dependencies. So: use the file the
   cover points at if there is one, and otherwise draw a stand-in
   that is obviously a QR to a designer and obviously not one to a
   phone — and say so at every build until it is replaced. */
async function qrSvg(meta) {
  if (meta.qr) {
    const file = p(meta.qr);
    if (existsSync(file)) return { svg: await readFile(file, 'utf8'), real: true };
    console.warn(`    ! qr: ${meta.qr} not found — falling back to the placeholder`);
  }

  const N = 25, Q = 2, SIDE = N + 2 * Q;
  const finder = (r, c) => {
    // A finder is a 7x7: filled ring, white gap, filled 3x3 core.
    const dr = Math.max(Math.abs(r - 3), Math.abs(c - 3));
    return dr === 3 || dr <= 1;
  };
  const inFinder = (r, c) =>
    (r < 7 && c < 7) || (r < 7 && c >= N - 7) || (r >= N - 7 && c < 7);

  // Deterministic, so the placeholder does not churn the diff on
  // every build. A cheap integer hash is enough to look like data.
  const mods = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      let on;
      if (r < 7 && c < 7) on = finder(r, c);
      else if (r < 7 && c >= N - 7) on = finder(r, c - (N - 7));
      else if (r >= N - 7 && c < 7) on = finder(r - (N - 7), c);
      else if (inFinder(r, c)) on = false;
      else if ((r === 7 && c < 8) || (c === 7 && r < 8)) on = false;
      else on = (((r * 73 + c * 151 + r * c * 17) >>> 3) & 1) === 1;
      if (on) mods.push(`<rect x="${Q + c}" y="${Q + r}" width="1" height="1"/>`);
    }
  }
  return {
    real: false,
    svg: `<svg class="qr" viewBox="0 0 ${SIDE} ${SIDE}" xmlns="http://www.w3.org/2000/svg"`
      + ` role="img" aria-label="QR code placeholder — not scannable">`
      + `<rect class="qr__quiet" x="0" y="0" width="${SIDE}" height="${SIDE}"/>`
      + `<g class="qr__mod">${mods.join('')}</g></svg>`,
  };
}

/* ---- Shell ------------------------------------------------- */
const shell = (meta, body, spine, sheet, bleed) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(meta.imprint)} ${escapeHtml(meta.title)} — Class ${escapeHtml(meta.class)}, Part ${escapeHtml(meta.part)} — cover</title>
<link rel="stylesheet" href="../../../css/book.css">${meta.edition ? `
<link rel="stylesheet" href="../../../css/edition-${escapeHtml(meta.edition)}.css">` : ``}
<link rel="stylesheet" href="../../../css/cover.css">
<style>:root { --spine-w: ${spine.mm}mm; }
@page { size: ${bleed ? sheet.mediaW : sheet.sheetW}mm ${bleed ? sheet.mediaH : sheet.trimH}mm; margin: 0; }</style>
</head>
<body class="cover${bleed ? ' bleed' : ''}">
<div class="cover-stage">
<div class="jacket${meta.finish === 'night' ? ' jacket--night' : ''}">
${body}
</div>
</div>
</body>
</html>
`;

/* ---- Build one cover --------------------------------------- */
async function buildCover(rel) {
  const src = p('covers', rel);
  const meta = JSON.parse(await readFile(path.join(src, 'cover.json'), 'utf8'));
  let body = await readFile(path.join(src, 'cover.html'), 'utf8');

  const tok = await tokenReader(meta.edition);
  const mm = (name) => parseFloat(tok(name));
  const trimW = mm('trim-w'), trimH = mm('trim-h'), bleedMM = mm('bleed');
  const spine = spineWidth(meta);
  const sheet = {
    trimW, trimH, bleed: bleedMM, spine: spine.mm,
    sheetW: 2 * trimW + spine.mm,
    mediaW: 2 * trimW + spine.mm + 2 * bleedMM,
    mediaH: trimH + 2 * bleedMM,
  };

  /* ISBN. The thirteenth digit is arithmetic, not data: recompute it
     and say so rather than printing a barcode that will not scan. */
  const raw = String(meta.isbn ?? '').replace(/[^0-9]/g, '');
  if (raw.length !== 13) throw new Error(`isbn "${meta.isbn}" is not 13 digits`);
  const check = eanCheckDigit(raw);
  const digits = raw.slice(0, 12) + check;
  if (Number(raw[12]) !== check) {
    console.warn(`    ! isbn check digit is ${raw[12]}, should be ${check}`
      + ` — the barcode and the printed ISBN both use ${check}`);
  }
  const isbnPretty = meta.isbn.replace(/[0-9](?=[^0-9]*$)/, String(check));

  const qr = await qrSvg(meta);
  if (!qr.real) {
    console.warn('    ! QR is a PLACEHOLDER and will not scan.'
      + ' Generate one for ' + (meta.url ?? 'the site')
      + ' and point cover.json at it with "qr": "assets/qr-....svg".');
  }

  body = body
    .replace('<!--BARCODE-->', eanSvg(digits))
    .replace('<!--QR-->', qr.svg)
    .replace('<!--ISBN-->', escapeHtml(isbnPretty))
    .replace('<!--URL-->', escapeHtml(meta.url ?? ''));

  for (const token of ['<!--BARCODE-->', '<!--QR-->', '<!--ISBN-->', '<!--URL-->']) {
    if (body.includes(token)) console.warn(`    ! ${token} appears more than once — only the first was filled`);
  }

  const outDir = p('build', 'covers', path.dirname(rel));
  await mkdir(outDir, { recursive: true });
  const name = path.basename(rel);
  const outHtml = path.join(outDir, name + '.html');
  await writeFile(outHtml, shell(meta, body, spine, sheet, false));

  /* The placeholder QR looks like a QR — that is the point of it, and
     it is also the danger. A proof may carry it; a press sheet may not,
     because the only person who would notice is the reader holding the
     printed book. --allow-placeholder is the deliberate way past. */
  let bleedHtml = null;
  if (wantBleed) {
    if (!qr.real && !allowPlaceholder) {
      console.error('    x refusing to write the press sheet with a placeholder QR.'
        + ' Supply a real one in cover.json, or pass --allow-placeholder.');
      pressRefused = true;
    } else {
      bleedHtml = path.join(outDir, name + '-bleed.html');
      await writeFile(bleedHtml, shell(meta, body, spine, sheet, true));
    }
  }

  console.log(`  ${rel}: ${meta.finish ?? 'light'} finish, spine ${spine.mm}mm (${spine.how})`);
  console.log(`    wrap ${sheet.sheetW} x ${sheet.trimH}mm trim`
    + `  =  ${trimW} back + ${spine.mm} spine + ${trimW} front`);
  return { outHtml, bleedHtml, meta, sheet };
}

/* ---- Fit check ---------------------------------------------
   The panels are fixed boxes and anything past them is clipped in
   silence, exactly as on a page. Measure the three panels in
   Chrome rather than trusting the layout to have held. */
async function checkFit(htmlPath, sheet) {
  const chrome = findChrome();
  if (!chrome) return;

  const probe = `<script>
    window.addEventListener('load', function () {
      var out = [];
      [['back','.jacket__back'],['spine','.jacket__spine'],['front','.jacket__front']]
        .forEach(function (pair) {
          var el = document.querySelector(pair[1]);
          if (!el) return;
          var over = Math.max(el.scrollHeight - el.clientHeight,
                              el.scrollWidth  - el.clientWidth);
          out.push({ panel: pair[0], over: Math.round(over) });
        });
      // The title is the widest thing on the cover and the first thing
      // to break when the wording changes. Measure it against the block
      // it sits in, which is already inset by the panel's margins —
      // reading --jk-margin back out would give millimetres to compare
      // against pixels, which is how this check first passed a title
      // that ran 18mm off the panel.
      var t = document.querySelector('.front__title h1');
      var box = document.querySelector('.front__title');
      if (t && box) out.push({ panel: 'title', over: Math.round(t.scrollWidth - box.clientWidth) });
      document.title = 'FIT' + JSON.stringify(out);
    });
  <\/script>`;

  const tmp = htmlPath.replace(/\.html$/, '-check.html');
  const src = await readFile(htmlPath, 'utf8');
  await writeFile(tmp, src.replace('</head>', probe + '\n</head>'));

  const { stdout } = await run(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    `--window-size=${px(sheet.sheetW)},${px(sheet.trimH)}`,
    '--virtual-time-budget=8000', '--dump-dom',
    'file:///' + tmp.replace(/\\/g, '/'),
  ], { maxBuffer: 1 << 26 });
  await rm(tmp, { force: true });

  const json = stdout.match(/FIT(\[.*?\])<\/title>/s)?.[1];
  if (!json) { console.warn('    ! fit check did not report'); return; }
  const PX_PER_MM = 96 / 25.4;
  const rows = JSON.parse(json);
  let bad = 0;
  for (const r of rows) {
    if (r.over <= 2) continue;
    bad++;
    const over = (r.over / PX_PER_MM).toFixed(1);
    console.warn(r.panel === 'title'
      ? `    ! the title is ${over}mm wider than the front panel's margins`
      : `    ! the ${r.panel} panel overruns by ${over}mm — content is being clipped`);
  }
  if (!bad) console.log('    all three panels fit');
}

/* ---- Output ------------------------------------------------ */
const MM_TO_PX = 96 / 25.4;
const px = (mm) => Math.round(mm * MM_TO_PX);

async function toPdf(htmlPath) {
  const chrome = findChrome();
  if (!chrome) throw new Error('No Chrome or Edge found — set one in CHROME_CANDIDATES.');
  const pdfPath = htmlPath.replace(/\.html$/, '.pdf');
  await run(chrome, [
    '--headless=new', '--disable-gpu',
    '--no-pdf-header-footer', '--print-to-pdf-no-header',
    '--virtual-time-budget=15000',
    `--print-to-pdf=${pdfPath}`,
    'file:///' + htmlPath.replace(/\\/g, '/'),
  ], { maxBuffer: 1 << 24 });
  console.log(`  → ${path.relative(ROOT, pdfPath)}`);
  return pdfPath;
}

/* A proof of the whole wrap at 2x, flush to the trim, so the
   spine can be checked against the two panels either side of it. */
async function toPng(htmlPath, sheet) {
  const chrome = findChrome();
  if (!chrome) throw new Error('No Chrome or Edge found — set one in CHROME_CANDIDATES.');
  const png = htmlPath.replace(/\.html$/, '-proof.png');
  const tmp = htmlPath.replace(/\.html$/, '-proofsrc.html');
  const src = await readFile(htmlPath, 'utf8');
  await writeFile(tmp, src.replace('</head>',
    '<style>body.cover{background:#fff}.cover-stage{padding:0}</style>\n</head>'));

  const wide = htmlPath.includes('-bleed');
  await run(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
    '--force-device-scale-factor=2',
    `--window-size=${px(wide ? sheet.mediaW : sheet.sheetW)},${px(wide ? sheet.mediaH : sheet.trimH)}`,
    '--virtual-time-budget=8000',
    `--screenshot=${png}`,
    'file:///' + tmp.replace(/\\/g, '/'),
  ], { maxBuffer: 1 << 24 });
  await rm(tmp, { force: true });
  console.log(`  → ${path.relative(ROOT, png)}`);
  return png;
}

async function verifySheet(pdfPath, sheet) {
  const src = (await readFile(pdfPath)).toString('latin1');
  const boxes = [...src.matchAll(/MediaBox\s*\[\s*([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)/g)]
    .map(m => [Number(m[3]) - Number(m[1]), Number(m[4]) - Number(m[2])]);
  if (!boxes.length) { console.warn('    ! could not read the page box'); return; }
  const toMM = pt => pt * 25.4 / 72;
  const w = toMM(boxes[0][0]), h = toMM(boxes[0][1]);
  console.log(`    sheet ${w.toFixed(2)} x ${h.toFixed(2)}mm`
    + ` (wrap ${sheet.mediaW} x ${sheet.mediaH} — trim plus ${sheet.bleed}mm bleed, no marks)`);
  if (boxes.length > 1) console.warn(`    ! the cover came out as ${boxes.length} pages — it must be one`);
  if (Math.abs(w - sheet.mediaW) > 0.5 || Math.abs(h - sheet.mediaH) > 0.5) {
    console.warn('    ! that is off the intended sheet');
  }
}

/* ---- Entry ------------------------------------------------- */
const args = process.argv.slice(2);
const wantPdf = args.includes('--pdf');
const wantPng = args.includes('--png');
const wantBleed = args.includes('--bleed');
const allowPlaceholder = args.includes('--allow-placeholder');
const target = args.find(a => !a.startsWith('--'));
let pressRefused = false;

if (!target) {
  console.error('usage: node build/cover.mjs <class-9[/cover-dir]>'
    + ' [--pdf] [--png] [--bleed] [--allow-placeholder]');
  process.exit(1);
}

let covers = [target];
if (!existsSync(p('covers', target, 'cover.json'))) {
  const entries = await readdir(p('covers', target), { withFileTypes: true }).catch(() => {
    console.error(`Not found: covers/${target}`);
    process.exit(1);
  });
  covers = entries.filter(e => e.isDirectory()).map(e => `${target}/${e.name}`);
}

console.log(`Building ${covers.length} cover(s):`);
for (const c of covers) {
  const built = await buildCover(c);
  await checkFit(built.outHtml, built.sheet);
  if (wantPdf) await toPdf(built.outHtml);
  if (wantPng) await toPng(built.outHtml, built.sheet);
  if (built.bleedHtml) {
    const pdf = await toPdf(built.bleedHtml);
    await verifySheet(pdf, built.sheet);
    if (wantPng) await toPng(built.bleedHtml, built.sheet);
  }
}
console.log('Done.');
// A refused press sheet must not look like a clean build to a script.
if (pressRefused) process.exit(1);
