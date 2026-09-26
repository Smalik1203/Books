#!/usr/bin/env node
/* ============================================================
   Olympiad Talent Test — the Galaxy Olympiad Academy paper.

     node olympiad/talent-test/build.mjs class-3-2026-27

   A paper is a folder beside this file:

     paper.json       class, session, subjects, marks, time, sections
     questions.html   the questions, one <section> per subject
     figures/         pictures the questions use

   Writes olympiad/out/talent-test/<paper>.html and .pdf: the cover
   (seal, title bar, class box, candidate box, instructions), then
   every subject in one two-column flow under the running heads.

   The questions are numbered here, straight through, so a question
   added or cut renumbers the rest. The build stops, writing nothing,
   if a section holds the wrong number of questions, a question has
   other than four options, or a picture is missing.

   Separate from olympiad/build-paper.mjs, which sets the Level
   papers in their own design and needs an answer for every question.
   ============================================================ */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { seal } from './logo.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(HERE, '..', 'out', 'talent-test');
const run = promisify(execFile);

const CHROME_CANDIDATES = [
  process.env.CHROME,
  process.env.CHROME_PATH,
  '/opt/pw-browsers/chromium',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];
const SANDBOX = process.getuid?.() === 0 ? ['--no-sandbox'] : [];

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const css = s => String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"');

/* ---- Reading a paper --------------------------------------- */

function check(meta, src, dir) {
  const problems = [];
  const sections = [...src.matchAll(/<section\b[^>]*>([\s\S]*?)<\/section>/g)].map(m => m[1]);
  if (sections.length !== meta.sections.length) {
    problems.push(`paper.json lists ${meta.sections.length} sections, questions.html has ${sections.length}`);
  }
  let n = 0;
  sections.forEach((body, k) => {
    const want = meta.sections[k];
    const count = (body.match(/<div class="q[ "]/g) || []).length;
    if (want && count !== want.questions) {
      problems.push(`${want.subject}: ${count} questions, paper.json says ${want.questions}`);
    }
    n += count;
  });
  const total = meta.sections.reduce((t, s) => t + s.questions, 0);
  if (n !== total) problems.push(`${n} questions in all, paper.json adds up to ${total}`);

  // Every option list has four options.
  let q = 0;
  for (const m of src.matchAll(/<div class="q[ "]|<ol class="opts[^"]*">([\s\S]*?)<\/ol>/g)) {
    if (m[0].startsWith('<div')) { q++; continue; }
    const k = (m[1].match(/<li\b/g) || []).length;
    if (k !== 4) problems.push(`question ${q}: ${k} options, expected 4`);
  }
  for (const m of src.matchAll(/<img[^>]*src="([^"]+)"/g)) {
    if (!existsSync(path.join(dir, m[1]))) problems.push(`picture not found — ${m[1]}`);
  }
  if (/style="/.test(src)) problems.push('an inline style in questions.html — add a class to talent-test.css instead');
  return problems;
}

// Numbers each question, and keeps a section's head with its first one.
function number(meta, src) {
  let n = 0;
  let k = -1;
  return src.replace(/<section\b[^>]*>([\s\S]*?)<\/section>/g, (_, body) => {
    const s = meta.sections[++k];
    let first = true;
    const numbered = body.replace(/<div class="q([ "][^>]*)>/g, (m, rest) => {
      n++;
      const open = `<div class="q${rest}><span class="qn">${n}.</span>`;
      if (!first) return open;
      first = false;
      return `<div class="lead"><h2 class="sec-head"><span>${esc(s.subject.toUpperCase())}</span></h2>`
        + `<p class="sec-type">${esc(s.type ?? 'Single Correct Answer Type')} : &nbsp;(${s.questions}×${meta.marksEach} = ${s.questions * meta.marksEach} Marks)</p>`
        + open + '\u0000LEAD\u0000';
    });
    // Close the lead after the first question: find its end by depth.
    // Each option's text in a span, so the fit script can measure it.
    const wrapped = numbered.replace(/(<ol class="opts[^"]*">)([\s\S]*?)(<\/ol>)/g, (_, a, lis, b) =>
      a + lis.replace(/<li>([\s\S]*?)<\/li>/g, '<li><span>$1</span></li>') + b);
    return closeLead(wrapped);
  });
}

function closeLead(html) {
  const at = html.indexOf('\u0000LEAD\u0000');
  if (at < 0) return html;
  html = html.replace('\u0000LEAD\u0000', '');
  // Walk from the opening <div class="q"> of the lead's question.
  const start = html.lastIndexOf('<div class="q', at);
  let depth = 0;
  const tag = /<(\/?)div\b[^>]*>/g;
  tag.lastIndex = start;
  let m;
  while ((m = tag.exec(html))) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) {
      const end = m.index + m[0].length;
      return html.slice(0, end) + '</div>' + html.slice(end);
    }
  }
  return html;
}

/* ---- The paper --------------------------------------------- */

