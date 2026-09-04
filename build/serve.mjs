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
const openAt = process.argv[2] || null;

/* ---- Restarting itself ------------------------------------
   This file is compiled into the process running it: the whole
   viewer, every toolbar and every id lives in the template
   literals below, and node cannot swap them out from under
   itself. So a change here used to mean killing the studio and
   starting it again by hand, every time — and forgetting to do
   it meant a running server handing yesterday's markup to a
   script read fresh off disk, which is how the class chooser
   came to enable itself with nothing in it.

   So it starts itself again. Run plainly, it re-execs under
   `node --watch` and steps aside; the watcher restarts the real
   server whenever this file or anything it imports changes, and
   the open tabs come back on their own, because the reload
   client reloads on a reconnect as well as on a message.

   The port is chosen once, here, and handed down — otherwise
   every restart would race its own closing socket and the
   port-stepping below would quietly move the studio to 5181
   while the tab kept knocking at 5180.

   LL_STUDIO_CHILD is what tells the child it is the child.
   PORT= still wins, and NO_WATCH=1 opts out entirely. */
if (!process.env.LL_STUDIO_CHILD && !process.env.NO_WATCH) {
  const { spawn } = await import('node:child_process');
  const net = await import('node:net');

  const free = (from) => new Promise((resolve) => {
    const probe = net.createServer();
    probe.once('error', () => resolve(free(from + 1)));
    probe.listen(from, () => probe.close(() => resolve(from)));
  });
  const port = Number(process.env.PORT) || await free(5180);

  const child = spawn(process.execPath,
    ['--watch', '--watch-preserve-output', fileURLToPath(import.meta.url), ...process.argv.slice(2)],
    { stdio: 'inherit', env: { ...process.env, LL_STUDIO_CHILD: '1', PORT: String(port) } });

  for (const sig of ['SIGINT', 'SIGTERM']) {
    process.on(sig, () => { child.kill(sig); process.exit(0); });
  }
  child.on('exit', (code) => process.exit(code ?? 0));
  await new Promise(() => {});     // the child has the terminal from here
}

const PORT = Number(process.env.PORT) || 5180;   // override: PORT=5199 node build/serve.mjs

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

/* The studio's own pages carry the reload client too. They did not:
   it went only into the book inside the iframe, so a change to the
   toolbar or to app.js left the shell around the book exactly as it
   was until the tab was reloaded by hand. */
