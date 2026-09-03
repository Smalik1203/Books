/* ============================================================
   How much taller a Chrome window is than the viewport inside it.

   --window-size sizes the WINDOW, and the window carries chrome of
   its own whose height is that build of Chrome's business, not
   ours. Ask for a 297mm window and this one lays the page out in a
   viewport 23mm shorter — and a proof captured that way loses the
   foot of the sheet: on a page, the folio and any overrun; on a
   cover, the whole bottom bleed. Which is what a proof is for.

   So the difference is measured once and added back, and the extra
   strip is cut off the capture afterwards with png.mjs's
   cropHeight. Both builders need it — the page proofs in
   build.mjs and the wrap proof in cover.mjs — and a padding
   measured in two places is a padding that will differ, so it
   lives here. It was in build.mjs alone for a while, which is why
   every cover proof ever rendered was short at the foot.
   ============================================================ */
import { writeFile, rm, mkdir } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// Chrome refuses to start its sandbox as root, which is how a CI
// container usually runs. Only then is the flag added.
const SANDBOX = process.getuid?.() === 0 ? ['--no-sandbox'] : [];

let cached = null;

export async function windowPad(chrome) {
  if (cached !== null) return cached;
  const probe = path.join(ROOT, 'build', '_viewport-probe.html');
  await mkdir(path.dirname(probe), { recursive: true });
  await writeFile(probe, '<html><head><script>addEventListener("load", function () '
    + '{ document.title = "V" + innerHeight; });<' + '/script></head><body></body></html>');
  const { stdout } = await run(chrome, [
    '--headless=new', ...SANDBOX, '--disable-gpu', '--hide-scrollbars',
    '--window-size=800,1000', '--virtual-time-budget=2000', '--dump-dom',
    'file:///' + probe.replace(/\\/g, '/'),
  ], { maxBuffer: 1 << 20 }).catch(() => ({ stdout: '' }));
  await rm(probe, { force: true });
  const seen = Number(stdout.match(/<title>V(\d+)<\/title>/)?.[1]);
  /* A probe that does not report used to return 0, which is the
     unpadded window this file exists to stop anyone asking for —
     and it did it silently, so a run of short proofs looked like a
     run of good ones. Say so instead. */
  if (!seen) {
    console.warn('    ! could not measure the window padding —'
      + ' proofs may be short at the foot of the sheet');
    cached = 0;
    return cached;
  }
  cached = 1000 - seen;
  return cached;
}
