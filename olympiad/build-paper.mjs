#!/usr/bin/env node
/* ============================================================
   Olympiad papers — one question file in, an A4 paper out.

     node olympiad/build-paper.mjs class-9/level-1
     node olympiad/build-paper.mjs class-9            every level in the class

   Separate from the books on purpose. A paper is not a fixed-page
   chapter: it flows in two columns, a question is never divided,
   and Chrome breaks the pages. Nothing under pages/ or build/ is
   read or written; the two faces and KaTeX are borrowed.

   Writes, under olympiad/out/<class>/:
     level-1.pdf       the question paper, its header on page 1
     level-1-key.pdf   the answer key, printed apart for the teacher
   with the .html beside each.

   The question file format is in olympiad/README.md.
   ============================================================ */

import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import katex from 'katex';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const run = promisify(execFile);

const LETTERS = ['a', 'b', 'c', 'd'];
const SECTION_LETTERS = 'ABCDEFGH';
// paper.css pads the screen view by the same amounts, so the options
// are measured at the width they print at.
const MARGIN = '9mm 11mm 11mm';

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
const SANDBOX = process.getuid?.() === 0 ? ['--no-sandbox'] : [];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const minus = n => (n < 0 ? '−' + Math.abs(n) : String(n));

/* ---- Reading a question file -------------------------------- */