const page = (title, body) => '<!doctype html>\n'
  + '<html lang="en"><head><meta charset="utf-8">\n'
  + '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
  + '<title>' + esc(title) + '</title>\n'
  + '<link rel="stylesheet" href="/build/ui/app.css">\n'
  + '</head><body>' + body + RELOAD + '</body></html>';

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

  /* The two subjects a class holds, listed whether or not either has
     chapters yet. A dropdown that grows as content lands is a dropdown
     that reads differently every month; this one is the finished shape,
     and a subject with nothing in it resolves to the empty state, which
     is the honest answer. */
  const SUBJECTS = ['Mathematics', 'Science'];

  /* Every class-and-subject pair is rendered, and every class's covers,
     each tagged so the script can show exactly one pair at a time. They
     ship hidden: the page opens on the prompt rather than flashing the
     whole library and then collapsing it. */
  const sections = names.map((cls) => {
    const chapters = (classes.find((c) => c.cls === cls) || { chapters: [] }).chapters;
    const covers = (coverClasses.find((c) => c.cls === cls) || { covers: [] }).covers;
    const shown = esc(cls.replace(/^class-/, ''));

    const perSubject = SUBJECTS.map((sub) => {
      const mine = chapters.filter((c) => c.subject === sub);
      return `<section class="lib-set" hidden data-class="${esc(cls)}" data-subject="${esc(sub)}"`
        + ` data-count="${mine.length}">`
        + `<div class="class-head">Class ${shown} &middot; ${esc(sub)}</div>`
        + (mine.length ? `<div class="grid">${mine.map(card).join('')}</div>` : '')
        + `</section>`;
    }).join('');

    const coverSet = covers.length
      ? `<section class="lib-set" hidden data-class="${esc(cls)}" data-covers="1">`
        + '<div class="subject-head">Covers</div>'
        + `<div class="grid">${covers.map(coverCard).join('')}</div></section>`
      : '';

    return perSubject + coverSet;
  }).join('');

  /* A directory is named class-9; a reader is offered "Class 9". The value
     stays the directory name, because that is what the sections are keyed on. */
  const opts = (list, placeholder, label = (v) => v) =>
    `<option value="">${placeholder}</option>`
    + list.map((v) => `<option value="${esc(v)}">${esc(label(v))}</option>`).join('');

  const controls = `
      <div class="lib-controls">
        <label class="lib-field">
          <span>Class</span>
          <select class="lib-select" id="pick-class">${
            opts(names, 'Choose a class', (v) => 'Class ' + v.replace(/^class-/, ''))
          }</select>
        </label>
        <label class="lib-field">
          <span>Subject</span>
          <!-- Empty and disabled until a class is chosen: a subject on its
               own is not half a selection, it is a meaningless one. The
               script fills it from the sections below, so there is no second
               list of subjects here to fall out of step with them. Rendered
               in this state so it is right before any script runs. -->
          <select class="lib-select" id="pick-subject" disabled>
            <option value="">Choose a class first</option>
          </select>
        </label>
      </div>`;

  return page('LearnLab Studio', `
    <div class="wrap">
      <div class="masthead"><h1>LearnLab</h1><span class="tag">studio</span></div>
      <p class="masthead-sub">Choose a class and a subject. Then pick a chapter to read
         it at size, check the print sheet, or build the PDFs. Covers are built and
         viewed separately &mdash; a wrap is one sheet, not a run of pages.</p>
      ${names.length ? controls : ''}
      ${sections}
      <p class="lib-note" id="lib-prompt">Choose a class and a subject to see its chapters.</p>
      <p class="lib-note" id="lib-empty" hidden>Nothing here yet.</p>
      ${names.length ? '' : '<p class="empty">Nothing in pages/ or covers/ yet.</p>'}
      <noscript><p class="lib-note">The chooser needs JavaScript. Without it the
         library cannot be filtered.</p></noscript>
    </div>
    <script src="/build/ui/library.js"></script>`);
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

/* ---- The zoom cluster -------------------------------------
   Chrome's PDF toolbar, because that is the control every reader
   of this book already knows: minus, the level, plus, and a fit
   toggle beside them. Both viewers show the same cluster, so it is
   built once here rather than pasted into each.

   The level is a field, not a menu. It began as four preset
   buttons, became a menu of six presets plus the two fits, Actual
   size and a calibration panel — and a preset is a guess at what
   somebody wants. A proof gets read at whatever percentage makes
   one figure legible, and that number was never on the list. So
   the presets are gone and the level is typed; the two fits keep
   the button beside it, which is where they were always reached
   from anyway.

   Actual size and the bank-card calibration went with the menu.
   Uncalibrated, Actual size was 100% under another name, and the
   calibration behind it was the one control here that had to be
   set up before it told the truth.

   The order is Chrome's too: the page box first, then a rule, then
   the level, then a rule and the fit toggle. `pager` is false on a
   cover, which is one sheet and has no page to be on.

   Four of Chrome's buttons are deliberately absent. Rotate turns
   one page at a time, and this viewer shows a chapter as a single
   scrolling column — rotating that gives a strip twenty-eight
   pages wide, which is not what the button means. Draw, undo and
   redo are its annotation layer, and there is nothing here to
   annotate: a note wanted on a proof belongs in the source. */
