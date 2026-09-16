/* Nothing in Beyond the Book may repeat a question or example the chapter
   body already sets (DESIGN-MATHS §6a). Checked phrase by phrase rather
   than by eye.

   Two things this gets wrong if done naively, both found by doing it:
   comparing all prose rather than questions floods the report with
   explanation that is *meant* to say the same thing; and scoring an
   overlap against the SHORTER sentence makes every short question a
   100% match for any long one that contains its words. So: questions
   only, and a symmetric score. */
import fs from 'node:fs';
import path from 'node:path';

const dir = process.argv[2];
const files = fs.readdirSync(dir).filter(f => /^p\d+\.html$/.test(f)).sort();

const strip = (s) => s
  .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/&ldquo;|&rdquo;/g, '"')
  .replace(/&[a-z]+;/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

/* What counts as a question the chapter sets: an exercise or practice
   item, a question put in a try band or a reflect box, and the question
   line of a worked example. */
function questions(html) {
  const out = [];
  const take = (re, what) => {
    for (const m of html.matchAll(re)) {
      const t = strip(m[1]);
      if (t.length > 20) out.push({ what, t });
    }
  };
  take(/<div class="c-try">([\s\S]*?)<\/div>/g, 'try');
  take(/<div class="c-example__body">\s*<p>([\s\S]*?)<\/p>/g, 'example');
  for (const blk of html.matchAll(/<ol class="c-questions"[^>]*>([\s\S]*?)<\/ol>\s*<\/div>/g))
    for (const li of blk[1].split(/<li>/).slice(1)) {
      const t = strip(li.split(/<ol/)[0]);
      if (t.length > 20) out.push({ what: 'question', t });
    }
  for (const blk of html.matchAll(/<div class="c-reflect">([\s\S]*?)<\/div>\s*<\/div>/g))
    for (const li of blk[1].split(/<li>/).slice(1)) {
      const t = strip(li.split(/<ol/)[0]);
      if (t.length > 20) out.push({ what: 'reflect', t });
    }
  return out;
}

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
const STOP = new Set(['the', 'and', 'that', 'this', 'with', 'from', 'are', 'for', 'you',
  'is', 'of', 'a', 'in', 'to', 'it', 'its', 'by', 'or', 'not', 'each', 'them', 'their',
  'what', 'which', 'write', 'find', 'many', 'how', 'these', 'your', 'answer', 'number',
  'numbers', 'any', 'all', 'more', 'than', 'then', 'they', 'have', 'has', 'was', 'one',
  'two', 'three', 'four', 'five', 'first', 'without', 'also', 'same', 'other', 'there']);
/* The words of a question, and its mathematics. norm() throws maths away
   with the markup, so "Is 16/20 in lowest terms?" and "Which of 21/35 and
   26/39 is in lowest terms?" scored 100%. Loose digits are no better: every
   fraction question shares 1, 2 and 3. So each maths span counts as one
   token, whole, and a number counts only where it stands in the prose.
   Two questions then share a maths token only when they print the same
   expression — which is the repeat that matters most. */
const key = (s) => {
  const maths = (s.match(/\$[^$]*\$/g) || [])
    .map(m => 'm:' + m.replace(/\dfrac|\tfrac/g, '\frac').replace(/[\s$]/g, ''));
  const prose = s.replace(/\$[^$]*\$/g, ' ');
  const words = norm(prose).split(' ').filter(w => w.length > 2 && !STOP.has(w) && !/^\d+$/.test(w));
  const nums = (prose.match(/\d+/g) || []).map(n => '#' + n);
  return new Set([...words, ...nums, ...maths]);
};

function jaccard(a, b) {
  const A = key(a), B = key(b);
  if (A.size < 3 || B.size < 3) return 0;
  let n = 0;
  for (const w of A) if (B.has(w)) n++;
  return n / (A.size + B.size - n);
}

const body = [], bridge = [];
for (const f of files) {
  const html = fs.readFileSync(path.join(dir, f), 'utf8');
  for (const q of questions(html)) (/^p1/.test(f) ? bridge : body).push({ f, ...q });
}

console.log(`${body.length} question(s) in the chapter body, ${bridge.length} in Beyond the Book`);

const hits = [];
for (const b of bridge) for (const c of body) {
  const o = jaccard(b.t, c.t);
  if (o >= 0.5) hits.push({ o, b, c });
}
hits.sort((x, y) => y.o - x.o);

if (!hits.length) {
  console.log('\nno question in the division is close to one in the body.');
  process.exit(0);
}
console.log(`\n${hits.length} pair(s) at 50% or more, to judge by hand:\n`);
for (const h of hits.slice(0, 20)) {
  console.log(`  ${(h.o * 100).toFixed(0)}%`);
  console.log(`    beyond ${h.b.f} (${h.b.what}): ${h.b.t.slice(0, 150)}`);
  console.log(`    body   ${h.c.f} (${h.c.what}): ${h.c.t.slice(0, 150)}\n`);
}
