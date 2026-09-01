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
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import katex from 'katex';

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const p = (...parts) => path.join(ROOT, ...parts);

/* ---- Chrome ---------------------------------------------- */
const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];
const findChrome = () => CHROME_CANDIDATES.find(c => existsSync(c));

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
  const px = await tokenReader(root, edition);
  const w = {};
  for (const step of ['sm', 'md', 'lg', 'xl', 'full']) {
    const raw = px('fig-' + step);
    w[step] = /var\(\s*--measure/.test(raw) ? parseFloat(px('measure')) : parseFloat(raw);
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
function closePages(body, marks) {
  return body.split("</section>").join("</div></div>" + marks + "</section>");
}

/* ---- Sheet metrics ----------------------------------------
   Read from the tokens rather than repeated here, so the page
   box Chrome is told to print can never drift from the box the
   stylesheet lays the book out in. */
async function tokenReader(root, edition) {
  const src = await readFile(path.join(root, 'css', 'tokens.css'), 'utf8');
  const over = edition
    ? await readFile(path.join(root, 'css', 'edition-' + edition + '.css'), 'utf8').catch(() => '')
    : '';
  return (name) => {
    // an edition sheet wins, exactly as the cascade would have it
    const from = over.includes('--' + name + ':') ? over : src;
    return from.slice(from.indexOf("--" + name + ":") + name.length + 3, from.indexOf("--" + name + ":") + name.length + 30);
  };
}

async function sheetMetrics(root, edition) {
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

/* Crop marks: eight hairlines in the slug, each running from the
   bleed edge outward, so none of them can cross artwork. The
   viewBox is in millimetres to keep the arithmetic readable. */
function cropMarks(m) {
  const o = m.bleed + m.slug;          // trim origin within the sheet
  const R = o + m.trimW, B = o + m.trimH;
  const gap = m.bleed, len = 5;
  const l = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  return `<svg class="cropmarks" viewBox="0 0 ${m.mediaW} ${m.mediaH}" aria-hidden="true">`
    + l(o - gap - len, o, o - gap, o) + l(o, o - gap - len, o, o - gap)
    + l(R + gap, o, R + gap + len, o) + l(R, o - gap - len, R, o - gap)
    + l(o - gap - len, B, o - gap, B) + l(o, B + gap, o, B + gap + len)
    + l(R + gap, B, R + gap + len, B) + l(R, B + gap, R, B + gap + len)
    + `</svg>`;
}

/* ---- Page stamping ---------------------------------------
   Each fragment supplies only its own content. The builder adds
   the furniture: recto/verso class, running head, folio. */
function stampPages(body, meta) {
  let folio = meta.startFolio ?? 1;

  return body.replace(/<section class="page([^"]*)"([^>]*)>/g, (m, cls, attrs) => {
    // A fragment may declare its own folio — needed when pages are written
    // out of order, or when a chapter resumes at a known page. Everything
    // after it continues from that number.
    const declared = attrs.match(/\sdata-folio="(\d+)"/);
    if (declared) {
      folio = Number(declared[1]);
      attrs = attrs.replace(declared[0], '');
    }
    const n = folio++;
    const verso = n % 2 === 0;
    const classes = `page${cls}${verso ? ' page--verso' : ''}`;
    const opener = cls.includes('page--opener');

    // Interior pages carry the folio in the running head, beside the
    // chapter title, on the outer edge. Openers take neither, and get a
    // quiet folio at the foot instead.
    const runhead = opener ? '' : `
      <div class="runhead">
        <span class="runhead__chapter">${escapeHtml(meta.title)}</span>
        <i class="runhead__mark" aria-hidden="true"></i>
      </div>`;

    const foot = `\n      ${pagefoot(n)}`;

    return `<section class="${classes}" data-folio="${n}"${attrs}><div class="page__bleed"><div class="page__trim">${foot}${runhead}`;
  });
}

const escapeHtml = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* ---- Chapter accent ---------------------------------------
   Each chapter owns a hue. It inks the frame's thumb tab and the
   chapter-head tab, and nothing else — so the reading page stays a
   three-colour system while the closed book shows a stepped index
   down its fore edge. The tab steps down the page by chapter, which
   is what makes that index legible. Override per chapter with
   "accent" and "tabTop" in chapter.json. */
