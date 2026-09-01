/* ============================================================
   REPAGINATION, at line granularity.

   A page file holds blocks; which page a block lands on — and,
   for a paragraph, which LINE the page breaks at — is a layout
   question, not an authoring one.

     node build/reflow.mjs harness ch05
     node build/reflow.mjs apply   ch05 plan.json

   The stream is rendered exactly as the book is (maths included,
   figures stamped) so the browser measures what will actually
   print. Before this, the harness left <m> tags unrendered and
   every paragraph was measured at the wrong width.

   A paragraph is split by word index; the halves become
   <p class="p-split"> and <p class="p-cont">. Reading the stream
   JOINS such pairs back together first, so re-running the tool
   never compounds a split.
   ============================================================ */
import { readFile, writeFile, readdir, unlink } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import katex from 'katex';
import {
  isExerciseBlock, splitExercise, joinExercise,
  isWorkBlock, splitWork, joinWork,
  isExampleBlock, splitExample, joinExample,
} from './fragment.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const [mode, chapter = 'ch05', arg] = process.argv.slice(2);
const dir = join(ROOT, 'chapters', chapter);
const pagesDir = join(dir, 'pages');

const FIGW = { sm: 48, md: 58, lg: 68, xl: 82 };

/* ---- block splitting --------------------------------------- */
export function splitBlocks(html) {
  const lines = html.split('\n');
  const blocks = [];
  let cur = null, tag = null, depth = 0;
  for (const line of lines) {
    if (!cur) {
      const m = line.match(/^<([a-zA-Z][\w-]*)/);
      if (!m) continue;
      tag = m[1]; cur = [line]; depth = 0;
    } else cur.push(line);
    const last = cur[cur.length - 1];
    // NB: double backslash — this is a RegExp *string*, not a literal.
    const opens = (last.match(new RegExp('<' + tag + '[\\s>]', 'g')) || []).length;
    const closes = (last.match(new RegExp('</' + tag + '>', 'g')) || []).length;
    depth += opens - closes;
    if (depth <= 0) { blocks.push(cur.join('\n')); cur = null; tag = null; depth = 0; }
  }
  if (cur) blocks.push(cur.join('\n'));
  return blocks;
}

/* ---- words -------------------------------------------------
   A word is a run of source separated by whitespace at tag depth
   zero, so an inline element and the punctuation stuck to it stay
   together as one unbreakable token. */