const omr = {
  wrong: `<svg viewBox="0 0 118 26" aria-hidden="true" fill="none" stroke="#000" stroke-width="1.8">
  <circle cx="13" cy="13" r="10.5"/><path d="M8 8l10 10M18 8l-10 10" stroke-width="2.6"/>
  <circle cx="44" cy="13" r="10.5"/><circle cx="44" cy="13" r="4.6" fill="#000"/>
  <circle cx="75" cy="13" r="10.5"/><path d="M66 17l14-11M67 20l16-12M70 21l12-10M64 12l14-8" stroke-width="1.3"/>
  <circle cx="106" cy="13" r="10.5"/><path d="M100 13l4.5 5L117 1" stroke-width="3"/>
</svg>`,
  right: `<svg viewBox="0 0 118 26" aria-hidden="true" fill="none" stroke="#000" stroke-width="1.8">
  <circle cx="13" cy="13" r="10.5"/><circle cx="44" cy="13" r="10.5"/><circle cx="75" cy="13" r="10.5"/>
  <circle cx="106" cy="13" r="10.5" fill="#000"/>
</svg>`,
};

function cover(m) {
  const ranges = m.sections.reduce((acc, s) => {
    const from = acc.length ? acc.at(-1).to + 1 : 1;
    acc.push({ ...s, from, to: from + s.questions - 1 });
    return acc;
  }, []);
  const total = ranges.at(-1).to;
  const marks = total * m.marksEach;
  const words = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five'];
  const paperRules = [
    `The question paper contains ${total} questions.`,
    ...ranges.map(r => `Question No. ${r.from} to Question No. ${r.to} belongs to ${r.short ?? r.subject}.`),
    `Each question carries ${words[m.marksEach] ?? m.marksEach} (${m.marksEach}) marks.`,
    `Total question paper is for ${marks} marks.`,
    'As there is no negative marking, try to attempt all the questions.',
    'Check the question paper thoroughly before answering.',
  ];
  const omrRules = [
    'This sheet should not be folded or crushed.',
    'Use only blue/ black ball point pen to fill the circles.',
    'Use of pencil is strictly prohibited.',
    'Circles should be darkened completely and properly.',
    'Cutting and erasing on this sheet is not allowed.',
    'Do not use any stray marks on the sheet.',
    'Do not use marker or white fluid to hide the mark.',
  ];
  const li = xs => xs.map(x => `<li>${esc(x)}</li>`).join('');
  return `
<section class="cover">
  <header class="mast">
    ${seal(m.sealYear, 'seal-l')}
    <div class="mast-title">
      <h1>OLYMPIAD TALENT TEST - ${esc(m.session)}</h1>
      <p class="subjects">${esc(m.subjectsLine)}</p>
    </div>
    ${seal(m.sealYear, 'seal-r')}
  </header>
  <div class="mast-rule"></div>
  <div class="facts">
    <div class="l1">DATE : ${esc(m.date ?? '')}</div>
    <div class="l2">PLACE : ${esc(m.place ?? '')}</div>
    <div class="class">CLASS - &nbsp;${esc(m.class)}</div>
    <div class="r1">MAX. MARKS : ${marks}</div>
    <div class="r2">TIME: ${esc(m.time)}</div>
  </div>
  <div class="sheet">
    <div class="candidate">
      <p>Student Name : <span class="line"></span></p>
      <p>Roll No. <span class="roll">${'<span></span>'.repeat(m.rollBoxes ?? 10)}</span></p>
    </div>
    <div class="instr">
      <h2>INSTRUCTIONS</h2>
      <h3>Instructions Regarding Question Paper</h3>
      <ul>${li(paperRules)}</ul>
      <h3>Instructions Regarding OMR Sheet</h3>
      <ul>${li(omrRules)}</ul>
      <div class="omr">
        <div><b>WRONG METHODS</b>${omr.wrong}</div>
        <div><b>CORRECT METHOD</b>${omr.right}</div>
      </div>
    </div>
  </div>
</section>`;
}

function pageRules(m) {
  const head = `font-family: 'Domine', serif; font-weight: 700; font-size: 9.5pt; letter-spacing: 0.3pt; vertical-align: top; padding-top: 7.4mm;`;
  const foot = `font-family: 'Montserrat', sans-serif; font-weight: 800; font-size: 9pt; letter-spacing: 0.4pt; vertical-align: top; padding-top: 5.2mm;`;
  // The bands: a grey strip over a black rule at the head, a black rule
  // over a grey strip at the foot, the same in every box so they join.
  const top = 'background: linear-gradient(180deg, transparent 6mm, #f1f1f1 6mm, #cdcdcd 12.5mm, #000 12.5mm, #000 13.1mm, transparent 13.1mm);';
  const bottom = 'background: linear-gradient(180deg, transparent 3.2mm, #000 3.2mm, #000 3.9mm, #cdcdcd 3.9mm, #f1f1f1 11mm, transparent 11mm);';
  const cls = `"CLASS - ${css(m.class)}"`;
  const name = `"${css(m.academy.toUpperCase())}"`;
  const title = `"OLYMPIAD  TALENT  TEST"`;
  const corners = `
  @top-left-corner { content: ''; ${top} }
  @top-right-corner { content: ''; ${top} }
  @bottom-left-corner { content: ''; ${bottom} }
  @bottom-right-corner { content: ''; ${bottom} }`;
  return `
@page :left {${corners}
  @top-left { content: ${cls}; ${head} ${top} }
  @top-right { content: ${title}; ${head} ${top} }
  @bottom-left { content: counter(page); ${foot} ${bottom} }
  @bottom-right { content: ${name}; ${foot} ${bottom} }
}
@page :right {${corners}
  @top-left { content: ${title}; ${head} ${top} }
  @top-right { content: ${cls}; ${head} ${top} }
  @bottom-left { content: ${name}; ${foot} ${bottom} }
  @bottom-right { content: counter(page); ${foot} ${bottom} }
}
@page cover {
  @top-left-corner { content: none; background: none; }
  @top-right-corner { content: none; background: none; }
  @top-left { content: none; background: none; }
  @top-right { content: none; background: none; }
  @bottom-left { content: ${name}; ${foot} ${bottom} }
  @bottom-right { content: counter(page); ${foot} ${bottom} }
}`;
}

