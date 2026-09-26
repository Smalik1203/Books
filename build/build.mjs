#!/usr/bin/env node
/* ============================================================
   LearnLab B5 Maths — chapter builder

     node build/build.mjs class-9/ch01-number-systems
     node build/build.mjs class-9/ch01-number-systems --pdf
     node build/build.mjs class-9 --pdf          (whole class)

   What it does:
     1. reads chapter.json for the chapter's metadata
     2. concatenates the page fragments in pages/<class>/<chapter>/
     3. stamps running heads, folios, and recto/verso on each page
     4. pre-renders every $...$ and $$...$$ with KaTeX, so the
        output HTML is fully static — no JS in the PDF
     5. writes build/<class>/<chapter>.html
     6. with --pdf, prints it through headless Chrome
   ============================================================ */

import { readFile, writeFile, readdir, mkdir, rm } from 'node:fs/promises';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import katex from 'katex';
import { cropHeight } from './png.mjs';
import { windowPad } from './viewport.mjs';
import { tokenReader, sheetMetrics, px, onA4 } from './sheet.mjs';
import { volumeName } from './volume.mjs';
import { scienceContract } from './science-contract.mjs';
import {hasContentImage} from './science-page-illustrations.mjs';

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = (...parts) => path.join(ROOT, ...parts);

/* ---- Chrome ---------------------------------------------- */
const CHROME_CANDIDATES = [
  process.env.CHROME,
  process.env.CHROME_PATH,
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];
const findChrome = () => CHROME_CANDIDATES.find(c => c && existsSync(c));
// Chrome refuses to start its sandbox as root, which is how a CI container
// usually runs. Only then is the flag added — never on a developer machine.
const SANDBOX = process.getuid?.() === 0 ? ['--no-sandbox'] : [];


/* ---- Maths ------------------------------------------------
   Replace display maths first, then inline. Anything inside a
   <code> or <pre> block is left alone. A malformed expression is
   rendered as a visible error rather than silently dropped. */
function renderMath(html) {
  let errors = 0;
  const tex = (src, display) => {
    // A collapsed escape (a backslash lost in transit, so \times arrives as
    // a literal tab) still parses as valid TeX and renders as plausible
    // nonsense. Catch that before it can ship. Newlines are NOT flagged:
    // maths legitimately wraps across source lines. A tab is flagged only
    // when a letter follows it, which is what a collapsed command looks like.
    const collapsed = /[\f\v\0]/.test(src) || /[\t\b][a-zA-Z]/.test(src);
    if (collapsed) {
      errors++;
      console.warn(`    ! collapsed escape in maths: ${JSON.stringify(src.slice(0, 60))}`);
      return `<span class="math-error">${src.replace(/[\t\f\v\b\0]/g, "?")}</span>`;
    }
    // A backslash eaten outright leaves the command name behind as ordinary
    // letters: \dfrac arrives as `dfrac`, which KaTeX typesets happily as a
    // product of variables. Text inside \text{...} is exempt, since ordinary
    // English there may contain these words.
    const probe = src.replace(/\\text\{[^{}]*\}/g, "");
    const bare = probe.match(/(?<![\\A-Za-z])(d?frac|tfrac|sqrt|text|left|right|times|cdot|neq|quad)(?![A-Za-z])/);
    if (bare) {
      errors++;
      console.warn(`    ! missing backslash before "${bare[1]}" in maths: ${JSON.stringify(src.slice(0, 60))}`);
      return `<span class="math-error">${src.trim()}</span>`;
    }

    try {
      return katex.renderToString(src.trim(), {
        displayMode: display,
        throwOnError: true,
        strict: false,
        trust: false,
      });
    } catch (e) {
      errors++;
      console.warn(`    ! math error: ${src.trim().slice(0, 60)} — ${e.message.split('\n')[0]}`);
      return `<span class="math-error">${src.trim()}</span>`;
    }
  };

  // Protect code spans
  const stash = [];
  html = html.replace(/<(code|pre)\b[\s\S]*?<\/\1>/g, m => {
    stash.push(m);
    return `\u0000CODE${stash.length - 1}\u0000`;
  });

  html = html.replace(/\$\$([\s\S]+?)\$\$/g, (_, src) => tex(src, true));
  html = html.replace(/(^|[^\\$])\$(?!\s)((?:[^$\\]|\\.)+?)\$/g, (_, pre, src) => pre + tex(src, false));
  html = html.replace(/\\\$/g, '$');

  html = html.replace(/\u0000CODE(\d+)\u0000/g, (_, i) => stash[+i]);

  // Any "$" still standing was never paired. Left alone it silently eats
  // text up to the next "$", which may be on another page entirely.
  // The usual cause is an opening delimiter followed by a space.
  const leftover = (html.match(/\$/g) || []).length;
  if (leftover) {
    errors += leftover;
    for (const m of html.matchAll(/.{0,40}\$.{0,40}/g)) {
      console.warn(`    ! unpaired $ near: ${JSON.stringify(m[0].replace(/<[^>]*>/g, ''))}`);
    }
  }

  return { html, errors };
}

/* ---- Stylesheet lint ---------------------------------------
   Every font-size must come from the scale. An em value is
   allowed for the optical corrections KaTeX needs, and the
   diagram calc() converts a printed millimetre height into
   viewBox units — everything else is a literal, and a literal
   is how a type scale quietly stops being one. */
async function lintStylesheets(root) {
  const dir = path.join(root, 'css');
  const bad = [];
  for (const name of (await readdir(dir)).filter(n => n.endsWith('.css'))) {
    if (name === 'fonts.css') continue;
    const src = await readFile(path.join(dir, name), 'utf8');
    src.split(/\r?\n/).forEach((line, i) => {
      const m = line.match(/font-size:\s*([^;}]+)/);
      if (!m) return;
      const v = m[1].trim();
      const scaled = new RegExp("^calc\\(\\s*var\\(--size-[a-z]+\\)\\s*\\*\\s*[0-9.]+\\s*\\)$");
      const ok = v.startsWith("var(--size-")   // straight from the scale
        || scaled.test(v)                      // a scale token times a factor
        || v.includes("--dg-type")             // printed mm, converted per figure
        || /^[0-9.]+em$/.test(v);              // an optical nudge, relative
      if (!ok) bad.push(`${name}:${i + 1}: font-size ${v} is off the scale`);
    });
  }
  for (const b of bad) console.error('    x ' + b);
  return bad.length;
}

/* A class in a page file that no stylesheet defines does nothing —
   and does it silently. That is how a derivation ended up rendered
   as one run-on line, and how three exercise lists kept the class
   names they had before the components were renamed. */
async function lintClasses(root, pageFiles) {
  const cssDir = path.join(root, 'css');
  const defined = new Set();
  for (const name of (await readdir(cssDir)).filter(n => n.endsWith('.css'))) {
    const src = await readFile(path.join(cssDir, name), 'utf8');
    for (const m of src.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) defined.add(m[1]);
  }
  const bad = [];
  for (const file of pageFiles) {
    const src = await readFile(file, 'utf8');
    const seen = new Set();
    for (const m of src.matchAll(/class="([^"]*)"/g)) {
      for (const c of m[1].split(/\s+/)) if (c && !defined.has(c)) seen.add(c);
    }
    for (const c of seen) bad.push(`${path.basename(file)}: class "${c}" is not defined in any stylesheet`);
  }
  for (const b of bad) console.error('    x ' + b);
  return bad.length;
}

/* ---- Figure scale ------------------------------------------
   A diagram's type is specified in printed millimetres, but SVG
   text is measured in viewBox units — and a unit is a different
   physical size in every figure. Stamp each figure with its
   viewBox width and its printed width so diagram.css can convert.
   Without this a label set once prints anywhere from 5pt to 10pt. */
/* The printed widths come from the same tokens the stylesheet
   lays the figure out with — and from the edition's sheet when
   there is one, exactly as the cascade would have it. Repeating
   them here is what once set every label in the A4 book 6% small:
   the table held the B5 numbers. --fig-full resolves through
   --measure, so it is followed rather than parsed. */
