/* One-off: DESIGN.md §7 forbids stacking two panels back to back —
   running text has to sit between them. The conversion examples were
   written as a run of five, so this inserts the connecting sentences.

   Keyed on the example's tab text, so it does not matter which page
   file repack has since moved each one into. */
import { readFile, writeFile, readdir } from 'node:fs/promises';

const dir = 'pages/class-9/ch03-world-of-numbers/';

const BRIDGES = {
  'Example 10':
    'That was the easy direction, and it needed no algebra at all — only a\n'
    + 'reading of what the decimal already said. The moment the digits stop\n'
    + 'stopping, that reading is unavailable, and something else has to take\n'
    + 'its place.',
  'Example 11':
    'The multiplier there was $10^1$ because the cycle was one digit long.\n'
    + 'That is not a coincidence to be memorised; it is what made the two\n'
    + 'tails line up. A longer cycle needs a longer shift.',
  'Example 12':
    'In both of those the repetition began immediately after the decimal\n'
    + 'point. Very often it does not — a digit or two occurs once and only\n'
    + 'then does the cycle start, and a single shift can no longer bring the\n'
    + 'tails into agreement.',
  'Example 13':
    'The two multipliers in that example were doing different jobs, and the\n'
    + 'general case simply does both jobs at once, with a whole-number part\n'
    + 'along for the ride.',
  'Think and Reflect':
    'The signs did the work there, not the words. Once each event is written\n'
    + 'as an integer, the running total can be trusted without asking at every\n'
    + 'stage whether the trader is up or down — which is exactly what\n'
    + 'Brahmagupta was buying with his fifth rule.',
};

const files = (await readdir(dir)).filter((f) => /^p\d+.*\.html$/.test(f)).sort();
let done = 0;

for (const f of files) {
  let s = await readFile(dir + f, 'utf8');
  const before = s;

  for (const [tab, text] of Object.entries(BRIDGES)) {
    // the panel this bridge belongs before
    const marker = tab === 'Think and Reflect'
      ? '      <div class="c-reflect">'
      : '      <div class="c-example">\n        <div class="c-example__tab">' + tab + '</div>';
    const at = s.indexOf(marker);
    if (at < 0) continue;

    // only if a panel ends immediately above it — that is the violation
    const above = s.slice(0, at).trimEnd();
    if (!above.endsWith('</div>')) continue;
    const opensPanel = /<div class="c-(example|reflect)">/.test(above.slice(-1400));
    if (!opensPanel) continue;

    const para = '      <p>\n        ' + text.split('\n').join('\n        ') + '\n      </p>\n\n';
    s = s.slice(0, at) + para + s.slice(at);
    done++;
  }
  if (s !== before) await writeFile(dir + f, s);
}
console.log('inserted ' + done + ' connecting paragraphs');
