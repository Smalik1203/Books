#!/usr/bin/env node
/* ============================================================
   Prepare a generated illustration for print.

     node build/prep-figure.mjs <in.png> <out.png> [printWidthMm]

   Generated art arrives huge (2400px, several MB) with a flat
   near-white background. For the book it needs to be:
     · trimmed of its empty border
     · resized to 300 dpi at the width it will actually print
     · written back at a sane file size

   The background is NOT painted out here. The page CSS composites
   figures with mix-blend-mode: multiply, which drops a near-white
   background straight into the cream of the paper — no rectangle
   edge, and it keeps working if the paper colour ever changes.
   ============================================================ */

import sharp from 'sharp';
import path from 'node:path';

const [input, output, widthMm = '82'] = process.argv.slice(2);

if (!input || !output) {
  console.error('usage: node build/prep-figure.mjs <in.png> <out.png> [printWidthMm]');
  process.exit(1);
}

const DPI = 300;
const targetPx = Math.round((Number(widthMm) / 25.4) * DPI);

const src = sharp(input);
const before = await src.metadata();

const buf = await src
  .trim({ threshold: 6 })                 // shave the flat border the model leaves
  .resize({ width: targetPx, withoutEnlargement: true })
  .png({ compressionLevel: 9, palette: true, quality: 88 })
  .toBuffer();

await sharp(buf).toFile(output);
const after = await sharp(output).metadata();

const kb = n => (n / 1024).toFixed(0) + 'kB';
console.log(`${path.basename(input)}  ${before.width}×${before.height}  ${kb(before.size ?? 0)}`);
console.log(`${path.basename(output)}  ${after.width}×${after.height}  ${kb(after.size ?? 0)}`);
console.log(`prints ${widthMm}mm wide at ${Math.round(after.width / (Number(widthMm) / 25.4))} dpi`);