async function figWidths(root, edition) {
  const token = await tokenReader(root, edition);
  const w = {};
  for (const step of ['sm', 'md', 'lg', 'xl', 'full']) {
    const raw = token('fig-' + step);
    w[step] = /var\(\s*--measure/.test(raw) ? parseFloat(token('measure')) : parseFloat(raw);
  }
  return w;
}

function stampFigureScale(html, figMM) {
  const re = /class="[^"]*c-figure--(sm|md|lg|xl|full)[^"]*"/g;
  const edits = [];
  let m;
  while ((m = re.exec(html))) {
    const stop = html.indexOf('</figure>', m.index);
    const svg = html.indexOf('<svg', m.index);
    if (svg < 0 || (stop >= 0 && svg > stop)) continue;   // an image, not a drawing
    const close = html.indexOf('>', svg);
    const vb = html.slice(svg, close).match(/viewBox="\s*[-\d.]+\s+[-\d.]+\s+([\d.]+)/);
    if (!vb) continue;
    edits.push({ at: svg + 4, text: ` style="--dg-v:${vb[1]};--dg-w:${figMM[m[1]]}"` });
  }
  let out = html;
  for (const e of edits.reverse()) out = out.slice(0, e.at) + e.text + out.slice(e.at);
  return out;
}

/* The wrappers stampPages opened are closed here, and the marks
   hung outside the bleed box so clipping cannot reach them. */
function closePages(body, marks = "") {
  return body.split("</section>").join("</div></div>" + marks + "</section>");
}

/* ---- Sheet metrics ----------------------------------------
   tokenReader and sheetMetrics live in build/sheet.mjs, because
   the tools that measure a chapter need the same trim this one
   prints it at. */

/* Crop marks: eight hairlines in the slug, each running from the
   bleed edge outward, so none of them can cross artwork. The
   viewBox is in millimetres to keep the arithmetic readable. */
/* On the A4 proof (sheet.mjs, onA4) the side slug is 4mm and an office
   printer cannot reach the outer 4mm or so of the paper, so a mark kept
   out of the bleed would never print. There each mark runs from 0.5mm
   off the trim right out to the paper's edge, crossing the bleed: the
   printer draws whatever part of it lies inside its margin, and the
   bleed it crosses is cut away with the slug. */
function cropMarks(m) {
  const ox = m.bleed + (m.slugX ?? m.slug);   // trim origin within the sheet
  const oy = m.bleed + (m.slugY ?? m.slug);
  const R = ox + m.trimW, B = oy + m.trimH;
  const gap = m.a4 ? 0.5 : m.bleed;
  const lx = m.a4 ? ox - gap : 5, ly = m.a4 ? oy - gap : 5;
  const l = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  return `<svg class="cropmarks${m.a4 ? ' cropmarks--a4' : ''}" viewBox="0 0 ${m.mediaW} ${m.mediaH}" aria-hidden="true">`
    + l(ox - gap - lx, oy, ox - gap, oy) + l(ox, oy - gap - ly, ox, oy - gap)
    + l(R + gap, oy, R + gap + lx, oy) + l(R, oy - gap - ly, R, oy - gap)
    + l(ox - gap - lx, B, ox - gap, B) + l(ox, B + gap, ox, B + gap + ly)
    + l(R + gap, B, R + gap + lx, B) + l(R, B + gap, R, B + gap + ly)
    + `</svg>`;
}

/* Both sets of marks go on every page when an A4 proof is wanted; the
   body class decides which one shows. */
const marksFor = (sheet) => cropMarks(sheet) + (wantA4 ? cropMarks(onA4(sheet)) : '');

/* The A4 proof's sheet box and bleed box, written into the shell beside
   its @page rule — page.css sizes them from one --slug, and this sheet
   has a different slug on each axis. */
const a4Style = (s) => s && s.a4
  ? `body.bleed .page { width: ${s.mediaW}mm; height: ${s.mediaH}mm; }`
    + ` body.bleed .page__bleed { inset: ${s.slugY}mm ${s.slugX}mm; }`
  : '';

/* ---- Page stamping ---------------------------------------
   Each fragment supplies only its own content. The builder adds
   the furniture: recto/verso class, running head, folio. */
function stampPages(body, meta) {
  let folio = meta.startFolio ?? 1;

  /* maths-v2 splits the running head across the spread, as a book
     does: the verso names the chapter and the recto names the section
     the reader is in. So each page needs the section in force at its
     top — the one it opens on, or else the last one begun before it. */
  const v2 = meta.design === 'maths-v2';
  const sectionAt = [];
  if (v2) {
    let cur = '';
    for (const seg of body.split(/<section class="page/).slice(1)) {
      const heads = [...seg.matchAll(/<h2[^>]*>\s*<span class="badge">([^<]*)<\/span>\s*<span class="name">([^<]*)<\/span>/g)];
      const main = seg.indexOf('<div class="page__main">');
      const lead = main < 0 ? '' : seg.slice(main + '<div class="page__main">'.length).trimStart();
      if (heads.length && lead.startsWith('<h2')) cur = `${heads[0][1]} ${heads[0][2]}`;
      // A page that opens on the chapter's summary is the summary's page.
      sectionAt.push(lead.startsWith('<div class="c-summary') ? 'Summary' : cur);
      if (heads.length) cur = `${heads.at(-1)[1]} ${heads.at(-1)[2]}`;
    }
  }
  let pageIndex = 0;

  return body.replace(/<section class="page([^"]*)"([^>]*)>/g, (m, cls, attrs) => {
    const here = sectionAt[pageIndex++] || '';
    // A fragment may declare its own folio — needed when pages are written
    // out of order, or when a chapter resumes at a known page. Everything
    // after it continues from that number.
    const declared = attrs.match(/\sdata-folio="(\d+)"/);
    if (declared) {
      folio = Number(declared[1]);
      attrs = attrs.replace(declared[0], '');
    }
    const n = folio++;
    /* Which side a folio prints on is its position in the book, not its
       number. Sheet 1 is a recto, so sheet s is a recto when s is odd —
       and the sheet holding folio n is the n-th after the front matter.
       A chapter printed on its own has no front matter and the two are
       the same thing, which is why this read as `n % 2` for so long. */
    const verso = ((meta.front || 0) + n) % 2 === 0;
    const designClass = meta.design === 'living-world' && !cls.includes('page--living') ? ' page--living' : '';
    const classes = `page${cls}${designClass}${verso ? ' page--verso' : ''}`;
    const opener = cls.includes('page--opener');

    // Interior pages carry the folio in the running head, beside the
    // chapter title, on the outer edge. Openers take neither, and get a
    // quiet folio at the foot instead.
    //
    // A page marked data-bridge names the division too. Ten consecutive
    // pages of a different kind of work should say so at every opening,
    // not only on the one page carrying the opener band.
    // By the Book, the board-examination division between the chapter
    // and Beyond the Book, is named the same way by data-board.
    const bridge = /\sdata-bridge(?=[\s=]|$)/.test(attrs);
    const board = /\sdata-board(?=[\s=]|$)/.test(attrs);
    const division = bridge ? ' &middot; Beyond the Book' : board ? ' &middot; By the Book' : '';
    // v2: verso the chapter, recto the section or the part
    // (the chapter number is in the v2 tab, so the verso names the title alone)
    const v2head = !v2 ? null : verso
      ? escapeHtml(meta.title)
      : bridge ? 'Beyond the Book' : board ? 'By the Book' : (here || escapeHtml(meta.title));
    const runhead = opener && meta.design !== 'living-world' ? '' : v2 ? v2Runhead(meta, v2head) : `
      <div class="runhead">
        <span class="runhead__chapter">${v2head ?? `${escapeHtml(meta.title)}${division}`}</span>
        <i class="runhead__mark" aria-hidden="true"></i>
      </div>`;

    const foot = `\n      ${v2 ? v2Pagefoot(n, meta) : pagefoot(n)}`;

    return `<section class="${classes}" data-folio="${n}"${attrs}><div class="page__bleed"><div class="page__trim">${foot}${runhead}`;
  });
}

const escapeHtml = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---- Chapter accent ---------------------------------------
   Each chapter owns a hue. It inks the frame's thumb tab and the
   chapter-head tab, so the closed book shows a stepped index down
   its fore edge. The tab steps down the page by chapter, which is
   what makes that index legible. Override per chapter with
   "accent" and "tabTop" in chapter.json.

   These are the fourteen chapter palettes' own structure colours, so
   a chapter's tab is the colour the chapter is — see
   css/palette-*.css. A chapter that names no palette still gets its
   accent from here; only the tab changes, and the reading page stays
   the standard three colours.

   The order interleaves the warm half of the ramp with the cool
   half: in ramp order, chapters 6, 7 and 8 would have been jade,
   teal and aqua, three near-neighbours stacked down the fore edge.
   Interleaved, consecutive chapters sit about 140 degrees apart. */
const CHAPTER_ACCENTS = [
  '#70391c', //  1  ember
  '#03526b', //  2  lagoon
  '#664203', //  3  bronze
  '#234c79', //  4  cobalt
  '#564a02', //  5  olive
  '#404479', //  6  indigo
  '#405214', //  7  moss
  '#553d71', //  8  violet
  '#20572f', //  9  fern
  '#643761', // 10  amethyst
  '#035748', // 11  emerald
  '#6f344c', // 12  mulberry
  '#05555a', // 13  teal
  '#733435', // 14  garnet
];

