#!/usr/bin/env node
/* ============================================================
   LearnLab studio — library, viewer and live preview.

     node build/serve.mjs                 open the library
     node build/serve.mjs class-9/ch04-…  open straight into a chapter

   Serves the repo over http, watches pages/ and css/, rebuilds the
   chapter that changed and reloads the open tab.

   The book is shown inside an iframe, so its stylesheet and the
   studio's can never reach one another.

   No dependencies — node's http and fs only.
   ============================================================ */

import { createServer } from 'node:http';
import { readFile, stat, readdir } from 'node:fs/promises';
import { existsSync, watch } from 'node:fs';
import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { impositionPlan, verify, fitsOn } from './impose.mjs';
import { spineWidth } from './spine.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 5180;   // override: PORT=5199 node build/serve.mjs
const openAt = process.argv[2] || null;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.woff2': 'font/woff2', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.pdf': 'application/pdf',
};

const ESCAPES = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ESCAPES[c]);

/* ---- Sheet sizes, read from the tokens --------------------- */
async function sheet(edition) {
  const src = await readFile(path.join(ROOT, 'css', 'tokens.css'), 'utf8');
  const over = edition
    ? await readFile(path.join(ROOT, 'css', 'edition-' + edition + '.css'), 'utf8').catch(() => '')
    : '';
  const mm = (name) => {
    const from = over.includes('--' + name + ':') ? over : src;
    const i = from.indexOf('--' + name + ':');
    return parseFloat(from.slice(i + name.length + 3, i + name.length + 30));
  };
  const trimW = mm('trim-w'), trimH = mm('trim-h');
  const out = mm('bleed') + mm('slug');
  return {
    trimW, trimH, bleed: mm('bleed'), slug: mm('slug'),
    mediaW: trimW + 2 * out, mediaH: trimH + 2 * out,
  };
}

/* ---- What is in pages/ ------------------------------------ */
async function library() {
  const classes = [];
  const dirs = async (rel) =>
    (await readdir(path.join(ROOT, rel), { withFileTypes: true }).catch(() => []))
      .filter((e) => e.isDirectory()).map((e) => e.name).sort();

  for (const cls of await dirs('pages')) {
    const chapters = [];
    for (const dir of await dirs(path.join('pages', cls))) {
      const metaPath = path.join(ROOT, 'pages', cls, dir, 'chapter.json');
      if (!existsSync(metaPath)) continue;
      const meta = JSON.parse(await readFile(metaPath, 'utf8'));
      const files = (await readdir(path.join(ROOT, 'pages', cls, dir)))
        .filter((f) => /^p\d+.*\.html$/.test(f));
      const out = path.join(ROOT, 'build', cls, dir);
      chapters.push({
        target: cls + '/' + dir, dir, meta,
        subject: meta.subject || 'Mathematics',
        pages: files.length,
        first: meta.startFolio ?? 1,
        built: existsSync(out + '.html'),
        pdf: existsSync(out + '.pdf'),
        bleed: existsSync(out + '-bleed.pdf'),
        edition: (meta.edition || 'crown quarto').toUpperCase(),
      });
    }
    chapters.sort((a, b) => String(a.meta.number)
      .localeCompare(String(b.meta.number), 'en', { numeric: true }));
    if (chapters.length) classes.push({ cls, chapters });
  }
  return classes;
}

/* ---- What is in covers/ -----------------------------------
   A cover is not a page. It never goes through build.mjs, it has
   no folio and no chapter, and its sheet is the whole wrap: two
   trims with the spine between them. So it is found, built and
   viewed on its own path, shown beside the chapters rather than
   among them. */
async function coverSheet(meta) {
  const s = await sheet(meta.edition);
  const spine = spineWidth(meta);
  const mm = (n) => Math.round(n * 10) / 10;
  return {
    ...s, spine,
    sheetW: mm(2 * s.trimW + spine.mm),
    wrapW: mm(2 * s.trimW + spine.mm + 2 * s.bleed),
    wrapH: mm(s.trimH + 2 * s.bleed),
  };
}

