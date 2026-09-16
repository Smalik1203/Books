/* DESIGN-MATHS §5a: colour is never the only carrier. A chapter has to be
   read in greyscale and by a colour-blind reader, and nothing in the
   pipeline does either. This writes both versions of a proof so they can
   be looked at, and measures the one thing a look is bad at: whether the
   ink still separates from its ground by value once the hue is gone.

     node colour-check.mjs <proofs dir> <page> [page ...]
*/
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const [dir, ...pages] = process.argv.slice(2);
const out = path.join(dir, '_colour');
fs.mkdirSync(out, { recursive: true });

/* Brettel-style simulation, the usual linear approximation: drop the
   missing cone's contribution and rebuild the other two. */
const MATS = {
  deuteranopia: [[0.625, 0.375, 0], [0.7, 0.3, 0], [0, 0.3, 0.7]],
  protanopia: [[0.567, 0.433, 0], [0.558, 0.442, 0], [0, 0.242, 0.758]],
  tritanopia: [[0.95, 0.05, 0], [0, 0.433, 0.567], [0, 0.475, 0.525]],
};

for (const p of pages) {
  const file = path.join(dir, `p${String(p).padStart(3, '0')}.png`);
  if (!fs.existsSync(file)) { console.log(`no proof for page ${p}`); continue; }

  await sharp(file).greyscale().toFile(path.join(out, `p${p}-grey.png`));

  for (const [name, m] of Object.entries(MATS)) {
    await sharp(file).recomb(m).toFile(path.join(out, `p${p}-${name}.png`));
  }

  /* The measurement: the darkest and lightest greys actually used, and how
     much of the page sits in the mid band where a tint behind small type
     stops being legible. */
  const { data, info } = await sharp(file).greyscale().raw().toBuffer({ resolveWithObject: true });
  const hist = new Array(256).fill(0);
  for (let i = 0; i < data.length; i += info.channels) hist[data[i]]++;
  const total = data.length / info.channels;
  const ink = hist.slice(0, 128).reduce((a, b) => a + b, 0);
  const mid = hist.slice(120, 200).reduce((a, b) => a + b, 0);
  console.log(`page ${p}: ${(ink / total * 100).toFixed(1)}% of pixels are ink-dark, `
    + `${(mid / total * 100).toFixed(1)}% sit in the mid band`);
}
console.log(`\nwritten to ${out}`);