/* The tabs must all land on the page. Spread them over the run rather
   than stepping by a fixed millimetre count — at 22mm a fourteenth
   chapter's tab would sit 326mm down a 297mm page. */
const TAB_FIRST = 38, TAB_LAST = 232;

function chapterTheme(meta) {
  const i = (Number(meta.number) || 1) - 1;
  const n = CHAPTER_ACCENTS.length;
  const slot = ((i % n) + n) % n;
  const step = (TAB_LAST - TAB_FIRST) / (n - 1);
  return {
    accent: meta.accent ?? CHAPTER_ACCENTS[slot],
    tabTop: meta.tabTop ?? `${(TAB_FIRST + slot * step).toFixed(1)}mm`,
  };
}

/* Page furniture the builder adds, so no page file repeats it and
   every page carries the same header and footer. */
const pagefoot = (n) => '<div class="pagefoot">'
  + '<i class="pagefoot__bar pagefoot__bar--fill" aria-hidden="true"></i>'
  + '<i class="pagefoot__bar pagefoot__bar--line" aria-hidden="true"></i>'
  + `<span class="pagefoot__folio">${n}</span></div>`;

/* maths-v2 furniture, taken from the science-v2 pages (27 September
   2026, at the user's request): a chapter tab bleeding off the head
   with a paler slant behind it, the running title over a hairline, and
   at the foot the book's name over a hairline with the folio in a
   matching slanted tab at the outer edge. The shapes are science-v2's
   own paths, in its 1052-unit page width; css/maths-v2.css §13 sizes
   them in millimetres. Each path runs on past the trim into the bleed. */
const V2_MOTIF = '<g class="runhead__motif">'
  + '<path d="M30 13v14M23 20h14M43 20h14M25 36l10 10M35 36l-10 10M43 41h14"/>'
  + '<circle cx="50" cy="35.5" r="1.7"/><circle cx="50" cy="46.5" r="1.7"/></g>';
const v2Runhead = (meta, title) => `
      <div class="runhead runhead--v2">
        <svg class="runhead__ribbon" viewBox="0 0 340 63" aria-hidden="true"><path class="runhead__underlay" d="M-40 -40H340V0L317 51Q312 63 291 63H-40Z"/><path class="runhead__fill" d="M-40 -40H321V0L300 49Q295 63 274 63H-40Z"/>${V2_MOTIF}</svg>
        <span class="runhead__tab">Chapter ${escapeHtml(meta.number)}</span>
        <span class="runhead__chapter">${title}</span>
      </div>`;
const v2Pagefoot = (n, meta) => '<div class="pagefoot pagefoot--v2">'
  + `<span class="pagefoot__label">ClassBridge &middot; Mathematics ${escapeHtml(meta.class ?? '')}</span>`
  + '<svg class="pagefoot__ribbon" viewBox="-20 0 179 59" aria-hidden="true">'
  + '<path class="pagefoot__underlay" d="M200 0H22Q7 0 -1 15L-38 101H200Z"/>'
  + '<path class="pagefoot__fill" d="M200 0H42Q27 0 19 15L-18 101H200Z"/></svg>'
  + `<span class="pagefoot__folio">${n}</span></div>`;

/* The tab says what the book is. `subject` carries the volume —
   "Mathematics II", "Science" — and the volume numeral belongs to
   the binder, not to a browser tab, so it comes off here. Without
   this a science chapter announced itself as maths. */
const subjectName = (s) => (s || 'Mathematics').replace(/\s+(I{1,3}|IV)$/, '');
const usesMathsFonts = (meta) => /^Mathematics\b/.test(meta.subject || 'Mathematics I');

/* The stylesheets a chapter's `design` brings. Shared by the chapter
   shell and the book shell: the book shell once carried none of them,
   so every bound maths-clear or maths-v2 volume was set in the house
   design — other type, other spacing — and clipped pages that fitted
   when the chapter was built alone. */
const designSheets = (meta, cssHref) => `${['food-reference', 'science-reference', 'science-editorial'].includes(meta.design) ? `<link rel="stylesheet" href="${cssHref.replace('book.css', 'reference-fonts.css')}">
<link rel="stylesheet" href="${cssHref.replace('book.css', 'food-reference.css')}">` : ''}
${meta.design === 'science-reference' ? `<link rel="stylesheet" href="${cssHref.replace('book.css', 'science-reference.css')}">` : ''}
${meta.design === 'science-editorial' ? `<link rel="stylesheet" href="${cssHref.replace('book.css', 'science-reference.css')}"><link rel="stylesheet" href="${cssHref.replace('book.css', 'science-editorial.css')}">` : ''}
${meta.design === 'maths-clear' || meta.design === 'maths-v2' ? `<link rel="stylesheet" href="${cssHref.replace('book.css', 'maths-clear.css')}">` : ''}
${meta.design === 'maths-v2' ? `<link rel="stylesheet" href="${cssHref.replace('book.css', 'maths-v2.css')}">` : ''}`;

/* ---- Shell ------------------------------------------------ */
const shell = (meta, body, cssHref = '../../css/book.css', sheet = null, trim = null) => ((theme) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(meta.number)}. ${escapeHtml(meta.title)} — ${escapeHtml(subjectName(meta.subject))} Class ${escapeHtml(meta.class)}</title>
<link rel="stylesheet" href="${cssHref}">${meta.edition ? `
<link rel="stylesheet" href="${cssHref.replace("book.css", "edition-" + meta.edition + ".css")}">` : ``}${meta.palette ? `
<link rel="stylesheet" href="${cssHref.replace("book.css", "palette-" + meta.palette + ".css")}">` : ``}
${['food-reference', 'science-reference', 'science-editorial'].includes(meta.design) ? `<link rel="stylesheet" href="${cssHref.replace('book.css', 'reference-fonts.css')}">
<link rel="stylesheet" href="${cssHref.replace('book.css', 'food-reference.css')}">` : ''}
${meta.design === 'science-reference' ? `<link rel="stylesheet" href="${cssHref.replace('book.css', 'science-reference.css')}">` : ''}
${meta.design === 'science-editorial' ? `<link rel="stylesheet" href="${cssHref.replace('book.css', 'science-reference.css')}"><link rel="stylesheet" href="${cssHref.replace('book.css', 'science-editorial.css')}">` : ''}
${meta.design === 'maths-clear' || meta.design === 'maths-v2' ? `<link rel="stylesheet" href="${cssHref.replace('book.css', 'maths-clear.css')}">` : ''}
${meta.design === 'maths-v2' ? `<link rel="stylesheet" href="${cssHref.replace('book.css', 'maths-v2.css')}">` : ''}
${usesMathsFonts(meta) ? `<link rel="stylesheet" href="${cssHref.replace('book.css', 'maths-fonts.css')}"><link rel="stylesheet" href="${cssHref.replace('book.css', 'maths-tables.css')}">` : ''}
${meta.subject === 'Science' ? `<link rel="stylesheet" href="${cssHref.replace('book.css', 'science-locked.css')}">` : ''}
${meta.profile === 'science-v2' ? `<link rel="stylesheet" href="${cssHref.replace('book.css', 'science-v2-fonts.css')}"><link rel="stylesheet" href="${cssHref.replace('book.css', 'science-v2.css')}">` : ''}
<style>:root { --ch-accent: ${theme.accent}; --ch-tab-top: ${theme.tabTop}; }${sheet ? `@page { size: ${sheet.mediaW}mm ${sheet.mediaH}mm; margin: 0; }${a4Style(sheet)}`
  : trim ? `@page { size: ${trim.trimW}mm ${trim.trimH}mm; margin: 0; }` : ``}</style>
</head>
<body${sheet ? ` class="bleed${sheet.a4 ? ' a4' : ''}"` : ''}>
<svg class="dg-defs" aria-hidden="true"><defs>
<marker id="dg-arrow" viewBox="0 0 10 10" refX="9" refY="5"
        markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
  <path class="dg-arrowhead" d="M0,1 L10,5 L0,9 z"/>
