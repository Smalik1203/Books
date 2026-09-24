#!/usr/bin/env node
/* ============================================================
   What is actually inside a reference chapter's SVG sheet.

     node build/check-reference-fit.mjs <chapter> [--json]

   The builder's fill probe measures the outer SVG, and an SVG sheet
   always fills its page — so a reference chapter reports 100% fill
   and all pages fit whatever is going on inside it. This measures
   the rendered glyph boxes instead.

   It replaces check-food-reference.mjs for anything that is not the
   food chapter. That one takes a chapter argument and ignores it —
   the path is hardcoded — so running it on the science chapter
   returns the food chapter's 28 pages and 7,351 words, and reports
   a pass for a chapter it never opened. It also assumes every text
   element sits with its baseline at its own local origin, which is
   true of the OCR reconstruction and false of any page written with
   x/y attributes: point it at chapter 1 and all 67 texts come back
   clipped.

   This one measures a line at a time, in the sheet's own viewBox
   units, and works for either idiom:

     over      a line crossing the text block's right edge
     collide   a line overlapping an illustration viewport
     leading   baseline intervals inside one block that disagree
     ragged    lines in one block starting at different x
     letterbox a sheet whose viewBox is not the shape of the trim

   The text block is read from the page unless --block=L,R gives it:
   the right edge from where the full-width rules stop, the left from
   where the body actually starts. Text set inside an illustration
   viewport is the artwork's, and is left alone.
   ============================================================ */

import { readFile, writeFile, unlink } from 'node:fs/promises';
import { existsSync } from 'node:fs';
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
const asJson = args.includes('--json');
const blockArg = args.find(a => a.startsWith('--block='))?.slice(8);

if (!chapter) {
  console.error('usage: node build/check-reference-fit.mjs <class>/<chapter> [--block=L,R] [--json]');
  process.exit(2);
}
if (!CHROME) { console.error('No Chrome found. Set CHROME=<path>.'); process.exit(2); }

const built = path.join(ROOT, 'build', chapter + '.html');
if (!existsSync(built)) {
  console.error(`${path.relative(ROOT, built)} is not built. Run:`);
  console.error(`  node build/build.mjs ${chapter}`);
  process.exit(2);
}

/* The build must not be older than the sources it claims to show —
   this measures the build and its findings are quoted against the
   source, so the two have to be the same chapter. */
const { mtimeMs: builtAt } = await import('node:fs').then(m => m.promises.stat(built));
const srcDir = path.join(ROOT, 'pages', chapter);
const fs = await import('node:fs/promises');
for (const name of await fs.readdir(srcDir)) {
  const { mtimeMs } = await fs.stat(path.join(srcDir, name));
  if (mtimeMs > builtAt) {
    console.error(`pages/${chapter}/${name} is newer than the build. Rebuild first.`);
    process.exit(2);
  }
}