const CHAPTER_ACCENTS = [
  '#a2482f', // 1  clay
  '#c1841c', // 2  saffron
  '#7d7a24', // 3  olive
  '#2b7a63', // 4  jade
  '#2c5f86', // 5  steel
  '#55488c', // 6  indigo
  '#8f3a63', // 7  plum
  '#7a5230', // 8  bronze
];

/* A chapter may also own its STRUCTURE colour — the one the section
   tabs, key ideas, practice bands and rules are set in. Action (rust)
   and attention (gold) stay common to the whole book, so a page is
   still the three-colour system DESIGN.md describes; only the hue of
   the first of the three moves.

   Four tones are needed, not one: the accent above inks a thumb tab,
   where a single value is enough, but the structure role also needs a
   deep, a soft and a pale tint. A chapter with no entry here falls
   back to the teal the book was built in and looks exactly as before,
   which is why chapters 1, 4 and 5 are absent.

   Declare one per chapter with "palette" in chapter.json to override. */
const CHAPTER_PALETTES = {
  // 3 — indigo. Chapter 4 owns the green, and the slot-3 olive of the
  // accent table sits too close to gold to carry a whole chapter.
  '3': { base: '#1c3a6b', deep: '#12294e', soft: '#5c7cad', tint: '#e8edf6' },
};

function chapterTheme(meta) {
  const i = (Number(meta.number) || 1) - 1;
  const slot = ((i % CHAPTER_ACCENTS.length) + CHAPTER_ACCENTS.length) % CHAPTER_ACCENTS.length;
  return {
    accent: meta.accent ?? CHAPTER_ACCENTS[slot],
    tabTop: meta.tabTop ?? `${40 + slot * 22}mm`,
    palette: meta.palette ?? CHAPTER_PALETTES[String(meta.number)] ?? null,
  };
}

/* Page furniture the builder adds, so no page file repeats it and
   every page carries the same header and footer. */
const pagefoot = (n) => '<div class="pagefoot">'
  + '<i class="pagefoot__bar pagefoot__bar--fill" aria-hidden="true"></i>'
  + '<i class="pagefoot__bar pagefoot__bar--line" aria-hidden="true"></i>'
  + `<span class="pagefoot__folio">${n}</span></div>`;