async function coverLibrary() {
  const classes = [];
  const dirs = async (rel) =>
    (await readdir(path.join(ROOT, rel), { withFileTypes: true }).catch(() => []))
      .filter((e) => e.isDirectory()).map((e) => e.name).sort();

  for (const cls of await dirs('covers')) {
    const covers = [];
    for (const dir of await dirs(path.join('covers', cls))) {
      // _shared holds panels, not covers, and has no cover.json
      const metaPath = path.join(ROOT, 'covers', cls, dir, 'cover.json');
      if (!existsSync(metaPath)) continue;
      const meta = JSON.parse(await readFile(metaPath, 'utf8'));
      const s = await coverSheet(meta);
      const out = path.join(ROOT, 'build', 'covers', cls, dir);
      covers.push({
        target: cls + '/' + dir, dir, meta, sheet: s,
        name: meta.title + (meta.part ? ', Part ' + meta.part : ''),
        edition: (meta.edition || 'crown quarto').toUpperCase(),
        built: existsSync(out + '.html'),
        pdf: existsSync(out + '.pdf'),
        bleed: existsSync(out + '-bleed.pdf'),
        proof: existsSync(out + '-proof.png'),
      });
    }
    if (covers.length) classes.push({ cls, covers });
  }
  return classes;
}

const page = (title, body) => '<!doctype html>\n'
  + '<html lang="en"><head><meta charset="utf-8">\n'
  + '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
  + '<title>' + esc(title) + '</title>\n'
  + '<link rel="stylesheet" href="/build/ui/app.css">\n'
  + '</head><body>' + body + '</body></html>';

/* ---- Library page -----------------------------------------
   Chapters are grouped by subject; the covers of a class are a
   group of their own, because a cover belongs to the whole book
   and not to any one subject inside it. */
function libraryHtml(classes, coverClasses) {
  const flag = (on, label) =>
    on ? '<span class="flag flag--on">' + label + '</span>' : '';

  const card = (c) => `
    <a class="card" href="/read/${esc(c.target)}">
      <div class="card__num">Chapter ${esc(c.meta.number)} &middot; ${esc(c.edition)}</div>
      <div class="card__title">${esc(c.meta.title)}</div>
      <div class="card__meta">
        <span>${c.pages} page${c.pages === 1 ? '' : 's'}</span>
        <span>folios ${c.first}&ndash;${c.first + c.pages - 1}</span>
      </div>
      <div class="card__flags">
        ${c.built ? '<span class="flag flag--on">built</span>'
                  : '<span class="flag flag--warn">not built</span>'}
        ${c.pdf ? '<span class="flag flag--on">pdf</span>' : ''}
        ${c.bleed ? '<span class="flag flag--on">bleed</span>'
                  : '<span class="flag">no bleed</span>'}
      </div>
    </a>`;

  const coverCard = (c) => `
    <a class="card" href="/cover/${esc(c.target)}">
      <div class="card__num">Cover &middot; ${esc(c.edition)}</div>
      <div class="card__title">${esc(c.name)}</div>
      <div class="card__meta">
        <span>${esc(c.dir)}</span>
        <span>wrap ${c.sheet.sheetW} &times; ${c.sheet.trimH} mm</span>
        <span>spine ${c.sheet.spine.mm} mm</span>
      </div>
      <div class="card__flags">
        ${c.built ? '<span class="flag flag--on">built</span>'
                  : '<span class="flag flag--warn">not built</span>'}
        ${flag(c.pdf, 'pdf')}
        ${c.bleed ? '<span class="flag flag--on">bleed</span>'
                  : '<span class="flag">no bleed</span>'}
        ${flag(c.proof, 'proof')}
      </div>
    </a>`;

  const names = [...new Set([...classes.map((c) => c.cls),
                             ...coverClasses.map((c) => c.cls)])].sort();

  const body = names.map((cls) => {
    const chapters = (classes.find((c) => c.cls === cls) || { chapters: [] }).chapters;
    const covers = (coverClasses.find((c) => c.cls === cls) || { covers: [] }).covers;
    const subjects = [...new Set(chapters.map((c) => c.subject))].sort();
    return '<div class="class-head">Class ' + esc(cls.replace(/^class-/, '')) + '</div>'
      + subjects.map((sub) => '<div class="subject-head">' + esc(sub) + '</div>'
        + '<div class="grid">'
        + chapters.filter((c) => c.subject === sub).map(card).join('')
        + '</div>').join('')
      + (covers.length
        ? '<div class="subject-head">Covers</div><div class="grid">'
          + covers.map(coverCard).join('') + '</div>'
        : '');
  }).join('');

  return page('LearnLab Studio', `
    <div class="wrap">
      <div class="masthead"><h1>LearnLab</h1><span class="tag">studio</span></div>
      <p class="masthead-sub">Pick a chapter to read it at size, check the print sheet,
         or build the PDFs. Covers are built and viewed separately &mdash; a wrap is
         one sheet, not a run of pages.</p>
      ${body || '<p class="empty">Nothing in pages/ or covers/ yet.</p>'}
    </div>`);
}

