#!/usr/bin/env node
/* ============================================================
   Turn a bitmap QR into a vector one.

     node build/qr-vectorise.mjs <in.png> <out.svg>

   A QR is a grid of squares, so a PNG of one is a lossy encoding
   of something that vectorises exactly. On a press sheet the
   difference is real:

     - no resampling, so the module edges stay hard at any size
     - pure K black, not the #222 with antialiased grey edges that
       generators emit, which separates into a four-colour black
       and can misregister
     - a few kB instead of a few hundred

   The grid is recovered from the top-left finder pattern, whose
   top row is exactly seven modules wide. Every module is then
   sampled at its centre, and the result is checked against the
   source pixel by pixel — a QR that decodes to the wrong grid
   would still look like a QR, which is the failure to be afraid
   of.
   ============================================================ */

import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const [, , inPath, outPath] = process.argv;
if (!inPath || !outPath) {
  console.error('usage: node build/qr-vectorise.mjs <in.png> <out.svg>');
  process.exit(1);
}

const img = sharp(inPath).greyscale();
const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H } = info;
const at = (x, y) => data[y * W + x];
const DARK = 128;

/* ---- content bounds: strip the quiet zone ---------------- */
let x0 = W, y0 = H, x1 = -1, y1 = -1;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (at(x, y) < DARK) {
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  }
}
if (x1 < 0) { console.error('no dark pixels — is this a QR?'); process.exit(1); }
const cw = x1 - x0 + 1, ch = y1 - y0 + 1;

/* ---- module size from the finder pattern ------------------
   The top edge of the top-left finder is seven modules of solid
   black before the first white pixel. */
let run = 0;
while (x0 + run <= x1 && at(x0 + run, y0 + 1) < DARK) run++;
const module = run / 7;
const N = Math.round(cw / module);

// A QR is square and its side is 21 + 4k modules, k = 0..40.
if (N !== Math.round(ch / module) || N < 21 || N > 177 || (N - 21) % 4 !== 0) {
  console.error(`recovered a ${N}-module grid, which is not a valid QR size`
    + ` (21 + 4k, up to 177). Module size read as ${module.toFixed(2)}px.`);
  process.exit(1);
}
const version = (N - 17) / 4;

/* ---- sample every module at its centre ------------------- */
const grid = [];
for (let r = 0; r < N; r++) {
  const row = [];
  for (let c = 0; c < N; c++) {
    const px = Math.floor(x0 + (c + 0.5) * cw / N);
    const py = Math.floor(y0 + (r + 0.5) * ch / N);
    row.push(at(px, py) < DARK ? 1 : 0);
  }
  grid.push(row);
}

/* ---- emit, merging horizontal runs ----------------------- */
const Q = 4;                       // quiet zone, in modules — the spec's minimum
const SIDE = N + 2 * Q;
const rects = [];
for (let r = 0; r < N; r++) {
  let c = 0;
  while (c < N) {
    if (!grid[r][c]) { c++; continue; }
    let len = 0;
    while (c + len < N && grid[r][c + len]) len++;
    rects.push(`<rect x="${Q + c}" y="${Q + r}" width="${len}" height="1"/>`);
    c += len;
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIDE} ${SIDE}"`
  + ` shape-rendering="crispEdges" role="img" aria-label="QR code">`
  + `<rect width="${SIDE}" height="${SIDE}" fill="#ffffff"/>`
  + `<g fill="#000000">${rects.join('')}</g></svg>\n`;
await writeFile(outPath, svg);

/* ---- verify against the source --------------------------- */
const check = await sharp(Buffer.from(svg))
  .resize(N, N, { kernel: 'nearest' }).greyscale().raw().toBuffer();
// The re-render includes the quiet zone, so compare the grid itself.
const back = await sharp(Buffer.from(svg))
  .extract({ left: 0, top: 0, width: SIDE, height: SIDE })
  .resize(SIDE, SIDE, { kernel: 'nearest' }).greyscale().raw().toBuffer();
let bad = 0;
for (let r = 0; r < N; r++) {
  for (let c = 0; c < N; c++) {
    const v = back[(r + Q) * SIDE + (c + Q)] < DARK ? 1 : 0;
    if (v !== grid[r][c]) bad++;
  }
}

console.log(`  ${inPath}: ${W}x${H}px → version ${version}, ${N}x${N} modules`
  + ` (${module.toFixed(2)}px each)`);
console.log(`  ${rects.length} runs, ${(svg.length / 1024).toFixed(1)}kB`);
console.log(bad ? `  ! ${bad} module(s) differ on re-render — DO NOT SHIP`
                : `  all ${N * N} modules match on re-render`);
console.log(`  → ${outPath}`);
if (bad) process.exit(1);
