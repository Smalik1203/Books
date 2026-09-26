#!/usr/bin/env node
/* Render one narrated video from a scene file.

     node video/render.mjs video/scenes/class-6/ch01-patterns/ex1.mjs
     node video/render.mjs <scene> --still=3,12.5   PNG frames at those seconds, no film
     node video/render.mjs <scene> --html           the page and its narration only
     node video/render.mjs <scene-dir>              every scene in a directory

   What happens, in order:
     1. each beat's narration is spoken by edge-tts and cached by its
        words, so re-rendering after a visual change costs no speech;
     2. the beats are laid end to end by their spoken length, and every
        action's start is worked out from the beat it belongs to — the
        picture waits for the voice, never the other way round;
     3. the scene is written out as one page in the book's colours,
        with its maths set by KaTeX exactly as the book sets it;
     4. headless Chrome seeks that page to every frame and hands the
        frames to ffmpeg, which lays the narration under them.

   The chapter's colour is read from its own palette file, so a scene
   for Chapter 7 comes out in Chapter 7's colour without saying so. */

import { spawn, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ffmpegPath from 'ffmpeg-static';
import puppeteer from 'puppeteer-core';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, '..');
const katex = createRequire(join(ROOT, 'package.json'))('katex');

const FPS = 30;
const W = 1920, H = 1080;
const VOICE = { voice: 'en-IN-NeerjaExpressiveNeural', rate: '+0%', pitch: '+0Hz' };
const CHROME = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
].find(existsSync);

const args = process.argv.slice(2);
const flag = (name) => args.find((a) => a.startsWith(`--${name}`))?.split('=')[1] ?? (args.includes(`--${name}`) ? true : undefined);

/* ---- speech ---------------------------------------------------- */

const CACHE = join(HERE, '.cache');
mkdirSync(CACHE, { recursive: true });

/* How long the voice actually speaks. edge-tts leaves nearly a second
   of silence at the end of every clip; timed by the file, a film of
   twelve beats carries ten seconds of dead air between its sentences.
   So the clip is timed to where its trailing silence starts. */
function duration(file) {
  const r = spawnSync(ffmpegPath, ['-hide_banner', '-i', file, '-af', 'silencedetect=n=-45dB:d=0.25', '-f', 'null', '-'], { encoding: 'utf8' });
  const m = /Duration: (\d+):(\d+):([\d.]+)/.exec(r.stderr);
  if (!m) throw new Error(`no duration for ${file}`);
  const full = +m[1] * 3600 + +m[2] * 60 + +m[3];
  const starts = [...r.stderr.matchAll(/silence_start: ([\d.]+)/g)].map((x) => +x[1]);
  const ends = [...r.stderr.matchAll(/silence_end: ([\d.]+)/g)].map((x) => +x[1]);
  const tail = starts.at(-1);
  const endAfter = ends.find((e) => e > tail);
  const trailing = tail !== undefined && tail > full - 2 && (endAfter === undefined || endAfter >= full - 0.1);
  return trailing ? +(tail + 0.12).toFixed(3) : full;
}

function speak(text, voice) {
  const v = { ...VOICE, ...voice };
  const key = createHash('sha1').update(`${v.voice}|${v.rate}|${v.pitch}|${text}`).digest('hex').slice(0, 16);
  const file = join(CACHE, `${key}.mp3`);
  if (!existsSync(file)) {
    const r = spawnSync('python', ['-m', 'edge_tts', '--voice', v.voice, `--rate=${v.rate}`, `--pitch=${v.pitch}`,
      '--text', text, '--write-media', file], { encoding: 'utf8' });
    if (r.status !== 0 || !existsSync(file)) throw new Error(`edge-tts failed on "${text.slice(0, 40)}…"\n${r.stderr}`);
  }
  return { file, dur: duration(file) };
}

/* ---- maths ----------------------------------------------------- */

/* A scene's markup is written with String.raw, so `\times` survives.
   If it was not, `\t` arrives as a tab — the same failure CLAUDE.md
   warns about for pages — and this says so rather than setting a
   blank where the times sign should be. */
function setMaths(html) {
  return html.replace(/\$([^$]+)\$/g, (_, tex) => {
    if (/[\t\f\v\b]/.test(tex)) throw new Error(`collapsed escape in $${JSON.stringify(tex)}$ — write the markup with String.raw`);
    return katex.renderToString(tex, { throwOnError: true, output: 'html' });
  });
}

/* ---- the chapter ----------------------------------------------- */

