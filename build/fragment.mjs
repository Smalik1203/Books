/* ============================================================
   FRAGMENTABLE BLOCKS

   Three block kinds may be broken across a page, and each breaks
   at its own natural joint:

     paragraph      between lines      (by word index)
     exercise set   between questions  (by <li>, using the
                    data-start counters components.css provides)
     .work          between steps      (by child <p>)

   Everything else — key idea, example, figure, reflect, tip,
   summary — carries break-inside: avoid in the stylesheet and is
   left whole.

   Each splitter is paired with a joiner, so reading the stream
   restores the original block and repeated runs never compound.
   ============================================================ */

/* Find the direct children of `tag` inside `src`, starting the search
   at `from`. Returns the character ranges of each child. */
export function itemRanges(src, tag, from = 0) {
  const items = [];
  let i = from, depth = 0, start = -1;
  const openRe = new RegExp('<' + tag + '\\b', 'g');
  while (i < src.length) {
    if (src[i] === '<') {
      const gt = src.indexOf('>', i);
      if (gt < 0) break;
      const t = src.slice(i, gt + 1);
      if (t.startsWith('</' + tag + '>')) {
        depth--;
        if (depth === 0 && start >= 0) { items.push([start, gt + 1]); start = -1; }
      } else if (new RegExp('^<' + tag + '\\b').test(t) && !/\/>$/.test(t)) {
        if (depth === 0) start = i;
        depth++;
      }
      i = gt + 1; continue;
    }
    i++;
  }
  return items;
}

/* ---- exercise sets ----------------------------------------- */

export function isExerciseBlock(b) {
  return /^<div class="c-practice"/.test(b) || /^<ol class="c-questions[^"]*"/.test(b);
}

/* Questions in a block, as source strings, plus the number the first
   one carries (1 unless the block is already a continuation). */
export function exerciseParts(b) {
  const olOpen = b.match(/<ol class="c-questions[^"]*"[^>]*>/);
  if (!olOpen) return null;
  const olAt = b.indexOf(olOpen[0]);
  const startAttr = olOpen[0].match(/data-start="(\d+)"/);
  const items = itemRanges(b, 'li', olAt + olOpen[0].length)
    .map(([s, e]) => b.slice(s, e));
  return { head: b.slice(0, olAt), olOpen: olOpen[0], items,
           firstNumber: startAttr ? +startAttr[1] : 1 };
}

/* Split after `q` questions. The head keeps the band title; the tail is
   a bare list that resumes the numbering. */
export function splitExercise(b, q) {
  const p = exerciseParts(b);
  const isPractice = /^<div class="c-practice"/.test(b);
  const head = p.head + p.olOpen + '\n' + p.items.slice(0, q).join('\n') +
               '\n  </ol>' + (isPractice ? '\n</div>' : '');
  const n = p.firstNumber + q;
  const tail = '<ol class="c-questions" data-start="' + n + '">\n' +
               p.items.slice(q).join('\n') + '\n</ol>';
  return [head, tail];
}

/* ---- .work ------------------------------------------------- */

export function isWorkBlock(b) { return /^<div class="work/.test(b); }

export function splitWork(b, k) {
  const open = b.match(/^<div class="[^"]*"[^>]*>/)[0];
  const items = itemRanges(b, 'p').map(([s, e]) => b.slice(s, e));
  const head = open + '\n' + items.slice(0, k).join('\n') + '\n</div>';
  const tail = open.replace('>', ' data-cont="1">') + '\n' +
               items.slice(k).join('\n') + '\n</div>';
  return [head, tail];
}

/* ---- worked examples ---------------------------------------
   An example breaks between the elements of its body — after the
   problem statement, after a block of working, and so on. */

export function isExampleBlock(b) { return /^<div class="c-example[\s"]/.test(b); }

/* Top-level elements inside a container, given the container's open tag. */
export function childrenOf(src, openRe) {
  const m = src.match(openRe);
  if (!m) return null;
  const from = src.indexOf(m[0]) + m[0].length;
  const kids = [];
  let i = from, depth = 0, start = -1;
  while (i < src.length) {
    if (src[i] !== '<') { i++; continue; }
    const gt = src.indexOf('>', i);
    if (gt < 0) break;
    const t = src.slice(i, gt + 1);
    if (/^<\//.test(t)) {
      if (depth === 0) break;                 // container's own close
      depth--;
      if (depth === 0 && start >= 0) { kids.push(src.slice(start, gt + 1)); start = -1; }
    } else if (!/\/>$/.test(t)) {
      if (depth === 0) start = i;
      depth++;
    }
    i = gt + 1;
  }
  return { openTag: m[0], kids };
}

export function exampleParts(b) {
  const tab = b.match(/<div class="c-example__tab">[\s\S]*?<\/div>/);
  const body = childrenOf(b, /<div class="c-example__body">/);
  if (!body) return null;
  return { tab: tab ? tab[0] : '', kids: body.kids };
}

export function splitExample(b, k) {
  const p = exampleParts(b);
  const head = '<div class="c-example c-example--head">\n  ' + p.tab +
    '\n  <div class="c-example__body">\n' + p.kids.slice(0, k).join('\n') +
    '\n  </div>\n</div>';
  const tail = '<div class="c-example c-example--tail" data-cont="1">\n' +
    '  <div class="c-example__body">\n' + p.kids.slice(k).join('\n') +
    '\n  </div>\n</div>';
  return [head, tail];
}

export function joinExample(prev, b) {
  if (!/^<div class="c-example c-example--tail"/.test(b)) return null;
  if (!/^<div class="c-example c-example--head"/.test(prev)) return null;
  const a = exampleParts(prev), c = exampleParts(b);
  if (!a || !c) return null;
  return '<div class="c-example">\n  ' + a.tab + '\n  <div class="c-example__body">\n' +
    [...a.kids, ...c.kids].join('\n') + '\n  </div>\n</div>';
}

/* ---- joining ----------------------------------------------- */

/* A bare c-questions list carrying data-start, straight after another
   exercise block, is a continuation this tool made — fold it back. */
export function joinExercise(prev, b) {
  if (!/^<ol class="c-questions[^"]*"[^>]*data-start=/.test(b)) return null;
  if (!isExerciseBlock(prev)) return null;
  const p = exerciseParts(prev), q = exerciseParts(b);
  if (!p || !q) return null;
  const isPractice = /^<div class="c-practice"/.test(prev);
  return p.head + p.olOpen + '\n' + [...p.items, ...q.items].join('\n') +
         '\n  </ol>' + (isPractice ? '\n</div>' : '');
}

export function joinWork(prev, b) {
  if (!/^<div class="work[^"]*"[^>]*data-cont="1"/.test(b)) return null;
  if (!isWorkBlock(prev)) return null;
  const open = prev.match(/^<div class="[^"]*"[^>]*>/)[0];
  const a = itemRanges(prev, 'p').map(([s, e]) => prev.slice(s, e));
  const c = itemRanges(b, 'p').map(([s, e]) => b.slice(s, e));
  return open + '\n' + [...a, ...c].join('\n') + '\n</div>';
}