/* ---- Shell ------------------------------------------------ */
const shell = (meta, body, cssHref = '../../css/book.css', sheet = null, trim = null) => ((theme) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${escapeHtml(meta.number)}. ${escapeHtml(meta.title)} — Mathematics Class ${escapeHtml(meta.class)}</title>
<link rel="stylesheet" href="${cssHref}">${meta.edition ? `
<link rel="stylesheet" href="${cssHref.replace("book.css", "edition-" + meta.edition + ".css")}">` : ``}
<style>:root { --ch-accent: ${theme.accent}; --ch-tab-top: ${theme.tabTop};${theme.palette ? `
  --ch-structure: ${theme.palette.base}; --ch-structure-deep: ${theme.palette.deep};
  --ch-structure-soft: ${theme.palette.soft}; --ch-structure-tint: ${theme.palette.tint};` : ``} }${sheet ? `@page { size: ${sheet.mediaW}mm ${sheet.mediaH}mm; margin: 0; }`
  : trim ? `@page { size: ${trim.trimW}mm ${trim.trimH}mm; margin: 0; }` : ``}</style>
</head>
<body${sheet ? ' class="bleed"' : ''}>
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
    lint += lintPage(f, frag);
    parts.push(`<!-- ${f} -->\n` + frag);
  }

  lint += await lintClasses(ROOT, files.map(f => path.join(src, f)));

  const sheet = await sheetMetrics(ROOT, meta.edition);
  const figMM = await figWidths(ROOT, meta.edition);
  let body = stampFigureScale(stampPages(parts.join(String.fromCharCode(10, 10)), meta), figMM);
  body = closePages(body, cropMarks(sheet));
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

  const pageCount = (body.match(/<section class="page/g) || []).length;
  console.log(`  ${rel}: ${files.length} fragment(s) → ${pageCount} page(s)${errors ? `, ${errors} math error(s)` : ''}${lint ? `, ${lint} design violation(s)` : ''}`);
  return { htmlPath: outHtml, bleedHtml, meta, sheet };
}

/* ---- PDF -------------------------------------------------- */
async function toPdf(htmlPath) {
  const chrome = findChrome();
  if (!chrome) throw new Error('No Chrome or Edge found — set one in CHROME_CANDIDATES.');
  const pdfPath = htmlPath.replace(/\.html$/, '.pdf');
  const url = 'file:///' + htmlPath.replace(/\\/g, '/');

  await run(chrome, [
    '--headless=new',
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
const MM_TO_PX = 96 / 25.4;               // CSS px per mm
// The proof window must match the edition being rendered, or an A4 page
// comes back cropped to a B5 frame and reads as though it were clipped.
const px = (mm) => Math.round(mm * MM_TO_PX);

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
    const tmp = path.join(path.dirname(htmlPath), `_tmp-proof-${folio}.html`);
    await writeFile(tmp, shell(meta, section).replace('</head>', `${isolate}\n</head>`));

    const png = path.join(dir, `p${String(folio).padStart(3, '0')}.png`);
    await run(chrome, [
      '--headless=new',
      '--disable-gpu',
      '--hide-scrollbars',
      '--force-device-scale-factor=2',
      `--window-size=${px(sheet.trimW)},${px(sheet.trimH)}`,
      '--virtual-time-budget=8000',
      `--screenshot=${png}`,
      'file:///' + tmp.replace(/\\/g, '/'),
    ], { maxBuffer: 1 << 24 });

    await rm(tmp, { force: true });
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
        var over = 0;
        // How far past the bottom of the text area does anything reach?
        body.querySelectorAll('.page__main, .page__side, .page__full').forEach(function (col) {
          over = Math.max(over, col.scrollHeight - col.clientHeight);
        });
        var limit = body.getBoundingClientRect().bottom;
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
        out.push({ folio: pg.dataset.folio, over: Math.round(over), fill: Math.round(fill * 100) });
      });
      document.title = 'OVERSET' + JSON.stringify(out);
    });
  <\/script>`;

  const tmp = htmlPath.replace(/\.html$/, '-check.html');
  const src = await readFile(htmlPath, 'utf8');
  await writeFile(tmp, src.replace('</head>', probe + '\n</head>').replace(
    'href="../../css/book.css"', 'href="../../css/book.css"'));

  const { stdout } = await run(chrome, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars',
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
  // supplied so far, is allowed to end part-way down.
  const SHORT = 88;
  const short = rows.slice(0, -1).filter(r => !r.over && r.fill < SHORT);
  for (const r of short) {
    const gap = ((100 - r.fill) / 100 * 213).toFixed(0);
    console.warn(`    ~ page ${r.folio} is ${r.fill}% full — ${gap}mm of white at the foot`);
  }
  // one compact line so page fullness is visible at a glance
  console.log('    fill  ' + rows.map(r => `${r.folio}:${r.fill}%`).join('  '));
  return bad;
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
    + ` (trim ${sheet.trimW} x ${sheet.trimH}, bleed ${sheet.bleed}mm, marks in a ${sheet.slug}mm slug)`);
  if (odd) console.warn(`    ! ${odd} page(s) carry a different box`);
  if (dw > 0.5 || dh > 0.5) {
    console.warn(`    ! that is ${dw.toFixed(2)} x ${dh.toFixed(2)}mm off the intended sheet`);
  }
}

/* ---- Entry ------------------------------------------------ */
const args = process.argv.slice(2);
const wantPdf = args.includes('--pdf');
const wantPng = args.includes('--png');
const wantBleed = args.includes('--bleed');
const target = args.find(a => !a.startsWith('--'));

if (!target) {
  console.error('usage: node build/build.mjs <class-9[/chapter-dir]> [--pdf] [--png] [--bleed]');
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
  if (wantPng) await toPngs(built.htmlPath, built.meta, built.sheet);
}
console.log('Done.');
