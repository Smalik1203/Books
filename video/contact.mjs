#!/usr/bin/env node
/* Tile a render's stills into one contact sheet, three across, so a
   whole film can be judged at a glance rather than a frame at a time.

     node video/contact.mjs video/out/class-6/math-ch01-patterns/01-introduction
*/
import { readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join, resolve } from 'node:path';

const sharp = createRequire(resolve(import.meta.dirname, '..', 'package.json'))('sharp');
const dir = resolve(process.argv[2]);
const stills = readdirSync(dir).filter((f) => /^still-.*\.png$/.test(f))
  .sort((a, b) => parseFloat(a.slice(6).replace('_', '.')) - parseFloat(b.slice(6).replace('_', '.')));

const TW = 640, TH = 360, COLS = 3, GAP = 8;
const rows = Math.ceil(stills.length / COLS);
const tiles = await Promise.all(stills.map(async (f, i) => ({
  input: await sharp(join(dir, f)).resize(TW, TH).toBuffer(),
  left: (i % COLS) * (TW + GAP), top: Math.floor(i / COLS) * (TH + GAP),
})));
const out = join(dir, 'contact.png');
await sharp({ create: { width: COLS * TW + (COLS - 1) * GAP, height: rows * TH + (rows - 1) * GAP, channels: 3, background: '#888' } })
  .composite(tiles).png().toFile(out);
console.log(out, `(${stills.map((f) => f.slice(6, -5).replace('_', '.')).join(', ')})`);