/* ---- Home and back ----------------------------------------
   Two different journeys, so two buttons. Back goes to the list
   this page came from, carrying its class and subject; home goes
   to the top of the studio, and says so with ?home, which tells
   the chooser to ignore the choice it remembers. Without that the
   two would land in the same place and one of them would be a lie.

   The label beside them reads downwards: where you are, then what
   you are looking at. Class and chapter first because that is what
   you check when you have three tabs open, and it is the shorter
   line — a title can run to any length and takes the ellipsis. */
const navPair = (backHref, sub, title) => `
        <a class="btn btn--icon" href="/?home" title="The library">
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M3 9.2 10 3.4l7 5.8" />
            <path d="M4.8 8.2V16h10.4V8.2" />
            <path d="M8.1 16v-4.4h3.8V16" />
          </svg>
        </a>
        <a class="btn btn--icon" href="${backHref}" title="Back to the chapters">
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M16 10H4.6" /><path d="M9.4 4.8 4.2 10l5.2 5.2" />
          </svg>
        </a>
        <span class="bar__where">
          <span class="bar__sub">${sub}</span>
          <span class="bar__title">${esc(title)}</span>
        </span>`;

const zoomBar = (pager = true, switches = '') => `
        <div class="zoom" role="group" aria-label="Zoom and paging">
          ${pager ? `<span class="pager">
            <input id="page-no" type="number" min="1" value="1" aria-label="Page">
            <span id="page-count">/ ?</span>
          </span>
          <span class="zoom__rule"></span>` : ''}
          <button class="zoom__step" id="zoom-out" title="Zoom out">&minus;</button>
          <!-- The level is typed, not chosen. It was a button opening a
               menu of six presets, and a preset is a guess at what
               somebody wants: a proof is often read at whatever
               percentage makes one figure legible, and 137 was not on
               the list. Type it. -->
          <input class="zoom__level" id="zoom-level" type="text"
                 inputmode="numeric" autocomplete="off" spellcheck="false"
                 aria-label="Zoom" title="Zoom — type any percentage" value="100%">
          <button class="zoom__step" id="zoom-in" title="Zoom in">+</button>
          <span class="zoom__rule"></span>
          <!-- One button, two icons: a portrait sheet with the arrows
               running down it, and a landscape one with them running
               across. The button shows the mode it is in rather than
               the mode it would give, so the icon and the tooltip say
               the same thing — a control that names its own opposite
               has to be read twice. app.js hides one of the two. -->
          <button class="zoom__step" id="fit-toggle"
                  title="Fit to page — click for fit to width">
            <svg data-fit="fit" viewBox="0 0 20 20" aria-hidden="true">
              <rect x="5.2" y="2.4" width="9.6" height="15.2" rx="1.7" />
              <path class="solid" d="M10 5.1 12 7.6H8z" />
              <path class="solid" d="M10 14.9 8 12.4h4z" />
            </svg>
            <svg data-fit="fitw" viewBox="0 0 20 20" aria-hidden="true" hidden>
              <rect x="2.4" y="5.2" width="15.2" height="9.6" rx="1.7" />
              <path class="solid" d="M5.1 10 7.6 8v4z" />
              <path class="solid" d="M14.9 10 12.4 12V8z" />
            </svg>
          </button>
          ${switches ? `<span class="zoom__rule"></span>${switches}` : ''}
        </div>`;

