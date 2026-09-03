/* ============================================================
   The sheet: how big a page is, in millimetres and in pixels.

   Read from the tokens rather than repeated here, so the page box
   Chrome is told to print can never drift from the box the
   stylesheet lays the book out in.

   This lived in build.mjs, and the three measuring tools beside it
   — check-labels, fit-options, gaps — each carried the trim as a
   pair of pixel literals instead (794 x 1123, the A4 sheet at
   96dpi, with a branch beside it for the original trim). That was
   survivable while
   the standard trim never moved. It moved. A tool measuring a
   Crown Quarto chapter in an A4 window sees a wider column than
   the book has, finds no collision and no overflow, and reports
   a clean chapter that is not clean. So the trim is read here,
   once, by everything that needs it.
   ============================================================ */
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const MM_TO_PX = 96 / 25.4;               // CSS px per mm
export const px = (mm) => Math.round(mm * MM_TO_PX);

/* One declaration out of a stylesheet, by name.

   This was an indexOf and a pair of offsets, which had two faults
   a token reader cannot afford. It matched the name anywhere, so
   --bleed also matched the --jk-bleed declared eight lines below
   it and only the order of the file kept the press sheet at 3mm
   rather than 15. And a name that was not there at all indexed
   from -1 and returned thirty characters of whatever happened to
   sit at the top of the file, which parseFloat read as NaN and
   passed on to @page as "NaNmm". So the name is anchored, and the
   value is the declaration, not a fixed-width window over it. */
const declared = (css, name) => {
  const m = css.match(new RegExp('(?:^|[\\s;{])--' + name + '\\s*:\\s*([^;}]+)'));
  return m ? m[1].trim() : null;
};

/* A reader for one token, following the cascade an edition sets up:
   tokens.css holds the standard trim, an edition sheet overrides
   only what its size changes, and a name the edition does not
   mention falls through to the standard.

   An unknown name throws. Everything downstream turns what this
   returns into a millimetre, and a millimetre that is quietly NaN
   prints a sheet nobody asked for. Where a token is genuinely
   optional, ask for it with .opt() and handle the null. */
export async function tokenReader(root = ROOT, edition) {
  const src = await readFile(path.join(root, 'css', 'tokens.css'), 'utf8');
  const over = edition
    ? await readFile(path.join(root, 'css', 'edition-' + edition + '.css'), 'utf8').catch(() => '')
    : '';
  // an edition sheet wins, exactly as the cascade would have it
  const look = (name) => declared(over, name) ?? declared(src, name);
  const read = (name) => {
    const v = look(name);
    if (v === null) throw new Error(`no token --${name} in css/tokens.css`
      + (edition ? ` or css/edition-${edition}.css` : ''));
    return v;
  };
  read.opt = look;
  return read;
}

export async function sheetMetrics(root = ROOT, edition) {
  const raw = await tokenReader(root, edition);
  const mm = (name) => parseFloat(raw(name));
  const trimW = mm('trim-w'), trimH = mm('trim-h');
  const bleed = mm('bleed'), slug = mm('slug');
  const out = bleed + slug;
  return {
    trimW, trimH, bleed, slug,
    mediaW: trimW + 2 * out,
    mediaH: trimH + 2 * out,
  };
}

/* The window a probe should measure a page in. Width is the trim,
   because that is what sets the column; height is the caller's
   business — a probe that reads the whole flow wants a tall window,
   a probe that reads one page wants the sheet. */
export async function trimPx(edition) {
  const s = await sheetMetrics(ROOT, edition);
  return { w: px(s.trimW), h: px(s.trimH) };
}
