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
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
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

console.log('Structure — the markup carries what the script needs:');
await checkStructure();
console.log('\nBehaviour — two classes, uneven subjects:');
await checkBehaviour();

console.log();
if (failures) {
  console.log('  ' + failures + ' failure(s).');
  process.exit(1);
}
console.log('  all checks passed.');