/* ---- Viewer page ------------------------------------------ */
function viewerHtml(chapter, s) {
  const cfg = {
    target: chapter.target,
    trimUrl: '/build/' + chapter.target + '.html',
    bleedUrl: '/build/' + chapter.target + '-bleed.html',
    imposeUrl: '/impose/' + chapter.target,
    trimW: s.trimW, mediaW: s.mediaW,
    trimH: s.trimH, mediaH: s.mediaH,
  };
  const noBleed = !existsSync(path.join(ROOT, 'build', chapter.target + '-bleed.html'));

  const dl = (suffix, label) => downloadBtn(chapter.target, suffix, label);

  return page(chapter.meta.title + ' — LearnLab Studio', `
    <div class="viewer">
      <div class="bar">
        <!-- Three parts, so the zoom cluster is centred on the bar and
             not merely on what is left over. Flexed, the two sides have
             to be the same width for the middle to land in the middle,
             and here one holds a title and two switches while the other
             holds a download and a button. A grid does not care.

             The back link carries the class and subject this chapter
             belongs to, so the library opens on the list the reader just
             left instead of on two empty dropdowns — right even for a
             chapter reached by its address. The label beside it names
             neither the page count nor the trim: the page box carries
             one and the Bleed tooltip the other. -->
        <div class="bar__side">
${navPair(
  '/?class=' + encodeURIComponent(chapter.target.split('/')[0])
    + '&amp;subject=' + encodeURIComponent(chapter.subject),
  'Class ' + esc(chapter.meta.class) + ' &middot; CH ' + esc(chapter.meta.number),
  chapter.meta.title)}
        </div>

        <!-- Two switches, and neither names the state it is already in.
             Pages is the default view and the trim is the default sheet,
             so a Pages button and a Trim button were labels for "as you
             found it" — and a measurement on a button is a fact about
             the sheet, not a thing you can press. Both sizes are in the
             tooltips, where facts belong.

             Spreads sits in the middle cluster, past the fit toggle:
             everything there changes how the book is laid out on the
             screen. Bleed is over on the right, beside Print PDF,
             because it changes which sheet you are looking at — the
             reading page or the one that goes to press — and that is
             the same question the download beside it answers.

             The signature view went the same way, being a schematic of
             a press sheet rather than a way of looking at the book. It
             is still built and still served, at
             /impose/<class>/<chapter>?sig=32, and nothing links to it:
             it is reached by typing the address. -->
${zoomBar(true, `
          <button class="btn" id="view-spread" aria-pressed="false"
            title="Verso and recto side by side — the only way to check the mirroring">Spreads</button>`)}

        <div class="bar__side bar__side--end">
          <span class="bar__log" id="build-log" hidden></span>
          <button class="btn" id="sheet-bleed" aria-pressed="false"
            ${noBleed ? 'disabled title="Build first"'
                      : `title="Show the press sheet, ${s.mediaW} × ${s.mediaH} mm — the ${s.trimW} × ${s.trimH} trim plus ${s.bleed}mm of bleed, in a ${s.slug}mm slug with the crop marks"`}
            >Bleed</button>
          ${dl('-bleed.pdf', 'Print PDF')}
          <button class="btn btn--go" id="build">Build</button>
        </div>
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
    trimH: s.trimH, mediaH: s.wrapH,
  };
  const noBleed = !existsSync(path.join(ROOT, 'build', base + '-bleed.html'));
  const dl = (suffix, label) => downloadBtn(base, suffix, label);

  return page(cover.name + ' — cover — LearnLab Studio', `
    <div class="viewer">
      <div class="bar">
        <!-- A cover belongs to a class but to no subject, so the arrow
             carries the class only and the subject is whatever was last
             chosen. -->
        <div class="bar__side">
${navPair(
  '/?class=' + encodeURIComponent(cover.target.split('/')[0]),
  'Class ' + esc(cover.meta.class) + ' &middot; cover &middot; '
    + esc(cover.meta.direction || 'plain') + ' / ' + esc(cover.meta.finish || 'light'),
  cover.name)}
        </div>

${zoomBar(false)}

        <div class="bar__side bar__side--end">
          <span class="bar__log" id="build-log" hidden></span>
          <button class="btn" id="sheet-bleed" aria-pressed="false"
            ${noBleed ? 'disabled title="Build first"'
                      : `title="Show the press sheet, ${s.wrapW} × ${s.wrapH} mm — the ${s.sheetW} × ${s.trimH} wrap plus ${s.bleed}mm of bleed"`}
            >Bleed</button>
          ${dl('-bleed.pdf', 'Press PDF')}
          ${dl('-proof.png', 'Proof PNG')}
          <button class="btn btn--go" id="build">Build</button>
        </div>
      </div>

      <!-- The spine is the one thing on this page that can be wrong in a
           way the proof will not show, so it keeps its line. Everything
           else the bar used to explain has gone: a strip that described
           the buttons beside it, and then printed the whole fill map of
           the last build, is a catalogue and not a note. -->
      <div class="note">
        <b>Spine ${s.spine.mm}mm</b> &mdash; ${esc(s.spine.how)}. It is bulk, not a
        choice: re-derive the page count from a <b>--book</b> run before this goes to
        press. A placeholder QR will refuse the press sheet and say so.
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
/* Two things bring a tab back. A message, when a chapter or a cover
   has been rebuilt — and a reconnect, when the server itself has
   restarted under the watcher and is serving markup this page was
   rendered before. EventSource retries on its own; all this has to
   do is notice that the connection it just opened is not its
   first. */
const clients = new Set();
const RELOAD = `
<script>(function () {
  var es = new EventSource('/__reload'), opened = false;
  es.onmessage = function () { location.reload(); };
  es.onopen = function () { if (opened) location.reload(); opened = true; };
}());</script>`;

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
        /* Say what the build came to, in a phrase. This used to quote the
           whole fill line back — twenty-eight percentages, wrapped across
           the bar — which is a table, and a table wants reading rather
           than glancing at. The numbers are on the terminal, where they
           can be read; what belongs here is whether anything is wrong. */
        const fillLine = lines.find((l) => l.startsWith('fill')) || '';
        const digest = () => {
          const pages = fillLine.match(/(\d+):\d+%/g);
          const clip = lines.filter((l) => /overruns by/.test(l)).length;
          const viol = Number((lines.find((l) => /design violation/.test(l)) || '')
            .match(/(\d+) design violation/)?.[1] || 0);
          /* Count the builder's own short-page warnings rather than
             re-deriving them from the fill map: the map does not say
             which page is the last or which carries data-close, and
             both are exempt. Counting the percentages called ch07's
             closing page short when the builder had excused it. */
          const short = lines.filter((l) => /is \d+% full/.test(l)).length;
          return [
            pages ? pages.length + ' pages' : 'built',
            clip ? clip + ' clipping' : null,
            viol ? viol + ' violation' + (viol === 1 ? '' : 's') : null,
            short ? short + ' short' : null,
          ].filter(Boolean).join(' · ') + (clip || viol || short ? '' : ' · all clear');
        };
        /* A cover has no fill map: a refusal first, then a warning, then
           the wrap it settled on. */
        const pick = kind === 'cover'
          ? (lines.find((l) => l.startsWith('x '))
             || lines.find((l) => l.startsWith('! '))
             || lines.find((l) => l.startsWith('wrap ')))
          : digest();
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
  if (!file || !/\.(html|css|json|svg|js)$/.test(String(file))) return;
  const parts = String(file).split(/[\\/]/);
  /* build/ui is the studio's own front end, served off disk rather
     than compiled in — so nothing needs rebuilding and nothing needs
     restarting, the tab only needs telling. It was not watched at all,
     which is why an edit to app.js looked like it had not applied. */
  if (dir === 'build/ui') { for (const res of clients) res.write('data: reload\n\n'); return; }
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
for (const dir of ['pages', 'css', 'covers', 'build/ui']) {
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
  console.log('  Watching pages/, css/ and covers/ — a save rebuilds that one and reloads.');
  console.log('  build/ui reloads the tab; build/serve.mjs restarts the studio itself.'
    + (process.env.NO_WATCH ? '  (NO_WATCH is set — restart it yourself.)' : '') + '\n');
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
