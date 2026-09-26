#!/usr/bin/env node
// Find paragraphs, list items and captions whose last line is one word.
// usage: node build/lone-words.mjs <class>/<chapter>   (reads the built chapter)
import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
const arg = process.argv[2];
if (!arg) { console.error('usage: node build/lone-words.mjs <class>/<chapter>'); process.exit(1); }
const src = path.resolve('build', arg + '.html').split(path.sep).join('/');
const chrome = [process.env.CHROME, process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/chromium', '/usr/bin/google-chrome'].find(c => c && existsSync(c));
// Chrome will not start its sandbox as root, as in a CI container.
const SANDBOX = process.getuid?.() === 0 ? ['--no-sandbox'] : [];
const probe = `<script>addEventListener('load',()=>setTimeout(()=>{
  const out=[];
  const sel='.page__main p, .page__main li, .page__main figcaption, .page__main .work__row > span:not(.work__label)';
  document.querySelectorAll(sel).forEach(el=>{
    if(el.querySelector('li, p')) return;               // leaf blocks only
    const units=[];                                       // [top, text]
    const walk=(node)=>{
      for(const c of node.childNodes){
        if(c.nodeType===1 && c.classList.contains('katex')){ const r=c.getBoundingClientRect(); units.push([Math.round(r.bottom),'M']); continue; }
        if(c.nodeType===1){ walk(c); continue; }
        if(c.nodeType!==3) continue;
        const t=c.textContent;
        for(let i=0;i<t.length;i++){
          const r=document.createRange(); r.setStart(c,i); r.setEnd(c,i+1);
          const b=r.getBoundingClientRect(); if(!b.height) continue;
          units.push([Math.round(b.bottom),t[i]]);
        }
      }
    };
    walk(el);
    if(!units.length) return;
    const tops=[...new Set(units.map(u=>u[0]))].sort((a,b)=>a-b);
    const lines=[]; for(const t of tops){ if(!lines.length||t-lines[lines.length-1]>4) lines.push(t); }
    if(lines.length<2) return;
    const last=lines[lines.length-1];
    const txt=units.filter(u=>Math.abs(u[0]-last)<=4).map(u=>u[1]).join('').trim();
    if(txt && !/\\s/.test(txt)){
      const pg=el.closest('section.page');
      out.push([pg?pg.dataset.folio:'?', txt, el.textContent.replace(/\\s+/g,' ').trim().slice(0,70)]);
    }
  });
  document.title='L'+JSON.stringify(out);
},800));</script>`;
const tmp = src.replace(/\.html$/, '-lone.html');
writeFileSync(tmp, readFileSync(src, 'utf8').replace('</head>', probe + '</head>'));
const dom = execFileSync(chrome, ['--headless=new', ...SANDBOX, '--disable-gpu', '--window-size=900,1200',
  '--virtual-time-budget=9000', '--dump-dom', 'file:///' + tmp.replace(/\\/g, '/')], { maxBuffer: 1 << 27 }).toString();
rmSync(tmp);
const t = dom.match(/<title>([^<]*)<\/title>/);
if (!t || !t[1].startsWith('L')) { console.log('no result'); process.exit(1); }
const rows = JSON.parse(t[1].slice(1).replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'));
for (const [p, w, ctx] of rows) console.log(`p${p}\t"${w}"\t${ctx}`);
console.log(rows.length + ' lone-word lines');
process.exit(rows.length ? 1 : 0);
