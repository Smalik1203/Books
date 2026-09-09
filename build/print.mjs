/* Print a built chapter to PDF with headless Chrome — the same route
   Chapter 4 took (its PDF reports Skia/Chrome as producer).

   The page size comes from @page in page.css, not from a flag, so the
   trim is whatever tokens.css says it is.

   Served over HTTP rather than file://, so the relative paths to
   styles/, fonts/ and the KaTeX vendor directory resolve exactly as
   they do in the browser.
*/
import { spawn } from 'node:child_process';
import { mkdir, access } from 'node:fs/promises';
import { join, resolve } from 'node:path';

const ROOT = resolve(new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1'));
const chapter = process.argv[2] || 'ch05';
const port = Number(process.argv[3]) || 4399;

const CHROME = [
  process.env.CHROME,
  process.env.CHROME_PATH,
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
];
// Chrome refuses to start its sandbox as root, which is how a CI
// container usually runs. Only then is the flag added.
const SANDBOX = process.getuid?.() === 0 ? ['--no-sandbox'] : [];

async function findChrome() {
  for (const p of CHROME) {
    try { await access(p); return p; } catch {}
  }
  throw new Error('Chrome not found');
}

const run = (cmd, args, opts = {}) =>
  new Promise((res, rej) => {
    const c = spawn(cmd, args, { stdio: 'inherit', ...opts });
    c.on('error', rej);
    c.on('exit', (code) => (code === 0 ? res() : rej(new Error(`exit ${code}`))));
  });

await mkdir(join(ROOT, 'out'), { recursive: true });

// Serve the tree for the duration of the print.
const server = spawn(process.execPath, [join(ROOT, 'build', 'serve.mjs'), String(port)], {
  stdio: 'ignore',
});
await new Promise((r) => setTimeout(r, 400));

try {
  const out = join(ROOT, 'out', `${chapter}.pdf`);
  await run(await findChrome(), [
    '--headless=new', ...SANDBOX,
    '--disable-gpu',
    '--no-sandbox',
    '--no-pdf-header-footer',
    // give webfonts and KaTeX time to settle before the snapshot
    '--virtual-time-budget=10000',
    `--print-to-pdf=${out}`,
    `http://localhost:${port}/chapters/${chapter}/index.html`,
  ]);
  console.log(`printed -> ${out}`);
} finally {
  server.kill();
}
