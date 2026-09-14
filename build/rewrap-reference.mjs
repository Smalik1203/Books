#!/usr/bin/env node
/* ============================================================
   Re-break a reference chapter's lines to a new measure.

     node build/rewrap-reference.mjs <chapter> --right=R [--shift=N] [--pages=3,4,5] [--dry]

   SVG text does not wrap. Every line in a reference page is a
   <tspan> somebody broke by hand, so changing the measure means
   breaking all of them again — 127 of them in class-6 chapter 1.
   This measures the real thing in the real face and does it.

   It works on the built chapter, because that is the only place
   the type exists at its rendered size, and writes back to the
   sources. Blocks are matched by their position in the sheet:
   the builder concatenates fragments in order, so the nth <text>
   of the nth .food-sheet is the nth <text> of the nth page file.

   Inline runs survive. A word inside <tspan class="food-bold">
   keeps its class when it moves to another line, and a run that
   straddles a break is split across the two.

   --right is the text block's new right edge; --shift moves every
   block's left edge by that many units, so a block indented inside
   the block — a panel's text, a page whose body clears a rail —
   keeps its indent instead of being flattened to one margin.

   --pages limits it to those page numbers, and usually you want
   that. Re-breaking a block re-breaks *all* of it, and a page whose
   lines were set short of the measure on purpose will pack tighter
   and lose lines you meant to keep. Only re-break what overflows.

   --dry reports the new line count per page and writes nothing,
   which is the number you want before agreeing to the change:
   more lines is a taller page, and the pages were full already.
   ============================================================ */

