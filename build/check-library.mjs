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
    { cwd: ROOT, env: { ...process.env, PORT: String(port), NO_WATCH: '1' }, stdio: 'ignore' });
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

    /* The back arrow means "back to the chapters", not "start over".
       It went to a bare "/", which opened on two empty dropdowns and
       made the reader choose the class and subject again to reach the
       list they had just left. */
    const first = (html.match(/href="\/read\/([^"]+)"/) || [])[1];
    const view = await fetch('http://localhost:' + port + '/read/' + first)
      .then((r) => r.text()).catch(() => '');
    eq('the chapter back link carries class and subject',
      /href="\/\?class=[^"]+&amp;subject=[^"]+"/.test(view), true);
    eq('and is not a bare slash', /href="\/"/.test(view), false);
    eq('a home button beside it', /href="\/\?home"[^>]*title="The library"/.test(view), true);
    eq('both are icons', (view.match(/class="btn btn--icon"/g) || []).length >= 2, true);
    /* Where you are, then what you are looking at — the class and the
       chapter above the title, not run together beside it. */
    eq('the label is stacked, class and chapter first',
      /class="bar__where">[\s\S]*?bar__sub[\s\S]*?bar__title/.test(view), true);
    const covLink = (html.match(/href="\/cover\/([^"]+)"/) || [])[1];
    if (covLink) {
      const cov = await fetch('http://localhost:' + port + '/cover/' + covLink)
        .then((r) => r.text()).catch(() => '');
      // a cover belongs to a class and to no subject
      eq('the cover back link carries the class', /href="\/\?class=[^"&]+"/.test(cov), true);
    }
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

/* ---- 2b. Arriving with a choice already made ---------------
   What the back arrow depends on: the page reads the class and
   subject off the link it was opened with, and ignores a pair
   that no longer has a section rather than selecting nothing and
   looking broken. Same fixture, loaded three times. */
const ARRIVALS = [
  ['both carried', '?class=class-8&subject=Science',
    { cls: 'class-8', sub: 'Science', prompt: false, visible: ['class-8/Science'] }],
  // a cover carries only its class, and lands on the prompt without a subject
  ['class alone', '?class=class-9',
    { cls: 'class-9', sub: '', prompt: true, visible: [] }],
  // a class that has gone: ignored, not applied
  ['a pair that no longer exists', '?class=class-99&subject=Alchemy',
    { cls: '', sub: '', prompt: true, visible: [] }],
  /* Home is not back under another icon: it goes to the top of the
     studio, where nothing is chosen. Asserted against a class carried
     beside it, which is the same branch a remembered one takes. */
  ['home ignores a choice carried with it', '?home&class=class-9&subject=Mathematics',
    { cls: '', sub: '', prompt: true, visible: [] }],
];