export function tokenizeInline(html) {
  const toks = []; let cur = '', depth = 0, i = 0;
  while (i < html.length) {
    const ch = html[i];
    if (ch === '<') {
      const gt = html.indexOf('>', i);
      if (gt < 0) { cur += html.slice(i); break; }
      const tagText = html.slice(i, gt + 1);
      if (/^<\//.test(tagText)) depth--;
      else if (!/\/>$/.test(tagText)) depth++;
      cur += tagText; i = gt + 1; continue;
    }
    if (depth === 0 && /\s/.test(ch)) {
      if (cur.trim()) { toks.push(cur.trim()); cur = ''; }
      i++; continue;
    }
    cur += ch; i++;
  }
  if (cur.trim()) toks.push(cur.trim());
  return toks;
}

/* Only bare paragraphs are splittable. A .hint, and anything inside
   a panel, is left whole. */
const SPLITTABLE = (b) => /^<p>/.test(b) || /^<p class="p-(split|cont)">/.test(b);
const inner = (b) => b.replace(/^<p[^>]*>/, '').replace(/<\/p>\s*$/, '');

/* ---- reading: re-join everything this tool previously split - */
function rejoin(blocks) {
  const out = [];
  for (const b of blocks) {
    const prev = out[out.length - 1];
    if (prev) {
      if (/^<p class="p-cont/.test(b) && /^<p class="p-(split|cont)/.test(prev)) {
        out[out.length - 1] = '<p class="p-split">' + inner(prev) + '\n' + inner(b) + '</p>';
        continue;
      }
      const je = joinExercise(prev, b); if (je) { out[out.length - 1] = je; continue; }
      const jw = joinWork(prev, b);     if (jw) { out[out.length - 1] = jw; continue; }
      const jx = joinExample(prev, b);  if (jx) { out[out.length - 1] = jx; continue; }
    }
    out.push(b);
  }
  return out.map((b) => (/^<p class="p-(split|cont)/.test(b) ? '<p>' + inner(b) + '</p>' : b));
}

async function readStream() {
  const files = (await readdir(pagesDir)).filter((f) => /^p\d+\.html$/.test(f)).sort();
  const blocks = [];
  for (const f of files) blocks.push(...splitBlocks(await readFile(join(pagesDir, f), 'utf8')));
  return { files, blocks: rejoin(blocks) };
}

/* ---- maths + figure stamping, exactly as the builder does --- */
function renderMaths(html) {
  const one = (tex, displayMode) => {
    try { return katex.renderToString(tex, { displayMode, throwOnError: true, strict: 'ignore' }); }
    catch { return '<span class="math-error">' + tex + '</span>'; }
  };
  return html
    .replace(/<md>([\s\S]*?)<\/md>/g, (_, t) => one(t, true))
    .replace(/<m>([\s\S]*?)<\/m>/g, (_, t) => one(t, false));
}

function stampFigures(html) {
  return html.replace(/<svg\b([^>]*)>/g, (tag, attrs) => {
    if (/--dg-v/.test(attrs)) return tag;
    const vb = attrs.match(/viewBox="\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)/);
    if (!vb) return tag;
    const step = (attrs.match(/data-size="(sm|md|lg|xl)"/) || [, 'md'])[1];
    return '<svg' + attrs + ' style="--dg-v:' + vb[1] + ';--dg-w:' + FIGW[step] + '">';
  });
}

/* ============================================================ */
if (mode === 'harness') {
  const { blocks } = await readStream();
  const marked = blocks.map((b, i) => {
    if (SPLITTABLE(b)) {
      const words = tokenizeInline(inner(b))
        .map((w, k) => '<w data-i="' + k + '">' + w + '</w>')
        .join(' ');
      return '<p data-b="' + i + '" data-split="1">' + words + '</p>';
    }
    return b.replace(/^<([a-zA-Z][\w-]*)/, '<$1 data-b="' + i + '"');
  });
  const meta = JSON.parse(await readFile(join(dir, 'chapter.json'), 'utf8'));
  const body = stampFigures(renderMaths(marked.join('\n\n')));
  const palette = meta.palette ? ' data-palette="' + meta.palette + '"' : '';
  await writeFile(join(dir, '_stream.html'),
    '<!doctype html>\n<html lang="en"' + palette + '>\n' +
    '<head><meta charset="utf-8"><title>stream</title>\n' +
    '<link rel="stylesheet" href="../../styles/book.css"></head>\n<body>\n' +
    '<svg class="dg-defs" aria-hidden="true"><defs>\n' +
    '  <marker id="dg-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">\n' +
    '    <path class="dg-arrowhead" d="M0 1.2 L10 5 L0 8.8 Z"/></marker>\n' +
    '</defs></svg>\n' +
    '<div class="page"><div class="page__bleed"><div class="page__trim">\n' +
    '<div class="page__body" style="position:static;height:auto">\n' +
    '<main class="page__main" id="stream">\n' + body + '\n</main>\n' +
    '</div></div></div></div>\n</body></html>\n');
  console.log('harness: ' + blocks.length + ' blocks (maths rendered) -> ' + chapter + '/_stream.html');
}

/* apply — plan is JSON: [{b, i}, ...]: the first block of each page,
   and how far into it the page starts. `i` counts words in a
   paragraph, questions in an exercise set, steps in a .work. */
if (mode === 'apply') {
  const plan = JSON.parse(await readFile(arg, 'utf8'));
  const { files, blocks } = await readStream();

  const cuts = plan.filter((p) => p.i > 0);
  // One cut per block: a paragraph or exercise set is never tall
  // enough to span three pages, so this should not happen.
  const seen = new Set();
  for (const c of cuts) {
    if (seen.has(c.b)) throw new Error('two cuts in block ' + c.b + ' — unsupported');
    seen.add(c.b);
  }

  const pieces = blocks.slice();
  for (const c of [...cuts].sort((a, b) => b.b - a.b)) {
    const src = pieces[c.b];
    let two;
    if (isExerciseBlock(src)) two = splitExercise(src, c.i);
    else if (isExampleBlock(src)) two = splitExample(src, c.i);
    else if (isWorkBlock(src)) two = splitWork(src, c.i);
    else {
      const toks = tokenizeInline(inner(src));
      two = ['<p class="p-split">' + toks.slice(0, c.i).join(' ') + '</p>',
             '<p class="p-cont">' + toks.slice(c.i).join(' ') + '</p>'];
    }
    pieces.splice(c.b, 1, two[0], two[1]);
  }

  // A cut at block b inserts one extra piece there. A page that starts
  // part-way through a block starts at the *tail* piece, hence the +1.
  const before = (b) => cuts.filter((c) => c.b < b).length;
  const starts = plan.map((p) => p.b + before(p.b) + (p.i > 0 ? 1 : 0));

  for (const f of files) await unlink(join(pagesDir, f));
  for (let i = 0; i < starts.length; i++) {
    const from = starts[i];
    const to = i + 1 < starts.length ? starts[i + 1] : pieces.length;
    const name = 'p' + String(i + 1).padStart(2, '0') + '.html';
    await writeFile(join(pagesDir, name), pieces.slice(from, to).join('\n\n') + '\n');
  }
  console.log('apply: ' + blocks.length + ' blocks, ' + cuts.length +
    ' block splits -> ' + starts.length + ' pages');
}
