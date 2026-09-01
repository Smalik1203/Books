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

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 5173;
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
        edition: (meta.edition || 'a4').toUpperCase(),
      });
    }
    chapters.sort((a, b) => String(a.meta.number)
      .localeCompare(String(b.meta.number), 'en', { numeric: true }));
    if (chapters.length) classes.push({ cls, chapters });
  }
  return classes;
}

const page = (title, body) => '<!doctype html>\n'
  + '<html lang="en"><head><meta charset="utf-8">\n'
  + '<meta name="viewport" content="width=device-width, initial-scale=1">\n'
  + '<title>' + esc(title) + '</title>\n'
  + '<link rel="stylesheet" href="/build/ui/app.css">\n'
  + '</head><body>' + body + '</body></html>';

/* ---- Library page ----------------------------------------- */
function libraryHtml(classes) {
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

  const body = classes.map(({ cls, chapters }) => {
    const subjects = [...new Set(chapters.map((c) => c.subject))].sort();
    return '<div class="class-head">Class ' + esc(cls.replace(/^class-/, '')) + '</div>'
      + subjects.map((s) => '<div class="subject-head">' + esc(s) + '</div>'
        + '<div class="grid">'
        + chapters.filter((c) => c.subject === s).map(card).join('')
        + '</div>').join('');
  }).join('');

  return page('LearnLab Studio', `
    <div class="wrap">
      <div class="masthead"><h1>LearnLab</h1><span class="tag">studio</span></div>
      <p class="masthead-sub">Pick a chapter to read it at size, check the print sheet,
         or build the PDFs.</p>
      ${body || '<p class="empty">Nothing in pages/ yet.</p>'}
    </div>`);
}

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
        <a class="btn" href="/build/${esc(chapter.target)}.pdf" download>Reading PDF</a>
        <a class="btn" href="/build/${esc(chapter.target)}-bleed.pdf" download>Print PDF</a>
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
          <iframe id="frame" title="${esc(chapter.meta.title)}"></iframe>
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

/* ---- Rebuild ---------------------------------------------- */
let focus = openAt;
const building = new Set();

function build(target, flags = []) {
  return new Promise((resolve) => {
    const key = target + flags.join();
    if (building.has(key)) { resolve({ ok: true, summary: 'already building' }); return; }
    building.add(key);
    execFile(process.execPath,
      [path.join(ROOT, 'build', 'build.mjs'), target, ...flags],
      { cwd: ROOT, maxBuffer: 1 << 24 },
      (err, stdout, stderr) => {
        building.delete(key);
        const out = (stdout || '').trim();
        if (out) console.log(out.split('\n').map((l) => '  ' + l.trim()).join('\n'));
        const lines = out.split('\n').map((l) => l.trim()).filter(Boolean);
        const fill = lines.find((l) => l.startsWith('fill')) || lines[lines.length - 1] || '';
        if (err) console.error('  build failed:', (stderr || err.message).trim().split('\n')[0]);
        for (const res of clients) res.write('data: reload\n\n');
        resolve({
          ok: !err,
          summary: err ? (stderr || err.message).trim().split('\n')[0] : fill,
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
  if (dir === 'pages' && parts.length >= 2) pending.add(parts[0] + '/' + parts[1]);
  else if (focus) pending.add(focus);
  clearTimeout(timer);
  timer = setTimeout(async () => {
    const todo = [...pending];
    pending.clear();
    for (const t of todo) {
      if (existsSync(path.join(ROOT, 'pages', t, 'chapter.json'))) await build(t);
    }
  }, 140);
};
for (const dir of ['pages', 'css']) {
  watch(path.join(ROOT, dir), { recursive: true }, onChange(dir));
}

/* ---- Server ----------------------------------------------- */
createServer(async (req, res) => {
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
    const { target, pdf, bleed } = JSON.parse(raw || '{}');
    if (!existsSync(path.join(ROOT, 'pages', String(target), 'chapter.json'))) {
      res.writeHead(400, { 'Content-Type': 'application/json' })
        .end(JSON.stringify({ ok: false, summary: 'no such chapter' }));
      return;
    }
    const flags = [];
    if (pdf) flags.push('--pdf');
    if (bleed) flags.push('--bleed');
    const out = await build(target, flags);
    res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(out));
    return;
  }

  if (url === '/' || url === '/library') {
    res.writeHead(200, { 'Content-Type': MIME['.html'], 'Cache-Control': 'no-store' });
    res.end(libraryHtml(await library()));
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

  if (url.startsWith('/read/')) {
    const target = url.slice('/read/'.length).replace(/\/$/, '');
    const all = (await library()).flatMap((c) => c.chapters);
    const chapter = all.find((c) => c.target === target);
    if (!chapter) {
      res.writeHead(404, { 'Content-Type': 'text/plain' }).end('No such chapter');
      return;
    }
    focus = target;
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
}).listen(PORT, async () => {
  console.log('\n  Studio   http://localhost:' + PORT + '/');
  if (openAt) console.log('  Chapter  http://localhost:' + PORT + '/read/' + openAt);
  console.log('  Watching pages/ and css/ — a save rebuilds that chapter and reloads.\n');
  if (openAt) await build(openAt);
});