async function checkArrival() {
  if (!CHROME) return;                       // already reported by checkBehaviour
  const script = await readFile(p('build', 'ui', 'library.js'), 'utf8');
  const dir = p('build', '_check');
  await mkdir(dir, { recursive: true });

  const driver = `
    const cls = document.getElementById('pick-class');
    const sub = document.getElementById('pick-subject');
    const label = (s) => s.dataset.covers
      ? s.dataset.class + '/covers' : s.dataset.class + '/' + s.dataset.subject;
    document.title = 'R' + JSON.stringify({
      cls: cls.value, sub: sub.value,
      prompt: !document.getElementById('lib-prompt').hidden,
      visible: [...document.querySelectorAll('.lib-set')]
        .filter((x) => !x.hidden && !x.dataset.covers).map(label),
    });`;

  const html = '<!doctype html><html><body>'
    + '<select id="pick-class"><option value="">Choose a class</option>'
    + '<option value="class-9">Class 9</option><option value="class-8">Class 8</option></select>'
    + '<select id="pick-subject" disabled><option value="">Choose a class first</option></select>'
    + FIXTURE_SETS
    + '<p id="lib-prompt"></p><p id="lib-empty" hidden></p>'
    + '<script>' + script + '</' + 'script>'
    + '<script>' + driver + '</' + 'script>'
    + '</body></html>';

  const file = path.join(dir, 'arrival-fixture.html');
  await writeFile(file, html);
  const url = 'file:///' + file.replace(/\\/g, '/');

  for (const [name, query, want] of ARRIVALS) {
    const { stdout } = await run(CHROME, [
      '--headless=new', ...SANDBOX, '--disable-gpu', '--hide-scrollbars',
      '--virtual-time-budget=4000', '--dump-dom', url + query,
    ], { maxBuffer: 1 << 24 });
    const raw = stdout.match(/<title>R([\s\S]*?)<\/title>/);
    if (!raw) { bad(name, 'no result in the dom', want); continue; }
    eq(name, JSON.parse(raw[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&')), want);
  }
  await rm(dir, { recursive: true, force: true });
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
    { cwd: ROOT, env: { ...process.env, PORT: String(port), NO_WATCH: '1' }, stdio: 'ignore' });
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
    /* No measurement anywhere on the bar. It moved from the Bleed
       button into the subtitle and then off altogether — a number
       that cannot be pressed and never changes belongs in a tooltip,
       not in the line a reader glances at to know where they are. */
    eq('no measurement in the subtitle', /class="bar__sub">[\s\S]*?mm<\/span>/.test(html), false);
    eq('and no page count either — the page box has it',
      /class="bar__sub">[\s\S]*?\d+ pp/.test(html), false);
    eq('no browser-print button', html.includes('id="print"'), false);
    eq('the info strip is gone', html.includes('class="note"'), false);
    eq('no signature view', html.includes('id="view-impose"'), false);
    eq('no pages-per-signature select', html.includes('id="sig-size"'), false);
    /* Pages is the view a chapter opens on and the trim is the sheet it
       opens on, so neither has a button: what is left is two switches,
       both off, and no segmented group to hold a pressed pair. */
    eq('no pages button', html.includes('id="view-pages"'), false);
    eq('spreads is a switch', /id="view-spread"[^>]*aria-pressed="false"/.test(html), true);
    eq('no segmented groups', html.includes('class="seg"'), false);
    /* A measurement is a fact about the sheet, not a thing to press. */
    eq('bleed carries no measurement', /id="sheet-bleed"[\s\S]{0,400}?>Bleed<\/button>/.test(html), true);
    eq('the press size is in the tooltip', /title="Show the press sheet, \d/.test(html), true);
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
    const bar = document.querySelector('.bar').getBoundingClientRect();
    const zoom = document.querySelector('.zoom').getBoundingClientRect();
    R.offCentre = Math.round((zoom.x + zoom.width / 2) - (bar.x + bar.width / 2));
    R.barRow = bar.height < 60;
    const key = (k, shift) => document.dispatchEvent(
      new KeyboardEvent('keydown', { key: k, shiftKey: !!shift, bubbles: true, cancelable: true }));
    key('End');  R.end = $('page-no').value;
    key('Home'); R.home = $('page-no').value;

    /* The arrow keys move the document. They are answered by the script
       and not by the browser — the book is in an iframe and the stage
       around it has no focus — so if the handler goes, nothing scrolls
       and nothing says so. */
    const st = $('stage');
    st.scrollTop = 0;
    key('ArrowDown'); key('ArrowDown'); key('ArrowDown');
    R.arrowDown = st.scrollTop;
    key('ArrowUp');
    R.arrowUp = st.scrollTop;
    key(' ');
    R.space = st.scrollTop;
    key(' ', true);
    R.shiftSpace = st.scrollTop;
    // and the box follows the scroll, not only a typed page number
    st.scrollTop = 0;
    let guard = 0;
    while ($('page-no').value === '1' && guard++ < 200) key('ArrowDown');
    R.boxFollowedAfter = guard < 200 ? $('page-no').value : 'never';
    // an arrow must not fire while the page number is being typed
    st.scrollTop = 0;
    $('page-no').focus();
    key('ArrowDown');
    R.notWhileTyping = st.scrollTop;
    $('page-no').blur();
    document.title = 'R' + JSON.stringify(R);`;

  /* The bar has three parts and the middle one is centred by the grid,
     so the fixture has to carry all three — with sides of deliberately
     unequal width, since equal ones would centre under a flex row with
     spacers too and prove nothing. */
  const html = '<!doctype html><html><head><style>' + css + '</style></head><body>'
    + '<div class="viewer"><div class="bar">'
    + '<div class="bar__side"><a class="btn">&larr;</a>'
    + '<span class="bar__title">A Long Chapter Title</span>'
    + '<span class="bar__sub">Class 9 &middot; ch 7</span>'
    + '<button class="btn">Bleed</button><button class="btn">Spreads</button></div>'
    + bar
    + '<div class="bar__side bar__side--end">'
    + '<a class="btn">Print PDF</a><button class="btn btn--go">Build</button></div>'
    + '</div>'
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
  /* Centred on the bar, not merely on what is left over — the two
     sides differ in width, so a flex row with spacers would sit it
     off to one side and look almost right. */
  eq('the cluster is centred on the bar', Math.abs(R.offCentre) <= 1, true);
  eq('and the bar is a single row', R.barRow, true);
  eq('the page box counts the book', R.pageCount, '/ 2');
  eq('End and Home page it', [R.end, R.home], ['2', '1']);
  eq('the down arrow scrolls', R.arrowDown > 0, true);
  eq('the up arrow scrolls back', R.arrowUp < R.arrowDown && R.arrowUp > 0, true);
  eq('space takes a screenful', R.space > R.arrowDown, true);
  eq('shift-space gives it back', R.shiftSpace < R.space, true);
  eq('the page box follows the scroll', R.boxFollowedAfter, '2');
  eq('an arrow does not fire while typing a page number', R.notWhileTyping, 0);
}

/* ---- 5. What a build reports ------------------------------
   The bar used to carry the whole fill map — twenty-eight
   percentages wrapped over two lines. It says what happened now,
   and a chapter the builder is happy with must say so. */
async function checkBuildReport() {
  const port = freePort();
  const child = spawn(process.execPath, ['build/serve.mjs'],
    { cwd: ROOT, env: { ...process.env, PORT: String(port), NO_WATCH: '1' }, stdio: 'ignore' });
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

/* ---- 6. Restarting itself ---------------------------------
   The studio re-execs under `node --watch` so an edit to
   serve.mjs restarts it and the open tabs come back on their
   own. If that ever stops working the failure is silent — the
   studio simply serves yesterday's markup again, which is the
   whole class of bug this file exists for. So it is driven:
   start one plainly, change the toolbar, and see the change
   served without anyone touching the process. */
async function checkSelfRestart() {
  const port = freePort();
  const file = p('build', 'serve.mjs');
  const before = await readFile(file, 'utf8');
  const MARK = '<!--restart-check-' + Date.now() + '-->';
  const child = spawn(process.execPath, ['build/serve.mjs'],
    { cwd: ROOT, env: { ...process.env, PORT: String(port) }, stdio: 'ignore' });

  const get = async (tries) => {
    for (let i = 0; i < tries; i++) {
      await new Promise((r) => setTimeout(r, 250));
      const t = await fetch('http://localhost:' + port + '/read/' + target)
        .then((r) => r.ok ? r.text() : '').catch(() => '');
      if (t) return t;
    }
    return '';
  };
  let target = '';
  try {
    for (let i = 0; i < 60 && !target; i++) {
      await new Promise((r) => setTimeout(r, 250));
      const lib = await fetch('http://localhost:' + port + '/')
        .then((r) => r.text()).catch(() => '');
      target = (lib.match(/href="\/read\/([^"]+)"/) || [])[1] || '';
    }
    if (!target) { bad('the watched studio starts', 'no response', 'the library'); return; }
    ok('the watched studio starts');
    eq('and does not carry the mark yet', (await get(20)).includes(MARK), false);

    await writeFile(file, before.replace('>Spreads</button>', '>Spreads</button>' + MARK));
    let served = '';
    for (let i = 0; i < 40 && !served.includes(MARK); i++) served = await get(2);
    eq('an edit to serve.mjs is served without a manual restart',
      served.includes(MARK), true);
  } finally {
    await writeFile(file, before);
    child.kill();
  }
}

console.log('Structure — the markup carries what the script needs:');
await checkStructure();
console.log('\nBehaviour — two classes, uneven subjects:');
await checkBehaviour();
console.log('\nArriving back from a chapter, with the choice already made:');
await checkArrival();
console.log('\nViewer — the zoom cluster the studio serves:');
await checkViewerStructure();
console.log('\nViewer — driving the real app.js against a stub book:');
await checkViewerBehaviour();
console.log('\nBuild — what it reports back to the bar:');
await checkBuildReport();
console.log('\nRestart — an edit to serve.mjs, without touching the process:');
await checkSelfRestart();

console.log();
if (failures) {
  console.log('  ' + failures + ' failure(s).');
  process.exit(1);
}
console.log('  all checks passed.');