/* A download link to an artefact that was never built is worse than no
   link: the browser follows it, gets the 404 body, and saves that as
   <chapter>-bleed.txt — so the download history shows a file that looks
   real and is a error message. Offer the link only when the file is
   there, and say why when it is not. */
const downloadBtn = (base, suffix, label) => {
  const ok = existsSync(path.join(ROOT, 'build', base + suffix));
  return `<a class="btn${ok ? '' : ' btn--off'}" href="/build/${esc(base)}${suffix}"`
    + (ok ? ' download' : ' download aria-disabled="true" title="Not built yet — press Build"')
    + `>${label}</a>`;
};

/* ---- Viewer page ------------------------------------------ */
function viewerHtml(chapter, s) {
  const cfg = {
    target: chapter.target,
    trimUrl: '/build/' + chapter.target + '.html',
    bleedUrl: '/build/' + chapter.target + '-bleed.html',
    imposeUrl: '/impose/' + chapter.target,
    trimW: s.trimW, mediaW: s.mediaW,
  };
  const noBleed = !existsSync(path.join(ROOT, 'build', chapter.target + '-bleed.html'));

  const dl = (suffix, label) => downloadBtn(chapter.target, suffix, label);

  return page(chapter.meta.title + ' — LearnLab Studio', `
    <div class="viewer">
      <div class="bar">
        <a class="btn" href="/" title="Back to the library">&larr;</a>
        <span class="bar__title">${esc(chapter.meta.title)}</span>
        <span class="bar__sub">Class ${esc(chapter.meta.class)} &middot;
          ch ${esc(chapter.meta.number)} &middot; ${chapter.pages} pp</span>

        <div class="seg" role="group" aria-label="Sheet">
          <button id="sheet-trim" aria-pressed="true">Trim ${s.trimW}&times;${s.trimH}</button>
          <button id="sheet-bleed" aria-pressed="false"
            ${noBleed ? 'disabled title="Build first"' : ''}>Bleed ${s.mediaW}&times;${s.mediaH}</button>
        </div>

        <div class="seg" role="group" aria-label="View">
          <button id="view-pages" aria-pressed="true">Pages</button>
          <button id="view-spread" aria-pressed="false">Spreads</button>
          <button id="view-impose" aria-pressed="false">Signature</button>
        </div>

        <select class="btn" id="sig-size" title="Pages per signature">
          <option value="8">8 pp</option>
          <option value="16">16 pp</option>
          <option value="32" selected>32 pp</option>
        </select>

        <div class="seg" role="group" aria-label="Zoom">
          <button data-zoom="fit" aria-pressed="true">Fit</button>
          <button data-zoom="0.5">50%</button>
          <button data-zoom="1">100%</button>
          <button data-zoom="actual">Actual size</button>
        </div>

        <div class="cal">
          <button class="btn" id="cal-open" title="Match the screen to real millimetres">Calibrate</button>
          <div class="cal__panel" id="cal-panel" hidden>
            <h3>Actual size</h3>
            <p>Hold a bank card against the box and drag until they match. Every card is
               85.6 &times; 54 mm, so this makes &ldquo;Actual size&rdquo; true on
               <em>your</em> screen.</p>
            <div class="cal__card" id="cal-card">bank card</div>
            <div class="cal__row">
              <input type="range" id="cal-range" min="2" max="10" step="0.001">
              <span class="cal__val" id="cal-val"></span>
            </div>
            <div class="cal__row cal__row--foot">
              <button class="btn" id="cal-reset">Reset to 96 dpi</button>
            </div>
          </div>
        </div>

        <span class="bar__spacer"></span>

        <div class="pager">
          <button class="btn" id="prev">&lsaquo;</button>
          <input id="page-no" type="number" min="1" value="1">
          <span id="page-count">of ?</span>
          <button class="btn" id="next">&rsaquo;</button>
        </div>

        <button class="btn" id="print">Print&hellip;</button>
        ${dl('.pdf', 'Reading PDF')}
        ${dl('-bleed.pdf', 'Print PDF')}
        <button class="btn btn--go" id="build">Build</button>
      </div>

      <div class="note">
        <b>Print&hellip;</b> uses the browser dialog. Save as PDF honours the
        ${s.trimW} &times; ${s.trimH} mm page; a physical printer scales it to whatever paper
        you pick &mdash; for the press, send <b>Print PDF</b>.
        <span id="build-log"></span>
      </div>

      <div class="stage" id="stage">
        <div class="stage__inner" id="inner">
          <iframe id="frame" scrolling="no" title="${esc(chapter.meta.title)}"></iframe>
        </div>
      </div>
    </div>
    <script type="application/json" id="cfg">${JSON.stringify(cfg)}</script>
    <script src="/build/ui/app.js"></script>`);
}

