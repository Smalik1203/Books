#!/usr/bin/env node
/* Colour is never the only carrier (DESIGN-MATHS §5a). This lists the
   figures where it might be: any figure that sets two fills side by side
   whose greys are too close to tell apart once the colour is gone.

     node build/check-fills.mjs <pages dir> [<pages dir> ...]

   It reads the fills from css/tokens.css rather than carrying a copy, so a
   palette change is measured, not remembered. It only reports; the fix is a
   drawing decision — a label, a hatch, a heavier outline, a position —
   made figure by figure.

   The three soft fills come out at nearly the same grey (about 227, 221
   and 219 on a scale of 255), so two of them together are always
   reported. So is a lone soft fill that is the figure's only marking,
   because a pale tint on white is the first thing a photocopier loses. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tokens = fs.readFileSync(path.join(ROOT, 'css', 'tokens.css'), 'utf8');
const hex = (name) => (tokens.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`)) || [])[1];
const grey = (h) => {
  const c = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  return Math.round(0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]);
};

const FILLS = {
  'dg-fill-a': 'dg-a', 'dg-fill-b': 'dg-b', 'dg-fill-c': 'dg-c', 'dg-fill-d': 'dg-d',
  'dg-fill-a-soft': 'dg-a-soft', 'dg-fill-b-soft': 'dg-b-soft', 'dg-fill-c-soft': 'dg-c-soft',
};
const G = Object.fromEntries(Object.entries(FILLS).map(([cls, tok]) => [cls, grey(hex(tok))]));
const PAPER = 251;
const CLOSE = 30;          // greys nearer than this read as one tone in print

const dirs = process.argv.slice(2);
if (!dirs.length) { console.error('usage: node build/check-fills.mjs <pages dir> ...'); process.exit(1); }

console.log('fill greys: ' + Object.entries(G).map(([k, v]) => `${k.replace('dg-fill-', '')} ${v}`).join(', '));
let reported = 0;

for (const dir of dirs) {
  const files = fs.readdirSync(dir).filter(f => /^p\d+\.html$/.test(f)).sort();
  for (const f of files) {
    const html = fs.readFileSync(path.join(dir, f), 'utf8');
    for (const m of html.matchAll(/<svg\b[\s\S]*?<\/svg>/g)) {
      const svg = m[0];
      if (/aria-hidden="true"/.test(svg.slice(0, 200))) continue;      // icons
      const after = html.slice(m.index + svg.length, m.index + svg.length + 400);
      const num = (after.match(/fignum">(Fig\. [\d.]+)/) || [, '(unnumbered)'])[1];
      const used = {};
      for (const c of svg.matchAll(/class="(dg-fill-[a-d](?:-soft)?)"/g)) used[c[1]] = (used[c[1]] || 0) + 1;
      const kinds = Object.keys(used);
      if (!kinds.length) continue;
      const why = [];
      for (let i = 0; i < kinds.length; i++) for (let j = i + 1; j < kinds.length; j++)
        if (Math.abs(G[kinds[i]] - G[kinds[j]]) < CLOSE)
          why.push(`${kinds[i].replace('dg-fill-', '')} and ${kinds[j].replace('dg-fill-', '')} print as greys ${G[kinds[i]]} and ${G[kinds[j]]}`);
      const labelled = /<text\b/.test(svg);
      const hatched = /pattern|hatch|stroke-dasharray/.test(svg);
      if (kinds.length === 1 && G[kinds[0]] > PAPER - CLOSE - 10 && !hatched)
        why.push(`a lone ${kinds[0].replace('dg-fill-', '')} fill (grey ${G[kinds[0]]} on paper ${PAPER})`);
      if (!why.length) continue;
      reported++;
      console.log(`\n${path.basename(dir)}/${f}  ${num}  ${labelled ? 'has text labels' : 'NO text labels'}${hatched ? ', has hatching or dashes' : ''}`);
      for (const w of why) console.log(`    ${w}`);
    }
  }
}
console.log(`\n${reported} figure(s) to look at.`);
