#!/usr/bin/env node
/* ============================================================
   Check the studio's class-and-subject chooser.

     node build/check-library.mjs

   Two checks, because the bug this was written after needed both.

   1. STRUCTURE, against a freshly started server. The chooser is
      rendered by serve.mjs and driven by build/ui/library.js — a
      compiled-in template and a file read fresh off disk. A stale
      server serves old markup to a new script, which is exactly
      how a dropdown came to enable itself with nothing in it. So
      the markup is asserted to carry what the script needs.

   2. BEHAVIOUR, against a fixture with TWO classes and uneven
      subjects — one class holding both, one holding only Science.
      There is a single class in pages/ today, so the multi-class
      case cannot be covered by the real tree, and it is the case
      that will break first when a second class lands.

   Exits non-zero on the first failure, so it can gate a commit.
   ============================================================ */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Chrome refuses to start its sandbox as root, which is how a CI
// container usually runs. Only then is the flag added — the same
// guard every other tool in build/ carries.
const SANDBOX = process.getuid?.() === 0 ? ['--no-sandbox'] : [];

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = (...a) => path.join(ROOT, ...a);

const CHROME = [
  process.env.CHROME, process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find((c) => c && existsSync(c));

let failures = 0;
const ok = (name) => console.log('  ok    ' + name);
const bad = (name, got, want) => {
  failures++;
  console.log('  FAIL  ' + name + '\n          got  ' + JSON.stringify(got)
    + '\n          want ' + JSON.stringify(want));
};
const eq = (name, got, want) =>
  (JSON.stringify(got) === JSON.stringify(want) ? ok(name) : bad(name, got, want));

/* ---- 1. Structure ----------------------------------------- */
const freePort = () => 5300 + Math.floor(Math.random() * 400);

async function checkStructure() {
  const port = freePort();
  const child = spawn(process.execPath, ['build/serve.mjs'],
    { cwd: ROOT, env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
  try {
    let html = '';
    for (let i = 0; i < 60 && !html; i++) {
      await new Promise((r) => setTimeout(r, 200));
      html = await fetch('http://localhost:' + port + '/')
        .then((r) => r.text()).catch(() => '');
    }
    if (!html) { bad('server responds', 'no response', 'the library page'); return; }
    ok('server responds');

    const has = (needle) => html.includes(needle);
    eq('class select present', has('id="pick-class"'), true);
    eq('subject select present', has('id="pick-subject"'), true);
    eq('subject ships disabled', /id="pick-subject"[^>]*\bdisabled\b/.test(html), true);
    eq('script is referenced', has('/build/ui/library.js'), true);
    eq('prompt present', has('id="lib-prompt"'), true);
    eq('empty state present', has('id="lib-empty"'), true);

    /* Every section the script looks for must be tagged the way it
       looks for it: class, subject, and a count it can trust. */
    const sections = [...html.matchAll(/<section class="lib-set"[^>]*>/g)].map((m) => m[0]);
    eq('sections rendered', sections.length > 0, true);
    eq('every section has data-class', sections.every((s) => s.includes('data-class=')), true);
    eq('every section ships hidden', sections.every((s) => s.includes('hidden')), true);
    const subjectSets = sections.filter((s) => s.includes('data-subject='));
    eq('subject sections carry a count',
      subjectSets.every((s) => /data-count="\d+"/.test(s)), true);
    eq('a subject section exists', subjectSets.length > 0, true);
  } finally {
    child.kill();
  }
}

/* ---- 2. Behaviour ----------------------------------------- */
/* A fixture rather than the real tree: two classes, and subjects that
   differ between them, which pages/ cannot show with one class in it. */
const FIXTURE_SETS = `
  <section class="lib-set" hidden data-class="class-9" data-subject="Mathematics" data-count="2">
    <a class="card">one</a><a class="card">two</a></section>
  <section class="lib-set" hidden data-class="class-9" data-subject="Science" data-count="0"></section>
  <section class="lib-set" hidden data-class="class-9" data-covers="1">
    <a class="card">cover</a></section>
  <section class="lib-set" hidden data-class="class-8" data-subject="Science" data-count="1">
    <a class="card">only science</a></section>
`;

const CASES = [
  ['no class chosen', ['', ''], {
    subjectDisabled: true, subjectOptions: ['Choose a class first'],
    visible: [], prompt: true, empty: false }],
  ['class 9, no subject', ['class-9', ''], {
    subjectDisabled: false,
    subjectOptions: ['Choose a subject', 'Mathematics', 'Science'],
    visible: [], prompt: true, empty: false }],
  ['class 9 + Mathematics', ['class-9', 'Mathematics'], {
    subjectDisabled: false,
    subjectOptions: ['Choose a subject', 'Mathematics', 'Science'],
    visible: ['class-9/Mathematics', 'class-9/covers'], prompt: false, empty: false }],
  ['class 9 + Science (empty)', ['class-9', 'Science'], {
    subjectDisabled: false,
    subjectOptions: ['Choose a subject', 'Mathematics', 'Science'],
    visible: [], prompt: false, empty: true }],
  // the multi-class case: class 8 offers only the subject it actually has
  ['class 8 offers only Science', ['class-8', ''], {
    subjectDisabled: false,
    subjectOptions: ['Choose a subject', 'Science'],
    visible: [], prompt: true, empty: false }],
  ['class 8 + Science', ['class-8', 'Science'], {
    subjectDisabled: false, subjectOptions: ['Choose a subject', 'Science'],
    visible: ['class-8/Science'], prompt: false, empty: false }],
];

async function checkBehaviour() {
  if (!CHROME) { bad('chrome found', 'none', 'a chrome or chromium binary'); return; }
  const script = await readFile(p('build', 'ui', 'library.js'), 'utf8');

  const driver = `
    const cls = document.getElementById('pick-class');
    const sub = document.getElementById('pick-subject');
    const label = (s) => s.dataset.covers
      ? s.dataset.class + '/covers' : s.dataset.class + '/' + s.dataset.subject;
    const out = ${JSON.stringify(CASES)}.map(([name, [c, s]]) => {
      cls.value = c; cls.dispatchEvent(new Event('change'));
      sub.value = s; sub.dispatchEvent(new Event('change'));
      return [name, {
        subjectDisabled: sub.disabled,
        subjectOptions: [...sub.options].map((o) => o.textContent),
        visible: [...document.querySelectorAll('.lib-set')].filter((x) => !x.hidden).map(label),
        prompt: !document.getElementById('lib-prompt').hidden,
        empty: !document.getElementById('lib-empty').hidden,
      }];
    });
    document.title = 'R' + JSON.stringify(out);`;

  const html = '<!doctype html><html><body>'
    + '<select id="pick-class"><option value="">Choose a class</option>'
    + '<option value="class-9">Class 9</option><option value="class-8">Class 8</option></select>'
    + '<select id="pick-subject" disabled><option value="">Choose a class first</option></select>'
    + FIXTURE_SETS
    + '<p id="lib-prompt"></p><p id="lib-empty" hidden></p>'
    + '<script>' + script + '</' + 'script>'
    + '<script>' + driver + '</' + 'script>'
    + '</body></html>';

  const dir = p('build', '_check');
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, 'library-fixture.html');
  await writeFile(file, html);

  const { stdout } = await run(CHROME, [
    '--headless=new', ...SANDBOX, '--disable-gpu', '--hide-scrollbars',
    '--virtual-time-budget=4000', '--dump-dom',
    'file:///' + file.replace(/\\/g, '/'),
  ], { maxBuffer: 1 << 24 });
  await rm(dir, { recursive: true, force: true });

  const raw = stdout.match(/<title>R([\s\S]*?)<\/title>/);
  if (!raw) { bad('fixture ran', 'no result in the dom', 'the driver output'); return; }
  const got = JSON.parse(raw[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'));

  // [name, selection, expected] — the middle element is the input, not the
  // answer, and reading it as the answer failed all six on the first run.
  for (const [name, , want] of CASES) {
    const mine = got.find(([n]) => n === name);
    if (!mine) { bad(name, 'missing', want); continue; }
    eq(name, mine[1], want);
  }
}

/* ---- 3. The viewer's zoom cluster --------------------------
   Same two halves, for the same reason. The toolbar is compiled
   into serve.mjs and driven by build/ui/app.js off disk, so a
   running studio serves yesterday's markup to today's script —
   which is how the chooser broke, and the zoom would break the
   same way. Structure asserts the ids the script reaches for;
   behaviour drives the real app.js against a stub book. */
async function checkViewerStructure() {
  const port = freePort();
  const child = spawn(process.execPath, ['build/serve.mjs'],
    { cwd: ROOT, env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
  try {
    const get = async (url) => {
      for (let i = 0; i < 60; i++) {
        await new Promise((r) => setTimeout(r, 200));
        const t = await fetch(url).then((r) => r.ok ? r.text() : '').catch(() => '');
        if (t) return t;
      }
      return '';
    };
    const lib = await get('http://localhost:' + port + '/');
    const first = (lib.match(/href="\/read\/([^"]+)"/) || [])[1];
    if (!first) { bad('a chapter to open', 'none', 'a /read/ link in the library'); return; }
    const html = await get('http://localhost:' + port + '/read/' + first);
    if (!html) { bad('viewer responds', 'no response', 'the viewer page'); return; }
    ok('viewer responds');

    for (const id of ['zoom-out', 'zoom-in', 'zoom-level', 'fit-toggle', 'zoom-menu',
      'cal-panel', 'cal-open', 'cal-done', 'cal-range', 'cal-state']) {
      eq('#' + id + ' present', html.includes('id="' + id + '"'), true);
    }
    for (const z of ['fit', 'fitw', 'actual', '1']) {
      eq('zoom preset ' + z, html.includes('data-zoom="' + z + '"'), true);
    }
    // fit to page needs the sheet height, which the old cfg did not carry
    const cfg = JSON.parse(html.match(/id="cfg">([\s\S]*?)<\/script>/)[1]);
    eq('cfg carries sheet heights',
      typeof cfg.trimH === 'number' && typeof cfg.mediaH === 'number', true);
    // and the four buttons it replaced must be gone
    eq('old preset row gone', /aria-label="Zoom"[\s\S]{0,120}>Fit</.test(html), false);

    /* The bar was stripped after the cluster landed, and each of these
       was removed for a reason that would be undone by pasting the old
       markup back. */
    eq('the page box sits in the cluster',
      /class="zoom"[\s\S]{0,400}id="page-no"/.test(html), true);
    eq('no prev/next pair', /id="(prev|next)"/.test(html), false);
    eq('trim has no button of its own', html.includes('id="sheet-trim"'), false);
    eq('bleed is a switch', /id="sheet-bleed"[^>]*aria-pressed="false"/.test(html), true);
    eq('the trim size is still stated', html.includes('mm</span>'), true);
    eq('no browser-print button', html.includes('id="print"'), false);
    eq('the info strip is gone', html.includes('class="note"'), false);
    eq('the build log ships hidden', /id="build-log"[^>]*hidden/.test(html), true);

    const covLink = (lib.match(/href="\/cover\/([^"]+)"/) || [])[1];
    if (covLink) {
      const cov = await get('http://localhost:' + port + '/cover/' + covLink);
      eq('cover viewer carries the same cluster',
        ['zoom-level', 'fit-toggle', 'zoom-menu', 'cal-done'].every((i) => cov.includes('id="' + i + '"')),
        true);
    }
  } finally {
    child.kill();
  }
}

/* The book the stub viewer shows: two pages at the real trim, so a
   percentage means the same thing here as on a chapter. */
const STUB_TRIM = { w: 189, h: 246 };

async function checkViewerBehaviour() {
  if (!CHROME) { bad('chrome found', 'none', 'a chrome or chromium binary'); return; }
  const script = await readFile(p('build', 'ui', 'app.js'), 'utf8');
  const css = await readFile(p('build', 'ui', 'app.css'), 'utf8');
  const dir = p('build', '_check');
  await mkdir(dir, { recursive: true });

  const mm = (v) => (v * 96 / 25.4) + 'px';
  await writeFile(path.join(dir, 'book-stub.html'),
    '<!doctype html><html><head><style>body{margin:0}'
    + `.page{width:${mm(STUB_TRIM.w)};height:${mm(STUB_TRIM.h)};background:#fff;margin:0 auto 8px}`
    + '</style></head><body>'
    + '<div class="page" data-folio="1"></div><div class="page" data-folio="2"></div>'
    + '</body></html>');

  const cfg = {
    target: 'stub', trimUrl: 'book-stub.html', bleedUrl: 'book-stub.html',
    imposeUrl: 'book-stub.html',
    trimW: STUB_TRIM.w, mediaW: STUB_TRIM.w + 6,
    trimH: STUB_TRIM.h, mediaH: STUB_TRIM.h + 6,
  };

  /* The toolbar, taken from serve.mjs rather than retyped, so this
     tests what the studio actually serves. */
  const serve = await readFile(p('build', 'serve.mjs'), 'utf8');
  /* Matched rather than sliced from a literal string: the signature
     grew a `pager` argument and an indexOf on the old text silently
     returned -1, which fed the fixture garbage and failed as "no
     result in the dom" — a long way from the cause. */
  const decl = serve.match(/const zoomBar = \([^)]*\) => `/);
  if (!decl) { bad('zoomBar found in serve.mjs', 'no match', 'the toolbar template'); return; }
  const from = decl.index + decl[0].length;
  const bar = serve.slice(from, serve.indexOf('`;', from))
    .replace(/\$\{pager \? `/, '').replace(/` : ''\}/, '')   // the pager is on here
    .replace(/&minus;/g, '−').replace(/&hellip;/g, '…')
    .replace(/&times;/g, '×').replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&mdash;/g, '—').replace(/&nbsp;/g, ' ');

  const driver = `
    const $ = (id) => document.getElementById(id);
    const lvl = () => $('zoom-level').textContent;
    const R = {};
    R.fitPage = lvl();
    $('zoom-in').click();  R.plus1 = lvl();
    $('zoom-in').click();  R.plus2 = lvl();
    $('zoom-out').click(); R.minus = lvl();
    $('fit-toggle').click(); R.fitWidth = lvl();
    $('fit-toggle').click(); R.backToPage = lvl();
    $('zoom-level').click(); R.menuOpen = !$('zoom-menu').hidden;
    document.querySelector('[data-zoom="1.5"]').click();
    R.preset = lvl();
    R.menuClosedAfterPick = $('zoom-menu').hidden;
    R.checked = [...document.querySelectorAll('[data-zoom]')]
      .filter((b) => b.getAttribute('aria-checked') === 'true').map((b) => b.dataset.zoom);
    // the ladder has ends, and the buttons must say so
    for (let i = 0; i < 12; i++) $('zoom-in').click();
    R.ceiling = lvl(); R.inDisabled = $('zoom-in').disabled;
    for (let i = 0; i < 20; i++) $('zoom-out').click();
    R.floor = lvl(); R.outDisabled = $('zoom-out').disabled;
    // calibration: 3.4 px/mm is 90% of the 96dpi the browser assumes
    $('zoom-level').click(); $('cal-open').click();
    R.calPanelOpen = !$('cal-panel').hidden;
    const rg = $('cal-range');
    rg.value = '3.4'; rg.dispatchEvent(new Event('input', { bubbles: true }));
    R.calNote = $('cal-state').textContent;
    $('cal-done').click();
    R.actual = lvl();
    R.calPanelClosed = $('cal-panel').hidden;
    $('cal-open') && ($('zoom-level').click(), $('cal-open').click(), $('cal-reset').click());
    R.uncalNote = $('cal-state').textContent;
    // the page box counts the stub's two pages, and the keys page it
    R.pageCount = $('page-count').textContent;
    const key = (k) => document.dispatchEvent(
      new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
    key('End');  R.end = $('page-no').value;
    key('Home'); R.home = $('page-no').value;
    document.title = 'R' + JSON.stringify(R);`;

  const html = '<!doctype html><html><head><style>' + css + '</style></head><body>'
    + '<div class="viewer"><div class="bar">' + bar + '</div>'
    + '<div class="stage" id="stage" style="width:900px;height:700px">'
    + '<div class="stage__inner" id="inner">'
    + '<iframe id="frame" scrolling="no"></iframe></div></div></div>'
    + '<button id="build"></button><span id="build-log" hidden></span>'
    + '<script type="application/json" id="cfg">' + JSON.stringify(cfg) + '</' + 'script>'
    + '<script>' + script + '</' + 'script>'
    + '<script>addEventListener("load", () => setTimeout(() => {' + driver + '}, 300));</' + 'script>'
    + '</body></html>';

  const file = path.join(dir, 'viewer-fixture.html');
  await writeFile(file, html);
  const { stdout } = await run(CHROME, [
    '--headless=new', ...SANDBOX, '--disable-gpu', '--hide-scrollbars',
    /* Two file:// documents are separate opaque origins by default, so
       the fixture could not read the stub book inside its own iframe:
       contentDocument came back null, the page count stayed 0, and only
       the checks that never touch the book passed. */
    '--allow-file-access-from-files',
    '--window-size=1400,900', '--virtual-time-budget=6000', '--dump-dom',
    'file:///' + file.replace(/\\/g, '/'),
  ], { maxBuffer: 1 << 24 });
  await rm(dir, { recursive: true, force: true });

  const raw = stdout.match(/<title>R([\s\S]*?)<\/title>/);
  if (!raw) { bad('viewer fixture ran', 'no result in the dom', 'the driver output'); return; }
  const R = JSON.parse(raw[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'));

  const pc = (s) => Number(String(s).replace('%', ''));
  eq('fit to page fits the height', pc(R.fitPage) > 0 && pc(R.fitPage) < 100, true);
  eq('fit to width is wider than fit to page', pc(R.fitWidth) > pc(R.fitPage), true);
  eq('plus steps up the ladder', pc(R.plus2) > pc(R.plus1) && pc(R.plus1) > pc(R.fitPage), true);
  eq('minus steps back', R.minus, R.plus1);
  eq('the fit toggle returns', R.backToPage, R.fitPage);
  eq('the level opens the menu', R.menuOpen, true);
  eq('a preset sets the level', R.preset, '150%');
  eq('picking closes the menu', R.menuClosedAfterPick, true);
  eq('the chosen preset is ticked', R.checked, ['1.5']);
  eq('the ladder has a ceiling', [R.ceiling, R.inDisabled], ['300%', true]);
  eq('the ladder has a floor', [R.floor, R.outDisabled], ['25%', true]);
  eq('calibrate opens from the menu', R.calPanelOpen, true);
  eq('an uncalibrated screen says so', R.uncalNote, '96 dpi');
  eq('a calibrated one says so', R.calNote, 'calibrated');
  eq('actual size follows the calibration', R.actual, '90%');
  eq('done closes the panel', R.calPanelClosed, true);
  eq('the page box counts the book', R.pageCount, '/ 2');
  eq('End and Home page it', [R.end, R.home], ['2', '1']);
}

/* ---- 5. What a build reports ------------------------------
   The bar used to carry the whole fill map — twenty-eight
   percentages wrapped over two lines. It says what happened now,
   and a chapter the builder is happy with must say so. */
async function checkBuildReport() {
  const port = freePort();
  const child = spawn(process.execPath, ['build/serve.mjs'],
    { cwd: ROOT, env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });
  try {
    let lib = '';
    for (let i = 0; i < 60 && !lib; i++) {
      await new Promise((r) => setTimeout(r, 200));
      lib = await fetch('http://localhost:' + port + '/').then((r) => r.text()).catch(() => '');
    }
    const target = (lib.match(/href="\/read\/([^"]+)"/) || [])[1];
    if (!target) { bad('a chapter to build', 'none', 'a /read/ link'); return; }
    const out = await fetch('http://localhost:' + port + '/api/build', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ target }),
    }).then((r) => r.json());
    eq('the build reports ok', out.ok, true);
    eq('the report is a phrase, not the fill map',
      /^\d+ pages( · .+)?$/.test(out.summary) && !/\d+:\d+%/.test(out.summary), true);
  } finally {
    child.kill();
  }
}

console.log('Structure — the markup carries what the script needs:');
await checkStructure();
console.log('\nBehaviour — two classes, uneven subjects:');
await checkBehaviour();
console.log('\nViewer — the zoom cluster the studio serves:');
await checkViewerStructure();
console.log('\nViewer — driving the real app.js against a stub book:');
await checkViewerBehaviour();
console.log('\nBuild — what it reports back to the bar:');
await checkBuildReport();

console.log();
if (failures) {
  console.log('  ' + failures + ' failure(s).');
  process.exit(1);
}
console.log('  all checks passed.');