/* ---- Cover viewer -----------------------------------------
   The chapter viewer's furniture assumes a run of pages: a pager,
   spreads, a signature to impose. A wrap has none of those — it is
   one sheet, read whole — so those controls are simply left out and
   app.js does without them. What remains is what a cover needs: the
   two sheets, zoom against true millimetres, and Build. */
function coverViewerHtml(cover) {
  const s = cover.sheet;
  const base = 'covers/' + cover.target;
  const cfg = {
    kind: 'cover',
    target: cover.target,
    trimUrl: '/build/' + base + '.html',
    bleedUrl: '/build/' + base + '-bleed.html',
    /* The trim sheet is centred in a stage padded 8mm either side;
       the press sheet has no padding. Only the trim width carries it. */
    trimW: s.sheetW + 16,
    mediaW: s.wrapW,
  };
  const noBleed = !existsSync(path.join(ROOT, 'build', base + '-bleed.html'));
  const dl = (suffix, label) => downloadBtn(base, suffix, label);

  return page(cover.name + ' — cover — LearnLab Studio', `
    <div class="viewer">
      <div class="bar">
        <a class="btn" href="/" title="Back to the library">&larr;</a>
        <span class="bar__title">${esc(cover.name)}</span>
        <span class="bar__sub">Class ${esc(cover.meta.class)} &middot; cover &middot;
          ${esc(cover.meta.direction || 'plain')} / ${esc(cover.meta.finish || 'light')}</span>

        <div class="seg" role="group" aria-label="Sheet">
          <button id="sheet-trim" aria-pressed="true">Wrap ${s.sheetW}&times;${s.trimH}</button>
          <button id="sheet-bleed" aria-pressed="false"
            ${noBleed ? 'disabled title="Build first"' : ''}>Bleed ${s.wrapW}&times;${s.wrapH}</button>
        </div>

        <div class="seg" role="group" aria-label="Zoom">
          <button data-zoom="fit" aria-pressed="true">Fit</button>
          <button data-zoom="0.5">50%</button>
          <button data-zoom="1">100%</button>
          <button data-zoom="actual">Actual size</button>
        </div>

        <div class="cal">
          <button class="btn" id="cal-open" title="Match the screen to real millimetres">Calibrate</button>
          <div class="cal__panel" id="cal-panel" hidden>
            <h3>Actual size</h3>
            <p>Hold a bank card against the box and drag until they match. Every card is
               85.6 &times; 54 mm, so this makes &ldquo;Actual size&rdquo; true on
               <em>your</em> screen.</p>
            <div class="cal__card" id="cal-card">bank card</div>
            <div class="cal__row">
              <input type="range" id="cal-range" min="2" max="10" step="0.001">
              <span class="cal__val" id="cal-val"></span>
            </div>
            <div class="cal__row cal__row--foot">
              <button class="btn" id="cal-reset">Reset to 96 dpi</button>
            </div>
          </div>
        </div>

        <span class="bar__spacer"></span>

        <button class="btn" id="print">Print&hellip;</button>
        ${dl('.pdf', 'Cover PDF')}
        ${dl('-bleed.pdf', 'Press PDF')}
        ${dl('-proof.png', 'Proof PNG')}
        <button class="btn btn--go" id="build">Build</button>
      </div>

      <div class="note">
        <b>Spine ${s.spine.mm}mm</b> &mdash; ${esc(s.spine.how)}. It is bulk, not a
        choice: re-derive the page count from a <b>--book</b> run before this goes to
        press. Build here runs <b>cover.mjs</b> with the proof and the press sheet;
        a placeholder QR will refuse the press sheet and say so.
        <span id="build-log"></span>
      </div>

      <div class="stage" id="stage">
        <div class="stage__inner" id="inner">
          <iframe id="frame" scrolling="no" title="${esc(cover.name)} cover"></iframe>
        </div>
      </div>
    </div>
    <script type="application/json" id="cfg">${JSON.stringify(cfg)}</script>
    <script src="/build/ui/app.js"></script>`);
}