</marker>
</defs></svg>
<div class="spread">
${body}
</div>
</body>
</html>
`)(chapterTheme(meta));

/* The book's own shell. Same head as a chapter's, but the palettes
   are inlined and scoped per chapter instead of one linked file
   setting :root for the whole document. */
const bookShell = (meta, body, scopes, sheet = null, trim = null) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(meta.title)} — Class ${escapeHtml(meta.class)}</title>
<link rel="stylesheet" href="../../css/book.css">${meta.edition ? `
<link rel="stylesheet" href="../../css/edition-${meta.edition}.css">` : ``}
<link rel="stylesheet" href="../../css/frontmatter.css">
${designSheets(meta, '../../css/book.css')}
${usesMathsFonts(meta) ? '<link rel="stylesheet" href="../../css/maths-fonts.css"><link rel="stylesheet" href="../../css/maths-tables.css">' : ''}
<style>
${scopes.join('\n')}
.page--blank .pagefoot, .page--blank .runhead { display: none; }
${sheet ? `@page { size: ${sheet.mediaW}mm ${sheet.mediaH}mm; margin: 0; }`
  : trim ? `@page { size: ${trim.trimW}mm ${trim.trimH}mm; margin: 0; }` : ``}
</style>
</head>
<body${sheet ? ` class="bleed${sheet.a4 ? ' a4' : ''}"` : ''}>
<svg class="dg-defs" aria-hidden="true"><defs>
<marker id="dg-arrow" viewBox="0 0 10 10" refX="9" refY="5"
        markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
  <path class="dg-arrowhead" d="M0,1 L10,5 L0,9 z"/>
</marker>
</defs></svg>
<div class="spread">
${body}
</div>
</body>
</html>
`;

/* ---- Design-system linter ---------------------------------
   A page file describes CONTENT. Every decision about colour,
   type, stroke and spacing belongs to the system. These checks
   make that mechanical rather than a matter of discipline. */
const DESIGN_RULES = [
  { re: /\sstyle="/g,
    msg: 'inline style attribute — use a component or a modifier class' },
  { re: /<style[\s>]/g,
    msg: '<style> block in a page — diagram styling belongs in css/diagram.css' },
  { re: /#[0-9a-fA-F]{6}\b/g,
    msg: 'hex colour literal — use a token (--teal, --rust, --gold, --dg-*)' },
  { re: /\sstroke-width="/g,
    msg: 'stroke-width attribute — use .dg-line, .dg-thin, .dg-dim' },
  { re: /\sfont-(family|size)="/g,
    msg: 'font attribute in a diagram — use .dg-label or .dg-note' },
  { re: /<marker[\s>]/g,
    msg: 'private marker — reference the shared url(#dg-arrow)' },
  /* A panel is a box, and a box has a top and a bottom. Divided
     over a break it shows the reader neither: an open-bottomed
     tray at the foot of one page and a lidless one at the head of
     the next, with the folio and the running head set between the
     two halves of a single thought. Four of them shipped that way
     — an example, a key idea and two Think and Reflects — because
     close-gaps could buy a page's white with one, and the white
     was the cheaper thing to lose. It is not. Move the whole
     panel to the next page and close the gap by editing the prose
     at the join. */
  { re: /class="[^"]*c-[a-z]+--(head|tail)\b/g,
    msg: 'a panel divided across a break — move it whole and close the gap in prose' },
];

/* An element left unclosed still renders — the browser repairs it
   silently — but it breaks anything that reads the source as a
   tree, and it hid three times in this chapter before a tool
   choked on it. Balance is cheap to check. */
const SELF_CLOSING = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img',
  'input', 'link', 'meta', 'source', 'track', 'wbr']);

function lintTags(file, html) {
  const depth = {};
  for (const m of html.matchAll(/<(\/?)([a-zA-Z][\w-]*)([^>]*?)(\/?)>/g)) {
    const [, close, tag, , self] = m;
    if (self === '/' || SELF_CLOSING.has(tag)) continue;
    depth[tag] = (depth[tag] || 0) + (close ? -1 : 1);
  }
  const bad = Object.entries(depth).filter(([, n]) => n !== 0);
  for (const [tag, n] of bad) {
    console.warn(`    ✗ ${file}: <${tag}> is ${n > 0 ? n + ' unclosed' : -n + ' over-closed'}`);
  }
  return bad.length;
}

function lintPage(file, html) {
  const found = [];
  for (const { re, msg } of DESIGN_RULES) {
    const n = (html.match(re) || []).length;
    if (n) found.push(`${msg} (${n})`);
  }
  const unbalanced = lintTags(file, html);
  for (const f of found) console.warn(`    \u2717 ${file}: ${f}`);
  return found.length + unbalanced;
}

