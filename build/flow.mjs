#!/usr/bin/env node
/* Flow running text across a page break, so a page is not left short
 * merely because the next block will not fit whole.
 *
 * repack moves whole blocks and stops there: if the next page opens
 * with a paragraph too tall for the space left, the space stays
 * empty. A real typesetter would break the paragraph over the page,
 * and so does this. Paragraphs in this book carry no first-line
 * indent, so a continued one is indistinguishable from a new one —
 * the join is invisible.
 *
 *   node build/flow.mjs class-9/ch04-algebraic-identities [--min 92]
 *
 * Whole paragraphs move first; the one that will not fit is divided
 * at a word boundary, never inside a $...$ span or an HTML tag. Each
 * trial is measured by the real builder, so the answer is what the
 * page actually does. A figure is never touched.
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const args = process.argv.slice(2);
const chapter = args[0];
if (!chapter) { console.error('usage: node build/flow.mjs <class/chapter> [--min N]'); process.exit(1); }
const MIN = Number(args[args.indexOf('--min') + 1]) || 92;
const dir = path.join('pages', chapter);
const pad = (n) => 'p' + String(n).padStart(3, '0') + '.html';
const file = (n) => path.join(dir, pad(n));

const rd = async (f) => {
  const raw = await readFile(f, 'utf8');
  return [raw.replace(/\r\n/g, '\n'), /\r\n/.test(raw)];
};
const wr = (f, s, crlf) => writeFile(f, crlf ? s.replace(/\n/g, '\r\n') : s);

const build = () => {
  const out = execFileSync(process.execPath, ['build/build.mjs', chapter], { encoding: 'utf8' });
  const fills = {};
  for (const m of ((out.match(/fill .*/) || [''])[0]).matchAll(/(\d+):(\d+)%/g)) fills[+m[1]] = +m[2];
  return { fills, bad: /design violation/.test(out) };
};

/* Word boundaries in `s` that are safe to break at: outside any tag
   and outside any $...$ maths span. Returns candidate cut offsets. */
function safeBreaks(s) {
  const out = [];
  let inTag = false, inMath = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === '<') inTag = true;
    else if (c === '>') inTag = false;
    else if (c === '$' && !inTag) inMath = !inMath;
    else if (/\s/.test(c) && !inTag && !inMath) {
      let j = i; while (j < s.length && /\s/.test(s[j])) j++;
      if (j > i && i > 0) out.push([i, j]);
      i = j - 1;
    }
  }
  return out;
}

/* The page's leading <p>, as [openTagEnd, closeTagStart, blockStart, blockEnd]. */
function leadingParagraph(html) {
  const mainOpen = html.indexOf('<div class="page__main">');
  if (mainOpen < 0) return null;
  const after = html.indexOf('>', mainOpen) + 1;
  const rest = html.slice(after);
  const m = rest.match(/^\s*<p>/);
  if (!m) return null;
  const blockStart = after + rest.indexOf('<p>');
  const open = blockStart + 3;
  const close = html.indexOf('</p>', open);
  if (close < 0) return null;
  return { blockStart, open, close, blockEnd: close + 4 };
}

const indent = (s, pad) => s.split('\n').map(l => l.trim() ? pad + l.trim() : '').join('\n');

let { fills } = build();
const nPages = Object.keys(fills).length;
let moved = 0;
const left = [];

for (let n = 1; n < nPages; n++) {
  if (fills[n] >= MIN) continue;

  for (let guard = 0; guard < 6; guard++) {
    if (fills[n] >= MIN) break;
    const [aRaw, aC] = await rd(file(n));
    const [bRaw, bC] = await rd(file(n + 1));
    const para = leadingParagraph(bRaw);
    if (!para) { left.push([n, fills[n]]); break; }

    const inner = bRaw.slice(para.open, para.close);
    const cuts = safeBreaks(inner);
    const before = fills[n];

    /* Binary search the largest slice of the paragraph that fits. */
    let lo = 0, hi = cuts.length, bestCut = -1, bestFill = before;
    const trial = async (ci) => {
      const [ws, we] = ci < 0 ? [inner.length, inner.length] : cuts[ci];
      const headText = inner.slice(0, ws).trim();
      const tailText = inner.slice(we).trim();
      let a = aRaw, b = bRaw;
      const closeAt = a.lastIndexOf('    </div>\n  </div>\n</section>');
      a = a.slice(0, closeAt).replace(/\s+$/, '\n') +
          '\n      <p>\n' + indent(headText, '        ') + '\n      </p>\n' +
          '\n    </div>\n  </div>\n</section>\n';
      b = tailText
        ? b.slice(0, para.open) + '\n' + indent(tailText, '        ') + '\n      ' + b.slice(para.close)
        : b.slice(0, para.blockStart).replace(/\s+$/, '\n\n') + b.slice(para.blockEnd).replace(/^\n/, '');
      await wr(file(n), a, aC);
      await wr(file(n + 1), b, bC);
      return build();
    };

    /* Filling this page by emptying the next one is not a gain: it
       moves the hole rather than closing it. Only take a move that
       raises the worse of the two pages. */
    const beforeNext = fills[n + 1] ?? 100;
    const worseBefore = Math.min(before, beforeNext);
    const improves = (r) => Math.min(r.fills[n], r.fills[n + 1] ?? 100) > worseBefore;

    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const r = await trial(mid);
      if (!r.bad && r.fills[n] <= 100) {
        if (improves(r)) { bestCut = mid; bestFill = r.fills[n]; }
        lo = mid + 1;
      } else hi = mid;
    }
    /* Does the whole paragraph fit? */
    const whole = await trial(-1);
    if (!whole.bad && whole.fills[n] <= 100 && whole.fills[n] > bestFill && improves(whole)) {
      fills = whole.fills; moved++;
      console.log(`  page ${n}: ${before}% -> ${whole.fills[n]}%  (a whole paragraph moved up)`);
      continue;                                   // try to pull the next one too
    }
    if (bestCut >= 0 && bestFill > before) {
      const r = await trial(bestCut);
      fills = r.fills; moved++;
      console.log(`  page ${n}: ${before}% -> ${r.fills[n]}%  (paragraph broken over the page)`);
      break;
    }
    await wr(file(n), aRaw, aC);
    await wr(file(n + 1), bRaw, bC);
    left.push([n, before]);
    break;
  }
}

console.log(`\n  ${moved} move(s).`);
if (left.length) {
  console.log('  still short (the next page opens with something that cannot be divided):');
  for (const [n, f] of left) console.log(`    page ${n}  ${f}%`);
}