/* ---- Imposition page --------------------------------------
   A schematic of the press sheet: which page falls in which
   slot, where the folds run, and how many blanks the run leaves.
   Drawn from the chapter's real page count and trim size. */
function impositionHtml(chapter, s, sigSize) {
  const plan = impositionPlan(chapter.pages, sigSize, s.trimW, s.trimH);
  const problems = verify(plan, chapter.pages);
  const fit = fitsOn(plan.sheetW, plan.sheetH);
  const k = 250 / plan.sheetH;                       // draw each sheet ~250px tall
  const cw = s.trimW * k, ch = s.trimH * k;
  const W = plan.pageCols * cw, H = plan.pageRows * ch;

  const sheet = (units, label) => {
    const cells = units.map((u) => u.cells.map((c, n) => {
      const col = u.col * 2 + n;
      const x = col * cw, y = (plan.pageRows - 1 - u.row) * ch;
      const cls = 'imp__cell' + (c.blank ? ' imp__cell--blank' : '');
      const text = c.blank ? 'blank' : String(c.page);
      const tc = 'imp__no' + (c.blank ? ' imp__no--blank' : '');
      return `<rect class="${cls}" x="${x}" y="${y}" width="${cw}" height="${ch}"/>`
        + `<text class="${tc}" x="${x + cw / 2}" y="${y + ch / 2}" text-anchor="middle">${text}</text>`
        + (c.inverted && n === 0
            ? `<text class="imp__inv" x="${x + 4}" y="${y + ch - 5}">upside down</text>` : '');
    }).join('')).join('');

    const folds = [];
    for (let c = 1; c < plan.pageCols; c++) {
      folds.push(`<line class="imp__fold" x1="${c * cw}" y1="0" x2="${c * cw}" y2="${H}"/>`);
    }
    for (let r = 1; r < plan.pageRows; r++) {
      folds.push(`<line class="imp__fold" x1="0" y1="${r * ch}" x2="${W}" y2="${r * ch}"/>`);
    }

    return `<figure class="imp__sheet">
      <figcaption>${label}</figcaption>
      <svg width="${Math.round(W)}" height="${Math.round(H)}" viewBox="0 0 ${W} ${H}">
        ${cells}${folds.join('')}
        <rect class="imp__trim" x="0" y="0" width="${W}" height="${H}"/>
      </svg>
    </figure>`;
  };

  const sigs = plan.signatures.map((sig, i) => `
    <section class="imp__sig">
      <h2>Signature ${i + 1} of ${plan.count}</h2>
      <div class="imp__sheets">
        ${sheet(sig.front, 'front of sheet')}
        ${sheet(sig.back, 'back of sheet — the same slots, mirrored')}
      </div>
    </section>`).join('');

  return page('Imposition', `
    <div class="imp">
      <div class="imp__summary">
        <span><b>${chapter.pages}</b> pages</span>
        <span><b>${plan.count}</b> signature${plan.count === 1 ? '' : 's'} of ${plan.sigSize}</span>
        <span><b>${plan.blanks}</b> blank page${plan.blanks === 1 ? '' : 's'}</span>
        <span><b>${plan.pageCols}&times;${plan.pageRows}</b> up per side</span>
        <span>imposed area <b>${plan.sheetW}&times;${plan.sheetH}&nbsp;mm</b></span>
        ${fit ? `<span>fits <b>${fit.name}</b> ${fit.w}&times;${fit.h} &mdash; ${fit.waste}% waste</span>` : ''}
        <span>${problems.length ? '<b>checks failed</b>' : 'pairs and leaves check out'}</span>
      </div>
      <p class="imp__caveat">
        Dashed lines are folds; the outer rule is the trim. Every pair facing each
        other on one side sums to ${plan.sigSize + 1}, and the two sides of a leaf are
        consecutive &mdash; those hold for any folder. Which slot each pair takes
        does not: this is a plain right-angle fold, and your printer's may differ.
        Use it to check page count, blanks and what shares a leaf, not as a file to
        send to press.
      </p>
      ${sigs}
    </div>`);
}

