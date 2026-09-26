#!/usr/bin/env node
// Evaluate every pure-arithmetic identity set as $…$ in a chapter's pages.
// usage: node build/check-sums.mjs <class>/<chapter>
import { readFileSync, readdirSync } from 'node:fs';
const dir = `pages/${process.argv[2]}`;
const B = String.fromCharCode(92);
const strip = (t) => [['times', '*'], ['div', '/'], ['thinsp', ''], [',', ''], [';', ''], [' ', '']]
  .reduce((s, [k, v]) => s.split(B + k).join(v), t);
let n = 0, bad = 0;
for (const f of readdirSync(dir).filter(f => /^p\d{3}\.html$/.test(f)).sort()) {
  const html = readFileSync(`${dir}/${f}`, 'utf8');
  for (const m of html.matchAll(/\$([^$]+)\$/g)) {
    const t = m[1];
    if (!t.includes('=') || t.includes(B + 'cdots')) continue;
    const js = strip(t).replace(/−/g, '-').replace(/\s+/g, '');
    const sides = js.split('=').filter(s => s !== '');
    if (sides.length < 2 || sides.some(s => !/^[\d+\-*/().]+$/.test(s))) continue;
    const vals = sides.map(s => Function(`return (${s})`)());
    n++;
    if (vals.some(v => Math.abs(v - vals[0]) > 1e-9)) { bad++; console.log(`  x ${f}: $${t}$  ->  ${vals.join(' vs ')}`); }
  }
}
console.log(`${n} identities checked, ${bad} wrong`);
process.exit(bad ? 1 : 0);