function chapter(source) {
  const dir = join(ROOT, 'pages', source);
  const meta = JSON.parse(readFileSync(join(dir, 'chapter.json'), 'utf8'));
  const colours = {};
  if (meta.palette) {
    const css = readFileSync(join(ROOT, 'css', `palette-${meta.palette}.css`), 'utf8');
    for (const [, name, hex] of css.matchAll(/--teal(-deep|-soft|-tint)?:\s*(#[0-9a-f]{3,8})/gi)) colours[name || ''] ??= hex;
  }
  return { meta, colours };
}

/* ---- timeline -------------------------------------------------- */

/* An action is written ['kind', 'selector', {options}]. `at` is when it
   starts inside its beat: seconds, a share of the narration ('60%'),
   or 'end' with an optional offset ('end-0.4'). */
function at(v, d) {
  if (v === undefined) return 0;
  if (typeof v === 'number') return v;
  const pct = /^([\d.]+)%$/.exec(v);
  if (pct) return (d * +pct[1]) / 100;
  const end = /^end([+-][\d.]+)?$/.exec(v);
  if (end) return d + (end[1] ? +end[1] : 0);
  throw new Error(`cannot read at: ${v}`);
}

function timeline(scene) {
  let cursor = scene.lead ?? 0.8;
  const actions = [], clips = [], captions = [], beats = [];
  for (const [i, beat] of scene.beats.entries()) {
    const clip = beat.say ? speak(beat.say, scene.voice) : null;
    const d = clip ? clip.dur : beat.hold ?? 1;
    if (clip) {
      clips.push({ file: clip.file, start: cursor });
      captions.push({ start: cursor, end: cursor + d, text: beat.say });
    }
    for (const [a, s, o = {}] of beat.do ?? []) {
      actions.push({ a, s, ...o, start: +(cursor + at(o.at, d)).toFixed(3), beat: i });
    }
    beats.push({ i, start: cursor, dur: d, say: beat.say ?? '' });
    cursor += d + (clip ? beat.hold ?? 0 : 0) + (beat.pause ?? 0.45);
  }
  /* A beat that animates past its narration says so with `hold`; the
     film ends a moment after the last beat, not after a guess. */
  const total = +(cursor + (scene.tail ?? 1.2)).toFixed(3);
  return { actions, clips, captions, beats, total };
}

/* ---- page ------------------------------------------------------ */

const RIBBON = '<svg class="rh__ribbon" viewBox="0 0 340 63" preserveAspectRatio="xMinYMin meet" aria-hidden="true">'
  + '<path class="rh__underlay" d="M-40 -40H340V0L317 51Q312 63 291 63H-40Z"/>'
  + '<path class="rh__fill" d="M-40 -40H321V0L300 49Q295 63 274 63H-40Z"/>'
  + '<g class="rh__motif"><path d="M30 13v14M23 20h14M43 20h14M25 36l10 10M35 36l-10 10M43 41h14"/>'
  + '<circle cx="50" cy="35.5" r="1.7"/><circle cx="50" cy="46.5" r="1.7"/></g></svg>';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const url = (p) => pathToFileURL(p).href;

function page(scene, ch, tl) {
  const c = ch.colours;
  const vars = [c[''] && `--ch:${c['']}`, c['-deep'] && `--ch-deep:${c['-deep']}`, c['-soft'] && `--ch-soft:${c['-soft']}`, c['-tint'] && `--ch-tint:${c['-tint']}`]
    .filter(Boolean).join(';');
  const subject = (ch.meta.subject || 'Mathematics').replace(/\s+(I{1,3}|IV)$/, '');
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(scene.title)}</title>
<link rel="stylesheet" href="${url(join(ROOT, 'node_modules/katex/dist/katex.min.css'))}">
<link rel="stylesheet" href="${url(join(HERE, 'stage/stage.css'))}">
<style>${scene.css ?? ''}</style>
</head><body>
<div class="frame" style="${vars}">
  <header class="rh">${RIBBON}<span class="rh__tab">Chapter ${esc(ch.meta.number)}</span>
    <span class="rh__title">${esc(ch.meta.title)}</span><span class="rh__rule"></span></header>
  <main class="scene">${setMaths(scene.html)}</main>
  <footer class="pf"><span><b>ClassBridge</b> · ${esc(subject)} ${esc(ch.meta.class)}</span><span>${esc(scene.footer ?? '')}</span></footer>
</div>
<audio src="narration.m4a" preload="auto"></audio>
<script>window.TIMELINE = ${JSON.stringify(tl.actions)}; window.DURATION = ${tl.total};</script>
<script src="${url(join(HERE, 'stage/stage.js'))}"></script>
</body></html>`;
}

/* ---- audio ----------------------------------------------------- */

function mixNarration(tl, out) {
  const inputs = tl.clips.flatMap((c) => ['-i', c.file]);
  const legs = tl.clips.map((c, i) => `[${i}:a]aresample=48000,adelay=${Math.round(c.start * 1000)}:all=1[a${i}]`);
  const mix = `${tl.clips.map((_, i) => `[a${i}]`).join('')}amix=inputs=${tl.clips.length}:normalize=0:dropout_transition=0,apad[out]`;
  const r = spawnSync(ffmpegPath, ['-y', '-hide_banner', '-loglevel', 'error', ...inputs,
    '-filter_complex', [...legs, mix].join(';'), '-map', '[out]', '-t', String(tl.total),
    '-c:a', 'aac', '-b:a', '160k', out], { encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`narration mix failed\n${r.stderr}`);
}

function srt(tl) {
  const ts = (t) => {
    const ms = Math.round(t * 1000);
    const p = (n, w = 2) => String(n).padStart(w, '0');
    return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`;
  };
  return tl.captions.map((c, i) => `${i + 1}\n${ts(c.start)} --> ${ts(c.end)}\n${c.text}\n`).join('\n');
}

/* ---- frames ---------------------------------------------------- */

async function withPage(html, fn) {
  if (!CHROME) throw new Error('No Chrome or Edge found.');
  const browser = await puppeteer.launch({
    executablePath: CHROME, headless: true,
    args: ['--hide-scrollbars', '--force-color-profile=srgb', '--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
    const warnings = [];
    page.on('console', (m) => { if (m.type() === 'warning' || m.type() === 'error') warnings.push(m.text()); });
    await page.goto(url(html), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    if (warnings.length) console.warn('  page says:\n   ' + warnings.join('\n   '));
    return await fn(page);
  } finally {
    await browser.close();
  }
}

async function film(html, audio, total, out) {
  const frames = Math.ceil(total * FPS);
  const ff = spawn(ffmpegPath, ['-y', '-hide_banner', '-loglevel', 'error',
    '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-i', audio, '-map', '0:v', '-map', '1:a',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS),
    '-c:a', 'aac', '-b:a', '160k', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  const done = new Promise((ok, no) => ff.on('close', (code) => (code === 0 ? ok() : no(new Error(`ffmpeg exited ${code}`)))));
  await withPage(html, async (page) => {
    const t0 = Date.now();
    for (let f = 0; f < frames; f++) {
      await page.evaluate((t) => window.seek(t), f / FPS);
      const jpg = await page.screenshot({ type: 'jpeg', quality: 93, optimizeForSpeed: true });
      if (!ff.stdin.write(jpg)) await new Promise((r) => ff.stdin.once('drain', r));
      if (f % 150 === 0) process.stdout.write(`\r  frame ${f}/${frames}  ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    process.stdout.write(`\r  frame ${frames}/${frames}  ${((Date.now() - t0) / 1000).toFixed(0)}s\n`);
  });
  ff.stdin.end();
  await done;
}

async function stills(html, times, dir) {
  await withPage(html, async (page) => {
    for (const t of times) {
      await page.evaluate((x) => window.seek(x), t);
      const file = join(dir, `still-${String(t).replace('.', '_')}s.png`);
      await page.screenshot({ path: file });
      console.log(`  ${file}`);
    }
  });
}

/* ---- one scene ------------------------------------------------- */

async function render(sceneFile) {
  const scene = (await import(url(resolve(sceneFile)) + `?t=${Date.now()}`)).default;
  const ch = chapter(scene.source);
  const outDir = join(HERE, 'out', scene.source);
  const work = join(outDir, scene.id);
  mkdirSync(work, { recursive: true });

  console.log(`${scene.id}: ${scene.title}`);
  const tl = timeline(scene);
  const html = join(work, 'index.html');
  writeFileSync(html, page(scene, ch, tl));
  writeFileSync(join(work, 'beats.json'), JSON.stringify(tl.beats, null, 1));
  const audio = join(work, 'narration.m4a');
  mixNarration(tl, audio);
  writeFileSync(join(outDir, `${scene.id}.srt`), srt(tl));
  console.log(`  ${tl.beats.length} beats, ${tl.actions.length} actions, ${tl.total.toFixed(1)}s`);

  const still = flag('still');
  if (still) return stills(html, String(still).split(',').map(Number), work);
  if (flag('html')) return console.log(`  ${url(html)}#play`);

  const mp4 = join(outDir, `${scene.id}.mp4`);
  await film(html, audio, tl.total, mp4);
  console.log(`  -> ${mp4}`);
}

const target = args.find((a) => !a.startsWith('--'));
if (!target) { console.error('usage: node video/render.mjs <scene.mjs | scene-dir> [--still=t,t] [--html]'); process.exit(1); }
const files = statSync(target).isDirectory()
  ? readdirSync(target).filter((f) => f.endsWith('.mjs')).sort().map((f) => join(target, f))
  : [target];
for (const f of files) await render(f);