const probe = `<script>
const reportProbeError=event=>{document.title='FITCHECK'+JSON.stringify({error:String(event.reason?.stack||event.error?.stack||event.message||event.reason)});};
window.addEventListener('error',reportProbeError);
window.addEventListener('unhandledrejection',reportProbeError);
window.addEventListener('load',async()=>{
await document.fonts.ready;
const BLOCK=${blockArg ? JSON.stringify(blockArg.split(',').map(Number)) : 'null'};
const out={pages:0,lines:0,over:[],collide:[],leading:[],ragged:[],letterbox:[],vertical:[],blockUsed:null};
const inkMeasure=document.createElement('canvas').getContext('2d');
for(const svg of document.querySelectorAll('.food-sheet')){
  out.pages++;
  const page=svg.closest('.page');
  const folio=page.dataset.folio||page.dataset.referencePage||String(out.pages);
  const toLocal=svg.getScreenCTM().inverse();
  const box=el=>{const b=el.getBoundingClientRect();
    const a=new DOMPoint(b.left,b.top).matrixTransform(toLocal);
    const c=new DOMPoint(b.right,b.bottom).matrixTransform(toLocal);
    return {x:a.x,y:a.y,right:c.x,bottom:c.y};};

  /* The measure, if it was not given. Its right edge is where the
     full-width rules stop — the folio rule and the running-head rule
     both end there, plus the radius of the dot that caps them. Its
     left is where the body actually starts, which is the one number
     the furniture does not carry. Reading the left off the folio rule
     instead puts the block at 99 and calls the whole first column an
     overflow. */
  let L=BLOCK&&BLOCK[0], R=BLOCK&&BLOCK[1];
  if(R==null){
    const ends=[...svg.querySelectorAll('line')]
      .map(l=>({x1:+l.getAttribute('x1'),x2:+l.getAttribute('x2')}))
      .filter(l=>l.x2-l.x1>svg.viewBox.baseVal.width*0.5).map(l=>l.x2);
    if(ends.length)R=Math.max(...ends)+6;
  }
  if(L==null){
    const lefts=[...svg.querySelectorAll('text')]
      .filter(t=>t.querySelectorAll(':scope > tspan').length>1)
      .map(t=>Math.round(box(t).x));
    const tally={}; for(const x of lefts)tally[x]=(tally[x]||0)+1;
    const modal=Object.entries(tally).sort((a,b)=>b[1]-a[1])[0];
    if(modal)L=+modal[0];
  }
  if(L!=null&&out.blockUsed==null)out.blockUsed=[Math.round(L),Math.round(R)];

  /* A viewport's own x/y/width/height, read off the element. Asking a
     nested <svg> for its bounding rect gets the union of what is inside
     it — an <image> is 1052x1495 whatever the viewport crops it to — so
     measured that way the full-bleed illustration on page 1 covers the
     sheet and every line on the page reads as a collision. */
  /* The sheet is fitted into the page by preserveAspectRatio, so a
     viewBox that is not the trim's shape leaves blank paper on two
     sides. The builder's fill probe cannot see it: the <svg> element
     is 100% x 100% whatever its viewBox does inside it. Four of the
     food chapter's pages carry 35mm of it at head and foot. */
  {
    const box=svg.getBoundingClientRect(), vb=svg.viewBox.baseVal;
    const k=Math.min(box.width/vb.width, box.height/vb.height);
    const blankX=box.width-vb.width*k, blankY=box.height-vb.height*k;
    const PX_PER_MM=96/25.4;
    if(blankX>4||blankY>4)
      out.letterbox.push({page:folio, vb:vb.width+'x'+vb.height,
        side:blankX>blankY?'sides':'head and foot',
        mm:+(Math.max(blankX,blankY)/PX_PER_MM).toFixed(1)});
  }

  const attr=(el,n)=>+(el.getAttribute(n)||0);
  const ports=[...svg.querySelectorAll('.science-illustration')];
  // Viewport attributes are in the parent's coordinate system. Refit pages
  // may translate whole reading blocks, so transform all four frame corners
  // into the sheet before comparing them with rendered glyph boxes.
  const viewportBox=el=>{
    const own=el.transform?.baseVal?.consolidate()?.matrix||svg.createSVGMatrix();
    const matrix=toLocal.multiply(el.parentElement.getScreenCTM()).multiply(own);
    const x=attr(el,'x'),y=attr(el,'y'),w=attr(el,'width'),h=attr(el,'height');
    const points=[[x,y],[x+w,y],[x,y+h],[x+w,y+h]].map(([a,b])=>new DOMPoint(a,b).matrixTransform(matrix));
    return {x:Math.min(...points.map(p=>p.x)),y:Math.min(...points.map(p=>p.y)),
      right:Math.max(...points.map(p=>p.x)),bottom:Math.max(...points.map(p=>p.y))};
  };
  const art=ports.length
    ? ports.map(viewportBox)
    : [...svg.querySelectorAll('image')].map(box);

  for(const text of svg.querySelectorAll('text')){
    /* A label drawn inside a viewport belongs to the artwork — page 5
       resets two of the reference's callouts as live type over the
       clock. It is set against the illustration on purpose. */
    if(text.closest('.science-illustration'))continue;
    const spans=text.querySelectorAll(':scope > tspan');
    /* One entry per rendered line: a tspan that starts a line, or the
       whole element when it carries no line-starting tspan. */
    const runs=spans.length?[...spans]:[text];
    const seen=[];
    for(const run of runs){
      const b=box(run); if(!isFinite(b.x)||b.right-b.x<1)continue;
      out.lines++; seen.push(b);
      if(svg.classList.contains('science-editorial') && !text.matches('.se-running,.se-folio') && (b.y<70 || b.bottom>(svg.viewBox.baseVal.height-99)))
        out.vertical.push({page:folio,top:+b.y.toFixed(1),bottom:+b.bottom.toFixed(1),text:run.textContent.slice(0,58)});
      const label=(run.textContent||'').replace(/\\s+/g,' ').trim().slice(0,58);
      if(R!=null&&b.right>R+1)
        out.over.push({page:folio,by:+(b.right-R).toFixed(1),text:label});
      // V2's large live chapter numeral has an unused descender allowance.
      // Measure visible ink for artwork collisions, as its rendered audit does;
      // an em box below the baseline is not lettering printed on the garden.
      let collisionBox=b;
      if(page.classList.contains('page--science-v2')){
        const style=getComputedStyle(run);
        inkMeasure.font=style.fontStyle+' '+style.fontWeight+' '+style.fontSize+' '+style.fontFamily;
        const ink=inkMeasure.measureText(run.textContent),start=run.getStartPositionOfChar(0);
        const matrix=toLocal.multiply(run.getScreenCTM());
        const top=new DOMPoint(start.x,start.y-ink.actualBoundingBoxAscent).matrixTransform(matrix);
        const bottom=new DOMPoint(start.x,start.y+ink.actualBoundingBoxDescent).matrixTransform(matrix);
        collisionBox={...b,y:top.y,bottom:bottom.y};
      }
      for(const a of art){
        const w=Math.min(a.right,collisionBox.right)-Math.max(a.x,collisionBox.x);
        const h=Math.min(a.bottom,collisionBox.bottom)-Math.max(a.y,collisionBox.y);
        if(w>2&&h>2)out.collide.push({page:folio,over:Math.round(w)+'x'+Math.round(h),text:label});
      }
    }
    if(seen.length>2){
      const steps=seen.slice(1).map((b,i)=>+(b.y-seen[i].y).toFixed(1));
      const uniq=[...new Set(steps.map(Math.round))];
      if(uniq.length>1)out.leading.push({page:folio,steps:uniq,text:(text.textContent||'').trim().slice(0,44)});
      // Centred/right-aligned captions deliberately have different left edges.
      // Check the declared alignment axis, while retaining all bounds checks.
      const anchor=getComputedStyle(text).textAnchor;
      const xs=seen.map(b=>anchor==='middle'?(b.x+b.right)/2:anchor==='end'?b.right:b.x);
      if(Math.max(...xs)-Math.min(...xs)>3)
        out.ragged.push({page:folio,xs:[...new Set(xs.map(Math.round))],text:(text.textContent||'').trim().slice(0,44)});
    }
  }
}
document.title='FITCHECK'+JSON.stringify(out);
});</script>`;

