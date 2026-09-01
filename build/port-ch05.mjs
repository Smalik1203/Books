/* ============================================================
   One-off: bring Chapter 5 into the repo's conventions.

   From  chapters/ch05/pages/pNN.html        (my working layout)
   To    pages/class-9/ch05-circles-a4/pNNN.html

   Changes made:
     · <m>x</m>  -> $x$        and  <md>x</md> -> $$x$$
     · every block re-joined first, because the B5 page breaks are
       meaningless at A4 — repack.mjs will re-fit them
     · each file wrapped in the repo's page shell
     · chapter.json in the repo's shape, edition a4

   Backslashes are only ever MOVED here, never written, so the
   escaping trap in CLAUDE.md does not apply — but nothing in this
   file may pass LaTeX through a shell or a template literal.
   ============================================================ */
import { readFile, writeFile, readdir, mkdir, rm } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { splitBlocks } from './reflow.mjs';
import { joinExercise, joinWork, joinExample } from './fragment.mjs';

const ROOT = resolve(fileURLToPath(new URL('..', import.meta.url)));
const SRC = join(ROOT, 'chapters', 'ch05', 'pages');
const OUT = join(ROOT, 'pages', 'class-9', 'ch05-circles-a4');

/* ---- 1. read every block, undoing the B5 splits ------------ */
const inner = (b) => b.replace(/^<p[^>]*>/, '').replace(/<\/p>\s*$/, '');

const files = (await readdir(SRC)).filter((f) => /^p\d+\.html$/.test(f)).sort();
const raw = [];
for (const f of files) raw.push(...splitBlocks(await readFile(join(SRC, f), 'utf8')));

const blocks = [];
for (const b of raw) {
  const prev = blocks[blocks.length - 1];
  if (prev) {
    if (/^<p class="p-cont/.test(b) && /^<p class="p-(split|cont)/.test(prev)) {
      blocks[blocks.length - 1] = '<p>' + inner(prev) + '\n' + inner(b) + '</p>';
      continue;
    }
    const je = joinExercise(prev, b); if (je) { blocks[blocks.length - 1] = je; continue; }
    const jw = joinWork(prev, b);     if (jw) { blocks[blocks.length - 1] = jw; continue; }
    const jx = joinExample(prev, b);  if (jx) { blocks[blocks.length - 1] = jx; continue; }
  }
  blocks.push(b);
}
const clean = blocks.map((b) =>
  /^<p class="p-(split|cont)/.test(b) ? '<p>' + inner(b) + '</p>' : b);

/* ---- 2. maths delimiters ----------------------------------- */
const toDollars = (s) => s
  .replace(/<md>([\s\S]*?)<\/md>/g, (_, t) => '$$' + t.trim() + '$$')
  .replace(/<m>([\s\S]*?)<\/m>/g, (_, t) => '$' + t.trim() + '$');

/* ---- 3. the chapter head, which my builder used to inject --- */
const sketch = (await readFile(join(ROOT, 'chapters', 'ch05', 'sketch.svg'), 'utf8'))
  .replace(/^<!--[\s\S]*?-->\s*/, '').trim()
  .split('\n').map((l) => '      ' + l).join('\n');

const head = '<div class="chapterhead">\n'
  + '    <div class="chapterhead__num">5</div>\n'
  + '    <h1 class="chapterhead__title">Exploring<br>Circles</h1>\n\n'
  + '    <div class="chapterhead__sketch">\n' + sketch + '\n    </div>\n\n'
  + '    <div class="chapterhead__rule"></div>\n'
  + '  </div>';

/* ---- 4. write the pages ------------------------------------
   A rough even split; repack.mjs measures and re-fits properly. */
const PAGES = 28;
const per = Math.ceil(clean.length / PAGES);

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

let n = 0;
for (let i = 0; i < clean.length; i += per) {
  n++;
  const slice = clean.slice(i, i + per).map(toDollars);
  const opener = n === 1;
  const body = slice.map((b) => b.split('\n').map((l) => '      ' + l).join('\n')).join('\n\n');
  const file = '<section class="page' + (opener ? ' page--opener page--haschead' : '') + '">\n'
    + (opener ? '\n  ' + head + '\n' : '')
    + '  <div class="page__body">\n    <div class="page__main">\n\n'
    + body + '\n\n    </div>\n  </div>\n</section>\n';
  await writeFile(join(OUT, 'p' + String(n).padStart(3, '0') + '.html'), file);
}

await writeFile(join(OUT, 'chapter.json'), JSON.stringify({
  class: '9',
  number: '5',
  title: 'Exploring Circles',
  subject: 'Mathematics',
  startFolio: 1,
  edition: 'a4',
}, null, 2) + '\n');

console.log('ported ' + clean.length + ' blocks (from ' + raw.length + ' after re-joining) into '
  + n + ' pages at ' + OUT.replace(ROOT, '.'));
