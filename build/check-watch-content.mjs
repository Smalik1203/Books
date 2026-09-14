import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, utimes, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { contentWatcher } from './watch-content.mjs';
import vm from 'node:vm';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';

test('reads, timestamp changes and identical saves do not rebuild; edits do', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'studio-watch-'));
  try {
    await mkdir(path.join(root, 'pages'));
    const file = path.join(root, 'pages', 'p001.html');
    await writeFile(file, '<p>Original</p>');
    const changed = await contentWatcher(root, ['pages']);
    await readFile(file);
    assert.equal(await changed('pages', 'p001.html'), false);
    await utimes(file, new Date(), new Date());
    assert.equal(await changed('pages', 'p001.html'), false);
    await writeFile(file, '<p>Original</p>');
    assert.equal(await changed('pages', 'p001.html'), false);
    await writeFile(file, '<p>Edited</p>');
    assert.equal(await changed('pages', 'p001.html'), true);
    assert.equal(await changed('pages', 'p001.html'), false);
    await rm(file);
    assert.equal(await changed('pages', 'p001.html'), true);
    assert.equal(await changed('pages', 'p001.html'), false);
    await writeFile(file, '<p>New</p>');
    assert.equal(await changed('pages', 'p001.html'), true);
  } finally {
    // mkdtemp returns this test's own absolute directory under tmpdir.
    assert.ok(path.resolve(root).startsWith(path.resolve(tmpdir()) + path.sep));
    await rm(root, { recursive: true, force: true });
  }
});

test('reload client ignores reconnects to the same server but follows restarts', async () => {
  const src = await readFile(new URL('./serve.mjs', import.meta.url), 'utf8');
  const client = src.match(/const RELOAD = `\s*<script>([\s\S]*?)<\/script>`;/)[1];
  let connection, reloads = 0, pagehide;
  class EventSource {
    constructor() { connection = this; this.handlers = {}; }
    addEventListener(name, fn) { this.handlers[name] = fn; }
    close() { this.closed = true; }
  }
  vm.runInNewContext(client, { EventSource, location: { reload() { reloads++; } },
    window: { addEventListener(name, fn) { if (name === 'pagehide') pagehide = fn; } } });
  connection.handlers.studio({ data: 'server-a' });
  connection.handlers.studio({ data: 'server-a' });
  assert.equal(reloads, 0);
  connection.handlers.studio({ data: 'server-b' });
  assert.equal(reloads, 1);
  connection.onmessage();
  assert.equal(reloads, 2);
  pagehide();
  assert.equal(connection.closed, true);
});

test('studio startup and browsing the library do not trigger builds or reloads', async () => {
  const probe = createServer();
  await new Promise(resolve => probe.listen(0, '127.0.0.1', resolve));
  const port = probe.address().port;
  await new Promise(resolve => probe.close(resolve));
  const child = spawn(process.execPath, ['build/serve.mjs'], {
    env: { ...process.env, PORT: String(port), NO_WATCH: '1' }, stdio: ['ignore','pipe','pipe'],
  });
  let output = '';
  child.stdout.on('data', value => { output += value; });
  child.stderr.on('data', value => { output += value; });
  const abort = new AbortController();
  try {
    const base = 'http://127.0.0.1:' + port;
    let ready = false;
    for (let i=0;i<50&&!ready;i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      ready = await fetch(base).then(r => r.ok).catch(() => false);
    }
    assert.equal(ready,true,'studio starts');
    const stream = await fetch(base+'/__reload', { signal: abort.signal });
    const reader = stream.body.getReader();
    let events = '';
    const reading = (async () => {
      try { while(true) { const {value,done}=await reader.read(); if(done)break; events+=new TextDecoder().decode(value); } }
      catch(error) { if(error.name!=='AbortError')throw error; }
    })();
    for(let i=0;i<5;i++)await fetch(base).then(r=>r.text());
    await new Promise(resolve=>setTimeout(resolve,2000));
    abort.abort(); await reading;
    assert.match(events,/event: studio/);
    assert.doesNotMatch(events,/data: reload/);
    assert.doesNotMatch(output,/Building \d/);
  } finally { abort.abort(); child.kill(); }
});