// Four across if every option fits on one line, two across if that
// does, one under another otherwise — measured at the printed width.
const FIT = `
<script>
document.fonts.ready.then(() => {
  const fits = ol => [...ol.children].every(li => {
    const s = li.lastElementChild;
    return s.scrollWidth <= s.clientWidth + 0.5;
  });
  for (const ol of document.querySelectorAll('.opts:not(.pics):not(.fixed)')) {
    ol.classList.add('o4', 'nowrap'); if (fits(ol)) continue;
    ol.classList.remove('o4'); ol.classList.add('o2'); if (fits(ol)) continue;
    ol.classList.remove('o2', 'nowrap');
  }
  document.body.dataset.fitted = '1';
});
</script>`;

function renderPaper(m, questions) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>${esc(m.academy)} — Olympiad Talent Test ${esc(m.session)}, Class ${esc(m.class)}</title>
<link rel="stylesheet" href="${m.up}/talent-test.css">
<style>${pageRules(m)}
</style>
</head>
<body>
${cover(m)}
<main class="paper">
<div class="flow">
${questions}
<p class="end"><i>&#x2756;&#x2756;&#x2756;</i>ALL THE BEST<i>&#x2756;&#x2756;&#x2756;</i></p>
</div>
</main>
${FIT}
</body>
</html>
`;
}

/* ---- Output ------------------------------------------------ */

async function toPdf(htmlPath) {
  const chrome = CHROME_CANDIDATES.find(c => c && existsSync(c));
  if (!chrome) throw new Error('No Chrome or Edge found — set CHROME to one.');
  const pdfPath = htmlPath.replace(/\.html$/, '.pdf');
  await run(chrome, [
    '--headless=new', ...SANDBOX,
    '--disable-gpu',
    '--allow-file-access-from-files',
    '--no-pdf-header-footer',
    '--virtual-time-budget=20000',
    `--print-to-pdf=${pdfPath}`,
    'file://' + htmlPath.replace(/\\/g, '/'),
  ], { maxBuffer: 1 << 24 });
  const pages = (await readFile(pdfPath)).toString('latin1').match(/\/Type\s*\/Page(?![\w])/g);
  return { pdfPath, pages: pages ? pages.length : '?' };
}

async function build(name) {
  const dir = path.join(HERE, name);
  const meta = JSON.parse(await readFile(path.join(dir, 'paper.json'), 'utf8'));
  const src = (await readFile(path.join(dir, 'questions.html'), 'utf8')).replace(/<!--[\s\S]*?-->/g, '');
  const problems = check(meta, src, dir);
  if (problems.length) {
    console.error(`  ${name}: ${problems.length} problem(s) — nothing written`);
    for (const p of problems) console.error(`    ! ${p}`);
    return false;
  }
  await mkdir(OUT, { recursive: true });
  // Pictures are referenced from the paper's own folder.
  const rel = path.relative(OUT, dir).replace(/\\/g, '/');
  const body = number(meta, src).replace(/(<img[^>]*src=")(?!\w+:)/g, `$1${rel}/`);
  meta.up = path.relative(OUT, HERE).replace(/\\/g, '/');
  const htmlPath = path.join(OUT, `${name}.html`);
  await writeFile(htmlPath, renderPaper(meta, body));
  const { pdfPath, pages } = await toPdf(htmlPath);
  const counts = meta.sections.map(s => `${s.short ?? s.subject} ${s.questions}`).join(', ');
  console.log(`  ${name}: ${counts}`);
  console.log(`  → ${path.relative(path.resolve(HERE, '..', '..'), pdfPath)} (${pages} pages)`);
  return true;
}

const args = process.argv.slice(2);
if (!args.length) {
  console.error('usage: node olympiad/talent-test/build.mjs <paper-folder>');
  process.exit(2);
}
let ok = true;
for (const a of args) ok = (await build(a.replace(/\/$/, ''))) && ok;
process.exit(ok ? 0 : 1);