const temp = built.replace('.html', '-fit.html');
await writeFile(temp, (await readFile(built, 'utf8')).replace('</head>', probe + '</head>'));
const { stdout } = await run(CHROME, ['--headless=new', '--disable-gpu',
  '--virtual-time-budget=15000', '--dump-dom', 'file:///' + temp.replace(/\\/g, '/')],
  { maxBuffer: 64 * 1024 * 1024 });
await unlink(temp);

const raw = stdout.match(/FITCHECK(\{[\s\S]*?\})<\/title>/)?.[1];
if (!raw) { console.error('    ! the probe did not report — nothing was measured'); process.exit(2); }
const r = JSON.parse(raw);
if(r.error)throw new Error('Reference-fit browser probe failed: '+r.error);

if (asJson) { console.log(JSON.stringify(r, null, 2)); }
else {
  console.log(`${chapter}: ${r.pages} page(s), ${r.lines} rendered line(s)`);
  if (r.blockUsed) console.log(`  text block ..${r.blockUsed[1]} in viewBox units`
    + ` (left edge is read per page; page 1's is ${r.blockUsed[0]})`);
  const show = (list, name, fmt) => {
    if (!list.length) { console.log(`  ok    ${name}`); return; }
    console.log(`  ${list.length} ${name}`);
    for (const item of list.slice(0, 12)) console.log('        ' + fmt(item));
    if (list.length > 12) console.log(`        …and ${list.length - 12} more`);
  };
  show(r.vertical, 'line(s) outside the editorial page height', i => `p${i.page} y=${i.top}..${i.bottom}  ${i.text}`);
  show(r.over, 'line(s) past the text block', i => `p${i.page} +${i.by}u  "${i.text}"`);
  show(r.collide, 'line(s) overlapping artwork', i => `p${i.page} ${i.over}  "${i.text}"`);
  show(r.leading, 'block(s) with uneven leading', i => `p${i.page} ${i.steps.join('/')}  "${i.text}"`);
  show(r.ragged, 'block(s) with a ragged left edge', i => `p${i.page} x=${i.xs.join('/')}  "${i.text}"`);
  show(r.letterbox, 'sheet(s) not the shape of the trim',
    i => `p${i.page} viewBox ${i.vb} — ${i.mm}mm of blank paper at the ${i.side}`);
}

const failures = r.over.length + r.collide.length + r.leading.length
  + r.ragged.length + r.letterbox.length + r.vertical.length;
if (failures) process.exitCode = 1;