function parse(src, file) {
  const lines = src.replace(/\r\n?/g, '\n').split('\n');
  const name = path.basename(file);
  const at = i => `${name}:${i + 1}`;
  const meta = {};
  const sections = [];
  const problems = [];

  let i = 0;
  if (lines[0]?.trim() === '---') {
    for (i = 1; i < lines.length && lines[i].trim() !== '---'; i++) {
      const m = lines[i].match(/^([\w-]+):\s*(.*)$/);
      if (m) meta[m[1]] = m[2].trim();
    }
    i++;
  }

  let sec = null;
  let q = null;
  for (; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith('<!--')) continue;
    let m;

    if ((m = line.match(/^##\s+(.+)$/))) {
      sec = { subject: m[1], questions: [] };
      sections.push(sec);
      q = null;
    } else if ((m = line.match(/^(\d+)\.\s+(.+)$/))) {
      if (!sec) { problems.push(`${at(i)}: a question before any "## Subject" line`); continue; }
      q = { n: +m[1], where: at(i), stem: [m[2]], options: [], answer: null, figure: null };
      sec.questions.push(q);
    } else if (!q) {
      problems.push(`${at(i)}: text outside a question — ${JSON.stringify(line.slice(0, 40))}`);
    } else if ((m = line.match(/^\(([a-d])\)\s+(.+)$/))) {
      q.options.push(m[2]);
    } else if ((m = line.match(/^answer:\s*\(?([a-dA-D])\)?$/))) {
      q.answer = m[1].toLowerCase();
    } else if ((m = line.match(/^figure:\s*(.+)$/))) {
      q.figure = path.resolve(path.dirname(file), m[1].trim());
    } else if (q.options.length) {
      problems.push(`${at(i)}: text after the options of question ${q.n}`);
    } else {
      q.stem.push(line);
    }
  }

  let n = 0;
  sections.forEach((s, k) => {
    s.letter = SECTION_LETTERS[k];
    s.first = n + 1;
    if (!s.questions.length) problems.push(`section "${s.subject}" has no questions`);
    for (const q of s.questions) {
      n++;
      if (q.n !== n) problems.push(`${q.where}: numbered ${q.n}, but it is question ${n}`);
      if (q.options.length !== 4) problems.push(`${q.where}: ${q.options.length} options, expected 4`);
      if (new Set(q.options).size !== q.options.length) problems.push(`${q.where}: two options are the same`);
      if (!q.answer) problems.push(`${q.where}: no answer line`);
      if (q.figure && !existsSync(q.figure)) problems.push(`${q.where}: figure not found — ${q.figure}`);
    }
    s.last = n;
  });
  if (meta.questions && +meta.questions !== n) {
    problems.push(`the front matter says ${meta.questions} questions, the file has ${n}`);
  }

  return { meta, sections, problems, total: n };
}

/* ---- Maths and inline text --------------------------------- */

function tex(src, where, problems) {
  if (/[\t\f\b\v]/.test(src)) {
    problems.push(`${where}: a backslash was eaten — control character in ${JSON.stringify(src.slice(0, 40))}`);
    return esc(src);
  }
  const probe = src.replace(/\\text\{[^{}]*\}/g, '');
  const bare = probe.match(/(?<![\\A-Za-z])(d?frac|tfrac|sqrt|text|left|right|times|cdot|neq|quad)(?![A-Za-z])/);
  if (bare) {
    problems.push(`${where}: missing backslash before "${bare[1]}" in ${JSON.stringify(src.slice(0, 40))}`);
    return esc(src);
  }
  try {
    return katex.renderToString(src, { throwOnError: true, strict: false, output: 'html' });
  } catch (e) {
    problems.push(`${where}: maths error in ${JSON.stringify(src.slice(0, 40))} — ${e.message.split('\n')[0]}`);
    return esc(src);
  }
}

// Pictures first: {apple*4} carries an asterisk the emphasis would take.
const text = (s, where, problems) => pictures(esc(s), where, problems)
  .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
  .replace(/\*(.+?)\*/g, '<i>$1</i>');

// A rupee sign before maths and punctuation after it stay on the same
// line as the maths; left alone, a full stop can wrap to the next line.
function inline(s, where, problems) {
  const parts = s.split(/(\$[^$]+\$)/);
  let html = '';
  for (let k = 0; k < parts.length; k++) {
    const part = parts[k];
    if (!(part.length > 2 && part.startsWith('$') && part.endsWith('$'))) { html += text(part, where, problems); continue; }
    const before = html.match(/[₹(]$/)?.[0] ?? '';
    const after = parts[k + 1]?.match(/^[.,;:?!)]+/)?.[0] ?? '';
    if (before) html = html.slice(0, -before.length);
    if (after) parts[k + 1] = parts[k + 1].slice(after.length);
    const math = tex(part.slice(1, -1), where, problems);
    html += before || after ? `<span class="nobr">${before}${math}${esc(after)}</span>` : math;
  }
  return html;
}

const loadSvg = file => readFileSync(file, 'utf8').replace(/<\?xml[^>]*\?>\s*/, '');

/* ---- Pictures ----------------------------------------------

   {apple} or {apple*5} copies a symbol out of icons.svg, as many times
   as asked. {clock 3:30}, {coin 5}, {note 10}, {tens 3}, {ones 4},
   {dice 6} and {blank} are drawn here, so a clock's hands and a coin's
   value can never disagree with the question. A stem line holding
   nothing but pictures and + − = ? is set large, and | in it leaves a
   gap between groups. */

const ICONS = Object.fromEntries(
  [...readFileSync(path.join(HERE, 'icons.svg'), 'utf8')
    .matchAll(/<symbol id="([\w-]+)"(?: viewBox="([^"]+)")?>([\s\S]*?)<\/symbol>/g)]
    .map(([, id, viewBox, inner]) => [id, { viewBox: viewBox ?? '0 0 40 40', inner }]));

const TOKEN = /\{([a-z-]+)(?:\*(\d+))?(?:\s+([^}]*))?\}/g;
const PICTURES_ONLY = /^[\s+\-−=?×÷|,.:]*$/;

const art = (kind, viewBox, inner) =>
  `<svg class="ic ${kind}" viewBox="${viewBox}" aria-hidden="true">${inner}</svg>`;

const DRAWN = {
  clock(arg) {
    const [h, m] = arg.split(':').map(Number);
    if (!(h >= 1 && h <= 12 && m >= 0 && m < 60)) return null;
    const at = (deg, r) => {
      const a = deg * Math.PI / 180;
      return [(20 + r * Math.sin(a)).toFixed(2), (20 - r * Math.cos(a)).toFixed(2)];
    };
    let s = '<circle class="w" cx="20" cy="20" r="18"/>';
    for (let i = 0; i < 12; i++) s += `<path d="M${at(i * 30, 15.5).join(' ')}L${at(i * 30, 17.5).join(' ')}"/>`;
    s += `<path class="hand-h" d="M20 20L${at(((h % 12) + m / 60) * 30, 8.5).join(' ')}"/>`
       + `<path class="hand-m" d="M20 20L${at(m * 6, 13.5).join(' ')}"/>`;
    // Numbers after the hands, on a white halo, so a hand never hides one.
    for (const [n, deg] of [[12, 0], [3, 90], [6, 180], [9, 270]]) {
      const [x, y] = at(deg, 12);
      s += `<text x="${x}" y="${y}">${n}</text>`;
    }
    s += '<circle class="k" cx="20" cy="20" r="1.4"/>';
    return art('clock', '0 0 40 40', s);
  },
  coin: arg => art('coin', '0 0 40 40',
    `<circle class="gr" cx="20" cy="20" r="18"/><circle cx="20" cy="20" r="14.5"/><text x="20" y="20.5">₹${arg}</text>`),
  note: arg => art('note', '0 0 64 34',
    `<rect class="g" x="2" y="2" width="60" height="30" rx="2.5"/><rect x="6.5" y="6.5" width="51" height="21" rx="1.5"/><text x="32" y="17.5">₹${arg}</text>`),
  tens(arg) {
    const n = +arg;
    if (!(n >= 1 && n <= 9)) return null;
    let s = '';
    for (let i = 0; i < n; i++) {
      const x = i * 9 + 1.5;
      s += `<rect class="b" x="${x}" y="1" width="6" height="40"/>`;
      for (let k = 1; k < 10; k++) s += `<path d="M${x} ${1 + k * 4}h6"/>`;
    }
    return art('blocks', `0 0 ${n * 9} 42`, s);
  },
  ones(arg) {
    const n = +arg;
    if (!(n >= 1 && n <= 9)) return null;
    let s = '';
    for (let i = 0; i < n; i++) s += `<rect class="y" x="${i * 8 + 1.5}" y="35" width="6" height="6"/>`;
    return art('blocks', `0 0 ${n * 8} 42`, s);
  },
  dice(arg) {
    const pips = {
      1: [[20, 20]], 2: [[12, 12], [28, 28]], 3: [[11, 11], [20, 20], [29, 29]],
      4: [[12, 12], [28, 12], [12, 28], [28, 28]], 5: [[11, 11], [29, 11], [20, 20], [11, 29], [29, 29]],
      6: [[12, 10], [28, 10], [12, 20], [28, 20], [12, 30], [28, 30]],
    }[arg];
    if (!pips) return null;
    return art('dice', '0 0 40 40', '<rect class="w" x="3" y="3" width="34" height="34" rx="6"/>'
      + pips.map(([x, y]) => `<circle class="k" cx="${x}" cy="${y}" r="3"/>`).join(''));
  },
  blank: () => art('blank', '0 0 40 40',
    '<rect class="w dash" x="4" y="4" width="32" height="32" rx="3"/><text x="20" y="21">?</text>'),
};

function pictures(html, where, problems) {
  return html.replace(TOKEN, (token, name, times, arg) => {
    if (name === 'gap') return '<span class="gap"></span>';
    const n = times ? +times : 1;
    const one = DRAWN[name] ? DRAWN[name](arg ?? '')
      : ICONS[name] && art(`icon-${name}`, ICONS[name].viewBox, ICONS[name].inner);
    if (!one) {
      problems.push(`${where}: no picture for ${token}`);
      return token;
    }
    return `<span class="grp${n >= 2 ? ' n2' : ''}">${one.repeat(n)}</span>`;
  });
}

/* ---- The paper --------------------------------------------- */

// No running head: the masthead names the paper once, and the margin
// it would have taken goes to questions. The key carries no folio.
function head(title, up, cls = '') {
  const box = 'font-family: Spectral, Georgia, serif; font-size: 8pt; color: #7d837e;';
  const none = '{ content: none; }';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(title)}</title>
<link rel="stylesheet" href="${up}/node_modules/katex/dist/katex.min.css">
<link rel="stylesheet" href="${up}/css/fonts.css">
<link rel="stylesheet" href="${up}/olympiad/paper.css">
<style>
@page {
  size: A4;
  margin: ${MARGIN};
  @bottom-center { content: counter(page) " / " counter(pages); ${box} vertical-align: top; padding-top: 3.5mm; }
}
@page bare { @bottom-center ${none} }
</style>
</head>
<body class="${esc(cls)}">
`;
}

function renderQuestion(q, problems) {
  const w = q.where;
  // Picture lines are gathered onto one panel, sized by the busiest line
  // in it, so the rows of a picture graph come out the same size.
  const blocks = [];
  for (const l of q.stem) {
    const tokens = [...l.matchAll(TOKEN)];
    const pics = tokens.length > 0 && PICTURES_ONLY.test(l.replace(TOKEN, ''));
    const html = `<p class="stem${pics ? ' pics' : ''}">${inline(pics ? l.replace(/\|/g, '{gap}') : l, w, problems)}</p>`;
    const count = tokens.filter(t => t[1] !== 'blank').reduce((sum, t) => sum + (t[2] ? +t[2] : 1), 0);
    const last = blocks.at(-1);
    if (pics && last?.pics) {
      last.html += html;
      last.tokens += tokens.length;
      last.most = Math.max(last.most, count);
    } else {
      blocks.push({ pics, html, tokens: tokens.length, most: count });
    }
  }
  const stem = blocks.map(b => {
    if (!b.pics) return b.html;
    const size = b.tokens === 1 && b.most <= 1 ? ' panel--one'
      : b.most <= 3 ? ' panel--few'
      : b.most >= 8 ? ' panel--many' : '';
    return `<div class="panel${size}">${b.html}</div>`;
  }).join('');
  const fig = q.figure ? `<figure class="qfig">${loadSvg(q.figure)}</figure>` : '';
  const opts = q.options.map((o, k) =>
    `<li><span class="ol">(${LETTERS[k]})</span><span class="ot">${inline(o, w, problems)}</span></li>`).join('');
  // A figure floats beside the question rather than taking a full row.
  return `<div class="q"><span class="qn">${q.n}.</span><div class="qb">${fig}${stem}<ol class="opts o1">${opts}</ol></div></div>`;
}

function renderPaper(p, up) {
  const m = p.meta;
  const title = `Level ${m.level}`;

  const masthead = `
<header class="mast">
  <p class="mast-name">${esc(m.academy)}</p>
  <p class="mast-level">${esc(title)}</p>
</header>`;

  // One two-column flow for the whole paper, so no column is left half
  // empty where a section ends. A section's heading travels with its
  // first question, so it can never sit alone at the foot of a column.
  const questions = p.sections.map(s => s.questions.map((q, k) => {
    const html = renderQuestion(q, p.problems);
    if (k) return html;
    return `<div class="lead"><h2 class="sec-head"><span>Section ${s.letter} · ${esc(s.subject)}</span><small>Questions ${s.first}–${s.last}</small></h2>${html}</div>`;
  }).join('\n')).join('\n');

  // Four across if every option fits on one line, two across if that
  // does, one under another otherwise — measured at the width the
  // columns print at. Two across with wrapped options reads raggedly,
  // so it is used only where it saves at least two lines.
  const fit = `
<script>
document.fonts.ready.then(() => {
  const fits = ol => [...ol.children].every(li => li.scrollWidth <= li.clientWidth + 0.5);
  for (const ol of document.querySelectorAll('.opts')) {
    ol.className = 'opts o4 nowrap'; if (fits(ol)) continue;
    ol.className = 'opts o2 nowrap'; if (fits(ol)) continue;
    ol.className = 'opts o2'; const two = ol.offsetHeight;
    ol.className = 'opts o1';
    const line = parseFloat(getComputedStyle(ol).lineHeight);
    if (two <= ol.offsetHeight - 1.5 * line) ol.className = 'opts o2';
  }
});
</script>`;

  return head(`${m.academy} — ${title}, Class ${m.class}`, up, m.style ?? '')
    + masthead
    + `\n<main class="cols">\n${questions}\n</main>\n<p class="paper-end">End of the question paper</p>`
    + fit + '\n</body>\n</html>\n';
}

/* ---- The key ----------------------------------------------- */

function renderKey(p, up) {
  const m = p.meta;
  const tally = Object.fromEntries(LETTERS.map(l => [l, 0]));
  p.sections.forEach(s => s.questions.forEach(q => tally[q.answer]++));
  const body = `
<section class="key">
  <header class="key-head">
    <p class="key-kicker">Answer key · for the teacher</p>
    <h1>Level ${esc(m.level)} · Class ${esc(m.class)}</h1>
    <p class="key-sub">${esc(m.academy)} · Olympiad · ${esc(m.subjects)} · ${p.total} questions · +${+(m.correct ?? 4)} / ${minus(+(m.wrong ?? -1))} / 0</p>
  </header>
${p.sections.map(s => `
  <h2>Section ${s.letter} · ${esc(s.subject)} <small>Questions ${s.first}–${s.last}</small></h2>
  <div class="key-grid">${s.questions.map(q => `<div><span class="kq">${q.n}</span><span class="ka">${q.answer}</span></div>`).join('')}</div>`).join('')}
  <p class="key-dist">Answers by option: ${LETTERS.map(l => `(${l}) ${tally[l]}`).join(' · ')}</p>
</section>`;
  return head(`Answer key — Level ${m.level}, Class ${m.class}`, up) + body + '\n</body>\n</html>\n';
}

/* ---- Output ------------------------------------------------ */

async function toPdf(htmlPath) {
  const chrome = CHROME_CANDIDATES.find(c => c && existsSync(c));
  if (!chrome) throw new Error('No Chrome or Edge found — set CHROME to one.');
  const pdfPath = htmlPath.replace(/\.html$/, '.pdf');
  await run(chrome, [
    '--headless=new', ...SANDBOX,
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--virtual-time-budget=15000',
    `--print-to-pdf=${pdfPath}`,
    'file:///' + htmlPath.replace(/\\/g, '/'),
  ], { maxBuffer: 1 << 24 });
  const pages = (await readFile(pdfPath)).toString('latin1').match(/\/Type\s*\/Page(?![\w])/g);
  return { pdfPath, pages: pages ? pages.length : '?' };
}

function warnings(p) {
  const out = [];
  const answers = p.sections.flatMap(s => s.questions.map(q => q.answer));
  let run = 1;
  for (let k = 1; k <= answers.length; k++) {
    if (answers[k] === answers[k - 1]) { run++; continue; }
    if (run >= 3) out.push(`questions ${k - run + 1}–${k} all have answer (${answers[k - 1]})`);
    run = 1;
  }
  for (let k = 0; k + 8 <= answers.length; k++) {
    const w = answers.slice(k, k + 8).join('');
    if (w.slice(0, 4) === w.slice(4) && new Set(w).size === 4) {
      out.push(`questions ${k + 1}–${k + 8} repeat the pattern ${w.slice(0, 4)}`);
      break;
    }
  }
  return out;
}

async function buildOne(file) {
  const rel = path.relative(HERE, file).replace(/\\/g, '/').replace(/\.md$/, '');
  const p = parse(await readFile(file, 'utf8'), file);
  for (const key of ['academy', 'level', 'class']) {
    if (!p.meta[key]) p.problems.push(`the front matter has no "${key}:" line`);
  }
  const outDir = path.join(HERE, 'out', path.dirname(rel));
  const up = path.relative(outDir, ROOT).replace(/\\/g, '/');
  const paperHtml = renderPaper(p, up);
  const keyHtml = renderKey(p, up);

  if (p.problems.length) {
    console.error(`  ${rel}: ${p.problems.length} problem(s) — nothing written`);
    for (const x of p.problems) console.error(`    ! ${x}`);
    return false;
  }

  await mkdir(outDir, { recursive: true });
  const base = path.join(outDir, path.basename(rel));
  await writeFile(base + '.html', paperHtml);
  await writeFile(base + '-key.html', keyHtml);
  const [paper, key] = await Promise.all([toPdf(base + '.html'), toPdf(base + '-key.html')]);

  const tally = LETTERS.map(l => `${l} ${p.sections.reduce((t, s) => t + s.questions.filter(q => q.answer === l).length, 0)}`);
  console.log(`  ${rel}: ${p.total} questions (${p.sections.map(s => `${s.letter} ${s.questions.length}`).join(', ')}) · answers ${tally.join(', ')}`);
  for (const w of warnings(p)) console.log(`    ~ ${w}`);
  console.log(`  → ${path.relative(ROOT, paper.pdfPath)} (${paper.pages} pages)`);
  console.log(`  → ${path.relative(ROOT, key.pdfPath)} (${key.pages} page${key.pages === 1 ? '' : 's'})`);
  return true;
}

const args = process.argv.slice(2);
if (!args.length) {
  console.error('usage: node olympiad/build-paper.mjs <class>/<level> | <class>');
  process.exit(2);
}
let ok = true;
for (const arg of args) {
  const target = path.resolve(HERE, arg.replace(/\.md$/, ''));
  const files = existsSync(target + '.md') ? [target + '.md']
    : existsSync(target) ? (await readdir(target)).filter(f => /^level-\d+\.md$/.test(f)).sort().map(f => path.join(target, f))
    : [];
  if (!files.length) { console.error(`  nothing to build at ${arg}`); ok = false; continue; }
  for (const f of files) ok = (await buildOne(f)) && ok;
}
process.exit(ok ? 0 : 1);