import { readFile, writeFile, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { readdir, stat } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const run = promisify(execFile);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CHROME = [
  process.env.CHROME, process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(c => c && existsSync(c));

const args = process.argv.slice(2);
const chapter = args.find(a => !a.startsWith('--'));
const dry = args.includes('--dry');
const rightArg = args.find(a => a.startsWith('--right='))?.slice(8);
const SHIFT = Number(args.find(a => a.startsWith('--shift='))?.slice(8) ?? 0);
const ONLY = args.find(a => a.startsWith('--pages='))?.slice(8)
  .split(',').map(Number).filter(Number.isFinite);

if (!chapter || !rightArg) {
  console.error('usage: node build/rewrap-reference.mjs <class>/<chapter> --right=R [--shift=N] [--pages=…] [--dry]');
  process.exit(2);
}
if (!CHROME) { console.error('No Chrome found. Set CHROME=<path>.'); process.exit(2); }
const BLOCK_R = Number(rightArg);

const built = path.join(ROOT, 'build', chapter + '.html');
if (!existsSync(built)) {
  console.error(`build/${chapter}.html is not built. Run the builder first.`);
  process.exit(2);
}
const srcDir = path.join(ROOT, 'pages', chapter);
const builtAt = (await stat(built)).mtimeMs;
for (const name of await readdir(srcDir)) {
  if ((await stat(path.join(srcDir, name))).mtimeMs > builtAt) {
    console.error(`pages/${chapter}/${name} is newer than the build. Rebuild first.`);
    process.exit(2);
  }
}

/* ---- Measure and wrap, inside the page ---------------------
   The candidate line is built as real markup in a real <text>
   that inherits the block's own classes, so a bold word is
   measured bold. Anything else measures the wrong thing. */
const probe = `<script>window.addEventListener('load',async()=>{
await document.fonts.ready;
const SHIFT=${SHIFT}, R=${BLOCK_R};
const ONLY=${ONLY ? JSON.stringify(ONLY) : 'null'};
const out=[];
const sheets=[...document.querySelectorAll('.food-sheet')];
sheets.forEach((svg,page)=>{
  if(ONLY && !ONLY.includes(page+1)) return;
  const texts=[...svg.querySelectorAll('text')];
  texts.forEach((text,index)=>{
    const lines=[...text.querySelectorAll(':scope > tspan')];
    if(lines.length<1) return;                       // a single-line label: leave it
    if(text.closest('.science-illustration')) return; // artwork's own labels

    /* every run of the paragraph, flattened, with the class it carries */
    const runs=[];
    lines.forEach((line,i)=>{
      if(i) runs.push({t:' ',c:null});
      for(const node of line.childNodes){
        if(node.nodeType===3) runs.push({t:node.textContent,c:null});
        else runs.push({t:node.textContent,c:node.getAttribute('class')||null});
      }
    });
    /* words, each carrying its run's class */
    const words=[];
    for(const r of runs){
      const parts=r.t.split(/(\\s+)/);
      for(const p of parts){
        if(!p) continue;
        if(/^\\s+$/.test(p)){ if(words.length) words[words.length-1].gap=true; }
        else words.push({t:p,c:r.c,gap:false});
      }
    }
    if(!words.length) return;

    /* the block keeps its own indent; only the right edge is new */
    const ownX=parseFloat(text.getAttribute('x'));
    const width=R-(ownX+SHIFT);
    if(text.getAttribute('text-anchor')) return;   // centred: not a wrapped block

    const ruler=document.createElementNS('http://www.w3.org/2000/svg','text');
    ruler.setAttribute('class',text.getAttribute('class')||'');
    ruler.setAttribute('x','0'); ruler.setAttribute('y','0');
    ruler.style.visibility='hidden';
    text.parentNode.insertBefore(ruler,text);
    const measure=ws=>{
      ruler.textContent='';
      for(const w of ws){
        const sp=document.createElementNS('http://www.w3.org/2000/svg','tspan');
        if(w.c) sp.setAttribute('class',w.c);
        sp.textContent=w.t+(w.gap?' ':'');
        ruler.appendChild(sp);
      }
      return ruler.getComputedTextLength();
    };

    const broken=[]; let current=[];
    for(const w of words){
      const trial=[...current,w];
      if(current.length && measure(trial)>width){ broken.push(current); current=[w]; }
      else current=trial;
    }
    if(current.length) broken.push(current);
    ruler.remove();

    out.push({page,index,newX:ownX+SHIFT,was:lines.length,now:broken.length,
      lines:broken.map(ws=>ws.map(w=>({t:w.t,c:w.c,gap:w.gap})))});
  });
});
document.title='REWRAP'+JSON.stringify(out);
});</script>`;

const temp = built.replace('.html', '-rewrap.html');
await writeFile(temp, (await readFile(built, 'utf8')).replace('</head>', probe + '</head>'));
const { stdout } = await run(CHROME, ['--headless=new', '--disable-gpu',
  '--virtual-time-budget=20000', '--dump-dom', 'file:///' + temp.replace(/\\/g, '/')],
  { maxBuffer: 128 * 1024 * 1024 });
await unlink(temp);

const raw = stdout.match(/REWRAP(\[[\s\S]*?\])<\/title>/)?.[1];
if (!raw) { console.error('    ! the probe did not report — nothing was measured'); process.exit(2); }
const blocks = JSON.parse(raw);

/* ---- Report ------------------------------------------------ */
const pageFiles = (await readdir(srcDir)).filter(n => /^p\d+\.html$/.test(n)).sort();
const perPage = new Map();
for (const b of blocks) {
  const e = perPage.get(b.page) || { was: 0, now: 0 };
  e.was += b.was; e.now += b.now; perPage.set(b.page, e);
}
console.log(`${chapter}: right edge ${BLOCK_R}`
  + (SHIFT ? `, every block shifted ${SHIFT > 0 ? '+' : ''}${SHIFT}` : '')
  + (ONLY ? `, pages ${ONLY.join(',')}` : ''));
let totalWas = 0, totalNow = 0;
for (const [page, e] of [...perPage].sort((a, b) => a[0] - b[0])) {
  totalWas += e.was; totalNow += e.now;
  const d = e.now - e.was;
  console.log(`  ${pageFiles[page]}  ${String(e.was).padStart(3)} lines → ${String(e.now).padStart(3)}`
    + (d ? `   ${d > 0 ? '+' : ''}${d}  (${(d * 31)} units taller)` : '   unchanged'));
}
console.log(`  total       ${totalWas} → ${totalNow}   ${totalNow - totalWas >= 0 ? '+' : ''}${totalNow - totalWas}`);
if (dry) { console.log('\n  --dry: nothing written.'); process.exit(0); }

/* ---- Write the sources back -------------------------------- */
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let written = 0;
for (const [page, file] of pageFiles.entries()) {
  const mine = blocks.filter(b => b.page === page);
  if (!mine.length) continue;
  const full = path.join(srcDir, file);
  let src = await readFile(full, 'utf8');

  /* the nth <text> of the source is the nth of the sheet */
  const spots = [...src.matchAll(/<text\b[^>]*>[\s\S]*?<\/text>/g)];
  const edits = [];
  for (const b of mine) {
    const spot = spots[b.index];
    if (!spot) { console.error(`    ! ${file}: no text element at index ${b.index}`); process.exit(1); }
    const open = spot[0].match(/<text\b[^>]*>/)[0];
    const dy = spot[0].match(/dy="([\d.]+)"/)?.[1] || '31';
    const newX = b.newX;
    const head = open.replace(/\sx="[-\d.]+"/, ` x="${newX}"`);
    const body = b.lines.map((ws, i) => {
      const inner = ws.map(w => (w.c ? `<tspan class="${w.c}">${esc(w.t)}</tspan>` : esc(w.t))
        + (w.gap ? ' ' : '')).join('').replace(/\s+$/, '');
      return `<tspan x="${newX}"${i ? ` dy="${dy}"` : ''}>${inner}</tspan>`;
    }).join('');
    edits.push({ start: spot.index, end: spot.index + spot[0].length, text: head + body + '</text>' });
  }
  edits.sort((a, b) => b.start - a.start);
  for (const e of edits) src = src.slice(0, e.start) + e.text + src.slice(e.end);
  await writeFile(full, src, 'utf8');
  written++;
}
console.log(`\n  ${written} page file(s) rewritten. Rebuild, then check-reference-fit.`);