/* ---- Build one chapter ------------------------------------ */
async function buildChapter(rel) {
  const src = p('pages', rel);
  const meta = JSON.parse(await readFile(path.join(src, 'chapter.json'), 'utf8'));

  const files = (await readdir(src))
    .filter(f => /^p\d+.*\.html$/.test(f))
    .sort();

  if (!files.length) {
    console.log(`  ${rel}: no page fragments yet — skipping`);
    return null;
  }

  const parts = [];
  let lint = 0;
  for (const f of files) {
    const frag = (await readFile(path.join(src, f), 'utf8')).trim();
    if(meta.subject==='Science')scienceContract(f,frag,meta.scienceVocabulary);
    if(meta.subject==='Science'&&/^class-[67]\//.test(rel.replaceAll('\\','/'))&&!hasContentImage(frag))throw Error(`${rel}/${f}: every science page needs a content image; feature icons do not count`);
    lint += lintPage(f, frag);
    parts.push(`<!-- ${f} -->\n` + frag);
  }

  lint += await lintClasses(ROOT, files.map(f => path.join(src, f)));

  const sheet = await sheetMetrics(ROOT, meta.edition);
  const figMM = await figWidths(ROOT, meta.edition);
  let body = stampFigureScale(stampPages(parts.join(String.fromCharCode(10, 10)), meta), figMM);
  body = closePages(body, marksFor(sheet));
  const { html: rendered, errors } = renderMath(body);

  const outDir = p('build', path.dirname(rel));
  await mkdir(outDir, { recursive: true });
  const outHtml = path.join(outDir, path.basename(rel) + '.html');
  await writeFile(outHtml, shell(meta, rendered, '../../css/book.css', null, sheet));

  // The print-ready sheet is the same pages on a larger piece of paper:
  // artwork carried 3mm past the trim, and marks showing where to cut.
  let bleedHtml = null;
  if (wantBleed) {
    bleedHtml = path.join(outDir, path.basename(rel) + '-bleed.html');
    await writeFile(bleedHtml, shell(meta, rendered, '../../css/book.css', sheet));
  }
  // The same sheet laid on A4, for sample runs printed in house.
  let a4Html = null;
  if (wantA4) {
    a4Html = path.join(outDir, path.basename(rel) + '-bleed-a4.html');
    await writeFile(a4Html, shell(meta, rendered, '../../css/book.css', onA4(sheet)));
  }

  const pageCount = (body.match(/<section class="page/g) || []).length;
  console.log(`  ${rel}: ${files.length} fragment(s) → ${pageCount} page(s)${errors ? `, ${errors} math error(s)` : ''}${lint ? `, ${lint} design violation(s)` : ''}`);
  return { htmlPath: outHtml, bleedHtml, a4Html, meta, sheet };
}

/* ---- PDF -------------------------------------------------- */
async function toPdf(htmlPath) {
  const chrome = findChrome();
  if (!chrome) throw new Error('No Chrome or Edge found — set one in CHROME_CANDIDATES.');
  const pdfPath = htmlPath.replace(/\.html$/, '.pdf');
  const url = 'file:///' + htmlPath.replace(/\\/g, '/');

  await run(chrome, [
    '--headless=new', ...SANDBOX,
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--print-to-pdf-no-header',
    '--virtual-time-budget=15000',
    `--print-to-pdf=${pdfPath}`,
    url,
  ], { maxBuffer: 1 << 24 });

  console.log(`  → ${path.relative(ROOT, pdfPath)}`);
  return pdfPath;
}

/* ---- Page proofs (PNG per page) ---------------------------
   Renders each page on its own at 2× so a spread can be read
   and marked up during design review. Same engine as the PDF,
   so what a proof shows is what the PDF gets. */
// px comes from sheet.mjs. The proof window must match
// the edition being rendered, or a standard-trim page comes back
// cropped to a smaller frame and reads as though it were clipped.

async function toPngs(htmlPath, meta, sheet) {
  const chrome = findChrome();
  if (!chrome) throw new Error('No Chrome or Edge found — set one in CHROME_CANDIDATES.');

  const full = await readFile(htmlPath, 'utf8');
  const pages = full.match(/<section class="page[\s\S]*?<\/section>/g) || [];
  const dir = htmlPath.replace(/\.html$/, '-proofs');
  await mkdir(dir, { recursive: true });

  // Each proof is the chapter shell holding exactly one page, no
  // preview chrome, so the capture is flush to the trim edges.
  const isolate = `<style>
    body { background: #fff; }
    .spread { padding: 0; gap: 0; }
    .page { box-shadow: none; }
  </style>`;

  const out = [];
  for (const [i, section] of pages.entries()) {
    const folio = section.match(/data-folio="(\d+)"/)?.[1] ?? String(i + 1);
    // Named for the chapter: every chapter of a class builds into one
    // folder, and two chapters proofed at once overwrote each other's
    // page N, so a proof could show another chapter's page.
    const tmp = path.join(path.dirname(htmlPath), `_tmp-proof-${path.basename(htmlPath, '.html')}-${folio}.html`);
    await writeFile(tmp, shell(meta, section).replace('</head>', `${isolate}\n</head>`));

    const png = path.join(dir, `p${String(folio).padStart(3, '0')}.png`);
    await run(chrome, [
      '--headless=new', ...SANDBOX,
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=2',
      `--window-size=${px(sheet.trimW)},${px(sheet.trimH) + await windowPad(chrome)}`,
      '--virtual-time-budget=8000',
      `--screenshot=${png}`,
      'file:///' + tmp.replace(/\\/g, '/'),
    ], { maxBuffer: 1 << 24 });

    await rm(tmp, { force: true });
    // Chrome captured the window, so the proof carries the empty
    // strip below the sheet. Take it back off, at capture scale.
    await cropHeight(png, px(sheet.trimH) * 2);
    out.push(png);
  }
  console.log(`  → ${out.length} proof(s) in ${path.relative(ROOT, dir)}`);
  return out;
}

/* ---- Overflow check ---------------------------------------
   A fixed page box clips anything that does not fit, and clipping
   is silent. So after every build we measure each page in Chrome
   and report the ones that are over. This runs by default —
   an overset page is a build error, not a style preference. */
async function checkOverflow(htmlPath, meta, sheet) {
  const chrome = findChrome();
  if (!chrome) return [];

  const probe = `<script>
    window.addEventListener('load', function () {
      var out = [];
      document.querySelectorAll('.page').forEach(function (pg) {
        var body = pg.querySelector('.page__body');
        if (!body) return;
        // Native Class 6 science body: exclude full-sheet vector furniture.
        // Its actual content, not its absolute-positioned wrapper, defines fill.
        var modern = pg.querySelector('.g6-content');
        if (modern) {
          var unit = pg.querySelector('.g6-furniture').getBoundingClientRect().width / 1052;
          var modernTop = modern.getBoundingClientRect().top;
          var modernLimit = pg.querySelector('.g6-furniture').getBoundingClientRect().top + 1415 * unit;
          var modernBottom = modernTop;
          modern.querySelectorAll(':scope > .g6-block').forEach(function(el) { modernBottom = Math.max(modernBottom, el.getBoundingClientRect().bottom); });
          out.push({folio:pg.dataset.folio,over:Math.round(Math.max(0,modernBottom-modernLimit)),
            fill:Math.round((modernBottom-modernTop)/(modernLimit-modernTop)*100),avail:Math.round(modernLimit-modernTop),close:pg.hasAttribute('data-close')});
          return;
        }
        var over = 0;
        // How far past the bottom of the text area does anything reach?
        // A column's scroll overflow is measured from where the column
        // ends, not from its own height: the columns are auto-height, so a
        // trailing margin inside one that stops well short of the foot was
        // being reported as a run into the margin.
        var limit = body.getBoundingClientRect().bottom;
        body.querySelectorAll('.page__main, .page__side, .page__full').forEach(function (col) {
          over = Math.max(over, col.getBoundingClientRect().bottom + (col.scrollHeight - col.clientHeight) - limit);
        });
        pg.querySelectorAll('.page__main > *, .page__side > *').forEach(function (el) {
          over = Math.max(over, el.getBoundingClientRect().bottom - limit);
        });
        // how far down the text area does the content actually reach?
        var top = body.getBoundingClientRect().top;
        var avail = body.getBoundingClientRect().height;
        var deepest = top;
        pg.querySelectorAll('.page__main > *, .page__side > *').forEach(function (el) {
          deepest = Math.max(deepest, el.getBoundingClientRect().bottom);
        });
        var fill = avail > 0 ? (deepest - top) / avail : 0;
        out.push({ folio: pg.dataset.folio, over: Math.round(over),
                   fill: Math.round(fill * 100), avail: Math.round(avail),
                   close: pg.hasAttribute('data-close') });
      });
      document.title = 'OVERSET' + JSON.stringify(out);
    });
  <\/script>`;

  const tmp = htmlPath.replace(/\.html$/, '-check.html');
  const src = await readFile(htmlPath, 'utf8');
  await writeFile(tmp, src.replace('</head>', probe + '\n</head>').replace(
    'href="../../css/book.css"', 'href="../../css/book.css"'));

  const { stdout } = await run(chrome, [
    '--headless=new', ...SANDBOX, '--disable-gpu', '--hide-scrollbars',
    `--window-size=${px(sheet.trimW)},${px(sheet.trimH)}`,
    '--virtual-time-budget=8000', '--dump-dom',
    'file:///' + tmp.replace(/\\/g, '/'),
  ], { maxBuffer: 1 << 26 });
  await rm(tmp, { force: true });

  const raw = stdout.match(/OVERSET(\[.*?\])<\/title>/s)?.[1];
  if (!raw) { console.warn('    ! overflow check did not report'); return []; }

  const PX_PER_MM = 96 / 25.4;
  const rows = JSON.parse(raw);
  const bad = rows.filter(r => r.over > 2);   // 2px slack for rounding
  // Past the text block is a fitting problem; past the margin as well is
  // a printing one. Saying "clipped" for 1mm sends you chasing ghosts.
  for (const r of bad) {
    const mm = r.over / PX_PER_MM;
    console.warn(mm > 12
      ? `    ! page ${r.folio} overruns by ${mm.toFixed(1)}mm — content is being clipped`
      : `    ~ page ${r.folio} runs ${mm.toFixed(1)}mm into the bottom margin`);
  }
  if (!bad.length) console.log('    all pages fit');

  // A short page is a defect too: it reads as unfinished rather than
  // designed. The LAST page is exempt — a chapter, or the content
  // supplied so far, is allowed to end part-way down. So is a page
  // that carries data-close: it ends a division rather than merely
  // running out, which is the same fault forgiven for the same reason.
  // A chapter with a Beyond the Book division after it has two such endings.
  const SHORT = 88;
  const short = rows.slice(0, -1).filter(r => !r.over && !r.close && r.fill < SHORT);
  for (const r of short) {
    // the text block's own height, measured — the trim is not a constant
    const gap = ((100 - r.fill) / 100 * (r.avail / PX_PER_MM)).toFixed(0);
    console.warn(`    ~ page ${r.folio} is ${r.fill}% full — ${gap}mm of white at the foot`);
  }
  // one compact line so page fullness is visible at a glance
  console.log('    fill  ' + rows.map(r => `${r.folio}:${r.fill}%`).join('  '));
  return bad;
}

/* ---- Front matter ------------------------------------------
   Title, imprint, contents. The book's own metadata already
   exists — the cover carries it — so this reads that rather than
   inventing a second place for the same facts.

   These pages take no folio, which is why Chapter 1 opens on
   page 1 and not page 5. Their count is kept even so the body
   still begins on a recto. */
/* A cover names its volume with a title and a part; a chapter names it
   with a subject. "Mathematics" and part 1 compose "Mathematics I", which
   is how a volume's chapters find their own jacket. Taking the first
   cover in the folder was right while a class was one book — with two it
   stamped Part I's part number and Part I's ISBN on Part II.

   The composition itself is in volume.mjs, because the studio needs the
   same answer and cannot import this file. */

async function bookMeta(cls, subject) {
  /* A book with no jacket of its own — the sample bound from several
     classes — names itself in pages/<cls>/book.json instead. */
  const own = p('pages', cls, 'book.json');
  if (existsSync(own)) {
    const b = JSON.parse(await readFile(own, 'utf8'));
    if (!b.subject || b.subject === subject) return b;
  }
  const dir = p('covers', cls);
  const names = await readdir(dir, { withFileTypes: true }).catch(() => []);
  for (const e of names) {
    if (!e.isDirectory()) continue;
    const file = path.join(dir, e.name, 'cover.json');
    if (!existsSync(file)) continue;
    const book = JSON.parse(await readFile(file, 'utf8'));
    if (volumeName(book) === subject) return book;
  }
  return null;
}

function frontMatter(book, contents, preface, sheet, marks = "", reader = null) {
  /* These pages are assembled here rather than through closePages, so
     they have to be handed the marks themselves. Without that the
     title, the preface and the contents were the only sheets in the
     press PDF with no marks on them. */
  const page = (cls, inner) =>
    `<section class="page page--front ${cls}">\n  <div class="page__body">`
    + `\n    <div class="page__main">\n${inner}\n    </div>\n  </div>${marks}\n</section>`;

  if (book.sample) return sampleFront(book, contents, page);

  const title = page('page--title', `      <div class="titlepage">
        <div class="titlepage__head">
          <div class="titlepage__imprint">${escapeHtml(book.imprint || '')}</div>
          <div class="titlepage__marker">
            <span class="titlepage__class">Class ${escapeHtml(book.class || '')}</span>
          </div>
        </div>
        <div class="titlepage__main">
          ${book.part ? `<div class="titlepage__part">Part ${escapeHtml(book.part)}</div>` : ''}
          <h1 class="titlepage__title">${escapeHtml(book.title || '')}</h1>
          <div class="titlepage__rule"></div>
          <div class="titlepage__subtitle">${escapeHtml(book.subtitle || '')}</div>
        </div>
        <div class="titlepage__student">
          <div class="titlepage__student-title">This book belongs to</div>
          <div class="titlepage__field titlepage__field--name"><span>Student name</span><span class="titlepage__write"></span></div>
          <div class="titlepage__field"><span>Section</span><span class="titlepage__write"></span></div>
          <div class="titlepage__field"><span>Roll no.</span><span class="titlepage__write"></span></div>
        </div>
        <div class="titlepage__foot">Every idea explained &middot; demonstrated &middot; practised</div>
      </div>`);

  /* The preface is shared by maths volumes. Publication metadata
     remains in cover.json; it is not printed below the preface. */
  const prefacePage = preface
    ? page('', preface.trimEnd().split('\n').map((l) => '      ' + l).join('\n'))
    : null;

  const rows = contents.map((c) => `          <li>
            <span class="contents__num">${escapeHtml(c.n)}</span>
            <span class="contents__name">${escapeHtml(c.title)}</span>
            <span class="contents__dots"></span>
            <span class="contents__folio">${c.from}</span>
          </li>`).join('\n');

  const toc = page('', `      <div class="contents__title">Contents</div>
      <ol class="contents">
${rows}
      </ol>`);

  /* No padding leaf. The front matter used to be forced to an even
     count so that folio 1 fell on a recto and the body's recto/verso
     stamping came out right — but that is a rule about where a page
     sits in the book, and the book can simply be asked. frontMatter
     reports its length, the body stamps each folio from its real
     position, and any count works. No blank leaves are inserted. */
  const pages = [title, toc];
  if (reader) pages.push(page('', reader.trim()));
  if (prefacePage) pages.push(prefacePage);
  /* Front matter carries no folio, so its pages have no number to take
     a side from — only their place in the stack. The first leaf of a
     book is a recto and they alternate from there. Hard-coding the
     side on each page instead worked only while the front matter was
     one fixed length. */
  return pages.map((html, i) => i % 2
    ? html.replace('<section class="page ', '<section class="page page--verso ')
    : html);
}

/* ---- The sample book ----------------------------------------
   A sample is excerpts from several classes bound as one book for
   schools to judge the series by (pages/_sample-*, book.json with
   "sample": true). It opens on a title page, then the contents of every
   class book in the series — each chapter with the topics it teaches,
   one class to a page — because what a school is really asking is what
   the books teach. Every chapter is listed alike; the sample's own
   chapters are not singled out.

   Each class takes the palette of its sample chapter: the index page,
   the divider and the chapter share one colour, and the colour comes
   from the chapter palettes the books already use, scoped by data-ch
   exactly as a bound volume scopes them. Nothing here names a colour.

   The index is read from the chapters themselves (each maths chapter's
   chapter.json and section heads under pages/class-N), so it cannot
   drift from the books. */
const SAMPLE_CLASSES = ['6', '7', '8', '9', '10'];

function chapterTopics(html) {
  return [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)]
    .map((m) => m[1].replace(/<span class="badge">[^<]*<\/span>/, '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
    // an index lists what a chapter teaches; every Class 10 chapter opens
    // on an "Introduction", and that says nothing about any of them
    .filter((t) => t && !/^(Introduction|Summary)$/i.test(t));
}

function seriesChapters() {
  const out = [];
  for (const cls of SAMPLE_CLASSES) {
    const root = p('pages', 'class-' + cls);
    if (!existsSync(root)) continue;
    for (const dir of readdirSync(root, { withFileTypes: true })) {
      const f = path.join(root, dir.name, 'chapter.json');
      if (!dir.isDirectory() || !existsSync(f)) continue;
      const m = JSON.parse(readFileSync(f, 'utf8'));
      if (!/^Mathematics\b/.test(m.subject || '')) continue;
      const src = path.join(root, dir.name);
      const body = readdirSync(src).filter((x) => /^p0\d\d\.html$/.test(x)).sort()
        .map((x) => readFileSync(path.join(src, x), 'utf8')).join('\n');
      out.push({ cls, subject: m.subject, n: Number(m.number), title: m.title,
        rel: `class-${cls}/${dir.name}`, topics: chapterTopics(body) });
    }
  }
  return out;
}

/* The box that carries a chapter's numeral on its opener carries the
   class in a sample instead: the chapters come from five books, and a
   "6" beside a "2" reads as an order they are not in. */
function sampleOpener(html, meta) {
  return html.replace(/<div class="chapterhead__num">[^<]*<\/div>/,
    `<div class="chapterhead__num chapterhead__num--class"><span class="chapterhead__kicker">Class</span>${escapeHtml(meta.class)}</div>`);
}

function sampleFront(book, contents, page) {
  // class -> the data-ch of its sample chapter, which carries its palette
  const scopeOf = new Map(contents.map((c) => [String(c.cls), c.n]));

  /* The books are ClassBridge's, and ClassBridge leads, as it does on the
     cover. LearnLab is the experiential learning app beside them: it is
     named where the book points to it, and never as the book's own name. */
  const brand = escapeHtml(book.brand || 'ClassBridge');
  const app = 'Learn<em>Lab</em>';

  /* The title page is a book's title page: the title centred with its
     rule, the classes under it, and the imprint at the foot. */
  const title = page('page--title page--sampletitle', `      <div class="sampletitle">
        <div class="sampletitle__kicker">${escapeHtml(book.kicker || '')}</div>
        <div class="sampletitle__main">
          <h1 class="sampletitle__title">${escapeHtml(book.title || '')}</h1>
          <div class="sampletitle__rule"></div>
          <div class="sampletitle__subtitle">${escapeHtml(book.subtitle || '')}</div>
          <div class="sampletitle__tagline">${escapeHtml(book.tagline || '')}</div>
        </div>
        <div class="sampletitle__foot">
          <div class="sampletitle__brand">${brand}</div>
          <div class="sampletitle__session">${escapeHtml(book.session || '')}${book.specimen ? ` &middot; ${escapeHtml(book.specimen)}` : ''}</div>
        </div>
      </div>`);

  /* A note to schools, written as a preface is written: prose, with a
     run-in head where a paragraph turns to a new point, and LearnLab's
     code set as a small figure at the foot. */
  const why = page('page--why', `      <div class="about">
        <div class="about__kicker">${escapeHtml(book.aboutKicker || '')}</div>
        <h2 class="about__title">${escapeHtml(book.whyTitle || '')}</h2>
${(book.about || []).map(([head, text]) => `        <p class="about__p">${head ? `<span class="about__head">${escapeHtml(head)}</span> ` : ''}${escapeHtml(text)}</p>`).join('\n')}
        <div class="about__lab">
          <img class="about__qr" src="../../assets/qr-classbridge.svg" alt="QR code to open LearnLab">
          <p class="about__caption"><span class="about__head">Scan to open LearnLab.</span> ${escapeHtml(book.scanNote || '')}</p>
        </div>
      </div>`);

  const all = seriesChapters();
  const classPage = (cls) => {
    const mine = all.filter((c) => c.cls === cls);
    const volumes = [...new Set(mine.map((c) => c.subject))].sort();
    const count = mine.length;
    const lists = volumes.map((v) => {
      const rows = mine.filter((c) => c.subject === v).sort((a, b) => a.n - b.n).map((c) => {
        return `          <li class="series__ch">
            <span class="series__chnum">${c.n}</span>
            <div class="series__chbody">
              <div class="series__chtitle">${escapeHtml(c.title)}</div>
              <div class="series__topics">${c.topics.join('<span class="series__dot">&nbsp;&middot; </span>')}</div>
            </div>
          </li>`;
      }).join('\n');
      return (volumes.length > 1 ? `        <div class="series__volume">${escapeHtml(v)}</div>\n` : '')
        + `        <ol class="series__list">\n${rows}\n        </ol>`;
    }).join('\n');
    return page('page--series', `      <div class="series" data-ch="${scopeOf.get(cls) ?? ''}">
        <div class="series__band">
          <div class="series__class"><span class="series__kicker">Class</span><span class="series__num">${cls}</span></div>
          <div class="series__meta">
            <div class="series__book">${volumes.length > 1 ? 'Mathematics I and II' : 'Mathematics'}</div>
            <div class="series__count">${count} chapters &middot; each followed by By the Book and Beyond the Book</div>
          </div>
        </div>
${lists}
      </div>`);
  };

  return [title, why, ...SAMPLE_CLASSES.map(classPage)].map((html, i) => i % 2
    ? html.replace('<section class="page ', '<section class="page page--verso ')
    : html);
}

/* ---- Build the whole class as one book ---------------------
   Chapters printed separately each start at folio 1. Bound
   together they run continuously, with each chapter starting on the
   next page, whether recto or verso. No blank pages are inserted.

   The colour needs care. A palette file sets --teal, --rust and
   --gold at :root, which is right for a chapter printed alone but
   would let the last chapter recolour the whole book. Here each
   chapter's page carries data-ch, and its palette is re-scoped to
   that attribute. Custom properties inherit, so every component
   inside the page picks up its own chapter's triad. */
async function paletteScope(meta) {
  const rules = [];
  if (meta.palette) {
    const file = p('css', 'palette-' + meta.palette + '.css');
    const css = await readFile(file, 'utf8').catch(() => null);
    if (css === null) {
      console.warn(`    ! chapter ${meta.number}: no palette file for "${meta.palette}"`);
    } else {
      const open = css.indexOf(':root {');
      const close = css.indexOf('}', open);
      if (open >= 0 && close > open) rules.push(css.slice(open + ':root {'.length, close).trim());
    }
  }
  const theme = chapterTheme(meta);
  rules.push(`--ch-accent: ${theme.accent}; --ch-tab-top: ${theme.tabTop};`);
  return `[data-ch="${meta.number}"] {\n  ${rules.join('\n  ')}\n}`;
}

/* A class is not one book. Class 8 is two volumes — Mathematics I and
   Mathematics II — and a volume is what gets printed, so a volume is what
   gets bound. Binding the class instead collides on the chapter number:
   both volumes open at 1, so their chapters interleave 1, 1, 2, 2, and
   paletteScope writes [data-ch="1"] twice at equal specificity, which
   hands both chapter ones to whichever palette came last. */
async function buildBooks(cls, only = null) {
  const root = p('pages', cls);
  const dirs = (await readdir(root, { withFileTypes: true }))
    .filter((e) => e.isDirectory()).map((e) => e.name);

  const chapters = [];
  for (const dir of dirs) {
    const metaPath = path.join(root, dir, 'chapter.json');
    if (!existsSync(metaPath)) continue;
    chapters.push({ dir, meta: JSON.parse(await readFile(metaPath, 'utf8')) });
  }
  if (!chapters.length) { console.log(`  ${cls}: no chapters`); return []; }

  /* Grouped by the field the studio already files them under, with the
     same fallback it uses, so a chapter that forgot the field is bound
     into the volume it is listed under rather than into one of its own. */
  const volumes = new Map();
  for (const ch of chapters) {
    const subject = ch.meta.subject || 'Mathematics I';
    if (!volumes.has(subject)) volumes.set(subject, []);
    volumes.get(subject).push(ch);
  }

  /* "Mathematics I" sorts before "Mathematics II" before "Science" on the
     plain string, a prefix being shorter than what extends it, so the
     volumes bind in the order they are shelved without parsing a numeral
     out of the subject. */
  /* --volume binds one book and leaves the others alone. The studio's
     whole-book view asks for exactly the volume on screen, and binding
     every volume of the class to print one PDF wrote a 38 MB science
     book nobody had asked for. */
  const subjects = [...volumes.keys()].sort().filter((s) => !only || s === only);
  if (only && !subjects.length) {
    console.error(`  ${cls}: no volume "${only}" — the class has ${[...volumes.keys()].sort().join(', ')}`);
    return [];
  }
  console.log(`  ${cls}: ${subjects.length} volume(s) — `
    + subjects.map((s) => `${s} (${volumes.get(s).length})`).join(', '));

  const books = [];
  for (const subject of subjects) {
    const book = await bindVolume(cls, subject, volumes.get(subject));
    if (book) books.push(book);
  }
  return books;
}

async function bindVolume(cls, subject, chapters) {
  const root = p('pages', cls);
  /* A sample binds chapters from several books, whose numbers say nothing
     about their order; it gives each an explicit "order". */
  const rank = (c) => c.meta.order ?? Number(c.meta.number);
  chapters.sort((a, b) => rank(a) - rank(b));

  /* The whole point of binding a volume rather than a class is that a
     chapter number is unique inside one, and a repeat would put the same
     collision back inside a single bind. */
  const nums = chapters.map((c) => String(c.meta.number));
  const twice = nums.find((n, i) => nums.indexOf(n) !== i);
  if (twice !== undefined) {
    console.warn(`    ! ${cls} · ${subject}: chapter ${twice} appears twice`
      + ` — two [data-ch="${twice}"] palettes, and the later one repaints both`);
  }

  // One book, one trim. Mixed editions would print at two sizes.
  const editions = [...new Set(chapters.map((c) => c.meta.edition || 'standard'))];
  if (editions.length > 1) {
    console.error(`  ${cls} · ${subject}: chapters use different editions (${editions.join(', ')})`
      + ` — a book needs one trim`);
    return null;
  }

  // One book, one design: the stylesheets are the book's, not the page's.
  const designs = [...new Set(chapters.map((c) => c.meta.design || 'house'))];
  if (designs.length > 1) {
    console.error(`  ${cls} · ${subject}: chapters use different designs (${designs.join(', ')})`
      + ` — a book is set in one`);
    return null;
  }

  const edition = chapters[0].meta.edition;
  const design = chapters[0].meta.design;
  const sheet = await sheetMetrics(ROOT, edition);
  const figMM = await figWidths(ROOT, edition);

  const bodies = [];
  const scopes = [];
  const contents = [];
  let folio = 1;

  /* How many leaves precede folio 1 has to be known before the body is
     stamped, because it decides which side every folio falls on. The
     front matter itself is assembled further down — it needs the
     contents, which the loop below collects — so its length is counted
     here rather than measured there. */
  const book = await bookMeta(cls, subject);
  const isMaths = /^Mathematics\b/.test(subject);
  const prefacePath = isMaths
    ? p('pages', '_shared', 'maths-preface.html')
    : p('pages', cls, 'preface.html');
  const preface = book && !book.sample && existsSync(prefacePath)
    ? await readFile(prefacePath, 'utf8') : null;
  // Every maths volume shares the same four front-matter pages,
  // with its own title and contents.
  const reader = book && isMaths && !book.sample
    ? await readFile(p('pages', '_shared', 'maths-reader.html'), 'utf8') : null;
  const front = book && book.sample ? 2 + SAMPLE_CLASSES.length
    : book ? 2 + (preface ? 1 : 0) + (reader ? 1 : 0) : 0;

  for (const ch of chapters) {
    const src = path.join(root, ch.dir);
    const files = (await readdir(src)).filter((f) => /^p\d+.*\.html$/.test(f)).sort();
    if (!files.length) continue;

    const parts = [];
    for (const f of files) {
      parts.push(`<!-- ${ch.dir}/${f} -->\n` + (await readFile(path.join(src, f), 'utf8')).trim());
    }
    // a specimen's chapter opens straight on its opener, which names the class
    if (book && book.sample) parts[0] = sampleOpener(parts[0], ch.meta);
    const meta = { ...ch.meta, startFolio: folio, front };
    let body = stampFigureScale(stampPages(parts.join(String.fromCharCode(10, 10)), meta), figMM);
    body = closePages(body, marksFor(sheet));
    body = body.split('<section class="page').join(`<section data-ch="${ch.meta.number}" class="page`);

    bodies.push(body);
    scopes.push(await paletteScope(ch.meta));
    contents.push({ n: ch.meta.number, cls: ch.meta.class, title: ch.meta.title, source: ch.meta.source, from: folio, to: folio + parts.length - 1 });
    folio += parts.length;
  }

  // Title, contents and introductions go in front. They carry no folio, so
  // chapter 1 still opens on page 1 — but their count is kept even, or
  // the body would start on a verso.
  if (book) {
    const fm = frontMatter(book, contents, preface, sheet, marksFor(sheet), reader);
    if (fm.length !== front) {
      console.warn(`    ! front matter came to ${fm.length} pages but ${front} were counted`
        + ` before the body was stamped — every folio is on the wrong side`);
    }
    bodies.unshift(...fm);
  } else {
    console.warn(`    ! ${cls} · ${subject}: no cover.json for this volume,`
      + ` so the book has no title page`);
  }

  /* A sample goes out free, so every leaf says so: frontmatter.css sets
     the attribute's words small in the foot margin, clear of the folio. */
  if (book && book.sample && book.specimen) {
    const mark = `<section data-specimen="${escapeHtml(book.specimen)}" `;
    for (let i = 0; i < bodies.length; i++) bodies[i] = bodies[i].split('<section ').join(mark);
    // attr() would read the page body, not the section, so the words go in
    // the book's own style block, where the palettes already go
    // (the title page says it in its header, so it is left out here)
    scopes.push(`[data-specimen]:not(.page--title) .page__body::after { content: ${JSON.stringify(book.specimen)}; }`);
  }
  const { html: rendered, errors } = renderMath(bodies.join(String.fromCharCode(10, 10)));
  const meta = {
    class: chapters[0].meta.class,
    number: '', title: (book && book.title) || subject,
    edition, design, palette: null, subject,
  };

  const outDir = p('build', cls);
  await mkdir(outDir, { recursive: true });
  /* Named for the volume even when a class holds one, so the path does
     not change shape on the day a second volume lands — which is the day
     every note that quotes it is most likely to be followed. */
  const name = `${cls}-${subject.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-book`;
  const outHtml = path.join(outDir, name + '.html');
  await writeFile(outHtml, bookShell(meta, rendered, scopes, null, sheet));

  let bleedHtml = null;
  if (wantBleed) {
    bleedHtml = path.join(outDir, name + '-bleed.html');
    await writeFile(bleedHtml, bookShell(meta, rendered, scopes, sheet, sheet));
  }
  let a4Html = null;
  if (wantA4) {
    a4Html = path.join(outDir, name + '-bleed-a4.html');
    await writeFile(a4Html, bookShell(meta, rendered, scopes, onA4(sheet), sheet));
  }

  /* Every leaf has two sides and the first sheet of a bound book is a
     recto, so sheet n is a recto exactly when n is odd. A page styled
     for the other side puts its gutter allowance, its running head and
     its folio on the wrong edge — and since the offset comes from the
     count of pages before it, one page out of place inverts the whole
     book rather than one leaf of it. Cheap to check, invisible in a
     PDF reader that shows one page at a time, and wrong on paper. */
  const sides = [...rendered.matchAll(/<section ([^>]*class="page[^>]*)>/g)]
    .map((m, i) => ({
      sheet: i + 1,
      styled: /page--verso/.test(m[1]) ? 'verso' : 'recto',
      physical: (i + 1) % 2 ? 'recto' : 'verso',
    }));
  const wrong = sides.filter((s) => s.styled !== s.physical);
  if (wrong.length) {
    console.warn(`    ! ${wrong.length} of ${sides.length} sheets are styled for the side they are not on`
      + ` — first at sheet ${wrong[0].sheet}, styled ${wrong[0].styled} on a ${wrong[0].physical}.`
      + ` A page's side comes from its place in the book: sheet 1 is a recto.`);
  }

  console.log(`  ${cls} · ${subject}: ${chapters.length} chapters → ${folio - 1} numbered pages`
    + `${front ? `, plus ${front} pages of front matter` : ``}`
    + `${errors ? `, ${errors} math error(s)` : ''}`);
  for (const c of contents) {
    console.log(`      ${String(c.n).padStart(2)}. ${c.title.padEnd(38)} ${String(c.from).padStart(3)}–${c.to}`);
  }
  return { htmlPath: outHtml, bleedHtml, a4Html, meta, sheet };
}

/* ---- Sheet check -------------------------------------------
   Chrome writes the page box itself, and rounds when it does.
   Measure what actually came out rather than trusting the CSS. */
async function verifySheet(pdfPath, sheet) {
  const src = (await readFile(pdfPath)).toString('latin1');
  const boxes = [...src.matchAll(/MediaBox\s*\[\s*([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)/g)]
    .map(m => [Number(m[3]) - Number(m[1]), Number(m[4]) - Number(m[2])]);
  if (!boxes.length) { console.warn('    ! could not read the page box'); return; }
  const mm = pt => pt * 25.4 / 72;
  const w = mm(boxes[0][0]), h = mm(boxes[0][1]);
  const odd = boxes.filter(b => b[0] !== boxes[0][0] || b[1] !== boxes[0][1]).length;
  const dw = Math.abs(w - sheet.mediaW), dh = Math.abs(h - sheet.mediaH);
  console.log(`    sheet ${w.toFixed(2)} x ${h.toFixed(2)}mm`
    + ` (trim ${sheet.trimW} x ${sheet.trimH}, bleed ${sheet.bleed}mm, marks in a `
    + (sheet.a4 ? `${sheet.slugX} x ${sheet.slugY}mm slug, on A4)` : `${sheet.slug}mm slug)`));
  if (odd) console.warn(`    ! ${odd} page(s) carry a different box`);
  if (dw > 0.5 || dh > 0.5) {
    console.warn(`    ! that is ${dw.toFixed(2)} x ${dh.toFixed(2)}mm off the intended sheet`);
  }
}

/* ---- Entry ------------------------------------------------ */
const args = process.argv.slice(2);
const wantPdf = args.includes('--pdf');
const wantPng = args.includes('--png');
/* --a4 writes the press sheet laid on A4 as well (sheet.mjs, onA4): the
   proof for a sample run printed in house and cut by hand. */
const wantA4 = args.includes('--a4');
const wantBleed = args.includes('--bleed');
const wantBook = args.includes('--book');
/* --volume="Mathematics II" limits --book to one volume. */
const wantVolume = (args.find(a => a.startsWith('--volume=')) || '').slice('--volume='.length) || null;
const target = args.find(a => !a.startsWith('--'));

if (!target) {
  console.error('usage: node build/build.mjs <class-9[/chapter-dir]> [--pdf] [--png] [--bleed] [--a4] [--book [--volume="Mathematics I"]]');
  process.exit(1);
}

// A bare class name builds every chapter under it.
let chapters = [target];
const asDir = p('pages', target);
if (!existsSync(path.join(asDir, 'chapter.json'))) {
  const entries = await readdir(asDir, { withFileTypes: true }).catch(() => {
    console.error(`Not found: pages/${target}`);
    process.exit(1);
  });
  chapters = entries.filter(e => e.isDirectory()).map(e => `${target}/${e.name}`);
  /* Binding reads the page sources and renders them itself, so a bind of
     one volume does not need every chapter of the class rebuilt first. */
  if (wantBook && wantVolume) chapters = [];
}

const styleErrors = await lintStylesheets(ROOT);
if (styleErrors) {
  console.error(`
Build stopped: ${styleErrors} font-size(s) off the type scale.`);
  process.exit(1);
}
console.log(`Building ${chapters.length} chapter(s):`);
for (const ch of chapters) {
  const built = await buildChapter(ch);
  if (!built) continue;
  await checkOverflow(built.htmlPath, built.meta, built.sheet);
  if (wantPdf) await toPdf(built.htmlPath);
  if (built.bleedHtml) {
    const pdf = await toPdf(built.bleedHtml);
    await verifySheet(pdf, built.sheet);
  }
  if (built.a4Html) {
    const pdf = await toPdf(built.a4Html);
    await verifySheet(pdf, onA4(built.sheet));
  }
  if (wantPng) await toPngs(built.htmlPath, built.meta, built.sheet);
}

// --book binds each of the class's volumes: within a volume the folios
// run straight through without blank pages between chapters.
if (wantBook) {
  const cls = target.split('/')[0];
  console.log(`
Binding ${cls}:`);
  for (const book of await buildBooks(cls, wantVolume)) {
    await checkOverflow(book.htmlPath, book.meta, book.sheet);
    if (wantPdf) await toPdf(book.htmlPath);
    if (book.bleedHtml) {
      const pdf = await toPdf(book.bleedHtml);
      await verifySheet(pdf, book.sheet);
    }
    if (book.a4Html) {
      const pdf = await toPdf(book.a4Html);
      await verifySheet(pdf, onA4(book.sheet));
    }
  }
}
console.log('Done.');
