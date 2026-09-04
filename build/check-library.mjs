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
import { readFile, writeFile, readdir, mkdir, rm } from 'node:fs/promises';
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

    /* A card says how long the chapter is and not where it sits in the
       volume. The folio range was a second number saying almost the
       same thing, and it was the wrong one: a chapter's own first folio
       comes from its chapter.json and holds only until the book is
       bound, where --book renumbers the lot. */
    eq('a card counts its pages', /<span>\d+ pages?<\/span>/.test(html), true);
    eq('and does not print a folio range', /folios\s/.test(html), false);
    eq('nor a cover card its wrap size', /wrap \d/.test(html), false);
    /* A cover card names the book and says how thick it is. The folder
       it happens to live in is an address, not a fact about the wrap,
       and the card is already a link to it. */
    const coverCard = (html.match(/<a class="card" href="\/cover\/[\s\S]*?<\/a>/) || [])[0];
    if (coverCard) {
      const meta = (coverCard.match(/class="card__meta">([\s\S]*?)<\/div>/) || [])[1] || '';
      eq('a cover card carries one fact, the spine',
        (meta.match(/<span>/g) || []).length, 1);
      eq('and it is the spine', /<span>spine \d/.test(meta), true);
    }

    /* The back arrow means "back to the chapters", not "start over".
       It went to a bare "/", which opened on two empty dropdowns and
       made the reader choose the class and subject again to reach the
       list they had just left. */
    const first = (html.match(/href="\/read\/([^"]+)"/) || [])[1];
    const view = await fetch('http://localhost:' + port + '/read/' + first)
      .then((r) => r.text()).catch(() => '');
    eq('the chapter back link carries class and subject',
      /href="\/\?class=[^"]+&amp;subject=[^"]+"/.test(view), true);
    /* Named by their titles rather than by counting slashes: home is a
       bare "/" now, so "no bare slash on the page" would be asserting
       the opposite of what home has to be. */
    eq('the back link is not a bare slash',
      /href="\/"[^>]*title="Back to the chapters"/.test(view), false);
    eq('a home button beside it, and it is bare',
      /href="\/"[^>]*title="The library"/.test(view), true);
    eq('both are icons', (view.match(/class="btn btn--icon"/g) || []).length >= 2, true);
    /* Where you are, then what you are looking at — the class and the
       chapter above the title, not run together beside it. */
    eq('the label is stacked, class and chapter first',
      /class="bar__where">[\s\S]*?bar__sub[\s\S]*?bar__title/.test(view), true);
    eq('the chapter is named in caps',
      /class="bar__sub">Class \d+ &middot; CH \d+/.test(view), true);
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
   subject off the link it was opened with, and ignores a pair that
   no longer has a section rather than selecting nothing and looking
   broken. Same fixture, loaded once per row.

   The address is the only source. Nothing in the query means
   nothing chosen — the front door opens on the chooser, whatever
   was last looked at. */
const ARRIVALS = [
  /* The one that matters: storage holds class-9 + Mathematics and the
     front door still opens on the chooser. */
  ['a bare slash chooses nothing, whatever is remembered', '',
    { cls: '', sub: '', prompt: true, visible: [], seeded: true }],
  ['both carried', '?class=class-8&subject=Science',
    { cls: 'class-8', sub: 'Science', prompt: false,
      visible: ['class-8/Science'], seeded: true }],
  /* A cover's arrow can only carry the class, so the subject comes from
     what was last chosen — the one job storage still has. */
  ['class alone falls through to the remembered subject', '?class=class-9',
    { cls: 'class-9', sub: 'Mathematics', prompt: false,
      visible: ['class-9/Mathematics'], seeded: true }],
  // a class that has gone: ignored, not applied
  ['a pair that no longer exists', '?class=class-99&subject=Alchemy',
    { cls: '', sub: '', prompt: true, visible: [], seeded: true }],
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
      seeded: window.__seeded,
    });`;

  /* Storage is seeded before the chooser runs, and every row below is
     read against it. Without a value in there, "a bare / chooses
     nothing" would pass on an empty store and prove nothing — which is
     the exact failure it exists to catch. The rows report whether the
     seed took, so a browser that refuses storage fails loudly rather
     than passing vacuously. */
  const seed = `
    try {
      localStorage.setItem('ll.pick',
        JSON.stringify({ cls: 'class-9', sub: 'Mathematics' }));
      window.__seeded = localStorage.getItem('ll.pick') !== null;
    } catch (e) { window.__seeded = false; }`;

  const html = '<!doctype html><html><body>'
    + '<select id="pick-class"><option value="">Choose a class</option>'
    + '<option value="class-9">Class 9</option><option value="class-8">Class 8</option></select>'
    + '<select id="pick-subject" disabled><option value="">Choose a class first</option></select>'
    + FIXTURE_SETS
    + '<p id="lib-prompt"></p><p id="lib-empty" hidden></p>'
    + '<script>' + seed + '</' + 'script>'
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

    for (const id of ['zoom-out', 'zoom-in', 'zoom-level', 'fit-toggle']) {
      eq('#' + id + ' present', html.includes('id="' + id + '"'), true);
    }
    /* The level is typed. The menu of presets, Actual size and the
       bank-card calibration all went with it — a preset is a guess at
       what somebody wants, and a proof is read at whatever percentage
       makes one figure legible. */
    eq('the level is a field', /id="zoom-level"[^>]*type="text"/.test(html), true);
    eq('no preset menu', /id="zoom-menu"|data-zoom=/.test(html), false);
    eq('no calibration panel', /id="cal-/.test(html), false);
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
    /* Where the two switches live. Spreads is in the middle cluster,
       past the fit toggle — everything there changes how the book is
       laid out on the screen. Bleed is over on the right beside the
       download, because it changes which sheet you are looking at,
       which is the question that download answers. */
    eq('spreads sits in the cluster',
      /class="zoom"[\s\S]*?id="fit-toggle"[\s\S]*?id="view-spread"/.test(html), true);
    eq('bleed sits beside Print PDF',
      /id="sheet-bleed"[\s\S]{0,400}?Print PDF/.test(html), true);
    /* A measurement is a fact about the sheet, not a thing to press. */
    eq('bleed carries no measurement', /id="sheet-bleed"[\s\S]{0,400}?>Bleed<\/button>/.test(html), true);
    eq('the press size is in the tooltip', /title="Show the press sheet, \d/.test(html), true);
    eq('the build log ships hidden', /id="build-log"[^>]*hidden/.test(html), true);

    const covLink = (lib.match(/href="\/cover\/([^"]+)"/) || [])[1];
    if (covLink) {
      const cov = await get('http://localhost:' + port + '/cover/' + covLink);
      eq('cover viewer carries the same cluster',
        ['zoom-level', 'fit-toggle', 'zoom-out', 'zoom-in'].every((i) => cov.includes('id="' + i + '"')),
        true);
      /* And carries nothing else. The strip under the bar has gone from
         here too — the spine paragraph was standing advice, not a note
         about this wrap — and the subtitle is where you are and not how
         the jacket is specified: direction and finish are in
         cover.json, which is where they are set. */
      eq('no strip under the cover bar', cov.includes('class="note"'), false);
      eq('and no spine paragraph with it', /Spine \d+mm/.test(cov), false);
      eq('the cover subtitle is where you are, not how it is finished',
        /class="bar__sub">Class \d+ &middot; cover<\/span>/.test(cov), true);
      /* Both downloads are prints. "Press" and "proof" name the trade
         the file goes to, not the button a reader is looking for. */
      eq('the cover downloads are named for printing',
        [/>Print PDF</.test(cov), />Print PNG</.test(cov)], [true, true]);
      eq('and neither is still called a press or a proof',
        /Press PDF|Proof PNG/.test(cov), false);
      /* A wrap is two trims and a spine, better than twice as wide as
         a page, so it fits at its own level and not the book's. */
      eq('a cover declares itself to app.js', /"kind":"cover"/.test(cov), true);
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
    const lvl = () => $('zoom-level').value;   // a field now, not a button
    const R = {};
    R.opensAt = lvl();          // before anything is pressed
    $('zoom-in').click();  R.plus1 = lvl();
    $('zoom-in').click();  R.plus2 = lvl();
    $('zoom-out').click(); R.minus = lvl();
    /* Which icon is on show, measured from what is rendered rather than
       from any attribute. "hidden" is an IDL property of HTMLElement and
       an SVG element is not one, so setting svg.hidden leaves the
       attribute alone and only writes a JavaScript expando — the two
       icons came out inverted and a check that read .hidden back agreed
       with itself. The rectangle's own shape cannot lie.
       (No backticks in here: this comment lives inside a template
       literal, and one would end it.) */
    const fitIcon = () => {
      const btn = $('fit-toggle');
      const shown = [...btn.querySelectorAll('svg')]
        .find((s) => getComputedStyle(s).display !== 'none');
      if (!shown) return { icon: 'none', title: btn.title };
      const r = shown.querySelector('rect').getBoundingClientRect();
      return { icon: r.width > r.height ? 'landscape' : 'portrait', title: btn.title };
    };
    /* The level is a field now, so this is how a mode is reached from
       whatever the last check left behind: type a percentage, and the
       fit button returns to fit to page from anywhere that is not fit
       to width. */
    const typeLevel = (v) => {
      const box = $('zoom-level');
      box.value = String(v);
      box.dispatchEvent(new Event('change', { bubbles: true }));
      return box.value;
    };
    const toFitPage = () => { typeLevel(150); $('fit-toggle').click(); };

    toFitPage();
    R.fitPage = lvl();
    R.iconAtPage = fitIcon();

    /* Fit to page is 71% and does not measure anything, so it is 71% on
       a tall stage and on a short one alike — which is the point of it,
       and the only way to tell it apart from a measurement that happens
       to land near 71% on the fixture's stage. */
    const stg = $('stage'), keptH = stg.style.height;
    stg.style.height = '1400px'; toFitPage(); R.fitOnTall = lvl();
    stg.style.height = '260px';  toFitPage(); R.fitOnShort = lvl();
    stg.style.height = keptH;    toFitPage();

    /* The press sheet is larger than the trim, so it fits at a lower
       level — 66% against 71%, which keeps the page itself the same
       size on the screen as Bleed goes on and off. */
    $('sheet-bleed').click(); toFitPage(); R.fitOnBleed = lvl();
    $('sheet-bleed').click(); toFitPage(); R.fitBackOnTrim = lvl();

    $('fit-toggle').click(); R.fitWidth = lvl();
    R.iconAtWidth = fitIcon();
    $('fit-toggle').click(); R.backToPage = lvl();
    R.iconBack = fitIcon();

    /* Any number, not a choice from a list — which is the whole point
       of the field. A percentage sign is tolerated, nonsense puts the
       level back to what it was, and both ends clamp. */
    R.typedOdd = typeLevel(137);
    R.typedWithSign = typeLevel('42%');
    R.clampedHigh = typeLevel(900);
    R.clampedLow = typeLevel(1);
    R.nonsense = typeLevel('abc');
    R.hundred = typeLevel(100);

    /* ctrl with +, - and 0 — the browser's own zoom keys, answered here
       because the book is in an iframe. ctrl+0 was the one that went
       unchecked, and it was the one that broke: wired to the fit mode
       when that was what a chapter opened at, and left there when the
       default became 100%, so the key whose whole job is "put it back"
       put it somewhere else. */
    const ctrl = (k) => document.dispatchEvent(new KeyboardEvent('keydown',
      { key: k, ctrlKey: true, bubbles: true, cancelable: true }));
    typeLevel(137); ctrl('0'); R.ctrlZero = lvl();
    ctrl('=');                 R.ctrlPlus = lvl();
    ctrl('-');                 R.ctrlMinus = lvl();
    toFitPage(); ctrl('0');    R.ctrlZeroFromFit = lvl();

    // the ladder has ends, and the buttons must say so
    for (let i = 0; i < 24; i++) $('zoom-in').click();
    R.ceiling = lvl(); R.inDisabled = $('zoom-in').disabled;
    for (let i = 0; i < 40; i++) $('zoom-out').click();
    R.floor = lvl(); R.outDisabled = $('zoom-out').disabled;

    /* Back to fit to page before anything is asked about scrolling. The
       floor test above leaves the level at 10%, where the whole stub
       book is shorter than the stage and there is nothing to scroll —
       every keyboard assertion below would fail, and would look like a
       broken handler rather than a book that already fits. */
    toFitPage();

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
    /* And the box follows the scroll, not only a typed page number.
       At 100%, because at fit to page the whole of the stub's second
       page lies past the end of the scroll — the counter could never
       reach it, and the check would be asserting the impossible. */
    typeLevel(100);
    st.scrollTop = 0;
    let guard = 0;
    while ($('page-no').value === '1' && guard++ < 200) key('ArrowDown');
    R.boxFollowedAfter = guard < 200 ? $('page-no').value : 'never';
    toFitPage();
    // an arrow must not fire while the page number is being typed
    st.scrollTop = 0;
    $('page-no').focus();
    key('ArrowDown');
    R.notWhileTyping = st.scrollTop;
    $('page-no').blur();

    /* The arrows must work in every mode, and from the book's own
       document as well as this one — one click on the page moves focus
       into the iframe, and for a while everything after that went to a
       document listening for nothing.

       Synchronous on purpose: the handlers act at once, and a window
       that is not being painted throttles timers to about one a second,
       which turns a chain of awaits into a check that times out rather
       than a check that fails. */
    const send = (k, doc) => (doc || document).dispatchEvent(
      new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true }));
    const arrows = (doc) => {
      st.scrollLeft = 0; st.scrollTop = 0;
      const t0 = st.scrollTop; send('ArrowDown', doc);
      const down = st.scrollTop > t0;
      const t1 = st.scrollTop; send('ArrowUp', doc);
      const up = st.scrollTop < t1;
      st.scrollTop = 0;
      const p1 = $('page-no').value, l1 = st.scrollLeft; send('ArrowRight', doc);
      const right = $('page-no').value !== p1 || st.scrollLeft > l1;
      const p2 = $('page-no').value, l2 = st.scrollLeft; send('ArrowLeft', doc);
      const left = $('page-no').value !== p2 || st.scrollLeft < l2;
      return down && up && right && left;
    };
    const book = document.getElementById('frame').contentDocument;
    const inEveryMode = {};
    for (const [name, reach] of [
      ['fit page', toFitPage],
      ['fit width', () => { toFitPage(); $('fit-toggle').click(); }],
      ['200%', () => typeLevel(200)],
    ]) {
      reach();
      inEveryMode[name] = arrows() && arrows(book);
    }
    R.arrowsEverywhere = inEveryMode;

    /* And at the far edge of a zoomed page, right must turn the page
       rather than dead-end: it used to scroll sideways for ever the
       moment the content was wider than the stage. */
    typeLevel(200);
    st.scrollLeft = st.scrollWidth;
    const edge = $('page-no').value; send('ArrowRight');
    R.turnsAtTheEdge = $('page-no').value !== edge;
    toFitPage();

    document.title = 'R' + JSON.stringify(R);`;

  /* The bar has three parts and the middle one is centred by the grid,
     so the fixture has to carry all three — with sides of deliberately
     unequal width, since equal ones would centre under a flex row with
     spacers too and prove nothing. */
  const fixture = (theCfg, theDriver) =>
    '<!doctype html><html><head><style>' + css + '</style></head><body>'
    + '<div class="viewer"><div class="bar">'
    + '<div class="bar__side">'
    + '<a class="btn btn--icon">h</a><a class="btn btn--icon">b</a>'
    + '<span class="bar__where"><span class="bar__sub">Class 9 &middot; CH 7</span>'
    + '<span class="bar__title">A Long Chapter Title</span></span></div>'
    + bar
    + '<div class="bar__side bar__side--end">'
    /* The real id, so the sheet switch is wired: the two sheets fit at
       different levels and nothing could have told them apart while
       this was a dummy button. */
    + '<button class="btn" id="sheet-bleed" aria-pressed="false">Bleed</button>'
    + '<a class="btn">Print PDF</a><button class="btn btn--go">Build</button></div>'
    + '</div>'
    + '<div class="stage" id="stage" style="width:900px;height:700px">'
    + '<div class="stage__inner" id="inner">'
    + '<iframe id="frame" scrolling="no"></iframe></div></div></div>'
    + '<button id="build"></button><span id="build-log" hidden></span>'
    + '<script type="application/json" id="cfg">' + JSON.stringify(theCfg) + '</' + 'script>'
    + '<script>' + script + '</' + 'script>'
    + '<script>addEventListener("load", () => setTimeout(() => {' + theDriver + '}, 300));</' + 'script>'
    + '</body></html>';

  /* One run of the fixture, named so a failure to start says which. */
  const drive = async (name, theCfg, theDriver) => {
    const file = path.join(dir, name + '-fixture.html');
    await writeFile(file, fixture(theCfg, theDriver));
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
    const found = stdout.match(/<title>R([\s\S]*?)<\/title>/);
    if (!found) { bad(name + ' fixture ran', 'no result in the dom', 'the driver output'); return null; }
    return JSON.parse(found[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'));
  };

  const R = await drive('viewer', cfg, driver);

  /* The same app.js against a cover's cfg. A wrap is two trims and a
     spine — better than twice as wide as a page — so fit to page is
     its own number there, and the only thing that tells app.js which
     book it is showing is cfg.kind. Driven rather than read off the
     source, because "the constant says 0.66" is not the same claim as
     "the field reads 66% when the button is pressed". */
  const C = await drive('cover', { ...cfg, kind: 'cover' }, `
    const $ = (id) => document.getElementById(id);
    const lvl = () => $('zoom-level').value;
    const R = {};
    R.opensAt = lvl();
    $('fit-toggle').click();          // a percentage returns to fit to page
    R.fitPage = lvl();
    $('sheet-bleed').click(); R.fitOnBleed = lvl();
    document.title = 'R' + JSON.stringify(R);`);

  await rm(dir, { recursive: true, force: true });
  if (!R || !C) return;

  const pc = (s) => Number(String(s).replace('%', ''));
  /* A chapter opens at the size the stylesheet says, and the fit button
     gives 71% — a fixed size rather than whatever the window makes of
     it, since the same book coming up at 46% on one screen and 116% on
     another is not a proof of anything. */
  eq('a chapter opens at 100%', R.opensAt, '100%');
  eq('fit to page is 71%', R.fitPage, '71%');
  eq('71% on a tall stage and a short one alike',
    [R.fitOnTall, R.fitOnShort], ['71%', '71%']);
  eq('and 66% on the press sheet, which is the larger one',
    [R.fitOnBleed, R.fitBackOnTrim], ['66%', '71%']);
  /* A cover opens at 100% like everything else, and fits at its own
     number: 66%, on either sheet, because a wrap is wide enough that
     the page's 71% would put half of it past the edge of the stage. */
  eq('a cover opens at 100% too', C.opensAt, '100%');
  eq('but fits to page at 70%, not the book’s 71%', C.fitPage, '70%');
  eq('and drops to 62% on the press sheet', C.fitOnBleed, '62%');
  eq('fit to width is wider than fit to page', pc(R.fitWidth) > pc(R.fitPage), true);
  eq('plus steps up the ladder', pc(R.plus2) > pc(R.plus1) && pc(R.plus1) > pc(R.fitPage), true);
  eq('minus steps back', R.minus, R.plus1);
  eq('the fit toggle returns', R.backToPage, R.fitPage);
  /* The button shows the mode it is in, and the tooltip says the same
     thing the picture does. */
  eq('fit to page shows an upright sheet',
    R.iconAtPage, { icon: 'portrait', title: 'Fit to page — click for fit to width' });
  eq('fit to width shows a wide one',
    R.iconAtWidth, { icon: 'landscape', title: 'Fit to width — click for fit to page' });
  eq('and the icon comes back with the mode', R.iconBack, R.iconAtPage);
  /* Any number, not a choice from a list. 137 is the point of the
     whole change: it was never going to be on a menu. */
  eq('any percentage can be typed', R.typedOdd, '137%');
  eq('a percent sign is tolerated', R.typedWithSign, '42%');
  eq('too high clamps', R.clampedHigh, '500%');
  eq('too low clamps', R.clampedLow, '10%');
  eq('nonsense puts the level back', R.nonsense, '10%');
  eq('and a round number still works', R.hundred, '100%');
  /* Reset means 100%, from a typed level and from a fit alike. */
  eq('ctrl+0 resets to 100%', R.ctrlZero, '100%');
  eq('ctrl+0 resets from fit to page too', R.ctrlZeroFromFit, '100%');
  eq('ctrl+plus steps up from there', R.ctrlPlus, '110%');
  eq('ctrl+minus steps back', R.ctrlMinus, '100%');
  eq('the buttons have a ceiling', [R.ceiling, R.inDisabled], ['500%', true]);
  eq('the buttons have a floor', [R.floor, R.outDisabled], ['10%', true]);
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
  /* Every mode, and from the book's document as well as the studio's. */
  eq('the arrows work in every mode, from either document',
    R.arrowsEverywhere, { 'fit page': true, 'fit width': true, '200%': true });
  eq('right turns the page at the far edge rather than dead-ending',
    R.turnsAtTheEdge, true);
}

/* ---- 4b. The foot of a card -------------------------------
   Every card in the grid must put its page count and its flags at
   the same height, so that the two are read across the grid rather
   than card by card. Two titles decide it: "Orienting Yourself: The
   Use of Coordinates" takes two lines and "What Comes Next" takes
   one, and before the title reserved two lines the foot of the short
   card sat a line above the foot of the long one.

   Measured from the rendered boxes and not from the CSS. A
   min-height that a later rule overrides still reads back as set,
   and only the geometry can say where the line actually fell. The
   cards are the ones the studio serves, lifted out of the library
   page, so this cannot go on passing against markup that has since
   changed shape. */
async function checkCardFeet() {
  if (!CHROME) return;                       // already reported by checkBehaviour
  const port = freePort();
  const child = spawn(process.execPath, ['build/serve.mjs'],
    { cwd: ROOT, env: { ...process.env, PORT: String(port), NO_WATCH: '1' }, stdio: 'ignore' });
  const dir = p('build', '_check');
  try {
    let lib = '';
    for (let i = 0; i < 60 && !lib; i++) {
      await new Promise((r) => setTimeout(r, 200));
      lib = await fetch('http://localhost:' + port + '/')
        .then((r) => r.text()).catch(() => '');
    }
    if (!lib) { bad('the library for its cards', 'no response', 'the library page'); return; }

    const cards = lib.match(/<a class="card"[\s\S]*?<\/a>/g) || [];
    if (cards.length < 2) {
      bad('two cards to compare', cards.length + ' card(s)', 'at least two'); return;
    }

    const css = await readFile(p('build', 'ui', 'app.css'), 'utf8');
    const driver = `
      const feet = [...document.querySelectorAll('.card')].map((c) => {
        const top = c.getBoundingClientRect().top;
        const at = (sel) => Math.round(
          c.querySelector(sel).getBoundingClientRect().top - top);
        return at('.card__meta') + ':' + at('.card__flags');
      });
      document.title = 'R' + JSON.stringify({
        cards: feet.length, distinct: [...new Set(feet)],
      });`;

    await mkdir(dir, { recursive: true });
    const file = path.join(dir, 'card-fixture.html');
    await writeFile(file,
      '<!doctype html><html><head><style>' + css + '</style></head><body>'
      + '<div class="wrap"><div class="grid">' + cards.join('') + '</div></div>'
      + '<script>' + driver + '</' + 'script></body></html>');

    const { stdout } = await run(CHROME, [
      '--headless=new', ...SANDBOX, '--disable-gpu', '--hide-scrollbars',
      '--window-size=1280,1600', '--virtual-time-budget=4000', '--dump-dom',
      'file:///' + file.replace(/\\/g, '/'),
    ], { maxBuffer: 1 << 24 });
    const raw = stdout.match(/<title>R([\s\S]*?)<\/title>/);
    if (!raw) { bad('card fixture ran', 'no result in the dom', 'the driver output'); return; }
    const R = JSON.parse(raw[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'));

    eq('the whole library was measured', R.cards, cards.length);
    eq('every card puts its foot at the same height', R.distinct.length, 1);
  } finally {
    child.kill();
    await rm(dir, { recursive: true, force: true });
  }
}

/* ---- 4c. The press sheet a cover prints on -----------------
   Two things had to be true here and neither was.

   The wrap is 2 trims + a spine, and it bleeds 15mm rather than the
   page's 3, because it is folded round the board and what turns in
   has to be ink. That arithmetic was written out three times — in
   sheet.mjs, in cover.mjs and again in serve.mjs — and the studio's
   copy used the page's bleed and forgot the slug, so it sized a
   437mm sheet to 399 and the jacket was squeezed to fit it.

   And the marks are laid over the stage by inset:0 with a viewBox in
   millimetres, which is only 1mm to the millimetre while the stage is
   the sheet. It was as wide as whatever window it was opened in.

   Both are geometry, so both are measured: the marks are checked
   against the trim they mark, in the rendered document, and a mark
   that has drifted cannot report otherwise. */
async function checkCoverSheet() {
  if (!CHROME) return;                       // already reported by checkBehaviour
  const built = p('build', 'covers');
  const found = [];
  for (const cls of await readdir(built).catch(() => [])) {
    for (const f of await readdir(path.join(built, cls)).catch(() => [])) {
      if (f.endsWith('-bleed.html')) found.push(path.join(built, cls, f));
    }
  }
  if (!found.length) { ok('no built press sheet to measure — skipped'); return; }

  const driver = `
    const stage = document.querySelector('.cover-stage');
    const svg = document.querySelector('.cropmarks');
    const jacket = document.querySelector('.jacket');
    const MM = 96 / 25.4, mm = (v) => Math.round(v / MM * 100) / 100;
    const sr = stage.getBoundingClientRect();
    const vr = svg.getBoundingClientRect();
    const jr = jacket.getBoundingClientRect();
    const box = svg.getAttribute('viewBox').split(' ').map(Number);
    /* The trim, from the jacket the marks are meant to mark: on the
       press sheet the jacket is the trim plus one bleed all round. */
    const bleed = parseFloat(getComputedStyle(jacket).getPropertyValue('--bleed'));
    const L = mm(jr.left - vr.left) + bleed, T = mm(jr.top - vr.top) + bleed;
    const R = mm(jr.right - vr.left) - bleed, B = mm(jr.bottom - vr.top) - bleed;
    const near = (a, b) => Math.abs(a - b) < 0.4;
    const lines = [...svg.querySelectorAll('line')].map((l) => {
      const r = l.getBoundingClientRect();
      return {
        x: mm(r.left - vr.left), y: mm(r.top - vr.top),
        w: mm(r.width), h: mm(r.height),
      };
    });
    document.title = 'R' + JSON.stringify({
      marks: lines.length,
      /* The stage is the sheet, and the marks are laid over the stage,
         so both have to be the size the viewBox says. */
      sheetIsSheet: near(mm(sr.width), box[2]) && near(mm(sr.height), box[3]),
      marksAreSheet: near(mm(vr.width), box[2]) && near(mm(vr.height), box[3]),
      /* Every mark on a trim or a fold line. A horizontal one marks the
         head or the foot, a vertical one marks a cut or a crease. */
      onALine: lines.every((m) => m.w > m.h
        ? near(m.y, T) || near(m.y, B)
        : near(m.x, L) || near(m.x, R)
          || (m.x > L && m.x < R)),        // the two folds, either side of the spine
      /* And every one of them clear of the artwork: the jacket runs to
         the bleed, so a mark that touches it will print. */
      clearOfArt: lines.every((m) => {
        const r = { l: m.x, t: m.y, r: m.x + m.w, b: m.y + m.h };
        const j = { l: mm(jr.left - vr.left), t: mm(jr.top - vr.top),
                    r: mm(jr.right - vr.left), b: mm(jr.bottom - vr.top) };
        return r.r <= j.l + 0.01 || r.l >= j.r - 0.01
            || r.b <= j.t + 0.01 || r.t >= j.b - 0.01;
      }),
    });`;

  const file = found[0];
  const html = await readFile(file, 'utf8');
  const probe = file.replace(/-bleed\.html$/, '-bleed-probe.html');
  await writeFile(probe, html.replace('</body>',
    '<script>addEventListener("load", () => setTimeout(() => {'
    + driver + '}, 200));</' + 'script></body>'));
  try {
    const { stdout } = await run(CHROME, [
      '--headless=new', ...SANDBOX, '--disable-gpu', '--hide-scrollbars',
      '--allow-file-access-from-files',
      /* Deliberately not the sheet's own width. The stage used to be
         as wide as the window, and at 1600px it would have looked
         right at whatever size that happened to make it. */
      '--window-size=1600,1200', '--virtual-time-budget=5000', '--dump-dom',
      'file:///' + probe.replace(/\\/g, '/'),
    ], { maxBuffer: 1 << 24 });
    const raw = stdout.match(/<title>R([\s\S]*?)<\/title>/);
    if (!raw) { bad('the press sheet rendered', 'no result in the dom', 'the driver output'); return; }
    const R = JSON.parse(raw[1].replace(/&quot;/g, '"').replace(/&amp;/g, '&'));

    /* Eight corners and four folds: a wrap is creased either side of
       the spine and a printer cannot guess where. */
    eq('twelve marks — eight corners and four folds', R.marks, 12);
    eq('the stage is the press sheet, whatever the window',
      R.sheetIsSheet, true);
    eq('and the marks are laid over exactly that', R.marksAreSheet, true);
    eq('every mark sits on a trim or a fold line', R.onALine, true);
    eq('and none of them touches the artwork', R.clearOfArt, true);
  } finally {
    await rm(probe, { force: true });
  }
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
console.log('\nCards — where the foot of each one sits:');
await checkCardFeet();
console.log('\nCover — the press sheet, and the marks on it:');
await checkCoverSheet();
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