/* ---- Live reload ------------------------------------------ */
const clients = new Set();
const RELOAD = '\n<script>new EventSource("/__reload").onmessage='
  + 'function(){location.reload()};</script>';

/* ---- Two pages to a spread, for the viewer only ------------ */
const SPREAD = '\n<style>'
  + '.spread { display: grid; grid-template-columns: repeat(2, max-content);'
  + ' justify-content: center; gap: 10mm 0; }'
  + '.spread .page:first-child { grid-column: 2; }'
  + '</style>';

/* ---- Rebuild ----------------------------------------------
   Two builders, one runner. A chapter goes through build.mjs and
   a cover through cover.mjs; they take the same target-plus-flags
   shape, so only the script name and the line worth quoting back
   differ. */
let focus = openAt
  ? { target: openAt,
      kind: existsSync(path.join(ROOT, 'covers', openAt, 'cover.json')) ? 'cover' : 'chapter' }
  : null;
const building = new Set();

function build(target, flags = [], kind = 'chapter') {
  return new Promise((resolve) => {
    const key = kind + ':' + target + flags.join();
    if (building.has(key)) { resolve({ ok: true, summary: 'already building' }); return; }
    building.add(key);
    execFile(process.execPath,
      [path.join(ROOT, 'build', kind === 'cover' ? 'cover.mjs' : 'build.mjs'), target, ...flags],
      { cwd: ROOT, maxBuffer: 1 << 24 },
      (err, stdout, stderr) => {
        building.delete(key);
        /* Both streams carry news. cover.mjs warns about the ISBN and
           refuses a press sheet through console.warn/error, and build.mjs
           reports overflow the same way — read only stdout and the studio
           says "built" while the terminal is saying otherwise. */
        const NL = String.fromCharCode(10);
        const indent = (text) => text.split(NL).map((l) => '  ' + l.trim()).join(NL);
        const out = (stdout || '').trim();
        const errs = (stderr || '').trim();
        if (out) console.log(indent(out));
        if (errs) console.log(indent(errs));
        const lines = (out + NL + errs).split(NL).map((l) => l.trim()).filter(Boolean);
        /* When a build dies, say what killed it. The first thing on stderr is
           often a warning that the build survived — reporting the ISBN note as
           the cause of a crash sends you to the wrong file. */
        const errLines = errs.split(NL).map((l) => l.trim()).filter(Boolean);
        const failure = errLines.find((l) => l.startsWith('x '))
          || errLines.find((l) => !l.startsWith('! ') && !l.startsWith('~ '))
          || (err ? err.message : '');
        /* Quote back the line that carries the news: for a chapter the fill
           map, for a cover a refusal first, then a warning, then the wrap. */
        const pick = kind === 'cover'
          ? (lines.find((l) => l.startsWith('x '))
             || lines.find((l) => l.startsWith('! '))
             || lines.find((l) => l.startsWith('wrap ')))
          : lines.find((l) => l.startsWith('fill'));
        const fill = pick || lines[lines.length - 1] || '';
        if (err) console.error('  build failed:', failure);
        for (const res of clients) res.write('data: reload\n\n');
        resolve({
          ok: !err,
          summary: err ? failure : fill,
        });
      });
  });
}

