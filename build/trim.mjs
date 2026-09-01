/* One-off: shorten the closing COMMENTARY of the tallest example
   panels. Every worked step is left untouched — only the remarks
   after the answer are tightened, so the panels pack better.

   Each edit is anchored on two plain substrings (no backslashes, so
   nothing can be mangled in transit) and replaces the span between. */
import { readFile, writeFile, readdir } from 'node:fs/promises';

const dir = 'chapters/ch05/pages/';

const EDITS = [
  { from: 'Theorem 1 says the other two vertices',
    to: 'passes through every vertex.</p>',
    text: 'Check the other two rather than assume them: <m>OB</m> and <m>OC</m>\n' +
          'come to <m>5</m> as well. All three agree, as Theorem 1 says they must.</p>' },

  { from: 'The second part needs no calculation whatever.',
    to: 'subtends the same angle at the centre:\n    <m>60^\\circ</m>.</p>',
    text: 'The second part needs no calculation. The other chord is the same\n' +
          '    length, so by Theorem 2 it subtends the same angle.</p>' },

  { from: 'The chord lies <m>6</m> cm from the centre. Worth one glance',
    to: 'it altogether.</p>',
    text: 'The chord lies <m>6</m> cm from the centre — less than the radius, as it\n' +
          '    must be: a line <m>10</m> cm out would only touch the circle.</p>' },

  { from: 'Both answers are right. A question of this kind',
    to: 'given both.</p>',
    text: 'Both are right. A question like this is not finished until you say which\n' +
          '    case you are in — or give both.</p>' },

  { from: 'So the longer chord sits <m>7</m> cm from the centre',
    to: 'has to agree.</p>',
    text: 'The longer chord sits <m>7</m> cm out and the shorter <m>24</m> cm, a\n' +
          '    difference of <m>17</m> cm — the ordering Theorem 8 promised before any\n' +
          '    arithmetic began.</p>' },

  { from: 'The corollary did all the work. Without it',
    to: 'diameter.</p>',
    text: 'The corollary did all the work: without it, one angle and a diameter\n' +
          '    would not determine the triangle at all.</p>' },
];

const files = (await readdir(dir)).filter((f) => f.endsWith('.html'));
let done = 0;
for (const f of files) {
  let s = await readFile(dir + f, 'utf8');
  const before = s;
  for (const e of EDITS) {
    const i = s.indexOf(e.from);
    if (i < 0) continue;
    const j = s.indexOf(e.to, i);
    if (j < 0) { console.error('  end anchor missing for: ' + e.from.slice(0, 40)); continue; }
    s = s.slice(0, i) + e.text + s.slice(j + e.to.length);
    done++;
  }
  if (s !== before) await writeFile(dir + f, s);
}
console.log('trimmed ' + done + ' of ' + EDITS.length + ' example closings');
