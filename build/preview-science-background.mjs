// Review-only Chapter 2 V2 treatment; does not edit chapter sources or shared CSS.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import sharp from 'sharp';
import { sheetMetrics, px } from './sheet.mjs';
import { windowPad } from './viewport.mjs';

const root = process.cwd();
const out = path.join(root, 'build', '_science-background-preview');
await mkdir(out, { recursive: true });
const built = path.join(root, 'build/class-6/ch02-diversity-in-the-living-world-v2.html');
const full = await readFile(built, 'utf8');
const sections = full.match(/<section class="page[\s\S]*?<\/section>/g);
const head = full.slice(0, full.indexOf('</head>')).replace('<head>', `<head><base href="${pathToFileURL(built).href}">`);
const motif = sections[0].match(/<g class="chapter-opener__motif"[\s\S]*?<\/g>/)[0]
  .replaceAll('chapter-opener__', 'sample-');
const css = `
body {background:white} .spread {padding:0;gap:0} .page {box-shadow:none}
.sample-leaves {fill:var(--v2-forest)}
.sample-stem {fill:none;stroke:var(--v2-forest);stroke-width:2}
.sample-veins {fill:none;stroke:white;stroke-width:1.2}
.sample-dots {fill:var(--v2-forest);opacity:.09}
.sample-foliage {opacity:.13}
.page--opener .sample-foliage {opacity:.18}
.chapter-opener__band,.chapter-opener__edge,.chapter-opener__motif {display:none}
.chapter-opener .chapter-opener__title,.chapter-opener .chapter-opener__number,.chapter-opener .chapter-opener__label {fill:var(--v2-forest)}
.chapter-opener .chapter-opener__divider {stroke:var(--v2-forest);opacity:.5}
`;
function decorate(section, index) {
  const opener = index === 0;
  const mirror = index % 2 ? 'translate(1052 0) scale(-1 1)' : '';
  let dots = '';
  for (let x=0;x<3;x++) for(let y=0;y<5;y++) dots += `<circle cx="${1001+x*20}" cy="${1310+y*20}" r="3.5"/>`;
  const decoration = `<defs><clipPath id="sample-margin-${index}"><path d="M0 0H1052V1514H0Z M${opener?78:72} 300V1430H${opener?974:980}V300Z" clip-rule="evenodd"/></clipPath></defs>
  <g aria-hidden="true" clip-path="url(#sample-margin-${index})">
    <g transform="${mirror}">
      <g class="sample-foliage" transform="translate(565 145) scale(.5)">${motif}</g>
      <g class="sample-foliage" transform="translate(-479 1030) scale(.54)">${motif}</g>
      <g class="sample-dots">${dots}</g>
    </g>
  </g>`;
  return section.replace(/(<svg class="food-sheet[^>]*>)/, '$1'+decoration);
}
const samples = sections.slice(0,3).map(decorate);
const html = content => `${head}<style>${css}</style></head><body><div class="spread">${content}</div></body></html>`;
await writeFile(path.join(out,'preview.html'), html(samples.join('\n')));
const sheet = await sheetMetrics(root,'science-tall');
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const run = promisify(execFile);
const pad = await windowPad(chrome);
const images=[];
for(let i=0;i<samples.length;i++) {
  const file=path.join(out,`p00${i+1}.html`), png=path.join(out,`p00${i+1}.png`);
  await writeFile(file,html(samples[i]));
  await run(chrome,['--headless=new','--disable-gpu','--hide-scrollbars','--force-device-scale-factor=2',`--window-size=${px(sheet.trimW)},${px(sheet.trimH)+pad}`,'--virtual-time-budget=5000',`--screenshot=${png}`,pathToFileURL(file).href],{maxBuffer:1<<24});
  const buffer=await sharp(png).extract({left:0,top:0,width:px(sheet.trimW)*2,height:px(sheet.trimH)*2}).png().toBuffer();
  await writeFile(png,buffer); images.push(buffer);
}
const w=px(sheet.trimW)*2,h=px(sheet.trimH)*2;
await sharp({create:{width:w*2+24,height:h,channels:3,background:'#e5e7e4'}}).composite([{input:images[1],left:0,top:0},{input:images[2],left:w+24,top:0}]).png().toFile(path.join(out,'inside-spread.png'));
console.log(out);