/* ---- Watch ------------------------------------------------ */
let timer = null;
const pending = new Set();
const onChange = (dir) => (_evt, file) => {
  if (!file || !/\.(html|css|json|svg)$/.test(String(file))) return;
  const parts = String(file).split(/[\\/]/);
  if (dir === 'pages' && parts.length >= 2) pending.add('chapter:' + parts[0] + '/' + parts[1]);
  else if (dir === 'covers' && parts.length >= 1) {
    // a panel in _shared is shared by every cover of that class, so rebuild them all
    const t = (parts.length < 3 || parts[1] === '_shared') ? parts[0] : parts[0] + '/' + parts[1];
    pending.add('cover:' + t);
  } else if (focus) pending.add(focus.kind + ':' + focus.target);
  clearTimeout(timer);
  timer = setTimeout(async () => {
    const todo = [...pending];
    pending.clear();
    for (const t of todo) {
      const cut = t.indexOf(':');
      const kind = t.slice(0, cut), target = t.slice(cut + 1);
      if (kind === 'cover') {
        if (existsSync(path.join(ROOT, 'covers', target))) await build(target, [], 'cover');
      } else if (existsSync(path.join(ROOT, 'pages', target, 'chapter.json'))) {
        await build(target);
      }
    }
  }, 140);
};
for (const dir of ['pages', 'css', 'covers']) {
  watch(path.join(ROOT, dir), { recursive: true }, onChange(dir));
}

/* ---- Server ----------------------------------------------- */
const server = createServer(async (req, res) => {
  const [rawUrl, rawQuery] = req.url.split('?');
  const url = decodeURIComponent(rawUrl);
  const query = new URLSearchParams(rawQuery || '');

  if (url === '/__reload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.write('\n');
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }

  if (url === '/api/build' && req.method === 'POST') {
    let raw = '';
    for await (const chunk of req) raw += chunk;
    const { target, pdf, bleed, kind } = JSON.parse(raw || '{}');
    const isCover = kind === 'cover';
    const known = isCover
      ? existsSync(path.join(ROOT, 'covers', String(target), 'cover.json'))
      : existsSync(path.join(ROOT, 'pages', String(target), 'chapter.json'));
    if (!known) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
        .end(JSON.stringify({ ok: false, summary: isCover ? 'no such cover' : 'no such chapter' }));
      return;
    }
    const flags = [];
    if (pdf) flags.push('--pdf');
    if (bleed) flags.push('--bleed');
    // a cover is looked at, not paged through, so the proof comes with it
    if (isCover) flags.push('--png');
    const out = await build(target, flags, isCover ? 'cover' : 'chapter');
    res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(out));
    return;
  }

  if (url === '/' || url === '/library') {
    res.writeHead(200, { 'Content-Type': MIME['.html'], 'Cache-Control': 'no-store' });
    res.end(libraryHtml(await library(), await coverLibrary()));
    return;
  }

  if (url.startsWith('/impose/')) {
    const target = url.slice('/impose/'.length).replace(/\/$/, '');
    const all = (await library()).flatMap((c) => c.chapters);
    const chapter = all.find((c) => c.target === target);
    if (!chapter) { res.writeHead(404, { 'Content-Type': 'text/plain' }).end('No such chapter'); return; }
    const sig = [8, 16, 32].includes(Number(query.get('sig'))) ? Number(query.get('sig')) : 32;
    res.writeHead(200, { 'Content-Type': MIME['.html'], 'Cache-Control': 'no-store' });
    res.end(impositionHtml(chapter, await sheet(chapter.meta.edition), sig).replace('</body>', RELOAD + '</body>'));
    return;
  }

  if (url.startsWith('/cover/')) {
    let target = url.slice('/cover/'.length);
    if (target.endsWith('/')) target = target.slice(0, -1);
    const all = (await coverLibrary()).flatMap((c) => c.covers);
    const cover = all.find((c) => c.target === target);
    if (!cover) { res.writeHead(404, { 'Content-Type': 'text/plain' }).end('No such cover'); return; }
    focus = { target, kind: 'cover' };
    if (!cover.built) await build(target, [], 'cover');
    res.writeHead(200, { 'Content-Type': MIME['.html'], 'Cache-Control': 'no-store' });
    res.end(coverViewerHtml(cover));
    return;
  }

  if (url.startsWith('/read/')) {
    const target = url.slice('/read/'.length).replace(/\/$/, '');
    const all = (await library()).flatMap((c) => c.chapters);
    const chapter = all.find((c) => c.target === target);
    if (!chapter) {
      res.writeHead(404, { 'Content-Type': 'text/plain' }).end('No such chapter');
      return;
    }
    focus = { target, kind: 'chapter' };
    if (!chapter.built) await build(target);
    res.writeHead(200, { 'Content-Type': MIME['.html'], 'Cache-Control': 'no-store' });
    res.end(viewerHtml(chapter, await sheet(chapter.meta.edition)));
    return;
  }

  const file = path.join(ROOT, url);
  if (!file.startsWith(ROOT)) { res.writeHead(403).end('Forbidden'); return; }

  try {
    if ((await stat(file)).isDirectory()) throw new Error('is a directory');
    let body = await readFile(file);
    const ext = path.extname(file);
    if (ext === '.html') {
      body = body.toString('utf8')
        .replace('</head>', (query.get('view') === 'spread' ? SPREAD : '') + '\n</head>')
        .replace('</body>', RELOAD + '\n</body>');
    }
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      'Cache-Control': 'no-store',
    });
    res.end(body);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found: ' + url);
  }
});

/* A studio that dies with a stack trace because some other project holds
   the port is a papercut, not a failure. Step to the next free port and
   say so — an explicit PORT= is honoured exactly, since asking for a
   particular port and silently getting another one is worse.

   The success message is bound ONCE, outside the retry, and reads the
   port the socket actually got: server.listen(port, cb) registers cb as a
   'listening' listener that outlives a failed attempt, so re-passing it
   each try makes every earlier port announce itself on the one that
   finally works. */
server.on('listening', async () => {
  const port = server.address().port;
  console.log('\n  Studio   http://localhost:' + port + '/');
  if (focus) console.log('  ' + (focus.kind === 'cover' ? 'Cover    ' : 'Chapter  ')
    + 'http://localhost:' + port + '/'
    + (focus.kind === 'cover' ? 'cover' : 'read') + '/' + focus.target);
  console.log('  Watching pages/, css/ and covers/ — a save rebuilds that one and reloads.\n');
  if (focus) await build(focus.target, [], focus.kind);
});

const listen = (port, tries) => {
  server.once('error', (err) => {
    if (err.code !== 'EADDRINUSE') throw err;
    if (process.env.PORT || tries <= 0) {
      console.error(`\n  Port ${port} is already in use.` +
        (process.env.PORT ? '  (PORT was set explicitly, so nothing else was tried.)\n'
                          : '\n'));
      process.exit(1);
    }
    console.log(`  Port ${port} is busy — trying ${port + 1}`);
    listen(port + 1, tries - 1);
  });
  server.listen(port);
};
listen(PORT, 20);
